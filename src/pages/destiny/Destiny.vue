<template>
    <div
        class="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-gray-900 flex flex-col items-center px-4 pt-12 pb-4">
        <div class="w-full max-w-6xl">
            <!-- Header -->
            <div class="text-center mb-10">
                <div class="relative inline-block">
                    <h1 class="text-4xl md:text-5xl font-bold text-white mb-3 relative">
                        <span class="text-violet-400 font-black">Challenge Optimizer</span>
                        <div
                            class="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-60">
                        </div>
                    </h1>
                </div>

                <p class="text-lg text-gray-300 mb-2 max-w-2xl mx-auto">
                    Pull your real progress, min-max your season, and never miss a reward.
                </p>
            </div>

            <!-- Bungie Connect -->
            <div v-if="!bungieLinked" class="flex flex-col items-center">
                <div
                    class="bg-black/30 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-purple-500/10 max-w-lg w-full">

                    <!-- TOKEN EXPIRED -->
                    <template v-if="tokenExpired">
                        <div class="flex flex-col items-center text-center">

                            <!-- Alert Icon with animated pulse -->
                            <div
                                class="relative w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-orange-500/25">
                                <AlertTriangle class="w-12 h-12 text-white" />
                                <div
                                    class="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20">
                                </div>
                            </div>

                            <h3 class="text-2xl font-bold text-white mb-3">Session Expired</h3>
                            <p class="text-gray-300 mb-8 leading-relaxed text-lg">
                                Your Bungie session has expired. Please re-authenticate to continue tracking your
                                challenge progress and unlock AI-powered optimization.
                            </p>

                            <!-- Enhanced Button -->
                            <button @click="handleLinkBungie" :disabled="loading"
                                class="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 disabled:from-gray-600 disabled:to-gray-700 px-8 py-4 rounded-2xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/60 hover:shadow-2xl text-white text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden">
                                <div
                                    class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000">
                                </div>
                                <component :is="loading ? RotateCw : Link2Off" class="w-6 h-6 relative z-10"
                                    :class="{ 'animate-spin': loading }" />
                                <span class="relative z-10">{{ loading ? 'Reconnecting…' : 'Re-Link Account' }}</span>
                            </button>
                        </div>
                    </template>

                    <!-- FRESH CONNECT -->
                    <template v-else>
                        <div class="flex flex-col items-center text-center">

                            <!-- Enhanced Connect Icon -->
                            <div
                                class="relative w-28 h-28 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-violet-500/25">
                                <PlugZap class="w-14 h-14 text-white" />
                                <div
                                    class="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-full animate-pulse opacity-30">
                                </div>
                                <!-- Orbiting dots -->
                                <div class="absolute inset-0 animate-spin">
                                    <div
                                        class="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1">
                                    </div>
                                    <div
                                        class="absolute bottom-0 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 translate-y-1">
                                    </div>
                                </div>
                            </div>

                            <h3 class="text-3xl font-bold text-white mb-4">Connect Your Account</h3>
                            <p class="text-gray-300 mb-8 leading-relaxed text-lg">
                                Link your Bungie account to unlock real-time challenge tracking, progress analytics, and
                                AI-powered optimization strategies to maximize your seasonal rewards.
                            </p>

                            <!-- Feature highlights -->
                            <div class="grid grid-cols-1 gap-3 mb-8 w-full">
                                <div class="flex items-center gap-3 text-gray-300">
                                    <div
                                        class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check class="w-4 h-4 text-white" />
                                    </div>
                                    <span>Real-time challenge progress tracking</span>
                                </div>
                                <div class="flex items-center gap-3 text-gray-300">
                                    <div
                                        class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Zap class="w-4 h-4 text-white" />
                                    </div>
                                    <span>AI-powered optimization recommendations</span>
                                </div>
                                <div class="flex items-center gap-3 text-gray-300">
                                    <div
                                        class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <TrendingUp class="w-4 h-4 text-white" />
                                    </div>
                                    <span>Advanced progress analytics</span>
                                </div>
                            </div>

                            <!-- Enhanced Button -->
                            <button @click="handleLinkBungie" :disabled="loading"
                                class="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 disabled:from-gray-600 disabled:to-gray-700 px-8 py-4 rounded-2xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/60 hover:shadow-2xl text-white text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group">
                                <div
                                    class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000">
                                </div>
                                <component :is="loading ? RotateCw : Link2" class="w-6 h-6 relative z-10"
                                    :class="{ 'animate-spin': loading }" />
                                <span class="relative z-10">{{ loading ? 'Connecting…' : 'Connect Bungie Account'
                                }}</span>
                            </button>
                        </div>
                    </template>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="mt-6 max-w-lg w-full">
                    <div
                        class="bg-red-900/30 border border-red-500/30 backdrop-blur-sm px-6 py-4 rounded-2xl flex items-center gap-3">
                        <AlertCircle class="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p class="text-red-300 font-medium">
                            {{ error }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Main App -->
            <div v-else class="space-y-6">
                <!-- Profile & Controls -->
                <div class="bg-black/30 backdrop-blur-sm rounded-3xl p-6 border border-purple-500/20 shadow-2xl">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center gap-4">
                            <div class="relative">
                                <img v-if="profile.icon" :src="profile.icon" alt="Profile"
                                    class="w-16 h-16 rounded-full border-3 border-purple-400 shadow-lg" />
                                <div
                                    class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white">
                                </div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-purple-200">
                                    {{ profile.displayName || 'Guardian' }}
                                </div>
                                <div class="text-sm text-gray-400">
                                    {{ getPlatform }} • {{ challengesArray.length }} challenges
                                </div>
                            </div>
                        </div>
                        <button @click="fetchChallenges" :disabled="loading"
                            class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-3 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/60 hover:shadow-2xl text-white font-semibold transition-all duration-300 flex items-center gap-2">
                            <component :is="loading ? RotateCw : RefreshCw" class="w-5 h-5"
                                :class="{ 'animate-spin': loading }" />
                            <span>{{ loading ? 'Refreshing...' : 'Refresh' }}</span>
                        </button>
                    </div>

                    <!-- Stats Overview -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div
                            class="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-4 border border-green-500/30">
                            <div class="text-2xl font-bold text-green-400">{{ completedCount }}</div>
                            <div class="text-sm text-gray-400">Completed</div>
                        </div>
                        <div
                            class="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-500/30">
                            <div class="text-2xl font-bold text-yellow-400">{{ inProgressCount }}</div>
                            <div class="text-sm text-gray-400">In Progress</div>
                        </div>
                        <div
                            class="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-purple-500/30">
                            <div class="text-2xl font-bold text-purple-400">{{ Math.round(avgProgress) }}%</div>
                            <div class="text-sm text-gray-400">Avg Progress</div>
                        </div>
                        <div
                            class="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-4 border border-blue-500/30">
                            <div class="text-2xl font-bold text-blue-400">{{ nearCompletionCount }}</div>
                            <div class="text-sm text-gray-400">Near Done</div>
                        </div>
                    </div>

                    <!-- Filters & Sorting -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Filter Status Select -->
                        <MultiSelect v-model="filterStatus">
                            <MultiSelectTrigger class="w-full bg-gray-800/50 text-white border-gray-600"
                                placeholder="Filter challenges..." :max-display="3" />
                            <MultiSelectContent class="bg-gray-800 text-white border-gray-600">
                                <MultiSelectItem value="All Challenges">All Challenges</MultiSelectItem>
                                <MultiSelectItem value="Completed">Completed</MultiSelectItem>
                                <MultiSelectItem value="Incomplete">Incomplete</MultiSelectItem>
                                <MultiSelectItem value="Near Complete">Near Complete (80%+)</MultiSelectItem>
                            </MultiSelectContent>
                        </MultiSelect>

                        <!-- Sort By Select -->
                        <Select v-model="sortBy">
                            <SelectTrigger class="w-full bg-gray-800/50 text-white border-gray-600">
                                <SelectValue placeholder="Sort by..." />
                            </SelectTrigger>
                            <SelectContent class="bg-gray-800 text-white border-gray-600">
                                <SelectItem value="name">Sort by Name</SelectItem>
                                <SelectItem value="progress">Sort by Progress</SelectItem>
                                <SelectItem value="remaining">Sort by Remaining</SelectItem>
                                <SelectItem value="completion">Sort by Completion</SelectItem>
                            </SelectContent>
                        </Select>

                        <!-- Search Input -->
                        <div class="relative">
                            <Input v-model="searchTerm" type="text" placeholder="Search challenges..."
                                class="w-full bg-gray-800/50 text-white border-gray-600 placeholder-gray-400 pr-10" />
                            <component :is="searchTerm ? X : Search" @click="searchTerm = ''"
                                class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" />
                        </div>
                    </div>
                </div>

                <!-- AI Recommendation (Main Focus) -->
                <div
                    class="bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-8 border border-pink-500/30 shadow-2xl">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                                <Zap class="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-pink-300">AI Optimization Plan</h2>
                                <p class="text-gray-400">Smart recommendations based on your progress</p>
                            </div>
                        </div>
                        <button @click="suggestPlan" :disabled="suggestLoading || loading || !challengesArray.length"
                            class="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/60 hover:shadow-2xl text-white font-semibold transition-all duration-300 flex items-center gap-2">
                            <component :is="suggestLoading ? RotateCw : Lightbulb" class="w-5 h-5"
                                :class="{ 'animate-spin': suggestLoading }" />
                            <span>{{ suggestLoading ? 'Analyzing...' : 'Generate Plan' }}</span>
                        </button>
                    </div>

                    <div v-if="aiSuggestion" class="bg-black/30 rounded-2xl p-6 border border-pink-500/20">
                        <div v-html="renderedMarkdown"
                            class="prose prose-invert !prose-p:my-1 !prose-li:my-0.5 !prose-h2:mt-4 !prose-h2:mb-2 !prose-h3:mt-3 !prose-h3:mb-1 !prose-ul:mt-1 !prose-ul:mb-1 text-gray-200 leading-relaxed"
                            style="column-count:1;" />
                    </div>
                    <div v-else class="text-center py-8">
                        <div
                            class="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Zap class="w-8 h-8 text-pink-400" />
                        </div>
                        <p class="text-gray-400 text-lg">Click "Generate Plan" to get AI-powered optimization
                            suggestions</p>
                        <p class="text-gray-500 text-sm mt-2">Analyze your progress and get personalized recommendations
                        </p>
                    </div>
                </div>

                <!-- Challenges List -->
                <div class="bg-black/30 backdrop-blur-sm rounded-3xl p-6 border border-purple-500/20 shadow-2xl">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-semibold text-purple-200">
                            Seasonal Challenges
                            <span class="text-lg text-gray-400 ml-2">({{ filteredChallenges.length }})</span>
                        </h2>
                        <div class="flex items-center gap-2 text-sm text-gray-400">
                            <span>{{ completedCount }}/{{ challengesArray.length }} completed</span>
                            <div class="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                                    :style="{ width: `${(completedCount / challengesArray.length) * 100}%` }"></div>
                            </div>
                        </div>
                    </div>

                    <div v-if="loading" class="text-center py-12">
                        <div
                            class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <RotateCw class="w-8 h-8 text-white animate-spin" />
                        </div>
                        <p class="text-purple-200 text-lg">Loading challenges...</p>
                    </div>

                    <div v-else-if="displayedChallenges.length" class="space-y-4">
                        <div v-for="challenge in displayedChallenges" :key="challenge.id"
                            class="group relative bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl p-5 border border-gray-600/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">

                            <!-- Completion Status Indicator -->
                            <div class="absolute top-4 right-4">
                                <div v-if="challenge.complete"
                                    class="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                    <Check class="w-4 h-4 text-white" />
                                </div>
                                <div v-else-if="challenge.progressPercent >= 80"
                                    class="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                                    <Sun class="w-4 h-4 text-white" />
                                </div>
                                <div v-else
                                    class="w-6 h-6 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                                    <Clock class="w-4 h-4 text-white" />
                                </div>
                            </div>

                            <div class="pr-10">
                                <div class="flex items-start justify-between mb-3">
                                    <div class="flex-1">
                                        <h3
                                            class="font-bold text-lg text-gray-100 group-hover:text-purple-200 transition-colors">
                                            {{ challenge.name }}
                                        </h3>
                                        <p class="text-sm text-gray-400 mt-1 leading-relaxed">
                                            {{ challenge.description }}
                                        </p>
                                    </div>
                                </div>

                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center gap-4">
                                        <div class="flex items-center gap-2">
                                            <div class="text-2xl font-mono font-bold text-purple-300">
                                                {{ challenge.progress || 0 }}
                                            </div>
                                            <div class="text-gray-400">/</div>
                                            <div class="text-xl font-mono text-gray-300">
                                                {{ challenge.goal || 1 }}
                                            </div>
                                        </div>
                                        <div class="text-sm text-gray-400">
                                            {{ challenge.progressPercent.toFixed(1) }}% complete
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Progress Bar with Remaining Text -->
                            <div class="flex items-center gap-3">
                                <div class="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div class="h-full transition-all duration-500 rounded-full" :class="{
                                        'bg-gradient-to-r from-green-500 to-emerald-500': challenge.complete,
                                        'bg-gradient-to-r from-yellow-500 to-orange-500': !challenge.complete && challenge.progressPercent >= 80,
                                        'bg-gradient-to-r from-blue-500 to-cyan-500': !challenge.complete && challenge.progressPercent >= 50 && challenge.progressPercent < 80,
                                        'bg-gradient-to-r from-purple-500 to-pink-500': !challenge.complete && challenge.progressPercent < 50
                                    }" :style="{ width: `${challenge.progressPercent}%` }">
                                    </div>
                                </div>
                                <div v-if="!challenge.complete" class="text-sm text-gray-400 whitespace-nowrap">
                                    {{ challenge.remaining }} remaining
                                </div>
                            </div>
                        </div>

                        <!-- Load More Buttons -->
                        <div v-if="filteredChallenges.length > displayCount" class="flex justify-center gap-4 pt-6">
                            <button @click="loadMore"
                                class="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 px-6 py-3 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/60 hover:shadow-2xl text-white font-semibold transition-all duration-300 flex items-center gap-2">
                                <ChevronDown class="w-5 h-5" />
                                <span>Load 10 More</span>
                            </button>
                            <button @click="loadAll"
                                class="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 px-6 py-3 rounded-xl shadow-lg shadow-gray-500/25 hover:shadow-gray-500/60 hover:shadow-2xl text-white font-semibold transition-all duration-300 flex items-center gap-2">
                                <FileText class="w-5 h-5" />
                                <span>Load All ({{ filteredChallenges.length - displayCount }} more)</span>
                            </button>
                        </div>
                    </div>

                    <div v-else class="text-center py-12">
                        <div
                            class="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText class="w-8 h-8 text-gray-400" />
                        </div>
                        <p class="text-gray-400 text-lg">No challenges match your current filters</p>
                        <p class="text-gray-500 text-sm mt-2">Try adjusting your search or filter settings</p>
                    </div>
                </div>

                <p v-if="error" class="text-red-400 text-center bg-red-900/20 px-4 py-3 rounded-lg">{{ error }}</p>
            </div>

            <!-- Footer Tagline -->
            <div class="text-center mt-16 pt-8 border-t border-gray-700/30">
                <p class="text-sm text-gray-500">
                    Built by <span class="text-violet-300 font-medium">Mason</span> • Powered by <span
                        class="text-cyan-300 font-medium">OpenAI</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDestinyStore } from '@/stores/useDestinyStore'
