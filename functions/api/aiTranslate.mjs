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

// --- Levenshtein and Similarity Calculation (for accuracy) ---
function levenshteinDistance(a, b) {
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
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[blen][alen];
}

function calculateSimilarity(str1, str2) {
  const s1 = (str1 || "").toLowerCase().trim();
  const s2 = (str2 || "").toLowerCase().trim();
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1.0;
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
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

    const cachedDoc = await docRef.get();
    const wordCount = content.trim().split(/\s+/).length;
    const charCount = content.length;
    const now = admin.firestore.FieldValue.serverTimestamp();

    // ----- CACHE HIT -----
    if (cachedDoc.exists) {
      const cachedData = cachedDoc.data();
      let docUpdatePayload = {};
      let backfilledAccuracy = null;

      // REQUIREMENT 1: Check if cached doc needs accuracy fields and backfill them
      if (cachedData.accuracy === undefined || cachedData.accuracyRating === undefined) {
        console.log(`Backfilling accuracy for cached docId: ${docId}`);
        const similarity = calculateSimilarity(content, cachedData.retranslated);
        const accuracyRating =
          similarity > 0.95 ? 'Excellent'
            : similarity > 0.8 ? 'Good'
              : similarity > 0.6 ? 'Fair'
                : 'Poor';

        docUpdatePayload = { accuracy: similarity, accuracyRating };
        backfilledAccuracy = similarity;
        Object.assign(cachedData, docUpdatePayload); // Update data for the immediate response
      }

      try {
        // Use a transaction to safely update statistics
        await db.runTransaction(async (transaction) => {
          const metaDoc = await transaction.get(metaRef);
          // Initialize metaData with all fields if it doesn't exist
          const metaData = metaDoc.exists ? metaDoc.data() : {
            totalTranslations: 0, totalWords: 0, totalChars: 0,
            savedPromptTokens: 0, savedCompletionTokens: 0, savedApiTokens: 0,
            totalUniqueTranslations: 0, totalPromptTokens: 0, totalCompletionTokens: 0, totalApiTokens: 0,
            languages: {}
          };

          // FIXED: Ensure languages object exists
          if (!metaData.languages) {
            metaData.languages = {};
          }

          // Update the individual translation document
          const docUpdates = {
            timesTranslated: admin.firestore.FieldValue.increment(1),
            lastTranslated: now,
            ...docUpdatePayload,
          };
          transaction.update(docRef, docUpdates);

          // REQUIREMENT 2: Update per-language and global stats
          // Prepare per-language stats
          const langStats = metaData.languages[targetLang] || {
            translations: 0, words: 0, accuracySum: 0,
            promptTokens: 0, completionTokens: 0, accuracy: 0,
          };

          // Update language stats
          langStats.translations += 1;
          langStats.words += wordCount;
          langStats.lastUsed = now;
          langStats.promptTokens += (cachedData.promptTokens || 0);
          langStats.completionTokens += (cachedData.completionTokens || 0);

          // If we just backfilled accuracy, add it to the sum
          if (backfilledAccuracy !== null) {
            langStats.accuracySum += backfilledAccuracy;
          }

          // Recalculate average accuracy
          if (langStats.translations > 0 && langStats.accuracySum > 0) {
            const newAccuracy = (langStats.accuracySum / langStats.translations) * 100;
            langStats.accuracy = parseFloat(newAccuracy.toFixed(2));
          }
          metaData.languages[targetLang] = langStats;

          // Update global stats
          metaData.totalTranslations += 1;
          metaData.totalWords += wordCount;
          metaData.totalChars += charCount;
          const savedPromptTokens = cachedData.promptTokens || 0;
          const savedCompletionTokens = cachedData.completionTokens || 0;
          metaData.savedPromptTokens += savedPromptTokens;
          metaData.savedCompletionTokens += savedCompletionTokens;
          metaData.savedApiTokens += savedPromptTokens + savedCompletionTokens;
          metaData.updatedAt = now;

          transaction.set(metaRef, metaData); // Set the entire updated object
        });

        const savedTotalTokens = (cachedData.promptTokens || 0) + (cachedData.completionTokens || 0);
        console.log(`Cache HIT for docId: ${docId}. Saved ${savedTotalTokens} tokens.`);
        return res.status(200).json(cachedData);

      } catch (e) {
        console.error("Cache Hit Transaction failed: ", e);
        return res.status(500).json({ error: "Failed to update statistics.", details: e.message });
      }
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
    const similarity = calculateSimilarity(content, parsed.retranslated);
    const accuracyRating =
      similarity > 0.95 ? 'Excellent'
        : similarity > 0.8 ? 'Good'
          : similarity > 0.6 ? 'Fair'
            : 'Poor';

    // ----- SAVE TO CACHE AND UPDATE STATS -----
    const docData = {
      inputText: content, inputHash, sourceLang: fromLang, targetLang,
      outputText: parsed.translated, retranslated: parsed.retranslated,
      timesTranslated: 1, wordCount, charCount,
      firstTranslated: now, lastTranslated: now,
      modelUsed: OPENAI_MODEL, apiLatencyMs,
      promptTokens: usage.prompt_tokens, completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens, accuracy: similarity, accuracyRating,
    };

    try {
      // Use a transaction to safely create the new doc and update stats
      await db.runTransaction(async (transaction) => {
        const metaDoc = await transaction.get(metaRef);
        const metaData = metaDoc.exists ? metaDoc.data() : {
          totalTranslations: 0, totalWords: 0, totalChars: 0,
          savedPromptTokens: 0, savedCompletionTokens: 0, savedApiTokens: 0,
          totalUniqueTranslations: 0, totalPromptTokens: 0, totalCompletionTokens: 0, totalApiTokens: 0,
          languages: {}
        };

        // FIXED: Ensure languages object exists
        if (!metaData.languages) {
          metaData.languages = {};
        }

        // Update global stats
        metaData.totalTranslations += 1;
        metaData.totalUniqueTranslations += 1;
        metaData.totalWords += wordCount;
        metaData.totalChars += charCount;
        metaData.totalPromptTokens += usage.prompt_tokens;
        metaData.totalCompletionTokens += usage.completion_tokens;
        metaData.totalApiTokens += usage.total_tokens;
        metaData.updatedAt = now;

        // Update per-language stats
        const langStats = metaData.languages[targetLang] || {
          translations: 0, words: 0, accuracySum: 0,
          promptTokens: 0, completionTokens: 0, accuracy: 0,
        };
        langStats.translations += 1;
        langStats.words += wordCount;
        langStats.accuracySum += similarity;
        langStats.promptTokens += usage.prompt_tokens;
        langStats.completionTokens += usage.completion_tokens;
        langStats.lastUsed = now;

        // Calculate average accuracy
        const newAccuracy = (langStats.accuracySum / langStats.translations) * 100;
        langStats.accuracy = parseFloat(newAccuracy.toFixed(2));
        metaData.languages[targetLang] = langStats;

        // Commit changes
        transaction.set(docRef, docData);
        transaction.set(metaRef, metaData);
      });
      return res.status(201).json(docData);
    } catch (e) {
      console.error("Cache Miss Transaction failed: ", e);
      return res.status(500).json({ error: 'Failed to save translation and statistics.', details: e.message });
    }

  } catch (error) {
    console.error('aiTranslate function error:', error);
    return res.status(500).json({ error: 'An internal server error occurred.', details: error.message });
  }
});