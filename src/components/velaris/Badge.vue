<template>
    <span
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm border"
        :class="badgeClasses" :style="badgeStyle">

        <!-- Icon based on variant -->
        <component v-if="badgeIcon" :is="badgeIcon" class="w-3 h-3" />

        <!-- Slot content or label -->
        <slot>{{ label }}</slot>

        <!-- Animated dot for active status -->
        <div v-if="variant === 'status' && label?.toLowerCase() === 'active'"
            class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
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

// Enhanced role colors with better gradients
const roleColors = {
    R5: {
        primary: '#FFD700',
        secondary: '#FFA500',
        accent: '#FF8C00',
        glow: 'rgba(255, 215, 0, 0.4)'
    },
    R4: {
        primary: '#D8B4FE',
        secondary: '#C084FC',
        accent: '#A855F7',
        glow: 'rgba(168, 85, 247, 0.4)'
    },
    R3: {
        primary: '#93C5FD',
        secondary: '#60A5FA',
        accent: '#3B82F6',
        glow: 'rgba(59, 130, 246, 0.4)'
    },
    R2: {
        primary: '#6EE7B7',
        secondary: '#34D399',
        accent: '#10B981',
        glow: 'rgba(16, 185, 129, 0.4)'
    },
    R1: {
        primary: '#CBD5E1',
        secondary: '#94A3B8',
        accent: '#64748B',
        glow: 'rgba(100, 116, 139, 0.4)'
    }
}

// Enhanced status colors
const statusColors = {
    active: {
        primary: '#4ADE80',
        secondary: '#22C55E',
        accent: '#16A34A',
        glow: 'rgba(34, 197, 94, 0.4)'
    },
    inactive: {
        primary: '#FACC15',
        secondary: '#EAB308',
        accent: '#CA8A04',
        glow: 'rgba(234, 179, 8, 0.4)'
    },
    left: {
        primary: '#60A5FA',
        secondary: '#3B82F6',
        accent: '#2563EB',
        glow: 'rgba(59, 130, 246, 0.4)'
    },
    kicked: {
        primary: '#F87171',
        secondary: '#EF4444',
        accent: '#DC2626',
        glow: 'rgba(239, 68, 68, 0.4)'
    }
}

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
    const baseClasses = 'text-white border-white/20 hover:border-white/30 hover:shadow-xl'

    if (variant === 'role' || variant === 'status') {
        return `${baseClasses} hover:brightness-110`
    }

    return `${baseClasses} bg-slate-600/80 border-slate-500/30`
})

const badgeStyle = computed(() => {
    const getColorConfig = () => {
        if (variant === 'role') {
            return roleColors[label]
        } else if (variant === 'status') {
            return statusColors[label?.toLowerCase()]
        }
        return null
    }

    const colors = getColorConfig()

    if (colors) {
        return {
            background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}30, ${colors.accent}20)`,
            borderColor: `${colors.secondary}40`,
            boxShadow: `0 0 20px ${colors.glow}, 0 4px 15px rgba(0, 0, 0, 0.3)`,
            '--glow-color': colors.glow
        }
    }

    return {
        background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.8), rgba(51, 65, 85, 0.9))',
        borderColor: 'rgba(71, 85, 105, 0.4)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
    }
})
</script>

<style scoped>
/* Enhanced hover glow effect */
span:hover {
    filter: brightness(1.1) saturate(1.1);
    box-shadow:
        0 0 30px var(--glow-color, rgba(71, 85, 105, 0.4)),
        0 8px 25px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Subtle animation for active badges */
@keyframes pulse-glow {

    0%,
    100% {
        box-shadow:
            0 0 20px var(--glow-color, rgba(71, 85, 105, 0.4)),
            0 4px 15px rgba(0, 0, 0, 0.3);
    }

    50% {
        box-shadow:
            0 0 30px var(--glow-color, rgba(71, 85, 105, 0.6)),
            0 6px 20px rgba(0, 0, 0, 0.4);
    }
}

/* Apply pulse animation to active status badges */
span[style*="22C55E"]:not(:hover) {
    animation: pulse-glow 3s ease-in-out infinite;
}
</style>