<!-- @/pages/personal/Kanban.vue -->
<!-- This is the boards listing page -->
<template>
    <div class="min-h-screen bg-slate-900">
        <!-- Header -->
        <header class="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-3">
                            <div
                                class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Trello class="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 class="text-xl font-bold text-white">Kanban Workspace</h1>
                                <p class="text-xs text-slate-400">{{ kanbanStore.boards.length }} board{{
                                    kanbanStore.boards.length !== 1 ? 's' : '' }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center space-x-3">
                        <button @click="showCreateBoard = true"
                            class="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                            <Plus class="w-4 h-4" />
                            <span class="hidden sm:inline">Create Board</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Loading State -->
            <div v-if="kanbanStore.loading" class="flex justify-center items-center py-20">
                <div class="flex flex-col items-center space-y-4">
                    <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin">
                    </div>
                    <span class="text-slate-400">Loading workspace...</span>
                </div>
            </div>

            <!-- Boards Grid -->
            <div v-else-if="kanbanStore.boards.length > 0">
                <!-- Stats Overview -->
                <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                    <div class="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-slate-400 text-xs">Total Boards</p>
                                <p class="text-2xl font-bold text-white">{{ kanbanStore.boards.length }}</p>
                            </div>
                            <div class="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                                <Trello class="w-5 h-5 text-indigo-400" />
                            </div>
                        </div>
                    </div>
                    <div class="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-slate-400 text-xs">Active Today</p>
                                <p class="text-2xl font-bold text-white">{{ todayActiveCount }}</p>
                            </div>
                            <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <Activity class="w-5 h-5 text-green-400" />
                            </div>
                        </div>
                    </div>
                    <div class="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-slate-400 text-xs">Last Updated</p>
                                <p class="text-sm font-medium text-white">{{ lastUpdatedTime }}</p>
                            </div>
                            <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <Clock class="w-5 h-5 text-purple-400" />
                            </div>
                        </div>
                    </div>
                    <div class="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-slate-400 text-xs">Quick Actions</p>
                                <div class="flex space-x-2 mt-1">
                                    <button @click="showCreateBoard = true"
                                        class="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors">
                                        New Board
                                    </button>
                                    <button @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'"
                                        class="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors">
                                        {{ viewMode === 'grid' ? 'List View' : 'Grid View' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Search and Filter Bar -->
                <div class="flex flex-col sm:flex-row gap-4 mb-6">
                    <div class="flex-1 relative">
                        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input v-model="searchQuery" type="text" placeholder="Search boards..."
                            class="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    </div>
                    <select v-model="sortBy"
                        class="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="updated">Last Updated</option>
                        <option value="created">Date Created</option>
                        <option value="name">Alphabetical</option>
                    </select>
                </div>

                <!-- Boards Display -->
                <div v-if="viewMode === 'grid'"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <!-- Board Cards -->
                    <div v-for="board in filteredAndSortedBoards" :key="board.id" @click="openBoard(board)"
                        class="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 hover:border-indigo-500/50 cursor-pointer transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">

                        <!-- Card Header with Board Color -->
                        <div class="h-32 relative overflow-hidden">
                            <div class="absolute inset-0" :style="{ backgroundColor: board.color || '#6366f1' }"></div>
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent">
                            </div>

                            <!-- Quick Actions -->
                            <div
                                class="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button @click.stop="editBoard(board)"
                                    class="p-2 bg-slate-800/80 backdrop-blur rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all">
                                    <Edit class="w-4 h-4" />
                                </button>
                                <button @click.stop="confirmDeleteBoard(board)"
                                    class="p-2 bg-slate-800/80 backdrop-blur rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-900/20 transition-all">
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            </div>

                            <!-- Board Icon -->
                            <div class="absolute bottom-3 left-3">
                                <div
                                    class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <component :is="getIcon(board.icon)" class="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <!-- Card Body -->
                        <div class="p-4">
                            <h3
                                class="font-semibold text-white text-lg mb-1 group-hover:text-indigo-400 transition-colors">
                                {{ board.name }}
                            </h3>
                            <p v-if="board.description" class="text-slate-400 text-sm line-clamp-2 mb-3">
                                {{ board.description }}
                            </p>

                            <div class="flex items-center justify-between text-xs">
                                <div class="flex items-center space-x-3 text-slate-500">
                                    <div class="flex items-center space-x-1">
                                        <Calendar class="w-3 h-3" />
                                        <span>{{ formatDate(board.updatedAt || board.createdAt) }}</span>
                                    </div>
                                </div>
                                <ArrowRight
                                    class="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </div>

                    <!-- Create New Board Card -->
                    <div @click="showCreateBoard = true"
                        class="flex items-center justify-center bg-slate-800/30 hover:bg-slate-800/50 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl cursor-pointer transition-all duration-300 min-h-[240px] group">
                        <div class="text-center">
                            <div
                                class="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-500/20 transition-colors">
                                <Plus class="w-8 h-8 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                            </div>
                            <span
                                class="text-sm font-medium text-slate-400 group-hover:text-indigo-400 transition-colors">Create
                                New Board</span>
                        </div>
                    </div>
                </div>

                <!-- List View -->
                <div v-else class="space-y-2">
                    <div v-for="board in filteredAndSortedBoards" :key="board.id" @click="openBoard(board)"
                        class="group flex items-center justify-between bg-slate-800/50 hover:bg-slate-800/70 rounded-lg p-4 cursor-pointer transition-all duration-200 border border-slate-700/50 hover:border-indigo-500/50">
                        <div class="flex items-center space-x-4">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                                :style="{ backgroundColor: board.color || '#6366f1' }">
                                <component :is="getIcon(board.icon)" class="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 class="font-medium text-white group-hover:text-indigo-400 transition-colors">{{
                                    board.name }}</h3>
                                <p class="text-sm text-slate-400">{{ formatDate(board.updatedAt || board.createdAt) }}
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button @click.stop="editBoard(board)"
                                class="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                <Edit class="w-4 h-4" />
                            </button>
                            <button @click.stop="confirmDeleteBoard(board)"
                                class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                <Trash2 class="w-4 h-4" />
                            </button>
                            <ArrowRight
                                class="w-5 h-5 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="flex flex-col items-center justify-center py-20">
                <div
                    class="w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mb-6">
                    <Trello class="w-16 h-16 text-indigo-400" />
                </div>

                <h3 class="text-2xl font-bold text-white mb-3">Welcome to Kanban Workspace</h3>
                <p class="text-slate-400 mb-8 text-center max-w-md">
                    Create your first board to start organizing tasks and projects with a visual workflow.
                </p>

                <button @click="showCreateBoard = true"
                    class="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                    <Plus class="w-5 h-5" />
                    <span>Create Your First Board</span>
                </button>
            </div>
        </main>

        <!-- Create/Edit Board Modal -->
        <Transition name="modal">
            <div v-if="showCreateBoard || showEditBoard" class="fixed inset-0 z-50 overflow-y-auto">
                <div class="flex min-h-screen items-center justify-center p-4">
                    <!-- Overlay -->
                    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        @click="cancelBoardModal"></div>

                    <!-- Modal -->
                    <div
                        class="relative bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                        <div class="mb-6">
                            <h3 class="text-xl font-bold text-white mb-2">
                                {{ showEditBoard ? 'Edit Board' : 'Create New Board' }}
                            </h3>
                            <p class="text-sm text-slate-400">
                                {{ showEditBoard ? 'Update your board details' : 'Set up a new kanban board for your project' }}
                            </p>
                        </div>

                        <form @submit.prevent="showEditBoard ? updateBoard() : createBoard()">
                            <div class="space-y-5">
                                <!-- Board Name -->
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Board Name <span class="text-red-400">*</span>
                                    </label>
                                    <input v-model="boardForm.name" type="text" required ref="boardNameInput"
                                        class="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
                                        placeholder="e.g., Product Roadmap">
                                </div>

                                <!-- Board Description -->
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Description
                                    </label>
                                    <textarea v-model="boardForm.description" rows="3"
                                        class="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400 resize-none"
                                        placeholder="Brief description of your board's purpose..."></textarea>
                                </div>

                                <!-- Icon Selection -->
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Board Icon
                                    </label>
                                    <div
                                        class="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-900/50 rounded-lg border border-slate-700">
                                        <button v-for="iconName in iconNames" :key="iconName" type="button"
                                            @click="boardForm.icon = iconName"
                                            class="p-2 rounded-lg border-2 transition-all duration-200 flex items-center justify-center"
                                            :class="boardForm.icon === iconName
                                                ? 'border-indigo-500 bg-indigo-900/30'
                                                : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800'"
                                            :title="iconName">
                                            <component :is="getIcon(iconName)" class="w-5 h-5"
                                                :class="boardForm.icon === iconName ? 'text-indigo-400' : 'text-slate-400'" />
                                        </button>
                                    </div>
                                </div>

                                <!-- Color Selection -->
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Board Color
                                    </label>
                                    <div class="flex items-center space-x-3">
                                        <div class="flex flex-wrap gap-2">
                                            <button v-for="color in boardColors" :key="color" type="button"
                                                @click="boardForm.color = color"
                                                class="w-10 h-10 rounded-lg border-2 transition-all duration-200 shadow-sm"
                                                :class="boardForm.color === color
                                                    ? 'border-white scale-110 shadow-lg'
                                                    : 'border-slate-700 hover:scale-105'"
                                                :style="{ backgroundColor: color }">
                                                <span v-if="boardForm.color === color"
                                                    class="block w-full h-full rounded-md bg-white/30 flex items-center justify-center">
                                                    ✓
                                                </span>
                                            </button>
                                        </div>
                                        <!-- Preview -->
                                        <div class="ml-4 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800">
                                            <div class="flex items-center space-x-2">
                                                <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                                                    :style="{ backgroundColor: boardForm.color }">
                                                    <component :is="getIcon(boardForm.icon)"
                                                        class="w-4 h-4 text-white" />
                                                </div>
                                                <span class="text-xs text-slate-400">Preview</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex justify-end space-x-3 mt-6">
                                <button type="button" @click="cancelBoardModal"
                                    class="px-4 py-2 text-slate-300 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors duration-200">
                                    Cancel
                                </button>
                                <button type="submit" :disabled="!boardForm.name.trim() || saving"
                                    class="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200">
                                    <span v-if="saving">{{ showEditBoard ? 'Updating...' : 'Creating...' }}</span>
                                    <span v-else>{{ showEditBoard ? 'Update Board' : 'Create Board' }}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useKanbanStore } from '@/stores/personal/useKanbanStore'
