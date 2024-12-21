<!-- src/components/TopHeroesFooter.vue -->
<template>
    <footer class="bg-gray-900 text-gray-300 text-sm p-6 mt-10 shadow-inner backdrop-blur-md">
        <p class="text-center">Website built by Mason for VLR in S10154</p>
    </footer>
</template>

<script setup>
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>