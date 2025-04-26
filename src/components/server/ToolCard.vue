<!-- /components/ToolCard.vue -->
<template>
    <div class="group rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur transition
             hover:border-emerald-400/70 hover:-translate-y-1 hover:shadow-lg">
        <div class="mb-3 flex items-center">
            <!-- Render whatever component you pass in via the `icon` prop -->
            <component :is="icon" class="mr-2 h-6 w-6 text-emerald-400" />

            <h3 class="font-mono text-lg">
                <span class="text-emerald-400">&gt;</span>
                {{ title }}
            </h3>
        </div>

        <p class="text-sm text-gray-400">
            {{ desc }}
        </p>
    </div>
</template>

<script setup>
const props = defineProps({
    icon: {
        /** A Heroicons component (or any Vue component) */
        type: [Object, Function],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    }
})
</script>