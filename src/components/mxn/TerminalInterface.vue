<template>
    <section id="terminal"
        class="relative w-full px-6 py-20 mx-auto text-white overflow-hidden flex flex-col items-center">

        <div class="relative z-10 flex flex-col items-center">
            <h2
                class="text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-r from-fuchsia-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-12 animate-fade-up">
                Ask Mason Anything
            </h2>

            <div
                class="h-[35vh] min-h-[350px] w-full max-w-4xl flex flex-col rounded-3xl bg-black/50 backdrop-blur-2xl p-6 sm:p-8 border border-emerald-400/20 shadow-[0_0_25px_10px_rgba(34,197,94,0.1)] animate-fade-up space-y-4">

                <!-- Terminal Output -->
                <div ref="output"
                    class="flex-1 overflow-y-auto bg-black/70 rounded-xl p-4 text-green-300 font-mono text-sm custom-scrollbar">
                    <div v-if="showHelpPrompt" class="text-green-300 flex items-center space-x-2">
                        <span>Try typing <span class="text-green-500">help</span></span>
                        <span>{{ loadingDots }}</span>
                    </div>
                </div>

                <!-- Terminal Input -->
                <div class="relative">
                    <div
                        class="flex items-center space-x-2 bg-black/50 rounded-xl border border-emerald-400/30 backdrop-blur p-3">
                        <span class="text-emerald-400 font-mono">></span>
                        <input v-model="command" @keydown.enter="handleCommand" @input="handleInput"
                            @keydown.space="handleSpace" @keydown.tab.prevent="applySelectedSuggestion"
                            @keydown.arrow-down.prevent="navigateAutocomplete(1)"
                            @keydown.arrow-up.prevent="navigateAutocomplete(-1)" type="text"
                            :placeholder="isFocused ? '' : 'Type a command...'" @focus="isFocused = true"
                            @blur="isFocused = false"
                            class="flex-1 bg-transparent text-green-200 font-mono text-base focus:outline-none caret-emerald-400 placeholder-gray-400" />
                    </div>

                    <!-- Autocomplete -->
                    <div v-if="suggestions.length"
                        class="absolute w-full bg-black/80 border border-gray-700 mt-2 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
                        <div v-for="(suggestion, index) in suggestions" :key="index"
                            @click="applySuggestion(suggestion)" :class="[
                                'px-4 py-2 cursor-pointer transition-all',
                                selectedIndex === index ? 'bg-emerald-600 text-black' : 'hover:bg-white/10'
                            ]">
                            {{ suggestion }}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTerminal } from '@/utils/useTerminal.js'

const {
    output,
    command,
    suggestions,
    selectedIndex,
    showHelpPrompt,
    handleCommand,
    handleInput,
    handleSpace,
    navigateAutocomplete,
    applySuggestion,
    applySelectedSuggestion
} = useTerminal()

const isFocused = ref(false)

// NEW — animated loading dots logic
const loadingDots = ref('.')
let dotsInterval

onMounted(() => {
    dotsInterval = setInterval(() => {
        if (loadingDots.value === '.') {
            loadingDots.value = '..'
        } else if (loadingDots.value === '..') {
            loadingDots.value = '...'
        } else {
            loadingDots.value = '.'
        }
    }, 500) // every half second
})

onUnmounted(() => {
    clearInterval(dotsInterval)
})
</script>

<style scoped>
/* Fading cards up */
@keyframes fade-in {
    0% {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.animate-fade-up {
    animation: fade-in 0.8s ease forwards;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(34, 197, 94, 0.4);
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

/* Animations */
.terminal-output-line {
    animation: terminalFade 0.3s ease-out;
    margin-bottom: 4px;
    white-space: pre-wrap;
    word-break: break-word;
}

@keyframes terminalFade {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse-slow {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.3;
    }

    50% {
        transform: scale(1.1);
        opacity: 0.5;
    }
}

.animate-pulse-slow {
    animation: pulse-slow 8s ease-in-out infinite;
}

.animate-pulse-slower {
    animation: pulse-slow 12s ease-in-out infinite;
}

.delay-2000 {
    animation-delay: 2s;
}

.delay-4000 {
    animation-delay: 4s;
}
</style>
