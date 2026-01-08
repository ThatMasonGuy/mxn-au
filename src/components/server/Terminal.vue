<template>
  <div class="terminal-container">
    <!-- Terminal Header -->
    <div class="terminal-header">
      <div class="flex items-center gap-3">
        <div class="flex gap-1.5">
          <div class="h-3 w-3 rounded-full bg-red-500/80 cursor-pointer hover:bg-red-500" @click="disconnect"
            title="Disconnect"></div>
          <div class="h-3 w-3 rounded-full bg-yellow-500/80"></div>
          <div class="h-3 w-3 rounded-full bg-emerald-500/80 animate-pulse" v-if="connected"></div>
          <div class="h-3 w-3 rounded-full bg-gray-500/80" v-else></div>
        </div>

        <div class="flex items-center gap-2 text-sm font-mono">
          <span class="text-emerald-400">{{ serverName }}</span>
          <span class="text-gray-500" v-if="currentPath">{{ currentPath }}</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Connection status -->
        <div class="text-xs font-mono px-2 py-1 rounded"
          :class="connected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'">
          {{ connected ? 'CONNECTED' : 'DISCONNECTED' }}
        </div>

        <!-- Clear terminal -->
        <button @click="clearTerminal"
          class="text-xs font-mono px-2 py-1 rounded hover:bg-white/5 text-gray-400 hover:text-gray-200"
          title="Clear terminal">
          CLEAR
        </button>
      </div>
    </div>

    <!-- Terminal Display -->
    <div ref="terminalRef" class="terminal-display"></div>

    <!-- Command History Sidebar (toggleable) -->
    <transition name="slide">
      <div v-if="showHistory" class="history-sidebar">
        <div class="history-header">
          <span class="font-mono text-sm text-emerald-400">Command History</span>
          <button @click="showHistory = false" class="text-gray-400 hover:text-gray-200">×</button>
        </div>

        <div class="history-list">
          <div v-for="(cmd, idx) in commandHistory" :key="idx" @click="executeCommand(cmd)" class="history-item">
            <span class="font-mono text-xs">{{ cmd }}</span>
          </div>

          <div v-if="commandHistory.length === 0" class="text-center text-gray-500 text-sm py-8">
            No command history yet
          </div>
        </div>
      </div>
    </transition>

    <!-- History Toggle Button -->
    <button @click="showHistory = !showHistory" class="history-toggle" :class="{ 'active': showHistory }">
      <span class="font-mono text-xs">HISTORY</span>
    </button>

    <!-- File Editor Modal -->
    <FileEditor :is-open="showFileEditor" :filename="editingFile.name" :filepath="editingFile.path"
      :initial-content="editingFile.content" :is-new="editingFile.isNew" @close="handleEditorClose"
      @save="handleFileSave" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { toast } from 'vue-sonner'
import { getAuth } from 'firebase/auth'
import FileEditor from '@/components/server/FileEditor.vue'
import 'xterm/css/xterm.css'

