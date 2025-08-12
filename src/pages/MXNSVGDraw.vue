<template>
    <div class="w-full h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
        <!-- Top Bar -->
        <div
            class="h-14 px-4 flex items-center justify-between border-b border-zinc-800 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/5 to-blue-600/10">
            <div class="flex items-center gap-3">
                <div
                    class="px-3 py-1 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold tracking-wide">
                    MXN Draw
                </div>
                <div class="text-xs text-zinc-500">Professional SVG Editor</div>
            </div>

            <div class="flex items-center gap-2">
                <!-- File Operations -->
                <button class="top-button" @click="newCanvas">
                    <FilePlus class="w-4 h-4 inline mr-1" /> New
                </button>

                <label class="top-button cursor-pointer">
                    <input type="file" accept=".svg,image/svg+xml" class="hidden" @change="onImportFile">
                    <Upload class="w-4 h-4 inline mr-1" /> Import
                </label>

                <button class="top-button" @click="downloadSVG">
                    <Download class="w-4 h-4 inline mr-1" /> SVG
                </button>

                <button class="top-button" @click="downloadPNG">
                    <ImageIcon class="w-4 h-4 inline mr-1" /> PNG
                </button>

                <div class="w-px h-8 bg-zinc-700 mx-1"></div>

                <!-- Undo/Redo -->
                <button class="top-button" @click="undo" :disabled="!canUndo"
                    :class="!canUndo && 'opacity-50 cursor-not-allowed'">
                    <Undo class="w-4 h-4" />
                </button>

                <button class="top-button" @click="redo" :disabled="!canRedo"
                    :class="!canRedo && 'opacity-50 cursor-not-allowed'">
                    <Redo class="w-4 h-4" />
                </button>

                <div class="w-px h-8 bg-zinc-700 mx-1"></div>

                <!-- Canvas Settings -->
                <div class="relative">
                    <button class="top-button" @click="showCanvasSettings = !showCanvasSettings">
                        <Settings class="w-4 h-4 inline mr-1" /> Canvas
                    </button>
                    <div v-if="showCanvasSettings" class="dropdown-menu animate-slide-in w-64 p-3">
                        <div class="property-row mb-2">
                            <label class="property-label">Width</label>
                            <input type="number" v-model.number="canvasWidth" min="100" class="property-input">
                        </div>
                        <div class="property-row mb-2">
                            <label class="property-label">Height</label>
                            <input type="number" v-model.number="canvasHeight" min="100" class="property-input">
                        </div>
                        <div class="property-row mb-3">
                            <label class="property-label">Background</label>
                            <input type="color" v-model="canvasBg" class="property-input h-8">
                        </div>
                        <div class="flex gap-2">
                            <button class="flex-1 top-button" @click="fitToScreen">
                                <Maximize class="w-4 h-4 inline mr-1" /> Fit
                            </button>
                            <button class="flex-1 top-button" @click="resetZoom">
                                <Search class="w-4 h-4 inline mr-1" /> 100%
                            </button>
                        </div>
                    </div>
                </div>

                <!-- View Options -->
                <div class="relative">
                    <button class="top-button" @click="showViewOptions = !showViewOptions">
                        <Eye class="w-4 h-4 inline mr-1" /> View
                    </button>
                    <div v-if="showViewOptions" class="dropdown-menu animate-slide-in w-48 p-1">
                        <div class="context-menu-item" @click="toggleGrid">
                            <Grid class="w-4 h-4" />
                            <span>{{ showGrid ? 'Hide' : 'Show' }} Grid</span>
                        </div>
                        <div class="context-menu-item" @click="toggleRulers">
                            <Ruler class="w-4 h-4" />
                            <span>{{ showRulers ? 'Hide' : 'Show' }} Rulers</span>
                        </div>
                        <div class="context-menu-item" @click="toggleSnap">
                            <Magnet class="w-4 h-4" />
                            <span>Snap to Grid {{ snapToGrid ? 'Off' : 'On' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-1 overflow-hidden">
            <!-- Left Toolbar -->
            <div class="w-16 border-r border-zinc-800 bg-zinc-900/50 flex flex-col items-center py-3 gap-2">
                <!-- Select Tool -->
                <button class="tool-button" :class="tool === 'select' && 'active'" @click="tool = 'select'"
                    title="Select (V)">
                    <MousePointer2 class="w-5 h-5" />
                </button>

                <!-- Hand Tool -->
                <button class="tool-button" :class="tool === 'hand' && 'active'" @click="tool = 'hand'" title="Pan (H)">
                    <Hand class="w-5 h-5" />
                </button>

                <div class="w-10 h-px bg-zinc-700"></div>

                <!-- Pen Tool -->
                <button class="tool-button" :class="tool === 'pen' && 'active'" @click="tool = 'pen'" title="Pen (P)">
                    <PenTool class="w-5 h-5" />
                </button>

                <!-- Shapes Dropdown -->
                <div class="relative">
                    <button class="tool-button" :class="isShapeTool && 'active'" @click="showShapeMenu = !showShapeMenu"
                        title="Shapes">
                        <component :is="shapeIcon" class="w-5 h-5" />
                    </button>
                    <div v-if="showShapeMenu"
                        class="absolute left-full ml-2 top-0 bg-zinc-900 border border-zinc-700 rounded-lg p-1 animate-slide-in z-50">
                        <button v-for="shape in shapeTools" :key="shape.type" class="tool-button mb-1 w-full"
                            :class="tool === shape.type && 'active'" @click="selectShapeTool(shape.type)"
                            :title="shape.label">
                            <component :is="shape.icon" class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <!-- Text Tool -->
                <button class="tool-button" :class="tool === 'text' && 'active'" @click="tool = 'text'"
                    title="Text (T)">
                    <Type class="w-5 h-5" />
                </button>

                <div class="w-10 h-px bg-zinc-700"></div>

                <!-- Eyedropper -->
                <button class="tool-button" @click="eyedropperTool" title="Eyedropper (I)">
                    <Pipette class="w-5 h-5" />
                </button>

                <!-- Delete -->
                <button class="tool-button" @click="deleteSelected" :disabled="!selected"
                    :class="!selected && 'opacity-50 cursor-not-allowed'" title="Delete (Del)">
                    <Trash2 class="w-5 h-5" />
                </button>
            </div>

            <!-- Main Canvas Area -->
            <div class="flex-1 relative bg-zinc-900 overflow-hidden" ref="canvasContainer" @wheel.prevent="onWheel"
                @mousedown="onCanvasMouseDown" @mousemove="onCanvasMouseMove" @mouseup="onCanvasMouseUp"
                @mouseleave="onCanvasMouseUp">

                <!-- Rulers -->
                <div v-if="showRulers"
                    class="absolute top-0 left-0 right-0 h-6 bg-zinc-800 border-b border-zinc-700 z-10"></div>
                <div v-if="showRulers"
                    class="absolute top-0 left-0 bottom-0 w-6 bg-zinc-800 border-r border-zinc-700 z-10"></div>

                <!-- Canvas -->
                <div class="absolute inset-0 flex items-center justify-center" :style="{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: 'center',
                    cursor: getCursor()
                }">
                    <svg ref="svgRef" :width="canvasWidth" :height="canvasHeight"
                        :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`" xmlns="http://www.w3.org/2000/svg"
                        :style="{ backgroundColor: canvasBg }" class="shadow-2xl" @mousedown="onSvgMouseDown"
                        @mousemove="onSvgMouseMove" @mouseup="onSvgMouseUp" @contextmenu.prevent="onContextMenu">

                        <!-- Grid -->
                        <defs v-if="showGrid">
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)"
                                    stroke-width="1" />
                            </pattern>
                        </defs>
                        <rect v-if="showGrid" width="100%" height="100%" fill="url(#grid)" />

                        <!-- Shadow Filter -->
                        <defs>
                            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                                <feOffset dx="2" dy="2" result="offsetblur" />
                                <feFlood flood-color="rgba(0,0,0,0.3)" />
                                <feComposite in2="offsetblur" operator="in" />
                                <feMerge>
                                    <feMergeNode />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <!-- Shapes -->
                        <g v-for="shape in shapes" :key="shape.id" :opacity="shape.opacity"
                            :transform="`translate(${shape.x || 0}, ${shape.y || 0}) rotate(${shape.rotation || 0}) scale(${shape.scaleX || 1}, ${shape.scaleY || 1})`"
                            @mousedown.stop="onShapeMouseDown($event, shape)"
                            @contextmenu.prevent.stop="onShapeContextMenu($event, shape)" style="cursor: pointer;">

                            <!-- Path -->
                            <path v-if="shape.type === 'path'" :d="shape.d" :fill="shape.fill" :stroke="shape.stroke"
                                :stroke-width="shape.strokeWidth" :filter="shape.shadow ? 'url(#shadow)' : ''" />

                            <!-- Rectangle -->
                            <rect v-else-if="shape.type === 'rect'" :width="shape.width" :height="shape.height"
                                :rx="shape.rx || 0" :ry="shape.ry || 0" :fill="shape.fill" :stroke="shape.stroke"
                                :stroke-width="shape.strokeWidth" :filter="shape.shadow ? 'url(#shadow)' : ''" />

                            <!-- Circle -->
                            <circle v-else-if="shape.type === 'circle'" :r="shape.r" :fill="shape.fill"
                                :stroke="shape.stroke" :stroke-width="shape.strokeWidth"
                                :filter="shape.shadow ? 'url(#shadow)' : ''" />

                            <!-- Ellipse -->
                            <ellipse v-else-if="shape.type === 'ellipse'" :rx="shape.rx" :ry="shape.ry"
                                :fill="shape.fill" :stroke="shape.stroke" :stroke-width="shape.strokeWidth"
                                :filter="shape.shadow ? 'url(#shadow)' : ''" />

                            <!-- Polygon -->
                            <polygon v-else-if="shape.type === 'polygon'" :points="shape.points" :fill="shape.fill"
                                :stroke="shape.stroke" :stroke-width="shape.strokeWidth"
                                :filter="shape.shadow ? 'url(#shadow)' : ''" />

                            <!-- Star -->
                            <polygon v-else-if="shape.type === 'star'" :points="shape.points" :fill="shape.fill"
                                :stroke="shape.stroke" :stroke-width="shape.strokeWidth"
                                :filter="shape.shadow ? 'url(#shadow)' : ''" />

                            <!-- Line -->
                            <line v-else-if="shape.type === 'line'" :x1="0" :y1="0" :x2="shape.x2" :y2="shape.y2"
                                :stroke="shape.stroke" :stroke-width="shape.strokeWidth"
                                :filter="shape.shadow ? 'url(#shadow)' : ''" />

                            <!-- Arrow -->
                            <g v-else-if="shape.type === 'arrow'">
                                <line :x1="0" :y1="0" :x2="shape.x2" :y2="shape.y2" :stroke="shape.stroke"
                                    :stroke-width="shape.strokeWidth" />
                                <polygon :points="getArrowHead(shape)" :fill="shape.stroke" />
                            </g>

                            <!-- Text -->
                            <text v-else-if="shape.type === 'text'" :font-size="shape.fontSize"
                                :font-family="shape.fontFamily" :font-weight="shape.fontWeight" :fill="shape.fill"
                                :filter="shape.shadow ? 'url(#shadow)' : ''">
                                {{ shape.text }}
                            </text>
                        </g>

                        <!-- Selection Box -->
                        <rect v-if="selected && selectionBox" :x="selectionBox.x" :y="selectionBox.y"
                            :width="selectionBox.width" :height="selectionBox.height" fill="none" stroke="#8b5cf6"
                            stroke-width="2" stroke-dasharray="5,5" pointer-events="none" />

                        <!-- Resize Handles -->
                        <g v-if="selected && selectionBox">
                            <rect v-for="handle in resizeHandles" :key="handle.position" :x="handle.x - 4"
                                :y="handle.y - 4" width="8" height="8" fill="#8b5cf6" stroke="white" stroke-width="1"
                                :style="{ cursor: handle.cursor }" @mousedown.stop="onResizeStart($event, handle)" />
                        </g>

                        <!-- Drawing Preview -->
                        <path v-if="drawing && drawingPath" :d="drawingPath" fill="none" :stroke="currentStroke"
                            :stroke-width="strokeWidth" opacity="0.7" pointer-events="none" />

                        <!-- Shape Preview -->
                        <g v-if="shapePreview" opacity="0.5" pointer-events="none">
                            <rect v-if="shapePreview.type === 'rect'" :x="shapePreview.x" :y="shapePreview.y"
                                :width="shapePreview.width" :height="shapePreview.height" :rx="shapePreview.rx || 0"
                                fill="none" stroke="white" stroke-width="2" stroke-dasharray="5,5" />
                            <circle v-else-if="shapePreview.type === 'circle'" :cx="shapePreview.cx"
                                :cy="shapePreview.cy" :r="shapePreview.r" fill="none" stroke="white" stroke-width="2"
                                stroke-dasharray="5,5" />
                            <ellipse v-else-if="shapePreview.type === 'ellipse'" :cx="shapePreview.cx"
                                :cy="shapePreview.cy" :rx="shapePreview.rx" :ry="shapePreview.ry" fill="none"
                                stroke="white" stroke-width="2" stroke-dasharray="5,5" />
                        </g>
                    </svg>
                </div>

                <!-- Context Menu -->
                <div v-if="contextMenu.show" class="context-menu"
                    :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }">
                    <div class="context-menu-item" @click="duplicateSelected" v-if="selected">
                        <Copy class="w-4 h-4" /> Duplicate
                    </div>
                    <div class="context-menu-item" @click="copySelected" v-if="selected">
                        <Clipboard class="w-4 h-4" /> Copy
                    </div>
                    <div class="context-menu-item" @click="paste">
                        <ClipboardPaste class="w-4 h-4" /> Paste
                    </div>
                    <div class="context-menu-separator"></div>
                    <div class="context-menu-item" @click="bringToFront" v-if="selected">
                        <BringToFront class="w-4 h-4" /> Bring to Front
                    </div>
                    <div class="context-menu-item" @click="sendToBack" v-if="selected">
                        <SendToBack class="w-4 h-4" /> Send to Back
                    </div>
                    <div class="context-menu-separator" v-if="selected"></div>
                    <div class="context-menu-item" @click="groupSelected" v-if="multiSelected">
                        <Group class="w-4 h-4" /> Group
                    </div>
                    <div class="context-menu-item" @click="ungroupSelected" v-if="selected?.grouped">
                        <Ungroup class="w-4 h-4" /> Ungroup
                    </div>
                    <div class="context-menu-separator" v-if="selected"></div>
                    <div class="context-menu-item text-red-400" @click="deleteSelected" v-if="selected">
                        <Trash2 class="w-4 h-4" /> Delete
                    </div>
                </div>

                <!-- Shape Properties Panel -->
                <div v-if="showPropertiesPanel && selected"
                    class="absolute right-4 top-4 w-64 bg-zinc-900 border border-zinc-700 rounded-lg p-4 animate-slide-in">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-sm font-semibold">Properties</h3>
                        <button @click="showPropertiesPanel = false" class="text-zinc-500 hover:text-white">
                            <X class="w-4 h-4" />
                        </button>
                    </div>

                    <div class="space-y-3">
                        <div class="property-row">
                            <label class="property-label">Fill</label>
                            <input type="color" v-model="selected.fill" class="property-input h-8">
                        </div>
                        <div class="property-row">
                            <label class="property-label">Stroke</label>
                            <input type="color" v-model="selected.stroke" class="property-input h-8">
                        </div>
                        <div class="property-row">
                            <label class="property-label">Stroke Width</label>
                            <input type="range" v-model.number="selected.strokeWidth" min="0" max="20"
                                class="property-input">
                        </div>
                        <div class="property-row">
                            <label class="property-label">Opacity</label>
                            <input type="range" v-model.number="selected.opacity" min="0" max="1" step="0.1"
                                class="property-input">
                        </div>
                        <div class="property-row" v-if="selected.type === 'rect'">
                            <label class="property-label">Corner Radius</label>
                            <input type="number" v-model.number="selected.rx" min="0" class="property-input">
                        </div>
                        <div class="property-row">
                            <label class="property-label">Shadow</label>
                            <input type="checkbox" v-model="selected.shadow" class="w-4 h-4">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Properties Panel -->
            <div class="w-64 border-l border-zinc-800 bg-zinc-900/50 p-4">
                <h3 class="text-sm font-semibold mb-3">Style</h3>

                <div class="space-y-3">
                    <div class="property-row">
                        <label class="property-label">Fill</label>
                        <input type="color" v-model="currentFill" class="property-input h-8">
                    </div>
                    <div class="property-row">
                        <label class="property-label">Stroke</label>
                        <input type="color" v-model="currentStroke" class="property-input h-8">
                    </div>
                    <div class="property-row">
                        <label class="property-label">Stroke Width</label>
                        <input type="range" v-model.number="strokeWidth" min="0" max="20" class="property-input">
                    </div>
                    <div class="property-row">
                        <label class="property-label">Opacity</label>
                        <input type="range" v-model.number="opacity" min="0" max="1" step="0.1" class="property-input">
                    </div>
                </div>

                <h3 class="text-sm font-semibold mt-6 mb-3">Layers</h3>
                <div class="space-y-1 max-h-64 overflow-y-auto">
                    <div v-for="shape in [...shapes].reverse()" :key="shape.id"
                        class="px-2 py-1 rounded text-xs cursor-pointer transition-colors"
                        :class="shape === selected ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'"
                        @click="selectShape(shape)">
                        <component :is="getShapeIcon(shape.type)" class="w-3 h-3 inline mr-1" />
                        {{ shape.name || shape.type }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Status Bar -->
        <div
            class="h-8 px-4 flex items-center justify-between border-t border-zinc-800 bg-zinc-900/50 text-xs text-zinc-500">
            <div>{{ tool.charAt(0).toUpperCase() + tool.slice(1) }} Tool</div>
            <div>{{ Math.round(zoom * 100) }}%</div>
            <div>{{ shapes.length }} objects</div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import {
    MousePointer2, Hand, PenTool, Type, Pipette, Trash2,
    FilePlus, Upload, Download, ImageIcon as ImageIcon, Settings, Eye,
    Undo, Redo, Grid, Ruler, Magnet, Maximize, Search,
    Copy, Clipboard, ClipboardPaste, BringToFront, SendToBack,
    Group, Ungroup, X, Square, Circle, Hexagon, Star, Minus, ArrowRight,
    Triangle
} from 'lucide-vue-next'

// Core state
const tool = ref('select')
const shapes = ref([])
const selected = ref(null)
const multiSelected = ref(false)
const clipboard = ref(null)

// Refs
const canvasContainer = ref(null)
const svgRef = ref(null)

// Canvas settings
const canvasWidth = ref(1200)
const canvasHeight = ref(800)
const canvasBg = ref('#1a1a1a')
const zoom = ref(1)
const pan = ref({ x: 0, y: 0 })

// Drawing state
const drawing = ref(false)
const drawingPoints = ref([])
const drawingPath = ref('')
const shapePreview = ref(null)
const dragStart = ref(null)
const isPanning = ref(false)
const resizeData = ref(null)
const moveData = ref(null)

// UI state
const showGrid = ref(false)
const showRulers = ref(false)
const snapToGrid = ref(false)
const showCanvasSettings = ref(false)
const showViewOptions = ref(false)
const showShapeMenu = ref(false)
const showPropertiesPanel = ref(false)
const contextMenu = ref({ show: false, x: 0, y: 0 })

// Style settings
const currentFill = ref('#8b5cf6')
const currentStroke = ref('#ffffff')
const strokeWidth = ref(2)
const opacity = ref(1)

// History for undo/redo
const history = ref([])
const historyIndex = ref(-1)

// Shape tools configuration
const shapeTools = [
    { type: 'rect', icon: Square, label: 'Rectangle' },
    { type: 'circle', icon: Circle, label: 'Circle' },
    { type: 'ellipse', icon: Circle, label: 'Ellipse' },
    { type: 'polygon', icon: Hexagon, label: 'Polygon' },
    { type: 'star', icon: Star, label: 'Star' },
    { type: 'line', icon: Minus, label: 'Line' },
    { type: 'arrow', icon: ArrowRight, label: 'Arrow' }
]

// Computed properties
const canUndo = computed(() => historyIndex.value >= 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)
const isShapeTool = computed(() => ['rect', 'circle', 'ellipse', 'polygon', 'star', 'line', 'arrow'].includes(tool.value))
const shapeIcon = computed(() => {
    const shape = shapeTools.find(s => s.type === tool.value)
    return shape ? shape.icon : Square
})

const selectionBox = computed(() => {
    if (!selected.value) return null
    const shape = selected.value
    let width, height

    if (shape.type === 'rect') {
        width = shape.width
        height = shape.height
    } else if (shape.type === 'circle') {
        width = height = shape.r * 2
    } else if (shape.type === 'ellipse') {
        width = shape.rx * 2
        height = shape.ry * 2
    } else if (shape.type === 'text') {
        // Estimate text dimensions
        width = (shape.text?.length || 5) * (shape.fontSize || 16) * 0.6
        height = shape.fontSize || 16
    } else {
        width = 100
        height = 100
    }

    return {
        x: shape.x - 2,
        y: shape.y - 2,
        width: width + 4,
        height: height + 4
    }
})

const resizeHandles = computed(() => {
    if (!selectionBox.value) return []
    const box = selectionBox.value
    return [
        { position: 'nw', x: box.x, y: box.y, cursor: 'nw-resize' },
        { position: 'n', x: box.x + box.width / 2, y: box.y, cursor: 'n-resize' },
        { position: 'ne', x: box.x + box.width, y: box.y, cursor: 'ne-resize' },
        { position: 'e', x: box.x + box.width, y: box.y + box.height / 2, cursor: 'e-resize' },
        { position: 'se', x: box.x + box.width, y: box.y + box.height, cursor: 'se-resize' },
        { position: 's', x: box.x + box.width / 2, y: box.y + box.height, cursor: 's-resize' },
        { position: 'sw', x: box.x, y: box.y + box.height, cursor: 'sw-resize' },
        { position: 'w', x: box.x, y: box.y + box.height / 2, cursor: 'w-resize' }
    ]
})

// Helper functions
const generateId = () => 'shape_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)

const getCursor = () => {
    if (isPanning.value) return 'grabbing'
    if (tool.value === 'hand') return 'grab'
    if (tool.value === 'pen') return 'crosshair'
    if (tool.value === 'text') return 'text'
    if (isShapeTool.value) return 'crosshair'
    return 'default'
}

const getShapeIcon = (type) => {
    const icons = {
        rect: Square,
        circle: Circle,
        ellipse: Circle,
        polygon: Hexagon,
        star: Star,
        line: Minus,
        arrow: ArrowRight,
        text: Type,
        path: PenTool
    }
    return icons[type] || Square
}

const getArrowHead = (shape) => {
    const angle = Math.atan2(shape.y2, shape.x2)
    const x = shape.x2
    const y = shape.y2
    const size = 10

    const x1 = x - size * Math.cos(angle - Math.PI / 6)
    const y1 = y - size * Math.sin(angle - Math.PI / 6)
    const x2 = x - size * Math.cos(angle + Math.PI / 6)
    const y2 = y - size * Math.sin(angle + Math.PI / 6)

    return `${x},${y} ${x1},${y1} ${x2},${y2}`
}

const saveHistory = () => {
    const state = JSON.stringify(shapes.value)
    if (historyIndex.value < history.value.length - 1) {
        history.value = history.value.slice(0, historyIndex.value + 1)
    }
    history.value.push(state)
    historyIndex.value++
    if (history.value.length > 50) {
        history.value.shift()
        historyIndex.value--
    }
}

const undo = () => {
    if (canUndo.value) {
        historyIndex.value--
        if (historyIndex.value >= 0) {
            shapes.value = JSON.parse(history.value[historyIndex.value])
        } else {
            shapes.value = []
        }
        selected.value = null
    }
}

const redo = () => {
    if (canRedo.value) {
        historyIndex.value++
        shapes.value = JSON.parse(history.value[historyIndex.value])
        selected.value = null
    }
}

const selectShape = (shape) => {
    selected.value = shape
    showPropertiesPanel.value = true
}

const selectShapeTool = (type) => {
    tool.value = type
    showShapeMenu.value = false
}

const addShape = (shape) => {
    shape.id = generateId()
    if (!shape.x) shape.x = 0
    if (!shape.y) shape.y = 0
    if (!shape.scaleX) shape.scaleX = 1
    if (!shape.scaleY) shape.scaleY = 1
    if (!shape.rotation) shape.rotation = 0
    shapes.value.push(shape)
    selectShape(shape)
    saveHistory()
    // Auto-switch to select tool after adding shape
    tool.value = 'select'
}

const deleteSelected = () => {
    if (selected.value) {
        shapes.value = shapes.value.filter(s => s !== selected.value)
        selected.value = null
        saveHistory()
    }
}

const duplicateSelected = () => {
    if (selected.value) {
        const clone = { ...selected.value, id: generateId(), x: selected.value.x + 20, y: selected.value.y + 20 }
        shapes.value.push(clone)
        selectShape(clone)
        saveHistory()
    }
    contextMenu.value.show = false
}

const copySelected = () => {
    if (selected.value) {
        clipboard.value = { ...selected.value }
    }
    contextMenu.value.show = false
}

const paste = () => {
    if (clipboard.value) {
        const shape = { ...clipboard.value, id: generateId(), x: clipboard.value.x + 20, y: clipboard.value.y + 20 }
        addShape(shape)
    }
    contextMenu.value.show = false
}

const bringToFront = () => {
    if (selected.value) {
        const index = shapes.value.indexOf(selected.value)
        if (index > -1) {
            shapes.value.splice(index, 1)
            shapes.value.push(selected.value)
            saveHistory()
        }
    }
    contextMenu.value.show = false
}

const sendToBack = () => {
    if (selected.value) {
        const index = shapes.value.indexOf(selected.value)
        if (index > -1) {
            shapes.value.splice(index, 1)
            shapes.value.unshift(selected.value)
            saveHistory()
        }
    }
    contextMenu.value.show = false
}

const groupSelected = () => {
    // TODO: Implement grouping
    contextMenu.value.show = false
}

const ungroupSelected = () => {
    // TODO: Implement ungrouping
    contextMenu.value.show = false
}

const toggleGrid = () => {
    showGrid.value = !showGrid.value
    showViewOptions.value = false
}

const toggleRulers = () => {
    showRulers.value = !showRulers.value
    showViewOptions.value = false
}

const toggleSnap = () => {
    snapToGrid.value = !snapToGrid.value
    showViewOptions.value = false
}

const fitToScreen = () => {
    if (canvasContainer.value) {
        const containerWidth = canvasContainer.value.clientWidth - 300
        const containerHeight = canvasContainer.value.clientHeight - 100
        const scaleX = containerWidth / canvasWidth.value
        const scaleY = containerHeight / canvasHeight.value
        zoom.value = Math.min(scaleX, scaleY, 1)
        pan.value = { x: 0, y: 0 }
    }
    showCanvasSettings.value = false
}

const resetZoom = () => {
    zoom.value = 1
    pan.value = { x: 0, y: 0 }
    showCanvasSettings.value = false
}

const newCanvas = () => {
    if (confirm('Create new canvas? All unsaved work will be lost.')) {
        shapes.value = []
        selected.value = null
        history.value = []
        historyIndex.value = -1
        zoom.value = 1
        pan.value = { x: 0, y: 0 }
    }
}

const eyedropperTool = () => {
    // TODO: Implement eyedropper
    alert('Eyedropper tool coming soon!')
}

const downloadSVG = () => {
    const svgElement = svgRef.value
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'drawing.svg'
    a.click()
    URL.revokeObjectURL(url)
}

const downloadPNG = () => {
    const svgElement = svgRef.value
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    canvas.width = canvasWidth.value
    canvas.height = canvasHeight.value

    img.onload = () => {
        ctx.fillStyle = canvasBg.value
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'drawing.png'
            a.click()
            URL.revokeObjectURL(url)
        })
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
}

const onImportFile = (e) => {
    const file = e.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            // TODO: Parse and import SVG
            console.log('Import SVG:', e.target.result)
        }
        reader.readAsText(file)
    }
}

// Mouse/Input handlers
const onWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
        // Zoom
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        zoom.value = Math.max(0.1, Math.min(5, zoom.value * delta))
    } else {
        // Pan
        pan.value.x -= e.deltaX
        pan.value.y -= e.deltaY
    }
}

const onCanvasMouseDown = (e) => {
    if (tool.value === 'hand' || e.button === 1) {
        isPanning.value = true
        dragStart.value = { x: e.clientX - pan.value.x, y: e.clientY - pan.value.y }
    }
}

const onCanvasMouseMove = (e) => {
    if (isPanning.value && dragStart.value) {
        pan.value.x = e.clientX - dragStart.value.x
        pan.value.y = e.clientY - dragStart.value.y
    }
}

const onCanvasMouseUp = () => {
    isPanning.value = false
    dragStart.value = null
}

const getSvgPoint = (e) => {
    const svg = svgRef.value
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const ctm = svg.getScreenCTM()
    if (ctm) {
        return pt.matrixTransform(ctm.inverse())
    }
    return pt
}

const snapToGridValue = (value) => {
    if (!snapToGrid.value) return value
    const gridSize = 20
    return Math.round(value / gridSize) * gridSize
}

const onSvgMouseDown = (e) => {
    const point = getSvgPoint(e)
    point.x = snapToGridValue(point.x)
    point.y = snapToGridValue(point.y)

    if (tool.value === 'pen') {
        drawing.value = true
        drawingPoints.value = [point]
        drawingPath.value = `M ${point.x} ${point.y}`
    } else if (isShapeTool.value) {
        dragStart.value = point
        shapePreview.value = { type: tool.value, x: point.x, y: point.y }
    } else if (tool.value === 'text') {
        const text = prompt('Enter text:')
        if (text) {
            addShape({
                type: 'text',
                text: text,
                x: point.x,
                y: point.y,
                fill: currentFill.value,
                fontSize: 24,
                fontFamily: 'Arial',
                fontWeight: 'normal',
                opacity: opacity.value
            })
        }
    } else if (tool.value === 'select') {
        selected.value = null
        showPropertiesPanel.value = false
    }
}

const onSvgMouseMove = (e) => {
    const point = getSvgPoint(e)
    point.x = snapToGridValue(point.x)
    point.y = snapToGridValue(point.y)

    if (drawing.value && tool.value === 'pen') {
        drawingPoints.value.push(point)
        drawingPath.value += ` L ${point.x} ${point.y}`
    } else if (dragStart.value && isShapeTool.value) {
        const dx = point.x - dragStart.value.x
        const dy = point.y - dragStart.value.y

        if (tool.value === 'rect') {
            shapePreview.value = {
                type: 'rect',
                x: Math.min(dragStart.value.x, point.x),
                y: Math.min(dragStart.value.y, point.y),
                width: Math.abs(dx),
                height: Math.abs(dy),
                rx: 5 // default corner radius
            }
        } else if (tool.value === 'circle') {
            const r = Math.sqrt(dx * dx + dy * dy)
            shapePreview.value = {
                type: 'circle',
                cx: dragStart.value.x,
                cy: dragStart.value.y,
                r: r
            }
        } else if (tool.value === 'ellipse') {
            shapePreview.value = {
                type: 'ellipse',
                cx: dragStart.value.x,
                cy: dragStart.value.y,
                rx: Math.abs(dx),
                ry: Math.abs(dy)
            }
        }
    } else if (moveData.value && selected.value) {
        const dx = point.x - moveData.value.startX
        const dy = point.y - moveData.value.startY
        selected.value.x = moveData.value.originalX + dx
        selected.value.y = moveData.value.originalY + dy
    } else if (resizeData.value && selected.value) {
        handleResize(point)
    }
}

const onSvgMouseUp = (e) => {
    if (drawing.value && tool.value === 'pen') {
        drawing.value = false
        if (drawingPoints.value.length > 1) {
            addShape({
                type: 'path',
                d: drawingPath.value,
                fill: 'none',
                stroke: currentStroke.value,
                strokeWidth: strokeWidth.value,
                opacity: opacity.value
            })
        }
        drawingPoints.value = []
        drawingPath.value = ''
    } else if (shapePreview.value && isShapeTool.value) {
        const point = getSvgPoint(e)
        point.x = snapToGridValue(point.x)
        point.y = snapToGridValue(point.y)

        const dx = point.x - dragStart.value.x
        const dy = point.y - dragStart.value.y

        if (tool.value === 'rect' && Math.abs(dx) > 5 && Math.abs(dy) > 5) {
            addShape({
                type: 'rect',
                x: Math.min(dragStart.value.x, point.x),
                y: Math.min(dragStart.value.y, point.y),
                width: Math.abs(dx),
                height: Math.abs(dy),
                fill: currentFill.value,
                stroke: currentStroke.value,
                strokeWidth: strokeWidth.value,
                opacity: opacity.value,
                rx: 5,
                ry: 5
            })
        } else if (tool.value === 'circle' && Math.abs(dx) > 5) {
            const r = Math.sqrt(dx * dx + dy * dy)
            addShape({
                type: 'circle',
                x: dragStart.value.x - r,
                y: dragStart.value.y - r,
                r: r,
                fill: currentFill.value,
                stroke: currentStroke.value,
                strokeWidth: strokeWidth.value,
                opacity: opacity.value
            })
        } else if (tool.value === 'ellipse' && Math.abs(dx) > 5 && Math.abs(dy) > 5) {
            addShape({
                type: 'ellipse',
                x: dragStart.value.x - Math.abs(dx),
                y: dragStart.value.y - Math.abs(dy),
                rx: Math.abs(dx),
                ry: Math.abs(dy),
                fill: currentFill.value,
                stroke: currentStroke.value,
                strokeWidth: strokeWidth.value,
                opacity: opacity.value
            })
        }

        shapePreview.value = null
        dragStart.value = null
    }

    moveData.value = null
    resizeData.value = null
}

const onShapeMouseDown = (e, shape) => {
    if (tool.value === 'select') {
        e.stopPropagation()
        selectShape(shape)

        const point = getSvgPoint(e)
        moveData.value = {
            startX: point.x,
            startY: point.y,
            originalX: shape.x,
            originalY: shape.y
        }
    }
}

const onShapeContextMenu = (e, shape) => {
    selectShape(shape)
    onContextMenu(e)
}

const onContextMenu = (e) => {
    contextMenu.value = {
        show: true,
        x: e.clientX,
        y: e.clientY
    }
}

const onResizeStart = (e, handle) => {
    e.stopPropagation()
    const point = getSvgPoint(e)
    resizeData.value = {
        handle: handle.position,
        startX: point.x,
        startY: point.y,
        originalShape: { ...selected.value }
    }
}

const handleResize = (point) => {
    if (!resizeData.value || !selected.value) return

    const { handle, startX, startY, originalShape } = resizeData.value
    const dx = point.x - startX
    const dy = point.y - startY

    if (selected.value.type === 'rect') {
        if (handle.includes('e')) {
            selected.value.width = originalShape.width + dx
        }
        if (handle.includes('w')) {
            selected.value.x = originalShape.x + dx
            selected.value.width = originalShape.width - dx
        }
        if (handle.includes('s')) {
            selected.value.height = originalShape.height + dy
        }
        if (handle.includes('n')) {
            selected.value.y = originalShape.y + dy
            selected.value.height = originalShape.height - dy
        }

        selected.value.width = Math.max(10, selected.value.width)
        selected.value.height = Math.max(10, selected.value.height)
    }
    // Add similar logic for other shapes
}

// Keyboard shortcuts
const handleKeyDown = (e) => {
    if (e.key === 'Delete' && selected.value) {
        deleteSelected()
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        undo()
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        redo()
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selected.value) {
        e.preventDefault()
        copySelected()
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault()
        paste()
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selected.value) {
        e.preventDefault()
        duplicateSelected()
    } else if (e.key === 'v') {
        tool.value = 'select'
    } else if (e.key === 'h') {
        tool.value = 'hand'
    } else if (e.key === 'p') {
        tool.value = 'pen'
    } else if (e.key === 't') {
        tool.value = 'text'
    } else if (e.key === 'Escape') {
        selected.value = null
        showPropertiesPanel.value = false
        drawing.value = false
        drawingPoints.value = []
        drawingPath.value = ''
        shapePreview.value = null
    }
}

// Click outside handlers
const handleClickOutside = (e) => {
    if (!e.target.closest('.context-menu')) {
        contextMenu.value.show = false
    }
    if (!e.target.closest('.dropdown-menu') && !e.target.closest('.top-button')) {
        showCanvasSettings.value = false
        showViewOptions.value = false
    }
    if (!e.target.closest('.tool-button')) {
        showShapeMenu.value = false
    }
}

// Lifecycle
onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleClickOutside)

    // Auto-fit on load
    nextTick(() => {
        fitToScreen()
    })

    // Initialize with empty history
    saveHistory()
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.tool-button {
    @apply w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200;
    @apply bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white;
    @apply border border-zinc-700 hover:border-zinc-600;
}

.tool-button.active {
    @apply bg-violet-600 hover:bg-violet-500 text-white border-violet-500;
}

.top-button {
    @apply px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200;
    @apply bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white;
    @apply border border-zinc-700 hover:border-zinc-600;
}

.context-menu {
    @apply absolute bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl py-1 z-50;
    @apply min-w-[200px];
}

.context-menu-item {
    @apply px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white;
    @apply cursor-pointer flex items-center gap-2 transition-colors;
}

.context-menu-separator {
    @apply my-1 border-t border-zinc-700;
}

.property-row {
    @apply grid grid-cols-3 gap-2 items-center;
}

.property-label {
    @apply text-xs text-zinc-400;
}

.property-input {
    @apply col-span-2 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-sm text-white;
}

.dropdown-menu {
    @apply absolute top-full left-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl py-1 z-50;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-in {
    animation: slideIn 0.2s ease-out;
}
</style>