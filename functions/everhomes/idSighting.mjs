import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { createHash, randomUUID } from 'node:crypto'
import { Resend } from 'resend'
import { firebaseAdmin, db } from '../config/firebase.mjs'
import { requireEverhomesAdmin } from './requireEverhomesAdmin.mjs'
import { generateIdSightingPdf } from './idSightingPdf.mjs'
import { IdSightingError, normaliseIdSighting, validateIdSightingCredentials, brisbaneToday, buildIdSightingEmail, completeIdSighting, idSightingFilename, requireIdSightingAccess } from './idSightingCore.mjs'

const RESEND_API_KEY = defineSecret('RESEND_API_KEY')
const records = db.collection('everhomesIdSightings')
const hash = (value) => createHash('sha256').update(value).digest('hex')
const pathFor = (id) => `everhomesIdSightings/${id}/record.pdf`
const stamp = () => firebaseAdmin.firestore.FieldValue.serverTimestamp()

export const everhomesIdSighting = onRequest({ region: 'australia-southeast1', cors: true, timeoutSeconds: 120, memory: '256MiB', maxInstances: 5, secrets: [RESEND_API_KEY] }, async (req, res) => {
  res.set('Cache-Control', 'no-store')
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  const body = req.body ?? {}
  const action = body.action ?? 'submit'
  try {
    if (!['submit', 'download', 'retryEmail'].includes(action)) throw new IdSightingError(400, 'Unsupported record action.')
    let admin = null
    if (req.get('authorization')) admin = await requireEverhomesAdmin(req)
    let credentials
    if (admin && action !== 'submit') {
      if (!/^[a-f0-9]{32}$/.test(body.recordId ?? '')) throw new IdSightingError(400, 'Invalid record reference.')
      credentials = { recordId: body.recordId }
    } else credentials = validateIdSightingCredentials(body)
    const ref = records.doc(credentials.recordId)
    const accessHash = credentials.accessKey ? hash(credentials.accessKey) : null
    const bucket = firebaseAdmin.storage().bucket()
    if (action === 'download') {
      const snap = await ref.get()
      requireIdSightingAccess(snap.data(), accessHash, !!admin)
      const record = { ...snap.data().record, ...snap.data(), id: snap.id }
      if (record.pdfStoragePath !== pathFor(record.id)) throw new IdSightingError(409, 'The PDF is not ready. Retry saving the record.')
      const [pdf] = await bucket.file(record.pdfStoragePath).download()
      return res.json({ filename: idSightingFilename(record), pdfBase64: pdf.toString('base64') })
    }
    const input = action === 'submit' ? normaliseIdSighting(body.record, brisbaneToday()) : null
    const leaseId = randomUUID()
    const claim = async () => db.runTransaction(async (tx) => {
      const snap = await tx.get(ref)
      const existing = snap.data()
      if (existing) {
        requireIdSightingAccess(existing, accessHash, !!admin)
        if (input && JSON.stringify(existing.record) !== JSON.stringify(input)) throw new IdSightingError(409, 'This record has already been saved with different details. Start a new record to make changes.')
        if (existing.leaseUntil > Date.now()) throw new IdSightingError(409, 'This record is being saved. Wait a moment and try again.')
        tx.update(ref, { leaseId, leaseUntil: Date.now() + 150_000 })
        return { ...existing.record, ...existing, id: snap.id }
      }
      if (!input) throw new IdSightingError(404, 'Record not found.')
      const quotaRef = db.collection('everhomesIdSightingLimits').doc(hash(`${input.staffEmail}:${brisbaneToday()}`))
      const quota = await tx.get(quotaRef)
      if ((quota.data()?.count ?? 0) >= 100) throw new IdSightingError(429, 'The daily limit for this staff email has been reached. Contact your administrator.')
      tx.set(quotaRef, { count: (quota.data()?.count ?? 0) + 1, expiresAt: new Date(Date.now() + 2 * 86400_000) })
      const record = { record: input, accessHash, status: 'processing', emailStatus: 'pending', createdAt: stamp(), leaseId, leaseUntil: Date.now() + 150_000 }
      tx.create(ref, record)
      return { ...input, ...record, id: ref.id }
    })
    const update = (id, values) => records.doc(id).update({ ...values, updatedAt: stamp(), ...(values.emailStatus === 'sent' ? { emailSentAt: stamp() } : {}) })
    const result = await completeIdSighting({
      claim,
      generatePdf: generateIdSightingPdf,
      storePdf: async (record, pdf) => {
        const path = pathFor(record.id)
        await bucket.file(path).save(pdf, { resumable: false, contentType: 'application/pdf', metadata: { cacheControl: 'private, no-store' } })
        return path
      },
      update,
      sendEmail: async (record, pdf) => {
        pdf ??= (await bucket.file(pathFor(record.id)).download())[0]
        return new Resend(RESEND_API_KEY.value()).emails.send(buildIdSightingEmail(record, pdf), { idempotencyKey: `everhomes-id-sighting/${record.id}` })
      },
      release: async () => db.runTransaction(async (tx) => {
        const snap = await tx.get(ref)
        if (snap.data()?.leaseId === leaseId) tx.update(ref, { leaseId: null, leaseUntil: 0 })
      }),
    }, body)
    return res.json(result)
  } catch (error) {
    const status = error.status ?? 500
    if (status >= 500) console.error('ID sighting operation failed', { action, code: error.code ?? 'internal' })
    return res.status(status).json({ error: status >= 500 ? 'The record service could not finish. Retry with the same details to recover your record.' : error.message })
  }
})
