<template>
    <div
        class="minecraft-panel min-h-screen bg-gradient-to-b from-stone-900 via-gray-900 to-stone-900 text-gray-200 font-minecraft relative overflow-hidden">
        <!-- Floating particles background -->
        <div class="particles-container">
            <div v-for="i in 20" :key="i" class="particle" :style="getRandomParticleStyle()"></div>
        </div>

        <!-- Header Section -->
        <header class="relative z-10 pt-8 pb-6 px-4">
            <div class="max-w-6xl mx-auto">
                <nav class="flex items-center justify-between mb-12">
                    <div class="flex items-center">
                        <div
                            class="w-10 h-10 bg-green-600 rounded-sm mr-3 flex items-center justify-center shadow-glow">
                            <div class="w-8 h-8 bg-green-700 rounded-sm flex items-center justify-center">
                                <div class="w-6 h-6 bg-green-800 rounded-sm"></div>
                            </div>
                        </div>
                        <h1 class="text-2xl font-bold tracking-wider text-green-400">MXN<span
                                class="text-gray-400">.AU</span></h1>
                    </div>

                    <div class="hidden md:flex space-x-8">
                        <a href="#features"
                            class="hover:text-green-400 transition-colors duration-300 font-medium">Features</a>
                        <a href="#regions"
                            class="hover:text-green-400 transition-colors duration-300 font-medium">Regions</a>
                        <a href="#dashboard"
                            class="hover:text-green-400 transition-colors duration-300 font-medium">Dashboard</a>
                    </div>

                    <div>
                        <button
                            class="minecraft-button px-6 py-2 bg-green-700 hover:bg-green-600 transition-colors duration-300 text-white font-medium shadow-md">
                            Login
                        </button>
                    </div>
                </nav>
            </div>
        </header>

        <!-- Hero Section -->
        <section class="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 min-h-[60vh]">
            <div class="max-w-3xl">
                <h1 class="text-5xl md:text-6xl font-extrabold text-green-300 pixel-shadow leading-tight mb-6">
                    Minecraft Server<br>
                    <span class="text-white">Admin Dashboard</span>
                </h1>
                <p class="text-lg md:text-xl text-gray-300 max-w-xl mx-auto mb-8">
                    A self-hosted control panel to manage your own Minecraft servers across the globe. Built for control
                    — no hosting, no fees, no limits.
                </p>
                <div class="flex flex-wrap justify-center gap-4">
                    <button @click="$router.push('/minecraft/setup')" 
                        class="minecraft-button px-8 py-3 bg-green-600 hover:bg-green-500 transition-colors duration-300 text-white font-bold shadow-lg border-b-4 border-green-800">
                        Get Started
                    </button>
                    <button
                        class="minecraft-button px-8 py-3 bg-gray-700 hover:bg-gray-600 transition-colors duration-300 text-white font-bold shadow-lg border-b-4 border-gray-900">
                        View Demo
                    </button>
                </div>
            </div>
        </section>

        <!-- Separator -->
        <div class="separator">
            <div class="h-px w-full bg-gradient-to-r from-transparent via-green-700 to-transparent opacity-60 my-12">
            </div>
        </div>

        <!-- Features -->
        <section id="features" class="features relative z-10 px-4 py-16 bg-stone-900 bg-opacity-60">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-3xl font-bold mb-12 text-center text-green-400 pixel-shadow">Server Management Features
                </h2>

                <div class="grid md:grid-cols-3 gap-6">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-3 text-green-300">Real-time Monitoring</h3>
                        <p class="text-gray-400">Track server performance, player activity, and resource usage across
                            all your instances in real-time.</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-3 text-green-300">Multi-Region Support</h3>
                        <p class="text-gray-400">Manage servers across different geographical regions from a single,
                            unified dashboard.</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-3 text-green-300">One-Click Deployments</h3>
                        <p class="text-gray-400">Install plugins, update configs, and deploy server changes with a
                            single click across all instances.</p>
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-6 mt-8">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-3 text-green-300">Player Management</h3>
                        <p class="text-gray-400">Manage permissions, bans, and whitelists across all your servers from
                            one interface.</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-3 text-green-300">Performance Analytics</h3>
                        <p class="text-gray-400">Detailed metrics and analytics to optimize your server performance and
                            resource allocation.</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-3 text-green-300">Automated Alerts</h3>
                        <p class="text-gray-400">Get notified about performance issues, player activity, and critical
                            events in real-time.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Separator -->
        <div class="separator">
            <div class="h-px w-full bg-gradient-to-r from-transparent via-green-700 to-transparent opacity-60 my-12">
            </div>
        </div>

        <!-- Regions Section -->
        <section id="regions" class="regions relative z-10 px-4 py-16">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-3xl font-bold mb-12 text-center text-green-400 pixel-shadow">Global Server Regions</h2>

                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="region-card">
                        <div class="region-flag">
                            <div class="bg-green-700 p-2 rounded-t text-center">
                                <span class="block text-xs uppercase tracking-wider">Australia</span>
                            </div>
                        </div>
                        <div class="region-details">
                            <h4 class="text-lg font-bold mb-2">Sydney</h4>
                            <div class="flex items-center space-x-2 mb-1">
                                <div class="w-2 h-2 bg-green-400 rounded-full pulse"></div>
                                <span class="text-green-400 text-sm">Online</span>
                            </div>
                            <p class="text-sm text-gray-400">12 Servers Active</p>
                            <p class="text-sm text-gray-400">24ms Latency</p>
                        </div>
                    </div>

                    <div class="region-card">
                        <div class="region-flag">
                            <div class="bg-green-700 p-2 rounded-t text-center">
                                <span class="block text-xs uppercase tracking-wider">USA</span>
                            </div>
                        </div>
                        <div class="region-details">
                            <h4 class="text-lg font-bold mb-2">Los Angeles</h4>
                            <div class="flex items-center space-x-2 mb-1">
                                <div class="w-2 h-2 bg-green-400 rounded-full pulse"></div>
                                <span class="text-green-400 text-sm">Online</span>
                            </div>
                            <p class="text-sm text-gray-400">18 Servers Active</p>
                            <p class="text-sm text-gray-400">82ms Latency</p>
                        </div>
                    </div>

                    <div class="region-card">
                        <div class="region-flag">
                            <div class="bg-green-700 p-2 rounded-t text-center">
                                <span class="block text-xs uppercase tracking-wider">Europe</span>
                            </div>
                        </div>
                        <div class="region-details">
                            <h4 class="text-lg font-bold mb-2">Frankfurt</h4>
                            <div class="flex items-center space-x-2 mb-1">
                                <div class="w-2 h-2 bg-green-400 rounded-full pulse"></div>
                                <span class="text-green-400 text-sm">Online</span>
                            </div>
                            <p class="text-sm text-gray-400">15 Servers Active</p>
                            <p class="text-sm text-gray-400">110ms Latency</p>
                        </div>
                    </div>

                    <div class="region-card">
                        <div class="region-flag">
                            <div class="bg-green-700 p-2 rounded-t text-center">
                                <span class="block text-xs uppercase tracking-wider">Asia</span>
                            </div>
                        </div>
                        <div class="region-details">
                            <h4 class="text-lg font-bold mb-2">Singapore</h4>
                            <div class="flex items-center space-x-2 mb-1">
                                <div class="w-2 h-2 bg-green-400 rounded-full pulse"></div>
                                <span class="text-green-400 text-sm">Online</span>
                            </div>
                            <p class="text-sm text-gray-400">10 Servers Active</p>
                            <p class="text-sm text-gray-400">68ms Latency</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Separator -->
        <div class="separator">
            <div class="h-px w-full bg-gradient-to-r from-transparent via-green-700 to-transparent opacity-60 my-12">
            </div>
        </div>

        <!-- Dashboard Preview -->
        <section id="dashboard" class="dashboard-preview relative z-10 px-4 py-16">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-3xl font-bold mb-12 text-center text-green-400 pixel-shadow">Admin Dashboard</h2>

                <div
                    class="dashboard-screenshot bg-stone-800 bg-opacity-50 rounded-lg p-3 border border-green-900 shadow-lg">
                    <div
                        class="dashboard-header bg-stone-900 p-4 rounded-t-lg border-b border-green-800 flex justify-between items-center">
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                            <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span class="text-xs text-gray-400">mxn.au/minecraft/dashboard</span>
                        </div>
                        <div class="flex items-center space-x-4">
                            <div class="w-4 h-4 bg-green-600 rounded-sm"></div>
                            <div class="w-4 h-4 bg-green-600 rounded-sm"></div>
                            <div class="w-4 h-4 bg-green-600 rounded-sm"></div>
                        </div>
                    </div>

                    <div class="dashboard-content grid grid-cols-12 gap-4 p-4 bg-gray-900 rounded-b-lg">
                        <div class="col-span-3 bg-stone-800 p-3 rounded-lg border border-stone-700">
                            <div class="text-sm font-bold mb-3 text-gray-300">Servers</div>
                            <div class="space-y-2">
                                <div class="p-2 bg-green-900 bg-opacity-20 rounded border border-green-800 text-xs">
                                    Sydney-01</div>
                                <div class="p-2 bg-green-900 bg-opacity-20 rounded border border-green-800 text-xs">
                                    Sydney-02</div>
                                <div class="p-2 bg-green-900 bg-opacity-20 rounded border border-green-800 text-xs">
                                    LA-Main</div>
                                <div class="p-2 bg-red-900 bg-opacity-20 rounded border border-red-800 text-xs">
                                    Frankfurt-PVP</div>
                            </div>
                        </div>

                        <div class="col-span-9 bg-stone-800 p-3 rounded-lg border border-stone-700">
                            <div class="text-sm font-bold mb-3 text-gray-300">Server Metrics</div>
                            <div class="h-32 w-full bg-stone-900 rounded-lg flex items-center justify-center">
                                <div class="fake-chart">
                                    <div class="fake-line-green"></div>
                                    <div class="fake-line-blue"></div>
                                    <div class="fake-line-orange"></div>
                                </div>
                            </div>

                            <div class="grid grid-cols-4 gap-3 mt-3">
                                <div class="bg-stone-900 p-2 rounded text-center">
                                    <div class="text-xs text-gray-400">CPU</div>
                                    <div class="text-lg font-bold text-green-400">42%</div>
                                </div>
                                <div class="bg-stone-900 p-2 rounded text-center">
                                    <div class="text-xs text-gray-400">RAM</div>
                                    <div class="text-lg font-bold text-green-400">3.2GB</div>
                                </div>
                                <div class="bg-stone-900 p-2 rounded text-center">
                                    <div class="text-xs text-gray-400">Players</div>
                                    <div class="text-lg font-bold text-green-400">42/100</div>
                                </div>
                                <div class="bg-stone-900 p-2 rounded text-center">
                                    <div class="text-xs text-gray-400">Uptime</div>
                                    <div class="text-lg font-bold text-green-400">5d 14h</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="cta relative z-10 px-4 py-24 bg-green-900 bg-opacity-20 mt-12">
            <div class="max-w-4xl mx-auto text-center">
                <h2 class="text-3xl font-bold mb-6 text-green-300 pixel-shadow">Ready to Take Control?</h2>
                <p class="text-lg text-gray-300 mb-8">Manage your own Minecraft servers across the globe with ease and
                    style — no hosting lock-in, no nonsense.</p>
                <button
                    class="minecraft-button px-8 py-4 bg-green-600 hover:bg-green-500 transition-colors duration-300 text-white font-bold shadow-lg border-b-4 border-green-800 text-lg mx-auto">
                    Open Dashboard
                </button>
            </div>
        </section>

        <!-- Footer -->
        <footer class="relative z-10 px-4 py-12 bg-stone-900">
            <div class="max-w-6xl mx-auto text-center">
                <div class="flex items-center justify-center mb-4">
                    <div class="w-8 h-8 bg-green-600 rounded-sm mr-2 flex items-center justify-center shadow-glow">
                        <div class="w-6 h-6 bg-green-700 rounded-sm flex items-center justify-center">
                            <div class="w-4 h-4 bg-green-800 rounded-sm"></div>
                        </div>
                    </div>
                    <h1 class="text-xl font-bold text-green-400">MXN<span class="text-gray-400">.AU</span></h1>
                </div>
                <p class="text-sm text-gray-400 max-w-xl mx-auto">
                    MXN.AU is a custom-built dashboard for Minecraft server operators. Link your servers, enter your
                    access details, and manage everything from one place. No hosting. No monthly cost. Just control.
                </p>
                <div class="border-t border-green-900 mt-8 pt-8 text-center text-sm text-gray-500">
                    &copy; 2025 MXN.AU. All rights reserved. Not affiliated with Mojang AB.
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
const getRandomParticleStyle = () => {
    const size = Math.floor(Math.random() * 4) + 2
    const top = Math.floor(Math.random() * 100)
    const left = Math.floor(Math.random() * 100)
    const delay = Math.random() * 5
    const duration = Math.random() * 10 + 15
    const opacity = Math.random() * 0.5 + 0.1

    return {
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}%`,
        left: `${left}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        opacity
    }
}
</script>

