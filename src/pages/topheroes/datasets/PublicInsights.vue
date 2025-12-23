<template>
  <div class="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-green-900 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <RefreshCw class="w-8 h-8 text-lime-400 animate-spin" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <AlertCircle class="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-red-300 mb-2">Error Loading Data</h1>
        <p class="text-red-400/80">{{ error }}</p>
      </div>

      <!-- Content -->
      <div v-else-if="publishedData">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-2">
            <router-link 
              :to="`/rankings/public/${route.params.publishId}`"
              class="text-lime-400/60 text-sm hover:text-lime-300 flex items-center gap-1"
            >
              <ArrowLeft class="w-4 h-4" />
              Back to Rankings
            </router-link>
            
            <!-- Export Button -->
            <Button 
              @click="exportData"
              size="sm"
              class="bg-lime-600 hover:bg-lime-500 text-green-950"
            >
              <Download class="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
          <h1 class="text-3xl font-bold text-lime-300">{{ publishedData.datasetName }} - Detailed Insights</h1>
          <p class="text-lime-400/60 mt-1">Deep dive into performance data and comparisons</p>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div class="bg-green-900/50 rounded-xl p-4 border border-lime-500/20">
            <div class="text-lime-400/60 text-sm">Total Guilds</div>
            <div class="text-2xl font-bold text-lime-300">{{ publishedData.rankings.length }}</div>
          </div>
          <div class="bg-green-900/50 rounded-xl p-4 border border-lime-500/20">
            <div class="text-lime-400/60 text-sm">Events Tracked</div>
            <div class="text-2xl font-bold text-lime-300">{{ publishedData.events?.length || 0 }}</div>
          </div>
          <div class="bg-green-900/50 rounded-xl p-4 border border-lime-500/20">
            <div class="text-lime-400/60 text-sm">Highest Score</div>
            <div class="text-2xl font-bold text-lime-300">{{ topScorer?.weightedScore?.toFixed(1) || '-' }}</div>
          </div>
          <div class="bg-green-900/50 rounded-xl p-4 border border-lime-500/20">
            <div class="text-lime-400/60 text-sm">Score Spread</div>
            <div class="text-2xl font-bold text-lime-300">{{ scoreSpread.toFixed(1) }}</div>
          </div>
          <div class="bg-green-900/50 rounded-xl p-4 border border-lime-500/20">
            <div class="text-lime-400/60 text-sm">Perfect Records</div>
            <div class="text-2xl font-bold text-yellow-300">{{ perfectRecordsCount }}</div>
          </div>
          <div class="bg-green-900/50 rounded-xl p-4 border border-lime-500/20">
            <div class="text-lime-400/60 text-sm">Avg Efficiency</div>
            <div class="text-2xl font-bold text-lime-300">{{ avgEfficiency.toFixed(4) }}</div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="flex border-b border-lime-500/30 mb-6 gap-1 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap',
              activeTab === tab.id
                ? 'border-lime-400 text-lime-300 bg-lime-500/10'
                : 'border-transparent text-lime-400/60 hover:text-lime-300 hover:bg-lime-500/5'
            ]"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </button>
        </div>

        <!-- Guild Lookup Tab -->
        <div v-if="activeTab === 'lookup'" class="space-y-6">
          <!-- Guild Selector -->
          <div class="bg-green-900/50 rounded-xl p-6 border border-lime-500/20">
            <h2 class="text-lg font-bold text-lime-300 mb-4 flex items-center gap-2">
              <Search class="w-5 h-5" />
              Find Your Guild
            </h2>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="guild in publishedData.rankings"
                :key="guild.guild.id"
                @click="selectedGuild = guild"
                :class="[
                  'px-3 py-2 rounded-lg border text-sm transition-colors',
                  selectedGuild?.guild?.id === guild.guild.id
                    ? 'bg-lime-600 border-lime-500 text-green-950 font-medium'
                    : 'bg-green-900/50 border-lime-500/30 text-lime-300 hover:bg-green-800/50'
                ]"
              >
                {{ guild.shorthand || guild.guild.shorthand }}
              </button>
            </div>
          </div>

          <!-- Selected Guild Details -->
          <div v-if="selectedGuild" class="space-y-6">
            <!-- Guild Header -->
            <div class="bg-gradient-to-r from-lime-900/50 to-green-900/50 rounded-xl p-6 border border-lime-500/30">
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-2xl font-bold text-lime-200">{{ selectedGuild.guild.name }}</h3>
                    <Badge class="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                      Rank #{{ selectedGuild.rank }}
                    </Badge>
                  </div>
                  <div class="text-lime-400/70">{{ selectedGuild.guild.shorthand }}</div>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-bold text-lime-300">{{ selectedGuild.weightedScore.toFixed(2) }}</div>
                  <div class="text-sm text-lime-400/60">Total Score</div>
                </div>
              </div>
              
              <!-- Guild Stats -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div class="bg-green-950/50 rounded-lg p-3">
                  <div class="text-xs text-lime-400/60">Power</div>
                  <div class="text-lg font-bold text-lime-200">{{ formatNumber(selectedGuild.rawData?.power || 0) }}</div>
                </div>
                <div class="bg-green-950/50 rounded-lg p-3">
                  <div class="text-xs text-lime-400/60">Efficiency</div>
                  <div class="text-lg font-bold text-lime-200">{{ calculateEfficiency(selectedGuild).toFixed(4) }}</div>
                </div>
                <div class="bg-green-950/50 rounded-lg p-3">
                  <div class="text-xs text-lime-400/60">Total Wins</div>
                  <div class="text-lg font-bold text-green-300">{{ countWins(selectedGuild) }}</div>
                </div>
                <div class="bg-green-950/50 rounded-lg p-3">
                  <div class="text-xs text-lime-400/60">Total Losses</div>
                  <div class="text-lg font-bold text-red-300">{{ countLosses(selectedGuild) }}</div>
                </div>
              </div>
            </div>

            <!-- Event Performance -->
            <div class="bg-green-900/50 rounded-xl p-6 border border-lime-500/20">
              <h3 class="text-lg font-bold text-lime-300 mb-4">Event Performance</h3>
              <div class="space-y-4">
                <div 
                  v-for="event in publishedData.events" 
                  :key="event.id"
                  class="bg-green-950/50 rounded-lg p-4 border border-lime-500/10"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <div class="font-semibold text-lime-200 flex items-center gap-2">
                        <Sword v-if="event.category === 'gvg'" class="w-4 h-4 text-green-400" />
                        <Globe v-else-if="event.category === 'kvk'" class="w-4 h-4 text-purple-400" />
                        <BarChart3 v-else class="w-4 h-4 text-blue-400" />
                        {{ event.name }}
                      </div>
                      <div v-if="event.opponent" class="text-sm text-lime-400/60 mt-1">
                        vs {{ event.opponent }}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-bold text-lime-300">
                        {{ formatNumber(selectedGuild.results?.[event.id]?.totalScore || 0) }}
                      </div>
                      <div class="text-xs text-lime-400/60">Total Score</div>
                    </div>
                  </div>

                  <!-- Win/Loss for events that track it -->
                  <div v-if="selectedGuild.results?.[event.id]?.won !== undefined" class="mt-2">
                    <Badge 
                      :class="selectedGuild.results[event.id].won 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : 'bg-red-500/20 text-red-300 border-red-500/30'"
                    >
                      {{ selectedGuild.results[event.id].won ? '✓ Won' : '✗ Lost' }}
                    </Badge>
                    <span v-if="selectedGuild.results[event.id].wins !== undefined" class="text-sm text-lime-400/70 ml-2">
                      ({{ selectedGuild.results[event.id].wins }}W - {{ selectedGuild.results[event.id].losses }}L)
                    </span>
                  </div>

                  <!-- Contribution to overall score -->
                  <div v-if="selectedGuild.breakdown?.[event.id]" class="mt-3 pt-3 border-t border-lime-500/20">
                    <div class="text-xs text-lime-400/60 mb-2">Contribution to Total Score:</div>
                    <div class="space-y-1 text-xs">
                      <div v-if="selectedGuild.breakdown[event.id].score" class="flex justify-between">
                        <span class="text-lime-300/70">Score Component:</span>
                        <span class="text-lime-200 font-medium">{{ selectedGuild.breakdown[event.id].score.contribution.toFixed(2) }}</span>
                      </div>
                      <div v-if="selectedGuild.breakdown[event.id].winRecord" class="flex justify-between">
                        <span class="text-lime-300/70">Win Record:</span>
                        <span class="text-lime-200 font-medium">{{ selectedGuild.breakdown[event.id].winRecord.contribution.toFixed(2) }}</span>
                      </div>
                      <div v-if="selectedGuild.breakdown[event.id].warDay" class="flex justify-between">
                        <span class="text-lime-300/70">War Day:</span>
                        <span class="text-lime-200 font-medium">{{ selectedGuild.breakdown[event.id].warDay.contribution.toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Event Breakdown Tab -->
        <div v-if="activeTab === 'events'" class="space-y-6">
          <div 
            v-for="event in publishedData.events" 
            :key="event.id"
            class="bg-green-900/50 rounded-xl p-6 border border-lime-500/20"
          >
            <div class="flex items-center gap-3 mb-4">
              <Sword v-if="event.category === 'gvg'" class="w-6 h-6 text-green-400" />
              <Globe v-else-if="event.category === 'kvk'" class="w-6 h-6 text-purple-400" />
              <BarChart3 v-else class="w-6 h-6 text-blue-400" />
              <div>
                <h2 class="text-lg font-bold text-lime-300">{{ event.name }}</h2>
                <p v-if="event.opponent" class="text-sm text-lime-400/60">vs {{ event.opponent }}</p>
              </div>
            </div>

            <!-- Event Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div class="bg-green-950/50 rounded-lg p-4">
                <div class="text-xs text-lime-400/60 mb-1">Avg Score</div>
                <div class="text-xl font-bold text-lime-300">{{ getEventStats(event).avgScore.toFixed(0) }}</div>
              </div>
              <div class="bg-green-950/50 rounded-lg p-4">
                <div class="text-xs text-lime-400/60 mb-1">Top Score</div>
                <div class="text-xl font-bold text-lime-300">{{ formatNumber(getEventStats(event).maxScore) }}</div>
              </div>
              <div v-if="getEventStats(event).totalWins >= 0" class="bg-green-950/50 rounded-lg p-4">
                <div class="text-xs text-lime-400/60 mb-1">Total Wins</div>
                <div class="text-xl font-bold text-green-300">{{ getEventStats(event).totalWins }}</div>
              </div>
              <div v-if="getEventStats(event).totalLosses >= 0" class="bg-green-950/50 rounded-lg p-4">
                <div class="text-xs text-lime-400/60 mb-1">Total Losses</div>
                <div class="text-xl font-bold text-red-300">{{ getEventStats(event).totalLosses }}</div>
              </div>
            </div>

            <!-- Top 5 Performers for this event -->
            <div class="bg-green-950/50 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-lime-300 mb-3">Top 5 Performers</h3>
              <div class="space-y-2">
                <div 
                  v-for="(guild, index) in getTopPerformersForEvent(event, 5)"
                  :key="guild.guild.id"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center gap-3">
                    <span class="text-xs font-medium text-lime-400/60 w-6">#{index + 1}</span>
                    <span class="text-sm text-lime-200">{{ guild.shorthand || guild.guild.shorthand }}</span>
                  </div>
                  <div class="text-sm font-medium text-lime-300">
                    {{ formatNumber(guild.results?.[event.id]?.totalScore || 0) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Compare Guilds Tab -->
        <div v-if="activeTab === 'compare'" class="space-y-6">
          <div class="bg-green-900/50 rounded-xl p-6 border border-lime-500/20">
            <h2 class="text-lg font-bold text-lime-300 mb-4">Compare Guilds</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <!-- Guild A Selector -->
              <div>
                <label class="text-sm text-lime-400/60 mb-2 block">Guild A</label>
                <select 
                  v-model="compareGuildA"
                  class="w-full bg-green-950/50 border border-lime-500/30 rounded-lg px-3 py-2 text-lime-200"
                >
                  <option :value="null">Select guild...</option>
                  <option 
                    v-for="guild in publishedData.rankings" 
                    :key="guild.guild.id"
                    :value="guild"
                  >
                    {{ guild.guild.name }} ({{ guild.guild.shorthand }})
                  </option>
                </select>
              </div>

              <!-- Guild B Selector -->
              <div>
                <label class="text-sm text-lime-400/60 mb-2 block">Guild B</label>
                <select 
                  v-model="compareGuildB"
                  class="w-full bg-green-950/50 border border-lime-500/30 rounded-lg px-3 py-2 text-lime-200"
                >
                  <option :value="null">Select guild...</option>
                  <option 
                    v-for="guild in publishedData.rankings" 
                    :key="guild.guild.id"
                    :value="guild"
                  >
                    {{ guild.guild.name }} ({{ guild.guild.shorthand }})
                  </option>
                </select>
              </div>
            </div>

            <!-- Comparison Results -->
            <div v-if="compareGuildA && compareGuildB" class="space-y-6">
              <!-- Overall Comparison -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-lime-900/30 rounded-lg p-4 border border-lime-500/30">
                  <div class="text-center">
                    <h3 class="text-sm font-semibold text-lime-400/70 mb-3">Overall Score</h3>
                    <div class="text-3xl font-bold text-lime-200 mb-2">{{ compareGuildA.weightedScore.toFixed(2) }}</div>
                    <Badge class="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                      Rank #{{ compareGuildA.rank }}
                    </Badge>
                  </div>
                </div>
                <div class="bg-lime-900/30 rounded-lg p-4 border border-lime-500/30">
                  <div class="text-center">
                    <h3 class="text-sm font-semibold text-lime-400/70 mb-3">Overall Score</h3>
                    <div class="text-3xl font-bold text-lime-200 mb-2">{{ compareGuildB.weightedScore.toFixed(2) }}</div>
                    <Badge class="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                      Rank #{{ compareGuildB.rank }}
                    </Badge>
                  </div>
                </div>
              </div>

              <!-- Event-by-Event Comparison -->
              <div>
                <h3 class="text-sm font-semibold text-lime-400/70 mb-3 flex items-center gap-2">
                  <BarChart3 class="w-4 h-4" />
                  Event-by-Event Comparison
                </h3>
                <div class="space-y-3">
                  <div 
                    v-for="event in publishedData.events" 
                    :key="event.id"
                    class="bg-green-950/50 rounded-lg p-4 border border-lime-500/10"
                  >
                    <div class="text-sm font-medium text-lime-300 mb-3">{{ event.name }}</div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <div class="text-lg font-bold text-lime-200">
                          {{ formatNumber(compareGuildA.results?.[event.id]?.totalScore || 0) }}
                        </div>
                        <div v-if="compareGuildA.results?.[event.id]?.won !== undefined" class="text-xs mt-1">
                          <Badge 
                            :class="compareGuildA.results[event.id].won 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30'
                              : 'bg-red-500/20 text-red-300 border-red-500/30'"
                            size="sm"
                          >
                            {{ compareGuildA.results[event.id].won ? 'Won' : 'Lost' }}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <div class="text-lg font-bold text-lime-200">
                          {{ formatNumber(compareGuildB.results?.[event.id]?.totalScore || 0) }}
                        </div>
                        <div v-if="compareGuildB.results?.[event.id]?.won !== undefined" class="text-xs mt-1">
                          <Badge 
                            :class="compareGuildB.results[event.id].won 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30'
                              : 'bg-red-500/20 text-red-300 border-red-500/30'"
                            size="sm"
                          >
                            {{ compareGuildB.results[event.id].won ? 'Won' : 'Lost' }}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <!-- Winner indicator -->
                    <div v-if="(compareGuildA.results?.[event.id]?.totalScore || 0) !== (compareGuildB.results?.[event.id]?.totalScore || 0)" class="text-xs text-center mt-2">
                      <span :class="(compareGuildA.results?.[event.id]?.totalScore || 0) > (compareGuildB.results?.[event.id]?.totalScore || 0) 
                        ? 'text-lime-300' 
                        : 'text-lime-400/60'"
                      >
                        {{ (compareGuildA.results?.[event.id]?.totalScore || 0) > (compareGuildB.results?.[event.id]?.totalScore || 0) 
                          ? '← Higher' 
                          : 'Higher →' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Insights Tab (ENHANCED with old features) -->
        <div v-if="activeTab === 'insights'" class="space-y-6">
          <!-- Over/Under Performers -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Over Performers -->
            <div class="bg-green-900/50 rounded-xl p-6 border border-lime-500/20">
              <h2 class="text-lg font-bold text-lime-300 mb-4 flex items-center gap-2">
                <TrendingUp class="w-5 h-5 text-green-400" />
                Over Performers
              </h2>
              <p class="text-sm text-lime-400/60 mb-4">Guilds with exceptional efficiency (score per power)</p>
              <div class="space-y-3">
                <div 
                  v-for="guild in overPerformers" 
                  :key="guild.guild.id"
                  class="bg-green-950/50 rounded-lg p-4 border border-green-500/20"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="font-semibold text-lime-200">{{ guild.guild.shorthand }}</div>
                    <Badge class="bg-green-500/20 text-green-300 border-green-500/30">
                      Rank #{{ guild.rank }}
                    </Badge>
                  </div>
                  <div class="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div class="text-lime-400/60">Efficiency</div>
                      <div class="font-medium text-green-300">{{ calculateEfficiency(guild).toFixed(4) }}</div>
                    </div>
                    <div>
                      <div class="text-lime-400/60">Power</div>
                      <div class="font-medium text-lime-300">{{ formatNumber(guild.rawData?.power || 0) }}</div>
                    </div>
                    <div>
                      <div class="text-lime-400/60">Score</div>
                      <div class="font-medium text-lime-300">{{ guild.weightedScore.toFixed(1) }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="overPerformers.length === 0" class="text-center text-lime-400/60 py-8">
                No over performers identified
              </div>
            </div>

            <!-- Under Performers -->
            <div class="bg-green-900/50 rounded-xl p-6 border border-lime-500/20">
              <h2 class="text-lg font-bold text-lime-300 mb-4 flex items-center gap-2">
                <TrendingDown class="w-5 h-5 text-red-400" />
                Under Performers
              </h2>
              <p class="text-sm text-lime-400/60 mb-4">Guilds with low efficiency - room for improvement</p>
              <div class="space-y-3">
                <div 
                  v-for="guild in underPerformers" 
                  :key="guild.guild.id"
                  class="bg-green-950/50 rounded-lg p-4 border border-red-500/20"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="font-semibold text-lime-200">{{ guild.guild.shorthand }}</div>
                    <Badge class="bg-red-500/20 text-red-300 border-red-500/30">
                      Rank #{{ guild.rank }}
                    </Badge>
                  </div>
                  <div class="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div class="text-lime-400/60">Efficiency</div>
                      <div class="font-medium text-red-300">{{ calculateEfficiency(guild).toFixed(4) }}</div>
                    </div>
                    <div>
                      <div class="text-lime-400/60">Power</div>
                      <div class="font-medium text-lime-300">{{ formatNumber(guild.rawData?.power || 0) }}</div>
                    </div>
                    <div>
                      <div class="text-lime-400/60">Score</div>
                      <div class="font-medium text-lime-300">{{ guild.weightedScore.toFixed(1) }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="underPerformers.length === 0" class="text-center text-lime-400/60 py-8">
                No under performers identified
              </div>
            </div>
          </div>

          <!-- Top Performers -->
          <div class="bg-green-900/50 rounded-xl p-6 border border-lime-500/20">
            <h2 class="text-lg font-bold text-lime-300 mb-4 flex items-center gap-2">
              <TrendingUp class="w-5 h-5" />
              Top Performers by Category
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Most Powerful -->
              <div class="bg-green-950/50 rounded-lg p-4 border border-lime-500/10">
                <div class="text-sm text-yellow-400/70 mb-2">⚡ Most Powerful</div>
                <div class="font-bold text-lime-200">{{ mostPowerful?.shorthand || mostPowerful?.guild?.shorthand }}</div>
                <div class="text-lime-400/60 text-sm">{{ formatNumber(mostPowerful?.rawData?.power) }}</div>
              </div>

              <!-- Best Efficiency -->
              <div class="bg-green-950/50 rounded-lg p-4 border border-lime-500/10">
                <div class="text-sm text-cyan-400/70 mb-2">📊 Best Efficiency</div>
                <div class="font-bold text-lime-200">{{ mostEfficient?.shorthand || mostEfficient?.guild?.shorthand }}</div>
                <div class="text-lime-400/60 text-sm">{{ mostEfficient?.efficiency?.toFixed(4) }} score/power</div>
              </div>

              <!-- Most Consistent -->
              <div class="bg-green-950/50 rounded-lg p-4 border border-lime-500/10">
                <div class="text-sm text-purple-400/70 mb-2">🎯 Most Consistent</div>
                <div class="font-bold text-lime-200">{{ publishedData.rankings[0]?.shorthand || publishedData.rankings[0]?.guild?.shorthand }}</div>
                <div class="text-lime-400/60 text-sm">Rank #1 Overall</div>
              </div>
            </div>
          </div>

          <!-- Opponent Analysis -->
          <div class="bg-green-900/50 rounded-xl p-6 border border-lime-500/20">
            <h2 class="text-lg font-bold text-lime-300 mb-4 flex items-center gap-2">
              <Users class="w-5 h-5" />
              Opponent Analysis
            </h2>
            <div v-if="opponentStats.length > 0" class="space-y-3">
              <div 
                v-for="opp in opponentStats" 
                :key="opp.name"
                class="bg-green-950/50 rounded-lg p-4 border border-lime-500/10"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-bold text-lime-200">{{ opp.name }}</span>
                    <span class="text-lime-400/60 text-sm ml-2">faced {{ opp.count }} time(s)</span>
                  </div>
                  <div class="text-right">
                    <span :class="opp.wins > opp.losses ? 'text-green-400' : opp.wins < opp.losses ? 'text-red-400' : 'text-yellow-400'">
                      {{ opp.wins }}W - {{ opp.losses }}L
                    </span>
                  </div>
                </div>
                <div v-if="opp.wins > opp.losses" class="text-xs text-green-400/70 mt-1">
                  ✓ Strong record against this opponent
                </div>
                <div v-else-if="opp.losses > opp.wins" class="text-xs text-red-400/70 mt-1">
                  ⚠ Struggled against this opponent - consider strategies for improvement
                </div>
              </div>
            </div>
            <div v-else class="text-lime-400/60 text-center py-8">
              No opponent data available for analysis
            </div>
          </div>

          <!-- Score Distribution -->
          <div class="bg-green-900/50 rounded-xl p-6 border border-lime-500/20">
            <h2 class="text-lg font-bold text-lime-300 mb-4 flex items-center gap-2">
              <BarChart3 class="w-5 h-5" />
              Score Distribution
            </h2>
            <div class="space-y-2">
              <div 
                v-for="guild in publishedData.rankings" 
                :key="guild.guild.id"
                class="flex items-center gap-3"
              >
                <div class="w-16 text-sm text-lime-400/70 truncate">{{ guild.shorthand || guild.guild.shorthand }}</div>
                <div class="flex-1 bg-green-950/50 rounded-full h-6 overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all"
                    :class="guild.rank <= 3 ? 'bg-gradient-to-r from-lime-500 to-green-400' : 'bg-lime-600/50'"
                    :style="{ width: `${(guild.weightedScore / topScorer.weightedScore) * 100}%` }"
                  ></div>
                </div>
                <div class="w-16 text-right text-sm font-medium text-lime-300">{{ guild.weightedScore.toFixed(1) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Tab (NEW - from old DataExplorer) -->
        <div v-if="activeTab === 'performance'" class="space-y-6">
          <!-- Event Performance Analysis -->
          <div 
            v-for="event in publishedData.events" 
            :key="event.id"
            class="bg-green-900/50 rounded-xl p-6 border border-lime-500/20"
          >
            <div class="flex items-center gap-3 mb-6">
              <Sword v-if="event.category === 'gvg'" class="w-6 h-6 text-green-400" />
              <Globe v-else-if="event.category === 'kvk'" class="w-6 h-6 text-purple-400" />
              <BarChart3 v-else class="w-6 h-6 text-blue-400" />
              <h2 class="text-lg font-bold text-lime-300">{{ event.name }} - Performance Analysis</h2>
            </div>

            <!-- Score Distribution for this Event -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-lime-300 mb-3">Score Distribution</h3>
              <div class="space-y-2">
                <div 
                  v-for="guild in getTopPerformersForEvent(event, 10)"
                  :key="guild.guild.id"
                  class="flex items-center gap-3"
                >
                  <div class="w-20 text-sm text-lime-400/70 truncate">{{ guild.shorthand || guild.guild.shorthand }}</div>
                  <div class="flex-1 bg-green-950/50 rounded-full h-5 overflow-hidden">
                    <div 
                      class="h-full bg-lime-600/70 rounded-full transition-all"
                      :style="{ width: `${(guild.results?.[event.id]?.totalScore || 0) / getEventStats(event).maxScore * 100}%` }"
                    ></div>
                  </div>
                  <div class="w-24 text-right text-sm font-medium text-lime-300">
                    {{ formatNumber(guild.results?.[event.id]?.totalScore || 0) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Win/Loss Distribution (for events with win/loss tracking) -->
            <div v-if="hasWinLossData(event)" class="mb-6">
              <h3 class="text-sm font-semibold text-lime-300 mb-3">Win/Loss Distribution</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-green-950/50 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-green-300">{{ countEventWins(event) }}</div>
                  <div class="text-xs text-lime-400/60 mt-1">Total Wins</div>
                </div>
                <div class="bg-green-950/50 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-red-300">{{ countEventLosses(event) }}</div>
                  <div class="text-xs text-lime-400/60 mt-1">Total Losses</div>
                </div>
                <div class="bg-green-950/50 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-yellow-300">{{ countPerfectRecords(event) }}</div>
                  <div class="text-xs text-lime-400/60 mt-1">Perfect Records</div>
                </div>
                <div class="bg-green-950/50 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-lime-300">{{ getWinRate(event).toFixed(1) }}%</div>
                  <div class="text-xs text-lime-400/60 mt-1">Win Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Tables Tab - Day-by-Day Sortable Tables -->
        <div v-if="activeTab === 'tables'" class="space-y-6">
          <div 
            v-for="event in publishedData.events" 
            :key="event.id"
            class="bg-green-900/50 rounded-xl p-6 border border-lime-500/20"
          >
            <!-- Event Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <Sword v-if="event.category === 'gvg'" class="w-6 h-6 text-green-400" />
                <Globe v-else-if="event.category === 'kvk'" class="w-6 h-6 text-purple-400" />
                <BarChart3 v-else class="w-6 h-6 text-blue-400" />
                <div>
                  <h2 class="text-lg font-bold text-lime-300">{{ event.name }} - Day by Day</h2>
                  <div v-if="event.opponent" class="text-xs text-lime-400/60">vs {{ event.opponent }}</div>
                </div>
              </div>
              <Badge 
                :class="event.category === 'gvg' 
                  ? 'bg-green-600/20 border-green-500 text-green-300'
                  : event.category === 'kvk'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-blue-600/20 border-blue-500 text-blue-300'"
              >
                {{ event.category?.toUpperCase() || 'EVENT' }}
              </Badge>
            </div>

            <!-- Sortable Day-by-Day Table -->
            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b-2 border-lime-400/30">
                    <!-- Guild column -->
                    <th 
                      @click="sortTableByColumn(event.id, 'guild')"
                      class="text-left py-3 px-3 text-lime-300 font-semibold cursor-pointer hover:bg-lime-500/10 select-none sticky left-0 bg-green-900/90 z-10"
                    >
                      <div class="flex items-center gap-1">
                        <span>Guild</span>
                        <ChevronUp v-if="getColumnSortIcon(event.id, 'guild') === 'up'" class="w-3 h-3" />
                        <ChevronDown v-else-if="getColumnSortIcon(event.id, 'guild') === 'down'" class="w-3 h-3" />
                      </div>
                    </th>

                    <!-- Power column -->
                    <th 
                      @click="sortTableByColumn(event.id, 'power')"
                      class="text-right py-3 px-3 text-lime-300 font-semibold cursor-pointer hover:bg-lime-500/10 select-none"
                    >
                      <div class="flex items-center justify-end gap-1">
                        <span>Power</span>
                        <ChevronUp v-if="getColumnSortIcon(event.id, 'power') === 'up'" class="w-3 h-3" />
                        <ChevronDown v-else-if="getColumnSortIcon(event.id, 'power') === 'down'" class="w-3 h-3" />
                      </div>
                    </th>

                    <!-- Day columns -->
                    <th 
                      v-for="(label, dayIndex) in getEventDayLabels(event)"
                      :key="`day-${dayIndex}`"
                      @click="sortTableByColumn(event.id, `day-${dayIndex}`)"
                      class="text-right py-3 px-3 text-lime-300 font-semibold cursor-pointer hover:bg-lime-500/10 select-none whitespace-nowrap"
                    >
                      <div class="flex items-center justify-end gap-1">
                        <span>{{ label }}</span>
                        <ChevronUp v-if="getColumnSortIcon(event.id, `day-${dayIndex}`) === 'up'" class="w-3 h-3" />
                        <ChevronDown v-else-if="getColumnSortIcon(event.id, `day-${dayIndex}`) === 'down'" class="w-3 h-3" />
                      </div>
                    </th>

                    <!-- Total column -->
                    <th 
                      @click="sortTableByColumn(event.id, 'total')"
                      class="text-right py-3 px-3 text-lime-300 font-semibold cursor-pointer hover:bg-lime-500/10 select-none whitespace-nowrap"
                    >
                      <div class="flex items-center justify-end gap-1">
                        <span>Total</span>
                        <ChevronUp v-if="getColumnSortIcon(event.id, 'total') === 'up'" class="w-3 h-3" />
                        <ChevronDown v-else-if="getColumnSortIcon(event.id, 'total') === 'down'" class="w-3 h-3" />
                      </div>
                    </th>

                    <!-- Result column (if has win/loss) -->
                    <th 
                      v-if="hasWinLossData(event)"
                      @click="sortTableByColumn(event.id, 'result')"
                      class="text-center py-3 px-3 text-lime-300 font-semibold cursor-pointer hover:bg-lime-500/10 select-none whitespace-nowrap"
                    >
                      <div class="flex items-center justify-center gap-1">
                        <span>Result</span>
                        <ChevronUp v-if="getColumnSortIcon(event.id, 'result') === 'up'" class="w-3 h-3" />
                        <ChevronDown v-else-if="getColumnSortIcon(event.id, 'result') === 'down'" class="w-3 h-3" />
                      </div>
                    </th>

                    <!-- Efficiency column -->
                    <th 
                      @click="sortTableByColumn(event.id, 'efficiency')"
                      class="text-right py-3 px-3 text-lime-300 font-semibold cursor-pointer hover:bg-lime-500/10 select-none whitespace-nowrap"
                    >
                      <div class="flex items-center justify-end gap-1">
                        <span>Eff</span>
                        <ChevronUp v-if="getColumnSortIcon(event.id, 'efficiency') === 'up'" class="w-3 h-3" />
                        <ChevronDown v-else-if="getColumnSortIcon(event.id, 'efficiency') === 'down'" class="w-3 h-3" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="guild in getTableSortedGuilds(event.id)"
                    :key="guild.guild.id"
                    class="border-b border-lime-400/10 hover:bg-lime-500/5"
                  >
                    <!-- Guild -->
                    <td class="py-3 px-3 sticky left-0 bg-green-900/80 backdrop-blur-sm">
                      <div class="font-semibold text-lime-200">{{ guild.guild.shorthand }}</div>
                      <div class="text-xs text-lime-400/60">{{ guild.guild.name }}</div>
                    </td>

                    <!-- Power -->
                    <td class="py-3 px-3 text-right text-lime-400/80 font-mono">
                      {{ formatCompact(guild.rawData?.power || 0) }}
                    </td>

                    <!-- Day scores -->
                    <td 
                      v-for="(label, dayIndex) in getEventDayLabels(event)"
                      :key="`score-${dayIndex}`"
                      class="py-3 px-3 text-right"
                    >
                      <div class="font-mono text-lime-200">
                        {{ formatCompact(getGuildDayScore(guild, event.id, dayIndex)) }}
                      </div>
                      <!-- Win/Loss indicator for this day if available -->
                      <div v-if="getGuildDayWinLoss(guild, event.id, dayIndex) !== null" class="text-xs mt-0.5">
                        <span v-if="getGuildDayWinLoss(guild, event.id, dayIndex)" class="text-green-400">✓</span>
                        <span v-else class="text-red-400">✗</span>
                      </div>
                    </td>

                    <!-- Total -->
                    <td class="py-3 px-3 text-right">
                      <div class="font-mono font-semibold text-cyan-300">
                        {{ formatNumber(guild.results?.[event.id]?.totalScore || 0) }}
                      </div>
                    </td>

                    <!-- Result -->
                    <td v-if="hasWinLossData(event)" class="py-3 px-3 text-center">
                      <Badge 
                        v-if="guild.results?.[event.id]?.won !== undefined"
                        :class="guild.results[event.id].won 
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : 'bg-red-500/20 text-red-300 border-red-500/30'"
                        size="sm"
                      >
                        {{ guild.results[event.id].won ? 'Won' : 'Lost' }}
                      </Badge>
                      <div v-if="guild.results?.[event.id]?.wins !== undefined" class="text-xs text-lime-400/60 mt-1">
                        {{ guild.results[event.id].wins }}W-{{ guild.results[event.id].losses }}L
                      </div>
                    </td>

                    <!-- Efficiency -->
                    <td class="py-3 px-3 text-right text-lime-400/80 font-mono text-xs">
                      {{ calculateEfficiency(guild).toFixed(4) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Event Summary Stats -->
            <div class="mt-4 pt-4 border-t border-lime-500/20 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div class="text-center">
                <div class="text-lime-400/60">Avg Total</div>
                <div class="font-mono text-lime-200">{{ formatCompact(getEventStats(event).avgScore) }}</div>
              </div>
              <div class="text-center">
                <div class="text-lime-400/60">Top Score</div>
                <div class="font-mono text-lime-200">{{ formatNumber(getEventStats(event).maxScore) }}</div>
              </div>
              <div v-if="hasWinLossData(event)" class="text-center">
                <div class="text-lime-400/60">Total W-L</div>
                <div class="font-mono">
                  <span class="text-green-400">{{ getEventStats(event).totalWins }}W</span>
                  <span class="text-lime-500/50"> - </span>
                  <span class="text-red-400">{{ getEventStats(event).totalLosses }}L</span>
                </div>
              </div>
              <div v-if="hasWinLossData(event)" class="text-center">
                <div class="text-lime-400/60">Win Rate</div>
                <div class="font-mono text-lime-200">
                  {{ ((getEventStats(event).totalWins / (getEventStats(event).totalWins + getEventStats(event).totalLosses)) * 100).toFixed(0) }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  RefreshCw, AlertCircle, ArrowLeft, Search, Sword, Globe,
  TrendingUp, TrendingDown, Users, BarChart3, Download, Table,
  ChevronUp, ChevronDown
} from 'lucide-vue-next'
import { firestore } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'

const route = useRoute()

// State
const isLoading = ref(true)
const error = ref(null)
const publishedData = ref(null)
const activeTab = ref('lookup')
const selectedGuild = ref(null)
const compareGuildA = ref(null)
const compareGuildB = ref(null)

// Sorting state for tables: { [eventId]: { column: string, direction: 'asc'|'desc' } }
const tableSortState = ref({})

// Tabs (with new tabs added)
const tabs = [
  { id: 'lookup', label: 'Guild Lookup', icon: Search },
  { id: 'events', label: 'Event Breakdown', icon: Sword },
  { id: 'compare', label: 'Compare Guilds', icon: Users },
  { id: 'insights', label: 'Insights', icon: TrendingUp },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'tables', label: 'Data Tables', icon: Table }
]

// Computed - Basic Stats
const topScorer = computed(() => publishedData.value?.rankings?.[0])

const scoreSpread = computed(() => {
  if (!publishedData.value?.rankings?.length) return 0
  const scores = publishedData.value.rankings.map(r => r.weightedScore)
  return Math.max(...scores) - Math.min(...scores)
})

const mostPowerful = computed(() => {
  if (!publishedData.value?.rankings) return null
  return [...publishedData.value.rankings].sort((a, b) => 
    (b.rawData?.power || 0) - (a.rawData?.power || 0)
  )[0]
})

const mostEfficient = computed(() => {
  if (!publishedData.value?.rankings) return null
  const withEfficiency = publishedData.value.rankings.map(r => ({
    ...r,
    efficiency: calculateEfficiency(r)
  }))
  return withEfficiency.sort((a, b) => b.efficiency - a.efficiency)[0]
})

// NEW: Perfect Records Count
const perfectRecordsCount = computed(() => {
  if (!publishedData.value?.rankings) return 0
  let count = 0
  publishedData.value.rankings.forEach(guild => {
    publishedData.value.events?.forEach(event => {
      const result = guild.results?.[event.id]
      // Check if won and has wins/losses data showing all wins
      if (result?.won && result?.wins && result?.losses === 0) {
        count++
      }
    })
  })
  return count
})

// NEW: Average Efficiency
const avgEfficiency = computed(() => {
  if (!publishedData.value?.rankings?.length) return 0
  const efficiencies = publishedData.value.rankings.map(r => calculateEfficiency(r)).filter(e => e > 0)
  if (efficiencies.length === 0) return 0
  return efficiencies.reduce((sum, e) => sum + e, 0) / efficiencies.length
})

// NEW: Over Performers (efficiency > 0.10)
const overPerformers = computed(() => {
  if (!publishedData.value?.rankings) return []
  return publishedData.value.rankings
    .filter(r => calculateEfficiency(r) > 0.10)
    .sort((a, b) => calculateEfficiency(b) - calculateEfficiency(a))
    .slice(0, 5)
})

// NEW: Under Performers (efficiency < 0.05)
const underPerformers = computed(() => {
  if (!publishedData.value?.rankings) return []
  return publishedData.value.rankings
    .filter(r => {
      const eff = calculateEfficiency(r)
      return eff > 0 && eff < 0.05
    })
    .sort((a, b) => calculateEfficiency(a) - calculateEfficiency(b))
    .slice(0, 5)
})

const opponentStats = computed(() => {
  if (!publishedData.value?.events) return []
  
  const opponents = {}
  publishedData.value.events.forEach(event => {
    if (event.opponent) {
      if (!opponents[event.opponent]) {
        opponents[event.opponent] = { name: event.opponent, count: 0, wins: 0, losses: 0 }
      }
      opponents[event.opponent].count++
      
      // Count overall wins/losses for this opponent
      publishedData.value.rankings.forEach(guild => {
        const result = guild.results?.[event.id]
        if (result?.wins != null) {
          opponents[event.opponent].wins += result.wins
          opponents[event.opponent].losses += result.losses
        } else if (result?.won !== undefined) {
          if (result.won) opponents[event.opponent].wins++
          else opponents[event.opponent].losses++
        }
      })
    }
  })
  
  return Object.values(opponents)
})

// Helper Functions
function formatNumber(num) {
  if (num == null) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function calculateEfficiency(guild) {
  if (!guild.rawData?.power || guild.rawData.power === 0) return 0
  const totalScore = Object.values(guild.results || {}).reduce((sum, res) => sum + (res.totalScore || 0), 0)
  return totalScore / guild.rawData.power
}

function countWins(guild) {
  let total = 0
  publishedData.value.events?.forEach(event => {
    const result = guild.results?.[event.id]
    if (result?.wins != null) {
      total += result.wins
    } else if (result?.won) {
      total++
    }
  })
  return total
}

function countLosses(guild) {
  let total = 0
  publishedData.value.events?.forEach(event => {
    const result = guild.results?.[event.id]
    if (result?.losses != null) {
      total += result.losses
    } else if (result?.won === false) {
      total++
    }
  })
  return total
}

function getEventStats(event) {
  const results = publishedData.value.rankings.map(r => r.results?.[event.id]).filter(r => r)
  const scores = results.map(r => r.totalScore || 0)
  const avgScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0
  
  let totalWins = 0
  let totalLosses = 0
  results.forEach(r => {
    if (r.wins != null) {
      totalWins += r.wins
      totalLosses += r.losses || 0
    } else if (r.won !== undefined) {
      if (r.won) totalWins++
      else totalLosses++
    }
  })
  
  return { avgScore, maxScore, totalWins, totalLosses }
}

function getTopPerformersForEvent(event, limit = 5) {
  return [...publishedData.value.rankings]
    .filter(r => r.results?.[event.id])
    .sort((a, b) => (b.results?.[event.id]?.totalScore || 0) - (a.results?.[event.id]?.totalScore || 0))
    .slice(0, limit)
}

function hasWinLossData(event) {
  return publishedData.value.rankings.some(r => 
    r.results?.[event.id]?.won !== undefined || r.results?.[event.id]?.wins !== undefined
  )
}

function countEventWins(event) {
  let total = 0
  publishedData.value.rankings.forEach(r => {
    const result = r.results?.[event.id]
    if (result?.wins != null) total += result.wins
    else if (result?.won) total++
  })
  return total
}

function countEventLosses(event) {
  let total = 0
  publishedData.value.rankings.forEach(r => {
    const result = r.results?.[event.id]
    if (result?.losses != null) total += result.losses
    else if (result?.won === false) total++
  })
  return total
}

function countPerfectRecords(event) {
  return publishedData.value.rankings.filter(r => {
    const result = r.results?.[event.id]
    return result?.won && result?.wins && result?.losses === 0
  }).length
}

function getWinRate(event) {
  const wins = countEventWins(event)
  const losses = countEventLosses(event)
  const total = wins + losses
  return total > 0 ? (wins / total) * 100 : 0
}

function getSortedGuildsForEvent(event) {
  return [...publishedData.value.rankings]
    .sort((a, b) => (b.results?.[event.id]?.totalScore || 0) - (a.results?.[event.id]?.totalScore || 0))
}

// NEW: Day-by-day table functions
function formatCompact(num) {
  if (num == null || num === 0) return '0'
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

function getEventDayLabels(event) {
  // For now, return generic day labels - can be enhanced to match event template
  const dayCount = event.days || 6 // Default to 6 days if not specified
  return Array.from({ length: dayCount }, (_, i) => {
    if (event.category === 'gvg' || event.category === 'kvk') {
      const labels = ['Construction', 'Technology', 'Rally & Gather', 'Hero Upgrade', 'Training', 'War Day']
      return labels[i] || `Day ${i + 1}`
    }
    return `Day ${i + 1}`
  })
}

function getGuildDayScore(guild, eventId, dayIndex) {
  // Check if guild has day-by-day data in breakdown
  if (guild.breakdown?.[eventId]?.days?.[dayIndex]) {
    return guild.breakdown[eventId].days[dayIndex].score || 0
  }
  
  // Fallback: try to get from results if it has days array
  const result = guild.results?.[eventId]
  if (result?.days?.[dayIndex]) {
    return result.days[dayIndex].score || 0
  }
  
  return 0
}

function getGuildDayWinLoss(guild, eventId, dayIndex) {
  // Check if guild has day-by-day win/loss data
  if (guild.breakdown?.[eventId]?.days?.[dayIndex]) {
    return guild.breakdown[eventId].days[dayIndex].won !== undefined 
      ? guild.breakdown[eventId].days[dayIndex].won 
      : null
  }
  
  const result = guild.results?.[eventId]
  if (result?.days?.[dayIndex]) {
    return result.days[dayIndex].won !== undefined ? result.days[dayIndex].won : null
  }
  
  return null
}

// Sorting functions for tables
function sortTableByColumn(eventId, column) {
  const currentSort = tableSortState.value[eventId]
  
  if (currentSort?.column === column) {
    // Toggle direction
    tableSortState.value[eventId] = {
      column,
      direction: currentSort.direction === 'asc' ? 'desc' : 'asc'
    }
  } else {
    // New column, default to desc
    tableSortState.value[eventId] = {
      column,
      direction: 'desc'
    }
  }
}

function getColumnSortIcon(eventId, column) {
  const currentSort = tableSortState.value[eventId]
  if (currentSort?.column === column) {
    return currentSort.direction === 'asc' ? 'up' : 'down'
  }
  return null
}

function getTableSortedGuilds(eventId) {
  const guilds = [...publishedData.value.rankings]
  const currentSort = tableSortState.value[eventId]
  
  if (!currentSort) {
    // Default sort by total score desc
    return guilds.sort((a, b) => {
      const aTotal = a.results?.[eventId]?.totalScore || 0
      const bTotal = b.results?.[eventId]?.totalScore || 0
      return bTotal - aTotal
    })
  }
  
  return guilds.sort((a, b) => {
    let aVal, bVal
    
    if (currentSort.column === 'guild') {
      aVal = a.guild.shorthand?.toLowerCase() || ''
      bVal = b.guild.shorthand?.toLowerCase() || ''
      return currentSort.direction === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    } else if (currentSort.column === 'power') {
      aVal = a.rawData?.power || 0
      bVal = b.rawData?.power || 0
    } else if (currentSort.column === 'total') {
      aVal = a.results?.[eventId]?.totalScore || 0
      bVal = b.results?.[eventId]?.totalScore || 0
    } else if (currentSort.column === 'result') {
      aVal = a.results?.[eventId]?.won === true ? 1 : a.results?.[eventId]?.won === false ? 0 : -1
      bVal = b.results?.[eventId]?.won === true ? 1 : b.results?.[eventId]?.won === false ? 0 : -1
    } else if (currentSort.column === 'efficiency') {
      aVal = calculateEfficiency(a)
      bVal = calculateEfficiency(b)
    } else if (currentSort.column.startsWith('day-')) {
      const dayIndex = parseInt(currentSort.column.split('-')[1])
      aVal = getGuildDayScore(a, eventId, dayIndex)
      bVal = getGuildDayScore(b, eventId, dayIndex)
    }
    
    return currentSort.direction === 'asc' ? aVal - bVal : bVal - aVal
  })
}

function exportData() {
  // Create CSV content with day-by-day breakdown
  let csv = ''
  
  publishedData.value.events.forEach((event, idx) => {
    if (idx > 0) csv += '\n\n'
    
    // Event header
    csv += `${event.name}\n`
    
    // Column headers
    csv += 'Guild,Name,Power,'
    const dayLabels = getEventDayLabels(event)
    csv += dayLabels.join(',')
    csv += ',Total'
    if (hasWinLossData(event)) {
      csv += ',Result,W-L'
    }
    csv += ',Efficiency\n'
    
    // Data rows
    publishedData.value.rankings.forEach(guild => {
      csv += `${guild.guild.shorthand},"${guild.guild.name}",${guild.rawData?.power || 0},`
      
      // Day scores
      dayLabels.forEach((_, dayIndex) => {
        csv += getGuildDayScore(guild, event.id, dayIndex)
        csv += ','
      })
      
      // Total
      csv += guild.results?.[event.id]?.totalScore || 0
      
      // Result
      if (hasWinLossData(event)) {
        const result = guild.results?.[event.id]
        csv += `,${result?.won === true ? 'Won' : result?.won === false ? 'Lost' : ''}`
        if (result?.wins !== undefined) {
          csv += `,${result.wins}W-${result.losses}L`
        } else {
          csv += ','
        }
      }
      
      // Efficiency
      csv += `,${calculateEfficiency(guild).toFixed(4)}`
      
      csv += '\n'
    })
  })
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${publishedData.value.datasetName || 'data'}_insights.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

// Load published data
onMounted(async () => {
  try {
    const publishId = route.params.publishId
    const docRef = doc(firestore, 'topheroes/guilds-v2/published', publishId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      publishedData.value = docSnap.data()
    } else {
      error.value = 'Published data not found'
    }
  } catch (err) {
    console.error('Error loading published data:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(74, 222, 128, 0.1);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(74, 222, 128, 0.3);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(74, 222, 128, 0.5);
}
</style>