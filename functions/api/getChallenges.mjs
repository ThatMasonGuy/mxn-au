// getChallenges.mjs (Optimized)
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { FieldValue } from "firebase-admin/firestore";
import {
    InfrastructureTracker,
    verifyAuthToken,
    getCurrentWeek,
    getDb,
    FirestoreBatch
} from "./shared/utils.mjs";
import { StatsManager } from "./shared/statsManager.mjs";
import { CacheManager } from "./shared/cacheManager.mjs";
import { BungieApiClient } from "./shared/bungieApiClient.mjs";

const bungieApiKey = defineSecret('BUNGIE_API_KEY');

// Build comprehensive season reference
async function buildSeasonReference(bungieClient, seasonData, challengesNodeHash, tracker) {
    try {
        console.log(`[buildSeasonReference] Building reference for ${seasonData.seasonName}`);

        // Get manifest and definitions
        const manifest = await bungieClient.getManifest();
        const definitions = await bungieClient.getDefinitions(
            ['DestinyPresentationNodeDefinition', 'DestinyRecordDefinition', 'DestinyObjectiveDefinition'],
            manifest.jsonWorldComponentContentPaths.en
        );

        const presDefs = definitions.DestinyPresentationNodeDefinition;
        const recordDefs = definitions.DestinyRecordDefinition;

        // Collect all challenge hashes
        const challengeHashes = collectAllRecordHashes(challengesNodeHash, presDefs);
        console.log(`[buildSeasonReference] Found ${challengeHashes.length} total challenges`);

        if (challengeHashes.length === 0) {
            throw new Error(`No challenges found for node ${challengesNodeHash}`);
        }

        // Build weekly structure
        const weeklyData = buildWeeklyChallengeMap(challengesNodeHash, presDefs);

        // Build challenge definitions
        const challengeDefinitions = {};
        for (const hash of challengeHashes) {
            const def = recordDefs[hash];
            if (def) {
                challengeDefinitions[hash] = {
                    name: def.displayProperties?.name || '',
                    description: def.displayProperties?.description || '',
                    rewardItems: def.rewardItems || [],
                    objectiveHashes: def.objectiveHashes || [],
                    hash: hash
                };
            }
        }

        // Create reference
        const reference = {
            seasonHash: seasonData.seasonHash,
            seasonName: seasonData.seasonName,
            challengesNodeHash,
            allChallenges: challengeHashes,
            challengeCount: challengeHashes.length,
            challengeDefinitions,
            weeklyMap: weeklyData.weeklyMap,
            hasWeeklyStructure: weeklyData.hasWeeklyStructure,
            totalWeeks: Object.keys(weeklyData.weeklyMap).length,
            highestWeekNumber: weeklyData.highestWeekNumber || Object.keys(weeklyData.weeklyMap).length,
            persistentChallenges: weeklyData.persistentChallenges || [],
            seasonStart: seasonData.seasonStart,
            seasonEnd: seasonData.seasonEnd,
            seasonActive: seasonData.seasonActive,
            manifestVersion: manifest.version,
            cacheVersion: 3,
            builtAt: Date.now(),
            validUntil: Date.now() + (7 * 24 * 60 * 60 * 1000),
        };

        return reference;
    } catch (err) {
        console.error(`[buildSeasonReference] Error:`, err);
        throw err;
    }
}

