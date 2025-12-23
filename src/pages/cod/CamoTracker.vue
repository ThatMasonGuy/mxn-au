<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
    <div class="max-w-7xl mx-auto p-4 md:p-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-4">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl blur-xl opacity-50 animate-pulse"></div>
              <div class="relative w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-2xl">
                <Target class="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 class="text-4xl md:text-5xl font-black text-white tracking-tight">Black Ops 7</h1>
              <p class="text-gray-400 text-sm font-medium tracking-wide">CAMO GRIND TRACKER</p>
            </div>
          </div>
          <button
            @click="showAdmin = true"
            class="flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all border border-gray-700 hover:border-gray-600"
          >
            <Database class="w-5 h-5" />
            <span>Admin</span>
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative mb-6">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            v-model="searchQuery"
            type="text"
            class="w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none text-lg"
            placeholder="Search weapons..."
          />
        </div>

        <!-- Mode-Specific Mastery Progress Bars -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Singularity (Multiplayer) -->
          <div class="bg-gray-800/50 backdrop-blur-sm border border-blue-500/30 rounded-xl p-5 hover:border-blue-500/50 transition-all">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Crosshair class="w-6 h-6 text-blue-400" />
              </div>
              <div class="flex-1">
                <div class="text-sm text-gray-400 font-medium">Singularity</div>
                <div class="text-xs text-gray-500 mb-1">Multiplayer</div>
                <div class="text-2xl font-black text-blue-400">{{ singularityCount }}<span class="text-lg text-gray-500">/30</span></div>
              </div>
            </div>
            <div class="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 rounded-full" 
                :style="{ width: `${(singularityCount / 30) * 100}%` }">
              </div>
            </div>
            <div class="text-xs text-gray-500 mt-2">{{ singularityCount >= 30 ? 'UNLOCKED!' : `${30 - singularityCount} more Tempest` }}</div>
          </div>

          <!-- Infestation (Zombies) -->
          <div class="bg-gray-800/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-5 hover:border-green-500/50 transition-all">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Skull class="w-6 h-6 text-green-400" />
              </div>
              <div class="flex-1">
                <div class="text-sm text-gray-400 font-medium">Infestation</div>
                <div class="text-xs text-gray-500 mb-1">Zombies</div>
                <div class="text-2xl font-black text-green-400">{{ infestationCount }}<span class="text-lg text-gray-500">/30</span></div>
              </div>
            </div>
            <div class="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 rounded-full" 
                :style="{ width: `${(infestationCount / 30) * 100}%` }">
              </div>
            </div>
            <div class="text-xs text-gray-500 mt-2">{{ infestationCount >= 30 ? 'UNLOCKED!' : `${30 - infestationCount} more Doomsteel` }}</div>
          </div>

          <!-- Genesis (Campaign) -->
          <div class="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5 hover:border-purple-500/50 transition-all">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Mountain class="w-6 h-6 text-purple-400" />
              </div>
              <div class="flex-1">
                <div class="text-sm text-gray-400 font-medium">Genesis</div>
                <div class="text-xs text-gray-500 mb-1">Campaign</div>
                <div class="text-2xl font-black text-purple-400">{{ genesisCount }}<span class="text-lg text-gray-500">/30</span></div>
              </div>
            </div>
            <div class="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-500 rounded-full" 
                :style="{ width: `${(genesisCount / 30) * 100}%` }">
              </div>
            </div>
            <div class="text-xs text-gray-500 mt-2">{{ genesisCount >= 30 ? 'UNLOCKED!' : `${30 - genesisCount} more Chroma Flux` }}</div>
          </div>

          <!-- Dark Matter (Warzone) -->
          <div class="bg-gray-800/50 backdrop-blur-sm border border-pink-500/30 rounded-xl p-5 hover:border-pink-500/50 transition-all">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <Plane class="w-6 h-6 text-pink-400" />
              </div>
              <div class="flex-1">
                <div class="text-sm text-gray-400 font-medium">Dark Matter</div>
                <div class="text-xs text-gray-500 mb-1">Warzone</div>
                <div class="text-2xl font-black text-pink-400">{{ darkMatterCount }}<span class="text-lg text-gray-500">/30</span></div>
              </div>
            </div>
            <div class="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500 rounded-full" 
                :style="{ width: `${(darkMatterCount / 30) * 100}%` }">
              </div>
            </div>
            <div class="text-xs text-gray-500 mt-2">{{ darkMatterCount >= 30 ? 'UNLOCKED!' : `${30 - darkMatterCount} more Dark Spine` }}</div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="camoStore.loading" class="text-center py-20">
        <div class="relative inline-block mb-6">
          <div class="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl animate-pulse"></div>
          <Target class="relative w-20 h-20 text-orange-500 mx-auto animate-spin" style="animation-duration: 3s;" />
        </div>
        <p class="text-gray-400 text-xl font-medium mb-2">Loading weapons...</p>
        <p class="text-gray-500 text-sm">Fetching from database</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="camoStore.weapons.length === 0" class="text-center py-20">
        <div class="relative inline-block mb-6">
          <div class="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl"></div>
          <Package class="relative w-20 h-20 text-gray-600 mx-auto" />
        </div>
        <p class="text-gray-400 text-xl font-medium mb-2">No weapons in database</p>
        <p class="text-gray-500 text-sm mb-6">Use the Admin interface to add weapons</p>
        <button
          @click="showAdmin = true"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-orange-500/25 transition-all"
        >
          <Database class="w-5 h-5" />
          Open Admin
        </button>
      </div>

      <!-- Weapons by Category -->
      <div v-else class="space-y-6">
        <!-- Category Sections -->
        <div
          v-for="category in categoriesWithWeapons"
          :key="category"
          class="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden"
        >
          <!-- Category Header -->
          <button
            @click="toggleCategory(category)"
            class="w-full flex items-center justify-between p-5 hover:bg-gray-800/50 transition-all group"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-500/30 group-hover:border-orange-500/50 transition-all">
                <component :is="getCategoryIcon(category)" class="w-6 h-6 text-orange-400" />
              </div>
              <div class="text-left">
                <h3 class="text-xl font-bold text-white">{{ category }}</h3>
                <p class="text-sm text-gray-400">{{ getCategoryWeapons(category).length }} weapons • {{ getCategoryCompletion(category) }}% complete</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <!-- Category Stats Mini -->
              <div class="hidden md:flex items-center gap-3">
                <div class="flex items-center gap-1.5" title="Singularity (MP Tier 3)">
                  <Crosshair class="w-4 h-4 text-blue-400" />
                  <span class="text-sm font-bold text-blue-400">{{ getCategoryMasteryCount(category, 'multiplayer', 3) }}</span>
                </div>
                <div class="flex items-center gap-1.5" title="Infestation (ZM Tier 3)">
                  <Skull class="w-4 h-4 text-green-400" />
                  <span class="text-sm font-bold text-green-400">{{ getCategoryMasteryCount(category, 'zombies', 3) }}</span>
                </div>
                <div class="flex items-center gap-1.5" title="Genesis (CP Tier 3)">
                  <Mountain class="w-4 h-4 text-purple-400" />
                  <span class="text-sm font-bold text-purple-400">{{ getCategoryMasteryCount(category, 'campaign', 3) }}</span>
                </div>
                <div class="flex items-center gap-1.5" title="Dark Matter (WZ Tier 3)">
                  <Plane class="w-4 h-4 text-pink-400" />
                  <span class="text-sm font-bold text-pink-400">{{ getCategoryMasteryCount(category, 'warzone', 3) }}</span>
                </div>
              </div>
              <ChevronDown class="w-6 h-6 text-gray-400 transition-transform duration-300" 
                :class="expandedCategories.includes(category) ? 'rotate-180' : ''" />
            </div>
          </button>

          <!-- Category Weapons -->
          <Transition name="expand">
            <div v-if="expandedCategories.includes(category)" class="border-t border-gray-700">
              <div class="p-4 space-y-3">
                <WeaponCard
                  v-for="weapon in getCategoryWeapons(category)"
                  :key="weapon.id"
                  :weapon="weapon"
                  @update="handleWeaponUpdate"
                  @delete="handleWeaponDelete"
                />
              </div>
            </div>
          </Transition>
        </div>

        <!-- Stats Section -->
        <div class="mt-12 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-500/30">
              <BarChart3 class="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h2 class="text-2xl font-black text-white">Grind Statistics</h2>
              <p class="text-sm text-gray-400">Track your camo progress</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Overall Completion -->
            <div class="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <div class="text-sm text-gray-400 mb-2">Overall Completion</div>
              <div class="text-3xl font-black text-white mb-2">{{ overallCompletion }}%</div>
              <div class="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-500" 
                  :style="{ width: `${overallCompletion}%` }">
                </div>
              </div>
            </div>

            <!-- Closest to Gold -->
            <div class="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <div class="text-sm text-gray-400 mb-2">Closest to Gold</div>
              <div class="text-lg font-bold text-yellow-400 mb-1">{{ closestToGold?.name || 'None' }}</div>
              <div class="text-xs text-gray-500">{{ closestToGold ? `${getWeaponProgress(closestToGold)}% complete` : 'No weapons started' }}</div>
            </div>

            <!-- Most Progressed -->
            <div class="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <div class="text-sm text-gray-400 mb-2">Most Progressed</div>
              <div class="text-lg font-bold text-green-400 mb-1">{{ mostProgressed?.name || 'None' }}</div>
              <div class="text-xs text-gray-500">{{ mostProgressed ? `${getWeaponProgress(mostProgressed)}% complete` : 'No progress yet' }}</div>
            </div>

            <!-- Total Camos Unlocked -->
            <div class="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <div class="text-sm text-gray-400 mb-2">Total Camos Unlocked</div>
              <div class="text-3xl font-black text-white">{{ totalCamosUnlocked }}</div>
              <div class="text-xs text-gray-500">Across all weapons</div>
            </div>
          </div>

          <!-- Category Breakdown -->
          <div class="mt-6">
            <h3 class="text-lg font-bold text-white mb-4">Category Breakdown</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div
                v-for="category in categoriesWithWeapons"
                :key="category"
                class="bg-gray-900/50 rounded-lg p-3 border border-gray-700"
              >
                <div class="text-sm text-gray-400 mb-1">{{ category }}</div>
                <div class="flex items-center justify-between">
                  <div class="text-xl font-bold text-white">{{ getCategoryCompletion(category) }}%</div>
                  <div class="text-xs text-gray-500">{{ getCategoryWeapons(category).length }} guns</div>
                </div>
                <div class="w-full bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-500" 
                    :style="{ width: `${getCategoryCompletion(category)}%` }">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Interface Modal -->
    <Transition name="modal">
      <WeaponAdmin v-if="showAdmin" @close="closeAdmin" />
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  Target, Package, Database, Search, ChevronDown, Zap,
  Crosshair, Shield, Skull, Mountain, Plane, Swords, Bomb, 
  Axe, BarChart3
} from 'lucide-vue-next'
import { useCamoStore } from './camoStore'
import { useMainStore } from '@/stores/useMainStore'
import WeaponCard from './WeaponCard.vue'
import WeaponAdmin from './WeaponAdmin.vue'

