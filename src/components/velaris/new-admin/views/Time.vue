<!-- Time.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-semibold text-velaris-purple">Time Management</h1>
            <p class="text-sm text-foreground/70 mt-1">Generate Discord timestamps and coordinate across timezones</p>
        </div>

        <!-- Discord Timestamp Generator -->
        <section class="mb-8">
            <div class="elev-card">
                <!-- Collapsible Header -->
                <div class="mb-4">
                    <button @click="toggleDiscordSection"
                        class="w-full flex items-center justify-between px-4 py-3 sm:px-6 rounded-lg hover:bg-foreground/5 transition-colors">
                        <div class="flex items-center gap-2">
                            <MessageSquare class="h-5 w-5 text-velaris-purple" />
                            <h3 class="font-semibold text-velaris-purple">Discord Timestamp Generator</h3>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs text-foreground/60 hidden sm:inline">Generate localized
                                timestamps</span>
                            <ChevronDown class="h-4 w-4 text-foreground/60 transition-transform"
                                :class="{ 'rotate-180': isDiscordExpanded }" />
                        </div>
                    </button>
                </div>

                <!-- Expanded View -->
                <div v-if="isDiscordExpanded" class="grid gap-6 xl:grid-cols-2">
                    <!-- Input Section -->
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-foreground/80 mb-2">
                                Date & Time
                            </label>
                            <input type="datetime-local" v-model="discordTimestamp.datetime"
                                class="w-full px-3 py-2 bg-background border border-border/60 rounded-lg text-sm focus:outline-none focus:border-velaris-purple/50 transition-colors" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-foreground/80 mb-2">
                                Timezone
                            </label>
                            <div class="flex items-center gap-2">
                                <MapPin class="h-4 w-4 text-velaris-teal flex-shrink-0" />
                                <select v-model="discordTimestamp.timezone"
                                    class="flex-1 px-3 py-2 bg-background border border-border/60 rounded-lg text-sm focus:outline-none focus:border-velaris-purple/50 transition-colors">
                                    <option value="local">Local ({{ userTimezone }})</option>
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">Eastern Time (ET)</option>
                                    <option value="America/Chicago">Central Time (CT)</option>
                                    <option value="America/Denver">Mountain Time (MT)</option>
                                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                    <option value="Europe/London">London (GMT/BST)</option>
                                    <option value="Europe/Berlin">Central Europe (CET)</option>
                                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                                    <option value="Australia/Sydney">Sydney (AEDT)</option>
                                    <option value="Australia/Brisbane">Brisbane (AEST)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-foreground/80 mb-2">
                                Unix Timestamp
                            </label>
                            <div class="flex items-center gap-2">
                                <input type="text" :value="unixTimestamp" readonly
                                    class="flex-1 px-3 py-2 bg-background/50 border border-border/60 rounded-lg text-sm font-mono" />
                                <button @click="copyToClipboard(unixTimestamp)"
                                    class="p-2 hover:bg-foreground/5 rounded-lg transition-colors flex-shrink-0">
                                    <Copy class="h-4 w-4 text-velaris-teal" />
                                </button>
                            </div>
                        </div>

                        <!-- Info box for expanded view -->
                        <div class="xl:hidden mt-4 p-3 bg-velaris-teal/10 border border-velaris-teal/30 rounded-lg">
                            <div class="flex items-start gap-2">
                                <Info class="h-4 w-4 text-velaris-teal mt-0.5 flex-shrink-0" />
                                <div class="text-xs text-foreground/70">
                                    Timestamps auto-display in each user's local timezone
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Preview Section -->
                    <div class="space-y-3">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-sm font-medium text-foreground/80">Format Previews</span>
                            <span class="text-xs text-velaris-green">Tap to copy</span>
                        </div>

                        <div class="grid gap-2 sm:gap-3">
                            <div v-for="format in timestampFormats" :key="format.type"
                                @click="copyTimestamp(format.code)"
                                class="group cursor-pointer p-2.5 sm:p-3 bg-background/50 border border-border/60 rounded-lg hover:border-velaris-purple/50 transition-all active:scale-95">
                                <div class="flex items-center justify-between mb-1 gap-2">
                                    <span class="text-xs font-medium text-velaris-purple">{{ format.name }}</span>
                                    <code
                                        class="text-xs text-foreground/50 font-mono truncate max-w-[120px] sm:max-w-none">{{ format.code }}</code>
                                </div>
                                <div class="flex items-center justify-between gap-2">
                                    <span class="text-sm text-foreground truncate">{{ format.preview }}</span>
                                    <Copy
                                        class="h-3 w-3 text-foreground/30 group-hover:text-velaris-teal transition-colors flex-shrink-0" />
                                </div>
                            </div>
                        </div>

                        <!-- Desktop-only info box -->
                        <div
                            class="hidden xl:block mt-4 p-3 bg-velaris-teal/10 border border-velaris-teal/30 rounded-lg">
                            <div class="flex items-start gap-2">
                                <Info class="h-4 w-4 text-velaris-teal mt-0.5 flex-shrink-0" />
                                <div class="text-xs text-foreground/70">
                                    These timestamps will automatically display in each user's local timezone when
                                    posted in Discord
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Collapsed View -->
                <div v-else class="space-y-4">
                    <!-- Quick Input -->
                    <div class="space-y-2">
                        <input type="datetime-local" v-model="discordTimestamp.datetime"
                            class="w-full px-3 py-2 bg-background border border-border/60 rounded-lg text-sm focus:outline-none focus:border-velaris-purple/50 transition-colors" />
                        <div class="flex items-center gap-2">
                            <MapPin class="h-4 w-4 text-velaris-teal flex-shrink-0" />
                            <select v-model="discordTimestamp.timezone"
                                class="flex-1 px-3 py-2 bg-background border border-border/60 rounded-lg text-sm focus:outline-none focus:border-velaris-purple/50 transition-colors">
                                <option value="local">Local</option>
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">ET</option>
                                <option value="America/Los_Angeles">PT</option>
                                <option value="Europe/London">GMT</option>
                                <option value="Asia/Tokyo">JST</option>
                                <option value="Australia/Brisbane">AEST</option>
                            </select>
                        </div>
                    </div>

                    <!-- Quick Preview - Just Relative and Short Time -->
                    <div class="grid gap-2">
                        <div @click="copyTimestamp(timestampFormats[0].code)"
                            class="group cursor-pointer p-3 bg-velaris-purple/10 border border-velaris-purple/30 rounded-lg hover:border-velaris-purple/50 transition-all active:scale-95">
                            <div class="flex items-center justify-between">
                                <div class="flex flex-col">
                                    <span class="text-xs font-medium text-velaris-purple">Relative Time</span>
                                    <span class="text-sm text-foreground">{{ timestampFormats[0].preview }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <code
                                        class="text-xs text-foreground/50 font-mono">{{ timestampFormats[0].code }}</code>
                                    <Copy
                                        class="h-3 w-3 text-foreground/30 group-hover:text-velaris-teal transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div @click="copyTimestamp(timestampFormats[1].code)"
                            class="group cursor-pointer p-3 bg-background/50 border border-border/60 rounded-lg hover:border-velaris-purple/50 transition-all active:scale-95">
                            <div class="flex items-center justify-between">
                                <div class="flex flex-col">
                                    <span class="text-xs font-medium text-velaris-purple">{{ timestampFormats[1].name
                                        }}</span>
                                    <span class="text-sm text-foreground">{{ timestampFormats[1].preview }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <code
                                        class="text-xs text-foreground/50 font-mono">{{ timestampFormats[1].code }}</code>
                                    <Copy
                                        class="h-3 w-3 text-foreground/30 group-hover:text-velaris-teal transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Expand hint -->
                    <div class="text-center">
                        <span class="text-xs text-foreground/50">{{ timestampFormats.length - 2 }} more formats
                            available</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Timezone Timeline -->
        <section class="w-full min-w-0">
            <div class="elev-card min-w-0">
                <div class="mb-4">
                    <div class="flex flex-col gap-3">
                        <!-- Title Row -->
                        <div class="flex items-center justify-between">
                            <h3 class="font-semibold text-velaris-purple flex items-center gap-2">
                                <Globe class="h-5 w-5" />
                                <span class="hidden sm:inline">Timezone Timeline Coordinator</span>
                                <span class="sm:hidden">Timeline</span>
                            </h3>
                        </div>

                        <!-- Controls Row -->
                        <div class="flex flex-col sm:flex-row gap-3">
                            <!-- Date Controls -->
                            <div class="flex items-center gap-2 flex-1">
                                <Calendar class="h-4 w-4 text-velaris-teal flex-shrink-0" />
                                <div class="flex items-center gap-1 flex-1">
                                    <button @click="previousDay"
                                        class="p-2 hover:bg-foreground/5 rounded-lg transition-colors">
                                        <ChevronLeft class="h-4 w-4" />
                                    </button>
                                    <input type="date" v-model="timelineDate"
                                        class="flex-1 px-2 py-1.5 bg-background border border-border/60 rounded-lg text-sm focus:outline-none focus:border-velaris-purple/50 min-w-0" />
                                    <button @click="nextDay"
                                        class="p-2 hover:bg-foreground/5 rounded-lg transition-colors">
                                        <ChevronRight class="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex gap-2">
                                <button @click="addTimezone"
                                    class="flex items-center gap-2 px-3 py-2 bg-velaris-purple/10 border border-velaris-purple/30 rounded-lg text-sm text-velaris-purple hover:bg-velaris-purple/20 transition-colors">
                                    <Plus class="h-4 w-4" />
                                    <span>Add</span>
                                </button>
                                <button @click="clearSelection"
                                    class="flex items-center gap-2 px-3 py-2 bg-background border border-border/60 rounded-lg text-sm hover:bg-foreground/5 transition-colors">
                                    <X class="h-4 w-4" />
                                    <span class="hidden sm:inline">Clear</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Current Date Display -->
                <div class="mb-4 text-center">
                    <span
                        class="inline-flex items-center px-3 py-1 bg-velaris-teal/10 border border-velaris-teal/30 rounded-full text-sm font-medium text-velaris-teal">
                        {{ formattedDate }}
                    </span>
                </div>

                <!-- Timelines Container -->
                <div class="w-full min-w-0">
                    <div class="space-y-3">
                        <div v-for="(timeline, index) in timelines" :key="timeline.id"
                            class="border border-border/60 rounded-lg hover:border-velaris-purple/30 transition-colors w-full min-w-0">

                            <!-- Timeline Header -->
                            <div class="p-3 pb-2 border-b border-border/30">
                                <div class="flex items-center justify-between min-w-0">
                                    <div class="flex items-center gap-2 min-w-0 flex-1">
                                        <MapPin class="h-4 w-4 text-velaris-teal flex-shrink-0" />
                                        <select v-model="timeline.timezone"
                                            class="flex-1 px-2 py-1 bg-background border border-border/60 rounded text-sm focus:outline-none focus:border-velaris-purple/50 min-w-0">
                                            <option value="UTC">UTC</option>
                                            <option value="America/New_York">New York (EST/EDT)</option>
                                            <option value="America/Los_Angeles">Los Angeles (PST/PDT)</option>
                                            <option value="Europe/London">London (GMT/BST)</option>
                                            <option value="Europe/Berlin">Berlin (CET/CEST)</option>
                                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                                            <option value="Asia/Shanghai">Shanghai (CST)</option>
                                            <option value="Australia/Sydney">Sydney (AEDT/AEST)</option>
                                            <option value="Australia/Brisbane">Brisbane (AEST)</option>
                                        </select>
                                        <span class="text-xs text-foreground/60 hidden sm:inline">{{
                                            timeline.currentTime }}</span>
                                    </div>
                                    <button @click="removeTimezone(index)"
                                        class="p-1.5 hover:bg-foreground/5 rounded-lg transition-colors flex-shrink-0 ml-2">
                                        <Trash2 class="h-4 w-4 text-foreground/50 hover:text-velaris-amber" />
                                    </button>
                                </div>
                                <!-- Mobile current time -->
                                <div class="sm:hidden mt-2 ml-6">
                                    <span class="text-xs text-foreground/60">{{ timeline.currentTime }}</span>
                                </div>
                            </div>

                            <!-- Hour blocks -->
                            <div class="p-3 min-w-0">
                                <div
                                    class="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/40 hover:scrollbar-thumb-border/60">
                                    <div class="flex gap-1 py-2 min-w-max">
                                        <div v-for="hour in 24" :key="hour" :data-hour="hour - 1"
                                            @mousedown="startSelection(timeline.id, hour - 1)"
                                            @touchstart.prevent="startSelection(timeline.id, hour - 1)"
                                            @mouseenter="updateSelection(timeline.id, hour - 1)"
                                            @touchmove.prevent="handleTouchMove($event, timeline.id)"
                                            @mouseup="endSelection" @touchend="endSelection"
                                            class="flex flex-col items-center justify-center border border-border/40 rounded cursor-pointer transition-all select-none flex-shrink-0 w-10 h-12 sm:w-11 sm:h-11"
                                            :class="{
                                                'bg-velaris-purple/20 border-velaris-purple/50': isHourSelected(timeline.id, hour - 1),
                                                'bg-velaris-teal/20 border-velaris-teal/50': isHourHighlighted(timeline.id, hour - 1),
                                                'hover:bg-foreground/5': !isHourSelected(timeline.id, hour - 1) && !isHourHighlighted(timeline.id, hour - 1)
                                            }">
                                            <span class="text-xs font-medium">{{ formatHour(hour - 1) }}</span>
                                            <span class="text-[9px] text-foreground/50 leading-none">{{
                                                getHourLabel(hour - 1) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Selection Info -->
                <div v-if="selectedTimeRange"
                    class="mt-4 p-3 bg-velaris-purple/10 border border-velaris-purple/30 rounded-lg">
                    <div class="flex items-center gap-2">
                        <Clock class="h-4 w-4 text-velaris-purple flex-shrink-0" />
                        <span class="text-sm">
                            <span class="font-medium">Selected:</span>
                            {{ selectedTimeRange.start }}:00 - {{ selectedTimeRange.end }}:00
                            <span class="text-foreground/60">({{ selectedTimeRange.timezone }})</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
    MessageSquare, MapPin, Copy, Info, Globe, Plus, X, Calendar,
    ChevronLeft, ChevronRight, Trash2, Clock, ChevronDown
} from 'lucide-vue-next'

// Discord Section Collapse State
const isDiscordExpanded = ref(false)

const toggleDiscordSection = () => {
    isDiscordExpanded.value = !isDiscordExpanded.value
}

// Discord Timestamp Generator
const userTimezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
const discordTimestamp = ref({
    datetime: new Date().toISOString().slice(0, 16),
    timezone: 'local'
})

const unixTimestamp = computed(() => {
    const date = new Date(discordTimestamp.value.datetime)
    return Math.floor(date.getTime() / 1000)
})

const timestampFormats = computed(() => {
    const timestamp = unixTimestamp.value
    const date = new Date(timestamp * 1000)

    return [
        {
            type: 'relative',
            name: 'Relative',
            code: `<t:${timestamp}:R>`,
            preview: 'in 2 hours'
        },
        {
            type: 'short-time',
            name: 'Short Time',
            code: `<t:${timestamp}:t>`,
            preview: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        },
        {
            type: 'long-time',
            name: 'Long Time',
            code: `<t:${timestamp}:T>`,
            preview: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        },
        {
            type: 'short-date',
            name: 'Short Date',
            code: `<t:${timestamp}:d>`,
            preview: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
        },
        {
            type: 'long-date',
            name: 'Long Date',
            code: `<t:${timestamp}:D>`,
            preview: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        },
        {
            type: 'short-datetime',
            name: 'Short Date/Time',
            code: `<t:${timestamp}:f>`,
            preview: `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
        },
        {
            type: 'long-datetime',
            name: 'Long Date/Time',
            code: `<t:${timestamp}:F>`,
            preview: `${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
        }
    ]
})

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // Could add a toast notification here
}

const copyTimestamp = (code) => {
    copyToClipboard(code)
    // Could add a toast notification here
}

// Timezone Timeline
const timelineDate = ref(new Date().toISOString().split('T')[0])
const timelines = ref([
    {
        id: 1,
        timezone: 'UTC',
        currentTime: '12:00 PM'
    },
    {
        id: 2,
        timezone: 'Australia/Brisbane',
        currentTime: '10:00 PM'
    }
])

const selectedTimeRange = ref(null)
const isSelecting = ref(false)
const selectionStart = ref(null)
const selectionEnd = ref(null)
const selectingTimeline = ref(null)

const formattedDate = computed(() => {
    const date = new Date(timelineDate.value)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
})

const addTimezone = () => {
    const newId = Math.max(...timelines.value.map(t => t.id), 0) + 1
    timelines.value.push({
        id: newId,
        timezone: 'UTC',
        currentTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    })
}

const removeTimezone = (index) => {
    timelines.value.splice(index, 1)
}

const previousDay = () => {
    const date = new Date(timelineDate.value)
    date.setDate(date.getDate() - 1)
    timelineDate.value = date.toISOString().split('T')[0]
}

const nextDay = () => {
    const date = new Date(timelineDate.value)
    date.setDate(date.getDate() + 1)
    timelineDate.value = date.toISOString().split('T')[0]
}

const formatHour = (hour) => {
    return hour === 0 ? '12a' : hour < 12 ? `${hour}a` : hour === 12 ? '12p' : `${hour - 12}p`
}

const getHourLabel = (hour) => {
    return `${hour.toString().padStart(2, '0')}:00`
}

const startSelection = (timelineId, hour) => {
    isSelecting.value = true
    selectingTimeline.value = timelineId
    selectionStart.value = hour
    selectionEnd.value = hour

    // Find the timezone for this timeline
    const timeline = timelines.value.find(t => t.id === timelineId)
    selectedTimeRange.value = {
        start: hour,
        end: hour + 1,
        timezone: timeline.timezone
    }
}

const updateSelection = (timelineId, hour) => {
    if (isSelecting.value && selectingTimeline.value === timelineId) {
        selectionEnd.value = hour
        const timeline = timelines.value.find(t => t.id === timelineId)
        const start = Math.min(selectionStart.value, selectionEnd.value)
        const end = Math.max(selectionStart.value, selectionEnd.value) + 1
        selectedTimeRange.value = {
            start,
            end,
            timezone: timeline.timezone
        }
    }
}

const handleTouchMove = (event, timelineId) => {
    if (!isSelecting.value || selectingTimeline.value !== timelineId) return

    const touch = event.touches[0]
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    if (!element) return

    const hourBlock = element.closest('[data-hour]')
    if (hourBlock) {
        const hour = parseInt(hourBlock.dataset.hour)
        updateSelection(timelineId, hour)
    }
}

const endSelection = () => {
    isSelecting.value = false
}

const clearSelection = () => {
    selectedTimeRange.value = null
    selectionStart.value = null
    selectionEnd.value = null
    selectingTimeline.value = null
}

const isHourSelected = (timelineId, hour) => {
    if (!selectedTimeRange.value || selectingTimeline.value !== timelineId) return false
    return hour >= Math.min(selectionStart.value, selectionEnd.value) &&
        hour <= Math.max(selectionStart.value, selectionEnd.value)
}

const isHourHighlighted = (timelineId, hour) => {
    if (!selectedTimeRange.value || selectingTimeline.value === timelineId) return false

    // Calculate timezone offset and highlight equivalent hours
    // This is simplified - in production you'd use a proper timezone library
    const sourceTimeline = timelines.value.find(t => t.id === selectingTimeline.value)
    const targetTimeline = timelines.value.find(t => t.id === timelineId)

    if (!sourceTimeline || !targetTimeline) return false

    // For demo purposes, just highlight the same hours
    // In production, calculate actual timezone conversions
    const start = Math.min(selectionStart.value, selectionEnd.value)
    const end = Math.max(selectionStart.value, selectionEnd.value)

    // Simple offset calculation (would need proper timezone library)
    let offset = 0
    if (sourceTimeline.timezone === 'UTC' && targetTimeline.timezone === 'Australia/Brisbane') {
        offset = 10
    } else if (sourceTimeline.timezone === 'Australia/Brisbane' && targetTimeline.timezone === 'UTC') {
        offset = -10
    }

    const adjustedHour = (hour - offset + 24) % 24
    return adjustedHour >= start && adjustedHour <= end
}

onMounted(() => {
    // Set initial datetime to current time in user's timezone
    const now = new Date()
    discordTimestamp.value.datetime = now.toISOString().slice(0, 16)

    // Update timeline current times
    timelines.value.forEach(timeline => {
        const date = new Date()
        timeline.currentTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timeline.timezone
        })
    })
})
</script>