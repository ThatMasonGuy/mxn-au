import test from 'node:test'
import assert from 'node:assert/strict'

import { dailyStatusFromDayData } from '../src/features/daily/utils/dailyGameStatus.js'

test('the hub derives today status directly from the day document', () => {
  assert.equal(dailyStatusFromDayData({ outcome: 'in_progress' }), 'in-progress')
  assert.equal(dailyStatusFromDayData({ outcome: 'win' }), 'won')
  assert.equal(dailyStatusFromDayData({ outcome: 'loss' }), 'lost')
  assert.equal(dailyStatusFromDayData(null), 'not-started')
})
