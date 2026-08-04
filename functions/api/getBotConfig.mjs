import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { requireManagedDiscordGuild } from './discordSession.mjs';

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

    const serverId = req.query.serverId;
    if (!serverId) {
      return res.status(400).json({ error: "Missing serverId parameter" });
    }

    try {
      await requireManagedDiscordGuild(req, serverId);

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
      const status = Number(error?.status) || 500;
      return res.status(status).json({
        error: status === 500 ? "Failed to fetch configuration" : error.message,
      });
    }
  }
);
