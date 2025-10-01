<!-- DiscordHeader.vue -->
<template>
    <header class="sticky top-0 z-40 h-16">
        <div class="h-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500">
            <div class="flex h-full items-center gap-3 px-4">
                <!-- Mobile toggle -->
                <button
                    class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-black/10 backdrop-blur hover:bg-black/20 transition lg:hidden"
                    @click="$emit('toggle-sidebar')" aria-label="Toggle sidebar">
                    <Menu class="h-5 w-5 text-white" />
                </button>

                <div class="flex items-center gap-2 text-white">
                    <div class="h-7 w-7 rounded-lg bg-white/20 flex items-center justify-center">
                        <Bot class="h-5 w-5" />
                    </div>
                    <span class="font-semibold tracking-wide">Translation Bot Dashboard</span>
                </div>

                <!-- Search (centered width limited) -->
                <div class="relative ml-4 hidden flex-1 md:flex">
                    <div class="mx-auto w-full max-w-7xl">
                        <div class="relative">
                            <input type="search" placeholder="Search servers, settings, logs..."
                                class="w-full rounded-md bg-white/15 pl-9 pr-3 py-2 text-white placeholder-white/70 outline-none ring-1 ring-white/25 focus:ring-white/60 transition" />
                            <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white" />
                        </div>
                    </div>
                </div>

                <div class="ml-auto flex items-center gap-2">
                    <!-- Bot Status -->
                    <div
                        class="hidden sm:inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white bg-white/15 ring-1 ring-white/25">
                        <span :class="[
                            'inline-block h-2 w-2 rounded-full',
                            botStatus === 'online' ? 'bg-green-400 animate-pulse' :
                                botStatus === 'partial' ? 'bg-amber-400' : 'bg-red-400'
                        ]"></span>
                        {{ botStatusText }}
                    </div>

                    <!-- Sync Button -->
                    <button @click="syncBotData" :disabled="isSyncing" :class="[
                        'hidden sm:inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white ring-1 ring-white/25 transition',
                        isSyncing
                            ? 'bg-white/25 cursor-not-allowed'
                            : 'bg-white/15 hover:bg-white/25'
                    ]">
                        <RefreshCw :class="['h-4 w-4', { 'animate-spin': isSyncing }]" />
                        {{ isSyncing ? 'Syncing...' : 'Sync' }}
                    </button>

                    <!-- Mobile Actions Dropdown -->
                    <div class="relative sm:hidden">
                        <button @click="showMobileActions = !showMobileActions"
                            class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/15 ring-1 ring-white/25 hover:bg-white/25 transition">
                            <MoreVertical class="h-4 w-4 text-white" />
                        </button>

                        <!-- Mobile Actions Menu -->
                        <div v-if="showMobileActions"
                            class="absolute right-0 top-full mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black/10 z-50"
                            @click="showMobileActions = false">
                            <div class="py-1">
                                <button @click="syncBotData" :disabled="isSyncing"
                                    class="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-foreground/5 disabled:opacity-50">
                                    <RefreshCw :class="['h-4 w-4', { 'animate-spin': isSyncing }]" />
                                    {{ isSyncing ? 'Syncing...' : 'Sync Bot Data' }}
                                </button>
                                <button @click="store.toggleDarkMode()"
                                    class="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-foreground/5">
                                    <Sun v-if="!store.isDark" class="h-4 w-4" />
                                    <Moon v-else class="h-4 w-4" />
                                    Toggle Theme
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Dark Mode Toggle -->
                    <button
                        class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/15 ring-1 ring-white/25 hover:bg-white/25 transition"
                        @click="store.toggleDarkMode()" :aria-pressed="store.isDark" aria-label="Toggle dark mode">
                        <Sun v-if="!store.isDark" class="h-5 w-5 text-white" />
                        <Moon v-else class="h-5 w-5 text-white" />
                    </button>

                    <!-- User Menu -->
                    <div v-if="store.user" class="relative">
                        <button @click="showUserMenu = !showUserMenu"
                            class="flex items-center gap-2 rounded-md bg-white/15 px-3 py-2 ring-1 ring-white/25 hover:bg-white/25 transition">
                            <div
                                class="h-6 w-6 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white text-xs font-bold">
                                {{ getUserInitials(store.user.username) }}
                            </div>
                            <span class="hidden md:inline text-sm text-white">{{ store.user.username }}</span>
                            <ChevronDown class="h-4 w-4 text-white" />
                        </button>

                        <!-- User Dropdown -->
                        <div v-if="showUserMenu"
                            class="absolute right-0 top-full mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black/10 z-50"
                            @click="showUserMenu = false">
                            <div class="py-1">
                                <div class="px-4 py-2 border-b border-gray-100">
                                    <div class="text-sm font-medium text-gray-900">{{ store.user.username }}</div>
                                    <div class="text-xs text-gray-500">{{ store.user.email || 'Discord User' }}</div>
                                </div>
                                <button @click="logout"
                                    class="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                    <LogOut class="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Status Toast for Actions -->
        <div v-if="statusToast.show" :class="[
            'fixed top-20 right-4 z-50 rounded-lg px-4 py-3 text-sm text-white shadow-lg transition-all transform',
            statusToast.type === 'success' ? 'bg-green-500' :
                statusToast.type === 'error' ? 'bg-red-500' : 'bg-violet-500'
        ]">
            <div class="flex items-center gap-2">
                <CheckCircle v-if="statusToast.type === 'success'" class="h-4 w-4" />
                <AlertCircle v-else-if="statusToast.type === 'error'" class="h-4 w-4" />
                <RefreshCw v-else class="h-4 w-4 animate-spin" />
                <span>{{ statusToast.message }}</span>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
    Menu, Search, Sun, Moon, MoreVertical, CheckCircle, AlertCircle,
    RefreshCw, LogOut, ChevronDown, Bot
} from 'lucide-vue-next'
import { useDiscordBotStore } from '@/stores/useDiscordBotStore'

