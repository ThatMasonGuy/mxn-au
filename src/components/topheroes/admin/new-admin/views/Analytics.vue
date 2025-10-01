<!-- TopHeroes Analytics.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <h1 class="text-2xl font-semibold text-th-primary">Analytics Dashboard</h1>
                    <p class="text-sm text-foreground/70 mt-1">Track content performance, user engagement, and site
                        metrics</p>
                </div>
                <div class="flex gap-3 w-full lg:w-auto">
                    <select v-model="selectedPeriod"
                        class="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-th-primary/50 transition">
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last year</option>
                    </select>
                    <button @click="refreshData" class="btn-th-soft">
                        <RefreshCw :class="['h-4 w-4 mr-2', { 'animate-spin': isRefreshing }]" />
                        Refresh
                    </button>
                    <button @click="exportReport" class="btn-th-primary">
                        <Download class="h-4 w-4 mr-2" />
                        Export Report
                    </button>
                </div>
            </div>
        </div>

        <!-- Key Metrics Overview -->
        <div class="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Total Views -->
            <div class="th-stat-card bg-gradient-to-br from-th-primary/10 to-th-primary/5 border-th-primary/20">
                <div class="relative p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-medium text-th-primary mb-1">Total Views</div>
                            <div class="text-3xl font-bold text-foreground mb-1">{{ formatNumber(metrics.totalViews) }}
                            </div>
                            <div class="flex items-center gap-1 text-xs">
                                <component :is="metrics.viewsChange >= 0 ? TrendingUp : TrendingDown"
                                    :class="['h-3 w-3', metrics.viewsChange >= 0 ? 'text-th-success' : 'text-th-danger']" />
                                <span
                                    :class="[metrics.viewsChange >= 0 ? 'text-th-success' : 'text-th-danger', 'font-medium']">
                                    {{ Math.abs(metrics.viewsChange) }}%
                                </span>
                                <span class="text-foreground/60">vs last period</span>
                            </div>
                        </div>
                        <div class="h-12 w-12 rounded-full flex items-center justify-center bg-th-primary/15">
                            <Eye class="h-6 w-6 text-th-primary" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Unique Visitors -->
            <div class="th-stat-card bg-gradient-to-br from-th-success/10 to-th-success/5 border-th-success/20">
                <div class="relative p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-medium text-th-success mb-1">Unique Visitors</div>
                            <div class="text-3xl font-bold text-foreground mb-1">{{ formatNumber(metrics.uniqueVisitors)
                                }}</div>
                            <div class="flex items-center gap-1 text-xs">
                                <component :is="metrics.visitorsChange >= 0 ? TrendingUp : TrendingDown"
                                    :class="['h-3 w-3', metrics.visitorsChange >= 0 ? 'text-th-success' : 'text-th-danger']" />
                                <span
                                    :class="[metrics.visitorsChange >= 0 ? 'text-th-success' : 'text-th-danger', 'font-medium']">
                                    {{ Math.abs(metrics.visitorsChange) }}%
                                </span>
                                <span class="text-foreground/60">vs last period</span>
                            </div>
                        </div>
                        <div class="h-12 w-12 rounded-full flex items-center justify-center bg-th-success/15">
                            <Users class="h-6 w-6 text-th-success" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Average Session Duration -->
            <div class="th-stat-card bg-gradient-to-br from-th-warning/10 to-th-warning/5 border-th-warning/20">
                <div class="relative p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-medium text-th-warning mb-1">Avg. Session</div>
                            <div class="text-3xl font-bold text-foreground mb-1">{{
                                formatDuration(metrics.avgSessionDuration) }}</div>
                            <div class="flex items-center gap-1 text-xs">
                                <component :is="metrics.sessionChange >= 0 ? TrendingUp : TrendingDown"
                                    :class="['h-3 w-3', metrics.sessionChange >= 0 ? 'text-th-success' : 'text-th-danger']" />
                                <span
                                    :class="[metrics.sessionChange >= 0 ? 'text-th-success' : 'text-th-danger', 'font-medium']">
                                    {{ Math.abs(metrics.sessionChange) }}%
                                </span>
                                <span class="text-foreground/60">vs last period</span>
                            </div>
                        </div>
                        <div class="h-12 w-12 rounded-full flex items-center justify-center bg-th-warning/15">
                            <Clock class="h-6 w-6 text-th-warning" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bounce Rate -->
            <div class="th-stat-card bg-gradient-to-br from-th-secondary/10 to-th-secondary/5 border-th-secondary/20">
                <div class="relative p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-medium text-th-secondary mb-1">Bounce Rate</div>
                            <div class="text-3xl font-bold text-foreground mb-1">{{ metrics.bounceRate }}%</div>
                            <div class="flex items-center gap-1 text-xs">
                                <component :is="metrics.bounceChange <= 0 ? TrendingDown : TrendingUp"
                                    :class="['h-3 w-3', metrics.bounceChange <= 0 ? 'text-th-success' : 'text-th-danger']" />
                                <span
                                    :class="[metrics.bounceChange <= 0 ? 'text-th-success' : 'text-th-danger', 'font-medium']">
                                    {{ Math.abs(metrics.bounceChange) }}%
                                </span>
                                <span class="text-foreground/60">vs last period</span>
                            </div>
                        </div>
                        <div class="h-12 w-12 rounded-full flex items-center justify-center bg-th-secondary/15">
                            <MousePointer class="h-6 w-6 text-th-secondary" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="mb-8 grid gap-6 lg:grid-cols-2">
            <!-- Traffic Chart -->
            <div class="elev-card">
                <div class="p-6 border-b border-border/20">
                    <div class="flex items-center justify-between">
                        <h3 class="font-semibold text-th-primary">Traffic Overview</h3>
                        <div class="flex items-center gap-2">
                            <button @click="trafficChartType = 'views'"
                                :class="['text-xs px-2 py-1 rounded', trafficChartType === 'views' ? 'bg-th-primary text-white' : 'text-foreground/60 hover:text-foreground']">
                                Views
                            </button>
                            <button @click="trafficChartType = 'visitors'"
                                :class="['text-xs px-2 py-1 rounded', trafficChartType === 'visitors' ? 'bg-th-primary text-white' : 'text-foreground/60 hover:text-foreground']">
                                Visitors
                            </button>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <div class="h-64 flex items-center justify-center text-foreground/60">
                        <BarChart3 class="h-12 w-12 mb-2" />
                        <div class="text-center">
                            <p>{{ trafficChartType === 'views' ? 'Views' : 'Visitors' }} Chart</p>
                            <p class="text-xs">Interactive chart would be rendered here</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Top Content -->
            <div class="elev-card">
                <div class="p-6 border-b border-border/20">
                    <h3 class="font-semibold text-th-primary">Top Performing Content</h3>
                </div>
                <div class="divide-y divide-border/20 max-h-80 overflow-y-auto">
                    <div v-for="(content, index) in topContent" :key="content.id"
                        class="p-4 hover:bg-foreground/2 transition">
                        <div class="flex items-center gap-3">
                            <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                :class="index < 3 ? getRankBadgeClass(index + 1) : 'bg-foreground/20'">
                                {{ index + 1 }}
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-medium text-foreground truncate">{{ content.title }}</h4>
                                <p class="text-sm text-foreground/60">{{ content.category }}</p>
                            </div>
                            <div class="text-right">
                                <div class="text-sm font-bold text-th-primary">{{ formatNumber(content.views) }}</div>
                                <div class="text-xs text-foreground/60">{{ content.engagement }}% engagement</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detailed Analytics -->
        <div class="grid gap-6 lg:grid-cols-3">
            <!-- Traffic Sources -->
            <div class="elev-card">
                <div class="p-6 border-b border-border/20">
                    <h3 class="font-semibold text-th-primary">Traffic Sources</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        <div v-for="source in trafficSources" :key="source.name"
                            class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: source.color }"></div>
                                <span class="text-sm text-foreground/80">{{ source.name }}</span>
                            </div>
                            <div class="text-right">
                                <div class="text-sm font-medium">{{ source.percentage }}%</div>
                                <div class="text-xs text-foreground/60">{{ formatNumber(source.visitors) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Device Analytics -->
            <div class="elev-card">
                <div class="p-6 border-b border-border/20">
                    <h3 class="font-semibold text-th-primary">Device Breakdown</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        <div v-for="device in deviceBreakdown" :key="device.type" class="space-y-2">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <component :is="getDeviceIcon(device.type)" class="h-4 w-4 text-foreground/60" />
                                    <span class="text-sm text-foreground/80">{{ device.type }}</span>
                                </div>
                                <span class="text-sm font-medium">{{ device.percentage }}%</span>
                            </div>
                            <div class="w-full bg-border/60 rounded-full h-2">
                                <div class="bg-th-primary h-2 rounded-full transition-all duration-500"
                                    :style="{ width: `${device.percentage}%` }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Popular Search Terms -->
            <div class="elev-card">
                <div class="p-6 border-b border-border/20">
                    <h3 class="font-semibold text-th-primary">Popular Search Terms</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-3">
                        <div v-for="(term, index) in popularSearches" :key="term.query"
                            class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="text-xs text-foreground/40">{{ index + 1 }}.</span>
                                <span class="text-sm text-foreground/80">{{ term.query }}</span>
                            </div>
                            <div class="text-right">
                                <div class="text-sm font-medium text-th-primary">{{ formatNumber(term.count) }}</div>
                                <div class="text-xs text-foreground/60">{{ term.percentage }}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Geographic Data & User Behavior -->
        <div class="mt-8 grid gap-6 lg:grid-cols-2">
            <!-- Top Countries -->
            <div class="elev-card">
                <div class="p-6 border-b border-border/20">
                    <h3 class="font-semibold text-th-primary">Top Countries</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        <div v-for="country in topCountries" :key="country.code"
                            class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <span class="text-lg">{{ country.flag }}</span>
                                <span class="text-sm text-foreground/80">{{ country.name }}</span>
                            </div>
                            <div class="text-right">
                                <div class="text-sm font-medium">{{ formatNumber(country.visitors) }}</div>
                                <div class="text-xs text-foreground/60">{{ country.percentage }}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- User Engagement -->
            <div class="elev-card">
                <div class="p-6 border-b border-border/20">
                    <h3 class="font-semibold text-th-primary">User Engagement</h3>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-2 gap-6">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-th-success mb-1">{{ metrics.pagesPerSession }}</div>
                            <div class="text-sm text-foreground/60">Pages/Session</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-th-warning mb-1">{{ metrics.returnVisitorRate }}%</div>
                            <div class="text-sm text-foreground/60">Return Visitors</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-th-primary mb-1">{{ formatDuration(metrics.avgPageTime)
                                }}</div>
                            <div class="text-sm text-foreground/60">Avg. Page Time</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-th-secondary mb-1">{{ metrics.conversionRate }}%</div>
                            <div class="text-sm text-foreground/60">Conversion Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Real-time Analytics -->
        <div class="mt-8">
            <div class="elev-card">
                <div class="p-6 border-b border-border/20">
                    <div class="flex items-center justify-between">
                        <h3 class="font-semibold text-th-primary">Real-time Activity</h3>
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 bg-th-success rounded-full animate-pulse"></div>
                            <span class="text-sm text-foreground/60">Live</span>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <div class="grid gap-6 md:grid-cols-3">
                        <div class="text-center">
                            <div class="text-3xl font-bold text-th-success mb-2">{{ realTimeMetrics.activeUsers }}</div>
                            <div class="text-sm text-foreground/60">Users online now</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-th-primary mb-2">{{ realTimeMetrics.pageViewsLastHour }}
                            </div>
                            <div class="text-sm text-foreground/60">Page views (last hour)</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-th-warning mb-2">{{ realTimeMetrics.activePages }}</div>
                            <div class="text-sm text-foreground/60">Active pages</div>
                        </div>
                    </div>

                    <!-- Recent Activity Feed -->
                    <div class="mt-6 border-t border-border/20 pt-6">
                        <h4 class="text-sm font-medium text-foreground/80 mb-4">Recent Activity</h4>
                        <div class="space-y-2 max-h-32 overflow-y-auto">
                            <div v-for="activity in recentActivity" :key="activity.id"
                                class="flex items-center justify-between text-sm">
                                <span class="text-foreground/70">{{ activity.action }}</span>
                                <span class="text-foreground/50">{{ formatTimeAgo(activity.timestamp) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
    Eye, Users, Clock, MousePointer, TrendingUp, TrendingDown, RefreshCw,
    Download, BarChart3, Monitor, Tablet, Smartphone, Globe
} from 'lucide-vue-next'

// Reactive state
const selectedPeriod = ref('30d')
const trafficChartType = ref('views')
const isRefreshing = ref(false)

// Mock metrics data
const metrics = ref({
    totalViews: 284726,
    viewsChange: 12.3,
    uniqueVisitors: 45892,
    visitorsChange: 8.7,
    avgSessionDuration: 435, // seconds
    sessionChange: -2.1,
    bounceRate: 32.4,
    bounceChange: -5.2,
    pagesPerSession: 3.2,
    returnVisitorRate: 68.5,
    avgPageTime: 185, // seconds
    conversionRate: 4.7
})

const topContent = ref([
    { id: 1, title: 'Ultimate Hero Team Building Guide', category: 'Heroes', views: 45234, engagement: 87.3 },
    { id: 2, title: 'GvG Battle Strategy Mastery', category: 'Strategy', views: 38912, engagement: 82.1 },
    { id: 3, title: 'Resource Management for New Players', category: 'General', views: 29847, engagement: 78.9 },
    { id: 4, title: 'Event Participation Optimization', category: 'Events', views: 25603, engagement: 75.2 },
    { id: 5, title: 'Advanced Hero Positioning', category: 'Strategy', views: 21789, engagement: 72.8 }
])

const trafficSources = ref([
    { name: 'Organic Search', percentage: 42.3, visitors: 19384, color: '#1E40AF' },
    { name: 'Direct', percentage: 28.7, visitors: 13181, color: '#EA580C' },
    { name: 'Social Media', percentage: 15.2, visitors: 6976, color: '#16A34A' },
    { name: 'Referrals', percentage: 8.9, visitors: 4084, color: '#D97706' },
    { name: 'Email', percentage: 4.9, visitors: 2249, color: '#DC2626' }
])

const deviceBreakdown = ref([
    { type: 'Desktop', percentage: 58.4, icon: Monitor },
    { type: 'Mobile', percentage: 35.2, icon: Smartphone },
    { type: 'Tablet', percentage: 6.4, icon: Tablet }
])

const popularSearches = ref([
    { query: 'hero team building', count: 8924, percentage: 18.3 },
    { query: 'best heroes 2024', count: 6751, percentage: 13.8 },
    { query: 'guild vs guild strategy', count: 5643, percentage: 11.6 },
    { query: 'event guide', count: 4892, percentage: 10.0 },
    { query: 'resource management', count: 3847, percentage: 7.9 },
    { query: 'hero positioning', count: 3201, percentage: 6.6 }
])

const topCountries = ref([
    { code: 'US', name: 'United States', flag: '🇺🇸', visitors: 12847, percentage: 28.0 },
    { code: 'CN', name: 'China', flag: '🇨🇳', visitors: 8293, percentage: 18.1 },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', visitors: 6152, percentage: 13.4 },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', visitors: 4987, percentage: 10.9 },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', visitors: 3674, percentage: 8.0 }
])

