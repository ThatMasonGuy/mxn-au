<template>
    <div class="flex flex-col items-center justify-center w-full h-full">
        <div v-if="error" class="text-center">
            <p class="text-red-500 font-semibold">Failed to load chart.</p>
        </div>
        <div v-else class="space-y-4 w-full animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div class="h-64 bg-gray-100 rounded-lg"></div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    error: { type: Boolean, default: false }
})
</script>