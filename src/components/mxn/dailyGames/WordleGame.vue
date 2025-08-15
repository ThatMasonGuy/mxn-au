<template>
    <div class="flex flex-col items-center gap-4">
        <!-- Grid (now with skeleton base + words overlay) -->
        <div class="w-full mx-auto max-w-[min(92vw,22rem)] relative no-animate select-none">
            <!-- Skeleton base: always mounted to preserve height; hidden when not loading -->
            <div :class="[
                'grid grid-rows-6 gap-1 transition-opacity',
                store.wordle.loading ? 'opacity-100' : 'opacity-0 pointer-events-none'
            ]">
                <div v-for="r in 6" :key="'sk-r-' + r" class="grid grid-cols-5 gap-1">
                    <div v-for="c in 5" :key="'sk-' + r + '-' + c" class="grid place-items-center">
                        <Skeleton class="rounded-md w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12" />
                    </div>
                </div>
            </div>

            <!-- Real letters overlay -->
            <div class="absolute inset-0 flex flex-col items-center gap-1" v-show="!store.wordle.loading">
                <div v-for="r in 6" :key="'r-' + r" class="grid grid-cols-5 gap-1 justify-center">
                    <div v-for="c in 5" :key="'c-' + r + '-' + c"
                        class="grid place-items-center rounded-md font-semibold border leading-none w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12"
                        :class="cellClass(r - 1, c - 1)">
                        {{ cellChar(r - 1, c - 1) }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Flash message -->
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

        <div v-if="store.wordle.loading" class="text-xs text-zinc-400 text-center">Checking guess…</div>

        <!-- Keyboard -->
        <div class="w-full mx-auto max-w-[min(92vw,22rem)] mt-4">
            <div class="flex flex-col gap-1">
                <div class="flex gap-1">
                    <button v-for="k in ROW1" :key="k"
                        class="flex-1 h-12 rounded border text-base font-medium transition-colors" :class="keyClass(k)"
                        :disabled="!playable || store.wordle.isComplete || store.wordle.loading" @click="addLetter(k)">
                        {{ k }}
                    </button>
                </div>

                <div class="flex gap-1">
                    <button v-for="k in ROW2" :key="k"
                        class="flex-1 h-12 rounded border text-base font-medium transition-colors" :class="keyClass(k)"
                        :disabled="!playable || store.wordle.isComplete || store.wordle.loading" @click="addLetter(k)">
                        {{ k }}
                    </button>
                </div>

                <div class="flex gap-1">
                    <!-- Enter -->
                    <button
                        class="flex-[1.5] h-12 rounded border text-sm font-medium transition-colors grid place-items-center"
                        :class="keyClass('ENTER')"
                        :disabled="!playable || store.wordle.isComplete || store.wordle.loading" @click="submit">
                        <CornerDownLeft class="w-4 h-4" />
                    </button>

                    <button v-for="k in ROW3" :key="k"
                        class="flex-1 h-12 rounded border text-base font-medium transition-colors" :class="keyClass(k)"
                        :disabled="!playable || store.wordle.isComplete || store.wordle.loading" @click="addLetter(k)">
                        {{ k }}
                    </button>

                    <!-- Backspace -->
                    <button
                        class="flex-[1.5] h-12 rounded border text-sm font-medium transition-colors grid place-items-center"
                        :class="keyClass('BKSP')"
                        :disabled="!playable || store.wordle.isComplete || store.wordle.loading" @click="backspace">
                        <Delete class="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { CornerDownLeft, Delete } from 'lucide-vue-next'
import { Skeleton } from '@/components/ui/skeleton'
import { useDailyStore } from '@/stores/useDailyStore'
import words from 'word-list-json'

const props = defineProps({
    gameId: { type: String, default: 'wordle' },
    playable: { type: Boolean, default: true },
})
const emit = defineEmits(['completed'])

const store = useDailyStore()
const validWords = new Set(words.map((w) => w.toUpperCase()))

// Flash message state
const flash = ref({ visible: false, message: '', tone: 'info' })
let flashTimer

function showFlash(message, tone = 'warn', ms = 1400) {
    clearTimeout(flashTimer)
    flash.value = { visible: true, message, tone }
    flashTimer = setTimeout(() => (flash.value.visible = false), ms)
}

const ROW1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
const ROW2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']
const ROW3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M']

onMounted(async () => {
    await store.initializeGames()
    window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey)
    clearTimeout(flashTimer)
})

function onKey(e) {
    if (!props.playable || store.wordle.isComplete || store.wordle.loading) return
    const k = e.key
    if (/^[a-zA-Z]$/.test(k)) addLetter(k)
    else if (k === 'Backspace') backspace()
    else if (k === 'Enter') submit()
}

function addLetter(ch) {
    if (!props.playable || store.wordle.isComplete || store.wordle.loading) return
    store.addWordleLetter(ch)
}

function backspace() {
    if (!props.playable || store.wordle.isComplete || store.wordle.loading) return
    store.deleteWordleLetter()
}

async function submit() {
    if (!props.playable || store.wordle.isComplete || store.wordle.loading) return
    if (store.wordle.current.length !== 5) {
        showFlash('Not enough letters', 'warn')
        return
    }
    if (!validWords.has(store.wordle.current)) {
        showFlash('Word not in list', 'warn')
        return
    }
    const { success, message } = await store.submitWordleGuess()
    if (!success && message) showFlash(message, 'warn')
    if (store.wordle.isComplete) emit('completed')
}

function keyClass(k) {
    const s = store.wordle.kb[k] || 'u'
    if (k === 'ENTER' || k === 'BKSP') return 'border-zinc-700 bg-zinc-900/70 hover:bg-zinc-800/60 text-white'
    if (s === 'c') return 'border-emerald-600/60 bg-emerald-600/20 text-white'
    if (s === 'p') return 'border-amber-600/60 bg-amber-600/20 text-white'
    if (s === 'x') return 'border-zinc-800 bg-zinc-800/70 text-zinc-500'
    return 'border-zinc-700 bg-zinc-900/70 hover:bg-zinc-800/60 text-white'
}

function cellChar(r, c) {
    const locked = r < store.wordle.rows.length
    if (locked) return store.wordle.rows[r]?.[c] || ''
    const activeRow = r === store.wordle.rows.length
    return activeRow && !store.wordle.isComplete ? store.wordle.current[c] || '' : ''
}

function cellClass(r, c) {
    const locked = r < store.wordle.rows.length
    if (locked) {
        const fb = store.wordle.feedback[r]?.[c]
        if (fb === 'correct') return 'border-emerald-600/60 bg-emerald-600/20'
        if (fb === 'present') return 'border-amber-600/60 bg-amber-600/20'
        return 'border-zinc-700/80 bg-zinc-900/60'
    }
    const activeRow = r === store.wordle.rows.length
    if (activeRow && store.wordle.current[c]) return 'border-zinc-600/80 bg-zinc-800/60'
    return 'border-zinc-700/80 bg-zinc-900/40'
}

// Reset function for parent
async function resetBoard() {
    store.resetGames()
    flash.value = { visible: false, message: '', tone: 'info' }
    clearTimeout(flashTimer)
}

defineExpose({ resetBoard, isCompleted: computed(() => store.wordle.isComplete) })
</script>

<style scoped>
/* Keep skeletons from pulsing (blink) */
:deep(.no-animate .animate-pulse) {
    animation: none !important;
}
</style>