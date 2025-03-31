<!-- @/components/server/widgets/BaseWidget.vue -->
<!-- Base component for all widgets -->
<template>
    <div class="bg-gray-800 rounded-xl border border-gray-700 component-item" :class="{
        [`col-span-${component.size.cols}`]: true,
        [`row-span-${component.size.rows}`]: true,
        'will-move': isAdjacent
    }" :data-component-id="component.id">
        <div class="flex justify-between items-center component-header">
            <div class="flex items-center cursor-move drag-handle" @mousedown="onMousedown"
                @mouseenter="$emit('showEditIcon', component.id)" @mouseleave="$emit('hideEditIcon')">
                <component :is="component.icon" class="h-5 w-5 mr-2" :class="component.iconColor" />
                <span v-if="!isEditing">{{ component.title }}</span>
                <input v-else v-model="localTitle" @blur="finishEditingTitle" @keyup.enter="finishEditingTitle"
                    class="bg-gray-700 px-2 rounded text-white" @click.stop />
                <button v-if="showEditIcon && !isEditing" @click.stop="$emit('startEditingTitle', component.id)"
                    class="ml-2 text-gray-400 hover:text-blue-400">
                    <PencilIcon class="h-4 w-4" />
                </button>
            </div>
            <div class="flex items-center gap-2">
                <div class="resize-handle" @mousedown="onResizeMousedown">
                    <ArrowsPointingOutIcon class="h-4 w-4 text-gray-500 hover:text-blue-400" />
                </div>
                <button v-if="component.id !== 'overview'" @click="$emit('removeComponent', component.id)"
                    class="text-gray-500 hover:text-red-400">
                    <XCircleIcon class="h-5 w-5" />
                </button>
            </div>
        </div>

        <div class="component-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import { PencilIcon, XCircleIcon, ArrowsPointingOutIcon } from '@heroicons/vue/24/solid';

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
        type: Boolean,
        default: false
    }
});

const emit = defineEmits([
    'base-widget-mousedown',
    'base-widget-mousedown-resize',
    'startDrag',
    'startResize',
    'removeComponent',
    'showEditIcon',
    'hideEditIcon',
    'startEditingTitle',
    'updateTitle'
]);

const localTitle = ref(props.component.title);

watch(() => props.component.title, (newTitle) => {
    localTitle.value = newTitle;
});

function finishEditingTitle() {
    emit('updateTitle', props.component.id, localTitle.value);
}

function onMousedown(e) {
    emit('base-widget-mousedown', e);
}

function onResizeMousedown(e) {
    emit('base-widget-mousedown-resize', e);
}
</script>

<style scoped>
.component-item {
    transition: transform 0.3s ease, grid-column 0.3s ease, grid-row 0.3s ease;
    position: relative;
}

.will-move {
    transform: translateY(8px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    z-index: 5;
}

.resize-handle {
    cursor: nwse-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.resize-handle:hover {
    background-color: rgba(59, 130, 246, 0.1);
}

.component-header {
    padding: 0.75rem;
}

.component-content {
    padding: 0 0.75rem 0.75rem 0.75rem;
    height: calc(100% - 3rem);
    overflow: auto;
}

.drag-handle {
    padding: 0.25rem;
    border-radius: 4px;
}
</style>