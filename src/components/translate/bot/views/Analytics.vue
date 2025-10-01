<!-- views/Analytics.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-semibold text-violet-400">Bot Analytics</h1>
            <p class="text-sm text-foreground/70 mt-1">Detailed usage statistics and performance insights</p>
        </div>

        <!-- Time Range Selector -->
        <div class="mb-8 flex flex-wrap gap-1 p-1 bg-card rounded-lg ring-1 ring-border/60 w-fit">
            <button v-for="range in timeRanges" :key="range.key" @click="activeTimeRange = range.key" :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition',
                activeTimeRange === range.key
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
            ]">
                {{ range.label }}
            </button>
        </div>

        <!-- Overview Stats -->
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
            <div class="translate-card bg-gradient-to-br from-violet-600/10 to-violet-600/5 border-violet-600/20">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm font-medium text-violet-400 mb-1">Total Translations</div>
                        <div class="text-2xl font-bold text-foreground">{{ formatNumber(stats.totalTranslations) }}
                        </div>
                        <div class="text-xs text-foreground/60 flex items-center gap-1">
                            <TrendingUp class="h-3 w-3 text-green-400" />
                            {{ stats.translationGrowth }}% from last period
                        </div>
                    </div>
                    <div class="h-12 w-12 rounded-full bg-violet-500/15 flex items-center justify-center">
                        <Languages class="h-6 w-6 text-violet-400" />
                    </div>
                </div>
            </div>

            <div class="translate-card bg-gradient-to-br from-fuchsia-600/10 to-fuchsia-600/5 border-fuchsia-600/20">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm font-medium text-fuchsia-400 mb-1">Active Users</div>
                        <div class="text-2xl font-bold text-foreground">{{ formatNumber(stats.activeUsers) }}</div>
                        <div class="text-xs text-foreground/60 flex items-center gap-1">
                            <TrendingUp class="h-3 w-3 text-green-400" />
                            {{ stats.userGrowth }}% new users
                        </div>
                    </div>
                    <div class="h-12 w-12 rounded-full bg-fuchsia-500/15 flex items-center justify-center">
                        <Users class="h-6 w-6 text-fuchsia-400" />
                    </div>
                </div>
            </div>

            <div class="translate-card bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm font-medium text-cyan-400 mb-1">Avg Response Time</div>
                        <div class="text-2xl font-bold text-foreground">{{ stats.avgResponseTime }}ms</div>
                        <div class="text-xs text-foreground/60 flex items-center gap-1">
                            <TrendingDown class="h-3 w-3 text-green-400" />
                            {{ stats.responseImprovement }}ms faster
                        </div>
                    </div>
                    <div class="h-12 w-12 rounded-full bg-cyan-500/15 flex items-center justify-center">
                        <Zap class="h-6 w-6 text-cyan-400" />
                    </div>
                </div>
            </div>

            <div class="translate-card bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm font-medium text-green-400 mb-1">Success Rate</div>
                        <div class="text-2xl font-bold text-foreground">{{ stats.successRate }}%</div>
                        <div class="text-xs text-foreground/60 flex items-center gap-1">
                            <Activity class="h-3 w-3 text-green-400" />
                            {{ stats.errorRate }}% error rate
                        </div>
                    </div>
                    <div class="h-12 w-12 rounded-full bg-green-500/15 flex items-center justify-center">
                        <CheckCircle class="h-6 w-6 text-green-400" />
                    </div>
                </div>
            </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
            <!-- Main Analytics (2/3 width) -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Translation Trends Chart -->
                <div class="translate-card">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="font-semibold text-violet-400">Translation Activity</h3>
                        <div class="flex items-center gap-2">
                            <div class="flex items-center gap-1">
                                <div class="w-3 h-3 rounded bg-violet-500"></div>
                                <span class="text-xs text-zinc-400">Translations</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <div class="w-3 h-3 rounded bg-fuchsia-500"></div>
                                <span class="text-xs text-zinc-400">Users</span>
                            </div>
                        </div>
                    </div>

                    <!-- Simple chart representation -->
                    <div class="h-64 flex items-end justify-between gap-2">
                        <div v-for="(point, index) in chartData" :key="index"
                            class="flex-1 flex flex-col items-center gap-1">
                            <div class="w-full flex flex-col gap-1">
                                <div class="w-full bg-violet-500 rounded-t"
                                    :style="{ height: `${(point.translations / Math.max(...chartData.map(p => p.translations))) * 200}px` }">
                                </div>
                                <div class="w-full bg-fuchsia-500 rounded-b opacity-60"
                                    :style="{ height: `${(point.users / Math.max(...chartData.map(p => p.users))) * 100}px` }">
                                </div>
                            </div>
                            <span class="text-xs text-zinc-500">{{ point.label }}</span>
                        </div>
                    </div>
                </div>

                <!-- Language Breakdown -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-6">Language Pairs</h3>
                    <div class="space-y-4">
                        <div v-for="pair in languagePairs" :key="pair.id"
                            class="flex items-center justify-between p-4 rounded-lg bg-white/5">
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <span :class="`fi fi-${pair.from}`" class="w-5 h-4 rounded shadow-sm"></span>
                                    <ArrowRight class="h-3 w-3 text-zinc-500" />
                                    <span :class="`fi fi-${pair.to}`" class="w-5 h-4 rounded shadow-sm"></span>
                                </div>
                                <div>
                                    <div class="text-sm font-medium text-white">{{ pair.fromName }} → {{ pair.toName }}
                                    </div>
                                    <div class="text-xs text-zinc-400">{{ pair.count }} translations</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="w-24 bg-zinc-700 rounded-full h-2">
                                    <div class="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full"
                                        :style="{ width: `${pair.percentage}%` }"></div>
                                </div>
                                <span class="text-sm font-medium text-white w-12 text-right">{{ pair.percentage
                                    }}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Error Analysis -->
                <div class="translate-card" v-if="errors.length > 0">
                    <h3 class="font-semibold text-red-400 mb-6">Recent Errors</h3>
                    <div class="space-y-3">
                        <div v-for="error in errors" :key="error.id"
                            class="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                            <div class="flex items-start justify-between mb-2">
                                <div class="flex items-center gap-2">
                                    <AlertTriangle class="h-4 w-4 text-red-400 flex-shrink-0" />
                                    <span class="text-sm font-medium text-red-400">{{ error.type }}</span>
                                </div>
                                <span class="text-xs text-zinc-500">{{ error.time }}</span>
                            </div>
                            <p class="text-sm text-zinc-300">{{ error.message }}</p>
                            <div class="text-xs text-zinc-500 mt-1">
                                Channel: #{{ error.channel }} • User: {{ error.user }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar (1/3 width) -->
            <div class="space-y-6">
                <!-- Top Channels -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Most Active Channels</h3>
                    <div class="space-y-3">
                        <div v-for="channel in topChannels" :key="channel.id" class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-medium text-white"># {{ channel.name }}</div>
                                <div class="text-xs text-zinc-400">{{ channel.count }} translations</div>
                            </div>
                            <div class="w-16 bg-zinc-700 rounded-full h-2">
                                <div class="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full"
                                    :style="{ width: `${channel.percentage}%` }"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Users -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Most Active Users</h3>
                    <div class="space-y-3">
                        <div v-for="user in topUsers" :key="user.id" class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div
                                    class="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white text-xs font-bold">
                                    {{ user.name.slice(0, 1).toUpperCase() }}
                                </div>
                                <div>
                                    <div class="text-sm font-medium text-white">{{ user.name }}</div>
                                    <div class="text-xs text-zinc-400">{{ user.count }} translations</div>
                                </div>
                            </div>
                            <div class="text-sm font-medium text-violet-400">{{ user.rank }}</div>
                        </div>
                    </div>
                </div>

                <!-- Performance Metrics -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Performance</h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-zinc-400">Uptime</span>
                            <span class="text-sm font-medium text-green-400">99.9%</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-zinc-400">Avg Response Time</span>
                            <span class="text-sm font-medium text-white">{{ stats.avgResponseTime }}ms</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-zinc-400">API Calls Today</span>
                            <span class="text-sm font-medium text-white">{{ formatNumber(stats.apiCalls) }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-zinc-400">Cache Hit Rate</span>
                            <span class="text-sm font-medium text-cyan-400">{{ stats.cacheHitRate }}%</span>
                        </div>
                    </div>
                </div>

                <!-- Export Options -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Export Data</h3>
                    <div class="space-y-2">
                        <button @click="exportData('csv')" class="w-full translate-btn-secondary text-sm">
                            <Download class="h-4 w-4" />
                            Export as CSV
                        </button>
                        <button @click="exportData('json')" class="w-full translate-btn-secondary text-sm">
                            <Download class="h-4 w-4" />
                            Export as JSON
                        </button>
                        <button @click="generateReport" class="w-full translate-btn-primary text-sm">
                            <FileText class="h-4 w-4" />
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
    Languages, Users, Zap, CheckCircle, Activity, TrendingUp, TrendingDown,
    ArrowRight, AlertTriangle, Download, FileText
} from 'lucide-vue-next'
import { useDiscordBotStore } from '@/stores/useDiscordBotStore'

