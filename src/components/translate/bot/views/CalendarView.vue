<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-3xl font-bold text-white mb-2">Scheduled Messages</h2>
                <p class="text-zinc-400">Schedule one-off or recurring messages and pings</p>
            </div>
            <button @click="openCreateModal"
                class="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl text-white font-medium transition-all">
                <Plus class="h-4 w-4" />
                New Schedule
            </button>
        </div>

        <!-- View Toggle & Filters -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 p-1 bg-zinc-800/50 border border-zinc-700/50 rounded-xl">
                <button @click="currentView = 'list'" :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    currentView === 'list' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
                ]">
                    <List class="h-4 w-4 inline mr-2" />
                    List
                </button>
                <button @click="currentView = 'calendar'" :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    currentView === 'calendar' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
                ]">
                    <CalendarIcon class="h-4 w-4 inline mr-2" />
                    Calendar
                </button>
            </div>

            <div class="flex items-center gap-3">
                <select v-model="filterType"
                    class="px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white text-sm">
                    <option value="">All Types</option>
                    <option value="once">One-off</option>
                    <option value="recurring">Recurring</option>
                </select>
                <button @click="loadScheduledMessages" :disabled="loading"
                    class="p-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg text-zinc-400 hover:text-white transition-all">
                    <RefreshCw :class="['h-4 w-4', loading ? 'animate-spin' : '']" />
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-24">
            <Loader2 class="h-12 w-12 text-violet-400 animate-spin" />
        </div>

        <!-- List View -->
        <div v-else-if="currentView === 'list'" class="space-y-4">
            <!-- Upcoming Section -->
            <div v-if="upcomingMessages.length > 0">
                <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Clock class="h-5 w-5 text-violet-400" />
                    Upcoming
                </h3>
                <div class="space-y-3">
                    <ScheduleCard v-for="msg in upcomingMessages" :key="msg.id" :schedule="msg"
                        :channels="channelMap" @edit="openEditModal(msg)" @delete="confirmDelete(msg)"
                        @toggle-pause="togglePause(msg)" />
                </div>
            </div>

            <!-- Recurring Section -->
            <div v-if="recurringMessages.length > 0">
                <h3 class="text-lg font-semibold text-white mb-3 mt-6 flex items-center gap-2">
                    <Repeat class="h-5 w-5 text-fuchsia-400" />
                    Recurring
                </h3>
                <div class="space-y-3">
                    <ScheduleCard v-for="msg in recurringMessages" :key="msg.id" :schedule="msg"
                        :channels="channelMap" @edit="openEditModal(msg)" @delete="confirmDelete(msg)"
                        @toggle-pause="togglePause(msg)" />
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredMessages.length === 0" class="text-center py-24">
                <div class="inline-flex p-6 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl mb-6">
                    <CalendarIcon class="h-16 w-16 text-zinc-600" />
                </div>
                <h3 class="text-xl font-bold text-white mb-3">No Scheduled Messages</h3>
                <p class="text-zinc-500 mb-6">Create your first scheduled message or recurring ping</p>
                <button @click="openCreateModal"
                    class="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl text-white font-medium transition-all">
                    <Plus class="h-4 w-4 inline mr-2" />
                    Create Schedule
                </button>
            </div>
        </div>

        <!-- Calendar View -->
        <div v-else-if="currentView === 'calendar'" class="bg-zinc-800/30 border border-zinc-700/50 rounded-2xl p-6">
            <!-- Calendar Header -->
            <div class="flex items-center justify-between mb-6">
                <button @click="previousMonth"
                    class="p-2 hover:bg-zinc-700/50 rounded-lg text-zinc-400 hover:text-white transition-all">
                    <ChevronLeft class="h-5 w-5" />
                </button>
                <h3 class="text-xl font-bold text-white">
                    {{ calendarMonthYear }}
                </h3>
                <button @click="nextMonth"
                    class="p-2 hover:bg-zinc-700/50 rounded-lg text-zinc-400 hover:text-white transition-all">
                    <ChevronRight class="h-5 w-5" />
                </button>
            </div>

            <!-- Calendar Grid -->
            <div class="grid grid-cols-7 gap-1">
                <!-- Day Headers -->
                <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day"
                    class="text-center text-sm font-medium text-zinc-500 py-2">
                    {{ day }}
                </div>

                <!-- Calendar Days -->
                <div v-for="(day, index) in calendarDays" :key="index" :class="[
                    'min-h-[80px] p-1 border border-zinc-700/30 rounded-lg',
                    day.isCurrentMonth ? 'bg-zinc-800/30' : 'bg-zinc-900/30',
                    day.isToday ? 'ring-2 ring-violet-500/50' : ''
                ]">
                    <div class="text-right mb-1">
                        <span :class="[
                            'text-sm',
                            day.isCurrentMonth ? 'text-zinc-300' : 'text-zinc-600',
                            day.isToday ? 'bg-violet-600 text-white px-1.5 py-0.5 rounded' : ''
                        ]">
                            {{ day.date }}
                        </span>
                    </div>
                    <div class="space-y-1">
                        <div v-for="event in day.events.slice(0, 2)" :key="event.id" @click="openEditModal(event)"
                            class="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                            :class="event.schedule_type === 'recurring' ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'bg-violet-500/20 text-violet-300'">
                            {{ event.title || 'Scheduled' }}
                        </div>
                        <div v-if="day.events.length > 2" class="text-xs text-zinc-500 text-center">
                            +{{ day.events.length - 2 }} more
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <Teleport to="body">
            <div v-if="showModal"
                class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div
                    class="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <!-- Modal Header -->
                    <div class="p-6 border-b border-zinc-800 flex items-center justify-between">
                        <h3 class="text-xl font-bold text-white">
                            {{ editingSchedule ? 'Edit Schedule' : 'New Scheduled Message' }}
                        </h3>
                        <button @click="closeModal"
                            class="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all">
                            <X class="h-5 w-5" />
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="p-6 overflow-y-auto flex-1 space-y-6">
                        <!-- Title -->
                        <div>
                            <label class="block text-sm font-medium text-zinc-400 mb-2">Title (optional)</label>
                            <input v-model="formData.title" type="text" placeholder="e.g., Weekly Raid Reminder"
                                class="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                        </div>

                        <!-- Channel -->
                        <div>
                            <label class="block text-sm font-medium text-zinc-400 mb-2">Channel *</label>
                            <select v-model="formData.channelId"
                                class="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                                <option :value="null">Select channel...</option>
                                <option v-for="channel in availableChannels" :key="channel.id" :value="channel.id">
                                    # {{ channel.name }}
                                </option>
                            </select>
                        </div>

                        <!-- Message Content -->
                        <div>
                            <label class="block text-sm font-medium text-zinc-400 mb-2">Message *</label>
                            <MessageComposer 
                                v-model="formData.messageContent"
                                :roles="availableRoles"
                                :emotes="availableEmotes"
                                :timezone="formData.timezone"
                                placeholder="Type your message... Use @ for mentions and : for emotes"
                            />
                            <p class="mt-2 text-xs text-zinc-500">
                                Type <code class="bg-zinc-800 px-1 rounded">@</code> to mention roles, @everyone, @here, or add timestamps
                            </p>
                        </div>

                        <!-- Schedule Type -->
                        <div>
                            <label class="block text-sm font-medium text-zinc-400 mb-2">Schedule Type *</label>
                            <div class="grid grid-cols-2 gap-3">
                                <label :class="[
                                    'flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all',
                                    formData.scheduleType === 'once'
                                        ? 'bg-violet-500/10 border-violet-500/50'
                                        : 'bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50'
                                ]">
                                    <input type="radio" v-model="formData.scheduleType" value="once" class="hidden" />
                                    <CalendarIcon class="h-5 w-5 text-violet-400" />
                                    <div>
                                        <p class="text-white font-medium">One-time</p>
                                        <p class="text-xs text-zinc-500">Send once at specific time</p>
                                    </div>
                                </label>
                                <label :class="[
                                    'flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all',
                                    formData.scheduleType === 'recurring'
                                        ? 'bg-fuchsia-500/10 border-fuchsia-500/50'
                                        : 'bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50'
                                ]">
                                    <input type="radio" v-model="formData.scheduleType" value="recurring"
                                        class="hidden" />
                                    <Repeat class="h-5 w-5 text-fuchsia-400" />
                                    <div>
                                        <p class="text-white font-medium">Recurring</p>
                                        <p class="text-xs text-zinc-500">Repeat on schedule</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- One-time Schedule -->
                        <div v-if="formData.scheduleType === 'once'" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-zinc-400 mb-2">Date *</label>
                                    <input v-model="formData.scheduledDate" type="date"
                                        class="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-zinc-400 mb-2">Time *</label>
                                    <input v-model="formData.scheduledTime" type="time"
                                        class="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-zinc-400 mb-2">Timezone</label>
                                <select v-model="formData.timezone"
                                    class="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                                    <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                                        {{ tz.label }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- Recurring Schedule -->
                        <div v-if="formData.scheduleType === 'recurring'" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-zinc-400 mb-2">Repeat *</label>
                                <select v-model="formData.recurrenceRule"
                                    class="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="biweekly">Every 2 Weeks</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>

                            <!-- Day selection for weekly/biweekly -->
                            <div v-if="['weekly', 'biweekly'].includes(formData.recurrenceRule)">
                                <label class="block text-sm font-medium text-zinc-400 mb-2">Day of Week *</label>
                                <div class="flex gap-2">
                                    <button v-for="(day, index) in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="index"
                                        @click="formData.recurrenceDay = index" :class="[
                                            'w-10 h-10 rounded-lg font-medium transition-all',
                                            formData.recurrenceDay === index
                                                ? 'bg-fuchsia-600 text-white'
                                                : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50'
                                        ]">
                                        {{ day }}
                                    </button>
                                </div>
                            </div>

                            <!-- Day selection for monthly -->
                            <div v-if="formData.recurrenceRule === 'monthly'">
                                <label class="block text-sm font-medium text-zinc-400 mb-2">Day of Month *</label>
                                <select v-model="formData.recurrenceDay"
                                    class="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                                    <option v-for="d in 31" :key="d" :value="d">{{ d }}</option>
                                </select>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-zinc-400 mb-2">Time *</label>
                                    <input v-model="formData.recurrenceTime" type="time"
                                        class="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-zinc-400 mb-2">Timezone</label>
                                    <select v-model="formData.timezone"
                                        class="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                                        <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                                            {{ tz.label }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-zinc-400 mb-2">End Date (optional)</label>
                                <input v-model="formData.recurrenceEndDate" type="date"
                                    class="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
                                <p class="mt-1 text-xs text-zinc-500">Leave empty to repeat indefinitely</p>
                            </div>
                        </div>

                        <!-- Send As -->
                        <div>
                            <label class="block text-sm font-medium text-zinc-400 mb-2">Send As</label>
                            <div class="grid grid-cols-2 gap-3">
                                <label :class="[
                                    'flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all',
                                    formData.sendAs === 'bot'
                                        ? 'bg-violet-500/10 border-violet-500/50'
                                        : 'bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50'
                                ]">
                                    <input type="radio" v-model="formData.sendAs" value="bot" class="hidden" />
                                    <Bot class="h-5 w-5 text-violet-400" />
                                    <div>
                                        <p class="text-white font-medium">Bot</p>
                                        <p class="text-xs text-zinc-500">Send as MXN Translate</p>
                                    </div>
                                </label>
                                <label :class="[
                                    'flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all',
                                    formData.sendAs === 'webhook'
                                        ? 'bg-fuchsia-500/10 border-fuchsia-500/50'
                                        : 'bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50'
                                ]">
                                    <input type="radio" v-model="formData.sendAs" value="webhook" class="hidden" />
                                    <User class="h-5 w-5 text-fuchsia-400" />
                                    <div>
                                        <p class="text-white font-medium">As Me</p>
                                        <p class="text-xs text-zinc-500">Send as your username</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Footer -->
                    <div class="p-6 border-t border-zinc-800 flex items-center justify-end gap-3">
                        <button @click="closeModal" class="px-4 py-2 text-zinc-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button @click="saveSchedule" :disabled="!canSave || saving" :class="[
                            'flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all',
                            canSave && !saving
                                ? 'bg-violet-600 hover:bg-violet-700 text-white'
                                : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                        ]">
                            <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                            <Save v-else class="h-4 w-4" />
                            {{ saving ? 'Saving...' : (editingSchedule ? 'Update' : 'Create') }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Delete Confirmation Modal -->
        <Teleport to="body">
            <div v-if="showDeleteModal"
                class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div class="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full">
                    <h3 class="text-xl font-bold text-white mb-2">Delete Schedule?</h3>
                    <p class="text-zinc-400 mb-6">
                        This will permanently delete "{{ deletingSchedule?.title || 'this scheduled message' }}".
                        This action cannot be undone.
                    </p>
                    <div class="flex items-center gap-3 justify-end">
                        <button @click="showDeleteModal = false"
                            class="px-4 py-2 text-zinc-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button @click="deleteSchedule" :disabled="deleting"
                            class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-all disabled:opacity-50 flex items-center gap-2">
                            <Loader2 v-if="deleting" class="h-4 w-4 animate-spin" />
                            <span>{{ deleting ? 'Deleting...' : 'Delete' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useTranslateStore } from '@/stores/useTranslateBotStore'
import ScheduleCard from '../ScheduleCard.vue'
import MessageComposer from '../MessageComposer.vue'
import {
    Plus,
    List,
    Calendar as CalendarIcon,
    RefreshCw,
    Loader2,
    Clock,
    Repeat,
    ChevronLeft,
    ChevronRight,
    X,
    Save,
    Bot,
    User
} from 'lucide-vue-next'

const props = defineProps({
    serverId: String
})

const store = useTranslateStore()

// State
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const currentView = ref('list')
const filterType = ref('')
const scheduledMessages = ref([])
const availableChannels = ref([])
const availableRoles = ref([])
const availableEmotes = ref([])
const channelMap = ref({})

// Modal state
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingSchedule = ref(null)
const deletingSchedule = ref(null)

// Calendar state
const calendarDate = ref(new Date())

// Form data
const defaultFormData = {
    title: '',
    channelId: null,
    messageContent: '',
    scheduleType: 'once',
    scheduledDate: '',
    scheduledTime: '',
    timezone: 'Australia/Brisbane',
    recurrenceRule: 'weekly',
    recurrenceDay: 2, // Tuesday
    recurrenceTime: '19:00',
    recurrenceEndDate: '',
    sendAs: 'bot'
}

const formData = ref({ ...defaultFormData })

const timezones = [
    { value: 'Pacific/Auckland', label: 'Auckland (NZDT)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
    { value: 'Australia/Brisbane', label: 'Brisbane (AEST)' },
    { value: 'Australia/Adelaide', label: 'Adelaide (ACDT)' },
    { value: 'Australia/Perth', label: 'Perth (AWST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { value: 'America/New_York', label: 'New York (EST/EDT)' },
    { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
    { value: 'America/Denver', label: 'Denver (MST/MDT)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
    { value: 'UTC', label: 'UTC' },
]

// Computed
const filteredMessages = computed(() => {
    let msgs = scheduledMessages.value
    if (filterType.value) {
        msgs = msgs.filter(m => m.schedule_type === filterType.value)
    }
    return msgs
})

const upcomingMessages = computed(() => {
    return filteredMessages.value
        .filter(m => m.schedule_type === 'once')
        .sort((a, b) => new Date(a.next_run_at) - new Date(b.next_run_at))
})

const recurringMessages = computed(() => {
    return filteredMessages.value
        .filter(m => m.schedule_type === 'recurring')
        .sort((a, b) => new Date(a.next_run_at) - new Date(b.next_run_at))
})

const canSave = computed(() => {
    if (!formData.value.channelId || !formData.value.messageContent) return false

    if (formData.value.scheduleType === 'once') {
        return formData.value.scheduledDate && formData.value.scheduledTime
    } else {
        return formData.value.recurrenceTime
    }
})

const calendarMonthYear = computed(() => {
    return calendarDate.value.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
    const year = calendarDate.value.getFullYear()
    const month = calendarDate.value.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay()
    const totalDays = lastDay.getDate()

    const days = []
    const today = new Date()

    // Add padding days from previous month
    const prevMonth = new Date(year, month, 0)
    for (let i = startPadding - 1; i >= 0; i--) {
        days.push({
            date: prevMonth.getDate() - i,
            isCurrentMonth: false,
            isToday: false,
            events: []
        })
    }

    // Add current month days
    for (let d = 1; d <= totalDays; d++) {
        const date = new Date(year, month, d)
        const isToday = date.toDateString() === today.toDateString()

        // Find events for this day
        const dayEvents = scheduledMessages.value.filter(msg => {
            const nextRun = new Date(msg.next_run_at)
            return nextRun.toDateString() === date.toDateString()
        })

        days.push({
            date: d,
            isCurrentMonth: true,
            isToday,
            events: dayEvents
        })
    }

    // Add padding days for next month
    const remaining = 42 - days.length // 6 rows × 7 days
    for (let i = 1; i <= remaining; i++) {
        days.push({
            date: i,
            isCurrentMonth: false,
            isToday: false,
            events: []
        })
    }

    return days
})

// Methods
async function loadScheduledMessages() {
    if (!props.serverId) return

    loading.value = true
    try {
        // Load scheduled messages
        const result = await store.fetchScheduledMessages(props.serverId)
        scheduledMessages.value = result.messages || []

        // Load channels
        const channels = await store.fetchServerChannels(props.serverId)
        availableChannels.value = channels.filter(ch => ch.type === 0 || ch.type === 5)
        channelMap.value = Object.fromEntries(channels.map(ch => [ch.id, ch.name]))

        // Load roles
        try {
            const roles = await store.fetchServerRoles(props.serverId)
            availableRoles.value = roles.filter(r => r.name !== '@everyone' && !r.managed)
        } catch (e) {
            availableRoles.value = []
        }

        // Load emotes
        try {
            const emotes = await store.fetchServerEmotes(props.serverId)
            availableEmotes.value = emotes
        } catch (e) {
            availableEmotes.value = []
        }
    } catch (error) {
        console.error('Failed to load scheduled messages:', error)
        scheduledMessages.value = []
    } finally {
        loading.value = false
    }
}

function openCreateModal() {
    editingSchedule.value = null
    formData.value = { ...defaultFormData }

    // Set default date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    formData.value.scheduledDate = tomorrow.toISOString().split('T')[0]

    showModal.value = true
}

// Helper: Convert UTC datetime to local timezone
function utcToLocal(utcDateString, timezone) {
    if (!utcDateString) return { date: '', time: '' }
    
    try {
        // Parse as UTC
        const utcDate = new Date(utcDateString)
        
        // Format in the target timezone
        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
        
        const parts = formatter.formatToParts(utcDate)
        const getPart = (type) => parts.find(p => p.type === type)?.value || ''
        
        const date = `${getPart('year')}-${getPart('month')}-${getPart('day')}`
        const time = `${getPart('hour')}:${getPart('minute')}`
        
        return { date, time }
    } catch (e) {
        console.error('Timezone conversion error:', e)
        return { 
            date: utcDateString.split('T')[0] || '', 
            time: utcDateString.split('T')[1]?.substring(0, 5) || '' 
        }
    }
}

function openEditModal(schedule) {
    editingSchedule.value = schedule
    
    // Get the timezone first so we can convert times correctly
    const tz = schedule.recurrence_timezone || 'Australia/Brisbane'
    
    // Convert UTC scheduled_at back to local timezone for display
    const localScheduled = utcToLocal(schedule.scheduled_at, tz)
    const localEndDate = utcToLocal(schedule.recurrence_end_at, tz)
    
    formData.value = {
        title: schedule.title || '',
        channelId: schedule.channel_id,
        messageContent: schedule.message_content,
        scheduleType: schedule.schedule_type,
        scheduledDate: localScheduled.date,
        scheduledTime: localScheduled.time,
        timezone: tz,
        recurrenceRule: schedule.recurrence_rule || 'weekly',
        recurrenceDay: schedule.recurrence_day ?? 2,
        recurrenceTime: schedule.recurrence_time || '19:00',
        recurrenceEndDate: localEndDate.date,
        sendAs: schedule.send_as || 'bot'
    }
    showModal.value = true
}

function closeModal() {
    showModal.value = false
    editingSchedule.value = null
}

async function saveSchedule() {
    if (!canSave.value) return

    saving.value = true
    try {
        const payload = {
            title: formData.value.title || null,
            channelId: formData.value.channelId,
            messageContent: formData.value.messageContent,
            scheduleType: formData.value.scheduleType,
            sendAs: formData.value.sendAs,
            timezone: formData.value.timezone
        }

        if (formData.value.scheduleType === 'once') {
            payload.scheduledAt = `${formData.value.scheduledDate}T${formData.value.scheduledTime}`
        } else {
            payload.recurrenceRule = formData.value.recurrenceRule
            payload.recurrenceDay = formData.value.recurrenceDay
            payload.recurrenceTime = formData.value.recurrenceTime
            payload.recurrenceEndAt = formData.value.recurrenceEndDate || null
        }

        if (editingSchedule.value) {
            await store.updateScheduledMessage(props.serverId, editingSchedule.value.id, payload)
        } else {
            await store.createScheduledMessage(props.serverId, payload)
        }

        closeModal()
        await loadScheduledMessages()
    } catch (error) {
        console.error('Failed to save schedule:', error)
        alert('Failed to save schedule: ' + error.message)
    } finally {
        saving.value = false
    }
}

function confirmDelete(schedule) {
    deletingSchedule.value = schedule
    showDeleteModal.value = true
}

async function deleteSchedule() {
    if (!deletingSchedule.value) return

    deleting.value = true
    try {
        await store.deleteScheduledMessage(props.serverId, deletingSchedule.value.id)
        scheduledMessages.value = scheduledMessages.value.filter(m => m.id !== deletingSchedule.value.id)
        showDeleteModal.value = false
        deletingSchedule.value = null
    } catch (error) {
        console.error('Failed to delete schedule:', error)
        alert('Failed to delete schedule. Please try again.')
    } finally {
        deleting.value = false
    }
}

async function togglePause(schedule) {
    try {
        const newPaused = !schedule.is_paused
        await store.updateScheduledMessage(props.serverId, schedule.id, { isPaused: newPaused })
        schedule.is_paused = newPaused ? 1 : 0
    } catch (error) {
        console.error('Failed to toggle pause:', error)
    }
}

function previousMonth() {
    calendarDate.value = new Date(calendarDate.value.getFullYear(), calendarDate.value.getMonth() - 1, 1)
}

function nextMonth() {
    calendarDate.value = new Date(calendarDate.value.getFullYear(), calendarDate.value.getMonth() + 1, 1)
}

// Auto-refresh interval
let refreshInterval = null

watch(() => props.serverId, () => {
    loadScheduledMessages()
})

onMounted(() => {
    loadScheduledMessages()
    
    // Auto-refresh every 10 seconds
    refreshInterval = setInterval(() => {
        // Silent refresh - don't show loading state
        if (props.serverId && !showModal.value && !showDeleteModal.value) {
            store.fetchScheduledMessages(props.serverId).then(result => {
                scheduledMessages.value = result.messages || []
            }).catch(() => {
                // Silently fail on background refresh
            })
        }
    }, 10000)
})

onUnmounted(() => {
    if (refreshInterval) {
        clearInterval(refreshInterval)
        refreshInterval = null
    }
})
</script>