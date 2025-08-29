<template>
    <div class="connections-game w-full max-w-4xl mx-auto">
        <!-- Loading state -->
        <div v-if="store.loading" class="text-center py-12">
            <div class="animate-pulse text-zinc-400">Loading Connections...</div>
        </div>

        <!-- Game content -->
        <div v-else class="space-y-6">
            <!-- Lives indicator -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="text-sm text-zinc-400">Mistakes remaining:</span>
                    <div class="flex gap-1">
                        <div v-for="i in store.MAX_MISTAKES" :key="i"
                            class="w-2 h-2 rounded-full transition-all duration-300" :class="i <= store.remainingLives
                                ? 'bg-violet-500 shadow-sm shadow-violet-500/50'
                                : 'bg-zinc-700'">
                        </div>
                    </div>
                </div>
                <div v-if="store.foundGroups.length > 0" class="text-sm text-zinc-400">
                    {{ store.foundGroups.length }}/4 groups found
                </div>
            </div>

            <!-- Found groups -->
            <TransitionGroup name="found-group" tag="div" class="space-y-2">
                <div v-for="group in store.foundGroups" :key="group.difficulty"
                    class="found-group rounded-lg p-4 border backdrop-blur-sm" :class="[
                        store.DIFFICULTY_COLORS[group.difficulty].bg,
                        store.DIFFICULTY_COLORS[group.difficulty].border
                    ]">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-xs uppercase tracking-wider font-semibold mb-1"
                                :class="store.DIFFICULTY_COLORS[group.difficulty].text">
                                {{ group.title }}
                            </div>
                            <div class="flex gap-2 text-sm font-medium"
                                :class="store.DIFFICULTY_COLORS[group.difficulty].text">
                                <span v-for="word in group.words" :key="word">{{ word }}</span>
                            </div>
                        </div>
                        <CheckCircle2 class="w-5 h-5 opacity-60" />
                    </div>
                </div>
            </TransitionGroup>

            <!-- Game board -->
            <div class="grid grid-cols-4 gap-3" :class="{ 'shake-grid': shakeGrid }">
                <TransitionGroup name="word-tile" tag="div" class="contents">
                    <button v-for="word in store.availableWords" :key="word" @click="toggleWord(word)"
                        :disabled="store.isComplete || animatingCorrect"
                        class="word-tile relative h-20 rounded-lg font-semibold text-sm transition-all duration-200 border flex items-center justify-center text-center overflow-hidden"
                        :class="getWordClasses(word)" :data-word="word">
                        <span class="relative z-10">{{ word }}</span>

                        <!-- Selection glow effect -->
                        <div v-if="store.selected.includes(word)"
                            class="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-400/50" />
                    </button>
                </TransitionGroup>
            </div>

            <!-- Controls -->
            <div class="flex gap-3">
                <button @click="shuffleBoard" :disabled="store.isComplete || animatingCorrect"
                    class="px-4 py-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm">
                    Shuffle
                </button>
                <button @click="store.deselectAll()"
                    :disabled="store.selected.length === 0 || store.isComplete || animatingCorrect"
                    class="flex-1 px-4 py-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm">
                    Clear Selection
                </button>
                <button @click="submitGuess" :disabled="!store.canSubmit || animatingCorrect"
                    class="flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    :class="store.canSubmit && !animatingCorrect
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/20'
                        : 'bg-zinc-800/50 text-zinc-400'">
                    {{ submitText }}
                </button>
            </div>

            <!-- Feedback messages -->
            <Transition name="fade">
                <div v-if="feedbackMsg" class="text-center py-2 px-4 rounded-lg text-sm font-medium"
                    :class="feedbackClasses">
                    {{ feedbackMsg }}
                </div>
            </Transition>

            <!-- Debug info (dev mode) -->
            <div v-if="showDebug" class="mt-8 p-4 bg-zinc-900/50 rounded-lg text-xs font-mono">
                <div class="text-zinc-500 mb-2">Debug (dev mode):</div>
                <div v-for="(words, difficulty) in store.groups" :key="difficulty" class="mb-1">
                    <span :class="store.DIFFICULTY_COLORS[difficulty].text">{{ difficulty }}:</span>
                    <span class="text-zinc-400 ml-2">{{ words.join(', ') }}</span>
                </div>
                <div class="mt-2 text-zinc-500">
                    Board: {{ store.boardWords.length }} words, Available: {{ store.availableWords.length }} words
                </div>
            </div>
        </div>

        <!-- Completion overlay -->
        <ConnectionsCompletionOverlay :show="showCompletionOverlay" :is-win="store.status === 'won'"
            :found-groups="store.foundGroups" :mistakes="store.mistakes" :all-groups="store.groups"
            :rollover-at="store.rolloverAt" @close="showCompletionOverlay = false" @share="onShare" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useConnectionsStore } from '@/stores/dailyGames/useConnectionsStore'
