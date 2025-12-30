// src/game/upgrades.js
// Data-driven upgrade definitions for Core Defense

/**
 * Tree Blocking Cycle:
 * Integrity → blocks → Velocity
 * Velocity → blocks → Control
 * Control → blocks → Annihilation
 * Annihilation → blocks → Entropy
 * Entropy → blocks → Integrity
 */
export const TREE_BLOCKS = {
  integrity: 'velocity',
  velocity: 'control',
  control: 'annihilation',
  annihilation: 'entropy',
  entropy: 'integrity'
}

export const TREE_COLORS = {
  integrity: { primary: '#3b82f6', glow: 'rgba(59, 130, 246, 0.5)', bg: 'rgba(59, 130, 246, 0.15)' },
  annihilation: { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)', bg: 'rgba(239, 68, 68, 0.15)' },
  entropy: { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.5)', bg: 'rgba(168, 85, 247, 0.15)' },
  velocity: { primary: '#22c55e', glow: 'rgba(34, 197, 94, 0.5)', bg: 'rgba(34, 197, 94, 0.15)' },
  control: { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)', bg: 'rgba(245, 158, 11, 0.15)' }
}

export const TREE_ICONS = {
  integrity: 'Shield',
  annihilation: 'Flame',
  entropy: 'Skull',
  velocity: 'Zap',
  control: 'Target'
}

export const TREE_DESCRIPTIONS = {
  integrity: 'Health, armor, survivability',
  annihilation: 'Raw damage output',
  entropy: 'Risk for power',
  velocity: 'Speed and tempo',
  control: 'Threat manipulation'
}

// All possible stats - ensure every upgrade effect has a matching stat
export const BASE_STATS = {
  // Core combat stats
  maxHp: 100,
  currentHp: 100,
  baseDamage: 8,
  attackSpeed: 1.0,
  armor: 0,
  regenPerSecond: 0.5,
  damageMultiplier: 1.0,

  // Threat modifiers
  threatReduction: 0,
  threatMultiplier: 1.0,
  threatCap: 0,           // Max threat reduction % when above threshold
  threatFloor: 0,
  waveScalingReduction: 0,
  conditionalThreatReduction: 0,

  // Enemy modifiers
  durabilityReduction: 0,
  slowEnemiesPercent: 0,

  // Execute system
  executeThreshold: 0,      // Kill enemies below this HP %
  executeBonusDamage: 0,    // Bonus damage to low HP enemies
  highDurabilityBonus: 0,   // Bonus damage vs high durability enemies

  // Multishot/crit
  multiShotChance: 0,
  critChance: 0,
  critMultiplier: 1.5,

  // Economy
  scrapMultiplier: 1.0,
  onKillScrapBonus: 0,
  onWaveCompleteScrapBonus: 0,

  // Corruption system
  corruptionEnabled: false,
  corruptionStacks: 0,
  corruptionGainRate: 0,
  corruptionDamageBonus: 0,   // Bonus damage % per corruption stack
  maxCorruption: 10,
  uncappedCorruption: false,
  selfDamageMultiplier: 1.0,
  selfDamagePerSecond: 0,
  damageToScrapRatio: 0,
  corruptionHealRatio: 0,     // % of damage dealt that heals
  corruptionDecayPerSecond: 0,

  // Burst window (velocity tree)
  burstWindow: false,
  burstMultiplier: 1.0,
  burstAttackSpeedBonus: 1.0,
  burstDamageBonus: 0.3,

  // Wave control
  waveDelayBonus: 0,
  stunPulseEveryWaves: 0,
  stunPulseDuration: 0,

  // Defense specials
  damageSmoothing: false,
  flatDamageReduction: 0,
  maxHpMultiplier: 1.0,
  armorMultiplier: 1.0,
  regenMultiplier: 1.0,
  adaptiveRegen: 0,           // Extra regen below 50% HP
  shieldOnWaveStart: 0,
  reviveOnce: false,
  hasRevived: false,

  // Gamble mechanics (unused but defined)
  gambleCritChance: 0,
  gambleFailSelfDps: 0,
  rerollDiscount: 0
}

