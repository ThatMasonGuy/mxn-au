// functions/src/wordleUnlimited.mjs
import { onCall } from 'firebase-functions/v2/https';
import { FieldValue } from 'firebase-admin/firestore';
import { defineSecret } from 'firebase-functions/params';
import OpenAI from 'openai';
import { db } from '../config/firebase.mjs';

const REGION = 'australia-southeast2';
const OPENAI_API_KEY = defineSecret('OPENAI_API_KEY');
const ADMIN_API_KEY = defineSecret('ADMIN_API_KEY');

let _openai = null;
function openai() {
    if (!_openai) _openai = new OpenAI({ apiKey: OPENAI_API_KEY.value() });
    return _openai;
}

// ──────────────────────────────────────────────────────────────────────────────
// LLM generation helper
// ──────────────────────────────────────────────────────────────────────────────
async function generateWords(need, existingWords) {
    const target = Math.min(need + 10, 50);
    const client = openai();

    const banSet = new Set(existingWords.map(w => w.toUpperCase()));
    const banSlice = Array.from(banSet).slice(0, 1000).join(', ');

    const comp = await client.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content: 'You are a word curator for Wordle Unlimited. Generate diverse, interesting 5-letter words for players to solve.'
            },
            {
                role: 'user',
                content: `Return JSON: {"words":[...]} with ${target} UNIQUE, HIGH-QUALITY English 5-letter words (UPPERCASE ASCII).

Selection criteria:
- Choose COMMON, recognizable words that most English speakers know
- Include a good mix of word types: nouns, verbs, adjectives
- Prefer words with interesting letter patterns
- NO proper nouns, names, or places
- NO simple plurals ending in S
- Focus on engaging puzzle experiences

EXCLUDE any words in this list:
${banSlice}`
            }
        ],
        temperature: 0.7,
    });

    let parsed = {};
    try {
        parsed = JSON.parse(comp.choices?.[0]?.message?.content || '{}');
    } catch (e) {
        console.error('Failed to parse OpenAI response:', e);
        return [];
    }

    const candidates = Array.from(new Set((parsed.words || []).map(w => String(w).toUpperCase().trim())));

    const approved = [];
    for (const w of candidates) {
        if (!/^[A-Z]{5}$/.test(w)) continue;
        if (banSet.has(w)) continue;
        approved.push(w);
        if (approved.length >= need) break;
    }

    return approved;
}

// ──────────────────────────────────────────────────────────────────────────────
// 1) Get available words (generates more if needed)
// ──────────────────────────────────────────────────────────────────────────────
export const getWordleUnlimitedWords = onCall(
    {
        region: REGION,
        secrets: [OPENAI_API_KEY],
        maxInstances: 1
    },
    async (req) => {
        const uid = req.auth?.uid;
        if (!uid) throw new Error('Authentication required');

        const { requestCount = 50, excludeWords = [] } = req.data || {};

        // Get user's played words
        const userPlaysSnap = await db.collection(`users/${uid}/dailyChallenges/wordle-unlimited/games`).get();
        const playedWords = new Set();
        userPlaysSnap.forEach(doc => playedWords.add(doc.id));

        // Add excluded words
        excludeWords.forEach(word => playedWords.add(word.toUpperCase()));

        // Get available solutions from pool
        const solutionsSnap = await db.collection('dailyChallenges/wordle-unlimited/solutions')
            .limit(requestCount * 2) // Get extra to account for played words
            .get();

        const availableWords = [];
        solutionsSnap.forEach(doc => {
            if (!playedWords.has(doc.id) && availableWords.length < requestCount) {
                availableWords.push(doc.id);
            }
        });

        // If we don't have enough words, generate more
        if (availableWords.length < requestCount / 2) {
            console.log(`Low on words (${availableWords.length}/${requestCount}), generating more...`);

            // Get all existing words to avoid duplicates
            const allSolutionsSnap = await db.collection('dailyChallenges/wordle-unlimited/solutions').get();
            const existingWords = [];
            allSolutionsSnap.forEach(doc => existingWords.push(doc.id));

            // Generate new words
            const needed = Math.max(50, requestCount - availableWords.length);
            const newWords = await generateWords(needed, [...existingWords, ...Array.from(playedWords)]);

            // Store new words
            const batch = db.batch();
            const timestamp = FieldValue.serverTimestamp();

            for (const word of newWords) {
                const docRef = db.doc(`dailyChallenges/wordle-unlimited/solutions/${word}`);
                batch.set(docRef, {
                    word: word,
                    source: 'ai',
                    model: 'gpt-4o',
                    difficulty: 'medium',
                    createdAt: timestamp
                });

                // Add to available list
                if (!playedWords.has(word) && availableWords.length < requestCount) {
                    availableWords.push(word);
                }
            }

            await batch.commit();
            console.log(`Generated and stored ${newWords.length} new words`);
        }

        return {
            words: availableWords.slice(0, requestCount),
            totalAvailable: availableWords.length,
            playedCount: playedWords.size
        };
    }
);

