<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Trophy class="w-5 h-5 text-yellow-400" />
        <h2 class="text-lg font-bold text-lime-300">Rankings</h2>
        <Badge class="bg-lime-600/20 border-lime-500 text-lime-300">
          {{ rankings.length }} guilds
        </Badge>
      </div>
      
      <div class="flex items-center gap-2">
        <Button
          @click="showBreakdown = !showBreakdown"
          size="sm"
          variant="outline"
          :class="[
            'border-lime-400/50 hover:bg-lime-500/20',
            showBreakdown ? 'bg-lime-600/30 text-lime-300' : 'bg-lime-600/20 text-lime-400'
          ]"
        >
          <BarChart3 class="w-4 h-4 mr-1" />
          {{ showBreakdown ? 'Hide' : 'Show' }} Breakdown
        </Button>
        
        <Button 
          @click="showShareModal = true"
          size="sm"
          variant="outline"
          class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20"
        >
          <Share2 class="w-4 h-4 mr-1" />
          Share & Export
        </Button>
      </div>
    </div>

    <!-- No Data State -->
    <div 
      v-if="rankings.length === 0"
      class="text-center py-12 bg-green-950/30 rounded-xl border-2 border-dashed border-lime-500/30"
    >
      <Trophy class="w-12 h-12 text-lime-500/50 mx-auto mb-3" />
      <p class="text-lime-300/70">No ranking data available</p>
      <p class="text-lime-300/50 text-sm">Add guilds with event data to see rankings</p>
    </div>

    <!-- Rankings Table -->
    <div v-else class="bg-green-950/50 rounded-xl border-2 border-lime-500/30 overflow-hidden">
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full">
          <thead>
            <tr class="bg-green-900/50 border-b border-lime-500/30">
              <th class="px-3 py-3 text-left text-xs font-semibold text-lime-300 w-16">Rank</th>
              <th class="px-3 py-3 text-left text-xs font-semibold text-lime-300 min-w-[150px]">Guild</th>
              <th class="px-3 py-3 text-right text-xs font-semibold text-lime-300 w-24">Score</th>
              <th class="px-2 py-3 text-center text-xs font-semibold text-lime-300 w-10"></th>
              <th class="px-3 py-3 text-right text-xs font-semibold text-lime-300 w-28">Power</th>
              
              <!-- Event columns -->
              <th 
                v-for="instance in eventInstances"
                :key="instance.id"
                class="px-3 py-3 text-center text-xs font-semibold min-w-[120px]"
                :class="getEventHeaderClass(instance.eventConfig)"
              >
                {{ instance.name }}
              </th>
              
              <!-- Breakdown column -->
              <th v-if="showBreakdown" class="px-3 py-3 text-center text-xs font-semibold text-lime-300 min-w-[200px]">
                Score Breakdown
              </th>
            </tr>
          </thead>
          
          <tbody>
            <tr 
              v-for="ranking in rankings"
              :key="ranking.guild.id || ranking.guild.shorthand"
              :class="[
                'border-b border-lime-500/10 hover:bg-green-900/30 transition-colors',
                ranking.rank <= 3 ? 'bg-gradient-to-r' : '',
                ranking.rank === 1 ? 'from-yellow-900/20 to-transparent' : '',
                ranking.rank === 2 ? 'from-gray-600/20 to-transparent' : '',
                ranking.rank === 3 ? 'from-amber-900/20 to-transparent' : ''
              ]"
            >
              <!-- Rank -->
              <td class="px-3 py-3">
                <div class="flex items-center gap-2">
                  <span v-if="ranking.rank === 1" class="text-2xl">🥇</span>
                  <span v-else-if="ranking.rank === 2" class="text-2xl">🥈</span>
                  <span v-else-if="ranking.rank === 3" class="text-2xl">🥉</span>
                  <span v-else class="text-lime-400 font-mono text-lg pl-1">{{ ranking.rank }}</span>
                </div>
              </td>
              
              <!-- Guild -->
              <td class="px-3 py-3">
                <div>
                  <div class="font-semibold text-lime-200">
                    {{ ranking.guild.name || ranking.guild.shorthand }}
                  </div>
                  <div v-if="ranking.guild.name" class="text-xs text-lime-400/60">
                    {{ ranking.guild.shorthand }}
                  </div>
                </div>
              </td>
              
              <!-- Weighted Score -->
              <td class="px-3 py-3 text-right">
                <span class="text-lg font-bold text-lime-200">
                  {{ ranking.weightedScore.toFixed(1) }}
                </span>
              </td>
              
              <!-- Show Maths Button -->
              <td class="px-2 py-3 text-center">
                <button
                  @click="openMathsModal(ranking)"
                  class="p-1.5 rounded-full hover:bg-lime-500/20 text-lime-400/60 hover:text-lime-300 transition-colors"
                  title="Show calculation breakdown"
                >
                  <Info class="w-4 h-4" />
                </button>
              </td>
              
              <!-- Power -->
              <td class="px-3 py-3 text-right font-mono text-lime-300">
                {{ formatNumber(ranking.rawData.power) }}
              </td>
              
              <!-- Event data -->
              <td 
                v-for="instance in eventInstances"
                :key="`${ranking.guild.shorthand}-${instance.id}`"
                class="px-3 py-3"
              >
                <div v-if="ranking.results[instance.id]" class="text-center">
                  <!-- Score -->
                  <div class="text-sm font-mono text-lime-200">
                    {{ formatCompact(ranking.results[instance.id].totalScore) }}
                  </div>
                  
                  <!-- Win/Loss -->
                  <div v-if="ranking.results[instance.id].wins != null" class="text-xs mt-1">
                    <span class="text-lime-400">{{ ranking.results[instance.id].wins }}W</span>
                    <span class="text-lime-500/50"> - </span>
                    <span class="text-red-400">{{ ranking.results[instance.id].losses }}L</span>
                  </div>
                  <div v-else-if="ranking.results[instance.id].won !== undefined" class="mt-1">
                    <Badge 
                      :class="ranking.results[instance.id].won 
                        ? 'bg-lime-600/20 border-lime-500 text-lime-300' 
                        : 'bg-red-600/20 border-red-500 text-red-300'"
                      class="text-[10px]"
                    >
                      {{ ranking.results[instance.id].won ? 'Won' : 'Lost' }}
                    </Badge>
                  </div>
                  
                  <!-- Points -->
                  <div v-if="ranking.results[instance.id].points != null" class="text-[10px] text-lime-400/60 mt-0.5">
                    {{ ranking.results[instance.id].points }} pts
                  </div>
                </div>
                <div v-else class="text-center text-lime-500/50">-</div>
              </td>
              
              <!-- Breakdown -->
              <td v-if="showBreakdown" class="px-3 py-3">
                <div class="flex flex-wrap gap-1 justify-center">
                  <div 
                    v-for="(component, key) in getBreakdownComponents(ranking)"
                    :key="key"
                    class="text-[10px] px-1.5 py-0.5 rounded bg-green-800/50"
                    :title="`${component.label}: ${component.contribution.toFixed(1)} (${component.weight}%)`"
                  >
                    <span class="text-lime-400/70">{{ component.label }}:</span>
                    <span class="text-lime-200 ml-1">{{ component.contribution.toFixed(1) }}</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Stats Summary -->
    <div v-if="rankings.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-green-950/50 rounded-xl border border-lime-500/30 p-4 text-center">
        <div class="text-2xl font-bold text-lime-200">{{ rankings.length }}</div>
        <div class="text-xs text-lime-400/70">Guilds Ranked</div>
      </div>
      <div class="bg-green-950/50 rounded-xl border border-lime-500/30 p-4 text-center">
        <div class="text-2xl font-bold text-lime-200">{{ formatCompact(totalScore) }}</div>
        <div class="text-xs text-lime-400/70">Total Score</div>
      </div>
      <div class="bg-green-950/50 rounded-xl border border-lime-500/30 p-4 text-center">
        <div class="text-2xl font-bold text-lime-200">{{ topScorer?.guild?.shorthand || '-' }}</div>
        <div class="text-xs text-lime-400/70">Top Scorer</div>
      </div>
      <div class="bg-green-950/50 rounded-xl border border-lime-500/30 p-4 text-center">
        <div class="text-2xl font-bold text-lime-200">{{ formatCompact(avgScore) }}</div>
        <div class="text-xs text-lime-400/70">Avg Score</div>
      </div>
    </div>

    <!-- Calculation Breakdown Modal -->
    <Dialog v-model:open="showMathsModal">
      <DialogContent class="bg-gradient-to-br from-green-900/95 to-emerald-900/95 border-2 border-lime-400/30 text-lime-100 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="text-xl font-bold text-lime-300 flex items-center gap-2">
            <Calculator class="w-5 h-5" />
            Calculation Method (using #{{ selectedRanking?.rank }} {{ selectedRanking?.guild?.shorthand }} as example)
          </DialogTitle>
        </DialogHeader>

        <div v-if="selectedRanking" class="space-y-4 mt-4 font-mono text-sm">
          <!-- Each component -->
          <template v-for="comp in getDetailedMathsBreakdown()" :key="comp.id">
            <div class="bg-green-950/70 rounded-lg border border-lime-500/30 p-4">
              <div class="flex items-center gap-2 mb-3">
                <span class="text-yellow-400">{{ comp.icon }}</span>
                <span class="font-bold text-lime-200">{{ comp.label }} ({{ comp.weight }}%)</span>
              </div>
              
              <ul class="space-y-1 text-lime-300/90 list-disc list-inside">
                <li v-if="comp.mode">Mode: {{ comp.mode }}</li>
                <li>{{ selectedRanking.guild.shorthand }}: <span class="text-lime-100">{{ comp.guildValue }}</span></li>
                <li>Max score: <span class="text-lime-100">{{ comp.maxValue }}</span></li>
                <li v-if="comp.minValue !== null">Min score: <span class="text-lime-100">{{ comp.minValue }}</span></li>
                <li>
                  Normalized: 
                  <span class="text-yellow-300">({{ comp.normalizedFormula }}) × {{ comp.weight }}%</span>
                </li>
                <li class="text-lime-100 font-bold">Score: {{ comp.finalScore }} points</li>
              </ul>
            </div>
          </template>

          <!-- Final Score -->
          <div class="bg-lime-600/20 border-2 border-lime-500/50 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-yellow-400">🏆</span>
              <span class="font-bold text-lime-200">Final Score</span>
            </div>
            <ul class="space-y-1 text-lime-300/90 list-disc list-inside">
              <li>Total = Sum of all category scores</li>
              <li class="text-xl font-bold text-lime-100">{{ selectedRanking.guild.shorthand }}: {{ selectedRanking.weightedScore.toFixed(2) }} points</li>
            </ul>
            <p class="text-lime-400/70 text-xs mt-2">Rankings sorted by total score (highest first)</p>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <Button
            @click="showMathsModal = false"
            class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Share Modal -->
    <ShareModal
      :isOpen="showShareModal"
      :rankings="rankings"
      :events="shareEvents"
      :weights="weights"
      :datasetName="datasetName"
      @close="showShareModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Trophy, BarChart3, Share2, Info, Calculator
} from 'lucide-vue-next'
import { useDatasetStore } from '@/stores/useDatasetStore'
import { getTotalWeight } from '@/lib/rankingCalculator'
import { formatNumber } from '@/lib/datasetHelpers'
import ShareModal from './ShareModal.vue'

