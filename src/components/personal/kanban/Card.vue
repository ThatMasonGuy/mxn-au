<!-- @/components/personal/kanban/Card.vue -->
<template>
    <div :data-card-index="index" draggable="true" @dragstart="onDragStart" @dragend="onDragEnd"
        @click="handleCardClick"
        class="group bg-slate-800 border border-slate-700/50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1 hover:scale-[1.02] relative"
        :class="{
            'opacity-50': isDragging,
            'z-50': isDragging,
            'rotate-2': isDragging
        }">
        <!-- Priority Indicator -->
        <div v-if="card.priority && card.priority !== 'none'" class="absolute top-2 right-2 w-2 h-2 rounded-full"
            :class="priorityClasses[card.priority]"></div>

        <!-- Card Header -->
        <div class="flex items-start justify-between mb-3">
            <!-- Inline Editable Card Title -->
            <div class="flex-1 pr-2">
                <input v-if="editingCardTitle" v-model="cardTitleInput" @blur="saveCardTitle"
                    @keyup.enter="saveCardTitle" @keyup.escape="cancelCardTitleEdit" @click.stop ref="cardTitleInputRef"
                    class="font-medium text-sm leading-tight w-full bg-transparent border border-indigo-400 rounded px-2 py-1 text-white focus:outline-none" />
                <h4 v-else @click.stop="startCardTitleEdit"
                    class="font-medium text-white text-sm leading-tight cursor-text hover:bg-slate-700/50 rounded px-2 py-1 transition-colors"
                    :title="'Click to edit'">
                    {{ card.title }}
                </h4>
            </div>

            <!-- Quick Actions -->
            <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click.stop="$emit('edit', card)"
                    class="p-1 text-slate-400 hover:text-indigo-400 hover:bg-indigo-900/20 rounded transition-all duration-200"
                    title="Edit Card">
                    <Edit class="w-3 h-3" />
                </button>
                <button @click.stop="$emit('delete', card.id)"
                    class="p-1 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-all duration-200"
                    title="Delete Card">
                    <Trash2 class="w-3 h-3" />
                </button>
            </div>
        </div>

        <!-- Description -->
        <p v-if="card.description" class="text-xs text-slate-400 mb-3 leading-relaxed line-clamp-3">
            {{ card.description }}
        </p>

        <!-- Checklist Progress -->
        <div v-if="card.checklist && card.checklist.length > 0" class="mb-3">
            <div class="flex items-center justify-between mb-1">
                <div class="flex items-center space-x-1">
                    <CheckSquare class="w-3 h-3 text-slate-400" />
                    <span class="text-xs text-slate-500">{{ completedChecklistItems }}/{{ card.checklist.length
                        }}</span>
                </div>
                <span class="text-xs text-slate-400 font-medium">{{ checklistProgress }}%</span>
            </div>
            <div class="w-full bg-slate-700 rounded-full h-1.5">
                <div class="h-1.5 rounded-full transition-all duration-300" :class="checklistProgressBarClass"
                    :style="{ width: `${checklistProgress}%` }"></div>
            </div>
        </div>

        <!-- Labels -->
        <div v-if="card.labels && card.labels.length > 0" class="flex flex-wrap gap-1 mb-3">
            <span v-for="label in card.labels" :key="label.id || label.text"
                class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full" :style="{
                    backgroundColor: label.color + '20',
                    color: label.color,
                    border: `1px solid ${label.color}30`
                }">
                {{ label.text }}
            </span>
        </div>

        <!-- Card Footer -->
        <div class="flex items-center justify-between">
            <!-- Due Date -->
            <div v-if="card.dueDate" class="flex items-center space-x-1">
                <Calendar class="w-3 h-3 text-slate-400" />
                <span class="text-xs" :class="dueDateClasses">
                    {{ formatDate(card.dueDate) }}
                </span>
            </div>

            <!-- Assignees -->
            <div v-if="card.assignees && card.assignees.length > 0" class="flex -space-x-1">
                <div v-for="(assignee, idx) in card.assignees.slice(0, 3)" :key="assignee.id || idx"
                    class="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-medium text-white border-2 border-slate-800"
                    :title="assignee.name || assignee.email">
                    {{ getInitials(assignee.name || assignee.email) }}
                </div>
                <div v-if="card.assignees.length > 3"
                    class="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-medium text-slate-300 border-2 border-slate-800">
                    +{{ card.assignees.length - 3 }}
                </div>
            </div>

            <!-- Comments/Attachments Count -->
            <div class="flex items-center space-x-2">
                <div v-if="card.commentsCount > 0" class="flex items-center space-x-1">
                    <MessageCircle class="w-3 h-3 text-slate-400" />
                    <span class="text-xs text-slate-500">{{ card.commentsCount }}</span>
                </div>

                <div v-if="card.attachmentsCount > 0" class="flex items-center space-x-1">
                    <Paperclip class="w-3 h-3 text-slate-400" />
                    <span class="text-xs text-slate-500">{{ card.attachmentsCount }}</span>
                </div>
            </div>
        </div>

        <!-- Progress Bar (if applicable) -->
        <div v-if="card.progress !== undefined && card.progress !== null" class="mt-3">
            <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-slate-500">Progress</span>
                <span class="text-xs text-slate-400 font-medium">{{ card.progress }}%</span>
            </div>
            <div class="w-full bg-slate-700 rounded-full h-1.5">
                <div class="h-1.5 rounded-full transition-all duration-300" :class="progressBarClass"
                    :style="{ width: `${card.progress}%` }"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { Edit, Trash2, Calendar, MessageCircle, Paperclip, CheckSquare } from 'lucide-vue-next'

