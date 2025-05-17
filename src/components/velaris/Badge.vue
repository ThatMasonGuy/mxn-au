<template>
    <span
        class="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide shadow-sm"
        :class="badgeClasses" :style="badgeStyle">
        <slot />
        {{ label }}
    </span>
</template>

<script setup>
import { computed } from 'vue';
const { label, variant } = defineProps({
  label: String,
  variant: {
    type: String,
    default: 'default'
  }
})

const roleColors = {
    R5: ['#FFD700', '#FFA500'],
    R4: ['#D8B4FE', '#C084FC'],
    R3: ['#93C5FD', '#60A5FA'],
    R2: ['#6EE7B7', '#34D399'],
    R1: ['#CBD5E1', '#94A3B8']
}

const statusColors = {
    active: ['#4ADE80', '#22C55E'],
    inactive: ['#FACC15', '#EAB308'],
    left: ['#60A5FA', '#3B82F6'],
    kicked: ['#F87171', '#EF4444']
}

const badgeClasses = 'text-white bg-opacity-10 backdrop-blur border border-white/10'

const badgeStyle = computed(() => {
    const source =
        variant === 'role' ? roleColors[label] :
            variant === 'status' ? statusColors[label?.toLowerCase()] :
                null

    if (source) {
        return {
            background: `linear-gradient(to right, ${source[0]}, ${source[1]})`,
            boxShadow: `0 0 6px ${source[1]}AA`
        }
    }

    return {
        backgroundColor: '#475569',
        color: '#F1F5F9'
    }
})
</script>