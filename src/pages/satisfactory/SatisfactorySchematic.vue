<template>
  <div class="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="bg-slate-800 border-b border-slate-700 px-6 py-4 flex-shrink-0">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-orange-400">Satisfactory Schematic Creator</h1>
          <p class="text-sm text-slate-400 mt-1">Plan your production lines with precision</p>
        </div>
        <div class="flex gap-2">
          <button @click="importSchematic" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition">
            <Upload class="w-4 h-4 inline mr-2" />
            Import
          </button>
          <button @click="exportToImage" :disabled="isExporting" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition disabled:opacity-50">
            <Camera class="w-4 h-4 inline mr-2" />
            {{ isExporting ? 'Exporting...' : 'Export Image' }}
          </button>
          <button @click="clearCanvas" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition">
            <Trash2 class="w-4 h-4 inline mr-2" />
            Clear
          </button>
          <button @click="saveSchematic" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
            <Save class="w-4 h-4 inline mr-2" />
            Save
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <div class="w-80 bg-slate-800 border-r border-slate-700 overflow-y-auto flex-shrink-0">
        <div class="p-4">
          <h2 class="text-lg font-semibold mb-4 text-orange-400">Buildings</h2>
          
          <!-- Resource Nodes -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-slate-300 mb-2 flex items-center">
              <Mountain class="w-4 h-4 mr-2" />
              Resource Nodes
            </h3>
            <div class="space-y-2">
              <div v-for="node in resourceNodes" :key="node.id"
                   @mousedown="startSidebarDrag(node, $event)"
                   class="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg cursor-grab active:cursor-grabbing transition border border-slate-600 hover:border-orange-500">
                <div class="flex items-center gap-2">
                  <Mountain class="w-5 h-5 text-emerald-400" />
                  <div class="flex-1">
                    <div class="font-medium">{{ node.name }}</div>
                    <div class="text-xs text-slate-400">{{ node.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Production Buildings -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-slate-300 mb-2 flex items-center">
              <Factory class="w-4 h-4 mr-2" />
              Production
            </h3>
            <div class="space-y-2">
              <div v-for="building in productionBuildings" :key="building.id"
                   @mousedown="startSidebarDrag(building, $event)"
                   class="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg cursor-grab active:cursor-grabbing transition border border-slate-600 hover:border-orange-500">
                <div class="flex items-center gap-2">
                  <component :is="getBuildingIcon(building.type)" class="w-5 h-5" :class="getBuildingIconColor(building.type)" />
                  <div class="flex-1">
                    <div class="font-medium">{{ building.name }}</div>
                    <div class="text-xs text-slate-400">{{ building.powerUsage }}MW</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Logistics -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-slate-300 mb-2 flex items-center">
              <Split class="w-4 h-4 mr-2" />
              Logistics
            </h3>
            <div class="space-y-2">
              <div v-for="logistics in logisticsBuildings" :key="logistics.id"
                   @mousedown="startSidebarDrag(logistics, $event)"
                   class="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg cursor-grab active:cursor-grabbing transition border border-slate-600 hover:border-orange-500">
                <div class="flex items-center gap-2">
                  <component :is="getBuildingIcon(logistics.type)" class="w-5 h-5 text-yellow-400" />
                  <div class="flex-1">
                    <div class="font-medium">{{ logistics.name }}</div>
                    <div class="text-xs text-slate-400">{{ logistics.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Storage -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-slate-300 mb-2 flex items-center">
              <Box class="w-4 h-4 mr-2" />
              Storage
            </h3>
            <div class="space-y-2">
              <div v-for="storage in storageBuildings" :key="storage.id"
                   @mousedown="startSidebarDrag(storage, $event)"
                   class="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg cursor-grab active:cursor-grabbing transition border border-slate-600 hover:border-orange-500">
                <div class="flex items-center gap-2">
                  <Box class="w-5 h-5 text-indigo-400" />
                  <div class="flex-1">
                    <div class="font-medium">{{ storage.name }}</div>
                    <div class="text-xs text-slate-400">{{ storage.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Canvas -->
      <div class="flex-1 relative overflow-hidden bg-slate-900" 
           ref="canvasContainer"
           @mousedown="handleMouseDown"
           @mousemove="handleMouseMove"
           @mouseup="handleMouseUp"
           @wheel="handleWheel">
        
        <!-- Grid Background -->
        <div class="absolute inset-0 pointer-events-none" 
             :style="{
               backgroundImage: `radial-gradient(circle, #334155 1px, transparent 1px)`,
               backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
               backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
             }">
        </div>

        <!-- Canvas Content -->
        <div class="absolute inset-0" 
             ref="canvasContent"
             :style="{
               transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
               transformOrigin: '0 0'
             }">
          
          <!-- Connections SVG -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none" style="overflow: visible;">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#f97316" />
              </marker>
            </defs>
            <g v-for="connection in connections" :key="connection.id">
              <!-- Invisible wider path for easier hovering -->
              <path :d="getConnectionPath(connection)"
                    stroke="transparent"
                    stroke-width="20"
                    fill="none"
                    @mouseenter="hoveredConnection = connection.id"
                    @mouseleave="scheduleHoverClear"
                    style="pointer-events: stroke; cursor: pointer;" />
              <!-- Visible path -->
              <path :d="getConnectionPath(connection)"
                    :stroke="getConnectionColor(connection)"
                    :stroke-width="getConnectionStrokeWidth(connection)"
                    fill="none"
                    marker-end="url(#arrowhead)"
                    class="connection-path"
                    style="pointer-events: none;" />
              <!-- Delete button with larger hit area -->
              <g v-if="hoveredConnection === connection.id" 
                 :transform="`translate(${getConnectionMidpoint(connection).x}, ${getConnectionMidpoint(connection).y})`"
                 @mouseenter="cancelHoverClear"
                 @mouseleave="scheduleHoverClear"
                 @click.stop="deleteConnection(connection.id)"
                 style="pointer-events: all; cursor: pointer;">
                <circle r="20" fill="transparent" />
                <circle r="12" fill="#ef4444" />
                <line x1="-6" y1="-6" x2="6" y2="6" stroke="white" stroke-width="2" />
                <line x1="6" y1="-6" x2="-6" y2="6" stroke="white" stroke-width="2" />
              </g>
            </g>
          </svg>

          <!-- Selection Rectangle -->
          <div v-if="selectionBox" 
               class="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
               :style="{
                 left: Math.min(selectionBox.start.x, selectionBox.end.x) + 'px',
                 top: Math.min(selectionBox.start.y, selectionBox.end.y) + 'px',
                 width: Math.abs(selectionBox.end.x - selectionBox.start.x) + 'px',
                 height: Math.abs(selectionBox.end.y - selectionBox.start.y) + 'px'
               }">
          </div>

          <!-- Nodes -->
          <div v-for="node in nodes" :key="node.id"
               :style="{
                 position: 'absolute',
                 left: node.x + 'px',
                 top: node.y + 'px'
               }"
               @mousedown.stop="handleNodeMouseDown(node, $event)"
               :class="[node.selected ? 'ring-2 ring-blue-500' : '']">
            <SchematicNode 
              :node="node"
              :connections="getNodeConnections(node.id)"
              :inputPortCount="getNodeInputCount(node)"
              :outputPortCount="getNodeOutputCount(node)"
              :actualThroughput="getNodeActualThroughput(node.id)"
              @update="updateNode"
              @delete="deleteNode"
              @connect-start="startConnection"
              @connect-end="endConnection"
              @update-belt="updateConnectionBelt" />
          </div>

          <!-- Ghost node -->
          <div v-if="ghostNode" 
               :style="{
                 position: 'absolute',
                 left: ghostNode.x + 'px',
                 top: ghostNode.y + 'px',
                 opacity: 0.6,
                 pointerEvents: 'none'
               }">
            <SchematicNode :node="ghostNode" :inputPortCount="getNodeInputCount(ghostNode)" :outputPortCount="getNodeOutputCount(ghostNode)" />
          </div>

          <!-- Connection Preview -->
          <svg v-if="connectionPreview" class="absolute inset-0 w-full h-full pointer-events-none" style="overflow: visible;">
            <path :d="getPreviewPath()"
                  stroke="#f97316"
                  stroke-width="3"
                  stroke-dasharray="5,5"
                  fill="none" />
          </svg>
        </div>

        <!-- Zoom Controls -->
        <div class="absolute bottom-4 right-4 flex flex-col gap-2">
          <button @click="zoom = Math.min(3, zoom + 0.1)" 
                  class="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600">
            <ZoomIn class="w-5 h-5" />
          </button>
          <button @click="zoom = Math.max(0.1, zoom - 0.1)" 
                  class="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600">
            <ZoomOut class="w-5 h-5" />
          </button>
          <button @click="zoom = 1; panOffset = { x: 0, y: 0 }" 
                  class="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600">
            <Maximize class="w-5 h-5" />
          </button>
        </div>

        <!-- Stats Panel -->
        <div class="absolute top-4 right-4 bg-slate-800/95 backdrop-blur rounded-lg border border-slate-600 p-4 min-w-80 max-h-[calc(100vh-200px)] overflow-y-auto">
          <h3 class="font-semibold mb-2 text-orange-400">Production Summary</h3>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-400">Total Power:</span>
              <span class="font-mono">{{ totalPower.toFixed(2) }} MW</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Buildings:</span>
              <span class="font-mono">{{ nodes.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Connections:</span>
              <span class="font-mono">{{ connections.length }}</span>
            </div>
            <div v-if="selectedNodes.length > 0" class="flex justify-between">
              <span class="text-slate-400">Selected:</span>
              <span class="font-mono">{{ selectedNodes.length }}</span>
            </div>
          </div>
          
          <!-- Inputs Summary (excluding what's produced) -->
          <div v-if="netInputs.length > 0" class="mt-4 pt-4 border-t border-slate-600">
            <h4 class="font-semibold mb-2 text-sm text-blue-400 flex items-center">
              <ArrowDownCircle class="w-4 h-4 mr-1" />
              Net Inputs (Raw Materials)
            </h4>
            <div class="space-y-1 text-xs">
              <div v-for="input in netInputs" :key="input.item" class="flex justify-between">
                <span class="text-slate-400">{{ input.item }}:</span>
                <span class="font-mono text-blue-300">{{ input.amount.toFixed(1) }}/min</span>
              </div>
            </div>
          </div>

          <!-- Outputs Summary (only going to storage) -->
          <div v-if="storageOutputs.length > 0" class="mt-4 pt-4 border-t border-slate-600">
            <h4 class="font-semibold mb-2 text-sm text-orange-400 flex items-center">
              <ArrowUpCircle class="w-4 h-4 mr-1" />
              Storage Outputs
            </h4>
            <div class="space-y-1 text-xs">
              <div v-for="output in storageOutputs" :key="output.item" class="flex justify-between">
                <span class="text-slate-400">{{ output.item }}:</span>
                <span class="font-mono text-orange-300">{{ output.amount.toFixed(1) }}/min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <input type="file" ref="fileInput" @change="handleFileImport" accept=".json" class="hidden" />
    
    <!-- Export Loading Overlay -->
    <div v-if="isExporting" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div class="bg-slate-800 rounded-lg p-8 text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p class="text-lg">Exporting canvas...</p>
        <p class="text-sm text-slate-400 mt-2">This may take a moment for large schematics</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { 
  Trash2, Save, Mountain, Factory, Split, ZoomIn, ZoomOut, Maximize, 
  Box, Upload, Camera, ArrowDownCircle, ArrowUpCircle, Hammer, Wrench, 
  Cpu, Beaker, Droplet, Combine
} from 'lucide-vue-next';
import SchematicNode from '@/components/satisfactory/SchematicNode.vue';
import { resourceNodes, productionBuildings, logisticsBuildings } from '@/data/satisfactoryBuildings';
import html2canvas from 'html2canvas';

const storageBuildings = [
  {
    id: 'storage-container',
    name: 'Storage Container',
    type: 'storage',
    description: 'Stores items',
    powerUsage: 0,
    recipes: []
  }
];

const canvasContainer = ref(null);
const canvasContent = ref(null);
const fileInput = ref(null);
const nodes = ref([]);
const connections = ref([]);
const zoom = ref(1);
const panOffset = ref({ x: 0, y: 0 });
const isPanning = ref(false);
const lastPanPosition = ref({ x: 0, y: 0 });
const draggingNodes = ref([]);
const dragOffset = ref({ x: 0, y: 0 });
const connectionPreview = ref(null);
const hoveredConnection = ref(null);
const hoverClearTimeout = ref(null);
const nodeIdCounter = ref(0);
const connectionIdCounter = ref(0);
const selectedNodes = ref([]);
const selectionBox = ref(null);
const ghostNode = ref(null);
const sidebarDragging = ref(null);
const isExporting = ref(false);

// Performance: Cache calculations to prevent constant recalculation
const calculationCache = ref(new Map());
const cacheVersion = ref(0);

// Invalidate cache only when structure changes (not positions)
watch(() => nodes.value.length, () => {
  calculationCache.value.clear();
  cacheVersion.value++;
});

watch(() => connections.value.length, () => {
  calculationCache.value.clear();
  cacheVersion.value++;
});

// Also invalidate when node properties change (recipe, clock speed, etc)
watch(nodes, (newNodes, oldNodes) => {
  if (!oldNodes) return;
  
  // Check if any non-position properties changed
  for (let i = 0; i < newNodes.length; i++) {
    const newNode = newNodes[i];
    const oldNode = oldNodes.find(n => n.id === newNode.id);
    
    if (!oldNode) continue;
    
    // Only invalidate if recipe, clock speed, purity, or miner type changed
    if (newNode.selectedRecipe !== oldNode.selectedRecipe ||
        newNode.clockSpeed !== oldNode.clockSpeed ||
        newNode.purity !== oldNode.purity ||
        newNode.minerType !== oldNode.minerType ||
        newNode.beltSpeed !== oldNode.beltSpeed) {
      calculationCache.value.clear();
      cacheVersion.value++;
      break;
    }
  }
}, { deep: true });

const getBuildingIcon = (type) => {
  const icons = {
    smelter: Factory,
    constructor: Hammer,
    assembler: Wrench,
    manufacturer: Cpu,
    refinery: Beaker,
    packager: Droplet,
    foundry: Factory,
    splitter: Split,
    merger: Combine,
    'smart-splitter': Split,
    storage: Box,
    resource: Mountain
  };
  return icons[type] || Factory;
};

const getBuildingIconColor = (type) => {
  const colors = {
    smelter: 'text-orange-400',
    constructor: 'text-blue-400',
    assembler: 'text-purple-400',
    manufacturer: 'text-red-400',
    refinery: 'text-cyan-400',
    packager: 'text-teal-400',
    foundry: 'text-orange-300'
  };
  return colors[type] || 'text-slate-400';
};

// Hover management for connection delete button
const scheduleHoverClear = () => {
  if (hoverClearTimeout.value) clearTimeout(hoverClearTimeout.value);
  hoverClearTimeout.value = setTimeout(() => {
    hoveredConnection.value = null;
  }, 150);
};

const cancelHoverClear = () => {
  if (hoverClearTimeout.value) {
    clearTimeout(hoverClearTimeout.value);
    hoverClearTimeout.value = null;
  }
};

const startSidebarDrag = (template, event) => {
  event.preventDefault();
  sidebarDragging.value = template;
  
  ghostNode.value = {
    ...JSON.parse(JSON.stringify(template)),
    id: 'ghost',
    x: 0,
    y: 0,
    clockSpeed: 100,
    selectedRecipe: template.recipes && template.recipes.length > 0 ? template.recipes[0] : null,
    purity: template.type === 'resource' ? 'normal' : null,
    minerType: template.type === 'resource' ? 'mk1' : null,
  };

  const handleMove = (e) => {
    if (!ghostNode.value) return;
    const rect = canvasContainer.value.getBoundingClientRect();
    ghostNode.value.x = (e.clientX - rect.left - panOffset.value.x) / zoom.value - 150;
    ghostNode.value.y = (e.clientY - rect.top - panOffset.value.y) / zoom.value - 75;
  };

  const handleUp = (e) => {
    if (ghostNode.value && canvasContainer.value) {
      const rect = canvasContainer.value.getBoundingClientRect();
      const isOverCanvas = e.clientX >= rect.left && e.clientX <= rect.right && 
                          e.clientY >= rect.top && e.clientY <= rect.bottom;
      
      if (isOverCanvas) {
        addNode(sidebarDragging.value, {
          x: ghostNode.value.x,
          y: ghostNode.value.y
        });
      }
    }
    
    ghostNode.value = null;
    sidebarDragging.value = null;
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleUp);
  };

  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleUp);
};

const addNode = (template, position = null) => {
  const containerRect = canvasContainer.value.getBoundingClientRect();
  const defaultX = (containerRect.width / 2 - panOffset.value.x) / zoom.value - 150;
  const defaultY = (containerRect.height / 2 - panOffset.value.y) / zoom.value - 100;

  const newNode = {
    ...JSON.parse(JSON.stringify(template)),
    id: `node-${nodeIdCounter.value++}`,
    x: position ? position.x : defaultX + Math.random() * 100,
    y: position ? position.y : defaultY + Math.random() * 100,
    clockSpeed: 100,
    selectedRecipe: template.recipes && template.recipes.length > 0 ? template.recipes[0] : null,
    purity: template.type === 'resource' ? 'normal' : null,
    minerType: template.type === 'resource' ? 'mk1' : null,
    beltSpeed: 'mk1',
    selected: false,
    splitterFilters: template.type === 'smart-splitter' ? [{}, {}, {}] : null
  };

  nodes.value.push(newNode);
};

const handleMouseDown = (event) => {
  if (event.button === 1) {
    event.preventDefault();
    isPanning.value = true;
    lastPanPosition.value = { x: event.clientX, y: event.clientY };
  } else if (event.button === 0) {
    const rect = canvasContainer.value.getBoundingClientRect();
    const x = (event.clientX - rect.left - panOffset.value.x) / zoom.value;
    const y = (event.clientY - rect.top - panOffset.value.y) / zoom.value;
    
    selectionBox.value = {
      start: { x, y },
      end: { x, y }
    };
  }
};

const handleMouseMove = (event) => {
  if (isPanning.value) {
    const deltaX = event.clientX - lastPanPosition.value.x;
    const deltaY = event.clientY - lastPanPosition.value.y;
    
    panOffset.value.x += deltaX;
    panOffset.value.y += deltaY;
    
    lastPanPosition.value = { x: event.clientX, y: event.clientY };
  } else if (selectionBox.value && !draggingNodes.value.length) {
    const rect = canvasContainer.value.getBoundingClientRect();
    const x = (event.clientX - rect.left - panOffset.value.x) / zoom.value;
    const y = (event.clientY - rect.top - panOffset.value.y) / zoom.value;
    
    selectionBox.value.end = { x, y };
    
    const minX = Math.min(selectionBox.value.start.x, selectionBox.value.end.x);
    const maxX = Math.max(selectionBox.value.start.x, selectionBox.value.end.x);
    const minY = Math.min(selectionBox.value.start.y, selectionBox.value.end.y);
    const maxY = Math.max(selectionBox.value.start.y, selectionBox.value.end.y);
    
    nodes.value.forEach(node => {
      const nodeRight = node.x + 300;
      // Use generous height estimate for dynamic cards (can be taller than baseline)
      const cardHeight = (node.type === 'splitter' || node.type === 'merger' || node.type === 'smart-splitter') ? 300 : 250;
      const nodeBottom = node.y + cardHeight;
      
      node.selected = node.x < maxX && nodeRight > minX && 
                     node.y < maxY && nodeBottom > minY;
    });
  }
};

const handleMouseUp = () => {
  isPanning.value = false;
  selectionBox.value = null;
  selectedNodes.value = nodes.value.filter(n => n.selected);
};

const handleWheel = (event) => {
  event.preventDefault();
  const delta = event.deltaY > 0 ? -0.1 : 0.1;
  zoom.value = Math.max(0.1, Math.min(3, zoom.value + delta));
};

const handleNodeMouseDown = (node, event) => {
  if (event.button === 1) {
    event.preventDefault();
    duplicateNode(node);
    return;
  }
  
  if (event.button !== 0) return;
  
  if (event.target.tagName === 'BUTTON' || 
      event.target.tagName === 'INPUT' || 
      event.target.tagName === 'SELECT' ||
      event.target.closest('button') ||
      event.target.closest('input') ||
      event.target.closest('select')) {
    return;
  }

  if (!node.selected) {
    if (!event.shiftKey) {
      nodes.value.forEach(n => n.selected = false);
    }
    node.selected = true;
  }

  draggingNodes.value = nodes.value.filter(n => n.selected);
  draggingNodes.value.forEach(n => n.dragging = true);
  
  const rect = canvasContainer.value.getBoundingClientRect();
  dragOffset.value = {
    x: (event.clientX - rect.left - panOffset.value.x) / zoom.value - node.x,
    y: (event.clientY - rect.top - panOffset.value.y) / zoom.value - node.y
  };

  const firstNode = draggingNodes.value[0];
  const offsetsFromFirst = draggingNodes.value.map(n => ({
    node: n,
    dx: n.x - firstNode.x,
    dy: n.y - firstNode.y
  }));

  const handleMove = (e) => {
    if (draggingNodes.value.length === 0) return;
    
    const rect = canvasContainer.value.getBoundingClientRect();
    const newX = (e.clientX - rect.left - panOffset.value.x) / zoom.value - dragOffset.value.x;
    const newY = (e.clientY - rect.top - panOffset.value.y) / zoom.value - dragOffset.value.y;
    
    offsetsFromFirst.forEach(({ node, dx, dy }) => {
      node.x = newX + dx;
      node.y = newY + dy;
    });
  };

  const handleUp = () => {
    draggingNodes.value.forEach(n => n.dragging = false);
    draggingNodes.value = [];
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleUp);
  };

  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleUp);
};

