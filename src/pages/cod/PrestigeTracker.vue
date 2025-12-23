<template>
  <div class="space-y-6">
    <!-- Overall Prestige Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gray-800 border border-cyan-500/30 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Medal class="w-6 h-6 text-white" />
          </div>
          <div class="text-sm text-gray-400 font-medium">Prestige Master</div>
        </div>
        <div class="text-4xl font-bold text-cyan-400 mb-1">
          {{ prestigeMasterCount }}
        </div>
        <div class="text-sm text-gray-500">
          {{ prestigeMasterCount }}/{{ camoStore.totalWeapons }} weapons
        </div>
      </div>

      <div class="bg-gray-800 border border-purple-500/30 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Crown class="w-6 h-6 text-white" />
          </div>
          <div class="text-sm text-gray-400 font-medium">Max Prestige (Lvl 250)</div>
        </div>
        <div class="text-4xl font-bold text-purple-400 mb-1">
          {{ maxPrestigeCount }}
        </div>
        <div class="text-sm text-gray-500">
          {{ maxPrestigeCount }}/{{ camoStore.totalWeapons }} weapons
        </div>
      </div>

      <div class="bg-gray-800 border border-pink-500/30 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-gradient-to-br from-pink-600 to-rose-600 rounded-lg flex items-center justify-center">
            <TrendingUp class="w-6 h-6 text-white" />
          </div>
          <div class="text-sm text-gray-400 font-medium">Average Level</div>
        </div>
        <div class="text-4xl font-bold text-pink-400 mb-1">
          {{ averageLevel }}
        </div>
        <div class="text-sm text-gray-500">
          out of 250
        </div>
      </div>
    </div>

    <!-- Prestige Milestones -->
    <div class="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <div class="flex items-center gap-3 mb-6">
        <Trophy class="w-6 h-6 text-orange-400" />
        <h2 class="text-2xl font-bold text-white">Prestige Milestones</h2>
      </div>
      
      <div class="space-y-4">
        <!-- Universal Camo 1 (Prestige 1) -->
        <div class="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-cyan-600/20 border border-cyan-500/30 rounded-lg flex items-center justify-center">
                <Star class="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 class="text-base font-bold text-white">Universal Camo 1</h3>
                <p class="text-xs text-gray-400">Prestige weapon once</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-cyan-400">
                {{ getUniversalCamoCount(1) }}
              </div>
              <div class="text-xs text-gray-400">weapons</div>
            </div>
          </div>
          <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-cyan-600 to-blue-600 transition-all duration-300"
              :style="{ width: `${getUniversalCamoPercentage(1)}%` }"
            ></div>
          </div>
        </div>

        <!-- Universal Camo 2 (Prestige 2) -->
        <div class="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-cyan-600/20 border border-cyan-500/30 rounded-lg flex items-center justify-center">
                <Star class="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 class="text-base font-bold text-white">Universal Camo 2</h3>
                <p class="text-xs text-gray-400">Prestige weapon twice</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-cyan-400">
                {{ getUniversalCamoCount(2) }}
              </div>
              <div class="text-xs text-gray-400">weapons</div>
            </div>
          </div>
          <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-cyan-600 to-blue-600 transition-all duration-300"
              :style="{ width: `${getUniversalCamoPercentage(2)}%` }"
            ></div>
          </div>
        </div>

        <!-- Weapon Specific Camo 1 (Level 100) -->
        <div class="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                <Sparkles class="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 class="text-base font-bold text-white">Weapon Specific Camo 1</h3>
                <p class="text-xs text-gray-400">Reach level 100</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-purple-400">
                {{ getWeaponSpecificCount(1) }}
              </div>
              <div class="text-xs text-gray-400">weapons</div>
            </div>
          </div>
          <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
              :style="{ width: `${getWeaponSpecificPercentage(1)}%` }"
            ></div>
          </div>
        </div>

        <!-- Weapon Specific Camo 2 (Level 150) -->
        <div class="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                <Sparkles class="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 class="text-base font-bold text-white">Weapon Specific Camo 2</h3>
                <p class="text-xs text-gray-400">Reach level 150</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-purple-400">
                {{ getWeaponSpecificCount(2) }}
              </div>
              <div class="text-xs text-gray-400">weapons</div>
            </div>
          </div>
          <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
              :style="{ width: `${getWeaponSpecificPercentage(2)}%` }"
            ></div>
          </div>
        </div>

        <!-- Weapon Specific Camo 3 (Level 200) -->
        <div class="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                <Sparkles class="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 class="text-base font-bold text-white">Weapon Specific Camo 3</h3>
                <p class="text-xs text-gray-400">Reach level 200</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-purple-400">
                {{ getWeaponSpecificCount(3) }}
              </div>
              <div class="text-xs text-gray-400">weapons</div>
            </div>
          </div>
          <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
              :style="{ width: `${getWeaponSpecificPercentage(3)}%` }"
            ></div>
          </div>
        </div>

        <!-- Max Prestige Universal Camo (Level 250) -->
        <div class="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-pink-600/20 border border-pink-500/30 rounded-lg flex items-center justify-center">
                <Crown class="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h3 class="text-base font-bold text-white">Max Prestige Universal Camo</h3>
                <p class="text-xs text-gray-400">Reach level 250</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-pink-400">
                {{ maxPrestigeCount }}
              </div>
              <div class="text-xs text-gray-400">weapons</div>
            </div>
          </div>
          <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-pink-600 to-rose-600 transition-all duration-300"
              :style="{ width: `${(maxPrestigeCount / Math.max(1, camoStore.totalWeapons)) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Weapon Level Breakdown -->
    <div class="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <div class="flex items-center gap-3 mb-6">
        <BarChart3 class="w-6 h-6 text-orange-400" />
        <h2 class="text-2xl font-bold text-white">Weapon Level Breakdown</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="weapon in sortedWeaponsByLevel"
          :key="weapon.id"
          class="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all"
        >
          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 class="text-white font-bold">{{ weapon.name }}</h3>
              <p class="text-sm text-gray-400">{{ weapon.category }}</p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-cyan-400">
                {{ weapon.prestige.level }}
              </div>
              <div class="text-xs text-gray-400">
                {{ getPrestigeTierName(weapon.prestige.prestigeTier) }}
              </div>
            </div>
          </div>
          <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              :style="{ width: `${(weapon.prestige.level / 250) * 100}%` }"
            ></div>
          </div>
        </div>
        
        <div v-if="camoStore.weapons.length === 0" class="col-span-full text-center py-12">
          <Package class="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p class="text-gray-400 text-lg mb-2">No weapons added yet</p>
          <p class="text-gray-500 text-sm">Add weapons to start tracking prestige progress</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Medal, Crown, TrendingUp, Trophy, Star, Sparkles, BarChart3, Package } from 'lucide-vue-next'
