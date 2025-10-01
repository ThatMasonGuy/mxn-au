<!-- Updated Events.vue with lazy loaded EventEdit component -->
<template>
    <div>
        <!-- Loading state for component transition -->
        <div v-if="loadingEdit" class="elev-card p-12 text-center">
            <div class="max-w-md mx-auto">
                <div class="w-16 h-16 bg-gradient-to-br from-velaris-purple to-velaris-teal rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div class="animate-spin w-8 h-8 border-3 border-white border-t-transparent rounded-full"></div>
                </div>
                <h3 class="text-xl font-semibold text-foreground mb-2">Loading Event Editor</h3>
                <p class="text-foreground/60">Preparing event management interface...</p>
            </div>
        </div>

        <!-- Event Edit Page (replaces the events list) -->
        <component v-else-if="editingEvent && EventEditComponent" 
            :is="EventEditComponent" 
            :event-id="editingEvent.id" 
            @back="closeEditView" 
            class="animate-fade-in" />

        <!-- Events List Page (default view) -->
        <div v-else class="animate-fade-in">
            <!-- Header -->
            <div class="mb-6">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h1 class="text-2xl font-semibold text-velaris-purple">Events</h1>
                        <p class="text-sm text-foreground/70 mt-1">Manage guild events and track participation</p>
                    </div>
                    <div class="flex gap-3 w-full lg:w-auto">
                        <button @click="toggleView" class="btn-soft-violet flex-1 lg:flex-none">
                            <Table v-if="viewMode === 'card'" class="h-4 w-4 mr-2" />
                            <LayoutGrid v-else class="h-4 w-4 mr-2" />
                            {{ viewMode === 'card' ? 'Table View' : 'Card View' }}
                        </button>
                        <button @click="showAddEvent = true" class="btn-solid-purple flex-1 lg:flex-none">
                            <Plus class="h-4 w-4 mr-2" />
                            Create Event
                        </button>
                    </div>
                </div>
            </div>

            <!-- Stats Pills -->
            <div class="mb-6 flex flex-wrap items-center gap-3">
                <div class="inline-flex items-center gap-2 rounded-full bg-velaris-green/15 px-4 py-2 text-sm text-velaris-green">
                    <Calendar class="h-4 w-4" />
                    {{ getActiveEvents().length }} Active Events
                </div>
                <div v-if="getUpcomingEvents().length > 0" class="inline-flex items-center gap-2 rounded-full bg-velaris-teal/15 px-4 py-2 text-sm text-velaris-teal">
                    <Clock class="h-4 w-4" />
                    {{ getUpcomingEvents().length }} Upcoming
                </div>
                <div class="inline-flex items-center gap-2 rounded-full bg-velaris-amber/15 px-4 py-2 text-sm text-velaris-amber">
                    <Users class="h-4 w-4" />
                    {{ events.length }} Total Events
                </div>
            </div>

            <!-- Search and Filter Section -->
            <div class="mb-6">
                <div class="elev-card p-4 lg:p-6">
                    <div class="flex flex-col lg:flex-row gap-4">
                        <div class="flex-1">
                            <SmartSearch :data="events" :queries="['event', 'eventId', 'guild']" :sorted-by="'startDate'"
                                :secondary-sort="'status'" :preserve-case="false" @update:results="filteredEvents = $event"
                                :filter-key="'status'" :filter-value="filterStatus"
                                placeholder="Search events by name, ID, or guild..." />
                        </div>
                        <div class="flex gap-3">
                            <SmartInput v-model="filterStatus" type="select" class="min-w-36" :options="[
                                { label: 'All', value: 'all' },
                                { label: 'Active', value: 'active' },
                                { label: 'Upcoming', value: 'upcoming' },
                                { label: 'Completed', value: 'completed' }
                            ]" placeholder="Filter status" />
                            <button class="btn-soft-violet">
                                <Download class="h-4 w-4 mr-2" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="elev-card p-12 text-center">
                <div class="max-w-md mx-auto">
                    <div class="w-16 h-16 bg-gradient-to-br from-velaris-purple to-velaris-teal rounded-full mx-auto mb-4 flex items-center justify-center">
                        <div class="animate-spin w-8 h-8 border-3 border-white border-t-transparent rounded-full"></div>
                    </div>
                    <h3 class="text-xl font-semibold text-foreground mb-2">Loading Events</h3>
                    <p class="text-foreground/60">Fetching your event data...</p>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredEvents.length === 0" class="elev-card p-12 text-center">
                <div class="max-w-md mx-auto">
                    <div class="w-16 h-16 bg-foreground/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Calendar class="w-8 h-8 text-foreground/50" />
                    </div>
                    <h3 class="text-xl font-semibold text-foreground mb-2">No events found</h3>
                    <p class="text-foreground/60 mb-6">
                        {{ filterStatus !== 'all'
                            ? 'Try adjusting your search or filters.'
                            : 'Get started by creating your first event.'
                        }}
                    </p>
                    <button @click="showAddEvent = true" class="btn-solid-purple">
                        <Plus class="w-4 h-4 mr-2" />
                        Create New Event
                    </button>
                </div>
            </div>

            <!-- Events Content -->
            <div v-else>
                <!-- Card View -->
                <div v-if="viewMode === 'card'" class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    <TransitionGroup name="card-fade">
                        <div v-for="event in filteredEvents" :key="event.id" class="event-card" @click="openEditView(event)">
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex items-center gap-3">
                                    <div class="h-10 w-10 rounded-lg flex items-center justify-center text-white"
                                        :class="getEventTypeGradient(event.type)">
                                        <component :is="getEventIcon(event.type)" class="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 class="font-medium text-foreground">{{ getEventDisplayName(event) }}</h4>
                                        <p class="text-xs text-foreground/60">{{ event.type?.toUpperCase() || 'EVENT' }}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="px-2 py-1 rounded-full text-xs font-medium"
                                        :class="getStatusColor(event.status)">
                                        {{ event.status || 'unknown' }}
                                    </span>
                                    <button class="p-1 hover:bg-foreground/5 rounded" @click.stop="confirmDelete(event)">
                                        <Trash2 class="h-4 w-4 text-foreground/50 hover:text-red-400 transition-colors" />
                                    </button>
                                </div>
                            </div>

                            <!-- Score Section -->
                            <div v-if="event.totalScore"
                                class="mb-4 p-3 rounded-lg bg-gradient-to-r from-velaris-purple/10 to-velaris-teal/10 border border-velaris-purple/20">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm font-medium text-foreground/80">Total Score</span>
                                    <button @click.stop="toggleScoreDetails(event.id)"
                                        class="text-xs text-velaris-purple hover:text-velaris-teal transition-colors">
                                        {{ expandedScores.has(event.id) ? 'Hide Details' : 'View Details' }}
                                    </button>
                                </div>
                                <div class="text-xl font-bold text-velaris-purple mb-1">
                                    {{ formatScore(event.totalScore) }}
                                </div>

                                <!-- Daily Scores Breakdown -->
                                <div v-if="expandedScores.has(event.id)"
                                    class="mt-3 space-y-1 animate-in slide-in-from-top duration-200">
                                    <div class="text-xs text-foreground/60 mb-2 font-medium">Daily Breakdown:</div>
                                    <div class="grid grid-cols-2 gap-2 text-xs">
                                        <div v-for="day in getDailyScores(event)" :key="day.day"
                                            class="flex justify-between items-center p-2 rounded bg-foreground/5">
                                            <span class="text-foreground/70">{{ day.day }}</span>
                                            <span class="font-medium text-velaris-teal">{{ formatScore(day.score) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-3">
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-foreground/70">Participants</span>
                                    <span class="font-medium">{{ event.memberIds?.length || 0 }}/95</span>
                                </div>

                                <div class="w-full bg-border/60 rounded-full h-2">
                                    <div class="bg-gradient-to-r from-velaris-purple to-velaris-teal h-2 rounded-full transition-all duration-300"
                                        :style="{ width: `${Math.min(((event.memberIds?.length || 0) / 95) * 100, 100)}%` }">
                                    </div>
                                </div>

                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-foreground/70">Guild</span>
                                    <span class="font-medium text-velaris-green">{{ event.guild || event.guildShort || 'N/A'
                                    }}</span>
                                </div>

                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-foreground/70">Date Range</span>
                                    <span class="text-xs font-medium text-velaris-amber">{{ formatDateRange(event.startDate,
                                        event.endDate) }}</span>
                                </div>
                            </div>

                            <div class="mt-4 pt-4 border-t border-border/60">
                                <div class="flex items-center justify-between">
                                    <button class="text-xs text-velaris-purple hover:underline"
                                        @click.stop="openEditView(event)">
                                        Edit Details
                                    </button>
                                    <button class="text-xs text-velaris-teal hover:underline"
                                        @click.stop="openEditView(event)">
                                        Manage
                                    </button>
                                </div>
                            </div>
                        </div>
                    </TransitionGroup>
                </div>

                <!-- Table View -->
                <div v-else class="elev-card overflow-hidden">
                    <EventTable :events="filteredEvents" @edit="openEditView" @delete="confirmDelete" />
                </div>

                <!-- Results Summary -->
                <div class="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-foreground/60 elev-card p-4">
                    <div class="flex items-center space-x-2">
                        <span>Showing {{ filteredEvents.length }} of {{ events.length }} events</span>
                    </div>
                    <div v-if="filterStatus !== 'all'" class="flex items-center space-x-2 text-velaris-teal">
                        <Filter class="w-4 h-4" />
                        <span>Filtered results</span>
                    </div>
                </div>
            </div>

            <!-- Modals for Events List -->
            <AddEventModal v-if="showAddEvent" @close="showAddEvent = false" @created="handleEventCreated" />
            
            <ConfirmDialog v-if="deletingEvent" :title="`Delete ${getEventDisplayName(deletingEvent)}?`"
                :message="'This action cannot be undone. The event and all associated data will be permanently removed.'"
                @confirm="deleteEvent" @cancel="deletingEvent = null" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue'
import {
    Calendar, Clock, Users, Filter, Download, Plus, Trash2,
    Sword, Shield, Trophy, Target, Table, LayoutGrid
} from 'lucide-vue-next'
import { useEventCollection } from '@/composables/topheroes/admin/useEventCollection'
import EventTable from '@/components/velaris/EventTable.vue'
import AddEventModal from '@/components/velaris/AddEventModal.vue'
import ConfirmDialog from '@/components/velaris/ConfirmDialog.vue'
import { useToast } from '@/components/ui/toast'
import SmartInput from '@/components/ui/SmartInput.vue'
import SmartSearch from '@/components/ui/SmartSearch.vue'

// Lazy load the EventEdit component
const EventEditComponent = defineAsyncComponent({
    loader: () => import('@/components/velaris/new-admin/views/EventEdit.vue'),
    loadingComponent: null, // We handle loading state manually
    errorComponent: null,
    delay: 200,
    timeout: 10000
})

const { toast } = useToast()
const {
    events,
    loadEvents,
    deleteEventById,
    getActiveEvents,
    getUpcomingEvents,
    getCompletedEvents
} = useEventCollection()

// UI State
const viewMode = ref('card')
const showAddEvent = ref(false)
const deletingEvent = ref(null)
const loading = ref(true)
const expandedScores = ref(new Set())

// Edit view state
const editingEvent = ref(null)
const loadingEdit = ref(false)

// Search and Filter
const filterStatus = ref('all')
const filteredEvents = ref([])

// Helper functions
const toggleView = () => {
    viewMode.value = viewMode.value === 'card' ? 'table' : 'card'
}

const toggleScoreDetails = (eventId) => {
    if (expandedScores.value.has(eventId)) {
        expandedScores.value.delete(eventId)
    } else {
        expandedScores.value.add(eventId)
    }
}

// NEW: Open edit view with loading state
const openEditView = async (event) => {
    loadingEdit.value = true
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300))
    
    editingEvent.value = event
    loadingEdit.value = false
}

