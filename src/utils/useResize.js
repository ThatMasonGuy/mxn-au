// @/utils/useResize.js
// To resize tiles relative to the base grid
import { ref } from 'vue';

export function useResize(dashboardGrid, cellSize) {
    const resizing = ref({
        active: false,
        componentId: null,
        startX: 0,
        startY: 0,
        startCols: 0,
        startRows: 0,
        component: null
    });

    function startResize(event, component) {
        event.preventDefault();
        event.stopPropagation();

        // Set resizing state
        resizing.value = {
            active: true,
            componentId: component.id,
            startX: event.clientX,
            startY: event.clientY,
            startCols: component.size.cols,
            startRows: component.size.rows,
            component
        };

        // Add event listeners
        document.addEventListener('mousemove', onResizeMove);
        document.addEventListener('mouseup', onResizeEnd);
    }

    function onResizeMove(event) {
        if (!resizing.value.active || !dashboardGrid.value) return;

        // Calculate delta movement
        const deltaX = event.clientX - resizing.value.startX;
        const deltaY = event.clientY - resizing.value.startY;

        // Get grid cell size
        const rect = dashboardGrid.value.getBoundingClientRect();
        const cellWidth = rect.width / 12;

        // Calculate new column/row spans (snap to grid)
        const deltaColsRaw = deltaX / cellWidth;
        const deltaRowsRaw = deltaY / cellSize.value.height;

        // Round to nearest whole number for grid snapping
        const deltaCols = Math.round(deltaColsRaw);
        const deltaRows = Math.round(deltaRowsRaw);

        // Update component size with constraints
        return {
            newCols: Math.max(1, Math.min(12, resizing.value.startCols + deltaCols)),
            newRows: Math.max(1, resizing.value.startRows + deltaRows)
        };
    }

    function onResizeEnd() {
        resizing.value.active = false;
        document.removeEventListener('mousemove', onResizeMove);
        document.removeEventListener('mouseup', onResizeEnd);
    }

    return {
        resizing,
        startResize,
        onResizeMove,
        onResizeEnd
    };
}