import ConnectionsCompletionOverlay from './components/ConnectionsCompletionOverlay.vue'
import { CheckCircle2 } from 'lucide-vue-next'

const store = useConnectionsStore()

const shakeGrid = ref(false)
const feedbackMsg = ref('')
const feedbackType = ref('info')
const showCompletionOverlay = ref(false)
const animatingCorrect = ref(false)

// Show debug in dev mode or with ?dev param
const showDebug = computed(() => {
    try { if (import.meta.env.DEV) return true } catch { }
    return new URLSearchParams(location.search).has('dev')
})

const submitText = computed(() => {
    if (!store.canSubmit) return 'Select 4 words'
    return 'Submit'
})

const feedbackClasses = computed(() => {
    switch (feedbackType.value) {
        case 'correct':
            return 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30'
        case 'one-away':
            return 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30'
        case 'incorrect':
            return 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/30'
        default:
            return 'bg-zinc-500/20 text-zinc-300 ring-1 ring-zinc-400/30'
    }
})

function getWordClasses(word) {
    const isSelected = store.selected.includes(word)
    const baseClasses = []

    if (store.isComplete) {
        baseClasses.push('opacity-50', 'cursor-not-allowed', 'bg-zinc-800/30', 'border-zinc-700/30', 'text-zinc-500')
    } else if (isSelected) {
        // Subtle selection styling - no scaling
        baseClasses.push(
            'bg-violet-600/15',
            'border-violet-400/70',
            'text-violet-100',
            'shadow-lg',
            'shadow-violet-500/20'
        )
    } else {
        baseClasses.push(
            'bg-zinc-800/40',
            'border-zinc-600/50',
            'text-zinc-200',
            'hover:bg-zinc-700/50',
            'hover:border-zinc-500/70'
        )
    }

    return baseClasses
}

function toggleWord(word) {
    if (!store.isComplete && !animatingCorrect.value) {
        store.toggleWord(word)
    }
}

function shuffleBoard() {
    if (store.isComplete || !store.groups || animatingCorrect.value) return

    const availableWords = store.availableWords
    const shuffled = [...availableWords]

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    const date = store.puzzleId?.replace('connections-', '') || store.todayDate
    store._ensureDay(date)

    const foundWords = store.foundGroups.flatMap(g => g.words)
    store.days[date].boardWords = [...foundWords, ...shuffled]
}

async function animateCorrectGuess(selectedWords) {
    animatingCorrect.value = true

    try {
        const date = store.puzzleId?.replace('connections-', '') || store.todayDate
        store._ensureDay(date)

        // Step 2: Reorder board to move selected words to top positions (like shuffle)
        const availableWords = store.availableWords.filter(word => !selectedWords.includes(word))
        const foundWords = store.foundGroups.flatMap(g => g.words)

        // Put selected words at the beginning of available positions, others follow
        store.days[date].boardWords = [...foundWords, ...selectedWords, ...availableWords]

        await new Promise(resolve => setTimeout(resolve, 500))

        // Step 3: Fade out the selected words
        selectedWords.forEach(word => {
            const element = document.querySelector(`[data-word="${word}"]`)
            if (element) {
                element.classList.add('fade-out')
            }
        })

        await new Promise(resolve => setTimeout(resolve, 300))

        // Cleanup - remove highlight classes
        selectedWords.forEach(word => {
            const element = document.querySelector(`[data-word="${word}"]`)
            if (element) {
                element.classList.remove('correct-highlight', 'fade-out')
            }
        })

    } catch (error) {
        console.warn('Animation error:', error)
    } finally {
        animatingCorrect.value = false
    }
}

