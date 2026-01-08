<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <!-- Animated background -->
    <div class="absolute inset-0 overflow-hidden opacity-20">
      <div class="absolute -inset-[10px] opacity-50">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-1/4 left-1/3 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
    </div>

    <div class="relative max-w-6xl mx-auto px-6 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mb-4 shadow-xl shadow-green-500/30">
          <Settings class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-4xl font-black text-white mb-2 tracking-tight">
          Minecraft Server Setup
        </h1>
        <p class="text-base text-slate-300">
          Configure your server for Minecraft hosting
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <div class="relative">
          <div class="w-20 h-20 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
          <div class="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-emerald-500 rounded-full animate-spin-reverse"></div>
        </div>
        <p class="mt-6 text-slate-300 text-lg">Checking your servers...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-500/10 backdrop-blur-xl border-2 border-red-500/50 rounded-2xl p-8 shadow-2xl">
        <div class="flex items-start gap-4">
          <AlertTriangle class="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
          <div class="flex-1">
            <h3 class="text-xl font-bold text-red-100 mb-2">Connection Error</h3>
            <p class="text-red-200 mb-4">{{ error }}</p>
            
            <div class="bg-black/30 border border-red-500/30 rounded-lg p-4 mb-4">
              <p class="text-red-300 text-sm mb-2">Trying to connect to:</p>
              <code class="text-green-400">{{ API_URL }}</code>
              <p class="text-red-300 text-sm mt-3">Make sure your backend server is running and the routes are registered.</p>
            </div>
            
            <button @click="retry" class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
              Try Again
            </button>
          </div>
        </div>
      </div>

      <!-- No Servers -->
      <div v-else-if="!userServers || userServers.length === 0" class="bg-slate-800/50 backdrop-blur-xl border-2 border-slate-700 rounded-2xl p-12 text-center shadow-2xl">
        <Server class="w-16 h-16 mx-auto text-slate-400 mb-6" />
        <h2 class="text-2xl font-bold text-white mb-3">No Servers Found</h2>
        <p class="text-slate-300 mb-8">You need to add a server before setting up Minecraft</p>
        <button @click="$router.push('/servers')" class="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl">
          Add Your First Server
        </button>
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-8">
        <!-- Server Selection -->
        <div class="bg-slate-800/50 backdrop-blur-xl border-2 border-slate-700 rounded-xl p-6 shadow-xl">
          <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Server class="w-5 h-5 text-green-500" />
            Select Server to Configure
          </h2>
          
          <div class="grid gap-3">
            <button
              v-for="server in userServers"
              :key="server.id"
              @click="selectServer(server)"
              class="text-left p-4 rounded-lg transition-all duration-200 group"
              :class="[
                selectedServer?.id === server.id 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/30' 
                  : 'bg-slate-700/50 hover:bg-slate-700 border-2 border-slate-600 hover:border-slate-500'
              ]"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-base font-bold mb-1" :class="selectedServer?.id === server.id ? 'text-white' : 'text-slate-200'">
                    {{ server.name }}
                  </h3>
                  <div class="flex items-center gap-2 text-xs" :class="selectedServer?.id === server.id ? 'text-green-100' : 'text-slate-400'">
                    <span>{{ server.host }}:{{ server.port || 22 }}</span>
                  </div>
                </div>
                <div v-if="server.ready" class="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-md font-semibold text-sm">
                  <CheckCircle class="w-4 h-4" />
                  Ready
                </div>
                <div v-else class="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-md font-semibold text-sm">
                  <AlertTriangle class="w-4 h-4" />
                  Needs Setup
                </div>
              </div>

              <!-- Quick Status Preview -->
              <div v-if="server.checks" class="mt-3 flex gap-3">
                <div class="flex items-center gap-1.5 text-xs" :class="selectedServer?.id === server.id ? 'text-green-100' : 'text-slate-400'">
                  <component :is="server.checks.javaInstalled && server.checks.javaVersion >= 17 ? CheckCircle : XCircle" class="w-3.5 h-3.5" />
                  Java
                </div>
                <div class="flex items-center gap-1.5 text-xs" :class="selectedServer?.id === server.id ? 'text-green-100' : 'text-slate-400'">
                  <component :is="server.checks.minecraftDirWritable ? CheckCircle : XCircle" class="w-3.5 h-3.5" />
                  Directory
                </div>
                <div class="flex items-center gap-1.5 text-xs" :class="selectedServer?.id === server.id ? 'text-green-100' : 'text-slate-400'">
                  <component :is="server.checks.sudoAccess ? CheckCircle : XCircle" class="w-3.5 h-3.5" />
                  Permissions
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Selected Server Details -->
        <div v-if="selectedServer && !selectedServer.ready" class="space-y-6">
          <!-- Status -->
          <div class="bg-slate-800/50 backdrop-blur-xl border-2 border-slate-700 rounded-xl p-5 shadow-xl">
            <h3 class="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Activity class="w-4 h-4 text-green-500" />
              Server Status
            </h3>
            <div class="grid gap-2.5">
              <div class="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <component 
                  :is="selectedServer.checks?.javaInstalled && selectedServer.checks?.javaVersion >= 17 ? CheckCircle : XCircle"
                  class="w-5 h-5 flex-shrink-0"
                  :class="selectedServer.checks?.javaInstalled && selectedServer.checks?.javaVersion >= 17 ? 'text-green-400' : 'text-red-400'"
                />
                <div class="flex-1">
                  <div class="font-semibold text-white text-sm">Java Runtime</div>
                  <div class="text-xs text-slate-400">
                    {{ selectedServer.checks?.javaInstalled ? `Version ${selectedServer.checks.javaVersion}` : 'Not installed' }}
                    {{ selectedServer.checks?.javaVersion < 17 ? '(Need 17+)' : '' }}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <component 
                  :is="selectedServer.checks?.minecraftDirWritable ? CheckCircle : XCircle"
                  class="w-5 h-5 flex-shrink-0"
                  :class="selectedServer.checks?.minecraftDirWritable ? 'text-green-400' : 'text-red-400'"
                />
                <div class="flex-1">
                  <div class="font-semibold text-white text-sm">Minecraft Directory</div>
                  <div class="text-xs text-slate-400">~/minecraft/instances</div>
                </div>
              </div>

              <div class="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <component 
                  :is="selectedServer.checks?.sudoAccess ? CheckCircle : XCircle"
                  class="w-5 h-5 flex-shrink-0"
                  :class="selectedServer.checks?.sudoAccess ? 'text-green-400' : 'text-red-400'"
                />
                <div class="flex-1">
                  <div class="font-semibold text-white text-sm">Sudo Permissions</div>
                  <div class="text-xs text-slate-400">Service management access</div>
                </div>
              </div>

              <div v-if="selectedServer.checks?.existingInstances?.length > 0" class="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <Info class="w-5 h-5 flex-shrink-0 text-blue-400" />
                <div class="flex-1">
                  <div class="font-semibold text-blue-200 text-sm">Existing Installations Found</div>
                  <div class="text-xs text-blue-300">{{ selectedServer.checks.existingInstances.length }} Minecraft server{{ selectedServer.checks.existingInstances.length > 1 ? 's' : '' }} detected</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Commands -->
          <div v-if="!selectedServer.ready && selectedServer.setupCommands?.length > 0" class="bg-slate-800/50 backdrop-blur-xl border-2 border-slate-700 rounded-xl p-5 shadow-xl">
            <h3 class="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Terminal class="w-4 h-4 text-green-500" />
              Setup Commands
            </h3>

            <!-- Show only commands that need to run -->
            <div v-if="commandsToRun.length > 0" class="space-y-3">
              <div 
                v-for="(cmd, idx) in commandsToRun"
                :key="idx"
                class="bg-slate-900/70 border border-slate-700 rounded-lg p-4"
              >
                <h4 class="text-sm font-bold text-white mb-2">{{ cmd.title }}</h4>
                <p class="text-xs text-slate-300 mb-3">{{ cmd.description }}</p>

                <div class="bg-black/50 border border-slate-700 rounded-md p-3 font-mono text-xs overflow-x-auto mb-3">
                  <div v-for="(command, cmdIdx) in cmd.commands" :key="cmdIdx" class="text-green-400 mb-0.5">
                    <span class="text-slate-500">$ </span>{{ command }}
                  </div>
                </div>

                <div class="flex items-start gap-2 p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-md">
                  <Info class="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div class="text-xs text-blue-200">
                    <strong class="text-blue-100">Why:</strong> {{ cmd.reason }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Debug: Show all commands if filtered list is empty but commands exist -->
            <div v-else class="space-y-3">
              <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-3">
                <p class="text-sm text-yellow-200">
                  <strong>Debug:</strong> Backend returned {{ selectedServer.setupCommands.length }} commands, but all are marked as skippable.
                </p>
              </div>
              <div 
                v-for="(cmd, idx) in selectedServer.setupCommands"
                :key="idx"
                class="bg-slate-900/70 border border-slate-700 rounded-lg p-4 opacity-50"
              >
                <div class="flex items-start justify-between mb-2">
                  <h4 class="text-sm font-bold text-white">{{ cmd.title }}</h4>
                  <span v-if="cmd.skipIf" class="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                    {{ cmd.skipIf }}
                  </span>
                </div>
                <p class="text-xs text-slate-300">{{ cmd.description }}</p>
              </div>
            </div>
          </div>

          <!-- All Requirements Met Message -->
          <div v-else-if="allRequirementsMet && selectedServer.ready" class="bg-green-500/10 backdrop-blur-xl border-2 border-green-500/50 rounded-xl p-5 shadow-xl text-center">
            <CheckCircle class="w-12 h-12 mx-auto text-green-400 mb-3" />
            <h3 class="text-lg font-bold text-green-100 mb-2">Server Already Configured!</h3>
            <p class="text-sm text-green-200">All requirements are met. You can start creating Minecraft instances.</p>
          </div>

          <!-- Approval -->
          <div v-if="!selectedServer.ready && (commandsToRun.length > 0 || selectedServer.setupCommands?.length > 0)" class="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border-2 border-yellow-500/50 rounded-xl p-5 shadow-xl">
            <div class="flex items-start gap-3 mb-4">
              <AlertTriangle class="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <div>
                <h3 class="text-base font-bold text-yellow-100 mb-1">Review Required</h3>
                <p class="text-sm text-yellow-200">
                  {{ commandsToRun.length > 0 ? 'These commands' : 'The setup commands' }} will be executed on <strong>{{ selectedServer.name }}</strong> with sudo privileges.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg">
              <Checkbox 
                id="approve" 
                v-model:checked="approved" 
                class="mt-0.5 border-white data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" 
              />
              <Label for="approve" class="cursor-pointer text-white text-sm leading-relaxed">
                I have reviewed all commands above and approve their execution on <strong>{{ selectedServer.name }}</strong>. 
                I understand these will run with sudo privileges.
              </Label>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between gap-4">
            <button 
              @click="$router.push('/minecraft')"
              class="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 text-sm"
            >
              <ArrowLeft class="w-4 h-4" />
              Back
            </button>

            <button 
              v-if="!selectedServer.ready"
              @click="executeSetup"
              :disabled="!approved || executing"
              class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
            >
              <component :is="executing ? Loader2 : Zap" class="w-4 h-4" :class="executing && 'animate-spin'" />
              {{ executing ? 'Setting Up...' : 'Execute Setup' }}
            </button>

            <button 
              v-else-if="selectedServer.ready"
              @click="goToDashboard"
              class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
            >
              Continue to Dashboard
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>

          <!-- Progress -->
          <div v-if="setupProgress.length > 0" class="bg-slate-800/50 backdrop-blur-xl border-2 border-slate-700 rounded-xl p-5 shadow-xl">
            <h3 class="text-base font-bold text-white mb-4">Setup Progress</h3>
            <div class="space-y-2">
              <div v-for="(step, idx) in setupProgress" :key="idx" class="flex items-center gap-2.5 p-2.5 bg-slate-900/50 rounded-lg">
                <component 
                  :is="step.status === 'success' ? CheckCircle : step.status === 'failed' ? XCircle : Loader2"
                  class="w-4 h-4"
                  :class="{
                    'text-green-400': step.status === 'success',
                    'text-red-400': step.status === 'failed',
                    'text-yellow-400 animate-spin': step.status === 'running'
                  }"
                />
                <span class="text-white text-sm">{{ step.message }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Server Already Ready -->
        <div v-else-if="selectedServer?.ready" class="bg-green-500/10 backdrop-blur-xl border-2 border-green-500/50 rounded-xl p-8 text-center shadow-xl">
          <CheckCircle class="w-16 h-16 mx-auto text-green-400 mb-4" />
          <h2 class="text-2xl font-bold text-green-100 mb-2">{{ selectedServer.name }} is Ready!</h2>
          <p class="text-sm text-green-200 mb-6">This server is already configured for Minecraft hosting</p>
          
          <div v-if="selectedServer.checks?.existingInstances?.length > 0" class="mb-6">
            <p class="text-sm text-blue-200 mb-4">Found {{ selectedServer.checks.existingInstances.length }} existing installation{{ selectedServer.checks.existingInstances.length > 1 ? 's' : '' }}</p>
            <button @click="importServer(selectedServer)" :disabled="importing" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded-lg font-bold transition-all duration-200 text-sm">
              {{ importing ? 'Importing...' : 'Import & Continue' }}
            </button>
          </div>
          <button v-else @click="goToDashboard" class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl text-sm">
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useServers } from '@/composables/useServers'
import { useMainStore } from '@/stores/useMainStore'
import { toast } from 'vue-sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Settings,
  Server,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  ArrowLeft,
  ArrowRight,
  Zap,
  Loader2,
  Activity,
  Terminal
} from 'lucide-vue-next'

