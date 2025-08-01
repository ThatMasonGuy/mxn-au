import { onRequest } from "firebase-functions/v2/https";
import fetch from "node-fetch";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { defineSecret } from "firebase-functions/params";

const bungieApiKey = defineSecret('BUNGIE_API_KEY');

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

// Update global challenge statistics with infrastructure tracking
async function updateGlobalChallengeStats(userId, challengeStats, infrastructureStats = null) {
    try {
        const batch = getFirestore().batch();

        // Main global stats document
        const globalRef = getFirestore().doc('destiny/global');
        const globalUpdate = {
            'challenge_stats.totalRefreshCalls': FieldValue.increment(1),
            'challenge_stats.lastRefreshAt': Date.now(),
            'challenge_stats.updatedAt': Date.now()
        };

        // Track infrastructure usage for challenge refreshes
        if (infrastructureStats) {
            globalUpdate['challenge_stats.totalFirestoreReads'] = FieldValue.increment(infrastructureStats.firestoreReads);
            globalUpdate['challenge_stats.totalFirestoreWrites'] = FieldValue.increment(infrastructureStats.firestoreWrites);
            globalUpdate['challenge_stats.totalExecutionTimeMs'] = FieldValue.increment(infrastructureStats.executionTimeMs);
            globalUpdate['challenge_stats.totalInfrastructureCostUSD'] = FieldValue.increment(infrastructureStats.infrastructureCost);
            globalUpdate['challenge_stats.totalFirestoreCostUSD'] = FieldValue.increment(infrastructureStats.firestoreCost);
            globalUpdate['challenge_stats.totalComputeCostUSD'] = FieldValue.increment(infrastructureStats.computeCost);
        }

        // Only increment total challenges and completions if there were changes
        if (challengeStats.updatedChallenges > 0) {
            globalUpdate['challenge_stats.totalChallengesSeen'] = FieldValue.increment(challengeStats.totalChallenges);
            globalUpdate['challenge_stats.totalChallengesCompleted'] = FieldValue.increment(challengeStats.completedChallenges);
        }

        batch.set(globalRef, globalUpdate, { merge: true });

        // Track unique users who have connected with per-user challenge data
        const userRef = getFirestore().doc(`destiny/global/connected_users/${userId}`);
        const userUpdateData = {
            lastRefresh: Date.now(),
            totalRefreshes: FieldValue.increment(1)
        };

        // Store current user's challenge count (not increment - this is their current total)
        userUpdateData.currentTotalChallenges = challengeStats.totalChallenges;
        userUpdateData.currentCompletedChallenges = challengeStats.completedChallenges;

        // Track infrastructure usage per user
        if (infrastructureStats) {
            userUpdateData.totalFirestoreReads = FieldValue.increment(infrastructureStats.firestoreReads);
            userUpdateData.totalFirestoreWrites = FieldValue.increment(infrastructureStats.firestoreWrites);
            userUpdateData.totalInfrastructureCostUSD = FieldValue.increment(infrastructureStats.infrastructureCost);
        }

        // Only increment if there were updates this time
        if (challengeStats.updatedChallenges > 0) {
            userUpdateData.totalChallengeUpdates = FieldValue.increment(challengeStats.updatedChallenges);
        }

        batch.set(userRef, userUpdateData, { merge: true });

        // Season-specific stats
        if (challengeStats.seasonHash) {
            const seasonStatsRef = getFirestore().doc(`destiny/global/season_stats/${challengeStats.seasonHash}`);
            const seasonUpdateData = {
                seasonHash: challengeStats.seasonHash,
                seasonName: challengeStats.seasonName,
                uniqueUsers: FieldValue.arrayUnion(userId),
                lastUpdate: Date.now()
            };

            // Only update season totals if there were changes
            if (challengeStats.updatedChallenges > 0) {
                seasonUpdateData.totalChallengesSeen = FieldValue.increment(challengeStats.totalChallenges);
                seasonUpdateData.totalChallengesCompleted = FieldValue.increment(challengeStats.completedChallenges);
            }

            batch.set(seasonStatsRef, seasonUpdateData, { merge: true });
        }

        // Daily challenge tracking
        const today = new Date().toISOString().split('T')[0];
        const dailyRef = getFirestore().doc(`destiny/global/challenge_daily_stats/${today}`);
        const dailyUpdateData = {
            date: today,
            refreshCalls: FieldValue.increment(1),
            uniqueUsers: FieldValue.arrayUnion(userId),
            updatedAt: Date.now()
        };

        if (infrastructureStats) {
            dailyUpdateData.totalFirestoreReads = FieldValue.increment(infrastructureStats.firestoreReads);
            dailyUpdateData.totalFirestoreWrites = FieldValue.increment(infrastructureStats.firestoreWrites);
            dailyUpdateData.totalInfrastructureCostUSD = FieldValue.increment(infrastructureStats.infrastructureCost);
        }

        if (challengeStats.updatedChallenges > 0) {
            dailyUpdateData.totalChallengesSeen = FieldValue.increment(challengeStats.totalChallenges);
            dailyUpdateData.totalChallengesCompleted = FieldValue.increment(challengeStats.completedChallenges);
            dailyUpdateData.challengesUpdated = FieldValue.increment(challengeStats.updatedChallenges);
        }

        batch.set(dailyRef, dailyUpdateData, { merge: true });

        await batch.commit();
        console.log(`[updateGlobalChallengeStats] Updated global challenge stats with infrastructure tracking`);
    } catch (err) {
        console.error(`[updateGlobalChallengeStats] Error:`, err);
        // Don't throw - stats failure shouldn't break the main flow
    }
}

