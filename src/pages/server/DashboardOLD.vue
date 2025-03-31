<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 font-sans">
        <!-- Main layout -->
        <div class="flex h-screen">
            <!-- Sidebar -->
            <div class="w-64 border-r border-gray-800 flex flex-col">
                <div class="p-4 border-b border-gray-800">
                    <h1 class="text-xl font-bold text-blue-400">ServerDash</h1>
                </div>

                <!-- Draggable components -->
                <div class="p-4">
                    <h2 class="text-sm uppercase tracking-wider text-gray-400 mb-4">Components</h2>
                    <div class="space-y-3">
                        <div v-for="(component, index) in availableComponents" :key="index"
                            class="p-3 bg-gray-800 rounded-lg cursor-move hover:bg-gray-700 transition-colors flex items-center gap-2 border border-gray-700"
                            draggable="true" @dragstart="onDragStart($event, component)">
                            <component :is="component.icon" class="h-5 w-5 text-blue-400" />
                            <span>{{ component.name }}</span>
                        </div>
                    </div>
                </div>

                <!-- Server status -->
                <div class="mt-auto p-4 border-t border-gray-800">
                    <h2 class="text-sm uppercase tracking-wider text-gray-400 mb-2">System Status</h2>
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-sm">CPU</span>
                            <div class="w-32 bg-gray-700 rounded-full h-2">
                                <div class="bg-green-500 h-2 rounded-full" :style="{ width: '45%' }"></div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm">Memory</span>
                            <div class="w-32 bg-gray-700 rounded-full h-2">
                                <div class="bg-yellow-500 h-2 rounded-full" :style="{ width: '72%' }"></div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm">Disk</span>
                            <div class="w-32 bg-gray-700 rounded-full h-2">
                                <div class="bg-blue-500 h-2 rounded-full" :style="{ width: '28%' }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main content -->
            <div class="flex-1 overflow-auto p-6">
                <header class="flex justify-between items-center mb-6">
                    <h1 class="text-2xl font-bold">Server Dashboard</h1>

                    <!-- User menu -->
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

                <!-- Grid layout for bento box style -->
                <div ref="dashboardGrid" class="grid grid-cols-12 gap-4 auto-rows-min relative" @dragover="onDragOver"
                    @drop="onDrop" @dragleave="onDragLeave">
                    <!-- Drag preview element -->
                    <div v-if="dragPreview.visible"
                        class="absolute rounded-xl border-2 border-blue-400 bg-blue-400 bg-opacity-20 transition-all duration-300 z-10"
                        :style="{
                            left: `${dragPreview.x}px`,
                            top: `${dragPreview.y}px`,
                            width: `${dragPreview.width}px`,
                            height: `${dragPreview.height}px`
                        }"></div>

                    <!-- Dashboard Components -->
                    <div v-for="component in dashboardComponents" :key="component.id"
                        class="bg-gray-800 rounded-xl border border-gray-700 component-item" :class="{
                            'will-move': isAdjacent(component.id),
                            [`col-span-${component.size.cols}`]: true,
                            [`row-span-${component.size.rows}`]: true
                        }" :data-component-id="component.id" :style="getComponentPosition(component)">
                        <div class="flex justify-between items-center component-header">
                            <!-- Component handle for dragging -->
                            <div class="flex items-center cursor-move drag-handle"
                                @mousedown="startDrag($event, component)" @mouseenter="showEditIcon = component.id"
                                @mouseleave="showEditIcon = null">
                                <component :is="component.icon" class="h-5 w-5 mr-2" :class="component.iconColor" />
                                <span v-if="editingTitle !== component.id">{{ component.title }}</span>
                                <input v-else v-model="component.title" @blur="finishEditingTitle"
                                    @keyup.enter="finishEditingTitle" ref="titleInput"
                                    class="bg-gray-700 px-2 rounded text-white" @click.stop />
                                <button v-if="showEditIcon === component.id && editingTitle !== component.id"
                                    @click.stop="startEditingTitle(component.id)"
                                    class="ml-2 text-gray-400 hover:text-blue-400">
                                    <PencilIcon class="h-4 w-4" />
                                </button>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="resize-handle" @mousedown="startResize($event, component)">
                                    <ArrowsPointingOutIcon class="h-4 w-4 text-gray-500 hover:text-blue-400" />
                                </div>
                                <button v-if="component.id !== 'overview'" @click="removeComponent(component.id)"
                                    class="text-gray-500 hover:text-red-400">
                                    <XCircleIcon class="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <!-- Component content based on type -->
                        <div class="component-content">
                            <!-- Server Overview -->
                            <div v-if="component.type === 'overview'" class="grid grid-cols-3 gap-4">
                                <div v-for="(server, index) in servers" :key="index" class="bg-gray-700 p-3 rounded-lg">
                                    <div class="flex justify-between items-center">
                                        <span>{{ server.name }}</span>
                                        <span class="h-2 w-2 rounded-full" :class="statusColor(server.status)"></span>
                                    </div>
                                    <div class="mt-2 text-xs text-gray-400">{{ server.ip }}</div>
                                    <div class="mt-2 text-sm">{{ server.location }}</div>
                                </div>
                            </div>

                            <!-- Logs -->
                            <div v-if="component.type === 'logs'" class="space-y-2 overflow-y-auto max-h-80">
                                <div v-for="(log, index) in logs" :key="index"
                                    class="p-2 text-sm rounded bg-gray-900 border-l-2" :class="logTypeColor(log.type)">
                                    <div class="flex justify-between">
                                        <span>{{ log.message }}</span>
                                        <span class="text-gray-500 text-xs">{{ log.time }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Terminal -->
                            <div v-if="component.type === 'terminal'"
                                class="flex-1 bg-black rounded p-2 min-h-32 font-mono text-sm overflow-y-auto">
                                <div class="text-green-400">admin@server:~$</div>
                                <div class="text-white">{{ component.content || 'Welcome to ServerDash Terminal.\nType "help" for available commands.' }}</div>
                                <div class="flex items-center">
                                    <span class="text-green-400">admin@server:~$</span>
                                    <span class="ml-1 animate-pulse">|</span>
                                </div>
                            </div>

                            <!-- CPU Chart -->
                            <div v-if="component.type === 'metrics'" class="h-32 w-full flex items-end space-x-1">
                                <div v-for="value in cpuData" :key="value" class="bg-blue-400 w-full rounded-t"
                                    :style="{ height: `${value}%` }"></div>
                            </div>

                            <!-- File Browser -->
                            <div v-if="component.type === 'files'" class="space-y-1">
                                <div v-for="(file, index) in files" :key="index"
                                    class="flex items-center p-2 rounded hover:bg-gray-700">
                                    <FolderIcon v-if="file.type === 'folder'" class="h-5 w-5 mr-2 text-yellow-400" />
                                    <DocumentIcon v-else class="h-5 w-5 mr-2 text-blue-400" />
                                    <span>{{ file.name }}</span>
                                    <span class="ml-auto text-xs text-gray-400">{{ file.size }}</span>
                                </div>
                            </div>

                            <!-- Network -->
                            <div v-if="component.type === 'network'" class="space-y-2">
                                <div v-for="(connection, index) in connections" :key="index"
                                    class="bg-gray-700 p-2 rounded flex items-center justify-between">
                                    <div class="flex items-center">
                                        <ArrowPathIcon class="h-4 w-4 mr-2 text-green-400" />
                                        <span>{{ connection.source }} → {{ connection.target }}</span>
                                    </div>
                                    <div class="flex items-center">
                                        <span class="text-xs text-gray-400 mr-2">{{ connection.protocol }}</span>
                                        <span class="text-xs text-green-400">{{ connection.status }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Drop zone placeholder for new components -->
                    <div v-if="showDropZone"
                        class="col-span-4 row-span-2 bg-gray-800 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center p-4 component-item"
                        :class="{ 'will-move': isAdjacent('drop-zone'), 'border-blue-400': isDragging }"
                        data-component-id="drop-zone">
                        <div class="text-center" :class="isDragging ? 'text-blue-400' : 'text-gray-500'">
                            <ArrowDownIcon class="h-8 w-8 mx-auto mb-2" />
                            <p>Drop component here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import {
    BellIcon,
    UserIcon,
    CogIcon,
    ServerIcon,
    CommandLineIcon,
    XCircleIcon,
    ChartBarIcon,
    ClipboardIcon,
    ArrowDownIcon,
    ArrowsPointingOutIcon,
    PencilIcon,
    FolderIcon,
    DocumentIcon,
    ArrowPathIcon
} from '@heroicons/vue/24/solid';

// Available components that can be dragged
const availableComponents = ref([
    {
        name: 'Terminal',
        type: 'terminal',
        icon: CommandLineIcon,
        iconColor: 'text-green-400',
        defaultSize: { cols: 4, rows: 2 }
    },
    {
        name: 'Metrics',
        type: 'metrics',
        icon: ChartBarIcon,
        iconColor: 'text-blue-400',
        defaultSize: { cols: 4, rows: 2 }
    },
    {
        name: 'File Browser',
        type: 'files',
        icon: ClipboardIcon,
        iconColor: 'text-yellow-400',
        defaultSize: { cols: 4, rows: 2 }
    },
    {
        name: 'Network',
        type: 'network',
        icon: ServerIcon,
        iconColor: 'text-purple-400',
        defaultSize: { cols: 4, rows: 2 }
    }
]);

// Server data
const servers = ref([
    { name: 'Web Server', status: 'online', ip: '192.168.1.101', location: 'US East' },
    { name: 'Database', status: 'online', ip: '192.168.1.102', location: 'US East' },
    { name: 'Cache', status: 'warning', ip: '192.168.1.103', location: 'US East' },
    { name: 'Storage', status: 'offline', ip: '192.168.1.104', location: 'US West' },
    { name: 'Load Balancer', status: 'online', ip: '192.168.1.105', location: 'EU West' },
    { name: 'CI/CD', status: 'online', ip: '192.168.1.106', location: 'Asia' }
]);

// Log data
const logs = ref([
    { type: 'error', message: 'Connection timeout on db2', time: '2m ago' },
    { type: 'info', message: 'Backup completed successfully', time: '15m ago' },
    { type: 'warning', message: 'High memory usage detected', time: '32m ago' },
    { type: 'info', message: 'User john.doe logged in', time: '1h ago' },
    { type: 'error', message: 'Failed deployment for api-v2', time: '2h ago' },
    { type: 'info', message: 'System update scheduled', time: '3h ago' }
]);

// File browser data
const files = ref([
    { name: 'config', type: 'folder', size: '' },
    { name: 'logs', type: 'folder', size: '' },
    { name: 'server.conf', type: 'file', size: '4.2 KB' },
    { name: 'nginx.conf', type: 'file', size: '8.7 KB' },
    { name: 'database.sql', type: 'file', size: '2.1 MB' },
    { name: 'backup.tar.gz', type: 'file', size: '156 MB' }
]);

// Network connections
const connections = ref([
    { source: '192.168.1.101', target: '192.168.1.102', protocol: 'TCP', status: 'ESTABLISHED' },
    { source: '192.168.1.101', target: '192.168.1.103', protocol: 'TCP', status: 'ESTABLISHED' },
    { source: '192.168.1.105', target: '192.168.1.101', protocol: 'HTTP', status: 'ACTIVE' },
    { source: '192.168.1.105', target: '8.8.8.8', protocol: 'DNS', status: 'ACTIVE' }
]);

// Dashboard components
const dashboardComponents = ref([
    {
        id: 'overview',
        type: 'overview',
        title: 'Server Overview',
        icon: ServerIcon,
        iconColor: 'text-blue-400',
        size: { cols: 8, rows: 2 },
        position: { x: 0, y: 0 }
    },
    {
        id: 'logs',
        type: 'logs',
        title: 'Recent Logs',
        icon: ClipboardIcon,
        iconColor: 'text-blue-400',
        size: { cols: 4, rows: 3 },
        position: { x: 8, y: 0 }
    },
    {
        id: 'cpu-chart',
        type: 'metrics',
        title: 'CPU Usage',
        icon: ChartBarIcon,
        iconColor: 'text-blue-400',
        size: { cols: 4, rows: 1 },
        position: { x: 0, y: 2 }
    }
]);

// For editing component titles
const editingTitle = ref(null);
const showEditIcon = ref(null);
const titleInput = ref(null);

// Component counter for unique IDs
let componentCounter = 1;

// CPU data for the chart
const cpuData = ref([15, 25, 40, 30, 35, 55, 35, 30, 45, 60, 40, 35]);

// For drop zone placeholder
const showDropZone = ref(true);
const isDragging = ref(false);

// Dashboard grid reference
const dashboardGrid = ref(null);

// Grid cell sizes
const cellSize = ref({ width: 0, height: 0 });

// Drag preview state
const dragPreview = ref({
    visible: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    componentType: null,
    adjacentComponents: []
});

// Calculate grid cell size
onMounted(() => {
    calculateCellSize();
    window.addEventListener('resize', calculateCellSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', calculateCellSize);
});

function calculateCellSize() {
    if (dashboardGrid.value) {
        const rect = dashboardGrid.value.getBoundingClientRect();
        cellSize.value = {
            width: rect.width / 12, // 12 columns grid
            height: 100 // Base row height
        };
    }
}

// Component position functions
function getComponentPosition(component) {
    // Components are positioned using CSS grid
    return {};
}

// Drag and drop functionality
function onDragStart(event, component) {
    // Set data for drag operation
    event.dataTransfer.setData('componentType', component.type);
    event.dataTransfer.setData('name', component.name);
    event.dataTransfer.setData('icon', component.icon.name);
    event.dataTransfer.setData('iconColor', component.iconColor);
    event.dataTransfer.setData('cols', component.defaultSize.cols);
    event.dataTransfer.setData('rows', component.defaultSize.rows);

    // Create a preview element
    const dragImage = document.createElement('div');
    dragImage.classList.add('invisible');
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 0, 0);

    // Set dragging state
    isDragging.value = true;

    // Store component type for preview
    dragPreview.value.componentType = component.type;

    // Set timeout to remove the temporary element
    setTimeout(() => {
        document.body.removeChild(dragImage);
    }, 0);
}

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
    dragPreview.value = {
        visible: true,
        x: cellX * cellWidth,
        y: cellY * cellSize.value.height,
        width: limitedCols * cellWidth - 16, // Account for gap
        height: rows * cellSize.value.height - 16, // Account for gap
        componentType: dragPreview.value.componentType,
        cellX,
        cellY,
        cols: limitedCols,
        rows
    };

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
        dragPreview.value.visible = false;
        clearAdjacentComponents();
    }
}

