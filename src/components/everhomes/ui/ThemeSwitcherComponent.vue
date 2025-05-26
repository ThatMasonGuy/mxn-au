<template>
    <button @click="toggleTheme"
        class="w-12 h-6 rounded-full flex items-center px-1 transition-all duration-300 ease-in-out" :class="[
            isDark ? 'bg-slate-800 justify-end' : 'bg-yellow-300 justify-start',
            'shadow-inner relative'
        ]" aria-label="Toggle theme">
        <transition name="fade" mode="out-in">
            <component :is="isDark ? MoonIcon : SunIcon" key="theme-icon" class="w-4 h-4 text-white drop-shadow" />
        </transition>

        <!-- Optional: glow effect -->
        <span class="absolute inset-0 rounded-full pointer-events-none transition-all duration-500 blur-sm"
            :class="isDark ? 'bg-indigo-700/30' : 'bg-yellow-400/30'" />
    </button>
</template>

<script setup>
import { ref, watchEffect, onMounted, computed } from 'vue'
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const theme = ref('light')
const isDark = computed(() => theme.value === 'dark')
const stored = localStorage.getItem('theme')

if (!stored) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  theme.value = prefersDark ? 'dark' : 'light'
}

function toggleTheme() {
    theme.value = isDark.value ? 'light' : 'dark'
    applyTheme()
}

function applyTheme() {
    const html = document.documentElement
    if (isDark.value) {
        html.classList.add('dark')
        localStorage.setItem('theme', 'dark')
    } else {
        html.classList.remove('dark')
        localStorage.setItem('theme', 'light')
    }
}

onMounted(() => {
    const stored = localStorage.getItem('theme')
    theme.value = stored === 'dark' ? 'dark' : 'light'
    applyTheme()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>