// Calculate completion rate and other stats with proper per-user calculations
async function calculateAndUpdateGlobalStats() {
    try {
        const globalRef = getFirestore().doc('destiny/global');
        const globalDoc = await globalRef.get();

        if (globalDoc.exists) {
            const data = globalDoc.data();
            console.log(`[calculateAndUpdateGlobalStats] Raw data structure:`, JSON.stringify(data, null, 2));

            // Access flattened field names directly (Firestore stores them as top-level keys)
            const totalSeen = data['challenge_stats.totalChallengesSeen'] || 0;
            const totalCompleted = data['challenge_stats.totalChallengesCompleted'] || 0;

            console.log(`[calculateAndUpdateGlobalStats] Extracted values - Seen: ${totalSeen}, Completed: ${totalCompleted}`);

            // Calculate completion rate
            const completionRate = totalSeen > 0 ? (totalCompleted / totalSeen) * 100 : 0;

            // Count unique connected users
            const connectedUsersSnapshot = await getFirestore().collection('destiny/global/connected_users').count().get();
            const totalConnectedUsers = connectedUsersSnapshot.data().count;

            // Count unique AI users
            const aiUsersSnapshot = await getFirestore().collection('destiny/global/ai_users').count().get();
            const totalAIUsers = aiUsersSnapshot.data().count;

            // Calculate REAL average challenges per user by getting actual user data
            let avgChallengesPerUser = 0;
            if (totalConnectedUsers > 0) {
                try {
                    const connectedUsersRef = getFirestore().collection('destiny/global/connected_users');
                    const usersSnapshot = await connectedUsersRef.get();

                    let totalUserChallenges = 0;
                    let usersWithChallenges = 0;

                    usersSnapshot.forEach(doc => {
                        const userData = doc.data();
                        const userChallenges = userData.currentTotalChallenges || 0;
                        if (userChallenges > 0) {
                            totalUserChallenges += userChallenges;
                            usersWithChallenges++;
                        }
                    });

                    avgChallengesPerUser = usersWithChallenges > 0 ? totalUserChallenges / usersWithChallenges : 0;
                    console.log(`[calculateAndUpdateGlobalStats] Calculated real avg: ${totalUserChallenges} total challenges across ${usersWithChallenges} users = ${avgChallengesPerUser.toFixed(1)} avg`);
                } catch (err) {
                    console.error(`[calculateAndUpdateGlobalStats] Error calculating real avg:`, err);
                    // Fallback to old method if detailed calculation fails
                    avgChallengesPerUser = totalConnectedUsers > 0 ? totalSeen / totalConnectedUsers : 0;
                }
            }

            console.log(`[calculateAndUpdateGlobalStats] Calculations - Seen: ${totalSeen}, Completed: ${totalCompleted}, Users: ${totalConnectedUsers}, Completion rate: ${completionRate.toFixed(2)}%, Avg per user: ${avgChallengesPerUser.toFixed(1)}`);

            // Update calculated stats
            await globalRef.update({
                'calculated_stats.avgCompletionRate': completionRate,
                'calculated_stats.totalConnectedUsers': totalConnectedUsers,
                'calculated_stats.totalAIUsers': totalAIUsers,
                'calculated_stats.avgChallengesPerUser': avgChallengesPerUser,
                'calculated_stats.totalChallengesSeen': totalSeen, // Add this for clarity
                'calculated_stats.lastCalculated': Date.now()
            });

            console.log(`[calculateAndUpdateGlobalStats] Successfully updated calculated stats`);
        }
    } catch (err) {
        console.error(`[calculateAndUpdateGlobalStats] Error:`, err);
    }
}

