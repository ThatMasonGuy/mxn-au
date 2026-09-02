import test from 'node:test';
import assert from 'node:assert/strict';

import {
  deriveUnlimitedOutcome,
  resolveUnlimitedGameNumber,
  shouldReconcileUnlimitedCloudGame,
} from '../src/features/daily/utils/wordleUnlimitedGame.js';

test('Unlimited derives completion only from a solved row or the sixth miss', () => {
  assert.equal(deriveUnlimitedOutcome(['G', 'G', 'G', 'G', 'G'], 2), 'win');
  assert.equal(deriveUnlimitedOutcome(['B', 'B', 'B', 'B', 'B'], 5), null);
  assert.equal(deriveUnlimitedOutcome(['B', 'B', 'B', 'B', 'B'], 6), 'loss');
});

test('the active Unlimited puzzle keeps its original number after stats update', () => {
  assert.equal(resolveUnlimitedGameNumber({ number: 7 }, 7), 7);
  assert.equal(resolveUnlimitedGameNumber({}, 7), 8);
});

test('a locally completed Unlimited game cannot be replaced by stale cloud progress', () => {
  assert.equal(shouldReconcileUnlimitedCloudGame({ status: 'won' }), false);
  assert.equal(shouldReconcileUnlimitedCloudGame({ status: 'lost' }), false);
  assert.equal(shouldReconcileUnlimitedCloudGame({ status: 'idle' }), true);
  assert.equal(shouldReconcileUnlimitedCloudGame(null), true);
});
