<!-- src/features/everhomes/components/ChecklistItem.vue -->

<!--
  Single checklist item renderer. Switches on item.type:
    (default / status) — row of OK / Attention / Issue / N/A icon buttons
    'yesno'            — Yes / No toggle pair
    'text'             — single-line text input
    'number'           — number input
    'multiline'        — textarea (bug 4 fix — was falling through to status branch)

  SDA badges (item.badges[]) are rendered via SdaChip.
  Visibility (showIf + SDA filter) is resolved by the parent — this component
  renders unconditionally and assumes the parent has already gated it.

  Props:
    item       — the item definition from the schema
    sectionId  — the active section instance ID (e.g. 'bedroom_1')
    itemValue  — current status value (for status items)
    inputValue — current input value (for input items)

  Emits:
    set-status  (itemId, status)
    set-input   (itemId, value)
-->

<template>
  <div
    v-if="item.type === 'text' || item.type === 'number'"
    class="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-slate-800/40"
  >
    <div class="flex-1 flex flex-wrap items-center gap-1.5 min-w-0">
      <SdaChip v-for="badge in (item.badges ?? [])" :key="badge" :chip="badge" />
      <span class="text-xs font-medium leading-tight" :class="item.sda ? 'text-slate-300' : 'text-slate-400'">{{ item.label }}</span>
    </div>
    <input
      :type="item.type"
      :placeholder="item.placeholder ?? ''"
      :value="inputValue"
      @input="emit('set-input', item.id, $event.target.value)"
      class="shrink-0 bg-slate-900/80 border border-slate-600 text-white placeholder-slate-600 text-xs font-medium rounded-lg px-2.5 py-1.5 text-right focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
      :class="item.type === 'number' ? 'w-20' : 'w-36'"
    />
  </div><div
    v-else-if="item.type === 'multiline'"
    class="px-2.5 py-2 rounded-lg bg-slate-800/40 space-y-1.5"
  >
    <div class="flex flex-wrap items-center gap-1.5">
      <SdaChip v-for="badge in (item.badges ?? [])" :key="badge" :chip="badge" />
      <span class="text-xs font-medium leading-tight" :class="item.sda ? 'text-slate-300' : 'text-slate-400'">{{ item.label }}</span>
    </div>
    <textarea
      :placeholder="item.placeholder ?? ''"
      :value="inputValue"
      @input="emit('set-input', item.id, $event.target.value)"
      rows="3"
      class="w-full bg-slate-900/80 border border-slate-600 text-white placeholder-slate-600 text-xs font-medium rounded-lg px-2.5 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
    ></textarea>
  </div><div
    v-else-if="item.type === 'yesno'"
    class="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-slate-800/40"
  >
    <div class="flex-1 flex flex-wrap items-center gap-1.5 min-w-0">
      <SdaChip v-for="badge in (item.badges ?? [])" :key="badge" :chip="badge" />
      <span class="text-xs font-medium leading-tight" :class="item.sda ? 'text-slate-300' : 'text-slate-400'">{{ item.label }}</span>
    </div>
    <YesNoToggle
      :modelValue="inputValue"
      @update:modelValue="emit('set-input', item.id, $event)"
    />
  </div><div
    v-else
    class="flex items-center gap-2 px-2.5 py-2 rounded-lg transition-colors duration-150"
    :class="rowClass"
  >
    <div
      class="flex-1 flex flex-wrap items-center gap-1.5 min-w-0"
      :class="itemValue === 'na' ? 'opacity-40' : ''"
    >
      <SdaChip v-for="badge in (item.badges ?? [])" :key="badge" :chip="badge" />
      <span
        class="text-xs font-medium leading-tight"
        :class="[item.sda ? 'text-slate-300' : 'text-slate-400', itemValue === 'issue' ? '!text-rose-300' : '']"
      >{{ item.label }}</span>
    </div>
    <div class="flex items-center gap-0.5 shrink-0">
      <button
        v-for="opt in STATUS_OPTIONS"
        :key="opt.value"
        @click="emit('set-status', item.id, opt.value)"
        :title="opt.label"
        class="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-100 border"
        :class="itemValue === opt.value ? opt.activeClass : 'border-slate-700/60 text-slate-600 hover:border-slate-600 hover:text-slate-400 bg-transparent'"
      >
        <component :is="opt.icon" class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CheckCircle, AlertTriangle, XCircle, MinusCircle } from 'lucide-vue-next'
import SdaChip     from './SdaChip.vue'
import YesNoToggle from './YesNoToggle.vue'

// ─── Props & emits ────────────────────────────────────────────────────────────
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  sectionId: {
    type: String,
    required: true,
  },
  // Current status value for status-type items ('ok' | 'attention' | 'issue' | 'na' | 'unchecked')
  itemValue: {
    type: String,
    default: 'unchecked',
  },
  // Current value for input-type items (string | number | '')
  inputValue: {
    type: [String, Number],
    default: '',
  },
})

const emit = defineEmits(['set-status', 'set-input'])

// ─── Status options ───────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  {
    value:       'ok',
    label:       'OK',
    icon:        CheckCircle,
    activeClass: 'bg-emerald-500/25 border-emerald-500/80 text-emerald-400',
  },
  {
    value:       'attention',
    label:       'Needs Attention',
    icon:        AlertTriangle,
    activeClass: 'bg-amber-500/25 border-amber-500/80 text-amber-400',
  },
  {
    value:       'issue',
    label:       'Issue Found',
    icon:        XCircle,
    activeClass: 'bg-rose-500/25 border-rose-500/80 text-rose-400',
  },
  {
    value:       'na',
    label:       'N/A',
    icon:        MinusCircle,
    activeClass: 'bg-slate-700/80 border-slate-500/80 text-slate-400',
  },
]

// ─── Row background class (status items only) ─────────────────────────────────
const rowClass = computed(() => {
  if (props.itemValue === 'issue')     return 'bg-rose-500/10'
  if (props.itemValue === 'attention') return 'bg-amber-500/10'
  if (props.itemValue === 'ok')        return 'bg-emerald-500/10'
  return ''
})
</script>