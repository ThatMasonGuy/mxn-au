import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CURATED_CONNECTIONS_FALLBACK,
  validateConnectionsPuzzle,
} from '../functions/dailyGames/connectionsQuality.mjs';

test('the curated fallback passes the same quality gate as generated puzzles', () => {
  const result = validateConnectionsPuzzle(
    CURATED_CONNECTIONS_FALLBACK.answer,
    CURATED_CONNECTIONS_FALLBACK.categories,
  );

  assert.equal(result.valid, true);
  assert.deepEqual(result.answer.easy, ['SHIFT', 'OWL', 'CAP', 'LIGHT']);
});

test('legacy trivial groups are rejected even when their category is disguised', () => {
  const result = validateConnectionsPuzzle({
    ...CURATED_CONNECTIONS_FALLBACK.answer,
    easy: ['BANANA', 'ORANGE', 'APPLE', 'GRAPE'],
  }, {
    ...CURATED_CONNECTIONS_FALLBACK.categories,
    easy: 'Things from the market',
  });

  assert.deepEqual(result, { valid: false, reason: 'legacy_trivial_group' });
});

test('elementary word sets are rejected even with new words and a disguised title', () => {
  const result = validateConnectionsPuzzle({
    ...CURATED_CONNECTIONS_FALLBACK.answer,
    easy: ['PEAR', 'PEACH', 'MELON', 'PLUM'],
  }, {
    ...CURATED_CONNECTIONS_FALLBACK.categories,
    easy: 'Things from an orchard',
  });

  assert.deepEqual(result, { valid: false, reason: 'elementary_word_set' });
});

test('elementary and generic category titles are rejected', () => {
  const elementary = validateConnectionsPuzzle(
    CURATED_CONNECTIONS_FALLBACK.answer,
    { ...CURATED_CONNECTIONS_FALLBACK.categories, easy: 'Colours' },
  );
  const generic = validateConnectionsPuzzle(
    CURATED_CONNECTIONS_FALLBACK.answer,
    { ...CURATED_CONNECTIONS_FALLBACK.categories, easy: 'Straightforward' },
  );

  assert.equal(elementary.reason, 'trivial_category');
  assert.equal(generic.reason, 'generic_category');
});

test('words must be unique across all four groups', () => {
  const result = validateConnectionsPuzzle({
    ...CURATED_CONNECTIONS_FALLBACK.answer,
    expert: ['SHIFT', 'PERFECT', 'FEVER', 'ROOF'],
  }, CURATED_CONNECTIONS_FALLBACK.categories);

  assert.deepEqual(result, { valid: false, reason: 'duplicate_words' });
});

test('previously used words are rejected', () => {
  const result = validateConnectionsPuzzle(
    CURATED_CONNECTIONS_FALLBACK.answer,
    CURATED_CONNECTIONS_FALLBACK.categories,
    { bannedWords: new Set(['score']) },
  );

  assert.deepEqual(result, { valid: false, reason: 'reused_word' });
});
