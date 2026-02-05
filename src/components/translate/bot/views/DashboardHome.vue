<template>
    <div class="space-y-6">
        <!-- Welcome Header -->
        <div>
            <h2 class="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
            <p class="text-zinc-400">Here's what's happening with your translation bot</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-24">
            <div class="text-center">
                <Loader2 class="h-12 w-12 text-violet-400 animate-spin mx-auto mb-4" />
                <p class="text-zinc-300 font-semibold">Loading dashboard...</p>
            </div>
        </div>

        <!-- Dashboard Content -->
        <div v-else class="space-y-6">
            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Channels Card -->
                <div class="relative group">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-violet-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                    <div class="relative p-6 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl">
                        <div class="flex items-start justify-between mb-4">
                            <div class="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                                <Hash class="h-6 w-6 text-violet-400" />
                            </div>
                        </div>
                        <div class="text-3xl font-bold text-white mb-1">
                            {{ formatNumber(stats.channels.total) }}
                        </div>
                        <div class="text-sm text-zinc-400 mb-2">Channels Tracked</div>
                        <div v-if="stats.channels.mostActive" class="text-xs text-zinc-500 flex items-center gap-1">
                            <TrendingUp class="h-3 w-3 text-green-400" />
                            <span>Most active: <span class="text-zinc-300">#{{ stats.channels.mostActive }}</span></span>
                        </div>
                        <div v-else class="text-xs text-zinc-600">Includes threads & archived</div>
                    </div>
                </div>

                <!-- Messages Card -->
                <div class="relative group">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                    <div class="relative p-6 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl">
                        <div class="flex items-start justify-between mb-4">
                            <div class="p-3 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl">
                                <MessageSquare class="h-6 w-6 text-fuchsia-400" />
                            </div>
                        </div>
                        <div class="text-3xl font-bold text-white mb-1">
                            {{ formatNumber(stats.messages.total) }}
                        </div>
                        <div class="text-sm text-zinc-400 mb-2">Total Messages</div>
                        <div class="text-xs text-zinc-500 flex items-center gap-1">
                            <Calendar class="h-3 w-3 text-fuchsia-400" />
                            <span><span class="text-zinc-300">{{ formatNumber(stats.messages.lastWeek) }}</span> this week</span>
                        </div>
                    </div>
                </div>

                <!-- Users Card -->
                <div class="relative group">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-violet-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                    <div class="relative p-6 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl">
                        <div class="flex items-start justify-between mb-4">
                            <div class="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                                <Users class="h-6 w-6 text-violet-400" />
                            </div>
                        </div>
                        <div class="text-3xl font-bold text-white mb-1">
                            {{ formatNumber(stats.users.total) }}
                        </div>
                        <div class="text-sm text-zinc-400 mb-2">Users Tracked</div>
                        <div class="text-xs text-zinc-500 flex items-center gap-1">
                            <Activity class="h-3 w-3 text-green-400" />
                            <span><span class="text-zinc-300">{{ formatNumber(stats.users.activeLastWeek) }}</span> active this week</span>
                        </div>
                    </div>
                </div>

                <!-- Translations Card -->
                <div class="relative group">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                    <div class="relative p-6 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl">
                        <div class="flex items-start justify-between mb-4">
                            <div class="p-3 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl">
                                <Languages class="h-6 w-6 text-fuchsia-400" />
                            </div>
                        </div>
                        <div class="text-3xl font-bold text-white mb-1">
                            {{ formatNumber(stats.translations.total) }}
                        </div>
                        <div class="text-sm text-zinc-400 mb-2">Translations</div>
                        <div class="text-xs text-zinc-500 flex items-center gap-1">
                            <Calendar class="h-3 w-3 text-fuchsia-400" />
                            <span><span class="text-zinc-300">{{ formatNumber(stats.translations.lastWeek) }}</span> this week</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Activity & Quick Actions Row -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Activity Summary -->
                <div class="lg:col-span-2 p-6 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl backdrop-blur">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-white flex items-center gap-2">
                            <Activity class="h-5 w-5 text-violet-400" />
                            Activity Summary
                        </h3>
                    </div>

                    <div v-if="stats.messages.total === 0" class="text-center py-12">
                        <div class="inline-flex p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl mb-4">
                            <MessageSquare class="h-12 w-12 text-zinc-600" />
                        </div>
                        <p class="text-zinc-500">No activity recorded yet</p>
                        <p class="text-sm text-zinc-600 mt-1">Messages will appear once the bot starts tracking</p>
                    </div>

                    <div v-else class="space-y-4">
                        <!-- Messages Summary -->
                        <div class="p-4 bg-zinc-900/50 border border-zinc-700/30 rounded-xl">
                            <div class="flex items-center gap-4">
                                <div class="p-2 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg">
                                    <MessageSquare class="h-5 w-5 text-fuchsia-400" />
                                </div>
                                <div class="flex-1">
                                    <p class="text-white font-medium">{{ formatNumber(stats.messages.total) }} messages tracked</p>
                                    <p class="text-sm text-zinc-500">
                                        {{ formatNumber(stats.messages.lastWeek) }} in the last 7 days
                                        <span v-if="stats.channels.mostActive" class="text-zinc-400">
                                            • Most active: #{{ stats.channels.mostActive }}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Translations Summary -->
                        <div class="p-4 bg-zinc-900/50 border border-zinc-700/30 rounded-xl">
                            <div class="flex items-center gap-4">
                                <div class="p-2 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                                    <Languages class="h-5 w-5 text-violet-400" />
                                </div>
                                <div class="flex-1">
                                    <p class="text-white font-medium">{{ formatNumber(stats.translations.total) }} translations</p>
                                    <p class="text-sm text-zinc-500">
                                        {{ stats.translations.languagesUsed || 0 }} languages used
                                        <span v-if="stats.translations.topLanguage" class="text-zinc-400">
                                            • Top: {{ getLanguageName(stats.translations.topLanguage) }}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Users Summary -->
                        <div class="p-4 bg-zinc-900/50 border border-zinc-700/30 rounded-xl">
                            <div class="flex items-center gap-4">
                                <div class="p-2 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg">
                                    <Users class="h-5 w-5 text-fuchsia-400" />
                                </div>
                                <div class="flex-1">
                                    <p class="text-white font-medium">{{ formatNumber(stats.users.total) }} unique users</p>
                                    <p class="text-sm text-zinc-500">
                                        {{ formatNumber(stats.users.activeLastWeek) }} active this week
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="p-6 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl backdrop-blur">
                    <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Zap class="h-5 w-5 text-fuchsia-400" />
                        Quick Actions
                    </h3>

                    <div class="space-y-3">
                        <button @click="$emit('navigate', 'auto-translate')"
                            class="w-full p-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-700/50 rounded-xl text-left transition-all group">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-violet-500/10 border border-violet-500/20 rounded-lg group-hover:scale-110 transition-transform">
                                    <Languages class="h-5 w-5 text-violet-400" />
                                </div>
                                <div class="flex-1">
                                    <p class="font-semibold text-white">Auto-Translate</p>
                                    <p class="text-xs text-zinc-500">{{ stats.autoTranslate?.activePairs || 0 }} channel pairs</p>
                                </div>
                                <ChevronRight class="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                            </div>
                        </button>

                        <button @click="$emit('navigate', 'announcements')"
                            class="w-full p-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-700/50 rounded-xl text-left transition-all group">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg group-hover:scale-110 transition-transform">
                                    <Megaphone class="h-5 w-5 text-fuchsia-400" />
                                </div>
                                <div class="flex-1">
                                    <p class="font-semibold text-white">Redirects</p>
                                    <p class="text-xs text-zinc-500">{{ stats.announcements?.routes || 0 }} protected channels</p>
                                </div>
                                <ChevronRight class="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                            </div>
                        </button>

                        <button @click="$emit('navigate', 'restrictions')"
                            class="w-full p-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-700/50 rounded-xl text-left transition-all group">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-red-500/10 border border-red-500/20 rounded-lg group-hover:scale-110 transition-transform">
                                    <Ban class="h-5 w-5 text-red-400" />
                                </div>
                                <div class="flex-1">
                                    <p class="font-semibold text-white">Restrictions</p>
                                    <p class="text-xs text-zinc-500">{{ stats.restrictions?.blockedChannels || 0 }} blocked channels</p>
                                </div>
                                <ChevronRight class="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                            </div>
                        </button>

                        <button @click="$emit('navigate', 'general')"
                            class="w-full p-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-700/50 rounded-xl text-left transition-all group">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-violet-500/10 border border-violet-500/20 rounded-lg group-hover:scale-110 transition-transform">
                                    <Settings class="h-5 w-5 text-violet-400" />
                                </div>
                                <div class="flex-1">
                                    <p class="font-semibold text-white">Settings</p>
                                    <p class="text-xs text-zinc-500">Configure bot behavior</p>
                                </div>
                                <ChevronRight class="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                            </div>
                        </button>

                        <button @click="$emit('navigate', 'calendar')"
                            class="w-full p-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-700/50 rounded-xl text-left transition-all group">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg group-hover:scale-110 transition-transform">
                                    <Calendar class="h-5 w-5 text-amber-400" />
                                </div>
                                <div class="flex-1">
                                    <p class="font-semibold text-white">Calendar</p>
                                    <p class="text-xs text-zinc-500">Scheduled messages & pings</p>
                                </div>
                                <ChevronRight class="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Configuration Status -->
            <div class="p-6 bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 border border-violet-500/20 rounded-2xl backdrop-blur">
                <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle class="h-5 w-5 text-green-400" />
                    Configuration Overview
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="p-4 bg-zinc-900/30 border border-zinc-700/30 rounded-xl">
                        <div class="flex items-center gap-3">
                            <div :class="[
                                'h-3 w-3 rounded-full',
                                config?.general?.enabled !== false ? 'bg-green-400' : 'bg-red-400'
                            ]"></div>
                            <span class="text-zinc-300">Translation</span>
                        </div>
                        <p class="text-xs text-zinc-500 mt-1">{{ config?.general?.enabled !== false ? 'Enabled' : 'Disabled' }}</p>
                    </div>

                    <div class="p-4 bg-zinc-900/30 border border-zinc-700/30 rounded-xl">
                        <div class="flex items-center gap-3">
                            <div :class="[
                                'h-3 w-3 rounded-full',
                                (stats.autoTranslate?.activePairs || 0) > 0 ? 'bg-green-400' : 'bg-zinc-500'
                            ]"></div>
                            <span class="text-zinc-300">Auto-Translate</span>
                        </div>
                        <p class="text-xs text-zinc-500 mt-1">{{ stats.autoTranslate?.activePairs || 0 }} active pairs</p>
                    </div>

                    <div class="p-4 bg-zinc-900/30 border border-zinc-700/30 rounded-xl">
                        <div class="flex items-center gap-3">
                            <div :class="[
                                'h-3 w-3 rounded-full',
                                (stats.announcements?.routes || 0) > 0 ? 'bg-green-400' : 'bg-zinc-500'
                            ]"></div>
                            <span class="text-zinc-300">Redirects</span>
                        </div>
                        <p class="text-xs text-zinc-500 mt-1">{{ stats.announcements?.routes || 0 }} protected</p>
                    </div>

                    <div class="p-4 bg-zinc-900/30 border border-zinc-700/30 rounded-xl">
                        <div class="flex items-center gap-3">
                            <div :class="[
                                'h-3 w-3 rounded-full',
                                (stats.restrictions?.blockedChannels || 0) > 0 ? 'bg-amber-400' : 'bg-zinc-500'
                            ]"></div>
                            <span class="text-zinc-300">Restrictions</span>
                        </div>
                        <p class="text-xs text-zinc-500 mt-1">{{ stats.restrictions?.blockedChannels || 0 }} blocked</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTranslateStore } from '@/stores/useTranslateBotStore'
