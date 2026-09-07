import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { auth } from '../config/firebase.mjs'
import { TranslationCache } from '../services/translationCache.mjs'
import { OpenAIService } from '../services/openaiService.mjs'
import { DeeplService } from '../services/deeplService.mjs'
import { createTranslationHandler } from '../services/translationHandler.mjs'
import { reserveTranslationBudget } from '../services/translationRuntime.mjs'

const openaiKey = defineSecret('TRANSLATION_OPENAI_API_KEY')
const deeplKey = defineSecret('DEEPL_API_KEY')
export const aiTranslate = onRequest(
  { region: 'australia-southeast1', timeoutSeconds: 60, memory: '1GiB', maxInstances: 1, cors: true, secrets: [openaiKey, deeplKey] },
  createTranslationHandler({
    verifyIdToken: (token, revoked) => auth.verifyIdToken(token, revoked),
    reserveBudget: reserveTranslationBudget,
    cache: new TranslationCache('v1'),
    openai: key => new OpenAIService(key),
    deepl: key => new DeeplService(key),
    getOpenAIKey: () => openaiKey.value(),
    getDeeplKey: () => deeplKey.value(),
  }),
)
