<!-- @/components/personal/kanban/CardModal.vue -->
<template>
    <div class="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
        <div class="flex min-h-screen items-center justify-center p-4">
            <!-- Overlay -->
            <div class="fixed inset-0 bg-black/60 transition-opacity" @click="$emit('close')"></div>

            <!-- Modal -->
            <div
                class="relative bg-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col backdrop-blur-xl border border-slate-700/50">
                <!-- Header -->
                <div
                    class="flex items-center justify-between p-8 border-b border-slate-700/50 flex-shrink-0 bg-gradient-to-r from-slate-800 to-slate-700">
                    <div class="flex items-center space-x-4">
                        <div
                            class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <div class="w-6 h-6 bg-white/20 rounded-lg"></div>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-white">
                                {{ isEditing ? 'Edit Card' : 'Create New Card' }}
                            </h2>
                            <p class="text-slate-400 text-sm">
                                {{ isEditing ? 'Make changes to your card' : 'Add a new card to your board' }}
                            </p>
                        </div>
                    </div>
                    <button @click="$emit('close')"
                        class="p-3 text-slate-400 hover:text-slate-300 hover:bg-slate-700 rounded-2xl transition-all duration-200 group">
                        <X class="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
                    </button>
                </div>

                <!-- Form - Scrollable Content -->
                <div class="flex-1 overflow-y-auto bg-gradient-to-b from-slate-800/50 to-slate-800">
                    <form @submit.prevent="saveCard" class="p-8 space-y-8">
                        <!-- Title Section -->
                        <div class="space-y-3">
                            <label class="flex items-center space-x-2 text-sm font-semibold text-slate-300">
                                <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                <span>Card Title</span>
                                <span class="text-red-400">*</span>
                            </label>
                            <input v-model="formData.title" type="text" required
                                class="w-full px-4 py-3 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-700 text-white text-lg font-medium shadow-sm transition-all duration-200"
                                placeholder="Enter a compelling card title...">
                        </div>

                        <!-- Description Section -->
                        <div class="space-y-3">
                            <label class="flex items-center space-x-2 text-sm font-semibold text-slate-300">
                                <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span>Description</span>
                            </label>
                            <textarea v-model="formData.description" rows="4"
                                class="w-full px-4 py-3 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-700 text-white shadow-sm transition-all duration-200 resize-none"
                                placeholder="Add a detailed description of what needs to be done..."></textarea>
                        </div>

                        <!-- Properties Grid -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Column -->
                            <div class="space-y-3">
                                <label class="flex items-center space-x-2 text-sm font-semibold text-slate-300">
                                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Column</span>
                                </label>
                                <select v-model="formData.columnId"
                                    class="w-full px-4 py-3 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-700 text-white shadow-sm transition-all duration-200">
                                    <option v-for="column in columns" :key="column.id" :value="column.id">
                                        {{ column.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- Priority -->
                            <div class="space-y-3">
                                <label class="flex items-center space-x-2 text-sm font-semibold text-slate-300">
                                    <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <span>Priority</span>
                                </label>
                                <select v-model="formData.priority"
                                    class="w-full px-4 py-3 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-700 text-white shadow-sm transition-all duration-200">
                                    <option value="none">No Priority</option>
                                    <option value="low">🟢 Low</option>
                                    <option value="medium">🟡 Medium</option>
                                    <option value="high">🟠 High</option>
                                    <option value="urgent">🔴 Urgent</option>
                                </select>
                            </div>

                            <!-- Due Date -->
                            <div class="space-y-3">
                                <label class="flex items-center space-x-2 text-sm font-semibold text-slate-300">
                                    <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span>Due Date</span>
                                </label>
                                <input v-model="formData.dueDate" type="date"
                                    class="w-full px-4 py-3 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-700 text-white shadow-sm transition-all duration-200">
                            </div>

                            <!-- Progress -->
                            <div class="space-y-3">
                                <label class="flex items-center justify-between text-sm font-semibold text-slate-300">
                                    <div class="flex items-center space-x-2">
                                        <div class="w-2 h-2 bg-cyan-500 rounded-full"></div>
                                        <span>Progress</span>
                                    </div>
                                    <span class="text-indigo-400 font-bold">{{ formData.progress }}%</span>
                                </label>
                                <div class="relative">
                                    <input v-model.number="formData.progress" type="range" min="0" max="100" step="5"
                                        class="w-full h-3 bg-slate-600 rounded-full appearance-none cursor-pointer slider">
                                    <div class="absolute top-0 left-0 h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
                                        :style="{ width: `${formData.progress}%` }"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Checklist Section -->
                        <div class="space-y-4 bg-slate-900/50 rounded-2xl p-6 border border-slate-600">
                            <div class="flex items-center justify-between">
                                <label class="flex items-center space-x-2 text-sm font-semibold text-slate-300">
                                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Checklist</span>
                                </label>
                                <span v-if="formData.checklist.length > 0"
                                    class="text-xs text-slate-500 bg-slate-700 px-3 py-1 rounded-full">
                                    {{ completedItems }}/{{ formData.checklist.length }} completed
                                </span>
                            </div>

                            <!-- Checklist Items -->
                            <div class="space-y-3">
                                <div v-for="(item, index) in formData.checklist" :key="index"
                                    class="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700 group hover:shadow-sm transition-all duration-200">
                                    <input type="checkbox" v-model="item.completed"
                                        class="w-5 h-5 text-indigo-600 bg-slate-700 border-2 border-slate-500 rounded-lg focus:ring-indigo-500 focus:ring-2 transition-all duration-200" />
                                    <input v-model="item.text" type="text"
                                        class="flex-1 bg-transparent border-none text-white text-sm focus:outline-none"
                                        :class="{ 'line-through text-slate-400': item.completed }"
                                        placeholder="Checklist item..." />
                                    <button type="button" @click="removeChecklistItem(index)"
                                        class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-900/20 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                                        <X class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <!-- Add Checklist Item -->
                            <div class="flex space-x-3">
                                <input v-model="newChecklistItem" type="text" placeholder="Add a new checklist item..."
                                    @keyup.enter="addChecklistItem"
                                    class="flex-1 px-4 py-3 text-sm border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-700 text-white shadow-sm transition-all duration-200" />
                                <button type="button" @click="addChecklistItem" :disabled="!newChecklistItem.trim()"
                                    class="px-6 py-3 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-medium shadow-sm">
                                    Add
                                </button>
                            </div>
                        </div>

                        <!-- Labels & Assignees Grid -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <!-- Labels Section -->
                            <div class="space-y-4">
                                <label class="flex items-center space-x-2 text-sm font-semibold text-slate-300">
                                    <div class="w-2 h-2 bg-pink-500 rounded-full"></div>
                                    <span>Labels</span>
                                </label>

                                <!-- Existing Labels -->
                                <div v-if="formData.labels.length > 0" class="flex flex-wrap gap-2">
                                    <span v-for="(label, index) in formData.labels" :key="index"
                                        class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-xl group hover:scale-105 transition-all duration-200"
                                        :style="{
                                            backgroundColor: label.color + '20',
                                            color: label.color,
                                            border: `2px solid ${label.color}30`
                                        }">
                                        {{ label.text }}
                                        <button type="button" @click="removeLabel(index)"
                                            class="ml-2 text-current opacity-60 hover:opacity-100 group-hover:rotate-90 transition-all duration-200">
                                            <X class="w-3 h-3" />
                                        </button>
                                    </span>
                                </div>

                                <!-- Add New Label -->
                                <div class="space-y-3">
                                    <input v-model="newLabel.text" type="text" placeholder="Label name..."
                                        class="w-full px-4 py-3 text-sm border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-700 text-white shadow-sm transition-all duration-200"
                                        @keyup.enter="addLabel">
                                    <div class="flex flex-wrap gap-2">
                                        <button v-for="color in labelColors" :key="color" type="button"
                                            @click="newLabel.color = color"
                                            class="w-10 h-10 rounded-xl border-3 transition-all duration-200 hover:scale-110 shadow-sm"
                                            :class="newLabel.color === color ? 'border-slate-400 scale-110 shadow-lg' : 'border-slate-600'"
                                            :style="{ backgroundColor: color }"></button>
                                        <button type="button" @click="addLabel" :disabled="!newLabel.text.trim()"
                                            class="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-medium">
                                            Add Label
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Assignees Section -->
                            <div class="space-y-4">
                                <label class="flex items-center space-x-2 text-sm font-semibold text-slate-300">
                                    <div class="w-2 h-2 bg-teal-500 rounded-full"></div>
                                    <span>Assignees</span>
                                </label>

                                <!-- Current Assignees -->
                                <div v-if="formData.assignees.length > 0" class="flex flex-wrap gap-3">
                                    <span v-for="(assignee, index) in formData.assignees" :key="index"
                                        class="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-indigo-900/30 to-purple-900/30 text-indigo-300 rounded-xl border border-indigo-700 group hover:scale-105 transition-all duration-200">
                                        <div
                                            class="w-6 h-6 mr-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs text-white font-bold shadow-sm">
                                            {{ getInitials(assignee.name || assignee.email) }}
                                        </div>
                                        {{ assignee.name || assignee.email }}
                                        <button type="button" @click="removeAssignee(index)"
                                            class="ml-3 text-indigo-500 hover:text-red-500 group-hover:rotate-90 transition-all duration-200">
                                            <X class="w-3 h-3" />
                                        </button>
                                    </span>
                                </div>

                                <!-- Add Assignee -->
                                <div class="space-y-3">
                                    <input v-model="newAssignee.email" type="email" placeholder="Enter email address..."
                                        class="w-full px-4 py-3 text-sm border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-700 text-white shadow-sm transition-all duration-200"
                                        @keyup.enter="addAssignee">
                                    <div class="flex space-x-3">
                                        <input v-model="newAssignee.name" type="text" placeholder="Name (optional)"
                                            class="flex-1 px-4 py-3 text-sm border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-700 text-white shadow-sm transition-all duration-200"
                                            @keyup.enter="addAssignee">
                                        <button type="button" @click="addAssignee" :disabled="!newAssignee.email.trim()"
                                            class="px-6 py-3 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-medium">
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Footer -->
                <div
                    class="flex items-center justify-between p-8 border-t border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-700 flex-shrink-0">
                    <div>
                        <button v-if="isEditing" type="button" @click="deleteCard"
                            class="flex items-center space-x-3 px-6 py-3 text-red-400 hover:text-white hover:bg-red-600 border-2 border-red-800 hover:border-red-600 rounded-xl transition-all duration-200 font-medium group">
                            <Trash2 class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                            <span>Delete Card</span>
                        </button>
                    </div>

                    <div class="flex space-x-4">
                        <button type="button" @click="$emit('close')"
                            class="px-8 py-3 text-slate-300 hover:bg-slate-600 border-2 border-slate-600 rounded-xl transition-all duration-200 font-medium">
                            Cancel
                        </button>
                        <button @click="saveCard" :disabled="!formData.title.trim()"
                            class="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none">
                            <Save class="w-5 h-5" />
                            <span>{{ isEditing ? 'Update Card' : 'Create Card' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { X, Trash2, Save } from 'lucide-vue-next'

// Props
const props = defineProps({
    card: {
        type: Object,
        default: () => ({})
    },
    columns: {
        type: Array,
        default: () => []
    }
})

// Emits
const emit = defineEmits(['close', 'save', 'delete'])

// Reactive state
const formData = ref({
    title: '',
    description: '',
    columnId: '',
    priority: 'medium',
    dueDate: '',
    progress: 0,
    labels: [],
    assignees: [],
    checklist: [],
    order: 0
})

const newLabel = ref({
    text: '',
    color: '#3b82f6'
})

const newAssignee = ref({
    email: '',
    name: ''
})

const newChecklistItem = ref('')

// Constants
const labelColors = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
    '#6b7280', '#f97316'
]

// Computed
const isEditing = computed(() => !!props.card?.id)

const completedItems = computed(() => {
    return formData.value.checklist.filter(item => item.completed).length
})

// Checklist methods
function addChecklistItem() {
    if (!newChecklistItem.value.trim()) return

    formData.value.checklist.push({
        text: newChecklistItem.value.trim(),
        completed: false
    })

    newChecklistItem.value = ''
}

function removeChecklistItem(index) {
    formData.value.checklist.splice(index, 1)
}

// Label methods
function addLabel() {
    if (!newLabel.value.text.trim()) return

    formData.value.labels.push({
        text: newLabel.value.text.trim(),
        color: newLabel.value.color
    })

    newLabel.value = { text: '', color: '#3b82f6' }
}

function removeLabel(index) {
    formData.value.labels.splice(index, 1)
}

// Assignee methods
function addAssignee() {
    if (!newAssignee.value.email.trim()) return

    // Check if already exists
    const exists = formData.value.assignees.some(a => a.email === newAssignee.value.email)
    if (exists) return

    formData.value.assignees.push({
        email: newAssignee.value.email.trim(),
        name: newAssignee.value.name.trim() || newAssignee.value.email.trim()
    })

    newAssignee.value = { email: '', name: '' }
}

function removeAssignee(index) {
    formData.value.assignees.splice(index, 1)
}

function getInitials(name) {
    if (!name) return '?'
    return name.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

function saveCard() {
    if (!formData.value.title.trim()) return

    const cardData = {
        ...formData.value,
        title: formData.value.title.trim(),
        description: formData.value.description.trim(),
        commentsCount: formData.value.commentsCount || 0,
        attachmentsCount: formData.value.attachmentsCount || 0
    }

    if (isEditing.value) {
        cardData.id = props.card.id
    }

    emit('save', cardData)
}

function deleteCard() {
    if (confirm('Are you sure you want to delete this card?')) {
        emit('delete', props.card.id)
    }
}

function formatDateForInput(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
}

// Initialize form data
onMounted(() => {
    if (props.card?.id) {
        // Editing existing card
        formData.value = {
            ...props.card,
            dueDate: formatDateForInput(props.card.dueDate),
            labels: props.card.labels || [],
            assignees: props.card.assignees || [],
            checklist: props.card.checklist || [],
            progress: props.card.progress || 0
        }
    } else {
        // Creating new card
        formData.value.columnId = props.card?.columnId || (props.columns[0]?.id || '')
        formData.value.order = props.card?.order || 0
    }
})
</script>

<style scoped>
/* Custom slider styling */
.slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #6366f1;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #6366f1;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Smooth scrolling */
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
    width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.3);
    border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.5);
}
</style>