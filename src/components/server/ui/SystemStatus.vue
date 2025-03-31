<!-- @/components/server/ui/SystemStatus.vue -->
<!-- System status indicators -->
<template>
    <div class="p-4 border-t border-gray-800">
        <h2 class="text-sm uppercase tracking-wider text-gray-400 mb-2">System Status</h2>
        <div class="space-y-2">
            <div v-for="(status, index) in systemStatuses" :key="index" class="flex items-center justify-between">
                <span class="text-sm">{{ status.name }}</span>
                <div class="w-32 bg-gray-700 rounded-full h-2">
                    <div class="h-2 rounded-full" :class="getStatusColor(status.value)"
                        :style="{ width: `${status.value}%` }"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    systemStatuses: {
        type: Array,
        default: () => [
            { name: 'CPU', value: 45 },
            { name: 'Memory', value: 72 },
            { name: 'Disk', value: 28 }
        ]
    }
});

function getStatusColor(value) {
    if (value < 30) return 'bg-blue-500';
    if (value < 70) return 'bg-green-500';
    if (value < 90) return 'bg-yellow-500';
    return 'bg-red-500';
}
</script>