import fetch from "node-fetch";

const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
// Use https://api.deepl.com/v2/translate for paid plans

// DeepL supported languages
// Source languages use simple codes (EN, PT, ZH)
// Target languages can have variants (EN-US, PT-PT, PT-BR)
const sourceLanguageMap = {
    en: "EN",
    es: "ES",
    fr: "FR",
    de: "DE",
    it: "IT",
    pt: "PT",
    ja: "JA",
    ko: "KO",
    zh: "ZH",
    ru: "RU",
    tr: "TR",
    nl: "NL",
    sv: "SV",
    no: "NB", // Norwegian Bokmål
    da: "DA",
    fi: "FI",
    pl: "PL",
    cs: "CS",
    hu: "HU",
};

const targetLanguageMap = {
    en: "EN-US",
    es: "ES",
    fr: "FR",
    de: "DE",
    it: "IT",
    pt: "PT-PT",
    ja: "JA",
    ko: "KO",
    zh: "ZH",
    ru: "RU",
    tr: "TR",
    nl: "NL",
    sv: "SV",
    no: "NB",
    da: "DA",
    fi: "FI",
    pl: "PL",
    cs: "CS",
    hu: "HU",
};

export class DeeplService {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async translate(content, fromLang, targetLang) {
        // Check if languages are supported
        if (!sourceLanguageMap[fromLang]) {
            throw new Error(`Source language '${fromLang}' is not supported by DeepL. Supported languages: ${Object.keys(sourceLanguageMap).join(', ')}`);
        }
        if (!targetLanguageMap[targetLang]) {
            throw new Error(`Target language '${targetLang}' is not supported by DeepL. Supported languages: ${Object.keys(targetLanguageMap).join(', ')}`);
        }

        const fromLanguageCode = sourceLanguageMap[fromLang];
        const targetLanguageCode = targetLanguageMap[targetLang];

        const startTime = Date.now();

        // Step 1: Translate from source to target
        const translatedResponse = await fetch(DEEPL_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `DeepL-Auth-Key ${this.apiKey}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                text: content,
                source_lang: fromLanguageCode,
                target_lang: targetLanguageCode,
                preserve_formatting: "1",
            }),
        });

        if (!translatedResponse.ok) {
            const errorBody = await translatedResponse.text();
            throw new Error(`DeepL API error ${translatedResponse.status}: ${errorBody}`);
        }

        const translatedData = await translatedResponse.json();
        const translated = translatedData.translations[0].text;

        const apiLatencyMs = Date.now() - startTime;

        // DeepL doesn't provide token usage, so we estimate based on character count
        const estimatedTokens = Math.ceil(content.length / 4); // Rough estimation

        return {
            inputText: content,
            sourceLang: fromLang,
            targetLang: targetLang,
            translated: translated,
            retranslated: "", // Will be filled by separate retranslate call
            modelUsed: "deepl",
            apiLatencyMs,
            tokenUsage: {
                prompt: estimatedTokens,
                completion: estimatedTokens,
                total: estimatedTokens * 2,
            },
            accuracy: null, // Will be filled by separate retranslate call
            accuracyRating: null, // Will be filled by separate retranslate call
            wordCount: content.trim().split(/\s+/).length,
            charCount: content.length,
            needsRetranslation: true, // Flag for frontend to request retranslation
        };
    }

    /**
     * Perform retranslation for accuracy check (separate call)
     * Called async after initial translation is returned
     */
    async retranslate(translatedText, fromLang, targetLang, originalText) {
        const startTime = Date.now();

        const retranslatedResponse = await fetch(DEEPL_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `DeepL-Auth-Key ${this.apiKey}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                text: translatedText,
                source_lang: sourceLanguageMap[targetLang], // Target becomes source
                target_lang: targetLanguageMap[fromLang], // Source becomes target
                preserve_formatting: "1",
            }),
        });

        if (!retranslatedResponse.ok) {
            const errorBody = await retranslatedResponse.text();
            throw new Error(`DeepL API error ${retranslatedResponse.status}: ${errorBody}`);
        }

        const retranslatedData = await retranslatedResponse.json();
        const retranslated = retranslatedData.translations[0].text;

        const apiLatencyMs = Date.now() - startTime;

        // Calculate accuracy
        const accuracy = this.calculateSimilarity(originalText, retranslated);
        const accuracyRating = this.getAccuracyRating(accuracy);

        return {
            retranslated,
            accuracy,
            accuracyRating,
            retranslationTimeMs: apiLatencyMs,
        };
    }

    calculateSimilarity(str1, str2) {
        const s1 = (str1 || "").toLowerCase().trim();
        const s2 = (str2 || "").toLowerCase().trim();

        if (s1 === s2) return 1.0;
        if (s1.length === 0 || s2.length === 0) return 0.0;

        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;
        const distance = this.levenshteinDistance(longer, shorter);

        return (longer.length - distance) / longer.length;
    }

    levenshteinDistance(a, b) {
        const matrix = [];
        const alen = a.length;
        const blen = b.length;

        if (alen === 0) return blen;
        if (blen === 0) return alen;

        for (let i = 0; i <= blen; i++) matrix[i] = [i];
        for (let j = 0; j <= alen; j++) matrix[0][j] = j;

        for (let i = 1; i <= blen; i++) {
            for (let j = 1; j <= alen; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[blen][alen];
    }

    getAccuracyRating(similarity) {
        if (similarity > 0.95) return "Excellent";
        if (similarity > 0.8) return "Good";
        if (similarity > 0.6) return "Fair";
        return "Poor";
    }
}
