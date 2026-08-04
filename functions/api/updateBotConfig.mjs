import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { requireManagedDiscordGuild } from './discordSession.mjs';

const BOT_SERVER_URL = defineSecret("BOT_SERVER_URL");
const BOT_API_KEY = defineSecret("BOT_API_KEY");

export const updateBotConfig = onRequest(
  {
    region: "australia-southeast1",
    timeoutSeconds: 30,
    memory: "512MiB",
    cors: true,
    secrets: [BOT_SERVER_URL, BOT_API_KEY],
  },
  async (req, res) => {
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed. Please use POST." });
    }

    const { serverId, config } = req.body;
    if (!serverId || !config) {
      return res.status(400).json({ error: "Missing serverId or config in request body" });
    }

    try {
      await requireManagedDiscordGuild(req, serverId);

      // Update config on bot server
      const updateResponse = await fetch(`${BOT_SERVER_URL.value()}/api/config/${serverId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BOT_API_KEY.value()}`,
        },
        body: JSON.stringify(config),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update server configuration");
      }

      const updatedConfig = await updateResponse.json();

      return res.json({ config: updatedConfig });
    } catch (error) {
      console.error("Error updating config:", error);
      const status = Number(error?.status) || 500;
      return res.status(status).json({
        error: status === 500 ? "Failed to update configuration" : error.message,
      });
    }
  }
);
