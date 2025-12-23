<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 p-3 py-0 sm:p-6 md:py-16">
    <div class="max-w-[1920px] mx-auto">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-8">
        <h1 class="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-lime-400 to-emerald-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">
          Guild Rankings
        </h1>
        <p class="text-lime-200/80 text-sm sm:text-lg">Calculate weighted rankings for your dataset</p>
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

      <!-- No Dataset Selected -->
      <div 
        v-if="!store.hasDataset"
        class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-8 sm:p-12 shadow-2xl border-2 border-lime-400/30 text-center max-w-2xl mx-auto"
      >
        <Database class="w-16 h-16 text-lime-500/50 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-lime-300 mb-2">No Dataset Loaded</h2>
        <p class="text-lime-300/60 mb-6">Select a dataset to calculate rankings.</p>
        <Button 
          @click="navigateToBuilder"
          class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold"
        >
          Go to Dataset Builder
        </Button>
      </div>

      <!-- Main Content -->
      <div v-else class="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        <!-- Sidebar - Weight Config -->
        <div class="xl:col-span-4">
          <div class="sticky top-4">
            <div class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30">
              <!-- Dataset Info -->
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-2">
                  <Database class="w-5 h-5 text-lime-400" />
                  <span class="font-semibold text-lime-200">{{ store.currentDataset?.name }}</span>
                </div>
                <Badge class="bg-lime-600/20 border-lime-500 text-lime-300">
                  {{ store.guilds.length }} guilds
                </Badge>
              </div>

              <!-- Weight Config -->
              <WeightConfig v-model="weights" />

              <!-- Calculate Button -->
              <div class="mt-6 pt-6 border-t border-lime-500/20">
                <Button 
                  @click="calculateRankings"
                  :disabled="isCalculating || store.guilds.length === 0"
                  class="w-full bg-gradient-to-r from-yellow-500 to-lime-500 hover:from-yellow-400 hover:to-lime-400 text-green-950 font-bold text-lg py-6"
                >
                  <Calculator class="w-5 h-5 mr-2" />
                  {{ isCalculating ? 'Calculating...' : 'Calculate Rankings' }}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Area - Rankings -->
        <div class="xl:col-span-8">
          <div class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30">
            <!-- No Rankings Yet -->
            <div 
              v-if="!rankingResult"
              class="text-center py-12"
            >
              <Trophy class="w-16 h-16 text-lime-500/30 mx-auto mb-4" />
              <h2 class="text-xl font-semibold text-lime-300/70 mb-2">Configure weights and calculate</h2>
              <p class="text-lime-300/50">Adjust the weights in the sidebar, then click "Calculate Rankings"</p>
            </div>

            <!-- Rankings Table -->
            <RankingTable 
              v-else
              :rankings="rankingResult.rankings"
              :weights="weights"
            />
          </div>

          <!-- Save/Publish Section -->
          <div v-if="rankingResult" class="mt-4 bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30">
            <!-- Status Message -->
            <div 
              v-if="statusMessage"
              :class="[
                'mb-4 p-3 rounded-lg flex items-center gap-2 text-sm',
                statusType === 'success' ? 'bg-lime-500/20 border border-lime-400/50 text-lime-300' : 
                statusType === 'error' ? 'bg-red-500/20 border border-red-400/50 text-red-300' :
                'bg-blue-500/20 border border-blue-400/50 text-blue-300'
              ]"
            >
              <CheckCircle v-if="statusType === 'success'" class="w-4 h-4" />
              <AlertCircle v-else class="w-4 h-4" />
              {{ statusMessage }}
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-lime-200">Save & Publish</h3>
                <p class="text-sm text-lime-300/60">Save these rankings or publish for public viewing</p>
              </div>
              <div class="flex items-center gap-2">
                <Button 
                  @click="saveWeights"
                  :disabled="isSaving"
                  variant="outline"
                  class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20"
                >
                  <Save class="w-4 h-4 mr-1" />
                  {{ isSaving ? 'Saving...' : 'Save Weights' }}
                </Button>
                <Button 
                  @click="publishRankings"
                  :disabled="isPublishing"
                  class="bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  <Globe class="w-4 h-4 mr-1" />
                  {{ isPublishing ? 'Publishing...' : 'Publish' }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Database, Calculator, Trophy, Save, Globe, BarChart3, ArrowRightLeft, CheckCircle, AlertCircle } from 'lucide-vue-next'
import { firestore } from '@/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useDatasetStore } from '@/stores/useDatasetStore'
import { calculateRankings as calcRankings, createDefaultWeights } from '@/lib/rankingCalculator'
import { removeUndefined } from '@/lib/datasetHelpers'
import WeightConfig from '@/components/topheroes/rankings/WeightConfig.vue'
import RankingTable from '@/components/topheroes/rankings/RankingTable.vue'