const camoStore = useCamoStore()
const mainStore = useMainStore()

const showAdmin = ref(false)
const searchQuery = ref('')
const expandedCategories = ref([])

// Initialize store on mount
onMounted(async () => {
  // Set user ID from auth store
  if (mainStore.user?.uid) {
    camoStore.userId.value = mainStore.user.uid
    console.log('🔐 Using authenticated user:', mainStore.user.uid)
  } else {
    console.warn('⚠️ No authenticated user found, using demo-user')
    camoStore.userId.value = 'demo-user'
  }
  
  await camoStore.initialize()
  // Expand all categories by default
  expandedCategories.value = [...camoStore.weaponCategories]
})

// Close admin and reload weapons
const closeAdmin = async () => {
  showAdmin.value = false
  await camoStore.reloadWeapons()
}

// Toggle category expansion
const toggleCategory = (category) => {
  const index = expandedCategories.value.indexOf(category)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(category)
  }
}

// Filtered weapons by search
const filteredWeapons = computed(() => {
  if (!searchQuery.value) return camoStore.weapons
  const query = searchQuery.value.toLowerCase()
  return camoStore.weapons.filter(w => 
    w.name.toLowerCase().includes(query) || 
    w.category.toLowerCase().includes(query)
  )
})

// Categories that have weapons (and match search)
const categoriesWithWeapons = computed(() => {
  return camoStore.weaponCategories.filter(cat => 
    getCategoryWeapons(cat).length > 0
  )
})

