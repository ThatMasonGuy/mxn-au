import { readFileSync } from 'node:fs';

const dictionaryPayload = JSON.parse(
  readFileSync(new URL('./data/words.json', import.meta.url), 'utf8'),
);
const WORDLE_DICTIONARY = new Set(
  (dictionaryPayload.words || []).map((word) => String(word).trim().toUpperCase()),
);

export function normaliseWordleAnswer(value) {
  const answer = String(value || '').trim().toUpperCase();
  return /^[A-Z]{5}$/.test(answer) ? answer : null;
}

export function storedWordleAnswer(data) {
  return normaliseWordleAnswer(data?.answer);
}

export function isAllowedWordleAnswer(value) {
  const answer = normaliseWordleAnswer(value);
  return answer !== null && WORDLE_DICTIONARY.has(answer);
}

export function pairWordleSolutions(dateIds, words) {
  const usableWords = Array.isArray(words)
    ? words.map(normaliseWordleAnswer).filter(isAllowedWordleAnswer)
    : [];
  return (Array.isArray(dateIds) ? dateIds : [])
    .slice(0, usableWords.length)
    .map((dateId, index) => ({ dateId, answer: usableWords[index] }));
}

// Audit only unpublished dates; live puzzles must keep their original answer.
export function wordleDatesNeedingGeneration(todayId, solutions, days = 15) {
  const dayMs = 86400000;
  const today = Date.parse(`${todayId}T00:00:00Z`);
  const byDate = new Map(solutions.map(solution => [solution.dateId, solution]));
  const pending = [];
  for (let offset = 1; offset <= days; offset++) {
    const timestamp = today + offset * dayMs;
    const dateId = new Date(timestamp).toISOString().slice(0, 10);
    const answer = storedWordleAnswer(byDate.get(dateId));
    const start = new Date(timestamp - 60 * dayMs).toISOString().slice(0, 10);
    const repeated = answer && solutions.some(solution =>
      solution.dateId >= start && solution.dateId < dateId &&
      storedWordleAnswer(solution) === answer);
    if (!isAllowedWordleAnswer(answer) || repeated) pending.push(dateId);
  }
  return pending;
}
