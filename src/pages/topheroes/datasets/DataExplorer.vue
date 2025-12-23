<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 p-3 py-0 sm:p-6 md:py-16">
    <div class="max-w-[1920px] mx-auto">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-8">
        <h1 class="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-lime-400 to-emerald-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">
          Data Explorer
        </h1>
        <p class="text-lime-200/80 text-sm sm:text-lg">Analyze and visualize guild performance</p>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex justify-center mb-6">
        <div class="inline-flex bg-green-900/50 rounded-xl p-1 border border-lime-500/30">
          <router-link 
            to="/topheroes/tools/rankings/builder"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            :class="$route.path.includes('/builder') 
              ? 'bg-lime-600 text-green-950' 
              : 'text-lime-300 hover:bg-green-800/50'"
          >
            <Database class="w-4 h-4" />
            Builder
          </router-link>
          <router-link 
            to="/topheroes/tools/rankings/weights"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            :class="$route.path.includes('/weights') 
              ? 'bg-lime-600 text-green-950' 
              : 'text-lime-300 hover:bg-green-800/50'"
          >
            <Calculator class="w-4 h-4" />
            Rankings
          </router-link>
          <router-link 
            to="/topheroes/tools/rankings/explorer"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            :class="$route.path.includes('/explorer') 
              ? 'bg-lime-600 text-green-950' 
              : 'text-lime-300 hover:bg-green-800/50'"
          >
            <BarChart3 class="w-4 h-4" />
            Explorer
          </router-link>
          <router-link 
            to="/topheroes/tools/rankings/migrate"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            :class="$route.path.includes('/migrate') 
              ? 'bg-lime-600 text-green-950' 
              : 'text-lime-300 hover:bg-green-800/50'"
          >
            <ArrowRightLeft class="w-4 h-4" />
            Migrate
          </router-link>
        </div>
      </div>

      <!-- No Dataset -->
      <div 
        v-if="!store.hasDataset"
        class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-8 sm:p-12 shadow-2xl border-2 border-lime-400/30 text-center max-w-2xl mx-auto"
      >
        <BarChart3 class="w-16 h-16 text-lime-500/50 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-lime-300 mb-2">No Dataset Loaded</h2>
        <p class="text-lime-300/60 mb-6">Load a dataset to explore the data.</p>
        <Button 
          @click="navigateToBuilder"
          class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold"
        >
          Go to Dataset Builder
        </Button>
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-6">
        <!-- Dataset Header -->
        <div class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30">
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <Database class="w-6 h-6 text-lime-400" />
              <div>
                <h2 class="text-xl font-bold text-lime-200">{{ store.currentDataset?.name }}</h2>
                <div class="flex items-center gap-3 text-sm text-lime-300/60">
                  <span>{{ validGuilds.length }} guilds</span>
                  <span>•</span>
                  <span>{{ eventInstances.length }} events</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <Button 
                @click="refreshAnalytics"
                size="sm"
                variant="outline"
                class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20"
              >
                <RefreshCw class="w-4 h-4 mr-1" :class="{ 'animate-spin': isRefreshing }" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <!-- Overview Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatCard 
            title="Total Guilds"
            :value="validGuilds.length"
            icon="Users"
            color="lime"
          />
          <StatCard 
            title="Avg Power"
            :value="formatCompact(analytics.avgPower)"
            icon="Zap"
            color="yellow"
          />
          <StatCard 
            title="Total Score"
            :value="formatCompact(analytics.totalScore)"
            icon="Target"
            color="cyan"
          />
          <StatCard 
            title="Total Wins"
            :value="analytics.totalWins"
            icon="Trophy"
            color="green"
          />
          <StatCard 
            title="Total Losses"
            :value="analytics.totalLosses"
            icon="X"
            color="red"
          />
          <StatCard 
            title="Win Rate"
            :value="(analytics.overallWinRate * 100).toFixed(1) + '%'"
            icon="Percent"
            color="purple"
          />
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <!-- Power Distribution -->
          <div class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30">
            <div class="flex items-center gap-2 mb-4">
              <Zap class="w-5 h-5 text-yellow-400" />
              <h3 class="font-semibold text-lime-300">Power Distribution</h3>
            </div>
            
            <div class="space-y-3">
              <div class="flex justify-between text-sm text-lime-300/70">
                <span>Min: {{ formatNumber(analytics.minPower) }}</span>
                <span>Max: {{ formatNumber(analytics.maxPower) }}</span>
              </div>
              
              <!-- Power histogram bars -->
              <div class="flex items-end gap-1 h-32">
                <div 
                  v-for="(bucket, idx) in powerBuckets"
                  :key="idx"
                  class="flex-1 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t transition-all hover:from-yellow-500 hover:to-yellow-300"
                  :style="{ height: `${bucket.percent}%` }"
                  :title="`${bucket.range}: ${bucket.count} guilds`"
                />
              </div>
              
              <div class="flex justify-between text-xs text-lime-400/50">
                <span>Lower</span>
                <span>Guild Power</span>
                <span>Higher</span>
              </div>
            </div>

            <!-- Power leaderboard -->
            <div class="mt-4 pt-4 border-t border-lime-500/20">
              <h4 class="text-sm font-medium text-lime-300/80 mb-2">Top by Power</h4>
              <div class="space-y-2">
                <div 
                  v-for="(guild, idx) in topByPower"
                  :key="guild.shorthand"
                  class="flex items-center justify-between text-sm"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-lime-400/60 w-4">{{ idx + 1 }}.</span>
                    <span class="text-lime-200">{{ guild.shorthand }}</span>
                  </div>
                  <span class="font-mono text-yellow-300">{{ formatCompact(guild.power) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Event Performance Overview -->
          <div class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30">
            <div class="flex items-center gap-2 mb-4">
              <Calendar class="w-5 h-5 text-cyan-400" />
              <h3 class="font-semibold text-lime-300">Event Performance</h3>
            </div>

            <div v-if="eventInstances.length === 0" class="text-center py-8 text-lime-300/50">
              No events configured
            </div>

            <div v-else class="space-y-4">
              <div 
                v-for="instance in eventInstances"
                :key="instance.id"
                class="bg-green-950/50 rounded-lg p-3"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <component 
                      :is="getEventIcon(instance.eventConfig.template.category)"
                      class="w-4 h-4"
                      :class="getEventIconColor(instance.eventConfig.template.category)"
                    />
                    <span class="font-medium text-lime-200">{{ instance.name }}</span>
                  </div>
                  <Badge v-if="instance.opponent" class="text-xs bg-purple-600/20 border-purple-500 text-purple-300">
                    vs {{ instance.opponent }}
                  </Badge>
                </div>

                <div class="grid grid-cols-3 gap-2 text-sm">
                  <div class="text-center">
                    <div class="text-lime-400/60 text-xs">Avg Score</div>
                    <div class="text-lime-200 font-mono">
                      {{ formatCompact(getEventStats(instance.id).avgScore) }}
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-lime-400/60 text-xs">Total Score</div>
                    <div class="text-lime-200 font-mono">
                      {{ formatCompact(getEventStats(instance.id).totalScore) }}
                    </div>
                  </div>
                  <div v-if="instance.eventConfig.template.hasWinLoss" class="text-center">
                    <div class="text-lime-400/60 text-xs">W-L</div>
                    <div>
                      <span class="text-lime-400">{{ getEventStats(instance.id).wins }}</span>
                      <span class="text-lime-500/50">-</span>
                      <span class="text-red-400">{{ getEventStats(instance.id).losses }}</span>
                    </div>
                  </div>
                </div>

                <!-- Event Top 3 -->
                <div class="mt-2 pt-2 border-t border-lime-500/10 flex justify-between text-xs">
                  <span class="text-lime-400/50">Top:</span>
                  <span class="text-lime-300">
                    {{ getEventTop3(instance.id).map(g => g.shorthand).join(', ') || 'No data' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Score Leaders -->
          <div class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30">
            <div class="flex items-center gap-2 mb-4">
              <Target class="w-5 h-5 text-cyan-400" />
              <h3 class="font-semibold text-lime-300">Score Leaders</h3>
            </div>

            <div class="space-y-2">
              <div 
                v-for="(guild, idx) in topByScore"
                :key="guild.shorthand"
                class="flex items-center gap-3 p-2 rounded-lg"
                :class="idx === 0 ? 'bg-lime-600/20' : 'bg-green-950/30'"
              >
                <span class="w-6 text-center">
                  <span v-if="idx === 0" class="text-xl">🥇</span>
                  <span v-else-if="idx === 1" class="text-xl">🥈</span>
                  <span v-else-if="idx === 2" class="text-xl">🥉</span>
                  <span v-else class="text-lime-400/60 text-sm">{{ idx + 1 }}</span>
                </span>
                <div class="flex-1">
                  <div class="font-medium text-lime-200">{{ guild.shorthand }}</div>
                  <div class="text-xs text-lime-400/60">{{ guild.name }}</div>
                </div>
                <div class="text-right">
                  <div class="font-mono text-cyan-300">{{ formatCompact(guild.totalScore) }}</div>
                  <div class="text-xs text-lime-400/50">total score</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Win Rate Leaders -->
          <div class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30">
            <div class="flex items-center gap-2 mb-4">
              <Trophy class="w-5 h-5 text-green-400" />
              <h3 class="font-semibold text-lime-300">Win Rate Leaders</h3>
            </div>

            <div class="space-y-2">
              <div 
                v-for="(guild, idx) in topByWinRate"
                :key="guild.shorthand"
                class="flex items-center gap-3 p-2 rounded-lg"
                :class="idx === 0 ? 'bg-green-600/20' : 'bg-green-950/30'"
              >
                <span class="w-6 text-center">
                  <span v-if="idx === 0" class="text-xl">🏆</span>
                  <span v-else class="text-lime-400/60 text-sm">{{ idx + 1 }}</span>
                </span>
                <div class="flex-1">
                  <div class="font-medium text-lime-200">{{ guild.shorthand }}</div>
                  <div class="text-xs">
                    <span class="text-lime-400">{{ guild.wins }}W</span>
                    <span class="text-lime-500/50"> - </span>
                    <span class="text-red-400">{{ guild.losses }}L</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-lg font-bold text-green-400">{{ (guild.winRate * 100).toFixed(0) }}%</div>
                </div>
                <div class="w-16 h-2 bg-green-900 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-gradient-to-r from-green-500 to-lime-400 rounded-full"
                    :style="{ width: `${guild.winRate * 100}%` }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Efficiency Leaders -->
          <div class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30">
            <div class="flex items-center gap-2 mb-4">
              <TrendingUp class="w-5 h-5 text-purple-400" />
              <h3 class="font-semibold text-lime-300">Efficiency (Score/Power)</h3>
            </div>

            <p class="text-xs text-lime-300/60 mb-4">
              Measures how much score a guild generates relative to their power.
            </p>

            <div class="space-y-2">
              <div 
                v-for="(guild, idx) in topByEfficiency"
                :key="guild.shorthand"
                class="flex items-center gap-3 p-2 rounded-lg bg-green-950/30"
              >
                <span class="w-6 text-center text-lime-400/60 text-sm">{{ idx + 1 }}</span>
                <div class="flex-1">
                  <div class="font-medium text-lime-200">{{ guild.shorthand }}</div>
                  <div class="text-xs text-lime-400/50">
                    {{ formatCompact(guild.totalScore) }} / {{ formatCompact(guild.power) }}
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-mono text-purple-300">{{ guild.efficiency.toFixed(2) }}</div>
                  <div class="text-xs text-lime-400/50">ratio</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Comparisons -->
          <div class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30">
            <div class="flex items-center gap-2 mb-4">
              <ArrowLeftRight class="w-5 h-5 text-amber-400" />
              <h3 class="font-semibold text-lime-300">Quick Compare</h3>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="text-xs text-lime-400/70 mb-1 block">Guild 1</label>
                <select
                  v-model="compareGuild1"
                  class="w-full bg-green-950/70 border border-lime-500/30 rounded-lg px-3 py-2 text-lime-100"
                >
                  <option value="">Select guild</option>
                  <option v-for="guild in validGuilds" :key="guild.shorthand" :value="guild.shorthand">
                    {{ guild.shorthand }}
                  </option>
                </select>
              </div>
              <div>
                <label class="text-xs text-lime-400/70 mb-1 block">Guild 2</label>
                <select
                  v-model="compareGuild2"
                  class="w-full bg-green-950/70 border border-lime-500/30 rounded-lg px-3 py-2 text-lime-100"
                >
                  <option value="">Select guild</option>
                  <option v-for="guild in validGuilds" :key="guild.shorthand" :value="guild.shorthand">
                    {{ guild.shorthand }}
                  </option>
                </select>
              </div>
            </div>

            <div v-if="comparisonData" class="space-y-3">
              <div 
                v-for="metric in comparisonMetrics"
                :key="metric.label"
                class="flex items-center gap-2"
              >
                <div class="w-24 text-xs text-lime-400/70">{{ metric.label }}</div>
                <div class="flex-1 flex items-center gap-1">
                  <div 
                    class="h-4 rounded-l"
                    :class="metric.val1 >= metric.val2 ? 'bg-lime-500' : 'bg-lime-700'"
                    :style="{ width: `${metric.percent1}%` }"
                  />
                  <span class="text-xs text-lime-200 w-16 text-right">{{ metric.display1 }}</span>
                </div>
                <div class="w-2 text-lime-500/50">vs</div>
                <div class="flex-1 flex items-center gap-1">
                  <span class="text-xs text-lime-200 w-16">{{ metric.display2 }}</span>
                  <div 
                    class="h-4 rounded-r"
                    :class="metric.val2 >= metric.val1 ? 'bg-cyan-500' : 'bg-cyan-700'"
                    :style="{ width: `${metric.percent2}%` }"
                  />
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8 text-lime-300/50 text-sm">
              Select two guilds to compare
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, Database, RefreshCw, Users, Zap, Target, Trophy, X, Percent,
  Calendar, TrendingUp, ArrowLeftRight, Sword, Globe, Calculator, ArrowRightLeft
} from 'lucide-vue-next'
import { useDatasetStore } from '@/stores/useDatasetStore'
import { calculateEventResult } from '@/lib/eventTemplates'
import { formatNumber } from '@/lib/datasetHelpers'

const router = useRouter()
const route = useRoute()
const store = useDatasetStore()

// State
const isRefreshing = ref(false)
const compareGuild1 = ref('')
const compareGuild2 = ref('')

// Navigate to builder
function navigateToBuilder() {
  router.push('/topheroes/tools/rankings')
}

// Refresh analytics
function refreshAnalytics() {
  isRefreshing.value = true
  setTimeout(() => { isRefreshing.value = false }, 500)
}

// Computed
const validGuilds = computed(() => 
  store.guilds.filter(g => g.shorthand?.trim())
)

const eventInstances = computed(() => store.allEventInstances)

// Analytics calculations
const analytics = computed(() => {
  const guilds = validGuilds.value
  
  if (guilds.length === 0) {
    return {
      avgPower: 0, minPower: 0, maxPower: 0,
      totalScore: 0, totalWins: 0, totalLosses: 0, overallWinRate: 0
    }
  }

  // Power stats
  const powers = guilds.filter(g => g.power > 0).map(g => g.power)
  const avgPower = powers.length > 0 ? powers.reduce((a, b) => a + b, 0) / powers.length : 0
  const minPower = powers.length > 0 ? Math.min(...powers) : 0
  const maxPower = powers.length > 0 ? Math.max(...powers) : 0

  // Score and win/loss stats
  let totalScore = 0
  let totalWins = 0
  let totalLosses = 0

  guilds.forEach(guild => {
    store.eventConfigs.forEach(ec => {
      if (!ec.enabled) return
      ec.instances.forEach(inst => {
        const eventData = guild.events?.[inst.id]
        if (!eventData) return
        
        const result = calculateEventResult(ec, eventData)
        totalScore += result.totalScore || 0
        totalWins += result.wins || (result.won ? 1 : 0)
        totalLosses += result.losses || (result.won === false ? 1 : 0)
      })
    })
  })

  const overallWinRate = (totalWins + totalLosses) > 0 
    ? totalWins / (totalWins + totalLosses) 
    : 0

  return { avgPower, minPower, maxPower, totalScore, totalWins, totalLosses, overallWinRate }
})

// Power distribution buckets
const powerBuckets = computed(() => {
  const powers = validGuilds.value.filter(g => g.power > 0).map(g => g.power)
  if (powers.length === 0) return Array(10).fill({ count: 0, percent: 0, range: '' })

  const min = Math.min(...powers)
  const max = Math.max(...powers)
  const range = max - min
  const bucketSize = range / 10 || 1

  const buckets = Array(10).fill(0).map((_, i) => ({
    count: 0,
    min: min + i * bucketSize,
    max: min + (i + 1) * bucketSize
  }))

  powers.forEach(p => {
    const idx = Math.min(9, Math.floor((p - min) / bucketSize))
    buckets[idx].count++
  })

  const maxCount = Math.max(...buckets.map(b => b.count))

  return buckets.map(b => ({
    count: b.count,
    percent: maxCount > 0 ? (b.count / maxCount) * 100 : 0,
    range: `${formatCompact(b.min)} - ${formatCompact(b.max)}`
  }))
})

// Top guilds by different metrics
const topByPower = computed(() => 
  [...validGuilds.value]
    .filter(g => g.power > 0)
    .sort((a, b) => b.power - a.power)
    .slice(0, 5)
)

const topByScore = computed(() => {
  return validGuilds.value.map(guild => {
    let totalScore = 0
    store.eventConfigs.forEach(ec => {
      if (!ec.enabled) return
      ec.instances.forEach(inst => {
        const eventData = guild.events?.[inst.id]
        if (!eventData) return
        const result = calculateEventResult(ec, eventData)
        totalScore += result.totalScore || 0
      })
    })
    return { ...guild, totalScore }
  })
  .filter(g => g.totalScore > 0)
  .sort((a, b) => b.totalScore - a.totalScore)
  .slice(0, 5)
})

const topByWinRate = computed(() => {
  return validGuilds.value.map(guild => {
    let wins = 0, losses = 0
    store.eventConfigs.forEach(ec => {
      if (!ec.enabled) return
      ec.instances.forEach(inst => {
        const eventData = guild.events?.[inst.id]
        if (!eventData) return
        const result = calculateEventResult(ec, eventData)
        wins += result.wins || (result.won ? 1 : 0)
        losses += result.losses || (result.won === false ? 1 : 0)
      })
    })
    const total = wins + losses
    return { ...guild, wins, losses, winRate: total > 0 ? wins / total : 0 }
  })
  .filter(g => (g.wins + g.losses) >= 2) // At least 2 games
  .sort((a, b) => b.winRate - a.winRate)
  .slice(0, 5)
})

const topByEfficiency = computed(() => {
  return validGuilds.value.map(guild => {
    let totalScore = 0
    store.eventConfigs.forEach(ec => {
      if (!ec.enabled) return
      ec.instances.forEach(inst => {
        const eventData = guild.events?.[inst.id]
        if (!eventData) return
        const result = calculateEventResult(ec, eventData)
        totalScore += result.totalScore || 0
      })
    })
    const efficiency = guild.power > 0 ? totalScore / guild.power : 0
    return { ...guild, totalScore, efficiency }
  })
  .filter(g => g.efficiency > 0 && g.power > 0)
  .sort((a, b) => b.efficiency - a.efficiency)
  .slice(0, 5)
})

// Event stats helper
function getEventStats(instanceId) {
  const eventConfig = eventInstances.value.find(e => e.id === instanceId)?.eventConfig
  if (!eventConfig) return { avgScore: 0, totalScore: 0, wins: 0, losses: 0 }

  let totalScore = 0, wins = 0, losses = 0, count = 0

  validGuilds.value.forEach(guild => {
    const eventData = guild.events?.[instanceId]
    if (!eventData) return
    
    const result = calculateEventResult(eventConfig, eventData)
    if (result.totalScore > 0) {
      totalScore += result.totalScore
      count++
    }
    wins += result.wins || (result.won ? 1 : 0)
    losses += result.losses || (result.won === false ? 1 : 0)
  })

  return {
    avgScore: count > 0 ? totalScore / count : 0,
    totalScore,
    wins,
    losses
  }
}

// Event top 3 helper
function getEventTop3(instanceId) {
  const eventConfig = eventInstances.value.find(e => e.id === instanceId)?.eventConfig
  if (!eventConfig) return []

  return validGuilds.value.map(guild => {
    const eventData = guild.events?.[instanceId]
    if (!eventData) return { ...guild, score: 0 }
    const result = calculateEventResult(eventConfig, eventData)
    return { ...guild, score: result.totalScore || 0 }
  })
  .filter(g => g.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 3)
}

// Comparison data
const comparisonData = computed(() => {
  if (!compareGuild1.value || !compareGuild2.value) return null
  
  const g1 = validGuilds.value.find(g => g.shorthand === compareGuild1.value)
  const g2 = validGuilds.value.find(g => g.shorthand === compareGuild2.value)
  
  if (!g1 || !g2) return null
  return { g1, g2 }
})

const comparisonMetrics = computed(() => {
  if (!comparisonData.value) return []
  
  const { g1, g2 } = comparisonData.value
  
  // Calculate scores and wins for both
  let g1Score = 0, g1Wins = 0, g2Score = 0, g2Wins = 0
  
  store.eventConfigs.forEach(ec => {
    if (!ec.enabled) return
    ec.instances.forEach(inst => {
      const d1 = g1.events?.[inst.id]
      const d2 = g2.events?.[inst.id]
      
      if (d1) {
        const r = calculateEventResult(ec, d1)
        g1Score += r.totalScore || 0
        g1Wins += r.wins || (r.won ? 1 : 0)
      }
      if (d2) {
        const r = calculateEventResult(ec, d2)
        g2Score += r.totalScore || 0
        g2Wins += r.wins || (r.won ? 1 : 0)
      }
    })
  })
  
  const metrics = [
    { label: 'Power', val1: g1.power || 0, val2: g2.power || 0 },
    { label: 'Total Score', val1: g1Score, val2: g2Score },
    { label: 'Total Wins', val1: g1Wins, val2: g2Wins }
  ]
  
  return metrics.map(m => {
    const max = Math.max(m.val1, m.val2) || 1
    return {
      ...m,
      percent1: (m.val1 / max) * 100,
      percent2: (m.val2 / max) * 100,
      display1: formatCompact(m.val1),
      display2: formatCompact(m.val2)
    }
  })
})

// Helpers
function formatCompact(num) {
  if (num == null || num === 0) return '0'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
  return Math.round(num).toLocaleString()
}

function getEventIcon(category) {
  switch (category) {
    case 'gvg': return Sword
    case 'kvk': return Globe
    default: return Calendar
  }
}

function getEventIconColor(category) {
  switch (category) {
    case 'gvg': return 'text-lime-400'
    case 'kvk': return 'text-purple-400'
    default: return 'text-yellow-400'
  }
}

// StatCard component
const StatCard = {
  props: ['title', 'value', 'icon', 'color'],
  setup(props) {
    const icons = { Users, Zap, Target, Trophy, X, Percent }
    const colors = {
      lime: 'from-lime-600/30 to-lime-500/10 border-lime-500/30',
      yellow: 'from-yellow-600/30 to-yellow-500/10 border-yellow-500/30',
      cyan: 'from-cyan-600/30 to-cyan-500/10 border-cyan-500/30',
      green: 'from-green-600/30 to-green-500/10 border-green-500/30',
      red: 'from-red-600/30 to-red-500/10 border-red-500/30',
      purple: 'from-purple-600/30 to-purple-500/10 border-purple-500/30'
    }
    const iconColors = {
      lime: 'text-lime-400',
      yellow: 'text-yellow-400',
      cyan: 'text-cyan-400',
      green: 'text-green-400',
      red: 'text-red-400',
      purple: 'text-purple-400'
    }
    
    return () => h('div', {
      class: `bg-gradient-to-br ${colors[props.color]} rounded-xl p-4 border text-center`
    }, [
      h(icons[props.icon], { class: `w-6 h-6 ${iconColors[props.color]} mx-auto mb-2` }),
      h('div', { class: 'text-2xl font-bold text-lime-200' }, props.value),
      h('div', { class: 'text-xs text-lime-400/70' }, props.title)
    ])
  }
}
</script>
