<!-- src/components/NavCard.vue -->
<template>
    <div
        class="relative group w-full max-w-sm rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
        <!-- Image with Zoom Effect -->
        <div class="h-64 rounded-b-3xl overflow-hidden">
            <img :src="image" :alt="title"
                class="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105" />
        </div>

        <!-- Title Overlay -->
        <div
            class="absolute top-4 left-4 bg-black bg-opacity-60 text-white text-lg font-bold px-4 py-2 rounded-md backdrop-blur-sm">
            {{ title }}
        </div>

        <!-- Gradient Blur with Navigation Text -->
        <div
            class="absolute rounded-b-lg bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-md">
            <p class="text-white text-sm font-medium line-clamp-2">{{ text }}</p>
        </div>

        <!-- Hover Trigger Area -->
        <div class="absolute inset-0 group-hover:bg-transparent"></div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
});
</script>

<style scoped>
/* Ensure text truncates after two lines */
p {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>