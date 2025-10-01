<!-- TopHeroes Dashboard.vue -->
<template>
    <div>
        <!-- Live Status Pills -->
        <div class="mb-6 flex flex-wrap items-center gap-3">
            <div class="inline-flex items-center gap-2 rounded-full bg-th-success/15 px-4 py-2 text-sm text-th-success">
                <span class="h-2 w-2 rounded-full bg-th-success animate-pulse"></span>
                {{ store.dashboardStats.totalGuides }} Active Guides
            </div>
            <div class="inline-flex items-center gap-2 rounded-full bg-th-primary/15 px-4 py-2 text-sm text-th-primary">
                <BookOpen class="h-4 w-4" />
                {{ store.dashboardStats.totalHeroes }} Heroes
            </div>
            <div v-if="store.dashboardStats.activeEvents > 0"
                class="inline-flex items-center gap-2 rounded-full bg-th-warning/15 px-4 py-2 text-sm text-th-warning">
                <Calendar class="h-4 w-4" />
                {{ store.dashboardStats.activeEvents }} Active Events
            </div>
            <div v-if="store.dashboardStats.monthlyViews > 0"
                class="inline-flex items-center gap-2 rounded-full bg-th-secondary/15 px-4 py-2 text-sm text-th-secondary">
                <Eye class="h-4 w-4" />
                {{ store.formatNumber(store.dashboardStats.monthlyViews) }} Monthly Views
            </div>
        </div>

        <!-- KPI Cards -->
        <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
            <!-- Total Guides Card -->
            <div class="th-stat-card bg-gradient-to-br from-th-primary/10 to-th-primary/5 border-th-primary/20">
                <div class="absolute inset-0 bg-gradient-to-br from-th-primary/5 to-transparent"></div>
                <div class="relative p-2 h-full flex flex-col">
                    <div class="flex items-center justify-between flex-1">
                        <div class="flex-1">
                            <div class="text-sm font-medium text-th-primary mb-1">Total Guides</div>
                            <div class="text-2xl font-bold text-foreground mb-1">{{ store.dashboardStats.totalGuides }}
                            </div>
                            <div class="text-xs text-foreground/60">{{ publishedGuides }} published</div>
                        </div>
                        <div class="h-12 w-12 rounded-full flex items-center justify-center bg-th-primary/15">
                            <BookOpen class="h-6 w-6 text-th-primary" />
                        </div>
                    </div>
                    <div v-if="guideGrowthTrend" class="mt-3 flex items-center gap-1">
                        <TrendingUp class="h-3 w-3 text-th-success" />
                        <span class="text-xs text-th-success font-medium">{{ guideGrowthTrend.value }}</span>
                        <span class="text-xs text-foreground/60">this month</span>
                    </div>
                </div>
            </div>

            <!-- Monthly Views Card -->
            <div class="th-stat-card bg-gradient-to-br from-th-secondary/10 to-th-secondary/5 border-th-secondary/20">
                <div class="absolute inset-0 bg-gradient-to-br from-th-secondary/5 to-transparent"></div>
                <div class="relative p-2 h-full flex flex-col">
                    <div class="flex items-center justify-between flex-1">
                        <div class="flex-1">
                            <div class="text-sm font-medium text-th-secondary mb-1">Monthly Views</div>
                            <div class="text-2xl font-bold text-foreground mb-1">{{
                                store.formatNumber(store.dashboardStats.monthlyViews) }}</div>
                            <div class="text-xs text-foreground/60">{{ avgDailyViews }}/day avg</div>
                        </div>
                        <div class="h-12 w-12 rounded-full flex items-center justify-center bg-th-secondary/15">
                            <Eye class="h-6 w-6 text-th-secondary" />
                        </div>
                    </div>
                    <div v-if="viewsGrowthTrend" class="mt-3 flex items-center gap-1">
                        <TrendingUp
                            :class="['h-3 w-3', viewsGrowthTrend.positive ? 'text-th-success' : 'text-th-warning']" />
                        <span
                            :class="['text-xs font-medium', viewsGrowthTrend.positive ? 'text-th-success' : 'text-th-warning']">
                            {{ viewsGrowthTrend.value }}
                        </span>
                        <span class="text-xs text-foreground/60">vs last month</span>
                    </div>
                </div>
            </div>

            <!-- Active Events Card -->
            <div class="th-stat-card bg-gradient-to-br from-th-warning/10 to-th-warning/5 border-th-warning/20">
                <div class="absolute inset-0 bg-gradient-to-br from-th-warning/5 to-transparent"></div>
                <div class="relative p-2 h-full flex flex-col">
                    <div class="flex items-center justify-between flex-1">
                        <div class="flex-1">
                            <div class="text-sm font-medium text-th-warning mb-1">Active Events</div>
                            <div class="text-2xl font-bold text-foreground mb-1">{{ store.dashboardStats.activeEvents }}
                            </div>
                            <div class="text-xs text-foreground/60">{{ store.events.upcoming.length }} upcoming</div>
                        </div>
                        <div class="h-12 w-12 rounded-full flex items-center justify-center bg-th-warning/15">
                            <Calendar class="h-6 w-6 text-th-warning" />
                        </div>
                    </div>
                    <div v-if="nextEventTime" class="mt-3 flex items-center gap-1">
                        <Clock class="h-3 w-3 text-th-warning" />
                        <span class="text-xs text-th-warning font-medium">Next: {{ nextEventTime }}</span>
                    </div>
                </div>
            </div>

            <!-- Content Health Card -->
            <div class="th-stat-card bg-gradient-to-br from-th-success/10 to-th-success/5 border-th-success/20">
                <div class="absolute inset-0 bg-gradient-to-br from-th-success/5 to-transparent"></div>
                <div class="relative p-2 h-full flex flex-col">
                    <div class="flex items-center justify-between flex-1">
                        <div class="flex-1">
                            <div class="text-sm font-medium text-th-success mb-1">Content Health</div>
                            <div class="text-2xl font-bold text-foreground mb-1">{{ contentHealthScore }}%</div>
                            <div class="text-xs text-foreground/60">{{ contentHealthStatus }}</div>
                        </div>
                        <div class="h-12 w-12 rounded-full flex items-center justify-center bg-th-success/15">
                            <Shield class="h-6 w-6 text-th-success" />
                        </div>
                    </div>
                    <div class="mt-3 flex items-center gap-1">
                        <CheckCircle
                            :class="['h-3 w-3', contentHealthScore >= 80 ? 'text-th-success' : 'text-th-warning']" />
                        <span
                            :class="['text-xs font-medium', contentHealthScore >= 80 ? 'text-th-success' : 'text-th-warning']">
                            {{ upToDateGuides }} guides updated
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Content Grid -->
        <section class="grid gap-6 lg:grid-cols-3">
            <!-- Main Dashboard Content (2/3 width) -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Top Performing Guides -->
                <div class="elev-card">
                    <div class="mb-4 flex items-center justify-between">
                        <h3 class="font-semibold text-th-primary">Top Performing Guides</h3>
                        <button @click="navigateTo('guides')" class="btn-th-soft">
                            <TrendingUp class="h-4 w-4" />
                            View All
                        </button>
                    </div>

                    <div v-if="store.topPerformers.length > 0" class="space-y-3">
                        <div v-for="(guide, index) in store.topPerformers.slice(0, 6)" :key="guide.id"
                            class="flex items-center justify-between p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors">
                            <div class="flex items-center gap-3">
                                <div class="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                    :class="getRankBadgeClass(index + 1)">
                                    {{ index + 1 }}
                                </div>
                                <div
                                    class="h-8 w-8 rounded-full bg-gradient-to-br from-th-primary to-th-secondary flex items-center justify-center">
                                    <BookOpen class="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <div class="text-sm font-medium">{{ guide.title || `Guide ${guide.id}` }}</div>
                                    <div class="text-xs text-foreground/60">{{ guide.category || 'General' }}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-sm font-bold text-th-primary">{{ store.formatNumber(guide.views || 0)
                                    }} views</div>
                                <div v-if="guide.rating" class="text-xs text-th-success">★ {{ guide.rating.toFixed(1) }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-foreground/60">
                        <BookOpen class="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No guide performance data available</p>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="elev-card">
                    <div class="mb-4 flex items-center justify-between">
                        <h3 class="font-semibold text-th-primary">Recent Activity</h3>
                        <div class="flex items-center gap-2">
                            <button @click="refreshData" :disabled="isRefreshing" class="btn-th-soft">
                                <RefreshCw :class="['h-4 w-4', { 'animate-spin': isRefreshing }]" />
                                Refresh
                            </button>
                            <button @click="navigateTo('guides')" class="btn-th-soft">
                                <FileText class="h-4 w-4" />
                                View Guides
                            </button>
                        </div>
                    </div>

                    <div v-if="store.recentActivity.length > 0" class="space-y-2">
                        <div v-for="activity in store.recentActivity" :key="activity.id"
                            class="flex items-center justify-between py-2 px-3 rounded hover:bg-foreground/5 transition-colors">
                            <div class="flex items-center gap-3">
                                <component :is="activity.icon" :class="['h-4 w-4', activity.color]" />
                                <span class="text-sm">{{ activity.message }}</span>
                            </div>
                            <span class="text-xs text-foreground/60">{{ store.formatTimeAgo(activity.time) }}</span>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-foreground/60">
                        <Activity class="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No recent activity</p>
                    </div>
                </div>

                <!-- Upcoming Events -->
                <div v-if="store.events.upcoming.length > 0" class="elev-card">
                    <div class="mb-4 flex items-center justify-between">
                        <h3 class="font-semibold text-th-primary">Upcoming Events</h3>
                        <button @click="navigateTo('events')" class="btn-th-soft">
                            <Calendar class="h-4 w-4" />
                            Manage
                        </button>
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
                        <div v-for="event in store.events.upcoming.slice(0, 4)" :key="event.id"
                            class="p-4 rounded-lg border border-border/60 hover:border-th-primary/30 transition-colors cursor-pointer"
                            @click="navigateTo('events')">
                            <div class="flex items-center gap-3 mb-2">
                                <div
                                    class="h-8 w-8 rounded-lg flex items-center justify-center text-white bg-th-warning">
                                    <Calendar class="h-4 w-4" />
                                </div>
                                <div>
                                    <div class="font-medium text-sm">{{ event.name || 'Event' }}</div>
                                    <div class="text-xs text-foreground/60">{{ event.type?.toUpperCase() || 'GENERAL' }}
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-1">
                                <div class="flex justify-between text-xs">
                                    <span class="text-foreground/70">Starts in</span>
                                    <span class="font-medium">{{ store.formatTimeAgo(event.startTime) }}</span>
                                </div>
                                <div v-if="event.description" class="text-xs text-foreground/60">
                                    {{ event.description.slice(0, 50) }}...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar (1/3 width) -->
            <div class="space-y-6">
                <!-- Quick Actions -->
                <div class="elev-card">
                    <h3 class="mb-4 font-semibold text-th-primary">Quick Actions</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <button @click="navigateTo('guides')" class="tool-tile hover:border-th-primary/50">
                            <Plus class="h-4 w-4 text-th-primary" />
                            <div>
                                <div class="text-sm font-medium">New Guide</div>
                                <div class="text-xs text-foreground/70">Create content</div>
                            </div>
                        </button>
                        <button @click="navigateTo('heroes')" class="tool-tile hover:border-th-secondary/50">
                            <Users class="h-4 w-4 text-th-secondary" />
                            <div>
                                <div class="text-sm font-medium">Add Hero</div>
                                <div class="text-xs text-foreground/70">Manage data</div>
                            </div>
                        </button>
                        <button @click="navigateTo('events')" class="tool-tile hover:border-th-warning/50">
                            <Calendar class="h-4 w-4 text-th-warning" />
                            <div>
                                <div class="text-sm font-medium">Schedule Event</div>
                                <div class="text-xs text-foreground/70">Plan ahead</div>
                            </div>
                        </button>
                        <button @click="navigateTo('analytics')" class="tool-tile hover:border-th-success/50">
                            <TrendingUp class="h-4 w-4 text-th-success" />
                            <div>
                                <div class="text-sm font-medium">Analytics</div>
                                <div class="text-xs text-foreground/70">View stats</div>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Content Insights -->
                <div v-if="store.dashboardInsights.length > 0" class="elev-card">
                    <div class="mb-4 flex items-center justify-between">
                        <h3 class="font-semibold text-th-primary">Content Insights</h3>
                        <button @click="refreshData" :disabled="isRefreshing" class="btn-th-soft">
                            <RefreshCw :class="['h-4 w-4', { 'animate-spin': isRefreshing }]" />
                        </button>
                    </div>

                    <div class="space-y-3">
                        <div v-for="(insight, index) in store.dashboardInsights" :key="index"
                            class="flex items-center gap-3 p-3 rounded-lg bg-foreground/5">
                            <div
                                :class="['h-8 w-8 rounded-lg flex items-center justify-center', getInsightIconBg(insight.color)]">
                                <component :is="getInsightIcon(insight.icon)"
                                    :class="['h-4 w-4', getInsightIconColor(insight.color)]" />
                            </div>
                            <span class="text-sm text-foreground/80">{{ insight.text }}</span>
                        </div>
                    </div>
                </div>

                <!-- System Health -->
                <div class="elev-card">
                    <h3 class="mb-4 font-semibold text-th-primary">System Health</h3>
                    <div class="space-y-3">
                        <div v-for="health in store.systemHealth" :key="health.metric"
                            class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div :class="[
                                    'h-2 w-2 rounded-full',
                                    health.status === 'healthy' ? 'bg-th-success' :
                                        health.status === 'warning' ? 'bg-th-warning' : 'bg-th-danger'
                                ]"></div>
                                <span class="text-sm text-foreground/70">{{ health.metric }}</span>
                            </div>
                            <span :class="[
                                'text-sm font-medium',
                                health.status === 'healthy' ? 'text-th-success' :
                                    health.status === 'warning' ? 'text-th-warning' : 'text-th-danger'
                            ]">
                                {{ health.value }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Recent Guides -->
                <div class="elev-card">
                    <h3 class="mb-4 font-semibold text-th-primary">Recent Guides</h3>
                    <div v-if="store.dashboardStats.recentGuides.length > 0" class="space-y-2">
                        <div v-for="guide in store.dashboardStats.recentGuides.slice(0, 5)" :key="guide.id"
                            class="flex items-center gap-3 p-2 rounded hover:bg-foreground/5 transition-colors cursor-pointer"
                            @click="navigateTo('guides')">
                            <div
                                class="h-6 w-6 rounded-full bg-gradient-to-br from-th-primary to-th-secondary flex items-center justify-center">
                                <BookOpen class="h-3 w-3 text-white" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="text-sm font-medium truncate">{{ guide.title || `Guide ${guide.id}` }}</div>
                                <div class="text-xs text-foreground/60">{{ guide.category }} • {{
                                    store.formatTimeAgo(guide.lastUpdated) }}</div>
                            </div>
                            <div :class="[
                                'h-3 w-3 rounded-full',
                                guide.status === 'published' ? 'bg-th-success' :
                                    guide.status === 'draft' ? 'bg-th-warning' : 'bg-th-danger'
                            ]"></div>
                        </div>
                    </div>
                    <div v-else class="text-center py-4 text-foreground/60">
                        <BookOpen class="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p class="text-xs">No recent guides</p>
                    </div>
                </div>

                <!-- System Status -->
                <div class="elev-card">
                    <h3 class="mb-4 font-semibold text-th-primary">System Status</h3>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-foreground/70">Last Sync:</span>
                            <span class="font-medium">{{ lastSyncTime }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-foreground/70">Cache Status:</span>
                            <span :class="['font-medium', store.isCacheStale ? 'text-th-warning' : 'text-th-success']">
                                {{ store.isCacheStale ? 'Stale' : 'Fresh' }}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-foreground/70">Total Content:</span>
                            <span class="font-medium">{{ store.dashboardStats.totalGuides +
                                store.dashboardStats.totalHeroes }} items</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-foreground/70">Version:</span>
                            <span class="font-medium">v3.0.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
    BookOpen, Eye, Calendar, Clock, Shield, TrendingUp, Plus, Users,
    RefreshCw, CheckCircle, Activity, FileText
} from 'lucide-vue-next'
import { useTopHeroesAdminStore } from '@/stores/useTopHeroesAdminStore'

