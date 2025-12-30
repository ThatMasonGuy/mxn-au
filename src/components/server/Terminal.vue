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
    <FileEditor
      :is-open="showFileEditor"
      :filename="editingFile.name"
      :filepath="editingFile.path"
      :initial-content="editingFile.content"
      :is-new="editingFile.isNew"
      @close="showFileEditor = false"
      @save="handleFileSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { useToast } from '@/composables/useToast'
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

const { success: showSuccess } = useToast()

// Refs
const terminalRef = ref(null)
const terminal = ref(null)
const fitAddon = ref(null)
const ws = ref(null)
const connected = ref(false)
const showHistory = ref(false)
const commandHistory = ref([])
const currentPath = ref('~')

// File Editor state
const showFileEditor = ref(false)
const editingFile = ref({
  name: '',
  path: '',
  content: '',
  isNew: false
})

// Track current line being typed for command detection
const currentCommandLine = ref('')

// Terminal setup
onMounted(() => {
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
  fitAddon.value.fit()

  // Handle resize
  window.addEventListener('resize', handleResize)

  // Handle terminal data (user input)
  terminal.value.onData(handleTerminalData)

  // Handle paste
  terminal.value.attachCustomKeyEventHandler(handleKeyEvent)

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
      setTimeout(() => handleResize(), 500)
      
      ws.value.send(JSON.stringify({
        type: 'auth',
        serverId: props.serverId,
        token: token
      }))
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
      // File read successfully (or new file)
      if (data.isNew) {
        terminal.value.writeln(`\x1b[33m[New File]\x1b[0m`)
      }
      openFileEditor(data.filename, data.filepath, data.content, data.isNew)
    } else if (data.type === 'file-saved') {
      terminal.value.writeln(`\x1b[32m✓ File saved: ${data.filepath}\x1b[0m`)
      showSuccess('File saved!')
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

  // Track the command being typed
  if (data === '\r' || data === '\n') {
    // Command submitted - check if it's an edit command
    const trimmed = currentCommandLine.value.trim()
    const editMatch = trimmed.match(/^edit\s+(.+)$/)
    
    if (editMatch) {
      const filename = editMatch[1].trim()
      
      // Send the enter key to complete the command (will show "command not found")
      ws.value.send(JSON.stringify({
        type: 'input',
        data: data
      }))
      
      // Wait a tiny bit for the error message, then open editor
      setTimeout(() => {
        handleEditCommand(filename)
      }, 50)
      
      currentCommandLine.value = ''
      return
    }
    
    // Regular command
    currentCommandLine.value = ''
  } else if (data === '\x7f') {
    // Backspace
    currentCommandLine.value = currentCommandLine.value.slice(0, -1)
  } else if (data.charCodeAt(0) >= 32 && data.charCodeAt(0) <= 126) {
    // Printable character
    currentCommandLine.value += data
  } else if (data === '\x03') {
    // Ctrl+C - clear current line
    currentCommandLine.value = ''
  }

  // Send input to backend
  ws.value.send(JSON.stringify({
    type: 'input',
    data: data
  }))
}

const handleKeyEvent = (event) => {
  // Ctrl+C
  if (event.ctrlKey && event.key === 'c') {
    const selection = terminal.value.getSelection()
    if (selection) {
      // Copy selected text
      navigator.clipboard.writeText(selection).then(() => {
        showSuccess('Copied to clipboard')
      })
      return false // Prevent default
    } else {
      // Send interrupt signal (Ctrl+C)
      if (connected.value && ws.value) {
        ws.value.send(JSON.stringify({
          type: 'input',
          data: '\x03' // Ctrl+C
        }))
      }
      return false
    }
  }

  // Ctrl+V - Paste
  if (event.ctrlKey && event.key === 'v') {
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

  // Ctrl+Shift+C - Force copy
  if (event.ctrlKey && event.shiftKey && event.key === 'C') {
    const selection = terminal.value.getSelection()
    if (selection) {
      navigator.clipboard.writeText(selection).then(() => {
        showSuccess('Copied to clipboard')
      })
    }
    return false
  }

  // Ctrl+Shift+V - Force paste
  if (event.ctrlKey && event.shiftKey && event.key === 'V') {
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

const handleResize = () => {
  if (!fitAddon.value || !terminal.value) return
  
  fitAddon.value.fit()

  // Send resize to backend IMMEDIATELY
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
}

const extractPath = (output) => {
  // Try to extract path from common prompt patterns
  // e.g., "user@host:/path/to/dir$"
  const pathMatch = output.match(/:\s*([~\/][\w\/.-]*)\s*[$#>]/)
  if (pathMatch) {
    const newPath = pathMatch[1]
    if (newPath !== currentPath.value) {
      currentPath.value = newPath
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
  
  terminal.value.writeln(`\x1b[36mOpening ${filename} in editor...\x1b[0m`)
  
  // Request file content from backend
  ws.value.send(JSON.stringify({
    type: 'read-file',
    filename: filename,
    path: currentPath.value
  }))
}

const openFileEditor = (filename, filepath, content, isNew = false) => {
  editingFile.value = {
    name: filename,
    path: filepath,
    content: content,
    isNew: isNew
  }
  showFileEditor.value = true
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
  
  // Close editor
  showFileEditor.value = false
}

const cleanup = () => {
  window.removeEventListener('resize', handleResize)
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
}

.terminal-display {
  flex: 1;
  padding: 16px;
  overflow: hidden;
  min-height: 0;
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