const router = useRouter()
const mainStore = useMainStore()
const { getServers } = useServers()

const loading = ref(true)
const error = ref(null)
const userServers = ref([])
const selectedServer = ref(null)
const approved = ref(false)
const executing = ref(false)
const importing = ref(false)
const setupProgress = ref([])

// Filter commands to only show ones that need to run
const commandsToRun = computed(() => {
  if (!selectedServer.value?.setupCommands) return []
  return selectedServer.value.setupCommands.filter(cmd => !cmd.skipIf)
})

// Check if all requirements are already met
const allRequirementsMet = computed(() => {
  if (!selectedServer.value?.checks) return false
  const checks = selectedServer.value.checks
  return (
    checks.javaInstalled &&
    checks.javaVersion >= 17 &&
    checks.minecraftDirWritable &&
    checks.sudoAccess
  )
})

// Use your existing SSH URL but convert from wss:// to https://
const WS_URL = import.meta.env.VITE_SSH_WS_URL || 'wss://ssh.mxn.au'
const API_URL = WS_URL.replace('wss://', 'https://')

console.log('🚀 Minecraft API URL:', API_URL)

async function getToken() {
  return mainStore.token
}

async function loadServers() {
  try {
    loading.value = true
    error.value = null

    // Get servers using your existing composable
    const servers = await getServers()

    if (servers.length === 0) {
      userServers.value = []
      loading.value = false
      return
    }

    // Check each server via backend API
    const token = await getToken()
    
    for (const server of servers) {
      try {
        // Check readiness
        const checkRes = await fetch(`${API_URL}/api/minecraft/servers/check-readiness`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ serverId: server.id })
        })

        if (!checkRes.ok) {
          console.error(`Failed to check server ${server.name}:`, checkRes.statusText)
          continue
        }
        
        const checkData = await checkRes.json()
        server.ready = checkData.ready
        server.checks = checkData.checks

        // Get setup commands if not ready
        if (!server.ready) {
          const cmdRes = await fetch(`${API_URL}/api/minecraft/servers/get-setup-commands`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ serverId: server.id })
          })

          if (cmdRes.ok) {
            const cmdData = await cmdRes.json()
            server.setupCommands = cmdData.commands
            console.log(`📋 Setup commands for ${server.name}:`, cmdData.commands)
            console.log(`  - Total commands: ${cmdData.commands.length}`)
            console.log(`  - Commands with skipIf:`, cmdData.commands.filter(c => c.skipIf).length)
            console.log(`  - Commands to run:`, cmdData.commands.filter(c => !c.skipIf).length)
          } else {
            console.error(`Failed to get setup commands for ${server.name}`)
          }
        }
      } catch (err) {
        console.error(`Error checking server ${server.name}:`, err)
        // Don't set error - let it continue with other servers
      }
    }

    userServers.value = servers
    
    // Auto-select first server
    if (servers.length > 0) {
      selectServer(servers[0])
    }
  } catch (err) {
    console.error('Error loading servers:', err)
    error.value = `Failed to load servers: ${err.message}`
  } finally {
    loading.value = false
  }
}

