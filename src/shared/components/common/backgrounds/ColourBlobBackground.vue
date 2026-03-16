<template>
    <div class="colour-blob-background w-full bg-gradient-to-b from-gray-950 via-gray-900 to-black" ref="bgContainer">
        <!-- Blobs -->
        <div class="blobs-container absolute inset-0 overflow-hidden pointer-events-none">
            <div 
                v-for="blob in blobs" 
                :key="blob.id" 
                class="blob" 
                :style="{
                    '--size': `${blob.size}px`,
                    '--x': `${blob.x}%`,
                    '--y': `${blob.y}%`,
                    '--color': blob.color,
                    '--opacity': blob.opacity,
                    '--blur': `${blob.blur}px`,
                    '--duration': `${blob.animationDuration}s`,
                    '--delay': `${blob.delay}s`
                }"
            ></div>
        </div>

        <!-- Page Content -->
        <div class="relative z-10">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    blobDensity: {
        type: Number,
        default: 1 // Reduced from 3
    }
})

const bgContainer = ref(null)
const blobs = ref([])
let resizeTimeout = null

const blobColors = [
    '#d946ef', '#8b5cf6', '#6366f1', '#10b981', '#f59e0b'
]

const generateBlobs = () => {
    if (!bgContainer.value) return

    const containerHeight = bgContainer.value.scrollHeight
    // Reduced blob count - max 6 blobs
    const actualBlobCount = Math.min(Math.max(Math.floor((containerHeight / 1000) * props.blobDensity), 3), 6)

    blobs.value = Array.from({ length: actualBlobCount }, (_, i) => ({
        id: `blob-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 250 + 150,
        color: blobColors[Math.floor(Math.random() * blobColors.length)],
        opacity: Math.random() * 0.25 + 0.08,
        blur: Math.random() * 30 + 15, // Reduced blur significantly (was 30-80, now 15-45)
        animationDuration: Math.random() * 15 + 10,
        delay: Math.random() * 5
    }))
}

// Debounced resize handler
const handleResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(generateBlobs, 300)
}

onMounted(() => {
    generateBlobs()

    // Use ResizeObserver with debouncing
    const resizeObserver = new ResizeObserver(handleResize)
    if (bgContainer.value) {
        resizeObserver.observe(bgContainer.value)
    }

    onUnmounted(() => {
        if (resizeTimeout) clearTimeout(resizeTimeout)
        resizeObserver.disconnect()
    })
})
</script>

<style scoped>
.colour-blob-background {
    position: relative;
    width: 100%;
    min-height: 100%;
}

.blobs-container {
    z-index: 0;
    position: absolute;
}

.blob {
    position: absolute;
    width: var(--size);
    height: var(--size);
    left: var(--x);
    top: var(--y);
    background-color: var(--color);
    opacity: var(--opacity);
    filter: blur(var(--blur));
    border-radius: 50%;
    animation: pulseBlob var(--duration) ease-in-out infinite;
    animation-delay: var(--delay);
    pointer-events: none;
    will-change: transform, opacity;
    /* GPU acceleration */
    transform: translateZ(0);
}

@keyframes pulseBlob {
    0%, 100% {
        transform: scale(1) translateZ(0);
        opacity: var(--opacity);
    }
    50% {
        transform: scale(1.15) translateZ(0);
        opacity: calc(var(--opacity) * 1.3);
    }
}
</style>