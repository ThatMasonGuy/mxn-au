<template>
    <div>
        <span class="font-medium text-sm text-gray-500 mr-2">{{ title }}:</span>
        <div class="inline-flex flex-wrap gap-2">
            <button v-for="option in options" :key="option.value" @click="handleClick(option.value)" :class="[
                'filter-pill px-3 py-1 rounded-full text-sm border',
                {
                    'filter-active': isOptionActive(option.value),
                    'border-gray-300 bg-white': !isOptionActive(option.value),
                    'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400': option.disabled,
                    'pulse-on-click': clickedOption === option.value
                }
            ]" :disabled="option.disabled">
                {{ option.label }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    title: String,
    options: Array, // [{ label, value, disabled? }]
    active: Array,
    emptyMeansAll: { type: Boolean, default: false }
})

const emit = defineEmits(['toggle'])

const clickedOption = ref(null)

function handleClick(value) {
    clickedOption.value = value
    setTimeout(() => {
        clickedOption.value = null
    }, 500)
    emit('toggle', value)
}

function isOptionActive(value) {
    if (!props.active) return false

    if (props.emptyMeansAll && value === 'all') {
        return props.active.length === 0
    }
    return props.active.includes(value)
}
</script>

<style scoped>
/* Filter Pill Base */
.filter-pill {
    transition: all 0.2s ease;
    cursor: pointer;
}

/* Hover State */
.filter-pill:hover:not(:disabled) {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
}

/* Active State */
.filter-active {
    background-color: #4f46e5;
    /* Indigo-600 */
    color: white;
    border-color: #4f46e5;
}

/* Disabled State */
.filter-pill:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f3f4f6;
    /* Gray-100 */
    color: #9ca3af;
    /* Gray-400 */
    border-color: #d1d5db;
    /* Gray-300 */
}

/* Pulse Animation on Click */
@keyframes pulse-click {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7);
        /* Indigo */
    }

    50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 8px rgba(79, 70, 229, 0);
    }

    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
    }
}

.pulse-on-click {
    animation: pulse-click 0.5s ease-out;
}
</style>