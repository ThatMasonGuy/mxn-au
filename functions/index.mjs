// /functions/index.mjs
import { setGlobalOptions } from 'firebase-functions/v2'
setGlobalOptions({ region: 'australia-southeast1', timeoutSeconds: 120, memory: '1GiB' })

export { handleJournalChat } from './api/handleJournalChat.mjs'
export { startBungieOAuth } from './api/startBungieOAuth.mjs'
export { bungieOAuthCallback } from './api/bungieOAuthCallback.mjs'
export { getChallenges } from './api/getChallenges.mjs'
export { aiSuggest } from './api/aiSuggest.mjs'
export { aiTranslate } from './api/aiTranslate.mjs'