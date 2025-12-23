// seedWeapon.js - Script to add M15 MOD 0 to Firestore
// Run this once to add the weapon to your database

import { addWeaponDefinition } from './weaponDefinitions'

export const seedM15Mod0 = async () => {
  const m15Data = {
    name: "M15 MOD 0",
    category: "Assault Rifles",
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

  try {
    const result = await addWeaponDefinition(m15Data)
    console.log('M15 MOD 0 added successfully:', result)
    return result
  } catch (error) {
    console.error('Failed to add M15 MOD 0:', error)
    throw error
  }
}

// Helper function to format weapon data for easy copying
export const generateWeaponTemplate = (weaponName, category) => {
  return {
    name: weaponName,
    category: category,
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
        "Replace with actual challenge",
        "Replace with actual challenge",
        "Replace with actual challenge"
      ],
      mastery: [
        { name: "Replace name", requirement: "Replace requirement" },
        { name: "Replace name", requirement: "Replace requirement" },
        { name: "Replace name", requirement: "Replace requirement" },
        { name: "Replace name", requirement: "Replace requirement" }
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
        "Replace with actual challenge",
        "Replace with actual challenge",
        "Replace with actual challenge"
      ],
      mastery: [
        { name: "Replace name", requirement: "Replace requirement" },
        { name: "Replace name", requirement: "Replace requirement" },
        { name: "Replace name", requirement: "Replace requirement" },
        { name: "Replace name", requirement: "Replace requirement" }
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
        "Replace with actual challenge",
        "Replace with actual challenge",
        "Replace with actual challenge"
      ],
      mastery: [
        { name: "Replace name", requirement: "Replace requirement" },
        { name: "Replace name", requirement: "Replace requirement" },
        { name: "Replace name", requirement: "Replace requirement" },
        { name: "Replace name", requirement: "Replace requirement" }
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

// Export for use in components
export default {
  seedM15Mod0,
  generateWeaponTemplate
}