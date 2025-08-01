import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import OpenAI from "openai";
import crypto from "crypto";

const openaiKey = defineSecret("OPENAI_API_KEY");

// Track actual infrastructure usage during function execution
class InfrastructureTracker {
    constructor() {
        this.startTime = Date.now()
        this.firestoreReads = 0
        this.firestoreWrites = 0
        this.functionInvocations = 1 // This function call
        this.memoryUsed = process.memoryUsage()
    }

    trackRead(count = 1) {
        this.firestoreReads += count
    }

    trackWrite(count = 1) {
        this.firestoreWrites += count
    }

    trackBatchWrite(operations) {
        this.firestoreWrites += operations
    }

    getExecutionTime() {
        return Date.now() - this.startTime
    }

    calculateRealCosts() {
        const executionTimeMs = this.getExecutionTime()

        // Real Google Cloud pricing (as of 2024)
        const FIRESTORE_READ_COST = 0.0000006  // $0.06 per 100K
        const FIRESTORE_WRITE_COST = 0.0000018  // $0.18 per 100K
        const FUNCTION_INVOCATION_COST = 0.0000004  // $0.40 per 1M
        const FUNCTION_COMPUTE_COST_PER_100MS = 0.0000025  // $0.0000025 per 100ms at 256MB

        const firestoreCost = (this.firestoreReads * FIRESTORE_READ_COST) + (this.firestoreWrites * FIRESTORE_WRITE_COST)
        const invocationCost = this.functionInvocations * FUNCTION_INVOCATION_COST
        const computeTime100ms = Math.ceil(executionTimeMs / 100)
        const computeCost = computeTime100ms * FUNCTION_COMPUTE_COST_PER_100MS
        const infrastructureCost = firestoreCost + invocationCost + computeCost

        return {
            firestoreReads: this.firestoreReads,
            firestoreWrites: this.firestoreWrites,
            executionTimeMs,
            computeTime100ms,
            firestoreCost,
            invocationCost,
            computeCost,
            infrastructureCost
        }
    }
}

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

// Update user's usage statistics with real infrastructure tracking
async function updateUsageStats(userId, tokenUsage, cached = false, errorOccurred = false, infrastructureStats = null) {
    try {
        // Path: users/{userId}/destiny/ai_suggestions
        const statsRef = getFirestore().doc(`users/${userId}/destiny/ai_suggestions`);

        const updateData = {
            totalCalls: FieldValue.increment(1),
            lastCallAt: Date.now(),
            updatedAt: Date.now()
        };

        if (errorOccurred) {
            updateData.errorCalls = FieldValue.increment(1);
        } else {
            updateData.successfulCalls = FieldValue.increment(1);
        }

        if (cached) {
            updateData.cachedCalls = FieldValue.increment(1);
            updateData.tokensSaved = FieldValue.increment(tokenUsage?.total || 0);
        } else {
            updateData.freshCalls = FieldValue.increment(1);
            if (tokenUsage) {
                // Track prompt and completion tokens separately for accurate costing
                updateData.totalTokens = FieldValue.increment(tokenUsage.total || 0);
                updateData.promptTokens = FieldValue.increment(tokenUsage.prompt || 0);
                updateData.completionTokens = FieldValue.increment(tokenUsage.completion || 0);

                // Calculate costs (GPT-4o pricing as of 2024)
                const promptCost = (tokenUsage.prompt || 0) * 0.005 / 1000;
                const completionCost = (tokenUsage.completion || 0) * 0.015 / 1000;

                updateData.totalCostUSD = FieldValue.increment(promptCost + completionCost);
                updateData.promptCostUSD = FieldValue.increment(promptCost);
                updateData.completionCostUSD = FieldValue.increment(completionCost);
            }
        }

        // Track REAL infrastructure usage
        if (infrastructureStats) {
            updateData.totalFirestoreReads = FieldValue.increment(infrastructureStats.firestoreReads);
            updateData.totalFirestoreWrites = FieldValue.increment(infrastructureStats.firestoreWrites);
            updateData.totalExecutionTimeMs = FieldValue.increment(infrastructureStats.executionTimeMs);
            updateData.totalInfrastructureCostUSD = FieldValue.increment(infrastructureStats.infrastructureCost);
            updateData.totalFirestoreCostUSD = FieldValue.increment(infrastructureStats.firestoreCost);
            updateData.totalComputeCostUSD = FieldValue.increment(infrastructureStats.computeCost);
        }

        await statsRef.set(updateData, { merge: true });
        console.log(`[updateUsageStats] Updated user stats - cached: ${cached}, infrastructure: ${JSON.stringify(infrastructureStats || {})}`);
    } catch (err) {
        console.error(`[updateUsageStats] Error:`, err);
        // Don't throw - stats failure shouldn't break the main flow
    }
}

