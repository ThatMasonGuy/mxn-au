<template>
    <section id="explore" class="relative w-full px-6 py-20 mx-auto flex flex-col items-center overflow-hidden">

        <h2
            class="text-4xl sm:text-5xl font-extrabold text-center mb-16 relative z-10 bg-gradient-to-r from-fuchsia-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent animate-fade-up">
            Explore MXN.au
        </h2>

        <!-- Grid -->
        <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl w-full relative z-10 animate-fade-up animation-delay-200">

            <ToolCard :icon="Languages" title="Translate"
                desc="AI-powered web translator for real-time language conversion. Free & open to all."
                link="/translate" :image="Translate_image" badge="New!" />

            <ToolCard :icon="Grid" title="Daily Games"
                desc="AI-powered daily games like wordle, connections, flagle and more."
                link="/daily" :image="Daily_Image" badge="New!" />

            <ToolCard :icon="Crosshair" title="Destiny 2"
                desc="AI-powered challenge optimiser for Destiny 2. Plan, optimise, and track your progress. 100% free."
                link="/destiny" :image="Destiny2_image" badge="New!" />

            <ToolCard :icon="Puzzle" title="TopHeroes"
                desc="Track your guild, player stats, and events for TopHeroes. Live data, custom dashboards."
                link="/topheroes" :image="TopHeroes_image" />

            <ToolCard :icon="User" title="Personal"
                desc="Login to use the Goblin Tracker, AI journal, and track your growth. Private & secure."
                link="/personal" :image="Personal_image" />

            <ToolCard :icon="Wrench" title="DevTools"
                desc="Handy development utilities, generators, and side projects for devs." link="/devtools"
                :image="DevTools_image" />

            <ToolCard :icon="Box" title="Minecraft"
                desc="Player dashboards, server management, activity logs, and more for Minecraft servers."
                link="/minecraft" :image="Minecraft_image" badge="Coming Soon" />

            <ToolCard :icon="Server" title="Server"
                desc="Manage web servers, deploy projects, and control files/plugins. All-in-one admin." link="/server"
                :image="Server_image" badge="Coming Soon" />
        </div>
    </section>
</template>

<script setup>
// Lucide-vue icons
import { Wrench, Puzzle, Box, Server, Languages, User, Crosshair, Grid } from 'lucide-vue-next'

import ToolCard from '@/components/topheroes/ToolCard.vue'

import TopHeroes_image from '@/assets/images/topHeroes/TopHeroes_2.jpg';
import DevTools_image from '@/assets/images/mxn/DevTools_Image.jpg';
import Minecraft_image from '@/assets/images/mxn/Minecraft_Image.jpg';
import Server_image from '@/assets/images/mxn/Server_Image.jpg';
import Translate_image from '@/assets/images/mxn/Translate_Image.jpg';
import Personal_image from '@/assets/images/mxn/Personal_Image.png';
import Destiny2_image from '@/assets/images/mxn/Destiny2_Image.jpg';
import Daily_Image from '@/assets/images/mxn/Daily_Image.png';
</script>

<style scoped>
@keyframes fade-in {
    0% {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.animate-fade-up {
    animation: fade-in 0.8s ease forwards;
}
</style>