// ============================================
// api/rebuildTranslationStats.mjs - Stats Rebuild Function Aligned with Pipeline
// ============================================

import { onRequest } from "firebase-functions/v2/https";
import { db, firebaseAdmin } from "../config/firebase.mjs";
import { FieldValue } from "firebase-admin/firestore";

const BATCH_SIZE = 500; // Process documents in batches
const WRITE_BATCH_SIZE = 400; // Firestore batch write limit is 500, leave margin

export const rebuildTranslationStats = onRequest(
    {
        region: "australia-southeast1",
        timeoutSeconds: 540,
        memory: "2GiB",
        maxInstances: 1,
        cors: true,
    },
    async (req, res) => {
        // Set CORS headers
        res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if (req.method === "OPTIONS") {
            return res.status(204).send("");
        }

        // Hardcoded admin key - disable function when not in use
        const ADMIN_KEY =
            "xK9m2P7qR4sT6vW8yA3bC5dE7fG9hJ2kL4mN6pQ8rS0tU2vW4xY6zA8bC0dE2fG4";
        const authHeader = req.headers.authorization;
        if (!authHeader || authHeader !== `Bearer ${ADMIN_KEY}`) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        const startTime = Date.now();
        const backupTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const backupPath = `backups/${backupTimestamp}`;

        console.log(`Starting stats rebuild at ${backupTimestamp}`);

        try {
            // Phase 1: Backup existing stats
            console.log("Phase 1: Backing up existing stats...");
            const backupResults = await backupExistingStats(backupPath);
            console.log(`Backed up ${backupResults.totalDocs} documents`);

            // Phase 2: Clear existing stats (after successful backup)
            console.log("Phase 2: Clearing existing stats...");
            await clearExistingStats();

            // Phase 3: Initialize new stats structure
            console.log("Phase 3: Initializing stats structure...");
            const stats = initializeStatsStructure();

            // Phase 4: Process main translations collection (the cache)
            console.log("Phase 4: Processing cached translations...");
            const cacheStats = await processCachedTranslations(stats);
            console.log(`Processed ${cacheStats.count} cached translations`);

            // Phase 5: Process user translation histories
            console.log("Phase 5: Processing user translation histories...");
            const userStats = await processUserTranslationHistories(stats);
            console.log(`Processed ${userStats.count} user translation histories`);

            // Phase 6: Process Discord user histories
            console.log("Phase 6: Processing Discord user histories...");
            const discordUserStats = await processDiscordUserHistories(stats);
            console.log(`Processed ${discordUserStats.count} Discord user histories`);

            // Phase 7: Process Discord channel histories
            console.log("Phase 7: Processing Discord channel histories...");
            const discordChannelStats = await processDiscordChannelHistories(stats);
            console.log(
                `Processed ${discordChannelStats.count} Discord channel histories`
            );

            // Phase 8: Write aggregated stats to Firestore
            console.log("Phase 8: Writing aggregated stats...");
            await writeAggregatedStats(stats);

            const duration = Date.now() - startTime;
            const summary = {
                success: true,
                backupPath,
                backupTimestamp,
                duration: `${(duration / 1000).toFixed(2)}s`,
                stats: {
                    backed_up: backupResults.totalDocs,
                    cached_translations: cacheStats.count,
                    user_histories: userStats.count,
                    discord_user_histories: discordUserStats.count,
                    discord_channel_histories: discordChannelStats.count,
                    total_processed:
                        cacheStats.count +
                        userStats.count +
                        discordUserStats.count +
                        discordChannelStats.count,
                },
            };

            console.log("Rebuild complete:", summary);
            return res.status(200).json(summary);
        } catch (error) {
            console.error("Rebuild failed:", error);
            return res.status(500).json({
                error: "Rebuild failed",
                message: error.message,
                backupPath,
            });
        }
    }
);

// ============================================
// Helper Functions
// ============================================

// Normalize token data from various formats to standard format
function normalizeTokenUsage(data) {
    // Check for the correct format first
    if (data.tokenUsage && typeof data.tokenUsage === "object") {
        return {
            prompt: data.tokenUsage.prompt || 0,
            completion:
                data.tokenUsage.completion || data.tokenUsage.completions || 0,
            total: data.tokenUsage.total || 0,
        };
    }

    // Check for old format fields
    if (
        data.promptTokens !== undefined ||
        data.completionTokens !== undefined ||
        data.totalTokens !== undefined
    ) {
        return {
            prompt: data.promptTokens || 0,
            completion: data.completionTokens || 0,
            total: data.totalTokens || 0,
        };
    }

    // No token data found
    return null;
}

// Calculate word and character counts
function calculateTextMetrics(text) {
    if (!text) return { wordCount: 0, charCount: 0 };

    const wordCount = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
    const charCount = text.length;

    return { wordCount, charCount };
}

// Calculate saved tokens based on cache usage
function calculateSavedTokens(tokenUsage, timesUsed) {
    if (!tokenUsage || timesUsed <= 1) return null;

    // Each reuse saves the full token cost
    const timesSaved = timesUsed - 1;
    return {
        prompt: tokenUsage.prompt * timesSaved,
        completion: tokenUsage.completion * timesSaved,
        total: tokenUsage.total * timesSaved,
    };
}

