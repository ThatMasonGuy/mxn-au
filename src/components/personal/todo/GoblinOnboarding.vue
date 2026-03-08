<template>
    <div class="mx-6 mt-5 mb-1 rounded-xl border border-emerald-700/50 bg-emerald-950/40 overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-emerald-800/40">
            <div class="flex items-center gap-3">
                <div
                    class="w-8 h-8 rounded-lg bg-emerald-700/30 border border-emerald-600/40 flex items-center justify-center text-lg">
                    👾
                </div>
                <div>
                    <h2 class="text-sm font-semibold text-zinc-100">Welcome to your task queue</h2>
                    <p class="text-xs text-zinc-400 mt-0.5">
                        {{ completedSteps }} / {{ steps.length }} steps done
                        <span v-if="allDone" class="text-emerald-400 ml-1">— you're all set!</span>
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <!-- Progress bar -->
                <div class="w-24 h-1.5 rounded-full bg-zinc-700 overflow-hidden">
                    <div class="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        :style="{ width: `${(completedSteps / steps.length) * 100}%` }" />
                </div>

                <button @click="$emit('dismiss')"
                    class="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50 transition-colors ml-1"
                    title="Dismiss">
                    <X :size="14" />
                </button>
            </div>
        </div>

        <!-- Steps -->
        <div class="px-5 py-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div v-for="step in steps" :key="step.id" :class="[
                'flex items-start gap-3 p-3 rounded-lg border transition-all',
                step.done
                    ? 'bg-emerald-950/30 border-emerald-800/30 opacity-70'
                    : step.active
                        ? 'bg-zinc-800 border-zinc-600 cursor-pointer hover:border-zinc-500'
                        : 'bg-zinc-800/40 border-zinc-700/50 opacity-60'
            ]" @click="step.active && !step.done ? step.action?.() : null">
                <!-- Icon / Checkmark -->
                <div :class="[
                    'flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm transition-all mt-0.5',
                    step.done
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : step.active
                            ? 'border-zinc-500 bg-zinc-700 text-zinc-300'
                            : 'border-zinc-700 bg-zinc-800 text-zinc-600'
                ]">
                    <Check v-if="step.done" :size="13" />
                    <span v-else class="text-xs">{{ step.num }}</span>
                </div>

                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                        <p
                            :class="['text-sm font-medium', step.done ? 'line-through text-zinc-500' : step.active ? 'text-zinc-100' : 'text-zinc-500']">
                            {{ step.title }}
                        </p>
                        <span v-if="step.active && !step.done"
                            class="text-xs px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-400 border border-emerald-700/50 flex-shrink-0">
                            up next
                        </span>
                    </div>
                    <p :class="['text-xs mt-0.5', step.done ? 'text-zinc-600' : 'text-zinc-400']">
                        {{ step.desc }}
                    </p>
                    <!-- CTA button for active step -->
                    <button v-if="step.active && !step.done && step.cta" @click.stop="step.action?.()"
                        class="mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-700 text-emerald-50 hover:bg-emerald-600 transition-colors">
                        <component :is="step.ctaIcon" :size="11" />
                        {{ step.cta }}
                    </button>
                </div>
            </div>
        </div>

        <!-- All done state -->
        <div v-if="allDone" class="px-5 pb-4 flex items-center justify-between">
            <p class="text-xs text-zinc-400">
                You've got the hang of it. This panel will go away when you dismiss it.
            </p>
            <button @click="$emit('dismiss')"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-700 text-zinc-200 hover:bg-zinc-600 border border-zinc-600 transition-colors">
                Got it, dismiss
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Check, X, Plus, ArrowRight, FileText, CheckSquare } from 'lucide-vue-next'

const props = defineProps({
    tasks: { type: Object, default: () => ({}) },
    todayTasks: { type: Array, default: () => [] },
    todayBlocks: { type: Array, default: () => [] },
})

const emit = defineEmits(['add-first-task', 'dismiss'])

// ─── Step completion checks ───────────────────────────────────────────────────
const hasAnyTask = computed(() => Object.keys(props.tasks).length > 0)
const hasTaskToday = computed(() => props.todayTasks.length > 0)
const hasCompletedOne = computed(() => props.todayTasks.some(t => t.status === 'completed'))
const hasNote = computed(() => props.todayBlocks.length > 0)

const steps = computed(() => [
    {
        id: 'create',
        num: '1',
        title: 'Create your first task',
        desc: 'Hit "New task" in the queue panel, or click the button below.',
        done: hasAnyTask.value,
        active: true,
        cta: 'New task',
        ctaIcon: Plus,
        action: () => emit('add-first-task'),
    },
    {
        id: 'pull',
        num: '2',
        title: 'Pull it onto today',
        desc: 'Find your task in the queue on the right, then click "+ Today".',
        done: hasTaskToday.value,
        active: hasAnyTask.value,
        cta: null,
        action: null,
    },
    {
        id: 'complete',
        num: '3',
        title: 'Mark it done',
        desc: 'Check the box next to your task in the "On your plate" section.',
        done: hasCompletedOne.value,
        active: hasTaskToday.value,
        cta: null,
        action: null,
    },
    {
        id: 'note',
        num: '4',
        title: 'Write a note',
        desc: 'Click in the "Today\'s notes" area and type something. Try "/" for block types.',
        done: hasNote.value,
        active: hasAnyTask.value,
        cta: null,
        action: null,
    },
])

const completedSteps = computed(() => steps.value.filter(s => s.done).length)
const allDone = computed(() => completedSteps.value === steps.value.length)
</script>