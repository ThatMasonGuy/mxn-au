<template>
    <div class="relative w-full min-h-screen overflow-hidden bg-gray-950">
        <!-- Simplified Background Gradient -->
        <div 
            class="absolute inset-0 gradient-layer pointer-events-none"
            :style="gradientStyle" 
        />
        
        <!-- Lighter mist layer without backdrop-filter -->
        <div class="absolute inset-0 mist-layer pointer-events-none" />
        
        <!-- Reduced particle count -->
        <div 
            v-for="n in particleCount" 
            :key="n" 
            class="particle pointer-events-none"
            :style="getParticleStyle()"
        />

        <!-- Actual Page Content -->
        <div class="relative z-10">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    hue: {
        type: Number,
        default: 330 // Default pink/fuchsia hue
    },
    particleCount: {
        type: Number,
        default: 12 // Reduced from 30
    }
})

// Simplified gradient
const gradientStyle = computed(() => {
    return {
        background: `radial-gradient(ellipse at top, 
            hsla(${props.hue}, 70%, 55%, 0.15) 0%,
            hsla(${(props.hue + 60) % 360}, 70%, 60%, 0.1) 40%,
            transparent 80%),
        radial-gradient(ellipse at bottom right,
            hsla(${(props.hue + 120) % 360}, 70%, 55%, 0.12) 0%,
            transparent 60%)`
    }
})

const getParticleStyle = () => {
    const size = Math.floor(Math.random() * 3) + 2
    const x = Math.random() * 100
    const y = Math.random() * 100
    const duration = Math.random() * 30 + 20
    const delay = Math.random() * 10
    
    return {
        '--size': `${size}px`,
        '--x': `${x}%`,
        '--y': `${y}%`,
        '--duration': `${duration}s`,
        '--delay': `${delay}s`,
        '--color': `hsla(${props.hue}, 70%, 60%, 0.08)`
    }
}
</script>

<style scoped>
.gradient-layer {
    opacity: 0.7;
}

/* Simplified mist without backdrop-filter */
.mist-layer {
    background: radial-gradient(
        ellipse at 50% 30%, 
        rgba(255, 255, 255, 0.03) 0%,
        rgba(255, 255, 255, 0.01) 50%,
        transparent 80%
    );
}

.particle {
    position: absolute;
    width: var(--size);
    height: var(--size);
    left: var(--x);
    top: var(--y);
    background-color: var(--color);
    border-radius: 50%;
    animation: float var(--duration) linear infinite;
    animation-delay: var(--delay);
    will-change: transform, opacity;
    /* GPU acceleration */
    transform: translateZ(0);
}

@keyframes float {
    0% {
        transform: translateY(0) translateX(0) translateZ(0);
        opacity: 0;
    }
    10% {
        opacity: 0.6;
    }
    90% {
        opacity: 0.3;
    }
    100% {
        transform: translateY(-100vh) translateX(15px) translateZ(0);
        opacity: 0;
    }
}
</style>