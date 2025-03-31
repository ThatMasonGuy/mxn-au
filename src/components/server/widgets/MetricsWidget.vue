<!-- @/components/server/widgets/MetricsWidget.vue -->
<!-- CPU metrics widget -->
<template>
    <BaseWidget :component="component" :isAdjacent="isAdjacent" :isEditing="isEditing"
        :showEditIcon="showEditIcon === component.id" @base-widget-mousedown="handleBaseMousedown"
        @base-widget-mousedown-resize="handleBaseMousedownResize"
        @removeComponent="$emit('remove-component', component.id)" @showEditIcon="$emit('show-edit-icon', component.id)"
        @hideEditIcon="$emit('hide-edit-icon')" @startEditingTitle="$emit('start-editing-title', component.id)"
        @updateTitle="(id, title) => $emit('update-title', id, title)">
        <div class="h-full w-full flex items-end space-x-1 pb-1">
            <div v-for="value in cpuData" :key="value" class="bg-blue-400 w-full rounded-t"
                :style="{ height: `${value}%` }"></div>
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

const cpuData = ref([15, 25, 40, 30, 35, 55, 35, 30, 45, 60, 40, 35]);

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