// ============================================
// Process Cached Translations (Main Cache)
// ============================================

async function processCachedTranslations(stats) {
    let count = 0;
    let lastDoc = null;

    while (true) {
        let query = db
            .collection("translations")
            .orderBy("__name__")
            .limit(BATCH_SIZE);

        if (lastDoc) {
            query = query.startAfter(lastDoc);
        }

        const snapshot = await query.get();
        if (snapshot.empty) break;

        for (const doc of snapshot.docs) {
            // Skip meta, discord, and error documents
            if (doc.id === "meta" || doc.id === "discord" || doc.id === "errors") {
                continue;
            }

            const data = doc.data();
            if (!data) continue;

            // Calculate metrics if missing
            if (data.inputText && (!data.wordCount || !data.charCount)) {
                const metrics = calculateTextMetrics(data.inputText);
                data.wordCount = data.wordCount || metrics.wordCount;
                data.charCount = data.charCount || metrics.charCount;
            }

            // Normalize token usage
            const tokenUsage = normalizeTokenUsage(data);

            // Calculate saved tokens from cache hits
            const timesUsed = data.timesTranslated || 1;
            const savedTokens = calculateSavedTokens(tokenUsage, timesUsed);

            // Update global stats
            stats.global.totalTranslations += timesUsed; // Count each use
            stats.global.cachedTranslations += Math.max(0, timesUsed - 1); // Cache hits
            stats.global.freshTranslations += 1; // Original translation
            stats.global.totalWords += (data.wordCount || 0) * timesUsed;
            stats.global.totalChars += (data.charCount || 0) * timesUsed;

            if (tokenUsage) {
                // Original translation tokens
                stats.global.tokenUsage.prompt += tokenUsage.prompt;
                stats.global.tokenUsage.completion += tokenUsage.completion;
                stats.global.tokenUsage.total += tokenUsage.total;
            }

            if (savedTokens) {
                // Saved tokens from cache hits
                stats.global.savedTokenUsage.prompt += savedTokens.prompt;
                stats.global.savedTokenUsage.completion += savedTokens.completion;
                stats.global.savedTokenUsage.total += savedTokens.total;
            }

            // Update language stats
            if (data.targetLang) {
                updateLanguageStats(
                    stats.languages,
                    data.targetLang,
                    data,
                    tokenUsage,
                    timesUsed
                );
            }

            // Update time-based stats
            const timestamp =
                data.firstTranslated || data.createdAt || data.timestamp;
            if (timestamp) {
                updateTimeBasedStats(
                    stats,
                    timestamp,
                    data,
                    tokenUsage,
                    savedTokens,
                    timesUsed
                );
            }

            count++;
        }

        lastDoc = snapshot.docs[snapshot.docs.length - 1];
        console.log(`Processed ${count} cached translations so far...`);
    }

    return { count };
}

// ============================================
// Process User Translation Histories
// ============================================

async function processUserTranslationHistories(stats) {
    let totalCount = 0;
    const usersSnapshot = await db.collection("users").get();

    for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        let userCount = 0;
        let lastDoc = null;

        // Initialize user stats
        if (!stats.users.has(userId)) {
            stats.users.set(userId, {
                totalTranslations: 0,
                cachedTranslations: 0,
                freshTranslations: 0,
                totalWords: 0,
                totalChars: 0,
                totalResponseTime: 0,
                tokenUsage: { prompt: 0, completion: 0, total: 0 },
                savedTokenUsage: { prompt: 0, completion: 0, total: 0 },
            });
        }

        while (true) {
            let query = db
                .collection(`users/${userId}/translations`)
                .orderBy("__name__")
                .limit(BATCH_SIZE);

            if (lastDoc) {
                query = query.startAfter(lastDoc);
            }

            const snapshot = await query.get();
            if (snapshot.empty) break;

            for (const doc of snapshot.docs) {
                if (doc.id === "meta") continue;

                const data = doc.data();
                if (!data) continue;

                // Calculate metrics if missing
                if (data.inputText && (!data.wordCount || !data.charCount)) {
                    const metrics = calculateTextMetrics(data.inputText);
                    data.wordCount = data.wordCount || metrics.wordCount;
                    data.charCount = data.charCount || metrics.charCount;
                }

                // Normalize tokens
                const tokenUsage = normalizeTokenUsage(data);

                // Process user translation
                const userStats = stats.users.get(userId);
                userStats.totalTranslations++;
                userStats.totalWords += data.wordCount || 0;
                userStats.totalChars += data.charCount || 0;
                userStats.totalResponseTime +=
                    data.apiLatencyMs || data.responseTime || 0;

                const isCached = data.cached === true;
                if (isCached) {
                    userStats.cachedTranslations++;
                    if (tokenUsage) {
                        userStats.savedTokenUsage.prompt += tokenUsage.prompt;
                        userStats.savedTokenUsage.completion += tokenUsage.completion;
                        userStats.savedTokenUsage.total += tokenUsage.total;
                    }
                } else {
                    userStats.freshTranslations++;
                    if (tokenUsage) {
                        userStats.tokenUsage.prompt += tokenUsage.prompt;
                        userStats.tokenUsage.completion += tokenUsage.completion;
                        userStats.tokenUsage.total += tokenUsage.total;
                    }
                }

                userCount++;
                totalCount++;
            }

            lastDoc = snapshot.docs[snapshot.docs.length - 1];
        }

        if (userCount > 0) {
            console.log(`Processed ${userCount} translations for user ${userId}`);
        }
    }

    return { count: totalCount };
}

