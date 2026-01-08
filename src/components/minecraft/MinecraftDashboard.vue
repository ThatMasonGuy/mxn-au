<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-stone-900 to-gray-900 text-gray-100">
    <!-- Header -->
    <div class="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
              <Box class="w-6 h-6" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-green-400">Minecraft Control</h1>
              <div class="flex items-center gap-2 text-sm">
                <Server class="w-3.5 h-3.5 text-gray-400" />
                <span v-if="currentServer" class="text-gray-300">
                  {{ currentServer.name }}
                </span>
                <span v-else class="text-gray-500">
                  No server selected
                </span>
                <span class="text-gray-600">•</span>
                <span class="text-gray-400">{{ instances.length }} instance{{ instances.length !== 1 ? 's' : '' }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Server Selector -->
            <select 
              v-if="userServers.length > 0"
              v-model="selectedServerId"
              @change="handleServerChange"
              class="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white hover:border-gray-600 transition-colors"
            >
              <option value="">Select Server</option>
              <option v-for="server in userServers" :key="server.id" :value="server.id">
                {{ server.name }}
              </option>
            </select>

            <Button @click="showWizard = true" class="bg-green-600 hover:bg-green-700" :disabled="!selectedServerId">
              <Plus class="w-4 h-4 mr-2" />
              New Instance
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Server Selected State -->
    <div v-if="!selectedServerId && userServers.length > 0" class="text-center py-24">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-6">
        <Server class="w-10 h-10 text-gray-600" />
      </div>
      <h3 class="text-2xl font-semibold mb-2 text-white">Select a Server</h3>
      <p class="text-gray-400 mb-8 max-w-md mx-auto">
        Choose a server from the dropdown above to view and manage its Minecraft instances
      </p>
    </div>

    <!-- No Servers Available -->
    <div v-else-if="userServers.length === 0 && !loadingServers" class="text-center py-24">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-6">
        <ServerOff class="w-10 h-10 text-gray-600" />
      </div>
      <h3 class="text-2xl font-semibold mb-2 text-white">No Servers Found</h3>
      <p class="text-gray-400 mb-8 max-w-md mx-auto">
        You need to add a server before you can create Minecraft instances
      </p>
      <Button @click="$router.push('/servers')" class="bg-blue-600 hover:bg-blue-700">
        <Plus class="w-4 h-4 mr-2" />
        Add Server
      </Button>
    </div>

    <!-- Active Jobs Banner -->
    <div v-if="selectedServerId && activeJobs.length > 0" class="bg-blue-900/30 border-b border-blue-800/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <Loader2 class="w-4 h-4 animate-spin text-blue-400" />
            <span class="text-sm text-blue-300">
              {{ activeJobs.length }} job{{ activeJobs.length > 1 ? 's' : '' }} in progress
            </span>
          </div>
          <Button variant="ghost" size="sm" @click="showJobsPanel = !showJobsPanel">
            {{ showJobsPanel ? 'Hide' : 'Show' }} Details
          </Button>
        </div>

        <!-- Jobs Detail Panel -->
        <div v-if="showJobsPanel" class="mt-4 space-y-2">
          <div 
            v-for="job in activeJobs" 
            :key="job.id"
            class="bg-gray-800/50 rounded-lg p-3"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <span class="font-medium">{{ job.type }}</span>
                <span class="text-xs text-gray-400">{{ job.instanceName }}</span>
              </div>
              <span class="text-xs text-gray-400">{{ job.progress }}%</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div 
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${job.progress}%` }"
              />
            </div>
            <div v-if="job.currentStageText" class="text-xs text-gray-400 mt-2">
              {{ job.currentStageText }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content (only show if server selected) -->
    <div v-if="selectedServerId" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Empty State -->
      <div v-if="instances.length === 0 && !loading" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
          <Server class="w-8 h-8 text-gray-600" />
        </div>
        <h3 class="text-xl font-semibold mb-2">No Minecraft Instances</h3>
        <p class="text-gray-400 mb-6">Get started by creating your first Minecraft server on {{ currentServer?.name }}</p>
        <Button @click="showWizard = true" class="bg-green-600 hover:bg-green-700">
          <Plus class="w-4 h-4 mr-2" />
          Create Instance
        </Button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <Loader2 class="w-8 h-8 animate-spin mx-auto text-green-400" />
        <p class="text-gray-400 mt-4">Loading instances...</p>
      </div>

      <!-- Instances Grid -->
      <div v-if="instances.length > 0 && !loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="instance in instances"
          :key="instance.id"
          class="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-green-600/50 transition-all cursor-pointer group"
          @click="openInstance(instance)"
        >
          <!-- Status Banner -->
          <div 
            :class="[
              'px-4 py-2 border-b',
              getStatusColor(instance.status).bg,
              getStatusColor(instance.status).border
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div 
                  :class="[
                    'w-2 h-2 rounded-full',
                    getStatusColor(instance.status).dot
                  ]"
                />
                <span class="text-sm font-medium">{{ getStatusText(instance.status) }}</span>
              </div>
              <Badge variant="outline" class="text-xs">
                {{ instance.version }}
              </Badge>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-3 group-hover:text-green-400 transition-colors">
              {{ instance.name }}
            </h3>

            <div class="space-y-2 text-sm text-gray-400">
              <div class="flex items-center space-x-2">
                <Globe class="w-4 h-4" />
                <span>{{ getWorldName(instance) }}</span>
              </div>
              
              <div class="flex items-center space-x-2">
                <Users class="w-4 h-4" />
                <span>{{ instance.onlinePlayers || 0 }}/{{ instance.maxPlayers || 20 }}</span>
              </div>

              <div class="flex items-center space-x-2">
                <Calendar class="w-4 h-4" />
                <span>Created {{ formatDate(instance.createdAt) }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-4 pt-4 border-t border-gray-700 flex gap-2">
              <Button
                v-if="instance.status === 'stopped'"
                @click.stop="startServer(instance.id)"
                size="sm"
                class="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Play class="w-4 h-4 mr-1" />
                Start
              </Button>
              
              <Button
                v-if="instance.status === 'running'"
                @click.stop="stopServer(instance.id)"
                size="sm"
                variant="outline"
                class="flex-1"
              >
                <Square class="w-4 h-4 mr-1" />
                Stop
              </Button>

              <Button
                @click.stop="openInstance(instance)"
                size="sm"
                variant="outline"
                class="flex-1"
              >
                <Settings class="w-4 h-4 mr-1" />
                Manage
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Wizard Dialog -->
    <Dialog v-model:open="showWizard">
      <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
        <MinecraftWizard 
          :serverId="selectedServerId" 
          :serverName="currentServer?.name"
          @complete="handleWizardComplete" 
          @close="showWizard = false" 
        />
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMinecraftStore } from '@/stores/useMinecraftStore'
import { useServers } from '@/composables/useServers'
import { useMinecraftAPI } from '@/composables/useMinecraftAPI'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import MinecraftWizard from '@/components/minecraft/MinecraftWizard.vue'
import { 
  Server,
  ServerOff,
  Plus, 
  Loader2, 
  Globe, 
  Users, 
  Calendar,
  Play,
  Square,
  Settings,
  Box
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const minecraftStore = useMinecraftStore()
const { getServers } = useServers()
const { startServer: apiStartServer, stopServer: apiStopServer } = useMinecraftAPI()

const showWizard = ref(false)
const showJobsPanel = ref(false)
const loading = ref(true)
const loadingServers = ref(true)
const userServers = ref([])
const selectedServerId = ref('')

const instances = computed(() => minecraftStore.instances)
const activeJobs = computed(() => minecraftStore.activeJobs)
const currentServer = computed(() => userServers.value.find(s => s.id === selectedServerId.value))

// Load user's servers
async function loadServers() {
  try {
    loadingServers.value = true
    const servers = await getServers()
    userServers.value = servers
    
    // Auto-select first server if available and none selected
    if (servers.length > 0 && !selectedServerId.value) {
      // Check if there's a serverId in query params
      if (route.query.serverId) {
        selectedServerId.value = route.query.serverId
      } else {
        selectedServerId.value = servers[0].id
      }
    }
  } catch (error) {
    console.error('Error loading servers:', error)
  } finally {
    loadingServers.value = false
  }
}

// Watch for server changes and reload instances
watch(selectedServerId, async (newServerId) => {
  if (newServerId) {
    loading.value = true
    try {
      await minecraftStore.fetchInstances(newServerId)
      minecraftStore.subscribeToInstances(newServerId)
      
      // Update URL with serverId
      router.replace({ 
        path: '/minecraft/dashboard',
        query: { serverId: newServerId }
      })
    } catch (error) {
      console.error('Error loading instances:', error)
    } finally {
      loading.value = false
    }
  }
})

function handleServerChange() {
  // Server change is handled by the watch
}

onMounted(async () => {
  await loadServers()
})

onUnmounted(() => {
  minecraftStore.unsubscribeAll()
})

const openInstance = (instance) => {
  router.push(`/minecraft/${instance.id}?serverId=${selectedServerId.value}`)
}

const handleWizardComplete = (instance) => {
  showWizard.value = false
  router.push(`/minecraft/${instance.id}?serverId=${selectedServerId.value}`)
}

const startServer = async (instanceId) => {
  try {
    // Optimistically update UI
    await minecraftStore.updateInstance(instanceId, { status: 'starting' })
    
    // Call backend API
    await apiStartServer(selectedServerId.value, instanceId)
    
    console.log('Server started:', instanceId)
  } catch (error) {
    console.error('Failed to start server:', error)
    // Revert status on error
    await minecraftStore.updateInstance(instanceId, { status: 'stopped' })
  }
}

const stopServer = async (instanceId) => {
  try {
    // Optimistically update UI
    await minecraftStore.updateInstance(instanceId, { status: 'stopping' })
    
    // Call backend API
    await apiStopServer(selectedServerId.value, instanceId)
    
    console.log('Server stopped:', instanceId)
  } catch (error) {
    console.error('Failed to stop server:', error)
    // Revert status on error
    await minecraftStore.updateInstance(instanceId, { status: 'running' })
  }
}

const getStatusColor = (status) => {
  const colors = {
    running: {
      bg: 'bg-green-900/30',
      border: 'border-green-800/50',
      dot: 'bg-green-400 animate-pulse'
    },
    stopped: {
      bg: 'bg-gray-800/30',
      border: 'border-gray-700/50',
      dot: 'bg-gray-500'
    },
    installing: {
      bg: 'bg-blue-900/30',
      border: 'border-blue-800/50',
      dot: 'bg-blue-400 animate-pulse'
    },
    error: {
      bg: 'bg-red-900/30',
      border: 'border-red-800/50',
      dot: 'bg-red-400'
    },
    starting: {
      bg: 'bg-yellow-900/30',
      border: 'border-yellow-800/50',
      dot: 'bg-yellow-400 animate-pulse'
    },
    stopping: {
      bg: 'bg-orange-900/30',
      border: 'border-orange-800/50',
      dot: 'bg-orange-400 animate-pulse'
    }
  }
  return colors[status] || colors.stopped
}

const getStatusText = (status) => {
  const texts = {
    running: 'Running',
    stopped: 'Stopped',
    installing: 'Installing',
    error: 'Error',
    starting: 'Starting',
    stopping: 'Stopping'
  }
  return texts[status] || status
}

const getWorldName = (instance) => {
  if (!instance.activeWorld || !instance.worlds) return 'No world'
  const world = instance.worlds.find(w => w.id === instance.activeWorld)
  return world?.name || 'Unknown'
}

const formatDate = (date) => {
  if (!date) return 'Unknown'
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString()
}

const formatUptime = (seconds) => {
  if (!seconds) return '0m'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}
</script>