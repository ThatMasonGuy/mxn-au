import assert from 'node:assert/strict'
import test from 'node:test'
import { clearReportSession } from '../src/features/everhomes/utils/reportClear.js'
import { reportErrorDetails } from '../src/features/everhomes/utils/reportErrorDetails.js'

const session = { reportType: 'inspection', draftId: 'draft-id', draftAccessKey: 'secret-key' }
const failure = (status, message) => Object.assign(new Error(message), { status })

test('clearing completed or missing reports leaves server records alone', async () => {
  for (const status of ['complete', 'missing']) {
    await clearReportSession(session, {
      getDraft: async (request) => {
        assert.equal(request.includeDraft, false)
        assert.equal(request.draftAccessKey, session.draftAccessKey)
        if (status === 'missing') throw failure(404, 'Draft not found')
        return { status }
      },
      deleteDraft: async () => assert.fail('Published reports must not be deleted'),
    })
  }
})

test('clearing mutable drafts deletes the server backup before resolving', async () => {
  for (const status of ['draft', 'pending', 'failed', 'deleting']) {
    let deleted = false
    await clearReportSession(session, {
      getDraft: async () => ({ status }),
      deleteDraft: async (request) => {
        assert.deepEqual(request, session)
        deleted = true
      },
    })
    assert.equal(deleted, true)
  }
})

test('active reports, inaccessible sessions and unavailable services remain protected', async () => {
  for (const status of ['processing', 'regenerating', 'unknown']) {
    await assert.rejects(clearReportSession(session, {
      getDraft: async () => ({ status }),
      deleteDraft: async () => assert.fail('Active reports must not be deleted'),
    }), /still being processed/)
  }
  for (const error of [failure(403, 'Access denied'), failure(404, 'Endpoint not found'), failure(503, 'Unavailable')]) {
    await assert.rejects(clearReportSession(session, {
      getDraft: async () => { throw error },
      deleteDraft: async () => assert.fail('Failed status checks must not delete data'),
    }), error)
  }
})

test('clear handles completion and deletion races without suppressing other failures', async () => {
  let calls = 0
  await clearReportSession(session, {
    getDraft: async () => ({ status: ++calls === 1 ? 'pending' : 'complete' }),
    deleteDraft: async () => { throw failure(409, 'Already submitted') },
  })
  assert.equal(calls, 2)
  const error = failure(500, 'Storage unavailable')
  await assert.rejects(clearReportSession(session, {
    getDraft: async () => ({ status: 'draft' }),
    deleteDraft: async () => { throw error },
  }), error)
})

test('clear diagnostics include the service failure without exposing the draft key', () => {
  const logs = reportErrorDetails({
    status: 409, code: 'draft/http-409', endpoint: 'deleteEverhomesDraft', message: 'Already submitted',
    draftAccessKey: 'secret-key',
  }, { operation: 'clear report', reportType: 'inspection', reportId: 'draft-id', online: true })
  for (const value of ['clear report', '409', 'deleteEverhomesDraft', 'Already submitted', 'draft-id']) {
    assert.ok(logs.includes(value))
  }
  assert.equal(logs.includes('secret-key'), false)
})
