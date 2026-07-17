const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL ?? ''

async function post(endpoint, payload, options = {}) {
  const response = await fetch(`${FUNCTIONS_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: options.signal,
    keepalive: options.keepalive === true,
  })

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
