import { setGlobalOptions } from 'firebase-functions/v2/options';

setGlobalOptions({
    region: 'australia-southeast1',
    timeoutSeconds: 120,
    memory: '1GiB'
});

export { aiTranslate } from './api/aiTranslate.mjs';
export { processTranslationStats } from './api/processTranslationStats.mjs';
export { processTranslationErrors } from './api/processTranslationErrors.mjs';

export { handleJournalChat } from './api/handleJournalChat.mjs';
export { startBungieOAuth, bungieOAuthCallback } from './api/oauth.mjs';
export { getChallenges } from './api/getChallenges.mjs';
export { aiSuggest } from './api/aiSuggest.mjs';
// export { rebuildTranslationStats } from './api/rebuildTranslationStats.mjs';
// export { getConnectionsWords, dailyGames } from './api/dailyGames.mjs';
// export { scheduledDailyGeneration, manualDailyGeneration } from './api/generatePuzzle.mjs';

export { getAllDailyStats } from './dailyGames/getAllDailyStats.mjs'
export { getDailyWordle, saveWordleProgress, submitWordleOutcome } from './dailyGames/wordle.mjs'
export { wordleGenerateCron, wordleGenerateNow } from './dailyGames/wordleGenerate.mjs'