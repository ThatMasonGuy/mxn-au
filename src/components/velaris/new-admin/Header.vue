<!-- Header.vue -->
<template>
    <header class="sticky top-0 z-40 h-16">
        <div class="h-full bg-gradient-to-r from-velaris-purple via-velaris-teal to-velaris-green">
            <div class="flex h-full items-center gap-3 px-4">
                <!-- Mobile toggle -->
                <button
                    class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-black/10 backdrop-blur hover:bg-black/20 transition lg:hidden"
                    @click="$emit('toggle-sidebar')" aria-label="Toggle sidebar">
                    <Menu class="h-5 w-5 text-white" />
                </button>

                <div class="flex items-center gap-2 text-white">
                    <img :src="VLR" alt="VLR" class="h-7 w-7" style="filter: brightness(0) invert(1)" />
                    <span class="font-semibold tracking-wide">Velaris Admin</span>
                </div>

                <!-- Search (centered width limited) -->
                <div class="relative ml-4 hidden flex-1 md:flex">
                    <div class="mx-auto w-full max-w-7xl">
                        <div class="relative">
                            <input type="search" placeholder="Search members, events, logs…"
                                class="w-full rounded-md bg-white/15 pl-9 pr-3 py-2 text-white placeholder-white/70 outline-none ring-1 ring-white/25 focus:ring-white/60 transition" />
                            <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white" />
                        </div>
                    </div>
                </div>

                <div class="ml-auto flex items-center gap-2">
                    <button
                        class="hidden sm:inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-2 text-sm text-white ring-1 ring-white/25 hover:bg-white/25 transition">
                        <span class="inline-block h-2 w-2 rounded-full bg-velaris-green"></span>
                        Sync Stats
                    </button>
                    <button
                        class="hidden sm:inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-2 text-sm text-white ring-1 ring-white/25 hover:bg-white/25 transition">
                        <span class="inline-block h-2 w-2 rounded-full bg-velaris-teal"></span>
                        Run Audit
                    </button>

                    <button
                        class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/15 ring-1 ring-white/25 hover:bg-white/25 transition"
                        @click="store.toggleDarkMode()" :aria-pressed="store.isDark" aria-label="Toggle dark mode">
                        <Sun v-if="!store.isDark" class="h-5 w-5 text-white" />
                        <Moon v-else class="h-5 w-5 text-white" />
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { onMounted } from 'vue'
import VLR from '@/assets/icons/VLR.svg'
import { Menu, Search, Sun, Moon } from 'lucide-vue-next'
import { useTopheroesAdminStore } from '@/stores/topheroesAdmin/useTopheroesAdminStore'

defineEmits(['toggle-sidebar'])

const store = useTopheroesAdminStore()

// Initialize theme on mount
onMounted(() => {
    store.init()
})
</script>