const props = defineProps({
  rankings: {
    type: Array,
    default: () => []
  },
  weights: {
    type: Object,
    default: null
  },
  datasetName: {
    type: String,
    default: 'Rankings'
  }
})

const store = useDatasetStore()

// State
const showBreakdown = ref(false)
const showMathsModal = ref(false)
const showShareModal = ref(false)
const selectedRanking = ref(null)

// Computed
const eventInstances = computed(() => store.allEventInstances)

// Transform events for ShareModal (needs id, name, category)
const shareEvents = computed(() => {
  return eventInstances.value.map(inst => ({
    id: inst.id,
    name: inst.name,
    category: inst.eventConfig?.template?.category || 'gvg',
    opponent: inst.opponent
  }))
})

const totalScore = computed(() => 
  props.rankings.reduce((sum, r) => sum + (r.rawData.totalScore || 0), 0)
)

const avgScore = computed(() => 
  props.rankings.length > 0 ? totalScore.value / props.rankings.length : 0
)

const topScorer = computed(() => {
  if (props.rankings.length === 0) return null
  return [...props.rankings].sort((a, b) => 
    (b.rawData.totalScore || 0) - (a.rawData.totalScore || 0)
  )[0]
})

// Format compact number
function formatCompact(num) {
  if (num == null) return '-'
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toLocaleString()
}