// Props
const props = defineProps({
    card: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        default: 0
    },
    isDragging: {
        type: Boolean,
        default: false
    }
})

// Emits
const emit = defineEmits(['edit', 'delete', 'drag-start', 'drag-end', 'update-card'])

// State
const isDragging = ref(false)

// Card title editing
const editingCardTitle = ref(false)
const cardTitleInput = ref('')
const cardTitleInputRef = ref(null)

// Computed
const priorityClasses = {
    'low': 'bg-green-400',
    'medium': 'bg-yellow-400',
    'high': 'bg-orange-400',
    'urgent': 'bg-red-400'
}

const dueDateClasses = computed(() => {
    if (!props.card.dueDate) return 'text-slate-500'

    const dueDate = new Date(props.card.dueDate)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (dueDate < today) return 'text-red-400 font-medium'
    if (dueDate <= tomorrow) return 'text-orange-400 font-medium'
    return 'text-slate-500'
})

const progressBarClass = computed(() => {
    const progress = props.card.progress || 0
    if (progress >= 100) return 'bg-green-400'
    if (progress >= 75) return 'bg-blue-400'
    if (progress >= 50) return 'bg-yellow-400'
    if (progress >= 25) return 'bg-orange-400'
    return 'bg-red-400'
})

const completedChecklistItems = computed(() => {
    if (!props.card.checklist) return 0
    return props.card.checklist.filter(item => item.completed).length
})

const checklistProgress = computed(() => {
    if (!props.card.checklist || props.card.checklist.length === 0) return 0
    return Math.round((completedChecklistItems.value / props.card.checklist.length) * 100)
})

const checklistProgressBarClass = computed(() => {
    const progress = checklistProgress.value
    if (progress >= 100) return 'bg-green-400'
    if (progress >= 75) return 'bg-blue-400'
    if (progress >= 50) return 'bg-yellow-400'
    if (progress >= 25) return 'bg-orange-400'
    return 'bg-red-400'
})

// Card title editing methods
async function startCardTitleEdit() {
    editingCardTitle.value = true
    cardTitleInput.value = props.card.title

    await nextTick()
    if (cardTitleInputRef.value) {
        cardTitleInputRef.value.focus()
        cardTitleInputRef.value.select()
    }
}

async function saveCardTitle() {
    if (!cardTitleInput.value.trim()) {
        cancelCardTitleEdit()
        return
    }

    // Emit an update event to parent
    emit('update-card', {
        ...props.card,
        title: cardTitleInput.value.trim()
    })

    editingCardTitle.value = false
}

function cancelCardTitleEdit() {
    editingCardTitle.value = false
    cardTitleInput.value = ''
}

// Methods
function onDragStart(e) {
    isDragging.value = true
    e.dataTransfer.setData('application/json', JSON.stringify({
        cardId: props.card.id,
        sourceColumnId: props.card.columnId,
        sourceIndex: props.index
    }))
    e.dataTransfer.effectAllowed = 'move'
    emit('drag-start', props.card, props.index)
}

function onDragEnd(e) {
    isDragging.value = false
    emit('drag-end')
}

function handleCardClick(e) {
    // Don't open card if we're editing the title
    if (editingCardTitle.value) return

    // Don't open card if clicking on action buttons
    if (e.target.closest('.group button')) return

    emit('edit', props.card)
}

function formatDate(dateString) {
    if (!dateString) return ''

    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Check if it's today, tomorrow, or yesterday
    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

    // Return formatted date
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    })
}

function getInitials(name) {
    if (!name) return '?'
    return name.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}
</script>

<style scoped>
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Enhanced drag styles */
.transform {
    transition: transform 0.2s ease, opacity 0.2s ease;
}
</style>