// ============================================
// Process Discord User Histories
// ============================================

async function processDiscordUserHistories(stats) {
    let count = 0;
    const discordUsersSnapshot = await db
        .collection("translations/discord/users")
        .get();

    for (const userDoc of discordUsersSnapshot.docs) {
        const userId = userDoc.id;
        let lastDoc = null;

        // Initialize Discord user stats
        if (!stats.discord.users.has(userId)) {
            stats.discord.users.set(userId, {
                totalTranslations: 0,
                cachedTranslations: 0,
                freshTranslations: 0,
                totalWords: 0,
                totalChars: 0,
                totalResponseTime: 0,
                tokenUsage: { prompt: 0, completion: 0, total: 0 },
                savedTokenUsage: { prompt: 0, completion: 0, total: 0 },
                userName: null,
            });
        }

        while (true) {
            let query = db
                .collection(`translations/discord/users/${userId}/history`)
                .orderBy("__name__")
                .limit(BATCH_SIZE);

            if (lastDoc) {
                query = query.startAfter(lastDoc);
            }

            const snapshot = await query.get();
            if (snapshot.empty) break;

            for (const doc of snapshot.docs) {
                const data = doc.data();
                if (!data) continue;

                // Calculate metrics if missing
                if (data.inputText && (!data.wordCount || !data.charCount)) {
                    const metrics = calculateTextMetrics(data.inputText);
                    data.wordCount = data.wordCount || metrics.wordCount;
                    data.charCount = data.charCount || metrics.charCount;
                }

                // Normalize tokens
                const tokenUsage = normalizeTokenUsage(data);

                // Update Discord global stats
                stats.discord.totalTranslations++;
                stats.discord.totalWords += data.wordCount || 0;
                stats.discord.totalChars += data.charCount || 0;
                stats.discord.totalResponseTime +=
                    data.apiLatencyMs || data.responseTime || 0;

                const isCached = data.cached === true;
                if (isCached) {
                    stats.discord.cachedTranslations++;
                    if (tokenUsage) {
                        stats.discord.savedTokenUsage.prompt += tokenUsage.prompt;
                        stats.discord.savedTokenUsage.completion += tokenUsage.completion;
                        stats.discord.savedTokenUsage.total += tokenUsage.total;
                    }
                } else {
                    stats.discord.freshTranslations++;
                    if (tokenUsage) {
                        stats.discord.tokenUsage.prompt += tokenUsage.prompt;
                        stats.discord.tokenUsage.completion += tokenUsage.completion;
                        stats.discord.tokenUsage.total += tokenUsage.total;
                    }
                }

                // Update Discord user stats
                const userStats = stats.discord.users.get(userId);
                userStats.totalTranslations++;
                userStats.totalWords += data.wordCount || 0;
                userStats.totalChars += data.charCount || 0;
                userStats.totalResponseTime +=
                    data.apiLatencyMs || data.responseTime || 0;
                userStats.userName = userStats.userName || data.userName;

                if (isCached) {
                    userStats.cachedTranslations++;
                    if (tokenUsage) {
                        userStats.savedTokenUsage.prompt += tokenUsage.prompt;
                        userStats.savedTokenUsage.completion += tokenUsage.completion;
                        userStats.savedTokenUsage.total += tokenUsage.total;
                    }
                } else {
                    userStats.freshTranslations++;
                    if (tokenUsage) {
                        userStats.tokenUsage.prompt += tokenUsage.prompt;
                        userStats.tokenUsage.completion += tokenUsage.completion;
                        userStats.tokenUsage.total += tokenUsage.total;
                    }
                }

                // Update Discord language stats
                if (data.targetLang) {
                    updateLanguageStats(
                        stats.discordLanguages,
                        data.targetLang,
                        data,
                        tokenUsage,
                        1
                    );
                }

                // Update Discord time-based stats
                const timestamp = data.timestamp || data.createdAt;
                if (timestamp) {
                    updateDiscordTimeBasedStats(
                        stats,
                        timestamp,
                        data,
                        tokenUsage,
                        isCached
                    );
                }

                count++;
            }

            lastDoc = snapshot.docs[snapshot.docs.length - 1];
        }
    }

    return { count };
}

// ============================================
// Process Discord Channel Histories
// ============================================

