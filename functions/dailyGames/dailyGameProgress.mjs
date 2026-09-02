import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config/firebase.mjs';

const REGION = 'australia-southeast2';
const OUTCOMES = new Set(['in_progress', 'win', 'loss']);
const CONNECTION_DIFFICULTIES = new Set(['easy', 'medium', 'hard', 'expert']);

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isWord = (value) => typeof value === 'string' && /^[A-Z]{3,10}$/.test(value);
const isGuess = (value) => typeof value === 'string' && /^[A-Z]{5}$/.test(value);
const isOutcome = (value) => OUTCOMES.has(value);
const isBoundedInteger = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;

function validateWordleState(state) {
  if (!isPlainObject(state) || !isOutcome(state.outcome)) return null;
  if (!Array.isArray(state.guesses) || state.guesses.length > 6 || !state.guesses.every(isGuess)) return null;
  return { guesses: state.guesses, outcome: state.outcome };
}

function validateConnectionsState(state) {
  if (!isPlainObject(state) || !isOutcome(state.outcome)) return null;
  if (!isBoundedInteger(state.mistakes, 0, 4)) return null;
  if (!Array.isArray(state.foundGroups) || state.foundGroups.length > 4) return null;
  if (!isPlainObject(state.attempts) || Object.keys(state.attempts).length > 8) return null;

  const foundGroups = state.foundGroups.map((group) => {
    if (!isPlainObject(group) || !CONNECTION_DIFFICULTIES.has(group.difficulty)) return null;
    if (!Array.isArray(group.words) || group.words.length !== 4 || !group.words.every(isWord)) return null;
    if (typeof group.title !== 'string' || group.title.length < 1 || group.title.length > 100) return null;
    if (!Number.isFinite(group.foundAt)) return null;
    return {
      difficulty: group.difficulty,
      words: group.words,
      title: group.title,
      foundAt: group.foundAt,
    };
  });
  if (foundGroups.includes(null)) return null;

  const attempts = {};
  for (const [key, words] of Object.entries(state.attempts)) {
    if (!/^attempt_[1-8]$/.test(key)) return null;
    if (!Array.isArray(words) || words.length !== 4 || !words.every(isWord)) return null;
    attempts[key] = words;
  }

  return {
    foundGroups,
    mistakes: state.mistakes,
    attempts,
    outcome: state.outcome,
  };
}

function validateFlagleState(state) {
  if (!isPlainObject(state) || !isOutcome(state.outcome)) return null;
  if (!isBoundedInteger(state.score, 0, 300)) return null;
  if (!isBoundedInteger(state.lives, 0, 3)) return null;
  if (!isBoundedInteger(state.currentFlagIndex, 0, 5)) return null;
  if (!Array.isArray(state.answers) || state.answers.length > 5) return null;
  if (!Array.isArray(state.allAttempts) || state.allAttempts.length > 8) return null;

  const answers = state.answers.map((answer) => {
    if (!isPlainObject(answer) || typeof answer.country !== 'string' || answer.country.length > 80) return null;
    if (typeof answer.guess !== 'string' || answer.guess.length > 80) return null;
    if (typeof answer.correct !== 'boolean' || typeof answer.skipped !== 'boolean') return null;
    return {
      country: answer.country,
      guess: answer.guess,
      correct: answer.correct,
      skipped: answer.skipped,
    };
  });
  if (answers.includes(null)) return null;

  const allAttempts = state.allAttempts.map((attempt) => {
    if (!isPlainObject(attempt) || !isBoundedInteger(attempt.flagIndex, 0, 4)) return null;
    if (typeof attempt.country !== 'string' || attempt.country.length > 80) return null;
    if (typeof attempt.guess !== 'string' || attempt.guess.length > 80) return null;
    if (typeof attempt.correct !== 'boolean' || !Number.isFinite(attempt.timestamp)) return null;
    const hint = attempt.hint === null || attempt.hint === undefined ? null : attempt.hint;
    if (hint !== null && !isPlainObject(hint)) return null;
    return {
      flagIndex: attempt.flagIndex,
      country: attempt.country,
      guess: attempt.guess,
      correct: attempt.correct,
      hint,
      timestamp: attempt.timestamp,
    };
  });
  if (allAttempts.includes(null)) return null;

  return {
    answers,
    score: state.score,
    lives: state.lives,
    currentFlagIndex: state.currentFlagIndex,
    allAttempts,
    outcome: state.outcome,
  };
}

function validateUnlimitedState(state, word) {
  if (!isPlainObject(state) || !isOutcome(state.outcome)) return null;
  if (!Array.isArray(state.guesses) || state.guesses.length > 6 || !state.guesses.every(isGuess)) return null;
  if (!Array.isArray(state.masks) || state.masks.length !== state.guesses.length) return null;
  if (!state.masks.every((mask) => typeof mask === 'string' && /^[GYB]{5}$/.test(mask))) return null;
  if (!isBoundedInteger(state.attempts, 0, 6)) return null;
  return {
    word,
    guesses: state.guesses,
    masks: state.masks,
    outcome: state.outcome,
    attempts: state.attempts,
  };
}

export function validateDailyGameProgress({ game, date, word, state } = {}) {
  if (!['wordle', 'connections', 'flag', 'wordle-unlimited'].includes(game)) {
    return { valid: false, reason: 'invalid_game' };
  }

  let path;
  let cleanState;
  if (game === 'wordle-unlimited') {
    const normalisedWord = String(word || '').trim().toUpperCase();
    if (!isGuess(normalisedWord)) return { valid: false, reason: 'invalid_word' };
    path = `dailyChallenges/wordle-unlimited/games/${normalisedWord}`;
    cleanState = validateUnlimitedState(state, normalisedWord);
  } else {
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { valid: false, reason: 'invalid_date' };
    }
    path = `dailyChallenges/${game}/days/${date}`;
    if (game === 'wordle') cleanState = validateWordleState(state);
    if (game === 'connections') cleanState = validateConnectionsState(state);
    if (game === 'flag') cleanState = validateFlagleState(state);
  }

  if (!cleanState) return { valid: false, reason: 'invalid_state' };
  return { valid: true, path, state: cleanState };
}

export const saveDailyGameProgress = onCall(
  { region: REGION, maxInstances: 4 },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) throw new HttpsError('unauthenticated', 'Authentication required');

    const validation = validateDailyGameProgress(request.data);
    if (!validation.valid) throw new HttpsError('invalid-argument', validation.reason);

    await db.doc(`users/${uid}/${validation.path}`).set({
      ...validation.state,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    return { success: true };
  },
);
