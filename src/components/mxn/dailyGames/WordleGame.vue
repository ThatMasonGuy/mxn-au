// Simple keyboard helper functions - no extra functionality needed<template>
    <div class="flex flex-col items-center gap-4">
        <!-- grid (tight + centered, keep current size) -->
        <div class="w-full mx-auto max-w-[min(92vw,22rem)]">
            <div class="flex flex-col items-center gap-1">
                <div v-for="r in 6" :key="'r-' + r" class="grid grid-cols-5 gap-1 justify-center">
                    <div v-for="c in 5" :key="'c-' + r + '-' + c" class="grid place-items-center rounded-md font-semibold border leading-none
                        w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12" :class="cellClass(r - 1, c - 1)">
                        {{ cellChar(r - 1, c - 1) }}
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-center mt-1 h-6">
            <Transition enter-active-class="transition transform duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-1 scale-95"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition transform duration-250 ease-in"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 -translate-y-1 scale-95">
                <div v-if="flash.visible" :class="[
                    'px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium backdrop-blur-md shadow-lg ring-1',
                    flash.tone === 'warn' && 'bg-amber-500/15 text-amber-300 ring-amber-400/30',
                    flash.tone === 'ok' && 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30',
                    flash.tone === 'info' && 'bg-sky-500/15 text-sky-300 ring-sky-400/30'
                ]">
                    {{ flash.message }}
                </div>
            </Transition>
        </div>
        <div v-if="isLoading" class="text-xs text-zinc-400 text-center">Loading today's word…</div>

        <!-- Simple responsive keyboard -->
        <div class="w-full mx-auto max-w-[min(92vw,22rem)] mt-4">
            <div class="space-y-2">
                <div class="flex gap-1">
                    <button v-for="k in ROW1" :key="k"
                        class="flex-1 h-12 rounded border text-base font-medium transition-colors" :class="keyClass(k)"
                        :disabled="!playable || status !== 'idle' || isLocked || isCompleted" @click="addLetter(k)">
                        {{ k }}
                    </button>
                </div>

                <div class="flex gap-1">
                    <button v-for="k in ROW2" :key="k"
                        class="flex-1 h-12 rounded border text-base font-medium transition-colors" :class="keyClass(k)"
                        :disabled="!playable || status !== 'idle' || isLocked || isCompleted" @click="addLetter(k)">
                        {{ k }}
                    </button>
                </div>

                <div class="flex gap-1">
                    <!-- Enter -->
                    <button
                        class="flex-[1.5] h-12 rounded border text-sm font-medium transition-colors grid place-items-center"
                        :class="keyClass('ENTER')" :disabled="!playable || status !== 'idle' || isLocked || isCompleted"
                        @click="submit">
                        <CornerDownLeft class="w-4 h-4" />
                    </button>

                    <button v-for="k in ROW3" :key="k"
                        class="flex-1 h-12 rounded border text-base font-medium transition-colors" :class="keyClass(k)"
                        :disabled="!playable || status !== 'idle' || isLocked || isCompleted" @click="addLetter(k)">
                        {{ k }}
                    </button>

                    <!-- Backspace -->
                    <button
                        class="flex-[1.5] h-12 rounded border text-sm font-medium transition-colors grid place-items-center"
                        :class="keyClass('DEL')" :disabled="!playable || status !== 'idle' || isLocked || isCompleted"
                        @click="backspace">
                        <Delete class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>

        <div class="text-xs text-zinc-400">
            {{
                !playable ? 'Locked until its day in AEST' :
                    isLocked ? 'Loading…' :
                        isCompleted ? (status === 'won' ? 'Completed! Well done 🎉' : 'Better luck tomorrow!') :
                            'Type or use the keyboard above'
            }}
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, defineExpose } from 'vue'
import { CornerDownLeft, Delete } from 'lucide-vue-next'
import words from 'word-list-json'
import { useDailyStore } from '@/stores/useDailyStore'

