<template>
    <header :class="[
        'fixed top-0 z-50 w-full transition-transform duration-300 border-b border-white/10 bg-black/30 backdrop-blur-md',
        isHidden ? '-translate-y-full' : 'translate-y-0'
    ]">
        <div class="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
            <!-- Logo / Title -->
            <RouterLink to="/topheroes"
                class="text-xl sm:text-2xl font-extrabold text-white hover:text-pink-400 transition">
                ⚔️ TopHeroes
            </RouterLink>

            <!-- Breadcrumbs -->
            <nav v-if="breadcrumbs.length > 1" class="hidden sm:flex space-x-2 text-sm text-white/80">
                <span v-for="(crumb, i) in breadcrumbs" :key="i" class="flex items-center">
                    <RouterLink :to="crumb.path" class="capitalize text-white hover:text-pink-400 transition">
                        {{ crumb.label }}
                    </RouterLink>
                    <span v-if="i < breadcrumbs.length - 1" class="mx-2 text-white/50">›</span>
                </span>
            </nav>

            <!-- Mobile Nav Drawer -->
            <NavigationDrawer base="/topheroes" />
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import NavigationDrawer from '@/components/common/NavigationDrawer.vue'

const route = useRoute()
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

summary::-webkit-details-marker {
    display: none;
}
</style>