import assert from 'node:assert/strict'
import test from 'node:test'

import { canManageDiscordGuild } from '../functions/api/discordAuthorization.mjs'
import {
  enforceTrustedBotActor,
  isAllowedBotProxyMethod,
  safeBotProxyPath,
  serverIdFromBotProxyPath,
} from '../functions/api/botProxyPolicy.mjs'
import {
  createMainPersistence,
  createTranslateBotPersistence,
  createTranslatePersistence,
} from '../src/shared/stores/persistencePolicies.js'

function persistenceStore(initial = {}) {
  let persistCalls = 0
  return {
    ...initial,
    $persist: () => { persistCalls += 1 },
    get persistCalls() { return persistCalls },
  }
}

function removalStorage() {
  const removed = []
  return {
    removeItem: (key) => removed.push(key),
    removed,
  }
}

test('browser persistence policies exclude and clear Firebase and translation credentials', () => {
  const localStorage = {}
  const mainPolicy = createMainPersistence(localStorage)
  const mainStore = persistenceStore({ token: 'firebase-id-token' })
  assert.equal(mainPolicy.storage, localStorage)
  assert.deepEqual(mainPolicy.pick, ['user', 'rememberMe'])
  mainPolicy.afterHydrate({ store: mainStore })
  assert.equal(mainStore.token, null)
  assert.equal(mainStore.persistCalls, 1)

  const translatePolicy = createTranslatePersistence(localStorage)
  const translateStore = persistenceStore({ apiKey: 'translation-api-key' })
  assert.equal(translatePolicy.storage, localStorage)
  assert.equal(translatePolicy.pick.includes('apiKey'), false)
  translatePolicy.afterHydrate({ store: translateStore })
  assert.equal(translateStore.apiKey, '')
  assert.equal(translateStore.persistCalls, 1)
})

test('Discord dashboard credentials are session scoped and legacy local keys are removed', () => {
  const sessionStorage = {}
  const legacyStorage = removalStorage()
  const policy = createTranslateBotPersistence(sessionStorage, legacyStorage)
  const store = persistenceStore()

  assert.equal(policy.storage, sessionStorage)
  assert.deepEqual(policy.pick, ['discordUser', 'sessionId'])
  policy.afterHydrate({ store })
  assert.deepEqual(legacyStorage.removed, [
    'discord_user',
    'discord_session_id',
    'discord_token',
  ])
  assert.equal(store.persistCalls, 1)
})

test('bot proxy policy rejects unsafe methods and paths while preserving bounded pagination', () => {
  const serverId = '12345678901234567'
  assert.equal(isAllowedBotProxyMethod('GET'), true)
  assert.equal(isAllowedBotProxyMethod('PATCH'), false)
  assert.equal(
    safeBotProxyPath(`/api/config/${serverId}/channels?page=2&pageSize=50&token=secret`),
    `/api/config/${serverId}/channels?page=2&pageSize=50`,
  )
  assert.equal(serverIdFromBotProxyPath(`/api/stats/${serverId}`), serverId)
  assert.equal(safeBotProxyPath(`/api/config/${serverId}/../secrets`), null)
  assert.equal(safeBotProxyPath(`/api/config/${serverId}.evil.example`), null)
  assert.equal(safeBotProxyPath('https://evil.example/api/config/12345678901234567'), null)
})

test('Discord authorization and proxy payloads derive privilege and actor identity from trusted state', () => {
  assert.equal(canManageDiscordGuild({ permissions: '8' }), true)
  assert.equal(canManageDiscordGuild({ permissions: '32' }), true)
  assert.equal(canManageDiscordGuild({ permissions: '0' }), false)
  assert.equal(canManageDiscordGuild(null), false)

  const serverId = '12345678901234567'
  const session = {
    discordUserId: 'trusted-user',
    userData: { username: 'Trusted Name', avatarUrl: 'https://cdn.example/avatar.png' },
  }
  const auditBody = enforceTrustedBotActor({
    method: 'POST',
    proxyPath: `/api/audit/${serverId}`,
    serverId,
    body: { action: 'updated', userId: 'spoofed-user', userName: 'Spoofed Name' },
    session,
  })
  assert.deepEqual(auditBody, {
    action: 'updated',
    userId: 'trusted-user',
    userName: 'Trusted Name',
    userAvatar: 'https://cdn.example/avatar.png',
  })

  const calendarBody = enforceTrustedBotActor({
    method: 'POST',
    proxyPath: `/api/calendar/${serverId}`,
    serverId,
    body: { title: 'Event', creatorUserId: 'spoofed-user' },
    session,
  })
  assert.equal(calendarBody.creatorUserId, 'trusted-user')
  assert.equal(calendarBody.title, 'Event')
})
