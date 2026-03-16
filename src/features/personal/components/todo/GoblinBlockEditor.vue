<template>
  <div class="goblin-editor text-zinc-200" @click.self="onClickBackground" @mousedown="onEditorMouseDown">
    <div v-for="(block, index) in localBlocks" :key="block._key" v-show="!hiddenBlockIds.has(block.id)" :class="[
      'block-row group relative flex items-start gap-1',
      isListContinuation(index) ? 'py-0' : 'py-0.5',
      isDraggedBlock(index) ? 'opacity-30' : '',
      isBlockSelected(index) ? 'bg-emerald-950/30 rounded-md' : '',
      isGroupEnd(index) ? 'mb-3' : '',
    ]" @dragover.prevent="onDragOver(index, $event)" @drop.prevent="onDrop(index)" @mouseenter="hoveredIndex = index"
      @mouseleave="hoveredIndex = null">
      <!-- Drop indicator (FIXED: only show when boundaryDrop is not active) -->
      <div v-if="dropTargetIdx === index && dragFromIdx !== null && !isDraggedBlock(index) && !boundaryDrop"
        class="absolute -top-px left-8 right-4 h-0.5 bg-emerald-500 rounded-full z-20 pointer-events-none"
        style="box-shadow: 0 0 6px rgba(16,185,129,0.4);" />

      <!-- Heading thread lines — MOVED OUTSIDE usable space, before link/drag handle -->
      <div class="flex-shrink-0 relative"
        :style="{ width: getHeadingNesting(block).length ? (getHeadingNesting(block).length * 8 + 2) + 'px' : '0px' }">
        <template v-for="entry in getHeadingNesting(block)" :key="'hl-' + entry.level">
          <div v-if="shouldShowThreadLine(block, entry)"
            class="absolute w-px pointer-events-none transition-opacity duration-100"
            :style="{ left: ((entry.level - 1) * 8) + 'px', top: '-2px', bottom: '-2px', background: 'rgba(113, 113, 122, 0.45)' }" />
        </template>
      </div>

      <!-- Link to task -->
      <div class="flex-shrink-0 w-5 mt-1.5 flex items-center justify-center relative">
        <button v-if="!readonly && block.type !== 'divider' && block.type !== 'table'" :class="[
          'p-0.5 transition-all rounded',
          getTaskRefs(block).length
            ? 'text-emerald-500 opacity-60 hover:opacity-100'
            : 'text-zinc-600 hover:text-emerald-400 opacity-0 group-hover:opacity-100'
        ]" :title="getTaskRefs(block).length ? 'Linked tasks' : 'Link to task'"
          @click.stop="toggleLinkPopover(block, index, $event)">
          <Link2 :size="12" />
        </button>
        <LinkIcon v-else-if="readonly && getTaskRefs(block).length" :size="12" class="text-emerald-500 opacity-50" />

        <Teleport to="body">
          <div v-if="linkPopover.show && linkPopover.blockId === block.id" :style="linkPopover.style"
            class="fixed z-50 w-56 rounded-lg border border-zinc-600 bg-zinc-800 shadow-xl shadow-black/50 overflow-hidden"
            data-link-popover>
            <div class="px-3 py-2 text-xs text-zinc-400 border-b border-zinc-700 font-medium">Linked tasks</div>
            <div class="py-1 max-h-48 overflow-y-auto">
              <div v-if="!getTaskRefs(block).length" class="px-3 py-2 text-xs text-zinc-500">No tasks linked</div>
              <div v-for="tId in getTaskRefs(block)" :key="tId"
                class="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-700 transition-colors group/link">
                <span class="flex-1 truncate cursor-pointer hover:text-emerald-400"
                  @click="$emit('navigate-task', tId); closeLinkPopover()">{{ getTaskTitle(tId) }}</span>
                <button @click.stop="unlinkTask(block, tId)"
                  class="opacity-0 group-hover/link:opacity-100 text-zinc-500 hover:text-rose-400 transition-all flex-shrink-0">
                  <X :size="11" />
                </button>
              </div>
            </div>
            <button
              class="w-full flex items-center gap-2 px-3 py-2 text-xs text-emerald-400 hover:bg-zinc-700 transition-colors border-t border-zinc-700"
              @click="$emit('link-task', block); closeLinkPopover()">
              <Plus :size="11" /> Link a task
            </button>
          </div>
        </Teleport>
      </div>

      <!-- Drag handle -->
      <div
        class="drag-handle opacity-0 group-hover:opacity-100 transition-opacity cursor-grab flex-shrink-0 mt-1.5 text-zinc-600 hover:text-zinc-400"
        draggable="true" @dragstart.stop="onDragStart(index, $event)" title="Drag to reorder">
        <GripVertical :size="14" />
      </div>

      <!-- Collapse toggle / spacer -->
      <button v-if="isHeading(block.type) && !readonly"
        class="flex-shrink-0 w-4 mt-1 text-zinc-600 hover:text-zinc-300 transition-colors"
        @click="toggleCollapse(block.id)">
        <ChevronRight v-if="collapsedIds.has(block.id)" :size="14" />
        <ChevronDown v-else :size="14" />
      </button>
      <div v-else class="flex-shrink-0 w-4" />

      <!-- Divider -->
      <div v-if="block.type === 'divider'" class="flex-1 flex items-center gap-2 py-2">
        <hr class="flex-1 border-zinc-700" />
        <button v-if="!readonly" @click="deleteBlock(index)"
          class="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-rose-400 transition-all">
          <X :size="12" />
        </button>
      </div>

      <!-- Table block -->
      <div v-else-if="block.type === 'table'" class="flex-1 relative min-w-0">
        <div class="overflow-x-auto rounded border border-zinc-700 bg-zinc-800/60">
          <table class="w-full text-sm border-collapse">
            <tbody>
              <tr v-for="(row, ri) in getTableData(block)" :key="ri"
                class="border-b border-zinc-700/60 last:border-b-0">
                <td v-for="(cell, ci) in row" :key="ci"
                  class="border-r border-zinc-700/60 last:border-r-0 px-0 py-0 relative group/cell">
                  <input type="text" :value="cell" @input="onTableCellInput(block, ri, ci, $event)"
                    @keydown="onTableKeyDown(block, index, ri, ci, $event)" :class="[
                      'w-full bg-transparent px-2 py-1.5 text-zinc-200 text-sm outline-none',
                      ri === 0 ? 'font-semibold text-zinc-100' : ''
                    ]" :placeholder="ri === 0 ? 'Header' : ''" />
                  <!-- Column delete on header row -->
                  <button v-if="ri === 0 && !readonly && getTableData(block)[0].length > 1"
                    class="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/cell:opacity-100 text-zinc-600 hover:text-rose-400 transition-all z-10 bg-zinc-800 rounded-full p-0.5"
                    @click="removeTableCol(block, ci)" title="Remove column">
                    <X :size="10" />
                  </button>
                </td>
                <!-- Row delete -->
                <td v-if="!readonly && getTableData(block).length > 1" class="w-6 px-0 py-0">
                  <button class="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-rose-400 transition-all p-1"
                    @click="removeTableRow(block, ri)" title="Remove row">
                    <X :size="10" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="!readonly" class="flex items-center gap-2 px-2 py-1 border-t border-zinc-700/60">
            <button class="text-xs text-zinc-500 hover:text-emerald-400 transition-colors" @click="addTableRow(block)">+
              Row</button>
            <span class="text-zinc-700">|</span>
            <button class="text-xs text-zinc-500 hover:text-emerald-400 transition-colors" @click="addTableCol(block)">+
              Column</button>
          </div>
        </div>
      </div>

      <!-- Text blocks -->
      <div v-else class="flex-1 relative min-w-0"
        :style="isListType(block.type) ? { paddingLeft: `${(block.indent || 0) * 20}px` } : {}">
        <div class="flex items-start">
          <!-- Measured-position list prefixes -->
          <div v-if="isListType(block.type)" class="flex-shrink-0 relative select-none"
            :style="{ width: block.type === 'numbered' ? '28px' : '20px', minHeight: '1.625em' }">
            <template v-for="(top, li) in getLineTops(block)" :key="li">
              <!-- Bullet -->
              <span v-if="block.type === 'bullet'"
                class="absolute left-0 w-full text-emerald-500 text-center text-sm leading-relaxed"
                :style="{ top: top + 'px' }">{{ bulletChar(block.indent || 0) }}</span>
              <!-- Number -->
              <span v-else-if="block.type === 'numbered'"
                class="absolute left-0 w-full text-emerald-500 text-sm leading-relaxed tabular-nums text-right pr-1"
                :style="{ top: top + 'px' }">{{ formatNumber(getNumberForLine(index, li), block.indent || 0) }}</span>
              <!-- Checkbox -->
              <button v-else-if="block.type === 'checkbox'"
                class="absolute left-0 w-full flex items-center justify-center leading-relaxed transition-colors"
                :class="isLineChecked(block, li) ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'"
                :style="{ top: (top + 2) + 'px' }" @click.stop="toggleCheckLine(block, li)">
                <CheckSquare v-if="isLineChecked(block, li)" :size="14" />
                <Square v-else :size="14" />
              </button>
            </template>
          </div>

          <div class="flex-1 min-w-0 relative">
            <!-- Code block language bar -->
            <div v-if="block.type === 'code'"
              class="flex items-center gap-2 px-2 py-1 bg-zinc-800 rounded-t border-b border-zinc-700/50 text-xs">
              <span class="text-zinc-500">Lang:</span>
              <input type="text" :value="block.language || ''" @input="onLanguageInput(block, $event)" @keydown.stop
                class="bg-transparent text-emerald-400 outline-none w-24 placeholder-zinc-600" placeholder="plain" />
            </div>

            <textarea :ref="el => { if (el) blockRefs[block.id] = el; else delete blockRefs[block.id] }"
              v-model="block.content" :placeholder="getPlaceholder(block.type, index)" :readonly="readonly" :class="[
                'w-full bg-transparent resize-none outline-none leading-relaxed overflow-hidden',
                'placeholder-zinc-500 transition-colors',
                getBlockClass(block.type),
                block.type === 'code' && block.language ? 'rounded-t-none' : '',
                activeIndex === index && hasFormattedContent(block) ? '' : hasFormattedContent(block) ? 'text-transparent caret-transparent' : '',
              ]" rows="1" @input="onInput(block, index, $event)" @keydown="onKeyDown(block, index, $event)"
              @focus="onFocus(index)" @blur="onBlur(index, $event)" @mousedown="onTextareaMouseDown(index, $event)"
              @paste="onPaste(block, index, $event)" />

            <!-- Formatted rendering overlay: shown when block has links/inline formatting and is NOT focused -->
            <div v-if="hasFormattedContent(block) && activeIndex !== index && block.type !== 'code'"
              class="absolute pointer-events-auto whitespace-pre-wrap break-words leading-relaxed"
              :class="[getBlockClass(block.type)]"
              :style="{ top: block.type === 'code' ? '0' : '0', left: '0', right: '0', bottom: '0' }"
              @click="onOverlayClick(block, index, $event)" v-html="renderFormattedContent(block.content)">
            </div>
          </div>
        </div>

        <!-- Collapse badge -->
        <div v-if="isHeading(block.type) && collapsedIds.has(block.id)"
          class="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-pointer hover:text-zinc-300 transition-colors"
          @click="toggleCollapse(block.id)">
          {{ getCollapsedCount(index) }} hidden
        </div>

        <!-- Type menu (slash commands + type changer) -->
        <div v-if="typeMenu.show && typeMenu.blockIndex === index"
          class="slash-menu absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl shadow-black/40 overflow-hidden">
          <div class="px-2 py-1.5 text-xs text-zinc-500 border-b border-zinc-800">{{
            typeMenu.mode === 'slash' ? 'Block type' : 'Change type' }}</div>
          <div class="py-1 max-h-64 overflow-y-auto">
            <button v-for="opt in filteredTypeOptions" :key="opt.type"
              class="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors text-left"
              @mousedown.prevent="applyType(index, opt.type)">
              <span class="w-6 text-center text-zinc-500">{{ opt.icon }}</span>
              <div>
                <div class="font-medium">{{ opt.label }}</div>
                <div class="text-xs text-zinc-600">{{ opt.desc }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Row actions -->
      <div v-if="!readonly"
        class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1 mr-4">
        <button v-if="block.type !== 'divider'" class="p-1 text-zinc-600 hover:text-zinc-300 transition-colors"
          title="Change block type" @click.stop="openTypeChanger(index)">
          <Type :size="13" />
        </button>
        <button v-if="block.type !== 'divider' && block.content"
          class="p-1 text-zinc-600 hover:text-zinc-300 transition-colors" title="Copy to clipboard"
          @click="copyBlock(block)">
          <component :is="copiedBlockId === block.id ? CheckIcon : ClipboardIcon" :size="13" />
        </button>
        <button class="p-1 text-zinc-600 hover:text-rose-400 transition-colors" title="Delete block"
          @click="deleteBlock(index)">
          <Trash2 :size="13" />
        </button>
      </div>

      <!-- Boundary drop zones: rendered inside block-row so `index` is in scope -->
      <template v-if="showBoundaryZones(index)">
        <!-- Inside: append as last child of the heading -->
        <div class="absolute left-0 right-0 flex items-center gap-2 px-12 cursor-pointer select-none z-10"
          style="bottom: -10px; height: 20px;"
          :class="boundaryDrop?.afterIdx === index + 1 && boundaryDrop?.mode === 'inside' ? 'opacity-100' : 'opacity-0 hover:opacity-100'"
          @dragover.prevent="onBoundaryDragOver(index + 1, 'inside', $event)"
          @drop.prevent="onBoundaryDrop(index + 1, 'inside')">
          <div class="flex-1 h-0.5 rounded-full"
            :class="boundaryDrop?.afterIdx === index + 1 && boundaryDrop?.mode === 'inside' ? 'bg-emerald-500' : 'bg-zinc-700'"
            :style="boundaryDrop?.afterIdx === index + 1 && boundaryDrop?.mode === 'inside' ? 'box-shadow:0 0 6px rgba(16,185,129,0.4)' : ''" />
          <span class="text-xs text-zinc-600 whitespace-nowrap">&#8627; inside</span>
        </div>
        <!-- Outside: place after the group (not forced above) -->
        <div v-if="showOutsideBoundary(index)"
          class="absolute left-0 right-0 flex items-center gap-2 px-8 cursor-pointer select-none z-10"
          style="bottom: -22px; height: 20px;"
          :class="boundaryDrop?.afterIdx === index + 1 && boundaryDrop?.mode === 'outside' ? 'opacity-100' : 'opacity-0 hover:opacity-100'"
          @dragover.prevent="onBoundaryDragOver(index + 1, 'outside', $event)"
          @drop.prevent="onBoundaryDrop(index + 1, 'outside')">
          <div class="flex-1 h-0.5 rounded-full"
            :class="boundaryDrop?.afterIdx === index + 1 && boundaryDrop?.mode === 'outside' ? 'bg-sky-500' : 'bg-zinc-700'"
            :style="boundaryDrop?.afterIdx === index + 1 && boundaryDrop?.mode === 'outside' ? 'box-shadow:0 0 6px rgba(56,189,248,0.4)' : ''" />
          <span class="text-xs text-zinc-600 whitespace-nowrap">&#8594; outside</span>
        </div>
      </template>
    </div>

    <!-- End-of-list drop indicator (FIXED: only when boundaryDrop not active) -->
    <div v-if="dropTargetIdx === localBlocks.length && dragFromIdx !== null && !boundaryDrop"
      class="h-0.5 bg-emerald-500 rounded-full ml-8 mr-4" style="box-shadow: 0 0 6px rgba(16,185,129,0.4);" />

    <!-- Selection bar -->
    <div v-if="hasSelection"
      class="sticky bottom-4 flex items-center gap-3 px-4 py-2 mt-2 mx-2 rounded-lg bg-zinc-800 border border-zinc-600 text-xs text-zinc-300 shadow-lg shadow-black/40">
      <span>{{ selectionCount }} blocks selected</span>
      <button @click="copySelection"
        class="flex items-center gap-1 px-2 py-1 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors">
        <ClipboardIcon :size="11" /> Copy
      </button>
      <button @click="clearSelection" class="text-zinc-500 hover:text-zinc-300 transition-colors ml-auto">
        <X :size="13" />
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="!readonly"
      class="mt-2 py-2 px-2 text-zinc-700 text-sm cursor-text hover:text-zinc-600 transition-colors flex items-center gap-2"
      @click="addBlockAtEnd" @dragover.prevent="onDragOver(localBlocks.length, $event)"
      @drop.prevent="onDrop(localBlocks.length)">
      <Plus :size="14" />
      <span>Click to add a block, or type <kbd class="px-1 py-0.5 rounded text-xs bg-zinc-800 text-zinc-500">/</kbd> for
        commands</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import {
  GripVertical, Link2, LinkIcon, Trash2, X, Plus,
  Clipboard as ClipboardIcon, Check as CheckIcon,
  ChevronRight, ChevronDown, Square, CheckSquare, Type
} from 'lucide-vue-next'

const props = defineProps({
  blocks: { type: Array, default: () => [] },
  tasks: { type: Object, default: () => ({}) },
  readonly: { type: Boolean, default: false },
  dayId: { type: String, default: null }
})

const emit = defineEmits(['add-block', 'update-block', 'delete-block', 'reorder-blocks', 'link-task', 'navigate-task'])

// ─── Local state ─────────────────────────────────────────────────────────────
const localBlocks = ref([])
const blockRefs = ref({})
const activeIndex = ref(null)
const copiedBlockId = ref(null)

// Drag
const dragFromIdx = ref(null)
const dropTargetIdx = ref(null)
const boundaryDrop = ref(null)

// Hover (for thread-line visibility)
const hoveredIndex = ref(null)

// Link popover
const linkPopover = ref({ show: false, blockId: null, style: {} })

// Collapse
const collapsedIds = reactive(new Set())

// Block selection
const selection = reactive({ anchor: null })

// Type menu
const typeMenu = ref({ show: false, blockIndex: null, query: '', mode: 'slash' })

// Line position cache
const lineTopCache = reactive({})

const LIST_TYPES = ['bullet', 'numbered', 'checkbox']
const BULLET_CHARS = ['•', '◦', '▪']

const TYPE_OPTIONS = [
  { type: 'paragraph', icon: '¶', label: 'Paragraph', desc: 'Plain text' },
  { type: 'h1', icon: 'H1', label: 'Heading 1', desc: 'Large heading' },
  { type: 'h2', icon: 'H2', label: 'Heading 2', desc: 'Medium heading' },
  { type: 'h3', icon: 'H3', label: 'Heading 3', desc: 'Small heading' },
  { type: 'bullet', icon: '•', label: 'Bullet', desc: 'Unordered list' },
  { type: 'numbered', icon: '1.', label: 'Numbered', desc: 'Ordered list' },
  { type: 'checkbox', icon: '☐', label: 'Checkbox', desc: 'To-do list' },
  { type: 'quote', icon: '"', label: 'Quote', desc: 'Block quote' },
  { type: 'code', icon: '<>', label: 'Code', desc: 'Code block' },
  { type: 'table', icon: '⊞', label: 'Table', desc: 'Simple table' },
  { type: 'divider', icon: '—', label: 'Divider', desc: 'Horizontal rule' },
]

const filteredTypeOptions = computed(() => {
  const q = typeMenu.value.query.toLowerCase().replace(/^\//, '')
  if (!q) return TYPE_OPTIONS
  return TYPE_OPTIONS.filter(o => o.label.toLowerCase().includes(q) || o.type.includes(q))
})

const isListContinuation = (index) => {
  if (index === 0) return false
  const block = localBlocks.value[index]
  const prev = localBlocks.value[index - 1]
  return isListType(block?.type) && isListType(prev?.type)
}

// ─── Type helpers ────────────────────────────────────────────────────────────
const isHeading = (type) => ['h1', 'h2', 'h3'].includes(type)
const isListType = (type) => LIST_TYPES.includes(type)
const headingLevel = (type) => ({ h1: 1, h2: 2, h3: 3 }[type] ?? 0)
const bulletChar = (indent) => BULLET_CHARS[Math.min(indent, BULLET_CHARS.length - 1)]

const toAlpha = (n) => String.fromCharCode(96 + ((n - 1) % 26) + 1)
const toRoman = (n) => {
  const vals = [[10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']]
  let r = ''; for (const [v, s] of vals) { while (n >= v) { r += s; n -= v } }; return r
}
const formatNumber = (num, indent) => {
  if (indent === 1) return toAlpha(num) + '.'
  if (indent >= 2) return toRoman(num) + '.'
  return num + '.'
}

// ─── Line position measurement ───────────────────────────────────────────────
const measureLineTops = (block) => {
  const el = blockRefs.value[block.id]
  if (!el || !isListType(block.type)) {
    delete lineTopCache[block.id]
    return
  }

  const lines = (block.content || '').split('\n')
  if (lines.length === 0) { lineTopCache[block.id] = [0]; return }

  const style = window.getComputedStyle(el)
  const mirror = document.createElement('div')
  mirror.style.cssText = [
    'position:absolute', 'visibility:hidden', 'white-space:pre-wrap',
    'word-wrap:break-word', 'overflow-wrap:break-word',
    `width:${style.width}`, `font:${style.font}`, `padding:${style.padding}`,
    `border:${style.border}`, `line-height:${style.lineHeight}`,
    `letter-spacing:${style.letterSpacing}`, `box-sizing:${style.boxSizing}`,
  ].join(';')

  const markers = []
  for (let i = 0; i < lines.length; i++) {
    if (i > 0) mirror.appendChild(document.createTextNode('\n'))
    const marker = document.createElement('span')
    marker.textContent = '\u200b'
    markers.push(marker)
    mirror.appendChild(marker)
    mirror.appendChild(document.createTextNode(lines[i]))
  }

  document.body.appendChild(mirror)
  const tops = markers.map(m => m.offsetTop)
  document.body.removeChild(mirror)

  lineTopCache[block.id] = tops
}

const getLineTops = (block) => lineTopCache[block.id] || [0]

const measureAllLineTops = () => {
  localBlocks.value.forEach(b => { if (isListType(b.type)) measureLineTops(b) })
}

// ─── List line helpers ───────────────────────────────────────────────────────
const getBlockLines = (block) => (block.content || '').split('\n')

const getNumberForLine = (blockIndex, lineIndex) => {
  const block = localBlocks.value[blockIndex]
  const indent = block?.indent || 0
  let start = 1
  for (let i = blockIndex - 1; i >= 0; i--) {
    const b = localBlocks.value[i]
    if (!isListType(b.type)) break
    const bIndent = b.indent || 0
    if (bIndent < indent) break
    if (bIndent > indent) continue
    if (b.type === 'numbered') start++
    else break
  }
  return start + lineIndex
}

// ─── Checkbox per-line ───────────────────────────────────────────────────────
const isLineChecked = (block, lineIndex) => {
  return Array.isArray(block.checkedLines) && block.checkedLines.includes(lineIndex)
}

const toggleCheckLine = (block, lineIndex) => {
  if (!Array.isArray(block.checkedLines)) block.checkedLines = []
  const idx = block.checkedLines.indexOf(lineIndex)
  if (idx === -1) block.checkedLines.push(lineIndex)
  else block.checkedLines.splice(idx, 1)
  block.checkedLines = [...block.checkedLines]
  if (block.id && !block.id.startsWith('temp_')) {
    emit('update-block', { blockId: block.id, updates: { checkedLines: block.checkedLines }, dayId: props.dayId })
  }
}

// ─── Parent/child ownership (parentId-based) ────────────────────────────────
const blockById = computed(() => {
  const map = {}
  localBlocks.value.forEach(b => { map[b.id] = b })
  return map
})

const childrenMap = computed(() => {
  const map = {}
  localBlocks.value.forEach((b, i) => {
    if (b.parentId) {
      if (!map[b.parentId]) map[b.parentId] = []
      map[b.parentId].push(i)
    }
  })
  return map
})

const getDescendantIndices = (blockId) => {
  const direct = childrenMap.value[blockId] || []
  const all = [...direct]
  for (const idx of direct) {
    const child = localBlocks.value[idx]
    if (child) all.push(...getDescendantIndices(child.id))
  }
  return all.sort((a, b) => a - b)
}

const getAncestorChain = (blockId) => {
  const chain = []
  const seen = new Set()
  let current = blockById.value[blockId]
  while (current?.parentId && !seen.has(current.parentId)) {
    seen.add(current.parentId)
    const parent = blockById.value[current.parentId]
    if (!parent) break
    if (isHeading(parent.type)) {
      chain.unshift({ level: headingLevel(parent.type), headingId: parent.id })
    }
    current = parent
  }
  return chain
}

// ─── childrenIds bookkeeping ────────────────────────────────────────────────
const registerChild = (parentId, childId) => {
  if (!parentId || !childId) return
  const parent = blockById.value[parentId]
  if (!parent) return
  if (!Array.isArray(parent.childrenIds)) parent.childrenIds = []
  if (!parent.childrenIds.includes(childId)) {
    parent.childrenIds.push(childId)
    if (parent.id && !parent.id.startsWith('temp_')) {
      emit('update-block', { blockId: parent.id, updates: { childrenIds: [...parent.childrenIds] }, dayId: props.dayId })
    }
  }
}

const unregisterChild = (parentId, childId) => {
  if (!parentId || !childId) return
  const parent = blockById.value[parentId]
  if (!parent || !Array.isArray(parent.childrenIds)) return
  const idx = parent.childrenIds.indexOf(childId)
  if (idx !== -1) {
    parent.childrenIds.splice(idx, 1)
    if (parent.id && !parent.id.startsWith('temp_')) {
      emit('update-block', { blockId: parent.id, updates: { childrenIds: [...parent.childrenIds] }, dayId: props.dayId })
    }
  }
}

const reparentChild = (oldParentId, newParentId, childId) => {
  if (oldParentId === newParentId) return
  unregisterChild(oldParentId, childId)
  registerChild(newParentId, childId)
}

// ─── Collapsible headings ────────────────────────────────────────────────────
const getChildRange = (index) => {
  const block = localBlocks.value[index]
  if (!block || !isHeading(block.type)) return []
  return getDescendantIndices(block.id)
}

const isHeadingGroupEnd = (index) => {
  const block = localBlocks.value[index]
  if (!block) return false
  const nesting = headingNesting.value[block.id] || []
  if (nesting.length === 0) return false
  const next = localBlocks.value[index + 1]
  if (!next) return true
  const nextNesting = headingNesting.value[next.id] || []
  if (nextNesting.length < nesting.length) return true
  if (nextNesting.length > 0 && nesting.length > 0 && nextNesting[0].headingId !== nesting[0].headingId) return true
  return false
}

const isEmptyHeading = (index) => {
  const block = localBlocks.value[index]
  if (!block || !isHeading(block.type)) return false
  return getDescendantIndices(block.id).length === 0
}

const showBoundaryZones = (index) => dragFromIdx.value !== null && (isHeadingGroupEnd(index) || isEmptyHeading(index))

const showOutsideBoundary = (index) => {
  const block = localBlocks.value[index]
  if (!block) return false
  const nesting = headingNesting.value[block.id] || []
  return nesting.length > 0
}

const isGroupEnd = (index) => {
  const block = localBlocks.value[index]
  if (!block) return false
  if (isHeading(block.type)) {
    const descendants = getDescendantIndices(block.id)
    if (descendants.length === 0) {
      const next = localBlocks.value[index + 1]
      return next ? next.parentId !== block.id : false
    }
    return false
  }
  return isHeadingGroupEnd(index)
}

const getAfterGroupIdx = (headingIdx) => {
  const children = getChildRange(headingIdx)
  return children.length ? children[children.length - 1] + 1 : headingIdx + 1
}

const hiddenBlockIds = computed(() => {
  const hidden = new Set()
  for (const collapsedId of collapsedIds) {
    for (const idx of getDescendantIndices(collapsedId)) {
      hidden.add(localBlocks.value[idx]?.id)
    }
  }
  return hidden
})

const toggleCollapse = (blockId) => {
  if (collapsedIds.has(blockId)) collapsedIds.delete(blockId)
  else collapsedIds.add(blockId)
}

const getCollapsedCount = (index) => getChildRange(index).length

const headingNesting = computed(() => {
  const result = {}
  for (const block of localBlocks.value) {
    result[block.id] = getAncestorChain(block.id)
  }
  return result
})

const getHeadingLines = (block) => (headingNesting.value[block.id] || []).map(n => n.level)
const getHeadingNesting = (block) => headingNesting.value[block.id] || []

const shouldShowThreadLine = (block, entry) => {
  const checkIdx = hoveredIndex.value !== null ? hoveredIndex.value : activeIndex.value
  if (checkIdx === null) return false
  const checkBlock = localBlocks.value[checkIdx]
  if (!checkBlock) return false
  if (checkBlock.id === entry.headingId) return true
  const checkEntry = (headingNesting.value[checkBlock.id] || []).find(n => n.level === entry.level)
  return checkEntry?.headingId === entry.headingId
}

// ─── Block selection ─────────────────────────────────────────────────────────
const selectedSet = reactive(new Set())

const isBlockSelected = (index) => selectedSet.has(index)
const hasSelection = computed(() => selectedSet.size > 0)

const clearSelection = () => { selectedSet.clear(); selection.anchor = null }

const copySelection = async () => {
  if (!hasSelection.value) return
  const indices = [...selectedSet].sort((a, b) => a - b)
  const text = indices.map(i => {
    const b = localBlocks.value[i]
    if (!b) return ''
    if (b.type === 'bullet') return b.content.split('\n').map(l => `${'  '.repeat(b.indent || 0)}- ${l}`).join('\n')
    if (b.type === 'numbered') return b.content.split('\n').map((l, li) => `${'  '.repeat(b.indent || 0)}${li + 1}. ${l}`).join('\n')
    if (b.type === 'checkbox') return b.content.split('\n').map((l, li) =>
      `${'  '.repeat(b.indent || 0)}[${isLineChecked(b, li) ? 'x' : ' '}] ${l}`
    ).join('\n')
    if (isHeading(b.type)) return `${'#'.repeat(headingLevel(b.type))} ${b.content}`
    if (b.type === 'quote') return `> ${b.content}`
    if (b.type === 'table') return getTableData(b).map(r => r.join('\t')).join('\n')
    return b.content
  }).join('\n')
  try { await navigator.clipboard.writeText(text) } catch { /* silent */ }
}

const selectionCount = computed(() => selectedSet.size)

const onEditorMouseDown = (e) => { if (!e.shiftKey && !e.ctrlKey && !e.metaKey) clearSelection() }

const onTextareaMouseDown = (index, e) => {
  if (e.shiftKey) {
    e.preventDefault()
    const anchor = selection.anchor ?? activeIndex.value ?? index
    selection.anchor = anchor
    selectedSet.clear()
    const start = Math.min(anchor, index)
    const end = Math.max(anchor, index)
    for (let i = start; i <= end; i++) selectedSet.add(i)
  } else if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    if (selectedSet.has(index)) {
      selectedSet.delete(index)
    } else {
      selectedSet.add(index)
    }
    if (!selection.anchor) selection.anchor = index
  } else {
    clearSelection()
    selection.anchor = index
  }
}

const onFocus = (index) => { activeIndex.value = index; typeMenu.value.show = false }

const onBlur = (index, e) => {
  setTimeout(() => {
    if (activeIndex.value === index) {
      const editorEl = e.target.closest('.goblin-editor')
      if (editorEl && !editorEl.contains(document.activeElement)) {
        activeIndex.value = null
      }
    }
  }, 0)
}

// ─── Task ref helpers ────────────────────────────────────────────────────────
const getTaskRefs = (block) => {
  if (Array.isArray(block.taskRefs)) return block.taskRefs
  if (block.taskRef) return [block.taskRef]
  return []
}
const setTaskRefs = (block, refs) => { block.taskRefs = refs; block.taskRef = refs[0] ?? null }

// ─── Sync from prop ──────────────────────────────────────────────────────────
const normalizeBlocks = (blocks) =>
  blocks.map(b => ({ childrenIds: [], ...b, _key: b._key ?? b.id }))

// ─── Migration: compute parentId from position for legacy data ──────────────
const migrateParentIds = () => {
  const hasHeadings = localBlocks.value.some(b => isHeading(b.type))
  const hasParentIds = localBlocks.value.some(b => b.parentId)
  if (!hasHeadings || hasParentIds) return

  const stack = []
  const childMap = {}
  for (const block of localBlocks.value) {
    const level = headingLevel(block.type)
    if (level > 0) {
      while (stack.length > 0 && stack[stack.length - 1].level >= level) stack.pop()
      block.parentId = stack.length > 0 ? stack[stack.length - 1].id : null
      stack.push({ level, id: block.id })
    } else {
      block.parentId = stack.length > 0 ? stack[stack.length - 1].id : null
    }
    if (block.parentId) {
      if (!childMap[block.parentId]) childMap[block.parentId] = []
      childMap[block.parentId].push(block.id)
    }
    if (block.parentId && block.id && !block.id.startsWith('temp_')) {
      emit('update-block', { blockId: block.id, updates: { parentId: block.parentId }, dayId: props.dayId })
    }
  }
  for (const [pid, children] of Object.entries(childMap)) {
    const parent = blockById.value[pid]
    if (parent) {
      parent.childrenIds = children
      if (parent.id && !parent.id.startsWith('temp_')) {
        emit('update-block', { blockId: parent.id, updates: { childrenIds: children }, dayId: props.dayId })
      }
    }
  }
}

watch(() => props.blocks, (incoming) => {
  if (localBlocks.value.length === 0 && incoming.length > 0) {
    localBlocks.value = normalizeBlocks(incoming)
    nextTick(() => {
      migrateParentIds()
      nextTick(measureAllLineTops)
    })
    return
  }
  const existingIds = new Set(localBlocks.value.map(b => b.id))
  const incomingIds = new Set(incoming.map(b => b.id))
  const pendingOrders = new Set(
    localBlocks.value.filter(b => b.id?.startsWith('temp_')).map(b => b.order)
  )
  incoming.forEach(b => {
    if (!existingIds.has(b.id) && !pendingOrders.has(b.order)) {
      localBlocks.value.push({ childrenIds: [], ...b, _key: b.id })
    }
  })
  for (let i = localBlocks.value.length - 1; i >= 0; i--) {
    const b = localBlocks.value[i]
    if (!incomingIds.has(b.id) && !b.id?.startsWith('temp_')) {
      localBlocks.value.splice(i, 1)
    }
  }
}, { immediate: true, deep: false })

// ─── Ref helpers ─────────────────────────────────────────────────────────────
const focusBlock = async (index, atEnd = true, colOffset = null) => {
  const block = localBlocks.value[index]
  if (!block) return
  let el = null
  for (let i = 0; i < 3 && !el; i++) { await nextTick(); el = blockRefs.value[block.id] }
  if (!el) return
  el.focus()
  if (colOffset !== null) {
    if (atEnd) {
      const lines = el.value.split('\n')
      const lastLineStart = el.value.length - lines[lines.length - 1].length
      el.selectionStart = el.selectionEnd = Math.min(lastLineStart + colOffset, el.value.length)
    } else {
      const firstNewline = el.value.indexOf('\n')
      const firstLineLen = firstNewline === -1 ? el.value.length : firstNewline
      el.selectionStart = el.selectionEnd = Math.min(colOffset, firstLineLen)
    }
  } else if (atEnd) {
    el.selectionStart = el.selectionEnd = el.value.length
  } else {
    el.selectionStart = el.selectionEnd = 0
  }
}

const autoResize = (el) => { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px' }

const resizeAndMeasure = (block) => {
  const el = blockRefs.value[block.id]
  if (el) autoResize(el)
  if (isListType(block.type)) nextTick(() => measureLineTops(block))
}

// ─── Visual line detection ───────────────────────────────────────────────────
const getVisualLineInfo = (el) => {
  const style = window.getComputedStyle(el)
  const lineHeight = parseFloat(style.lineHeight) || (parseFloat(style.fontSize) * 1.625)
  const mirror = document.createElement('div')
  mirror.style.cssText = [
    'position:absolute', 'visibility:hidden', 'white-space:pre-wrap',
    'word-wrap:break-word', 'overflow-wrap:break-word',
    `width:${style.width}`, `font:${style.font}`, `padding:${style.padding}`,
    `border:${style.border}`, `line-height:${style.lineHeight}`,
    `letter-spacing:${style.letterSpacing}`, `box-sizing:${style.boxSizing}`,
  ].join(';')
  const textBefore = el.value.substring(0, el.selectionStart)
  mirror.textContent = textBefore || '\u200b'
  const marker = document.createElement('span')
  marker.textContent = '\u200b'
  mirror.appendChild(marker)
  document.body.appendChild(mirror)
  const markerTop = marker.offsetTop
  const totalHeight = mirror.scrollHeight
  document.body.removeChild(mirror)
  const lastNewline = textBefore.lastIndexOf('\n')
  const colOffset = lastNewline === -1 ? textBefore.length : textBefore.length - lastNewline - 1
  return { isFirstLine: markerTop < lineHeight, isLastLine: (totalHeight - markerTop) <= lineHeight * 1.5, colOffset }
}

// ─── Block helpers ───────────────────────────────────────────────────────────
const getTaskTitle = (taskId) => props.tasks[taskId]?.title ?? '(deleted task)'

const getPlaceholder = (type, index) => {
  const isLast = index === localBlocks.value.length - 1
  if (index === 0 && type === 'paragraph') return "What's on your mind... (type / for commands)"
  if (!isLast && type === 'paragraph') return ''
  return {
    paragraph: "Type something... (/ for commands)",
    h1: 'Heading 1', h2: 'Heading 2', h3: 'Heading 3',
    bullet: 'List item', numbered: 'List item', checkbox: 'To-do',
    quote: 'Quote...', code: 'Code...',
  }[type] ?? ''
}

const getBlockClass = (type) => {
  const base = 'bg-transparent resize-none outline-none leading-relaxed overflow-hidden placeholder-zinc-500 transition-colors'
  return `${base} ${{
    paragraph: 'text-zinc-200 text-sm',
    h1: 'text-2xl font-bold text-zinc-100',
    h2: 'text-xl font-semibold text-zinc-100',
    h3: 'text-lg font-semibold text-zinc-200',
    bullet: 'text-sm text-zinc-200',
    numbered: 'text-sm text-zinc-200',
    checkbox: 'text-sm text-zinc-200',
    quote: 'text-sm text-zinc-400 italic pl-4 border-l-2 border-emerald-600',
    code: 'text-sm text-emerald-300 font-mono bg-zinc-800/80 rounded px-2 py-1',
  }[type] ?? 'text-zinc-200 text-sm'}`
}

// ─── Link detection & inline formatting ──────────────────────────────────────
const LINK_REGEX = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>\[\]()]+)/g

const hasLinks = (content) => {
  if (!content) return false
  LINK_REGEX.lastIndex = 0
  return LINK_REGEX.test(content)
}

// Check if content has any formatted elements (links, bold, italic, underline, inline code)
const INLINE_FORMAT_REGEX = /\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|`[^`]+`|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>\[\]()]+)/
const hasFormattedContent = (block) => {
  if (!block.content || block.type === 'code') return false
  return INLINE_FORMAT_REGEX.test(block.content)
}

// Render content with inline formatting as HTML (for the overlay)
const renderFormattedContent = (content) => {
  if (!content) return ''
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  // Order matters: process larger/more specific patterns first
  const COMBINED_REGEX = /(\*\*([^*]+)\*\*)|(__([^_]+)__)|(\*([^*]+)\*)|(`([^`]+)`)|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>\[\]()]+)/g

  let result = ''
  let lastIndex = 0
  let match

  while ((match = COMBINED_REGEX.exec(content)) !== null) {
    if (match.index > lastIndex) {
      result += esc(content.slice(lastIndex, match.index))
    }

    if (match[1]) {
      // **bold**
      result += `<strong class="font-bold text-zinc-100">${esc(match[2])}</strong>`
    } else if (match[3]) {
      // __underline__
      result += `<u class="underline underline-offset-2 decoration-zinc-400">${esc(match[4])}</u>`
    } else if (match[5]) {
      // *italic*
      result += `<em class="italic text-zinc-300">${esc(match[6])}</em>`
    } else if (match[7]) {
      // `inline code`
      result += `<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-xs">${esc(match[8])}</code>`
    } else if (match[9] && match[10]) {
      // [label](url)
      result += `<a href="${esc(match[10])}" class="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 cursor-pointer" target="_blank" rel="noopener noreferrer">${esc(match[9])}</a>`
    } else if (match[11]) {
      // raw URL
      result += `<a href="${esc(match[11])}" class="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 cursor-pointer" target="_blank" rel="noopener noreferrer">${esc(match[11])}</a>`
    }

    lastIndex = COMBINED_REGEX.lastIndex
  }

  if (lastIndex < content.length) {
    result += esc(content.slice(lastIndex))
  }

  return result || esc(content)
}

