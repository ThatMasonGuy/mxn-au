<template>
    <div class="global-stats-dashboard">
        <h2>Destiny 2 Challenge Tracker - Global Stats</h2>

        <div v-if="loading" class="loading">Loading global statistics...</div>

        <div v-else-if="error" class="error">{{ error }}</div>

        <div v-else class="stats-grid">
            <!-- User Stats -->
            <div class="stat-card">
                <h3>Connected Users</h3>
                <div class="stat-value">{{ formatNumber(stats.calculated_stats?.totalConnectedUsers || 0) }}</div>
                <div class="stat-label">Total Bungie accounts linked</div>
            </div>

            <div class="stat-card">
                <h3>AI Users</h3>
                <div class="stat-value">{{ formatNumber(stats.calculated_stats?.totalAIUsers || 0) }}</div>
                <div class="stat-label">Users who've used AI suggestions</div>
            </div>

            <!-- Challenge Stats -->
            <div class="stat-card">
                <h3>Challenges Tracked</h3>
                <div class="stat-value">{{ formatNumber(stats.challenge_stats?.totalChallengesSeen || 0) }}</div>
                <div class="stat-label">Total challenges seen</div>
            </div>

            <div class="stat-card">
                <h3>Challenges Completed</h3>
                <div class="stat-value">{{ formatNumber(stats.challenge_stats?.totalChallengesCompleted || 0) }}</div>
                <div class="stat-label">Total completions tracked</div>
            </div>

            <div class="stat-card highlight">
                <h3>Completion Rate</h3>
                <div class="stat-value">{{ (stats.calculated_stats?.avgCompletionRate || 0).toFixed(1) }}%</div>
                <div class="stat-label">Average across all users</div>
            </div>

            <!-- AI Stats -->
            <div class="stat-card">
                <h3>AI Suggestions</h3>
                <div class="stat-value">{{ formatNumber(stats.ai_stats?.totalCalls || 0) }}</div>
                <div class="stat-label">Total AI calls made</div>
            </div>

            <div class="stat-card">
                <h3>Cache Hit Rate</h3>
                <div class="stat-value">{{ cacheHitRate }}%</div>
                <div class="stat-label">Cached vs fresh responses</div>
            </div>

            <div class="stat-card">
                <h3>Tokens Used</h3>
                <div class="stat-value">{{ formatNumber(stats.ai_stats?.totalTokens || 0) }}</div>
                <div class="stat-label">Total OpenAI tokens</div>
                <div class="stat-sublabel">
                    Prompt: {{ formatNumber(stats.ai_stats?.promptTokens || 0) }} |
                    Completion: {{ formatNumber(stats.ai_stats?.completionTokens || 0) }}
                </div>
            </div>

            <div class="stat-card highlight">
                <h3>Estimated Cost</h3>
                <div class="stat-value">${{ estimatedCost.toFixed(2) }}</div>
                <div class="stat-label">Total OpenAI API cost</div>
                <div class="stat-sublabel">
                    Prompt: ${{ promptCost.toFixed(2) }} |
                    Completion: ${{ completionCost.toFixed(2) }}
                </div>
            </div>

            <div class="stat-card">
                <h3>Tokens Saved</h3>
                <div class="stat-value">{{ formatNumber(stats.ai_stats?.tokensSaved || 0) }}</div>
                <div class="stat-label">Saved by caching</div>
                <div class="stat-sublabel">~${{ savedCost.toFixed(2) }} saved</div>
            </div>
        </div>

        <!-- Daily Trends -->
        <div v-if="dailyStats.length > 0" class="daily-trends">
            <h3>Last 7 Days Activity</h3>
            <div class="trend-grid">
                <div v-for="day in dailyStats" :key="day.date" class="day-stat">
                    <div class="day-date">{{ formatDate(day.date) }}</div>
                    <div class="day-metrics">
                        <div>Refreshes: {{ day.refreshCalls || 0 }}</div>
                        <div>AI Calls: {{ day.calls || 0 }}</div>
                        <div>Users: {{ day.uniqueUsers?.length || 0 }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="last-updated">
            Last updated: {{ lastUpdated }}
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { firestore } from '@/firebase'

// State
const stats = ref({})
const dailyStats = ref([])
const loading = ref(true)
const error = ref('')
const refreshInterval = ref(null)

// Computed properties
const cacheHitRate = computed(() => {
    const total = stats.value.ai_stats?.totalCalls || 0
    const cached = stats.value.ai_stats?.cachedCalls || 0
    return total > 0 ? ((cached / total) * 100).toFixed(1) : '0.0'
})

const estimatedCost = computed(() => {
    return promptCost.value + completionCost.value
})

const promptCost = computed(() => {
    const tokens = stats.value.ai_stats?.promptTokens || 0
    const COST_PER_1K = 0.01 // Update with actual GPT-4 pricing
    return (tokens / 1000) * COST_PER_1K
})

const completionCost = computed(() => {
    const tokens = stats.value.ai_stats?.completionTokens || 0
    const COST_PER_1K = 0.03 // Update with actual GPT-4 pricing
    return (tokens / 1000) * COST_PER_1K
})

const savedCost = computed(() => {
    const savedTokens = stats.value.ai_stats?.tokensSaved || 0
    // Average of prompt and completion cost
    const AVG_COST_PER_1K = 0.02
    return (savedTokens / 1000) * AVG_COST_PER_1K
})

const lastUpdated = computed(() => {
    const timestamp = stats.value.ai_stats?.updatedAt || stats.value.challenge_stats?.updatedAt
    return timestamp ? new Date(timestamp).toLocaleString() : 'Never'
})

// Methods
async function loadGlobalStats() {
    try {
        loading.value = true
        error.value = ''

        // Load main global stats
        const globalRef = doc(firestore, 'destiny/global')
        const globalSnap = await getDoc(globalRef)

        if (globalSnap.exists()) {
            stats.value = globalSnap.data()
        }

        // Load recent daily stats
        const dailyRef = collection(firestore, 'destiny/global/challenge_daily_stats')
        const dailyQuery = query(dailyRef, orderBy('date', 'desc'), limit(7))
        const dailySnap = await getDocs(dailyQuery)

        dailyStats.value = dailySnap.docs.map(doc => ({
            date: doc.id,
            ...doc.data()
        })).reverse() // Show oldest to newest

    } catch (e) {
        console.error('[loadGlobalStats] Error:', e)
        error.value = 'Failed to load global statistics'
    } finally {
        loading.value = false
    }
}

function formatNumber(num) {
    return new Intl.NumberFormat().format(num)
}

function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Lifecycle
onMounted(() => {
    loadGlobalStats()

    // Refresh every 30 seconds
    refreshInterval.value = setInterval(() => {
        loadGlobalStats()
    }, 30000)
})

onUnmounted(() => {
    if (refreshInterval.value) {
        clearInterval(refreshInterval.value)
    }
})
</script>

<style scoped>
.global-stats-dashboard {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

h2 {
    color: #fff;
    margin-bottom: 2rem;
    text-align: center;
}

.loading,
.error {
    text-align: center;
    padding: 2rem;
    color: #999;
}

.error {
    color: #ff6b6b;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.stat-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s ease;
}

.stat-card:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
}

.stat-card.highlight {
    background: rgba(100, 255, 218, 0.1);
    border-color: rgba(100, 255, 218, 0.3);
}

.stat-card h3 {
    color: #64ffda;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 0.5rem;
}

.stat-label {
    color: #999;
    font-size: 0.85rem;
}

.stat-sublabel {
    color: #777;
    font-size: 0.75rem;
    margin-top: 0.25rem;
}

.daily-trends {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.daily-trends h3 {
    color: #64ffda;
    margin-bottom: 1rem;
}

.trend-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1rem;
}

.day-stat {
    text-align: center;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

.day-date {
    color: #64ffda;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
}

.day-metrics {
    font-size: 0.75rem;
    color: #999;
}

.day-metrics div {
    margin: 0.25rem 0;
}

.last-updated {
    text-align: center;
    color: #666;
    font-size: 0.85rem;
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .trend-grid {
        grid-template-columns: 1fr;
    }
}
</style>