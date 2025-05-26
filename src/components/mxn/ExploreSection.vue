<template>
    <section id="explore" class="relative w-full px-6 py-20 mx-auto flex flex-col items-center overflow-hidden">

        <h2
            class="text-4xl sm:text-5xl font-extrabold text-center mb-16 relative z-10 bg-gradient-to-r from-fuchsia-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent animate-fade-up">
            Explore MXN.au
        </h2>

        <!-- Grid -->
        <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl w-full relative z-10 animate-fade-up animation-delay-200">

            <ToolCard :icon="WrenchIcon" title="DevTools"
                desc="Development utilities, generators, and personal projects." link="/devtools" :image="DevTools"
                badge="New!" />

            <ToolCard :icon="PuzzlePieceIcon" title="TopHeroes"
                desc="Track your Guild Wars, players, stats and event data." link="/topheroes" :image="TopHeroes" />

            <ToolCard :icon="CubeIcon" title="Minecraft" desc="Player dashboards, server management, logs and insights."
                link="/minecraft" :image="Minecraft" />

            <ToolCard :icon="ServerStackIcon" title="Server"
                desc="Control web servers, deployments, files, and plugins." link="/server" :image="Server"
                badge="Coming Soon" />

            <ToolCard :icon="GlobeAltIcon" title="Translate"
                desc="Real-time Discord translator and project backend APIs." link="/translate" :image="Translate" />

            <ToolCard :icon="UserIcon" title="Personal"
                desc="Login and track your real growth, user the goblin tracker or AI journal." link="/personal" :image="Personal" />
        </div>
    </section>
</template>

<script setup>
import ToolCard from '@/components/topheroes/ToolCard.vue'

// Import Heroicons
import {
    WrenchIcon,
    PuzzlePieceIcon,
    CubeIcon,
    ServerStackIcon,
    GlobeAltIcon,
    UserIcon
} from '@heroicons/vue/24/outline'

import TopHeroes from '@/assets/images/topHeroes/TopHeroes_2.jpg';
import DevTools from '@/assets/images/mxn/DevTools_Image.jpg';
import Minecraft from '@/assets/images/mxn/Minecraft_Image.jpg';
import Server from '@/assets/images/mxn/Server_Image.jpg';
import Translate from '@/assets/images/mxn/Translate_Image.jpg';
import Personal from '@/assets/images/mxn/Personal_Image.png'
</script>

<style scoped>
/* Fading cards up */
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
