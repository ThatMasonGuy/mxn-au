// functions/src/flagleGenerate.mjs
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { FieldValue } from 'firebase-admin/firestore'
import { db } from '../config/firebase.mjs'
import {
    FLAGLE_COUNTRY_POOL,
    FLAGLE_DIFFICULTY_TIERS,
} from './flagleCountryTiers.mjs'

// ──────────────────────────────────────────────────────────────────────────────
// Secrets
// ──────────────────────────────────────────────────────────────────────────────
const ADMIN_API_KEY = defineSecret('ADMIN_API_KEY')

// ──────────────────────────────────────────────────────────────────────────────
// Constants & helpers
// ──────────────────────────────────────────────────────────────────────────────
const REGION = 'australia-southeast2'

// Firestore paths
const SOLS_COL = () => db.collection('dailyChallenges').doc('flag').collection('solutions')

const toDateId = (d) => d.toISOString().slice(0, 10) // UTC YYYY-MM-DD
const atUTC = (y, m, d) => new Date(Date.UTC(y, m, d))
const parseDateIdUTC = (id) => {
    const [y, m, d] = id.split('-').map(Number)
    return atUTC(y, m - 1, d)
}
const addDaysUTC = (date, n) =>
    atUTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + n)

const range = (n) => Array.from({ length: n }, (_, i) => i)

// ──────────────────────────────────────────────────────────────────────────────
// Get recently used countries (to avoid repetition)
// ──────────────────────────────────────────────────────────────────────────────
async function fetchRecentCountries(todayId, daysBack = 30) {
    const recent = new Set()
    const today = parseDateIdUTC(todayId)
    const startDate = toDateId(addDaysUTC(today, -daysBack))

    const recentSnap = await SOLS_COL()
        .where('__name__', '>=', startDate)
        .where('__name__', '<=', todayId)
        .get()

    recentSnap.forEach((doc) => {
        const countries = doc.data()?.countries || []
        countries.forEach(country => recent.add(country))
    })

    return recent
}

// ──────────────────────────────────────────────────────────────────────────────
// Select balanced set of countries
// ──────────────────────────────────────────────────────────────────────────────
function selectCountries(exclude = new Set()) {
    const availableEasy = FLAGLE_DIFFICULTY_TIERS.easy.filter(c => !exclude.has(c))
    const availableMedium = FLAGLE_DIFFICULTY_TIERS.medium.filter(c => !exclude.has(c))
    const availableHard = FLAGLE_DIFFICULTY_TIERS.hard.filter(c => !exclude.has(c))

    const selected = []

    // Try to pick: 2 easy, 2 medium, 1 hard
    const pickRandom = (arr, count) => {
        const picks = []
        const available = [...arr]
        for (let i = 0; i < Math.min(count, available.length); i++) {
            const idx = Math.floor(Math.random() * available.length)
            picks.push(available.splice(idx, 1)[0])
        }
        return picks
    }

    selected.push(...pickRandom(availableEasy, 2))
    selected.push(...pickRandom(availableMedium, 2))
    selected.push(...pickRandom(availableHard, 1))

    // If we don't have enough, fill from the general pool
    if (selected.length < 5) {
        const allAvailable = FLAGLE_COUNTRY_POOL.filter(c =>
            !exclude.has(c) && !selected.includes(c)
        )
        selected.push(...pickRandom(allAvailable, 5 - selected.length))
    }

    // Shuffle the final selection
    for (let i = selected.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selected[i], selected[j]] = [selected[j], selected[i]]
    }

    return selected.slice(0, 5)
}

// ──────────────────────────────────────────────────────────────────────────────
// Figure out which dates need puzzles
// ──────────────────────────────────────────────────────────────────────────────
async function checkMissingDates(todayId) {
    const today = parseDateIdUTC(todayId)

    // next 14 days must exist; also ensure day 15 is prepared
    const next14 = range(14).map((i) => toDateId(addDaysUTC(today, i + 1)))
    const day15 = toDateId(addDaysUTC(today, 15))

    const snaps = await Promise.all(next14.map((id) => SOLS_COL().doc(id).get()))
    const missing = next14.filter((id, idx) => !snaps[idx].exists)

    const day15Snap = await SOLS_COL().doc(day15).get()
    const need15 = !day15Snap.exists

    return { missing, day15, need15 }
}

