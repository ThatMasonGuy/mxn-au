<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans">
        <div class="container mx-auto px-4 py-8 max-w-7xl">

            <!-- Header -->
            <div class="text-center mb-12">
                <div class="inline-flex items-center space-x-3 mb-4">
                    <div class="p-3 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm">
                        <BarChart3 class="w-8 h-8 text-violet-400" />
                    </div>
                </div>
                <h1
                    class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent mb-4">
                    Translation Analytics
                </h1>
                <p class="text-white/70 text-lg max-w-2xl mx-auto">
                    Discover insights and see how our community is breaking down language
                    barriers worldwide.
                </p>
            </div>

            <!-- Quick Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatsCard :value="globalStats.formattedTranslations" label="Global Translations" icon="message-circle"
                    :gradient="['from-blue-600', 'to-cyan-500']" :bgGradient="['from-blue-600/20', 'to-cyan-500/20']" />

                <StatsCard :value="globalStats.formattedWords" label="Words Translated" icon="type"
                    :gradient="['from-emerald-600', 'to-teal-500']"
                    :bgGradient="['from-emerald-600/20', 'to-teal-500/20']" />

                <StatsCard :value="globalStats.formattedApiCost" label="Total API Cost" icon="dollar-sign"
                    :gradient="['from-green-600', 'to-emerald-500']"
                    :bgGradient="['from-green-600/20', 'to-emerald-500/20']" />

                <StatsCard :value="globalStats.cacheHitRate" label="Cache Efficiency" icon="zap"
                    :gradient="['from-yellow-600', 'to-orange-500']"
                    :bgGradient="['from-yellow-600/20', 'to-orange-500/20']" />
            </div>

            <!-- Personal Stats (if user is logged in) -->
            <div v-if="mainStore.user && userStats.totalTranslations" class="mb-12">
                <div class="flex items-center space-x-3 mb-6">
                    <div class="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <h2 class="text-2xl font-bold text-white">Your Personal Stats</h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <PersonalStatCard :value="userStats.totalTranslations" label="Your Translations" icon="user"
                        description="Total translations you've made" :gradient="['from-purple-600', 'to-pink-500']" />

                    <PersonalStatCard :value="userStats.formattedWords" label="Your Words" icon="edit"
                        description="Words you've translated" :gradient="['from-indigo-600', 'to-purple-500']" />

                    <PersonalStatCard :value="userStats.formattedSavings" label="Cost Saved" icon="dollar-sign"
                        description="Saved through caching" :gradient="['from-green-600', 'to-teal-500']" />
                </div>

                <!-- RESTORED: Personal Insights -->
                <InsightCard v-if="personalInsights.length > 0" :insights="personalInsights" />

            </div>

            <!-- Global Insights -->
            <div class="mb-12">
                <div class="flex items-center space-x-3 mb-6">
                    <div class="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                    <h2 class="text-2xl font-bold text-white">Global Insights</h2>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    <!-- Most Popular Languages -->
                    <div class="relative group flex">
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-500">
                        </div>
                        <div
                            class="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col">
                            <div class="flex items-center space-x-3 mb-6">
                                <div class="p-2 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl">
                                    <Languages class="w-6 h-6 text-violet-400" />
                                </div>
                                <h3 class="text-lg font-bold text-white">Most Popular Languages</h3>
                            </div>

                            <div class="space-y-4 flex-1">
                                <LanguageBar v-for="(lang, index) in topLanguages" :key="lang.code" :rank="index + 1"
                                    :language="lang.name" :flag="lang.flag" :percentage="lang.percentage"
                                    :count="lang.count" />
                            </div>
                        </div>
                    </div>

                    <!-- Live Activity -->
                    <div class="relative group flex">
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-500">
                        </div>
                        <div
                            class="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col">
                            <div class="flex items-center space-x-3 mb-6">
                                <div class="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
                                    <Zap class="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 class="text-lg font-bold text-white">Live Activity</h3>
                                <div class="ml-auto w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            </div>

                            <div class="space-y-4 flex-1">
                                <ActivityMetric label="Avg Response Time" :value="globalStats.avgResponseTime"
                                    icon="clock" />
                                <ActivityMetric label="Active Today" :value="globalStats.activeToday" icon="users" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Discord Statistics -->
            <div v-if="translateStore.hasDiscordData" class="mb-12">
                <div class="flex items-center space-x-3 mb-6">
                    <div class="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    <h2 class="text-2xl font-bold text-white">Discord Bot Statistics</h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard :value="discordStats.totalTranslations" label="Discord Translations"
                        icon="message-circle" :gradient="['from-indigo-600', 'to-purple-500']"
                        :bgGradient="['from-indigo-600/20', 'to-purple-500/20']" />

                    <StatsCard :value="discordStats.totalGuilds.toString()" label="Active Servers" icon="server"
                        :gradient="['from-purple-600', 'to-pink-500']"
                        :bgGradient="['from-purple-600/20', 'to-pink-500/20']" />

                    <StatsCard :value="discordStats.totalChannels.toString()" label="Active Channels" icon="hash"
                        :gradient="['from-cyan-600', 'to-blue-500']"
                        :bgGradient="['from-cyan-600/20', 'to-blue-500/20']" />

                    <StatsCard :value="discordStats.activeDiscordUsers.toString()" label="Discord Users" icon="users"
                        :gradient="['from-green-600', 'to-emerald-500']"
                        :bgGradient="['from-green-600/20', 'to-emerald-500/20']" />
                </div>

                <!-- Discord Detailed Stats -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

                    <!-- Top Discord Servers -->
                    <div class="relative group flex">
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-500">
                        </div>
                        <div
                            class="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col">
                            <div class="flex items-center space-x-3 mb-6">
                                <div class="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl">
                                    <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                                        </path>
                                    </svg>
                                </div>
                                <h3 class="text-lg font-bold text-white">Top Discord Servers</h3>
                            </div>
                            <div class="space-y-3 flex-1">
                                <DiscordGuildCard v-for="(guild, index) in translateStore.topDiscordGuilds" :key="guild.id"
                                    :guild="guild" :rank="index + 1" />
                                <div v-if="translateStore.topDiscordGuilds.length === 0" class="text-center text-white/50 py-8">
                                    No Discord servers data available
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Top Discord Channels -->
                    <div class="relative group flex">
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-500">
                        </div>
                        <div
                            class="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col">
                            <div class="flex items-center space-x-3 mb-6">
                                <div class="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                                    <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                                    </svg>
                                </div>
                                <h3 class="text-lg font-bold text-white">Top Discord Channels</h3>
                            </div>
                            <div class="space-y-3 flex-1">
                                <DiscordChannelCard v-for="(channel, index) in translateStore.topDiscordChannels" :key="channel.id"
                                    :channel="channel" :rank="index + 1" />
                                <div v-if="translateStore.topDiscordChannels.length === 0" class="text-center text-white/50 py-8">
                                    No Discord channels data available
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Top Discord Users -->
                    <div class="relative group flex">
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-500">
                        </div>
                        <div
                            class="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col">
                            <div class="flex items-center space-x-3 mb-6">
                                <div class="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                                    <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a3 3 0 11-6 0 3 3 0 016 0z">
                                        </path>
                                    </svg>
                                </div>
                                <h3 class="text-lg font-bold text-white">Top Discord Users</h3>
                            </div>
                            <div class="space-y-3 flex-1">
                                <DiscordUserCard v-for="(user, index) in translateStore.topDiscordUsers" :key="user.id" :user="user"
                                    :rank="index + 1" />
                                <div v-if="translateStore.topDiscordUsers.length === 0" class="text-center text-white/50 py-8">
                                    No Discord users data available
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RESTORED: Fun Facts -->
            <div class="mb-12">
                <div class="flex items-center space-x-3 mb-6">
                    <div class="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                    <h2 class="text-2xl font-bold text-white">Fun Facts</h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FunFactCard v-for="fact in funFacts" :key="fact.id" :title="fact.title"
                        :description="fact.description" :icon="fact.icon" :gradient="fact.gradient" />
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useTranslateStore } from '@/stores/useTranslateStore'
import { useMainStore } from '@/stores/useMainStore'
import { doc, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { BarChart3, Languages, Zap, Server, Hash, User, Edit, DollarSign, MessageCircle, Type, CheckCircle, Clock, Users, TrendingUp, Globe, Book, Leaf, Cpu, Award } from 'lucide-vue-next'

// Import child components
import StatsCard from '@/components/translate/stats/StatsCard.vue'
import PersonalStatCard from '@/components/translate/stats/PersonalStatCard.vue'
import InsightCard from '@/components/translate/stats/InsightCard.vue' // RESTORED
import LanguageBar from '@/components/translate/stats/LanguageBar.vue'
import ActivityMetric from '@/components/translate/stats/ActivityMetric.vue'
import FunFactCard from '@/components/translate/stats/FunFactCard.vue' // RESTORED
import DiscordGuildCard from '@/components/translate/stats/DiscordGuildCard.vue'
import DiscordChannelCard from '@/components/translate/stats/DiscordChannelCard.vue'
import DiscordUserCard from '@/components/translate/stats/DiscordUserCard.vue'

// Stores
const translateStore = useTranslateStore()
const mainStore = useMainStore()

// Local state for user-specific data
const userStatsMeta = ref(null)
const unsubscribeUserStats = ref(null)

// Computed properties pulling directly from the store
const globalStats = computed(() => {
    const stats = translateStore.appStats || {}
    const fresh = stats.freshTranslations || 0
    const cached = stats.cachedTranslations || 0
    const total = fresh + cached
    const cacheHitRate = total > 0 ? ((cached / total) * 100).toFixed(1) + '%' : '0%'

    return {
        formattedTranslations: stats.totalTranslations?.toLocaleString() || '0',
        formattedWords: stats.totalWords?.toLocaleString() || '0',
        formattedApiCost: translateStore.formattedApiCost,
        cacheHitRate: cacheHitRate,
        avgResponseTime: stats.totalResponseTime && stats.totalTranslations ? Math.round(stats.totalResponseTime / stats.totalTranslations) + 'ms' : 'N/A',
        activeToday: translateStore.activeToday?.toLocaleString() || '0',
    }
})

const userStats = computed(() => {
    const meta = userStatsMeta.value || {};
    const saved = meta.savedTokenUsage || {};
    const savedPrompt = saved.prompt || 0;
    const savedCompletion = saved.completion || 0;

    const GPT4O_INPUT_COST_PER_MILLION = 2.5
    const GPT4O_OUTPUT_COST_PER_MILLION = 10

    const savedInputCost = (savedPrompt / 1000000) * GPT4O_INPUT_COST_PER_MILLION
    const savedOutputCost = (savedCompletion / 1000000) * GPT4O_OUTPUT_COST_PER_MILLION
    const totalSavings = savedInputCost + savedOutputCost;

    return {
        totalTranslations: meta.totalTranslations?.toLocaleString() || '0',
        formattedWords: meta.totalWords?.toLocaleString() || '0',
        formattedSavings: `$${totalSavings.toFixed(4)}`,
    }
})

// RESTORED: Personal Insights computed property
const personalInsights = computed(() => {
    if (!mainStore.user || !userStatsMeta.value?.totalTranslations) return []

    const insights = []
    const translations = userStatsMeta.value.totalTranslations || 0
    const words = userStatsMeta.value.totalWords || 0

    if (translations > 50) {
        insights.push({
            title: "Translation Enthusiast! 🎯",
            description: `You've completed ${translations} translations. Keep up the great work!`
        })
    }

    if (words > 5000) {
        insights.push({
            title: "Word Wizard! 📚",
            description: `You've translated over ${words.toLocaleString()} words!`
        })
    }

    return insights
})


const topLanguages = computed(() => translateStore.topLanguages)
const discordStats = computed(() => translateStore.discordGlobalStats)
const topDiscordGuilds = computed(() => translateStore.topDiscordGuilds)

// RESTORED: Fun Facts computed property
const funFacts = computed(() => {
    const stats = translateStore.appStats || {}
    const totalChars = stats.totalChars || 0
    const totalWords = stats.totalWords || 0
    const totalTokens = stats.tokenUsage?.total || 0

    const facts = [
        {
            id: 1,
            title: "🌍 Global Reach",
            description: totalChars > 40075000
                ? `Characters translated could circle the Earth ${Math.floor(totalChars / 40075000)} times!`
                : `${totalChars.toLocaleString()} characters translated so far!`,
            icon: "globe",
            gradient: ['from-blue-500', 'to-cyan-500']
        },
        {
            id: 2,
            title: "📖 Library Scale",
            description: totalWords > 70000
                ? `We've translated enough words to fill ${Math.floor(totalWords / 70000)} average books!`
                : `${totalWords.toLocaleString()} words translated and counting!`,
            icon: "book",
            gradient: ['from-green-500', 'to-emerald-500']
        },
        {
            id: 3,
            title: "⚡ Lightning Fast",
            description: `Average translation takes just ${globalStats.value.avgResponseTime}!`,
            icon: "zap",
            gradient: ['from-yellow-500', 'to-orange-500']
        },
        {
            id: 4,
            title: "💚 Eco-Friendly",
            description: `Our ${globalStats.value.cacheHitRate} cache efficiency saves redundant API calls!`,
            icon: "leaf",
            gradient: ['from-green-500', 'to-teal-500']
        },
        {
            id: 5,
            title: "🤖 AI Powered",
            description: `Powered by ${totalTokens.toLocaleString()} AI tokens and counting!`,
            icon: "cpu",
            gradient: ['from-purple-500', 'to-pink-500']
        },
        {
            id: 6,
            title: "💎 Quality First",
            description: `Striving for the highest accuracy in every language.`,
            icon: "award",
            gradient: ['from-indigo-500', 'to-purple-500']
        }
    ]
    return facts
})


// --- Methods ---
const initializeUserStatsListener = (userId) => {
    if (unsubscribeUserStats.value) unsubscribeUserStats.value();

    try {
        const userStatsRef = doc(firestore, `users/${userId}/translations`, 'meta')
        unsubscribeUserStats.value = onSnapshot(userStatsRef, (doc) => {
            if (doc.exists()) {
                userStatsMeta.value = doc.data()
            } else {
                userStatsMeta.value = null;
            }
        })
    } catch (error) {
        console.error('Failed to initialize user stats listener:', error)
        userStatsMeta.value = null;
    }
}

// Watch for user login/logout to manage the personal stats listener
watch(() => mainStore.user, (newUser) => {
    if (newUser) {
        initializeUserStatsListener(newUser.uid);
    } else {
        if (unsubscribeUserStats.value) unsubscribeUserStats.value();
        userStatsMeta.value = null;
    }
}, { immediate: true });


// --- Lifecycle Hooks ---
onMounted(() => {
    // Initialize all global listeners from the store
    translateStore.initializeAllListeners()
})

onUnmounted(() => {
    // Cleanup all global listeners from the store
    translateStore.cleanupAllListeners()
    // Cleanup local user stats listener
    if (unsubscribeUserStats.value) {
        unsubscribeUserStats.value()
    }
})
</script>
