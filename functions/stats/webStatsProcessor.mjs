import crypto from "crypto";
import { db } from "../config/firebase.mjs";
import { FieldValue } from "firebase-admin/firestore";

export class WebStatsProcessor {
    async process(data) {
        const batch = db.batch();
        const today = new Date().toISOString().split("T")[0];
        const hour = new Date().getHours();

        try {
            // 1. Global stats
            const globalRef = db.doc("translations/meta");
            const globalUpdate = this.buildGlobalUpdate(data);
            batch.set(globalRef, globalUpdate, { merge: true });

            // 2. User stats and history
            if (data.platformInfo.userId) {
                const userRef = db.doc(
                    `users/${data.platformInfo.userId}/translations/meta`
                );
                const userUpdate = this.buildUserUpdate(data);
                batch.set(userRef, userUpdate, { merge: true });

                // Save translation history
                if (data.translationData) {
                    const historyRef = db
                        .collection(`users/${data.platformInfo.userId}/translations`)
                        .doc();
                    batch.set(historyRef, {
                        ...data.translationData,
                        timestamp: FieldValue.serverTimestamp(),
                    });
                }
            }

            // 3. Main translations store
            if (data.translationData && !data.cached) {
                const mainTranslationId = this.generateTranslationId(
                    data.translationData
                );
                const mainRef = db.doc(`translations/${mainTranslationId}`);

                const existing = await mainRef.get();
                if (!existing.exists) {
                    batch.set(mainRef, {
                        ...data.translationData,
                        platform: "web",
                        createdAt: FieldValue.serverTimestamp(),
                        lastUsed: FieldValue.serverTimestamp(),
                        timesUsed: 1,
                    });
                } else {
                    batch.update(mainRef, {
                        lastUsed: FieldValue.serverTimestamp(),
                        timesUsed: FieldValue.increment(1),
                        webUses: FieldValue.increment(1),
                    });
                }
            }

            // 4. Daily stats
            const dailyRef = db.doc(`translations/meta/daily_stats/${today}`);
            const dailyUpdate = this.buildDailyUpdate(data, today);
            batch.set(dailyRef, dailyUpdate, { merge: true });

            // 5. Hourly stats
            const hourlyRef = db.doc(`translations/meta/hourly_stats/${today}`);
            const hourlyUpdate = this.buildHourlyUpdate(data, hour);
            batch.set(hourlyRef, hourlyUpdate, { merge: true });

            // 6. Language stats
            if (data.translationData) {
                const langRef = db.doc(
                    `translations/meta/languages/${data.translationData.targetLang}`
                );
                const langUpdate = this.buildLanguageUpdate(data);
                batch.set(langRef, langUpdate, { merge: true });
            }

            await batch.commit();
            console.log("Web stats processed successfully");
        } catch (error) {
            console.error("Error processing web stats:", error);
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

    buildGlobalUpdate(data) {
        const update = {
            totalTranslations: FieldValue.increment(1),
            lastTranslated: FieldValue.serverTimestamp(),
            totalResponseTime: FieldValue.increment(data.responseTime || 0),
            totalWords: FieldValue.increment(data.translationData?.wordCount || 0),
            totalChars: FieldValue.increment(data.translationData?.charCount || 0),
        };

        if (data.cached) {
            update.cachedTranslations = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update.savedTokenUsage = {
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
            update.freshTranslations = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update.tokenUsage = {
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

    buildUserUpdate(data) {
        const update = {
            totalTranslations: FieldValue.increment(1),
            lastTranslated: FieldValue.serverTimestamp(),
            totalResponseTime: FieldValue.increment(data.responseTime || 0),
            totalWords: FieldValue.increment(data.translationData?.wordCount || 0),
            totalChars: FieldValue.increment(data.translationData?.charCount || 0),
        };

        if (data.cached) {
            update.cachedTranslations = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update.savedTokenUsage = {
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
            update.freshTranslations = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update.tokenUsage = {
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

        if (data.cached) {
            update.cachedTranslations = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update.savedTokenUsage = {
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
            update.freshTranslations = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                update.tokenUsage = {
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

    buildHourlyUpdate(data, hour) {
        const update = {
            [`hour_${hour}.translations`]: FieldValue.increment(1),
            [`hour_${hour}.responseTime`]: FieldValue.increment(
                data.responseTime || 0
            ),
            [`hour_${hour}.words`]: FieldValue.increment(
                data.translationData?.wordCount || 0
            ),
            [`hour_${hour}.chars`]: FieldValue.increment(
                data.translationData?.charCount || 0
            ),
            updatedAt: FieldValue.serverTimestamp(),
        };

        if (data.platformInfo.userId) {
            update[`hour_${hour}.uniqueUsers`] = FieldValue.arrayUnion(
                data.platformInfo.userId
            );
        }

        if (data.cached) {
            update[`hour_${hour}.cachedTranslations`] = FieldValue.increment(1);
            if (data.translationData?.tokenUsage) {
                // For hourly stats, we need to use nested field notation due to the hour prefix
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
                // For hourly stats, we need to use nested field notation due to the hour prefix
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
                prompt: FieldValue.increment(
                    data.translationData.tokenUsage.prompt || 0
                ),
                completion: FieldValue.increment(
                    data.translationData.tokenUsage.completion || 0
                ),
                total: FieldValue.increment(data.translationData.tokenUsage.total || 0),
            };
        }

        return update;
    }
}