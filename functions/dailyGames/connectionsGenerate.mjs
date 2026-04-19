// functions/src/daily/connectionsGenerate.mjs
import { onSchedule } from "firebase-functions/v2/scheduler";
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { FieldValue } from "firebase-admin/firestore";
import OpenAI from "openai";
import { db } from "../config/firebase.mjs";

// ──────────────────────────────────────────────────────────────────────────────
// Secrets
// ──────────────────────────────────────────────────────────────────────────────
const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");
const ADMIN_API_KEY = defineSecret("ADMIN_API_KEY");

let _openai = null;
function openai() {
  if (!_openai) _openai = new OpenAI({ apiKey: OPENAI_API_KEY.value() });
  return _openai;
}

// ──────────────────────────────────────────────────────────────────────────────
// Constants & helpers
// ──────────────────────────────────────────────────────────────────────────────
const REGION = "australia-southeast2";

const SOLS_COL = () =>
  db.collection("dailyChallenges").doc("connections").collection("solutions");

const toDateId = (d) => d.toISOString().slice(0, 10); // UTC YYYY-MM-DD
const atUTC = (y, m, d) => new Date(Date.UTC(y, m, d));
const parseDateIdUTC = (id) => {
  const [y, m, d] = id.split("-").map(Number);
  return atUTC(y, m - 1, d);
};
const addDaysUTC = (date, n) =>
  atUTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + n);

// ──────────────────────────────────────────────────────────────────────────────
// Fetch existing puzzles to avoid duplicates
// ──────────────────────────────────────────────────────────────────────────────
async function fetchExistingGroups(todayId) {
  const ban = new Set();

  const today = parseDateIdUTC(todayId);
  const startPast = toDateId(addDaysUTC(today, -30));
  const endFuture = toDateId(addDaysUTC(today, +365));

  const pastSnap = await SOLS_COL()
    .where("__name__", ">=", startPast)
    .where("__name__", "<=", todayId)
    .get();

  pastSnap.forEach((doc) => {
    const answer = doc.data()?.answer;
    if (answer) {
      ["easy", "medium", "hard", "expert"].forEach((level) => {
        if (answer[level]) {
          answer[level].forEach((word) => ban.add(word.toUpperCase()));
        }
      });
    }
  });

  const futureSnap = await SOLS_COL()
    .where("__name__", ">=", todayId)
    .where("__name__", "<=", endFuture)
    .get();

  futureSnap.forEach((doc) => {
    const answer = doc.data()?.answer;
    if (answer) {
      ["easy", "medium", "hard", "expert"].forEach((level) => {
        if (answer[level]) {
          answer[level].forEach((word) => ban.add(word.toUpperCase()));
        }
      });
    }
  });

  return ban;
}

// ──────────────────────────────────────────────────────────────────────────────
// Generate Connections puzzle using GPT-4o
// ──────────────────────────────────────────────────────────────────────────────
async function generatePuzzle(ban) {
  const client = openai();

  const banList = Array.from(ban).slice(0, 500).join(", ");

  const comp = await client.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
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
        role: "user",
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
  });

  let parsed = {};
  try {
    parsed = JSON.parse(comp.choices?.[0]?.message?.content || "{}");
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    return null;
  }

  if (
    !parsed.answer ||
    !parsed.answer.easy ||
    !parsed.answer.medium ||
    !parsed.answer.hard ||
    !parsed.answer.expert
  ) {
    return null;
  }

  for (const level of ["easy", "medium", "hard", "expert"]) {
    if (
      !Array.isArray(parsed.answer[level]) ||
      parsed.answer[level].length !== 4
    ) {
      return null;
    }
    parsed.answer[level] = parsed.answer[level].map((w) =>
      w.toUpperCase().trim(),
    );
    if (parsed.answer[level].some((w) => ban.has(w))) {
      return null;
    }
  }

  const allWords = [
    ...parsed.answer.easy,
    ...parsed.answer.medium,
    ...parsed.answer.hard,
    ...parsed.answer.expert,
  ];
  if (new Set(allWords).size !== 16) {
    return null;
  }

  return {
    answer: parsed.answer,
    categories: parsed.categories || {},
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Core generation routine — only generates ONE puzzle for ONE date
// ──────────────────────────────────────────────────────────────────────────────
async function runGenerationFor(dateId, { overwrite = false } = {}) {
  const ref = SOLS_COL().doc(dateId);

  if (!overwrite) {
    const existing = await ref.get();
    if (existing.exists) {
      console.info(`[connectionsGenerate] ${dateId} already exists, skipping`);
      return { filledCount: 0, dates: [], skipped: true };
    }
  }

  const ban = await fetchExistingGroups(dateId);

  let puzzle = null;
  let attempts = 0;
  while (!puzzle && attempts < 3) {
    puzzle = await generatePuzzle(ban);
    attempts++;
  }

  if (!puzzle) {
    console.warn(
      `[connectionsGenerate] failed to generate puzzle for ${dateId} after 3 attempts`,
    );
    return { filledCount: 0, dates: [], skipped: false, failed: true };
  }

  await ref.set(
    {
      answer: puzzle.answer,
      categories: puzzle.categories,
      source: "ai",
      model: "gpt-4o",
      createdAt: FieldValue.serverTimestamp(),
      overwrite,
    },
    { merge: true },
  );

  console.info(`[connectionsGenerate] saved ${dateId}`);
  return { filledCount: 1, dates: [dateId], skipped: false, failed: false };
}

// ──────────────────────────────────────────────────────────────────────────────
// Scheduled: every midnight UTC
//
// retryCount: 0  — this is a best-effort generation job. Retrying blindly on
//                  failure would re-run the OpenAI call we just paid for.
// timeoutSeconds: 120 — one puzzle does not need 9 business days.
// ──────────────────────────────────────────────────────────────────────────────
export const connectionsGenerateCron = onSchedule(
  {
    schedule: "5 0 * * *",
    timeZone: "Etc/UTC",
    region: "australia-southeast1",
    secrets: [OPENAI_API_KEY],
    retryCount: 0,
    timeoutSeconds: 120,
    maxInstances: 1,
  },
  async () => {
    const todayId = toDateId(new Date());
    const result = await runGenerationFor(todayId);
    console.info("[connectionsGenerateCron] done", result);
    return result;
  },
);

// ──────────────────────────────────────────────────────────────────────────────
// Admin HTTP trigger for manual generation
// Default = today only
// Optional query params:
//   ?date=YYYY-MM-DD
//   ?overwrite=true
// ──────────────────────────────────────────────────────────────────────────────
export const connectionsGenerateNow = onRequest(
  {
    region: REGION,
    secrets: [OPENAI_API_KEY, ADMIN_API_KEY],
    cors: true,
    maxInstances: 1,
    timeoutSeconds: 120,
  },
  async (req, res) => {
    try {
      const key =
        req.header("x-admin-key") || req.header("X-Admin-Key") || req.query.key;
      if (!key || String(key) !== ADMIN_API_KEY.value()) {
        return res.status(401).json({ error: "unauthorized" });
      }

      const overwrite = req.query.overwrite === "true";
      const targetDate = req.query.date
        ? String(req.query.date)
        : toDateId(new Date());

      const result = await runGenerationFor(targetDate, { overwrite });

      return res.status(200).json({
        ok: true,
        date: targetDate,
        overwrite,
        ...result,
      });
    } catch (e) {
      console.error("[connectionsGenerateNow] error", e);
      return res.status(500).json({ error: String(e?.message || e) });
    }
  },
);
