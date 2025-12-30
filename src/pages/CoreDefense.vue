<script setup>
// src/pages/CoreDefense.vue
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useCoreDefenseGame } from '@/composables/useCoreDefenseGame'
import {
  Shield, Flame, Skull, Zap, Target, Play, Pause,
  Lock, Check, X, Gem, Heart, Users, Crown, Coins,
  FastForward, Clock, ArrowLeft, LogOut, Info,
  BarChart3, Timer, Download, Upload, Trash2, AlertTriangle,
  Swords, TrendingUp, Activity, Sparkles
} from 'lucide-vue-next'
import SkillTree from '@/components/SkillTree.vue'

const {
  meta, gameState, isRunning, showMetaPanel, showDeathModal, showStatsModal,
  showStatBreakdown, expandedTree, metaExpandedTree, idleRewards, allTrees, 
  formattedRTD, formattedRunTime, formattedIdleTime,
  deathData, treeHeatmap, offlineNotification,
  startNewRun, togglePause, setSpeed, purchaseUpgrade, getUpgradeState,
  claimShards, abandonRun, purchaseMetaUpgrade, getMetaUpgradeInfo,
  toggleExpandedTree, toggleMetaExpandedTree, toggleStatBreakdown,
  collectIdleRewards, exportSave, importSave, resetProgress,
  TREE_COLORS, WAVE_MODIFIERS, MILESTONES
} = useCoreDefenseGame()

const treeIcons = { integrity: Shield, annihilation: Flame, entropy: Skull, velocity: Zap, control: Target }
const modifierIcons = { Shield, Users, Crown, Zap, Heart, Coins }

// File input ref for import
const fileInputRef = ref(null)
const showResetConfirm = ref(false)

// Pentagon positions
const pentagonPositions = computed(() => {
  const trees = ['integrity', 'annihilation', 'entropy', 'velocity', 'control']
  return trees.map((name, i) => {
    const angle = (i * 72 - 90) * (Math.PI / 180)
    const radius = 36
    return {
      name,
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle)
    }
  })
})

// Canvas and animation
const canvasRef = ref(null)
let animationFrame = null
let particles = []
let onResize = null

function spawnParticle() {
  const angle = Math.random() * Math.PI * 2
  const dist = 120 + Math.random() * 80
  particles.push({
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    angle,
    speed: 0.3 + Math.random() * 0.9,
    size: 0.8 + Math.random() * 2.2,
    hue: Math.random() > 0.5 ? 0 : 200 + Math.random() * 60
  })
}

function initCombatCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

  const cssW = canvas.offsetWidth
  const cssH = canvas.offsetHeight

  canvas.width = Math.max(1, Math.floor(cssW * dpr))
  canvas.height = Math.max(1, Math.floor(cssH * dpr))

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(dpr, dpr)

  particles = []
  for (let i = 0; i < 30; i++) spawnParticle()

  if (animationFrame) cancelAnimationFrame(animationFrame)
  renderCombat()
}