<style>
/* Custom Minecraft-inspired styles */
@font-face {
    font-family: 'MinecraftFont';
    src: url('https://cdn.jsdelivr.net/npm/minecraft-font@1.0.0/font/minecraft.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}

.font-minecraft {
    font-family: 'MinecraftFont', 'Courier New', monospace;
}

/* Shadow effect for pixelated text */
.pixel-shadow {
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.8);
}

/* Minecraft-style button */
.minecraft-button {
    position: relative;
    display: inline-block;
    border-radius: 2px;
    transition: all 0.2s;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.9rem;
}

.minecraft-button:active {
    transform: translateY(2px);
    border-bottom-width: 2px;
}

/* Feature cards */
.feature-card {
    background-color: rgba(39, 39, 39, 0.4);
    border: 1px solid rgba(74, 85, 74, 0.4);
    padding: 1.5rem;
    border-radius: 0.5rem;
    transition: all 0.3s;
}

.feature-card:hover {
    border-color: rgba(74, 222, 128, 0.3);
    box-shadow: 0 0 15px rgba(74, 222, 128, 0.15);
}

.feature-icon {
    background-color: rgba(22, 101, 52, 0.3);
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    color: #4ade80;
}

/* Region cards */
.region-card {
    background-color: rgba(39, 39, 39, 0.4);
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid rgba(74, 85, 74, 0.4);
    transition: all 0.3s;
}

.region-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}

