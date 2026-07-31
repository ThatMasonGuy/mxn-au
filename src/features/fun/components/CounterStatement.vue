<template>
  <div class="counter-statement">
    <Hash :size="17" :stroke-width="1.8" aria-hidden="true" />
    <strong>{{ formattedCount }}</strong>
    <span>{{ count === 1 ? singular : plural }} {{ suffix }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Hash } from '@lucide/vue'

const props = defineProps({
  count: {
    type: Number,
    default: 0,
  },
  singular: {
    type: String,
    required: true,
  },
  plural: {
    type: String,
    required: true,
  },
  suffix: {
    type: String,
    required: true,
  },
})

const numberFormatter = new Intl.NumberFormat('en-AU', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const formattedCount = computed(() =>
  numberFormatter
    .format(props.count || 0)
    .replace(/[KMBT]$/, (suffix) => suffix.toLowerCase()),
)
</script>

<style scoped>
.counter-statement {
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 0.65rem;
  padding: 0.62rem 0.78rem;
  border: 1px solid rgba(255, 255, 255, 0.075);
  border-radius: 0.72rem;
  color: #8e70b8;
  background: rgba(255, 255, 255, 0.025);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02);
}

strong {
  color: #d1bcec;
  font-size: 1rem;
  font-variant-numeric: tabular-nums;
}

span {
  color: #777080;
  font-size: 0.67rem;
}
</style>