const props = defineProps({
  serverId: String,
  serverName: String,
  autoConnect: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['commandExecuted', 'disconnected', 'pathChanged'])

// Refs
const terminalRef = ref(null)
const terminal = ref(null)
const fitAddon = ref(null)
const ws = ref(null)
const connected = ref(false)
const showHistory = ref(false)
const commandHistory = ref([])
const currentPath = ref('~')
let keyHandlerDisposable = null
let resizeObserver = null

// File Editor state
const showFileEditor = ref(false)
const editingFile = ref({
  name: '',
  path: '',
  content: '',
  isNew: false
})

// Terminal setup
onMounted(() => {
  if (terminal.value) {
    return
  }
  initTerminal()

  if (props.autoConnect) {
    connect()
  }
})

onUnmounted(() => {
  cleanup()
})

const initTerminal = () => {
  // Create terminal instance
  terminal.value = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: '"Cascadia Code", "Fira Code", "Consolas", monospace',
    theme: {
      background: '#0d1117',
      foreground: '#c9d1d9',
      cursor: '#10b981',
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
    allowTransparency: true,
    scrollback: 10000,
  })

  // Add fit addon
  fitAddon.value = new FitAddon()
  terminal.value.loadAddon(fitAddon.value)

  // Add web links addon
  terminal.value.loadAddon(new WebLinksAddon())

  // Open terminal
  terminal.value.open(terminalRef.value)

  // Fit terminal to container - delay to ensure DOM is ready
  setTimeout(() => {
    fitAddon.value.fit()
  }, 0)

  // Handle resize
  window.addEventListener('resize', handleResize)

  // Watch for container size changes
  resizeObserver = new ResizeObserver(() => {
    handleResize()
  })
  resizeObserver.observe(terminalRef.value)

  // Handle terminal data (user input)
  terminal.value.onData(handleTerminalData)

  // Handle paste
  if (keyHandlerDisposable) {
    keyHandlerDisposable.dispose()
  }
  keyHandlerDisposable = terminal.value.attachCustomKeyEventHandler(handleKeyEvent)

  // Welcome message
  terminal.value.writeln('\x1b[1;32m╔══════════════════════════════════════════╗\x1b[0m')
  terminal.value.writeln('\x1b[1;32m║\x1b[0m    🚀 MXN.AU Server SSH Portal            \x1b[1;32m║\x1b[0m')
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

  terminal.value.writeln('\x1b[36mConnecting to server...\x1b[0m')

  const wsUrl = import.meta.env.VITE_SSH_WS_URL || 'ws://localhost:3001'

  ws.value = new WebSocket(wsUrl)

  // ADD KEEPALIVE
  let keepAliveInterval = null

  ws.value.onopen = async () => {
    connected.value = true
    terminal.value.writeln('\x1b[32m✓ Connected!\x1b[0m')
    terminal.value.writeln('')

    // Start keepalive
    keepAliveInterval = setInterval(() => {
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        ws.value.send(JSON.stringify({ type: 'ping' }))
      }
    }, 25000) // Ping every 25 seconds

    // Get Firebase token from Firebase Auth directly
    try {
      const auth = getAuth()
      if (!auth.currentUser) {
        terminal.value.writeln('\x1b[31m✗ Not logged in\x1b[0m')
        ws.value.close()
        return
      }

      const token = await auth.currentUser.getIdToken()

      const terminalInfo = {
        term: 'xterm-256color',
        cols: terminal.value.cols || 80,
        rows: terminal.value.rows || 24
      }

      // Send auth with terminal info
      ws.value.send(JSON.stringify({
        type: 'auth',
        serverId: props.serverId,
        token: token,
        terminalInfo: terminalInfo
      }))

      // Send resize after auth
      setTimeout(() => handleResize(), 500)
    } catch (error) {
      terminal.value.writeln('\x1b[31m✗ Failed to get auth token\x1b[0m')
      console.error('Auth token error:', error)
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
      // [New File] if new
      if (data.isNew) {
        terminal.value.writeln('[New File]')
      }
      // Open the editor
      openFileEditor(data.filename, data.filepath, data.content, data.isNew)
    } else if (data.type === 'file-saved') {
      // "File saved: {expanded name}"
      terminal.value.writeln(`File saved: ${data.filepath}`)
      toast.success('File saved!')
    } else if (data.type === 'file-error') {
      terminal.value.writeln(`\x1b[31m✗ File error: ${data.message}\x1b[0m`)
    } else if (data.type === 'pong') {
      // Keepalive response
    }
  }

  ws.value.onerror = (error) => {
    terminal.value.writeln(`\x1b[31m✗ Connection error\x1b[0m`)
    console.error('WebSocket error:', error)
  }

  ws.value.onclose = () => {
    if (keepAliveInterval) clearInterval(keepAliveInterval)
    connected.value = false
    terminal.value.writeln('')
    terminal.value.writeln('\x1b[33m⚠ Connection closed\x1b[0m')
    ws.value = null
    emit('disconnected')
  }
}

const disconnect = () => {
  if (ws.value) {
    ws.value.close()
    ws.value = null
    connected.value = false
  }
}

