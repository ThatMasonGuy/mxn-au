// aiSuggest.mjs (Optimized)
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { getDb, InfrastructureTracker, verifyAuthToken } from "./shared/utils.mjs";
import { StatsManager } from "./shared/statsManager.mjs";
import { CacheManager } from "./shared/cacheManager.mjs";
import OpenAI from "openai";

const openaiKey = defineSecret("OPENAI_API_KEY");

// Extract suggested activity from AI response
function extractSuggestedActivity(aiPlan) {
    try {
        const match = aiPlan.match(/Next you should run:\s*\n?\s*\[?([^\]\n]+)\]?/i);
        if (match && match[1]) {
            return match[1].trim();
        }
        return null;
    } catch (err) {
        console.error('[extractSuggestedActivity] Error:', err);
        return null;
    }
}

// Initialize AI suggestions document if needed
async function ensureAISuggestionsDoc(db, userId, tracker) {
    try {
        const statsRef = db.doc(`users/${userId}/destiny/ai_suggestions`);
        const statsDoc = await statsRef.get();
        tracker.trackRead(1, 'ai suggestions doc check');

        if (!statsDoc.exists) {
            const initialData = {
                totalCalls: 0,
                freshCalls: 0,
                cachedCalls: 0,
                successfulCalls: 0,
                errorCalls: 0,
                totalTokens: 0,
                promptTokens: 0,
                completionTokens: 0,
                tokensSaved: 0,
                totalCostUSD: 0,
                promptCostUSD: 0,
                completionCostUSD: 0,
                totalFirestoreReads: 0,
                totalFirestoreWrites: 0,
                totalExecutionTimeMs: 0,
                totalInfrastructureCostUSD: 0,
                totalFirestoreCostUSD: 0,
                totalComputeCostUSD: 0,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                lastCallAt: null
            };

            await statsRef.set(initialData);
            tracker.trackWrite(1, 'ai suggestions doc initialization');
            console.log(`[ensureAISuggestionsDoc] Created AI suggestions document for user ${userId}`);
        }
    } catch (err) {
        console.error('[ensureAISuggestionsDoc] Error:', err);
    }
}