import {
    Trello, Plus, Edit, Trash2, Clock, Calendar,
    Search, Activity, LayoutGrid, ArrowRight,
    Briefcase, Target, Rocket, Book, Heart, Star,
    Zap, Coffee, Music, Camera, Globe, Package,
    ShoppingCart, Users, FileText, Code, Palette,
    Award
} from 'lucide-vue-next'

// Store and routing
const kanbanStore = useKanbanStore()
const router = useRouter()

// Reactive state
const showCreateBoard = ref(false)
const showEditBoard = ref(false)
const saving = ref(false)
const boardForm = ref({
    id: '',
    name: '',
    description: '',
    color: '#6366f1',
    icon: 'Trello'
})
const boardNameInput = ref(null)
const searchQuery = ref('')
const sortBy = ref('updated')
const viewMode = ref('grid')

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
const filteredAndSortedBoards = computed(() => {
    let boards = [...kanbanStore.boards]

    // Filter by search
    if (searchQuery.value) {
        boards = boards.filter(board =>
            board.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            (board.description && board.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
        )
    }

    // Sort boards
    boards.sort((a, b) => {
        switch (sortBy.value) {
            case 'name':
                return a.name.localeCompare(b.name)
            case 'created':
                return getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
            case 'updated':
            default:
                return getTimestamp(b.updatedAt || b.createdAt) - getTimestamp(a.updatedAt || a.createdAt)
        }
    })

    return boards
})

const todayActiveCount = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return kanbanStore.boards.filter(board => {
        const updated = board.updatedAt ? new Date(getTimestamp(board.updatedAt)) : null
        return updated && updated >= today
    }).length
})