// Simplified weekly challenge map builder
function buildWeeklyChallengeMap(challengesNodeHash, presDefs) {
    const seasonNode = presDefs[challengesNodeHash];
    if (!seasonNode || !seasonNode.children?.presentationNodes?.length) {
        return { weeklyMap: {}, hasWeeklyStructure: false, persistentChallenges: [] };
    }

    const weeklyMap = {};
    const persistentChallenges = [];
    let weeklyStructureDetected = false;
    let highestWeekNumber = 0;

    const weeklyPatterns = [/week\s*(\d+)/i, /^\s*(\d+)\s*$/, /chapter\s*(\d+)/i];
    const persistentPatterns = [/redacted/i, /special/i, /bonus/i, /hidden/i, /secret/i];

    // Process all nodes
    seasonNode.children.presentationNodes.forEach((nodeRef, idx) => {
        const node = presDefs[nodeRef.presentationNodeHash];
        if (!node) return;

        const nodeName = node.displayProperties?.name || '';
        const isPersistent = persistentPatterns.some(p => p.test(nodeName));

        // Process direct records and sub-nodes
        const processNode = (n, name, parentName = '') => {
            if (n.children?.records?.length > 0) {
                const recordHashes = n.children.records.map(r => String(r.recordHash));

                let weekNumber = null;
                for (const pattern of weeklyPatterns) {
                    const match = name.match(pattern) || parentName.match(pattern);
                    if (match && match[1]) {
                        weekNumber = parseInt(match[1]);
                        break;
                    }
                }

                if (weekNumber && weekNumber > 0 && weekNumber <= 20) {
                    const weekKey = `week_${weekNumber}`;
                    if (weeklyMap[weekKey]) {
                        weeklyMap[weekKey].challenges.push(...recordHashes);
                        weeklyMap[weekKey].challengeCount = weeklyMap[weekKey].challenges.length;
                    } else {
                        weeklyMap[weekKey] = {
                            challenges: recordHashes,
                            nodeName: name,
                            nodeHash: n.hash,
                            challengeCount: recordHashes.length,
                            weekNumber: weekNumber
                        };
                    }
                    weeklyStructureDetected = true;
                    highestWeekNumber = Math.max(highestWeekNumber, weekNumber);
                } else if (isPersistent || idx >= 10) {
                    persistentChallenges.push(...recordHashes);
                }
            }
        };

        processNode(node, nodeName);

        // Process sub-nodes
        if (node.children?.presentationNodes?.length > 0) {
            node.children.presentationNodes.forEach(subRef => {
                const subNode = presDefs[subRef.presentationNodeHash];
                if (subNode) {
                    processNode(subNode, subNode.displayProperties?.name || '', nodeName);
                }
            });
        }
    });

    // Fill missing weeks
    if (weeklyStructureDetected) {
        for (let week = 1; week <= highestWeekNumber; week++) {
            const weekKey = `week_${week}`;
            if (!weeklyMap[weekKey]) {
                weeklyMap[weekKey] = {
                    challenges: [],
                    nodeName: `Week ${week} (Empty)`,
                    nodeHash: null,
                    challengeCount: 0,
                    weekNumber: week
                };
            }
        }
    }

    return {
        weeklyMap,
        hasWeeklyStructure: weeklyStructureDetected,
        persistentChallenges: [...new Set(persistentChallenges)],
        highestWeekNumber
    };
}

// Recursive challenge collection
function collectAllRecordHashes(nodeHash, presDefs, visited = new Set()) {
    if (!nodeHash || visited.has(nodeHash)) return [];
    visited.add(nodeHash);

    const node = presDefs[nodeHash];
    if (!node) return [];

    let hashes = [];

    if (node.children?.records?.length) {
        hashes.push(...node.children.records.map(rec => String(rec.recordHash)));
    }

    if (node.children?.presentationNodes?.length) {
        for (const sub of node.children.presentationNodes) {
            hashes.push(...collectAllRecordHashes(sub.presentationNodeHash, presDefs, visited));
        }
    }

    return hashes;
}

// Check if challenge is active
function isChallengeActive(challengeHash, seasonReference, currentWeek) {
    // Persistent challenges are always active
    if (seasonReference.persistentChallenges?.includes(challengeHash)) {
        return true;
    }

    // No weekly structure = all active
    if (!seasonReference.hasWeeklyStructure) {
        return true;
    }

    // Find which week this challenge belongs to
    for (let week = 1; week <= seasonReference.highestWeekNumber; week++) {
        const weekKey = `week_${week}`;
        const weekData = seasonReference.weeklyMap[weekKey];

        if (weekData?.challenges?.includes(challengeHash)) {
            return week <= currentWeek;
        }
    }

    // Default to active if past all known weeks
    return currentWeek > seasonReference.highestWeekNumber;
}

