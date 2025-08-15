<template>
  <div class="min-h-screen w-full relative overflow-hidden">
    <!-- Enhanced Background -->
    <div class="fixed inset-0 bg-gradient-to-br from-slate-950 via-zinc-950 to-slate-900"></div>
    <div class="fixed inset-0 bg-gradient-to-tr from-violet-950/20 via-transparent to-fuchsia-950/20"></div>
    <div
      class="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent">
    </div>

    <!-- Animated background elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-600/5 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 2s;"></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-violet-600/3 to-fuchsia-600/3 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 4s;"></div>
    </div>

    <!-- Noise texture overlay -->
    <div class="fixed inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-noise"></div>

    <!-- Content -->
    <div class="relative z-10 text-zinc-100">
      <!-- Header -->
      <header
        class="sticky top-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl shadow-xl shadow-black/20">
        <div class="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 ring-1 ring-violet-500/40 shadow-lg shadow-violet-500/20">
              <Trophy class="h-5 w-5 text-violet-200" />
            </div>
            <div>
              <h1
                class="text-xl font-bold leading-none bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                MXN Daily
              </h1>
              <p class="text-xs text-zinc-400 mt-0.5">New challenges at 00:00 UTC</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button v-if="openGame" @click="closeGame"
              class="px-3 py-1.5 text-xs rounded-lg bg-zinc-900/70 border border-zinc-700/50 hover:bg-zinc-800/70 transition-all duration-200 hover:shadow-lg shadow-black/20">
              ← Back to Games
            </button>

            <!-- Enhanced countdown pill -->
            <div
              class="p-[1px] rounded-xl bg-gradient-to-r from-violet-500/50 via-fuchsia-500/40 to-violet-500/50 shadow-lg shadow-violet-500/20">
              <div
                class="px-3 py-1.5 rounded-[11px] bg-zinc-950/90 border border-white/10 flex items-center gap-2 backdrop-blur-sm">
                <Clock class="w-3.5 h-3.5 text-zinc-400" />
                <span class="text-zinc-400 text-[11px] leading-none hidden sm:inline">Next in</span>
                <span class="font-mono text-sm font-semibold tracking-wider tabular-nums text-violet-300"
                  :key="countdownKey">
                  {{ countdown }}
                </span>
              </div>
            </div>

            <div v-if="profile?.totalPlays" class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
              <span class="text-xs text-zinc-400">Streak: {{ profile?.currentStreak ?? 0 }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main -->
      <main class="mx-auto max-w-7xl px-4 py-8">
        <!-- Game Actions Bar (shows when game is open) -->
        <div v-if="openGame" class="mb-6 mx-auto max-w-5xl flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">{{ currentGameData?.name }}</h2>
            <p class="text-sm text-zinc-400 mt-1">{{ currentGameData?.description }}</p>
          </div>
          <div class="flex items-center gap-3">
            <!-- Share button for Wordle -->
            <button v-if="openGame === 'wordle'" type="button"
              class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-medium ring-1 ring-violet-500/40 hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-200 shadow-lg shadow-violet-500/20"
              @click="onShare" :disabled="shareBusy || (wordleStore?.rows?.length === 0)"
              :aria-disabled="shareBusy || (wordleStore?.rows?.length === 0)">
              <Share2 class="h-4 w-4" />
              <span>{{ shareBusy ? 'Copying…' : 'Share' }}</span>
            </button>

            <!-- Dev reset for Wordle -->
            <button v-if="showDevReset && openGame === 'wordle'" type="button"
              class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-700 to-rose-600 px-4 py-2 text-sm font-semibold ring-1 ring-rose-500/40 hover:from-rose-600 hover:to-rose-500 transition-all duration-200 shadow-lg shadow-rose-500/20"
              @click="devReset" title="Dev: clear local Wordle state">
              <Trash2 class="h-4 w-4" />
              <span>Dev Reset</span>
            </button>

            <span v-if="copyMsg" class="text-xs text-emerald-400">{{ copyMsg }}</span>
          </div>
        </div>

        <!-- Games grid -->
        <div v-if="!openGame" class="space-y-8 transition-all duration-300">
          <div class="text-center space-y-4 py-8">
            <h2 class="text-4xl md:text-5xl font-bold">
              <span
                class="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent animate-gradient">
                Daily Brain Games
              </span>
            </h2>
            <p class="text-zinc-400 text-lg max-w-2xl mx-auto">
              Challenge yourself with {{ games.length }} unique puzzles every day. Track your streaks, compete with
              friends, and sharpen your mind.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="game in games" :key="game.id" @click="selectGame(game.id)" :class="getCardClasses(game)"
              class="group relative overflow-hidden rounded-2xl border backdrop-blur-sm cursor-pointer transition-all duration-300">

              <!-- Enhanced glass effect -->
              <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>

              <!-- status badge -->
              <div class="absolute top-4 right-4 z-10">
                <div v-if="getGameStatus(game.id) === 'won'" class="p-[1px] rounded-full inline-flex"
                  :class="pillGradient('emerald')" @click.stop>
                  <div
                    class="px-2 py-1 rounded-full bg-zinc-950/90 border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
                    <CheckCircle2 class="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
                    <span class="text-[10px] font-medium text-emerald-300 leading-none">Completed</span>
                  </div>
                </div>
                <div v-else-if="getGameStatus(game.id) === 'lost'" class="p-[1px] rounded-full inline-flex"
                  :class="pillGradient('rose')" @click.stop>
                  <div
                    class="px-2 py-1 rounded-full bg-zinc-950/90 border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
                    <Ban class="w-3.5 h-3.5 text-rose-300 flex-shrink-0" />
                    <span class="text-[10px] font-medium text-rose-300 leading-none">Attempted</span>
                  </div>
                </div>
                <div v-else-if="getGameStatus(game.id) === 'in-progress'" class="p-[1px] rounded-full inline-flex"
                  :class="pillGradient('amber')" @click.stop>
                  <div
                    class="px-2 py-1 rounded-full bg-zinc-950/90 border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
                    <Clock3 class="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                    <span class="text-[10px] font-medium text-amber-300 leading-none">In Progress</span>
                  </div>
                </div>
                <div v-else-if="game.comingSoon" class="p-[1px] rounded-full inline-flex" :class="pillGradient('zinc')"
                  @click.stop>
                  <div
                    class="px-2 py-1 rounded-full bg-zinc-950/90 border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
                    <Clock class="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
                    <span class="text-[10px] font-medium text-zinc-300 leading-none">Coming Soon</span>
                  </div>
                </div>
                <div v-else class="p-[1px] rounded-full inline-flex" :class="pillGradient('zinc')" @click.stop>
                  <div
                    class="px-2 py-1 rounded-full bg-zinc-950/90 border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
                    <Circle class="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
                    <span class="text-[10px] font-medium text-zinc-300 leading-none">Not Started</span>
                  </div>
                </div>
              </div>

              <!-- hover gradient -->
              <div
                class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                :class="game.gradient"></div>

              <div class="relative p-6 space-y-4">
                <div class="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg" :class="game.iconBg">
                  <component :is="game.icon" class="w-7 h-7" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">{{ game.name }}
                  </h3>
                  <p class="text-sm text-zinc-400 mt-1">{{ game.description }}</p>
                </div>
                <div class="flex items-center gap-4 pt-2">
                  <div class="flex items-center gap-1.5">
                    <Flame class="w-4 h-4 text-violet-300" />
                    <span class="text-xs text-zinc-300">{{ getStreak(game.id) }} streak</span>
                  </div>
                </div>
                <div class="pt-2">
                  <div
                    class="w-full py-2.5 rounded-xl bg-gradient-to-r text-center font-semibold text-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/20"
                    :class="buttonGradient(game.id)">
                    {{ ctaText(game.id) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced daily stats overview -->
          <div
            class="mt-12 rounded-2xl border border-zinc-700/80 bg-gradient-to-br from-zinc-800/60 to-zinc-900/40 backdrop-blur-sm p-6 shadow-2xl shadow-black/20">
            <div class="absolute inset-0 bg-gradient-to-br from-white/6 to-transparent rounded-2xl"></div>
            <div class="relative">
              <h3 class="text-lg font-bold mb-4">Today's Progress</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  class="rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-600/50 p-4 backdrop-blur-sm shadow-lg shadow-violet-500/10">
                  <div class="text-2xl font-bold text-violet-300">{{ completedToday }}/{{ games.length }}</div>
                  <div class="text-xs text-slate-300/70 mt-1">Games Completed</div>
                </div>
                <div
                  class="rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-600/50 p-4 backdrop-blur-sm shadow-lg shadow-fuchsia-500/10">
                  <div class="text-2xl font-bold text-fuchsia-300">{{ totalStreak }}</div>
                  <div class="text-xs text-slate-300/70 mt-1">Combined Streak</div>
                </div>
                <div
                  class="rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-600/50 p-4 backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                  <div class="text-2xl font-bold text-emerald-300">{{ totalDaysPlayed }}</div>
                  <div class="text-xs text-slate-300/70 mt-1">Total Days Played</div>
                </div>
                <div
                  class="rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-600/50 p-4 backdrop-blur-sm shadow-lg shadow-amber-500/10">
                  <div class="text-2xl font-bold text-amber-300">{{ avgWinRate }}%</div>
                  <div class="text-xs text-slate-300/70 mt-1">Avg. Win Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Game view -->
        <div v-if="openGame" class="max-w-5xl mx-auto transition-all duration-300">
          <div
            class="rounded-2xl border border-zinc-700/80 bg-gradient-to-br from-zinc-800/60 to-zinc-900/40 backdrop-blur-sm p-6 shadow-2xl shadow-black/20">
            <div class="absolute inset-0 bg-gradient-to-br from-white/6 to-transparent rounded-2xl"></div>
            <div class="relative">
              <!-- Wordle specific content -->
              <div v-if="openGame === 'wordle' && !loadingGame">
                <div v-if="wordleStore.loading" class="text-center py-12 text-zinc-400">
                  <div class="animate-pulse">Loading Wordle...</div>
                </div>
                <div v-else>
                  <WordleBoard />
                  <!-- Footer stats for Wordle -->
                  <div class="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div
                      class="rounded-xl bg-gradient-to-br from-emerald-950/60 to-emerald-900/40 border border-emerald-700/50 p-4 backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                      <div class="text-xs text-emerald-200/70 uppercase tracking-wide">Plays</div>
                      <div class="mt-1 text-lg font-semibold tabular-nums text-emerald-300">{{ profile?.totalPlays ??
                        0 }}</div>
                    </div>
                    <div
                      class="rounded-xl bg-gradient-to-br from-emerald-950/60 to-emerald-900/40 border border-emerald-700/50 p-4 backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                      <div class="text-xs text-emerald-200/70 uppercase tracking-wide">Wins</div>
                      <div class="mt-1 text-lg font-semibold tabular-nums text-emerald-300">{{ profile?.wins ?? 0 }}
                      </div>
                    </div>
                    <div
                      class="rounded-xl bg-gradient-to-br from-emerald-950/60 to-emerald-900/40 border border-emerald-700/50 p-4 backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                      <div class="text-xs text-emerald-200/70 uppercase tracking-wide">Losses</div>
                      <div class="mt-1 text-lg font-semibold tabular-nums text-emerald-300">{{ profile?.losses ?? 0 }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Other games -->
              <component v-else-if="currentGameComponent && !loadingGame" :is="currentGameComponent" :game-id="openGame"
                :playable="true" @completed="onGameCompleted" />

              <div v-else class="text-center py-12 text-zinc-400">
                <div class="animate-pulse">Loading game...</div>
              </div>
            </div>
          </div>

          <!-- Per-game stats (for non-wordle games) -->
          <div v-if="openGame !== 'wordle' && statsFor(openGame)" class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              :class="[getGameStatsClasses(openGame).bg, getGameStatsClasses(openGame).border, getGameStatsClasses(openGame).shadow]"
              class="rounded-xl backdrop-blur-sm p-4 shadow-lg">
              <div :class="getGameStatsClasses(openGame).label" class="text-xs uppercase tracking-wide">Current Streak
              </div>
              <div :class="getGameStatsClasses(openGame).text" class="text-2xl font-bold mt-1">{{
                statsFor(openGame).currentStreak }}</div>
            </div>
            <div
              :class="[getGameStatsClasses(openGame).bg, getGameStatsClasses(openGame).border, getGameStatsClasses(openGame).shadow]"
              class="rounded-xl backdrop-blur-sm p-4 shadow-lg">
              <div :class="getGameStatsClasses(openGame).label" class="text-xs uppercase tracking-wide">Best Streak
              </div>
              <div :class="getGameStatsClasses(openGame).text" class="text-2xl font-bold mt-1">{{
                statsFor(openGame).maxStreak }}</div>
            </div>
            <div
              :class="[getGameStatsClasses(openGame).bg, getGameStatsClasses(openGame).border, getGameStatsClasses(openGame).shadow]"
              class="rounded-xl backdrop-blur-sm p-4 shadow-lg">
              <div :class="getGameStatsClasses(openGame).label" class="text-xs uppercase tracking-wide">Times Played
              </div>
              <div :class="getGameStatsClasses(openGame).text" class="text-2xl font-bold mt-1">{{
                statsFor(openGame).gamesPlayed }}</div>
            </div>
            <div
              :class="[getGameStatsClasses(openGame).bg, getGameStatsClasses(openGame).border, getGameStatsClasses(openGame).shadow]"
              class="rounded-xl backdrop-blur-sm p-4 shadow-lg">
              <div :class="getGameStatsClasses(openGame).label" class="text-xs uppercase tracking-wide">Win Rate</div>
              <div :class="getGameStatsClasses(openGame).text" class="text-2xl font-bold mt-1">{{
                statsFor(openGame).winPercentage }}%</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent, shallowRef } from 'vue'
import { useWordleStore } from '@/stores/dailyGames/useWordleStore'
import { useDailyStore } from '@/stores/useDailyStore'
import WordleBoard from '@/components/mxn/dailyGames/WordleBoard.vue'
import {
  Trophy, User, Clock, Share2, Trash2, CheckCircle2, Ban, Clock3, Circle, Flame,
  Type, Link as LinkIcon, Flag, HelpCircle, ListOrdered, Brain
} from 'lucide-vue-next'

/* stores */
const wordleStore = useWordleStore()
const dailyStore = useDailyStore()

/* Wordle specific state */
const shareBusy = ref(false)
const copyMsg = ref('')
const profile = computed(() => dailyStore.wordleStats)

// show the Dev Reset only in dev OR with ?dev
const showDevReset = computed(() => {
  try { if (import.meta.env.DEV) return true; } catch { }
  return new URLSearchParams(location.search).has('dev');
})

// DEV reset (local only)
async function devReset() {
  try {
    localStorage.removeItem('mxn:daily:wordle')
    wordleStore.hardResetLocal?.()
    copyMsg.value = 'Local state cleared'
    setTimeout(() => location.reload(), 350)
  } catch { /* ignore */ }
}

// Countdown (UTC)
const countdown = ref('00:00:00')
const countdownKey = ref(0)
let timer = null
function tick() {
  try {
    const iso = dailyStore.rolloverAt || wordleStore.rolloverAt
    if (!iso) { countdown.value = '—'; return; }
    const ms = Date.parse(iso) - Date.now()
    if (isNaN(ms) || ms <= 0) {
      countdown.value = '00:00:00'
      dailyStore.checkRollover()
      wordleStore.refreshIfRolledOver?.()
      return
    }
    const total = Math.floor(ms / 1000)
    const h = String(Math.floor(total / 3600)).padStart(2, '0')
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
    const s = String(total % 60).padStart(2, '0')
    countdown.value = `${h}:${m}:${s}`
    countdownKey.value++
  } catch (error) {
    console.warn('Error in countdown tick:', error)
    countdown.value = '—'
  }
}

// Share
async function onShare() {
  try {
    shareBusy.value = true; copyMsg.value = ''
    const text = wordleStore.shareText?.() || 'Wordle completed!'

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      copyMsg.value = 'Copied!'
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      copyMsg.value = 'Copied!'
    }
  } catch (error) {
    console.warn('Error sharing:', error)
    copyMsg.value = 'Share failed'
  } finally {
    shareBusy.value = false
    setTimeout(() => (copyMsg.value = ''), 1800)
  }
}

/* Components by id */
const gameComponents = {
  connections: defineAsyncComponent(() => import('@/components/mxn/dailyGames/ConnectionsGame.vue')),
  flag: defineAsyncComponent(() => import('@/components/mxn/dailyGames/FlagGame.vue')),
  trivia: defineAsyncComponent(() => import('@/components/mxn/dailyGames/TriviaGame.vue')),
  sequence: defineAsyncComponent(() => import('@/components/mxn/dailyGames/SequenceGame.vue')),
  memory: defineAsyncComponent(() => import('@/components/mxn/dailyGames/MemoryGame.vue')),
}

/* Game list */
const games = ref([
  {
    id: 'wordle', name: 'Wordle', description: 'Guess the 5-letter word in 6 tries', icon: Type,
    iconBg: 'bg-gradient-to-br from-emerald-600/20 to-emerald-500/20 ring-1 ring-emerald-500/30',
    gradient: 'from-emerald-600/10 to-transparent'
  },
  {
    id: 'connections', name: 'Connections', description: 'Find groups of 4 related words', icon: LinkIcon,
    iconBg: 'bg-gradient-to-br from-violet-600/20 to-violet-500/20 ring-1 ring-violet-500/30',
    gradient: 'from-violet-600/10 to-transparent',
    comingSoon: true
  },
  {
    id: 'flag', name: 'Flag Quest', description: 'Identify countries by their flags', icon: Flag,
    iconBg: 'bg-gradient-to-br from-blue-600/20 to-blue-500/20 ring-1 ring-blue-500/30',
    gradient: 'from-blue-600/10 to-transparent',
    comingSoon: true
  },
  {
    id: 'trivia', name: 'Quick Quiz', description: 'Test your general knowledge', icon: HelpCircle,
    iconBg: 'bg-gradient-to-br from-fuchsia-600/20 to-fuchsia-500/20 ring-1 ring-fuchsia-500/30',
    gradient: 'from-fuchsia-600/10 to-transparent',
    comingSoon: true
  },
  {
    id: 'sequence', name: 'Pattern Pro', description: 'Complete the sequence', icon: ListOrdered,
    iconBg: 'bg-gradient-to-br from-amber-600/20 to-amber-500/20 ring-1 ring-amber-500/30',
    gradient: 'from-amber-600/10 to-transparent',
    comingSoon: true
  },
  {
    id: 'memory', name: 'Memory Match', description: 'Remember and match pairs', icon: Brain,
    iconBg: 'bg-gradient-to-br from-rose-600/20 to-rose-500/20 ring-1 ring-rose-500/30',
    gradient: 'from-rose-600/10 to-transparent',
    comingSoon: true
  },
])

const openGame = ref(null)
const currentGameComponent = shallowRef(null)
const currentGameData = computed(() => games.value.find(g => g.id === openGame.value))
const loadingGame = ref(false)

async function selectGame(gameId) {
  const game = games.value.find(g => g.id === gameId)
  if (game?.comingSoon) return

  const url = new URL(window.location)
  url.searchParams.set('game', gameId)
  window.history.replaceState({}, '', url)

  loadingGame.value = true
  openGame.value = gameId

  try {
    if (gameId === 'wordle') {
      if (!wordleStore.puzzleId) {
        await wordleStore.loadDaily(true)
      }
    } else {
      currentGameComponent.value = gameComponents[gameId] || null
    }
  } catch (error) {
    console.error('Error loading game:', error)
  } finally {
    loadingGame.value = false
  }
}

function closeGame() {
  const url = new URL(window.location)
  url.searchParams.delete('game')
  window.history.replaceState({}, '', url)

  openGame.value = null
  currentGameComponent.value = null
}

/* Game status helpers */
function getGameStatus(gameId) {
  if (gameId === 'wordle') {
    return wordleStore.status || dailyStore.getGameStatus(gameId)
  }
  return dailyStore.getGameStatus(gameId)
}

function getStreak(gameId) {
  const stats = dailyStore.getStatsFor(gameId)
  return stats?.currentStreak ?? 0
}

function ctaText(gameId) {
  const game = games.value.find(g => g.id === gameId)
  if (game?.comingSoon) return 'Coming Soon'

  const status = getGameStatus(gameId)
  switch (status) {
    case 'won': return 'Completed ✓'
    case 'lost': return 'Try Again Tomorrow'
    case 'in-progress': return 'Continue Playing'
    default: return 'Play Now'
  }
}

function buttonGradient(gameId) {
  const game = games.value.find(g => g.id === gameId)
  if (game?.comingSoon) return 'from-zinc-700 to-zinc-800 text-zinc-400'

  const status = getGameStatus(gameId)
  switch (status) {
    case 'won': return 'from-emerald-600 to-emerald-700 text-white shadow-emerald-500/20'
    case 'lost': return 'from-rose-600 to-rose-700 text-white shadow-rose-500/20'
    default: return 'from-violet-600 to-fuchsia-600 text-white shadow-violet-500/20'
  }
}

function statsFor(gameId) {
  return dailyStore.getStatsFor(gameId)
}

/* Computed stats */
const completedToday = computed(() => dailyStore.totalCompletedToday)
const totalStreak = computed(() => dailyStore.totalStreakSum)
const totalDaysPlayed = computed(() => dailyStore.totalDaysPlayed)
const avgWinRate = computed(() => dailyStore.averageWinRate)

/* pill gradient helper */
function pillGradient(kind) {
  switch (kind) {
    case 'emerald': return 'bg-gradient-to-r from-emerald-500/50 via-emerald-400/40 to-emerald-500/50 shadow-lg shadow-emerald-500/25'
    case 'rose': return 'bg-gradient-to-r from-rose-500/50 via-rose-400/40 to-rose-500/50 shadow-lg shadow-rose-500/25'
    case 'amber': return 'bg-gradient-to-r from-amber-500/50 via-amber-400/40 to-amber-500/50 shadow-lg shadow-amber-500/25'
    case 'zinc': return 'bg-gradient-to-r from-zinc-600/40 via-zinc-500/30 to-zinc-600/40'
    default: return 'bg-gradient-to-r from-violet-500/50 via-fuchsia-500/40 to-violet-500/50 shadow-lg shadow-violet-500/25'
  }
}

function onGameCompleted(result) {
  console.log('Game completed:', result)
}

function getGameStatsClasses(gameId) {
  switch (gameId) {
    case 'wordle':
      return {
        bg: 'bg-gradient-to-br from-emerald-950/60 to-emerald-900/40',
        border: 'border-emerald-700/50',
        shadow: 'shadow-emerald-500/10',
        text: 'text-emerald-300',
        label: 'text-emerald-200/70'
      }
    case 'connections':
      return {
        bg: 'bg-gradient-to-br from-slate-800/80 to-slate-900/60',
        border: 'border-slate-600/50',
        shadow: 'shadow-violet-500/10',
        text: 'text-violet-300',
        label: 'text-slate-300/70'
      }
    case 'flag':
      return {
        bg: 'bg-gradient-to-br from-slate-800/80 to-slate-900/60',
        border: 'border-slate-600/50',
        shadow: 'shadow-blue-500/10',
        text: 'text-blue-300',
        label: 'text-slate-300/70'
      }
    case 'trivia':
      return {
        bg: 'bg-gradient-to-br from-slate-800/80 to-slate-900/60',
        border: 'border-slate-600/50',
        shadow: 'shadow-fuchsia-500/10',
        text: 'text-fuchsia-300',
        label: 'text-slate-300/70'
      }
    case 'sequence':
      return {
        bg: 'bg-gradient-to-br from-slate-800/80 to-slate-900/60',
        border: 'border-slate-600/50',
        shadow: 'shadow-amber-500/10',
        text: 'text-amber-300',
        label: 'text-slate-300/70'
      }
    case 'memory':
      return {
        bg: 'bg-gradient-to-br from-slate-800/80 to-slate-900/60',
        border: 'border-slate-600/50',
        shadow: 'shadow-rose-500/10',
        text: 'text-rose-300',
        label: 'text-slate-300/70'
      }
    default:
      return {
        bg: 'bg-gradient-to-br from-slate-800/80 to-slate-900/60',
        border: 'border-slate-600/50',
        shadow: 'shadow-black/10',
        text: 'text-slate-300',
        label: 'text-slate-400'
      }
  }
}

function getCardClasses(game) {
  const baseClasses = [
    'border-zinc-700/80',
    'hover:translate-y-[-4px]',
    'hover:shadow-2xl'
  ]

  if (game.comingSoon) {
    baseClasses.push('opacity-50', 'cursor-not-allowed')
  }

  // Game-specific styling
  switch (game.id) {
    case 'wordle':
      baseClasses.push(
        'bg-gradient-to-br', 'from-emerald-950/40', 'to-emerald-900/20',
        'hover:from-emerald-900/60', 'hover:to-emerald-800/40',
        'hover:border-emerald-500/70', 'hover:shadow-emerald-500/25'
      )
      break
    case 'connections':
      baseClasses.push(
        'bg-gradient-to-br', 'from-violet-950/40', 'to-violet-900/20',
        'hover:from-violet-900/60', 'hover:to-violet-800/40',
        'hover:border-violet-500/70', 'hover:shadow-violet-500/25'
      )
      break
    case 'flag':
      baseClasses.push(
        'bg-gradient-to-br', 'from-blue-950/40', 'to-blue-900/20',
        'hover:from-blue-900/60', 'hover:to-blue-800/40',
        'hover:border-blue-500/70', 'hover:shadow-blue-500/25'
      )
      break
    case 'trivia':
      baseClasses.push(
        'bg-gradient-to-br', 'from-fuchsia-950/40', 'to-fuchsia-900/20',
        'hover:from-fuchsia-900/60', 'hover:to-fuchsia-800/40',
        'hover:border-fuchsia-500/70', 'hover:shadow-fuchsia-500/25'
      )
      break
    case 'sequence':
      baseClasses.push(
        'bg-gradient-to-br', 'from-amber-950/40', 'to-amber-900/20',
        'hover:from-amber-900/60', 'hover:to-amber-800/40',
        'hover:border-amber-500/70', 'hover:shadow-amber-500/25'
      )
      break
    case 'memory':
      baseClasses.push(
        'bg-gradient-to-br', 'from-rose-950/40', 'to-rose-900/20',
        'hover:from-rose-900/60', 'hover:to-rose-800/40',
        'hover:border-rose-500/70', 'hover:shadow-rose-500/25'
      )
      break
  }

  return baseClasses
}

// Handle browser back/forward buttons
function handlePopState() {
  const params = new URLSearchParams(window.location.search)
  const gameParam = params.get('game')
  if (gameParam && games.value.some(g => g.id === gameParam)) {
    openGame.value = gameParam
    if (gameParam !== 'wordle') {
      loadingGame.value = true
      try {
        currentGameComponent.value = gameComponents[gameParam] || null
      } finally {
        loadingGame.value = false
      }
    }
  } else {
    openGame.value = null
    currentGameComponent.value = null
  }
}

/* Lifecycle */
onMounted(async () => {
  tick()
  timer = setInterval(tick, 1000)

  try {
    wordleStore.initAuthListener()
    await wordleStore.loadDaily(true)
    
    await dailyStore.initializeGames()
  } catch (error) {
    console.warn('Error initializing stores:', error)
  }

  window.addEventListener('popstate', handlePopState)

  const params = new URLSearchParams(window.location.search)
  const gameParam = params.get('game')
  if (gameParam && games.value.some(g => g.id === gameParam)) {
    openGame.value = gameParam
    if (gameParam !== 'wordle') {
      loadingGame.value = true
      try {
        currentGameComponent.value = gameComponents[gameParam] || null
      } finally {
        loadingGame.value = false
      }
    }
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  window.removeEventListener('popstate', handlePopState)
})
</script>

<style scoped>
@keyframes gradient-move {
  0% {
    background-position: 0% 50%
  }

  50% {
    background-position: 100% 50%
  }

  100% {
    background-position: 0% 50%
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-move 8s ease infinite;
}

.bg-noise {
  background-image:
    radial-gradient(circle at 25% 25%, #ffffff03 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, #ffffff03 1px, transparent 1px);
  background-size: 24px 24px;
  background-position: 0 0, 12px 12px;
}

@media (prefers-reduced-motion: reduce) {

  .animate-gradient,
  .animate-pulse {
    animation: none;
  }
}
</style>