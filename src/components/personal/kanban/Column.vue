<!-- @/components/personal/kanban/Column.vue -->
<template>
    <div class="flex-shrink-0 w-72 h-full">
        <div class="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg h-full flex flex-col transition-all duration-200"
            :class="{
                'opacity-50': isColumnDragging,
                'ring-2 ring-indigo-400': isDropTarget,
                'transform scale-105': isColumnDragging
            }" :style="{ borderTopColor: column.color }">
            <!-- Column Header -->
            <div class="p-4 border-b border-slate-700/50 flex-shrink-0">
                <div class="flex items-center justify-between group">
                    <div class="flex items-center space-x-3 flex-1">
                        <!-- Drag Handle -->
                        <div draggable="true" @dragstart="onColumnDragStart" @dragend="onColumnDragEnd"
                            class="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-300 rounded transition-colors"
                            title="Drag to reorder column">
                            <GripVertical class="w-4 h-4" />
                        </div>

                        <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: column.color }"></div>

                        <!-- Inline Editable Column Title -->
                        <div class="flex-1">
                            <input v-if="editingColumnTitle" v-model="columnTitleInput" @blur="saveColumnTitle"
                                @keyup.enter="saveColumnTitle" @keyup.escape="cancelColumnTitleEdit"
                                ref="columnTitleInputRef"
                                class="font-semibold text-sm bg-transparent border border-indigo-400 rounded px-2 py-1 text-white focus:outline-none w-full" />
                            <h3 v-else @click="startColumnTitleEdit"
                                class="font-semibold text-white text-sm cursor-pointer hover:bg-slate-700/50 rounded px-2 py-1 transition-colors"
                                :title="'Click to edit'">
                                {{ column.name }}
                            </h3>
                        </div>
                    </div>

                    <div class="flex items-center space-x-2">
                        <!-- Column Actions -->
                        <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button @click="$emit('add-card', column.id)"
                                class="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-900/20 rounded-lg transition-all duration-200"
                                title="Add Card">
                                <Plus class="w-4 h-4" />
                            </button>
                            <button @click="showColumnMenu = !showColumnMenu"
                                class="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-all duration-200"
                                title="Column Options">
                                <MoreVertical class="w-4 h-4" />
                            </button>
                        </div>

                        <!-- Card Counter -->
                        <span class="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full font-medium">
                            {{ cards.length }}
                        </span>
                    </div>
                </div>

                <!-- Column Menu -->
                <div v-if="showColumnMenu"
                    class="absolute z-10 mt-2 right-4 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 min-w-[120px]">
                    <button @click="editColumn"
                        class="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700">
                        Edit Column
                    </button>
                    <button @click="deleteColumn"
                        class="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-900/20">
                        Delete Column
                    </button>
                </div>
            </div>

            <!-- Cards Container -->
            <div class="flex-1 p-3 space-y-3 overflow-y-auto" @drop="onCardDrop" @dragover="onCardDragOver"
                @dragenter="onCardDragEnter" @dragleave="onCardDragLeave" :class="{
                    'bg-indigo-900/10': isDragOver,
                    'ring-2 ring-indigo-400 ring-inset': isDragOver
                }" ref="cardsContainer">
                <!-- Drop indicator at top -->
                <div v-if="showDropIndicator && dropPosition === 0"
                    class="h-20 bg-indigo-400/20 border-2 border-dashed border-indigo-400 rounded-xl opacity-75 transition-all duration-200 flex items-center justify-center">
                    <span class="text-indigo-400 text-sm font-medium">Drop here</span>
                </div>

                <template v-for="(card, index) in cards" :key="card.id">
                    <div class="transition-all duration-300 ease-out">
                        <KanbanCard :card="card" :index="index" :is-dragging="draggedCardId === card.id"
                            @edit="$emit('edit-card', card)" @delete="$emit('delete-card', card.id)"
                            @drag-start="onCardDragStart" @drag-end="onCardDragEnd"
                            @update-card="$emit('update-card', $event)" />
                    </div>

                    <!-- Drop indicator between cards -->
                    <div v-if="showDropIndicator && dropPosition === index + 1"
                        class="h-20 bg-indigo-400/20 border-2 border-dashed border-indigo-400 rounded-xl opacity-75 transition-all duration-200 flex items-center justify-center">
                        <span class="text-indigo-400 text-sm font-medium">Drop here</span>
                    </div>
                </template>

                <!-- Add Card Button -->
                <button @click="$emit('add-card', column.id)"
                    class="w-full py-8 border-2 border-dashed border-slate-600 rounded-xl hover:border-indigo-400 hover:bg-indigo-900/10 transition-all duration-200 group flex items-center justify-center">
                    <div class="text-center">
                        <Plus
                            class="w-6 h-6 mx-auto mb-1 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                        <span class="text-xs text-slate-500 group-hover:text-indigo-400 font-medium">Add Card</span>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Plus, MoreVertical, GripVertical } from 'lucide-vue-next'
import KanbanCard from './Card.vue'

// Props
const props = defineProps({
    column: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    cards: {
        type: Array,
        default: () => []
    },
    isColumnDragging: {
        type: Boolean,
        default: false
    }
})

