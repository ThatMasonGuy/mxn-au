<template>
    <header class="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/60 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-14 sm:h-16">
                <!-- Logo / Brand -->
                <RouterLink to="/everhomes" class="flex items-center gap-2.5 group shrink-0">
                    <div class="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center group-hover:bg-teal-500/30 transition-colors duration-200">
                        <HomeIcon class="w-4 h-4 text-teal-400" />
                    </div>
                    <div class="flex flex-col leading-none">
                        <span class="text-white font-bold text-sm sm:text-base tracking-tight">Everhomes</span>
                        <span class="text-teal-400 text-[10px] sm:text-xs font-medium tracking-widest uppercase">Tools</span>
                    </div>
                </RouterLink>

                <!-- Right side: nav link back to hub + optional -->
                <nav class="flex items-center gap-2 sm:gap-3">
                    <RouterLink to="/everhomes"
                        class="text-slate-400 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 px-2 py-1 rounded-md hover:bg-white/5">
                        All Tools
                    </RouterLink>
                </nav>
            </div>
        </div>
    </header>
</template>

<script setup>
import { HomeIcon } from '@heroicons/vue/24/solid'
</script>