function selectServer(server) {
  selectedServer.value = server
  approved.value = false
  setupProgress.value = []
}

async function executeSetup() {
  if (!selectedServer.value || !approved.value) return

  executing.value = true
  setupProgress.value = []

  try {
    const token = await getToken()

    const res = await fetch(`${API_URL}/api/minecraft/servers/execute-setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ serverId: selectedServer.value.id })
    })

    const data = await res.json()

    if (data.success) {
      setupProgress.value = data.results.map(r => ({ ...r, status: 'success' }))
      toast.success('Setup completed successfully!')
      
      // Wait a moment then reload
      setTimeout(async () => {
        await loadServers()
        if (selectedServer.value.ready) {
          // Check if there are instances to import
          if (selectedServer.value.checks?.existingInstances?.length > 0) {
            toast.info('Found existing Minecraft installations')
          } else {
            goToDashboard()
          }
        }
      }, 2000)
    } else {
      setupProgress.value = data.results?.map(r => ({ ...r, status: r.status })) || []
      toast.error('Setup failed')
    }
  } catch (err) {
    toast.error('Setup error: ' + err.message)
  } finally {
    executing.value = false
  }
}

async function importServer(server) {
  importing.value = true
  
  try {
    const token = await getToken()
    
    await fetch(`${API_URL}/api/minecraft/servers/import-instances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ serverId: server.id })
    })

    toast.success('Imported existing servers')
    goToDashboard()
  } catch (err) {
    toast.error('Import failed: ' + err.message)
  } finally {
    importing.value = false
  }
}

function goToDashboard() {
  router.push('/minecraft/dashboard')
}

function retry() {
  loadServers()
}

onMounted(() => {
  loadServers()
})
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}

.animate-spin-reverse {
  animation: spin 1.5s linear infinite reverse;
}
</style>