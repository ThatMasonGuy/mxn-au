<!-- @/components/personal/kanban/Board.vue -->
<template>
    <div class="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">
        <!-- Header -->
        <div class="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50 flex-shrink-0">
            <div class="px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <!-- Back Button -->
                        <router-link :to="{ name: 'PersonalKanban' }"
                            class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                            <ArrowLeft class="w-5 h-5" />
                        </router-link>

                        <!-- Board Title -->
                        <div class="flex items-center space-x-3">
                            <!-- Board Icon with Color -->
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
                                :style="{ backgroundColor: currentBoardColor }">
                                <component :is="currentBoardIcon" class="w-6 h-6 text-white" />
                            </div>

                            <input v-if="editingBoardTitle" v-model="boardTitleInput" @blur="saveBoardTitle"
                                @keyup.enter="saveBoardTitle" @keyup.escape="cancelBoardTitleEdit"
                                ref="boardTitleInputRef"
                                class="text-2xl font-bold bg-transparent border-2 border-indigo-400 rounded px-3 py-1 text-white focus:outline-none" />
                            <h1 v-else @click="startBoardTitleEdit"
                                class="text-2xl font-bold text-white cursor-pointer hover:opacity-80 transition-opacity"
                                :title="'Click to edit'">
                                {{ kanbanStore.currentBoard?.name || 'Loading...' }}
                            </h1>
                        </div>

                        <div v-if="kanbanStore.currentBoard?.description"
                            class="text-sm text-slate-400 max-w-md hidden lg:block">
                            {{ kanbanStore.currentBoard.description }}
                        </div>
                    </div>

                    <div class="flex items-center space-x-3">
                        <!-- Board Settings -->
                        <button @click="showBoardSettings = !showBoardSettings"
                            class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                            <Settings class="w-5 h-5" />
                        </button>

                        <!-- Add Column Button -->
                        <button @click="showAddColumn = true"
                            class="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                            <Plus class="w-5 h-5" />
                            <span class="hidden sm:inline">Add Column</span>
                        </button>
                    </div>
                </div>

                <!-- Board Settings Dropdown -->
                <div v-if="showBoardSettings"
                    class="absolute right-6 top-16 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 min-w-[200px] z-50">
                    <button @click="editBoardDetails"
                        class="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center space-x-2">
                        <Edit class="w-4 h-4" />
                        <span>Edit Board Details</span>
                    </button>
                    <button @click="confirmDeleteBoard"
                        class="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors flex items-center space-x-2">
                        <Trash2 class="w-4 h-4" />
                        <span>Delete Board</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex-1 flex items-center justify-center">
            <div class="flex flex-col items-center space-y-4">
                <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <span class="text-slate-400">Loading board...</span>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex-1 flex items-center justify-center">
            <div class="text-center max-w-md">
                <div class="w-24 h-24 mx-auto mb-6 bg-red-900/30 rounded-2xl flex items-center justify-center">
                    <AlertCircle class="w-12 h-12 text-red-400" />
                </div>
                <h3 class="text-xl font-semibold text-white mb-2">Unable to Load Board</h3>
                <p class="text-slate-400 mb-6">{{ error }}</p>
                <router-link :to="{ name: 'PersonalKanban' }"
                    class="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                    Back to Boards
                </router-link>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!kanbanStore.currentBoard" class="flex-1 flex items-center justify-center">
            <div class="text-center max-w-md">
                <div class="w-24 h-24 mx-auto mb-6 bg-slate-900/30 rounded-2xl flex items-center justify-center">
                    <Trello class="w-12 h-12 text-slate-400" />
                </div>
                <h3 class="text-xl font-semibold text-white mb-2">Board Not Found</h3>
                <p class="text-slate-400 mb-6">This board doesn't exist or you don't have access to it.</p>
                <router-link :to="{ name: 'PersonalKanban' }"
                    class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                    View All Boards
                </router-link>
            </div>
        </div>

        <!-- Kanban Board -->
        <div v-else class="flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden relative">
            <!-- Background Pattern -->
            <div class="absolute inset-0 overflow-hidden opacity-5">
                <div class="absolute inset-0"
                    style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 24px 24px;">
                </div>
            </div>

            <div class="flex h-full overflow-x-auto pb-6 relative z-10 space-x-6" @drop="onColumnDrop"
                @dragover="onColumnDragOver" @dragenter.prevent @dragleave="onColumnDragLeave">

                <template v-for="(column, index) in kanbanStore.columns" :key="column.id">
                    <!-- Column Drop Placeholder -->
                    <div v-if="showColumnDropIndicator && columnDropIndex === index"
                        class="w-72 bg-indigo-400/10 border-2 border-dashed border-indigo-400 rounded-2xl transition-all duration-300 flex items-center justify-center flex-shrink-0">
                        <div class="text-center">
                            <div
                                class="w-8 h-8 mx-auto mb-2 bg-indigo-400/20 rounded-full flex items-center justify-center">
                                <div class="w-3 h-3 bg-indigo-400 rounded-full"></div>
                            </div>
                            <span class="text-indigo-400 text-sm font-medium">Drop column here</span>
                        </div>
                    </div>

                    <div class="transition-all duration-300"
                        :class="{ 'transform scale-95 opacity-75': draggedColumnId === column.id }">
                        <KanbanColumn :column="column" :index="index"
                            :cards="kanbanStore.cardsByColumn[column.id] || []"
                            :is-column-dragging="draggedColumnId === column.id" @add-card="handleAddCard"
                            @edit-card="handleEditCard" @delete-card="handleDeleteCard" @edit-column="handleEditColumn"
                            @delete-column="handleDeleteColumn" @card-moved="handleCardMoved"
                            @column-drag-start="handleColumnDragStart" @column-drag-end="handleColumnDragEnd"
                            @card-reorder="handleCardReorder" @update-card="handleUpdateCard" />
                    </div>
                </template>

                <!-- Final drop placeholder -->
                <div v-if="showColumnDropIndicator && columnDropIndex === kanbanStore.columns.length"
                    class="w-72 bg-indigo-400/10 border-2 border-dashed border-indigo-400 rounded-2xl transition-all duration-300 flex items-center justify-center flex-shrink-0">
                    <div class="text-center">
                        <div
                            class="w-8 h-8 mx-auto mb-2 bg-indigo-400/20 rounded-full flex items-center justify-center">
                            <div class="w-3 h-3 bg-indigo-400 rounded-full"></div>
                        </div>
                        <span class="text-indigo-400 text-sm font-medium">Drop column here</span>
                    </div>
                </div>

                <!-- Add Column Placeholder -->
                <div class="flex-shrink-0">
                    <button @click="showAddColumn = true"
                        class="w-72 h-32 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center hover:border-indigo-400 hover:bg-indigo-900/20 transition-all duration-200 group">
                        <div class="text-center">
                            <Plus
                                class="w-8 h-8 mx-auto mb-2 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                            <span class="text-sm text-slate-500 group-hover:text-indigo-400 font-medium">Add
                                Column</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <!-- Edit Board Modal -->
        <div v-if="showEditBoardModal" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex min-h-screen items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    @click="showEditBoardModal = false">
                </div>
                <div class="relative bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6">
                    <h3 class="text-lg font-semibold text-white mb-4">Edit Board Details</h3>
                    <form @submit.prevent="updateBoardDetails">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Board Name</label>
                                <input v-model="editBoardForm.name" type="text" required
                                    class="w-full px-3 py-2 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-700 text-white"
                                    placeholder="My Awesome Project">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                <textarea v-model="editBoardForm.description" rows="3"
                                    class="w-full px-3 py-2 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-700 text-white"
                                    placeholder="Brief description of your project..."></textarea>
                            </div>

                            <!-- Icon Selection -->
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Board Icon</label>
                                <div
                                    class="grid grid-cols-5 gap-2 max-h-28 overflow-y-auto p-2 bg-slate-900/50 rounded-lg border border-slate-700">
                                    <button v-for="iconName in iconNames" :key="iconName" type="button"
                                        @click="editBoardForm.icon = iconName"
                                        class="p-2 rounded-lg border-2 transition-all duration-200 flex items-center justify-center"
                                        :class="editBoardForm.icon === iconName
                                            ? 'border-indigo-500 bg-indigo-900/30'
                                            : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800'"
                                        :title="iconName">
                                        <component :is="getIcon(iconName)" class="w-4 h-4"
                                            :class="editBoardForm.icon === iconName ? 'text-indigo-400' : 'text-slate-400'" />
                                    </button>
                                </div>
                            </div>

                            <!-- Color Selection -->
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Board Color</label>
                                <div class="flex items-center space-x-2">
                                    <div class="flex flex-wrap gap-2">
                                        <button v-for="color in boardColors" :key="color" type="button"
                                            @click="editBoardForm.color = color"
                                            class="w-8 h-8 rounded border-2 transition-all duration-200" :class="editBoardForm.color === color
                                                ? 'border-white scale-110'
                                                : 'border-slate-700 hover:scale-105'"
                                            :style="{ backgroundColor: color }">
                                            <span v-if="editBoardForm.color === color"
                                                class="text-white text-xs">✓</span>
                                        </button>
                                    </div>
                                    <!-- Preview -->
                                    <div class="ml-auto px-2 py-1 rounded border border-slate-700">
                                        <div class="flex items-center space-x-1">
                                            <div class="w-6 h-6 rounded flex items-center justify-center"
                                                :style="{ backgroundColor: editBoardForm.color }">
                                                <component :is="getIcon(editBoardForm.icon)"
                                                    class="w-3 h-3 text-white" />
                                            </div>
                                            <span class="text-xs text-slate-400">Preview</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button" @click="showEditBoardModal = false"
                                class="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button type="submit"
                                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                                Update Board
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Add Column Modal -->
        <div v-if="showAddColumn" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex min-h-screen items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    @click="showAddColumn = false"></div>
                <div class="relative bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6">
                    <h3 class="text-lg font-semibold text-white mb-4">Add New Column</h3>
                    <form @submit.prevent="addColumn">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Column Name</label>
                                <input v-model="newColumn.name" type="text" required
                                    class="w-full px-3 py-2 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-700 text-white"
                                    placeholder="To Do">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Color</label>
                                <div class="flex space-x-2">
                                    <button v-for="color in columnColors" :key="color" type="button"
                                        @click="newColumn.color = color"
                                        class="w-8 h-8 rounded-full border-2 transition-all duration-200"
                                        :class="newColumn.color === color ? 'border-slate-400 scale-110' : 'border-slate-600'"
                                        :style="{ backgroundColor: color }"></button>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button" @click="showAddColumn = false"
                                class="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button type="submit"
                                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                                Add Column
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Card Modal -->
        <KanbanCardModal v-if="showCardModal" :card="selectedCard" :columns="kanbanStore.columns"
            @close="closeCardModal" @save="saveCard" @delete="deleteCard" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useKanbanStore } from '@/stores/personal/useKanbanStore'