// Track API performance metrics
async function trackAPIPerformance(userId, startTime, endTime, success, errorType = null) {
    try {
        const duration = endTime - startTime;
        const today = new Date().toISOString().split('T')[0];

        const perfRef = getFirestore().doc(`destiny/global/api_performance/${today}`);

        const updateData = {
            date: today,
            totalRequests: FieldValue.increment(1),
            totalDuration: FieldValue.increment(duration),
            updatedAt: Date.now()
        };

        if (success) {
            updateData.successfulRequests = FieldValue.increment(1);
        } else {
            updateData.failedRequests = FieldValue.increment(1);
            if (errorType) {
                updateData[`errorTypes.${errorType}`] = FieldValue.increment(1);
            }
        }

        await perfRef.set(updateData, { merge: true });
    } catch (err) {
        console.error(`[trackAPIPerformance] Error:`, err);
    }
}

// --- Lightweight Season Metadata Caching Only ---

// Get cached season metadata (including challenge hashes and basic challenge info)
async function getCachedSeasonMeta(seasonHash, manifestVersion) {
    try {
        const metaRef = getFirestore().doc(`destiny/global/seasons/${seasonHash}`);
        const metaDoc = await metaRef.get();

        if (!metaDoc.exists) {
            console.log(`[getCachedSeasonMeta] No cached metadata found for season ${seasonHash}`);
            return null;
        }

        const metadata = metaDoc.data();

        // Check if metadata is recent enough (refresh every 24 hours)
        const age = Date.now() - metadata.cachedAt;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (age > maxAge) {
            console.log(`[getCachedSeasonMeta] Season metadata too old (${Math.round(age / (60 * 60 * 1000))} hours)`);
            return null;
        }

        console.log(`[getCachedSeasonMeta] Using cached season metadata for ${seasonHash}`);
        return metadata;

    } catch (err) {
        console.error(`[getCachedSeasonMeta] Error:`, err);
        return null;
    }
}

// Cache just the essential season metadata (lightweight)
async function cacheSeasonMeta(seasonHash, seasonData, challengeHashes, challengesNodeHash, challengeDefinitions) {
    try {
        const metaRef = getFirestore().doc(`destiny/global/seasons/${seasonHash}`);

        const metadata = {
            seasonHash,
            seasonName: seasonData.seasonName,
            challengesNodeHash,
            challengeHashes,
            challengeCount: challengeHashes.length,
            challengeDefinitions: challengeDefinitions || {},
            cachedAt: Date.now(),
            seasonStart: seasonData.seasonStart,
            seasonEnd: seasonData.seasonEnd,
            autoDetected: seasonData.autoDetected || false,
            seasonActive: seasonData.seasonActive || false
        };

        await metaRef.set(metadata, { merge: true });
        console.log(`[cacheSeasonMeta] Cached metadata for season ${seasonData.seasonName} with ${challengeHashes.length} challenges`);

    } catch (err) {
        console.error(`[cacheSeasonMeta] Error:`, err);
    }
}

// --- Helper Functions ---

// Check Firestore for currently active season
async function getActiveSeason() {
    try {
        const seasonsRef = getFirestore().collection('destiny/global/seasons');
        const activeSeasonQuery = await seasonsRef.where('seasonActive', '==', true).limit(1).get();

        if (!activeSeasonQuery.empty) {
            const seasonDoc = activeSeasonQuery.docs[0];
            console.log(`[getActiveSeason] Found active season: ${seasonDoc.data().seasonName}`);
            return {
                id: seasonDoc.id,
                ...seasonDoc.data()
            };
        }

        console.log(`[getActiveSeason] No active season found in Firestore`);
        return null;
    } catch (err) {
        console.error(`[getActiveSeason] Error:`, err);
        return null;
    }
}