const realTimeMetrics = ref({
    activeUsers: 1247,
    pageViewsLastHour: 3892,
    activePages: 89
})

const recentActivity = ref([
    { id: 1, action: 'User viewed "Hero Team Building Guide"', timestamp: Date.now() - 30000 },
    { id: 2, action: 'User downloaded "GvG Strategy PDF"', timestamp: Date.now() - 65000 },
    { id: 3, action: 'New user registered from mobile', timestamp: Date.now() - 120000 },
    { id: 4, action: 'User searched for "best tank heroes"', timestamp: Date.now() - 180000 },
    { id: 5, action: 'User shared "Event Guide" on social media', timestamp: Date.now() - 240000 }
])

// Helper functions
const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
    }
    return num.toLocaleString()
}

const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
}

const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
}

const getRankBadgeClass = (rank) => {
    if (rank === 1) return 'bg-th-warning'
    if (rank === 2) return 'bg-gray-400'
    if (rank === 3) return 'bg-amber-600'
    return 'bg-th-primary'
}

const getDeviceIcon = (deviceType) => {
    const icons = {
        'Desktop': Monitor,
        'Mobile': Smartphone,
        'Tablet': Tablet
    }
    return icons[deviceType] || Monitor
}

// Actions
const refreshData = async () => {
    isRefreshing.value = true

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Update metrics with slight variations
    metrics.value.totalViews += Math.floor(Math.random() * 1000)
    metrics.value.uniqueVisitors += Math.floor(Math.random() * 100)
    realTimeMetrics.value.activeUsers = Math.floor(Math.random() * 500) + 800

    isRefreshing.value = false
}

const exportReport = () => {
    console.log('Exporting analytics report...')
    // Generate and download report
}

// Real-time updates
let realTimeInterval

onMounted(() => {
    // Update real-time metrics every 30 seconds
    realTimeInterval = setInterval(() => {
        realTimeMetrics.value.activeUsers += Math.floor(Math.random() * 20) - 10
        realTimeMetrics.value.pageViewsLastHour += Math.floor(Math.random() * 5)

        // Add new recent activity occasionally
        if (Math.random() > 0.7) {
            const actions = [
                'User viewed guide page',
                'New user registered',
                'User downloaded resource',
                'User shared content',
                'User performed search'
            ]

            recentActivity.value.unshift({
                id: Date.now(),
                action: actions[Math.floor(Math.random() * actions.length)],
                timestamp: Date.now()
            })

            if (recentActivity.value.length > 10) {
                recentActivity.value.pop()
            }
        }
    }, 30000)
})

onUnmounted(() => {
    if (realTimeInterval) {
        clearInterval(realTimeInterval)
    }
})
</script>