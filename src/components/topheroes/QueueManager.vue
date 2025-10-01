<!-- components/topheroes/QueueManager.vue -->
<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-xl font-semibold text-velaris-purple">Queue Management</h2>
                <p class="text-sm text-foreground/70 mt-1">
                    Manage team compositions and strategic queues
                </p>
            </div>
            <div class="flex gap-3">
                <button @click="$emit('refresh')" :disabled="isLoading"
                    class="bg-velaris-purple/10 text-velaris-purple border border-velaris-purple/30 hover:bg-velaris-purple/20 transition-all duration-200 font-medium rounded-xl px-4 py-2 flex items-center gap-2">
                    <RotateCcw :class="['h-4 w-4', isLoading ? 'animate-spin' : '']" />
                    Refresh
                </button>
                <button @click="$emit('create-queue')"
                    class="bg-gradient-to-r from-velaris-purple to-velaris-teal text-white font-medium py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
                    <Plus class="h-4 w-4" />
                    New Queue
                </button>
            </div>
        </div>

        <!-- Queue Stats -->
        <div class="grid gap-4 md:grid-cols-3">
            <div
                class="bg-card border border-border rounded-xl shadow-sm transition-all duration-200 hover:shadow-md p-4">
                <div class="flex items-center gap-3">
                    <div
                        class="h-12 w-12 bg-gradient-to-br from-velaris-purple/20 to-velaris-purple/10 rounded-xl flex items-center justify-center">
                        <List class="h-6 w-6 text-velaris-purple" />
                    </div>
                    <div>
                        <p class="text-sm text-foreground/60">Total Queues</p>
                        <p class="text-2xl font-bold text-velaris-purple">{{ queues.length }}</p>
                    </div>
                </div>
            </div>

            <div
                class="bg-card border border-border rounded-xl shadow-sm transition-all duration-200 hover:shadow-md p-4">
                <div class="flex items-center gap-3">
                    <div
                        class="h-12 w-12 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl flex items-center justify-center">
                        <Eye class="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                        <p class="text-sm text-foreground/60">Visible Queues</p>
                        <p class="text-2xl font-bold text-green-400">{{ visibleQueuesCount }}</p>
                    </div>
                </div>
            </div>

            <div
                class="bg-card border border-border rounded-xl shadow-sm transition-all duration-200 hover:shadow-md p-4">
                <div class="flex items-center gap-3">
                    <div
                        class="h-12 w-12 bg-gradient-to-br from-velaris-teal/20 to-velaris-teal/10 rounded-xl flex items-center justify-center">
                        <Users class="h-6 w-6 text-velaris-teal" />
                    </div>
                    <div>
                        <p class="text-sm text-foreground/60">Total Heroes</p>
                        <p class="text-2xl font-bold text-velaris-teal">{{ totalHeroesInQueues }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filter Bar -->
        <div class="bg-card border border-border rounded-xl p-4">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="flex-1">
                    <div class="relative">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                        <input v-model="searchQuery" type="search" placeholder="Search queues by name or description..."
                            class="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all" />
                    </div>
                </div>
                <div class="flex gap-3">
                    <select v-model="filterVisibility"
                        class="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all">
                        <option value="">All Queues</option>
                        <option value="visible">Visible Only</option>
                        <option value="hidden">Hidden Only</option>
                    </select>

                    <button v-if="hasFilters" @click="clearFilters"
                        class="bg-velaris-purple/10 text-velaris-purple border border-velaris-purple/30 hover:bg-velaris-purple/20 transition-all duration-200 font-medium rounded-xl px-3 py-2">
                        <X class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
            <div class="inline-flex items-center gap-3 text-foreground/60">
                <div class="animate-spin h-6 w-6 border-2 border-velaris-purple border-t-transparent rounded-full">
                </div>
                <span>Loading queues...</span>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredQueues.length === 0 && !hasFilters" class="text-center py-16">
            <div
                class="h-24 w-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">
                <List class="h-12 w-12 text-foreground/30" />
            </div>
            <h3 class="text-xl font-semibold mb-2">No Queues Found</h3>
            <p class="text-foreground/60 mb-6">Create your first queue to organize team compositions.</p>
            <button @click="$emit('create-queue')"
                class="bg-gradient-to-r from-velaris-purple to-velaris-teal text-white font-medium py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2">
                <Plus class="h-4 w-4" />
                Create Queue
            </button>
        </div>

        <!-- No Results -->
        <div v-else-if="filteredQueues.length === 0 && hasFilters" class="text-center py-12">
            <div class="h-16 w-16 mx-auto mb-4 rounded-xl bg-foreground/10 flex items-center justify-center">
                <Search class="h-8 w-8 text-foreground/30" />
            </div>
            <h3 class="text-lg font-semibold mb-2">No Matching Queues</h3>
            <p class="text-foreground/60 mb-4">Try adjusting your search or filters.</p>
            <button @click="clearFilters"
                class="bg-velaris-purple/10 text-velaris-purple border border-velaris-purple/30 hover:bg-velaris-purple/20 transition-all duration-200 font-medium rounded-xl px-4 py-2">
                Clear Filters
            </button>
        </div>

        <!-- Queues Grid -->
        <div v-else class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
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
    queues: {
        type: Array,
        default: () => []
    },
    heroes: {
        type: Array,
        default: () => []
    },
    isLoading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits([
    'create-queue',
    'edit-queue',
    'delete-queue',
    'refresh'
])

// Filter state
const searchQuery = ref('')
const filterVisibility = ref('')

// Computed properties
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

    // Text search
    if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase()
        filtered = filtered.filter(queue =>
            queue.name?.toLowerCase().includes(search) ||
            queue.description?.toLowerCase().includes(search) ||
            queue.createdBy?.toLowerCase().includes(search)
        )
    }

    // Visibility filter
    if (filterVisibility.value) {
        const isVisible = filterVisibility.value === 'visible'
        filtered = filtered.filter(queue => queue.isVisible === isVisible)
    }

    // Sort by last updated/created date (newest first)
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

// Actions
const clearFilters = () => {
    searchQuery.value = ''
    filterVisibility.value = ''
}
</script>