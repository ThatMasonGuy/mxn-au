<template>
    <div class="scanline-background" :style="cssVars">
        <div class="scanlines"></div>
        <div class="vignette"></div>
        
        <div class="relative z-10">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    primaryColor: { type: String, default: '#10b981' },
    scanlineSpeed: { type: Number, default: 10 },
    glowIntensity: { type: Number, default: 0.15 }
})

const cssVars = computed(() => {
    // Convert hex to rgb for use in rgba
    const hex = props.primaryColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    return {
        '--primary-color': props.primaryColor,
        '--primary-r': r,
        '--primary-g': g,
        '--primary-b': b,
        '--scanline-speed': `${props.scanlineSpeed}s`,
        '--glow-intensity': props.glowIntensity
    }
})
</script>

<style scoped>
.scanline-background {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: #0a0a0a;
    overflow: hidden;
}

/* Background glow using CSS variables */
.scanline-background::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
        radial-gradient(ellipse at top, rgba(var(--primary-r), var(--primary-g), var(--primary-b), var(--glow-intensity)), transparent 60%),
        radial-gradient(ellipse at bottom, rgba(var(--primary-r), var(--primary-g), var(--primary-b), calc(var(--glow-intensity) * 0.7)), transparent 60%);
    pointer-events: none;
}

/* Horizontal scanlines */
.scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.15) 2px,
        rgba(0, 0, 0, 0.15) 4px
    );
    pointer-events: none;
}

/* Moving scan effect */
.scanlines::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
        to bottom,
        transparent 0%,
        rgba(var(--primary-r), var(--primary-g), var(--primary-b), 0.3) 50%,
        transparent 100%
    );
    opacity: 0.4;
    height: 100%;
    animation: scan var(--scanline-speed) linear infinite;
}

/* Vignette effect */
.vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
    pointer-events: none;
}

@keyframes scan {
    0% {
        transform: translateY(-100%);
    }
    100% {
        transform: translateY(100%);
    }
}

@media (prefers-reduced-motion: reduce) {
    .scanlines::after {
        animation: none;
    }
}
</style>