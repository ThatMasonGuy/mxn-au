<template>
    <div class="space-y-2">
        <blockquote class="border-l-4 border-purple-500 pl-4 italic text-zinc-300">
            <textarea v-model="block.data.quote" placeholder="Quote text..."
                class="w-full bg-transparent border-none text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 min-h-20 resize-y"
                rows="2"></textarea>
        </blockquote>
        <input v-model="block.data.author" placeholder="– Author (optional)"
            class="w-full bg-transparent border-none text-sm text-right focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1" />
    </div>
</template>

<script setup>
const props = defineProps({
    block: Object
})
</script>