import MarkdownIt from 'markdown-it'
import {
    Link2,
    Link2Off,
    RotateCw,
    AlertTriangle,
    PlugZap,
    AlertCircle,
    Check,
    Zap,
    TrendingUp,
    RefreshCw,
    ChevronDown,
    Search,
    Lightbulb,
    Sun,
    Clock,
    FileText,
    X
} from 'lucide-vue-next'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    MultiSelect,
    MultiSelectContent,
    MultiSelectItem,
    MultiSelectTrigger,
    Input
} from '@/components/ui'

const destiny = useDestinyStore()
const {
    bungieLinked,
    tokenExpired,
    profile,
    challenges,
    loading,
    error,
    aiSuggestion,
    suggestLoading,
} = storeToRefs(destiny)

const sortBy = ref('progress')
const searchTerm = ref('')
const filterStatus = ref(['All Challenges'])
const displayCount = ref(10)

// Filter and sort state
const md = new MarkdownIt({ html: true, breaks: true })
const renderedMarkdown = computed(() => md.render(aiSuggestion.value))
const getPlatform = computed(() => {
    const platformId = profile.value?.platform

    const platformMap = {
        1: 'Xbox',
        2: 'PlayStation',
        3: 'Steam',
        4: 'Blizzard',
        5: 'Stadia',
        6: 'Epic Games',
        10: 'Internal'
    }

    return platformMap[platformId] || 'Destiny 2'
})