async function processDiscordChannelHistories(stats) {
    let count = 0;
    const guildsSnapshot = await db
        .collection("translations/discord/guilds")
        .get();

    for (const guildDoc of guildsSnapshot.docs) {
        const guildId = guildDoc.id;

        // Initialize guild stats
        if (!stats.discord.guilds.has(guildId)) {
            stats.discord.guilds.set(guildId, {
                totalTranslations: 0,
                cachedTranslations: 0,
                freshTranslations: 0,
                totalWords: 0,
                totalChars: 0,
                totalResponseTime: 0,
                tokenUsage: { prompt: 0, completion: 0, total: 0 },
                savedTokenUsage: { prompt: 0, completion: 0, total: 0 },
                guildName: null,
                uniqueUsers: new Set(),
                channels: new Map(),
            });
        }

        const channelsSnapshot = await db
            .collection(`translations/discord/guilds/${guildId}/channels`)
            .get();

        for (const channelDoc of channelsSnapshot.docs) {
            const channelId = channelDoc.id;
            let lastDoc = null;

            // Initialize channel stats
            const guildStats = stats.discord.guilds.get(guildId);
            if (!guildStats.channels.has(channelId)) {
                guildStats.channels.set(channelId, {
                    totalTranslations: 0,
                    cachedTranslations: 0,
                    freshTranslations: 0,
                    totalWords: 0,
                    totalChars: 0,
                    totalResponseTime: 0,
                    tokenUsage: { prompt: 0, completion: 0, total: 0 },
                    savedTokenUsage: { prompt: 0, completion: 0, total: 0 },
                    channelName: null,
                    uniqueUsers: new Set(),
                });
            }

            while (true) {
                let query = db
                    .collection(
                        `translations/discord/guilds/${guildId}/channels/${channelId}/history`
                    )
                    .orderBy("__name__")
                    .limit(BATCH_SIZE);

                if (lastDoc) {
                    query = query.startAfter(lastDoc);
                }

                const snapshot = await query.get();
                if (snapshot.empty) break;

                for (const doc of snapshot.docs) {
                    const data = doc.data();
                    if (!data) continue;

                    // Calculate metrics if missing
                    if (data.inputText && (!data.wordCount || !data.charCount)) {
                        const metrics = calculateTextMetrics(data.inputText);
                        data.wordCount = data.wordCount || metrics.wordCount;
                        data.charCount = data.charCount || metrics.charCount;
                    }

                    // Normalize tokens
                    const tokenUsage = normalizeTokenUsage(data);

                    const isCached = data.cached === true;

                    // Update guild stats
                    guildStats.totalTranslations++;
                    guildStats.totalWords += data.wordCount || 0;
                    guildStats.totalChars += data.charCount || 0;
                    guildStats.totalResponseTime +=
                        data.apiLatencyMs || data.responseTime || 0;
                    guildStats.guildName = guildStats.guildName || data.guildName;

                    if (data.userId) {
                        guildStats.uniqueUsers.add(data.userId);
                    }

                    if (isCached) {
                        guildStats.cachedTranslations++;
                        if (tokenUsage) {
                            guildStats.savedTokenUsage.prompt += tokenUsage.prompt;
                            guildStats.savedTokenUsage.completion += tokenUsage.completion;
                            guildStats.savedTokenUsage.total += tokenUsage.total;
                        }
                    } else {
                        guildStats.freshTranslations++;
                        if (tokenUsage) {
                            guildStats.tokenUsage.prompt += tokenUsage.prompt;
                            guildStats.tokenUsage.completion += tokenUsage.completion;
                            guildStats.tokenUsage.total += tokenUsage.total;
                        }
                    }

                    // Update channel stats
                    const channelStats = guildStats.channels.get(channelId);
                    channelStats.totalTranslations++;
                    channelStats.totalWords += data.wordCount || 0;
                    channelStats.totalChars += data.charCount || 0;
                    channelStats.totalResponseTime +=
                        data.apiLatencyMs || data.responseTime || 0;
                    channelStats.channelName =
                        channelStats.channelName || data.channelName;

                    if (data.userId) {
                        channelStats.uniqueUsers.add(data.userId);
                    }

                    if (isCached) {
                        channelStats.cachedTranslations++;
                        if (tokenUsage) {
                            channelStats.savedTokenUsage.prompt += tokenUsage.prompt;
                            channelStats.savedTokenUsage.completion += tokenUsage.completion;
                            channelStats.savedTokenUsage.total += tokenUsage.total;
                        }
                    } else {
                        channelStats.freshTranslations++;
                        if (tokenUsage) {
                            channelStats.tokenUsage.prompt += tokenUsage.prompt;
                            channelStats.tokenUsage.completion += tokenUsage.completion;
                            channelStats.tokenUsage.total += tokenUsage.total;
                        }
                    }

                    count++;
                }

                lastDoc = snapshot.docs[snapshot.docs.length - 1];
            }
        }
    }

    return { count };
}

// ============================================
// Update Stats Helper Functions
// ============================================

function updateLanguageStats(languageMap, lang, data, tokenUsage, timesUsed) {
    if (!languageMap.has(lang)) {
        languageMap.set(lang, {
            translations: 0,
            totalWords: 0,
            totalChars: 0,
            tokenUsage: { prompt: 0, completion: 0, total: 0 },
        });
    }

    const langStats = languageMap.get(lang);
    langStats.translations += timesUsed;
    langStats.totalWords += (data.wordCount || 0) * timesUsed;
    langStats.totalChars += (data.charCount || 0) * timesUsed;

    if (tokenUsage) {
        langStats.tokenUsage.prompt += tokenUsage.prompt;
        langStats.tokenUsage.completion += tokenUsage.completion;
        langStats.tokenUsage.total += tokenUsage.total;
    }
}

