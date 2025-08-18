import { firebaseAdmin } from "../config/firebase.mjs";

export class PlatformDetector {
    static async detect(req) {
        const body = req.body;
        const headers = req.headers;

        const isDiscord =
            headers["x-discord-bot"] === "true" || body.platform === "discord";

        if (isDiscord) {
            return {
                platform: "discord",
                userId: body.discordUserId || headers["x-discord-user-id"],
                guildId: body.guildId || headers["x-discord-guild-id"],
                channelId: body.channelId || headers["x-discord-channel-id"],
                guildName: body.guildName || headers["x-discord-guild-name"],
                channelName: body.channelName || headers["x-discord-channel-name"],
                userName: body.userName || headers["x-discord-user-name"],
            };
        }

        let userId = null;
        const authHeader = headers.authorization;

        if (
            authHeader &&
            authHeader.startsWith("Bearer ") &&
            authHeader.length > 50
        ) {
            try {
                const idToken = authHeader.substring(7);
                const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
                userId = decodedToken.uid;
            } catch (e) {
                console.log("Could not decode Firebase token");
            }
        }

        return {
            platform: "web",
            userId,
            guildId: null,
            channelId: null,
            guildName: null,
            channelName: null,
            userName: null,
        };
    }
}