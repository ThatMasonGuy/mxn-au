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
