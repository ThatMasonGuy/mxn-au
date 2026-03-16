<!-- components/topheroes/QueueManager.vue -->
<template>
    <div class="space-y-4 sm:space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div>
                <h2 class="text-lg sm:text-xl font-semibold text-velaris-purple">Queue Management</h2>
                <p class="text-xs sm:text-sm text-foreground/70 mt-1">
                    Manage team compositions and strategic queues
                </p>
            </div>
            <div class="flex gap-2 sm:gap-3">
                <button @click="$emit('refresh')" :disabled="isLoading"
                    class="bg-velaris-purple/10 text-velaris-purple border border-velaris-purple/30 hover:bg-velaris-purple/20 transition-all duration-200 font-medium rounded-lg sm:rounded-xl px-3 py-2 flex items-center gap-2 text-sm">
                    <RotateCcw :class="['h-3.5 w-3.5 sm:h-4 sm:w-4', isLoading ? 'animate-spin' : '']" />
                    <span class="hidden sm:inline">Refresh</span>
                </button>
                <button @click="$emit('create-queue')"
                    class="bg-gradient-to-r from-velaris-purple to-velaris-teal text-white font-medium py-2 px-3 sm:px-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 text-sm">
                    <Plus class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span class="hidden sm:inline">New Queue</span>
                    <span class="sm:hidden">New</span>
                </button>
            </div>
        </div>

        <!-- Queue Stats -->
        <div class="grid gap-3 sm:gap-4 grid-cols-3">
            <div
                class="bg-card border border-border rounded-lg sm:rounded-xl shadow-sm transition-all duration-200 hover:shadow-md p-3 sm:p-4">
                <div class="flex items-center gap-2 sm:gap-3">
                    <div
                        class="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-velaris-purple/20 to-velaris-purple/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <List class="h-5 w-5 sm:h-6 sm:w-6 text-velaris-purple" />
                    </div>
                    <div>
                        <p class="text-xs sm:text-sm text-foreground/60">Total</p>
                        <p class="text-xl sm:text-2xl font-bold text-velaris-purple">{{ queues.length }}</p>
                    </div>
                </div>
            </div>

            <div
                class="bg-card border border-border rounded-lg sm:rounded-xl shadow-sm transition-all duration-200 hover:shadow-md p-3 sm:p-4">
                <div class="flex items-center gap-2 sm:gap-3">
                    <div
                        class="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <Eye class="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                    </div>
                    <div>
                        <p class="text-xs sm:text-sm text-foreground/60">Visible</p>
                        <p class="text-xl sm:text-2xl font-bold text-green-400">{{ visibleQueuesCount }}</p>
                    </div>
                </div>
            </div>

            <div
                class="bg-card border border-border rounded-lg sm:rounded-xl shadow-sm transition-all duration-200 hover:shadow-md p-3 sm:p-4">
                <div class="flex items-center gap-2 sm:gap-3">
                    <div
                        class="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-velaris-teal/20 to-velaris-teal/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <Users class="h-5 w-5 sm:h-6 sm:w-6 text-velaris-teal" />
                    </div>
                    <div>
                        <p class="text-xs sm:text-sm text-foreground/60">Heroes</p>
                        <p class="text-xl sm:text-2xl font-bold text-velaris-teal">{{ totalHeroesInQueues }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filter Bar -->
        <div class="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div class="flex flex-col gap-3 sm:gap-4">
                <div class="flex-1">
                    <div class="relative">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                        <input v-model="searchQuery" type="search" placeholder="Search queues..."
                            class="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all" />
                    </div>
                </div>
                <div class="flex gap-2 sm:gap-3">
                    <select v-model="filterVisibility"
                        class="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all">
                        <option value="">All</option>
                        <option value="visible">Visible</option>
                        <option value="hidden">Hidden</option>
                    </select>

                    <button v-if="hasFilters" @click="clearFilters"
                        class="bg-velaris-purple/10 text-velaris-purple border border-velaris-purple/30 hover:bg-velaris-purple/20 transition-all duration-200 font-medium rounded-lg sm:rounded-xl px-3 py-2">
                        <X class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-8 sm:py-12">
            <div class="inline-flex items-center gap-3 text-foreground/60">
                <div
                    class="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-2 border-velaris-purple border-t-transparent rounded-full">
                </div>
                <span class="text-sm sm:text-base">Loading queues...</span>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredQueues.length === 0 && !hasFilters" class="text-center py-12 sm:py-16">
            <div
                class="h-20 w-20 sm:h-24 sm:w-24 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">
                <List class="h-10 w-10 sm:h-12 sm:w-12 text-foreground/30" />
            </div>
            <h3 class="text-lg sm:text-xl font-semibold mb-2">No Queues Found</h3>
            <p class="text-sm sm:text-base text-foreground/60 mb-4 sm:mb-6 px-4">Create your first queue to organize
                team compositions.</p>
            <button @click="$emit('create-queue')"
                class="bg-gradient-to-r from-velaris-purple to-velaris-teal text-white font-medium py-2 px-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2 text-sm">
                <Plus class="h-4 w-4" />
                Create Queue
            </button>
        </div>

        <!-- No Results -->
        <div v-else-if="filteredQueues.length === 0 && hasFilters" class="text-center py-8 sm:py-12">
            <div
                class="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 rounded-lg sm:rounded-xl bg-foreground/10 flex items-center justify-center">
                <Search class="h-6 w-6 sm:h-8 sm:w-8 text-foreground/30" />
            </div>
            <h3 class="text-base sm:text-lg font-semibold mb-2">No Matching Queues</h3>
            <p class="text-sm sm:text-base text-foreground/60 mb-3 sm:mb-4 px-4">Try adjusting your search or filters.
            </p>
            <button @click="clearFilters"
                class="bg-velaris-purple/10 text-velaris-purple border border-velaris-purple/30 hover:bg-velaris-purple/20 transition-all duration-200 font-medium rounded-lg sm:rounded-xl px-4 py-2 text-sm">
                Clear Filters
            </button>
        </div>

        <!-- Queues Grid -->
        <div v-else class="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            <QueueCard v-for="queue in filteredQueues" :key="queue.id" :queue="queue" :heroes="heroes"
                @edit="$emit('edit-queue', queue)" @delete="$emit('delete-queue', queue)" />
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { List, Plus, RotateCcw, Eye, Users, X, Search } from 'lucide-vue-next'
import QueueCard from './QueueCard.vue'

const props = defineProps({
    queues: { type: Array, default: () => [] },
    heroes: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false }
})

