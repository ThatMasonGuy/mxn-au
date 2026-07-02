<template>
  <div class="terminal-container">
    <!-- Search overlay -->
    <transition name="search-fade">
      <div v-if="searchOpen" class="term-search">
        <MagnifyingGlassIcon class="w-4 h-4 text-gray-500 flex-shrink-0" />
        <input ref="searchInput" v-model="searchTerm" type="text" class="term-search-input" placeholder="Find"
          @input="searchNext(false)" @keydown.enter.prevent="$event.shiftKey ? searchPrev() : searchNext()"
          @keydown.esc.prevent="closeSearch" />
        <span class="term-search-count">{{ searchCount }}</span>
        <button class="term-search-btn" @click="searchPrev" title="Previous (Shift+Enter)">
          <ChevronUpIcon class="w-4 h-4" />
        </button>
        <button class="term-search-btn" @click="searchNext()" title="Next (Enter)">
          <ChevronDownIcon class="w-4 h-4" />
        </button>
        <button class="term-search-btn" @click="closeSearch" title="Close (Esc)">
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
    </transition>

    <!-- Terminal Display -->
    <div ref="terminalRef" class="terminal-display"></div>

    <!-- File Editor Modal -->
    <FileEditor :is-open="showFileEditor" :filename="editingFile.name" :filepath="editingFile.path"
      :initial-content="editingFile.content" :is-new="editingFile.isNew" @close="handleEditorClose"
      @save="handleFileSave" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { SearchAddon } from 'xterm-addon-search'
import { Unicode11Addon } from 'xterm-addon-unicode11'
import { WebglAddon } from 'xterm-addon-webgl'
import { toast } from 'vue-sonner'
import { getAuth } from 'firebase/auth'
import {
  MagnifyingGlassIcon, ChevronUpIcon, ChevronDownIcon, XMarkIcon
} from '@heroicons/vue/24/outline'
import FileEditor from '@/features/server/components/FileEditor.vue'
import { useTerminalPrefs } from '@/features/server/composables/useTerminalPrefs'
import 'xterm/css/xterm.css'

const props = defineProps({
  serverId: String,
  serverName: String,
  autoConnect: {
    type: Boolean,
    default: false
  }
})

// statusChange payloads: 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error'
const emit = defineEmits(['commandExecuted', 'disconnected', 'pathChanged', 'statusChange'])

const { fontSize, zoomIn, zoomOut, zoomReset } = useTerminalPrefs()

// Refs
const terminalRef = ref(null)
const terminal = ref(null)
const fitAddon = ref(null)
const searchAddon = ref(null)
const ws = ref(null)
const connected = ref(false)
const currentPath = ref('~')
let keyHandlerDisposable = null
let resizeObserver = null

// Search state
const searchOpen = ref(false)
const searchTerm = ref('')
const searchCount = ref('')
const searchInput = ref(null)
const searchOptions = {
  decorations: {
    matchBackground: '#5a4a00',
    matchOverviewRuler: '#d29922',
    activeMatchBackground: '#3fb950',
    activeMatchColorOverviewRuler: '#3fb950',
  }
}

// Auto-reconnect state
const MAX_RECONNECT = 4
let reconnectAttempts = 0
let reconnectTimer = null
let userClosed = false

// File Editor state
const showFileEditor = ref(false)
const editingFile = ref({ name: '', path: '', content: '', isNew: false })

onMounted(() => {
  if (terminal.value) return
  initTerminal()
  if (props.autoConnect) connect()
})

onUnmounted(() => {
  cleanup()
})

// React to shared font-size changes (zoom from any terminal)
watch(fontSize, (size) => {
  if (terminal.value) {
    terminal.value.options.fontSize = size
    refit()
  }
})

