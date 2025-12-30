// src/composables/useCoreDefenseGame.js
// Vue composable bridging GameEngine to reactive Vue state

import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { GameEngine } from '@/game/GameEngine'
import {
  UPGRADES,
  TREE_BLOCKS,
  TREE_COLORS,
  TREE_ICONS,
  TREE_DESCRIPTIONS,
  WAVE_MODIFIERS,
  MILESTONES,
  getModifiedCost,
  canPurchaseUpgrade,
  getMetaUpgradeCost,
  META_UPGRADE_EFFECTS,
  calculateIdleRewards,
  IDLE_CONFIG
} from '@/game/upgrades'

const STORAGE_KEY = 'core_defense_meta'
const MAX_RUN_HISTORY = 10

function loadMeta() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      return {
        shards: data.shards || 0,
        metaLevels: data.metaLevels || {},
        totalRuns: data.totalRuns || 0,
        bestWave: data.bestWave || 0,
        totalShardsEarned: data.totalShardsEarned || 0,
        lastIdleCollection: data.lastIdleCollection || Date.now(),
        // Stats tracking
        stats: data.stats || {
          totalPlayTime: 0,
          totalWavesCompleted: 0,
          totalScrapEarned: 0,
          totalScrapSpent: 0,
          treeCommits: { integrity: 0, annihilation: 0, entropy: 0, velocity: 0, control: 0 },
          upgradesPurchased: {},
          deaths: 0,
          abandons: 0
        },
        // Run history (last N runs)
        runHistory: data.runHistory || [],
        // Achievements/milestones ever reached
        unlockedMilestones: data.unlockedMilestones || []
      }
    }
  } catch (e) { console.warn('Failed to load meta:', e) }

  return {
    shards: 0,
    metaLevels: {},
    totalRuns: 0,
    bestWave: 0,
    totalShardsEarned: 0,
    lastIdleCollection: Date.now(),
    stats: {
      totalPlayTime: 0,
      totalWavesCompleted: 0,
      totalScrapEarned: 0,
      totalScrapSpent: 0,
      treeCommits: { integrity: 0, annihilation: 0, entropy: 0, velocity: 0, control: 0 },
      upgradesPurchased: {},
      deaths: 0,
      abandons: 0
    },
    runHistory: [],
    unlockedMilestones: []
  }
}

function saveMeta(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) { console.warn('Failed to save meta:', e) }
}

