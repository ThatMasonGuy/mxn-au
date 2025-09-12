import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
    doc,
    onSnapshot,
    collection,
    query,
    orderBy,
    limit,
    deleteDoc
} from 'firebase/firestore'
import { firestore, auth } from '@/firebase'
import { useMainStore } from '@/stores/useMainStore'

// shadcn/vue toast
import { useToast } from '@/components/ui/toast/use-toast'

export const useTranslateStore = defineStore('translate', () => {
    // --- Stores ---
    const mainStore = useMainStore()

    // --- Core UI State ---
    const settingsOpen = ref(false)
    const showApiKey = ref(false)
    const isTranslating = ref(false)

    // --- Translation Result State ---
    const accuracy = ref(null)
    const accuracyRating = ref(null)
    const lastOriginalText = ref('')
    const lastTranslationDirection = ref('left')
    const leftText = ref('')
    const rightText = ref('')
    const retranslatedText = ref('')

    // --- Global Stats State (from 'translations/meta') ---
    const appStats = ref(null)
    const languageStats = ref({})
    const dailyStats = ref({})
    const hourlyStats = ref({})

    // --- Discord Stats State (from 'translations/discord') ---
    const discordStats = ref(null) // single doc listener
    const discordGuilds = ref({})
    const discordChannels = ref({})
    const discordUsers = ref({})
    const discordDailyStats = ref({})
    const discordHourlyStats = ref({})
    const discordLanguages = ref({})
    const discordChannelsByGuild = ref({})
    const discordChannelListeners = ref([])

    // --- Error Logging State ---
    const errorLogs = ref({})
    const connectionRetries = ref(0)
    const maxRetries = 3

    // --- Firestore Unsubscribe Refs ---
    const unsubscribers = ref([])
    const unsubscribeHistory = ref(null)

    // --- Persisted Settings ---
    const apiKey = ref('')
    const selectedLanguage = ref('es')
    const fromLanguage = ref('en')
    const autoCopy = ref(false)
    const syncHistory = ref(true)

    // --- History State ---
    const recentTranslations = ref([])
    const userHistory = ref([])

    // --- Constants ---
    const MAX_HISTORY_SIZE = 20

    // OpenAI GPT-4o pricing (per 1M tokens) - aligned with backend
    const GPT4O_INPUT_COST_PER_MILLION = 2.5
    const GPT4O_OUTPUT_COST_PER_MILLION = 10.0

    const languages = [
        { code: 'en', name: 'English' }, { code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' }, { code: 'it', name: 'Italian' }, { code: 'pt', name: 'Portuguese' },
        { code: 'ja', name: 'Japanese' }, { code: 'ko', name: 'Korean' }, { code: 'zh', name: 'Chinese (Simplified)' },
        { code: 'ru', name: 'Russian' }, { code: 'ar', name: 'Arabic' }, { code: 'hi', name: 'Hindi' },
        { code: 'tr', name: 'Turkish' }, { code: 'nl', name: 'Dutch' }, { code: 'sv', name: 'Swedish' },
        { code: 'no', name: 'Norwegian' }, { code: 'da', name: 'Danish' }, { code: 'fi', name: 'Finnish' },
        { code: 'pl', name: 'Polish' }, { code: 'cs', name: 'Czech' }, { code: 'hu', name: 'Hungarian' },
        { code: 'th', name: 'Thai' }, { code: 'vi', name: 'Vietnamese' }
    ]

    const langFlagMap = {
        English: 'gb', Spanish: 'es', French: 'fr', German: 'de', Italian: 'it',
        Portuguese: 'pt', Japanese: 'jp', Korean: 'kr', 'Chinese (Simplified)': 'cn',
        Russian: 'ru', Arabic: 'sa', Hindi: 'in', Turkish: 'tr', Dutch: 'nl',
        Swedish: 'se', Norwegian: 'no', Danish: 'dk', Finnish: 'fi', Polish: 'pl',
        Czech: 'cz', Hungarian: 'hu', Thai: 'th', Vietnamese: 'vn'
    }

    // --- Toast helper available to ANY consumer ---
    // Usage: store.showToast('success'|'error'|'warning'|'info', 'Message', { description?, duration? })
    const { toast } = useToast()

    const showToast = (type, message, options = {}) => {
        const toastConfig = {
            title: getToastTitle(type),
            description: message,
            duration: options.duration ?? 2500,
            ...options
        }

        // Set variant based on type
        if (type === 'error') {
            toastConfig.variant = 'destructive'
        } else {
            toastConfig.variant = 'default'
        }

        try {
            toast(toastConfig)
        } catch (e) {
            // Fallback if toast system isn't available
            console.warn('[toast] Could not display toast:', e)
        }
    }

    // Helper to get appropriate toast titles
    const getToastTitle = (type) => {
        switch (type) {
            case 'success': return 'Success'
            case 'error': return 'Error'
            case 'warning': return 'Warning'
            case 'info': return 'Info'
            default: return 'Notification'
        }
    }

    // --- Token Refresh Helper (FIXED: Less aggressive, no forced logout) ---
    const getValidToken = async () => {
        if (!mainStore.user) return null

        try {
            // Force token refresh to ensure it's valid
            const token = await auth.currentUser?.getIdToken(true)
            return token
        } catch (error) {
            console.error('Failed to refresh token:', error)
            // Try to re-authenticate once more
            if (auth.currentUser) {
                try {
                    await auth.currentUser.reload()
                    return await auth.currentUser.getIdToken(true)
                } catch (retryError) {
                    console.error('Token refresh retry failed:', retryError)
                    // FIXED: Don't force logout - just return null and let the app continue without auth
                    console.warn('Continuing without authentication for this request')
                    return null
                }
            }
            return null
        }
    }

    // --- Computed Properties ---
    const isSyncing = computed(() => mainStore.user && syncHistory.value)
    const history = computed(() => isSyncing.value ? userHistory.value : recentTranslations.value)
    const hasApiKey = computed(() => apiKey.value.trim() !== '')
    const canTranslateLeft = computed(() => leftText.value.trim() && !isTranslating.value)
    const canTranslateRight = computed(() => rightText.value.trim() && !isTranslating.value)
    const leftLanguageName = computed(() => languages.find(l => l.code === fromLanguage.value)?.name || fromLanguage.value)
    const rightLanguageName = computed(() => languages.find(l => l.code === selectedLanguage.value)?.name || selectedLanguage.value)
    const retranslationTargetLanguageName = computed(() => lastTranslationDirection.value === 'left' ? leftLanguageName.value : rightLanguageName.value)
    const formattedTranslations = computed(() => appStats.value?.totalTranslations?.toLocaleString() || '0')
    const formattedWords = computed(() => appStats.value?.totalWords?.toLocaleString() || '0')

    // Fixed cost calculation aligned with backend
    const formattedApiCost = computed(() => {
        if (!appStats.value?.tokenUsage) return '$0.00'

        const promptTokens = appStats.value.tokenUsage.prompt || 0
        const completionTokens = appStats.value.tokenUsage.completion || 0

        const inputCost = (promptTokens / 1000000) * GPT4O_INPUT_COST_PER_MILLION
        const outputCost = (completionTokens / 1000000) * GPT4O_OUTPUT_COST_PER_MILLION
        const totalCost = inputCost + outputCost

        return `$${totalCost.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 5
        })}`
    })

    const accuracyPercentage = computed(() => accuracy.value !== null ? Math.round(accuracy.value * 100) : null)
    const accuracyBarClass = computed(() => {
        const acc = accuracy.value != null ? accuracy.value * 100 : 100
        if (acc > 80) return 'bg-green-500'
        if (acc > 60) return 'bg-yellow-500'
        if (acc > 40) return 'bg-orange-500'
        return 'bg-red-500'
    })

    const retranslationWithDiff = computed(() => highlightDifferences(lastOriginalText.value, retranslatedText.value))

    const topLanguages = computed(() => {
        if (!languageStats.value || Object.keys(languageStats.value).length === 0) return []
        const total = Object.values(languageStats.value).reduce((sum, lang) => sum + (lang.translations || 0), 0)
        if (total === 0) return []
        return Object.entries(languageStats.value)
            .map(([code, data]) => {
                const langObj = languages.find(l => l.code === code)
                return {
                    code,
                    name: langObj?.name || code,
                    flag: `fi fi-${langFlagMap[langObj?.name] || code.toLowerCase()}`,
                    percentage: Math.round(((data.translations || 0) / total) * 100),
                    count: (data.translations || 0).toLocaleString(),
                    translations: data.translations || 0
                }
            })
            .filter(lang => lang.translations > 0)
            .sort((a, b) => b.translations - a.translations)
            .slice(0, 5)
    })

    const topDiscordChannels = computed(() => {
        const channels = []

        // Iterate through all guilds and their channels
        Object.entries(discordChannelsByGuild.value || {}).forEach(([guildId, guildChannels]) => {
            const guild = discordGuilds.value?.[guildId]
            const guildName = guild?.guildName || 'Unknown Server'

            Object.entries(guildChannels || {}).forEach(([channelId, channel]) => {
                channels.push({
                    id: channelId,
                    name: channel.channelName || 'Unknown Channel',
                    guildName: guildName,
                    translations: channel.totalTranslations || channel.freshTranslations || 0,
                    uniqueUsers: channel.uniqueUsers?.length || 0
                })
            })
        })

        return channels
            .sort((a, b) => b.translations - a.translations)
            .slice(0, 3)
    })

    const discordCounts = computed(() => {
        const stats = discordStats.value || {}

        // Count channels from the subcollection data
        const channelCount = Object.values(discordChannelsByGuild.value || {})
            .reduce((total, guildChannels) => total + Object.keys(guildChannels || {}).length, 0)

        return {
            guilds: typeof stats.guildCount === 'number' ? stats.guildCount : Object.keys(discordGuilds.value || {}).length,
            channels: typeof stats.channelCount === 'number' ? stats.channelCount : channelCount,
            users: typeof stats.userCount === 'number' ? stats.userCount : Object.keys(discordUsers.value || {}).length,
        }
    })

    const activeToday = computed(() => {
        const today = new Date().toISOString().split('T')[0]
        const todayStats = dailyStats.value[today]
        return todayStats?.uniqueUsers?.length || 0
    })

    const discordGlobalStats = computed(() => {
        const stats = discordStats.value || {}
        const counts = discordCounts.value

        return {
            totalTranslations: stats.totalTranslations?.toLocaleString() || '0',
            totalGuilds: counts.guilds,
            totalChannels: counts.channels,
            activeDiscordUsers: counts.users,
        }
    })

    // Update the topDiscordGuilds computed property to use correct channel counts
    const topDiscordGuilds = computed(() => {
        return Object.entries(discordGuilds.value || {})
            .map(([id, data]) => ({
                id,
                name: data.guildName || 'Unknown Server',
                translations: data.totalTranslations || 0,
                uniqueUsers: data.uniqueUsers?.length || 0,
                // Get channel count from the new discordChannelsByGuild structure
                channels: Object.keys(discordChannelsByGuild.value?.[id] || {}).length
            }))
            .sort((a, b) => b.translations - a.translations)
            .slice(0, 3)
    })

    // Update the topDiscordUsers computed property to show user name and actual cost
    const topDiscordUsers = computed(() => {
        const users = discordUsers.value || {}
        return Object.entries(users)
            .map(([userId, data]) => ({
                id: userId,
                userName: data.userName || `User ${userId.substring(0, 8)}`, // Use userName or fallback
                translations: data.totalTranslations || 0,
                words: data.totalWords || 0,
                avgResponseTime: data.totalResponseTime
                    ? Math.round(data.totalResponseTime / data.totalTranslations)
                    : 0,
                // Calculate actual cost instead of savings
                actualCost: calculateUserActualCost(data)
            }))
            .sort((a, b) => b.translations - a.translations)
            .slice(0, 3)
    })

    // Add helper function to calculate actual cost (not savings)
    const calculateUserActualCost = (userData) => {
        if (!userData?.tokenUsage) return 0

        const promptTokens = userData.tokenUsage.prompt || 0
        const completionTokens = userData.tokenUsage.completion || 0

        const inputCost = (promptTokens / 1000000) * GPT4O_INPUT_COST_PER_MILLION
        const outputCost = (completionTokens / 1000000) * GPT4O_OUTPUT_COST_PER_MILLION

        return inputCost + outputCost
    }

    const hasDiscordData = computed(() => discordStats.value !== null || Object.keys(discordGuilds.value || {}).length > 0)

    // --- Helper to calculate user savings ---
    const calculateUserSavings = (userData) => {
        if (!userData?.savedTokenUsage) return 0

        const promptSaved = (userData.savedTokenUsage.prompt || 0) / 1000000 * GPT4O_INPUT_COST_PER_MILLION
        const completionSaved = (userData.savedTokenUsage.completion || 0) / 1000000 * GPT4O_OUTPUT_COST_PER_MILLION

        return promptSaved + completionSaved
    }

    // --- Methods ---
    const translate = async (fromSide = 'left') => {
        const isLeftToRight = fromSide === 'left'
        const inputText = isLeftToRight ? leftText.value : rightText.value
        const fromLang = isLeftToRight ? fromLanguage.value : selectedLanguage.value
        const toLang = isLeftToRight ? selectedLanguage.value : fromLanguage.value
        const finalKey = apiKey.value?.trim() || import.meta.env.VITE_OPENAI_API_KEY_TRANSLATION_GENERIC

        if (!inputText?.trim()) {
            showToast('error', 'Please enter text to translate')
            return { ok: false, error: 'Missing input text', apiTimeMs: 0 }
        }

        if (!finalKey) {
            showToast('error', 'API key required for translation')
            return { ok: false, error: 'Missing API key', apiTimeMs: 0 }
        }

        if (isTranslating.value) {
            return { ok: false, skipped: true, apiTimeMs: 0 }
        }

        isTranslating.value = true
        lastOriginalText.value = inputText
        lastTranslationDirection.value = fromSide

        let apiTimeMs = 0
        let serverTimeMs = null
        let openAiTimeMs = null
        let triedWithAuth = false
        let triedWithoutAuth = false

        try {
            // Try with auth first if user is logged in
            if (mainStore.user && !triedWithAuth) {
                try {
                    console.log('Attempting translation with authentication...')
                    const result = await attemptTranslation(inputText, fromLang, toLang, finalKey, true)
                    if (result.success) {
                        return handleSuccessfulTranslation(result, isLeftToRight)
                    }
                    triedWithAuth = true
                    console.log('Auth translation failed, trying without auth...')
                } catch (error) {
                    console.log('Auth translation error:', error.message)
                    triedWithAuth = true
                }
            }

            // Try without auth
            if (!triedWithoutAuth) {
                try {
                    console.log('Attempting translation without authentication...')
                    const result = await attemptTranslation(inputText, fromLang, toLang, finalKey, false)
                    if (result.success) {
                        return handleSuccessfulTranslation(result, isLeftToRight)
                    }
                    triedWithoutAuth = true
                } catch (error) {
                    console.log('Non-auth translation error:', error.message)
                    triedWithoutAuth = true
                }
            }

            // If both attempts failed, show user feedback
            const errorMsg = 'Translation failed. Please check your connection and try again.'
            showToast('error', errorMsg)

            // Clean up on failure
            retranslatedText.value = ''
            lastOriginalText.value = ''
            accuracy.value = null
            accuracyRating.value = null

            return { ok: false, apiTimeMs, serverTimeMs, openAiTimeMs, error: errorMsg }

        } finally {
            isTranslating.value = false
        }
    }

    // Helper function to attempt translation with or without auth
    const attemptTranslation = async (inputText, fromLang, toLang, apiKey, useAuth = false) => {
        const headers = {
            'Content-Type': 'application/json',
            'x-openai-key': apiKey
        }

        // Only add auth header if explicitly requested and we can get a valid token
        if (useAuth && mainStore.user) {
            const token = await getValidToken()
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            } else {
                throw new Error('Could not get valid authentication token')
            }
        }

        const apiStart = performance.now()
        const resp = await fetch('/translate/post', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                content: inputText,
                fromLang,
                targetLang: toLang
            })
        })
        const apiTimeMs = Math.round(performance.now() - apiStart)

        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}))
            const errorMessage = err?.error || `HTTP ${resp.status}: ${resp.statusText}`
            throw new Error(errorMessage)
        }

        const data = await resp.json()
        return {
            success: true,
            data,
            apiTimeMs,
            serverTimeMs: typeof data?.responseTime === 'number' ? data.responseTime : null,
            openAiTimeMs: data?.metrics?.openAiTimeMs ?? data?.openAiTimeMs ?? (data?.cached ? 0 : null)
        }
    }

    // Helper function to handle successful translation
    const handleSuccessfulTranslation = (result, isLeftToRight) => {
        const { data, apiTimeMs, serverTimeMs, openAiTimeMs } = result

        const outputText = data.translated || data.outputText || ''
        accuracy.value = typeof data.accuracy === 'number' ? data.accuracy : null
        accuracyRating.value = data.accuracyRating || null

        // Set the translated text
        if (isLeftToRight) {
            rightText.value = outputText
        } else {
            leftText.value = outputText
        }

        retranslatedText.value = data.retranslated || ''

        // Auto-copy silently if enabled
        if (autoCopy.value && outputText) {
            copyToClipboard(outputText, { silent: true }).catch(() => {
                // Ignore copy failures
            })
        }

        // Save to local history if not syncing (authenticated users who sync will have server-side history)
        if (!isSyncing.value) {
            const translationResult = {
                id: crypto.randomUUID(),
                inputText: lastOriginalText.value,
                translated: outputText,
                sourceLang: isLeftToRight ? fromLanguage.value : selectedLanguage.value,
                targetLang: isLeftToRight ? selectedLanguage.value : fromLanguage.value,
                accuracy: accuracy.value,
                accuracyRating: accuracyRating.value,
                cached: !!data.cached,
                responseTime: apiTimeMs,
                tokenUsage: data.tokenUsage || null,
                wordCount: data.wordCount || lastOriginalText.value.trim().split(/\s+/).length,
                charCount: data.charCount || lastOriginalText.value.length,
                timestamp: new Date().toISOString()
            }
            addTranslationToLocalHistory(translationResult)
        }

        connectionRetries.value = 0

        // Show success feedback
        showToast('success', 'Translation completed!', { duration: 1500 })

        return {
            ok: true,
            apiTimeMs,
            serverTimeMs,
            openAiTimeMs,
            cached: !!data.cached
        }
    }

    const addTranslationToLocalHistory = (translation) => {
        recentTranslations.value.unshift(translation)
        if (recentTranslations.value.length > MAX_HISTORY_SIZE) {
            recentTranslations.value.pop()
        }
    }

    const deleteHistoryItem = async (id) => {
        if (isSyncing.value) {
            try {
                const docRef = doc(firestore, `users/${mainStore.user.uid}/translations`, id)
                await deleteDoc(docRef)
                showToast('success', 'History item removed from cloud.')
                return { ok: true, scope: 'cloud' }
            } catch (error) {
                console.error('Failed to delete cloud history item:', error)
                showToast('error', 'Could not remove item from cloud.')
                return { ok: false, scope: 'cloud', error }
            }
        } else {
            const idx = recentTranslations.value.findIndex((t) => t.id === id)
            if (idx !== -1) {
                recentTranslations.value.splice(idx, 1)
                showToast('success', 'History item removed.')
                return { ok: true, scope: 'local' }
            }
            showToast('error', 'Item not found in local history.')
            return { ok: false, scope: 'local', error: new Error('Item not found') }
        }
    }

    const clearHistory = async () => {
        if (isSyncing.value) {
            showToast('error', 'Clearing cloud history is not available from the client.')
            return { ok: false, scope: 'cloud', code: 'cloud-clear-blocked' }
        } else {
            recentTranslations.value = []
            showToast('success', 'Local history cleared.')
            return { ok: true, scope: 'local' }
        }
    }

    // Enhanced listener with reconnection logic (toasts on terminal failure)
    const createListener = (path, targetRef, isCollection = true) => {
        let unsubscribe = null
        let reconnectTimeout = null

        const setupListener = () => {
            try {
                const refObj = isCollection ? collection(firestore, path) : doc(firestore, path)

                unsubscribe = onSnapshot(refObj,
                    (snapshot) => {
                        connectionRetries.value = 0 // Reset on success

                        if (isCollection) {
                            const data = {}
                            snapshot.forEach(doc => { data[doc.id] = doc.data() })
                            targetRef.value = data
                        } else {
                            targetRef.value = snapshot.exists() ? snapshot.data() : null
                        }
                    },
                    (error) => {
                        console.error(`[LISTENER] Error listening to ${path}:`, error)

                        // Handle permission/auth errors
                        if (error.code === 'permission-denied' && connectionRetries.value < maxRetries) {
                            connectionRetries.value++
                            console.log(`Retrying listener for ${path} (attempt ${connectionRetries.value})...`)

                            // Retry with exponential backoff
                            reconnectTimeout = setTimeout(() => {
                                if (unsubscribe) unsubscribe()
                                setupListener()
                            }, 1000 * Math.pow(2, connectionRetries.value))
                        } else if (connectionRetries.value >= maxRetries) {
                            showToast('error', `Failed to load data from ${path}. Please refresh the page.`)
                        }
                    }
                )

                unsubscribers.value.push(() => {
                    if (unsubscribe) unsubscribe()
                    if (reconnectTimeout) clearTimeout(reconnectTimeout)
                })

            } catch (error) {
                console.error(`[LISTENER] Failed to set up listener for ${path}:`, error)
                showToast('error', `Could not connect to service at ${path}.`)
            }
        }

        setupListener()
    }

    const createChannelListener = (guildId) => {
        const channelPath = `translations/discord/guilds/${guildId}/channels`

        try {
            const channelsRef = collection(firestore, channelPath)

            const unsubscribe = onSnapshot(channelsRef,
                (snapshot) => {
                    const channelData = {}
                    snapshot.forEach(doc => {
                        channelData[doc.id] = doc.data()
                    })

                    // Update the channels for this specific guild
                    if (!discordChannelsByGuild.value[guildId]) {
                        discordChannelsByGuild.value[guildId] = {}
                    }
                    discordChannelsByGuild.value[guildId] = channelData
                },
                (error) => {
                    console.error(`[CHANNEL_LISTENER] Error listening to ${channelPath}:`, error)
                }
            )

            // Store the unsubscribe function
            discordChannelListeners.value.push(unsubscribe)

        } catch (error) {
            console.error(`[CHANNEL_LISTENER] Failed to set up listener for ${channelPath}:`, error)
        }
    }

    // Helper function to cleanup all channel listeners
    const cleanupChannelListeners = () => {
        discordChannelListeners.value.forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') {
                unsubscribe()
            }
        })
        discordChannelListeners.value = []
        discordChannelsByGuild.value = {}
    }

    // Update the initializeAllListeners function
    const initializeAllListeners = () => {
        cleanupAllListeners()

        // --- Global Stats Listeners ---
        createListener('translations/meta', appStats, false)
        createListener('translations/meta/languages', languageStats)
        createListener('translations/meta/daily_stats', dailyStats)
        createListener('translations/meta/hourly_stats', hourlyStats)

        // --- Discord Stats Listeners ---
        createListener('translations/discord', discordStats, false) // doc with counts

        // Listen to guilds and set up channel listeners when guilds change
        const guildsRef = collection(firestore, 'translations/discord/guilds')
        const unsubscribeGuilds = onSnapshot(guildsRef,
            (snapshot) => {
                const guildData = {}
                const newGuildIds = new Set()

                snapshot.forEach(doc => {
                    guildData[doc.id] = doc.data()
                    newGuildIds.add(doc.id)
                })

                discordGuilds.value = guildData

                // Clean up old channel listeners
                cleanupChannelListeners()

                // Set up channel listeners for each guild
                newGuildIds.forEach(guildId => {
                    createChannelListener(guildId)
                })
            },
            (error) => {
                console.error('[GUILD_LISTENER] Error listening to guilds:', error)
            }
        )

        unsubscribers.value.push(unsubscribeGuilds)
        unsubscribers.value.push(() => cleanupChannelListeners())

        createListener('translations/discord/users', discordUsers)
        createListener('translations/discord/daily_stats', discordDailyStats)
        createListener('translations/discord/hourly_stats', discordHourlyStats)
        createListener('translations/discord/languages', discordLanguages)
    }

    // Update the cleanupAllListeners function
    const cleanupAllListeners = () => {
        unsubscribers.value.forEach(unsub => unsub())
        unsubscribers.value = []
        cleanupChannelListeners() // Clean up channel listeners too
    }

    const initializeUserHistoryListener = (userId) => {
        cleanupUserHistoryListener()

        let reconnectTimeout = null

        const setupHistoryListener = async () => {
            try {
                const historyPath = `users/${userId}/translations`
                const translationsRef = collection(firestore, historyPath)
                const q = query(translationsRef, orderBy('timestamp', 'desc'), limit(MAX_HISTORY_SIZE))

                unsubscribeHistory.value = onSnapshot(q,
                    (snapshot) => {
                        connectionRetries.value = 0 // Reset on success

                        const historyData = snapshot.docs
                            .filter(doc => doc.id !== 'meta')
                            .map(doc => ({
                                id: doc.id,
                                ...doc.data(),
                                // Ensure timestamp is in correct format
                                timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp
                            }))

                        userHistory.value = historyData
                    },
                    async (error) => {
                        console.error('[HISTORY] Error in onSnapshot:', error)

                        // Handle auth errors with retry
                        if (error.code === 'permission-denied' && connectionRetries.value < maxRetries) {
                            connectionRetries.value++
                            console.log(`Retrying history listener (attempt ${connectionRetries.value})...`)

                            // Get fresh token (but don't force logout on failure)
                            await getValidToken()

                            // Retry with exponential backoff
                            reconnectTimeout = setTimeout(() => {
                                setupHistoryListener()
                            }, 1000 * Math.pow(2, connectionRetries.value))
                        } else if (connectionRetries.value >= maxRetries) {
                            // FIXED: Don't force auth failure, just fall back to local mode
                            console.warn('Max retries exceeded for history listener, falling back to local history')
                            cleanupUserHistoryListener()
                        }
                    }
                )
            } catch (error) {
                console.error('[HISTORY] Listener setup failed:', error)
            }
        }

        setupHistoryListener()

        // Store cleanup function
        if (reconnectTimeout) {
            unsubscribers.value.push(() => clearTimeout(reconnectTimeout))
        }
    }

    const cleanupUserHistoryListener = () => {
        if (unsubscribeHistory.value) {
            unsubscribeHistory.value()
            unsubscribeHistory.value = null
        }
        if (userHistory.value.length > 0) {
            userHistory.value = []
        }
    }

    // Watch for sync changes with better error handling
    watch(isSyncing, async (newIsSyncing) => {
        if (newIsSyncing && mainStore.user?.uid) {
            // FIXED: Don't require token validation for setting up listeners
            initializeUserHistoryListener(mainStore.user.uid)
        } else {
            console.log('[WATCHER] Cleaning up user history listener.')
            cleanupUserHistoryListener()
        }
    }, { immediate: true })

    // --- Utility Functions ---
    const flagClass = (langName) => {
        if (!langName) return ''
        const code = langFlagMap[langName]
        if (code) return `fi fi-${code}`
        return ''
    }

    const highlightDifferences = (originalText, modifiedText) => {
        if (!originalText || !modifiedText) return modifiedText.replace(/</g, '&lt;').replace(/>/g, '&gt;')

        const splitRegex = /(\s+)/
        const originalWords = originalText.split(splitRegex)
        const modifiedWords = modifiedText.split(splitRegex)
        const lcsMatrix = Array(originalWords.length + 1).fill(null).map(() => Array(modifiedWords.length + 1).fill(0))

        for (let i = 1; i <= originalWords.length; i++) {
            for (let j = 1; j <= modifiedWords.length; j++) {
                if (originalWords[i - 1] === modifiedWords[j - 1]) {
                    lcsMatrix[i][j] = 1 + lcsMatrix[i - 1][j - 1]
                } else {
                    lcsMatrix[i][j] = Math.max(lcsMatrix[i - 1][j], lcsMatrix[i][j - 1])
                }
            }
        }

        let i = originalWords.length, j = modifiedWords.length
        const result = []

        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && originalWords[i - 1] === modifiedWords[j - 1]) {
                result.unshift({ text: modifiedWords[j - 1], type: 'common' })
                i--; j--
            } else if (j > 0 && (i === 0 || lcsMatrix[i][j - 1] >= lcsMatrix[i - 1][j])) {
                result.unshift({ text: modifiedWords[j - 1], type: 'added' })
                j--
            } else if (i > 0 && (j === 0 || lcsMatrix[i][j - 1] < lcsMatrix[i - 1][j])) {
                i--
            } else {
                break
            }
        }

        return result.map(part => {
            const cleanText = part.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
            if (part.type === 'added' && part.text.trim() !== '') {
                const acc = accuracy.value != null ? accuracy.value * 100 : 100
                const underlineColor = acc > 80 ? 'decoration-green-400' : acc > 60 ? 'decoration-yellow-400' : acc > 40 ? 'decoration-orange-400' : 'decoration-red-400'
                const textColor = acc > 80 ? 'text-green-50' : acc > 60 ? 'text-yellow-50' : acc > 40 ? 'text-orange-50' : 'text-red-50'
                return `<u class="${underlineColor} decoration-2 underline ${textColor}">${cleanText}</u>`
            }
            return cleanText
        }).join('')
    }

    const copyToClipboard = async (text, opts = { silent: false }) => {
        if (!text) return { ok: false, error: new Error('No text') }
        try {
            await navigator.clipboard.writeText(text)
            if (!opts?.silent) showToast('success', 'Copied to clipboard!')
            return { ok: true }
        } catch (error) {
            console.error('Copy failed:', error)
            try {
                const textArea = document.createElement('textarea')
                textArea.value = text
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()
                document.execCommand('copy')
                document.body.removeChild(textArea)
                if (!opts?.silent) showToast('success', 'Copied to clipboard!')
                return { ok: true, fallback: true }
            } catch (err) {
                if (!opts?.silent) showToast('error', 'Failed to copy to clipboard')
                return { ok: false, error: err }
            }
        }
    }

    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return 'never'

        let past
        // Firestore Timestamp
        if (typeof timestamp.toDate === 'function') {
            past = timestamp.toDate()
        } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
            past = new Date(timestamp)
        } else if (timestamp instanceof Date) {
            past = timestamp
        } else {
            return 'invalid date'
        }

        const now = new Date()
        const seconds = Math.floor((now - past) / 1000)

        if (isNaN(seconds)) return 'invalid date'

        let interval = seconds / 31536000
        if (interval > 1) return Math.floor(interval) + 'y ago'
        interval = seconds / 2592000
        if (interval > 1) return Math.floor(interval) + 'm ago'
        interval = seconds / 86400
        if (interval > 1) return Math.floor(interval) + 'd ago'
        interval = seconds / 3600
        if (interval > 1) return Math.floor(interval) + 'h ago'
        interval = seconds / 60
        if (interval > 1) return Math.floor(interval) + 'm ago'
        return 'just now'
    }

    const toggleSettings = () => { settingsOpen.value = !settingsOpen.value }
    const toggleShowApiKey = () => { showApiKey.value = !showApiKey.value }

    return {
        // State
        settingsOpen, showApiKey, isTranslating, accuracy, accuracyRating,
        lastOriginalText, lastTranslationDirection, leftText, rightText, retranslatedText,
        apiKey, selectedLanguage, fromLanguage, autoCopy, syncHistory,
        recentTranslations, userHistory, history, discordChannelsByGuild,

        // Global Stats State
        appStats, languageStats, dailyStats, hourlyStats,

        // Discord Stats State
        discordStats, discordGuilds, discordUsers, discordDailyStats, discordHourlyStats, discordLanguages,
        topDiscordChannels, topDiscordUsers,

        // Expose counts sourced from doc (with fallback)
        discordCounts,

        // Error State
        errorLogs, connectionRetries,

        // Constants
        languages,

        // Computed
        hasApiKey, canTranslateLeft, canTranslateRight, leftLanguageName, rightLanguageName,
        retranslationTargetLanguageName, formattedTranslations, formattedWords,
        formattedApiCost, accuracyPercentage, accuracyBarClass, retranslationWithDiff,
        topLanguages, activeToday,
        discordGlobalStats, topDiscordGuilds, hasDiscordData,

        // Methods
        flagClass, highlightDifferences, translate, copyToClipboard,
        clearHistory, deleteHistoryItem, formatTimeAgo,
        initializeAllListeners, cleanupAllListeners,
        toggleSettings, toggleShowApiKey,

        // Toast API (callable from anywhere)
        showToast,
    }
}, {
    persist: {
        paths: ['apiKey', 'selectedLanguage', 'fromLanguage', 'autoCopy', 'recentTranslations', 'syncHistory']
    }
})