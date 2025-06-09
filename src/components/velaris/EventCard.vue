<template>
        <div @click="$emit('click')"
            class="group hover:border-indigo-500 duration-300 hover:shadow-indigo-500/40 group bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg">
            <div class="flex justify-between items-start mb-2">
                <span :class="['text-xs font-bold px-2 py-0.5 rounded-full', badgeColor(event.type)]">
                    {{ event.type }}
                </span>
                <span class="text-slate-400 text-xs">{{ formatDate(event.enteredDate) }}</span>
            </div>

            <div class="text-lg font-bold text-white truncate">
                {{ event.eventId }}
            </div>

            <div class="mt-2 text-slate-400 text-sm">
                <div>Guild: <span class="text-white font-medium">{{ event.guild }}</span></div>
                <div>Players: <span class="text-white">—</span></div>
                <div>Score Format: <span class="text-white">{{ scoreFormat(event.type) }}</span></div>
            </div>
        </div>
</template>

<script setup>
const props = defineProps({
    event: Object
})

const formatDate = (d) => {
    const date = typeof d?.toDate === 'function' ? d.toDate() : new Date(d)
    return date.toLocaleDateString('en-AU', {
        year: '2-digit',
        month: 'short',
        day: 'numeric'
    })
}

const badgeColor = (type) => {
    return {
        KvK: 'bg-blue-500/20 text-blue-300',
        GvG: 'bg-purple-500/20 text-purple-300',
        GR: 'bg-green-500/20 text-green-300'
    }[type] || 'bg-slate-600/20 text-slate-300'
}

const scoreFormat = (type) => {
    return {
        KvK: 'Daily (D1–D6)',
        GvG: 'Daily (D1–D6)',
        GR: 'Single Score'
    }[type] || 'Unknown'
}
</script>