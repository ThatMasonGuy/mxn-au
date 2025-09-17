<!-- Enhanced Dashboard.vue - Guild Insights in Sidebar with Recent Activity Restored -->
<template>
    <div>
        <!-- Live Status Pills -->
        <div class="mb-6 flex flex-wrap items-center gap-3">
            <div
                class="inline-flex items-center gap-2 rounded-full bg-velaris-green/15 px-4 py-2 text-sm text-velaris-green">
                <span class="h-2 w-2 rounded-full bg-velaris-green animate-pulse"></span>
                {{ guildStats.currentMembers }} Active Members
            </div>
            <div
                class="inline-flex items-center gap-2 rounded-full bg-velaris-teal/15 px-4 py-2 text-sm text-velaris-teal">
                <Calendar class="h-4 w-4" />
                {{ activeEvents.length }} Active Events
            </div>
            <div v-if="nextEventTime"
                class="inline-flex items-center gap-2 rounded-full bg-velaris-amber/15 px-4 py-2 text-sm text-velaris-amber">
                <Clock class="h-4 w-4" />
                Next Event: {{ nextEventTime }}
            </div>
            <div v-if="guildStats.totalPower"
                class="inline-flex items-center gap-2 rounded-full bg-velaris-purple/15 px-4 py-2 text-sm text-velaris-purple">
                <Zap class="h-4 w-4" />
                {{ rankingsStore.formatNumber(guildStats.totalPower) }} Total Power
            </div>
        </div>

        <!-- KPI Cards with Rankings Store Data -->
        <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
            <!-- Total Members Card -->
            <div class="kpi-card bg-gradient-to-br from-velaris-teal/10 to-velaris-teal/5 border-velaris-teal/20">
                <div class="absolute inset-0 bg-gradient-to-br from-velaris-teal/5 to-transparent"></div>
                <div class="relative p-2 h-full flex flex-col">
                    <div class="flex items-center justify-between flex-1">
                        <div class="flex-1">
                            <div class="text-sm font-medium text-velaris-teal mb-1">Total Members</div>
                            <div class="text-2xl font-bold text-foreground mb-1">{{ guildStats.currentMembers }}</div>
                            <div class="text-xs text-foreground/60">{{ guildStats.totalMembers }} total (incl. left)
                            </div>
                        </div>
                        <div class="kpi-icon bg-velaris-teal/15">
                            <Users class="h-6 w-6 text-velaris-teal" />
                        </div>
                    </div>
                    <div v-if="memberGrowthTrend" class="mt-3 flex items-center gap-1">
                        <TrendingUp class="h-3 w-3 text-velaris-green" />
                        <span class="text-xs text-velaris-green font-medium">{{ memberGrowthTrend.value }}</span>
                        <span class="text-xs text-foreground/60">growth</span>
                    </div>
                </div>
            </div>

            <!-- Average Power Card -->
            <div class="kpi-card bg-gradient-to-br from-velaris-green/10 to-velaris-green/5 border-velaris-green/20">
                <div class="absolute inset-0 bg-gradient-to-br from-velaris-green/5 to-transparent"></div>
                <div class="relative p-2 h-full flex flex-col">
                    <div class="flex items-center justify-between flex-1">
                        <div class="flex-1">
                            <div class="text-sm font-medium text-velaris-green mb-1">Avg Power</div>
                            <div class="text-2xl font-bold text-foreground mb-1">{{
                                rankingsStore.formatNumber(guildStats.avgPower) }}</div>
                            <div class="text-xs text-foreground/60">{{ rankingsStore.formatNumber(topPower) }} highest
                            </div>
                        </div>
                        <div class="kpi-icon bg-velaris-green/15">
                            <Zap class="h-6 w-6 text-velaris-green" />
                        </div>
                    </div>
                    <div v-if="guildStats.growthPercent" class="mt-3 flex items-center gap-1">
                        <TrendingUp class="h-3 w-3 text-velaris-green" />
                        <span class="text-xs text-velaris-green font-medium">+{{ guildStats.growthPercent }}%</span>
                        <span class="text-xs text-foreground/60">growth</span>
                    </div>
                </div>
            </div>

            <!-- Event Participation Card - Now using store data -->
            <div class="kpi-card bg-gradient-to-br from-velaris-purple/10 to-velaris-purple/5 border-velaris-purple/20">
                <div class="absolute inset-0 bg-gradient-to-br from-velaris-purple/5 to-transparent"></div>
                <div class="relative p-2 h-full flex flex-col">
                    <div class="flex items-center justify-between flex-1">
                        <div class="flex-1">
                            <div class="text-sm font-medium text-velaris-purple mb-1">Guild Participation</div>
                            <div class="text-2xl font-bold text-foreground mb-1">{{ guildStats.participationRate }}%
                            </div>
                            <div class="text-xs text-foreground/60">Average across all members</div>
                        </div>
                        <div class="kpi-icon bg-velaris-purple/15">
                            <Trophy class="h-6 w-6 text-velaris-purple" />
                        </div>
                    </div>
                    <div v-if="participationTrend" class="mt-3 flex items-center gap-1">
                        <TrendingUp
                            :class="['h-3 w-3', guildStats.participationRate > 70 ? 'text-velaris-green' : 'text-velaris-amber']" />
                        <span
                            :class="['text-xs font-medium', guildStats.participationRate > 70 ? 'text-velaris-green' : 'text-velaris-amber']">{{
                                participationTrend.value }}</span>
                        <span class="text-xs text-foreground/60">engagement</span>
                    </div>
                </div>
            </div>

            <!-- Guild Activity Card - Using store data -->
            <div class="kpi-card bg-gradient-to-br from-velaris-amber/10 to-velaris-amber/5 border-velaris-amber/20">
                <div class="absolute inset-0 bg-gradient-to-br from-velaris-amber/5 to-transparent"></div>
                <div class="relative p-2 h-full flex flex-col">
                    <div class="flex items-center justify-between flex-1">
                        <div class="flex-1">
                            <div class="text-sm font-medium text-velaris-amber mb-1">Guild Activity</div>
                            <div class="text-2xl font-bold text-foreground mb-1">{{ guildStats.avgActivity }}</div>
                            <div class="text-xs text-foreground/60">{{ activityStatus }}</div>
                        </div>
                        <div class="kpi-icon bg-velaris-amber/15">
                            <Activity class="h-6 w-6 text-velaris-amber" />
                        </div>
                    </div>
                    <div v-if="activityTrend" class="mt-3 flex items-center gap-1">
                        <Activity
                            :class="['h-3 w-3', guildStats.avgActivity >= 70 ? 'text-velaris-green' : 'text-velaris-amber']" />
                        <span
                            :class="['text-xs font-medium', guildStats.avgActivity >= 70 ? 'text-velaris-green' : 'text-velaris-amber']">{{
                                activityTrend.value }}</span>
                        <span class="text-xs text-foreground/60">activity</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Content Grid -->
        <section class="grid gap-6 lg:grid-cols-3">
            <!-- Main Dashboard Content (2/3 width) -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Top Performers - Using Rankings Store -->
                <div class="elev-card">
                    <div class="mb-4 flex items-center justify-between">
                        <h3 class="font-semibold text-velaris-purple">Top Performers</h3>
                        <button @click="navigateTo('rankings')" class="btn-soft-violet text-sm">
                            <TrendingUp class="h-4 w-4" />
                            View All
                        </button>
                    </div>

                    <div v-if="topPerformers.length > 0" class="space-y-3">
                        <div v-for="(member, index) in topPerformers.slice(0, 5)" :key="member.id"
                            class="flex items-center justify-between p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors">
                            <div class="flex items-center gap-3">
                                <div class="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                    :class="getRankBadgeClass(index + 1)">
                                    {{ index + 1 }}
                                </div>
                                <div
                                    class="h-8 w-8 rounded-full bg-gradient-to-br from-velaris-purple to-velaris-teal flex items-center justify-center text-white text-xs font-medium">
                                    {{ (member.name || 'Unknown').slice(0, 2).toUpperCase() }}
                                </div>
                                <div>
                                    <div class="text-sm font-medium">{{ member.name }}</div>
                                    <div class="text-xs text-foreground/60">{{ member.role }}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-sm font-bold text-velaris-purple">{{
                                    rankingsStore.formatNumber(member.power) }}</div>
                                <div v-if="member.powerGrowthPercent > 0" class="text-xs text-velaris-green">+{{
                                    member.powerGrowthPercent }}%</div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-foreground/60">
                        <Trophy class="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No performance data available</p>
                    </div>
                </div>

                <!-- Weekly Heroes from Rankings Store -->
                <div v-if="weeklyHeroes.length > 0" class="elev-card">
                    <div class="mb-4 flex items-center justify-between">
                        <h3 class="font-semibold text-velaris-purple">Weekly Heroes</h3>
                        <button @click="navigateTo('rankings')" class="btn-soft-violet text-sm">
                            <Star class="h-4 w-4" />
                            View Rankings
                        </button>
                    </div>

                    <div class="grid gap-3 sm:grid-cols-2">
                        <div v-for="hero in weeklyHeroes" :key="hero.id"
                            class="p-3 rounded-lg border border-border/60 hover:border-velaris-purple/30 transition-colors">
                            <div class="flex items-center gap-3 mb-2">
                                <div
                                    class="h-8 w-8 rounded-full bg-gradient-to-br from-velaris-amber to-velaris-purple flex items-center justify-center text-white text-xs font-medium">
                                    {{ (hero.name || 'Unknown').slice(0, 2).toUpperCase() }}
                                </div>
                                <div>
                                    <div class="font-medium text-sm">{{ hero.name }}</div>
                                    <div class="text-xs text-velaris-purple">{{ hero.achievement }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity - Restored -->
                <div class="elev-card">
                    <div class="mb-4 flex items-center justify-between">
                        <h3 class="font-semibold text-velaris-purple">Recent Activity</h3>
                        <div class="flex items-center gap-2">
                            <button @click="refreshData" :disabled="isRefreshing" class="btn-soft-violet text-sm">
                                <RefreshCw :class="['h-4 w-4', { 'animate-spin': isRefreshing }]" />
                                Refresh
                            </button>
                            <button @click="navigateTo('events')" class="btn-soft-violet text-sm">
                                <Calendar class="h-4 w-4" />
                                View Events
                            </button>
                        </div>
                    </div>

                    <div v-if="recentActivity.length > 0" class="space-y-2">
                        <div v-for="activity in recentActivity" :key="activity.id"
                            class="flex items-center justify-between py-2 px-3 rounded hover:bg-foreground/5 transition-colors">
                            <div class="flex items-center gap-3">
                                <component :is="activity.icon" :class="['h-4 w-4', activity.color]" />
                                <span class="text-sm">{{ activity.message }}</span>
                            </div>
                            <span class="text-xs text-foreground/60">{{ activity.time }}</span>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-foreground/60">
                        <Activity class="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No recent activity</p>
                    </div>
                </div>

                <!-- Active Events Overview -->
                <div v-if="activeEvents.length > 0" class="elev-card">
                    <div class="mb-4 flex items-center justify-between">
                        <h3 class="font-semibold text-velaris-purple">Active Events</h3>
                        <button @click="navigateTo('events')" class="btn-soft-violet text-sm">
                            <ExternalLink class="h-4 w-4" />
                            Manage
                        </button>
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
                        <div v-for="event in activeEvents.slice(0, 4)" :key="event.id"
                            class="p-4 rounded-lg border border-border/60 hover:border-velaris-purple/30 transition-colors cursor-pointer"
                            @click="navigateTo('events')">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="h-8 w-8 rounded-lg flex items-center justify-center text-white"
                                    :class="getEventTypeGradient(event.type)">
                                    <component :is="getEventIcon(event.type)" class="h-4 w-4" />
                                </div>
                                <div>
                                    <div class="font-medium text-sm">{{ getEventDisplayName(event) }}</div>
                                    <div class="text-xs text-foreground/60">{{ event.type?.toUpperCase() }}</div>
                                </div>
                            </div>
                            <div class="space-y-1">
                                <div class="flex justify-between text-xs">
                                    <span class="text-foreground/70">Participants</span>
                                    <span class="font-medium">{{ event.memberIds?.length || 0 }}/{{
                                        guildStats.currentMembers }}</span>
                                </div>
                                <div class="w-full bg-border/60 rounded-full h-1.5">
                                    <div class="bg-gradient-to-r from-velaris-purple to-velaris-teal h-1.5 rounded-full transition-all"
                                        :style="{ width: `${Math.min(((event.memberIds?.length || 0) / guildStats.currentMembers) * 100, 100)}%` }">
                                    </div>
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
                    <h3 class="mb-4 font-semibold text-velaris-purple">Quick Actions</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <button @click="navigateTo('members')" class="tool-tile hover:border-velaris-purple/50">
                            <UserPlus class="h-4 w-4 text-velaris-purple" />
                            <div>
                                <div class="text-sm font-medium">Add Member</div>
                                <div class="text-xs text-foreground/70">Manage guild</div>
                            </div>
                        </button>
                        <button @click="navigateTo('events')" class="tool-tile hover:border-velaris-teal/50">
                            <Plus class="h-4 w-4 text-velaris-teal" />
                            <div>
                                <div class="text-sm font-medium">New Event</div>
                                <div class="text-xs text-foreground/70">Create & track</div>
                            </div>
                        </button>
                        <button @click="exportData" class="tool-tile hover:border-velaris-green/50">
                            <Download class="h-4 w-4 text-velaris-green" />
                            <div>
                                <div class="text-sm font-medium">Export Data</div>
                                <div class="text-xs text-foreground/70">All records</div>
                            </div>
                        </button>
                        <button @click="navigateTo('rankings')" class="tool-tile hover:border-velaris-amber/50">
                            <BarChart3 class="h-4 w-4 text-velaris-amber" />
                            <div>
                                <div class="text-sm font-medium">Rankings</div>
                                <div class="text-xs text-foreground/70">View stats</div>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Guild Insights - Moved from main content -->
                <div v-if="insights.length > 0" class="elev-card">
                    <div class="mb-4 flex items-center justify-between">
                        <h3 class="font-semibold text-velaris-purple">Guild Insights</h3>
                        <button @click="refreshData" :disabled="isRefreshing" class="btn-soft-violet text-sm">
                            <RefreshCw :class="['h-4 w-4', { 'animate-spin': isRefreshing }]" />
                        </button>
                    </div>

                    <div class="space-y-3">
                        <div v-for="(insight, index) in insights" :key="index"
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

                <!-- Guild Health -->
                <div class="elev-card">
                    <h3 class="mb-4 font-semibold text-velaris-purple">Guild Health</h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div
                                    :class="['h-2 w-2 rounded-full', guildStats.growthPercent > 0 ? 'bg-velaris-green' : 'bg-velaris-amber']">
                                </div>
                                <span class="text-sm text-foreground/70">Power Growth</span>
                            </div>
                            <span
                                :class="['text-sm font-medium', guildStats.growthPercent > 0 ? 'text-velaris-green' : 'text-velaris-amber']">
                                {{ guildStats.growthPercent > 0 ? `+${guildStats.growthPercent}%` : 'Stable' }}
                            </span>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div
                                    :class="['h-2 w-2 rounded-full', guildStats.participationRate > 70 ? 'bg-velaris-green' : guildStats.participationRate > 50 ? 'bg-velaris-amber' : 'bg-red-400']">
                                </div>
                                <span class="text-sm text-foreground/70">Participation</span>
                            </div>
                            <span
                                :class="['text-sm font-medium', guildStats.participationRate > 70 ? 'text-velaris-green' : guildStats.participationRate > 50 ? 'text-velaris-amber' : 'text-red-400']">
                                {{ guildStats.participationRate > 70 ? 'Excellent' : guildStats.participationRate > 50 ?
                                    'Good' : 'Needs Attention' }}
                            </span>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div
                                    :class="['h-2 w-2 rounded-full', guildStats.avgActivity >= 70 ? 'bg-velaris-green' : 'bg-velaris-amber']">
                                </div>
                                <span class="text-sm text-foreground/70">Activity Score</span>
                            </div>
                            <span
                                :class="['text-sm font-medium', guildStats.avgActivity >= 70 ? 'text-velaris-green' : 'text-velaris-amber']">
                                {{ guildStats.avgActivity }}/100
                            </span>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div
                                    :class="['h-2 w-2 rounded-full', rankingsStore.isLoading ? 'bg-velaris-amber animate-pulse' : 'bg-velaris-green']">
                                </div>
                                <span class="text-sm text-foreground/70">Data Status</span>
                            </div>
                            <span
                                :class="['text-sm font-medium', rankingsStore.isLoading ? 'text-velaris-amber' : 'text-velaris-green']">
                                {{ rankingsStore.isLoading ? 'Updating...' : 'Current' }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Recent Members - Restored -->
                <div class="elev-card">
                    <h3 class="mb-4 font-semibold text-velaris-purple">Recent Members</h3>
                    <div v-if="recentMembers.length > 0" class="space-y-2">
                        <div v-for="member in recentMembers.slice(0, 5)" :key="member.id"
                            class="flex items-center gap-3 p-2 rounded hover:bg-foreground/5 transition-colors cursor-pointer"
                            @click="navigateTo('members')">
                            <div
                                class="h-6 w-6 rounded-full bg-gradient-to-br from-velaris-purple to-velaris-teal flex items-center justify-center text-white text-xs font-medium">
                                {{ (member.name || 'Unknown').slice(0, 1).toUpperCase() }}
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="text-sm font-medium truncate">{{ member.name }}</div>
                                <div class="text-xs text-foreground/60">{{ member.role }} â€¢ {{
                                    formatTimeAgo(member.joinedAt) }}</div>
                            </div>
                            <component :is="getRoleIcon(member.role)" class="h-3 w-3"
                                :class="getRoleIconColor(member.role)" />
                        </div>
                    </div>
                    <div v-else class="text-center py-4 text-foreground/60">
                        <Users class="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p class="text-xs">No recent additions</p>
                    </div>
                </div>

                <!-- System Status -->
                <div class="elev-card">
                    <h3 class="mb-4 font-semibold text-velaris-purple">System Status</h3>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-foreground/70">Last Update:</span>
                            <span class="font-medium">{{ lastUpdateTime }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-foreground/70">Cache Status:</span>
                            <span
                                :class="['font-medium', rankingsStore.isCacheValid ? 'text-velaris-green' : 'text-velaris-amber']">
                                {{ rankingsStore.isCacheValid ? 'Valid' : 'Expired' }}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-foreground/70">Data Points:</span>
                            <span class="font-medium">{{ guildStats.totalMembers }} members</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-foreground/70">Version:</span>
                            <span class="font-medium">v2.1.0</span>
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
    Users, Trophy, Activity, Zap, Calendar, Clock, RefreshCw, TrendingUp,
    UserPlus, Plus, Download, BarChart3, ExternalLink, Star,
    Crown, Shield, Sword, Target, UserCheck
} from 'lucide-vue-next'
import { useEventCollection } from '@/composables/topheroes/admin/useEventCollection'
import { useMembers } from '@/composables/topheroes/admin/useMembers'
import { useRankingsStore } from '@/stores/useRankingsStore'

// Composables and stores
const { events, loadEvents, getActiveEvents, getUpcomingEvents } = useEventCollection()
const { members, loadMembers } = useMembers()
const rankingsStore = useRankingsStore()

// Reactive state
const isRefreshing = ref(false)

// Computed properties using rankings store data
const guildStats = computed(() => rankingsStore.guildStats || {})
const activeEvents = computed(() => getActiveEvents())
const topPerformers = computed(() => rankingsStore.powerRanking?.slice(0, 10) || [])
const weeklyHeroes = computed(() => rankingsStore.weeklyHeroes || [])
const insights = computed(() => rankingsStore.insights || [])

// Get top member power for the KPI display
const topPower = computed(() => {
    return topPerformers.value.length > 0 ? topPerformers.value[0].power : 0
})

// Activity status based on store data
const activityStatus = computed(() => {
    const score = guildStats.value.avgActivity || 0
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs improvement'
})

// Trends based on rankings store data
const memberGrowthTrend = computed(() => ({
    value: guildStats.value.growthPercent ? `+${guildStats.value.growthPercent}%` : 'Stable',
    color: guildStats.value.growthPercent > 0 ? 'green' : 'gray'
}))

const participationTrend = computed(() => ({
    value: guildStats.value.participationRate > 70 ? 'High' : 'Moderate',
    color: guildStats.value.participationRate > 70 ? 'green' : 'amber'
}))

const activityTrend = computed(() => ({
    value: guildStats.value.avgActivity >= 70 ? 'Strong' : 'Stable',
    color: guildStats.value.avgActivity >= 70 ? 'green' : 'amber'
}))

// Recent activity (enhanced with actual activity logs)
const recentActivity = computed(() => {
    const activities = []

    // Add recent events
    activeEvents.value.slice(0, 3).forEach(event => {
        activities.push({
            id: `event-${event.id}`,
            icon: Calendar,
            color: 'text-velaris-teal',
            message: `${getEventDisplayName(event)} is now active`,
            time: '2h ago'
        })
    })

    // Add member activities from rankings store members
    const recentMembersFromStore = rankingsStore.currentMembers
        .filter(m => m.joinedAt)
        .sort((a, b) => (b.joinedAt?.seconds || 0) - (a.joinedAt?.seconds || 0))
        .slice(0, 2)

    recentMembersFromStore.forEach(member => {
        activities.push({
            id: `member-${member.id}`,
            icon: Users,
            color: 'text-velaris-green',
            message: `${member.name} joined the guild`,
            time: formatTimeAgo(member.joinedAt)
        })
    })

    // Add performance milestones
    if (topPerformers.value.length > 0) {
        const topPlayer = topPerformers.value[0]
        if (topPlayer.powerGrowthPercent > 10) {
            activities.push({
                id: `growth-${topPlayer.id}`,
                icon: TrendingUp,
                color: 'text-velaris-purple',
                message: `${topPlayer.name} achieved +${topPlayer.powerGrowthPercent}% growth`,
                time: '1d ago'
            })
        }
    }

    return activities.slice(0, 6)
})

const recentMembers = computed(() => {
    // Use members from the store if available, otherwise fallback to members composable
    const membersList = rankingsStore.currentMembers.length > 0
        ? rankingsStore.currentMembers
        : members.value

    return membersList
        .filter(m => m.joinedAt && m.status === 'active')
        .sort((a, b) => (b.joinedAt?.seconds || 0) - (a.joinedAt?.seconds || 0))
        .slice(0, 5)
})

const nextEventTime = computed(() => {
    const upcoming = getUpcomingEvents()
    if (upcoming.length > 0) {
        return formatTimeAgo(upcoming[0].startDate)
    }
    return null
})

const lastUpdateTime = computed(() => {
    if (rankingsStore.lastFetchTime) {
        return new Date(rankingsStore.lastFetchTime).toLocaleTimeString('en-AU', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }
    return 'Never'
})

// Helper functions for insights
const getInsightIcon = (iconName) => {
    const icons = {
        'TrendingUp': TrendingUp,
        'Users': Users,
        'Target': Target,
        'Activity': Activity
    }
    return icons[iconName] || Activity
}

const getInsightIconBg = (color) => {
    const backgrounds = {
        'velaris-green': 'bg-velaris-green/15',
        'velaris-teal': 'bg-velaris-teal/15',
        'velaris-amber': 'bg-velaris-amber/15',
        'velaris-purple': 'bg-velaris-purple/15'
    }
    return backgrounds[color] || 'bg-foreground/10'
}

const getInsightIconColor = (color) => {
    const colors = {
        'velaris-green': 'text-velaris-green',
        'velaris-teal': 'text-velaris-teal',
        'velaris-amber': 'text-velaris-amber',
        'velaris-purple': 'text-velaris-purple'
    }
    return colors[color] || 'text-foreground/60'
}

// Event helpers
const getEventDisplayName = (event) => {
    if (event.event) return event.event
    if (event.name) return event.name
    return event.eventId || 'Unnamed Event'
}

const getEventTypeGradient = (type) => {
    const gradients = {
        'KvK': 'bg-gradient-to-br from-velaris-purple to-velaris-teal',
        'GvG': 'bg-gradient-to-br from-velaris-teal to-velaris-green',
        'GR': 'bg-gradient-to-br from-velaris-amber to-velaris-purple'
    }
    return gradients[type] || 'bg-gradient-to-br from-velaris-purple to-velaris-teal'
}

const getEventIcon = (type) => {
    const icons = {
        'KvK': Shield,
        'GvG': Sword,
        'GR': Trophy
    }
    return icons[type] || Target
}

// Helper functions
const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown'

    try {
        let date

        // Handle Firestore Timestamp objects
        if (timestamp.toDate && typeof timestamp.toDate === 'function') {
            date = timestamp.toDate()
        }
        // Handle timestamp objects with seconds property (Firestore format)
        else if (timestamp.seconds) {
            date = new Date(timestamp.seconds * 1000)
        }
        // Handle regular timestamp numbers
        else if (typeof timestamp === 'number') {
            // If it's in seconds (Unix timestamp), convert to milliseconds
            date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp)
        }
        // Handle Date objects or date strings
        else {
            date = new Date(timestamp)
        }

        // Validate the date
        if (isNaN(date.getTime())) {
            return 'Unknown'
        }

        const now = new Date()
        const diff = now - date

        // Handle future dates
        if (diff < 0) {
            return 'Future'
        }

        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)
        const weeks = Math.floor(diff / 604800000)
        const months = Math.floor(diff / 2629746000)

        if (minutes < 1) return 'just now'
        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        if (days < 7) return `${days}d ago`
        if (weeks < 4) return `${weeks}w ago`
        if (months < 12) return `${months}mo ago`

        const years = Math.floor(months / 12)
        return `${years}y ago`
    } catch (error) {
        console.warn('Error formatting timestamp:', timestamp, error)
        return 'Unknown'
    }
}