const emit = defineEmits(['create-queue', 'edit-queue', 'delete-queue', 'refresh'])

const searchQuery = ref('')
const filterVisibility = ref('')

const visibleQueuesCount = computed(() => {
    return props.queues.filter(queue => queue.isVisible).length
})

const totalHeroesInQueues = computed(() => {
    return props.queues.reduce((total, queue) => {
        return total + (queue.heroes?.length || 0)
    }, 0)
})

const hasFilters = computed(() => {
    return searchQuery.value || filterVisibility.value
})

const filteredQueues = computed(() => {
    let filtered = props.queues

    if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase()
        filtered = filtered.filter(queue =>
            queue.name?.toLowerCase().includes(search) ||
            queue.description?.toLowerCase().includes(search) ||
            queue.createdBy?.toLowerCase().includes(search)
        )
    }

    if (filterVisibility.value) {
        const isVisible = filterVisibility.value === 'visible'
        filtered = filtered.filter(queue => queue.isVisible === isVisible)
    }

    return filtered.sort((a, b) => {
        const getTimestamp = (queue) => {
            const timestamp = queue.lastUpdated || queue.createdAt
            if (timestamp?.seconds) {
                return timestamp.seconds * 1000
            }
            return new Date(timestamp || 0).getTime()
        }
        return getTimestamp(b) - getTimestamp(a)
    })
})

const clearFilters = () => {
    searchQuery.value = ''
    filterVisibility.value = ''
}
</script>