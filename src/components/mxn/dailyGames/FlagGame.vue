<template>
    <div class="flex flex-col items-center gap-6 py-4">
        <!-- Game Status -->
        <div class="text-center">
            <h3 class="text-lg font-semibold mb-2">Guess the Country</h3>
            <div class="flex items-center justify-center gap-2 text-sm">
                <span class="text-zinc-400">Round</span>
                <span class="font-bold">{{ currentRound }}/{{ totalRounds }}</span>
                <span class="text-zinc-400 ml-2">Score</span>
                <span class="font-bold text-emerald-400">{{ score }}</span>
            </div>
        </div>

        <!-- Flag Display -->
        <div class="relative group">
            <div class="w-64 h-40 rounded-xl overflow-hidden border-2 border-zinc-700 shadow-2xl">
                <div
                    class="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-zinc-800 to-zinc-900">
                    {{ flags[currentFlagIndex].emoji }}
                </div>
            </div>
            <div
                class="absolute inset-0 rounded-xl bg-gradient-to-t from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            </div>
        </div>

        <!-- Input Area -->
        <div class="w-full max-w-sm space-y-3">
            <input v-model="userGuess" @keyup.enter="submitGuess" :disabled="isCompleted || showingResult" type="text"
                placeholder="Enter country name..."
                class="w-full px-4 py-3 rounded-xl bg-zinc-900/70 border border-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                :class="{ 'opacity-50 cursor-not-allowed': isCompleted || showingResult }" />

            <!-- Hints -->
            <div v-if="hintsUsed < maxHints && !showingResult" class="flex items-center justify-between">
                <button @click="useHint" :disabled="isCompleted || showingResult"
                    class="px-3 py-1.5 text-xs rounded-lg bg-amber-600/20 border border-amber-600/40 hover:bg-amber-600/30 transition-colors">
                    Use Hint ({{ maxHints - hintsUsed }} left)
                </button>
                <div v-if="currentHint" class="text-sm text-amber-400">
                    {{ currentHint }}
                </div>
            </div>
        </div>

        <!-- Submit Button -->
        <button @click="submitGuess" :disabled="!userGuess || isCompleted || showingResult"
            class="px-6 py-2.5 rounded-xl font-semibold transition-all"
            :class="!userGuess || isCompleted || showingResult
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:shadow-lg hover:shadow-violet-500/25 transform hover:scale-105'">
            {{ isCompleted ? 'Game Complete!' : showingResult ? 'Next...' : 'Submit' }}
        </button>

        <!-- Result Display -->
        <Transition enter-active-class="transition transform duration-300 ease-out"
            enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
            leave-active-class="transition transform duration-200 ease-in" leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95">
            <div v-if="showingResult" class="text-center space-y-2 p-4 rounded-xl" :class="lastGuessCorrect
                ? 'bg-emerald-500/10 border border-emerald-500/30'
                : 'bg-rose-500/10 border border-rose-500/30'">
                <div class="text-2xl">{{ lastGuessCorrect ? '✅' : '❌' }}</div>
                <div class="font-semibold">
                    {{ lastGuessCorrect ? 'Correct!' : `It was ${flags[currentFlagIndex].name}` }}
                </div>
            </div>
        </Transition>

        <!-- Progress Bar -->
        <div class="w-full max-w-sm">
            <div class="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all duration-500"
                    :style="`width: ${(currentRound / totalRounds) * 100}%`"></div>
            </div>
        </div>

        <!-- Final Results -->
        <Transition enter-active-class="transition transform duration-500 ease-out"
            enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
            <div v-if="isCompleted"
                class="w-full max-w-sm space-y-4 p-6 rounded-xl bg-zinc-900/70 border border-zinc-700">
                <div class="text-center">
                    <div class="text-3xl mb-2">🎉</div>
                    <h4 class="text-xl font-bold mb-1">Game Complete!</h4>
                    <p class="text-zinc-400 text-sm">You scored {{ score }}/{{ totalRounds }}</p>
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-zinc-400">Correct Answers</span>
                        <span class="font-semibold text-emerald-400">{{ correctAnswers }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-zinc-400">Hints Used</span>
                        <span class="font-semibold text-amber-400">{{ totalHintsUsed }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-zinc-400">Accuracy</span>
                        <span class="font-semibold">{{ Math.round((correctAnswers / totalRounds) * 100) }}%</span>
                    </div>
                </div>

                <button @click="shareResults"
                    class="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-600/40 hover:bg-violet-600/30 transition-colors font-semibold text-sm">
                    Share Results
                </button>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDailyStore } from '@/stores/useDailyStore'

const props = defineProps({
    gameId: { type: String, required: true },
    playable: { type: Boolean, default: true }
})

const emit = defineEmits(['completed'])

const daily = useDailyStore()

// Sample flag data - in production, this would come from an API/database
const flags = [
    { emoji: '🇯🇵', name: 'Japan', hints: ['Island nation', 'Rising sun', 'Mount Fuji'] },
    { emoji: '🇧🇷', name: 'Brazil', hints: ['South America', 'Amazon rainforest', 'Carnival'] },
    { emoji: '🇦🇺', name: 'Australia', hints: ['Oceania', 'Kangaroos', 'Great Barrier Reef'] },
    { emoji: '🇨🇦', name: 'Canada', hints: ['North America', 'Maple leaf', 'Second largest country'] },
    { emoji: '🇪🇬', name: 'Egypt', hints: ['Africa', 'Pyramids', 'Nile River'] },
    { emoji: '🇳🇴', name: 'Norway', hints: ['Scandinavia', 'Fjords', 'Northern Lights'] },
    { emoji: '🇰🇷', name: 'South Korea', hints: ['East Asia', 'K-pop', 'Seoul'] },
    { emoji: '🇲🇽', name: 'Mexico', hints: ['North America', 'Aztecs', 'Tacos'] },
    { emoji: '🇳🇿', name: 'New Zealand', hints: ['Oceania', 'Kiwi bird', 'Lord of the Rings'] },
    { emoji: '🇬🇷', name: 'Greece', hints: ['Europe', 'Olympics origin', 'Parthenon'] }
]

// Shuffle and select flags for today's game
const selectedFlags = ref([])
const totalRounds = 5
const currentRound = ref(1)
const currentFlagIndex = ref(0)
const userGuess = ref('')
const score = ref(0)
const correctAnswers = ref(0)
const isCompleted = ref(false)
const showingResult = ref(false)
const lastGuessCorrect = ref(false)

// Hints
const maxHints = 2
const hintsUsed = ref(0)
const totalHintsUsed = ref(0)
const currentHint = ref('')

function initGame() {
    // Shuffle and select flags
    const shuffled = [...flags].sort(() => Math.random() - 0.5)
    selectedFlags.value = shuffled.slice(0, totalRounds)
    currentFlagIndex.value = 0
}

function useHint() {
    if (hintsUsed.value >= maxHints) return

    const flag = selectedFlags.value[currentFlagIndex.value]
    currentHint.value = flag.hints[hintsUsed.value]
    hintsUsed.value++
    totalHintsUsed.value++
}

async function submitGuess() {
    if (!userGuess.value || isCompleted.value || showingResult.value) return

    const correct = selectedFlags.value[currentFlagIndex.value].name.toLowerCase() === userGuess.value.toLowerCase()
    lastGuessCorrect.value = correct

    if (correct) {
        score.value++
        correctAnswers.value++
    }

    showingResult.value = true

    setTimeout(async () => {
        if (currentRound.value < totalRounds) {
            currentRound.value++
            currentFlagIndex.value++
            userGuess.value = ''
            showingResult.value = false
            hintsUsed.value = 0
            currentHint.value = ''
        } else {
            await completeGame()
        }
    }, 2000)
}

async function completeGame() {
    isCompleted.value = true
    showingResult.value = false

    const success = score.value >= Math.ceil(totalRounds / 2) // Success if > 50% correct

    // Update store
    await daily.updateGameProgress('flag', {
        status: success ? 'won' : 'lost',
        score: score.value,
        correctAnswers: correctAnswers.value,
        hintsUsed: totalHintsUsed.value
    })

    // Record result
    await daily.recordResult('flag', {
        success: success,
        attempts: totalRounds - correctAnswers.value + 1, // Convert to attempts format
        metrics: {
            score: score.value,
            totalRounds: totalRounds,
            hintsUsed: totalHintsUsed.value
        }
    })

    emit('completed', {
        success: success,
        score: score.value,
        totalRounds: totalRounds,
        hintsUsed: totalHintsUsed.value
    })
}

function shareResults() {
    const today = daily.today
    const accuracy = Math.round((correctAnswers.value / totalRounds) * 100)
    const shareText = `MXN Daily — Flag Quest ${today}\n\nScore: ${score.value}/${totalRounds}\nAccuracy: ${accuracy}%\nHints: ${totalHintsUsed.value}\n\nPlay at mxn.au/daily?game=flag`

    navigator.clipboard?.writeText(shareText).catch(() => { })
}

onMounted(() => {
    initGame()
})
</script>