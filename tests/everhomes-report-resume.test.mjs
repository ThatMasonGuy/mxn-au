import assert from 'node:assert/strict'
import test from 'node:test'
import { hasOtherLocalReport, resolveReportResume } from '../src/features/everhomes/utils/reportResume.js'

const draft = { setup: { propertyAddress: 'Draft address' }, checklistSections: [], checklistData: {} }

test('completed resume links open the PDF without requiring or restoring an editable snapshot', () => {
  for (const snapshot of [null, draft]) {
    assert.deepEqual(resolveReportResume({ status: 'complete', draft: snapshot, pdfUrl: 'https://example.com/report.pdf' }), {
      kind: 'submitted', status: 'complete', pdfUrl: 'https://example.com/report.pdf',
    })
  }
})

test('submitted reports awaiting generation are distinct from failed draft restoration', () => {
  assert.deepEqual(resolveReportResume({ status: 'processing', pdfUrl: 'https://example.com/stale.pdf' }), {
    kind: 'submitted', status: 'processing', pdfUrl: null,
  })
  assert.equal(resolveReportResume({ status: 'regenerating', pdfUrl: 'https://example.com/current.pdf' }).pdfUrl, 'https://example.com/current.pdf')
})

test('missing or unsafe completed-report URLs never become actionable links', () => {
  for (const pdfUrl of [undefined, null, '', 'javascript:alert(1)', 'http://example.com/report.pdf', 'https://user:password@example.com/report.pdf']) {
    assert.equal(resolveReportResume({ status: 'complete', pdfUrl }).pdfUrl, null)
  }
})

test('unfinished drafts still restore and malformed recovery payloads remain errors', () => {
  for (const status of ['draft', 'pending', 'failed']) {
    assert.deepEqual(resolveReportResume({ status, draft }), { kind: 'draft', draft })
  }
  assert.throws(() => resolveReportResume({ status: 'draft', draft: null }), /recoverable report data/)
})

test('a different local report requires confirmation while the submitted device copy does not', () => {
  assert.equal(hasOtherLocalReport({ setup: { reportId: 'submitted', propertyAddress: 'Old address' }, hasChecklistStarted: true }, 'submitted'), false)
  assert.equal(hasOtherLocalReport({ setup: { reportId: null }, hasChecklistStarted: false }, 'submitted'), false)
  assert.equal(hasOtherLocalReport({ setup: { reportId: 'another' }, hasChecklistStarted: true }, 'submitted'), true)
  assert.equal(hasOtherLocalReport({ setup: { reportId: null, propertyAddress: 'Partially filled form' }, hasChecklistStarted: false }, 'submitted'), true)
})
