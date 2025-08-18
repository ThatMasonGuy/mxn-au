// oauth.mjs (Consolidated OAuth functions with usage tracking)
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { FieldValue } from "firebase-admin/firestore";
import { getDb, InfrastructureTracker, verifyAuthToken } from "./shared/utils.mjs";
import { CacheManager } from "./shared/cacheManager.mjs";
import { BungieApiClient } from "./shared/bungieApiClient.mjs";
import { StatsManager } from "./shared/statsManager.mjs";

const bungieClientId = defineSecret('BUNGIE_CLIENT_ID');
const bungieApiKey = defineSecret('BUNGIE_API_KEY');
const bungieRedirectUri = defineSecret('BUNGIE_REDIRECT_URI');

// Generate random state string
function randomString(len = 32) {
    return [...Array(len)].map(() => Math.random().toString(36)[2]).join('');
}

// Update OAuth stats
async function updateOAuthStats(db, tracker, {
    userId,
    operation, // 'start' or 'callback'
    success = true,
    error = null,
    platformType = null,
    responseTime = 0,
    infrastructureStats = null
}) {
    const batch = db.batch();
    const today = new Date().toISOString().split('T')[0];
    const hour = new Date().getHours();

    try {
        // 1. User OAuth stats
        const userStatsRef = db.doc(`users/${userId}/destiny/oauth_stats`);
        const userUpdate = {
            [`total${operation.charAt(0).toUpperCase() + operation.slice(1)}Attempts`]: FieldValue.increment(1),
            lastAttemptAt: Date.now(),
            updatedAt: Date.now()
        };

        if (success) {
            userUpdate[`successful${operation.charAt(0).toUpperCase() + operation.slice(1)}s`] = FieldValue.increment(1);
            if (operation === 'callback' && platformType) {
                userUpdate.lastLinkedPlatform = platformType;
                userUpdate.lastSuccessfulLinkAt = Date.now();
            }
        } else {
            userUpdate[`failed${operation.charAt(0).toUpperCase() + operation.slice(1)}s`] = FieldValue.increment(1);
            if (error) {
                userUpdate.lastError = error;
                userUpdate.lastErrorAt = Date.now();
            }
        }

        if (infrastructureStats) {
            userUpdate.totalFirestoreReads = FieldValue.increment(infrastructureStats.firestoreReads);
            userUpdate.totalFirestoreWrites = FieldValue.increment(infrastructureStats.firestoreWrites);
            userUpdate.totalExecutionTimeMs = FieldValue.increment(infrastructureStats.executionTimeMs);
            userUpdate.totalInfrastructureCostUSD = FieldValue.increment(infrastructureStats.infrastructureCost);
        }

        batch.set(userStatsRef, userUpdate, { merge: true });

        // 2. Global OAuth stats
        const globalRef = db.doc('destiny/global');
        const globalUpdate = {
            [`oauth_stats.total${operation.charAt(0).toUpperCase() + operation.slice(1)}Attempts`]: FieldValue.increment(1),
            'oauth_stats.lastAttemptAt': Date.now(),
            'oauth_stats.updatedAt': Date.now()
        };

        if (infrastructureStats) {
            globalUpdate['oauth_stats.totalFirestoreReads'] = FieldValue.increment(infrastructureStats.firestoreReads);
            globalUpdate['oauth_stats.totalFirestoreWrites'] = FieldValue.increment(infrastructureStats.firestoreWrites);
            globalUpdate['oauth_stats.totalExecutionTimeMs'] = FieldValue.increment(infrastructureStats.executionTimeMs);
            globalUpdate['oauth_stats.totalInfrastructureCostUSD'] = FieldValue.increment(infrastructureStats.infrastructureCost);
        }

        if (success) {
            globalUpdate[`oauth_stats.successful${operation.charAt(0).toUpperCase() + operation.slice(1)}s`] = FieldValue.increment(1);
        } else {
            globalUpdate[`oauth_stats.failed${operation.charAt(0).toUpperCase() + operation.slice(1)}s`] = FieldValue.increment(1);
            if (error) {
                globalUpdate[`oauth_stats.errorTypes.${error.toLowerCase().replace(/\s+/g, '_')}`] = FieldValue.increment(1);
            }
        }

        batch.set(globalRef, globalUpdate, { merge: true });

        // 3. OAuth user tracking
        const oauthUserRef = db.doc(`destiny/global/oauth_users/${userId}`);
        batch.set(oauthUserRef, {
            lastAttempt: Date.now(),
            totalAttempts: FieldValue.increment(1),
            successfulLinks: success && operation === 'callback' ? FieldValue.increment(1) : FieldValue.increment(0),
            lastPlatform: platformType || FieldValue.delete()
        }, { merge: true });

        // 4. Daily OAuth stats
        const dailyRef = db.doc(`destiny/global/oauth_daily_stats/${today}`);
        const dailyUpdate = {
            date: today,
            [`${operation}Attempts`]: FieldValue.increment(1),
            uniqueUsers: FieldValue.arrayUnion(userId),
            updatedAt: Date.now()
        };

        if (infrastructureStats) {
            dailyUpdate.totalFirestoreReads = FieldValue.increment(infrastructureStats.firestoreReads);
            dailyUpdate.totalFirestoreWrites = FieldValue.increment(infrastructureStats.firestoreWrites);
            dailyUpdate.totalInfrastructureCostUSD = FieldValue.increment(infrastructureStats.infrastructureCost);
        }

        if (success) {
            dailyUpdate[`successful${operation.charAt(0).toUpperCase() + operation.slice(1)}s`] = FieldValue.increment(1);
        } else {
            dailyUpdate[`failed${operation.charAt(0).toUpperCase() + operation.slice(1)}s`] = FieldValue.increment(1);
        }

        batch.set(dailyRef, dailyUpdate, { merge: true });

        // 5. Hourly patterns
        const hourlyRef = db.doc(`destiny/global/oauth_hourly_stats/${today}`);
        batch.set(hourlyRef, {
            date: today,
            [`hour_${hour}.${operation}Attempts`]: FieldValue.increment(1),
            [`hour_${hour}.responseTime`]: FieldValue.increment(responseTime),
            updatedAt: Date.now()
        }, { merge: true });

        // 6. Platform stats (for callbacks)
        if (operation === 'callback' && platformType && success) {
            const platformRef = db.doc(`destiny/global/platform_stats/${platformType}`);
            batch.set(platformRef, {
                platform: platformType,
                totalLinks: FieldValue.increment(1),
                lastLinkAt: Date.now(),
                uniqueUsers: FieldValue.arrayUnion(userId)
            }, { merge: true });
        }

        await batch.commit();
        tracker.trackBatchWrite(6, 'OAuth stats update');
        console.log(`[updateOAuthStats] Updated OAuth stats for ${operation}`);
    } catch (err) {
        console.error('[updateOAuthStats] Error:', err);
        // Don't throw - stats failure shouldn't break OAuth flow
    }
}

