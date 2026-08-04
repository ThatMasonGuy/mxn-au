import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

async function source(path) {
  return readFile(new URL(path, import.meta.url), 'utf8')
}

test('browser persistence excludes Firebase ID tokens and translation API keys', async () => {
  const [mainStore, translateStore] = await Promise.all([
    source('../src/shared/stores/useMainStore.js'),
    source('../src/features/translate/stores/useTranslateStore.js'),
  ])

  assert.match(mainStore, /pick:\s*\['user', 'rememberMe'\]/)
  assert.doesNotMatch(mainStore, /pick:\s*\[[^\]]*'token'/)
  assert.match(mainStore, /store\.token = null/)

  assert.match(translateStore, /pick:\s*\['selectedLanguage'/)
  assert.doesNotMatch(translateStore, /pick:\s*\[[^\]]*'apiKey'/)
  assert.match(translateStore, /store\.apiKey = ''/)
})

test('Discord dashboard credentials are session scoped and legacy local keys are removed', async () => {
  const botStore = await source('../src/features/translate/stores/useTranslateBotStore.js')

  assert.match(botStore, /defineStore\('translateBot'/)
  assert.match(botStore, /storage:\s*sessionStorage/)
  assert.match(botStore, /pick:\s*\['discordUser', 'sessionId'\]/)
  assert.doesNotMatch(botStore, /localStorage\.setItem\('discord_(?:user|session_id|token)'/)
  assert.match(botStore, /localStorage\.removeItem\('discord_session_id'\)/)
})

test('browser source contains no Discord webhook URLs or bot API credential', async () => {
  const [topHeroesStore, botStore, envExample, functionsIndex] = await Promise.all([
    source('../src/features/topheroes/stores/useTopHeroesPublicStore.js'),
    source('../src/features/translate/stores/useTranslateBotStore.js'),
    source('../.env.example'),
    source('../functions/index.mjs'),
  ])

  assert.doesNotMatch(topHeroesStore, /discord\.com\/api\/webhooks/i)
  assert.doesNotMatch(topHeroesStore, /DISCORD_WEBHOOK/)
  assert.match(topHeroesStore, /Intentionally retired:[\s\S]*have been revoked/)
  assert.doesNotMatch(functionsIndex, /notifyTopHeroes(?:Comment|Reply)/)
  assert.doesNotMatch(botStore, /VITE_BOT_API_KEY/)
  assert.doesNotMatch(botStore, /bot-api\.mxn\.au/)
  assert.doesNotMatch(envExample, /VITE_(?:BOT_API_KEY|DISCORD_CLIENT_SECRET)/)
})

test('Discord bot privilege and actor identity are enforced behind the server boundary', async () => {
  const [sessionSource, proxySource, botStore] = await Promise.all([
    source('../functions/api/discordSession.mjs'),
    source('../functions/api/botApiProxy.mjs'),
    source('../src/features/translate/stores/useTranslateBotStore.js'),
  ])

  assert.match(sessionSource, /randomBytes\(32\)/)
  assert.match(sessionSource, /createHash\('sha256'\)/)
  assert.match(sessionSource, /requireManagedDiscordGuild/)
  assert.match(proxySource, /await requireManagedDiscordGuild\(req, serverId\)/)
  assert.match(proxySource, /invoker:\s*'public'/)
  assert.match(proxySource, /cpu:\s*'gcf_gen1'/)
  assert.match(proxySource, /userId: session\.discordUserId/)
  assert.match(proxySource, /creatorUserId: session\.discordUserId/)
  assert.doesNotMatch(botStore, /creatorUserId: this\.sessionId/)
})