// Main function
export const getChallenges = onRequest(
    {
        region: 'australia-southeast1',
        secrets: [bungieApiKey],
        memory: '512MiB',
        timeoutSeconds: 120
    },
    async (req, res) => {
        const startTime = Date.now();
        const tracker = new InfrastructureTracker();
        const db = getDb();
        const cacheManager = new CacheManager(tracker);
        const statsManager = new StatsManager(tracker);

        const fail = (status, message, detail = {}) => {
            console.error(`[getChallenges][FAIL] ${message}`, detail);
            return res.status(status).json({ ok: false, error: message, ...detail });
        };

        try {
            // 1. Authentication
            const decoded = await verifyAuthToken(req.headers.authorization);
            const userId = decoded.uid;

            // 2. Get user Bungie meta
            const metaDoc = await db.doc(`users/${userId}/destiny/meta`).get();
            tracker.trackRead(1, 'user destiny meta');

            if (!metaDoc.exists) {
                return fail(404, "No Destiny account linked");
            }

            const meta = metaDoc.data();
            if (!meta.accessToken || !meta.platformType || !meta.bungieMembershipId) {
                return fail(400, "Destiny account metadata is incomplete", { meta });
            }

            if (meta.tokenExpires < Date.now()) {
                return fail(401, "Access token expired. Please re-link your Bungie account.");
            }

            // 3. Initialize Bungie API client
            const bungieClient = new BungieApiClient(bungieApiKey.value(), tracker);

            // 4. Get current season (check cache first)
            let currentSeason = await getActiveSeason(db, tracker);
            if (!currentSeason) {
                console.log("[getChallenges] No active season in Firestore, querying Bungie API...");
                currentSeason = await bungieClient.getCurrentSeason();

                if (!currentSeason) {
                    return fail(500, "Could not determine current season from Bungie API");
                }

                currentSeason = await saveActiveSeason(db, currentSeason, tracker);
            }

            console.log(`[getChallenges] Using season: ${currentSeason.seasonName} (${currentSeason.seasonHash})`);

            // 5. Get or build season reference
            let seasonReference = await cacheManager.getSeasonReference(currentSeason.seasonHash);

            if (!seasonReference) {
                console.log(`[getChallenges] Building new reference...`);
                const challengesNodeHash = currentSeason.challengesNodeHash || req.body?.challengesNodeHash || "3971879360";
                seasonReference = await buildSeasonReference(bungieClient, currentSeason, challengesNodeHash, tracker);
                await cacheManager.saveSeasonReference(seasonReference);
            }

            // 6. Calculate current week
            const currentWeek = getCurrentWeek(seasonReference.seasonStart, seasonReference.highestWeekNumber);
            console.log(`[getChallenges] Current week: ${currentWeek}`);

            // 7. Fetch player records
            const profileData = await bungieClient.getProfile(
                meta.platformType,
                meta.bungieMembershipId,
                [900, 100], // Records components
                meta.accessToken
            );

            let allRecords = profileData.Response?.profileRecords?.data?.records || {};

            // Merge character records
            const charRecords = profileData.Response?.characterRecords?.data || {};
            for (const charId in charRecords) {
                const recs = charRecords[charId].records || {};
                Object.assign(allRecords, recs);
            }

            console.log(`[getChallenges] Loaded ${Object.keys(allRecords).length} player records`);

            // 8. Get existing challenges
            const collRef = db.collection(`users/${userId}/destiny/challenges/seasonal_challenges`);
            const existingDocs = await collRef.get();
            tracker.trackRead(existingDocs.size, 'existing user challenges');

            const existingChallenges = {};
            existingDocs.forEach(doc => {
                existingChallenges[doc.id] = doc.data();
            });

            // 9. Process challenges
            const batch = new FirestoreBatch(db, tracker);
            const challengeStats = {
                totalChallenges: 0,
                completedChallenges: 0,
                activeChallenges: 0,
                updatedChallenges: 0,
                seasonHash: seasonReference.seasonHash,
                seasonName: seasonReference.seasonName
            };

            let stats = {
                totalProcessed: 0,
                updated: 0,
                unchanged: 0,
                completed: 0,
                active: 0,
                persistent: 0
            };

            // Process all challenges
            for (const hash of seasonReference.allChallenges) {
                const record = allRecords[hash];
                const definition = seasonReference.challengeDefinitions[hash];

                if (!record || record.state === undefined || !definition) {
                    continue;
                }

                stats.totalProcessed++;

                // Check if active
                const active = isChallengeActive(hash, seasonReference, currentWeek);
                if (active) stats.active++;

                // Check if persistent
                if (seasonReference.persistentChallenges?.includes(hash)) {
                    stats.persistent++;
                }

                // Build challenge data
                const challengeData = {
                    hash,
                    seasonHash: seasonReference.seasonHash,
                    seasonName: seasonReference.seasonName,
                    name: definition.name,
                    description: definition.description,
                    completed: !!(record.state & 1),
                    claimed: !!(record.state & 2),
                    visible: !(record.state & 4),
                    active,
                    weekUnlocked: findChallengeWeek(hash, seasonReference.weeklyMap),
                    parentNodeHash: seasonReference.challengesNodeHash,
                    hasWeeklyStructure: seasonReference.hasWeeklyStructure,
                    isPersistent: seasonReference.persistentChallenges?.includes(hash) || false,
                    objectives: processObjectives(record.objectives),
                    xp: extractXPTier(definition.rewardItems),
                    updatedAt: Date.now()
                };

                // Update stats
                challengeStats.totalChallenges++;
                if (challengeData.completed) {
                    challengeStats.completedChallenges++;
                    stats.completed++;
                }
                if (challengeData.active) {
                    challengeStats.activeChallenges++;
                }

                // Check if needs updating
                const existing = existingChallenges[hash];
                if (hasSignificantChanges(existing, challengeData)) {
                    challengeData.createdAt = existing?.createdAt || Date.now();
                    batch.set(collRef.doc(hash), challengeData, { merge: true });
                    challengeStats.updatedChallenges++;
                    stats.updated++;
                } else {
                    stats.unchanged++;
                }
            }

            // 10. Commit batch
            await batch.commit('challenge updates');

            // 11. Calculate weekly info
            const weeklyInfo = calculateWeeklyInfo(seasonReference, currentWeek);

            // 12. Update stats
            const infrastructureStats = tracker.calculateRealCosts();

            await Promise.all([
                statsManager.updateChallengeStats({
                    userId,
                    challengeStats,
                    weeklyInfo,
                    infrastructureStats
                }),
                statsManager.calculatePerformanceMetrics()
            ]);

            // 13. Track API performance
            const endTime = Date.now();
            await trackAPIPerformance(db, userId, startTime, endTime, true, null, tracker);

            // Return response
            return res.json({
                ok: true,
                updated: stats.updated,
                unchanged: stats.unchanged,
                season: {
                    name: seasonReference.seasonName,
                    hash: seasonReference.seasonHash,
                    challengesNodeHash: seasonReference.challengesNodeHash,
                    autoDetected: currentSeason.autoDetected || false
                },
                weeklyInfo: {
                    ...weeklyInfo,
                    currentWeekChallenges: weeklyInfo.currentWeekNewChallenges
                },
                referenceInfo: {
                    hasWeeklyStructure: seasonReference.hasWeeklyStructure,
                    totalWeeks: seasonReference.totalWeeks,
                    highestWeekNumber: seasonReference.highestWeekNumber,
                    persistentChallengesCount: seasonReference.persistentChallenges?.length || 0,
                    builtAt: seasonReference.builtAt,
                    validUntil: seasonReference.validUntil,
                    cacheVersion: seasonReference.cacheVersion
                },
                globalStats: challengeStats,
                infrastructureStats,
                performance: {
                    duration: endTime - startTime
                }
            });

        } catch (err) {
            const endTime = Date.now();
            await trackAPIPerformance(db, userId, startTime, endTime, false, err.message, tracker);
            return fail(500, "Error processing challenges", { errorDetail: err.message });
        }
    }
);

