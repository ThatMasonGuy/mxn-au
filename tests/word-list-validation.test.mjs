import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isAllowedFiveLetterGuess,
  parseAllowedFiveLetterWords,
} from '../src/features/daily/utils/wordList.js';

test('word-list payloads are normalised to five-letter words only', () => {
  const words = parseAllowedFiveLetterWords({ words: ['Crane', 'CHAOS', 'four', 'too-long', 42] });

  assert.deepEqual([...words], ['crane', 'chaos']);
});

test('guess validation fails closed until a usable word list exists', () => {
  assert.equal(isAllowedFiveLetterGuess('ZZZZZ', null), false);
  assert.equal(isAllowedFiveLetterGuess('CRANE', new Set(['crane'])), true);
  assert.equal(isAllowedFiveLetterGuess('ZZZZZ', new Set(['crane'])), false);
});
