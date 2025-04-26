<template>
    <section id="skills" class="relative w-full px-6 py-20 mx-auto flex flex-col items-center overflow-hidden">
        <!-- Title -->
        <h2
            class="text-4xl sm:text-5xl font-extrabold text-center mb-16 relative z-10 bg-gradient-to-r from-fuchsia-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent animate-fade-up">
            My Skills
        </h2>

        <!-- Skills Grid -->
        <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl w-full relative z-10 animate-fade-up animation-delay-200">
            <SkillCard v-for="skill in skills" :key="skill.name" v-bind="skill" />
        </div>

        <!-- Global Progress Bar -->
        <div
        class="mt-16 relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-lg hover:shadow-fuchsia-500/30 transition-all overflow-hidden">

        <div class="text-center animate-fade-up animation-delay-400 relative z-10">
            <p class="text-sm text-pink-300 mb-2">Learning Progress</p>
            <div class="w-64 h-4 bg-black/50 rounded-full overflow-hidden border border-pink-400/50 mx-auto">
                <div class="h-full bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full animate-pulse-slow"
                    style="width: 42%"></div>
            </div>
            <p class="text-xs text-gray-400 mt-2">Always growing, never finished.</p>
        </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import SkillCard from '@/components/mxn/skills/SkillCard.vue'
import GradientBackground from '@/components/common/backgrounds/GradientBackground.vue'

const skills = ref([
    {
        name: 'Vue 3',
        abbr: 'V3',
        progress: 90,
        baseColor: '#42b883',
        logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
        badgeLabel: 'Mastered'
    },
    {
        name: 'TailwindCSS',
        abbr: 'TW',
        progress: 85,
        baseColor: '#06b6d4',
        logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
        badgeLabel: 'Mastered'
    },
    {
        name: 'Firebase',
        abbr: 'FB',
        progress: 75,
        baseColor: '#ffca28',
        logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
        badgeLabel: 'Growing'
    },
    {
        name: 'Express.js',
        abbr: 'EX',
        progress: 70,
        baseColor: '#666666',
        logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
        badgeLabel: 'Growing'
    },
    {
        name: 'Postgres',
        abbr: 'PG',
        progress: 65,
        baseColor: '#336791',
        logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
        badgeLabel: 'Learning'
    },
    {
        name: 'Docker',
        abbr: 'DK',
        progress: 55,
        baseColor: '#2496ed',
        logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
        badgeLabel: 'Exploring'
    }
])
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

.animation-delay-200 {
    animation-delay: 0.2s;
}

.animation-delay-400 {
    animation-delay: 0.4s;
}

.animate-pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.8;
    }
}
</style>