// Convert Bungie milestones object to array with enhanced data
const challengesArray = computed(() => {
    if (!challenges.value) return [];
    const list = Array.isArray(challenges.value) ? challenges.value : Object.values(challenges.value);
    return list.map(chal => {
        const obj = Array.isArray(chal.objectives) && chal.objectives.length > 0 ? chal.objectives[0] : {};
        const progress = obj.progress ?? 0;
        const goal = obj.completionValue ?? 1;
        const progressPercent = goal > 0 ? (progress / goal) * 100 : 0;

        return {
            id: chal.hash,
            name: chal.name,
            description: chal.description,
            progress,
            goal,
            complete: chal.completed || progressPercent >= 100,
            progressPercent: Math.min(progressPercent, 100),
            remaining: Math.max(0, goal - progress)
        }
    });
});

// Watch for changes and handle "All Challenges" logic
watch(filterStatus, (newValue, oldValue) => {
    if (newValue.includes('All Challenges') && !oldValue.includes('All Challenges')) {
        filterStatus.value = ['All Challenges']
    }

    else if (newValue.length > 1 && newValue.includes('All Challenges')) {
        filterStatus.value = newValue.filter(v => v !== 'All Challenges')
    }

    else if (newValue.length === 0) {
        filterStatus.value = ['All Challenges']
    }
}, { deep: true })

