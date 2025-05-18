<template>
    <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-slate-300">
            <thead class="bg-slate-700 text-slate-200 text-xs uppercase">
                <tr>
                    <th scope="col" class="px-4 py-3">Event ID</th>
                    <th scope="col" class="px-4 py-3">Type</th>
                    <th scope="col" class="px-4 py-3">Guild</th>
                    <th scope="col" class="px-4 py-3">Date</th>
                    <th scope="col" class="px-4 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="event in events" :key="event.id" class="border-b border-slate-700 hover:bg-slate-800">
                    <td class="px-4 py-2 font-medium text-white">{{ event.eventId }}</td>
                    <td class="px-4 py-2">
                        <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', badgeColor(event.type)]">
                            {{ event.type }}
                        </span>
                    </td>
                    <td class="px-4 py-2">{{ event.guild }}</td>
                    <td class="px-4 py-2">{{ formatDate(event.enteredDate) }}</td>
                    <td class="px-4 py-2">
                        <button @click="$emit('edit', event)"
                            class="text-indigo-400 hover:underline hover:text-indigo-300 text-xs">Edit</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
const props = defineProps({
    events: Array
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
</script>

<style scoped></style>