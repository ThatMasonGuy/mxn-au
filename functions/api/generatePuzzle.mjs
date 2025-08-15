import { onSchedule } from 'firebase-functions/v2/scheduler'
import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { FieldValue } from 'firebase-admin/firestore'
import OpenAI from 'openai'
import { db } from '../config/firebase.mjs'

// ──────────────────────────────────────────────────────────────────────────────
// Secrets
// ──────────────────────────────────────────────────────────────────────────────
const OPENAI_API_KEY = defineSecret('OPENAI_API_KEY')
const ADMIN_API_KEY = defineSecret('ADMIN_API_KEY')

let _openai = null
function openai() {
    if (!_openai) _openai = new OpenAI({ apiKey: OPENAI_API_KEY.value() })
    return _openai
}

// ──────────────────────────────────────────────────────────────────────────────
// Date helpers (UTC)
// ──────────────────────────────────────────────────────────────────────────────
function fmtUTC(d) {
    const date = d instanceof Date ? d : new Date(d)
    const y = date.getUTCFullYear()
    const m = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}
function addDaysUTC(date, days) {
    const out = new Date(date)
    out.setUTCDate(out.getUTCDate() + days)
    return out
}

// ──────────────────────────────────────────────────────────────────────────────
// Minimal router: gameId -> generator
// ──────────────────────────────────────────────────────────────────────────────
export const GAMES = {
    WORDLE: 'wordle',
    CONNECTIONS: 'connections',
}

// Default colors for connections groups
const DEFAULT_COLORS = ['yellow', 'green', 'blue', 'purple'];

const GENERATORS = {
    async [GAMES.WORDLE]({ dateStr }) {
        // Avoid repeats within the last 60 days + any already scheduled future days
        const recent = await getExistingAnswers(GAMES.WORDLE, 60)

        const prompt = `Give ONE fair 5-letter ENGLISH word for a Wordle-style game.\n\nRules:\n- Exactly 5 letters\n- Common dictionary word (no proper nouns, abbreviations, slang, profanity)\n- Challenging but fair\n- Not any of: ${recent.join(', ')}\n\nReturn ONLY the word in UPPERCASE.`

        const resp = await openai().chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.9,
            max_tokens: 8,
        })

        const answer = String(resp.choices?.[0]?.message?.content || '').trim().toUpperCase()
        if (!/^[A-Z]{5}$/.test(answer)) {
            throw new Error(`Invalid Wordle answer: ${answer}`)
        }

        // Shape expected by dailyGames function: { answer }
        // Path: dailyChallenges/wordle/games/${dateStr}
        await upsertGameDoc(GAMES.WORDLE, dateStr, { answer })
        return { gameId: GAMES.WORDLE, date: dateStr, answer }
    },

    async [GAMES.CONNECTIONS]({ dateStr }) {
        // Build a fresh puzzle in the doc shape consumed by getConnectionsWords
        // groups: [{ category, members: [4 words], difficulty: 'easy'|'medium'|'hard'|'expert' }]

        const recentThemes = await getExistingThemes(GAMES.CONNECTIONS, 30)

        const prompt = `Create a Connections puzzle with 4 groups of 4 related words.\n\nHard requirements:\n- Output JSON ONLY.\n- Each group: {\"category\": string, \"members\": [4 strings], \"difficulty\": one of easy|medium|hard|expert}.\n- Words 3–10 letters, uppercase A–Z only.\n- No offensive or NSFW content.\n- Categories must be distinct, unambiguous, and not any of: ${recentThemes.join(', ')}.\n- Include a couple of intentional red-herrings across groups.\n\nReturn exactly: { \"groups\": [ ...4 groups... ] }`

        const resp = await openai().chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.9,
            max_tokens: 700,
            response_format: { type: 'json_object' },
        })

        const data = JSON.parse(resp.choices?.[0]?.message?.content || '{}')
        if (!Array.isArray(data.groups) || data.groups.length !== 4) {
            throw new Error('Invalid connections payload (need groups[4])')
        }

        // Normalize & validate - IMPORTANT: Remove undefined color field or assign defaults
        const groups = data.groups.map((g, index) => ({
            category: String(g.category || '').trim(),
            members: (g.words || g.members || []).map((w) => String(w).trim().toUpperCase()),
            difficulty: String(g.difficulty || 'medium').toLowerCase(),
            color: DEFAULT_COLORS[index] // Always assign a color to avoid undefined
        }))

        if (groups.some((g) => !g.category || g.members.length !== 4)) {
            throw new Error('Each group must have category + 4 members')
        }

        await upsertGameDoc(GAMES.CONNECTIONS, dateStr, { groups })
        return { gameId: GAMES.CONNECTIONS, date: dateStr, groups }
    },
}

// ──────────────────────────────────────────────────────────────────────────────
// Firestore helpers (single collection)
// ──────────────────────────────────────────────────────────────────────────────
async function upsertGameDoc(gameId, dateStr, payload) {
    const ref = db.doc(`dailyChallenges/${gameId}/games/${dateStr}`)

    // Clean the payload to remove any undefined values
    const cleanPayload = JSON.parse(JSON.stringify({
        date: dateStr,
        gameId,
        ...payload,
        // stats object kept to keep consumers happy; can be expanded by gameplay CF
        stats: {
            totalPlays: 0,
            totalWins: 0,
            attemptsHistogram: gameId === 'wordle' ? {} : []
        },
        regenerate: false,
    }))

    // Add timestamps separately since they can't be stringified
    cleanPayload.createdAt = FieldValue.serverTimestamp()
    cleanPayload.updatedAt = FieldValue.serverTimestamp()

    await ref.set(cleanPayload, { merge: true })
}