function updateTimeBasedStats(
    stats,
    timestamp,
    data,
    tokenUsage,
    savedTokens,
    timesUsed
) {
    const date = parseTimestamp(timestamp);
    if (!date) return;

    const dateKey = date.toISOString().split("T")[0];
    const hour = date.getHours();

    // Update daily stats
    if (!stats.daily.has(dateKey)) {
        stats.daily.set(dateKey, {
            date: dateKey,
            translations: 0,
            cachedTranslations: 0,
            freshTranslations: 0,
            totalWords: 0,
            totalChars: 0,
            totalResponseTime: 0,
            tokenUsage: { prompt: 0, completion: 0, total: 0 },
            savedTokenUsage: { prompt: 0, completion: 0, total: 0 },
            uniqueUsers: new Set(),
        });
    }

    const dailyStats = stats.daily.get(dateKey);
    dailyStats.translations += timesUsed;
    dailyStats.freshTranslations += 1;
    dailyStats.cachedTranslations += Math.max(0, timesUsed - 1);
    dailyStats.totalWords += (data.wordCount || 0) * timesUsed;
    dailyStats.totalChars += (data.charCount || 0) * timesUsed;
    dailyStats.totalResponseTime += (data.apiLatencyMs || 0) * timesUsed;

    if (tokenUsage) {
        dailyStats.tokenUsage.prompt += tokenUsage.prompt;
        dailyStats.tokenUsage.completion += tokenUsage.completion;
        dailyStats.tokenUsage.total += tokenUsage.total;
    }

    if (savedTokens) {
        dailyStats.savedTokenUsage.prompt += savedTokens.prompt;
        dailyStats.savedTokenUsage.completion += savedTokens.completion;
        dailyStats.savedTokenUsage.total += savedTokens.total;
    }

    // Update hourly stats
    if (!stats.hourly.has(dateKey)) {
        stats.hourly.set(dateKey, {});
    }

    const hourlyStats = stats.hourly.get(dateKey);
    const hourKey = `hour_${hour}`;

    if (!hourlyStats[hourKey]) {
        hourlyStats[hourKey] = {
            translations: 0,
            cachedTranslations: 0,
            freshTranslations: 0,
            responseTime: 0,
            words: 0,
            chars: 0,
            tokenUsage: { prompt: 0, completion: 0, total: 0 },
            savedTokenUsage: { prompt: 0, completion: 0, total: 0 },
        };
    }

    hourlyStats[hourKey].translations += timesUsed;
    hourlyStats[hourKey].freshTranslations += 1;
    hourlyStats[hourKey].cachedTranslations += Math.max(0, timesUsed - 1);
    hourlyStats[hourKey].responseTime += (data.apiLatencyMs || 0) * timesUsed;
    hourlyStats[hourKey].words += (data.wordCount || 0) * timesUsed;
    hourlyStats[hourKey].chars += (data.charCount || 0) * timesUsed;

    if (tokenUsage) {
        hourlyStats[hourKey].tokenUsage.prompt += tokenUsage.prompt;
        hourlyStats[hourKey].tokenUsage.completion += tokenUsage.completion;
        hourlyStats[hourKey].tokenUsage.total += tokenUsage.total;
    }

    if (savedTokens) {
        hourlyStats[hourKey].savedTokenUsage.prompt += savedTokens.prompt;
        hourlyStats[hourKey].savedTokenUsage.completion += savedTokens.completion;
        hourlyStats[hourKey].savedTokenUsage.total += savedTokens.total;
    }
}

