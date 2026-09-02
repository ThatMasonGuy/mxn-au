import test from 'node:test';
import assert from 'node:assert/strict';

import { storedWordleAnswer } from '../functions/dailyGames/wordleQuality.mjs';

test('the Wordle repeat ban reads the answer field used by stored solutions', () => {
  assert.equal(storedWordleAnswer({ answer: 'crane' }), 'CRANE');
  assert.equal(storedWordleAnswer({ word: 'SLATE' }), null);
  assert.equal(storedWordleAnswer({ answer: 'TOO-LONG' }), null);
});