// Get weapons for a category (filtered by search)
const getCategoryWeapons = (category) => {
  return filteredWeapons.value.filter(w => w.category === category)
}

// Mode-specific mastery counts (tier 3 = final tier before mode-wide camo)
const singularityCount = computed(() => {
  return camoStore.weapons.filter(w => w.multiplayer?.mastery >= 3).length
})

const infestationCount = computed(() => {
  return camoStore.weapons.filter(w => w.zombies?.mastery >= 3).length
})

const genesisCount = computed(() => {
  return camoStore.weapons.filter(w => w.campaign?.mastery >= 3).length
})

const darkMatterCount = computed(() => {
  return camoStore.weapons.filter(w => w.warzone?.mastery >= 3).length
})

// Category stats
const getCategoryCompletion = (category) => {
  const weapons = camoStore.weapons.filter(w => w.category === category)
  if (weapons.length === 0) return 0
  
  let totalProgress = 0
  let maxProgress = 0
  
  weapons.forEach(weapon => {
    const modes = ['multiplayer', 'zombies', 'campaign', 'warzone']
    modes.forEach(mode => {
      if (weapon[mode]) {
        totalProgress += weapon[mode].military || 0
        totalProgress += (weapon[mode].special?.filter(s => s).length || 0)
        totalProgress += weapon[mode].mastery || 0
        maxProgress += 9 + 3 + 4 // 9 military + 3 special + 4 mastery
      }
    })
  })
  
  return maxProgress > 0 ? Math.round((totalProgress / maxProgress) * 100) : 0
}

