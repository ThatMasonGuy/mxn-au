<template>
    <div :class="cardClasses">
        <div v-if="title" class="mb-4">
            <h2 class="text-2xl font-bold" :class="titleClasses">{{ title }}</h2>
            <p v-if="subtitle" class="text-sm mt-1" :class="subtitleClasses">{{ subtitle }}</p>
        </div>
        <div>
            <slot />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    theme: { type: String, default: 'light' }
})

const cardClasses = computed(() => {
    if (props.theme.includes('dark')) return 'bg-gray-800 text-gray-100 rounded-2xl shadow-md p-6 w-full'
    if (props.theme.includes('colour')) return 'bg-slate-50 text-gray-800 rounded-2xl shadow-md p-6 w-full'
    return 'bg-white text-gray-800 rounded-2xl shadow-md p-6 w-full'
})

const titleClasses = computed(() => {
    return props.theme.includes('dark') ? 'text-white' : 'text-gray-700'
})

const subtitleClasses = computed(() => {
    return props.theme.includes('dark') ? 'text-gray-300' : 'text-gray-500'
})
</script>