import test from 'node:test';
import assert from 'node:assert/strict';

import { nextMidnightUTCISO } from '../functions/dailyGames/dailyGameClock.mjs';
import { validateCurrentPuzzleId } from '../functions/dailyGames/dailyGameValidation.mjs';

test('the client rollover boundary matches the server puzzle boundary exactly', () => {
  const beforeMidnight = new Date('2026-09-02T23:59:59.999Z');
  const atMidnight = new Date('2026-09-03T00:00:00.000Z');

  assert.equal(nextMidnightUTCISO(beforeMidnight), atMidnight.toISOString());
  assert.equal(
    validateCurrentPuzzleId('wordle-2026-09-02', 'wordle', beforeMidnight).valid,
    true,
  );
  assert.equal(
    validateCurrentPuzzleId('wordle-2026-09-02', 'wordle', atMidnight).valid,
    false,
  );
});
