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
                    class="found-group rounded-xl p-4 border backdrop-blur-sm" :class="[
                        store.DIFFICULTY_COLORS[group.difficulty].bg,
                        store.DIFFICULTY_COLORS[group.difficulty].border
                    ]">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="text-xs uppercase tracking-wider opacity-75"
                                :class="store.DIFFICULTY_COLORS[group.difficulty].text">
                                {{ group.difficulty }}
                            </div>
                            <div class="flex gap-2 font-semibold"
                                :class="store.DIFFICULTY_COLORS[group.difficulty].text">
                                <span v-for="word in group.words" :key="word">{{ word }}</span>
                            </div>
                        </div>
                        <CheckCircle2 class="w-5 h-5 opacity-50" />
                    </div>
                </div>
            </TransitionGroup>

            <!-- Game board -->
            <div class="grid grid-cols-4 gap-2" :class="{ 'shake-grid': shakeGrid }">
                <TransitionGroup name="word-tile" tag="div" class="contents">
                    <button v-for="word in store.availableWords" :key="word" @click="toggleWord(word)"
                        :disabled="store.isComplete"
                        class="word-tile relative h-20 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105"
                        :class="getWordClasses(word)">
                        <span class="relative z-10">{{ word }}</span>

                        <!-- Selection glow -->
                        <div v-if="store.selected.includes(word)"
                            class="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 animate-pulse" />
                    </button>
                </TransitionGroup>
            </div><!-- Game board -->
<div class="grid grid-cols-4 gap-2" :class="{ 'shake-grid': shakeGrid }">
  <TransitionGroup name="word-tile" tag="div" class="contents">
    <button
      v-for="word in store.availableWords"
      :key="word"
      @click="toggleWord(word)"
      :disabled="store.isComplete"
      class="word-tile relative h-20 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105"
      :class="getWordClasses(word)"
    >
      <span class="relative z-10">{{ word }}</span>

      <!-- Selection glow -->
      <div
        v-if="store.selected.includes(word)"
        class="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 animate-pulse"
      />
    </button>
  </TransitionGroup>
</div>


            <!-- Controls -->
            <div class="flex gap-3">
                <button @click="store.deselectAll()" :disabled="store.selected.length === 0 || store.isComplete"
                    class="flex-1 px-4 py-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm">
                    Clear Selection
                </button>
                <button @click="submitGuess" :disabled="!store.canSubmit"
                    class="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    :class="store.canSubmit
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/20'
                        : 'bg-zinc-800/50 text-zinc-400'">
                    {{ submitText }}
                </button>
            </div>

            <!-- Feedback messages -->
            <Transition name="fade">
                <div v-if="feedbackMsg" class="text-center py-2 px-4 rounded-xl text-sm font-medium"
                    :class="feedbackClasses">
                    {{ feedbackMsg }}
                </div>
            </Transition>

            <!-- Debug info (dev mode) -->
            <div v-if="showDebug" class="mt-8 p-4 bg-zinc-900/50 rounded-xl text-xs font-mono">
                <div class="text-zinc-500 mb-2">Debug (dev mode):</div>
                <div v-for="(words, difficulty) in store.groups" :key="difficulty" class="mb-1">
                    <span :class="store.DIFFICULTY_COLORS[difficulty].text">{{ difficulty }}:</span>
                    <span class="text-zinc-400 ml-2">{{ words.join(', ') }}</span>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useConnectionsStore } from '@/stores/dailyGames/useConnectionsStore'
import ConnectionsCompletionOverlay from './components/ConnectionsCompletionOverlay.vue'
import { CheckCircle2 } from 'lucide-vue-next'

const store = useConnectionsStore()

const shakeGrid = ref(false)
const feedbackMsg = ref('')
const feedbackType = ref('info')
const showCompletionOverlay = ref(false)

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
    const baseClasses = [
        'border',
        'backdrop-blur-sm',
        'relative',
        'overflow-hidden'
    ]

    if (store.isComplete) {
        baseClasses.push('opacity-50', 'cursor-not-allowed', 'bg-zinc-800/50', 'border-zinc-700/50')
    } else if (isSelected) {
        baseClasses.push(
            'bg-gradient-to-br', 'from-violet-800/50', 'to-fuchsia-800/50',
            'border-violet-500/70', 'text-white', 'shadow-lg', 'shadow-violet-500/20',
            'scale-105'
        )
    } else {
        baseClasses.push(
            'bg-zinc-800/50', 'border-zinc-700/50', 'text-zinc-200',
            'hover:bg-zinc-700/50', 'hover:border-zinc-600/70'
        )
    }

    return baseClasses
}

function toggleWord(word) {
    store.toggleWord(word)
}

async function submitGuess() {
    if (!store.canSubmit) return

    feedbackMsg.value = ''
    const result = await store.submitGuess()

    switch (result.result) {
        case 'correct':
            feedbackMsg.value = `Found ${result.difficulty} group!`
            feedbackType.value = 'correct'
            setTimeout(() => { feedbackMsg.value = '' }, 2000)

            if (store.status === 'won') {
                setTimeout(() => {
                    showCompletionOverlay.value = true
                }, 500)
            }
            break

        case 'one-away':
            feedbackMsg.value = result.message
            feedbackType.value = 'one-away'
            shakeGrid.value = true
            setTimeout(() => {
                shakeGrid.value = false
                feedbackMsg.value = ''
            }, 1500)
            break

        case 'incorrect':
            feedbackMsg.value = 'Not quite right'
            feedbackType.value = 'incorrect'
            shakeGrid.value = true
            setTimeout(() => {
                shakeGrid.value = false
                feedbackMsg.value = ''
            }, 1500)
            break

        case 'duplicate':
            feedbackMsg.value = result.message
            feedbackType.value = 'info'
            setTimeout(() => { feedbackMsg.value = '' }, 1500)
            break

        case 'lost':
            feedbackMsg.value = 'Out of guesses!'
            feedbackType.value = 'incorrect'
            setTimeout(() => {
                showCompletionOverlay.value = true
                feedbackMsg.value = ''
            }, 500)
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

    // Show completion overlay if game is already complete
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
/* Found group animations */
.found-group-enter-active,
.found-group-leave-active {
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.found-group-enter-from {
    opacity: 0;
    transform: translateY(-20px) scale(0.8);
}

.found-group-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
}

.found-group-move {
    transition: transform 0.5s ease;
}

/* Word tile animations */
.word-tile-enter-active,
.word-tile-leave-active {
    transition: all 0.3s ease;
}

.word-tile-enter-from {
    opacity: 0;
    transform: scale(0);
}

.word-tile-leave-to {
    opacity: 0;
    transform: scale(0) rotate(180deg);
}

.word-tile-move {
    transition: transform 0.3s ease;
}

/* Shake animation */
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
        transform: translateX(-4px);
    }

    20%,
    40%,
    60%,
    80% {
        transform: translateX(4px);
    }
}

.shake-grid {
    animation: shake 0.5s ease-in-out;
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
</style>