export function useCoreDefenseGame() {
  let engine = null

  const meta = reactive(loadMeta())
  const snapshot = ref(null)
  const isRunning = ref(false)
  const showMetaPanel = ref(false)
  const showDeathModal = ref(false)
  const showStatsModal = ref(false)
  const showStatBreakdown = ref(false)
  const selectedTree = ref(null)
  const expandedTree = ref(null)
  const metaExpandedTree = ref(null)

  // Death modal data
  const deathData = ref(null)

  // Idle rewards
  const idleRewards = ref(calculateIdleRewards(meta.lastIdleCollection, meta.bestWave))
  let idleUpdateInterval = null

  // Notification for offline rewards
  const offlineNotification = ref(null)

  // Throttled snapshot updates
  let lastSnapshotTime = 0
  const SNAPSHOT_INTERVAL = 100

  function onEngineTick(engineSnapshot) {
    // Handle death immediately
    if (engineSnapshot.isGameOver && !showDeathModal.value) {
      snapshot.value = engineSnapshot

      deathData.value = {
        waveReached: engineSnapshot.highestWave,
        runTime: engineSnapshot.runTime,
        totalSpent: engineSnapshot.totalSpentThisRun,
        shardsEarned: engineSnapshot.shardsEarned,
        wasAbandoned: false,
        committedTrees: [...engineSnapshot.committedTrees],
        claimedMilestones: [...engineSnapshot.claimedMilestones],
        totalDamageDealt: engineSnapshot.totalDamageDealt,
        totalDamageTaken: engineSnapshot.totalDamageTaken,
        enemiesKilled: engineSnapshot.enemiesKilled
      }

      showDeathModal.value = true
      return
    }

    // Normal throttled updates
    const now = performance.now()
    if (now - lastSnapshotTime >= SNAPSHOT_INTERVAL) {
      snapshot.value = engineSnapshot
      lastSnapshotTime = now
    }
  }

  // Idle polling
  function startIdlePolling() {
    stopIdlePolling()
    updateIdleRewards()
    idleUpdateInterval = setInterval(updateIdleRewards, 3000)
  }

  function stopIdlePolling() {
    if (idleUpdateInterval) {
      clearInterval(idleUpdateInterval)
      idleUpdateInterval = null
    }
  }

  function updateIdleRewards() {
    idleRewards.value = calculateIdleRewards(meta.lastIdleCollection, meta.bestWave)
  }

  function collectIdleRewards() {
    const rewards = calculateIdleRewards(meta.lastIdleCollection, meta.bestWave)
    if (rewards.shards > 0) {
      meta.shards += rewards.shards
      meta.totalShardsEarned += rewards.shards
      meta.lastIdleCollection = Date.now()
      saveMeta(meta)
      updateIdleRewards()

      // Show notification
      offlineNotification.value = {
        shards: rewards.shards,
        hours: rewards.elapsedHours
      }
      setTimeout(() => { offlineNotification.value = null }, 3000)
    }
    return rewards
  }

  // Check for offline rewards on mount
  function checkOfflineRewards() {
    const rewards = calculateIdleRewards(meta.lastIdleCollection, meta.bestWave)
    if (rewards.shards >= 5) { // Only show if significant
      offlineNotification.value = {
        shards: rewards.shards,
        hours: rewards.elapsedHours,
        pending: true
      }
    }
  }

  const gameState = computed(() => snapshot.value || {
    currentHp: 100, maxHp: 100, hpPercent: 100, scrap: 0,
    waveIndex: 0, wavePhase: 'combat', waveProgress: 0,
    incomingThreatPerSecond: 0, effectiveDps: 0, timeToDeathEstimate: Infinity,
    roundsTillDeath: Infinity,
    purchasedUpgrades: [], purchaseLevels: {}, committedTrees: [], blockedTrees: [],
    isGameOver: false, shardsEarned: 0, isPaused: false, speedMultiplier: 1,
    visualThreatLevel: 0, recentDamageEvents: [], recentKillEvents: [], recentHealEvents: [],
    armor: 0, regenPerSecond: 0, attackSpeed: 1, damageMultiplier: 100,
    corruptionEnabled: false, corruptionStacks: 0, corruptionDamageBonus: 0,
    burstWindowActive: false, stunActive: false,
    currentWaveModifier: null, waveModifierData: null,
    screenShakeIntensity: 0, hasRevive: false, hasRevived: false,
    baseDamage: 8, scrapMultiplier: 100, threatMultiplier: 100,
    adaptiveRegen: 0, executeThreshold: 0, multiShotChance: 0
  })

  const formattedRTD = computed(() => {
    const rtd = gameState.value.roundsTillDeath
    if (rtd === Infinity || rtd > 99) return '∞'
    if (rtd <= 0) return '0'
    return rtd.toString()
  })

  const formattedTTD = computed(() => {
    const ttd = gameState.value.timeToDeathEstimate
    if (ttd === Infinity || ttd > 9999) return '∞'
    if (ttd < 0) return '0s'
    const m = Math.floor(ttd / 60)
    const s = Math.floor(ttd % 60)
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  })

  const formattedRunTime = computed(() => {
    const t = gameState.value.runTime || 0
    return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`
  })

  const formattedIdleTime = computed(() => {
    const h = idleRewards.value?.elapsedHours || 0
    if (isNaN(h) || h === 0) return '0m'
    if (h < 1) return `${Math.floor(h * 60)}m`
    return `${Math.floor(h)}h ${Math.floor((h % 1) * 60)}m`
  })

  // Tree usage heatmap
  const treeHeatmap = computed(() => {
    const commits = meta.stats?.treeCommits || {}
    const total = Object.values(commits).reduce((a, b) => a + b, 0) || 1
    const maxCommits = Math.max(...Object.values(commits), 1)
    const trees = ['integrity', 'annihilation', 'entropy', 'velocity', 'control']

    return trees.map(name => {
      const count = commits[name] || 0
      const percent = (count / total) * 100
      const intensity = maxCommits > 0 ? count / maxCommits : 0
      return { name, count, percent: Math.round(percent), intensity }
    })
  })

  // Get total meta investment for a tree
  const treeMetaLevels = computed(() => {
    const trees = {}
    for (const [upgradeId, level] of Object.entries(meta.metaLevels)) {
      const upgrade = UPGRADES[upgradeId]
      if (upgrade) {
        trees[upgrade.tree] = (trees[upgrade.tree] || 0) + level
      }
    }
    return trees
  })

  function startNewRun() {
    if (engine) engine.stop()
    engine = new GameEngine()
    engine.start(onEngineTick)
    isRunning.value = true
    showDeathModal.value = false
    showMetaPanel.value = false
    showStatsModal.value = false
    showStatBreakdown.value = false
    selectedTree.value = null
    expandedTree.value = null
    deathData.value = null
    stopIdlePolling()
    meta.totalRuns++
    saveMeta(meta)
  }

  function togglePause() {
    if (!engine) return
    engine.setPaused(!engine.isPaused)
    snapshot.value = engine.getSnapshot()
  }

  function setSpeed(mult) {
    if (!engine) return
    engine.setSpeed(mult)
    snapshot.value = engine.getSnapshot()
  }

  function purchaseUpgrade(upgradeId) {
    if (!engine || gameState.value.isGameOver) return { success: false }
    const result = engine.purchaseUpgrade(upgradeId, meta.metaLevels)
    if (result.success) {
      snapshot.value = engine.getSnapshot()
      // Track upgrade purchase
      if (!meta.stats.upgradesPurchased[upgradeId]) {
        meta.stats.upgradesPurchased[upgradeId] = 0
      }
      meta.stats.upgradesPurchased[upgradeId]++
    }
    return result
  }

  function getUpgradeState(upgradeId) {
    const upgrade = UPGRADES[upgradeId]
    if (!upgrade) return null

    const purchaseLevels = gameState.value.purchaseLevels || {}
    const currentLevel = purchaseLevels[upgradeId] || 0
    const maxLevel = upgrade.maxLevel || 1

    const isPurchased = gameState.value.purchasedUpgrades.includes(upgradeId)
    const metaLevel = meta.metaLevels[upgradeId] || 0

    const check = canPurchaseUpgrade(
      upgradeId,
      gameState.value.purchasedUpgrades,
      gameState.value.blockedTrees,
      gameState.value.scrap,
      meta.metaLevels,
      purchaseLevels
    )

    const cost = check.cost || getModifiedCost(upgrade, metaLevel, currentLevel)

    let isLocked = false, lockedBy = null
    for (const p of gameState.value.purchasedUpgrades) {
      if (UPGRADES[p]?.locks?.includes(upgradeId)) {
        isLocked = true
        lockedBy = UPGRADES[p].name
        break
      }
    }

    return {
      ...upgrade,
      isPurchased,
      canBuy: check.canBuy,
      reason: check.reason,
      cost,
      metaLevel,
      isLocked,
      lockedBy,
      currentLevel,
      maxLevel,
      isMaxed: maxLevel > 1 ? currentLevel >= maxLevel : isPurchased
    }
  }

  function updateStatsOnRunEnd(runData) {
    if (!meta.stats) {
      meta.stats = {
        totalPlayTime: 0,
        totalWavesCompleted: 0,
        totalScrapEarned: 0,
        totalScrapSpent: 0,
        treeCommits: { integrity: 0, annihilation: 0, entropy: 0, velocity: 0, control: 0 },
        upgradesPurchased: {},
        deaths: 0,
        abandons: 0
      }
    }

    meta.stats.totalPlayTime += runData.runTime || 0
    meta.stats.totalWavesCompleted += runData.waveReached || 0
    meta.stats.totalScrapSpent += runData.totalSpent || 0

    if (runData.wasAbandoned) {
      meta.stats.abandons++
    } else {
      meta.stats.deaths++
    }

    // Track tree commits
    if (runData.committedTrees) {
      runData.committedTrees.forEach(tree => {
        meta.stats.treeCommits[tree] = (meta.stats.treeCommits[tree] || 0) + 1
      })
    }

    // Update unlocked milestones
    if (runData.claimedMilestones) {
      runData.claimedMilestones.forEach(m => {
        if (!meta.unlockedMilestones.includes(m)) {
          meta.unlockedMilestones.push(m)
        }
      })
    }

    // Add to run history
    const historyEntry = {
      timestamp: Date.now(),
      wave: runData.waveReached,
      time: runData.runTime,
      shards: runData.shardsEarned,
      trees: runData.committedTrees || [],
      wasAbandoned: runData.wasAbandoned
    }

    meta.runHistory.unshift(historyEntry)
    if (meta.runHistory.length > MAX_RUN_HISTORY) {
      meta.runHistory = meta.runHistory.slice(0, MAX_RUN_HISTORY)
    }
  }

  function claimShards() {
    if (!deathData.value) return

    updateStatsOnRunEnd(deathData.value)

    meta.shards += deathData.value.shardsEarned
    meta.totalShardsEarned += deathData.value.shardsEarned
    meta.bestWave = Math.max(meta.bestWave, deathData.value.waveReached)
    saveMeta(meta)

    showDeathModal.value = false
    isRunning.value = false
    deathData.value = null
    if (engine) { engine.stop(); engine = null }
    snapshot.value = null
    startIdlePolling()
  }

  function abandonRun() {
    if (!engine) return

    const snap = engine.getSnapshot()
    const shardsEarned = Math.floor(engine.totalSpentThisRun * 0.12) + (snap.pendingMilestoneShards || 0)

    deathData.value = {
      waveReached: engine.highestWave,
      runTime: engine.runTime,
      totalSpent: engine.totalSpentThisRun,
      shardsEarned,
      wasAbandoned: true,
      committedTrees: [...engine.committedTrees],
      claimedMilestones: [...engine.claimedMilestones],
      totalDamageDealt: snap.totalDamageDealt,
      totalDamageTaken: snap.totalDamageTaken,
      enemiesKilled: snap.enemiesKilled
    }

    engine.stop()
    engine = null
    snapshot.value = null

    showDeathModal.value = true
    isRunning.value = false
    startIdlePolling()
  }

  function purchaseMetaUpgrade(upgradeId) {
    const level = meta.metaLevels[upgradeId] || 0
    const cost = getMetaUpgradeCost(level)
    if (cost === Infinity || meta.shards < cost) return { success: false }
    meta.shards -= cost
    meta.metaLevels[upgradeId] = level + 1
    saveMeta(meta)
    return { success: true }
  }

  function getMetaUpgradeInfo(upgradeId) {
    const level = meta.metaLevels[upgradeId] || 0
    const nextCost = getMetaUpgradeCost(level)
    return {
      currentLevel: level,
      maxLevel: 5,
      nextCost,
      canUpgrade: level < 5 && meta.shards >= nextCost,
      effectBonus: Math.round(level * META_UPGRADE_EFFECTS.effectBonus * 100),
      costReduction: Math.round(level * META_UPGRADE_EFFECTS.costReduction * 100)
    }
  }

  function toggleExpandedTree(name) {
    expandedTree.value = expandedTree.value === name ? null : name
  }

  function toggleMetaExpandedTree(name) {
    metaExpandedTree.value = metaExpandedTree.value === name ? null : name
  }

  function toggleStatBreakdown() {
    showStatBreakdown.value = !showStatBreakdown.value
  }

  // Export save data
  function exportSave() {
    const data = JSON.stringify(meta)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `core-defense-save-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import save data
  function importSave(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          // Validate basic structure
          if (typeof data.shards !== 'number') {
            throw new Error('Invalid save file')
          }
          // Merge with defaults
          Object.assign(meta, loadMeta(), data)
          saveMeta(meta)
          resolve(true)
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  // Reset all progress
  function resetProgress() {
    localStorage.removeItem(STORAGE_KEY)
    Object.assign(meta, loadMeta())
    saveMeta(meta)
  }

  const allTrees = computed(() => {
    const trees = ['integrity', 'annihilation', 'entropy', 'velocity', 'control']
    return trees.map(name => {
      const upgrades = Object.values(UPGRADES).filter(u => u.tree === name)
      const isCommitted = gameState.value.committedTrees.includes(name)
      const isBlocked = gameState.value.blockedTrees.includes(name)

      return {
        name,
        displayName: name.charAt(0).toUpperCase() + name.slice(1),
        icon: TREE_ICONS[name],
        description: TREE_DESCRIPTIONS[name],
        colors: TREE_COLORS[name],
        upgrades: upgrades.sort((a, b) => a.nodeIndex - b.nodeIndex),
        isCommitted,
        isBlocked,
        blocks: TREE_BLOCKS[name],
        metaInvestment: treeMetaLevels.value[name] || 0
      }
    })
  })

  onMounted(() => {
    if (!isRunning.value) {
      startIdlePolling()
      checkOfflineRewards()
    }
  })

  onUnmounted(() => {
    if (engine) { engine.stop(); engine = null }
    stopIdlePolling()
  })

  return {
    // State
    meta, snapshot, gameState, isRunning, showMetaPanel, showDeathModal, showStatsModal,
    showStatBreakdown, selectedTree, expandedTree, metaExpandedTree, idleRewards, allTrees,
    formattedTTD, formattedRTD, formattedRunTime, formattedIdleTime,
    deathData, treeHeatmap, offlineNotification,

    // Actions
    startNewRun, togglePause, setSpeed, purchaseUpgrade, getUpgradeState,
    claimShards, abandonRun, purchaseMetaUpgrade, getMetaUpgradeInfo,
    toggleExpandedTree, toggleMetaExpandedTree, toggleStatBreakdown,
    collectIdleRewards, startIdlePolling, stopIdlePolling,
    exportSave, importSave, resetProgress,

    // Constants
    TREE_COLORS, TREE_ICONS, TREE_BLOCKS, UPGRADES, IDLE_CONFIG, WAVE_MODIFIERS, MILESTONES
  }
}