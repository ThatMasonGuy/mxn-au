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

    // Get current active season
    async function getCurrentActiveSeason() {
        try {
            const seasonsRef = collection(firestore, 'destiny/global/seasons')
            const activeSeasonQuery = query(seasonsRef, where('season_active', '==', true))
            const seasonSnap = await getDocs(activeSeasonQuery)
            
            if (!seasonSnap.empty) {
                const seasonDoc = seasonSnap.docs[0]
                currentSeason.value = {
                    id: seasonDoc.id,
                    ...seasonDoc.data()
                }
                console.log(`[getCurrentActiveSeason] Found active season: ${currentSeason.value.seasonName}`)
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
                challengesQuery = query(challengesColRef, where('seasonHash', '==', activeSeason.seasonHash))
                console.log(`[loadDestinyState] Filtering challenges for season: ${activeSeason.seasonName}`)
            } else {
                console.log('[loadDestinyState] No active season found, loading all challenges')
            }
            
            const challengesSnap = await getDocs(challengesQuery)
            challenges.value = challengesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            
            console.log(`[loadDestinyState] Loaded ${challenges.value.length} challenges for current season`)
        } catch (e) {
            error.value = "Failed to load Destiny data: " + (e.message || e)
        }
        loading.value = false
    }

    async function startBungieAuth() {
        try {
            const auth = getAuth()
            const user = auth.currentUser
            if (!user) throw new Error("Not signed in")
            const token = await user.getIdToken()
            const res = await fetch('/destiny/oauth', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) throw new Error("Failed to initiate Bungie auth")
            const { redirectUrl } = await res.json()
            window.location.href = redirectUrl
        } catch (e) {
            error.value = "Failed to start Bungie authentication: " + (e.message || e)
        }
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

    // --- AI Suggestion Function with Authentication ---
    async function getAISuggestion() {
        suggestLoading.value = true;
        aiSuggestion.value = '';
        error.value = '';
        try {
            const auth = getAuth()
            const user = auth.currentUser
            if (!user) throw new Error("Not signed in")
            const token = await user.getIdToken()

            // Filter to only incomplete challenges from current season
            const incomplete = (challenges.value || []).filter(challenge => {
                // Check if challenge is not completed
                if (challenge.completed) {
                    return false;
                }
                
                // Double-check by looking at objectives if available
                if (challenge.objectives && Array.isArray(challenge.objectives)) {
                    // Challenge is incomplete if any objective is not complete
                    return challenge.objectives.some(obj => {
                        const progress = Number(obj.progress) || 0;
                        const completionValue = Number(obj.completionValue) || 1;
                        return progress < completionValue || !obj.complete;
                    });
                }
                
                // If no objectives, trust the completed flag
                return !challenge.completed;
            });
            
            console.log(`[getAISuggestion] Found ${incomplete.length} incomplete challenges out of ${challenges.value.length} total`);
            
            if (incomplete.length === 0) {
                aiSuggestion.value = "You've completed all seasonal challenges. Go touch grass!";
                suggestLoading.value = false;
                return;
            }

            const payload = { challenges: incomplete };
            const res = await fetch('/destiny/ai-suggest', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || "Failed to generate AI suggestion");
            }
            
            const data = await res.json();
            aiSuggestion.value = data.plan || "No suggestion generated.";
            
            // Log if response was cached
            if (data.cached) {
                console.log(`[getAISuggestion] Used cached response from ${new Date(data.cachedAt).toLocaleString()}`);
            } else {
                console.log(`[getAISuggestion] Generated fresh AI response for ${data.challengeCount} challenges`);
            }
            
        } catch (e) {
            aiSuggestion.value = '';
            error.value = "AI Suggestion failed: " + (e.message || e);
        }
        suggestLoading.value = false;
    }

    return {
        bungieLinked,
        tokenExpired,
        profile,
        challenges,
        currentSeason,
        loading,
        error,
        aiSuggestion,
        suggestLoading,
        loadDestinyState,
        startBungieAuth,
        refreshChallenges,
        getAISuggestion,
        getCurrentActiveSeason,
    }
})