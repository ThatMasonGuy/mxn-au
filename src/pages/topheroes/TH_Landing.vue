<template>
    <div
        class="relative min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900 text-white font-sans overflow-hidden">

        <!-- Floating Particles Background -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div
                class="absolute top-1/3 left-1/4 w-96 h-96 bg-fuchsia-400 opacity-20 rounded-full filter blur-3xl animate-pulse-slow">
            </div>
            <div
                class="absolute top-0 right-0 w-80 h-80 bg-purple-500 opacity-20 rounded-full filter blur-2xl animate-pulse-slow delay-2000">
            </div>
            <div
                class="absolute bottom-0 left-0 w-72 h-72 bg-amber-400 opacity-10 rounded-full filter blur-2xl animate-pulse-slow delay-4000">
            </div>
        </div>

        <!-- Main Content -->
        <div class="relative z-10">

            <!-- Hero Section -->
            <section class="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6 animate-fade-down">
                <h1
                    class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-300">
                    TopHeroes Companion Tools
                </h1>
                <p class="mt-4 text-lg sm:text-xl text-gray-300">
                    Speed up. Plan smarter. Score higher. Just tools, no BS.
                </p>
                <div class="pt-6">
                    <RouterLink to="/topheroes/tools/speedups"
                        class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-fuchsia-400/40 hover:scale-105 group">
                        <span>Open Speed-Ups Calculator</span>
                        <ArrowRightIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </RouterLink>
                </div>
            </section>

            <!-- Features Section -->
            <section class="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h2
                    class="text-3xl sm:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 mb-16 animate-fade-up">
                    Available Tools
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-up delay-500">
                    <ToolCard :icon="Gem" title="Recommended Queues"
                        desc="View, add, vote and comment on the best queue formations submitted by the community."
                        link="/topheroes/queues" :image="TopHeroes_3" badge="New!" />
                    <ToolCard :icon="ChartBarIcon" title="Speed-Ups Calculator"
                        desc="Calculate how many speed-ups you need for buildings, troops, and research."
                        link="/topheroes/tools/speedups" :image="TopHeroes_1" />
                    <ToolCard :icon="StarIcon" title="Star Calculator"
                        desc="See how many shards you need to max your heroes."
                        link="/topheroes/tools/stars" :image="StarsImage" badge="New!" />                        
                    <ToolCard :icon="UsersIcon" title="Resource Calculator"
                        desc="Track how much gold, food, and wood you’ll need based on progression."
                        link="/topheroes/tools/resources" :image="TopHeroes_2" />
                    <ToolCard :icon="CalendarIcon" title="Event Guide Hub"
                        desc="Get prepared for Dark Empire Invasion, KvK, Guild Race, and more."
                        link="/topheroes/events" :image="DarkEmpireInvasion" />
                    <ToolCard :icon="TrophyIcon" title="KvK Strategy Guide"
                        desc="Learn how to dominate Kingdom vs. Kingdom across prep, war, and settle days."
                        link="/topheroes/events/kingdom-vs-kingdom" :image="KingdomDuelsBanner" />
                    <ToolCard :icon="ArrowsRightLeftIcon" title="Guild Race Cheatsheet"
                        desc="Tips and strategies to climb the leaderboard and win your group."
                        link="/topheroes/events/guild-race" :image="FortContest" />
                    <ToolCard :icon="BellAlertIcon" title="Velaris GvG Tools"
                        desc="Track Velaris’ Guild vs Guild history, top players, and live stats."
                        link="/topheroes/velaris" :image="TopHeroesBanner" />
                </div>
            </section>

            <!-- Final CTA -->
            <section
                class="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6 animate-fade-up delay-700">
                <Tooltip>
                    <TooltipTrigger as-child>
                        <a href="https://discord.gg/th-vlr" target="_blank" rel="noopener noreferrer"
                            class="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl font-bold text-xl shadow-lg transition-all duration-300 hover:shadow-indigo-400/40 hover:scale-105 group">
                            <svg class="w-7 h-7 text-white group-hover:scale-110 transition-transform"
                                fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.271 18.271 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.369a.07.07 0 0 0-.032.027C.533 9.045-.32 13.579.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.993a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.329c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>

                            <span class="inline-flex flex-wrap items-center gap-2 text-white">
                                Join Our Discord
                                <span v-if="memberCount"
                                    class="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-fuchsia-400 to-purple-400 animate-gradient">
                                    ({{ memberCount.toLocaleString() }} Online)
                                </span>
                                <span v-else class="text-amber-300 animate-pulse text-sm">(loading...)</span>
                            </span>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Click to join the Velaris Discord</p>
                    </TooltipContent>
                </Tooltip>

                <p class="text-lg text-indigo-300 font-medium">
                    Hang out with
                    <span
                        class="font-extrabold text-transparent bg-clip-text animate-gradient bg-gradient-to-r from-fuchsia-300 via-indigo-300 to-amber-200 drop-shadow-sm px-1">
                        {{ totalMemberCount.toLocaleString() }}
                    </span>
                    players, get help, and dominate events together.
                </p>
            </section>

        </div>
    </div>
</template>

<script setup>
import {
    ArrowRightIcon,
    ChartBarIcon,
    UsersIcon,
    CalendarIcon,
    ArrowsRightLeftIcon,
    BellAlertIcon,
    TrophyIcon,
    StarIcon
} from '@heroicons/vue/24/outline'
import { Gem } from 'lucide-vue-next'
import ToolCard from '@/components/topheroes/ToolCard.vue'
import TopHeroes_1 from '@/assets/images/topHeroes/TopHeroes_1.jpg';
import TopHeroes_2 from '@/assets/images/topHeroes/TopHeroes_2.jpg';
import TopHeroes_3 from '@/assets/images/topHeroes/TopHeroes_3.jpg';
import DarkEmpireInvasion from '@/assets/images/topHeroes/DarkEmpireInvasion.jpg';
import TopHeroesBanner from '@/assets/images/topHeroes/TopHeroesBanner.jpg';
import KingdomDuelsBanner from '@/assets/images/topHeroes/KingdomDuelsBanner.jpg';
import FortContest from '@/assets/images/topHeroes/FortContest.jpg';
import StarsImage from '@/assets/images/topHeroes/1stAnniversary.jpg'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const memberCount = ref(null)
const totalMemberCount = ref("200+")
let intervalId = null

const fetchDiscordStats = async () => {
    try {
        const res = await fetch('https://discord.com/api/guilds/1276352770164658317/widget.json')
        const data = await res.json()

        memberCount.value = data.presence_count ?? null
    } catch (err) {
        console.error('Discord stats fetch failed:', err)
    }
}

onMounted(() => {
    fetchDiscordStats()
    intervalId = setInterval(fetchDiscordStats, 60000)
})

onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId)
})
</script>

<!-- Animations -->
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

.delay-700 {
    animation-delay: 0.7s;
}

.delay-2000 {
    animation-delay: 2s;
}

.delay-4000 {
    animation-delay: 4s;
}

.animate-gradient {
    background-size: 200% 100%;
    background-position: 0% 50%;
    animation: gradient-x 6s ease infinite;
}

@keyframes gradient-x {

    0%,
    100% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }
}
</style>