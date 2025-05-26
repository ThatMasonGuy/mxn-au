<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <!-- Animated background particles -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div
                class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse">
            </div>
            <div
                class="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000">
            </div>
            <div
                class="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500">
            </div>
        </div>

        <div class="relative max-w-7xl mx-auto px-4 py-8 space-y-8">
            <!-- Header Section -->
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1
                        class="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Usage Dashboard
                    </h1>
                    <p class="text-slate-400 mt-2 text-lg">Track your AI conversation costs in real-time</p>
                </div>

                <!-- Time Range Selector -->
                <div class="flex gap-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700/50">
                    <button v-for="timeframe in timeframes" :key="timeframe.value"
                        @click="selectedTimeframe = timeframe.value" :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                            selectedTimeframe === timeframe.value
                                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        ]">
                        {{ timeframe.label }}
                    </button>
                </div>
            </div>

            <!-- Stats Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Total Spent Card -->
                <div
                    class="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-xl">
                            <DollarSign class="w-6 h-6 text-cyan-400" />
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-cyan-400">${{ totalSpent.toFixed(4) }}</div>
                            <div class="text-sm text-slate-400">Total Spent</div>
                        </div>
                    </div>
                    <div class="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
                            :style="{ width: `${(totalSpent / 5) * 100}%` }"></div>
                    </div>
                    <div class="text-xs text-slate-400 mt-2">{{ ((totalSpent / 5) * 100).toFixed(1) }}% of $5.00 limit
                    </div>
                </div>

                <!-- Remaining Budget Card -->
                <div
                    class="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl">
                            <TrendingUp class="w-6 h-6 text-green-400" />
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-green-400">${{ remaining.toFixed(4) }}</div>
                            <div class="text-sm text-slate-400">Remaining</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000 ease-out"
                                :style="{ width: `${(remaining / 5) * 100}%` }"></div>
                        </div>
                    </div>
                    <div class="text-xs text-slate-400 mt-2">{{ ((remaining / 5) * 100).toFixed(1) }}% budget left</div>
                </div>

                <!-- Active Chats Card -->
                <div
                    class="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl">
                            <MessageSquare class="w-6 h-6 text-purple-400" />
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-purple-400">{{ perChat.length }}</div>
                            <div class="text-sm text-slate-400">Active Chats</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-slate-400">
                        <Activity class="w-3 h-3" />
                        <span>{{perChat.filter(chat => chat.status === 'active').length}} currently active</span>
                    </div>
                </div>

                <!-- Average Cost Card -->
                <div
                    class="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl">
                            <BarChart3 class="w-6 h-6 text-orange-400" />
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-orange-400">${{ averageCostPerChat.toFixed(4) }}</div>
                            <div class="text-sm text-slate-400">Avg/Chat</div>
                        </div>
                    </div>
                    <div class="text-xs text-slate-400">Based on {{ perChat.length }} conversations</div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Chat List - Takes 2 columns -->
                <div class="lg:col-span-2">
                    <div
                        class="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                        <!-- Header -->
                        <div class="flex items-center justify-between p-6 border-b border-slate-700/50">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg">
                                    <MessageSquare class="w-5 h-5 text-cyan-400" />
                                </div>
                                <h2 class="text-xl font-semibold">Conversation History</h2>
                            </div>
                            <button @click="showDetails = !showDetails"
                                class="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors">
                                <component :is="showDetails ? EyeOff : Eye" class="w-4 h-4" />
                                <span class="text-sm">{{ showDetails ? 'Hide' : 'Show' }} Details</span>
                            </button>
                        </div>

                        <!-- Chat List -->
                        <div class="divide-y divide-slate-700/30">
                            <div v-for="(chat, index) in perChat" :key="chat.chatId"
                                class="group p-6 hover:bg-slate-800/40 transition-all duration-300 cursor-pointer"
                                :style="{ animationDelay: `${index * 100}ms` }">
                                <div class="flex items-start gap-4">
                                    <!-- Chat Avatar/Icon -->
                                    <div
                                        class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <MessageSquare class="w-6 h-6 text-cyan-400" />
                                    </div>

                                    <!-- Chat Content -->
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-start justify-between gap-4">
                                            <div class="flex-1">
                                                <h3
                                                    class="font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                                                    {{ chat.chatName }}
                                                </h3>
                                                <p v-if="showDetails && chat.lastMessage"
                                                    class="text-sm text-slate-400 mt-1 line-clamp-2">
                                                    {{ truncateMessage(chat.lastMessage) }}
                                                </p>
                                                <div class="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                                    <div class="flex items-center gap-1">
                                                        <Clock class="w-3 h-3" />
                                                        <span>{{ formatTime(chat.lastMessageTime) }}</span>
                                                    </div>
                                                    <div class="flex items-center gap-1">
                                                        <Activity class="w-3 h-3" />
                                                        <span class="capitalize">{{ chat.status }}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Cost and Stats -->
                                            <div class="flex-shrink-0 text-right">
                                                <div class="text-lg font-bold text-cyan-400">
                                                    ${{ chat.cost.toFixed(4) }}
                                                </div>
                                                <div v-if="showDetails" class="text-xs text-slate-400 mt-1 space-y-1">
                                                    <div>{{ formatNumber(chat.input) }} in</div>
                                                    <div>{{ formatNumber(chat.output) }} out</div>
                                                    <div class="text-purple-400">{{ formatNumber(chat.total) }}
                                                        total</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats Sidebar -->
                <div class="space-y-6">
                    <!-- Usage Breakdown -->
                    <div
                        class="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Zap class="w-5 h-5 text-yellow-400" />
                            Usage Breakdown
                        </h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-slate-400">Input Tokens</span>
                                <span class="font-mono text-cyan-400">{{ formatNumber(totalInputTokens) }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-slate-400">Output Tokens</span>
                                <span class="font-mono text-purple-400">{{ formatNumber(totalOutputTokens) }}</span>
                            </div>
                            <div class="flex items-center justify-between border-t border-slate-700/50 pt-2">
                                <span class="text-white font-medium">Total Tokens</span>
                                <span class="font-mono text-green-400 font-bold">{{ formatNumber(totalTokens) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Top Performer -->
                    <div
                        class="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp class="w-5 h-5 text-green-400" />
                            Most Active Chat
                        </h3>
                        <div v-if="topChat" class="space-y-3">
                            <div class="p-3 bg-slate-700/30 rounded-lg">
                                <h4 class="font-medium text-white truncate">{{ topChat.chatName }}</h4>
                                <div class="flex justify-between items-center mt-2">
                                    <span class="text-sm text-slate-400">Cost</span>
                                    <span class="text-cyan-400 font-mono">${{ topChat.cost.toFixed(4) }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-slate-400">Tokens</span>
                                    <span class="text-purple-400 font-mono">{{ formatNumber(topChat.total)
                                        }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div
                        class="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                        <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
                        <div class="space-y-3">
                            <button
                                class="w-full px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 rounded-lg border border-cyan-500/30 text-cyan-400 font-medium transition-all duration-300 hover:shadow-lg">
                                Export Usage Data
                            </button>
                            <button
                                class="w-full px-4 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 rounded-lg border border-green-500/30 text-green-400 font-medium transition-all duration-300 hover:shadow-lg">
                                Set Budget Alert
                            </button>
                            <button
                                class="w-full px-4 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 rounded-lg border border-orange-500/30 text-orange-400 font-medium transition-all duration-300 hover:shadow-lg">
                                View Analytics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useMainStore } from '@/stores/useMainStore'
import { getUsageSummary } from '@/composables/useUsageDashboard'
import {
  TrendingUp, MessageSquare, DollarSign, Clock,
  Zap, Activity, BarChart3, Eye, EyeOff
} from 'lucide-vue-next'

const mainStore = useMainStore()

const totalSpent = ref(0)
const remaining = ref(5)
const perChat = ref([])
const showDetails = ref(true)
const selectedTimeframe = ref('7d')

const timeframes = [
  { label: '24h', value: '1d' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: 'All', value: 'all' }
]

// Use correct field names: input / output
const averageCostPerChat = computed(() =>
  perChat.value.length > 0 ? totalSpent.value / perChat.value.length : 0
)

const totalInputTokens = computed(() =>
  perChat.value.reduce((sum, chat) => sum + (chat.input || 0), 0)
)

const totalOutputTokens = computed(() =>
  perChat.value.reduce((sum, chat) => sum + (chat.output || 0), 0)
)

const totalTokens = computed(() =>
  totalInputTokens.value + totalOutputTokens.value
)

const topChat = computed(() =>
  perChat.value.reduce((top, chat) =>
    (!top || chat.cost > top.cost) ? chat : top, null
  )
)

const truncateMessage = (message) => {
  return message.length > 120 ? message.substring(0, 120) + '...' : message
}

const formatNumber = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return Number(num).toLocaleString(undefined, { maximumFractionDigits: 2 })
}

const formatTime = (rawTime) => {
  let date

  if (!rawTime) return '—'

  if (typeof rawTime.toDate === 'function') {
    date = rawTime.toDate() // Firestore Timestamp
  } else if (typeof rawTime === 'string' || typeof rawTime === 'number') {
    date = new Date(rawTime)
  } else if (rawTime instanceof Date) {
    date = rawTime
  } else {
    return 'Invalid date'
  }

  const now = new Date()
  const diff = now - date
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))

  if (isNaN(diff)) return 'Invalid date'
  if (hours > 24) return date.toLocaleDateString()
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

onMounted(async () => {
  const { totalSpent: spent, remaining: rem, perChat: chats } =
    await getUsageSummary(mainStore.user.uid)

  totalSpent.value = spent
  remaining.value = rem
  perChat.value = chats
})

watchEffect(async () => {
  const { totalSpent: spent, remaining: rem, perChat: chats } =
    await getUsageSummary(mainStore.user.uid, selectedTimeframe.value)

  totalSpent.value = spent
  remaining.value = rem
  perChat.value = chats
})

</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: rgb(51 65 85 / 0.3);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: rgb(148 163 184 / 0.5);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgb(148 163 184 / 0.7);
}

/* Animation for cards */
@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.group {
    animation: slideInUp 0.6s ease-out forwards;
}
</style>