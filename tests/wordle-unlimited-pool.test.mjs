import test from 'node:test'
import assert from 'node:assert/strict'

import {
  normaliseUnlimitedWordRequest,
  selectUnplayedWordIds,
} from '../functions/dailyGames/wordleUnlimitedPool.mjs'

test('Unlimited word requests stay bounded and normalise exclusions', () => {
  assert.deepEqual(normaliseUnlimitedWordRequest({
    requestCount: 10000,
    excludeWords: ['chair', 'CHAIR', 'bad-value'],
  }), {
    requestCount: 100,
    excludeWords: ['CHAIR'],
  })
})

test('Unlimited pool selection excludes only played candidates without a history scan', () => {
  assert.deepEqual(selectUnplayedWordIds(
    ['CHAIR', 'CRANE', 'SLATE', 'CRANE'],
    ['CHAIR'],
    ['SLATE'],
    10,
  ), ['CRANE'])
})
