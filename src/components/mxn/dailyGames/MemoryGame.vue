<template>
  <div class="w-full">
    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 shadow-lg">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-white/90">Memory — Daily</h2>
        <span class="text-xs px-2 py-1 rounded-md border border-zinc-700 text-zinc-300">{{ todayStr }}</span>
      </div>

      <div v-if="state.status !== 'won'">
        <p class="text-zinc-300 mb-4">Match all pairs. Moves: {{ moves }}</p>
        <div class="grid grid-cols-4 gap-2 max-w-sm">
          <button v-for="(card, idx) in cards" :key="idx" @click="flip(idx)"
            class="aspect-square rounded-md border border-zinc-700 flex items-center justify-center text-2xl font-bold transition"
            :class="card.matched ? 'bg-emerald-700/30 text-emerald-200' : (card.revealed ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-800 hover:bg-zinc-700')">
            <span>{{ card.revealed || card.matched ? card.face : '•' }}</span>
          </button>
        </div>
      </div>

      <div v-else class="text-center">
        <p class="text-emerald-400 font-medium">All matched in {{ moves }} moves! 🎉</p>
        <button class="mt-4 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-200 hover:bg-zinc-700"
          @click="resetLocal">
          Reset (Local)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDailyStore } from '@/stores/useDailyStore'

const gameId = 'memory'
const store = useDailyStore()

function ensureStats() {
  const base = {
    currentWinStreak: 0,
    maxWinStreak: 0,
    daysPlayed: 0,
    totalGames: 0,
    lastPlayedDate: null,
    lastWinDate: null,
    attemptsHistogram: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, 'fail': 0 }
  }
  if (!store.localUserStats[gameId]) store.localUserStats[gameId] = base
}

function dayHash(s) {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}

function shuffleDeterministic(arr, seed) {
  let a = arr.slice()
  let s = seed >>> 0
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0
    const j = s % (i + 1)
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const faces = ['🍎', '🍌', '🍇', '🍓'] // 4 pairs → 8 cards
const todayStr = computed(() => store.today)
const state = computed(() => store.gameStateFor(gameId).value)
const cards = ref([])
const openIndex = ref(null)
const moves = ref(0)
let busy = false

function buildDeck(date) {
  const seed = dayHash(date)
  const base = faces.slice(0, 4)
  const deck = shuffleDeterministic(base.concat(base), seed).map(f => ({ face: f, revealed: false, matched: false }))
  return deck
}

function flip(idx) {
  if (busy) return
  const c = cards.value[idx]
  if (c.matched || c.revealed || state.value.status === 'won') return

  c.revealed = true
  if (openIndex.value === null) {
    openIndex.value = idx
  } else {
    moves.value++
    const prev = cards.value[openIndex.value]
    if (prev.face === c.face) {
      // match
      prev.matched = true
      c.matched = true
      openIndex.value = null
      // check win
      if (cards.value.every(x => x.matched)) {
        finish(true)
      }
    } else {
      // hide both after a short delay
      busy = true
      setTimeout(() => {
        prev.revealed = false
        c.revealed = false
        openIndex.value = null
        busy = false
      }, 600)
    }
  }
}

function finish(success) {
  store.updateGameProgress(gameId, { status: success ? 'won' : 'lost' })
  store.recordResult(gameId, {
    success, attempts: moves.value, guesses: [],
    metrics: { pairs: faces.length }
  })
}

function resetLocal() {
  moves.value = 0
  openIndex.value = null
  cards.value = buildDeck(todayStr.value)
  store.resetGameState(gameId)
}

onMounted(async () => {
  ensureStats()
  store.markOpenedToday(gameId)
  await store.fetchDayChallenge(gameId)
  cards.value = buildDeck(todayStr.value)
})
</script>
