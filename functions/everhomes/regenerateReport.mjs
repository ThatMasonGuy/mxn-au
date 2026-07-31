// functions/everhomes/regenerateReport.mjs
//
// Re-runs the full report generation pipeline for an existing submission.
//
// Flow:
//   1. Load the stored submissionPayload from Firestore.
//   2. Re-sign original assets that still exist.
//   3. Restore deleted room/marketing photos from the retained photos ZIP.
//   4. Refuse to regenerate if any expected asset is still unavailable.
//   5. Reset the report status and call generateInspectionReport.

import { onRequest } from 'firebase-functions/v2/https'
import { firebaseAdmin, db } from '../config/firebase.mjs'
import JSZip from 'jszip'
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
    const regenerationRunId = randomUUID()
    const regenerationRoot = `${storagePrefix}regen_photos/${regenerationRunId}`
    const temporaryStoragePaths = []

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

    const photoAssets = []
    for (const room of payload.rooms ?? []) {
      for (let index = 0; index < (room.photos ?? []).length; index++) {
        const photo = room.photos[index]
        const cleanLabel = (room.label ?? '').replace(/[^a-zA-Z0-9]/g, '_')
        const filename = `${cleanLabel}_${index + 1}.jpg`
        photoAssets.push({
          asset: photo,
          label: `room photo ${index + 1} in ${room.label ?? room.id ?? 'unknown room'}`,
          archiveFilenames: [filename],
          temporaryStoragePath: `${regenerationRoot}/${filename}`,
        })
      }
    }
    for (const [slotKey, photos] of Object.entries(payload.marketingPhotos ?? {})) {
      if (!Array.isArray(photos)) continue
      for (let index = 0; index < photos.length; index++) {
        const photo = photos[index]
        photoAssets.push({
          asset: photo,
          label: `marketing photo ${index + 1} in ${slotKey}`,
          archiveFilenames: ['jpg', 'png', 'webp'].map((ext) => `${slotKey}_${index + 1}.${ext}`),
          temporaryStoragePath: `${regenerationRoot}/marketing/${slotKey}_${index + 1}`,
        })
      }
    }

    const signatureAssets = []
    const staffSignature = payload.signatures?.staff
    if (
      staffSignature
      && (
        staffSignature.name
        || staffSignature.date
        || staffSignature.signatureUrl
        || staffSignature.signatureStoragePath
      )
    ) {
      signatureAssets.push({ asset: staffSignature, label: 'staff signature' })
    }
    const tenantSignatures = Array.isArray(payload.signatures?.tenants)
      ? payload.signatures.tenants
      : []
    for (let index = 0; index < tenantSignatures.length; index++) {
      const tenant = tenantSignatures[index]
      if (!tenant?.signatureUrl && !tenant?.signatureStoragePath) continue
      signatureAssets.push({ asset: tenant, label: `tenant signature ${index + 1}` })
    }

    // First use the individual files when they are still present. This covers
    // interrupted first-generation attempts that never reached cleanup.
    const allAssets = [
      ...photoAssets.map((record) => ({
        ...record,
        storagePathKey: 'storagePath',
        urlKey: 'url',
      })),
      ...signatureAssets.map((record) => ({
        ...record,
        storagePathKey: 'signatureStoragePath',
        urlKey: 'signatureUrl',
      })),
    ]
    const directResults = await runConcurrent(
      allAssets.map((record) => () => refreshStoredAssetUrl(
        record.asset,
        record.storagePathKey,
        record.urlKey,
        record.label,
      )),
    )
    allAssets.forEach((record, index) => {
      record.available = directResults[index] === true
    })

    const missingSignatures = allAssets
      .filter((record) => record.storagePathKey === 'signatureStoragePath' && !record.available)
    if (missingSignatures.length) {
      return res.status(409).json({
        error: 'Regeneration stopped because a saved signature is unavailable.',
        details: `Missing ${missingSignatures.map((record) => record.label).join(', ')}. The existing PDF and photo archive were left unchanged.`,
      })
    }

    const missingPhotos = allAssets.filter(
      (record) => record.storagePathKey === 'storagePath' && !record.available,
    )
    if (missingPhotos.length) {
      const zipStoragePath = `${storagePrefix}photos.zip`
      const zipFile = bucket.file(zipStoragePath)
      const [zipExists] = await zipFile.exists()
      if (!zipExists) {
        return res.status(409).json({
          error: 'Regeneration stopped because the original photo archive is unavailable.',
          details: `${missingPhotos.length} expected photo(s) could not be restored. The existing PDF was left unchanged.`,
        })
      }

      let zip
      try {
        const [zipBuffer] = await zipFile.download()
        zip = await JSZip.loadAsync(zipBuffer)
      } catch (error) {
        console.error(`regenerateReport: could not read ${zipStoragePath}:`, error.message)
        return res.status(409).json({
          error: 'Regeneration stopped because the original photo archive could not be read.',
          details: 'The existing PDF and photo archive were left unchanged.',
        })
      }

      const archiveEntries = new Map()
      for (const [archivePath, entry] of Object.entries(zip.files)) {
        if (entry.dir) continue
        archiveEntries.set(archivePath.split('/').pop(), entry)
      }

      for (const record of missingPhotos) {
        const filename = record.archiveFilenames.find((name) => archiveEntries.has(name))
        record.archiveFilename = filename
        record.archiveEntry = filename ? archiveEntries.get(filename) : null
      }
      const unrestorablePhotos = missingPhotos.filter((record) => !record.archiveEntry)
      if (unrestorablePhotos.length) {
        return res.status(409).json({
          error: 'Regeneration stopped because the photo archive is incomplete.',
          details: `Missing ${unrestorablePhotos.map((record) => record.label).join(', ')}. The existing PDF and photo archive were left unchanged.`,
        })
      }

      try {
        await runConcurrent(missingPhotos.map((record) => async () => {
          const buffer = Buffer.from(await record.archiveEntry.async('arraybuffer'))
          const extension = record.archiveFilename.split('.').pop().toLowerCase()
          const contentType = extension === 'png'
            ? 'image/png'
            : extension === 'webp'
              ? 'image/webp'
              : 'image/jpeg'
          const storagePath = `${record.temporaryStoragePath}.${extension}`
          const file = bucket.file(storagePath)
          await file.save(buffer, { resumable: false, metadata: { contentType } })
          temporaryStoragePaths.push(storagePath)
          const [url] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + urlExpiryMs,
          })
          record.asset.storagePath = storagePath
          record.asset.url = url
          record.available = true
        }))
      } catch (error) {
        await Promise.allSettled(
          temporaryStoragePaths.map((storagePath) => bucket.file(storagePath).delete({ ignoreNotFound: true })),
        )
        console.error('regenerateReport: could not restore archived photos:', error.message)
        return res.status(500).json({
          error: 'Regeneration stopped while restoring the archived photos.',
          details: 'The existing PDF and photo archive were left unchanged.',
        })
      }
    }

    const readyCount = allAssets.filter((record) => record.available).length
    console.log(`regenerateReport: prepared ${readyCount}/${allAssets.length} stored assets for ${collection}/${docId}`)

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

      await Promise.allSettled(
        temporaryStoragePaths.map((storagePath) => bucket.file(storagePath).delete({ ignoreNotFound: true })),
      )
      return res.status(200).json({
        success: true,
        message: 'Regeneration complete.',
      })
    } catch (err) {
      await Promise.allSettled(
        temporaryStoragePaths.map((storagePath) => bucket.file(storagePath).delete({ ignoreNotFound: true })),
      )
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
