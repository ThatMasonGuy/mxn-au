<template>
    <div class="relative cursor-pointer rounded-2xl p-4 border transition-[box-shadow,background,opacity,filter] duration-300
             bg-slate-900/70 backdrop-blur-sm" @click="openProfile" @mouseenter="hovered = true"
        @mouseleave="hovered = false" :class="{
            'opacity-60 grayscale': member.status !== 'active',
            'border-slate-800': !highlightColor
        }" :style="cardStyle">
        <!-- Animated edge glow (no scale, just light) -->
        <div class="pointer-events-none absolute inset-0 rounded-2xl" :style="edgeGlowStyle"></div>

        <!-- Soft inner color wash (subtle) -->
        <div class="pointer-events-none absolute inset-0 rounded-2xl mix-blend-screen" :style="innerWashStyle"></div>

        <!-- Top-right lock -->
        <div v-if="member.locked" class="absolute top-2 right-2">
            <Lock class="w-5 h-5 drop-shadow"
                :style="{ color: highlightColor || '#f59e0b', filter: 'drop-shadow(0 0 6px rgba(0,0,0,.35))' }"
                aria-label="Locked member" />
        </div>

        <!-- Content -->
        <div class="relative flex justify-between items-start gap-3">
            <!-- Left: name / meta / role -->
            <div class="space-y-1 min-w-0">
                <div class="text-lg font-bold truncate tracking-tight"
                    :style="{ textShadow: '0 0 8px rgba(255,255,255,0.06)' }">
                    {{ member.name }}
                </div>

                <div class="text-xs text-slate-400/90 whitespace-nowrap">
                    Power:
                    <span class="text-slate-200/90">{{ formatPower(member.power) }}</span>
                    <span class="mx-1 text-slate-600">•</span>
                    Castle:
                    <span class="text-slate-200/90">{{ member.castle }}</span>
                </div>

                <div class="pt-1">
                    <Badge :label="member.role" variant="role" />
                </div>
            </div>

            <!-- Right: status -->
            <div class="shrink-0 -ml-1">
                <Badge :label="member.status.toUpperCase()" variant="status" />
            </div>
        </div>

        <!-- Notes -->
        <div v-if="member.notes" class="text-xs italic mt-3 text-slate-400/90 truncate">
            {{ member.notes }}
        </div>

        <!-- Subtle diagonal shimmer on hover (no scale) -->
        <div v-if="hovered" class="pointer-events-none absolute -inset-1 rounded-2xl" :style="shimmerStyle"></div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Lock } from 'lucide-vue-next'
import Badge from './Badge.vue'

const props = defineProps({ member: { type: Object, required: true } })
const emit = defineEmits(['view'])

const hovered = ref(false)
const openProfile = () => emit('view', props.member)

const formatPower = (n) =>
    Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

const roleColorMap = {
    R5: '#FFD700', // Gold
    R4: '#A855F7', // Purple
    R3: '#3B82F6', // Blue
    R2: '#10B981', // Green
    R1: '#64748B', // Slate-500
}

const highlightColor = computed(() => roleColorMap[props.member.role] || null)

/**
 * Core glow/shadow logic — no scaling; all “pop” comes from light and blur.
 */
const cardStyle = computed(() => {
    const c = highlightColor.value
    if (!c) return {}
    const alpha = hovered.value ? 0.55 : 0.35
    const soft = `${c}${Math.round(alpha * 255).toString(16).padStart(2, '0')}` // hex with alpha
    return {
        borderColor: c,
        boxShadow: [
            `0 0 ${hovered.value ? 18 : 8}px ${soft}`,
            `inset 0 0 16px ${c}22`,
        ].join(', '),
    }
})

/**
 * Subtle colored edge halo
 */
const edgeGlowStyle = computed(() => {
    const c = highlightColor.value
    if (!c) return { boxShadow: '0 0 0 rgba(0,0,0,0)' }
    const outer = hovered.value ? 0.25 : 0.15
    return {
        boxShadow: `0 0 ${hovered.value ? 28 : 18}px ${hexWithAlpha(c, outer)}`,
    }
})

/**
 * Inner wash that lightly tints the card content (mix-blend-screen keeps it tasteful)
 */
const innerWashStyle = computed(() => {
    const c = highlightColor.value || '#6366f1' // default indigo if no role color
    const wash = hovered.value ? 0.08 : 0.05
    return {
        background: `radial-gradient(120% 120% at 10% 0%, ${hexWithAlpha(c, wash)} 0%, transparent 65%)`,
    }
})

/**
 * Soft diagonal shimmer band on hover — relies on opacity, not scale
 */
const shimmerStyle = computed(() => {
    const c = highlightColor.value || '#ffffff'
    const a = hovered.value ? 0.10 : 0.0
    return {
        background: `linear-gradient(120deg, transparent 20%, ${hexWithAlpha(c, a)} 45%, transparent 70%)`,
        transition: 'opacity 300ms ease',
        opacity: hovered.value ? 1 : 0,
        filter: 'blur(6px)',
    }
})

function hexWithAlpha(hex, alpha = 1) {
    // Accepts #RRGGBB (or #RGB) and returns rgba()
    const h = hex.replace('#', '')
    const isShort = h.length === 3
    const r = parseInt(isShort ? h[0] + h[0] : h.slice(0, 2), 16)
    const g = parseInt(isShort ? h[1] + h[1] : h.slice(2, 4), 16)
    const b = parseInt(isShort ? h[2] + h[2] : h.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
</script>

<style scoped>
/* Keep transitions crisp and avoid layout jank */
</style>