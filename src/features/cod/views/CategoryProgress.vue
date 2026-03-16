<template>
  <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
          <component :is="getCategoryIcon()" class="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 class="text-2xl font-bold text-white">{{ category }}</h3>
          <p class="text-sm text-gray-400">{{ categoryWeapons.length }} weapon{{ categoryWeapons.length !== 1 ? 's' : '' }}</p>
        </div>
      </div>
      <button
        @click="showWeapons = !showWeapons"
        class="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
      >
        <component :is="showWeapons ? ChevronUp : ChevronDown" class="w-5 h-5" />
      </button>
    </div>

    <!-- Progress Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div 
        v-for="type in camoTypes" 
        :key="type"
        class="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all"
      >
        <div class="flex items-center gap-2 mb-3">
          <component :is="getTypeIcon(type)" class="w-4 h-4" :class="getTypeColor(type)" />
          <span class="text-sm text-gray-300 font-medium">{{ type }}</span>
        </div>
        <div class="text-2xl font-bold text-white mb-2">
          {{ getCategoryTypeProgress(type).completed }}<span class="text-gray-500">/{{ getCategoryTypeProgress(type).total }}</span>
        </div>
        <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            class="h-full transition-all duration-300"
            :class="getTypeGradient(type)"
            :style="{ width: `${getCategoryTypeProgress(type).percentage}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Weapon List -->
    <Transition name="expand">
      <div v-if="showWeapons" class="space-y-2 pt-4 border-t border-gray-700">
        <div 
          v-for="weapon in categoryWeapons"
          :key="weapon.id"
          class="bg-gray-900/30 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-900/50 transition-all"
        >
          <div class="flex items-center gap-3">
            <Crosshair class="w-5 h-5 text-gray-400" />
            <span class="text-white font-medium">{{ weapon.name }}</span>
          </div>
          <div class="flex gap-2">
            <span 
              v-for="type in camoTypes" 
              :key="type"
              class="flex items-center justify-center w-10 h-10 rounded-lg text-xs font-bold border"
              :class="getMasteryBadgeClass(weapon[type.toLowerCase()].mastery)"
              :title="`${type}: ${getMasteryName(weapon[type.toLowerCase()].mastery)}`"
            >
              {{ getMasteryShortName(weapon[type.toLowerCase()].mastery) }}
            </span>
            <span 
              class="flex items-center justify-center w-10 h-10 rounded-lg text-xs font-bold bg-cyan-600 text-white border border-cyan-500"
              :title="`Prestige: ${getPrestigeName(weapon.prestige.prestigeTier)}`"
            >
              P{{ weapon.prestige.prestigeTier }}
            </span>
          </div>
        </div>
        
        <div v-if="categoryWeapons.length === 0" class="text-center py-8">
          <Package class="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p class="text-gray-400">No weapons in this category yet</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Target, Skull, Mountain, Plane, Crosshair, ChevronDown, ChevronUp, Package,
  Zap, Hammer, Cpu, Gauge, Shield
} from 'lucide-vue-next'
import { useCamoStore } from './camoStore'

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})

const camoStore = useCamoStore()
const showWeapons = ref(false)
const camoTypes = ['Multiplayer', 'Zombies', 'Campaign', 'Warzone']

const categoryWeapons = computed(() => {
  return camoStore.weapons.filter(w => w.category === props.category)
})

const getCategoryTypeProgress = (type) => {
  const typeKey = type.toLowerCase()
  const completed = categoryWeapons.value.filter(w => w[typeKey].mastery >= 1).length
  const total = categoryWeapons.value.length
  return {
    completed,
    total,
    percentage: total > 0 ? (completed / total) * 100 : 0
  }
}

const getMasteryName = (level) => {
  const names = ['None', 'Gold', 'Diamond', 'Dark Spine', 'Dark Matter']
  return names[level] || 'None'
}

const getMasteryShortName = (level) => {
  const names = ['—', 'G', 'D', 'DS', 'DM']
  return names[level] || '—'
}

const getMasteryBadgeClass = (level) => {
  const classes = [
    'bg-gray-700 text-gray-500 border-gray-600',
    'bg-yellow-600 text-white border-yellow-500',
    'bg-cyan-600 text-white border-cyan-500',
    'bg-purple-600 text-white border-purple-500',
    'bg-pink-600 text-white border-pink-500'
  ]
  return classes[level] || classes[0]
}

const getPrestigeName = (tier) => {
  const tiers = ['0', '1', 'Master']
  return tiers[tier] || '0'
}

const getTypeColor = (type) => {
  const colors = {
    'Multiplayer': 'text-red-400',
    'Zombies': 'text-green-400',
    'Campaign': 'text-blue-400',
    'Warzone': 'text-orange-400'
  }
  return colors[type] || 'text-gray-400'
}

const getTypeIcon = (type) => {
  const icons = {
    'Multiplayer': Target,
    'Zombies': Skull,
    'Campaign': Mountain,
    'Warzone': Plane
  }
  return icons[type] || Crosshair
}

const getTypeGradient = (type) => {
  const gradients = {
    'Multiplayer': 'bg-gradient-to-r from-red-600 to-pink-600',
    'Zombies': 'bg-gradient-to-r from-green-600 to-emerald-600',
    'Campaign': 'bg-gradient-to-r from-blue-600 to-cyan-600',
    'Warzone': 'bg-gradient-to-r from-orange-600 to-amber-600'
  }
  return gradients[type] || 'bg-gradient-to-r from-gray-600 to-gray-500'
}

const getCategoryIcon = () => {
  const icons = {
    'Assault Rifles': Crosshair,
    'SMGs': Zap,
    'Shotguns': Target,
    'LMGs': Cpu,
    'Marksman Rifles': Gauge,
    'Sniper Rifles': Crosshair,
    'Pistols': Target,
    'Launchers': Hammer,
    'Melee': Shield
  }
  return icons[props.category] || Crosshair
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>