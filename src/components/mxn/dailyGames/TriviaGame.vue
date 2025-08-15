<template>
  <div class="w-full">
    <div class="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 shadow-lg">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-white/90">Trivia — Daily</h2>
        <span class="text-xs px-2 py-1 rounded-md border border-zinc-700 text-zinc-300">{{ todayStr }}</span>
      </div>

      <div v-if="state.status !== 'won' && state.status !== 'lost'">
        <p class="text-zinc-200 text-base mb-4">{{ q.question }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button v-for="(opt, i) in q.options" :key="i" @click="choose(i)"
            class="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-left text-zinc-200 hover:bg-zinc-700 transition">
            {{ String.fromCharCode(65 + i) }}. {{ opt }}
          </button>
        </div>
        <p v-if="feedback" class="mt-3 text-sm" :class="feedbackClass">{{ feedback }}</p>
      </div>

      <div v-else class="text-center">
        <p v-if="state.status === 'won'" class="text-emerald-400 font-medium">Nice! You got it. 🎉</p>
        <p v-else class="text-rose-400 font-medium">Unlucky — correct answer was “{{ q.options[q.answerIndex] }}”.</p>
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

const gameId = 'trivia'
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
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i)
  return h >>> 0
}

const bank = [
  { q: 'What planet is known as the Red Planet?', opts: ['Mars', 'Venus', 'Jupiter', 'Mercury'], a: 0 },
  { q: 'Who wrote “1984”?', opts: ['George Orwell', 'Aldous Huxley', 'J.K. Rowling', 'Mark Twain'], a: 0 },
  { q: 'The chemical symbol for Gold is…', opts: ['Ag', 'Au', 'Gd', 'Go'], a: 1 },
  { q: 'What is the largest ocean on Earth?', opts: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], a: 2 },
  { q: 'How many bits are in a byte?', opts: ['4', '8', '16', '32'], a: 1 },
  { q: 'What language runs in a web browser?', opts: ['C#', 'Python', 'JavaScript', 'Go'], a: 2 },
  { q: 'Australia’s capital city is…', opts: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], a: 2 },
  { q: 'HTTP status 404 means…', opts: ['OK', 'Forbidden', 'Not Found', 'Server Error'], a: 2 },
]

function buildQuestion(date) {
  const idx = dayHash(date) % bank.length
  const item = bank[idx]
  return {
    question: item.q,
    options: item.opts,
    answerIndex: item.a
  }
}

const todayStr = computed(() => store.today)
const state = computed(() => store.gameStateFor(gameId).value)
const q = ref({ question: '', options: [], answerIndex: 0 })
const feedback = ref('')
const attempts = ref(0)

const feedbackClass = computed(() => feedback.value.includes('Correct') ? 'text-emerald-400' : 'text-amber-300')

function choose(i) {
  if (state.value.status === 'won' || state.value.status === 'lost') return
  attempts.value++
  const ok = i === q.value.answerIndex
  if (ok) {
    feedback.value = 'Correct!'
    finish(true)
  } else {
    feedback.value = 'Nope — try again.'
    // give only 2 attempts: first wrong then reveal
    if (attempts.value >= 2) finish(false)
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
  feedback.value = ''
  store.resetGameState(gameId)
}

let startedAt = Date.now()
onMounted(async () => {
  ensureStats()
  store.markOpenedToday(gameId)
  await store.fetchDayChallenge(gameId)
  q.value = buildQuestion(todayStr.value)
  startedAt = Date.now()
})
</script>
