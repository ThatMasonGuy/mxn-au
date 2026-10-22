import assert from 'node:assert/strict'
import test from 'node:test'
import { waitForReportUpload } from '../src/features/everhomes/utils/reportUploadTask.js'

function transfer() {
  const visibilityTarget = new EventTarget()
  visibilityTarget.visibilityState = 'visible'
  let handlers
  let canceled = false
  let unsubscribed = false
  const task = {
    snapshot: { bytesTransferred: 0, totalBytes: 9_000_000 },
    on: (event, progress, error, complete) => {
      handlers = { progress, error, complete }
      return () => { unsubscribed = true }
    },
    cancel: () => { canceled = true },
  }
  return {
    task, visibilityTarget,
    get handlers() { return handlers },
    get canceled() { return canceled },
    get unsubscribed() { return unsubscribed },
    visibility(state) {
      visibilityTarget.visibilityState = state
      visibilityTarget.dispatchEvent(new Event('visibilitychange'))
    },
  }
}

test('a mobile upload survives background suspension and resumes its inactivity budget', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const upload = transfer()
  const result = waitForReportUpload(upload.task, { timeoutMs: 30_000, visibilityTarget: upload.visibilityTarget })
  t.mock.timers.tick(29_000)
  upload.visibility('hidden')
  t.mock.timers.tick(300_000)
  assert.equal(upload.canceled, false)
  upload.visibility('visible')
  t.mock.timers.tick(29_000)
  upload.handlers.complete()
  await result
  t.mock.timers.tick(60_000)
  assert.equal(upload.canceled, false)
  assert.equal(upload.unsubscribed, true)
})

test('progress extends the upload window and stalled foreground uploads report transferred bytes', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const upload = transfer()
  const result = waitForReportUpload(upload.task, { timeoutMs: 30_000, visibilityTarget: upload.visibilityTarget })
  const rejected = assert.rejects(result, (error) => {
    assert.equal(error.code, 'storage/timeout')
    assert.equal(error.bytesTransferred, 262_144)
    assert.equal(error.totalBytes, 9_000_000)
    return true
  })
  t.mock.timers.tick(29_000)
  upload.handlers.progress({ bytesTransferred: 262_144, totalBytes: 9_000_000 })
  t.mock.timers.tick(29_000)
  assert.equal(upload.canceled, false)
  t.mock.timers.tick(1_000)
  await rejected
  assert.equal(upload.canceled, true)
  assert.equal(upload.unsubscribed, true)
})

test('storage errors are returned unchanged and timers stop after failure', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const upload = transfer()
  const result = waitForReportUpload(upload.task, { timeoutMs: 30_000, visibilityTarget: upload.visibilityTarget })
  const error = Object.assign(new Error('Access denied'), { code: 'storage/unauthorized' })
  const rejected = assert.rejects(result, error)
  upload.handlers.error(error)
  await rejected
  upload.visibility('visible')
  t.mock.timers.tick(60_000)
  assert.equal(upload.canceled, false)
})
