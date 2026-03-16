// src/game/GameEngine.js
// Non-reactive simulation engine for Core Defense
// Now with ALL upgrade effects properly implemented

import {
  UPGRADES,
  BASE_STATS,
  TREE_BLOCKS,
  WAVE_MODIFIERS,
  MILESTONES,
  getModifiedEffects,
  getModifiedCost,
  canPurchaseUpgrade
} from './upgrades'

// Wave configuration constants
const WAVE_CONFIG = {
  baseThreat: 2,
  threatGrowth: 0.08,
  baseDurability: 0.8,
  durabilityGrowth: 0.05,
  baseWaveDuration: 10,
  waveTransitionTime: 4,
  baseScrapPerWave: 20,
  startingScrap: 0,
  modifierStartWave: 5,      // Wave modifiers start appearing
  modifierInterval: 5         // Every N waves after start
}

// Get random wave modifier
function getRandomModifier() {
  const keys = Object.keys(WAVE_MODIFIERS)
  return keys[Math.floor(Math.random() * keys.length)]
}

export class GameEngine {
  constructor() {
    this.reset()
    this.tickInterval = null
    this.tickRate = 50
    this.isPaused = false
    this.speedMultiplier = 1
  }

  reset() {
    // Deep copy base stats
    this.stats = { ...BASE_STATS }
    this.currentHp = this.stats.maxHp
    this.scrap = WAVE_CONFIG.startingScrap
    this.totalSpentThisRun = 0
    this.totalScrapEarned = 0

    // Wave state
    this.waveIndex = 0
    this.waveTimer = 0
    this.wavePhase = 'combat'
    this.waveTransitionTimer = 0
    this.currentWaveModifier = null
    this.waveModifierEffect = null

    // Combat state
    this.incomingThreatPerSecond = WAVE_CONFIG.baseThreat
    this.currentDurability = WAVE_CONFIG.baseDurability
    this.effectiveDps = 0

    // Corruption system
    this.corruptionStacks = 0
    this.corruptionSelfDamage = 0

    // Burst window system
    this.burstWindowActive = false
    this.burstTimer = 0
    this.burstCycleTime = 15    // 15s cycle
    this.burstDuration = 5      // 5s active

    // Damage smoothing buffer
    this.damageBuffer = []

    // Stun pulse system
    this.stunActive = false
    this.stunTimer = 0
    this.wavesUntilStun = 0

    // Revive tracking
    this.hasRevived = false

    // Upgrade tracking
    this.purchasedUpgrades = []
    this.purchaseLevels = {}
    this.committedTrees = []
    this.blockedTrees = []

    // Run statistics
    this.runTime = 0
    this.totalDamageDealt = 0
    this.totalDamageTaken = 0
    this.highestWave = 0
    this.enemiesKilled = 0
    this.totalHealed = 0

    // Milestone tracking
    this.claimedMilestones = []
    this.pendingMilestoneShards = 0

    // Game over state
    this.isGameOver = false
    this.shardsEarned = 0

    // Visual state for rendering
    this.visualThreatLevel = 0
    this.isWaveTransition = false
    this.recentDamageEvents = []
    this.recentKillEvents = []
    this.recentHealEvents = []
    this.screenShakeIntensity = 0
    this.lastMultishot = false
    this.lastExecute = false
  }

  start(onTick) {
    if (this.tickInterval) return
    this.onTickCallback = onTick
    this.lastTickTime = performance.now()
    this.tickInterval = setInterval(() => this.tick(), this.tickRate)
  }

