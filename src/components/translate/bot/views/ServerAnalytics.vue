<!-- views/ServerAnalytics.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-semibold text-violet-400">Server Analytics</h1>
                    <p class="text-sm text-foreground/70 mt-1">Deep dive into {{ store.selectedServer?.name }} bot usage
                        and performance</p>
                </div>
                <div class="flex items-center gap-3">
                    <select v-model="selectedDateRange" class="setting-select text-sm">
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>
                    <button @click="exportAnalytics" class="translate-btn-secondary text-sm">
                        <Download class="h-4 w-4" />
                        Export
                    </button>
                    <button @click="refreshData" :disabled="loading" class="translate-btn-primary text-sm">
                        <RefreshCw :class="['h-4 w-4', { 'animate-spin': loading }]" />
                        Refresh
                    </button>
                </div>
            </div>
        </div>

        <!-- Overview Metrics -->
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 mb-8">
            <div class="translate-card bg-gradient-to-br from-violet-600/10 to-violet-600/5 border-violet-600/20">
                <div class="text-center">
                    <div class="text-3xl font-bold text-violet-400 mb-1">{{ formatNumber(analytics.totalTranslations) }}
                    </div>
                    <div class="text-sm text-violet-300 mb-2">Total Translations</div>
                    <div class="text-xs text-foreground/60 flex items-center justify-center gap-1">
                        <TrendingUp class="h-3 w-3 text-green-400" />
                        {{ analytics.translationGrowth }}% vs last period
                    </div>
                </div>
            </div>

            <div class="translate-card bg-gradient-to-br from-fuchsia-600/10 to-fuchsia-600/5 border-fuchsia-600/20">
                <div class="text-center">
                    <div class="text-3xl font-bold text-fuchsia-400 mb-1">{{ formatNumber(analytics.activeUsers) }}
                    </div>
                    <div class="text-sm text-fuchsia-300 mb-2">Active Users</div>
                    <div class="text-xs text-foreground/60 flex items-center justify-center gap-1">
                        <Users class="h-3 w-3 text-fuchsia-400" />
                        {{ analytics.userEngagement }}% engagement
                    </div>
                </div>
            </div>

            <div class="translate-card bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20">
                <div class="text-center">
                    <div class="text-3xl font-bold text-cyan-400 mb-1">{{ analytics.avgResponseTime }}ms</div>
                    <div class="text-sm text-cyan-300 mb-2">Avg Response</div>
                    <div class="text-xs text-foreground/60 flex items-center justify-center gap-1">
                        <Zap class="h-3 w-3 text-green-400" />
                        {{ analytics.responseImprovement }}ms faster
                    </div>
                </div>
            </div>

            <div class="translate-card bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <div class="text-center">
                    <div class="text-3xl font-bold text-green-400 mb-1">{{ analytics.successRate }}%</div>
                    <div class="text-sm text-green-300 mb-2">Success Rate</div>
                    <div class="text-xs text-foreground/60 flex items-center justify-center gap-1">
                        <CheckCircle class="h-3 w-3 text-green-400" />
                        {{ analytics.errorCount }} errors
                    </div>
                </div>
            </div>

            <div class="translate-card bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
                <div class="text-center">
                    <div class="text-3xl font-bold text-amber-400 mb-1">{{ analytics.reactionRoleUses }}</div>
                    <div class="text-sm text-amber-300 mb-2">Role Assignments</div>
                    <div class="text-xs text-foreground/60 flex items-center justify-center gap-1">
                        <UserCheck class="h-3 w-3 text-amber-400" />
                        {{ analytics.reactionRoleMessages }} messages
                    </div>
                </div>
            </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
            <!-- Main Analytics (2/3 width) -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Activity Timeline -->
                <div class="translate-card">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="font-semibold text-violet-400">Activity Timeline</h3>
                        <div class="flex items-center gap-4">
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 rounded bg-violet-500"></div>
                                <span class="text-xs text-zinc-400">Translations</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 rounded bg-fuchsia-500"></div>
                                <span class="text-xs text-zinc-400">Role Assignments</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 rounded bg-cyan-500"></div>
                                <span class="text-xs text-zinc-400">Active Users</span>
                            </div>
                        </div>
                    </div>

                    <!-- Chart Area -->
                    <div class="h-80 flex items-end justify-between gap-1">
                        <div v-for="(point, index) in timelineData" :key="index"
                            class="flex-1 flex flex-col items-center gap-1 group">
                            <!-- Stacked bars -->
                            <div class="w-full flex flex-col gap-1 relative">
                                <!-- Translations -->
                                <div class="w-full bg-violet-500 rounded-t hover:bg-violet-400 transition-colors"
                                    :style="{ height: `${(point.translations / getMaxValue('translations')) * 120}px` }"
                                    :title="`${point.translations} translations`"></div>
                                <!-- Role assignments -->
                                <div class="w-full bg-fuchsia-500 hover:bg-fuchsia-400 transition-colors"
                                    :style="{ height: `${(point.roleAssignments / getMaxValue('roleAssignments')) * 60}px` }"
                                    :title="`${point.roleAssignments} role assignments`"></div>
                                <!-- Active users (background) -->
                                <div class="w-full bg-cyan-500/40 rounded-b hover:bg-cyan-400/40 transition-colors"
                                    :style="{ height: `${(point.activeUsers / getMaxValue('activeUsers')) * 40}px` }"
                                    :title="`${point.activeUsers} active users`"></div>
                            </div>
                            <span class="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">{{
                                point.label }}</span>

                            <!-- Tooltip on hover -->
                            <div
                                class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <div>{{ point.translations }} translations</div>
                                <div>{{ point.roleAssignments }} role assignments</div>
                                <div>{{ point.activeUsers }} active users</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Language Usage Breakdown -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-6">Language Usage Patterns</h3>

                    <!-- Source Languages -->
                    <div class="mb-6">
                        <h4 class="text-sm font-medium text-white mb-3">Most Translated From</h4>
                        <div class="space-y-2">
                            <div v-for="lang in sourceLanguages" :key="lang.code"
                                class="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                <div class="flex items-center gap-3">
                                    <span :class="`fi fi-${lang.flag}`" class="w-5 h-4 rounded shadow-sm"></span>
                                    <span class="text-sm text-white">{{ lang.name }}</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="w-32 bg-zinc-700 rounded-full h-2">
                                        <div class="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full"
                                            :style="{ width: `${lang.percentage}%` }"></div>
                                    </div>
                                    <span class="text-sm font-medium text-white w-16 text-right">{{ lang.count }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Target Languages -->
                    <div>
                        <h4 class="text-sm font-medium text-white mb-3">Most Translated To</h4>
                        <div class="space-y-2">
                            <div v-for="lang in targetLanguages" :key="lang.code"
                                class="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                <div class="flex items-center gap-3">
                                    <span :class="`fi fi-${lang.flag}`" class="w-5 h-4 rounded shadow-sm"></span>
                                    <span class="text-sm text-white">{{ lang.name }}</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="w-32 bg-zinc-700 rounded-full h-2">
                                        <div class="bg-gradient-to-r from-cyan-500 to-green-500 h-2 rounded-full"
                                            :style="{ width: `${lang.percentage}%` }"></div>
                                    </div>
                                    <span class="text-sm font-medium text-white w-16 text-right">{{ lang.count }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Channel Performance -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-6">Channel Performance</h3>
                    <div class="space-y-3">
                        <div v-for="channel in channelStats" :key="channel.id"
                            class="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div class="flex items-center gap-3">
                                <Hash class="h-4 w-4 text-zinc-400" />
                                <div>
                                    <div class="text-sm font-medium text-white">{{ channel.name }}</div>
                                    <div class="text-xs text-zinc-400">{{ channel.messageCount }} messages • {{
                                        channel.uniqueUsers }} users</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-sm font-bold text-violet-400">{{ channel.translations }}</div>
                                <div class="text-xs text-zinc-400">translations</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar (1/3 width) -->
            <div class="space-y-6">
                <!-- Real-time Stats -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Real-time Activity</h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-zinc-400">Current Users Online</span>
                            <span class="text-sm font-medium text-green-400">{{ realTimeStats.onlineUsers }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-zinc-400">Translations Last Hour</span>
                            <span class="text-sm font-medium text-white">{{ realTimeStats.lastHourTranslations }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-zinc-400">API Response Time</span>
                            <span class="text-sm font-medium text-cyan-400">{{ realTimeStats.currentResponseTime
                                }}ms</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-zinc-400">Bot Uptime</span>
                            <span class="text-sm font-medium text-green-400">{{ realTimeStats.uptime }}</span>
                        </div>
                    </div>
                </div>

                <!-- Top Contributors -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Top Contributors</h3>
                    <div class="space-y-3">
                        <div v-for="(user, index) in topUsers" :key="user.id" class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white text-xs font-bold">
                                    {{ user.name.slice(0, 1).toUpperCase() }}
                                </div>
                                <div>
                                    <div class="text-sm font-medium text-white">{{ user.name }}</div>
                                    <div class="text-xs text-zinc-400">{{ user.translations }} translations</div>
                                </div>
                            </div>
                            <div class="text-sm font-medium" :class="getRankColor(index + 1)">
                                #{{ index + 1 }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Error Analysis -->
                <div class="translate-card" v-if="recentErrors.length > 0">
                    <h3 class="font-semibold text-red-400 mb-4">Recent Issues</h3>
                    <div class="space-y-3">
                        <div v-for="error in recentErrors" :key="error.id"
                            class="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <div class="flex items-start gap-2 mb-1">
                                <AlertTriangle class="h-3 w-3 text-red-400 flex-shrink-0 mt-0.5" />
                                <div class="flex-1">
                                    <div class="text-xs font-medium text-red-400">{{ error.type }}</div>
                                    <div class="text-xs text-zinc-300">{{ error.message }}</div>
                                    <div class="text-xs text-zinc-500 mt-1">{{ error.time }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Quick Actions</h3>
                    <div class="space-y-2">
                        <button @click="generateReport" class="w-full translate-btn-secondary text-sm">
                            <FileText class="h-4 w-4" />
                            Generate Report
                        </button>
                        <button @click="viewLogs" class="w-full translate-btn-secondary text-sm">
                            <Search class="h-4 w-4" />
                            View Detailed Logs
                        </button>
                        <button @click="optimizeSettings" class="w-full translate-btn-primary text-sm">
                            <Settings class="h-4 w-4" />
                            Optimize Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
    Download, RefreshCw, TrendingUp, Users, Zap, CheckCircle, UserCheck,
    Hash, AlertTriangle, FileText, Search, Settings
} from 'lucide-vue-next'
import { useDiscordBotStore } from '@/stores/useDiscordBotStore'

const store = useDiscordBotStore()
const loading = ref(false)
const selectedDateRange = ref('7d')

// Mock analytics data
const analytics = ref({
    totalTranslations: 45732,
    translationGrowth: 18,
    activeUsers: 1247,
    userEngagement: 76,
    avgResponseTime: 234,
    responseImprovement: 67,
    successRate: 98.9,
    errorCount: 23,
    reactionRoleUses: 3421,
    reactionRoleMessages: 12
})

const timelineData = ref([
    { label: 'Mon', translations: 234, roleAssignments: 45, activeUsers: 89 },
    { label: 'Tue', translations: 312, roleAssignments: 67, activeUsers: 124 },
    { label: 'Wed', translations: 289, roleAssignments: 52, activeUsers: 98 },
    { label: 'Thu', translations: 356, roleAssignments: 78, activeUsers: 156 },
    { label: 'Fri', translations: 423, roleAssignments: 89, activeUsers: 189 },
    { label: 'Sat', translations: 387, roleAssignments: 72, activeUsers: 145 },
    { label: 'Sun', translations: 298, roleAssignments: 58, activeUsers: 112 }
])

const sourceLanguages = ref([
    { code: 'ja', name: 'Japanese', flag: 'jp', count: 8942, percentage: 85 },
    { code: 'es', name: 'Spanish', flag: 'es', count: 5231, percentage: 50 },
    { code: 'fr', name: 'French', flag: 'fr', count: 3876, percentage: 37 },
    { code: 'de', name: 'German', flag: 'de', count: 2954, percentage: 28 },
    { code: 'ko', name: 'Korean', flag: 'kr', count: 2103, percentage: 20 }
])

const targetLanguages = ref([
    { code: 'en', name: 'English', flag: 'us', count: 12847, percentage: 100 },
    { code: 'es', name: 'Spanish', flag: 'es', count: 3421, percentage: 27 },
    { code: 'fr', name: 'French', flag: 'fr', count: 2156, percentage: 17 },
    { code: 'de', name: 'German', flag: 'de', count: 1634, percentage: 13 },
    { code: 'pt', name: 'Portuguese', flag: 'pt', count: 987, percentage: 8 }
])

const channelStats = ref([
    { id: '1', name: 'international', translations: 8942, messageCount: 15234, uniqueUsers: 456 },
    { id: '2', name: 'general', translations: 5431, messageCount: 23456, uniqueUsers: 789 },
    { id: '3', name: 'language-exchange', translations: 3217, messageCount: 7890, uniqueUsers: 234 },
    { id: '4', name: 'gaming', translations: 1876, messageCount: 12345, uniqueUsers: 345 },
    { id: '5', name: 'announcements', translations: 234, messageCount: 456, uniqueUsers: 67 }
])

const realTimeStats = ref({
    onlineUsers: 156,
    lastHourTranslations: 47,
    currentResponseTime: 189,
    uptime: '12d 8h'
})

const topUsers = ref([
    { id: '1', name: 'Akira', translations: 1247 },
    { id: '2', name: 'Maria', translations: 986 },
    { id: '3', name: 'Hans', translations: 834 },
    { id: '4', name: 'Pierre', translations: 692 },
    { id: '5', name: 'Jin', translations: 567 }
])

const recentErrors = ref([
    {
        id: 1,
        type: 'API Timeout',
        message: 'Translation request timed out after 30s',
        time: '2 hours ago'
    },
    {
        id: 2,
        type: 'Rate Limit',
        message: 'User exceeded rate limit (5/min)',
        time: '4 hours ago'
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

const getMaxValue = (metric) => {
    return Math.max(...timelineData.value.map(point => point[metric]))
}

const getRankColor = (rank) => {
    if (rank === 1) return 'text-amber-400'
    if (rank === 2) return 'text-zinc-300'
    if (rank === 3) return 'text-amber-600'
    return 'text-zinc-400'
}

// Actions
const refreshData = async () => {
    loading.value = true
    try {
        // Simulate data refresh
        await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
        console.error('Failed to refresh analytics:', error)
    } finally {
        loading.value = false
    }
}

const exportAnalytics = () => {
    console.log('Exporting analytics for', selectedDateRange.value)
    // Implement export functionality
}

const generateReport = () => {
    console.log('Generating detailed analytics report')
    // Implement report generation
}

const viewLogs = () => {
    console.log('Opening detailed logs view')
    // Navigate to logs view
}

const optimizeSettings = () => {
    console.log('Opening optimization suggestions')
    // Show optimization recommendations
}

onMounted(() => {
    // Load analytics data on component mount
    refreshData()
})
</script>

<style scoped>
/* Flag icons */
.fi {
    display: inline-block;
    border-radius: 2px;
}

/* Chart tooltips */
.group:hover .absolute {
    z-index: 10;
}
</style>