<template>
    <section
        class="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden text-white px-6 sm:px-12 pt-20">

        <!-- Floating Tech Icons -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div v-for="icon in floatingIcons" :key="icon.id"
                class="absolute opacity-10 text-purple-400"
                :style="{
                    left: icon.x,
                    top: icon.y,
                    animationDuration: icon.duration,
                    animationDelay: icon.delay
                }"
                :class="icon.animation">
                <component :is="icon.component" :class="icon.size" />
            </div>
        </div>

        <!-- Decorative Shapes -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-20 left-10 w-32 h-32 border-2 border-purple-500/20 rounded-full animate-pulse-slow" />
            <div class="absolute bottom-40 right-20 w-24 h-24 border-2 border-pink-500/20 rotate-45 animate-pulse-slow" style="animation-delay: 1s" />
            <div class="absolute top-1/3 right-10 w-16 h-16 border-2 border-indigo-500/20 rounded-lg animate-pulse-slow" style="animation-delay: 2s" />
        </div>

        <!-- Main Content -->
        <div class="relative z-10 space-y-8 max-w-5xl animate-fade-up">
            
            <!-- Title -->
            <h1 class="text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-tight">
                <span class="block mb-2 text-white/90">Welcome to</span>
                <span class="inline-block relative group">
                    <span class="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text animate-gradient">
                        MXN.au
                    </span>
                    <div class="absolute -inset-2 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 blur-2xl -z-10 group-hover:blur-3xl transition-all duration-500" />
                </span>
            </h1>

            <!-- Subtitle -->
            <p class="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed opacity-0 animate-delayed-fade">
                Building <span class="text-purple-400 font-medium">bleeding-edge</span> webapps, tools, and games for the digital frontier
            </p>

            <!-- Quick Stats -->
            <div class="opacity-0 animate-delayed-fade flex flex-wrap justify-center gap-4 pt-2">
                <div class="group relative">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-lg blur opacity-30 group-hover:opacity-60 transition-opacity" />
                    <div class="relative flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2">
                        <Code2 class="w-4 h-4 text-purple-400" />
                        <span class="text-sm font-semibold text-white/90">20+ Projects</span>
                    </div>
                </div>
                <div class="group relative">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/50 to-purple-500/50 rounded-lg blur opacity-30 group-hover:opacity-60 transition-opacity" />
                    <div class="relative flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2">
                        <Zap class="w-4 h-4 text-indigo-400" />
                        <span class="text-sm font-semibold text-white/90">Vue.js Expert</span>
                    </div>
                </div>
                <div class="group relative">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-pink-500/50 to-purple-500/50 rounded-lg blur opacity-30 group-hover:opacity-60 transition-opacity" />
                    <div class="relative flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2">
                        <Coffee class="w-4 h-4 text-pink-400" />
                        <span class="text-sm font-semibold text-white/90">Caffeine Powered</span>
                    </div>
                </div>
            </div>

            <!-- Status Badge -->
            <div class="opacity-0 animate-delayed-fade-long flex justify-center">
                <div class="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-md border border-emerald-400/30 rounded-full px-5 py-2.5 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 group">
                    <div class="relative">
                        <div class="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                        <div class="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
                    </div>
                    <span class="text-sm text-emerald-300 font-medium">
                        Currently working on <span class="font-semibold text-emerald-200">Translate Bot</span>
                    </span>
                </div>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center pt-6 opacity-0 animate-delayed-fade-longer">
                <button
                    @click="scrollToSection('explore')"
                    class="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span class="relative flex items-center justify-center gap-2">
                        Explore My Work
                        <ChevronRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>

                <button
                    @click="scrollToSection('contact')"
                    class="group px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl font-semibold hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300">
                    <span class="flex items-center justify-center gap-2">
                        Get in Touch
                        <MessageCircle class="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </span>
                </button>
            </div>

            <!-- Scroll Indicator -->
            <div class="opacity-0 animate-delayed-fade-longest pt-12">
                <div class="flex flex-col items-center gap-2 text-white/40">
                    <span class="text-xs uppercase tracking-wider">Scroll to explore</span>
                    <ChevronDown class="w-5 h-5 animate-bounce" />
                </div>
            </div>

        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronRight, MessageCircle, ChevronDown, Code2, Zap, Coffee, Database, Layers, Terminal, Sparkles, Rocket } from 'lucide-vue-next'

const scrollToSection = (id) => {
    if (!id) return
    const target = document.getElementById(id)
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

const floatingIcons = ref([
    { id: 1, component: Code2, x: '10%', y: '15%', size: 'w-12 h-12', duration: '20s', delay: '0s', animation: 'animate-float-1' },
    { id: 2, component: Database, x: '85%', y: '20%', size: 'w-10 h-10', duration: '25s', delay: '2s', animation: 'animate-float-2' },
    { id: 3, component: Layers, x: '15%', y: '75%', size: 'w-14 h-14', duration: '22s', delay: '4s', animation: 'animate-float-1' },
    { id: 4, component: Terminal, x: '80%', y: '70%', size: 'w-11 h-11', duration: '28s', delay: '1s', animation: 'animate-float-2' },
    { id: 5, component: Sparkles, x: '5%', y: '45%', size: 'w-8 h-8', duration: '24s', delay: '3s', animation: 'animate-float-1' },
    { id: 6, component: Rocket, x: '90%', y: '45%', size: 'w-9 h-9', duration: '26s', delay: '5s', animation: 'animate-float-2' },
])
</script>

<style scoped>
@keyframes fade-up {
    from {
        opacity: 0;
        transform: translateY(40px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-up {
    animation: fade-up 1s ease-out both;
}

@keyframes gradient {
    0%, 100% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
}

.animate-gradient {
    background-size: 200% 200%;
    animation: gradient 8s ease infinite;
}

@keyframes delayed-fade {
    0%, 40% {
        opacity: 0;
        transform: translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-delayed-fade {
    animation: delayed-fade 1.2s forwards;
}

.animate-delayed-fade-long {
    animation: delayed-fade 1.2s 0.3s forwards;
}

.animate-delayed-fade-longer {
    animation: delayed-fade 1.2s 0.6s forwards;
}

.animate-delayed-fade-longest {
    animation: delayed-fade 1.2s 0.9s forwards;
}

@keyframes float-1 {
    0%, 100% {
        transform: translate(0, 0) rotate(0deg);
    }
    33% {
        transform: translate(20px, -20px) rotate(5deg);
    }
    66% {
        transform: translate(-15px, 15px) rotate(-5deg);
    }
}

@keyframes float-2 {
    0%, 100% {
        transform: translate(0, 0) rotate(0deg);
    }
    33% {
        transform: translate(-20px, 20px) rotate(-5deg);
    }
    66% {
        transform: translate(15px, -15px) rotate(5deg);
    }
}

.animate-float-1 {
    animation: float-1 linear infinite;
}

.animate-float-2 {
    animation: float-2 linear infinite;
}

@keyframes pulse-slow {
    0%, 100% {
        opacity: 0.2;
        transform: scale(1);
    }
    50% {
        opacity: 0.4;
        transform: scale(1.05);
    }
}

.animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
}
</style>