const lastUpdatedTime = computed(() => {
    if (kanbanStore.boards.length === 0) return 'Never'

    const latestBoard = [...kanbanStore.boards].sort((a, b) =>
        getTimestamp(b.updatedAt || b.createdAt) - getTimestamp(a.updatedAt || a.createdAt)
    )[0]

    return formatDate(latestBoard.updatedAt || latestBoard.createdAt)
})

// Methods
function getIcon(iconName) {
    return availableIcons[iconName] || Trello
}

function getTimestamp(date) {
    if (!date) return 0
    if (date.seconds) return date.seconds * 1000
    if (date instanceof Date) return date.getTime()
    return new Date(date).getTime()
}

function getBoardGradient(board) {
    // Use the board's color if it exists, otherwise use default gradient
    if (board.color) {
        return `from-[${board.color}] to-[${board.color}]`
    }
    // Fallback to generated gradient
    const gradients = [
        'from-blue-500 to-indigo-600',
        'from-purple-500 to-pink-600',
        'from-green-500 to-teal-600',
        'from-orange-500 to-red-600',
        'from-cyan-500 to-blue-600',
        'from-pink-500 to-purple-600',
        'from-yellow-500 to-orange-600',
        'from-indigo-500 to-purple-600'
    ]
    const index = board.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return gradients[index % gradients.length]
}

