import { onRequest } from 'firebase-functions/v2/https'
import { firebaseAdmin } from '../config/firebase.mjs'
import { requireEverhomesAdmin } from './requireEverhomesAdmin.mjs'
import {
  LEGACY_FIREBASE_FREE_STORAGE_GB,
  LEGACY_FIREBASE_STORAGE_USD_PER_GB_MONTH,
  addStorageObject,
  createStorageUsageSummary,
  estimateLegacyFirebaseStorageUsd,
} from './storageUsageCore.mjs'

const MAX_RESULTS_PER_PAGE = 1000

export const getEverhomesStorageUsage = onRequest(
  {
    region: 'australia-southeast1',
    timeoutSeconds: 120,
    memory: '256MiB',
    cors: true,
  },
  async (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.set('Access-Control-Allow-Headers', 'Authorization')
    if (req.method === 'OPTIONS') return res.status(204).send('')
    if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' })

    try {
      await requireEverhomesAdmin(req)
    } catch (error) {
      return res.status(error.status ?? 500).json({
        error: error.message ?? 'Could not verify administrator access',
      })
    }

    try {
      const bucket = firebaseAdmin.storage().bucket()
      const [bucketMetadata] = await bucket.getMetadata()
      const summary = createStorageUsageSummary()
      let pageToken

      do {
        const [files, nextQuery] = await bucket.getFiles({
          autoPaginate: false,
          maxResults: MAX_RESULTS_PER_PAGE,
          pageToken,
        })
        for (const file of files) {
          addStorageObject(summary, {
            name: file.name,
            size: file.metadata?.size,
          })
        }
        pageToken = nextQuery?.pageToken
      } while (pageToken)

      const everhomes = {
        bytes: summary.inspections.bytes + summary.handovers.bytes,
        objects: summary.inspections.objects + summary.handovers.objects,
      }
      const legacyPricing = bucket.name.endsWith('.appspot.com')
        ? estimateLegacyFirebaseStorageUsd(summary.total.bytes)
        : null

      return res.status(200).json({
        bucket: {
          name: bucket.name,
          location: bucketMetadata.location ?? null,
          storageClass: bucketMetadata.storageClass ?? null,
          softDeleteRetentionSeconds: Number(
            bucketMetadata.softDeletePolicy?.retentionDurationSeconds ?? 0,
          ),
        },
        usage: {
          ...summary,
          everhomes,
        },
        pricing: legacyPricing
          ? {
              currency: 'USD',
              freeStorageGb: LEGACY_FIREBASE_FREE_STORAGE_GB,
              storageUsdPerGbMonth: LEGACY_FIREBASE_STORAGE_USD_PER_GB_MONTH,
              ...legacyPricing,
              basis: 'Legacy Firebase default bucket storage estimate',
              updatedAt: '2026-08-25',
            }
          : null,
        scannedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Could not calculate Everhomes Storage usage:', error)
      return res.status(500).json({ error: 'Could not calculate Cloud Storage usage' })
    }
  },
)