const onOverlayClick = (block, index, e) => {
  // If click was on a link, handle it
  if (e.target.closest('a')) {
    const href = e.target.closest('a').getAttribute('href')
    if (href) { e.preventDefault(); window.open(href, '_blank', 'noopener,noreferrer') }
    return
  }
  // Otherwise focus the textarea
  const el = blockRefs.value[block.id]
  if (el) el.focus()
}

const copyBlock = async (block) => {
  try {
    await navigator.clipboard.writeText(block.content)
    copiedBlockId.value = block.id
    setTimeout(() => { copiedBlockId.value = null }, 1500)
  } catch { /* silent */ }
}

// ─── Link popover ────────────────────────────────────────────────────────────
const toggleLinkPopover = (block, index, e) => {
  if (linkPopover.value.show && linkPopover.value.blockId === block.id) { closeLinkPopover(); return }
  const rect = e.currentTarget.getBoundingClientRect()
  linkPopover.value = { show: true, blockId: block.id, style: { top: `${rect.bottom + 4}px`, left: `${rect.left - 4}px` } }
}
const closeLinkPopover = () => { linkPopover.value = { show: false, blockId: null, style: {} } }

const unlinkTask = (block, taskId) => {
  const refs = getTaskRefs(block).filter(id => id !== taskId)
  setTaskRefs(block, refs)
  if (block.id && !block.id.startsWith('temp_')) {
    emit('update-block', { blockId: block.id, updates: { taskRef: refs[0] ?? null, taskRefs: refs }, dayId: props.dayId })
  }
  if (!refs.length) closeLinkPopover()
}

