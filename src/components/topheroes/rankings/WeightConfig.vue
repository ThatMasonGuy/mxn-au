<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Sliders class="w-5 h-5 text-lime-400" />
        <h2 class="text-lg font-bold text-lime-300">Ranking Weights</h2>
      </div>
      <div class="flex items-center gap-2">
        <span :class="[
          'text-sm font-medium',
          totalWeight === 100 ? 'text-lime-400' : 'text-amber-400'
        ]">
          Total: {{ totalWeight }}%
        </span>
        <Button
          v-if="totalWeight !== 100"
          @click="normalize"
          size="sm"
          variant="outline"
          class="text-amber-400 bg-amber-600/20 border-amber-400/50 hover:bg-amber-500/20"
        >
          Normalize to 100%
        </Button>
      </div>
    </div>

    <!-- Weight Warning -->
    <div 
      v-if="totalWeight !== 100"
      class="p-3 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-200 text-sm flex items-center gap-2"
    >
      <AlertTriangle class="w-4 h-4 flex-shrink-0" />
      Weights should total 100% for accurate rankings. Current total: {{ totalWeight }}%
    </div>

    <!-- Power Weight -->
    <div class="bg-green-950/50 rounded-xl border border-lime-500/30 p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              :checked="localWeights.power.enabled"
              @change="updateWeight('power', 'enabled', $event.target.checked)"
              class="sr-only peer"
            >
            <div class="w-9 h-5 bg-green-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-lime-600"></div>
          </label>
          <Zap class="w-5 h-5 text-yellow-400" />
          <span class="font-medium text-lime-200">Guild Power</span>
        </div>
        <div class="flex items-center gap-2">
          <input
            :value="localWeights.power.weight"
            @input="updateWeight('power', 'weight', parseInt($event.target.value) || 0)"
            type="number"
            min="0"
            max="100"
            :disabled="!localWeights.power.enabled"
            class="w-20 h-8 text-center bg-green-900/50 border border-lime-500/30 text-lime-100 rounded-md"
          />
          <span class="text-lime-400 text-sm">%</span>
        </div>
      </div>
      <input
        type="range"
        :value="localWeights.power.weight"
        @input="updateWeight('power', 'weight', parseInt($event.target.value))"
        min="0"
        max="100"
        :disabled="!localWeights.power.enabled"
        class="w-full h-2 bg-green-800 rounded-lg appearance-none cursor-pointer accent-lime-500 disabled:opacity-50"
      />
    </div>

    <!-- Event Weights -->
    <div v-if="eventInstances.length > 0" class="space-y-4">
      <h3 class="text-sm font-semibold text-lime-300/80 flex items-center gap-2">
        <Calendar class="w-4 h-4" />
        Event Weights
      </h3>

      <div 
        v-for="instance in eventInstances"
        :key="instance.id"
        class="bg-green-950/50 rounded-xl border border-lime-500/30 p-4"
      >
        <div class="flex items-center gap-2 mb-4">
          <component 
            :is="getEventIcon(instance.eventConfig.template.category)"
            class="w-5 h-5"
            :class="getEventIconColor(instance.eventConfig.template.category)"
          />
          <span class="font-medium text-lime-200">{{ instance.name }}</span>
          <Badge v-if="instance.opponent" class="text-xs bg-purple-600/20 border-purple-500 text-purple-300">
            vs {{ instance.opponent }}
          </Badge>
        </div>

        <div class="space-y-4">
          <!-- Scoring Mode Selector -->
          <div class="bg-green-900/30 rounded-lg p-3 border border-lime-500/20">
            <div class="text-xs text-lime-400/70 mb-2">Score Calculation Mode</div>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="mode in scoreModes"
                :key="mode.value"
                @click="setEventWeight(instance.id, 'scoreMode', 'value', mode.value)"
                :class="[
                  'px-3 py-1.5 text-xs rounded-md border transition-colors',
                  getEventWeight(instance.id, 'scoreMode', 'value') === mode.value || (!getEventWeight(instance.id, 'scoreMode', 'value') && mode.value === 'total')
                    ? 'bg-lime-600 border-lime-500 text-green-950 font-medium'
                    : 'bg-green-900/50 border-lime-500/30 text-lime-300 hover:bg-green-800/50'
                ]"
              >
                {{ mode.label }}
              </button>
            </div>
            <div class="text-xs text-lime-400/50 mt-2">
              {{ getScoreModeDescription(getEventWeight(instance.id, 'scoreMode', 'value') || 'total') }}
            </div>
          </div>

          <!-- Score Weight -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  :checked="getEventWeight(instance.id, 'score', 'enabled')"
                  @change="setEventWeight(instance.id, 'score', 'enabled', $event.target.checked)"
                  class="sr-only peer"
                >
                <div class="w-7 h-4 bg-green-700 rounded-full peer peer-checked:after:translate-x-3 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-lime-600"></div>
              </label>
              <span class="text-sm text-lime-300">
                {{ instance.eventConfig.template.category === 'kvk' ? 'Prep Score (Days 1-5)' : 'Score' }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <input
                :value="getEventWeight(instance.id, 'score', 'weight')"
                @input="setEventWeight(instance.id, 'score', 'weight', parseInt($event.target.value) || 0)"
                type="number"
                min="0"
                max="100"
                :disabled="!getEventWeight(instance.id, 'score', 'enabled')"
                class="w-16 h-7 text-center text-sm bg-green-900/50 border border-lime-500/30 text-lime-100 rounded-md disabled:opacity-50"
              />
              <span class="text-lime-400 text-xs">%</span>
            </div>
          </div>

          <!-- KvK War Day Weight -->
          <div v-if="instance.eventConfig.template.category === 'kvk'" class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  :checked="getEventWeight(instance.id, 'warDay', 'enabled')"
                  @change="setEventWeight(instance.id, 'warDay', 'enabled', $event.target.checked)"
                  class="sr-only peer"
                >
                <div class="w-7 h-4 bg-green-700 rounded-full peer peer-checked:after:translate-x-3 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
              <span class="text-sm text-purple-300">War Day Score (Day 6)</span>
            </div>
            <div class="flex items-center gap-2">
              <input
                :value="getEventWeight(instance.id, 'warDay', 'weight')"
                @input="setEventWeight(instance.id, 'warDay', 'weight', parseInt($event.target.value) || 0)"
                type="number"
                min="0"
                max="100"
                :disabled="!getEventWeight(instance.id, 'warDay', 'enabled')"
                class="w-16 h-7 text-center text-sm bg-green-900/50 border border-purple-500/30 text-purple-100 rounded-md disabled:opacity-50"
              />
              <span class="text-purple-400 text-xs">%</span>
            </div>
          </div>

          <!-- Win Record Weight (GvG only) -->
          <div v-if="instance.eventConfig.template.category === 'gvg' && instance.eventConfig.template.hasWinLoss" class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  :checked="getEventWeight(instance.id, 'winRecord', 'enabled')"
                  @change="setEventWeight(instance.id, 'winRecord', 'enabled', $event.target.checked)"
                  class="sr-only peer"
                >
                <div class="w-7 h-4 bg-green-700 rounded-full peer peer-checked:after:translate-x-3 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-lime-600"></div>
              </label>
              <span class="text-sm text-lime-300">Win Record</span>
            </div>
            <div class="flex items-center gap-2">
              <input
                :value="getEventWeight(instance.id, 'winRecord', 'weight')"
                @input="setEventWeight(instance.id, 'winRecord', 'weight', parseInt($event.target.value) || 0)"
                type="number"
                min="0"
                max="100"
                :disabled="!getEventWeight(instance.id, 'winRecord', 'enabled')"
                class="w-16 h-7 text-center text-sm bg-green-900/50 border border-lime-500/30 text-lime-100 rounded-md disabled:opacity-50"
              />
              <span class="text-lime-400 text-xs">%</span>
            </div>
          </div>

          <!-- Efficiency Weight -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  :checked="getEventWeight(instance.id, 'efficiency', 'enabled')"
                  @change="setEventWeight(instance.id, 'efficiency', 'enabled', $event.target.checked)"
                  class="sr-only peer"
                >
                <div class="w-7 h-4 bg-green-700 rounded-full peer peer-checked:after:translate-x-3 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-lime-600"></div>
              </label>
              <span class="text-sm text-lime-300">Efficiency (Score/Power)</span>
            </div>
            <div class="flex items-center gap-2">
              <input
                :value="getEventWeight(instance.id, 'efficiency', 'weight')"
                @input="setEventWeight(instance.id, 'efficiency', 'weight', parseInt($event.target.value) || 0)"
                type="number"
                min="0"
                max="100"
                :disabled="!getEventWeight(instance.id, 'efficiency', 'enabled')"
                class="w-16 h-7 text-center text-sm bg-green-900/50 border border-lime-500/30 text-lime-100 rounded-md disabled:opacity-50"
              />
              <span class="text-lime-400 text-xs">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Aggregate Weights -->
    <div v-if="categories.length > 0" class="space-y-4">
      <h3 class="text-sm font-semibold text-lime-300/80 flex items-center gap-2">
        <BarChart3 class="w-4 h-4" />
        Category Aggregates
      </h3>

      <div 
        v-for="category in categories"
        :key="category"
        class="bg-green-950/50 rounded-xl border border-lime-500/30 p-4"
      >
        <div class="flex items-center gap-2 mb-4">
          <component 
            :is="getEventIcon(category)"
            class="w-5 h-5"
            :class="getEventIconColor(category)"
          />
          <span class="font-medium text-lime-200">{{ getCategoryLabel(category) }} Totals</span>
        </div>

        <div class="space-y-4">
          <!-- Total Score -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  :checked="getAggregateWeight(category, 'totalScore', 'enabled')"
                  @change="setAggregateWeight(category, 'totalScore', 'enabled', $event.target.checked)"
                  class="sr-only peer"
                >
                <div class="w-7 h-4 bg-green-700 rounded-full peer peer-checked:after:translate-x-3 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-lime-600"></div>
              </label>
              <span class="text-sm text-lime-300">Combined Score</span>
            </div>
            <div class="flex items-center gap-2">
              <input
                :value="getAggregateWeight(category, 'totalScore', 'weight')"
                @input="setAggregateWeight(category, 'totalScore', 'weight', parseInt($event.target.value) || 0)"
                type="number"
                min="0"
                max="100"
                :disabled="!getAggregateWeight(category, 'totalScore', 'enabled')"
                class="w-16 h-7 text-center text-sm bg-green-900/50 border border-lime-500/30 text-lime-100 rounded-md disabled:opacity-50"
              />
              <span class="text-lime-400 text-xs">%</span>
            </div>
          </div>

          <!-- Win Rate -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  :checked="getAggregateWeight(category, 'winRate', 'enabled')"
                  @change="setAggregateWeight(category, 'winRate', 'enabled', $event.target.checked)"
                  class="sr-only peer"
                >
                <div class="w-7 h-4 bg-green-700 rounded-full peer peer-checked:after:translate-x-3 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-lime-600"></div>
              </label>
              <span class="text-sm text-lime-300">Overall Win Rate</span>
            </div>
            <div class="flex items-center gap-2">
              <input
                :value="getAggregateWeight(category, 'winRate', 'weight')"
                @input="setAggregateWeight(category, 'winRate', 'weight', parseInt($event.target.value) || 0)"
                type="number"
                min="0"
                max="100"
                :disabled="!getAggregateWeight(category, 'winRate', 'enabled')"
                class="w-16 h-7 text-center text-sm bg-green-900/50 border border-lime-500/30 text-lime-100 rounded-md disabled:opacity-50"
              />
              <span class="text-lime-400 text-xs">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preset Buttons -->
    <div class="pt-4 border-t border-lime-500/20">
      <h3 class="text-sm font-semibold text-lime-300/80 mb-3">Quick Presets</h3>
      <div class="flex flex-wrap gap-2">
        <Button
          @click="applyPreset('balanced')"
          size="sm"
          variant="outline"
          class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20"
        >
          Balanced
        </Button>
        <Button
          @click="applyPreset('scoreOnly')"
          size="sm"
          variant="outline"
          class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20"
        >
          Score Only
        </Button>
        <Button
          @click="applyPreset('winsOnly')"
          size="sm"
          variant="outline"
          class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20"
        >
          Wins Only
        </Button>
        <Button
          @click="applyPreset('efficiency')"
          size="sm"
          variant="outline"
          class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20"
        >
          Efficiency Focus
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sliders, Zap, Calendar, BarChart3, AlertTriangle, Sword, Globe } from 'lucide-vue-next'
import { useDatasetStore } from '@/stores/useDatasetStore'
import { createDefaultWeights, normalizeWeights, getTotalWeight } from '@/lib/rankingCalculator'

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const store = useDatasetStore()

