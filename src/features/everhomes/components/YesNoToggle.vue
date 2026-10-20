<!-- src/features/everhomes/components/YesNoToggle.vue -->

<!--
  Yes / No toggle button pair. Tapping the active value deselects it (returns '').

  modelValue: 'yes' | 'no' | ''

  Usage:
    <YesNoToggle :modelValue="inputs[item.id]" @update:modelValue="setItemInput(sectionId, item.id, $event)" />
    <YesNoToggle v-model="inputs[item.id]" />
-->

<template>
  <div class="flex items-center gap-1 shrink-0">
    <button
      type="button"
      :aria-pressed="modelValue === 'yes'"
      @click="toggle('yes')"
      class="min-h-11 min-w-11 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
      :class="modelValue === 'yes'
        ? 'bg-emerald-500/25 border-emerald-500/80 text-emerald-400'
        : 'border-slate-500 text-slate-300 hover:border-slate-400 hover:text-white bg-transparent'"
    >Yes</button>
    <button
      type="button"
      :aria-pressed="modelValue === 'no'"
      @click="toggle('no')"
      class="min-h-11 min-w-11 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
      :class="modelValue === 'no'
        ? 'bg-rose-500/25 border-rose-500/80 text-rose-400'
        : 'border-slate-500 text-slate-300 hover:border-slate-400 hover:text-white bg-transparent'"
    >No</button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

function toggle(value) {
  // Tap the active value → deselect
  emit('update:modelValue', props.modelValue === value ? '' : value)
}
</script>
