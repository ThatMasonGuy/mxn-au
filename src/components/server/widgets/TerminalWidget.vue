<!-- @/components/server/widgets/TerminalWidget.vue -->
<!-- Terminal widget -->
<template>
    <BaseWidget :component="component" :isAdjacent="isAdjacent" :isEditing="isEditing"
        :showEditIcon="showEditIcon === component.id" @base-widget-mousedown="handleBaseMousedown"
        @base-widget-mousedown-resize="handleBaseMousedownResize"
        @removeComponent="$emit('remove-component', component.id)" @showEditIcon="$emit('show-edit-icon', component.id)"
        @hideEditIcon="$emit('hide-edit-icon')" @startEditingTitle="$emit('start-editing-title', component.id)"
        @updateTitle="(id, title) => $emit('update-title', id, title)">
        <div class="flex-1 bg-black rounded p-2 min-h-32 font-mono text-sm overflow-y-auto">
            <div class="text-green-400">admin@server:~$</div>
            <div class="text-white">{{ content || 'Welcome to ServerDash Terminal.\nType "help" for available commands.'
            }}</div>
            <div class="flex items-center">
                <span class="text-green-400">admin@server:~$</span>
                <span class="ml-1 animate-pulse">|</span>
            </div>
        </div>
    </BaseWidget>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
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
    content: {
        type: String,
        default: ''
    }
});

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