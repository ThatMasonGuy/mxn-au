<template>
    <div class="bg-gray-900 min-h-screen">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header Section -->
            <div class="mb-8">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 class="text-4xl font-bold text-white mb-2">Event Management</h1>
                        <p class="text-gray-300 text-lg">Manage your game events and tournaments</p>
                    </div>
                    <div class="flex gap-3 w-full sm:w-auto">
                        <button @click="toggleView"
                            class="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-all duration-200 flex-1 sm:flex-none justify-center">
                            <TableCellsIcon v-if="viewMode === 'card'" class="w-5 h-5" />
                            <RectangleStackIcon v-else class="w-5 h-5" />
                            {{ viewMode === 'card' ? 'Table View' : 'Card View' }}
                        </button>
                        <button @click="showAddEvent = true"
                            class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-indigo-500/25 flex-1 sm:flex-none justify-center">
                            <PlusIcon class="w-5 h-5" />
                            New Event
                        </button>
                    </div>
                </div>
            </div>

            <!-- Search and Filter Section -->
            <div class="mb-8">
                <div class="flex flex-col lg:flex-row gap-4">
                    <SmartSearch :data="events" :queries="['name', 'description', 'eventId']" :sorted-by="'startDate'"
                        :secondary-sort="'status'" :preserve-case="false" @update:results="filteredEvents = $event"
                        :filter-key="'status'" :filter-value="filterStatus" placeholder="Search events by name or description..." />

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

            <!-- Content Section -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>

            <div v-else-if="filteredEvents.length === 0" class="bg-gray-800 rounded-lg p-12 text-center">
                <CalendarDaysIcon class="h-12 w-12 mx-auto text-gray-500 block mb-4" />
                <h3 class="text-xl text-white font-medium mb-2">No events found</h3>
                <p class="text-gray-400 mb-6">
                    {{ searchQuery || filterStatus !== 'all'
                        ? 'Try adjusting your search or filters.'
                        : 'Get started by creating your first event.'
                    }}
                </p>
                <Button @click="showAddEvent = true" class="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <span class="i-lucide-plus-circle mr-2"></span>
                    Create New Event
                </Button>
            </div>

            <div v-else>
                <!-- Card View -->
                <div v-if="viewMode === 'card'" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <TransitionGroup name="card-fade">
                        <EventCard v-for="event in filteredEvents" :key="event.id" :event="event"
                            @click="editEvent(event)" />
                    </TransitionGroup>
                </div>

                <!-- Table View -->
                <div v-else class="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <EventTable :events="filteredEvents" @edit="editEvent" @delete="confirmDelete" />
                </div>

                <!-- Results Summary -->
                <div class="mt-6 flex justify-between items-center text-sm text-gray-400">
                    <div>
                        Showing {{ filteredEvents.length }} of {{ events.length }} events
                    </div>
                    <div v-if="searchQuery || filterStatus !== 'all'" class="text-indigo-400">
                        <span class="i-lucide-filter mr-1"></span>
                        Filtered results
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
import { CalendarDaysIcon, PlusIcon, TableCellsIcon, RectangleStackIcon } from '@heroicons/vue/24/outline'
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
</style>