<!-- components/ui/ThemeSwitcher.vue -->
<template>
    <button @click="toggleTheme"
        class="fixed top-4 right-4 z-50 p-3 bg-card border border-border rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        <component :is="isDark ? Sun : Moon" class="h-5 w-5 text-foreground" />
    </button>
</template>

<script setup>
import { computed } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/useThemeStore'

const themeStore = useThemeStore()

const isDark = computed(() => {
    return themeStore.currentTheme.includes('Dark')
})

const toggleTheme = () => {
    const { scheme } = themeStore.parseTheme()
    const newStyle = isDark.value ? 'light' : 'dark'
    const newTheme = themeStore.buildThemeName(newStyle, scheme)
    themeStore.setTheme(newTheme)
}
</script>