function formatDate(date) {
    if (!date) return 'Never'

    const timestamp = getTimestamp(date)
    const dateObj = new Date(timestamp)
    const now = new Date()
    const diffMs = now - dateObj
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`

    return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: dateObj.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
}

function openBoard(board) {
    router.push({
        name: 'PersonalKanbanBoard',
        params: { boardId: board.id }
    })
}

function editBoard(board) {
    boardForm.value = {
        id: board.id,
        name: board.name || '',
        description: board.description || '',
        color: board.color || '#6366f1',
        icon: board.icon || 'Trello'
    }
    showEditBoard.value = true
}

function confirmDeleteBoard(board) {
    if (confirm(`Are you sure you want to delete "${board.name}"? This action cannot be undone.`)) {
        deleteBoard(board.id)
    }
}

async function createBoard() {
    if (!boardForm.value.name.trim()) return

    saving.value = true
    try {
        const boardId = await kanbanStore.createBoard({
            name: boardForm.value.name.trim(),
            description: boardForm.value.description.trim(),
            color: boardForm.value.color,
            icon: boardForm.value.icon
        })

        if (boardId) {
            cancelBoardModal()
            // Navigate to the new board
            router.push({
                name: 'PersonalKanbanBoard',
                params: { boardId }
            })
        }
    } catch (error) {
        console.error('Failed to create board:', error)
    } finally {
        saving.value = false
    }
}

async function updateBoard() {
    if (!boardForm.value.name.trim()) return

    saving.value = true
    try {
        await kanbanStore.updateBoard(boardForm.value.id, {
            name: boardForm.value.name.trim(),
            description: boardForm.value.description.trim(),
            color: boardForm.value.color,
            icon: boardForm.value.icon
        })
        cancelBoardModal()
    } catch (error) {
        console.error('Failed to update board:', error)
    } finally {
        saving.value = false
    }
}

async function deleteBoard(boardId) {
    await kanbanStore.deleteBoard(boardId)
}

function cancelBoardModal() {
    showCreateBoard.value = false
    showEditBoard.value = false
    boardForm.value = {
        id: '',
        name: '',
        description: '',
        color: '#6366f1',
        icon: 'Trello'
    }
}

// Auto-focus input when modal opens
watch([() => showCreateBoard.value, () => showEditBoard.value], async ([create, edit]) => {
    if (create || edit) {
        await nextTick()
        boardNameInput.value?.focus()
    }
})

// Lifecycle
onMounted(async () => {
    await kanbanStore.fetchBoards()
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
    transition: transform 0.3s ease;
}

.modal-enter-from .relative {
    transform: scale(0.95) translateY(10px);
}

.modal-leave-to .relative {
    transform: scale(0.95) translateY(10px);
}
</style>