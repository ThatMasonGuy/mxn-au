import { ref } from 'vue'
import { defineStore } from 'pinia'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { useMainStore } from '@/stores/useMainStore'
import { getAuth } from 'firebase/auth'

export const useDestinyStore = defineStore('destiny', () => {
    const bungieLinked = ref(false)
    const tokenExpired = ref(false)
    const profile = ref({ displayName: '', icon: '', platform: '' })
    const challenges = ref([])
    const loading = ref(false)
    const error = ref('')
    const aiSuggestion = ref('')
    const suggestLoading = ref(false)

    async function loadDestinyState() {
        loading.value = true
        error.value = ''
        try {
            aiSuggestion.value = '' // Clear AI suggestion on reload
            const mainStore = useMainStore()
            const userId = mainStore.user?.uid
            if (!userId) throw new Error("Not signed in")

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

            // --- NEW: Fetch all challenge docs from collection ---
            const challengesColRef = collection(firestore, 'users', userId, 'destiny', 'challenges', 'seasonal_challenges')
            const challengesSnap = await getDocs(challengesColRef)
            challenges.value = challengesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
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

    // --- AI Suggestion Function ---
    async function getAISuggestion() {
        suggestLoading.value = true;
        aiSuggestion.value = '';
        error.value = '';
        try {
            const incomplete = (challenges.value || []).filter(
                c => !c.completed
            );
            console.log("Incomplete Challenges:", incomplete)
            const payload = { challenges: incomplete };
            const res = await fetch('/destiny/ai-suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.plan || "Failed to generate AI suggestion");
            }
            const data = await res.json();
            aiSuggestion.value = data.plan || "No suggestion generated.";
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
        loading,
        error,
        aiSuggestion,
        suggestLoading,
        loadDestinyState,
        startBungieAuth,
        refreshChallenges,
        getAISuggestion,
    }
})