// Score calculation modes
const scoreModes = [
  { value: 'total', label: 'Total Score' },
  { value: 'dailyAvg', label: 'Daily Average' },
  { value: 'totalByRank', label: 'Total by Rank' },
  { value: 'dailyByRank', label: 'Daily by Rank' }
]

// Local weights copy
const localWeights = ref({
  power: { enabled: true, weight: 20 },
  events: {},
  aggregates: {}
})

// Computed
const eventInstances = computed(() => store.allEventInstances)

const categories = computed(() => {
  const cats = new Set()
  store.enabledEventConfigs.forEach(ec => {
    cats.add(ec.template.category)
  })
  return Array.from(cats)
})

const totalWeight = computed(() => getTotalWeight(localWeights.value))

// Cleanup weights to remove invalid combinations (e.g., winRecord on KvK, warDay on GvG)
function cleanupWeights(weights) {
  const cleaned = JSON.parse(JSON.stringify(weights))
  
  // Get event instances to check categories
  eventInstances.value.forEach(instance => {
    const eventWeight = cleaned.events?.[instance.id]
    if (!eventWeight) return
    
    const isKvK = instance.eventConfig.template.category === 'kvk'
    
    if (isKvK) {
      // KvK should NOT have winRecord - disable it if present
      if (eventWeight.winRecord?.enabled) {
        eventWeight.winRecord.enabled = false
        eventWeight.winRecord.weight = 0
      }
    } else {
      // Non-KvK (GvG) should NOT have warDay - disable it if present
      if (eventWeight.warDay?.enabled) {
        eventWeight.warDay.enabled = false
        eventWeight.warDay.weight = 0
      }
    }
  })
  
  return cleaned
}