// Get event header class
function getEventHeaderClass(eventConfig) {
  switch (eventConfig.template.category) {
    case 'gvg': return 'text-lime-300 bg-lime-900/20'
    case 'kvk': return 'text-purple-300 bg-purple-900/20'
    default: return 'text-yellow-300 bg-yellow-900/20'
  }
}

// Get breakdown components for display
function getBreakdownComponents(ranking) {
  const components = []
  
  if (ranking.breakdown.power?.contribution > 0) {
    components.push({
      label: 'Pwr',
      ...ranking.breakdown.power
    })
  }
  
  Object.entries(ranking.breakdown).forEach(([key, value]) => {
    if (key === 'power') return
    if (key.startsWith('aggregate_')) {
      const cat = key.replace('aggregate_', '').toUpperCase()
      if (value.totalScore?.contribution > 0) {
        components.push({ label: `${cat} Total`, ...value.totalScore })
      }
      if (value.winRate?.contribution > 0) {
        components.push({ label: `${cat} WR`, ...value.winRate })
      }
    } else {
      // Event instance
      const inst = eventInstances.value.find(i => i.id === key)
      const label = inst?.name?.substring(0, 8) || key.substring(0, 8)
      
      if (value.score?.contribution > 0) {
        components.push({ label: `${label} Sc`, ...value.score })
      }
      if (value.warDay?.contribution > 0) {
        components.push({ label: `${label} War`, ...value.warDay })
      }
      if (value.winRecord?.contribution > 0) {
        components.push({ label: `${label} WR`, ...value.winRecord })
      }
      if (value.efficiency?.contribution > 0) {
        components.push({ label: `${label} Eff`, ...value.efficiency })
      }
    }
  })
  
  return components
}

