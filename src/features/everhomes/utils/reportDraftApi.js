import { createForegroundUploadDeadline } from './reportUploadTask.js'

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
      throw Object.assign(new Error(`The recovery service did not respond within ${Math.round(timeoutMs / 1000)} seconds.`), { endpoint, code: 'draft/timeout' })
    }
    error.endpoint = endpoint
    throw error
  } finally {
    clearTimeout(timeout)
    options.signal?.removeEventListener('abort', forwardAbort)
  }

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(body.error ?? `Draft service returned HTTP ${response.status}`)
    error.status = response.status
    error.endpoint = endpoint
    error.code = `draft/http-${response.status}`
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

// Raw image bodies avoid base64 expansion for full-resolution mobile photos.
export async function uploadReportPhoto({ session, storagePath, file, contentType }, { timeoutMs = 120_000 } = {}) {
  const controller = new AbortController()
  const deadline = createForegroundUploadDeadline(() => controller.abort(), timeoutMs)
  const endpoint = 'uploadEverhomesDraftPhoto'
  try {
    const response = await fetch(`${FUNCTIONS_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'X-Everhomes-Report-Type': session.reportType,
        'X-Everhomes-Draft-Id': session.draftId,
        'X-Everhomes-Draft-Key': session.draftAccessKey,
        'X-Everhomes-Storage-Path': storagePath,
      },
      body: file,
      signal: controller.signal,
    })
    const body = await response.json().catch(() => ({}))
    if (!response.ok || !body.url || body.storagePath !== storagePath) {
      throw Object.assign(new Error(body.error ?? 'The backup photo upload did not finish. Retry this photo.'), {
        status: response.status,
        retryable: response.status >= 500 || response.status === 408 || response.status === 429,
      })
    }
    return body
  } catch (error) {
    throw Object.assign(new Error(controller.signal.aborted
      ? 'The backup photo upload timed out. Keep this page open and retry this photo.'
      : error.message), {
      code: 'storage/fallback-failed', endpoint,
      status: error.status,
      retryable: error.retryable !== false,
    })
  } finally {
    deadline.dispose()
  }
}
