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
        const cachedRef = getFirestore().doc(`users/${userId}/destiny/ai_suggestions/${hash}`);
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

// Save AI suggestion to cache
async function cacheSuggestion(userId, hash, challenges, suggestion, seasonHash) {
    try {
        const cachedRef = getFirestore().doc(`users/${userId}/destiny/ai_suggestions/${hash}`);

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
            createdAt: Date.now(),
            usedAt: Date.now()
        };

        await cachedRef.set(cacheData);
        console.log(`[cacheSuggestion] Cached AI suggestion with hash ${hash}`);
    } catch (err) {
        console.error(`[cacheSuggestion] Error:`, err);
        // Don't throw - caching failure shouldn't break the main flow
    }
}

// Update cache usage timestamp
async function updateCacheUsage(userId, hash) {
    try {
        const cachedRef = getFirestore().doc(`users/${userId}/destiny/ai_suggestions/${hash}`);
        await cachedRef.update({
            usedAt: Date.now(),
            usageCount: getFirestore().FieldValue.increment(1)
        });
    } catch (err) {
        console.error(`[updateCacheUsage] Error:`, err);
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

    // --- 2. Validate Input ---
    const { challenges } = req.body || {};
    if (!Array.isArray(challenges) || challenges.length === 0) {
        return res.json({ plan: "No challenge data found." });
    }

    // --- 3. Filter and Process Challenges ---
    // Only use challenges that are actually incomplete
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
        return res.json({ plan: "You've completed all seasonal challenges. Go touch grass!" });
    }

    // --- 4. Generate Hash and Check Cache ---
    const challengeHash = generateChallengeHash(pending);
    console.log(`[aiSuggest] Generated hash: ${challengeHash} for ${pending.length} pending challenges`);

    try {
        const cached = await getCachedSuggestion(userId, challengeHash);
        if (cached) {
            // Update usage stats and return cached response
            updateCacheUsage(userId, challengeHash).catch(err => {
                console.error("Failed to update cache usage:", err);
            });

            return res.json({
                plan: cached.suggestion,
                cached: true,
                cachedAt: cached.createdAt
            });
        }
    } catch (err) {
        console.error("Cache check failed, proceeding with fresh request:", err);
    }

    // --- 5. Prepare Data for OpenAI ---
    // Data sent to GPT: name, description, progress/goal (first objective)
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

    // --- 6. OpenAI Request ---
    // Sexy, punchy prompt
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
            model: "gpt-4o", // or "gpt-4.1"
            messages: prompt,
            max_tokens: 420,
            temperature: 0.3
        });

        const aiPlan = gptRes.choices[0]?.message?.content?.trim() || "No suggestion generated.";

        console.log(`[aiSuggest] Received AI response: ${aiPlan.substring(0, 100)}...`);

        // --- 7. Cache the Response ---
        const seasonHash = pending.length > 0 ? pending[0].seasonHash : null;
        cacheSuggestion(userId, challengeHash, pending, aiPlan, seasonHash).catch(err => {
            console.error("Failed to cache AI suggestion:", err);
        });

        return res.json({
            plan: aiPlan,
            cached: false,
            challengeCount: pending.length
        });

    } catch (e) {
        console.error(`[aiSuggest] OpenAI error:`, e);
        return fail(500, "Failed to generate suggestion", {
            errorDetail: e.message,
            challengeCount: pending.length
        });
    }
});