<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 p-3 py-0 sm:p-6 md:py-16">
    <div class="max-w-[1920px] mx-auto">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-8">
        <h1
          class="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">
          Dataset Builder
        </h1>
        <p class="text-lime-200/80 text-sm sm:text-lg">Create and manage guild event datasets</p>
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

      <!-- Main Layout -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        <!-- Left Sidebar - Dataset Selection & Config -->
        <div class="xl:col-span-3">
          <div class="sticky top-4 space-y-4">
            <!-- Dataset List -->
            <div class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30">
              <DatasetList 
                @select="selectDataset" 
                @edit="openDatasetConfig"
              />
            </div>

            <!-- Event Configuration (when dataset selected) -->
            <div 
              v-if="store.hasDataset"
              class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30"
            >
              <EventConfigPanel />
            </div>
          </div>
        </div>

        <!-- Main Content - Data Entry -->
        <div class="xl:col-span-9">
          <!-- No Dataset Selected -->
          <div 
            v-if="!store.hasDataset"
            class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-8 sm:p-12 shadow-2xl border-2 border-lime-400/30 text-center"
          >
            <Database class="w-16 h-16 text-lime-500/50 mx-auto mb-4" />
            <h2 class="text-xl font-bold text-lime-300 mb-2">Select or Create a Dataset</h2>
            <p class="text-lime-300/60 mb-6">Choose a dataset from the sidebar or create a new one to start entering guild data.</p>
          </div>

          <!-- Dataset Selected -->
          <div v-else class="space-y-4">
            <!-- Dataset Header Bar -->
            <div class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30">
              <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <!-- Dataset Info -->
                <div class="flex items-center gap-3">
                  <Database class="w-6 h-6 text-lime-400" />
                  <div>
                    <h2 class="text-xl font-bold text-lime-200">{{ store.currentDataset?.name }}</h2>
                    <div class="flex items-center gap-3 text-sm text-lime-300/60">
                      <Badge :class="getStatusClass(store.currentDataset?.status)">
                        {{ store.currentDataset?.status }}
                      </Badge>
                      <span v-if="store.currentVersionId">Version: {{ store.currentVersionId }}</span>
                      <span v-if="store.isDirty" class="text-amber-400 flex items-center gap-1">
                        <AlertCircle class="w-3 h-3" />
                        Unsaved changes
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-wrap gap-2">
                  <Button 
                    @click="loadLatestVersion" 
                    :disabled="store.isLoading || !store.currentDataset?.latestVersionId"
                    size="sm"
                    variant="outline"
                    class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20"
                  >
                    <Download class="w-4 h-4 mr-1" />
                    Load Latest
                  </Button>
                  
                  <Button 
                    @click="saveVersion" 
                    :disabled="store.isSaving || !store.isDirty"
                    size="sm"
                    class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold"
                  >
                    <Save class="w-4 h-4 mr-1" />
                    {{ store.isSaving ? 'Saving...' : 'Save Version' }}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        size="sm"
                        variant="outline"
                        class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20"
                      >
                        <MoreVertical class="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="bg-green-800 border-lime-500 text-lime-100">
                      <DropdownMenuItem @click="exportJSON" class="hover:bg-green-700 cursor-pointer">
                        <FileDown class="w-4 h-4 mr-2" />
                        Export JSON
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="triggerImport" class="hover:bg-green-700 cursor-pointer">
                        <FileUp class="w-4 h-4 mr-2" />
                        Import JSON
                      </DropdownMenuItem>
                      <DropdownMenuSeparator class="bg-lime-500/30" />
                      <DropdownMenuItem @click="navigateToRankings" class="hover:bg-green-700 cursor-pointer">
                        <Trophy class="w-4 h-4 mr-2" />
                        Calculate Rankings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <!-- Stats Bar -->
              <div v-if="store.stats" class="mt-4 pt-4 border-t border-lime-500/20">
                <div class="flex flex-wrap gap-4 text-sm">
                  <div class="flex items-center gap-1">
                    <Users class="w-4 h-4 text-lime-400" />
                    <span class="text-lime-200">{{ store.stats.guildCount }} guilds</span>
                  </div>
                  <div v-if="store.stats.avgPower > 0" class="flex items-center gap-1">
                    <Zap class="w-4 h-4 text-yellow-400" />
                    <span class="text-lime-200">Avg Power: {{ formatNumber(store.stats.avgPower) }}</span>
                  </div>
                  <div 
                    v-for="(eventStat, instanceId) in store.stats.eventStats" 
                    :key="instanceId"
                    class="flex items-center gap-1"
                  >
                    <Sword class="w-4 h-4 text-lime-400" />
                    <span class="text-lime-200">
                      {{ eventStat.instanceName }}: {{ eventStat.guildsWithData }} with data
                    </span>
                  </div>
                </div>
              </div>

              <!-- Validation Errors -->
              <div v-if="store.validation.errors.length > 0" class="mt-4">
                <div class="p-3 rounded-lg bg-red-500/20 border border-red-400/50">
                  <div class="flex items-center gap-2 text-red-300 font-medium mb-2">
                    <AlertCircle class="w-4 h-4" />
                    Validation Errors ({{ store.validation.errors.length }})
                  </div>
                  <ul class="text-sm text-red-200 space-y-1 max-h-24 overflow-y-auto">
                    <li v-for="(err, idx) in store.validation.errors.slice(0, 5)" :key="idx">
                      {{ err }}
                    </li>
                    <li v-if="store.validation.errors.length > 5" class="text-red-300/70">
                      ...and {{ store.validation.errors.length - 5 }} more
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Warnings -->
              <div v-if="store.validation.warnings.length > 0 && store.validation.errors.length === 0" class="mt-4">
                <div class="p-3 rounded-lg bg-amber-500/20 border border-amber-400/50">
                  <div class="flex items-center gap-2 text-amber-300 font-medium text-sm">
                    <AlertTriangle class="w-4 h-4" />
                    {{ store.validation.warnings.length }} warnings
                    <span class="text-amber-300/60 font-normal">
                      ({{ store.validation.warnings.slice(0, 2).join(', ') }}{{ store.validation.warnings.length > 2 ? '...' : '' }})
                    </span>
                  </div>
                </div>
              </div>

              <!-- Status Message -->
              <div v-if="statusMessage" :class="[
                'mt-4 p-3 rounded-lg border flex items-center gap-2 text-sm',
                statusType === 'error' ? 'bg-red-500/20 border-red-400 text-red-200' :
                statusType === 'success' ? 'bg-lime-500/20 border-lime-400 text-lime-200' :
                'bg-blue-500/20 border-blue-400 text-blue-200'
              ]">
                <AlertCircle v-if="statusType === 'error'" class="w-4 h-4 flex-shrink-0" />
                <CheckCircle v-if="statusType === 'success'" class="w-4 h-4 flex-shrink-0" />
                <span>{{ statusMessage }}</span>
              </div>
            </div>

            <!-- Guild Table -->
            <div class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30">
              <GuildTable />
            </div>
          </div>
        </div>
      </div>

      <!-- Hidden file input for import -->
      <input 
        ref="fileInput" 
        type="file" 
        accept=".json" 
        @change="importJSON" 
        class="hidden" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Database, Save, Download, FileDown, FileUp, MoreVertical,
  Users, Zap, Sword, Trophy, AlertCircle, AlertTriangle, CheckCircle,
  Calculator, BarChart3, ArrowRightLeft
} from 'lucide-vue-next'
import { useDatasetStore } from '@/stores/useDatasetStore'
import { formatNumber } from '@/lib/datasetHelpers'
import DatasetList from '@/components/topheroes/datasets/DatasetList.vue'
import EventConfigPanel from '@/components/topheroes/datasets/EventConfigPanel.vue'
import GuildTable from '@/components/topheroes/entry/GuildTable.vue'