.region-details {
    padding: 1rem;
}

/* Glow effect */
.shadow-glow {
    box-shadow: 0 0 10px rgba(74, 222, 128, 0.3);
}

/* Particles animation */
.particles-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
}

.particle {
    position: absolute;
    background-color: rgba(74, 222, 128, 0.5);
    border-radius: 50%;
    animation: float linear infinite;
}

@keyframes float {
    0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }

    10% {
        opacity: 1;
    }

    90% {
        opacity: 1;
    }

    100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
    }
}

/* Fake chart for dashboard preview */
.fake-chart {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    padding: 0 1rem;
}

.fake-line-green,
.fake-line-blue,
.fake-line-orange {
    position: absolute;
    height: 2px;
    width: 90%;
    left: 5%;
    opacity: 0.7;
}

.fake-line-green {
    background: linear-gradient(90deg, transparent, #4ade80, transparent);
    top: 40%;
}

.fake-line-blue {
    background: linear-gradient(90deg, transparent, #38bdf8, transparent);
    top: 65%;
}

.fake-line-orange {
    background: linear-gradient(90deg, transparent, #fb923c, transparent);
    top: 25%;
}

/* Pulse animation for server status indicators */
.pulse {
    animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
    0% {
        box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
    }

    70% {
        box-shadow: 0 0 0 6px rgba(74, 222, 128, 0);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
    }
}
</style>