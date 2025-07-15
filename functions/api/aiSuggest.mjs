// /functions/api/aiSuggest.mjs
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import OpenAI from "openai";

const openaiKey = defineSecret("OPENAI_API_KEY");

export const aiSuggest = onRequest({ region: "australia-southeast1", secrets: [openaiKey] }, async (req, res) => {
    const { challenges } = req.body || {};
    if (!Array.isArray(challenges) || challenges.length === 0) {
        return res.status(400).json({ plan: "No challenge data found." });
    }

    // Only use first objective for progress/goal (expand if needed)
    const pending = challenges.filter(chal => {
        const obj = Array.isArray(chal.objectives) && chal.objectives.length > 0 ? chal.objectives[0] : null;
        return obj && Number(obj.progress) < Number(obj.completionValue);
    });

    if (!pending.length) {
        return res.json({ plan: "You've completed all seasonal challenges. Go touch grass." });
    }

    // Data sent to GPT: name, description, progress/goal (first objective)
    const trimmed = pending.map(chal => {
        const obj = Array.isArray(chal.objectives) && chal.objectives.length > 0 ? chal.objectives[0] : {};
        return {
            name: chal.name,
            description: chal.description,
            progress: obj.progress ?? 0,
            goal: obj.completionValue ?? 1,
            progressLabel: `${obj.progress ?? 0}/${obj.completionValue ?? 1}`,
        };
    });

    // Sexy, punchy prompt
    const prompt = [
        {
            role: "system",
            content: `
You are a Destiny 2 challenge optimizer.
Your job is to maximize XP gains and minimize wasted effort.

Given a list of incomplete seasonal challenges (with names, descriptions, and progress), recommend the **single best next activity** to run, stacking as many objectives as possible at once.

Format your answer exactly like this (fill in with real data):

Next you should run:
[Activity] focusing on [weapon/subclass/other details]

Recommended loadout:
- Subclass: [suggested subclass]
- Kinetic: [weapon type(s)]
- Energy: [weapon type(s)]
- Heavy: [weapon type(s)]
- Other: [mods, gear, perks if relevant]

This will help complete [X] challenges at once:
- Challenge Name: [short description] (**[progress X/Y]**)
- Challenge Name: [short description] (**[progress X/Y]**)
...

Only suggest one “next step” per response, always maximizing challenge overlap. Be concise, formatted, and actionable. If there are no incomplete challenges, congratulate the user and make a funny or motivational remark.
`.trim()
        },
        {
            role: "user",
            content: `Here are my current Destiny 2 seasonal challenges:\n${JSON.stringify(trimmed, null, 2)}`
        }
    ];

    const openai = new OpenAI({ apiKey: openaiKey.value() });

    try {
        const gptRes = await openai.chat.completions.create({
            model: "gpt-4o", // or "gpt-4.1"
            messages: prompt,
            max_tokens: 420,
            temperature: 0.3
        });
        const aiPlan = gptRes.choices[0]?.message?.content?.trim() || "No suggestion generated.";
        res.json({ plan: aiPlan });
    } catch (e) {
        res.status(500).json({ plan: "Failed to generate suggestion.", error: e.message });
    }
});
