<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('update:modelValue', false)">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div class="relative w-full max-w-sm bg-zinc-800 border border-zinc-600 rounded-xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
            <span class="text-sm font-semibold text-zinc-100">Link to task</span>
            <button @click="$emit('update:modelValue', false)" class="text-zinc-400 hover:text-zinc-100">
              <X :size="15" />
            </button>
          </div>

          <div class="p-3">
            <input v-model="search" ref="searchInput" type="text" placeholder="Search tasks..."
              class="w-full px-3 py-2 rounded-lg text-sm bg-zinc-700 border border-zinc-600 text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 mb-3" />

            <!-- Create from block content -->
            <button v-if="blockContent" @click="createFromBlock"
              class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm border border-dashed border-emerald-700/60 bg-emerald-950/30 hover:bg-emerald-950/50 text-emerald-400 transition-colors mb-3 text-left">
              <Plus :size="14" class="flex-shrink-0" />
              <span class="flex-1 min-w-0">
                <span class="font-medium">Create task from this block</span>
                <span class="block text-xs text-emerald-600 truncate mt-0.5">"{{ blockContent }}"</span>
              </span>
            </button>

            <!-- Existing tasks -->
            <div class="space-y-1 max-h-56 overflow-y-auto">
              <button v-for="task in filtered" :key="task.id" @click="select(task.id)"
                class="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-zinc-700 transition-colors">
                <div class="flex items-center gap-2">
                  <span :class="['w-2 h-2 rounded-full flex-shrink-0', priorityDot(task.priority)]" />
                  <span class="text-zinc-200 truncate">{{ task.title }}</span>
                  <span v-if="task.status === 'active'"
                    class="ml-auto text-xs text-emerald-500 flex-shrink-0">today</span>
                </div>
              </button>
              <div v-if="!filtered.length" class="text-center py-4 text-zinc-600 text-sm">No tasks found</div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { X, Plus } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  tasks: { type: Object, default: () => ({}) },
  blockContent: { type: String, default: '' }, // content of the block being linked
})

const emit = defineEmits(['update:modelValue', 'select', 'create-and-link'])

const search = ref('')
const searchInput = ref(null)

watch(() => props.modelValue, (open) => {
  if (open) {
    search.value = ''
    nextTick(() => searchInput.value?.focus())
  }
})

const filtered = computed(() => {
  const all = Object.values(props.tasks).filter(t => t.status !== 'completed')
  const q = search.value.toLowerCase()
  return q ? all.filter(t => t.title.toLowerCase().includes(q)) : all
})

const priorityDot = (p) => ({
  high: 'bg-rose-500', medium: 'bg-amber-500', low: 'bg-zinc-600'
}[p] ?? 'bg-zinc-600')

const select = (taskId) => {
  emit('select', taskId)
  emit('update:modelValue', false)
}

const createFromBlock = () => {
  emit('create-and-link', props.blockContent)
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>