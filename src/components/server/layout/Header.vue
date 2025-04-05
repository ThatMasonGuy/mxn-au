<!-- @/components/server/layout/Header.vue -->
<template>
    <header class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Server Dashboard</h1>

        <div class="flex items-center gap-4">
            <button class="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                @click="$emit('reset-layout')">
                Reset Layout
            </button>
            <button class="p-2 rounded-full hover:bg-gray-800">
                <BellIcon class="h-5 w-5 text-gray-400" />
            </button>
            <button class="p-2 rounded-full hover:bg-gray-800">
                <CogIcon class="h-5 w-5 text-gray-400" />
            </button>
            <div class="flex items-center gap-2">
                <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <UserIcon class="h-4 w-4 text-white" />
                </div>
                <span>Admin</span>
            </div>
        </div>
    </header>
</template>

<script setup>
import { BellIcon, UserIcon, CogIcon } from '@heroicons/vue/24/solid'

defineEmits(['reset-layout'])
</script>