<template>
  <div class="w-full">
    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 shadow-lg">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-white/90">Sequence — Daily</h2>
        <span class="text-xs px-2 py-1 rounded-md border border-zinc-700 text-zinc-300">{{ todayStr }}</span>
      </div>

      <div v-if="state.status !== 'won' && state.status !== 'lost'">
        <p class="text-zinc-300 mb-4">Fill in the next number:</p>
        <p class="text-3xl font-bold text-white mb-4 tracking-wide">{{ seq.join(', ') }}, ?</p>

        <form @submit.prevent="submitNext" class="flex items-center gap-2">
          <input v-model="guess" type="number"
            class="w-32 rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Next" />
          <button type="submit"
            class="rounded-md border border-violet-600/60 bg-violet-600/20 px-4 py-2 text-violet-200 hover:bg-violet-600/30 transition">
            Check
          </button>
        </form>

        <p v-if="feedback" class="mt-3 text-sm" :class="feedbackClass">{{ feedback }}</p>
        <p class="mt-2 text-xs text-zinc-400">Attempts: {{ attempts }} / {{ maxAttempts }}</p>
      </div>

      <div v-else class="text-center">
        <p v-if="state.status === 'won'" class="text-emerald-400 font-medium">Nice one! 🎉</p>
        <p v-else class="text-rose-400 font-medium">Nah — the answer was {{ answer }}.</p>
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

const gameId = 'sequence'
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
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0
  }
  return h
}

// Build a simple arithmetic sequence a, a+d, a+2d, a+3d  → user guesses next
function buildSequence(date) {
  const h = dayHash(date)
  const a = 1 + (h % 12)          // start 1..12
  const d = 1 + ((h >>> 5) % 9)   // diff 1..9
  const seq = [a, a + d, a + 2 * d, a + 3 * d]
  const answer = a + 4 * d
  return { seq, answer }
}

const todayStr = computed(() => store.today)
const state = computed(() => store.gameStateFor(gameId).value)
const seq = ref([])
const answer = ref(0)
const guess = ref('')
const attempts = ref(0)
const maxAttempts = 3
const feedback = ref('')
const feedbackClass = computed(() => feedback.value.includes('Correct') ? 'text-emerald-400' : 'text-amber-300')

function submitNext() {
  if (state.value.status === 'won' || state.value.status === 'lost') return
  attempts.value++
  const ok = String(answer.value) === String(guess.value).trim()
  if (ok) {
    feedback.value = 'Correct!'
    finish(true)
  } else {
    feedback.value = attempts.value >= maxAttempts ? 'Nope — last attempt used.' : 'Try again.'
    if (attempts.value >= maxAttempts) finish(false)
  }
}

function finish(success) {
  const dur = Date.now() - startedAt
  store.updateGameProgress(gameId, { status: success ? 'won' : 'lost' })
  store.recordResult(gameId, {
    success, attempts: attempts.value, guesses: [],
    metrics: { timeTakenMs: dur }
  })
}

function resetLocal() {
  attempts.value = 0
  guess.value = ''
  feedback.value = ''
  store.resetGameState(gameId)
}

let startedAt = Date.now()
onMounted(async () => {
  ensureStats()
  store.markOpenedToday(gameId)
  await store.fetchDayChallenge(gameId)
  const built = buildSequence(todayStr.value)
  seq.value = built.seq
  answer.value = built.answer
  startedAt = Date.now()
})
</script>
