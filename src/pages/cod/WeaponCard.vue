<template>
  <div class="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 shadow-xl hover:shadow-orange-500/20">
    <!-- Animated background accent -->
    <div class="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <!-- Weapon Header -->
    <div class="relative p-5 flex items-center justify-between bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-sm border-b border-gray-700/50">
      <div class="flex items-center gap-4">
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl blur-md opacity-50"></div>
          <div class="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300 shadow-lg">
            <Crosshair class="w-9 h-9 text-white" />
          </div>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-white tracking-tight">{{ weapon.name }}</h3>
          <div class="flex items-center gap-2 mt-1.5">
            <Layers class="w-4 h-4 text-gray-400" />
            <p class="text-sm text-gray-400 font-medium">{{ weapon.category }}</p>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <button
          @click="expanded = !expanded"
          class="relative p-2.5 bg-gray-800/80 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 group border border-gray-700 hover:border-gray-600"
          :title="expanded ? 'Collapse' : 'Expand'"
        >
          <component :is="expanded ? ChevronUp : ChevronDown" class="w-5 h-5 transition-transform duration-300" :class="expanded ? 'rotate-0' : 'group-hover:-translate-y-0.5'" />
        </button>
        <button
          @click="$emit('delete', weapon.id)"
          class="relative p-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 border border-red-600/20 hover:border-red-500/40"
          title="Delete weapon"
        >
          <Trash2 class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Quick Overview -->
    <div class="relative p-5 grid grid-cols-2 md:grid-cols-5 gap-3 bg-gray-900/30">
      <div 
        v-for="type in camoTypes" 
        :key="type"
        class="relative group text-center p-4 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:border-gray-600 transition-all duration-300 hover:shadow-lg overflow-hidden"
      >
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" :class="getTypeGlowClass(type)"></div>
        <div class="relative">
          <div class="flex items-center justify-center gap-2 mb-2">
            <component :is="getTypeIcon(type)" class="w-4 h-4" :class="getTypeColor(type)" />
            <div class="text-xs text-gray-400 font-medium uppercase tracking-wide">{{ type }}</div>
          </div>
          <div class="text-xl font-bold mb-1.5" :class="getMasteryColor(weapon[type.toLowerCase()].mastery)">
            {{ getMasteryShortName(weapon[type.toLowerCase()].mastery) }}
          </div>
          <div class="text-xs text-gray-500 font-medium">
            {{ weapon[type.toLowerCase()].military + getSpecialCamoCount(type.toLowerCase()) }}/12
          </div>
        </div>
      </div>
      
      <div class="relative group text-center p-4 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative">
          <div class="flex items-center justify-center gap-2 mb-2">
            <Star class="w-4 h-4 text-cyan-400" />
            <div class="text-xs text-gray-400 font-medium uppercase tracking-wide">Prestige</div>
          </div>
          <div class="text-xl font-bold text-cyan-400 mb-1.5">
            {{ getPrestigeName(weapon.prestige.prestigeTier) }}
          </div>
          <div class="text-xs text-gray-500 font-medium">
            Level {{ weapon.prestige.level }}
          </div>
        </div>
      </div>
    </div>

    <!-- Expanded Details -->
    <Transition name="expand">
      <div v-if="expanded" class="border-t border-gray-700/50">
        <!-- Mode Tabs with glow effect -->
        <div class="flex border-b border-gray-700/50 bg-gray-900/50 overflow-x-auto backdrop-blur-sm">
          <button
            v-for="type in camoTypes"
            :key="type"
            @click="activeMode = type"
            class="relative flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all whitespace-nowrap group"
            :class="activeMode === type 
              ? 'text-white bg-gray-800/50' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/30'"
          >
            <component :is="getTypeIcon(type)" class="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            {{ type }}
            <div v-if="activeMode === type" class="absolute bottom-0 left-0 right-0 h-0.5" :class="getTypeGradient(type)"></div>
          </button>
          <button
            @click="activeMode = 'Prestige'"
            class="relative flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all whitespace-nowrap group"
            :class="activeMode === 'Prestige' 
              ? 'text-white bg-gray-800/50' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/30'"
          >
            <Star class="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            Prestige
            <div v-if="activeMode === 'Prestige'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          </button>
        </div>

        <!-- Mode Content -->
        <div class="p-6 space-y-6 bg-gradient-to-b from-gray-900/20 to-transparent">
          <div v-if="activeMode !== 'Prestige'">
            <!-- Military Camos -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Shield class="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 class="text-lg font-bold text-white">Military Camos</h4>
                </div>
                <span class="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm font-bold text-blue-400">
                  {{ weapon[activeMode.toLowerCase()].military }}/9
                </span>
              </div>
              
              <div class="grid grid-cols-1 gap-2">
                <button
                  v-for="i in 9"
                  :key="`mil-${i}`"
                  @click="toggleMilitary(activeMode.toLowerCase(), i)"
                  class="relative group flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 overflow-hidden"
                  :class="weapon[activeMode.toLowerCase()].military >= i 
                    ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 shadow-lg shadow-blue-500/20 border border-blue-500/30' 
                    : 'bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50 hover:border-gray-600'"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div class="relative flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold transition-all duration-300"
                    :class="weapon[activeMode.toLowerCase()].military >= i 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50'">
                    {{ i }}
                  </div>
                  <div class="relative flex-1 text-left">
                    <div class="text-sm font-medium transition-colors duration-300"
                      :class="weapon[activeMode.toLowerCase()].military >= i ? 'text-white' : 'text-gray-300 group-hover:text-white'">
                      {{ getMilitaryChallenge(activeMode, i - 1) }}
                    </div>
                  </div>
                  <component 
                    :is="weapon[activeMode.toLowerCase()].military >= i ? CheckCircle2 : Circle"
                    class="relative w-6 h-6 transition-all duration-300"
                    :class="weapon[activeMode.toLowerCase()].military >= i ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'"
                  />
                </button>
              </div>
            </div>

            <!-- Special Camos -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Sparkles class="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 class="text-lg font-bold text-white">Special Camos</h4>
                    <p class="text-xs text-gray-500">Requires all military camos complete</p>
                  </div>
                </div>
                <span class="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm font-bold text-purple-400">
                  {{ getSpecialCamoCount(activeMode.toLowerCase()) }}/3
                </span>
              </div>
              
              <div class="grid grid-cols-1 gap-2">
                <button
                  v-for="(_, i) in 3"
                  :key="`spec-${i}`"
                  @click="toggleSpecial(activeMode.toLowerCase(), i)"
                  :disabled="!canUnlockSpecial(activeMode.toLowerCase())"
                  class="relative group flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 overflow-hidden"
                  :class="[
                    weapon[activeMode.toLowerCase()].special[i]
                      ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 shadow-lg shadow-purple-500/20 border border-purple-500/30' 
                      : 'bg-gray-800/40 border border-gray-700/50',
                    canUnlockSpecial(activeMode.toLowerCase())
                      ? 'hover:bg-gray-800/60 hover:border-gray-600 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  ]"
                >
                  <div v-if="weapon[activeMode.toLowerCase()].special[i]" class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div class="relative flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold transition-all duration-300"
                    :class="weapon[activeMode.toLowerCase()].special[i]
                      ? 'bg-white/20 text-white shadow-lg' 
                      : canUnlockSpecial(activeMode.toLowerCase())
                        ? 'bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50'
                        : 'bg-gray-800 text-gray-600'">
                    {{ i + 1 }}
                  </div>
                  <div class="relative flex-1 text-left">
                    <div class="text-sm font-medium transition-colors duration-300"
                      :class="weapon[activeMode.toLowerCase()].special[i] ? 'text-white' : canUnlockSpecial(activeMode.toLowerCase()) ? 'text-gray-300 group-hover:text-white' : 'text-gray-600'">
                      {{ getSpecialChallenge(activeMode, i) }}
                    </div>
                  </div>
                  <component 
                    :is="weapon[activeMode.toLowerCase()].special[i] ? CheckCircle2 : canUnlockSpecial(activeMode.toLowerCase()) ? Circle : Lock"
                    class="relative w-6 h-6 transition-all duration-300"
                    :class="weapon[activeMode.toLowerCase()].special[i] ? 'text-white' : canUnlockSpecial(activeMode.toLowerCase()) ? 'text-gray-600 group-hover:text-gray-400' : 'text-gray-700'"
                  />
                </button>
              </div>
            </div>

            <!-- Mastery Tiers -->
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <Trophy class="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h4 class="text-lg font-bold text-white">Mastery</h4>
                  <p class="text-xs text-gray-500">Requires all special camos complete</p>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  v-for="(tier, idx) in currentMasteryTiers"
                  :key="`mastery-${idx}`"
                  @click="toggleMastery(activeMode.toLowerCase(), idx + 1)"
                  :disabled="!canUnlockMastery(activeMode.toLowerCase(), idx + 1)"
                  class="relative group flex items-center gap-3 p-4 rounded-xl transition-all duration-300 overflow-hidden"
                  :class="[
                    weapon[activeMode.toLowerCase()].mastery >= idx + 1
                      ? getMasteryButtonClass(idx + 1)
                      : 'bg-gray-800/40 border border-gray-700/50',
                    canUnlockMastery(activeMode.toLowerCase(), idx + 1)
                      ? 'hover:bg-gray-800/60 hover:border-gray-600 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  ]"
                >
                  <component :is="getMasteryIcon(idx + 1)" class="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
                    :class="weapon[activeMode.toLowerCase()].mastery >= idx + 1 ? 'text-white' : canUnlockMastery(activeMode.toLowerCase(), idx + 1) ? 'text-gray-400' : 'text-gray-700'" />
                  <div class="flex-1 text-left">
                    <div class="text-sm font-bold"
                      :class="weapon[activeMode.toLowerCase()].mastery >= idx + 1 ? 'text-white' : canUnlockMastery(activeMode.toLowerCase(), idx + 1) ? 'text-gray-300' : 'text-gray-600'">
                      {{ tier.name }}
                    </div>
                    <div class="text-xs"
                      :class="weapon[activeMode.toLowerCase()].mastery >= idx + 1 ? 'text-white/70' : canUnlockMastery(activeMode.toLowerCase(), idx + 1) ? 'text-gray-500' : 'text-gray-700'">
                      {{ tier.requirement }}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Prestige Content -->
          <div v-else class="space-y-6">
            <!-- Level Progress -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    <TrendingUp class="w-5 h-5 text-cyan-400" />
                  </div>
                  <h4 class="text-lg font-bold text-white">Weapon Level</h4>
                </div>
                <input
                  type="number"
                  :value="weapon.prestige.level"
                  @input="updatePrestigeLevel($event.target.value)"
                  class="w-28 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none font-bold text-center transition-all duration-300"
                  min="0"
                  max="250"
                />
              </div>
              
              <div class="relative h-5 bg-gray-800 rounded-full overflow-hidden border border-gray-700 shadow-inner">
                <div 
                  class="absolute h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 transition-all duration-500 shadow-lg"
                  :style="{ width: `${(weapon.prestige.level / 250) * 100}%` }"
                ></div>
                <div class="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-lg">
                  {{ weapon.prestige.level }} / 250
                </div>
              </div>
            </div>

            <!-- Prestige Tier -->
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <Medal class="w-5 h-5 text-cyan-400" />
                </div>
                <h4 class="text-lg font-bold text-white">Prestige Tier</h4>
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <button
                  v-for="(tier, idx) in prestigeTiers"
                  :key="`prestige-${idx}`"
                  @click="updatePrestige('prestigeTier', idx)"
                  class="relative p-4 rounded-xl text-sm font-bold transition-all duration-300 border overflow-hidden group"
                  :class="weapon.prestige.prestigeTier === idx
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg border-cyan-500 shadow-cyan-500/20'
                    : 'bg-gray-800/40 hover:bg-gray-800/60 text-gray-400 hover:text-white border-gray-700 hover:border-gray-600'"
                >
                  <div v-if="weapon.prestige.prestigeTier === idx" class="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="relative">{{ tier }}</span>
                </button>
              </div>
            </div>

            <!-- Universal Camos -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    <Globe class="w-5 h-5 text-cyan-400" />
                  </div>
                  <h4 class="text-lg font-bold text-white">Universal Camos</h4>
                </div>
                <span class="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm font-bold text-cyan-400">
                  {{ weapon.prestige.universalCamos }}/3
                </span>
              </div>
              
              <div class="grid grid-cols-1 gap-2">
                <button
                  v-for="i in 3"
                  :key="`universal-${i}`"
                  @click="updatePrestige('universalCamos', i)"
                  class="relative group flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 overflow-hidden"
                  :class="weapon.prestige.universalCamos >= i 
                    ? 'bg-gradient-to-r from-cyan-600/80 to-blue-600/80 shadow-lg shadow-cyan-500/20 border border-cyan-500/30' 
                    : 'bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50 hover:border-gray-600'"
                >
                  <div class="relative text-sm font-medium"
                    :class="weapon.prestige.universalCamos >= i ? 'text-white' : 'text-gray-300 group-hover:text-white'">
                    Prestige {{ i }} Universal Camo
                  </div>
                  <component 
                    :is="weapon.prestige.universalCamos >= i ? CheckCircle2 : Circle"
                    class="relative w-6 h-6 ml-auto transition-all duration-300"
                    :class="weapon.prestige.universalCamos >= i ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'"
                  />
                </button>
              </div>
            </div>

            <!-- Weapon Specific Camos -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Sparkles class="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 class="text-lg font-bold text-white">Weapon Specific Camos</h4>
                </div>
                <span class="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm font-bold text-purple-400">
                  {{ weapon.prestige.weaponSpecificCamos }}/3
                </span>
              </div>
              
              <div class="grid grid-cols-1 gap-2">
                <button
                  v-for="(level, i) in [100, 150, 200]"
                  :key="`specific-${i}`"
                  @click="updatePrestige('weaponSpecificCamos', i + 1)"
                  class="relative group flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 overflow-hidden"
                  :class="weapon.prestige.weaponSpecificCamos >= i + 1 
                    ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 shadow-lg shadow-purple-500/20 border border-purple-500/30' 
                    : 'bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50 hover:border-gray-600'"
                >
                  <div class="relative text-sm font-medium"
                    :class="weapon.prestige.weaponSpecificCamos >= i + 1 ? 'text-white' : 'text-gray-300 group-hover:text-white'">
                    Level {{ level }} Weapon Camo
                  </div>
                  <component 
                    :is="weapon.prestige.weaponSpecificCamos >= i + 1 ? CheckCircle2 : Circle"
                    class="relative w-6 h-6 ml-auto transition-all duration-300"
                    :class="weapon.prestige.weaponSpecificCamos >= i + 1 ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Crosshair, ChevronDown, ChevronUp, Trash2, Layers, Star, Shield, 
  Sparkles, Trophy, CheckCircle2, Circle, Award, Diamond, Zap, 
  Flame, TrendingUp, Medal, Globe, Target, Skull, Mountain, Plane, Lock
} from 'lucide-vue-next'
import { useCamoStore } from './camoStore'