const duplicateNode = (node) => {
  const newNode = {
    ...JSON.parse(JSON.stringify(node)),
    id: `node-${nodeIdCounter.value++}`,
    x: node.x + 50,
    y: node.y + 50,
    selected: false,
    dragging: false
  };
  nodes.value.push(newNode);
};

const startConnection = (data) => {
  connectionPreview.value = {
    fromNode: data.nodeId,
    fromPort: data.portIndex,
    mouseX: data.x,
    mouseY: data.y,
    isOutput: data.isOutput
  };

  const handleMouseMove = (e) => {
    if (!connectionPreview.value) return;
    const rect = canvasContainer.value.getBoundingClientRect();
    connectionPreview.value.mouseX = (e.clientX - rect.left - panOffset.value.x) / zoom.value;
    connectionPreview.value.mouseY = (e.clientY - rect.top - panOffset.value.y) / zoom.value;
  };

  const handleMouseUp = () => {
    connectionPreview.value = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

const endConnection = (data) => {
  if (!connectionPreview.value) return;
  
  if (connectionPreview.value.fromNode === data.nodeId) {
    connectionPreview.value = null;
    return;
  }

  if (!data.isOutput) {
    const existingConnection = connections.value.find(
      c => c.to === data.nodeId && c.toPort === data.portIndex
    );
    if (existingConnection) {
      connections.value = connections.value.filter(c => c.id !== existingConnection.id);
    }
  }

  connections.value.push({
    id: `connection-${connectionIdCounter.value++}`,
    from: connectionPreview.value.fromNode,
    fromPort: connectionPreview.value.fromPort,
    to: data.nodeId,
    toPort: data.portIndex,
    beltSpeed: 'mk1'
  });

  connectionPreview.value = null;
  
  const toNode = nodes.value.find(n => n.id === data.nodeId);
  updateAvailableRecipes(toNode.id);
};

const deleteConnection = (connectionId) => {
  connections.value = connections.value.filter(c => c.id !== connectionId);
  hoveredConnection.value = null;
  if (hoverClearTimeout.value) {
    clearTimeout(hoverClearTimeout.value);
    hoverClearTimeout.value = null;
  }
};

const updateConnectionBelt = (nodeId, portIndex, isOutput, beltSpeed) => {
  if (isOutput) {
    const conn = connections.value.find(c => c.from === nodeId && c.fromPort === portIndex);
    if (conn) conn.beltSpeed = beltSpeed;
  }
};

const getConnectionPath = (connection) => {
  const fromNode = nodes.value.find(n => n.id === connection.from);
  const toNode = nodes.value.find(n => n.id === connection.to);
  
  if (!fromNode || !toNode) return '';

  const fromPorts = getNodeOutputPorts(fromNode);
  const toPorts = getNodeInputPorts(toNode);

  const fromPort = fromPorts[connection.fromPort] || { x: fromNode.x + 300, y: fromNode.y + 75 };
  const toPort = toPorts[connection.toPort] || { x: toNode.x, y: toNode.y + 75 };

  const fromX = fromPort.x;
  const fromY = fromPort.y;
  const toX = toPort.x;
  const toY = toPort.y;

  const controlPointOffset = Math.abs(toX - fromX) / 2;
  
  return `M ${fromX} ${fromY} C ${fromX + controlPointOffset} ${fromY}, ${toX - controlPointOffset} ${toY}, ${toX} ${toY}`;
};

const getConnectionMidpoint = (connection) => {
  const fromNode = nodes.value.find(n => n.id === connection.from);
  const toNode = nodes.value.find(n => n.id === connection.to);
  
  if (!fromNode || !toNode) return { x: 0, y: 0 };

  const fromPorts = getNodeOutputPorts(fromNode);
  const toPorts = getNodeInputPorts(toNode);

  const fromPort = fromPorts[connection.fromPort] || { x: fromNode.x + 300, y: fromNode.y + 75 };
  const toPort = toPorts[connection.toPort] || { x: toNode.x, y: toNode.y + 75 };

  return {
    x: (fromPort.x + toPort.x) / 2,
    y: (fromPort.y + toPort.y) / 2
  };
};

const getConnectionColor = (connection) => {
  const fromNode = nodes.value.find(n => n.id === connection.from);
  if (!fromNode) return '#f97316';
  
  // Calculate actual throughput
  const outputRate = calculateNodeOutputRate(fromNode, connection.fromPort);
  const beltMax = getBeltMaxThroughput(connection.beltSpeed);
  
  // Red if overloaded
  if (outputRate > beltMax * 1.01) {
    return '#ef4444';
  }
  
  // Normal belt color
  const beltSpeeds = {
    mk1: '#f97316',
    mk2: '#eab308',
    mk3: '#8b5cf6',
    mk4: '#06b6d4',
    mk5: '#10b981'
  };
  return beltSpeeds[connection.beltSpeed] || '#f97316';
};

const getConnectionStrokeWidth = (connection) => {
  const fromNode = nodes.value.find(n => n.id === connection.from);
  if (!fromNode) return 3;
  
  const outputRate = calculateNodeOutputRate(fromNode, connection.fromPort);
  const beltMax = getBeltMaxThroughput(connection.beltSpeed);
  
  return outputRate > beltMax * 1.01 ? 5 : 3;
};

const getBeltMaxThroughput = (beltSpeed) => {
  const speeds = {
    mk1: 60,
    mk2: 120,
    mk3: 270,
    mk4: 480,
    mk5: 780
  };
  return speeds[beltSpeed] || 60;
};

const getPreviewPath = () => {
  if (!connectionPreview.value) return '';
  
  const fromNode = nodes.value.find(n => n.id === connectionPreview.value.fromNode);
  if (!fromNode) return '';

  const ports = connectionPreview.value.isOutput ? 
    getNodeOutputPorts(fromNode) : 
    getNodeInputPorts(fromNode);

  const port = ports[connectionPreview.value.fromPort] || { 
    x: fromNode.x + 300, 
    y: fromNode.y + 75 
  };

  const fromX = port.x;
  const fromY = port.y;
  const toX = connectionPreview.value.mouseX;
  const toY = connectionPreview.value.mouseY;

  const controlPointOffset = Math.abs(toX - fromX) / 2;
  
  return `M ${fromX} ${fromY} C ${fromX + controlPointOffset} ${fromY}, ${toX - controlPointOffset} ${toY}, ${toX} ${toY}`;
};

const getNodeInputPorts = (node) => {
  if (node.type === 'resource') return [];
  
  const baseY = node.y;
  const inputCount = getNodeInputCount(node);
  
  // Use taller spacing for splitters/mergers to account for their larger cards
  const cardHeight = (node.type === 'splitter' || node.type === 'merger' || node.type === 'smart-splitter') ? 250 : 200;
  const spacing = inputCount > 1 ? cardHeight / (inputCount + 1) : cardHeight / 2;
  
  const ports = [];
  for (let i = 0; i < inputCount; i++) {
    ports.push({
      x: node.x,
      y: baseY + spacing * (i + 1)
    });
  }
  return ports;
};

const getNodeOutputPorts = (node) => {
  const baseY = node.y;
  const outputCount = getNodeOutputCount(node);
  
  const cardHeight = (node.type === 'splitter' || node.type === 'merger' || node.type === 'smart-splitter') ? 250 : 200;
  const spacing = outputCount > 1 ? cardHeight / (outputCount + 1) : cardHeight / 2;
  
  const ports = [];
  for (let i = 0; i < outputCount; i++) {
    ports.push({
      x: node.x + 300,
      y: baseY + spacing * (i + 1)
    });
  }
  return ports;
};

const getNodeInputCount = (node) => {
  if (node.type === 'resource') return 0;
  if (node.type === 'merger') return 3;
  if (node.type === 'storage') return 1;
  if (!node.selectedRecipe || !node.selectedRecipe.inputs) return 1;
  return node.selectedRecipe.inputs.length;
};

const getNodeOutputCount = (node) => {
  if (node.type === 'splitter' || node.type === 'smart-splitter') return 3;
  if (node.type === 'storage') return 1;
  return 1;
};

const getNodeConnections = (nodeId) => {
  return {
    inputs: connections.value.filter(c => c.to === nodeId),
    outputs: connections.value.filter(c => c.from === nodeId)
  };
};

// Calculate actual throughput accounting for belt limits (CACHED for performance)
const calculateNodeOutputRate = (node, portIndex = 0) => {
  const cacheKey = `${node.id}-${portIndex}-${cacheVersion.value}`;
  
  // Check cache first
  if (calculationCache.value.has(cacheKey)) {
    return calculationCache.value.get(cacheKey);
  }
  
  let result = 0;
  
  const clockMult = (node.clockSpeed || 100) / 100;
  
  if (node.type === 'resource') {
    if (!node.selectedRecipe) {
      result = 0;
    } else {
      const purityMultipliers = { impure: 0.5, normal: 1, pure: 2 };
      const minerMultipliers = { mk1: 1, mk2: 2, mk3: 2.5 };
      
      const baseRate = node.selectedRecipe.output.amount;
      const purityMult = purityMultipliers[node.purity] || 1;
      const minerMult = minerMultipliers[node.minerType] || 1;
      
      const theoreticalRate = baseRate * purityMult * minerMult * clockMult;
      
      // Limit by belt capacity if connected
      const outputConn = connections.value.find(c => c.from === node.id && c.fromPort === portIndex);
      if (outputConn) {
        const beltMax = getBeltMaxThroughput(outputConn.beltSpeed);
        result = Math.min(theoreticalRate, beltMax);
      } else {
        result = theoreticalRate;
      }
    }
  } else if (node.type === 'splitter' || node.type === 'smart-splitter') {
    const inputConnections = connections.value.filter(c => c.to === node.id);
    const outputConnections = connections.value.filter(c => c.from === node.id);
    
    // Divide by actual number of outputs, not always 3
    const outputCount = Math.max(1, outputConnections.length);
    
    const totalInput = inputConnections.reduce((sum, conn) => {
      const fromNode = nodes.value.find(n => n.id === conn.from);
      if (!fromNode) return sum;
      
      const rate = calculateNodeOutputRate(fromNode, conn.fromPort);
      const beltMax = getBeltMaxThroughput(conn.beltSpeed);
      return sum + Math.min(rate, beltMax);
    }, 0);
    result = totalInput / outputCount;
  } else if (node.type === 'merger') {
    const inputConnections = connections.value.filter(c => c.to === node.id);
    result = inputConnections.reduce((sum, conn) => {
      const fromNode = nodes.value.find(n => n.id === conn.from);
      if (!fromNode) return sum;
      
      const rate = calculateNodeOutputRate(fromNode, conn.fromPort);
      const beltMax = getBeltMaxThroughput(conn.beltSpeed);
      return sum + Math.min(rate, beltMax);
    }, 0);
  } else if (node.type === 'storage') {
    const inputConnections = connections.value.filter(c => c.to === node.id);
    result = inputConnections.reduce((sum, conn) => {
      const fromNode = nodes.value.find(n => n.id === conn.from);
      if (!fromNode) return sum;
      
      const rate = calculateNodeOutputRate(fromNode, conn.fromPort);
      const beltMax = getBeltMaxThroughput(conn.beltSpeed);
      return sum + Math.min(rate, beltMax);
    }, 0);
  } else {
    // For production buildings, check if they have a recipe
    if (!node.selectedRecipe) {
      result = 0;
    } else if (node.selectedRecipe.inputs) {
      const inputConnections = connections.value.filter(c => c.to === node.id);
      
      // Calculate actual input rates limited by belts
      const actualInputs = {};
      inputConnections.forEach(conn => {
        const fromNode = nodes.value.find(n => n.id === conn.from);
        if (!fromNode) return;
        
        const rate = calculateNodeOutputRate(fromNode, conn.fromPort);
        const beltMax = getBeltMaxThroughput(conn.beltSpeed);
        const actualRate = Math.min(rate, beltMax);
        
        // Get item from source
        let item = 'Unknown';
        if (fromNode.selectedRecipe && fromNode.selectedRecipe.output) {
          item = fromNode.selectedRecipe.output.item;
        } else if (fromNode.type === 'splitter' || fromNode.type === 'merger' || fromNode.type === 'smart-splitter') {
          const logisticsInputs = getNodeActualThroughput(fromNode.id).inputs;
          if (logisticsInputs.length > 0) {
            item = logisticsInputs[0].item;
          }
        }
        
        actualInputs[item] = (actualInputs[item] || 0) + actualRate;
      });
      
      // Check if all inputs are satisfied
      let limitingFactor = 1;
      node.selectedRecipe.inputs.forEach(input => {
        const required = input.amount * clockMult;
        const actual = actualInputs[input.item] || 0;
        const factor = actual / required;
        limitingFactor = Math.min(limitingFactor, factor);
      });
      
      const rate = (node.selectedRecipe.output?.amount || 0) * clockMult * limitingFactor;
      
      // Limit by output belt
      const outputConn = connections.value.find(c => c.from === node.id && c.fromPort === portIndex);
      if (outputConn) {
        const beltMax = getBeltMaxThroughput(outputConn.beltSpeed);
        result = Math.min(rate, beltMax);
      } else {
        result = rate;
      }
    } else {
      const rate = node.selectedRecipe.output?.amount || 0;
      result = rate * clockMult;
    }
  }
  
  // Cache the result
  calculationCache.value.set(cacheKey, result);
  return result;
};

// Get actual throughput for a node (accounting for belt limits) - CACHED
const getNodeActualThroughput = (nodeId) => {
  const cacheKey = `throughput-${nodeId}-${cacheVersion.value}`;
  
  if (calculationCache.value.has(cacheKey)) {
    return calculationCache.value.get(cacheKey);
  }
  
  const node = nodes.value.find(n => n.id === nodeId);
  if (!node) return { inputs: [], outputs: [] };
  
  const inputConnections = connections.value.filter(c => c.to === nodeId);
  const outputConnections = connections.value.filter(c => c.from === nodeId);
  
  const inputs = inputConnections.map(conn => {
    const fromNode = nodes.value.find(n => n.id === conn.from);
    if (!fromNode) {
      return { item: 'Unknown', rate: 0 };
    }
    
    // Get item from source node
    let item = 'Unknown';
    if (fromNode.selectedRecipe && fromNode.selectedRecipe.output) {
      item = fromNode.selectedRecipe.output.item;
    } else if (fromNode.type === 'splitter' || fromNode.type === 'merger' || fromNode.type === 'smart-splitter') {
      // For logistics, get item from their inputs recursively
      const logisticsInputs = getNodeActualThroughput(fromNode.id).inputs;
      if (logisticsInputs.length > 0) {
        item = logisticsInputs[0].item;
      }
    }
    
    const rate = calculateNodeOutputRate(fromNode, conn.fromPort);
    const beltMax = getBeltMaxThroughput(conn.beltSpeed);
    const actualRate = Math.min(rate, beltMax);
    
    return {
      item: item,
      rate: actualRate
    };
  });
  
  // For outputs, determine item type
  const outputs = outputConnections.map((conn, index) => {
    let item = 'Unknown';
    
    if (node.selectedRecipe && node.selectedRecipe.output) {
      item = node.selectedRecipe.output.item;
    } else if (node.type === 'splitter' || node.type === 'merger' || node.type === 'smart-splitter' || node.type === 'storage') {
      // For logistics and storage, pass through the input item
      if (inputs.length > 0) {
        item = inputs[0].item;
      }
    }
    
    const rate = calculateNodeOutputRate(node, index);
    const beltMax = getBeltMaxThroughput(conn.beltSpeed);
    const actualRate = Math.min(rate, beltMax);
    
    return {
      item: item,
      rate: actualRate
    };
  });
  
  const result = { inputs, outputs };
  calculationCache.value.set(cacheKey, result);
  return result;
};

const updateAvailableRecipes = (nodeId) => {
  const node = nodes.value.find(n => n.id === nodeId);
  if (!node || !node.recipes) return;
  
  const inputConnections = connections.value.filter(c => c.to === nodeId);
  if (inputConnections.length === 0) return;
  
  const availableItems = new Set();
  inputConnections.forEach(conn => {
    const fromNode = nodes.value.find(n => n.id === conn.from);
    if (fromNode && fromNode.selectedRecipe && fromNode.selectedRecipe.output) {
      availableItems.add(fromNode.selectedRecipe.output.item);
    }
  });
  
  const validRecipes = node.recipes.filter(recipe => {
    if (!recipe.inputs) return true;
    return recipe.inputs.every(input => availableItems.has(input.item));
  });
  
  if (validRecipes.length > 0 && !validRecipes.includes(node.selectedRecipe)) {
    node.selectedRecipe = validRecipes[0];
  }
};

const updateNode = (nodeId, updates) => {
  const node = nodes.value.find(n => n.id === nodeId);
  if (node) {
    Object.assign(node, updates);
    
    const outputConnections = connections.value.filter(c => c.from === nodeId);
    outputConnections.forEach(conn => {
      updateAvailableRecipes(conn.to);
    });
  }
};

const deleteNode = (nodeId) => {
  nodes.value = nodes.value.filter(n => n.id !== nodeId);
  connections.value = connections.value.filter(c => c.from !== nodeId && c.to !== nodeId);
};

const clearCanvas = () => {
  if (confirm('Clear all nodes and connections?')) {
    nodes.value = [];
    connections.value = [];
    selectedNodes.value = [];
  }
};

const saveSchematic = () => {
  const data = {
    nodes: nodes.value.map(n => ({ ...n, selected: false, dragging: false })),
    connections: connections.value
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `satisfactory-schematic-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const importSchematic = () => {
  fileInput.value.click();
};

const handleFileImport = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.nodes && data.connections) {
        nodes.value = data.nodes;
        connections.value = data.connections;
        nodeIdCounter.value = Math.max(...nodes.value.map(n => parseInt(n.id.split('-')[1])), 0) + 1;
        connectionIdCounter.value = Math.max(...connections.value.map(c => parseInt(c.id.split('-')[1])), 0) + 1;
      }
    } catch (err) {
      alert('Failed to import: ' + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
};

const exportToImage = async () => {
  if (!canvasContent.value || nodes.value.length === 0) {
    alert('No content to export!');
    return;
  }
  
  isExporting.value = true;
  
  try {
    // Calculate bounds of all nodes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    nodes.value.forEach(node => {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x + 300);
      // Use generous height for dynamic cards
      const cardHeight = (node.type === 'splitter' || node.type === 'merger' || node.type === 'smart-splitter') ? 300 : 250;
      maxY = Math.max(maxY, node.y + cardHeight);
    });
    
    // Add padding
    const padding = 100;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
    
    const width = maxX - minX;
    const height = maxY - minY;
    
    // Temporarily adjust transform to show all content
    const originalTransform = canvasContent.value.style.transform;
    const originalZoom = zoom.value;
    const originalPan = { ...panOffset.value };
    
    // Reset to show all content
    zoom.value = 1;
    panOffset.value = { x: -minX, y: -minY };
    canvasContent.value.style.transform = `translate(${-minX}px, ${-minY}px) scale(1)`;
    
    // Wait for render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Capture
    const canvas = await html2canvas(canvasContent.value, {
      backgroundColor: '#0f172a',
      scale: 2,
      width: width,
      height: height,
      x: 0,
      y: 0,
      windowWidth: width,
      windowHeight: height
    });
    
    // Restore original view
    zoom.value = originalZoom;
    panOffset.value = originalPan;
    canvasContent.value.style.transform = originalTransform;
    
    // Download
    const link = document.createElement('a');
    link.download = `satisfactory-schematic-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (err) {
    alert('Failed to export: ' + err.message);
  } finally {
    isExporting.value = false;
  }
};

const totalPower = computed(() => {
  return nodes.value.reduce((total, node) => {
    if (!node.powerUsage) return total;
    const clockMultiplier = Math.pow((node.clockSpeed || 100) / 100, 1.6);
    return total + (node.powerUsage * clockMultiplier);
  }, 0);
});

// Net inputs - raw materials being consumed (not counting what's being produced internally)
const netInputs = computed(() => {
  const produced = new Set();
  const consumed = {};
  
  // Track what's being produced
  nodes.value.forEach(node => {
    if (node.selectedRecipe && node.selectedRecipe.output) {
      produced.add(node.selectedRecipe.output.item);
    }
  });
  
  // Track what's being consumed
  nodes.value.forEach(node => {
    if (!node.selectedRecipe || !node.selectedRecipe.inputs) return;
    
    const clockMult = (node.clockSpeed || 100) / 100;
    node.selectedRecipe.inputs.forEach(input => {
      // Only count if it's not being produced internally
      if (!produced.has(input.item)) {
        if (!consumed[input.item]) {
          consumed[input.item] = { item: input.item, amount: 0 };
        }
        consumed[input.item].amount += input.amount * clockMult;
      }
    });
  });
  
  return Object.values(consumed);
});

// Storage outputs - only what's going into storage containers
const storageOutputs = computed(() => {
  const outputs = {};
  
  const storageNodes = nodes.value.filter(n => n.type === 'storage');
  
  storageNodes.forEach(storageNode => {
    const inputConnections = connections.value.filter(c => c.to === storageNode.id);
    
    inputConnections.forEach(conn => {
      const fromNode = nodes.value.find(n => n.id === conn.from);
      if (!fromNode || !fromNode.selectedRecipe || !fromNode.selectedRecipe.output) return;
      
      const rate = calculateNodeOutputRate(fromNode, conn.fromPort);
      const beltMax = getBeltMaxThroughput(conn.beltSpeed);
      const actualRate = Math.min(rate, beltMax);
      
      const item = fromNode.selectedRecipe.output.item;
      
      if (!outputs[item]) {
        outputs[item] = { item, amount: 0 };
      }
      outputs[item].amount += actualRate;
    });
  });
  
  return Object.values(outputs);
});

const handleKeyDown = (event) => {
  if (event.key === 'Delete' || event.key === 'Backspace') {
    if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'SELECT') {
      selectedNodes.value.forEach(node => {
        deleteNode(node.id);
      });
      selectedNodes.value = [];
    }
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
  if (hoverClearTimeout.value) clearTimeout(hoverClearTimeout.value);
});
</script>

<style scoped>
.connection-path {
  filter: drop-shadow(0 0 4px rgba(249, 115, 22, 0.5));
}
</style>