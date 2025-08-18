<template>
    <div class="flex flex-col items-center gap-6 prevent-zoom">
        <!-- Header with current word indicator -->
        <div class="text-center space-y-2">
            <h3 class="text-lg font-semibold text-white">Wordle Unlimited</h3>
            <p class="text-sm text-zinc-400">
                Word #{{ store.currentWordIndex + 1 }}
                <span v-if="store.totalWordsPlayed > 0" class="ml-2">
                    • {{ store.winPercentage }}% win rate
                </span>
            </p>
        </div>

        <!-- Loading state with skeleton -->
        <div v-if="store.loading" class="w-full mx-auto max-w-[min(92vw,24rem)] md:max-w-[30rem] lg:max-w-[36rem] xl:max-w-[40rem]">
            <div class="flex flex-col items-center gap-1">
                <!-- Skeleton grid -->
                <div v-for="r in 6" :key="'skeleton-r-' + r" class="grid grid-cols-5 gap-1 justify-center">
                    <div v-for="c in 5" :key="'skeleton-c-' + r + '-' + c"
                        class="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-md border border-zinc-700/50 bg-zinc-800/30 animate-pulse"
                        :style="{ animationDelay: `${(r * 5 + c) * 30}ms` }" />
                </div>
            </div>
            <!-- Loading message -->
            <div class="mt-8 text-center">
                <div
                    class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
                    <div class="flex gap-1">
                        <div class="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style="animation-delay: 0ms">
                        </div>
                        <div class="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style="animation-delay: 150ms">
                        </div>
                        <div class="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style="animation-delay: 300ms">
                        </div>
                    </div>
                    <span class="text-sm text-violet-300">{{ store.loadingMessage || 'Loading...' }}</span>
                </div>
            </div>
        </div>

        <!-- Game Board -->
        <div v-else class="w-full mx-auto max-w-[min(92vw,24rem)] md:max-w-[30rem] lg:max-w-[36rem] xl:max-w-[40rem]">
            <div class="flex flex-col items-center gap-1">
                <div v-for="r in 6" :key="'r-' + r" class="grid grid-cols-5 gap-1 justify-center"
                    :class="{ 'row-shake': shakingRow === r - 1 }">
                    <div v-for="c in 5" :key="'c-' + r + '-' + c"
                        class="tile w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14">
                        <div class="flip-inner" :class="flipClasses(r - 1, c - 1)" :style="flipStyle(r - 1, c - 1)">
                            <!-- FRONT: neutral with letters -->
                            <div class="face front grid place-items-center rounded-md border font-semibold select-none"
                                :class="frontNeutralClass()">
                                {{ frontChar(r - 1, c - 1) }}
                            </div>
                            <!-- BACK: colored result with letters -->
                            <div class="face back grid place-items-center rounded-md border font-semibold select-none"
                                :class="r - 1 < rows.length
                                    ? backMaskClass(r - 1, c - 1)
                                    : 'bg-zinc-900/70 border-zinc-800 text-transparent'
                                    ">
                                {{ backChar(r - 1, c - 1) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- INFO BLIP -->
        <transition name="fade">
            <div v-if="flashMsg" class="text-xs px-3 py-1 rounded-full ring-1" :class="flashType === 'error'
                ? 'bg-amber-500/10 text-amber-300 ring-amber-400/30'
                : 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/30'
                ">
                {{ flashMsg }}
            </div>
        </transition>

        <!-- KEYBOARD -->
        <div v-if="!store.loading" class="w-full max-w-[min(96vw,30rem)] md:max-w-[38rem] lg:max-w-[42rem]"
            :class="{ 'opacity-70 pointer-events-none': !canTypeOnKeyboard }">
            <div class="flex flex-col gap-1">
                <div class="flex gap-1">
                    <KeyButton v-for="k in row1" :key="k" :k="k" :state="keyState(k)" :disabled="!canTypeOnKeyboard"
                        @press="onKey" />
                </div>
                <div class="flex gap-1">
                    <span class="flex-1" />
                    <KeyButton v-for="k in row2" :key="k" :k="k" :state="keyState(k)" :disabled="!canTypeOnKeyboard"
                        @press="onKey" />
                    <span class="flex-1" />
                </div>
                <div class="flex gap-1">
                    <button
                        class="h-12 flex-1 min-w-[3.2rem] rounded-md text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50"
                        :disabled="!canTypeOnKeyboard" @click="onKey('Enter')" aria-label="Enter" title="Enter">
                        <div class="flex items-center justify-center gap-2">
                            <CornerDownLeft class="h-4 w-4" />
                        </div>
                    </button>
                    <KeyButton v-for="k in row3" :key="k" :k="k" :state="keyState(k)" :disabled="!canTypeOnKeyboard"
                        @press="onKey" />
                    <button
                        class="h-12 flex-1 min-w-[3.2rem] rounded-md text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50"
                        :disabled="!canBackspace" @click="onKey('Backspace')" aria-label="Backspace" title="Backspace">
                        <div class="flex items-center justify-center gap-2">
                            <Delete class="h-4 w-4" />
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Completion Overlay for Unlimited -->
        <WordleUnlimitedCompletionOverlay :show="showCompletionOverlay" :is-win="status === 'won'"
            :attempts="rows.length" :streak="store.currentStreak" :answer="store.currentAnswer" :emoji-grid="emojiGrid"
            :word-number="store.currentWordIndex" :win-percentage="store.winPercentage" @close="closeCompletionOverlay"
            @share="onShare" @new-game="onNewGame" />

        <!-- Next Puzzle CTA (always available after completion, even if overlay is closed) -->
        <div v-if="isComplete && !store.loading && !isAnimating" class="w-full max-w-md">
            <button
                class="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 active:bg-violet-600 text-white font-semibold h-11 shadow-sm disabled:opacity-60"
                :disabled="store.loading || isNewGamePending" @click="onNewGame">
                <ArrowRightCircle class="h-5 w-5" />
                {{ isNewGamePending ? 'Loading...' : 'Next puzzle' }}
            </button>
        </div>

        <!-- Quick Stats Bar (always visible) -->
        <div v-if="!store.loading" class="w-full max-w-md">
            <div class="grid grid-cols-3 gap-3 text-center text-sm">
                <!-- Played -->
                <div
                    class="p-[1px] rounded-xl bg-gradient-to-br from-violet-500/40 via-fuchsia-500/30 to-emerald-500/40">
                    <div class="rounded-xl h-full bg-zinc-900/70 backdrop-blur-sm p-3 flex flex-col items-center gap-2
               hover:bg-zinc-900/80 transition-colors">
                        <Gamepad2 class="w-4 h-4 text-violet-300" />
                        <div class="text-white font-semibold text-xl leading-none">
                            {{ store.totalWordsPlayed }}
                        </div>
                        <div class="text-[10px] uppercase tracking-wide text-zinc-400">Played</div>
                    </div>
                </div>

                <!-- Win Rate -->
                <div class="p-[1px] rounded-xl bg-gradient-to-br from-emerald-500/40 to-cyan-500/40">
                    <div class="rounded-xl h-full bg-zinc-900/70 backdrop-blur-sm p-3 flex flex-col items-center gap-2
               hover:bg-zinc-900/80 transition-colors">
                        <div class="relative" role="img" :aria-label="`Win rate ${winRate}%`">
                            <!-- ring -->
                            <div class="winring" :style="{ '--pct': winRate + '%' }"></div>
                            <!-- value -->
                            <div class="absolute inset-0 grid place-items-center text-sm font-semibold text-white">
                                {{ winRate }}%
                            </div>
                        </div>
                        <div class="text-[10px] uppercase tracking-wide text-zinc-400">Win Rate</div>
                    </div>
                </div>

                <!-- Streak -->
                <div class="p-[1px] rounded-xl bg-gradient-to-br from-amber-500/40 to-rose-500/40">
                    <div class="rounded-xl h-full bg-zinc-900/70 backdrop-blur-sm p-3 flex flex-col items-center gap-2
               hover:bg-zinc-900/80 transition-colors">
                        <Flame class="w-4 h-4" :class="streakIconClass" />
                        <div class="text-white font-semibold text-xl leading-none">
                            {{ store.currentStreak }}
                        </div>
                        <div class="text-[10px] uppercase tracking-wide text-zinc-400">Streak</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, watch, nextTick } from 'vue'
import { useWordleUnlimitedStore } from '@/stores/dailyGames/useWordleUnlimitedStore'
import KeyButton from './components/KeyButton.vue'
import WordleUnlimitedCompletionOverlay from './components/WordleCompletionOverlay.vue'
import { CornerDownLeft, Delete, ArrowRightCircle, Gamepad2, Flame } from 'lucide-vue-next'

const store = useWordleUnlimitedStore()

const flashMsg = ref('')
const flashType = ref('info')
const showCompletionOverlay = ref(false)
const isNewGamePending = ref(false)
const isAnimating = ref(false)

const row1 = 'QWERTYUIOP'.split('')
const row2 = 'ASDFGHJKL'.split('')
const row3 = 'ZXCVBNM'.split('')

const winRate = computed(() => {
    const n = Number(store.winPercentage ?? 0)
    return Math.max(0, Math.min(100, Math.round(n)))
})

const streakIconClass = computed(() => {
    const s = Number(store.currentStreak ?? 0)
    if (s >= 20) return 'text-rose-300'
    if (s >= 10) return 'text-amber-300'
    if (s >= 5) return 'text-emerald-300'
    return 'text-zinc-300'
})

async function loadAllowedWords() {
    try {
        const mod = await import('word-list-json')
        let raw = mod.default ?? mod.words ?? mod.list ?? mod
        let arr
        if (Array.isArray(raw)) arr = raw
        else if (raw && typeof raw === 'object') arr = Object.keys(raw)
        else arr = []
        const five = arr
            .filter((w) => typeof w === 'string' && /^[a-z]{5}$/.test(w))
            .map((w) => w.toLowerCase())
        store.setAllowedWords(new Set(five))
    } catch {
        /* stay permissive */
    }
}

onMounted(async () => {
    loadAllowedWords()
    window.addEventListener('keydown', onKeydown)

    // Initialize if not already done
    if (!store.initialized) {
        await store.initialize()
    }
})

onUnmounted(() => window.removeEventListener('keydown', onKeydown))

const rows = computed(() => store.currentGame?.rows || [])
const status = computed(() => store.currentGame?.status || 'idle')
const isComplete = computed(() => status.value === 'won' || status.value === 'lost')

// More robust canType check
const canTypeOnKeyboard = computed(() => {
    return store.canType && !showCompletionOverlay.value && !isAnimating.value
})

// Generate emoji grid for sharing
const emojiGrid = computed(() => {
    if (rows.value.length === 0) return ''
    return rows.value.map((row) => store.maskToEmoji(row.mask)).join('\n')
})

// ---- reveal control ----
const revealingRow = ref(-1)
const STAGGER = 120
const FLIP_MS = 600

// Watch for new rows being added
watch(
    () => rows.value.length,
    async (n, o) => {
        if (typeof o === 'number' && n === o + 1) {
            revealingRow.value = n - 1
            isAnimating.value = true

            // Wait for reveal animation to complete
            setTimeout(async () => {
                revealingRow.value = -1
                isAnimating.value = false

                // Check if game just ended
                await nextTick()
                if (status.value === 'won' || status.value === 'lost') {
                    // Show completion overlay after tiles finish flipping
                    setTimeout(() => {
                        showCompletionOverlay.value = true
                    }, 200)
                }
            }, 5 * STAGGER + FLIP_MS + 50)
        }
    }
)

// helpers
function isSubmittedRow(r) {
    return r < rows.value.length
}
function isOldSubmittedRow(r) {
    return r < rows.value.length - 1
}
function isNewestSubmittedRow(r) {
    return r === rows.value.length - 1
}
function isRevealingRow(r) {
    return revealingRow.value === r
}

function frontNeutralClass() {
    return 'border-zinc-700/70 bg-zinc-900/80 text-white'
}
function backMaskClass(r, c) {
    const ch = rows.value[r]?.mask[c]
    if (ch === 'G') return 'border-emerald-600/80 bg-emerald-600/40 text-white'
    if (ch === 'Y') return 'border-amber-600/80 bg-amber-600/40 text-white'
    return 'border-zinc-700 bg-zinc-800/80 text-zinc-400'
}

function frontChar(r, c) {
    if (status.value === 'idle' && r === rows.value.length) return (store.currentInput[c] || '').toUpperCase()
    if (isRevealingRow(r)) return rows.value[r]?.guess[c] ?? ''
    return ''
}
function backChar(r, c) {
    if (r < rows.value.length) return rows.value[r].guess[c] ?? ''
    return ''
}

function isTileFlipped(r, c) {
    if (isOldSubmittedRow(r)) return true
    if (isNewestSubmittedRow(r)) {
        if (isRevealingRow(r)) return c <= revealColNow(r)
        return true
    }
    return false
}

function revealColNow(r) {
    return 5
}

// flip classes & style
function flipClasses(r, c) {
    const flipped = isTileFlipped(r, c) ? 'flipped' : ''
    const trans = isRevealingRow(r) ? 'with-transition' : 'no-transition'
    return [flipped, trans]
}
function flipStyle(r, c) {
    return isRevealingRow(r) ? { transitionDelay: `${c * STAGGER}ms` } : { transitionDelay: '0ms' }
}

// keyboard
function onKey(k) {
    if (!canTypeOnKeyboard.value) return

    if (k === 'Enter') {
        store.enter().catch((e) => {
            if (e?.message === 'invalid_word') {
                blip('Not in word list', 'error')
                triggerShake()
            } else if (e?.message === 'duplicate_guess') {
                blip('Already tried that', 'error')
                triggerShake()
            } else if (e?.message === 'no_current_game') {
                blip('No active game', 'error')
            }
        })
        return
    }
    if (k === 'Backspace') {
        store.backspace()
        return
    }
    if (/^[a-zA-Z]$/.test(k)) store.typeLetter(k)
}

function onKeydown(e) {
    if (!canTypeOnKeyboard.value) return
    if (e.key === 'Backspace' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) e.preventDefault()
    onKey(e.key)
}

const canBackspace = computed(() => canTypeOnKeyboard.value && store.currentInput.length > 0)

// shake
const shakingRow = ref(-1)
function triggerShake() {
    const i = rows.value.length
    shakingRow.value = i
    setTimeout(() => (shakingRow.value = -1), 500)
}
function blip(msg, type = 'info') {
    flashMsg.value = msg
    flashType.value = type
    setTimeout(() => (flashMsg.value = ''), 1500)
}

function keyState(letter) {
    const L = letter.toUpperCase()
    let best = 'unknown'
    for (const r of rows.value) {
        for (let i = 0; i < r.guess.length; i++) {
            if (r.guess[i] !== L) continue
            const m = r.mask[i]
            if (m === 'G') best = 'hit'
            else if (m === 'Y' && best !== 'hit') best = 'partial'
            else if (m === 'B' && best === 'unknown') best = 'miss'
        }
        if (best === 'hit') break
    }
    return best
}

// Share functionality
async function onShare() {
    try {
        const text = store.shareText()
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text)
            blip('Copied to clipboard!', 'info')
        } else {
            const textArea = document.createElement('textarea')
            textArea.value = text
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            blip('Copied to clipboard!', 'info')
        }

        if (navigator.share) {
            await navigator.share({ text })
        }
    } catch (error) {
        console.warn('Error sharing:', error)
        blip('Share failed', 'error')
    }
}

