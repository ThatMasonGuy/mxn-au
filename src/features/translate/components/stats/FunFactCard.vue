<template>
    <div class="relative group">
        <div
            :class="['absolute inset-0 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-500', 'bg-gradient-to-r', ...gradient.map(g => g + '/20')]">
        </div>
        <div
            class="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/10 transition-all duration-500 h-full">
            <div class="flex items-start space-x-4">
                <div :class="['p-3 rounded-xl bg-gradient-to-br flex-shrink-0', ...gradient.map(g => g + '/20')]">
                    <component :is="iconComponent" class="w-6 h-6 text-white" />
                </div>
                <div>
                    <h4 class="font-bold text-white mb-2">{{ title }}</h4>
                    <p class="text-white/70 text-sm leading-relaxed">{{ description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Globe, Book, Zap, Leaf, Cpu, Award } from 'lucide-vue-next'

// Props
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
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
    }
})

// Icon component mapping
const iconComponent = computed(() => {
    const icons = {
        'globe': Globe,
        'book': Book,
        'zap': Zap,
        'leaf': Leaf,
        'cpu': Cpu,
        'award': Award
    }

    return icons[props.icon] || Globe
})
</script>