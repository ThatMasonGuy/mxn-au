<!-- src/pages/topHeroes/TH_LandingPage.vue -->
<template>
    <div class="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative">
        <div class="absolute inset-0 bg-gray-800 opacity-60 backdrop-blur-lg z-0"></div>
        <main class="flex-grow container mx-auto px-4 py-8 z-10">
            <h1 class="text-4xl font-bold text-center mb-12">TopHeroes Assistant</h1>
            <div class="flex justify-center">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <NavCard @click="navigateTo('/topheroes/speedups')"
                        :image="TopHeroesBanner" title="Speed-up Calculator"
                        text="Find out how many speed-ups you have." />

                    <NavCard @click="navigateTo('/topheroes/events')"
                        :image="DarkEmpireInvasion" title="Event Guides"
                        text="Learn tips and tricks to beat even the toughest events." />

                    <NavCard :comingSoon="true" :image="TopHeroes_2"
                        title="Team Builder" text="Build the best team you can, personalised to you." />

                    <NavCard :comingSoon="true" :image="TopHeroes_1" title="Resource Calculator"
                        text="Not sure if you have enough for that upgrade?" />
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import router from '@/router.js';
import NavCard from '@/components/topHeroes/NavCard.vue';

import TopHeroes_1 from '@/assets/topHeroes/TopHeroes_1.jpg';
import TopHeroes_2 from '@/assets/topHeroes/TopHeroes_2.jpg';
import DarkEmpireInvasion from '@/assets/topHeroes/DarkEmpireInvasion.jpg';
import TopHeroesBanner from '@/assets/topHeroes/TopHeroesBanner.jpg';

const navigateTo = (path) => {
    router.push(path);
};
</script>