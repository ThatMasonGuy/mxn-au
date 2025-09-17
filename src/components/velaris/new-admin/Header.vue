<!-- Fixed Header.vue with Rankings Store Integration -->
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
                    <!-- Sync Stats Button - Connected to Rankings Store -->
                    <button @click="syncStats" :disabled="isStatsLoading" :class="[
                        'hidden sm:inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white ring-1 ring-white/25 transition',
                        isStatsLoading
                            ? 'bg-white/25 cursor-not-allowed'
                            : 'bg-white/15 hover:bg-white/25'
                    ]">
                        <span :class="[
                            'inline-block h-2 w-2 rounded-full',
                            isStatsLoading
                                ? 'bg-velaris-amber animate-pulse'
                                : rankingsStore.loadError
                                    ? 'bg-red-400'
                                    : rankingsStore.isReportStale
                                        ? 'bg-velaris-amber'
                                        : 'bg-velaris-green'
                        ]"></span>
                        {{ syncStatsText }}
                    </button>

                    <!-- Run Audit Button - Connected to Rankings Store -->
                    <button @click="runAudit" :disabled="isAuditRunning" :class="[
                        'hidden sm:inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white ring-1 ring-white/25 transition',
                        isAuditRunning
                            ? 'bg-white/25 cursor-not-allowed'
                            : 'bg-white/15 hover:bg-white/25'
                    ]">
                        <span :class="[
                            'inline-block h-2 w-2 rounded-full',
                            isAuditRunning
                                ? 'bg-velaris-teal animate-pulse'
                                : 'bg-velaris-teal'
                        ]"></span>
                        {{ auditText }}
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
                                <button @click="syncStats" :disabled="isStatsLoading"
                                    class="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-foreground/5 disabled:opacity-50">
                                    <span :class="[
                                        'h-2 w-2 rounded-full',
                                        isStatsLoading ? 'bg-velaris-amber animate-pulse' :
                                            rankingsStore.loadError ? 'bg-red-400' :
                                                rankingsStore.isReportStale ? 'bg-velaris-amber' : 'bg-velaris-green'
                                    ]"></span>
                                    {{ syncStatsText }}
                                </button>
                                <button @click="runAudit" :disabled="isAuditRunning"
                                    class="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-foreground/5 disabled:opacity-50">
                                    <span :class="[
                                        'h-2 w-2 rounded-full',
                                        isAuditRunning ? 'bg-velaris-teal animate-pulse' : 'bg-velaris-teal'
                                    ]"></span>
                                    {{ auditText }}
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
                </div>
            </div>
        </div>

        <!-- Status Toast for Actions -->
        <div v-if="statusToast.show" :class="[
            'fixed top-20 right-4 z-50 rounded-lg px-4 py-3 text-sm text-white shadow-lg transition-all transform',
            statusToast.type === 'success' ? 'bg-velaris-green' :
                statusToast.type === 'error' ? 'bg-red-500' : 'bg-velaris-teal'
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
import VLR from '@/assets/icons/VLR.svg'
import { Menu, Search, Sun, Moon, MoreVertical, CheckCircle, AlertCircle, RefreshCw } from 'lucide-vue-next'
import { useTopheroesAdminStore } from '@/stores/topheroesAdmin/useTopheroesAdminStore'
import { useRankingsStore } from '@/stores/useRankingsStore'

defineEmits(['toggle-sidebar'])

const store = useTopheroesAdminStore()
const rankingsStore = useRankingsStore()

// Local state
const showMobileActions = ref(false)
const isStatsLoading = ref(false)
const isAuditRunning = ref(false)
const statusToast = ref({
    show: false,
    type: 'info', // 'success', 'error', 'info'
    message: ''
})

// Computed properties for button states
const syncStatsText = computed(() => {
    if (isStatsLoading.value) return 'Syncing...'
    if (rankingsStore.loadError) return 'Sync Failed'
    if (rankingsStore.isReportStale) return 'Sync Needed'
    if (rankingsStore.isLoading) return 'Loading...'
    return 'Stats Synced'
})

const auditText = computed(() => {
    if (isAuditRunning.value) return 'Running Audit...'
    return 'Run Audit'
})

// Actions
const syncStats = async () => {
    if (isStatsLoading.value || rankingsStore.isLoading) return

    isStatsLoading.value = true
    showToast('info', 'Syncing rankings data...')

    try {
        await rankingsStore.loadRankingsData(false) // Don't force refresh, just load latest
        showToast('success', 'Rankings data synced successfully')
    } catch (error) {
        console.error('Failed to sync stats:', error)
        showToast('error', 'Failed to sync rankings data')
    } finally {
        isStatsLoading.value = false
    }
}

const runAudit = async () => {
    if (isAuditRunning.value || rankingsStore.isGeneratingReport) return

    isAuditRunning.value = true
    showToast('info', 'Running data audit and generating fresh report...')

    try {
        await rankingsStore.forceRefresh() // Force a complete refresh
        showToast('success', 'Audit completed and fresh report generated')
    } catch (error) {
        console.error('Failed to run audit:', error)
        showToast('error', 'Audit failed - please try again')
    } finally {
        isAuditRunning.value = false
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

    // Load initial rankings data if not already loaded
    if (!rankingsStore.currentReport && !rankingsStore.isLoading) {
        rankingsStore.loadRankingsData().catch(error => {
            console.error('Failed to load initial rankings data:', error)
        })
    }
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>