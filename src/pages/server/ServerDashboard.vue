<template>
  <div class="dashboard">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="breadcrumb">
        <span class="text-emerald-400">mxn.au</span>
        <span class="opacity-40">/</span>
        <span>server</span>
        <span class="opacity-40" v-if="currentServer">/</span>
        <span class="text-emerald-400" v-if="currentServer">{{ currentServer.name }}</span>
      </div>

      <div class="flex items-center gap-4">
        <!-- Quick Actions -->
        <button @click="showServerManager = !showServerManager" class="top-btn"
          :class="{ 'active': showServerManager }">
          <ServerIcon class="w-4 h-4" />
          <span class="font-mono text-sm">SERVERS</span>
        </button>

        <button @click="showAliases = !showAliases" class="top-btn" :class="{ 'active': showAliases }">
          <BookmarkIcon class="w-4 h-4" />
          <span class="font-mono text-sm">ALIASES</span>
        </button>

        <button @click="showCommandPalette = true" class="top-btn" title="Command Palette (Ctrl+K)">
          <CommandLineIcon class="w-4 h-4" />
          <span class="font-mono text-sm">QUICK CMD</span>
        </button>

        <!-- User -->
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
          <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span class="font-mono text-sm text-gray-300">{{ userName }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Sidebar (Server Manager) -->
      <transition name="slide-right">
        <aside v-if="showServerManager" class="sidebar">
          <ServerManager @server-selected="handleServerSelected" />
        </aside>
      </transition>

      <!-- Sidebar (Alias Manager) -->
      <transition name="slide-left">
        <aside v-if="showAliases" class="sidebar-right">
          <AliasManager />
        </aside>
      </transition>

      <!-- Terminal Area -->
      <main class="terminal-area" :class="{ 'full-width': !showServerManager && !showAliases }">
        <!-- Demo Terminal (No Server Selected) -->
        <div v-if="!currentServer" class="h-full flex flex-col">
          <div class="demo-info-bar">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span class="font-mono text-sm text-yellow-400">Demo Mode</span>
            </div>
            <span class="text-sm text-gray-400">
              Try it out! Select a server from the sidebar to connect for real.
            </span>
          </div>

          <div class="flex-1">
            <DemoTerminal />
          </div>
        </div>

        <!-- Real Terminal (Server Selected) -->
        <div v-else class="h-full flex flex-col">
          <!-- Terminal Controls Bar -->
          <div class="terminal-controls">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" v-if="terminalConnected"></div>
                <div class="w-2 h-2 rounded-full bg-gray-500" v-else></div>
                <span class="font-mono text-sm text-gray-400">
                  {{ terminalConnected ? 'Connected' : 'Disconnected' }}
                </span>
              </div>

              <div class="h-4 w-px bg-white/10"></div>

              <button @click="connectTerminal" v-if="!terminalConnected" class="control-btn">
                <span class="font-mono text-sm">CONNECT</span>
              </button>

              <button @click="disconnectTerminal" v-else class="control-btn text-red-400">
                <span class="font-mono text-sm">DISCONNECT</span>
              </button>

              <button @click="clearTerminal" class="control-btn">
                <span class="font-mono text-sm">CLEAR</span>
              </button>

              <button @click="showQuickCommands = !showQuickCommands" class="control-btn">
                <span class="font-mono text-sm">QUICK CMDS</span>
              </button>
            </div>

            <div class="flex items-center gap-2">
              <span class="font-mono text-xs text-gray-500">
                Session: {{ sessionDuration }}
              </span>
            </div>
          </div>

          <!-- Terminal Component -->
          <div class="flex-1 relative">
            <Terminal ref="terminalRef" :server-id="currentServer.id" :server-name="currentServer.name"
              :auto-connect="autoConnect" @command-executed="handleCommandExecuted" @disconnected="handleDisconnected"
              @path-changed="handlePathChanged" />

            <!-- Quick Commands Panel -->
            <transition name="slide-left">
              <div v-if="showQuickCommands" class="quick-commands-panel">
                <div class="panel-header">
                  <span class="font-mono text-sm text-emerald-400">Quick Commands</span>
                  <button @click="showQuickCommands = false" class="text-gray-400 hover:text-gray-200">×</button>
                </div>

                <div class="panel-body">
                  <div v-for="cmd in quickCommands" :key="cmd.name" @click="executeQuickCommand(cmd.command)"
                    class="quick-cmd-item">
                    <div class="flex items-start gap-3">
                      <component :is="cmd.icon" class="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div class="flex-1 min-w-0">
                        <div class="font-mono text-sm text-gray-200 mb-1">{{ cmd.name }}</div>
                        <div class="font-mono text-xs text-gray-500 truncate">{{ cmd.command }}</div>
                      </div>
                    </div>
                  </div>

                  <button @click="addCustomCommand" class="add-cmd-btn">
                    + Add Custom Command
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </main>
    </div>

    <!-- Command Palette Modal -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showCommandPalette" class="modal-overlay" @click.self="showCommandPalette = false">
          <div class="command-palette">
            <div class="palette-search">
              <CommandLineIcon class="w-5 h-5 text-gray-400" />
              <input v-model="paletteSearch" ref="paletteInput" type="text" placeholder="Type a command or search..."
                class="palette-input" @keydown.esc="showCommandPalette = false" @keydown.enter="executeFromPalette" />
            </div>

            <div class="palette-results">
              <div v-if="filteredPaletteCommands.length === 0" class="text-center text-gray-500 py-8">
                No commands found
              </div>

              <div v-for="(cmd, idx) in filteredPaletteCommands" :key="idx" @click="executePaletteCommand(cmd)"
                class="palette-item">
                <component :is="cmd.icon" class="w-5 h-5 text-emerald-400" />
                <div class="flex-1">
                  <div class="font-mono text-sm">{{ cmd.name }}</div>
                  <div class="font-mono text-xs text-gray-500">{{ cmd.command }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Toast Notifications -->
    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import {
  ServerIcon,
  CommandLineIcon,
  CpuChipIcon,
  FolderOpenIcon,
  ArrowPathIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BookmarkIcon
} from '@heroicons/vue/24/outline'
import Terminal from '@/components/server/Terminal.vue'
import DemoTerminal from '@/components/server/DemoTerminal.vue'
import ServerManager from '@/components/server/ServerManager.vue'
import AliasManager from '@/components/server/AliasManager.vue'
import ToastContainer from '@/components/server/ToastContainer.vue'
import { useAuth } from '@/composables/useAuth'

// State
const currentServer = ref(null)
const showServerManager = ref(true)
const showQuickCommands = ref(false)
const showCommandPalette = ref(false)
const showAliases = ref(false)
const terminalConnected = ref(false)
const paletteSearch = ref('')
const sessionStart = ref(null)
const sessionDuration = ref('00:00:00')
const autoConnect = ref(true)

// Refs
const terminalRef = ref(null)
const paletteInput = ref(null)

// User
const { user } = useAuth()
const userName = computed(() => user.value?.email?.split('@')[0] || 'Guest')

// Quick commands (customizable per server)
const quickCommands = ref([
  {
    name: 'System Status',
    command: 'htop',
    icon: CpuChipIcon
  },
  {
    name: 'Disk Usage',
    command: 'df -h',
    icon: ChartBarIcon
  },
  {
    name: 'Running Services',
    command: 'systemctl list-units --type=service --state=running',
    icon: ArrowPathIcon
  },
  {
    name: 'Recent Logs',
    command: 'journalctl -n 50',
    icon: DocumentTextIcon
  },
  {
    name: 'Current Directory',
    command: 'ls -lah',
    icon: FolderOpenIcon
  }
])

// Palette commands (includes quick commands + other actions)
const paletteCommands = computed(() => {
  return [
    ...quickCommands.value,
    {
      name: 'Connect to Server',
      command: 'CONNECT',
      icon: ServerIcon,
      action: () => connectTerminal()
    },
    {
      name: 'Disconnect',
      command: 'DISCONNECT',
      icon: ServerIcon,
      action: () => disconnectTerminal()
    }
  ]
})

const filteredPaletteCommands = computed(() => {
  if (!paletteSearch.value) return paletteCommands.value

  const search = paletteSearch.value.toLowerCase()
  return paletteCommands.value.filter(cmd =>
    cmd.name.toLowerCase().includes(search) ||
    cmd.command.toLowerCase().includes(search)
  )
})

// Session timer
let sessionInterval = null

const startSessionTimer = () => {
  sessionStart.value = Date.now()

  sessionInterval = setInterval(() => {
    const elapsed = Date.now() - sessionStart.value
    const hours = Math.floor(elapsed / 3600000)
    const minutes = Math.floor((elapsed % 3600000) / 60000)
    const seconds = Math.floor((elapsed % 60000) / 1000)

    sessionDuration.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, 1000)
}

const stopSessionTimer = () => {
  if (sessionInterval) {
    clearInterval(sessionInterval)
    sessionInterval = null
  }
  sessionDuration.value = '00:00:00'
}

// Handle server selection
const handleServerSelected = (server) => {
  currentServer.value = server
  terminalConnected.value = false
  stopSessionTimer()
  
  // Give the Terminal component time to mount and initialize
  nextTick(() => {
    setTimeout(() => {
      if (autoConnect.value && terminalRef.value && terminalRef.value.connect) {
        connectTerminal()
      }
    }, 200) // Increase to 200ms
  })
}

// Terminal actions
const connectTerminal = () => {
  if (terminalRef.value && terminalRef.value.connect) {
    terminalRef.value.connect()
    terminalConnected.value = true
    startSessionTimer()
  } else {
    console.error('Terminal ref not available')
  }
}

const disconnectTerminal = () => {
  if (terminalRef.value) {
    terminalRef.value.disconnect()
  }
}

const clearTerminal = () => {
  if (terminalRef.value) {
    terminalRef.value.clearTerminal()
  }
}

const handleDisconnected = () => {
  terminalConnected.value = false
  stopSessionTimer()
}

const handleCommandExecuted = (command) => {
  // TODO: Save to command history in Firestore
  console.log('Command executed:', command)
}

const handlePathChanged = (path) => {
  console.log('Path changed:', path)
}

// Quick command execution
const executeQuickCommand = (command) => {
  if (terminalRef.value) {
    terminalRef.value.executeCommand(command)
    showQuickCommands.value = false
  }
}

// Command palette
const executePaletteCommand = (cmd) => {
  if (cmd.action) {
    cmd.action()
  } else if (terminalRef.value) {
    terminalRef.value.executeCommand(cmd.command)
  }
  showCommandPalette.value = false
  paletteSearch.value = ''
}

const executeFromPalette = () => {
  if (filteredPaletteCommands.value.length > 0) {
    executePaletteCommand(filteredPaletteCommands.value[0])
  } else if (paletteSearch.value.trim() && terminalRef.value) {
    terminalRef.value.executeCommand(paletteSearch.value.trim())
    showCommandPalette.value = false
    paletteSearch.value = ''
  }
}

const addCustomCommand = () => {
  const name = prompt('Command name:')
  const command = prompt('Command:')

  if (name && command) {
    quickCommands.value.push({
      name,
      command,
      icon: CommandLineIcon
    })

    // TODO: Save to Firestore
  }
}

// Keyboard shortcuts
const handleKeyboard = (e) => {
  // Ctrl+K or Cmd+K for command palette
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    showCommandPalette.value = true
    nextTick(() => {
      paletteInput.value?.focus()
    })
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('keydown', handleKeyboard)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard)
  stopSessionTimer()
})

// Watch command palette
watch(showCommandPalette, (show) => {
  if (show) {
    nextTick(() => {
      paletteInput.value?.focus()
    })
  } else {
    paletteSearch.value = ''
  }
})
</script>

<style scoped>
.dashboard {
  height: 100vh;
  background: #0d1117;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.breadcrumb {
  font-family: monospace;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e5e7eb;
}

.top-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #9ca3af;
  transition: all 0.2s;
}

