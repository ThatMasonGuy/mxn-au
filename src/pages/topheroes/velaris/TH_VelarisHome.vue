<template>
    <div
        class="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800 text-white font-sans pb-12 relative overflow-hidden">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div v-for="i in 8" :key="i"
                class="absolute rounded-full bg-gradient-to-r from-pink-500/20 to-violet-500/20 blur-3xl animate-float"
                :style="{
                    width: `${Math.random() * 30 + 10}rem`,
                    height: `${Math.random() * 30 + 10}rem`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 10 + 20}s`,
                    animationDelay: `${Math.random() * 5}s`
                }">
            </div>
        </div>

        <!-- Navigation Bar -->
        <nav class="relative -mt-12 z-10 px-6 py-4 flex justify-between items-center backdrop-blur-sm bg-black/10">
            <div class="flex items-center">
                <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center mr-3">
                    <span class="text-xl font-bold">V</span>
                </div>
                <span
                    class="text-xl font-bold bg-gradient-to-r from-pink-400 to-violet-300 bg-clip-text text-transparent">
                    Velaris
                </span>
            </div>

            <div class="flex items-center space-x-4">
                <RouterLink to="/events" class="text-white/80 hover:text-white transition-colors px-2">Events
                </RouterLink>
                <RouterLink to="/guides" class="text-white/80 hover:text-white transition-colors px-2">Guides
                </RouterLink>
                <RouterLink to="/members" class="text-white/80 hover:text-white transition-colors px-2">Members
                </RouterLink>
                <RouterLink to="/admin"
                    class="ml-2 flex items-center space-x-1 px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all group">
                    <span>Admin</span>
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </RouterLink>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="max-w-5xl mx-auto text-center space-y-6 px-6 py-16 relative z-10 animate-fade-in">
            <div class="inline-block animate-pulse-slow">
                <div class="p-1 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full inline-block mb-3">
                    <div class="bg-indigo-950 p-1 rounded-full">
                        <span class="px-4 py-1 text-sm font-medium">TOP HEROES GUILD</span>
                    </div>
                </div>
            </div>

            <h1
                class="text-5xl sm:text-7xl font-extrabold leading-tight bg-gradient-to-r from-pink-500 via-purple-400 to-violet-400 bg-clip-text text-transparent animate-shimmer">
                Welcome to Velaris
            </h1>

            <p class="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto animate-fade-in-delay">
                The home of strategy, strength, and unity in <span class="font-bold text-indigo-200">TopHeroes</span>.
                Join us as we conquer GvG, KvK, and beyond.
            </p>

            <div class="flex flex-wrap justify-center gap-4 mt-8 animate-fade-in-delay-2">
                <RouterLink to="/topheroes/velaris/events"
                    class="inline-flex items-center bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white text-lg font-semibold px-6 py-3 rounded-xl shadow-glow-pink transition-all duration-300 group">
                    <span>🔥 Check Events</span>
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </RouterLink>

                <button
                    class="inline-flex items-center bg-transparent border border-purple-500/50 hover:border-purple-400 text-white text-lg font-semibold px-6 py-3 rounded-xl transition-all duration-300">
                    Learn More
                </button>
            </div>
        </section>

        <!-- Stats Counter -->
        <section class="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 px-6 py-8 animate-fade-in-delay-3">
            <div class="text-center">
                <div
                    class="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    90+</div>
                <div class="text-white/70 text-sm mt-1">Active Members</div>
            </div>
            <div class="text-center">
                <div
                    class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                    #5</div>
                <div class="text-white/70 text-sm mt-1">Guild Ranking</div>
            </div>
            <div class="text-center">
                <div
                    class="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    8</div>
                <div class="text-white/70 text-sm mt-1">GvG Victories</div>
            </div>
            <div class="text-center">
                <div
                    class="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                    24/7</div>
                <div class="text-white/70 text-sm mt-1">Support</div>
            </div>
        </section>

        <!-- Info Cards -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 py-12">
            <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:-translate-y-2 hover:shadow-pink-700/30 transition-all duration-500 animate-slide-fade"
                style="animation-delay: 0.2s">
                <div
                    class="bg-gradient-to-br from-pink-500 to-pink-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-glow-pink">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h3 class="text-2xl font-bold mb-2 text-pink-300">Live Event Tracking</h3>
                <p class="text-white/80">Stay updated with our real-time data on server-wide events and member progress.
                </p>
                <RouterLink to="/events" class="inline-flex items-center mt-4 text-pink-400 hover:text-pink-300 group">
                    <span>View events</span>
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </RouterLink>
            </div>

            <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:-translate-y-2 hover:shadow-violet-700/30 transition-all duration-500 animate-slide-fade"
                style="animation-delay: 0.4s">
                <div
                    class="bg-gradient-to-br from-violet-500 to-violet-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-glow-violet">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h3 class="text-2xl font-bold mb-2 text-violet-300">Strategic Playbooks</h3>
                <p class="text-white/80">Access detailed guides and tactics written by top-tier Velaris strategists.</p>
                <RouterLink to="/guides"
                    class="inline-flex items-center mt-4 text-violet-400 hover:text-violet-300 group">
                    <span>Browse guides</span>
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </RouterLink>
            </div>

            <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:-translate-y-2 hover:shadow-indigo-700/30 transition-all duration-500 animate-slide-fade"
                style="animation-delay: 0.6s">
                <div
                    class="bg-gradient-to-br from-indigo-500 to-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-glow-indigo">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                </div>
                <h3 class="text-2xl font-bold mb-2 text-indigo-300">Discord Community</h3>
                <p class="text-white/80">Join the discussion, share insights, and coordinate directly with fellow
                    guildmates.</p>
                <a href="https://discord.gg/th-vlr" target="_blank"
                    class="inline-flex items-center mt-4 text-indigo-400 hover:text-indigo-300 group">
                    <span>Join Discord</span>
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        </section>

        <!-- Call to Action -->
        <section class="text-center px-6 py-12 max-w-4xl mx-auto relative z-10 animate-fade-in-delay-4">
            <div
                class="bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-pink-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
                <h2
                    class="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                    Ready to Dominate?</h2>
                <p class="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
                    Want to join Velaris or contribute to our growing community of elite players?
                </p>
                <div class="flex flex-wrap justify-center gap-4">
                    <a href="https://discord.gg/th-vlr" target="_blank"
                        class="inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-xl hover:from-purple-500 hover:to-pink-500 transition-all group">
                        <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.883-.608 1.283a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.283.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z">
                            </path>
                        </svg>
                        <span>Join Us on Discord</span>
                    </a>
                    <RouterLink to="/apply"
                        class="inline-flex items-center px-8 py-3 text-lg font-semibold border border-purple-500 text-white rounded-xl hover:bg-purple-500/20 transition-all group">
                        <span>Apply to Guild</span>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </RouterLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
// Enhanced sleek landing page with animations 🔥
</script>

<style scoped>
/* Base Animations */
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.8s ease-out both;
}

.animate-fade-in-delay {
    animation: fade-in 0.8s ease-out 0.3s both;
}

.animate-fade-in-delay-2 {
    animation: fade-in 0.8s ease-out 0.6s both;
}

.animate-fade-in-delay-3 {
    animation: fade-in 0.8s ease-out 0.9s both;
}

.animate-fade-in-delay-4 {
    animation: fade-in 0.8s ease-out 1.2s both;
}

@keyframes slide-fade {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-fade {
    animation: slide-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Floating animation for background elements */
@keyframes float {
    0% {
        transform: translateY(0) translateX(0);
    }

    33% {
        transform: translateY(-5%) translateX(3%);
    }

    66% {
        transform: translateY(5%) translateX(-3%);
    }

    100% {
        transform: translateY(0) translateX(0);
    }
}

.animate-float {
    animation: float 15s ease-in-out infinite;
}

/* Slow pulse animation */
@keyframes pulse-slow {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }
}

.animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
}

/* Shimmer animation for text */
@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

.animate-shimmer {
    background-size: 200% auto;
    animation: shimmer 6s linear infinite;
}

/* Glow effects */
.shadow-glow-pink {
    box-shadow: 0 0 15px 2px rgba(236, 72, 153, 0.3);
}

.shadow-glow-violet {
    box-shadow: 0 0 15px 2px rgba(139, 92, 246, 0.3);
}

.shadow-glow-indigo {
    box-shadow: 0 0 15px 2px rgba(99, 102, 241, 0.3);
}

/* Enhanced hover effects */
.hover\:shadow-glow-pink:hover {
    box-shadow: 0 0 20px 5px rgba(236, 72, 153, 0.4);
}
</style>