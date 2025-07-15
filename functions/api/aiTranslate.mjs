// aiTranslate.mjs
// Single-call translation, user specifies fromLang and targetLang. Returns only forward and round-trip translation.

import fetch from 'node-fetch';
import functions from 'firebase-functions';

const OPENAI_MODEL = 'gpt-4o';
const languageNames = {
  'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian', 'pt': 'Portuguese',
  'ja': 'Japanese', 'ko': 'Korean', 'zh': 'Chinese (Simplified)', 'ru': 'Russian',
  'ar': 'Arabic', 'hi': 'Hindi', 'tr': 'Turkish', 'nl': 'Dutch', 'sv': 'Swedish',
  'no': 'Norwegian', 'da': 'Danish', 'fi': 'Finnish', 'pl': 'Polish', 'cs': 'Czech',
  'hu': 'Hungarian', 'th': 'Thai', 'vi': 'Vietnamese', 'en': 'English',
};

export const aiTranslate = functions.https.onRequest({ region: "australia-southeast1" }, async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { content, fromLang, targetLang } = req.body;
    let apiKey = req.headers['x-openai-key'] || req.headers['authorization']?.replace('Bearer ', '');
    if (!apiKey) return res.status(400).json({ error: 'OpenAI API key required in x-openai-key header' });
    if (!content || !fromLang || !targetLang) return res.status(400).json({ error: 'Missing content, fromLang, or targetLang' });
    const fromLanguageName = languageNames[fromLang] || fromLang;
    const targetLanguageName = languageNames[targetLang] || targetLang;

    // SYSTEM PROMPT for forward + round-trip translation
    const systemPrompt = `You are a strict API JSON responder and professional translator.

Translate the given text from ${fromLanguageName} (${fromLang}) to ${targetLanguageName} (${targetLang}), save this as translated.
Then, translate translated back to ${fromLanguageName} (${fromLang}), save this as retranslated.

Return a single minified JSON: {"translated":"...","retranslated":"..."}.

You must:
- Never editorialise, never change the context or tone, keep all swearing and slang.
- Never respond with anything except the required JSON.
`;

    const userPrompt = `Input text:\n${content}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      let error = 'Translation API error';
      try { error = (await response.json())?.error?.message || error; } catch {}
      return res.status(502).json({ error });
    }
    const data = await response.json();
    let parsed = null;
    try {
      let content = data?.choices?.[0]?.message?.content?.trim();
      if (content.startsWith('```json')) content = content.replace(/```json|```/g, '');
      parsed = JSON.parse(content);
    } catch (e) {
      return res.status(502).json({ error: 'Model did not return JSON. Raw: ' + (data?.choices?.[0]?.message?.content || '') });
    }
    return res.json(parsed);
  } catch (error) {
    console.error('aiTranslate error:', error);
    return res.status(500).json({ error: error.message || 'Internal error' });
  }
});
