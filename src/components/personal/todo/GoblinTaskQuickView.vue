<template>
    <Teleport to="body">
        <Transition name="slide-panel">
            <div v-if="modelValue && task" class="fixed inset-y-0 right-0 z-40 flex">
                <!-- Backdrop -->
                <div class="fixed inset-0 bg-black/40" @click="$emit('update:modelValue', false)" />

                <!-- Panel -->
                <div
                    class="relative ml-auto w-full max-w-lg bg-zinc-900 border-l border-zinc-700 flex flex-col shadow-2xl shadow-black/60 overflow-hidden">

                    <!-- Header -->
                    <div class="flex items-start justify-between px-6 py-5 border-b border-zinc-700 flex-shrink-0">
                        <div class="flex-1 min-w-0 pr-4">
                            <div class="flex items-center gap-2 mb-2">
                                <span :class="['w-2 h-2 rounded-full flex-shrink-0', priorityDot]" />
                                <span :class="['text-xs font-medium uppercase tracking-wider', priorityText]">
                                    {{ task.priority }} priority
                                </span>
                                <span class="text-zinc-700">·</span>
                                <span :class="['text-xs font-medium', statusText]">{{ task.status }}</span>
                            </div>
                            <h2 class="text-lg font-semibold text-zinc-100 leading-snug">{{ task.title }}</h2>
                        </div>
                        <button @click="$emit('update:modelValue', false)"
                            class="flex-shrink-0 p-1.5 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 transition-colors mt-1">
                            <X :size="16" />
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="flex-1 overflow-y-auto">

                        <!-- Description -->
                        <div class="px-6 py-4 border-b border-zinc-800">
                            <p class="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Description</p>
                            <p v-if="task.description" class="text-sm text-zinc-300 leading-relaxed">
                                {{ task.description }}
                            </p>
                            <p v-else class="text-sm text-zinc-600 italic">No description</p>
                        </div>

                        <!-- Tags -->
                        <div v-if="task.tags?.length" class="px-6 py-4 border-b border-zinc-800">
                            <p class="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Tags</p>
                            <div class="flex flex-wrap gap-1.5">
                                <span v-for="tag in task.tags" :key="tag"
                                    class="px-2 py-0.5 rounded-md text-xs bg-zinc-700 text-zinc-300 border border-zinc-600">{{
                                    tag }}</span>
                            </div>
                        </div>

                        <!-- Inline notes -->
                        <div class="px-6 py-4 border-b border-zinc-800">
                            <p class="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Notes</p>
                            <textarea v-model="localNotes" placeholder="Add notes to this task..."
                                class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 resize-none transition-colors leading-relaxed"
                                rows="5" @blur="saveNotes" @keydown.ctrl.enter="saveNotes"
                                @keydown.meta.enter="saveNotes" />
                            <p class="text-xs text-zinc-700 mt-1">Ctrl+Enter to save · or click away</p>
                            <Transition name="fade">
                                <span v-if="notesSaved" class="text-xs text-emerald-500 mt-1 block">Saved ✓</span>
                            </Transition>
                        </div>

                        <!-- Stats -->
                        <div class="px-6 py-4 border-b border-zinc-800">
                            <p class="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">History</p>
                            <div class="grid grid-cols-3 gap-3">
                                <div class="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-center">
                                    <p class="text-lg font-bold text-zinc-200">{{ dayTaskCount }}</p>
                                    <p class="text-xs text-zinc-500 mt-0.5">Days on plate</p>
                                </div>
                                <div class="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-center">
                                    <p class="text-lg font-bold text-zinc-200">{{ rolledCount }}</p>
                                    <p class="text-xs text-zinc-500 mt-0.5">Deferred</p>
                                    <p class="text-xs text-zinc-600 mt-0.5">(not done, moved on)</p>
                                </div>
                                <div class="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-center">
                                    <p class="text-lg font-bold text-zinc-200">{{ linkedTodayBlocks.length }}</p>
                                    <p class="text-xs text-zinc-500 mt-0.5">Linked notes</p>
                                </div>
                            </div>
                            <p v-if="task.createdAt" class="text-xs text-zinc-600 mt-3">
                                Created {{ formatDate(task.createdAt) }}
                            </p>
                        </div>

                        <!-- Linked notes from today -->
                        <div v-if="linkedTodayBlocks.length" class="px-6 py-4">
                            <p class="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Linked to today's
                                notes</p>
                            <div class="space-y-2">
                                <div v-for="block in linkedTodayBlocks" :key="block.id"
                                    class="px-3 py-2 rounded-lg bg-zinc-800 border-l-2 border-emerald-600 text-sm text-zinc-300 leading-relaxed">
                                    {{ block.content }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="px-6 py-4 border-t border-zinc-700 flex items-center gap-2 flex-shrink-0 bg-zinc-900">
                        <button @click="$emit('view-lifetime', task.id)"
                            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 transition-colors">
                            <History :size="14" />
                            Full history
                        </button>
                        <button @click="$emit('edit', task)"
                            class="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 transition-colors"
                            title="Edit task">
                            <Pencil :size="14" />
                        </button>
                        <button v-if="dayTask?.status !== 'completed'" @click="$emit('complete', task.id)"
                            class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 transition-colors">
                            <Check :size="14" />
                            Done
                        </button>
                        <button v-else @click="$emit('uncomplete', task.id)"
                            class="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 transition-colors"
                            title="Undo complete">
                            <RotateCcw :size="14" />
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { X, History, Pencil, Check, RotateCcw } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    task: { type: Object, default: null },
    dayTask: { type: Object, default: null },
    dayTaskCount: { type: Number, default: 0 },
    rolledCount: { type: Number, default: 0 },
    linkedTodayBlocks: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'view-lifetime', 'edit', 'complete', 'uncomplete', 'save-notes'])

const localNotes = ref('')
const notesSaved = ref(false)
let saveTimeout = null

// Sync notes when task changes
watch(() => props.task, (task) => {
    localNotes.value = task?.notes ?? ''
}, { immediate: true })

const saveNotes = () => {
    emit('save-notes', { taskId: props.task?.id, notes: localNotes.value })
    notesSaved.value = true
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => { notesSaved.value = false }, 2000)
}

const priorityDot = computed(() => ({
    high: 'bg-rose-500', medium: 'bg-amber-400', low: 'bg-zinc-500'
}[props.task?.priority] ?? 'bg-zinc-500'))

const priorityText = computed(() => ({
    high: 'text-rose-400', medium: 'text-amber-400', low: 'text-zinc-500'
}[props.task?.priority] ?? 'text-zinc-500'))

const statusText = computed(() => ({
    queue: 'text-zinc-500', active: 'text-emerald-400', completed: 'text-emerald-500'
}[props.task?.status] ?? 'text-zinc-500'))

const formatDate = (ts) => {
    if (!ts) return ''
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.slide-panel-enter-active,
.slide-panel-leave-active {
    transition: opacity 0.2s ease;
}

.slide-panel-enter-active .relative,
.slide-panel-leave-active .relative {
    transition: transform 0.25s ease;
}

.slide-panel-enter-from,
.slide-panel-leave-to {
    opacity: 0;
}

.slide-panel-enter-from .relative {
    transform: translateX(100%);
}

.slide-panel-leave-to .relative {
    transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>