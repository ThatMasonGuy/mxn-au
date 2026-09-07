import test from 'node:test';
import assert from 'node:assert/strict';

import { readFileSync } from 'node:fs';
import {
  isAllowedWordleAnswer,
  pairWordleSolutions,
  storedWordleAnswer,
  wordleDatesNeedingGeneration,
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

test('manual generation pairs only dates backed by usable returned words', () => {
  assert.deepEqual(
    pairWordleSolutions(
      ['2026-09-03', '2026-09-04', '2026-09-05'],
      ['chair', 'invalid-value'],
    ),
    [{ dateId: '2026-09-03', answer: 'CHAIR' }],
  );
});

test('queued repeats and invalid answers are repaired without changing live or valid puzzles', () => {
  assert.deepEqual(wordleDatesNeedingGeneration('2026-09-07', [
    { dateId: '2026-09-06', answer: 'BRAVE' },
    { dateId: '2026-09-07', answer: 'BRAVE' },
    { dateId: '2026-09-08', answer: ' brave ' },
    { dateId: '2026-09-09', answer: 'CHAIR' },
    { dateId: '2026-09-10', answer: 'CHAIR' },
    { dateId: '2026-09-11', answer: 'ZZZZZ' },
  ], 5), ['2026-09-08', '2026-09-10', '2026-09-11', '2026-09-12']);
});

test('repeat detection uses the 60 days before each queued puzzle', () => {
  assert.deepEqual(wordleDatesNeedingGeneration('2026-09-07', [
    { dateId: '2026-07-10', answer: 'BRAVE' },
    { dateId: '2026-09-08', answer: 'BRAVE' },
    { dateId: '2026-07-09', answer: 'CHAIR' },
    { dateId: '2026-09-09', answer: 'CHAIR' },
  ], 2), ['2026-09-08']);
});
