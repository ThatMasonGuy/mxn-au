<template>
    <div class="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center"
        :class="isSidebarOpen ? 'justify-between' : 'justify-center'">
        <h1 :class="['font-medium transition-opacity', isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0']">
            Goblin<span class="text-indigo-500">.Notes</span>
        </h1>
        <button @click="toggleSidebar" class="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800">
            <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path v-if="isSidebarOpen" d="M15 18l-6-6 6-6" />
                <path v-else d="M9 18l6-6-6-6" />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
    isSidebarOpen: Boolean,
});

const emit = defineEmits(['toggle-sidebar']);

const toggleSidebar = () => {
    emit('toggle-sidebar');
};
</script>