function onDrop(event) {
    event.preventDefault();

    // Hide preview
    const preview = { ...dragPreview.value };
    dragPreview.value.visible = false;
    isDragging.value = false;
    clearAdjacentComponents();

    if (!preview.cellX && preview.cellX !== 0) return;

    // Get dropped component type
    const componentType = event.dataTransfer.getData('componentType');
    const componentName = event.dataTransfer.getData('name');
    const iconName = event.dataTransfer.getData('icon');
    const iconColor = event.dataTransfer.getData('iconColor');

    // Find the icon component
    const iconComponent = {
        'CommandLineIcon': CommandLineIcon,
        'ChartBarIcon': ChartBarIcon,
        'ClipboardIcon': ClipboardIcon,
        'ServerIcon': ServerIcon
    }[iconName] || ServerIcon;

    // Add the new component to the dashboard
    const newComponent = {
        id: `${componentType}-${componentCounter++}`,
        type: componentType,
        title: componentName || `New ${componentType}`,
        icon: iconComponent,
        iconColor: iconColor || 'text-blue-400',
        size: { cols: preview.cols, rows: preview.rows },
        position: { x: preview.cellX, y: preview.cellY }
    };

    dashboardComponents.value.push(newComponent);

    // Hide drop zone after adding a component if we have too many components
    if (dashboardComponents.value.length > 5) {
        showDropZone.value = false;
    }
}

