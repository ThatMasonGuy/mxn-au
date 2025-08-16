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
const REGION = 'australia-southeast1'

// Firestore paths
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
    const startPast = toDateId(addDaysUTC(today, -30)) // Last 30 days
    const endFuture = toDateId(addDaysUTC(today, +365)) // Next year

    // Get past 30 days
    const pastSnap = await SOLS_COL()
        .where('__name__', '>=', startPast)
        .where('__name__', '<=', todayId)
        .get()

    pastSnap.forEach((doc) => {
        const answer = doc.data()?.answer
        if (answer) {
            // Collect all words from all groups
            ['easy', 'medium', 'hard', 'expert'].forEach(level => {
                if (answer[level]) {
                    answer[level].forEach(word => ban.add(word.toUpperCase()))
                }
            })
        }
    })

    // Get future puzzles
    const futureSnap = await SOLS_COL()
        .where('__name__', '>=', todayId)
        .where('__name__', '<=', endFuture)
        .get()

    futureSnap.forEach((doc) => {
        const answer = doc.data()?.answer
        if (answer) {
            ['easy', 'medium', 'hard', 'expert'].forEach(level => {
                if (answer[level]) {
                    answer[level].forEach(word => ban.add(word.toUpperCase()))
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

    // Next 14 days must exist, plus day 15
    const next14 = range(14).map((i) => toDateId(addDaysUTC(today, i + 1)))
    const day15 = toDateId(addDaysUTC(today, 15))

    const snaps = await Promise.all(next14.map((id) => SOLS_COL().doc(id).get()))
    const missing = next14.filter((id, idx) => !snaps[idx].exists)

    const day15Snap = await SOLS_COL().doc(day15).get()
    const need15 = !day15Snap.exists

    return { missing, day15, need15 }
}

// ──────────────────────────────────────────────────────────────────────────────
// Generate Connections puzzle using GPT-4
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
                }`
            },
            {
                role: 'user',
                content: `Create a Connections puzzle with these requirements:
                
DIFFICULTY LEVELS:
- EASY: Obvious connections (colors, animals, common categories)
- MEDIUM: Clear but requires some thought (movie genres, cooking methods)
- HARD: Subtle connections or wordplay (words that can follow "fire", homophones)
- EXPERT: Very tricky, often misleading (words that are also last names, red herrings)

RULES:
1. Each group must have EXACTLY 4 words
2. All words must be UPPERCASE, single words (no phrases)
3. Words should be 3-10 letters long typically
4. NO word can appear in multiple groups
5. Include red herrings - words that seem like they could fit in multiple groups
6. Make expert group especially tricky with words that seem to belong elsewhere
7. Categories should be interesting and varied

EXCLUDE these already-used words:
${banList}

Create a clever, challenging puzzle that will make players think!`
            }
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

    // Validate structure
    if (!parsed.answer ||
        !parsed.answer.easy || !parsed.answer.medium ||
        !parsed.answer.hard || !parsed.answer.expert) {
        return null
    }

    // Validate each group has 4 words
    for (const level of ['easy', 'medium', 'hard', 'expert']) {
        if (!Array.isArray(parsed.answer[level]) || parsed.answer[level].length !== 4) {
            return null
        }
        // Ensure uppercase and no banned words
        parsed.answer[level] = parsed.answer[level].map(w => w.toUpperCase().trim())
        if (parsed.answer[level].some(w => ban.has(w))) {
            return null
        }
    }

    // Check for duplicates across groups
    const allWords = [
        ...parsed.answer.easy,
        ...parsed.answer.medium,
        ...parsed.answer.hard,
        ...parsed.answer.expert
    ]
    if (new Set(allWords).size !== 16) {
        return null // Has duplicates
    }

    return {
        answer: parsed.answer,
        categories: parsed.categories || {}
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// Save puzzles to Firestore
// ──────────────────────────────────────────────────────────────────────────────
async function upsertSolutions(dateIds, puzzles) {
    const batch = db.batch()

    for (let i = 0; i < dateIds.length && i < puzzles.length; i++) {
        const id = dateIds[i]
        const puzzle = puzzles[i]
        const ref = SOLS_COL().doc(id)
        const snap = await ref.get()

        if (snap.exists) continue // Don't overwrite

        batch.set(
            ref,
            {
                answer: puzzle.answer,
                categories: puzzle.categories,
                source: 'ai',
                model: 'gpt-4o',
                createdAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
        )
    }

    await batch.commit()
}

// ──────────────────────────────────────────────────────────────────────────────
// Core generation routine
// ──────────────────────────────────────────────────────────────────────────────
async function runGenerationFor(todayId) {
    const ban = await fetchExistingGroups(todayId)
    const { missing, day15, need15 } = await checkMissingDates(todayId)

    const dateIds = [...missing, ...(need15 ? [day15] : [])]
    if (dateIds.length === 0) {
        return { filledCount: 0, dates: [], puzzles: [] }
    }

    const puzzles = []
    for (let i = 0; i < dateIds.length; i++) {
        let puzzle = null
        let attempts = 0

        // Try up to 3 times per puzzle
        while (!puzzle && attempts < 3) {
            puzzle = await generatePuzzle(ban)
            attempts++
        }

        if (puzzle) {
            puzzles.push(puzzle)
            // Add new words to ban list
            Object.values(puzzle.answer).flat().forEach(word => ban.add(word))
        }
    }

    await upsertSolutions(dateIds, puzzles)

    return {
        filledCount: puzzles.length,
        dates: dateIds.slice(0, puzzles.length),
        puzzles
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// Scheduled: every midnight UTC
// ──────────────────────────────────────────────────────────────────────────────
export const connectionsGenerateCron = onSchedule(
    {
        schedule: '5 0 * * *', // 5 minutes after midnight UTC
        timeZone: 'Etc/UTC',
        region: REGION,
        secrets: [OPENAI_API_KEY],
        retryCount: 3,
    },
    async () => {
        const todayId = toDateId(new Date())
        const result = await runGenerationFor(todayId)
        console.info('[connectionsGenerateCron] generated', result)
        return result
    }
)

// ──────────────────────────────────────────────────────────────────────────────
// Admin HTTP trigger for manual generation
// ──────────────────────────────────────────────────────────────────────────────
export const connectionsGenerateNow = onRequest(
    { region: REGION, secrets: [OPENAI_API_KEY, ADMIN_API_KEY], cors: true },
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

            // Figure out date range
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

            // Generate puzzles
            const ban = await fetchExistingGroups(toDateId(today))
            const puzzles = []

            for (const dateId of dateIds) {
                let puzzle = null
                let attempts = 0

                while (!puzzle && attempts < 3) {
                    puzzle = await generatePuzzle(ban)
                    attempts++
                }

                if (puzzle) {
                    puzzles.push(puzzle)
                    Object.values(puzzle.answer).flat().forEach(word => ban.add(word))
                }
            }

            // Save to Firestore
            const batch = db.batch()
            for (let i = 0; i < dateIds.length && i < puzzles.length; i++) {
                const ref = SOLS_COL().doc(dateIds[i])

                if (!overwrite) {
                    const snap = await ref.get()
                    if (snap.exists) continue
                }

                batch.set(
                    ref,
                    {
                        answer: puzzles[i].answer,
                        categories: puzzles[i].categories,
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