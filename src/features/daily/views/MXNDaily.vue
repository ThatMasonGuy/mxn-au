<template>
  <div class="games-page">
    <div class="games-atmosphere" aria-hidden="true"></div>

    <div class="games-shell">
      <header class="games-header">
        <div class="games-header__inner">
          <button type="button" class="games-brand" aria-label="Go to MXN home" @click="goHome">
            <span class="games-brand__mark"><Trophy aria-hidden="true" /></span>
            <span>
              <strong>MXN Games</strong>
              <small>Daily puzzles</small>
            </span>
          </button>

          <div v-if="openGame !== 'wordle-unlimited'" class="games-countdown" aria-label="Time until the next daily puzzles">
            <Clock aria-hidden="true" />
            <span>Next puzzle</span>
            <strong :key="countdownKey">{{ countdown }}</strong>
          </div>
        </div>
      </header>

      <main class="games-main" :class="{ 'games-main--playing': openGame }">
        <div v-if="initialLoading" class="games-loading" role="status" aria-live="polite">
          <span class="games-loading__dot"></span>
          <span>Loading game…</span>
        </div>

        <template v-if="!openGame">
          <section class="games-intro" aria-labelledby="daily-games-title">
            <div>
              <p class="games-kicker">New at 00:00 UTC</p>
              <h1 id="daily-games-title" ref="hubTitleRef" tabindex="-1">Today’s games</h1>
              <p>Three quick puzzles, refreshed daily. Come back tomorrow for a fresh set.</p>
            </div>

            <div class="games-progress" aria-label="Today’s progress">
              <span><strong>{{ completedToday }}</strong> of {{ activeDailyGames.length }} solved</span>
              <span class="games-progress__track" aria-hidden="true">
                <span :style="{ width: dailyProgressWidth }"></span>
              </span>
            </div>
          </section>

          <section aria-labelledby="play-today-title">
            <div class="games-section-heading">
              <h2 id="play-today-title">Play today</h2>
              <span>{{ activeDailyGames.length }} daily games</span>
            </div>

            <div class="daily-game-grid">
              <button v-for="game in activeDailyGames" :key="game.id" type="button" class="daily-game-card"
                :data-game="game.id" @click="handleGameClick(game)">
                <span class="daily-game-card__topline">
                  <span class="daily-game-card__icon"><component :is="game.icon" aria-hidden="true" /></span>
                  <span class="game-status" :data-status="getGameStatus(game.id)">{{ gameStatusText(game) }}</span>
                </span>
                <span class="daily-game-card__body">
                  <strong>{{ game.name }}</strong>
                  <span>{{ game.description }}</span>
                </span>
                <span class="daily-game-card__meta">
                  <span><Flame aria-hidden="true" /> {{ getStreak(game.id) }} streak</span>
                  <span>{{ ctaText(game.id) }} <span aria-hidden="true">→</span></span>
                </span>
              </button>
            </div>
          </section>

          <section v-if="unlimitedGame" class="games-extra" aria-labelledby="more-wordle-title">
            <div class="games-extra__copy">
              <span class="games-extra__icon"><Infinity aria-hidden="true" /></span>
              <span>
                <strong id="more-wordle-title">Wordle Unlimited</strong>
                <small>More puzzles after today’s Wordle</small>
              </span>
            </div>
            <button type="button" @click="handleGameClick(unlimitedGame)">
              <Lock v-if="unlimitedGame.locked" aria-hidden="true" />
              {{ unlimitedGame.locked ? unlimitedGame.lockReason : 'Play unlimited' }}
            </button>
          </section>

          <section v-if="comingSoonGames.length" class="games-up-next" aria-labelledby="up-next-title">
            <h2 id="up-next-title">Up next</h2>
            <ul>
              <li v-for="game in comingSoonGames" :key="game.id">
                <component :is="game.icon" aria-hidden="true" />
                <span>{{ game.name }}</span>
                <small>{{ game.description }}</small>
              </li>
            </ul>
          </section>
        </template>

        <template v-else>
          <section class="game-toolbar" aria-labelledby="current-game-title">
            <button type="button" class="game-back" @click="closeGame"><span aria-hidden="true">←</span> All games</button>

            <div class="game-toolbar__title">
              <p class="games-kicker">Today’s puzzle</p>
              <h1 id="current-game-title" ref="gameTitleRef" tabindex="-1">{{ currentGameData?.name }}</h1>
              <p>{{ currentGameData?.description }}</p>
            </div>

            <dl v-if="gameStatsItems.length" class="game-stat-list">
              <div v-for="item in gameStatsItems" :key="item.label">
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
              </div>
            </dl>

            <div class="game-toolbar__actions">
              <button v-if="(openGame === 'wordle' || openGame === 'wordle-unlimited') && canShare" type="button"
                class="game-share" :disabled="shareBusy" @click="onShare">
                <Share2 aria-hidden="true" />
                {{ shareBusy ? 'Copying…' : 'Share result' }}
              </button>
              <button v-if="showDevReset && resettableDailyGames.has(openGame)" type="button" class="game-dev"
                :disabled="devResetBusy" @click="devReset">
                <Trash2 aria-hidden="true" /> {{ devResetBusy ? 'Resetting…' : 'Reset today' }}
              </button>
              <span v-if="copyMsg" class="game-copy-status" role="status">{{ copyMsg }}</span>
            </div>
          </section>

          <section v-if="openGame === 'wordle-unlimited' && !canPlayWordleUnlimited" class="game-locked">
            <Lock aria-hidden="true" />
            <h2>Wordle Unlimited is locked</h2>
            <p>{{ !isAuthenticated
              ? 'Sign in with TempestID to use Wordle Unlimited.'
              : 'Finish today’s Wordle to unlock more puzzles.' }}</p>
            <div>
              <button v-if="!isAuthenticated" type="button" class="game-primary-action" @click="goToLogin">Sign in</button>
              <button v-else type="button" class="game-primary-action" @click="selectGame('wordle')">Play today’s Wordle</button>
              <button type="button" class="game-secondary-action" @click="closeGame">All games</button>
            </div>
          </section>

          <section v-else class="game-stage" :data-game="openGame">
            <div v-if="gameLoadError" class="game-load-error" role="alert">
              <h2>{{ currentGameData?.name || 'This game' }} couldn’t load</h2>
              <p>Your other games are still available. Try this one again when you’re ready.</p>
              <div>
                <button type="button" class="game-primary-action" @click="retryOpenGame">Retry game</button>
                <button type="button" class="game-secondary-action" @click="closeGame">All games</button>
              </div>
            </div>

            <div v-else-if="openGame === 'wordle' && !loadingGame">
              <div v-if="wordleStore.loading" class="game-inline-loading" role="status">Loading Wordle…</div>
              <div v-else>
                <WordleBoard />
                <div v-if="wordleStore.isComplete" class="game-complete-action">
                  <button type="button" @click="goToWordleUnlimited"><Infinity aria-hidden="true" /> Play another Wordle</button>
                </div>
              </div>
            </div>

            <WordleUnlimitedBoard v-else-if="openGame === 'wordle-unlimited' && !loadingGame" />

            <component v-else-if="currentGameComponent && !loadingGame" :is="currentGameComponent" :game-id="openGame"
              :playable="true" @completed="onGameCompleted" />

            <div v-else class="game-inline-loading" role="status">Loading game…</div>
          </section>
        </template>
      </main>

      <footer class="games-footer">
        <div class="games-footer__inner">
          <button type="button" @click="goHome"><Home aria-hidden="true" /> MXN home</button>
          <span>{{ isAuthenticated ? `Signed in as ${userEmail}` : 'Playing as guest' }}</span>
          <button v-if="!isAuthenticated" type="button" @click="goToLogin">Sign in</button>
          <button v-else type="button" @click="signOut">Sign out</button>
        </div>
      </footer>
    </div>

    <AuthRequiredModal :show="showAuthModal" :type="authModalType" @close="showAuthModal = false" @sign-in="goToLogin"
      @play-daily="() => { showAuthModal = false; selectGame('wordle') }" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent, shallowRef, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signOut as firebaseSignOut } from 'firebase/auth'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { useWordleStore } from '@/features/daily/stores/useWordleStore'
