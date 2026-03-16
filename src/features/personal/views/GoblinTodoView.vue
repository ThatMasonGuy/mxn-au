<template>
  <div class="personal-todo min-h-screen bg-zinc-900 text-zinc-100">
    <!-- Loading -->
    <div v-if="store.isLoading" class="flex items-center justify-center min-h-screen">
      <div class="flex items-center gap-3 text-zinc-400">
        <Loader2 :size="20" class="animate-spin" />
        <span class="text-sm">Loading your day...</span>
      </div>
    </div>

    <div v-else class="flex h-screen overflow-hidden">
      <!-- ── Left: Today ─────────────────────────────────────────────────── -->
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">

        <!-- Nav -->
        <GoblinTodoNav />

        <!-- Today header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-zinc-700 flex-shrink-0 bg-zinc-900">
          <div>
            <div class="flex items-center gap-2.5">
              <CalendarDays :size="16" class="text-emerald-400" />
              <h1 class="text-sm font-semibold text-zinc-100">{{ formattedDate }}</h1>
              <span
                class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 font-medium tracking-wide">Today</span>
            </div>
            <p class="text-xs text-zinc-400 mt-1">
              {{store.todayActiveTasks.filter(t => t.status === 'completed').length}} /
              {{ store.todayActiveTasks.length }} tasks done
            </p>
          </div>

          <div class="flex items-center gap-2">
            <router-link v-if="hasPastDays" :to="{ name: 'personal-todo-day', params: { date: previousDayId } }"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700 border border-zinc-600 transition-colors">
              <ChevronLeft :size="13" />
              Yesterday
            </router-link>
          </div>
        </div>

        <!-- Onboarding banner -->
        <GoblinOnboarding v-if="showOnboarding" :tasks="store.tasks" :today-tasks="store.todayActiveTasks"
          :today-blocks="store.todayBlocks" @add-first-task="taskModal = true; editingTask = null"
          @dismiss="dismissOnboarding" />

        <!-- Scrollable content -->
        <div class="flex-1 overflow-y-auto">

          <!-- On your plate -->
          <div class="px-6 py-5 pr-16 border-b border-zinc-700">
            <div class="flex items-center gap-2 mb-4">
              <CheckSquare :size="14" class="text-zinc-400" />
              <span class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">On your plate</span>
              <span v-if="store.todayActiveTasks.length"
                class="text-xs px-1.5 py-0.5 rounded-full bg-zinc-700 text-zinc-400">
                {{ store.todayActiveTasks.length }}
              </span>
            </div>

            <div v-if="store.todayActiveTasks.length" class="space-y-2">
              <TransitionGroup name="task-list">
                <div v-for="dt in store.todayActiveTasks" :key="dt.id" :class="[
                  'group flex items-center gap-3 px-4 py-3 pr-6 rounded-lg border transition-all cursor-pointer',
                  dt.status === 'completed'
                    ? 'bg-zinc-800/50 border-zinc-700/60'
                    : 'bg-zinc-800 border-zinc-600 hover:border-zinc-500'
                ]" @click.self="openQuickView(dt)">
                  <!-- Complete checkbox -->
                  <button @click.stop="toggleComplete(dt)" :class="[
                    'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                    dt.status === 'completed'
                      ? 'bg-emerald-600 border-emerald-600'
                      : 'border-zinc-500 hover:border-emerald-400'
                  ]">
                    <Check v-if="dt.status === 'completed'" :size="11" class="text-white" />
                  </button>

                  <!-- Task info -->
                  <div class="flex-1 min-w-0" @click="openQuickView(dt)">
                    <span
                      :class="['text-sm font-medium', dt.status === 'completed' ? 'line-through text-zinc-500' : 'text-zinc-100']">
                      {{ dt.task?.title }}
                    </span>
                    <div v-if="dt.task?.tags?.length" class="flex gap-1.5 mt-1">
                      <span v-for="tag in dt.task.tags" :key="tag"
                        class="text-xs text-zinc-400 bg-zinc-700 px-1.5 py-0.5 rounded border border-zinc-600">{{ tag
                        }}</span>
                    </div>
                  </div>

                  <!-- Status badge -->
                  <GoblinStatusBadge :task-status="dt.taskStatus ?? 'unstarted'" :all-statuses="store.allStatuses"
                    @update="updateDayTaskStatus(dt.taskId, $event)" />

                  <!-- Priority pip -->
                  <span :class="['w-2 h-2 rounded-full flex-shrink-0', priorityDot(dt.task?.priority)]" />

                  <!-- Row actions (visible on hover) -->
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                    <button @click.stop="openQuickView(dt)"
                      class="p-1.5 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
                      title="Quick view">
                      <PanelRight :size="13" />
                    </button>
                    <button v-if="dt.status !== 'completed'" @click.stop="store.removeTaskFromDay(dt.taskId)"
                      class="p-1.5 rounded text-zinc-500 hover:text-amber-400 hover:bg-zinc-700 transition-colors"
                      title="Return to queue">
                      <ArrowLeft :size="13" />
                    </button>
                  </div>
                </div>
              </TransitionGroup>
            </div>

            <div v-else class="flex items-center gap-2 py-1 text-sm text-zinc-500">
              <span>Nothing on your plate yet.</span>
              <button @click="queueVisible = true"
                class="text-emerald-400 hover:text-emerald-300 underline transition-colors">
                Pull from queue →
              </button>
            </div>
          </div>

          <!-- Block editor -->
          <div class="px-6 py-5">
            <div class="flex items-center gap-2 mb-4">
              <FileText :size="14" class="text-zinc-400" />
              <span class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Today's notes</span>
            </div>

            <GoblinBlockEditor ref="blockEditor" :blocks="store.todayBlocks" :tasks="store.tasks"
              @add-block="onAddBlock" @update-block="onUpdateBlock" @delete-block="onDeleteBlock"
              @reorder-blocks="onReorderBlocks" @link-task="pendingLinkBlock = $event; linkModal = true"
              @navigate-task="$router.push({ name: 'personal-todo-task', params: { id: $event } })" />
          </div>
        </div>
      </div>

      <!-- ── Right: Queue ────────────────────────────────────────────────── -->
      <Transition name="queue-slide">
        <div v-show="queueVisible" class="w-80 flex-shrink-0 border-l border-zinc-700 flex flex-col overflow-hidden"
          style="background: #1c1c1c;">
          <!-- Queue header -->
          <div class="flex items-center justify-between px-4 py-4 border-b border-zinc-700 flex-shrink-0">
            <div class="flex items-center gap-2">
              <Layers :size="15" class="text-zinc-300" />
              <span class="text-sm font-semibold text-zinc-100">Queue</span>
              <span class="text-xs px-1.5 py-0.5 rounded-full bg-zinc-700 text-zinc-300 border border-zinc-600">
                {{ store.queue.length }}
              </span>
            </div>
            <button @click="taskModal = true; editingTask = null"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm">
              <Plus :size="13" />
              New task
            </button>
          </div>

          <GoblinQueuePanel :queue="store.queue" :all-tasks="Object.values(store.tasks)" :all-tags="store.allTags"
            :permanent-tags="store.permanentTags" @add-task="taskModal = true; editingTask = null"
            @add-to-day="store.addTaskToDay($event)" @edit-task="openEditTask" @delete-task="store.deleteTask($event)"
            @view-lifetime="$router.push({ name: 'personal-todo-task', params: { id: $event } })" />
        </div>
      </Transition>

      <!-- Queue toggle tab -->
      <button @click="queueVisible = !queueVisible"
        class="fixed top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-7 h-16 rounded-l-lg border border-r-0 border-zinc-600 bg-zinc-700 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-600 transition-all shadow-md"
        :style="queueVisible ? 'right: 320px;' : 'right: 0px;'" :title="queueVisible ? 'Hide queue' : 'Show queue'">
        <ChevronRight v-if="queueVisible" :size="14" />
        <ChevronLeft v-else :size="14" />
      </button>
    </div>

    <!-- Task quick view -->
    <GoblinTaskQuickView v-model="quickViewOpen" :task="quickViewTask" :day-task="quickViewDayTask"
      :day-task-count="quickViewDayCount" :rolled-count="quickViewRolledCount"
      :linked-today-blocks="quickViewLinkedBlocks"
      @view-lifetime="$router.push({ name: 'personal-todo-task', params: { id: $event } }); quickViewOpen = false"
      @edit="openEditTask($event); quickViewOpen = false" @complete="store.completeTask($event)"
      @uncomplete="store.uncompleteTask($event)"
      @save-notes="store.updateTask($event.taskId, { notes: $event.notes })" />

    <!-- Modals -->
    <GoblinAddTaskModal v-model="taskModal" :edit-task="editingTask" :all-tags="store.allTags" @submit="onTaskSubmit" />

    <GoblinLinkTaskModal v-model="linkModal" :tasks="store.tasks" :block-content="pendingLinkBlock?.content ?? ''"
      @select="onLinkTask" @create-and-link="onCreateAndLink" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  CalendarDays, CheckSquare, FileText, Check, ArrowLeft,
  History, ChevronLeft, ChevronRight, Layers, Loader2, Plus, PanelRight
} from 'lucide-vue-next'
import { useGoblinTodoStore } from '@/features/personal/stores/useGoblinTodoStore'
import GoblinBlockEditor from '@/features/personal/components/todo/GoblinBlockEditor.vue'
import GoblinQueuePanel from '@/features/personal/components/todo/GoblinQueuePanel.vue'
import GoblinAddTaskModal from '@/features/personal/components/todo/GoblinAddTaskModal.vue'
import GoblinLinkTaskModal from '@/features/personal/components/todo/GoblinLinkTaskModal.vue'
import GoblinOnboarding from '@/features/personal/components/todo/GoblinOnboarding.vue'
import GoblinTaskQuickView from '@/features/personal/components/todo/GoblinTaskQuickView.vue'
import GoblinStatusBadge from '@/features/personal/components/todo/GoblinStatusBadge.vue'
import GoblinTodoNav from '@/features/personal/components/todo/GoblinTodoNav.vue'

