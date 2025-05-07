<template>
    <div class="space-y-3">
        <div class="space-y-1">
            <div v-for="(image, i) in block.data.images" :key="i" class="flex items-center gap-2">
                <input v-model="block.data.images[i]"
                    class="w-full bg-transparent border border-zinc-700 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Image URL" />
                <button @click="block.data.images.splice(i, 1)" class="text-red-400 hover:text-red-300 text-xs">
                    ✕
                </button>
            </div>
        </div>
        <button @click="block.data.images.push('')" class="mt-2 text-xs text-purple-400 hover:text-purple-300">
            + Add image
        </button>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            <img v-for="(url, i) in block.data.images" :key="i" :src="url"
                class="w-full h-auto rounded border border-zinc-700 object-cover" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    block: Object
})
</script>