<template>
    <div @click="$emit('click')"
        class="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/50 hover:scale-[1.02] hover:-translate-y-1">

        <!-- Header -->
        <div class="flex justify-between items-start mb-4">
            <span :class="['text-xs font-bold px-3 py-1.5 rounded-full border', badgeColor(event.type)]">
                {{ event.type }}
            </span>
            <div class="text-right">
                <div class="text-slate-400 text-xs mb-1">Duration</div>
                <div class="text-slate-300 text-xs font-medium">
                    {{ formatDateRange(event.startDate, event.endDate) }}
                </div>
            </div>
        </div>

        <!-- Event Title -->
        <div class="mb-4">
            <h3
                class="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors duration-200 leading-tight">
                {{ eventHeader(event) }}
            </h3>
            <div class="text-sm text-slate-400 mt-1">{{ event.eventId }}</div>
        </div>

        <!-- Event Details -->
        <div class="space-y-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 rounded-full" :class="statusColor(event.status)"></div>
                    <span class="text-slate-400 text-sm">Status</span>
                </div>
                <span class="text-white font-medium text-sm capitalize">{{ event.status }}</span>
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <Crown class="w-3 h-3 text-amber-400" />
                    <span class="text-slate-400 text-sm">Guild</span>
                </div>
                <span class="text-white font-medium text-sm">{{ event.guild || event.guildShort }}</span>
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <Users class="w-3 h-3 text-blue-400" />
                    <span class="text-slate-400 text-sm">Players</span>
                </div>
                <span class="text-white font-medium text-sm">{{ event.memberIds?.length || 0 }}</span>
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <Target class="w-3 h-3 text-emerald-400" />
                    <span class="text-slate-400 text-sm">Format</span>
                </div>
                <span class="text-white font-medium text-sm">{{ scoreFormat(event.type) }}</span>
            </div>
        </div>

        <!-- Hover Effect Gradient -->
        <div
            class="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        </div>
    </div>
</template>

<script setup>
import { Users, Crown, Target } from 'lucide-vue-next'

const props = defineProps({
    event: Object
})

const formatDate = (d) => {
    if (!d) return 'N/A'
    const date = typeof d?.toDate === 'function' ? d.toDate() : new Date(d)
    return date.toLocaleDateString('en-AU', {
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

const eventHeader = (event) => {
    // Defensive date parsing (supports Firestore Timestamps, strings, and Dates)
    const dateObj = typeof event.startDate?.toDate === 'function'
        ? event.startDate.toDate()
        : new Date(event.startDate);
    // Get full month
    const month = dateObj.toLocaleString('en-AU', { month: 'long' });
    return `${event.event || event.eventId} | ${month}`;
};

const badgeColor = (type) => {
    return {
        KvK: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30',
        GvG: 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30',
        GR: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30'
    }[type] || 'bg-gradient-to-r from-slate-600/20 to-slate-700/20 text-slate-300 border-slate-500/30'
}

const statusColor = (status) => {
    return {
        active: 'bg-emerald-400',
        upcoming: 'bg-blue-400',
        completed: 'bg-slate-400',
        cancelled: 'bg-red-400'
    }[status] || 'bg-slate-400'
}

const scoreFormat = (type) => {
    return {
        KvK: 'Daily (D1–D6)',
        GvG: 'Daily (D1–D6)',
        GR: 'Single Score'
    }[type] || 'Unknown'
}
</script>

<style scoped>
/* Glass morphism effect */
.backdrop-blur-sm {
    backdrop-filter: blur(4px);
}
</style>