// Helper functions
async function getActiveSeason(db, tracker) {
    try {
        const seasonsRef = db.collection('destiny/global/seasons');
        const activeSeasonQuery = await seasonsRef.where('seasonActive', '==', true).limit(1).get();
        tracker.trackRead(1, 'active season query');

        if (!activeSeasonQuery.empty) {
            const seasonDoc = activeSeasonQuery.docs[0];
            return {
                id: seasonDoc.id,
                ...seasonDoc.data()
            };
        }
        return null;
    } catch (err) {
        console.error('[getActiveSeason] Error:', err);
        return null;
    }
}

async function saveActiveSeason(db, seasonData, tracker) {
    try {
        const batch = db.batch();

        // Deactivate existing seasons
        const existingSeasons = await db.collection('destiny/global/seasons')
            .where('seasonActive', '==', true).get();
        tracker.trackRead(existingSeasons.size, 'existing active seasons');

        existingSeasons.forEach(doc => {
            batch.update(doc.ref, { seasonActive: false, deactivatedAt: Date.now() });
        });

        // Add new season
        const newSeasonRef = db.collection('destiny/global/seasons').doc(seasonData.seasonHash);
        batch.set(newSeasonRef, seasonData, { merge: true });

        await batch.commit();
        tracker.trackBatchWrite(existingSeasons.size + 1, 'season activation');

        return seasonData;
    } catch (err) {
        console.error('[saveActiveSeason] Error:', err);
        throw err;
    }
}

