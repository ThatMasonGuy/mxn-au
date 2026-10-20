const RETRYABLE_STORAGE_CODES = new Set([
  'storage/retry-limit-exceeded',
  'storage/unknown',
  'storage/quota-exceeded',
  'storage/canceled',
  'storage/timeout',
])

// A failed prerequisite backup has not invalidated the selected image. The
// uploader still holds its original File in memory and, when available, IndexedDB.
export function photoBackupFailure(error, { online }) {
  const status = Number(error?.status)
  const rejected = status >= 400 && status < 500 && status !== 408 && status !== 429
  return Object.assign(new Error(rejected
    ? error?.message || 'The recovery service rejected this draft.'
    : online
    ? 'The recovery backup could not be saved. Check your connection, then retry this photo.'
    : 'You’re offline. Reconnect, then retry this photo.'), {
    code: 'draft/backup-failed',
    retryable: !rejected,
  })
}

export function describeReportUploadFailure(error) {
  const code = error?.code ?? 'unknown'
  const message = error?.message ?? 'Unknown upload error'
  return {
    code,
    message,
    retryable: typeof error?.retryable === 'boolean'
      ? error.retryable
      : RETRYABLE_STORAGE_CODES.has(code) || /timeout/i.test(message),
  }
}
