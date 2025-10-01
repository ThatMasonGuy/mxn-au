<!-- TopHeroes Header.vue -->
<template>
    <header class="sticky top-0 z-40 h-16">
        <div class="h-full bg-gradient-to-r from-th-primary via-th-secondary to-th-success">
            <div class="flex h-full items-center gap-3 px-4">
                <!-- Mobile toggle -->
                <button
                    class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-black/10 backdrop-blur hover:bg-black/20 transition lg:hidden"
                    @click="$emit('toggle-sidebar')" aria-label="Toggle sidebar">
                    <Menu class="h-5 w-5 text-white" />
                </button>

                <div class="flex items-center gap-3 text-white">
                    <!-- TopHeroes Icon/Logo -->
                    <div class="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center">
                        <Shield class="h-4 w-4 text-white" />
                    </div>
                    <span class="font-bold tracking-wide">TopHeroes Admin</span>
                </div>

                <!-- Search (centered width limited) -->
                <div class="relative ml-4 hidden flex-1 md:flex">
                    <div class="mx-auto w-full max-w-7xl">
                        <div class="relative">
                            <input type="search" placeholder="Search guides, heroes, events..."
                                class="w-full rounded-md bg-white/15 pl-9 pr-3 py-2 text-white placeholder-white/70 outline-none ring-1 ring-white/25 focus:ring-white/60 transition" />
                            <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white" />
                        </div>
                    </div>
                </div>

                <div class="ml-auto flex items-center gap-2">
                    <!-- Sync Content Button -->
                    <button @click="syncContent" :disabled="isContentLoading" :class="[
                        'hidden sm:inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white ring-1 ring-white/25 transition',
                        isContentLoading
                            ? 'bg-white/25 cursor-not-allowed'
                            : 'bg-white/15 hover:bg-white/25'
                    ]">
                        <span :class="[
                            'inline-block h-2 w-2 rounded-full',
                            isContentLoading
                                ? 'bg-amber-300 animate-pulse'
                                : store.error
                                    ? 'bg-red-400'
                                    : store.isCacheStale
                                        ? 'bg-amber-300'
                                        : 'bg-green-400'
                        ]"></span>
                        {{ syncContentText }}
                    </button>

                    <!-- Publish Changes Button -->
                    <button @click="publishChanges" :disabled="isPublishing" :class="[
                        'hidden sm:inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white ring-1 ring-white/25 transition',
                        isPublishing
                            ? 'bg-white/25 cursor-not-allowed'
                            : 'bg-white/15 hover:bg-white/25'
                    ]">
                        <span :class="[
                            'inline-block h-2 w-2 rounded-full',
                            isPublishing
                                ? 'bg-blue-300 animate-pulse'
                                : 'bg-blue-300'
                        ]"></span>
                        {{ publishText }}
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
                                <button @click="syncContent" :disabled="isContentLoading"
                                    class="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-foreground/5 disabled:opacity-50">
                                    <span :class="[
                                        'h-2 w-2 rounded-full',
                                        isContentLoading ? 'bg-amber-500 animate-pulse' :
                                            store.error ? 'bg-red-500' :
                                                store.isCacheStale ? 'bg-amber-500' : 'bg-green-500'
                                    ]"></span>
                                    {{ syncContentText }}
                                </button>
                                <button @click="publishChanges" :disabled="isPublishing"
                                    class="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-foreground/5 disabled:opacity-50">
                                    <span :class="[
                                        'h-2 w-2 rounded-full',
                                        isPublishing ? 'bg-blue-500 animate-pulse' : 'bg-blue-500'
                                    ]"></span>
                                    {{ publishText }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Dark Mode Toggle -->
                    <button
                        class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/15 ring-1 ring-white/25 hover:bg-white/25 transition"
                        @click="store.toggleDarkMode()" :aria-pressed="store.settings.isDark"
                        aria-label="Toggle dark mode">
                        <Sun v-if="!store.settings.isDark" class="h-5 w-5 text-white" />
                        <Moon v-else class="h-5 w-5 text-white" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Status Toast for Actions -->
        <div v-if="statusToast.show" :class="[
            'fixed top-20 right-4 z-50 rounded-lg px-4 py-3 text-sm text-white shadow-lg transition-all transform',
            statusToast.type === 'success' ? 'bg-th-success' :
                statusToast.type === 'error' ? 'bg-th-danger' : 'bg-th-primary'
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
import { Menu, Search, Sun, Moon, MoreVertical, CheckCircle, AlertCircle, RefreshCw, Shield } from 'lucide-vue-next'
import { useTopHeroesAdminStore } from '@/stores/useTopHeroesAdminStore'

defineEmits(['toggle-sidebar'])

const store = useTopHeroesAdminStore()

// Local state
const showMobileActions = ref(false)
const isContentLoading = ref(false)
const isPublishing = ref(false)
const statusToast = ref({
    show: false,
    type: 'info', // 'success', 'error', 'info'
    message: ''
})

// Computed properties for button states
const syncContentText = computed(() => {
    if (isContentLoading.value) return 'Syncing...'
    if (store.error) return 'Sync Failed'
    if (store.isCacheStale) return 'Sync Needed'
    if (store.isLoading) return 'Loading...'
    return 'Content Synced'
})

const publishText = computed(() => {
    if (isPublishing.value) return 'Publishing...'
    return 'Publish Changes'
})

// Actions
const syncContent = async () => {
    if (isContentLoading.value || store.isLoading) return

    isContentLoading.value = true
    showToast('info', 'Syncing content and data...')

    try {
        await store.loadDashboardData(false) // Load latest data
        showToast('success', 'Content synced successfully')
    } catch (error) {
        console.error('Failed to sync content:', error)
        showToast('error', 'Failed to sync content')
    } finally {
        isContentLoading.value = false
    }
}

const publishChanges = async () => {
    if (isPublishing.value) return

    isPublishing.value = true
    showToast('info', 'Publishing changes to live site...')

    try {
        // Simulate publishing process
        await new Promise(resolve => setTimeout(resolve, 2000))
        await store.forceRefresh() // Force complete refresh after publish
        showToast('success', 'Changes published successfully')
    } catch (error) {
        console.error('Failed to publish changes:', error)
        showToast('error', 'Publishing failed - please try again')
    } finally {
        isPublishing.value = false
    }
}

// Toast management
const showToast = (type, message) => {
    statusToast.value = {
        show: true,
        type,
        message
    }

    // Auto-hide toast after a delay
    setTimeout(() => {
        statusToast.value.show = false
    }, type === 'error' ? 5000 : 3000)
}

// Close mobile menu when clicking outside
const handleClickOutside = (event) => {
    if (showMobileActions.value && !event.target.closest('.relative')) {
        showMobileActions.value = false
    }
}

// Initialize theme on mount
onMounted(() => {
    store.init()
    document.addEventListener('click', handleClickOutside)

    // Load initial data if not already loaded
    if (store.isCacheStale && !store.isLoading) {
        store.loadDashboardData().catch(error => {
            console.error('Failed to load initial data:', error)
        })
    }
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>