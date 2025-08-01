import { ref } from 'vue'
import { defineStore } from 'pinia'
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { useMainStore } from '@/stores/useMainStore'
import { getAuth } from 'firebase/auth'

export const useDestinyStore = defineStore('destiny', () => {
    const bungieLinked = ref(false)
    const tokenExpired = ref(false)
    const profile = ref({ displayName: '', icon: '', platform: '' })
    const challenges = ref([])
    const currentSeason = ref(null)
    const loading = ref(false)
    const error = ref('')
    const aiSuggestion = ref('')
    const suggestLoading = ref(false)
    const aiMetadata = ref({
        cached: false,
        tokenUsage: {
            total: 0,
            prompt: 0,
            completion: 0
        },
        challengeCount: 0,
        cachedAt: null
    })
    const userAIStats = ref({
        totalCalls: 0,
        freshCalls: 0,
        cachedCalls: 0,
        successfulCalls: 0,
        errorCalls: 0,
        totalTokens: 0,
        promptTokens: 0,
        completionTokens: 0,
        tokensSaved: 0,
        totalCostUSD: 0,
        promptCostUSD: 0,
        completionCostUSD: 0,
        // Real infrastructure tracking
        totalFirestoreReads: 0,
        totalFirestoreWrites: 0,
        totalExecutionTimeMs: 0,
        totalInfrastructureCostUSD: 0,
        totalFirestoreCostUSD: 0,
        totalComputeCostUSD: 0,
        lastCallAt: null,
        createdAt: null,
        updatedAt: null
    })
    const globalStats = ref({
        ai_stats: {
            totalCalls: 0,
            freshCalls: 0,
            cachedCalls: 0,
            successfulCalls: 0,
            errorCalls: 0,
            totalTokens: 0,
            promptTokens: 0,
            completionTokens: 0,
            totalCostUSD: 0,
            costSavedUSD: 0,
            totalResponseTime: 0,
            totalChallengesProcessed: 0,
            lastCallAt: null,
            updatedAt: null
        },
        ai_calculated_stats: {
            successRate: 0,
            cacheHitRate: 0,
            avgResponseTime: 0,
            avgTokensPerCall: 0,
            avgCostPerCall: 0,
            totalCostSavings: 0,
            totalActiveUsers: 0,
            lastCalculated: null
        },
        challenge_stats: {
            totalChallengesSeen: 0,
            totalChallengesCompleted: 0,
            totalRefreshCalls: 0,
            lastRefreshAt: null,
            updatedAt: null
        },
        calculated_stats: {
            avgCompletionRate: 0,
            totalConnectedUsers: 0,
            totalAIUsers: 0,
            avgChallengesPerUser: 0,
            lastCalculated: null
        }
    })
    const statsLoading = ref(false)

    // Get current active season
    async function getCurrentActiveSeason() {
        try {
            const seasonsRef = collection(firestore, 'destiny/global/seasons')
            const activeSeasonQuery = query(seasonsRef, where('seasonActive', '==', true))
            const seasonSnap = await getDocs(activeSeasonQuery)

            if (!seasonSnap.empty) {
                const seasonDoc = seasonSnap.docs[0]
                currentSeason.value = {
                    id: seasonDoc.id,
                    ...seasonDoc.data()
                }
                console.log(`[getCurrentActiveSeason] Found active season: ${currentSeason.value.seasonName || currentSeason.value.seasonName}`)
                return currentSeason.value
            }

            console.log('[getCurrentActiveSeason] No active season found')
            currentSeason.value = null
            return null
        } catch (e) {
            console.error('[getCurrentActiveSeason] Error:', e)
            currentSeason.value = null
            return null
        }
    }

    // Load global stats from Firestore
    async function loadGlobalStats() {
        try {
            const globalRef = doc(firestore, 'destiny', 'global')
            const globalSnap = await getDoc(globalRef)

            if (globalSnap.exists()) {
                const data = globalSnap.data()

                // Handle flattened field names from Firestore
                globalStats.value = {
                    ai_stats: {
                        totalCalls: data['ai_stats.totalCalls'] || 0,
                        freshCalls: data['ai_stats.freshCalls'] || 0,
                        cachedCalls: data['ai_stats.cachedCalls'] || 0,
                        successfulCalls: data['ai_stats.successfulCalls'] || 0,
                        errorCalls: data['ai_stats.errorCalls'] || 0,
                        totalTokens: data['ai_stats.totalTokens'] || 0,
                        promptTokens: data['ai_stats.promptTokens'] || 0,
                        completionTokens: data['ai_stats.completionTokens'] || 0,
                        totalCostUSD: data['ai_stats.totalCostUSD'] || 0,
                        costSavedUSD: data['ai_stats.costSavedUSD'] || 0,
                        totalResponseTime: data['ai_stats.totalResponseTime'] || 0,
                        totalChallengesAnalyzed: data['ai_stats.totalChallengesAnalyzed'] || 0,
                        // Infrastructure tracking
                        totalFirestoreReads: data['ai_stats.totalFirestoreReads'] || 0,
                        totalFirestoreWrites: data['ai_stats.totalFirestoreWrites'] || 0,
                        totalExecutionTimeMs: data['ai_stats.totalExecutionTimeMs'] || 0,
                        totalInfrastructureCostUSD: data['ai_stats.totalInfrastructureCostUSD'] || 0,
                        totalFirestoreCostUSD: data['ai_stats.totalFirestoreCostUSD'] || 0,
                        totalComputeCostUSD: data['ai_stats.totalComputeCostUSD'] || 0,
                        lastCallAt: data['ai_stats.lastCallAt'] || null,
                        updatedAt: data['ai_stats.updatedAt'] || null
                    },
                    ai_calculated_stats: data.ai_calculated_stats || {
                        successRate: 0,
                        cacheHitRate: 0,
                        avgResponseTime: 0,
                        avgTokensPerCall: 0,
                        avgCostPerCall: 0,
                        totalCostSavings: 0,
                        totalActiveUsers: 0,
                        lastCalculated: null
                    },
                    challenge_stats: {
                        totalChallengesSeen: data['challenge_stats.totalChallengesSeen'] || 0,
                        totalChallengesCompleted: data['challenge_stats.totalChallengesCompleted'] || 0,
                        totalRefreshCalls: data['challenge_stats.totalRefreshCalls'] || 0,
                        lastRefreshAt: data['challenge_stats.lastRefreshAt'] || null,
                        updatedAt: data['challenge_stats.updatedAt'] || null
                    },
                    calculated_stats: data.calculated_stats || {
                        avgCompletionRate: 0,
                        totalConnectedUsers: 0,
                        totalAIUsers: 0,
                        avgChallengesPerUser: 0,
                        lastCalculated: null
                    }
                }

                console.log('[loadGlobalStats] Loaded global stats:', globalStats.value)
            }
        } catch (e) {
            console.error('[loadGlobalStats] Error:', e)
        }
    }

    // Load user's AI usage stats
    async function loadUserAIStats() {
        try {
            const mainStore = useMainStore()
            const userId = mainStore.user?.uid
            if (!userId) return

            const statsRef = doc(firestore, 'users', userId, 'destiny', 'ai_suggestions')
            const statsSnap = await getDoc(statsRef)

            if (statsSnap.exists()) {
                const data = statsSnap.data()

                // Merge with default values to ensure all fields exist
                userAIStats.value = {
                    // Basic call tracking
                    totalCalls: data.totalCalls || 0,
                    freshCalls: data.freshCalls || 0,
                    cachedCalls: data.cachedCalls || 0,
                    successfulCalls: data.successfulCalls || 0,
                    errorCalls: data.errorCalls || 0,

                    // Token tracking
                    totalTokens: data.totalTokens || 0,
                    promptTokens: data.promptTokens || 0,
                    completionTokens: data.completionTokens || 0,
                    tokensSaved: data.tokensSaved || 0,

                    // OpenAI cost tracking
                    totalCostUSD: data.totalCostUSD || 0,
                    promptCostUSD: data.promptCostUSD || 0,
                    completionCostUSD: data.completionCostUSD || 0,

                    // Infrastructure tracking (new fields)
                    totalFirestoreReads: data.totalFirestoreReads || 0,
                    totalFirestoreWrites: data.totalFirestoreWrites || 0,
                    totalExecutionTimeMs: data.totalExecutionTimeMs || 0,
                    totalInfrastructureCostUSD: data.totalInfrastructureCostUSD || 0,
                    totalFirestoreCostUSD: data.totalFirestoreCostUSD || 0,
                    totalComputeCostUSD: data.totalComputeCostUSD || 0,

                    // Timestamps
                    lastCallAt: data.lastCallAt || null,
                    createdAt: data.createdAt || null,
                    updatedAt: data.updatedAt || null
                }

                console.log('[loadUserAIStats] Loaded comprehensive AI stats:', userAIStats.value)
            } else {
                console.log('[loadUserAIStats] No AI stats document found, using defaults')
            }
        } catch (e) {
            console.error('[loadUserAIStats] Error:', e)
        }
    }

    // Load all stats (global + user)
    async function loadAllStats() {
        statsLoading.value = true
        try {
            await Promise.all([
                loadGlobalStats(),
                loadUserAIStats()
            ])
        } catch (e) {
            console.error('[loadAllStats] Error:', e)
        }
        statsLoading.value = false
    }

    async function loadDestinyState() {
        loading.value = true
        error.value = ''
        try {
            aiSuggestion.value = '' // Clear AI suggestion on reload
            const mainStore = useMainStore()
            const userId = mainStore.user?.uid
            if (!userId) throw new Error("Not signed in")

            // Get current active season first
            const activeSeason = await getCurrentActiveSeason()

            const metaRef = doc(firestore, 'users', userId, 'destiny', 'meta')
            const metaSnap = await getDoc(metaRef)
            if (!metaSnap.exists()) {
                bungieLinked.value = false
                tokenExpired.value = false
                loading.value = false
                return
            }
            const meta = metaSnap.data()

            // Handle both Firestore Timestamp and plain number timestamps
            const expires = meta.tokenExpires?.toDate ? meta.tokenExpires.toDate() : new Date(meta.tokenExpires)
            const now = new Date()

            if (!expires || expires < now) {
                bungieLinked.value = false
                tokenExpired.value = true
                loading.value = false
                return
            }

            bungieLinked.value = true
            tokenExpired.value = false
            profile.value = {
                displayName: meta.displayName,
                icon: meta.icon,
                platform: meta.platformType
            }

            // Fetch challenges, filtered by current season if available
            const challengesColRef = collection(firestore, 'users', userId, 'destiny', 'challenges', 'seasonal_challenges')
            let challengesQuery = challengesColRef

            if (activeSeason?.seasonHash) {
                const seasonHash = activeSeason.seasonHash
                challengesQuery = query(challengesColRef, where('seasonHash', '==', seasonHash))
                console.log(`[loadDestinyState] Filtering challenges for season: ${activeSeason.seasonName}`)
            } else {
                console.log('[loadDestinyState] No active season found, loading all challenges')
            }

            const challengesSnap = await getDocs(challengesQuery)
            challenges.value = challengesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

            console.log(`[loadDestinyState] Loaded ${challenges.value.length} challenges for current season`)

            // Load AI stats
            await loadUserAIStats()
        } catch (e) {
            error.value = "Failed to load Destiny data: " + (e.message || e)
        }
        loading.value = false
    }

    async function refreshChallenges() {
        loading.value = true
        error.value = ''
        try {
            aiSuggestion.value = '' // Clear old AI plan when refreshing
            const auth = getAuth()
            const user = auth.currentUser
            if (!user) throw new Error("Not signed in")
            const token = await user.getIdToken()
            const res = await fetch('/destiny/get-challenges', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include'
            })
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                // If access token is expired, require re-link, not refresh!
                if (res.status === 401 && errData?.error?.toLowerCase().includes("expired")) {
                    tokenExpired.value = true
                    bungieLinked.value = false
                    error.value = "Your Bungie access expired. Please re-link your account."
                } else {
                    throw new Error(errData?.error || "Failed to refresh Destiny challenges")
                }
                loading.value = false
                return
            }
            await loadDestinyState()
        } catch (e) {
            error.value = "Failed to refresh: " + (e.message || e)
        }
        loading.value = false
    }

    // OAuth - Start Bungie Authentication
    async function startBungieAuth() {
        loading.value = true
        error.value = ''

        try {
            const auth = getAuth()
            const user = auth.currentUser

            if (!user) {
                throw new Error("You must be signed in to link your Bungie account")
            }

            console.log('[OAuth] Starting Bungie authentication...')
            const token = await user.getIdToken()

            const res = await fetch('/destiny/oauth', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!res.ok) {
                let errorMessage = `HTTP ${res.status}: ${res.statusText}`
                try {
                    const errorData = await res.json()
                    errorMessage = errorData.error || errorMessage
                } catch {
                    // If we can't parse JSON, use the status text
                }
                throw new Error(`Failed to initiate Bungie auth: ${errorMessage}`)
            }

            const data = await res.json()

            if (!data.redirectUrl) {
                throw new Error("No redirect URL received from server")
            }

            console.log('[OAuth] Redirecting to Bungie...')

            // Add a small delay to ensure loading state is visible
            setTimeout(() => {
                window.location.href = data.redirectUrl
            }, 100)

        } catch (e) {
            console.error('[OAuth] Error starting Bungie auth:', e)
            error.value = e.message || "Failed to start Bungie authentication"
            loading.value = false
        }
    }

    // Handle OAuth callback result
    async function handleOAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search)
        const linked = urlParams.get('linked')
        const oauthError = urlParams.get('error')

        if (oauthError) {
            console.error('[OAuth] Callback error:', oauthError)
            error.value = `OAuth failed: ${decodeURIComponent(oauthError)}`

            // Clean up URL
            const cleanUrl = window.location.pathname
            window.history.replaceState({}, document.title, cleanUrl)
            return false
        }

        if (linked === '1') {
            console.log('[OAuth] Account successfully linked, reloading state...')

            // Clear any existing errors
            error.value = ''

            // Clean up URL first
            const cleanUrl = window.location.pathname
            window.history.replaceState({}, document.title, cleanUrl)

            // Reload the destiny state to reflect the new connection
            await loadDestinyState()

            // Show success message temporarily
            if (bungieLinked.value) {
                console.log('[OAuth] Successfully linked to Bungie account')
                return true
            }
        }

        return false
    }

    // Initialize Destiny state (handles OAuth callback + normal loading)
    async function initializeDestinyState() {
        console.log('[Store] Initializing Destiny state...')

        // Handle OAuth callback if present
        const wasOAuthCallback = await handleOAuthCallback()

        // If it wasn't an OAuth callback, or if OAuth failed, load normally
        if (!wasOAuthCallback) {
            await loadDestinyState()
        }
    }

    // AI Suggestion Function
    async function getAISuggestion() {
        suggestLoading.value = true
        aiSuggestion.value = ''
        aiMetadata.value = {
            cached: false,
            tokenUsage: { total: 0, prompt: 0, completion: 0 },
            challengeCount: 0,
            cachedAt: null
        }
        error.value = ''

        try {
            const auth = getAuth()
            const user = auth.currentUser
            if (!user) throw new Error("Not signed in")
            const token = await user.getIdToken()

            // Filter to only incomplete challenges from current season
            const incomplete = (challenges.value || []).filter(challenge => {
                // Check if challenge is not completed
                if (challenge.completed) {
                    return false
                }

                // Double-check by looking at objectives if available
                if (challenge.objectives && Array.isArray(challenge.objectives)) {
                    // Challenge is incomplete if any objective is not complete
                    return challenge.objectives.some(obj => {
                        const progress = Number(obj.progress) || 0
                        const completionValue = Number(obj.completionValue) || 1
                        return progress < completionValue || !obj.complete
                    })
                }

                // If no objectives, trust the completed flag
                return !challenge.completed
            })

            console.log(`[getAISuggestion] Found ${incomplete.length} incomplete challenges out of ${challenges.value.length} total`)

            if (incomplete.length === 0) {
                aiSuggestion.value = "You've completed all seasonal challenges. Go touch grass!"
                aiMetadata.value = {
                    cached: false,
                    tokenUsage: { total: 0, prompt: 0, completion: 0 },
                    challengeCount: 0
                }
                suggestLoading.value = false
                return
            }

            const payload = { challenges: incomplete }
            const res = await fetch('/destiny/ai-suggest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data?.error || "Failed to generate AI suggestion")
            }

            const data = await res.json()
            aiSuggestion.value = data.plan || "No suggestion generated."

            // Store metadata about the response
            aiMetadata.value = {
                cached: data.cached || false,
                tokenUsage: data.tokenUsage || { total: 0, prompt: 0, completion: 0 },
                challengeCount: data.challengeCount || incomplete.length,
                cachedAt: data.cachedAt || null,
                responseTime: data.responseTime || 0
            }

            // Log if response was cached
            if (data.cached) {
                console.log(`[getAISuggestion] Used cached response from ${new Date(data.cachedAt).toLocaleString()} (${data.tokenUsage.total} tokens saved)`)
            } else {
                console.log(`[getAISuggestion] Generated fresh AI response for ${data.challengeCount} challenges (${data.tokenUsage.total} tokens used: ${data.tokenUsage.prompt} prompt + ${data.tokenUsage.completion} completion)`)
            }

            // Reload AI stats to reflect the new usage
            await loadUserAIStats()

        } catch (e) {
            aiSuggestion.value = ''
            aiMetadata.value = {
                cached: false,
                tokenUsage: { total: 0, prompt: 0, completion: 0 },
                challengeCount: 0
            }
            error.value = "AI Suggestion failed: " + (e.message || e)
        }
        suggestLoading.value = false
    }

    // Calculate comprehensive cost including OpenAI + Firestore + Cloud Functions
    function calculateFullRequestCost(promptTokens, completionTokens, responseTimeMs = 3000, cached = false) {
        // OpenAI GPT-4o pricing (current as of 2024)
        const PROMPT_COST_PER_1K = 0.005  // $0.005 per 1K prompt tokens
        const COMPLETION_COST_PER_1K = 0.015  // $0.015 per 1K completion tokens

        // Firestore pricing (current as of 2024)
        const FIRESTORE_READ_COST = 0.0000006  // $0.06 per 100K reads
        const FIRESTORE_WRITE_COST = 0.0000018  // $0.18 per 100K writes

        // Cloud Functions pricing
        const FUNCTION_INVOCATION_COST = 0.0000004  // $0.40 per 1M invocations
        const FUNCTION_COMPUTE_COST_PER_100MS = 0.0000025  // $0.0000025 per 100ms at 256MB

        // OpenAI costs
        const promptCost = (promptTokens / 1000) * PROMPT_COST_PER_1K
        const completionCost = (completionTokens / 1000) * COMPLETION_COST_PER_1K
        const openaiCost = promptCost + completionCost

        // Firestore operations per AI request
        let firestoreReads, firestoreWrites

        if (cached) {
            // Cached request operations
            firestoreReads = 4   // cache check + user doc + 2 count queries
            firestoreWrites = 6  // user stats + cache usage update + global stats batch (4 docs)
        } else {
            // Fresh request operations  
            firestoreReads = 5   // cache check + user doc + 2 count queries + definitions
            firestoreWrites = 8  // user stats + cache write + global stats batch (5 docs) + activity tracking
        }

        const firestoreCost = (firestoreReads * FIRESTORE_READ_COST) + (firestoreWrites * FIRESTORE_WRITE_COST)

        // Cloud Functions costs
        const invocationCost = FUNCTION_INVOCATION_COST
        const computeTime100ms = Math.ceil(responseTimeMs / 100)  // Round up to nearest 100ms
        const computeCost = computeTime100ms * FUNCTION_COMPUTE_COST_PER_100MS
        const cloudFunctionCost = invocationCost + computeCost

        return {
            // OpenAI breakdown
            promptCost,
            completionCost,
            openaiCost,

            // Infrastructure breakdown
            firestoreCost,
            cloudFunctionCost,

            // Detailed breakdown
            firestoreReads,
            firestoreWrites,
            computeTime100ms,

            // Total costs
            infrastructureCost: firestoreCost + cloudFunctionCost,
            totalCost: openaiCost + firestoreCost + cloudFunctionCost,

            // Cost savings for cached requests (no OpenAI cost)
            savedCost: cached ? openaiCost : 0
        }
    }

    // Legacy function for backwards compatibility
    function calculateTokenCost(promptTokens, completionTokens) {
        const result = calculateFullRequestCost(promptTokens, completionTokens)
        return {
            promptCost: result.promptCost,
            completionCost: result.completionCost,
            totalCost: result.openaiCost
        }
    }

    return {
        // State
        bungieLinked,
        tokenExpired,
        profile,
        challenges,
        currentSeason,
        loading,
        error,
        aiSuggestion,
        suggestLoading,
        aiMetadata,
        userAIStats,
        globalStats,
        statsLoading,

        // Methods
        loadDestinyState,
        startBungieAuth,
        refreshChallenges,
        getAISuggestion,
        getCurrentActiveSeason,
        handleOAuthCallback,
        initializeDestinyState,
        loadUserAIStats,
        loadGlobalStats,
        loadAllStats,
        calculateTokenCost
    }
})