import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    function getDefaultTheme() {
        if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
            return 'velarisDark'
        }
        return 'velaris'
    }

    const currentTheme = ref(getDefaultTheme())

    // Migrate legacy "Normal" themes to Velaris auto on load
    const legacy = new Set(['lightColour', 'darkColour', 'light', 'dark'])
    if (legacy.has(currentTheme.value)) {
        currentTheme.value = getDefaultTheme()
    }

    // --- Core class applier used by both 'watch' and preview ---
    function applyClasses(themeName) {
        const root = document.documentElement
        root.classList.remove('theme-velaris', 'froggy', 'dark')

        switch (themeName) {
            case 'velaris':
                root.classList.add('theme-velaris')
                break
            case 'velarisDark':
                root.classList.add('theme-velaris', 'dark')
                break
            case 'froggy':
                root.classList.add('froggy', 'theme-velaris')
                break
            case 'froggyDark':
                root.classList.add('froggy', 'theme-velaris', 'dark')
                break
            default:
                // no-op (unknown themes ignored)
                break
        }
    }

    // Apply theme to document when it changes (persisted application)
    watch(currentTheme, (newTheme) => applyClasses(newTheme), { immediate: true })

    // Persisted setter
    function setTheme(theme) {
        currentTheme.value = theme
    }

    // ---- Preview-only (no persistence) ----
    function previewTheme(theme) {
        applyClasses(theme)
    }
    function reapplyCurrentTheme() {
        applyClasses(currentTheme.value)
    }

    // Theme building helper (ONLY velaris/froggy)
    function buildThemeName(style, scheme) {
        const s = scheme === 'froggy' ? 'froggy' : 'velaris' // default to velaris if unknown
        if (style === 'auto') {
            const prefersDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
            return prefersDark ? `${s}Dark` : s
        }
        return style === 'dark' ? `${s}Dark` : s
    }

    // Parse current theme into style and scheme (no "Normal")
    function parseTheme(theme = currentTheme.value) {
        if (theme.includes('froggy')) {
            return { scheme: 'froggy', style: theme.includes('Dark') ? 'dark' : 'light' }
        } else if (theme.includes('velaris')) {
            return { scheme: 'velaris', style: theme.includes('Dark') ? 'dark' : 'light' }
        } else {
            return { scheme: 'velaris', style: 'auto' } // fallback
        }
    }

    return {
        currentTheme,
        setTheme,
        previewTheme,
        reapplyCurrentTheme,
        buildThemeName,
        parseTheme
    }
}, {
    persist: {
        key: 'themeStore',
        paths: ['currentTheme'],
        storage: localStorage
    }
})
