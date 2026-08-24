import { createHash } from 'node:crypto'

export function buildReportArtifactPaths(collection, reportId, generationId) {
  if (![collection, reportId, generationId].every((value) => String(value || '').trim())) {
    throw new TypeError('collection, reportId and generationId are required')
  }

  const artifactRoot = `${collection}/${reportId}/generations/${generationId}`
  return {
    artifactRoot,
    pdfStoragePath: `${artifactRoot}/report.pdf`,
    zipStoragePath: `${artifactRoot}/photos.zip`,
  }
}

export function safeArchiveKey(value, fallback) {
  const raw = String(value ?? fallback)
  const readable = raw
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60) || fallback
  const digest = createHash('sha256').update(raw).digest('hex').slice(0, 8)
  return `${readable}_${digest}`
}