function findChallengeWeek(challengeHash, weeklyMap) {
    for (const [weekKey, weekData] of Object.entries(weeklyMap)) {
        if (weekData.challenges?.includes(challengeHash)) {
            return parseInt(weekKey.replace('week_', ''));
        }
    }
    return null;
}

function processObjectives(recordObjectives) {
    if (!recordObjectives || typeof recordObjectives !== 'object') {
        return [];
    }

    const objArray = Array.isArray(recordObjectives) ? recordObjectives : Object.values(recordObjectives);

    return objArray.map(obj => ({
        objectiveHash: obj?.objectiveHash || 0,
        description: obj?.description || '',
        progress: obj?.progress || 0,
        completionValue: obj?.completionValue || 1,
        complete: obj?.complete || false,
    }));
}

function extractXPTier(rewardItems) {
    if (!rewardItems?.length) return null;

    for (const r of rewardItems) {
        const desc = r.rewardedLabel || r.displayProperties?.name || '';
        const match = desc.match(/XP(\+{1,5})/);
        if (match) {
            const tier = match[1].length;
            return ['Large', 'XL', 'XXL', '4XL', '8XL'][tier - 1] || 'Unknown';
        }
    }
    return null;
}

function hasSignificantChanges(existing, newData) {
    if (!existing) return true;

    const significantFields = ['completed', 'claimed', 'visible', 'active', 'seasonHash', 'name', 'description'];

    for (const field of significantFields) {
        if (existing[field] !== newData[field]) {
            return true;
        }
    }

    // Check objectives
    if (!existing.objectives || !newData.objectives) {
        return existing.objectives !== newData.objectives;
    }

    if (existing.objectives.length !== newData.objectives.length) {
        return true;
    }

    for (let i = 0; i < existing.objectives.length; i++) {
        if (existing.objectives[i].progress !== newData.objectives[i].progress ||
            existing.objectives[i].complete !== newData.objectives[i].complete) {
            return true;
        }
    }

    return false;
}

function calculateWeeklyInfo(seasonReference, currentWeek) {
    const availableChallenges = new Set();
    const availableByWeek = {};
    let currentWeekNewChallenges = 0;

    // Add persistent challenges
    if (seasonReference.persistentChallenges?.length > 0) {
        seasonReference.persistentChallenges.forEach(hash => availableChallenges.add(hash));
    }

    if (seasonReference.hasWeeklyStructure) {
        // Add challenges up to current week
        for (let week = 1; week <= currentWeek; week++) {
            const weekKey = `week_${week}`;
            const weekData = seasonReference.weeklyMap[weekKey];

            if (weekData?.challenges?.length > 0) {
                availableByWeek[weekKey] = {
                    ...weekData,
                    isCurrentWeek: week === currentWeek,
                    isAvailable: true
                };

                weekData.challenges.forEach(hash => availableChallenges.add(hash));

                if (week === currentWeek) {
                    currentWeekNewChallenges = weekData.challenges.length;
                }
            }
        }

        // Add future weeks as unavailable
        const maxWeek = seasonReference.highestWeekNumber || seasonReference.totalWeeks;
        for (let week = currentWeek + 1; week <= maxWeek; week++) {
            const weekKey = `week_${week}`;
            const weekData = seasonReference.weeklyMap[weekKey];

            if (weekData) {
                availableByWeek[weekKey] = {
                    ...weekData,
                    isCurrentWeek: false,
                    isAvailable: false
                };
            }
        }
    } else {
        // No weekly structure - all available
        seasonReference.allChallenges.forEach(hash => availableChallenges.add(hash));
    }

    return {
        currentWeek,
        hasWeeklyStructure: seasonReference.hasWeeklyStructure,
        totalWeeks: seasonReference.highestWeekNumber || seasonReference.totalWeeks,
        availableChallenges: availableChallenges.size,
        currentWeekNewChallenges,
        totalPersistentChallenges: seasonReference.persistentChallenges?.length || 0,
        availableByWeek
    };
}

async function trackAPIPerformance(db, userId, startTime, endTime, success, errorType, tracker) {
    try {
        const duration = endTime - startTime;
        const today = new Date().toISOString().split('T')[0];
        const perfRef = db.doc(`destiny/global/api_performance/${today}`);

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
        tracker.trackWrite(1, 'api performance tracking');
    } catch (err) {
        console.error('[trackAPIPerformance] Error:', err);
    }
}