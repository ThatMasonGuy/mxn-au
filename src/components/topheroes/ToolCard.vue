<template>
    <component :is="link && !disabled ? 'RouterLink' : 'div'" :to="!disabled ? link : null"
        class="group block relative">
        <div :class="[
            'relative overflow-hidden rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out',
            colorClass,
            hoverClass,
            disabled ? 'opacity-40 grayscale pointer-events-none hover:shadow-none hover:border-none' : ''
        ]">
            <!-- Optional image -->
            <div v-if="image" class="absolute inset-0 z-0 rounded-2xl overflow-hidden">
                <img :src="image" class="w-full h-full object-cover brightness-90" />
                <div :class="['absolute inset-0', gradientOverlayClass]" />
            </div>

            <!-- Badges -->
            <div v-if="badgesToRender.length" class="absolute top-4 right-4 z-20 flex flex-wrap gap-2 justify-end">
                <span v-for="(badge, i) in badgesToRender" :key="i" :class="[
                    'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-sm backdrop-blur',
                    getBadgeClass(badge),
                    getBadgeAnimationClass(badge)
                ]" :style="getBadgeGlowStyle(badge)">
                    {{ typeof badge === 'string' ? badge : badge.label }}
                </span>
            </div>

            <!-- Main content -->
            <div class="relative z-10 space-y-4 p-4 rounded-xl backdrop-blur-sm" :class="contentOverlayClass">
                <div v-if="icon" class="p-3 rounded-lg inline-block shadow-md" :class="iconBackgroundClass">
                    <component :is="icon" class="w-7 h-7 drop-shadow" :class="iconColorClass" />
                </div>
                <h3 class="text-xl font-extrabold tracking-tight drop-shadow-lg text-amber-200">
                    {{ title }}
                </h3>
                <p class="text-gray-300 text-sm leading-relaxed drop-shadow-md">
                    {{ desc }}
                </p>

                <div v-if="$slots.footer" class="pt-4 border-t border-white/10 text-sm" :class="footerAlignClass">
                    <slot name="footer" />
                </div>
            </div>

            <!-- Glow underline -->
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-4/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                :class="glowUnderlineClass" />
        </div>
    </component>
</template>

<script setup>
import { computed } from 'vue'
import { resolveTailwindHexFromClasses } from '@/utils/useTailwindHexMap.js'

const props = defineProps({
    icon: [Object, Function],
    title: String,
    desc: String,
    link: { type: String, default: null },
    image: String,
    badge: [String, Object],
    badges: Array,
    badgeStyles: Object,
    disabled: Boolean,
    colorClass: {
        type: String,
        default: 'bg-white/5 border-fuchsia-500/30 hover:shadow-fuchsia-500/40 hover:border-fuchsia-500/70'
    },
    gradientOverlayClass: {
        type: String,
        default: 'bg-gradient-to-t from-black/60 via-black/40 to-transparent'
    },
    contentOverlayClass: {
        type: String,
        default: 'bg-black/30'
    },
    iconColorClass: {
        type: String,
        default: 'text-fuchsia-300'
    },
    iconBackgroundClass: {
        type: String,
        default: 'bg-gradient-to-br from-fuchsia-700/40 to-purple-700/40'
    },
    footerAlign: {
        type: String,
        default: 'left',
        validator: val => ['left', 'right'].includes(val)
    },
    glowUnderlineClass: {
        type: String,
        default: 'bg-gradient-to-r from-purple-400 via-fuchsia-500 to-amber-400'
    }
})

const hoverClass = 'hover:shadow-lg transition-all'

const footerAlignClass = computed(() => {
    return props.footerAlign === 'right' ? 'text-right text-amber-200' : 'text-left text-amber-200'
})

const badgesToRender = computed(() => {
    if (props.badges && props.badges.length > 0) return props.badges
    if (props.badge) return [props.badge]
    return []
})

function getBadgeClass(badge) {
    const label = typeof badge === 'string' ? badge : badge.label
    if (props.badgeStyles?.[label]) return props.badgeStyles[label]

    switch (label) {
        case 'New!':
            return 'bg-green-500/30 text-green-300 border-green-300/40'
        case 'Coming Soon':
            return 'bg-amber-500/30 text-amber-300 border-amber-300/40'
        case 'Removed':
            return 'bg-red-500/30 text-red-300 border-red-300/40'
        default:
            return 'bg-white/10 text-white border-white/20'
    }
}

function getBadgeAnimationClass(badge) {
    const label = typeof badge === 'string' ? badge : badge.label
    const forceGlow = label === 'New!'

    if (typeof badge === 'object' || forceGlow) {
        const classes = []
        if (forceGlow || badge.glow) classes.push('glow-dynamic')
        if (badge?.pulse || badge?.animate) classes.push('animate-pulse')
        return classes.join(' ')
    }
    return ''
}

function getBadgeGlowStyle(badge) {
    const label = typeof badge === 'string' ? badge : badge.label
    const forceGlow = label === 'New!'

    if ((typeof badge === 'object' && badge.glow) || forceGlow) {
        const styleClass = props.badgeStyles?.[label] || getBadgeClass(badge)
        const hex = resolveTailwindHexFromClasses(styleClass) || '#22c55e'
        return {
            '--glow-color': hex
        }
    }
    return {}
}
</script>

<style scoped>
@keyframes glow-dynamic {

    0%,
    100% {
        box-shadow: 0 0 6px var(--glow-color), 0 0 12px var(--glow-color);
    }

    50% {
        box-shadow: 0 0 10px var(--glow-color), 0 0 16px var(--glow-color);
    }
}

.glow-dynamic {
    animation: glow-dynamic 2s ease-in-out infinite;
    --glow-color: #22c55e;
}
</style>