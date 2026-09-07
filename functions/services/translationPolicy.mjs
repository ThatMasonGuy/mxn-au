export class TranslationRequestError extends Error {
  constructor(status, message) { super(message); this.status = status }
}

export function validateTranslationInput(body, retranslation = false) {
  const text = retranslation ? body?.translatedText : body?.content
  const original = retranslation ? body?.originalText : text
  if (typeof text !== 'string' || !text.trim() || text.length > 6000 ||
      typeof original !== 'string' || !original.trim() || original.length > 6000) {
    throw new TranslationRequestError(400, 'Text must contain between 1 and 6000 characters.')
  }
  if (![body?.fromLang, body?.targetLang].every(code => typeof code === 'string' && /^[a-z]{2}$/.test(code))) {
    throw new TranslationRequestError(400, 'Invalid language code.')
  }
  const model = retranslation ? 'deepl' : body.model ?? 'openai'
  if (!['openai', 'deepl'].includes(model)) throw new TranslationRequestError(400, 'Invalid translation model.')
  return { content: text, fromLang: body.fromLang, targetLang: body.targetLang, model }
}

export async function authorizeTranslation(req, model, verifyIdToken) {
  // Legacy bot clients put their own OpenAI key in Authorization. Recognize
  // that explicit key format as BYOK only; it can never establish Firebase identity.
  const header = req.headers?.authorization
  const legacyProviderKey = typeof header === 'string' && header.startsWith('Bearer sk-') ? header.slice(7) : null
  const suppliedKey = req.headers?.['x-openai-key'] ?? legacyProviderKey
  if (suppliedKey != null && (typeof suppliedKey !== 'string' || suppliedKey.length > 512)) {
    throw new TranslationRequestError(400, 'Invalid provider key.')
  }
  const apiKey = suppliedKey?.trim() || null
  const shared = model === 'deepl' || !apiKey
  let uid = null
  if (header && !legacyProviderKey) {
    try {
      if (typeof header !== 'string' || !header.startsWith('Bearer ')) throw new Error('Invalid identity header')
      const token = await verifyIdToken(header.slice(7), true)
      if (!token.uid || token.firebase?.sign_in_provider === 'anonymous') throw new Error('Untrusted identity')
      uid = token.uid
    } catch {
      // BYOK remains usable when optional Firebase identity expires; it must
      // never fall through to the server credential or inherit an unverified UID.
      if (shared) throw new TranslationRequestError(401, 'Sign in again to translate.')
    }
  }
  if (shared && !uid) throw new TranslationRequestError(401, 'Sign in to use shared translation, or supply your own OpenAI key.')
  return { uid, apiKey, shared }
}

export function nextBudget(current, chars, limits) {
  const requests = (current?.requests ?? 0) + 1
  const characters = (current?.characters ?? 0) + chars
  if (requests > limits.requests || characters > limits.characters) {
    throw new TranslationRequestError(429, 'Shared translation daily limit reached. Try again tomorrow or use your own OpenAI key.')
  }
  return { requests, characters }
}

export function createBudgetReserver(db, { user, global }, now = () => new Date()) {
  return async (uid, chars) => {
    const day = now().toISOString().slice(0, 10)
    // Top-level server-only documents, outside user-writable /users paths.
    const userRef = db.collection('_translationBudgets').doc(`${day}_${uid}`)
    const globalRef = db.collection('_translationBudgets').doc(`${day}_global`)
    await db.runTransaction(async tx => {
      const [userDoc, globalDoc] = await Promise.all([tx.get(userRef), tx.get(globalRef)])
      const userNext = nextBudget(userDoc.data(), chars, user)
      const globalNext = nextBudget(globalDoc.data(), chars, global)
      tx.set(userRef, userNext)
      tx.set(globalRef, globalNext)
    })
  }
}
