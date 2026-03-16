<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
    <GoblinTodoNav />

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center flex-1 py-20">
      <Loader2 :size="20" class="animate-spin text-zinc-500" />
    </div>

    <div v-else-if="!dayData" class="flex items-center justify-center flex-1 py-20">
      <div class="text-center text-zinc-600">
        <CalendarX :size="40" class="mx-auto mb-3 opacity-40" />
        <p class="text-sm">No data for this day</p>
        <router-link :to="{ name: 'personal-todo' }"
          class="mt-3 inline-block text-xs text-emerald-500 hover:text-emerald-400">
          ← Back to today
        </router-link>
      </div>
    </div>

    <div v-else class="max-w-3xl mx-auto w-full px-6 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <router-link :to="{ name: 'personal-todo' }" class="text-zinc-600 hover:text-zinc-300 transition-colors">
            <ArrowLeft :size="18" />
          </router-link>
          <div>
            <h1 class="text-lg font-semibold text-zinc-100">{{ formattedDate }}</h1>
            <p class="text-xs text-zinc-500 mt-0.5">
              {{ completedCount }} / {{ dayData.dayTasks.length }} tasks completed
              <span v-if="rolledCount" class="text-amber-500 ml-2">· {{ rolledCount }} rolled</span>
            </p>
          </div>
        </div>

        <!-- Day navigation -->
        <div class="flex items-center gap-2">
          <router-link v-if="prevDay" :to="{ name: 'personal-todo-day', params: { date: prevDay } }"
            class="p-2 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
            title="Previous day">
            <ChevronLeft :size="16" />
          </router-link>
          <button @click="showDayPicker = !showDayPicker"
            class="px-3 py-1.5 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800 transition-colors flex items-center gap-1.5">
            <Calendar :size="13" />
            Browse days
          </button>
          <router-link v-if="nextDay" :to="{ name: 'personal-todo-day', params: { date: nextDay } }"
            class="p-2 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
            title="Next day">
            <ChevronRight :size="16" />
          </router-link>
        </div>
      </div>

      <!-- Day picker dropdown -->
      <div v-if="showDayPicker" class="mb-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <p class="text-xs text-zinc-500 mb-3 font-medium">All days</p>
        <div class="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          <router-link v-for="day in allDays" :key="day.id"
            :to="{ name: 'personal-todo-day', params: { date: day.id } }" @click="showDayPicker = false" :class="[
              'px-3 py-2 rounded-lg text-xs text-center transition-colors border',
              day.id === route.params.date
                ? 'bg-zinc-700 border-zinc-600 text-zinc-100'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'
            ]">
            {{ formatShortDate(day.id) }}
            <span v-if="!day.closed" class="block text-emerald-500 text-xs">open</span>
          </router-link>
        </div>
      </div>

      <!-- Task summary -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-3">
          <CheckSquare :size="14" class="text-zinc-500" />
          <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tasks</span>
        </div>

        <div v-if="dayData.dayTasks.length" class="space-y-2">
          <div v-for="dt in dayData.dayTasks" :key="dt.id" :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg border',
            dt.status === 'completed' ? 'bg-zinc-900/40 border-zinc-800/50' :
              dt.status === 'rolled' ? 'bg-zinc-900/30 border-zinc-800/40' :
                'bg-zinc-900 border-zinc-800'
          ]">
            <!-- Status icon -->
            <div :class="['flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center',
              dt.status === 'completed' ? 'bg-emerald-600 border-emerald-600' :
                dt.status === 'rolled' ? 'border-amber-700 bg-transparent' :
                  'border-zinc-600']">
              <Check v-if="dt.status === 'completed'" :size="10" class="text-white" />
              <RotateCcw v-else-if="dt.status === 'rolled'" :size="9" class="text-amber-600" />
            </div>

            <span
              :class="['flex-1 text-sm', dt.status === 'completed' ? 'line-through text-zinc-600' : dt.status === 'rolled' ? 'text-zinc-500' : 'text-zinc-200']">
              {{ dt.task?.title ?? '(deleted task)' }}
            </span>

            <div class="flex items-center gap-2">
              <span v-if="dt.status === 'rolled'"
                class="text-xs text-amber-600 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-900">rolled</span>

              <router-link v-if="dt.task" :to="{ name: 'personal-todo-task', params: { id: dt.taskId } }"
                class="text-zinc-600 hover:text-zinc-400 transition-colors" title="View task history">
                <History :size="13" />
              </router-link>
            </div>
          </div>
        </div>

        <p v-else class="text-sm text-zinc-700">No tasks were on the plate this day.</p>
      </div>

      <!-- Block editor (editable even for past days) -->
      <div>
        <div class="flex items-center gap-2 mb-4">
          <FileText :size="14" class="text-zinc-500" />
          <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Notes</span>
        </div>

        <GoblinBlockEditor ref="blockEditor" :blocks="dayData.blocks" :tasks="store.tasks" :day-id="route.params.date"
          :readonly="false" @add-block="onAddBlock" @update-block="onUpdateBlock" @delete-block="onDeleteBlock"
          @reorder-blocks="onReorderBlocks" @link-task="pendingLinkBlock = $event; linkModal = true"
          @navigate-task="$router.push({ name: 'personal-todo-task', params: { id: $event } })" />
      </div>
    </div>

    <!-- Link task modal -->
    <GoblinLinkTaskModal v-model="linkModal" :tasks="store.tasks" @select="onLinkTask" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, CalendarX, Calendar, ChevronLeft, ChevronRight,
  CheckSquare, Check, RotateCcw, FileText, History, Loader2
} from 'lucide-vue-next'
import { useGoblinTodoStore } from '@/features/personal/stores/useGoblinTodoStore'
import GoblinBlockEditor from '@/features/personal/components/todo/GoblinBlockEditor.vue'
import GoblinTodoNav from '@/features/personal/components/todo/GoblinTodoNav.vue'
import GoblinLinkTaskModal from '@/features/personal/components/todo/GoblinLinkTaskModal.vue'