const router = useRouter()
const route = useRoute()
const store = useDatasetStore()

// Refs
const fileInput = ref(null)
const statusMessage = ref('')
const statusType = ref('info')

// Status message helper
function showStatus(type, message, duration = 5000) {
  statusType.value = type
  statusMessage.value = message
  if (duration > 0) {
    setTimeout(() => {
      statusMessage.value = ''
    }, duration)
  }
}

// Get status class
function getStatusClass(status) {
  switch (status) {
    case 'active':
      return 'bg-lime-600/20 border-lime-500 text-lime-300'
    case 'archived':
      return 'bg-gray-600/20 border-gray-500 text-gray-300'
    default:
      return 'bg-amber-600/20 border-amber-500 text-amber-300'
  }
}

// Select dataset
async function selectDataset(dataset) {
  try {
    await store.loadDataset(dataset.id)
    
    // Check for local draft
    const draft = store.loadDraft()
    if (draft) {
      showStatus('info', 'Loaded unsaved draft from local storage')
    } else if (store.currentDataset.latestVersionId) {
      // Load latest version
      await store.loadVersion(dataset.id)
    } else {
      // New dataset, start with empty guilds
      store.addGuild()
      store.addGuild()
      store.addGuild()
    }
  } catch (err) {
    showStatus('error', `Error loading dataset: ${err.message}`)
  }
}

// Open dataset config (for edit button)
function openDatasetConfig(dataset) {
  // Could open a modal or navigate to config page
  selectDataset(dataset)
}

// Load latest version
async function loadLatestVersion() {
  if (!store.currentDataset?.latestVersionId) return
  
  try {
    await store.loadVersion(store.currentDataset.id)
    showStatus('success', 'Loaded latest version')
  } catch (err) {
    showStatus('error', `Error loading version: ${err.message}`)
  }
}

// Save version
async function saveVersion() {
  if (!store.currentDataset) return
  
  try {
    const result = await store.saveVersion()
    store.clearDraft()
    showStatus('success', `Saved version ${result.versionId}`)
  } catch (err) {
    showStatus('error', `Error saving: ${err.message}`)
  }
}

// Export JSON
function exportJSON() {
  const data = store.exportJSON()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${store.currentDataset?.name || 'dataset'}-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  showStatus('success', 'Exported JSON')
}

// Trigger import
function triggerImport() {
  fileInput.value?.click()
}

// Import JSON
function importJSON(event) {
  const file = event.target.files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      store.importJSON(data)
      showStatus('success', `Imported ${store.guilds.length} guilds`)
    } catch (err) {
      showStatus('error', `Error importing: ${err.message}`)
    }
  }
  reader.readAsText(file)
  
  // Reset input
  event.target.value = ''
}

// Navigate to rankings
function navigateToRankings() {
  if (!store.currentDataset?.id) return
  router.push({
    path: '/topheroes/tools/rankings/weights',
    query: { dataset: store.currentDataset.id }
  })
}

// Auto-save draft on changes
watch(() => store.guilds, () => {
  if (store.isDirty) {
    store.saveDraft()
  }
}, { deep: true })

// Load initial data
onMounted(async () => {
  await store.loadDatasets()
  
  // Check for dataset in query params
  const datasetId = route.query.dataset
  if (datasetId) {
    const dataset = store.datasets.find(d => d.id === datasetId)
    if (dataset) {
      await selectDataset(dataset)
    }
  }
})
</script>
