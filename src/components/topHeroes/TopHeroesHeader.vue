<template>
    <header :class="[
        'fixed top-0 z-50 w-full transition-transform duration-300 backdrop-blur-md border-b border-white/10 bg-black/30',
        isHidden ? '-translate-y-full' : 'translate-y-0'
    ]">
        <div class="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
            <!-- Logo / Title -->
            <RouterLink to="/" class="text-xl sm:text-2xl font-extrabold text-white hover:text-pink-400 transition">
                🌌 Velaris
            </RouterLink>

            <!-- Breadcrumbs -->
            <nav v-if="breadcrumbs.length > 1" class="text-sm text-white/80 hidden sm:flex space-x-2">
                <span v-for="(crumb, i) in breadcrumbs" :key="i" class="flex items-center">
                    <span class="capitalize text-white hover:text-pink-400 transition">
                        <RouterLink :to="crumb.path">{{ crumb.label }}</RouterLink>
                    </span>
                    <span v-if="i < breadcrumbs.length - 1" class="mx-1 text-white/50">›</span>
                </span>
            </nav>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const isHidden = ref(false)
let lastScrollY = window.scrollY

const handleScroll = () => {
    const currentScroll = window.scrollY
    isHidden.value = currentScroll > lastScrollY && currentScroll > 80
    lastScrollY = currentScroll
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

// Breadcrumb Generator
const route = useRoute()
const breadcrumbs = computed(() => {
    const segments = route.path.split('/').filter(Boolean)
    const paths = []
    let path = ''

    for (const seg of segments) {
        path += `/${seg}`
        paths.push({ label: seg.replace(/-/g, ' '), path })
    }
    return paths
})
</script>

<style scoped>
header {
    backdrop-filter: blur(12px);
}
</style>