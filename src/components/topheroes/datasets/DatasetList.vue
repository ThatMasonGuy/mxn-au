<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Database class="w-5 h-5 text-lime-400" />
        <h2 class="text-lg font-bold text-lime-300">Datasets</h2>
      </div>
      <Button 
        @click="showCreateModal = true" 
        size="sm"
        class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold"
      >
        <Plus class="w-4 h-4 mr-1" />
        New Dataset
      </Button>
    </div>

    <!-- Loading State -->
    <div v-if="store.isLoading" class="flex items-center justify-center py-8">
      <RefreshCw class="w-6 h-6 text-lime-400 animate-spin" />
      <span class="ml-2 text-lime-300">Loading datasets...</span>
    </div>

    <!-- Empty State -->
    <div 
      v-else-if="store.datasets.length === 0" 
      class="text-center py-12 bg-green-950/30 rounded-xl border-2 border-dashed border-lime-500/30"
    >
      <Database class="w-12 h-12 text-lime-500/50 mx-auto mb-3" />
      <p class="text-lime-300/70 mb-4">No datasets yet</p>
      <Button 
        @click="showCreateModal = true"
        class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold"
      >
        <Plus class="w-4 h-4 mr-1" />
        Create Your First Dataset
      </Button>
    </div>

    <!-- Dataset List -->
    <div v-else class="space-y-2">
      <div
        v-for="dataset in store.datasets"
        :key="dataset.id"
        @click="selectDataset(dataset)"
        :class="[
          'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
          store.currentDataset?.id === dataset.id
            ? 'bg-lime-600/20 border-lime-400'
            : 'bg-green-950/50 border-lime-500/30 hover:border-lime-500/50 hover:bg-green-950/70'
        ]"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-semibold text-lime-200 truncate">{{ dataset.name }}</h3>
              <Badge :class="getStatusClass(dataset.status)">
                {{ dataset.status }}
              </Badge>
            </div>
            
            <div class="flex flex-wrap gap-3 text-xs text-lime-300/60">
              <span v-if="dataset.versionCount" class="flex items-center gap-1">
                <History class="w-3 h-3" />
                {{ dataset.versionCount }} {{ dataset.versionCount === 1 ? 'version' : 'versions' }}
              </span>
              <span class="flex items-center gap-1">
                <Calendar class="w-3 h-3" />
                {{ formatDate(dataset.updatedAt) }}
              </span>
              <span v-if="getEventSummary(dataset)" class="flex items-center gap-1">
                <Sword class="w-3 h-3" />
                {{ getEventSummary(dataset) }}
              </span>
            </div>
          </div>
          
          <div class="flex items-center gap-2 ml-4">
            <Button
              @click.stop="editDataset(dataset)"
              size="sm"
              variant="ghost"
              class="text-lime-400 hover:bg-lime-500/20"
            >
              <Settings class="w-4 h-4" />
            </Button>
            <Button
              @click.stop="confirmDelete(dataset)"
              size="sm"
              variant="ghost"
              class="text-red-400 hover:bg-red-500/20"
            >
              <Trash2 class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Dataset Modal -->
    <Dialog v-model:open="showCreateModal">
      <DialogContent class="bg-gradient-to-br from-green-900/95 to-emerald-900/95 border-2 border-lime-400/30 text-lime-100">
        <DialogHeader>
          <DialogTitle class="text-xl font-bold text-lime-300 flex items-center gap-2">
            <Plus class="w-5 h-5" />
            Create New Dataset
          </DialogTitle>
          <DialogDescription class="text-lime-200/70">
            Give your dataset a name. You can configure events after creation.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 mt-4">
          <div>
            <label class="text-sm text-lime-300/80 mb-1 block">Dataset Name</label>
            <Input
              v-model="newDatasetName"
              placeholder="e.g., Server 123 - January 2025"
              class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400"
              @keydown.enter="createDataset"
            />
          </div>

          <div>
            <label class="text-sm text-lime-300/80 mb-1 block">Description (optional)</label>
            <Input
              v-model="newDatasetDescription"
              placeholder="What is this dataset tracking?"
              class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400"
            />
          </div>

          <!-- Quick Start Templates -->
          <div>
            <label class="text-sm text-lime-300/80 mb-2 block">Quick Start (optional)</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="selectQuickStart('gvg')"
                :class="[
                  'p-3 rounded-lg border text-left transition-all',
                  quickStartTemplate === 'gvg'
                    ? 'bg-lime-600/20 border-lime-400'
                    : 'bg-green-950/50 border-lime-500/30 hover:border-lime-500/50'
                ]"
              >
                <Sword class="w-4 h-4 text-lime-400 mb-1" />
                <div class="text-sm font-medium text-lime-200">GvG Only</div>
                <div class="text-xs text-lime-300/60">Standard guild battles</div>
              </button>
              
              <button
                @click="selectQuickStart('kvk')"
                :class="[
                  'p-3 rounded-lg border text-left transition-all',
                  quickStartTemplate === 'kvk'
                    ? 'bg-lime-600/20 border-lime-400'
                    : 'bg-green-950/50 border-lime-500/30 hover:border-lime-500/50'
                ]"
              >
                <Globe class="w-4 h-4 text-purple-400 mb-1" />
                <div class="text-sm font-medium text-lime-200">KvK Only</div>
                <div class="text-xs text-lime-300/60">Kingdom battles</div>
              </button>
              
              <button
                @click="selectQuickStart('both')"
                :class="[
                  'p-3 rounded-lg border text-left transition-all',
                  quickStartTemplate === 'both'
                    ? 'bg-lime-600/20 border-lime-400'
                    : 'bg-green-950/50 border-lime-500/30 hover:border-lime-500/50'
                ]"
              >
                <Zap class="w-4 h-4 text-yellow-400 mb-1" />
                <div class="text-sm font-medium text-lime-200">GvG + KvK</div>
                <div class="text-xs text-lime-300/60">Both event types</div>
              </button>
              
              <button
                @click="selectQuickStart(null)"
                :class="[
                  'p-3 rounded-lg border text-left transition-all',
                  quickStartTemplate === null
                    ? 'bg-lime-600/20 border-lime-400'
                    : 'bg-green-950/50 border-lime-500/30 hover:border-lime-500/50'
                ]"
              >
                <Settings class="w-4 h-4 text-gray-400 mb-1" />
                <div class="text-sm font-medium text-lime-200">Empty</div>
                <div class="text-xs text-lime-300/60">Configure manually</div>
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <Button
            @click="showCreateModal = false"
            variant="outline"
            class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20"
          >
            Cancel
          </Button>
          <Button
            @click="createDataset"
            :disabled="!newDatasetName.trim() || isCreating"
            class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold"
          >
            <Plus class="w-4 h-4 mr-1" />
            {{ isCreating ? 'Creating...' : 'Create Dataset' }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Modal -->
    <Dialog v-model:open="showDeleteModal">
      <DialogContent class="bg-gradient-to-br from-red-900/95 to-red-800/95 border-2 border-red-400/30 text-red-100">
        <DialogHeader>
          <DialogTitle class="text-xl font-bold text-red-300 flex items-center gap-2">
            <Trash2 class="w-5 h-5" />
            Delete Dataset
          </DialogTitle>
          <DialogDescription class="text-red-200/70">
            Are you sure you want to delete "{{ datasetToDelete?.name }}"? This will delete all versions and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div class="flex justify-end gap-2 mt-6">
          <Button
            @click="showDeleteModal = false"
            variant="outline"
            class="text-red-200 border-red-400/50 hover:bg-red-500/20"
          >
            Cancel
          </Button>
          <Button
            @click="performDelete"
            :disabled="isDeleting"
            class="bg-red-600 hover:bg-red-500 text-white font-semibold"
          >
            <Trash2 class="w-4 h-4 mr-1" />
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Database, Plus, RefreshCw, Calendar, History, Sword, Globe, Settings, Trash2, Zap } from 'lucide-vue-next'
import { useDatasetStore } from '@/stores/useDatasetStore'
import { createEventConfig, createEventInstance } from '@/lib/eventTemplates'

