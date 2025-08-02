// oauth.mjs (Consolidated OAuth functions)
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { getDb, InfrastructureTracker, verifyAuthToken } from "./shared/utils.mjs";
import { CacheManager } from "./shared/cacheManager.mjs";
import { BungieApiClient } from "./shared/bungieApiClient.mjs";

const bungieClientId = defineSecret('BUNGIE_CLIENT_ID');
const bungieApiKey = defineSecret('BUNGIE_API_KEY');
const bungieRedirectUri = defineSecret('BUNGIE_REDIRECT_URI');

// Generate random state string
function randomString(len = 32) {
    return [...Array(len)].map(() => Math.random().toString(36)[2]).join('');
}

// Start OAuth flow
export const startBungieOAuth = onRequest(
    {
        region: 'australia-southeast1',
        secrets: [bungieClientId, bungieRedirectUri]
    },
    async (req, res) => {
        const tracker = new InfrastructureTracker();
        const db = getDb();
        const cacheManager = new CacheManager(tracker);

        try {
            console.log('[OAuth Start] Starting OAuth flow');

            // 1. Verify authentication
            const decoded = await verifyAuthToken(req.headers.authorization);
            const userId = decoded.uid;

            console.log(`[OAuth Start] Authenticated user: ${userId}`);

            // 2. Clean up expired states
            await cacheManager.cleanupExpiredCaches('oauth');

            // 3. Clean up existing states for this user
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

            // 4. Generate new state
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

            // 5. Build OAuth URL
            const authUrl = new URL('https://www.bungie.net/en/OAuth/Authorize');
            authUrl.searchParams.set('client_id', bungieClientId.value());
            authUrl.searchParams.set('response_type', 'code');
            authUrl.searchParams.set('redirect_uri', bungieRedirectUri.value());
            authUrl.searchParams.set('state', state);
            authUrl.searchParams.set('prompt', 'consent');

            const redirectUrl = authUrl.toString();
            console.log(`[OAuth Start] Generated OAuth URL for state: ${state}`);

            // 6. Return response
            return res.status(200).json({
                redirectUrl,
                state
            });

        } catch (err) {
            console.error('[OAuth Start] Error:', err);
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
        secrets: [bungieClientId, bungieApiKey, bungieRedirectUri]
    },
    async (req, res) => {
        const tracker = new InfrastructureTracker();
        const db = getDb();
        const bungieClient = new BungieApiClient(bungieApiKey.value(), tracker);

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
                return res.status(400).send("Invalid or expired state");
            }

            const stateData = stateDoc.data();
            const { userId, createdAt } = stateData;

            // Check if state is expired (15 minutes max)
            const stateAge = Date.now() - createdAt;
            const maxAge = 15 * 60 * 1000;

            if (stateAge > maxAge) {
                console.error(`[OAuth Callback] State expired - age: ${Math.round(stateAge / 1000)}s`);
                await stateRef.delete().catch(e => console.error("Failed to delete expired state:", e));
                tracker.trackWrite(1, 'delete expired state');
                return res.status(400).send("OAuth state has expired. Please try again.");
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
                return res.status(400).send("No Destiny profile found on this Bungie account.");
            }

            console.log(`[OAuth Callback] Found ${memberships.length} Destiny membership(s)`);
            const mainMembership = memberships[0]; // Could add logic to select preferred profile

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
            console.log(`[OAuth Callback] Successfully linked account for user ${userId}`);

            // 7. Redirect to success
            console.log(`[OAuth Callback] Redirecting to success page`);
            return res.redirect('/destiny?linked=1');

        } catch (err) {
            console.error(`[OAuth Callback] Error:`, err);
            return res.status(500).send(`OAuth failed: ${err.message || 'Unknown error'}`);
        }
    }
);