import {
    Plus, Trello, ArrowLeft, Settings, Edit, Trash2, AlertCircle,
    Briefcase, Target, Rocket, Book, Heart, Star,
    Zap, Coffee, Music, Camera, Globe, Package,
    ShoppingCart, Users, FileText, Code, Palette,
    Award, LayoutGrid
} from 'lucide-vue-next'
import KanbanColumn from '@/components/personal/kanban/Column.vue'
import KanbanCardModal from '@/components/personal/kanban/CardModal.vue'

// Store and routing
const kanbanStore = useKanbanStore()
const route = useRoute()
const router = useRouter()

// Reactive state
const loading = ref(true)
const error = ref(null)
const showBoardSettings = ref(false)
const showEditBoardModal = ref(false)
const showAddColumn = ref(false)
const showCardModal = ref(false)
const selectedCard = ref(null)
const unsubscribe = ref(null)

// Board editing
const editingBoardTitle = ref(false)
const boardTitleInput = ref('')
const boardTitleInputRef = ref(null)
const editBoardForm = ref({ name: '', description: '', color: '#6366f1', icon: 'Trello' })

// Available icons
const availableIcons = {
    Trello, Briefcase, Target, Rocket, Book, Heart,
    Star, Zap, Coffee, Music, Camera, Globe,
    Package, ShoppingCart, Users, FileText, Code,
    Palette, Award, LayoutGrid
}

