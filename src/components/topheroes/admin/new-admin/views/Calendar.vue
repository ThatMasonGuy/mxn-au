<!-- Calendar.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-4 lg:mb-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                <div>
                    <h1 class="text-xl lg:text-2xl font-semibold text-velaris-purple">Calendar</h1>
                    <p class="text-xs lg:text-sm text-foreground/70 mt-1">
                        Manage your guild events and schedules
                        <span class="text-xs text-velaris-teal ml-2">({{ userTimezone }})</span>
                    </p>
                </div>
                <div class="flex gap-2 lg:gap-3 w-full lg:w-auto">
                    <button @click="goToToday"
                        class="btn-soft-violet flex-1 lg:flex-none text-sm lg:text-base px-3 lg:px-4 py-2">
                        <Calendar class="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                        <span class="hidden sm:inline">Today</span>
                        <span class="sm:hidden">Now</span>
                    </button>
                    <button @click="openNewEventModal()"
                        class="btn-solid-purple flex-1 lg:flex-none text-sm lg:text-base px-3 lg:px-4 py-2">
                        <Plus class="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                        <span class="hidden sm:inline">Add Event</span>
                        <span class="sm:hidden">Add</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Calendar Navigation -->
        <div class="elev-card mb-4 lg:mb-6">
            <div class="p-3 lg:p-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 lg:gap-4">
                        <button @click="previousMonth"
                            class="p-1.5 lg:p-2 hover:bg-foreground/5 rounded-lg transition-colors">
                            <ChevronLeft class="h-4 w-4 lg:h-5 lg:w-5 text-foreground/70" />
                        </button>
                        <div class="text-center min-w-[120px] lg:min-w-[160px]">
                            <h2 class="text-base lg:text-xl font-semibold text-velaris-purple">
                                {{ currentMonthName }} {{ currentYear }}
                            </h2>
                            <p class="text-xs lg:text-sm text-foreground/60">{{ monthStats }}</p>
                        </div>
                        <button @click="nextMonth"
                            class="p-1.5 lg:p-2 hover:bg-foreground/5 rounded-lg transition-colors">
                            <ChevronRight class="h-4 w-4 lg:h-5 lg:w-5 text-foreground/70" />
                        </button>
                    </div>

                    <!-- View Toggle (Mobile) -->
                    <div class="lg:hidden">
                        <button @click="toggleMobileView"
                            class="p-2 hover:bg-foreground/5 rounded-lg transition-colors">
                            <component :is="mobileView === 'month' ? List : CalendarDays"
                                class="h-4 w-4 text-foreground/70" />
                        </button>
                    </div>

                    <!-- Mini Stats (Desktop) -->
                    <div class="hidden lg:flex items-center gap-6">
                        <div class="text-center">
                            <div class="text-lg font-bold text-velaris-green">{{ monthEventCount }}</div>
                            <div class="text-xs text-foreground/60">Events</div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold text-velaris-teal">{{ activeDaysCount }}</div>
                            <div class="text-xs text-foreground/60">Active Days</div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold text-velaris-purple">{{ upcomingEventsCount }}</div>
                            <div class="text-xs text-foreground/60">Upcoming</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile List View -->
        <div v-if="mobileView === 'list' && isMobile" class="lg:hidden space-y-3">
            <div v-for="day in calendarDaysWithEvents" :key="day.date" v-show="day.events.length > 0"
                class="elev-card p-4">
                <div class="mb-3">
                    <div class="flex items-center justify-between">
                        <h3 class="font-semibold text-foreground">
                            {{ formatDayHeader(day.date) }}
                        </h3>
                        <span v-if="isToday(new Date(day.date))"
                            class="text-xs px-2 py-1 bg-velaris-purple/20 text-velaris-purple rounded-full">
                            Today
                        </span>
                    </div>
                </div>
                <div class="space-y-2">
                    <div v-for="event in day.events" :key="event.id" @click="viewEvent(event)"
                        class="flex items-center gap-3 p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer">
                        <div
                            :class="['w-10 h-10 rounded-lg flex items-center justify-center', getEventColorClass(event.type)]">
                            <component :is="getEventIcon(event.type)" class="h-5 w-5 text-white" />
                        </div>
                        <div class="flex-1">
                            <div class="font-medium text-sm">{{ event.title }}</div>
                            <div class="text-xs text-foreground/60">
                                {{ formatEventTime(event) }}
                                <span v-if="getEventPhase(event, day.date)" class="ml-2 text-velaris-teal">
                                    • {{ getEventPhase(event, day.date) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Calendar Grid (Desktop + Mobile Month View) -->
        <div v-show="mobileView === 'month' || !isMobile" class="elev-card overflow-hidden">
            <div class="p-2 lg:p-6">
                <!-- Days of Week Header -->
                <div class="grid grid-cols-7 gap-0 mb-1 lg:mb-2">
                    <div v-for="day in dayHeaders" :key="day"
                        class="p-1 lg:p-4 text-center text-xs lg:text-sm font-semibold text-foreground/80 border-b-2 border-velaris-purple/20">
                        {{ day }}
                    </div>
                </div>

                <!-- Calendar Days Grid -->
                <div class="grid grid-cols-7 gap-0 border border-border/30 rounded-lg overflow-hidden">
                    <div v-for="(day, index) in calendarDays" :key="`${day.date}-${index}`" :class="getDayClasses(day)"
                        @click="selectDay(day)" @dblclick="!isMobile && openNewEventModal(day.date)">

                        <!-- Day Number -->
                        <div :class="getDayNumberClasses(day)">
                            {{ day.day }}
                        </div>

                        <!-- Events for this day -->
                        <div class="space-y-1 hidden lg:block">
                            <div v-for="event in getEventsForDay(day.date)" :key="event.id"
                                @click.stop="viewEvent(event)" :class="getEventClasses(event)"
                                :style="getEventStyle(event, day.date)">

                                <!-- Event content -->
                                <div class="flex items-center gap-1">
                                    <component :is="getEventIcon(event.type)"
                                        class="h-3 w-3 flex-shrink-0 opacity-90" />
                                    <span class="truncate text-xs">
                                        {{ getEventDisplayTitle(event, day.date) }}
                                    </span>
                                </div>
                            </div>

                            <!-- More events indicator -->
                            <div v-if="getHiddenEventCount(day.date) > 0"
                                class="text-xs text-velaris-purple cursor-pointer hover:text-velaris-teal transition-colors font-medium"
                                @click.stop="showDayEvents(day)">
                                +{{ getHiddenEventCount(day.date) }} more
                            </div>
                        </div>

                        <!-- Mobile event dots -->
                        <div class="flex gap-1 mt-1 lg:hidden justify-center flex-wrap">
                            <div v-for="(event, idx) in getEventsForDay(day.date).slice(0, 3)" :key="event.id"
                                :class="['w-1.5 h-1.5 rounded-full', getMobileEventDotColor(event.type)]">
                            </div>
                            <div v-if="getHiddenEventCount(day.date) > 0"
                                class="w-1.5 h-1.5 rounded-full bg-foreground/30">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Event Type Legend -->
        <div class="mt-4 lg:mt-6 elev-card p-3 lg:p-6">
            <h3 class="text-xs lg:text-sm font-semibold text-foreground/80 mb-3 lg:mb-4">Event Types</h3>
            <div class="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-4">
                <div v-for="type in eventTypes" :key="type.value" class="flex items-center gap-2 lg:gap-3">
                    <div :class="['w-3 h-3 lg:w-4 lg:h-4 rounded-md shadow-sm', getEventColorClass(type.value)]"></div>
                    <component :is="getEventIcon(type.value)" class="h-3 w-3 lg:h-4 lg:w-4 text-foreground/60" />
                    <span class="text-xs lg:text-sm text-foreground/70 font-medium truncate">{{ type.label }}</span>
                </div>
            </div>
        </div>

        <!-- Add/Edit Event Modal -->
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="showEventModal"
                    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div @click.stop
                        class="bg-background rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-border/20">
                        <div class="p-4 lg:p-6">
                            <div class="flex items-center justify-between mb-4 lg:mb-6">
                                <h3 class="text-lg lg:text-xl font-semibold text-velaris-purple">
                                    {{ editingEvent ? 'Edit Event' : 'Add New Event' }}
                                </h3>
                                <button @click="closeEventModal"
                                    class="p-1.5 lg:p-2 hover:bg-foreground/5 rounded-lg transition-colors">
                                    <X class="h-4 w-4 lg:h-5 lg:w-5" />
                                </button>
                            </div>

                            <form @submit.prevent="saveEvent" class="space-y-4 lg:space-y-5">
                                <!-- Event Title -->
                                <div>
                                    <label
                                        class="block text-xs lg:text-sm font-semibold text-foreground/80 mb-1.5 lg:mb-2">
                                        Event Title
                                    </label>
                                    <input v-model="eventForm.title" type="text" required
                                        placeholder="Enter event title"
                                        class="w-full px-3 lg:px-4 py-2 lg:py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-velaris-purple/30 focus:border-velaris-purple bg-background transition-all text-sm lg:text-base">
                                </div>

                                <!-- Event Type -->
                                <div>
                                    <label
                                        class="block text-xs lg:text-sm font-semibold text-foreground/80 mb-1.5 lg:mb-2">
                                        Event Type
                                    </label>
                                    <select v-model="eventForm.type" required
                                        class="w-full px-3 lg:px-4 py-2 lg:py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-velaris-purple/30 focus:border-velaris-purple bg-background transition-all text-sm lg:text-base">
                                        <option v-for="type in eventTypes" :key="type.value" :value="type.value">
                                            {{ type.label }}
                                        </option>
                                    </select>
                                </div>

                                <!-- All Day Toggle -->
                                <div class="flex items-center gap-3">
                                    <input type="checkbox" v-model="eventForm.allDay" id="allDay"
                                        class="w-4 h-4 text-velaris-purple bg-background border-border/50 rounded focus:ring-velaris-purple/30">
                                    <label for="allDay" class="text-xs lg:text-sm font-medium text-foreground/80">
                                        All day event
                                    </label>
                                </div>

                                <!-- Date and Time Fields -->
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                                    <div>
                                        <label
                                            class="block text-xs lg:text-sm font-semibold text-foreground/80 mb-1.5 lg:mb-2">
                                            Start {{ eventForm.allDay ? 'Date' : 'Date & Time' }}
                                        </label>
                                        <input v-if="eventForm.allDay" v-model="eventForm.startDate" type="date"
                                            required
                                            class="w-full px-3 lg:px-4 py-2 lg:py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-velaris-purple/30 focus:border-velaris-purple bg-background transition-all text-sm lg:text-base">
                                        <input v-else v-model="eventForm.startDateTime" type="datetime-local" required
                                            class="w-full px-3 lg:px-4 py-2 lg:py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-velaris-purple/30 focus:border-velaris-purple bg-background transition-all text-sm lg:text-base">
                                    </div>
                                    <div>
                                        <label
                                            class="block text-xs lg:text-sm font-semibold text-foreground/80 mb-1.5 lg:mb-2">
                                            End {{ eventForm.allDay ? 'Date' : 'Date & Time' }}
                                        </label>
                                        <input v-if="eventForm.allDay" v-model="eventForm.endDate" type="date" required
                                            class="w-full px-3 lg:px-4 py-2 lg:py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-velaris-purple/30 focus:border-velaris-purple bg-background transition-all text-sm lg:text-base">
                                        <input v-else v-model="eventForm.endDateTime" type="datetime-local" required
                                            class="w-full px-3 lg:px-4 py-2 lg:py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-velaris-purple/30 focus:border-velaris-purple bg-background transition-all text-sm lg:text-base">
                                    </div>
                                </div>

                                <!-- Description -->
                                <div>
                                    <label
                                        class="block text-xs lg:text-sm font-semibold text-foreground/80 mb-1.5 lg:mb-2">
                                        Description (Optional)
                                    </label>
                                    <textarea v-model="eventForm.description" rows="3" placeholder="Event details..."
                                        class="w-full px-3 lg:px-4 py-2 lg:py-3 border border-border/50 rounded-lg focus:ring-2 focus:ring-velaris-purple/30 focus:border-velaris-purple bg-background transition-all resize-none text-sm lg:text-base">
                                    </textarea>
                                </div>

                                <!-- Form Actions -->
                                <div class="flex justify-end gap-2 lg:gap-3 pt-3 lg:pt-4 border-t border-border/20">
                                    <button type="button" @click="closeEventModal"
                                        class="btn-soft-violet text-sm lg:text-base px-3 lg:px-4 py-2">
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        class="btn-solid-purple text-sm lg:text-base px-3 lg:px-4 py-2">
                                        {{ editingEvent ? 'Update Event' : 'Create Event' }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Event Details Modal -->
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="selectedEvent"
                    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div @click.stop
                        class="bg-background rounded-xl shadow-2xl w-full max-w-md border border-border/20">
                        <div class="p-4 lg:p-6">
                            <div class="flex items-start justify-between mb-4 lg:mb-6">
                                <div class="flex items-center gap-3 lg:gap-4">
                                    <div
                                        :class="['w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center shadow-lg', getEventColorClass(selectedEvent.type)]">
                                        <component :is="getEventIcon(selectedEvent.type)"
                                            class="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 class="text-base lg:text-lg font-semibold text-foreground">
                                            {{ selectedEvent.title }}
                                        </h3>
                                        <p class="text-xs lg:text-sm text-foreground/60">
                                            {{ getEventTypeLabel(selectedEvent.type) }}
                                        </p>
                                    </div>
                                </div>
                                <button @click="selectedEvent = null"
                                    class="p-1.5 lg:p-2 hover:bg-foreground/5 rounded-lg transition-colors">
                                    <X class="h-4 w-4 lg:h-5 lg:w-5" />
                                </button>
                            </div>

                            <div class="space-y-3 lg:space-y-4">
                                <!-- Duration -->
                                <div>
                                    <div class="text-xs lg:text-sm font-semibold text-foreground/80 mb-1.5 lg:mb-2">
                                        Duration
                                    </div>
                                    <div class="text-xs lg:text-sm text-foreground/70">
                                        {{ formatEventFullDate(selectedEvent) }}
                                        <span class="text-velaris-teal font-medium ml-2">
                                            ({{ getEventDuration(selectedEvent) }})
                                        </span>
                                    </div>
                                </div>

                                <!-- Event Phases (for GvG and KvK) -->
                                <div
                                    v-if="(selectedEvent.type === 'GvG' || selectedEvent.type === 'KvK') && getEventPhases(selectedEvent).length > 0">
                                    <div class="text-xs lg:text-sm font-semibold text-foreground/80 mb-1.5 lg:mb-2">
                                        Daily Phases
                                    </div>
                                    <div class="space-y-1">
                                        <div v-for="phase in getEventPhases(selectedEvent)" :key="phase.date"
                                            class="flex items-center justify-between text-xs lg:text-sm bg-foreground/5 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg">
                                            <span class="text-foreground/70">{{ phase.day }}</span>
                                            <span class="font-medium text-velaris-teal">{{ phase.phase }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Description -->
                                <div v-if="selectedEvent.description">
                                    <div class="text-xs lg:text-sm font-semibold text-foreground/80 mb-1.5 lg:mb-2">
                                        Description
                                    </div>
                                    <div
                                        class="text-xs lg:text-sm text-foreground/70 bg-foreground/5 p-2 lg:p-3 rounded-lg">
                                        {{ selectedEvent.description }}
                                    </div>
                                </div>

                                <!-- Actions -->
                                <div class="flex justify-end gap-2 lg:gap-3 pt-3 lg:pt-4 border-t border-border/30">
                                    <button @click="editEvent(selectedEvent)"
                                        class="btn-soft-violet text-sm lg:text-base px-3 lg:px-4 py-2">
                                        <Edit class="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                                        Edit
                                    </button>
                                    <button @click="confirmDeleteEvent(selectedEvent)"
                                        class="text-red-400 hover:text-red-300 px-3 lg:px-4 py-2 rounded-lg hover:bg-red-400/10 transition-colors text-xs lg:text-sm font-medium">
                                        <Trash2 class="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 inline" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Delete Confirmation Modal -->
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="eventToDelete"
                    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div @click.stop
                        class="bg-background rounded-xl shadow-2xl w-full max-w-sm border border-border/20">
                        <div class="p-4 lg:p-6">
                            <div class="text-center">
                                <div
                                    class="w-12 h-12 lg:w-16 lg:h-16 bg-red-400/15 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                                    <Trash2 class="h-6 w-6 lg:h-8 lg:w-8 text-red-400" />
                                </div>
                                <h3 class="text-base lg:text-lg font-semibold text-foreground mb-1.5 lg:mb-2">
                                    Delete Event
                                </h3>
                                <p class="text-xs lg:text-sm text-foreground/70 mb-4 lg:mb-6">
                                    Are you sure you want to delete "{{ eventToDelete.title }}"? This action cannot be
                                    undone.
                                </p>
                                <div class="flex justify-center gap-2 lg:gap-3">
                                    <button @click="eventToDelete = null"
                                        class="btn-soft-violet text-sm lg:text-base px-3 lg:px-4 py-2">
                                        Cancel
                                    </button>
                                    <button @click="deleteEvent"
                                        class="bg-red-500 hover:bg-red-600 text-white px-3 lg:px-4 py-2 rounded-lg transition-colors text-xs lg:text-sm font-medium">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
    Calendar, Plus, ChevronLeft, ChevronRight, X, Edit, Trash2,
    Shield, Sword, Trophy, Target, Users, Crown, Zap, List, CalendarDays
} from 'lucide-vue-next'

// Reactive data
const currentDate = ref(new Date())
const selectedDate = ref(null)
const showEventModal = ref(false)
const selectedEvent = ref(null)
const eventToDelete = ref(null)
const editingEvent = ref(null)
const events = ref([])
const userTimezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
const isMobile = ref(false)
const mobileView = ref('month') // 'month' or 'list'

// Form data for events
const eventForm = ref({
    title: '',
    type: 'GvG',
    allDay: true,
    startDate: '',
    endDate: '',
    startDateTime: '',
    endDateTime: '',
    description: ''
})

// Event types configuration
const eventTypes = [
    { value: 'GvG', label: 'Guild vs Guild', icon: Sword },
    { value: 'GR', label: 'Guild Race', icon: Trophy },
    { value: 'KvK', label: 'Kingdom vs Kingdom', icon: Shield },
    { value: 'GB', label: 'Guild Boss', icon: Crown },
    { value: 'DEI', label: 'Dark Empire Invasion', icon: Zap }
]

// Phase rotation for multi-day events
const dailyPhases = ['Construction', 'Research', 'Rally', 'Hero', 'Training', 'War']

// Day headers
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const dayHeaders = computed(() => {
    if (isMobile.value) {
        return ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    }
    return daysOfWeek
})

// Computed properties
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentMonthName = computed(() => {
    return new Intl.DateTimeFormat('en', { month: 'long' }).format(currentDate.value)
})

const monthStats = computed(() => {
    const monthEvents = getEventsInMonth()
    return `${monthEvents.length} events this month`
})

const monthEventCount = computed(() => getEventsInMonth().length)

const activeDaysCount = computed(() => {
    const daysWithEvents = new Set()
    getEventsInMonth().forEach(event => {
        const start = new Date(event.startUTC)
        const end = new Date(event.endUTC)

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            if (d.getMonth() === currentMonth.value && d.getFullYear() === currentYear.value) {
                daysWithEvents.add(d.getDate())
            }
        }
    })
    return daysWithEvents.size
})

const upcomingEventsCount = computed(() => {
    const now = new Date()
    return events.value.filter(event => {
        const eventStart = new Date(event.startUTC)
        return eventStart >= now
    }).length
})

const calendarDays = computed(() => {
    const year = currentYear.value
    const month = currentMonth.value

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const prevMonth = new Date(year, month - 1, 0)
    const daysFromPrevMonth = startingDayOfWeek

    const totalCells = 42
    const daysFromNextMonth = totalCells - daysInMonth - daysFromPrevMonth

    const days = []

    // Previous month days
    for (let i = daysFromPrevMonth; i > 0; i--) {
        const day = prevMonth.getDate() - i + 1
        const date = new Date(year, month - 1, day)
        days.push({
            day,
            date: formatDateForKey(date),
            isCurrentMonth: false,
            isToday: isToday(date),
            isSelected: selectedDate.value && formatDateForKey(date) === selectedDate.value
        })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        days.push({
            day,
            date: formatDateForKey(date),
            isCurrentMonth: true,
            isToday: isToday(date),
            isSelected: selectedDate.value && formatDateForKey(date) === selectedDate.value
        })
    }

    // Next month days
    for (let day = 1; day <= daysFromNextMonth; day++) {
        const date = new Date(year, month + 1, day)
        days.push({
            day,
            date: formatDateForKey(date),
            isCurrentMonth: false,
            isToday: isToday(date),
            isSelected: selectedDate.value && formatDateForKey(date) === selectedDate.value
        })
    }

    return days
})

const calendarDaysWithEvents = computed(() => {
    return calendarDays.value.map(day => ({
        ...day,
        events: getEventsForDay(day.date, 50) // Get all events for list view
    })).filter(day => day.isCurrentMonth)
})

// Helper functions
const formatDateForKey = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
}

const getEventsInMonth = () => {
    return events.value.filter(event => {
        const eventStart = new Date(event.startUTC)
        const eventEnd = new Date(event.endUTC)
        const monthStart = new Date(currentYear.value, currentMonth.value, 1)
        const monthEnd = new Date(currentYear.value, currentMonth.value + 1, 0)

        return (eventStart <= monthEnd && eventEnd >= monthStart)
    })
}

const getEventsForDay = (dateString, maxVisible = 3) => {
    const dayStart = new Date(dateString + 'T00:00:00')
    const dayEnd = new Date(dateString + 'T23:59:59')

    const dayEvents = events.value.filter(event => {
        const eventStart = new Date(event.startUTC)
        const eventEnd = new Date(event.endUTC)

        return eventStart <= dayEnd && eventEnd >= dayStart
    })

    return dayEvents.slice(0, maxVisible).map(event => ({
        ...event,
        isMultiDay: new Date(event.endUTC) > new Date(event.startUTC)
    }))
}

const getHiddenEventCount = (dateString) => {
    const maxVisible = 3
    const dayStart = new Date(dateString + 'T00:00:00')
    const dayEnd = new Date(dateString + 'T23:59:59')

    const dayEvents = events.value.filter(event => {
        const eventStart = new Date(event.startUTC)
        const eventEnd = new Date(event.endUTC)

        return eventStart <= dayEnd && eventEnd >= dayStart
    })

    return Math.max(0, dayEvents.length - maxVisible)
}

const getEventColorClass = (type) => {
    const colors = {
        'GvG': 'bg-gradient-to-r from-velaris-teal to-velaris-green text-white',
        'GR': 'bg-gradient-to-r from-velaris-amber to-velaris-purple text-white',
        'KvK': 'bg-gradient-to-r from-velaris-purple to-velaris-teal text-white',
        'GB': 'bg-velaris-green text-white',
        'DEI': 'bg-gradient-to-r from-red-500 to-purple-600 text-white'
    }
    return colors[type] || 'bg-velaris-purple text-white'
}

const getMobileEventDotColor = (type) => {
    const colors = {
        'GvG': 'bg-velaris-teal',
        'GR': 'bg-velaris-amber',
        'KvK': 'bg-velaris-purple',
        'GB': 'bg-velaris-green',
        'DEI': 'bg-red-500'
    }
    return colors[type] || 'bg-velaris-purple'
}

const getEventIcon = (type) => {
    const typeConfig = eventTypes.find(t => t.value === type)
    return typeConfig?.icon || Target
}

const getEventTypeLabel = (type) => {
    const typeConfig = eventTypes.find(t => t.value === type)
    return typeConfig?.label || 'Unknown Event'
}

const getEventPhase = (event, dateString) => {
    if (event.type !== 'GvG' && event.type !== 'KvK') return null

    const eventStart = new Date(event.startUTC)
    const currentDay = new Date(dateString + 'T00:00:00')

    const dayIndex = Math.floor((currentDay - eventStart) / (1000 * 60 * 60 * 24))

    if (dayIndex >= 0 && dayIndex < dailyPhases.length) {
        return dailyPhases[dayIndex]
    }

    return null
}

const getEventPhases = (event) => {
    if (event.type !== 'GvG' && event.type !== 'KvK') return []

    const phases = []
    const eventStart = new Date(event.startUTC)
    const eventEnd = new Date(event.endUTC)

    let currentDate = new Date(eventStart)
    let dayIndex = 0

    while (currentDate <= eventEnd && dayIndex < dailyPhases.length) {
        phases.push({
            date: formatDateForKey(currentDate),
            day: currentDate.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }),
            phase: dailyPhases[dayIndex]
        })

        currentDate.setDate(currentDate.getDate() + 1)
        dayIndex++
    }

    return phases
}

