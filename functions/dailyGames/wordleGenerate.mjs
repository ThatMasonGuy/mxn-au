// functions/src/wordleGenerate.mjs
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
// Constants & helpers
// ──────────────────────────────────────────────────────────────────────────────
const REGION = 'australia-southeast2'

// Firestore paths
const SOLS_COL = () => db.collection('dailyChallenges').doc('wordle').collection('solutions')

const toDateId = (d) => d.toISOString().slice(0, 10) // UTC YYYY-MM-DD
const atUTC = (y, m, d) => new Date(Date.UTC(y, m, d))
const parseDateIdUTC = (id) => {
    const [y, m, d] = id.split('-').map(Number)
    return atUTC(y, m - 1, d)
}
const addDaysUTC = (date, n) =>
    atUTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + n)

const range = (n) => Array.from({ length: n }, (_, i) => i)
const isFiveLetters = (s) => /^[A-Z]{5}$/.test(s)

// ──────────────────────────────────────────────────────────────────────────────
// Ban set = past 60 days + all futures (up to +365)
// ──────────────────────────────────────────────────────────────────────────────
async function fetchBanSet(todayId) {
    const ban = new Set()

    const today = parseDateIdUTC(todayId)
    const startPast = toDateId(addDaysUTC(today, -60))
    const endFuture = toDateId(addDaysUTC(today, +365))

    // Past 60d → today
    const pastSnap = await SOLS_COL()
        .where('__name__', '>=', startPast)
        .where('__name__', '<=', todayId)
        .get()
    pastSnap.forEach((doc) => {
        const w = String(doc.data()?.word || '').toUpperCase()
        if (isFiveLetters(w)) ban.add(w)
    })

    // Today → +365d
    const futureSnap = await SOLS_COL()
        .where('__name__', '>=', todayId)
        .where('__name__', '<=', endFuture)
        .get()
    futureSnap.forEach((doc) => {
        const w = String(doc.data()?.word || '').toUpperCase()
        if (isFiveLetters(w)) ban.add(w)
    })

    return ban
}

// ──────────────────────────────────────────────────────────────────────────────
// Figure out which dates we need to fill
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
// LLM generation (GPT-4o via chat.completions with JSON output)
// ──────────────────────────────────────────────────────────────────────────────
async function generateWords(need, ban) {
    // ask for a few extra to survive filtering collisions
    const target = Math.min(need + 8, 30)
    const client = openai()

    const banSlice = Array.from(ban).slice(0, 800).join(', ')

    const comp = await client.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content:
                    'You are a curator for a Wordle-like daily game. Return only common English 5-letter words, uppercase A–Z.'
            },
            {
                role: 'user',
                content:
                    `Return JSON: {"words":[...]} with ${target} UNIQUE, COMMON English 5-letter words (UPPERCASE ASCII).
Rules:
- Swears/inappropriate allowed.
- NO proper nouns / person names.
- NO plural nouns and avoid simple 3rd-person singular verbs.
- Avoid rare/obscure words; choose broadly recognizable ones.
- EXCLUDE any in this ban list:
${banSlice}`
            }
        ],
        temperature: 0.4,
    })

    let parsed = {}
    try { parsed = JSON.parse(comp.choices?.[0]?.message?.content || '{}') } catch { }
    const candidates = Array.from(new Set((parsed.words || []).map((w) => String(w).toUpperCase().trim())))

    // local filters
    const approved = []
    for (const w of candidates) {
        if (!isFiveLetters(w)) continue
        if (ban.has(w)) continue
        approved.push(w)
        if (approved.length >= need) break
    }
    return approved
}

// ──────────────────────────────────────────────────────────────────────────────
async function upsertSolutions(dateIds, words) {
    // write only missing; do not overwrite existing
    const batch = db.batch()
    for (let i = 0; i < dateIds.length; i++) {
        const id = dateIds[i]
        const answer = words[i]
        const ref = SOLS_COL().doc(id)
        const snap = await ref.get()
        if (snap.exists) continue
        batch.set(
            ref,
            {
                answer,
                source: 'ai',
                model: 'gpt-4o',
                createdAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
        )
    }
    await batch.commit()
}

// Core routine used by cron + admin trigger
async function runGenerationFor(todayId) {
    const ban = await fetchBanSet(todayId)
    const { missing, day15, need15 } = await checkMissingDates(todayId)

    const dateIds = [...missing, ...(need15 ? [day15] : [])]
    if (dateIds.length === 0) {
        return { filledCount: 0, dates: [], words: [] }
    }

    let words = await generateWords(dateIds.length, ban)
    if (words.length < dateIds.length) {
        // retry once with expanded ban
        for (const w of words) ban.add(w)
        const more = await generateWords(dateIds.length - words.length, ban)
        words = [...words, ...more]
    }

    // partial fill is okay; trim dateIds to words we have
    const trimmedDateIds = dateIds.slice(0, words.length)
    await upsertSolutions(trimmedDateIds, words.slice(0, trimmedDateIds.length))

    return { filledCount: trimmedDateIds.length, dates: trimmedDateIds, words: words.slice(0, trimmedDateIds.length) }
}

// ──────────────────────────────────────────────────────────────────────────────
// Scheduled: every midnight UTC
// ──────────────────────────────────────────────────────────────────────────────
export const wordleGenerateCron = onSchedule(
    {
        schedule: '0 0 * * *', // midnight UTC daily
        timeZone: 'Etc/UTC',
        region: 'australia-southeast1',
        secrets: [OPENAI_API_KEY],
        retryCount: 3,
        maxInstances: 1
    },
    async () => {
        const todayId = toDateId(new Date()) // already UTC in ISO
        const result = await runGenerationFor(todayId)
        console.info('[wordleGenerateCron] generated', result)
        return result
    }
)

// ──────────────────────────────────────────────────────────────────────────────
// Admin HTTP trigger: manual generation with ?date=YYYY-MM-DD (optional)
// Header: x-admin-key: <ADMIN_API_KEY>
// ──────────────────────────────────────────────────────────────────────────────
export const wordleGenerateNow = onRequest(
    { 
        region: REGION, 
        secrets: [OPENAI_API_KEY, ADMIN_API_KEY], 
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
            if (!endDate) endDate = addDaysUTC(startDate, 1) // default = just tomorrow

            // Collect dateIds
            const dateIds = []
            for (
                let d = startDate;
                d <= endDate;
                d = addDaysUTC(d, 1)
            ) {
                dateIds.push(toDateId(d))
            }

            // Ban set from today
            const ban = await fetchBanSet(toDateId(today))

            // Generate words
            let words = await generateWords(dateIds.length, ban)
            if (words.length < dateIds.length) {
                for (const w of words) ban.add(w)
                const more = await generateWords(dateIds.length - words.length, ban)
                words = [...words, ...more]
            }

            // Write to Firestore
            const batch = db.batch()
            for (let i = 0; i < dateIds.length; i++) {
                const ref = SOLS_COL().doc(dateIds[i])
                if (!overwrite) {
                    const snap = await ref.get()
                    if (snap.exists) continue
                }
                batch.set(
                    ref,
                    {
                        answer: words[i],
                        source: 'ai',
                        model: 'gpt-4o',
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
                count: dateIds.length,
                words: words.slice(0, dateIds.length),
                overwrite,
            })
        } catch (e) {
            console.error('[wordleGenerateNow] error', e)
            res.status(500).json({ error: String(e?.message || e) })
        }
    }
)