<!-- @/components/server/layout/DashboardGrid.vue -->
<!-- Grid layout for dashboard components -->
<template>
    <div ref="gridRef" class="grid grid-cols-12 gap-4 auto-rows-min relative dashboard-grid" @dragover="onDragOver"
        @drop="onDrop" @dragleave="onDragLeave">
        <div v-if="dragPreview.visible"
            class="absolute rounded-xl border-2 border-blue-400 bg-blue-400 bg-opacity-20 transition-all duration-300 z-10"
            :style="{
                left: `${dragPreview.x}px`,
                top: `${dragPreview.y}px`,
                width: `${dragPreview.width}px`,
                height: `${dragPreview.height}px`
            }"></div>

        <component v-for="component in dashboardComponents" :key="component.id" :is="getWidgetComponent(component.type)"
            :component="component" :is-adjacent="isAdjacent(component.id)"
            :is-editing="currentEditingComponent === component.id" :show-edit-icon="showingEditIconFor"
            class="component-item" :class="{
                'will-move': isAdjacent(component.id),
                [`col-span-${component.size.cols}`]: true,
                [`row-span-${component.size.rows}`]: true
            }" @remove-component="onRemoveComponent" @resize-component="onResizeComponent" @start-drag="onStartDrag"
            @start-resize="onStartResize" @show-edit-icon="onShowEditIcon" @hide-edit-icon="onHideEditIcon"
            @start-editing-title="onStartEditingTitle" @update-title="onUpdateTitle" />

        <DropZone v-if="showDropZone" :is-dragging="dragPreview.visible" :is-adjacent="isAdjacent('drop-zone')" />
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import DropZone from '../ui/DropZone.vue';
import ServerOverviewWidget from '../widgets/ServerOverviewWidget.vue';
import LogsWidget from '../widgets/LogsWidget.vue';
import TerminalWidget from '../widgets/TerminalWidget.vue';
import MetricsWidget from '../widgets/MetricsWidget.vue';
import FileBrowserWidget from '../widgets/FileBrowserWidget.vue';
import NetworkWidget from '../widgets/NetworkWidget.vue';

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
    'start-resize',
    'show-edit-icon',
    'hide-edit-icon',
    'start-editing-title',
    'update-title'
]);

const gridRef = ref(null);
const showDropZone = ref(true);
const currentEditingComponent = ref(null);
const showingEditIconFor = ref(null);

function getWidgetComponent(type) {
    const widgetMap = {
        'overview': ServerOverviewWidget,
        'logs': LogsWidget,
        'terminal': TerminalWidget,
        'metrics': MetricsWidget,
        'files': FileBrowserWidget,
        'network': NetworkWidget
    };

    return widgetMap[type] || null;
}

function isAdjacent(componentId) {
    return props.dragPreview.visible &&
        props.dragPreview.adjacentComponents &&
        props.dragPreview.adjacentComponents.includes(componentId);
}

function onDragOver(event) {
    event.preventDefault();

    if (!gridRef.value) return;

    const rect = gridRef.value.getBoundingClientRect();
    const gridWidth = rect.width;
    const cellWidth = gridWidth / 12;
    const cellHeight = 100;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const cellX = Math.max(0, Math.min(11, Math.floor(x / cellWidth)));
    const cellY = Math.floor(y / cellHeight);

    emit('drag-over', {
        cellX,
        cellY,
        containerRect: rect
    }, event);
}

function onDragLeave(event) {
    if (!gridRef.value) return;

    const rect = gridRef.value.getBoundingClientRect();
    if (
        event.clientX < rect.left ||
        event.clientX >= rect.right ||
        event.clientY < rect.top ||
        event.clientY >= rect.bottom
    ) {
        emit('drag-leave');
    }
}

function onDrop(event, gridPosition) {
    if (!draggingComponent.value) return;

    const { cellX, cellY } = gridPosition;
    
    event.preventDefault();
    
    const componentType = event.dataTransfer.getData('componentType');
    const componentName = event.dataTransfer.getData('name');
    
    const componentDef = availableComponents.value.find(c => c.type === componentType);
    
    if (!componentDef) return;
    
    store.dispatch('server/addComponent', {
        component: {
            ...componentDef,
            name: componentName || componentDef.name
        },
        position: { x: cellX, y: cellY }
    });

    dragPreview.value.visible = false;
    draggingComponent.value = null;
}

function onRemoveComponent(id) {
    emit('remove-component', id);
}

function onResizeComponent(id, newSize) {
    emit('resize-component', id, newSize);
}

function onStartDrag(event, component) {
    emit('start-drag', event, component);
}

function onStartResize(event, component) {
    emit('start-resize', event, component);
}

function onShowEditIcon(id) {
    showingEditIconFor.value = id;
    emit('show-edit-icon', id);
}

function onHideEditIcon() {
    showingEditIconFor.value = null;
    emit('hide-edit-icon');
}

function onStartEditingTitle(id) {
    currentEditingComponent.value = id;
    emit('start-editing-title', id);
}

function onUpdateTitle(id, newTitle) {
    currentEditingComponent.value = null;
    emit('update-title', id, newTitle);
    emit('edit-title', id, newTitle);
}
</script>

<style scoped>

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: 200px;
    gap: 1rem;
    min-height: 400px;
}

.component-item {
    transition: transform 0.3s ease, grid-column 0.3s ease, grid-row 0.3s ease;
    position: relative;
}

.will-move {
    transform: translateY(8px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    z-index: 5;
}
</style>