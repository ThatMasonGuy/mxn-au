// shared/cacheManager.mjs
import { getDb } from "./utils.mjs";
import { FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";

export class CacheManager {
    constructor(tracker) {
        this.db = getDb();
        this.tracker = tracker;
    }

    // Generate hash for challenge data
    generateChallengeHash(challenges) {
        const challengeData = challenges.map(chal => {
            const obj = Array.isArray(chal.objectives) && chal.objectives.length > 0 ? chal.objectives[0] : {};
            return {
                name: chal.name,
                description: chal.description,
                progress: obj.progress ?? 0,
                goal: obj.completionValue ?? 1,
                seasonHash: chal.seasonHash
            };
        }).sort((a, b) => a.name.localeCompare(b.name));

        const dataString = JSON.stringify(challengeData);
        return crypto.createHash('sha256').update(dataString).digest('hex');
    }

    // Get cached AI suggestion
    async getCachedAISuggestion(userId, hash) {
        try {
            const cachedRef = this.db.doc(`users/${userId}/destiny/ai_suggestions/suggestions/${hash}`);
            const cachedDoc = await cachedRef.get();
            this.tracker.trackRead(1, 'ai suggestion cache lookup');

            if (!cachedDoc.exists) {
                return null;
            }

            const cached = cachedDoc.data();

            // Check if cache is still fresh (24 hours)
            const age = Date.now() - cached.createdAt;
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours

            if (age > maxAge) {
                console.log(`[CacheManager] AI cache expired for hash ${hash}`);
                return null;
            }

            console.log(`[CacheManager] Using cached AI suggestion for hash ${hash}`);
            return cached;
        } catch (err) {
            console.error(`[CacheManager] Error getting cached AI suggestion:`, err);
            return null;
        }
    }

    // Save AI suggestion to cache
    async saveAISuggestion(userId, hash, challenges, suggestion, seasonHash, tokenUsage, suggestedActivity) {
        try {
            const cachedRef = this.db.doc(`users/${userId}/destiny/ai_suggestions/suggestions/${hash}`);

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
            this.tracker.trackWrite(1, 'ai suggestion cache');
            console.log(`[CacheManager] Cached AI suggestion with hash ${hash}`);
        } catch (err) {
            console.error(`[CacheManager] Error caching AI suggestion:`, err);
        }
    }

    // Update cache usage
    async updateCacheUsage(userId, hash) {
        try {
            const cachedRef = this.db.doc(`users/${userId}/destiny/ai_suggestions/suggestions/${hash}`);
            await cachedRef.update({
                usedAt: Date.now(),
                usageCount: FieldValue.increment(1)
            });
            this.tracker.trackWrite(1, 'cache usage update');
        } catch (err) {
            console.error(`[CacheManager] Error updating cache usage:`, err);
        }
    }

    // Get cached season reference
    async getSeasonReference(seasonHash) {
        try {
            const refDoc = await this.db.doc(`destiny/global/season_references/${seasonHash}`).get();
            this.tracker.trackRead(1, 'season reference lookup');

            if (!refDoc.exists) {
                console.log(`[CacheManager] No reference found for season ${seasonHash}`);
                return null;
            }

            const reference = refDoc.data();

            // Check cache version
            const CURRENT_CACHE_VERSION = 3;
            if ((reference.cacheVersion || 1) < CURRENT_CACHE_VERSION) {
                console.log(`[CacheManager] Cache version outdated (${reference.cacheVersion || 1} < ${CURRENT_CACHE_VERSION})`);
                return null;
            }

            // Check if reference is still valid (7 days)
            if (Date.now() > reference.validUntil) {
                console.log(`[CacheManager] Reference expired for season ${seasonHash}`);
                return null;
            }

            console.log(`[CacheManager] Using cached reference for ${reference.seasonName}`);
            return reference;
        } catch (err) {
            console.error(`[CacheManager] Error getting season reference:`, err);
            return null;
        }
    }

    // Save season reference
    async saveSeasonReference(reference) {
        try {
            const globalRef = this.db.doc(`destiny/global/season_references/${reference.seasonHash}`);
            await globalRef.set(reference);
            this.tracker.trackWrite(1, 'global season reference');
            console.log(`[CacheManager] Saved season reference for ${reference.seasonName}`);
        } catch (err) {
            console.error(`[CacheManager] Error saving season reference:`, err);
            throw err;
        }
    }

    // Clean up expired caches periodically
    async cleanupExpiredCaches(type = 'all') {
        try {
            const now = Date.now();
            let cleaned = 0;

            if (type === 'all' || type === 'oauth') {
                // Clean up OAuth states older than 15 minutes
                const expiredThreshold = now - (15 * 60 * 1000);
                const statesRef = this.db.collection('oauth_states');
                const expiredQuery = await statesRef.where('createdAt', '<', expiredThreshold).limit(100).get();
                this.tracker.trackRead(1, 'expired oauth states query');

                if (!expiredQuery.empty) {
                    const batch = this.db.batch();
                    expiredQuery.docs.forEach(doc => {
                        batch.delete(doc.ref);
                    });
                    await batch.commit();
                    this.tracker.trackBatchWrite(expiredQuery.size, 'oauth state cleanup');
                    cleaned += expiredQuery.size;
                    console.log(`[CacheManager] Cleaned ${expiredQuery.size} expired OAuth states`);
                }
            }

            if (type === 'all' || type === 'ai') {
                // Clean up AI suggestion caches older than 7 days
                const oldThreshold = now - (7 * 24 * 60 * 60 * 1000);
                // This would need to be done per user - for now, skip global cleanup
                console.log('[CacheManager] AI cache cleanup would be done per-user basis');
            }

            if (type === 'all' || type === 'season') {
                // Clean up expired season references
                const seasonsRef = this.db.collection('destiny/global/season_references');
                const expiredSeasons = await seasonsRef.where('validUntil', '<', now).limit(10).get();
                this.tracker.trackRead(1, 'expired season references query');

                if (!expiredSeasons.empty) {
                    const batch = this.db.batch();
                    expiredSeasons.docs.forEach(doc => {
                        batch.delete(doc.ref);
                    });
                    await batch.commit();
                    this.tracker.trackBatchWrite(expiredSeasons.size, 'season reference cleanup');
                    cleaned += expiredSeasons.size;
                    console.log(`[CacheManager] Cleaned ${expiredSeasons.size} expired season references`);
                }
            }

            return cleaned;
        } catch (err) {
            console.error(`[CacheManager] Error during cleanup:`, err);
            return 0;
        }
    }

    // Get manifest version cache
    async getManifestVersion() {
        try {
            const versionDoc = await this.db.doc('destiny/global/manifest_version').get();
            this.tracker.trackRead(1, 'manifest version check');

            if (!versionDoc.exists) {
                return null;
            }

            const data = versionDoc.data();

            // Check if version is still fresh (1 hour)
            const age = Date.now() - data.updatedAt;
            if (age > 60 * 60 * 1000) {
                return null;
            }

            return data.version;
        } catch (err) {
            console.error('[CacheManager] Error getting manifest version:', err);
            return null;
        }
    }

    // Save manifest version
    async saveManifestVersion(version) {
        try {
            await this.db.doc('destiny/global/manifest_version').set({
                version,
                updatedAt: Date.now()
            });
            this.tracker.trackWrite(1, 'manifest version update');
        } catch (err) {
            console.error('[CacheManager] Error saving manifest version:', err);
        }
    }
}