// Initialize OAuth stats document for user
async function initializeUserOAuthStats(db, userId, tracker) {
    try {
        const statsRef = db.doc(`users/${userId}/destiny/oauth_stats`);
        const statsDoc = await statsRef.get();
        tracker.trackRead(1, 'oauth stats initialization check');

        if (!statsDoc.exists) {
            const initialData = {
                totalStartAttempts: 0,
                successfulStarts: 0,
                failedStarts: 0,
                totalCallbackAttempts: 0,
                successfulCallbacks: 0,
                failedCallbacks: 0,
                totalFirestoreReads: 0,
                totalFirestoreWrites: 0,
                totalExecutionTimeMs: 0,
                totalInfrastructureCostUSD: 0,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            await statsRef.set(initialData);
            tracker.trackWrite(1, 'oauth stats initialization');
            console.log(`[initializeUserOAuthStats] Created OAuth stats for user ${userId}`);
        }
    } catch (err) {
        console.error('[initializeUserOAuthStats] Error:', err);
    }
}

// Start OAuth flow
export const startBungieOAuth = onRequest(
    {
        region: 'australia-southeast1',
        secrets: [bungieClientId, bungieRedirectUri],
        maxInstances: 1,
    },
    async (req, res) => {
        const startTime = Date.now();
        const tracker = new InfrastructureTracker();
        const db = getDb();
        const cacheManager = new CacheManager(tracker);
        let userId = null;
        let success = false;
        let errorMessage = null;

        try {
            console.log('[OAuth Start] Starting OAuth flow');

            // 1. Verify authentication
            const decoded = await verifyAuthToken(req.headers.authorization);
            userId = decoded.uid;

            console.log(`[OAuth Start] Authenticated user: ${userId}`);

            // 2. Initialize OAuth stats for user
            await initializeUserOAuthStats(db, userId, tracker);

            // 3. Clean up expired states
            await cacheManager.cleanupExpiredCaches('oauth');

            // 4. Clean up existing states for this user
            const existingStatesQuery = await db
                .collection('oauth_states')
                .where('userId', '==', userId)
                .get();
            tracker.trackRead(existingStatesQuery.size, 'existing user oauth states');

            if (!existingStatesQuery.empty) {
                console.log(`[OAuth Start] Found ${existingStatesQuery.size} existing state(s) for user, cleaning up...`);
                const batch = db.batch();
                existingStatesQuery.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
                tracker.trackBatchWrite(existingStatesQuery.size, 'cleanup user oauth states');
            }

            // 5. Generate new state
            const state = randomString(32);
            const stateData = {
                userId,
                createdAt: Date.now(),
                userAgent: req.headers['user-agent'] || '',
                ip: req.ip || req.connection?.remoteAddress || 'unknown'
            };

            await db.collection('oauth_states').doc(state).set(stateData);
            tracker.trackWrite(1, 'create oauth state');
            console.log(`[OAuth Start] Created state document: ${state}`);

            // 6. Build OAuth URL
            const authUrl = new URL('https://www.bungie.net/en/OAuth/Authorize');
            authUrl.searchParams.set('client_id', bungieClientId.value());
            authUrl.searchParams.set('response_type', 'code');
            authUrl.searchParams.set('redirect_uri', bungieRedirectUri.value());
            authUrl.searchParams.set('state', state);
            authUrl.searchParams.set('prompt', 'consent');

            const redirectUrl = authUrl.toString();
            console.log(`[OAuth Start] Generated OAuth URL for state: ${state}`);

            success = true;

            // 7. Update stats
            const responseTime = Date.now() - startTime;
            const infrastructureStats = tracker.calculateRealCosts();

            await updateOAuthStats(db, tracker, {
                userId,
                operation: 'start',
                success: true,
                responseTime,
                infrastructureStats
            });

            // 8. Return response
            return res.status(200).json({
                redirectUrl,
                state,
                stats: {
                    responseTime,
                    infrastructureStats
                }
            });

        } catch (err) {
            console.error('[OAuth Start] Error:', err);
            errorMessage = err.message;

            // Update failure stats if we have a userId
            if (userId) {
                const responseTime = Date.now() - startTime;
                const infrastructureStats = tracker.calculateRealCosts();

                await updateOAuthStats(db, tracker, {
                    userId,
                    operation: 'start',
                    success: false,
                    error: errorMessage,
                    responseTime,
                    infrastructureStats
                });
            }

            return res.status(err.message.includes('Authorization') ? 401 : 500).json({
                error: err.message || 'Failed to initialize OAuth'
            });
        }
    }
);

// Handle OAuth callback
export const bungieOAuthCallback = onRequest(
    {
        region: 'australia-southeast1',
        secrets: [bungieClientId, bungieApiKey, bungieRedirectUri],
        maxInstances: 1,
    },
    async (req, res) => {
        const startTime = Date.now();
        const tracker = new InfrastructureTracker();
        const db = getDb();
        const bungieClient = new BungieApiClient(bungieApiKey.value(), tracker);

        let userId = null;
        let platformType = null;
        let success = false;
        let errorMessage = null;

        const { code, state } = req.query;

        console.log(`[OAuth Callback] Received callback with state: ${state}`);

        if (!code || !state) {
            console.error(`[OAuth Callback] Missing parameters - code: ${!!code}, state: ${!!state}`);
            return res.status(400).send("Missing code or state parameter");
        }

        try {
            // 1. Validate state
            const stateRef = db.collection('oauth_states').doc(state);
            const stateDoc = await stateRef.get();
            tracker.trackRead(1, 'oauth state validation');

            if (!stateDoc.exists) {
                console.error(`[OAuth Callback] State document not found: ${state}`);
                errorMessage = 'Invalid or expired state';
                return res.status(400).send("Invalid or expired state");
            }

            const stateData = stateDoc.data();
            userId = stateData.userId;
            const createdAt = stateData.createdAt;

            // Initialize OAuth stats for user
            await initializeUserOAuthStats(db, userId, tracker);

            // Check if state is expired (15 minutes max)
            const stateAge = Date.now() - createdAt;
            const maxAge = 15 * 60 * 1000;

            if (stateAge > maxAge) {
                console.error(`[OAuth Callback] State expired - age: ${Math.round(stateAge / 1000)}s`);
                await stateRef.delete().catch(e => console.error("Failed to delete expired state:", e));
                tracker.trackWrite(1, 'delete expired state');
                errorMessage = 'OAuth state expired';
                throw new Error("OAuth state has expired. Please try again.");
            }

            console.log(`[OAuth Callback] Valid state found for user: ${userId}`);

            // 2. Exchange code for token
            console.log(`[OAuth Callback] Exchanging code for token...`);
            const tokenData = await bungieClient.exchangeOAuthToken(
                code,
                bungieClientId.value(),
                bungieRedirectUri.value()
            );

            console.log(`[OAuth Callback] Token exchange successful`);

            // 3. Get user memberships
            console.log(`[OAuth Callback] Fetching user memberships...`);
            const userJson = await bungieClient.getCurrentUserMemberships(tokenData.access_token);

            const profile = userJson.Response?.bungieNetUser;
            const memberships = userJson.Response?.destinyMemberships || [];

            if (!memberships.length) {
                console.error(`[OAuth Callback] No Destiny memberships found`);
                errorMessage = 'No Destiny profile found';
                throw new Error("No Destiny profile found on this Bungie account.");
            }

            console.log(`[OAuth Callback] Found ${memberships.length} Destiny membership(s)`);
            const mainMembership = memberships[0]; // Could add logic to select preferred profile
            platformType = mainMembership.membershipType;

            // 4. Calculate token expiration
            const tokenExpires = tokenData.expires_in
                ? Date.now() + (tokenData.expires_in * 1000)
                : Date.now() + (3600 * 1000); // Default to 1 hour

            // 5. Save user data
            const userData = {
                bungieMembershipId: mainMembership.membershipId,
                accessToken: tokenData.access_token,
                tokenExpires: tokenExpires,
                displayName: mainMembership.displayName || profile?.displayName || '',
                platformType: mainMembership.membershipType,
                icon: profile?.profilePicturePath
                    ? `https://www.bungie.net${profile.profilePicturePath}`
                    : '',
                linkedAt: Date.now(),
                lastTokenRefresh: Date.now()
            };

            console.log(`[OAuth Callback] Saving user data for ${userData.displayName}...`);
            await db.doc(`users/${userId}/destiny/meta`).set(userData);
            tracker.trackWrite(1, 'save user destiny meta');

            // 6. Clean up state
            await stateRef.delete();
            tracker.trackWrite(1, 'cleanup oauth state');

            success = true;
            console.log(`[OAuth Callback] Successfully linked account for user ${userId}`);

            // 7. Update success stats
            const responseTime = Date.now() - startTime;
            const infrastructureStats = tracker.calculateRealCosts();

            await updateOAuthStats(db, tracker, {
                userId,
                operation: 'callback',
                success: true,
                platformType,
                responseTime,
                infrastructureStats
            });

            // 8. Redirect to success
            console.log(`[OAuth Callback] Redirecting to success page`);
            return res.redirect('/destiny?linked=1');

        } catch (err) {
            console.error(`[OAuth Callback] Error:`, err);
            errorMessage = err.message || 'Unknown error';

            // Update failure stats if we have a userId
            if (userId) {
                const responseTime = Date.now() - startTime;
                const infrastructureStats = tracker.calculateRealCosts();

                await updateOAuthStats(db, tracker, {
                    userId,
                    operation: 'callback',
                    success: false,
                    error: errorMessage,
                    responseTime,
                    infrastructureStats
                });
            }

            return res.status(500).send(`OAuth failed: ${errorMessage}`);
        }
    }
);