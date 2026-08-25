import { onRequest } from 'firebase-functions/v2/https'
import { firebaseAdmin, db } from '../config/firebase.mjs'
import { estimateLegacyFirebaseStorageUsd } from '../everhomes/storageUsageCore.mjs'
import { requireSiteAdmin } from './requireSiteAdmin.mjs'
import {
  createActivitySummary,
  createCollectionSummary,
  createStorageSummary,
  createUserSummary,
} from './overviewCore.mjs'

const ALLOWED_ORIGINS = [
  'https://mxn.au',
  'https://www.mxn.au',
  'https://mxn-au.web.app',
  'https://mxn-au.firebaseapp.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]
const RECENT_EVENT_LIMIT = 100
const COLLECTION_SAMPLE_LIMIT = 5

async function loadUsers() {
  const authPage = await firebaseAdmin.auth().listUsers(1000)
  const profileRefs = authPage.users.map((user) => db.collection('users').doc(user.uid))
  const profileDocs = profileRefs.length > 0 ? await db.getAll(...profileRefs) : []
  const profiles = new Map(profileDocs.map((snapshot) => [snapshot.id, snapshot.data() ?? {}]))
  const items = authPage.users
    .map((user) => createUserSummary(user, profiles.get(user.uid)))
    .sort((a, b) => (b.lastSignInAt ?? '').localeCompare(a.lastSignInAt ?? ''))

  return {
    items,
    total: items.length,
    active: items.filter((user) => user.status === 'active').length,
    disabled: items.filter((user) => user.status === 'disabled').length,
    siteAdmins: items.filter((user) => user.roles.includes('siteAdmin')).length,
    truncated: Boolean(authPage.pageToken),
  }
}

async function loadActivity(userItems) {
  const userLookup = new Map(userItems.map((user) => [user.uid, {
    name: user.name,
    email: user.email,
  }]))
  const snapshot = await db.collectionGroup('userEvents')
    .orderBy('timestamp', 'desc')
    .limit(RECENT_EVENT_LIMIT)
    .get()

  return {
    items: snapshot.docs.map((document) => createActivitySummary(document, userLookup)),
    loaded: snapshot.size,
    limit: RECENT_EVENT_LIMIT,
    scope: 'Signed-in operational events stored by MXN.au; this is separate from optional Google Analytics.',
  }
}

async function loadFirestoreInventory() {
  const collections = await db.listCollections()
  const items = await Promise.all(collections.map(async (collectionRef) => {
    const [countSnapshot, sampleSnapshot] = await Promise.all([
      collectionRef.count().get(),
      collectionRef.limit(COLLECTION_SAMPLE_LIMIT).get(),
    ])
    return createCollectionSummary(
      collectionRef.id,
      countSnapshot.data().count,
      sampleSnapshot.docs,
    )
  }))

  items.sort((a, b) => b.documents - a.documents || a.name.localeCompare(b.name))
  return {
    items,
    topLevelCollections: items.length,
    topLevelDocuments: items.reduce((total, collection) => total + collection.documents, 0),
    estimatedDocumentBytes: items.reduce(
      (total, collection) => total + (collection.estimatedDocumentBytes ?? 0),
      0,
    ),
    scope: 'Top-level collections only. Document-size estimates exclude indexes, subcollections and Firestore metadata.',
  }
}

async function loadStorageInventory() {
  const bucket = firebaseAdmin.storage().bucket()
  const [metadata] = await bucket.getMetadata()
  const files = await bucket.getFiles()
  const usage = createStorageSummary(files[0])
  const legacyEstimate = bucket.name.endsWith('.appspot.com')
    ? estimateLegacyFirebaseStorageUsd(usage.bytes)
    : null

  return {
    bucket: bucket.name,
    location: metadata.location ?? null,
    storageClass: metadata.storageClass ?? null,
    softDeleteRetentionSeconds: Number(metadata.softDeletePolicy?.retentionDurationSeconds ?? 0),
    ...usage,
    estimate: legacyEstimate
      ? {
          ...legacyEstimate,
          currency: 'USD',
          basis: 'Legacy Firebase default-bucket storage estimate only.',
          pricingReviewedAt: '2026-08-25',
        }
      : null,
  }
}

function asSourceResult(loader) {
  return loader()
    .then((data) => ({ status: 'available', data }))
    .catch((error) => {
      console.error('Site admin source failed:', error)
      return { status: 'error', error: 'This source could not be loaded. Try refreshing the snapshot.' }
    })
}

export const getSiteAdminOverview = onRequest(
  {
    region: 'australia-southeast1',
    timeoutSeconds: 120,
    memory: '512MiB',
    cors: ALLOWED_ORIGINS,
  },
  async (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.set('Access-Control-Allow-Headers', 'Authorization')
    res.set('Cache-Control', 'private, no-store')
    if (req.method === 'OPTIONS') return res.status(204).send('')
    if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' })

    try {
      await requireSiteAdmin(req)
    } catch (error) {
      return res.status(error.status ?? 500).json({
        error: error.message ?? 'Could not verify site administrator access',
      })
    }

    const users = await asSourceResult(loadUsers)
    const userItems = users.status === 'available' ? users.data.items : []
    const [activity, firestore, storage] = await Promise.all([
      asSourceResult(() => loadActivity(userItems)),
      asSourceResult(loadFirestoreInventory),
      asSourceResult(loadStorageInventory),
    ])

    return res.status(200).json({
      generatedAt: new Date().toISOString(),
      readOnly: true,
      sources: {
        users,
        activity,
        firestore,
        storage,
        ga4: {
          status: 'not_connected',
          detail: 'The GA4 reporting API is not connected to this admin centre.',
        },
        billing: {
          status: 'not_connected',
          detail: 'Cloud Billing export is not connected, so a consolidated Firebase cost estimate is unavailable.',
        },
      },
    })
  },
)
