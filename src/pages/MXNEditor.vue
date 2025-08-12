<template>
    <div class="h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden select-none">
        <!-- Top Menu Bar -->
        <div class="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-6 relative">
            <span class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">MXN
                Editor</span>
            <div class="flex gap-4 text-sm">
                <button @click="toggleMenu('file')" class="hover:text-violet-400 transition-colors">File</button>
                <button @click="toggleMenu('edit')" class="hover:text-violet-400 transition-colors">Edit</button>
                <button @click="toggleMenu('image')" class="hover:text-violet-400 transition-colors">Image</button>
                <button @click="toggleMenu('filter')" class="hover:text-violet-400 transition-colors">Filter</button>
                <button @click="toggleMenu('view')" class="hover:text-violet-400 transition-colors">View</button>
            </div>

            <!-- Dropdown Menus -->
            <div v-if="activeMenu === 'file'"
                class="absolute top-10 left-20 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 py-2 min-w-[200px]">
                <button @click="newDocument" class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">New...
                    <span class="float-right text-zinc-500">Ctrl+N</span></button>
                <button @click="openFile" class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Open...
                    <span class="float-right text-zinc-500">Ctrl+O</span></button>
                <button @click="saveFile" class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Save As...
                    <span class="float-right text-zinc-500">Ctrl+S</span></button>
                <div class="border-t border-zinc-800 my-2"></div>
                <button @click="exportPNG" class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Export as
                    PNG</button>
                <button @click="exportJPG" class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Export as
                    JPG</button>
            </div>

            <div v-if="activeMenu === 'edit'"
                class="absolute top-10 left-20 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 py-2 min-w-[200px]">
                <button @click="undo" class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Undo <span
                        class="float-right text-zinc-500">Ctrl+Z</span></button>
                <button @click="redo" class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Redo <span
                        class="float-right text-zinc-500">Ctrl+Y</span></button>
                <div class="border-t border-zinc-800 my-2"></div>
                <button @click="clearCanvas"
                    class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Clear</button>
                <button @click="fillCanvas" class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Fill with
                    Color</button>
            </div>

            <div v-if="activeMenu === 'image'"
                class="absolute top-10 left-20 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 py-2 min-w-[200px]">
                <button @click="resizeImage" class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Image
                    Size...</button>
                <button @click="resizeCanvas" class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Canvas
                    Size...</button>
                <button @click="rotateImage(90)"
                    class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Rotate 90° CW</button>
                <button @click="rotateImage(-90)"
                    class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Rotate 90° CCW</button>
                <button @click="flipHorizontal" class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Flip
                    Horizontal</button>
                <button @click="flipVertical" class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Flip
                    Vertical</button>
            </div>

            <div v-if="activeMenu === 'filter'"
                class="absolute top-10 left-20 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 py-2 min-w-[200px]">
                <button @click="applyFilter('blur')"
                    class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Blur</button>
                <button @click="applyFilter('sharpen')"
                    class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Sharpen</button>
                <button @click="applyFilter('grayscale')"
                    class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Grayscale</button>
                <button @click="applyFilter('sepia')"
                    class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Sepia</button>
                <button @click="applyFilter('invert')"
                    class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Invert</button>
                <button @click="adjustBrightness"
                    class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Brightness/Contrast...</button>
                <button @click="adjustHueSaturation"
                    class="w-full px-4 py-2 text-left hover:bg-violet-600/20 text-sm">Hue/Saturation...</button>
            </div>

            <div class="ml-auto flex gap-2 text-xs text-zinc-400">
                <span>Zoom: {{ Math.round(zoom * 100) }}%</span>
                <span>|</span>
                <span>{{ canvasWidth }}x{{ canvasHeight }}px</span>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 flex overflow-hidden">
            <!-- Left Toolbar -->
            <div class="w-14 bg-zinc-900 border-r border-zinc-800 p-2 flex flex-col gap-1">
                <button v-for="tool in tools" :key="tool.id" @click="selectTool(tool.id)" :class="[
                    'p-2 rounded-lg transition-all duration-200',
                    selectedTool === tool.id
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25'
                        : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100'
                ]" :title="tool.name">
                    <component :is="tool.icon" :size="20" />
                </button>
                <div class="mt-auto space-y-2">
                    <div class="relative">
                        <div @click="swapColors"
                            class="absolute top-0 right-0 w-3 h-3 bg-zinc-900 rounded-full flex items-center justify-center cursor-pointer z-10 hover:bg-zinc-800">
                            <ArrowUpDown :size="8" />
                        </div>
                        <div class="w-8 h-8 rounded border-2 border-zinc-700 relative overflow-hidden mb-1">
                            <input type="color" v-model="foregroundColor"
                                class="absolute inset-0 w-16 h-16 -left-2 -top-2 cursor-pointer"
                                title="Foreground Color" />
                        </div>
                        <div class="w-8 h-8 rounded border-2 border-zinc-700 relative overflow-hidden">
                            <input type="color" v-model="backgroundColor"
                                class="absolute inset-0 w-16 h-16 -left-2 -top-2 cursor-pointer"
                                title="Background Color" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Canvas Area -->
            <div class="flex-1 bg-zinc-925 relative overflow-hidden" @wheel.prevent="handleWheel"
                @mousedown="handleCanvasMouseDown" @mousemove="handleCanvasMouseMove" @mouseup="handleCanvasMouseUp">
                <div class="absolute inset-0" :style="{
                    backgroundImage: 'repeating-conic-gradient(#1a1a1a 0% 25%, #0d0d0d 0% 50%)',
                    backgroundPosition: '0 0, 10px 10px',
                    backgroundSize: '20px 20px'
                }">
                    <div ref="canvasContainer" class="absolute" :style="{
                        transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
                        transformOrigin: 'center center',
                        left: '50%',
                        top: '50%',
                        marginLeft: `-${canvasWidth / 2}px`,
                        marginTop: `-${canvasHeight / 2}px`
                    }">
                        <!-- Main composite canvas -->
                        <canvas ref="mainCanvas" :width="canvasWidth" :height="canvasHeight" class="bg-white shadow-2xl"
                            :style="{ cursor: getCursor() }" />

                        <!-- Preview canvas for current stroke -->
                        <canvas ref="previewCanvas" :width="canvasWidth" :height="canvasHeight"
                            class="absolute inset-0 pointer-events-none" />

                        <!-- Text input overlay -->
                        <input v-if="showTextInput" ref="textInput" v-model="textContent" @keydown.enter="applyText"
                            @keydown.esc="cancelText" :style="{
                                position: 'absolute',
                                left: textPosition.x + 'px',
                                top: textPosition.y + 'px',
                                fontSize: fontSize + 'px',
                                fontFamily: fontFamily,
                                color: foregroundColor,
                                background: 'transparent',
                                border: '1px dashed #8b5cf6',
                                outline: 'none',
                                padding: '2px'
                            }" class="min-w-[100px]" placeholder="Type text..." />

                        <!-- Selection rectangle -->
                        <div v-if="selection"
                            class="absolute border-2 border-dashed border-violet-500 pointer-events-none" :style="{
                                left: Math.min(selection.x, selection.x + selection.width) + 'px',
                                top: Math.min(selection.y, selection.y + selection.height) + 'px',
                                width: Math.abs(selection.width) + 'px',
                                height: Math.abs(selection.height) + 'px'
                            }">
                            <div class="absolute -top-1 -left-1 w-2 h-2 bg-white border border-violet-500"></div>
                            <div class="absolute -top-1 -right-1 w-2 h-2 bg-white border border-violet-500"></div>
                            <div class="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-violet-500"></div>
                            <div class="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-violet-500"></div>
                        </div>
                    </div>
                </div>

                <!-- Zoom Controls -->
                <div class="absolute bottom-4 right-4 flex gap-2">
                    <button @click="zoom = Math.max(0.1, zoom - 0.1)"
                        class="p-2 bg-zinc-800/90 backdrop-blur rounded-lg hover:bg-zinc-700 transition-colors">
                        <ZoomOut :size="16" />
                    </button>
                    <button @click="zoom = 1"
                        class="px-3 py-2 bg-zinc-800/90 backdrop-blur rounded-lg hover:bg-zinc-700 transition-colors text-xs">
                        100%
                    </button>
                    <button @click="zoom = Math.min(5, zoom + 0.1)"
                        class="p-2 bg-zinc-800/90 backdrop-blur rounded-lg hover:bg-zinc-700 transition-colors">
                        <ZoomIn :size="16" />
                    </button>
                </div>
            </div>

            <!-- Right Panel -->
            <div class="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col">
                <!-- Tool Options -->
                <div class="p-4 border-b border-zinc-800">
                    <h3 class="text-sm font-semibold mb-3 text-zinc-300">Tool Options</h3>
                    <div class="space-y-3">
                        <!-- Brush/Eraser options -->
                        <div v-if="['brush', 'eraser', 'pencil'].includes(selectedTool)">
                            <label class="text-xs text-zinc-400 block mb-1">Size</label>
                            <div class="flex items-center gap-2">
                                <input type="range" v-model="brushSize" min="1" max="200"
                                    class="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer slider" />
                                <input type="number" v-model="brushSize" min="1" max="200"
                                    class="w-12 bg-zinc-800 rounded px-2 py-1 text-xs" />
                            </div>
                        </div>

                        <div v-if="['brush', 'pencil'].includes(selectedTool)">
                            <label class="text-xs text-zinc-400 block mb-1">Opacity</label>
                            <div class="flex items-center gap-2">
                                <input type="range" v-model="brushOpacity" min="0" max="100"
                                    class="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer slider" />
                                <span class="text-xs text-zinc-500 w-10">{{ brushOpacity }}%</span>
                            </div>
                        </div>

                        <div v-if="selectedTool === 'brush'">
                            <label class="text-xs text-zinc-400 block mb-1">Hardness</label>
                            <div class="flex items-center gap-2">
                                <input type="range" v-model="brushHardness" min="0" max="100"
                                    class="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer slider" />
                                <span class="text-xs text-zinc-500 w-10">{{ brushHardness }}%</span>
                            </div>
                        </div>

                        <!-- Shape options -->
                        <div v-if="['rectangle', 'ellipse', 'line'].includes(selectedTool)">
                            <label class="text-xs text-zinc-400 block mb-1">Stroke Width</label>
                            <div class="flex items-center gap-2">
                                <input type="range" v-model="strokeWidth" min="1" max="50"
                                    class="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer slider" />
                                <span class="text-xs text-zinc-500 w-10">{{ strokeWidth }}px</span>
                            </div>
                            <div class="flex items-center gap-2 mt-2">
                                <input type="checkbox" v-model="fillShape" id="fillShape"
                                    class="rounded border-zinc-600" />
                                <label for="fillShape" class="text-xs text-zinc-400">Fill shape</label>
                            </div>
                        </div>

                        <!-- Text options -->
                        <div v-if="selectedTool === 'text'">
                            <label class="text-xs text-zinc-400 block mb-1">Font Size</label>
                            <div class="flex items-center gap-2">
                                <input type="range" v-model="fontSize" min="8" max="200"
                                    class="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer slider" />
                                <span class="text-xs text-zinc-500 w-10">{{ fontSize }}px</span>
                            </div>
                            <label class="text-xs text-zinc-400 block mb-1 mt-2">Font Family</label>
                            <select v-model="fontFamily" class="w-full bg-zinc-800 rounded px-2 py-1 text-xs">
                                <option value="Arial">Arial</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Courier New">Courier New</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Verdana">Verdana</option>
                                <option value="Impact">Impact</option>
                            </select>
                        </div>

                        <!-- Clone stamp options -->
                        <div v-if="selectedTool === 'clone'">
                            <div class="text-xs text-zinc-400 mb-2">
                                Alt+Click to set source point
                            </div>
                            <div v-if="cloneSource" class="text-xs text-green-400">
                                Source set at ({{ Math.round(cloneSource.x) }}, {{ Math.round(cloneSource.y) }})
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Layers Panel -->
                <div class="flex-1 flex flex-col">
                    <div class="p-4 border-b border-zinc-800 flex items-center justify-between">
                        <h3 class="text-sm font-semibold text-zinc-300">Layers</h3>
                        <div class="flex gap-1">
                            <button @click="addLayer" class="p-1.5 hover:bg-zinc-800 rounded transition-colors"
                                title="Add Layer">
                                <Plus :size="16" />
                            </button>
                            <button @click="deleteLayer" :disabled="layers.length <= 1"
                                class="p-1.5 hover:bg-zinc-800 rounded transition-colors disabled:opacity-30"
                                title="Delete Layer">
                                <Trash2 :size="16" />
                            </button>
                            <button @click="duplicateLayer" class="p-1.5 hover:bg-zinc-800 rounded transition-colors"
                                title="Duplicate Layer">
                                <Copy :size="16" />
                            </button>
                            <button @click="mergeDown" :disabled="currentLayerIndex === 0"
                                class="p-1.5 hover:bg-zinc-800 rounded transition-colors disabled:opacity-30"
                                title="Merge Down">
                                <Layers :size="16" />
                            </button>
                        </div>
                    </div>
                    <div class="flex-1 overflow-y-auto p-2">
                        <div v-for="(layer, index) in [...layers].reverse()" :key="layer.id"
                            @click="selectLayer(layers.length - 1 - index)" :class="[
                                'p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200',
                                currentLayerIndex === layers.length - 1 - index
                                    ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/50'
                                    : 'bg-zinc-800/50 hover:bg-zinc-800 border border-transparent'
                            ]">
                            <div class="flex items-center gap-3">
                                <button @click.stop="layer.visible = !layer.visible"
                                    class="text-zinc-400 hover:text-zinc-100 transition-colors">
                                    <component :is="layer.visible ? Eye : EyeOff" :size="16" />
                                </button>
                                <canvas :ref="'thumbnail-' + layer.id" width="40" height="40"
                                    class="bg-zinc-700 rounded border border-zinc-600" />
                                <div class="flex-1">
                                    <input v-model="layer.name" @click.stop
                                        class="bg-transparent text-sm font-medium w-full outline-none focus:text-violet-400" />
                                    <div class="flex items-center gap-2 mt-1">
                                        <select v-model="layer.blendMode" @click.stop @change="updateComposite"
                                            class="text-xs bg-zinc-800 rounded px-1 py-0.5 outline-none">
                                            <option value="normal">Normal</option>
                                            <option value="multiply">Multiply</option>
                                            <option value="screen">Screen</option>
                                            <option value="overlay">Overlay</option>
                                            <option value="darken">Darken</option>
                                            <option value="lighten">Lighten</option>
                                            <option value="color-dodge">Color Dodge</option>
                                            <option value="color-burn">Color Burn</option>
                                            <option value="hard-light">Hard Light</option>
                                            <option value="soft-light">Soft Light</option>
                                            <option value="difference">Difference</option>
                                            <option value="exclusion">Exclusion</option>
                                        </select>
                                        <input type="range" v-model="layer.opacity" @click.stop @input="updateComposite"
                                            min="0" max="100"
                                            class="flex-1 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer slider-small" />
                                        <span class="text-xs text-zinc-500 w-8">{{ layer.opacity }}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- History Panel -->
                <div class="border-t border-zinc-800 p-4">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-sm font-semibold text-zinc-300">History</h3>
                        <div class="flex gap-1">
                            <button @click="undo" :disabled="historyIndex <= 0"
                                class="p-1.5 hover:bg-zinc-800 rounded transition-colors disabled:opacity-30">
                                <Undo :size="16" />
                            </button>
                            <button @click="redo" :disabled="historyIndex >= history.length - 1"
                                class="p-1.5 hover:bg-zinc-800 rounded transition-colors disabled:opacity-30">
                                <Redo :size="16" />
                            </button>
                        </div>
                    </div>
                    <div class="max-h-32 overflow-y-auto">
                        <div v-for="(item, index) in history" :key="index" :class="[
                            'text-xs py-1 px-2 rounded cursor-pointer transition-colors',
                            index === historyIndex
                                ? 'bg-violet-600/20 text-violet-400'
                                : index > historyIndex
                                    ? 'text-zinc-600'
                                    : 'text-zinc-500 hover:text-zinc-300'
                        ]" @click="goToHistory(index)">
                            {{ item.action }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Status Bar -->
        <div class="h-6 bg-zinc-900 border-t border-zinc-800 px-4 flex items-center text-xs text-zinc-500">
            <span>{{ getToolName(selectedTool) }}</span>
            <span class="mx-2">|</span>
            <span>X: {{ mouseX }} Y: {{ mouseY }}</span>
            <span class="mx-2">|</span>
            <span>Layer: {{ layers[currentLayerIndex]?.name }}</span>
            <span class="ml-auto">{{ status }}</span>
        </div>

        <!-- Hidden File Input -->
        <input ref="fileInput" type="file" accept="image/*" @change="handleFileUpload" class="hidden" />

        <!-- Dialogs -->
        <div v-if="showNewDocDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-zinc-900 rounded-lg p-6 border border-zinc-800 min-w-[400px]">
                <h2 class="text-lg font-semibold mb-4">New Document</h2>
                <div class="space-y-3">
                    <div>
                        <label class="text-sm text-zinc-400">Width (px)</label>
                        <input v-model="newDocWidth" type="number" class="w-full bg-zinc-800 rounded px-3 py-2 mt-1" />
                    </div>
                    <div>
                        <label class="text-sm text-zinc-400">Height (px)</label>
                        <input v-model="newDocHeight" type="number" class="w-full bg-zinc-800 rounded px-3 py-2 mt-1" />
                    </div>
                </div>
                <div class="flex gap-2 mt-6">
                    <button @click="createNewDocument"
                        class="flex-1 bg-violet-600 hover:bg-violet-700 rounded px-4 py-2">Create</button>
                    <button @click="showNewDocDialog = false"
                        class="flex-1 bg-zinc-800 hover:bg-zinc-700 rounded px-4 py-2">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import {
    Move, Brush, Eraser, Type, Pipette, PaintBucket,
    Square, Circle, Pen, Wand2, Crop, Hand, Pencil,
    ZoomIn, ZoomOut, Eye, EyeOff, Plus, Trash2,
    Copy, Undo, Redo, ArrowUpDown, Layers, Minus,
    Stamp
} from 'lucide-vue-next'

// Canvas refs
const mainCanvas = ref(null)
const previewCanvas = ref(null)
const canvasContainer = ref(null)
const fileInput = ref(null)
const textInput = ref(null)

// Canvas dimensions
const canvasWidth = ref(800)
const canvasHeight = ref(600)

// New document dialog
const showNewDocDialog = ref(false)
const newDocWidth = ref(800)
const newDocHeight = ref(600)

// Tools
const selectedTool = ref('brush')
const tools = [
    { id: 'move', name: 'Move Tool', icon: Move },
    { id: 'brush', name: 'Brush Tool', icon: Brush },
    { id: 'pencil', name: 'Pencil Tool', icon: Pencil },
    { id: 'eraser', name: 'Eraser Tool', icon: Eraser },
    { id: 'clone', name: 'Clone Stamp', icon: Stamp },
    { id: 'text', name: 'Text Tool', icon: Type },
    { id: 'eyedropper', name: 'Eyedropper Tool', icon: Pipette },
    { id: 'bucket', name: 'Paint Bucket Tool', icon: PaintBucket },
    { id: 'rectangle', name: 'Rectangle Tool', icon: Square },
    { id: 'ellipse', name: 'Ellipse Tool', icon: Circle },
    { id: 'line', name: 'Line Tool', icon: Minus },
    { id: 'wand', name: 'Magic Wand Tool', icon: Wand2 },
    { id: 'hand', name: 'Hand Tool', icon: Hand }
]

// Tool settings
const brushSize = ref(10)
const brushOpacity = ref(100)
const brushHardness = ref(50)
const strokeWidth = ref(2)
const fillShape = ref(false)
const fontSize = ref(24)
const fontFamily = ref('Arial')
const foregroundColor = ref('#000000')
const backgroundColor = ref('#FFFFFF')

// Clone stamp
const cloneSource = ref(null)
const cloneOffset = ref({ x: 0, y: 0 })

// Text tool
const showTextInput = ref(false)
const textContent = ref('')
const textPosition = ref({ x: 0, y: 0 })

// View state
const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
const mouseX = ref(0)
const mouseY = ref(0)
const status = ref('Ready')

// Drawing state
const isDrawing = ref(false)
const isPanning = ref(false)
const startPoint = ref(null)
const lastPoint = ref(null)

// Selection
const selection = ref(null)
const isSelecting = ref(false)

// Menu
const activeMenu = ref(null)

// Layers
const layers = ref([])
const currentLayerIndex = ref(0)

// History
const history = ref([])
const historyIndex = ref(-1)
const maxHistory = 50

// Initialize
onMounted(() => {
    initializeLayers()
    setupKeyboardShortcuts()
    updateComposite()
})

// Layer management
function initializeLayers() {
    const bgLayer = {
        id: 'layer-0',
        name: 'Background',
        canvas: document.createElement('canvas'),
        visible: true,
        opacity: 100,
        blendMode: 'normal'
    }
    bgLayer.canvas.width = canvasWidth.value
    bgLayer.canvas.height = canvasHeight.value
    const ctx = bgLayer.canvas.getContext('2d')
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value)

    layers.value = [bgLayer]
    saveHistory('New Document')
}