import { useWordleUnlimitedStore } from '@/features/daily/stores/useWordleUnlimitedStore'
import { useDailyStore } from '@/features/daily/stores/useDailyStore'
import { useMainStore } from '@/shared/stores/useMainStore'
import WordleBoard from '@/features/daily/components/WordleBoard.vue'
import WordleUnlimitedBoard from '@/features/daily/components/WordleUnlimitedBoard.vue'
import AuthRequiredModal from '@/features/daily/components/components/AuthRequiredModal.vue'
import { completeDailySignOut } from '@/features/daily/utils/dailyAuth'
import {
  Trophy, Clock, Share2, Trash2, Flame,
  Type, Link as LinkIcon, Flag, HelpCircle, ListOrdered, Brain, Lock, Infinity, Home
} from '@lucide/vue'

/* stores */
const router = useRouter()
const wordleStore = useWordleStore()
const wordleUnlimitedStore = useWordleUnlimitedStore()
const dailyStore = useDailyStore()
const mainStore = useMainStore()

/* Auth state */
const isAuthenticated = computed(() => mainStore.isAuthenticated)
const userEmail = computed(() => mainStore.user?.email || 'Guest')

/* Modal state */
const showAuthModal = ref(false)
const authModalType = ref('auth-required')

/* Initial loading state */
const initialLoading = ref(false)

/* Wordle specific state */
const shareBusy = ref(false)
const copyMsg = ref('')
const devResetBusy = ref(false)
const profile = computed(() => dailyStore.wordleStats)
const hubTitleRef = ref(null)
const gameTitleRef = ref(null)

// Keep development controls opt-in so local visual QA matches production.
const showDevReset = computed(() => {
  return new URLSearchParams(location.search).get('dev') === 'true'
})

