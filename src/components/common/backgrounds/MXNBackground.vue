<template>
    <div class="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-black">
        
        <!-- Animated Gradient Blobs -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
                v-for="blob in blobs" 
                :key="blob.id"
                class="absolute rounded-full blur-3xl opacity-20 animate-float"
                :style="{
                    width: blob.size,
                    height: blob.size,
                    left: blob.x,
                    top: blob.y,
                    background: blob.gradient,
                    animationDuration: blob.duration,
                    animationDelay: blob.delay
                }"
            />
        </div>

        <!-- Subtle Grid Pattern -->
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none"
            style="background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 50px 50px;">
        </div>

        <!-- Content -->
        <div class="relative z-10">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const blobs = ref([
    {
        id: 1,
        size: '600px',
        x: '10%',
        y: '20%',
        gradient: 'radial-gradient(circle, rgba(139, 92, 246, 0.6), rgba(139, 92, 246, 0))',
        duration: '25s',
        delay: '0s'
    },
    {
        id: 2,
        size: '500px',
        x: '60%',
        y: '10%',
        gradient: 'radial-gradient(circle, rgba(236, 72, 153, 0.5), rgba(236, 72, 153, 0))',
        duration: '30s',
        delay: '5s'
    },
    {
        id: 3,
        size: '550px',
        x: '80%',
        y: '60%',
        gradient: 'radial-gradient(circle, rgba(99, 102, 241, 0.55), rgba(99, 102, 241, 0))',
        duration: '28s',
        delay: '10s'
    },
    {
        id: 4,
        size: '450px',
        x: '20%',
        y: '70%',
        gradient: 'radial-gradient(circle, rgba(168, 85, 247, 0.5), rgba(168, 85, 247, 0))',
        duration: '32s',
        delay: '3s'
    },
    {
        id: 5,
        size: '400px',
        x: '50%',
        y: '50%',
        gradient: 'radial-gradient(circle, rgba(217, 70, 239, 0.45), rgba(217, 70, 239, 0))',
        duration: '35s',
        delay: '7s'
    }
])
</script>

<style scoped>
@keyframes float {
    0%, 100% {
        transform: translate(0, 0) scale(1);
    }
    33% {
        transform: translate(30px, -30px) scale(1.1);
    }
    66% {
        transform: translate(-20px, 20px) scale(0.9);
    }
}

.animate-float {
    animation: float linear infinite;
}
</style>