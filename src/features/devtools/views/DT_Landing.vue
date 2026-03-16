<template>
    <div class="min-h-screen bg-gray-900 text-gray-200 font-mono">
        <!-- Navigation -->
        <nav
            class="fixed w-full px-4 py-3 flex justify-between items-center z-50 bg-gray-900 bg-opacity-80 backdrop-blur-sm border-b border-gray-800">
            <div class="text-xl font-bold tracking-tight text-blue-400">mxn.au/devtools</div>
            <button @click="scrollToSection('cta')"
                class="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-400/30">Launch</button>
        </nav>

        <!-- Hero Section -->
        <section id="hero"
            class="relative pt-24 pb-20 px-4 flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <!-- Animated background grid -->
            <div class="absolute inset-0 z-0 grid-background"></div>

            <div class="relative z-10 max-w-4xl mx-auto text-center">
                <h1 class="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Developer
                        Tools Dashboard</span>
                </h1>
                <p class="text-xl md:text-2xl text-gray-400 mb-12">Internal utilities to automate, debug, and deploy
                    faster.</p>
                <div class="flex justify-center">
                    <button @click="scrollToSection('tools')"
                        class="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md font-medium text-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30">
                        Enter DevTools
                        <span
                            class="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></span>
                    </button>
                </div>

                <!-- Floating animated elements -->
                <div class="relative h-64 mt-16">
                    <div v-for="(box, index) in floatingBoxes" :key="index"
                        :class="'absolute w-12 h-12 bg-opacity-20 rounded-md transform transition-all duration-3000 ease-in-out animate-float-' + index"
                        :style="{
                            backgroundColor: box.color,
                            boxShadow: `0 0 30px ${box.color}33`,
                            left: box.left + '%',
                            top: box.top + '%'
                        }">
                    </div>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="relative py-20 px-4">
            <div class="max-w-4xl mx-auto">
                <div
                    class="p-6 md:p-8 bg-gray-800 bg-opacity-60 rounded-xl border border-gray-700 backdrop-blur-sm relative overflow-hidden shadow-xl">
                    <!-- Gradient accent -->
                    <div class="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
                    <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500 opacity-20 rounded-full blur-3xl">
                    </div>

                    <h2
                        class="text-2xl md:text-3xl font-bold mb-6 relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
                        What's This All About?</h2>

                    <div class="space-y-4 relative z-10">
                        <p>This isn't a product or service - it's <span class="text-blue-400">my personal command
                                center</span>. A collection of utilities I've built to make my dev workflow smoother and
                            faster.</p>

                        <p>Think of it as the digital equivalent of that chaotic-but-functional workspace where
                            everything is exactly where I need it:</p>

                        <ul class="list-disc pl-5 space-y-2 text-gray-300">
                            <li>Upload and transform JSON files for quick data manipulation</li>
                            <li>Merge and patch Firestore collections without context switching</li>
                            <li>Track debug sessions across multiple projects</li>
                            <li>Generate command chains for common deployment tasks</li>
                            <li>Access environment variables and configs without digging through files</li>
                        </ul>

                        <div class="pt-2">
                            <p class="text-sm text-gray-400 border-l-2 border-blue-500 pl-3 italic">No sign-ups, no
                                tracking, no cloud storage - everything runs locally and stays on my machine.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Divider -->
        <div class="relative h-24 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 z-10"></div>
            <div
                class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent blur-xl">
            </div>
        </div>

        <!-- Tools Preview Section -->
        <section id="tools" class="relative py-20 px-4 bg-gray-800">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-2xl md:text-3xl font-bold mb-2 text-center">Tool Collection</h2>
                <p class="text-gray-400 text-center mb-12">Quick access to everything I need</p>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="(tool, index) in tools" :key="index"
                        class="tool-card group relative p-5 rounded-lg border border-gray-700 bg-gray-900 transition-all duration-300 hover:border-blue-500/50 overflow-hidden">
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        </div>
                        <div
                            class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 w-0 group-hover:w-full transition-all duration-500">
                        </div>

                        <div class="relative z-10">
                            <div class="flex items-center mb-4">
                                <div
                                    class="w-10 h-10 rounded-md bg-blue-900/30 flex items-center justify-center text-blue-400 border border-blue-700/50">
                                    <component :is="tool.icon" />
                                </div>
                                <h3 class="ml-3 text-lg font-semibold">{{ tool.name }}</h3>
                            </div>

                            <p class="text-gray-400 mb-4">{{ tool.description }}</p>

                            <div class="flex items-center text-xs text-gray-500">
                                <span class="px-2 py-1 rounded-md bg-gray-800 mr-2">{{ tool.type }}</span>
                                <span v-if="tool.status === 'active'" class="flex items-center">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                    Active
                                </span>
                                <span v-else class="flex items-center">
                                    <span class="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                                    {{ tool.status }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Final CTA Section -->
        <section id="cta" class="relative py-20 px-4">
            <div class="max-w-4xl mx-auto text-center">
                <div
                    class="p-8 rounded-2xl border border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg relative overflow-hidden">
                    <!-- Decorative elements -->
                    <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-600 rounded-full opacity-10 blur-3xl">
                    </div>
                    <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-600 rounded-full opacity-10 blur-3xl">
                    </div>

                    <div class="relative z-10">
                        <h2 class="text-2xl md:text-3xl font-bold mb-4">Built By Devs, For Devs</h2>
                        <p class="text-gray-400 mb-8 max-w-xl mx-auto">No marketing BS, no analytics, no user accounts.
                            Just tools that make your workflow faster. Because your time is better spent building cool
                            stuff than fighting with your tools.</p>

                        <button @click="launchTools"
                            class="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md font-medium text-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30">
                            Launch DevTools
                            <span
                                class="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></span>
                        </button>

                        <p class="mt-6 text-sm text-gray-500">Self-hosted. No connection required. v1.4.2</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="py-6 px-4 border-t border-gray-800">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
                <div class="text-sm text-gray-500 mb-4 md:mb-0">
                    mxn.au/devtools — Last updated: April 2025
                </div>
                <div class="flex space-x-4">
                    <button class="text-gray-500 hover:text-blue-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                    <button class="text-gray-500 hover:text-blue-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <button class="text-gray-500 hover:text-blue-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  ChartBarIcon,
  CloudIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  CircleStackIcon,
  CommandLineIcon,
} from '@heroicons/vue/24/outline'

