<template>
  <div class="space-y-6">
    <DialogHeader>
      <DialogTitle class="text-2xl">Create Minecraft Server</DialogTitle>
      <DialogDescription>
        Set up a new Minecraft server in minutes with our guided wizard
      </DialogDescription>
    </DialogHeader>

    <!-- Progress Steps -->
    <div class="flex items-center justify-between mb-8">
      <div 
        v-for="(step, index) in steps" 
        :key="step.id"
        class="flex items-center"
        :class="{ 'flex-1': index < steps.length - 1 }"
      >
        <div class="flex flex-col items-center">
          <div 
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
              currentStep >= index 
                ? 'bg-green-600 border-green-600 text-white' 
                : 'bg-gray-800 border-gray-600 text-gray-400'
            ]"
          >
            <Check v-if="currentStep > index" class="w-5 h-5" />
            <span v-else class="text-sm font-semibold">{{ index + 1 }}</span>
          </div>
          <span class="text-xs mt-2 text-gray-400">{{ step.name }}</span>
        </div>
        <div 
          v-if="index < steps.length - 1"
          :class="[
            'h-0.5 flex-1 mx-4 transition-all',
            currentStep > index ? 'bg-green-600' : 'bg-gray-700'
          ]"
        />
      </div>
    </div>

    <!-- Step 1: Server Selection -->
    <div v-if="currentStep === 0" class="space-y-6">
      <div>
        <Label class="text-base font-semibold mb-4 block">Select Server Type</Label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            v-for="type in serverTypes"
            :key="type.id"
            @click="formData.serverType = type.id"
            :class="[
              'p-4 rounded-lg border-2 text-left transition-all',
              formData.serverType === type.id
                ? 'border-green-600 bg-green-900/20'
                : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
            ]"
          >
            <div class="flex items-center space-x-3 mb-2">
              <component :is="type.icon" class="w-6 h-6 text-green-400" />
              <span class="font-semibold">{{ type.name }}</span>
            </div>
            <p class="text-xs text-gray-400">{{ type.description }}</p>
            <div v-if="type.recommended" class="mt-2">
              <Badge variant="secondary" class="text-xs">Recommended</Badge>
            </div>
          </button>
        </div>
      </div>

      <div v-if="formData.serverType" class="space-y-4">
        <div>
          <Label for="version">Version</Label>
          <Select v-model="formData.version">
            <SelectTrigger id="version">
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="version in getVersions(formData.serverType)" :key="version" :value="version">
                {{ version }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label for="server">Target Server</Label>
          <div v-if="loadingServers" class="flex items-center gap-2 h-10 px-3 text-sm text-gray-400">
            <Loader2 class="w-4 h-4 animate-spin" />
            Loading servers...
          </div>
          <div v-else-if="servers.length === 0" class="text-sm text-yellow-400 p-3 bg-yellow-900/20 rounded-lg border border-yellow-800/50">
            No servers configured. Please add a server in the SSH Portal first.
          </div>
          <Select v-else v-model="formData.serverId">
            <SelectTrigger id="server">
              <SelectValue placeholder="Select server" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="server in servers" :key="server.id" :value="server.id">
                {{ server.name }} ({{ server.host }})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label for="instanceName">Instance Name</Label>
          <Input 
            id="instanceName"
            v-model="formData.instanceName" 
            placeholder="My Minecraft Server"
          />
        </div>
      </div>
    </div>

    <!-- Step 2: Configuration -->
    <div v-if="currentStep === 1" class="space-y-6">
      <div class="space-y-4">
        <div>
          <Label for="memory">Memory Allocation (GB)</Label>
          <div class="flex items-center space-x-4">
            <Slider 
              v-model="formData.memory" 
              :min="1" 
              :max="16" 
              :step="0.5"
              class="flex-1"
            />
            <span class="text-sm font-semibold w-12">{{ formData.memory[0] }}GB</span>
          </div>
          <p class="text-xs text-gray-400 mt-1">Recommended: 4-8GB for small servers</p>
        </div>

        <div>
          <Label for="port">Server Port</Label>
          <Input 
            id="port"
            type="number"
            v-model.number="formData.port" 
            placeholder="25565"
          />
        </div>

        <div>
          <Label for="maxPlayers">Max Players</Label>
          <Input 
            id="maxPlayers"
            type="number"
            v-model.number="formData.maxPlayers" 
            placeholder="20"
          />
        </div>

        <div class="flex items-center space-x-2">
          <Checkbox id="autoStart" v-model:checked="formData.autoStart" />
          <Label for="autoStart" class="cursor-pointer">
            Auto-start server on host boot
          </Label>
        </div>

        <div class="flex items-center space-x-2">
          <Checkbox id="autoRestart" v-model:checked="formData.autoRestart" />
          <Label for="autoRestart" class="cursor-pointer">
            Auto-restart on crash
          </Label>
        </div>
      </div>
    </div>

    <!-- Step 3: EULA -->
    <div v-if="currentStep === 2" class="space-y-6">
      <div class="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-6">
        <div class="flex items-start space-x-3">
          <AlertTriangle class="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div class="space-y-3">
            <h3 class="font-semibold text-lg">Minecraft EULA Agreement</h3>
            <p class="text-sm text-gray-300">
              By continuing, you agree to the Minecraft End User License Agreement (EULA). 
              Running a Minecraft server requires accepting these terms.
            </p>
            
            <div class="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto text-xs font-mono text-gray-400">
              <p class="mb-2">Minecraft End User License Agreement (EULA)</p>
              <p class="mb-2">https://www.minecraft.net/en-us/eula</p>
              <p class="mb-4">Key Points:</p>
              <ul class="list-disc list-inside space-y-1">
                <li>The server software is provided by Mojang/Microsoft</li>
                <li>You may not distribute the server software</li>
                <li>You may not make commercial use of the software</li>
                <li>You may not sell access to the server</li>
                <li>You may not use the software to violate laws</li>
              </ul>
            </div>

            <div class="flex items-start space-x-2 pt-4">
              <Checkbox id="eula" v-model:checked="formData.eulaAccepted" />
              <Label for="eula" class="cursor-pointer text-sm">
                I have read and agree to the Minecraft EULA. I understand this acceptance will be recorded.
              </Label>
            </div>
          </div>
        </div>
      </div>

      <Alert v-if="formData.eulaAccepted" class="bg-green-900/20 border-green-800/50">
        <CheckCircle class="h-4 w-4 text-green-400" />
        <AlertTitle>EULA Accepted</AlertTitle>
        <AlertDescription>
          Acceptance recorded for {{ userEmail }} at {{ new Date().toLocaleString() }}
        </AlertDescription>
      </Alert>
    </div>

    <!-- Step 4: Review -->
    <div v-if="currentStep === 3" class="space-y-6">
      <div class="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h3 class="font-semibold text-lg mb-4">Review Configuration</h3>
        
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-400">Server Type:</span>
            <p class="font-semibold">{{ getServerTypeName(formData.serverType) }}</p>
          </div>
          <div>
            <span class="text-gray-400">Version:</span>
            <p class="font-semibold">{{ formData.version }}</p>
          </div>
          <div>
            <span class="text-gray-400">Instance Name:</span>
            <p class="font-semibold">{{ formData.instanceName }}</p>
          </div>
          <div>
            <span class="text-gray-400">Target Server:</span>
            <p class="font-semibold">{{ getServerName(formData.serverId) }}</p>
          </div>
          <div>
            <span class="text-gray-400">Memory:</span>
            <p class="font-semibold">{{ formData.memory[0] }}GB</p>
          </div>
          <div>
            <span class="text-gray-400">Port:</span>
            <p class="font-semibold">{{ formData.port }}</p>
          </div>
          <div>
            <span class="text-gray-400">Max Players:</span>
            <p class="font-semibold">{{ formData.maxPlayers }}</p>
          </div>
          <div>
            <span class="text-gray-400">EULA:</span>
            <p class="font-semibold text-green-400">Accepted ✓</p>
          </div>
        </div>

        <div v-if="formData.autoStart || formData.autoRestart" class="pt-4 border-t border-gray-700">
          <span class="text-gray-400 text-sm">Auto-Configuration:</span>
          <div class="mt-2 space-y-1">
            <p v-if="formData.autoStart" class="text-sm">✓ Auto-start on boot</p>
            <p v-if="formData.autoRestart" class="text-sm">✓ Auto-restart on crash</p>
          </div>
        </div>
      </div>

      <Alert>
        <Info class="h-4 w-4" />
        <AlertTitle>What happens next?</AlertTitle>
        <AlertDescription>
          The installation wizard will download and configure {{ getServerTypeName(formData.serverType) }}, 
          set up the service, and prepare your server for first launch. This typically takes 3-5 minutes.
        </AlertDescription>
      </Alert>
    </div>

    <!-- Actions -->
    <DialogFooter class="flex justify-between">
      <Button 
        v-if="currentStep > 0" 
        variant="outline" 
        @click="currentStep--"
        :disabled="installing"
      >
        <ChevronLeft class="w-4 h-4 mr-2" />
        Back
      </Button>
      
      <div class="ml-auto flex space-x-2">
        <Button variant="ghost" @click="$emit('close')" :disabled="installing">
          Cancel
        </Button>
        
        <Button 
          v-if="currentStep < steps.length - 1"
          @click="nextStep"
          :disabled="!canProceed"
          class="bg-green-600 hover:bg-green-700"
        >
          Next
          <ChevronRight class="w-4 h-4 ml-2" />
        </Button>
        
        <Button 
          v-else
          @click="createServer"
          :disabled="installing"
          class="bg-green-600 hover:bg-green-700"
        >
          <Loader2 v-if="installing" class="w-4 h-4 mr-2 animate-spin" />
          <Check v-else class="w-4 h-4 mr-2" />
          {{ installing ? 'Creating...' : 'Create Server' }}
        </Button>
      </div>
    </DialogFooter>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useMinecraftStore } from '@/stores/useMinecraftStore'
