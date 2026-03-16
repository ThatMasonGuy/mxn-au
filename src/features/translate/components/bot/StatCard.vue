<template>
    <div
        class="p-6 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl backdrop-blur hover:border-zinc-600/50 transition-all">
        <div class="flex items-start justify-between mb-4">
            <div :class="[
                'p-3 rounded-xl',
                color === 'violet' ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-fuchsia-500/10 border border-fuchsia-500/20'
            ]">
                <component :is="iconComponent" :class="[
                    'h-6 w-6',
                    color === 'violet' ? 'text-violet-400' : 'text-fuchsia-400'
                ]" />
            </div>
            <div v-if="trend" :class="[
                'text-xs font-medium px-2 py-1 rounded-full',
                trend.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            ]">
                {{ trend }}
            </div>
        </div>
        <div>
            <p class="text-3xl font-bold text-white mb-1">{{ formatValue(value) }}</p>
            <p class="text-sm text-zinc-500">{{ title }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Languages, Hash, Globe, Users } from 'lucide-vue-next'

const props = defineProps({
    title: String,
    value: [Number, String],
    icon: String,
    color: {
        type: String,
        default: 'violet'
    },
    trend: String
})

const iconComponent = computed(() => {
    const icons = {
        Languages,
        Hash,
        Globe,
        Users
    }
    return icons[props.icon] || Languages
})

function formatValue(val) {
    if (typeof val === 'number' && val >= 1000) {
        return (val / 1000).toFixed(1) + 'k'
    }
    return val
}
</script>