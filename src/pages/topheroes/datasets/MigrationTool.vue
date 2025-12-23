<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 p-3 py-0 sm:p-6 md:py-16">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-8">
        <h1 class="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-amber-400 via-lime-400 to-emerald-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">
          Data Migration
        </h1>
        <p class="text-lime-200/80 text-sm sm:text-lg">Migrate v1 datasets to the new flexible format</p>
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

      <!-- Migration Steps -->
      <div class="space-y-6">
        <!-- Step 1: Select Source -->
        <div class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-8 rounded-full bg-lime-600 flex items-center justify-center text-green-950 font-bold">1</div>
            <h2 class="text-lg font-semibold text-lime-300">Select Source Data</h2>
          </div>

          <div class="space-y-4">
            <!-- Source Selection -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                @click="sourceType = 'firestore'"
                :class="[
                  'p-4 rounded-xl border-2 text-left transition-all',
                  sourceType === 'firestore'
                    ? 'bg-lime-600/20 border-lime-400'
                    : 'bg-green-950/50 border-lime-500/30 hover:border-lime-500/50'
                ]"
              >
                <Database class="w-6 h-6 text-lime-400 mb-2" />
                <div class="font-medium text-lime-200">Firestore (v1)</div>
                <div class="text-sm text-lime-300/60">Load from existing database</div>
              </button>
              
              <button
                @click="sourceType = 'json'"
                :class="[
                  'p-4 rounded-xl border-2 text-left transition-all',
                  sourceType === 'json'
                    ? 'bg-lime-600/20 border-lime-400'
                    : 'bg-green-950/50 border-lime-500/30 hover:border-lime-500/50'
                ]"
              >
                <FileJson class="w-6 h-6 text-cyan-400 mb-2" />
                <div class="font-medium text-lime-200">JSON File</div>
                <div class="text-sm text-lime-300/60">Upload exported JSON</div>
              </button>
            </div>

            <!-- Firestore Source -->
            <div v-if="sourceType === 'firestore'" class="space-y-3">
              <Button
                @click="loadV1Datasets"
                :disabled="isLoadingV1"
                class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold"
              >
                <RefreshCw v-if="isLoadingV1" class="w-4 h-4 mr-2 animate-spin" />
                <Download v-else class="w-4 h-4 mr-2" />
                {{ isLoadingV1 ? 'Loading...' : 'Load v1 Datasets' }}
              </Button>

              <div v-if="v1Datasets.length > 0" class="space-y-2">
                <label class="text-sm text-lime-300/80">Select dataset to migrate:</label>
                <select
                  v-model="selectedV1Dataset"
                  class="w-full bg-green-950/70 border border-lime-500/30 rounded-lg px-3 py-2 text-lime-100"
                >
                  <option value="">Choose a dataset...</option>
                  <option v-for="ds in v1Datasets" :key="ds.id" :value="ds.id">
                    {{ ds.name || ds.id }} ({{ ds.guildCount }} guilds)
                  </option>
                </select>
              </div>
            </div>

            <!-- JSON Source -->
            <div v-if="sourceType === 'json'" class="space-y-3">
              <div 
                @click="$refs.fileInput.click()"
                @drop.prevent="handleDrop"
                @dragover.prevent
                class="border-2 border-dashed border-lime-500/30 rounded-xl p-8 text-center cursor-pointer hover:border-lime-500/50 transition-colors"
              >
                <Upload class="w-10 h-10 text-lime-500/50 mx-auto mb-3" />
                <p class="text-lime-300">Click or drag JSON file here</p>
                <p class="text-sm text-lime-400/50 mt-1">Supports v1 export format</p>
              </div>
              <input 
                ref="fileInput"
                type="file" 
                accept=".json"
                @change="handleFileSelect"
                class="hidden"
              />
            </div>
          </div>
        </div>

        <!-- Step 2: Preview & Configure -->
        <div 
          :class="[
            'bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2',
            sourceData ? 'border-lime-400/30' : 'border-lime-500/20 opacity-60'
          ]"
        >
          <div class="flex items-center gap-3 mb-4">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center font-bold',
              sourceData ? 'bg-lime-600 text-green-950' : 'bg-lime-800 text-lime-400'
            ]">2</div>
            <h2 class="text-lg font-semibold text-lime-300">Preview & Configure</h2>
          </div>

          <div v-if="!sourceData" class="text-center py-8 text-lime-300/50">
            Select source data first
          </div>

          <div v-else class="space-y-4">
            <!-- Source Summary -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="bg-green-950/50 rounded-lg p-3 text-center">
                <div class="text-2xl font-bold text-lime-200">{{ sourceData.guilds?.length || 0 }}</div>
                <div class="text-xs text-lime-400/70">Guilds</div>
              </div>
              <div class="bg-green-950/50 rounded-lg p-3 text-center">
                <div class="text-2xl font-bold text-lime-200">{{ detectedEvents.gvg }}</div>
                <div class="text-xs text-lime-400/70">GvG Events</div>
              </div>
              <div class="bg-green-950/50 rounded-lg p-3 text-center">
                <div class="text-2xl font-bold text-lime-200">{{ detectedEvents.kvk }}</div>
                <div class="text-xs text-lime-400/70">KvK Events</div>
              </div>
              <div class="bg-green-950/50 rounded-lg p-3 text-center">
                <div class="text-2xl font-bold text-lime-200">{{ sourceData.inputMode || 'daily' }}</div>
                <div class="text-xs text-lime-400/70">Input Mode</div>
              </div>
            </div>

            <!-- Migration Config -->
            <div class="space-y-3">
              <div>
                <label class="text-sm text-lime-300/80 mb-1 block">New Dataset Name</label>
                <Input
                  v-model="migrationConfig.name"
                  placeholder="e.g., Server 123 - Migrated"
                  class="bg-green-950/70 border-lime-500/40 text-lime-100"
                />
              </div>

              <div class="flex items-center gap-4">
                <label class="flex items-center gap-2 text-sm text-lime-300/80">
                  <input 
                    v-model="migrationConfig.includeGvg"
                    type="checkbox"
                    class="rounded border-lime-500"
                  >
                  Include GvG data
                </label>
                <label class="flex items-center gap-2 text-sm text-lime-300/80">
                  <input 
                    v-model="migrationConfig.includeKvk"
                    type="checkbox"
                    class="rounded border-lime-500"
                  >
                  Include KvK data
                </label>
              </div>

              <div>
                <label class="text-sm text-lime-300/80 mb-1 block">GvG Event Name</label>
                <Input
                  v-model="migrationConfig.gvgName"
                  placeholder="e.g., January GvG"
                  class="bg-green-950/70 border-lime-500/40 text-lime-100"
                />
              </div>

              <div>
                <label class="text-sm text-lime-300/80 mb-1 block">KvK Event Name</label>
                <Input
                  v-model="migrationConfig.kvkName"
                  placeholder="e.g., January KvK"
                  class="bg-green-950/70 border-lime-500/40 text-lime-100"
                />
              </div>
            </div>

            <!-- Sample Preview -->
            <div class="mt-4 pt-4 border-t border-lime-500/20">
              <h4 class="text-sm font-medium text-lime-300/80 mb-2">Sample Guild Data (first 3)</h4>
              <div class="bg-green-950/70 rounded-lg p-3 overflow-x-auto">
                <pre class="text-xs text-lime-200 font-mono">{{ JSON.stringify(sourceData.guilds?.slice(0, 3), null, 2) }}</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Migrate -->
        <div 
          :class="[
            'bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2',
            sourceData && migrationConfig.name ? 'border-lime-400/30' : 'border-lime-500/20 opacity-60'
          ]"
        >
          <div class="flex items-center gap-3 mb-4">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center font-bold',
              sourceData && migrationConfig.name ? 'bg-lime-600 text-green-950' : 'bg-lime-800 text-lime-400'
            ]">3</div>
            <h2 class="text-lg font-semibold text-lime-300">Run Migration</h2>
          </div>

          <div v-if="!sourceData || !migrationConfig.name" class="text-center py-8 text-lime-300/50">
            Configure migration options first
          </div>

          <div v-else class="space-y-4">
            <!-- Migration Preview -->
            <div class="p-4 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-200 text-sm">
              <div class="flex items-start gap-2">
                <AlertTriangle class="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="font-medium">This will create:</p>
                  <ul class="list-disc list-inside mt-1 text-amber-200/80">
                    <li>New dataset: "{{ migrationConfig.name }}"</li>
                    <li v-if="migrationConfig.includeGvg">GvG event: "{{ migrationConfig.gvgName }}"</li>
                    <li v-if="migrationConfig.includeKvk">KvK event: "{{ migrationConfig.kvkName }}"</li>
                    <li>{{ sourceData.guilds?.length || 0 }} guilds with converted data</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <Button
                @click="runMigration"
                :disabled="isMigrating"
                class="flex-1 bg-gradient-to-r from-amber-500 to-lime-500 hover:from-amber-400 hover:to-lime-400 text-green-950 font-bold py-6"
              >
                <RefreshCw v-if="isMigrating" class="w-5 h-5 mr-2 animate-spin" />
                <Wand2 v-else class="w-5 h-5 mr-2" />
                {{ isMigrating ? 'Migrating...' : 'Run Migration' }}
              </Button>
            </div>
          </div>
        </div>

        <!-- Migration Result -->
        <div 
          v-if="migrationResult"
          :class="[
            'bg-gradient-to-br backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2',
            migrationResult.success 
              ? 'from-green-900/90 to-emerald-900/90 border-green-400/50'
              : 'from-red-900/90 to-red-800/90 border-red-400/50'
          ]"
        >
          <div v-if="migrationResult.success" class="text-center">
            <CheckCircle class="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 class="text-xl font-bold text-green-200 mb-2">Migration Complete!</h2>
            <p class="text-green-300/80 mb-4">
              Successfully migrated {{ migrationResult.guildCount }} guilds to "{{ migrationResult.datasetName }}"
            </p>
            <div class="flex justify-center gap-3">
              <Button
                @click="goToDataset"
                class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold"
              >
                <ExternalLink class="w-4 h-4 mr-1" />
                Open Dataset
              </Button>
              <Button
                @click="resetMigration"
                variant="outline"
                class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20"
              >
                Migrate Another
              </Button>
            </div>
          </div>

          <div v-else class="text-center">
            <XCircle class="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 class="text-xl font-bold text-red-200 mb-2">Migration Failed</h2>
            <p class="text-red-300/80 mb-4">{{ migrationResult.error }}</p>
            <Button
              @click="resetMigration"
              variant="outline"
              class="text-red-300 border-red-400/50 hover:bg-red-500/20"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Database, FileJson, Download, Upload, RefreshCw, AlertTriangle,
  Wand2, CheckCircle, XCircle, ExternalLink, Calculator, BarChart3, ArrowRightLeft
} from 'lucide-vue-next'
import { firestore } from '@/firebase'
import { collection, doc, getDocs, getDoc, setDoc, writeBatch, serverTimestamp } from 'firebase/firestore'
import { useDatasetStore } from '@/stores/useDatasetStore'
import { createEventConfig, createEventInstance, createEmptyEventData } from '@/lib/eventTemplates'
import { generateSlug, removeUndefined } from '@/lib/datasetHelpers'

