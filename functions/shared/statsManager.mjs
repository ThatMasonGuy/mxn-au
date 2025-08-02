// shared/statsManager.mjs
import { FieldValue } from "firebase-admin/firestore";
import { getDb, FirestoreBatch } from "./utils.mjs";

export class StatsManager {
    constructor(tracker) {
        this.db = getDb();
        this.tracker = tracker;
    }

    // Update AI suggestion stats (combined user + global)
    async updateAIStats({
        userId,
        tokenUsage,
        cached = false,
        error = false,
        challengeCount = 0,
        suggestedActivity = null,
        responseTime = 0,
        infrastructureStats = null
    }) {
        const batch = new FirestoreBatch(this.db, this.tracker);
        const today = new Date().toISOString().split('T')[0];
        const hour = new Date().getHours();

        try {
            // 1. User AI stats
            const userStatsRef = this.db.doc(`users/${userId}/destiny/ai_suggestions`);
            const userUpdate = {
                totalCalls: FieldValue.increment(1),
                lastCallAt: Date.now(),
                updatedAt: Date.now()
            };

            if (error) {
                userUpdate.errorCalls = FieldValue.increment(1);
            } else {
                userUpdate.successfulCalls = FieldValue.increment(1);
            }

            if (cached) {
                userUpdate.cachedCalls = FieldValue.increment(1);
                userUpdate.tokensSaved = FieldValue.increment(tokenUsage?.total || 0);
            } else {
                userUpdate.freshCalls = FieldValue.increment(1);
                if (tokenUsage) {
                    userUpdate.totalTokens = FieldValue.increment(tokenUsage.total || 0);
                    userUpdate.promptTokens = FieldValue.increment(tokenUsage.prompt || 0);
                    userUpdate.completionTokens = FieldValue.increment(tokenUsage.completion || 0);

                    const promptCost = (tokenUsage.prompt || 0) * 0.005 / 1000;
                    const completionCost = (tokenUsage.completion || 0) * 0.015 / 1000;

                    userUpdate.totalCostUSD = FieldValue.increment(promptCost + completionCost);
                    userUpdate.promptCostUSD = FieldValue.increment(promptCost);
                    userUpdate.completionCostUSD = FieldValue.increment(completionCost);
                }
            }

            if (infrastructureStats) {
                userUpdate.totalFirestoreReads = FieldValue.increment(infrastructureStats.firestoreReads);
                userUpdate.totalFirestoreWrites = FieldValue.increment(infrastructureStats.firestoreWrites);
                userUpdate.totalExecutionTimeMs = FieldValue.increment(infrastructureStats.executionTimeMs);
                userUpdate.totalInfrastructureCostUSD = FieldValue.increment(infrastructureStats.infrastructureCost);
                userUpdate.totalFirestoreCostUSD = FieldValue.increment(infrastructureStats.firestoreCost);
                userUpdate.totalComputeCostUSD = FieldValue.increment(infrastructureStats.computeCost);
            }

            batch.set(userStatsRef, userUpdate, { merge: true });

            // 2. Global AI stats
            const globalRef = this.db.doc('destiny/global');
            const globalUpdate = {
                'ai_stats.totalCalls': FieldValue.increment(1),
                'ai_stats.lastCallAt': Date.now(),
                'ai_stats.updatedAt': Date.now(),
                'ai_stats.totalResponseTime': FieldValue.increment(responseTime)
            };

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

                    const totalCost = (tokenUsage.prompt || 0) * 0.005 / 1000 + (tokenUsage.completion || 0) * 0.015 / 1000;
                    globalUpdate['ai_stats.totalCostUSD'] = FieldValue.increment(totalCost);
                    globalUpdate['ai_stats.promptCostUSD'] = FieldValue.increment((tokenUsage.prompt || 0) * 0.005 / 1000);
                    globalUpdate['ai_stats.completionCostUSD'] = FieldValue.increment((tokenUsage.completion || 0) * 0.015 / 1000);
                }
            }

            if (error) {
                globalUpdate['ai_stats.errorCalls'] = FieldValue.increment(1);
            } else {
                globalUpdate['ai_stats.successfulCalls'] = FieldValue.increment(1);
                globalUpdate['ai_stats.totalChallengesAnalyzed'] = FieldValue.increment(challengeCount);
            }

            batch.set(globalRef, globalUpdate, { merge: true });

            // 3. AI User tracking
            const userRef = this.db.doc(`destiny/global/ai_users/${userId}`);
            const userAnalyticsData = {
                lastUsed: Date.now(),
                totalCalls: FieldValue.increment(1),
                totalTokens: FieldValue.increment(tokenUsage?.total || 0),
                totalChallengesAnalyzed: FieldValue.increment(challengeCount),
                avgResponseTime: responseTime
            };