const onDocClick = (e) => {
  if (linkPopover.value.show &&
    !e.target.closest('[data-link-popover]') &&
    !e.target.closest('[title="Linked tasks"], [title="Link to task"]')) {
    closeLinkPopover()
  }
  if (typeMenu.value.show && !e.target.closest('.slash-menu') && !e.target.closest('[title="Change block type"]')) {
    typeMenu.value.show = false
  }
}

// ─── Undo / Redo ─────────────────────────────────────────────────────────────
const MAX_UNDO = 100
const undoStack = ref([])
const redoStack = ref([])

const snapshotBlocks = () => {
  return localBlocks.value.map(b => ({
    id: b.id, _key: b._key, type: b.type, content: b.content,
    order: b.order, taskRef: b.taskRef, taskRefs: b.taskRefs ? [...b.taskRefs] : undefined,
    parentId: b.parentId, childrenIds: b.childrenIds ? [...b.childrenIds] : [],
    indent: b.indent, checkedLines: b.checkedLines ? [...b.checkedLines] : undefined,
    language: b.language, tableData: b.tableData,
  }))
}

const pushUndo = () => {
  undoStack.value.push(snapshotBlocks())
  if (undoStack.value.length > MAX_UNDO) undoStack.value.shift()
  redoStack.value = []
}

