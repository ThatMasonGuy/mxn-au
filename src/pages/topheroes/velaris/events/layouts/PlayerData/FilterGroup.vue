<template>
    <div class="filter-group">
        <label class="filter-label">{{ title }}</label>
        <div class="filter-options">
            <button v-for="option in options" :key="option.value" @click="handleClick(option.value)" :class="[
                'filter-pill',
                {
                    'filter-active': isOptionActive(option.value),
                    'filter-inactive': !isOptionActive(option.value),
                    'filter-disabled': option.disabled,
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
    if (props.options.find(opt => opt.value === value)?.disabled) return

    clickedOption.value = value
    setTimeout(() => {
        clickedOption.value = null
    }, 300)
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
.filter-group {
    @apply flex flex-col gap-2;
}

.filter-label {
    @apply text-sm font-medium text-foreground;
}

.filter-options {
    @apply flex flex-wrap gap-2;
}

.filter-pill {
    @apply px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200 cursor-pointer select-none;
    @apply focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1;
    min-height: 36px;
    min-width: 60px;
}

.filter-inactive {
    @apply bg-card border-border text-foreground;
}

.filter-inactive:hover:not(.filter-disabled) {
    @apply bg-muted border-primary/30 shadow-sm transform translate-y-[-1px];
}

.filter-active {
    @apply bg-primary border-primary text-primary-foreground shadow-md;
}

.filter-active:hover {
    @apply bg-primary/90 shadow-lg;
}

.filter-disabled {
    @apply opacity-40 cursor-not-allowed bg-muted/50 text-muted-foreground border-border/50;
}

/* Pulse Animation on Click */
@keyframes pulse-click {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 hsl(var(--primary) / 0.5);
    }

    50% {
        transform: scale(1.02);
        box-shadow: 0 0 0 6px hsl(var(--primary) / 0);
    }

    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 hsl(var(--primary) / 0);
    }
}

.pulse-on-click {
    animation: pulse-click 0.3s ease-out;
}

/* Mobile optimizations */
@media (max-width: 640px) {
    .filter-options {
        @apply gap-1.5;
    }

    .filter-pill {
        @apply px-2.5 py-1.5 text-xs;
        min-height: 32px;
        min-width: 50px;
    }

    .filter-label {
        @apply text-xs;
    }
}
</style>