import { useMainStore } from '@/stores/useMainStore'
import { useServers } from '@/composables/useServers'
import { useMinecraftAPI } from '@/composables/useMinecraftAPI'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  Server,
  Box,
  Hammer,
  Sparkles
} from 'lucide-vue-next'

const emit = defineEmits(['complete', 'close'])

// Props - serverId and serverName come from Dashboard when a server is pre-selected
const props = defineProps({
  serverId: {
    type: String,
    default: ''
  },
  serverName: {
    type: String,
    default: ''
  }
})

const minecraftStore = useMinecraftStore()
const mainStore = useMainStore()
const { getServers } = useServers()
const { installMinecraft, loading: apiLoading, error: apiError } = useMinecraftAPI()

const currentStep = ref(0)
const installing = ref(false)
const loadingServers = ref(true)
const servers = ref([])

const steps = [
  { id: 'type', name: 'Type & Version' },
  { id: 'config', name: 'Configuration' },
  { id: 'eula', name: 'EULA' },
  { id: 'review', name: 'Review' }
]

const serverTypes = [
  {
    id: 'paper',
    name: 'Paper',
    description: 'High-performance fork with plugins',
    icon: Sparkles,
    recommended: true
  },
  {
    id: 'purpur',
    name: 'Purpur',
    description: 'Paper fork with extra features',
    icon: Server
  },
  {
    id: 'vanilla',
    name: 'Vanilla',
    description: 'Official Mojang server',
    icon: Box
  },
  {
    id: 'fabric',
    name: 'Fabric',
    description: 'Lightweight modding platform',
    icon: Hammer
  },
  {
    id: 'forge',
    name: 'Forge',
    description: 'Traditional modding platform',
    icon: Hammer
  }
]