// Idle reward configuration
export const IDLE_CONFIG = {
  shardsPerHour: 2,
  shardsPerWaveBonus: 0.4,
  maxIdleHours: 8
}

// Wave modifier definitions
export const WAVE_MODIFIERS = {
  armored: {
    name: 'Armored Wave',
    description: 'Enemies have +50% durability',
    icon: 'Shield',
    color: '#64748b',
    effect: { durabilityMult: 1.5 }
  },
  swarm: {
    name: 'Swarm',
    description: '+40% threat, +30% scrap',
    icon: 'Users',
    color: '#f59e0b',
    effect: { threatMult: 1.4, scrapMult: 1.3 }
  },
  elite: {
    name: 'Elite Wave',
    description: '+25% threat, +25% durability, +50% scrap',
    icon: 'Crown',
    color: '#a855f7',
    effect: { threatMult: 1.25, durabilityMult: 1.25, scrapMult: 1.5 }
  },
  frenzied: {
    name: 'Frenzied',
    description: '+60% threat, -20% durability',
    icon: 'Zap',
    color: '#ef4444',
    effect: { threatMult: 1.6, durabilityMult: 0.8 }
  },
  recovery: {
    name: 'Recovery',
    description: '-30% threat, +2 HP/sec this wave',
    icon: 'Heart',
    color: '#22c55e',
    effect: { threatMult: 0.7, tempRegen: 2 }
  },
  wealthy: {
    name: 'Wealthy',
    description: '+100% scrap rewards',
    icon: 'Coins',
    color: '#fbbf24',
    effect: { scrapMult: 2.0 }
  }
}

// Milestone definitions
export const MILESTONES = {
  wave10: { wave: 10, shards: 5, name: 'First Steps' },
  wave25: { wave: 25, shards: 15, name: 'Getting Serious' },
  wave50: { wave: 50, shards: 35, name: 'Veteran' },
  wave75: { wave: 75, shards: 60, name: 'Elite' },
  wave100: { wave: 100, shards: 100, name: 'Centurion' }
}

export function calculateIdleRewards(lastCollectionTime, bestWave) {
  const now = Date.now()
  const lastTime = lastCollectionTime || now
  const wave = bestWave || 0
  const elapsedMs = Math.max(0, now - lastTime)
  const elapsedHours = Math.min(elapsedMs / (1000 * 60 * 60), IDLE_CONFIG.maxIdleHours)

  const shardsPerHour = IDLE_CONFIG.shardsPerHour + (wave * IDLE_CONFIG.shardsPerWaveBonus)

  return {
    shards: Math.floor(shardsPerHour * elapsedHours) || 0,
    elapsedHours: Math.round(elapsedHours * 100) / 100 || 0,
    capped: elapsedHours >= IDLE_CONFIG.maxIdleHours
  }
}

/**
 * Node Layout:
 * 1 = root (treeCommit) - centered
 * 2, 3 = tier-2 branches (left/right)
 * 4, 5 = tier-3 branches (left/right)
 * 6 = tier-4 GATE (centered, requires ANY of 4 or 5)
 * 7, 8 = tier-5 capstones (left/right, both require gate)
 */