// Can play Wordle Unlimited checks
const canPlayWordleUnlimited = computed(() => {
  return isAuthenticated.value && isWordleUnlimitedUnlocked.value
})

const resettableDailyGames = new Set(['wordle', 'connections', 'flag'])

// Reset today's play state without erasing the game's profile or history.
async function devReset() {
  if (!resettableDailyGames.has(openGame.value) || devResetBusy.value) return

  devResetBusy.value = true
  try {
    const gameId = openGame.value
    const stores = {
      wordle: wordleStore,
      connections: connectionsStore,
      flag: flagleStore,
    }
    const puzzlePrefixes = {
      wordle: 'wordle-',
      connections: 'connections-',
      flag: 'flagle-',
    }
    const gameStore = stores[gameId]
    const date = gameStore?.puzzleId?.replace(puzzlePrefixes[gameId], '')
      || new Date().toISOString().slice(0, 10)

    if (getAuth().currentUser) {
      const resetProgress = httpsCallable(
        getFunctions(undefined, 'australia-southeast2'),
        'resetDailyGameProgress',
      )
      await resetProgress({ game: gameId, date })
    }

    gameStore?.resetTodayLocal?.()
    dailyStore.updateGameStatus(gameId, 'not-started')
    copyMsg.value = 'Today reset'
    setTimeout(() => location.reload(), 150)
  } catch (error) {
    console.error('Daily dev reset failed:', error)
    copyMsg.value = 'Reset failed'
    setTimeout(() => (copyMsg.value = ''), 2500)
  } finally {
    devResetBusy.value = false
  }
}

// Navigation
function goHome() {
  router.push('/')
}

function goToLogin() {
  router.push('/login?redirect=/daily')
}

async function signOut() {
  await completeDailySignOut(
    () => firebaseSignOut(getAuth()),
    () => mainStore.clearAuth(),
  )
}

// Countdown (UTC)
const countdown = ref('00:00:00')
const countdownKey = ref(0)
let timer = null
let rolloverRefreshPromise = null

function refreshLoadedDailyGames() {
  if (rolloverRefreshPromise) return rolloverRefreshPromise

  rolloverRefreshPromise = (async () => {
    await dailyStore.checkRollover()
    const stores = [wordleStore, flagleStore, connectionsStore]
    await Promise.allSettled(stores.map(store => store.refreshIfRolledOver?.()))
  })().finally(() => {
    rolloverRefreshPromise = null
  })

  return rolloverRefreshPromise
}

