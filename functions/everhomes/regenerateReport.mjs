// functions/everhomes/regenerateReport.mjs
//
// Re-runs the full report generation pipeline for an existing submission.
//
// Flow:
//   1. Load the stored submissionPayload from Firestore.
//   2. Re-sign the original assets already stored under this report folder.
//   3. Reset the report status and call generateInspectionReport.

import { onRequest } from 'firebase-functions/v2/https'
import { firebaseAdmin, db } from '../config/firebase.mjs'
import { randomUUID } from 'node:crypto'
import { requireEverhomesAdmin } from './requireEverhomesAdmin.mjs'

export const regenerateReport = onRequest(
  {
    region: 'australia-southeast1',
    // This request waits for the generator to finish so an upstream failure can
    // be surfaced to the admin. It must match the generator's upper bound.
    timeoutSeconds: 300,
    memory: '512MiB',
    cors: true,
  },
  async (req, res) => {
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') return res.status(204).send('')
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })

    try {
      await requireEverhomesAdmin(req)
    } catch (error) {
      return res.status(error.status ?? 500).json({ error: error.message ?? 'Could not verify administrator access' })
    }

    const { collection, docId } = req.body
    if (!collection || !docId) {
      return res.status(400).json({ error: 'Missing collection or docId' })
    }
    if (!['inspections', 'handovers'].includes(collection)) {
      return res.status(400).json({ error: 'Invalid collection' })
    }

    const docRef = db.collection(collection).doc(docId)
    const snap = await docRef.get()
    if (!snap.exists) return res.status(404).json({ error: 'Report not found' })

    const data = snap.data()
    if (!data.submissionPayload) {
      return res.status(400).json({
        error: 'No stored payload - this report was submitted before the regenerate feature was added.',
      })
    }

    // Deep clone so signed URLs are used only for this request and are never
    // persisted back into the report document.
    const payload = JSON.parse(JSON.stringify(data.submissionPayload))
    payload.draftAccessKey = data.draftAccessKey

    const bucket = firebaseAdmin.storage().bucket()
    const storagePrefix = `${collection}/${docId}/`
    const urlExpiryMs = 60 * 60 * 1000

    // Only sign objects inside the report's own folder. Even though this is an
    // admin endpoint, that prevents a stored payload from becoming a way to
    // mint a URL for an unrelated object in the bucket.
    async function refreshStoredAssetUrl(asset, storagePathKey, urlKey, label) {
      const storagePath = typeof asset?.[storagePathKey] === 'string'
        ? asset[storagePathKey]
        : ''
      if (!storagePath.startsWith(storagePrefix)) return false

      try {
        const file = bucket.file(storagePath)
        const [exists] = await file.exists()
        if (!exists) {
          console.warn(`regenerateReport: stored ${label} is missing: ${storagePath}`)
          return false
        }
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + urlExpiryMs,
        })
        asset[urlKey] = url
        return true
      } catch (error) {
        console.warn(`regenerateReport: could not sign stored ${label}:`, error.message)
        return false
      }
    }

    async function runConcurrent(tasks, limit = 10) {
      const results = []
      let index = 0
      async function worker() {
        while (index < tasks.length) {
          const taskIndex = index++
          results[taskIndex] = await tasks[taskIndex]()
        }
      }
      await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker))
      return results
    }

    // Reuse the original room, marketing, and signature objects. Unlike the
    // old ZIP-only path, this works even when the first generation died before
    // it could produce photos.zip.
    const refreshTasks = []
    for (const room of payload.rooms ?? []) {
      for (const photo of room.photos ?? []) {
        refreshTasks.push(() => refreshStoredAssetUrl(
          photo,
          'storagePath',
          'url',
          `room photo in ${room.label ?? room.id ?? 'unknown room'}`,
        ))
      }
    }
    for (const [slotKey, photos] of Object.entries(payload.marketingPhotos ?? {})) {
      if (!Array.isArray(photos)) continue
      for (const photo of photos) {
        refreshTasks.push(() => refreshStoredAssetUrl(
          photo,
          'storagePath',
          'url',
          `marketing photo in ${slotKey}`,
        ))
      }
    }
    if (payload.signatures?.staff) {
      refreshTasks.push(() => refreshStoredAssetUrl(
        payload.signatures.staff,
        'signatureStoragePath',
        'signatureUrl',
        'staff signature',
      ))
    }
    for (const tenant of payload.signatures?.tenants ?? []) {
      refreshTasks.push(() => refreshStoredAssetUrl(
        tenant,
        'signatureStoragePath',
        'signatureUrl',
        'tenant signature',
      ))
    }

    const refreshedCount = (await runConcurrent(refreshTasks)).filter(Boolean).length
    console.log(`regenerateReport: refreshed ${refreshedCount}/${refreshTasks.length} stored asset URLs for ${collection}/${docId}`)

    const regenerationAccessKey = `${randomUUID().replaceAll('-', '')}${randomUUID().replaceAll('-', '')}`
    await docRef.update({
      status: 'pending',
      regenStartedAt: new Date().toISOString(),
      regenerationAccessKey,
      error: firebaseAdmin.firestore.FieldValue.delete(),
    }).catch(() => {})

    const projectId = JSON.parse(process.env.FIREBASE_CONFIG ?? '{}').projectId
      ?? process.env.GCLOUD_PROJECT
    const fnUrl = `https://australia-southeast1-${projectId}.cloudfunctions.net/generateInspectionReport`
    payload.regenerationAccessKey = regenerationAccessKey

    try {
      const resp = await fetch(fnUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err.details ?? err.error ?? `HTTP ${resp.status}`)
      }

      return res.status(200).json({
        success: true,
        message: 'Regeneration complete.',
      })
    } catch (err) {
      await docRef.update({
        status: 'failed',
        error: `Regeneration failed: ${err.message}`,
      }).catch(() => {})
      return res.status(500).json({
        error: 'Failed to start report generation',
        details: err.message,
      })
    }
  },
)
