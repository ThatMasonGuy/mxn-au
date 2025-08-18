import { onRequest } from "firebase-functions/v2/https";
import { PubSub } from "@google-cloud/pubsub";
import { TranslationCache } from "../services/translationCache.mjs";
import { OpenAIService } from "../services/openaiService.mjs";
import { PlatformDetector } from "../utils/platformDetector.mjs";
import { WebHandler } from "../handlers/webHandler.mjs";
import { DiscordHandler } from "../handlers/discordHandler.mjs";

const pubsub = new PubSub();

// Cache version - increment this to invalidate old cache
const CACHE_VERSION = "v1";

export const aiTranslate = onRequest(
  {
    region: "australia-southeast1",
    timeoutSeconds: 60,
    memory: "1GiB",
    maxInstances: 1,
    cors: true,
  },
  async (req, res) => {
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-openai-key, x-discord-bot, x-discord-user-id, x-discord-guild-id, x-discord-channel-id"
    );

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ error: "Method not allowed. Please use POST." });
    }

    const startTime = Date.now();

    try {
      // ---- PREP: Extract body fields needed for cache in parallel ----
      const { content, fromLang, targetLang } = req.body;
      const cache = new TranslationCache(CACHE_VERSION);

      // ---- PARALLELIZE: Platform detection (with token check) & cache lookup ----
      const [platformInfo, cacheResult] = await Promise.all([
        PlatformDetector.detect(req),
        cache.get(content, fromLang, targetLang),
      ]);

      // ---- Handler selection after platformInfo is available ----
      const handler =
        platformInfo.platform === "discord"
          ? new DiscordHandler()
          : new WebHandler();

      // ---- Validate request (no redundant token validation!) ----
      const validation = await handler.validateRequest(req, platformInfo);
      if (!validation.valid) {
        return res.status(validation.status).json({ error: validation.error });
      }

      let translationResult;
      let cached = false;

      // ---- Serve from cache if possible ----
      if (cacheResult) {
        cached = true;
        translationResult = cacheResult;
        // Fire-and-forget async hit count update
        cache.updateHitCount(cacheResult.id).catch(console.error);
      } else {
        // ---- Cache miss, call OpenAI, then save ----
        const openai = new OpenAIService(validation.apiKey);
        translationResult = await openai.translate(
          validation.content,
          validation.fromLang,
          validation.targetLang
        );
        translationResult.version = CACHE_VERSION;
        cache.save(translationResult).catch(console.error);
      }

      // ---- Publish stats event (non-blocking) ----
      const statsEvent = {
        platform: platformInfo.platform,
        platformInfo,
        translationData: translationResult,
        cached,
        responseTime: Date.now() - startTime,
        timestamp: Date.now(),
        version: CACHE_VERSION,
      };
      pubsub
        .topic("translation-stats")
        .publishMessage({ json: statsEvent })
        .catch((err) => console.error("Failed to publish stats:", err));

      // ---- Return the response immediately ----
      return res.status(cached ? 200 : 201).json({
        ...translationResult,
        cached,
        responseTime: Date.now() - startTime,
      });
    } catch (error) {
      // ---- Error handling, including pubsub ----
      console.error("Translation error:", error);
      pubsub
        .topic("translation-errors")
        .publishMessage({
          json: {
            error: error.message,
            stack: error.stack,
            timestamp: Date.now(),
            request: req.body,
          },
        })
        .catch(console.error);

      return res.status(500).json({
        error: "Translation failed",
        details: error.message,
      });
    }
  }
);