<template>
    <div
        class="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-gray-900 flex flex-col items-center px-4 pt-12 pb-4">
        <div class="w-full max-w-7xl">
            <!-- Header -->
            <div class="text-center mb-10">
                <div class="relative inline-block">
                    <h1 class="text-4xl md:text-5xl font-bold text-white mb-3 relative">
                        <span class="text-cyan-400 font-black">Analytics</span>
                        <span class="text-purple-400 font-black ml-3">Dashboard</span>
                        <div
                            class="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-purple-400 opacity-60">
                        </div>
                    </h1>
                </div>
                <p class="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                    Comprehensive insights into Challenge Optimizer usage, performance, and real infrastructure costs.
                </p>

                <!-- Refresh Controls -->
                <div class="flex items-center justify-center gap-4">
                    <button @click="refreshStats" :disabled="statsLoading"
                        class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/60 hover:shadow-2xl text-white font-semibold transition-all duration-300 flex items-center gap-3">
                        <component :is="statsLoading ? RotateCw : RefreshCw" class="w-5 h-5"
                            :class="{ 'animate-spin': statsLoading }" />
                        <span>{{ statsLoading ? 'Loading...' : 'Refresh Stats' }}</span>
                    </button>

                    <div v-if="lastUpdated" class="text-sm text-gray-400">
                        Last updated: {{ formatTimestamp(lastUpdated) }}
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="statsLoading && !hasData" class="text-center py-12">
                <div
                    class="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <RotateCw class="w-10 h-10 text-white animate-spin" />
                </div>
                <p class="text-purple-200 text-xl">Loading analytics...</p>
            </div>

            <!-- Stats Content -->
            <div v-else class="space-y-8">

                <!-- Your Personal AI Stats -->
                <section class="bg-black/30 backdrop-blur-sm rounded-3xl p-8 border border-emerald-500/20 shadow-2xl">
                    <div class="flex items-center justify-between mb-8">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                                <Zap class="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 class="text-3xl font-bold text-emerald-300">Your AI Usage Stats</h2>
                                <p class="text-gray-400">Individual AI optimization usage and performance</p>
                            </div>
                        </div>
                        <div v-if="userAIStats.lastCallAt" class="text-right">
                            <div class="text-sm text-gray-400">Last AI request</div>
                            <div class="text-emerald-400 font-semibold">{{ formatTimestamp(userAIStats.lastCallAt) }}
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <!-- Total AI Calls -->
                        <div
                            class="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl p-6 border border-emerald-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <Zap class="w-8 h-8 text-emerald-400" />
                                <div class="text-xs text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded-full">
                                    Total
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-emerald-300 mb-1">{{ userAIStats.totalCalls || 0 }}
                            </div>
                            <div class="text-sm text-gray-400">AI Requests</div>
                            <div class="text-xs text-gray-500 mt-1">{{ userAIStats.totalChallengesAnalyzed || 0 }}
                                challenges analyzed</div>
                        </div>

                        <!-- Success Rate -->
                        <div
                            class="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <Target class="w-8 h-8 text-blue-400" />
                                <div class="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full">
                                    Success
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-blue-300 mb-1">{{ userSuccessRate.toFixed(1) }}%</div>
                            <div class="text-sm text-gray-400">Success Rate</div>
                            <div class="text-xs text-gray-500 mt-1">{{ userAIStats.successfulCalls || 0 }}/{{
                                userAIStats.totalCalls || 0 }} successful</div>
                        </div>

                        <!-- Cache Efficiency -->
                        <div
                            class="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <Database class="w-8 h-8 text-purple-400" />
                                <div class="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
                                    Cache
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-purple-300 mb-1">{{ userCacheRate.toFixed(1) }}%</div>
                            <div class="text-sm text-gray-400">Cache Hit Rate</div>
                            <div class="text-xs text-gray-500 mt-1">{{ userAIStats.cachedCalls || 0 }} cached responses
                            </div>
                        </div>

                        <!-- Total AI Cost -->
                        <div
                            class="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <DollarSign class="w-8 h-8 text-yellow-400" />
                                <div class="text-xs text-yellow-300 bg-yellow-500/20 px-2 py-1 rounded-full">
                                    AI Cost
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-yellow-300 mb-1">${{ userTotalAICost.toFixed(4) }}</div>
                            <div class="text-sm text-gray-400">Total AI Costs</div>
                            <div class="text-xs text-gray-500 mt-1">OpenAI + Infrastructure</div>
                        </div>
                    </div>

                    <!-- Real AI Cost Breakdown (from tracked data) -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <!-- Detailed AI Cost Analysis -->
                        <div class="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30">
                            <h3 class="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
                                <CreditCard class="w-5 h-5" />
                                AI Cost Breakdown (Tracked)
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span class="text-gray-300">OpenAI (GPT-4o)</span>
                                    </div>
                                    <span class="text-blue-400 font-semibold">${{ (userAIStats.totalOpenAICost ||
                                        0).toFixed(6) }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                                        <span class="text-gray-300">Firestore (R/W)</span>
                                    </div>
                                    <span class="text-orange-400 font-semibold">${{ (userAIStats.totalFirestoreCostUSD
                                        || 0).toFixed(6) }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span class="text-gray-300">Cloud Functions</span>
                                    </div>
                                    <span class="text-green-400 font-semibold">${{ (userAIStats.totalComputeCostUSD ||
                                        0).toFixed(6) }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                                        <span class="text-gray-300">Infrastructure Total</span>
                                    </div>
                                    <span class="text-purple-400 font-semibold">${{
                                        (userAIStats.totalInfrastructureCost || 0).toFixed(6) }}</span>
                                </div>
                                <hr class="border-gray-600">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300 font-semibold">Total AI Cost</span>
                                    <span class="text-yellow-400 font-bold">${{ userTotalAICost.toFixed(4) }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300 text-sm">Avg per Request</span>
                                    <span class="text-cyan-400 font-semibold">${{ avgCostPerRequest.toFixed(4) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Real Infrastructure Usage (from tracked data) -->
                        <div class="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30">
                            <h3 class="text-xl font-bold text-orange-300 mb-4 flex items-center gap-2">
                                <Database class="w-5 h-5" />
                                AI Infrastructure Usage (Tracked)
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Firestore Reads</span>
                                    <span class="text-blue-400 font-semibold">{{ (userAIStats.totalFirestoreReads ||
                                        0).toLocaleString() }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Firestore Writes</span>
                                    <span class="text-green-400 font-semibold">{{ (userAIStats.totalFirestoreWrites ||
                                        0).toLocaleString() }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Total Tokens Used</span>
                                    <span class="text-cyan-400 font-semibold">{{ (userAIStats.totalTokens ||
                                        0).toLocaleString() }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Avg Response Time</span>
                                    <span class="text-purple-400 font-semibold">{{ userAvgAiResponseTime.toFixed(0) }}ms</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Last Request Cost</span>
                                    <span class="text-yellow-400 font-semibold">${{
                                        (userAIStats.totalInfrastructureCost || 0).toFixed(6) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- AI Request Breakdown -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Request Types -->
                        <div class="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30">
                            <h3 class="text-xl font-bold text-emerald-300 mb-4 flex items-center gap-2">
                                <BarChart3 class="w-5 h-5" />
                                AI Request Types
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span class="text-gray-300">Fresh AI Requests</span>
                                    </div>
                                    <span class="text-green-400 font-semibold">{{ userAIStats.freshCalls || 0 }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                                        <span class="text-gray-300">Cached Responses</span>
                                    </div>
                                    <span class="text-purple-400 font-semibold">{{ userCachedCalls || 0 }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <span class="text-gray-300">Failed Requests</span>
                                    </div>
                                    <span class="text-red-400 font-semibold">{{ userFailedCalls || 0 }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Token Analytics -->
                        <div class="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30">
                            <h3 class="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
                                <Cpu class="w-5 h-5" />
                                Token Analytics
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Total Tokens Used</span>
                                    <span class="text-cyan-400 font-semibold">{{ (userAIStats.totalTokens ||
                                        0).toLocaleString() }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Tokens Saved (Cache)</span>
                                    <span class="text-purple-400 font-semibold">{{ (userAIStats.tokensSaved ||
                                        0).toLocaleString() }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Avg Tokens/Request</span>
                                    <span class="text-blue-400 font-semibold">{{ avgTokensPerRequest.toLocaleString()
                                    }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Token Efficiency</span>
                                    <span class="text-green-400 font-semibold">{{ tokenEfficiency.toFixed(1) }}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Your Challenge Refresh Stats -->
                <section class="bg-black/30 backdrop-blur-sm rounded-3xl p-8 border border-green-500/20 shadow-2xl">
                    <div class="flex items-center justify-between mb-8">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                <RefreshCw class="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 class="text-3xl font-bold text-green-300">Your Challenge Stats</h2>
                                <p class="text-gray-400">Personal seasonal challenge progress and refresh costs</p>
                            </div>
                        </div>
                        <div v-if="userSeasonalSummary.lastUpdated" class="text-right">
                            <div class="text-sm text-gray-400">Last refresh</div>
                            <div class="text-green-400 font-semibold">{{
                                formatTimestamp(userSeasonalSummary.lastUpdated) }}</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <!-- Active Challenges -->
                        <div
                            class="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <Target class="w-8 h-8 text-green-400" />
                                <div class="text-xs text-green-300 bg-green-500/20 px-2 py-1 rounded-full">
                                    Active
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-green-300 mb-1">{{ userSeasonalSummary.activeChallenges
                                || 0 }}</div>
                            <div class="text-sm text-gray-400">Available Now</div>
                            <div class="text-xs text-gray-500 mt-1">Week {{ userSeasonalSummary.currentWeek || 0 }}
                            </div>
                        </div>

                        <!-- Completion Rate -->
                        <div
                            class="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <Trophy class="w-8 h-8 text-blue-400" />
                                <div class="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full">
                                    Rate
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-blue-300 mb-1">{{
                                (userSeasonalSummary.activeCompletionRate || 0).toFixed(1) }}%</div>
                            <div class="text-sm text-gray-400">Active Complete</div>
                            <div class="text-xs text-gray-500 mt-1">{{ userSeasonalSummary.completedChallenges || 0
                            }}/{{ userSeasonalSummary.activeChallenges || 0 }} done</div>
                        </div>

                        <!-- Total Refreshes -->
                        <div
                            class="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <RotateCw class="w-8 h-8 text-purple-400" />
                                <div class="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
                                    Refreshes
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-purple-300 mb-1">{{ userSeasonalSummary.totalRefreshes
                                || 0 }}</div>
                            <div class="text-sm text-gray-400">Total Refreshes</div>
                            <div class="text-xs text-gray-500 mt-1">${{ (userSeasonalSummary.totalInfrastructureCost ||
                                0).toFixed(4) }} cost</div>
                        </div>

                        <!-- Challenge Refresh Cost -->
                        <div
                            class="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <DollarSign class="w-8 h-8 text-orange-400" />
                                <div class="text-xs text-orange-300 bg-orange-500/20 px-2 py-1 rounded-full">
                                    Cost
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-orange-300 mb-1">${{
                                (userSeasonalSummary.lastRefreshCost || 0).toFixed(6) }}</div>
                            <div class="text-sm text-gray-400">Last Refresh Cost</div>
                            <div class="text-xs text-gray-500 mt-1">{{ (userSeasonalSummary.lastRefreshDuration ||
                                0).toFixed(0) }}ms duration</div>
                        </div>
                    </div>

                    <!-- Challenge Refresh Infrastructure -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Refresh Cost Breakdown -->
                        <div class="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30">
                            <h3 class="text-xl font-bold text-orange-300 mb-4 flex items-center gap-2">
                                <CreditCard class="w-5 h-5" />
                                Challenge Refresh Costs
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Last Refresh</span>
                                    <span class="text-orange-400 font-semibold">${{ (userSeasonalSummary.lastRefreshCost
                                        || 0).toFixed(6) }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Avg Cost per Refresh</span>
                                    <span class="text-yellow-400 font-semibold">${{ avgRefreshCost.toFixed(6) }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Total Refresh Cost</span>
                                    <span class="text-red-400 font-semibold">${{
                                        (userSeasonalSummary.totalInfrastructureCost || 0).toFixed(6) }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Total Firestore Ops</span>
                                    <span class="text-cyan-400 font-semibold">{{
                                        totalChallengeFirestoreOps.toLocaleString() }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Season Progress -->
                        <div class="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30">
                            <h3 class="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
                                <Calendar class="w-5 h-5" />
                                Season Progress
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">{{ userSeasonalSummary.seasonName || 'Current Season'
                                    }}</span>
                                    <span class="text-green-400 font-semibold">Week {{ userSeasonalSummary.currentWeek
                                        || 0 }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Overall Progress</span>
                                    <span class="text-blue-400 font-semibold">{{ (userSeasonalSummary.completionRate ||
                                        0).toFixed(1) }}%</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Active Progress</span>
                                    <span class="text-purple-400 font-semibold">{{
                                        (userSeasonalSummary.activeCompletionRate || 0).toFixed(1) }}%</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">This Week</span>
                                    <span class="text-cyan-400 font-semibold">{{
                                        userSeasonalSummary.currentWeekChallenges || 0 }} challenges</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Global Platform Stats -->
                <section class="bg-black/30 backdrop-blur-sm rounded-3xl p-8 border border-cyan-500/20 shadow-2xl">
                    <div class="flex items-center justify-between mb-8">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                                <Globe class="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 class="text-3xl font-bold text-cyan-300">Global Platform Stats</h2>
                                <p class="text-gray-400">Platform-wide usage, performance, and real infrastructure costs
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <!-- Total Users -->
                        <div
                            class="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-6 border border-cyan-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <Users class="w-8 h-8 text-cyan-400" />
                                <div class="text-xs text-cyan-300 bg-cyan-500/20 px-2 py-1 rounded-full">
                                    Users
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-cyan-300 mb-1">{{
                                (globalStats.oauth_calculated_stats.totalOAuthUsers || 0) }}</div>
                            <div class="text-sm text-gray-400">Connected Users</div>
                            <div class="text-xs text-gray-500 mt-1">{{ (globalStats.calculated_stats.totalAIUsers || 0) }}
                                using AI</div>
                        </div>

                        <!-- AI System Usage -->
                        <div
                            class="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <Brain class="w-8 h-8 text-purple-400" />
                                <div class="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
                                    AI
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-purple-300 mb-1">{{ (globalStats.ai_stats.totalCalls ||
                                0).toLocaleString() }}</div>
                            <div class="text-sm text-gray-400">Total AI Calls</div>
                            <div class="text-xs text-gray-500 mt-1">{{ (globalStats.ai_calculated_stats.cacheHitRate ||
                                0).toFixed(1) }}% cached</div>
                        </div>

                        <!-- Total Challenges Tracked -->
                        <div
                            class="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <Trophy class="w-8 h-8 text-green-400" />
                                <div class="text-xs text-green-300 bg-green-500/20 px-2 py-1 rounded-full">
                                    Challenges
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-green-300 mb-1">{{
                                (globalStats.challenge_stats.totalChallengesSeen || 0).toLocaleString() }}</div>
                            <div class="text-sm text-gray-400">Total Tracked</div>
                            <div class="text-xs text-gray-500 mt-1">{{ (globalStats.challenge_stats.totalRefreshCalls ||
                                0).toLocaleString() }} refreshes</div>
                        </div>

                        <!-- Total Platform Costs (Real) -->
                        <div
                            class="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl p-6 border border-red-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <CreditCard class="w-8 h-8 text-red-400" />
                                <div class="text-xs text-red-300 bg-red-500/20 px-2 py-1 rounded-full">
                                    Total Cost
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-red-300 mb-1">${{ globalTotalCost.toFixed(2) }}</div>
                            <div class="text-sm text-gray-400">Platform Cost</div>
                            <div class="text-xs text-gray-500 mt-1">AI + Infrastructure</div>
                        </div>
                    </div>

                    <!-- Global Performance Metrics -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <!-- AI Performance -->
                        <div class="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30">
                            <h3 class="text-xl font-bold text-pink-300 mb-4 flex items-center gap-2">
                                <Zap class="w-5 h-5" />
                                AI Performance
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Success Rate</span>
                                    <span class="text-green-400 font-semibold">{{ globalSuccessRate.toFixed(1)
                                    }}%</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Avg Response Time</span>
                                    <span class="text-blue-400 font-semibold">{{
                                        (globalStats.ai_calculated_stats.avgResponseTime / 1000 || 0).toFixed(1)
                                    }}s</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Cache Hit Rate</span>
                                    <span class="text-purple-400 font-semibold">{{
                                        (globalStats.ai_calculated_stats.cacheHitRate || 0).toFixed(1) }}%</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Cost Savings</span>
                                    <span class="text-green-400 font-semibold">${{ (globalStats.ai_stats.costSavedUSD ||
                                        0).toFixed(2) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Challenge Analytics -->
                        <div class="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30">
                            <h3 class="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
                                <Target class="w-5 h-5" />
                                Challenge Analytics
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Total Challenges</span>
                                    <span class="text-purple-400 font-semibold">{{
                                        (globalStats.challenge_stats.totalChallengesSeen || 0).toLocaleString()
                                        }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Total Completed</span>
                                    <span class="text-emerald-400 font-semibold">{{
                                        (globalStats.challenge_stats.totalChallengesCompleted || 0).toLocaleString()
                                        }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Avg Challenges per User</span>
                                    <span class="text-blue-400 font-semibold">{{
                                        (globalStats.calculated_stats.avgChallengesPerUser || 0).toFixed(0) }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Completion Rate</span>
                                    <span class="text-green-400 font-semibold">{{
                                        (globalStats.calculated_stats.avgCompletionRate || 0).toFixed(1) }}%</span>
                                </div>
                            </div>
                        </div>

                        <!-- Real Infrastructure Costs -->
                        <div class="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30">
                            <h3 class="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
                                <Coins class="w-5 h-5" />
                                Infrastructure Costs
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">OpenAI Costs</span>
                                    <span class="text-blue-400 font-semibold">${{ (globalStats.ai_stats.totalCostUSD ||
                                        0).toFixed(4) }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Firestore Costs</span>
                                    <span class="text-orange-400 font-semibold">${{ globalFirestoreCost.toFixed(4)
                                    }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Function Costs</span>
                                    <span class="text-green-400 font-semibold">${{ globalComputeCost.toFixed(4)
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Real-time Activity -->
                <section class="bg-black/30 backdrop-blur-sm rounded-3xl p-8 border border-pink-500/20 shadow-2xl">
                    <div class="flex items-center justify-between mb-8">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                                <Activity class="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 class="text-3xl font-bold text-pink-300">Real-time Activity</h2>
                                <p class="text-gray-400">Live platform activity and recent metrics</p>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <!-- Real Infrastructure Operations -->
                        <div
                            class="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl p-6 border border-pink-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <Database class="w-8 h-8 text-pink-400" />
                                <div class="text-xs text-pink-300 bg-pink-500/20 px-2 py-1 rounded-full">
                                    Firestore
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-pink-300 mb-1">{{ globalFirestoreOps.toLocaleString() }}
                            </div>
                            <div class="text-sm text-gray-400">Total Operations</div>
                            <div class="text-xs text-gray-500 mt-1">Reads + Writes</div>
                        </div>

                        <!-- Fresh vs Cached -->
                        <div
                            class="bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-2xl p-6 border border-violet-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <Cpu class="w-8 h-8 text-violet-400" />
                                <div class="text-xs text-violet-300 bg-violet-500/20 px-2 py-1 rounded-full">
                                    Cache
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-violet-300 mb-1">
                                {{ (globalStats.ai_stats.freshCalls || 0).toLocaleString() }} / {{
                                    (globalStats.ai_stats.cachedCalls || 0).toLocaleString() }}
                            </div>
                            <div class="text-sm text-gray-400">Fresh / Cached</div>
                            <div class="text-xs text-gray-500 mt-1">{{ (globalStats.ai_calculated_stats.cacheHitRate ||
                                0).toFixed(1) }}% hit rate</div>
                        </div>

                        <!-- Total Execution Time -->
                        <div
                            class="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <Clock class="w-8 h-8 text-orange-400" />
                                <div class="text-xs text-orange-300 bg-orange-500/20 px-2 py-1 rounded-full">
                                    Runtime
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-orange-300 mb-1">{{
                                formatExecutionTime(globalExecutionTime) }}</div>
                            <div class="text-sm text-gray-400">Total Execution</div>
                            <div class="text-xs text-gray-500 mt-1">All functions</div>
                        </div>

                        <!-- Challenge Refresh Activity -->
                        <div
                            class="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl p-6 border border-teal-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <RefreshCw class="w-8 h-8 text-teal-400" />
                                <div class="text-xs text-teal-300 bg-teal-500/20 px-2 py-1 rounded-full">
                                    Refreshes
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-teal-300 mb-1">{{
                                (globalStats.challenge_stats.totalRefreshCalls || 0).toLocaleString() }}</div>
                            <div class="text-sm text-gray-400">Challenge Refreshes</div>
                            <div class="text-xs text-gray-500 mt-1">${{
                                (globalStats.challenge_stats.totalInfrastructureCostUSD || 0).toFixed(2) }} cost</div>
                        </div>
                    </div>
                </section>

                <!-- System Health -->
                <section class="bg-black/30 backdrop-blur-sm rounded-3xl p-8 border border-gray-500/20 shadow-2xl">
                    <div class="flex items-center gap-4 mb-8">
                        <div
                            class="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                            <Monitor class="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 class="text-3xl font-bold text-gray-300">System Health</h2>
                            <p class="text-gray-400">Platform reliability and performance indicators</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div
                            class="flex items-center justify-between p-6 bg-gray-800/30 rounded-2xl border border-gray-600/30">
                            <div class="flex items-center gap-3">
                                <div class="w-4 h-4 rounded-full" :class="systemHealthColor"></div>
                                <span class="text-gray-300 font-medium">AI System Status</span>
                            </div>
                            <span class="font-bold" :class="systemHealthTextColor">{{ systemHealthStatus }}</span>
                        </div>

                        <div
                            class="flex items-center justify-between p-6 bg-gray-800/30 rounded-2xl border border-gray-600/30">
                            <div class="flex items-center gap-3">
                                <Clock class="w-5 h-5 text-blue-400" />
                                <span class="text-gray-300 font-medium">Last AI Call</span>
                            </div>
                            <span class="text-blue-400 font-semibold">{{
                                formatTimestamp(globalStats.ai_stats.lastCallAt) }}</span>
                        </div>

                        <div
                            class="flex items-center justify-between p-6 bg-gray-800/30 rounded-2xl border border-gray-600/30">
                            <div class="flex items-center gap-3">
                                <Database class="w-5 h-5 text-purple-400" />
                                <span class="text-gray-300 font-medium">Data Refresh</span>
                            </div>
                            <span class="text-purple-400 font-semibold">{{
                                formatTimestamp(globalStats.ai_stats.updatedAt) }}</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDestinyStore } from '@/stores/useDestinyStore'
import {
    RefreshCw,
    RotateCw,
    Zap,
    Globe,
    Activity,
    Monitor,
    Target,
    DollarSign,
    Users,
    Brain,
    Trophy,
    CreditCard,
    BarChart3,
    Coins,
    Database,
    Cpu,
    Clock,
    Calendar
} from 'lucide-vue-next'

const destiny = useDestinyStore()
const {
    globalStats,
    userAIStats,
    userSeasonalSummary,
    statsLoading
} = storeToRefs(destiny)

const lastUpdated = ref(Date.now())

// Basic data existence check
const hasData = computed(() =>
    globalStats.value.ai_stats.totalCalls > 0 || userAIStats.value.totalCalls > 0
)

// === User Stats ===
const userSuccessRate = computed(() => {
    const total = userAIStats.value.totalCalls || 0
    const successful = userAIStats.value.successfulCalls || 0
    return total > 0 ? (successful / total) * 100 : 0
})

const userCacheRate = computed(() => {
    const successful = userAIStats.value.successfulCalls || 0
    const fresh = userAIStats.value.freshCalls || 0
    const cachedCalls = (successful - fresh)
    return cachedCalls > 0 ? (successful / cachedCalls) * 100 : 0
})

const userCachedCalls = computed(() => {
    const successful = userAIStats.value.successfulCalls || 0
    const fresh = userAIStats.value.freshCalls || 0
    return successful > 0 ? successful - fresh : 0
})

const userFailedCalls = computed(() => {
    const total = userAIStats.value.totalCalls || 0
    const successful = userAIStats.value.successfulCalls || 0
    return total > 0 ? total - successful : 0
})

const userTotalAICost = computed(() => {
    return (userAIStats.value.totalCostUSD || 0) + (userAIStats.value.totalInfrastructureCostUSD || 0)
})

const userAvgAiResponseTime = computed(() => {
    const totalTime = (userAIStats.value.totalResponseTime || 0) + (userAIStats.value.totalExecutionTimeMs || 0)
    const totalUses = userAIStats.value.totalCalls || 0
    return totalTime > 0 ? totalTime / totalUses : 0
})

const avgCostPerRequest = computed(() => {
    const total = userAIStats.value.totalCalls || 0
    const cost = userTotalAICost.value || 0
    return total > 0 ? cost / total : 0
})

const avgTokensPerRequest = computed(() => {
    const fresh = userAIStats.value.freshCalls || 0
    const tokens = userAIStats.value.totalTokens || 0
    return fresh > 0 ? Math.round(tokens / fresh) : 0
})

const tokenEfficiency = computed(() => {
    const totalTokens = userAIStats.value.totalTokens || 0
    const saved = userAIStats.value.tokensSaved || 0
    const possible = totalTokens + saved
    return possible > 0 ? (saved / possible) * 100 : 0
})

// === User Challenge Summary ===
const avgRefreshCost = computed(() => {
    const refreshes = userSeasonalSummary.value.totalRefreshes || 0
    const cost = userSeasonalSummary.value.totalInfrastructureCost || 0
    return refreshes > 0 ? cost / refreshes : 0
})

const totalChallengeFirestoreOps = computed(() => {
    return (userSeasonalSummary.value.totalFirestoreReads || 0) + (userSeasonalSummary.value.totalFirestoreWrites || 0)
})

// === Global Stats (Merged AI + Challenge) ===
const globalFirestoreOps = computed(() => {
    const ai = globalStats.value.ai_stats
    const ch = globalStats.value.challenge_stats
    return (ai.totalFirestoreReads || 0) + (ai.totalFirestoreWrites || 0) +
           (ch.totalFirestoreReads || 0) + (ch.totalFirestoreWrites || 0)
})

const globalExecutionTime = computed(() => {
    return (globalStats.value.ai_stats.totalExecutionTimeMs || 0) +
           (globalStats.value.challenge_stats.totalExecutionTimeMs || 0)
})

const globalFirestoreCost = computed(() => {
    return (globalStats.value.ai_stats.totalFirestoreCostUSD || 0) +
           (globalStats.value.challenge_stats.totalFirestoreCostUSD || 0)
})

const globalComputeCost = computed(() => {
    return (globalStats.value.ai_stats.totalComputeCostUSD || 0) +
           (globalStats.value.challenge_stats.totalComputeCostUSD || 0)
})

const globalInfrastructureCost = computed(() => {
    const totalCompute = (globalStats.value.ai_stats.totalComputeCostUSD || 0) +
    (globalStats.value.challenge_stats.totalComputeCostUSD || 0)
    const totalFirestore = (globalStats.value.ai_stats.totalFirestoreCostUSD || 0) +
    (globalStats.value.challenge_stats.totalFirestoreCostUSD || 0)
    return (totalCompute || 0) + (totalFirestore || 0)
})

const globalTotalCost = computed(() => {
    const modelCost = globalStats.value.ai_stats.totalCostUSD || 0
    return modelCost + globalInfrastructureCost.value
})

const globalSuccessRate = computed(() => {
    const total = globalStats.value.ai_stats.totalCalls || 0
    const successful = globalStats.value.ai_stats.successfulCalls || 0
    return total > 0 ? (successful / total) * 100 : 0
})

const systemHealthStatus = computed(() => {
    const successRate = globalSuccessRate.value
    if (successRate >= 95) return 'Excellent'
    if (successRate >= 90) return 'Good'
    if (successRate >= 80) return 'Fair'
    return 'Poor'
})

const systemHealthColor = computed(() => {
    const successRate = globalSuccessRate.value
    if (successRate >= 95) return 'bg-green-500'
    if (successRate >= 90) return 'bg-yellow-500'
    if (successRate >= 80) return 'bg-orange-500'
    return 'bg-red-500'
})

const systemHealthTextColor = computed(() => {
    const successRate = globalSuccessRate.value
    if (successRate >= 95) return 'text-green-400'
    if (successRate >= 90) return 'text-yellow-400'
    if (successRate >= 80) return 'text-orange-400'
    return 'text-red-400'
})

// Helper functions
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Never'

    const date = new Date(timestamp)

    // Australian date/time format (DD/MM/YYYY, HH:MM AM/PM AEST/AEDT)
    return date.toLocaleString('en-AU', {
        timeZone: 'Australia/Brisbane',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short'
    })
}

function formatLargeNumber(num) {
    if (!num) return '0'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toLocaleString()
}

function formatExecutionTime(timeMs) {
    if (!timeMs) return '0ms'
    if (timeMs >= 3600000) return (timeMs / 3600000).toFixed(1) + 'h'
    if (timeMs >= 60000) return (timeMs / 60000).toFixed(1) + 'm'
    if (timeMs >= 1000) return (timeMs / 1000).toFixed(1) + 's'
    return Math.round(timeMs) + 'ms'
}

async function refreshStats() {
    await destiny.loadAllStats()
    lastUpdated.value = Date.now()
}

onMounted(() => {
    destiny.loadAllStats()
})
</script>