const iconNames = Object.keys(availableIcons)

// Board colors
const boardColors = [
    '#6366f1', // indigo
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#ef4444', // red
    '#f59e0b', // amber
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#84cc16', // lime
    '#f97316', // orange
]

// Computed
const currentBoardIcon = computed(() => {
    const iconName = kanbanStore.currentBoard?.icon || 'Trello'
    return availableIcons[iconName] || Trello
})

const currentBoardColor = computed(() => {
    return kanbanStore.currentBoard?.color || '#6366f1'
})

// Drag and drop state
const draggedColumnId = ref(null)
const draggedColumnIndex = ref(null)
const columnDropIndex = ref(-1)
const showColumnDropIndicator = ref(false)

// Form data
const newColumn = ref({ name: '', color: '#ef4444' })

// Column colors
const columnColors = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
]

// Board title editing methods
async function startBoardTitleEdit() {
    if (!kanbanStore.currentBoard) return
    editingBoardTitle.value = true
    boardTitleInput.value = kanbanStore.currentBoard.name
    await nextTick()
    boardTitleInputRef.value?.focus()
    boardTitleInputRef.value?.select()
}

async function saveBoardTitle() {
    if (!kanbanStore.currentBoard || !boardTitleInput.value.trim()) {
        cancelBoardTitleEdit()
        return
    }
    await kanbanStore.updateBoard(kanbanStore.currentBoard.id, {
        name: boardTitleInput.value.trim()
    })
    editingBoardTitle.value = false
}

