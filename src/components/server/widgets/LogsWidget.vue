<!-- @/components/server/widgets/LogsWidget.vue -->
<!-- Logs display widget -->
<template>
    <BaseWidget :component="component" :isAdjacent="isAdjacent" :isEditing="isEditing"
        :showEditIcon="showEditIcon === component.id" @base-widget-mousedown="handleBaseMousedown"
        @base-widget-mousedown-resize="handleBaseMousedownResize"
        @removeComponent="$emit('remove-component', component.id)" @showEditIcon="$emit('show-edit-icon', component.id)"
        @hideEditIcon="$emit('hide-edit-icon')" @startEditingTitle="$emit('start-editing-title', component.id)"
        @updateTitle="(id, title) => $emit('update-title', id, title)">
        <div class="space-y-2 overflow-y-auto max-h-80">
            <div v-for="(log, index) in logs" :key="index" class="p-2 text-sm rounded bg-gray-900 border-l-2"
                :class="logTypeColor(log.type)">
                <div class="flex justify-between">
                    <span>{{ log.message }}</span>
                    <span class="text-gray-500 text-xs">{{ log.time }}</span>
                </div>
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
    },
});

const logs = ref([
    { type: 'error', message: 'Connection timeout on db2', time: '2m ago' },
    { type: 'info', message: 'Backup completed successfully', time: '15m ago' },
    { type: 'warning', message: 'High memory usage detected', time: '32m ago' },
    { type: 'info', message: 'User john.doe logged in', time: '1h ago' },
    { type: 'error', message: 'Failed deployment for api-v2', time: '2h ago' },
    { type: 'info', message: 'System update scheduled', time: '3h ago' }
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

function logTypeColor(type) {
    switch (type) {
        case 'error': return 'border-red-500';
        case 'warning': return 'border-yellow-500';
        case 'info': return 'border-blue-500';
        default: return 'border-gray-500';
    }
}

function handleBaseMousedown(e) {
    emit('startDrag', e, props.component);
}

function handleBaseMousedownResize(e) {
    emit('startResize', e, props.component);
}
</script>