function addLayer() {
    const newLayer = {
        id: `layer-${Date.now()}`,
        name: `Layer ${layers.value.length}`,
        canvas: document.createElement('canvas'),
        visible: true,
        opacity: 100,
        blendMode: 'normal'
    }
    newLayer.canvas.width = canvasWidth.value
    newLayer.canvas.height = canvasHeight.value

    layers.value.splice(currentLayerIndex.value + 1, 0, newLayer)
    currentLayerIndex.value++
    updateComposite()
    saveHistory('Add Layer')
}

function deleteLayer() {
    if (layers.value.length > 1) {
        layers.value.splice(currentLayerIndex.value, 1)
        currentLayerIndex.value = Math.min(currentLayerIndex.value, layers.value.length - 1)
        updateComposite()
        saveHistory('Delete Layer')
    }
}

function duplicateLayer() {
    const sourceLayer = layers.value[currentLayerIndex.value]
    const newLayer = {
        id: `layer-${Date.now()}`,
        name: `${sourceLayer.name} copy`,
        canvas: document.createElement('canvas'),
        visible: true,
        opacity: sourceLayer.opacity,
        blendMode: sourceLayer.blendMode
    }
    newLayer.canvas.width = canvasWidth.value
    newLayer.canvas.height = canvasHeight.value
    const ctx = newLayer.canvas.getContext('2d')
    ctx.drawImage(sourceLayer.canvas, 0, 0)

    layers.value.splice(currentLayerIndex.value + 1, 0, newLayer)
    currentLayerIndex.value++
    updateComposite()
    saveHistory('Duplicate Layer')
}

