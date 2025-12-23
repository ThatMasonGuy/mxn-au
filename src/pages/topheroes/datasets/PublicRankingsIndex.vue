<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 p-3 py-0 sm:p-6 md:py-16">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-3 mb-2">
          <Trophy class="w-12 h-12 text-yellow-400" />
          <h1 class="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-lime-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
            Published Rankings
          </h1>
        </div>
        <p class="text-lime-200/80 text-sm sm:text-lg">Browse datasets and select versions to view</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <RefreshCw class="w-8 h-8 text-lime-400 animate-spin" />
        <span class="ml-3 text-lime-300 text-lg">Loading datasets...</span>
      </div>

      <!-- Error State -->
      <div 
        v-else-if="error"
        class="bg-gradient-to-br from-red-900/90 to-red-800/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border-2 border-red-400/30 text-center"
      >
        <AlertCircle class="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-red-200 mb-2">Unable to Load Datasets</h2>
        <p class="text-red-300/70">{{ error }}</p>
      </div>

      <!-- Search & Filters -->
      <div v-else class="mb-6 space-y-4">
        <div class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border-2 border-lime-400/30">
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search Input -->
            <div class="flex-1 relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-lime-400/60" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by dataset name..."
                class="w-full pl-10 pr-4 py-2.5 bg-green-950/60 border-2 border-lime-500/30 rounded-lg text-lime-200 placeholder-lime-400/40 focus:outline-none focus:border-lime-400/60 transition-colors"
              />
            </div>
            
            <!-- Sort Dropdown -->
            <select
              v-model="sortBy"
              class="px-4 py-2.5 bg-green-950/60 border-2 border-lime-500/30 rounded-lg text-lime-200 focus:outline-none focus:border-lime-400/60 transition-colors"
            >
              <option value="updated">Recently Updated</option>
              <option value="name">Name (A-Z)</option>
              <option value="versions">Most Versions</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
          
          <!-- Results Count -->
          <div class="mt-3 text-sm text-lime-300/60 text-center">
            Showing {{ filteredDatasets.length }} of {{ datasetsWithPublished.length }} dataset{{ datasetsWithPublished.length !== 1 ? 's' : '' }} with published rankings
          </div>
        </div>

        <!-- Datasets Grid -->
        <div v-if="filteredDatasets.length === 0" class="text-center py-12">
          <Search class="w-16 h-16 text-lime-400/30 mx-auto mb-4" />
          <p class="text-lime-300/60 text-lg">No datasets found</p>
          <p class="text-lime-400/40 text-sm mt-1">Try adjusting your search terms</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="dataset in filteredDatasets"
            :key="dataset.id"
            class="group bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-5 shadow-2xl border-2 border-lime-400/30 hover:border-lime-400/60 hover:shadow-lime-400/20 transition-all duration-300"
          >
            <!-- Clickable Header Area - Opens Latest Version -->
            <div 
              @click="openLatestVersion(dataset)"
              class="cursor-pointer hover:-translate-y-1 transition-transform duration-300"
            >
              <!-- Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1 min-w-0">
                  <h3 class="text-xl font-bold text-lime-200 group-hover:text-lime-100 transition-colors truncate">
                    {{ dataset.name }}
                  </h3>
                  <p v-if="dataset.metadata?.description" class="text-sm text-lime-300/60 mt-1 line-clamp-2">
                    {{ dataset.metadata.description }}
                  </p>
                </div>
                <ExternalLink class="w-5 h-5 text-lime-400/40 group-hover:text-lime-400 transition-colors flex-shrink-0 ml-2" />
              </div>

              <!-- Stats Row -->
              <div class="grid grid-cols-3 gap-3 mb-3">
                <!-- Published Versions -->
                <div class="bg-green-950/50 rounded-lg p-2.5 border border-lime-500/20">
                  <div class="flex items-center gap-1.5 mb-1">
                    <Layers class="w-4 h-4 text-lime-400/60" />
                    <span class="text-xs text-lime-400/60">Versions</span>
                  </div>
                  <div class="text-lg font-bold text-lime-200">
                    {{ dataset.publishedVersions.length }}
                  </div>
                </div>

                <!-- Total Views -->
                <div class="bg-green-950/50 rounded-lg p-2.5 border border-lime-500/20">
                  <div class="flex items-center gap-1.5 mb-1">
                    <Eye class="w-4 h-4 text-lime-400/60" />
                    <span class="text-xs text-lime-400/60">Views</span>
                  </div>
                  <div class="text-lg font-bold text-lime-200">
                    {{ formatNumber(dataset.totalViews) }}
                  </div>
                </div>

                <!-- Events -->
                <div class="bg-green-950/50 rounded-lg p-2.5 border border-lime-500/20">
                  <div class="flex items-center gap-1.5 mb-1">
                    <Calendar class="w-4 h-4 text-lime-400/60" />
                    <span class="text-xs text-lime-400/60">Events</span>
                  </div>
                  <div class="text-lg font-bold text-lime-200">
                    {{ dataset.eventConfigs?.filter(ec => ec.enabled).length || 0 }}
                  </div>
                </div>
              </div>

              <!-- Event Tags -->
              <div v-if="dataset.eventConfigs && dataset.eventConfigs.length > 0" class="flex flex-wrap gap-1.5 mb-3">
                <span
                  v-for="config in dataset.eventConfigs.filter(ec => ec.enabled).slice(0, 3)"
                  :key="config.templateId"
                  class="px-2 py-1 rounded-md text-xs font-medium"
                  :class="getEventBadgeClass(config.template?.category)"
                >
                  {{ config.template?.name }}
                </span>
                <span
                  v-if="dataset.eventConfigs.filter(ec => ec.enabled).length > 3"
                  class="px-2 py-1 rounded-md text-xs font-medium bg-lime-500/20 text-lime-300 border border-lime-500/30"
                >
                  +{{ dataset.eventConfigs.filter(ec => ec.enabled).length - 3 }} more
                </span>
              </div>

              <!-- Latest Version Info -->
              <div class="flex items-center gap-2 text-xs text-lime-300/60 pt-3 border-t border-lime-500/20">
                <Clock class="w-3.5 h-3.5" />
                <span>Latest: {{ formatDate(dataset.latestPublish.publishedAt) }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-lime-500/20">
              <button
                @click="openLatestVersion(dataset)"
                class="flex items-center justify-center gap-2 px-4 py-2.5 bg-lime-600/30 hover:bg-lime-600/40 border border-lime-500/40 rounded-lg text-lime-200 font-medium transition-colors"
              >
                <ExternalLink class="w-4 h-4" />
                <span>View Latest</span>
              </button>
              <button
                @click.stop="openVersionModal(dataset)"
                class="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/40 rounded-lg text-blue-200 font-medium transition-colors"
              >
                <Layers class="w-4 h-4" />
                <span>All Versions</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Version Selection Modal -->
    <Teleport to="body">
      <div
        v-if="showVersionModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="closeVersionModal"
      >
        <div class="bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl shadow-2xl border-2 border-lime-400/40 max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <!-- Modal Header -->
          <div class="p-6 border-b border-lime-500/30">
            <div class="flex items-start justify-between">
              <div>
                <h2 class="text-2xl font-bold text-lime-200">{{ selectedDataset?.name }}</h2>
                <p class="text-sm text-lime-300/60 mt-1">Select a version to view</p>
              </div>
              <button
                @click="closeVersionModal"
                class="p-2 hover:bg-lime-500/20 rounded-lg transition-colors"
              >
                <X class="w-6 h-6 text-lime-400" />
              </button>
            </div>
          </div>

          <!-- Versions List -->
          <div class="p-6 overflow-y-auto max-h-[calc(80vh-140px)] custom-scrollbar">
            <div v-if="selectedDataset?.publishedVersions.length === 0" class="text-center py-8">
              <AlertCircle class="w-12 h-12 text-lime-400/30 mx-auto mb-3" />
              <p class="text-lime-300/60">No published versions found</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(version, index) in selectedDataset.publishedVersions"
                :key="version.publishId"
                @click="navigateToVersion(version.publishId)"
                class="group bg-green-950/50 hover:bg-green-950/70 border-2 border-lime-500/20 hover:border-lime-400/40 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg hover:shadow-lime-400/10"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span
                        v-if="index === 0"
                        class="px-2 py-0.5 rounded-md text-xs font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                      >
                        LATEST
                      </span>
                      <span class="text-sm font-mono text-lime-400/80">
                        Version {{ selectedDataset.publishedVersions.length - index }}
                      </span>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-3 mb-2">
                      <div class="text-sm">
                        <div class="text-lime-400/60 text-xs mb-0.5">Guilds</div>
                        <div class="font-bold text-lime-200">{{ version.rankings?.length || 0 }}</div>
                      </div>
                      <div class="text-sm">
                        <div class="text-lime-400/60 text-xs mb-0.5">Views</div>
                        <div class="font-bold text-lime-200">{{ formatNumber(version.viewCount || 0) }}</div>
                      </div>
                      <div class="text-sm">
                        <div class="text-lime-400/60 text-xs mb-0.5">Events</div>
                        <div class="font-bold text-lime-200">{{ version.events?.length || 0 }}</div>
                      </div>
                    </div>

                    <div class="flex items-center gap-1 text-xs text-lime-300/60">
                      <Clock class="w-3.5 h-3.5" />
                      <span>Published {{ formatDate(version.publishedAt) }}</span>
                    </div>
                  </div>

                  <ChevronRight class="w-5 h-5 text-lime-400/40 group-hover:text-lime-400 transition-colors flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { firestore } from '@/firebase'
import { collection, getDocs, query, orderBy as firestoreOrderBy, where } from 'firebase/firestore'
import { 
  Trophy, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  Eye, 
  Calendar, 
  Clock,
  ExternalLink,
  ChevronRight,
  Layers,
  X
} from 'lucide-vue-next'

const router = useRouter()

// State
const isLoading = ref(true)
const error = ref(null)
const allDatasets = ref([])
const allPublished = ref([])
const searchQuery = ref('')
const sortBy = ref('updated')
const showVersionModal = ref(false)
const selectedDataset = ref(null)

// Load datasets and published rankings
onMounted(async () => {
  try {
    // Load all datasets
    const datasetsRef = collection(firestore, 'topheroes', 'guilds-v2', 'datasets')
    const datasetsSnapshot = await getDocs(query(datasetsRef, firestoreOrderBy('updatedAt', 'desc')))
    
    allDatasets.value = datasetsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Load all published rankings
    const publishedRef = collection(firestore, 'topheroes', 'guilds-v2', 'published')
    const publishedSnapshot = await getDocs(query(publishedRef, firestoreOrderBy('publishedAt', 'desc')))
    
    allPublished.value = publishedSnapshot.docs.map(doc => ({
      publishId: doc.id,
      ...doc.data()
    }))
  } catch (err) {
    console.error('Error loading data:', err)
    error.value = 'Failed to load datasets'
  } finally {
    isLoading.value = false
  }
})

// Group published rankings by dataset
const datasetsWithPublished = computed(() => {
  return allDatasets.value
    .map(dataset => {
      const publishedVersions = allPublished.value.filter(p => p.datasetId === dataset.id)
      
      if (publishedVersions.length === 0) return null
      
      const totalViews = publishedVersions.reduce((sum, v) => sum + (v.viewCount || 0), 0)
      const latestPublish = publishedVersions[0] // Already sorted by publishedAt desc
      
      return {
        ...dataset,
        publishedVersions,
        totalViews,
        latestPublish
      }
    })
    .filter(d => d !== null)
})

// Filtered and sorted datasets
const filteredDatasets = computed(() => {
  let results = [...datasetsWithPublished.value]
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    results = results.filter(d => 
      d.name?.toLowerCase().includes(query) ||
      d.metadata?.description?.toLowerCase().includes(query)
    )
  }
  
  // Apply sorting
  switch (sortBy.value) {
    case 'updated':
      results.sort((a, b) => new Date(b.latestPublish.publishedAt) - new Date(a.latestPublish.publishedAt))
      break
    case 'name':
      results.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      break
    case 'versions':
      results.sort((a, b) => b.publishedVersions.length - a.publishedVersions.length)
      break
    case 'views':
      results.sort((a, b) => b.totalViews - a.totalViews)
      break
  }
  
  return results
})

// Get badge class for event category
function getEventBadgeClass(category) {
  switch (category) {
    case 'gvg':
      return 'bg-red-500/20 text-red-300 border border-red-500/30'
    case 'kvk':
      return 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
    default:
      return 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
  }
}

// Open latest version
function openLatestVersion(dataset) {
  if (dataset.latestPublish) {
    router.push(`/topheroes/tools/rankings/public/${dataset.latestPublish.publishId}`)
  }
}

// Open version selection modal
function openVersionModal(dataset) {
  selectedDataset.value = dataset
  showVersionModal.value = true
}

// Close version modal
function closeVersionModal() {
  showVersionModal.value = false
  selectedDataset.value = null
}

// Navigate to specific version
function navigateToVersion(publishId) {
  router.push(`/topheroes/tools/rankings/public/${publishId}`)
  closeVersionModal()
}

// Format date
function formatDate(dateString) {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// Format number with commas
function formatNumber(num) {
  if (num == null) return '0'
  return num.toLocaleString()
}
</script>

<style scoped>
/* Custom scrollbar for consistency with other pages */
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