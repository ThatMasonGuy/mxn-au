<template>
    <div class="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col">
        <GoblinTodoNav />

        <!-- Header -->
        <div class="px-6 py-5 border-b border-zinc-700 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-base font-semibold text-zinc-100 flex items-center gap-2">
                        <ListTodo :size="16" class="text-zinc-400" />
                        All tasks
                    </h1>
                    <p class="text-xs text-zinc-500 mt-0.5">
                        {{ queueCount }} in queue · {{ activeCount }} active today · {{ completedCount }} completed
                    </p>
                </div>

                <button @click="taskModal = true"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors">
                    <Plus :size="13" />
                    New task
                </button>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-2 mt-4">
                <!-- Search -->
                <div class="relative">
                    <Search :size="13" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input v-model="search" type="text" placeholder="Search..."
                        class="pl-8 pr-3 py-1.5 rounded-md text-xs bg-zinc-800 border border-zinc-600 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 w-48 transition-colors" />
                </div>

                <!-- Status filter -->
                <div class="flex gap-1">
                    <button v-for="s in statusOptions" :key="s.value" @click="toggleStatus(s.value)" :class="[
                        'px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors',
                        activeStatuses.includes(s.value) ? s.activeClass : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                    ]">{{ s.label }}</button>
                </div>

                <!-- Priority filter -->
                <div class="flex gap-1">
                    <button v-for="p in priorityOptions" :key="p.value" @click="togglePriority(p.value)" :class="[
                        'px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors',
                        activePriorities.includes(p.value) ? p.activeClass : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                    ]">{{ p.label }}</button>
                </div>

                <!-- Tag filter -->
                <select v-if="store.allTags.length" v-model="activeTag"
                    class="px-2.5 py-1.5 rounded-md text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 focus:outline-none focus:border-zinc-500">
                    <option value="">All tags</option>
                    <option v-for="tag in store.allTags" :key="tag" :value="tag">{{ tag }}</option>
                </select>

                <!-- Clear filters -->
                <button v-if="hasFilters" @click="clearFilters"
                    class="px-2.5 py-1.5 rounded-md text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
                    <X :size="11" />
                    Clear
                </button>

                <span class="ml-auto text-xs text-zinc-600">{{ filteredTasks.length }} tasks</span>
            </div>
        </div>

        <!-- Task table -->
        <div class="flex-1 overflow-y-auto">
            <div v-if="isLoading" class="flex items-center justify-center py-20">
                <Loader2 :size="20" class="animate-spin text-zinc-500" />
            </div>

            <div v-else-if="filteredTasks.length === 0"
                class="flex flex-col items-center justify-center py-20 text-zinc-600">
                <Inbox :size="36" class="mb-3 opacity-50" />
                <p class="text-sm">{{ hasFilters ? 'No tasks match your filters' : 'No tasks yet' }}</p>
            </div>

            <div v-else class="divide-y divide-zinc-800">
                <div v-for="task in filteredTasks" :key="task.id"
                    :class="['group flex items-center gap-4 px-6 py-3.5 transition-colors cursor-pointer border-l-2', rowClass(task)]"
                    @click="openQuickView(task)">
                    <!-- Priority bar -->
                    <div :class="['w-1 h-8 rounded-full flex-shrink-0', priorityBar(task.priority)]" />

                    <!-- Title + tags -->
                    <div class="flex-1 min-w-0">
                        <p :class="['text-sm font-medium', rowTitleClass(task)]">
                            {{ task.title }}
                        </p>
                        <div class="flex items-center gap-2 mt-0.5">
                            <span v-if="task.description" :class="['text-xs truncate max-w-xs', rowDescClass(task)]">{{
                                task.description }}</span>
                            <div class="flex gap-1">
                                <span v-for="tag in task.tags" :key="tag"
                                    :class="['text-xs px-1.5 py-0.5 rounded border', rowTagClass(task)]">{{ tag
                                    }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Status pill -->
                    <span
                        :class="['flex-shrink-0 text-xs px-2.5 py-1 rounded-md border font-medium', statusPill(task)]">
                        {{ statusLabel(task) }}
                    </span>

                    <!-- Created date -->
                    <span
                        :class="['text-xs flex-shrink-0 w-24 text-right hidden sm:block', task.status === 'completed' ? 'text-emerald-700' : task.status === 'archived' ? 'text-zinc-700' : 'text-zinc-600']">
                        {{ formatDate(task.createdAt) }}
                    </span>

                    <!-- Actions -->
                    <div
                        class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button v-if="task.status === 'queue'" @click.stop="store.addTaskToDay(task.id)"
                            class="p-1.5 rounded text-zinc-500 hover:text-emerald-400 hover:bg-zinc-700 transition-colors"
                            title="Add to today">
                            <Plus :size="13" />
                        </button>
                        <button @click.stop="$router.push({ name: 'personal-todo-task', params: { id: task.id } })"
                            class="p-1.5 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
                            title="View history">
                            <History :size="13" />
                        </button>
                        <button @click.stop="openEdit(task)"
                            class="p-1.5 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 transition-colors">
                            <Pencil :size="13" />
                        </button>
                        <button @click.stop="store.deleteTask(task.id)"
                            class="p-1.5 rounded text-zinc-500 hover:text-rose-400 hover:bg-zinc-700 transition-colors">
                            <Trash2 :size="13" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick view -->
        <GoblinTaskQuickView v-model="quickViewOpen" :task="quickViewTask" :day-task="null"
            :day-task-count="quickViewDayCount" :rolled-count="quickViewRolledCount" :linked-today-blocks="[]"
            @view-lifetime="$router.push({ name: 'personal-todo-task', params: { id: $event } }); quickViewOpen = false"
            @edit="openEdit($event); quickViewOpen = false" @complete="store.completeTask($event)"
            @uncomplete="store.uncompleteTask($event)"
            @save-notes="store.updateTask($event.taskId, { notes: $event.notes })" />

        <!-- Edit/add modal -->
        <GoblinAddTaskModal v-model="taskModal" :edit-task="editingTask" :all-tags="store.allTags"
            @submit="onTaskSubmit" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ListTodo, Plus, Search, X, Inbox, Loader2, History, Pencil, Trash2 } from 'lucide-vue-next'
