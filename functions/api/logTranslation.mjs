import { onRequest } from "firebase-functions/v2/https";
import { PubSub } from "@google-cloud/pubsub";

const pubsub = new PubSub();

/**
 * Lightweight logging endpoint for translation stats
 * Called by client AFTER translation is received (non-blocking)
 * 
 * POST /logTranslation
 * Body: { translationData, cached, responseTime, platform, platformInfo, version }
 */
export const logTranslation = onRequest(
  {
    region: "australia-southeast1",
    timeoutSeconds: 10,
    memory: "256MiB",
    cors: true,
  },
  async (req, res) => {
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const { translationData, cached, responseTime, platform, platformInfo, version } = req.body;

      // Publish to stats topic (fire-and-forget)
      const statsEvent = {
        platform,
        platformInfo,
        translationData,
        cached,
        responseTime,
        timestamp: Date.now(),
        version,
      };

      pubsub
        .topic("translation-stats")
        .publishMessage({ json: statsEvent })
        .catch((err) => console.error("Failed to publish stats:", err));

      // Return immediately - don't wait for pub/sub
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Logging error:", error);
      // Don't fail the request even if logging fails
      return res.status(200).json({ success: true, warning: "Logging failed" });
    }
  }
);
