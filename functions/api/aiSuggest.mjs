import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { getFirestore } from "firebase-admin/firestore";
import OpenAI from "openai";
import crypto from "crypto";

const openaiKey = defineSecret("OPENAI_API_KEY");

// Generate hash of challenge data for caching
function generateChallengeHash(challenges) {
    // Create a stable string representation of the challenge data
    const challengeData = challenges.map(chal => {
        const obj = Array.isArray(chal.objectives) && chal.objectives.length > 0 ? chal.objectives[0] : {};
        return {
            name: chal.name,
            description: chal.description,
            progress: obj.progress ?? 0,
            goal: obj.completionValue ?? 1,
            seasonHash: chal.seasonHash
        };
    }).sort((a, b) => a.name.localeCompare(b.name)); // Sort for consistency

    const dataString = JSON.stringify(challengeData);
    return crypto.createHash('sha256').update(dataString).digest('hex');
}

// Get cached AI suggestion
async function getCachedSuggestion(userId, hash) {
    try {
        // Path: users/{userId}/destiny/ai_suggestions/suggestions/{hash}
        const cachedRef = getFirestore().doc(`users/${userId}/destiny/ai_suggestions/suggestions/${hash}`);
        const cachedDoc = await cachedRef.get();

        if (!cachedDoc.exists) {
            return null;
        }

        const cached = cachedDoc.data();

        // Check if cache is still fresh (24 hours)
        const age = Date.now() - cached.createdAt;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (age > maxAge) {
            console.log(`[getCachedSuggestion] Cache expired for hash ${hash}`);
            return null;
        }

        console.log(`[getCachedSuggestion] Using cached suggestion for hash ${hash}`);
        return cached;
    } catch (err) {
        console.error(`[getCachedSuggestion] Error:`, err);
        return null;
    }
}

// Update user's usage statistics
async function updateUsageStats(userId, tokenUsage, cached = false) {
    try {
        // Path: users/{userId}/destiny/ai_suggestions
        const statsRef = getFirestore().doc(`users/${userId}/destiny/ai_suggestions`);

        const updateData = {
            totalCalls: getFirestore().FieldValue.increment(1),
            lastCallAt: Date.now(),
            updatedAt: Date.now()
        };

        if (cached) {
            updateData.cachedCalls = getFirestore().FieldValue.increment(1);
        } else {
            updateData.freshCalls = getFirestore().FieldValue.increment(1);
            if (tokenUsage) {
                // Track prompt and completion tokens separately for accurate costing
                updateData.totalTokens = getFirestore().FieldValue.increment(tokenUsage.total || 0);
                updateData.promptTokens = getFirestore().FieldValue.increment(tokenUsage.prompt || 0);
                updateData.completionTokens = getFirestore().FieldValue.increment(tokenUsage.completion || 0);
            }
        }

        await statsRef.set(updateData, { merge: true });
        console.log(`[updateUsageStats] Updated user stats - cached: ${cached}, tokens: ${JSON.stringify(tokenUsage || {})}`);
    } catch (err) {
        console.error(`[updateUsageStats] Error:`, err);
        // Don't throw - stats failure shouldn't break the main flow
    }
}

