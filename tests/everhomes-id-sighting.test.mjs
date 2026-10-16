import test from 'node:test'
import assert from 'node:assert/strict'
import { normaliseIdSighting, validateIdSightingCredentials, requireIdSightingAccess, brisbaneToday, buildIdSightingEmail, completeIdSighting, deleteIdSighting } from '../functions/everhomes/idSightingCore.mjs'

const today = '2026-10-16'
const details = () => ({
  staffName: ' Alex Example ', staffEmail: ' Alex@EVERHOMES.COM.AU ',
  applicantName: ' Sample Applicant ', sightedDate: today,
  documents: [{ type: 'Passport', sighted: true }],
})
const normalise = (input) => normaliseIdSighting(input, today)

test('ID sighting accepts one or two explicitly sighted documents and minimises recorded information', () => {
  const input = { ...details(), documentNumber: 'must not be retained', photoUrl: 'must not be retained' }
  input.documents.push({ type: 'Other', description: ' Citizenship certificate ', sighted: true, number: 'private' })
  assert.deepEqual(normalise(input), {
    staffName: 'Alex Example', staffEmail: 'alex@everhomes.com.au', applicantName: 'Sample Applicant', sightedDate: today,
    documents: [{ type: 'Passport', description: '', sighted: true }, { type: 'Other', description: 'Citizenship certificate', sighted: true }],
  })
})

test('ID sighting rejects non-staff email destinations and email header injection', () => {
  for (const staffEmail of ['a@gmail.com', 'a@everhomes.com.au.evil.test', 'a@sub.everhomes.com.au', 'a@everhomes.com.au\r\nBcc: b@test.com', 'a b@everhomes.com.au', '@everhomes.com.au']) {
    assert.throws(() => normalise({ ...details(), staffEmail }), { status: 400 })
  }
})

test('ID sighting requires complete bounded details, real dates and explicit sighting of every ID', () => {
  for (const input of [
    null, [], { ...details(), staffName: '' }, { ...details(), applicantName: 'x'.repeat(161) },
    { ...details(), sightedDate: '2026-02-30' }, { ...details(), sightedDate: '2026-10-17' },
    { ...details(), documents: [] }, { ...details(), documents: Array(3).fill({ type: 'Passport', sighted: true }) },
    { ...details(), documents: [{ type: 'Passport', sighted: 'true' }] },
    { ...details(), documents: [{ type: 'Passport', sighted: true }, { type: 'Medicare card', sighted: false }] },
    { ...details(), documents: [{ type: 'Other', description: 12, sighted: true }] },
    { ...details(), documents: [{ type: 'Other', description: 'x'.repeat(101), sighted: true }] },
    { ...details(), documents: [{ type: 'Unsupported document', sighted: true }] },
  ]) assert.throws(() => normalise(input), { status: 400 })
  assert.equal(normalise({ ...details(), sightedDate: '2024-02-29' }).sightedDate, '2024-02-29')
})

test('ID sighting uses the Brisbane calendar date across UTC midnight boundaries', () => {
  assert.equal(brisbaneToday(new Date('2026-10-15T14:00:00Z')), today)
})

test('ID sighting access requires a valid capability or verified administrator', () => {
  const valid = { recordId: 'a'.repeat(32), accessKey: 'b'.repeat(64) }
  assert.deepEqual(validateIdSightingCredentials(valid), valid)
  for (const input of [{ ...valid, recordId: '../other' }, { ...valid, accessKey: '' }, { recordId: valid.recordId }]) {
    assert.throws(() => validateIdSightingCredentials(input), { status: 400 })
  }
  const record = { accessHash: 'correct-hash' }
  requireIdSightingAccess(record, 'correct-hash')
  requireIdSightingAccess(record, null, true)
  for (const [item, hash, admin] of [[record, 'wrong-hash', false], [record, null, false], [null, 'correct-hash', false], [null, null, true]]) {
    assert.throws(() => requireIdSightingAccess(item, hash, admin), { status: 404 })
  }
})

test('a record awaiting deletion cannot be downloaded or claimed again, even by its owner or an admin', () => {
  const record = { accessHash: 'correct-hash', status: 'deleting' }
  assert.throws(() => requireIdSightingAccess(record, 'correct-hash'), { status: 409 })
  assert.throws(() => requireIdSightingAccess(record, null, true), { status: 409 })
  assert.throws(() => requireIdSightingAccess(record, 'wrong-hash'), { status: 404 })
})

test('deleting a sighting removes its PDF before the record and treats an absent record as already deleted', async () => {
  let record = { status: 'complete' }, pdf = Buffer.from('private PDF'), locked = false
  const deps = {
    claim: async () => { if (!record) return false; locked = true; record.status = 'deleting'; return true },
    deletePdf: async () => { assert.equal(locked, true); pdf = null },
    deleteRecord: async () => { assert.equal(pdf, null); record = null },
    release: async () => { locked = false },
  }
  assert.deepEqual(await deleteIdSighting(deps), { success: true })
  assert.equal(record, null)
  assert.equal(pdf, null)
  assert.equal(locked, false)
  assert.deepEqual(await deleteIdSighting(deps), { success: true })
})

test('failed deletion preserves the record for retry and releases the operation lock', async () => {
  for (const failure of ['pdf', 'record']) {
    let record = { status: 'complete' }, pdf = Buffer.from('private PDF'), locked = false, shouldFail = true
    const deps = {
      claim: async () => { locked = true; record.status = 'deleting'; return true },
      deletePdf: async () => { if (failure === 'pdf' && shouldFail) throw new Error('Storage unavailable'); pdf = null },
      deleteRecord: async () => { if (shouldFail) throw new Error('Database unavailable'); record = null },
      release: async () => { locked = false },
    }
    await assert.rejects(deleteIdSighting(deps), /unavailable/)
    assert.equal(record.status, 'deleting')
    assert.equal(locked, false)
    shouldFail = false
    await deleteIdSighting(deps)
    assert.equal(record, null)
    assert.equal(pdf, null)
  }
})

