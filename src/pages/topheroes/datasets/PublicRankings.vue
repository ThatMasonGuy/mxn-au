<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 p-3 py-0 sm:p-6 md:py-16">
    <div class="max-w-6xl mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <RefreshCw class="w-8 h-8 text-lime-400 animate-spin" />
        <span class="ml-3 text-lime-300 text-lg">Loading rankings...</span>
      </div>

      <!-- Error State -->
      <div 
        v-else-if="error"
        class="bg-gradient-to-br from-red-900/90 to-red-800/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border-2 border-red-400/30 text-center"
      >
        <AlertCircle class="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-red-200 mb-2">Unable to Load Rankings</h2>
        <p class="text-red-300/70">{{ error }}</p>
      </div>

      <!-- Rankings Content -->
      <div v-else-if="publishedData" class="space-y-6 mb-6">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="flex items-center justify-center gap-3 mb-2">
            <Trophy class="w-10 h-10 text-yellow-400" />
            <h1 class="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-lime-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
              {{ publishedData.datasetName }}
            </h1>
          </div>
          <p class="text-lime-200/80 text-sm sm:text-lg">Guild Rankings</p>
          <div class="flex items-center justify-center gap-4 mt-3 text-sm text-lime-300/60">
            <span class="flex items-center gap-1">
              <Calendar class="w-4 h-4" />
              Published {{ formatDate(publishedData.publishedAt) }}
            </span>
            <span class="flex items-center gap-1">
              <Users class="w-4 h-4" />
              {{ publishedData.rankings.length }} guilds
            </span>
            <span v-if="publishedData.viewCount" class="flex items-center gap-1">
              <Eye class="w-4 h-4" />
              {{ publishedData.viewCount }} views
            </span>
          </div>
        </div>

        <!-- Top 3 Podium -->
        <div class="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8 items-end">
          <!-- 2nd Place -->
          <div v-if="publishedData.rankings[1]">
            <div class="bg-gradient-to-br from-gray-700/50 to-gray-600/30 rounded-2xl p-4 border-2 border-gray-400/30 text-center">
              <div class="text-4xl mb-2">🥈</div>
              <div class="font-bold text-lg text-gray-200">
                {{ publishedData.rankings[1].guild.shorthand }}
              </div>
              <div class="text-sm text-gray-300 truncate">
                {{ publishedData.rankings[1].guild.name }}
              </div>
              <div class="text-xl font-bold text-gray-100 mt-2">
                {{ publishedData.rankings[1].weightedScore.toFixed(1) }}
              </div>
              <div class="text-xs text-gray-400">points</div>
            </div>
          </div>

          <!-- 1st Place -->
          <div v-if="publishedData.rankings[0]" class="mb-8">
            <div class="bg-gradient-to-br from-yellow-600/40 to-amber-500/20 rounded-2xl p-5 border-2 border-yellow-400/50 text-center shadow-lg shadow-yellow-500/20">
              <div class="text-5xl mb-2">🥇</div>
              <div class="font-bold text-xl text-yellow-200">
                {{ publishedData.rankings[0].guild.shorthand }}
              </div>
              <div class="text-sm text-yellow-300/80 truncate">
                {{ publishedData.rankings[0].guild.name }}
              </div>
              <div class="text-2xl font-bold text-yellow-100 mt-2">
                {{ publishedData.rankings[0].weightedScore.toFixed(1) }}
              </div>
              <div class="text-xs text-yellow-400">points</div>
            </div>
          </div>

          <!-- 3rd Place -->
          <div v-if="publishedData.rankings[2]">
            <div class="bg-gradient-to-br from-amber-800/40 to-orange-700/20 rounded-2xl p-4 border-2 border-amber-500/30 text-center">
              <div class="text-4xl mb-2">🥉</div>
              <div class="font-bold text-lg text-amber-200">
                {{ publishedData.rankings[2].guild.shorthand }}
              </div>
              <div class="text-sm text-amber-300/70 truncate">
                {{ publishedData.rankings[2].guild.name }}
              </div>
              <div class="text-xl font-bold text-amber-100 mt-2">
                {{ publishedData.rankings[2].weightedScore.toFixed(1) }}
              </div>
              <div class="text-xs text-amber-400">points</div>
            </div>
          </div>
        </div>

        <!-- How It's Calculated Box -->
        <div class="bg-gradient-to-br from-blue-900/40 to-cyan-900/30 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border-2 border-blue-400/40 mb-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Calculator class="w-6 h-6 text-blue-300" />
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-bold text-blue-200 mb-2 flex items-center gap-2">
                How Rankings Are Calculated
                <button
                  @click="showWeightDetails = !showWeightDetails"
                  class="text-sm font-normal text-blue-300/70 hover:text-blue-300 transition-colors"
                >
                  {{ showWeightDetails ? '(hide details)' : '(show details)' }}
                </button>
              </h2>
              <p class="text-blue-100/80 text-sm leading-relaxed">
                Each guild is scored across multiple categories. Within each category, guilds are <strong>normalized</strong> 
                so the best performer gets 100 points and the worst gets 0. These normalized scores are then 
                multiplied by the category's <strong>weight percentage</strong> and summed for the final score.
                Click the <Info class="w-4 h-4 inline text-blue-300" /> icon on any row to see the exact calculation for that guild.
              </p>
              
              <!-- Weight Details (Expandable) -->
              <div v-if="showWeightDetails && publishedData.weights" class="mt-4 pt-4 border-t border-blue-500/30">
                <h3 class="text-sm font-semibold text-blue-200 mb-3">Weight Configuration Used:</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  <!-- Power -->
                  <div v-if="publishedData.weights.power?.enabled" 
                       class="bg-blue-950/50 rounded-lg p-2 border border-blue-500/20">
                    <div class="text-xs text-blue-300/70">Guild Power</div>
                    <div class="text-lg font-bold text-blue-200">{{ publishedData.weights.power.weight }}%</div>
                  </div>
                  
                  <!-- Event Weights -->
                  <template v-for="event in publishedData.events" :key="event.id">
                    <!-- Score (for KvK this is Prep Score) -->
                    <div v-if="publishedData.weights.events?.[event.id]?.score?.enabled"
                         class="bg-blue-950/50 rounded-lg p-2 border border-blue-500/20">
                      <div class="text-xs text-blue-300/70">
                        {{ event.category === 'kvk' ? `${event.name} Prep (Days 1-5)` : `${event.name} Score` }}
                      </div>
                      <div class="text-lg font-bold text-blue-200">{{ publishedData.weights.events[event.id].score.weight }}%</div>
                    </div>
                    
                    <!-- War Day (KvK only) -->
                    <div v-if="publishedData.weights.events?.[event.id]?.warDay?.enabled && event.category === 'kvk'"
                         class="bg-purple-950/50 rounded-lg p-2 border border-purple-500/20">
                      <div class="text-xs text-purple-300/70">{{ event.name }} War Day (Day 6)</div>
                      <div class="text-lg font-bold text-purple-200">{{ publishedData.weights.events[event.id].warDay.weight }}%</div>
                    </div>
                    
                    <!-- Win Record (GvG only) -->
                    <div v-if="publishedData.weights.events?.[event.id]?.winRecord?.enabled && event.category !== 'kvk'"
                         class="bg-blue-950/50 rounded-lg p-2 border border-blue-500/20">
                      <div class="text-xs text-blue-300/70">{{ event.name }} Win Record</div>
                      <div class="text-lg font-bold text-blue-200">{{ publishedData.weights.events[event.id].winRecord.weight }}%</div>
                    </div>
                    
                    <!-- Efficiency -->
                    <div v-if="publishedData.weights.events?.[event.id]?.efficiency?.enabled"
                         class="bg-blue-950/50 rounded-lg p-2 border border-blue-500/20">
                      <div class="text-xs text-blue-300/70">{{ event.name }} Efficiency</div>
                      <div class="text-lg font-bold text-blue-200">{{ publishedData.weights.events[event.id].efficiency.weight }}%</div>
                    </div>
                  </template>
                </div>
                
                <div class="mt-3 text-xs text-blue-300/60">
                  Total weight: {{ calculateTotalWeight() }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- View Mode Toggle & Share -->
        <div class="flex justify-center items-center gap-2 mb-4 flex-wrap">
          <Button
            @click="viewMode = 'table'"
            size="sm"
            :class="[
              'border-lime-400/50',
              viewMode === 'table' 
                ? 'bg-lime-600 text-green-950' 
                : 'bg-lime-600/20 text-lime-400 hover:bg-lime-500/20'
            ]"
          >
            <List class="w-4 h-4 mr-1" />
            Table
          </Button>
          <Button
            @click="viewMode = 'cards'"
            size="sm"
            :class="[
              'border-lime-400/50',
              viewMode === 'cards' 
                ? 'bg-lime-600 text-green-950' 
                : 'bg-lime-600/20 text-lime-400 hover:bg-lime-500/20'
            ]"
          >
            <LayoutGrid class="w-4 h-4 mr-1" />
            Cards
          </Button>
          
          <div class="w-px h-6 bg-lime-500/30 mx-2 hidden sm:block"></div>
          
          <Button
            @click="showShareModal = true"
            size="sm"
            class="bg-blue-600/30 text-blue-300 border-blue-400/50 hover:bg-blue-500/30"
          >
            <Share2 class="w-4 h-4 mr-1" />
            Share & Export
          </Button>
        </div>

        <!-- Full Rankings Table -->
        <div 
          v-if="viewMode === 'table'"
          class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-lime-400/30 overflow-hidden"
        >
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full">
              <thead>
                <tr class="bg-green-900/50 border-b border-lime-500/30">
                  <th class="px-4 py-4 text-left text-sm font-semibold text-lime-300 w-20">Rank</th>
                  <th class="px-4 py-4 text-left text-sm font-semibold text-lime-300">Guild</th>
                  <th class="px-4 py-4 text-right text-sm font-semibold text-lime-300 w-28">Score</th>
                  <th class="px-2 py-4 text-center text-sm font-semibold text-lime-300 w-10"></th>
                  <th class="px-4 py-4 text-right text-sm font-semibold text-lime-300 w-32">Power</th>
                  <th 
                    v-for="event in publishedData.events"
                    :key="event.id"
                    class="px-4 py-4 text-center text-sm font-semibold text-lime-300 min-w-[140px]"
                  >
                    {{ event.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="ranking in publishedData.rankings"
                  :key="ranking.rank"
                  :class="[
                    'border-b border-lime-500/10 hover:bg-green-900/30 transition-colors',
                    ranking.rank <= 3 ? 'bg-gradient-to-r' : '',
                    ranking.rank === 1 ? 'from-yellow-900/30 to-transparent' : '',
                    ranking.rank === 2 ? 'from-gray-600/20 to-transparent' : '',
                    ranking.rank === 3 ? 'from-amber-900/20 to-transparent' : ''
                  ]"
                >
                  <td class="px-4 py-4">
                    <span v-if="ranking.rank === 1" class="text-2xl">🥇</span>
                    <span v-else-if="ranking.rank === 2" class="text-2xl">🥈</span>
                    <span v-else-if="ranking.rank === 3" class="text-2xl">🥉</span>
                    <span v-else class="text-lime-400 font-mono text-lg">{{ ranking.rank }}</span>
                  </td>
                  <td class="px-4 py-4">
                    <div class="font-semibold text-lime-200">{{ ranking.guild.name || ranking.guild.shorthand }}</div>
                    <div v-if="ranking.guild.name" class="text-xs text-lime-400/60">{{ ranking.guild.shorthand }}</div>
                  </td>
                  <td class="px-4 py-4 text-right">
                    <span class="text-xl font-bold text-lime-200">{{ ranking.weightedScore.toFixed(1) }}</span>
                  </td>
                  <td class="px-2 py-4 text-center">
                    <button
                      @click="openMathsModal(ranking)"
                      class="p-1.5 rounded-full hover:bg-lime-500/20 text-lime-400/60 hover:text-lime-300 transition-colors"
                      title="Show calculation breakdown"
                    >
                      <Info class="w-4 h-4" />
                    </button>
                  </td>
                  <td class="px-4 py-4 text-right font-mono text-lime-300">
                    {{ formatNumber(ranking.rawData?.power) }}
                  </td>
                  <td 
                    v-for="event in publishedData.events"
                    :key="`${ranking.rank}-${event.id}`"
                    class="px-4 py-4 text-center"
                  >
                    <div v-if="ranking.results?.[event.id]">
                      <div class="text-sm font-mono text-lime-200">
                        {{ formatCompact(ranking.results[event.id].totalScore) }}
                      </div>
                      <div v-if="ranking.results[event.id].wins != null" class="text-xs mt-0.5">
                        <span class="text-lime-400">{{ ranking.results[event.id].wins }}W</span>
                        <span class="text-lime-500/50">-</span>
                        <span class="text-red-400">{{ ranking.results[event.id].losses }}L</span>
                      </div>
                    </div>
                    <span v-else class="text-lime-500/50">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Card View -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="ranking in publishedData.rankings"
            :key="ranking.rank"
            :class="[
              'bg-gradient-to-br from-green-900/90 to-emerald-900/90 rounded-xl p-4 border-2',
              ranking.rank === 1 ? 'border-yellow-400/50 shadow-lg shadow-yellow-500/20' :
              ranking.rank === 2 ? 'border-gray-400/50' :
              ranking.rank === 3 ? 'border-amber-500/50' :
              'border-lime-500/30'
            ]"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <span v-if="ranking.rank === 1" class="text-3xl">🥇</span>
                <span v-else-if="ranking.rank === 2" class="text-3xl">🥈</span>
                <span v-else-if="ranking.rank === 3" class="text-3xl">🥉</span>
                <span v-else class="text-2xl font-bold text-lime-400">#{{ ranking.rank }}</span>
              </div>
              <div class="text-right flex items-start gap-2">
                <button
                  @click="openMathsModal(ranking)"
                  class="p-1 rounded-full hover:bg-lime-500/20 text-lime-400/60 hover:text-lime-300 transition-colors"
                  title="Show calculation breakdown"
                >
                  <Info class="w-4 h-4" />
                </button>
                <div>
                  <div class="text-2xl font-bold text-lime-200">{{ ranking.weightedScore.toFixed(1) }}</div>
                  <div class="text-xs text-lime-400/60">points</div>
                </div>
              </div>
            </div>
            
            <div class="mb-3">
              <div class="font-bold text-lg text-lime-200">{{ ranking.guild.shorthand }}</div>
              <div v-if="ranking.guild.name" class="text-sm text-lime-300/70">{{ ranking.guild.name }}</div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="bg-green-950/50 rounded px-2 py-1">
                <div class="text-lime-400/60 text-xs">Power</div>
                <div class="text-lime-200 font-mono">{{ formatCompact(ranking.rawData?.power) }}</div>
              </div>
              <div class="bg-green-950/50 rounded px-2 py-1">
                <div class="text-lime-400/60 text-xs">Total Score</div>
                <div class="text-lime-200 font-mono">{{ formatCompact(ranking.rawData?.totalScore) }}</div>
              </div>
            </div>

            <!-- Event Results -->
            <div v-if="publishedData.events?.length > 0" class="mt-3 pt-3 border-t border-lime-500/20">
              <div 
                v-for="event in publishedData.events"
                :key="event.id"
                class="flex items-center justify-between text-sm py-1"
              >
                <span class="text-lime-400/70">{{ event.name }}</span>
                <div v-if="ranking.results?.[event.id]" class="text-right">
                  <span class="text-lime-200 font-mono">{{ formatCompact(ranking.results[event.id].totalScore) }}</span>
                  <span v-if="ranking.results[event.id].wins != null" class="text-xs ml-2">
                    <span class="text-lime-400">{{ ranking.results[event.id].wins }}W</span>-<span class="text-red-400">{{ ranking.results[event.id].losses }}L</span>
                  </span>
                </div>
                <span v-else class="text-lime-500/50">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Insights CTA -->
      <div class="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl p-6 border border-purple-500/30 mb-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <BarChart3 class="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-purple-200">Want more details?</h3>
              <p class="text-purple-300/70 text-sm">Compare guilds, explore event breakdowns, and get performance insights</p>
            </div>
          </div>
          <router-link
            :to="`/topheroes/tools/rankings/public/${route.params.publishId}/insights`"
            class="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <TrendingUp class="w-4 h-4" />
            View Detailed Insights
          </router-link>
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
            <!-- Each enabled weight component -->
            <template v-for="comp in getDetailedBreakdown(selectedRanking)" :key="comp.id">
              <div class="bg-green-950/70 rounded-lg border border-lime-500/30 p-4">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-yellow-400">{{ comp.icon }}</span>
                  <span class="font-bold text-lime-200">{{ comp.label }} ({{ comp.weight }}%)</span>
                </div>
                
                <ul class="space-y-1 text-lime-300/90 list-disc list-inside">
                  <li v-if="comp.mode">Mode: {{ comp.mode }}</li>
                  <li>{{ selectedRanking.guild.shorthand }}: <span class="text-lime-100">{{ comp.guildValue }}</span></li>
                  <li>Max value: <span class="text-lime-100">{{ comp.maxValue }}</span></li>
                  <li v-if="comp.minValue !== undefined">Min value: <span class="text-lime-100">{{ comp.minValue }}</span></li>
                  <li>
                    Normalized: 
                    <span class="text-yellow-300">({{ comp.normalizedCalc }})</span>
                    × {{ comp.weight }}%
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
        :rankings="publishedData?.rankings || []"
        :events="shareEvents"
        :weights="publishedData?.weights"
        :datasetName="publishedData?.datasetName || 'Rankings'"
        @close="showShareModal = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Trophy, Calendar, Users, Eye, AlertCircle, RefreshCw,
  List, LayoutGrid, Link, Share2, Info, Calculator, BarChart3, TrendingUp
} from 'lucide-vue-next'
import { firestore } from '@/firebase'
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore'
import { formatNumber } from '@/lib/datasetHelpers'
import ShareModal from '@/components/topheroes/rankings/ShareModal.vue'

