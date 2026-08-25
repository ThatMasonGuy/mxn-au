/**
 * Select assets that must be checked as individual Storage objects before a
 * regeneration. Completed reports retain their photo archive but deliberately
 * remove the individual photos, while signature objects remain separate.
 */
export function selectDirectRegenerationAssets(allAssets, archiveAvailable) {
  if (!Array.isArray(allAssets)) {
    throw new TypeError('allAssets must be an array')
  }

  if (!archiveAvailable) return [...allAssets]
  return allAssets.filter((record) => record.storagePathKey === 'signatureStoragePath')
}
