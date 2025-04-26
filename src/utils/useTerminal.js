// src/composables/useTerminal.js

import { ref, nextTick, onMounted } from 'vue'

export function useTerminal() {
    // Refs
    const output = ref(null)
    const command = ref('')
    const suggestions = ref([])
    const selectedIndex = ref(-1)
    const showHelpPrompt = ref(true)

    const userInfo = ref({})

    // Command definitions
    const commandTree = {
        help: { description: 'Lists available commands', subcommands: [] },
        whoami: { description: 'Shows browser/system info', subcommands: [] },
        skills: { description: 'Lists technical skills', subcommands: [] },
        goals: { description: 'Lists professional goals', subcommands: [] },
        motto: { description: 'Personal motto', subcommands: [] },
        github: { description: 'GitHub profile link', subcommands: [] },
        fortune: { description: 'Random programming quote', subcommands: [] },
        clear: { description: 'Clears the terminal', subcommands: [] },
        echo: { description: 'Echo back text', subcommands: ['<text>'] },
        projects: { description: 'Project list', subcommands: ['--all', '--filter'] },
        goto: { description: 'Fake navigation', subcommands: ['about', 'skills', 'dashboard'] },
        animate: { description: 'Trigger animations', subcommands: ['bounce', 'pulse'] },
    }

    const projectsFilterCommands = {
        bot: 'Show bot-related projects',
        minecraft: 'Show Minecraft-related projects'
    }

    // --- Basic helpers ---
    const appendLine = (text) => {
        if (!output.value) return
        const div = document.createElement('div')
        div.className = 'terminal-output-line'
        div.innerText = text
        output.value.appendChild(div)
        scrollToBottom()
    }

    const appendHtml = (html) => {
        if (!output.value) return
        const div = document.createElement('div')
        div.className = 'terminal-output-line'
        div.innerHTML = html
        output.value.appendChild(div)
        scrollToBottom()
    }

    const scrollToBottom = () => {
        nextTick(() => {
            if (output.value) output.value.scrollTop = output.value.scrollHeight
        })
    }

    const clearTerminal = () => {
        if (!output.value) return
        output.value.innerHTML = ''
        showHelpPrompt.value = true
    }

    // --- Commands Handling ---
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

        if (handlers[mainCommand]) {
            handlers[mainCommand](args)
        } else {
            appendLine(`Unknown command: '${mainCommand}'. Try 'help'.`)
        }

        command.value = ''
    }

    const handlers = {
        clear: () => clearTerminal(),
        whoami: () => appendLine(formatUserInfo()),
        help: (args) => showHelp(args),
        skills: () => appendLine(skillsText),
        goals: () => appendLine(goalsText),
        motto: () => appendLine('"Build once. Automate forever."'),
        github: () => appendLine('Visit: https://github.com/ThatMasonGuy'),
        fortune: () => appendLine(randomFortune()),
        echo: (args) => appendLine(args.join(' ') || 'Nothing to echo.'),
        projects: (args) => showProjects(args),
        goto: (args) => appendLine(`(Fake navigation to: ${args[0] || '?'})`),
        animate: (args) => triggerAnimation(args)
    }

    const skillsText = `Frontend: Vue 3, TailwindCSS\nBackend: Node.js, Firebase\nDevOps: Docker, PM2\nDBs: Firestore, Postgres`
    const goalsText = `\u2022 Build products I actually use\n\u2022 Automate repetitive tasks\n\u2022 Support open-source tools`
    const fortunes = [
        'Any sufficiently advanced bug is indistinguishable from a feature.',
        'The best thing about a boolean is even if you\'re wrong, you\'re only off by a bit.',
        'Debugging is like being the detective in a crime movie where you\'re also the murderer.'
    ]

    const randomFortune = () => fortunes[Math.floor(Math.random() * fortunes.length)]

    const formatUserInfo = () => `User Info:\nBrowser: ${userInfo.value.browser}\nLanguage: ${userInfo.value.language}\nTimezone: ${userInfo.value.timezone}\nResolution: ${userInfo.value.resolution}\nIP: ${userInfo.value.ip || '...'} `

    const showHelp = (args) => {
        if (args.length) {
            const cmd = args[0]
            if (commandTree[cmd]) {
                appendLine(`${cmd}: ${commandTree[cmd].description}`)
            } else appendLine(`No help for '${cmd}'`)
        } else {
            appendLine('Commands:\n' + Object.keys(commandTree).sort().join(', '))
        }
    }

    const showProjects = (args) => {
        if (args.includes('--all')) {
            appendLine('All Projects: Dashboard, Bot, Plugin Updater...')
        } else if (args.includes('--filter')) {
            const type = args[args.indexOf('--filter') + 1]
            if (projectsFilterCommands[type]) {
                appendLine(`Filtered: ${type}`)
            } else {
                appendLine('Unknown filter')
            }
        } else {
            appendLine('Recent: Dashboard, Mase-Translate')
        }
    }

    const triggerAnimation = (args) => {
        const anim = args[0]
        if (['bounce', 'pulse'].includes(anim)) {
            appendHtml(`<div class=\"animate-${anim} w-4 h-4 bg-blue-400 rounded-full inline-block\"></div> Animation!`)
        } else {
            appendLine('Unknown animation.')
        }
    }

    // --- Suggestion + Input Helpers ---
    const handleInput = () => {
        const parts = command.value.trim().split(/\s+/)
        const lastPart = parts[parts.length - 1]

        if (parts.length === 1) {
            suggestions.value = Object.keys(commandTree).filter(cmd => cmd.startsWith(lastPart))
        } else if (parts.length === 2 && commandTree[parts[0]]) {
            suggestions.value = commandTree[parts[0]].subcommands.filter(sub => sub.startsWith(lastPart))
        } else {
            suggestions.value = []
        }
        selectedIndex.value = suggestions.value.length ? 0 : -1
    }

    const handleSpace = (e) => {
        if (!command.value.trim()) return
        const parts = command.value.trim().split(/\s+/)

        if (parts.length === 1 && commandTree[parts[0]]?.subcommands.length) {
            e.preventDefault()
            command.value += ' '
            suggestions.value = commandTree[parts[0]].subcommands
        }
    }

    const navigateAutocomplete = (dir) => {
        if (!suggestions.value.length) return
        selectedIndex.value = (selectedIndex.value + dir + suggestions.value.length) % suggestions.value.length
    }

    const applySuggestion = (text) => {
        command.value = text
        suggestions.value = []
        selectedIndex.value = -1
    }

    const applySelectedSuggestion = () => {
        if (selectedIndex.value >= 0 && selectedIndex.value < suggestions.value.length) {
            applySuggestion(suggestions.value[selectedIndex.value])
        }
    }

    // --- Mount Info ---
    onMounted(() => {
        userInfo.value = {
            browser: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            resolution: `${window.innerWidth}x${window.innerHeight}`
        }
        fetch('https://api.ipify.org?format=json')
            .then(r => r.json())
            .then(d => userInfo.value.ip = d.ip)
            .catch(() => userInfo.value.ip = 'Unavailable')
    })

    return {
        output,
        command,
        suggestions,
        selectedIndex,
        showHelpPrompt,
        handleCommand,
        handleInput,
        handleSpace,
        navigateAutocomplete,
        applySuggestion,
        applySelectedSuggestion,
    }
}