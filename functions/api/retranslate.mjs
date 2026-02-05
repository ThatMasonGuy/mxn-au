import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { DeeplService } from "../services/deeplService.mjs";

const DEEPL_API_KEY = defineSecret("DEEPL_API_KEY");

/**
 * Async retranslation endpoint for DeepL accuracy metrics
 * Called by frontend after initial translation is displayed
 * Also updates the cache with retranslation data
 * 
 * POST /retranslate
 * Body: { translatedText, fromLang, targetLang, originalText, cacheId }
 */
export const retranslate = onRequest(
  {
    region: "australia-southeast1",
    timeoutSeconds: 30,
    memory: "256MiB",
    cors: true,
    secrets: [DEEPL_API_KEY],
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
      const { translatedText, fromLang, targetLang, originalText, cacheId } = req.body;

      if (!translatedText || !fromLang || !targetLang || !originalText) {
        return res.status(400).json({
          error: "Missing required fields: translatedText, fromLang, targetLang, originalText"
        });
      }

      const deeplKey = DEEPL_API_KEY.value();
      const deepl = new DeeplService(deeplKey);

      const result = await deepl.retranslate(
        translatedText,
        fromLang,
        targetLang,
        originalText
      );

      // Update cache document with retranslation data
      if (cacheId) {
        const { db } = await import("../config/firebase.mjs");
        const { FieldValue } = await import("firebase-admin/firestore");

        try {
          await db.collection("translations").doc(cacheId).update({
            retranslated: result.retranslated,
            accuracy: result.accuracy,
            accuracyRating: result.accuracyRating,
            retranslationCompletedAt: FieldValue.serverTimestamp(),
          });
          console.log(`Updated cache ${cacheId} with retranslation data`);
        } catch (cacheError) {
          console.error("Failed to update cache with retranslation:", cacheError);
          // Don't fail the request if cache update fails
        }
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Retranslation error:", error);
      return res.status(500).json({
        error: "Retranslation failed",
        details: error.message,
      });
    }
  }
);
