<!-- @/components/server/layout/MainContent.vue -->
<!-- Right content area -->
<template>
    <div class="flex-1 overflow-auto p-6">
        <header class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Server Dashboard</h1>

            <div class="flex items-center gap-4">
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

        <DashboardGrid :dashboard-components="dashboardComponents" :drag-preview="dragPreview" @drag-over="onDragOver"
            @drag-leave="onDragLeave" @drop="onDrop" @remove-component="onRemoveComponent"
            @resize-component="onResizeComponent" @edit-title="onEditTitle" @start-drag="onStartDrag"
            @start-resize="onStartResize" @show-edit-icon="onShowEditIcon" @hide-edit-icon="onHideEditIcon"
            @start-editing-title="onStartEditingTitle" @update-title="onUpdateTitle" />
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { BellIcon, UserIcon, CogIcon } from '@heroicons/vue/24/solid';
import DashboardGrid from './DashboardGrid.vue';

const props = defineProps({
    dashboardComponents: {
        type: Array,
        required: true
    },
    dragPreview: {
        type: Object,
        required: true,
        default: () => ({
            visible: false,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            adjacentComponents: []
        })
    }
});

const emit = defineEmits([
    'drag-over',
    'drag-leave',
    'drop',
    'remove-component',
    'resize-component',
    'edit-title',
    'start-drag',
    'start-resize'
]);

const currentEditingComponent = ref(null);
const showingEditIconFor = ref(null);

function onDragOver(gridPosition, event) {
    emit('drag-over', gridPosition, event);
}

function onDragLeave() {
    emit('drag-leave');
}

function onDrop(event, gridPosition) {
    emit('drop', event, gridPosition);
}

function onRemoveComponent(id) {
    emit('remove-component', id);
}

function onResizeComponent(id, newSize) {
    emit('resize-component', id, newSize);
}

function onEditTitle(id, newTitle) {
    emit('edit-title', id, newTitle);
}

function onStartDrag(event, component) {
    emit('start-drag', event, component);
}

function onStartResize(event, component) {
    emit('start-resize', event, component);
}

function onShowEditIcon(id) {
    showingEditIconFor.value = id;
}

function onHideEditIcon() {
    showingEditIconFor.value = null;
}

function onStartEditingTitle(id) {
    currentEditingComponent.value = id;
}

function onUpdateTitle(id, newTitle) {
    currentEditingComponent.value = null;
    emit('edit-title', id, newTitle);
}
</script>