import crypto from "crypto";
import { db } from "../config/firebase.mjs";
import { FieldValue } from "firebase-admin/firestore";

export class DiscordStatsProcessor {
    async process(data) {
        const batch = db.batch();
        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const hour = now.getHours();

        // Refs we may need across writes
        const globalRef = db.doc("translations/discord");
        const userRef = data.platformInfo?.userId
            ? db.doc(`translations/discord/users/${data.platformInfo.userId}`)
            : null;
        const guildRef = data.platformInfo?.guildId
            ? db.doc(`translations/discord/guilds/${data.platformInfo.guildId}`)
            : null;
        const channelRef =
            data.platformInfo?.guildId && data.platformInfo?.channelId
                ? db.doc(
                    `translations/discord/guilds/${data.platformInfo.guildId}/channels/${data.platformInfo.channelId}`
                )
                : null;

        // ------------------------------------------------------------
        // Pre-read existence to decide whether to bump top-level counts
        // ------------------------------------------------------------
        let guildExists = true;
        let channelExists = true;
        let userExists = true;

        try {
            const reads = await Promise.all([
                guildRef ? guildRef.get() : Promise.resolve(null),
                channelRef ? channelRef.get() : Promise.resolve(null),
                userRef ? userRef.get() : Promise.resolve(null),
            ]);
            const [gSnap, cSnap, uSnap] = reads;
            if (gSnap) guildExists = gSnap.exists;
            if (cSnap) channelExists = cSnap.exists;
            if (uSnap) userExists = uSnap.exists;
        } catch (e) {
            // If reads fail, fall back to not incrementing counts.
            console.error("[DiscordStatsProcessor] existence pre-read failed:", e);
        }

        try {
            // 1) Global Discord stats — include conditional count bumps
            const globalUpdate = this.buildGlobalUpdate(data, {
                incrementGuild: guildRef && !guildExists,
                incrementChannel: channelRef && !channelExists,
                incrementUser: userRef && !userExists,
            });
            batch.set(globalRef, globalUpdate, { merge: true });

            // 2) User stats and history
            if (userRef) {
                const userUpdate = this.buildUserUpdate(data);
                batch.set(userRef, userUpdate, { merge: true });

                if (data.translationData) {
                    const userHistoryRef = db
                        .collection(`translations/discord/users/${data.platformInfo.userId}/history`)
                        .doc();
                    batch.set(userHistoryRef, {
                        ...data.translationData,
                        timestamp: FieldValue.serverTimestamp(),
                        guildId: data.platformInfo.guildId,
                        channelId: data.platformInfo.channelId,
                        guildName: data.platformInfo.guildName,
                        channelName: data.platformInfo.channelName,
                    });
                }
            }

            // 3) Guild stats
            if (guildRef) {
                const guildUpdate = this.buildGuildUpdate(data);
                batch.set(guildRef, guildUpdate, { merge: true });

                // 4) Channel stats and history
                if (channelRef) {
                    const channelUpdate = this.buildChannelUpdate(data);
                    batch.set(channelRef, channelUpdate, { merge: true });

                    if (data.translationData) {
                        const channelHistoryRef = db
                            .collection(
                                `translations/discord/guilds/${data.platformInfo.guildId}/channels/${data.platformInfo.channelId}/history`
                            )
                            .doc();
                        batch.set(channelHistoryRef, {
                            ...data.translationData,
                            timestamp: FieldValue.serverTimestamp(),
                            userId: data.platformInfo.userId,
                            userName: data.platformInfo.userName,
                        });
                    }
                }
            }

            // 5) Main translations store (dedupe by hash)
            if (data.translationData && !data.cached) {
                const mainTranslationId = this.generateTranslationId(data.translationData);
                const mainRef = db.doc(`translations/${mainTranslationId}`);

                const existing = await mainRef.get();
                if (!existing.exists) {
                    batch.set(mainRef, {
                        ...data.translationData,
                        platform: "discord",
                        createdAt: FieldValue.serverTimestamp(),
                        lastUsed: FieldValue.serverTimestamp(),
                        timesUsed: 1,
                    });
                } else {
                    batch.update(mainRef, {
                        lastUsed: FieldValue.serverTimestamp(),
                        timesUsed: FieldValue.increment(1),
                        discordUses: FieldValue.increment(1),
                    });
                }
            }

            // 6) Daily stats
            const dailyRef = db.doc(`translations/discord/daily_stats/${today}`);
            const dailyUpdate = this.buildDailyUpdate(data, today);
            batch.set(dailyRef, dailyUpdate, { merge: true });

            // 7) Hourly stats
            const hourlyRef = db.doc(`translations/discord/hourly_stats/${today}`);
            const hourlyUpdate = this.buildHourlyUpdate(data, hour);
            batch.set(hourlyRef, hourlyUpdate, { merge: true });

            // 8) Language stats
            if (data.translationData) {
                const langRef = db.doc(
                    `translations/discord/languages/${data.translationData.targetLang}`
                );
                const langUpdate = this.buildLanguageUpdate(data);
                batch.set(langRef, langUpdate, { merge: true });
            }

            await batch.commit();
            console.log("Discord stats processed successfully with counters");
        } catch (error) {
            console.error("Error processing Discord stats:", error);
            throw error;
        }
    }

