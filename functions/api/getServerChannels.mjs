// Firebase Cloud Function: getServerChannels
// Fetches fresh channel list from Discord API for a specific server

import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { requireManagedDiscordGuild } from './discordSession.mjs';

// Define secrets
const DISCORD_BOT_TOKEN = defineSecret("DISCORD_BOT_TOKEN");

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

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
      // Get server ID from query
      const serverId = req.query.serverId;
      if (!serverId) {
        return res.status(400).json({ error: "serverId is required" });
      }

      await requireManagedDiscordGuild(req, serverId);

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
      const status = Number(error?.status) || 500;
      return res.status(status).json({
        error: status === 500 ? "Failed to fetch channels" : error.message,
        details: status === 500 ? undefined : error.message,
      });
    }
  }
);