// ──────────────────────────────────────────────────────────────────────────────
// 2) Submit completed game and update all stats
// ──────────────────────────────────────────────────────────────────────────────
export const submitWordleUnlimitedGame = onCall(
    {
        region: REGION,
        maxInstances: 1,
    },
    async (req) => {
        const uid = req.auth?.uid;
        if (!uid) throw new Error('Authentication required');

        const { word, outcome, attempts, guesses, masks } = req.data || {};

        // Validate input
        if (!word || typeof word !== 'string' || !/^[A-Z]{5}$/.test(word.toUpperCase())) {
            throw new Error('Invalid word');
        }
        if (!['win', 'loss'].includes(outcome)) {
            throw new Error('Invalid outcome');
        }
        if (!Array.isArray(guesses) || !Array.isArray(masks)) {
            throw new Error('Invalid game data');
        }
        // attempts must be a sane integer (Wordle rules)
        if (!Number.isInteger(attempts) || attempts < 1 || attempts > 6) {
            throw new Error('Invalid attempts');
        }

        const wordUpper = word.toUpperCase();
        const timestamp = FieldValue.serverTimestamp();

        // helper to coerce maybe-undefined values to finite numbers
        const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

        await db.runTransaction(async (tx) => {
            // ALL READS FIRST (Firestore requirement)
            const profileRef = db.doc(`users/${uid}/dailyChallenges/wordle-unlimited`);
            const profileSnap = await tx.get(profileRef);

            const globalStatsRef = db.doc(`dailyChallenges/wordle-unlimited/stats/${wordUpper}`);
            const globalSnap = await tx.get(globalStatsRef);

            // profile stats (defensive defaults)
            const profileData = profileSnap.exists ? profileSnap.data() : {};
            profileData.totalPlayed = num(profileData.totalPlayed) + 1;

            if (outcome === 'win') {
                profileData.wins = num(profileData.wins) + 1;
                profileData.currentStreak = num(profileData.currentStreak) + 1;
                profileData.maxStreak = Math.max(num(profileData.maxStreak), profileData.currentStreak);

                profileData.attemptsHistogram = profileData.attemptsHistogram || {};
                const attemptsKey = String(attempts);
                profileData.attemptsHistogram[attemptsKey] = num(profileData.attemptsHistogram[attemptsKey]) + 1;
            } else {
                profileData.losses = num(profileData.losses) + 1;
                profileData.currentStreak = 0;
            }

            if (!profileData.createdAt) profileData.createdAt = timestamp;
            profileData.lastPlayedAt = timestamp;
            profileData.updatedAt = timestamp;

            // per-word global stats (defensive defaults)
            const globalData = globalSnap.exists ? globalSnap.data() : { word: wordUpper };
            globalData.totalPlayers = num(globalData.totalPlayers) + 1;

            if (outcome === 'win') {
                globalData.wins = num(globalData.wins) + 1;
                globalData.attemptsHistogram = globalData.attemptsHistogram || {};
                const attemptsKey = String(attempts);
                globalData.attemptsHistogram[attemptsKey] = num(globalData.attemptsHistogram[attemptsKey]) + 1;
            } else {
                globalData.losses = num(globalData.losses) + 1;
            }

            if (!globalData.createdAt) globalData.createdAt = timestamp;
            globalData.updatedAt = timestamp;

            // WRITES
            tx.set(profileRef, profileData, { merge: true });

            const playRef = db.doc(`users/${uid}/dailyChallenges/wordle-unlimited/games/${wordUpper}`);
            tx.set(playRef, {
                word: wordUpper,
                guesses: guesses.map((g) => String(g).toUpperCase()),
                masks,
                outcome,
                attempts,
                completedAt: timestamp,
            });

            tx.set(globalStatsRef, globalData, { merge: true });

            // global aggregate (safe increments only)
            const globalAggRef = db.doc('dailyChallenges/wordle-unlimited');
            tx.set(
                globalAggRef,
                {
                    totalGamesPlayed: FieldValue.increment(1),
                    totalWins: outcome === 'win' ? FieldValue.increment(1) : FieldValue.increment(0),
                    totalLosses: outcome === 'loss' ? FieldValue.increment(1) : FieldValue.increment(0),
                    updatedAt: timestamp,
                },
                { merge: true }
            );
        });

        return { success: true, outcome, attempts };
    }
);

