import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { TranslationCache } from "../services/translationCache.mjs";
import { OpenAIService } from "../services/openaiService.mjs";
import { DeeplService } from "../services/deeplService.mjs";
import { PlatformDetector } from "../utils/platformDetector.mjs";
import { WebHandler } from "../handlers/webHandler.mjs";
import { DiscordHandler } from "../handlers/discordHandler.mjs";

const DEEPL_API_KEY = defineSecret("DEEPL_API_KEY");

// Cache version - increment this to invalidate old cache
const CACHE_VERSION = "v1";

export const aiTranslate = onRequest(
  {
    region: "australia-southeast1",
    timeoutSeconds: 60,
    memory: "1GiB",
    maxInstances: 1,
    cors: true,
    secrets: [DEEPL_API_KEY],
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
      const { content, fromLang, targetLang, model = 'openai' } = req.body;
      const cache = new TranslationCache(CACHE_VERSION);

      // ---- PARALLELIZE: Platform detection (with token check) & cache lookup ----
      const [platformInfo, cacheResult] = await Promise.all([
        PlatformDetector.detect(req),
        cache.get(content, fromLang, targetLang, model), // Include model in cache key
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
        // ---- Cache miss, call appropriate translation service ----
        let translationService;
        let actualModel = model; // Track which model we actually use

        if (model === 'deepl') {
          const deeplKey = DEEPL_API_KEY.value();
          const deeplService = new DeeplService(deeplKey);

          // Check if DeepL supports both languages
          const deeplSupported = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ru', 'tr', 'nl', 'sv', 'no', 'da', 'fi', 'pl', 'cs', 'hu'];
          const supportsFromLang = deeplSupported.includes(validation.fromLang);
          const supportsToLang = deeplSupported.includes(validation.targetLang);

          if (!supportsFromLang || !supportsToLang) {
            // Fall back to OpenAI for unsupported languages
            console.log(`DeepL doesn't support ${validation.fromLang}->${validation.targetLang}, using OpenAI`);
            translationService = new OpenAIService(validation.apiKey);
            actualModel = 'openai';
          } else {
            translationService = deeplService;
          }
        } else {
          // Default to OpenAI
          translationService = new OpenAIService(validation.apiKey);
        }

        translationResult = await translationService.translate(
          validation.content,
          validation.fromLang,
          validation.targetLang
        );
        translationResult.version = CACHE_VERSION;
        translationResult.model = actualModel; // Store which model was actually used

        // Save to cache and capture the ID
        const savedCacheId = await cache.save(translationResult, actualModel).catch(err => {
          console.error("Cache save error:", err);
          return null;
        });

        // Add the cache ID to the result so frontend can mark it as bad
        translationResult.id = savedCacheId;
      }

      // ---- Return the response immediately (no pub/sub blocking) ----
      return res.status(cached ? 200 : 201).json({
        ...translationResult,
        cached,
        cacheId: translationResult.id,
        responseTime: Date.now() - startTime,
        platform: platformInfo.platform,
        // Include minimal metadata for client-side logging
        logData: {
          platform: platformInfo.platform,
          platformInfo,
          cached,
          version: CACHE_VERSION,
        }
      });
    } catch (error) {
      // ---- Error handling ----
      console.error("Translation error:", error);

      return res.status(500).json({
        error: "Translation failed",
        details: error.message,
      });
    }
  }
);