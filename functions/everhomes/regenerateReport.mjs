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
import { createHash, randomUUID } from 'node:crypto'
import { Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import unzipper from 'unzipper'
import { requireEverhomesAdmin } from './requireEverhomesAdmin.mjs'
import { selectDirectRegenerationAssets } from './regenerationAssets.mjs'

const MAX_RESTORED_PHOTO_BYTES = 15 * 1024 * 1024

function archiveImageContentType(extension) {
  return {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    heic: 'image/heic',
    heif: 'image/heif',
    avif: 'image/avif',
  }[extension] ?? 'application/octet-stream'
}

function safeArchiveKey(value, fallback) {
  const raw = String(value ?? fallback)
  const readable = raw
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60) || fallback
  const digest = createHash('sha256').update(raw).digest('hex').slice(0, 8)
  return `${readable}_${digest}`
}

export const regenerateReport = onRequest(
  {
    region: 'australia-southeast1',
    // This request waits for the generator to finish so an upstream failure can
    // be surfaced to the admin. Its timeout is deliberately longer than the
    // internal generator request deadline.
    timeoutSeconds: 900,
    memory: '4GiB',
    cpu: 2,
    concurrency: 1,
    maxInstances: 3,
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
    const archiveImageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'avif']
    const requestStartedAt = Date.now()
    const logStage = (stage, details = {}) => {
      const { rss, heapUsed, external, arrayBuffers } = process.memoryUsage()
      console.log(JSON.stringify({
        scope: 'everhomes-regeneration',
        stage,
        collection,
        docId,
        regenerationRunId,
        elapsedMs: Date.now() - requestStartedAt,
        rssBytes: rss,
        heapUsedBytes: heapUsed,
        externalBytes: external,
        arrayBufferBytes: arrayBuffers,
        ...details,
      }))
    }

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
        const filenameRoots = [
          `${safeArchiveKey(room.id, 'room')}_${index + 1}`,
          `${cleanLabel}_${index + 1}`,
        ]
        photoAssets.push({
          asset: photo,
          label: `room photo ${index + 1} in ${room.label ?? room.id ?? 'unknown room'}`,
          archiveGroup: 'room',
          archiveFilenames: filenameRoots.flatMap((filenameRoot) =>
            archiveImageExtensions.map((extension) => `${filenameRoot}.${extension}`),
          ),
          temporaryStoragePath: `${regenerationRoot}/${filenameRoots[0]}`,
        })
      }
    }
    for (const [slotKey, photos] of Object.entries(payload.marketingPhotos ?? {})) {
      if (!Array.isArray(photos)) continue
      for (let index = 0; index < photos.length; index++) {
        const photo = photos[index]
        const legacySlotKey = slotKey.replace(/[^a-zA-Z0-9_-]/g, '_')
        const safeSlotKey = safeArchiveKey(slotKey, 'marketing')
        const filenameRoots = [
          `${safeSlotKey}_${index + 1}`,
          `${legacySlotKey}_${index + 1}`,
        ]
        photoAssets.push({
          asset: photo,
          label: `marketing photo ${index + 1} in ${slotKey}`,
          archiveGroup: 'marketing',
          archiveFilenames: filenameRoots.flatMap((filenameRoot) =>
            archiveImageExtensions.map((extension) => `${filenameRoot}.${extension}`),
          ),
          temporaryStoragePath: `${regenerationRoot}/marketing/${safeSlotKey}_${index + 1}`,
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

    const zipStoragePath = data.photosStoragePath?.startsWith(storagePrefix)
      ? data.photosStoragePath
      : `${storagePrefix}photos.zip`
    const zipFile = bucket.file(zipStoragePath)
    const [zipExists] = await zipFile.exists()
    // A completed report deliberately removes its individual photos after the
    // retained archive is published. When that archive exists, checking every
    // old photo path adds minutes of guaranteed misses to large regenerations.
    // Signatures are not archived and must still be checked directly.
    const directCheckAssets = selectDirectRegenerationAssets(allAssets, zipExists)
    logStage('assets.discovered', {
      photoCount: photoAssets.length,
      signatureCount: signatureAssets.length,
      archiveAvailable: zipExists,
      directCheckCount: directCheckAssets.length,
    })
    const directResults = await runConcurrent(
      directCheckAssets.map((record) => () => refreshStoredAssetUrl(
        record.asset,
        record.storagePathKey,
        record.urlKey,
        record.label,
      )),
    )
    directCheckAssets.forEach((record, index) => {
      record.available = directResults[index] === true
    })
    logStage('direct-assets.checked', {
      checkedCount: directCheckAssets.length,
      availableCount: directCheckAssets.filter((record) => record.available).length,
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
      if (!zipExists) {
        return res.status(409).json({
          error: 'Regeneration stopped because the original photo archive is unavailable.',
          details: `${missingPhotos.length} expected photo(s) could not be restored. The existing PDF was left unchanged.`,
        })
      }

      const archiveEntries = new Map()
      for (const record of missingPhotos) {
        for (const filename of record.archiveFilenames) {
          archiveEntries.set(`${record.archiveGroup}:${filename}`, record)
        }
      }
      const restoredRecords = new Set()
      let restoredImageBytes = 0
      logStage('archive.restore.started', {
        missingPhotoCount: missingPhotos.length,
        zipStoragePath,
      })
      try {
        const zipSource = zipFile.createReadStream()
        // Google Cloud Storage's retrying PassThrough already owns several
        // listeners; unzipper legitimately adds more for this one stream.
        zipSource.setMaxListeners(Math.max(zipSource.getMaxListeners(), 20))
        const archive = zipSource.pipe(unzipper.Parse({ forceStream: true }))
        for await (const entry of archive) {
          if (entry.type === 'Directory') {
            entry.autodrain()
            continue
          }

          const archivePath = entry.path.replaceAll('\\', '/')
          const filename = archivePath.split('/').pop()
          const archiveGroup = archivePath.includes('/marketing/') ? 'marketing' : 'room'
          const record = archiveEntries.get(`${archiveGroup}:${filename}`)
          if (!record || restoredRecords.has(record)) {
            entry.autodrain()
            continue
          }

          const extension = filename.split('.').pop().toLowerCase()
          const contentType = archiveImageContentType(extension)
          const storagePath = `${record.temporaryStoragePath}.${extension}`
          const file = bucket.file(storagePath)
          temporaryStoragePaths.push(storagePath)
          let currentImageBytes = 0
          const sizeGuard = new Transform({
            transform(chunk, _encoding, callback) {
              currentImageBytes += chunk.length
              restoredImageBytes += chunk.length
              if (currentImageBytes >= MAX_RESTORED_PHOTO_BYTES) {
                callback(new Error(`Archived photo ${filename} exceeds the 15 MB per-image safety limit.`))
                return
              }
              callback(null, chunk)
            },
          })
          await pipeline(
            entry,
            sizeGuard,
            file.createWriteStream({ resumable: false, metadata: { contentType } }),
          )
          const [url] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + urlExpiryMs,
          })
          record.archiveFilename = filename
          record.asset.storagePath = storagePath
          record.asset.url = url
          record.available = true
          restoredRecords.add(record)
          if (restoredRecords.size % 25 === 0 || restoredRecords.size === missingPhotos.length) {
            logStage('archive.restore.progress', {
              restoredPhotoCount: restoredRecords.size,
              missingPhotoCount: missingPhotos.length,
              restoredImageBytes,
            })
          }
        }
      } catch (error) {
        console.error(`regenerateReport: could not read ${zipStoragePath}:`, error.message)
        await Promise.allSettled(
          temporaryStoragePaths.map((storagePath) => bucket.file(storagePath).delete({ ignoreNotFound: true })),
        )
        return res.status(409).json({
          error: 'Regeneration stopped because the original photo archive could not be restored.',
          details: 'The existing PDF and photo archive were left unchanged.',
        })
      }

      logStage('archive.restore.finished', {
        restoredPhotoCount: restoredRecords.size,
        restoredImageBytes,
      })

      const unrestorablePhotos = missingPhotos.filter((record) => !record.available)
      if (unrestorablePhotos.length) {
        await Promise.allSettled(
          temporaryStoragePaths.map((storagePath) => bucket.file(storagePath).delete({ ignoreNotFound: true })),
        )
        return res.status(409).json({
          error: 'Regeneration stopped because the photo archive is incomplete.',
          details: `Missing ${unrestorablePhotos.map((record) => record.label).join(', ')}. The existing PDF and photo archive were left unchanged.`,
        })
      }
    }

    const readyCount = allAssets.filter((record) => record.available).length
    logStage('assets.prepared', {
      readyCount,
      totalAssetCount: allAssets.length,
      temporaryPhotoCount: temporaryStoragePaths.length,
    })

    const regenerationAccessKey = `${randomUUID().replaceAll('-', '')}${randomUUID().replaceAll('-', '')}`
    try {
      await db.runTransaction(async (transaction) => {
        const currentSnapshot = await transaction.get(docRef)
        const current = currentSnapshot.data()
        if (['processing', 'regenerating', 'pending'].includes(current.status)) {
          const conflict = new Error('This report is already being generated.')
          conflict.status = 409
          throw conflict
        }
        transaction.update(docRef, {
          status: 'regenerating',
          regenStartedAt: new Date().toISOString(),
          regenerationAccessKey,
          regenerationError: firebaseAdmin.firestore.FieldValue.delete(),
          error: firebaseAdmin.firestore.FieldValue.delete(),
        })
      })
    } catch (error) {
      await Promise.allSettled(
        temporaryStoragePaths.map((storagePath) => bucket.file(storagePath).delete({ ignoreNotFound: true })),
      )
      return res.status(error.status ?? 409).json({ error: error.message })
    }

    const projectId = JSON.parse(process.env.FIREBASE_CONFIG ?? '{}').projectId
      ?? process.env.GCLOUD_PROJECT
    const fnUrl = `https://australia-southeast1-${projectId}.cloudfunctions.net/generateInspectionReport`
    payload.regenerationAccessKey = regenerationAccessKey

    try {
      logStage('generation.started', {
        temporaryPhotoCount: temporaryStoragePaths.length,
      })
      const resp = await fetch(fnUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(360_000),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err.details ?? err.error ?? `HTTP ${resp.status}`)
      }

      logStage('generation.finished', { status: resp.status })

      await Promise.allSettled(
        temporaryStoragePaths.map((storagePath) => bucket.file(storagePath).delete({ ignoreNotFound: true })),
      )
      return res.status(200).json({
        success: true,
        message: 'Regeneration complete.',
      })
    } catch (err) {
      logStage('generation.failed', { error: err.message })
      await Promise.allSettled(
        temporaryStoragePaths.map((storagePath) => bucket.file(storagePath).delete({ ignoreNotFound: true })),
      )
      await docRef.update({
        status: data.status === 'complete' ? 'complete' : 'failed',
        regenerationError: `Regeneration failed: ${err.message}`,
        regenerationAccessKey: firebaseAdmin.firestore.FieldValue.delete(),
      }).catch(() => {})
      return res.status(500).json({
        error: 'Failed to start report generation',
        details: err.message,
      })
    }
  },
)
