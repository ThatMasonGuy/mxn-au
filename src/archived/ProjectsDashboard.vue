<!-- src/components/mxn/ProjectsDashboard.vue -->
<template>
    <section id="dashboard" class="bg-gray-900 py-16">
        <h2 class="text-4xl font-bold text-blue-300 text-center mb-12">Explore Mason's Mind</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
            <div class="hover-card glass p-6 rounded-2xl">
                <h3 class="text-xl font-semibold text-blue-200 mb-2">🖥️ Minecraft Admin Dashboard</h3>
                <p class="text-sm text-gray-400">Multi-region sync, console filtering, permission manager, and live
                    stats.</p>
            </div>
            <div class="hover-card glass p-6 rounded-2xl">
                <h3 class="text-xl font-semibold text-blue-200 mb-2">🌐 Translation Discord Bot</h3>
                <p class="text-sm text-gray-400">Real-time flag-based translation with Redis cache, API triage, and
                    async queueing.</p>
            </div>
            <div class="hover-card glass p-6 rounded-2xl">
                <h3 class="text-xl font-semibold text-blue-200 mb-2">🛠️ Plugin Updater Tool</h3>
                <p class="text-sm text-gray-400">Python GUI to SCP plugin updates across global servers. Modern
                    interface with logging.</p>
            </div>
        </div>
    </section>
</template>