const restoreSnapshot = (snapshot) => {
  localBlocks.value = snapshot.map(b => ({ ...b, _key: b._key ?? b.id }))
  localBlocks.value.forEach((b, i) => { b.order = (i + 1) * 1000 })
  emit('reorder-blocks', {
    reordered: localBlocks.value.filter(b => b.id && !b.id.startsWith('temp_')).map(b => ({ blockId: b.id, order: b.order })),
    dayId: props.dayId
  })
  localBlocks.value.forEach(b => {
    if (b.id && !b.id.startsWith('temp_')) {
      emit('update-block', {
        blockId: b.id,
        updates: {
          content: b.content, type: b.type, parentId: b.parentId ?? null,
          childrenIds: b.childrenIds || [], indent: b.indent ?? 0,
          ...(b.checkedLines ? { checkedLines: b.checkedLines } : {}),
          ...(b.language !== undefined ? { language: b.language } : {}),
          ...(b.tableData !== undefined ? { tableData: b.tableData } : {}),
        },
        dayId: props.dayId
      })
    }
  })
  nextTick(() => {
    Object.values(blockRefs.value).forEach(el => { if (el) autoResize(el) })
    nextTick(measureAllLineTops)
  })
}

const undo = () => {
  if (!undoStack.value.length) return
  redoStack.value.push(snapshotBlocks())
  const snapshot = undoStack.value.pop()
  restoreSnapshot(snapshot)
}