const formData = ref({
  serverType: '',
  version: '',
  serverId: '',
  instanceName: '',
  memory: [4],
  port: 25565,
  maxPlayers: 20,
  autoStart: true,
  autoRestart: true,
  eulaAccepted: false
})

const userEmail = computed(() => mainStore.user?.email || 'Unknown')

const canProceed = computed(() => {
  if (currentStep.value === 0) {
    // Can't proceed if servers are still loading or no servers available
    if (loadingServers.value || servers.value.length === 0) return false
    return formData.value.serverType && formData.value.version && 
           formData.value.serverId && formData.value.instanceName
  }
  if (currentStep.value === 1) {
    return formData.value.memory[0] > 0 && formData.value.port > 0 && formData.value.maxPlayers > 0
  }
  if (currentStep.value === 2) {
    return formData.value.eulaAccepted
  }
  return true
})

onMounted(async () => {
  // Load real servers from user's configured servers
  loadingServers.value = true
  try {
    servers.value = await getServers()
    
    // If a serverId was passed from the dashboard, pre-select it
    if (props.serverId) {
      formData.value.serverId = props.serverId
    } else if (servers.value.length === 1) {
      // Auto-select if only one server
      formData.value.serverId = servers.value[0].id
    }
  } catch (error) {
    console.error('Failed to load servers:', error)
  } finally {
    loadingServers.value = false
  }
})

