// stores/useTranslateBotStore.js
import { defineStore } from 'pinia'

export const useTranslateStore = defineStore('translateBot', {
  state: () => ({
    // Discord user info (safe, no tokens)
    discordUser: null,
    
    // Opaque, short-lived server session token. Never a Discord user ID.
    sessionId: null,
    
    // Server data
    discordServers: [],
    
    // Loading states
    loading: false,
    serversLoading: false,
    error: null
  }),

  getters: {
    isDiscordAuthenticated: (state) => !!state.sessionId && !!state.discordUser,

    getFunctionsUrl: () => {
      return import.meta.env.VITE_FUNCTIONS_URL || 'https://australia-southeast1-mxn-translate.cloudfunctions.net'
    },

    getServersWithBot: (state) => {
      return state.discordServers.filter(s => s.hasBotInstalled === true)
    },

    getServersWithoutBot: (state) => {
      return state.discordServers.filter(s => s.hasBotInstalled === false)
    }
  },

  actions: {
    async botApiFetch(path, options = {}) {
      if (!this.sessionId) throw new Error('Not authenticated')

      const proxyUrl = new URL(`${this.getFunctionsUrl}/botApiProxy`)
      proxyUrl.searchParams.set('path', path)

      return fetch(proxyUrl, {
        ...options,
        headers: {
          ...(options.headers || {}),
          'Authorization': `Bearer ${this.sessionId}`,
        },
      })
    },

    // ============================================================
    // DISCORD OAUTH
    // ============================================================

    loginWithDiscord() {
      const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID
      const redirectUri = import.meta.env.VITE_DISCORD_REDIRECT_URI || window.location.origin + '/translate/bot/login'

      const authUrl = new URL('https://discord.com/api/oauth2/authorize')
      authUrl.searchParams.set('client_id', clientId)
      authUrl.searchParams.set('redirect_uri', redirectUri)
      authUrl.searchParams.set('response_type', 'code')
      authUrl.searchParams.set('scope', 'identify guilds')

      window.location.href = authUrl.toString()
    },

    async handleDiscordCallback(code) {
      this.loading = true
      this.error = null

      try {
        const url = `${this.getFunctionsUrl}/discordAuth`
        console.log('[Auth] Calling:', url)

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('[Auth] Error response:', errorData)
          throw new Error(errorData.details || 'Failed to authenticate with Discord')
        }

        const data = await response.json()
        console.log('[Auth] Success, user:', data.user?.username)

        if (!data.user || !data.sessionId) {
          console.error('[Auth] Missing fields in response')
          throw new Error('Invalid response from authentication service')
        }

        this.setDiscordAuth(data.user, data.sessionId)
        return { success: true }
      } catch (error) {
        console.error('[Auth] Discord callback error:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    setDiscordAuth(user, sessionId) {
      this.discordUser = user
      this.sessionId = sessionId
    },

    loadDiscordAuth() {
      return Boolean(this.discordUser && this.sessionId)
    },

    clearAuth() {
      this.discordUser = null
      this.sessionId = null
      this.discordServers = []
      localStorage.removeItem('discord_user')
      localStorage.removeItem('discord_session_id')
      localStorage.removeItem('discord_token')
    },

    logoutDiscord() {
      this.clearAuth()
    },

    // ============================================================
    // DISCORD SERVERS
    // ============================================================

    async fetchDiscordServers() {
      console.log('[Servers] Fetching servers...')

      if (!this.sessionId) {
        console.error('[Servers] No session ID available')
        throw new Error('Not authenticated')
      }

      this.serversLoading = true
      this.error = null

      try {
        const url = `${this.getFunctionsUrl}/getDiscordServers`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.sessionId}`
          }
        })

        const data = await response.json()

        if (data.requiresReauth) {
          console.warn('[Servers] Re-authentication required')
          this.clearAuth()
          throw new Error('Session expired. Please log in again.')
        }

        if (!response.ok) {
          throw new Error(data.details || 'Failed to fetch Discord servers')
        }

        if (Array.isArray(data.servers)) {
          this.discordServers = data.servers
        } else {
          this.discordServers = []
        }

        return this.discordServers
      } catch (error) {
        console.error('[Servers] Fetch failed:', error)
        this.error = error.message
        
        if (error.message.includes('Session expired') || error.message.includes('re-authenticate')) {
          this.clearAuth()
        }
        
        throw error
      } finally {
        this.serversLoading = false
      }
    },

    getBotInviteUrl(serverId) {
      const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID
      const permissions = '274877975552'
      return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot&guild_id=${serverId}`
    },

    // ============================================================
    // SERVER EMOTES - Fetch from Discord API
    // ============================================================

    async fetchServerEmotes(serverId) {
      try {
        const response = await this.botApiFetch(`/api/discord/${serverId}/emotes`)

        if (!response.ok) {
          throw new Error('Failed to fetch server emotes')
        }

        const data = await response.json()
        return data.emotes || []
      } catch (error) {
        console.error('[Emotes] Fetch failed:', error)
        return []
      }
    },

    // ============================================================
    // SCHEDULED MESSAGES / CALENDAR
    // ============================================================

    async fetchScheduledMessages(serverId) {
      try {
        const response = await this.botApiFetch(`/api/calendar/${serverId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch scheduled messages')
        }

        return await response.json()
      } catch (error) {
        console.error('[Calendar] Fetch failed:', error)
        throw error
      }
    },

    async createScheduledMessage(serverId, payload) {
      if (!this.sessionId || !this.discordUser) {
        throw new Error('Not authenticated')
      }

      try {
        const response = await this.botApiFetch(
          `/api/calendar/${serverId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...payload
            })
          }
        )

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to create scheduled message')
        }

        const result = await response.json()

        // Log audit action
        await this.logAuditAction(
          serverId,
          'create',
          'calendar',
          `Created scheduled message: ${payload.title || 'Untitled'}`,
          { channelId: payload.channelId, scheduleType: payload.scheduleType }
        )

        return result
      } catch (error) {
        console.error('[Calendar] Create failed:', error)
        throw error
      }
    },

    async updateScheduledMessage(serverId, messageId, payload) {
      try {
        const response = await this.botApiFetch(
          `/api/calendar/${serverId}/${messageId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          }
        )

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to update scheduled message')
        }

        const result = await response.json()

        // Log audit action (only if not just pausing/unpausing)
        if (!('isPaused' in payload && Object.keys(payload).length === 1)) {
          await this.logAuditAction(
            serverId,
            'update',
            'calendar',
            `Updated scheduled message`,
            { messageId }
          )
        }

        return result
      } catch (error) {
        console.error('[Calendar] Update failed:', error)
        throw error
      }
    },

    async deleteScheduledMessage(serverId, messageId) {
      try {
        const response = await this.botApiFetch(`/api/calendar/${serverId}/${messageId}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Failed to delete scheduled message')
        }

        const result = await response.json()

        // Log audit action
        await this.logAuditAction(
          serverId,
          'delete',
          'calendar',
          'Deleted scheduled message',
          { messageId }
        )

        return result
      } catch (error) {
        console.error('[Calendar] Delete failed:', error)
        throw error
      }
    },

    // ============================================================
    // AUDIT LOGS
    // ============================================================

    async fetchAuditLogs(serverId, page = 1, pageSize = 25) {
      try {
        const response = await this.botApiFetch(`/api/audit/${serverId}?page=${page}&pageSize=${pageSize}`)

        if (!response.ok) {
          throw new Error('Failed to fetch audit logs')
        }

        return await response.json()
      } catch (error) {
        console.error('[Audit] Fetch failed:', error)
        throw error
      }
    },

    async logAuditAction(serverId, action, category, details, metadata = null) {
      if (!this.sessionId || !this.discordUser) {
        console.warn('[Audit] Cannot log action - not authenticated')
        return
      }

      try {
        await this.botApiFetch(
          `/api/audit/${serverId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              action,
              category,
              details,
              metadata: metadata ? JSON.stringify(metadata) : null
            })
          }
        )
      } catch (error) {
        // Don't throw - audit logging shouldn't break the main action
        console.error('[Audit] Log failed:', error)
      }
    },

    // ============================================================
    // SERVER CHANNELS - Fetch fresh from Discord API
    // ============================================================

    async fetchServerChannels(serverId) {
      if (!this.sessionId) {
        throw new Error('Not authenticated')
      }

      try {
        // Call Firebase function which will fetch fresh channels from Discord
        const response = await fetch(
          `${this.getFunctionsUrl}/getServerChannels?serverId=${serverId}`,
          {
            headers: {
              'Authorization': `Bearer ${this.sessionId}`
            }
          }
        )

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.details || 'Failed to fetch channels')
        }

        const data = await response.json()
        return data.channels || []
      } catch (error) {
        console.error('[Channels] Fetch failed:', error)
        throw error
      }
    },

    // ============================================================
    // SERVER CONFIG
    // ============================================================

    async fetchServerConfig(serverId) {
      try {
        const response = await this.botApiFetch(`/api/config/${serverId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch config')
        }

        return await response.json()
      } catch (error) {
        console.error('[Config] Fetch failed:', error)
        throw error
      }
    },

    async updateGeneralConfig(serverId, enabled) {
      try {
        const response = await this.botApiFetch(
          `/api/config/${serverId}/general`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ enabled })
          }
        )

        if (!response.ok) {
          throw new Error('Failed to update config')
        }

        const result = await response.json()

        // Log audit action
        await this.logAuditAction(
          serverId,
          enabled ? 'enable' : 'disable',
          'general',
          enabled ? 'Enabled translation for server' : 'Disabled translation for server'
        )

        return result
      } catch (error) {
        console.error('[Config] Update failed:', error)
        throw error
      }
    },

    // ============================================================
    // BLOCKED CHANNELS
    // ============================================================

    async blockChannel(serverId, channelId) {
      try {
        const response = await this.botApiFetch(
          `/api/config/${serverId}/block-channel`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ channelId })
          }
        )

        if (!response.ok) {
          throw new Error('Failed to block channel')
        }

        const result = await response.json()

        // Log audit action
        await this.logAuditAction(
          serverId,
          'create',
          'restriction',
          'Blocked channel from translations',
          { channelId }
        )

        return result
      } catch (error) {
        console.error('[Config] Block channel failed:', error)
        throw error
      }
    },

    async unblockChannel(serverId, channelId) {
      try {
        const response = await this.botApiFetch(
          `/api/config/${serverId}/unblock-channel`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ channelId })
          }
        )

        if (!response.ok) {
          throw new Error('Failed to unblock channel')
        }

        const result = await response.json()

        // Log audit action
        await this.logAuditAction(
          serverId,
          'delete',
          'restriction',
          'Unblocked channel for translations',
          { channelId }
        )

        return result
      } catch (error) {
        console.error('[Config] Unblock channel failed:', error)
        throw error
      }
    },

    // ============================================================
    // ANNOUNCEMENT ROUTES
    // ============================================================

    async addAnnouncementRoute(serverId, sourceChannelId, announcementChannelId) {
      try {
        const response = await this.botApiFetch(
          `/api/config/${serverId}/announcement-route`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sourceChannelId, announcementChannelId })
          }
        )

        if (!response.ok) {
          throw new Error('Failed to add announcement route')
        }

        const result = await response.json()

        // Log audit action
        await this.logAuditAction(
          serverId,
          'create',
          'redirect',
          'Added translation redirect',
          { sourceChannelId, announcementChannelId }
        )

        return result
      } catch (error) {
        console.error('[Config] Add announcement route failed:', error)
        throw error
      }
    },

    async removeAnnouncementRoute(serverId, sourceChannelId) {
      try {
        const response = await this.botApiFetch(`/api/config/${serverId}/announcement-route/${sourceChannelId}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Failed to remove announcement route')
        }

        const result = await response.json()

        // Log audit action
        await this.logAuditAction(
          serverId,
          'delete',
          'redirect',
          'Removed translation redirect',
          { sourceChannelId }
        )

        return result
      } catch (error) {
        console.error('[Config] Remove announcement route failed:', error)
        throw error
      }
    },

    // ============================================================
    // AUTO-TRANSLATE
    // ============================================================

    async createAutoTranslatePair(serverId, payload) {
      if (!this.sessionId) {
        throw new Error('Not authenticated')
      }

      try {
        const response = await fetch(
          `${this.getFunctionsUrl}/createAutoTranslatePair`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.sessionId}`
            },
            body: JSON.stringify({
              serverId,
              ...payload
            })
          }
        )

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.details || data.error || 'Failed to create auto-translate pair')
        }

        const result = await response.json()

        // Log audit action
        await this.logAuditAction(
          serverId,
          'create',
          'auto_translate',
          `Created auto-translate pair to ${payload.targetLanguage?.toUpperCase()}`,
          { sourceChannelId: payload.sourceChannelId, channelId: result.channelId, language: payload.targetLanguage }
        )

        return result
      } catch (error) {
        console.error('[AutoTranslate] Create failed:', error)
        throw error
      }
    },

    async deleteAutoTranslateChannel(serverId, channelId) {
      try {
        const response = await this.botApiFetch(`/api/config/${serverId}/auto-translate/${channelId}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Failed to delete auto-translate channel')
        }

        const result = await response.json()

        // Log audit action
        await this.logAuditAction(
          serverId,
          'delete',
          'auto_translate',
          'Removed auto-translate pair',
          { channelId }
        )

        return result
      } catch (error) {
        console.error('[Config] Delete auto-translate failed:', error)
        throw error
      }
    },

    // ============================================================
    // SERVER ROLES - Fetch fresh from Discord API
    // ============================================================

    async fetchServerRoles(serverId) {
      if (!this.sessionId) {
        throw new Error('Not authenticated')
      }

      try {
        const response = await fetch(
          `${this.getFunctionsUrl}/getServerRoles?serverId=${serverId}`,
          {
            headers: {
              'Authorization': `Bearer ${this.sessionId}`
            }
          }
        )

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.details || 'Failed to fetch roles')
        }

        const data = await response.json()
        return data.roles || []
      } catch (error) {
        console.error('[Roles] Fetch failed:', error)
        throw error
      }
    },

    // ============================================================
    // SERVER STATS
    // ============================================================

    async fetchServerStats(serverId) {
      try {
        const response = await this.botApiFetch(`/api/stats/${serverId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }

        const data = await response.json()
        return data.stats || {
          channels: { total: 0, mostActive: null, mostActiveCount: 0 },
          messages: { total: 0, lastWeek: 0 },
          users: { current: 0, total: 0, activeLastWeek: 0 },
          translations: { total: 0, lastWeek: 0, languagesUsed: 0, topLanguage: null },
          autoTranslate: { pairs: 0, activePairs: 0 },
          announcements: { routes: 0 },
          restrictions: { blockedChannels: 0 }
        }
      } catch (error) {
        console.error('[Stats] Fetch failed:', error)
        throw error
      }
    }
  },

  persist: {
    storage: sessionStorage,
    pick: ['discordUser', 'sessionId'],
    afterHydrate: ({ store }) => {
      localStorage.removeItem('discord_user')
      localStorage.removeItem('discord_session_id')
      localStorage.removeItem('discord_token')
      store.$persist()
    }
  }
})
