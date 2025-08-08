<template>
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
            <component :is="iconComponent" class="w-5 h-5 text-emerald-400" />
            <span class="text-white/70">{{ label }}</span>
        </div>
        <span class="text-white font-semibold">{{ value }}</span>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Clock, Users, TrendingUp } from 'lucide-vue-next'

// Props
const props = defineProps({
    label: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    },
    icon: {
        type: String,
        required: true
    }
})

// Icon component mapping
const iconComponent = computed(() => {
    const icons = {
        'clock': Clock,
        'users': Users,
        'trending-up': TrendingUp
    }

    return icons[props.icon] || Clock
})
</script>