async function getExistingAnswers(gameId, daysBack = 60) {
    const from = fmtUTC(addDaysUTC(new Date(), -daysBack))
    const snap = await db
        .collection(`dailyChallenges/${gameId}/games`)
        .where('date', '>=', from)
        .orderBy('date', 'desc')
        .get()

    const seen = new Set()
    snap.forEach((doc) => {
        const a = doc.data()?.answer
        if (typeof a === 'string') seen.add(a.toUpperCase())
    })

    // Also avoid any future scheduled answers
    const today = fmtUTC(new Date())
    const future = await db
        .collection(`dailyChallenges/${gameId}/games`)
        .where('date', '>', today)
        .orderBy('date', 'asc')
        .get()
    future.forEach((doc) => {
        const a = doc.data()?.answer
        if (typeof a === 'string') seen.add(a.toUpperCase())
    })

    return [...seen]
}

async function getExistingThemes(gameId, daysBack = 30) {
    const from = fmtUTC(addDaysUTC(new Date(), -daysBack))
    const snap = await db
        .collection(`dailyChallenges/${gameId}/games`)
        .where('date', '>=', from)
        .orderBy('date', 'desc')
        .get()

    const themes = new Set()
    snap.forEach((doc) => {
        const groups = doc.data()?.groups || []
        groups.forEach((g) => g?.category && themes.add(String(g.category)))
    })
    return [...themes]
}

// ──────────────────────────────────────────────────────────────────────────────
// Core generation
// ──────────────────────────────────────────────────────────────────────────────
async function generateOne(gameId, date) {
    const dateStr = fmtUTC(date)

    // Skip if already present and not flagged for regeneration
    const ref = db.doc(`dailyChallenges/${gameId}/games/${dateStr}`)
    const existing = await ref.get()
    if (existing.exists && !existing.data()?.regenerate) {
        console.log(`[gen] skip: ${gameId} ${dateStr}`)
        return null
    }

    const handler = GENERATORS[gameId]
    if (!handler) throw new Error(`No generator for ${gameId}`)
    return handler({ dateStr })
}

async function generateDays(daysAhead = 14) {
    const results = { success: [], failed: [] }

    // Discover active games from Firestore config
    const cfgSnap = await db.collection('dailyChallenges').get()
    const active = []
    cfgSnap.forEach((doc) => {
        const data = doc.data() || {}
        const gameId = doc.id

        // IMPORTANT: Only add valid game IDs that have generators
        if (data.active !== false && GENERATORS[gameId]) {
            active.push(gameId)
        } else if (!GENERATORS[gameId]) {
            console.warn(`No generator found for game: ${gameId}`)
        }
    })

    // Default to wordle + connections if no active games found
    if (active.length === 0) {
        console.log('No active games found, using defaults: wordle, connections')
        active.push(GAMES.WORDLE, GAMES.CONNECTIONS)
    } else {
        console.log(`Active games found: ${active.join(', ')}`)
    }

    const today = new Date()
    for (let d = 0; d <= daysAhead; d++) {
        const target = addDaysUTC(today, d)
        for (const gameId of active) {
            try {
                const r = await generateOne(gameId, target)
                if (r) {
                    results.success.push({ game: gameId, date: fmtUTC(target) })
                    console.log(`[gen] success: ${gameId} ${fmtUTC(target)}`)
                }
            } catch (err) {
                console.error(`[gen] fail ${gameId} ${fmtUTC(target)}`, err)
                results.failed.push({
                    game: gameId,
                    date: fmtUTC(target),
                    error: String(err?.message || err)
                })
            }
            await new Promise((r) => setTimeout(r, 300))
        }
    }
    return results
}

// ──────────────────────────────────────────────────────────────────────────────
// Cloud Functions
// ──────────────────────────────────────────────────────────────────────────────
export const scheduledDailyGeneration = onSchedule({
    region: 'australia-southeast1',
    schedule: '0 0 * * *', // midnight UTC
    timeZone: 'UTC',
    retryCount: 3,
    maxInstances: 1,
    memory: '512MiB',
    secrets: [OPENAI_API_KEY],
}, async () => {
    const results = await generateDays(14)
    await db.collection('systemLogs').add({
        type: 'puzzle_generation',
        timestamp: FieldValue.serverTimestamp(),
        results,
    })
    return results
})

export const manualDailyGeneration = onRequest({
    cors: true,
    region: 'australia-southeast1',
    maxInstances: 1,
    timeoutSeconds: 300,
    memory: '512MiB',
    secrets: [OPENAI_API_KEY, ADMIN_API_KEY],
}, async (req, res) => {
    const authToken = req.headers.authorization?.split('Bearer ')[1] ?? ''
    if (!ADMIN_API_KEY.value() || authToken !== ADMIN_API_KEY.value()) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const { gameId, date, daysAhead = 14 } = req.body || {}
        if (gameId && date) {
            const r = await generateOne(String(gameId), new Date(date))
            return res.json({ success: true, result: r })
        }
        const results = await generateDays(Number(daysAhead))
        return res.json({ success: true, results })
    } catch (err) {
        console.error('manualDailyGeneration error', err)
        return res.status(500).json({ error: 'Generation failed', message: String(err?.message || err) })
    }
})