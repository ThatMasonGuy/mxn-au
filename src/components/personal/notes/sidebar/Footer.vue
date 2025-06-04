<template>
    <div class="p-3 border-t border-zinc-200 dark:border-zinc-800">
        <div
            :class="['flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800', isSidebarOpen ? '' : 'justify-center']">
            <div
                class="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                {{ userInitial }}
            </div>
            <div v-if="isSidebarOpen" class="flex-1">
                <div class="font-medium">{{ userName }}</div>
                <div class="text-xs text-zinc-500">{{ accountType }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
    isSidebarOpen: Boolean,
    userName: {
        type: String,
        default: 'Guest User',
    },
    accountType: {
        type: String,
        default: 'Free Account',
    },
});

const userInitial = computed(() => props.userName?.charAt(0) || 'G');
</script>