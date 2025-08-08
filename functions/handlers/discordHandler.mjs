export class DiscordHandler {
    async validateRequest(req, platformInfo) {
        const { content, fromLang, targetLang } = req.body;
        const apiKey =
            req.headers["x-openai-key"] ||
            req.headers["authorization"]?.replace("Bearer ", "");

        if (!apiKey) {
            return {
                valid: false,
                status: 401,
                error: "OpenAI API key required",
            };
        }

        if (!content || !fromLang || !targetLang) {
            return {
                valid: false,
                status: 400,
                error: "Missing required fields",
            };
        }

        // Discord-specific validation
        if (!platformInfo.guildId) {
            return {
                valid: false,
                status: 400,
                error: "Discord guild ID required",
            };
        }

        return {
            valid: true,
            apiKey,
            content,
            fromLang,
            targetLang,
            userId: platformInfo.userId,
            guildId: platformInfo.guildId,
            channelId: platformInfo.channelId,
        };
    }

    async enrichResponse(response, platformInfo) {
        return {
            ...response,
            platform: "discord",
            guildId: platformInfo.guildId,
            channelId: platformInfo.channelId,
            userId: platformInfo.userId,
        };
    }
}