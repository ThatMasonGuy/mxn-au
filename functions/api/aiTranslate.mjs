// aiTranslate.mjs
// Firebase Cloud Function for translation with Firestore cache and global stats

import fetch from 'node-fetch';
import functions from 'firebase-functions';
import admin from 'firebase-admin';
import crypto from 'crypto';

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

// --- CONFIGURATION ---
const OPENAI_MODEL = 'gpt-4o';
const languageNames = {
  'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian', 'pt': 'Portuguese',
  'ja': 'Japanese', 'ko': 'Korean', 'zh': 'Chinese (Simplified)', 'ru': 'Russian',
  'ar': 'Arabic', 'hi': 'Hindi', 'tr': 'Turkish', 'nl': 'Dutch', 'sv': 'Swedish',
  'no': 'Norwegian', 'da': 'Danish', 'fi': 'Finnish', 'pl': 'Polish', 'cs': 'Czech',
  'hu': 'Hungarian', 'th': 'Thai', 'vi': 'Vietnamese', 'en': 'English',
};

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function getApiKey(req) {
  return req.headers['x-openai-key'] || req.headers['authorization']?.replace('Bearer ', '') || null;
}

// --- MAIN CLOUD FUNCTION ---
export const aiTranslate = functions.https.onRequest({ region: "australia-southeast1" }, async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-openai-key');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Please use POST.' });
  }

  try {
    const { content, fromLang, targetLang } = req.body;
    const apiKey = getApiKey(req);

    if (!apiKey) {
      return res.status(401).json({ error: 'Unauthorized. OpenAI API key is required in the "Authorization" or "x-openai-key" header.' });
    }
    if (!content || !fromLang || !targetLang) {
      return res.status(400).json({ error: 'Bad Request. The "content", "fromLang", and "targetLang" fields are required.' });
    }

    const inputHash = sha256(content);
    const docId = `${fromLang}-${targetLang}-${inputHash}`;
    const docRef = db.collection('translations').doc(docId);
    const metaRef = db.collection('translations').doc('meta');

    // ----- CACHE LOOKUP -----
    const cachedDoc = await docRef.get();
    const wordCount = content.trim().split(/\s+/).length;
    const charCount = content.length;
    const batch = db.batch();

    if (cachedDoc.exists) {
      // ----- CACHE HIT -----
      const cachedData = cachedDoc.data();
      const savedPromptTokens = cachedData.promptTokens || 0;
      const savedCompletionTokens = cachedData.completionTokens || 0;
      const savedTotalTokens = cachedData.totalTokens || 0;

      batch.update(docRef, {
        timesTranslated: admin.firestore.FieldValue.increment(1),
        lastTranslated: admin.firestore.FieldValue.serverTimestamp(),
      });

      const metaUpdateData = {
        totalTranslations: admin.firestore.FieldValue.increment(1),
        totalWords: admin.firestore.FieldValue.increment(wordCount),
        totalChars: admin.firestore.FieldValue.increment(charCount),
        [`translationsByLang.${targetLang}`]: admin.firestore.FieldValue.increment(1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        savedPromptTokens: admin.firestore.FieldValue.increment(savedPromptTokens),
        savedCompletionTokens: admin.firestore.FieldValue.increment(savedCompletionTokens),
        savedApiTokens: admin.firestore.FieldValue.increment(savedTotalTokens),
      };

      batch.set(metaRef, metaUpdateData, { merge: true });

      await batch.commit();
      console.log(`Cache HIT for docId: ${docId}. Saved ${savedTotalTokens} tokens.`);
      return res.status(200).json(cachedData);
    }

    // ----- CACHE MISS: Translate with OpenAI -----
    console.log(`Cache MISS for docId: ${docId}. Calling OpenAI API.`);
    const fromLanguageName = languageNames[fromLang] || fromLang;
    const targetLanguageName = languageNames[targetLang] || targetLang;

    const systemPrompt = `You are a strict API JSON responder and translator. Translate the given text from ${fromLanguageName} (${fromLang}) to ${targetLanguageName} (${targetLang}) and save it as "translated". Then, translate the result back to ${fromLanguageName} (${fromLang}) and save it as "retranslated". You must return a single, minified JSON object with the keys "translated" and "retranslated". Never editorialize, change the context, or respond with anything other than the required JSON. Do not remove swearing or slang.`;

    const startTime = Date.now();
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
          { role: 'user', content: content }
        ],
        response_format: { "type": "json_object" },
        max_tokens: 4000,
        temperature: 0.1,
      })
    });
    const apiLatencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Translation API error:', response.status, errorBody);
      return res.status(response.status).json({ error: 'Translation API request failed.', details: errorBody });
    }

    const data = await response.json();
    let parsed;
    try {
      parsed = JSON.parse(data?.choices?.[0]?.message?.content);
      if (!parsed.translated || !parsed.retranslated) {
        throw new Error("Model returned JSON but is missing 'translated' or 'retranslated' keys.");
      }
    } catch (e) {
      console.error('Failed to parse JSON from model:', e.message);
      const rawContent = data?.choices?.[0]?.message?.content || '';
      return res.status(502).json({ error: 'Bad Gateway. The translation model returned an invalid format.', details: e.message, raw: rawContent });
    }

    const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

    // ----- SAVE TO CACHE AND UPDATE STATS -----
    const now = admin.firestore.FieldValue.serverTimestamp();
    const docData = {
      inputText: content,
      inputHash,
      sourceLang: fromLang,
      targetLang,
      outputText: parsed.translated,
      retranslated: parsed.retranslated,
      timesTranslated: 1,
      wordCount,
      charCount,
      firstTranslated: now,
      lastTranslated: now,
      modelUsed: OPENAI_MODEL,
      apiLatencyMs,
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens,
    };

    batch.set(docRef, docData);

    const metaUpdateData = {
        totalTranslations: admin.firestore.FieldValue.increment(1),
        totalUniqueTranslations: admin.firestore.FieldValue.increment(1),
        totalWords: admin.firestore.FieldValue.increment(wordCount),
        totalChars: admin.firestore.FieldValue.increment(charCount),
        totalPromptTokens: admin.firestore.FieldValue.increment(usage.prompt_tokens),
        totalCompletionTokens: admin.firestore.FieldValue.increment(usage.completion_tokens),
        totalApiTokens: admin.firestore.FieldValue.increment(usage.total_tokens),
        [`translationsByLang.${targetLang}`]: admin.firestore.FieldValue.increment(1),
        updatedAt: now,
    };

    batch.set(metaRef, metaUpdateData, { merge: true });

    await batch.commit();

    return res.status(201).json(docData);

  } catch (error) {
    console.error('aiTranslate function error:', error);
    return res.status(500).json({ error: 'An internal server error occurred.', details: error.message });
  }
});