export const aiSuggest = onRequest({
    region: "australia-southeast1",
    secrets: [openaiKey],
    maxInstances: 1,
}, async (req, res) => {
    const tracker = new InfrastructureTracker();
    const db = getDb();
    const cacheManager = new CacheManager(tracker);
    const statsManager = new StatsManager(tracker);

    let responseTime = 0;
    let error = false;

    const fail = (status, message, detail = {}) => {
        console.error(`[aiSuggest][FAIL] ${message}`, detail);
        error = true;
        responseTime = tracker.getExecutionTime();
        return res.status(status).json({ error: message, ...detail });
    };

    try {
        // 1. Authentication
        const decoded = await verifyAuthToken(req.headers.authorization);
        const userId = decoded.uid;

        // 2. Initialize AI suggestions document
        await ensureAISuggestionsDoc(db, userId, tracker);

        // 3. Validate input
        const { challenges } = req.body || {};
        if (!Array.isArray(challenges) || challenges.length === 0) {
            const infrastructureStats = tracker.calculateRealCosts();
            await statsManager.updateAIStats({
                userId,
                tokenUsage: null,
                cached: false,
                error: false,
                challengeCount: 0,
                responseTime: tracker.getExecutionTime(),
                infrastructureStats
            });
            return res.json({ plan: "No challenge data found." });
        }

        // 4. Filter active incomplete challenges
        const activeChallenges = challenges.filter(chal => chal.active === true);
        const pending = activeChallenges.filter(chal => {
            if (chal.completed) return false;

            if (chal.objectives && Array.isArray(chal.objectives) && chal.objectives.length > 0) {
                const obj = chal.objectives[0];
                const progress = Number(obj.progress) || 0;
                const completionValue = Number(obj.completionValue) || 1;
                return progress < completionValue && !obj.complete;
            }

            return !chal.completed;
        });

        console.log(`[aiSuggest] Filtered ${challenges.length} → ${activeChallenges.length} active → ${pending.length} incomplete`);

        if (!pending.length) {
            const infrastructureStats = tracker.calculateRealCosts();
            await statsManager.updateAIStats({
                userId,
                tokenUsage: null,
                cached: false,
                error: false,
                challengeCount: 0,
                responseTime: tracker.getExecutionTime(),
                infrastructureStats
            });

            if (activeChallenges.length === 0) {
                return res.json({ plan: "No active seasonal challenges available yet. Check back next week for new challenges!" });
            } else {
                return res.json({ plan: "You've completed all available seasonal challenges. Go touch grass!" });
            }
        }

        // 5. Check cache
        const challengeHash = cacheManager.generateChallengeHash(pending);
        console.log(`[aiSuggest] Generated hash: ${challengeHash} for ${pending.length} pending challenges`);

        const cached = await cacheManager.getCachedAISuggestion(userId, challengeHash);

        if (cached) {
            // Update cache usage
            await cacheManager.updateCacheUsage(userId, challengeHash);

            const cachedTokenUsage = cached.tokenUsage || { total: 0, prompt: 0, completion: 0 };
            responseTime = tracker.getExecutionTime();
            const infrastructureStats = tracker.calculateRealCosts();

            await statsManager.updateAIStats({
                userId,
                tokenUsage: cachedTokenUsage,
                cached: true,
                error: false,
                challengeCount: cached.challengeCount,
                suggestedActivity: cached.suggestedActivity,
                responseTime,
                infrastructureStats
            });

            return res.json({
                plan: cached.suggestion,
                cached: true,
                cachedAt: cached.createdAt,
                challengeCount: cached.challengeCount,
                tokenUsage: cachedTokenUsage,
                responseTime,
                infrastructureStats
            });
        }

        // 6. Prepare data for OpenAI
        const trimmed = pending.map(chal => {
            const obj = Array.isArray(chal.objectives) && chal.objectives.length > 0 ? chal.objectives[0] : {};
            return {
                name: chal.name,
                description: chal.description,
                progress: obj.progress ?? 0,
                goal: obj.completionValue ?? 1,
                progressLabel: `${obj.progress ?? 0}/${obj.completionValue ?? 1}`,
            };
        });

        // 7. OpenAI request
        const prompt = [
            {
                role: "system",
                content: `
You are a Destiny 2 challenge optimizer.
Your job is to maximize XP gains and minimize wasted effort.

Given a list of incomplete seasonal challenges (with names, descriptions, and progress), recommend the **single best next activity** to run, stacking as many objectives as possible at once.

Format your answer exactly like this (fill in with real data):

Next you should run:
[Activity] focusing on [weapon/subclass/other details]

Recommended loadout:
- Subclass: [suggested subclass]
- Kinetic: [weapon type(s)]
- Energy: [weapon type(s)]
- Heavy: [weapon type(s)]
- Other: [mods, gear, perks if relevant]

This will help complete [X] challenges at once:
- Challenge Name: [short description] (**[progress X/Y]**)
- Challenge Name: [short description] (**[progress X/Y]**)
...

Only suggest one "next step" per response, always maximizing challenge overlap. Be concise, formatted, and actionable. If there are no incomplete challenges, congratulate the user and make a funny or motivational remark.
`.trim()
            },
            {
                role: "user",
                content: `Here are my current active Destiny 2 seasonal challenges:\n${JSON.stringify(trimmed, null, 2)}`
            }
        ];

        const openai = new OpenAI({ apiKey: openaiKey.value() });

        console.log(`[aiSuggest] Making OpenAI request for ${trimmed.length} challenges`);

        const gptRes = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: prompt,
            max_tokens: 420,
            temperature: 0.3
        });

        const aiPlan = gptRes.choices[0]?.message?.content?.trim() || "No suggestion generated.";
        const tokenUsage = {
            total: gptRes.usage?.total_tokens || 0,
            prompt: gptRes.usage?.prompt_tokens || 0,
            completion: gptRes.usage?.completion_tokens || 0
        };

        responseTime = tracker.getExecutionTime();

        console.log(`[aiSuggest] Received AI response (${tokenUsage.total} tokens, ${responseTime}ms)`);

        // Extract suggested activity
        const suggestedActivity = extractSuggestedActivity(aiPlan);

        // 8. Cache the response
        const seasonHash = pending.length > 0 ? pending[0].seasonHash : null;
        await cacheManager.saveAISuggestion(
            userId,
            challengeHash,
            pending,
            aiPlan,
            seasonHash,
            tokenUsage,
            suggestedActivity
        );

        // 9. Update stats
        const infrastructureStats = tracker.calculateRealCosts();

        console.log(`[aiSuggest] Infrastructure stats:`, {
            reads: infrastructureStats.firestoreReads,
            writes: infrastructureStats.firestoreWrites,
            executionTime: infrastructureStats.executionTimeMs,
            costs: {
                firestore: infrastructureStats.firestoreCost,
                compute: infrastructureStats.computeCost,
                total: infrastructureStats.infrastructureCost
            }
        });

        await Promise.all([
            statsManager.updateAIStats({
                userId,
                tokenUsage,
                cached: false,
                error: false,
                challengeCount: pending.length,
                suggestedActivity,
                responseTime,
                infrastructureStats
            }),
            statsManager.calculatePerformanceMetrics()
        ]);

        return res.json({
            plan: aiPlan,
            cached: false,
            challengeCount: pending.length,
            activeChallengeCount: activeChallenges.length,
            totalChallengeCount: challenges.length,
            tokenUsage,
            responseTime,
            infrastructureStats
        });

    } catch (e) {
        console.error(`[aiSuggest] Error:`, e);
        responseTime = tracker.getExecutionTime();
        const infrastructureStats = tracker.calculateRealCosts();

        await statsManager.updateAIStats({
            userId: req.headers.authorization ? (await verifyAuthToken(req.headers.authorization)).uid : 'unknown',
            tokenUsage: null,
            cached: false,
            error: true,
            challengeCount: 0,
            responseTime,
            infrastructureStats
        });

        return fail(500, "Failed to generate suggestion", {
            errorDetail: e.message,
            responseTime,
            infrastructureStats
        });
    }
});