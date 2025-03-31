<!-- @/components/server/widgets/NetworkWidget.vue -->
<!-- Network connections widget -->
<template>
    <BaseWidget :component="component" :isAdjacent="isAdjacent" :isEditing="isEditing"
        :showEditIcon="showEditIcon === component.id" @base-widget-mousedown="handleBaseMousedown"
        @base-widget-mousedown-resize="handleBaseMousedownResize"
        @removeComponent="$emit('remove-component', component.id)" @showEditIcon="$emit('show-edit-icon', component.id)"
        @hideEditIcon="$emit('hide-edit-icon')" @startEditingTitle="$emit('start-editing-title', component.id)"
        @updateTitle="(id, title) => $emit('update-title', id, title)">
        <div class="space-y-2">
            <div v-for="(connection, index) in connections" :key="index"
                class="bg-gray-700 p-2 rounded flex items-center justify-between">
                <div class="flex items-center">
                    <ArrowPathIcon class="h-4 w-4 mr-2 text-green-400" />
                    <span>{{ connection.source }} → {{ connection.target }}</span>
                </div>
                <div class="flex items-center">
                    <span class="text-xs text-gray-400 mr-2">{{ connection.protocol }}</span>
                    <span class="text-xs text-green-400">{{ connection.status }}</span>
                </div>
            </div>
        </div>
    </BaseWidget>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { ArrowPathIcon } from '@heroicons/vue/24/solid';
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
    connections: {
        type: Array,
        required: true
    }
});

const connections = ref([
    { source: '192.168.1.101', target: '192.168.1.102', protocol: 'TCP', status: 'ESTABLISHED' },
    { source: '192.168.1.101', target: '192.168.1.103', protocol: 'TCP', status: 'ESTABLISHED' },
    { source: '192.168.1.105', target: '192.168.1.101', protocol: 'HTTP', status: 'ACTIVE' },
    { source: '192.168.1.105', target: '8.8.8.8', protocol: 'DNS', status: 'ACTIVE' }
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

function handleBaseMousedown(e) {
    emit('startDrag', e, props.component);
}

function handleBaseMousedownResize(e) {
    emit('startResize', e, props.component);
}
</script>