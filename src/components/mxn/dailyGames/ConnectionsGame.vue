<template>
    <div class="flex flex-col items-center gap-4">
        <!-- Top row: instructions -->
        <div class="w-full max-w-md flex items-center justify-between">
            <div v-if="!isComplete && status === 'idle' && !hasError" class="text-xs text-zinc-400">
                Find groups of 4 words that share something in common.
            </div>
        </div>

        <!-- Error Banner (centered line height) -->
        <div v-if="hasError" class="w-full max-w-md rounded-lg border border-rose-600/40 bg-rose-600/10 p-3">
            <div class="flex items-center justify-between gap-3">
                <span class="leading-none text-sm text-rose-300">{{ errorMessage }}</span>
                <Button size="sm" variant="outline"
                    class="border-rose-600/40 bg-transparent hover:bg-rose-600/20 text-rose-300"
                    @click="retry">Retry</Button>
            </div>
        </div>

        <!-- Grid Wrapper (always present; no background card) -->
        <div class="w-full max-w-md">
            <div class="relative no-animate" :class="{ 'shake-animation': isShaking }">
                <!-- Base skeleton grid (kept in DOM; shown/hidden to avoid blinking) -->
                <div class="grid grid-cols-4 gap-2">
                    <div v-for="i in 16" :key="'s-' + i" class="aspect-square">
                        <Skeleton class="w-full h-full rounded-md" />
                    </div>
                </div>

                <!-- Words overlay -->
                <div class="absolute inset-0 grid grid-cols-4 gap-2" v-show="isReady">
                    <button v-for="(w, i) in cells" :key="'cell-' + i" :disabled="!playable || loading || isComplete"
                        @click="toggleWord(w)"
                        class="aspect-square flex items-center justify-center rounded-md text-center leading-tight text-sm md:text-base border transition-all duration-200 p-2"
                        :class="getWordClass(w)">
                        {{ w }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Controls: pill ABOVE, wider buttons -->
        <div v-if="!isComplete" class="w-full max-w-md">
            <div class="flex justify-center mb-2">
                <div :class="['px-2.5 py-1 rounded-full border text-xs font-medium', mistakesPillClass]">
                    Mistakes left: <span class="ml-1 font-bold">{{ mistakesLeft }}</span>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <Button size="sm" variant="ghost"
                    class="border border-zinc-800/80 bg-transparent px-5 md:px-6 min-w-[7.5rem] justify-center"
                    :disabled="loading" @click="shuffle">
                    Shuffle
                </Button>
                <Button size="sm" class="bg-violet-600 hover:bg-violet-700 px-5 md:px-6 min-w-[7.5rem] justify-center"
                    :disabled="loading || selectedCount < 4" @click="submit">
                    Submit ({{ selectedCount }}/4)
                </Button>
            </div>
            <div v-if="loading" class="text-xs text-zinc-400 text-center mt-2">Checking…</div>
        </div>

        <!-- Completion -->
        <div v-if="isComplete" class="text-center text-sm text-emerald-300">Nicely done. Come back tomorrow for a new
            puzzle.</div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useDailyStore } from '@/stores/useDailyStore'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const props = defineProps({
    gameId: { type: String, default: 'connections' },
    playable: { type: Boolean, default: false },
})
const emit = defineEmits(['completed'])

const store = useDailyStore()

// ---- derived store state ----
const status = computed(() => store?.connections?.status ?? 'idle')
const loading = computed(() => !!store?.connections?.loading)
const isComplete = computed(() => !!store?.connections?.isComplete || status.value === 'won')

// prefer remainingWords -> words -> pool; fallback empty array
const words = computed(() => {
    const c = store?.connections || {}
    if (Array.isArray(c.remainingWords) && c.remainingWords.length === 16) return c.remainingWords
    if (Array.isArray(c.words) && c.words.length === 16) return c.words
    if (Array.isArray(c.pool) && c.pool.length === 16) return c.pool
    return []
})

// always produce 16 cells for stable layout/keys
const cells = computed(() => {
    const arr = words.value
    if (arr.length === 16) return arr
    return Array.from({ length: 16 }, () => '')
})

const isReady = computed(() => !loading.value && !hasError.value && words.value.length === 16)

// selection is local; store only receives final guesses
const selected = ref(new Set())
const selectedCount = computed(() => selected.value.size)

function toggleWord(w) {
    if (!props.playable || loading.value || isComplete.value || !w) return
    const s = new Set(selected.value)
    if (s.has(w)) s.delete(w)
    else if (s.size < 4) s.add(w)
    selected.value = s
}

async function submit() {
    if (selected.value.size !== 4) return
    try {
        await store.submitConnectionsGuess(Array.from(selected.value))
        selected.value.clear()
        if (!isComplete.value) {
            isShaking.value = true
            setTimeout(() => (isShaking.value = false), 450)
        }
    } catch (e) {
        localError.value = e?.message || 'Something went wrong while submitting your guess.'
    }
}

function shuffle() { try { store.shuffleConnections?.() } catch { } }

// ---- mistakes pill ----
const mistakesLeft = computed(() => {
    const c = store?.connections || {}
    if (Number.isFinite(c.mistakesLeft)) return c.mistakesLeft
    if (Number.isFinite(c.livesLeft)) return c.livesLeft
    if (Number.isFinite(c.remainingMistakes)) return c.remainingMistakes
    if (Number.isFinite(c.strikesLeft)) return c.strikesLeft
    const used = c.mistakesUsed ?? c.incorrectGuesses ?? c.strikes ?? 0
    const allowed = c.mistakesAllowed ?? c.maxMistakes ?? 4
    return Math.max(allowed - used, 0)
})

const mistakesPillClass = computed(() => {
    const m = Number(mistakesLeft.value)
    if (m >= 3) return 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10'
    if (m === 2) return 'border-amber-500/30 text-amber-300 bg-amber-500/10'
    return 'border-rose-500/30 text-rose-300 bg-rose-500/10'
})

// ---- loading / error handling ----
const localError = ref('')
const hasError = computed(() => !!(store?.connections?.error || localError.value))
const errorMessage = computed(() => store?.connections?.error || localError.value)

async function retry() {
    localError.value = ''
    try { await store.initializeGames?.() } catch (e) { localError.value = e?.message || 'Retry failed.' }
}

// complete signal for parent
watch(isComplete, (v) => { if (v) emit('completed') })

// ensure words present on mount in case parent didn’t init (harmless double-call)
onMounted(() => { store.initializeGames?.() })

// ---- styling helpers ----
function getWordClass(w) {
    const base = 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-200'
    if (!w) return 'opacity-70 ' + base
    if (selected.value.has(w)) return 'bg-violet-600/20 border-violet-500 text-violet-200'
    return base
}

const isShaking = ref(false)
</script>

<style scoped>
/* Keep skeletons from pulsing (blink) */
:deep(.no-animate .animate-pulse) {
    animation: none !important;
}

@keyframes shake {

    10%,
    90% {
        transform: translateX(-1px)
    }

    20%,
    80% {
        transform: translateX(2px)
    }

    30%,
    50%,
    70% {
        transform: translateX(-4px)
    }

    40%,
    60% {
        transform: translateX(4px)
    }
}

.shake-animation {
    animation: shake 0.4s both
}
</style>