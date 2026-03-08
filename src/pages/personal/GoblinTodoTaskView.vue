<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
    <GoblinTodoNav />

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center flex-1 py-20">
      <Loader2 :size="20" class="animate-spin text-zinc-500" />
    </div>

    <div v-else-if="!data" class="flex items-center justify-center flex-1 py-20">
      <div class="text-center text-zinc-600">
        <Ghost :size="40" class="mx-auto mb-3 opacity-40" />
        <p class="text-sm">Task not found</p>
        <router-link :to="{ name: 'personal-todo' }"
          class="mt-3 inline-block text-xs text-emerald-500 hover:text-emerald-400">
          ← Back
        </router-link>
      </div>
    </div>

    <div v-else class="max-w-2xl mx-auto w-full px-6 py-8">
      <!-- Back -->
      <div class="mb-6">
        <button @click="$router.back()"
          class="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
          <ArrowLeft :size="16" />
          Back
        </button>
      </div>

      <!-- Task header -->
      <div class="mb-8 p-5 rounded-xl bg-zinc-900 border border-zinc-800">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <!-- Status indicator -->
            <div class="flex items-center gap-2 mb-2">
              <span :class="['w-2 h-2 rounded-full', statusDot]" />
              <span :class="['text-xs font-medium uppercase tracking-wider', statusText]">{{ data.task.status }}</span>
              <span class="text-zinc-700">·</span>
              <span :class="['text-xs font-medium', priorityText(data.task.priority)]">{{ data.task.priority }}
                priority</span>
            </div>

            <h1 class="text-xl font-semibold text-zinc-100 mb-1">{{ data.task.title }}</h1>

            <p v-if="data.task.description" class="text-sm text-zinc-400 mt-1">
              {{ data.task.description }}
            </p>

            <!-- Tags -->
            <div v-if="data.task.tags?.length" class="flex flex-wrap gap-1.5 mt-3">
              <span v-for="tag in data.task.tags" :key="tag"
                class="px-2 py-0.5 rounded-md text-xs bg-zinc-800 text-zinc-400 border border-zinc-700">{{ tag }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-2 flex-shrink-0">
            <button @click="editModal = true"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700 transition-colors">
              <Pencil :size="12" />
              Edit
            </button>

            <!-- Add to today (if in queue) -->
            <button v-if="data.task.status === 'queue'" @click="addToToday"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 transition-colors">
              <Plus :size="12" />
              Today
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex items-center gap-4 mt-4 pt-4 border-t border-zinc-800">
          <div class="text-center">
            <p class="text-lg font-bold text-zinc-200">{{ dayCount }}</p>
            <p class="text-xs text-zinc-600">days on plate</p>
          </div>
          <div class="text-center">
            <p class="text-lg font-bold text-zinc-200">{{ rolledCount }}</p>
            <p class="text-xs text-zinc-600">times rolled</p>
          </div>
          <div class="text-center">
            <p class="text-lg font-bold text-zinc-200">{{ linkedBlockCount }}</p>
            <p class="text-xs text-zinc-600">linked notes</p>
          </div>
          <div v-if="data.task.createdAt" class="ml-auto text-right">
            <p class="text-xs text-zinc-500">Created</p>
            <p class="text-xs text-zinc-400">{{ formatDate(data.task.createdAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <Clock :size="14" class="text-zinc-500" />
          <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Lifetime</span>
        </div>

        <div class="relative">
          <!-- Timeline line -->
          <div class="absolute left-3.5 top-0 bottom-0 w-px bg-zinc-800" />

          <div class="space-y-1">
            <div v-for="(event, i) in data.events" :key="event.id" class="flex items-start gap-4 relative">
              <!-- Dot -->
              <div
                :class="['relative z-10 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2 mt-0.5', eventStyle(event.type).dot]">
                <component :is="eventStyle(event.type).icon" :size="12" />
              </div>

              <!-- Content -->
              <div class="flex-1 pb-4">
                <div class="flex items-center gap-2">
                  <span :class="['text-sm font-medium', eventStyle(event.type).text]">
                    {{ eventLabel(event.type) }}
                  </span>
                  <span v-if="event.dayId" class="text-xs text-zinc-600">
                    on
                    <router-link :to="{ name: 'personal-todo-day', params: { date: event.dayId } }"
                      class="text-zinc-500 hover:text-zinc-300 underline transition-colors">{{
                      formatShortDate(event.dayId) }}</router-link>
                  </span>
                </div>
                <p v-if="event.timestamp" class="text-xs text-zinc-600 mt-0.5">
                  {{ formatDateTime(event.timestamp) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Days this task appeared -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <CalendarDays :size="14" class="text-zinc-500" />
          <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Days on plate</span>
          <span class="text-xs text-zinc-600">({{ data.dayTasks.length }})</span>
        </div>

        <div class="space-y-2">
          <router-link v-for="dt in data.dayTasks" :key="dt.id"
            :to="{ name: 'personal-todo-day', params: { date: dt.dayId } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors group">
            <div :class="['w-2 h-2 rounded-full flex-shrink-0', dayTaskStatusDot(dt.status)]" />
            <span class="text-sm text-zinc-300">{{ formatDate(dt.addedAt) }}</span>
            <span :class="['text-xs ml-auto', dayTaskStatusText(dt.status)]">{{ dt.status }}</span>
            <ChevronRight :size="14" class="text-zinc-700 group-hover:text-zinc-500 transition-colors" />
          </router-link>
        </div>
      </div>

      <!-- Linked notes -->
      <div v-if="data.linkedBlocks.length">
        <div class="flex items-center gap-2 mb-4">
          <Link2 :size="14" class="text-zinc-500" />
          <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Linked notes</span>
          <span class="text-xs text-zinc-600">({{ data.linkedBlocks.length }})</span>
        </div>

        <div class="space-y-3">
          <div v-for="block in data.linkedBlocks" :key="`${block.dayId}-${block.id}`"
            class="p-4 rounded-lg bg-zinc-900 border border-zinc-800 border-l-2 border-l-emerald-700">
            <p :class="getBlockClass(block.type)" class="whitespace-pre-wrap">{{ block.content }}</p>
            <div class="flex items-center gap-2 mt-2">
              <router-link :to="{ name: 'personal-todo-day', params: { date: block.dayId } }"
                class="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                {{ formatShortDate(block.dayId) }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit modal -->
    <GoblinAddTaskModal v-model="editModal" :edit-task="data?.task" :all-tags="store.allTags" @submit="onEditSubmit" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft, Ghost, Loader2, Clock, CalendarDays,
  ChevronRight, Link2, Pencil, Plus, Check, RotateCcw,
  Sparkles, Trash2, MinusCircle
} from 'lucide-vue-next'
import { useGoblinTodoStore } from '@/stores/useGoblinTodoStore'
import GoblinTodoNav from '@/components/personal/todo/GoblinTodoNav.vue'
import GoblinAddTaskModal from '@/components/personal/todo/GoblinAddTaskModal.vue'

const store = useGoblinTodoStore()
const route = useRoute()

const isLoading = ref(true)
const data = ref(null)
const editModal = ref(false)

// ─── Load ─────────────────────────────────────────────────────────────────────
const load = async () => {
  isLoading.value = true
  if (!store.isInitialized) await store.init()
  data.value = await store.loadTaskLifetime(route.params.id)
  isLoading.value = false
}

onMounted(load)
watch(() => route.params.id, load)

// ─── Computed ─────────────────────────────────────────────────────────────────
const dayCount = computed(() => data.value?.dayTasks.length ?? 0)
const rolledCount = computed(() => data.value?.events.filter(e => e.type === 'rolled_back').length ?? 0)
const linkedBlockCount = computed(() => data.value?.linkedBlocks.length ?? 0)

const statusDot = computed(() => ({
  queue: 'bg-zinc-600',
  active: 'bg-emerald-500',
  completed: 'bg-emerald-600',
}[data.value?.task.status] ?? 'bg-zinc-600'))

const statusText = computed(() => ({
  queue: 'text-zinc-500',
  active: 'text-emerald-400',
  completed: 'text-emerald-500',
}[data.value?.task.status] ?? 'text-zinc-500'))

// ─── Helpers ──────────────────────────────────────────────────────────────────
const priorityText = (p) => ({ high: 'text-rose-400', medium: 'text-amber-400', low: 'text-zinc-500' }[p] ?? 'text-zinc-500')

const dayTaskStatusDot = (s) => ({ active: 'bg-emerald-500', completed: 'bg-emerald-600', rolled: 'bg-amber-600' }[s] ?? 'bg-zinc-600')
const dayTaskStatusText = (s) => ({ active: 'text-emerald-500', completed: 'text-emerald-400', rolled: 'text-amber-500' }[s] ?? 'text-zinc-500')

const eventLabel = (type) => ({
  created: 'Task created',
  added_to_day: 'Added to day',
  completed: 'Completed',
  uncompleted: 'Marked incomplete',
  rolled_back: 'Rolled to queue',
  removed_from_day: 'Removed from day',
}[type] ?? type)

const eventStyle = (type) => {
  const styles = {
    created: { dot: 'border-zinc-600 bg-zinc-900 text-zinc-500', icon: Sparkles, text: 'text-zinc-400' },
    added_to_day: { dot: 'border-emerald-700 bg-emerald-950 text-emerald-500', icon: Plus, text: 'text-emerald-400' },
    completed: { dot: 'border-emerald-600 bg-emerald-900 text-emerald-400', icon: Check, text: 'text-emerald-300' },
    uncompleted: { dot: 'border-zinc-600 bg-zinc-900 text-zinc-500', icon: MinusCircle, text: 'text-zinc-400' },
    rolled_back: { dot: 'border-amber-700 bg-amber-950 text-amber-500', icon: RotateCcw, text: 'text-amber-400' },
    removed_from_day: { dot: 'border-zinc-700 bg-zinc-900 text-zinc-600', icon: Trash2, text: 'text-zinc-500' },
  }
  return styles[type] ?? styles.created
}

const getBlockClass = (type) => ({
  h1: 'text-xl font-bold text-zinc-100',
  h2: 'text-lg font-semibold text-zinc-100',
  h3: 'text-base font-semibold text-zinc-200',
  quote: 'text-sm text-zinc-400 italic',
  code: 'text-sm text-emerald-300 font-mono',
  bullet: 'text-sm text-zinc-200',
}[type] ?? 'text-sm text-zinc-200')

const formatDate = (ts) => {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatDateTime = (ts) => {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const formatShortDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

// ─── Actions ──────────────────────────────────────────────────────────────────
const addToToday = async () => {
  if (!store.isInitialized) await store.init()
  await store.addTaskToDay(route.params.id)
}

const onEditSubmit = async ({ id, title, description, priority, tags }) => {
  await store.updateTask(id, { title, description, priority, tags })
  // Refresh
  data.value = await store.loadTaskLifetime(route.params.id)
}
</script>