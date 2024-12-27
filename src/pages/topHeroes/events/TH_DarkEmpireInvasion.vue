<!-- src/pages/topHeroes/events/TH_DarkEmpireInvasion.vue -->
<template>
  <div class="flex flex-col h-full bg-gray-800 text-white justify-between">
    <div class="w-full h-40 bg-cover bg-center relative">
      <img :src="BannerImage" alt="Dark Empire Invasion Banner" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800"></div>
    </div>
    <main class="flex-grow px-6 py-8 -mt-4">
      <section class="text-center">
        <h2 class="text-4xl font-bold mb-6">Dark Empire Invasion</h2>
        <p class="text-gray-400 mb-4">
          Welcome to the Dark Empire Invasion event! Participate to earn exclusive rewards and test your skills.
        </p>
      </section>
      <section class="space-y-8">
        <div class="flex flex-col items-center space-y-4">
          <p class="text-gray-400">
            Fight through waves of enemies and claim victory! Each difficulty offers unique challenges and rewards.
          </p>
          <p class="text-gray-400">
            Hard mode yields the highest score potential, reaching up to 895k points! Team up with your guild for
            maximum impact.
          </p>
        </div>
        <div class="mt-8 text-gray-400">
          <h3 class="text-xl font-semibold mb-2">Tips for Success</h3>
          <ul class="list-disc list-inside space-y-2">
            <li>Focus on combo attacks for bonus points.</li>
            <li>Complete daily missions to earn extra rewards.</li>
            <li>Coordinate with your guild to maximize efficiency.</li>
          </ul>
        </div>
      </section>
      <section class="mt-8 text-center text-gray-400">
        <p>
          Share this event with your guildmates and dominate the leaderboard. Together, you can conquer the Dark Empire!
        </p>
      </section>
    </main>
  </div>
</template>

<script setup>
import router from '@/router.js';
import BannerImage from '@/assets/DarkEmpireInvasionBanner.jpg';

const navigateTo = (path) => {
  router.push(path);
};
</script>