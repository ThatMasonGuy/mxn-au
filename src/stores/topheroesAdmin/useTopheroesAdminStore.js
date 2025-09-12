// stores/useTopheroesAdminStore.js
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useTopheroesAdminStore = defineStore('topheroesAdmin', () => {
    // Theme management
    const themeMode = ref('auto') // 'light', 'dark', 'auto'
    const themeVariant = ref('velaris') // 'velaris', 'froggy'
    const systemPrefersDark = ref(false)

    // Dashboard preferences
    const sidebarExpanded = ref(true)
    const compactKPIs = ref(false)

    // Language and timezone
    const language = ref('en')
    const timezone = ref('AEST')

    // Computed for actual dark mode state
    const isDark = computed(() => {
        if (themeMode.value === 'auto') {
            return systemPrefersDark.value
        }
        return themeMode.value === 'dark'
    })

    // Computed for full theme string
    const currentTheme = computed(() => {
        if (themeVariant.value === 'froggy') {
            return 'froggy'
        }
        return themeMode.value
    })

    // Initialize system preference detection
    function initSystemPreference() {
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            systemPrefersDark.value = mediaQuery.matches

            mediaQuery.addEventListener('change', (e) => {
                systemPrefersDark.value = e.matches
                applyTheme()
            })
        }
    }

    // Apply theme to DOM
    function applyTheme() {
        if (typeof document === 'undefined') return

        const el = document.documentElement

        // Remove all theme classes first
        el.classList.remove('dark', 'theme-velaris', 'froggy')

        // Always add base theme class
        el.classList.add('theme-velaris')

        // Add variant class if needed
        if (themeVariant.value === 'froggy') {
            el.classList.add('froggy')
        }

        // Add dark class if needed
        if (isDark.value) {
            el.classList.add('dark')
        }

        // Store in localStorage
        localStorage.setItem('topheroes-theme-mode', themeMode.value)
        localStorage.setItem('topheroes-theme-variant', themeVariant.value)
    }

    // Set theme with both mode and variant
    function setTheme(mode, variant = null) {
        if (variant === 'froggy') {
            themeVariant.value = 'froggy'
            // Froggy can work in both light and dark
            if (mode && mode !== 'froggy') {
                themeMode.value = mode
            }
        } else {
            themeVariant.value = 'velaris'
            themeMode.value = mode || 'auto'
        }
        applyTheme()
    }

    // Quick theme setters
    function setLightTheme() {
        setTheme('light', 'velaris')
    }

    function setDarkTheme() {
        setTheme('dark', 'velaris')
    }

    function setAutoTheme() {
        setTheme('auto', 'velaris')
    }

    function setFroggyTheme() {
        setTheme(themeMode.value, 'froggy')
    }

    // Toggle dark mode (preserves variant)
    function toggleDarkMode() {
        if (themeMode.value === 'auto') {
            themeMode.value = isDark.value ? 'light' : 'dark'
        } else {
            themeMode.value = themeMode.value === 'dark' ? 'light' : 'dark'
        }
        applyTheme()
    }

    // Initialize from localStorage
    function initFromStorage() {
        if (typeof localStorage === 'undefined') return

        const savedMode = localStorage.getItem('topheroes-theme-mode')
        const savedVariant = localStorage.getItem('topheroes-theme-variant')
        const savedSidebar = localStorage.getItem('topheroes-sidebar-expanded')
        const savedCompact = localStorage.getItem('topheroes-compact-kpis')
        const savedLang = localStorage.getItem('topheroes-language')
        const savedTz = localStorage.getItem('topheroes-timezone')

        if (savedMode) themeMode.value = savedMode
        if (savedVariant) themeVariant.value = savedVariant
        if (savedSidebar !== null) sidebarExpanded.value = savedSidebar === 'true'
        if (savedCompact !== null) compactKPIs.value = savedCompact === 'true'
        if (savedLang) language.value = savedLang
        if (savedTz) timezone.value = savedTz

        applyTheme()
    }

    // Save other preferences
    function savePreferences() {
        if (typeof localStorage === 'undefined') return

        localStorage.setItem('topheroes-sidebar-expanded', sidebarExpanded.value.toString())
        localStorage.setItem('topheroes-compact-kpis', compactKPIs.value.toString())
        localStorage.setItem('topheroes-language', language.value)
        localStorage.setItem('topheroes-timezone', timezone.value)
    }

    // Watch for preference changes
    watch([sidebarExpanded, compactKPIs, language, timezone], savePreferences)

    // Initialize on mount
    function init() {
        initSystemPreference()
        initFromStorage()
    }

    return {
        // State
        themeMode,
        themeVariant,
        isDark,
        currentTheme,
        sidebarExpanded,
        compactKPIs,
        language,
        timezone,

        // Actions
        init,
        setTheme,
        setLightTheme,
        setDarkTheme,
        setAutoTheme,
        setFroggyTheme,
        toggleDarkMode,
        applyTheme,
        savePreferences
    }
}, {
    persist: true // Using pinia-plugin-persistedstate
})