<template>
    <div
        class="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800 text-white font-sans pb-12 relative overflow-hidden">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div v-for="i in 6" :key="i"
                class="absolute rounded-full bg-gradient-to-r from-pink-500/10 to-violet-500/10 blur-3xl animate-float"
                :style="{
                    width: `${Math.random() * 20 + 8}rem`,
                    height: `${Math.random() * 20 + 8}rem`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 10 + 15}s`,
                    animationDelay: `${Math.random() * 5}s`
                }">
            </div>
        </div>

        <!-- Header Section -->
        <section class="max-w-7xl mx-auto px-6 py-12 relative z-10">
            <div class="text-center mb-12 animate-fade-in">
                <div class="inline-block animate-pulse-slow mb-4">
                    <div class="p-1 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full inline-block">
                        <div class="bg-indigo-950 p-1 rounded-full">
                            <span class="px-4 py-1 text-sm font-medium">GUILD EVENTS</span>
                        </div>
                    </div>
                </div>

                <h1
                    class="text-4xl sm:text-6xl font-extrabold leading-tight bg-gradient-to-r from-pink-500 via-purple-400 to-violet-400 bg-clip-text text-transparent animate-shimmer mb-4">
                    Velaris Events
                </h1>

                <p class="text-lg text-white/80 max-w-2xl mx-auto">
                    Track our guild's victories, challenges, and ongoing campaigns across TopHeroes
                </p>
            </div>

            <!-- Stats Overview -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12 animate-fade-in-delay">
                <div class="text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                    <div
                        class="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                        {{ events.length }}
                    </div>
                    <div class="text-white/70 text-sm mt-1">Total Events</div>
                </div>
                <div class="text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                    <div
                        class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                        {{ completedEvents }}
                    </div>
                    <div class="text-white/70 text-sm mt-1">Completed</div>
                </div>
                <div class="text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                    <div
                        class="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                        {{ inProgressEvents }}
                    </div>
                    <div class="text-white/70 text-sm mt-1">In Progress</div>
                </div>
                <div class="text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                    <div
                        class="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                        {{ totalParticipants }}
                    </div>
                    <div class="text-white/70 text-sm mt-1">Participants</div>
                </div>
            </div>

            <!-- Controls Section -->
            <div
                class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 animate-fade-in-delay-2">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <!-- Search -->
                    <div class="relative">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input v-model="searchTerm" type="text" placeholder="Search events..."
                            class="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
                    </div>
                    <!-- Event Type Filter -->
                    <Select v-model="filterType">
                        <SelectTrigger
                            class="w-full h-[42px] text-md px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="gvg">Guild vs Guild</SelectItem>
                            <SelectItem value="kvk">Kingdom vs Kingdom</SelectItem>
                            <SelectItem value="gr">Guild Race</SelectItem>
                        </SelectContent>
                    </Select>

                    <!-- Status Filter -->
                    <Select v-model="filterStatus">
                        <SelectTrigger
                            class="w-full h-[42px] text-md px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="active">In Progress</SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Sort Options -->
                <div class="flex flex-wrap gap-2">
                    <button v-for="option in sortOptions" :key="option.value" @click="sortBy = option.value" :class="[
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        sortBy === option.value
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-white/10 text-white/80 hover:bg-white/20'
                    ]">
                        {{ option.label }}
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                <p class="mt-4 text-white/80">Loading events...</p>
            </div>

            <!-- Events Grid -->
            <div v-else-if="filteredEvents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <router-link v-for="(event, index) in filteredEvents" :to="`/topheroes/velaris/events/${event.id}`"
                    :key="event.eventId"
                    class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:-translate-y-2 transition-all duration-500 animate-slide-fade"
                    :style="`animation-delay: ${index * 0.1}s`">
                    <!-- Event Header -->
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-white mb-1">{{ event.event }}</h3>
                            <div class="flex items-center gap-2 text-sm text-white/70">
                                <span class="px-2 py-1 bg-purple-500/20 rounded-full">{{ event.type }}</span>
                                <span :class="[
                                    'px-2 py-1 rounded-full text-xs font-medium',
                                    getStatusColor(event.status)
                                ]">
                                    {{ event.status }}
                                </span>
                            </div>
                        </div>
                        <div class="text-right text-sm text-white/60">
                            <div>ID: {{ event.eventId }}</div>
                        </div>
                    </div>

                    <!-- Event Stats -->
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="text-center">
                            <div
                                class="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                {{ event.memberIds ? event.memberIds.length : 0 }}
                            </div>
                            <div class="text-xs text-white/70">Participants</div>
                        </div>
                        <div class="text-center">
                            <div
                                class="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                                {{ getDuration(event.startDate, event.endDate) }}
                            </div>
                            <div class="text-xs text-white/70">Duration</div>
                        </div>
                    </div>

                    <!-- Event Dates -->
                    <div class="space-y-2 text-sm text-white/70">
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Started: {{ formatDate(event.startDate) }}</span>
                        </div>
                        <div v-if="event.endDate" class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Ended: {{ formatDate(event.endDate) }}</span>
                        </div>
                    </div>

                    <!-- Event Footer -->
                    <div
                        class="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                        <span>By: {{ event.enteredBy }}</span>
                        <span>{{ formatDate(event.createdAt, true) }}</span>
                    </div>
                </router-link>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12 animate-fade-in-delay-3">
                <div
                    class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white/50" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-white/80 mb-2">No Events Found</h3>
                <p class="text-white/60">{{ searchTerm || filterType || filterStatus ? 'Try adjusting your filters' :
                    'No events have been recorded yet' }}</p>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

// Reactive data
const events = ref([])
const loading = ref(true)
const searchTerm = ref('')
const filterType = ref('all')
const filterStatus = ref('all')
const sortBy = ref('startDate')

// Sort options
const sortOptions = [
    { label: 'Start Date', value: 'startDate' },
    { label: 'End Date', value: 'endDate' },
    { label: 'Event Name', value: 'event' },
    { label: 'Participants', value: 'memberIds' },
    { label: 'Created', value: 'createdAt' }
]

// Computed properties
const eventTypes = computed(() => {
    const types = [...new Set(events.value.map(event => event.type).filter(Boolean))]
    return types.sort()
})

const completedEvents = computed(() =>
    events.value.filter(event => event.status?.toLowerCase() === 'completed').length
)

const inProgressEvents = computed(() =>
    events.value.filter(event => event.status?.toLowerCase() === 'active').length
)

const totalParticipants = computed(() =>
    events.value.reduce((total, event) => total + (event.memberIds?.length || 0), 0)
)

const filteredEvents = computed(() => {
    let filtered = [...events.value];

    // Search filter
    if (searchTerm.value) {
        const search = searchTerm.value.toLowerCase();
        filtered = filtered.filter(event =>
            event.event?.toLowerCase().includes(search) ||
            event.type?.toLowerCase().includes(search) ||
            event.enteredBy?.toLowerCase().includes(search)
        );
    }

    // Type filter
    if (filterType.value && filterType.value !== "all") {
        filtered = filtered.filter(event => event.type?.toLowerCase() === filterType.value);
    }

    // Status filter
    if (filterStatus.value && filterStatus.value !== "all") {
        filtered = filtered.filter(event => event.status?.toLowerCase() === filterStatus.value);
    }

    // Sort
    filtered.sort((a, b) => {
        let aVal = a[sortBy.value];
        let bVal = b[sortBy.value];

        if (sortBy.value === "memberIds") {
            aVal = a.memberIds?.length || 0;
            bVal = b.memberIds?.length || 0;
            return bVal - aVal; // Descending for participant count
        }

        if (sortBy.value === "event") {
            return (aVal || "").localeCompare(bVal || "");
        }

        // Date sorting (most recent first)
        if (aVal && bVal) {
            const aDate = aVal.toDate ? aVal.toDate() : new Date(aVal);
            const bDate = bVal.toDate ? bVal.toDate() : new Date(bVal);
            return bDate - aDate;
        }

        return 0;
    });

    return filtered;
});

// Methods
const fetchEvents = async () => {
    try {
        loading.value = true
        const eventsRef = collection(firestore, 'topheroes', 'velaris', 'events')
        const q = query(eventsRef, orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)

        events.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
    } catch (error) {
        console.error('Error fetching events:', error)
    } finally {
        loading.value = false
    }
}

const formatDate = (date, includeTime = false) => {
    if (!date) return 'N/A'

    const dateObj = date.toDate ? date.toDate() : new Date(date)
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }

    if (includeTime) {
        options.hour = '2-digit'
        options.minute = '2-digit'
    }

    return dateObj.toLocaleDateString('en-US', options)
}

const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Ongoing'

    const start = startDate.toDate ? startDate.toDate() : new Date(startDate)
    const end = endDate.toDate ? endDate.toDate() : new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '1 day'
    if (diffDays < 7) return `${diffDays} days`
    if (diffDays < 30) return `${Math.round(diffDays / 7)} weeks`
    return `${Math.round(diffDays / 30)} months`
}

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'completed':
            return 'bg-green-500/20 text-green-400'
        case 'in progress':
            return 'bg-yellow-500/20 text-yellow-400'
        case 'upcoming':
            return 'bg-blue-500/20 text-blue-400'
        default:
            return 'bg-gray-500/20 text-gray-400'
    }
}

// Lifecycle
onMounted(() => {
    fetchEvents()
})
</script>

<style scoped>
/* Base Animations */
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.8s ease-out both;
}

.animate-fade-in-delay {
    animation: fade-in 0.8s ease-out 0.3s both;
}

.animate-fade-in-delay-2 {
    animation: fade-in 0.8s ease-out 0.6s both;
}

.animate-fade-in-delay-3 {
    animation: fade-in 0.8s ease-out 0.9s both;
}

@keyframes slide-fade {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-fade {
    animation: slide-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Floating animation for background elements */
@keyframes float {
    0% {
        transform: translateY(0) translateX(0);
    }

    33% {
        transform: translateY(-5%) translateX(3%);
    }

    66% {
        transform: translateY(5%) translateX(-3%);
    }

    100% {
        transform: translateY(0) translateX(0);
    }
}

.animate-float {
    animation: float 15s ease-in-out infinite;
}

/* Slow pulse animation */
@keyframes pulse-slow {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }
}

.animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
}

/* Shimmer animation for text */
@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

.animate-shimmer {
    background-size: 200% auto;
    animation: shimmer 6s linear infinite;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.5);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.7);
}
</style>