function cancelBoardTitleEdit() {
    editingBoardTitle.value = false
    boardTitleInput.value = ''
}

// Board management
function editBoardDetails() {
    showBoardSettings.value = false
    editBoardForm.value = {
        name: kanbanStore.currentBoard?.name || '',
        description: kanbanStore.currentBoard?.description || '',
        color: kanbanStore.currentBoard?.color || '#6366f1',
        icon: kanbanStore.currentBoard?.icon || 'Trello'
    }
    showEditBoardModal.value = true
}

async function updateBoardDetails() {
    if (!editBoardForm.value.name.trim()) return
    await kanbanStore.updateBoard(kanbanStore.currentBoard.id, {
        name: editBoardForm.value.name.trim(),
        description: editBoardForm.value.description.trim(),
        color: editBoardForm.value.color,
        icon: editBoardForm.value.icon
    })
    showEditBoardModal.value = false
}

// Helper methods
function getIcon(iconName) {
    return availableIcons[iconName] || Trello
}

function confirmDeleteBoard() {
    showBoardSettings.value = false
    if (confirm(`Are you sure you want to delete "${kanbanStore.currentBoard?.name}"? This action cannot be undone.`)) {
        deleteBoard()
    }
}

async function deleteBoard() {
    const boardId = kanbanStore.currentBoard?.id
    if (!boardId) return

    await kanbanStore.deleteBoard(boardId)
    router.push({ name: 'PersonalKanban' })
}

// Column management
async function addColumn() {
    if (!newColumn.value.name.trim() || !kanbanStore.currentBoard) return

    const order = kanbanStore.columns.length
    await kanbanStore.createColumn(kanbanStore.currentBoard.id, {
        ...newColumn.value,
        order
    })

    newColumn.value = { name: '', color: '#ef4444' }
    showAddColumn.value = false
}

function handleEditColumn(column) {
    if (!kanbanStore.currentBoard) return
    kanbanStore.updateColumn(kanbanStore.currentBoard.id, column.id, {
        name: column.name,
        color: column.color
    })
}

async function handleDeleteColumn(columnId) {
    if (!kanbanStore.currentBoard) return
    if (confirm('Are you sure? This will delete all cards in this column.')) {
        await kanbanStore.deleteColumn(kanbanStore.currentBoard.id, columnId)
    }
}

// Card management
function handleAddCard(columnId) {
    const columnCards = kanbanStore.cardsByColumn[columnId] || []
    selectedCard.value = {
        columnId,
        title: '',
        description: '',
        labels: [],
        priority: 'medium',
        checklist: [],
        order: columnCards.length
    }
    showCardModal.value = true
}

function handleEditCard(card) {
    selectedCard.value = { ...card }
    showCardModal.value = true
}

async function handleUpdateCard(cardData) {
    if (!kanbanStore.currentBoard) return
    await kanbanStore.updateCard(kanbanStore.currentBoard.id, cardData.id, cardData)
}

async function handleDeleteCard(cardId) {
    if (!kanbanStore.currentBoard) return
    if (confirm('Are you sure you want to delete this card?')) {
        await kanbanStore.deleteCard(kanbanStore.currentBoard.id, cardId)
    }
}

function handleCardMoved(cardId, newColumnId, newOrder) {
    if (!kanbanStore.currentBoard) return
    kanbanStore.moveCard(kanbanStore.currentBoard.id, cardId, newColumnId, newOrder)
}