// Find components that would need to move to make space
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

    // In a real implementation, check which components overlap
    // For now, just set a placeholder
    dragPreview.value.adjacentComponents = dashboardComponents.value.map(c => c.id);
}

// Clear adjacent components marking
function clearAdjacentComponents() {
    dragPreview.value.adjacentComponents = [];
}

// Check if a component is adjacent to the current drag preview
function isAdjacent(componentId) {
    return dragPreview.value.visible &&
        dragPreview.value.adjacentComponents.includes(componentId);
}

// Component reordering functionality
function startDrag(event, component) {
    // Only initiate drag if not editing title and not using resize handle
    if (editingTitle.value || event.target.closest('.resize-handle')) {
        return;
    }

    // Create a custom draggable element
    const dragElement = document.createElement('div');
    dragElement.textContent = component.title;
    dragElement.classList.add('invisible');
    document.body.appendChild(dragElement);

    // Setup drag operation
    event.dataTransfer = event.dataTransfer || new DataTransfer();
    event.dataTransfer.setDragImage(dragElement, 0, 0);
    event.dataTransfer.setData('componentId', component.id);
    event.dataTransfer.setData('action', 'reorder');

    // Start drag operation
    event.target.closest('.component-item').draggable = true;

    setTimeout(() => {
        document.body.removeChild(dragElement);
    }, 0);
}

