<template>
    <div v-if="isThinking" class="mb-6">
        <div class="flex gap-4">
            <div
                class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" class="text-indigo-600 dark:text-indigo-400">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
            <div
                class="max-w-3xl p-4 rounded-2xl bg-white dark:bg-zinc-800 rounded-tl-none animate-pulse flex items-center gap-2">
                <span class="text-zinc-500 dark:text-zinc-300 font-medium">Goblin AI is thinking</span>
                <span class="inline-block w-5 text-indigo-600 dark:text-indigo-400 tracking-widest">{{ thinkingDots
                    }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue';

const props = defineProps({
    isThinking: {
        type: Boolean,
        default: true,
    },
    thinkingDots: String,
});
</script>