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
          <template v-if="activeSession">
            <span class="sep">/</span>
            <span class="text-emerald-400">{{ activeSession.server.name }}</span>
          </template>
          <span v-if="activeSession && activeSession.path" class="path">{{ activeSession.path }}</span>
        </div>
      </div>

      <!-- Center: connection state -->
      <div class="cb-center">
        <template v-if="activeSession">
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
        <template v-if="activeSession">
          <button v-if="!isConnected" class="cb-btn" @click="connect">CONNECT</button>
          <button v-else class="cb-btn danger" @click="disconnect">DISCONNECT</button>
          <button class="cb-icon" @click="openSearch" title="Find (Ctrl+Shift+F)">
            <MagnifyingGlassIcon class="w-5 h-5" />
          </button>
          <button class="cb-icon" @click="clearActive" title="Clear terminal">
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
        <ServerManager ref="serverManagerRef" :collapsed="railCollapsed" @server-selected="openSession"
          @toggle="toggleRail" />
      </aside>

      <!-- Terminal area -->
      <main class="terminal-area">
        <!-- Tab strip -->
        <div v-if="sessions.length" class="tab-strip">
          <button v-for="s in sessions" :key="s.id" class="tab" :class="{ active: s.id === activeId }"
            @click="setActive(s.id)">
            <span class="tab-dot" :class="dotClass(s.status)"></span>
            <span class="tab-name">{{ s.server.name }}</span>
            <span class="tab-close" title="Close session" @click.stop="closeSession(s.id)">
              <XMarkIcon class="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

        <!-- Terminal panes (all mounted, only active shown) -->
        <div class="term-stack">
          <div v-for="s in sessions" :key="s.id" v-show="s.id === activeId" class="term-pane">
            <Terminal :ref="el => setTermRef(s.id, el)" :server-id="s.server.id" :server-name="s.server.name"
              :auto-connect="true" @status-change="(st) => onStatusChange(s.id, st)"
              @path-changed="(p) => onPathChanged(s.id, p)" />
          </div>

          <DemoTerminal v-if="!sessions.length" />

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
        </div>
      </main>
    </div>

    <!-- Command palette -->
    <CommandPalette v-model:open="paletteOpen" :items="paletteItems" @select="handlePaletteSelect"
      @raw="handlePaletteRaw" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import {
  Bars3Icon, BackspaceIcon, CommandLineIcon, BookmarkIcon, MagnifyingGlassIcon, XMarkIcon,
  PlayIcon, StopIcon, CpuChipIcon, ChartBarIcon, ArrowPathIcon, DocumentTextIcon, FolderOpenIcon,
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

const { isNarrow, railCollapsed, toggleRail, collapseRail, aliasesOpen, toggleAliases } = useDashboardUi()
const { updateServer } = useServers()
const { aliases, loadAliases } = useAliases()

const mainStore = useMainStore()
const userName = computed(() => mainStore.user?.email?.split('@')[0] || 'Guest')

// ---- Sessions (tabs) ----
// session = { id, server, status, path, startedAt, marked }
const sessions = ref([])
const activeId = ref(null)
const paletteOpen = ref(false)
const serverManagerRef = ref(null)

// Non-reactive map of session id -> Terminal component instance
const termRefs = new Map()
const setTermRef = (id, el) => {
  if (el) termRefs.set(id, el)
  else termRefs.delete(id)
}
const activeTerm = () => termRefs.get(activeId.value)

const activeSession = computed(() => sessions.value.find(s => s.id === activeId.value) || null)
const isConnected = computed(() => activeSession.value?.status === 'connected')

const statusMeta = computed(() => {
  switch (activeSession.value?.status) {
    case 'connected': return { label: 'Connected', cls: 'on' }
    case 'connecting': return { label: 'Connecting…', cls: 'warn' }
    case 'reconnecting': return { label: 'Reconnecting…', cls: 'warn' }
    case 'error': return { label: 'Error', cls: 'err' }
    default: return { label: 'Disconnected', cls: 'off' }
  }
})

const dotClass = (status) => {
  if (status === 'connected') return 'on'
  if (status === 'connecting' || status === 'reconnecting') return 'warn'
  if (status === 'error') return 'err'
  return 'off'
}

// ---- Open / close / switch sessions ----
const openSession = (server) => {
  const id = crypto.randomUUID()
  sessions.value.push({ id, server, status: 'connecting', path: '', startedAt: null, marked: false })
  activeId.value = id
  if (isNarrow.value) collapseRail()
}

const setActive = (id) => {
  activeId.value = id
}

const closeSession = (id) => {
  termRefs.get(id)?.disconnect()
  const idx = sessions.value.findIndex(s => s.id === id)
  if (idx === -1) return
  sessions.value.splice(idx, 1)
  if (activeId.value === id) {
    activeId.value = sessions.value[Math.min(idx, sessions.value.length - 1)]?.id ?? null
  }
}

// Refit a tab when it becomes visible (it was display:none while hidden)
watch(activeId, (id) => {
  if (!id) return
  nextTick(() => termRefs.get(id)?.refit())
})

// ---- Per-session connection state ----
const onStatusChange = (id, status) => {
  const s = sessions.value.find(x => x.id === id)
  if (!s) return
  s.status = status
  if (status === 'connected') {
    if (!s.startedAt) s.startedAt = Date.now()
    if (!s.marked) {
      s.marked = true
      markConnected(s)
    }
  } else if (status === 'disconnected') {
    s.startedAt = null
  }
}

const onPathChanged = (id, path) => {
  const s = sessions.value.find(x => x.id === id)
  if (s) s.path = path
}

const markConnected = async (session) => {
  try {
    await updateServer(session.server.id, { lastConnected: new Date(), status: 'online' })
    serverManagerRef.value?.loadServers?.()
  } catch (error) {
    console.warn('Could not update server status:', error)
  }
}

// ---- Active-terminal actions ----
const connect = () => activeTerm()?.connect()
const disconnect = () => activeTerm()?.disconnect()
const clearActive = () => activeTerm()?.clearTerminal()
const openSearch = () => activeTerm()?.openSearch()
const runCommand = (command) => {
  if (activeSession.value) activeTerm()?.executeCommand(command)
}

// ---- Quick commands + palette ----
const quickCommands = [
  { name: 'System status', command: 'htop', icon: CpuChipIcon },
  { name: 'Disk usage', command: 'df -h', icon: ChartBarIcon },
  { name: 'Running services', command: 'systemctl list-units --type=service --state=running', icon: ArrowPathIcon },
  { name: 'Recent logs', command: 'journalctl -n 50', icon: DocumentTextIcon },
  { name: 'List directory', command: 'ls -lah', icon: FolderOpenIcon },
]

const paletteItems = computed(() => {
  const items = []
  for (const [i, cmd] of quickCommands.entries()) {
    items.push({ id: `q-${i}`, group: 'Quick commands', label: cmd.name, hint: cmd.command, icon: cmd.icon, run: () => runCommand(cmd.command) })
  }
  for (const alias of aliases.value) {
    items.push({ id: `a-${alias.id}`, group: 'Aliases', label: alias.name, hint: alias.command, icon: CommandLineIcon, run: () => runCommand(alias.command) })
  }
  if (activeSession.value) {
    if (isConnected.value) {
      items.push({ id: 'act-dc', group: 'Actions', label: 'Disconnect', icon: StopIcon, run: disconnect })
    } else {
      items.push({ id: 'act-c', group: 'Actions', label: 'Connect', icon: PlayIcon, run: connect })
    }
    items.push({ id: 'act-search', group: 'Actions', label: 'Find in terminal', icon: MagnifyingGlassIcon, run: openSearch })
    items.push({ id: 'act-clear', group: 'Actions', label: 'Clear terminal', icon: BackspaceIcon, run: clearActive })
  }
  return items
})

const handlePaletteSelect = (item) => item.run?.()
const handlePaletteRaw = (text) => runCommand(text)

// ---- Session timer (active session) ----
const nowTick = ref(Date.now())
let tickInterval = null

const sessionDuration = computed(() => {
  const s = activeSession.value
  if (!s || s.status !== 'connected' || !s.startedAt) return '00:00:00'
  const elapsed = nowTick.value - s.startedAt
  const h = Math.floor(elapsed / 3600000)
  const m = Math.floor((elapsed % 3600000) / 60000)
  const sec = Math.floor((elapsed % 60000) / 1000)
  return [h, m, sec].map(n => String(n).padStart(2, '0')).join(':')
})

// ---- Keyboard ----
const handleKeyboard = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    paletteOpen.value = true
  }
}