async function submitGuess() {
    if (!store.canSubmit || animatingCorrect.value) return

    feedbackMsg.value = ''
    const selectedWords = [...store.selected]

    // Check the guess without applying the result yet
    const result = await store.checkGuess(selectedWords)

    switch (result.result) {
        case 'correct':
            // Animate first, then apply the store update
            await animateCorrectGuess(selectedWords)

            // Now apply the store update
            await store.applyCorrectGuess(result.group)

            feedbackMsg.value = `Found ${result.group.title}!`
            feedbackType.value = 'correct'
            setTimeout(() => { feedbackMsg.value = '' }, 2000)

            if (store.status === 'won') {
                setTimeout(() => {
                    showCompletionOverlay.value = true
                }, 500)
            }
            break

        case 'one-away':
            // Apply the incorrect guess
            await store.applyIncorrectGuess(selectedWords)
            feedbackMsg.value = result.message
            feedbackType.value = 'one-away'
            shakeGrid.value = true
            setTimeout(() => {
                shakeGrid.value = false
                feedbackMsg.value = ''
            }, 1500)
            break

        case 'incorrect':
            const incorrectResult = await store.applyIncorrectGuess(selectedWords)
            if (incorrectResult.result === 'lost') {
                feedbackMsg.value = 'Out of guesses!'
                feedbackType.value = 'incorrect'
                setTimeout(() => {
                    showCompletionOverlay.value = true
                    feedbackMsg.value = ''
                }, 500)
            } else {
                feedbackMsg.value = 'Not quite right'
                feedbackType.value = 'incorrect'
                shakeGrid.value = true
                setTimeout(() => {
                    shakeGrid.value = false
                    feedbackMsg.value = ''
                }, 1500)
            }
            break

        case 'duplicate':
            feedbackMsg.value = result.message
            feedbackType.value = 'info'
            setTimeout(() => { feedbackMsg.value = '' }, 1500)
            break
    }
}

async function onShare() {
    try {
        const text = store.shareText()

        if (navigator.share) {
            await navigator.share({ text })
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(text)
            feedbackMsg.value = 'Copied to clipboard!'
            feedbackType.value = 'info'
            setTimeout(() => { feedbackMsg.value = '' }, 1500)
        }
    } catch (error) {
        console.warn('Share failed:', error)
    }
}

// Initialize
onMounted(async () => {
    store.initAuthListener()
    await store.loadDaily()

    if (store.isComplete) {
        setTimeout(() => {
            showCompletionOverlay.value = true
        }, 500)
    }
})

// Watch for status changes
watch(() => store.status, (newStatus, oldStatus) => {
    if (oldStatus === 'idle' && (newStatus === 'won' || newStatus === 'lost')) {
        if (!showCompletionOverlay.value) {
            setTimeout(() => {
                showCompletionOverlay.value = true
            }, 500)
        }
    }
})
</script>

<style scoped>
/* Found group animations - simple sliding */
.found-group-enter-active,
.found-group-leave-active {
    transition: all 0.4s ease;
}

.found-group-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}

.found-group-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

.found-group-move {
    transition: transform 0.4s ease;
}

/* Word tile animations - simple sliding */
.word-tile-enter-active,
.word-tile-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.word-tile-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.word-tile-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.word-tile-move {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced shake animation with less aggressive movement */
@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
        transform: translateX(-2px);
    }

    20%,
    40%,
    60%,
    80% {
        transform: translateX(2px);
    }
}

.shake-grid {
    animation: shake 0.4s ease-in-out;
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Word tile improvements */
.word-tile {
    min-height: 5rem;
    word-break: break-word;
    hyphens: auto;
    /* Add hardware acceleration for smoother animations */
    transform: translateZ(0);
    backface-visibility: hidden;
    will-change: transform, opacity, background-color, border-color;
}

/* Prevent layout shifts during animations */
.grid-cols-4 {
    /* Ensure grid maintains its structure during animations */
    align-content: start;
}

/* Smooth transitions for found groups */
.found-group {
    /* Ensure found groups don't cause layout shifts */
    transform: translateZ(0);
    backface-visibility: hidden;
}

/* Prevent pointer events during animations */
.word-tile:disabled {
    pointer-events: none;
}

/* Mobile optimizations */
@media (max-width: 640px) {
    .word-tile {
        min-height: 4rem;
        font-size: 0.75rem;
        /* Reduce animation complexity on mobile */
        will-change: transform, opacity;
    }

    .grid-cols-4 {
        gap: 0.5rem;
    }
}
</style>