import { onRequest } from 'firebase-functions/v2/https'
import { firebaseAdmin, db } from '../config/firebase.mjs'

const REGION = 'australia-southeast1'
// Keep browser recovery snapshots well below Firestore's document limit. Final
// submission atomically replaces this snapshot with a regeneration-safe payload.
const MAX_DRAFT_BYTES = 450 * 1024
const MAX_FAILURE_EVENTS = 50
const REPORT_COLLECTIONS = Object.freeze({
  inspection: 'inspections',
  handover: 'handovers',
})

class DraftRequestError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function requirePost(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return false
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' })
    return false
  }
  return true
}

function asString(value, field, { min = 1, max = 1024 } = {}) {
  if (typeof value !== 'string') throw new DraftRequestError(400, `Invalid ${field}`)
  const trimmed = value.trim()
  if (trimmed.length < min || trimmed.length > max) {
    throw new DraftRequestError(400, `Invalid ${field}`)
  }
  return trimmed
}

function parseSession(body = {}) {
  const reportType = asString(body.reportType, 'report type', { max: 32 })
  const collection = REPORT_COLLECTIONS[reportType]
  if (!collection) throw new DraftRequestError(400, 'Unsupported report type')

  const draftId = asString(body.draftId, 'draft ID', { min: 36, max: 64 })
  if (!/^[a-f0-9-]+$/i.test(draftId)) {
    throw new DraftRequestError(400, 'Invalid draft ID')
  }

  const draftAccessKey = asString(body.draftAccessKey, 'draft access key', { min: 48, max: 160 })
  if (!/^[a-f0-9]+$/i.test(draftAccessKey)) {
    throw new DraftRequestError(400, 'Invalid draft access key')
  }

  return { reportType, collection, draftId, draftAccessKey }
}

function requireDraft(body = {}) {
  if (!body.draft || typeof body.draft !== 'object' || Array.isArray(body.draft)) {
    throw new DraftRequestError(400, 'Invalid draft payload')
  }

  const serialised = JSON.stringify(body.draft)
  const bytes = Buffer.byteLength(serialised, 'utf8')
  if (bytes > MAX_DRAFT_BYTES) {
    throw new DraftRequestError(413, 'This draft is too large to back up. Please submit it or contact support.')
  }

  return { draft: JSON.parse(serialised), bytes }
}

function draftSummary(draft = {}) {
  const setup = draft.setup && typeof draft.setup === 'object' ? draft.setup : {}
  const value = (field, max = 500) => typeof setup[field] === 'string' ? setup[field].trim().slice(0, max) : ''
  return {
    propertyAddress: value('propertyAddress'),
    inspectionDate: value('inspectionDate', 64),
    inspectorName: value('inspectorName', 200),
    inspectorEmail: value('inspectorEmail', 320),
  }
}

function draftStatusPayload(data = {}) {
  return {
    status: data.status ?? 'draft',
    pdfUrl: data.pdfUrl ?? null,
    photosDownloadUrl: data.photosDownloadUrl ?? null,
    error: data.error ?? null,
    emailsSent: Array.isArray(data.emailsSent) ? data.emailsSent : [],
    emailFailures: Array.isArray(data.emailFailures) ? data.emailFailures : [],
    draftRevision: data.draftRevision ?? 0,
    draftUpdatedAt: data.draftUpdatedAt?.toDate?.().toISOString?.() ?? null,
  }
}

async function findDraft(session) {
  const ref = db.collection(session.collection).doc(session.draftId)
  const snapshot = await ref.get()
  if (!snapshot.exists) throw new DraftRequestError(404, 'Draft not found')

  const data = snapshot.data()
  if (data.draftAccessKey !== session.draftAccessKey) {
    throw new DraftRequestError(403, 'This resume link does not have access to the draft')
  }

  return { ref, snapshot, data }
}

function sanitiseFailure(input = {}) {
  const string = (key, max) => typeof input[key] === 'string' ? input[key].slice(0, max) : ''
  const number = (key) => Number.isFinite(input[key]) ? input[key] : 0
  return {
    code: string('code', 128) || 'unknown',
    message: string('message', 1000) || 'Unknown upload error',
    retryable: input.retryable === true,
    attempts: Math.max(0, Math.min(20, number('attempts'))),
    timeoutMs: Math.max(0, Math.min(300_000, number('timeoutMs'))),
    fileName: string('fileName', 512),
    fileType: string('fileType', 128),
    fileSize: Math.max(0, number('fileSize')),
    storagePath: string('storagePath', 2048),
    sectionId: string('sectionId', 256),
    slotKey: string('slotKey', 256),
    online: input.online !== false,
    occurredAtClient: string('occurredAtClient', 64),
  }
}

function endpoint(name, handler) {
  return onRequest({ region: REGION, cors: true }, async (req, res) => {
    const startedAt = Date.now()
    try {
      if (!requirePost(req, res)) return
      await handler(req, res)
      console.log(JSON.stringify({
        scope: 'everhomes-draft',
        endpoint: name,
        outcome: 'success',
        durationMs: Date.now() - startedAt,
      }))
    } catch (error) {
      const status = error instanceof DraftRequestError ? error.status : 500
      console.error(JSON.stringify({
        scope: 'everhomes-draft',
        endpoint: name,
        outcome: 'failure',
        status,
        durationMs: Date.now() - startedAt,
        error: error.message,
      }))
      res.status(status).json({ error: error.message || 'Unexpected draft service error' })
    }
  })
}