// Update global usage statistics with real infrastructure tracking
async function updateGlobalStats(userId, challengeCount, tokenUsage, cached = false, error = false, suggestedActivity = null, responseTime = 0, infrastructureStats = null) {
    try {
        const batch = getFirestore().batch();

        // Main global stats document
        const globalRef = getFirestore().doc('destiny/global');
        const globalUpdate = {
            'ai_stats.totalCalls': FieldValue.increment(1),
            'ai_stats.lastCallAt': Date.now(),
            'ai_stats.updatedAt': Date.now(),
            'ai_stats.totalResponseTime': FieldValue.increment(responseTime)
        };

        // Track REAL infrastructure usage globally
        if (infrastructureStats) {
            globalUpdate['ai_stats.totalFirestoreReads'] = FieldValue.increment(infrastructureStats.firestoreReads);
            globalUpdate['ai_stats.totalFirestoreWrites'] = FieldValue.increment(infrastructureStats.firestoreWrites);
            globalUpdate['ai_stats.totalExecutionTimeMs'] = FieldValue.increment(infrastructureStats.executionTimeMs);
            globalUpdate['ai_stats.totalInfrastructureCostUSD'] = FieldValue.increment(infrastructureStats.infrastructureCost);
            globalUpdate['ai_stats.totalFirestoreCostUSD'] = FieldValue.increment(infrastructureStats.firestoreCost);
            globalUpdate['ai_stats.totalComputeCostUSD'] = FieldValue.increment(infrastructureStats.computeCost);
        }

        if (cached) {
            globalUpdate['ai_stats.cachedCalls'] = FieldValue.increment(1);
            globalUpdate['ai_stats.tokensSaved'] = FieldValue.increment(tokenUsage?.total || 0);
            // Calculate cost savings from cache hits
            if (tokenUsage?.total) {
                const savedCost = (tokenUsage.prompt || 0) * 0.005 / 1000 + (tokenUsage.completion || 0) * 0.015 / 1000;
                globalUpdate['ai_stats.costSavedUSD'] = FieldValue.increment(savedCost);
            }
        } else {
            globalUpdate['ai_stats.freshCalls'] = FieldValue.increment(1);
            if (tokenUsage) {
                globalUpdate['ai_stats.totalTokens'] = FieldValue.increment(tokenUsage.total || 0);
                globalUpdate['ai_stats.promptTokens'] = FieldValue.increment(tokenUsage.prompt || 0);
                globalUpdate['ai_stats.completionTokens'] = FieldValue.increment(tokenUsage.completion || 0);

                // Calculate and track costs
                const promptCost = (tokenUsage.prompt || 0) * 0.005 / 1000;
                const completionCost = (tokenUsage.completion || 0) * 0.015 / 1000;
                const totalCost = promptCost + completionCost;

                globalUpdate['ai_stats.totalCostUSD'] = FieldValue.increment(totalCost);
                globalUpdate['ai_stats.promptCostUSD'] = FieldValue.increment(promptCost);
                globalUpdate['ai_stats.completionCostUSD'] = FieldValue.increment(completionCost);
            }
        }

        if (error) {
            globalUpdate['ai_stats.errorCalls'] = FieldValue.increment(1);
        } else {
            globalUpdate['ai_stats.successfulCalls'] = FieldValue.increment(1);
            // Only count challenges processed for this specific AI request
            globalUpdate['ai_stats.totalChallengesAnalyzed'] = FieldValue.increment(challengeCount);
        }

        batch.set(globalRef, globalUpdate, { merge: true });

        // Track unique users with enhanced analytics
        const userRef = getFirestore().doc(`destiny/global/ai_users/${userId}`);
        const userAnalyticsData = {
            lastUsed: Date.now(),
            totalCalls: FieldValue.increment(1),
            totalTokens: FieldValue.increment(tokenUsage?.total || 0),
            totalChallengesAnalyzed: FieldValue.increment(challengeCount), // Challenges analyzed in AI requests
            avgResponseTime: responseTime // Will be calculated properly in analytics function
        };

        if (infrastructureStats) {
            userAnalyticsData.totalFirestoreReads = FieldValue.increment(infrastructureStats.firestoreReads);
            userAnalyticsData.totalFirestoreWrites = FieldValue.increment(infrastructureStats.firestoreWrites);
            userAnalyticsData.totalInfrastructureCostUSD = FieldValue.increment(infrastructureStats.infrastructureCost);
        }

        if (cached) {
            userAnalyticsData.cachedCalls = FieldValue.increment(1);
        } else {
            userAnalyticsData.freshCalls = FieldValue.increment(1);
        }

        if (error) {
            userAnalyticsData.errorCalls = FieldValue.increment(1);
        }

        batch.set(userRef, userAnalyticsData, { merge: true });

        // Daily stats tracking with enhanced metrics
        const today = new Date().toISOString().split('T')[0];
        const dailyRef = getFirestore().doc(`destiny/global/ai_daily_stats/${today}`);
        const dailyUpdate = {
            date: today,
            calls: FieldValue.increment(1),
            uniqueUsers: FieldValue.arrayUnion(userId),
            totalChallengesAnalyzed: FieldValue.increment(challengeCount),
            totalResponseTime: FieldValue.increment(responseTime),
            updatedAt: Date.now()
        };

        if (infrastructureStats) {
            dailyUpdate.totalFirestoreReads = FieldValue.increment(infrastructureStats.firestoreReads);
            dailyUpdate.totalFirestoreWrites = FieldValue.increment(infrastructureStats.firestoreWrites);
            dailyUpdate.totalInfrastructureCostUSD = FieldValue.increment(infrastructureStats.infrastructureCost);
        }

        if (cached) {
            dailyUpdate.cachedCalls = FieldValue.increment(1);
            dailyUpdate.cacheHits = FieldValue.increment(1);
        } else {
            dailyUpdate.freshCalls = FieldValue.increment(1);
            dailyUpdate.cacheMisses = FieldValue.increment(1);
            if (tokenUsage) {
                dailyUpdate.totalTokens = FieldValue.increment(tokenUsage.total || 0);
                dailyUpdate.promptTokens = FieldValue.increment(tokenUsage.prompt || 0);
                dailyUpdate.completionTokens = FieldValue.increment(tokenUsage.completion || 0);

                const totalCost = (tokenUsage.prompt || 0) * 0.005 / 1000 + (tokenUsage.completion || 0) * 0.015 / 1000;
                dailyUpdate.dailyCostUSD = FieldValue.increment(totalCost);
            }
        }

        if (error) {
            dailyUpdate.errorCalls = FieldValue.increment(1);
        }

        batch.set(dailyRef, dailyUpdate, { merge: true });

        // Track popular suggested activities
        if (suggestedActivity && !error) {
            const activityRef = getFirestore().doc(`destiny/global/suggested_activities/${encodeURIComponent(suggestedActivity)}`);
            batch.set(activityRef, {
                activity: suggestedActivity,
                suggestionCount: FieldValue.increment(1),
                lastSuggested: Date.now(),
                uniqueUsers: FieldValue.arrayUnion(userId)
            }, { merge: true });
        }

        // Hourly usage patterns for performance optimization
        const hour = new Date().getHours();
        const hourlyRef = getFirestore().doc(`destiny/global/ai_hourly_stats/${today}`);
        batch.set(hourlyRef, {
            date: today,
            [`hour_${hour}.calls`]: FieldValue.increment(1),
            [`hour_${hour}.responseTime`]: FieldValue.increment(responseTime),
            [`hour_${hour}.uniqueUsers`]: FieldValue.arrayUnion(userId),
            updatedAt: Date.now()
        }, { merge: true });

        await batch.commit();
        console.log(`[updateGlobalStats] Updated global AI stats with real infrastructure tracking`);
    } catch (err) {
        console.error(`[updateGlobalStats] Error:`, err);
        // Don't throw - stats failure shouldn't break the main flow
    }
}

