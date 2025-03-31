<!-- @/components/server/widgets/ServerOverviewWidget.vue -->
<!-- Server overview widget -->
<template>
    <BaseWidget :component="component" :isAdjacent="isAdjacent" :isEditing="isEditing"
        :showEditIcon="showEditIcon === component.id" @base-widget-mousedown="handleBaseMousedown"
        @base-widget-mousedown-resize="handleBaseMousedownResize"
        @removeComponent="$emit('remove-component', component.id)" @showEditIcon="$emit('show-edit-icon', component.id)"
        @hideEditIcon="$emit('hide-edit-icon')" @startEditingTitle="$emit('start-editing-title', component.id)"
        @updateTitle="(id, title) => $emit('update-title', id, title)">
        <div class="grid grid-cols-3 gap-4">
            <div v-for="(server, index) in mockServers" :key="index" class="bg-gray-700 p-3 rounded-lg">
                <div class="flex justify-between items-center">
                    <span>{{ server.name }}</span>
                    <span class="h-2 w-2 rounded-full" :class="statusColor(server.status)"></span>
                </div>
                <div class="mt-2 text-xs text-gray-400">{{ server.ip }}</div>
                <div class="mt-2 text-sm">{{ server.location }}</div>
            </div>
        </div>
    </BaseWidget>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import BaseWidget from './BaseWidget.vue';

const props = defineProps({
    component: {
        type: Object,
        required: true
    },
    isAdjacent: {
        type: Boolean,
        default: false
    },
    isEditing: {
        type: Boolean,
        default: false
    },
    showEditIcon: {
        type: [String, null],
        default: null
    }
});

const mockServers = ref([
    {
        name: 'Server 1',
        status: 'online',
        ip: '66.94.98.250',
        location: 'US (New York)'
    },
    {
        name: 'Server 2',
        status: 'warning',
        ip: '46.250.243.60',
        location: 'AU (Sydney)'
    },
    {
        name: 'Server 3',
        status: 'offline',
        ip: '207.180.236.54',
        location: 'EU (Berlin)'
    }
]);

const emit = defineEmits([
    'startDrag',
    'startResize',
    'remove-component',
    'show-edit-icon',
    'hide-edit-icon',
    'start-editing-title',
    'update-title'
]);

function statusColor(status) {
    switch (status) {
        case 'online': return 'bg-green-500';
        case 'offline': return 'bg-red-500';
        case 'warning': return 'bg-yellow-500';
        default: return 'bg-gray-500';
    }
}

function handleBaseMousedown(e) {
    emit('startDrag', e, props.component);
}

function handleBaseMousedownResize(e) {
    emit('startResize', e, props.component);
}
</script>