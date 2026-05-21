<template>
    <header class="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-14 sm:h-16">
                <!-- Brand -->
                <RouterLink to="/everhomes" class="flex items-center gap-2.5 group shrink-0">
                    <div class="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center group-hover:bg-teal-500/25 transition-colors duration-200">
                        <House class="w-4 h-4 text-teal-400" />
                    </div>
                    <div class="flex flex-col leading-none">
                        <span class="text-white font-bold text-sm sm:text-base tracking-tight">Everhomes</span>
                        <span class="text-teal-400 text-[10px] sm:text-xs font-medium tracking-widest uppercase">Tools</span>
                    </div>
                </RouterLink>

                <!-- Right nav -->
                <nav class="flex items-center gap-1">
                    <RouterLink
                        to="/everhomes"
                        class="text-slate-400 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-slate-800"
                    >
                        All Tools
                    </RouterLink>

                    <div class="w-px h-4 bg-slate-800 mx-0.5 hidden sm:block" />

                    <RouterLink
                        to="/everhomes/admin"
                        class="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs font-medium transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-slate-800"
                    >
                        <Settings class="w-3.5 h-3.5" />
                        <span class="hidden sm:inline">Admin</span>
                    </RouterLink>
                </nav>
            </div>
        </div>
    </header>
</template>

<script setup>
import { House, Settings } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
</script>
