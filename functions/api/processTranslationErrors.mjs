import { onMessagePublished } from "firebase-functions/v2/pubsub";
import { db } from "../config/firebase.mjs";
import { FieldValue } from "firebase-admin/firestore";

export const processTranslationErrors = onMessagePublished(
  {
    topic: "translation-errors",
    region: "australia-southeast1",
    timeoutSeconds: 30,
    memory: "256MiB",
    maxInstances: 1,
    retry: true,
  },
  async (event) => {
    try {
      const data = event.data.message.json;

      const eventTimestamp = event.timestamp;
      const eventAge = Date.now() - Date.parse(eventTimestamp);
      if (eventAge > 5 * 60 * 1000) {
        console.log("Dropping old error event");
        return;
      }

      const today = new Date().toISOString().split("T")[0];
      const errorRef = db.collection(`translations/errors/${today}`).doc();

      const retryCount = event.data.deliveryAttempt || 0;

      await errorRef.set({
        ...data,
        eventId: event.id,
        retryCount,
        processedAt: FieldValue.serverTimestamp(),
      });

      // Send alert for critical errors on first attempt
      if (data.error?.includes("API") && retryCount === 0) {
        console.error("Critical API error detected:", data.error);
        // await sendAlert(data);
      }

      console.log("Error logged:", data.error);
    } catch (error) {
      console.error("Failed to process error:", error);
      throw error;
    }
  }
);