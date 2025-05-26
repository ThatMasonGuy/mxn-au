<template>
    <component :is="!disabled ? 'RouterLink' : 'div'" :to="!disabled ? link : undefined"
        class="group relative block rounded-2xl p-5 transition-all duration-300 border shadow-lg backdrop-blur-md overflow-hidden"
        :class="[
            disabled ? 'pointer-events-none opacity-50 grayscale' : 'hover:shadow-xl',
        ]" :style="{ backgroundColor: cardBg, borderColor: cardBorder }">
        <!-- Glow on hover -->
        <div class="absolute inset-0 z-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"
            :style="{ backgroundColor: glowColor, filter: 'blur(40px)' }" />

        <!-- Top-right badges -->
        <div v-if="badges?.length" class="absolute top-3 right-3 z-10 flex flex-wrap gap-1 justify-end">
            <BadgeComponent v-for="(badge, i) in badges" :key="i" v-bind="badge" />
        </div>

        <!-- Icon -->
        <div v-if="icon"
            class="w-10 h-10 mb-4 flex items-center justify-center rounded-lg bg-black/30 border border-white/20 z-10">
            <component :is="icon" class="w-5 h-5 text-white" />
        </div>

        <!-- Title -->
        <h3 class="text-lg font-semibold text-white mb-1 z-10 relative">
            {{ title }}
        </h3>

        <!-- Byline -->
        <p class="text-sm text-white/70 z-10 relative leading-snug">
            {{ byline }}
        </p>

        <!-- Optional footer slot -->
        <div v-if="$slots.footer" class="pt-4 text-xs mt-4 text-white/50 border-t border-white/10">
            <slot name="footer" />
        </div>
    </component>
</template>

<script setup>
import { computed } from 'vue'
import BadgeComponent from '@/components/everhomes/ui/BadgeComponent.vue'

const props = defineProps({
    title: String,
    byline: String,
    icon: [Object, Function],
    link: { type: String, default: '#' },
    colorHex: { type: String, default: '#6366f1' }, // default: indigo-500
    badges: { type: Array, default: () => [] }, // Array of props for BadgeComponent
    disabled: { type: Boolean, default: false }
})

const cardBg = computed(() => hexToRgba(props.colorHex, 0.08))
const cardBorder = computed(() => props.colorHex)
const glowColor = computed(() => hexToRgba(props.colorHex, 0.25))

function hexToRgba(hex, alpha = 1) {
    const [r, g, b] = hexToRgb(hex)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function hexToRgb(hex) {
    const stripped = hex.replace('#', '')
    const bigint = parseInt(stripped, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return [r, g, b]
}
</script>

<style scoped>
/* You can add shared animation classes here if needed */
</style>