import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

const BOT_SERVER_URL = defineSecret("BOT_SERVER_URL");
const BOT_API_KEY = defineSecret("BOT_API_KEY");

export const getBotConfig = onRequest(
  {
    region: "australia-southeast1",
    timeoutSeconds: 30,
    memory: "512MiB",
    cors: true,
    secrets: [BOT_SERVER_URL, BOT_API_KEY],
  },
  async (req, res) => {
    res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Authorization");

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed. Please use GET." });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const serverId = req.query.serverId;
    if (!serverId) {
      return res.status(400).json({ error: "Missing serverId parameter" });
    }

    const accessToken = authHeader.substring(7);

    try {
      // Verify user has permission to manage this server
      const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!guildsResponse.ok) {
        throw new Error("Failed to fetch user guilds");
      }

      const guilds = await guildsResponse.json();
      const guild = guilds.find((g) => g.id === serverId);

      // Check if user has MANAGE_SERVER permission (0x00000020)
      if (!guild || (parseInt(guild.permissions) & 0x00000020) !== 0x00000020) {
        return res.status(403).json({ error: "You do not have permission to manage this server" });
      }

      // Fetch config from bot server
      const configResponse = await fetch(`${BOT_SERVER_URL.value()}/api/config/${serverId}`, {
        headers: {
          Authorization: `Bearer ${BOT_API_KEY.value()}`,
        },
      });

      if (!configResponse.ok) {
        throw new Error("Failed to fetch server configuration");
      }

      const config = await configResponse.json();

      return res.json({ config });
    } catch (error) {
      console.error("Error fetching config:", error);
      return res.status(500).json({
        error: "Failed to fetch configuration",
        details: error.message,
      });
    }
  }
);
