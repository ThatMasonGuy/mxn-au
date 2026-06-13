<template>
  <div class="dashboard">
    <!-- COMMAND BAR -->
    <header class="command-bar">
      <!-- Left: rail toggle + breadcrumb -->
      <div class="cb-left">
        <button class="cb-icon" @click="toggleRail" :title="railCollapsed ? 'Show servers' : 'Hide servers'">
          <Bars3Icon class="w-5 h-5" />
        </button>
        <div class="breadcrumb">
          <span class="text-emerald-400">mxn.au</span>
          <span class="sep">/</span>
          <span>server</span>
          <template v-if="currentServer">
            <span class="sep">/</span>
            <span class="text-emerald-400">{{ currentServer.name }}</span>
          </template>
          <span v-if="currentServer && currentPath" class="path">{{ currentPath }}</span>
        </div>
      </div>

      <!-- Center: connection state -->
      <div class="cb-center">
        <template v-if="currentServer">
          <span class="conn-pill" :class="statusMeta.cls">
            <span class="conn-dot" :class="statusMeta.cls"></span>{{ statusMeta.label }}
          </span>
          <span v-if="isConnected" class="session">{{ sessionDuration }}</span>
        </template>
        <span v-else class="conn-pill warn">
          <span class="conn-dot warn"></span>Demo mode
        </span>
      </div>

      <!-- Right: actions -->
      <div class="cb-right">
        <template v-if="currentServer">
          <button v-if="!isConnected" class="cb-btn" @click="connect">CONNECT</button>
          <button v-else class="cb-btn danger" @click="disconnect">DISCONNECT</button>
          <button class="cb-icon" @click="clearTerminal" title="Clear terminal">
            <BackspaceIcon class="w-5 h-5" />
          </button>
        </template>

        <button class="cb-icon" @click="paletteOpen = true" title="Command palette (Ctrl+K)">
          <CommandLineIcon class="w-5 h-5" />
        </button>
        <button class="cb-icon" :class="{ active: aliasesOpen }" @click="toggleAliases" title="Aliases">
          <BookmarkIcon class="w-5 h-5" />
        </button>

        <div class="user">
          <span class="user-dot"></span>
          <span class="font-mono text-sm">{{ userName }}</span>
        </div>
      </div>
    </header>

    <!-- BODY -->
    <div class="body">
      <!-- Server rail (collapsible) -->
      <aside class="rail" :style="{ width: railCollapsed ? '56px' : '340px' }">
        <ServerManager ref="serverManagerRef" :collapsed="railCollapsed" @server-selected="handleServerSelected"
          @toggle="toggleRail" />
      </aside>

      <!-- Terminal area -->
      <main class="terminal-area">
        <Terminal v-if="currentServer" ref="terminalRef" :key="currentServer.id" :server-id="currentServer.id"
          :server-name="currentServer.name" :auto-connect="true" @status-change="onStatusChange"
          @command-executed="onCommandExecuted" @path-changed="handlePathChanged" />
        <DemoTerminal v-else />

        <!-- Aliases slide-over -->
        <div v-if="aliasesOpen" class="aliases-scrim" @click="toggleAliases"></div>
        <transition name="slide-left">
          <aside v-if="aliasesOpen" class="aliases-panel">
            <div class="panel-head">
              <span class="font-mono text-sm text-emerald-400">Aliases</span>
              <button @click="toggleAliases" class="panel-close" title="Close">×</button>
            </div>
            <div class="panel-body">
              <AliasManager />
            </div>
          </aside>
        </transition>
      </main>
    </div>

    <!-- Command palette -->
    <CommandPalette v-model:open="paletteOpen" :items="paletteItems" @select="handlePaletteSelect"
      @raw="handlePaletteRaw" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import {
  Bars3Icon,
  BackspaceIcon,
  CommandLineIcon,
  BookmarkIcon,
  PlayIcon,
  StopIcon,
  CpuChipIcon,
  ChartBarIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  FolderOpenIcon,
} from '@heroicons/vue/24/outline'
import Terminal from '@/features/server/components/Terminal.vue'
import DemoTerminal from '@/features/server/components/DemoTerminal.vue'
import ServerManager from '@/features/server/components/ServerManager.vue'
import AliasManager from '@/features/server/components/AliasManager.vue'
import CommandPalette from '@/features/server/components/CommandPalette.vue'
import { useDashboardUi } from '@/features/server/composables/useDashboardUi'
import { useServers } from '@/features/server/composables/useServers'
import { useAliases } from '@/features/server/composables/useAliases'
import { useMainStore } from '@/shared/stores/useMainStore'