const getRankBadgeClass = (rank) => {
    if (rank === 1) return 'bg-velaris-amber'
    if (rank === 2) return 'bg-velaris-teal'
    if (rank === 3) return 'bg-velaris-purple'
    return 'bg-foreground/20'
}

const getRoleIcon = (role) => {
    const icons = {
        'R5': Crown,
        'R4': Shield,
        'R3': Star,
        'R2': Users,
        'R1': UserCheck
    }
    return icons[role] || UserCheck
}

const getRoleIconColor = (role) => {
    const colors = {
        'R5': 'text-yellow-400',
        'R4': 'text-purple-400',
        'R3': 'text-blue-400',
        'R2': 'text-green-400',
        'R1': 'text-slate-400'
    }
    return colors[role] || 'text-slate-400'
}

// Actions
const navigateTo = (view) => {
    // Emit event to parent to handle navigation
    console.log(`Navigate to: ${view}`)
}

const refreshData = async () => {
    isRefreshing.value = true
    try {
        await Promise.all([
            loadMembers(),
            loadEvents(),
            rankingsStore.forceRefresh()
        ])
    } catch (error) {
        console.error('Failed to refresh data:', error)
    } finally {
        isRefreshing.value = false
    }
}

const exportData = () => {
    // Implement data export functionality using rankings store data
    const data = {
        guildStats: guildStats.value,
        members: rankingsStore.currentMembers,
        rankings: {
            power: rankingsStore.powerRanking,
            growth: rankingsStore.growthRanking,
            activity: rankingsStore.activityRanking,
            gvg: rankingsStore.gvgRanking
        }
    }
    console.log('Export data:', data)
}

// Initialize data on mount
onMounted(async () => {
    try {
        await Promise.all([
            loadMembers(),
            loadEvents(),
            rankingsStore.loadRankingsData()
        ])
    } catch (error) {
        console.error('Failed to load dashboard data:', error)
    }
})
</script>

<style scoped>
/* KPI Card Styles for Consistent Sizing */
.kpi-card {
    @apply relative overflow-hidden rounded-xl border;
    min-height: 100px;
}

.kpi-icon {
    @apply h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0;
}
</style>