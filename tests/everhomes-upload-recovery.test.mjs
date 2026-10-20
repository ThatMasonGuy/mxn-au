import assert from 'node:assert/strict'
import test from 'node:test'
import { describeReportUploadFailure, photoBackupFailure } from '../src/features/everhomes/utils/reportUploadErrors.js'

test('a photo retained after a failed backup remains retryable online and offline', () => {
  for (const online of [true, false]) {
    const failure = describeReportUploadFailure(photoBackupFailure(new Error('Failed to fetch'), { online }))
    assert.equal(failure.retryable, true)
    assert.equal(failure.code, 'draft/backup-failed')
    assert.ok(failure.message.includes('retry this photo'))
  }
})

test('backup retry distinguishes temporary service failures from rejected draft requests', () => {
  for (const status of [408, 429, 500, 503]) {
    assert.equal(describeReportUploadFailure(photoBackupFailure({ status }, { online: true })).retryable, true)
  }
  for (const status of [400, 401, 403, 404, 409, 413]) {
    const failure = describeReportUploadFailure(photoBackupFailure({ status, message: 'Draft rejected' }, { online: true }))
    assert.equal(failure.retryable, false)
    assert.equal(failure.message, 'Draft rejected')
  }
})

test('upload failures preserve explicit retry decisions and existing transient storage recovery', () => {
  assert.equal(describeReportUploadFailure({ code: 'custom', retryable: true }).retryable, true)
  assert.equal(describeReportUploadFailure({ code: 'storage/timeout', retryable: false }).retryable, false)
  for (const code of ['storage/timeout', 'storage/canceled', 'storage/unknown', 'storage/retry-limit-exceeded']) {
    assert.equal(describeReportUploadFailure({ code }).retryable, true)
  }
  for (const code of ['storage/invalid-file', 'storage/invalid-file-type', 'storage/file-too-large', 'storage/unauthorized']) {
    assert.equal(describeReportUploadFailure({ code }).retryable, false)
  }
  assert.equal(describeReportUploadFailure(new Error('Download timeout')).retryable, true)
})