import { useGoblinTodoStore } from '@/stores/useGoblinTodoStore'
import GoblinTodoNav from '@/components/personal/todo/GoblinTodoNav.vue'
import GoblinTaskQuickView from '@/components/personal/todo/GoblinTaskQuickView.vue'
import GoblinAddTaskModal from '@/components/personal/todo/GoblinAddTaskModal.vue'

const store = useGoblinTodoStore()
const router = useRouter()

const isLoading = ref(false)
const search = ref('')
const activeStatuses = ref([])
const activePriorities = ref([])
const activeTag = ref('')
const taskModal = ref(false)
const editingTask = ref(null)
const quickViewOpen = ref(false)
const quickViewTask = ref(null)
const quickViewDayCount = ref(0)
const quickViewRolledCount = ref(0)

const statusOptions = [
    { value: 'queue', label: 'Queue', activeClass: 'bg-zinc-700 border-zinc-500 text-zinc-200' },
    { value: 'active', label: 'Active', activeClass: 'bg-emerald-950 border-emerald-700 text-emerald-300' },
    { value: 'completed', label: 'Completed', activeClass: 'bg-zinc-800 border-zinc-500 text-zinc-300' },
]

const priorityOptions = [
    { value: 'high', label: '↑ High', activeClass: 'bg-rose-950 border-rose-700 text-rose-300' },
    { value: 'medium', label: '— Med', activeClass: 'bg-amber-950 border-amber-700 text-amber-300' },
    { value: 'low', label: '↓ Low', activeClass: 'bg-zinc-700 border-zinc-500 text-zinc-300' },
]

onMounted(async () => {
    if (!store.isInitialized) {
        isLoading.value = true
        await store.init()
        isLoading.value = false
    }
})

const allTasks = computed(() => Object.values(store.tasks))

const queueCount = computed(() => allTasks.value.filter(t => t.status === 'queue').length)
const activeCount = computed(() => allTasks.value.filter(t => t.status === 'active').length)
const completedCount = computed(() => allTasks.value.filter(t => t.status === 'completed').length)

const hasFilters = computed(() =>
    search.value || activeStatuses.value.length || activePriorities.value.length || activeTag.value
)

const filteredTasks = computed(() => {
    let tasks = allTasks.value

    if (search.value.trim()) {
        const q = search.value.toLowerCase()
        tasks = tasks.filter(t =>
            t.title.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q) ||
            t.tags?.some(tag => tag.toLowerCase().includes(q))
        )
    }
    if (activeStatuses.value.length) {
        tasks = tasks.filter(t => activeStatuses.value.includes(t.status))
    }
    if (activePriorities.value.length) {
        tasks = tasks.filter(t => activePriorities.value.includes(t.priority))
    }
    if (activeTag.value) {
        tasks = tasks.filter(t => t.tags?.includes(activeTag.value))
    }

    // Sort: queue first, then active, then completed; within each group by priority
    const statusOrder = { queue: 0, active: 1, completed: 2 }
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return tasks.sort((a, b) => {
        const sd = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0)
        if (sd !== 0) return sd
        return (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1)
    })
})

