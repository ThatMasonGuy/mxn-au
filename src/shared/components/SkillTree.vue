<script setup>
// src/components/SkillTree.vue
// Flexible skill tree renderer for Core Defense
// Handles up to 3 columns wide and unlimited rows

import { computed, ref } from 'vue'
import { Check, Lock, ChevronLeft, Star } from 'lucide-vue-next'

const props = defineProps({
  // Tree data
  tree: {
    type: Object,
    required: true
    // Expected shape: { name, displayName, icon, description, colors, upgrades[], isCommitted, isBlocked, blocks }
  },
  // Function to get upgrade state (isPurchased, canBuy, reason, cost, metaLevel, isLocked, lockedBy)
  getUpgradeState: {
    type: Function,
    required: true
  },
  // Colors object: { primary, glow, bg }
  colors: {
    type: Object,
    required: true
  },
  // Icon component to render
  icon: {
    type: [Object, Function],
    default: null
  },
  // Is this a meta upgrade panel (shows meta levels instead of purchase)
  isMeta: {
    type: Boolean,
    default: false
  },
  // Meta upgrade info function (for meta panel)
  getMetaUpgradeInfo: {
    type: Function,
    default: null
  },
  // Whether the whole tree is blocked
  isBlocked: {
    type: Boolean,
    default: false
  },
  // Whether the tree is already committed
  isCommitted: {
    type: Boolean,
    default: false
  },
  // Whether to show header (back button, tree name)
  showHeader: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['back', 'purchase', 'meta-purchase'])

// Container ref for scroll
const scrollContainer = ref(null)

// Organize upgrades into rows by nodeIndex
// NEW LAYOUT:
// Row 0: nodeIndex 1 (root, centered)
// Row 1: nodeIndex 2, 3 (left/right branches)
// Row 2: nodeIndex 4, 5 (left/right)
// Row 3: nodeIndex 6 (gate, centered) - single node with isGate
// Row 4: nodeIndex 7, 8 (left/right capstones)
const treeRows = computed(() => {
  if (!props.tree?.upgrades?.length) return []
  
  const upgrades = [...props.tree.upgrades].sort((a, b) => a.nodeIndex - b.nodeIndex)
  const byIndex = new Map()
  
  for (const u of upgrades) {
    const idx = u.nodeIndex || 0
    if (!byIndex.has(idx)) byIndex.set(idx, [])
    byIndex.get(idx).push(u)
  }
  
  const rows = []
  const maxIndex = Math.max(...byIndex.keys())
  const processedIndices = new Set()
  
  // Row 0: nodeIndex 1 (root)
  if (byIndex.has(1)) {
    rows.push({
      rowIndex: 0,
      nodes: byIndex.get(1),
      isRoot: true,
      isCentered: true,
      width: 1
    })
    processedIndices.add(1)
  }
  
  // Process remaining indices
  for (let idx = 2; idx <= maxIndex; idx++) {
    if (processedIndices.has(idx)) continue
    
    const nodesAtIdx = byIndex.get(idx) || []
    if (nodesAtIdx.length === 0) continue
    
    const firstNode = nodesAtIdx[0]
    
    // Check if this is a gate node (centered, single)
    if (firstNode?.isGate) {
      rows.push({
        rowIndex: rows.length,
        nodes: nodesAtIdx,
        centerNode: firstNode,
        leftNode: null,
        rightNode: null,
        isCentered: true,
        isGate: true,
        width: 1
      })
      processedIndices.add(idx)
      continue
    }
    
    // Otherwise, try to pair with next index (standard left/right layout)
    const nextIdx = idx + 1
    const nodesAtNext = byIndex.get(nextIdx) || []
    
    // Skip next if it's a gate (shouldn't pair with gates)
    const nextIsGate = nodesAtNext[0]?.isGate
    
    if (!nextIsGate && (nodesAtIdx.length > 0 || nodesAtNext.length > 0)) {
      const hasLeft = nodesAtIdx.length > 0
      const hasRight = nodesAtNext.length > 0
      
      rows.push({
        rowIndex: rows.length,
        leftNode: nodesAtIdx[0] || null,
        rightNode: nodesAtNext[0] || null,
        centerNode: null,
        nodes: [...nodesAtIdx, ...nodesAtNext],
        isCentered: false,
        width: hasLeft && hasRight ? 2 : 1,
        onlyLeft: hasLeft && !hasRight,
        onlyRight: !hasLeft && hasRight
      })
      
      processedIndices.add(idx)
      if (!nextIsGate) processedIndices.add(nextIdx)
    }
  }
  
  return rows
})

// Row heights for positioning
const TOP_PADDING = 12
const ROOT_ROW_HEIGHT = 80
const BRANCH_ROW_HEIGHT = 90
const GATE_ROW_HEIGHT = 100
const ROW_GAP = 24

// Get row height based on row type
function getRowHeight(rowIndex) {
  if (rowIndex === 0) return ROOT_ROW_HEIGHT
  const row = treeRows.value[rowIndex]
  if (row?.isGate) return GATE_ROW_HEIGHT
  return BRANCH_ROW_HEIGHT
}

// Get Y position for a row (top of the row)
function getRowY(rowIndex) {
  let y = TOP_PADDING
  for (let i = 0; i < rowIndex; i++) {
    y += getRowHeight(i) + ROW_GAP
  }
  return y
}

// Get X position for a node based on its position in the row
function getNodeX(node, row) {
  if (row.isCentered) return 50
  if (row.leftNode?.id === node.id) return 25
  if (row.rightNode?.id === node.id) return 75
  // Fallback based on nodeIndex
  if (node.nodeIndex === 1) return 50
  return node.nodeIndex % 2 === 0 ? 25 : 75
}

// Find which row a node is in
function findRowForNode(nodeId) {
  for (let i = 0; i < treeRows.value.length; i++) {
    const row = treeRows.value[i]
    if (row.nodes?.some(n => n.id === nodeId)) return i
  }
  return -1
}

// Connection lines data - computed based on tree structure
const connections = computed(() => {
  if (treeRows.value.length < 2) return []
  
  const lines = []
  const upgrades = props.tree?.upgrades || []
  
  // Build a map of upgrade id -> upgrade for quick lookup
  const upgradeMap = new Map()
  for (const u of upgrades) {
    upgradeMap.set(u.id, u)
  }
  
  // For each upgrade, draw lines from its requirements
  for (const u of upgrades) {
    // Handle both requires (AND) and requiresAny (OR)
    const allReqs = [...(u.requires || []), ...(u.requiresAny || [])]
    if (!allReqs.length) continue
    
    for (const reqId of allReqs) {
      const parent = upgradeMap.get(reqId)
      if (!parent) continue
      
      const fromRowIdx = findRowForNode(reqId)
      const toRowIdx = findRowForNode(u.id)
      
      if (fromRowIdx === -1 || toRowIdx === -1) continue
      
      const fromRow = treeRows.value[fromRowIdx]
      const toRow = treeRows.value[toRowIdx]
      
      // Calculate positions
      const fromX = getNodeX(parent, fromRow)
      const toX = getNodeX(u, toRow)
      
      // Y: start from bottom of parent row, end at top of child row
      const fromY = getRowY(fromRowIdx) + getRowHeight(fromRowIdx)
      const toY = getRowY(toRowIdx)
      
      lines.push({
        fromId: reqId,
        toId: u.id,
        x1: fromX,
        y1: fromY,
        x2: toX,
        y2: toY
      })
    }
  }
  
  return lines
})

// Computed total height based on row count
const totalHeight = computed(() => {
  const rowCount = treeRows.value.length
  if (rowCount === 0) return 100
  let height = TOP_PADDING
  for (let i = 0; i < rowCount; i++) {
    height += getRowHeight(i)
    if (i < rowCount - 1) height += ROW_GAP
  }
  return height + TOP_PADDING
})

// Node state helpers
function getNodeClasses(upgrade) {
  const state = props.getUpgradeState(upgrade.id)
  const maxLevel = upgrade.maxLevel || 1
  const currentLevel = state?.currentLevel || 0
  
  // Multi-level node that's partially filled
  if (maxLevel > 1 && currentLevel > 0 && currentLevel < maxLevel) {
    return 'bg-slate-800/60 border-current/50 hover:border-current cursor-pointer active:scale-[0.98]'
  }
  
  // Fully purchased / maxed
  if (state?.isPurchased || (maxLevel > 1 && currentLevel >= maxLevel)) {
    return 'bg-slate-800/80 border-current ring-1 ring-current/30'
  }
  if (state?.isLocked) {
    return 'bg-slate-900/30 border-slate-800/50 opacity-50 cursor-not-allowed'
  }
  if (state?.canBuy) {
    return 'bg-slate-900/70 border-slate-600 hover:border-current hover:bg-slate-800/50 cursor-pointer active:scale-[0.98]'
  }
  return 'bg-slate-900/30 border-slate-800/50 cursor-not-allowed'
}

function getNodeStyle(upgrade) {
  const state = props.getUpgradeState(upgrade.id)
  const borderColor = props.colors.primary
  const maxLevel = upgrade.maxLevel || 1
  const currentLevel = state?.currentLevel || 0
  
  // Multi-level partially filled
  if (maxLevel > 1 && currentLevel > 0) {
    return { borderColor: borderColor + '80', color: borderColor }
  }
  
  if (state?.isPurchased) {
    return { borderColor, color: borderColor }
  }
  if (state?.canBuy) {
    return { borderColor: borderColor + '60' }
  }
  return {}
}

function canPurchaseNode(upgrade) {
  if (props.isBlocked) return false
  const state = props.getUpgradeState(upgrade.id)
  if (!state) return false
  if (state.isLocked) return false
  
  const maxLevel = upgrade.maxLevel || 1
  const currentLevel = state.currentLevel || 0
  
  // For multi-level nodes, check if not maxed AND can afford
  if (maxLevel > 1) {
    if (currentLevel >= maxLevel) return false // maxed
    // Check cost - canBuy includes cost check
    return state.canBuy
  }
  
  // For single-level nodes
  if (state.isPurchased) return false
  return state.canBuy
}

function handleNodeClick(upgrade) {
  if (props.isMeta) {
    const info = props.getMetaUpgradeInfo?.(upgrade.id)
    if (info?.canUpgrade) {
      emit('meta-purchase', upgrade.id)
    }
  } else {
    if (canPurchaseNode(upgrade)) {
      emit('purchase', upgrade.id)
    }
  }
}

// Meta-specific helpers
function getMetaNodeClasses(upgrade) {
  const info = props.getMetaUpgradeInfo?.(upgrade.id)
  if (!info) return 'bg-slate-900/30 border-slate-800/50'
  
  if (info.currentLevel >= 5) {
    return 'bg-amber-500/10 border-amber-500/30'
  }
  if (info.canUpgrade) {
    return 'bg-slate-900/70 border-slate-600 hover:border-amber-500/50 cursor-pointer'
  }
  return 'bg-slate-900/30 border-slate-800/50'
}

function canUpgradeMeta(upgrade) {
  const info = props.getMetaUpgradeInfo?.(upgrade.id)
  return info?.canUpgrade
}

// Status text for a node
function getNodeStatus(upgrade) {
  const state = props.getUpgradeState(upgrade.id)
  
  // Multi-level node display
  if (upgrade.maxLevel && upgrade.maxLevel > 1) {
    const currentLevel = state?.currentLevel || 0
    if (currentLevel >= upgrade.maxLevel) {
      return { text: 'MAX', class: 'text-emerald-400' }
    }
    if (state?.canBuy) {
      return { text: `${state.cost} Scrap`, class: 'text-amber-400 font-medium' }
    }
    if (currentLevel > 0) {
      return { text: `Lv ${currentLevel}`, class: 'text-cyan-400' }
    }
  }
  
  if (state?.isPurchased) return { text: 'Owned', class: 'text-emerald-400' }
  if (state?.isLocked) return { text: 'Locked', class: 'text-red-400' }
  if (state?.canBuy) return { text: `${state.cost} Scrap`, class: 'text-amber-400 font-medium' }
  
  // Simplify requirement text
  const reason = state?.reason || 'Locked'
  if (reason.startsWith('Need ') && reason.length > 20) {
    // Truncate long requirement names
    return { text: 'Requires prev tier', class: 'text-slate-500' }
  }
  return { text: reason, class: 'text-slate-500' }
}

// Check if node is fully purchased (handles multi-level)
function isNodeComplete(upgrade) {
  const state = props.getUpgradeState(upgrade.id)
  if (upgrade.maxLevel && upgrade.maxLevel > 1) {
    return (state?.currentLevel || 0) >= upgrade.maxLevel
  }
  return state?.isPurchased
}

// Get current level for multi-level nodes
function getNodeLevel(upgrade) {
  if (!upgrade.maxLevel || upgrade.maxLevel <= 1) return 0
  const state = props.getUpgradeState(upgrade.id)
  return state?.currentLevel || 0
}

// Node badge (shows tier or special status)
function getNodeBadge(upgrade, rowIndex) {
  if (upgrade.treeCommit) return { text: '★', tooltip: 'Commits to tree' }
  return { text: upgrade.nodeIndex, tooltip: `Tier ${rowIndex + 1}` }
}
</script>

<template>
  <div class="skill-tree flex flex-col h-full overflow-hidden">
    <!-- Header (optional) -->
    <div v-if="showHeader" class="flex-shrink-0 mb-3">
      <button 
        @click="emit('back')" 
        class="flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-3 text-sm transition-colors"
      >
        <ChevronLeft class="w-4 h-4" /> Back to Trees
      </button>
      
      <div class="flex items-center gap-3">
        <div 
          class="w-10 h-10 rounded-full flex items-center justify-center"
          :style="{ backgroundColor: colors.bg }"
        >
          <component :is="icon" class="w-5 h-5" :style="{ color: colors.primary }" />
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="font-bold truncate" :style="{ color: colors.primary }">
            {{ tree.displayName }}
          </h2>
          <p class="text-xs text-slate-500">
            <template v-if="tree.blocks">Blocks {{ tree.blocks }}</template>
            <template v-if="tree.description"> · {{ tree.description }}</template>
          </p>
        </div>
        <Lock v-if="isBlocked" class="w-5 h-5 text-slate-600 flex-shrink-0" />
        <Check v-else-if="isCommitted" class="w-5 h-5 text-emerald-400 flex-shrink-0" />
      </div>
    </div>
    
    <!-- Blocked overlay message -->
    <div v-if="isBlocked" class="flex-1 flex items-center justify-center">
      <div class="text-center p-6">
        <Lock class="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p class="text-slate-400 text-sm">This tree is blocked</p>
        <p class="text-slate-600 text-xs mt-1">Another tree's commitment has locked this path</p>
      </div>
    </div>
    
    <!-- Scrollable tree area -->
    <div 
      v-else
      ref="scrollContainer"
      class="flex-1 overflow-y-auto overflow-x-hidden"
    >
      <div class="relative" :style="{ minHeight: totalHeight + 'px' }">
        <!-- SVG Connection Lines -->
        <svg 
          class="absolute inset-0 w-full pointer-events-none" 
          :style="{ height: totalHeight + 'px' }"
          preserveAspectRatio="xMidYMid meet"
        >
          <line
            v-for="(line, idx) in connections"
            :key="idx"
            :x1="line.x1 + '%'"
            :y1="line.y1"
            :x2="line.x2 + '%'"
            :y2="line.y2"
            stroke="#334155"
            stroke-width="2"
            stroke-dasharray="4,4"
          />
        </svg>
        
        <!-- Rows - using absolute positioning to match SVG lines -->
        <div 
          v-for="(row, rowIdx) in treeRows" 
          :key="rowIdx"
          class="absolute left-0 right-0 px-2"
          :style="{ 
            top: getRowY(rowIdx) + 'px', 
            height: getRowHeight(rowIdx) + 'px',
            zIndex: 1 
          }"
        >
          <!-- Centered rows (root or gate) -->
          <template v-if="row.isCentered">
            <div class="flex justify-center h-full items-center">
              <div
                v-for="node in row.nodes"
                :key="node.id"
                class="upgrade-node w-full p-3 rounded-xl border-2 transition-all duration-150"
                :class="[
                  isMeta ? getMetaNodeClasses(node) : getNodeClasses(node),
                  row.isGate ? 'max-w-[260px] border-dashed' : 'max-w-[280px]'
                ]"
                :style="isMeta ? {} : getNodeStyle(node)"
                @click="handleNodeClick(node)"
              >
                <div class="flex items-start gap-3">
                  <!-- Node badge -->
                  <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    :style="{ backgroundColor: colors.bg, color: colors.primary }"
                  >
                    <Star v-if="node.treeCommit" class="w-4 h-4" />
                    <span v-else>{{ node.nodeIndex }}</span>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2 mb-0.5">
                      <span class="text-sm font-medium text-slate-200 truncate">{{ node.name }}</span>
                      <template v-if="!isMeta">
                        <Check 
                          v-if="isNodeComplete(node)" 
                          class="w-4 h-4 text-emerald-400 flex-shrink-0" 
                        />
                        <Lock 
                          v-else-if="getUpgradeState(node.id)?.isLocked" 
                          class="w-4 h-4 text-slate-500 flex-shrink-0" 
                        />
                      </template>
                    </div>
                    
                    <p class="text-xs text-slate-400 mb-1.5 line-clamp-2">{{ node.description }}</p>
                    
                    <!-- Multi-level progress bar for gate nodes -->
                    <template v-if="!isMeta && node.maxLevel && node.maxLevel > 1">
                      <div class="flex items-center gap-2 mb-1">
                        <div class="flex-1 flex gap-0.5 relative">
                          <div 
                            v-for="i in node.maxLevel" 
                            :key="i" 
                            class="flex-1 h-2 rounded-sm transition-colors relative"
                            :class="i <= getNodeLevel(node) ? 'bg-cyan-500' : 'bg-slate-700'"
                          >
                            <!-- Unlock threshold marker -->
                            <div 
                              v-if="node.levelToUnlock && i === node.levelToUnlock"
                              class="absolute -right-px top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                              :title="`Level ${node.levelToUnlock} unlocks next tier`"
                            />
                          </div>
                        </div>
                        <span class="text-[10px] font-medium" :class="getNodeLevel(node) >= (node.levelToUnlock || node.maxLevel) ? 'text-emerald-400' : 'text-slate-400'">
                          {{ getNodeLevel(node) }}/{{ node.maxLevel }}
                        </span>
                      </div>
                      <div class="flex items-center justify-between text-xs">
                        <span v-if="node.levelToUnlock && getNodeLevel(node) < node.levelToUnlock" class="text-amber-400/70 text-[10px]">
                          <span class="inline-block w-1.5 h-1.5 bg-amber-400 rounded-sm mr-1"></span>
                          unlocks at {{ node.levelToUnlock }}
                        </span>
                        <span v-else class="text-slate-600 text-[10px]">Convergence</span>
                        <span :class="getNodeStatus(node).class">{{ getNodeStatus(node).text }}</span>
                      </div>
                    </template>
                    
                    <!-- Standard status for non-multi-level -->
                    <template v-else-if="!isMeta">
                      <div class="flex items-center justify-between text-xs">
                        <span v-if="node.treeCommit" class="text-slate-600">Entry · Commits tree</span>
                        <span v-else class="text-slate-600">Tier {{ rowIdx + 1 }}</span>
                        <span :class="getNodeStatus(node).class">{{ getNodeStatus(node).text }}</span>
                      </div>
                    </template>
                    
                    <!-- Meta upgrade display -->
                    <template v-else-if="getMetaUpgradeInfo">
                      <div class="flex items-center justify-between mt-1">
                        <div class="flex gap-0.5">
                          <div 
                            v-for="i in 5" 
                            :key="i" 
                            class="w-3 h-1.5 rounded-full transition-colors"
                            :class="i <= getMetaUpgradeInfo(node.id)?.currentLevel ? 'bg-amber-500' : 'bg-slate-700'"
                          />
                        </div>
                        <button
                          v-if="getMetaUpgradeInfo(node.id)?.currentLevel < 5"
                          @click.stop="canUpgradeMeta(node) && emit('meta-purchase', node.id)"
                          :disabled="!canUpgradeMeta(node)"
                          class="px-2 py-0.5 rounded text-[10px] font-medium transition-colors"
                          :class="canUpgradeMeta(node) 
                            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' 
                            : 'bg-slate-800 text-slate-600 cursor-not-allowed'"
                        >
                          {{ getMetaUpgradeInfo(node.id)?.nextCost }}
                        </button>
                        <span v-else class="text-[10px] text-emerald-400 font-medium">MAX</span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </template>
          
          <!-- Dual column rows -->
          <template v-else>
            <div class="grid grid-cols-2 gap-4 h-full items-center">
              <!-- Left node -->
              <div 
                v-if="row.leftNode"
                class="upgrade-node p-3 rounded-xl border-2 transition-all duration-150"
                :class="isMeta ? getMetaNodeClasses(row.leftNode) : getNodeClasses(row.leftNode)"
                :style="isMeta ? {} : getNodeStyle(row.leftNode)"
                @click="handleNodeClick(row.leftNode)"
              >
                <div class="flex items-start gap-2 w-full">
                  <div 
                    class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    :style="{ backgroundColor: colors.bg, color: colors.primary }"
                  >
                    {{ row.leftNode.nodeIndex }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1 mb-0.5">
                      <span class="text-xs font-medium text-slate-200 truncate">{{ row.leftNode.name }}</span>
                      <template v-if="!isMeta">
                        <Check 
                          v-if="getUpgradeState(row.leftNode.id)?.isPurchased" 
                          class="w-3 h-3 text-emerald-400 flex-shrink-0" 
                        />
                        <Lock 
                          v-else-if="getUpgradeState(row.leftNode.id)?.isLocked" 
                          class="w-3 h-3 text-slate-500 flex-shrink-0" 
                        />
                      </template>
                    </div>
                    <p class="text-[10px] text-slate-400 line-clamp-2">{{ row.leftNode.description }}</p>
                    
                    <template v-if="!isMeta">
                      <div class="mt-1 text-[10px]" :class="getNodeStatus(row.leftNode).class">
                        {{ getNodeStatus(row.leftNode).text }}
                      </div>
                    </template>
                    
                    <template v-else-if="getMetaUpgradeInfo">
                      <div class="flex items-center justify-between mt-1">
                        <div class="flex gap-0.5">
                          <div 
                            v-for="i in 5" 
                            :key="i" 
                            class="w-2.5 h-1 rounded-full"
                            :class="i <= getMetaUpgradeInfo(row.leftNode.id)?.currentLevel ? 'bg-amber-500' : 'bg-slate-700'"
                          />
                        </div>
                        <button
                          v-if="getMetaUpgradeInfo(row.leftNode.id)?.currentLevel < 5"
                          @click.stop="canUpgradeMeta(row.leftNode) && emit('meta-purchase', row.leftNode.id)"
                          :disabled="!canUpgradeMeta(row.leftNode)"
                          class="px-1.5 py-0.5 rounded text-[9px] font-medium"
                          :class="canUpgradeMeta(row.leftNode) 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : 'bg-slate-800 text-slate-600 cursor-not-allowed'"
                        >
                          {{ getMetaUpgradeInfo(row.leftNode.id)?.nextCost }}
                        </button>
                        <span v-else class="text-[9px] text-emerald-400">✓</span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <div v-else class="invisible" />
              
              <!-- Right node -->
              <div 
                v-if="row.rightNode"
                class="upgrade-node p-3 rounded-xl border-2 transition-all duration-150"
                :class="isMeta ? getMetaNodeClasses(row.rightNode) : getNodeClasses(row.rightNode)"
                :style="isMeta ? {} : getNodeStyle(row.rightNode)"
                @click="handleNodeClick(row.rightNode)"
              >
                <div class="flex items-start gap-2 w-full">
                  <div 
                    class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    :style="{ backgroundColor: colors.bg, color: colors.primary }"
                  >
                    {{ row.rightNode.nodeIndex }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1 mb-0.5">
                      <span class="text-xs font-medium text-slate-200 truncate">{{ row.rightNode.name }}</span>
                      <template v-if="!isMeta">
                        <Check 
                          v-if="getUpgradeState(row.rightNode.id)?.isPurchased" 
                          class="w-3 h-3 text-emerald-400 flex-shrink-0" 
                        />
                        <Lock 
                          v-else-if="getUpgradeState(row.rightNode.id)?.isLocked" 
                          class="w-3 h-3 text-slate-500 flex-shrink-0" 
                        />
                      </template>
                    </div>
                    <p class="text-[10px] text-slate-400 line-clamp-2">{{ row.rightNode.description }}</p>
                    
                    <template v-if="!isMeta">
                      <div class="mt-1 text-[10px]" :class="getNodeStatus(row.rightNode).class">
                        {{ getNodeStatus(row.rightNode).text }}
                      </div>
                    </template>
                    
                    <template v-else-if="getMetaUpgradeInfo">
                      <div class="flex items-center justify-between mt-1">
                        <div class="flex gap-0.5">
                          <div 
                            v-for="i in 5" 
                            :key="i" 
                            class="w-2.5 h-1 rounded-full"
                            :class="i <= getMetaUpgradeInfo(row.rightNode.id)?.currentLevel ? 'bg-amber-500' : 'bg-slate-700'"
                          />
                        </div>
                        <button
                          v-if="getMetaUpgradeInfo(row.rightNode.id)?.currentLevel < 5"
                          @click.stop="canUpgradeMeta(row.rightNode) && emit('meta-purchase', row.rightNode.id)"
                          :disabled="!canUpgradeMeta(row.rightNode)"
                          class="px-1.5 py-0.5 rounded text-[9px] font-medium"
                          :class="canUpgradeMeta(row.rightNode) 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : 'bg-slate-800 text-slate-600 cursor-not-allowed'"
                        >
                          {{ getMetaUpgradeInfo(row.rightNode.id)?.nextCost }}
                        </button>
                        <span v-else class="text-[9px] text-emerald-400">✓</span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <div v-else class="invisible" />
            </div>
          </template>
        </div>
        
        <!-- Mutual exclusivity hint -->
        <p 
          v-if="!isMeta && treeRows.length > 2" 
          class="absolute left-0 right-0 text-[10px] text-slate-600 text-center"
          :style="{ top: (totalHeight - 16) + 'px' }"
        >
          Some upgrade paths are mutually exclusive
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upgrade-node {
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth scrolling */
.overflow-y-auto {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Hide scrollbar but keep functionality */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>