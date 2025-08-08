import { onMessagePublished } from "firebase-functions/v2/pubsub";
import { WebStatsProcessor } from "../stats/webStatsProcessor.mjs";
import { DiscordStatsProcessor } from "../stats/discordStatsProcessor.mjs";

export const processTranslationStats = onMessagePublished(
    {
        topic: "translation-stats",
        region: "australia-southeast1",
        timeoutSeconds: 60,
        memory: "512MiB",
        retry: true,
    },
    async (event) => {
        try {
            const data = event.data.message.json;

            const eventTimestamp = event.timestamp;
            const eventAge = Date.now() - Date.parse(eventTimestamp);
            const eventMaxAge = 10 * 60 * 1000; // 10 minutes

            if (eventAge > eventMaxAge) {
                console.log(`Dropping event (age: ${eventAge}ms)`);
                return;
            }

            const retryCount = event.data.deliveryAttempt || 0;
            if (retryCount > 0) {
                console.log(`Retry attempt ${retryCount} for event`);
            }

            const processor =
                data.platform === "discord"
                    ? new DiscordStatsProcessor()
                    : new WebStatsProcessor();

            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Processing timeout")), 30000)
            );

            await Promise.race([processor.process(data), timeout]);

            console.log(`Processed ${data.platform} stats for translation`);
        } catch (error) {
            console.error("Error processing translation stats:", error);

            throw error;
        }
    }
);