defineEmits(['toggle-sidebar'])

const store = useDiscordBotStore()

// Local state
const showMobileActions = ref(false)
const showUserMenu = ref(false)
const isSyncing = ref(false)
const statusToast = ref({
    show: false,
    type: 'info', // 'success', 'error', 'info'
    message: ''
})

// Computed properties
const botStatus = computed(() => {
    if (!store.selectedServer) return 'offline'
    return store.botServers.includes(store.selectedServer.id) ? 'online' : 'offline'
})

const botStatusText = computed(() => {
    switch (botStatus.value) {
        case 'online': return 'Bot Online'
        case 'partial': return 'Partial Access'
        default: return 'Bot Offline'
    }
})

// Helper functions
const getUserInitials = (username) => {
    return username.slice(0, 2).toUpperCase()
}

// Actions
const syncBotData = async () => {
    if (isSyncing.value) return

    isSyncing.value = true
    showToast('info', 'Syncing bot data...')

    try {
        await store.refreshBotData()
        showToast('success', 'Bot data synced successfully')
    } catch (error) {
        console.error('Failed to sync bot data:', error)
        showToast('error', 'Failed to sync bot data')
    } finally {
        isSyncing.value = false
    }
}

const logout = async () => {
    try {
        await store.logout()
        showToast('success', 'Logged out successfully')
    } catch (error) {
        console.error('Logout failed:', error)
        showToast('error', 'Logout failed')
    }
}

// Toast management
const showToast = (type, message) => {
    statusToast.value = {
        show: true,
        type,
        message
    }

    setTimeout(() => {
        statusToast.value.show = false
    }, type === 'error' ? 5000 : 3000)
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
    if (showMobileActions.value && !event.target.closest('.relative')) {
        showMobileActions.value = false
    }
    if (showUserMenu.value && !event.target.closest('.relative')) {
        showUserMenu.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>