// Reset display count when filters change
watch([filterStatus, searchTerm, sortBy], () => {
    displayCount.value = 10
})

const filteredChallenges = computed(() => {
    let filtered = challengesArray.value;

    if (filterStatus.value.length > 0 && !filterStatus.value.includes('All Challenges')) {
        filtered = filtered.filter(c => {

            return filterStatus.value.some(status => {
                switch (status) {
                    case 'Completed':
                        return c.complete;
                    case 'Incomplete':
                        return !c.complete;
                    case 'Near Complete':
                        return !c.complete && c.progressPercent >= 80;
                    default:
                        return false;
                }
            });
        });
    }

    if (searchTerm.value) {
        const search = searchTerm.value.toLowerCase();
        filtered = filtered.filter(c =>
            c.name.toLowerCase().includes(search) ||
            c.description.toLowerCase().includes(search)
        );
    }

    filtered.sort((a, b) => {
        switch (sortBy.value) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'progress':
                return b.progressPercent - a.progressPercent;
            case 'remaining':
                if (a.complete && !b.complete) return 1;
                if (!a.complete && b.complete) return -1;
                return a.remaining - b.remaining;
            case 'completion':
                return b.progressPercent - a.progressPercent;
            default:
                return 0;
        }
    });

    return filtered;
});

// Display only a subset of challenges based on displayCount
const displayedChallenges = computed(() => {
    return filteredChallenges.value.slice(0, displayCount.value);
});

// Statistics
const completedCount = computed(() => challengesArray.value.filter(c => c.complete).length);
const inProgressCount = computed(() => challengesArray.value.filter(c => !c.complete && c.progress > 0).length);
const nearCompletionCount = computed(() => challengesArray.value.filter(c => !c.complete && c.progressPercent >= 80).length);
const avgProgress = computed(() => {
    if (challengesArray.value.length === 0) return 0;
    const total = challengesArray.value.reduce((sum, c) => sum + c.progressPercent, 0);
    return total / challengesArray.value.length;
});

onMounted(() => {
    destiny.loadDestinyState()
})

function handleLinkBungie() {
    loading.value = true
    destiny.startBungieAuth()
}

function fetchChallenges() {
    destiny.refreshChallenges()
}

function suggestPlan() {
    destiny.getAISuggestion()
}

function loadMore() {
    displayCount.value += 10
}

function loadAll() {
    displayCount.value = filteredChallenges.value.length
}
</script>