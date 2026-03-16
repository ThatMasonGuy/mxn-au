<template>
  <div class="demo-terminal-container">
    <!-- Header -->
    <div class="demo-header">
      <div class="flex items-center gap-3">
        <div class="flex gap-1.5">
          <div class="h-3 w-3 rounded-full bg-yellow-500/80"></div>
          <div class="h-3 w-3 rounded-full bg-yellow-500/80"></div>
          <div class="h-3 w-3 rounded-full bg-yellow-500/80"></div>
        </div>

        <div class="flex items-center gap-2 text-sm font-mono">
          <span class="text-yellow-400">demo@mxn.au</span>
          <span class="text-gray-500">~/demo</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <div class="text-xs font-mono px-2 py-1 rounded bg-yellow-500/10 text-yellow-400">
          DEMO MODE
        </div>

        <button @click="clearTerminal"
          class="text-xs font-mono px-2 py-1 rounded hover:bg-white/5 text-gray-400 hover:text-gray-200">
          CLEAR
        </button>
      </div>
    </div>

    <!-- Terminal Display -->
    <div ref="terminalRef" class="demo-display"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { toast } from 'vue-sonner'
import 'xterm/css/xterm.css'

const terminalRef = ref(null)
const terminal = ref(null)
const fitAddon = ref(null)
const currentLine = ref('')
const commandHistory = ref([])
const historyIndex = ref(-1)
const currentPath = ref('~')
let keyHandlerDisposable = null
let resizeObserver = null

// Fake file system for demo
const fileSystem = {
  '~': {
    type: 'dir',
    files: {
      'welcome.txt': { type: 'file', content: 'Welcome to the MXN.AU SSH Portal demo!\n\nThis is a simulated terminal to show you what the real thing will look like.\n\nTry some commands like: ls, cat, cd, help' },
      'projects': {
        type: 'dir',
        files: {
          'discord-bot': { type: 'dir', files: {} },
          'minecraft': { type: 'dir', files: {} },
          'readme.md': { type: 'file', content: '# My Projects\n\nVarious gaming and automation projects' }
        }
      },
      'scripts': {
        type: 'dir',
        files: {
          'deploy.sh': { type: 'file', content: '#!/bin/bash\necho "Deploying..."' },
          'backup.sh': { type: 'file', content: '#!/bin/bash\necho "Backing up..."' }
        }
      }
    }
  }
}

onMounted(() => {
  if (terminal.value) {
    return
  }
  initTerminal()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)

  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  if (keyHandlerDisposable) {
    keyHandlerDisposable.dispose()
    keyHandlerDisposable = null
  }

  if (terminal.value) {
    try {
      terminal.value.dispose()
    } catch (e) {
      // Terminal already disposed
    }
  }
})

