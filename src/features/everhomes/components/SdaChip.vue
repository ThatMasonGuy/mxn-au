<!-- src/features/everhomes/components/SdaChip.vue -->

<!--
  Renders a single SDA category badge chip (FA, HPS, IL, R).
  Colour and border are derived from the chip value — no props needed beyond `chip`.

  Usage:
    <SdaChip v-for="badge in item.badges" :key="badge" :chip="badge" />
-->

<template>
  <span
    class="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-md text-[0.58rem] font-black uppercase tracking-wide leading-none"
    :style="chipStyle"
  >{{ chip }}</span>
</template>

<script setup>
const props = defineProps({
  chip: {
    type: String,
    required: true,
  },
})

const STYLES = {
  HPS: { background: '#7c3aed20', border: '1px solid #7c3aed60', color: '#c4b5fd' },
  FA:  { background: '#2563eb20', border: '1px solid #2563eb60', color: '#93c5fd' },
  IL:  { background: '#d9770620', border: '1px solid #d9770660', color: '#fcd34d' },
  R:   { background: '#e11d4820', border: '1px solid #e11d4860', color: '#fca5a5' },
}

const chipStyle = STYLES[props.chip] ?? {
  background: '#47556920',
  border:     '1px solid #47556960',
  color:      '#94a3b8',
}
</script>
