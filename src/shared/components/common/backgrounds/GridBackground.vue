<template>
    <div class="grid-background" :style="cssVars">
        <div class="grid-pattern"></div>
        <div class="grid-glow"></div>
        
        <div class="relative z-10">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    gridSize: { type: Number, default: 40 }, // px
    gridColor: { type: String, default: 'rgba(147, 51, 234, 0.15)' },
    glowColor: { type: String, default: 'rgba(147, 51, 234, 0.2)' },
    animated: { type: Boolean, default: true }
})

const cssVars = computed(() => ({
    '--grid-size': `${props.gridSize}px`,
    '--grid-color': props.gridColor,
    '--glow-color': props.glowColor
}))
</script>

<style scoped>
.grid-background {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: #0a0a0a;
    overflow: hidden;
}

.grid-pattern {
    position: absolute;
    inset: 0;
    background-image: 
        linear-gradient(var(--grid-color) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
    background-size: var(--grid-size) var(--grid-size);
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 80%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 80%);
}

.grid-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, var(--glow-color) 0%, transparent 60%);
    animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 0.5;
        transform: scale(1);
    }
    50% {
        opacity: 0.8;
        transform: scale(1.05);
    }
}

@media (prefers-reduced-motion: reduce) {
    .grid-glow {
        animation: none;
    }
}
</style>
