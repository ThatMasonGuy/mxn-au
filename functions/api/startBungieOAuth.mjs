import { onRequest } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { defineSecret } from 'firebase-functions/params';

const bungieClientId = defineSecret('BUNGIE_CLIENT_ID');
const bungieRedirectUri = defineSecret('BUNGIE_REDIRECT_URI');

function randomString(len = 32) {
    return [...Array(len)].map(() => Math.random().toString(36)[2]).join('');
}

// Clean up expired state documents (older than 15 minutes)
async function cleanupExpiredStates() {
    try {
        const expiredThreshold = Date.now() - (15 * 60 * 1000); // 15 minutes ago
        const statesRef = getFirestore().collection('oauth_states');

        // Query for expired states
        const expiredQuery = await statesRef.where('createdAt', '<', expiredThreshold).get();

        if (!expiredQuery.empty) {
            console.log(`[State Cleanup] Found ${expiredQuery.size} expired state documents`);

            const batch = getFirestore().batch();
            expiredQuery.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            await batch.commit();
            console.log(`[State Cleanup] Deleted ${expiredQuery.size} expired state documents`);
        }
    } catch (error) {
        console.error('[State Cleanup] Error cleaning up expired states:', error);
        // Don't throw - cleanup failure shouldn't break the main flow
    }
}

export const startBungieOAuth = onRequest(
    { region: 'australia-southeast1', secrets: [bungieClientId, bungieRedirectUri] },
    async (req, res) => {
        const BUNGIE_CLIENT_ID = bungieClientId.value();
        const BUNGIE_REDIRECT_URI = bungieRedirectUri.value();

        console.log(`[OAuth Start] Starting OAuth flow`);

        // Require Firebase Auth
        const authHeader = req.headers.authorization || '';
        const match = authHeader.match(/^Bearer (.+)$/);
        if (!match) {
            console.error(`[OAuth Start] No authorization header`);
            return res.status(401).json({ error: 'No Authorization header' });
        }

        const idToken = match[1];
        let decoded;
        try {
            const { getAuth } = await import('firebase-admin/auth');
            decoded = await getAuth().verifyIdToken(idToken);
        } catch (err) {
            console.error(`[OAuth Start] Invalid Firebase token:`, err.message);
            return res.status(401).json({ error: 'Invalid Firebase token' });
        }

        const userId = decoded.uid;
        console.log(`[OAuth Start] Authenticated user: ${userId}`);

        // Clean up any existing expired states before creating a new one
        await cleanupExpiredStates();

        // Also clean up any existing states for this specific user (in case they clicked multiple times)
        try {
            const existingStatesQuery = await getFirestore()
                .collection('oauth_states')
                .where('userId', '==', userId)
                .get();

            if (!existingStatesQuery.empty) {
                console.log(`[OAuth Start] Found ${existingStatesQuery.size} existing state(s) for user, cleaning up...`);
                const batch = getFirestore().batch();
                existingStatesQuery.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            }
        } catch (error) {
            console.error('[OAuth Start] Error cleaning up existing user states:', error);
            // Continue anyway
        }

        // Generate new state and save to Firestore for CSRF prevention
        const state = randomString(32);
        const stateData = {
            userId,
            createdAt: Date.now(),
            userAgent: req.headers['user-agent'] || '',
            ip: req.ip || req.connection?.remoteAddress || 'unknown'
        };

        try {
            await getFirestore().collection('oauth_states').doc(state).set(stateData);
            console.log(`[OAuth Start] Created state document: ${state} for user: ${userId}`);
        } catch (error) {
            console.error(`[OAuth Start] Failed to save state:`, error);
            return res.status(500).json({ error: 'Failed to initialize OAuth state' });
        }

        // Build Bungie OAuth URL
        const authUrl = new URL('https://www.bungie.net/en/OAuth/Authorize');
        authUrl.searchParams.set('client_id', BUNGIE_CLIENT_ID);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('redirect_uri', BUNGIE_REDIRECT_URI);
        authUrl.searchParams.set('state', state);
        authUrl.searchParams.set('prompt', 'consent'); // Force consent screen

        const redirectUrl = authUrl.toString();
        console.log(`[OAuth Start] Generated OAuth URL for state: ${state}`);

        // Respond with redirect URL
        res.status(200).json({
            redirectUrl,
            state // Include state in response for debugging (remove in production if sensitive)
        });
    }
);