// Resizing functionality
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
    const component = dashboardComponents.value.find(c => c.id === resizing.value.componentId);
    if (component) {
        // Ensure minimum size and fit within grid
        const newCols = Math.max(1, Math.min(12, resizing.value.startCols + deltaCols));
        const newRows = Math.max(1, resizing.value.startRows + deltaRows);

        component.size.cols = newCols;
        component.size.rows = newRows;
    }
}

function onResizeEnd() {
    resizing.value.active = false;
    document.removeEventListener('mousemove', onResizeMove);
    document.removeEventListener('mouseup', onResizeEnd);
}

// Component title editing
function startEditingTitle(componentId) {
    editingTitle.value = componentId;

    // Focus the input field after rendering
    nextTick(() => {
        if (titleInput.value) {
            titleInput.value.focus();
        }
    });
}

function finishEditingTitle() {
    editingTitle.value = null;
}

// Remove a component
function removeComponent(id) {
    dashboardComponents.value = dashboardComponents.value.filter(c => c.id !== id);
    if (dashboardComponents.value.length < 5) {
        showDropZone.value = true;
    }
}

// Helper functions for colors
function statusColor(status) {
    switch (status) {
        case 'online': return 'bg-green-500';
        case 'offline': return 'bg-red-500';
        case 'warning': return 'bg-yellow-500';
        default: return 'bg-gray-500';
    }
}

function logTypeColor(type) {
    switch (type) {
        case 'error': return 'border-red-500';
        case 'warning': return 'border-yellow-500';
        case 'info': return 'border-blue-500';
        default: return 'border-gray-500';
    }
}
</script>

<style scoped>
/* Grid layout */
.grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: 100px;
    gap: 1rem;
}

/* Animation for component movement */
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