// Initialize weights
onMounted(() => {
  if (props.modelValue) {
    // Clean up any ghost weights from migrated data
    const cleaned = cleanupWeights(props.modelValue)
    localWeights.value = cleaned
    
    // If cleanup changed anything, emit the cleaned version
    if (JSON.stringify(cleaned) !== JSON.stringify(props.modelValue)) {
      emit('update:modelValue', cleaned)
    }
  } else {
    localWeights.value = createDefaultWeights(store.eventConfigs)
    emit('update:modelValue', localWeights.value)
  }
})

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  if (newVal && JSON.stringify(newVal) !== JSON.stringify(localWeights.value)) {
    // Clean up any ghost weights
    const cleaned = cleanupWeights(newVal)
    localWeights.value = cleaned
    
    // If cleanup changed anything, emit the cleaned version
    if (JSON.stringify(cleaned) !== JSON.stringify(newVal)) {
      emit('update:modelValue', cleaned)
    }
  }
}, { deep: true })

// Emit changes
function emitUpdate() {
  emit('update:modelValue', JSON.parse(JSON.stringify(localWeights.value)))
}

// Update power weight
function updateWeight(key, prop, value) {
  localWeights.value[key][prop] = value
  // If disabling, also reset weight to 0
  if (prop === 'enabled' && value === false) {
    localWeights.value[key].weight = 0
  }
  emitUpdate()
}

