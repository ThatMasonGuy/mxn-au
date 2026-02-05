import { setGlobalOptions } from 'firebase-functions/v2/options';

setGlobalOptions({
    region: 'australia-southeast1',
    timeoutSeconds: 120,
    memory: '1GiB'
});

// Translation API functions
export { aiTranslate } from './api/aiTranslate.mjs';
export { markTranslationBad } from './api/markTranslationBad.mjs';
export { logTranslation } from './api/logTranslation.mjs';
export { retranslate } from './api/retranslate.mjs';
export { processTranslationStats } from './api/processTranslationStats.mjs';
export { processTranslationErrors } from './api/processTranslationErrors.mjs';

// Journal & Destiny API functions
export { handleJournalChat } from './api/handleJournalChat.mjs';
export { startBungieOAuth, bungieOAuthCallback } from './api/oauth.mjs';
export { getChallenges } from './api/getChallenges.mjs';
export { aiSuggest } from './api/aiSuggest.mjs';
// export { rebuildTranslationStats } from './api/rebuildTranslationStats.mjs';

// Daily Games functions
export { getDailyWordle, submitWordleCompletion } from './dailyGames/wordle.mjs'
export { wordleGenerateCron, wordleGenerateNow } from './dailyGames/wordleGenerate.mjs'
export { getWordleUnlimitedWords, submitWordleUnlimitedCompletion } from './dailyGames/wordleUnlimited.mjs'
export { getDailyConnections, submitConnectionsCompletion } from './dailyGames/connections.mjs'
export { connectionsGenerateCron, connectionsGenerateNow } from './dailyGames/connectionsGenerate.mjs'
export { getDailyFlagle, submitFlagleCompletion } from './dailyGames/flagle.mjs'
export { flagleGenerateCron, flagleGenerateNow } from './dailyGames/flagleGenerate.mjs'

// Reports
export { generateRankingsReport } from './api/generateRankingsReport.mjs';

// Discord Bot Dashboard OAuth functions
export { discordAuth } from './api/discordAuth.mjs';
export { getDiscordServers } from './api/getDiscordServers.mjs';
export { getBotConfig } from './api/getBotConfig.mjs';
export { updateBotConfig } from './api/updateBotConfig.mjs';
export { getServerChannels } from './api/getServerChannels.mjs';
export { getServerRoles } from './api/getServerRoles.mjs';
export { createAutoTranslatePair } from './api/createAutoTranslatePair.mjs';