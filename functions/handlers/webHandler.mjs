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

        // FIXED: Authentication is now OPTIONAL for web requests
        // Users can translate without being logged in (local history only)
        // If they are logged in, their translations will be saved to cloud
        return {
            valid: true,
            apiKey,
            content,
            fromLang,
            targetLang,
            userId: platformInfo.userId, // Will be null if not authenticated, and that's OK!
        };
    }

    async enrichResponse(response, platformInfo) {
        return {
            ...response,
            platform: "web",
            userId: platformInfo.userId, // Can be null for unauthenticated users
        };
    }
}