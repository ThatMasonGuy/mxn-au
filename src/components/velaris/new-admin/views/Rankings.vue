<!-- Rankings.vue -->
<template>
    <div>
        <!-- Header with Refresh -->
        <div class="mb-6 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-semibold text-velaris-purple">Rankings</h1>
                <p class="text-sm text-foreground/70 mt-1">Track member performance and guild standings</p>
            </div>
            <div class="flex items-center gap-2">
                <span v-if="lastFetchTime" class="text-xs text-foreground/60">
                    Last updated: {{ getTimeAgo(lastFetchTime) }}
                </span>
                <button @click="handleRefresh" :disabled="isLoading" class="btn-soft-violet">
                    <RefreshCw :class="['h-4 w-4', { 'animate-spin': isLoading }]" />
                    {{ isLoading ? 'Loading...' : 'Refresh' }}
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading && !hasData" class="flex items-center justify-center py-20">
            <div class="text-center">
                <div
                    class="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-velaris-purple border-t-transparent">
                </div>
                <p class="mt-4 text-sm text-foreground/60">Loading rankings data...</p>
                <p class="text-xs text-foreground/40 mt-1">This may take a moment with 100+ documents</p>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="loadError" class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div class="flex items-center gap-2 text-red-500">
                <AlertTriangle class="h-5 w-5" />
                <span class="font-medium">Error loading rankings</span>
            </div>
            <p class="text-sm text-foreground/70 mt-1">{{ loadError }}</p>
            <button @click="handleRefresh" class="mt-2 text-sm text-velaris-purple hover:underline">
                Try again
            </button>
        </div>

        <template v-else>
            <!-- Ranking Categories -->
            <div class="mb-6 flex flex-wrap gap-2">
                <button v-for="category in categories" :key="category.key" @click="selectCategory(category.key)" :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition',
                    activeCategory === category.key
                        ? 'bg-velaris-purple text-white shadow-md'
                        : 'bg-card ring-1 ring-border hover:bg-foreground/5'
                ]">
                    <component :is="category.icon" class="h-4 w-4 inline mr-2" />
                    {{ category.label }}
                </button>
            </div>

            <!-- Guild Overview Stats -->
            <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div class="stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm text-foreground/70">Total Members</div>
                            <div class="text-2xl font-bold text-velaris-green">{{ guildStats.totalMembers }}</div>
                            <div class="text-xs text-foreground/60">Total guild members</div>
                        </div>
                        <Users class="h-8 w-8 text-velaris-green" />
                    </div>
                </div>
                <div class="stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm text-foreground/70">Total Power</div>
                            <div class="text-2xl font-bold text-velaris-purple">{{ formatNumber(guildStats.totalPower)
                            }}</div>
                            <div class="text-xs"
                                :class="guildStats.growthPercent > 0 ? 'text-velaris-green' : 'text-foreground/60'">
                                {{ guildStats.growthPercent > 0 ? '+' : '' }}{{ guildStats.growthPercent }}% growth
                            </div>
                        </div>
                        <Zap class="h-8 w-8 text-velaris-purple" />
                    </div>
                </div>
                <div class="stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm text-foreground/70">Avg Member</div>
                            <div class="text-2xl font-bold text-velaris-teal">{{ formatNumber(guildStats.avgPower) }}
                            </div>
                            <div class="text-xs text-foreground/60">Power rating</div>
                        </div>
                        <Shield class="h-8 w-8 text-velaris-teal" />
                    </div>
                </div>
                <div class="stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm text-foreground/70">Activity Score</div>
                            <div class="text-2xl font-bold text-velaris-amber">{{ guildStats.avgActivity }}</div>
                            <div class="text-xs text-foreground/60">Guild average</div>
                        </div>
                        <Activity class="h-8 w-8 text-velaris-amber" />
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid gap-6 lg:grid-cols-3">
                <!-- Main Rankings Table -->
                <div class="lg:col-span-2">
                    <div class="elev-card">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-velaris-purple">
                                {{categories.find(c => c.key === activeCategory)?.label}} Rankings
                            </h3>
                            <div class="flex items-center gap-2">
                                <!-- GvG Toggle for Total vs Average -->
                                <div v-if="activeCategory === 'gvg'" class="flex items-center gap-2">
                                    <button @click="gvgShowAverage = false" :class="[
                                        'px-3 py-1 rounded text-sm transition',
                                        !gvgShowAverage
                                            ? 'bg-velaris-purple text-white'
                                            : 'bg-card ring-1 ring-border hover:bg-foreground/5'
                                    ]">
                                        Total
                                    </button>
                                    <button @click="gvgShowAverage = true" :class="[
                                        'px-3 py-1 rounded text-sm transition',
                                        gvgShowAverage
                                            ? 'bg-velaris-purple text-white'
                                            : 'bg-card ring-1 ring-border hover:bg-foreground/5'
                                    ]">
                                        Average
                                    </button>
                                </div>

                                <button v-if="activeCategory === 'gvg'" @click="showDayBreakdown = !showDayBreakdown"
                                    class="btn-soft-violet">
                                    <Calendar class="h-4 w-4" />
                                    By Day
                                </button>
                                <button class="btn-soft-violet">
                                    <Download class="h-4 w-4" />
                                    Export
                                </button>
                            </div>
                        </div>

                        <!-- Day Breakdown for GvG -->
                        <div v-if="activeCategory === 'gvg' && showDayBreakdown" class="mb-4">
                            <div class="grid grid-cols-3 gap-2">
                                <button v-for="(dayName, dayKey) in dayNames" :key="dayKey"
                                    @click="selectedDay = dayKey" :class="[
                                        'px-3 py-2 rounded text-xs font-medium transition',
                                        selectedDay === dayKey
                                            ? 'bg-velaris-purple text-white'
                                            : 'bg-card ring-1 ring-border hover:bg-foreground/5'
                                    ]">
                                    {{ dayName }}
                                </button>
                            </div>
                            <div v-if="selectedDay && dayRankings[selectedDay]" class="mt-3 space-y-2">
                                <h4 class="text-sm font-medium text-foreground/70">Top {{ dayNames[selectedDay] }}
                                    Performers</h4>
                                <div v-for="member in dayRankings[selectedDay].slice(0, 5)" :key="member.id"
                                    class="flex items-center justify-between p-2 rounded bg-foreground/5">
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs font-bold w-6">{{ member.rank }}</span>
                                        <span class="text-sm">{{ member.name }}</span>
                                    </div>
                                    <span class="text-sm font-medium text-velaris-purple">
                                        {{ formatNumber(member.score) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Rankings Table -->
                        <div class="space-y-1">
                            <!-- Sortable Headers -->
                            <div
                                class="grid grid-cols-12 gap-3 px-3 py-2 text-xs font-medium text-foreground/60 uppercase tracking-wide">
                                <button @click="sortBy('rank')"
                                    class="col-span-1 text-left hover:text-velaris-purple transition">
                                    <div class="flex items-center gap-1">
                                        Rank
                                        <component :is="getSortIcon('rank')" class="h-3 w-3" />
                                    </div>
                                </button>
                                <button @click="sortBy('name')"
                                    class="col-span-4 text-left hover:text-velaris-purple transition">
                                    <div class="flex items-center gap-1">
                                        Member
                                        <component :is="getSortIcon('name')" class="h-3 w-3" />
                                    </div>
                                </button>
                                <button @click="sortBy('mainStat')"
                                    class="col-span-3 text-left hover:text-velaris-purple transition">
                                    <div class="flex items-center gap-1">
                                        {{ getRankingLabel(activeCategory) }}
                                        <component :is="getSortIcon('mainStat')" class="h-3 w-3" />
                                    </div>
                                </button>
                                <button @click="sortBy('change')"
                                    class="col-span-2 text-left hover:text-velaris-purple transition">
                                    <div class="flex items-center gap-1">
                                        Change
                                        <component :is="getSortIcon('change')" class="h-3 w-3" />
                                    </div>
                                </button>
                                <button @click="sortBy('score')"
                                    class="col-span-2 text-left hover:text-velaris-purple transition">
                                    <div class="flex items-center gap-1">
                                        Score
                                        <component :is="getSortIcon('score')" class="h-3 w-3" />
                                    </div>
                                </button>
                            </div>

                            <div v-if="getCurrentRankings().length === 0" class="text-center py-8 text-foreground/60">
                                No data available for this category
                            </div>

                            <div v-for="(member, index) in getSortedRankings().slice(0, displayLimit)" :key="member.id"
                                class="ranking-row">
                                <div class="grid grid-cols-12 gap-3 items-center">
                                    <!-- Rank -->
                                    <div class="col-span-1">
                                        <div class="flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold"
                                            :class="getRankBadgeClass(member.rank)">
                                            {{ member.rank }}
                                        </div>
                                    </div>

                                    <!-- Member Info -->
                                    <div class="col-span-4 flex items-center gap-3">
                                        <div
                                            class="h-8 w-8 rounded-full bg-gradient-to-br from-velaris-purple to-velaris-teal flex items-center justify-center text-white text-xs font-medium">
                                            {{ (member.name || 'Unknown').slice(0, 2).toUpperCase() }}
                                        </div>
                                        <div>
                                            <div class="text-sm font-medium">{{ member.name || 'Unknown' }}</div>
                                            <div class="text-xs text-foreground/60">{{ member.role || 'Member' }}</div>
                                        </div>
                                    </div>

                                    <!-- Main Stat -->
                                    <div class="col-span-3">
                                        <div class="text-sm font-medium">
                                            {{ formatStat(member, activeCategory) }}
                                        </div>
                                    </div>

                                    <!-- Change -->
                                    <div class="col-span-2">
                                        <div class="flex items-center gap-1">
                                            <component :is="member.change >= 0 ? TrendingUp : TrendingDown"
                                                :class="['h-3 w-3', member.change >= 0 ? 'text-velaris-green' : 'text-velaris-amber']" />
                                            <span class="text-xs"
                                                :class="member.change >= 0 ? 'text-velaris-green' : 'text-velaris-amber'">
                                                {{ member.change > 0 ? '+' : '' }}{{ member.change }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Score -->
                                    <div class="col-span-2">
                                        <div class="text-sm font-medium text-velaris-purple">
                                            {{ getScoreForCategory(member, activeCategory) }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Load More Button -->
                            <div v-if="getSortedRankings().length > displayLimit" class="text-center pt-4">
                                <button @click="loadMore" class="btn-soft-violet">
                                    <Plus class="h-4 w-4" />
                                    Load More ({{ getSortedRankings().length - displayLimit }} remaining)
                                </button>
                            </div>

                            <!-- Show All / Show Less Toggle -->
                            <div v-if="displayLimit > 15" class="text-center pt-2">
                                <button @click="resetDisplayLimit" class="text-sm text-velaris-purple hover:underline">
                                    Show Less
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    <!-- Top Performers -->
                    <div class="elev-card">
                        <h3 class="font-semibold text-velaris-purple mb-4">This Week's Heroes</h3>
                        <div v-if="weeklyHeroes.length === 0" class="text-sm text-foreground/60">
                            No heroes data available yet
                        </div>
                        <div class="space-y-3">
                            <div v-for="hero in weeklyHeroes" :key="hero.id" class="hero-card">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="h-10 w-10 rounded-lg bg-gradient-to-br from-velaris-amber to-velaris-purple flex items-center justify-center text-white font-bold text-sm">
                                        {{ (hero.name || 'Unknown').slice(0, 2).toUpperCase() }}
                                    </div>
                                    <div class="flex-1">
                                        <div class="text-sm font-medium">{{ hero.name }}</div>
                                        <div class="text-xs text-velaris-green">{{ hero.achievement }}</div>
                                    </div>
                                    <Award class="h-4 w-4 text-velaris-amber" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Performance Insights -->
                    <div class="elev-card">
                        <h3 class="font-semibold text-velaris-purple mb-4">Insights</h3>
                        <div v-if="insights.length === 0" class="text-sm text-foreground/60">
                            Loading insights...
                        </div>
                        <div class="space-y-3">
                            <div v-for="(insight, idx) in insights" :key="idx" class="insight-item">
                                <component :is="getInsightIcon(insight.icon)"
                                    :class="['h-4 w-4', `text-${insight.color}`]" />
                                <div class="text-xs">{{ insight.text }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Top Day Performers -->
                    <div v-if="activeCategory === 'gvg'" class="elev-card">
                        <h3 class="font-semibold text-velaris-purple mb-4">Best Day Specialists</h3>
                        <div class="space-y-2 text-xs">
                            <template v-for="(dayName, dayKey) in dayNames" :key="dayKey">
                                <div v-if="dayRankings[dayKey] && dayRankings[dayKey][0]"
                                    class="flex items-center justify-between">
                                    <span class="text-foreground/60">{{ dayName }}:</span>
                                    <span class="font-medium">{{ dayRankings[dayKey][0].name }}</span>
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- Quick Stats for Current Category -->
                    <div class="elev-card">
                        <h3 class="font-semibold text-velaris-purple mb-4">Quick Stats</h3>
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between">
                                <span class="text-foreground/60">Total Members:</span>
                                <span class="font-medium">{{ getCurrentRankings().length }}</span>
                            </div>
                            <div v-if="activeCategory === 'gvg' && gvgShowAverage" class="flex justify-between">
                                <span class="text-foreground/60">With GvG Data:</span>
                                <span class="font-medium">{{getCurrentRankings().filter(m => m.gvgCount > 0).length
                                }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-foreground/60">Showing:</span>
                                <span class="font-medium">{{ Math.min(displayLimit, getCurrentRankings().length)
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
    Trophy, Zap, Users, Activity, Filter, Download, TrendingUp, TrendingDown,
    Award, Target, Sword, Shield, Star, RefreshCw, AlertTriangle, Calendar,
    ChevronUp, ChevronDown, ChevronsUpDown, Plus
} from 'lucide-vue-next'
import { useRankingsStore } from '@/stores/useRankingsStore'

const rankingsStore = useRankingsStore()

const activeCategory = ref('power')
const showDayBreakdown = ref(false)
const selectedDay = ref('D1')
const hasData = ref(false)
const gvgShowAverage = ref(false)
const displayLimit = ref(15)

// Sorting state
const sortField = ref('rank')
const sortDirection = ref('asc') // 'asc' or 'desc'

const categories = ref([
    { key: 'power', label: 'Power', icon: Zap },
    { key: 'growth', label: 'Growth', icon: TrendingUp },
    { key: 'activity', label: 'Activity', icon: Activity },
    { key: 'gvg', label: 'GvG', icon: Sword },
    { key: 'contribution', label: 'Contribution', icon: Star }
])

const dayNames = {
    D1: 'Construction',
    D2: 'Research',
    D3: 'Rally',
    D4: 'Hero',
    D5: 'Training',
    D6: 'Combat'
}

// Computed properties from store
const isLoading = computed(() => rankingsStore.isLoading)
const loadError = computed(() => rankingsStore.loadError)
const lastFetchTime = computed(() => rankingsStore.lastFetchTime)
const weeklyHeroes = computed(() => rankingsStore.weeklyHeroes)
const insights = computed(() => rankingsStore.insights)
const guildStats = computed(() => rankingsStore.guildStats)
const dayRankings = computed(() => rankingsStore.dayRankings)

// Load data on mount
onMounted(async () => {
    try {
        await rankingsStore.loadRankingsData()
        hasData.value = true
    } catch (error) {
        console.error('Failed to load rankings:', error)
    }
})

// Handle refresh
async function handleRefresh() {
    try {
        await rankingsStore.forceRefresh()
    } catch (error) {
        console.error('Failed to refresh rankings:', error)
    }
}

// Category selection
function selectCategory(categoryKey) {
    activeCategory.value = categoryKey
    // Reset sorting when changing categories
    sortField.value = 'rank'
    sortDirection.value = 'asc'
    displayLimit.value = 15

    // Reset GvG toggle when leaving GvG category
    if (categoryKey !== 'gvg') {
        gvgShowAverage.value = false
    }
}

// Get current rankings based on selected category
function getCurrentRankings() {
    let rankings = []

    switch (activeCategory.value) {
        case 'power':
            rankings = rankingsStore.powerRanking
            break
        case 'growth':
            rankings = rankingsStore.growthRanking
            break
        case 'activity':
            rankings = rankingsStore.activityRanking
            break
        case 'gvg':
            rankings = gvgShowAverage.value
                ? rankingsStore.gvgAverageRanking
                : rankingsStore.gvgRanking
            break
        case 'contribution':
            rankings = rankingsStore.contributionRanking
            break
        default:
            rankings = []
    }

    return [...rankings] // Return a copy to avoid mutating store data
}

// Sorting functionality
function sortBy(field) {
    if (sortField.value === field) {
        // Toggle direction if same field
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        // New field, default to ascending
        sortField.value = field
        sortDirection.value = 'asc'
    }
}

function getSortIcon(field) {
    if (sortField.value !== field) {
        return ChevronsUpDown
    }
    return sortDirection.value === 'asc' ? ChevronUp : ChevronDown
}

function getSortedRankings() {
    const rankings = getCurrentRankings()

    if (!rankings.length) return []

    return rankings.sort((a, b) => {
        let aVal, bVal

        switch (sortField.value) {
            case 'rank':
                aVal = a.rank || 999
                bVal = b.rank || 999
                break
            case 'name':
                aVal = (a.name || '').toLowerCase()
                bVal = (b.name || '').toLowerCase()
                break
            case 'mainStat':
                aVal = getMainStatValue(a)
                bVal = getMainStatValue(b)
                break
            case 'change':
                aVal = a.change || 0
                bVal = b.change || 0
                break
            case 'score':
                aVal = getScoreValue(a)
                bVal = getScoreValue(b)
                break
            default:
                return 0
        }

        // Handle string vs number comparison
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            const comparison = aVal.localeCompare(bVal)
            return sortDirection.value === 'asc' ? comparison : -comparison
        }

        const comparison = aVal - bVal
        return sortDirection.value === 'asc' ? comparison : -comparison
    })
}

function getMainStatValue(member) {
    switch (activeCategory.value) {
        case 'power':
            return member.power || 0
        case 'growth':
            return member.powerGrowth || 0
        case 'activity':
            return member.activityScore || 0
        case 'gvg':
            return gvgShowAverage.value
                ? (member.gvgAvgScore || 0)
                : (member.totalGvGScore || 0)
        case 'contribution':
            return member.contributionScore || 0
        default:
            return 0
    }
}

function getScoreValue(member) {
    switch (activeCategory.value) {
        case 'power':
            return member.power || 0
        case 'growth':
            return parseFloat(member.powerGrowthPercent) || 0
        case 'activity':
            return member.activityScore || 0
        case 'gvg':
            return gvgShowAverage.value
                ? (member.gvgAvgScore || 0)
                : (member.totalGvGScore || 0)
        case 'contribution':
            return member.contributionScore || 0
        default:
            return 0
    }
}

// Load more functionality
function loadMore() {
    displayLimit.value += 15
}

function resetDisplayLimit() {
    displayLimit.value = 15
}

// Format stat based on category
function formatStat(member, category) {
    switch (category) {
        case 'power':
            return formatNumber(member.power || 0)
        case 'growth':
            return `+${formatNumber(member.powerGrowth || 0)} (${member.powerGrowthPercent || 0}%)`
        case 'activity':
            return `${member.activityScore || 0}% (${member.participationRate || 0}% rate)`
        case 'gvg':
            if (gvgShowAverage.value) {
                return `${formatNumber(member.gvgAvgScore || 0)} avg (${member.gvgCount || 0} events)`
            } else {
                return formatNumber(member.totalGvGScore || 0) + ' pts'
            }
        case 'contribution':
            return member.contributionScore || 0
        default:
            return '-'
    }
}

// Get score for category
function getScoreForCategory(member, category) {
    switch (category) {
        case 'power':
            return formatNumber(member.power || 0)
        case 'growth':
            return member.powerGrowthPercent ? `${member.powerGrowthPercent}%` : '0%'
        case 'activity':
            return member.activityScore || 0
        case 'gvg':
            if (gvgShowAverage.value) {
                return formatNumber(member.gvgAvgScore || 0)
            } else {
                return formatNumber(member.totalGvGScore || 0)
            }
        case 'contribution':
            return member.contributionScore || 0
        default:
            return 0
    }
}

function getRankingLabel(category) {
    const labels = {
        power: 'Power',
        growth: 'Growth',
        activity: 'Activity Score',
        gvg: gvgShowAverage.value ? 'GvG Average' : 'GvG Points',
        contribution: 'Contribution'
    }
    return labels[category] || 'Power'
}

function formatNumber(num) {
    return rankingsStore.formatNumber(num)
}

function getRankBadgeClass(rank) {
    if (rank === 1) return 'bg-velaris-amber text-white'
    if (rank === 2) return 'bg-velaris-teal text-white'
    if (rank === 3) return 'bg-velaris-purple text-white'
    return 'bg-foreground/10 text-foreground/70'
}

function getTimeAgo(timestamp) {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
}

function getInsightIcon(iconName) {
    const icons = {
        TrendingUp,
        Users,
        Target,
        Activity
    }
    return icons[iconName] || Activity
}

// Watch for GvG toggle changes to reset sorting
watch(gvgShowAverage, () => {
    sortField.value = 'rank'
    sortDirection.value = 'asc'
    displayLimit.value = 15
})
</script>