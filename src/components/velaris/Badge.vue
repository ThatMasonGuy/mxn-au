<template>
    <span
        class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md border transition-colors duration-200"
        :class="badgeClasses">

        <!-- Icon based on variant -->
        <component v-if="badgeIcon" :is="badgeIcon" class="w-3 h-3" />

        <!-- Slot content or label -->
        <slot>{{ label }}</slot>

        <!-- Simple dot for active status -->
        <div v-if="variant === 'status' && label?.toLowerCase() === 'active'"
            class="w-1.5 h-1.5 bg-current rounded-full opacity-75"></div>
    </span>
</template>

<script setup>
import { computed } from 'vue'
import { Crown, Shield, Star, Users, User, Activity, Pause, LogOut, Ban } from 'lucide-vue-next'

const { label, variant } = defineProps({
    label: String,
    variant: {
        type: String,
        default: 'default'
    }
})

// Role icons
const roleIcons = {
    R5: Crown,
    R4: Shield,
    R3: Star,
    R2: Users,
    R1: User
}

// Status icons  
const statusIcons = {
    active: Activity,
    inactive: Pause,
    left: LogOut,
    kicked: Ban
}

const badgeIcon = computed(() => {
    if (variant === 'role') {
        return roleIcons[label]
    } else if (variant === 'status') {
        return statusIcons[label?.toLowerCase()]
    }
    return null
})

const badgeClasses = computed(() => {
    if (variant === 'role') {
        const roleClasses = {
            R5: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30',
            R4: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400 dark:border-purple-500/30',
            R3: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
            R2: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400 dark:border-green-500/30',
            R1: 'bg-slate-500/10 text-slate-700 border-slate-500/20 dark:text-slate-400 dark:border-slate-500/30'
        }
        return roleClasses[label] || 'bg-slate-500/10 text-slate-700 border-slate-500/20 dark:text-slate-400 dark:border-slate-500/30'
    }

    if (variant === 'status') {
        const statusClasses = {
            active: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400 dark:border-green-500/30',
            inactive: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30',
            left: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
            kicked: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400 dark:border-red-500/30'
        }
        return statusClasses[label?.toLowerCase()] || 'bg-slate-500/10 text-slate-700 border-slate-500/20 dark:text-slate-400 dark:border-slate-500/30'
    }

    // Default badge style
    return 'bg-slate-500/10 text-slate-700 border-slate-500/20 dark:text-slate-400 dark:border-slate-500/30'
})
</script>

<style scoped>
/* Subtle hover effect */
span:hover {
    background-color: rgb(from currentColor r g b / 0.15);
    border-color: rgb(from currentColor r g b / 0.3);
}

/* Fallback for browsers that don't support color-mix */
@supports not (color: rgb(from white r g b / 0.1)) {
    span:hover {
        opacity: 0.9;
        transform: translateY(-0.5px);
    }
}
</style>