<template>
    <div class="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 p-3 py-0 sm:p-6 md:py-16">
        <div class="max-w-[1920px] mx-auto">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
                <div class="text-center">
                    <RefreshCw class="w-16 h-16 text-lime-400 animate-spin mx-auto mb-4" />
                    <p class="text-lime-300 text-xl">Loading data...</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error"
                class="max-w-2xl mx-auto bg-red-900/30 backdrop-blur-lg rounded-2xl p-6 border-2 border-red-400/50">
                <div class="flex items-center gap-3 mb-4">
                    <AlertCircle class="w-8 h-8 text-red-400 flex-shrink-0" />
                    <h2 class="text-2xl font-bold text-red-300">Data Not Found</h2>
                </div>
                <p class="text-red-200 mb-6">{{ error }}</p>
                <Button @click="navigateHome" class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold">
                    <Home class="w-4 h-4 mr-2" />
                    Go to Homepage
                </Button>
            </div>

            <!-- Main Content -->
            <div v-else-if="explorerData">
                <!-- Header -->
                <div class="text-center mb-6 sm:mb-8">
                    <div class="flex items-center justify-center gap-3 mb-3">
                        <BarChart3 class="w-8 sm:w-12 h-8 sm:h-12 text-lime-400" />
                        <h1
                            class="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
                            Data Explorer
                        </h1>
                    </div>
                    <p class="text-lime-200/80 text-sm sm:text-lg mb-2">{{ explorerData.datasetName }}</p>
                    <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-lime-300/70">
                        <div class="flex items-center gap-1">
                            <Users class="w-4 h-4" />
                            <span>{{ explorerData.guilds.length }} guilds</span>
                        </div>
                        <div v-if="explorerData.metadata?.opponentServer" class="flex items-center gap-1">
                            <Globe class="w-4 h-4" />
                            <span>vs {{ explorerData.metadata.opponentServer }}</span>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats Overview -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <!-- GvG Stats -->
                    <div v-if="insights.hasGvGData"
                        class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-xl p-4 border-2 border-lime-400/30">
                        <div class="flex items-center gap-2 mb-2">
                            <Trophy class="w-5 h-5 text-yellow-400" />
                            <div class="text-xs text-lime-300/70">Flawless</div>
                        </div>
                        <div class="text-2xl font-bold text-lime-300">{{ insights.flawlessCount }}</div>
                        <div class="text-xs text-lime-400/60">Perfect 6-0</div>
                    </div>

                    <div v-if="insights.hasGvGData"
                        class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-xl p-4 border-2 border-lime-400/30">
                        <div class="flex items-center gap-2 mb-2">
                            <Zap class="w-5 h-5 text-lime-400" />
                            <div class="text-xs text-lime-300/70">Avg Points</div>
                        </div>
                        <div class="text-2xl font-bold text-lime-300">{{ insights.avgGvGPoints ? insights.avgGvGPoints.toFixed(1) : '0.0' }}</div>
                        <div class="text-xs text-lime-400/60">GvG Points</div>
                    </div>

                    <div v-if="insights.hasGvGData"
                        class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-xl p-4 border-2 border-lime-400/30">
                        <div class="flex items-center gap-2 mb-2">
                            <Shield class="w-5 h-5 text-green-400" />
                            <div class="text-xs text-lime-300/70">Can Invade</div>
                        </div>
                        <div class="text-2xl font-bold text-lime-300">{{ insights.canInvadeCount }}</div>
                        <div class="text-xs text-lime-400/60">Defensive Edge</div>
                    </div>

                    <div v-if="insights.hasGvGData"
                        class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-xl p-4 border-2 border-lime-400/30">
                        <div class="flex items-center gap-2 mb-2">
                            <Sword class="w-5 h-5 text-red-400" />
                            <div class="text-xs text-lime-300/70">At Risk</div>
                        </div>
                        <div class="text-2xl font-bold text-lime-300">{{ insights.canBeInvadedCount }}</div>
                        <div class="text-xs text-lime-400/60">Invasion Risk</div>
                    </div>

                    <!-- KvK Stats -->
                    <div v-if="insights.hasKvKData"
                        class="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-lg rounded-xl p-4 border-2 border-purple-400/30">
                        <div class="flex items-center gap-2 mb-2">
                            <Globe class="w-5 h-5 text-purple-400" />
                            <div class="text-xs text-purple-300/70">KvK Days</div>
                        </div>
                        <div class="text-2xl font-bold text-purple-300">{{ insights.kvkDaysPlayed }}</div>
                        <div class="text-xs text-purple-400/60">Days of Data</div>
                    </div>

                    <div v-if="insights.hasKvKData"
                        class="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-lg rounded-xl p-4 border-2 border-purple-400/30">
                        <div class="flex items-center gap-2 mb-2">
                            <Target class="w-5 h-5 text-purple-400" />
                            <div class="text-xs text-purple-300/70">Avg Rank</div>
                        </div>
                        <div class="text-2xl font-bold text-purple-300">{{ insights.avgKvKRank ? insights.avgKvKRank.toFixed(1) : 'N/A' }}
                        </div>
                        <div class="text-xs text-purple-400/60">Prep Stage</div>
                    </div>
                </div>

                <!-- Top Performers & Interesting Insights -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <!-- Over Performers -->
                    <div
                        class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30">
                        <div class="flex items-center gap-2 mb-4">
                            <TrendingUp class="w-5 h-5 text-lime-400" />
                            <h2 class="text-lg sm:text-xl font-bold text-lime-300">Over Performers</h2>
                        </div>
                        <div class="text-xs text-lime-300/60 mb-3">Ranking higher than power suggests</div>
                        <div v-if="insights.overPerformers.length > 0" class="space-y-2">
                            <div v-for="guild in insights.overPerformers" :key="guild.shorthand"
                                class="bg-green-950/50 rounded-lg p-3 border border-lime-500/20">
                                <div class="flex items-center justify-between mb-1">
                                    <div class="font-semibold text-lime-200">{{ guild.name }}</div>
                                    <Badge class="bg-green-600/20 border-green-500 text-green-300">+{{
                                        guild.differential }}</Badge>
                                </div>
                                <div class="text-xs text-lime-300/60">
                                    Ranked #{{ guild.actualRank }} • Power Rank #{{ guild.powerRank }}
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center text-lime-300/50 text-sm py-4">
                            No significant over-performers detected
                        </div>
                    </div>

                    <!-- Under Performers -->
                    <div
                        class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30">
                        <div class="flex items-center gap-2 mb-4">
                            <TrendingDown class="w-5 h-5 text-orange-400" />
                            <h2 class="text-lg sm:text-xl font-bold text-lime-300">Under Performers</h2>
                        </div>
                        <div class="text-xs text-lime-300/60 mb-3">Ranking lower than power suggests</div>
                        <div v-if="insights.underPerformers.length > 0" class="space-y-2">
                            <div v-for="guild in insights.underPerformers" :key="guild.shorthand"
                                class="bg-green-950/50 rounded-lg p-3 border border-lime-500/20">
                                <div class="flex items-center justify-between mb-1">
                                    <div class="font-semibold text-lime-200">{{ guild.name }}</div>
                                    <Badge class="bg-orange-600/20 border-orange-500 text-orange-300">{{
                                        guild.differential }}</Badge>
                                </div>
                                <div class="text-xs text-lime-300/60">
                                    Ranked #{{ guild.actualRank }} • Power Rank #{{ guild.powerRank }}
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center text-lime-300/50 text-sm py-4">
                            No significant under-performers detected
                        </div>
                    </div>
                </div>

                <!-- Score Distribution by Day -->
                <div
                    class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30 mb-6">
                    <div class="flex items-center gap-2 mb-4">
                        <Star class="w-5 h-5 text-yellow-400" />
                        <h2 class="text-lg sm:text-xl font-bold text-lime-300">Score Distribution by Day</h2>
                    </div>
                    <div class="text-xs text-lime-300/60 mb-4">Average percentage of total score achieved each day</div>

                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        <div v-for="day in 6" :key="'dist-' + day"
                            class="bg-green-950/50 rounded-lg p-3 border border-lime-500/20">
                            <div class="text-xs text-lime-300/60 mb-2">Day {{ day }}</div>
                            <div class="text-2xl font-bold text-lime-300">{{ insights.scoreDistribution[day]?.avgPercent ? insights.scoreDistribution[day].avgPercent.toFixed(1) : '0' }}%</div>
                            <div class="text-xs text-lime-400/60 mt-1">
                                Avg: {{ insights.scoreDistribution[day]?.avgScore ? formatNumber(insights.scoreDistribution[day].avgScore) : '0' }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- GvG Analysis -->
                <div v-if="insights.hasGvGData"
                    class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30 mb-6">
                    <div class="flex items-center gap-2 mb-4">
                        <Swords class="w-5 h-5 text-lime-400" />
                        <h2 class="text-lg sm:text-xl font-bold text-lime-300">GvG Analysis</h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <!-- Points Distribution -->
                        <div>
                            <h3 class="text-sm font-semibold text-lime-300 mb-3">Points Distribution</h3>
                            <div class="space-y-2">
                                <div v-for="(count, points) in insights.pointsDistribution" :key="points"
                                    class="flex items-center gap-2">
                                    <div class="text-xs text-lime-300/70 w-16">{{ points }} pts</div>
                                    <div class="flex-1 bg-green-950/50 rounded-full h-6 overflow-hidden">
                                        <div class="bg-gradient-to-r from-lime-500 to-green-500 h-full flex items-center justify-end pr-2"
                                            :style="{ width: `${(count / explorerData.guilds.length) * 100}%` }">
                                            <span class="text-xs font-semibold text-green-950">{{ count }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Win/Loss Stats -->
                        <div>
                            <h3 class="text-sm font-semibold text-lime-300 mb-3">Win/Loss Statistics</h3>
                            <div class="space-y-3">
                                <div class="bg-green-950/50 rounded-lg p-3">
                                    <div class="text-xs text-lime-300/60 mb-1">Total Matches</div>
                                    <div class="text-2xl font-bold text-lime-300">{{ insights.totalWins +
                                        insights.totalLosses }}</div>
                                    <div class="flex gap-4 mt-2 text-xs">
                                        <div class="text-green-400">Wins: {{ insights.totalWins }}</div>
                                        <div class="text-red-400">Losses: {{ insights.totalLosses }}</div>
                                    </div>
                                </div>
                                <div class="bg-green-950/50 rounded-lg p-3">
                                    <div class="text-xs text-lime-300/60 mb-1">Guilds that Won Overall</div>
                                    <div class="text-2xl font-bold text-lime-300">{{ insights.guildsWon }}</div>
                                    <div class="text-xs text-lime-400/60 mt-1">Guilds that Lost: {{
                                        insights.guildsLost }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Daily Performance -->
                    <div class="mb-6">
                        <h3 class="text-sm font-semibold text-lime-300 mb-3">Daily Performance</h3>
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            <div v-for="day in 6" :key="day" class="bg-green-950/50 rounded-lg p-3">
                                <div class="text-xs text-lime-300/60 mb-2">Day {{ day }}</div>
                                <div class="text-xl font-bold text-lime-300">{{
                                    insights.dayStats[day]?.wins || 0 }} <span class="text-sm text-lime-400/60">wins</span></div>
                                <div class="text-xs text-lime-400/60">of {{ insights.dayStats[day]?.total || 0 }} • {{
                                    insights.dayStats[day]?.winRate ? insights.dayStats[day].winRate.toFixed(0) : '0' }}%</div>
                                <div class="text-xs text-lime-400/60 mt-1">Avg: {{
                                    insights.dayStats[day]?.avgScore ? formatNumber(insights.dayStats[day].avgScore) : '0' }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Interesting Insights -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="bg-green-950/50 rounded-lg p-3 border border-lime-500/20">
                            <div class="text-xs text-lime-300/60 mb-1">🏆 Best Day 6 Performance</div>
                            <div class="font-semibold text-lime-200">{{ insights.bestDay6?.name || 'N/A' }}</div>
                            <div class="text-xs text-lime-400/60">{{ insights.bestDay6?.score ? formatNumber(insights.bestDay6.score) : 'N/A' }}</div>
                        </div>

                        <div class="bg-green-950/50 rounded-lg p-3 border border-lime-500/20">
                            <div class="text-xs text-lime-300/60 mb-1">💥 Highest Single Day</div>
                            <div class="font-semibold text-lime-200">{{ insights.highestSingleDay?.name || 'N/A' }}</div>
                            <div class="text-xs text-lime-400/60">Day {{ insights.highestSingleDay?.day || '-' }}: {{ insights.highestSingleDay?.score ? formatNumber(insights.highestSingleDay.score) : 'N/A' }}</div>
                        </div>

                        <div class="bg-green-950/50 rounded-lg p-3 border border-lime-500/20">
                            <div class="text-xs text-lime-300/60 mb-1">📊 Highest Avg Daily</div>
                            <div class="font-semibold text-lime-200">{{ insights.highestAvgDaily?.name || 'N/A' }}</div>
                            <div class="text-xs text-lime-400/60">Avg: {{ insights.highestAvgDaily?.avgDaily ? formatNumber(insights.highestAvgDaily.avgDaily) : 'N/A' }}</div>
                        </div>
                    </div>
                </div>

                <!-- KvK Analysis -->
                <div v-if="insights.hasKvKData"
                    class="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-purple-400/30 mb-6">
                    <div class="flex items-center gap-2 mb-4">
                        <Globe class="w-5 h-5 text-purple-400" />
                        <h2 class="text-lg sm:text-xl font-bold text-purple-300">KvK Analysis</h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <!-- Prep Stage Stats -->
                        <div>
                            <h3 class="text-sm font-semibold text-purple-300 mb-3">Prep Stage (Days 1-5)</h3>
                            <div class="space-y-3">
                                <div class="bg-purple-950/50 rounded-lg p-3">
                                    <div class="text-xs text-purple-300/60 mb-1">Total Score</div>
                                    <div class="text-2xl font-bold text-purple-300">{{
                                        formatNumber(insights.kvkStats.totalPrepScore) }}</div>
                                </div>
                                <div class="bg-purple-950/50 rounded-lg p-3">
                                    <div class="text-xs text-purple-300/60 mb-1">Average Rank</div>
                                    <div class="text-2xl font-bold text-purple-300">{{
                                        insights.kvkStats.avgRank ? insights.kvkStats.avgRank.toFixed(1) : 'N/A' }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- War Day Stats -->
                        <div v-if="insights.kvkStats.hasWarData">
                            <h3 class="text-sm font-semibold text-purple-300 mb-3">War Day (Day 6)</h3>
                            <div class="space-y-3">
                                <div class="bg-purple-950/50 rounded-lg p-3">
                                    <div class="text-xs text-purple-300/60 mb-1">Total War Score</div>
                                    <div class="text-2xl font-bold text-purple-300">{{
                                        formatNumber(insights.kvkStats.totalWarScore) }}</div>
                                </div>
                                <div class="bg-purple-950/50 rounded-lg p-3">
                                    <div class="text-xs text-purple-300/60 mb-1">Guilds Participated</div>
                                    <div class="text-2xl font-bold text-purple-300">{{
                                        insights.kvkStats.warParticipants }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Daily KvK Performance -->
                    <div class="mb-6">
                        <h3 class="text-sm font-semibold text-purple-300 mb-3">Daily Prep Performance</h3>
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            <div v-for="day in 5" :key="day" class="bg-purple-950/50 rounded-lg p-3">
                                <div class="text-xs text-purple-300/60 mb-2">Day {{ day }}</div>
                                <div class="text-xs text-purple-400/60 mb-1">Avg Score</div>
                                <div class="text-lg font-bold text-purple-300">{{
                                    insights.kvkStats.dailyStats[day]?.avgScore ? formatNumber(insights.kvkStats.dailyStats[day].avgScore) : '0' }}</div>
                                <div class="text-xs text-purple-400/60 mt-1">Avg Rank: {{
                                    insights.kvkStats.dailyStats[day]?.avgRank ? insights.kvkStats.dailyStats[day].avgRank.toFixed(1) : 'N/A' }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Top KvK Performers -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-purple-950/50 rounded-lg p-3 border border-purple-500/20">
                            <div class="text-xs text-purple-300/60 mb-1">🏆 Top Prep Score</div>
                            <div class="font-semibold text-purple-200">{{ insights.kvkStats.topPrepGuild?.name || 'N/A'
                                }}</div>
                            <div class="text-xs text-purple-400/60">{{
                                insights.kvkStats.topPrepGuild?.kvk?.prepTotal ? formatNumber(insights.kvkStats.topPrepGuild.kvk.prepTotal) : 'N/A' }}</div>
                        </div>

                        <div v-if="insights.kvkStats.hasWarData"
                            class="bg-purple-950/50 rounded-lg p-3 border border-purple-500/20">
                            <div class="text-xs text-purple-300/60 mb-1">⚔️ Top War Score</div>
                            <div class="font-semibold text-purple-200">{{ insights.kvkStats.topWarGuild?.name || 'N/A'
                                }}</div>
                            <div class="text-xs text-purple-400/60">{{
                                insights.kvkStats.topWarGuild?.kvk?.warScore ? formatNumber(insights.kvkStats.topWarGuild.kvk.warScore) : 'N/A' }}</div>
                        </div>
                    </div>
                </div>

                <!-- Export Button -->
                <div class="mb-6 flex justify-end">
                    <Button @click="exportDataToCSV" size="sm"
                        class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold">
                        <Download class="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>

                <!-- GvG Data Table -->
                <div v-if="insights.hasGvGData"
                    class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30 mb-6">
                    <div class="flex items-center gap-2 mb-4">
                        <Swords class="w-5 h-5 text-lime-400" />
                        <h2 class="text-lg sm:text-xl font-bold text-lime-300">Guild vs Guild Performance</h2>
                    </div>
                    <div class="overflow-x-auto custom-scrollbar">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b-2 border-lime-400/30">
                                    <th @click="sortTable('gvg', 'rank')"
                                        class="text-left py-2 px-3 text-lime-300 cursor-pointer hover:text-lime-200">
                                        Rank <ArrowUpDown class="inline w-3 h-3" />
                                    </th>
                                    <th @click="sortTable('gvg', 'name')"
                                        class="text-left py-2 px-3 text-lime-300 cursor-pointer hover:text-lime-200">
                                        Guild <ArrowUpDown class="inline w-3 h-3" />
                                    </th>
                                    <th @click="sortTable('gvg', 'power')"
                                        class="text-right py-2 px-3 text-lime-300 cursor-pointer hover:text-lime-200">
                                        Power <ArrowUpDown class="inline w-3 h-3" />
                                    </th>
                                    <th @click="sortTable('gvg', 'totalScore')"
                                        class="text-right py-2 px-3 text-lime-300 cursor-pointer hover:text-lime-200">
                                        Total Score <ArrowUpDown class="inline w-3 h-3" />
                                    </th>
                                    <th @click="sortTable('gvg', 'points')"
                                        class="text-center py-2 px-3 text-lime-300 cursor-pointer hover:text-lime-200">
                                        GvG Pts <ArrowUpDown class="inline w-3 h-3" />
                                    </th>
                                    <th v-for="day in 6" :key="'day-' + day" @click="sortTable('gvg', `day${day}`)"
                                        class="text-center py-2 px-3 text-lime-300 cursor-pointer hover:text-lime-200">
                                        D{{ day }} <ArrowUpDown class="inline w-3 h-3" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(guild, index) in sortedGvGGuilds" :key="guild.shorthand"
                                    class="border-b border-lime-500/10 hover:bg-green-950/30">
                                    <td class="py-2 px-3 text-lime-200">{{ index + 1 }}</td>
                                    <td class="py-2 px-3 text-lime-200">
                                        <div class="font-semibold">{{ guild.name }}</div>
                                        <div class="text-xs text-lime-400/60">{{ guild.shorthand }}</div>
                                    </td>
                                    <td class="py-2 px-3 text-right text-lime-200">{{
                                        formatNumber(guild.power) }}</td>
                                    <td class="py-2 px-3 text-right font-semibold text-lime-300">{{
                                        formatNumber(guild.totalScore) }}</td>
                                    <td class="py-2 px-3 text-center">
                                        <Badge :class="guild.won ? 'bg-green-600/20 border-green-500 text-green-300' : 'bg-red-600/20 border-red-500 text-red-300'">
                                            {{ guild.points }}
                                        </Badge>
                                    </td>
                                    <td v-for="day in 6" :key="'score-' + day" class="py-2 px-3 text-center">
                                        <div v-if="guild.dayScores[day - 1] !== null"
                                            :class="guild.dayWins[day - 1] ? 'text-green-400 font-semibold' : 'text-red-400'">
                                            {{ formatNumber(guild.dayScores[day - 1]) }}
                                        </div>
                                        <div v-else class="text-lime-400/30">-</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- KvK Data Table -->
                <div v-if="insights.hasKvKData"
                    class="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-purple-400/30 mb-6">
                    <div class="flex items-center gap-2 mb-4">
                        <Globe class="w-5 h-5 text-purple-400" />
                        <h2 class="text-lg sm:text-xl font-bold text-purple-300">Kingdom vs Kingdom Performance</h2>
                    </div>
                    <div class="overflow-x-auto custom-scrollbar">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b-2 border-purple-400/30">
                                    <th @click="sortTable('kvk', 'rank')"
                                        class="text-left py-2 px-3 text-purple-300 cursor-pointer hover:text-purple-200">
                                        Rank <ArrowUpDown class="inline w-3 h-3" />
                                    </th>
                                    <th @click="sortTable('kvk', 'name')"
                                        class="text-left py-2 px-3 text-purple-300 cursor-pointer hover:text-purple-200">
                                        Guild <ArrowUpDown class="inline w-3 h-3" />
                                    </th>
                                    <th @click="sortTable('kvk', 'power')"
                                        class="text-right py-2 px-3 text-purple-300 cursor-pointer hover:text-purple-200">
                                        Power <ArrowUpDown class="inline w-3 h-3" />
                                    </th>
                                    <th @click="sortTable('kvk', 'prepTotal')"
                                        class="text-right py-2 px-3 text-purple-300 cursor-pointer hover:text-purple-200">
                                        Prep Total <ArrowUpDown class="inline w-3 h-3" />
                                    </th>
                                    <th @click="sortTable('kvk', 'avgRank')"
                                        class="text-center py-2 px-3 text-purple-300 cursor-pointer hover:text-purple-200">
                                        Avg Rank <ArrowUpDown class="inline w-3 h-3" />
                                    </th>
                                    <th v-for="day in 5" :key="'prep-' + day" @click="sortTable('kvk', `prep${day}`)"
                                        class="text-center py-2 px-3 text-purple-300 cursor-pointer hover:text-purple-200">
                                        D{{ day }} <ArrowUpDown class="inline w-3 h-3" />
                                    </th>
                                    <th @click="sortTable('kvk', 'warScore')"
                                        class="text-center py-2 px-3 text-purple-300 cursor-pointer hover:text-purple-200">
                                        War <ArrowUpDown class="inline w-3 h-3" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(guild, index) in sortedKvKGuilds" :key="guild.shorthand"
                                    class="border-b border-purple-500/10 hover:bg-purple-950/30">
                                    <td class="py-2 px-3 text-purple-200">{{ index + 1 }}</td>
                                    <td class="py-2 px-3 text-purple-200">
                                        <div class="font-semibold">{{ guild.name }}</div>
                                        <div class="text-xs text-purple-400/60">{{ guild.shorthand }}</div>
                                    </td>
                                    <td class="py-2 px-3 text-right text-purple-200">{{
                                        formatNumber(guild.power) }}</td>
                                    <td class="py-2 px-3 text-right font-semibold text-purple-300">{{
                                        formatNumber(guild.kvk.prepTotal) }}</td>
                                    <td class="py-2 px-3 text-center text-purple-200">{{ guild.kvk.avgRank ? guild.kvk.avgRank.toFixed(1) : 'N/A' }}</td>
                                    <td v-for="day in 5" :key="'prep-score-' + day" class="py-2 px-3 text-center">
                                        <div v-if="guild.kvk.prepScores[day - 1] !== null" class="text-purple-300">
                                            {{ formatNumber(guild.kvk.prepScores[day - 1]) }}
                                            <div class="text-xs text-purple-400/60">({{
                                                guild.kvk.prepRanks[day - 1] || '-' }})</div>
                                        </div>
                                        <div v-else class="text-purple-400/30">-</div>
                                    </td>
                                    <td class="py-2 px-3 text-center">
                                        <div v-if="guild.kvk.warScore !== null" class="text-purple-300 font-semibold">
                                            {{ formatNumber(guild.kvk.warScore) }}
                                            <div v-if="guild.kvk.warRank" class="text-xs text-purple-400/60">(Rank {{
                                                guild.kvk.warRank }})</div>
                                        </div>
                                        <div v-else class="text-purple-400/30">-</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGuildDataStore } from '@/stores/useGuildDataStore'
import {
    BarChart3, Users, Trophy, Shield, Sword, Zap, Globe, TrendingUp, TrendingDown,
    Swords, AlertCircle, RefreshCw, Home, Download, Table2, Star, Target, ArrowUpDown
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const router = useRouter()
const route = useRoute()
const guildStore = useGuildDataStore()

const isLoading = ref(true)
const error = ref(null)
const explorerData = ref(null)
const gvgSortConfig = ref({ field: 'totalScore', direction: 'desc' })
const kvkSortConfig = ref({ field: 'prepTotal', direction: 'desc' })

const navigateHome = () => {
    router.push('/')
}

// Format number with comma delimiters and no decimals
const formatNumber = (value) => {
    if (!value && value !== 0) return '0'
    return Math.round(Number(value)).toLocaleString()
}

// Calculate comprehensive insights
const insights = computed(() => {
    if (!explorerData.value) return {}

    const guilds = explorerData.value.guilds

    // Check if we have GvG or KvK data
    const hasGvGData = guilds.some(g => g.totalScore > 0)
    const hasKvKData = guilds.some(g => g.kvk && g.kvk.prepTotal > 0)

    // Power-based performance analysis
    const guildsWithPower = guilds.filter(g => g.power > 0)
    const sortedByScore = [...guildsWithPower].sort((a, b) => b.totalScore - a.totalScore)
    const sortedByPower = [...guildsWithPower].sort((a, b) => b.power - a.power)

    const performanceData = sortedByScore.map((guild, actualIndex) => {
        const powerIndex = sortedByPower.findIndex(g => g.shorthand === guild.shorthand)
        return {
            ...guild,
            actualRank: actualIndex + 1,
            powerRank: powerIndex + 1,
            differential: powerIndex - actualIndex
        }
    })

    const overPerformers = performanceData
        .filter(g => g.differential >= 2)
        .sort((a, b) => b.differential - a.differential)
        .slice(0, 5)

    const underPerformers = performanceData
        .filter(g => g.differential <= -2)
        .sort((a, b) => a.differential - b.differential)
        .slice(0, 5)

    // GvG Stats
    const pointsDistribution = {}
    const dayStats = {}
    for (let day = 1; day <= 6; day++) {
        const scores = guilds.map(g => g.dayScores[day - 1]).filter(s => s !== null)
        const wins = guilds.filter(g => g.dayWins[day - 1]).length
        dayStats[day] = {
            total: scores.length,
            wins,
            winRate: scores.length > 0 ? (wins / scores.length) * 100 : 0,
            avgScore: scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0
        }
    }

    guilds.forEach(guild => {
        const pts = guild.points || 0
        pointsDistribution[pts] = (pointsDistribution[pts] || 0) + 1
    })

    // Score distribution by day (% of total score)
    const scoreDistribution = {}
    for (let day = 1; day <= 6; day++) {
        const guildsWithDay = guilds.filter(g => g.dayScores[day - 1] !== null && g.totalScore > 0)
        if (guildsWithDay.length > 0) {
            const percentages = guildsWithDay.map(g => (g.dayScores[day - 1] / g.totalScore) * 100)
            const scores = guildsWithDay.map(g => g.dayScores[day - 1])
            scoreDistribution[day] = {
                avgPercent: percentages.reduce((sum, p) => sum + p, 0) / percentages.length,
                avgScore: scores.reduce((sum, s) => sum + s, 0) / scores.length
            }
        } else {
            scoreDistribution[day] = { avgPercent: 0, avgScore: 0 }
        }
    }

    // Interesting insights
    const day6Guilds = guilds.filter(g => g.dayScores[5] !== null)
    const bestDay6 = day6Guilds.length > 0
        ? day6Guilds.reduce((best, guild) => guild.dayScores[5] > (best?.dayScores[5] || 0) ? guild : best, null)
        : null

    // Highest single day score (any day)
    let highestSingleDay = null
    let highestScore = 0
    guilds.forEach(guild => {
        guild.dayScores.forEach((score, index) => {
            if (score !== null && score > highestScore) {
                highestScore = score
                highestSingleDay = {
                    ...guild,
                    day: index + 1,
                    score
                }
            }
        })
    })

    // Highest average daily score
    const highestAvgDaily = guilds
        .map(guild => {
            const scores = guild.dayScores.filter(s => s !== null)
            const avg = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0
            return { ...guild, avgDaily: avg }
        })
        .filter(g => g.avgDaily > 0)
        .sort((a, b) => b.avgDaily - a.avgDaily)[0] || null

    // KvK Stats
    let kvkStats = {
        hasWarData: false,
        totalPrepScore: 0,
        totalWarScore: 0,
        avgRank: null,
        warParticipants: 0,
        dailyStats: {},
        topPrepGuild: null,
        topWarGuild: null
    }

    if (hasKvKData) {
        const guildsWithKvK = guilds.filter(g => g.kvk && g.kvk.prepTotal > 0)
        kvkStats.totalPrepScore = guildsWithKvK.reduce((sum, g) => sum + g.kvk.prepTotal, 0)

        const ranksData = guildsWithKvK.filter(g => g.kvk.avgRank !== null).map(g => g.kvk.avgRank)
        kvkStats.avgRank = ranksData.length > 0
            ? ranksData.reduce((sum, r) => sum + r, 0) / ranksData.length
            : null

        // War day stats
        const guildsWithWar = guildsWithKvK.filter(g => g.kvk.warScore !== null)
        if (guildsWithWar.length > 0) {
            kvkStats.hasWarData = true
            kvkStats.totalWarScore = guildsWithWar.reduce((sum, g) => sum + g.kvk.warScore, 0)
            kvkStats.warParticipants = guildsWithWar.length
            kvkStats.topWarGuild = guildsWithWar.reduce((best, guild) =>
                guild.kvk.warScore > (best?.kvk.warScore || 0) ? guild : best, null)
        }

        // Daily prep stats
        for (let day = 1; day <= 5; day++) {
            const dayScores = guildsWithKvK
                .map(g => g.kvk.prepScores[day - 1])
                .filter(s => s !== null)
            const dayRanks = guildsWithKvK
                .map(g => g.kvk.prepRanks[day - 1])
                .filter(r => r !== null)

            kvkStats.dailyStats[day] = {
                avgScore: dayScores.length > 0 ? dayScores.reduce((sum, s) => sum + s, 0) / dayScores.length : 0,
                avgRank: dayRanks.length > 0 ? dayRanks.reduce((sum, r) => sum + r, 0) / dayRanks.length : null
            }
        }

        kvkStats.topPrepGuild = guildsWithKvK.reduce((best, guild) =>
            guild.kvk.prepTotal > (best?.kvk.prepTotal || 0) ? guild : best, null)
    }

    const avgKvKRank = hasKvKData ? kvkStats.avgRank : null
    const kvkDaysPlayed = hasKvKData
        ? Math.max(...guilds.map(g => g.kvk?.prepScores.filter(s => s !== null).length || 0))
        : 0

    return {
        hasGvGData,
        hasKvKData,
        flawlessCount: guilds.filter(g => g.flawless).length,
        avgGvGPoints: guilds.reduce((sum, g) => sum + (g.points || 0), 0) / guilds.length,
        canInvadeCount: guilds.filter(g => g.invasionStatus === 'can-invade').length,
        canBeInvadedCount: guilds.filter(g => g.invasionStatus === 'can-be-invaded').length,
        totalWins: guilds.reduce((sum, g) => sum + g.wins, 0),
        totalLosses: guilds.reduce((sum, g) => sum + g.losses, 0),
        guildsWon: guilds.filter(g => g.won).length,
        guildsLost: guilds.filter(g => !g.won).length,
        pointsDistribution,
        dayStats,
        overPerformers,
        underPerformers,
        scoreDistribution,
        bestDay6,
        highestSingleDay,
        highestAvgDaily,
        kvkStats,
        avgKvKRank,
        kvkDaysPlayed
    }
})

// Sorting functions
const sortTable = (type, field) => {
    const config = type === 'gvg' ? gvgSortConfig : kvkSortConfig

    if (config.value.field === field) {
        config.value.direction = config.value.direction === 'asc' ? 'desc' : 'asc'
    } else {
        config.value.field = field
        config.value.direction = 'desc'
    }
}

const sortedGvGGuilds = computed(() => {
    if (!explorerData.value) return []

    const guilds = [...explorerData.value.guilds]
    const { field, direction } = gvgSortConfig.value

    guilds.sort((a, b) => {
        let aVal, bVal

        if (field === 'rank') {
            aVal = a.totalScore
            bVal = b.totalScore
            return direction === 'desc' ? bVal - aVal : aVal - bVal
        } else if (field === 'name') {
            aVal = a.name.toLowerCase()
            bVal = b.name.toLowerCase()
            return direction === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
        } else if (field === 'power') {
            aVal = a.power
            bVal = b.power
        } else if (field === 'totalScore') {
            aVal = a.totalScore
            bVal = b.totalScore
        } else if (field === 'points') {
            aVal = a.points
            bVal = b.points
        } else if (field.startsWith('day')) {
            const dayIndex = parseInt(field.replace('day', '')) - 1
            aVal = a.dayScores[dayIndex] ?? -Infinity
            bVal = b.dayScores[dayIndex] ?? -Infinity
        }

        return direction === 'desc' ? bVal - aVal : aVal - bVal
    })

    return guilds
})

const sortedKvKGuilds = computed(() => {
    if (!explorerData.value) return []

    const guilds = [...explorerData.value.guilds].filter(g => g.kvk && g.kvk.prepTotal > 0)
    const { field, direction } = kvkSortConfig.value

    guilds.sort((a, b) => {
        let aVal, bVal

        if (field === 'rank') {
            aVal = a.kvk.prepTotal
            bVal = b.kvk.prepTotal
            return direction === 'desc' ? bVal - aVal : aVal - bVal
        } else if (field === 'name') {
            aVal = a.name.toLowerCase()
            bVal = b.name.toLowerCase()
            return direction === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
        } else if (field === 'power') {
            aVal = a.power
            bVal = b.power
        } else if (field === 'prepTotal') {
            aVal = a.kvk.prepTotal
            bVal = b.kvk.prepTotal
        } else if (field === 'avgRank') {
            aVal = a.kvk.avgRank ?? Infinity
            bVal = b.kvk.avgRank ?? Infinity
            return direction === 'desc' ? aVal - bVal : bVal - aVal
        } else if (field.startsWith('prep')) {
            const dayIndex = parseInt(field.replace('prep', '')) - 1
            aVal = a.kvk.prepScores[dayIndex] ?? -Infinity
            bVal = b.kvk.prepScores[dayIndex] ?? -Infinity
        } else if (field === 'warScore') {
            aVal = a.kvk.warScore ?? -Infinity
            bVal = b.kvk.warScore ?? -Infinity
        }

        return direction === 'desc' ? bVal - aVal : aVal - bVal
    })

    return guilds
})

const exportDataToCSV = () => {
    if (!explorerData.value) return

    let csv = 'Guild,Shorthand,Power,GvG Points,GvG Total,Day 1,Day 2,Day 3,Day 4,Day 5,Day 6'

    if (insights.value.hasKvKData) {
        csv += ',KvK Prep Total,KvK Avg Rank,Prep D1,Prep D2,Prep D3,Prep D4,Prep D5,War Score,War Rank'
    }

    csv += '\n'

    explorerData.value.guilds.forEach(guild => {
        csv += `"${guild.name}",`
        csv += `"${guild.shorthand}",`
        csv += `${guild.power},`
        csv += `${guild.points},`
        csv += `${guild.totalScore},`
        guild.dayScores.forEach(score => {
            csv += score !== null ? `${score},` : '-,'
        })

        if (insights.value.hasKvKData) {
            csv += `${guild.kvk?.prepTotal || 0},`
            csv += `${guild.kvk?.avgRank?.toFixed(2) || '-'},`
            guild.kvk?.prepScores.forEach(score => {
                csv += score !== null ? `${score},` : '-,'
            })
            csv += `${guild.kvk?.warScore || '-'},`
            csv += `${guild.kvk?.warRank || '-'}`
        }

        csv += '\n'
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data_explorer_${explorerData.value.datasetName}_${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

// Load data on mount
onMounted(async () => {
    const datasetId = route.query.dataset
    const versionId = route.query.version || 'latest'

    if (!datasetId) {
        error.value = 'No dataset ID provided in URL'
        isLoading.value = false
        return
    }

    try {
        const targetVersionId = versionId === 'latest' ? null : versionId
        const result = await guildStore.loadDatasetVersion(datasetId, targetVersionId)

        if (!result || !result.version) {
            error.value = 'Dataset or version not found'
            isLoading.value = false
            return
        }

        const guilds = result.version.guilds || []
        const metadata = result.version.metadata || {}

        // Process guilds into explorer format
        const processedGuilds = guilds.map(guild => {
            // GvG Data
            const dayScores = []
            const dayWins = []
            let points = 0
            let wins = 0
            let losses = 0
            let totalScore = 0

            if (guild.gvgDays && Array.isArray(guild.gvgDays)) {
                guild.gvgDays.forEach((day, index) => {
                    const score = day.score !== null && day.score !== undefined ? day.score : null
                    dayScores.push(score)
                    dayWins.push(day.won || false)

                    if (score !== null) {
                        totalScore += score
                    }

                    if (day.won) {
                        points += index < 5 ? 2 : 4
                        wins++
                    } else if (score !== null) {
                        losses++
                    }
                })
            }

            // Fill remaining days with null
            while (dayScores.length < 6) {
                dayScores.push(null)
                dayWins.push(false)
            }

            const first5Wins = dayWins.slice(0, 5).filter(w => w).length
            const first5Losses = losses >= 3 ? guild.gvgDays?.slice(0, 5).filter((day, i) => !dayWins[i] && day.score !== null).length || 0 : 0

            let invasionStatus = null
            if (first5Wins >= 3) invasionStatus = 'can-invade'
            else if (first5Losses >= 3) invasionStatus = 'can-be-invaded'

            // KvK Data
            const kvkData = {
                prepScores: [],
                prepRanks: [],
                prepTotal: 0,
                avgRank: null,
                warScore: null,
                warRank: null
            }

            if (guild.kvkPrepDays && Array.isArray(guild.kvkPrepDays)) {
                // Process first 5 days (prep days)
                const prepDays = guild.kvkPrepDays.slice(0, 5)
                const ranks = []
                prepDays.forEach(day => {
                    const score = day && day.score !== null && day.score !== undefined ? day.score : null
                    const rank = day && day.rank !== null && day.rank !== undefined ? day.rank : null

                    kvkData.prepScores.push(score)
                    kvkData.prepRanks.push(rank)

                    if (score !== null) {
                        kvkData.prepTotal += score
                    }
                    if (rank !== null) {
                        ranks.push(rank)
                    }
                })

                if (ranks.length > 0) {
                    kvkData.avgRank = ranks.reduce((sum, r) => sum + r, 0) / ranks.length
                }

                // War day (day 6 = index 5)
                if (guild.kvkPrepDays[5]) {
                    const warDay = guild.kvkPrepDays[5]
                    kvkData.warScore = warDay.score !== null && warDay.score !== undefined ? warDay.score : null
                    kvkData.warRank = warDay.rank !== null && warDay.rank !== undefined ? warDay.rank : null
                }
            }

            // Fill remaining prep days with null
            while (kvkData.prepScores.length < 5) {
                kvkData.prepScores.push(null)
                kvkData.prepRanks.push(null)
            }

            return {
                name: guild.name || 'Unnamed',
                shorthand: guild.shorthand || '',
                dayScores,
                dayWins,
                points,
                wins,
                losses,
                won: points >= 8,
                flawless: wins === 6,
                invasionStatus,
                power: guild.guildPower || 0,
                totalScore,
                kvk: kvkData
            }
        })

        explorerData.value = {
            datasetName: result.dataset?.name || datasetId,
            guilds: processedGuilds,
            metadata
        }
    } catch (err) {
        console.error('Error loading data:', err)
        error.value = err.message
    } finally {
        isLoading.value = false
    }
})
</script>

<style scoped>
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
</style>