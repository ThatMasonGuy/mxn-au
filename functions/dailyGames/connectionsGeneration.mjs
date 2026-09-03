import { CONNECTION_DIFFICULTIES, validateConnectionsPuzzle } from './connectionsQuality.mjs';

export const CONNECTIONS_MODEL = 'gpt-5.6-terra';
export const CONNECTIONS_REVIEW_MODEL = 'gpt-5.6-terra';
const objectSchema = (properties) => ({
  type: 'object', properties, required: Object.keys(properties), additionalProperties: false,
});
const puzzleSchema = objectSchema({
  answer: objectSchema(Object.fromEntries(CONNECTION_DIFFICULTIES.map(level => [level, {
    type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4,
  }]))),
  categories: objectSchema(Object.fromEntries(CONNECTION_DIFFICULTIES.map(level => [level, { type: 'string' }]))),
});
const reviewSchema = objectSchema({
  pass: { type: 'boolean' },
  reasons: { type: 'array', items: { type: 'string' } },
});

const qualityRequirements = `Every group must have a precise, defensible inferential connection: phrase completion, wordplay, or semantic ambiguity.
No elementary lookup sets, simple member lists, or vague thematic associations. Do not use lists of colours, fruit, directions, Greek letters, planets, seasons, months, days, animals, shapes, professions or equipment.
EASY is approachable inference; MEDIUM is a less obvious connection; HARD and EXPERT must be materially harder, with subtle wordplay or multiple meanings.
At least 10 distinct words must participate in plausible cross-group red-herring clusters on THIS board. A lure can be a tempting partial set of two or three words drawn from different intended groups; it need not fit another final category label. An unrelated secondary dictionary meaning alone is not a distraction.
All 16 words are unique, single English words of 3-10 ASCII letters, uppercase. Four words per group. Category titles must be precise and no longer than 100 characters.
Check the exact phrase or linguistic operation for every member. Reject forced phrases and alternative COMPLETE four-group partitions. Individual words may fit more than one category: that is a valid red herring, not proof of multiple solutions. For an ambiguity rejection, demonstrate a full alternative partition using all 16 words exactly once.
Judge difficulty from the shuffled words BEFORE revealing the category titles. A short explanation can conceal a subtle connection; do not mistake simplicity after the reveal for ease of discovery.`;

function parseCompletion(completion) {
  if (completion?.status !== 'completed') return null;
  try { return JSON.parse(completion.output_text); } catch { return null; }
}

