<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
    <div class="max-w-7xl mx-auto p-4 md:p-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl blur-xl opacity-50 animate-pulse"></div>
            <div class="relative w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-2xl">
              <Database class="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 class="text-4xl md:text-5xl font-black text-white tracking-tight">Weapon Database</h1>
            <p class="text-gray-400 text-sm font-medium tracking-wide">ADMIN INTERFACE</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-3 mb-6">
        <button
          @click="activeTab = 'list'"
          class="relative group flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all overflow-hidden"
          :class="activeTab === 'list' 
            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl shadow-orange-500/25' 
            : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700'"
        >
          <div v-if="activeTab === 'list'" class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <List class="relative w-5 h-5" />
          <span class="relative">All Weapons</span>
          <span v-if="activeTab === 'list'" class="relative px-2 py-0.5 bg-white/20 rounded-full text-xs">{{ weapons.length }}</span>
        </button>
        <button
          @click="startAddingWeapon"
          class="relative group flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all overflow-hidden"
          :class="activeTab === 'add' && !editingWeapon
            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl shadow-orange-500/25' 
            : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700'"
        >
          <div v-if="activeTab === 'add' && !editingWeapon" class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <Plus class="relative w-5 h-5" />
          <span class="relative">Add New</span>
        </button>
      </div>

      <!-- List View -->
      <div v-if="activeTab === 'list'" class="space-y-4">
        <div v-if="loading" class="text-center py-20">
          <Loader class="w-16 h-16 text-orange-500 mx-auto mb-4 animate-spin" />
          <p class="text-gray-400 text-lg">Loading weapons database...</p>
        </div>

        <div v-else-if="weapons.length === 0" class="text-center py-20">
          <div class="relative inline-block mb-6">
            <div class="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl"></div>
            <Database class="relative w-20 h-20 text-gray-600 mx-auto" />
          </div>
          <p class="text-gray-400 text-xl mb-2 font-medium">No weapons in database</p>
          <p class="text-gray-500 text-sm mb-6">Click "Add New" to add your first weapon</p>
          <button
            @click="startAddingWeapon"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-orange-500/25 transition-all"
          >
            <Plus class="w-5 h-5" />
            Add First Weapon
          </button>
        </div>

        <div v-else>
          <!-- Search Bar -->
          <div class="mb-6">
            <div class="relative">
              <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                v-model="searchQuery"
                type="text"
                class="w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                placeholder="Search weapons by name or category..."
              />
            </div>
          </div>

          <!-- Weapons Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="weapon in filteredWeapons"
              :key="weapon.id"
              class="group relative bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-orange-500/10"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative">
                <div class="mb-4">
                  <h3 class="text-xl font-bold text-white mb-1.5 group-hover:text-orange-400 transition-colors">{{ weapon.name }}</h3>
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p class="text-sm text-gray-400 font-medium">{{ weapon.category }}</p>
                  </div>
                </div>

                <div class="flex gap-2">
                  <button
                    @click="duplicateWeapon(weapon)"
                    class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 rounded-lg transition-all border border-blue-600/30 hover:border-blue-500/50"
                    title="Duplicate weapon"
                  >
                    <Copy class="w-4 h-4" />
                    <span class="text-sm font-medium">Copy</span>
                  </button>
                  <button
                    @click="startEditingWeapon(weapon)"
                    class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 hover:text-orange-300 rounded-lg transition-all border border-orange-600/30 hover:border-orange-500/50"
                    title="Edit weapon"
                  >
                    <Edit class="w-4 h-4" />
                    <span class="text-sm font-medium">Edit</span>
                  </button>
                  <button
                    @click="confirmDelete(weapon)"
                    class="px-3 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition-all border border-red-600/30 hover:border-red-500/50"
                    title="Delete weapon"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>

                <div class="text-xs text-gray-500 mt-3 flex items-center gap-2">
                  <Clock class="w-3 h-3" />
                  Updated: {{ formatDate(weapon.updatedAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Form -->
      <div v-if="activeTab === 'add'" class="space-y-6">
        <!-- Form Header -->
        <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <component :is="editingWeapon ? Edit : Plus" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">{{ editingWeapon ? 'Edit Weapon' : 'Add New Weapon' }}</h2>
              <p class="text-xs text-gray-400">{{ editingWeapon ? 'Update weapon details and challenges' : 'Fill in all weapon information' }}</p>
            </div>
          </div>
          <button
            @click="cancelEdit"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all text-sm"
          >
            Cancel
          </button>
        </div>

        <!-- Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-gray-300 text-sm font-bold uppercase tracking-wide">
              <Target class="w-4 h-4 text-orange-500" />
              Weapon Name
            </label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border-2 border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all font-medium"
              placeholder="e.g., M15 MOD 0, AK-47"
            />
          </div>
          
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-gray-300 text-sm font-bold uppercase tracking-wide">
              <Layers class="w-4 h-4 text-orange-500" />
              Category
            </label>
            <select
              v-model="formData.category"
              class="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border-2 border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all font-medium"
            >
              <option value="" disabled>Select a category</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>
        </div>

        <!-- Mode Tabs -->
        <div class="flex gap-2 overflow-x-auto pb-2">
          <button
            v-for="mode in modes"
            :key="mode.id"
            @click="activeMode = mode.id"
            class="flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all whitespace-nowrap"
            :class="activeMode === mode.id 
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' 
              : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700'"
          >
            <component :is="getModeIcon(mode.id)" class="w-4 h-4" />
            {{ mode.name }}
          </button>
        </div>

        <!-- Challenge Editor -->
        <div class="space-y-6">
          <!-- Military Challenges -->
          <div class="bg-gray-800/30 rounded-xl p-5 border border-gray-700">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                <Shield class="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Military Challenges (9)</h3>
                <p class="text-xs text-gray-500">Progressive challenges</p>
              </div>
            </div>
            <div class="space-y-2">
              <div
                v-for="(challenge, idx) in formData[activeMode].military"
                :key="`mil-${idx}`"
                class="grid grid-cols-12 gap-3 items-center"
              >
                <div class="col-span-1 text-center">
                  <span class="inline-flex items-center justify-center w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-bold">{{ idx + 1 }}</span>
                </div>
                <div class="col-span-6">
                  <input
                    v-model="challenge.name"
                    type="text"
                    class="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                    :placeholder="`Challenge type (e.g., Headshots)`"
                  />
                </div>
                <div class="col-span-5">
                  <input
                    v-model.number="challenge.count"
                    type="number"
                    class="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                    :placeholder="`Count`"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Special Challenges -->
          <div class="bg-gray-800/30 rounded-xl p-5 border border-gray-700">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                <Sparkles class="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Special Challenges (3)</h3>
                <p class="text-xs text-gray-500">Unique challenges</p>
              </div>
            </div>
            <div class="space-y-2">
              <div
                v-for="(_, idx) in 3"
                :key="`spec-${idx}`"
                class="flex items-start gap-3"
              >
                <span class="inline-flex items-center justify-center w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-bold flex-shrink-0 mt-1">{{ idx + 1 }}</span>
                <textarea
                  v-model="formData[activeMode].special[idx]"
                  class="flex-1 bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none text-sm resize-none"
                  :placeholder="`Special Challenge ${idx + 1}`"
                  rows="2"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Mastery Challenges -->
          <div class="bg-gray-800/30 rounded-xl p-5 border border-gray-700">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20">
                <Trophy class="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Mastery Challenges (4)</h3>
                <p class="text-xs text-gray-500">Gold → Diamond → Dark Spine → Dark Matter</p>
              </div>
            </div>
            <div class="space-y-3">
              <div
                v-for="(mastery, idx) in formData[activeMode].mastery"
                :key="`mast-${idx}`"
                class="p-3 bg-gray-900/50 rounded-lg border transition-all"
                :class="idx === 0 ? 'border-yellow-500/30' : idx === 3 ? 'border-pink-500/30' : 'border-gray-700'"
              >
                <div class="flex items-center gap-2 mb-2">
                  <span class="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs font-bold">Tier {{ idx + 1 }}</span>
                  <span v-if="idx === 0" class="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-bold">Gold</span>
                  <span v-if="idx === 3" class="px-2 py-1 bg-pink-500/20 text-pink-400 rounded text-xs font-bold">Dark Matter</span>
                </div>
                <div class="space-y-2">
                  <input
                    v-model="mastery.name"
                    type="text"
                    class="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none text-sm"
                    :placeholder="`Camo name (e.g., ${idx === 0 ? 'Shattered Gold' : idx === 3 ? 'Dark Matter' : 'Arclight'})`"
                  />
                  <textarea
                    v-model="mastery.requirement"
                    class="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none text-sm resize-none"
                    :placeholder="`Requirement (or 'Unknown' / 'No challenge')`"
                    rows="2"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
          <button
            @click="saveWeapon"
            :disabled="!isFormValid || saving"
            class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <component :is="saving ? Loader : Save" class="w-5 h-5" :class="saving ? 'animate-spin' : ''" />
            {{ saving ? 'Saving...' : (editingWeapon ? 'Update Weapon' : 'Save Weapon') }}
          </button>
          <button
            @click="cancelEdit"
            class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Transition name="modal">
      <div v-if="deleteConfirm" class="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div class="bg-gray-800 border-2 border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
              <AlertTriangle class="w-6 h-6 text-red-400" />
            </div>
            <h3 class="text-xl font-bold text-white">Delete Weapon?</h3>
          </div>
          <p class="text-gray-400 mb-6">
            Are you sure you want to delete <span class="text-white font-bold">{{ weaponToDelete?.name }}</span>? 
            This action cannot be undone.
          </p>
          <div class="flex gap-3">
            <button
              @click="deleteWeapon"
              class="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all"
            >
              Delete Forever
            </button>
            <button
              @click="deleteConfirm = false; weaponToDelete = null"
              class="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  Database, X, List, Plus, Edit, Trash2, Save, Loader, Copy, Search, Clock, 
  AlertTriangle, Target, Layers, Shield, Sparkles, Trophy, 
  Crosshair, Skull, Mountain, Plane
} from 'lucide-vue-next'
import { 
  getAllWeaponDefinitions, 
  addWeaponDefinition, 
  updateWeaponDefinition, 
  deleteWeaponDefinition 
} from './weaponDefinitions'

const emit = defineEmits(['close'])

const categories = [
  'Assault Rifles',
  'SMGs',
  'Shotguns',
  'LMGs',
  'Marksman Rifles',
  'Sniper Rifles',
  'Pistols',
  'Launchers',
  'Melee'
]

const modes = [
  { id: 'multiplayer', name: 'Multiplayer' },
  { id: 'zombies', name: 'Zombies' },
  { id: 'campaign', name: 'Campaign' },
  { id: 'warzone', name: 'Warzone' }
]

const activeTab = ref('list')
const activeMode = ref('multiplayer')
const loading = ref(true)
const saving = ref(false)
const weapons = ref([])
const editingWeapon = ref(null)
const deleteConfirm = ref(false)
const weaponToDelete = ref(null)
const searchQuery = ref('')

const createEmptyFormData = () => ({
  name: '',
  category: '',
  multiplayer: {
    military: Array(9).fill().map(() => ({ name: '', count: 0 })),
    special: ['', '', ''],
    mastery: Array(4).fill().map(() => ({ name: '', requirement: '' }))
  },
  zombies: {
    military: Array(9).fill().map(() => ({ name: '', count: 0 })),
    special: ['', '', ''],
    mastery: Array(4).fill().map(() => ({ name: '', requirement: '' }))
  },
  campaign: {
    military: Array(9).fill().map(() => ({ name: '', count: 0 })),
    special: ['', '', ''],
    mastery: Array(4).fill().map(() => ({ name: '', requirement: '' }))
  },
  warzone: {
    military: Array(9).fill().map(() => ({ name: '', count: 0 })),
    special: ['', '', ''],
    mastery: Array(4).fill().map(() => ({ name: '', requirement: '' }))
  }
})

const formData = ref(createEmptyFormData())

const isFormValid = computed(() => {
  return formData.value.name && formData.value.category
})

const filteredWeapons = computed(() => {
  if (!searchQuery.value) return weapons.value
  const query = searchQuery.value.toLowerCase()
  return weapons.value.filter(w => 
    w.name.toLowerCase().includes(query) || 
    w.category.toLowerCase().includes(query)
  )
})

const loadWeapons = async () => {
  loading.value = true
  try {
    weapons.value = await getAllWeaponDefinitions()
  } catch (error) {
    console.error('Failed to load weapons:', error)
  } finally {
    loading.value = false
  }
}

const startAddingWeapon = () => {
  editingWeapon.value = null
  formData.value = createEmptyFormData()
  activeTab.value = 'add'
  activeMode.value = 'multiplayer'
}

const startEditingWeapon = (weapon) => {
  editingWeapon.value = weapon
  
  const ensureFourMasteryTiers = (modeData) => {
    const mastery = JSON.parse(JSON.stringify(modeData.mastery || []))
    while (mastery.length < 4) {
      mastery.push({ name: '', requirement: '' })
    }
    return {
      ...JSON.parse(JSON.stringify(modeData)),
      mastery
    }
  }
  
  formData.value = {
    name: weapon.name,
    category: weapon.category,
    multiplayer: ensureFourMasteryTiers(weapon.modes.multiplayer),
    zombies: ensureFourMasteryTiers(weapon.modes.zombies),
    campaign: ensureFourMasteryTiers(weapon.modes.campaign),
    warzone: ensureFourMasteryTiers(weapon.modes.warzone)
  }
  activeTab.value = 'add'
  activeMode.value = 'multiplayer'
}

const duplicateWeapon = (weapon) => {
  editingWeapon.value = null
  
  const ensureFourMasteryTiers = (modeData) => {
    const mastery = JSON.parse(JSON.stringify(modeData.mastery || []))
    while (mastery.length < 4) {
      mastery.push({ name: '', requirement: '' })
    }
    return {
      ...JSON.parse(JSON.stringify(modeData)),
      mastery
    }
  }
  
  formData.value = {
    name: weapon.name + ' (Copy)',
    category: weapon.category,
    multiplayer: ensureFourMasteryTiers(weapon.modes.multiplayer),
    zombies: ensureFourMasteryTiers(weapon.modes.zombies),
    campaign: ensureFourMasteryTiers(weapon.modes.campaign),
    warzone: ensureFourMasteryTiers(weapon.modes.warzone)
  }
  activeTab.value = 'add'
  activeMode.value = 'multiplayer'
}

const saveWeapon = async () => {
  if (!isFormValid.value) return
  
  saving.value = true
  try {
    if (editingWeapon.value) {
      await updateWeaponDefinition(editingWeapon.value.id, {
        name: formData.value.name,
        category: formData.value.category,
        modes: {
          multiplayer: formData.value.multiplayer,
          zombies: formData.value.zombies,
          campaign: formData.value.campaign,
          warzone: formData.value.warzone
        }
      })
    } else {
      await addWeaponDefinition(formData.value)
    }
    await loadWeapons()
    activeTab.value = 'list'
    formData.value = createEmptyFormData()
    editingWeapon.value = null
  } catch (error) {
    console.error('Failed to save weapon:', error)
    alert('Failed to save weapon. Please try again.')
  } finally {
    saving.value = false
  }
}

const cancelEdit = () => {
  activeTab.value = 'list'
  formData.value = createEmptyFormData()
  editingWeapon.value = null
}

const confirmDelete = (weapon) => {
  weaponToDelete.value = weapon
  deleteConfirm.value = true
}

const deleteWeapon = async () => {
  if (!weaponToDelete.value) return
  
  try {
    await deleteWeaponDefinition(weaponToDelete.value.id)
    await loadWeapons()
    deleteConfirm.value = false
    weaponToDelete.value = null
  } catch (error) {
    console.error('Failed to delete weapon:', error)
    alert('Failed to delete weapon. Please try again.')
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString()
}

const getModeIcon = (mode) => {
  const icons = {
    multiplayer: Crosshair,
    zombies: Skull,
    campaign: Mountain,
    warzone: Plane
  }
  return icons[mode] || Crosshair
}

onMounted(() => {
  loadWeapons()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>