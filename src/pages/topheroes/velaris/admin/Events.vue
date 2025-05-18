<template>
    <div class="bg-gray-900 min-h-screen">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <!-- Header Section with Improved Styling -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 class="text-3xl font-bold text-white">Event Management</h1>
                    <p class="text-gray-400 mt-1">Manage your game events and tournaments</p>
                </div>
                <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button @click="toggleView" variant="outline" class="w-full sm:w-auto">
                        <span class="flex items-center gap-2">
                            <span v-if="viewMode === 'card'" class="i-lucide-list text-lg"></span>
                            <span v-else class="i-lucide-grid text-lg"></span>
                            {{ viewMode === 'card' ? 'Table View' : 'Card View' }}
                        </span>
                    </Button>
                    <Button @click="showAddEvent = true"
                        class="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
                        <span class="flex items-center gap-2">
                            <span class="i-lucide-plus-circle text-lg"></span>
                            New Event
                        </span>
                    </Button>
                </div>
            </div>

            <!-- Search and Filter Bar -->
            <div class="bg-gray-800 rounded-lg p-4 mb-6">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="relative grow">
                        <span
                            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <span class="i-lucide-search text-lg"></span>
                        </span>
                        <input type="text" v-model="searchQuery" placeholder="Search events..."
                            class="bg-gray-700 text-white py-2 pl-10 pr-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div class="flex gap-3">
                        <select v-model="filterStatus"
                            class="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                        </select>
                        <Button @click="resetFilters" variant="ghost" class="text-gray-300 hover:text-white">
                            Reset
                        </Button>
                    </div>
                </div>
            </div>

            <!-- Content Views with Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-16">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>

            <div v-else-if="filteredEvents.length === 0" class="bg-gray-800 rounded-lg p-8 text-center">
                <span class="i-lucide-calendar-x text-5xl text-gray-500 mx-auto mb-4"></span>
                <h3 class="text-xl text-white font-medium">No events found</h3>
                <p class="text-gray-400 mt-2">Try adjusting your search or filters, or create a new event.</p>
                <Button @click="showAddEvent = true" class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                    Create New Event
                </Button>
            </div>

            <div v-else>
                <!-- Card View -->
                <div v-if="viewMode === 'card'" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <TransitionGroup name="fade">
                        <EventCard v-for="event in filteredEvents" :key="event.id" :event="event"
                            @click="editEvent(event)"
                            class="bg-gray-800 border border-gray-700 hover:border-indigo-500 transition-all" />
                    </TransitionGroup>
                </div>

                <!-- Table View -->
                <div v-else class="bg-gray-800 rounded-lg overflow-hidden">
                    <EventTable :events="filteredEvents" @edit="editEvent" @delete="confirmDelete" />
                </div>

                <!-- Pagination -->
                <div class="mt-6 flex justify-between items-center text-gray-400">
                    <div>
                        Showing {{ filteredEvents.length }} of {{ events.length }} events
                    </div>
                    <div class="flex gap-2">
                        <Button variant="outline" size="sm" :disabled="currentPage === 1" @click="currentPage--">
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" :disabled="currentPage >= totalPages"
                            @click="currentPage++">
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <EventEditorModal v-if="editingEvent" :event="editingEvent" @close="editingEvent = null"
            @saved="handleEventSaved" />

        <AddEventModal v-if="showAddEvent" @close="showAddEvent = false" @created="handleEventCreated" />

        <ConfirmDialog v-if="deletingEvent" :title="`Delete ${deletingEvent.name}?`"
            :message="'This action cannot be undone. The event and all associated data will be permanently removed.'"
            @confirm="deleteEvent" @cancel="deletingEvent = null" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useEventCollection } from '@/composables/topheroes/admin/useEventCollection'
import EventCard from '@/components/velaris/EventCard.vue'
import EventTable from '@/components/velaris/EventTable.vue'
import EventEditorModal from '@/components/velaris/EventEditorModal.vue'
import AddEventModal from '@/components/velaris/AddEventModal.vue'
import ConfirmDialog from '@/components/velaris/ConfirmDialog.vue'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'vue-router'
const router = useRouter()

const { toast } = useToast();
const { events, loadEvents, deleteEventById } = useEventCollection()

// UI State
const viewMode = ref('card')
const showAddEvent = ref(false)
const editingEvent = ref(null)
const deletingEvent = ref(null)
const loading = ref(true)

// Search and Filter
const searchQuery = ref('')
const filterStatus = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(9)

const filteredEvents = computed(() => {
    let result = [...events.value]

    // Apply search
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(event =>
            event.name.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query)
        )
    }

    // Apply status filter
    if (filterStatus.value !== 'all') {
        result = result.filter(event => event.status === filterStatus.value)
    }

    // Sort by start date (newest first)
    result.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

    return result
})

const totalPages = computed(() => {
    return Math.ceil(filteredEvents.value.length / itemsPerPage.value)
})

// Reset filter and search
const resetFilters = () => {
    searchQuery.value = ''
    filterStatus.value = 'all'
    currentPage.value = 1
}

// View toggle
const toggleView = () => {
    viewMode.value = viewMode.value === 'card' ? 'table' : 'card'
}

// Event operations
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
            title: 'Delete Successful',
            description: `${deletingEvent.value.id} was deleted.`
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

const handleEventSaved = () => {
    editingEvent.value = null
    toast({
            variant: 'success',
            title: 'Event updated successfully',
        })
}

const handleEventCreated = () => {
    showAddEvent.value = false
    toast({
            variant: 'success',
            title: 'New event created successfully',
        })
}

// Watch for filter changes to reset pagination
watch([searchQuery, filterStatus], () => {
    currentPage.value = 1
})

// Load events on component mount
onMounted(async () => {
    try {
        await loadEvents()
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Loading Events Failed',
            description: 'Failed to load events: ' + error.message
    })
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>