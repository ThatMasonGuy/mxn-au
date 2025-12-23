<template>
    <section id="skills" class="relative w-full px-6 py-32 mx-auto flex flex-col items-center">
        
        <!-- Section Header -->
        <div class="text-center mb-16 max-w-3xl">
            <h2 class="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-fuchsia-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                My Skills
            </h2>
            <p class="text-lg text-white/60">
                Technologies I work with daily to build modern web applications
            </p>
        </div>

        <!-- Skills Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mb-12">
            <SkillCard v-for="skill in skills" :key="skill.name" v-bind="skill" />
        </div>

        <!-- Progress Card -->
        <div class="relative group max-w-2xl w-full">
            <div class="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
            
            <div class="relative p-8 rounded-2xl bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-indigo-500/5 border border-white/10 backdrop-blur-xl">
                <div class="text-center space-y-4">
                    <div class="flex items-center justify-center gap-2 mb-2">
                        <Sparkles class="w-5 h-5 text-pink-400" />
                        <p class="text-sm font-semibold text-pink-300 uppercase tracking-wider">Learning Progress</p>
                    </div>
                    
                    <div class="w-full max-w-md mx-auto h-3 bg-black/40 rounded-full overflow-hidden border border-pink-400/30">
                        <div class="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full animate-pulse-slow shadow-lg shadow-pink-500/50"
                            style="width: 42%">
                        </div>
                    </div>
                    
                    <p class="text-sm text-white/60">
                        Always growing, never finished. 🚀
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { Sparkles } from 'lucide-vue-next'
import SkillCard from '@/components/mxn/skills/SkillCard.vue'

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
.animate-pulse-slow {
    animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.8;
    }
}
</style>