// Get current season from Bungie API
async function getCurrentSeasonFromAPI() {
    try {
        // Get the manifest first to find season definitions
        const manifestRes = await fetch("https://www.bungie.net/Platform/Destiny2/Manifest/", {
            headers: { "X-API-Key": bungieApiKey.value() }
        });

        if (!manifestRes.ok) {
            throw new Error(`Manifest fetch failed: ${manifestRes.status}`);
        }

        const manifest = await manifestRes.json();
        const seasonPath = manifest.Response.jsonWorldComponentContentPaths.en.DestinySeasonDefinition;
        const presPath = manifest.Response.jsonWorldComponentContentPaths.en.DestinyPresentationNodeDefinition;

        // Get season definitions
        const seasonDefRes = await fetch(`https://www.bungie.net${seasonPath}`, {
            headers: { "X-API-Key": bungieApiKey.value() }
        });

        if (!seasonDefRes.ok) {
            throw new Error(`Season definitions fetch failed: ${seasonDefRes.status}`);
        }

        const seasonDefs = await seasonDefRes.json();

        // Get presentation node definitions to find seasonal challenge nodes
        const presDefRes = await fetch(`https://www.bungie.net${presPath}`, {
            headers: { "X-API-Key": bungieApiKey.value() }
        });

        if (!presDefRes.ok) {
            throw new Error(`Presentation definitions fetch failed: ${presDefRes.status}`);
        }

        const presDefs = await presDefRes.json();

        // Find the current active season
        const currentDate = new Date();
        let currentSeason = null;

        for (const [hash, season] of Object.entries(seasonDefs)) {
            if (!season.displayProperties?.name) continue;

            const startDate = new Date(season.startDate);
            const endDate = new Date(season.endDate);

            // Check if current date falls within season dates
            if (currentDate >= startDate && currentDate <= endDate) {
                // Find the seasonal challenges presentation node for this season
                let seasonalChallengesHash = null;

                // Look for presentation nodes that might be seasonal challenges
                for (const [nodeHash, node] of Object.entries(presDefs)) {
                    if (node.displayProperties?.name?.toLowerCase().includes('seasonal challenges') ||
                        (node.displayProperties?.name?.toLowerCase().includes('challenges') &&
                            node.displayProperties?.description?.toLowerCase().includes('seasonal'))) {

                        // Additional checks to ensure this belongs to current season
                        if (node.children?.records?.length > 0) {
                            seasonalChallengesHash = nodeHash;
                            break;
                        }
                    }
                }

                currentSeason = {
                    seasonHash: hash,
                    seasonName: season.displayProperties.name,
                    seasonStart: season.startDate,
                    seasonEnd: season.endDate,
                    seasonActive: true,
                    challengesNodeHash: seasonalChallengesHash,
                    autoDetected: true,
                    createdAt: Date.now()
                };

                console.log(`[getCurrentSeasonFromAPI] Found current season: ${currentSeason.seasonName}`);
                break;
            }
        }

        if (!currentSeason) {
            // Fallback: find the most recent season if no current active season
            const sortedSeasons = Object.entries(seasonDefs)
                .filter(([hash, season]) => season.displayProperties?.name)
                .sort(([, a], [, b]) => new Date(b.startDate) - new Date(a.startDate));

            if (sortedSeasons.length > 0) {
                const [hash, season] = sortedSeasons[0];
                currentSeason = {
                    seasonHash: hash,
                    seasonName: season.displayProperties.name,
                    seasonStart: season.startDate,
                    seasonEnd: season.endDate,
                    seasonActive: true,
                    challengesNodeHash: seasonalChallengesHash,
                    autoDetected: true,
                    createdAt: Date.now()
                };

                console.log(`[getCurrentSeasonFromAPI] Using latest season as fallback: ${currentSeason.seasonName}`);
            }
        }

        return currentSeason;

    } catch (err) {
        console.error(`[getCurrentSeasonFromAPI] Error:`, err);
        throw err;
    }
}

// Save season to Firestore and deactivate others
async function saveActiveSeason(seasonData) {
    try {
        const seasonsRef = getFirestore().collection('destiny/global/seasons');
        const batch = getFirestore().batch();

        // First, deactivate all existing seasons
        const existingSeasons = await seasonsRef.where('seasonActive', '==', true).get();
        existingSeasons.forEach(doc => {
            batch.update(doc.ref, { seasonActive: false, deactivatedAt: Date.now() });
        });

        // Add the new active season with merge to create if doesn't exist
        const newSeasonRef = seasonsRef.doc(seasonData.seasonHash);
        batch.set(newSeasonRef, seasonData, { merge: true });

        await batch.commit();

        console.log(`[saveActiveSeason] Saved active season: ${seasonData.seasonName}`);
        return seasonData;

    } catch (err) {
        console.error(`[saveActiveSeason] Error:`, err);
        throw err;
    }
}

// Recursive node traversal
function collectAllRecordHashes(nodeHash, presDefs, nodeLogs = [], depth = 0, visited = new Set()) {
    if (!nodeHash || visited.has(nodeHash)) return [];
    visited.add(nodeHash);
    const node = presDefs[nodeHash];
    if (!node) {
        nodeLogs.push(`[${' '.repeat(depth)}] MISSING NODE: ${nodeHash}`);
        return [];
    }
    let hashes = [];
    if (node.children?.records?.length) {
        nodeLogs.push(`[${' '.repeat(depth)}] Found ${node.children.records.length} records at ${node.displayProperties?.name || nodeHash}`);
        hashes.push(...node.children.records.map(rec => String(rec.recordHash)));
    }
    if (node.children?.presentationNodes?.length) {
        for (const sub of node.children.presentationNodes) {
            const subNode = presDefs[sub.presentationNodeHash];
            nodeLogs.push(`[${' '.repeat(depth)}] ${node.displayProperties?.name || nodeHash} → ${subNode?.displayProperties?.name || sub.presentationNodeHash}`);
            hashes.push(...collectAllRecordHashes(sub.presentationNodeHash, presDefs, nodeLogs, depth + 1, visited));
        }
    }
    return hashes;
}