const toggleStatus = (v) => { const i = activeStatuses.value.indexOf(v); i === -1 ? activeStatuses.value.push(v) : activeStatuses.value.splice(i, 1) }
const togglePriority = (v) => { const i = activePriorities.value.indexOf(v); i === -1 ? activePriorities.value.push(v) : activePriorities.value.splice(i, 1) }
const clearFilters = () => { search.value = ''; activeStatuses.value = []; activePriorities.value = []; activeTag.value = '' }

const priorityBar = (p) => ({ high: 'bg-rose-500', medium: 'bg-amber-400', low: 'bg-zinc-600' }[p] ?? 'bg-zinc-600')

// Colour logic per task
const isOverdue = (task) => {
    if (task.status === 'completed' || task.status === 'archived') return false
    if (!task.dueDate) return false
    return new Date(task.dueDate) < new Date()
}

const rowClass = (task) => {
    if (task.status === 'completed') return 'bg-emerald-950/20 hover:bg-emerald-950/30 border-emerald-800/60'
    if (task.status === 'archived') return 'bg-zinc-800/30 hover:bg-zinc-800/50 border-zinc-700/40 opacity-60'
    if (isOverdue(task)) return 'bg-rose-950/25 hover:bg-rose-950/35 border-rose-800/60'
    if (task.status === 'active') return 'bg-blue-950/20 hover:bg-blue-950/30 border-blue-800/50'
    return 'bg-zinc-900 hover:bg-zinc-800/60 border-transparent'
}

const rowTitleClass = (task) => {
    if (task.status === 'completed') return 'line-through text-emerald-600'
    if (task.status === 'archived') return 'line-through text-zinc-600'
    if (isOverdue(task)) return 'text-rose-300'
    if (task.status === 'active') return 'text-blue-200'
    return 'text-zinc-100'
}

const rowDescClass = (task) => {
    if (task.status === 'completed') return 'text-emerald-800'
    if (task.status === 'archived') return 'text-zinc-700'
    if (isOverdue(task)) return 'text-rose-800'
    return 'text-zinc-500'
}

const rowTagClass = (task) => {
    if (task.status === 'completed') return 'bg-emerald-950/40 border-emerald-800/40 text-emerald-700'
    if (task.status === 'archived') return 'bg-zinc-800 border-zinc-700 text-zinc-600'
    if (isOverdue(task)) return 'bg-rose-950/40 border-rose-800/40 text-rose-700'
    if (task.status === 'active') return 'bg-blue-950/40 border-blue-800/40 text-blue-600'
    return 'bg-zinc-700 border-zinc-600 text-zinc-400'
}

const statusLabel = (task) => {
    if (task.status === 'completed') return 'Done ✓'
    if (task.status === 'archived') return 'Archived'
    if (isOverdue(task)) return 'Overdue'
    if (task.status === 'active') return 'In progress'
    return 'Queue'
}

const statusPill = (task) => {
    if (task.status === 'completed') return 'bg-emerald-950/60 border-emerald-700/60 text-emerald-400'
    if (task.status === 'archived') return 'bg-zinc-800/60 border-zinc-700 text-zinc-600'
    if (isOverdue(task)) return 'bg-rose-950/60 border-rose-700/60 text-rose-400'
    if (task.status === 'active') return 'bg-blue-950/60 border-blue-700/60 text-blue-400'
    return 'bg-zinc-800 border-zinc-600 text-zinc-400'
}

const formatDate = (ts) => {
    if (!ts) return ''
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

const openQuickView = async (task) => {
    quickViewTask.value = task
    quickViewOpen.value = true
    const lifetime = await store.loadTaskLifetime(task.id)
    if (lifetime) {
        quickViewDayCount.value = lifetime.dayTasks.length
        quickViewRolledCount.value = lifetime.events.filter(e => e.type === 'rolled_back').length
    }
}

const openEdit = (task) => {
    editingTask.value = task
    taskModal.value = true
}

const onTaskSubmit = async ({ id, title, description, priority, tags, addToDay }) => {
    if (id) {
        await store.updateTask(id, { title, description, priority, tags })
    } else {
        const newId = await store.addTask({ title, description, priority, tags })
        if (addToDay) await store.addTaskToDay(newId)
    }
}
</script>