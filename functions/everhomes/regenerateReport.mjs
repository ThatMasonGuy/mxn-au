// functions/everhomes/regenerateReport.mjs
//
// Re-runs the full report generation pipeline for an existing submission.
//
// Flow:
//   1. Load stored submissionPayload from Firestore (written by SubmitModal on first submit)
//   2. Read the photos ZIP from Storage at {collection}/{docId}/photos.zip
//   3. Unzip with jszip, re-upload each photo to a temp regen_photos/ path
//   4. Get fresh signed download URLs and patch them into the payload
//   5. Reset Firestore doc status to "pending"
//   6. Call generateInspectionReport internally to overwrite the PDF and resend emails

import { onRequest } from 'firebase-functions/v2/https'
import { firebaseAdmin, db } from '../config/firebase.mjs'
import JSZip from 'jszip'
import { randomUUID } from 'node:crypto'
import { requireEverhomesAdmin } from './requireEverhomesAdmin.mjs'

export const regenerateReport = onRequest(
  {
    region: 'australia-southeast1',
    timeoutSeconds: 60,
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

    // ── 1. Load doc and stored payload ───────────────────────────────────────
    const docRef = db.collection(collection).doc(docId)
    const snap = await docRef.get()
    if (!snap.exists) return res.status(404).json({ error: 'Report not found' })

    const data = snap.data()
    if (!data.submissionPayload) {
      return res.status(400).json({
        error: 'No stored payload — this report was submitted before the regenerate feature was added.',
      })
    }

    // Deep clone so we can mutate without touching Firestore data
    const payload = JSON.parse(JSON.stringify(data.submissionPayload))
    // The original submission payload deliberately excludes this bearer
    // capability. Regeneration runs server-side, so it can safely retrieve it
    // from the protected report document before calling the same pipeline.
    payload.draftAccessKey = data.draftAccessKey

    // ── 2. Download photos ZIP ────────────────────────────────────────────────
    const bucket = firebaseAdmin.storage().bucket()
    const zipStoragePath = `${collection}/${docId}/photos.zip`
    const zipFile = bucket.file(zipStoragePath)

    const [zipExists] = await zipFile.exists()
    if (!zipExists) {
      return res.status(400).json({
        error: 'Photos ZIP not found in storage — cannot regenerate without the original photos.',
      })
    }

    const [zipBuffer] = await zipFile.download()
    const zip = await JSZip.loadAsync(zipBuffer)

    // Build a flat lookup: basename → JSZip entry
    const zipEntries = {}
    for (const [path, entry] of Object.entries(zip.files)) {
      if (!entry.dir) {
        zipEntries[path.split('/').pop()] = entry
      }
    }

    // ── 3. Re-upload photos to temp paths, patch payload URLs ────────────────
    const regenRoot = `${collection}/${docId}/regen_photos`

    async function uploadAndSign(buffer, storagePath, contentType = 'image/jpeg') {
      const file = bucket.file(storagePath)
      await file.save(buffer, { metadata: { contentType } })
      // 7-day URL is plenty — generateInspectionReport downloads immediately then deletes them
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      })
      return url
    }

    // Room photos — filenames match {RoomLabel.replace(/[^a-zA-Z0-9]/g,'_')}_{i+1}.jpg
    for (const room of payload.rooms ?? []) {
      for (let i = 0; i < (room.photos ?? []).length; i++) {
        const photo = room.photos[i]
        const cleanLabel = (room.label ?? '').replace(/[^a-zA-Z0-9]/g, '_')
        const filename = `${cleanLabel}_${i + 1}.jpg`
        const entry = zipEntries[filename]
        if (entry) {
          const buf = Buffer.from(await entry.async('arraybuffer'))
          const uploadPath = `${regenRoot}/${filename}`
          photo.url = await uploadAndSign(buf, uploadPath)
          photo.storagePath = uploadPath
        } else {
          console.warn(`regenerateReport: no ZIP entry for room photo "${filename}" — skipping`)
        }
      }
    }

    // Marketing photos — filenames are {slotKey}_{i+1}.{ext}
    for (const [slotKey, photos] of Object.entries(payload.marketingPhotos ?? {})) {
      if (!Array.isArray(photos)) continue
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]
        let found = false
        for (const ext of ['jpg', 'png', 'webp']) {
          const filename = `${slotKey}_${i + 1}.${ext}`
          const entry = zipEntries[filename]
          if (entry) {
            const buf = Buffer.from(await entry.async('arraybuffer'))
            const uploadPath = `${regenRoot}/marketing/${filename}`
            const ct = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
            photo.url = await uploadAndSign(buf, uploadPath, ct)
            photo.storagePath = uploadPath
            found = true
            break
          }
        }
        if (!found) {
          console.warn(`regenerateReport: no ZIP entry for marketing photo "${slotKey}[${i}]" — skipping`)
        }
      }
    }

    // ── 4. Reset Firestore status so the Firestore listener in the browser
    //       can track progress if the admin has that page open.
    const regenerationAccessKey = `${randomUUID().replaceAll('-', '')}${randomUUID().replaceAll('-', '')}`
    await docRef.update({
      status: 'pending',
      regenStartedAt: new Date().toISOString(),
      regenerationAccessKey,
      // Clear stale error so the status badge resets
      error: firebaseAdmin.firestore.FieldValue.delete(),
    }).catch(() => {})

    // ── 5. Call generateInspectionReport ─────────────────────────────────────
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
        message: 'Regeneration queued — report status will update shortly.',
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
  }
)
