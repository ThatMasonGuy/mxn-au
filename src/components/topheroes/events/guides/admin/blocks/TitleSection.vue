<template>
    <div class="space-y-4 text-white">
        <!-- Alignment Selection -->
        <div class="flex items-center gap-2">
            <label class="text-sm text-zinc-400">Text Alignment:</label>
            <select v-model="block.data.align"
                class="bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
            </select>
        </div>

        <!-- Title Input -->
        <div class="border border-zinc-700 p-2 bg-zinc-800/40 rounded">
            <input v-model="block.data.title" placeholder="Section Title" :class="alignmentClasses"
                class="w-full bg-transparent border-none text-xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1" />
        </div>

        <!-- Subtitle Input -->
        <div class="border border-zinc-700 p-2 bg-zinc-800/40 rounded">
            <textarea v-model="block.data.subtitle" placeholder="Optional subtitle or description"
                :class="alignmentClasses"
                class="w-full bg-transparent border-none text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 min-h-20 resize-y"
                rows="3"></textarea>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

const props = defineProps({
    block: Object,
    align: {
        type: String,
        default: 'left'
    }
})

const block = props.block

onMounted(() => {
    if (!block.data) block.data = {}
    if (typeof block.data.title !== 'string') block.data.title = ''
    if (typeof block.data.subtitle !== 'string') block.data.subtitle = ''
    if (typeof block.data.align !== 'string') block.data.align = 'left'
})

const alignmentClasses = computed(() => {
    switch (block.data.align || props.align) {
        case 'center':
            return 'text-center'
        case 'right':
            return 'text-right'
        default:
            return 'text-left'
    }
})
</script>