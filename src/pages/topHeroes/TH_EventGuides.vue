<!-- src/pages/topHeroes/TH_EventGuides.vue -->
<template>
    <!-- Page wrapper fills screen space -->
    <div class="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative">
        <!-- Dark overlay with blur -->
        <div class="absolute inset-0 bg-gray-800 opacity-60 backdrop-blur-lg z-0"></div>

        <!-- Main content -->
        <main class="flex-grow container mx-auto px-4 z-10">
            <h1 class="text-4xl font-bold text-center mb-12">Event Guides</h1>

            <div class="flex justify-center">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <NavCard @click="navigateTo('/topheroes/events/dark-empire-invasion')" :image="DarkEmpireInvasion"
                        title="Dark Empire Invasion" text="Find out how many speed-ups you have." />

                    <NavCard @click="navigateTo('/topheroes/events/kvk')" :image="KingdomDuels" title="Kingdom Duels"
                        text="Build the best team you can, personalised to you." />

                    <NavCard @click="navigateTo('/topheroes/events/guild-race')" :image="TopHeroesBanner" title="Guild Race"
                        text="Learn tips and tricks to beat even the toughest events." />

                    <NavCard :comingSoon="true" :image="AncientBattlefield" title="Ancient Battlefield"
                        text="Not sure if you have enough for that upgrade?" />

                    <NavCard :comingSoon="true" :image="GuildBoss" title="Guild Boss"
                        text="Learn tips and tricks to beat even the toughest events." />

                    <NavCard :comingSoon="true" :image="FortContest" title="Fort Contest"
                        text="Learn tips and tricks to beat even the toughest events." />
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import router from '@/router.js';
import NavCard from '@/components/topHeroes/NavCard.vue';

import DarkEmpireInvasion from '@/assets/topHeroes/DarkEmpireInvasion.jpg';
import KingdomDuels from '@/assets/topHeroes/KingdomDuels.jpg';
import TopHeroesBanner from '@/assets/topHeroes/TopHeroesBanner.jpg';
import AncientBattlefield from '@/assets/topHeroes/AncientBattlefield.jpg';
import GuildBoss from '@/assets/topHeroes/GuildBoss.jpg';
import FortContest from '@/assets/topHeroes/FortContest.jpg';

const navigateTo = (path) => {
    router.push(path);
};
</script>