const route = useRoute()

// State
const isLoading = ref(true)
const error = ref(null)
const publishedData = ref(null)
const viewMode = ref('table')
const showWeightDetails = ref(false)
const showMathsModal = ref(false)
const showShareModal = ref(false)
const selectedRanking = ref(null)

// Transform events for ShareModal
const shareEvents = computed(() => {
  if (!publishedData.value?.events) return []
  return publishedData.value.events.map(event => ({
    id: event.id,
    name: event.name,
    category: event.category || 'gvg',
    opponent: event.opponent
  }))
})

// Load published data
onMounted(async () => {
  const publishId = route.params.publishId
  
  if (!publishId) {
    error.value = 'No ranking ID provided'
    isLoading.value = false
    return
  }

  try {
    const publishRef = doc(firestore, 'topheroes', 'guilds-v2', 'published', publishId)
    const publishSnap = await getDoc(publishRef)

    if (!publishSnap.exists()) {
      error.value = 'Rankings not found'
      isLoading.value = false
      return
    }

    publishedData.value = {
      id: publishSnap.id,
      ...publishSnap.data()
    }

    // Increment view count
    await updateDoc(publishRef, {
      viewCount: increment(1)
    })
  } catch (err) {
    console.error('Error loading published rankings:', err)
    error.value = 'Failed to load rankings'
  } finally {
    isLoading.value = false
  }
})

