<template>
  <div class="flex flex-col h-full">
    <!-- Filters -->
    <div class="px-3 py-2 border-b border-zinc-800 space-y-2 flex-shrink-0">
      <!-- Search -->
      <div class="relative">
        <Search :size="13" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input v-model="search" type="text" placeholder="Search tasks..."
          class="w-full pl-8 pr-3 py-1.5 rounded-md text-xs bg-zinc-700 border border-zinc-600 text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-zinc-600 transition-colors" />
      </div>

      <!-- Priority filter -->
      <div class="flex gap-1">
        <button v-for="p in priorities" :key="p.value" @click="togglePriority(p.value)" :class="[
          'flex-1 py-1 rounded text-xs transition-colors border',
          activePriorities.includes(p.value)
            ? p.activeClass
            : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-zinc-300'
        ]">
          {{ p.label }}
        </button>
      </div>

      <!-- Permanent tag filter -->
      <div v-if="permanentTags.length" class="flex flex-wrap gap-1">
        <button v-for="tag in permanentTags" :key="tag" @click="toggleTag(tag)" :class="[
          'px-2 py-0.5 rounded text-xs transition-colors border',
          activeTag === tag
            ? 'bg-zinc-600 border-zinc-500 text-zinc-100'
            : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-zinc-300'
        ]">
          {{ tag }}
        </button>
      </div>
      <!-- Show all toggle -->
      <label class="flex items-center gap-2 cursor-pointer select-none px-0.5">
        <div @click="showAll = !showAll" :class="[
          'w-8 h-4 rounded-full border transition-colors flex-shrink-0 relative',
          showAll ? 'bg-emerald-700 border-emerald-600' : 'bg-zinc-700 border-zinc-600'
        ]">
          <div :class="[
            'absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform shadow-sm',
            showAll ? 'translate-x-4' : 'translate-x-0.5'
          ]" />
        </div>
        <span class="text-xs text-zinc-400">Show all tasks</span>
      </label>
    </div>

    <!-- Task list -->
    <div class="flex-1 overflow-y-auto p-3 space-y-2">
      <TransitionGroup name="task-list">
        <GoblinTaskCard v-for="task in filteredQueue" :key="task.id" :task="task" :show-add-to-day="true"
          @add-to-day="$emit('add-to-day', $event)" @edit="$emit('edit-task', $event)"
          @delete="$emit('delete-task', $event)" @view-lifetime="$emit('view-lifetime', $event)" />
      </TransitionGroup>

      <div v-if="filteredQueue.length === 0" class="text-center py-8 text-zinc-400 text-sm">
        <Inbox :size="32" class="mx-auto mb-2 opacity-40" />
        <p>{{ search || activeTag ? 'No matching tasks' : showAll ? 'No tasks yet' : 'Queue is empty' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, Search, Layers, Inbox } from 'lucide-vue-next'
import GoblinTaskCard from './GoblinTaskCard.vue'

const props = defineProps({
  queue: { type: Array, default: () => [] }, // only queue-status tasks
  allTasks: { type: Array, default: () => [] }, // every task including active/completed
  allTags: { type: Array, default: () => [] },
  permanentTags: { type: Array, default: () => [] },
})

defineEmits(['add-task', 'add-to-day', 'edit-task', 'delete-task', 'view-lifetime'])

const search = ref('')
const activePriorities = ref([])
const activeTag = ref(null)
const showAll = ref(false)

const priorities = [
  { value: 'high', label: '↑ High', activeClass: 'bg-rose-950 border-rose-800 text-rose-400' },
  { value: 'medium', label: '— Med', activeClass: 'bg-amber-950 border-amber-800 text-amber-400' },
  { value: 'low', label: '↓ Low', activeClass: 'bg-zinc-700 border-zinc-600 text-zinc-300' },
]

const togglePriority = (p) => {
  const idx = activePriorities.value.indexOf(p)
  if (idx === -1) activePriorities.value.push(p)
  else activePriorities.value.splice(idx, 1)
}

const toggleTag = (tag) => {
  activeTag.value = activeTag.value === tag ? null : tag
}

const filteredQueue = computed(() => {
  let tasks = showAll.value ? props.allTasks : props.queue

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    tasks = tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.tags?.some(tag => tag.toLowerCase().includes(q))
    )
  }

  if (activePriorities.value.length) {
    tasks = tasks.filter(t => activePriorities.value.includes(t.priority))
  }

  if (activeTag.value) {
    tasks = tasks.filter(t => t.tags?.includes(activeTag.value))
  }

  return tasks
})
</script>

<style scoped>
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.2s ease;
}

.task-list-enter-from {
  opacity: 0;
  transform: translateX(8px);
}

.task-list-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>