// NEW: Close edit view and return to events list
const closeEditView = () => {
    editingEvent.value = null
    // Optionally refresh events list here if needed
}

const formatScore = (score) => {
    if (!score || score === 0) return '0'

    const num = parseInt(score)
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1) + 'B'
    } else if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1) + 'M'
    } else if (num >= 1_000) {
        return (num / 1_000).toFixed(1) + 'K'
    }
    return num.toLocaleString()
}

const getDailyScores = (event) => {
    const dailyScores = []
    for (let i = 1; i <= 6; i++) {
        const scoreKey = `totalScoreD${i}`
        if (event[scoreKey]) {
            dailyScores.push({
                day: `Day ${i}`,
                score: event[scoreKey]
            })
        }
    }
    return dailyScores
}

const formatDate = (date) => {
    if (!date) return 'N/A'
    const dateObj = typeof date?.toDate === 'function' ? date.toDate() : new Date(date)
    return dateObj.toLocaleDateString('en-AU', {
        year: '2-digit',
        month: 'short',
        day: 'numeric'
    })
}

const formatDateRange = (start, end) => {
    const startFormatted = formatDate(start)
    const endFormatted = formatDate(end)
    if (startFormatted === endFormatted) return startFormatted
    return `${startFormatted} - ${endFormatted}`
}