// Update global usage statistics
async function updateGlobalStats(userId, challengeCount, tokenUsage, cached = false, error = false) {
    try {
        const batch = getFirestore().batch();

        // Main global stats document
        const globalRef = getFirestore().doc('destiny/global');
        const globalUpdate = {
            'ai_stats.totalCalls': getFirestore().FieldValue.increment(1),
            'ai_stats.lastCallAt': Date.now(),
            'ai_stats.updatedAt': Date.now()
        };

        if (cached) {
            globalUpdate['ai_stats.cachedCalls'] = getFirestore().FieldValue.increment(1);
            globalUpdate['ai_stats.tokensSaved'] = getFirestore().FieldValue.increment(tokenUsage?.total || 0);
        } else {
            globalUpdate['ai_stats.freshCalls'] = getFirestore().FieldValue.increment(1);
            if (tokenUsage) {
                globalUpdate['ai_stats.totalTokens'] = getFirestore().FieldValue.increment(tokenUsage.total || 0);
                globalUpdate['ai_stats.promptTokens'] = getFirestore().FieldValue.increment(tokenUsage.prompt || 0);
                globalUpdate['ai_stats.completionTokens'] = getFirestore().FieldValue.increment(tokenUsage.completion || 0);
            }
        }

        if (error) {
            globalUpdate['ai_stats.errorCalls'] = getFirestore().FieldValue.increment(1);
        } else {
            globalUpdate['ai_stats.successfulCalls'] = getFirestore().FieldValue.increment(1);
            globalUpdate['ai_stats.totalChallengesProcessed'] = getFirestore().FieldValue.increment(challengeCount);
        }

        batch.set(globalRef, globalUpdate, { merge: true });

        // Track unique users
        const userRef = getFirestore().doc(`destiny/global/ai_users/${userId}`);
        batch.set(userRef, {
            lastUsed: Date.now(),
            totalCalls: getFirestore().FieldValue.increment(1),
            totalTokens: getFirestore().FieldValue.increment(tokenUsage?.total || 0)
        }, { merge: true });

        // Daily stats tracking
        const today = new Date().toISOString().split('T')[0];
        const dailyRef = getFirestore().doc(`destiny/global/ai_daily_stats/${today}`);
        const dailyUpdate = {
            date: today,
            calls: getFirestore().FieldValue.increment(1),
            uniqueUsers: getFirestore().FieldValue.arrayUnion(userId),
            updatedAt: Date.now()
        };

        if (cached) {
            dailyUpdate.cachedCalls = getFirestore().FieldValue.increment(1);
        } else {
            dailyUpdate.freshCalls = getFirestore().FieldValue.increment(1);
            if (tokenUsage) {
                dailyUpdate.totalTokens = getFirestore().FieldValue.increment(tokenUsage.total || 0);
                dailyUpdate.promptTokens = getFirestore().FieldValue.increment(tokenUsage.prompt || 0);
                dailyUpdate.completionTokens = getFirestore().FieldValue.increment(tokenUsage.completion || 0);
            }
        }

        batch.set(dailyRef, dailyUpdate, { merge: true });

        await batch.commit();
        console.log(`[updateGlobalStats] Updated global stats`);
    } catch (err) {
        console.error(`[updateGlobalStats] Error:`, err);
        // Don't throw - stats failure shouldn't break the main flow
    }
}

// Save AI suggestion to cache
async function cacheSuggestion(userId, hash, challenges, suggestion, seasonHash, tokenUsage, suggestedActivity) {
    try {
        // Path: users/{userId}/destiny/ai_suggestions/suggestions/{hash}
        const cachedRef = getFirestore().doc(`users/${userId}/destiny/ai_suggestions/suggestions/${hash}`);

        const cacheData = {
            hash,
            challenges: challenges.map(c => ({
                name: c.name,
                description: c.description,
                objectives: c.objectives,
                seasonHash: c.seasonHash
            })),
            suggestion,
            seasonHash,
            tokenUsage: {
                total: tokenUsage?.total || 0,
                prompt: tokenUsage?.prompt || 0,
                completion: tokenUsage?.completion || 0
            },
            challengeCount: challenges.length,
            suggestedActivity: suggestedActivity || null,
            createdAt: Date.now(),
            usedAt: Date.now(),
            usageCount: 1
        };

        await cachedRef.set(cacheData);
        console.log(`[cacheSuggestion] Cached AI suggestion with hash ${hash}`);
    } catch (err) {
        console.error(`[cacheSuggestion] Error:`, err);
        // Don't throw - caching failure shouldn't break the main flow
    }
}

// Update cache usage when retrieving from cache
async function updateCacheUsage(userId, hash) {
    try {
        // Path: users/{userId}/destiny/ai_suggestions/suggestions/{hash}
        const cachedRef = getFirestore().doc(`users/${userId}/destiny/ai_suggestions/suggestions/${hash}`);
        await cachedRef.update({
            usedAt: Date.now(),
            usageCount: getFirestore().FieldValue.increment(1)
        });
    } catch (err) {
        console.error(`[updateCacheUsage] Error:`, err);
    }
}

// Initialize AI suggestions document if it doesn't exist
async function initializeAISuggestionsDoc(userId) {
    try {
        const statsRef = getFirestore().doc(`users/${userId}/destiny/ai_suggestions`);
        const statsDoc = await statsRef.get();

        if (!statsDoc.exists) {
            const initialData = {
                totalCalls: 0,
                freshCalls: 0,
                cachedCalls: 0,
                totalTokens: 0,
                promptTokens: 0,
                completionTokens: 0,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                lastCallAt: null
            };

            await statsRef.set(initialData);
            console.log(`[initializeAISuggestionsDoc] Created AI suggestions document for user ${userId}`);
        }
    } catch (err) {
        console.error(`[initializeAISuggestionsDoc] Error:`, err);
        // Don't throw - initialization failure shouldn't break the main flow
    }
}

// Extract suggested activity from AI response
function extractSuggestedActivity(aiPlan) {
    try {
        // Look for pattern "Next you should run: [Activity]"
        const match = aiPlan.match(/Next you should run:\s*\n?\s*\[?([^\]\n]+)\]?/i);
        if (match && match[1]) {
            return match[1].trim();
        }
        return null;
    } catch (err) {
        console.error(`[extractSuggestedActivity] Error:`, err);
        return null;
    }
}

