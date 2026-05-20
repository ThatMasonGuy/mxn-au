// src/shared/utils/useTerminal.js

import { ref, nextTick, onMounted } from 'vue'

export function useTerminal(options = {}) {
    const output = ref(null)
    const command = ref('')
    const suggestions = ref([])
    const selectedIndex = ref(-1)
    const showHelpPrompt = ref(true)
    const currentCompletion = ref(null)
    const userInfo = ref({})

    const navigate = typeof options.navigate === 'function' ? options.navigate : null

    const projectRoutes = [
        {
            key: 'server',
            path: '/server',
            label: 'Server',
            description: 'Browser SSH terminal, file editing, command history, and server operations.'
        },
        {
            key: 'translate',
            path: '/translate',
            label: 'Translate',
            description: 'AI translation workspace and Discord translation bot dashboard.'
        },
        {
            key: 'discord',
            path: '/discord',
            label: 'Discord Bots',
            description: 'Discord automation, translation, moderation, and community utilities.'
        },
        {
            key: 'daily',
            path: '/daily',
            label: 'Daily Games',
            description: 'Daily puzzles and replayable games built around quick sessions.'
        },
        {
            key: 'topheroes',
            path: '/topheroes',
            label: 'TopHeroes',
            description: 'Guild dashboards, player data, event tools, and calculators.'
        },
        {
            key: 'personal',
            path: '/personal',
            label: 'Personal',
            description: 'Private dashboards, notes, tracker tools, and journal workflows.'
        },
        {
            key: 'devtools',
            path: '/devtools',
            label: 'DevTools',
            description: 'Internal utilities for data, Firestore, generators, and side projects.'
        },
        {
            key: 'destiny',
            path: '/destiny',
            label: 'Destiny',
            description: 'Challenge planning, stats, and optimisation tools.'
        },
        {
            key: 'minecraft',
            path: '/minecraft',
            label: 'Minecraft',
            description: 'Server management, player dashboards, and activity tooling.'
        }
    ]

    const routeSuggestions = projectRoutes.flatMap(route => [route.key, route.path])
    const routeMap = projectRoutes.reduce((map, route) => {
        map[route.key] = route
        map[route.path] = route
        return map
    }, {})

    const commandTree = {
        help: { description: 'Show available commands.', subcommands: [] },
        ls: { description: 'List current MXN.au projects.', subcommands: ['projects', 'routes'] },
        projects: { description: 'Show project details.', subcommands: ['--active', '--routes'] },
        open: { description: 'Navigate to a project route.', subcommands: routeSuggestions },
        goto: { description: 'Alias for open.', subcommands: routeSuggestions },
        about: { description: 'Print a short profile summary.', subcommands: [] },
        stack: { description: 'Show the current site stack.', subcommands: [] },
        status: { description: 'Show what is active right now.', subcommands: [] },
        contact: { description: 'Show contact links.', subcommands: [] },
        repo: { description: 'Show the GitHub profile.', subcommands: [] },
        whoami: { description: 'Show browser session details.', subcommands: [] },
        date: { description: 'Print local date and time.', subcommands: [] },
        echo: { description: 'Print text back to the terminal.', subcommands: ['<text>'] },
        clear: { description: 'Clear the terminal output.', subcommands: [] }
    }

    commandTree.help.subcommands = Object.keys(commandTree)

    const commandOptions = [...Object.keys(commandTree), ...projectRoutes.map(route => route.key)]

    const appendLine = (text = '', tone = 'default') => {
        if (!output.value) return

        const div = document.createElement('div')
        div.className = `terminal-output-line terminal-output-line--${tone}`
        div.textContent = text
        output.value.appendChild(div)
        scrollToBottom()
    }

    const scrollToBottom = () => {
        nextTick(() => {
            if (output.value) {
                output.value.scrollTop = output.value.scrollHeight
            }
        })
    }

    const clearTerminal = () => {
        if (!output.value) return
        output.value.innerHTML = ''
        showHelpPrompt.value = true
    }

    const handleCommand = () => {
        const input = command.value.trim()
        if (!input) return

        showHelpPrompt.value = false
        suggestions.value = []
        selectedIndex.value = -1
        currentCompletion.value = null

        appendLine(`mxn@home:~$ ${input}`, 'prompt')

        const parts = input.split(/\s+/)
        const mainCommand = parts[0].toLowerCase()
        const args = parts.slice(1)

        if (handlers[mainCommand]) {
            handlers[mainCommand](args)
        } else if (resolveRouteTarget(mainCommand) && args.length === 0) {
            handlers.open([mainCommand])
        } else {
            appendLine(`Command not found: ${mainCommand}\nRun "help" to see the current command set.`, 'error')
        }

        command.value = ''
    }

    const handlers = {
        clear: () => clearTerminal(),
        help: args => showHelp(args),
        ls: args => listProjects(args),
        projects: args => showProjects(args),
        open: args => openTarget(args),
        goto: args => openTarget(args),
        about: () => appendLine(aboutText()),
        stack: () => appendLine(stackText()),
        status: () => appendLine(statusText()),
        contact: () => appendLine(contactText()),
        repo: () => appendLine('GitHub: https://github.com/ThatMasonGuy'),
        whoami: () => appendLine(formatUserInfo()),
        date: () => appendLine(new Intl.DateTimeFormat(undefined, {
            dateStyle: 'full',
            timeStyle: 'medium'
        }).format(new Date())),
        echo: args => appendLine(args.join(' ') || 'Nothing to echo.')
    }

    const showHelp = args => {
        const target = args[0]?.toLowerCase()

        if (target) {
            const route = resolveRouteTarget(target)
            if (route) {
                appendLine(`${route.key}\n  ${route.description}\n  open ${route.key} -> ${route.path}`)
                return
            }

            const commandMeta = commandTree[target]
            if (!commandMeta) {
                appendLine(`No help entry for "${target}".`, 'error')
                return
            }

            const subcommands = commandMeta.subcommands.length
                ? `\n  completions: ${commandMeta.subcommands.slice(0, 8).join(', ')}`
                : ''

            appendLine(`${target}\n  ${commandMeta.description}${subcommands}`)
            return
        }

        const rows = Object.entries(commandTree)
            .map(([name, meta]) => `  ${name.padEnd(10)} ${meta.description}`)
            .join('\n')

        appendLine(`Available commands:\n${rows}\n\nProject shortcuts:\n  ${projectRoutes.map(route => route.key).join(', ')}`)
    }

    const listProjects = args => {
        if (args.includes('routes')) {
            appendLine(projectRoutes.map(route => `${route.path.padEnd(14)} ${route.label}`).join('\n'))
            return
        }

        appendLine(projectRoutes.map(route => `${route.key}/`).join('  '))
    }

    const showProjects = args => {
        if (args.includes('--routes')) {
            appendLine(projectRoutes.map(route => `${route.label.padEnd(14)} ${route.path}`).join('\n'))
            return
        }

        if (args.includes('--active')) {
            appendLine([
                'Active focus:',
                '  server     Browser SSH terminal and operations panel',
                '  translate  AI translation app and Discord bot tooling',
                '  daily      Daily puzzle/game surface',
                '  topheroes  Guild data and event tooling'
            ].join('\n'))
            return
        }

        appendLine(projectRoutes.map(route => `${route.label.padEnd(14)} ${route.description}`).join('\n'))
    }

    const openTarget = args => {
        const target = args[0]
        if (!target) {
            appendLine(`Pick a route:\n${projectRoutes.map(route => `  open ${route.key.padEnd(10)} ${route.path}`).join('\n')}`)
            return
        }

        const route = resolveRouteTarget(target)
        if (!route) {
            appendLine(`Unknown route: ${target}\nTry: ${projectRoutes.map(item => item.key).join(', ')}`, 'error')
            return
        }

        appendLine(`Opening ${route.path}...`, 'success')

        if (navigate) {
            Promise.resolve(navigate(route.path)).catch(() => {})
        } else if (typeof window !== 'undefined') {
            window.location.href = route.path
        }
    }

    const resolveRouteTarget = value => {
        if (!value) return null
        const normalised = value.startsWith('/') ? value : value.toLowerCase()
        return routeMap[normalised] || routeMap[`/${normalised}`] || null
    }

    const aboutText = () => [
        'Mason Bartholomai / ThatMasonGuy',
        'Building practical web tools, automation, game helpers, and server workflows.',
        'This shell is wired to the current MXN.au project map instead of the old fake dashboard commands.'
    ].join('\n')

    const stackText = () => [
        'Frontend: Vue 3, Vite 7, TailwindCSS, Pinia',
        'Backend/services: Firebase, serverless functions, WebSocket SSH bridge',
        'Terminal layer: xterm.js in /server, lightweight command shell here on /'
    ].join('\n')

    const statusText = () => [
        'mxn.au status:',
        '  home       refreshed command shell',
        '  /server    active SSH terminal project',
        '  /translate active translation and Discord bot tooling',
        '  /daily     active games surface'
    ].join('\n')

    const contactText = () => [
        'GitHub:  https://github.com/ThatMasonGuy',
        'Discord: https://discord.com/users/358927850310598656'
    ].join('\n')

    const formatUserInfo = () => [
        'Session:',
        `  browser   ${userInfo.value.browser || 'Unknown'}`,
        `  language  ${userInfo.value.language || 'Unknown'}`,
        `  platform  ${userInfo.value.platform || 'Unknown'}`,
        `  timezone  ${userInfo.value.timezone || 'Unknown'}`,
        `  viewport  ${userInfo.value.resolution || 'Unknown'}`
    ].join('\n')

    const getCompletionState = () => {
        const raw = command.value
        const hasTrailingSpace = /\s$/.test(raw)
        const parts = raw.trimStart().split(/\s+/).filter(Boolean)
        const commandName = parts[0]?.toLowerCase() || ''

        if (!commandName || (parts.length === 1 && !hasTrailingSpace)) {
            return {
                mode: 'command',
                token: commandName,
                options: commandOptions
            }
        }

        const commandMeta = commandTree[commandName]
        if (!commandMeta?.subcommands?.length) return null

        return {
            mode: 'subcommand',
            commandName,
            token: hasTrailingSpace ? '' : parts[parts.length - 1],
            options: commandMeta.subcommands
        }
    }

    const handleInput = () => {
        const state = getCompletionState()
        currentCompletion.value = state

        if (!state) {
            suggestions.value = []
            selectedIndex.value = -1
            return
        }

        const token = state.token.toLowerCase()
        suggestions.value = state.options
            .filter(option => option.toLowerCase().startsWith(token))
            .slice(0, 8)

        selectedIndex.value = suggestions.value.length ? 0 : -1
    }

    const handleSpace = event => {
        const input = command.value.trim()
        if (!input) return

        const meta = commandTree[input.toLowerCase()]
        if (!meta?.subcommands?.length) return

        event.preventDefault()
        command.value = `${input} `
        suggestions.value = meta.subcommands.slice(0, 8)
        currentCompletion.value = {
            mode: 'subcommand',
            commandName: input.toLowerCase(),
            token: '',
            options: meta.subcommands
        }
        selectedIndex.value = suggestions.value.length ? 0 : -1
    }

    const navigateAutocomplete = direction => {
        if (!suggestions.value.length) return
        selectedIndex.value = (selectedIndex.value + direction + suggestions.value.length) % suggestions.value.length
    }

    const applySuggestion = text => {
        const state = currentCompletion.value || getCompletionState()
        const raw = command.value
        const hasTrailingSpace = /\s$/.test(raw)
        const parts = raw.trimStart().split(/\s+/).filter(Boolean)

        if (!state || state.mode === 'command') {
            command.value = commandTree[text]?.subcommands?.length ? `${text} ` : text
        } else {
            if (hasTrailingSpace) {
                command.value = `${parts.join(' ')} ${text}`
            } else {
                parts[parts.length - 1] = text
                command.value = parts.join(' ')
            }
        }

        suggestions.value = []
        selectedIndex.value = -1
        currentCompletion.value = null

        nextTick(() => {
            if (/\s$/.test(command.value)) {
                handleInput()
            }
        })
    }

    const applySelectedSuggestion = () => {
        if (selectedIndex.value >= 0 && selectedIndex.value < suggestions.value.length) {
            applySuggestion(suggestions.value[selectedIndex.value])
        }
    }

    const describeSuggestion = text => {
        const route = resolveRouteTarget(text)
        if (route) return route.description
        return commandTree[text]?.description || ''
    }

    onMounted(() => {
        userInfo.value = {
            browser: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            resolution: `${window.innerWidth}x${window.innerHeight}`
        }
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
        describeSuggestion
    }
}
