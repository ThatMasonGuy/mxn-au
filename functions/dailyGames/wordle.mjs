// functions/wordle.mjs - Simplified to 2 functions only
import { onCall } from 'firebase-functions/v2/https';
import { db } from '../config/firebase.mjs'
import { calculateDailyStreak, hasRecordedDailyResult } from './dailyGameStats.mjs'
import { validateCurrentPuzzleId, validateWordleCompletion } from './dailyGameValidation.mjs'
import { nextMidnightUTCISO } from './dailyGameClock.mjs'
import { isAllowedWordleAnswer, normaliseWordleAnswer } from './wordleQuality.mjs'

const REGION = 'australia-southeast2';

function dateStrUTC(d = new Date()) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

const solDoc = (date) => `dailyChallenges/wordle/solutions/${date}`;

async function createIfMissing(refPath, seed) {
    const ref = db.doc(refPath);
    try {
        await ref.create(seed);
    } catch (e) {
        if (!(e && (e.code === 6 || e.message?.includes('ALREADY_EXISTS')))) throw e;
    }
}

async function ensureSolutionFor(date) {
    const ref = db.doc(solDoc(date));
    const FALLBACK = 'CHAOS';
    const nowISO = new Date().toISOString();

    const snap = await ref.get();
    if (!snap.exists) {
        await createIfMissing(ref.path, {
            answer: FALLBACK,
            wasFallbackSeed: true,
            seededAt: nowISO
        });
        return FALLBACK;
    }
    const raw = snap.data();
    const a = normaliseWordleAnswer(raw?.answer);
    if (!a || !isAllowedWordleAnswer(a)) {
        await ref.set({
            answer: FALLBACK,
            wasFallbackSeed: true,
            seedReason: 'invalid_or_unplayable',
            seededAt: nowISO
        }, { merge: true });
        return FALLBACK;
    }
    return a;
}

// ---------- 1) GET PUZZLE DATA ONLY ----------
export const getDailyWordle = onCall(
    {
        region: REGION,
        maxInstances: 1
    },
    async (req) => {
        const date = dateStrUTC();
        const answer = await ensureSolutionFor(date);

        return {
            puzzleId: `wordle-${date}`,
            answer,
            rolloverAt: nextMidnightUTCISO(),
        };
    }
);

// ---------- 2) SUBMIT COMPLETION (STATS ONLY) ----------
export const submitWordleCompletion = onCall(
    {
        region: REGION,
        maxInstances: 1
    },
    async (req) => {
        const uid = req.auth?.uid;
        const { puzzleId, guesses, outcome } = req.data || {};

        const puzzle = validateCurrentPuzzleId(puzzleId, 'wordle');
        if (!puzzle.valid) throw new Error(puzzle.reason);
        const date = puzzle.date;
        const answer = await ensureSolutionFor(date);
        const validation = validateWordleCompletion({ puzzleId, guesses, outcome, answer });
        if (!validation.valid) throw new Error(validation.reason);
        const { solvedAt } = validation;

        if (!uid) {
            return { success: true, outcome, solvedAt, profile: null };
        }

        // Update global stats only
        const dailyStatsRef = db.doc(`dailyChallenges/wordle/stats/${date}`);
        const allTimeRef = db.doc(`dailyChallenges/wordle`);
        const profRef = db.doc(`users/${uid}/dailyChallenges/wordle`);
        let updatedProfile = null;

        await db.runTransaction(async (tx) => {
            const readPromises = [
                tx.get(dailyStatsRef),
                tx.get(allTimeRef),
            ];
            readPromises.push(tx.get(profRef));

            // Firestore transactions require every read to finish before the first write.
            const [dSnap, aSnap, profSnap] = await Promise.all(readPromises);

            if (profSnap?.exists && hasRecordedDailyResult(profSnap.data(), date)) {
                updatedProfile = profSnap.data();
                return;
            }

            const d = dSnap.exists ? dSnap.data() : {
                totalPlays: 0, wins: 0, losses: 0, attemptsHistogram: {}
            };
            const a = aSnap.exists ? aSnap.data() : {
                totalPlays: 0, wins: 0, losses: 0, attemptsHistogram: {}
            };

            d.totalPlays++;
            a.totalPlays++;

            if (outcome === 'win') {
                d.wins++;
                a.wins++;
                d.attemptsHistogram[String(solvedAt)] = (d.attemptsHistogram[String(solvedAt)] || 0) + 1;
                a.attemptsHistogram[String(solvedAt)] = (a.attemptsHistogram[String(solvedAt)] || 0) + 1;
            } else {
                d.losses++;
                a.losses++;
            }

            tx.set(dailyStatsRef, d, { merge: true });
            tx.set(allTimeRef, a, { merge: true });

            // Update user profile only if logged in
            if (profSnap) {
                const baseProf = profSnap.exists ? profSnap.data() : {
                    currentStreak: 0, maxStreak: 0, lastPlayedUTC: null,
                    totalPlays: 0, wins: 0, losses: 0, attemptsHistogram: {}
                };

                const currentStreak = calculateDailyStreak(baseProf, outcome, date);
                const maxStreak = Math.max(baseProf.maxStreak || 0, currentStreak);
                const wins = (baseProf.wins || 0) + (outcome === 'win' ? 1 : 0);
                const losses = (baseProf.losses || 0) + (outcome === 'loss' ? 1 : 0);
                const totalPlays = (baseProf.totalPlays || 0) + 1;

                const attemptsHistogram = { ...(baseProf.attemptsHistogram || {}) };
                if (outcome === 'win') {
                    attemptsHistogram[String(solvedAt)] = (attemptsHistogram[String(solvedAt)] || 0) + 1;
                }

                updatedProfile = {
                    currentStreak,
                    maxStreak,
                    wins,
                    losses,
                    totalPlays,
                    lastPlayedUTC: date,
                    attemptsHistogram
                };

                tx.set(profRef, updatedProfile, { merge: true });
            }
        });

        return {
            success: true,
            outcome,
            solvedAt: solvedAt > 0 ? solvedAt : null,
            profile: updatedProfile,
        };
    }
);
