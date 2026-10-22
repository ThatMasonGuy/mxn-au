const IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/avif'])
const MUTABLE_STATUSES = new Set(['draft', 'pending', 'failed'])
const MAX_PHOTO_BYTES = 15 * 1024 * 1024

export class PhotoUploadRequestError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// The fallback accepts only an image inside the capability's own draft folder.
// It cannot write report PDFs, archives, signatures or another draft's files.
export async function storeDraftPhoto({ session, storagePath, contentType, bytes }, { getDraft, saveFile, newToken }) {
  const root = `${session.collection}/${session.draftId}/`
  const relative = typeof storagePath === 'string' && storagePath.startsWith(root)
    ? storagePath.slice(root.length) : ''
  if (!/^(photos|marketing)\/[a-zA-Z0-9_-]{1,256}\.(jpg|jpeg|png|webp|heic|heif|avif)$/.test(relative)) {
    throw new PhotoUploadRequestError(400, 'Invalid draft photo path')
  }
  if (!IMAGE_TYPES.has(contentType)) {
    throw new PhotoUploadRequestError(400, 'Use a JPEG, PNG, WebP, HEIC, or AVIF image.')
  }
  if (!(bytes instanceof Uint8Array) || bytes.byteLength === 0 || bytes.byteLength >= MAX_PHOTO_BYTES) {
    throw new PhotoUploadRequestError(413, 'Choose an image smaller than 15 MB.')
  }
  const draft = await getDraft(session)
  if (draft.draftAccessKey !== session.draftAccessKey) {
    throw new PhotoUploadRequestError(403, 'This photo does not belong to the current draft')
  }
  if (!MUTABLE_STATUSES.has(draft.status)) {
    throw new PhotoUploadRequestError(409, 'This report has already been submitted')
  }
  const token = newToken()
  await saveFile(storagePath, bytes, {
    contentType,
    metadata: {
      everhomesDraftKey: session.draftAccessKey,
      firebaseStorageDownloadTokens: token,
    },
  })
  return { storagePath, token }
}
