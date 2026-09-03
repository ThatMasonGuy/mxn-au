// functions/src/daily/connections.mjs - Simplified to 2 functions only
import { onCall } from 'firebase-functions/v2/https';
import { db } from '../config/firebase.mjs';
import { calculateDailyStreak, hasRecordedDailyResult } from './dailyGameStats.mjs';
import { readOrSeedConnectionsSolution } from './connectionsSolution.mjs';
import {
    validateConnectionsCompletion,
    validateCurrentPuzzleId,
} from './dailyGameValidation.mjs';
import { nextMidnightUTCISO } from './dailyGameClock.mjs';

const REGION = 'australia-southeast2';

function dateStrUTC(d = new Date()) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

const solDoc = (date) => `dailyChallenges/connections/solutions/${date}`;

async function ensureSolutionFor(date) {
    return readOrSeedConnectionsSolution({ db, ref: db.doc(solDoc(date)) });
}

// ---------- 1) GET PUZZLE DATA ONLY ----------
export const getDailyConnections = onCall(
    { region: REGION },
    async (req) => {
        const date = dateStrUTC();
        const { answer, categories } = await ensureSolutionFor(date);

        return {
            puzzleId: `connections-${date}`,
            answer,
            categories,
            rolloverAt: nextMidnightUTCISO(),
        };
    }
);

// ---------- 2) SUBMIT COMPLETION (STATS ONLY) ----------
export const submitConnectionsCompletion = onCall(
    {
        region: REGION,
        maxInstances: 1
    },
    async (req) => {
        const uid = req.auth?.uid;
        const { puzzleId, foundGroups, mistakes, attempts, outcome } = req.data || {};

        const puzzle = validateCurrentPuzzleId(puzzleId, 'connections');
        if (!puzzle.valid) throw new Error(puzzle.reason);
        const date = puzzle.date;
        const solution = await ensureSolutionFor(date);
        const validation = validateConnectionsCompletion({
            puzzleId,
            foundGroups,
            mistakes,
            attempts,
            outcome,
            answer: solution.answer,
        });
        if (!validation.valid) throw new Error(validation.reason);
        const isPerfect = outcome === 'win' && mistakes === 0;

        if (!uid) {
            return { success: true, outcome, mistakes, isPerfect, profile: null };
        }

        // Update global stats only
        const dailyStatsRef = db.doc(`dailyChallenges/connections/stats/${date}`);
        const allTimeRef = db.doc(`dailyChallenges/connections`);
        const profRef = db.doc(`users/${uid}/dailyChallenges/connections`);
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
                totalPlays: 0, wins: 0, losses: 0, perfectGames: 0
            };
            const a = aSnap.exists ? aSnap.data() : {
                totalPlays: 0, wins: 0, losses: 0, perfectGames: 0, averageMistakes: 0
            };

            d.totalPlays++;
            a.totalPlays++;

            if (outcome === 'win') {
                d.wins++;
                a.wins++;
                if (isPerfect) {
                    d.perfectGames++;
                    a.perfectGames++;
                }
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
                    totalPlays: 0, wins: 0, losses: 0, perfectGames: 0, averageMistakes: 0
                };

                const currentStreak = calculateDailyStreak(baseProf, outcome, date);
                const maxStreak = Math.max(baseProf.maxStreak || 0, currentStreak);
                const wins = (baseProf.wins || 0) + (outcome === 'win' ? 1 : 0);
                const losses = (baseProf.losses || 0) + (outcome === 'loss' ? 1 : 0);
                const totalPlays = (baseProf.totalPlays || 0) + 1;
                const perfectGames = (baseProf.perfectGames || 0) + (isPerfect ? 1 : 0);

                const prevTotal = (baseProf.averageMistakes || 0) * (baseProf.totalPlays || 0);
                const averageMistakes = (prevTotal + mistakes) / totalPlays;

                updatedProfile = {
                    currentStreak,
                    maxStreak,
                    wins,
                    losses,
                    totalPlays,
                    lastPlayedUTC: date,
                    perfectGames,
                    averageMistakes
                };

                tx.set(profRef, updatedProfile, { merge: true });
            }
        });

        return {
            success: true,
            outcome,
            mistakes,
            isPerfect,
            profile: updatedProfile,
        };
    }
);