function updateDiscordTimeBasedStats(
    stats,
    timestamp,
    data,
    tokenUsage,
    isCached
) {
    const date = parseTimestamp(timestamp);
    if (!date) return;

    const dateKey = date.toISOString().split("T")[0];
    const hour = date.getHours();

    // Update Discord daily stats
    if (!stats.discordDaily.has(dateKey)) {
        stats.discordDaily.set(dateKey, {
            date: dateKey,
            translations: 0,
            cachedTranslations: 0,
            freshTranslations: 0,
            totalWords: 0,
            totalChars: 0,
            totalResponseTime: 0,
            tokenUsage: { prompt: 0, completion: 0, total: 0 },
            savedTokenUsage: { prompt: 0, completion: 0, total: 0 },
            uniqueUsers: new Set(),
            uniqueGuilds: new Set(),
        });
    }

    const dailyStats = stats.discordDaily.get(dateKey);
    dailyStats.translations++;
    dailyStats.totalWords += data.wordCount || 0;
    dailyStats.totalChars += data.charCount || 0;
    dailyStats.totalResponseTime += data.apiLatencyMs || data.responseTime || 0;

    if (data.userId) dailyStats.uniqueUsers.add(data.userId);
    if (data.guildId) dailyStats.uniqueGuilds.add(data.guildId);

    if (isCached) {
        dailyStats.cachedTranslations++;
        if (tokenUsage) {
            dailyStats.savedTokenUsage.prompt += tokenUsage.prompt;
            dailyStats.savedTokenUsage.completion += tokenUsage.completion;
            dailyStats.savedTokenUsage.total += tokenUsage.total;
        }
    } else {
        dailyStats.freshTranslations++;
        if (tokenUsage) {
            dailyStats.tokenUsage.prompt += tokenUsage.prompt;
            dailyStats.tokenUsage.completion += tokenUsage.completion;
            dailyStats.tokenUsage.total += tokenUsage.total;
        }
    }

    // Update Discord hourly stats
    if (!stats.discordHourly.has(dateKey)) {
        stats.discordHourly.set(dateKey, {});
    }

    const hourlyStats = stats.discordHourly.get(dateKey);
    const hourKey = `hour_${hour}`;

    if (!hourlyStats[hourKey]) {
        hourlyStats[hourKey] = {
            translations: 0,
            cachedTranslations: 0,
            freshTranslations: 0,
            responseTime: 0,
            words: 0,
            chars: 0,
            tokenUsage: { prompt: 0, completion: 0, total: 0 },
            savedTokenUsage: { prompt: 0, completion: 0, total: 0 },
            uniqueUsers: new Set(),
            uniqueGuilds: new Set(),
        };
    }

    hourlyStats[hourKey].translations++;
    hourlyStats[hourKey].responseTime +=
        data.apiLatencyMs || data.responseTime || 0;
    hourlyStats[hourKey].words += data.wordCount || 0;
    hourlyStats[hourKey].chars += data.charCount || 0;

    if (data.userId) hourlyStats[hourKey].uniqueUsers.add(data.userId);
    if (data.guildId) hourlyStats[hourKey].uniqueGuilds.add(data.guildId);

    if (isCached) {
        hourlyStats[hourKey].cachedTranslations++;
        if (tokenUsage) {
            hourlyStats[hourKey].savedTokenUsage.prompt += tokenUsage.prompt;
            hourlyStats[hourKey].savedTokenUsage.completion += tokenUsage.completion;
            hourlyStats[hourKey].savedTokenUsage.total += tokenUsage.total;
        }
    } else {
        hourlyStats[hourKey].freshTranslations++;
        if (tokenUsage) {
            hourlyStats[hourKey].tokenUsage.prompt += tokenUsage.prompt;
            hourlyStats[hourKey].tokenUsage.completion += tokenUsage.completion;
            hourlyStats[hourKey].tokenUsage.total += tokenUsage.total;
        }
    }
}

function parseTimestamp(timestamp) {
    if (!timestamp) return null;

    try {
        if (timestamp._seconds) {
            return new Date(timestamp._seconds * 1000);
        } else if (timestamp.toDate && typeof timestamp.toDate === "function") {
            return timestamp.toDate();
        } else if (timestamp instanceof Date) {
            return timestamp;
        } else {
            return new Date(timestamp);
        }
    } catch (e) {
        console.error("Failed to parse timestamp:", e);
        return null;
    }
}

// ============================================
// Initialize Stats Structure
// ============================================

function initializeStatsStructure() {
    return {
        global: {
            totalTranslations: 0,
            cachedTranslations: 0,
            freshTranslations: 0,
            totalWords: 0,
            totalChars: 0,
            totalResponseTime: 0,
            tokenUsage: { prompt: 0, completion: 0, total: 0 },
            savedTokenUsage: { prompt: 0, completion: 0, total: 0 },
        },
        discord: {
            totalTranslations: 0,
            cachedTranslations: 0,
            freshTranslations: 0,
            totalWords: 0,
            totalChars: 0,
            totalResponseTime: 0,
            tokenUsage: { prompt: 0, completion: 0, total: 0 },
            savedTokenUsage: { prompt: 0, completion: 0, total: 0 },
            guilds: new Map(),
            users: new Map(),
        },
        users: new Map(),
        languages: new Map(),
        daily: new Map(),
        hourly: new Map(),
        discordDaily: new Map(),
        discordHourly: new Map(),
        discordLanguages: new Map(),
    };
}

// ============================================
// Backup Functions (unchanged from original)
// ============================================

async function backupExistingStats(backupPath) {
    let totalDocs = 0;

    // Backup translations/meta document and its subcollections
    const metaDoc = await db.doc("translations/meta").get();
    if (metaDoc.exists) {
        await db.doc(`${backupPath}/stats_meta/main`).set(metaDoc.data());
        totalDocs++;

        const metaSubcollections = ["daily_stats", "hourly_stats", "languages"];
        for (const subcol of metaSubcollections) {
            const count = await backupCollection(
                `translations/meta/${subcol}`,
                `${backupPath}/stats_meta_${subcol}`
            );
            totalDocs += count;
        }
    }

    // Backup translations/discord document and its subcollections
    const discordDoc = await db.doc("translations/discord").get();
    if (discordDoc.exists) {
        await db.doc(`${backupPath}/stats_discord/main`).set(discordDoc.data());
        totalDocs++;

        const discordSubcollections = [
            { name: "daily_stats", hasNested: false },
            { name: "hourly_stats", hasNested: false },
            { name: "languages", hasNested: false },
            { name: "users", hasNested: true },
            { name: "guilds", hasNested: true },
        ];

        for (const subcol of discordSubcollections) {
            const count = await backupCollection(
                `translations/discord/${subcol.name}`,
                `${backupPath}/stats_discord_${subcol.name}`,
                subcol.hasNested
            );
            totalDocs += count;
        }
    }

    // Backup user translation stats
    const usersSnapshot = await db.collection("users").get();
    for (const userDoc of usersSnapshot.docs) {
        const userStatsPath = `users/${userDoc.id}/translations/meta`;
        const exists = await db.doc(userStatsPath).get();
        if (exists.exists) {
            await db.doc(`${backupPath}/user_stats/${userDoc.id}`).set(exists.data());
            totalDocs++;
        }
    }

    return { totalDocs };
}

