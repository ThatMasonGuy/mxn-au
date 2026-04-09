// functions/src/daily/connectionsGenerate.mjs
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

const SOLS_COL = () => db.collection('dailyChallenges').doc('connections').collection('solutions')

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
// Fetch existing puzzles to avoid duplicates
// ──────────────────────────────────────────────────────────────────────────────
async function fetchExistingGroups(todayId) {
    const ban = new Set()

    const today = parseDateIdUTC(todayId)
    const startPast = toDateId(addDaysUTC(today, -30))
    const endFuture = toDateId(addDaysUTC(today, +365))

    const pastSnap = await SOLS_COL()
        .where('__name__', '>=', startPast)
        .where('__name__', '<=', todayId)
        .get()

    pastSnap.forEach((doc) => {
        const answer = doc.data()?.answer
        if (answer) {
            ;['easy', 'medium', 'hard', 'expert'].forEach((level) => {
                if (answer[level]) {
                    answer[level].forEach((word) => ban.add(word.toUpperCase()))
                }
            })
        }
    })

    const futureSnap = await SOLS_COL()
        .where('__name__', '>=', todayId)
        .where('__name__', '<=', endFuture)
        .get()

    futureSnap.forEach((doc) => {
        const answer = doc.data()?.answer
        if (answer) {
            ;['easy', 'medium', 'hard', 'expert'].forEach((level) => {
                if (answer[level]) {
                    answer[level].forEach((word) => ban.add(word.toUpperCase()))
                }
            })
        }
    })

    return ban
}

// ──────────────────────────────────────────────────────────────────────────────
// Check which dates need puzzles
// ──────────────────────────────────────────────────────────────────────────────
async function checkMissingDates(todayId) {
    const today = parseDateIdUTC(todayId)

    const next14 = range(14).map((i) => toDateId(addDaysUTC(today, i + 1)))
    const day15 = toDateId(addDaysUTC(today, 15))

    const snaps = await Promise.all(next14.map((id) => SOLS_COL().doc(id).get()))
    const missing = next14.filter((id, idx) => !snaps[idx].exists)

    const day15Snap = await SOLS_COL().doc(day15).get()
    const need15 = !day15Snap.exists

    return { missing, day15, need15 }
}

