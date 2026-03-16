<template>
    <div class="min-h-screen bg-slate-950 text-white overflow-hidden">
        <!-- Animated background gradient mesh -->
        <div class="fixed inset-0 opacity-30 pointer-events-none">
            <div
                class="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob">
            </div>
            <div
                class="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000">
            </div>
            <div
                class="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000">
            </div>
        </div>

        <!-- Grain texture overlay -->
        <div class="fixed inset-0 opacity-[0.03] pointer-events-none bg-noise"></div>

        <div class="relative z-10">
            <!-- Header -->
            <header class="container mx-auto px-6 pt-20 pb-16">
                <div class="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
                    <div class="inline-block">
                        <div class="flex items-center gap-3 mb-4 justify-center">
                            <Bot class="w-12 h-12 text-cyan-400" :stroke-width="1.5" />
                            <h1 class="text-6xl md:text-7xl font-display font-bold tracking-tight">
                                MXN<span class="text-cyan-400">Bots</span>
                            </h1>
                        </div>
                    </div>
                    <p class="text-xl md:text-2xl text-slate-300 font-body max-w-2xl mx-auto leading-relaxed">
                        Premium Discord bots built for seamless server management and enhanced community experiences
                    </p>
                </div>
            </header>

            <!-- Main Content -->
            <main class="container mx-auto px-6 pb-20">
                <div class="max-w-5xl mx-auto space-y-12">
                    <!-- Active Bots -->
                    <div class="space-y-6">
                        <h2 class="text-3xl font-display font-semibold text-slate-200 flex items-center gap-3">
                            <Sparkles class="w-7 h-7 text-cyan-400" />
                            Available Now
                        </h2>

                        <!-- Active Bot Cards -->
                        <div v-for="(bot, index) in activeBots" :key="bot.id"
                            class="bot-card group bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] animate-slide-up"
                            :style="{ animationDelay: `${index * 100}ms` }">
                            <div class="flex flex-col md:flex-row gap-6 items-start">
                                <div class="flex-shrink-0">
                                    <div
                                        :class="['w-20 h-20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300', bot.gradientClass]">
                                        <component :is="bot.icon" class="w-10 h-10 text-white" :stroke-width="2" />
                                    </div>
                                </div>

                                <div class="flex-grow space-y-4">
                                    <div>
                                        <h3 class="text-2xl font-display font-bold text-white mb-2">{{ bot.name }}</h3>
                                        <p class="text-slate-300 text-lg leading-relaxed font-body">
                                            {{ bot.description }}
                                        </p>
                                    </div>

                                    <div class="flex flex-wrap gap-2">
                                        <span v-for="feature in bot.features" :key="feature.text"
                                            :class="['px-3 py-1 rounded-full text-sm font-medium border', feature.class]">
                                            {{ feature.text }}
                                        </span>
                                    </div>

                                    <div class="flex flex-wrap gap-4 pt-2">
                                        <router-link v-if="bot.inviteUrl" :to="bot.inviteUrl"
                                            class="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105">
                                            <Plus class="w-5 h-5" />
                                            Add to Server
                                        </router-link>
                                        <router-link v-if="bot.docsUrl" :to="bot.docsUrl"
                                            class="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all duration-200 border border-slate-700 hover:border-slate-600">
                                            <FileText class="w-5 h-5" />
                                            Documentation
                                        </router-link>
                                        <a v-if="bot.issuesUrl" :href="bot.issuesUrl" target="_blank"
                                            rel="noopener noreferrer"
                                            class="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all duration-200 border border-slate-700 hover:border-slate-600">
                                            <AlertCircle class="w-5 h-5" />
                                            Report Issue
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Coming Soon -->
                    <div v-if="upcomingBots.length > 0" class="space-y-6 pt-4">
                        <h2 class="text-3xl font-display font-semibold text-slate-200 flex items-center gap-3">
                            <Clock class="w-7 h-7 text-slate-400" />
                            Coming Soon
                        </h2>

                        <!-- Upcoming Bot Cards -->
                        <div v-for="(bot, index) in upcomingBots" :key="bot.id"
                            class="bot-card bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 relative overflow-hidden animate-slide-up"
                            :style="{ animationDelay: `${(activeBots.length + index) * 100 + 100}ms` }">
                            <div class="absolute top-4 right-4">
                                <span
                                    class="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-full text-sm font-bold border border-amber-500/40 flex items-center gap-2">
                                    <Clock class="w-4 h-4" />
                                    In Development
                                </span>
                            </div>

                            <div class="flex flex-col md:flex-row gap-6 items-start opacity-75">
                                <div class="flex-shrink-0">
                                    <div
                                        :class="['w-20 h-20 rounded-xl flex items-center justify-center', bot.gradientClass]">
                                        <component :is="bot.icon" class="w-10 h-10 text-white" :stroke-width="2" />
                                    </div>
                                </div>

                                <div class="flex-grow space-y-4">
                                    <div>
                                        <h3 class="text-2xl font-display font-bold text-white mb-2">{{ bot.name }}</h3>
                                        <p class="text-slate-400 text-lg leading-relaxed font-body">
                                            {{ bot.description }}
                                        </p>
                                    </div>

                                    <div class="flex flex-wrap gap-2">
                                        <span v-for="feature in bot.features" :key="feature.text"
                                            class="px-3 py-1 bg-slate-700/50 text-slate-400 rounded-full text-sm font-medium border border-slate-700">
                                            {{ feature.text }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Features Overview -->
                    <div class="pt-8 space-y-8 animate-slide-up" style="animation-delay: 500ms;">
                        <h2 class="text-3xl font-display font-semibold text-slate-200 flex items-center gap-3">
                            <Zap class="w-7 h-7 text-cyan-400" />
                            Why Choose MXN Bots?
                        </h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                class="p-6 bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-xl hover:border-cyan-500/30 transition-all duration-300">
                                <div class="flex items-start gap-4">
                                    <div
                                        class="flex-shrink-0 w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                                        <Shield class="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 class="text-xl font-display font-semibold text-white mb-2">Reliable & Secure
                                        </h3>
                                        <p class="text-slate-400 font-body leading-relaxed">Built with industry best
                                            practices, ensuring your data is safe and your server runs smoothly 24/7.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="p-6 bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-xl hover:border-emerald-500/30 transition-all duration-300">
                                <div class="flex items-start gap-4">
                                    <div
                                        class="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                        <Rocket class="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 class="text-xl font-display font-semibold text-white mb-2">Active
                                            Development</h3>
                                        <p class="text-slate-400 font-body leading-relaxed">Continuously updated with
                                            new features and improvements based on community feedback.</p>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="p-6 bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-xl hover:border-teal-500/30 transition-all duration-300">
                                <div class="flex items-start gap-4">
                                    <div
                                        class="flex-shrink-0 w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
                                        <Users class="w-6 h-6 text-teal-400" />
                                    </div>
                                    <div>
                                        <h3 class="text-xl font-display font-semibold text-white mb-2">Community Driven
                                        </h3>
                                        <p class="text-slate-400 font-body leading-relaxed">Your feedback shapes the
                                            future. Report issues and request features to help us improve.</p>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="p-6 bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-xl hover:border-purple-500/30 transition-all duration-300">
                                <div class="flex items-start gap-4">
                                    <div
                                        class="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                        <Settings class="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 class="text-xl font-display font-semibold text-white mb-2">Easy to Use</h3>
                                        <p class="text-slate-400 font-body leading-relaxed">Intuitive commands and
                                            comprehensive documentation make setup and configuration a breeze.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 animate-slide-up"
                        style="animation-delay: 600ms;">
                        <div v-for="stat in stats" :key="stat.label"
                            class="text-center p-6 bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-xl hover:border-cyan-500/30 transition-all duration-300">
                            <div :class="['text-4xl font-display font-bold mb-2', stat.colorClass]">{{ stat.value }}
                            </div>
                            <div class="text-slate-400 font-body">{{ stat.label }}</div>
                        </div>
                    </div>
                </div>
            </main>

            <!-- Footer -->
            <footer class="container mx-auto px-6 py-12 mt-20 border-t border-slate-800/50">
                <div class="max-w-5xl mx-auto text-center text-slate-400 font-body">
                    <p>Built with ❤️ by Mason</p>
                    <p class="mt-2 text-sm">© {{ currentYear }} MXN Development. All rights reserved.</p>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bot, Languages, Plus, FileText, Clock, Box, Sparkles, AlertCircle, Zap, Shield, Rocket, Users, Settings } from 'lucide-vue-next'

