import fetch from "node-fetch";

export const OPENAI_MODEL = "gpt-6-luna";

const languageNames = {
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese (Simplified)",
    ru: "Russian",
    ar: "Arabic",
    hi: "Hindi",
    tr: "Turkish",
    nl: "Dutch",
    sv: "Swedish",
    no: "Norwegian",
    da: "Danish",
    fi: "Finnish",
    pl: "Polish",
    cs: "Czech",
    hu: "Hungarian",
    th: "Thai",
    vi: "Vietnamese",
    en: "English",
};

export class OpenAIService {
    constructor(apiKey, { fetchImpl = fetch } = {}) {
        this.apiKey = apiKey;
        this.fetch = fetchImpl;
    }

    async translate(content, fromLang, targetLang) {
        const fromLanguageName = languageNames[fromLang] || fromLang;
        const targetLanguageName = languageNames[targetLang] || targetLang;

        const systemPrompt = `
You are a strict API JSON responder and translator. 

- Translate the given text from ${fromLanguageName} (${fromLang}) to ${targetLanguageName} (${targetLang}) and save it as "translated".  
- Then, translate the result back to ${fromLanguageName} (${fromLang}) and save it as "retranslated".  

Formatting rules:
- You must preserve the original formatting of the input text (e.g., line breaks, bullet points, lists, spacing).  
- Do not reflow, compress, or alter the layout in any way.  

Output rules:
- Return a single, minified JSON object with the keys "translated" and "retranslated".  
- Never editorialize, change the context, or respond with anything other than the required JSON.  
- Do not remove swearing, sexual language, slang or any other offensive language.  
`;

        const startTime = Date.now();

        const response = await this.fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            signal: AbortSignal.timeout(45000),
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: content },
                ],
                response_format: { type: "json_object" },
                max_completion_tokens: 4000,
                reasoning_effort: "none",
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`OpenAI API error ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        if (data.choices?.[0]?.finish_reason !== 'stop') {
            throw new Error('Translation did not complete');
        }
        const parsed = JSON.parse(data.choices[0].message.content);

        if (typeof parsed.translated !== 'string' || !parsed.translated.trim() ||
            typeof parsed.retranslated !== 'string' || !parsed.retranslated.trim()) {
            throw new Error("Invalid response from OpenAI");
        }

        const usage = data.usage || {};
        const apiLatencyMs = Date.now() - startTime;

        // Calculate accuracy
        const accuracy = this.calculateSimilarity(content, parsed.retranslated);
        const accuracyRating = this.getAccuracyRating(accuracy);

        return {
            inputText: content,
            sourceLang: fromLang,
            targetLang: targetLang,
            translated: parsed.translated,
            retranslated: parsed.retranslated,
            modelUsed: OPENAI_MODEL,
            apiLatencyMs,
            tokenUsage: {
                prompt: usage.prompt_tokens || 0,
                completion: usage.completion_tokens || 0,
                total: usage.total_tokens || 0,
            },
            accuracy,
            accuracyRating,
            wordCount: content.trim().split(/\s+/).length,
            charCount: content.length,
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
        const alen = a.length;
        const blen = b.length;

        if (alen === 0) return blen;
        if (blen === 0) return alen;

        let previous = Array.from({ length: alen + 1 }, (_, index) => index);
        let current = new Array(alen + 1);
        for (let i = 1; i <= blen; i++) {
            current[0] = i;
            for (let j = 1; j <= alen; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    current[j] = previous[j - 1];
                } else {
                    current[j] = Math.min(
                        previous[j - 1] + 1,
                        current[j - 1] + 1,
                        previous[j] + 1
                    );
                }
            }
            [previous, current] = [current, previous];
        }

        return previous[alen];
    }

    getAccuracyRating(similarity) {
        if (similarity > 0.95) return "Excellent";
        if (similarity > 0.8) return "Good";
        if (similarity > 0.6) return "Fair";
        return "Poor";
    }
}