// ──────────────────────────────────────────────────────────────────────────────
// Generate puzzles for missing dates
// ──────────────────────────────────────────────────────────────────────────────
async function generatePuzzles(dateIds, recentCountries) {
    const puzzles = []
    const used = new Set(recentCountries)

    for (const dateId of dateIds) {
        const countries = selectCountries(used)
        puzzles.push({ dateId, countries })

        // Add to used set to avoid repetition in same batch
        countries.forEach(c => used.add(c))

        // Remove oldest countries from tracking if set gets too large
        if (used.size > 100) {
            const arr = Array.from(used)
            arr.slice(0, 20).forEach(c => used.delete(c))
        }
    }

    return puzzles
}

// ──────────────────────────────────────────────────────────────────────────────
async function upsertSolutions(puzzles) {
    const batch = db.batch()
    for (const { dateId, countries } of puzzles) {
        const ref = SOLS_COL().doc(dateId)
        const snap = await ref.get()
        if (snap.exists) continue

        batch.set(
            ref,
            {
                countries,
                createdAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
        )
    }
    await batch.commit()
}

// Core routine used by cron + admin trigger
async function runGenerationFor(todayId) {
    const recentCountries = await fetchRecentCountries(todayId, 30)
    const { missing, day15, need15 } = await checkMissingDates(todayId)

    const dateIds = [...missing, ...(need15 ? [day15] : [])]
    if (dateIds.length === 0) {
        return { filledCount: 0, dates: [], puzzles: [] }
    }

    const puzzles = await generatePuzzles(dateIds, recentCountries)
    await upsertSolutions(puzzles)

    return { filledCount: puzzles.length, dates: dateIds, puzzles }
}

// ──────────────────────────────────────────────────────────────────────────────
// Scheduled: every midnight UTC
// ──────────────────────────────────────────────────────────────────────────────
export const flagleGenerateCron = onSchedule(
    {
        schedule: '0 0 * * *', // midnight UTC daily
        timeZone: 'Etc/UTC',
        region: 'australia-southeast1',
        retryCount: 3,
        maxInstances: 1
    },
    async () => {
        const todayId = toDateId(new Date())
        const result = await runGenerationFor(todayId)
        console.info('[flagleGenerateCron] generated', result)
        return result
    }
)

// ──────────────────────────────────────────────────────────────────────────────
// Admin HTTP trigger: manual generation
// ──────────────────────────────────────────────────────────────────────────────
export const flagleGenerateNow = onRequest(
    {
        region: REGION,
        secrets: [ADMIN_API_KEY],
        cors: true,
        maxInstances: 1
    },
    async (req, res) => {
        try {
            const key = req.header('x-admin-key') || req.header('X-Admin-Key') || req.query.key
            if (!key || String(key) !== ADMIN_API_KEY.value()) {
                return res.status(401).json({ error: 'unauthorized' })
            }

            const overwrite = req.query.overwrite === 'true'
            const startParam = req.query.start
            const endParam = req.query.end
            const daysParam = parseInt(req.query.days, 10) || null
            const today = new Date()

            // Figure out start/end dates
            const startDate = startParam ? parseDateIdUTC(startParam) : today
            let endDate = endParam ? parseDateIdUTC(endParam) : null
            if (!endDate && daysParam) {
                endDate = addDaysUTC(startDate, daysParam)
            }
            if (!endDate) endDate = addDaysUTC(startDate, 1)

            // Collect dateIds
            const dateIds = []
            for (let d = startDate; d <= endDate; d = addDaysUTC(d, 1)) {
                dateIds.push(toDateId(d))
            }

            // Get recent countries to avoid
            const recentCountries = await fetchRecentCountries(toDateId(today), 30)

            // Generate puzzles
            const puzzles = await generatePuzzles(dateIds, recentCountries)

            // Write to Firestore
            const batch = db.batch()
            for (const { dateId, countries } of puzzles) {
                const ref = SOLS_COL().doc(dateId)
                if (!overwrite) {
                    const snap = await ref.get()
                    if (snap.exists) continue
                }
                batch.set(
                    ref,
                    {
                        countries,
                        createdAt: FieldValue.serverTimestamp(),
                        overwrite,
                    },
                    { merge: true }
                )
            }
            await batch.commit()

            res.status(200).json({
                ok: true,
                range: { start: toDateId(startDate), end: toDateId(endDate) },
                count: puzzles.length,
                puzzles,
                overwrite,
            })
        } catch (e) {
            console.error('[flagleGenerateNow] error', e)
            res.status(500).json({ error: String(e?.message || e) })
        }
    }
)
