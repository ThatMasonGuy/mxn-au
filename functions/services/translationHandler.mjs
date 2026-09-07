import { authorizeTranslation, validateTranslationInput, TranslationRequestError } from './translationPolicy.mjs'

const deeplLanguages = new Set(['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ru', 'tr', 'nl', 'sv', 'no', 'da', 'fi', 'pl', 'cs', 'hu'])

export function createTranslationHandler({ verifyIdToken, reserveBudget, cache, openai, deepl, getOpenAIKey, getDeeplKey }) {
  return async (req, res) => {
    if (req.method === 'OPTIONS') return res.status(204).send('')
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    const started = Date.now()
    try {
      const input = validateTranslationInput(req.body)
      const actor = await authorizeTranslation(req, input.model, verifyIdToken)
      const model = input.model === 'deepl' && (!deeplLanguages.has(input.fromLang) || !deeplLanguages.has(input.targetLang)) ? 'openai' : input.model
      // Reserve before cache/provider work; failed calls still count so retries cannot bypass limits.
      if (actor.shared) await reserveBudget(actor.uid, input.content.length)
      let result = await cache.get(input.content, input.fromLang, input.targetLang, model)
      const cached = Boolean(result)
      if (!result) {
        const service = model === 'deepl' ? deepl(getDeeplKey()) : openai(actor.apiKey || getOpenAIKey())
        result = await service.translate(input.content, input.fromLang, input.targetLang)
        result.version = 'v1'
        result.model = model
        result.id = await cache.save(result, model).catch(() => null)
      }
      // Platform labels are telemetry only; they never confer provider authority.
      const isDiscord = req.headers?.['x-discord-bot'] === 'true' || req.body.platform === 'discord'
      const platformInfo = isDiscord ? {
        platform: 'discord', userId: req.body.discordUserId || req.headers['x-discord-user-id'] || null,
        guildId: req.body.guildId || req.headers['x-discord-guild-id'] || null,
        channelId: req.body.channelId || req.headers['x-discord-channel-id'] || null,
        guildName: req.body.guildName || req.headers['x-discord-guild-name'] || null,
        channelName: req.body.channelName || req.headers['x-discord-channel-name'] || null,
        userName: req.body.userName || req.headers['x-discord-user-name'] || null,
      } : { platform: 'web', userId: actor.uid, guildId: null, channelId: null }
      return res.status(cached ? 200 : 201).json({
        ...result, cached, cacheId: result.id, responseTime: Date.now() - started,
        platform: platformInfo.platform,
        logData: { platform: platformInfo.platform, platformInfo, cached, version: 'v1' },
      })
    } catch (error) {
      if (error instanceof TranslationRequestError) return res.status(error.status).json({ error: error.message })
      // Provider exceptions may include request credentials or provider response bodies.
      console.error('Translation failed', { category: error?.name || 'Error' })
      return res.status(502).json({ error: 'Translation provider unavailable. Please try again later.' })
    }
  }
}

export function createRetranslationHandler({ verifyIdToken, reserveBudget, deepl, getDeeplKey, updateCache }) {
  return async (req, res) => {
    if (req.method === 'OPTIONS') return res.status(204).send('')
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    try {
      const input = validateTranslationInput(req.body, true)
      const actor = await authorizeTranslation(req, 'deepl', verifyIdToken)
      if (!deeplLanguages.has(input.fromLang) || !deeplLanguages.has(input.targetLang)) {
        throw new TranslationRequestError(400, 'Language is not supported by DeepL.')
      }
      await reserveBudget(actor.uid, input.content.length)
      const result = await deepl(getDeeplKey()).retranslate(input.content, input.fromLang, input.targetLang, req.body.originalText)
      if (typeof req.body.cacheId === 'string' && /^[a-z0-9-]{1,200}$/.test(req.body.cacheId)) {
        await updateCache(req.body.cacheId, req.body, result).catch(() => {})
      }
      return res.status(200).json(result)
    } catch (error) {
      if (error instanceof TranslationRequestError) return res.status(error.status).json({ error: error.message })
      console.error('Retranslation failed', { category: error?.name || 'Error' })
      return res.status(502).json({ error: 'Retranslation provider unavailable.' })
    }
  }
}