const router = useRouter()
const route = useRoute()
const store = useDatasetStore()

// State
const weights = ref(null)
const rankingResult = ref(null)
const isCalculating = ref(false)
const isSaving = ref(false)
const isPublishing = ref(false)
const statusMessage = ref('')
const statusType = ref('info')

// Show status message
function showStatus(type, message, duration = 5000) {
  statusType.value = type
  statusMessage.value = message
  if (duration > 0) {
    setTimeout(() => statusMessage.value = '', duration)
  }
}

// Navigate to builder
function navigateToBuilder() {
  router.push('/topheroes/tools/rankings')
}

// Calculate rankings
function calculateRankings() {
  if (!store.hasDataset || store.guilds.length === 0) return
  
  isCalculating.value = true
  
  // Use setTimeout to allow UI to update
  setTimeout(() => {
    try {
      const validGuilds = store.guilds.filter(g => g.shorthand?.trim())
      rankingResult.value = calcRankings(validGuilds, store.eventConfigs, weights.value)
    } catch (err) {
      console.error('Error calculating rankings:', err)
    } finally {
      isCalculating.value = false
    }
  }, 100)
}

// Save weights to dataset
async function saveWeights() {
  if (!store.currentDataset || !weights.value) return
  
  isSaving.value = true
  try {
    await store.updateDatasetConfig({
      metadata: {
        ...store.currentDataset.metadata,
        savedWeights: weights.value
      }
    })
    showStatus('success', 'Weights saved successfully!')
  } catch (err) {
    console.error('Error saving weights:', err)
    showStatus('error', 'Failed to save weights')
  } finally {
    isSaving.value = false
  }
}

// Publish rankings
async function publishRankings() {
  if (!rankingResult.value || !store.currentDataset) return
  
  isPublishing.value = true
  try {
    const publishId = `pub-${Date.now().toString(36)}`
    
    // Prepare events data for public view
    const events = []
    store.eventConfigs.forEach(ec => {
      if (!ec.enabled) return
      ec.instances.forEach(inst => {
        events.push({
          id: inst.id,
          name: inst.name,
          category: ec.template.category,
          opponent: inst.opponent || null
        })
      })
    })
    
    // Prepare rankings data (simplified for public)
    const publicRankings = rankingResult.value.rankings.map(r => ({
      rank: r.rank,
      guild: {
        name: r.guild.name || null,
        shorthand: r.guild.shorthand
      },
      weightedScore: r.weightedScore,
      rawData: r.rawData,
      results: r.results
    }))
    
    // Clean all data before saving
    const cleanedData = removeUndefined({
      datasetId: store.currentDataset.id,
      datasetName: store.currentDataset.name,
      versionId: store.currentVersionId,
      events,
      rankings: publicRankings,
      weights: weights.value,
      publishedAt: new Date().toISOString(),
      viewCount: 0
    })
    
    // Save to Firestore
    const publishRef = doc(firestore, 'topheroes', 'guilds-v2', 'published', publishId)
    await setDoc(publishRef, cleanedData)
    
    // Copy link to clipboard
    const publicUrl = `${window.location.origin}/topheroes/tools/rankings/public/${publishId}`
    await navigator.clipboard.writeText(publicUrl)
    showStatus('success', `Published! Link copied to clipboard`)
    
  } catch (err) {
    console.error('Error publishing:', err)
    showStatus('error', 'Failed to publish rankings')
  } finally {
    isPublishing.value = false
  }
}

// Load initial data
onMounted(async () => {
  // Check for dataset in query params
  const datasetId = route.query.dataset
  
  if (datasetId && (!store.currentDataset || store.currentDataset.id !== datasetId)) {
    await store.loadDatasets()
    await store.loadDataset(datasetId)
    await store.loadVersion(datasetId)
  }
  
  // Initialize weights
  if (store.hasDataset) {
    // Check for saved weights
    if (store.currentDataset?.metadata?.savedWeights) {
      weights.value = store.currentDataset.metadata.savedWeights
    } else {
      weights.value = createDefaultWeights(store.eventConfigs)
    }
  }
})

// Watch for dataset changes
watch(() => store.currentDataset, (newDataset) => {
  if (newDataset) {
    if (newDataset.metadata?.savedWeights) {
      weights.value = newDataset.metadata.savedWeights
    } else {
      weights.value = createDefaultWeights(store.eventConfigs)
    }
    rankingResult.value = null
  }
})
</script>
