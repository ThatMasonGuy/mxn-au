// functions/flagle.mjs - Fixed transaction version
import { onCall } from 'firebase-functions/v2/https'
import { db } from '../config/firebase.mjs'
import { calculateDailyStreak, hasRecordedDailyResult } from './dailyGameStats.mjs'
import { validateCurrentPuzzleId, validateFlagleCompletion } from './dailyGameValidation.mjs'

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
        const { puzzleId, answers, allAttempts, score, outcome } = req.data || {}
        const puzzle = validateCurrentPuzzleId(puzzleId, 'flagle')
        if (!puzzle.valid) throw new Error(puzzle.reason)
        const date = puzzle.date
        const countries = await ensureSolutionFor(date)
        const validation = validateFlagleCompletion({
            puzzleId,
            answers,
            allAttempts,
            score,
            outcome,
            countries,
        })
        if (!validation.valid) throw new Error(validation.reason)
        const { correctCount } = validation

        if (!uid) {
            return { success: true, outcome, correctCount, score, profile: null }
        }

        // Update global stats and user profile
        const dailyStatsRef = db.doc(`dailyChallenges/flag/stats/${date}`)
        const allTimeRef = db.doc(`dailyChallenges/flag`)
        const profRef = db.doc(`users/${uid}/dailyChallenges/flag`)
        let updatedProfile = null

        await db.runTransaction(async (tx) => {
            // FIXED: Do ALL reads first, before any writes
            const readPromises = [
                tx.get(dailyStatsRef),
                tx.get(allTimeRef)
            ]

            // Add profile read if user is logged in
            readPromises.push(tx.get(profRef))

            const snapshots = await Promise.all(readPromises)
            const [dSnap, aSnap, profSnap] = snapshots

            if (profSnap?.exists && hasRecordedDailyResult(profSnap.data(), date)) {
                updatedProfile = profSnap.data()
                return
            }

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
            if (profSnap) {
                const baseProf = profSnap.exists ? profSnap.data() : {
                    currentStreak: 0, maxStreak: 0, lastPlayedUTC: null,
                    totalPlays: 0, wins: 0, losses: 0, totalScore: 0, averageScore: 0
                }

                const currentStreak = calculateDailyStreak(baseProf, outcome, date)
                const maxStreak = Math.max(baseProf.maxStreak || 0, currentStreak)
                const wins = (baseProf.wins || 0) + (outcome === 'win' ? 1 : 0)
                const losses = (baseProf.losses || 0) + (outcome === 'loss' ? 1 : 0)
                const totalPlays = (baseProf.totalPlays || 0) + 1
                const totalScore = (baseProf.totalScore || 0) + score
                const averageScore = Math.round(totalScore / totalPlays)

                updatedProfile = {
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
            score,
            profile: updatedProfile,
        }
    }
)