const initTerminal = () => {
  terminal.value = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: '"Cascadia Code", "Fira Code", "Consolas", monospace',
    theme: {
      background: '#0d1117',
      foreground: '#c9d1d9',
      cursor: '#f59e0b',
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

  fitAddon.value = new FitAddon()
  terminal.value.loadAddon(fitAddon.value)
  terminal.value.loadAddon(new WebLinksAddon())

  terminal.value.open(terminalRef.value)

  // Fit terminal to container - delay to ensure DOM is ready
  setTimeout(() => {
    fitAddon.value.fit()
  }, 0)

  window.addEventListener('resize', handleResize)

  // Watch for container size changes
  resizeObserver = new ResizeObserver(() => {
    handleResize()
  })
  resizeObserver.observe(terminalRef.value)

  terminal.value.onData(handleTerminalData)

  // Handle keyboard events for copy/paste
  if (keyHandlerDisposable) {
    keyHandlerDisposable.dispose()
  }
  keyHandlerDisposable = terminal.value.attachCustomKeyEventHandler(handleKeyEvent)

  // Welcome message
  terminal.value.writeln('\x1b[1;33m╔══════════════════════════════════════════╗\x1b[0m')
  terminal.value.writeln('\x1b[1;33m║\x1b[0m    🎮 DEMO TERMINAL - NO BACKEND         \x1b[1;33m║\x1b[0m')
  terminal.value.writeln('\x1b[1;33m╚══════════════════════════════════════════╝\x1b[0m')
  terminal.value.writeln('')
  terminal.value.writeln('\x1b[33mThis is a simulated terminal. Try commands like:\x1b[0m')
  terminal.value.writeln('\x1b[36mls, cd, cat, pwd, help, whoami, date, uptime\x1b[0m')
  terminal.value.writeln('')

  writePrompt()
}

const writePrompt = () => {
  terminal.value.write(`\x1b[32mdemo@mxn.au\x1b[0m:\x1b[34m${currentPath.value}\x1b[0m$ `)
}

const handleTerminalData = (data) => {
  const code = data.charCodeAt(0)

  // Ctrl+C (cancel/interrupt)
  if (code === 3) {
    terminal.value.write('^C\r\n')
    currentLine.value = ''
    writePrompt()
    return
  }

  // Enter key
  if (code === 13) {
    terminal.value.write('\r\n')
    if (currentLine.value.trim()) {
      executeCommand(currentLine.value.trim())
      commandHistory.value.unshift(currentLine.value.trim())
      if (commandHistory.value.length > 100) {
        commandHistory.value.pop()
      }
    }
    currentLine.value = ''
    historyIndex.value = -1
    writePrompt()
    return
  }

  // Backspace
  if (code === 127) {
    if (currentLine.value.length > 0) {
      currentLine.value = currentLine.value.slice(0, -1)
      terminal.value.write('\b \b')
    }
    return
  }

  // Up arrow (history)
  if (data === '\x1b[A') {
    if (historyIndex.value < commandHistory.value.length - 1) {
      historyIndex.value++
      const cmd = commandHistory.value[historyIndex.value]
      // Clear current line
      terminal.value.write('\r\x1b[K')
      writePrompt()
      terminal.value.write(cmd)
      currentLine.value = cmd
    }
    return
  }

  // Down arrow (history)
  if (data === '\x1b[B') {
    if (historyIndex.value > 0) {
      historyIndex.value--
      const cmd = commandHistory.value[historyIndex.value]
      terminal.value.write('\r\x1b[K')
      writePrompt()
      terminal.value.write(cmd)
      currentLine.value = cmd
    } else if (historyIndex.value === 0) {
      historyIndex.value = -1
      terminal.value.write('\r\x1b[K')
      writePrompt()
      currentLine.value = ''
    }
    return
  }

  // Ignore other escape sequences
  if (code === 27) {
    return
  }

  // Regular character
  currentLine.value += data
  terminal.value.write(data)
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
      currentLine.value += text
      terminal.value.write(text)
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
      return true
    }
  }

  // Ctrl+V without shift (lowercase v)
  if (event.ctrlKey && !event.shiftKey && event.key === 'v') {
    event.preventDefault()
    event.stopPropagation()

    navigator.clipboard.readText().then(text => {
      currentLine.value += text
      terminal.value.write(text)
    })
    return false
  }

  return true
}