async function backupCollection(
    sourcePath,
    destCollectionPath,
    includeSubcollections = false
) {
    let count = 0;
    let lastDoc = null;

    while (true) {
        let query = db.collection(sourcePath).orderBy("__name__").limit(BATCH_SIZE);

        if (lastDoc) {
            query = query.startAfter(lastDoc);
        }

        const snapshot = await query.get();
        if (snapshot.empty) break;

        const batch = db.batch();
        let batchCount = 0;

        for (const doc of snapshot.docs) {
            const destDoc = db.doc(`${destCollectionPath}/${doc.id}`);
            batch.set(destDoc, doc.data());
            count++;
            batchCount++;

            if (batchCount >= WRITE_BATCH_SIZE) {
                await batch.commit();
                batchCount = 0;
            }
        }

        if (batchCount > 0) {
            await batch.commit();
        }

        // Handle subcollections if needed
        if (includeSubcollections) {
            for (const doc of snapshot.docs) {
                if (sourcePath.includes("discord/users")) {
                    const historyCount = await backupCollection(
                        `${sourcePath}/${doc.id}/history`,
                        `${destCollectionPath}_${doc.id}_history`,
                        false
                    );
                    count += historyCount;
                } else if (sourcePath.includes("discord/guilds")) {
                    const channelsCount = await backupCollection(
                        `${sourcePath}/${doc.id}/channels`,
                        `${destCollectionPath}_${doc.id}_channels`,
                        false
                    );
                    count += channelsCount;

                    const channelsSnapshot = await db
                        .collection(`${sourcePath}/${doc.id}/channels`)
                        .get();
                    for (const channelDoc of channelsSnapshot.docs) {
                        const historyCount = await backupCollection(
                            `${sourcePath}/${doc.id}/channels/${channelDoc.id}/history`,
                            `${destCollectionPath}_${doc.id}_channels_${channelDoc.id}_history`,
                            false
                        );
                        count += historyCount;
                    }
                }
            }
        }

        lastDoc = snapshot.docs[snapshot.docs.length - 1];
    }

    return count;
}

// ============================================
// Clear Functions (unchanged from original)
// ============================================

async function clearExistingStats() {
    await deleteCollection("translations/meta/daily_stats");
    await deleteCollection("translations/meta/hourly_stats");
    await deleteCollection("translations/meta/languages");
    const metaDoc = await db.doc("translations/meta").get();
    if (metaDoc.exists) {
        await db.doc("translations/meta").delete();
    }

    await deleteCollection("translations/discord/daily_stats");
    await deleteCollection("translations/discord/hourly_stats");
    await deleteCollection("translations/discord/languages");

    const discordUsers = await db.collection("translations/discord/users").get();
    for (const userDoc of discordUsers.docs) {
        await deleteCollection(`translations/discord/users/${userDoc.id}/history`);
        await userDoc.ref.delete();
    }

    const discordGuilds = await db
        .collection("translations/discord/guilds")
        .get();
    for (const guildDoc of discordGuilds.docs) {
        const channels = await db
            .collection(`translations/discord/guilds/${guildDoc.id}/channels`)
            .get();
        for (const channelDoc of channels.docs) {
            await deleteCollection(
                `translations/discord/guilds/${guildDoc.id}/channels/${channelDoc.id}/history`
            );
            await channelDoc.ref.delete();
        }
        await guildDoc.ref.delete();
    }

    const discordDoc = await db.doc("translations/discord").get();
    if (discordDoc.exists) {
        await db.doc("translations/discord").delete();
    }

    const usersSnapshot = await db.collection("users").get();
    for (const userDoc of usersSnapshot.docs) {
        const metaPath = `users/${userDoc.id}/translations/meta`;
        const metaDoc = await db.doc(metaPath).get();
        if (metaDoc.exists) {
            await db.doc(metaPath).delete();
        }
    }
}

