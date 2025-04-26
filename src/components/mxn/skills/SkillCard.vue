<template>
    <div class="flex flex-col items-center relative rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border backdrop-blur-md overflow-hidden group"
        :style="{ backgroundColor: cardBackground, borderColor: borderColor }">

        <!-- Glow ring on hover -->
        <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"
            :style="{ backgroundColor: glowColor, filter: 'blur(40px)' }" />

        <!-- Badge -->
        <span
            class="absolute top-3 right-3 px-2 py-1 text-[10px] rounded-full font-semibold uppercase tracking-wide z-10"
            :style="{ backgroundColor: badgeBackground, color: badgeText }">
            {{ badgeLabel }}
        </span>

        <!-- Logo -->
        <div
            class="w-16 h-16 flex items-center justify-center rounded-full bg-black/50 border-2 border-white/20 mb-4 overflow-hidden relative z-10">
            <img v-if="logo" :src="logo" alt="Skill Logo" class="w-10 h-10 object-contain" />
            <span v-else class="text-xl font-bold text-white">{{ abbr }}</span>
        </div>

        <!-- Name -->
        <p class="text-sm font-semibold text-center text-white/90 mb-2 relative z-10">{{ name }}</p>

        <!-- Progress Bar -->
        <div class="w-full h-2 bg-black/30 rounded-full overflow-hidden relative z-10">
            <div class="h-full rounded-full animate-glowPulse transition-all duration-1000"
                :style="{ width: progress + '%', backgroundImage: progressGradient }" />
        </div>

    </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
    name: String,
    abbr: String,
    progress: Number,
    baseColor: String,
    logo: String,
    badgeLabel: String
})

// Now safely reference props.baseColor
const cardBackground = computed(() => hexToRgba(props.baseColor, 0.1))
const borderColor = computed(() => props.baseColor)
const badgeBackground = computed(() => hexToRgba(props.baseColor, 0.2))
const badgeText = computed(() => props.baseColor)
const glowColor = computed(() => hexToRgba(props.baseColor, 0.4))
const progressGradient = computed(() => `linear-gradient(to right, ${props.baseColor}, ${darkenHex(props.baseColor, 0.2)})`)

// Small helper functions
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

function darkenHex(hex, amount = 0.2) {
    let [r, g, b] = hexToRgb(hex)
    r = Math.max(0, Math.min(255, r * (1 - amount)))
    g = Math.max(0, Math.min(255, g * (1 - amount)))
    b = Math.max(0, Math.min(255, b * (1 - amount)))
    return `rgb(${r},${g},${b})`
}
</script>


<style scoped>
@keyframes glowPulse {
    0% {
        filter: brightness(0.9) drop-shadow(0 0 2px rgba(255, 255, 255, 0.2));
    }

    50% {
        filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
    }

    100% {
        filter: brightness(0.9) drop-shadow(0 0 2px rgba(255, 255, 255, 0.2));
    }
}

.animate-glowPulse {
    animation: glowPulse 2.5s ease-in-out infinite;
}
</style>