// /functions/api/startBungieOAuth.mjs
import { onRequest } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { defineSecret } from 'firebase-functions/params';

const bungieClientId = defineSecret('BUNGIE_CLIENT_ID');
const bungieRedirectUri = defineSecret('BUNGIE_REDIRECT_URI');

function randomString(len = 32) {
    return [...Array(len)].map(() => Math.random().toString(36)[2]).join('');
}

export const startBungieOAuth = onRequest(
    { region: 'australia-southeast1', secrets: [bungieClientId, bungieRedirectUri] },
    async (req, res) => {
        const BUNGIE_CLIENT_ID = bungieClientId.value();
        const BUNGIE_REDIRECT_URI = bungieRedirectUri.value();

        // Require Firebase Auth
        const authHeader = req.headers.authorization || '';
        const match = authHeader.match(/^Bearer (.+)$/);
        if (!match) return res.status(401).json({ error: 'No Auth' });

        const idToken = match[1];
        const { getAuth } = await import('firebase-admin/auth');
        let decoded;
        try {
            decoded = await getAuth().verifyIdToken(idToken);
        } catch (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        const userId = decoded.uid;

        // Generate short random state and save to Firestore for CSRF prevention
        const state = randomString(32);
        await getFirestore().collection('oauth_states').doc(state).set({
            userId,
            createdAt: Date.now()
        });

        // Build Bungie OAuth URL (refresh tokens are not supported for public clients!)
        const url = `https://www.bungie.net/en/OAuth/Authorize?client_id=${BUNGIE_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(BUNGIE_REDIRECT_URI)}&state=${state}&prompt=consent`;

        // Respond with redirect URL
        res.status(200).json({ redirectUrl: url });
    }
);