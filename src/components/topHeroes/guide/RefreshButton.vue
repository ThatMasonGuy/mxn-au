<!-- RefreshButton.vue -->
<template>
    <!-- ①  Sticky wrapper lives in the normal flow, but when the page is scrolled
            it sticks 4 rem (64 px) above the viewport bottom.                       -->
    <div class="sticky bottom-4 flex justify-end pointer-events-none">
        <button @click="$emit('click')" :disabled="isRefreshing" :class="[
            'bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3',
            'shadow-lg transition-all duration-300 flex items-center justify-center group',
            isRefreshing && 'animate-spin',
            'pointer-events-auto'  // lets the button stay clickable even though the wrapper ignores events
        ]">
            <!-- accessible labels -->
            <span v-if="isRefreshing" class="sr-only">Refreshing…</span>
            <span v-else class="sr-only">Refresh data</span>

            <!-- icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        </button>
    </div>
</template>

<script setup>
defineProps({
    isRefreshing: { type: Boolean, default: false }
})
defineEmits(['click'])
</script>

<style scoped>
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>