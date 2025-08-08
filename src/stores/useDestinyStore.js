import { ref, computed } from 'vue'
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
        activeChallengeCount: 0,
        totalChallengeCount: 0,
        cachedAt: null,
        responseTime: 0,
        infrastructureStats: null
    })

    // Enhanced user AI stats with infrastructure tracking
    const userAIStats = ref({
        // Basic stats
        totalCalls: 0,
        freshCalls: 0,
        successfulCalls: 0,
    
        // Token and cost
        totalTokens: 0,
        promptTokens: 0,
        completionTokens: 0,
        promptCostUSD: 0,
        completionCostUSD: 0,
        totalCostUSD: 0,
        totalOpenAICost: 0,
        totalComputeCostUSD: 0,
    
        // Firestore and infrastructure
        totalFirestoreReads: 0,
        totalFirestoreWrites: 0,
        totalFirestoreCostUSD: 0,
        totalInfrastructureCost: 0,
        totalInfrastructureCostUSD: 0,
    
        // Challenge and execution
        totalChallengesAnalyzed: 0,
        totalExecutionTimeMs: 0,
        totalResponseTime: 0,
    
        // Last call metadata
        lastCached: false,
        lastCallAt: null,
        lastChallengeCount: 0,
        lastExecutionTime: 0,
        lastFirestoreReads: 0,
        lastFirestoreWrites: 0,
        lastInfrastructureCost: 0,
        lastOpenAICost: 0,
        lastResponseTime: 0,
        lastTokenUsage: {
            total: 0,
            prompt: 0,
            completion: 0,
        },
    
        // Timestamps
        updatedAt: null,
        lastUpdated: null,
    });    

    // User seasonal summary (new document)
    const userSeasonalSummary = ref({
        totalChallenges: 0,
        completedChallenges: 0,
        activeChallenges: 0,
        currentWeekChallenges: 0,
        seasonHash: null,
        seasonName: '',
        currentWeek: 0,
        completionRate: 0,
        activeCompletionRate: 0,
        lastRefreshCost: 0,
        lastRefreshReads: 0,
        lastRefreshWrites: 0,
        lastRefreshDuration: 0,
        totalRefreshes: 0,
        totalInfrastructureCost: 0,
        totalFirestoreReads: 0,
        totalFirestoreWrites: 0,
        weeklyProgress: {},
        lastUpdated: null
    })

    const userOAuthStats = ref({
        totalStartAttempts: 0,
        successfulStarts: 0,
        failedStarts: 0,
        totalCallbackAttempts: 0,
        successfulCallbacks: 0,
        failedCallbacks: 0,
        totalFirestoreReads: 0,
        totalFirestoreWrites: 0,
        totalExecutionTimeMs: 0,
        totalInfrastructureCostUSD: 0,
        lastLinkedPlatform: null,
        lastSuccessfulLinkAt: null,
        lastError: null,
        lastErrorAt: null,
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
            totalChallengesAnalyzed: 0,
            totalChallengesProcessed: 0,
            totalComputeCostUSD: 0,
            totalInfrastructureCostUSD: 0,
            totalFirestoreCostUSD: 0,
            totalFirestoreReads: 0,
            totalFirestoreWrites: 0,
            promptCostUSD: 0,
            completionCostUSD: 0,
            tokensSaved: 0,
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
            totalExecutionTimeMs: 0,
            totalComputeCostUSD: 0,
            totalInfrastructureCostUSD: 0,
            totalFirestoreCostUSD: 0,
            totalFirestoreReads: 0,
            totalFirestoreWrites: 0,
            lastRefreshAt: null,
            updatedAt: null
        },
        calculated_stats: {
            avgCompletionRate: 0,
            totalConnectedUsers: 0,
            totalAIUsers: 0,
            avgChallengesPerUser: 0,
            totalChallengesSeen: 0,
            lastCalculated: null
        },
        oauth_stats: {
            totalStartAttempts: 0,
            successfulStarts: 0,
            failedStarts: 0,
            totalCallbackAttempts: 0,
            successfulCallbacks: 0,
            failedCallbacks: 0,
            totalExecutionTimeMs: 0,
            totalComputeCostUSD: 0,
            totalInfrastructureCostUSD: 0,
            totalFirestoreCostUSD: 0,
            totalFirestoreReads: 0,
            totalFirestoreWrites: 0,
            lastAttemptAt: null,
            updatedAt: null
        },
        oauth_calculated_stats: {
            startSuccessRate: 0,
            callbackSuccessRate: 0,
            overallSuccessRate: 0,
            totalOAuthUsers: 0,
            lastCalculated: null
        }
    })    

    // Weekly challenge info
    const weeklyInfo = ref({
        currentWeek: 0,
        availableChallenges: 0,
        currentWeekChallenges: 0,
        availableByWeek: {},
        weeklyMap: null
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
                return currentSeason.value
            }

            currentSeason.value = null
            return null
        } catch (e) {
            console.error('[getCurrentActiveSeason] Error:', e)
            currentSeason.value = null
            return null
        }
    }

    async function loadGlobalStats() {
        try {
            const globalRef = doc(firestore, 'destiny', 'global')
            const globalSnap = await getDoc(globalRef)
    
            if (globalSnap.exists()) {
                const data = globalSnap.data()
    
                globalStats.value = {
                    ai_stats: {
                        totalCalls: data['ai_stats.totalCalls'] ?? 0,
                        freshCalls: data['ai_stats.freshCalls'] ?? 0,
                        cachedCalls: data['ai_stats.cachedCalls'] ?? 0,
                        successfulCalls: data['ai_stats.successfulCalls'] ?? 0,
                        errorCalls: data['ai_stats.errorCalls'] ?? 0,
                        totalTokens: data['ai_stats.totalTokens'] ?? 0,
                        promptTokens: data['ai_stats.promptTokens'] ?? 0,
                        completionTokens: data['ai_stats.completionTokens'] ?? 0,
                        totalCostUSD: data['ai_stats.totalCostUSD'] ?? 0,
                        costSavedUSD: data['ai_stats.costSavedUSD'] ?? 0,
                        totalResponseTime: data['ai_stats.totalResponseTime'] ?? 0,
                        totalChallengesAnalyzed: data['ai_stats.totalChallengesAnalyzed'] ?? 0,
                        totalChallengesProcessed: data['ai_stats.totalChallengesProcessed'] ?? 0,
                        totalComputeCostUSD: data['ai_stats.totalComputeCostUSD'] ?? 0,
                        totalInfrastructureCostUSD: data['ai_stats.totalInfrastructureCostUSD'] ?? 0,
                        totalFirestoreCostUSD: data['ai_stats.totalFirestoreCostUSD'] ?? 0,
                        totalFirestoreReads: data['ai_stats.totalFirestoreReads'] ?? 0,
                        totalFirestoreWrites: data['ai_stats.totalFirestoreWrites'] ?? 0,
                        promptCostUSD: data['ai_stats.promptCostUSD'] ?? 0,
                        completionCostUSD: data['ai_stats.completionCostUSD'] ?? 0,
                        tokensSaved: data['ai_stats.tokensSaved'] ?? 0,
                        lastCallAt: data['ai_stats.lastCallAt'] ?? null,
                        updatedAt: data['ai_stats.updatedAt'] ?? null
                    },
                    ai_calculated_stats: {
                        avgCostPerCall: data.ai_calculated_stats?.avgCostPerCall ?? 0,
                        avgResponseTime: data.ai_calculated_stats?.avgResponseTime ?? 0,
                        avgTokensPerCall: data.ai_calculated_stats?.avgTokensPerCall ?? 0,
                        cacheHitRate: data.ai_calculated_stats?.cacheHitRate ?? 0,
                        lastCalculated: data.ai_calculated_stats?.lastCalculated ?? null,
                        successRate: data.ai_calculated_stats?.successRate ?? 0,
                        totalActiveUsers: data.ai_calculated_stats?.totalActiveUsers ?? 0,
                        totalCostSavings: data.ai_calculated_stats?.totalCostSavings ?? 0
                    },
                    challenge_stats: {
                        totalChallengesSeen: data['challenge_stats.totalChallengesSeen'] ?? 0,
                        totalChallengesCompleted: data['challenge_stats.totalChallengesCompleted'] ?? 0,
                        totalRefreshCalls: data['challenge_stats.totalRefreshCalls'] ?? 0,
                        totalExecutionTimeMs: data['challenge_stats.totalExecutionTimeMs'] ?? 0,
                        totalComputeCostUSD: data['challenge_stats.totalComputeCostUSD'] ?? 0,
                        totalInfrastructureCostUSD: data['challenge_stats.totalInfrastructureCostUSD'] ?? 0,
                        totalFirestoreCostUSD: data['challenge_stats.totalFirestoreCostUSD'] ?? 0,
                        totalFirestoreReads: data['challenge_stats.totalFirestoreReads'] ?? 0,
                        totalFirestoreWrites: data['challenge_stats.totalFirestoreWrites'] ?? 0,
                        lastRefreshAt: data['challenge_stats.lastRefreshAt'] ?? null,
                        updatedAt: data['challenge_stats.updatedAt'] ?? null
                    },
                    calculated_stats: {
                        avgChallengesPerUser: data.calculated_stats?.avgChallengesPerUser ?? 0,
                        avgCompletionRate: data.calculated_stats?.avgCompletionRate ?? 0,
                        lastCalculated: data.calculated_stats?.lastCalculated ?? null,
                        totalAIUsers: data.calculated_stats?.totalAIUsers ?? 0,
                        totalChallengesSeen: data.calculated_stats?.totalChallengesSeen ?? 0,
                        totalConnectedUsers: data.calculated_stats?.totalConnectedUsers ?? 0
                    },
                    oauth_stats: {
                        totalStartAttempts: data['oauth_stats.totalStartAttempts'] ?? 0,
                        successfulStarts: data['oauth_stats.successfulStarts'] ?? 0,
                        failedStarts: data['oauth_stats.failedStarts'] ?? 0,
                        totalCallbackAttempts: data['oauth_stats.totalCallbackAttempts'] ?? 0,
                        successfulCallbacks: data['oauth_stats.successfulCallbacks'] ?? 0,
                        failedCallbacks: data['oauth_stats.failedCallbacks'] ?? 0,
                        totalExecutionTimeMs: data['oauth_stats.totalExecutionTimeMs'] ?? 0,
                        totalComputeCostUSD: data['oauth_stats.totalComputeCostUSD'] ?? 0,
                        totalInfrastructureCostUSD: data['oauth_stats.totalInfrastructureCostUSD'] ?? 0,
                        totalFirestoreCostUSD: data['oauth_stats.totalFirestoreCostUSD'] ?? 0,
                        totalFirestoreReads: data['oauth_stats.totalFirestoreReads'] ?? 0,
                        totalFirestoreWrites: data['oauth_stats.totalFirestoreWrites'] ?? 0,
                        lastAttemptAt: data['oauth_stats.lastAttemptAt'] ?? null,
                        updatedAt: data['oauth_stats.updatedAt'] ?? null
                    },
                    oauth_calculated_stats: {
                        startSuccessRate: data.oauth_calculated_stats?.startSuccessRate ?? 0,
                        callbackSuccessRate: data.oauth_calculated_stats?.callbackSuccessRate ?? 0,
                        overallSuccessRate: data.oauth_calculated_stats?.overallSuccessRate ?? 0,
                        totalOAuthUsers: data.oauth_calculated_stats?.totalOAuthUsers ?? 0,
                        lastCalculated: data.oauth_calculated_stats?.lastCalculated ?? null
                    }
                }
    
            } else {
                console.warn('[loadGlobalStats] No global stats document found')
            }
        } catch (e) {
            console.error('[loadGlobalStats] Error:', e)
        }
    }    

    async function loadUserAIStats() {
        try {
            const mainStore = useMainStore()
            const userId = mainStore.user?.uid
            if (!userId) {
                console.warn('[loadUserAIStats] No user ID, skipping')
                return
            }
    
            const statsRef = doc(firestore, 'users', userId, 'destiny', 'ai_suggestions')
            const statsSnap = await getDoc(statsRef)
    
            if (statsSnap.exists()) {
                const data = statsSnap.data()
    
                userAIStats.value = {
                    totalCalls: data.totalCalls ?? 0,
                    freshCalls: data.freshCalls ?? 0,
                    successfulCalls: data.successfulCalls ?? 0,
    
                    totalTokens: data.totalTokens ?? 0,
                    promptTokens: data.promptTokens ?? 0,
                    completionTokens: data.completionTokens ?? 0,
                    promptCostUSD: data.promptCostUSD ?? 0,
                    completionCostUSD: data.completionCostUSD ?? 0,
                    totalCostUSD: data.totalCostUSD ?? 0,
                    totalOpenAICost: data.totalOpenAICost ?? 0,
                    totalComputeCostUSD: data.totalComputeCostUSD ?? 0,
    
                    totalFirestoreReads: data.totalFirestoreReads ?? 0,
                    totalFirestoreWrites: data.totalFirestoreWrites ?? 0,
                    totalFirestoreCostUSD: data.totalFirestoreCostUSD ?? 0,
                    totalInfrastructureCost: data.totalInfrastructureCost ?? 0,
                    totalInfrastructureCostUSD: data.totalInfrastructureCostUSD ?? 0,
    
                    totalChallengesAnalyzed: data.totalChallengesAnalyzed ?? 0,
                    totalExecutionTimeMs: data.totalExecutionTimeMs ?? 0,
                    totalResponseTime: data.totalResponseTime ?? 0,
    
                    lastCached: data.lastCached ?? false,
                    lastCallAt: data.lastCallAt ?? null,
                    lastChallengeCount: data.lastChallengeCount ?? 0,
                    lastExecutionTime: data.lastExecutionTime ?? 0,
                    lastFirestoreReads: data.lastFirestoreReads ?? 0,
                    lastFirestoreWrites: data.lastFirestoreWrites ?? 0,
                    lastInfrastructureCost: data.lastInfrastructureCost ?? 0,
                    lastOpenAICost: data.lastOpenAICost ?? 0,
                    lastResponseTime: data.lastResponseTime ?? 0,
                    lastTokenUsage: {
                        total: data.lastTokenUsage?.total ?? 0,
                        prompt: data.lastTokenUsage?.prompt ?? 0,
                        completion: data.lastTokenUsage?.completion ?? 0,
                    },
    
                    updatedAt: data.updatedAt ?? null,
                    lastUpdated: data.lastUpdated ?? null,
                }
            } else {
                // Default all fields if not found
                userAIStats.value = {
                    totalCalls: 0,
                    freshCalls: 0,
                    successfulCalls: 0,
                    totalTokens: 0,
                    promptTokens: 0,
                    completionTokens: 0,
                    promptCostUSD: 0,
                    completionCostUSD: 0,
                    totalCostUSD: 0,
                    totalOpenAICost: 0,
                    totalComputeCostUSD: 0,
                    totalFirestoreReads: 0,
                    totalFirestoreWrites: 0,
                    totalFirestoreCostUSD: 0,
                    totalInfrastructureCost: 0,
                    totalInfrastructureCostUSD: 0,
                    totalChallengesAnalyzed: 0,
                    totalExecutionTimeMs: 0,
                    totalResponseTime: 0,
                    lastCached: false,
                    lastCallAt: null,
                    lastChallengeCount: 0,
                    lastExecutionTime: 0,
                    lastFirestoreReads: 0,
                    lastFirestoreWrites: 0,
                    lastInfrastructureCost: 0,
                    lastOpenAICost: 0,
                    lastResponseTime: 0,
                    lastTokenUsage: {
                        total: 0,
                        prompt: 0,
                        completion: 0,
                    },
                    updatedAt: null,
                    lastUpdated: null,
                }
            }
        } catch (e) {
            console.error('[loadUserAIStats] Error:', e)
            userAIStats.value = {
                totalCalls: 0,
                freshCalls: 0,
                successfulCalls: 0,
                totalTokens: 0,
                promptTokens: 0,
                completionTokens: 0,
                promptCostUSD: 0,
                completionCostUSD: 0,
                totalCostUSD: 0,
                totalOpenAICost: 0,
                totalComputeCostUSD: 0,
                totalFirestoreReads: 0,
                totalFirestoreWrites: 0,
                totalFirestoreCostUSD: 0,
                totalInfrastructureCost: 0,
                totalInfrastructureCostUSD: 0,
                totalChallengesAnalyzed: 0,
                totalExecutionTimeMs: 0,
                totalResponseTime: 0,
                lastCached: false,
                lastCallAt: null,
                lastChallengeCount: 0,
                lastExecutionTime: 0,
                lastFirestoreReads: 0,
                lastFirestoreWrites: 0,
                lastInfrastructureCost: 0,
                lastOpenAICost: 0,
                lastResponseTime: 0,
                lastTokenUsage: {
                    total: 0,
                    prompt: 0,
                    completion: 0,
                },
                updatedAt: null,
                lastUpdated: null,
            }
        }
    }    

    async function loadUserSeasonalSummary() {
        try {
            const mainStore = useMainStore()
            const userId = mainStore.user?.uid
            if (!userId) return

            const summaryRef = doc(firestore, 'users', userId, 'destiny', 'seasonal_summary')
            const summarySnap = await getDoc(summaryRef)

            if (summarySnap.exists()) {
                const data = summarySnap.data()

                userSeasonalSummary.value = {
                    // Challenge stats
                    totalChallenges: data.totalChallenges || 0,
                    completedChallenges: data.completedChallenges || 0,
                    activeChallenges: data.activeChallenges || 0,
                    currentWeekChallenges: data.currentWeekChallenges || 0,

                    // Season info
                    seasonHash: data.seasonHash || null,
                    seasonName: data.seasonName || '',
                    currentWeek: data.currentWeek || 0,

                    // Calculated rates
                    completionRate: data.completionRate || 0,
                    activeCompletionRate: data.activeCompletionRate || 0,

                    // Last refresh costs
                    lastRefreshCost: data.lastRefreshCost || 0,
                    lastRefreshReads: data.lastRefreshReads || 0,
                    lastRefreshWrites: data.lastRefreshWrites || 0,
                    lastRefreshDuration: data.lastRefreshDuration || 0,

                    // Cumulative costs
                    totalRefreshes: data.totalRefreshes || 0,
                    totalInfrastructureCost: data.totalInfrastructureCost || 0,
                    totalFirestoreReads: data.totalFirestoreReads || 0,
                    totalFirestoreWrites: data.totalFirestoreWrites || 0,

                    // Weekly tracking
                    weeklyProgress: data.weeklyProgress || {},

                    lastUpdated: data.lastUpdated || null
                }

            } else {
                console.log('[loadUserSeasonalSummary] No seasonal summary found, using defaults')
            }
        } catch (e) {
            console.error('[loadUserSeasonalSummary] Error:', e)
        }
    }

    async function loadUserOAuthStats() {
        try {
            const mainStore = useMainStore()
            const userId = mainStore.user?.uid
            if (!userId) {
                console.warn('[loadUserOAuthStats] No user ID, skipping')
                return
            }
    
            const statsRef = doc(firestore, 'users', userId, 'destiny', 'oauth_stats')
            const statsSnap = await getDoc(statsRef)
    
            if (statsSnap.exists()) {
                const data = statsSnap.data()
                userOAuthStats.value = {
                    totalStartAttempts: data.totalStartAttempts || 0,
                    successfulStarts: data.successfulStarts || 0,
                    failedStarts: data.failedStarts || 0,
                    totalCallbackAttempts: data.totalCallbackAttempts || 0,
                    successfulCallbacks: data.successfulCallbacks || 0,
                    failedCallbacks: data.failedCallbacks || 0,
                    totalFirestoreReads: data.totalFirestoreReads || 0,
                    totalFirestoreWrites: data.totalFirestoreWrites || 0,
                    totalExecutionTimeMs: data.totalExecutionTimeMs || 0,
                    totalInfrastructureCostUSD: data.totalInfrastructureCostUSD || 0,
                    lastLinkedPlatform: data.lastLinkedPlatform || null,
                    lastSuccessfulLinkAt: data.lastSuccessfulLinkAt || null,
                    lastError: data.lastError || null,
                    lastErrorAt: data.lastErrorAt || null,
                    createdAt: data.createdAt || null,
                    updatedAt: data.updatedAt || null
                }
            } else {
                console.warn('[loadUserOAuthStats] No OAuth stats document found, using defaults')
            }
        } catch (e) {
            console.error('[loadUserOAuthStats] Error:', e)
        }
    }

    async function loadAllStats() {
        statsLoading.value = true
        try {
            await Promise.all([
                loadGlobalStats(),
                loadUserAIStats(),
                loadUserSeasonalSummary(),
                loadUserOAuthStats()
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
            aiSuggestion.value = ''
            const mainStore = useMainStore()
            const userId = mainStore.user?.uid
            if (!userId) throw new Error("Not signed in")

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

            const challengesColRef = collection(firestore, 'users', userId, 'destiny', 'challenges', 'seasonal_challenges')
            let challengesQuery = challengesColRef

            if (activeSeason?.seasonHash) {
                const seasonHash = activeSeason.seasonHash
                challengesQuery = query(challengesColRef, where('seasonHash', '==', seasonHash))
            } else {
                console.log('[loadDestinyState] No active season found, loading all challenges')
            }

            const challengesSnap = await getDocs(challengesQuery)
            challenges.value = challengesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

            await Promise.all([
                loadUserAIStats(),
                loadUserSeasonalSummary()
            ])

            if (challenges.value.length > 0) {
                const activeChallenges = challenges.value.filter(c => c.active === true)
                const completedChallenges = challenges.value.filter(c => c.completed === true)

                const currentWeek = userSeasonalSummary.value.currentWeek || 0
                const currentWeekChallenges = currentWeek > 0
                    ? challenges.value.filter(c => c.weekUnlocked === currentWeek).length
                    : 0

                weeklyInfo.value = {
                    currentWeek: currentWeek,
                    availableChallenges: activeChallenges.length,
                    currentWeekChallenges: currentWeekChallenges,
                    availableByWeek: {},
                    weeklyMap: null
                }

            } else {
                weeklyInfo.value = {
                    currentWeek: userSeasonalSummary.value.currentWeek || 0,
                    availableChallenges: 0,
                    currentWeekChallenges: 0,
                    availableByWeek: {},
                    weeklyMap: null
                }
            }
        } catch (e) {
            error.value = "Failed to load Destiny data: " + (e.message || e)
        }
        loading.value = false
    }

    async function refreshChallenges() {
        loading.value = true
        error.value = ''
        try {
            aiSuggestion.value = ''
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

            const responseData = await res.json()

            if (responseData.weeklyInfo) {
                weeklyInfo.value = {
                    currentWeek: responseData.weeklyInfo.currentWeek || 0,
                    availableChallenges: responseData.weeklyInfo.availableChallenges || 0,
                    currentWeekChallenges: responseData.weeklyInfo.currentWeekChallenges || 0,
                    availableByWeek: responseData.weeklyInfo.availableByWeek || {},
                    weeklyMap: responseData.weeklyInfo.weeklyMap || null
                }
            }

            await loadDestinyState()
        } catch (e) {
            error.value = "Failed to refresh: " + (e.message || e)
        }
        loading.value = false
    }

    async function startBungieAuth() {
        loading.value = true
        error.value = ''

        try {
            const auth = getAuth()
            const user = auth.currentUser

            if (!user) {
                throw new Error("You must be signed in to link your Bungie account")
            }

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

            setTimeout(() => {
                window.location.href = data.redirectUrl
            }, 100)

        } catch (e) {
            console.error('[OAuth] Error starting Bungie auth:', e)
            error.value = e.message || "Failed to start Bungie authentication"
            loading.value = false
        }
    }

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
            error.value = ''

            // Clean up URL first
            const cleanUrl = window.location.pathname
            window.history.replaceState({}, document.title, cleanUrl)

            await loadDestinyState()
        }

        return false
    }

    async function initializeDestinyState() {
        const wasOAuthCallback = await handleOAuthCallback()

        if (!wasOAuthCallback) {
            await loadDestinyState()
        }
    }

    async function getAISuggestion() {
        suggestLoading.value = true
        aiSuggestion.value = ''
        aiMetadata.value = {
            cached: false,
            tokenUsage: { total: 0, prompt: 0, completion: 0 },
            challengeCount: 0,
            activeChallengeCount: 0,
            totalChallengeCount: 0,
            cachedAt: null,
            responseTime: 0,
            infrastructureStats: null
        }
        error.value = ''
    
        try {
            const auth = getAuth()
            const user = auth.currentUser
            if (!user) throw new Error("Not signed in")
            const token = await user.getIdToken()
    
            const activeChallenges = (challenges.value || []).filter(challenge => {
                if (!challenge.active) {
                    return false
                }
    
                if (challenge.completed) {
                    return false
                }
    
                if (challenge.objectives && Array.isArray(challenge.objectives)) {
                    return challenge.objectives.some(obj => {
                        const progress = Number(obj.progress) || 0
                        const completionValue = Number(obj.completionValue) || 1
                        return progress < completionValue || !obj.complete
                    })
                }
    
                return !challenge.completed
            })
    
            if (activeChallenges.length === 0) {
                const totalActive = (challenges.value || []).filter(c => c.active === true).length
    
                if (totalActive === 0) {
                    aiSuggestion.value = "No active seasonal challenges available yet. Check back next week for new challenges!"
                } else {
                    aiSuggestion.value = "You've completed all available seasonal challenges. Go touch grass!"
                }
    
                aiMetadata.value = {
                    cached: false,
                    tokenUsage: { total: 0, prompt: 0, completion: 0 },
                    challengeCount: 0,
                    activeChallengeCount: totalActive,
                    totalChallengeCount: challenges.value.length,
                    responseTime: 0
                }
                suggestLoading.value = false
                return
            }
    
            const payload = { challenges: activeChallenges }
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
    
            aiMetadata.value = {
                cached: data.cached || false,
                tokenUsage: data.tokenUsage || { total: 0, prompt: 0, completion: 0 },
                challengeCount: data.challengeCount || activeChallenges.length,
                activeChallengeCount: data.activeChallengeCount || 0,
                totalChallengeCount: data.totalChallengeCount || challenges.value.length,
                cachedAt: data.cachedAt || null,
                responseTime: data.responseTime || 0,
                infrastructureStats: data.infrastructureStats || null
            }
    
            await Promise.all([
                loadUserAIStats(),
            ])
    
        } catch (e) {
            aiSuggestion.value = ''
            aiMetadata.value = {
                cached: false,
                tokenUsage: { total: 0, prompt: 0, completion: 0 },
                challengeCount: 0,
                activeChallengeCount: 0,
                totalChallengeCount: challenges.value.length,
                responseTime: 0
            }
            error.value = "AI Suggestion failed: " + (e.message || e)
        }
        suggestLoading.value = false
    }

    function calculateFullRequestCost(promptTokens, completionTokens, responseTimeMs = 3000, cached = false) {
        const PROMPT_COST_PER_1K = 0.005
        const COMPLETION_COST_PER_1K = 0.015

        const FIRESTORE_READ_COST = 0.0000006
        const FIRESTORE_WRITE_COST = 0.0000018

        const FUNCTION_INVOCATION_COST = 0.0000004
        const FUNCTION_COMPUTE_COST_PER_100MS = 0.0000025

        const promptCost = (promptTokens / 1000) * PROMPT_COST_PER_1K
        const completionCost = (completionTokens / 1000) * COMPLETION_COST_PER_1K
        const openaiCost = promptCost + completionCost

        let firestoreReads, firestoreWrites

        if (cached) {
            firestoreReads = 4
            firestoreWrites = 6
        } else {
            firestoreReads = 5
            firestoreWrites = 8
        }

        const firestoreCost = (firestoreReads * FIRESTORE_READ_COST) + (firestoreWrites * FIRESTORE_WRITE_COST)

        const invocationCost = FUNCTION_INVOCATION_COST
        const computeTime100ms = Math.ceil(responseTimeMs / 100)
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

    // Computed properties for easy access
    const activeChallenges = computed(() => {
        return challenges.value.filter(challenge => challenge.active === true)
    })

    const completedChallenges = computed(() => {
        return challenges.value.filter(challenge => challenge.completed === true)
    })

    const incompleteChallenges = computed(() => {
        return challenges.value.filter(challenge => {
            if (challenge.completed) return false

            if (challenge.objectives && Array.isArray(challenge.objectives)) {
                return challenge.objectives.some(obj => {
                    const progress = Number(obj.progress) || 0
                    const completionValue = Number(obj.completionValue) || 1
                    return progress < completionValue || !obj.complete
                })
            }

            return !challenge.completed
        })
    })

    const activeIncompleteChallenges = computed(() => {
        return incompleteChallenges.value.filter(challenge => challenge.active === true)
    })

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
        userSeasonalSummary,
        globalStats,
        weeklyInfo,
        statsLoading,

        // Computed properties
        activeChallenges,
        completedChallenges,
        incompleteChallenges,
        activeIncompleteChallenges,

        // Methods
        loadDestinyState,
        startBungieAuth,
        refreshChallenges,
        getAISuggestion,
        getCurrentActiveSeason,
        handleOAuthCallback,
        initializeDestinyState,
        loadUserAIStats,
        loadUserSeasonalSummary,
        loadGlobalStats,
        loadAllStats,
        calculateTokenCost,
        calculateFullRequestCost,
        userOAuthStats,
        loadUserOAuthStats
    }
})