// Mobile browsers suspend network work and timers in the background. Give the
// existing resumable transfer a fresh inactivity window when the page returns.
export function createForegroundUploadDeadline(onTimeout, timeoutMs, visibilityTarget = document) {
  let timer
  let disposed = false
  function refresh() {
    clearTimeout(timer)
    if (disposed || visibilityTarget.visibilityState === 'hidden') return
    timer = setTimeout(() => {
      if (!disposed && visibilityTarget.visibilityState !== 'hidden') onTimeout()
    }, timeoutMs)
  }
  visibilityTarget.addEventListener('visibilitychange', refresh)
  refresh()
  return {
    refresh,
    dispose() {
      disposed = true
      clearTimeout(timer)
      visibilityTarget.removeEventListener('visibilitychange', refresh)
    },
  }
}

export function waitForReportUpload(task, {
  timeoutMs,
  visibilityTarget = document,
  onProgress = () => {},
}) {
  return new Promise((resolve, reject) => {
    let settled = false
    let unsubscribe
    let lastSnapshot = task.snapshot
    const finish = (callback, value) => {
      if (settled) return
      settled = true
      deadline.dispose()
      unsubscribe?.()
      callback(value)
    }
    const deadline = createForegroundUploadDeadline(() => {
        const error = Object.assign(new Error(`Upload made no progress for ${Math.round(timeoutMs / 1000)} seconds while this page was open.`), {
          code: 'storage/timeout',
          bytesTransferred: lastSnapshot?.bytesTransferred ?? 0,
          totalBytes: lastSnapshot?.totalBytes ?? 0,
        })
        finish(reject, error)
        task.cancel()
    }, timeoutMs, visibilityTarget)
    unsubscribe = task.on('state_changed', (snapshot) => {
      lastSnapshot = snapshot
      onProgress(snapshot)
      deadline.refresh()
    }, (error) => finish(reject, error), () => finish(resolve))
    if (settled) unsubscribe?.()
  })
}
