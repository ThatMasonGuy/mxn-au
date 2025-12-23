<template>
    <section id="terminal" class="relative w-full px-6 py-32 mx-auto text-white flex flex-col items-center">

        <!-- Section Header -->
        <div class="text-center mb-12 max-w-3xl">
            <h2 class="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                Ask Mason Anything
            </h2>
            <p class="text-lg text-white/60">
                Interactive terminal with command suggestions and autocomplete
            </p>
        </div>

        <div class="w-full max-w-5xl">
            <div class="relative group">
                <!-- Glow effect -->
                <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                
                <!-- Terminal Container -->
                <div class="relative min-h-[400px] flex flex-col rounded-2xl bg-black/60 backdrop-blur-xl border border-emerald-500/20 shadow-2xl overflow-hidden">
                    
                    <!-- Terminal Header -->
                    <div class="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-b border-emerald-500/20">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-red-500/80" />
                            <div class="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div class="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <div class="text-xs text-emerald-400/60 font-mono">mason@mxn.au:~</div>
                    </div>

                    <!-- Terminal Output -->
                    <div ref="output" class="flex-1 overflow-y-auto p-6 text-emerald-300 font-mono text-sm custom-scrollbar min-h-[300px]">
                        <div v-if="showHelpPrompt" class="flex items-center gap-2 text-emerald-400/80">
                            <span>Try typing <span class="text-emerald-300 font-semibold">help</span></span>
                            <span class="animate-pulse">{{ loadingDots }}</span>
                        </div>
                    </div>

                    <!-- Terminal Input -->
                    <div class="p-6 pt-0">
                        <div class="relative">
                            <div class="flex items-center gap-3 bg-black/40 rounded-xl border border-emerald-500/30 backdrop-blur px-4 py-3 focus-within:border-emerald-400/50 transition-colors">
                                <span class="text-emerald-400 font-mono font-bold">$</span>
                                <input 
                                    v-model="command" 
                                    @keydown.enter="handleCommand" 
                                    @input="handleInput"
                                    @keydown.space="handleSpace" 
                                    @keydown.tab.prevent="applySelectedSuggestion"
                                    @keydown.arrow-down.prevent="navigateAutocomplete(1)"
                                    @keydown.arrow-up.prevent="navigateAutocomplete(-1)" 
                                    type="text"
                                    :placeholder="isFocused ? '' : 'Type a command...'" 
                                    @focus="isFocused = true"
                                    @blur="isFocused = false"
                                    class="flex-1 bg-transparent text-emerald-200 font-mono text-base focus:outline-none caret-emerald-400 placeholder-emerald-400/30" 
                                />
                            </div>

                            <!-- Autocomplete Dropdown -->
                            <div v-if="suggestions.length" class="absolute w-full mt-2 bg-black/90 backdrop-blur-xl border border-emerald-500/30 rounded-xl shadow-2xl max-h-48 overflow-y-auto z-50">
                                <div 
                                    v-for="(suggestion, index) in suggestions" 
                                    :key="index"
                                    @click="applySuggestion(suggestion)" 
                                    :class="[
                                        'px-4 py-3 cursor-pointer transition-all font-mono text-sm',
                                        selectedIndex === index 
                                            ? 'bg-emerald-500/20 text-emerald-200 border-l-2 border-emerald-400' 
                                            : 'text-emerald-300/80 hover:bg-emerald-500/10'
                                    ]">
                                    {{ suggestion }}
                                </div>
                            </div>
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
const loadingDots = ref('.')
let dotsInterval

onMounted(() => {
    dotsInterval = setInterval(() => {
        loadingDots.value = loadingDots.value.length >= 3 ? '.' : loadingDots.value + '.'
    }, 500)
})

onUnmounted(() => {
    if (dotsInterval) clearInterval(dotsInterval)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(16, 185, 129, 0.3);
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(16, 185, 129, 0.5);
}
</style>