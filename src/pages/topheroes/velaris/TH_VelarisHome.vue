<template>
    <div
        class="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800 text-white font-sans px-6 py-12 space-y-16">
        <!-- Hero Section -->
        <section class="max-w-5xl mx-auto text-center animate-fade-in space-y-6">
            <h1
                class="text-5xl sm:text-6xl font-extrabold leading-tight bg-gradient-to-r from-pink-500 to-violet-400 bg-clip-text text-transparent">
                🌌 Welcome to Velaris
            </h1>
            <p class="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
                The home of strategy, strength, and unity in <span class="font-bold text-indigo-200">TopHeroes</span>.
                Join us as we conquer GvG, KvK, and beyond.
            </p>
            <RouterLink to="/topheroes/velaris/events"
                class="inline-block bg-pink-600 hover:bg-pink-500 text-white text-lg font-semibold px-6 py-3 mt-4 rounded-xl shadow-lg transition-all duration-300">
                🔥 Check Out Our Event Data
            </RouterLink>
        </section>

        <!-- Info Cards -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-slide-fade">
            <div
                class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-purple-700 transition-all">
                <h3 class="text-2xl font-bold mb-2 text-pink-300">📈 Live Event Tracking</h3>
                <p class="text-white/80">Stay updated with our real-time data on server-wide events and member progress.
                </p>
            </div>

            <div
                class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-pink-700 transition-all">
                <h3 class="text-2xl font-bold mb-2 text-violet-300">🎯 Strategic Playbooks</h3>
                <p class="text-white/80">Access detailed guides and tactics written by top-tier Velaris strategists.</p>
            </div>

            <div
                class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-indigo-700 transition-all">
                <h3 class="text-2xl font-bold mb-2 text-indigo-300">💬 Discord Community</h3>
                <p class="text-white/80">Join the discussion, share insights, and coordinate directly with fellow
                    guildmates.</p>
            </div>
        </section>

        <!-- Call to Action -->
        <section class="text-center animate-fade-in delay-300">
            <p class="text-lg sm:text-xl text-white/70 mb-6">Want to join Velaris or contribute to the dashboard?</p>
            <a href="https://discord.gg/th-vlr" target="_blank"
                class="inline-block px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl hover:from-purple-500 hover:to-pink-500 transition-all">
                💠 Join Us on Discord
            </a>
        </section>
    </div>
</template>

<script setup>
// Sexy landing page – no data logic needed 😎
</script>

<style scoped>
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
    animation: fade-in 0.8s ease both;
}

@keyframes slide-fade {
    from {
        opacity: 0;
        transform: translateX(10px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-slide-fade {
    animation: slide-fade 0.6s ease both;
}
</style>