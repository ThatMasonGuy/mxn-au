<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('update:modelValue', false)">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <!-- Modal -->
        <div class="relative w-full max-w-md bg-zinc-800 border border-zinc-600 rounded-xl shadow-2xl shadow-black/60">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-zinc-700">
            <h2 class="text-sm font-semibold text-zinc-100">
              {{ editing ? 'Edit task' : 'New task' }}
            </h2>
            <button @click="$emit('update:modelValue', false)"
              class="text-zinc-400 hover:text-zinc-100 transition-colors">
              <X :size="16" />
            </button>
          </div>

          <!-- Form -->
          <div class="p-5 space-y-4">
            <!-- Title -->
            <div>
              <label class="block text-xs font-medium text-zinc-400 mb-1.5">Title <span
                  class="text-rose-500">*</span></label>
              <input v-model="form.title" ref="titleInput" type="text" placeholder="What needs doing?"
                class="w-full px-3 py-2 rounded-lg text-sm bg-zinc-700 border border-zinc-600 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 transition-colors"
                @keydown.enter="submit" />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-medium text-zinc-400 mb-1.5">Description</label>
              <textarea v-model="form.description" placeholder="Optional details..." rows="3"
                class="w-full px-3 py-2 rounded-lg text-sm bg-zinc-700 border border-zinc-600 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 transition-colors resize-none" />
            </div>

            <!-- Priority -->
            <div>
              <label class="block text-xs font-medium text-zinc-400 mb-1.5">Priority</label>
              <div class="flex gap-2">
                <button v-for="p in priorities" :key="p.value" @click="form.priority = p.value" :class="[
                  'flex-1 py-2 rounded-lg text-xs font-medium border transition-colors',
                  form.priority === p.value ? p.activeClass : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-100'
                ]">
                  {{ p.label }}
                </button>
              </div>
            </div>

            <!-- Tags -->
            <div>
              <label class="block text-xs font-medium text-zinc-400 mb-1.5">Tags</label>
              <div class="flex flex-wrap gap-1.5 mb-2">
                <span v-for="tag in form.tags" :key="tag"
                  class="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {{ tag }}
                  <button @click="removeTag(tag)" class="text-zinc-500 hover:text-rose-400 transition-colors">
                    <X :size="10" />
                  </button>
                </span>
              </div>

              <!-- Existing tags suggestions -->
              <div v-if="availableTags.length" class="flex flex-wrap gap-1 mb-2">
                <button v-for="tag in availableTags" :key="tag" @click="addExistingTag(tag)"
                  class="px-2 py-0.5 rounded text-xs bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300 hover:border-zinc-700 transition-colors">
                  + {{ tag }}
                </button>
              </div>

              <!-- New tag input -->
              <div class="flex gap-2">
                <input v-model="newTag" type="text" placeholder="Add a tag..."
                  class="flex-1 px-3 py-1.5 rounded-lg text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 transition-colors"
                  @keydown.enter.prevent="addNewTag" @keydown.comma.prevent="addNewTag" />
                <button @click="addNewTag"
                  class="px-3 py-1.5 rounded-lg text-xs bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors">
                  Add
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between px-5 py-4 border-t border-zinc-800">
            <!-- Add to today toggle (only on new task) -->
            <label v-if="!editing" class="flex items-center gap-2 cursor-pointer select-none">
              <div @click="form.addToDay = !form.addToDay" :class="[
                'w-8 h-4 rounded-full transition-colors relative',
                form.addToDay ? 'bg-emerald-600' : 'bg-zinc-700'
              ]">
                <span :class="[
                  'absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform',
                  form.addToDay ? 'translate-x-4' : 'translate-x-0.5'
                ]" />
              </div>
              <span class="text-xs text-zinc-400">Add to today</span>
            </label>
            <div v-else />

            <div class="flex gap-2">
              <button @click="$emit('update:modelValue', false)"
                class="px-4 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
                Cancel
              </button>
              <button @click="submit" :disabled="!form.title.trim()"
                class="px-4 py-2 rounded-lg text-xs font-medium bg-emerald-700 text-emerald-100 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                {{ editing ? 'Save changes' : 'Create task' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  editTask: { type: Object, default: null }, // null = create mode
  allTags: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const titleInput = ref(null)
const newTag = ref('')

const editing = computed(() => !!props.editTask)

const defaultForm = () => ({
  title: '',
  description: '',
  priority: 'medium',
  tags: [],
  addToDay: false,
})

const form = ref(defaultForm())

const priorities = [
  { value: 'high', label: '↑ High', activeClass: 'bg-rose-950 border-rose-800 text-rose-400' },
  { value: 'medium', label: '— Medium', activeClass: 'bg-amber-950 border-amber-800 text-amber-400' },
  { value: 'low', label: '↓ Low', activeClass: 'bg-zinc-700 border-zinc-600 text-zinc-300' },
]

const availableTags = computed(() =>
  props.allTags.filter(t => !form.value.tags.includes(t))
)

watch(() => props.modelValue, (open) => {
  if (open) {
    if (props.editTask) {
      form.value = {
        title: props.editTask.title ?? '',
        description: props.editTask.description ?? '',
        priority: props.editTask.priority ?? 'medium',
        tags: [...(props.editTask.tags ?? [])],
        addToDay: false,
      }
    } else {
      form.value = defaultForm()
    }
    nextTick(() => titleInput.value?.focus())
  }
})

const addNewTag = () => {
  const tag = newTag.value.trim().toLowerCase().replace(/,/g, '')
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
  }
  newTag.value = ''
}

const addExistingTag = (tag) => {
  if (!form.value.tags.includes(tag)) form.value.tags.push(tag)
}

const removeTag = (tag) => {
  form.value.tags = form.value.tags.filter(t => t !== tag)
}

const submit = () => {
  if (!form.value.title.trim()) return
  emit('submit', { ...form.value, id: props.editTask?.id })
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.15s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative {
  transform: scale(0.97) translateY(4px);
}
</style>