const getEventDisplayTitle = (event, dateString) => {
    const phase = getEventPhase(event, dateString)
    if (phase) {
        return `${event.title} - ${phase}`
    }
    return event.title
}

const formatEventTime = (event) => {
    if (event.allDay) {
        return 'All day'
    }

    const start = new Date(event.startUTC)
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true }

    return start.toLocaleTimeString('en', timeOptions)
}

const formatEventFullDate = (event) => {
    const start = new Date(event.startUTC)
    const end = new Date(event.endUTC)

    if (event.allDay) {
        if (formatDateForKey(start) === formatDateForKey(end)) {
            return start.toLocaleDateString('en', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }

        return `${start.toLocaleDateString('en', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }

    const dateOptions = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }

    return `${start.toLocaleString('en', dateOptions)} - ${end.toLocaleString('en', dateOptions)}`
}

const formatDayHeader = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    })
}

const getEventDuration = (event) => {
    const start = new Date(event.startUTC)
    const end = new Date(event.endUTC)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (event.allDay) {
        if (diffDays === 0) return '1 day'
        return `${diffDays + 1} days`
    }

    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours === 0) return `${diffMinutes} min`
    if (diffMinutes === 0) return `${diffHours} hr`
    return `${diffHours} hr ${diffMinutes} min`
}

const getDayClasses = (day) => {
    const classes = [
        'relative min-h-[80px] lg:min-h-[140px] border-r border-b border-border/20 p-2 lg:p-3',
        'hover:bg-foreground/5 transition-all duration-200 cursor-pointer'
    ]

    if (day.isCurrentMonth) {
        classes.push('bg-background')
    } else {
        classes.push('bg-foreground/5')
    }

    if (day.isToday) {
        classes.push('bg-gradient-to-br from-velaris-purple/15 to-velaris-teal/10 border-velaris-purple/30')
    }

    if (day.isSelected) {
        classes.push('bg-velaris-teal/10 border-velaris-teal/30')
    }

    classes.push('last:border-r-0 [&:nth-child(7n)]:border-r-0')

    return classes
}

const getDayNumberClasses = (day) => {
    const classes = [
        'inline-flex items-center justify-center w-5 h-5 lg:w-7 lg:h-7 text-xs lg:text-sm font-bold rounded-full mb-1 lg:mb-2'
    ]

    if (day.isToday) {
        classes.push('bg-velaris-purple text-white shadow-lg')
    } else if (!day.isCurrentMonth) {
        classes.push('text-foreground/30')
    } else if (day.isSelected && !day.isToday) {
        classes.push('bg-velaris-teal text-white')
    } else {
        classes.push('text-foreground')
    }

    return classes
}

const getEventClasses = (event) => {
    return [
        'relative text-xs px-2 py-1.5 rounded-md cursor-pointer font-medium',
        'hover:scale-[1.02] transition-all duration-200 shadow-sm',
        getEventColorClass(event.type),
        event.isMultiDay ? 'border-l-3' : ''
    ]
}

const getEventStyle = (event, dateString) => {
    if (!event.isMultiDay) return {}

    const isStart = formatDateForKey(new Date(event.startUTC)) === dateString
    const isEnd = formatDateForKey(new Date(event.endUTC)) === dateString

    return {
        borderTopLeftRadius: isStart ? '6px' : '0',
        borderBottomLeftRadius: isStart ? '6px' : '0',
        borderTopRightRadius: isEnd ? '6px' : '0',
        borderBottomRightRadius: isEnd ? '6px' : '0',
    }
}

// Timezone conversion helpers
const convertToUTC = (localDateTime) => {
    const date = new Date(localDateTime)
    return date.toISOString()
}

const convertFromUTC = (utcDateTime) => {
    const date = new Date(utcDateTime)
    return date.toLocaleString()
}

// Generate scheduled events
const generateScheduledEvents = () => {
    const events = []
    const grStart = new Date('2025-09-08T00:00:00Z')
    const gbStart = new Date('2025-09-10T00:00:00Z')
    const deiStart = new Date()

    // Set DEI to Thursday UTC
    deiStart.setUTCDate(deiStart.getUTCDate() - (deiStart.getUTCDay() + 3) % 7)
    deiStart.setUTCHours(0, 0, 0, 0)

    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 6)

    let currentDate = new Date(grStart)
    let eventCycle = 0

    // Generate main event cycle
    while (currentDate <= endDate) {
        let eventType, duration, eventName

        switch (eventCycle % 4) {
            case 0:
            case 2:
                eventType = 'GR'
                duration = 7
                eventName = 'Guild Race'
                break
            case 1:
                eventType = 'KvK'
                duration = 6
                eventName = 'Kingdom vs Kingdom'
                break
            case 3:
                eventType = 'GvG'
                duration = 6
                eventName = 'Guild vs Guild'
                break
        }

        const eventEnd = new Date(currentDate)
        eventEnd.setUTCDate(eventEnd.getUTCDate() + duration - 1)
        eventEnd.setUTCHours(23, 59, 59, 999)

        events.push({
            id: `${eventType}-${currentDate.toISOString()}`,
            title: eventName,
            type: eventType,
            startUTC: currentDate.toISOString(),
            endUTC: eventEnd.toISOString(),
            allDay: true,
            description: `${duration}-day ${eventName} event`
        })

        // Move to next event
        currentDate = new Date(eventEnd)
        currentDate.setUTCDate(currentDate.getUTCDate() + 1)
        currentDate.setUTCHours(0, 0, 0, 0)

        // Add breather day after KvK and GvG
        if (eventType === 'KvK' || eventType === 'GvG') {
            currentDate.setUTCDate(currentDate.getUTCDate() + 1)
        }

        eventCycle++
    }

    // Generate Guild Boss events
    let gbDate = new Date(gbStart)
    while (gbDate <= endDate) {
        const gbEnd = new Date(gbDate)
        gbEnd.setUTCHours(23, 59, 59, 999)

        events.push({
            id: `GB-${gbDate.toISOString()}`,
            title: 'Guild Boss',
            type: 'GB',
            startUTC: gbDate.toISOString(),
            endUTC: gbEnd.toISOString(),
            allDay: true,
            description: 'Daily Guild Boss battle'
        })

        gbDate.setUTCDate(gbDate.getUTCDate() + 3)
    }

    // Generate Dark Empire Invasion events
    let deiDate = new Date(deiStart)
    while (deiDate <= endDate) {
        const deiEnd = new Date(deiDate)
        deiEnd.setUTCHours(23, 59, 59, 999)

        events.push({
            id: `DEI-${deiDate.toISOString()}`,
            title: 'Dark Empire Invasion',
            type: 'DEI',
            startUTC: deiDate.toISOString(),
            endUTC: deiEnd.toISOString(),
            allDay: true,
            description: 'Weekly Dark Empire Invasion event'
        })

        deiDate.setUTCDate(deiDate.getUTCDate() + 7)
    }

    return events.sort((a, b) => new Date(a.startUTC) - new Date(b.startUTC))
}

// Actions
const previousMonth = () => {
    currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const nextMonth = () => {
    currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

const goToToday = () => {
    currentDate.value = new Date()
    selectedDate.value = formatDateForKey(new Date())
}

const selectDay = (day) => {
    selectedDate.value = day.date
    if (isMobile.value && getEventsForDay(day.date, 50).length > 0) {
        showDayEvents(day)
    }
}

const toggleMobileView = () => {
    mobileView.value = mobileView.value === 'month' ? 'list' : 'month'
}

const openNewEventModal = (date = null) => {
    editingEvent.value = null
    eventForm.value = {
        title: '',
        type: 'GvG',
        allDay: true,
        startDate: date || formatDateForKey(new Date()),
        endDate: date || formatDateForKey(new Date()),
        startDateTime: '',
        endDateTime: '',
        description: ''
    }

    if (!eventForm.value.allDay) {
        const now = new Date()
        const startTime = new Date(eventForm.value.startDate + 'T09:00:00')
        const endTime = new Date(eventForm.value.endDate + 'T10:00:00')

        eventForm.value.startDateTime = formatDateTimeLocal(startTime)
        eventForm.value.endDateTime = formatDateTimeLocal(endTime)
    }

    showEventModal.value = true
}

const formatDateTimeLocal = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}`
}

const closeEventModal = () => {
    showEventModal.value = false
    editingEvent.value = null
}

const saveEvent = () => {
    let startUTC, endUTC

    if (eventForm.value.allDay) {
        startUTC = new Date(eventForm.value.startDate + 'T00:00:00').toISOString()
        endUTC = new Date(eventForm.value.endDate + 'T23:59:59').toISOString()
    } else {
        startUTC = new Date(eventForm.value.startDateTime).toISOString()
        endUTC = new Date(eventForm.value.endDateTime).toISOString()
    }

    const eventData = {
        id: editingEvent.value?.id || Date.now().toString(),
        title: eventForm.value.title,
        type: eventForm.value.type,
        startUTC,
        endUTC,
        allDay: eventForm.value.allDay,
        description: eventForm.value.description
    }

    if (editingEvent.value) {
        const index = events.value.findIndex(e => e.id === editingEvent.value.id)
        if (index !== -1) {
            events.value[index] = eventData
        }
    } else {
        events.value.push(eventData)
    }

    // Save to localStorage
    localStorage.setItem('calendarEvents', JSON.stringify(events.value))

    closeEventModal()
}

const viewEvent = (event) => {
    selectedEvent.value = event
}

const editEvent = (event) => {
    editingEvent.value = event

    const startDate = new Date(event.startUTC)
    const endDate = new Date(event.endUTC)

    eventForm.value = {
        title: event.title,
        type: event.type,
        allDay: event.allDay,
        startDate: formatDateForKey(startDate),
        endDate: formatDateForKey(endDate),
        startDateTime: formatDateTimeLocal(startDate),
        endDateTime: formatDateTimeLocal(endDate),
        description: event.description || ''
    }

    selectedEvent.value = null
    showEventModal.value = true
}

const confirmDeleteEvent = (event) => {
    eventToDelete.value = event
    selectedEvent.value = null
}

const deleteEvent = () => {
    if (eventToDelete.value) {
        events.value = events.value.filter(e => e.id !== eventToDelete.value.id)
        localStorage.setItem('calendarEvents', JSON.stringify(events.value))
        eventToDelete.value = null
    }
}

const showDayEvents = (day) => {
    const dayEvents = getEventsForDay(day.date, 50)
    if (dayEvents.length === 1) {
        viewEvent(dayEvents[0])
    } else if (dayEvents.length > 1) {
        selectedDate.value = day.date
    }
}

// Check if mobile
const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024
}

// Watch for allDay toggle to update form fields
watch(() => eventForm.value.allDay, (newVal) => {
    if (!newVal && (!eventForm.value.startDateTime || !eventForm.value.endDateTime)) {
        const startDate = new Date(eventForm.value.startDate + 'T09:00:00')
        const endDate = new Date(eventForm.value.endDate + 'T10:00:00')

        eventForm.value.startDateTime = formatDateTimeLocal(startDate)
        eventForm.value.endDateTime = formatDateTimeLocal(endDate)
    }
})

// Initialize
onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Load saved events from localStorage
    const savedEvents = localStorage.getItem('calendarEvents')
    if (savedEvents) {
        try {
            events.value = JSON.parse(savedEvents)
        } catch (e) {
            console.error('Failed to load saved events:', e)
            events.value = generateScheduledEvents()
        }
    } else {
        events.value = generateScheduledEvents()
    }

    selectedDate.value = formatDateForKey(new Date())
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .bg-background,
.modal-leave-active .bg-background {
    transition: transform 0.3s ease;
}

.modal-enter-from .bg-background {
    transform: scale(0.9);
}

.modal-leave-to .bg-background {
    transform: scale(0.9);
}

/* Custom animations */
.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Border utilities */
.border-l-3 {
    border-left-width: 3px;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.3);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.5);
}
</style>