  stop() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval)
      this.tickInterval = null
    }
  }

  setPaused(paused) {
    this.isPaused = paused
  }

  setSpeed(multiplier) {
    this.speedMultiplier = Math.min(2, Math.max(1, multiplier))
  }

  tick() {
    const now = performance.now()
    const deltaMs = now - this.lastTickTime
    this.lastTickTime = now

    const deltaSeconds = (deltaMs / 1000) * this.speedMultiplier

    // If paused or game over, still update visuals
    if (this.isPaused || this.isGameOver) {
      this.updateVisualState(deltaMs / 1000)
      if (this.onTickCallback) this.onTickCallback(this.getSnapshot())
      return
    }

    // ---- Game logic ----
    this.runTime += deltaSeconds

    // Update systems
    this.updateCorruption(deltaSeconds)
    this.updateBurstWindow(deltaSeconds)
    this.updateStunPulse(deltaSeconds)
    this.calculateEffectiveDps()
    this.calculateIncomingThreat()
    this.processCombat(deltaSeconds)

    // Check death BEFORE regen
    if (this.currentHp < 1) {
      // Check for revive
      if (this.stats.reviveOnce && !this.hasRevived) {
        this.hasRevived = true
        this.currentHp = 1
        this.recentHealEvents.push({ time: this.runTime, amount: 1, type: 'revive' })
        this.screenShakeIntensity = Math.max(this.screenShakeIntensity, 0.8)
      } else {
        this.onDeath()
        return
      }
    }

    this.applyRegen(deltaSeconds)
    this.updateWaveState(deltaSeconds)

    // Clean old events
    const eventCutoff = this.runTime - 2
    this.recentDamageEvents = this.recentDamageEvents.filter(e => e.time > eventCutoff)
    this.recentKillEvents = this.recentKillEvents.filter(e => e.time > eventCutoff)
    this.recentHealEvents = this.recentHealEvents.filter(e => e.time > eventCutoff)

    // Update visuals + snapshot
    this.updateVisualState(deltaMs / 1000)
    if (this.onTickCallback) this.onTickCallback(this.getSnapshot())
  }

  onDeath() {
    this.isGameOver = true
    this.currentHp = 0

    // Calculate shards: 12% of scrap spent + milestone bonuses
    this.shardsEarned = Math.floor(this.totalSpentThisRun * 0.12) + this.pendingMilestoneShards

    if (this.onTickCallback) this.onTickCallback(this.getSnapshot())
    this.stop()
  }

  // ─────────────────────────────────────────────────────────────
  // CORRUPTION SYSTEM
  // ─────────────────────────────────────────────────────────────
  updateCorruption(deltaSeconds) {
    if (!this.stats.corruptionEnabled) {
      this.corruptionStacks = 0
      return
    }

    // Corruption gain
    const gainRate = this.stats.corruptionGainRate || 0.2
    this.corruptionStacks += gainRate * deltaSeconds

    // Apply decay if enabled
    if (this.stats.corruptionDecayPerSecond > 0) {
      this.corruptionStacks -= this.stats.corruptionDecayPerSecond * deltaSeconds
    }

    // Apply cap unless uncapped
    if (!this.stats.uncappedCorruption) {
      const maxStacks = this.stats.maxCorruption || 10
      this.corruptionStacks = Math.min(maxStacks, this.corruptionStacks)
    }

    this.corruptionStacks = Math.max(0, this.corruptionStacks)

    // Calculate self-damage
    let baseSelfDamage = this.corruptionStacks * 1.0 // 1 damage per stack per second
    baseSelfDamage += this.stats.selfDamagePerSecond || 0

    // Apply self-damage multiplier (can reduce or increase)
    const selfDamageMult = this.stats.selfDamageMultiplier || 1.0
    const totalSelfDamage = baseSelfDamage * Math.max(0, selfDamageMult) * deltaSeconds

    this.corruptionSelfDamage = totalSelfDamage / deltaSeconds // Store for display

    if (totalSelfDamage > 0) {
      this.applyDamage(totalSelfDamage, false, false)
    }
  }

  // ─────────────────────────────────────────────────────────────
  // BURST WINDOW SYSTEM
  // ─────────────────────────────────────────────────────────────
  updateBurstWindow(deltaSeconds) {
    if (!this.stats.burstWindow) {
      this.burstWindowActive = false
      return
    }

    this.burstTimer += deltaSeconds
    const cyclePosition = this.burstTimer % this.burstCycleTime
    this.burstWindowActive = cyclePosition < this.burstDuration
  }

  // ─────────────────────────────────────────────────────────────
  // STUN PULSE SYSTEM
  // ─────────────────────────────────────────────────────────────
  updateStunPulse(deltaSeconds) {
    if (this.stunActive) {
      this.stunTimer -= deltaSeconds
      if (this.stunTimer <= 0) {
        this.stunActive = false
        this.stunTimer = 0
      }
    }
  }

  triggerStunPulse() {
    if (this.stats.stunPulseEveryWaves > 0 && this.stats.stunPulseDuration > 0) {
      this.stunActive = true
      this.stunTimer = this.stats.stunPulseDuration
    }
  }

  // ─────────────────────────────────────────────────────────────
  // DPS CALCULATION - All damage effects
  // ─────────────────────────────────────────────────────────────
  calculateEffectiveDps() {
    let baseDamage = Math.max(1, this.stats.baseDamage)
    let attackSpeed = Math.max(0.1, this.stats.attackSpeed)
    let damageMultiplier = this.stats.damageMultiplier

    // Corruption damage bonus (per stack)
    if (this.stats.corruptionEnabled && this.corruptionStacks > 0) {
      const bonusPerStack = this.stats.corruptionDamageBonus || 0.03
      damageMultiplier += this.corruptionStacks * bonusPerStack
    }

    // Burst window bonuses
    if (this.burstWindowActive) {
      const burstMult = 1 + (this.stats.burstMultiplier || 0)
      attackSpeed += (this.stats.burstAttackSpeedBonus || 1.0) * burstMult
      damageMultiplier += (this.stats.burstDamageBonus || 0.3) * burstMult
    }

    // High durability bonus (annihilation_4)
    if (this.stats.highDurabilityBonus > 0 && this.currentDurability > 2) {
      damageMultiplier += this.stats.highDurabilityBonus
    }

    // Multishot chance - average damage increase
    if (this.stats.multiShotChance > 0) {
      damageMultiplier *= (1 + this.stats.multiShotChance)
    }

    // Execute bonus damage (for enemies in execute range)
    if (this.stats.executeThreshold > 0 && this.stats.executeBonusDamage > 0) {
      // Approximate: assume some % of time enemies are in execute range
      const executeUptime = this.stats.executeThreshold * 0.5
      damageMultiplier += this.stats.executeBonusDamage * executeUptime
    }

    this.effectiveDps = baseDamage * attackSpeed * damageMultiplier
  }

  // ─────────────────────────────────────────────────────────────
  // THREAT CALCULATION - All threat modifiers
  // ─────────────────────────────────────────────────────────────
  calculateIncomingThreat() {
    // Base wave scaling with reduction
    const effectiveGrowth = WAVE_CONFIG.threatGrowth * (1 - (this.stats.waveScalingReduction || 0))
    const waveMultiplier = 1 + this.waveIndex * effectiveGrowth

    let threat = WAVE_CONFIG.baseThreat * waveMultiplier
    let durability = WAVE_CONFIG.baseDurability * (1 + this.waveIndex * WAVE_CONFIG.durabilityGrowth)

    // Apply wave modifier effects
    if (this.waveModifierEffect) {
      if (this.waveModifierEffect.threatMult) {
        threat *= this.waveModifierEffect.threatMult
      }
      if (this.waveModifierEffect.durabilityMult) {
        durability *= this.waveModifierEffect.durabilityMult
      }
    }

    // Threat multiplier (can be positive or negative additions)
    threat *= Math.max(0.1, 1 + this.stats.threatMultiplier)

    // Flat threat reduction
    threat = Math.max(0.5, threat - this.stats.threatReduction)

    // Conditional threat reduction (above HP threshold)
    if (this.stats.conditionalThreatReduction > 0) {
      if (this.currentHp > this.stats.maxHp * 0.7) {
        threat *= (1 - this.stats.conditionalThreatReduction)
      }
    }

    // Slow enemies effect (reduces threat)
    if (this.stats.slowEnemiesPercent > 0) {
      threat *= (1 - this.stats.slowEnemiesPercent)
    }

    // Threat cap (caps maximum threat as % reduction from calculated)
    if (this.stats.threatCap > 0) {
      const cappedThreat = threat * (1 - this.stats.threatCap)
      threat = Math.min(threat, Math.max(cappedThreat, WAVE_CONFIG.baseThreat))
    }

    // Apply durability reduction
    durability *= (1 - this.stats.durabilityReduction)

    // High durability bonus check for annihilation_4
    if (this.stats.highDurabilityBonus > 0) {
      durability *= 0.85 // Slightly reduce effective durability
    }

    // Stun - zero threat while active
    if (this.stunActive) {
      threat = 0
    }

    this.incomingThreatPerSecond = Math.max(0, threat)
    this.currentDurability = Math.max(0.5, durability)
  }

  // ─────────────────────────────────────────────────────────────
  // COMBAT PROCESSING
  // ─────────────────────────────────────────────────────────────
  processCombat(deltaSeconds) {
    if (this.wavePhase !== 'combat') return
    if (this.stunActive) return // No combat during stun

    // Calculate effective damage with execute mechanic
    let effectiveDamage = this.effectiveDps / this.currentDurability

    // Execute threshold - bonus "kill speed" for low HP enemies
    if (this.stats.executeThreshold > 0) {
      // Simulate faster kills on low HP enemies
      const executeBonus = 1 + (this.stats.executeThreshold * 2)
      effectiveDamage *= executeBonus
      this.lastExecute = true
    } else {
      this.lastExecute = false
    }

    // Multishot proc check (for visual feedback)
    this.lastMultishot = this.stats.multiShotChance > 0 && Math.random() < this.stats.multiShotChance

    const killsThisTick = effectiveDamage * deltaSeconds * 0.1
    this.enemiesKilled += killsThisTick
    this.totalDamageDealt += effectiveDamage * deltaSeconds

    // Scrap from kills
    let scrapPerKill = 0.5 * this.stats.scrapMultiplier

    // Wave modifier scrap bonus
    if (this.waveModifierEffect?.scrapMult) {
      scrapPerKill *= this.waveModifierEffect.scrapMult
    }

    // On-kill scrap bonus (Black Market Heart)
    if (this.stats.onKillScrapBonus > 0) {
      scrapPerKill += this.stats.onKillScrapBonus
    }

    const scrapEarned = killsThisTick * scrapPerKill
    this.scrap += scrapEarned
    this.totalScrapEarned += scrapEarned

    // Record kill events for visual
    if (killsThisTick > 0.5) {
      this.recentKillEvents.push({
        time: this.runTime,
        kills: killsThisTick,
        scrap: scrapEarned,
        multishot: this.lastMultishot,
        execute: this.lastExecute
      })
    }

    // Corruption heal (Symbiotic Conversion)
    if (this.stats.corruptionHealRatio > 0 && this.stats.corruptionEnabled) {
      const healAmount = effectiveDamage * deltaSeconds * this.stats.corruptionHealRatio
      if (healAmount > 0) {
        const actualHeal = Math.min(healAmount, this.stats.maxHp - this.currentHp)
        this.currentHp += actualHeal
        this.totalHealed += actualHeal
        if (actualHeal > 0.5) {
          this.recentHealEvents.push({ time: this.runTime, amount: actualHeal, type: 'lifesteal' })
        }
      }
    }

    // Calculate incoming damage
    let incomingDamage = this.incomingThreatPerSecond * deltaSeconds

    // Armor reduction (0.3 per armor point per second)
    const armorReduction = this.stats.armor * 0.3 * deltaSeconds
    incomingDamage = Math.max(0, incomingDamage - armorReduction)

    // Flat damage reduction
    if (this.stats.flatDamageReduction > 0) {
      incomingDamage = Math.max(0, incomingDamage - this.stats.flatDamageReduction * deltaSeconds)
    }

    // Damage smoothing (average over 3 seconds)
    if (this.stats.damageSmoothing) {
      this.damageBuffer.push({ damage: incomingDamage, time: this.runTime })
      this.damageBuffer = this.damageBuffer.filter(d => this.runTime - d.time < 3)
      incomingDamage = this.damageBuffer.reduce((s, d) => s + d.damage, 0) / Math.max(1, this.damageBuffer.length)
    }

    // Track damage events for visual
    if (incomingDamage > 0.5) {
      this.recentDamageEvents.push({ time: this.runTime, amount: incomingDamage })

      // Screen shake on big hits
      const hpPercent = incomingDamage / this.stats.maxHp
      if (hpPercent > 0.05) {
        this.screenShakeIntensity = Math.max(this.screenShakeIntensity, Math.min(1, hpPercent * 3))
      }
    }

    this.applyDamage(incomingDamage, true, true)
  }

  applyDamage(amount, convertToScrap = true, trackTaken = true) {
    this.currentHp = Math.max(0, this.currentHp - amount)

    if (trackTaken) {
      this.totalDamageTaken += amount
    }

    // Damage to scrap conversion (Parasitic Harvest)
    if (convertToScrap && this.stats.damageToScrapRatio > 0) {
      const scrapGained = amount * this.stats.damageToScrapRatio
      this.scrap += scrapGained
      this.totalScrapEarned += scrapGained
    }
  }

  applyRegen(deltaSeconds) {
    // Base regen
    let regen = this.stats.regenPerSecond * deltaSeconds

    // Adaptive regen (below 50% HP)
    if (this.stats.adaptiveRegen > 0 && this.currentHp < this.stats.maxHp * 0.5) {
      regen += this.stats.adaptiveRegen * deltaSeconds
    }

    // Wave modifier temp regen
    if (this.waveModifierEffect?.tempRegen) {
      regen += this.waveModifierEffect.tempRegen * deltaSeconds
    }

    if (regen > 0) {
      const actualRegen = Math.min(regen, this.stats.maxHp - this.currentHp)
      this.currentHp += actualRegen
      this.totalHealed += actualRegen
    }
  }

  // ─────────────────────────────────────────────────────────────
  // WAVE STATE MANAGEMENT
  // ─────────────────────────────────────────────────────────────
  updateWaveState(deltaSeconds) {
    if (this.wavePhase === 'combat') {
      this.waveTimer += deltaSeconds
      if (this.waveTimer >= WAVE_CONFIG.baseWaveDuration) {
        this.completeWave()
      }
    } else {
      this.waveTransitionTimer += deltaSeconds
      const transitionTime = WAVE_CONFIG.waveTransitionTime + this.stats.waveDelayBonus
      if (this.waveTransitionTimer >= transitionTime) {
        this.startNextWave()
      }
    }
  }

  completeWave() {
    // Calculate wave reward
    let reward = WAVE_CONFIG.baseScrapPerWave * (1 + this.waveIndex * 0.12)
    reward *= this.stats.scrapMultiplier

    // Wave modifier scrap bonus
    if (this.waveModifierEffect?.scrapMult) {
      reward *= this.waveModifierEffect.scrapMult
    }

    // On wave complete bonus
    if (this.stats.onWaveCompleteScrapBonus > 0) {
      reward += this.stats.onWaveCompleteScrapBonus
    }

    this.scrap += Math.floor(reward)
    this.totalScrapEarned += Math.floor(reward)
    this.highestWave = Math.max(this.highestWave, this.waveIndex)

    // Check milestones
    this.checkMilestones()

    // Clear wave modifier
    this.currentWaveModifier = null
    this.waveModifierEffect = null

    // Check stun pulse trigger
    if (this.stats.stunPulseEveryWaves > 0) {
      this.wavesUntilStun--
      if (this.wavesUntilStun <= 0) {
        this.triggerStunPulse()
        this.wavesUntilStun = this.stats.stunPulseEveryWaves
      }
    }

    this.wavePhase = 'transition'
    this.waveTransitionTimer = 0
  }

  startNextWave() {
    this.waveIndex++
    this.wavePhase = 'combat'
    this.waveTimer = 0

    // Roll for wave modifier
    if (this.waveIndex >= WAVE_CONFIG.modifierStartWave) {
      if ((this.waveIndex - WAVE_CONFIG.modifierStartWave) % WAVE_CONFIG.modifierInterval === 0) {
        const modKey = getRandomModifier()
        this.currentWaveModifier = modKey
        this.waveModifierEffect = WAVE_MODIFIERS[modKey]?.effect || null
      }
    }

    // Initialize stun pulse counter on first wave with the upgrade
    if (this.stats.stunPulseEveryWaves > 0 && this.wavesUntilStun === 0) {
      this.wavesUntilStun = this.stats.stunPulseEveryWaves
    }

    this.calculateIncomingThreat()
  }

  checkMilestones() {
    for (const [key, milestone] of Object.entries(MILESTONES)) {
      if (this.waveIndex >= milestone.wave && !this.claimedMilestones.includes(key)) {
        this.claimedMilestones.push(key)
        this.pendingMilestoneShards += milestone.shards
      }
    }
  }

  // ─────────────────────────────────────────────────────────────
  // VISUAL STATE
  // ─────────────────────────────────────────────────────────────
  updateVisualState(deltaSeconds) {
    const targetThreat = this.wavePhase === 'combat' && !this.stunActive
      ? this.incomingThreatPerSecond
      : 0
    this.visualThreatLevel += (targetThreat - this.visualThreatLevel) * Math.min(1, deltaSeconds * 3)
    this.isWaveTransition = this.wavePhase === 'transition'

    // Decay screen shake
    this.screenShakeIntensity *= Math.pow(0.1, deltaSeconds)
    if (this.screenShakeIntensity < 0.01) this.screenShakeIntensity = 0
  }

  // ─────────────────────────────────────────────────────────────
  // UPGRADE SYSTEM
  // ─────────────────────────────────────────────────────────────
  hasUpgrade(id) {
    return this.purchasedUpgrades.includes(id)
  }

  getUpgradeLevel(id) {
    return this.purchaseLevels[id] || 0
  }

  purchaseUpgrade(upgradeId, metaLevels = {}) {
    const currentLevel = this.purchaseLevels[upgradeId] || 0

    const check = canPurchaseUpgrade(
      upgradeId,
      this.purchasedUpgrades,
      this.blockedTrees,
      this.scrap,
      metaLevels,
      this.purchaseLevels
    )

    if (!check.canBuy) return { success: false, reason: check.reason }

    const upgrade = UPGRADES[upgradeId]
    const metaLevel = metaLevels[upgradeId] || 0
    const cost = getModifiedCost(upgrade, metaLevel, currentLevel)

    this.scrap -= cost
    this.totalSpentThisRun += cost

    // Track level for multi-level nodes
    const newLevel = currentLevel + 1
    this.purchaseLevels[upgradeId] = newLevel

    // Only add to purchasedUpgrades on first purchase
    if (!this.purchasedUpgrades.includes(upgradeId)) {
      this.purchasedUpgrades.push(upgradeId)
    }

    // Handle tree commit on first purchase
    if (upgrade.treeCommit && currentLevel === 0) {
      this.committedTrees.push(upgrade.tree)
      const blocked = TREE_BLOCKS[upgrade.tree]
      if (!this.blockedTrees.includes(blocked) && !this.committedTrees.includes(blocked)) {
        this.blockedTrees.push(blocked)
      }
    }

    // Apply effects with meta bonuses
    this.applyUpgradeEffects(upgrade, metaLevel)

    return { success: true, cost, level: newLevel }
  }

  applyUpgradeEffects(upgrade, metaLevel) {
    const effects = getModifiedEffects(upgrade, metaLevel, 1)

    for (const [key, value] of Object.entries(effects)) {
      if (key in this.stats) {
        if (typeof value === 'number') {
          this.stats[key] += value
        } else if (typeof value === 'boolean') {
          this.stats[key] = value
        }
      }
    }

    // Apply maxHpMultiplier AFTER adding flat HP
    if (effects.maxHpMultiplier && effects.maxHpMultiplier !== 0) {
      const bonusHp = Math.floor(BASE_STATS.maxHp * effects.maxHpMultiplier)
      this.stats.maxHp += bonusHp
      if (bonusHp > 0) {
        this.currentHp += bonusHp // Heal when gaining HP
      }
    }

    // Heal when gaining max HP from flat bonuses
    if (effects.maxHp && effects.maxHp > 0) {
      this.currentHp = Math.min(this.stats.maxHp, this.currentHp + effects.maxHp)
    }
  }

  // ─────────────────────────────────────────────────────────────
  // ESTIMATORS
  // ─────────────────────────────────────────────────────────────
  getTimeToDeathEstimate() {
    const armorReduction = this.stats.armor * 0.3
    let actualDamageIn = Math.max(0, this.incomingThreatPerSecond - armorReduction)

    // Account for flat damage reduction
    actualDamageIn = Math.max(0, actualDamageIn - this.stats.flatDamageReduction)

    // Account for corruption self-damage
    actualDamageIn += this.corruptionSelfDamage || 0

    let effectiveRegen = this.stats.regenPerSecond

    // Adaptive regen if applicable
    if (this.stats.adaptiveRegen > 0 && this.currentHp < this.stats.maxHp * 0.5) {
      effectiveRegen += this.stats.adaptiveRegen
    }

    // Corruption heal (approximate)
    if (this.stats.corruptionHealRatio > 0) {
      effectiveRegen += this.effectiveDps * this.stats.corruptionHealRatio * 0.1
    }

    const netDamage = actualDamageIn - effectiveRegen
    if (netDamage <= 0) return Infinity

    let timeLeft = this.currentHp / netDamage

    // Account for revive
    if (this.stats.reviveOnce && !this.hasRevived) {
      timeLeft *= 1.5 // Rough estimate
    }

    return timeLeft
  }

  getRoundsTillDeath() {
    const ttd = this.getTimeToDeathEstimate()
    if (ttd === Infinity) return Infinity

    const fullRoundDuration = WAVE_CONFIG.baseWaveDuration + WAVE_CONFIG.waveTransitionTime + this.stats.waveDelayBonus
    return Math.floor(ttd / fullRoundDuration)
  }

  // ─────────────────────────────────────────────────────────────
  // SNAPSHOT FOR UI
  // ─────────────────────────────────────────────────────────────
  getSnapshot() {
    // Calculate effective max HP with multiplier
    const effectiveMaxHp = Math.floor(this.stats.maxHp * (1 + (this.stats.maxHpMultiplier - 1) * 0))

    return {
      // Core stats
      currentHp: Math.floor(this.currentHp),
      maxHp: this.stats.maxHp,
      hpPercent: (this.currentHp / this.stats.maxHp) * 100,
      scrap: Math.floor(this.scrap),
      totalSpentThisRun: this.totalSpentThisRun,

      // Wave state
      waveIndex: this.waveIndex,
      wavePhase: this.wavePhase,
      waveProgress: this.wavePhase === 'combat' ? (this.waveTimer / WAVE_CONFIG.baseWaveDuration) * 100 : 0,
      transitionProgress: this.wavePhase === 'transition'
        ? (this.waveTransitionTimer / (WAVE_CONFIG.waveTransitionTime + this.stats.waveDelayBonus)) * 100
        : 0,
      currentWaveModifier: this.currentWaveModifier,
      waveModifierData: this.currentWaveModifier ? WAVE_MODIFIERS[this.currentWaveModifier] : null,

      // Combat stats
      incomingThreatPerSecond: Math.round(this.incomingThreatPerSecond * 10) / 10,
      effectiveDps: Math.round(this.effectiveDps * 10) / 10,
      currentDurability: Math.round(this.currentDurability * 100) / 100,
      timeToDeathEstimate: this.getTimeToDeathEstimate(),
      roundsTillDeath: this.getRoundsTillDeath(),

      // Detailed stats for stat panel
      armor: this.stats.armor,
      regenPerSecond: Math.round(this.stats.regenPerSecond * 10) / 10,
      adaptiveRegen: this.stats.adaptiveRegen,
      attackSpeed: Math.round(this.stats.attackSpeed * 100) / 100,
      damageMultiplier: Math.round(this.stats.damageMultiplier * 100),
      baseDamage: Math.round(this.stats.baseDamage),
      scrapMultiplier: Math.round(this.stats.scrapMultiplier * 100),
      threatMultiplier: Math.round((1 + this.stats.threatMultiplier) * 100),

      // Corruption system
      corruptionEnabled: this.stats.corruptionEnabled,
      corruptionStacks: Math.floor(this.corruptionStacks * 10) / 10,
      corruptionMaxStacks: this.stats.uncappedCorruption ? Infinity : this.stats.maxCorruption,
      corruptionSelfDamage: Math.round(this.corruptionSelfDamage * 10) / 10,
      corruptionDamageBonus: Math.round(this.corruptionStacks * (this.stats.corruptionDamageBonus || 0.03) * 100),

      // Burst window
      burstWindowActive: this.burstWindowActive,
      burstTimer: this.burstTimer % this.burstCycleTime,
      burstCycleTime: this.burstCycleTime,
      burstDuration: this.burstDuration,

      // Stun system
      stunActive: this.stunActive,
      stunTimer: this.stunTimer,

      // Execute system
      executeThreshold: this.stats.executeThreshold,
      multiShotChance: this.stats.multiShotChance,

      // Revive
      hasRevive: this.stats.reviveOnce && !this.hasRevived,
      hasRevived: this.hasRevived,

      // Upgrade state
      purchasedUpgrades: [...this.purchasedUpgrades],
      purchaseLevels: { ...this.purchaseLevels },
      committedTrees: [...this.committedTrees],
      blockedTrees: [...this.blockedTrees],

      // Run stats
      runTime: Math.floor(this.runTime),
      highestWave: this.highestWave,
      totalDamageDealt: Math.floor(this.totalDamageDealt),
      totalDamageTaken: Math.floor(this.totalDamageTaken),
      totalHealed: Math.floor(this.totalHealed),
      enemiesKilled: Math.floor(this.enemiesKilled),

      // Milestones
      claimedMilestones: [...this.claimedMilestones],
      pendingMilestoneShards: this.pendingMilestoneShards,

      // Visual state
      visualThreatLevel: this.visualThreatLevel,
      isWaveTransition: this.isWaveTransition,
      recentDamageEvents: [...this.recentDamageEvents],
      recentKillEvents: [...this.recentKillEvents],
      recentHealEvents: [...this.recentHealEvents],
      screenShakeIntensity: this.screenShakeIntensity,

      // Game state
      isGameOver: this.isGameOver,
      shardsEarned: this.shardsEarned,
      isPaused: this.isPaused,
      speedMultiplier: this.speedMultiplier
    }
  }
}