// Store
const store = useTopHeroesAdminStore()

// Reactive state
const isRefreshing = ref(false)

// Computed properties
const publishedGuides = computed(() => {
    return store.guides.list.filter(g => g.status === 'published').length
})

const avgDailyViews = computed(() => {
    return Math.round(store.dashboardStats.monthlyViews / 30)
})

const contentHealthScore = computed(() => {
    if (store.guides.list.length === 0) return 100
    const upToDate = store.guides.list.filter(g => {
        const daysSince = (Date.now() - (g.lastUpdated || 0)) / (1000 * 60 * 60 * 24)
        return daysSince <= 30
    }).length
    return Math.round((upToDate / store.guides.list.length) * 100)
})

const contentHealthStatus = computed(() => {
    const score = contentHealthScore.value
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Attention'
})

const upToDateGuides = computed(() => {
    return store.guides.list.filter(g => {
        const daysSince = (Date.now() - (g.lastUpdated || 0)) / (1000 * 60 * 60 * 24)
        return daysSince <= 30
    }).length
})

const guideGrowthTrend = computed(() => ({
    value: '+12%',
    positive: true
}))

const viewsGrowthTrend = computed(() => ({
    value: '+8.5%',
    positive: true
}))

const nextEventTime = computed(() => {
    if (store.events.upcoming.length > 0) {
        return store.formatTimeAgo(store.events.upcoming[0].startTime)
    }
    return null
})

