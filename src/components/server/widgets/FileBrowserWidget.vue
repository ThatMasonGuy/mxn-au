<!-- @/components/server/widgets/FileBrowserWidget.vue -->
<!-- File browser widget -->
<template>
    <BaseWidget :component="component" :isAdjacent="isAdjacent" :isEditing="isEditing"
        :showEditIcon="showEditIcon === component.id" @base-widget-mousedown="handleBaseMousedown"
        @base-widget-mousedown-resize="handleBaseMousedownResize"
        @removeComponent="$emit('remove-component', component.id)" @showEditIcon="$emit('show-edit-icon', component.id)"
        @hideEditIcon="$emit('hide-edit-icon')" @startEditingTitle="$emit('start-editing-title', component.id)"
        @updateTitle="(id, title) => $emit('update-title', id, title)">
        <div class="space-y-1">
            <div v-for="(file, index) in files" :key="index" class="flex items-center p-2 rounded hover:bg-gray-700">
                <FolderIcon v-if="file.type === 'folder'" class="h-5 w-5 mr-2 text-yellow-400" />
                <DocumentIcon v-else class="h-5 w-5 mr-2 text-blue-400" />
                <span>{{ file.name }}</span>
                <span class="ml-auto text-xs text-gray-400">{{ file.size }}</span>
            </div>
        </div>
    </BaseWidget>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { FolderIcon, DocumentIcon } from '@heroicons/vue/24/solid';
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
    files: {
        type: Array,
        required: true
    }
});

const files = ref([
    { name: 'config', type: 'folder', size: '' },
    { name: 'logs', type: 'folder', size: '' },
    { name: 'server.conf', type: 'file', size: '4.2 KB' },
    { name: 'nginx.conf', type: 'file', size: '8.7 KB' },
    { name: 'database.sql', type: 'file', size: '2.1 MB' },
    { name: 'backup.tar.gz', type: 'file', size: '156 MB' }
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