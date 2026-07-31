const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL ?? ''
const DEFAULT_TIMEOUT_MS = 20_000

async function post(endpoint, payload, options = {}) {
  const controller = new AbortController()
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const timeout = setTimeout(() => controller.abort(new DOMException('Request timed out', 'TimeoutError')), timeoutMs)
  const forwardAbort = () => controller.abort(options.signal?.reason)
  options.signal?.addEventListener('abort', forwardAbort, { once: true })

  let response
  try {
    response = await fetch(`${FUNCTIONS_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
      keepalive: options.keepalive === true,
    })
  } catch (error) {
    if (controller.signal.aborted && !options.signal?.aborted) {
      throw new Error(`The recovery service did not respond within ${Math.round(timeoutMs / 1000)} seconds.`)
    }
    throw error
  } finally {
    clearTimeout(timeout)
    options.signal?.removeEventListener('abort', forwardAbort)
  }

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(body.error ?? `Draft service returned HTTP ${response.status}`)
    error.status = response.status
    throw error
  }
  return body
}

export function syncReportDraft(payload, options) {
  return post('syncEverhomesDraft', payload, options)
}

export function getReportDraft(payload, options) {
  return post('getEverhomesDraft', payload, options)
}

export function recordReportUploadFailure(payload, options) {
  return post('recordEverhomesUploadFailure', payload, options)
}

export function deleteReportDraft(payload, options) {
  return post('deleteEverhomesDraft', payload, options)
}
