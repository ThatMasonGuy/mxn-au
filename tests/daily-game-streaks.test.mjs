import assert from 'node:assert/strict'
import test from 'node:test'

import {
  calculateDailyStreak,
  deriveFlagleOutcome,
  hasRecordedDailyResult,
} from '../functions/dailyGames/dailyGameStats.mjs'

test('a daily win continues yesterday\'s streak and a loss clears it', () => {
  const profile = {
    currentStreak: 6,
    lastPlayedUTC: '2026-09-01',
  }

  assert.equal(calculateDailyStreak(profile, 'win', '2026-09-02'), 7)
  assert.equal(calculateDailyStreak(profile, 'loss', '2026-09-02'), 0)
})

test('a daily win starts at one after a missed day', () => {
  assert.equal(calculateDailyStreak({
    currentStreak: 6,
    lastPlayedUTC: '2026-08-30',
  }, 'win', '2026-09-02'), 1)
})

test('a recorded date makes a signed-in completion retry idempotent', () => {
  assert.equal(hasRecordedDailyResult({ lastPlayedUTC: '2026-09-02' }, '2026-09-02'), true)
  assert.equal(hasRecordedDailyResult({ lastPlayedUTC: '2026-09-01' }, '2026-09-02'), false)
})

test('Flagle completion follows all five flags rather than the score', () => {
  const highScoringFailure = [
    { correct: true },
    { correct: true },
    { correct: true },
    { correct: false },
  ]
  const completedSet = Array.from({ length: 5 }, () => ({ correct: true }))

  assert.deepEqual(deriveFlagleOutcome(highScoringFailure), {
    correctCount: 3,
    outcome: 'loss',
  })
  assert.deepEqual(deriveFlagleOutcome(completedSet), {
    correctCount: 5,
    outcome: 'win',
  })
})