// Get event name by ID
function getEventName(eventId) {
  const event = publishedData.value?.events?.find(e => e.id === eventId)
  return event?.name || eventId.substring(0, 10)
}

// Format date
function formatDate(dateString) {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// Format compact number
function formatCompact(num) {
  if (num == null) return '-'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
  return num.toLocaleString()
}

// Calculate total weight
function calculateTotalWeight() {
  if (!publishedData.value?.weights) return 0
  let total = 0
  
  if (publishedData.value.weights.power?.enabled) {
    total += publishedData.value.weights.power.weight
  }
  
  Object.values(publishedData.value.weights.events || {}).forEach(ew => {
    if (ew.score?.enabled) total += ew.score.weight
    if (ew.warDay?.enabled) total += ew.warDay.weight
    if (ew.winRecord?.enabled) total += ew.winRecord.weight
    if (ew.efficiency?.enabled) total += ew.efficiency.weight
  })
  
  return total
}

// Open maths modal
function openMathsModal(ranking) {
  selectedRanking.value = ranking
  showMathsModal.value = true
}

// Get detailed breakdown for maths modal
function getDetailedBreakdown(ranking) {
  if (!ranking || !publishedData.value?.weights) return []
  
  const components = []
  const weights = publishedData.value.weights
  const allRankings = publishedData.value.rankings || []
  
  // Power component
  if (weights.power?.enabled && ranking.rawData?.power) {
    const guildPower = ranking.rawData.power
    // Calculate actual min/max from all rankings
    const powers = allRankings.map(r => r.rawData?.power || 0).filter(p => p > 0)
    const maxPower = powers.length > 0 ? Math.max(...powers) : guildPower
    const minPower = powers.length > 0 ? Math.min(...powers) : 0
    const normalized = maxPower > minPower 
      ? ((guildPower - minPower) / (maxPower - minPower)) * 100 
      : 100
    const score = (normalized * weights.power.weight / 100)
    
    components.push({
      id: 'power',
      icon: '⚡',
      label: 'Guild Power',
      weight: weights.power.weight,
      mode: 'Higher is better',
      guildValue: formatNumber(guildPower),
      maxValue: formatNumber(maxPower),
      minValue: formatNumber(minPower),
      normalizedCalc: `${formatNumber(guildPower)} / ${formatNumber(maxPower)}`,
      finalScore: score.toFixed(2)
    })
  }
  
  // Event components
  publishedData.value.events?.forEach(event => {
    const eventWeight = weights.events?.[event.id]
    const result = ranking.results?.[event.id]
    const isKvK = event.category === 'kvk'
    
    // Score (for KvK this is prep score)
    if (eventWeight?.score?.enabled) {
      const guildScore = isKvK ? (result?.prepScore || result?.totalScore || 0) : (result?.totalScore || 0)
      // Calculate actual min/max from all rankings
      const scores = allRankings.map(r => {
        const res = r.results?.[event.id]
        return isKvK ? (res?.prepScore || res?.totalScore || 0) : (res?.totalScore || 0)
      }).filter(s => s > 0)
      const maxScore = scores.length > 0 ? Math.max(...scores) : guildScore
      const minScore = scores.length > 0 ? Math.min(...scores) : 0
      const normalized = maxScore > minScore 
        ? ((guildScore - minScore) / (maxScore - minScore)) * 100 
        : 100
      const score = (normalized * eventWeight.score.weight / 100)
      
      components.push({
        id: `${event.id}_score`,
        icon: isKvK ? '📋' : '⚔️',
        label: isKvK ? `${event.name} Prep Score (Days 1-5)` : `${event.name} Score`,
        weight: eventWeight.score.weight,
        mode: isKvK ? 'Prep Days Total (higher is better)' : 'Total Score (higher is better)',
        guildValue: formatNumber(guildScore),
        maxValue: formatNumber(maxScore),
        minValue: formatNumber(minScore),
        normalizedCalc: `${formatNumber(guildScore)} / ${formatNumber(maxScore)}`,
        finalScore: score.toFixed(2)
      })
    }
    
    // War Day (KvK only)
    if (eventWeight?.warDay?.enabled && isKvK) {
      const guildWarDay = result?.warDayScore || 0
      const warDayScores = allRankings.map(r => r.results?.[event.id]?.warDayScore || 0).filter(s => s > 0)
      const maxWarDay = warDayScores.length > 0 ? Math.max(...warDayScores) : guildWarDay
      const minWarDay = warDayScores.length > 0 ? Math.min(...warDayScores) : 0
      const normalized = maxWarDay > minWarDay 
        ? ((guildWarDay - minWarDay) / (maxWarDay - minWarDay)) * 100 
        : 100
      const score = (normalized * eventWeight.warDay.weight / 100)
      
      components.push({
        id: `${event.id}_warDay`,
        icon: '⚔️',
        label: `${event.name} War Day (Day 6)`,
        weight: eventWeight.warDay.weight,
        mode: 'War Day Score (higher is better)',
        guildValue: formatNumber(guildWarDay),
        maxValue: formatNumber(maxWarDay),
        minValue: formatNumber(minWarDay),
        normalizedCalc: `${formatNumber(guildWarDay)} / ${formatNumber(maxWarDay)}`,
        finalScore: score.toFixed(2)
      })
    }
    
    // Win Record (GvG only)
    if (eventWeight?.winRecord?.enabled && !isKvK) {
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
      
      const normalized = result?.won ? 100 : 0
      const score = (normalized * eventWeight.winRecord.weight / 100)
      
      components.push({
        id: `${event.id}_winRecord`,
        icon: '🏆',
        label: `${event.name} Win Record`,
        weight: eventWeight.winRecord.weight,
        mode: 'Binary: Won = 100%, Lost = 0%',
        guildValue: winDisplay,
        maxValue: 'Won (100%)',
        minValue: 'Lost (0%)',
        normalizedCalc: `${resultStatus} = ${normalized}%`,
        finalScore: score.toFixed(2)
      })
    }
    
    // Efficiency
    if (eventWeight?.efficiency?.enabled && result?.totalScore && ranking.rawData?.power) {
      const efficiency = result.totalScore / ranking.rawData.power
      
      // Calculate actual min/max efficiency from all rankings
      const efficiencies = allRankings.map(r => {
        const score = r.results?.[event.id]?.totalScore || 0
        const power = r.rawData?.power || 1
        return score > 0 && power > 0 ? score / power : 0
      }).filter(e => e > 0)
      const maxEff = efficiencies.length > 0 ? Math.max(...efficiencies) : efficiency
      const minEff = efficiencies.length > 0 ? Math.min(...efficiencies) : 0
      
      const normalized = maxEff > minEff 
        ? ((efficiency - minEff) / (maxEff - minEff)) * 100 
        : 100
      const score = (normalized * eventWeight.efficiency.weight / 100)
      
      components.push({
        id: `${event.id}_efficiency`,
        icon: '📊',
        label: `${event.name} Efficiency`,
        weight: eventWeight.efficiency.weight,
        mode: 'Score per Power (higher is better)',
        guildValue: efficiency.toFixed(4),
        maxValue: maxEff.toFixed(4),
        minValue: minEff.toFixed(4),
        normalizedCalc: `${efficiency.toFixed(4)} / ${maxEff.toFixed(4)}`,
        finalScore: score.toFixed(2)
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