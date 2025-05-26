<template>
    <div class="flex flex-col gap-2">
        <div class="flex flex-wrap gap-2" role="group" aria-label="Tool tag filter">
            <div v-if="clearAll && modelValue.length" class="mt-1 mr-4">
                <button @click="clearTags"
                    class="text-sm text-teal-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded">
                    Clear All Filters
                </button>
            </div>
            <TooltipProvider>
                <Tooltip v-for="tag in tags" :key="tag">
                    <TooltipTrigger as-child>
                        <button @click="toggleTag(tag)" @keydown.enter.prevent="toggleTag(tag)"
                            :aria-pressed="isSelected(tag)"
                            class="focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-full"
                            :disabled="!isSelected(tag) && atLimit">
                            <BadgeComponent :label="tag" :glow="isSelected(tag)" :deletable="false" :pulse="false"
                                :colorHex="getColorHex(tag, isSelected(tag))" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent v-if="tooltipMap?.[tag]" side="top"
                        class="bg-black text-white text-xs px-2 py-1 rounded shadow">
                        {{ tooltipMap[tag] }}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    </div>
</template>

<script setup>
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import BadgeComponent from '@/components/everhomes/ui/BadgeComponent.vue'
import { computed } from 'vue'

const props = defineProps({
    tags: { type: Array, required: true },
    tagColorMap: { type: Object, default: () => ({}) },
    modelValue: { type: Array, default: () => [] },
    tooltipMap: { type: Object, default: () => ({}) },
    maxSelectable: { type: Number, default: null },
    clearAll: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const isSelected = (tag) => props.modelValue.includes(tag)
const atLimit = computed(() => props.maxSelectable && props.modelValue.length >= props.maxSelectable)

const tailwindColorShades = {
  teal:      ['#14b8a6', '#99f6e4'],
  slate:     ['#64748b', '#cbd5e1'],
  gray:      ['#6b7280', '#d1d5db'],
  sky:       ['#0ea5e9', '#bae6fd'],
  emerald:   ['#10b981', '#a7f3d0'],
  amber:     ['#f59e0b', '#fde68a'],
  rose:      ['#f43f5e', '#fecdd3'],
  violet:    ['#8b5cf6', '#ddd6fe'],
  indigo:    ['#6366f1', '#c7d2fe'],
  blue:      ['#3b82f6', '#bfdbfe']
}

function getColorHex(tag, isActive) {
  const colorKey = props.tagColorMap?.[tag]
  const [active, muted] = tailwindColorShades[colorKey] || ['#14b8a6', '#99f6e4']

  return isActive ? active : muted
}

function toggleTag(tag) {
    const selected = new Set(props.modelValue)

    if (selected.has(tag)) {
        selected.delete(tag)
    } else if (!atLimit.value) {
        selected.add(tag)
    }

    emit('update:modelValue', [...selected])
}

function clearTags() {
    emit('update:modelValue', [])
}
</script>