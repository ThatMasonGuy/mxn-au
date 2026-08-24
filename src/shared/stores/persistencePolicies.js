export const MAIN_PERSISTED_FIELDS = Object.freeze(['user', 'rememberMe'])
export const TRANSLATE_PERSISTED_FIELDS = Object.freeze([
  'selectedLanguage',
  'fromLanguage',
  'autoCopy',
  'recentTranslations',
  'syncHistory',
  'selectedModel',
])
export const TRANSLATE_BOT_PERSISTED_FIELDS = Object.freeze(['discordUser', 'sessionId'])

export function createMainPersistence(storage) {
  return {
    storage,
    pick: [...MAIN_PERSISTED_FIELDS],
    afterHydrate: ({ store }) => {
      store.token = null
      store.$persist()
    },
  }
}

export function createTranslatePersistence(storage) {
  return {
    storage,
    pick: [...TRANSLATE_PERSISTED_FIELDS],
    afterHydrate: ({ store }) => {
      store.apiKey = ''
      store.$persist()
    },
  }
}

export function createTranslateBotPersistence(storage, legacyStorage) {
  return {
    storage,
    pick: [...TRANSLATE_BOT_PERSISTED_FIELDS],
    afterHydrate: ({ store }) => {
      legacyStorage.removeItem('discord_user')
      legacyStorage.removeItem('discord_session_id')
      legacyStorage.removeItem('discord_token')
      store.$persist()
    },
  }
}
