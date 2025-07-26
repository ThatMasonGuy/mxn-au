<template>
    <!-- Settings Button & Popover Container -->
    <div class="relative">
        <!-- Settings Button -->
        <button ref="settingsButton" @click="isSettingsOpen = !isSettingsOpen"
            class="group relative p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 text-white backdrop-blur-sm overflow-hidden">
            <!-- Animated background -->
            <div
                class="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>

            <!-- Icon -->
            <svg class="relative z-10 w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                </path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
        </button>

        <!-- Settings Popover -->
        <div ref="settingsPanel" v-show="isSettingsOpen"
            class="absolute top-full right-0 mt-3 z-50 w-96 max-w-[calc(100vw-2rem)] transition-all duration-300 animate-fade-in">
            <!-- Background blur effect -->
            <div
                class="absolute inset-0 backdrop-blur-2xl bg-slate-900/90 border border-white/10 rounded-3xl shadow-2xl">
            </div>

            <!-- Gradient overlay -->
            <div
                class="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-indigo-500/5 rounded-3xl">
            </div>

            <!-- Content -->
            <div class="relative z-10 p-6 space-y-6">
                <div class="flex items-center w-full pb-4 border-b border-white/10">
                    <!-- Logo + Settings Label -->
                    <div class="flex items-center gap-3">
                        <div
                            class="p-2 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm">
                            <!-- Settings SVG (unchanged) -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-sliders-vertical-icon lucide-sliders-vertical">
                                <line x1="4" x2="4" y1="21" y2="14" />
                                <line x1="4" x2="4" y1="10" y2="3" />
                                <line x1="12" x2="12" y1="21" y2="12" />
                                <line x1="12" x2="12" y1="8" y2="3" />
                                <line x1="20" x2="20" y1="21" y2="16" />
                                <line x1="20" x2="20" y1="12" y2="3" />
                                <line x1="2" x2="6" y1="14" y2="14" />
                                <line x1="10" x2="14" y1="8" y2="8" />
                                <line x1="18" x2="22" y1="16" y2="16" />
                            </svg>
                        </div>
                        <div>
                            <h3
                                class="text-lg font-bold bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
                                Settings
                            </h3>
                            <p class="text-sm text-white/60">Configure your translator</p>
                        </div>
                    </div>

                    <!-- Profile Icon (true right-aligned) -->
                    <div class="ml-auto flex items-center">
                        <router-link to="/login"
                            class="p-2 rounded-xl backdrop-blur-sm hover:bg-violet-600/30 transition-all duration-200 cursor-pointer flex items-center"
                            title="Profile / Login">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-user w-6 h-6 opacity-80 group-hover:opacity-100 transition-all">
                                <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </router-link>
                    </div>
                </div>

                <!-- API Key Section -->
                <div class="space-y-4">
                    <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                        <h4 class="text-sm font-semibold text-white/90">
                            API Configuration
                        </h4>
                    </div>

                    <div class="relative group">
                        <!-- Input container with gradient border -->
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        </div>

                        <div
                            class="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm group-hover:border-white/20 transition-all duration-300">
                            <div class="flex items-center h-12">
                                <!-- Add explicit height -->
                                <div
                                    class="h-full flex items-center justify-center px-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-r border-white/10">
                                    <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z">
                                        </path>
                                    </svg>
                                </div>
                                <input v-model="store.apiKey" :type="store.showApiKey ? 'text' : 'password'"
                                    placeholder="Enter your OpenAI API key"
                                    class="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/40 focus:outline-none" />
                                <button @click.stop="store.showApiKey = !store.showApiKey"
                                    class="h-full px-3 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center justify-center">
                                    <svg v-if="store.showApiKey" class="w-5 h-5" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .527-1.664 1.373-3.16 2.458-4.425L13.875 18.825z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M10.125 5.175A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7-.527 1.664-1.373-3.16-2.458 4.425L10.125 5.175z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 3l18 18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- API Key Info -->
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-xl"></div>
                        <div class="relative bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                            <div class="flex items-start space-x-3">
                                <div class="flex-shrink-0 mt-0.5">
                                    <div
                                        class="w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-info-icon lucide-info">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 16v-4" />
                                            <path d="M12 8h.01" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <p class="text-sm font-medium text-blue-300">
                                        Optional API Key
                                    </p>
                                    <p class="text-xs text-white/70 leading-relaxed">
                                        This app may be disabled if my sponsored API key runs out.
                                        Add your own OpenAI API key for uninterrupted service.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Preferences Section -->
                <div class="space-y-4">
                    <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        <h4 class="text-sm font-semibold text-white/90">Preferences</h4>
                    </div>

                    <!-- Auto-copy Toggle -->
                    <div class="relative group">
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        </div>

                        <div
                            class="relative bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm group-hover:border-white/20 transition-all duration-300">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <div class="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                                        <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-white">
                                            Auto-copy translations
                                        </p>
                                        <p class="text-xs text-white/60">
                                            Automatically copy to clipboard
                                        </p>
                                    </div>
                                </div>

                                <!-- Toggle Switch -->
                                <button @click="store.autoCopy = !store.autoCopy" :class="[
                                    'relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900',
                                    store.autoCopy
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25'
                                        : 'bg-white/20',
                                ]">
                                    <span :class="[
                                        'inline-block h-5 w-5 transform rounded-full shadow-lg transition-all duration-300',
                                        store.autoCopy
                                            ? 'translate-x-6 bg-white'
                                            : 'translate-x-1 bg-white/80',
                                    ]" />
                                    <!-- Glow effect when active -->
                                    <div v-if="store.autoCopy"
                                        class="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 blur-sm">
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Support Section -->
                <div class="space-y-4">
                    <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                        <h4 class="text-sm font-semibold text-white/90">Support</h4>
                    </div>

                    <!-- Coffee Button -->
                    <div class="relative group">
                        <div class="relative group">
                            <div
                                class="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            </div>

                            <a href="https://buymeacoffee.com/thatmasonguy" target="_blank" rel="noopener"
                                class="relative block w-full">
                                <div
                                    class="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 rounded-xl p-4 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-400/25 group-hover:scale-[1.02] transform">
                                    <div class="flex items-center justify-center space-x-3 -ml-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-coffee-icon lucide-coffee">
                                            <path d="M10 2v2" />
                                            <path d="M14 2v2" />
                                            <path
                                                d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
                                            <path d="M6 2v2" />
                                        </svg>
                                        <div class="text-center">
                                            <p class="text-lg font-bold text-gray-900">
                                                Buy me a coffee
                                            </p>
                                            <p class="text-sm text-gray-900/80">
                                                Support this project
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>

                    <!-- Support Message -->
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-xl">
                        </div>
                        <div class="relative bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                            <div class="flex items-start space-x-3">
                                <div class="flex-shrink-0 mt-0.5">
                                    <div
                                        class="w-5 h-5 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                                        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                                            </path>
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-yellow-300">
                                        Enjoying the app?
                                    </p>
                                    <p class="text-xs text-white/70 leading-relaxed mt-1">
                                        If you find this translator helpful, consider buying me a
                                        coffee to help keep it running!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useTranslateStore } from '@/stores/useTranslateStore'

const store = useTranslateStore()

// --- Component State ---
const isSettingsOpen = ref(false);

// --- Template Refs ---
const settingsButton = ref(null);
const settingsPanel = ref(null);

// --- Methods ---
const handleClickOutside = (event) => {
    if (
        isSettingsOpen.value &&
        settingsPanel.value &&
        !settingsPanel.value.contains(event.target) &&
        settingsButton.value &&
        !settingsButton.value.contains(event.target)
    ) {
        isSettingsOpen.value = false;
    }
};

// --- Lifecycle Hooks ---
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>