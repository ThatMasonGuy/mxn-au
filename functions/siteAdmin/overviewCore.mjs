const FALLBACK_NAME = 'Unnamed user'

export function toIsoString(value) {
  if (!value) return null
  if (typeof value.toDate === 'function') return value.toDate().toISOString()

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export function createUserSummary(authUser, profile = {}) {
  const firstName = typeof profile.firstName === 'string' ? profile.firstName.trim() : ''
  const lastName = typeof profile.lastName === 'string' ? profile.lastName.trim() : ''
  const profileName = [firstName, lastName].filter(Boolean).join(' ')
  const roles = Array.isArray(profile.roles)
    ? profile.roles.filter((role) => typeof role === 'string').sort()
    : []

  return {
    uid: authUser.uid,
    name: profileName || authUser.displayName || profile.userName || FALLBACK_NAME,
    email: authUser.email || profile.email || null,
    roles,
    status: authUser.disabled ? 'disabled' : 'active',
    provider: authUser.providerData?.map((provider) => provider.providerId).filter(Boolean) ?? [],
    createdAt: toIsoString(authUser.metadata?.creationTime || profile.createdAt),
    lastSignInAt: toIsoString(authUser.metadata?.lastSignInTime),
    profileComplete: Boolean(profile.flags?.profileComplete),
    areas: Object.entries(profile.areas ?? {})
      .filter(([, enabled]) => enabled === true)
      .map(([area]) => area)
      .sort(),
  }
}

export function createActivitySummary(eventDocument, userLookup = new Map()) {
  const data = eventDocument.data()
  const uid = eventDocument.ref.path.split('/')[1] ?? null
  const eventData = data.data && typeof data.data === 'object' ? data.data : {}
  const type = typeof data.type === 'string' ? data.type : 'event'
  const action = typeof eventData.action === 'string' ? eventData.action : null
  const page = typeof eventData.page === 'string' ? eventData.page : null
  const path = typeof eventData.path === 'string' ? eventData.path : page
  const errorName = typeof eventData.name === 'string' ? eventData.name : null
  const summary = action || page || errorName || type.replaceAll('_', ' ')
  const viewport = eventData.viewport

  return {
    id: eventDocument.id,
    uid,
    user: userLookup.get(uid) ?? { name: FALLBACK_NAME, email: null },
    type,
    summary,
    path,
    at: toIsoString(data.timestamp),
    viewport: Number.isFinite(viewport?.width) && Number.isFinite(viewport?.height)
      ? `${viewport.width} × ${viewport.height}`
      : null,
  }
}

export function estimateDocumentBytes(documents) {
  if (!Array.isArray(documents) || documents.length === 0) {
    return { sampleSize: 0, averageDocumentBytes: null }
  }

  const totalBytes = documents.reduce((total, document) => {
    const value = typeof document.data === 'function' ? document.data() : document
    return total + Buffer.byteLength(JSON.stringify(value ?? {}), 'utf8')
  }, 0)

  return {
    sampleSize: documents.length,
    averageDocumentBytes: Math.round(totalBytes / documents.length),
  }
}

export function createCollectionSummary(name, documentCount, sampleDocuments) {
  const estimate = estimateDocumentBytes(sampleDocuments)
  return {
    name,
    documents: Number(documentCount) || 0,
    ...estimate,
    estimatedDocumentBytes: estimate.averageDocumentBytes == null
      ? null
      : estimate.averageDocumentBytes * (Number(documentCount) || 0),
    estimateBasis: estimate.sampleSize > 0
      ? `Average JSON payload from ${estimate.sampleSize} sampled documents; excludes index and metadata storage.`
      : 'No documents were available to sample.',
  }
}

export function createStorageSummary(files) {
  const groups = new Map()
  let bytes = 0
  let objects = 0

  for (const file of files) {
    const size = Number(file?.metadata?.size ?? file?.size ?? 0)
    const safeSize = Number.isFinite(size) && size > 0 ? size : 0
    const groupName = String(file?.name ?? '').split('/')[0] || '(root)'
    const group = groups.get(groupName) ?? { name: groupName, bytes: 0, objects: 0 }
    group.bytes += safeSize
    group.objects += 1
    groups.set(groupName, group)
    bytes += safeSize
    objects += 1
  }

  return {
    bytes,
    objects,
    groups: [...groups.values()].sort((a, b) => b.bytes - a.bytes),
  }
}
