<template>
  <div class="terminal-container">
    <!-- Terminal Display -->
    <div ref="terminalRef" class="terminal-display"></div>

    <!-- File Editor Modal -->
    <FileEditor :is-open="showFileEditor" :filename="editingFile.name" :filepath="editingFile.path"
      :initial-content="editingFile.content" :is-new="editingFile.isNew" @close="handleEditorClose"
      @save="handleFileSave" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { toast } from 'vue-sonner'
import { getAuth } from 'firebase/auth'
import FileEditor from '@/features/server/components/FileEditor.vue'
import 'xterm/css/xterm.css'

const props = defineProps({
  serverId: String,
  serverName: String,
  autoConnect: {
    type: Boolean,
    default: false
  }
})

// statusChange payloads: 'connecting' | 'connected' | 'disconnected' | 'error'
const emit = defineEmits(['commandExecuted', 'disconnected', 'pathChanged', 'statusChange'])

// Refs
const terminalRef = ref(null)
const terminal = ref(null)
const fitAddon = ref(null)
const ws = ref(null)
const connected = ref(false)
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

  // Handle paste / shortcuts
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

  emit('statusChange', 'connecting')
  terminal.value.writeln('\x1b[36mConnecting to server...\x1b[0m')

  const wsUrl = import.meta.env.VITE_SSH_WS_URL || 'ws://localhost:3001'

  ws.value = new WebSocket(wsUrl)

  // Keepalive
  let keepAliveInterval = null

  ws.value.onopen = async () => {
    connected.value = true
    emit('statusChange', 'connected')
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
      if (data.isNew) {
        terminal.value.writeln('[New File]')
      }
      openFileEditor(data.filename, data.filepath, data.content, data.isNew)
    } else if (data.type === 'file-saved') {
      terminal.value.writeln(`File saved: ${data.filepath}`)
      toast.success('File saved!')
    } else if (data.type === 'file-error') {
      terminal.value.writeln(`\x1b[31m✗ File error: ${data.message}\x1b[0m`)
    } else if (data.type === 'pong') {
      // Keepalive response
    }
  }

  ws.value.onerror = (error) => {
    emit('statusChange', 'error')
    terminal.value.writeln(`\x1b[31m✗ Connection error\x1b[0m`)
    console.error('WebSocket error:', error)
  }

  ws.value.onclose = () => {
    if (keepAliveInterval) clearInterval(keepAliveInterval)
    connected.value = false
    terminal.value.writeln('')
    terminal.value.writeln('\x1b[33m⚠ Connection closed\x1b[0m')
    ws.value = null
    emit('statusChange', 'disconnected')
    emit('disconnected')
  }
}

const disconnect = () => {
  if (ws.value) {
    ws.value.close()
  }
}

const handleTerminalData = (data) => {
  if (!connected.value) {
    terminal.value.write('\x1b[31mNot connected\x1b[0m\r\n')
    return
  }

  // Intercept Enter to check for an `edit <file>` pseudo-command
  if (data === '\r' || data === '\n') {
    // Read the line the cursor is actually on. cursorY is viewport-relative,
    // so add baseY to get the absolute buffer row (works once scrolled back).
    const buffer = terminal.value.buffer.active
    const cursorY = buffer.baseY + buffer.cursorY
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

      // Clean up the line text (remove prompt: user@host:path$ or #)
      const cleanText = lineText.replace(/^.*[$#>]\s*/, '').trim()

      // Check if it's an edit command
      const editMatch = cleanText.match(/^edit\s+(.+)$/)

      if (editMatch) {
        const filename = editMatch[1].trim()

        // Write newline locally; leave the half-typed command on the server
        // (cleared with Ctrl+C when the editor closes).
        terminal.value.write('\r\n')

        handleEditCommand(filename)

        return  // Don't forward the Enter key
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

  // Ctrl+Shift+C - Force copy
  if (event.ctrlKey && event.shiftKey && event.key === 'C') {
    const selection = terminal.value.getSelection()
    if (selection) {
      navigator.clipboard.writeText(selection)
    }
    return false
  }

  // Ctrl+Shift+V - Force paste
  if (event.ctrlKey && event.shiftKey && event.key === 'V') {
    event.preventDefault()
    event.stopPropagation()

    navigator.clipboard.readText().then(text => {
      if (connected.value && text) {
        // Route through xterm's paste so bracketed-paste mode is honoured and
        // line endings are normalised — multi-line / `\`-continued commands
        // paste as one editable block instead of executing line-by-line.
        terminal.value.paste(text)
      }
    }).catch(() => { })
    return false
  }

  // Ctrl+C without shift: copy selection, else send interrupt
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

  // Ctrl+V without shift - paste
  if (event.ctrlKey && !event.shiftKey && event.key === 'v') {
    event.preventDefault()
    event.stopPropagation()

    navigator.clipboard.readText().then(text => {
      if (connected.value && text) {
        // Route through xterm's paste so bracketed-paste mode is honoured and
        // line endings are normalised — multi-line / `\`-continued commands
        // paste as one editable block instead of executing line-by-line.
        terminal.value.paste(text)
      }
    }).catch(() => { })
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

  emit('commandExecuted', cmd)
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
  const cleanOutput = output.replace(/\x1b\[[0-9;]*m/g, '')

  // Try to extract path from common prompt patterns, e.g. "user@host:/path/to/dir$"
  const pathMatch = cleanOutput.match(/:\s*([~\/][\w\/.-]*)\s*[$#>]/)
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

  // Request file content from backend
  ws.value.send(JSON.stringify({
    type: 'read-file',
    filename: filename,
    path: currentPath.value
  }))
}

const openFileEditor = (filename, filepath, content, isNew = false) => {
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
  showFileEditor.value = false

  // Send Ctrl+C to clear the half-typed `edit` command on the server
  if (connected.value && ws.value) {
    ws.value.send(JSON.stringify({
      type: 'input',
      data: '\x03'
    }))
  }

  // Wait for Ctrl+C to process, then refocus
  setTimeout(() => {
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

  // Keep editor open - user might want to keep editing
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

// Expose methods for parent component
defineExpose({
  connect,
  disconnect,
  clearTerminal,
  executeCommand,
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

/* Override xterm default padding to prevent overflow */
.terminal-display :deep(.xterm) {
  padding: 8px 12px;
  height: 100% !important;
}

.terminal-display :deep(.xterm-viewport) {
  overflow-y: auto !important;
}
</style>
