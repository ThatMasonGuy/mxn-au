<!-- @/pages/server/Dashboard.vue -->
<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 font-sans">
        <div class="flex h-screen">
            <Sidebar :available-components="availableComponents"
                @drag-start="onDragStart" />
            <MainContent :dashboard-components="dashboardComponents" :drag-preview="dragPreview" @drag-over="onDragOver"
                @drag-leave="onDragLeave" @drop="onDrop" @remove-component="onRemoveComponent"
                @resize-component="onResizeComponent" @edit-title="onEditTitle" />
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import Sidebar from '@/components/server/layout/Sidebar.vue';
import MainContent from '@/components/server/layout/MainContent.vue';

const store = useStore();

const availableComponents = computed(() => store.state.server.availableComponents);
const dashboardComponents = computed(() => store.state.server.dashboardComponents);

const dragPreview = ref({
    visible: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    component: null,
    adjacentComponents: []
});

const draggingComponent = ref(null);

function onDragStart(event, component) {
    draggingComponent.value = component;

    dragPreview.value = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        width: 200,
        height: 100,
        component: component,
        adjacentComponents: []
    };
}

function onDragOver(gridPosition, event) {
    if (!dragPreview.value.visible) return;

    const { cellX, cellY, containerRect } = gridPosition;
    
    const cellWidth = containerRect.width / 12;
    const cellHeight = 100;

    dragPreview.value = {
        ...dragPreview.value,
        x: containerRect.left + (cellX * cellWidth),
        y: containerRect.top + (cellY * cellHeight),
        width: cellWidth * (draggingComponent.value?.defaultSize?.cols || 4),
        height: cellHeight * (draggingComponent.value?.defaultSize?.rows || 2),
        adjacentComponents: calculateAdjacentComponents(cellX, cellY)
    };
}

function onDragLeave() {
    if (dragPreview.value.visible) {
        dragPreview.value.adjacentComponents = [];
    }
}

function onDrop(event, gridPosition) {
    if (!draggingComponent.value) return;

    const { cellX, cellY } = gridPosition;

    store.dispatch('server/addComponent', {
        component: draggingComponent.value,
        position: { x: cellX, y: cellY }
    });

    dragPreview.value.visible = false;
    draggingComponent.value = null;
}

function onRemoveComponent(id) {
    store.dispatch('server/removeComponent', id);
}

function onResizeComponent(id, newSize) {
    store.dispatch('server/resizeComponent', { id, size: newSize });
}

function onEditTitle(id, newTitle) {
    store.dispatch('server/updateComponent', {
        id,
        properties: { title: newTitle }
    });
}

function calculateAdjacentComponents(cellX, cellY) {
    return dashboardComponents.value
        .filter(comp => {
            const compX = comp.position.x;
            const compY = comp.position.y;

            return Math.abs(compX - cellX) <= 2 && Math.abs(compY - cellY) <= 2;
        })
        .map(comp => comp.id);
}
</script>

<style scoped>
body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
}
</style>