.top-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.top-btn.active {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
}

.sidebar {
  width: 400px;
  flex-shrink: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  overflow-y: auto;
  overflow-x: hidden;
  background: rgba(0, 0, 0, 0.2);
}

.sidebar-right {
  width: 400px;
  flex-shrink: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  overflow-y: auto;
  overflow-x: hidden;
  background: rgba(0, 0, 0, 0.2);
}

.terminal-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s;
  min-height: 0;
  min-width: 0;
}

.terminal-area.full-width {
  width: 100%;
}

.demo-info-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: rgba(245, 158, 11, 0.05);
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
}

.no-server-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
}

.terminal-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.control-btn {
  padding: 4px 12px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.02);
  color: #9ca3af;
  transition: all 0.2s;
  font-size: 0.75rem;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e5e7eb;
}

.quick-commands-panel {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 320px;
  background: #161b22;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.panel-header button {
  font-size: 24px;
  line-height: 1;
  padding: 0 8px;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.quick-cmd-item {
  padding: 12px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-cmd-item:hover {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.add-cmd-btn {
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px dashed rgba(16, 185, 129, 0.3);
  border-radius: 6px;
  color: #10b981;
  font-family: monospace;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.add-cmd-btn:hover {
  background: rgba(16, 185, 129, 0.2);
  border-style: solid;
}

.btn-primary {
  padding: 12px 24px;
  background: #10b981;
  color: #0d1117;
  font-weight: 600;
  border-radius: 8px;
  font-family: monospace;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #059669;
  transform: translateY(-1px);
}

/* Command Palette */
.command-palette {
  width: 600px;
  max-width: 90vw;
  background: #161b22;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.palette-search {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.palette-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #e5e7eb;
  font-size: 1rem;
  font-family: monospace;
}

.palette-results {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

.palette-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.palette-item:hover {
  background: rgba(16, 185, 129, 0.1);
}

/* Transitions */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(-100%);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
</style>