function mergeDown() {
    if (currentLayerIndex.value > 0) {
        const topLayer = layers.value[currentLayerIndex.value]
        const bottomLayer = layers.value[currentLayerIndex.value - 1]

        const ctx = bottomLayer.canvas.getContext('2d')
        ctx.globalAlpha = topLayer.opacity / 100
        ctx.globalCompositeOperation = topLayer.blendMode
        ctx.drawImage(topLayer.canvas, 0, 0)

        layers.value.splice(currentLayerIndex.value, 1)
        currentLayerIndex.value--
        updateComposite()
        saveHistory('Merge Down')
    }
}

function selectLayer(index) {
    currentLayerIndex.value = index
}

// Composite all layers
function updateComposite() {
    if (!mainCanvas.value) return

    const ctx = mainCanvas.value.getContext('2d')
    ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

    // Draw each visible layer
    for (const layer of layers.value) {
        if (!layer.visible) continue

        ctx.save()
        ctx.globalAlpha = layer.opacity / 100
        ctx.globalCompositeOperation = layer.blendMode
        ctx.drawImage(layer.canvas, 0, 0)
        ctx.restore()
    }

    // Update thumbnails
    nextTick(() => {
        layers.value.forEach(layer => {
            const thumbnailCanvas = document.querySelector(`[ref="thumbnail-${layer.id}"]`)
            if (thumbnailCanvas) {
                const thumbCtx = thumbnailCanvas.getContext('2d')
                thumbCtx.clearRect(0, 0, 40, 40)
                thumbCtx.drawImage(layer.canvas, 0, 0, 40, 40)
            }
        })
    })
}

