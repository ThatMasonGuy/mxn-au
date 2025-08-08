<template>
    <div class="relative group">
        <div
            :class="['absolute inset-0 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-500', 'bg-gradient-to-r', ...bgGradient]">
        </div>
        <div
            class="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/10 transition-all duration-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-white/60 text-sm font-medium uppercase tracking-wide">{{ label }}</p>
                    <p class="text-2xl font-bold text-white mt-1">{{ value }}</p>
                </div>
                <div :class="['p-3 rounded-xl bg-gradient-to-br', ...gradient.map(g => g + '/20')]">
                    <component :is="iconComponent" class="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { MessageCircle, FileText, CheckCircle, Zap } from 'lucide-vue-next'

// Props
const props = defineProps({
    value: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    gradient: {
        type: Array,
        required: true
    },
    bgGradient: {
        type: Array,
        required: true
    }
})

// Icon component mapping
const iconComponent = computed(() => {
    const icons = {
        'message-circle': MessageCircle,
        'type': FileText,
        'check-circle': CheckCircle,
        'zap': Zap
    }

    return icons[props.icon] || MessageCircle
})
</script>