const store = useDiscordBotStore()
const activeTimeRange = ref('7d')

const timeRanges = [
    { key: '24h', label: '24 Hours' },
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' }
]

// Mock analytics data
const stats = ref({
    totalTranslations: 15247,
    translationGrowth: 23,
    activeUsers: 892,
    userGrowth: 15,
    avgResponseTime: 247,
    responseImprovement: 45,
    successRate: 98.7,
    errorRate: 1.3,
    apiCalls: 3421,
    cacheHitRate: 87
})

const chartData = ref([
    { label: 'Mon', translations: 234, users: 45 },
    { label: 'Tue', translations: 312, users: 67 },
    { label: 'Wed', translations: 289, users: 52 },
    { label: 'Thu', translations: 356, users: 78 },
    { label: 'Fri', translations: 423, users: 89 },
    { label: 'Sat', translations: 387, users: 72 },
    { label: 'Sun', translations: 298, users: 58 }
])

const languagePairs = ref([
    {
        id: 1,
        from: 'jp',
        to: 'us',
        fromName: 'Japanese',
        toName: 'English',
        count: 4521,
        percentage: 85
    },
    {
        id: 2,
        from: 'es',
        to: 'us',
        fromName: 'Spanish',
        toName: 'English',
        count: 2847,
        percentage: 53
    },
    {
        id: 3,
        from: 'fr',
        to: 'us',
        fromName: 'French',
        toName: 'English',
        count: 1923,
        percentage: 36
    },
    {
        id: 4,
        from: 'de',
        to: 'us',
        fromName: 'German',
        toName: 'English',
        count: 1456,
        percentage: 27
    },
    {
        id: 5,
        from: 'ko',
        to: 'us',
        fromName: 'Korean',
        toName: 'English',
        count: 987,
        percentage: 18
    }
])