import {
    Languages,
    Hash,
    MessageSquare,
    Users,
    Activity,
    Zap,
    ChevronRight,
    Megaphone,
    Settings,
    CheckCircle,
    TrendingUp,
    Calendar,
    Loader2,
    Ban
} from 'lucide-vue-next'

const props = defineProps({
    serverId: String,
    config: Object,
    initialStats: Object
})

defineEmits(['navigate'])

const store = useTranslateStore()
const loading = ref(true)

const stats = ref({
    channels: { total: 0, mostActive: null, mostActiveCount: 0 },
    messages: { total: 0, lastWeek: 0 },
    users: { current: 0, total: 0, activeLastWeek: 0 },
    translations: { total: 0, lastWeek: 0, languagesUsed: 0, topLanguage: null },
    autoTranslate: { pairs: 0, activePairs: 0 },
    announcements: { routes: 0 },
    restrictions: { blockedChannels: 0 }
})

const languageNames = {
    en: 'English', es: 'Spanish', fr: 'French', de: 'German',
    it: 'Italian', pt: 'Portuguese', ru: 'Russian', ja: 'Japanese',
    ko: 'Korean', zh: 'Chinese', ar: 'Arabic', hi: 'Hindi',
    nl: 'Dutch', pl: 'Polish', tr: 'Turkish', vi: 'Vietnamese'
}

function getLanguageName(code) {
    return languageNames[code] || code?.toUpperCase() || 'Unknown'
}

function formatNumber(num) {
    if (num === null || num === undefined) return '0'
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
    }
    return num.toLocaleString()
}

async function loadStats() {
    if (!props.serverId) {
        loading.value = false
        return
    }

    // Use initial stats if provided
    if (props.initialStats && props.initialStats.channels) {
        stats.value = props.initialStats
        loading.value = false
        return
    }

    loading.value = true
    try {
        const response = await store.fetchServerStats(props.serverId)
        stats.value = response
    } catch (error) {
        console.error('Failed to load stats:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadStats()
})

watch(() => props.serverId, () => {
    loadStats()
})

watch(() => props.initialStats, (newStats) => {
    if (newStats && newStats.channels) {
        stats.value = newStats
        loading.value = false
    }
}, { deep: true })
</script>