const router = useRouter()
const route = useRoute()
const store = useDatasetStore()

// State
const sourceType = ref('firestore')
const isLoadingV1 = ref(false)
const v1Datasets = ref([])
const selectedV1Dataset = ref('')
const sourceData = ref(null)
const isMigrating = ref(false)
const migrationResult = ref(null)

const migrationConfig = ref({
  name: '',
  includeGvg: true,
  includeKvk: true,
  gvgName: 'GvG',
  kvkName: 'KvK'
})

// Detected events in source data
const detectedEvents = computed(() => {
  if (!sourceData.value?.guilds) return { gvg: 0, kvk: 0 }
  
  let hasGvg = 0, hasKvk = 0
  
  sourceData.value.guilds.forEach(g => {
    if (g.gvgDays?.some(d => d.score) || g.gvgTotalScore || g.gvgSimpleResult) hasGvg = 1
    if (g.kvkPrepDays?.some(d => d.score) || g.kvkTotalScore) hasKvk = 1
  })
  
  return { gvg: hasGvg, kvk: hasKvk }
})

// Load v1 datasets from Firestore
async function loadV1Datasets() {
  isLoadingV1.value = true
  
  try {
    // Try loading from old path
    const datasetsRef = collection(firestore, 'topheroes', 'guilds', 'datasets')
    const snapshot = await getDocs(datasetsRef)
    
    v1Datasets.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // Also check for guild count
    for (const ds of v1Datasets.value) {
      const versionsRef = collection(firestore, 'topheroes', 'guilds', 'datasets', ds.id, 'versions')
      const verSnap = await getDocs(versionsRef)
      
      if (verSnap.docs.length > 0) {
        const latestVer = verSnap.docs[verSnap.docs.length - 1].data()
        ds.guildCount = latestVer.guilds?.length || 0
        ds.latestVersion = latestVer
      } else {
        ds.guildCount = 0
      }
    }
  } catch (err) {
    console.error('Error loading v1 datasets:', err)
  } finally {
    isLoadingV1.value = false
  }
}