function tick() {
  try {
    const iso = dailyStore.rolloverAt || wordleStore.rolloverAt
    if (!iso) { countdown.value = '—'; return; }
    const ms = Date.parse(iso) - Date.now()
    if (isNaN(ms) || ms <= 0) {
      countdown.value = '00:00:00'
      refreshLoadedDailyGames()
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
const canShare = computed(() => {
  if (openGame.value === 'wordle') {
    return wordleStore?.rows?.length > 0
  } else if (openGame.value === 'wordle-unlimited') {
    return wordleUnlimitedStore?.isComplete
  }
  return false
})

async function onShare() {
  try {
    shareBusy.value = true; copyMsg.value = ''

    let text = ''
    if (openGame.value === 'wordle') {
      text = wordleStore.shareText?.() || 'Wordle completed!'
    } else if (openGame.value === 'wordle-unlimited') {
      text = wordleUnlimitedStore.shareText?.() || 'Wordle Unlimited completed!'
    }

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

const gameComponents = {
  connections: defineAsyncComponent(() => import('@/features/daily/components/ConnectionsGame.vue')),
  flag: defineAsyncComponent(() => import('@/features/daily/components/FlagGame.vue')),
}

import { useFlagleStore } from '@/features/daily/stores/useFlagleStore'
import { useConnectionsStore } from '@/features/daily/stores/useConnectionsStore'

const flagleStore = useFlagleStore()
const connectionsStore = useConnectionsStore()

async function activateGame(gameId, { historyMode = 'push' } = {}) {
  const game = availableGames.value.find(g => g.id === gameId)
  if (!game || game.comingSoon) return

  if (historyMode !== 'none') {
    const url = new URL(window.location)
    url.searchParams.set('game', gameId)
    if (historyMode === 'replace') window.history.replaceState({}, '', url)
    else if (new URLSearchParams(window.location.search).get('game') !== gameId) {
      window.history.pushState({}, '', url)
    }
  }

  loadingGame.value = true
  gameLoadError.value = null
  openGame.value = gameId
  currentGameComponent.value = null

  try {
    if (gameId === 'wordle') {
      await wordleStore.loadDaily(!wordleStore.puzzleId)
    } else if (gameId === 'wordle-unlimited') {
      if (!wordleUnlimitedStore.initialized) {
        await wordleUnlimitedStore.initialize()
      }
    } else if (gameId === 'flag') {
      await flagleStore.loadDaily(!flagleStore.puzzleId)
      currentGameComponent.value = gameComponents.flag
    } else if (gameId === 'connections') {
      await connectionsStore.loadDaily(!connectionsStore.puzzleId)
      currentGameComponent.value = gameComponents.connections
    }
  } catch (error) {
    console.error('Error loading game:', error)
    gameLoadError.value = error
  } finally {
    loadingGame.value = false
    window.scrollTo(0, 0)
    await nextTick()
    gameTitleRef.value?.focus()
  }
}

/* Game list */
const dailyGames = ref([
  {
    id: 'wordle', name: 'Wordle', description: 'Guess the 5-letter word in 6 tries', icon: Type,
  },
  {
    id: 'wordle-unlimited',
    name: 'Wordle Unlimited',
    description: 'Endless word puzzles to solve',
    icon: Infinity,
    requiresAuth: true,
    unlockCondition: () => wordleStore.status === 'won' || wordleStore.status === 'lost'
  },
  {
    id: 'flag', name: 'Flagle', description: 'Identify countries by their flags', icon: Flag,
  },
  {
    id: 'connections', name: 'Connections', description: 'Find groups of 4 related words', icon: LinkIcon,
  },
  {
    id: 'trivia', name: 'Quick Quiz', description: 'Test your general knowledge', icon: HelpCircle,
    comingSoon: true
  },
  {
    id: 'sequence', name: 'Pattern Pro', description: 'Complete the sequence', icon: ListOrdered,
    comingSoon: true
  },
  {
    id: 'memory', name: 'Memory Match', description: 'Remember and match pairs', icon: Brain,
    comingSoon: true
  },
])

// Check if Wordle Unlimited should be available
const isWordleUnlimitedUnlocked = computed(() => {
  const game = dailyGames.value.find(g => g.id === 'wordle-unlimited')
  return game?.unlockCondition() || false
})

// Combine games based on availability
const availableGames = computed(() => {
  const games = []

  // Add daily games first (except unlimited)
  dailyGames.value.forEach(game => {
    if (game.id === 'wordle-unlimited') {
      // Handle Wordle Unlimited with lock status
      if (isWordleUnlimitedUnlocked.value && isAuthenticated.value) {
        games.push(game)
      } else {
        const lockReason = !isAuthenticated.value
          ? 'Sign in to unlock'
          : 'Finish today\'s Wordle'
        games.push({
          ...game,
          locked: true,
          lockReason
        })
      }
    } else {
      games.push(game)
    }
  })

  return games
})

const activeDailyGames = computed(() => availableGames.value.filter(game => !game.comingSoon && game.id !== 'wordle-unlimited'))
const unlimitedGame = computed(() => availableGames.value.find(game => game.id === 'wordle-unlimited') || null)
const comingSoonGames = computed(() => availableGames.value.filter(game => game.comingSoon))

const openGame = ref(null)
const currentGameComponent = shallowRef(null)
const currentGameData = computed(() => availableGames.value.find(g => g.id === openGame.value))
const loadingGame = ref(false)
const gameLoadError = ref(null)

// Handle game card clicks with modal checks
function handleGameClick(game) {
  if (game.comingSoon) return

  if (game.id === 'wordle-unlimited') {
    if (!isAuthenticated.value) {
      authModalType.value = 'auth-required'
      showAuthModal.value = true
      return
    } else if (!isWordleUnlimitedUnlocked.value) {
      authModalType.value = 'daily-required'
      showAuthModal.value = true
      return
    }
  }

  selectGame(game.id)
}

// Go to Wordle Unlimited (from daily completion)
function goToWordleUnlimited() {
  if (!isAuthenticated.value) {
    authModalType.value = 'auth-required'
    showAuthModal.value = true
  } else {
    selectGame('wordle-unlimited')
  }
}

function closeGame() {
  const url = new URL(window.location)
  url.searchParams.delete('game')
  window.history.pushState({}, '', url)

  openGame.value = null
  currentGameComponent.value = null
  gameLoadError.value = null
  window.scrollTo(0, 0)
  nextTick(() => hubTitleRef.value?.focus())
}

/* Game status helpers */
function getGameStatus(gameId) {
  if (gameId === 'wordle') {
    return wordleStore.status || dailyStore.getGameStatus(gameId)
  } else if (gameId === 'wordle-unlimited') {
    return wordleUnlimitedStore.status || 'not-started'
  } else if (gameId === 'flag') {
    return flagleStore.status || dailyStore.getGameStatus(gameId)
  }
  return dailyStore.getGameStatus(gameId)
}

function getStreak(gameId) {
  if (gameId === 'wordle-unlimited') {
    return dailyStore.wordleUnlimitedStats?.currentStreak || 0
  }
  const stats = dailyStore.getStatsFor(gameId)
  return stats?.currentStreak ?? 0
}

function gameStatusText(game) {
  if (game.locked) return 'Locked'

  switch (getGameStatus(game.id)) {
    case 'won': return 'Solved'
    case 'lost': return 'Finished'
    case 'in-progress': return 'In progress'
    default: return 'Not started'
  }
}

function selectGame(gameId) {
  return activateGame(gameId)
}

function retryOpenGame() {
  if (!openGame.value) return
  return activateGame(openGame.value, { historyMode: 'none' })
}

function ctaText(gameId) {
  const game = availableGames.value.find(g => g.id === gameId)
  if (game?.comingSoon) return 'Coming Soon'
  if (game?.locked) return game.lockReason

  const status = getGameStatus(gameId)
  switch (status) {
    case 'won': return 'View result'
    case 'lost': return gameId === 'wordle-unlimited' ? 'Play again' : 'View result'
    case 'in-progress': return 'Continue'
    default: return 'Play'
  }
}

function statsFor(gameId) {
  if (gameId === 'wordle-unlimited') {
    return wordleUnlimitedStore.profile
  }
  return dailyStore.getStatsFor(gameId)
}

/* Computed stats */
const completedToday = computed(() => activeDailyGames.value.filter(game => getGameStatus(game.id) === 'won').length)
const dailyProgressWidth = computed(() => {
  if (!activeDailyGames.value.length) return '0%'
  return `${Math.round((completedToday.value / activeDailyGames.value.length) * 100)}%`
})

const gameStatsItems = computed(() => {
  if (!openGame.value) return []

  if (openGame.value === 'wordle') {
    return [
      { label: 'Played', value: profile.value?.totalPlays ?? 0 },
      { label: 'Wins', value: profile.value?.wins ?? 0 },
      { label: 'Streak', value: profile.value?.currentStreak ?? 0 },
    ]
  }

  if (openGame.value === 'wordle-unlimited') {
    const stats = dailyStore.wordleUnlimitedStats || {}
    return [
      { label: 'Played', value: stats.totalPlayed ?? 0 },
      { label: 'Wins', value: stats.wins ?? 0 },
      { label: 'Streak', value: stats.currentStreak ?? 0 },
    ]
  }

  const stats = statsFor(openGame.value)
  if (!stats) return []

  return [
    { label: 'Streak', value: stats.currentStreak ?? 0 },
    { label: 'Best', value: stats.maxStreak ?? 0 },
    { label: 'Played', value: stats.gamesPlayed ?? stats.totalPlays ?? 0 },
    { label: 'Win rate', value: `${stats.winPercentage ?? 0}%` },
  ]
})

function onGameCompleted(result) {
  console.log('Game completed:', result)
}

// Handle browser back/forward buttons
async function handlePopState() {
  const params = new URLSearchParams(window.location.search)
  const gameParam = params.get('game')
  if (gameParam && availableGames.value.some(g => g.id === gameParam && !g.comingSoon)) {
    await activateGame(gameParam, { historyMode: 'none' })
  } else {
    openGame.value = null
    currentGameComponent.value = null
    gameLoadError.value = null
    await nextTick()
    hubTitleRef.value?.focus()
  }
}

/* Lifecycle */
onMounted(async () => {
  tick()
  timer = setInterval(tick, 1000)

  try {
    // Set initial loading state
    const params = new URLSearchParams(window.location.search)
    const gameParam = params.get('game')
    if (gameParam) {
      initialLoading.value = true
    }

    // Initialise listeners independently; a puzzle outage must not block the hub.
    wordleStore.initAuthListener()
    flagleStore.initAuthListener()
    connectionsStore.initAuthListener()
    await dailyStore.initializeGames()

    // THEN handle URL params after stores are ready
    window.addEventListener('popstate', handlePopState)

    if (gameParam && availableGames.value.some(g => g.id === gameParam && !g.comingSoon)) {
      // Check if it's wordle unlimited and user can't play it
      if (gameParam === 'wordle-unlimited' && !canPlayWordleUnlimited.value) {
        openGame.value = gameParam
        initialLoading.value = false
      } else {
        await activateGame(gameParam, { historyMode: 'none' })
        initialLoading.value = false
      }
    } else {
      initialLoading.value = false
    }
  } catch (error) {
    console.warn('Error initializing stores:', error)
    initialLoading.value = false
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  window.removeEventListener('popstate', handlePopState)
})
</script>

<style scoped>
.games-page {
  --games-bg: #09080d;
  --games-panel: #121018;
  --games-panel-strong: #17141e;
  --games-line: #2a2632;
  --games-line-strong: #3a3445;
  --games-text: #f7f2f6;
  --games-muted: #aaa2af;
  --games-accent: #e548c7;
  --games-accent-soft: #f0a5df;
  position: relative;
  min-height: 100dvh;
  overflow-x: clip;
  background: var(--games-bg);
  color: var(--games-text);
  font-family: var(--font-body);
}

.games-atmosphere {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 78% -10%, rgb(173 35 142 / 14%), transparent 32rem),
    radial-gradient(circle at 6% 62%, rgb(76 49 109 / 12%), transparent 28rem),
    linear-gradient(135deg, #09080d 0%, #0c0912 52%, #0b0d16 100%);
}

.games-atmosphere::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.14;
  background-image: radial-gradient(rgb(255 255 255 / 18%) 0.55px, transparent 0.55px);
  background-size: 7px 7px;
  mask-image: linear-gradient(to bottom, black, transparent 68%);
}

.games-shell {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
}

button {
  font: inherit;
}

button:focus-visible {
  outline: 2px solid var(--games-accent-soft);
  outline-offset: 3px;
}

.games-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgb(255 255 255 / 8%);
  background: rgb(9 8 13 / 92%);
  backdrop-filter: blur(16px);
}

.games-header__inner,
.games-footer__inner,
.games-main {
  width: min(100% - 2rem, 70rem);
  margin-inline: auto;
}

.games-header__inner {
  display: flex;
  min-height: 3.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.games-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0;
  border: 0;
  color: inherit;
  text-align: left;
  background: transparent;
  cursor: pointer;
}

.games-brand__mark {
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #753469;
  border-radius: 0.65rem;
  background: #281225;
  color: #f0a5df;
}

.games-brand__mark svg {
  width: 1.05rem;
}

.games-brand strong,
.games-brand small {
  display: block;
}

.games-brand strong {
  font-family: var(--font-heading);
  font-size: 0.95rem;
  line-height: 1.1;
}

.games-brand small {
  margin-top: 0.18rem;
  color: var(--games-muted);
  font-size: 0.68rem;
  line-height: 1;
}

.games-countdown {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--games-muted);
  font-size: 0.7rem;
}

.games-countdown svg {
  width: 0.9rem;
}

.games-countdown strong {
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--games-line-strong);
  border-radius: 0.45rem;
  color: var(--games-text);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
}

.games-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1.15rem;
  padding-block: 1.35rem 1.6rem;
}

.games-main--playing {
  width: min(100% - 2rem, 76rem);
  gap: 0.85rem;
  padding-block: 1rem 1.25rem;
}

.games-loading {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: rgb(9 8 13 / 88%);
  color: var(--games-text);
  backdrop-filter: blur(12px);
}

.games-loading__dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 50%;
  background: var(--games-accent);
  animation: games-pulse 1.1s ease-in-out infinite;
}

