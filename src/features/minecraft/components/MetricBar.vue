<template>
  <div>
    <div class="mb-2 flex items-center justify-between gap-3 text-sm">
      <span class="text-slate-400">{{ label }}</span>
      <span class="font-mono text-slate-100">{{ boundedValue }}%</span>
    </div>
    <div class="h-2 overflow-hidden rounded-full bg-white/10">
      <div class="h-full rounded-full transition-all" :class="toneClass" :style="{ width: `${boundedValue}%` }" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  tone: {
    type: String,
    default: 'emerald',
  },
})

const boundedValue = computed(() => Math.max(0, Math.min(100, Math.round(props.value || 0))))

const toneClass = computed(() => {
  const tones = {
    emerald: 'bg-emerald-400',
    sky: 'bg-sky-400',
    violet: 'bg-violet-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
  }
  return tones[props.tone] || tones.emerald
})
</script>
