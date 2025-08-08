export class WebHandler {
    async validateRequest(req, platformInfo) {
        const { content, fromLang, targetLang } = req.body;
        const authHeader = req.headers.authorization;

        const apiKey =
            req.headers["x-openai-key"] || authHeader?.replace("Bearer ", "") || null;

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
                error: "Missing required fields: content, fromLang, targetLang",
            };
        }

        if (!platformInfo.userId) {
            return {
                valid: false,
                status: 401,
                error: "User authentication failed",
            };
        }

        return {
            valid: true,
            apiKey,
            content,
            fromLang,
            targetLang,
            userId: platformInfo.userId,
        };
    }

    async enrichResponse(response, platformInfo) {
        return {
            ...response,
            platform: "web",
            userId: platformInfo.userId,
        };
    }
}