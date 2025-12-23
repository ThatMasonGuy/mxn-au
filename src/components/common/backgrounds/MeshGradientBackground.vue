<template>
    <div class="mesh-background" :style="cssVars">
        <div class="relative z-10">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    color1: { type: String, default: '#1e1b4b' },
    color2: { type: String, default: '#312e81' },
    color3: { type: String, default: '#7c3aed' },
    color4: { type: String, default: '#c026d3' },
    animated: { type: Boolean, default: true }
})

const cssVars = computed(() => ({
    '--color1': props.color1,
    '--color2': props.color2,
    '--color3': props.color3,
    '--color4': props.color4
}))
</script>

<style scoped>
.mesh-background {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: #0a0a0a;
    overflow: hidden;
}

.mesh-background::before {
    content: '';
    position: absolute;
    inset: -50%;
    background: 
        radial-gradient(circle at 20% 20%, var(--color1), transparent 25%),
        radial-gradient(circle at 80% 20%, var(--color2), transparent 25%),
        radial-gradient(circle at 80% 80%, var(--color3), transparent 25%),
        radial-gradient(circle at 20% 80%, var(--color4), transparent 25%);
    filter: blur(60px);
    opacity: 0.6;
    animation: meshFloat 20s ease-in-out infinite;
}

@keyframes meshFloat {
    0%, 100% {
        transform: translate(0, 0) rotate(0deg);
    }
    33% {
        transform: translate(5%, 5%) rotate(5deg);
    }
    66% {
        transform: translate(-5%, 3%) rotate(-5deg);
    }
}

@media (prefers-reduced-motion: reduce) {
    .mesh-background::before {
        animation: none;
    }
}
</style>