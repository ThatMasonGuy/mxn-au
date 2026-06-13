<template>
  <Teleport to="body">
    <transition name="cp-fade">
      <div v-if="open" class="cp-overlay" @click.self="close">
        <div class="cp-panel">
          <!-- Search -->
          <div class="cp-search">
            <MagnifyingGlassIcon class="w-5 h-5 text-gray-500 flex-shrink-0" />
            <input ref="inputRef" v-model="query" type="text" class="cp-input"
              placeholder="Run a command, alias or action…" @keydown.down.prevent="move(1)"
              @keydown.up.prevent="move(-1)" @keydown.enter.prevent="choose" @keydown.esc="close" />
            <span class="cp-esc">esc</span>
          </div>

          <!-- Results -->
          <div ref="listRef" class="cp-results">
            <template v-for="group in grouped" :key="group.name">
              <div class="cp-group">{{ group.name }}</div>
              <button v-for="item in group.items" :key="item.id" class="cp-item"
                :class="{ active: item._idx === active }" :data-idx="item._idx" @click="select(item)"
                @mousemove="active = item._idx">
                <component :is="item.icon" class="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span class="cp-label">{{ item.label }}</span>
                <span v-if="item.hint" class="cp-itemhint">{{ item.hint }}</span>
              </button>
            </template>

            <div v-if="flat.length === 0" class="cp-empty">
              <span v-if="query.trim()">Press Enter to run “{{ query.trim() }}”</span>
              <span v-else>No commands</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  open: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:open', 'select', 'raw'])

const query = ref('')
const active = ref(0)
const inputRef = ref(null)
const listRef = ref(null)

// Flat, filtered list with a stable display index for keyboard nav
const flat = computed(() => {
  const q = query.value.trim().toLowerCase()
  const matched = q
    ? props.items.filter(i =>
      i.label.toLowerCase().includes(q) ||
      (i.hint || '').toLowerCase().includes(q) ||
      (i.group || '').toLowerCase().includes(q))
    : props.items
  return matched.map((i, idx) => ({ ...i, _idx: idx }))
})

// Grouped for display, preserving first-seen group order
const grouped = computed(() => {
  const groups = []
  const byName = {}
  for (const item of flat.value) {
    const name = item.group || 'Actions'
    if (!byName[name]) {
      byName[name] = { name, items: [] }
      groups.push(byName[name])
    }
    byName[name].items.push(item)
  }
  return groups
})

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    query.value = ''
    active.value = 0
    nextTick(() => inputRef.value?.focus())
  }
})

watch(flat, () => {
  if (active.value > flat.value.length - 1) active.value = Math.max(0, flat.value.length - 1)
})

const move = (dir) => {
  if (flat.value.length === 0) return
  active.value = (active.value + dir + flat.value.length) % flat.value.length
  nextTick(() => {
    listRef.value?.querySelector(`[data-idx="${active.value}"]`)?.scrollIntoView({ block: 'nearest' })
  })
}

const choose = () => {
  const item = flat.value[active.value]
  if (item) {
    select(item)
  } else if (query.value.trim()) {
    // Free-form: run whatever was typed
    emit('raw', query.value.trim())
    close()
  }
}

const select = (item) => {
  emit('select', item)
  close()
}

const close = () => emit('update:open', false)
</script>

<style scoped>
.cp-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
  z-index: 60;
}

.cp-panel {
  width: 600px;
  max-width: 92vw;
  background: #161b22;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.55);
}

.cp-search {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.cp-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #e5e7eb;
  font-size: 0.95rem;
  font-family: monospace;
}

.cp-esc {
  font-family: monospace;
  font-size: 0.7rem;
  color: #6e7681;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 2px 6px;
}

.cp-results {
  max-height: 50vh;
  overflow-y: auto;
  padding: 8px;
}

.cp-group {
  font-family: monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6e7681;
  padding: 10px 10px 6px;
}

.cp-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 9px 12px;
  border-radius: 6px;
  text-align: left;
  transition: background 0.12s;
}

.cp-item.active {
  background: rgba(63, 185, 80, 0.12);
}

.cp-label {
  font-size: 0.875rem;
  color: #e5e7eb;
  flex-shrink: 0;
}

.cp-itemhint {
  font-family: monospace;
  font-size: 0.75rem;
  color: #6e7681;
  margin-left: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cp-empty {
  text-align: center;
  color: #6e7681;
  font-size: 0.85rem;
  padding: 28px 12px;
}

.cp-fade-enter-active,
.cp-fade-leave-active {
  transition: opacity 0.18s ease;
}

.cp-fade-enter-from,
.cp-fade-leave-to {
  opacity: 0;
}
</style>