const executeCommand = (cmd) => {
  const parts = cmd.trim().split(/\s+/)
  const command = parts[0]
  const args = parts.slice(1)

  switch (command) {
    case 'ls':
      cmdLs(args)
      break
    case 'cd':
      cmdCd(args)
      break
    case 'cat':
      cmdCat(args)
      break
    case 'pwd':
      terminal.value.writeln(currentPath.value)
      break
    case 'clear':
      terminal.value.clear()
      break
    case 'help':
      cmdHelp()
      break
    case 'whoami':
      terminal.value.writeln('demo')
      break
    case 'date':
      terminal.value.writeln(new Date().toString())
      break
    case 'uptime':
      terminal.value.writeln('up 42 days, 13:37')
      break
    case 'uname':
      terminal.value.writeln('Linux demo-server 5.15.0-demo x86_64 GNU/Linux')
      break
    case 'echo':
      terminal.value.writeln(args.join(' '))
      break
    case 'htop':
      terminal.value.writeln('\x1b[33m(htop simulation - press Ctrl+C to exit)\x1b[0m')
      terminal.value.writeln('CPU: 23% [||||      ] MEM: 45% [||||||||  ]')
      terminal.value.writeln('PID  USER     CPU%  MEM%  COMMAND')
      terminal.value.writeln('1234 demo     12.3  23.1  node backend-server.js')
      terminal.value.writeln('5678 demo      8.7  15.2  discord-bot')
      terminal.value.writeln('9012 demo      2.1   6.8  minecraft-server')
      break
    case 'df':
      terminal.value.writeln('Filesystem     Size  Used Avail Use% Mounted on')
      terminal.value.writeln('/dev/sda1       50G   23G   25G  48% /')
      terminal.value.writeln('tmpfs          8.0G  256M  7.8G   4% /tmp')
      break
    case 'ps':
      terminal.value.writeln('PID   USER     COMMAND')
      terminal.value.writeln('1234  demo     /usr/bin/node backend-server.js')
      terminal.value.writeln('5678  demo     python3 discord-bot.py')
      terminal.value.writeln('9012  demo     java -jar minecraft-server.jar')
      break
    case 'neofetch':
      cmdNeofetch()
      break
    case '':
      // Empty command, do nothing
      break
    default:
      terminal.value.writeln(`\x1b[31mbash: ${command}: command not found\x1b[0m`)
      terminal.value.writeln(`\x1b[33mTry 'help' for available commands\x1b[0m`)
  }
}

const cmdLs = (args) => {
  const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al')
  const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al')

  const dir = getCurrentDir()
  if (!dir || dir.type !== 'dir') {
    terminal.value.writeln('\x1b[31mls: cannot access directory\x1b[0m')
    return
  }

  const files = Object.keys(dir.files)

  if (longFormat) {
    if (showAll) {
      terminal.value.writeln('drwxr-xr-x 2 demo demo 4096 Dec 24 10:30 .')
      terminal.value.writeln('drwxr-xr-x 3 demo demo 4096 Dec 24 10:00 ..')
    }

    files.forEach(name => {
      const file = dir.files[name]
      const isDir = file.type === 'dir'
      const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--'
      const size = isDir ? '4096' : (file.content?.length || 0)
      const color = isDir ? '\x1b[34m' : '\x1b[0m'
      terminal.value.writeln(`${perms} 2 demo demo ${size.toString().padStart(5)} Dec 24 10:30 ${color}${name}\x1b[0m`)
    })
  } else {
    const output = files.map(name => {
      const file = dir.files[name]
      const isDir = file.type === 'dir'
      return isDir ? `\x1b[34m${name}\x1b[0m` : name
    }).join('  ')
    terminal.value.writeln(output)
  }
}

const cmdCd = (args) => {
  if (!args.length || args[0] === '~') {
    currentPath.value = '~'
    return
  }

  const target = args[0]

  if (target === '..') {
    const parts = currentPath.value.split('/').filter(p => p)
    if (parts.length > 0) {
      parts.pop()
      currentPath.value = parts.length ? '~/' + parts.join('/') : '~'
    }
    return
  }

  const newPath = currentPath.value === '~' ? `~/${target}` : `${currentPath.value}/${target}`
  const dir = getDir(newPath)

  if (!dir || dir.type !== 'dir') {
    terminal.value.writeln(`\x1b[31mbash: cd: ${target}: No such file or directory\x1b[0m`)
    return
  }

  currentPath.value = newPath
}

const cmdCat = (args) => {
  if (!args.length) {
    terminal.value.writeln('\x1b[31mcat: missing file operand\x1b[0m')
    return
  }

  const dir = getCurrentDir()
  const file = dir?.files?.[args[0]]

  if (!file) {
    terminal.value.writeln(`\x1b[31mcat: ${args[0]}: No such file or directory\x1b[0m`)
    return
  }

  if (file.type === 'dir') {
    terminal.value.writeln(`\x1b[31mcat: ${args[0]}: Is a directory\x1b[0m`)
    return
  }

  terminal.value.writeln(file.content || '')
}

