<!-- @/components/server/ui/GridGuide.vue -->
<template>
    <div v-if="visible" class="grid-guide-overlay" :class="{ 'active': active }">
        <div class="vertical-lines">
            <div v-for="col in 12" :key="`col-${col}`" class="grid-line vertical"
                :style="{ left: `${(col - 1) * (100 / 12)}%` }"></div>
        </div>

        <div class="horizontal-lines">
            <div v-for="row in rowCount" :key="`row-${row}`" class="grid-line horizontal"
                :style="{ top: `${(row - 1) * cellSize}px` }"></div>
        </div>

        <div v-if="currentCell.x !== null && currentCell.y !== null" class="current-cell-highlight" :style="{
            left: `${currentCell.x * (100 / 12)}%`,
            top: `${currentCell.y * cellSize}px`,
            width: `${currentCell.width * (100 / 12)}%`,
            height: `${currentCell.height * cellSize}px`
        }"></div>
    </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },
    containerHeight: {
        type: Number,
        default: 600
    },
    cellSize: {
        type: Number,
        default: 100
    },
    rowCount: {
        type: Number,
        default: 10
    },
    currentCell: {
        type: Object,
        default: () => ({
            x: null,
            y: null,
            width: 1,
            height: 1
        })
    }
});
</script>

<style scoped>
.grid-guide-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    z-index: 10;
}

.grid-guide-overlay.active {
    opacity: 1;
}

.grid-line {
    position: absolute;
    background-color: rgba(59, 130, 246, 0.2);
    transition: background-color 0.2s ease;
}

.grid-line.vertical {
    width: 1px;
    height: 100%;
    top: 0;
}

.grid-line.horizontal {
    height: 1px;
    width: 100%;
    left: 0;
}

.current-cell-highlight {
    position: absolute;
    background-color: rgba(59, 130, 246, 0.15);
    border: 1px solid rgba(59, 130, 246, 0.4);
    border-radius: 4px;
    transition: all 0.1s ease-out;
}
</style>