<template>
    <div class="min-h-screen w-full bg-zinc-950 text-zinc-100">
        <!-- Header -->
        <header class="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
            <div class="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span
                        class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 font-bold">M</span>
                    <div>
                        <h1 class="text-lg font-semibold leading-none">MXN Daily</h1>
                        <p class="text-xs text-zinc-400">New drops at 00:00 Australia/Brisbane</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 text-xs">
                    <div class="px-2 py-1 rounded-md bg-zinc-900/70 border border-zinc-800">
                        <span class="text-zinc-400 mr-1">Next in</span><span :key="countdownKey">{{ countdown }}</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- 7-day selector -->
        <div class="mx-auto max-w-5xl px-4 pt-6">
            <!-- mobile: horizontal scroll; md+: 7 columns -->
            <div class="flex gap-2 overflow-x-auto md:grid md:grid-cols-7 md:overflow-visible no-scrollbar">
                <button v-for="d in days" :key="d.date" :disabled="d.date !== today" @click="activeDate = d.date" class="group relative shrink-0 md:shrink md:w-auto overflow-hidden rounded-xl border px-3 py-2 text-left transition
             w-[7.5rem]" :class="[
                activeDate === d.date ? 'border-violet-600/60 bg-violet-600/10' : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70',
                d.date !== today ? 'opacity-60 cursor-not-allowed' : ''
            ]">
                    <div class="text-[10px] uppercase tracking-wide text-zinc-400">{{ formatWeekday(d.date) }}</div>
                    <div class="text-sm font-medium">{{ d.date }}</div>
                    <div class="mt-1 text-[10px] text-zinc-400">Word</div>
                    <div
                        class="absolute inset-0 pointer-events-none bg-gradient-to-br from-violet-500/0 to-fuchsia-500/0 group-hover:from-violet-500/10 group-hover:to-fuchsia-500/10">
                    </div>
                </button>
            </div>
        </div>

        <!-- Content -->
        <main class="mx-auto max-w-5xl px-4 pt-6
              pb-[calc(env(safe-area-inset-bottom)+7.5rem)] md:pb-24">
            <section class="grid lg:grid-cols-3 gap-6">
                <!-- Game column -->
                <div class="lg:col-span-2">
                    <div class="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur">
                        <div class="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60">
                            <div class="flex items-center gap-2">
                                <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
                                <h2 class="text-sm font-semibold tracking-wide uppercase">Word — Today’s Challenge</h2>
                            </div>
                            <div class="flex items-center gap-2 text-xs text-zinc-400">
                                <span v-if="wordState.status === 'won'" class="text-emerald-400">Solved</span>
                                <span v-else-if="wordState.status === 'lost'" class="text-rose-400">Failed</span>
                                <span v-else>In progress</span>
                            </div>
                        </div>

                        <div class="p-4">
                            <WordleGame game-id="word" :playable="activeDate === today" @completed="onWordCompleted" />
                        </div>
                    </div>
                </div>

                <!-- Stats / Streaks -->
                <div class="space-y-6">
                    <div class="rounded-2xl border border-zinc-800/80 bg-zinc-900/40">
                        <div class="px-4 py-3 border-b border-zinc-800/60 flex items-center justify-between">
                            <h3 class="text-sm font-semibold uppercase tracking-wide">Word — Your Stats</h3>
                        </div>
                        <div class="p-4 grid grid-cols-2 gap-3">
                            <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
                                <div class="text-[10px] uppercase tracking-wide text-zinc-400">Win Streak</div>
                                <div class="text-2xl font-semibold mt-1">{{ stats.winStreak || 0 }}</div>
                            </div>
                            <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
                                <div class="text-[10px] uppercase tracking-wide text-zinc-400">Max Win Streak</div>
                                <div class="text-2xl font-semibold mt-1">{{ stats.maxWinStreak || 0 }}</div>
                            </div>
                            <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
                                <div class="text-[10px] uppercase tracking-wide text-zinc-400">Days Played</div>
                                <div class="text-2xl font-semibold mt-1">{{ stats.daysPlayed || 0 }}</div>
                            </div>
                            <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
                                <div class="text-[10px] uppercase tracking-wide text-zinc-400">Total Games</div>
                                <div class="text-2xl font-semibold mt-1">{{ stats.totalGames || 0 }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-2xl border border-zinc-800/80 bg-zinc-900/40">
                        <div class="px-4 py-3 border-b border-zinc-800/60">
                            <h3 class="text-sm font-semibold uppercase tracking-wide">How streaks work</h3>
                        </div>
                        <div class="p-4 text-sm text-zinc-300 space-y-2">
                            <p><strong>Win streak</strong> increases only when you solve today’s word. If you miss a day
                                or fail, it resets.</p>
                            <p><strong>Days played</strong> counts days you tried the puzzle (win or lose).
                                <strong>Total games</strong> is the total number of word puzzles you’ve opened.
                            </p>
                            <p>Sign in with your <strong class="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">TempestID</strong> to sync your progress across devices. Or stay logged out to store only on your device.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import WordleGame from '@/components/mxn/dailyGames/WordleGame.vue'

/* ---------- Time helpers (AEST) ---------- */
const AEST_TZ = 'Australia/Brisbane'
function fmtAEST(d) {
    const y = new Intl.DateTimeFormat('en-CA', { timeZone: AEST_TZ, year: 'numeric' }).format(d)
    const m = new Intl.DateTimeFormat('en-CA', { timeZone: AEST_TZ, month: '2-digit' }).format(d)
    const day = new Intl.DateTimeFormat('en-CA', { timeZone: AEST_TZ, day: '2-digit' }).format(d)
    return `${y}-${m}-${day}`
}
function addDaysAEST(dateStr, n) {
    const baseUTC = new Date(`${dateStr}T00:00:00+10:00`)
    baseUTC.setUTCDate(baseUTC.getUTCDate() + n)
    return fmtAEST(baseUTC)
}
function diffDays(a, b) {
    const A = new Date(`${a}T00:00:00+10:00`).getTime()
    const B = new Date(`${b}T00:00:00+10:00`).getTime()
    return Math.round((B - A) / 86400000)
}

const now = ref(new Date())
const today = computed(() => fmtAEST(now.value))
let timer = null
onMounted(() => { timer = window.setInterval(() => now.value = new Date(), 1000) })
onBeforeUnmount(() => { if (timer) window.clearInterval(timer) })
const countdownKey = ref(0)
const countdown = computed(() => {
    const nextMid = new Date(`${today.value}T00:00:00+10:00`)
    nextMid.setUTCDate(nextMid.getUTCDate() + 1)
    const ms = nextMid.getTime() - now.value.getTime()
    if (ms <= 0) { countdownKey.value++; return '00:00:00' }
    const h = String(Math.floor(ms / 3600000)).padStart(2, '0')
    const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0')
    const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')
    return `${h}:${m}:${s}`
})

/* ---------- Seeds and dictionary (MVP) ---------- */
const WORD_BANK = ['CHAOS', 'TEMPO', 'PIXEL', 'NEXUS', 'BRAVE', 'STORM', 'ROGUE']
const DICTIONARY = [
    // minimal MVP dictionary; replace with a proper word list or Firestore pull
    'ABOUT', 'ABOVE', 'ACUTE', 'AGENT', 'ANGER', 'APPLE', 'BASIC', 'BRAVE', 'BRING', 'CHAOS', 'CIVIC', 'CLOUD', 'CRASH', 'DAILY', 'DELTA',
    'EARTH', 'EAGER', 'FJORD', 'GIANT', 'GRACE', 'HAPPY', 'HEART', 'INDEX', 'JOLLY', 'KNACK', 'LEVEL', 'LEMON', 'MIGHT', 'NEXUS', 'OPERA',
    'PIXEL', 'QUICK', 'ROGUE', 'SOLVE', 'STORM', 'TEMPO', 'UNION', 'VIVID', 'WATER', 'YIELD', 'ZESTY'
].map(w => w.toUpperCase())

const days = computed(() => {
    const list = []
    for (let i = 0; i < 7; i++) list.push({ date: addDaysAEST(today.value, i) })
    return list
})
const activeDate = ref('')
const todaySolution = computed(() => WORD_BANK[0]) // swap with Firestore later

/* ---------- Stats (success-only) ---------- */
const LS_KEY = 'mxnDaily:word:stats'
const stats = ref(loadStats())
function loadStats() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '') || {} } catch { return {} }
}
function saveStats() {
    localStorage.setItem(LS_KEY, JSON.stringify({
        winStreak: stats.value.winStreak || 0,
        maxWinStreak: stats.value.maxWinStreak || 0,
        daysPlayed: stats.value.daysPlayed || 0,
        totalGames: stats.value.totalGames || 0,
        lastPlayedDate: stats.value.lastPlayedDate,
        lastWinDate: stats.value.lastWinDate,
    }))
}
function ensureDefaults() {
    stats.value.winStreak ??= 0
    stats.value.maxWinStreak ??= 0
    stats.value.daysPlayed ??= 0
    stats.value.totalGames ??= 0
}
ensureDefaults()

