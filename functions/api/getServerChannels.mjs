// Firebase Cloud Function: getServerChannels
// Fetches fresh channel list from Discord API for a specific server

import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin
if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

// Define secrets
const DISCORD_BOT_TOKEN = defineSecret("DISCORD_BOT_TOKEN");

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * Get valid access token for user, refreshing if needed
 */
async function getValidAccessToken(userId) {
  const userDoc = await db.collection("discord_users").doc(userId).get();

  if (!userDoc.exists) {
    return null;
  }

  const userData = userDoc.data();
  return userData.accessToken;
}

/**
 * Fetch channels from Discord API using bot token
 * Bot token is more reliable than user token for getting full channel list
 */
async function fetchGuildChannels(guildId, botToken) {
  const response = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/channels`,
    {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("[Channels] Discord API error:", response.status, error);
    throw new Error(`Discord API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Check if user has access to this guild
 */
async function verifyUserGuildAccess(userId, guildId) {
  const accessToken = await getValidAccessToken(userId);

  if (!accessToken) {
    return false;
  }

  // Fetch user's guilds to verify access
  const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return false;
  }

  const guilds = await response.json();
  return guilds.some((g) => g.id === guildId);
}

export const getServerChannels = onRequest(
  {
    secrets: [DISCORD_BOT_TOKEN],
    region: "australia-southeast1",
    cors: true,
  },
  async (req, res) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      res.set(corsHeaders);
      return res.status(204).send("");
    }

    res.set(corsHeaders);

    // Only allow GET
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      // Get user ID from auth header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing authorization" });
      }

      const userId = authHeader.substring(7);

      // Get server ID from query
      const serverId = req.query.serverId;
      if (!serverId) {
        return res.status(400).json({ error: "serverId is required" });
      }

      // Verify user has access to this guild
      const hasAccess = await verifyUserGuildAccess(userId, serverId);
      if (!hasAccess) {
        return res.status(403).json({ error: "You don't have access to this server" });
      }

      // Fetch channels using bot token (more reliable, gets all channels)
      const botToken = DISCORD_BOT_TOKEN.value();
      const channels = await fetchGuildChannels(serverId, botToken);

      // Filter and format channels
      // Type 0 = Text, Type 5 = Announcement, Type 15 = Forum
      const textChannelTypes = [0, 5, 15];

      const formattedChannels = channels
        .filter((ch) => textChannelTypes.includes(ch.type))
        .map((ch) => ({
          id: ch.id,
          name: ch.name,
          type: ch.type,
          position: ch.position,
          parentId: ch.parent_id || null,
          topic: ch.topic || null,
          nsfw: ch.nsfw || false,
        }))
        .sort((a, b) => a.position - b.position);

      console.log(`[Channels] Returning ${formattedChannels.length} channels for guild ${serverId}`);

      return res.json({ channels: formattedChannels });
    } catch (error) {
      console.error("[Channels] Error:", error);
      return res.status(500).json({
        error: "Failed to fetch channels",
        details: error.message,
      });
    }
  }
);