export const UPGRADES = {
  // ─────────────────────────────────────────────────────────────
  // INTEGRITY (survivability vs sustain vs shields)
  // ─────────────────────────────────────────────────────────────
  integrity_1: {
    id: 'integrity_1', tree: 'integrity', nodeIndex: 1,
    name: 'Reinforced Core',
    description: '+40 Max HP, +2 Armor',
    scrapCost: 15,
    effects: { maxHp: 40, armor: 2 },
    requires: [], locks: [], treeCommit: true
  },
  integrity_2: {
    id: 'integrity_2', tree: 'integrity', nodeIndex: 2,
    name: 'Ablative Plating',
    description: '+4 Armor, damage smoothed over 3s',
    scrapCost: 45,
    effects: { armor: 4, damageSmoothing: true },
    requires: ['integrity_1'], locks: ['integrity_3', 'integrity_5']
  },
  integrity_3: {
    id: 'integrity_3', tree: 'integrity', nodeIndex: 3,
    name: 'Self-Repair Matrix',
    description: '+2.5 HP/sec regen',
    scrapCost: 35,
    effects: { regenPerSecond: 2.5 },
    requires: ['integrity_1'], locks: ['integrity_2', 'integrity_4']
  },
  integrity_4: {
    id: 'integrity_4', tree: 'integrity', nodeIndex: 4,
    name: 'Adaptive Shield',
    description: '+6 HP/sec below 50% HP, +25 Max HP',
    scrapCost: 70,
    effects: { maxHp: 25, adaptiveRegen: 6 },
    requires: ['integrity_2'], locks: ['integrity_5']
  },
  integrity_5: {
    id: 'integrity_5', tree: 'integrity', nodeIndex: 5,
    name: 'Bulwark Weave',
    description: '+60 Max HP, -10% attack speed',
    scrapCost: 70,
    effects: { maxHp: 60, attackSpeed: -0.10 },
    requires: ['integrity_3'], locks: ['integrity_4']
  },
  integrity_6: {
    id: 'integrity_6', tree: 'integrity', nodeIndex: 6,
    name: 'Core Synthesis',
    description: '+15 HP, +1 Armor per level',
    scrapCost: 40,
    effects: { maxHp: 15, armor: 1 },
    requiresAny: ['integrity_4', 'integrity_5'],
    locks: [],
    isGate: true,
    maxLevel: 5,
    levelToUnlock: 3
  },
  integrity_7: {
    id: 'integrity_7', tree: 'integrity', nodeIndex: 7,
    name: 'Fortress Protocol',
    description: '+8 Armor, +25% Max HP, -15% damage',
    scrapCost: 120,
    effects: { armor: 8, maxHpMultiplier: 0.25, damageMultiplier: -0.15 },
    requires: ['integrity_6'], locks: ['integrity_8']
  },
  integrity_8: {
    id: 'integrity_8', tree: 'integrity', nodeIndex: 8,
    name: 'Second Wind',
    description: 'Revive once at 1 HP, then +4 HP/sec permanently',
    scrapCost: 120,
    effects: { reviveOnce: true, regenPerSecond: 4 },
    requires: ['integrity_6'], locks: ['integrity_7']
  },

  // ─────────────────────────────────────────────────────────────
  // ANNIHILATION (burst vs consistency vs execution)
  // ─────────────────────────────────────────────────────────────
  annihilation_1: {
    id: 'annihilation_1', tree: 'annihilation', nodeIndex: 1,
    name: 'Weapon Overcharge',
    description: '+12 Base Damage',
    scrapCost: 15,
    effects: { baseDamage: 12 },
    requires: [], locks: [], treeCommit: true
  },
  annihilation_2: {
    id: 'annihilation_2', tree: 'annihilation', nodeIndex: 2,
    name: 'Alpha Strike',
    description: '+35% damage, -10% attack speed',
    scrapCost: 45,
    effects: { damageMultiplier: 0.35, attackSpeed: -0.1 },
    requires: ['annihilation_1'], locks: ['annihilation_3', 'annihilation_5']
  },
  annihilation_3: {
    id: 'annihilation_3', tree: 'annihilation', nodeIndex: 3,
    name: 'Targeting Calibration',
    description: '+20% damage, +8 Base Damage',
    scrapCost: 40,
    effects: { damageMultiplier: 0.2, baseDamage: 8 },
    requires: ['annihilation_1'], locks: ['annihilation_2', 'annihilation_4']
  },
  annihilation_4: {
    id: 'annihilation_4', tree: 'annihilation', nodeIndex: 4,
    name: 'Executioner Protocol',
    description: 'Execute enemies below 15% HP, +25% vs tough enemies',
    scrapCost: 80,
    effects: { executeThreshold: 0.15, highDurabilityBonus: 0.25 },
    requires: ['annihilation_2'], locks: ['annihilation_5']
  },
  annihilation_5: {
    id: 'annihilation_5', tree: 'annihilation', nodeIndex: 5,
    name: 'Split-Barrel Array',
    description: '+15% attack speed, 12% chance for double damage',
    scrapCost: 80,
    effects: { attackSpeed: 0.15, multiShotChance: 0.12 },
    requires: ['annihilation_3'], locks: ['annihilation_4']
  },
  annihilation_6: {
    id: 'annihilation_6', tree: 'annihilation', nodeIndex: 6,
    name: 'Weapon Mastery',
    description: '+5% damage, +3 base damage per level',
    scrapCost: 50,
    effects: { damageMultiplier: 0.05, baseDamage: 3 },
    requiresAny: ['annihilation_4', 'annihilation_5'],
    locks: [],
    isGate: true,
    maxLevel: 5,
    levelToUnlock: 3
  },
  annihilation_7: {
    id: 'annihilation_7', tree: 'annihilation', nodeIndex: 7,
    name: 'Cull Engine',
    description: 'Execute at 22%, +35% execute damage, -10% base damage',
    scrapCost: 140,
    effects: { executeThreshold: 0.22, damageMultiplier: -0.10, executeBonusDamage: 0.35 },
    requires: ['annihilation_6'], locks: ['annihilation_8']
  },
  annihilation_8: {
    id: 'annihilation_8', tree: 'annihilation', nodeIndex: 8,
    name: 'Sustained Fire Doctrine',
    description: '+25% attack speed, -15% base damage',
    scrapCost: 140,
    effects: { attackSpeed: 0.25, baseDamage: -6 },
    requires: ['annihilation_6'], locks: ['annihilation_7']
  },

  // ─────────────────────────────────────────────────────────────
  // ENTROPY (risk economy vs corruption scaling)
  // ─────────────────────────────────────────────────────────────
  entropy_1: {
    id: 'entropy_1', tree: 'entropy', nodeIndex: 1,
    name: 'Corruption Seed',
    description: 'Gain corruption stacks. +3% damage per stack, +1 self-damage/sec per stack',
    scrapCost: 12,
    effects: { corruptionEnabled: true, corruptionGainRate: 0.2, corruptionDamageBonus: 0.03 },
    requires: [], locks: [], treeCommit: true
  },
  entropy_2: {
    id: 'entropy_2', tree: 'entropy', nodeIndex: 2,
    name: 'Parasitic Harvest',
    description: '20% of damage taken converts to Scrap. Cap at 5 corruption stacks',
    scrapCost: 40,
    effects: { damageToScrapRatio: 0.2, maxCorruption: 5 },
    requires: ['entropy_1'], locks: ['entropy_3', 'entropy_5']
  },
  entropy_3: {
    id: 'entropy_3', tree: 'entropy', nodeIndex: 3,
    name: 'Void Resonance',
    description: '+2% additional damage per corruption stack',
    scrapCost: 35,
    effects: { corruptionDamageBonus: 0.02 },
    requires: ['entropy_1'], locks: ['entropy_2', 'entropy_4']
  },
  entropy_4: {
    id: 'entropy_4', tree: 'entropy', nodeIndex: 4,
    name: 'Event Horizon',
    description: 'Uncapped corruption, +50% scrap, self-damage x2',
    scrapCost: 65,
    effects: { uncappedCorruption: true, scrapMultiplier: 0.5, selfDamageMultiplier: 1.0 },
    requires: ['entropy_2'], locks: ['entropy_5']
  },
  entropy_5: {
    id: 'entropy_5', tree: 'entropy', nodeIndex: 5,
    name: 'Entropy Valve',
    description: 'Corruption decays 0.25/sec, -35% self-damage',
    scrapCost: 65,
    effects: { corruptionDecayPerSecond: 0.25, selfDamageMultiplier: -0.35 },
    requires: ['entropy_3'], locks: ['entropy_4']
  },
  entropy_6: {
    id: 'entropy_6', tree: 'entropy', nodeIndex: 6,
    name: 'Chaos Attunement',
    description: '+1% corruption damage, +5% scrap per level',
    scrapCost: 35,
    effects: { corruptionDamageBonus: 0.01, scrapMultiplier: 0.05 },
    requiresAny: ['entropy_4', 'entropy_5'],
    locks: [],
    isGate: true,
    maxLevel: 5,
    levelToUnlock: 3
  },
  entropy_7: {
    id: 'entropy_7', tree: 'entropy', nodeIndex: 7,
    name: 'Black Market Heart',
    description: '+1 Scrap per kill, +15% damage, +0.8 self-damage/sec',
    scrapCost: 130,
    effects: { onKillScrapBonus: 1, damageMultiplier: 0.15, selfDamagePerSecond: 0.8 },
    requires: ['entropy_6'], locks: ['entropy_8']
  },
  entropy_8: {
    id: 'entropy_8', tree: 'entropy', nodeIndex: 8,
    name: 'Symbiotic Conversion',
    description: '10% of damage dealt heals you, -5% damage',
    scrapCost: 130,
    effects: { corruptionHealRatio: 0.10, damageMultiplier: -0.05 },
    requires: ['entropy_6'], locks: ['entropy_7']
  },

  // ─────────────────────────────────────────────────────────────
  // VELOCITY (tempo vs burst vs economy)
  // ─────────────────────────────────────────────────────────────
  velocity_1: {
    id: 'velocity_1', tree: 'velocity', nodeIndex: 1,
    name: 'Accelerated Systems',
    description: '+25% attack speed',
    scrapCost: 15,
    effects: { attackSpeed: 0.25 },
    requires: [], locks: [], treeCommit: true
  },
  velocity_2: {
    id: 'velocity_2', tree: 'velocity', nodeIndex: 2,
    name: 'Sustained Momentum',
    description: '+30% attack speed, +5% damage',
    scrapCost: 50,
    effects: { attackSpeed: 0.3, damageMultiplier: 0.05 },
    requires: ['velocity_1'], locks: ['velocity_3', 'velocity_5']
  },
  velocity_3: {
    id: 'velocity_3', tree: 'velocity', nodeIndex: 3,
    name: 'Combat Tempo',
    description: '+15% attack speed',
    scrapCost: 35,
    effects: { attackSpeed: 0.15 },
    requires: ['velocity_1'], locks: ['velocity_2', 'velocity_4']
  },
  velocity_4: {
    id: 'velocity_4', tree: 'velocity', nodeIndex: 4,
    name: 'Overdrive Surge',
    description: '5s burst every 15s: +100% attack speed, +30% damage',
    scrapCost: 75,
    effects: { burstWindow: true },
    requires: ['velocity_2'], locks: ['velocity_5']
  },
  velocity_5: {
    id: 'velocity_5', tree: 'velocity', nodeIndex: 5,
    name: 'Rapid Salvage',
    description: '+20% scrap, -8% damage',
    scrapCost: 75,
    effects: { scrapMultiplier: 0.2, damageMultiplier: -0.08 },
    requires: ['velocity_3'], locks: ['velocity_4']
  },
  velocity_6: {
    id: 'velocity_6', tree: 'velocity', nodeIndex: 6,
    name: 'Momentum Core',
    description: '+5% attack speed, +3% scrap per level',
    scrapCost: 40,
    effects: { attackSpeed: 0.05, scrapMultiplier: 0.03 },
    requiresAny: ['velocity_4', 'velocity_5'],
    locks: [],
    isGate: true,
    maxLevel: 5,
    levelToUnlock: 3
  },
  velocity_7: {
    id: 'velocity_7', tree: 'velocity', nodeIndex: 7,
    name: 'Hypercycle',
    description: 'Burst x2 power, +15% attack speed, -12% Max HP',
    scrapCost: 135,
    effects: { burstMultiplier: 1.0, maxHpMultiplier: -0.12, attackSpeed: 0.15 },
    requires: ['velocity_6'], locks: ['velocity_8']
  },
  velocity_8: {
    id: 'velocity_8', tree: 'velocity', nodeIndex: 8,
    name: 'Logistics Engine',
    description: '+35% scrap, -10% attack speed',
    scrapCost: 135,
    effects: { scrapMultiplier: 0.35, attackSpeed: -0.10 },
    requires: ['velocity_6'], locks: ['velocity_7']
  },

  // ─────────────────────────────────────────────────────────────
  // CONTROL (threat shaping vs wave control vs safety)
  // ─────────────────────────────────────────────────────────────
  control_1: {
    id: 'control_1', tree: 'control', nodeIndex: 1,
    name: 'Threat Suppression',
    description: '-12% incoming threat',
    scrapCost: 15,
    effects: { threatMultiplier: -0.12 },
    requires: [], locks: [], treeCommit: true
  },
  control_2: {
    id: 'control_2', tree: 'control', nodeIndex: 2,
    name: 'Disruption Field',
    description: '-18% threat, enemies -10% durability',
    scrapCost: 45,
    effects: { threatMultiplier: -0.18, durabilityReduction: 0.1 },
    requires: ['control_1'], locks: ['control_3', 'control_5']
  },
  control_3: {
    id: 'control_3', tree: 'control', nodeIndex: 3,
    name: 'Wave Manipulation',
    description: '+3s between waves, -4 flat threat reduction',
    scrapCost: 40,
    effects: { waveDelayBonus: 3, threatReduction: 4 },
    requires: ['control_1'], locks: ['control_2', 'control_4']
  },
  control_4: {
    id: 'control_4', tree: 'control', nodeIndex: 4,
    name: 'Temporal Anchor',
    description: '-25% threat when above 70% HP, -12% wave scaling',
    scrapCost: 70,
    effects: { conditionalThreatReduction: 0.25, waveScalingReduction: 0.12 },
    requires: ['control_2'], locks: ['control_5']
  },
  control_5: {
    id: 'control_5', tree: 'control', nodeIndex: 5,
    name: 'Containment Grid',
    description: 'Slow enemies 12% (reduces threat), +10% threat',
    scrapCost: 70,
    effects: { slowEnemiesPercent: 0.12, threatMultiplier: 0.10 },
    requires: ['control_3'], locks: ['control_4']
  },
  control_6: {
    id: 'control_6', tree: 'control', nodeIndex: 6,
    name: 'Tactical Mastery',
    description: '-3% threat, +0.5s wave delay per level',
    scrapCost: 45,
    effects: { threatMultiplier: -0.03, waveDelayBonus: 0.5 },
    requiresAny: ['control_4', 'control_5'],
    locks: [],
    isGate: true,
    maxLevel: 5,
    levelToUnlock: 3
  },
  control_7: {
    id: 'control_7', tree: 'control', nodeIndex: 7,
    name: 'Stable Timeline',
    description: 'Cap threat at -20% of base, -8% wave scaling, -8% damage',
    scrapCost: 125,
    effects: { threatCap: 0.20, damageMultiplier: -0.08, waveScalingReduction: 0.08 },
    requires: ['control_6'], locks: ['control_8']
  },
  control_8: {
    id: 'control_8', tree: 'control', nodeIndex: 8,
    name: 'Stasis Pulse',
    description: 'Every 3 waves: enemies stunned 1.2s (no damage), -10% attack speed',
    scrapCost: 125,
    effects: { stunPulseEveryWaves: 3, stunPulseDuration: 1.2, attackSpeed: -0.10 },
    requires: ['control_6'], locks: ['control_7']
  }
}

