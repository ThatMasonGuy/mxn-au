<template>
    <div class="space-y-3">
        <input v-model="block.data.url" placeholder="Image URL"
            class="w-full bg-transparent border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <input v-model="block.data.caption" placeholder="Caption (optional)"
            class="w-full bg-transparent border border-zinc-700 rounded px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <div v-if="block.data.url" class="mt-2 rounded overflow-hidden border border-zinc-700">
            <img :src="block.data.url" class="w-full h-auto object-cover rounded" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    block: Object
})
</script>