// Inject the API boundary so rejection/revision behaviour can be tested without network calls.
export async function generateConnectionsPuzzle({ client, bannedWords = [], maxAttempts = 4, signal, onAttempt = () => {} }) {
  const ban = new Set(Array.from(bannedWords, word => String(word).trim().toUpperCase()));
  const messages = [
    { role: 'system', content: `Design an original, expert Connections puzzle. ${qualityRequirements}
Build interlocking categories together, not four independent lists. Before returning the board, verify all phrases and plausible cross-group distractions.
Start from overlapping everyday meanings and familiar expressions. Mix category mechanisms; do not make every category an arbitrary letter addition or removal. Internally map at least 10 distinct entries to a specific misleading group or competing cluster on the board, then check that the intended partition remains unique.
When an editor rejects a draft, revise that draft using the specific feedback. Replace whole categories if needed; do not repeat the rejected design.` },
    { role: 'user', content: `Return answer and categories keyed by easy, medium, hard, expert.
NONE of these previously used words may appear (this is the COMPLETE exclusion list):
${JSON.stringify([...ban].sort())}` },
  ];
  const attempts = Math.min(Math.max(Number.isInteger(maxAttempts) ? maxAttempts : 4, 1), 6);
  let reasons = [];
  for (let attempt = 1; attempt <= attempts; attempt++) {
    signal?.throwIfAborted();
    const completion = await client.responses.create({
      model: CONNECTIONS_MODEL, input: structuredClone(messages), store: false,
      reasoning: { effort: 'low' }, max_output_tokens: 8000,
      text: { format: { type: 'json_schema', name: 'connections_puzzle', strict: true, schema: puzzleSchema } },
    }, { signal });
    const draft = parseCompletion(completion);
    if (!draft) {
      reasons = ['The response was incomplete or invalid JSON. Produce a complete puzzle within the response budget.'];
      onAttempt({ attempt, accepted: false, reasons });
      messages.splice(2, messages.length - 2, { role: 'user', content: reasons[0] });
      continue;
    }
    const validation = validateConnectionsPuzzle(draft?.answer, draft?.categories, { bannedWords: ban });
    let review = null;
    if (validation.valid) {
      // Independent editor receives the board, not the author's claims or previous reviews.
      review = parseCompletion(await client.responses.create({
        model: CONNECTIONS_REVIEW_MODEL, store: false, reasoning: { effort: 'medium' }, max_output_tokens: 6000,
        input: [
          { role: 'system', content: `You are a strict independent Connections editor. ${qualityRequirements}
Check every condition independently. When uncertain, reject. Give concrete defects and actionable corrections; do not rewrite the board. Pass only when ALL conditions hold, with an empty reasons array. Common closed compounds and spaced phrases both count for phrase completion.` },
          { role: 'user', content: JSON.stringify({ answer: validation.answer, categories: validation.categories }) },
        ],
        text: { format: { type: 'json_schema', name: 'connections_review', strict: true, schema: reviewSchema } },
      }, { signal }));
      if (review?.pass === true && Array.isArray(review.reasons) && review.reasons.length === 0) {
        onAttempt({ attempt, accepted: true });
        return { puzzle: { answer: validation.answer, categories: validation.categories }, attempts: attempt, reasons: [] };
      }
      reasons = review?.reasons?.length ? review.reasons : ['Independent quality review did not approve the puzzle.'];
    } else {
      reasons = [validation.reason];
      if (validation.reason === 'reused_word') {
        const reused = Object.values(draft?.answer || {}).flat().filter(word => ban.has(String(word).trim().toUpperCase()));
        reasons.push(`Replace these banned words and repair their categories: ${[...new Set(reused)].join(', ')}`);
      }
    }
    onAttempt({ attempt, accepted: false, reasons });
    // Keep the last draft and its feedback, plus the complete original constraints.
    messages.splice(2, messages.length - 2,
      { role: 'assistant', content: JSON.stringify(draft || {}) },
      { role: 'user', content: `Rejected: ${JSON.stringify(reasons)}. Revise the puzzle to fix every defect. All original rules and exclusions still apply.` },
    );
  }
  return { puzzle: null, attempts, reasons };
}

export function shouldGenerateConnectionsPuzzle(existing, dateId, todayId, { overwrite = false } = {}) {
  if (dateId < todayId) return false;
  if (!existing) return true;
  // Once today's board has been served, even anonymous players can have progress.
  if (dateId === todayId) return false;
  return overwrite || existing.wasFallbackSeed === true
    || !validateConnectionsPuzzle(existing.answer, existing.categories).valid;
}

export async function saveConnectionsPuzzle({ db, ref, dateId, data, overwrite = false, now = () => new Date() }) {
  return db.runTransaction(async tx => {
    const snapshot = await tx.get(ref);
    if (!shouldGenerateConnectionsPuzzle(snapshot.exists ? snapshot.data() : null, dateId, now().toISOString().slice(0, 10), { overwrite })) return false;
    // Replace stale fallback metadata as well as its words. Never merge a fallback flag into an AI puzzle.
    tx.set(ref, data);
    return true;
  });
}

// The manual and scheduled functions have separate instance limits, so share a lease.
export async function withConnectionsGenerationLease({ db, ref, owner, run, now = () => Date.now() }) {
  const acquired = await db.runTransaction(async tx => {
    const snapshot = await tx.get(ref);
    if (snapshot.exists && snapshot.data().expiresAt > now()) return false;
    tx.set(ref, { owner, expiresAt: now() + 600000 });
    return true;
  });
  if (!acquired) return { busy: true };
  try { return await run(); }
  finally {
    await db.runTransaction(async tx => {
      const snapshot = await tx.get(ref);
      if (snapshot.exists && snapshot.data().owner === owner) tx.delete(ref);
    });
  }
}

export async function claimConnectionsGenerationBudget({ db, ref, day, limit = 10 }) {
  return db.runTransaction(async tx => {
    const snapshot = await tx.get(ref);
    const previous = snapshot.exists ? snapshot.data() : {};
    const started = previous.day === day && Number.isInteger(previous.started) ? previous.started : 0;
    if (started >= limit) return false;
    tx.set(ref, { day, started: started + 1 });
    return true;
  });
}
