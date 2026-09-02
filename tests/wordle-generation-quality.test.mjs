import test from 'node:test';
import assert from 'node:assert/strict';

import { readFileSync } from 'node:fs';
import {
  isAllowedWordleAnswer,
  storedWordleAnswer,
} from '../functions/dailyGames/wordleQuality.mjs';

test('the Wordle repeat ban reads the answer field used by stored solutions', () => {
  assert.equal(storedWordleAnswer({ answer: 'crane' }), 'CRANE');
  assert.equal(storedWordleAnswer({ word: 'SLATE' }), null);
  assert.equal(storedWordleAnswer({ answer: 'TOO-LONG' }), null);
});

test('generated solutions are accepted by the same dictionary shipped to browsers', () => {
  const browserDictionary = JSON.parse(
    readFileSync(new URL('../public/data/words.json', import.meta.url), 'utf8'),
  );
  const serverDictionary = JSON.parse(
    readFileSync(new URL('../functions/dailyGames/data/words.json', import.meta.url), 'utf8'),
  );

  assert.deepEqual(serverDictionary, browserDictionary);
  assert.equal(isAllowedWordleAnswer('CHAIR'), true);
  assert.equal(isAllowedWordleAnswer('ZZZZZ'), false);
});