// Meta upgrade configuration
export const META_UPGRADE_EFFECTS = {
  effectBonus: 0.10,      // +10% effect per meta level
  costReduction: 0.05,    // -5% cost per meta level
  shardCosts: [0, 8, 18, 35, 60, 100]  // Slightly reduced early costs
}

export function getMetaUpgradeCost(currentLevel) {
  if (currentLevel >= 5) return Infinity
  return META_UPGRADE_EFFECTS.shardCosts[currentLevel + 1]
}

export function getModifiedEffects(upgrade, metaLevel, purchaseLevel = 1) {
  const metaMultiplier = 1 + (metaLevel * META_UPGRADE_EFFECTS.effectBonus)
  const modified = {}

  for (const [key, value] of Object.entries(upgrade.effects)) {
    if (typeof value === 'number') {
      // For multi-level nodes, multiply by purchase level
      modified[key] = value * metaMultiplier * purchaseLevel
    } else {
      modified[key] = value
    }
  }
  return modified
}

export function getModifiedCost(upgrade, metaLevel, currentPurchaseLevel = 0) {
  const baseCost = upgrade.scrapCost * (1 - metaLevel * META_UPGRADE_EFFECTS.costReduction)
  // For multi-level nodes, cost scales with level
  if (upgrade.maxLevel && upgrade.maxLevel > 1) {
    return Math.floor(baseCost * (1 + currentPurchaseLevel * 0.5))
  }
  return Math.floor(baseCost)
}