const props = defineProps({
    gameId: { type: String, required: true },
    playable: { type: Boolean, default: true },
    solution: { type: String, default: '' }
})
const emit = defineEmits(['completed'])

const daily = useDailyStore()
const today = computed(() => daily.today)
const solFromStore = computed(() => {
    const c = daily.solutionFor(props.gameId)
    return c?.value || ''
})
const solution = computed(() => (solFromStore.value || props.solution || '').toUpperCase())
const isLoading = computed(() => daily.loadingFor(props.gameId).value)
const isLocked = computed(() => !solution.value || isLoading.value)
const isCompleted = computed(() => status.value === 'won' || status.value === 'lost')

// Get game state from store
const gameState = computed(() => daily.gameStateFor(props.gameId, today.value).value)
const rows = computed(() => gameState.value.rows || [])
const current = computed(() => gameState.value.current || '')
const status = computed(() => gameState.value.status || 'idle')
const kb = computed(() => gameState.value.kb || {})

const WORD_LEN = 5
const MAX_GUESSES = 6
const norm = (s) => s.toUpperCase().replace(/[^A-Z]/g, '').slice(0, WORD_LEN)

/* --- sexier flash --- */
const flash = ref({ visible: false, message: '', tone: 'info' }) // tone: 'warn' | 'ok' | 'info'
let flashTimer
function showFlash(message, tone = 'warn', ms = 1400) {
    clearTimeout(flashTimer)
    flash.value = { visible: true, message, tone }
    flashTimer = setTimeout(() => (flash.value.visible = false), ms)
}

const validWords = new Set(words.map(w => w.toUpperCase()))