const getVersions = (serverType) => {
  // This would typically fetch from an API
  const versions = {
    paper: ['1.21.4', '1.21.3', '1.20.6', '1.20.4', '1.19.4'],
    purpur: ['1.21.4', '1.21.3', '1.20.6', '1.20.4'],
    vanilla: ['1.21.4', '1.21.3', '1.20.6', '1.20.4', '1.19.4'],
    fabric: ['1.21.4', '1.21.3', '1.20.6', '1.20.4'],
    forge: ['1.21.1', '1.20.6', '1.20.4', '1.19.4']
  }
  return versions[serverType] || []
}

const getServerTypeName = (type) => {
  return serverTypes.find(t => t.id === type)?.name || type
}

const getServerName = (serverId) => {
  return servers.value.find(s => s.id === serverId)?.name || 'Unknown'
}

const nextStep = () => {
  if (canProceed.value && currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const createServer = async () => {
  if (!canProceed.value || installing.value) return

  installing.value = true
  try {
    // Step 1: Create instance record in Firestore
    const instance = await minecraftStore.createInstance({
      name: formData.value.instanceName,
      serverType: formData.value.serverType,
      version: formData.value.version,
      serverId: formData.value.serverId,
      serverName: getServerName(formData.value.serverId),
      memory: formData.value.memory[0],
      port: formData.value.port,
      maxPlayers: formData.value.maxPlayers,
      autoStart: formData.value.autoStart,
      autoRestart: formData.value.autoRestart,
      eulaAccepted: true,
      eulaAcceptedAt: new Date().toISOString(),
      eulaAcceptedBy: userEmail.value
    })

    // Step 2: Call the backend to actually install Minecraft on the server
    // This will create directories, download JAR, setup systemd service, etc.
    try {
      await installMinecraft(formData.value.serverId, {
        instanceId: instance.id,
        serverType: formData.value.serverType,
        version: formData.value.version,
        memory: formData.value.memory[0],
        port: formData.value.port,
        maxPlayers: formData.value.maxPlayers
      })
      
      console.log('Installation started for instance:', instance.id)
    } catch (installError) {
      console.error('Installation API call failed:', installError)
      // Update instance status to show error
      await minecraftStore.updateInstance(instance.id, { 
        status: 'error',
        errorMessage: installError.message 
      })
      throw installError
    }

    // Step 3: Navigate to the instance page
    emit('complete', instance)
  } catch (error) {
    console.error('Error creating server:', error)
    alert('Failed to create server: ' + error.message)
  } finally {
    installing.value = false
  }
}
</script>