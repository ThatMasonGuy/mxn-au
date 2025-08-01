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
                    Comprehensive insights into Challenge Optimizer usage, performance, and AI analytics.
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

                <!-- Your Personal Stats -->
                <section class="bg-black/30 backdrop-blur-sm rounded-3xl p-8 border border-emerald-500/20 shadow-2xl">
                    <div class="flex items-center justify-between mb-8">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                                <User class="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 class="text-3xl font-bold text-emerald-300">Your Personal Stats</h2>
                                <p class="text-gray-400">Your individual usage and performance metrics</p>
                            </div>
                        </div>
                        <div v-if="userAIStats.lastCallAt" class="text-right">
                            <div class="text-sm text-gray-400">Last AI request</div>
                            <div class="text-emerald-400 font-semibold">{{ formatTimestamp(userAIStats.lastCallAt) }}
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <!-- Total Calls -->
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
                        </div>

                        <!-- Cache Efficiency -->
                        <div
                            class="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <Gauge class="w-8 h-8 text-purple-400" />
                                <div class="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
                                    Cache
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-purple-300 mb-1">{{ userCacheRate.toFixed(1) }}%</div>
                            <div class="text-sm text-gray-400">Cache Hit Rate</div>
                        </div>

                        <!-- Your Cost Breakdown -->
                        <div
                            class="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <DollarSign class="w-8 h-8 text-yellow-400" />
                                <div class="text-xs text-yellow-300 bg-yellow-500/20 px-2 py-1 rounded-full">
                                    Total Cost
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-yellow-300 mb-1">${{ userTotalCost.toFixed(4) }}</div>
                            <div class="text-sm text-gray-400">All Platform Costs</div>
                        </div>
                    </div>

                    <!-- Enhanced Cost Breakdown -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <!-- Detailed Cost Analysis -->
                        <div class="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30">
                            <h3 class="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
                                <CreditCard class="w-5 h-5" />
                                Cost Breakdown
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span class="text-gray-300">OpenAI (GPT-4o)</span>
                                    </div>
                                    <span class="text-blue-400 font-semibold">${{ (userAIStats.totalCostUSD ||
                                        0).toFixed(4) }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                                        <span class="text-gray-300">Firestore (R/W)</span>
                                    </div>
                                    <span class="text-orange-400 font-semibold">${{ userFirestoreCost.toFixed(6)
                                        }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span class="text-gray-300">Cloud Functions</span>
                                    </div>
                                    <span class="text-green-400 font-semibold">${{ userCloudFunctionsCost.toFixed(6)
                                        }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                                        <span class="text-gray-300">Total Infrastructure</span>
                                    </div>
                                    <span class="text-purple-400 font-semibold">${{
                                        (userAIStats.totalInfrastructureCostUSD || 0).toFixed(6) }}</span>
                                </div>
                                <hr class="border-gray-600">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300 font-semibold">Total Platform Cost</span>
                                    <span class="text-yellow-400 font-bold">${{ userTotalCost.toFixed(4) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Infrastructure Usage -->
                        <div class="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30">
                            <h3 class="text-xl font-bold text-orange-300 mb-4 flex items-center gap-2">
                                <Database class="w-5 h-5" />
                                Infrastructure Usage
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Firestore Reads</span>
                                    <span class="text-blue-400 font-semibold">{{
                                        estimatedFirestoreReads.toLocaleString() }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Firestore Writes</span>
                                    <span class="text-green-400 font-semibold">{{
                                        estimatedFirestoreWrites.toLocaleString() }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Function Invocations</span>
                                    <span class="text-purple-400 font-semibold">{{ userAIStats.totalCalls || 0 }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Avg Cost per Request</span>
                                    <span class="text-yellow-400 font-semibold">${{ avgCostPerRequest.toFixed(4)
                                        }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Total Execution Time</span>
                                    <span class="text-cyan-400 font-semibold">{{
                                        formatExecutionTime(userAIStats.totalExecutionTimeMs || 0) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Your Detailed Usage Breakdown -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Usage Breakdown -->
                        <div class="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30">
                            <h3 class="text-xl font-bold text-emerald-300 mb-4 flex items-center gap-2">
                                <BarChart3 class="w-5 h-5" />
                                Request Types
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span class="text-gray-300">Fresh Requests</span>
                                    </div>
                                    <span class="text-green-400 font-semibold">{{ userAIStats.freshCalls || 0 }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                                        <span class="text-gray-300">Cached Responses</span>
                                    </div>
                                    <span class="text-purple-400 font-semibold">{{ userAIStats.cachedCalls || 0
                                        }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <span class="text-gray-300">Failed Requests</span>
                                    </div>
                                    <span class="text-red-400 font-semibold">{{ userAIStats.errorCalls || 0 }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Token Usage Details -->
                        <div class="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30">
                            <h3 class="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
                                <Cpu class="w-5 h-5" />
                                Token Analytics
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Total Tokens</span>
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
                                    <span class="text-blue-400 font-semibold">{{ (avgTokensPerRequest ||
                                        0).toLocaleString() }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Token Efficiency</span>
                                    <span class="text-green-400 font-semibold">{{ tokenEfficiency.toFixed(1) }}%</span>
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
                                <p class="text-gray-400">Platform-wide usage and performance metrics</p>
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
                                globalStats.calculated_stats.totalConnectedUsers || 0 }}</div>
                            <div class="text-sm text-gray-400">Connected Users</div>
                        </div>

                        <!-- AI Users -->
                        <div
                            class="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <Brain class="w-8 h-8 text-purple-400" />
                                <div class="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
                                    AI
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-purple-300 mb-1">{{
                                globalStats.ai_calculated_stats.totalActiveUsers || 0 }}</div>
                            <div class="text-sm text-gray-400">AI Users</div>
                        </div>

                        <!-- Total Challenges -->
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
                        </div>

                        <!-- Platform Costs -->
                        <div
                            class="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl p-6 border border-red-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <CreditCard class="w-8 h-8 text-red-400" />
                                <div class="text-xs text-red-300 bg-red-500/20 px-2 py-1 rounded-full">
                                    Cost
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-red-300 mb-1">${{ (globalStats.ai_stats.totalCostUSD ||
                                0).toFixed(2) }}</div>
                            <div class="text-sm text-gray-400">Platform Cost</div>
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
                                    <span class="text-gray-300">Cache Hit Rate</span>
                                    <span class="text-purple-400 font-semibold">{{
                                        (globalStats.ai_calculated_stats.cacheHitRate || 0).toFixed(1) }}%</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Avg Response Time</span>
                                    <span class="text-blue-400 font-semibold">{{
                                        (globalStats.ai_calculated_stats.avgResponseTime / 1000 || 0).toFixed(1)
                                        }}s</span>
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
                                    <span class="text-gray-300">Completion Rate</span>
                                    <span class="text-green-400 font-semibold">{{
                                        (globalStats.calculated_stats.avgCompletionRate || 0).toFixed(1) }}%</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Completed</span>
                                    <span class="text-emerald-400 font-semibold">{{
                                        (globalStats.challenge_stats.totalChallengesCompleted || 0).toLocaleString()
                                        }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Avg per User</span>
                                    <span class="text-blue-400 font-semibold">{{
                                        (globalStats.calculated_stats.avgChallengesPerUser || 0).toFixed(0) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Cost Efficiency -->
                        <div class="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30">
                            <h3 class="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
                                <Coins class="w-5 h-5" />
                                Cost Efficiency
                            </h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Cost per Call</span>
                                    <span class="text-yellow-400 font-semibold">${{
                                        (globalStats.ai_calculated_stats.avgCostPerCall || 0).toFixed(4) }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Total Saved</span>
                                    <span class="text-green-400 font-semibold">${{ (globalStats.ai_stats.costSavedUSD ||
                                        0).toFixed(2) }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-300">Tokens per Call</span>
                                    <span class="text-blue-400 font-semibold">{{
                                        Math.round(globalStats.ai_calculated_stats.avgTokensPerCall || 0) }}</span>
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
                        <!-- Total AI Calls -->
                        <div
                            class="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl p-6 border border-pink-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <Zap class="w-8 h-8 text-pink-400" />
                                <div class="text-xs text-pink-300 bg-pink-500/20 px-2 py-1 rounded-full">
                                    Live
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-pink-300 mb-1">{{ (globalStats.ai_stats.totalCalls ||
                                0).toLocaleString() }}</div>
                            <div class="text-sm text-gray-400">Total AI Calls</div>
                        </div>

                        <!-- Fresh vs Cached -->
                        <div
                            class="bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-2xl p-6 border border-violet-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <Database class="w-8 h-8 text-violet-400" />
                                <div class="text-xs text-violet-300 bg-violet-500/20 px-2 py-1 rounded-full">
                                    Cache
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-violet-300 mb-1">
                                {{ (globalStats.ai_stats.freshCalls || 0).toLocaleString() }} / {{
                                    (globalStats.ai_stats.cachedCalls || 0).toLocaleString() }}
                            </div>
                            <div class="text-sm text-gray-400">Fresh / Cached</div>
                        </div>

                        <!-- Total Tokens -->
                        <div
                            class="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <Cpu class="w-8 h-8 text-orange-400" />
                                <div class="text-xs text-orange-300 bg-orange-500/20 px-2 py-1 rounded-full">
                                    Tokens
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-orange-300 mb-1">{{
                                formatLargeNumber(globalStats.ai_stats.totalTokens || 0) }}</div>
                            <div class="text-sm text-gray-400">Total Tokens</div>
                        </div>

                        <!-- Challenge Requests -->
                        <div
                            class="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl p-6 border border-teal-500/30">
                            <div class="flex items-center justify-between mb-2">
                                <RefreshCw class="w-8 h-8 text-teal-400" />
                                <div class="text-xs text-teal-300 bg-teal-500/20 px-2 py-1 rounded-full">
                                    Refresh
                                </div>
                            </div>
                            <div class="text-3xl font-bold text-teal-300 mb-1">{{
                                (globalStats.challenge_stats.totalRefreshCalls || 0).toLocaleString() }}</div>
                            <div class="text-sm text-gray-400">Challenge Refreshes</div>
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
    User,
    Globe,
    Activity,
    Monitor,
    Zap,
    Target,
    Gauge,
    DollarSign,
    Users,
    Brain,
    Trophy,
    CreditCard,
    BarChart3,
    Coins,
    Database,
    Cpu,
    Clock
} from 'lucide-vue-next'

const destiny = useDestinyStore()
const { globalStats, userAIStats, statsLoading } = storeToRefs(destiny)

const lastUpdated = ref(Date.now())

// Computed properties for derived stats
const hasData = computed(() => {
    return globalStats.value.ai_stats.totalCalls > 0 || userAIStats.value.totalCalls > 0
})

const userSuccessRate = computed(() => {
    const total = userAIStats.value.totalCalls || 0
    const successful = userAIStats.value.successfulCalls || 0
    return total > 0 ? (successful / total) * 100 : 0
})

const userCacheRate = computed(() => {
    const total = userAIStats.value.totalCalls || 0
    const cached = userAIStats.value.cachedCalls || 0
    return total > 0 ? (cached / total) * 100 : 0
})

// Enhanced cost calculations
const userFirestoreCost = computed(() => {
    const totalCalls = userAIStats.value.totalCalls || 0
    const freshCalls = userAIStats.value.freshCalls || 0
    const cachedCalls = userAIStats.value.cachedCalls || 0

    // Firestore pricing
    const READ_COST = 0.0000006  // $0.06 per 100K reads
    const WRITE_COST = 0.0000018  // $0.18 per 100K writes

    // Estimate operations per request type
    const freshReads = freshCalls * 5      // Fresh requests need more reads
    const freshWrites = freshCalls * 8     // Fresh requests do more writes
    const cachedReads = cachedCalls * 4    // Cached requests need fewer reads  
    const cachedWrites = cachedCalls * 6   // Cached requests do fewer writes

    const totalReads = freshReads + cachedReads
    const totalWrites = freshWrites + cachedWrites

    return (totalReads * READ_COST) + (totalWrites * WRITE_COST)
})

const userCloudFunctionsCost = computed(() => {
    const totalCalls = userAIStats.value.totalCalls || 0

    // Cloud Functions pricing
    const INVOCATION_COST = 0.0000004  // $0.40 per 1M invocations
    const COMPUTE_COST_PER_100MS = 0.0000025  // $0.0000025 per 100ms at 256MB

    // Estimate average response time (3 seconds = 30 x 100ms units)
    const avgComputeUnits = 30

    const invocationCosts = totalCalls * INVOCATION_COST
    const computeCosts = totalCalls * avgComputeUnits * COMPUTE_COST_PER_100MS

    return invocationCosts + computeCosts
})

const userTotalCost = computed(() => {
    return (userAIStats.value.totalCostUSD || 0) + userFirestoreCost.value + userCloudFunctionsCost.value
})

const estimatedFirestoreReads = computed(() => {
    const freshCalls = userAIStats.value.freshCalls || 0
    const cachedCalls = userAIStats.value.cachedCalls || 0
    return (freshCalls * 5) + (cachedCalls * 4)
})

const estimatedFirestoreWrites = computed(() => {
    const freshCalls = userAIStats.value.freshCalls || 0
    const cachedCalls = userAIStats.value.cachedCalls || 0
    return (freshCalls * 8) + (cachedCalls * 6)
})

const avgCostPerRequest = computed(() => {
    const totalCalls = userAIStats.value.totalCalls || 0
    return totalCalls > 0 ? userTotalCost.value / totalCalls : 0
})

const avgTokensPerRequest = computed(() => {
    const freshCalls = userAIStats.value.freshCalls || 0
    const totalTokens = userAIStats.value.totalTokens || 0
    return freshCalls > 0 ? Math.round(totalTokens / freshCalls) : 0
})

const tokenEfficiency = computed(() => {
    const totalTokens = userAIStats.value.totalTokens || 0
    const tokensSaved = userAIStats.value.tokensSaved || 0
    const totalPossible = totalTokens + tokensSaved
    return totalPossible > 0 ? (tokensSaved / totalPossible) * 100 : 0
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
    if (timeMs >= 60000) return (timeMs / 60000).toFixed(1) + 'm'
    if (timeMs >= 1000) return (timeMs / 1000).toFixed(1) + 's'
    return Math.round(timeMs) + 'ms'
}

async function refreshStats() {
    await destiny.loadAllStats()
    lastUpdated.value = Date.now()}

onMounted(() => {
    destiny.loadAllStats()
})
</script>