const lastSyncTime = computed(() => {
    if (store.lastGlobalUpdate) {
        return new Date(store.lastGlobalUpdate).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }
    return 'Never'
})

// Helper functions
const getRankBadgeClass = (rank) => {
    if (rank === 1) return 'bg-th-warning' // Gold
    if (rank === 2) return 'bg-gray-400' // Silver
    if (rank === 3) return 'bg-amber-600' // Bronze
    return 'bg-th-primary'
}

const getInsightIcon = (iconName) => {
    const icons = {
        'TrendingUp': TrendingUp,
        'BookOpen': BookOpen,
        'Calendar': Calendar,
        'Activity': Activity
    }
    return icons[iconName] || Activity
}

const getInsightIconBg = (color) => {
    const backgrounds = {
        'th-success': 'bg-th-success/15',
        'th-primary': 'bg-th-primary/15',
        'th-warning': 'bg-th-warning/15',
        'th-secondary': 'bg-th-secondary/15'
    }
    return backgrounds[color] || 'bg-foreground/10'
}

const getInsightIconColor = (color) => {
    const colors = {
        'th-success': 'text-th-success',
        'th-primary': 'text-th-primary',
        'th-warning': 'text-th-warning',
        'th-secondary': 'text-th-secondary'
    }
    return colors[color] || 'text-foreground/60'
}

// Actions
const navigateTo = (view) => {
    console.log(`Navigate to: ${view}`)
}

const refreshData = async () => {
    isRefreshing.value = true
    try {
        await store.forceRefresh()
    } catch (error) {
        console.error('Failed to refresh data:', error)
    } finally {
        isRefreshing.value = false
    }
}

// Initialize data on mount
onMounted(async () => {
    try {
        await store.loadDashboardData()
    } catch (error) {
        console.error('Failed to load dashboard data:', error)
    }
})
</script>

<style scoped>
.th-stat-card {
    @apply relative overflow-hidden rounded-xl border min-h-[120px];
}
</style>