export const aiSuggest = onRequest({
    region: "australia-southeast1",
    secrets: [openaiKey]
}, async (req, res) => {
    const fail = (status, message, detail = {}) => {
        console.error(`[aiSuggest][FAIL] ${message}`, detail);
        return res.status(status).json({ error: message, ...detail });
    };

    // --- 1. Auth ---
    let userId;
    try {
        const authHeader = req.headers.authorization || '';
        const match = authHeader.match(/^Bearer (.+)$/);
        if (!match) return fail(401, 'No Authorization header');
        const idToken = match[1];
        const { getAuth } = await import('firebase-admin/auth');
        const decoded = await getAuth().verifyIdToken(idToken);
        userId = decoded.uid;
    } catch (err) {
        return fail(401, "Invalid Firebase token", { errorDetail: err?.message });
    }

    // --- 2. Initialize AI suggestions document ---
    await initializeAISuggestionsDoc(userId);

    // --- 3. Validate Input ---
    const { challenges } = req.body || {};
    if (!Array.isArray(challenges) || challenges.length === 0) {
        await updateUsageStats(userId, null, false);
        await updateGlobalStats(userId, 0, null, false, false);
        return res.json({ plan: "No challenge data found." });
    }

    // --- 4. Filter and Process Challenges ---
    const pending = challenges.filter(chal => {
        // Skip if already marked as completed
        if (chal.completed) {
            return false;
        }

        // Check objectives for more detailed progress
        if (chal.objectives && Array.isArray(chal.objectives) && chal.objectives.length > 0) {
            const obj = chal.objectives[0]; // Use first objective for primary progress
            const progress = Number(obj.progress) || 0;
            const completionValue = Number(obj.completionValue) || 1;

            // Challenge is incomplete if progress < completion value AND not marked complete
            return progress < completionValue && !obj.complete;
        }

        // If no objectives, trust the completed flag (should be false to get here)
        return !chal.completed;
    });

    console.log(`[aiSuggest] Filtered ${challenges.length} challenges down to ${pending.length} incomplete ones`);

    if (!pending.length) {
        await updateUsageStats(userId, null, false);
        await updateGlobalStats(userId, 0, null, false, false);
        return res.json({ plan: "You've completed all seasonal challenges. Go touch grass!" });
    }

    // --- 5. Generate Hash and Check Cache ---
    const challengeHash = generateChallengeHash(pending);
    console.log(`[aiSuggest] Generated hash: ${challengeHash} for ${pending.length} pending challenges`);

    try {
        const cached = await getCachedSuggestion(userId, challengeHash);
        if (cached) {
            // Update cache usage and stats
            updateCacheUsage(userId, challengeHash).catch(err => {
                console.error("Failed to update cache usage:", err);
            });

            const cachedTokenUsage = cached.tokenUsage || { total: 0, prompt: 0, completion: 0 };
            await updateUsageStats(userId, null, true);
            await updateGlobalStats(userId, cached.challengeCount, cachedTokenUsage, true, false);

            return res.json({
                plan: cached.suggestion,
                cached: true,
                cachedAt: cached.createdAt,
                challengeCount: cached.challengeCount,
                tokenUsage: cachedTokenUsage
            });
        }
    } catch (err) {
        console.error("Cache check failed, proceeding with fresh request:", err);
    }

    // --- 6. Prepare Data for OpenAI ---
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

    // --- 7. OpenAI Request ---
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
            content: `Here are my current Destiny 2 seasonal challenges:\n${JSON.stringify(trimmed, null, 2)}`
        }
    ];

    const openai = new OpenAI({ apiKey: openaiKey.value() });

    try {
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

        console.log(`[aiSuggest] Received AI response: ${aiPlan.substring(0, 100)}... (${tokenUsage.total} tokens)`);

        // Extract suggested activity from response
        const suggestedActivity = extractSuggestedActivity(aiPlan);

        // --- 8. Cache the Response and Update Stats ---
        const seasonHash = pending.length > 0 ? pending[0].seasonHash : null;

        // Cache the suggestion
        cacheSuggestion(userId, challengeHash, pending, aiPlan, seasonHash, tokenUsage, suggestedActivity).catch(err => {
            console.error("Failed to cache AI suggestion:", err);
        });

        // Update usage stats
        await updateUsageStats(userId, tokenUsage, false);
        await updateGlobalStats(userId, pending.length, tokenUsage, false, false);

        return res.json({
            plan: aiPlan,
            cached: false,
            challengeCount: pending.length,
            tokenUsage: tokenUsage
        });

    } catch (e) {
        console.error(`[aiSuggest] OpenAI error:`, e);
        await updateUsageStats(userId, null, false); // Track failed calls too
        await updateGlobalStats(userId, pending.length, null, false, true); // Track as error
        return fail(500, "Failed to generate suggestion", {
            errorDetail: e.message,
            challengeCount: pending.length
        });
    }
});