const store = useGoblinTodoStore()
const router = useRouter()

const queueVisible = ref(true)
const taskModal = ref(false)
const editingTask = ref(null)
const linkModal = ref(false)
const pendingLinkBlock = ref(null)
const blockEditor = ref(null)
const hasPastDays = ref(false)
const previousDayId = ref(null)
const showOnboarding = ref(false)

// Quick view
const quickViewOpen = ref(false)
const quickViewDayTask = ref(null)
const quickViewDayCount = ref(0)
const quickViewRolledCount = ref(0)

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  await store.init()

  const days = await store.loadDaysList()
  const pastDays = days.filter(d => d.id !== store.todayId)
  if (pastDays.length) {
    hasPastDays.value = true
    previousDayId.value = pastDays[0].id
  }

  // Show onboarding for brand new users (no tasks + not previously dismissed)
  const dismissed = localStorage.getItem('goblin-todo-onboarding-dismissed')
  const hasAnyTasks = Object.keys(store.tasks).length > 0
  if (!dismissed && !hasAnyTasks) {
    showOnboarding.value = true
  }
})

onUnmounted(() => store.cleanup())

// ─── Computed ─────────────────────────────────────────────────────────────────
const formattedDate = computed(() => {
  if (!store.todayId) return ''
  const d = new Date(store.todayId + 'T00:00:00')
  return d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

const priorityDot = (p) => ({
  high: 'bg-rose-500', medium: 'bg-amber-400', low: 'bg-zinc-500'
}[p] ?? 'bg-zinc-500')

// ─── Onboarding ───────────────────────────────────────────────────────────────
const dismissOnboarding = () => {
  showOnboarding.value = false
  localStorage.setItem('goblin-todo-onboarding-dismissed', '1')
}

// ─── Quick view ──────────────────────────────────────────────────────────────
const quickViewTask = computed(() =>
  quickViewDayTask.value ? store.tasks[quickViewDayTask.value.taskId] : null
)

const quickViewLinkedBlocks = computed(() =>
  quickViewDayTask.value
    ? store.todayBlocks.filter(b => b.taskRef === quickViewDayTask.value.taskId)
    : []
)

const openQuickView = async (dt) => {
  quickViewDayTask.value = dt
  quickViewOpen.value = true
  // Load lifetime counts in background
  const lifetime = await store.loadTaskLifetime(dt.taskId)
  if (lifetime) {
    quickViewDayCount.value = lifetime.dayTasks.length
    quickViewRolledCount.value = lifetime.events.filter(e => e.type === 'rolled_back').length
  }
}

// ─── Task actions ─────────────────────────────────────────────────────────────
const updateDayTaskStatus = (taskId, status) => {
  store.updateDayTaskStatus(taskId, status)
}

const toggleComplete = (dt) => {
  if (dt.status === 'completed') {
    store.uncompleteTask(dt.taskId)
    store.updateDayTaskStatus(dt.taskId, 'unstarted')
  } else {
    store.completeTask(dt.taskId)
    store.updateDayTaskStatus(dt.taskId, 'done')
  }
}

const openEditTask = (task) => {
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

// ─── Block actions ────────────────────────────────────────────────────────────
const onAddBlock = async ({ type, content, order, tempId }) => {
  const realId = await store.addBlock({ type, content, order })
  blockEditor.value?.resolveTemp(tempId, realId)
}

const onUpdateBlock = ({ blockId, updates }) => store.updateBlock(blockId, updates)
const onDeleteBlock = ({ blockId }) => store.deleteBlock(blockId)
const onReorderBlocks = ({ reordered }) => {
  reordered.forEach(({ blockId, order }) => store.updateBlock(blockId, { order }))
}

const onLinkTask = async (taskId) => {
  if (!pendingLinkBlock.value) return
  const block = pendingLinkBlock.value
  if (block.id && !block.id.startsWith('temp_')) {
    await store.updateBlock(block.id, { taskRef: taskId })
  }
  block.taskRef = taskId
  pendingLinkBlock.value = null
}

const onCreateAndLink = async (blockContent) => {
  if (!pendingLinkBlock.value) return
  const block = pendingLinkBlock.value
  // Create the task using the block content as the title
  const newTaskId = await store.addTask({
    title: blockContent.trim(),
    description: '',
    priority: 'medium',
    tags: [],
  })
  // Link the block to the newly created task
  if (block.id && !block.id.startsWith('temp_')) {
    await store.updateBlock(block.id, { taskRef: newTaskId })
  }
  block.taskRef = newTaskId
  pendingLinkBlock.value = null
}
</script>

<style scoped>
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.2s ease;
}

.task-list-enter-from {
  opacity: 0;
  transform: translateX(-6px);
}

.task-list-leave-to {
  opacity: 0;
  transform: translateX(6px);
}

.queue-slide-enter-active,
.queue-slide-leave-active {
  transition: all 0.25s ease;
}

.queue-slide-enter-from,
.queue-slide-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>