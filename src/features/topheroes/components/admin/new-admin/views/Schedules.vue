<!-- TopHeroes Schedules.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <h1 class="text-2xl font-semibold text-th-primary">Event Schedules</h1>
                    <p class="text-sm text-foreground/70 mt-1">Manage game event timers and recurring schedules</p>
                </div>
                <div class="flex gap-3 w-full lg:w-auto">
                    <button @click="activeView = activeView === 'calendar' ? 'list' : 'calendar'"
                        class="btn-th-soft flex-1 lg:flex-none">
                        <component :is="activeView === 'calendar' ? List : Calendar" class="h-4 w-4 mr-2" />
                        {{ activeView === 'calendar' ? 'List View' : 'Calendar View' }}
                    </button>
                    <button @click="showCreateSchedule = true" class="btn-th-primary flex-1 lg:flex-none">
                        <Plus class="h-4 w-4 mr-2" />
                        New Schedule
                    </button>
                </div>
            </div>
        </div>

        <!-- Quick Stats -->
        <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="th-stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-foreground/70">Active Schedules</div>
                        <div class="text-2xl font-bold text-th-success">{{ activeSchedules.length }}</div>
                        <div class="text-xs text-foreground/60">Running now</div>
                    </div>
                    <Clock class="h-8 w-8 text-th-success" />
                </div>
            </div>
            <div class="th-stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-foreground/70">Next Event</div>
                        <div class="text-2xl font-bold text-th-primary">{{ nextEventCountdown }}</div>
                        <div class="text-xs text-foreground/60">{{ nextEventName }}</div>
                    </div>
                    <Timer class="h-8 w-8 text-th-primary" />
                </div>
            </div>
            <div class="th-stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-foreground/70">Today's Events</div>
                        <div class="text-2xl font-bold text-th-warning">{{ todaysEvents.length }}</div>
                        <div class="text-xs text-foreground/60">Scheduled</div>
                    </div>
                    <CalendarDays class="h-8 w-8 text-th-warning" />
                </div>
            </div>
            <div class="th-stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-foreground/70">Weekly Events</div>
                        <div class="text-2xl font-bold text-th-secondary">{{ weeklyEvents.length }}</div>
                        <div class="text-xs text-foreground/60">This week</div>
                    </div>
                    <Repeat class="h-8 w-8 text-th-secondary" />
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="mb-6">
            <div class="elev-card p-4">
                <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div class="flex-1">
                        <div class="relative">
                            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                            <input v-model="searchQuery" type="search" placeholder="Search schedules and events..."
                                class="pl-10 pr-4 py-2 w-full bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-th-primary/50 transition" />
                        </div>
                    </div>
                    <div class="flex gap-3 flex-wrap">
                        <select v-model="filterType"
                            class="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-th-primary/50 transition">
                            <option value="">All Types</option>
                            <option value="daily">Daily Events</option>
                            <option value="weekly">Weekly Events</option>
                            <option value="special">Special Events</option>
                            <option value="seasonal">Seasonal</option>
                        </select>
                        <select v-model="filterStatus"
                            class="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-th-primary/50 transition">
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Calendar View -->
        <div v-if="activeView === 'calendar'" class="elev-card p-6">
            <div class="mb-6 flex items-center justify-between">
                <h3 class="text-lg font-semibold text-th-primary">Event Calendar</h3>
                <div class="flex items-center gap-2">
                    <button @click="currentWeek--" class="p-2 hover:bg-foreground/5 rounded">
                        <ChevronLeft class="h-4 w-4" />
                    </button>
                    <button @click="goToCurrentWeek" class="px-3 py-1 text-sm bg-th-primary/10 text-th-primary rounded">
                        This Week
                    </button>
                    <button @click="currentWeek++" class="p-2 hover:bg-foreground/5 rounded">
                        <ChevronRight class="h-4 w-4" />
                    </button>
                </div>
            </div>

            <!-- Week Days -->
            <div class="grid grid-cols-7 gap-2 mb-4">
                <div v-for="day in weekDays" :key="day.date" class="min-h-32 border border-border rounded-lg p-2"
                    :class="{ 'bg-th-primary/5 border-th-primary/30': isToday(day.date) }">
                    <div class="text-sm font-medium text-foreground mb-2">
                        {{ day.name }}
                        <span class="text-foreground/60">{{ day.date }}</span>
                    </div>

                    <div class="space-y-1">
                        <div v-for="event in getEventsForDay(day.fullDate)" :key="event.id"
                            class="text-xs p-1.5 rounded text-white cursor-pointer"
                            :class="getEventTypeClass(event.type)" @click="editSchedule(event)">
                            <div class="font-medium">{{ event.name }}</div>
                            <div class="opacity-80">{{ formatTime(event.time) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- List View -->
        <div v-if="activeView === 'list'" class="space-y-4">
            <!-- Upcoming Events -->
            <div class="elev-card">
                <div class="p-4 border-b border-border/20">
                    <h3 class="font-semibold text-th-success flex items-center gap-2">
                        <Play class="h-5 w-5" />
                        Active & Upcoming Events
                    </h3>
                </div>
                <div class="divide-y divide-border/20">
                    <div v-for="schedule in upcomingSchedules" :key="schedule.id"
                        class="p-4 hover:bg-foreground/2 transition cursor-pointer" @click="editSchedule(schedule)">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-3 h-3 rounded-full" :class="getStatusIndicator(schedule.status)"></div>
                                <div>
                                    <h4 class="font-medium text-foreground">{{ schedule.name }}</h4>
                                    <p class="text-sm text-foreground/60">{{ schedule.description }}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-sm font-medium text-th-primary">
                                    {{ getScheduleTimeInfo(schedule) }}
                                </div>
                                <div class="text-xs text-foreground/60">{{ schedule.type }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recurring Schedules -->
            <div class="elev-card">
                <div class="p-4 border-b border-border/20">
                    <h3 class="font-semibold text-th-primary flex items-center gap-2">
                        <Repeat class="h-5 w-5" />
                        Recurring Schedules
                    </h3>
                </div>
                <div class="divide-y divide-border/20">
                    <div v-for="schedule in recurringSchedules" :key="schedule.id"
                        class="p-4 hover:bg-foreground/2 transition cursor-pointer" @click="editSchedule(schedule)">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                                    :class="getEventTypeClass(schedule.type)">
                                    <component :is="getEventIcon(schedule.type)" class="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 class="font-medium text-foreground">{{ schedule.name }}</h4>
                                    <p class="text-sm text-foreground/60">{{ schedule.description }}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-sm font-medium">{{ schedule.recurrence }}</div>
                                <div class="text-xs text-foreground/60">{{ formatTime(schedule.time) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create/Edit Schedule Modal -->
        <div v-if="showCreateSchedule" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div
                class="bg-background rounded-xl shadow-2xl w-full max-w-lg border border-border/20 max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-semibold text-th-primary">
                            {{ editingSchedule ? 'Edit Schedule' : 'Create New Schedule' }}
                        </h3>
                        <button @click="closeScheduleModal" class="p-2 hover:bg-foreground/5 rounded-lg">
                            <X class="h-5 w-5" />
                        </button>
                    </div>

                    <form @submit.prevent="saveSchedule" class="space-y-5">
                        <div>
                            <label class="block text-sm font-semibold text-foreground/80 mb-2">Event Name</label>
                            <input v-model="scheduleForm.name" type="text" required placeholder="Enter event name"
                                class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-th-primary/30 focus:border-th-primary bg-background transition-all" />
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-foreground/80 mb-2">Event Type</label>
                            <select v-model="scheduleForm.type" required
                                class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-th-primary/30 focus:border-th-primary bg-background transition-all">
                                <option value="daily">Daily Reset</option>
                                <option value="weekly">Weekly Event</option>
                                <option value="special">Special Event</option>
                                <option value="seasonal">Seasonal</option>
                            </select>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-foreground/80 mb-2">Date</label>
                                <input v-model="scheduleForm.date" type="date" required
                                    class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-th-primary/30 focus:border-th-primary bg-background transition-all" />
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-foreground/80 mb-2">Time</label>
                                <input v-model="scheduleForm.time" type="time" required
                                    class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-th-primary/30 focus:border-th-primary bg-background transition-all" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-foreground/80 mb-2">Recurrence</label>
                            <select v-model="scheduleForm.recurrence"
                                class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-th-primary/30 focus:border-th-primary bg-background transition-all">
                                <option value="once">One-time Event</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-foreground/80 mb-2">Description</label>
                            <textarea v-model="scheduleForm.description" rows="3" placeholder="Event description..."
                                class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-th-primary/30 focus:border-th-primary bg-background transition-all resize-none"></textarea>
                        </div>

                        <div class="flex items-center gap-3">
                            <input type="checkbox" v-model="scheduleForm.sendNotifications" id="notifications"
                                class="w-4 h-4 text-th-primary bg-background border-border rounded focus:ring-th-primary/30">
                            <label for="notifications" class="text-sm font-medium text-foreground/80">
                                Send notifications
                            </label>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="button" @click="closeScheduleModal" class="btn-th-soft flex-1">
                                Cancel
                            </button>
                            <button type="submit" class="btn-th-primary flex-1">
                                {{ editingSchedule ? 'Update Schedule' : 'Create Schedule' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
    Calendar, Clock, Timer, CalendarDays, Repeat, Plus, Search, List,
    ChevronLeft, ChevronRight, X, Play, Target, Sword, Trophy, Zap
} from 'lucide-vue-next'

// Reactive state
const activeView = ref('calendar')
const currentWeek = ref(0)
const searchQuery = ref('')
const filterType = ref('')
const filterStatus = ref('')
const showCreateSchedule = ref(false)
const editingSchedule = ref(null)

// Form state
const scheduleForm = ref({
    name: '',
    type: 'daily',
    date: '',
    time: '00:00',
    recurrence: 'once',
    description: '',
    sendNotifications: true
})

// Sample schedules data
const schedules = ref([
    {
        id: 1,
        name: 'Daily Reset',
        type: 'daily',
        description: 'Daily quests and rewards reset',
        time: '00:00',
        recurrence: 'daily',
        status: 'active',
        nextOccurrence: new Date(new Date().setHours(24, 0, 0, 0))
    },
    {
        id: 2,
        name: 'Guild Boss Battle',
        type: 'weekly',
        description: 'Weekly guild boss challenge',
        time: '19:00',
        recurrence: 'weekly',
        status: 'active',
        nextOccurrence: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000)
    },
    {
        id: 3,
        name: 'Arena Tournament',
        type: 'special',
        description: 'Monthly arena championship',
        time: '20:00',
        recurrence: 'monthly',
        status: 'upcoming',
        nextOccurrence: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)
    },
    {
        id: 4,
        name: 'Hero Summon Event',
        type: 'special',
        description: 'Increased legendary hero drop rates',
        time: '12:00',
        recurrence: 'once',
        status: 'active',
        nextOccurrence: new Date(new Date().getTime() + 3 * 60 * 60 * 1000)
    }
])

// Update countdown timer
const currentTime = ref(new Date())
let timeInterval

// Computed properties
const activeSchedules = computed(() => schedules.value.filter(s => s.status === 'active'))
const upcomingSchedules = computed(() => schedules.value.filter(s => ['active', 'upcoming'].includes(s.status)))
const recurringSchedules = computed(() => schedules.value.filter(s => s.recurrence !== 'once'))

const nextEvent = computed(() => {
    const upcoming = schedules.value
        .filter(s => s.nextOccurrence > currentTime.value)
        .sort((a, b) => a.nextOccurrence - b.nextOccurrence)[0]
    return upcoming
})

const nextEventName = computed(() => nextEvent.value?.name || 'No events')
const nextEventCountdown = computed(() => {
    if (!nextEvent.value) return '—'

    const diff = nextEvent.value.nextOccurrence - currentTime.value
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
        const days = Math.floor(hours / 24)
        return `${days}d ${hours % 24}h`
    }
    return `${hours}h ${minutes}m`
})

const todaysEvents = computed(() => {
    const today = new Date().toDateString()
    return schedules.value.filter(s => s.nextOccurrence.toDateString() === today)
})

const weeklyEvents = computed(() => {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    return schedules.value.filter(s => s.nextOccurrence >= weekStart && s.nextOccurrence < weekEnd)
})

const weekDays = computed(() => {
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (currentWeek.value * 7))

    const days = []
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek)
        day.setDate(day.getDate() + i)
        days.push({
            name: day.toLocaleDateString('en', { weekday: 'short' }),
            date: day.getDate(),
            fullDate: day
        })
    }
    return days
})

