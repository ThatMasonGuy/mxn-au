import assert from 'node:assert/strict'
import test from 'node:test'
import { webcrypto } from 'node:crypto'
import { encryptCredential } from '../functions/services/credentialCrypto.mjs'
import { createEncryptCredentialHandler, encryptServerCredential } from '../functions/api/encryptServerCredential.mjs'
import { createTranslationHandler, createRetranslationHandler } from '../functions/services/translationHandler.mjs'
import { createBudgetReserver, TranslationRequestError } from '../functions/services/translationPolicy.mjs'

test('encryption callable deployment targets the same region as the browser Functions client', () => {
  assert.deepEqual(encryptServerCredential.__endpoint.region, ['australia-southeast1'])
})

test('server encryption remains readable by the existing browser v2 algorithm without changing the key', async () => {
  const secret = 'test-only-existing-passphrase'
  const plaintext = 'SSH credential with unicode: 🔑 café\nsecond line'
  const value = encryptCredential(plaintext, secret)
  const [version, saltText, ivText, dataText] = value.split(':')
  assert.equal(version, 'v2')
  const base = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'PBKDF2', false, ['deriveKey'])
  const key = await webcrypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: Buffer.from(saltText, 'base64'), iterations: 310000 }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt'])
  const payload = Buffer.from(dataText, 'base64')
  const decrypted = await webcrypto.subtle.decrypt({ name: 'AES-GCM', iv: Buffer.from(ivText, 'base64') }, key, payload)
  assert.equal(new TextDecoder().decode(decrypted), plaintext)
  payload[0] ^= 1
  await assert.rejects(webcrypto.subtle.decrypt({ name: 'AES-GCM', iv: Buffer.from(ivText, 'base64') }, key, payload))
})

test('encryption callable denies anonymous and malformed requests before reading the secret', async () => {
  let reads = 0
  const handler = createEncryptCredentialHandler(() => { reads++; return 'test-only-key' })
  for (const request of [{ data: { credential: 'password' } }, { auth: { uid: 'u', token: { firebase: { sign_in_provider: 'anonymous' } } }, data: { credential: 'password' } }]) {
    await assert.rejects(handler(request), { code: 'unauthenticated' })
  }
  for (const credential of [null, {}, '', 'a'.repeat(32769)]) {
    await assert.rejects(handler({ auth: { uid: 'u' }, data: { credential } }), { code: 'invalid-argument' })
  }
  assert.equal(reads, 0)
  const result = await handler({ auth: { uid: 'u' }, data: { credential: 'password' } })
  assert.deepEqual(Object.keys(result), ['encryptedCredential'])
  assert.equal(result.encryptedCredential.split(':')[0], 'v2')
})

function response() {
  return { code: null, body: null, status(code) { this.code = code; return this }, json(body) { this.body = body; return this }, send(body) { this.body = body; return this } }
}
const input = { content: 'Hello', fromLang: 'en', targetLang: 'es' }
function setup(overrides = {}) {
  const calls = []
  const deps = {
    verifyIdToken: async token => { if (token !== 'valid') throw new Error('Invalid'); return { uid: 'verified-user' } },
    reserveBudget: async (uid, chars) => { calls.push(['budget', uid, chars]) },
    cache: { get: async () => null, save: async () => 'cache-id' },
    openai: key => ({ translate: async () => { calls.push(['openai', key]); return { translated: 'Hola' } } }),
    deepl: key => ({ translate: async () => { calls.push(['deepl', key]); return { translated: 'Hola' } }, retranslate: async () => { calls.push(['retranslate', key]); return { retranslated: 'Hello' } } }),
    getOpenAIKey: () => { calls.push(['secret']); return 'server-only-openai' },
    getDeeplKey: () => { calls.push(['secret']); return 'server-only-deepl' },
    updateCache: async () => {},
    ...overrides,
  }
  return { calls, handler: createTranslationHandler(deps), retranslate: createRetranslationHandler(deps) }
}

test('shared translation rejects anonymous, spoofed Discord and invalid Firebase identity before provider work', async () => {
  const { calls, handler } = setup()
  for (const req of [
    { headers: {}, body: input },
    { headers: { 'x-discord-bot': 'true' }, body: { ...input, platform: 'discord' } },
    { headers: { 'x-openai-key': 'dummy' }, body: { ...input, model: 'deepl' } },
    { headers: { authorization: 'Bearer invalid' }, body: input },
  ]) {
    const res = response()
    await handler({ method: 'POST', ...req }, res)
    assert.equal(res.code, 401)
  }
  assert.deepEqual(calls, [])
})