// Tool selection
function selectTool(toolId) {
    selectedTool.value = toolId
    showTextInput.value = false
    selection.value = null
}

// Get current layer context
function getCurrentContext() {
    const layer = layers.value[currentLayerIndex.value]
    return layer ? layer.canvas.getContext('2d') : null
}

// Mouse event handlers
function handleCanvasMouseDown(e) {
    if (e.target !== mainCanvas.value) return

    const rect = mainCanvas.value.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom.value
    const y = (e.clientY - rect.top) / zoom.value

    mouseX.value = Math.round(x)
    mouseY.value = Math.round(y)

    if (selectedTool.value === 'hand' || (e.spaceKey)) {
        isPanning.value = true
        startPoint.value = { x: e.clientX - panX.value, y: e.clientY - panY.value }
        return
    }

    startPoint.value = { x, y }
    lastPoint.value = { x, y }

    switch (selectedTool.value) {
        case 'brush':
        case 'pencil':
        case 'eraser':
            startDrawing(x, y)
            break
        case 'clone':
            if (e.altKey) {
                cloneSource.value = { x, y }
                status.value = 'Clone source set'
            } else if (cloneSource.value) {
                startCloning(x, y)
            }
            break
        case 'eyedropper':
            pickColor(x, y)
            break
        case 'bucket':
            fillArea(x, y)
            break
        case 'rectangle':
        case 'ellipse':
        case 'line':
            isDrawing.value = true
            break
        case 'text':
            showTextInput.value = true
            textPosition.value = { x, y }
            nextTick(() => textInput.value?.focus())
            break
        case 'wand':
            selectSimilarPixels(x, y)
            break
        case 'move':
            startMoving(x, y)
            break
    }
}