// Watch for dataset selection
import { watch } from 'vue'

watch(selectedV1Dataset, async (datasetId) => {
  if (!datasetId) {
    sourceData.value = null
    return
  }
  
  const ds = v1Datasets.value.find(d => d.id === datasetId)
  if (ds?.latestVersion) {
    sourceData.value = {
      name: ds.name || datasetId,
      guilds: ds.latestVersion.guilds || [],
      inputMode: ds.latestVersion.inputMode || ds.inputMode || 'daily'
    }
    migrationConfig.value.name = `${ds.name || datasetId} (Migrated)`
  }
})

// Handle file drop
function handleDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file) processFile(file)
}

// Handle file select
function handleFileSelect(e) {
  const file = e.target.files[0]
  if (file) processFile(file)
}

// Process uploaded file
function processFile(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      
      // Handle different export formats
      if (data.guilds) {
        sourceData.value = data
      } else if (data.versions && data.versions.length > 0) {
        sourceData.value = {
          name: data.name,
          guilds: data.versions[data.versions.length - 1].guilds,
          inputMode: data.inputMode || 'daily'
        }
      } else if (Array.isArray(data)) {
        sourceData.value = { name: 'Imported', guilds: data, inputMode: 'daily' }
      } else {
        throw new Error('Unrecognized format')
      }
      
      migrationConfig.value.name = `${sourceData.value.name || 'Imported'} (Migrated)`
    } catch (err) {
      console.error('Error parsing JSON:', err)
      alert('Error parsing JSON file')
    }
  }
  reader.readAsText(file)
}

