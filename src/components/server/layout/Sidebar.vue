<!-- @/components/server/layout/Sidebar.vue -->
<!-- Left sidebar component -->
<template>
    <div class="w-64 border-r border-gray-800 flex flex-col">
        <div class="p-4 border-b border-gray-800">
            <h1 class="text-xl font-bold text-blue-400">ServerDash</h1>
        </div>

        <div class="p-4">
            <h2 class="text-sm uppercase tracking-wider text-gray-400 mb-4">Components</h2>
            <div class="space-y-3">
                <DraggableComponent v-for="(component, index) in availableComponents" :key="index"
                    :component="component" @drag-start="onDragStart" />
            </div>
        </div>

        <SystemStatus class="mt-auto" />
    </div>
</template>

<script setup>
import { defineEmits } from 'vue';
import DraggableComponent from '@/components/server/ui/DraggableComponent.vue';
import SystemStatus from '@/components/server/ui/SystemStatus.vue';
import { availableComponents } from '@/data/server/availableComponents';

const emit = defineEmits(['drag-start']);

function onDragStart(event, component) {
    emit('drag-start', event, component);
}
</script>