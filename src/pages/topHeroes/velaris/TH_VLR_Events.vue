<template>
    <section class="relative min-h-screen flex flex-col overflow-hidden bg-[#070719]">
        <!-- Background Radial Gradients -->
        <div class="absolute inset-0 z-0 opacity-60 pointer-events-none">
            <div class="absolute w-full h-full bg-[radial-gradient(circle_at_10%_20%,#4f0fa1_0%,transparent_50%)]">
            </div>
            <div class="absolute w-full h-full bg-[radial-gradient(circle_at_80%_30%,#d946ef_0%,transparent_50%)]">
            </div>
            <div class="absolute w-full h-full bg-[radial-gradient(circle_at_40%_90%,#2563eb_0%,transparent_40%)]">
            </div>
        </div>

        <!-- Particles -->
        <div class="absolute inset-0 z-10 overflow-hidden">
            <div v-for="i in 15" :key="i" class="particle absolute rounded-full bg-white/10 backdrop-blur-sm" :style="{
                width: `${Math.random() * 16 + 4}px`,
                height: `${Math.random() * 16 + 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 50 + 30}s`,
                animationDelay: `${Math.random() * 5}s`,
            }"></div>
        </div>

        <!-- The rest of your content -->
        <div class="z-20">

            <!-- Header with enhanced animation -->
            <div class="z-10 text-center mt-20 mb-16 px-4 animate-fade-in-up">
                <div class="relative inline-block">
                    <h1
                        class="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400 drop-shadow-glow">
                        Velaris Guild Events
                    </h1>
                    <div
                        class="absolute -inset-1 rounded-lg blur-lg bg-gradient-to-r from-fuchsia-500/20 to-indigo-500/20 -z-10">
                    </div>
                </div>
                <p class="text-gray-300 mt-6 text-lg max-w-2xl mx-auto font-light tracking-wide">
                    Explore past battles, races, and competitions in stunning detail
                </p>

                <!-- Search bar -->
                <div class="mt-8 max-w-md mx-auto relative">
                    <input type="text" placeholder="Search events..."
                        class="w-full px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition duration-300" />
                    <button
                        class="absolute right-2 top-2 p-1.5 rounded-full bg-fuchsia-500/80 text-white hover:bg-fuchsia-400 transition duration-300">
                        <MagnifyingGlassIcon class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Cards Grid with staggered animation -->
            <div class="z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto px-6">
                <RouterLink v-for="(event, index) in events" :key="event.id"
                    :to="`/topheroes/velaris/events/${event.event}/${event.id}`"
                    :style="{ animationDelay: `${index * 0.15}s` }"
                    class="group animate-fade-in-up relative rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.03] backdrop-blur-xl border border-white/10 bg-gradient-to-br from-white/8 to-white/2 shadow-glow">
                    <!-- Card background effects -->
                    <div class="absolute inset-0 -z-10">
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-fuchsia-600/10 via-purple-600/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        </div>
                        <div
                            class="absolute -inset-0.5 bg-gradient-to-br from-fuchsia-500/20 via-purple-500/5 to-indigo-500/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 rounded-xl">
                        </div>
                    </div>

                    <!-- Icon and Text -->
                    <div class="relative z-10 flex flex-col h-full p-8 justify-between">
                        <div>
                            <div class="flex items-center gap-4 mb-5">
                                <div
                                    class="p-3 rounded-lg bg-white/5 border border-white/10 transform group-hover:scale-110 transition-all duration-500">
                                    <component :is="eventIcons[event.type] || eventIcons['default']"
                                        class="w-6 h-6 text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors" />
                                </div>
                                <h2 class="text-2xl font-bold text-white group-hover:text-fuchsia-300 transition">
                                    {{ event.name }}
                                </h2>
                            </div>
                            <p class="text-gray-300 text-sm mb-6 leading-relaxed">{{ event.description }}</p>
                        </div>

                        <!-- Stats section -->
                        <div class="mb-6 bg-white/5 rounded-lg p-3 border border-white/10">
                            <div class="flex justify-between text-xs text-gray-400">
                                <span>Players: {{ event.stats?.players || '42' }}</span>
                                <span>Duration: {{ event.stats?.duration || '3d 4h' }}</span>
                            </div>
                        </div>

                        <div class="mt-auto flex items-center justify-between">
                            <div
                                class="text-fuchsia-400 text-sm font-semibold group-hover:translate-x-1 transition-all duration-300 flex items-center">
                                <span>View Details</span>
                                <ArrowRightIcon
                                    class="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                            <span class="text-xs text-gray-400">{{ event.date || 'April 2025' }}</span>
                        </div>
                    </div>
                </RouterLink>
            </div>

            <!-- Add event button -->
            <div class="fixed bottom-8 right-8 z-20">
                <button
                    class="group p-4 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-white shadow-lg hover:shadow-fuchsia-500/25 transition-all duration-300 transform hover:scale-105">
                    <PlusIcon class="w-6 h-6" />
                    <span
                        class="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                        New Event
                    </span>
                </button>
            </div>

            <!-- Loading effect -->
            <div v-if="loading" class="flex justify-center mt-12 mb-8 z-10">
                <div class="relative w-64 h-8">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="flex gap-2">
                            <div v-for="i in 3" :key="i" class="w-2.5 h-2.5 rounded-full bg-fuchsia-500"
                                :style="{ animationDelay: `${i * 0.15}s` }" :class="['animate-pulse-fade']">
                            </div>
                        </div>
                    </div>
                    <p class="absolute inset-0 text-center text-gray-400 text-sm opacity-60 pt-8">Loading more events...
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import {
    FlagIcon,
    SparklesIcon,
    StarIcon,
    MagnifyingGlassIcon,
    ArrowRightIcon,
    PlusIcon
} from '@heroicons/vue/24/outline'

const eventIcons = {
    'guild-vs-guild': SparklesIcon,
    'guild-race': FlagIcon,
    'default': StarIcon,
}

const loading = ref(true)

const events = ref([
    {
        event: 'guild-vs-guild',
        id: 'april-2025',
        name: 'Guild vs Guild - April 2025',
        description: 'Epic battle with detailed player breakdowns, win rates, and performance analytics.',
        type: 'guild-vs-guild',
        stats: {
            players: 64,
            duration: '4d 8h'
        },
        date: 'Apr 15, 2025'
    },
    {
        event: 'guild-race',
        id: 'april-2025',
        name: 'Guild Race - April 2025',
        description: 'Complete race tracking with participation scores, checkpoints and team performance.',
        type: 'guild-race',
        stats: {
            players: 48,
            duration: '2d 12h'
        },
        date: 'Apr 8, 2025'
    },
])

// Simulate loading state
setTimeout(() => {
    loading.value = false
}, 2000)
</script>

<style scoped>
.shadow-glow {
    box-shadow: 0 0 25px rgba(217, 70, 239, 0.1);
}

.drop-shadow-glow {
    filter: drop-shadow(0 0 8px rgba(167, 139, 250, 0.5));
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) translateX(0);
    }

    25% {
        transform: translateY(-10px) translateX(5px);
    }

    50% {
        transform: translateY(5px) translateX(-5px);
    }

    75% {
        transform: translateY(10px) translateX(5px);
    }
}

.particle {
    animation: float linear infinite;
    opacity: 0.5;
}

.animate-fade-in-up {
    animation: fadeInUp 0.8s ease forwards;
}

.animate-pulse-fade {
    animation: pulseFade 1.5s infinite;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulseFade {

    0%,
    100% {
        opacity: 0.3;
        transform: scale(0.8);
    }

    50% {
        opacity: 1;
        transform: scale(1.2);
    }
}
</style>