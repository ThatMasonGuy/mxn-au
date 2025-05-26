<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <span
          class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-sm backdrop-blur"
          :class="[animationClass]"
          :style="badgeStyle"
        >
          <component
            v-if="icon"
            :is="icon"
            class="w-3.5 h-3.5"
            :class="iconColorClass"
          />

          <slot>{{ label }}</slot>

          <button
            v-if="deletable"
            @click.stop="emit('remove')"
            class="ml-1 rounded-full hover:bg-white/10 transition p-0.5"
            aria-label="Remove"
          >
            <XMarkIcon class="w-3 h-3 opacity-80" />
          </button>
        </span>
      </TooltipTrigger>

      <TooltipContent v-if="tooltip" :side="'top'" class="bg-black text-white text-xs px-2 py-1 rounded-md shadow-md">
        {{ tooltip }}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<script setup>
import { computed } from 'vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  label: { type: String, required: true },
  type: { type: String, default: 'default' },
  colorHex: { type: String, default: null },
  glow: { type: Boolean, default: false },
  pulse: { type: Boolean, default: false },
  tooltip: { type: String, default: '' },
  icon: [Object, Function],
  deletable: { type: Boolean, default: false },
  iconColorClass: {
    type: String,
    default: 'text-white'
  }
})

const emit = defineEmits(['remove'])

const badgeStyle = computed(() => {
  if (!props.colorHex) return defaultStyles()

  return {
    backgroundColor: hexToRgba(props.colorHex, 0.2),
    color: props.colorHex,
    borderColor: props.colorHex,
    ...(props.glow ? { '--glow-color': props.colorHex } : {})
  }
})

const animationClass = computed(() => {
  return [
    props.glow ? 'glow-dynamic' : '',
    props.pulse ? 'animate-pulse' : ''
  ].join(' ')
})

function defaultStyles() {
  const map = {
    new: {
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      color: '#22c55e',
      borderColor: '#22c55e'
    },
    soon: {
      backgroundColor: 'rgba(251, 191, 36, 0.2)',
      color: '#fbbf24',
      borderColor: '#fbbf24'
    },
    removed: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      color: '#ef4444',
      borderColor: '#ef4444'
    },
    default: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      borderColor: 'rgba(255, 255, 255, 0.3)'
    }
  }
  return map[props.type] || map.default
}

function hexToRgba(hex, alpha = 1) {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function hexToRgb(hex) {
  const stripped = hex.replace('#', '')
  const bigint = parseInt(stripped, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b]
}
</script>

<style scoped>
@keyframes glow-dynamic {
  0%, 100% {
    box-shadow: 0 0 6px var(--glow-color), 0 0 12px var(--glow-color);
  }
  50% {
    box-shadow: 0 0 10px var(--glow-color), 0 0 16px var(--glow-color);
  }
}

.glow-dynamic {
  animation: glow-dynamic 2s ease-in-out infinite;
  --glow-color: #22c55e;
}
</style>
