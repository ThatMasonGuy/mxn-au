<template>
    <div :class="[
        'p-4 border rounded-xl transition-all',
        schedule.is_paused 
            ? 'bg-zinc-900/50 border-zinc-700/30 opacity-60' 
            : 'bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50'
    ]">
        <div class="flex items-start gap-4">
            <!-- Type Icon -->
            <div :class="[
                'p-2.5 rounded-lg flex-shrink-0',
                schedule.schedule_type === 'recurring' 
                    ? 'bg-fuchsia-500/10 border border-fuchsia-500/20' 
                    : 'bg-violet-500/10 border border-violet-500/20'
            ]">
                <Repeat v-if="schedule.schedule_type === 'recurring'" 
                    :class="['h-5 w-5', schedule.is_paused ? 'text-zinc-500' : 'text-fuchsia-400']" />
                <Calendar v-else 
                    :class="['h-5 w-5', schedule.is_paused ? 'text-zinc-500' : 'text-violet-400']" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-4">
                    <div class="min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                            <h4 class="font-semibold text-white truncate">
                                {{ schedule.title || 'Scheduled Message' }}
                            </h4>
                            <span v-if="schedule.is_paused" 
                                class="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-400">
                                Paused
                            </span>
                        </div>
                        
                        <p class="text-sm text-zinc-400 mt-1 flex items-center gap-2">
                            <Hash class="h-3.5 w-3.5" />
                            <span>{{ channels[schedule.channel_id] || schedule.channel_id }}</span>
                        </p>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-2 flex-shrink-0">
                        <button @click="$emit('toggle-pause')" 
                            :title="schedule.is_paused ? 'Resume' : 'Pause'"
                            class="p-2 hover:bg-zinc-700/50 rounded-lg text-zinc-400 hover:text-white transition-all">
                            <Play v-if="schedule.is_paused" class="h-4 w-4" />
                            <Pause v-else class="h-4 w-4" />
                        </button>
                        <button @click="$emit('edit')" 
                            class="p-2 hover:bg-zinc-700/50 rounded-lg text-zinc-400 hover:text-white transition-all">
                            <Edit class="h-4 w-4" />
                        </button>
                        <button @click="$emit('delete')" 
                            class="p-2 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-400 transition-all">
                            <Trash2 class="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <!-- Message Preview -->
                <div class="mt-3 p-3 bg-zinc-900/50 rounded-lg">
                    <p class="text-sm text-zinc-300 line-clamp-2">{{ schedule.message_content }}</p>
                </div>

                <!-- Schedule Info -->
                <div class="mt-3 flex items-center gap-4 flex-wrap text-xs text-zinc-500">
                    <!-- Next Run -->
                    <div class="flex items-center gap-1">
                        <Clock class="h-3.5 w-3.5" />
                        <span v-if="schedule.next_run_at">
                            {{ formatNextRun(schedule.next_run_at) }}
                        </span>
                        <span v-else class="text-zinc-600">Not scheduled</span>
                    </div>

                    <!-- Recurrence Info -->
                    <div v-if="schedule.schedule_type === 'recurring'" class="flex items-center gap-1">
                        <Repeat class="h-3.5 w-3.5" />
                        <span>{{ formatRecurrence(schedule) }}</span>
                    </div>

                    <!-- Send As -->
                    <div class="flex items-center gap-1">
                        <Bot v-if="schedule.send_as === 'bot'" class="h-3.5 w-3.5" />
                        <User v-else class="h-3.5 w-3.5" />
                        <span>{{ schedule.send_as === 'bot' ? 'Bot' : 'Webhook' }}</span>
                    </div>

                    <!-- Timestamp Badge -->
                    <div v-if="schedule.embed_timestamp" 
                        class="flex items-center gap-1 text-violet-400">
                        <Timer class="h-3.5 w-3.5" />
                        <span>Timestamp</span>
                    </div>

                    <!-- Ping Badge -->
                    <div v-if="schedule.ping_everyone || schedule.ping_role_id" 
                        class="flex items-center gap-1 text-amber-400">
                        <Bell class="h-3.5 w-3.5" />
                        <span>{{ schedule.ping_everyone ? '@everyone' : '@role' }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    Calendar,
    Repeat,
    Hash,
    Clock,
    Play,
    Pause,
    Edit,
    Trash2,
    Bot,
    User,
    Timer,
    Bell
} from 'lucide-vue-next'

const props = defineProps({
    schedule: {
        type: Object,
        required: true
    },
    channels: {
        type: Object,
        default: () => ({})
    }
})

defineEmits(['edit', 'delete', 'toggle-pause'])

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatNextRun(dateStr) {
    if (!dateStr) return 'Not scheduled'
    
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = date - now
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    // Use the schedule's timezone for display
    const tz = props.schedule.recurrence_timezone || Intl.DateTimeFormat().resolvedOptions().timeZone

    if (diffMs < 0) {
        // Show how long ago it was supposed to fire
        const absDiffMins = Math.abs(diffMins)
        if (absDiffMins < 60) return `Overdue by ${absDiffMins}m`
        const absDiffHours = Math.abs(diffHours)
        if (absDiffHours < 24) return `Overdue by ${absDiffHours}h`
        return 'Overdue'
    }
    if (diffMins < 1) return 'Sending now...'
    if (diffMins < 60) return `in ${diffMins} min${diffMins === 1 ? '' : 's'}`
    if (diffHours < 24) return `in ${diffHours} hour${diffHours === 1 ? '' : 's'}`
    if (diffDays < 7) return `in ${diffDays} day${diffDays === 1 ? '' : 's'}`

    // For longer durations, show date/time in the schedule's timezone
    return date.toLocaleDateString('en-AU', { 
        timeZone: tz,
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    })
}

function formatRecurrence(schedule) {
    const rule = schedule.recurrence_rule
    const day = schedule.recurrence_day
    const time = schedule.recurrence_time
    const tz = schedule.recurrence_timezone

    // Get short timezone name
    let tzShort = ''
    if (tz) {
        try {
            tzShort = ' ' + new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'short' })
                .formatToParts(new Date())
                .find(p => p.type === 'timeZoneName')?.value || ''
        } catch (e) {
            // Ignore
        }
    }

    switch (rule) {
        case 'daily':
            return `Daily at ${time}${tzShort}`
        case 'weekly':
            return `${dayNames[day]}s at ${time}${tzShort}`
        case 'biweekly':
            return `Every 2 ${dayNames[day]}s at ${time}${tzShort}`
        case 'monthly':
            return `${getOrdinal(day)} of month at ${time}${tzShort}`
        default:
            return rule
    }
}

function getOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
}
</script>