function handleCardReorder(columnId, newOrder) {
    if (!kanbanStore.currentBoard) return
    kanbanStore.reorderCards(kanbanStore.currentBoard.id, columnId, newOrder)
}

function closeCardModal() {
    showCardModal.value = false
    selectedCard.value = null
}

async function saveCard(cardData) {
    if (!kanbanStore.currentBoard) return

    if (cardData.id) {
        await kanbanStore.updateCard(kanbanStore.currentBoard.id, cardData.id, cardData)
    } else {
        await kanbanStore.createCard(kanbanStore.currentBoard.id, cardData)
    }
    closeCardModal()
}

async function deleteCard(cardId) {
    if (!kanbanStore.currentBoard) return
    await kanbanStore.deleteCard(kanbanStore.currentBoard.id, cardId)
    closeCardModal()
}

// Column drag and drop handlers
function handleColumnDragStart(columnId, index) {
    draggedColumnId.value = columnId
    draggedColumnIndex.value = index
}

function handleColumnDragEnd() {
    draggedColumnId.value = null
    draggedColumnIndex.value = null
    showColumnDropIndicator.value = false
    columnDropIndex.value = -1
}

function onColumnDragOver(e) {
    e.preventDefault()
    if (!draggedColumnId.value) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const columnWidth = 288 + 24 // w-72 (288px) + margin
    let dropIndex = Math.floor(x / columnWidth)

    dropIndex = Math.max(0, Math.min(dropIndex, kanbanStore.columns.length))
    columnDropIndex.value = dropIndex
    showColumnDropIndicator.value = true
}

function onColumnDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
        showColumnDropIndicator.value = false
        columnDropIndex.value = -1
    }
}

function onColumnDrop(e) {
    e.preventDefault()
    if (!draggedColumnId.value || !kanbanStore.currentBoard) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const columnWidth = 288 + 24
    let dropIndex = Math.floor(x / columnWidth)
    dropIndex = Math.max(0, Math.min(dropIndex, kanbanStore.columns.length))

    if (dropIndex === draggedColumnIndex.value || dropIndex === draggedColumnIndex.value + 1) {
        handleColumnDragEnd()
        return
    }

    const adjustedDropIndex = dropIndex > draggedColumnIndex.value ? dropIndex - 1 : dropIndex
    const newOrder = [...kanbanStore.columns]
    const [movedColumn] = newOrder.splice(draggedColumnIndex.value, 1)
    newOrder.splice(adjustedDropIndex, 0, movedColumn)

    const newOrderIds = newOrder.map(col => col.id)
    kanbanStore.reorderColumns(kanbanStore.currentBoard.id, newOrderIds)

    handleColumnDragEnd()
}

// Click outside to close settings
function handleClickOutside(e) {
    if (showBoardSettings.value && !e.target.closest('.board-settings')) {
        showBoardSettings.value = false
    }
}

// Load board
async function loadBoard(boardId) {
    try {
        loading.value = true
        error.value = null

        // Ensure boards are loaded
        if (kanbanStore.boards.length === 0) {
            await kanbanStore.fetchBoards()
        }

        // Find and set the current board
        const board = kanbanStore.boards.find(b => b.id === boardId)
        if (!board) {
            error.value = 'Board not found'
            return
        }

        kanbanStore.currentBoard = board

        // Subscribe to real-time updates
        if (unsubscribe.value) {
            unsubscribe.value()
        }
        unsubscribe.value = kanbanStore.subscribeToBoard(boardId)
    } catch (err) {
        error.value = err.message || 'Failed to load board'
        console.error('Error loading board:', err)
    } finally {
        loading.value = false
    }
}

// Lifecycle
onMounted(async () => {
    document.addEventListener('click', handleClickOutside)

    const boardId = route.params.boardId
    if (boardId) {
        await loadBoard(boardId)
    } else {
        error.value = 'No board ID provided'
    }
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    if (unsubscribe.value) {
        unsubscribe.value()
    }
})

// Watch for route changes
watch(() => route.params.boardId, async (newBoardId) => {
    if (newBoardId && newBoardId !== kanbanStore.currentBoard?.id) {
        await loadBoard(newBoardId)
    }
})

// Watch for errors
watch(() => kanbanStore.error, (newError) => {
    if (newError) {
        error.value = newError
    }
})
</script>