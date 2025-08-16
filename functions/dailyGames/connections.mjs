// functions/src/daily/connections.mjs
import { onCall } from 'firebase-functions/v2/https';
import { db } from '../config/firebase.mjs';

const REGION = 'australia-southeast1';

// ---------- Time helpers ----------
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

// ---------- Firestore paths ----------
const solDoc = (date) => `dailyChallenges/connections/solutions/${date}`;
const dailyStats = (date) => `dailyChallenges/connections/stats/${date}`;
const allTime = `dailyChallenges/connections`;
const userConnectionsDoc = (uid) => `users/${uid}/dailyChallenges/connections`;
const userConnectionsDay = (uid, date) => `users/${uid}/dailyChallenges/connections/days/${date}`;

// ---------- Safe create helper ----------
async function createIfMissing(refPath, seed) {
    const ref = db.doc(refPath);
    try {
        await ref.create(seed);
    } catch (e) {
        if (!(e && (e.code === 6 || e.message?.includes('ALREADY_EXISTS')))) throw e;
    }
}

// ---------- Ensure solution exists (fallback groups) ----------
async function ensureSolutionFor(date) {
    const ref = db.doc(solDoc(date));
    const FALLBACK = {
        easy: ['APPLE', 'BANANA', 'ORANGE', 'GRAPE'],
        medium: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
        hard: ['NORTH', 'SOUTH', 'EAST', 'WEST'],
        expert: ['ALPHA', 'BETA', 'GAMMA', 'DELTA']
    };
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
    const answer = raw?.answer;

    // Validate structure
    if (!answer || !answer.easy || !answer.medium || !answer.hard || !answer.expert) {
        await ref.set({
            answer: FALLBACK,
            wasFallbackSeed: true,
            seedReason: 'invalid_structure',
            seededAt: nowISO
        }, { merge: true });
        return FALLBACK;
    }

    return answer;
}

// ---------- Bootstrap ----------
async function bootstrapToday(date, uid = null) {
    // Global all-time stats
    await createIfMissing(allTime, {
        totalPlays: 0,
        wins: 0,
        losses: 0,
        perfectGames: 0,
        averageMistakes: 0
    });

    // Today's daily stats
    await createIfMissing(dailyStats(date), {
        totalPlays: 0,
        wins: 0,
        losses: 0,
        perfectGames: 0
    });

    // Ensure solution exists
    await ensureSolutionFor(date);

    // Per-user docs
    if (uid) {
        await createIfMissing(userConnectionsDoc(uid), {
            currentStreak: 0,
            maxStreak: 0,
            lastPlayedUTC: null,
            totalPlays: 0,
            wins: 0,
            losses: 0,
            perfectGames: 0,
            averageMistakes: 0
        });
        await createIfMissing(userConnectionsDay(uid, date), {
            foundGroups: [],
            mistakes: 0,
            attempts: [],
            outcome: 'in_progress'
        });
    }
}

// ---------- 1) Get daily puzzle ----------
export const getDailyConnections = onCall(
    { region: REGION },
    async (req) => {
        const uid = req.auth?.uid || null;
        const date = dateStrUTC();

        await bootstrapToday(date, uid);
        const answer = await ensureSolutionFor(date);

        // Get user state if logged in
        let userState = null;
        if (uid) {
            const daySnap = await db.doc(userConnectionsDay(uid, date)).get();
            if (daySnap.exists) userState = daySnap.data();
        }

        return {
            puzzleId: `connections-${date}`,
            packet: { answer },
            userState,
            rolloverAt: nextMidnightUTCISO(),
        };
    }
);

// ---------- 2) Save progress ----------
export const saveConnectionsProgress = onCall(
    { region: REGION },
    async (req) => {
        const uid = req.auth?.uid || null;
        if (!uid) return { ok: true };

        const { puzzleId, foundGroups, mistakes, attempts } = req.data || {};
        if (!puzzleId) throw new Error('bad args');

        const date = puzzleId.replace('connections-', '');
        await bootstrapToday(date, uid);

        const dayRef = db.doc(userConnectionsDay(uid, date));
        await db.runTransaction(async (tx) => {
            const snap = await tx.get(dayRef);
            const cur = snap.exists ? snap.data() : {
                foundGroups: [],
                mistakes: 0,
                attempts: [],
                outcome: 'in_progress'
            };

            if (cur.outcome && cur.outcome !== 'in_progress') return;

            const update = {
                foundGroups: foundGroups || cur.foundGroups,
                mistakes: typeof mistakes === 'number' ? mistakes : cur.mistakes,
                attempts: attempts || cur.attempts,
                outcome: 'in_progress'
            };

            tx.set(dayRef, update, { merge: true });
        });

        return { ok: true };
    }
);

