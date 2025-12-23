<template>
    <div class="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 p-3 py-0 sm:p-6 md:py-16">
        <div class="max-w-[1920px] mx-auto">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
                <div class="text-center">
                    <RefreshCw class="w-16 h-16 text-lime-400 animate-spin mx-auto mb-4" />
                    <p class="text-lime-300 text-xl">Loading rankings...</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error"
                class="max-w-2xl mx-auto bg-red-900/30 backdrop-blur-lg rounded-2xl p-6 border-2 border-red-400/50">
                <div class="flex items-center gap-3 mb-4">
                    <AlertCircle class="w-8 h-8 text-red-400 flex-shrink-0" />
                    <h2 class="text-2xl font-bold text-red-300">Ranking Not Found</h2>
                </div>
                <p class="text-red-200 mb-6">{{ error }}</p>
                <Button @click="navigateHome" class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold">
                    <Home class="w-4 h-4 mr-2" />
                    Go to Homepage
                </Button>
            </div>

            <!-- Main Content -->
            <div v-else-if="rankingData">
                <!-- Header -->
                <div class="text-center mb-6 sm:mb-8 px-4">
                    <div class="flex flex-wrap items-center justify-center gap-3 mb-3 max-w-full">
                        <Trophy class="w-8 sm:w-12 h-8 sm:h-12 text-lime-400 flex-shrink-0" />
                        <h1
                            class="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg break-words overflow-wrap-anywhere max-w-full">
                            {{ rankingData.datasetName }}
                        </h1>
                    </div>
                    <p class="text-lime-200/80 text-sm sm:text-lg mb-2">Guild Rankings</p>
                    <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-lime-300/70">
                        <div class="flex items-center gap-1">
                            <Calendar class="w-4 h-4" />
                            <span>Published {{ formatDate(rankingData.metadata?.publishedAt) }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <Users class="w-4 h-4" />
                            <span>{{ rankingData.rankings?.length || 0 }} guilds</span>
                        </div>
                        <div v-if="rankingData.metadata?.opponentServer" class="flex items-center gap-1">
                            <Globe class="w-4 h-4" />
                            <span>vs {{ rankingData.metadata.opponentServer }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <Eye class="w-4 h-4" />
                            <span>{{ viewCount }} {{ viewCount === 1 ? 'view' : 'views' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Share & Export Actions -->
                <div
                    class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30 mb-6">
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div class="flex items-center gap-2">
                            <Share2 class="w-5 h-5 text-lime-400" />
                            <h2 class="text-lg font-bold text-lime-300">Share & Export</h2>
                        </div>
                        <div class="flex flex-wrap gap-2 justify-center">
                            <Button @click="copyLink" size="sm" variant="outline"
                                class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20 hover:border-lime-400">
                                <Copy class="w-4 h-4 mr-1" />
                                Copy Link
                            </Button>
                            <Button @click="copyForDiscord" size="sm" variant="outline"
                                class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20 hover:border-lime-400">
                                <MessageCircle class="w-4 h-4 mr-1" />
                                Copy for Discord
                            </Button>
                            <Button @click="exportToCSV" size="sm" variant="outline"
                                class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20 hover:border-lime-400">
                                <FileDown class="w-4 h-4 mr-1" />
                                Export CSV
                            </Button>
                            <Button @click="exportToPNG" size="sm" variant="outline"
                                class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20 hover:border-lime-400"
                                :disabled="isExporting">
                                <Download class="w-4 h-4 mr-1" />
                                {{ isExporting ? 'Exporting...' : 'Export PNG' }}
                            </Button>
                        </div>
                    </div>

                    <!-- Copy Success Message -->
                    <div v-if="copySuccess"
                        class="mt-3 p-2 rounded bg-lime-500/20 border border-lime-400/50 text-lime-200 text-sm flex items-center gap-2">
                        <CheckCircle class="w-4 h-4" />
                        <span>{{ copySuccess }}</span>
                    </div>
                </div>

                <!-- Weight Configuration Display -->
                <div
                    class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30 mb-6">
                    <div class="flex items-center gap-2 mb-4">
                        <Settings class="w-5 h-5 text-lime-400" />
                        <h2 class="text-lg sm:text-xl font-bold text-lime-300">Weight Configuration</h2>
                    </div>
                    <div :class="[
                        'grid gap-3 sm:gap-4',
                        displayWeights.length === 1 ? 'grid-cols-1' :
                        displayWeights.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                        displayWeights.length === 3 ? 'grid-cols-2 sm:grid-cols-3' :
                        displayWeights.length === 4 ? 'grid-cols-2 sm:grid-cols-4' :
                        displayWeights.length === 5 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5' :
                        'grid-cols-2 sm:grid-cols-3 md:grid-cols-6'
                    ]">
                        <div v-for="weight in displayWeights" :key="weight.key"
                            class="bg-gradient-to-br from-green-800/60 to-teal-800/60 rounded-lg p-3 sm:p-4 border border-lime-500/30">
                            <div class="text-xs sm:text-sm text-lime-300/80 mb-1">{{ weight.label }}</div>
                            <div class="text-xl sm:text-2xl font-bold text-lime-300">{{ weight.value }}%</div>
                            <div v-if="weight.mode" class="text-xs text-lime-400/60 mt-1">{{ weight.mode }}</div>
                        </div>
                    </div>
                    
                    <!-- How is this calculated - Expandable Section -->
                    <div class="mt-4">
                        <Button @click="showMathExplanation = !showMathExplanation" 
                            variant="outline"
                            class="w-full text-lime-300 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20">
                            <Calculator class="w-4 h-4 mr-2" />
                            {{ showMathExplanation ? 'Hide' : 'Show' }} How This Is Calculated
                        </Button>
                        
                        <!-- Math Explanation Content -->
                        <div v-if="showMathExplanation && rankingData.rankings.length > 0" 
                            class="mt-4 space-y-4 bg-green-950/30 rounded-lg p-4 border border-lime-500/20">
                            <h3 class="font-bold text-lime-300 flex items-center gap-2">
                                <Sparkles class="w-5 h-5" />
                                Calculation Method (using #1 {{ rankingData.rankings[0].guild.name }} as example)
                            </h3>
                            
                            <div class="space-y-3 text-sm text-lime-200">
                                <!-- GvG Win Record -->
                                <div v-if="rankingData.weights.gvgWin?.enabled" class="bg-green-900/30 p-3 rounded-lg">
                                    <h4 class="font-semibold text-lime-300 mb-2">🏆 GvG Win Record ({{ rankingData.weights.gvgWin.weight }}%)</h4>
                                    <div class="space-y-1 text-lime-200/80 font-mono text-xs">
                                        <p>• Binary scoring: Won = {{ rankingData.weights.gvgWin.weight }}%, Lost = 0%</p>
                                        <p>• All wins count equally, regardless of margin</p>
                                        <p>• Flawless Victory: Sparkle icon for winning all 6 days</p>
                                        <p>• {{ rankingData.rankings[0].guild.name }}: {{ rankingData.rankings[0].rawData.gvgWins }}W - {{ rankingData.rankings[0].rawData.gvgLosses }}L = {{ rankingData.rankings[0].rawData.gvgWon ? 'WIN ✓' : 'LOSS ✗' }}</p>
                                        <p>• Score: {{ rankingData.rankings[0].rawData.gvgWon ? rankingData.weights.gvgWin.weight : 0 }} points</p>
                                    </div>
                                </div>

                                <!-- GvG Total Score -->
                                <div v-if="rankingData.weights.gvgScore?.enabled" class="bg-green-900/30 p-3 rounded-lg">
                                    <h4 class="font-semibold text-lime-300 mb-2">⚔️ GvG Total Score ({{ rankingData.weights.gvgScore.weight }}%)</h4>
                                    <div class="space-y-1 text-lime-200/80 font-mono text-xs">
                                        <p>• Sum of all 6 days' scores</p>
                                        <p>• {{ rankingData.rankings[0].guild.name }}: {{ formatNumber(rankingData.rankings[0].rawData.gvgTotalScore) }}</p>
                                        <p>• Max score: {{ formatNumber(Math.max(...rankingData.rankings.map(r => r.rawData.gvgTotalScore))) }}</p>
                                        <p>• Normalized: ({{ formatNumber(rankingData.rankings[0].rawData.gvgTotalScore) }} / {{ formatNumber(Math.max(...rankingData.rankings.map(r => r.rawData.gvgTotalScore))) }}) × {{ rankingData.weights.gvgScore.weight }}%</p>
                                        <p>• Score: {{ rankingData.rankings[0].scores.gvgScore.toFixed(2) }} points</p>
                                    </div>
                                </div>

                                <!-- Guild Power -->
                                <div v-if="rankingData.weights.guildPower?.enabled" class="bg-green-900/30 p-3 rounded-lg">
                                    <h4 class="font-semibold text-lime-300 mb-2">⚡ Guild Power ({{ rankingData.weights.guildPower.weight }}%)</h4>
                                    <div class="space-y-1 text-lime-200/80 font-mono text-xs">
                                        <p>• {{ rankingData.rankings[0].guild.name }}: {{ formatNumberShort(rankingData.rankings[0].guild.guildPower) }}</p>
                                        <p>• Max power: {{ formatNumberShort(Math.max(...rankingData.rankings.map(r => r.guild.guildPower || 0))) }}</p>
                                        <p>• Normalized: ({{ formatNumber(rankingData.rankings[0].guild.guildPower) }} / {{ formatNumber(Math.max(...rankingData.rankings.map(r => r.guild.guildPower || 0))) }}) × {{ rankingData.weights.guildPower.weight }}%</p>
                                        <p>• Score: {{ rankingData.rankings[0].scores.guildPower.toFixed(2) }} points</p>
                                    </div>
                                </div>

                                <!-- KvK Prep -->
                                <div v-if="rankingData.weights.kvkPrep?.enabled" class="bg-green-900/30 p-3 rounded-lg">
                                    <h4 class="font-semibold text-lime-300 mb-2">📅 KvK Prep - Days 1-5 ({{ rankingData.weights.kvkPrep.weight }}%)</h4>
                                    <div v-if="rankingData.weights.kvkPrep.mode === 'avgRank'" class="space-y-1 text-lime-200/80 font-mono text-xs">
                                        <p>• Mode: Average Rank (lower is better)</p>
                                        <p>• {{ rankingData.rankings[0].guild.name }}: Avg Rank {{ rankingData.rankings[0].rawData.kvkPrepAvgRank?.toFixed(2) || 'N/A' }}</p>
                                        <p>• Max rank: {{ Math.max(...rankingData.rankings.map(r => r.rawData.kvkPrepAvgRank || 0)).toFixed(0) }}</p>
                                        <p>• Normalized: (({{ Math.max(...rankingData.rankings.map(r => r.rawData.kvkPrepAvgRank || 0)).toFixed(0) }} - {{ rankingData.rankings[0].rawData.kvkPrepAvgRank?.toFixed(2) }} + 1) / {{ Math.max(...rankingData.rankings.map(r => r.rawData.kvkPrepAvgRank || 0)).toFixed(0) }}) × {{ rankingData.weights.kvkPrep.weight }}%</p>
                                        <p>• Score: {{ rankingData.rankings[0].scores.kvkPrep.toFixed(2) }} points</p>
                                    </div>
                                    <div v-else class="space-y-1 text-lime-200/80 font-mono text-xs">
                                        <p>• Mode: Total Score (higher is better)</p>
                                        <p>• {{ rankingData.rankings[0].guild.name }}: {{ formatNumber(rankingData.rankings[0].rawData.kvkPrepTotalScore) }}</p>
                                        <p>• Max score: {{ formatNumber(Math.max(...rankingData.rankings.map(r => r.rawData.kvkPrepTotalScore))) }}</p>
                                        <p>• Normalized: ({{ formatNumber(rankingData.rankings[0].rawData.kvkPrepTotalScore) }} / {{ formatNumber(Math.max(...rankingData.rankings.map(r => r.rawData.kvkPrepTotalScore))) }}) × {{ rankingData.weights.kvkPrep.weight }}%</p>
                                        <p>• Score: {{ rankingData.rankings[0].scores.kvkPrep.toFixed(2) }} points</p>
                                    </div>
                                </div>

                                <!-- KvK War -->
                                <div v-if="rankingData.weights.kvkWar?.enabled" class="bg-green-900/30 p-3 rounded-lg">
                                    <h4 class="font-semibold text-lime-300 mb-2">⚔️ KvK War - Day 6 ({{ rankingData.weights.kvkWar.weight }}%)</h4>
                                    <div v-if="rankingData.weights.kvkWar.mode === 'rank'" class="space-y-1 text-lime-200/80 font-mono text-xs">
                                        <p>• Mode: Rank (lower is better)</p>
                                        <p>• {{ rankingData.rankings[0].guild.name }}: Rank {{ rankingData.rankings[0].rawData.kvkWarRank || 'N/A' }}</p>
                                        <p>• Max rank: {{ Math.max(...rankingData.rankings.map(r => r.rawData.kvkWarRank || 0)) }}</p>
                                        <p>• Normalized: (({{ Math.max(...rankingData.rankings.map(r => r.rawData.kvkWarRank || 0)) }} - {{ rankingData.rankings[0].rawData.kvkWarRank }} + 1) / {{ Math.max(...rankingData.rankings.map(r => r.rawData.kvkWarRank || 0)) }}) × {{ rankingData.weights.kvkWar.weight }}%</p>
                                        <p>• Score: {{ rankingData.rankings[0].scores.kvkWar.toFixed(2) }} points</p>
                                    </div>
                                    <div v-else class="space-y-1 text-lime-200/80 font-mono text-xs">
                                        <p>• Mode: Score (higher is better)</p>
                                        <p>• {{ rankingData.rankings[0].guild.name }}: {{ formatNumber(rankingData.rankings[0].rawData.kvkWarScore) }}</p>
                                        <p>• Max score: {{ formatNumber(Math.max(...rankingData.rankings.map(r => r.rawData.kvkWarScore))) }}</p>
                                        <p>• Normalized: ({{ formatNumber(rankingData.rankings[0].rawData.kvkWarScore) }} / {{ formatNumber(Math.max(...rankingData.rankings.map(r => r.rawData.kvkWarScore))) }}) × {{ rankingData.weights.kvkWar.weight }}%</p>
                                        <p>• Score: {{ rankingData.rankings[0].scores.kvkWar.toFixed(2) }} points</p>
                                    </div>
                                </div>

                                <!-- Final Total -->
                                <div class="bg-lime-900/40 p-3 rounded-lg border-2 border-lime-400/30">
                                    <h4 class="font-semibold text-lime-300 mb-2">🏅 Final Score</h4>
                                    <div class="space-y-1 text-lime-200/80 font-mono text-xs">
                                        <p>• Total = Sum of all category scores</p>
                                        <p class="text-lime-300 font-bold text-base">• {{ rankingData.rankings[0].guild.name }}: {{ rankingData.rankings[0].totalScore.toFixed(2) }} points</p>
                                        <p class="text-lime-400/80 mt-2">Rankings sorted by total score (highest first)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- KvK Results (if available) -->
                <div v-if="rankingData.metadata?.dailyResults && rankingData.metadata.dailyResults.some(r => r)"
                    class="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-purple-400/30 mb-6">
                    <div class="flex items-center gap-2 mb-4">
                        <Calendar class="w-5 h-5 text-purple-400" />
                        <h2 class="text-lg sm:text-xl font-bold text-purple-300">KvK Daily Results</h2>
                    </div>
                    <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                        <div v-for="(result, index) in rankingData.metadata.dailyResults" :key="index"
                            class="bg-purple-950/50 rounded-lg p-2 sm:p-3 text-center border"
                            :class="result === 'win' ? 'border-green-500/50' : result === 'loss' ? 'border-red-500/50' : 'border-purple-500/30'">
                            <div class="text-xs text-purple-300/80 mb-1">Day {{ index + 1 }}</div>
                            <div v-if="result === 'win'" class="text-lg sm:text-xl font-bold text-green-400">W</div>
                            <div v-else-if="result === 'loss'" class="text-lg sm:text-xl font-bold text-red-400">L</div>
                            <div v-else class="text-lg sm:text-xl text-purple-400/40">-</div>
                        </div>
                    </div>
                </div>

                <!-- Rankings Table -->
                <div
                    class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30 mb-6">
                    <div class="flex items-center gap-2 mb-4">
                        <Trophy class="w-5 h-5 text-lime-400" />
                        <h2 class="text-lg sm:text-xl font-bold text-lime-300">Final Rankings</h2>
                    </div>

                    <!-- Stats Summary -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        <div class="bg-green-950/50 rounded-lg p-3 text-center">
                            <div class="text-xs text-lime-300/60 mb-1">Top Guild</div>
                            <div class="text-sm font-bold text-lime-300">{{ rankingData.stats?.topGuild || 'N/A' }}
                            </div>
                        </div>
                        <div class="bg-green-950/50 rounded-lg p-3 text-center">
                            <div class="text-xs text-lime-300/60 mb-1">Avg Score</div>
                            <div class="text-sm font-bold text-lime-300">{{ rankingData.stats?.avgScore?.toFixed(2) ||
                                '0' }}</div>
                        </div>
                        <div class="bg-green-950/50 rounded-lg p-3 text-center">
                            <div class="text-xs text-lime-300/60 mb-1">Max Score</div>
                            <div class="text-sm font-bold text-lime-300">{{ rankingData.stats?.maxScore?.toFixed(2) ||
                                '0' }}</div>
                        </div>
                        <div class="bg-green-950/50 rounded-lg p-3 text-center">
                            <div class="text-xs text-lime-300/60 mb-1">Min Score</div>
                            <div class="text-sm font-bold text-lime-300">{{ rankingData.stats?.minScore?.toFixed(2) ||
                                '0' }}</div>
                        </div>
                    </div>

                    <!-- Rankings Table -->
                    <div class="overflow-x-auto custom-scrollbar">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b-2 border-lime-400/30">
                                    <th
                                        class="text-left py-3 px-2 sm:px-4 text-lime-300 font-semibold text-sm sm:text-base">
                                        Rank</th>
                                    <th
                                        class="text-left py-3 px-2 sm:px-4 text-lime-300 font-semibold text-sm sm:text-base">
                                        Guild</th>
                                    <th
                                        class="text-right py-3 px-2 sm:px-4 text-lime-300 font-semibold text-sm sm:text-base">
                                        Total Score
                                    </th>
                                    <th v-if="hasCategory('gvgWin')"
                                        class="text-center py-3 px-2 sm:px-4 text-lime-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                                        GvG Win
                                    </th>
                                    <th v-if="hasCategory('gvgScore')"
                                        class="text-center py-3 px-2 sm:px-4 text-lime-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                                        GvG Score
                                    </th>
                                    <th v-if="hasCategory('guildPower')"
                                        class="text-center py-3 px-2 sm:px-4 text-lime-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                                        Power
                                    </th>
                                    <th v-if="hasCategory('kvkPrep')"
                                        class="text-center py-3 px-2 sm:px-4 text-lime-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                                        KvK Prep
                                    </th>
                                    <th v-if="hasCategory('kvkWar')"
                                        class="text-center py-3 px-2 sm:px-4 text-lime-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                                        KvK War
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="result in rankingData.rankings" :key="result.rank" :class="[
                                    'border-b border-lime-400/20',
                                    result.rank === 1 ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20' :
                                        result.rank === 2 ? 'bg-gradient-to-r from-gray-400/20 to-slate-400/20' :
                                            result.rank === 3 ? 'bg-gradient-to-r from-orange-600/20 to-amber-600/20' :
                                                'hover:bg-lime-500/10'
                                ]">
                                    <td class="py-3 px-2 sm:px-4">
                                        <div class="flex items-center gap-2">
                                            <span :class="[
                                                'font-bold text-sm sm:text-base',
                                                result.rank === 1 ? 'text-yellow-400' :
                                                    result.rank === 2 ? 'text-gray-300' :
                                                        result.rank === 3 ? 'text-orange-400' :
                                                            'text-lime-200'
                                            ]">
                                                #{{ result.rank }}
                                            </span>
                                            <Crown v-if="result.rank === 1" class="w-5 h-5 text-yellow-400" />
                                            <Medal v-if="result.rank === 2" class="w-5 h-5 text-gray-300" />
                                            <Award v-if="result.rank === 3" class="w-5 h-5 text-orange-400" />
                                        </div>
                                    </td>
                                    <td class="py-3 px-2 sm:px-4">
                                        <div>
                                            <div class="font-semibold text-lime-100 text-sm sm:text-base">
                                                {{ result.guild.name || 'Unnamed' }}
                                            </div>
                                            <div v-if="result.guild.shorthand" class="text-xs text-lime-300/60">
                                                {{ result.guild.shorthand }}
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-3 px-2 sm:px-4 text-right">
                                        <span
                                            class="text-lg sm:text-xl font-bold bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
                                            {{ result.totalScore.toFixed(2) }}
                                        </span>
                                    </td>
                                    <td v-if="hasCategory('gvgWin')" class="py-3 px-2 sm:px-4 text-center">
                                        <div class="space-y-1">
                                            <div class="flex items-center justify-center gap-1 flex-wrap">
                                                <Badge
                                                    :class="result.rawData.gvgWon ? 'bg-green-600/80 text-white' : 'bg-red-600/80 text-white'">
                                                    {{ result.rawData.gvgWon ? 'Won' : 'Lost' }}
                                                </Badge>
                                                <Sparkles v-if="result.rawData.gvgFlawless" 
                                                    class="w-5 h-5 text-yellow-400 animate-pulse" 
                                                    :title="'Flawless Victory! Won all 6 days'" />
                                                <Shield v-if="result.rawData.invasionStatus === 'can-invade'" 
                                                    class="w-4 h-4 text-green-400" 
                                                    :title="'Defensive Advantage: Won 3+ of first 5 days'" />
                                                <Sword v-if="result.rawData.invasionStatus === 'can-be-invaded'" 
                                                    class="w-4 h-4 text-red-400" 
                                                    :title="'Invasion Risk: Lost 3+ of first 5 days'" />
                                            </div>
                                            <div class="text-xs text-lime-300/70">
                                                {{ result.rawData.gvgWins }}W-{{ result.rawData.gvgLosses }}L ({{ result.rawData.gvgPoints || 0 }} pts)
                                            </div>
                                        </div>
                                    </td>
                                    <td v-if="hasCategory('gvgScore')" class="py-3 px-2 sm:px-4 text-center">
                                        <span class="text-lime-200 text-sm font-medium">
                                            {{ formatNumber(result.rawData.gvgTotalScore) }}
                                        </span>
                                    </td>
                                    <td v-if="hasCategory('guildPower')" class="py-3 px-2 sm:px-4 text-center">
                                        <span class="text-lime-200 text-sm font-medium">
                                            {{ formatNumberShort(result.guild.guildPower) }}
                                        </span>
                                    </td>
                                    <td v-if="hasCategory('kvkPrep')" class="py-3 px-2 sm:px-4 text-center">
                                        <span class="text-lime-200 text-sm font-medium">
                                            {{ formatKvKPrepDisplay(result.rawData) }}
                                        </span>
                                    </td>
                                    <td v-if="hasCategory('kvkWar')" class="py-3 px-2 sm:px-4 text-center">
                                        <span class="text-lime-200 text-sm font-medium">
                                            {{ formatKvKWarDisplay(result.rawData) }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Call to Action -->
                <div
                    class="bg-gradient-to-r from-lime-500/20 to-green-500/20 rounded-2xl p-6 text-center border-2 border-lime-400/40">
                    <h3 class="text-xl sm:text-2xl font-bold text-lime-300 mb-3">Create Your Own Rankings</h3>
                    <p class="text-lime-200/80 mb-4">Input your guild data and customize weight configurations</p>
                    <Button @click="navigateHome" size="lg"
                        class="bg-lime-600 hover:bg-lime-500 text-green-950 font-bold shadow-xl">
                        <Sparkles class="w-5 h-5 mr-2" />
                        Get Started
                    </Button>
                </div>

                <!-- Footer -->
                <div class="mt-8 mb-8 text-center text-lime-300/60 text-sm">
                    <p>Powered by Guild Ranking System</p>
                    <p class="mt-1">Fair • Transparent • Customizable</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, getDoc, increment, updateDoc, setDoc } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { useGuildDataStore } from '@/stores/useGuildDataStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Trophy, Medal, Award, Crown, Calendar, Users, Globe, Share2, Copy,
    FileDown, AlertCircle, RefreshCw, Settings, CheckCircle, Home,
    MessageCircle, Sparkles, Eye, Calculator, Download, Sword, Shield
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const guildStore = useGuildDataStore()

// State
const rankingData = ref(null)
const isLoading = ref(true)
const error = ref(null)
const copySuccess = ref('')
const viewCount = ref(0) // NEW: Track view count
const showMathExplanation = ref(false) // NEW: Toggle math explanation
const isExporting = ref(false) // NEW: Track PNG export state
const currentDatasetId = ref('') // Store dataset ID for URLs
const currentVersionId = ref('') // Store version ID for URLs

// Computed
const displayWeights = computed(() => {
    if (!rankingData.value?.weights) return []

    const weights = []
    const w = rankingData.value.weights

    if (w.gvgWin?.enabled) {
        weights.push({ key: 'gvgWin', label: 'GvG Win', value: w.gvgWin.weight, mode: 'Win or Loss' })
    }
    if (w.gvgScore?.enabled) {
        weights.push({ key: 'gvgScore', label: 'GvG Score', value: w.gvgScore.weight, mode: 'Total Score' })
    }
    if (w.guildPower?.enabled) {
        weights.push({ key: 'guildPower', label: 'Guild Power', value: w.guildPower.weight, mode: 'Total Power' })
    }
    if (w.kvkPrep?.enabled) {
        weights.push({
            key: 'kvkPrep',
            label: 'KvK Prep',
            value: w.kvkPrep.weight,
            mode: w.kvkPrep.mode === 'avgRank' ? 'Avg Rank' : 'Total Score'
        })
    }
    if (w.kvkWar?.enabled) {
        weights.push({
            key: 'kvkWar',
            label: 'KvK War',
            value: w.kvkWar.weight,
            mode: w.kvkWar.mode === 'rank' ? 'Rank' : 'Score'
        })
    }

    return weights
})

// Functions
const hasCategory = (category) => {
    return rankingData.value?.weights?.[category]?.enabled || false
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

const formatNumber = (value) => {
    if (!value && value !== 0) return '0'
    return Number(value).toLocaleString()
}

const formatNumberShort = (value) => {
    if (!value && value !== 0) return '0'
    const num = Number(value)
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B'
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

const formatKvKPrepDisplay = (rawData) => {
    const mode = rankingData.value?.weights?.kvkPrep?.mode
    if (mode === 'avgRank') {
        return rawData.kvkPrepAvgRank ? rawData.kvkPrepAvgRank.toFixed(1) : '-'
    } else {
        return rawData.kvkPrepTotalScore ? formatNumber(rawData.kvkPrepTotalScore) : '-'
    }
}

const formatKvKWarDisplay = (rawData) => {
    const mode = rankingData.value?.weights?.kvkWar?.mode
    if (mode === 'rank') {
        return rawData.kvkWarRank || '-'
    } else {
        return rawData.kvkWarScore ? formatNumber(rawData.kvkWarScore) : '-'
    }
}

const copyLink = async () => {
    try {
        const url = window.location.href
        await navigator.clipboard.writeText(url)
        copySuccess.value = 'Link copied to clipboard!'
        setTimeout(() => {
            copySuccess.value = ''
        }, 3000)
    } catch (err) {
        console.error('Failed to copy:', err)
    }
}

const copyForDiscord = async () => {
    if (!rankingData.value) return

    // Header with markdown format
    let text = `## ${rankingData.value.datasetName} - Guild Rankings\n\n`

    // Check if there are any flawless guilds
    const hasFlawless = rankingData.value.rankings.some(result => result.rawData.gvgFlawless)

    // Add each ranking
    rankingData.value.rankings.forEach((result) => {
        const flawlessEmoji = result.rawData.gvgFlawless ? ' :sparkles:' : ''
        text += `${result.rank}. ${result.guild.name || 'Unnamed'}`
        if (result.guild.shorthand) text += ` (**${result.guild.shorthand}**)`
        text += ` - ${result.totalScore.toFixed(2)} pts${flawlessEmoji}\n`
    })

    // Add links
    const baseUrl = 'https://mxn.au/topheroes/tools/rankings'
    const datasetParam = currentDatasetId.value
    const versionParam = currentVersionId.value || 'latest'
    
    text += `\n[Check the rankings and see how it's calculated.](${baseUrl}/view?dataset=${datasetParam}&version=${versionParam})\n`
    text += `[View the scores in detail.](${baseUrl}/insights?dataset=${datasetParam}&version=${versionParam})\n`

    // Add sparkles note if there are flawless guilds
    if (hasFlawless) {
        text += `\n*Stars display next to guilds that went flawless in GvG*\n`
    }

    // Add published date
    text += `_Published ${formatDate(rankingData.value.metadata?.publishedAt)}_`

    try {
        await navigator.clipboard.writeText(text)
        copySuccess.value = 'Discord format copied to clipboard!'
        setTimeout(() => {
            copySuccess.value = ''
        }, 3000)
    } catch (err) {
        console.error('Failed to copy:', err)
    }
}

const exportToCSV = () => {
    if (!rankingData.value) return

    let csv = 'Rank,Guild,Shorthand,Total Score'

    if (hasCategory('gvgWin')) csv += ',GvG Record'
    if (hasCategory('gvgScore')) csv += ',GvG Score'
    if (hasCategory('guildPower')) csv += ',Guild Power'
    if (hasCategory('kvkPrep')) csv += ',KvK Prep'
    if (hasCategory('kvkWar')) csv += ',KvK War'

    csv += '\n'

    rankingData.value.rankings.forEach((result) => {
        csv += `${result.rank},`
        csv += `"${result.guild.name || 'Unnamed'}",`
        csv += `"${result.guild.shorthand || ''}",`
        csv += `${result.totalScore.toFixed(2)}`

        if (hasCategory('gvgWin')) {
            csv += `,${result.rawData.gvgWins}W-${result.rawData.gvgLosses}L (${result.rawData.gvgPoints || 0}pts)`
        }
        if (hasCategory('gvgScore')) {
            csv += `,${result.rawData.gvgTotalScore}`
        }
        if (hasCategory('guildPower')) {
            csv += `,${result.guild.guildPower || 0}`
        }
        if (hasCategory('kvkPrep')) {
            csv += `,${formatKvKPrepDisplay(result.rawData)}`
        }
        if (hasCategory('kvkWar')) {
            csv += `,${formatKvKWarDisplay(result.rawData)}`
        }

        csv += '\n'
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${rankingData.value.datasetName.replace(/\s+/g, '_')}_rankings.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    copySuccess.value = 'CSV downloaded!'
    setTimeout(() => {
        copySuccess.value = ''
    }, 3000)
}

const exportToPNG = async () => {
    if (!rankingData.value) return
    
    try {
        isExporting.value = true
        
        // Dynamically import html2canvas
        const html2canvas = (await import('html2canvas')).default
        
        // Create a temporary container for the styled export
        const exportContainer = document.createElement('div')
        exportContainer.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            width: 1200px;
            padding: 40px;
            background: linear-gradient(to bottom right, rgb(6, 78, 59), rgb(20, 83, 45), rgb(19, 78, 74));
            font-family: system-ui, -apple-system, sans-serif;
        `
        
        // Build the content
        const content = `
            <div style="background: rgba(22, 101, 52, 0.9); border: 2px solid rgba(163, 230, 53, 0.3); border-radius: 16px; padding: 32px;">
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 32px;">
                    <h1 style="font-size: 48px; font-weight: bold; background: linear-gradient(to right, rgb(163, 230, 53), rgb(74, 222, 128), rgb(52, 211, 153)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 8px;">
                        ${rankingData.value.datasetName}
                    </h1>
                    <p style="color: rgba(190, 242, 100, 0.8); font-size: 20px; margin-bottom: 16px;">Guild Rankings</p>
                    <div style="display: flex; justify-content: center; gap: 24px; color: rgba(190, 242, 100, 0.7); font-size: 14px; flex-wrap: wrap;">
                        <span>📅 ${formatDate(rankingData.value.metadata?.publishedAt)}</span>
                        <span>👥 ${rankingData.value.rankings?.length || 0} guilds</span>
                        ${rankingData.value.metadata?.opponentServer ? `<span>🌍 vs ${rankingData.value.metadata.opponentServer}</span>` : ''}
                        <span>👁️ ${viewCount.value} views</span>
                    </div>
                </div>

                <!-- Weight Configuration -->
                <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(163, 230, 53, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <h2 style="color: rgb(190, 242, 100); font-size: 18px; font-weight: bold; margin-bottom: 16px;">⚖️ Weight Configuration</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
                        ${displayWeights.value.map(w => `
                            <div style="background: rgba(22, 101, 52, 0.6); border: 1px solid rgba(163, 230, 53, 0.3); border-radius: 8px; padding: 12px;">
                                <div style="color: rgba(190, 242, 100, 0.8); font-size: 12px; margin-bottom: 4px;">${w.label}</div>
                                <div style="color: rgb(190, 242, 100); font-size: 24px; font-weight: bold;">${w.value}%</div>
                                ${w.mode ? `<div style="color: rgba(132, 204, 22, 0.6); font-size: 10px; margin-top: 4px;">${w.mode}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Rankings Table -->
                <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(163, 230, 53, 0.3); border-radius: 12px; padding: 20px;">
                    <h2 style="color: rgb(190, 242, 100); font-size: 18px; font-weight: bold; margin-bottom: 16px;">🏆 Final Rankings</h2>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="border-bottom: 2px solid rgba(163, 230, 53, 0.3);">
                                    <th style="text-align: left; padding: 12px; color: rgb(190, 242, 100); font-weight: 600; font-size: 14px;">Rank</th>
                                    <th style="text-align: left; padding: 12px; color: rgb(190, 242, 100); font-weight: 600; font-size: 14px;">Guild</th>
                                    <th style="text-align: right; padding: 12px; color: rgb(190, 242, 100); font-weight: 600; font-size: 14px;">Total Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rankingData.value.rankings.slice(0, 20).map((result, index) => {
                                    let bgColor = 'transparent'
                                    let icon = '▫️'
                                    if (index === 0) {
                                        bgColor = 'rgba(234, 179, 8, 0.2)'
                                        icon = '👑'
                                    } else if (index === 1) {
                                        bgColor = 'rgba(156, 163, 175, 0.2)'
                                        icon = '🥈'
                                    } else if (index === 2) {
                                        bgColor = 'rgba(234, 88, 12, 0.2)'
                                        icon = '🥉'
                                    }
                                    
                                    return `
                                        <tr style="border-bottom: 1px solid rgba(163, 230, 53, 0.2); background: ${bgColor};">
                                            <td style="padding: 12px;">
                                                <span style="font-size: 20px;">${icon}</span>
                                                <span style="color: rgb(190, 242, 100); font-weight: bold; margin-left: 8px; font-size: 18px;">#${result.rank}</span>
                                            </td>
                                            <td style="padding: 12px;">
                                                <div style="color: rgb(190, 242, 100); font-weight: bold; font-size: 16px;">${result.guild.name || 'Unnamed'}</div>
                                                ${result.guild.shorthand ? `<div style="color: rgba(190, 242, 100, 0.6); font-size: 12px;">${result.guild.shorthand}</div>` : ''}
                                            </td>
                                            <td style="text-align: right; padding: 12px;">
                                                <span style="color: rgb(190, 242, 100); font-weight: bold; font-size: 18px;">${result.totalScore.toFixed(2)}</span>
                                                <span style="color: rgba(190, 242, 100, 0.6); font-size: 12px; margin-left: 4px;">pts</span>
                                            </td>
                                        </tr>
                                    `
                                }).join('')}
                                ${rankingData.value.rankings.length > 20 ? `
                                    <tr>
                                        <td colspan="3" style="padding: 12px; text-align: center; color: rgba(190, 242, 100, 0.6); font-style: italic;">
                                            ... and ${rankingData.value.rankings.length - 20} more guilds
                                        </td>
                                    </tr>
                                ` : ''}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Footer -->
                <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(163, 230, 53, 0.2);">
                    <p style="color: rgba(190, 242, 100, 0.6); font-size: 12px;">Generated from TopHeroes Ranking Calculator</p>
                    <p style="color: rgba(190, 242, 100, 0.4); font-size: 10px; margin-top: 4px;">${window.location.href}</p>
                </div>
            </div>
        `
        
        exportContainer.innerHTML = content
        document.body.appendChild(exportContainer)
        
        // Wait for fonts and images to load
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Generate canvas
        const canvas = await html2canvas(exportContainer, {
            scale: 2,
            backgroundColor: null,
            logging: false,
            useCORS: true
        })
        
        // Remove temporary container
        document.body.removeChild(exportContainer)
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${rankingData.value.datasetName.replace(/\s+/g, '_')}_rankings.png`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            
            copySuccess.value = 'PNG exported successfully!'
            setTimeout(() => {
                copySuccess.value = ''
            }, 3000)
        }, 'image/png')
        
    } catch (err) {
        console.error('Export error:', err)
        copySuccess.value = 'Failed to export PNG. Please try again.'
        setTimeout(() => {
            copySuccess.value = ''
        }, 3000)
    } finally {
        isExporting.value = false
    }
}

const navigateHome = () => {
    router.push('/')
}

// Load ranking data
onMounted(async () => {
    const datasetId = route.query.dataset
    const versionId = route.query.version || 'latest'

    // Store for use in Discord export
    currentDatasetId.value = datasetId
    currentVersionId.value = versionId

    if (!datasetId) {
        error.value = 'No dataset ID provided in URL'
        isLoading.value = false
        return
    }

    try {
        // Load the dataset version
        const targetVersionId = versionId === 'latest' ? null : versionId
        const result = await guildStore.loadDatasetVersion(datasetId, targetVersionId)

        if (!result || !result.version) {
            error.value = 'Dataset or version not found'
            isLoading.value = false
            return
        }

        const guilds = result.version.guilds || []
        const metadata = result.version.metadata || {}
        const actualVersionId = result.version.id

        // Load weights for this dataset (at dataset level, not version level)
        const weightsRef = doc(firestore, 'topheroes', 'guilds', 'datasets', datasetId, 'weights', 'default')
        const weightsSnap = await getDoc(weightsRef)

        let weights = {
            gvgWin: { enabled: true, weight: 20 },
            gvgScore: { enabled: true, weight: 20 },
            guildPower: { enabled: false, weight: 0 },
            kvkPrep: { enabled: true, weight: 30, mode: 'avgRank' },
            kvkWar: { enabled: true, weight: 30, mode: 'rank' }
        }

        if (weightsSnap.exists()) {
            const savedWeights = weightsSnap.data()
            weights = {
                gvgWin: savedWeights.gvgWin || weights.gvgWin,
                gvgScore: savedWeights.gvgScore || weights.gvgScore,
                guildPower: savedWeights.guildPower || weights.guildPower,
                kvkPrep: savedWeights.kvkPrep || weights.kvkPrep,
                kvkWar: savedWeights.kvkWar || weights.kvkWar
            }
        }

        // Calculate rankings (simplified version of the formula page logic)
        const rankings = calculateRankings(guilds, weights)

        // Build ranking data structure
        rankingData.value = {
            id: `${datasetId}_${actualVersionId}`,
            datasetId: datasetId,
            versionId: actualVersionId,
            datasetName: result.dataset?.name || datasetId,
            weights: weights,
            rankings: rankings,
            metadata: {
                totalGuilds: rankings.length,
                opponentServer: metadata.kvkGlobalSettings?.opponentServer || null,
                dailyResults: metadata.kvkGlobalSettings?.dailyResults || null,
                publishedAt: result.version.createdAt || new Date().toISOString(),
                publishedBy: 'system',
                version: 1,
                views: viewCount.value
            },
            stats: {
                avgScore: rankings.reduce((sum, r) => sum + r.totalScore, 0) / rankings.length,
                maxScore: Math.max(...rankings.map(r => r.totalScore)),
                minScore: Math.min(...rankings.map(r => r.totalScore)),
                topGuild: rankings[0]?.guild.name || null
            }
        }

        // Track view - increment counter in Firestore
        await trackView(datasetId, actualVersionId)

    } catch (err) {
        console.error('Error loading ranking:', err)
        error.value = `Failed to load ranking: ${err.message}`
    } finally {
        isLoading.value = false
    }
})

// Helper function to calculate rankings
const calculateRankings = (guilds, weights) => {
    const validGuilds = guilds.filter(g => g && (g.name || g.shorthand))
    const results = []

    // Calculate total weight
    let totalWeight = 0
    if (weights.gvgWin.enabled) totalWeight += weights.gvgWin.weight
    if (weights.gvgScore.enabled) totalWeight += weights.gvgScore.weight
    if (weights.guildPower.enabled) totalWeight += weights.guildPower.weight
    if (weights.kvkPrep.enabled) totalWeight += weights.kvkPrep.weight
    if (weights.kvkWar.enabled) totalWeight += weights.kvkWar.weight

    if (totalWeight !== 100) return [] // Invalid weights

    // First pass: Calculate raw data for all guilds
    const guildData = validGuilds.map(guild => {
        const rawData = {
            gvgWins: 0,
            gvgLosses: 0,
            gvgPoints: 0,
            gvgWon: false,
            gvgFlawless: false,
            gvgTotalScore: 0,
            invasionStatus: null,
            kvkPrepAvgRank: null,
            kvkPrepTotalScore: 0,
            kvkWarRank: null,
            kvkWarScore: 0
        }

        // Calculate GvG stats
        if (guild.gvgDays && Array.isArray(guild.gvgDays)) {
            rawData.gvgWins = guild.gvgDays.filter(day => day.won).length
            rawData.gvgLosses = guild.gvgDays.filter(day => !day.won && day.score !== null && day.score !== undefined).length
            
            // Calculate points: Days 1-5 worth 2 points, Day 6 worth 4 points
            rawData.gvgPoints = guild.gvgDays.reduce((points, day, index) => {
                if (day.won) {
                    return points + (index < 5 ? 2 : 4)
                }
                return points
            }, 0)
            
            // Win if 8+ points
            rawData.gvgWon = rawData.gvgPoints >= 8
            
            // Flawless if all 6 days won
            rawData.gvgFlawless = rawData.gvgWins === 6
            
            // Check invasion status based on first 5 days
            const first5Days = guild.gvgDays.slice(0, 5)
            const first5Wins = first5Days.filter(day => day.won).length
            const first5Losses = first5Days.filter(day => !day.won && day.score !== null && day.score !== undefined).length
            
            if (first5Wins >= 3) {
                rawData.invasionStatus = 'can-invade'
            } else if (first5Losses >= 3) {
                rawData.invasionStatus = 'can-be-invaded'
            }
            
            rawData.gvgTotalScore = guild.gvgDays.reduce((sum, day) => sum + (day.score || 0), 0)
        }

        // Calculate KvK Prep stats (first 5 days)
        if (guild.kvkPrepDays && Array.isArray(guild.kvkPrepDays)) {
            // Use first 5 days for prep
            const prepDays = guild.kvkPrepDays.slice(0, 5)
            const validRanks = prepDays.filter(day => day && day.rank !== null && day.rank !== undefined)
            if (validRanks.length > 0) {
                rawData.kvkPrepAvgRank = validRanks.reduce((sum, day) => sum + day.rank, 0) / validRanks.length
            }
            rawData.kvkPrepTotalScore = prepDays.reduce((sum, day) => {
                return sum + ((day && typeof day.score === 'number') ? day.score : 0)
            }, 0)
        }

        // Calculate KvK War stats (day 6 = index 5)
        if (guild.kvkPrepDays && guild.kvkPrepDays[5]) {
            const warDay = guild.kvkPrepDays[5]
            rawData.kvkWarRank = (warDay && typeof warDay.rank === 'number') ? warDay.rank : null
            rawData.kvkWarScore = (warDay && typeof warDay.score === 'number') ? warDay.score : 0
        }

        return {
            guild,
            rawData
        }
    })

    // Find max values for normalization
    const maxGvGScore = Math.max(...guildData.map(g => g.rawData.gvgTotalScore), 1)
    const maxPower = Math.max(...guildData.map(g => g.guild.guildPower || 0), 1)
    const maxKvKPrepScore = Math.max(...guildData.map(g => g.rawData.kvkPrepTotalScore), 1)
    const maxKvKWarScore = Math.max(...guildData.map(g => g.rawData.kvkWarScore), 1)
    const maxKvKPrepRank = Math.max(...guildData.map(g => g.rawData.kvkPrepAvgRank || 0), 1)
    const maxKvKWarRank = Math.max(...guildData.map(g => g.rawData.kvkWarRank || 0), 1)

    // Second pass: Calculate normalized scores
    guildData.forEach(({ guild, rawData }) => {
        const scores = {
            gvgWin: 0,
            gvgScore: 0,
            guildPower: 0,
            kvkPrep: 0,
            kvkWar: 0
        }

        let totalScore = 0

        // GvG Win Record (binary: won = full weight, lost = 0)
        if (weights.gvgWin.enabled) {
            scores.gvgWin = rawData.gvgWon ? weights.gvgWin.weight : 0
            totalScore += scores.gvgWin
        }

        // GvG Total Score (normalized)
        if (weights.gvgScore.enabled && maxGvGScore > 0) {
            scores.gvgScore = (rawData.gvgTotalScore / maxGvGScore) * weights.gvgScore.weight
            totalScore += scores.gvgScore
        }

        // Guild Power (normalized)
        if (weights.guildPower.enabled && maxPower > 0) {
            scores.guildPower = ((guild.guildPower || 0) / maxPower) * weights.guildPower.weight
            totalScore += scores.guildPower
        }

        // KvK Prep (depends on mode)
        if (weights.kvkPrep.enabled) {
            if (weights.kvkPrep.mode === 'avgRank' && rawData.kvkPrepAvgRank !== null && maxKvKPrepRank > 0) {
                // Lower rank is better, so invert: (max - current + 1) / max
                scores.kvkPrep = ((maxKvKPrepRank - rawData.kvkPrepAvgRank + 1) / maxKvKPrepRank) * weights.kvkPrep.weight
            } else if (weights.kvkPrep.mode === 'totalScore' && maxKvKPrepScore > 0) {
                // Higher score is better
                scores.kvkPrep = (rawData.kvkPrepTotalScore / maxKvKPrepScore) * weights.kvkPrep.weight
            }
            totalScore += scores.kvkPrep
        }

        // KvK War (depends on mode)
        if (weights.kvkWar.enabled) {
            if (weights.kvkWar.mode === 'rank' && rawData.kvkWarRank !== null && maxKvKWarRank > 0) {
                // Lower rank is better
                scores.kvkWar = ((maxKvKWarRank - rawData.kvkWarRank + 1) / maxKvKWarRank) * weights.kvkWar.weight
            } else if (weights.kvkWar.mode === 'score' && maxKvKWarScore > 0) {
                // Higher score is better
                scores.kvkWar = (rawData.kvkWarScore / maxKvKWarScore) * weights.kvkWar.weight
            }
            totalScore += scores.kvkWar
        }

        results.push({
            rank: 0, // Will be set after sorting
            guild: {
                name: guild.name,
                shorthand: guild.shorthand,
                guildPower: guild.guildPower
            },
            scores,
            rawData,
            totalScore
        })
    })

    // Sort and assign ranks
    results.sort((a, b) => b.totalScore - a.totalScore)
    results.forEach((result, index) => {
        result.rank = index + 1
    })

    return results
}

// Track view count
const trackView = async (datasetId, versionId) => {
    try {
        const viewRef = doc(firestore, 'topheroes', 'guilds', 'datasets', datasetId, 'versions', versionId, 'stats', 'views')
        const viewSnap = await getDoc(viewRef)
        
        if (viewSnap.exists()) {
            viewCount.value = viewSnap.data().count || 0
            // Increment view count
            await updateDoc(viewRef, {
                count: increment(1),
                lastViewed: new Date().toISOString()
            })
            viewCount.value += 1
        } else {
            // Initialize view counter with setDoc instead of updateDoc
            await setDoc(viewRef, {
                count: 1,
                firstViewed: new Date().toISOString(),
                lastViewed: new Date().toISOString()
            })
            viewCount.value = 1
        }
    } catch (err) {
        console.error('Error tracking view:', err)
        // Don't fail the whole page if view tracking fails
    }
}

</script>

<style scoped>
/* Custom scrollbar */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(163, 230, 53, 0.6) rgba(6, 78, 59, 0.5);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(6, 78, 59, 0.5);
    border-radius: 5px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(163, 230, 53, 0.6), rgba(74, 222, 128, 0.6));
    border-radius: 5px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgba(163, 230, 53, 0.8), rgba(74, 222, 128, 0.8));
}

/* Smooth transitions */
* {
    transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

/* Shimmer animation for flawless badge */
@keyframes shimmer {
    0%, 100% {
        opacity: 1;
        filter: drop-shadow(0 0 4px rgba(250, 204, 21, 0.8));
    }
    50% {
        opacity: 0.6;
        filter: drop-shadow(0 0 8px rgba(250, 204, 21, 1));
    }
}

.animate-pulse {
    animation: shimmer 2s ease-in-out infinite;
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
}
</style>