// Bot Configuration - Update here to add/modify bots
const activeBots = ref([
    {
        id: 'translate',
        name: 'MXN Translate',
        icon: Languages,
        description: 'Break language barriers in your Discord server with real-time translation, message tracking, and auto-translate channels. Supporting 17+ servers with over 626,000 messages translated.',
        gradientClass: 'bg-gradient-to-br from-cyan-500 to-emerald-500',
        features: [
            { text: 'Real-time Translation', class: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
            { text: 'Message Tracking', class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            { text: 'Auto-translate Channels', class: 'bg-teal-500/20 text-teal-300 border-teal-500/30' }
        ],
        inviteUrl: '/translate/bot',
        docsUrl: '/translate/bot/legal',
        issuesUrl: 'https://github.com/ThatMasonGuy/MXNTranslate/issues'
    }
])

const upcomingBots = ref([
    {
        id: 'minecraft',
        name: 'MXN Minecraft',
        icon: Box,
        description: 'Enhance your Minecraft server with Discord integration, player statistics, server status monitoring, and comprehensive server management tools.',
        gradientClass: 'bg-gradient-to-br from-amber-500 to-orange-500',
        features: [
            { text: 'Server Monitoring' },
            { text: 'Player Stats' },
            { text: 'Discord Integration' }
        ]
    }
])

// Stats Configuration
const stats = ref([
    { value: '17+', label: 'Active Servers', colorClass: 'text-cyan-400' },
    { value: '626K+', label: 'Messages Translated', colorClass: 'text-emerald-400' },
    { value: '24/7', label: 'Uptime', colorClass: 'text-teal-400' }
])

// Auto-updating copyright year
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap');

.font-display {
    font-family: 'Urbanist', sans-serif;
}

.font-body {
    font-family: 'Manrope', sans-serif;
}

/* Animated blobs */
@keyframes blob {

    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }

    33% {
        transform: translate(30px, -50px) scale(1.1);
    }

    66% {
        transform: translate(-20px, 20px) scale(0.9);
    }
}

.animate-blob {
    animation: blob 7s infinite;
}

.animation-delay-2000 {
    animation-delay: 2s;
}

.animation-delay-4000 {
    animation-delay: 4s;
}

.animation-delay-200 {
    animation-delay: 200ms;
}

.animation-delay-400 {
    animation-delay: 400ms;
}

/* Noise texture */
.bg-noise {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

/* Fade in animation */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.8s ease-out;
}

/* Slide up animation */
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-up {
    animation: slideUp 0.8s ease-out;
}

/* Bot card hover effect */
.bot-card {
    position: relative;
}

.bot-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 1rem;
    padding: 1px;
    background: linear-gradient(135deg, transparent, rgba(6, 182, 212, 0.2), transparent);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;  /* ADD THIS LINE */
}

.bot-card:hover::before {
    opacity: 1;
}
</style>