const getEventDisplayName = (event) => {
    if (event.event) return event.event
    if (event.name) return event.name
    return event.eventId || 'Unnamed Event'
}

const getEventTypeGradient = (type) => {
    const gradients = {
        'KvK': 'bg-gradient-to-br from-velaris-purple to-velaris-teal',
        'GvG': 'bg-gradient-to-br from-velaris-teal to-velaris-green',
        'GR': 'bg-gradient-to-br from-velaris-amber to-velaris-purple'
    }
    return gradients[type] || 'bg-gradient-to-br from-velaris-purple to-velaris-teal'
}

const getEventIcon = (type) => {
    const icons = {
        'KvK': Shield,
        'GvG': Sword,
        'GR': Trophy
    }
    return icons[type] || Target
}

const getStatusColor = (status) => {
    const colors = {
        'active': 'bg-velaris-green/15 text-velaris-green',
        'upcoming': 'bg-velaris-teal/15 text-velaris-teal',
        'completed': 'bg-foreground/10 text-foreground/70',
        'cancelled': 'bg-red-500/15 text-red-400'
    }
    return colors[status] || 'bg-velaris-amber/15 text-velaris-amber'
}

const confirmDelete = (event) => {
    deletingEvent.value = event
}

const deleteEvent = async () => {
    try {
        await deleteEventById(deletingEvent.value.id)
        toast({
            variant: 'success',
            title: 'Event Deleted',
            description: `${getEventDisplayName(deletingEvent.value)} was successfully deleted.`
        })
        deletingEvent.value = null
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Delete Failed',
            description: 'Failed to delete event: ' + error.message
        })
    }
}

const handleEventCreated = () => {
    showAddEvent.value = false
    toast({
        variant: 'success',
        title: 'Event Created',
        description: 'New event created successfully'
    })
}

// Load events on component mount
onMounted(async () => {
    try {
        await loadEvents()
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Loading Failed',
            description: 'Failed to load events: ' + error.message
        })
    } finally {
        loading.value = false
    }
})

// Watch for changes in the events array
watch(events, () => {
    loading.value = false
}, { immediate: true })
</script>

<style scoped>
.card-fade-enter-active,
.card-fade-leave-active {
    transition: all 0.3s ease;
}

.card-fade-enter-from,
.card-fade-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
}

.card-fade-move {
    transition: transform 0.3s ease;
}

/* Page transition animations */
.animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Consistent border width for loading spinners */
.border-3 {
    border-width: 3px;
}

/* Animation for score details */
@keyframes slide-in-from-top {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-in {
    animation-fill-mode: both;
}

.slide-in-from-top {
    animation-name: slide-in-from-top;
}

.duration-200 {
    animation-duration: 200ms;
}
</style>