            if (infrastructureStats) {
                userAnalyticsData.totalFirestoreReads = FieldValue.increment(infrastructureStats.firestoreReads);
                userAnalyticsData.totalFirestoreWrites = FieldValue.increment(infrastructureStats.firestoreWrites);
                userAnalyticsData.totalInfrastructureCostUSD = FieldValue.increment(infrastructureStats.infrastructureCost);
            }

            batch.set(userRef, userAnalyticsData, { merge: true });

            // 4. Daily stats
            const dailyRef = this.db.doc(`destiny/global/ai_daily_stats/${today}`);
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

            // 5. Activity tracking
            if (suggestedActivity && !error) {
                const activityRef = this.db.doc(`destiny/global/suggested_activities/${encodeURIComponent(suggestedActivity)}`);
                batch.set(activityRef, {
                    activity: suggestedActivity,
                    suggestionCount: FieldValue.increment(1),
                    lastSuggested: Date.now(),
                    uniqueUsers: FieldValue.arrayUnion(userId)
                }, { merge: true });
            }

            // 6. Hourly stats
            const hourlyRef = this.db.doc(`destiny/global/ai_hourly_stats/${today}`);
            batch.set(hourlyRef, {
                date: today,
                [`hour_${hour}.calls`]: FieldValue.increment(1),
                [`hour_${hour}.responseTime`]: FieldValue.increment(responseTime),
                [`hour_${hour}.uniqueUsers`]: FieldValue.arrayUnion(userId),
                updatedAt: Date.now()
            }, { merge: true });

            // 7. User AI summary
            const summaryRef = this.db.doc(`users/${userId}/destiny/ai_suggestions/summary`);
            const summaryData = {
                lastChallengeCount: challengeCount,
                lastResponseTime: responseTime,
                lastCached: cached,
                lastTokenUsage: tokenUsage || { total: 0, prompt: 0, completion: 0 },
                totalCalls: FieldValue.increment(1),
                totalChallengesAnalyzed: FieldValue.increment(challengeCount),
                totalResponseTime: FieldValue.increment(responseTime),
                lastUpdated: Date.now(),
                updatedAt: Date.now()
            };

            if (infrastructureStats) {
                summaryData.lastInfrastructureCost = infrastructureStats.infrastructureCost;
                summaryData.lastFirestoreReads = infrastructureStats.firestoreReads;
                summaryData.lastFirestoreWrites = infrastructureStats.firestoreWrites;
                summaryData.lastExecutionTime = infrastructureStats.executionTimeMs;
                summaryData.totalInfrastructureCost = FieldValue.increment(infrastructureStats.infrastructureCost);
                summaryData.totalFirestoreReads = FieldValue.increment(infrastructureStats.firestoreReads);
                summaryData.totalFirestoreWrites = FieldValue.increment(infrastructureStats.firestoreWrites);
            }

            if (!cached && tokenUsage) {
                const totalCost = (tokenUsage.prompt || 0) * 0.005 / 1000 + (tokenUsage.completion || 0) * 0.015 / 1000;
                summaryData.lastOpenAICost = totalCost;
                summaryData.totalOpenAICost = FieldValue.increment(totalCost);
                summaryData.totalTokens = FieldValue.increment(tokenUsage.total || 0);
            } else if (cached) {
                summaryData.lastOpenAICost = 0;
                summaryData.totalCachedCalls = FieldValue.increment(1);
            }

            batch.set(summaryRef, summaryData, { merge: true });