function handleCanvasMouseMove(e) {
    if (e.target !== mainCanvas.value && !isDrawing.value && !isPanning.value) return

    const rect = mainCanvas.value.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom.value
    const y = (e.clientY - rect.top) / zoom.value

    mouseX.value = Math.round(x)
    mouseY.value = Math.round(y)

    if (isPanning.value) {
        panX.value = e.clientX - startPoint.value.x
        panY.value = e.clientY - startPoint.value.y
        return
    }

    if (!isDrawing.value) return

    switch (selectedTool.value) {
        case 'brush':
        case 'pencil':
        case 'eraser':
            drawLine(lastPoint.value.x, lastPoint.value.y, x, y)
            lastPoint.value = { x, y }
            break
        case 'clone':
            if (cloneSource.value) {
                cloneStamp(x, y)
                lastPoint.value = { x, y }
            }
            break
        case 'rectangle':
        case 'ellipse':
        case 'line':
            drawShapePreview(x, y)
            break
    }
}

function handleCanvasMouseUp(e) {
    if (isPanning.value) {
        isPanning.value = false
        return
    }

    if (!isDrawing.value) return

    const rect = mainCanvas.value.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom.value
    const y = (e.clientY - rect.top) / zoom.value

    switch (selectedTool.value) {
        case 'rectangle':
        case 'ellipse':
        case 'line':
            drawShape(x, y)
            clearPreview()
            break
        case 'brush':
        case 'pencil':
        case 'eraser':
        case 'clone':
            updateComposite()
            saveHistory(`${getToolName(selectedTool.value)} Stroke`)
            break
    }

    isDrawing.value = false
}

// Drawing functions
function startDrawing(x, y) {
    isDrawing.value = true
    const ctx = getCurrentContext()
    if (!ctx) return

    ctx.save()
    if (selectedTool.value === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'
    } else {
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = foregroundColor.value
        ctx.globalAlpha = brushOpacity.value / 100
    }

    if (selectedTool.value === 'pencil') {
        ctx.globalAlpha = 1
    }

    ctx.lineWidth = brushSize.value
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
}

function drawLine(x1, y1, x2, y2) {
    const ctx = getCurrentContext()
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    updateComposite()
}

function startCloning(x, y) {
    isDrawing.value = true
    cloneOffset.value = {
        x: x - cloneSource.value.x,
        y: y - cloneSource.value.y
    }
}

function cloneStamp(x, y) {
    const ctx = getCurrentContext()
    if (!ctx || !cloneSource.value) return

    const sourceX = x - cloneOffset.value.x
    const sourceY = y - cloneOffset.value.y

    ctx.save()
    ctx.globalAlpha = brushOpacity.value / 100
    ctx.beginPath()
    ctx.arc(x, y, brushSize.value / 2, 0, Math.PI * 2)
    ctx.clip()

    ctx.drawImage(
        mainCanvas.value,
        sourceX - brushSize.value / 2,
        sourceY - brushSize.value / 2,
        brushSize.value,
        brushSize.value,
        x - brushSize.value / 2,
        y - brushSize.value / 2,
        brushSize.value,
        brushSize.value
    )
    ctx.restore()

    updateComposite()
}