// ──────────────────────────────────────────────────────────────────────────────
// Generate Connections puzzle using GPT-4o
// ──────────────────────────────────────────────────────────────────────────────
async function generatePuzzle(ban) {
    const client = openai()

    const banList = Array.from(ban).slice(0, 500).join(', ')

    const comp = await client.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content: `You are a puzzle designer creating Connections-style word grouping puzzles. 
                Create groups of 4 related words with varying difficulty levels.
                Return JSON in this exact format:
                {
                    "answer": {
                        "easy": ["WORD1", "WORD2", "WORD3", "WORD4"],
                        "medium": ["WORD1", "WORD2", "WORD3", "WORD4"],
                        "hard": ["WORD1", "WORD2", "WORD3", "WORD4"],
                        "expert": ["WORD1", "WORD2", "WORD3", "WORD4"]
                    },
                    "categories": {
                        "easy": "Category description",
                        "medium": "Category description",
                        "hard": "Category description",
                        "expert": "Category description"
                    }
                }`,
            },
            {
                role: 'user',
                content: `Create a Connections puzzle with these requirements:
    
    DIFFICULTY LEVELS:
    - EASY: Approachable but not trivial. Avoid childish sets like colors, animals, days, chess pieces. Choose categories that are familiar yet not obvious.
    - MEDIUM: Require reasoning or conceptual links (e.g., cooking techniques, word roots, things tied to classical elements).
    - HARD: Ambiguous with heavy overlap. Use homonyms, multiple-meaning words, or subtle linguistic patterns. At least half the words here should look like they belong elsewhere.
    - EXPERT: Devious and abstract. Categories should be indirect (suffix patterns, words with shifting meanings, thematic or hidden connections). Solvable only after identifying easier groups.
    
    RULES:
    1. Each group must have EXACTLY 4 words
    2. All words must be UPPERCASE, single words (no phrases)
    3. Words should be 3–10 letters long
    4. NO word can appear in multiple groups
    5. At least 10 of the 16 words must feel like they could fit in more than one group (red herrings)
    6. Make the EXPERT group especially subtle, requiring other groups to fall into place first
    7. Categories should be clever, elegant, and not just trivia lists
    
    EXCLUDE these already-used words:
    ${banList}
    
    Create a clever, challenging puzzle that will truly test experienced players!`,
            },
        ],
        temperature: 0.8,
    })

    let parsed = {}
    try {
        parsed = JSON.parse(comp.choices?.[0]?.message?.content || '{}')
    } catch (e) {
        console.error('Failed to parse AI response:', e)
        return null
    }

    if (
        !parsed.answer ||
        !parsed.answer.easy ||
        !parsed.answer.medium ||
        !parsed.answer.hard ||
        !parsed.answer.expert
    ) {
        return null
    }

    for (const level of ['easy', 'medium', 'hard', 'expert']) {
        if (!Array.isArray(parsed.answer[level]) || parsed.answer[level].length !== 4) {
            return null
        }
        parsed.answer[level] = parsed.answer[level].map((w) => w.toUpperCase().trim())
        if (parsed.answer[level].some((w) => ban.has(w))) {
            return null
        }
    }

    const allWords = [
        ...parsed.answer.easy,
        ...parsed.answer.medium,
        ...parsed.answer.hard,
        ...parsed.answer.expert,
    ]
    if (new Set(allWords).size !== 16) {
        return null
    }

    return {
        answer: parsed.answer,
        categories: parsed.categories || {},
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// Core generation routine — saves each puzzle immediately as it's generated
// so partial progress is never lost on timeout/error
// ──────────────────────────────────────────────────────────────────────────────
async function runGenerationFor(todayId) {
    const ban = await fetchExistingGroups(todayId)
    const { missing, day15, need15 } = await checkMissingDates(todayId)

    const dateIds = [...missing, ...(need15 ? [day15] : [])]
    if (dateIds.length === 0) {
        console.info('[connectionsGenerate] all dates filled, nothing to do')
        return { filledCount: 0, dates: [] }
    }

    console.info(`[connectionsGenerate] need to fill ${dateIds.length} date(s):`, dateIds)

    let filledCount = 0
    const filled = []

    for (const dateId of dateIds) {
        // Re-check before generating — a concurrent run may have already written this
        const existing = await SOLS_COL().doc(dateId).get()
        if (existing.exists) {
            console.info(`[connectionsGenerate] ${dateId} already filled, skipping`)
            continue
        }

        let puzzle = null
        let attempts = 0
        while (!puzzle && attempts < 3) {
            puzzle = await generatePuzzle(ban)
            attempts++
        }

        if (!puzzle) {
            console.warn(`[connectionsGenerate] failed to generate puzzle for ${dateId} after 3 attempts`)
            continue
        }

        // Save immediately — don't batch everything at the end
        await SOLS_COL().doc(dateId).set(
            {
                answer: puzzle.answer,
                categories: puzzle.categories,
                source: 'ai',
                model: 'gpt-4o',
                createdAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
        )

        // Add new words to ban set so subsequent puzzles in this run avoid them
        Object.values(puzzle.answer).flat().forEach((word) => ban.add(word))

        filledCount++
        filled.push(dateId)
        console.info(`[connectionsGenerate] saved ${dateId} (${filledCount}/${dateIds.length})`)
    }

    return { filledCount, dates: filled }
}

// ──────────────────────────────────────────────────────────────────────────────
// Scheduled: every midnight UTC
//
// retryCount: 0  — this is a best-effort generation job. Retrying blindly on
//                  failure would re-run all the OpenAI calls we just paid for.
//                  If today's run fails, tomorrow's run will catch up.
// timeoutSeconds: 540 — generous headroom for generating up to 15 puzzles
// ──────────────────────────────────────────────────────────────────────────────
export const connectionsGenerateCron = onSchedule(
    {
        schedule: '5 0 * * *',
        timeZone: 'Etc/UTC',
        region: 'australia-southeast1',
        secrets: [OPENAI_API_KEY],
        retryCount: 0,       // ← was 3; retries caused repeated OpenAI spam
        timeoutSeconds: 540, // ← was unset (defaulted to 60s, causing timeouts)
        maxInstances: 1,
    },
    async () => {
        const todayId = toDateId(new Date())
        const result = await runGenerationFor(todayId)
        console.info('[connectionsGenerateCron] done', result)
        return result
    }
)

// ──────────────────────────────────────────────────────────────────────────────
// Admin HTTP trigger for manual generation
// ──────────────────────────────────────────────────────────────────────────────
export const connectionsGenerateNow = onRequest(
    {
        region: REGION,
        secrets: [OPENAI_API_KEY, ADMIN_API_KEY],
        cors: true,
        maxInstances: 1,
        timeoutSeconds: 540,
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

            const startDate = startParam ? parseDateIdUTC(startParam) : today
            let endDate = endParam ? parseDateIdUTC(endParam) : null
            if (!endDate && daysParam) {
                endDate = addDaysUTC(startDate, daysParam)
            }
            if (!endDate) endDate = addDaysUTC(startDate, 1)

            const dateIds = []
            for (let d = startDate; d <= endDate; d = addDaysUTC(d, 1)) {
                dateIds.push(toDateId(d))
            }

            const ban = await fetchExistingGroups(toDateId(today))
            const puzzles = []

            for (const dateId of dateIds) {
                if (!overwrite) {
                    const existing = await SOLS_COL().doc(dateId).get()
                    if (existing.exists) {
                        console.info(`[connectionsGenerateNow] ${dateId} already exists, skipping`)
                        continue
                    }
                }

                let puzzle = null
                let attempts = 0
                while (!puzzle && attempts < 3) {
                    puzzle = await generatePuzzle(ban)
                    attempts++
                }

                if (!puzzle) {
                    console.warn(`[connectionsGenerateNow] failed to generate for ${dateId}`)
                    continue
                }

                // Save immediately
                await SOLS_COL().doc(dateId).set(
                    {
                        answer: puzzle.answer,
                        categories: puzzle.categories,
                        source: 'ai',
                        model: 'gpt-4o',
                        createdAt: FieldValue.serverTimestamp(),
                        overwrite,
                    },
                    { merge: true }
                )

                Object.values(puzzle.answer).flat().forEach((word) => ban.add(word))
                puzzles.push({ dateId, ...puzzle })
            }

            res.status(200).json({
                ok: true,
                range: { start: toDateId(startDate), end: toDateId(endDate) },
                count: puzzles.length,
                puzzles,
                overwrite,
            })
        } catch (e) {
            console.error('[connectionsGenerateNow] error', e)
            res.status(500).json({ error: String(e?.message || e) })
        }
    }
)