const cmdHelp = () => {
  terminal.value.writeln('\x1b[36mAvailable demo commands:\x1b[0m')
  terminal.value.writeln('')
  terminal.value.writeln('  \x1b[32mls\x1b[0m [-la]        List files')
  terminal.value.writeln('  \x1b[32mcd\x1b[0m <dir>        Change directory')
  terminal.value.writeln('  \x1b[32mcat\x1b[0m <file>      Show file contents')
  terminal.value.writeln('  \x1b[32mpwd\x1b[0m             Print working directory')
  terminal.value.writeln('  \x1b[32mclear\x1b[0m           Clear screen')
  terminal.value.writeln('  \x1b[32mwhoami\x1b[0m          Show current user')
  terminal.value.writeln('  \x1b[32mdate\x1b[0m            Show current date')
  terminal.value.writeln('  \x1b[32mecho\x1b[0m <text>     Print text')
  terminal.value.writeln('  \x1b[32mhtop\x1b[0m            Show processes')
  terminal.value.writeln('  \x1b[32mdf\x1b[0m              Show disk usage')
  terminal.value.writeln('  \x1b[32mps\x1b[0m              Show processes')
  terminal.value.writeln('  \x1b[32mneofetch\x1b[0m        Show system info')
  terminal.value.writeln('')
  terminal.value.writeln('\x1b[33mTip: Use ↑/↓ arrows for command history\x1b[0m')
}

const cmdNeofetch = () => {
  terminal.value.writeln('\x1b[36m       ___     \x1b[0m  demo@mxn.au')
  terminal.value.writeln('\x1b[36m      (.. |    \x1b[0m  ---------------')
  terminal.value.writeln('\x1b[36m      (<> |    \x1b[0m  \x1b[36mOS:\x1b[0m Ubuntu 24.04 LTS')
  terminal.value.writeln('\x1b[36m     / __  \\   \x1b[0m  \x1b[36mHost:\x1b[0m Oracle Cloud')
  terminal.value.writeln('\x1b[36m    ( /  \\ /|  \x1b[0m  \x1b[36mKernel:\x1b[0m 5.15.0-demo')
  terminal.value.writeln('\x1b[36m   _/\\ __)/    \x1b[0m  \x1b[36mUptime:\x1b[0m 42 days, 13 hours')
  terminal.value.writeln('\x1b[36m   \\/___/      \x1b[0m  \x1b[36mShell:\x1b[0m bash')
  terminal.value.writeln('                 \x1b[36mMemory:\x1b[0m 3.2G / 8G')
}

const getCurrentDir = () => {
  return getDir(currentPath.value)
}

const getDir = (path) => {
  const parts = path.split('/').filter(p => p && p !== '~')
  let current = fileSystem['~']

  for (const part of parts) {
    if (!current.files || !current.files[part]) {
      return null
    }
    current = current.files[part]
  }

  return current
}

const clearTerminal = () => {
  terminal.value.clear()
  writePrompt()
}

let resizeTimeout = null
const handleResize = () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
  resizeTimeout = setTimeout(() => {
    fitAddon.value?.fit()
  }, 100)
}
</script>

<style scoped>
.demo-terminal-container {
  position: relative;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background: #0d1117;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(245, 158, 11, 0.3);
}

.demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(245, 158, 11, 0.05);
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
  flex-shrink: 0;
}

.demo-display {
  flex: 1;
  overflow: hidden;
  min-height: 0;
  position: relative;
}

/* Override xterm default padding to prevent overflow */
.demo-display :deep(.xterm) {
  padding: 8px;
  height: 100% !important;
}

.demo-display :deep(.xterm-viewport) {
  overflow-y: auto !important;
}
</style>