const props = defineProps({
  weapon: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'delete'])

const camoStore = useCamoStore()
const expanded = ref(false)
const activeMode = ref('Multiplayer')
const camoTypes = ['Multiplayer', 'Zombies', 'Campaign', 'Warzone']
const masteryTiers = camoStore.masteryTiers
const prestigeTiers = ['0', '1', 'Master']

// Get actual mastery tiers for current mode from weapon definition
const currentMasteryTiers = computed(() => {
  const mode = activeMode.value.toLowerCase()
  const tiers = props.weapon.definition?.[mode]?.mastery || []
  
  // Return the actual tiers from definition, or fallback to generic
  return tiers.length > 0 ? tiers : masteryTiers
})

const getSpecialCamoCount = (camoType) => {
  return props.weapon[camoType].special.filter(s => s).length
}

const toggleMilitary = (camoType, value) => {
  // Allow toggling - if clicking on current value, decrease by 1, else set to value
  const currentValue = props.weapon[camoType].military
  const newValue = currentValue === value ? value - 1 : value
  emit('update', {
    weaponId: props.weapon.id,
    camoType,
    field: 'military',
    value: newValue
  })
}

const toggleSpecial = (camoType, index) => {
  if (canUnlockSpecial(camoType)) {
    // Toggle the special camo at this index
    const newSpecial = [...props.weapon[camoType].special]
    newSpecial[index] = !newSpecial[index]
    emit('update', {
      weaponId: props.weapon.id,
      camoType,
      field: 'special',
      value: newSpecial
    })
  }
}