import { useCamoStore } from './camoStore'

const camoStore = useCamoStore()

const prestigeMasterCount = computed(() => {
  return camoStore.weapons.filter(w => w.prestige.prestigeTier >= 2).length
})

const maxPrestigeCount = computed(() => {
  return camoStore.weapons.filter(w => w.prestige.level >= 250).length
})

const averageLevel = computed(() => {
  if (camoStore.weapons.length === 0) return 0
  const sum = camoStore.weapons.reduce((acc, w) => acc + w.prestige.level, 0)
  return Math.round(sum / camoStore.weapons.length)
})

const sortedWeaponsByLevel = computed(() => {
  return [...camoStore.weapons].sort((a, b) => b.prestige.level - a.prestige.level)
})

const getUniversalCamoCount = (tier) => {
  return camoStore.weapons.filter(w => w.prestige.universalCamos >= tier).length
}

const getUniversalCamoPercentage = (tier) => {
  if (camoStore.totalWeapons === 0) return 0
  return (getUniversalCamoCount(tier) / camoStore.totalWeapons) * 100
}

const getWeaponSpecificCount = (tier) => {
  return camoStore.weapons.filter(w => w.prestige.weaponSpecificCamos >= tier).length
}

const getWeaponSpecificPercentage = (tier) => {
  if (camoStore.totalWeapons === 0) return 0
  return (getWeaponSpecificCount(tier) / camoStore.totalWeapons) * 100
}

const getPrestigeTierName = (tier) => {
  const names = ['0', 'P1', 'Master']
  return names[tier] || '0'
}
</script>