// Open maths modal
function openMathsModal(ranking) {
  selectedRanking.value = ranking
  showMathsModal.value = true
}

// Check if event has any enabled weights
function hasEventWeight(instanceId) {
  const eventWeight = props.weights?.events?.[instanceId]
  if (!eventWeight) return false
  return eventWeight.score?.enabled || eventWeight.winRecord?.enabled || eventWeight.efficiency?.enabled
}

// Get event breakdown data
function getEventBreakdown(instanceId, metric) {
  const breakdown = selectedRanking.value?.breakdown?.[instanceId]?.[metric]
  if (!breakdown || breakdown.contribution === 0) return null
  return breakdown
}

// Get event weight value
function getEventWeightValue(instanceId, metric) {
  return props.weights?.events?.[instanceId]?.[metric]?.weight || 0
}

// Get detailed maths breakdown with min/max calculations
function getDetailedMathsBreakdown() {
  if (!selectedRanking.value || !props.weights) return []
  
  const components = []
  const allRankings = props.rankings
  const ranking = selectedRanking.value
  
  // Power
  if (props.weights.power?.enabled) {
    const powers = allRankings.map(r => r.rawData?.power || 0)
    const maxPower = Math.max(...powers)
    const minPower = Math.min(...powers)
    const guildPower = ranking.rawData?.power || 0
    const normalized = maxPower > minPower 
      ? ((guildPower - minPower) / (maxPower - minPower)) * 100 
      : 100
    const contribution = ranking.breakdown?.power?.contribution || (normalized * props.weights.power.weight / 100)
    
    components.push({
      id: 'power',
      icon: '⚡',
      label: 'Guild Power',
      weight: props.weights.power.weight,
      mode: 'Higher is better',
      guildValue: formatNumber(guildPower),
      maxValue: formatNumber(maxPower),
      minValue: minPower > 0 ? formatNumber(minPower) : null,
      normalizedFormula: `${formatNumber(guildPower)} / ${formatNumber(maxPower)}`,
      finalScore: contribution.toFixed(2)
    })
  }
  
  // Events
  eventInstances.value.forEach(instance => {
    const eventWeight = props.weights.events?.[instance.id]
    const result = ranking.results?.[instance.id]
    if (!eventWeight) return
    
    // Score
    if (eventWeight.score?.enabled) {
      const isKvK = instance.eventConfig.template.category === 'kvk'
      const scores = allRankings.map(r => {
        const res = r.results?.[instance.id]
        // For KvK, score is prep score (days 1-5)
        return isKvK ? (res?.prepScore || res?.totalScore || 0) : (res?.totalScore || 0)
      })
      const maxScore = Math.max(...scores)
      const minScore = Math.min(...scores)
      const guildScore = isKvK ? (result?.prepScore || result?.totalScore || 0) : (result?.totalScore || 0)
      const contribution = ranking.breakdown?.[instance.id]?.score?.contribution || 0
      
      components.push({
        id: `${instance.id}_score`,
        icon: isKvK ? '📋' : '⚔️',
        label: isKvK ? `${instance.name} Prep Score (Days 1-5)` : `${instance.name} Score`,
        weight: eventWeight.score.weight,
        mode: isKvK ? 'Prep Days Total (higher is better)' : 'Total Score (higher is better)',
        guildValue: formatNumber(guildScore),
        maxValue: formatNumber(maxScore),
        minValue: minScore > 0 ? formatNumber(minScore) : null,
        normalizedFormula: `${formatNumber(guildScore)} / ${formatNumber(maxScore)}`,
        finalScore: contribution.toFixed(2)
      })
    }
    
    // War Day (KvK only)
    if (eventWeight.warDay?.enabled && instance.eventConfig.template.category === 'kvk') {
      const warDayScores = allRankings.map(r => r.results?.[instance.id]?.warDayScore || 0)
      const maxWarDay = Math.max(...warDayScores)
      const minWarDay = Math.min(...warDayScores.filter(s => s > 0))
      const guildWarDay = result?.warDayScore || 0
      const contribution = ranking.breakdown?.[instance.id]?.warDay?.contribution || 0
      
      components.push({
        id: `${instance.id}_warDay`,
        icon: '⚔️',
        label: `${instance.name} War Day (Day 6)`,
        weight: eventWeight.warDay.weight,
        mode: 'War Day Score (higher is better)',
        guildValue: formatNumber(guildWarDay),
        maxValue: formatNumber(maxWarDay),
        minValue: minWarDay > 0 ? formatNumber(minWarDay) : null,
        normalizedFormula: `${formatNumber(guildWarDay)} / ${formatNumber(maxWarDay)}`,
        finalScore: contribution.toFixed(2)
      })
    }
    
    // Win Record (GvG only)
    if (eventWeight.winRecord?.enabled && instance.eventConfig.template.category === 'gvg') {
      let winDisplay, resultStatus
      
      if (result?.won != null) {
        resultStatus = result.won ? 'Won' : 'Lost'
        winDisplay = result.won ? 'Won' : 'Lost'
        
        // Add W-L breakdown if available
        if (result?.wins != null && result?.losses != null) {
          winDisplay = `${winDisplay} (${result.wins}W - ${result.losses}L)`
        }
      } else {
        resultStatus = 'Unknown'
        winDisplay = 'No data'
      }
      
      const contribution = ranking.breakdown?.[instance.id]?.winRecord?.contribution || 0
      const normalized = result?.won ? 100 : 0
      
      components.push({
        id: `${instance.id}_winRecord`,
        icon: '🏆',
        label: `${instance.name} Win Record`,
        weight: eventWeight.winRecord.weight,
        mode: 'Binary: Won = 100%, Lost = 0%',
        guildValue: winDisplay,
        maxValue: 'Won (100%)',
        minValue: 'Lost (0%)',
        normalizedFormula: `${resultStatus} = ${normalized}%`,
        finalScore: contribution.toFixed(2)
      })
    }
    
    // Efficiency
    if (eventWeight.efficiency?.enabled) {
      const efficiencies = allRankings.map(r => {
        const score = r.results?.[instance.id]?.totalScore || 0
        const power = r.rawData?.power || 1
        return score / power
      })
      const maxEff = Math.max(...efficiencies)
      const minEff = Math.min(...efficiencies)
      const guildEff = (result?.totalScore || 0) / (ranking.rawData?.power || 1)
      const contribution = ranking.breakdown?.[instance.id]?.efficiency?.contribution || 0
      
      components.push({
        id: `${instance.id}_efficiency`,
        icon: '📊',
        label: `${instance.name} Efficiency`,
        weight: eventWeight.efficiency.weight,
        mode: 'Score per Power (higher is better)',
        guildValue: guildEff.toFixed(4),
        maxValue: maxEff.toFixed(4),
        minValue: minEff.toFixed(4),
        normalizedFormula: `${guildEff.toFixed(4)} / ${maxEff.toFixed(4)}`,
        finalScore: contribution.toFixed(2)
      })
    }
  })
  
  return components
}
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
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(163, 230, 53, 0.6), rgba(74, 222, 128, 0.6));
  border-radius: 5px;
}
</style>