const getCategoryMasteryCount = (category, mode, tier) => {
  return camoStore.weapons.filter(w => 
    w.category === category && w[mode]?.mastery >= tier
  ).length
}

// Overall stats
const overallCompletion = computed(() => {
  if (camoStore.weapons.length === 0) return 0
  
  let totalProgress = 0
  let maxProgress = 0
  
  camoStore.weapons.forEach(weapon => {
    const modes = ['multiplayer', 'zombies', 'campaign', 'warzone']
    modes.forEach(mode => {
      if (weapon[mode]) {
        totalProgress += weapon[mode].military || 0
        totalProgress += (weapon[mode].special?.filter(s => s).length || 0)
        totalProgress += weapon[mode].mastery || 0
        maxProgress += 9 + 3 + 4
      }
    })
  })
  
  return maxProgress > 0 ? Math.round((totalProgress / maxProgress) * 100) : 0
})

const getWeaponProgress = (weapon) => {
  if (!weapon) return 0
  
  let totalProgress = 0
  let maxProgress = 0
  
  const modes = ['multiplayer', 'zombies', 'campaign', 'warzone']
  modes.forEach(mode => {
    if (weapon[mode]) {
      totalProgress += weapon[mode].military || 0
      totalProgress += (weapon[mode].special?.filter(s => s).length || 0)
      totalProgress += weapon[mode].mastery || 0
      maxProgress += 9 + 3 + 4
    }
  })
  
  return maxProgress > 0 ? Math.round((totalProgress / maxProgress) * 100) : 0
}

const closestToGold = computed(() => {
  const notGold = camoStore.weapons.filter(w => 
    w.multiplayer?.mastery < 1 && w.zombies?.mastery < 1 &&
    w.campaign?.mastery < 1 && w.warzone?.mastery < 1
  )
  
  if (notGold.length === 0) return null
  
  return notGold.reduce((closest, weapon) => {
    const progress = getWeaponProgress(weapon)
    return progress > getWeaponProgress(closest) ? weapon : closest
  })
})

const mostProgressed = computed(() => {
  if (camoStore.weapons.length === 0) return null
  
  return camoStore.weapons.reduce((best, weapon) => {
    const progress = getWeaponProgress(weapon)
    return progress > getWeaponProgress(best) ? weapon : best
  })
})

const totalCamosUnlocked = computed(() => {
  let total = 0
  camoStore.weapons.forEach(weapon => {
    const modes = ['multiplayer', 'zombies', 'campaign', 'warzone']
    modes.forEach(mode => {
      if (weapon[mode]) {
        total += weapon[mode].military || 0
        total += (weapon[mode].special?.filter(s => s).length || 0)
        total += weapon[mode].mastery || 0
      }
    })
  })
  return total
})

// Category icons
const getCategoryIcon = (category) => {
  const icons = {
    'Assault Rifles': Crosshair,
    'SMGs': Swords,
    'Shotguns': Bomb,
    'LMGs': Shield,
    'Marksman Rifles': Target,
    'Sniper Rifles': Crosshair,
    'Pistols': Zap,
    'Launchers': Bomb,
    'Melee': Axe
  }
  return icons[category] || Crosshair
}

const handleWeaponUpdate = ({ weaponId, camoType, field, value }) => {
  camoStore.updateWeaponCamo(weaponId, camoType, field, value)
}

const handleWeaponDelete = (weaponId) => {
  if (confirm('Are you sure you want to delete this weapon?')) {
    camoStore.deleteWeapon(weaponId)
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 5000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>