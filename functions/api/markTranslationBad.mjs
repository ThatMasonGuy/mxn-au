import { onRequest } from "firebase-functions/v2/https";
import { TranslationCache } from "../services/translationCache.mjs";

// Cache version - should match aiTranslate.mjs
const CACHE_VERSION = "v1";

/**
 * Mark a cached translation as bad
 * This will cause it to be regenerated on next request
 * 
 * POST /markTranslationBad
 * Body: { cacheId: "openai-en-es-abc123..." }
 */
export const markTranslationBad = onRequest(
  {
    region: "australia-southeast1",
    timeoutSeconds: 10,
    memory: "256MiB",
    cors: true,
  },
  async (req, res) => {
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    try {
      const { cacheId } = req.body;

      if (!cacheId) {
        return res.status(400).json({ error: "Missing cacheId" });
      }

      const cache = new TranslationCache(CACHE_VERSION);
      await cache.markAsBad(cacheId);

      return res.status(200).json({
        success: true,
        message: "Translation marked as bad and will be regenerated next time",
      });
    } catch (error) {
      console.error("Mark bad error:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);
