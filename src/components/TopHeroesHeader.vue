<!-- src/components/TopHeroesHeader.vue -->
<template>
    <header class="bg-gray-900 text-white shadow-lg p-4 backdrop-blur-md">
        <nav class="container mx-auto flex flex-col md:flex-row justify-center md:justify-between items-center">
            <h1 @click="navigateTo('/topheroes')"
                class="text-2xl font-bold tracking-wide cursor-pointer text-center sm:text-left w-full sm:w-auto">
                TopHeroes
            </h1>
        </nav>
    </header>
</template>

<script setup>
import router from '@/router.js';

const navigateTo = (path) => {
    router.push(path);
};
</script>