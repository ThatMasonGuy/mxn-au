// functions/src/daily/connections.mjs - Simplified to 2 functions only
import { onCall } from 'firebase-functions/v2/https';
import { db } from '../config/firebase.mjs';

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

const solDoc = (date) => `dailyChallenges/connections/solutions/${date}`;

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
    const FALLBACK = {
        easy: ['APPLE', 'BANANA', 'ORANGE', 'GRAPE'],
        medium: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
        hard: ['NORTH', 'SOUTH', 'EAST', 'WEST'],
        expert: ['ALPHA', 'BETA', 'GAMMA', 'DELTA']
    };
    const FALLBACK_CATEGORIES = {
        easy: 'STRAIGHTFORWARD',
        medium: 'CATEGORIES',
        hard: 'WORDPLAY',
        expert: 'TRICKY'
    };
    const nowISO = new Date().toISOString();

    const snap = await ref.get();
    if (!snap.exists) {
        await createIfMissing(ref.path, {
            answer: FALLBACK,
            categories: FALLBACK_CATEGORIES,
            wasFallbackSeed: true,
            seededAt: nowISO
        });
        return { answer: FALLBACK, categories: FALLBACK_CATEGORIES };
    }

    const raw = snap.data();
    const answer = raw?.answer;
    const categories = raw?.categories;

    if (!answer || !answer.easy || !answer.medium || !answer.hard || !answer.expert) {
        await ref.set({
            answer: FALLBACK,
            categories: categories || FALLBACK_CATEGORIES,
            wasFallbackSeed: true,
            seedReason: 'invalid_structure',
            seededAt: nowISO
        }, { merge: true });
        return { answer: FALLBACK, categories: categories || FALLBACK_CATEGORIES };
    }

    return {
        answer,
        categories: categories || FALLBACK_CATEGORIES
    };
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

        if (!puzzleId || !Array.isArray(foundGroups) || typeof mistakes !== 'number' || !['win', 'loss'].includes(outcome)) {
            throw new Error('Invalid parameters');
        }

        const date = puzzleId.replace('connections-', '');
        const validOutcome = foundGroups?.length === 4 ? 'win' : 'loss';
        const isPerfect = validOutcome === 'win' && mistakes === 0;

        if (outcome !== validOutcome) {
            throw new Error('Outcome does not match found groups');
        }

        // Update global stats only
        const dailyStatsRef = db.doc(`dailyChallenges/connections/stats/${date}`);
        const allTimeRef = db.doc(`dailyChallenges/connections`);

        await db.runTransaction(async (tx) => {
            const [dSnap, aSnap] = await Promise.all([
                tx.get(dailyStatsRef),
                tx.get(allTimeRef),
            ]);

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
            if (uid) {
                const profRef = db.doc(`users/${uid}/dailyChallenges/connections`);
                const profSnap = await tx.get(profRef);

                const baseProf = profSnap.exists ? profSnap.data() : {
                    currentStreak: 0, maxStreak: 0, lastPlayedUTC: null,
                    totalPlays: 0, wins: 0, losses: 0, perfectGames: 0, averageMistakes: 0
                };

                const continued = baseProf.lastPlayedUTC === yesterdayUTCStr(date);
                const currentStreak = (outcome === 'win')
                    ? (continued ? (baseProf.currentStreak || 0) + 1 : 1)
                    : 0;
                const maxStreak = Math.max(baseProf.maxStreak || 0, currentStreak);
                const wins = (baseProf.wins || 0) + (outcome === 'win' ? 1 : 0);
                const losses = (baseProf.losses || 0) + (outcome === 'loss' ? 1 : 0);
                const totalPlays = (baseProf.totalPlays || 0) + 1;
                const perfectGames = (baseProf.perfectGames || 0) + (isPerfect ? 1 : 0);

                const prevTotal = (baseProf.averageMistakes || 0) * (baseProf.totalPlays || 0);
                const averageMistakes = (prevTotal + mistakes) / totalPlays;

                const updatedProfile = {
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
            isPerfect
        };
    }
);