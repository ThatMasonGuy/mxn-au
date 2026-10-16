import assert from 'node:assert/strict'
import test from 'node:test'
import { requestTranslation } from '../src/features/translate/services/translationRequest.mjs'
import { OpenAIService } from '../functions/services/openaiService.mjs'

const input = { body: { content: 'Hello', fromLang: 'en', targetLang: 'es' }, headers: {} }
const deferred = () => {
  let resolve
  const promise = new Promise(done => { resolve = done })
  return { promise, resolve }
}

test('a translation taking longer than the old UI deadline still returns its result', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const pending = deferred()
  let requestSignal
  const result = requestTranslation(input, { fetchImpl: async (_url, options) => {
    requestSignal = options.signal
    return pending.promise
  } })
  t.mock.timers.tick(15000)
  assert.equal(requestSignal.aborted, false)
  pending.resolve({ ok: true, json: async () => ({ translated: 'Hola' }) })
  assert.deepEqual(await result, { translated: 'Hola' })
  t.mock.timers.tick(60000)
  assert.equal(requestSignal.aborted, false, 'completed requests clear their deadline')
})

test('the deadline aborts transport and rejects a late response body', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const body = deferred()
  let requestSignal
  const result = requestTranslation(input, { fetchImpl: async (_url, options) => {
    requestSignal = options.signal
    return { ok: true, json: () => body.promise }
  } })
  const rejected = assert.rejects(result, { name: 'TimeoutError' })
  await Promise.resolve()
  t.mock.timers.tick(55000)
  assert.equal(requestSignal.aborted, true)
  body.resolve({ translated: 'A late result must not be shown' })
  await rejected
})

test('cancel aborts a translation and a subsequent request can succeed', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const controller = new AbortController()
  const pending = deferred()
  let requestSignal
  const result = requestTranslation({ ...input, signal: controller.signal }, {
    fetchImpl: async (_url, options) => { requestSignal = options.signal; return pending.promise },
  })
  const rejected = assert.rejects(result, { name: 'AbortError' })
  controller.abort()
  assert.equal(requestSignal.aborted, true)
  pending.resolve({ ok: true, json: async () => ({ translated: 'Late' }) })
  await rejected
  assert.deepEqual(await requestTranslation(input, { fetchImpl: async () => ({ ok: true, json: async () => ({ translated: 'Hola' }) }) }), { translated: 'Hola' })
})

test('provider failures and empty successes do not become displayed translations', async () => {
  await assert.rejects(requestTranslation(input, { fetchImpl: async () => ({ ok: false, json: async () => ({ error: 'Daily limit reached' }) }) }), /Daily limit reached/)
  await assert.rejects(requestTranslation(input, { fetchImpl: async () => ({ ok: true, json: async () => ({ translated: '' }) }) }), /No translation/)
})

test('OpenAI translation uses Luna without reasoning and preserves the result contract', async () => {
  let request
  const service = new OpenAIService('test-only', { fetchImpl: async (url, options) => {
    request = { url, ...JSON.parse(options.body) }
    return { ok: true, json: async () => ({
      choices: [{ finish_reason: 'stop', message: { content: JSON.stringify({ translated: 'Hola\nmundo', retranslated: 'Hello\nworld' }) } }],
      usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
    }) }
  } })
  const result = await service.translate('Hello\nworld', 'en', 'es')
  assert.equal(request.model, 'gpt-6-luna')
  assert.equal(request.reasoning_effort, 'none')
  assert.equal(request.max_completion_tokens, 4000)
  assert.equal(request.response_format.type, 'json_object')
  assert.equal(result.translated, 'Hola\nmundo')
  assert.equal(result.retranslated, 'Hello\nworld')
  assert.equal(result.modelUsed, 'gpt-6-luna')
  assert.deepEqual(result.tokenUsage, { prompt: 50, completion: 20, total: 70 })
  assert.equal(result.accuracy, 1)
})

test('truncated or malformed model results are rejected before caching', async () => {
  for (const choice of [
    { finish_reason: 'length', message: { content: '{"translated":"partial","retranslated":"partial"}' } },
    { finish_reason: 'stop', message: { content: '{"translated":{},"retranslated":"Hello"}' } },
    { finish_reason: 'stop', message: { content: 'invalid json' } },
  ]) {
    const service = new OpenAIService('test-only', { fetchImpl: async () => ({ ok: true, json: async () => ({ choices: [choice] }) }) })
    await assert.rejects(service.translate('Hello', 'en', 'es'))
  }
})

test('wording similarity preserves edit distance for inserts, substitutions and empty text', () => {
  const service = new OpenAIService('unused')
  assert.equal(service.calculateSimilarity('kitten', 'sitting'), 4 / 7)
  assert.equal(service.calculateSimilarity('Hello', 'HELLO'), 1)
  assert.equal(service.calculateSimilarity('', 'hello'), 0)
  assert.equal(service.calculateSimilarity('abc', 'ab'), 2 / 3)
})