test('a rejected deletion claim never touches the PDF or record', async () => {
  const untouched = async () => assert.fail('An active record must not be changed')
  await assert.rejects(deleteIdSighting({
    claim: async () => { throw Object.assign(new Error('Record in use'), { status: 409 }) },
    deletePdf: untouched, deleteRecord: untouched, release: untouched,
  }), { status: 409 })
})

function workflow({ existing = {}, send = async () => ({ data: { id: 'provider-1' } }), generate = async () => Buffer.from('PDF fixture') } = {}) {
  const record = { ...normalise(details()), id: 'a'.repeat(32), emailStatus: 'pending', ...existing }
  const events = []
  const deps = {
    claim: async () => { events.push('claim'); return { ...record } },
    generatePdf: async (item) => { events.push('generate'); return generate(item) },
    storePdf: async (_record, pdf) => { events.push('store'); assert.ok(pdf.length); return 'private/record.pdf' },
    update: async (_id, values) => { events.push(`update:${values.emailStatus ?? values.status}`); Object.assign(record, values) },
    sendEmail: async (item, pdf) => { events.push('email'); assert.equal(record.status, 'complete'); return send(item, pdf) },
    release: async () => { events.push('release') },
  }
  return { deps, record, events }
}

test('saving an ID sighting persists its PDF before email and repeated saves do not send again', async () => {
  const { deps, record, events } = workflow()
  const result = await completeIdSighting(deps, {})
  assert.deepEqual(events, ['claim', 'generate', 'store', 'update:complete', 'email', 'update:sent', 'release'])
  assert.equal(result.emailStatus, 'sent')
  assert.equal(record.emailProviderId, 'provider-1')
  events.length = 0
  await completeIdSighting(deps, {})
  assert.deepEqual(events, ['claim', 'release'])
})

test('email failures preserve the completed record and PDF and can be retried without regeneration', async () => {
  for (const send of [async () => ({ error: { message: 'provider refused' } }), async () => { throw new Error('network failure') }, async () => ({ data: {} })]) {
    const { deps, record, events } = workflow({ send })
    assert.equal((await completeIdSighting(deps, {})).emailStatus, 'failed')
    assert.equal(record.status, 'complete')
    assert.equal(record.pdfStoragePath, 'private/record.pdf')
    assert.equal(events.at(-1), 'release')
    events.length = 0
    deps.sendEmail = async () => ({ data: { id: 'provider-retry' } })
    assert.equal((await completeIdSighting(deps, {})).emailStatus, 'sent')
    assert.deepEqual(events, ['claim', 'update:sent', 'release'])
  }
})

test('PDF generation failure releases the save and does not announce completion or send email', async () => {
  const { deps, record, events } = workflow({ generate: async () => { throw new Error('PDF generation failed') } })
  await assert.rejects(completeIdSighting(deps, {}), /PDF generation failed/)
  assert.equal(record.pdfStoragePath, undefined)
  assert.equal(record.emailStatus, 'pending')
  assert.deepEqual(events, ['claim', 'generate', 'release'])
})

test('completed ID sighting email attaches the exact PDF and only targets the recorded staff address', () => {
  const record = { ...normalise(details()), id: 'a'.repeat(32) }
  const pdf = Buffer.from('PDF fixture')
  const email = buildIdSightingEmail(record, pdf)
  assert.equal(email.to, 'alex@everhomes.com.au')
  assert.equal(email.cc, undefined)
  assert.equal(email.bcc, undefined)
  assert.equal(email.attachments[0].content, pdf)
  assert.equal(email.attachments[0].contentType, 'application/pdf')
  assert.ok(email.attachments[0].filename.endsWith('.pdf'))
  assert.ok(email.text.includes('Form 22b or Form R22b'))
})

test('ID sighting email includes the saved record and both sighted documents in HTML and plain text', () => {
  const record = { ...normalise({ ...details(), documents: [{ type: 'Passport', sighted: true }, { type: 'Other', description: 'Citizenship certificate', sighted: true }] }), id: 'a'.repeat(32) }
  const email = buildIdSightingEmail(record, Buffer.from('PDF fixture'))
  for (const value of [record.staffName, record.applicantName, '16 October 2026', 'Passport', 'Citizenship certificate', 'Sighted', record.id, 'PDF', 'Form 22b or Form R22b', 'admin@everhomes.com.au']) {
    assert.ok(email.html.includes(value), `HTML email is missing ${value}`)
    assert.ok(email.text.includes(value), `Plain text email is missing ${value}`)
  }
  assert.ok(email.subject.includes('16 October 2026'))
  assert.equal(email.replyTo, 'admin@everhomes.com.au')
})

test('ID sighting email treats names and custom ID descriptions as text rather than HTML or links', () => {
  const unsafe = '<a href="https://fake.example">Open</a> & "Name"'
  const record = { ...normalise({ ...details(), staffName: unsafe, applicantName: unsafe, documents: [{ type: 'Other', description: unsafe, sighted: true }] }), id: 'a'.repeat(32) }
  const email = buildIdSightingEmail(record, Buffer.from('PDF fixture'))
  assert.ok(!email.html.includes('<a href="https://fake.example">'))
  assert.ok(email.html.includes('&lt;a href=&quot;https://fake.example&quot;&gt;Open&lt;/a&gt; &amp; &quot;Name&quot;'))
  assert.ok(email.text.includes(unsafe))
  assert.equal(email.to, record.staffEmail)
})