const initTerminal = () => {
  terminal.value = new Terminal({
    cursorBlink: true,
    fontSize: fontSize.value,
    fontFamily: '"Cascadia Code", "Fira Code", "Consolas", monospace',
    theme: {
      background: '#0d1117',
      foreground: '#c9d1d9',
      cursor: '#10b981',
      selectionBackground: '#264f78',
      black: '#484f58',
      red: '#ff7b72',
      green: '#3fb950',
      yellow: '#d29922',
      blue: '#58a6ff',
      magenta: '#bc8cff',
      cyan: '#39c5cf',
      white: '#b1bac4',
      brightBlack: '#6e7681',
      brightRed: '#ffa198',
      brightGreen: '#56d364',
      brightYellow: '#e3b341',
      brightBlue: '#79c0ff',
      brightMagenta: '#d2a8ff',
      brightCyan: '#56d4dd',
      brightWhite: '#f0f6fc',
    },
    allowProposedApi: true,
    allowTransparency: true,
    scrollback: 10000,
  })

  // Addons that can load before open
  fitAddon.value = new FitAddon()
  terminal.value.loadAddon(fitAddon.value)
  terminal.value.loadAddon(new WebLinksAddon())

  searchAddon.value = new SearchAddon()
  terminal.value.loadAddon(searchAddon.value)
  searchAddon.value.onDidChangeResults(({ resultIndex, resultCount }) => {
    searchCount.value = resultCount === 0 ? 'No results' : `${resultIndex + 1}/${resultCount}`
  })

  const unicode = new Unicode11Addon()
  terminal.value.loadAddon(unicode)
  terminal.value.unicode.activeVersion = '11'

  terminal.value.open(terminalRef.value)

  // WebGL must load after open; fall back to DOM if unavailable
  try {
    const webgl = new WebglAddon()
    webgl.onContextLoss(() => webgl.dispose())
    terminal.value.loadAddon(webgl)
  } catch {
    // DOM renderer fallback — nothing to do
  }

  setTimeout(() => fitAddon.value.fit(), 0)

  window.addEventListener('resize', handleResize)
  resizeObserver = new ResizeObserver(() => handleResize())
  resizeObserver.observe(terminalRef.value)

  terminal.value.onData(handleTerminalData)

  if (keyHandlerDisposable) keyHandlerDisposable.dispose()
  keyHandlerDisposable = terminal.value.attachCustomKeyEventHandler(handleKeyEvent)

  terminal.value.writeln('\x1b[1;32m╔══════════════════════════════════════════╗\x1b[0m')
  terminal.value.writeln('\x1b[1;32m║\x1b[0m    🚀 MXN.AU Server SSH Portal           \x1b[1;32m║\x1b[0m')
  terminal.value.writeln('\x1b[1;32m╚══════════════════════════════════════════╝\x1b[0m')
  terminal.value.writeln('')
  terminal.value.writeln('\x1b[33mReady to connect...\x1b[0m')
  terminal.value.writeln('')
}

const connect = async () => {
  if (!terminal.value) {
    console.error('Terminal not initialized yet')
    return
  }
  if (ws.value) {
    terminal.value.writeln('\x1b[33mAlready connected\x1b[0m')
    return
  }

  userClosed = false
  emit('statusChange', 'connecting')
  terminal.value.writeln('\x1b[36mConnecting to server...\x1b[0m')

  const wsUrl = import.meta.env.VITE_SSH_WS_URL || 'ws://localhost:3001'
  ws.value = new WebSocket(wsUrl)

  let keepAliveInterval = null

  ws.value.onopen = async () => {
    connected.value = true
    reconnectAttempts = 0
    emit('statusChange', 'connected')
    terminal.value.writeln('\x1b[32m✓ Connected!\x1b[0m')
    terminal.value.writeln('')

    keepAliveInterval = setInterval(() => {
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        ws.value.send(JSON.stringify({ type: 'ping' }))
      }
    }, 25000)

    try {
      const auth = getAuth()
      if (!auth.currentUser) {
        terminal.value.writeln('\x1b[31m✗ Not logged in\x1b[0m')
        userClosed = true
        ws.value.close()
        return
      }
      const token = await auth.currentUser.getIdToken()
      ws.value.send(JSON.stringify({
        type: 'auth',
        serverId: props.serverId,
        token,
        terminalInfo: { term: 'xterm-256color', cols: terminal.value.cols || 80, rows: terminal.value.rows || 24 }
      }))
      setTimeout(() => handleResize(), 500)
    } catch (error) {
      terminal.value.writeln('\x1b[31m✗ Failed to get auth token\x1b[0m')
      console.error('Auth token error:', error)
      userClosed = true
      ws.value.close()
    }
  }

  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'output') {
      terminal.value.write(data.data)
      extractPath(data.data)
    } else if (data.type === 'error') {
      terminal.value.writeln(`\x1b[31m✗ ${data.message}\x1b[0m`)
    } else if (data.type === 'file-content') {
      if (data.isNew) terminal.value.writeln('[New File]')
      openFileEditor(data.filename, data.filepath, data.content, data.isNew)
    } else if (data.type === 'file-saved') {
      terminal.value.writeln(`File saved: ${data.filepath}`)
      toast.success('File saved!')
    } else if (data.type === 'file-error') {
      terminal.value.writeln(`\x1b[31m✗ File error: ${data.message}\x1b[0m`)
    } else if (data.type === 'pong') {
      // keepalive
    }
  }

  ws.value.onerror = (error) => {
    emit('statusChange', 'error')
    console.error('WebSocket error:', error)
  }

  ws.value.onclose = () => {
    if (keepAliveInterval) clearInterval(keepAliveInterval)
    connected.value = false
    ws.value = null

    if (!userClosed && reconnectAttempts < MAX_RECONNECT) {
      reconnectAttempts++
      const delay = Math.min(8000, 1000 * 2 ** (reconnectAttempts - 1))
      emit('statusChange', 'reconnecting')
      terminal.value.writeln(`\x1b[33m⚠ Connection lost — reconnecting (#${reconnectAttempts}) in ${delay / 1000}s…\x1b[0m`)
      reconnectTimer = setTimeout(() => connect(), delay)
    } else {
      emit('statusChange', 'disconnected')
      emit('disconnected')
      terminal.value.writeln('')
      terminal.value.writeln('\x1b[33m⚠ Connection closed\x1b[0m')
    }
  }
}

