<!-- src/components/mxn/TerminalInterface.vue -->
<template>
    <section id="terminal" class="px-8 py-12 max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-blue-300 mb-12">Ask Mason Anything</h2>
        <div class="glass p-6 rounded-xl shadow-xl">
            <div ref="output" v-show="!playMode"
                class="h-48 overflow-y-auto text-green-300 font-mono text-sm mb-4 bg-black p-4 rounded">
                <div v-if="showHelpPrompt" class="terminal-output-line animate-pulse text-gray-500">
                    Try typing <span class="text-blue-400">help</span><span
                        class="animate-ping inline-block w-2 h-2 ml-1 bg-blue-400 rounded-full"></span>
                </div>
            </div>
            <div v-if="!playMode" class="relative">
                <input v-model="command" @keydown.enter="handleCommand" @input="handleInput"
                    @keydown.space="handleSpace" @keydown.tab.prevent="applySelectedSuggestion"
                    @keydown.arrow-down.prevent="navigateAutocomplete(1)"
                    @keydown.arrow-up.prevent="navigateAutocomplete(-1)" type="text" placeholder="Type a command..."
                    class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div v-if="suggestions.length"
                    class="absolute z-50 w-full bg-gray-900 mt-1 border border-gray-700 rounded text-white text-sm shadow-xl max-h-48 overflow-y-auto">
                    <div v-for="(suggestion, index) in suggestions" :key="index" :class="[
                        'px-3 py-2 cursor-pointer transition-colors',
                        index === selectedIndex ? 'bg-gray-700 text-blue-300' : 'hover:bg-gray-700'
                    ]" @click="applySuggestion(suggestion)">
                        {{ suggestion }}
                    </div>
                </div>
            </div>
            <div v-else ref="gameContainer" class="w-full h-64 bg-gray-800 rounded relative outline-none" tabindex="0"
                @keydown="handleGameInput">
                <!-- Canvas injected dynamically -->
                <div v-if="paused"
                    class="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center text-white z-20">
                    <h2 class="text-xl mb-4">Paused</h2>
                    <button @click="resumeGame"
                        class="mb-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Resume</button>
                    <button @click="stopGame" class="px-4 py-2 bg-red-600 rounded hover:bg-red-700">Exit</button>
                </div>
                <button @click.stop="stopGame"
                    class="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors z-10">
                    Exit
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

const output = ref(null)
const command = ref('')
const suggestions = ref([])
const selectedIndex = ref(-1)
const showHelpPrompt = ref(true)
const userInfo = ref({})

const playMode = ref(false)
const gameRunning = ref(false)
const paused = ref(false)
const gameContainer = ref(null)
const gameLoopId = ref(null)
let dino = null
let score = 0

const highScore = ref(Number(localStorage.getItem('highScore')) || 0)

// Improved command tree with descriptions for help command
const commandTree = {
    help: {
        description: 'Lists all available commands',
        subcommands: []
    },
    whoami: {
        description: 'Shows information about your browser and system',
        subcommands: []
    },
    skills: {
        description: 'Displays my technical skills',
        subcommands: []
    },
    goals: {
        description: 'Lists my professional goals',
        subcommands: []
    },
    motto: {
        description: 'Reveals my personal motto',
        subcommands: []
    },
    github: {
        description: 'Links to my GitHub profile',
        subcommands: []
    },
    fortune: {
        description: 'Displays a random programming quote',
        subcommands: []
    },
    clear: {
        description: 'Clears the terminal screen',
        subcommands: []
    },
    echo: {
        description: 'Repeats the text you enter',
        subcommands: ['<text>']
    },
    projects: {
        description: 'Lists my development projects',
        subcommands: ['--all', '--filter']
    },
    goto: {
        description: 'Navigates to a different page',
        subcommands: ['about', 'skills', 'dashboard']
    },
    animate: {
        description: 'Triggers an animation on the page',
        subcommands: ['bounce', 'pulse']
    },
    play: {
        description: 'Play the T-Rex game (like Chrome\'s offline game)',
        subcommands: []
    }
}

// Second level of command tree for projects --filter
const projectsFilterCommands = {
    'bot': 'Filter projects to show only bot-related work',
    'minecraft': 'Filter projects to show only Minecraft-related work'
}

// Collect user information on mount
onMounted(() => {
    getUserInfo()
})

const getUserInfo = () => {
    userInfo.value = {
        browser: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        resolution: `${window.screen.width}x${window.screen.height}`,
        time: new Date().toLocaleString()
    }

    // Attempt to get IP address using a free API service
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            userInfo.value.ip = data.ip
        })
        .catch(() => {
            userInfo.value.ip = 'Unable to retrieve'
        })
}

