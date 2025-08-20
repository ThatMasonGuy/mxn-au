<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <!-- Header Section -->
            <div class="mb-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="space-y-2">
                        <h1
                            class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                            Event Management
                        </h1>
                        <p class="text-slate-400 text-sm lg:text-base">Manage your game events and tournaments</p>
                    </div>
                    <div class="flex gap-3 w-full lg:w-auto">
                        <Button @click="toggleView" variant="outline"
                            class="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-all duration-200 flex-1 lg:flex-none">
                            <Table v-if="viewMode === 'card'" class="w-4 h-4 mr-2" />
                            <LayoutGrid v-else class="w-4 h-4 mr-2" />
                            {{ viewMode === 'card' ? 'Table View' : 'Card View' }}
                        </Button>
                        <Button @click="showAddEvent = true"
                            class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 flex-1 lg:flex-none">
                            <Plus class="w-4 h-4 mr-2" />
                            New Event
                        </Button>
                    </div>
                </div>
            </div>

            <!-- Search and Filter Section -->
            <div class="mb-8">
                <div
                    class="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 lg:p-6">
                    <div class="flex flex-col lg:flex-row gap-4">
                        <div class="flex-1">
                            <SmartSearch :data="events" :queries="['name', 'description', 'eventId']"
                                :sorted-by="'startDate'" :secondary-sort="'status'" :preserve-case="false"
                                @update:results="filteredEvents = $event" :filter-key="'status'"
                                :filter-value="filterStatus" placeholder="Search events by name or description..." />
                        </div>

                        <div class="flex gap-3">
                            <SmartInput v-model="filterStatus" type="select" class="min-w-36" :options="[
                                { label: 'All', value: 'all' },
                                { label: 'Active', value: 'active' },
                                { label: 'Upcoming', value: 'upcoming' },
                                { label: 'Completed', value: 'completed' }
                            ]" placeholder="Filter status" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content Section -->
            <div v-if="loading"
                class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
                <div class="max-w-md mx-auto">
                    <div
                        class="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <div class="animate-spin w-8 h-8 border-3 border-white border-t-transparent rounded-full"></div>
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-2">Loading Events</h3>
                    <p class="text-slate-400">Fetching your event data...</p>
                </div>
            </div>

            <div v-else-if="filteredEvents.length === 0"
                class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
                <div class="max-w-md mx-auto">
                    <div class="w-16 h-16 bg-slate-700/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Calendar class="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-2">No events found</h3>
                    <p class="text-slate-400 mb-6">
                        {{ searchQuery || filterStatus !== 'all'
                            ? 'Try adjusting your search or filters.'
                            : 'Get started by creating your first event.'
                        }}
                    </p>
                    <Button @click="showAddEvent = true"
                        class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                        <Plus class="w-4 h-4 mr-2" />
                        Create New Event
                    </Button>
                </div>
            </div>

            <div v-else class="space-y-6">
                <!-- Card View -->
                <div v-if="viewMode === 'card'" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <TransitionGroup name="card-fade">
                        <EventCard v-for="event in filteredEvents" :key="event.id" :event="event"
                            @click="editEvent(event)" />
                    </TransitionGroup>
                </div>

                <!-- Table View -->
                <div v-else
                    class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
                    <EventTable :events="filteredEvents" @edit="editEvent" @delete="confirmDelete" />
                </div>

                <!-- Results Summary -->
                <div
                    class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-slate-400 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-4">
                    <div class="flex items-center space-x-2">
                        <span>Showing {{ filteredEvents.length }} of {{ events.length }} events</span>
                    </div>
                    <div v-if="searchQuery || filterStatus !== 'all'" class="flex items-center space-x-2 text-cyan-400">
                        <Filter class="w-4 h-4" />
                        <span>Filtered results</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <AddEventModal v-if="showAddEvent" @close="showAddEvent = false" @created="handleEventCreated" />

        <ConfirmDialog v-if="deletingEvent" :title="`Delete ${deletingEvent.name}?`"
            :message="'This action cannot be undone. The event and all associated data will be permanently removed.'"
            @confirm="deleteEvent" @cancel="deletingEvent = null" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Calendar, Plus, Table, LayoutGrid, Filter } from 'lucide-vue-next'
import { useEventCollection } from '@/composables/topheroes/admin/useEventCollection'
import EventCard from '@/components/velaris/EventCard.vue'
import EventTable from '@/components/velaris/EventTable.vue'
import AddEventModal from '@/components/velaris/AddEventModal.vue'
import ConfirmDialog from '@/components/velaris/ConfirmDialog.vue'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { useRouter } from 'vue-router'
import SmartInput from '@/components/ui/SmartInput.vue'
import SmartSearch from '@/components/ui/SmartSearch.vue'

const router = useRouter()
const { toast } = useToast()
const { events, loadEvents, deleteEventById } = useEventCollection()

// UI State
const viewMode = ref('card')
const showAddEvent = ref(false)
const deletingEvent = ref(null)
const loading = ref(true)

// Search and Filter
const searchQuery = ref('')
const filterStatus = ref('all')

const filteredEvents = ref([])

const toggleView = () => {
    viewMode.value = viewMode.value === 'card' ? 'table' : 'card'
}

const editEvent = (event) => {
    router.push(`/topheroes/velaris/admin/events/${event.id}/edit`)
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
            description: `${deletingEvent.value.name} was successfully deleted.`
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
})
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

/* Glass morphism effect */
.backdrop-blur-sm {
    backdrop-filter: blur(4px);
}

/* Consistent border width for loading spinners */
.border-3 {
    border-width: 3px;
}
</style>