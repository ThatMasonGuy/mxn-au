// One deadline owns the fetch and response body; cancellation cannot publish a late result.
export async function requestTranslation({ body, headers, signal }, {
  fetchImpl = fetch, timeoutMs = 55000, setTimer = setTimeout, clearTimer = clearTimeout,
} = {}) {
  const controller = new AbortController()
  const cancel = () => controller.abort(signal.reason)
  if (signal?.aborted) cancel()
  else signal?.addEventListener('abort', cancel, { once: true })
  const timer = setTimer(() => controller.abort(new DOMException(
    'Translation took too long. Please try again.', 'TimeoutError',
  )), timeoutMs)
  try {
    controller.signal.throwIfAborted()
    const response = await fetchImpl('/translate/post', {
      method: 'POST', headers, body: JSON.stringify(body), signal: controller.signal,
    })
    const data = await response.json().catch(() => ({}))
    controller.signal.throwIfAborted()
    if (!response.ok) throw new Error(data.error || `Translation failed (${response.status}). Please try again.`)
    if (typeof data.translated !== 'string' || !data.translated.trim()) throw new Error('No translation was returned. Please try again.')
    return data
  } catch (error) {
    if (controller.signal.aborted) throw controller.signal.reason
    throw error
  } finally {
    clearTimer(timer)
    signal?.removeEventListener('abort', cancel)
  }
}
