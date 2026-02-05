import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { db } from "../config/firebase.mjs";

const DISCORD_CLIENT_ID = defineSecret("DISCORD_CLIENT_ID");
const DISCORD_CLIENT_SECRET = defineSecret("DISCORD_CLIENT_SECRET");
const DISCORD_REDIRECT_URI = defineSecret("DISCORD_REDIRECT_URI");

export const discordAuth = onRequest(
  {
    region: "australia-southeast1",
    timeoutSeconds: 30,
    memory: "512MiB",
    cors: true,
    secrets: [DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI],
  },
  async (req, res) => {
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed. Please use POST." });
    }

    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Missing authorization code" });
    }

    try {
      // Exchange code for access token
      const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: DISCORD_CLIENT_ID.value(),
          client_secret: DISCORD_CLIENT_SECRET.value(),
          grant_type: "authorization_code",
          code: code,
          redirect_uri: DISCORD_REDIRECT_URI.value(),
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        console.error("Discord token error:", tokenData);
        throw new Error(tokenData.error_description || "Failed to get access token");
      }

      // Get user information
      const userResponse = await fetch("https://discord.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      // Calculate expiry timestamp
      const expiresAt = Date.now() + tokenData.expires_in * 1000;

      // Store tokens securely in Firestore (server-side only)
      // These tokens NEVER leave the server
      await db.collection("discord_users").doc(userData.id).set(
        {
          // User profile (safe to share)
          id: userData.id,
          username: userData.username,
          discriminator: userData.discriminator,
          avatar: userData.avatar,
          
          // Tokens (NEVER sent to frontend)
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          tokenType: tokenData.token_type,
          scope: tokenData.scope,
          expiresAt: expiresAt,
          
          // Metadata
          updatedAt: new Date(),
          lastLoginAt: new Date(),
        },
        { merge: true }
      );

      console.log(`User ${userData.username} (${userData.id}) authenticated successfully`);

      // Return ONLY safe user data to frontend
      // NO tokens, NO sensitive data
      return res.json({
        user: {
          id: userData.id,
          username: userData.username,
          discriminator: userData.discriminator,
          avatar: userData.avatar,
          avatarUrl: userData.avatar
            ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(userData.discriminator || "0") % 5}.png`,
        },
        // Session indicator - frontend uses this to prove they authenticated
        // This is the user's Discord ID, which is already public
        sessionId: userData.id,
      });
    } catch (error) {
      console.error("Discord auth error:", error);
      return res.status(500).json({
        error: "Authentication failed",
        details: error.message,
      });
    }
  }
);
