<template>
    <div class="group relative">
        <div class="absolute -inset-1 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur">
        </div>
        <div class="relative p-8 bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl">
            <!-- Header -->
            <div class="flex items-start gap-4 mb-6 pb-6 border-b border-zinc-700/30">
                <div class="p-3 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 rounded-xl">
                    <component :is="iconComponent" class="h-6 w-6 text-violet-400" />
                </div>
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-white mb-1">{{ title }}</h3>
                    <p class="text-zinc-400">{{ description }}</p>
                </div>
            </div>

            <!-- Content Slot -->
            <div>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Languages, Megaphone, Settings, Ban } from 'lucide-vue-next'

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
        default: 'Settings'
    }
})

const iconMap = {
    Languages,
    Megaphone,
    Settings,
    Ban
}

const iconComponent = computed(() => iconMap[props.icon] || Settings)
</script>