// Emits
const emit = defineEmits([
    'add-card',
    'edit-card',
    'delete-card',
    'edit-column',
    'delete-column',
    'card-moved',
    'card-reorder',
    'column-drag-start',
    'column-drag-end',
    'update-card'
])

// Reactive state
const showColumnMenu = ref(false)
const isDragOver = ref(false)
const isDropTarget = ref(false)
const draggedCardId = ref(null)
const draggedCardSourceColumn = ref(null)
const draggedCardIndex = ref(null)
const showDropIndicator = ref(false)
const dropPosition = ref(0)
const isColumnDragging = ref(false)

// Column title editing
const editingColumnTitle = ref(false)
const columnTitleInput = ref('')
const columnTitleInputRef = ref(null)

// Refs
const cardsContainer = ref(null)

// Column title editing methods
async function startColumnTitleEdit() {
    editingColumnTitle.value = true
    columnTitleInput.value = props.column.name

    await nextTick()
    if (columnTitleInputRef.value) {
        columnTitleInputRef.value.focus()
        columnTitleInputRef.value.select()
    }
}

async function saveColumnTitle() {
    if (!columnTitleInput.value.trim()) {
        cancelColumnTitleEdit()
        return
    }

    emit('edit-column', {
        ...props.column,
        name: columnTitleInput.value.trim()
    })

    editingColumnTitle.value = false
}

function cancelColumnTitleEdit() {
    editingColumnTitle.value = false
    columnTitleInput.value = ''
}

// Column Drag and Drop Handlers
function onColumnDragStart(e) {
    isColumnDragging.value = true
    e.dataTransfer.setData('text/column', props.column.id)
    e.dataTransfer.effectAllowed = 'move'
    emit('column-drag-start', props.column.id, props.index)
}

function onColumnDragEnd(e) {
    isColumnDragging.value = false
    emit('column-drag-end')
}

// Card Drag and Drop Handlers
function onCardDragStart(card, index) {
    draggedCardId.value = card.id
    draggedCardSourceColumn.value = props.column.id
    draggedCardIndex.value = index
}

function onCardDragEnd() {
    draggedCardId.value = null
    draggedCardSourceColumn.value = null
    draggedCardIndex.value = null
    isDragOver.value = false
    showDropIndicator.value = false
    isDropTarget.value = false
}

function onCardDragEnter(e) {
    e.preventDefault()

    if (draggedCardId.value) {
        isDragOver.value = true
        isDropTarget.value = true
        calculateDropPosition(e)
    }
}

function onCardDragOver(e) {
    e.preventDefault()

    if (draggedCardId.value) {
        calculateDropPosition(e)
    }
}

function onCardDragLeave(e) {
    e.preventDefault()

    // Only hide indicators if we're actually leaving the container
    if (!cardsContainer.value?.contains(e.relatedTarget)) {
        isDragOver.value = false
        showDropIndicator.value = false
        isDropTarget.value = false
    }
}

function calculateDropPosition(e) {
    if (!cardsContainer.value) return

    const container = cardsContainer.value
    const rect = container.getBoundingClientRect()
    const y = e.clientY - rect.top

    // Find the closest card
    const cardElements = container.querySelectorAll('[data-card-index]')
    let closestIndex = 0
    let closestDistance = Infinity

    cardElements.forEach((element, index) => {
        const cardRect = element.getBoundingClientRect()
        const cardY = cardRect.top - rect.top + cardRect.height / 2
        const distance = Math.abs(y - cardY)

        if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = y < cardY ? index : index + 1
        }
    })

    // If no cards, drop at the end
    if (cardElements.length === 0) {
        closestIndex = 0
    }

    dropPosition.value = closestIndex
    showDropIndicator.value = true
}

function onCardDrop(e) {
    e.preventDefault()
    e.stopPropagation()

    const dragData = JSON.parse(e.dataTransfer.getData('application/json'))
    if (!dragData || !dragData.cardId) return

    const { cardId, sourceColumnId, sourceIndex } = dragData
    const isMovingBetweenColumns = sourceColumnId !== props.column.id
    const newOrder = dropPosition.value

    // If dragging from the same column, handle reordering
    if (!isMovingBetweenColumns) {
        // Don't do anything if dropping in the same position or adjacent position
        if (sourceIndex === newOrder || sourceIndex + 1 === newOrder) {
            onCardDragEnd()
            return
        }

        // Create new order array
        const cardIds = props.cards.map(card => card.id)
        const [movedCard] = cardIds.splice(sourceIndex, 1)
        const adjustedNewOrder = newOrder > sourceIndex ? newOrder - 1 : newOrder
        cardIds.splice(adjustedNewOrder, 0, movedCard)

        emit('card-reorder', props.column.id, cardIds)
    } else {
        // Moving between columns
        emit('card-moved', cardId, props.column.id, newOrder)
    }

    onCardDragEnd()
}

// Column Actions
function editColumn() {
    showColumnMenu.value = false
    emit('edit-column', props.column)
}

function deleteColumn() {
    showColumnMenu.value = false
    emit('delete-column', props.column.id)
}

// Click outside to close menu
function handleClickOutside(e) {
    if (showColumnMenu.value && !e.target.closest('.column-menu')) {
        showColumnMenu.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.3);
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.5);
}

/* Smooth transitions for drag states */
.transition-all {
    transition: all 0.2s ease;
}
</style>