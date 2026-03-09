<template>
  <div :class="[
    'group rounded-lg border transition-all duration-150 cursor-pointer',
    'bg-zinc-800 hover:bg-zinc-750',
    priorityBorder,
    isActive ? 'border-l-emerald-500 opacity-60' : ''
  ]">
    <div class="p-3">
      <!-- Title row -->
      <div class="flex items-start gap-2">
        <div class="flex-1 min-w-0">
          <p :class="['text-sm font-medium truncate', isCompleted ? 'line-through text-zinc-500' : 'text-zinc-100']">
            {{ task.title }}
          </p>
          <p v-if="task.description" class="text-xs text-zinc-500 mt-0.5 line-clamp-2">
            {{ task.description }}
          </p>
        </div>

        <!-- Priority pip -->
        <span :class="['flex-shrink-0 w-2 h-2 rounded-full mt-1.5', priorityDot]" :title="task.priority" />
      </div>

      <!-- Tags -->
      <div v-if="task.tags?.length" class="flex flex-wrap gap-1 mt-2">
        <span v-for="tag in task.tags" :key="tag"
          class="px-1.5 py-0.5 rounded text-xs bg-zinc-700 text-zinc-300 border border-zinc-700">{{ tag }}</span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <!-- Add to today -->
        <button v-if="showAddToDay && !isActive && !isCompleted" @click.stop="$emit('add-to-day', task.id)"
          class="flex items-center gap-1 px-2 py-1 rounded text-xs bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 transition-colors"
          title="Add to today">
          <Plus :size="11" />
          Today
        </button>

        <!-- Remove from today -->
        <button v-if="showRemove" @click.stop="$emit('remove-from-day', task.id)"
          class="flex items-center gap-1 px-2 py-1 rounded text-xs bg-zinc-700 text-zinc-300 hover:text-amber-400 border border-zinc-700 transition-colors"
          title="Return to queue">
          <ArrowLeft :size="11" />
          Queue
        </button>

        <!-- Complete -->
        <button v-if="showComplete && !isCompleted" @click.stop="$emit('complete', task.id)"
          class="flex items-center gap-1 px-2 py-1 rounded text-xs bg-zinc-700 text-zinc-300 hover:text-emerald-400 border border-zinc-700 transition-colors"
          title="Mark complete">
          <Check :size="11" />
          Done
        </button>

        <!-- Uncomplete -->
        <button v-if="isCompleted && showComplete" @click.stop="$emit('uncomplete', task.id)"
          class="flex items-center gap-1 px-2 py-1 rounded text-xs bg-zinc-800 text-zinc-500 hover:text-zinc-300 border border-zinc-700 transition-colors">
          <RotateCcw :size="11" />
          Undo
        </button>

        <!-- View lifetime -->
        <button @click.stop="$emit('view-lifetime', task.id)"
          class="ml-auto flex items-center gap-1 px-2 py-1 rounded text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
          title="View task history">
          <History :size="11" />
        </button>

        <!-- Edit -->
        <button @click.stop="$emit('edit', task)"
          class="flex items-center gap-1 px-2 py-1 rounded text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
          title="Edit task">
          <Pencil :size="11" />
        </button>

        <!-- Delete -->
        <button @click.stop="$emit('delete', task.id)"
          class="flex items-center gap-1 px-2 py-1 rounded text-xs text-zinc-600 hover:text-rose-400 transition-colors"
          title="Delete task">
          <Trash2 :size="11" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Plus, ArrowLeft, Check, RotateCcw, History, Pencil, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  task: { type: Object, required: true },
  showAddToDay: { type: Boolean, default: true },
  showRemove: { type: Boolean, default: false },
  showComplete: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
})

defineEmits(['add-to-day', 'remove-from-day', 'complete', 'uncomplete', 'edit', 'delete', 'view-lifetime'])

const isCompleted = computed(() => props.task.status === 'completed')

const priorityBorder = computed(() => {
  if (isCompleted.value) return 'border-zinc-700'
  return {
    high: 'border border-l-2 border-zinc-700 border-l-rose-500',
    medium: 'border border-l-2 border-zinc-700 border-l-amber-500',
    low: 'border border-l-2 border-zinc-700 border-l-zinc-600',
  }[props.task.priority] ?? 'border border-zinc-700'
})

const priorityDot = computed(() => ({
  high: 'bg-rose-500',
  medium: 'bg-amber-500',
  low: 'bg-zinc-600',
}[props.task.priority] ?? 'bg-zinc-600'))
</script>