const topChannels = ref([
    { id: '1', name: 'international', count: 3421, percentage: 100 },
    { id: '2', name: 'general', count: 2156, percentage: 63 },
    { id: '3', name: 'language-exchange', count: 1834, percentage: 54 },
    { id: '4', name: 'gaming', count: 987, percentage: 29 }
])

const topUsers = ref([
    { id: '1', name: 'Akira', count: 234, rank: '#1' },
    { id: '2', name: 'Maria', count: 189, rank: '#2' },
    { id: '3', name: 'Hans', count: 156, rank: '#3' },
    { id: '4', name: 'Pierre', count: 143, rank: '#4' },
    { id: '5', name: 'Jin', count: 128, rank: '#5' }
])

const errors = ref([
    {
        id: 1,
        type: 'Translation Timeout',
        message: 'Request exceeded 30 second timeout limit',
        channel: 'international',
        user: 'TestUser',
        time: '2 hours ago'
    },
    {
        id: 2,
        type: 'API Rate Limit',
        message: 'OpenAI API rate limit exceeded',
        channel: 'general',
        user: 'AnotherUser',
        time: '6 hours ago'
    }
])

// Helper functions
const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
}

const exportData = (format) => {
    console.log(`Exporting data as ${format}`)
    // Implement export functionality
}

const generateReport = () => {
    console.log('Generating analytics report')
    // Implement report generation
}
</script>

<style scoped>
/* Flag icons */
.fi {
    display: inline-block;
    border-radius: 2px;
}
</style>