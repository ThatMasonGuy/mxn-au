<template>
    <header :class="[
        'fixed top-0 z-50 w-full transition-all duration-300 border-b border-white/10',
        isHidden ? '-translate-y-full' : 'translate-y-0'
    ]">
        <div class="glass px-4 sm:px-6 py-3.5">
            <div class="max-w-7xl mx-auto flex items-center justify-between">
                
                <!-- Left: Logo & Breadcrumbs -->
                <div class="flex items-center gap-6">
                    <!-- Back to Home -->
                    <RouterLink to="/" class="group hidden md:flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                        <Home class="w-4 h-4" />
                        <span class="text-sm">MXN</span>
                    </RouterLink>
                    
                    <div class="hidden md:block w-px h-6 bg-white/10" />
                    
                    <!-- TopHeroes Logo -->
                    <RouterLink to="/topheroes" class="flex items-center gap-2 group">
                        <div class="relative">
                            <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div class="relative bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-lg p-1.5">
                                <Sword class="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <span class="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                            TopHeroes
                        </span>
                    </RouterLink>

                    <!-- Breadcrumbs -->
                    <nav v-if="breadcrumbs.length > 1" class="hidden lg:flex items-center gap-2 text-sm">
                        <ChevronRight class="w-4 h-4 text-white/30" />
                        <span v-for="(crumb, i) in breadcrumbs.slice(1)" :key="i" class="flex items-center gap-2">
                            <RouterLink 
                                :to="crumb.path" 
                                :class="[
                                    'capitalize transition-colors',
                                    i === breadcrumbs.length - 2 
                                        ? 'text-purple-400 font-medium' 
                                        : 'text-white/60 hover:text-white'
                                ]">
                                {{ crumb.label }}
                            </RouterLink>
                            <ChevronRight v-if="i < breadcrumbs.length - 2" class="w-4 h-4 text-white/30" />
                        </span>
                    </nav>
                </div>

                <!-- Right: Quick Links -->
                <div class="hidden md:flex items-center gap-4">
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <RouterLink 
                                to="/topheroes/tools" 
                                class="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                <Wrench class="w-4 h-4" />
                                <span>Tools</span>
                            </RouterLink>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>TopHeroes Tools</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger as-child>
                            <RouterLink 
                                to="/topheroes/events" 
                                class="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                <Trophy class="w-4 h-4" />
                                <span>Events</span>
                            </RouterLink>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Event Guides</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger as-child>
                            <RouterLink 
                                to="/topheroes/velaris" 
                                class="flex items-center gap-2 px-3 py-2 text-sm text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-all">
                                <Shield class="w-4 h-4" />
                                <span>Velaris</span>
                            </RouterLink>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Velaris Guild Hub</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                <!-- Mobile Menu Button -->
                <NavigationDrawer base="/topheroes" />
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
    Home, 
    Sword, 
    ChevronRight, 
    Wrench, 
    Trophy, 
    Shield 
} from 'lucide-vue-next'
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from '@/components/ui/tooltip'
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
.glass {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(16px);
}
</style>