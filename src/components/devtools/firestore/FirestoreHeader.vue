<template>
    <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div class="flex items-center gap-3">
            <svg class="h-8 w-8 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="currentColor">
                <path
                    d="M3.89 15.673L6.255.461A.542.542 0 0 1 7.27.289L9.813 5.06 3.89 15.673zm16.795 3.691L18.433 5.365a.543.543 0 0 0-.918-.295l-14.2 14.294 7.857 4.428a1.62 1.62 0 0 0 1.587 0l7.926-4.428zM14.3 7.148l-1.82-3.482a.542.542 0 0 0-.96 0L3.53 17.984 14.3 7.148z" />
            </svg>
            <h1 class="text-2xl font-bold">Firestore Admin</h1>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-400">
            <div class="flex items-center gap-2">
                <span class="text-gray-400">Mock Data:</span>

                <div class="relative inline-flex items-center cursor-not-allowed">
                    <input type="checkbox" class="sr-only" checked disabled />
                    <div class="w-10 h-5 bg-indigo-600 rounded-full shadow-inner transition"></div>
                    <div class="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow transition"></div>
                </div>

                <span class="text-indigo-400 font-medium">Enabled</span>
            </div>

            <div>
                {{ currentUser?.email || 'Admin' }}
            </div>
        </div>
    </header>

</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
    currentUser: {
        type: Object,
        required: false,
    },
    useMockData: {
        type: Boolean,
        default: true
    }
})
</script>