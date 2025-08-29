// functions/flagle.mjs - Fixed transaction version
import { onCall } from 'firebase-functions/v2/https'
import { db } from '../config/firebase.mjs'

const REGION = 'australia-southeast2'

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

const solDoc = (date) => `dailyChallenges/flag/solutions/${date}`

async function createIfMissing(refPath, seed) {
    const ref = db.doc(refPath)
    try {
        await ref.create(seed)
    } catch (e) {
        if (!(e && (e.code === 6 || e.message?.includes('ALREADY_EXISTS')))) throw e
    }
}

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

// ---------- 1) GET PUZZLE DATA ONLY ----------
export const getDailyFlagle = onCall(
    {
        region: REGION,
        maxInstances: 1
    },
    async (req) => {
        const date = dateStrUTC()
        const countries = await ensureSolutionFor(date)

        return {
            puzzleId: `flagle-${date}`,
            countries,
            rolloverAt: nextMidnightUTCISO(),
        }
    }
)

// ---------- 2) SUBMIT COMPLETION (STATS ONLY) ----------
export const submitFlagleCompletion = onCall(
    {
        region: REGION,
        maxInstances: 1
    },
    async (req) => {
        const uid = req.auth?.uid
        const { puzzleId, answers, score, outcome } = req.data || {}

        if (!puzzleId || !Array.isArray(answers) || typeof score !== 'number' || !['win', 'loss'].includes(outcome)) {
            throw new Error('Invalid parameters')
        }

        const date = puzzleId.replace('flagle-', '')
        const correctCount = answers.filter(a => a.correct).length
        const validOutcome = score >= 150 ? 'win' : 'loss'

        if (outcome !== validOutcome) {
            throw new Error('Outcome does not match score')
        }

        // Update global stats and user profile
        const dailyStatsRef = db.doc(`dailyChallenges/flag/stats/${date}`)
        const allTimeRef = db.doc(`dailyChallenges/flag`)
        const profRef = uid ? db.doc(`users/${uid}/dailyChallenges/flag`) : null

        await db.runTransaction(async (tx) => {
            // FIXED: Do ALL reads first, before any writes
            const readPromises = [
                tx.get(dailyStatsRef),
                tx.get(allTimeRef)
            ]

            // Add profile read if user is logged in
            if (profRef) {
                readPromises.push(tx.get(profRef))
            }

            const snapshots = await Promise.all(readPromises)
            const [dSnap, aSnap, profSnap] = snapshots

            // Process daily and all-time stats
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

            if (outcome === 'win') {
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

            // Now do ALL writes
            tx.set(dailyStatsRef, d, { merge: true })
            tx.set(allTimeRef, a, { merge: true })

            // Update user profile if logged in
            if (uid && profRef && profSnap) {
                const baseProf = profSnap.exists ? profSnap.data() : {
                    currentStreak: 0, maxStreak: 0, lastPlayedUTC: null,
                    totalPlays: 0, wins: 0, losses: 0, totalScore: 0, averageScore: 0
                }

                const continued = baseProf.lastPlayedUTC === yesterdayUTCStr(date)
                const currentStreak = (outcome === 'win')
                    ? (continued ? (baseProf.currentStreak || 0) + 1 : 1)
                    : 0
                const maxStreak = Math.max(baseProf.maxStreak || 0, currentStreak)
                const wins = (baseProf.wins || 0) + (outcome === 'win' ? 1 : 0)
                const losses = (baseProf.losses || 0) + (outcome === 'loss' ? 1 : 0)
                const totalPlays = (baseProf.totalPlays || 0) + 1
                const totalScore = (baseProf.totalScore || 0) + score
                const averageScore = Math.round(totalScore / totalPlays)

                const updatedProfile = {
                    currentStreak,
                    maxStreak,
                    wins,
                    losses,
                    totalPlays,
                    lastPlayedUTC: date,
                    totalScore,
                    averageScore
                }

                tx.set(profRef, updatedProfile, { merge: true })
            }
        })

        return {
            success: true,
            outcome,
            correctCount,
            score
        }
    }
)