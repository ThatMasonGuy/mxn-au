import test from 'node:test';
import assert from 'node:assert/strict';

import { validateDailyGameReset } from '../functions/dailyGames/dailyGameReset.mjs';

const TODAY = new Date('2026-09-02T14:00:00.000Z');

test('accepts a current-day reset for a supported daily game', () => {
  assert.deepEqual(validateDailyGameReset({ game: 'flag', date: '2026-09-02' }, TODAY), {
    valid: true,
    game: 'flag',
    date: '2026-09-02',
    path: 'dailyChallenges/flag/days/2026-09-02',
  });
});

test('rejects resets for a previous day', () => {
  assert.deepEqual(validateDailyGameReset({ game: 'wordle', date: '2026-09-01' }, TODAY), {
    valid: false,
    reason: 'invalid_or_stale_date',
  });
});

test('rejects unsupported and path-like game identifiers', () => {
  assert.deepEqual(validateDailyGameReset({ game: '../profiles', date: '2026-09-02' }, TODAY), {
    valid: false,
    reason: 'invalid_game',
  });
});