async function deleteCollection(collectionPath) {
    const collectionRef = db.collection(collectionPath);
    const batchSize = 100;
    const query = collectionRef.limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(query, resolve) {
    const snapshot = await query.get();

    if (snapshot.size === 0) {
        resolve();
        return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();

    process.nextTick(() => {
        deleteQueryBatch(query, resolve);
    });
}

// ============================================
// Write Aggregated Stats
// ============================================

async function writeAggregatedStats(stats) {
    const batches = [];
    let currentBatch = db.batch();
    let currentBatchCount = 0;

    const addToBatch = (ref, data, merge = true) => {
        if (currentBatchCount >= WRITE_BATCH_SIZE) {
            batches.push(currentBatch);
            currentBatch = db.batch();
            currentBatchCount = 0;
        }
        currentBatch.set(ref, data, { merge });
        currentBatchCount++;
    };

    // Write global stats
    addToBatch(db.doc("translations/meta"), {
        ...stats.global,
        lastTranslated: FieldValue.serverTimestamp(),
    });

    // Write Discord global stats (convert Sets to arrays)
    const { guilds, users, ...discordGlobalStats } = stats.discord;
    addToBatch(db.doc("translations/discord"), {
        ...discordGlobalStats,
        lastTranslated: FieldValue.serverTimestamp(),
    });

    // Write user stats
    for (const [userId, userStats] of stats.users.entries()) {
        addToBatch(db.doc(`users/${userId}/translations/meta`), {
            ...userStats,
            lastTranslated: FieldValue.serverTimestamp(),
        });
    }

    // Write language stats
    for (const [lang, langStats] of stats.languages.entries()) {
        addToBatch(db.doc(`translations/meta/languages/${lang}`), {
            ...langStats,
            lastUsed: FieldValue.serverTimestamp(),
        });
    }

    // Write Discord language stats
    for (const [lang, langStats] of stats.discordLanguages.entries()) {
        addToBatch(db.doc(`translations/discord/languages/${lang}`), {
            ...langStats,
            lastUsed: FieldValue.serverTimestamp(),
        });
    }

    // Write daily stats (convert Sets to arrays)
    for (const [date, dailyStats] of stats.daily.entries()) {
        const { uniqueUsers, ...dailyData } = dailyStats;
        addToBatch(db.doc(`translations/meta/daily_stats/${date}`), {
            ...dailyData,
            uniqueUsers: Array.from(uniqueUsers || []),
            updatedAt: FieldValue.serverTimestamp(),
        });
    }

    // Write hourly stats
    for (const [date, hourlyData] of stats.hourly.entries()) {
        addToBatch(db.doc(`translations/meta/hourly_stats/${date}`), {
            ...hourlyData,
            updatedAt: FieldValue.serverTimestamp(),
        });
    }

    // Write Discord user stats
    for (const [userId, userStats] of stats.discord.users.entries()) {
        addToBatch(db.doc(`translations/discord/users/${userId}`), {
            ...userStats,
            lastTranslated: FieldValue.serverTimestamp(),
        });
    }

    // Write Discord guild and channel stats
    for (const [guildId, guildStats] of stats.discord.guilds.entries()) {
        const { channels, uniqueUsers, ...guildData } = guildStats;
        addToBatch(db.doc(`translations/discord/guilds/${guildId}`), {
            ...guildData,
            uniqueUsers: Array.from(uniqueUsers || []),
            lastTranslated: FieldValue.serverTimestamp(),
        });

        // Write channel stats
        for (const [channelId, channelStats] of channels.entries()) {
            const { uniqueUsers: channelUsers, ...channelData } = channelStats;
            addToBatch(
                db.doc(`translations/discord/guilds/${guildId}/channels/${channelId}`),
                {
                    ...channelData,
                    uniqueUsers: Array.from(channelUsers || []),
                    lastTranslated: FieldValue.serverTimestamp(),
                }
            );
        }
    }

    // Write Discord daily stats (convert Sets to arrays)
    for (const [date, dailyStats] of stats.discordDaily.entries()) {
        const { uniqueUsers, uniqueGuilds, ...dailyData } = dailyStats;
        addToBatch(db.doc(`translations/discord/daily_stats/${date}`), {
            ...dailyData,
            uniqueUsers: Array.from(uniqueUsers || []),
            uniqueGuilds: Array.from(uniqueGuilds || []),
            updatedAt: FieldValue.serverTimestamp(),
        });
    }

    // Write Discord hourly stats (convert Sets to arrays)
    for (const [date, hourlyData] of stats.discordHourly.entries()) {
        const processedHourlyData = {};
        for (const [hourKey, hourStats] of Object.entries(hourlyData)) {
            const { uniqueUsers, uniqueGuilds, ...hourData } = hourStats;
            processedHourlyData[hourKey] = {
                ...hourData,
                uniqueUsers: Array.from(uniqueUsers || []),
                uniqueGuilds: Array.from(uniqueGuilds || []),
            };
        }
        addToBatch(db.doc(`translations/discord/hourly_stats/${date}`), {
            ...processedHourlyData,
            updatedAt: FieldValue.serverTimestamp(),
        });
    }

    // Add current batch if it has operations
    if (currentBatchCount > 0) {
        batches.push(currentBatch);
    }

    // Commit all batches
    console.log(`Committing ${batches.length} batches...`);
    for (let i = 0; i < batches.length; i++) {
        await batches[i].commit();
        console.log(`Committed batch ${i + 1}/${batches.length}`);
    }
}