function drawShapePreview(x, y) {
    const ctx = previewCanvas.value.getContext('2d')
    ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

    ctx.strokeStyle = foregroundColor.value
    ctx.fillStyle = foregroundColor.value
    ctx.lineWidth = strokeWidth.value
    ctx.globalAlpha = brushOpacity.value / 100

    switch (selectedTool.value) {
        case 'rectangle':
            if (fillShape.value) {
                ctx.fillRect(startPoint.value.x, startPoint.value.y, x - startPoint.value.x, y - startPoint.value.y)
            } else {
                ctx.strokeRect(startPoint.value.x, startPoint.value.y, x - startPoint.value.x, y - startPoint.value.y)
            }
            break
        case 'ellipse':
            ctx.beginPath()
            const radiusX = Math.abs(x - startPoint.value.x) / 2
            const radiusY = Math.abs(y - startPoint.value.y) / 2
            const centerX = startPoint.value.x + (x - startPoint.value.x) / 2
            const centerY = startPoint.value.y + (y - startPoint.value.y) / 2
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2)
            if (fillShape.value) {
                ctx.fill()
            } else {
                ctx.stroke()
            }
            break
        case 'line':
            ctx.beginPath()
            ctx.moveTo(startPoint.value.x, startPoint.value.y)
            ctx.lineTo(x, y)
            ctx.stroke()
            break
    }
}

function drawShape(x, y) {
    const ctx = getCurrentContext()
    if (!ctx) return

    ctx.strokeStyle = foregroundColor.value
    ctx.fillStyle = foregroundColor.value
    ctx.lineWidth = strokeWidth.value
    ctx.globalAlpha = brushOpacity.value / 100

    switch (selectedTool.value) {
        case 'rectangle':
            if (fillShape.value) {
                ctx.fillRect(startPoint.value.x, startPoint.value.y, x - startPoint.value.x, y - startPoint.value.y)
            } else {
                ctx.strokeRect(startPoint.value.x, startPoint.value.y, x - startPoint.value.x, y - startPoint.value.y)
            }
            break
        case 'ellipse':
            ctx.beginPath()
            const radiusX = Math.abs(x - startPoint.value.x) / 2
            const radiusY = Math.abs(y - startPoint.value.y) / 2
            const centerX = startPoint.value.x + (x - startPoint.value.x) / 2
            const centerY = startPoint.value.y + (y - startPoint.value.y) / 2
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2)
            if (fillShape.value) {
                ctx.fill()
            } else {
                ctx.stroke()
            }
            break
        case 'line':
            ctx.beginPath()
            ctx.moveTo(startPoint.value.x, startPoint.value.y)
            ctx.lineTo(x, y)
            ctx.stroke()
            break
    }

    updateComposite()
    saveHistory(`Draw ${selectedTool.value}`)
}

function clearPreview() {
    const ctx = previewCanvas.value.getContext('2d')
    ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
}

function pickColor(x, y) {
    const ctx = mainCanvas.value.getContext('2d')
    const pixel = ctx.getImageData(x, y, 1, 1).data
    const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('')
    foregroundColor.value = hex
    status.value = `Picked color: ${hex}`
}

function fillArea(x, y) {
    const ctx = getCurrentContext()
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvasWidth.value, canvasHeight.value)
    const targetColor = getPixelColor(imageData, x, y)
    const fillColor = hexToRgb(foregroundColor.value)

    if (colorsMatch(targetColor, fillColor)) return

    const pixels = []
    pixels.push([x, y])

    while (pixels.length > 0) {
        const [px, py] = pixels.pop()

        if (px < 0 || px >= canvasWidth.value || py < 0 || py >= canvasHeight.value) continue

        const currentColor = getPixelColor(imageData, px, py)
        if (!colorsMatch(currentColor, targetColor)) continue

        setPixelColor(imageData, px, py, fillColor)

        pixels.push([px + 1, py])
        pixels.push([px - 1, py])
        pixels.push([px, py + 1])
        pixels.push([px, py - 1])
    }

    ctx.putImageData(imageData, 0, 0)
    updateComposite()
    saveHistory('Fill')
}

function getPixelColor(imageData, x, y) {
    const index = (Math.floor(y) * imageData.width + Math.floor(x)) * 4
    return {
        r: imageData.data[index],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2],
        a: imageData.data[index + 3]
    }
}

function setPixelColor(imageData, x, y, color) {
    const index = (Math.floor(y) * imageData.width + Math.floor(x)) * 4
    imageData.data[index] = color.r
    imageData.data[index + 1] = color.g
    imageData.data[index + 2] = color.b
    imageData.data[index + 3] = 255
}

