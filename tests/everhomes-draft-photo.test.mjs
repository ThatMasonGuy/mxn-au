import assert from 'node:assert/strict'
import test from 'node:test'
import { storeDraftPhoto } from '../functions/everhomes/draftPhotoUpload.mjs'

const session = { collection: 'inspections', draftId: 'draft-id', draftAccessKey: 'owner-key' }
const request = {
  session, storagePath: 'inspections/draft-id/photos/section-entry_photo-id.jpg',
  contentType: 'image/jpeg', bytes: Buffer.from('original test photo'),
}
const dependencies = (overrides = {}) => ({
  getDraft: async () => ({ status: 'draft', draftAccessKey: session.draftAccessKey }),
  saveFile: async () => {}, newToken: () => 'download-token', ...overrides,
})

test('fallback uploads preserve original bytes and capability metadata at the same destination', async () => {
  for (const status of ['draft', 'pending', 'failed']) {
    let written = false
    const result = await storeDraftPhoto(request, dependencies({
      getDraft: async () => ({ status, draftAccessKey: session.draftAccessKey }),
      saveFile: async (path, bytes, metadata) => {
        assert.equal(path, request.storagePath)
        assert.equal(bytes, request.bytes)
        assert.deepEqual(metadata, {
          contentType: 'image/jpeg',
          metadata: { everhomesDraftKey: 'owner-key', firebaseStorageDownloadTokens: 'download-token' },
        })
        written = true
      },
    }))
    assert.equal(written, true)
    assert.deepEqual(result, { storagePath: request.storagePath, token: 'download-token' })
  }
})

test('fallback cannot write other drafts, report artifacts, traversal paths or nested objects', async () => {
  for (const storagePath of [
    'inspections/another-draft/photos/photo.jpg',
    'handovers/draft-id/photos/photo.jpg',
    'inspections/draft-id/signatures/staff.jpg',
    'inspections/draft-id/photos/../report.jpg',
    'inspections/draft-id/photos/nested/photo.jpg',
    'inspections/draft-id/photos/report.pdf',
  ]) {
    await assert.rejects(storeDraftPhoto({ ...request, storagePath }, dependencies({
      saveFile: async () => assert.fail('Invalid destinations must never be written'),
    })), { status: 400 })
  }
})

test('fallback enforces the same per-photo size and image-type boundary as direct uploads', async () => {
  for (const changes of [
    { bytes: Buffer.alloc(0) },
    { bytes: Buffer.alloc(15 * 1024 * 1024) },
    { contentType: 'application/pdf' },
  ]) {
    await assert.rejects(storeDraftPhoto({ ...request, ...changes }, dependencies({
      saveFile: async () => assert.fail('Rejected images must never be written'),
    })))
  }
})

test('fallback rejects incorrect capabilities and all submitted or deleting reports', async () => {
  for (const draft of [
    { status: 'draft', draftAccessKey: 'another-key' },
    ...['processing', 'regenerating', 'complete', 'deleting', 'unknown'].map(status => ({ status, draftAccessKey: 'owner-key' })),
  ]) {
    await assert.rejects(storeDraftPhoto(request, dependencies({
      getDraft: async () => draft,
      saveFile: async () => assert.fail('Protected draft must never be written'),
    })), { status: draft.draftAccessKey === 'owner-key' ? 409 : 403 })
  }
})

test('fallback storage errors remain failures so the device retains its retryable original', async () => {
  const error = new Error('Storage unavailable')
  await assert.rejects(storeDraftPhoto(request, dependencies({ saveFile: async () => { throw error } })), error)
})