onMounted(() => {
  loadAliases()
  tickInterval = setInterval(() => { nowTick.value = Date.now() }, 1000)
  window.addEventListener('keydown', handleKeyboard)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard)
  if (tickInterval) clearInterval(tickInterval)
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
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* ---- Tabs ---- */
.tab-strip {
  display: flex;
  align-items: stretch;
  gap: 2px;
  padding: 6px 8px 0;
  background: #0d1117;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  overflow-x: auto;
  flex-shrink: 0;
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px 8px;
  border-radius: 8px 8px 0 0;
  border: 1px solid transparent;
  border-bottom: none;
  color: #8b949e;
  font-family: monospace;
  font-size: 0.8rem;
  white-space: nowrap;
  transition: all 0.15s;
}

.tab:hover {
  background: rgba(255, 255, 255, 0.03);
  color: #c9d1d9;
}

.tab.active {
  background: #0d1117;
  border-color: rgba(255, 255, 255, 0.08);
  color: #e5e7eb;
  position: relative;
}

.tab.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: #3fb950;
}

.tab-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tab-dot.on {
  background: #3fb950;
}

.tab-dot.warn {
  background: #d29922;
}

.tab-dot.err {
  background: #ff7b72;
}

.tab-dot.off {
  background: #6e7681;
}

.tab-name {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  color: #6e7681;
  flex-shrink: 0;
}

.tab-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e5e7eb;
}

.term-stack {
  flex: 1;
  position: relative;
  min-height: 0;
}

.term-pane {
  position: absolute;
  inset: 0;
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