function colorsMatch(c1, c2, tolerance = 0) {
    return Math.abs(c1.r - c2.r) <= tolerance &&
        Math.abs(c1.g - c2.g) <= tolerance &&
        Math.abs(c1.b - c2.b) <= tolerance &&
        Math.abs(c1.a - c2.a) <= tolerance
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

// Text functions
function applyText() {
    if (!textContent.value) return

    const ctx = getCurrentContext()
    if (!ctx) return

    ctx.font = `${fontSize.value}px ${fontFamily.value}`
    ctx.fillStyle = foregroundColor.value
    ctx.globalAlpha = brushOpacity.value / 100
    ctx.fillText(textContent.value, textPosition.value.x, textPosition.value.y + fontSize.value)

    updateComposite()
    saveHistory('Add Text')

    showTextInput.value = false
    textContent.value = ''
}

function cancelText() {
    showTextInput.value = false
    textContent.value = ''
}

// Selection functions
function selectSimilarPixels(x, y) {
    // Magic wand implementation
    status.value = 'Magic Wand selection'
    // This would need a more complex implementation for actual magic wand
}

function startMoving(x, y) {
    // Move tool implementation
    status.value = 'Move tool active'
}

// History management
function saveHistory(action) {
    // Remove any history after current index
    if (historyIndex.value < history.value.length - 1) {
        history.value = history.value.slice(0, historyIndex.value + 1)
    }

    // Save current state
    const state = {
        action,
        layers: layers.value.map(layer => {
            const canvas = document.createElement('canvas')
            canvas.width = canvasWidth.value
            canvas.height = canvasHeight.value
            const ctx = canvas.getContext('2d')
            ctx.drawImage(layer.canvas, 0, 0)
            return {
                ...layer,
                imageData: ctx.getImageData(0, 0, canvasWidth.value, canvasHeight.value)
            }
        }),
        currentLayerIndex: currentLayerIndex.value
    }

    history.value.push(state)

    // Limit history
    if (history.value.length > maxHistory) {
        history.value.shift()
    } else {
        historyIndex.value++
    }
}

function undo() {
    if (historyIndex.value > 0) {
        historyIndex.value--
        restoreState(history.value[historyIndex.value])
    }
}

function redo() {
    if (historyIndex.value < history.value.length - 1) {
        historyIndex.value++
        restoreState(history.value[historyIndex.value])
    }
}

function goToHistory(index) {
    historyIndex.value = index
    restoreState(history.value[index])
}

function restoreState(state) {
    layers.value = state.layers.map(layerData => {
        const layer = {
            ...layerData,
            canvas: document.createElement('canvas')
        }
        layer.canvas.width = canvasWidth.value
        layer.canvas.height = canvasHeight.value
        const ctx = layer.canvas.getContext('2d')
        ctx.putImageData(layerData.imageData, 0, 0)
        return layer
    })
    currentLayerIndex.value = state.currentLayerIndex
    updateComposite()
}

// File operations
function newDocument() {
    showNewDocDialog.value = true
}

function createNewDocument() {
    canvasWidth.value = parseInt(newDocWidth.value)
    canvasHeight.value = parseInt(newDocHeight.value)

    layers.value = []
    history.value = []
    historyIndex.value = -1

    nextTick(() => {
        initializeLayers()
        showNewDocDialog.value = false
    })
}

function openFile() {
    fileInput.value.click()
}

function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
            canvasWidth.value = img.width
            canvasHeight.value = img.height

            nextTick(() => {
                const newLayer = {
                    id: `layer-${Date.now()}`,
                    name: file.name,
                    canvas: document.createElement('canvas'),
                    visible: true,
                    opacity: 100,
                    blendMode: 'normal'
                }
                newLayer.canvas.width = img.width
                newLayer.canvas.height = img.height
                const ctx = newLayer.canvas.getContext('2d')
                ctx.drawImage(img, 0, 0)

                layers.value.push(newLayer)
                currentLayerIndex.value = layers.value.length - 1
                updateComposite()
                saveHistory('Open Image')
            })
        }
        img.src = event.target.result
    }
    reader.readAsDataURL(file)
}

function saveFile() {
    const link = document.createElement('a')
    link.download = 'mxn-editor.png'
    link.href = mainCanvas.value.toDataURL()
    link.click()
}

function exportPNG() {
    saveFile()
}

function exportJPG() {
    const link = document.createElement('a')
    link.download = 'mxn-editor.jpg'
    link.href = mainCanvas.value.toDataURL('image/jpeg', 0.9)
    link.click()
}

// Edit operations
function clearCanvas() {
    const ctx = getCurrentContext()
    if (!ctx) return

    ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
    updateComposite()
    saveHistory('Clear')
}

function fillCanvas() {
    const ctx = getCurrentContext()
    if (!ctx) return

    ctx.fillStyle = backgroundColor.value
    ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value)
    updateComposite()
    saveHistory('Fill Canvas')
}

// Image operations
function resizeImage() {
    const newWidth = prompt('New width (px):', canvasWidth.value)
    const newHeight = prompt('New height (px):', canvasHeight.value)

    if (!newWidth || !newHeight) return

    // Implementation would resize all layers
    status.value = 'Resize not fully implemented'
}

function resizeCanvas() {
    const newWidth = prompt('New canvas width (px):', canvasWidth.value)
    const newHeight = prompt('New canvas height (px):', canvasHeight.value)

    if (!newWidth || !newHeight) return

    canvasWidth.value = parseInt(newWidth)
    canvasHeight.value = parseInt(newHeight)

    // Resize all layer canvases
    layers.value.forEach(layer => {
        const oldCanvas = layer.canvas
        layer.canvas = document.createElement('canvas')
        layer.canvas.width = canvasWidth.value
        layer.canvas.height = canvasHeight.value
        const ctx = layer.canvas.getContext('2d')
        ctx.drawImage(oldCanvas, 0, 0)
    })

    updateComposite()
    saveHistory('Resize Canvas')
}

function rotateImage(degrees) {
    const ctx = getCurrentContext()
    if (!ctx) return

    const canvas = ctx.canvas
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvas.height
    tempCanvas.height = canvas.width
    const tempCtx = tempCanvas.getContext('2d')

    tempCtx.save()
    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2)
    tempCtx.rotate(degrees * Math.PI / 180)
    tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2)
    tempCtx.restore()

    canvas.width = tempCanvas.width
    canvas.height = tempCanvas.height
    ctx.drawImage(tempCanvas, 0, 0)

    updateComposite()
    saveHistory(`Rotate ${degrees}°`)
}

function flipHorizontal() {
    const ctx = getCurrentContext()
    if (!ctx) return

    const canvas = ctx.canvas
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height
    const tempCtx = tempCanvas.getContext('2d')

    tempCtx.save()
    tempCtx.scale(-1, 1)
    tempCtx.drawImage(canvas, -canvas.width, 0)
    tempCtx.restore()

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(tempCanvas, 0, 0)

    updateComposite()
    saveHistory('Flip Horizontal')
}

function flipVertical() {
    const ctx = getCurrentContext()
    if (!ctx) return

    const canvas = ctx.canvas
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height
    const tempCtx = tempCanvas.getContext('2d')

    tempCtx.save()
    tempCtx.scale(1, -1)
    tempCtx.drawImage(canvas, 0, -canvas.height)
    tempCtx.restore()

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(tempCanvas, 0, 0)

    updateComposite()
    saveHistory('Flip Vertical')
}