function renderCombat() {
  const canvas = canvasRef.value
  if (!canvas || !isRunning.value) return

  const ctx = canvas.getContext('2d')
  const w = canvas.offsetWidth
  const h = canvas.offsetHeight
  
  // Apply screen shake
  const shake = gameState.value.screenShakeIntensity || 0
  const shakeX = shake * (Math.random() - 0.5) * 10
  const shakeY = shake * (Math.random() - 0.5) * 10
  
  const cx = w / 2 + shakeX
  const cy = h / 2 + shakeY

  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, w, h)

  const threat = gameState.value.visualThreatLevel || 0
  const isTransition = gameState.value.isWaveTransition
  const isPaused = gameState.value.isPaused
  const hpPercent = gameState.value.hpPercent || 100
  const corruptionStacks = gameState.value.corruptionStacks || 0
  const burstActive = gameState.value.burstWindowActive
  const stunActive = gameState.value.stunActive

  // Corruption visual overlay
  if (corruptionStacks > 0) {
    const corruptionAlpha = Math.min(0.3, corruptionStacks * 0.02)
    ctx.fillStyle = `rgba(168, 85, 247, ${corruptionAlpha})`
    ctx.fillRect(0, 0, w, h)
  }

  // Stun visual effect
  if (stunActive) {
    ctx.fillStyle = 'rgba(245, 158, 11, 0.15)'
    ctx.fillRect(0, 0, w, h)
  }

  // Particles
  particles.forEach((p) => {
    const dist = Math.sqrt(p.x * p.x + p.y * p.y)

    if (!isTransition && !isPaused && !stunActive) {
      p.x -= Math.cos(p.angle) * p.speed * (1 + threat * 0.03)
      p.y -= Math.sin(p.angle) * p.speed * (1 + threat * 0.03)
    }

    if (dist < 25 || dist > 200) {
      const newAngle = Math.random() * Math.PI * 2
      const newDist = 120 + Math.random() * 80
      p.x = Math.cos(newAngle) * newDist
      p.y = Math.sin(newAngle) * newDist
      p.angle = newAngle
      
      // Corruption affects particle color
      if (corruptionStacks > 5) {
        p.hue = 280 + Math.random() * 40 // Purple
      } else {
        p.hue = Math.random() > 0.5 ? 0 : 200 + Math.random() * 60
      }
    }

    const screenX = cx + p.x
    const screenY = cy + p.y
    const baseAlpha = Math.min(0.9, dist / 60)
    let alpha = isTransition || stunActive ? baseAlpha * 0.2 : baseAlpha

    ctx.beginPath()
    ctx.arc(screenX, screenY, Math.max(1, p.size), 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${p.hue}, 70%, 55%, ${alpha})`
    ctx.fill()
  })

  // Core visualization
  const coreRadius = 22
  const pulseScale = 1 + Math.sin(Date.now() / 300) * 0.04
  const damageFlash = (gameState.value.recentDamageEvents?.length || 0) > 0
  const healFlash = (gameState.value.recentHealEvents?.length || 0) > 0

  // Burst window glow
  if (burstActive) {
    ctx.beginPath()
    ctx.arc(cx, cy, coreRadius * 3, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(34, 197, 94, 0.15)'
    ctx.fill()
  }

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 2)
  let coreHue = hpPercent > 60 ? 180 : hpPercent > 30 ? 45 : 0
  
  // Corruption tints core purple
  if (corruptionStacks > 3) {
    coreHue = 280
  }
  
  gradient.addColorStop(0, `hsla(${coreHue}, 80%, ${damageFlash ? 80 : healFlash ? 70 : 60}%, 0.8)`)
  gradient.addColorStop(0.5, `hsla(${coreHue}, 70%, 40%, 0.3)`)
  gradient.addColorStop(1, 'transparent')

  ctx.beginPath()
  ctx.arc(cx, cy, coreRadius * 2 * pulseScale, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  ctx.beginPath()
  ctx.arc(cx, cy, coreRadius * pulseScale, 0, Math.PI * 2)
  ctx.fillStyle = damageFlash ? '#fef3c7' : healFlash ? '#86efac' : `hsl(${coreHue}, 70%, 50%)`
  ctx.fill()

  // HP ring
  ctx.beginPath()
  ctx.arc(cx, cy, coreRadius + 5, -Math.PI / 2, -Math.PI / 2 + (hpPercent / 100) * Math.PI * 2)
  ctx.strokeStyle = `hsl(${coreHue}, 80%, 60%)`
  ctx.lineWidth = 3
  ctx.stroke()

  // Revive indicator
  if (gameState.value.hasRevive) {
    ctx.beginPath()
    ctx.arc(cx, cy, coreRadius + 10, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.stroke()
    ctx.setLineDash([])
  }

  animationFrame = requestAnimationFrame(renderCombat)
}

watch(isRunning, (running) => {
  if (running) {
    setTimeout(initCombatCanvas, 50)
  } else {
    if (animationFrame) cancelAnimationFrame(animationFrame)
  }
})

// Keyboard shortcuts
function handleKeydown(e) {
  if (!isRunning.value) return
  
  if (e.code === 'Space') {
    e.preventDefault()
    togglePause()
  } else if (e.code === 'KeyF') {
    setSpeed(gameState.value.speedMultiplier === 1 ? 2 : 1)
  } else if (e.code === 'Digit1') {
    toggleExpandedTree('integrity')
  } else if (e.code === 'Digit2') {
    toggleExpandedTree('annihilation')
  } else if (e.code === 'Digit3') {
    toggleExpandedTree('entropy')
  } else if (e.code === 'Digit4') {
    toggleExpandedTree('velocity')
  } else if (e.code === 'Digit5') {
    toggleExpandedTree('control')
  } else if (e.code === 'Escape') {
    expandedTree.value = null
  }
}

onMounted(() => {
  if (isRunning.value) initCombatCanvas()

  onResize = () => {
    if (!isRunning.value) return
    initCombatCanvas()
  }
  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  if (onResize) window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', handleKeydown)
})

// UI helpers
const hpBarColor = computed(() => {
  const pct = gameState.value.hpPercent
  if (pct > 60) return 'bg-emerald-500'
  if (pct > 30) return 'bg-amber-500'
  return 'bg-red-500'
})

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return Math.floor(n).toString()
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function formatRunTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

const selectedTreeData = computed(() => {
  if (!expandedTree.value) return null
  return allTrees.value.find(t => t.name === expandedTree.value) || null
})

const metaSelectedTreeData = computed(() => {
  if (!metaExpandedTree.value) return null
  return allTrees.value.find(t => t.name === metaExpandedTree.value) || null
})

function canPurchaseUpgradeCheck(upgradeId) {
  const state = getUpgradeState(upgradeId)
  return !!state && !state.isLocked && state.canBuy
}

function handlePurchase(id) {
  if (!canPurchaseUpgradeCheck(id)) return
  purchaseUpgrade(id)
}

function canPurchaseMeta(metaId) {
  const info = getMetaUpgradeInfo(metaId)
  return !!info && info.currentLevel < 5 && info.canUpgrade
}

function handleMetaPurchase(metaId) {
  if (!canPurchaseMeta(metaId)) return
  purchaseMetaUpgrade(metaId)
}

function handleImportClick() {
  fileInputRef.value?.click()
}

async function handleFileImport(event) {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    await importSave(file)
    alert('Save imported successfully!')
  } catch (err) {
    alert('Failed to import save: ' + err.message)
  }
  event.target.value = ''
}

function handleReset() {
  if (showResetConfirm.value) {
    resetProgress()
    showResetConfirm.value = false
  } else {
    showResetConfirm.value = true
    setTimeout(() => { showResetConfirm.value = false }, 3000)
  }
}

function getHeatColor(intensity) {
  if (intensity === 0) return '#1e293b'
  const hue = 40 - (intensity * 40)
  const lightness = 30 + (intensity * 30)
  return `hsl(${hue}, 80%, ${lightness}%)`
}

// Wave modifier icon component
function getModifierIcon(modKey) {
  const mod = WAVE_MODIFIERS[modKey]
  if (!mod) return null
  return modifierIcons[mod.icon] || Zap
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden select-none">
    <!-- Background grid -->
    <div
      class="fixed inset-0 opacity-5 pointer-events-none"
      style="background-image: radial-gradient(circle at 25px 25px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 50px 50px;"
    />

    <!-- Offline notification toast -->
    <Transition name="slide-down">
      <div 
        v-if="offlineNotification && !isRunning" 
        class="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500/20 border border-amber-500/50 rounded-xl px-4 py-3 backdrop-blur-sm"
      >
        <div class="flex items-center gap-3">
          <Clock class="w-5 h-5 text-amber-400" />
          <div>
            <div class="text-sm font-medium text-amber-200">
              {{ offlineNotification.pending ? 'Idle rewards waiting!' : 'Collected!' }}
            </div>
            <div class="text-xs text-amber-400">
              +{{ offlineNotification.shards }} shards ({{ Math.round(offlineNotification.hours * 10) / 10 }}h)
            </div>
          </div>
          <button 
            v-if="offlineNotification.pending"
            @click="collectIdleRewards"
            class="px-3 py-1 bg-amber-500/30 rounded-lg text-sm font-medium text-amber-200 hover:bg-amber-500/40"
          >
            Collect
          </button>
        </div>
      </div>
    </Transition>

    <!-- ==================== HOME SCREEN ==================== -->
    <div v-if="!isRunning" class="relative min-h-screen flex flex-col items-center justify-center p-4">
      <!-- Title -->
      <div class="text-center mb-8">
        <h1 class="text-5xl md:text-6xl font-black tracking-tighter mb-2">
          <span class="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            CORE DEFENSE
          </span>
        </h1>
        <p class="text-slate-500 text-sm tracking-widest uppercase">Survive the Onslaught</p>
      </div>

      <!-- Core visual -->
      <div class="relative w-36 h-36 mb-8">
        <div class="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 animate-pulse"></div>
        <div class="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-600/30"></div>
        <div class="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/50"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <Shield class="w-12 h-12 text-white drop-shadow-lg" />
        </div>
      </div>

      <!-- Idle rewards panel -->
      <div v-if="meta.bestWave > 0" class="w-full max-w-sm mb-6 bg-slate-900/70 rounded-xl border border-slate-800 p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <Clock class="w-4 h-4 text-amber-400" />
            <span class="text-sm font-medium text-slate-300">Idle Rewards</span>
          </div>
          <span class="text-xs text-slate-500">
            {{ formattedIdleTime }}
            <span v-if="idleRewards.capped" class="text-amber-400 ml-1">(MAX)</span>
          </span>
        </div>

        <div class="bg-slate-800/50 rounded-lg p-3 text-center mb-3">
          <div class="text-2xl font-bold text-amber-400">{{ idleRewards.shards }}</div>
          <div class="text-xs text-slate-500">Shards Available</div>
        </div>

        <button
          @click="collectIdleRewards"
          :disabled="idleRewards.shards === 0"
          class="w-full py-2 rounded-lg text-sm font-medium transition-all"
          :class="idleRewards.shards > 0
            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
            : 'bg-slate-800 text-slate-600 cursor-not-allowed'"
        >
          <Gem class="w-4 h-4 inline mr-1" />
          Collect {{ idleRewards.shards }} Shards
        </button>

        <p class="text-xs text-slate-600 text-center mt-2">
          Rate: {{ Math.floor(2 + meta.bestWave * 0.4) }} shards/hr · Max 8 hours
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-3 gap-3 mb-6 w-full max-w-sm">
        <div class="bg-slate-900/60 rounded-xl px-4 py-3 border border-slate-800 text-center">
          <div class="text-2xl font-bold text-amber-400">{{ meta.shards }}</div>
          <div class="text-xs text-slate-500">Shards</div>
        </div>
        <div class="bg-slate-900/60 rounded-xl px-4 py-3 border border-slate-800 text-center">
          <div class="text-2xl font-bold text-emerald-400">{{ meta.bestWave }}</div>
          <div class="text-xs text-slate-500">Best Wave</div>
        </div>
        <div class="bg-slate-900/60 rounded-xl px-4 py-3 border border-slate-800 text-center">
          <div class="text-2xl font-bold text-blue-400">{{ meta.totalRuns }}</div>
          <div class="text-xs text-slate-500">Runs</div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex flex-col gap-3 w-full max-w-sm">
        <button
          @click="startNewRun"
          class="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-bold text-lg tracking-wide transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
        >
          <Play class="w-6 h-6" /> START RUN
        </button>

        <div class="grid grid-cols-2 gap-3">
          <button
            @click="showMetaPanel = true"
            class="py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-all border border-slate-700 flex items-center justify-center gap-2"
          >
            <Gem class="w-4 h-4 text-amber-400" /> Upgrades
          </button>
          <button
            @click="showStatsModal = true"
            class="py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-all border border-slate-700 flex items-center justify-center gap-2"
          >
            <BarChart3 class="w-4 h-4 text-purple-400" /> Stats
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== GAME SCREEN ==================== -->
    <div v-else class="relative min-h-screen flex flex-col">
      <!-- Top bar -->
      <div class="bg-slate-900/90 backdrop-blur border-b border-slate-800 px-3 py-2 sticky top-0 z-20">
        <div class="max-w-4xl mx-auto">
          <!-- HP Bar -->
          <div class="mb-2">
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="text-slate-400 flex items-center gap-1">
                <Heart class="w-3 h-3 text-red-400" /> CORE
                <span v-if="gameState.hasRevive" class="text-amber-400 ml-1">(REVIVE READY)</span>
              </span>
              <span class="font-mono">{{ gameState.currentHp }} / {{ gameState.maxHp }}</span>
            </div>
            <div class="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div :class="hpBarColor" class="h-full transition-all duration-200" :style="{ width: `${gameState.hpPercent}%` }"></div>
            </div>
          </div>

          <!-- Stats row -->
          <div class="grid grid-cols-4 gap-2 text-center text-xs">
            <div class="bg-slate-800/50 rounded px-2 py-1">
              <div class="text-slate-500">SCRAP</div>
              <div class="font-bold text-amber-400">{{ formatNumber(gameState.scrap) }}</div>
            </div>
            <div class="bg-slate-800/50 rounded px-2 py-1">
              <div class="text-slate-500">DPS</div>
              <div class="font-bold text-emerald-400">{{ gameState.effectiveDps }}</div>
            </div>
            <div class="bg-slate-800/50 rounded px-2 py-1">
              <div class="text-slate-500">THREAT</div>
              <div class="font-bold text-red-400">{{ gameState.incomingThreatPerSecond }}/s</div>
            </div>
            <div class="bg-slate-800/50 rounded px-2 py-1 cursor-pointer hover:bg-slate-700/50" @click="toggleStatBreakdown">
              <div class="text-slate-500">RTD</div>
              <div class="font-bold" :class="formattedRTD === '∞' ? 'text-emerald-400' : formattedRTD === '0' ? 'text-red-400' : 'text-orange-400'">
                {{ formattedRTD }}
              </div>
            </div>
          </div>

          <!-- Corruption bar (if active) -->
          <div v-if="gameState.corruptionEnabled" class="mt-2 flex items-center gap-2">
            <Skull class="w-3 h-3 text-purple-400" />
            <div class="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                class="h-full bg-purple-500 transition-all"
                :style="{ width: `${Math.min(100, (gameState.corruptionStacks / (gameState.corruptionMaxStacks === Infinity ? 20 : gameState.corruptionMaxStacks)) * 100)}%` }"
              />
            </div>
            <span class="text-[10px] text-purple-400 font-mono">
              {{ gameState.corruptionStacks.toFixed(1) }}
              <span v-if="gameState.corruptionMaxStacks !== Infinity">/{{ gameState.corruptionMaxStacks }}</span>
              <span class="text-purple-300 ml-1">(+{{ gameState.corruptionDamageBonus }}% dmg)</span>
            </span>
          </div>

          <!-- Burst window indicator -->
          <div v-if="gameState.burstWindowActive" class="mt-2 flex items-center justify-center gap-2 text-xs text-emerald-400 animate-pulse">
            <Zap class="w-3 h-3" />
            <span class="font-bold">BURST ACTIVE!</span>
            <Zap class="w-3 h-3" />
          </div>

          <!-- Stun indicator -->
          <div v-if="gameState.stunActive" class="mt-2 flex items-center justify-center gap-2 text-xs text-amber-400 animate-pulse">
            <Target class="w-3 h-3" />
            <span class="font-bold">ENEMIES STUNNED!</span>
          </div>
        </div>
      </div>

      <!-- Wave bar -->
      <div class="bg-slate-900/50 border-b border-slate-800 px-3 py-2">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-sm font-bold tracking-wider" :class="gameState.wavePhase === 'transition' ? 'text-amber-400' : 'text-cyan-400'">
              {{ gameState.wavePhase === 'transition' ? 'WAVE INCOMING' : `WAVE ${gameState.waveIndex + 1}` }}
            </span>
            <span class="text-xs text-slate-500">{{ formattedRunTime }}</span>
            
            <!-- Wave modifier badge -->
            <div 
              v-if="gameState.currentWaveModifier && gameState.waveModifierData" 
              class="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
              :style="{ backgroundColor: gameState.waveModifierData.color + '20', color: gameState.waveModifierData.color }"
            >
              <component :is="getModifierIcon(gameState.currentWaveModifier)" class="w-3 h-3" />
              {{ gameState.waveModifierData.name }}
            </div>
          </div>

          <div class="flex-1 max-w-[120px] mx-4">
            <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                class="h-full transition-all"
                :class="gameState.wavePhase === 'transition' ? 'bg-amber-500' : 'bg-cyan-500'"
                :style="{ width: `${gameState.wavePhase === 'combat' ? gameState.waveProgress : gameState.transitionProgress}%` }"
              />
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button
              @click="setSpeed(gameState.speedMultiplier === 1 ? 2 : 1)"
              class="p-1.5 rounded transition-colors"
              :class="gameState.speedMultiplier === 2 ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'"
              title="Speed x2 (F)"
            >
              <FastForward class="w-4 h-4" />
            </button>
            <button
              @click="togglePause"
              class="p-1.5 rounded text-slate-500 hover:text-slate-300"
              :title="gameState.isPaused ? 'Resume (Space)' : 'Pause (Space)'"
            >
              <Pause v-if="!gameState.isPaused" class="w-4 h-4" />
              <Play v-else class="w-4 h-4" />
            </button>
            <button @click="abandonRun" class="p-1.5 rounded text-slate-500 hover:text-red-400 transition-colors" title="Abandon Run">
              <LogOut class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Stat breakdown panel -->
      <Transition name="slide">
        <div v-if="showStatBreakdown" class="bg-slate-900/95 border-b border-slate-700 px-3 py-3">
          <div class="max-w-4xl mx-auto">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-slate-400">STAT BREAKDOWN</span>
              <button @click="showStatBreakdown = false" class="text-slate-500 hover:text-slate-300">
                <X class="w-4 h-4" />
              </button>
            </div>
            <div class="grid grid-cols-4 md:grid-cols-6 gap-2 text-[10px]">
              <div class="bg-slate-800/50 rounded p-2">
                <div class="text-slate-500">Base Dmg</div>
                <div class="font-bold text-slate-200">{{ gameState.baseDamage }}</div>
              </div>
              <div class="bg-slate-800/50 rounded p-2">
                <div class="text-slate-500">Atk Speed</div>
                <div class="font-bold text-slate-200">{{ gameState.attackSpeed }}x</div>
              </div>
              <div class="bg-slate-800/50 rounded p-2">
                <div class="text-slate-500">Dmg Mult</div>
                <div class="font-bold text-slate-200">{{ gameState.damageMultiplier }}%</div>
              </div>
              <div class="bg-slate-800/50 rounded p-2">
                <div class="text-slate-500">Armor</div>
                <div class="font-bold text-blue-400">{{ gameState.armor }}</div>
              </div>
              <div class="bg-slate-800/50 rounded p-2">
                <div class="text-slate-500">Regen</div>
                <div class="font-bold text-emerald-400">{{ gameState.regenPerSecond }}/s</div>
              </div>
              <div class="bg-slate-800/50 rounded p-2">
                <div class="text-slate-500">Scrap Mult</div>
                <div class="font-bold text-amber-400">{{ gameState.scrapMultiplier }}%</div>
              </div>
              <div v-if="gameState.executeThreshold > 0" class="bg-slate-800/50 rounded p-2">
                <div class="text-slate-500">Execute</div>
                <div class="font-bold text-red-400">&lt;{{ Math.round(gameState.executeThreshold * 100) }}%</div>
              </div>
              <div v-if="gameState.multiShotChance > 0" class="bg-slate-800/50 rounded p-2">
                <div class="text-slate-500">Multishot</div>
                <div class="font-bold text-cyan-400">{{ Math.round(gameState.multiShotChance * 100) }}%</div>
              </div>
              <div v-if="gameState.adaptiveRegen > 0" class="bg-slate-800/50 rounded p-2">
                <div class="text-slate-500">Low HP Regen</div>
                <div class="font-bold text-emerald-400">+{{ gameState.adaptiveRegen }}/s</div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Main content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Combat canvas -->
        <div class="relative flex-shrink-0 h-48 md:h-56 bg-slate-900/50">
          <canvas ref="canvasRef" class="w-full h-full"></canvas>

          <!-- Paused overlay -->
          <div
            v-if="gameState.isPaused"
            class="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm"
          >
            <div class="text-center">
              <Pause class="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <div class="text-lg font-bold text-slate-300">PAUSED</div>
              <div class="text-xs text-slate-500 mt-1">Press Space to resume</div>
            </div>
          </div>
        </div>

        <!-- Skill trees -->
        <div class="flex-1 overflow-y-auto bg-slate-950/50 p-3">
          <div class="max-w-4xl mx-auto">
            <!-- Tree selection or expanded tree -->
            <div v-if="selectedTreeData">
              <SkillTree
                :tree="selectedTreeData"
                :get-upgrade-state="getUpgradeState"
                :colors="TREE_COLORS[selectedTreeData.name]"
                :icon="treeIcons[selectedTreeData.name]"
                :is-blocked="selectedTreeData.isBlocked"
                :is-committed="selectedTreeData.isCommitted"
                @back="expandedTree = null"
                @purchase="handlePurchase"
              />
            </div>
            <div v-else>
              <p class="text-center text-xs text-slate-500 mb-3">
                Select a tree to upgrade · Keys 1-5 for quick access
              </p>

              <div class="relative w-full max-w-xs mx-auto aspect-square">
                <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <polygon points="50,14 85,36 73,78 27,78 15,36" fill="none" stroke="#1e293b" stroke-width="0.8"/>
                  <line v-for="pos in pentagonPositions" :key="pos.name" :x1="pos.x" :y1="pos.y" x2="50" y2="50" stroke="#1e293b" stroke-width="0.4"/>
                </svg>

                <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-800/60 border border-slate-700 flex items-center justify-center">
                  <Swords class="w-6 h-6 text-slate-400" />
                </div>

                <div
                  v-for="(pos, idx) in pentagonPositions"
                  :key="pos.name"
                  class="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                  :style="{ left: `${pos.x}%`, top: `${pos.y}%` }"
                >
                  <button
                    @click="toggleExpandedTree(pos.name)"
                    class="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all"
                    :class="[
                      allTrees[idx].isBlocked ? 'opacity-40 cursor-not-allowed bg-slate-900/50 border-slate-800' :
                      allTrees[idx].isCommitted ? 'bg-slate-800/80 border-current ring-2 ring-current/30' :
                      'bg-slate-900/90 border-slate-700 hover:border-current hover:scale-105'
                    ]"
                    :style="{ borderColor: allTrees[idx].isBlocked ? '' : TREE_COLORS[pos.name].primary + (allTrees[idx].isCommitted ? '' : '50') }"
                    :disabled="allTrees[idx].isBlocked"
                  >
                    <Lock v-if="allTrees[idx].isBlocked" class="w-5 h-5 text-slate-600" />
                    <template v-else>
                      <component :is="treeIcons[pos.name]" class="w-5 h-5 md:w-6 md:h-6" :style="{ color: TREE_COLORS[pos.name].primary }" />
                      <span class="text-[9px] md:text-[10px] font-semibold text-slate-300">{{ pos.name.slice(0,3).toUpperCase() }}</span>
                    </template>
                    <Check v-if="allTrees[idx].isCommitted" class="absolute -top-1 -right-1 w-4 h-4 p-0.5 bg-emerald-500 rounded-full text-white" />
                  </button>
                </div>
              </div>

              <!-- Tree blocking hint -->
              <p class="text-[10px] text-slate-600 text-center mt-4">
                Committing to a tree blocks its opposite · Choose wisely!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== DEATH MODAL ==================== -->
    <Teleport to="body">
      <div v-if="showDeathModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-slate-900 rounded-2xl border border-slate-700 max-w-md w-full p-6">
          <div class="text-center mb-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <Skull v-if="!deathData?.wasAbandoned" class="w-8 h-8 text-red-400" />
              <LogOut v-else class="w-8 h-8 text-amber-400" />
            </div>
            <h2 class="text-2xl font-bold mb-1">{{ deathData?.wasAbandoned ? 'Run Abandoned' : 'Core Destroyed' }}</h2>
            <p class="text-slate-400 text-sm">Wave {{ deathData?.waveReached || 0 }} reached</p>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-6">
            <div class="bg-slate-800/50 rounded-xl p-3 text-center">
              <div class="text-lg font-bold text-amber-400">{{ deathData?.shardsEarned || 0 }}</div>
              <div class="text-xs text-slate-500">Shards Earned</div>
            </div>
            <div class="bg-slate-800/50 rounded-xl p-3 text-center">
              <div class="text-lg font-bold text-slate-300">{{ formatRunTime(deathData?.runTime || 0) }}</div>
              <div class="text-xs text-slate-500">Run Time</div>
            </div>
            <div class="bg-slate-800/50 rounded-xl p-3 text-center">
              <div class="text-lg font-bold text-red-400">{{ formatNumber(deathData?.totalDamageTaken || 0) }}</div>
              <div class="text-xs text-slate-500">Damage Taken</div>
            </div>
            <div class="bg-slate-800/50 rounded-xl p-3 text-center">
              <div class="text-lg font-bold text-emerald-400">{{ formatNumber(deathData?.enemiesKilled || 0) }}</div>
              <div class="text-xs text-slate-500">Enemies Killed</div>
            </div>
          </div>

          <!-- Committed trees -->
          <div v-if="deathData?.committedTrees?.length" class="mb-6">
            <div class="text-xs text-slate-500 mb-2 text-center">Trees Used</div>
            <div class="flex justify-center gap-2">
              <div 
                v-for="tree in deathData.committedTrees" 
                :key="tree"
                class="w-10 h-10 rounded-xl flex items-center justify-center"
                :style="{ backgroundColor: TREE_COLORS[tree].bg }"
              >
                <component :is="treeIcons[tree]" class="w-5 h-5" :style="{ color: TREE_COLORS[tree].primary }" />
              </div>
            </div>
          </div>

          <!-- Milestones claimed -->
          <div v-if="deathData?.claimedMilestones?.length" class="mb-6 bg-amber-500/10 rounded-xl p-3">
            <div class="text-xs text-amber-400 mb-2 text-center font-medium">Milestones Reached!</div>
            <div class="flex flex-wrap justify-center gap-2">
              <div 
                v-for="m in deathData.claimedMilestones" 
                :key="m"
                class="px-2 py-1 bg-amber-500/20 rounded text-xs text-amber-300"
              >
                {{ MILESTONES[m]?.name }} (+{{ MILESTONES[m]?.shards }})
              </div>
            </div>
          </div>

          <button
            @click="claimShards"
            class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <Gem class="w-5 h-5" /> Claim {{ deathData?.shardsEarned || 0 }} Shards
          </button>
        </div>
      </div>
    </Teleport>

    <!-- ==================== META PANEL ==================== -->
    <Teleport to="body">
      <div v-if="showMetaPanel" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" @click.self="showMetaPanel = false">
        <div class="bg-slate-900 rounded-2xl border border-slate-700 max-w-lg w-full max-h-[90vh] flex flex-col">
          <div class="flex items-center justify-between p-4 border-b border-slate-800 flex-shrink-0">
            <div class="flex items-center gap-3">
              <Gem class="w-5 h-5 text-amber-400" />
              <h2 class="text-lg font-bold">Meta Upgrades</h2>
              <span class="text-sm text-amber-400 font-medium">{{ meta.shards }} Shards</span>
            </div>
            <button @click="showMetaPanel = false" class="p-2 hover:bg-slate-800 rounded-lg">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-4">
            <SkillTree
              v-if="metaSelectedTreeData"
              :tree="metaSelectedTreeData"
              :get-upgrade-state="getUpgradeState"
              :colors="TREE_COLORS[metaSelectedTreeData.name]"
              :icon="treeIcons[metaSelectedTreeData.name]"
              :is-meta="true"
              :get-meta-upgrade-info="getMetaUpgradeInfo"
              @back="metaExpandedTree = null"
              @meta-purchase="handleMetaPurchase"
            />
            <div v-else>
              <p class="text-center text-sm text-slate-400 mb-4">
                Invest shards to boost upgrades permanently
              </p>

              <div class="relative w-full max-w-xs mx-auto aspect-square">
                <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <polygon points="50,14 85,36 73,78 27,78 15,36" fill="none" stroke="#1e293b" stroke-width="0.8"/>
                  <line v-for="pos in pentagonPositions" :key="pos.name" :x1="pos.x" :y1="pos.y" x2="50" y2="50" stroke="#1e293b" stroke-width="0.4"/>
                </svg>

                <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-800/60 border border-slate-700 flex items-center justify-center">
                  <Gem class="w-6 h-6 text-amber-400" />
                </div>

                <div
                  v-for="(pos, idx) in pentagonPositions"
                  :key="pos.name"
                  class="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-105"
                  :style="{ left: `${pos.x}%`, top: `${pos.y}%` }"
                >
                  <button
                    @click="toggleMetaExpandedTree(pos.name)"
                    class="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all bg-slate-900/90 border-slate-700 hover:border-current"
                    :style="{ borderColor: TREE_COLORS[pos.name].primary + '50' }"
                  >
                    <component :is="treeIcons[pos.name]" class="w-5 h-5 md:w-6 md:h-6" :style="{ color: TREE_COLORS[pos.name].primary }" />
                    <span class="text-[9px] md:text-[10px] font-semibold text-slate-300">{{ pos.name.slice(0,3).toUpperCase() }}</span>
                    <!-- Meta investment indicator -->
                    <div v-if="allTrees[idx].metaInvestment > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                      {{ allTrees[idx].metaInvestment }}
                    </div>
                  </button>
                </div>
              </div>

              <p class="text-[10px] text-slate-600 text-center mt-4">
                Each level: +10% effect, -5% cost
              </p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ==================== STATS MODAL ==================== -->
    <Teleport to="body">
      <div v-if="showStatsModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" @click.self="showStatsModal = false">
        <div class="bg-slate-900 rounded-2xl border border-slate-700 max-w-lg w-full max-h-[90vh] flex flex-col">
          <div class="flex items-center justify-between p-4 border-b border-slate-800 flex-shrink-0">
            <div class="flex items-center gap-2">
              <BarChart3 class="w-5 h-5 text-purple-400" />
              <h2 class="text-lg font-bold">Statistics</h2>
            </div>
            <button @click="showStatsModal = false" class="p-2 hover:bg-slate-800 rounded-lg">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-4">
            <!-- Tree heatmap -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-slate-400 mb-3">Preferred Trees</h3>
              <div class="relative w-full max-w-xs mx-auto aspect-square">
                <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <polygon points="50,14 85,36 73,78 27,78 15,36" fill="none" stroke="#1e293b" stroke-width="0.8"/>
                </svg>

                <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700 flex items-center justify-center">
                  <Activity class="w-5 h-5 text-slate-500" />
                </div>

                <div
                  v-for="(pos, idx) in pentagonPositions"
                  :key="pos.name"
                  class="absolute -translate-x-1/2 -translate-y-1/2"
                  :style="{ left: `${pos.x}%`, top: `${pos.y}%` }"
                >
                  <div
                    class="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5 border-2 transition-all"
                    :style="{
                      backgroundColor: getHeatColor(treeHeatmap[idx]?.intensity || 0),
                      borderColor: treeHeatmap[idx]?.intensity > 0.5 ? '#f59e0b' : '#334155'
                    }"
                  >
                    <component
                      :is="treeIcons[pos.name]"
                      class="w-5 h-5"
                      :style="{ color: treeHeatmap[idx]?.intensity > 0.3 ? '#fff' : TREE_COLORS[pos.name].primary }"
                    />
                    <span class="text-[9px] font-bold" :class="treeHeatmap[idx]?.intensity > 0.3 ? 'text-white' : 'text-slate-400'">
                      {{ treeHeatmap[idx]?.count || 0 }}
                    </span>
                  </div>
                </div>
              </div>
              <p class="text-xs text-slate-500 text-center mt-3">Times each tree was committed</p>
            </div>

            <!-- Stats grid -->
            <div class="grid grid-cols-2 gap-3 mb-6">
              <div class="bg-slate-800/50 rounded-xl p-3">
                <div class="flex items-center gap-2 mb-1">
                  <Timer class="w-4 h-4 text-blue-400" />
                  <span class="text-xs text-slate-400">Play Time</span>
                </div>
                <div class="text-lg font-bold text-blue-400">{{ formatTime(meta.stats?.totalPlayTime || 0) }}</div>
              </div>

              <div class="bg-slate-800/50 rounded-xl p-3">
                <div class="flex items-center gap-2 mb-1">
                  <TrendingUp class="w-4 h-4 text-emerald-400" />
                  <span class="text-xs text-slate-400">Waves Completed</span>
                </div>
                <div class="text-lg font-bold text-emerald-400">{{ meta.stats?.totalWavesCompleted || 0 }}</div>
              </div>

              <div class="bg-slate-800/50 rounded-xl p-3">
                <div class="flex items-center gap-2 mb-1">
                  <Coins class="w-4 h-4 text-amber-400" />
                  <span class="text-xs text-slate-400">Scrap Spent</span>
                </div>
                <div class="text-lg font-bold text-amber-400">{{ formatNumber(meta.stats?.totalScrapSpent || 0) }}</div>
              </div>

              <div class="bg-slate-800/50 rounded-xl p-3">
                <div class="flex items-center gap-2 mb-1">
                  <Gem class="w-4 h-4 text-purple-400" />
                  <span class="text-xs text-slate-400">Shards Earned</span>
                </div>
                <div class="text-lg font-bold text-purple-400">{{ meta.totalShardsEarned }}</div>
              </div>

              <div class="bg-slate-800/50 rounded-xl p-3">
                <div class="flex items-center gap-2 mb-1">
                  <Skull class="w-4 h-4 text-red-400" />
                  <span class="text-xs text-slate-400">Deaths</span>
                </div>
                <div class="text-lg font-bold text-red-400">{{ meta.stats?.deaths || 0 }}</div>
              </div>

              <div class="bg-slate-800/50 rounded-xl p-3">
                <div class="flex items-center gap-2 mb-1">
                  <LogOut class="w-4 h-4 text-amber-400" />
                  <span class="text-xs text-slate-400">Abandons</span>
                </div>
                <div class="text-lg font-bold text-amber-400">{{ meta.stats?.abandons || 0 }}</div>
              </div>
            </div>

            <!-- Averages -->
            <div class="p-3 bg-slate-800/30 rounded-xl mb-6">
              <h3 class="text-xs font-medium text-slate-400 mb-2">Averages per Run</h3>
              <div class="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div class="text-sm font-bold text-slate-200">
                    {{ meta.totalRuns > 0 ? Math.round((meta.stats?.totalWavesCompleted || 0) / meta.totalRuns) : 0 }}
                  </div>
                  <div class="text-[10px] text-slate-500">Waves</div>
                </div>
                <div>
                  <div class="text-sm font-bold text-slate-200">
                    {{ meta.totalRuns > 0 ? formatTime(Math.round((meta.stats?.totalPlayTime || 0) / meta.totalRuns)) : '0m' }}
                  </div>
                  <div class="text-[10px] text-slate-500">Duration</div>
                </div>
                <div>
                  <div class="text-sm font-bold text-slate-200">
                    {{ meta.totalRuns > 0 ? Math.round(meta.totalShardsEarned / meta.totalRuns) : 0 }}
                  </div>
                  <div class="text-[10px] text-slate-500">Shards</div>
                </div>
              </div>
            </div>

            <!-- Run history -->
            <div v-if="meta.runHistory?.length" class="mb-6">
              <h3 class="text-sm font-medium text-slate-400 mb-3">Recent Runs</h3>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <div 
                  v-for="(run, i) in meta.runHistory" 
                  :key="i"
                  class="flex items-center justify-between bg-slate-800/30 rounded-lg px-3 py-2 text-xs"
                >
                  <div class="flex items-center gap-3">
                    <span class="text-slate-500">Wave {{ run.wave }}</span>
                    <div class="flex gap-1">
                      <div 
                        v-for="tree in run.trees" 
                        :key="tree"
                        class="w-4 h-4 rounded flex items-center justify-center"
                        :style="{ backgroundColor: TREE_COLORS[tree].bg }"
                      >
                        <component :is="treeIcons[tree]" class="w-2.5 h-2.5" :style="{ color: TREE_COLORS[tree].primary }" />
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-slate-400">{{ formatRunTime(run.time) }}</span>
                    <span class="text-amber-400">+{{ run.shards }}</span>
                    <LogOut v-if="run.wasAbandoned" class="w-3 h-3 text-amber-500" title="Abandoned" />
                    <Skull v-else class="w-3 h-3 text-red-400" title="Died" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Milestones -->
            <div v-if="Object.keys(MILESTONES).length" class="mb-6">
              <h3 class="text-sm font-medium text-slate-400 mb-3">Milestones</h3>
              <div class="grid grid-cols-2 gap-2">
                <div 
                  v-for="(milestone, key) in MILESTONES" 
                  :key="key"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                  :class="meta.unlockedMilestones?.includes(key) ? 'bg-amber-500/20' : 'bg-slate-800/30'"
                >
                  <Sparkles 
                    class="w-4 h-4" 
                    :class="meta.unlockedMilestones?.includes(key) ? 'text-amber-400' : 'text-slate-600'"
                  />
                  <div>
                    <div :class="meta.unlockedMilestones?.includes(key) ? 'text-amber-200' : 'text-slate-500'">
                      {{ milestone.name }}
                    </div>
                    <div class="text-[10px] text-slate-500">Wave {{ milestone.wave }} · +{{ milestone.shards }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Data management -->
            <div class="border-t border-slate-800 pt-4">
              <h3 class="text-sm font-medium text-slate-400 mb-3">Data Management</h3>
              <div class="flex gap-2">
                <button 
                  @click="exportSave"
                  class="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download class="w-4 h-4" /> Export
                </button>
                <button 
                  @click="handleImportClick"
                  class="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Upload class="w-4 h-4" /> Import
                </button>
                <button 
                  @click="handleReset"
                  class="py-2 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                  :class="showResetConfirm ? 'bg-red-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-red-400'"
                >
                  <Trash2 class="w-4 h-4" />
                  {{ showResetConfirm ? 'Confirm?' : '' }}
                </button>
                <input 
                  ref="fileInputRef" 
                  type="file" 
                  accept=".json" 
                  class="hidden" 
                  @change="handleFileImport"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>