function ensureOpenCountedForToday() {
    const t = today.value
    if (stats.value.lastPlayedDate !== t) {
        stats.value.daysPlayed += 1
        stats.value.totalGames += 1
        stats.value.lastPlayedDate = t
        saveStats()
    }
}
function applyResult(success) {
    const t = today.value
    const lastWin = stats.value.lastWinDate
    const gap = lastWin ? diffDays(lastWin, t) : null
    if (success) {
        const newStreak = (gap === 1) ? (stats.value.winStreak + 1) : 1
        stats.value.winStreak = newStreak
        stats.value.maxWinStreak = Math.max(stats.value.maxWinStreak, newStreak)
        stats.value.lastWinDate = t
    } else {
        stats.value.winStreak = 0
    }
    saveStats()
}

/* ---------- Wordle completion + reset ---------- */
const wordRef = ref(null)
const wordState = ref({ status: 'idle', attempts: 0 })
function onWordCompleted(payload) {
    if (wordState.value.status !== 'idle') return
    wordState.value.attempts = payload.attempts
    wordState.value.status = payload.success ? 'won' : 'lost'
    applyResult(payload.success)
    if (payload.success) {
        const shareText = `MXN Daily — Word ${today.value}\n${payload.grid}\nhttps://mxn.au/daily`
        navigator.clipboard?.writeText(shareText).catch(() => { })
    }
}
function resetTodayProgress() {
    localStorage.removeItem(`mxnDaily:word:state:${today.value}`)
    wordState.value = { status: 'idle', attempts: 0 }
    wordRef.value?.resetBoard?.()
}
function resetAll() {
    // nukes stats + today board
    localStorage.removeItem(LS_KEY)
    stats.value = { winStreak: 0, maxWinStreak: 0, daysPlayed: 0, totalGames: 0 }
    resetTodayProgress()
}

/* ---------- UI helpers ---------- */
function formatWeekday(d) {
    const date = new Date(`${d}T00:00:00+10:00`)
    return new Intl.DateTimeFormat('en-AU', { weekday: 'short', timeZone: AEST_TZ }).format(date)
}

/* ---------- Lifecycle ---------- */
onMounted(() => {
    activeDate.value = today.value
    ensureOpenCountedForToday()
})
</script>

<style scoped>
.key {
    user-select: none;
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>