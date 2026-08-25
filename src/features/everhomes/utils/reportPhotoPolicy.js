export const MAX_REPORT_PHOTO_BYTES = 15 * 1024 * 1024

/**
 * Reports intentionally have no aggregate photo-byte cap. Originals are
 * archived through a bounded-memory stream in the generator, while this
 * per-photo boundary prevents a single pathological image upload.
 */
export function evaluateReportPhotoSize(fileSize, existingFileSizes = []) {
    const candidateBytes = Number(fileSize) || 0
    const aggregateBytes = existingFileSizes.reduce(
        (sum, size) => sum + (Number(size) || 0),
        candidateBytes,
    )

    return {
        allowed: candidateBytes < MAX_REPORT_PHOTO_BYTES,
        aggregateBytes,
        maxPhotoBytes: MAX_REPORT_PHOTO_BYTES,
    }
}
