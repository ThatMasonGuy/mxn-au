import test from 'node:test'
import assert from 'node:assert/strict'

import {
  compareConnectionsProgress,
  compareFlagleProgress,
  compareWordleProgress,
} from '../src/features/daily/utils/dailyGameProgress.js'

test('Connections restores wrong attempts even when no groups were solved', () => {
  const local = { foundGroups: [], attempts: [], mistakes: 0, status: 'idle' }
  const cloud = {
    foundGroups: [],
    attempts: { attempt_1: ['A', 'B', 'C', 'D'] },
    mistakes: 1,
    outcome: 'in_progress',
  }

  assert.equal(compareConnectionsProgress(local, cloud), -1)
})

test('terminal losses outrank incomplete local progress', () => {
  assert.equal(compareConnectionsProgress(
    { foundGroups: [{ difficulty: 'easy' }], attempts: [[]], status: 'in-progress' },
    { foundGroups: [], attempts: { attempt_1: [] }, mistakes: 4, outcome: 'loss' },
  ), -1)
})

test('Flagle compares all guesses rather than only completed flags', () => {
  assert.equal(compareFlagleProgress(
    { currentFlagIndex: 0, allAttempts: [], status: 'idle' },
    { currentFlagIndex: 0, allAttempts: [{ guess: 'France' }], outcome: 'in_progress' },
  ), -1)
})

test('Wordle restores a terminal cloud result when row counts match', () => {
  const rows = [{ guess: 'CHAIR' }]
  assert.equal(compareWordleProgress(
    { rows, status: 'in-progress' },
    { guesses: ['CHAIR'], outcome: 'win' },
  ), -1)
})