.games-kicker {
  margin: 0 0 0.25rem;
  color: var(--games-accent-soft);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.games-intro {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  padding: 0.25rem 0 0.35rem;
}

.games-intro h1,
.game-toolbar h1 {
  margin: 0;
  font-family: var(--font-heading);
  letter-spacing: -0.035em;
}

.games-intro h1 {
  font-size: clamp(2.15rem, 5vw, 3.5rem);
  line-height: 1;
}

.games-intro p:last-child {
  max-width: 38rem;
  margin: 0.55rem 0 0;
  color: var(--games-muted);
  font-size: 0.92rem;
  line-height: 1.55;
}

.games-progress {
  display: grid;
  width: min(17rem, 35vw);
  flex: 0 0 auto;
  gap: 0.5rem;
  color: var(--games-muted);
  font-size: 0.75rem;
}

.games-progress strong {
  color: var(--games-text);
  font-size: 1rem;
}

.games-progress__track {
  height: 0.32rem;
  overflow: hidden;
  border-radius: 999px;
  background: #28232d;
}

.games-progress__track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--games-accent);
  transition: width 240ms ease;
}

.games-section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.7rem;
}

.games-section-heading h2,
.games-up-next h2 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 0.95rem;
}

.games-section-heading span {
  color: var(--games-muted);
  font-size: 0.68rem;
}

