<template>
    <div class="space-y-2">
        <div class="flex items-center gap-4">
            <span class="text-sm text-zinc-400">Size:</span>
            <select v-model="block.data.size"
                class="bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
            </select>
        </div>
        <div :class="{
            'h-4': block.data.size === 'small',
            'h-8': block.data.size === 'medium',
            'h-16': block.data.size === 'large'
        }" class="bg-zinc-700/20 rounded"></div>
    </div>
</template>

<script setup>
const props = defineProps({
    block: Object
})
</script>