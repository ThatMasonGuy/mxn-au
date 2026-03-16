<template>
    <div class="relative group">
        <div
            :class="['absolute inset-0 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-500', 'bg-gradient-to-r', ...gradient.map(g => g + '/20')]">
        </div>
        <div
            class="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/10 transition-all duration-500">
            <div class="flex items-start space-x-4">
                <div :class="['p-3 rounded-xl bg-gradient-to-br', ...gradient.map(g => g + '/20')]">
                    <component :is="iconComponent" class="w-6 h-6 text-white" />
                </div>
                <div class="flex-1">
                    <p class="text-2xl font-bold text-white">{{ value }}</p>
                    <p class="text-white/80 font-medium mt-1">{{ label }}</p>
                    <p class="text-white/50 text-sm mt-2">{{ description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { User, Edit, DollarSign } from 'lucide-vue-next'

// Props
const props = defineProps({
    value: {
        type: [String, Number],
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
    description: {
        type: String,
        required: true
    },
    gradient: {
        type: Array,
        required: true
    }
})

// Icon component mapping
const iconComponent = computed(() => {
    const icons = {
        'user': User,
        'edit': Edit,
        'dollar-sign': DollarSign
    }

    return icons[props.icon] || User
})
</script>