onMounted(async () => {
    await daily.init()
    if (!solution.value) await daily.fetchDayChallenge(props.gameId)

    // Reconcile game state FIRST (important for auth'd users switching devices)
    await daily.reconcileGameState(props.gameId, today.value)

    // Then mark as opened (for stats tracking)
    daily.markOpenedToday(props.gameId)

    window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

function onKey(e) {
    if (!props.playable || status.value !== 'idle' || isLocked.value || isCompleted.value) return
    const k = e.key
    if (/^[a-zA-Z]$/.test(k)) addLetter(k)
    else if (k === 'Backspace') backspace()
    else if (k === 'Enter') submit()
}

async function addLetter(ch) {
    if (!props.playable || status.value !== 'idle' || isLocked.value || isCompleted.value) return
    if (current.value.length >= WORD_LEN) return

    const newCurrent = norm(current.value + ch)
    await daily.updateGameProgress(props.gameId, { current: newCurrent })
}

async function backspace() {
    if (!props.playable || status.value !== 'idle' || isLocked.value || isCompleted.value) return

    const newCurrent = current.value.slice(0, -1)
    await daily.updateGameProgress(props.gameId, { current: newCurrent })
}

function evaluate(guess, s) {
    const res = Array(WORD_LEN).fill('b') // g,y,b
    const sol = s.split('')
    const g = guess.split('')
    // greens
    for (let i = 0; i < WORD_LEN; i++) {
        if (g[i] === sol[i]) { res[i] = 'g'; sol[i] = '*'; g[i] = '_' }
    }
    // yellows
    for (let i = 0; i < WORD_LEN; i++) {
        if (g[i] === '_') continue
        const idx = sol.indexOf(g[i])
        if (idx !== -1) { res[i] = 'y'; sol[idx] = '*' }
    }
    return res
}

function bumpKb(guess, score, currentKb) {
    const newKb = { ...currentKb }
    for (let i = 0; i < WORD_LEN; i++) {
        const ch = guess[i]
        const prev = newKb[ch] || 'u'
        const next = score[i] === 'g' ? 'c' : (score[i] === 'y' ? 'p' : prev)
        if (prev === 'c') continue
        if (prev === 'p' && next !== 'c') continue
        newKb[ch] = next
    }
    return newKb
}

function markAbsentLetters(guess, score, s, currentKb) {
    const newKb = { ...currentKb }
    for (let i = 0; i < WORD_LEN; i++) {
        if (score[i] !== 'b') continue
        const ch = guess[i]
        const prev = newKb[ch] || 'u'
        if (prev === 'c' || prev === 'p') continue
        if (!s.includes(ch)) newKb[ch] = 'x'
    }
    return newKb
}

function shareGrid(guesses, s) {
    const lines = guesses.map(g => {
        const sc = evaluate(g, s)
        return sc.map(c => c === 'g' ? '🟩' : c === 'y' ? '🟨' : '⬛').join('')
    })
    return lines.join('\n')
}

async function submit() {
    if (!props.playable || status.value !== 'idle' || isLocked.value || isCompleted.value) return
    if (current.value.length !== WORD_LEN) return showFlash('Need 5 letters', 'info')

    const guess = current.value.toUpperCase()
    if (!validWords.has(guess)) {
        showFlash('Not a valid word', 'warn')
        return
    }

    const s = solution.value
    const score = evaluate(guess, s)
    const newRows = [...rows.value, guess]
    const newKb = markAbsentLetters(guess, score, s, bumpKb(guess, score, kb.value))

    const success = guess === s
    const attempts = newRows.length
    const newStatus = success ? 'won' : (attempts >= MAX_GUESSES ? 'lost' : 'idle')

    // Update game state progressively
    await daily.updateGameProgress(props.gameId, {
        rows: newRows,
        current: '', // Clear current guess after submitting
        kb: newKb,
        status: newStatus
    })

    if (success) {
        showFlash('Nice! 🎉', 'ok', 1600)
        await daily.recordResult(props.gameId, { success: true, attempts, guesses: [...newRows] })
        emit('completed', { success: true, attempts, grid: shareGrid(newRows, s) })
    } else if (attempts >= MAX_GUESSES) {
        showFlash(`It was ${s}`, 'warn', 2000)
        await daily.recordResult(props.gameId, { success: false, attempts, guesses: [...newRows] })
        emit('completed', { success: false, attempts, grid: shareGrid(newRows, s) })
    }
}

/* ---------- rendering helpers ---------- */
function cellChar(r, c) {
    const locked = r < rows.value.length
    if (locked) return rows.value[r][c] || ''
    const activeRow = r === rows.value.length
    // Don't show current input if game is completed
    return activeRow && !isCompleted.value ? (current.value[c] || '') : ''
}

function cellClass(r, c) {
    const locked = r < rows.value.length
    const s = solution.value
    if (locked) {
        const ch = rows.value[r][c]
        if (ch === s[c]) return 'border-emerald-600/60 bg-emerald-600/20'
        if (s.includes(ch)) return 'border-amber-600/60 bg-amber-600/20'
        return 'border-zinc-700/80 bg-zinc-900/60'
    }
    const activeRow = r === rows.value.length
    if (activeRow && current.value[c]) return 'border-zinc-600/80 bg-zinc-800/60'
    return 'border-zinc-700/80 bg-zinc-900/60'
}

/* ---------- keyboard visuals ---------- */
function keyClass(letter) {
    const state = kb.value[letter] || 'u'
    if (state === 'c') return 'border-emerald-600/60 bg-emerald-600/20 text-white'
    if (state === 'p') return 'border-amber-600/60 bg-amber-600/20 text-white'
    if (state === 'x') return 'border-zinc-800 bg-zinc-800/70 text-zinc-500'
    return 'border-zinc-700 bg-zinc-900/70 hover:bg-zinc-800/60 text-white'
}

/* ---------- rows ---------- */
const ROW1 = 'QWERTYUIOP'.split('')
const ROW2 = 'ASDFGHJKL'.split('')
const ROW3 = 'ZXCVBNM'.split('')

/* ---------- expose reset for parent ---------- */
async function resetBoard() {
    await daily.resetGameState(props.gameId, today.value)
    flash.value = { visible: false, message: '', tone: 'info' }
    clearTimeout(flashTimer)
}
defineExpose({ resetBoard, isCompleted })
</script>