const appendLine = (text) => {
    if (!output.value) return

    const div = document.createElement('div')
    div.className = 'terminal-output-line'
    div.innerText = text
    output.value.appendChild(div)
    nextTick(() => {
        if (output.value) {
            output.value.scrollTop = output.value.scrollHeight
        }
    })
}

const appendHtml = (html) => {
    if (!output.value) return

    const div = document.createElement('div')
    div.className = 'terminal-output-line'
    div.innerHTML = html
    output.value.appendChild(div)
    nextTick(() => {
        if (output.value) {
            output.value.scrollTop = output.value.scrollHeight
        }
    })
}

const clearTerminal = () => {
    if (!output.value) return

    // Create a new empty div to replace the output div
    const newOutput = document.createElement('div')
    newOutput.className = output.value.className

    // Replace the old output with the new one
    const parent = output.value.parentNode
    if (parent) {
        parent.replaceChild(newOutput, output.value)
        output.value = newOutput
    }

    showHelpPrompt.value = true
}

const handleCommand = () => {
    const input = command.value.trim()
    if (!input) return

    showHelpPrompt.value = false
    suggestions.value = []
    selectedIndex.value = -1

    appendLine(`> ${input}`)

    const parts = input.split(/\s+/)
    const mainCommand = parts[0].toLowerCase()
    const args = parts.slice(1)

    switch (mainCommand) {
        case 'clear':
            clearTerminal()
            command.value = ''
            return

        case 'play':
            startGame()
            command.value = ''
            return

        case 'whoami':
            appendLine(`User Information:
Browser: ${userInfo.value.browser}
Language: ${userInfo.value.language}
Platform: ${userInfo.value.platform}
Timezone: ${userInfo.value.timezone}
Resolution: ${userInfo.value.resolution}
Local Time: ${userInfo.value.time}
IP Address: ${userInfo.value.ip || 'Retrieving...'}`)
            break

        case 'help':
            if (args.length === 0) {
                const commandList = Object.entries(commandTree).map(([cmd, info]) =>
                    `${cmd.padEnd(12)} - ${info.description}`
                ).join('\n')
                appendLine(`Available commands:\n${commandList}\n\nType 'help <command>' for more information.`)
            } else {
                const helpCmd = args[0]
                if (commandTree[helpCmd]) {
                    let response = `${helpCmd} - ${commandTree[helpCmd].description}`
                    if (commandTree[helpCmd].subcommands.length > 0) {
                        response += `\nUsage: ${helpCmd} ${commandTree[helpCmd].subcommands.join(' | ')}`
                    }
                    appendLine(response)
                } else {
                    appendLine(`No help available for '${helpCmd}'. Try 'help' for a list of commands.`)
                }
            }
            break

        case 'skills':
            appendLine(`Technical Skills:
• Frontend: Vue 3, Tailwind CSS, JavaScript/TypeScript
• Backend: Node.js, Firebase Functions, Express.js
• DevOps: Docker, PM2, GitHub Actions, Cloudflare Workers
• Databases: Firestore, Realtime DB, PostgreSQL, Redis
• Other: Git, REST APIs, Discord Bots`)
            break

        case 'goals':
            appendLine(`Professional Goals:
• Build products I actually want to use
• Solve real-world problems with automation
• Maintain open-source projects
• Scale services across global infrastructure
• Empower others to learn tech through tools`)
            break

        case 'motto':
            appendLine(`"Build once. Automate forever."`)
            break

        case 'github':
            appendLine(`Visit my GitHub profile: https://github.com/ThatMasonGuy`)
            break

        case 'fortune':
            const fortunes = [
                "Any sufficiently advanced bug is indistinguishable from a feature.",
                "The best thing about a boolean is even if you're wrong, you're only off by a bit.",
                "There are 10 types of people in the world: those who understand binary and those who don't.",
                "Debugging is like being the detective in a crime movie where you're also the murderer.",
                "It's not a bug – it's an undocumented feature."
            ]
            appendLine(fortunes[Math.floor(Math.random() * fortunes.length)])
            break

        case 'echo':
            appendLine(args.join(' ') || "You didn't provide any text to echo")
            break

        case 'projects':
            if (args.includes('--all')) {
                appendLine(`All Projects:
1. MXN Dashboard – Real-time Minecraft Admin Dashboard
2. Mase-Translate – Discord bot with emoji-based translation
3. Plugin Updater – Cross-server Minecraft plugin deployer
4. Portfolio Terminal – Interactive Vue landing page
5. Task Tracker – Internal LMS-style workboard`)
            } else if (args.includes('--filter')) {
                const filter = args[args.indexOf('--filter') + 1]
                if (filter === 'bot') {
                    appendLine(`Bot Projects:
1. Mase-Translate – Discord-based translation system
2. Oracle Auto-Creator – Tampermonkey UI automation script
3. Discord Log Relay – Minecraft ↔ Discord sync`)
                } else if (filter === 'minecraft') {
                    appendLine(`Minecraft Projects:
1. InventorySort Plugin – In-game inventory organizer
2. Multipaper Network Setup – Global server sync
3. Live Log Viewer – Web UI for Minecraft logs`)
                } else {
                    appendLine(`Unknown filter: '${filter}'. Available filters: bot, minecraft`)
                }
            } else {
                appendLine(`Recent Projects:
1. MXN Dashboard – Real-time Minecraft Admin Dashboard
2. Mase-Translate – Discord bot with emoji-based translation

Use 'projects --all' to see all projects or 'projects --filter <type>' to filter.`)
            }
            break

        case 'goto':
            if (args.length === 0) {
                appendLine("Please specify a destination: about, skills, or dashboard")
            } else {
                const destination = args[0]
                if (['about', 'skills', 'dashboard'].includes(destination)) {
                    appendLine(`Navigating to ${destination} page...`)
                    setTimeout(() => {
                        appendLine(`(Navigation to /${destination} simulated)`)
                    }, 1000)
                } else {
                    appendLine(`Unknown destination: '${destination}'. Available destinations: about, skills, dashboard`)
                }
            }
            break

        case 'animate':
            if (args.length === 0) {
                appendLine("Please specify an animation: bounce or pulse")
            } else {
                const animation = args[0]
                if (['bounce', 'pulse'].includes(animation)) {
                    appendLine(`Triggering ${animation} animation...`)
                    appendHtml(`<div class="animate-${animation} inline-block bg-blue-500 w-4 h-4 rounded-full"></div> Animation triggered!`)
                } else {
                    appendLine(`Unknown animation: '${animation}'. Available animations: bounce, pulse`)
                }
            }
            break

        default:
            appendLine(`Unknown command: '${mainCommand}'. Try 'help' for a list of commands.`)
    }

    command.value = ''
}

