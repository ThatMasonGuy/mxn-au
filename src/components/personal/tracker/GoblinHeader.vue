<template>
    <div class="mb-8 pb-6 border-b border-slate-700/50">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <!-- Title -->
            <div>
                <h1 class="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-purple-400 to-pink-400 tracking-tight">
                    Goblin Tracker
                </h1>
                <p class="mt-1 text-sm text-slate-400">Track your feasts, analyze your consumption</p>
            </div>

            <!-- View Toggle -->
            <div class="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1 border border-slate-700">
                <button
                    @click="$emit('update:view', 'feed')"
                    :class="[
                        'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all',
                        currentView === 'feed'
                            ? 'bg-emerald-500 text-slate-900 shadow-lg'
                            : 'text-slate-400 hover:text-slate-200'
                    ]"
                >
                    <List :size="16" />
                    <span class="hidden sm:inline">Feed</span>
                </button>
                <button
                    @click="$emit('update:view', 'goals')"
                    :class="[
                        'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all',
                        currentView === 'goals'
                            ? 'bg-amber-500 text-slate-900 shadow-lg'
                            : 'text-slate-400 hover:text-slate-200'
                    ]"
                >
                    <Target :size="16" />
                    <span class="hidden sm:inline">Goals</span>
                </button>
                <button
                    @click="$emit('update:view', 'stats')"
                    :class="[
                        'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all',
                        currentView === 'stats'
                            ? 'bg-purple-500 text-slate-900 shadow-lg'
                            : 'text-slate-400 hover:text-slate-200'
                    ]"
                >
                    <BarChart3 :size="16" />
                    <span class="hidden sm:inline">Stats</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { List, BarChart3, Target } from 'lucide-vue-next';

defineProps({
    currentView: {
        type: String,
        default: 'feed'
    }
});

defineEmits(['update:view']);
</script>