            await batch.commit('AI stats update');
            console.log('[StatsManager] Updated AI stats');
        } catch (err) {
            console.error('[StatsManager] Error updating AI stats:', err);
            throw err;
        }
    }

    // Update challenge refresh stats
    async updateChallengeStats({
        userId,
        challengeStats,
        weeklyInfo,
        infrastructureStats
    }) {
        const batch = new FirestoreBatch(this.db, this.tracker);
        const today = new Date().toISOString().split('T')[0];

        try {
            // 1. Global challenge stats
            const globalRef = this.db.doc('destiny/global');
            const globalUpdate = {
                'challenge_stats.totalRefreshCalls': FieldValue.increment(1),
                'challenge_stats.lastRefreshAt': Date.now(),
                'challenge_stats.updatedAt': Date.now()
            };

            if (infrastructureStats) {
                globalUpdate['challenge_stats.totalFirestoreReads'] = FieldValue.increment(infrastructureStats.firestoreReads);
                globalUpdate['challenge_stats.totalFirestoreWrites'] = FieldValue.increment(infrastructureStats.firestoreWrites);
                globalUpdate['challenge_stats.totalExecutionTimeMs'] = FieldValue.increment(infrastructureStats.executionTimeMs);
                globalUpdate['challenge_stats.totalInfrastructureCostUSD'] = FieldValue.increment(infrastructureStats.infrastructureCost);
                globalUpdate['challenge_stats.totalFirestoreCostUSD'] = FieldValue.increment(infrastructureStats.firestoreCost);
                globalUpdate['challenge_stats.totalComputeCostUSD'] = FieldValue.increment(infrastructureStats.computeCost);
            }

            if (challengeStats.updatedChallenges > 0) {
                globalUpdate['challenge_stats.totalChallengesSeen'] = FieldValue.increment(challengeStats.totalChallenges);
                globalUpdate['challenge_stats.totalChallengesCompleted'] = FieldValue.increment(challengeStats.completedChallenges);
            }

            batch.set(globalRef, globalUpdate, { merge: true });

            // 2. Connected user tracking
            const userRef = this.db.doc(`destiny/global/connected_users/${userId}`);
            const userUpdateData = {
                lastRefresh: Date.now(),
                totalRefreshes: FieldValue.increment(1),
                currentTotalChallenges: challengeStats.totalChallenges,
                currentCompletedChallenges: challengeStats.completedChallenges,
                currentActiveChallenges: challengeStats.activeChallenges
            };

            if (infrastructureStats) {
                userUpdateData.totalFirestoreReads = FieldValue.increment(infrastructureStats.firestoreReads);
                userUpdateData.totalFirestoreWrites = FieldValue.increment(infrastructureStats.firestoreWrites);
                userUpdateData.totalInfrastructureCostUSD = FieldValue.increment(infrastructureStats.infrastructureCost);
            }

            if (challengeStats.updatedChallenges > 0) {
                userUpdateData.totalChallengeUpdates = FieldValue.increment(challengeStats.updatedChallenges);
            }

            batch.set(userRef, userUpdateData, { merge: true });

            // 3. Season stats
            if (challengeStats.seasonHash) {
                const seasonStatsRef = this.db.doc(`destiny/global/season_stats/${challengeStats.seasonHash}`);
                const seasonUpdateData = {
                    seasonHash: challengeStats.seasonHash,
                    seasonName: challengeStats.seasonName,
                    uniqueUsers: FieldValue.arrayUnion(userId),
                    lastUpdate: Date.now()
                };

                if (challengeStats.updatedChallenges > 0) {
                    seasonUpdateData.totalChallengesSeen = FieldValue.increment(challengeStats.totalChallenges);
                    seasonUpdateData.totalChallengesCompleted = FieldValue.increment(challengeStats.completedChallenges);
                }

                batch.set(seasonStatsRef, seasonUpdateData, { merge: true });
            }

            // 4. Daily stats
            const dailyRef = this.db.doc(`destiny/global/challenge_daily_stats/${today}`);
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

            // 5. User seasonal summary
            const summaryRef = this.db.doc(`users/${userId}/destiny/seasonal_summary`);
            const summaryData = {
                totalChallenges: challengeStats.totalChallenges,
                completedChallenges: challengeStats.completedChallenges,
                activeChallenges: challengeStats.activeChallenges,
                currentWeekChallenges: weeklyInfo.currentWeekNewChallenges,
                seasonHash: challengeStats.seasonHash,
                seasonName: challengeStats.seasonName,
                currentWeek: weeklyInfo.currentWeek,
                hasWeeklyStructure: weeklyInfo.hasWeeklyStructure,
                totalWeeks: weeklyInfo.totalWeeks,
                completionRate: challengeStats.totalChallenges > 0 ?
                    (challengeStats.completedChallenges / challengeStats.totalChallenges) * 100 : 0,
                activeCompletionRate: challengeStats.activeChallenges > 0 ?
                    (challengeStats.completedChallenges / challengeStats.activeChallenges) * 100 : 0,
                lastRefreshCost: infrastructureStats.infrastructureCost,
                lastRefreshReads: infrastructureStats.firestoreReads,
                lastRefreshWrites: infrastructureStats.firestoreWrites,
                lastRefreshDuration: infrastructureStats.executionTimeMs,
                totalRefreshes: FieldValue.increment(1),
                totalInfrastructureCost: FieldValue.increment(infrastructureStats.infrastructureCost),
                totalFirestoreReads: FieldValue.increment(infrastructureStats.firestoreReads),
                totalFirestoreWrites: FieldValue.increment(infrastructureStats.firestoreWrites),
                lastUpdated: Date.now(),
                updatedAt: Date.now()
            };

            batch.set(summaryRef, summaryData, { merge: true });

            await batch.commit('Challenge stats update');
            console.log('[StatsManager] Updated challenge stats');
        } catch (err) {
            console.error('[StatsManager] Error updating challenge stats:', err);
            throw err;
        }
    }

    // Calculate performance metrics (run periodically)
    async calculatePerformanceMetrics() {
        try {
            const globalRef = this.db.doc('destiny/global');
            const globalDoc = await globalRef.get();
            this.tracker.trackRead(1, 'global stats for calculation');

            if (!globalDoc.exists) return;

            const data = globalDoc.data();

            // AI metrics
            const aiStats = {
                totalCalls: data['ai_stats.totalCalls'] || 0,
                successfulCalls: data['ai_stats.successfulCalls'] || 0,
                cachedCalls: data['ai_stats.cachedCalls'] || 0,
                freshCalls: data['ai_stats.freshCalls'] || 0,
                totalResponseTime: data['ai_stats.totalResponseTime'] || 0,
                totalTokens: data['ai_stats.totalTokens'] || 0,
                totalCost: data['ai_stats.totalCostUSD'] || 0,
                costSaved: data['ai_stats.costSavedUSD'] || 0
            };

            // Calculate AI derived metrics
            const aiCalculated = {
                successRate: aiStats.totalCalls > 0 ? (aiStats.successfulCalls / aiStats.totalCalls) * 100 : 0,
                cacheHitRate: aiStats.totalCalls > 0 ? (aiStats.cachedCalls / aiStats.totalCalls) * 100 : 0,
                avgResponseTime: aiStats.freshCalls > 0 ? aiStats.totalResponseTime / aiStats.freshCalls : 0,
                avgTokensPerCall: aiStats.freshCalls > 0 ? aiStats.totalTokens / aiStats.freshCalls : 0,
                avgCostPerCall: aiStats.freshCalls > 0 ? aiStats.totalCost / aiStats.freshCalls : 0,
                totalCostSavings: aiStats.costSaved
            };

            // Challenge metrics
            const challengeStats = {
                totalSeen: data['challenge_stats.totalChallengesSeen'] || 0,
                totalCompleted: data['challenge_stats.totalChallengesCompleted'] || 0
            };

            // Calculate challenge completion rate
            const completionRate = challengeStats.totalSeen > 0 ?
                (challengeStats.totalCompleted / challengeStats.totalSeen) * 100 : 0;

            // Count users
            const [aiUsersSnapshot, connectedUsersSnapshot] = await Promise.all([
                this.db.collection('destiny/global/ai_users').count().get(),
                this.db.collection('destiny/global/connected_users').count().get()
            ]);
            this.tracker.trackRead(2, 'user counts');

            const totalAIUsers = aiUsersSnapshot.data().count;
            const totalConnectedUsers = connectedUsersSnapshot.data().count;

            // Calculate average challenges per user
            let avgChallengesPerUser = 0;
            if (totalConnectedUsers > 0) {
                // Get actual user data for accurate calculation
                const connectedUsersRef = this.db.collection('destiny/global/connected_users');
                const usersSnapshot = await connectedUsersRef.limit(500).get(); // Limit for performance
                this.tracker.trackRead(usersSnapshot.size, 'connected users data sample');

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
            }

            // Update calculated stats
            const updateData = {
                'ai_calculated_stats.successRate': aiCalculated.successRate,
                'ai_calculated_stats.cacheHitRate': aiCalculated.cacheHitRate,
                'ai_calculated_stats.avgResponseTime': aiCalculated.avgResponseTime,
                'ai_calculated_stats.avgTokensPerCall': aiCalculated.avgTokensPerCall,
                'ai_calculated_stats.avgCostPerCall': aiCalculated.avgCostPerCall,
                'ai_calculated_stats.totalCostSavings': aiCalculated.totalCostSavings,
                'ai_calculated_stats.totalActiveUsers': totalAIUsers,
                'ai_calculated_stats.lastCalculated': Date.now(),
                'calculated_stats.avgCompletionRate': completionRate,
                'calculated_stats.totalConnectedUsers': totalConnectedUsers,
                'calculated_stats.totalAIUsers': totalAIUsers,
                'calculated_stats.avgChallengesPerUser': avgChallengesPerUser,
                'calculated_stats.totalChallengesSeen': challengeStats.totalSeen,
                'calculated_stats.lastCalculated': Date.now()
            };

            await globalRef.update(updateData);
            this.tracker.trackWrite(1, 'calculated stats update');

            console.log('[StatsManager] Updated calculated performance metrics');
        } catch (err) {
            console.error('[StatsManager] Error calculating metrics:', err);
        }
    }
}