// Compare challenge data to detect changes
function hasChanges(existing, newData) {
    if (!existing) return true;

    // Check basic properties
    if (existing.completed !== newData.completed ||
        existing.claimed !== newData.claimed ||
        existing.visible !== newData.visible ||
        existing.seasonHash !== newData.seasonHash) {
        return true;
    }

    // Check objectives progress
    if (!existing.objectives || !newData.objectives) {
        return existing.objectives !== newData.objectives;
    }

    if (existing.objectives.length !== newData.objectives.length) {
        return true;
    }

    for (let i = 0; i < existing.objectives.length; i++) {
        const existingObj = existing.objectives[i];
        const newObj = newData.objectives[i];

        if (existingObj.progress !== newObj.progress ||
            existingObj.complete !== newObj.complete ||
            existingObj.objectiveHash !== newObj.objectiveHash) {
            return true;
        }
    }

    return false;
}

// Helper function to generate a summary of what changed
function getChangeSummary(existing, newData) {
    const changes = [];

    if (!existing) {
        changes.push("New challenge");
        return changes;
    }

    if (existing.completed !== newData.completed) {
        changes.push(`Completion: ${existing.completed} → ${newData.completed}`);
    }

    if (existing.claimed !== newData.claimed) {
        changes.push(`Claimed: ${existing.claimed} → ${newData.claimed}`);
    }

    if (existing.visible !== newData.visible) {
        changes.push(`Visibility: ${existing.visible} → ${newData.visible}`);
    }

    if (existing.seasonHash !== newData.seasonHash) {
        changes.push(`Season: ${existing.seasonHash} → ${newData.seasonHash}`);
    }

    // Check for objective progress changes
    if (existing.objectives && newData.objectives) {
        for (let i = 0; i < Math.min(existing.objectives.length, newData.objectives.length); i++) {
            const oldObj = existing.objectives[i];
            const newObj = newData.objectives[i];

            if (oldObj.progress !== newObj.progress) {
                changes.push(`Objective ${i + 1} progress: ${oldObj.progress} → ${newObj.progress}`);
            }

            if (oldObj.complete !== newObj.complete) {
                changes.push(`Objective ${i + 1} complete: ${oldObj.complete} → ${newObj.complete}`);
            }
        }
    }

    return changes;
}