// Filters
function applyFilter(filterType) {
    const ctx = getCurrentContext()
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvasWidth.value, canvasHeight.value)
    const data = imageData.data

    switch (filterType) {
        case 'grayscale':
            for (let i = 0; i < data.length; i += 4) {
                const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
                data[i] = data[i + 1] = data[i + 2] = gray
            }
            break
        case 'sepia':
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2]
                data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189))
                data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168))
                data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131))
            }
            break
        case 'invert':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i]
                data[i + 1] = 255 - data[i + 1]
                data[i + 2] = 255 - data[i + 2]
            }
            break
        case 'blur':
            // Simple box blur
            const tempData = new Uint8ClampedArray(data)
            const width = imageData.width
            const height = imageData.height
            for (let y = 1; y < height - 1; y++) {
                for (let x = 1; x < width - 1; x++) {
                    for (let c = 0; c < 3; c++) {
                        let sum = 0
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const idx = ((y + dy) * width + (x + dx)) * 4 + c
                                sum += tempData[idx]
                            }
                        }
                        data[(y * width + x) * 4 + c] = sum / 9
                    }
                }
            }
            break
        case 'sharpen':
            const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0]
            applyConvolution(imageData, kernel)
            break
    }

    ctx.putImageData(imageData, 0, 0)
    updateComposite()
    saveHistory(`Apply ${filterType} filter`)
}

function applyConvolution(imageData, kernel) {
    const data = imageData.data
    const tempData = new Uint8ClampedArray(data)
    const width = imageData.width
    const height = imageData.height

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 3; c++) {
                let sum = 0
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * width + (x + kx)) * 4 + c
                        const kernelIdx = (ky + 1) * 3 + (kx + 1)
                        sum += tempData[idx] * kernel[kernelIdx]
                    }
                }
                data[(y * width + x) * 4 + c] = Math.min(255, Math.max(0, sum))
            }
        }
    }
}

function adjustBrightness() {
    const brightness = prompt('Brightness (-100 to 100):', '0')
    if (!brightness) return

    const ctx = getCurrentContext()
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvasWidth.value, canvasHeight.value)
    const data = imageData.data
    const adjustment = parseInt(brightness) * 2.55

    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] + adjustment))
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + adjustment))
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + adjustment))
    }

    ctx.putImageData(imageData, 0, 0)
    updateComposite()
    saveHistory('Adjust Brightness')
}

function adjustHueSaturation() {
    status.value = 'Hue/Saturation adjustment not implemented'
}

// Utility functions
function swapColors() {
    const temp = foregroundColor.value
    foregroundColor.value = backgroundColor.value
    backgroundColor.value = temp
}

function toggleMenu(menu) {
    activeMenu.value = activeMenu.value === menu ? null : menu
}

function getCursor() {
    switch (selectedTool.value) {
        case 'hand': return 'grab'
        case 'eyedropper': return 'crosshair'
        case 'text': return 'text'
        case 'move': return 'move'
        default: return 'crosshair'
    }
}

function getToolName(toolId) {
    const tool = tools.find(t => t.id === toolId)
    return tool ? tool.name : 'Unknown Tool'
}

function handleWheel(e) {
    if (e.ctrlKey || e.metaKey) {
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        zoom.value = Math.max(0.1, Math.min(5, zoom.value + delta))
    } else if (!isDrawing.value) {
        panX.value -= e.deltaX
        panY.value -= e.deltaY
    }
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Close menus
        if (e.key === 'Escape') {
            activeMenu.value = null
            showTextInput.value = false
            showNewDocDialog.value = false
        }

        // Tool shortcuts
        if (!e.ctrlKey && !e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'v': selectTool('move'); break
                case 'b': selectTool('brush'); break
                case 'e': selectTool('eraser'); break
                case 't': selectTool('text'); break
                case 'i': selectTool('eyedropper'); break
                case 'g': selectTool('bucket'); break
                case 'u': selectTool('rectangle'); break
                case 'h': selectTool('hand'); break
                case 's': selectTool('clone'); break
                case 'p': selectTool('pencil'); break
            }
        }

        // Commands with Ctrl/Cmd
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'z':
                    e.preventDefault()
                    if (e.shiftKey) redo()
                    else undo()
                    break
                case 'y':
                    e.preventDefault()
                    redo()
                    break
                case 'n':
                    e.preventDefault()
                    newDocument()
                    break
                case 'o':
                    e.preventDefault()
                    openFile()
                    break
                case 's':
                    e.preventDefault()
                    saveFile()
                    break
            }
        }

        // Space for hand tool
        if (e.code === 'Space' && !showTextInput.value) {
            e.preventDefault()
            e.spaceKey = true
        }
    })

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
            e.spaceKey = false
        }
    })

    // Prevent context menu on canvas
    mainCanvas.value?.addEventListener('contextmenu', e => e.preventDefault())
}

// Click outside to close menus
onMounted(() => {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.relative')) {
            activeMenu.value = null
        }
    })
})
</script>

<style scoped>
/* Slider styles */
.slider {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
}

.slider::-webkit-slider-track {
    background: #27272a;
    border-radius: 4px;
    height: 8px;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background: linear-gradient(135deg, #8b5cf6, #d946ef);
    border-radius: 50%;
    height: 20px;
    width: 20px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.slider::-moz-range-track {
    background: #27272a;
    border-radius: 4px;
    height: 8px;
}

.slider::-moz-range-thumb {
    background: linear-gradient(135deg, #8b5cf6, #d946ef);
    border: none;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.slider-small::-webkit-slider-track {
    height: 4px;
}

.slider-small::-webkit-slider-thumb {
    height: 12px;
    width: 12px;
}

.slider-small::-moz-range-track {
    height: 4px;
}

.slider-small::-moz-range-thumb {
    height: 12px;
    width: 12px;
}

/* Scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #18181b;
}

::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #52525b;
}

/* Number input */
input[type="number"] {
    -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Canvas shadow */
canvas {
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}
</style>