import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { FieldValue } from 'firebase-admin/firestore'
import { auth, db } from '../config/firebase.mjs'
import { DeeplService } from '../services/deeplService.mjs'
import { createRetranslationHandler } from '../services/translationHandler.mjs'
import { reserveTranslationBudget } from '../services/translationRuntime.mjs'

const deeplKey = defineSecret('DEEPL_API_KEY')
export const retranslate = onRequest(
  { region: 'australia-southeast1', timeoutSeconds: 30, memory: '256MiB', maxInstances: 1, cors: true, secrets: [deeplKey] },
  createRetranslationHandler({
    verifyIdToken: (token, revoked) => auth.verifyIdToken(token, revoked),
    reserveBudget: reserveTranslationBudget,
    deepl: key => new DeeplService(key),
    getDeeplKey: () => deeplKey.value(),
    updateCache: (id, input, result) => db.runTransaction(async tx => {
      const ref = db.collection('translations').doc(id)
      const snapshot = await tx.get(ref)
      const cached = snapshot.data()
      // Never use client text to overwrite an unrelated shared cache record.
      if (!cached || cached.translated !== input.translatedText || cached.inputText !== input.originalText ||
          cached.sourceLang !== input.fromLang || cached.targetLang !== input.targetLang || cached.model !== 'deepl') return
      tx.update(ref, { ...result, retranslationCompletedAt: FieldValue.serverTimestamp() })
    }),
  }),
)
