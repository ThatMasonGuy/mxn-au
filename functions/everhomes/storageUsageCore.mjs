export const LEGACY_FIREBASE_FREE_STORAGE_GB = 5
export const LEGACY_FIREBASE_STORAGE_USD_PER_GB_MONTH = 0.026

const BYTES_PER_GB = 1_000_000_000

export function createStorageUsageSummary() {
  return {
    total: { bytes: 0, objects: 0 },
    inspections: { bytes: 0, objects: 0 },
    handovers: { bytes: 0, objects: 0 },
    other: { bytes: 0, objects: 0 },
  }
}

export function classifyStorageObject(name) {
  if (String(name).startsWith('inspections/')) return 'inspections'
  if (String(name).startsWith('handovers/')) return 'handovers'
  return 'other'
}

export function addStorageObject(summary, object) {
  const bytes = Number(object?.size)
  const safeBytes = Number.isFinite(bytes) && bytes > 0 ? bytes : 0
  const category = classifyStorageObject(object?.name)

  summary.total.bytes += safeBytes
  summary.total.objects += 1
  summary[category].bytes += safeBytes
  summary[category].objects += 1
  return summary
}

export function estimateLegacyFirebaseStorageUsd(totalBytes) {
  const storedGb = Math.max(0, Number(totalBytes) || 0) / BYTES_PER_GB
  const billableGb = Math.max(0, storedGb - LEGACY_FIREBASE_FREE_STORAGE_GB)
  return {
    storedGb,
    billableGb,
    monthlyStorageUsd: billableGb * LEGACY_FIREBASE_STORAGE_USD_PER_GB_MONTH,
  }
}