.daily-game-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.daily-game-card {
  --game-tone: #d9d0dd;
  --game-wash: rgb(217 208 221 / 7%);
  display: flex;
  min-width: 0;
  min-height: 11.5rem;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid var(--games-line);
  border-radius: 0.8rem;
  color: var(--games-text);
  text-align: left;
  background: linear-gradient(150deg, var(--game-wash), transparent 62%), var(--games-panel);
  box-shadow: 0 12px 30px rgb(0 0 0 / 12%);
  cursor: pointer;
  transition: border-color 160ms ease, transform 160ms ease, background-color 160ms ease;
}

.daily-game-card[data-game='wordle'] {
  --game-tone: #50d6a0;
  --game-wash: rgb(43 173 119 / 13%);
}

.daily-game-card[data-game='flag'] {
  --game-tone: #f0ad4e;
  --game-wash: rgb(201 121 35 / 13%);
}

.daily-game-card[data-game='connections'] {
  --game-tone: #ba8bf6;
  --game-wash: rgb(123 72 190 / 15%);
}

.daily-game-card:hover {
  border-color: color-mix(in srgb, var(--game-tone) 58%, var(--games-line));
  transform: translateY(-2px);
}

.daily-game-card__topline,
.daily-game-card__meta,
.games-extra,
.games-extra__copy {
  display: flex;
  align-items: center;
}

.daily-game-card__topline,
.daily-game-card__meta {
  justify-content: space-between;
  gap: 0.75rem;
}

.daily-game-card__icon {
  display: grid;
  width: 2.2rem;
  height: 2.2rem;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--game-tone) 42%, transparent);
  border-radius: 0.65rem;
  color: var(--game-tone);
  background: color-mix(in srgb, var(--game-tone) 11%, transparent);
}

.daily-game-card__icon svg {
  width: 1.05rem;
}

