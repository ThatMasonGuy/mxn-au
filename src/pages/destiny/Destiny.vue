<template>
    <div
        class="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-gray-900 flex flex-col items-center px-4 py-8">
        <div class="w-full max-w-6xl">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1
                    class="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2 tracking-tight">
                    Destiny 2 Challenge Optimizer
                </h1>
                <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                    Pull your real progress, min-max your season, and never miss a reward. Powered by <b>OpenAI</b>, built by <b>Mason</b>
                </p>
            </div>

            <!-- Bungie Connect -->
            <div v-if="!bungieLinked" class="flex flex-col items-center my-12">
                <div class="bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
                    <template v-if="tokenExpired">
                        <div class="text-center">
                            <div
                                class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <p class="text-yellow-300 mb-6 text-lg font-semibold">
                                Your Bungie session has expired.<br>
                                Please re-link your account to continue.
                            </p>
                            <button @click="linkBungie" :disabled="loading"
                                class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-4 rounded-2xl shadow-lg text-white text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105">
                                <svg v-if="loading" class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" />
                                    <path class="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                <span>{{ loading ? 'Connecting…' : 'Re-Link Bungie Account' }}</span>
                            </button>
                        </div>
                    </template>
                    <template v-else>
                        <div class="text-center">
                            <div
                                class="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                            <p class="text-gray-300 mb-6 text-lg">
                                Connect your Bungie account to start pulling your live challenge data.
                            </p>
                            <button @click="linkBungie" :disabled="loading"
                                class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-4 rounded-2xl shadow-lg text-white text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105">
                                <svg v-if="loading" class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" />
                                    <path class="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                <span>{{ loading ? 'Connecting…' : 'Connect Bungie Account' }}</span>
                            </button>
                        </div>
                    </template>
                </div>
                <p v-if="error" class="text-red-400 mt-6 text-center bg-red-900/20 px-4 py-2 rounded-lg">{{ error }}</p>
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
                                    {{ profile.platform || 'Destiny 2' }} • {{ challengesArray.length }} challenges
                                </div>
                            </div>
                        </div>
                        <button @click="fetchChallenges" :disabled="loading"
                            class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-3 rounded-xl shadow-lg text-white font-semibold transition-all duration-300 flex items-center gap-2 transform hover:scale-105">
                            <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
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
                        <div class="relative">
                            <select v-model="filterStatus"
                                class="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="all">All Challenges</option>
                                <option value="completed">Completed</option>
                                <option value="incomplete">Incomplete</option>
                                <option value="near-complete">Near Complete (80%+)</option>
                            </select>
                            <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        <div class="relative">
                            <select v-model="sortBy"
                                class="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="name">Sort by Name</option>
                                <option value="progress">Sort by Progress</option>
                                <option value="remaining">Sort by Remaining</option>
                                <option value="completion">Sort by Completion</option>
                            </select>
                            <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        <div class="relative">
                            <input v-model="searchTerm" type="text" placeholder="Search challenges..."
                                class="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
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
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-pink-300">AI Optimization Plan</h2>
                                <p class="text-gray-400">Smart recommendations based on your progress</p>
                            </div>
                        </div>
                        <button @click="suggestPlan" :disabled="suggestLoading || loading || !challengesArray.length"
                            class="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl shadow-lg text-white font-semibold transition-all duration-300 flex items-center gap-2 transform hover:scale-105">
                            <svg v-if="suggestLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
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
                            <svg class="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
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
                            <svg class="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                        </div>
                        <p class="text-purple-200 text-lg">Loading challenges...</p>
                    </div>

                    <div v-else-if="filteredChallenges.length" class="space-y-4">
                        <div v-for="challenge in filteredChallenges" :key="challenge.id"
                            class="group relative bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl p-5 border border-gray-600/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">

                            <!-- Completion Status Indicator -->
                            <div class="absolute top-4 right-4">
                                <div v-if="challenge.complete"
                                    class="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div v-else-if="challenge.progressPercent >= 80"
                                    class="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div v-else
                                    class="w-6 h-6 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
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

                                <div class="flex items-center justify-between">
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
                                    <div v-if="!challenge.complete" class="text-sm text-gray-400">
                                        {{ challenge.remaining }} remaining
                                    </div>
                                </div>

                                <!-- Progress Bar -->
                                <div class="mt-4 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div class="h-full transition-all duration-500 rounded-full" :class="{
                                        'bg-gradient-to-r from-green-500 to-emerald-500': challenge.complete,
                                        'bg-gradient-to-r from-yellow-500 to-orange-500': !challenge.complete && challenge.progressPercent >= 80,
                                        'bg-gradient-to-r from-blue-500 to-cyan-500': !challenge.complete && challenge.progressPercent >= 50 && challenge.progressPercent < 80,
                                        'bg-gradient-to-r from-purple-500 to-pink-500': !challenge.complete && challenge.progressPercent < 50
                                    }" :style="{ width: `${challenge.progressPercent}%` }">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else class="text-center py-12">
                        <div
                            class="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p class="text-gray-400 text-lg">No challenges match your current filters</p>
                        <p class="text-gray-500 text-sm mt-2">Try adjusting your search or filter settings</p>
                    </div>
                </div>

                <p v-if="error" class="text-red-400 text-center bg-red-900/20 px-4 py-3 rounded-lg">{{ error }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDestinyStore } from '@/stores/useDestinyStore'
import MarkdownIt from 'markdown-it'

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

// Filter and sort state
const filterStatus = ref('all')
const sortBy = ref('progress')
const searchTerm = ref('')

const md = new MarkdownIt({ html: true, breaks: true })
const renderedMarkdown = computed(() => md.render(aiSuggestion.value))

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

// Filtered and sorted challenges
const filteredChallenges = computed(() => {
    let filtered = challengesArray.value;

    // Apply status filter
    if (filterStatus.value === 'completed') {
        filtered = filtered.filter(c => c.complete);
    } else if (filterStatus.value === 'incomplete') {
        filtered = filtered.filter(c => !c.complete);
    } else if (filterStatus.value === 'near-complete') {
        filtered = filtered.filter(c => !c.complete && c.progressPercent >= 80);
    }

    // Apply search filter
    if (searchTerm.value) {
        const search = searchTerm.value.toLowerCase();
        filtered = filtered.filter(c =>
            c.name.toLowerCase().includes(search) ||
            c.description.toLowerCase().includes(search)
        );
    }

    // Apply sorting
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

function linkBungie() {
    destiny.startBungieAuth()
}

function fetchChallenges() {
    destiny.refreshChallenges()
}

function suggestPlan() {
    destiny.getAISuggestion()
}
</script>