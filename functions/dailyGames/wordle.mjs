// functions/wordle.mjs
import { onCall } from 'firebase-functions/v2/https';
import { db } from '../config/firebase.mjs'

const REGION = 'australia-southeast2';

// ---------- Time (UTC midnight rollover) ----------
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

// ---------- Wordle grading (duplicate-safe) ----------
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

// ---------- Paths ----------
const solDoc = (date) => `dailyChallenges/wordle/solutions/${date}`;
const dailyStats = (date) => `dailyChallenges/wordle/stats/${date}`;
const allTime = `dailyChallenges/wordle`;
const userWordleDoc = (uid) => `users/${uid}/dailyChallenges/wordle`;
const userWordleDay = (uid, date) => `users/${uid}/dailyChallenges/wordle/days/${date}`;

// ---------- Safe create helper (idempotent) ----------
async function createIfMissing(refPath, seed) {
    const ref = db.doc(refPath);
    try {
        await ref.create(seed);
    } catch (e) {
        if (!(e && (e.code === 6 || e.message?.includes('ALREADY_EXISTS')))) throw e;
    }
}

// ---------- Ensure solution for date (fallback = CHAOS) ----------
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

// ---------- Bootstrap on first launch ----------
async function bootstrapToday(date, uid = null) {
    await createIfMissing(allTime, {
        totalPlays: 0,
        wins: 0,
        losses: 0,
        attemptsHistogram: {}
    });

    await createIfMissing(dailyStats(date), {
        totalPlays: 0,
        wins: 0,
        losses: 0,
        attemptsHistogram: {}
    });

    await ensureSolutionFor(date);

    if (uid) {
        await createIfMissing(userWordleDoc(uid), {
            currentStreak: 0,
            maxStreak: 0,
            lastPlayedUTC: null,
            totalPlays: 0,
            wins: 0,
            losses: 0,
            attemptsHistogram: {}
        });
        await createIfMissing(userWordleDay(uid, date), {
            guesses: [],
            outcome: 'in_progress'
        });
    }
}

// ---------- 1) Load today + bootstrap (with fallback) ----------
export const getDailyWordle = onCall(
    { 
        region: REGION,
        maxInstances: 1
    },
    async (req) => {
        const uid = req.auth?.uid || null;
        const date = dateStrUTC();

        await bootstrapToday(date, uid);
        const answer = await ensureSolutionFor(date);

        let userState = null;
        if (uid) {
            const daySnap = await db.doc(userWordleDay(uid, date)).get();
            if (daySnap.exists) userState = daySnap.data();
        }

        return {
            puzzleId: `wordle-${date}`,
            packet: { answer },
            userState,
            rolloverAt: nextMidnightUTCISO(),
        };
    }
);

// ---------- 2) Save progress (idempotent by rowIndex) ----------
export const saveWordleProgress = onCall(
    { 
        region: REGION,
        maxInstances: 1
    },
    async (req) => {
        const uid = req.auth?.uid || null;
        if (!uid) return { ok: true };

        const { puzzleId, guess, rowIndex } = req.data || {};
        if (!puzzleId || !/^[A-Za-z]{5}$/.test(guess || '') || typeof rowIndex !== 'number') {
            throw new Error('bad args');
        }
        const date = puzzleId.replace('wordle-', '');

        await bootstrapToday(date, uid);
        const answer = await ensureSolutionFor(date);

        const serverMask = gradeGuess(guess, answer).join('');

        const dayRef = db.doc(userWordleDay(uid, date));
        await db.runTransaction(async (tx) => {
            const snap = await tx.get(dayRef);
            const cur = snap.exists ? snap.data() : { guesses: [], outcome: 'in_progress' };
            if (cur.outcome && cur.outcome !== 'in_progress') return;
            const next = (cur.guesses || []).slice();
            if (next.length > rowIndex) return;
            next[rowIndex] = guess.toUpperCase();
            tx.set(dayRef, { guesses: next, outcome: 'in_progress' }, { merge: true });
        });

        return { ok: true, mask: serverMask };
    }
);