const toggleMastery = (camoType, value) => {
  if (canUnlockMastery(camoType, value)) {
    // Allow toggling - if clicking on current value, decrease by 1, else set to value
    const currentValue = props.weapon[camoType].mastery
    const newValue = currentValue === value ? value - 1 : value
    emit('update', {
      weaponId: props.weapon.id,
      camoType,
      field: 'mastery',
      value: newValue
    })
  }
}

const canUnlockSpecial = (camoType) => {
  // Must complete all 9 military camos first
  return props.weapon[camoType].military >= 9
}

const canUnlockMastery = (camoType, level) => {
  if (level === 1) {
    // Gold requires all military + all special
    return props.weapon[camoType].military >= 9 && getSpecialCamoCount(camoType) >= 3
  }
  // For other mastery tiers, must have previous tier
  return props.weapon[camoType].mastery >= level - 1
}

const updatePrestige = (field, value) => {
  // Allow toggling for tiers
  if (field === 'prestigeTier') {
    const currentValue = props.weapon.prestige.prestigeTier
    const newValue = currentValue === value ? 0 : value
    emit('update', {
      weaponId: props.weapon.id,
      camoType: 'prestige',
      field,
      value: newValue
    })
  } else {
    // For camos, allow toggling
    const currentValue = props.weapon.prestige[field]
    const newValue = currentValue === value ? value - 1 : value
    emit('update', {
      weaponId: props.weapon.id,
      camoType: 'prestige',
      field,
      value: newValue
    })
  }
}