// UI state (rail collapse, aliases panel)
const { isNarrow, railCollapsed, toggleRail, collapseRail, aliasesOpen, toggleAliases } = useDashboardUi()

// Server / alias data
const { updateServer } = useServers()
const { aliases, loadAliases } = useAliases()

// User
const mainStore = useMainStore()
const userName = computed(() => mainStore.user?.email?.split('@')[0] || 'Guest')

// Core state
const currentServer = ref(null)
const currentPath = ref('')
const connStatus = ref('disconnected') // connecting | connected | disconnected | error
const paletteOpen = ref(false)

// Refs
const terminalRef = ref(null)
const serverManagerRef = ref(null)

const isConnected = computed(() => connStatus.value === 'connected')

const statusMeta = computed(() => {
  switch (connStatus.value) {
    case 'connected': return { label: 'Connected', cls: 'on' }
    case 'connecting': return { label: 'Connecting…', cls: 'warn' }
    case 'error': return { label: 'Error', cls: 'err' }
    default: return { label: 'Disconnected', cls: 'off' }
  }
})

// ---- Quick commands (curated; custom reusable commands live in Aliases) ----
const quickCommands = [
  { name: 'System status', command: 'htop', icon: CpuChipIcon },
  { name: 'Disk usage', command: 'df -h', icon: ChartBarIcon },
  { name: 'Running services', command: 'systemctl list-units --type=service --state=running', icon: ArrowPathIcon },
  { name: 'Recent logs', command: 'journalctl -n 50', icon: DocumentTextIcon },
  { name: 'List directory', command: 'ls -lah', icon: FolderOpenIcon },
]

// ---- Unified command palette items ----
const paletteItems = computed(() => {
  const items = []

  for (const [i, cmd] of quickCommands.entries()) {
    items.push({
      id: `q-${i}`, group: 'Quick commands', label: cmd.name, hint: cmd.command,
      icon: cmd.icon, run: () => runCommand(cmd.command)
    })
  }

  for (const alias of aliases.value) {
    items.push({
      id: `a-${alias.id}`, group: 'Aliases', label: alias.name, hint: alias.command,
      icon: CommandLineIcon, run: () => runCommand(alias.command)
    })
  }

  if (currentServer.value) {
    if (isConnected.value) {
      items.push({ id: 'act-dc', group: 'Actions', label: 'Disconnect', icon: StopIcon, run: disconnect })
    } else {
      items.push({ id: 'act-c', group: 'Actions', label: 'Connect', icon: PlayIcon, run: connect })
    }
    items.push({ id: 'act-clear', group: 'Actions', label: 'Clear terminal', icon: BackspaceIcon, run: clearTerminal })
  }

  return items
})

// ---- Server selection ----
const handleServerSelected = (server) => {
  currentServer.value = server
  currentPath.value = ''
  connStatus.value = 'connecting'
  // On thin screens, collapse the rail so the terminal gets full width
  if (isNarrow.value) collapseRail()
}

// ---- Connection state (single source of truth, driven by Terminal emits) ----
const onStatusChange = (status) => {
  connStatus.value = status
  if (status === 'connected') {
    startSessionTimer()
    markConnected()
  } else {
    stopSessionTimer()
  }
}

const markConnected = async () => {
  if (!currentServer.value?.id) return
  try {
    await updateServer(currentServer.value.id, { lastConnected: new Date(), status: 'online' })
    // Refresh the rail so the status dot reflects the live connection
    serverManagerRef.value?.loadServers?.()
  } catch (error) {
    console.warn('Could not update server status:', error)
  }
}

const onCommandExecuted = () => { /* reserved for future command history */ }
const handlePathChanged = (path) => { currentPath.value = path }

// ---- Terminal actions ----
const connect = () => terminalRef.value?.connect()
const disconnect = () => terminalRef.value?.disconnect()
const clearTerminal = () => terminalRef.value?.clearTerminal()
const runCommand = (command) => {
  if (!currentServer.value) return
  terminalRef.value?.executeCommand(command)
}

