<!-- src/features/everhomes/components/StatusPill.vue -->

<!--
  Canonical status indicator used across section headers, the accordion, and the
  submit modal flagged section list.

  Two variants:
    - 'dot'  (default) — small coloured circle, used in accordion headers
    - 'pill'           — icon + label, used in submit modal and status overrides

  Usage:
    <StatusPill :status="section.status" />
    <StatusPill :status="section.status" variant="pill" />
-->

<template>
  <!-- Dot variant — compact coloured circle -->
  <span
    v-if="variant === 'dot'"
    class="w-2 h-2 rounded-full shrink-0 inline-block"
    :style="{ background: colour }"
  />

  <!-- Pill variant — icon + label -->
  <span
    v-else
    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all duration-150"
    :class="activeClass"
  >
    <component :is="icon" class="w-3.5 h-3.5" />
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { CheckCircle, AlertTriangle, XCircle, MinusCircle, Circle } from 'lucide-vue-next'

const props = defineProps({
  status: {
    type: String,
    default: 'unchecked',
  },
  variant: {
    type: String,
    default: 'dot',
    validator: (v) => ['dot', 'pill'].includes(v),
  },
})

const STATUS_MAP = {
  ok: {
    label:       'OK',
    colour:      '#10B981',
    icon:        CheckCircle,
    activeClass: 'bg-emerald-500/20 border-emerald-500 text-emerald-400',
  },
  attention: {
    label:       'Needs Attention',
    colour:      '#F59E0B',
    icon:        AlertTriangle,
    activeClass: 'bg-amber-500/20 border-amber-500 text-amber-400',
  },
  issue: {
    label:       'Issue Found',
    colour:      '#F43F5E',
    icon:        XCircle,
    activeClass: 'bg-rose-500/20 border-rose-500 text-rose-400',
  },
  na: {
    label:       'N/A',
    colour:      '#64748B',
    icon:        MinusCircle,
    activeClass: 'bg-slate-700 border-slate-500 text-slate-400',
  },
  unchecked: {
    label:       'Unchecked',
    colour:      '#475569',
    icon:        Circle,
    activeClass: 'bg-transparent border-slate-700 text-slate-500',
  },
}

const current = computed(() => STATUS_MAP[props.status] ?? STATUS_MAP.unchecked)

const colour      = computed(() => current.value.colour)
const label       = computed(() => current.value.label)
const icon        = computed(() => current.value.icon)
const activeClass = computed(() => current.value.activeClass)
</script>