// Floating animation boxes
const floatingBoxes = ref([
    { color: '#3b82f6', left: 20, top: 20, speed: 3 },
    { color: '#6366f1', left: 50, top: 50, speed: 4 },
    { color: '#4f46e5', left: 80, top: 30, speed: 5 },
    { color: '#2563eb', left: 30, top: 70, speed: 3.5 },
    { color: '#4338ca', left: 70, top: 80, speed: 4.5 },
]);

// Tools collection
const tools = [
    {
        name: 'Firestore Uploader',
        description: 'Batch upload and merge JSON data into Firestore collections without writing code every time.',
        icon: CircleStackIcon,
        type: 'Database',
        status: 'active'
    },
    {
        name: 'Command Builder',
        description: 'Compose and save complex command chains for deployments, builds, and migrations.',
        icon: CommandLineIcon,
        type: 'CLI',
        status: 'active'
    },
    {
        name: 'Session Tracker',
        description: 'Track debug sessions across multiple projects and environments with timestamps.',
        icon: ChartBarIcon,
        type: 'Monitoring',
        status: 'active'
    },
    {
        name: 'Schema Validator',
        description: 'Validate JSON data against schema definitions before pushing to production.',
        icon: DocumentTextIcon,
        type: 'Testing',
        status: 'testing'
    },
    {
        name: 'API Playground',
        description: 'Test API endpoints with saved request templates and environment variables.',
        icon: CloudIcon,
        type: 'API',
        status: 'active'
    },
    {
        name: 'Snippet Vault',
        description: 'Store and organize code snippets with syntax highlighting and search.',
        icon: CodeBracketIcon,
        type: 'Utility',
        status: 'beta'
    }
];

// Scroll to section
const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

// Launch tools action
const launchTools = () => {
    // In a real app, this would navigate to the actual dashboard
    alert('Launching developer tools dashboard...');
};

onMounted(() => {
    // Add animations here if needed
});
</script>

<style>
/* Grid background animation */
.grid-background {
    background-image: linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: grid-move 15s linear infinite;
}

@keyframes grid-move {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: 50px 50px;
    }
}

/* Floating animations for boxes */
@keyframes float-0 {

    0%,
    100% {
        transform: translate(0, 0) rotate(0deg);
    }

    25% {
        transform: translate(10px, -15px) rotate(5deg);
    }

    50% {
        transform: translate(20px, 0) rotate(0deg);
    }

    75% {
        transform: translate(10px, 15px) rotate(-5deg);
    }
}

@keyframes float-1 {

    0%,
    100% {
        transform: translate(0, 0) rotate(0deg);
    }

    25% {
        transform: translate(-15px, 10px) rotate(-5deg);
    }

    50% {
        transform: translate(0, 20px) rotate(0deg);
    }

    75% {
        transform: translate(15px, 10px) rotate(5deg);
    }
}

@keyframes float-2 {

    0%,
    100% {
        transform: translate(0, 0) rotate(0deg);
    }

    33% {
        transform: translate(-10px, -10px) rotate(-3deg);
    }

    66% {
        transform: translate(10px, -10px) rotate(3deg);
    }
}

@keyframes float-3 {

    0%,
    100% {
        transform: translate(0, 0) rotate(0deg);
    }

    33% {
        transform: translate(10px, 15px) rotate(5deg);
    }

    66% {
        transform: translate(-10px, 15px) rotate(-5deg);
    }
}

@keyframes float-4 {

    0%,
    100% {
        transform: translate(0, 0) rotate(0deg);
    }

    20% {
        transform: translate(-5px, -8px) rotate(-3deg);
    }

    40% {
        transform: translate(10px, -5px) rotate(5deg);
    }

    60% {
        transform: translate(5px, 10px) rotate(3deg);
    }

    80% {
        transform: translate(-10px, 5px) rotate(-5deg);
    }
}

.animate-float-0 {
    animation: float-0 10s ease-in-out infinite;
}

.animate-float-1 {
    animation: float-1 12s ease-in-out infinite;
}

.animate-float-2 {
    animation: float-2 14s ease-in-out infinite;
}

.animate-float-3 {
    animation: float-3 16s ease-in-out infinite;
}

.animate-float-4 {
    animation: float-4 18s ease-in-out infinite;
}
</style>