const disconnect = () => {
  userClosed = true
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (ws.value) {
    ws.value.close()
  } else {
    // Already closed (e.g. cancelling a pending reconnect)
    emit('statusChange', 'disconnected')
    emit('disconnected')
  }
}

const handleTerminalData = (data) => {
  if (!connected.value) {
    terminal.value.write('\x1b[31mNot connected\x1b[0m\r\n')
    return
  }

  // Intercept Enter to check for an `edit <file>` pseudo-command
  if (data === '\r' || data === '\n') {
    const buffer = terminal.value.buffer.active
    const cursorY = buffer.baseY + buffer.cursorY
    const line = buffer.getLine(cursorY)

    if (line) {
      let lineText = ''
      for (let i = 0; i < line.length; i++) {
        const cell = line.getCell(i)
        if (cell) lineText += cell.getChars()
      }
      const cleanText = lineText.replace(/^.*[$#>]\s*/, '').trim()
      const editMatch = cleanText.match(/^edit\s+(.+)$/)
      if (editMatch) {
        terminal.value.write('\r\n')
        handleEditCommand(editMatch[1].trim())
        return
      }
    }
  }

  ws.value.send(JSON.stringify({ type: 'input', data }))
}

const handleKeyEvent = (event) => {
  if (event.type !== 'keydown') return true

  // Font zoom (also stops browser zoom)
  if (event.ctrlKey && (event.key === '+' || event.key === '=')) {
    event.preventDefault(); zoomIn(); return false
  }
  if (event.ctrlKey && event.key === '-') {
    event.preventDefault(); zoomOut(); return false
  }
  if (event.ctrlKey && event.key === '0') {
    event.preventDefault(); zoomReset(); return false
  }

  // Search
  if (event.ctrlKey && event.shiftKey && (event.key === 'F' || event.key === 'f')) {
    event.preventDefault(); openSearch(); return false
  }

  // Copy selected terminal text without sending Ctrl+C to the remote shell.
  if (event.ctrlKey && !event.altKey && !event.metaKey && (event.key === 'c' || event.key === 'C')) {
    if (copyTerminalSelection()) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }

    // Ctrl+Shift+C is a copy shortcut only; plain Ctrl+C with no selection stays an interrupt.
    if (event.shiftKey) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
  }

  // Paste through xterm so multiline input stays one bracketed-paste payload.
  if (event.ctrlKey && !event.altKey && !event.metaKey && (event.key === 'v' || event.key === 'V')) {
    event.preventDefault()
    event.stopPropagation()
    pasteFromClipboard()
    return false
  }

  // Plain Ctrl+C with no selection is handled by xterm as ETX / interrupt.
  return true
}

const copyTerminalSelection = () => {
  const selection = terminal.value?.getSelection()
  if (!selection) return false

  copyTextToClipboard(selection)
  return true
}

const copyTextToClipboard = async (text) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return
    }
  } catch {
    // Fall through to the textarea fallback.
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  try {
    document.execCommand('copy')
  } catch {
    // Clipboard access can be blocked outside a user gesture or secure context.
  } finally {
    document.body.removeChild(textarea)
    terminal.value?.focus()
  }
}

const pasteFromClipboard = () => {
  if (!connected.value || !terminal.value || !navigator.clipboard?.readText) return

  navigator.clipboard.readText().then(text => {
    if (connected.value && text) terminal.value?.paste(text)
  }).catch(() => { })
}

// ---- Search ----
const openSearch = () => {
  searchOpen.value = true
  nextTick(() => {
    searchInput.value?.focus()
    searchInput.value?.select()
  })
}

const closeSearch = () => {
  searchOpen.value = false
  searchCount.value = ''
  searchAddon.value?.clearDecorations()
  terminal.value?.focus()
}

