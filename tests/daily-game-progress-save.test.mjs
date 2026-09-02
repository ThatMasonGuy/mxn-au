import test from 'node:test';
import assert from 'node:assert/strict';

import { validateDailyGameProgress } from '../functions/dailyGames/dailyGameProgress.mjs';

test('daily progress accepts bounded state for every playable game', () => {
  const fixtures = [
    {
      game: 'wordle',
      date: '2026-09-02',
      state: { guesses: ['CRANE'], outcome: 'in_progress' },
      path: 'dailyChallenges/wordle/days/2026-09-02',
    },
    {
      game: 'connections',
      date: '2026-09-02',
      state: {
        foundGroups: [{ difficulty: 'easy', words: ['SHIFT', 'OWL', 'CAP', 'LIGHT'], title: 'NIGHT ___', foundAt: 1 }],
        mistakes: 1,
        attempts: { attempt_1: ['CAP', 'LIGHT', 'OWL', 'SHIFT'] },
        outcome: 'in_progress',
      },
      path: 'dailyChallenges/connections/days/2026-09-02',
    },
    {
      game: 'flag',
      date: '2026-09-02',
      state: {
        answers: [],
        score: 0,
        lives: 2,
        currentFlagIndex: 0,
        allAttempts: [{ flagIndex: 0, country: 'Australia', guess: 'Austria', correct: false, hint: null, timestamp: 1 }],
        outcome: 'in_progress',
      },
      path: 'dailyChallenges/flag/days/2026-09-02',
    },
    {
      game: 'wordle-unlimited',
      word: 'CHAIR',
      state: { guesses: ['CRANE'], masks: ['GYGBB'], attempts: 1, outcome: 'in_progress' },
      path: 'dailyChallenges/wordle-unlimited/games/CHAIR',
    },
  ];

  for (const fixture of fixtures) {
    const result = validateDailyGameProgress(fixture);
    assert.equal(result.valid, true);
    assert.equal(result.path, fixture.path);
  }
});

test('daily progress cannot choose another user path or save unbounded data', () => {
  assert.deepEqual(
    validateDailyGameProgress({ game: '../../users/other-user', date: '2026-09-02', state: {} }),
    { valid: false, reason: 'invalid_game' },
  );
  assert.deepEqual(
    validateDailyGameProgress({
      game: 'wordle',
      date: 'not-a-date',
      state: { guesses: ['CRANE'], outcome: 'in_progress' },
    }),
    { valid: false, reason: 'invalid_date' },
  );
  assert.deepEqual(
    validateDailyGameProgress({
      game: 'wordle',
      date: '2026-09-02',
      state: { guesses: Array(7).fill('CRANE'), outcome: 'in_progress' },
    }),
    { valid: false, reason: 'invalid_state' },
  );
});
