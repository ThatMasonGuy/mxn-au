<template>
  <div class="w-full">
    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 shadow-lg">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-white/90">Math — Daily</h2>
        <span class="text-xs px-2 py-1 rounded-md border border-zinc-700 text-zinc-300">{{ todayStr }}</span>
      </div>

      <div v-if="state.status !== 'won' && state.status !== 'lost'">
        <p class="text-zinc-300 mb-4">Solve:</p>
        <p class="text-3xl font-bold text-white mb-4">{{ challenge.text }}</p>

        <form @submit.prevent="submitAnswer" class="flex items-center gap-2">
          <input v-model="answer" type="number"
            class="w-32 rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Your answer" />
          <button type="submit"
            class="rounded-md border border-violet-600/60 bg-violet-600/20 px-4 py-2 text-violet-200 hover:bg-violet-600/30 transition">
            Check
          </button>
        </form>

        <p v-if="feedback" class="mt-3 text-sm" :class="feedbackClass">{{ feedback }}</p>
        <p class="mt-2 text-xs text-zinc-400">Attempts: {{ attempts }} / {{ maxAttempts }}</p>
      </div>

      <div v-else class="text-center">
        <p v-if="state.status === 'won'" class="text-emerald-400 font-medium">Correct! 🎉</p>
        <p v-else class="text-rose-400 font-medium">Out of attempts. The answer was {{ challenge.solution }}.</p>
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

const gameId = 'math'
const store = useDailyStore()

// ensure stats entry exists (store only preloads 'word')
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
  // Pinia unwraps refs on stores; treat like a normal object here
  if (!store.localUserStats[gameId]) store.localUserStats[gameId] = base
}

// simple deterministic hash from date
function dayHash(s) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h >>> 0
}

function buildChallenge(date) {
  const h = dayHash(date)
  const op = h % 3 // 0 +, 1 -, 2 *
  let a = 10 + (h % 40)
  let b = 10 + ((h >>> 7) % 40)
  let text = ''
  let solution = 0

  if (op === 0) { // addition
    text = `${a} + ${b}`
    solution = a + b
  } else if (op === 1) { // subtraction (non-negative)
    if (b > a) [a, b] = [b, a]
    text = `${a} - ${b}`
    solution = a - b
  } else { // multiplication (smaller nums)
    a = 2 + (h % 9)     // 2..10
    b = 2 + ((h >>> 7) % 9)
    text = `${a} × ${b}`
    solution = a * b
  }
  return { text, solution }
}

const todayStr = computed(() => store.today)
const state = computed(() => store.gameStateFor(gameId).value)
const challenge = ref({ text: '', solution: 0 })
const answer = ref('')
const attempts = ref(0)
const maxAttempts = 3
const feedback = ref('')

const feedbackClass = computed(() => {
  return feedback.value.includes('Correct') ? 'text-emerald-400' : 'text-amber-300'
})

function finish(success) {
  const dur = Date.now() - startedAt
  store.updateGameProgress(gameId, { status: success ? 'won' : 'lost' })
  store.recordResult(gameId, {
    success, attempts: attempts.value, guesses: [],
    metrics: { timeTakenMs: dur }
  })
}

function submitAnswer() {
  if (state.value.status === 'won' || state.value.status === 'lost') return
  attempts.value++
  const isRight = String(challenge.value.solution) === String(answer.value).trim()
  if (isRight) {
    feedback.value = 'Correct!'
    finish(true)
  } else {
    feedback.value = attempts.value >= maxAttempts ? 'Nope — that was your last attempt.' : 'Try again.'
    if (attempts.value >= maxAttempts) {
      finish(false)
    }
  }
}

function resetLocal() {
  attempts.value = 0
  answer.value = ''
  feedback.value = ''
  store.resetGameState(gameId)
}

let startedAt = Date.now()
onMounted(async () => {
  ensureStats()
  store.markOpenedToday(gameId)
  await store.fetchDayChallenge(gameId) // optional; we still build a local fallback
  challenge.value = buildChallenge(todayStr.value)
  startedAt = Date.now()
})
</script>
