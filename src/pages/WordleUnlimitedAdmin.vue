<template>
    <div class="max-w-4xl mx-auto p-6 space-y-8">
        <div class="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
            <h1 class="text-2xl font-bold text-white mb-6">Wordle Unlimited Admin Panel</h1>

            <!-- System Overview -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div class="bg-zinc-800 rounded-lg p-4">
                    <h3 class="text-sm font-medium text-zinc-400 mb-2">Total Words</h3>
                    <div class="text-2xl font-bold text-white">{{ systemStats.totalWords || 0 }}</div>
                </div>
                <div class="bg-zinc-800 rounded-lg p-4">
                    <h3 class="text-sm font-medium text-zinc-400 mb-2">Total Games</h3>
                    <div class="text-2xl font-bold text-white">{{ systemStats.totalGamesPlayed || 0 }}</div>
                </div>
                <div class="bg-zinc-800 rounded-lg p-4">
                    <h3 class="text-sm font-medium text-zinc-400 mb-2">Win Rate</h3>
                    <div class="text-2xl font-bold text-white">{{ systemWinRate }}%</div>
                </div>
            </div>

            <!-- Word Generation -->
            <div class="bg-zinc-800 rounded-lg p-6 mb-6">
                <h2 class="text-xl font-semibold text-white mb-4">Generate Words</h2>
                <div class="flex flex-col sm:flex-row gap-4 mb-4">
                    <input v-model="generateCount" type="number" min="1" max="500" placeholder="Number of words"
                        class="px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                    <input v-model="adminKey" type="password" placeholder="Admin key"
                        class="px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                    <label class="flex items-center gap-2 text-white">
                        <input v-model="forceGenerate" type="checkbox" class="rounded" />
                        <span class="text-sm">Force generate</span>
                    </label>
                    <button @click="generateWords" :disabled="generatingWords || !adminKey"
                        class="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white rounded-md transition-colors">
                        {{ generatingWords ? 'Generating...' : 'Generate' }}
                    </button>
                </div>
                <div v-if="generateResult" class="text-sm">
                    <div v-if="generateResult.success" class="text-emerald-400">
                        ✓ Generated {{ generateResult.generated }} words successfully (Total: {{
                        generateResult.totalWords }})
                    </div>
                    <div v-else class="text-rose-400">
                        ✗ {{ generateResult.error }}
                    </div>
                </div>
            </div>

            <!-- Word Statistics -->
            <div class="bg-zinc-800 rounded-lg p-6 mb-6">
                <h2 class="text-xl font-semibold text-white mb-4">Word Analysis</h2>
                <div class="flex flex-col sm:flex-row gap-4 mb-4">
                    <input v-model="searchWord" type="text" placeholder="Search word (e.g., HELLO)" maxlength="5"
                        class="px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 uppercase"
                        @input="searchWord = $event.target.value.toUpperCase()" />
                    <button @click="searchWordStats" :disabled="loadingWordStats || searchWord.length !== 5"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white rounded-md transition-colors">
                        {{ loadingWordStats ? 'Searching...' : 'Search' }}
                    </button>
                </div>

                <div v-if="wordStats" class="space-y-4">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-zinc-700 rounded p-3">
                            <div class="text-xs text-zinc-400">Players</div>
                            <div class="text-lg font-semibold text-white">{{ wordStats.totalPlayers }}</div>
                        </div>
                        <div class="bg-zinc-700 rounded p-3">
                            <div class="text-xs text-zinc-400">Wins</div>
                            <div class="text-lg font-semibold text-emerald-400">{{ wordStats.wins }}</div>
                        </div>
                        <div class="bg-zinc-700 rounded p-3">
                            <div class="text-xs text-zinc-400">Losses</div>
                            <div class="text-lg font-semibold text-rose-400">{{ wordStats.losses }}</div>
                        </div>
                        <div class="bg-zinc-700 rounded p-3">
                            <div class="text-xs text-zinc-400">Win Rate</div>
                            <div class="text-lg font-semibold text-white">
                                {{ wordStats.totalPlayers > 0 ? Math.round((wordStats.wins / wordStats.totalPlayers) *
                                100) : 0 }}%
                            </div>
                        </div>
                    </div>

                    <!-- Attempts Histogram -->
                    <div v-if="wordStats.attemptsHistogram && Object.keys(wordStats.attemptsHistogram).length > 0"
                        class="bg-zinc-700 rounded p-4">
                        <h3 class="text-sm font-medium text-zinc-300 mb-3">Attempts Distribution</h3>
                        <div class="space-y-2">
                            <div v-for="attempts in [1, 2, 3, 4, 5, 6]" :key="attempts" class="flex items-center gap-3">
                                <span class="text-xs text-zinc-400 w-8">{{ attempts }}:</span>
                                <div class="flex-1 bg-zinc-600 rounded-full h-2 relative">
                                    <div class="bg-violet-500 h-2 rounded-full transition-all duration-500"
                                        :style="{ width: `${getHistogramWidth(attempts)}%` }"></div>
                                </div>
                                <span class="text-xs text-zinc-300 w-8">{{ wordStats.attemptsHistogram[attempts] || 0
                                    }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else-if="wordSearchError" class="text-rose-400 text-sm">
                    {{ wordSearchError }}
                </div>
            </div>

            <!-- Pool Stats -->
            <div class="bg-zinc-800 rounded-lg p-6">
                <h2 class="text-xl font-semibold text-white mb-4">Word Pool Status</h2>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-zinc-400">Total Words in Pool:</span>
                        <span class="text-white ml-2">{{ systemStats.totalWords || 0 }}</span>
                    </div>
                    <div>
                        <span class="text-zinc-400">Total Games Played:</span>
                        <span class="text-white ml-2">{{ systemStats.totalGamesPlayed || 0 }}</span>
                    </div>
                    <div>
                        <span class="text-zinc-400">Last Admin Generation:</span>
                        <span class="text-white ml-2">{{ formatDate(systemStats.lastAdminGeneration) }}</span>
                    </div>
                    <div>
                        <span class="text-zinc-400">Last Generated Count:</span>
                        <span class="text-white ml-2">{{ systemStats.lastAdminGenerationCount || 0 }}</span>
                    </div>
                </div>

                <div class="mt-4 p-3 bg-zinc-700 rounded">
                    <p class="text-xs text-zinc-300">
                        <strong>Note:</strong> Words are now generated automatically when users need them.
                        Manual generation is only needed to pre-populate the pool or when you want to ensure a large
                        buffer.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { firestore } from '@/firebase'
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore'

const REGION = 'australia-southeast2'
const functions = () => getFunctions(undefined, REGION)

// State
const systemStats = ref({})
const generateCount = ref(100)
const adminKey = ref('')
const forceGenerate = ref(false)
const generatingWords = ref(false)
const generateResult = ref(null)

const searchWord = ref('')
const wordStats = ref(null)
const loadingWordStats = ref(false)
const wordSearchError = ref('')

// Computed
const systemWinRate = computed(() => {
    const stats = systemStats.value
    if (!stats.totalGamesPlayed || stats.totalGamesPlayed === 0) return 0
    return Math.round((stats.totalWins / stats.totalGamesPlayed) * 100)
})

function getHistogramWidth(attempts) {
    if (!wordStats.value?.attemptsHistogram) return 0
    const values = Object.values(wordStats.value.attemptsHistogram)
    const max = Math.max(...values, 1)
    return ((wordStats.value.attemptsHistogram[attempts] || 0) / max) * 100
}

// Methods
async function loadSystemStats() {
    try {
        // Load global stats
        const statsRef = doc(firestore, 'dailyChallenges', 'wordle-unlimited')
        const snapshot = await getDoc(statsRef)

        if (snapshot.exists()) {
            const data = snapshot.data()

            // Count total words in solutions collection
            const solutionsRef = collection(firestore, 'dailyChallenges', 'wordle-unlimited', 'solutions')
            const solutionsQuery = query(solutionsRef, limit(1000))
            const solutionsSnap = await getDocs(solutionsQuery)

            systemStats.value = {
                totalWords: solutionsSnap.size,
                totalGamesPlayed: data.totalGamesPlayed || 0,
                totalWins: data.totalWins || 0,
                totalLosses: data.totalLosses || 0,
                lastAdminGeneration: data.lastAdminGeneration?.toDate?.() || null,
                lastAdminGenerationCount: data.lastAdminGenerationCount || 0
            }
        }
    } catch (error) {
        console.error('Error loading system stats:', error)
    }
}

async function generateWords() {
    if (!adminKey.value || generateCount.value < 1) return

    generatingWords.value = true
    generateResult.value = null

    try {
        const call = httpsCallable(functions(), 'adminGenerateWordleWords')
        const { data } = await call({
            adminKey: adminKey.value,
            count: generateCount.value,
            force: forceGenerate.value
        })

        generateResult.value = data

        if (data.success) {
            await loadSystemStats() // Refresh stats
        }
    } catch (error) {
        generateResult.value = {
            success: false,
            error: error.message || 'Generation failed'
        }
    } finally {
        generatingWords.value = false
    }
}

async function searchWordStats() {
    if (searchWord.value.length !== 5) return

    loadingWordStats.value = true
    wordStats.value = null
    wordSearchError.value = ''

    try {
        // Query the stats collection directly
        const statsRef = doc(firestore, 'dailyChallenges', 'wordle-unlimited', 'stats', searchWord.value.toUpperCase())
        const snapshot = await getDoc(statsRef)

        if (snapshot.exists()) {
            wordStats.value = snapshot.data()
        } else {
            wordSearchError.value = 'Word not found in database'
        }
    } catch (error) {
        wordSearchError.value = error.message || 'Search failed'
    } finally {
        loadingWordStats.value = false
    }
}

function formatDate(date) {
    if (!date) return 'Never'
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(date)
}

// Lifecycle
onMounted(() => {
    loadSystemStats()
})

onMounted(async () => {
  loadAllowedWords();
  window.addEventListener('keydown', onKeydown);

  await store.initialize();
  if (!store.currentGame) {
    await store.startNewGame({ force: true });
  }
});
</script>