const emit = defineEmits(['select', 'edit'])

const store = useDatasetStore()

// Create modal state
const showCreateModal = ref(false)
const newDatasetName = ref('')
const newDatasetDescription = ref('')
const quickStartTemplate = ref(null)
const isCreating = ref(false)

// Delete modal state
const showDeleteModal = ref(false)
const datasetToDelete = ref(null)
const isDeleting = ref(false)

// Load datasets on mount
onMounted(async () => {
  await store.loadDatasets()
})

// Select quick start template
function selectQuickStart(template) {
  quickStartTemplate.value = template
}

// Create new dataset
async function createDataset() {
  if (!newDatasetName.value.trim()) return
  
  isCreating.value = true
  
  try {
    // Build initial event configs based on quick start
    let eventConfigs = []
    
    if (quickStartTemplate.value === 'gvg' || quickStartTemplate.value === 'both') {
      const gvgConfig = createEventConfig('gvg')
      eventConfigs.push(gvgConfig)
    }
    
    if (quickStartTemplate.value === 'kvk' || quickStartTemplate.value === 'both') {
      const kvkConfig = createEventConfig('kvk')
      eventConfigs.push(kvkConfig)
    }
    
    const dataset = await store.createDataset(newDatasetName.value.trim(), {
      description: newDatasetDescription.value.trim(),
      eventConfigs
    })
    
    // Reset form
    newDatasetName.value = ''
    newDatasetDescription.value = ''
    quickStartTemplate.value = null
    showCreateModal.value = false
    
    // Select the new dataset
    selectDataset(dataset)
  } catch (err) {
    console.error('Error creating dataset:', err)
  } finally {
    isCreating.value = false
  }
}

// Select a dataset
function selectDataset(dataset) {
  emit('select', dataset)
}

// Edit dataset configuration
function editDataset(dataset) {
  emit('edit', dataset)
}

// Confirm delete
function confirmDelete(dataset) {
  datasetToDelete.value = dataset
  showDeleteModal.value = true
}

// Perform delete
async function performDelete() {
  if (!datasetToDelete.value) return
  
  isDeleting.value = true
  
  try {
    await store.deleteDataset(datasetToDelete.value.id)
    showDeleteModal.value = false
    datasetToDelete.value = null
  } catch (err) {
    console.error('Error deleting dataset:', err)
  } finally {
    isDeleting.value = false
  }
}

// Get status badge class
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

// Get event summary
function getEventSummary(dataset) {
  if (!dataset.eventConfigs || dataset.eventConfigs.length === 0) return null
  
  const gvgCount = dataset.eventConfigs
    .filter(ec => ec.template?.category === 'gvg' && ec.enabled)
    .reduce((sum, ec) => sum + (ec.instances?.length || 0), 0)
  
  const kvkCount = dataset.eventConfigs
    .filter(ec => ec.template?.category === 'kvk' && ec.enabled)
    .reduce((sum, ec) => sum + (ec.instances?.length || 0), 0)
  
  const parts = []
  if (gvgCount > 0) parts.push(`${gvgCount} GvG`)
  if (kvkCount > 0) parts.push(`${kvkCount} KvK`)
  
  return parts.join(', ')
}

// Format date
function formatDate(dateString) {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
</script>