const searchNext = (incremental = false) => {
  if (!searchTerm.value) {
    searchAddon.value?.clearDecorations()
    searchCount.value = ''
    return
  }
  searchAddon.value?.findNext(searchTerm.value, { ...searchOptions, incremental })
}

const searchPrev = () => {
  if (!searchTerm.value) return
  searchAddon.value?.findPrevious(searchTerm.value, searchOptions)
}

const executeCommand = (cmd) => {
  if (!connected.value) {
    connect()
    setTimeout(() => {
      ws.value?.send(JSON.stringify({ type: 'input', data: cmd + '\r' }))
    }, 500)
  } else {
    ws.value?.send(JSON.stringify({ type: 'input', data: cmd + '\r' }))
  }
  emit('commandExecuted', cmd)
}

const clearTerminal = () => terminal.value.clear()

let resizeTimeout = null
const handleResize = () => {
  if (!fitAddon.value || !terminal.value) return
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    try { fitAddon.value.fit() } catch { /* element not visible */ }
    if (connected.value && ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify({ type: 'resize', cols: terminal.value.cols, rows: terminal.value.rows }))
    }
  }, 100)
}

// Immediate fit + focus (used when a tab becomes visible)
const refit = () => {
  if (!fitAddon.value || !terminal.value) return
  nextTick(() => {
    try { fitAddon.value.fit() } catch { /* not visible */ }
    if (connected.value && ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify({ type: 'resize', cols: terminal.value.cols, rows: terminal.value.rows }))
    }
    terminal.value.focus()
  })
}

const extractPath = (output) => {
  const cleanOutput = output.replace(/\x1b\[[0-9;]*m/g, '')
  const pathMatch = cleanOutput.match(/:\s*([~\/][\w\/.-]*)\s*[$#>]/)
  if (pathMatch) {
    const newPath = pathMatch[1]
    if (newPath !== currentPath.value) {
      currentPath.value = newPath
      emit('pathChanged', newPath)
    }
  }
}

// ---- File Editor ----
const handleEditCommand = (filename) => {
  if (!connected.value || !ws.value) {
    terminal.value.writeln('\x1b[31m✗ Not connected\x1b[0m')
    return
  }
  ws.value.send(JSON.stringify({ type: 'read-file', filename, path: currentPath.value }))
}

const openFileEditor = (filename, filepath, content, isNew = false) => {
  terminal.value.writeln(`Opened ${filename} in editor`)
  editingFile.value = { name: filename, path: filepath, content, isNew }
  showFileEditor.value = true
}

const handleEditorClose = () => {
  showFileEditor.value = false
  if (connected.value && ws.value) {
    ws.value.send(JSON.stringify({ type: 'input', data: '\x03' }))
  }
  setTimeout(() => terminal.value?.focus(), 100)
}

const handleFileSave = async ({ filepath, content }) => {
  if (!connected.value || !ws.value) {
    terminal.value.writeln('\x1b[31m✗ Not connected\x1b[0m')
    return
  }
  ws.value.send(JSON.stringify({ type: 'write-file', filepath, content }))
}

const cleanup = () => {
  userClosed = true
  if (reconnectTimer) clearTimeout(reconnectTimer)
  window.removeEventListener('resize', handleResize)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (keyHandlerDisposable) {
    keyHandlerDisposable.dispose()
    keyHandlerDisposable = null
  }
  if (ws.value) ws.value.close()
  terminal.value?.dispose()
}

defineExpose({
  connect,
  disconnect,
  clearTerminal,
  executeCommand,
  refit,
  openSearch,
  focus: () => terminal.value?.focus()
})
</script>

<style scoped>
.terminal-container {
  position: relative;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background: #0d1117;
  overflow: hidden;
}

.terminal-display {
  flex: 1;
  overflow: hidden;
  min-height: 0;
  position: relative;
}

.terminal-display :deep(.xterm) {
  padding: 8px 12px;
  height: 100% !important;
}

.terminal-display :deep(.xterm-viewport) {
  overflow-y: auto !important;
}

/* Search overlay */
.term-search {
  position: absolute;
  top: 10px;
  right: 16px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: #161b22;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
}

.term-search-input {
  width: 180px;
  background: transparent;
  border: none;
  outline: none;
  color: #e5e7eb;
  font-family: monospace;
  font-size: 0.85rem;
}

.term-search-count {
  font-family: monospace;
  font-size: 0.7rem;
  color: #6e7681;
  min-width: 48px;
  text-align: right;
}

.term-search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 5px;
  color: #8b949e;
  transition: all 0.15s;
}

.term-search-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #c9d1d9;
}

.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