// T-Rex Game Implementation
const startGame = () => {
    playMode.value = true
    paused.value = false
    nextTick(() => {
        const container = gameContainer.value
        if (!container) return
        container.focus()
        container.innerHTML = ''
        const canvas = document.createElement('canvas')
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
        canvas.className = 'absolute inset-0'
        container.appendChild(canvas)
        const ctx = canvas.getContext('2d')

        dino = {
            x: 50,
            y: canvas.height - 60,
            width: 30,
            height: 50,
            jumping: false,
            jumpHeight: 15,
            jumpVelocity: 0,
            gravity: 0.6,
            draw() {
                ctx.fillStyle = 'limegreen'
                ctx.fillRect(this.x, this.y, this.width, this.height)
            },
            jump() {
                if (!this.jumping) {
                    this.jumping = true
                    this.jumpVelocity = -this.jumpHeight
                }
            },
            update() {
                if (this.jumping) {
                    this.y += this.jumpVelocity
                    this.jumpVelocity += this.gravity
                    if (this.y >= canvas.height - 60) {
                        this.y = canvas.height - 60
                        this.jumping = false
                    }
                }
            }
        }

        const obstacles = []
        const ground = {
            y: canvas.height - 10,
            draw() {
                ctx.fillStyle = 'darkgray'
                ctx.fillRect(0, this.y, canvas.width, 10)
            }
        }

        score = 0
        let speed = 4
        let gameOver = false

        const gameLoop = () => {
            if (paused.value) {
                gameLoopId.value = requestAnimationFrame(gameLoop)
                return
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ground.draw()
            dino.update()
            dino.draw()
            if (Math.random() < 0.015) {
                obstacles.push({
                    x: canvas.width,
                    y: canvas.height - 40,
                    width: 20 + Math.random() * 10,
                    height: 30 + Math.random() * 20
                })
            }
            ctx.fillStyle = 'crimson'
            for (let i = 0; i < obstacles.length; i++) {
                const obs = obstacles[i]
                obs.x -= speed
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height)
                if (
                    dino.x < obs.x + obs.width &&
                    dino.x + dino.width > obs.x &&
                    dino.y < obs.y + obs.height &&
                    dino.y + dino.height > obs.y
                ) {
                    gameOver = true
                }
                if (obs.x + obs.width < 0) {
                    obstacles.splice(i, 1)
                    i--
                    score++
                }
            }
            ctx.fillStyle = 'white'
            ctx.font = '16px monospace'
            ctx.fillText(`Score: ${score}`, 10, 24)
            ctx.fillText(`High Score: ${highScore.value}`, 10, 44)
            if (score > 0 && score % 5 === 0) speed = 4 + Math.floor(score / 10)
            if (gameOver) {
                if (score > highScore.value) {
                    highScore.value = score
                    localStorage.setItem('highScore', highScore.value)
                }
                ctx.fillStyle = 'rgba(0,0,0,0.75)'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.fillStyle = 'white'
                ctx.font = '28px sans-serif'
                ctx.fillText('Game Over', canvas.width / 2 - 75, canvas.height / 2 - 10)
                ctx.font = '20px sans-serif'
                ctx.fillText(`Score: ${score}`, canvas.width / 2 - 40, canvas.height / 2 + 20)
                ctx.fillText('Press SPACE to restart', canvas.width / 2 - 100, canvas.height / 2 + 50)
                return
            }
            gameLoopId.value = requestAnimationFrame(gameLoop)
        }

        gameLoopId.value = requestAnimationFrame(gameLoop)
    })
}

