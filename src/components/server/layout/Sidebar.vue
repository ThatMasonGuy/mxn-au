<!-- @/components/server/layout/Sidebar.vue -->
<template>
    <div class="w-64 border-r border-gray-800 flex flex-col">
        <div class="p-4 border-b border-gray-800">
            <h1 class="text-xl font-bold text-blue-400">ServerDash</h1>
        </div>

        <div class="p-4">
            <h2 class="text-sm uppercase tracking-wider text-gray-400 mb-4">Components</h2>
            <div class="space-y-3">
                <div v-for="(component, index) in availableComponents" :key="index"
                    @click="$emit('add-component', component)"
                    class="p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors flex items-center gap-2 border border-gray-700">
                    <component :is="component.icon" class="h-5 w-5" :class="component.iconColor" />
                    <span>{{ component.name }}</span>
                </div>
            </div>
        </div>

        <SystemStatusBar />
    </div>
</template>

<script setup>
import SystemStatusBar from '@/components/server/common/SystemStatusBar.vue'

defineProps({
    availableComponents: {
        type: Array,
        required: true,
    },
})

defineEmits(['add-component'])
</script>