/**
 * Check if an upgrade can be purchased
 */
export function canPurchaseUpgrade(upgradeId, purchasedUpgrades, blockedTrees, scrap, metaLevels = {}, purchaseLevels = {}) {
  const upgrade = UPGRADES[upgradeId]
  if (!upgrade) return { canBuy: false, reason: 'Invalid' }

  // Check if tree is blocked
  if (blockedTrees.includes(upgrade.tree)) return { canBuy: false, reason: 'Blocked' }

  const currentLevel = purchaseLevels[upgradeId] || 0
  const maxLevel = upgrade.maxLevel || 1

  // Check if already at max level
  if (currentLevel >= maxLevel) return { canBuy: false, reason: 'Maxed' }

  // For non-multi-level nodes, check if already purchased
  if (maxLevel === 1 && purchasedUpgrades.includes(upgradeId)) {
    return { canBuy: false, reason: 'Owned' }
  }

  // Check AND requirements (requires)
  if (upgrade.requires?.length) {
    for (const reqId of upgrade.requires) {
      const reqUpgrade = UPGRADES[reqId]

      if (!purchasedUpgrades.includes(reqId)) {
        const reqName = UPGRADES[reqId]?.name || reqId
        const shortName = reqName.length > 12 ? reqName.split(' ')[0] : reqName
        return { canBuy: false, reason: `Need ${shortName}` }
      }

      // Only check level requirement for multi-level gates
      if (reqUpgrade?.maxLevel && reqUpgrade.maxLevel > 1 && reqUpgrade.levelToUnlock) {
        const reqLevel = purchaseLevels[reqId] || 0
        if (reqLevel < reqUpgrade.levelToUnlock) {
          const reqName = reqUpgrade.name || reqId
          const shortName = reqName.length > 10 ? reqName.split(' ')[0] : reqName
          return { canBuy: false, reason: `${shortName} Lv${reqUpgrade.levelToUnlock}` }
        }
      }
    }
  }

  // Check OR requirements (requiresAny)
  if (upgrade.requiresAny?.length) {
    const hasAny = upgrade.requiresAny.some(reqId => {
      if (!purchasedUpgrades.includes(reqId)) return false

      const reqUpgrade = UPGRADES[reqId]
      // Only check level for multi-level gates
      if (reqUpgrade?.maxLevel && reqUpgrade.maxLevel > 1 && reqUpgrade.levelToUnlock) {
        const reqLevel = purchaseLevels[reqId] || 0
        return reqLevel >= reqUpgrade.levelToUnlock
      }
      return true // Non-multi-level nodes just need to be purchased
    })
    if (!hasAny) {
      return { canBuy: false, reason: 'Need prev tier' }
    }
  }

  // Check locks (another purchased upgrade locks this one)
  for (const purchased of purchasedUpgrades) {
    if (UPGRADES[purchased]?.locks?.includes(upgradeId)) {
      return { canBuy: false, reason: 'Path locked' }
    }
  }

  // Check cost
  const cost = getModifiedCost(upgrade, metaLevels[upgradeId] || 0, currentLevel)
  if (scrap < cost) return { canBuy: false, reason: `${cost} Scrap` }

  return { canBuy: true, reason: null, cost }
}