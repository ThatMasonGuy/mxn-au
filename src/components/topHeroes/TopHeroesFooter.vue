<!-- src/components/TopHeroesFooter.vue -->
<template>
    <footer class="bg-gray-900 text-gray-300 text-sm p-6 shadow-inner backdrop-blur-md">
        <div class="flex flex-col md:flex-row items-center md:justify-center space-y-2 md:space-y-0 gap-2">
            <p @click="navigateTo('/topheroes/admin')" class="cursor-pointer underline order-2 md:order-1 md:mr-auto">
                Nerds
            </p>

            <p class="order-1 md:order-2 flex-1 text-center">
                Website built by Nerds in [VLR] S10154
            </p>
        </div>
    </footer>
</template>

<script setup>
import router from '@/router.js';

const navigateTo = (path) => {
    router.push(path);
};
</script>