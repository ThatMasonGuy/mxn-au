// functions/wordle.mjs - Simplified to 2 functions only
import { onCall } from 'firebase-functions/v2/https';
import { db } from '../config/firebase.mjs'

const REGION = 'australia-southeast2';

function dateStrUTC(d = new Date()) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function nextMidnightUTCISO(d = new Date()) {
    const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 1));
    return next.toISOString();
}

function yesterdayUTCStr(dateYYYYMMDD) {
    const [Y, M, D] = dateYYYYMMDD.split('-').map(Number);
    const yest = new Date(Date.UTC(Y, M - 1, D - 1));
    return dateStrUTC(yest);
}

function gradeGuess(guess, solution) {
    const g = guess.toUpperCase();
    const s = solution.toUpperCase();
    const res = Array(5).fill('B');
    const remain = {};
    for (let i = 0; i < 5; i++) {
        if (g[i] === s[i]) res[i] = 'G';
        else remain[s[i]] = (remain[s[i]] || 0) + 1;
    }
    for (let i = 0; i < 5; i++) {
        if (res[i] !== 'G') {
            const c = g[i];
            if (remain[c] > 0) { res[i] = 'Y'; remain[c]--; }
        }
    }
    return res;
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
    const a = (raw?.answer || '').toUpperCase();
    if (!/^[A-Z]{5}$/.test(a)) {
        await ref.set({
            answer: FALLBACK,
            wasFallbackSeed: true,
            seedReason: 'invalid_or_empty',
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

        if (!puzzleId || !Array.isArray(guesses) || !['win', 'loss'].includes(outcome)) {
            throw new Error('Invalid parameters');
        }

        const date = puzzleId.replace('wordle-', '');
        const answer = await ensureSolutionFor(date);

        // Validate the outcome matches the guesses
        let solvedAt = -1;
        for (let i = 0; i < Math.min(6, guesses.length); i++) {
            const g = (guesses[i] || '').toUpperCase();
            if (!/^[A-Z]{5}$/.test(g)) break;
            if (gradeGuess(g, answer).join('') === 'GGGGG') {
                solvedAt = i + 1;
                break;
            }
        }
        const validOutcome = solvedAt > 0 ? 'win' : 'loss';

        if (outcome !== validOutcome) {
            throw new Error('Outcome does not match guesses');
        }

        // Update global stats only
        const dailyStatsRef = db.doc(`dailyChallenges/wordle/stats/${date}`);
        const allTimeRef = db.doc(`dailyChallenges/wordle`);

        await db.runTransaction(async (tx) => {
            const [dSnap, aSnap] = await Promise.all([
                tx.get(dailyStatsRef),
                tx.get(allTimeRef),
            ]);

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
            if (uid) {
                const profRef = db.doc(`users/${uid}/dailyChallenges/wordle`);
                const profSnap = await tx.get(profRef);

                const baseProf = profSnap.exists ? profSnap.data() : {
                    currentStreak: 0, maxStreak: 0, lastPlayedUTC: null,
                    totalPlays: 0, wins: 0, losses: 0, attemptsHistogram: {}
                };

                const continued = baseProf.lastPlayedUTC === yesterdayUTCStr(date);
                const currentStreak = (outcome === 'win')
                    ? (continued ? (baseProf.currentStreak || 0) + 1 : 1)
                    : 0;
                const maxStreak = Math.max(baseProf.maxStreak || 0, currentStreak);
                const wins = (baseProf.wins || 0) + (outcome === 'win' ? 1 : 0);
                const losses = (baseProf.losses || 0) + (outcome === 'loss' ? 1 : 0);
                const totalPlays = (baseProf.totalPlays || 0) + 1;

                const attemptsHistogram = { ...(baseProf.attemptsHistogram || {}) };
                if (outcome === 'win') {
                    attemptsHistogram[String(solvedAt)] = (attemptsHistogram[String(solvedAt)] || 0) + 1;
                }

                const updatedProfile = {
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
            solvedAt: solvedAt > 0 ? solvedAt : null
        };
    }
);