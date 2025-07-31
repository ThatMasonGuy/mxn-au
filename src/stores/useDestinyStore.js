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
        totalTokens: 0,
        promptTokens: 0,
        completionTokens: 0,
        lastCallAt: null
    })

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

    // Load user's AI usage stats
    async function loadUserAIStats() {
        try {
            const mainStore = useMainStore()
            const userId = mainStore.user?.uid
            if (!userId) return

            const statsRef = doc(firestore, 'users', userId, 'destiny', 'ai_suggestions')
            const statsSnap = await getDoc(statsRef)

            if (statsSnap.exists()) {
                userAIStats.value = statsSnap.data()
                console.log('[loadUserAIStats] Loaded AI stats:', userAIStats.value)
            }
        } catch (e) {
            console.error('[loadUserAIStats] Error:', e)
        }
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
                cachedAt: data.cachedAt || null
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

    // Calculate estimated cost based on token usage
    function calculateTokenCost(promptTokens, completionTokens) {
        // OpenAI GPT-4 pricing (as of Jan 2025)
        // These are example prices - update with actual current pricing
        const PROMPT_COST_PER_1K = 0.01  // $0.01 per 1K prompt tokens
        const COMPLETION_COST_PER_1K = 0.03  // $0.03 per 1K completion tokens

        const promptCost = (promptTokens / 1000) * PROMPT_COST_PER_1K
        const completionCost = (completionTokens / 1000) * COMPLETION_COST_PER_1K

        return {
            promptCost,
            completionCost,
            totalCost: promptCost + completionCost
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

        // Methods
        loadDestinyState,
        startBungieAuth,
        refreshChallenges,
        getAISuggestion,
        getCurrentActiveSeason,
        handleOAuthCallback,
        initializeDestinyState,
        loadUserAIStats,
        calculateTokenCost
    }
})