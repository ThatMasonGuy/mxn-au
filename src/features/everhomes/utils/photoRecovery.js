export function prepareRestoredPhoto(photo = {}) {
  if (photo.uploadStatus === 'done') return photo
  return {
    ...photo,
    errorCode: 'storage/recovery-check',
    errorMessage: 'Checking photo recovery options.',
    retryNote: '',
    retryable: false,
    uploadStatus: 'failed',
  }
}

export function failedPhotoRecoveryState(photo = {}, { localFileAvailable = false } = {}) {
  const canRetry = Boolean(
    photo.storagePath
    || photo.intendedStoragePath
    || photo.url
    || localFileAvailable,
  )

  return {
    retryable: canRetry,
    localBackupAvailable: localFileAvailable,
    errorCode: canRetry ? 'storage/retry-required' : 'storage/retry-file-unavailable',
    errorMessage: canRetry
      ? 'This photo has not finished uploading.'
      : 'The original image is not available in this browser.',
    retryNote: canRetry
      ? 'Retry to upload this photo.'
      : 'Remove this entry, then add the photo again.',
  }
}

export function applyFailedPhotoRecoveryState(photo, options) {
  Object.assign(photo, failedPhotoRecoveryState(photo, options))
  return photo
}