test('signed-in shared translation reserves budget and never returns its provider secret', async () => {
  const { calls, handler } = setup()
  const res = response()
  await handler({ method: 'POST', headers: { authorization: 'Bearer valid' }, body: input }, res)
  assert.equal(res.code, 201)
  assert.equal(res.body.translated, 'Hola')
  assert.equal(res.body.logData.platformInfo.userId, 'verified-user')
  assert.deepEqual(calls, [['budget', 'verified-user', 5], ['secret'], ['openai', 'server-only-openai']])
  assert.equal(JSON.stringify(res.body).includes('server-only-openai'), false)
})

test('bring-your-own OpenAI key still works without an account or server credential access', async () => {
  const { calls, handler } = setup()
  const res = response()
  await handler({ method: 'POST', headers: { 'x-openai-key': 'visitor-key' }, body: input }, res)
  assert.equal(res.code, 201)
  assert.deepEqual(calls, [['openai', 'visitor-key']])
  calls.length = 0
  await handler({ method: 'POST', headers: { 'x-openai-key': 'visitor-key', authorization: 'Bearer expired' }, body: input }, res)
  assert.equal(res.code, 201)
  assert.equal(res.body.logData.platformInfo.userId, null)
  assert.deepEqual(calls, [['openai', 'visitor-key']])
})

test('legacy Discord provider-key headers preserve BYOK but never authorize server-funded DeepL', async () => {
  const { calls, handler } = setup()
  const res = response()
  const req = { method: 'POST', headers: { authorization: 'Bearer sk-test-only', 'x-discord-bot': 'true' }, body: { ...input, discordUserId: 'discord-user', guildId: 'guild' } }
  await handler(req, res)
  assert.equal(res.code, 201)
  assert.equal(res.body.platform, 'discord')
  assert.equal(res.body.logData.platformInfo.guildId, 'guild')
  assert.deepEqual(calls, [['openai', 'sk-test-only']])
  calls.length = 0
  await handler({ ...req, body: { ...req.body, model: 'deepl' } }, res)
  assert.equal(res.code, 401)
  assert.deepEqual(calls, [])
})

test('quota denial and oversized text never reach a provider or secret', async () => {
  const { calls, handler } = setup({ reserveBudget: async () => { throw new TranslationRequestError(429, 'Daily limit') } })
  const res = response()
  await handler({ method: 'POST', headers: { authorization: 'Bearer valid' }, body: input }, res)
  assert.equal(res.code, 429)
  await handler({ method: 'POST', headers: { authorization: 'Bearer valid' }, body: { ...input, content: 'x'.repeat(6001) } }, res)
  assert.equal(res.code, 400)
  assert.deepEqual(calls, [])
})

test('retranslation cannot bypass identity or budget enforcement', async () => {
  const { calls, retranslate } = setup()
  const body = { translatedText: 'Hola', originalText: 'Hello', fromLang: 'en', targetLang: 'es' }
  const res = response()
  await retranslate({ method: 'POST', headers: {}, body }, res)
  assert.equal(res.code, 401)
  assert.deepEqual(calls, [])
  await retranslate({ method: 'POST', headers: { authorization: 'Bearer valid' }, body }, res)
  assert.equal(res.code, 200)
  assert.deepEqual(calls, [['budget', 'verified-user', 4], ['secret'], ['retranslate', 'server-only-deepl']])
})

test('global budget exhaustion cannot be bypassed with another user and denied reservations write nothing', async () => {
  const data = new Map()
  const db = {
    collection: () => ({ doc: id => id }),
    runTransaction: async callback => {
      const writes = []
      await callback({ get: async ref => ({ data: () => data.get(ref) }), set: (ref, value) => writes.push([ref, value]) })
      for (const [ref, value] of writes) data.set(ref, value)
    },
  }
  const reserve = createBudgetReserver(db, { user: { requests: 2, characters: 10 }, global: { requests: 3, characters: 12 } }, () => new Date('2026-09-07T00:00:00Z'))
  await reserve('first', 8)
  await reserve('second', 4)
  const before = [...data]
  await assert.rejects(reserve('third', 1), { status: 429 })
  assert.deepEqual([...data], before)
  await assert.rejects(reserve('first', 3), { status: 429 })
  assert.deepEqual([...data], before)
})
