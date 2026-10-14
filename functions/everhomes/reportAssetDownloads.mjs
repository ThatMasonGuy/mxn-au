import { safeArchiveKey } from './reportArtifacts.mjs'

export async function runConcurrent(tasks, concurrency = 6) {
  const results = []
  let nextIndex = 0
  async function worker() {
    while (nextIndex < tasks.length) {
      const index = nextIndex++
      results[index] = await tasks[index]()
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, worker))
  return results
}

export async function downloadMarketingPhotos(entries, {
  loadAsset,
  trackImageBytes,
  originalImageExtension,
  concurrency = 6,
}) {
  // Queue functions so downloads start only when a worker is available.
  return runConcurrent(entries.map(({ slotKey, mp, i }) => async () => {
    try {
      if (!mp?.url && !mp?.storagePath) return { status: 'fulfilled', value: null }
      const raw = await loadAsset(mp)
      trackImageBytes(raw)
      const safeSlotKey = safeArchiveKey(slotKey, 'marketing')
      return {
        status: 'fulfilled',
        value: {
          filename: `${safeSlotKey}_${i + 1}.${originalImageExtension(mp)}`,
          slotKey,
          storagePath: mp.storagePath ?? null,
          url: mp.url ?? null,
        },
      }
    } catch (reason) {
      return { status: 'rejected', reason }
    }
  }), concurrency)
}
