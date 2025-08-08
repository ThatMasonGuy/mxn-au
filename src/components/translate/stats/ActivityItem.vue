<template>
    <div class="flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
        <div class="flex items-center space-x-2">
            <i :class="[activity.fromFlag, 'w-5 h-4 rounded shadow-sm']"></i>
            <ChevronRight class="w-4 h-4 text-white/40" />
            <i :class="[activity.toFlag, 'w-5 h-4 rounded shadow-sm']"></i>
        </div>
        <div class="flex-1 min-w-0">
            <p class="text-white/80 text-sm truncate">
                <span class="font-medium">{{ activity.user }}</span>
                {{ activity.action }} from {{ activity.fromLang }} to {{ activity.toLang }}
            </p>
        </div>
        <span class="text-white/50 text-xs whitespace-nowrap">{{ formatTimeAgo(activity.timestamp) }}</span>
    </div>
</template>

<script setup>
import { ChevronRight } from 'lucide-vue-next'

// Props
defineProps({
    activity: {
        type: Object,
        required: true,
        validator: (activity) => {
            return activity.user &&
                activity.action &&
                activity.fromLang &&
                activity.toLang &&
                activity.timestamp &&
                activity.fromFlag &&
                activity.toFlag
        }
    }
})

// Methods
const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const past = new Date(timestamp)
    const seconds = Math.floor((now - past) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago'
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago'
    return Math.floor(seconds / 86400) + 'd ago'
}
</script>