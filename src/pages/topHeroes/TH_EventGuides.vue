<template>
    <div
        class="relative min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white font-sans overflow-hidden">
        <!-- Background Glow Effects -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div
                class="absolute top-1/4 left-1/3 w-96 h-96 bg-fuchsia-500 opacity-20 rounded-full filter blur-3xl animate-pulse-slow">
            </div>
            <div
                class="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-400 opacity-20 rounded-full filter blur-2xl animate-pulse-slow delay-2000">
            </div>
        </div>

        <!-- Content -->
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <h1
                class="text-center text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-300 mb-12 animate-fade-down">
                TopHeroes Event Guides
            </h1>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-up delay-500">
                <ToolCard :icon="CalendarIcon" :image="DarkEmpireInvasion" title="Dark Empire Invasion"
                    desc="Score high and rank up with our in-depth breakdown."
                    link="/topheroes/events/dark-empire-invasion" />

                <ToolCard :icon="TrophyIcon" :image="KingdomDuels" title="Kingdom Duels (KvK)"
                    desc="Build dominance over prep, war and settle days." link="/topheroes/events/kingdom-vs-kingdom" badge="New!" />

                <ToolCard :icon="ArrowsRightLeftIcon" :image="TopHeroesBanner" title="Guild Race"
                    desc="Learn how to tackle event stages and rank higher." link="/topheroes/events/guild-race"
                    badge="New!" />

                <ToolCard :icon="LockClosedIcon" :image="AncientBattlefield" title="Ancient Battlefield"
                    desc="Coming soon." badge="Coming Soon" />

                <ToolCard :icon="LockClosedIcon" :image="GuildBoss" title="Guild Boss" desc="Coming soon."
                    badge="Coming Soon" />

                <ToolCard :icon="LockClosedIcon" :image="FortContest" title="Fort Contest" desc="Coming soon."
                    badge="Removed" />
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    CalendarIcon,
    TrophyIcon,
    ArrowsRightLeftIcon,
    LockClosedIcon,
} from '@heroicons/vue/24/outline';

import ToolCard from '@/components/topHeroes/ToolCard.vue';

import DarkEmpireInvasion from '@/assets/images/topHeroes/DarkEmpireInvasion.jpg';
import KingdomDuels from '@/assets/images/topHeroes/KingdomDuels.jpg';
import TopHeroesBanner from '@/assets/images/topHeroes/TopHeroesBanner.jpg';
import AncientBattlefield from '@/assets/images/topHeroes/AncientBattlefield.jpg';
import GuildBoss from '@/assets/images/topHeroes/GuildBoss.jpg';
import FortContest from '@/assets/images/topHeroes/FortContest.jpg';
</script>

<style scoped>
@keyframes pulse-slow {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.3;
    }

    50% {
        transform: scale(1.1);
        opacity: 0.5;
    }
}

.animate-pulse-slow {
    animation: pulse-slow 8s ease-in-out infinite;
}

@keyframes fade-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fade-down {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-up {
    animation: fade-up 1s ease-out both;
}

.animate-fade-down {
    animation: fade-down 1s ease-out both;
}

.delay-500 {
    animation-delay: 0.5s;
}

.delay-2000 {
    animation-delay: 2s;
}
</style>