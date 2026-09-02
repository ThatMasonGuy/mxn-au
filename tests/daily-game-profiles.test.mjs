import test from 'node:test'
import assert from 'node:assert/strict'

import {
  recordLocalDailyResult,
  resolveGuestProfileAfterAuthChange,
  migrateLegacyGuestProfilePayload,
} from '../src/features/daily/utils/dailyGameProfiles.js'

test('guest daily profiles keep independent wins, streaks and Wordle attempts', () => {
  const first = recordLocalDailyResult(null, {
    date: '2026-09-01',
    outcome: 'win',
    attempts: 3,
  })
  const second = recordLocalDailyResult(first, {
    date: '2026-09-02',
    outcome: 'win',
    attempts: 2,
  })

  assert.equal(second.totalPlays, 2)
  assert.equal(second.wins, 2)
  assert.equal(second.currentStreak, 2)
  assert.equal(second.maxStreak, 2)
  assert.equal(second.winPercentage, 100)
  assert.deepEqual(second.histogram, [0, 1, 1, 0, 0, 0])
})

test('guest completion recording is idempotent for a game and UTC date', () => {
  const completed = recordLocalDailyResult(null, {
    date: '2026-09-02',
    outcome: 'loss',
    score: 40,
  })

  assert.strictEqual(recordLocalDailyResult(completed, {
    date: '2026-09-02',
    outcome: 'win',
    score: 500,
  }), completed)
  assert.equal(completed.losses, 1)
  assert.equal(completed.currentStreak, 0)
  assert.equal(completed.totalScore, 40)
})

test('Connections guest profiles retain mistake averages and perfect games', () => {
  const first = recordLocalDailyResult(null, {
    date: '2026-09-01',
    outcome: 'win',
    mistakes: 0,
  })
  const second = recordLocalDailyResult(first, {
    date: '2026-09-02',
    outcome: 'loss',
    mistakes: 4,
  })

  assert.equal(second.perfectGames, 1)
  assert.equal(second.averageMistakes, 2)
  assert.equal(second.currentStreak, 0)
})

test('guest profiles survive initial signed-out auth and stay separate after sign-out', () => {
  const guest = { currentStreak: 3, wins: 5 }
  const account = { currentStreak: 9, wins: 20 }

  assert.deepEqual(resolveGuestProfileAfterAuthChange(null, guest, null), guest)
  assert.deepEqual(resolveGuestProfileAfterAuthChange(guest, account, 'account-1'), guest)
  assert.equal(resolveGuestProfileAfterAuthChange(null, account, 'account-1'), null)
})

test('legacy persistence migrates only signed-out profiles into guest history', () => {
  const legacy = { days: {}, profile: { wins: 4, currentStreak: 2 } }

  assert.deepEqual(migrateLegacyGuestProfilePayload(legacy, false), {
    days: {},
    guestProfile: legacy.profile,
  })
  assert.deepEqual(migrateLegacyGuestProfilePayload(legacy, true), { days: {} })
})