// Helper functions
const isToday = (date) => {
    return date.toDateString() === new Date().toDateString()
}

const getEventsForDay = (date) => {
    return schedules.value.filter(s => s.nextOccurrence.toDateString() === date.toDateString())
}

const getEventTypeClass = (type) => {
    const classes = {
        daily: 'bg-th-success',
        weekly: 'bg-th-primary',
        special: 'bg-th-secondary',
        seasonal: 'bg-th-warning'
    }
    return classes[type] || 'bg-th-primary'
}

const getEventIcon = (type) => {
    const icons = {
        daily: Clock,
        weekly: Repeat,
        special: Trophy,
        seasonal: Zap
    }
    return icons[type] || Target
}

const getStatusIndicator = (status) => {
    const classes = {
        active: 'bg-th-success animate-pulse',
        upcoming: 'bg-th-warning',
        expired: 'bg-foreground/30'
    }
    return classes[status] || 'bg-foreground/30'
}

const getScheduleTimeInfo = (schedule) => {
    if (schedule.status === 'active') {
        const diff = schedule.nextOccurrence - currentTime.value
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        if (diff < 0) return 'Now active'
        if (hours < 1) return `${minutes}m remaining`
        return `${hours}h ${minutes}m remaining`
    }

    return schedule.nextOccurrence.toLocaleDateString('en', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatTime = (time) => {
    return time || '00:00'
}

const goToCurrentWeek = () => {
    currentWeek.value = 0
}

const editSchedule = (schedule) => {
    editingSchedule.value = schedule
    scheduleForm.value = {
        name: schedule.name,
        type: schedule.type,
        date: schedule.nextOccurrence.toISOString().split('T')[0],
        time: schedule.time,
        recurrence: schedule.recurrence,
        description: schedule.description,
        sendNotifications: true
    }
    showCreateSchedule.value = true
}

const closeScheduleModal = () => {
    showCreateSchedule.value = false
    editingSchedule.value = null
    scheduleForm.value = {
        name: '',
        type: 'daily',
        date: '',
        time: '00:00',
        recurrence: 'once',
        description: '',
        sendNotifications: true
    }
}

const saveSchedule = () => {
    const scheduleData = {
        id: editingSchedule.value?.id || Date.now(),
        ...scheduleForm.value,
        status: 'upcoming',
        nextOccurrence: new Date(`${scheduleForm.value.date}T${scheduleForm.value.time}`)
    }

    if (editingSchedule.value) {
        const index = schedules.value.findIndex(s => s.id === editingSchedule.value.id)
        if (index > -1) {
            schedules.value[index] = scheduleData
        }
    } else {
        schedules.value.push(scheduleData)
    }

    closeScheduleModal()
}

const updateTime = () => {
    currentTime.value = new Date()
}

onMounted(() => {
    // Set default date to today
    scheduleForm.value.date = new Date().toISOString().split('T')[0]

    // Update timer every minute
    timeInterval = setInterval(updateTime, 60000)
})

onUnmounted(() => {
    if (timeInterval) {
        clearInterval(timeInterval)
    }
})
</script>