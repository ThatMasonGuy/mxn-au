import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { db } from "../config/firebase.mjs";

const DISCORD_CLIENT_ID = defineSecret("DISCORD_CLIENT_ID");
const DISCORD_CLIENT_SECRET = defineSecret("DISCORD_CLIENT_SECRET");
const BOT_SERVER_URL = defineSecret("BOT_SERVER_URL");
const BOT_API_KEY = defineSecret("BOT_API_KEY");

// Discord permission bit for MANAGE_GUILD
const MANAGE_GUILD = 0x20;

// Buffer time before expiry to trigger refresh (5 minutes)
const REFRESH_BUFFER_MS = 5 * 60 * 1000;

/**
 * Refresh Discord access token using refresh token
 */
async function refreshDiscordToken(userId, refreshToken) {
  console.log(`Refreshing token for user ${userId}`);

  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID.value(),
      client_secret: DISCORD_CLIENT_SECRET.value(),
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const tokenData = await response.json();

  if (!response.ok) {
    console.error("Token refresh failed:", tokenData);
    throw new Error(tokenData.error_description || "Failed to refresh token");
  }

  const expiresAt = Date.now() + tokenData.expires_in * 1000;

  // Update Firestore with new tokens
  await db.collection("discord_users").doc(userId).update({
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token, // Discord may issue new refresh token
    expiresAt: expiresAt,
    updatedAt: new Date(),
  });

  console.log(`Token refreshed for user ${userId}, expires at ${new Date(expiresAt).toISOString()}`);

  return tokenData.access_token;
}

/**
 * Get valid access token for user, refreshing if necessary
 */
async function getValidAccessToken(userId) {
  const userDoc = await db.collection("discord_users").doc(userId).get();

  if (!userDoc.exists) {
    throw new Error("User not found. Please re-authenticate.");
  }

  const userData = userDoc.data();

  if (!userData.accessToken || !userData.refreshToken) {
    throw new Error("No tokens found. Please re-authenticate.");
  }

  // Check if token is expired or about to expire
  const now = Date.now();
  const expiresAt = userData.expiresAt || 0;

  if (now >= expiresAt - REFRESH_BUFFER_MS) {
    // Token expired or expiring soon, refresh it
    console.log(`Token for user ${userId} expired or expiring soon, refreshing...`);
    return await refreshDiscordToken(userId, userData.refreshToken);
  }

  // Token is still valid
  return userData.accessToken;
}

export const getDiscordServers = onRequest(
  {
    region: "australia-southeast1",
    timeoutSeconds: 30,
    memory: "512MiB",
    cors: true,
    secrets: [DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, BOT_SERVER_URL, BOT_API_KEY],
  },
  async (req, res) => {
    res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Authorization, Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed. Please use GET." });
    }

    // Get user ID from Authorization header
    // Format: "Bearer <userId>" (NOT the access token anymore)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const userId = authHeader.substring(7);

    // Validate userId format (Discord IDs are numeric strings, 17-19 digits)
    if (!/^\d{17,19}$/.test(userId)) {
      return res.status(401).json({ error: "Invalid user ID format" });
    }

    try {
      // Get valid access token from Firestore (refreshing if needed)
      let accessToken;
      try {
        accessToken = await getValidAccessToken(userId);
      } catch (tokenError) {
        console.error("Token error:", tokenError.message);
        return res.status(401).json({
          error: "Session expired",
          details: tokenError.message,
          requiresReauth: true,
        });
      }

      // Fetch user's guilds from Discord
      const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!guildsResponse.ok) {
        const errorText = await guildsResponse.text();
        console.error("Discord API error:", guildsResponse.status, errorText);

        // If Discord says unauthorized, the token might be revoked
        if (guildsResponse.status === 401) {
          return res.status(401).json({
            error: "Discord session invalid",
            details: "Please re-authenticate with Discord",
            requiresReauth: true,
          });
        }

        throw new Error(`Failed to fetch Discord guilds: ${guildsResponse.status}`);
      }

      const allGuilds = await guildsResponse.json();
      console.log(`Fetched ${allGuilds.length} guilds from Discord for user ${userId}`);

      // Filter to only guilds where user has MANAGE_GUILD permission
      const adminGuilds = allGuilds.filter((guild) => {
        const permissions = BigInt(guild.permissions);
        return (permissions & BigInt(MANAGE_GUILD)) === BigInt(MANAGE_GUILD);
      });
      console.log(`User has admin access to ${adminGuilds.length} guilds`);

      // Fetch bot's guilds from Express backend
      let botGuildsArray = [];
      try {
        const botApiUrl = BOT_SERVER_URL.value();
        console.log(`Fetching bot guilds from: ${botApiUrl}/api/guilds`);

        const botGuildsResponse = await fetch(`${botApiUrl}/api/guilds`, {
          headers: {
            Authorization: `Bearer ${BOT_API_KEY.value()}`,
          },
        });

        if (botGuildsResponse.ok) {
          const botData = await botGuildsResponse.json();

          // Handle both { guilds: [...] } and direct array formats
          if (Array.isArray(botData)) {
            botGuildsArray = botData;
          } else if (botData && Array.isArray(botData.guilds)) {
            botGuildsArray = botData.guilds;
          }
          console.log(`Bot is in ${botGuildsArray.length} guilds`);
        } else {
          const errorText = await botGuildsResponse.text();
          console.error("Bot API error:", botGuildsResponse.status, errorText);
        }
      } catch (botError) {
        console.error("Failed to fetch bot guilds:", botError.message);
        // Continue with empty array - user can still see their servers
      }

      // Create a Set of bot guild IDs for O(1) lookup
      const botGuildIds = new Set(botGuildsArray.map((g) => g.id));

      // Format the response with hasBotInstalled flag
      const serversWithBotStatus = adminGuilds.map((guild) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
        owner: guild.owner,
        permissions: guild.permissions,
        hasBotInstalled: botGuildIds.has(guild.id),
      }));

      // Sort: servers with bot first, then by name
      serversWithBotStatus.sort((a, b) => {
        if (a.hasBotInstalled && !b.hasBotInstalled) return -1;
        if (!a.hasBotInstalled && b.hasBotInstalled) return 1;
        return a.name.localeCompare(b.name);
      });

      console.log(`Returning ${serversWithBotStatus.length} servers to frontend`);

      return res.json({
        servers: serversWithBotStatus,
        botServers: botGuildsArray,
      });
    } catch (error) {
      console.error("Error fetching servers:", error);
      return res.status(500).json({
        error: "Failed to fetch servers",
        details: error.message,
      });
    }
  }
);
