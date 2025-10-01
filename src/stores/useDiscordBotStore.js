// stores/useDiscordBotStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDiscordBotStore = defineStore('discordBot', () => {
    // Authentication state
    const user = ref(null)
    const isAuthenticated = computed(() => !!user.value)

    // Server state
    const userServers = ref([])
    const botServers = ref([])
    const selectedServer = ref(null)

    // UI state
    const sidebarExpanded = ref(true)
    const currentView = ref('auth')
    const loading = ref(false)

    // Bot configuration state
    const botConfig = ref({
        translation: {
            enabled: true,
            autoDetect: true,
            provider: 'openai',
            channelMode: 'all',
            channels: [],
            threadsEnabled: true,
            rateLimit: {
                serverPerMinute: 30,
                userPerMinute: 5,
                cooldown: 2,
                maxLength: 2000
            },
            customPrompt: '',
            replyToOriginal: true,
            deleteReactions: false,
            showConfidence: true
        },
        reactionRoles: {
            enabled: true,
            removeOnUnreact: true,
            allowMultiple: true,
            requireVerification: false,
            logChanges: true,
            logChannelId: '',
            maxRolesPerUser: 10,
            maxRolesPerMessage: 10,
            messages: []
        },
        general: {
            enabled: true,
            prefix: '/',
            language: 'en',
            timezone: 'UTC',
            autoDeleteFailed: true,
            sendErrorNotifications: true,
            showCredits: false
        }
    })

    // Theme state
    const isDark = ref(true)
    const currentTheme = ref('translate')

    // Actions
    const init = () => {
        // Initialize store from localStorage if available
        const storedUser = localStorage.getItem('discord_bot_user')
        const storedConfig = localStorage.getItem('discord_bot_config')
        const storedTheme = localStorage.getItem('discord_bot_theme')

        if (storedUser) {
            user.value = JSON.parse(storedUser)
            currentView.value = 'servers'
        }

        if (storedConfig) {
            botConfig.value = { ...botConfig.value, ...JSON.parse(storedConfig) }
        }

        if (storedTheme) {
            const theme = JSON.parse(storedTheme)
            isDark.value = theme.isDark
            currentTheme.value = theme.currentTheme
        }

        // Always apply theme on init
        applyTheme()

        // For development/demo purposes, simulate authenticated state
        if (!user.value) {
            simulateAuth()
        }
    }

    const simulateAuth = () => {
        // Demo user for development
        const mockUser = {
            id: '123456789012345678',
            username: 'DemoUser',
            discriminator: '0001',
            avatar: null,
            email: 'demo@example.com'
        }

        const mockServer = {
            id: '1234567890123456789',
            name: 'Demo Server',
            icon: null,
            permissions: 8,
            memberCount: 245,
            features: ['COMMUNITY']
        }

        user.value = mockUser
        userServers.value = [mockServer]
        botServers.value = [mockServer.id]
        selectedServer.value = mockServer
        currentView.value = 'dashboard'
    }

    const authenticateWithDiscord = async () => {
        loading.value = true
        try {
            // Simulate Discord OAuth flow
            // In real implementation, this would redirect to Discord OAuth
            const authUrl = `https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=code&scope=identify%20guilds`

            // For demo purposes, simulate successful auth
            await new Promise(resolve => setTimeout(resolve, 2000))

            const mockUser = {
                id: '123456789012345678',
                username: 'DiscordUser',
                discriminator: '0001',
                avatar: null,
                email: 'user@example.com'
            }

            user.value = mockUser
            localStorage.setItem('discord_bot_user', JSON.stringify(mockUser))

            // Load user servers after authentication
            await loadUserServers()

            currentView.value = 'servers'
            return mockUser
        } catch (error) {
            console.error('Discord authentication failed:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    const logout = async () => {
        user.value = null
        userServers.value = []
        botServers.value = []
        selectedServer.value = null
        currentView.value = 'auth'

        localStorage.removeItem('discord_bot_user')
        localStorage.removeItem('discord_bot_config')
    }

    const loadUserServers = async () => {
        loading.value = true
        try {
            // Simulate API call to fetch user's servers
            await new Promise(resolve => setTimeout(resolve, 1000))

            const mockServers = [
                {
                    id: '1234567890123456789',
                    name: 'Epic Gaming Guild',
                    icon: null,
                    permissions: 8, // Administrator
                    memberCount: 245,
                    features: ['COMMUNITY', 'NEWS']
                },
                {
                    id: '2345678901234567890',
                    name: 'Translation Hub',
                    icon: null,
                    permissions: 268435456, // Manage Server
                    memberCount: 89,
                    features: ['DISCOVERABLE']
                },
                {
                    id: '3456789012345678901',
                    name: 'International Community',
                    icon: null,
                    permissions: 8,
                    memberCount: 1203,
                    features: ['COMMUNITY', 'PARTNERED']
                }
            ]

            // Filter servers where user has management permissions
            userServers.value = mockServers.filter(server =>
                (server.permissions & 8) === 8 || (server.permissions & 268435456) === 268435456
            )

            // Mock bot servers (servers where bot is already added)
            botServers.value = ['1234567890123456789']

            return userServers.value
        } catch (error) {
            console.error('Failed to load user servers:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    const setSelectedServer = (server) => {
        selectedServer.value = server
        localStorage.setItem('discord_bot_selected_server', JSON.stringify(server))
    }

    const inviteBotToServer = async (server) => {
        loading.value = true
        try {
            // Generate bot invite URL
            const botInviteUrl = `https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=268544064&guild_id=${server.id}&scope=bot%20applications.commands`

            // Open invite URL in new tab
            window.open(botInviteUrl, '_blank')

            // Simulate waiting for bot to be added
            await new Promise(resolve => setTimeout(resolve, 3000))

            // Add server to bot servers list
            if (!botServers.value.includes(server.id)) {
                botServers.value.push(server.id)
            }

            return true
        } catch (error) {
            console.error('Failed to invite bot:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    const refreshBotData = async () => {
        loading.value = true
        try {
            // Simulate refreshing bot data
            await Promise.all([
                loadUserServers(),
                loadBotStatus(),
                loadBotConfig()
            ])
        } catch (error) {
            console.error('Failed to refresh bot data:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    const loadBotStatus = async () => {
        // Simulate checking bot status in servers
        await new Promise(resolve => setTimeout(resolve, 500))
        // In real implementation, this would check if bot is online in each server
        return { status: 'online', uptime: '7d 14h' }
    }

    const loadBotConfig = async () => {
        // Simulate loading bot configuration from server
        await new Promise(resolve => setTimeout(resolve, 500))
        // In real implementation, this would fetch server-specific config
        return botConfig.value
    }

    const saveBotConfig = async (config) => {
        loading.value = true
        try {
            // Simulate saving configuration to server
            await new Promise(resolve => setTimeout(resolve, 1000))

            botConfig.value = { ...botConfig.value, ...config }
            localStorage.setItem('discord_bot_config', JSON.stringify(botConfig.value))

            return true
        } catch (error) {
            console.error('Failed to save bot config:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    // Theme methods
    const toggleDarkMode = () => {
        isDark.value = !isDark.value
        applyTheme()
        saveThemePreferences()
    }

    const setTheme = (theme) => {
        currentTheme.value = theme
        applyTheme()
        saveThemePreferences()
    }

    const applyTheme = () => {
        const root = document.documentElement

        // Remove existing theme classes
        root.classList.remove('theme-translate', 'theme-velaris', 'dark', 'froggy')

        // Apply translate theme (always dark for this bot)
        root.classList.add('theme-translate')
        if (isDark.value) {
            root.classList.add('dark')
        }

        console.log('Theme applied:', {
            isDark: isDark.value,
            currentTheme: currentTheme.value,
            classes: Array.from(root.classList)
        })
    }

    const saveThemePreferences = () => {
        const themeData = {
            isDark: isDark.value,
            currentTheme: currentTheme.value
        }
        localStorage.setItem('discord_bot_theme', JSON.stringify(themeData))
    }

    const savePreferences = () => {
        const preferences = {
            sidebarExpanded: sidebarExpanded.value,
            theme: {
                isDark: isDark.value,
                currentTheme: currentTheme.value
            }
        }
        localStorage.setItem('discord_bot_preferences', JSON.stringify(preferences))
    }

    // Navigation helper
    const navigate = (view) => {
        currentView.value = view
    }

    // Computed properties
    const isServerSelected = computed(() => !!selectedServer.value)
    const isBotInSelectedServer = computed(() =>
        selectedServer.value && botServers.value.includes(selectedServer.value.id)
    )

    const availableViews = computed(() => {
        const views = []

        if (isAuthenticated.value) {
            views.push('servers')

            if (isServerSelected.value) {
                views.push('config')

                if (isBotInSelectedServer.value) {
                    views.push('translation', 'reaction-roles', 'analytics', 'settings')
                }
            }
        } else {
            views.push('auth')
        }

        return views
    })

    return {
        // State
        user,
        userServers,
        botServers,
        selectedServer,
        sidebarExpanded,
        currentView,
        loading,
        botConfig,
        isDark,
        currentTheme,

        // Computed
        isAuthenticated,
        isServerSelected,
        isBotInSelectedServer,
        availableViews,

        // Actions
        init,
        authenticateWithDiscord,
        logout,
        loadUserServers,
        setSelectedServer,
        inviteBotToServer,
        refreshBotData,
        loadBotStatus,
        loadBotConfig,
        saveBotConfig,
        toggleDarkMode,
        setTheme,
        savePreferences,
        navigate
    }
}, {
    persist: {
        key: 'discordBotStore',
        paths: ['sidebarExpanded', 'isDark', 'currentTheme'],
        storage: localStorage
    }
})