// ──────────────────────────────────────────────────────────────────────────────
// 3) Admin bulk generation
// ──────────────────────────────────────────────────────────────────────────────
export const adminGenerateWordleWords = onCall(
    {
        region: REGION,
        secrets: [OPENAI_API_KEY, ADMIN_API_KEY],
        maxInstances: 1
    },
    async (req) => {
        // Verify admin key
        const key = req.data?.adminKey;
        if (!key || String(key) !== ADMIN_API_KEY.value()) {
            throw new Error('Unauthorized');
        }

        const { count = 100, force = false } = req.data || {};

        // Get existing words count
        const existingSnap = await db.collection('dailyChallenges/wordle-unlimited/solutions').get();
        const existingWords = [];
        existingSnap.forEach(doc => existingWords.push(doc.id));

        if (!force && existingWords.length > 1000) {
            return {
                success: false,
                error: 'Word pool is already large. Use force=true to override.',
                existingCount: existingWords.length
            };
        }

        // Generate in batches
        const batchSize = 25;
        let totalGenerated = 0;
        const timestamp = FieldValue.serverTimestamp();

        for (let i = 0; i < count; i += batchSize) {
            const batchCount = Math.min(batchSize, count - i);
            const words = await generateWords(batchCount, existingWords);

            if (words.length > 0) {
                const batch = db.batch();

                for (const word of words) {
                    const docRef = db.doc(`dailyChallenges/wordle-unlimited/solutions/${word}`);
                    batch.set(docRef, {
                        word: word,
                        source: 'ai',
                        model: 'gpt-4o',
                        difficulty: 'medium',
                        createdAt: timestamp
                    });
                    existingWords.push(word);
                }

                await batch.commit();
                totalGenerated += words.length;
                console.log(`Batch ${Math.floor(i / batchSize) + 1}: Generated ${words.length} words`);
            }
        }

        // Update global stats
        await db.doc('dailyChallenges/wordle-unlimited').set({
            totalWords: FieldValue.increment(totalGenerated),
            lastAdminGeneration: timestamp,
            lastAdminGenerationCount: totalGenerated
        }, { merge: true });

        return {
            success: true,
            generated: totalGenerated,
            requested: count,
            totalWords: existingWords.length
        };
    }
);