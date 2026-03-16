// weaponDefinitions.js - Manages weapon data from Firestore
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { firestore } from '@/firebase' // Your Firebase config

/**
 * Weapon definition structure in Firestore
 * /cod/weapons/{weaponId}
 */

// Fetch all weapon definitions from Firestore
export const getAllWeaponDefinitions = async () => {
  try {
    const weaponsRef = collection(firestore, 'cod', 'data', 'weapons')
    const snapshot = await getDocs(weaponsRef)

    const weapons = []
    snapshot.forEach((doc) => {
      weapons.push({
        id: doc.id,
        ...doc.data()
      })
    })

    return weapons
  } catch (error) {
    console.error('Error fetching weapon definitions:', error)
    return []
  }
}

// Fetch single weapon definition
export const getWeaponDefinition = async (weaponId) => {
  try {
    const weaponRef = doc(firestore, 'cod', 'data', 'weapons', weaponId)
    const snapshot = await getDoc(weaponRef)

    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching weapon definition:', error)
    return null
  }
}

// Add new weapon definition
export const addWeaponDefinition = async (weaponData) => {
  try {
    const weaponId = weaponData.name.toLowerCase().replace(/\s+/g, '-')
    const weaponRef = doc(firestore, 'cod', 'data', 'weapons', weaponId)

    const weaponDefinition = {
      name: weaponData.name,
      category: weaponData.category,
      modes: {
        multiplayer: {
          military: weaponData.multiplayer.military,
          special: weaponData.multiplayer.special,
          mastery: weaponData.multiplayer.mastery
        },
        zombies: {
          military: weaponData.zombies.military,
          special: weaponData.zombies.special,
          mastery: weaponData.zombies.mastery
        },
        campaign: {
          military: weaponData.campaign.military,
          special: weaponData.campaign.special,
          mastery: weaponData.campaign.mastery
        },
        warzone: {
          military: weaponData.warzone.military,
          special: weaponData.warzone.special,
          mastery: weaponData.warzone.mastery
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await setDoc(weaponRef, weaponDefinition)
    return { id: weaponId, ...weaponDefinition }
  } catch (error) {
    console.error('Error adding weapon definition:', error)
    throw error
  }
}

// Update weapon definition
export const updateWeaponDefinition = async (weaponId, weaponData) => {
  try {
    const weaponRef = doc(firestore, 'cod', 'data', 'weapons', weaponId)
    await updateDoc(weaponRef, {
      ...weaponData,
      updatedAt: new Date()
    })
    return true
  } catch (error) {
    console.error('Error updating weapon definition:', error)
    throw error
  }
}

// Delete weapon definition
export const deleteWeaponDefinition = async (weaponId) => {
  try {
    const weaponRef = doc(firestore, 'cod', 'data', 'weapons', weaponId)
    await deleteDoc(weaponRef)
    return true
  } catch (error) {
    console.error('Error deleting weapon definition:', error)
    throw error
  }
}

// User progress functions
// /users/{userId}/cod/progress

export const getUserProgress = async (userId) => {
  try {
    const progressRef = doc(firestore, 'users', userId, 'cod', 'progress')
    const snapshot = await getDoc(progressRef)

    if (snapshot.exists()) {
      return snapshot.data()
    }
    // Return empty progress structure
    return {
      weapons: {},
      lastUpdated: new Date()
    }
  } catch (error) {
    if (error.code === 'permission-denied') {
      console.warn('⚠️ No permission to read user progress. Using empty progress. Make sure:',
        '\n1. You are logged in to Firebase Auth',
        '\n2. Your user document exists at /users/' + userId,
        '\n3. Firestore security rules allow reading /users/' + userId + '/cod/progress')
    } else {
      console.error('Error fetching user progress:', error)
    }
    // Return empty progress so app still works
    return {
      weapons: {},
      lastUpdated: new Date()
    }
  }
}

export const saveUserProgress = async (userId, progressData) => {
  try {
    const progressRef = doc(firestore, 'users', userId, 'cod', 'progress')
    await setDoc(progressRef, {
      weapons: progressData.weapons,
      lastUpdated: new Date()
    }, { merge: true })
    return true
  } catch (error) {
    console.error('Error saving user progress:', error)
    throw error
  }
}

// Helper to merge weapon definitions with user progress
export const mergeWeaponWithProgress = (weaponDefinition, userProgress) => {
  const weaponProgress = userProgress?.weapons?.[weaponDefinition.id] || {}

  return {
    id: weaponDefinition.id,
    name: weaponDefinition.name,
    category: weaponDefinition.category,
    definition: weaponDefinition.modes, // Store the full definition with challenges
    // Flatten progress to match WeaponCard expectations
    multiplayer: weaponProgress.multiplayer || {
      military: 0,
      special: [false, false, false],
      mastery: 0
    },
    zombies: weaponProgress.zombies || {
      military: 0,
      special: [false, false, false],
      mastery: 0
    },
    campaign: weaponProgress.campaign || {
      military: 0,
      special: [false, false, false],
      mastery: 0
    },
    warzone: weaponProgress.warzone || {
      military: 0,
      special: [false, false, false],
      mastery: 0
    },
    prestige: weaponProgress.prestige || {
      level: 0,
      prestigeTier: 0,
      universalCamos: 0,
      weaponSpecificCamos: 0
    }
  }
}

// Example weapon structure for reference
export const exampleWeaponStructure = {
  name: "M15 MOD 0",
  category: "Assault Rifles",
  modes: {
    multiplayer: {
      military: [
        { name: "Headshots", count: 5 },
        { name: "Headshots", count: 10 },
        { name: "Headshots", count: 20 },
        { name: "Headshots", count: 30 },
        { name: "Headshots", count: 40 },
        { name: "Headshots", count: 50 },
        { name: "Headshots", count: 60 },
        { name: "Headshots", count: 70 },
        { name: "Headshots", count: 80 }
      ],
      special: [
        "50 Kills while moving",
        "30 Objective Kills",
        "20 Kills with an underbarrel launcher equipped"
      ],
      mastery: [
        { name: "Shattered Gold", requirement: "10x 3 Kills without dying" },
        { name: "Arclight", requirement: "10 Double Kills" },
        { name: "Tempest", requirement: "5x 3 Kills without dying" },
        { name: "Dark Matter", requirement: "Complete all mastery camos" }
      ]
    },
    zombies: {
      military: [
        { name: "Critical Kills", count: 100 },
        { name: "Critical Kills", count: 200 },
        { name: "Critical Kills", count: 300 },
        { name: "Critical Kills", count: 400 },
        { name: "Critical Kills", count: 500 },
        { name: "Critical Kills", count: 600 },
        { name: "Critical Kills", count: 700 },
        { name: "Critical Kills", count: 800 },
        { name: "Critical Kills", count: 1000 }
      ],
      special: [
        "300 Hipfire kills",
        "5x 3 Critical kills rapidly",
        "300 Kills with Fireworks Activations"
      ],
      mastery: [
        { name: "Golden Dragon", requirement: "15x 10 Kills rapidly" },
        { name: "Bloodstone", requirement: "5x 20 kills without taking a hit" },
        { name: "Doomsteel", requirement: "10x Elite Kills" },
        { name: "Dark Matter", requirement: "Complete all mastery camos" }
      ]
    },
    campaign: {
      military: [
        { name: "Critical Kills", count: 10 },
        { name: "Critical Kills", count: 25 },
        { name: "Critical Kills", count: 50 },
        { name: "Critical Kills", count: 75 },
        { name: "Critical Kills", count: 100 },
        { name: "Critical Kills", count: 125 },
        { name: "Critical Kills", count: 150 },
        { name: "Critical Kills", count: 200 },
        { name: "Critical Kills", count: 250 }
      ],
      special: [
        "50 Kills shortly after sprinting",
        "100 Kills with a 4x or above magnification",
        "Kill 100 Fear enemies"
      ],
      mastery: [
        { name: "Molten Gold", requirement: "20x Special Enemies Kills" },
        { name: "Moonstone", requirement: "100 Kills in a Zone 3 or higher region" },
        { name: "Chroma Flux", requirement: "10x Elite Kills" },
        { name: "Dark Matter", requirement: "Complete all mastery camos" }
      ]
    },
    warzone: {
      military: [
        { name: "Eliminations", count: 5 },
        { name: "Eliminations", count: 10 },
        { name: "Eliminations", count: 15 },
        { name: "Eliminations", count: 20 },
        { name: "Eliminations", count: 30 },
        { name: "Eliminations", count: 40 },
        { name: "Eliminations", count: 50 },
        { name: "Eliminations", count: 75 },
        { name: "Eliminations", count: 100 }
      ],
      special: [
        "Unknown",
        "Unknown",
        "Unknown"
      ],
      mastery: [
        { name: "Gold", requirement: "Unknown" },
        { name: "Diamond", requirement: "Unknown" },
        { name: "Dark Spine", requirement: "Unknown" },
        { name: "Dark Matter", requirement: "Unknown" }
      ]
    }
  }
}