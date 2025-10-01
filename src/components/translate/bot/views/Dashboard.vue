<!-- views/Dashboard.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-semibold text-violet-400">Dashboard</h1>
                    <p class="text-sm text-foreground/70 mt-1">Overview of {{ store.selectedServer?.name }} bot
                        performance</p>
                </div>
                <div class="flex items-center gap-2">
                    <div class="flex items-center gap-2 px-3 py-2 bg-green-500/20 rounded-lg">
                        <div class="translate-status-online"></div>
                        <span class="text-sm text-green-400 font-medium">Bot Online</span>
                    </div>
                    <button @click="refreshData" :disabled="loading" class="translate-btn-secondary">
                        <RefreshCw :class="['h-4 w-4', { 'animate-spin': loading }]" />
                        Refresh
                    </button>
                </div>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
            <!-- Translations Today -->
            <div class="translate-card bg-gradient-to-br from-violet-600/10 to-violet-600/5 border-violet-600/20">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm font-medium text-violet-400 mb-1">Translations Today</div>
                        <div class="text-2xl font-bold text-foreground">{{ stats.translationsToday }}</div>
                        <div class="text-xs text-foreground/60">{{ stats.translationGrowth }}% from yesterday</div>
                    </div>
                    <div class="h-12 w-12 rounded-full bg-violet-500/15 flex items-center justify-center">
                        <Languages class="h-6 w-6 text-violet-400" />
                    </div>
                </div>
            </div>

            <!-- Active Users -->
            <div class="translate-card bg-gradient-to-br from-fuchsia-600/10 to-fuchsia-600/5 border-fuchsia-600/20">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm font-medium text-fuchsia-400 mb-1">Active Users</div>
                        <div class="text-2xl font-bold text-foreground">{{ stats.activeUsers }}</div>
                        <div class="text-xs text-foreground/60">Last 24 hours</div>
                    </div>
                    <div class="h-12 w-12 rounded-full bg-fuchsia-500/15 flex items-center justify-center">
                        <Users class="h-6 w-6 text-fuchsia-400" />
                    </div>
                </div>
            </div>

            <!-- Reaction Roles Used -->
            <div class="translate-card bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm font-medium text-cyan-400 mb-1">Reaction Roles</div>
                        <div class="text-2xl font-bold text-foreground">{{ stats.reactionRolesUsed }}</div>
                        <div class="text-xs text-foreground/60">{{ stats.reactionRoleMessages }} active messages</div>
                    </div>
                    <div class="h-12 w-12 rounded-full bg-cyan-500/15 flex items-center justify-center">
                        <UserCheck class="h-6 w-6 text-cyan-400" />
                    </div>
                </div>
            </div>

            <!-- Bot Uptime -->
            <div class="translate-card bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm font-medium text-green-400 mb-1">Uptime</div>
                        <div class="text-2xl font-bold text-foreground">{{ stats.uptime }}</div>
                        <div class="text-xs text-foreground/60">99.9% this month</div>
                    </div>
                    <div class="h-12 w-12 rounded-full bg-green-500/15 flex items-center justify-center">
                        <Activity class="h-6 w-6 text-green-400" />
                    </div>
                </div>
            </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
            <!-- Main Content (2/3 width) -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Recent Translation Activity -->
                <div class="translate-card">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-violet-400">Recent Translations</h3>
                        <button @click="navigateTo('translation')" class="translate-btn-secondary text-sm">
                            <Settings class="h-4 w-4" />
                            Configure
                        </button>
                    </div>

                    <div v-if="recentTranslations.length > 0" class="space-y-3">
                        <div v-for="translation in recentTranslations" :key="translation.id"
                            class="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <span :class="`fi fi-${translation.from}`" class="w-4 h-3 rounded shadow-sm"></span>
                                    <ArrowRight class="h-3 w-3 text-zinc-500" />
                                    <span :class="`fi fi-${translation.to}`" class="w-4 h-3 rounded shadow-sm"></span>
                                </div>
                                <div>
                                    <div class="text-sm font-medium">{{ translation.channel }}</div>
                                    <div class="text-xs text-foreground/60">by {{ translation.user }}</div>
                                </div>
                            </div>
                            <div class="text-xs text-foreground/60">{{ translation.time }}</div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-foreground/60">
                        <Languages class="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No recent translations</p>
                    </div>
                </div>

                <!-- Popular Language Pairs -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Popular Language Pairs</h3>
                    <div class="space-y-3">
                        <div v-for="pair in popularPairs" :key="pair.id" class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <span :class="`fi fi-${pair.from}`" class="w-5 h-4 rounded shadow-sm"></span>
                                    <ArrowRight class="h-3 w-3 text-zinc-500" />
                                    <span :class="`fi fi-${pair.to}`" class="w-5 h-4 rounded shadow-sm"></span>
                                </div>
                                <span class="text-sm">{{ pair.fromName }} → {{ pair.toName }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="text-sm font-medium">{{ pair.count }}</div>
                                <div class="w-16 bg-zinc-700 rounded-full h-2">
                                    <div class="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full"
                                        :style="{ width: `${pair.percentage}%` }"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar (1/3 width) -->
            <div class="space-y-6">
                <!-- Quick Actions -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Quick Actions</h3>
                    <div class="space-y-2">
                        <button @click="navigateTo('translation')"
                            class="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                            <Languages class="h-5 w-5 text-violet-400" />
                            <div>
                                <div class="text-sm font-medium">Translation Settings</div>
                                <div class="text-xs text-foreground/70">Configure languages & channels</div>
                            </div>
                        </button>

                        <button @click="navigateTo('reaction-roles')"
                            class="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                            <UserCheck class="h-5 w-5 text-fuchsia-400" />
                            <div>
                                <div class="text-sm font-medium">Reaction Roles</div>
                                <div class="text-xs text-foreground/70">Manage role assignments</div>
                            </div>
                        </button>

                        <button @click="navigateTo('analytics')"
                            class="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                            <BarChart3 class="h-5 w-5 text-cyan-400" />
                            <div>
                                <div class="text-sm font-medium">View Analytics</div>
                                <div class="text-xs text-foreground/70">Detailed usage statistics</div>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Bot Status -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Bot Health</h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="translate-status-online"></div>
                                <span class="text-sm text-foreground/70">Bot Status</span>
                            </div>
                            <span class="text-sm font-medium text-green-400">Online</span>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="h-2 w-2 rounded-full bg-green-400"></div>
                                <span class="text-sm text-foreground/70">API Status</span>
                            </div>
                            <span class="text-sm font-medium text-green-400">Operational</span>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="h-2 w-2 rounded-full bg-blue-400"></div>
                                <span class="text-sm text-foreground/70">Last Restart</span>
                            </div>
                            <span class="text-sm font-medium text-foreground/80">2 days ago</span>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="h-2 w-2 rounded-full bg-violet-400"></div>
                                <span class="text-sm text-foreground/70">Version</span>
                            </div>
                            <span class="text-sm font-medium text-foreground/80">v2.1.3</span>
                        </div>
                    </div>
                </div>

                <!-- Recent Errors -->
                <div class="translate-card" v-if="recentErrors.length > 0">
                    <h3 class="font-semibold text-red-400 mb-4">Recent Issues</h3>
                    <div class="space-y-2">
                        <div v-for="error in recentErrors" :key="error.id"
                            class="p-2 rounded bg-red-500/10 border border-red-500/20">
                            <div class="text-sm text-red-400">{{ error.message }}</div>
                            <div class="text-xs text-foreground/60">{{ error.time }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
    Languages, Users, UserCheck, Activity, RefreshCw, Settings,
    BarChart3, ArrowRight
} from 'lucide-vue-next'
import { useDiscordBotStore } from '@/stores/useDiscordBotStore'

const store = useDiscordBotStore()
const loading = ref(false)

// Mock stats - replace with real data
const stats = ref({
    translationsToday: 247,
    translationGrowth: 12,
    activeUsers: 89,
    reactionRolesUsed: 156,
    reactionRoleMessages: 8,
    uptime: '7d 14h'
})

const recentTranslations = ref([
    {
        id: 1,
        from: 'jp',
        to: 'us',
        channel: '#international',
        user: 'Akira',
        time: '2 min ago'
    },
    {
        id: 2,
        from: 'es',
        to: 'us',
        channel: '#general',
        user: 'Carlos',
        time: '5 min ago'
    },
    {
        id: 3,
        from: 'fr',
        to: 'de',
        channel: '#language-exchange',
        user: 'Marie',
        time: '8 min ago'
    }
])

const popularPairs = ref([
    {
        id: 1,
        from: 'jp',
        to: 'us',
        fromName: 'Japanese',
        toName: 'English',
        count: 1247,
        percentage: 85
    },
    {
        id: 2,
        from: 'es',
        to: 'us',
        fromName: 'Spanish',
        toName: 'English',
        count: 892,
        percentage: 60
    },
    {
        id: 3,
        from: 'fr',
        to: 'us',
        fromName: 'French',
        toName: 'English',
        count: 634,
        percentage: 43
    },
    {
        id: 4,
        from: 'de',
        to: 'us',
        fromName: 'German',
        toName: 'English',
        count: 421,
        percentage: 28
    }
])

const recentErrors = ref([
    // Add errors if any exist
])

const navigateTo = (view) => {
    // Emit to parent to handle navigation
    console.log(`Navigate to: ${view}`)
}

const refreshData = async () => {
    loading.value = true
    try {
        // Refresh dashboard data
        await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
        console.error('Failed to refresh dashboard:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    // Load dashboard data
})
</script>

<style scoped>
/* Flag icons */
.fi {
    display: inline-block;
    border-radius: 2px;
}
</style>