// Get event weight
function getEventWeight(instanceId, metric, prop) {
  return localWeights.value.events[instanceId]?.[metric]?.[prop] ?? (prop === 'weight' ? 0 : false)
}

// Set event weight
function setEventWeight(instanceId, metric, prop, value) {
  if (!localWeights.value.events[instanceId]) {
    localWeights.value.events[instanceId] = {
      score: { enabled: false, weight: 0 },
      winRecord: { enabled: false, weight: 0 },
      efficiency: { enabled: false, weight: 0 },
      warDay: { enabled: false, weight: 0 },
      scoreMode: { value: 'total' }
    }
  }
  if (!localWeights.value.events[instanceId][metric]) {
    if (metric === 'scoreMode') {
      localWeights.value.events[instanceId][metric] = { value: 'total' }
    } else {
      localWeights.value.events[instanceId][metric] = { enabled: false, weight: 0 }
    }
  }
  localWeights.value.events[instanceId][metric][prop] = value
  
  // If disabling, also reset weight to 0
  if (prop === 'enabled' && value === false && metric !== 'scoreMode') {
    localWeights.value.events[instanceId][metric].weight = 0
  }
  emitUpdate()
}

// Get score mode description
function getScoreModeDescription(mode) {
  switch (mode) {
    case 'total':
      return 'Sum of all day scores - best for overall performance'
    case 'dailyAvg':
      return 'Average of individual day scores - balances consistency'
    case 'totalByRank':
      return 'Points based on total score ranking position'
    case 'dailyByRank':
      return 'Points based on daily ranking positions averaged'
    default:
      return ''
  }
}

