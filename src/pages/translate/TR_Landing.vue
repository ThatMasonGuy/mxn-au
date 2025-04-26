<template>
    <div class="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-200 to-purple-200 relative overflow-hidden">
        <!-- Background decoration -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div
                class="absolute -top-10 -right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply opacity-20 animate-float">
            </div>
            <div
                class="absolute top-1/4 -left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply opacity-20 animate-float-delay">
            </div>
            <div
                class="absolute bottom-1/4 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply opacity-20 animate-float">
            </div>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto px-4 py-12 relative z-10">
            <!-- Hero Section -->
            <section class="py-16 flex flex-col items-center">
                <h1 class="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-6">
                    React. Translate. Repeat.
                </h1>
                <p class="text-lg md:text-xl text-center text-gray-700 max-w-2xl mb-6">
                    A self-hosted Discord bot that translates messages via emoji reactions.
                </p>
                <div class="flex items-center justify-center text-2xl md:text-3xl gap-3 my-6 animate-pulse font-sans">
                    <span>🇺🇸</span>
                    <ArrowRightIcon class="h-6 w-6 text-blue-500" />
                    <span>🇯🇵</span>
                    <ArrowRightIcon class="h-6 w-6 text-blue-500" />
                    <span>🇩🇪</span>
                    <ArrowRightIcon class="h-6 w-6 text-blue-500" />
                    <span>🇫🇷</span>
                </div>


                <!-- Chat Animation -->
                <div class="w-full max-w-lg my-10">
                    <div class="bg-white/80 backdrop-blur rounded-lg shadow-lg p-4 transform transition-all">
                        <div class="flex items-start mb-4">
                            <div
                                class="h-10 w-10 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold mr-3">
                                A
                            </div>
                            <div class="bg-gray-100 border rounded-2xl p-3 max-w-xs">
                                <p class="text-gray-800">Has anyone seen the new documentary about climate change?</p>
                                <div class="flex gap-1 mt-2">
                                    <span class="cursor-pointer">🇯🇵</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-start mb-2 opacity-0 animate-fade-in">
                            <div
                                class="h-10 w-10 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold mr-3">
                                A
                            </div>
                            <div class="bg-blue-50 border border-blue-200 rounded-2xl p-3 max-w-xs">
                                <div class="flex items-center gap-2 mb-1 text-sm">
                                    <GlobeAltIcon class="h-4 w-4 text-blue-500" />
                                    <span class="text-blue-600">Translated to Japanese</span>
                                </div>
                                <p class="text-gray-800">気候変動に関する新しいドキュメンタリーを見た人はいますか？</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    class="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <ServerIcon class="h-5 w-5" />
                    <span>Add to Server</span>
                </button>
                <button
                    class="mt-4 bg-transparent hover:bg-gray-100 text-blue-700 font-semibold py-2 px-6 rounded-full transition-all flex items-center gap-2">
                    <CodeBracketIcon class="h-5 w-5" />
                    <span>Install Locally</span>
                </button>
            </section>

            <!-- How It Works -->
            <section class="py-16 bg-white bg-opacity-60 backdrop-blur-sm rounded-xl shadow-sm my-12">
                <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
                <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto px-4">
                    <!-- Step 1 -->
                    <div class="flex flex-col items-center">
                        <div class="bg-blue-100 p-4 rounded-full mb-4">
                            <FaceSmileIcon class="h-10 w-10 text-blue-600" />
                        </div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">1. Emoji Reaction</h3>
                        <p class="text-gray-600 text-center">Bot detects country flag emoji reactions on messages.</p>
                    </div>
                    <!-- Step 2 -->
                    <div class="flex flex-col items-center">
                        <div class="bg-indigo-100 p-4 rounded-full mb-4">
                            <GlobeAltIcon class="h-10 w-10 text-indigo-600" />
                        </div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">2. Translation</h3>
                        <p class="text-gray-600 text-center">Message sent to your self-hosted translation API.</p>
                    </div>
                    <!-- Step 3 -->
                    <div class="flex flex-col items-center">
                        <div class="bg-green-100 p-4 rounded-full mb-4">
                            <ChatBubbleLeftRightIcon class="h-10 w-10 text-green-600" />
                        </div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">3. Response</h3>
                        <p class="text-gray-600 text-center">Clean translated message appears in the thread.</p>
                    </div>
                </div>
            </section>

            <!-- Feature Grid -->
            <section class="py-16">
                <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Features</h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <!-- Feature 1 -->
                    <div
                        class="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow transition-all">
                        <DocumentTextIcon class="h-8 w-8 text-blue-500 mb-4" />
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">Markdown-safe</h3>
                        <p class="text-gray-600">Preserves all text formatting in translations.</p>
                    </div>
                    <!-- Feature 2 -->
                    <div
                        class="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow transition-all">
                        <LinkIcon class="h-8 w-8 text-blue-500 mb-4" />
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">Link-safe</h3>
                        <p class="text-gray-600">URLs and hyperlinks remain clickable after translation.</p>
                    </div>
                    <!-- Feature 3 -->
                    <div
                        class="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow transition-all">
                        <FaceSmileIcon class="h-8 w-8 text-blue-500 mb-4" />
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">Emoji-triggered</h3>
                        <p class="text-gray-600">Simply react with a country flag to translate messages.</p>
                    </div>
                    <!-- Feature 4 -->
                    <div
                        class="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow transition-all">
                        <ServerIcon class="h-8 w-8 text-blue-500 mb-4" />
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">Self-hosted API</h3>
                        <p class="text-gray-600">Keep your data private with your own translation server.</p>
                    </div>
                    <!-- Feature 5 -->
                    <div
                        class="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow transition-all">
                        <ClockIcon class="h-8 w-8 text-blue-500 mb-4" />
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">Caches translations</h3>
                        <p class="text-gray-600">Remember recent translations to improve speed.</p>
                    </div>
                    <!-- Feature 6 -->
                    <div
                        class="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow transition-all">
                        <ChatBubbleBottomCenterTextIcon class="h-8 w-8 text-blue-500 mb-4" />
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">Works everywhere</h3>
                        <p class="text-gray-600">Supports threads, DMs, and all message types.</p>
                    </div>
                </div>
            </section>

            <!-- Final CTA -->
            <section class="py-16 flex flex-col items-center">
                <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Ready to translate?</h2>

                <!-- Example Discord Message -->
                <div class="w-full max-w-xl bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-10">
                    <div class="bg-gray-800 p-3 flex items-center">
                        <div class="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                        <div class="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                        <div class="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                        <span class="text-gray-400 text-sm ml-2"># general</span>
                    </div>
                    <div class="p-4">
                        <div class="flex items-start mb-4">
                            <div
                                class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-3">
                                B</div>
                            <div>
                                <div class="flex items-center">
                                    <span class="font-medium text-indigo-300 mr-2">BotUser</span>
                                    <span class="text-xs text-gray-500">Today at 2:45 PM</span>
                                </div>
                                <p class="text-white mt-1">Welcome to our server! React with 🇯🇵 🇫🇷 🇩🇪 or any flag
                                    to translate messages.</p>
                            </div>
                        </div>
                        <div class="flex items-start mb-4 pl-10">
                            <div class="border-l-2 border-gray-700 pl-3">
                                <div class="flex items-center mb-1 text-sm">
                                    <GlobeAltIcon class="h-4 w-4 text-blue-400 mr-1" />
                                    <span class="text-blue-400">Translated to German</span>
                                </div>
                                <p class="text-white">Willkommen auf unserem Server! Reagieren Sie mit 🇯🇵 🇫🇷 🇩🇪
                                    oder einer beliebigen Flagge, um Nachrichten zu übersetzen.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-4">
                    <button
                        class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                        <ServerIcon class="h-5 w-5" />
                        <span>Add to Server</span>
                    </button>
                    <button
                        class="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                        <CodeBracketIcon class="h-5 w-5" />
                        <span>Deploy Your Own</span>
                    </button>
                </div>
            </section>

            <!-- Footer -->
            <footer class="mt-16 pt-8 border-t border-gray-200">
                <div class="text-center text-gray-500 text-sm">
                    <a href="https://mxn.au/translate"
                        class="text-blue-500 hover:text-blue-700 hover:underline">mxn.au/translate</a>
                    <p class="mt-2">No subscription fees. No auth walls. Just translate.</p>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup>
import {
    ArrowRightIcon,
    ChatBubbleLeftRightIcon,
    ChatBubbleBottomCenterTextIcon,
    ClockIcon,
    CodeBracketIcon,
    DocumentTextIcon,
    FaceSmileIcon,
    GlobeAltIcon,
    LinkIcon,
    ServerIcon
} from '@heroicons/vue/24/outline';
import { onMounted } from 'vue';

// Animation timings for the chat demo
onMounted(() => {
    // Animations could be enhanced with additional logic here
});
</script>

<style>
@keyframes float {
    0% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(0, 10px);
    }

    100% {
        transform: translate(0, 0);
    }
}

@keyframes float-delay {
    0% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(0, 15px);
    }

    100% {
        transform: translate(0, 0);
    }
}

@keyframes fade-in {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

.animate-float-delay {
    animation: float-delay 8s ease-in-out infinite;
}

.animate-fade-in {
    animation: fade-in 2s forwards 1s;
}
</style>