const updatePrestigeLevel = (value) => {
  const level = Math.min(250, Math.max(0, parseInt(value) || 0))
  emit('update', {
    weaponId: props.weapon.id,
    camoType: 'prestige',
    field: 'level',
    value: level
  })
}

const getMasteryShortName = (level) => {
  const names = ['—', 'GOLD', 'DIAM', 'D-SPINE', 'D-MATTER']
  return names[level] || '—'
}

const getMasteryColor = (level) => {
  const colors = ['text-gray-600', 'text-yellow-400', 'text-cyan-400', 'text-purple-400', 'text-pink-400']
  return colors[level] || colors[0]
}

const getMasteryButtonClass = (level) => {
  const classes = [
    '',
    'bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-lg border border-yellow-500 shadow-yellow-500/20',
    'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg border border-cyan-500 shadow-cyan-500/20',
    'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg border border-purple-500 shadow-purple-500/20',
    'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg border border-pink-500 shadow-pink-500/20'
  ]
  return classes[level] || ''
}

const getMasteryIcon = (level) => {
  const icons = [null, Award, Diamond, Zap, Flame]
  return icons[level] || Circle
}

const getPrestigeName = (tier) => {
  return prestigeTiers[tier] || '0'
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

const getTypeGlowClass = (type) => {
  const glows = {
    'Multiplayer': 'bg-gradient-to-br from-red-500/10 to-pink-500/10',
    'Zombies': 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
    'Campaign': 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
    'Warzone': 'bg-gradient-to-br from-orange-500/10 to-amber-500/10'
  }
  return glows[type] || ''
}

const getTypeIcon = (type) => {
  const icons = {
    'Multiplayer': Target,
    'Zombies': Skull,
    'Campaign': Mountain,
    'Warzone': Plane
  }
  return icons[type] || Circle
}

const getTypeGradient = (type) => {
  const gradients = {
    'Multiplayer': 'bg-gradient-to-r from-red-500 to-pink-500',
    'Zombies': 'bg-gradient-to-r from-green-500 to-emerald-500',
    'Campaign': 'bg-gradient-to-r from-blue-500 to-cyan-500',
    'Warzone': 'bg-gradient-to-r from-orange-500 to-amber-500'
  }
  return gradients[type] || 'bg-gradient-to-r from-gray-500 to-gray-400'
}

const getMilitaryChallenge = (mode, index) => {
  const modeKey = mode.toLowerCase()
  const challenge = props.weapon.definition?.[modeKey]?.military?.[index]
  if (!challenge) return 'Challenge not available'
  return `${challenge.name} - ${challenge.count}`
}

const getSpecialChallenge = (mode, index) => {
  const modeKey = mode.toLowerCase()
  const challenge = props.weapon.definition?.[modeKey]?.special?.[index]
  return challenge || 'Challenge not available'
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 3000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>