<template>
    <div class="space-y-3">
        <div v-for="(event, i) in block.data.events" :key="i" class="border-l-2 border-purple-500 pl-4 relative">
            <div class="absolute left-[-10px] top-2 w-3 h-3 bg-purple-500 rounded-full"></div>
            <input v-model="event.title" placeholder="Event title"
                class="w-full bg-transparent text-sm font-semibold border-none focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1" />
            <input v-model="event.description" placeholder="Event description"
                class="w-full bg-transparent text-xs text-zinc-400 border-none focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1" />
        </div>
        <button @click="addEvent" class="mt-2 text-xs text-purple-400 hover:text-purple-300">
            + Add event
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    block: Object
})

const block = props.block

function addEvent() {
    if (!Array.isArray(block.data.events)) block.data.events = []
    block.data.events.push({ title: '', description: '' })
}
</script>