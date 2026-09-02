import test from 'node:test';
import assert from 'node:assert/strict';

import { CURATED_CONNECTIONS_FALLBACK } from '../functions/dailyGames/connectionsQuality.mjs';
import {
  gradeWordleGuess,
  validateConnectionsCompletion,
  validateCurrentPuzzleId,
  validateFlagleCompletion,
  validateUnlimitedCompletion,
  validateWordleCompletion,
} from '../functions/dailyGames/dailyGameValidation.mjs';

const NOW = new Date('2026-09-02T10:00:00.000Z');

test('daily puzzle IDs must identify the current UTC puzzle exactly', () => {
  assert.deepEqual(validateCurrentPuzzleId('wordle-2026-09-02', 'wordle', NOW), {
    valid: true,
    date: '2026-09-02',
  });
  assert.deepEqual(validateCurrentPuzzleId('wordle-2026-09-01', 'wordle', NOW), {
    valid: false,
    reason: 'invalid_or_stale_puzzle',
  });
});

test('Wordle accepts only a genuine terminal win or six-row loss', () => {
  const win = validateWordleCompletion({
    puzzleId: 'wordle-2026-09-02',
    guesses: ['CRANE', 'CHAOS'],
    outcome: 'win',
    answer: 'CHAOS',
    now: NOW,
  });
  const prematureLoss = validateWordleCompletion({
    puzzleId: 'wordle-2026-09-02',
    guesses: ['CRANE'],
    outcome: 'loss',
    answer: 'CHAOS',
    now: NOW,
  });

  assert.equal(win.valid, true);
  assert.equal(win.solvedAt, 2);
  assert.deepEqual(prematureLoss, { valid: false, reason: 'game_not_complete' });
});

test('Connections requires the actual four solution groups and coherent attempts', () => {
  const answer = CURATED_CONNECTIONS_FALLBACK.answer;
  const foundGroups = ['easy', 'medium', 'hard', 'expert'].map((difficulty) => ({
    difficulty,
    words: [...answer[difficulty]],
  }));
  const attempts = foundGroups.map((group) => [...group.words]);
  const valid = validateConnectionsCompletion({
    puzzleId: 'connections-2026-09-02',
    foundGroups,
    mistakes: 0,
    attempts,
    outcome: 'win',
    answer,
    now: NOW,
  });
  const forged = validateConnectionsCompletion({
    puzzleId: 'connections-2026-09-02',
    foundGroups: foundGroups.map((group, index) => index === 0
      ? { ...group, words: [...answer.medium] }
      : group),
    mistakes: 0,
    attempts,
    outcome: 'win',
    answer,
    now: NOW,
  });

  assert.equal(valid.valid, true);
  assert.equal(forged.reason, 'found_group_mismatch');
});

test('Flagle recomputes correctness and score from the ordered attempt history', () => {
  const countries = ['United States', 'United Kingdom', 'France', 'Germany', 'Japan'];
  const guesses = ['USA', 'UK', 'France', 'Germany', 'Japan'];
  const allAttempts = countries.map((country, flagIndex) => ({
    flagIndex,
    country,
    guess: guesses[flagIndex],
    correct: true,
  }));
  const answers = countries.map((country, flagIndex) => ({
    country,
    guess: guesses[flagIndex],
    correct: true,
    skipped: false,
  }));
  const valid = validateFlagleCompletion({
    puzzleId: 'flagle-2026-09-02',
    answers,
    allAttempts,
    score: 300,
    outcome: 'win',
    countries,
    now: NOW,
  });
  const forgedScore = validateFlagleCompletion({
    puzzleId: 'flagle-2026-09-02',
    answers,
    allAttempts,
    score: 280,
    outcome: 'win',
    countries,
    now: NOW,
  });

  assert.equal(valid.valid, true);
  assert.equal(valid.correctCount, 5);
  assert.equal(forgedScore.reason, 'score_mismatch');
});

test('Unlimited validates every mask and only accepts a terminal game', () => {
  const guesses = ['CRANE', 'CHAOS'];
  const masks = guesses.map((guess) => gradeWordleGuess(guess, 'CHAOS').join(''));
  const valid = validateUnlimitedCompletion({
    word: 'CHAOS',
    outcome: 'win',
    attempts: 2,
    guesses,
    masks,
  });
  const forgedMask = validateUnlimitedCompletion({
    word: 'CHAOS',
    outcome: 'win',
    attempts: 2,
    guesses,
    masks: ['GGGGG', 'GGGGG'],
  });

  assert.equal(valid.valid, true);
  assert.equal(forgedMask.reason, 'mask_mismatch');
});
