<template>
    <div class="wave-background" :style="cssVars">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
        
        <div class="relative z-10">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    primaryColor: { type: String, default: 'rgba(147, 51, 234, 0.3)' },
    secondaryColor: { type: String, default: 'rgba(236, 72, 153, 0.3)' },
    tertiaryColor: { type: String, default: 'rgba(59, 130, 246, 0.3)' }
})

const cssVars = computed(() => ({
    '--primary-color': props.primaryColor,
    '--secondary-color': props.secondaryColor,
    '--tertiary-color': props.tertiaryColor
}))
</script>

<style scoped>
.wave-background {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(to bottom, #0a0a0a, #1a1a1a);
    overflow: hidden;
}

.wave {
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    border-radius: 40%;
    opacity: 0.8;
}

.wave1 {
    background: radial-gradient(circle, var(--primary-color), transparent 70%);
    animation: wave 25s ease-in-out infinite;
}

.wave2 {
    background: radial-gradient(circle, var(--secondary-color), transparent 70%);
    animation: wave 30s ease-in-out infinite reverse;
    animation-delay: -5s;
}

.wave3 {
    background: radial-gradient(circle, var(--tertiary-color), transparent 70%);
    animation: wave 35s ease-in-out infinite;
    animation-delay: -10s;
}

@keyframes wave {
    0%, 100% {
        transform: translate(0%, 0%) rotate(0deg);
    }
    33% {
        transform: translate(10%, 10%) rotate(120deg);
    }
    66% {
        transform: translate(-10%, 5%) rotate(240deg);
    }
}

@media (prefers-reduced-motion: reduce) {
    .wave {
        animation: none;
    }
}
</style>