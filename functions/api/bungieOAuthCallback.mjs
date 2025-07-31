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

        console.log(`[OAuth Callback] Received callback with state: ${state}`);

        if (!code || !state) {
            console.error(`[OAuth Callback] Missing parameters - code: ${!!code}, state: ${!!state}`);
            res.status(400).send("Missing code or state parameter");
            return;
        }

        // Look up state in Firestore to find userId
        const stateRef = getFirestore().collection('oauth_states').doc(state);
        const stateDoc = await stateRef.get();

        if (!stateDoc.exists) {
            console.error(`[OAuth Callback] State document not found: ${state}`);
            res.status(400).send("Invalid or expired state");
            return;
        }

        const stateData = stateDoc.data();
        const { userId, createdAt } = stateData;

        // Check if state is expired (15 minutes max)
        const stateAge = Date.now() - createdAt;
        const maxAge = 15 * 60 * 1000; // 15 minutes

        if (stateAge > maxAge) {
            console.error(`[OAuth Callback] State expired - age: ${Math.round(stateAge / 1000)}s, max: ${Math.round(maxAge / 1000)}s`);
            // Clean up expired state
            await stateRef.delete().catch(e => console.error("Failed to delete expired state:", e));
            res.status(400).send("OAuth state has expired. Please try again.");
            return;
        }

        console.log(`[OAuth Callback] Valid state found for user: ${userId}`);

        let tokenJson;
        try {
            // --- Bungie token exchange ---
            const params = new URLSearchParams();
            params.append('grant_type', 'authorization_code');
            params.append('code', code);
            params.append('client_id', BUNGIE_CLIENT_ID);
            params.append('redirect_uri', BUNGIE_REDIRECT_URI);

            console.log(`[OAuth Callback] Exchanging code for token...`);
            const tokenRes = await fetch("https://www.bungie.net/platform/app/oauth/token/", {
                method: "POST",
                body: params,
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            tokenJson = await tokenRes.json();
            console.log(`[OAuth Callback] Token response status: ${tokenRes.status}`);

            if (!tokenRes.ok || !tokenJson.access_token) {
                console.error(`[OAuth Callback] Token exchange failed:`, tokenJson);
                res.status(500).send(`Bungie token exchange failed: ${tokenJson.error_description || 'Unknown error'}`);
                return;
            }
        } catch (error) {
            console.error(`[OAuth Callback] Token exchange error:`, error);
            res.status(500).send("Failed to exchange authorization code for token");
            return;
        }

        let userJson;
        try {
            // --- Get Destiny Memberships ---
            console.log(`[OAuth Callback] Fetching user memberships...`);
            const userRes = await fetch("https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/", {
                headers: {
                    "Authorization": `Bearer ${tokenJson.access_token}`,
                    "X-API-Key": BUNGIE_API_KEY
                }
            });

            userJson = await userRes.json();
            console.log(`[OAuth Callback] User memberships response status: ${userRes.status}`);

            if (!userRes.ok) {
                console.error(`[OAuth Callback] Memberships fetch failed:`, userJson);
                res.status(500).send("Failed to fetch Bungie user data");
                return;
            }

            const profile = userJson.Response?.bungieNetUser;
            const memberships = userJson.Response?.destinyMemberships || [];

            if (!memberships.length) {
                console.error(`[OAuth Callback] No Destiny memberships found for user`);
                res.status(400).send("No Destiny profile found on this Bungie account.");
                return;
            }

            console.log(`[OAuth Callback] Found ${memberships.length} Destiny membership(s)`);
            const mainMembership = memberships[0]; // Could add logic to select preferred profile

            // Calculate token expiration (expires_in is in seconds)
            const tokenExpires = tokenJson.expires_in
                ? Date.now() + (tokenJson.expires_in * 1000)
                : Date.now() + (3600 * 1000); // Default to 1 hour if not provided

            // Save user data to Firestore
            const userData = {
                bungieMembershipId: mainMembership.membershipId,
                accessToken: tokenJson.access_token,
                tokenExpires: tokenExpires,
                displayName: mainMembership.displayName || profile?.displayName || '',
                platformType: mainMembership.membershipType,
                icon: profile?.profilePicturePath
                    ? `https://www.bungie.net${profile.profilePicturePath}` : '',
                linkedAt: Date.now(),
                lastTokenRefresh: Date.now()
            };

            console.log(`[OAuth Callback] Saving user data for ${userData.displayName}...`);
            await getFirestore().doc(`users/${userId}/destiny/meta`).set(userData);

            console.log(`[OAuth Callback] Successfully linked account for user ${userId}`);

        } catch (error) {
            console.error(`[OAuth Callback] User data processing error:`, error);
            res.status(500).send("Failed to process Bungie user data");
            return;
        }

        try {
            // Only delete state after everything succeeded
            await stateRef.delete();
            console.log(`[OAuth Callback] Cleaned up state document: ${state}`);
        } catch (error) {
            console.error(`[OAuth Callback] Failed to delete state (non-critical):`, error);
            // Don't fail the whole process for this
        }

        // Redirect to app with success indicator
        console.log(`[OAuth Callback] Redirecting to success page`);
        res.redirect('/destiny?linked=1');
    }
);