// Run migration
async function runMigration() {
  if (!sourceData.value || !migrationConfig.value.name) return
  
  isMigrating.value = true
  migrationResult.value = null
  
  try {
    const datasetId = generateSlug(migrationConfig.value.name) || `migrated-${Date.now()}`
    
    // Build event configs
    const eventConfigs = []
    
    if (migrationConfig.value.includeGvg) {
      const gvgConfig = createEventConfig('gvg', {
        inputMode: sourceData.value.inputMode || 'daily'
      })
      const gvgInstance = createEventInstance(gvgConfig, {
        name: migrationConfig.value.gvgName
      })
      gvgConfig.instances = [gvgInstance]
      eventConfigs.push(gvgConfig)
    }
    
    if (migrationConfig.value.includeKvk) {
      const kvkConfig = createEventConfig('kvk', {
        inputMode: sourceData.value.inputMode || 'daily'
      })
      const kvkInstance = createEventInstance(kvkConfig, {
        name: migrationConfig.value.kvkName
      })
      kvkConfig.instances = [kvkInstance]
      eventConfigs.push(kvkConfig)
    }
    
    // Convert guilds
    const convertedGuilds = sourceData.value.guilds.map(oldGuild => {
      const newGuild = {
        id: oldGuild.id || oldGuild.shorthand?.toLowerCase().replace(/[^a-z0-9]/g, ''),
        name: oldGuild.name || '',
        shorthand: oldGuild.shorthand || '',
        power: oldGuild.guildPower || oldGuild.power || null,
        events: {}
      }
      
      // Convert GvG data
      if (migrationConfig.value.includeGvg && eventConfigs[0]?.instances[0]) {
        const gvgInstanceId = eventConfigs[0].instances[0].id
        const inputMode = eventConfigs[0].inputMode
        
        if (inputMode === 'daily' && oldGuild.gvgDays) {
          const eventData = {
            days: oldGuild.gvgDays.map(d => ({
              // Check multiple possible field names for score
              score: d.score ?? d.points ?? d.dailyScore ?? d.value ?? null,
              won: d.won ?? d.win ?? d.isWin ?? d.result === 'won' ?? null
            }))
          }
          // Also include totalScore as fallback if days don't have scores
          if (oldGuild.gvgTotalScore) {
            eventData.totalScore = oldGuild.gvgTotalScore
          }
          // Include opponent if available - check multiple field names
          if (oldGuild.gvgOpponent || oldGuild.opponent) {
            eventData.opponent = oldGuild.gvgOpponent || oldGuild.opponent
          }
          newGuild.events[gvgInstanceId] = eventData
        } else if (inputMode === 'total') {
          newGuild.events[gvgInstanceId] = {
            totalScore: oldGuild.gvgTotalScore ?? null,
            result: oldGuild.gvgSimpleResult === 'won' ? 'won' : 
                    oldGuild.gvgSimpleResult === 'lost' ? 'lost' : null
          }
        } else if (inputMode === 'simple') {
          newGuild.events[gvgInstanceId] = {
            result: oldGuild.gvgSimpleResult === 'won' ? 'won' : 
                    oldGuild.gvgSimpleResult === 'lost' ? 'lost' : null,
            score: oldGuild.gvgTotalScore ?? null
          }
        }
      }
      
      // Convert KvK data
      const kvkConfigIndex = migrationConfig.value.includeGvg ? 1 : 0
      if (migrationConfig.value.includeKvk && eventConfigs[kvkConfigIndex]?.instances[0]) {
        const kvkInstanceId = eventConfigs[kvkConfigIndex].instances[0].id
        const inputMode = eventConfigs[kvkConfigIndex].inputMode
        
        if (inputMode === 'daily' && oldGuild.kvkPrepDays) {
          const eventData = {
            days: oldGuild.kvkPrepDays.map(d => ({
              // Check multiple possible field names for score
              score: d.score ?? d.points ?? d.dailyScore ?? d.value ?? null,
              won: d.won ?? d.win ?? d.isWin ?? null,
              rank: d.rank ?? null
            }))
          }
          // Also include totalScore as fallback
          if (oldGuild.kvkTotalScore) {
            eventData.totalScore = oldGuild.kvkTotalScore
          }
          newGuild.events[kvkInstanceId] = eventData
        } else if (inputMode === 'total') {
          newGuild.events[kvkInstanceId] = {
            totalScore: oldGuild.kvkTotalScore ?? null
          }
        }
      }
      
      return newGuild
    }).filter(g => g.shorthand) // Remove empty guilds
    
    // Save to Firestore
    const batch = writeBatch(firestore)
    
    // Clean all data before saving
    const cleanedEventConfigs = removeUndefined(eventConfigs)
    const cleanedGuilds = removeUndefined(convertedGuilds)
    
    // Create dataset document
    const datasetRef = doc(firestore, 'topheroes', 'guilds-v2', 'datasets', datasetId)
    batch.set(datasetRef, {
      id: datasetId,
      name: migrationConfig.value.name,
      status: 'active',
      eventConfigs: cleanedEventConfigs,
      metadata: {
        description: `Migrated from v1 on ${new Date().toLocaleDateString()}`,
        migratedFrom: selectedV1Dataset.value || 'json-import'
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      latestVersionId: 'v1-migrated',
      versionCount: 1
    })
    
    // Create version document
    const versionRef = doc(firestore, 'topheroes', 'guilds-v2', 'datasets', datasetId, 'versions', 'v1-migrated')
    batch.set(versionRef, {
      guilds: cleanedGuilds,
      stats: {
        guildCount: convertedGuilds.length
      },
      createdAt: new Date().toISOString(),
      changeLog: 'Initial migration from v1'
    })
    
    await batch.commit()
    
    migrationResult.value = {
      success: true,
      datasetId,
      datasetName: migrationConfig.value.name,
      guildCount: convertedGuilds.length
    }
    
  } catch (err) {
    console.error('Migration error:', err)
    migrationResult.value = {
      success: false,
      error: err.message
    }
  } finally {
    isMigrating.value = false
  }
}

// Go to migrated dataset
function goToDataset() {
  if (migrationResult.value?.datasetId) {
    router.push({
      path: '/topheroes/tools/rankings',
      query: { dataset: migrationResult.value.datasetId }
    })
  }
}

// Reset for another migration
function resetMigration() {
  sourceData.value = null
  selectedV1Dataset.value = ''
  migrationResult.value = null
  migrationConfig.value = {
    name: '',
    includeGvg: true,
    includeKvk: true,
    gvgName: 'GvG',
    kvkName: 'KvK'
  }
}
</script>