// --- Main Function ---
export const getChallenges = onRequest(
    {
        region: 'australia-southeast1',
        secrets: [bungieApiKey],
        memory: '512MiB', // Increase memory limit
        timeoutSeconds: 120 // Increase timeout
    },
    async (req, res) => {
        const startTime = Date.now();
        let success = false;
        let errorType = null;

        const fail = (status, message, detail = {}) => {
            console.error(`[getChallenges][FAIL] ${message}`, detail);
            errorType = message.split(' ')[0].toLowerCase(); // Extract error type
            return res.status(status).json({ ok: false, error: message, ...detail });
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

        // --- 2. Get User Bungie Meta ---
        let meta;
        try {
            const metaDoc = await getFirestore().doc(`users/${userId}/destiny/meta`).get();
            if (!metaDoc.exists) return fail(404, "No Destiny account linked");
            meta = metaDoc.data();
            if (!meta.accessToken || !meta.platformType || !meta.bungieMembershipId)
                return fail(400, "Destiny account metadata is incomplete", { meta });
            if (meta.tokenExpires < Date.now())
                return fail(401, "Access token expired. Please re-link your Bungie account.");
        } catch (err) {
            return fail(500, "Firestore error fetching Destiny meta", { errorDetail: err?.message });
        }

        // --- 3. Determine Current Season ---
        let currentSeason;
        try {
            // First check Firestore for active season
            currentSeason = await getActiveSeason();

            if (!currentSeason) {
                console.log("[getChallenges] No active season in Firestore, querying Bungie API...");

                // Get current season from Bungie API
                const apiSeason = await getCurrentSeasonFromAPI();

                if (!apiSeason) {
                    return fail(500, "Could not determine current season from Bungie API");
                }

                // Save the new season to Firestore
                currentSeason = await saveActiveSeason(apiSeason);
            }

            console.log(`[getChallenges] Using season: ${currentSeason.seasonName} (${currentSeason.seasonHash})`);

        } catch (err) {
            return fail(500, "Error determining current season", { errorDetail: err?.message });
        }

        // --- 4. Get Challenge Data (with lightweight caching) ---
        let challengeHashes;
        let challengesNodeHash;
        let cachedDefinitions = {};

        try {
            // Try to get cached season metadata first
            const cachedMeta = await getCachedSeasonMeta(currentSeason.seasonHash, 'current');

            if (cachedMeta && cachedMeta.challengeHashes?.length > 0) {
                console.log(`[getChallenges] Using cached challenge data (${cachedMeta.challengeHashes.length} challenges)`);
                challengeHashes = cachedMeta.challengeHashes;
                challengesNodeHash = cachedMeta.challengesNodeHash;
                cachedDefinitions = cachedMeta.challengeDefinitions || {};
            } else {
                console.log(`[getChallenges] Cache miss, fetching fresh challenge data...`);

                // Get current manifest version
                const manifestRes = await fetch("https://www.bungie.net/Platform/Destiny2/Manifest/", {
                    headers: { "X-API-Key": bungieApiKey.value() }
                });

                if (!manifestRes.ok) {
                    throw new Error(`Manifest fetch failed: ${manifestRes.status}`);
                }

                const manifest = await manifestRes.json();
                const presPath = manifest.Response.jsonWorldComponentContentPaths.en.DestinyPresentationNodeDefinition;

                // Download ONLY presentation node definitions (much smaller)
                const presDefRes = await fetch(`https://www.bungie.net${presPath}`, {
                    headers: { "X-API-Key": bungieApiKey.value() }
                });

                if (!presDefRes.ok) {
                    throw new Error(`Presentation definitions fetch failed: ${presDefRes.status}`);
                }

                const presDefs = await presDefRes.json();

                // Determine the challenges node hash to use
                challengesNodeHash = currentSeason.challengesNodeHash || req.body?.challengesNodeHash || "3971879360";

                const parentNode = presDefs[challengesNodeHash];
                if (!parentNode) {
                    return fail(500, "Parent presentation node not found in manifest", { challengesNodeHash });
                }

                // Traverse nodes to find challenge hashes
                let nodeLogs = [];
                challengeHashes = collectAllRecordHashes(challengesNodeHash, presDefs, nodeLogs, 0, new Set());

                if (!challengeHashes.length) {
                    return fail(500, "No child challenge hashes found after traversal", { parentNode, nodeLogs });
                }

                console.log("[getChallenges] Node traversal logs:\n", nodeLogs.join('\n'));

                // Cache the season metadata for next time (without heavy definitions initially)
                cacheSeasonMeta(
                    currentSeason.seasonHash,
                    currentSeason,
                    challengeHashes,
                    challengesNodeHash,
                    {} // Start with empty definitions, we'll populate as we go
                ).catch(err => {
                    console.error("Failed to cache season metadata:", err);
                });
            }

        } catch (err) {
            return fail(500, "Error collecting challenge data", { errorDetail: err?.message });
        }

        // --- 5. Fetch Player Records ---
        let allRecords;
        try {
            const url = `https://www.bungie.net/Platform/Destiny2/${meta.platformType}/Profile/${meta.bungieMembershipId}/?components=900,100`;
            const bungieRes = await fetch(url, {
                headers: { "Authorization": `Bearer ${meta.accessToken}`, "X-API-Key": bungieApiKey.value() }
            });
            if (!bungieRes.ok) {
                const text = await bungieRes.text();
                return fail(bungieRes.status, "Bungie API /Profile fetch failed", { response: text });
            }
            const bungieJson = await bungieRes.json();
            allRecords = bungieJson?.Response?.profileRecords?.data?.records || {};
            const charRecords = bungieJson?.Response?.characterRecords?.data || {};
            for (const charId in charRecords) {
                const recs = charRecords[charId].records || {};
                for (const [hash, value] of Object.entries(recs)) {
                    if (!allRecords[hash]) {
                        allRecords[hash] = value;
                    }
                }
            }
            console.log(`[getChallenges] Loaded ${Object.keys(allRecords).length} player records`);
        } catch (err) {
            return fail(500, "Error fetching Destiny2 profile records", { errorDetail: err?.message });
        }

        // --- 6. Fetch Existing Challenges ---
        let existingChallenges = {};
        try {
            const collRef = getFirestore().collection(`users/${userId}/destiny/challenges/seasonal_challenges`);
            const existingDocs = await collRef.get();
            existingDocs.forEach(doc => {
                existingChallenges[doc.id] = doc.data();
            });
            console.log(`[getChallenges] Found ${existingDocs.size} existing challenges`);
        } catch (err) {
            return fail(500, "Error fetching existing challenges", { errorDetail: err?.message });
        }

        // --- 7. Build Challenge Data (fetch definitions only as needed) ---
        let challengeDocs = [];
        let updatedChallenges = [];
        let unchangedChallenges = [];
        let errorHashes = [];
        let newDefinitions = {};
        let challengeStats = {
            totalChallenges: 0,
            completedChallenges: 0,
            updatedChallenges: 0,
            seasonHash: currentSeason.seasonHash,
            seasonName: currentSeason.seasonName
        };

        // Get manifest info for on-demand definition fetching
        let manifestInfo = null;
        const hashesNeedingDefinitions = challengeHashes.filter(hash => !cachedDefinitions[hash]);

        if (hashesNeedingDefinitions.length > 0) {
            console.log(`[getChallenges] Need to fetch definitions for ${hashesNeedingDefinitions.length} challenges`);

            try {
                const manifestRes = await fetch("https://www.bungie.net/Platform/Destiny2/Manifest/", {
                    headers: { "X-API-Key": bungieApiKey.value() }
                });

                if (manifestRes.ok) {
                    const manifest = await manifestRes.json();
                    manifestInfo = {
                        recordPath: manifest.Response.jsonWorldComponentContentPaths.en.DestinyRecordDefinition,
                        objectivePath: manifest.Response.jsonWorldComponentContentPaths.en.DestinyObjectiveDefinition
                    };
                }
            } catch (err) {
                console.error("Failed to get manifest info for definitions:", err);
            }
        }

        // Fetch definitions if needed (but only once)
        let recordsDef = {};
        let objectiveDefs = {};

        if (manifestInfo && hashesNeedingDefinitions.length > 0) {
            try {
                console.log("[getChallenges] Fetching record and objective definitions...");

                const [recordsDefRes, objDefRes] = await Promise.all([
                    fetch(`https://www.bungie.net${manifestInfo.recordPath}`, {
                        headers: { "X-API-Key": bungieApiKey.value() }
                    }),
                    fetch(`https://www.bungie.net${manifestInfo.objectivePath}`, {
                        headers: { "X-API-Key": bungieApiKey.value() }
                    })
                ]);

                if (recordsDefRes.ok && objDefRes.ok) {
                    recordsDef = await recordsDefRes.json();
                    objectiveDefs = await objDefRes.json();
                    console.log("[getChallenges] Successfully loaded definitions");
                }
            } catch (err) {
                console.error("Failed to fetch definitions:", err);
                // Continue without definitions - we'll use cached data where possible
            }
        }

        for (const hash of challengeHashes) {
            try {
                const record = allRecords[hash];
                if (!record) {
                    console.log(`[DEBUG] No record found for hash ${hash}`);
                    continue;
                }
                if (record.state === undefined) continue;

                // Try to get definition from cache first, then from fresh download
                let def = cachedDefinitions[hash];
                if (!def && recordsDef[hash]) {
                    def = recordsDef[hash];
                    newDefinitions[hash] = def; // Cache for next time
                }

                if (!def) {
                    errorHashes.push(hash + ": No definition found");
                    continue;
                }

                // Parse objectives and progress
                let objectives = [];
                const recObjectives = record.objectives;
                if (recObjectives && typeof recObjectives === 'object') {
                    if (Array.isArray(recObjectives)) {
                        for (const obj of recObjectives) {
                            const objDef = objectiveDefs[obj.objectiveHash] || {};
                            objectives.push({
                                objectiveHash: obj.objectiveHash || 0,
                                description: objDef.progressDescription || objDef.displayProperties?.description || '',
                                progress: obj.progress || 0,
                                completionValue: objDef.completionValue || obj.completionValue || 1,
                                complete: obj.complete || false,
                            });
                        }
                    } else {
                        for (const [objectiveHash, obj] of Object.entries(recObjectives)) {
                            const objDef = objectiveDefs[objectiveHash] || {};
                            objectives.push({
                                objectiveHash: objectiveHash || 0,
                                description: objDef.progressDescription || objDef.displayProperties?.description || '',
                                progress: obj.progress || 0,
                                completionValue: objDef.completionValue || obj.completionValue || 1,
                                complete: obj.complete || false,
                            });
                        }
                    }
                }

                // XP reward parsing
                let xp = null, xpTier = null;
                const rewardItems = def.rewardItems || [];
                for (const r of rewardItems) {
                    const desc = r.rewardedLabel || r.displayProperties?.name || '';
                    const match = desc.match(/XP(\+{1,5})/);
                    if (match) {
                        xpTier = match[1].length;
                        xp = ['Large', 'XL', 'XXL', '4XL', '8XL'][xpTier - 1] || 'Unknown';
                        break;
                    }
                }
                if (!xp && def.displayProperties?.description) {
                    const match = def.displayProperties.description.match(/XP(\+{1,5})/);
                    if (match) {
                        xpTier = match[1].length;
                        xp = ['Large', 'XL', 'XXL', '4XL', '8XL'][xpTier - 1] || 'Unknown';
                    }
                }

                const newChallengeData = {
                    hash,
                    seasonHash: currentSeason.seasonHash,
                    seasonName: currentSeason.seasonName,
                    name: def.displayProperties?.name || '',
                    description: def.displayProperties?.description || '',
                    xp,
                    xpTier,
                    completed: !!(record.state & 1),
                    claimed: !!(record.state & 2),
                    visible: !(record.state & 4),
                    objectives,
                    updatedAt: Date.now()
                };

                // Update stats
                challengeStats.totalChallenges++;
                if (newChallengeData.completed) {
                    challengeStats.completedChallenges++;
                }

                // Check if this challenge needs updating
                const existingChallenge = existingChallenges[hash];
                if (hasChanges(existingChallenge, newChallengeData)) {
                    // Preserve original creation date if it exists
                    if (existingChallenge?.createdAt) {
                        newChallengeData.createdAt = existingChallenge.createdAt;
                    } else {
                        newChallengeData.createdAt = Date.now();
                    }

                    challengeDocs.push(newChallengeData);
                    challengeStats.updatedChallenges++;
                    updatedChallenges.push({
                        hash,
                        name: newChallengeData.name,
                        changes: getChangeSummary(existingChallenge, newChallengeData)
                    });
                } else {
                    unchangedChallenges.push(hash);
                }

            } catch (err) {
                errorHashes.push(hash + ": " + (err?.message || err));
            }
        }

        // --- 8. Update cached definitions if we fetched new ones ---
        if (Object.keys(newDefinitions).length > 0) {
            console.log(`[getChallenges] Updating cached definitions with ${Object.keys(newDefinitions).length} new entries`);
            cacheSeasonMeta(
                currentSeason.seasonHash,
                currentSeason,
                challengeHashes,
                challengesNodeHash,
                { ...cachedDefinitions, ...newDefinitions }
            ).catch(err => {
                console.error("Failed to update cached definitions:", err);
            });
        }

        // --- 9. Update Global Stats ---
        await updateGlobalChallengeStats(userId, challengeStats);

        // Calculate global stats more frequently (every 3rd call instead of 10%)
        await calculateAndUpdateGlobalStats().catch(err => {
            console.error("Failed to calculate global stats:", err);
        });

        // --- 10. Save Updated Challenges to Firestore ---
        try {
            if (challengeDocs.length === 0) {
                success = true;
                const endTime = Date.now();
                await trackAPIPerformance(userId, startTime, endTime, success, errorType);

                return res.json({
                    ok: true,
                    updated: challengeDocs.length,
                    unchanged: unchangedChallenges.length,
                    updatedChallenges,
                    errorHashes,
                    updatedAt: Date.now(),
                    season: {
                        name: currentSeason.seasonName,
                        hash: currentSeason.seasonHash,
                        autoDetected: currentSeason.autoDetected || false,
                        challengesNodeHash
                    },
                    cacheStats: {
                        definitionsCached: Object.keys(cachedDefinitions).length,
                        definitionsFetched: Object.keys(newDefinitions).length
                    },
                    globalStats: challengeStats,
                    sample: challengeDocs[0],
                    performance: {
                        duration: endTime - startTime
                    }
                });
            }

            const batch = getFirestore().batch();
            const collRef = getFirestore().collection(`users/${userId}/destiny/challenges/seasonal_challenges`);

            for (const doc of challengeDocs) {
                batch.set(collRef.doc(doc.hash), doc, { merge: true });
            }

            await batch.commit();
            success = true;
            const endTime = Date.now();
            await trackAPIPerformance(userId, startTime, endTime, success, errorType);

            return res.json({
                ok: true,
                updated: challengeDocs.length,
                unchanged: unchangedChallenges.length,
                updatedChallenges,
                errorHashes,
                updatedAt: Date.now(),
                season: {
                    name: currentSeason.seasonName,
                    hash: currentSeason.seasonHash,
                    autoDetected: currentSeason.autoDetected || false,
                    challengesNodeHash
                },
                cacheStats: {
                    definitionsCached: Object.keys(cachedDefinitions).length,
                    definitionsFetched: Object.keys(newDefinitions).length
                },
                globalStats: challengeStats,
                sample: challengeDocs[0],
                performance: {
                    duration: endTime - startTime
                }
            });
        } catch (err) {
            const endTime = Date.now();
            await trackAPIPerformance(userId, startTime, endTime, success, "firestore_write");
            return fail(500, "Firestore write failed", { errorDetail: err?.message, challengeDocsLength: challengeDocs.length });
        }
    }
);