const stopGame = () => {
    playMode.value = false
    paused.value = false
    if (gameLoopId.value) cancelAnimationFrame(gameLoopId.value)
    gameLoopId.value = null
    nextTick(() => {
        document.querySelector('input')?.focus()
    })
}

const resumeGame = () => {
    paused.value = false
}

const handleGameInput = (e) => {
    if (e.code === 'Space') {
        e.preventDefault()
        if (!paused.value && dino) dino.jump()
        else if (!gameLoopId.value) startGame()
    } else if (e.code === 'Escape') {
        paused.value = !paused.value
    }
}

// Handle space key to automatically show available subcommands
const handleSpace = (event) => {
    const currentValue = command.value.trim()

    if (currentValue.endsWith(' ')) return // Prevent double space handling

    const parts = currentValue.split(/\s+/)

    // If we have a base command and pressing space, show all subcommands
    if (parts.length === 1 && commandTree[parts[0]]) {
        const baseCommand = parts[0]
        if (commandTree[baseCommand].subcommands.length > 0) {
            command.value += ' '
            event.preventDefault()

            // Show all subcommands for this command
            nextTick(() => {
                suggestions.value = commandTree[baseCommand].subcommands.map(subcmd => `${baseCommand} ${subcmd}`)
                selectedIndex.value = suggestions.value.length ? 0 : -1
            })
        }
    }
    // Handle special case for projects --filter
    else if (parts.length === 2 && parts[0] === 'projects' && parts[1] === '--filter') {
        command.value += ' '
        event.preventDefault()

        // Show all filter options
        nextTick(() => {
            suggestions.value = Object.keys(projectsFilterCommands).map(filter => `projects --filter ${filter}`)
            selectedIndex.value = suggestions.value.length ? 0 : -1
        })
    }
}

const handleInput = () => {
    const input = command.value.trim()
    if (!input) {
        suggestions.value = []
        selectedIndex.value = -1
        return
    }

    const parts = input.split(/\s+/)
    const lastPart = parts[parts.length - 1]

    // Logic for chunked autocompletion
    if (parts.length === 1) {
        // First level: Show only base commands
        suggestions.value = Object.keys(commandTree)
            .filter(cmd => cmd.startsWith(lastPart))
            .sort()
    } else if (parts.length === 2) {
        // Second level: Show subcommands for the base command
        const baseCommand = parts[0]

        if (commandTree[baseCommand] && commandTree[baseCommand].subcommands.length > 0) {
            suggestions.value = commandTree[baseCommand].subcommands
                .filter(subcmd => subcmd.startsWith(lastPart))
                .map(subcmd => `${baseCommand} ${subcmd}`)
                .sort()
        } else {
            suggestions.value = []
        }
    } else if (parts.length === 3 && parts[0] === 'projects' && parts[1] === '--filter') {
        // Third level: Available filters for projects
        suggestions.value = Object.keys(projectsFilterCommands)
            .filter(filter => filter.startsWith(lastPart))
            .map(filter => `projects --filter ${filter}`)
            .sort()
    } else {
        suggestions.value = []
    }

    selectedIndex.value = suggestions.value.length ? 0 : -1
}

const navigateAutocomplete = (direction) => {
    if (!suggestions.value.length) return
    selectedIndex.value = (selectedIndex.value + direction + suggestions.value.length) % suggestions.value.length
}

const applySuggestion = (text) => {
    command.value = text
    suggestions.value = []
    selectedIndex.value = -1
    nextTick(() => document.querySelector('input').focus())
}

const applySelectedSuggestion = () => {
    if (selectedIndex.value >= 0 && selectedIndex.value < suggestions.value.length) {
        applySuggestion(suggestions.value[selectedIndex.value])
    }
}
</script>

<style scoped>
.terminal-output-line {
    animation: terminalFade 0.3s ease-out;
    margin-bottom: 4px;
    white-space: pre-wrap;
    word-break: break-word;
}

@keyframes terminalFade {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>