// ---- Palette ----
const handlePaletteSelect = (item) => item.run?.()
const handlePaletteRaw = (text) => runCommand(text)

// ---- Session timer ----
const sessionDuration = ref('00:00:00')
let sessionStart = null
let sessionInterval = null

const startSessionTimer = () => {
  if (sessionInterval) return
  sessionStart = Date.now()
  sessionInterval = setInterval(() => {
    const elapsed = Date.now() - sessionStart
    const h = Math.floor(elapsed / 3600000)
    const m = Math.floor((elapsed % 3600000) / 60000)
    const s = Math.floor((elapsed % 60000) / 1000)
    sessionDuration.value = [h, m, s].map(n => String(n).padStart(2, '0')).join(':')
  }, 1000)
}

const stopSessionTimer = () => {
  if (sessionInterval) {
    clearInterval(sessionInterval)
    sessionInterval = null
  }
  sessionDuration.value = '00:00:00'
}

// ---- Keyboard ----
const handleKeyboard = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    paletteOpen.value = true
  }
}

onMounted(() => {
  loadAliases()
  window.addEventListener('keydown', handleKeyboard)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard)
  stopSessionTimer()
})
</script>

<style scoped>
.dashboard {
  height: 100vh;
  background: #0d1117;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #c9d1d9;
}

/* ---- Command bar ---- */
.command-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;
  background: #161b22;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.cb-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.cb-center {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.cb-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: flex-end;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  min-width: 0;
}

.breadcrumb .sep {
  color: #484f58;
}

.breadcrumb .path {
  color: #6e7681;
  font-size: 0.8rem;
  margin-left: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cb-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #8b949e;
  flex-shrink: 0;
  transition: all 0.15s;
}

.cb-icon:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #c9d1d9;
}

.cb-icon.active {
  background: rgba(63, 185, 80, 0.12);
  color: #3fb950;
}

.cb-btn {
  padding: 6px 14px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: #3fb950;
  background: rgba(63, 185, 80, 0.1);
  border: 1px solid rgba(63, 185, 80, 0.3);
  transition: all 0.15s;
}

.cb-btn:hover {
  background: rgba(63, 185, 80, 0.2);
}

.cb-btn.danger {
  color: #ff7b72;
  background: rgba(248, 81, 73, 0.1);
  border-color: rgba(248, 81, 73, 0.3);
}

.cb-btn.danger:hover {
  background: rgba(248, 81, 73, 0.2);
}

/* Connection pill */
.conn-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 12px;
  border-radius: 999px;
  font-family: monospace;
  font-size: 0.78rem;
  border: 1px solid transparent;
}

.conn-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.conn-pill.on {
  color: #3fb950;
  background: rgba(63, 185, 80, 0.12);
  border-color: rgba(63, 185, 80, 0.3);
}

.conn-dot.on {
  background: #3fb950;
  animation: pulse 1.8s ease-in-out infinite;
}

.conn-pill.warn {
  color: #d29922;
  background: rgba(210, 153, 34, 0.12);
  border-color: rgba(210, 153, 34, 0.3);
}

.conn-dot.warn {
  background: #d29922;
}

.conn-pill.err {
  color: #ff7b72;
  background: rgba(248, 81, 73, 0.12);
  border-color: rgba(248, 81, 73, 0.3);
}

.conn-dot.err {
  background: #ff7b72;
}

.conn-pill.off {
  color: #8b949e;
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.conn-dot.off {
  background: #6e7681;
}

.session {
  font-family: monospace;
  font-size: 0.75rem;
  color: #6e7681;
}

.user {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: #c9d1d9;
  margin-left: 4px;
}

.user-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3fb950;
}

/* ---- Body ---- */
.body {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
}

.rail {
  flex-shrink: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.18);
  overflow: hidden;
  transition: width 0.25s ease;
}

.terminal-area {
  flex: 1;
  position: relative;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* Aliases slide-over */
.aliases-scrim {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9;
}

.aliases-panel {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 400px;
  max-width: 90%;
  background: #0d1117;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.panel-close {
  font-size: 22px;
  line-height: 1;
  color: #8b949e;
  padding: 0 6px;
}

.panel-close:hover {
  color: #e5e7eb;
}

.panel-body {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.25s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
}
</style>