    generateTranslationId(translationData) {
        const hash = crypto
            .createHash("sha256")
            .update(translationData.inputText)
            .digest("hex");
        return `${translationData.sourceLang}-${translationData.targetLang}-${hash}`;
    }

    buildGlobalUpdate(data, opts = {}) {
        const update = {
            totalTranslations: FieldValue.increment(1),
            lastTranslated: FieldValue.serverTimestamp(),
            totalResponseTime: FieldValue.increment(data.responseTime || 0),
            totalWords: FieldValue.increment(data.translationData?.wordCount || 0),
            totalChars: FieldValue.increment(data.translationData?.charCount || 0),
        };

        // Conditionally bump distinct counters on first-seen entities
        if (opts.incrementGuild) update.guildCount = FieldValue.increment(1);
        if (opts.incrementChannel) update.channelCount = FieldValue.increment(1);
        if (opts.incrementUser) update.userCount = FieldValue.increment(1);

        if (data.cached) {
            update.cachedTranslations = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update.savedTokenUsage = {
                    prompt: FieldValue.increment(data.translationData.tokenUsage.prompt || 0),
                    completion: FieldValue.increment(
                        data.translationData.tokenUsage.completion || 0
                    ),
                    total: FieldValue.increment(data.translationData.tokenUsage.total || 0),
                };
            }
        } else {
            update.freshTranslations = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update.tokenUsage = {
                    prompt: FieldValue.increment(data.translationData.tokenUsage.prompt || 0),
                    completion: FieldValue.increment(
                        data.translationData.tokenUsage.completion || 0
                    ),
                    total: FieldValue.increment(data.translationData.tokenUsage.total || 0),
                };
            }
        }

        return update;
    }

    buildUserUpdate(data) {
        const update = {
            totalTranslations: FieldValue.increment(1),
            lastTranslated: FieldValue.serverTimestamp(),
            userName: data.platformInfo.userName || null,
            totalResponseTime: FieldValue.increment(data.responseTime || 0),
            totalWords: FieldValue.increment(data.translationData?.wordCount || 0),
            totalChars: FieldValue.increment(data.translationData?.charCount || 0),
        };

        if (data.cached) {
            update.cachedTranslations = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update.savedTokenUsage = {
                    prompt: FieldValue.increment(data.translationData.tokenUsage.prompt || 0),
                    completion: FieldValue.increment(
                        data.translationData.tokenUsage.completion || 0
                    ),
                    total: FieldValue.increment(data.translationData.tokenUsage.total || 0),
                };
            }
        } else {
            update.freshTranslations = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update.tokenUsage = {
                    prompt: FieldValue.increment(data.translationData.tokenUsage.prompt || 0),
                    completion: FieldValue.increment(
                        data.translationData.tokenUsage.completion || 0
                    ),
                    total: FieldValue.increment(data.translationData.tokenUsage.total || 0),
                };
            }
        }

        return update;
    }

    buildGuildUpdate(data) {
        const update = {
            totalTranslations: FieldValue.increment(1),
            lastTranslated: FieldValue.serverTimestamp(),
            guildName: data.platformInfo.guildName || null,
            totalResponseTime: FieldValue.increment(data.responseTime || 0),
            totalWords: FieldValue.increment(data.translationData?.wordCount || 0),
            totalChars: FieldValue.increment(data.translationData?.charCount || 0),
        };

        if (data.platformInfo.userId) {
            update.uniqueUsers = FieldValue.arrayUnion(data.platformInfo.userId);
        }

        if (data.cached) {
            update.cachedTranslations = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update.savedTokenUsage = {
                    prompt: FieldValue.increment(data.translationData.tokenUsage.prompt || 0),
                    completion: FieldValue.increment(
                        data.translationData.tokenUsage.completion || 0
                    ),
                    total: FieldValue.increment(data.translationData.tokenUsage.total || 0),
                };
            }
        } else {
            update.freshTranslations = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update.tokenUsage = {
                    prompt: FieldValue.increment(data.translationData.tokenUsage.prompt || 0),
                    completion: FieldValue.increment(
                        data.translationData.tokenUsage.completion || 0
                    ),
                    total: FieldValue.increment(data.translationData.tokenUsage.total || 0),
                };
            }
        }

        return update;
    }

    buildChannelUpdate(data) {
        const update = {
            totalTranslations: FieldValue.increment(1),
            lastTranslated: FieldValue.serverTimestamp(),
            channelName: data.platformInfo.channelName || null,
            totalResponseTime: FieldValue.increment(data.responseTime || 0),
            totalWords: FieldValue.increment(data.translationData?.wordCount || 0),
            totalChars: FieldValue.increment(data.translationData?.charCount || 0),
        };

        if (data.platformInfo.userId) {
            update.uniqueUsers = FieldValue.arrayUnion(data.platformInfo.userId);
        }

        if (data.cached) {
            update.cachedTranslations = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update.savedTokenUsage = {
                    prompt: FieldValue.increment(data.translationData.tokenUsage.prompt || 0),
                    completion: FieldValue.increment(
                        data.translationData.tokenUsage.completion || 0
                    ),
                    total: FieldValue.increment(data.translationData.tokenUsage.total || 0),
                };
            }
        } else {
            update.freshTranslations = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update.tokenUsage = {
                    prompt: FieldValue.increment(data.translationData.tokenUsage.prompt || 0),
                    completion: FieldValue.increment(
                        data.translationData.tokenUsage.completion || 0
                    ),
                    total: FieldValue.increment(data.translationData.tokenUsage.total || 0),
                };
            }
        }

        return update;
    }

    buildDailyUpdate(data, date) {
        const update = {
            date,
            translations: FieldValue.increment(1),
            totalResponseTime: FieldValue.increment(data.responseTime || 0),
            totalWords: FieldValue.increment(data.translationData?.wordCount || 0),
            totalChars: FieldValue.increment(data.translationData?.charCount || 0),
            updatedAt: FieldValue.serverTimestamp(),
        };

        if (data.platformInfo.userId) {
            update.uniqueUsers = FieldValue.arrayUnion(data.platformInfo.userId);
        }

        if (data.platformInfo.guildId) {
            update.uniqueGuilds = FieldValue.arrayUnion(data.platformInfo.guildId);
        }

        if (data.cached) {
            update.cachedTranslations = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update.savedTokenUsage = {
                    prompt: FieldValue.increment(data.translationData.tokenUsage.prompt || 0),
                    completion: FieldValue.increment(
                        data.translationData.tokenUsage.completion || 0
                    ),
                    total: FieldValue.increment(data.translationData.tokenUsage.total || 0),
                };
            }
        } else {
            update.freshTranslations = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update.tokenUsage = {
                    prompt: FieldValue.increment(data.translationData.tokenUsage.prompt || 0),
                    completion: FieldValue.increment(
                        data.translationData.tokenUsage.completion || 0
                    ),
                    total: FieldValue.increment(data.translationData.tokenUsage.total || 0),
                };
            }
        }

        return update;
    }

    buildHourlyUpdate(data, hour) {
        const update = {
            [`hour_${hour}.translations`]: FieldValue.increment(1),
            [`hour_${hour}.responseTime`]: FieldValue.increment(data.responseTime || 0),
            [`hour_${hour}.words`]: FieldValue.increment(
                data.translationData?.wordCount || 0
            ),
            [`hour_${hour}.chars`]: FieldValue.increment(
                data.translationData?.charCount || 0
            ),
            updatedAt: FieldValue.serverTimestamp(),
        };

        if (data.platformInfo.guildId) {
            update[`hour_${hour}.uniqueGuilds`] = FieldValue.arrayUnion(
                data.platformInfo.guildId
            );
        }

        if (data.platformInfo.userId) {
            update[`hour_${hour}.uniqueUsers`] = FieldValue.arrayUnion(
                data.platformInfo.userId
            );
        }

        if (data.cached) {
            update[`hour_${hour}.cachedTranslations`] = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update[`hour_${hour}.savedTokenUsage`] = {
                    prompt: FieldValue.increment(
                        data.translationData.tokenUsage.prompt || 0
                    ),
                    completion: FieldValue.increment(
                        data.translationData.tokenUsage.completion || 0
                    ),
                    total: FieldValue.increment(
                        data.translationData.tokenUsage.total || 0
                    ),
                };
            }
        } else {
            update[`hour_${hour}.freshTranslations`] = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update[`hour_${hour}.tokenUsage`] = {
                    prompt: FieldValue.increment(
                        data.translationData.tokenUsage.prompt || 0
                    ),
                    completion: FieldValue.increment(
                        data.translationData.tokenUsage.completion || 0
                    ),
                    total: FieldValue.increment(
                        data.translationData.tokenUsage.total || 0
                    ),
                };
            }
        }

        return update;
    }

    buildLanguageUpdate(data) {
        const update = {
            translations: FieldValue.increment(1),
            lastUsed: FieldValue.serverTimestamp(),
            totalWords: FieldValue.increment(data.translationData?.wordCount || 0),
            totalChars: FieldValue.increment(data.translationData?.charCount || 0),
        };

        if (!data.cached && data.translationData?.tokenUsage) {
            update.tokenUsage = {
                prompt: FieldValue.increment(data.translationData.tokenUsage.prompt || 0),
                completion: FieldValue.increment(
                    data.translationData.tokenUsage.completion || 0
                ),
                total: FieldValue.increment(
                    data.translationData.tokenUsage.total || 0
                ),
            };
        }

        return update;
    }
}