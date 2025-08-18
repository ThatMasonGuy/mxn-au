export class CostCalculator {
    static PRICING = {
        PROMPT: 0.0025,
        COMPLETION: 0.01,
    };

    static calculateCost(tokenUsage) {
        if (!tokenUsage) return 0;

        const promptCost = ((tokenUsage.prompt || 0) * this.PRICING.PROMPT) / 1000;
        const completionCost =
            ((tokenUsage.completion || 0) * this.PRICING.COMPLETION) / 1000;

        return {
            prompt: promptCost,
            completion: completionCost,
            total: promptCost + completionCost,
        };
    }

    static calculateSavings(savedTokenUsage) {
        if (!savedTokenUsage) return 0;
        return this.calculateCost(savedTokenUsage).total;
    }

    static aggregateCosts(documents) {
        let totalCost = 0;
        let totalSavings = 0;
        let totalTokens = { prompt: 0, completion: 0, total: 0 };
        let savedTokens = { prompt: 0, completion: 0, total: 0 };

        documents.forEach((doc) => {
            const data = doc.data();

            if (data.tokenUsage) {
                totalTokens.prompt += data.tokenUsage.prompt || 0;
                totalTokens.completion += data.tokenUsage.completion || 0;
                totalTokens.total += data.tokenUsage.total || 0;
            }

            if (data.savedTokenUsage) {
                savedTokens.prompt += data.savedTokenUsage.prompt || 0;
                savedTokens.completion += data.savedTokenUsage.completion || 0;
                savedTokens.total += data.savedTokenUsage.total || 0;
            }
        });

        totalCost = this.calculateCost(totalTokens).total;
        totalSavings = this.calculateCost(savedTokens).total;

        return {
            totalCost,
            totalSavings,
            netCost: totalCost - totalSavings,
            totalTokens,
            savedTokens,
        };
    }
}