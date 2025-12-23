<template>
  <button
    @click="$emit('open-modal')"
    :class="[
      'w-full px-3 py-2 rounded-lg text-left transition-all',
      'bg-green-900/30 hover:bg-green-900/50 border border-lime-500/20 hover:border-lime-500/40',
      hasData ? '' : 'opacity-60'
    ]"
  >
    <!-- Daily Mode Display -->
    <div v-if="eventConfig.inputMode === 'daily'" class="flex flex-col items-center gap-1">
      <!-- Win/Loss indicators -->
      <div v-if="eventConfig.template.hasWinLoss && hasWinLossData" class="flex gap-0.5 justify-center">
        <div
          v-for="(day, idx) in eventData?.days || []"
          :key="idx"
          :class="[
            'w-2 h-2 rounded-full',
            day.won === true ? 'bg-lime-500' : 
            day.won === false ? 'bg-red-500' : 
            'bg-gray-600'
          ]"
          :title="`Day ${idx + 1}: ${day.won === true ? 'Win' : day.won === false ? 'Loss' : 'Not set'}`"
        />
      </div>
      
      <!-- Score summary -->
      <div class="text-sm font-mono">
        <span v-if="totalScore > 0" class="text-lime-200">{{ formatCompact(totalScore) }}</span>
        <span v-else class="text-lime-400/50">-</span>
      </div>
      
      <!-- Points (if scoring system) -->
      <div v-if="eventConfig.template.scoring && hasWinLossData" class="text-xs">
        <span :class="result?.won ? 'text-lime-400' : 'text-lime-400/60'">
          {{ result?.points || 0 }}pts
        </span>
      </div>
    </div>

    <!-- Total Mode Display -->
    <div v-else-if="eventConfig.inputMode === 'total'" class="text-center">
      <div class="text-sm font-mono">
        <span v-if="eventData?.totalScore" class="text-lime-200">{{ formatCompact(eventData.totalScore) }}</span>
        <span v-else class="text-lime-400/50">-</span>
      </div>
      <div v-if="eventConfig.template.hasWinLoss && eventData?.result" class="mt-1">
        <Badge 
          :class="eventData.result === 'won' 
            ? 'bg-lime-600/20 border-lime-500 text-lime-300' 
            : 'bg-red-600/20 border-red-500 text-red-300'"
          class="text-[10px] px-1.5 py-0"
        >
          {{ eventData.result === 'won' ? 'W' : 'L' }}
        </Badge>
      </div>
    </div>

    <!-- Simple Mode Display -->
    <div v-else-if="eventConfig.inputMode === 'simple'" class="text-center">
      <div v-if="eventData?.result" class="flex items-center justify-center gap-1">
        <Badge 
          :class="eventData.result === 'won' 
            ? 'bg-lime-600/20 border-lime-500 text-lime-300' 
            : 'bg-red-600/20 border-red-500 text-red-300'"
        >
          {{ eventData.result === 'won' ? 'Won' : 'Lost' }}
        </Badge>
      </div>
      <span v-else class="text-lime-400/50 text-sm">-</span>
      
      <div v-if="eventData?.score" class="text-xs text-lime-300/60 mt-1">
        {{ formatCompact(eventData.score) }}
      </div>
    </div>

    <!-- Click hint -->
    <div class="text-[10px] text-lime-400/40 mt-1 text-center">
      <span v-if="eventConfig.template?.category === 'gvg' && eventData?.opponent" class="text-purple-300/60">
        vs {{ eventData.opponent }}
      </span>
      <span v-else>Click to edit</span>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { calculateEventResult } from '@/lib/eventTemplates'
import { formatNumber } from '@/lib/datasetHelpers'

const props = defineProps({
  guild: {
    type: Object,
    required: true
  },
  eventConfig: {
    type: Object,
    required: true
  },
  instance: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'open-modal'])

// Get event data for this instance
const eventData = computed(() => props.guild.events?.[props.instance.id])

// Calculate result
const result = computed(() => {
  if (!eventData.value) return null
  return calculateEventResult(props.eventConfig, eventData.value)
})

// Total score
const totalScore = computed(() => result.value?.totalScore || 0)

// Check if we have any data
const hasData = computed(() => {
  if (!eventData.value) return false
  
  if (props.eventConfig.inputMode === 'simple') {
    return eventData.value.result != null
  }
  
  if (props.eventConfig.inputMode === 'total') {
    return eventData.value.totalScore != null
  }
  
  // Daily mode
  if (eventData.value.days) {
    return eventData.value.days.some(d => d.score != null || d.won != null)
  }
  
  return false
})

// Check if we have win/loss data
const hasWinLossData = computed(() => {
  if (!eventData.value?.days) return false
  return eventData.value.days.some(d => d.won != null)
})

// Format number compactly
function formatCompact(num) {
  if (num == null) return '-'
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toString()
}
</script>