// ---------- 3) Finalize (validate + idempotent stats/profile) ----------
export const submitWordleOutcome = onCall(
    { 
        region: REGION,
        maxInstances: 1
    },
    async (req) => {
        const uid = req.auth?.uid || null;
        const { puzzleId, guesses } = req.data || {};
        if (!puzzleId || !Array.isArray(guesses)) throw new Error('bad args');

        const date = puzzleId.replace('wordle-', '');

        await bootstrapToday(date, uid);
        const answer = await ensureSolutionFor(date);

        let solvedAt = -1;
        for (let i = 0; i < Math.min(6, guesses.length); i++) {
            const g = (guesses[i] || '').toUpperCase();
            if (!/^[A-Z]{5}$/.test(g)) break;
            if (gradeGuess(g, answer).join('') === 'GGGGG') { solvedAt = i + 1; break; }
        }
        const serverOutcome = solvedAt > 0 ? 'win' : 'loss';

        const dailyStatsRef = db.doc(dailyStats(date));
        const allTimeRef = db.doc(allTime);

        // ---- Guests: just bump global counters; no per-user docs ----
        if (!uid) {
            await db.runTransaction(async (tx) => {
                const dSnap = await tx.get(dailyStatsRef);
                const aSnap = await tx.get(allTimeRef);

                const d = dSnap.exists ? dSnap.data() : { totalPlays: 0, wins: 0, losses: 0, attemptsHistogram: {} };
                const a = aSnap.exists ? aSnap.data() : { totalPlays: 0, wins: 0, losses: 0, attemptsHistogram: {} };

                d.totalPlays++; a.totalPlays++;
                if (serverOutcome === 'win') {
                    d.wins++; a.wins++;
                    d.attemptsHistogram[String(solvedAt)] = (d.attemptsHistogram[String(solvedAt)] || 0) + 1;
                    a.attemptsHistogram[String(solvedAt)] = (a.attemptsHistogram[String(solvedAt)] || 0) + 1;
                } else { d.losses++; a.losses++; }

                tx.set(dailyStatsRef, d, { merge: true });
                tx.set(allTimeRef, a, { merge: true });
            });

            return { outcome: serverOutcome, solvedAt, streak: null };
        }

        // ---- Logged-in: read EVERYTHING first, then write ----
        const dayRef = db.doc(userWordleDay(uid, date));
        const profRef = db.doc(userWordleDoc(uid));

        let streakOut = null;

        await db.runTransaction(async (tx) => {
            const [daySnap, profSnap, dSnap, aSnap] = await Promise.all([
                tx.get(dayRef),
                tx.get(profRef),
                tx.get(dailyStatsRef),
                tx.get(allTimeRef),
            ]);

            const dayCur = daySnap.exists ? daySnap.data() : { guesses: [], outcome: 'in_progress' };
            const alreadyDone = dayCur.outcome && dayCur.outcome !== 'in_progress';

            const d = dSnap.exists ? dSnap.data() : { totalPlays: 0, wins: 0, losses: 0, attemptsHistogram: {} };
            const a = aSnap.exists ? aSnap.data() : { totalPlays: 0, wins: 0, losses: 0, attemptsHistogram: {} };

            const baseProf = profSnap.exists ? profSnap.data() : {
                currentStreak: 0, maxStreak: 0, lastPlayedUTC: null,
                totalPlays: 0, wins: 0, losses: 0, attemptsHistogram: {}
            };

            tx.set(dayRef, {
                guesses: guesses.map(g => (g || '').toUpperCase()).slice(0, 6),
                outcome: serverOutcome,
                completedAt: new Date()
            }, { merge: true });

            if (!alreadyDone) {
                d.totalPlays++; a.totalPlays++;
                if (serverOutcome === 'win') {
                    d.wins++; a.wins++;
                    d.attemptsHistogram[String(solvedAt)] = (d.attemptsHistogram[String(solvedAt)] || 0) + 1;
                    a.attemptsHistogram[String(solvedAt)] = (a.attemptsHistogram[String(solvedAt)] || 0) + 1;
                } else { d.losses++; a.losses++; }

                tx.set(dailyStatsRef, d, { merge: true });
                tx.set(allTimeRef, a, { merge: true });

                // User profile (streaks/stats)
                const continued = baseProf.lastPlayedUTC === yesterdayUTCStr(date);
                const currentStreak = (serverOutcome === 'win')
                    ? (continued ? (baseProf.currentStreak || 0) + 1 : 1)
                    : 0;
                const maxStreak = Math.max(baseProf.maxStreak || 0, currentStreak);
                const wins = (baseProf.wins || 0) + (serverOutcome === 'win' ? 1 : 0);
                const losses = (baseProf.losses || 0) + (serverOutcome === 'loss' ? 1 : 0);
                const totalPlays = (baseProf.totalPlays || 0) + 1;

                const attemptsHistogram = { ...(baseProf.attemptsHistogram || {}) };
                if (serverOutcome === 'win') {
                    attemptsHistogram[String(solvedAt)] = (attemptsHistogram[String(solvedAt)] || 0) + 1;
                }

                streakOut = {
                    currentStreak, maxStreak, wins, losses, totalPlays, lastPlayedUTC: date
                };

                tx.set(profRef, { ...streakOut, attemptsHistogram }, { merge: true });
            } else {
                streakOut = {
                    currentStreak: baseProf.currentStreak || 0,
                    maxStreak: baseProf.maxStreak || 0,
                    wins: baseProf.wins || 0,
                    losses: baseProf.losses || 0,
                    totalPlays: baseProf.totalPlays || 0,
                    lastPlayedUTC: baseProf.lastPlayedUTC || null
                };
            }
        });

        return { outcome: serverOutcome, solvedAt, streak: streakOut };
    }
);  