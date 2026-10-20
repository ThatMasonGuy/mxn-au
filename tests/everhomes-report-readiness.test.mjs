import assert from 'node:assert/strict'
import test from 'node:test'
import { createDraftSaveQueue } from '../src/features/everhomes/utils/draftSaveQueue.js'
import { collectMissingReportAnswers, getReportReadiness, reportItemElementId } from '../src/features/everhomes/utils/reportReadiness.js'

function deferred() {
  let resolve, reject
  const promise = new Promise((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}

test('draft flush serialises saves and includes edits made during an in-flight backup', async () => {
  const first = deferred()
  const second = deferred()
  const secondStarted = deferred()
  const saved = []
  let answer = 'original'
  const queue = createDraftSaveQueue(async () => {
    saved.push(answer)
    if (saved.length === 2) secondStarted.resolve()
    return saved.length === 1 ? first.promise : second.promise
  })
  const flushing = queue.flush()
  assert.equal(queue.flush(), flushing, 'copy and submit share the active save')
  answer = 'latest'
  queue.markChanged()
  queue.markChanged()
  let finished = false
  flushing.then(() => { finished = true })
  first.resolve({ revision: 1 })
  await secondStarted.promise
  assert.deepEqual(saved, ['original', 'latest'])
  assert.equal(finished, false, 'an older backup must not complete the flush')
  second.resolve({ revision: 2 })
  assert.deepEqual(await flushing, { revision: 2 })
  await queue.flush()
  assert.equal(saved.length, 2, 'unchanged data does not need another save')
})

test('a failed backup remains dirty and can be retried without losing subsequent edits', async () => {
  const failing = deferred()
  let calls = 0
  let answer = 'before failure'
  const saved = []
  const queue = createDraftSaveQueue(async () => {
    calls += 1
    if (calls === 1) return failing.promise
    saved.push(answer)
    return { saved: true }
  })
  const first = queue.flush()
  answer = 'retained answer'
  queue.markChanged()
  failing.reject(new Error('offline'))
  await assert.rejects(first, /offline/)
  assert.deepEqual(await queue.flush(), { saved: true })
  assert.deepEqual(saved, ['retained answer'])
})

test('required answer collection preserves exact targets and respects conditional visibility', () => {
  const sections = [
    { id: 'bedroom_1', key: 'bedroom', label: 'Bedroom 1' },
    { id: 'bedroom_2', key: 'bedroom', label: 'Bedroom 2' },
  ]
  const items = [
    { id: 'working', type: 'yesno', label: 'Is the remote working?' },
    { id: 'details', type: 'text', required: true, label: 'Details' },
    { id: 'notes', type: 'text', label: 'Optional notes' },
    { id: 'conditional', type: 'yesno', label: 'Hidden question' },
  ]
  const data = { bedroom_1: { inputs: { working: 'no', details: '   ' } } }
  const missing = collectMissingReportAnswers(sections, data, () => items, item => item.id !== 'conditional')
  assert.deepEqual(missing.map(({ sectionId, itemId }) => [sectionId, itemId]), [
    ['bedroom_1', 'details'], ['bedroom_2', 'working'], ['bedroom_2', 'details'],
  ])
  assert.equal(missing[1].sectionLabel, 'Bedroom 2')
  assert.equal(missing[1].itemLabel, 'Is the remote working?')
  data.bedroom_1.inputs.details = 'Provided'
  data.bedroom_2 = { inputs: { working: 'yes', details: 'Provided' } }
  assert.deepEqual(collectMissingReportAnswers(sections, data, () => items, item => item.id !== 'conditional'), [])
})

const readyInput = () => ({ missingAnswers: [], sections: [{ id: 'general', label: 'General Property' }], data: {}, marketingPhotos: {}, isOnline: true, hasAnyUploading: false })

test('optional unchecked sections do not block submission but every actual gate does', () => {
  assert.equal(getReportReadiness(readyInput()).blocked, false)
  for (const override of [
    { missingAnswers: [{ sectionId: 'general', itemId: 'remote', sectionLabel: 'General Property', itemLabel: 'Remotes working?' }] },
    { data: { general: { photos: [{ uploadStatus: 'failed' }] } } },
    { marketingPhotos: { front: [{ uploadStatus: 'failed' }] } },
    { isOnline: false },
    { hasAnyUploading: true },
  ]) {
    assert.equal(getReportReadiness({ ...readyInput(), ...override }).blocked, true)
  }
  const readiness = getReportReadiness({ ...readyInput(), data: { general: { photos: [{ uploadStatus: 'failed' }] } }, marketingPhotos: { front: [{ uploadStatus: 'failed' }] } })
  assert.deepEqual(readiness.issues.map(({ kind, sectionId }) => [kind, sectionId]), [['photos', 'general'], ['marketing', undefined]])
})

test('question targets are distinct for repeated rooms and unusual IDs', () => {
  const first = reportItemElementId('bedroom_1', 'remote')
  assert.notEqual(first, reportItemElementId('bedroom_2', 'remote'))
  assert.notEqual(reportItemElementId('room/a', 'b'), reportItemElementId('room', 'a/b'))
  assert.notEqual(reportItemElementId('room-a', 'b'), reportItemElementId('room', 'a-b'))
})