const handleTerminalData = (data) => {
  if (!connected.value) {
    terminal.value.write('\x1b[31mNot connected\x1b[0m\r\n')
    return
  }

  // Intercept Enter key to check for edit command
  if (data === '\r' || data === '\n') {
    // Get the current line from terminal buffer
    const buffer = terminal.value.buffer.active
    const cursorY = buffer.cursorY
    const line = buffer.getLine(cursorY)

    if (line) {
      // Extract text from the line
      let lineText = ''
      for (let i = 0; i < line.length; i++) {
        const cell = line.getCell(i)
        if (cell) {
          lineText += cell.getChars()
        }
      }

      // Clean up the line text (remove prompt)
      // Match common prompts: user@host:path$ or user@host:path#
      const cleanText = lineText.replace(/^.*[$#>]\s*/, '').trim()

      // Check if it's an edit command
      const editMatch = cleanText.match(/^edit\s+(.+)$/)

      if (editMatch) {
        const filename = editMatch[1].trim()

        // Write newline
        terminal.value.write('\r\n')

        // DON'T send Ctrl+C yet - the incomplete command will sit on the server
        // We'll send Ctrl+C when the editor closes to clear it

        // Request file immediately (no delay needed)
        handleEditCommand(filename)

        return  // Don't send the Enter key!
      }
    }
  }

  // Send all input to backend (for non-edit commands)
  ws.value.send(JSON.stringify({
    type: 'input',
    data: data
  }))
}

const handleKeyEvent = (event) => {
  // ONLY handle keydown events, ignore keyup
  if (event.type !== 'keydown') {
    return true
  }

  // Ctrl+Shift+C - Force copy (uppercase C with shift)
  if (event.ctrlKey && event.shiftKey && event.key === 'C') {
    const selection = terminal.value.getSelection()
    if (selection) {
      navigator.clipboard.writeText(selection)
    }
    return false
  }

  // Ctrl+Shift+V - Force paste (uppercase V with shift)
  if (event.ctrlKey && event.shiftKey && event.key === 'V') {
    event.preventDefault()
    event.stopPropagation()

    navigator.clipboard.readText().then(text => {
      if (connected.value && ws.value) {
        ws.value.send(JSON.stringify({
          type: 'input',
          data: text
        }))
      }
    })
    return false
  }

  // Ctrl+C without shift (lowercase c)
  if (event.ctrlKey && !event.shiftKey && event.key === 'c') {
    const selection = terminal.value.getSelection()
    if (selection) {
      navigator.clipboard.writeText(selection)
      return false
    } else {
      if (connected.value && ws.value) {
        ws.value.send(JSON.stringify({
          type: 'input',
          data: '\x03'
        }))
      }
      return false
    }
  }

  // Ctrl+V without shift (lowercase v)
  if (event.ctrlKey && !event.shiftKey && event.key === 'v') {
    event.preventDefault()
    event.stopPropagation()

    navigator.clipboard.readText().then(text => {
      if (connected.value && ws.value) {
        ws.value.send(JSON.stringify({
          type: 'input',
          data: text
        }))
      }
    })
    return false
  }

  return true
}

const executeCommand = (cmd) => {
  if (!connected.value) {
    connect()
    // Wait a bit then execute
    setTimeout(() => {
      ws.value?.send(JSON.stringify({
        type: 'input',
        data: cmd + '\r'
      }))
    }, 500)
  } else {
    ws.value?.send(JSON.stringify({
      type: 'input',
      data: cmd + '\r'
    }))
  }

  showHistory.value = false
}

const clearTerminal = () => {
  terminal.value.clear()
}

let resizeTimeout = null
const handleResize = () => {
  if (!fitAddon.value || !terminal.value) return

  // Clear any pending resize
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }

  // Debounce the fit and backend notification
  resizeTimeout = setTimeout(() => {
    fitAddon.value.fit()

    // Send resize to backend
    if (connected.value && ws.value && ws.value.readyState === WebSocket.OPEN) {
      const dimensions = {
        cols: terminal.value.cols,
        rows: terminal.value.rows
      }

      ws.value.send(JSON.stringify({
        type: 'resize',
        ...dimensions
      }))
    }
  }, 100)
}

const extractPath = (output) => {
  // Strip ANSI escape sequences (colors, formatting)
  // Pattern: \x1b[...m or \u001b[...m
  const cleanOutput = output.replace(/\x1b\[[0-9;]*m/g, '')

  // Debug: Show cleaned output
  if (output.includes('ssh-portal-backend') || output.includes('$')) {
    console.log('📂 [Path] Clean output:', JSON.stringify(cleanOutput.substring(0, 100)))
  }

  // Try to extract path from common prompt patterns
  // e.g., "user@host:/path/to/dir$"
  const pathMatch = cleanOutput.match(/:\s*([~\/][\w\/.-]*)\s*[$#>]/)
  if (pathMatch) {
    const newPath = pathMatch[1]
    console.log('📂 [Path] ✅ Detected:', newPath)
    if (newPath !== currentPath.value) {
      currentPath.value = newPath
      console.log('📂 [Path] ✅ Updated to:', newPath)
      emit('pathChanged', newPath)
    }
  }
}

// File Editor Functions
const handleEditCommand = (filename) => {
  if (!connected.value || !ws.value) {
    terminal.value.writeln('\x1b[31m✗ Not connected\x1b[0m')
    return
  }

  console.log('📝 [Edit] Filename:', filename)
  console.log('📝 [Edit] Current Path:', currentPath.value)

  // Request file content from backend
  ws.value.send(JSON.stringify({
    type: 'read-file',
    filename: filename,
    path: currentPath.value
  }))
}

const openFileEditor = (filename, filepath, content, isNew = false) => {
  // "Opened {name} in editor"
  terminal.value.writeln(`Opened ${filename} in editor`)

  editingFile.value = {
    name: filename,
    path: filepath,
    content: content,
    isNew: isNew
  }
  showFileEditor.value = true
}

const handleEditorClose = () => {
  // Close editor
  showFileEditor.value = false

  // Send Ctrl^C to server
  if (connected.value && ws.value) {
    ws.value.send(JSON.stringify({
      type: 'input',
      data: '\x03'
    }))
  }

  // Wait for Ctrl^C to process, then focus
  setTimeout(() => {
    // Terminal input selected
    if (terminal.value) {
      terminal.value.focus()
    }
  }, 100)
}

const handleFileSave = async ({ filepath, content }) => {
  if (!connected.value || !ws.value) {
    terminal.value.writeln('\x1b[31m✗ Not connected\x1b[0m')
    return
  }

  // Send file save request to backend
  ws.value.send(JSON.stringify({
    type: 'write-file',
    filepath: filepath,
    content: content
  }))

  // DON'T close editor - user might want to keep editing
  // Only Esc or clicking the red close button will close it
}

const cleanup = () => {
  window.removeEventListener('resize', handleResize)

  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  if (keyHandlerDisposable) {
    keyHandlerDisposable.dispose()
    keyHandlerDisposable = null
  }

  disconnect()
  terminal.value?.dispose()
}

// Load command history from Firestore
const loadCommandHistory = async () => {
  // TODO: Load from Firestore
  // const history = await getCommandHistory(props.serverId)
  // commandHistory.value = history
}

// Expose methods for parent component
defineExpose({
  connect,
  disconnect,
  clearTerminal,
  executeCommand
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
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.terminal-display {
  flex: 1;
  overflow: hidden;
  min-height: 0;
  position: relative;
}

/* Override xterm default padding to prevent overflow */
.terminal-display :deep(.xterm) {
  padding: 8px;
  height: 100% !important;
}

.terminal-display :deep(.xterm-viewport) {
  overflow-y: auto !important;
}

.history-sidebar {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 300px;
  background: #161b22;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.history-header button {
  font-size: 24px;
  line-height: 1;
  padding: 0 8px;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.history-item {
  padding: 8px 12px;
  margin: 4px 0;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 2px solid transparent;
}

.history-item:hover {
  background: rgba(16, 185, 129, 0.1);
  border-left-color: #10b981;
}

.history-toggle {
  position: absolute;
  right: 16px;
  bottom: 16px;
  padding: 8px 16px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 6px;
  color: #10b981;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 5;
}

.history-toggle:hover {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.5);
}

.history-toggle.active {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
}

/* Slide transition for history sidebar */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>