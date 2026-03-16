import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getAllWeaponDefinitions,
  getUserProgress,
  saveUserProgress,
  mergeWeaponWithProgress
} from './weaponDefinitions'

export const useCamoStore = defineStore('camo', () => {
  // Weapon categories
  const weaponCategories = [
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

  // Camo types for MP/Zombies/Campaign/Warzone
  const camoTypes = ['Multiplayer', 'Zombies', 'Campaign', 'Warzone']

  const masteryTiers = [
    { name: 'Gold', requirement: 'Complete all base camos (9 Military + 3 Special)' },
    { name: 'Diamond', requirement: 'Get Gold on all weapons in this category' },
    { name: 'Dark Spine', requirement: 'Complete challenges on 30 weapons across the game' },
    { name: 'Dark Matter', requirement: 'Auto-unlocks when 30 weapons reach Dark Spine' }
  ]

  // State
  const weapons = ref([])
  const weaponDefinitions = ref([])
  const userProgress = ref({})
  const userId = ref('demo-user') // Reactive so it can be updated
  const loading = ref(true)
  const initialized = ref(false)

  // Initialize - load weapons and progress from Firestore
  const initialize = async () => {
    if (initialized.value) return

    loading.value = true
    try {
      // Load weapon definitions from Firestore
      console.log('📦 Loading weapon definitions...')
      weaponDefinitions.value = await getAllWeaponDefinitions()
      console.log(`✅ Loaded ${weaponDefinitions.value.length} weapons`)

      // Load user progress from Firestore
      console.log('👤 Loading user progress for:', userId.value)
      const progress = await getUserProgress(userId.value)
      userProgress.value = progress || {}

      // Merge definitions with progress
      weapons.value = weaponDefinitions.value.map(def =>
        mergeWeaponWithProgress(def, userProgress.value)
      )

      console.log(`✅ Initialized ${weapons.value.length} weapons with progress`)
      initialized.value = true
    } catch (error) {
      console.error('❌ Failed to initialize camo store:', error)
      // Still set initialized to true so UI shows something
      initialized.value = true
    } finally {
      loading.value = false
    }
  }

  // Reload weapons (after admin adds/edits)
  const reloadWeapons = async () => {
    try {
      weaponDefinitions.value = await getAllWeaponDefinitions()

      // Merge with existing progress
      weapons.value = weaponDefinitions.value.map(def =>
        mergeWeaponWithProgress(def, userProgress.value)
      )
    } catch (error) {
      console.error('Failed to reload weapons:', error)
    }
  }

  // Save progress to Firestore (debounced in weaponDefinitions.js)
  const saveProgress = async () => {
    try {
      // Convert weapons array to progress object
      const progressData = {
        weapons: {}
      }

      weapons.value.forEach(weapon => {
        progressData.weapons[weapon.id] = {
          multiplayer: {
            military: weapon.multiplayer.military,
            special: weapon.multiplayer.special,
            mastery: weapon.multiplayer.mastery
          },
          zombies: {
            military: weapon.zombies.military,
            special: weapon.zombies.special,
            mastery: weapon.zombies.mastery
          },
          campaign: {
            military: weapon.campaign.military,
            special: weapon.campaign.special,
            mastery: weapon.campaign.mastery
          },
          warzone: {
            military: weapon.warzone.military,
            special: weapon.warzone.special,
            mastery: weapon.warzone.mastery
          },
          prestige: weapon.prestige
        }
      })

      await saveUserProgress(userId.value, progressData)
      userProgress.value = progressData
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }

  // Update weapon camo progress
  const updateWeaponCamo = (weaponId, camoType, field, value) => {
    const weapon = weapons.value.find(w => w.id === weaponId)
    if (!weapon) return

    const mode = camoType.toLowerCase()

    if (field === 'military') {
      weapon[mode].military = value
    } else if (field === 'special') {
      weapon[mode].special = value
    } else if (field === 'mastery') {
      weapon[mode].mastery = value
    } else if (field === 'prestige') {
      weapon.prestige = { ...weapon.prestige, ...value }
    }

    // Auto-save progress
    saveProgress()
  }

  // Delete weapon (remove from local state only, admin deletes from Firestore)
  const deleteWeapon = (weaponId) => {
    weapons.value = weapons.value.filter(w => w.id !== weaponId)
    saveProgress()
  }

  // Computed stats
  const totalWeapons = computed(() => weapons.value.length)

  const weaponsWithGold = computed(() => {
    return weapons.value.filter(w =>
      w.multiplayer.mastery >= 1 ||
      w.zombies.mastery >= 1 ||
      w.campaign.mastery >= 1 ||
      w.warzone.mastery >= 1
    ).length
  })

  const weaponsWithDarkSpine = computed(() => {
    return weapons.value.filter(w =>
      w.multiplayer.mastery >= 3 ||
      w.zombies.mastery >= 3 ||
      w.campaign.mastery >= 3 ||
      w.warzone.mastery >= 3
    ).length
  })

  const weaponsWithDarkMatter = computed(() => {
    return weapons.value.filter(w =>
      w.multiplayer.mastery >= 4 ||
      w.zombies.mastery >= 4 ||
      w.campaign.mastery >= 4 ||
      w.warzone.mastery >= 4
    ).length
  })

  const darkMatterUnlocked = computed(() => {
    return weaponsWithDarkSpine.value >= 30
  })

  const completionPercentage = computed(() => {
    if (weapons.value.length === 0) return 0

    let totalProgress = 0
    let maxProgress = 0

    weapons.value.forEach(weapon => {
      camoTypes.forEach(type => {
        const mode = type.toLowerCase()
        // Military: 9 camos
        totalProgress += weapon[mode].military
        maxProgress += 9

        // Special: 3 camos
        totalProgress += weapon[mode].special.filter(s => s).length
        maxProgress += 3

        // Mastery: 4 tiers
        totalProgress += weapon[mode].mastery
        maxProgress += 4
      })
    })

    return Math.round((totalProgress / maxProgress) * 100)
  })

  // Weapons by category
  const weaponsByCategory = computed(() => {
    const grouped = {}
    weaponCategories.forEach(cat => {
      grouped[cat] = weapons.value.filter(w => w.category === cat)
    })
    return grouped
  })

  // Category completion stats
  const getCategoryStats = (category) => {
    const categoryWeapons = weapons.value.filter(w => w.category === category)
    if (categoryWeapons.length === 0) return { total: 0, gold: 0, diamond: 0, darkSpine: 0 }

    return {
      total: categoryWeapons.length,
      gold: categoryWeapons.filter(w =>
        w.multiplayer.mastery >= 1 || w.zombies.mastery >= 1 ||
        w.campaign.mastery >= 1 || w.warzone.mastery >= 1
      ).length,
      diamond: categoryWeapons.filter(w =>
        w.multiplayer.mastery >= 2 || w.zombies.mastery >= 2 ||
        w.campaign.mastery >= 2 || w.warzone.mastery >= 2
      ).length,
      darkSpine: categoryWeapons.filter(w =>
        w.multiplayer.mastery >= 3 || w.zombies.mastery >= 3 ||
        w.campaign.mastery >= 3 || w.warzone.mastery >= 3
      ).length
    }
  }

  return {
    // State
    weapons,
    weaponCategories,
    camoTypes,
    masteryTiers,
    loading,
    initialized,
    userId, // Export so it can be set externally

    // Methods
    initialize,
    reloadWeapons,
    updateWeaponCamo,
    deleteWeapon,
    getCategoryStats,

    // Computed
    totalWeapons,
    weaponsWithGold,
    weaponsWithDarkSpine,
    weaponsWithDarkMatter,
    darkMatterUnlocked,
    completionPercentage,
    weaponsByCategory
  }
})