// Get aggregate weight
function getAggregateWeight(category, metric, prop) {
  return localWeights.value.aggregates[category]?.[metric]?.[prop] ?? (prop === 'weight' ? 0 : false)
}

// Set aggregate weight
function setAggregateWeight(category, metric, prop, value) {
  if (!localWeights.value.aggregates[category]) {
    localWeights.value.aggregates[category] = {
      totalScore: { enabled: false, weight: 0 },
      winRate: { enabled: false, weight: 0 }
    }
  }
  localWeights.value.aggregates[category][metric][prop] = value
  
  // If disabling, also reset weight to 0
  if (prop === 'enabled' && value === false) {
    localWeights.value.aggregates[category][metric].weight = 0
  }
  emitUpdate()
}

// Normalize to 100%
function normalize() {
  localWeights.value = normalizeWeights(localWeights.value)
  emitUpdate()
}

// Apply preset
function applyPreset(preset) {
  const eventCount = eventInstances.value.length
  
  switch (preset) {
    case 'balanced':
      localWeights.value = createDefaultWeights(store.eventConfigs)
      break
      
    case 'scoreOnly':
      localWeights.value.power = { enabled: false, weight: 0 }
      Object.keys(localWeights.value.events).forEach(id => {
        localWeights.value.events[id] = {
          score: { enabled: true, weight: Math.floor(100 / eventCount) },
          winRecord: { enabled: false, weight: 0 },
          efficiency: { enabled: false, weight: 0 }
        }
      })
      Object.keys(localWeights.value.aggregates).forEach(cat => {
        localWeights.value.aggregates[cat] = {
          totalScore: { enabled: false, weight: 0 },
          winRate: { enabled: false, weight: 0 }
        }
      })
      break
      
    case 'winsOnly':
      localWeights.value.power = { enabled: false, weight: 0 }
      Object.keys(localWeights.value.events).forEach(id => {
        localWeights.value.events[id] = {
          score: { enabled: false, weight: 0 },
          winRecord: { enabled: true, weight: Math.floor(100 / eventCount) },
          efficiency: { enabled: false, weight: 0 }
        }
      })
      Object.keys(localWeights.value.aggregates).forEach(cat => {
        localWeights.value.aggregates[cat] = {
          totalScore: { enabled: false, weight: 0 },
          winRate: { enabled: false, weight: 0 }
        }
      })
      break
      
    case 'efficiency':
      localWeights.value.power = { enabled: true, weight: 10 }
      const remaining = 90 / eventCount
      Object.keys(localWeights.value.events).forEach(id => {
        localWeights.value.events[id] = {
          score: { enabled: false, weight: 0 },
          winRecord: { enabled: false, weight: 0 },
          efficiency: { enabled: true, weight: Math.floor(remaining) }
        }
      })
      Object.keys(localWeights.value.aggregates).forEach(cat => {
        localWeights.value.aggregates[cat] = {
          totalScore: { enabled: false, weight: 0 },
          winRate: { enabled: false, weight: 0 }
        }
      })
      break
  }
  
  // Normalize to exactly 100
  localWeights.value = normalizeWeights(localWeights.value)
  emitUpdate()
}

// Get event icon
function getEventIcon(category) {
  switch (category) {
    case 'gvg': return Sword
    case 'kvk': return Globe
    default: return Calendar
  }
}

// Get event icon color
function getEventIconColor(category) {
  switch (category) {
    case 'gvg': return 'text-lime-400'
    case 'kvk': return 'text-purple-400'
    default: return 'text-yellow-400'
  }
}

// Get category label
function getCategoryLabel(category) {
  switch (category) {
    case 'gvg': return 'GvG'
    case 'kvk': return 'KvK'
    default: return category.toUpperCase()
  }
}
</script>f