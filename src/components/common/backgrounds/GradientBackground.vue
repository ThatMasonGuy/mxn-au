<template>
    <div class="relative w-full min-h-screen overflow-hidden">
        <!-- Background Layers -->
        <div class="absolute inset-0 bg-gradient-upgrade opacity-60 animate-backgroundMove pointer-events-none"
            :style="gradientStyle" />
        <div class="absolute inset-0 mist-layer pointer-events-none" />
        <div v-for="n in particleCount" :key="n" class="absolute rounded-full animate-float pointer-events-none"
            :style="[getParticleStyle(), particleColorStyle]" />

        <!-- Actual Page Content -->
        <div class="relative z-10">
            <slot />
        </div>
    </div>
</template>


<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    hue: {
        type: Number,
        default: 330 // Default pink/fuchsia hue
    },
    particleCount: {
        type: Number,
        default: 30
    }
})

// Generate HSL colors based on the hue
const gradientStyle = computed(() => {
    return {
        background: `linear-gradient(135deg,
        hsla(${props.hue}, 72%, 60%, 0.2),
        hsla(${(props.hue + 60) % 360}, 72%, 66%, 0.15),
        hsla(${(props.hue + 120) % 360}, 72%, 60%, 0.2),
        hsla(${(props.hue + 60) % 360}, 72%, 66%, 0.15),
        hsla(${props.hue}, 72%, 60%, 0.2))`
    }
})

const particleColorStyle = computed(() => {
    return {
        backgroundColor: `hsla(${props.hue}, 72%, 60%, 0.1)`
    }
})

const getParticleStyle = () => {
    const size = Math.floor(Math.random() * 4) + 2
    const x = Math.random() * 100
    const y = Math.random() * 100
    const duration = Math.random() * 40 + 20
    const delay = Math.random() * 5
    return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}%`,
        top: `${y}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`
    }
}
</script>

<style scoped>
@keyframes backgroundMove {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.animate-backgroundMove {
    background-size: 600% 600%;
    animation: backgroundMove 60s ease infinite;
}

/* Floating particle tweaks */
@keyframes float {
    0% {
        transform: translateY(0) translateX(0);
        opacity: 0;
    }

    10% {
        opacity: 0.7;
    }

    90% {
        opacity: 0.5;
    }

    100% {
        transform: translateY(-100vh) translateX(20px);
        opacity: 0;
    }
}

.animate-float {
    animation: float linear infinite;
}

/* Slight white mist / fog layer */
.mist-layer {
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.05), transparent 70%);
    backdrop-filter: blur(60px);
}
</style>