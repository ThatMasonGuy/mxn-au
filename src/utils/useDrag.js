// @/utils/useDrag.js
// To Drag Tiles around and onto the dashboard
import { ref, reactive } from 'vue';

export function useDrag(dashboardGrid, cellSize) {
    const isDragging = ref(false);

    // Drag preview state
    const dragPreview = reactive({
        visible: false,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        componentType: null,
        adjacentComponents: [],
        cellX: null,
        cellY: null,
        cols: 0,
        rows: 0
    });

    function onDragOver(event) {
        event.preventDefault();

        if (!dashboardGrid.value) return;

        // Calculate grid cell size from current layout
        const rect = dashboardGrid.value.getBoundingClientRect();
        const gridWidth = rect.width;
        const cellWidth = gridWidth / 12; // 12 columns grid

        // Get mouse position relative to grid
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Calculate which cell the mouse is over
        const cellX = Math.max(0, Math.min(11, Math.floor(x / cellWidth)));
        const cellY = Math.floor(y / cellSize.value.height);

        // Get component size from drag data or use default
        const cols = parseInt(event.dataTransfer.getData('cols')) || 4;
        const rows = parseInt(event.dataTransfer.getData('rows')) || 2;

        // Limit to fit within the grid
        const limitedCols = Math.min(cols, 12 - cellX);

        // Update preview position and size
        dragPreview.visible = true;
        dragPreview.x = cellX * cellWidth;
        dragPreview.y = cellY * cellSize.value.height;
        dragPreview.width = limitedCols * cellWidth - 16; // Account for gap
        dragPreview.height = rows * cellSize.value.height - 16; // Account for gap
        dragPreview.componentType = dragPreview.componentType;
        dragPreview.cellX = cellX;
        dragPreview.cellY = cellY;
        dragPreview.cols = limitedCols;
        dragPreview.rows = rows;

        // Find components that need to move
        findAdjacentComponents(cellX, cellY, limitedCols, rows);
    }

    function onDragLeave(event) {
        // Check if the mouse has left the grid container
        if (!dashboardGrid.value) return;

        const rect = dashboardGrid.value.getBoundingClientRect();
        if (
            event.clientX < rect.left ||
            event.clientX >= rect.right ||
            event.clientY < rect.top ||
            event.clientY >= rect.bottom
        ) {
            // Hide preview when leaving the grid
            dragPreview.visible = false;
            clearAdjacentComponents();
        }
    }

    function findAdjacentComponents(cellX, cellY, cols, rows) {
        // Reset previous adjacent components
        clearAdjacentComponents();

        // Calculate grid positions that would be affected
        const affectedPositions = [];
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                affectedPositions.push(`${cellX + i}-${cellY + j}`);
            }
        }

        // This is a placeholder - actual implementation would need to check
        // which components overlap with the affected positions
        dragPreview.adjacentComponents = [];
    }

    function clearAdjacentComponents() {
        dragPreview.adjacentComponents = [];
    }

    function isAdjacent(componentId) {
        return dragPreview.visible && dragPreview.adjacentComponents.includes(componentId);
    }

    function onDragStart() {
        isDragging.value = true;
    }

    function onDragEnd() {
        isDragging.value = false;
        dragPreview.visible = false;
        clearAdjacentComponents();
    }

    return {
        isDragging,
        dragPreview,
        onDragStart,
        onDragOver,
        onDragLeave,
        onDragEnd,
        isAdjacent
    };
}