// ---------- 3) Submit final outcome ----------
export const submitConnectionsOutcome = onCall(
    { region: REGION },
    async (req) => {
        const uid = req.auth?.uid || null;
        const { puzzleId, foundGroups, mistakes, attempts } = req.data || {};
        if (!puzzleId) throw new Error('bad args');

        const date = puzzleId.replace('connections-', '');
        await bootstrapToday(date, uid);

        // Determine outcome
        const serverOutcome = foundGroups?.length === 4 ? 'win' : 'loss';
        const isPerfect = serverOutcome === 'win' && mistakes === 0;

        const dailyStatsRef = db.doc(dailyStats(date));
        const allTimeRef = db.doc(allTime);

        // Guest users - just update global stats
        if (!uid) {
            await db.runTransaction(async (tx) => {
                const dSnap = await tx.get(dailyStatsRef);
                const aSnap = await tx.get(allTimeRef);

                const d = dSnap.exists ? dSnap.data() : {
                    totalPlays: 0, wins: 0, losses: 0, perfectGames: 0
                };
                const a = aSnap.exists ? aSnap.data() : {
                    totalPlays: 0, wins: 0, losses: 0, perfectGames: 0, averageMistakes: 0
                };

                d.totalPlays++;
                a.totalPlays++;

                if (serverOutcome === 'win') {
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
            });

            return { outcome: serverOutcome, mistakes };
        }

        // Logged-in users
        const dayRef = db.doc(userConnectionsDay(uid, date));
        const profRef = db.doc(userConnectionsDoc(uid));
        let streakOut = null;

        await db.runTransaction(async (tx) => {
            // Read all docs first
            const [daySnap, profSnap, dSnap, aSnap] = await Promise.all([
                tx.get(dayRef),
                tx.get(profRef),
                tx.get(dailyStatsRef),
                tx.get(allTimeRef),
            ]);

            const dayCur = daySnap.exists ? daySnap.data() : {
                foundGroups: [], mistakes: 0, attempts: [], outcome: 'in_progress'
            };
            const alreadyDone = dayCur.outcome && dayCur.outcome !== 'in_progress';

            const d = dSnap.exists ? dSnap.data() : {
                totalPlays: 0, wins: 0, losses: 0, perfectGames: 0
            };
            const a = aSnap.exists ? aSnap.data() : {
                totalPlays: 0, wins: 0, losses: 0, perfectGames: 0, averageMistakes: 0
            };

            const baseProf = profSnap.exists ? profSnap.data() : {
                currentStreak: 0, maxStreak: 0, lastPlayedUTC: null,
                totalPlays: 0, wins: 0, losses: 0, perfectGames: 0, averageMistakes: 0
            };

            // Write game state
            tx.set(dayRef, {
                foundGroups: foundGroups || [],
                mistakes: mistakes || 0,
                attempts: attempts || [],
                outcome: serverOutcome,
                completedAt: new Date()
            }, { merge: true });

            if (!alreadyDone) {
                // Update global stats
                d.totalPlays++;
                a.totalPlays++;

                if (serverOutcome === 'win') {
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

                // Update user profile
                const continued = baseProf.lastPlayedUTC === yesterdayUTCStr(date);
                const currentStreak = (serverOutcome === 'win')
                    ? (continued ? (baseProf.currentStreak || 0) + 1 : 1)
                    : 0;
                const maxStreak = Math.max(baseProf.maxStreak || 0, currentStreak);
                const wins = (baseProf.wins || 0) + (serverOutcome === 'win' ? 1 : 0);
                const losses = (baseProf.losses || 0) + (serverOutcome === 'loss' ? 1 : 0);
                const totalPlays = (baseProf.totalPlays || 0) + 1;
                const perfectGames = (baseProf.perfectGames || 0) + (isPerfect ? 1 : 0);

                // Calculate running average of mistakes
                const prevTotal = (baseProf.averageMistakes || 0) * (baseProf.totalPlays || 0);
                const averageMistakes = (prevTotal + mistakes) / totalPlays;

                streakOut = {
                    currentStreak, maxStreak, wins, losses, totalPlays,
                    lastPlayedUTC: date, perfectGames, averageMistakes
                };

                tx.set(profRef, streakOut, { merge: true });
            } else {
                // Already finalized
                streakOut = {
                    currentStreak: baseProf.currentStreak || 0,
                    maxStreak: baseProf.maxStreak || 0,
                    wins: baseProf.wins || 0,
                    losses: baseProf.losses || 0,
                    totalPlays: baseProf.totalPlays || 0,
                    lastPlayedUTC: baseProf.lastPlayedUTC || null,
                    perfectGames: baseProf.perfectGames || 0
                };
            }
        });

        return { outcome: serverOutcome, mistakes, streak: streakOut };
    }
);