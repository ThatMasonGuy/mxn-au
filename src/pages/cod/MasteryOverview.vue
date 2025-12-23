<template>
  <div class="space-y-6">
    <!-- Mastery Cards for Each Type -->
    <div 
      v-for="type in camoTypes" 
      :key="type"
      class="bg-gray-800 border border-gray-700 rounded-xl p-6"
    >
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center"
          :class="getTypeBackgroundClass(type)">
          <component :is="getTypeIcon(type)" class="w-6 h-6 text-white" />
        </div>
        <h2 class="text-2xl font-bold text-white">{{ type }} Mastery</h2>
      </div>

      <!-- Mastery Tiers -->
      <div class="space-y-4">
        <!-- Gold -->
        <div class="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-600 to-amber-600 flex items-center justify-center">
                <Award class="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Gold</h3>
                <p class="text-sm text-gray-400">Complete all base camos (9 Military + 3 Special)</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-yellow-400">
                {{ getMasteryProgress(type, 1).completed }}
              </div>
              <div class="text-sm text-gray-400">weapons</div>
            </div>
          </div>
          <div class="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-yellow-600 to-amber-600 transition-all duration-300"
              :style="{ width: `${getMasteryProgress(type, 1).percentage}%` }"
            ></div>
          </div>
        </div>

        <!-- Diamond -->
        <div class="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center">
                <Diamond class="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Diamond</h3>
                <p class="text-sm text-gray-400">Get Gold on all weapons in each category</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-cyan-400">
                {{ getMasteryProgress(type, 2).completed }}
              </div>
              <div class="text-sm text-gray-400">weapons</div>
            </div>
          </div>
          <div class="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-cyan-600 to-blue-600 transition-all duration-300"
              :style="{ width: `${getMasteryProgress(type, 2).percentage}%` }"
            ></div>
          </div>

          <!-- Category Breakdown -->
          <div class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
            <div 
              v-for="category in camoStore.weaponCategories"
              :key="`${type}-${category}`"
              class="bg-gray-800 border border-gray-700 rounded-lg p-3"
            >
              <div class="flex items-center gap-2 mb-2">
                <div 
                  class="w-3 h-3 rounded-full"
                  :class="isCategoryComplete(type, category) ? 'bg-cyan-500' : 'bg-gray-600'"
                ></div>
                <div class="text-xs text-gray-400">{{ category }}</div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-white">
                  {{ getCategoryGoldCount(type, category) }}/{{ getCategoryTotalWeapons(category) }}
                </span>
                <component 
                  :is="isCategoryComplete(type, category) ? CheckCircle2 : Circle"
                  class="w-4 h-4"
                  :class="isCategoryComplete(type, category) ? 'text-cyan-500' : 'text-gray-600'"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Dark Spine -->
        <div class="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center">
                <Zap class="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Dark Spine</h3>
                <p class="text-sm text-gray-400">Complete challenges on 30 weapons total</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-purple-400">
                {{ getMasteryProgress(type, 3).completed }}<span class="text-gray-500">/30</span>
              </div>
              <div class="text-sm text-gray-400">weapons</div>
            </div>
          </div>
          <div class="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-purple-600 to-violet-600 transition-all duration-300"
              :style="{ width: `${Math.min(100, (getMasteryProgress(type, 3).completed / 30) * 100)}%` }"
            ></div>
          </div>
        </div>

        <!-- Dark Matter -->
        <div class="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 flex items-center justify-center">
                <Flame class="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Dark Matter</h3>
                <p class="text-sm text-gray-400">Auto-unlocks after 30 Dark Spine completions</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold" :class="getMasteryProgress(type, 3).completed >= 30 ? 'text-pink-400' : 'text-gray-600'">
                {{ getMasteryProgress(type, 3).completed >= 30 ? 'UNLOCKED' : 'LOCKED' }}
              </div>
              <div class="text-sm text-gray-400">
                {{ getMasteryProgress(type, 3).completed >= 30 ? 'Complete' : `${30 - getMasteryProgress(type, 3).completed} to go` }}
              </div>
            </div>
          </div>
          <div class="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-pink-600 to-rose-600 transition-all duration-300"
              :style="{ width: getMasteryProgress(type, 3).completed >= 30 ? '100%' : '0%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Award, Diamond, Zap, Flame, Target, Skull, Mountain, Plane, CheckCircle2, Circle } from 'lucide-vue-next'
import { useCamoStore } from './camoStore'

const camoStore = useCamoStore()
const camoTypes = ['Multiplayer', 'Zombies', 'Campaign', 'Warzone']

const getMasteryProgress = (type, level) => {
  const typeKey = type.toLowerCase()
  const completed = camoStore.weapons.filter(w => w[typeKey].mastery >= level).length
  const total = camoStore.weapons.length
  return {
    completed,
    total,
    percentage: total > 0 ? (completed / total) * 100 : 0
  }
}

const getCategoryGoldCount = (type, category) => {
  const typeKey = type.toLowerCase()
  return camoStore.weapons.filter(w => 
    w.category === category && w[typeKey].mastery >= 1
  ).length
}

const getCategoryTotalWeapons = (category) => {
  return camoStore.weapons.filter(w => w.category === category).length
}

const isCategoryComplete = (type, category) => {
  const typeKey = type.toLowerCase()
  const categoryWeapons = camoStore.weapons.filter(w => w.category === category)
  if (categoryWeapons.length === 0) return false
  return categoryWeapons.every(w => w[typeKey].mastery >= 1)
}

const getTypeIcon = (type) => {
  const icons = {
    'Multiplayer': Target,
    'Zombies': Skull,
    'Campaign': Mountain,
    'Warzone': Plane
  }
  return icons[type] || Target
}

const getTypeBackgroundClass = (type) => {
  const classes = {
    'Multiplayer': 'bg-gradient-to-br from-red-600 to-pink-600',
    'Zombies': 'bg-gradient-to-br from-green-600 to-emerald-600',
    'Campaign': 'bg-gradient-to-br from-blue-600 to-cyan-600',
    'Warzone': 'bg-gradient-to-br from-orange-600 to-amber-600'
  }
  return classes[type] || 'bg-gradient-to-br from-gray-600 to-gray-500'
}
</script>