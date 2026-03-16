<template>
    <div class="noise-background" :style="cssVars">
        <div class="noise-layer"></div>
        <div class="gradient-overlay"></div>
        
        <div class="relative z-10">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    baseColor: { type: String, default: '#0f172a' }, // slate-900
    accentColor: { type: String, default: '#7c3aed' }, // purple
    noiseOpacity: { type: Number, default: 0.05 }
})

const cssVars = computed(() => ({
    '--base-color': props.baseColor,
    '--accent-color': props.accentColor,
    '--noise-opacity': props.noiseOpacity
}))
</script>

<style scoped>
.noise-background {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background-color: var(--base-color);
    overflow: hidden;
}

/* CSS noise pattern - super lightweight alternative to SVG */
.noise-layer {
    position: absolute;
    inset: 0;
    opacity: var(--noise-opacity);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.gradient-overlay {
    position: absolute;
    inset: 0;
    background: 
        radial-gradient(ellipse at top left, var(--accent-color), transparent 40%),
        radial-gradient(ellipse at bottom right, var(--accent-color), transparent 40%);
    opacity: 0.15;
    animation: gradientShift 15s ease-in-out infinite alternate;
}

@keyframes gradientShift {
    0% {
        opacity: 0.1;
    }
    100% {
        opacity: 0.2;
    }
}

@media (prefers-reduced-motion: reduce) {
    .gradient-overlay {
        animation: none;
    }
}
</style>