// Calculate and update AI performance metrics
async function calculateAIPerformanceStats() {
    try {
        const globalRef = getFirestore().doc('destiny/global');
        const globalDoc = await globalRef.get();

        if (globalDoc.exists) {
            const data = globalDoc.data();
            const aiStats = data['ai_stats'] || {};

            // Calculate performance metrics
            const totalCalls = aiStats.totalCalls || 0;
            const successfulCalls = aiStats.successfulCalls || 0;
            const cachedCalls = aiStats.cachedCalls || 0;
            const freshCalls = aiStats.freshCalls || 0;
            const totalResponseTime = aiStats.totalResponseTime || 0;
            const totalTokens = aiStats.totalTokens || 0;
            const totalCost = aiStats.totalCostUSD || 0;
            const costSaved = aiStats.costSavedUSD || 0;

            // Calculate derived metrics
            const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;
            const cacheHitRate = totalCalls > 0 ? (cachedCalls / totalCalls) * 100 : 0;
            const avgResponseTime = freshCalls > 0 ? totalResponseTime / freshCalls : 0;
            const avgTokensPerCall = freshCalls > 0 ? totalTokens / freshCalls : 0;
            const avgCostPerCall = freshCalls > 0 ? totalCost / freshCalls : 0;
            const totalSavings = costSaved;

            // Count unique users
            const aiUsersSnapshot = await getFirestore().collection('destiny/global/ai_users').count().get();
            const totalAIUsers = aiUsersSnapshot.data().count;

            // Update calculated stats
            await globalRef.update({
                'ai_calculated_stats.successRate': successRate,
                'ai_calculated_stats.cacheHitRate': cacheHitRate,
                'ai_calculated_stats.avgResponseTime': avgResponseTime,
                'ai_calculated_stats.avgTokensPerCall': avgTokensPerCall,
                'ai_calculated_stats.avgCostPerCall': avgCostPerCall,
                'ai_calculated_stats.totalCostSavings': totalSavings,
                'ai_calculated_stats.totalActiveUsers': totalAIUsers,
                'ai_calculated_stats.lastCalculated': Date.now()
            });

            console.log(`[calculateAIPerformanceStats] Updated AI performance stats - Success rate: ${successRate.toFixed(2)}%, Cache hit rate: ${cacheHitRate.toFixed(2)}%`);
        }
    } catch (err) {
        console.error(`[calculateAIPerformanceStats] Error:`, err);
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
            usageCount: FieldValue.increment(1)
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
                // Basic call tracking
                totalCalls: 0,
                freshCalls: 0,
                cachedCalls: 0,
                successfulCalls: 0,
                errorCalls: 0,

                // Token tracking
                totalTokens: 0,
                promptTokens: 0,
                completionTokens: 0,
                tokensSaved: 0,

                // OpenAI cost tracking
                totalCostUSD: 0,
                promptCostUSD: 0,
                completionCostUSD: 0,

                // Infrastructure tracking
                totalFirestoreReads: 0,
                totalFirestoreWrites: 0,
                totalExecutionTimeMs: 0,
                totalInfrastructureCostUSD: 0,
                totalFirestoreCostUSD: 0,
                totalComputeCostUSD: 0,

                // Timestamps
                createdAt: Date.now(),
                updatedAt: Date.now(),
                lastCallAt: null
            };

            await statsRef.set(initialData);
            console.log(`[initializeAISuggestionsDoc] Created comprehensive AI suggestions document for user ${userId}`);
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
    const tracker = new InfrastructureTracker();
    let responseTime = 0;
    let error = false;

    const fail = (status, message, detail = {}) => {
        console.error(`[aiSuggest][FAIL] ${message}`, detail);
        error = true;
        responseTime = tracker.getExecutionTime();
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
    tracker.trackWrite(1); // Document initialization

    // --- 3. Validate Input ---
    const { challenges } = req.body || {};
    if (!Array.isArray(challenges) || challenges.length === 0) {
        const infrastructureStats = tracker.calculateRealCosts();
        await updateUsageStats(userId, null, false, false, infrastructureStats);
        await updateGlobalStats(userId, 0, null, false, false, null, tracker.getExecutionTime(), infrastructureStats);
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
        const infrastructureStats = tracker.calculateRealCosts();
        await updateUsageStats(userId, null, false, false, infrastructureStats);
        await updateGlobalStats(userId, 0, null, false, false, null, tracker.getExecutionTime(), infrastructureStats);
        return res.json({ plan: "You've completed all seasonal challenges. Go touch grass!" });
    }

    // --- 5. Generate Hash and Check Cache ---
    const challengeHash = generateChallengeHash(pending);
    console.log(`[aiSuggest] Generated hash: ${challengeHash} for ${pending.length} pending challenges`);

    try {
        const cached = await getCachedSuggestion(userId, challengeHash);
        tracker.trackRead(1); // Cache check

        if (cached) {
            // Update cache usage and stats
            updateCacheUsage(userId, challengeHash).catch(err => {
                console.error("Failed to update cache usage:", err);
            });
            tracker.trackWrite(1); // Cache usage update

            const cachedTokenUsage = cached.tokenUsage || { total: 0, prompt: 0, completion: 0 };
            responseTime = tracker.getExecutionTime();
            const infrastructureStats = tracker.calculateRealCosts();

            await updateUsageStats(userId, cachedTokenUsage, true, false, infrastructureStats);
            await updateGlobalStats(userId, cached.challengeCount, cachedTokenUsage, true, false, cached.suggestedActivity, responseTime, infrastructureStats);

            return res.json({
                plan: cached.suggestion,
                cached: true,
                cachedAt: cached.createdAt,
                challengeCount: cached.challengeCount,
                tokenUsage: cachedTokenUsage,
                responseTime: responseTime,
                infrastructureStats
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

        responseTime = tracker.getExecutionTime();

        console.log(`[aiSuggest] Received AI response: ${aiPlan.substring(0, 100)}... (${tokenUsage.total} tokens, ${responseTime}ms)`);

        // Extract suggested activity from response
        const suggestedActivity = extractSuggestedActivity(aiPlan);

        // --- 8. Cache the Response and Update Stats ---
        const seasonHash = pending.length > 0 ? pending[0].seasonHash : null;

        // Cache the suggestion
        cacheSuggestion(userId, challengeHash, pending, aiPlan, seasonHash, tokenUsage, suggestedActivity).catch(err => {
            console.error("Failed to cache AI suggestion:", err);
        });
        tracker.trackWrite(1); // Cache write

        // Calculate real infrastructure costs
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

        // Update usage stats with real infrastructure tracking
        await updateUsageStats(userId, tokenUsage, false, false, infrastructureStats);
        await updateGlobalStats(userId, pending.length, tokenUsage, false, false, suggestedActivity, responseTime, infrastructureStats);

        calculateAIPerformanceStats().catch(err => {
            console.error("Failed to calculate AI performance stats:", err);
        });

        return res.json({
            plan: aiPlan,
            cached: false,
            challengeCount: pending.length,
            tokenUsage: tokenUsage,
            responseTime: responseTime,
            infrastructureStats
        });

    } catch (e) {
        console.error(`[aiSuggest] OpenAI error:`, e);
        responseTime = tracker.getExecutionTime();
        const infrastructureStats = tracker.calculateRealCosts();

        await updateUsageStats(userId, null, false, true, infrastructureStats); // Track failed calls too
        await updateGlobalStats(userId, pending.length, null, false, true, null, responseTime, infrastructureStats); // Track as error
        return fail(500, "Failed to generate suggestion", {
            errorDetail: e.message,
            challengeCount: pending.length,
            responseTime: responseTime,
            infrastructureStats
        });
    }
});