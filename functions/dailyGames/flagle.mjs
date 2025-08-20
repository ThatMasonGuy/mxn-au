// functions/flagle.mjs
import { onCall } from 'firebase-functions/v2/https'
import { db } from '../config/firebase.mjs'

const REGION = 'australia-southeast2'

// ---------- Time (UTC midnight rollover) ----------
function dateStrUTC(d = new Date()) {
    const y = d.getUTCFullYear()
    const m = String(d.getUTCMonth() + 1).padStart(2, '0')
    const day = String(d.getUTCDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

function nextMidnightUTCISO(d = new Date()) {
    const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 1))
    return next.toISOString()
}

function yesterdayUTCStr(dateYYYYMMDD) {
    const [Y, M, D] = dateYYYYMMDD.split('-').map(Number)
    const yest = new Date(Date.UTC(Y, M - 1, D - 1))
    return dateStrUTC(yest)
}

// ---------- Paths ----------
const solDoc = (date) => `dailyChallenges/flag/solutions/${date}`
const dailyStats = (date) => `dailyChallenges/flag/stats/${date}`
const allTime = `dailyChallenges/flag`
const userFlagleDoc = (uid) => `users/${uid}/dailyChallenges/flag`
const userFlagleDay = (uid, date) => `users/${uid}/dailyChallenges/flag/days/${date}`

// ---------- Safe create helper (idempotent) ----------
async function createIfMissing(refPath, seed) {
    const ref = db.doc(refPath)
    try {
        await ref.create(seed)
    } catch (e) {
        if (!(e && (e.code === 6 || e.message?.includes('ALREADY_EXISTS')))) throw e
    }
}

// ---------- Ensure solution for date ----------
async function ensureSolutionFor(date) {
    const ref = db.doc(solDoc(date))
    const FALLBACK = ['United States', 'United Kingdom', 'France', 'Germany', 'Japan']
    const nowISO = new Date().toISOString()

    const snap = await ref.get()
    if (!snap.exists) {
        await createIfMissing(ref.path, {
            countries: FALLBACK,
            wasFallbackSeed: true,
            seededAt: nowISO
        })
        return FALLBACK
    }
    const raw = snap.data()
    const countries = raw?.countries || []
    if (!Array.isArray(countries) || countries.length !== 5) {
        await ref.set({
            countries: FALLBACK,
            wasFallbackSeed: true,
            seedReason: 'invalid_or_empty',
            seededAt: nowISO
        }, { merge: true })
        return FALLBACK
    }
    return countries
}

// ---------- Bootstrap on first launch ----------
async function bootstrapToday(date, uid = null) {
    await createIfMissing(allTime, {
        totalPlays: 0,
        wins: 0,
        losses: 0,
        totalScore: 0,
        scoreHistogram: {}
    })

    await createIfMissing(dailyStats(date), {
        totalPlays: 0,
        wins: 0,
        losses: 0,
        totalScore: 0,
        scoreHistogram: {}
    })

    await ensureSolutionFor(date)

    if (uid) {
        await createIfMissing(userFlagleDoc(uid), {
            currentStreak: 0,
            maxStreak: 0,
            lastPlayedUTC: null,
            totalPlays: 0,
            wins: 0,
            losses: 0,
            totalScore: 0,
            averageScore: 0
        })
        await createIfMissing(userFlagleDay(uid, date), {
            answers: [],
            score: 0,
            lives: 3,
            currentFlagIndex: 0,
            outcome: 'in_progress'
        })
    }
}

// ---------- 1) Load today's flags ----------
export const getDailyFlagle = onCall(
    {
        region: REGION,
        maxInstances: 1
    },
    async (req) => {
        const uid = req.auth?.uid || null
        const date = dateStrUTC()

        await bootstrapToday(date, uid)
        const countries = await ensureSolutionFor(date)

        let userState = null
        if (uid) {
            const daySnap = await db.doc(userFlagleDay(uid, date)).get()
            if (daySnap.exists) userState = daySnap.data()
        }

        return {
            puzzleId: `flagle-${date}`,
            packet: { countries },
            userState,
            rolloverAt: nextMidnightUTCISO(),
        }
    }
)

// ---------- 2) Save progress ----------
export const saveFlagleProgress = onCall(
    {
        region: REGION,
        maxInstances: 1
    },
    async (req) => {
        const uid = req.auth?.uid || null
        if (!uid) return { ok: true }

        const { puzzleId, flagIndex, guess, correct, skipped, score, lives } = req.data || {}
        if (!puzzleId || typeof flagIndex !== 'number') {
            throw new Error('bad args')
        }
        const date = puzzleId.replace('flagle-', '')

        await bootstrapToday(date, uid)
        const countries = await ensureSolutionFor(date)

        const dayRef = db.doc(userFlagleDay(uid, date))
        await db.runTransaction(async (tx) => {
            const snap = await tx.get(dayRef)
            const cur = snap.exists ? snap.data() : {
                answers: [],
                score: 0,
                lives: 3,
                currentFlagIndex: 0,
                outcome: 'in_progress'
            }

            if (cur.outcome && cur.outcome !== 'in_progress') return

            const nextAnswers = [...(cur.answers || [])]
            nextAnswers[flagIndex] = {
                country: countries[flagIndex],
                guess: guess || null,
                correct: correct || false,
                skipped: skipped || false
            }

            tx.set(dayRef, {
                answers: nextAnswers,
                score: score || cur.score,
                lives: lives || cur.lives,
                currentFlagIndex: flagIndex + (correct || skipped ? 1 : 0),
                outcome: 'in_progress'
            }, { merge: true })
        })

        return { ok: true }
    }
)