.game-status {
  position: relative;
  padding-left: 0.75rem;
  color: var(--games-muted);
  font-size: 0.65rem;
}

.game-status::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 0.4rem;
  height: 0.4rem;
  border: 1px solid currentColor;
  border-radius: 50%;
  transform: translateY(-50%);
}

.game-status[data-status='won'] {
  color: #65dca9;
}

.game-status[data-status='lost'] {
  color: #e59b89;
}

.game-status[data-status='in-progress'] {
  color: #efbf68;
}

.daily-game-card__body {
  display: grid;
  gap: 0.32rem;
  padding-block: 1rem 0.8rem;
}

.daily-game-card__body strong {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  line-height: 1.1;
}

.daily-game-card__body span,
.daily-game-card__meta {
  color: var(--games-muted);
  font-size: 0.68rem;
}

.daily-game-card__meta > span {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.daily-game-card__meta > span:last-child {
  color: var(--game-tone);
  font-weight: 700;
}

.daily-game-card__meta svg {
  width: 0.8rem;
}

.games-extra {
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0.8rem;
  border: 1px solid var(--games-line);
  border-radius: 0.7rem;
  background: rgb(18 16 24 / 78%);
}

.games-extra__copy {
  gap: 0.65rem;
  min-width: 0;
}

.games-extra__icon {
  display: grid;
  width: 2rem;
  height: 2rem;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 0.55rem;
  color: #78d9df;
  background: #10252a;
}

.games-extra__icon svg,
.games-extra button svg {
  width: 0.9rem;
}

.games-extra strong,
.games-extra small {
  display: block;
}

.games-extra strong {
  font-family: var(--font-heading);
  font-size: 0.82rem;
}

.games-extra small {
  margin-top: 0.15rem;
  color: var(--games-muted);
  font-size: 0.65rem;
}

.games-extra button,
.game-back,
.game-share,
.game-dev,
.game-primary-action,
.game-secondary-action,
.game-complete-action button {
  display: inline-flex;
  min-height: 2.35rem;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 0.8rem;
  border: 1px solid var(--games-line-strong);
  border-radius: 0.55rem;
  color: var(--games-text);
  background: #1a1720;
  cursor: pointer;
}

.games-extra button {
  min-height: 2rem;
  color: #d9d0dd;
  font-size: 0.68rem;
}

.games-extra button:hover,
.game-back:hover,
.game-secondary-action:hover {
  border-color: #5c5369;
  background: #211d28;
}

.games-up-next {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding-top: 0.15rem;
}

.games-up-next h2 {
  flex: 0 0 auto;
  color: var(--games-muted);
  font-size: 0.72rem;
  font-weight: 400;
}

.games-up-next ul {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: 0.55rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.games-up-next li {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.35rem;
  color: #d3cbd6;
  font-size: 0.68rem;
}

.games-up-next li + li::before {
  content: '·';
  margin-right: 0.2rem;
  color: #5f5764;
}

.games-up-next li svg {
  width: 0.78rem;
  color: #8f8695;
}

.games-up-next li small {
  display: none;
}

.game-toolbar {
  display: grid;
  grid-template-columns: auto minmax(12rem, 1fr) auto auto;
  align-items: center;
  gap: 1rem;
  min-height: 4.2rem;
}

.game-back {
  font-size: 0.7rem;
  white-space: nowrap;
}

.game-toolbar__title h1 {
  font-size: 1.8rem;
  line-height: 1;
}

.game-toolbar__title > p:last-child {
  margin: 0.25rem 0 0;
  color: var(--games-muted);
  font-size: 0.68rem;
}

.game-stat-list {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 0;
}

.game-stat-list div {
  min-width: 4.25rem;
  padding-inline: 0.75rem;
  border-left: 1px solid var(--games-line);
}

.game-stat-list dt {
  color: var(--games-muted);
  font-size: 0.58rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.game-stat-list dd {
  margin: 0.12rem 0 0;
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-variant-numeric: tabular-nums;
}

.game-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.game-share,
.game-dev {
  min-height: 2.25rem;
  font-size: 0.68rem;
}

.game-share {
  border-color: #91427f;
  background: #7b2169;
}

.game-share:hover {
  background: #92277e;
}

.game-dev {
  border-color: #704545;
  color: #e5b2aa;
}

.game-share svg,
.game-dev svg,
.game-complete-action svg {
  width: 0.85rem;
}

.game-copy-status {
  color: #72d7a9;
  font-size: 0.65rem;
}

.game-stage,
.game-locked {
  width: min(100%, 64rem);
  margin-inline: auto;
  padding: 1.1rem;
  border: 1px solid var(--games-line);
  border-radius: 0.9rem;
  background: linear-gradient(155deg, rgb(255 255 255 / 3%), transparent 55%), rgb(18 16 24 / 92%);
  box-shadow: 0 24px 60px rgb(0 0 0 / 18%);
}

.game-stage[data-game='wordle'],
.game-stage[data-game='wordle-unlimited'],
.game-stage[data-game='flag'] {
  width: min(100%, 54rem);
}

.game-stage :deep(.prevent-zoom) {
  gap: 1rem;
}

.game-inline-loading {
  padding: 4rem 1rem;
  color: var(--games-muted);
  text-align: center;
}

.game-load-error {
  display: grid;
  min-height: 16rem;
  place-content: center;
  justify-items: center;
  text-align: center;
}

.game-load-error h2 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.35rem;
}

.game-load-error p {
  max-width: 28rem;
  margin: 0.55rem 0 1.2rem;
  color: var(--games-muted);
}

.game-load-error > div {
  display: flex;
  gap: 0.55rem;
}

.game-complete-action {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.game-complete-action button,
.game-primary-action {
  border-color: #91427f;
  background: #7b2169;
}

.game-locked {
  display: grid;
  place-items: center;
  padding-block: 4rem;
  text-align: center;
}

.game-locked > svg {
  width: 2rem;
  color: var(--games-accent-soft);
}

.game-locked h2 {
  margin: 1rem 0 0;
  font-family: var(--font-heading);
  font-size: 1.4rem;
}

.game-locked p {
  max-width: 28rem;
  margin: 0.55rem 0 1.2rem;
  color: var(--games-muted);
}

.game-locked > div {
  display: flex;
  gap: 0.55rem;
}

.games-footer {
  margin-top: auto;
  border-top: 1px solid rgb(255 255 255 / 8%);
  background: rgb(8 7 11 / 84%);
}

.games-footer__inner {
  display: flex;
  min-height: 3.2rem;
  align-items: center;
  gap: 0.8rem;
  color: #7f7784;
  font-size: 0.65rem;
}

.games-footer__inner button {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0;
  border: 0;
  color: #aaa2af;
  background: transparent;
  cursor: pointer;
}

.games-footer__inner button:last-child {
  margin-left: auto;
  color: #d9a4ce;
}

.games-footer__inner svg {
  width: 0.78rem;
}

@keyframes games-pulse {
  50% { opacity: 0.4; transform: scale(0.78); }
}

@media (max-width: 760px) {
  .games-header__inner,
  .games-footer__inner,
  .games-main,
  .games-main--playing {
    width: min(100% - 1.5rem, 70rem);
  }

  .games-header__inner {
    min-height: 3.5rem;
  }

  .games-countdown > span {
    display: none;
  }

  .games-main {
    gap: 1.3rem;
    padding-block: 1.1rem 1.4rem;
  }

  .games-intro {
    display: grid;
    gap: 1rem;
  }

  .games-intro h1 {
    font-size: 2.35rem;
  }

  .games-intro p:last-child {
    font-size: 0.84rem;
  }

  .games-progress {
    width: 100%;
  }

  .daily-game-grid {
    grid-template-columns: 1fr;
  }

  .daily-game-card {
    min-height: 8.65rem;
    padding: 0.85rem;
  }

  .daily-game-card__body {
    padding-block: 0.65rem;
  }

  .daily-game-card__body strong {
    font-size: 1.15rem;
  }

  .games-extra {
    align-items: flex-start;
  }

  .games-extra button {
    max-width: 8.75rem;
  }

  .games-up-next {
    display: grid;
    gap: 0.6rem;
  }

  .games-up-next ul {
    display: grid;
    gap: 0.45rem;
  }

  .games-up-next li + li::before {
    display: none;
  }

  .games-up-next li small {
    display: inline;
    overflow: hidden;
    color: #756d7a;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .game-toolbar {
    grid-template-columns: 1fr auto;
    gap: 0.7rem;
  }

  .game-back {
    justify-self: start;
  }

  .game-toolbar__actions {
    grid-column: 2;
    grid-row: 1;
    justify-self: end;
  }

  .game-toolbar__title {
    grid-column: 1 / -1;
  }

  .game-toolbar__title h1 {
    font-size: 1.65rem;
  }

  .game-stat-list {
    grid-column: 1 / -1;
    width: 100%;
    justify-content: space-between;
    padding-top: 0.2rem;
  }

  .game-stat-list div {
    min-width: 0;
    flex: 1;
    padding-inline: 0.55rem;
  }

  .game-stat-list div:first-child {
    padding-left: 0;
    border-left: 0;
  }

  .game-stage,
  .game-locked {
    padding: 0.85rem;
  }

  .game-locked {
    padding-block: 3rem;
  }

  .game-locked > div {
    width: 100%;
    flex-direction: column;
  }

  .games-footer__inner {
    min-height: 3.5rem;
    flex-wrap: wrap;
    gap: 0.35rem 0.7rem;
    padding-block: 0.6rem;
  }
}

@media (max-width: 390px) {
  .games-brand small {
    display: none;
  }

  .games-countdown strong {
    padding-inline: 0.4rem;
  }

  .games-extra {
    display: grid;
  }

  .games-extra button {
    width: 100%;
    max-width: none;
  }

  .game-share,
  .game-dev {
    padding-inline: 0.55rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .games-loading__dot,
  .games-progress__track span,
  .daily-game-card {
    animation: none;
    transition: none;
  }
}
</style>