export const syncEverhomesDraft = endpoint('sync', async (req, res) => {
  const session = parseSession(req.body)
  const { draft, bytes } = requireDraft(req.body)
  const ref = db.collection(session.collection).doc(session.draftId)

  const result = await db.runTransaction(async (transaction) => {
    const existing = await transaction.get(ref)
    const timestamp = firebaseAdmin.firestore.FieldValue.serverTimestamp()
    const summary = draftSummary(draft)

    if (existing.exists) {
      const current = existing.data()
      if (current.draftAccessKey !== session.draftAccessKey) {
        throw new DraftRequestError(403, 'This draft belongs to a different session')
      }
      if (['processing', 'regenerating', 'deleting', 'complete'].includes(current.status)) {
        throw new DraftRequestError(409, 'This report has already been submitted')
      }

      const draftRevision = (Number(current.draftRevision) || 0) + 1
      const resetFailedSubmission = current.status === 'failed'
        ? {
            submissionPayload: firebaseAdmin.firestore.FieldValue.delete(),
            error: firebaseAdmin.firestore.FieldValue.delete(),
            failedAt: firebaseAdmin.firestore.FieldValue.delete(),
            generationDeadlineWarning: firebaseAdmin.firestore.FieldValue.delete(),
            generationDeadlineReachedAt: firebaseAdmin.firestore.FieldValue.delete(),
          }
        : {}
      transaction.update(ref, {
        ...summary,
        ...resetFailedSubmission,
        status: 'draft',
        draftSnapshot: draft,
        draftBytes: bytes,
        draftRevision,
        draftUpdatedAt: timestamp,
        updatedAt: timestamp,
      })
      return draftRevision
    }

    transaction.create(ref, {
      ...summary,
      reportType: session.reportType,
      status: 'draft',
      draftAccessKey: session.draftAccessKey,
      draftSnapshot: draft,
      draftBytes: bytes,
      draftRevision: 1,
      createdAt: timestamp,
      draftUpdatedAt: timestamp,
      updatedAt: timestamp,
    })
    return 1
  })

  res.status(200).json({ ok: true, draftRevision: result })
})

export const getEverhomesDraft = endpoint('get', async (req, res) => {
  const session = parseSession(req.body)
  const { data } = await findDraft(session)
  const includeDraft = req.body?.includeDraft !== false

  res.status(200).json({
    ok: true,
    ...draftStatusPayload(data),
    draft: includeDraft ? data.draftSnapshot ?? null : undefined,
    latestUploadFailure: data.latestUploadFailure ?? null,
  })
})

export const recordEverhomesUploadFailure = endpoint('upload-failure', async (req, res) => {
  const session = parseSession(req.body)
  const failure = sanitiseFailure(req.body?.failure)
  const { ref } = await findDraft(session)

  const eventRef = ref.collection('uploadFailures').doc()
  const timestamp = firebaseAdmin.firestore.FieldValue.serverTimestamp()
  const current = await ref.get()
  if (!current.exists || current.data().draftAccessKey !== session.draftAccessKey) {
    throw new DraftRequestError(403, 'This upload failure does not belong to the current draft')
  }
  if (['processing', 'regenerating', 'deleting', 'complete'].includes(current.data().status)) {
    throw new DraftRequestError(409, 'This report has already been submitted')
  }

  const batch = db.batch()
  batch.set(eventRef, {
      ...failure,
      createdAt: timestamp,
  })
  batch.update(ref, {
      latestUploadFailure: failure,
      uploadFailureCount: firebaseAdmin.firestore.FieldValue.increment(1),
      updatedAt: timestamp,
  })
  await batch.commit()

  // Keep event history bounded in production without making the client wait for cleanup.
  ref.collection('uploadFailures').orderBy('createdAt', 'desc').offset(MAX_FAILURE_EVENTS).get()
    .then((snapshot) => Promise.all(snapshot.docs.map((doc) => doc.ref.delete())))
    .catch((error) => console.warn('Could not trim Everhomes upload diagnostics:', error.message))

  res.status(200).json({ ok: true })
})

export const deleteEverhomesDraft = endpoint('delete', async (req, res) => {
  const session = parseSession(req.body)
  const ref = db.collection(session.collection).doc(session.draftId)
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref)
    if (!snapshot.exists) throw new DraftRequestError(404, 'Draft not found')
    const data = snapshot.data()
    if (data.draftAccessKey !== session.draftAccessKey) {
      throw new DraftRequestError(403, 'This resume link does not have access to the draft')
    }
    if (!['draft', 'failed', 'pending', 'deleting'].includes(data.status)) {
      throw new DraftRequestError(409, 'A submitted or active report cannot be cleared from the staff form')
    }
    transaction.update(ref, {
      status: 'deleting',
      updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
    })
  })

  const bucket = firebaseAdmin.storage().bucket()
  try {
    await bucket.deleteFiles({ prefix: `${session.collection}/${session.draftId}/` })
    await db.recursiveDelete(ref)
  } catch (error) {
    await ref.update({
      status: 'deleting',
      clearError: `Clear failed and will need to be retried: ${error.message}`,
      updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
    }).catch(() => {})
    throw error
  }

  res.status(200).json({ ok: true })
})