// Close completion overlay
function closeCompletionOverlay() {
    showCompletionOverlay.value = false
}

// New game handler with proper state management
async function onNewGame() {
    if (isNewGamePending.value || store.loading) return

    isNewGamePending.value = true
    showCompletionOverlay.value = false

    try {
        // Reset animation state
        isAnimating.value = false
        revealingRow.value = -1

        // Start new game
        await store.startNewGame()
    } catch (error) {
        console.error('Error starting new game:', error)
        blip('Failed to start new game', 'error')
    } finally {
        isNewGamePending.value = false
    }
}
</script>

<style scoped>
.prevent-zoom :is(button, [role="button"]) {
    touch-action: manipulation;
}

/* conic win-rate ring */
.winring {
    width: 56px;
    height: 56px;
    border-radius: 9999px;
    /* progress arc + remainder */
    background:
        conic-gradient(#22c55e var(--pct), rgba(255, 255, 255, 0.08) 0);
    /* make it a ring (cut out center) */
    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 0);
    mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 0);
    /* subtle inner glow */
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

/* 3D flip scaffolding */
.tile {
    perspective: 800px;
    perspective-origin: center center;
}

.flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transform: rotateX(0deg);
}

/* flipped shows the back face */
.flipped {
    transform: rotateX(180deg);
}

/* animate only the newest row; old rows are static (no jitter on hydration) */
.with-transition {
    transition: transform 600ms cubic-bezier(.2, .7, .2, 1);
}

.no-transition {
    transition: none;
}

/* Faces */
.face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
}

.face.back {
    transform: rotateX(180deg);
}

/* Shake */
@keyframes rowShake {

    10%,
    90% {
        transform: translateX(-1px);
    }

    20%,
    80% {
        transform: translateX(2px);
    }

    30%,
    50%,
    70% {
        transform: translateX(-4px);
    }

    40%,
    60% {
        transform: translateX(4px);
    }
}

.row-shake {
    animation: rowShake 450ms ease both;
}

/* Fade toast */
.fade-enter-active,
.fade-leave-active {
    transition: opacity .18s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Pulse animation for loading skeleton */
@keyframes pulse {

    0%,
    100% {
        opacity: 0.3;
    }

    50% {
        opacity: 0.5;
    }
}
</style>