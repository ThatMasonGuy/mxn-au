<template>
    <div class="colour-blob-background w-full bg-gradient-to-b from-gray-950 via-gray-900 to-black" ref="bgContainer">
        <!-- Blobs -->
        <div class="blobs-container absolute inset-0 overflow-hidden pointer-events-none">
            <div v-for="blob in blobs" :key="blob.id" class="blob" :style="{
                width: `${blob.size}px`,
                height: `${blob.size}px`,
                left: `${blob.x}%`,
                top: `${blob.y}%`,
                backgroundColor: blob.color,
                opacity: blob.opacity,
                filter: `blur(${blob.blur}px)`,
                animationDuration: `${blob.animationDuration}s`,
                animationDelay: `${blob.delay}s`,
                transform: `translate(${blob.offsetX}px, ${blob.offsetY}px)`
            }"></div>
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
        default: 3 // ← INCREASED from 1 ➔ 3 blobs per 1000px
    }
})

const bgContainer = ref(null)
const blobs = ref([])
let moveInterval = null
let resizeObserver = null

const blobColors = [
    '#d946ef', '#8b5cf6', '#6366f1', '#10b981', '#f59e0b'
]

const generateBlobs = () => {
    if (!bgContainer.value) return

    const containerHeight = bgContainer.value.scrollHeight
    const actualBlobCount = Math.max(Math.floor((containerHeight / 1000) * props.blobDensity), 12)

    blobs.value = Array.from({ length: actualBlobCount }, (_, i) => ({
        id: `blob-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 300 + 200, // Make blobs slightly bigger too
        color: blobColors[Math.floor(Math.random() * blobColors.length)],
        opacity: Math.random() * 0.3 + 0.1,
        blur: Math.random() * 50 + 30, // Blobs a bit softer
        animationDuration: Math.random() * 12 + 8,
        delay: Math.random() * 5,
        offsetX: 0,
        offsetY: 0
    }))
}

const moveBlobs = () => {
    blobs.value = blobs.value.map(blob => ({
        ...blob,
        offsetX: (Math.random() * 20 - 10),
        offsetY: (Math.random() * 20 - 10)
    }))
}

onMounted(() => {
    generateBlobs()

    moveInterval = setInterval(moveBlobs, 5000)

    resizeObserver = new ResizeObserver(() => {
        generateBlobs()
    })
    if (bgContainer.value) {
        resizeObserver.observe(bgContainer.value)
    }
})

onUnmounted(() => {
    if (moveInterval) clearInterval(moveInterval)
    if (resizeObserver && bgContainer.value) resizeObserver.disconnect()
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
    border-radius: 50%;
    animation: pulseBlob var(--duration, 12s) ease-in-out infinite;
    transition: transform 5s ease-in-out;
    pointer-events: none;
}

@keyframes pulseBlob {

    0%,
    100% {
        transform: scale(1) translate(var(--offsetX, 0px), var(--offsetY, 0px));
        opacity: var(--opacity, 0.2);
    }

    50% {
        transform: scale(1.2) translate(var(--offsetX, 0px), var(--offsetY, 0px));
        opacity: calc(var(--opacity, 0.2) * 1.5);
    }
}
</style>