const redo = () => {
  if (!redoStack.value.length) return
  undoStack.value.push(snapshotBlocks())
  const snapshot = redoStack.value.pop()
  restoreSnapshot(snapshot)
}

// ─── Markdown shortcuts ──────────────────────────────────────────────────────
const MARKDOWN_SHORTCUTS = [
  { pattern: /^-\s$/, type: 'bullet' },
  { pattern: /^\*\s$/, type: 'bullet' },
  { pattern: /^1\.\s$/, type: 'numbered' },
  { pattern: /^###\s$/, type: 'h3' },
  { pattern: /^##\s$/, type: 'h2' },
  { pattern: /^#\s$/, type: 'h1' },
  { pattern: /^>\s$/, type: 'quote' },
  { pattern: /^\[\]\s?$/, type: 'checkbox' },
]

const CODE_FENCE_REGEX = /^```(\w*)\s?$/

const tryMarkdownShortcut = (block) => {
  if (block.type !== 'paragraph') return false

  // Code fence: ```lang or just ```
  const codeFence = CODE_FENCE_REGEX.exec(block.content)
  if (codeFence) {
    pushUndo()
    const lang = codeFence[1] || ''
    block.content = ''
    block.type = 'code'
    block.language = lang
    if (block.id && !block.id.startsWith('temp_')) {
      emit('update-block', { blockId: block.id, updates: { type: 'code', content: '', language: lang }, dayId: props.dayId })
    }
    nextTick(() => {
      const el = blockRefs.value[block.id]
      if (el) { autoResize(el); el.focus() }
    })
    return true
  }

  for (const { pattern, type } of MARKDOWN_SHORTCUTS) {
    if (pattern.test(block.content)) {
      pushUndo()
      block.content = ''
      block.type = type
      if (type === 'checkbox') block.checkedLines = []
      if (block.id && !block.id.startsWith('temp_')) {
        emit('update-block', { blockId: block.id, updates: { type, content: '', ...(type === 'checkbox' ? { checkedLines: [] } : {}) }, dayId: props.dayId })
      }
      nextTick(() => {
        const el = blockRefs.value[block.id]
        if (el) { autoResize(el); el.focus() }
        if (isListType(type)) measureLineTops(block)
      })
      return true
    }
  }
  return false
}

// ─── Type changer ────────────────────────────────────────────────────────────
const openTypeChanger = (index) => {
  if (typeMenu.value.show && typeMenu.value.blockIndex === index && typeMenu.value.mode === 'change') {
    typeMenu.value.show = false; return
  }
  typeMenu.value = { show: true, blockIndex: index, query: '', mode: 'change' }
}

const applyType = (index, type) => {
  pushUndo()
  const block = localBlocks.value[index]
  if (typeMenu.value.mode === 'slash') block.content = ''
  block.type = type
  if (type === 'checkbox' && !Array.isArray(block.checkedLines)) block.checkedLines = []
  typeMenu.value.show = false

  if (type === 'divider') {
    block.content = ''
    if (block.id && !block.id.startsWith('temp_')) {
      emit('update-block', { blockId: block.id, updates: { type: 'divider', content: '' }, dayId: props.dayId })
    }
    insertBlockAfter(index); return
  }

  if (type === 'table') {
    block.content = ''
    block.tableData = JSON.stringify([['', '', ''], ['', '', ''], ['', '', '']])
    if (block.id && !block.id.startsWith('temp_')) {
      emit('update-block', { blockId: block.id, updates: { type: 'table', content: '', tableData: block.tableData }, dayId: props.dayId })
    }
    return
  }

  const updates = { type }
  if (typeMenu.value.mode === 'slash') updates.content = ''
  if (type === 'checkbox') updates.checkedLines = block.checkedLines
  if (block.id && !block.id.startsWith('temp_')) {
    emit('update-block', { blockId: block.id, updates, dayId: props.dayId })
  }

  nextTick(() => { resizeAndMeasure(block); const el = blockRefs.value[block.id]; if (el) el.focus() })
}

// ─── Table helpers ───────────────────────────────────────────────────────────
const getTableData = (block) => {
  try {
    const data = JSON.parse(block.tableData || '[]')
    if (Array.isArray(data) && data.length > 0) return data
  } catch { /* ignore */ }
  return [['', ''], ['', '']]
}

const setTableData = (block, data) => {
  block.tableData = JSON.stringify(data)
  if (block.id && !block.id.startsWith('temp_')) {
    emit('update-block', { blockId: block.id, updates: { tableData: block.tableData }, dayId: props.dayId })
  }
}

const onTableCellInput = (block, ri, ci, e) => {
  const data = getTableData(block)
  data[ri][ci] = e.target.value
  setTableData(block, data)
}

const onTableKeyDown = (block, blockIndex, ri, ci, e) => {
  if (e.key === 'Tab') {
    e.preventDefault()
    const data = getTableData(block)
    const cols = data[0]?.length || 0
    const rows = data.length
    let nextRi = ri, nextCi = ci + (e.shiftKey ? -1 : 1)
    if (nextCi >= cols) { nextCi = 0; nextRi++ }
    if (nextCi < 0) { nextCi = cols - 1; nextRi-- }
    if (nextRi >= 0 && nextRi < rows) {
      const tableEl = e.target.closest('table')
      if (tableEl) {
        const inputs = tableEl.querySelectorAll('input')
        const targetIdx = nextRi * cols + nextCi
        if (inputs[targetIdx]) inputs[targetIdx].focus()
      }
    }
  }
}

const addTableRow = (block) => {
  pushUndo()
  const data = getTableData(block)
  const cols = data[0]?.length || 2
  data.push(new Array(cols).fill(''))
  setTableData(block, data)
}

const addTableCol = (block) => {
  pushUndo()
  const data = getTableData(block)
  data.forEach(row => row.push(''))
  setTableData(block, data)
}

const removeTableRow = (block, ri) => {
  pushUndo()
  const data = getTableData(block)
  if (data.length <= 1) return
  data.splice(ri, 1)
  setTableData(block, data)
}

const removeTableCol = (block, ci) => {
  pushUndo()
  const data = getTableData(block)
  if ((data[0]?.length || 0) <= 1) return
  data.forEach(row => row.splice(ci, 1))
  setTableData(block, data)
}

// ─── Code block language ─────────────────────────────────────────────────────
let langSaveTimeout = null
const onLanguageInput = (block, e) => {
  block.language = e.target.value
  clearTimeout(langSaveTimeout)
  langSaveTimeout = setTimeout(() => {
    if (block.id && !block.id.startsWith('temp_')) {
      emit('update-block', { blockId: block.id, updates: { language: block.language }, dayId: props.dayId })
    }
  }, 600)
}

// ─── Paste handler: auto-format lists ────────────────────────────────────────
const onPaste = (block, index, e) => {
  if (block.type !== 'paragraph') return
  const text = e.clipboardData?.getData('text/plain')
  if (!text) return

  const lines = text.split('\n').filter(l => l.trim())
  if (lines.length < 2) return

  const bulletPattern = /^\s*[-*•]\s+(.*)$/
  const numberedPattern = /^\s*\d+[.)]\s+(.*)$/
  const checkboxPattern = /^\s*\[([x ])\]\s+(.*)$/i

  let listType = null
  let matchedLines = []
  let checkedStates = []

  if (lines.every(l => bulletPattern.test(l))) {
    listType = 'bullet'
    matchedLines = lines.map(l => l.match(bulletPattern)[1])
  } else if (lines.every(l => numberedPattern.test(l))) {
    listType = 'numbered'
    matchedLines = lines.map(l => l.match(numberedPattern)[1])
  } else if (lines.every(l => checkboxPattern.test(l))) {
    listType = 'checkbox'
    matchedLines = lines.map(l => l.match(checkboxPattern)[2])
    checkedStates = lines.map(l => l.match(checkboxPattern)[1].toLowerCase() === 'x')
  }

  if (!listType) return

  e.preventDefault()
  pushUndo()

  // Convert current block to first list item
  block.type = listType
  block.content = matchedLines[0]
  block.indent = 0
  if (listType === 'checkbox') {
    block.checkedLines = checkedStates[0] ? [0] : []
  }
  if (block.id && !block.id.startsWith('temp_')) {
    emit('update-block', { blockId: block.id, updates: { type: listType, content: matchedLines[0], indent: 0, ...(listType === 'checkbox' ? { checkedLines: block.checkedLines } : {}) }, dayId: props.dayId })
  }

  nextTick(() => { resizeAndMeasure(block) })

  // Insert remaining lines as new blocks
  for (let li = 1; li < matchedLines.length; li++) {
    const extras = { indent: 0, parentId: block.parentId ?? null }
    if (listType === 'checkbox') {
      extras.checkedLines = checkedStates[li] ? [0] : []
    }
    insertBlockAfter(index + li - 1, listType, matchedLines[li], extras)
  }
}

// ─── Input handling ──────────────────────────────────────────────────────────
let saveTimeout = null
const SAVE_DELAY = 600
const deletedBlockIds = new Set()

const onInput = (block, index, e) => {
  if (isListType(block.type) && block.content.includes('\n')) {
    const pos = e.target.selectionStart
    block.content = block.content.replace(/\n/g, ' ')
    nextTick(() => { if (e.target) e.target.selectionStart = e.target.selectionEnd = pos })
  }

  autoResize(e.target)

  if (isListType(block.type)) nextTick(() => measureLineTops(block))

  const val = e.target.value
  if (val === '/') {
    typeMenu.value = { show: true, blockIndex: index, query: '/', mode: 'slash' }
  } else if (val.startsWith('/') && typeMenu.value.show && typeMenu.value.mode === 'slash') {
    typeMenu.value.query = val
  } else if (typeMenu.value.mode === 'slash') {
    typeMenu.value.show = false
  }

  if (!typeMenu.value.show && tryMarkdownShortcut(block)) return

  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    if (block.id && !deletedBlockIds.has(block.id) && localBlocks.value.some(b => b.id === block.id)) {
      emit('update-block', { blockId: block.id, updates: { content: block.content }, dayId: props.dayId })
    }
  }, SAVE_DELAY)
}

const onKeyDown = (block, index, e) => {
  // ── Undo / Redo ────────────────────────────────────────────────────────
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
    e.preventDefault(); undo(); return
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
    e.preventDefault(); redo(); return
  }

  // ── Inline formatting shortcuts (Ctrl+B, Ctrl+I, Ctrl+U) ──────────────
  if ((e.ctrlKey || e.metaKey) && block.type !== 'code') {
    const el = blockRefs.value?.[block.id]
    if (el && el.selectionStart !== el.selectionEnd) {
      let wrapper = null
      if (e.key === 'b') wrapper = '**'
      else if (e.key === 'i') wrapper = '*'
      else if (e.key === 'u') wrapper = '__'

      if (wrapper) {
        e.preventDefault()
        pushUndo()
        const start = el.selectionStart
        const end = el.selectionEnd
        const selected = block.content.substring(start, end)
        const before = block.content.substring(0, start)
        const after = block.content.substring(end)
        // Toggle: if already wrapped, unwrap
        if (before.endsWith(wrapper) && after.startsWith(wrapper)) {
          block.content = before.slice(0, -wrapper.length) + selected + after.slice(wrapper.length)
          nextTick(() => {
            el.selectionStart = start - wrapper.length
            el.selectionEnd = end - wrapper.length
          })
        } else {
          block.content = before + wrapper + selected + wrapper + after
          nextTick(() => {
            el.selectionStart = start + wrapper.length
            el.selectionEnd = end + wrapper.length
          })
        }
        if (block.id && !block.id.startsWith('temp_')) {
          emit('update-block', { blockId: block.id, updates: { content: block.content }, dayId: props.dayId })
        }
        return
      }
    }
  }

  if ((e.ctrlKey || e.metaKey) && e.key === 'c' && hasSelection.value) {
    e.preventDefault(); copySelection(); return
  }

  if (e.key === 'Escape') {
    if (typeMenu.value.show) { typeMenu.value.show = false; return }
    if (hasSelection.value) { clearSelection(); return }
  }

  // ── Enter ──────────────────────────────────────────────────────────────
  if (e.key === 'Enter' && !e.shiftKey) {
    typeMenu.value.show = false

    if (isListType(block.type)) {
      e.preventDefault()
      const el = blockRefs.value?.[block.id]
      if (!el) return
      const pos = el.selectionStart
      const before = block.content.substring(0, pos)
      const after = block.content.substring(pos)

      if (block.content.trim() === '') {
        block.type = 'paragraph'; block.content = ''; block.indent = 0
        if (block.id && !block.id.startsWith('temp_')) {
          emit('update-block', { blockId: block.id, updates: { type: 'paragraph', content: '', indent: 0 }, dayId: props.dayId })
        }
        nextTick(() => { resizeAndMeasure(block) })
        return
      }

      pushUndo()
      block.content = before
      if (block.id && !block.id.startsWith('temp_')) {
        emit('update-block', { blockId: block.id, updates: { content: before }, dayId: props.dayId })
      }
      nextTick(() => { resizeAndMeasure(block) })
      insertBlockAfter(index, block.type, after, { indent: block.indent || 0, parentId: block.parentId ?? null })
      return
    }

    e.preventDefault()
    pushUndo()
    const el = blockRefs.value?.[block.id]
    const pos = el?.selectionStart ?? block.content.length
    const after = block.content.substring(pos)
    block.content = block.content.substring(0, pos)
    if (block.id && !block.id.startsWith('temp_')) {
      emit('update-block', { blockId: block.id, updates: { content: block.content }, dayId: props.dayId })
    }
    nextTick(() => { if (el) autoResize(el) })
    const newParentId = isHeading(block.type) ? block.id : (block.parentId ?? null)
    insertBlockAfter(index, 'paragraph', after, { parentId: newParentId })
    return
  }

  // ── Backspace ──────────────────────────────────────────────────────────
  if (e.key === 'Backspace') {
    const el = blockRefs.value?.[block.id]
    const atStart = el && el.selectionStart === 0 && el.selectionEnd === 0

    if (block.content === '' && !isListType(block.type)) {
      e.preventDefault(); pushUndo(); deleteBlock(index); return
    }

    if (atStart && isListType(block.type)) {
      e.preventDefault()
      pushUndo()
      if ((block.indent || 0) > 0) {
        block.indent = (block.indent || 0) - 1
        if (block.id && !block.id.startsWith('temp_')) {
          emit('update-block', { blockId: block.id, updates: { indent: block.indent }, dayId: props.dayId })
        }
        nextTick(() => resizeAndMeasure(block))
      } else {
        block.type = 'paragraph'; block.indent = 0
        if (block.id && !block.id.startsWith('temp_')) {
          emit('update-block', { blockId: block.id, updates: { type: 'paragraph', indent: 0 }, dayId: props.dayId })
        }
      }
      return
    }

    if (atStart && block.type === 'paragraph' && index > 0) {
      e.preventDefault()
      pushUndo()
      const prev = localBlocks.value[index - 1]
      if (prev.type === 'divider') { deleteBlock(index - 1); return }
      const prevLen = prev.content.length
      prev.content += block.content
      if (prev.id && !prev.id.startsWith('temp_')) {
        emit('update-block', { blockId: prev.id, updates: { content: prev.content }, dayId: props.dayId })
      }
      if (block.id && !block.id.startsWith('temp_')) {
        deletedBlockIds.add(block.id)
        emit('delete-block', { blockId: block.id, dayId: props.dayId })
      }
      if (block.parentId) unregisterChild(block.parentId, block.id)
      localBlocks.value.splice(index, 1)
      nextTick(() => {
        const prevEl = blockRefs.value[prev.id]
        if (prevEl) { autoResize(prevEl); prevEl.focus(); prevEl.selectionStart = prevEl.selectionEnd = prevLen }
        nextTick(() => { if (isListType(prev.type)) measureLineTops(prev) })
      })
      return
    }

    if (block.content === '' && isListType(block.type)) {
      e.preventDefault(); pushUndo(); deleteBlock(index); return
    }
  }

  // ── Delete (forward delete) ────────────────────────────────────────────
  if (e.key === 'Delete') {
    const el = blockRefs.value?.[block.id]
    if (!el) return
    const atEnd = el.selectionStart === el.value.length && el.selectionEnd === el.value.length

    if (block.content === '') {
      e.preventDefault()
      pushUndo()
      const wasIndex = index
      if (block.id) deletedBlockIds.add(block.id)
      if (block.parentId) unregisterChild(block.parentId, block.id)
      if (block.id && !block.id.startsWith('temp_')) {
        emit('delete-block', { blockId: block.id, dayId: props.dayId })
      }
      delete lineTopCache[block.id]
      localBlocks.value.splice(index, 1)
      nextTick(() => {
        if (wasIndex < localBlocks.value.length) focusBlock(wasIndex, false)
        else if (localBlocks.value.length > 0) focusBlock(localBlocks.value.length - 1, true)
      })
      return
    }

    if (atEnd && index < localBlocks.value.length - 1) {
      e.preventDefault()
      pushUndo()
      const next = localBlocks.value[index + 1]
      if (next.type === 'divider') {
        if (next.id) deletedBlockIds.add(next.id)
        if (next.parentId) unregisterChild(next.parentId, next.id)
        if (next.id && !next.id.startsWith('temp_')) {
          emit('delete-block', { blockId: next.id, dayId: props.dayId })
        }
        delete lineTopCache[next.id]
        localBlocks.value.splice(index + 1, 1)
        return
      }
      const curLen = block.content.length
      block.content += next.content
      if (block.id && !block.id.startsWith('temp_')) {
        emit('update-block', { blockId: block.id, updates: { content: block.content }, dayId: props.dayId })
      }
      if (next.id) deletedBlockIds.add(next.id)
      if (next.parentId) unregisterChild(next.parentId, next.id)
      if (next.id && !next.id.startsWith('temp_')) {
        emit('delete-block', { blockId: next.id, dayId: props.dayId })
      }
      delete lineTopCache[next.id]
      localBlocks.value.splice(index + 1, 1)
      nextTick(() => {
        autoResize(el)
        el.selectionStart = el.selectionEnd = curLen
        if (isListType(block.type)) nextTick(() => measureLineTops(block))
      })
      return
    }
  }

  // ── Tab (indent/outdent for lists) ─────────────────────────────────────
  if (e.key === 'Tab' && isListType(block.type)) {
    e.preventDefault()
    pushUndo()
    const delta = e.shiftKey ? -1 : 1
    const newIndent = Math.max(0, Math.min(2, (block.indent || 0) + delta))
    block.indent = newIndent
    const oldParentId = block.parentId ?? null
    if (newIndent > 0) {
      block.parentId = null
      for (let i = index - 1; i >= 0; i--) {
        const above = localBlocks.value[i]
        if (isListType(above.type) && above.type === block.type && (above.indent || 0) === newIndent - 1) {
          block.parentId = above.id; break
        }
        if (!isListType(above.type) || above.type !== block.type) break
      }
    } else {
      block.parentId = null
    }
    reparentChild(oldParentId, block.parentId, block.id)
    if (block.id && !block.id.startsWith('temp_')) {
      emit('update-block', { blockId: block.id, updates: { indent: block.indent, parentId: block.parentId ?? null }, dayId: props.dayId })
    }
    nextTick(() => resizeAndMeasure(block))
    return
  }

  // ── Arrow navigation ───────────────────────────────────────────────────
  const el = blockRefs.value?.[block.id]
  if (!el) return

  if (e.key === 'ArrowUp' && index > 0) {
    const info = getVisualLineInfo(el)
    if (info.isFirstLine) {
      e.preventDefault()
      let target = index - 1
      while (target >= 0 && hiddenBlockIds.value.has(localBlocks.value[target].id)) target--
      if (target >= 0) focusBlock(target, true, info.colOffset)
    }
  }

  if (e.key === 'ArrowDown' && index < localBlocks.value.length - 1) {
    const info = getVisualLineInfo(el)
    if (info.isLastLine) {
      e.preventDefault()
      let target = index + 1
      while (target < localBlocks.value.length && hiddenBlockIds.value.has(localBlocks.value[target].id)) target++
      if (target < localBlocks.value.length) focusBlock(target, false, info.colOffset)
    }
  }
}

// ─── Block mutations ─────────────────────────────────────────────────────────
const insertBlockAfter = async (index, type = 'paragraph', content = '', extras = {}) => {
  const afterOrder = localBlocks.value[index]?.order ?? 0
  const beforeOrder = localBlocks.value[index + 1]?.order ?? afterOrder + 2000
  const order = (afterOrder + beforeOrder) / 2
  const tempId = `temp_${Date.now()}`
  const newBlock = { id: tempId, _key: tempId, type, content, order, taskRef: null, parentId: null, childrenIds: [], ...extras }
  localBlocks.value.splice(index + 1, 0, newBlock)
  await nextTick()
  const newEl = blockRefs.value[newBlock.id]
  if (newEl) autoResize(newEl)
  if (isListType(type)) await nextTick(() => measureLineTops(newBlock))
  focusBlock(index + 1, false)
  if (newBlock.parentId) registerChild(newBlock.parentId, newBlock.id)
  emit('add-block', { type, content, order, dayId: props.dayId, tempId, parentId: newBlock.parentId, ...extras })
}

const deleteBlock = async (index) => {
  const block = localBlocks.value[index]
  if (!block) return
  clearTimeout(saveTimeout)
  if (block.id) deletedBlockIds.add(block.id)
  if (block.parentId) unregisterChild(block.parentId, block.id)
  if (block.id && !block.id.startsWith('temp_')) {
    emit('delete-block', { blockId: block.id, dayId: props.dayId })
  }
  delete lineTopCache[block.id]
  localBlocks.value.splice(index, 1)
  await nextTick()
  if (index > 0) focusBlock(index - 1, true)
  else if (localBlocks.value.length > 0) focusBlock(0, false)
}

const addBlockAtEnd = async () => {
  const order = localBlocks.value.length
    ? Math.max(...localBlocks.value.map(b => b.order)) + 1000 : 1000
  const tempId = `temp_${Date.now()}`
  localBlocks.value.push({ id: tempId, _key: tempId, type: 'paragraph', content: '', order, taskRef: null, parentId: null, childrenIds: [] })
  await nextTick()
  focusBlock(localBlocks.value.length - 1, false)
  emit('add-block', { type: 'paragraph', content: '', order, dayId: props.dayId, tempId, parentId: null })
}

const onClickBackground = () => {
  typeMenu.value.show = false; closeLinkPopover(); clearSelection(); addBlockAtEnd()
}

const resolveTemp = (tempId, realId) => {
  const block = localBlocks.value.find(b => b.id === tempId)
  if (block) {
    if (blockRefs.value?.[tempId]) { blockRefs.value[realId] = blockRefs.value[tempId]; delete blockRefs.value[tempId] }
    if (lineTopCache[tempId]) { lineTopCache[realId] = lineTopCache[tempId]; delete lineTopCache[tempId] }
    block.id = realId

    if (block.parentId) {
      const parent = localBlocks.value.find(b => b.id === block.parentId)
      if (parent?.childrenIds) {
        const idx = parent.childrenIds.indexOf(tempId)
        if (idx !== -1) parent.childrenIds[idx] = realId
      }
    }
    localBlocks.value.forEach(b => {
      if (b.parentId === tempId) b.parentId = realId
    })
    localBlocks.value.forEach(b => {
      if (Array.isArray(b.childrenIds)) {
        const idx = b.childrenIds.indexOf(tempId)
        if (idx !== -1) b.childrenIds[idx] = realId
      }
    })
  }
}

defineExpose({ resolveTemp })

// ─── Drag & Drop ─────────────────────────────────────────────────────────────
const dragIndices = ref(new Set())

const isDraggedBlock = (index) => dragIndices.value.has(index)

const onDragStart = (index, e) => {
  dropTargetIdx.value = null
  boundaryDrop.value = null

  const indices = new Set()

  // FIX: When multiple blocks are selected and you grab any selected block's handle, move ALL selected
  if (selectedSet.size > 0 && selectedSet.has(index)) {
    for (const selIdx of selectedSet) {
      indices.add(selIdx)
      for (const childIdx of getChildRange(selIdx)) indices.add(childIdx)
    }
  } else {
    indices.add(index)
    for (const childIdx of getChildRange(index)) indices.add(childIdx)
  }

  dragIndices.value = indices
  dragFromIdx.value = index
  e.dataTransfer.effectAllowed = 'move'

  // Better drag image for multi-select
  if (indices.size > 1) {
    const badge = document.createElement('div')
    badge.textContent = `${indices.size} blocks`
    badge.style.cssText = 'position:absolute;top:-9999px;left:-9999px;padding:4px 10px;background:#10b981;color:#fff;border-radius:6px;font-size:12px;font-weight:600;white-space:nowrap;'
    document.body.appendChild(badge)
    e.dataTransfer.setDragImage(badge, 30, 12)
    setTimeout(() => document.body.removeChild(badge), 0)
  } else {
    const row = e.target.closest('.block-row')
    if (row) e.dataTransfer.setDragImage(row, 20, 12)
  }
}

const onDragOver = (index, e) => {
  if (dragFromIdx.value === null) return
  e.dataTransfer.dropEffect = 'move'
  // FIXED: clear boundary drop when regular drop target is active
  boundaryDrop.value = null
  const row = e.currentTarget.closest?.('.block-row')
  if (row) {
    const rect = row.getBoundingClientRect()
    const target = e.clientY > rect.top + rect.height / 2 ? index + 1 : index
    dropTargetIdx.value = dragIndices.value.has(target) || dragIndices.value.has(target - 1)
      ? null : target
  } else {
    const maxDragged = Math.max(...dragIndices.value)
    dropTargetIdx.value = localBlocks.value.length > maxDragged + 1 ? localBlocks.value.length : null
  }
}

// FIX: Group integrity — blocks in the middle of a group must belong to it
const enforceGroupIntegrity = () => {
  for (let i = 0; i < localBlocks.value.length; i++) {
    const b = localBlocks.value[i]
    if (isHeading(b.type)) continue

    const prev = localBlocks.value[i - 1]
    const next = localBlocks.value[i + 1]

    // If both neighbors share a parentId and this block doesn't, adopt it
    if (prev && next && prev.parentId && prev.parentId === next.parentId && b.parentId !== prev.parentId) {
      const parentBlock = blockById.value[prev.parentId]
      if (parentBlock && isHeading(parentBlock.type)) {
        const oldParent = b.parentId
        b.parentId = prev.parentId
        reparentChild(oldParent, b.parentId, b.id)
        if (b.id && !b.id.startsWith('temp_')) {
          emit('update-block', { blockId: b.id, updates: { parentId: b.parentId }, dayId: props.dayId })
        }
      }
    }
  }
}

// When blocks are dragged, decide whether to keep or reset parentId.
const detachDraggedBlocks = (startIdx, count, headingChildCount) => {
  const rootCount = count - headingChildCount
  for (let i = startIdx; i < startIdx + rootCount && i < localBlocks.value.length; i++) {
    const b = localBlocks.value[i]
    const updates = {}

    if (isListType(b.type) && (b.indent || 0) > 0) {
      b.indent = 0
      updates.indent = 0
    }

    if (b.parentId) {
      const prev = localBlocks.value[i - 1]
      const next = localBlocks.value[i + 1]
      const neighborHasSameParent =
        (prev?.parentId === b.parentId) ||
        (next?.parentId === b.parentId) ||
        (prev?.id === b.parentId) ||
        (next?.id === b.parentId)
      if (!neighborHasSameParent) {
        const oldParent = b.parentId
        b.parentId = null
        updates.parentId = null
        unregisterChild(oldParent, b.id)
      }
    }

    if (Object.keys(updates).length && b.id && !b.id.startsWith('temp_')) {
      emit('update-block', { blockId: b.id, updates, dayId: props.dayId })
    }
  }
}

const onDrop = (targetIndex) => {
  const target = targetIndex !== undefined ? targetIndex : dropTargetIdx.value
  const indices = dragIndices.value
  dragFromIdx.value = null; dropTargetIdx.value = null; boundaryDrop.value = null; dragIndices.value = new Set()
  if (!indices.size || target === null) return

  pushUndo()

  const sorted = [...indices].sort((a, b) => b - a)
  const removed = []
  for (const idx of sorted) {
    removed.unshift(...localBlocks.value.splice(idx, 1))
  }

  const removedBelow = [...indices].filter(i => i < target).length
  // FIX: Don't force items above a parent — just insert at the natural position
  const insertAt = Math.max(0, Math.min(target - removedBelow, localBlocks.value.length))

  localBlocks.value.splice(insertAt, 0, ...removed)
  localBlocks.value.forEach((b, i) => { b.order = (i + 1) * 1000 })

  // Detach blocks that landed outside their group
  detachDraggedBlocks(insertAt, removed.length, 0)

  // FIX: Enforce group integrity — if a block landed in the middle of a group, join it
  enforceGroupIntegrity()

  clearSelection()
  emit('reorder-blocks', {
    reordered: localBlocks.value.filter(b => b.id && !b.id.startsWith('temp_')).map(b => ({ blockId: b.id, order: b.order })),
    dayId: props.dayId
  })
}

const onDragEnd = () => { dragFromIdx.value = null; dropTargetIdx.value = null; boundaryDrop.value = null; dragIndices.value = new Set() }

const onBoundaryDragOver = (afterIdx, mode, e) => {
  e.preventDefault()
  e.stopPropagation()
  e.dataTransfer.dropEffect = 'move'
  // FIXED: clear regular drop target when boundary is active
  dropTargetIdx.value = null
  boundaryDrop.value = { afterIdx, mode }
}

const onBoundaryDrop = (afterIdx, mode) => {
  const indices = dragIndices.value
  dragFromIdx.value = null; dropTargetIdx.value = null; boundaryDrop.value = null; dragIndices.value = new Set()
  if (!indices.size) return

  pushUndo()

  let targetIdx = afterIdx
  let newParentId = null

  if (mode === 'inside') {
    const anchorBlock = localBlocks.value[afterIdx - 1]
    if (anchorBlock) {
      if (isHeading(anchorBlock.type)) {
        newParentId = anchorBlock.id
      } else {
        newParentId = anchorBlock.parentId ?? null
      }
    }
  } else if (mode === 'outside') {
    // FIX: "Outside" → place AFTER the outermost group, not forced before it
    const anchorBlock = localBlocks.value[afterIdx - 1]
    const nesting = headingNesting.value[anchorBlock?.id] || []
    if (nesting.length > 0) {
      const topHeadingId = nesting[0].headingId
      const topHeadingIdx = localBlocks.value.findIndex(b => b.id === topHeadingId)
      if (topHeadingIdx !== -1) {
        const descendants = getDescendantIndices(topHeadingId)
        targetIdx = descendants.length ? descendants[descendants.length - 1] + 1 : topHeadingIdx + 1
      }
    }
    newParentId = null
  }

  const sorted = [...indices].sort((a, b) => b - a)
  const removed = []
  for (const idx of sorted) {
    removed.unshift(...localBlocks.value.splice(idx, 1))
  }
  const removedBelow = [...indices].filter(i => i < targetIdx).length
  const insertAt = Math.max(0, Math.min(targetIdx - removedBelow, localBlocks.value.length))
  localBlocks.value.splice(insertAt, 0, ...removed)
  localBlocks.value.forEach((b, i) => { b.order = (i + 1) * 1000 })

  for (let i = insertAt; i < insertAt + removed.length && i < localBlocks.value.length; i++) {
    const b = localBlocks.value[i]
    if (!b) continue
    const oldParentId = b.parentId ?? null
    b.parentId = newParentId
    reparentChild(oldParentId, newParentId, b.id)
    const updates = { parentId: newParentId }
    if (isListType(b.type) && mode === 'outside') { b.indent = 0; updates.indent = 0 }
    if (b.id && !b.id.startsWith('temp_')) {
      emit('update-block', { blockId: b.id, updates, dayId: props.dayId })
    }
  }

  enforceGroupIntegrity()

  clearSelection()
  emit('reorder-blocks', {
    reordered: localBlocks.value.filter(b => b.id && !b.id.startsWith('temp_')).map(b => ({ blockId: b.id, order: b.order })),
    dayId: props.dayId
  })
}

// ─── Window resize → remeasure ───────────────────────────────────────────────
let resizeTimer = null
const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(measureAllLineTops, 150) }

// ─── Lifecycle ───────────────────────────────────────────────────────────────
onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('dragend', onDragEnd)
  window.addEventListener('resize', onResize)
  nextTick(() => {
    Object.values(blockRefs.value).forEach(el => { if (el) autoResize(el) })
    nextTick(measureAllLineTops)
  })
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('dragend', onDragEnd)
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.goblin-editor {
  min-height: 120px;
}

.block-row .drag-handle {
  margin-top: 4px;
  width: 16px;
}

.block-row {
  transition: opacity 0.15s ease, background-color 0.15s ease;
}

textarea {
  font-family: inherit;
}

.text-transparent {
  color: transparent;
}

.caret-transparent {
  caret-color: transparent;
}
</style>