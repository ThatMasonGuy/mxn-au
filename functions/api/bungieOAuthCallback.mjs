import { onRequest } from "firebase-functions/v2/https";
import fetch from "node-fetch";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { defineSecret } from 'firebase-functions/params';

const bungieClientId = defineSecret('BUNGIE_CLIENT_ID');
const bungieApiKey = defineSecret('BUNGIE_API_KEY');
const bungieRedirectUri = defineSecret('BUNGIE_REDIRECT_URI');

initializeApp({ credential: applicationDefault() });

export const bungieOAuthCallback = onRequest(
    {
        region: 'australia-southeast1',
        secrets: [bungieClientId, bungieApiKey, bungieRedirectUri]
    },
    async (req, res) => {
        const BUNGIE_CLIENT_ID = bungieClientId.value();
        const BUNGIE_API_KEY = bungieApiKey.value();
        const BUNGIE_REDIRECT_URI = bungieRedirectUri.value();
        const { code, state } = req.query;

        if (!code || !state) {
            res.status(400).send("Missing code or state");
            return;
        }

        // Look up state in Firestore to find userId
        const stateDoc = await getFirestore().collection('oauth_states').doc(state).get();
        if (!stateDoc.exists) {
            res.status(400).send("Invalid or expired state");
            return;
        }
        const { userId } = stateDoc.data();
        await getFirestore().collection('oauth_states').doc(state).delete();

        // --- Bungie token exchange ---
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('client_id', BUNGIE_CLIENT_ID);
        params.append('redirect_uri', BUNGIE_REDIRECT_URI);

        const tokenRes = await fetch("https://www.bungie.net/platform/app/oauth/token/", {
            method: "POST",
            body: params,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        const tokenJson = await tokenRes.json();
        console.log("Bungie tokenJson:", tokenJson);

        if (!tokenJson.access_token) {
            res.status(500).send("No access token returned from Bungie");
            return;
        }

        // --- Get Destiny Memberships ---
        const userRes = await fetch("https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/", {
            headers: {
                "Authorization": `Bearer ${tokenJson.access_token}`,
                "X-API-Key": BUNGIE_API_KEY
            }
        });
        const userJson = await userRes.json();
        const profile = userJson.Response?.bungieNetUser;
        const memberships = userJson.Response?.destinyMemberships || [];

        if (!memberships.length) {
            res.status(400).send("No Destiny profile found on this Bungie account.");
            return;
        }

        const mainMembership = memberships[0]; // You could add logic to select preferred profile

        // Save only correct Destiny membershipId/type!
        await getFirestore().doc(`users/${userId}/destiny/meta`).set({
            bungieMembershipId: mainMembership.membershipId,    // Destiny profile id
            accessToken: tokenJson.access_token || '',
            tokenExpires: (tokenJson.expires_in ? (Date.now() + tokenJson.expires_in * 1000) : 0), // see below!
            displayName: mainMembership.displayName || profile?.displayName || '',
            platformType: mainMembership.membershipType,        // Destiny membership type (numeric)
            icon: profile?.profilePicturePath
                ? `https://www.bungie.net${profile.profilePicturePath}` : '',
        });

        // Redirect to app
        res.redirect('/destiny?linked=1');
    }
);
