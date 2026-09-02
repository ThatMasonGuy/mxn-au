import assert from 'node:assert/strict'
import test from 'node:test'

import { prepareFlagleSubmission } from '../src/features/daily/utils/flagleSubmission.js'

test('a Flagle guess claims the submission lock and clears its input immediately', () => {
  assert.deepEqual(prepareFlagleSubmission({
    input: '  France  ',
    canSubmit: true,
    submitting: false,
  }), {
    guess: 'France',
    nextInput: '',
    nextSubmitting: true,
  })
})

test('Flagle rejects repeated or empty submissions', () => {
  assert.equal(prepareFlagleSubmission({
    input: 'France',
    canSubmit: true,
    submitting: true,
  }), null)
  assert.equal(prepareFlagleSubmission({
    input: '   ',
    canSubmit: true,
    submitting: false,
  }), null)
})