const store = useGoblinTodoStore()
const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const dayData = ref(null)
const allDays = ref([])
const showDayPicker = ref(false)
const linkModal = ref(false)
const pendingLinkBlock = ref(null)
const blockEditor = ref(null)

// ─── Load data ────────────────────────────────────────────────────────────────
const load = async () => {
  isLoading.value = true
  dayData.value = null

  // Ensure store is initialized (tasks might be needed for enrichment)
  if (!store.isInitialized) await store.init()

  const [data, days] = await Promise.all([
    store.loadDay(route.params.date),
    store.loadDaysList()
  ])

  dayData.value = data
  allDays.value = days
  isLoading.value = false
}

onMounted(load)
watch(() => route.params.date, load)

// ─── Computed ─────────────────────────────────────────────────────────────────
const formattedDate = computed(() => {
  const dateStr = route.params.date
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

const completedCount = computed(() => dayData.value?.dayTasks.filter(dt => dt.status === 'completed').length ?? 0)
const rolledCount = computed(() => dayData.value?.dayTasks.filter(dt => dt.status === 'rolled').length ?? 0)

const currentIndex = computed(() => allDays.value.findIndex(d => d.id === route.params.date))
const prevDay = computed(() => allDays.value[currentIndex.value + 1]?.id ?? null) // allDays is desc order
const nextDay = computed(() => {
  const next = allDays.value[currentIndex.value - 1]?.id ?? null
  return next === store.todayId ? null : next // don't navigate to today (use main view)
})

const formatShortDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

// ─── Block handlers ───────────────────────────────────────────────────────────
const onAddBlock = async ({ type, content, order, tempId, dayId }) => {
  const realId = await store.addBlock({ type, content, order }, dayId)
  blockEditor.value?.resolveTemp(tempId, realId)
}

const onUpdateBlock = ({ blockId, updates, dayId }) => {
  store.updateBlock(blockId, updates, dayId)
}

const onDeleteBlock = ({ blockId, dayId }) => {
  store.deleteBlock(blockId, dayId)
}

const onReorderBlocks = ({ reordered, dayId }) => {
  reordered.forEach(({ blockId, order }) => store.updateBlock(blockId, { order }, dayId))
}

const onLinkTask = async (taskId) => {
  if (!pendingLinkBlock.value) return
  const block = pendingLinkBlock.value
  const dayId = route.params.date
  if (block.id && !block.id.startsWith('temp_')) {
    await store.updateBlock(block.id, { taskRef: taskId }, dayId)
  }
  block.taskRef = taskId
  pendingLinkBlock.value = null
}
</script>