// ---------- 3) Finalize ----------
export const submitFlagleOutcome = onCall(
    {
        region: REGION,
        maxInstances: 1
    },
    async (req) => {
        const uid = req.auth?.uid || null
        const { puzzleId, answers, score } = req.data || {}
        if (!puzzleId || !Array.isArray(answers)) throw new Error('bad args')

        const date = puzzleId.replace('flagle-', '')

        await bootstrapToday(date, uid)

        const correctCount = answers.filter(a => a.correct).length
        const serverOutcome = score >= 150 ? 'win' : 'loss' // Win if score >= 150

        const dailyStatsRef = db.doc(dailyStats(date))
        const allTimeRef = db.doc(allTime)

        // ---- Guests: just bump global counters ----
        if (!uid) {
            await db.runTransaction(async (tx) => {
                const dSnap = await tx.get(dailyStatsRef)
                const aSnap = await tx.get(allTimeRef)

                const d = dSnap.exists ? dSnap.data() : {
                    totalPlays: 0, wins: 0, losses: 0, totalScore: 0, scoreHistogram: {}
                }
                const a = aSnap.exists ? aSnap.data() : {
                    totalPlays: 0, wins: 0, losses: 0, totalScore: 0, scoreHistogram: {}
                }

                d.totalPlays++
                a.totalPlays++
                d.totalScore += score
                a.totalScore += score

                if (serverOutcome === 'win') {
                    d.wins++
                    a.wins++
                } else {
                    d.losses++
                    a.losses++
                }

                // Score histogram (bucketed by 50s)
                const bucket = Math.floor(score / 50) * 50
                d.scoreHistogram[String(bucket)] = (d.scoreHistogram[String(bucket)] || 0) + 1
                a.scoreHistogram[String(bucket)] = (a.scoreHistogram[String(bucket)] || 0) + 1

                tx.set(dailyStatsRef, d, { merge: true })
                tx.set(allTimeRef, a, { merge: true })
            })

            return { outcome: serverOutcome, correctCount, score, streak: null }
        }

        // ---- Logged-in users ----
        const dayRef = db.doc(userFlagleDay(uid, date))
        const profRef = db.doc(userFlagleDoc(uid))

        let streakOut = null

        await db.runTransaction(async (tx) => {
            const [daySnap, profSnap, dSnap, aSnap] = await Promise.all([
                tx.get(dayRef),
                tx.get(profRef),
                tx.get(dailyStatsRef),
                tx.get(allTimeRef),
            ])

            const dayCur = daySnap.exists ? daySnap.data() : {
                answers: [], score: 0, outcome: 'in_progress'
            }
            const alreadyDone = dayCur.outcome && dayCur.outcome !== 'in_progress'

            const d = dSnap.exists ? dSnap.data() : {
                totalPlays: 0, wins: 0, losses: 0, totalScore: 0, scoreHistogram: {}
            }
            const a = aSnap.exists ? aSnap.data() : {
                totalPlays: 0, wins: 0, losses: 0, totalScore: 0, scoreHistogram: {}
            }

            const baseProf = profSnap.exists ? profSnap.data() : {
                currentStreak: 0, maxStreak: 0, lastPlayedUTC: null,
                totalPlays: 0, wins: 0, losses: 0, totalScore: 0, averageScore: 0
            }

            tx.set(dayRef, {
                answers: answers,
                score: score,
                outcome: serverOutcome,
                completedAt: new Date()
            }, { merge: true })

            if (!alreadyDone) {
                d.totalPlays++
                a.totalPlays++
                d.totalScore += score
                a.totalScore += score

                if (serverOutcome === 'win') {
                    d.wins++
                    a.wins++
                } else {
                    d.losses++
                    a.losses++
                }

                const bucket = Math.floor(score / 50) * 50
                d.scoreHistogram[String(bucket)] = (d.scoreHistogram[String(bucket)] || 0) + 1
                a.scoreHistogram[String(bucket)] = (a.scoreHistogram[String(bucket)] || 0) + 1

                tx.set(dailyStatsRef, d, { merge: true })
                tx.set(allTimeRef, a, { merge: true })

                // User profile (streaks/stats)
                const continued = baseProf.lastPlayedUTC === yesterdayUTCStr(date)
                const currentStreak = (serverOutcome === 'win')
                    ? (continued ? (baseProf.currentStreak || 0) + 1 : 1)
                    : 0
                const maxStreak = Math.max(baseProf.maxStreak || 0, currentStreak)
                const wins = (baseProf.wins || 0) + (serverOutcome === 'win' ? 1 : 0)
                const losses = (baseProf.losses || 0) + (serverOutcome === 'loss' ? 1 : 0)
                const totalPlays = (baseProf.totalPlays || 0) + 1
                const totalScore = (baseProf.totalScore || 0) + score
                const averageScore = Math.round(totalScore / totalPlays)

                streakOut = {
                    currentStreak, maxStreak, wins, losses, totalPlays,
                    lastPlayedUTC: date, totalScore, averageScore
                }

                tx.set(profRef, streakOut, { merge: true })
            } else {
                streakOut = {
                    currentStreak: baseProf.currentStreak || 0,
                    maxStreak: baseProf.maxStreak || 0,
                    wins: baseProf.wins || 0,
                    losses: baseProf.losses || 0,
                    totalPlays: baseProf.totalPlays || 0,
                    lastPlayedUTC: baseProf.lastPlayedUTC || null,
                    totalScore: baseProf.totalScore || 0,
                    averageScore: baseProf.averageScore || 0
                }
            }
        })

        return { outcome: serverOutcome, correctCount, score, streak: streakOut }
    }
)