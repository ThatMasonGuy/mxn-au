<template>
    <Teleport to="body">
        <!-- Overlay -->
        <Transition name="overlay">
            <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
                @click.self="$emit('close')">
                <!-- Dark backdrop -->
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

                <!-- Confetti Canvas (for wins only) -->
                <canvas v-if="isWin" ref="confettiCanvas" class="absolute inset-0 pointer-events-none"></canvas>

                <!-- Content Card -->
                <Transition name="card" @enter="onCardEnter">
                    <div v-if="showCard" class="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border flex flex-col
                     max-h-[calc(100svh-1.5rem)] sm:max-h-[calc(100svh-2rem)]" :class="cardClasses">
                        <!-- Animated background gradient -->
                        <div class="absolute inset-0" :class="bgGradientClasses"></div>

                        <!-- Glow effect -->
                        <div v-if="isWin" class="absolute inset-0 animate-pulse">
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-emerald-500/20 via-transparent to-emerald-400/20">
                            </div>
                        </div>

                        <!-- Scrollable content -->
                        <div class="relative p-5 sm:p-8 text-center text-white overflow-y-auto overscroll-contain
                       pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
                            <!-- Icon/Trophy -->
                            <div class="mb-4 sm:mb-6 flex justify-center">
                                <div class="relative">
                                    <div v-if="isWin" class="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600
                             flex items-center justify-center shadow-xl animate-bounce-slow">
                                        <Trophy class="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                                    </div>
                                    <div v-else class="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-slate-600 to-slate-700
                             flex items-center justify-center shadow-xl">
                                        <Target class="w-8 h-8 sm:w-12 sm:h-12 text-slate-300" />
                                    </div>
                                    <!-- Sparkles for win -->
                                    <div v-if="isWin" class="absolute -top-2 -right-2 animate-spin-slow">
                                        <Sparkles class="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
                                    </div>
                                </div>
                            </div>

                            <!-- Main message -->
                            <h2 class="text-xl sm:text-2xl font-bold mb-1 sm:mb-2" :class="titleClasses">
                                {{ title }}
                                <span v-if="wordNumber >= 0"
                                    class="ml-1 sm:ml-2 text-base sm:text-lg font-normal text-white/70">#{{ wordNumber +
                                    1 }}</span>
                            </h2>

                            <!-- Sub message -->
                            <p class="text-sm sm:text-base mb-4 sm:mb-6 opacity-90">
                                {{ subtitle }}
                            </p>

                            <!-- Stats display -->
                            <div class="mb-4 sm:mb-6 flex flex-wrap justify-center gap-2 sm:gap-4">
                                <div class="bg-white/10 backdrop-blur rounded-xl px-3 py-2 sm:px-4 sm:py-2">
                                    <div class="text-lg sm:text-xl font-bold">{{ attempts }}/6</div>
                                    <div class="text-[10px] sm:text-xs opacity-75">Attempts</div>
                                </div>
                                <div class="bg-white/10 backdrop-blur rounded-xl px-3 py-2 sm:px-4 sm:py-2">
                                    <div class="text-lg sm:text-xl font-bold">{{ streak }}</div>
                                    <div class="text-[10px] sm:text-xs opacity-75">Streak</div>
                                </div>
                                <div v-if="winPercentage !== null"
                                    class="bg-white/10 backdrop-blur rounded-xl px-3 py-2 sm:px-4 sm:py-2">
                                    <div class="text-lg sm:text-xl font-bold">{{ winPercentage }}%</div>
                                    <div class="text-[10px] sm:text-xs opacity-75">Win Rate</div>
                                </div>
                            </div>

                            <!-- Answer reveal for losses -->
                            <div v-if="!isWin" class="mb-4 sm:mb-6">
                                <div class="text-xs sm:text-sm opacity-75 mb-2">The word was:</div>
                                <div
                                    class="text-xl sm:text-2xl font-bold tracking-wider bg-white/10 backdrop-blur rounded-xl px-4 sm:px-6 py-2">
                                    {{ answer }}
                                </div>
                            </div>

                            <!-- Visual grid with colored squares -->
                            <div v-if="emojiGrid" class="mb-4 sm:mb-6 p-3 sm:p-4 bg-black/20 rounded-xl backdrop-blur">
                                <div class="flex flex-col gap-1 items-center">
                                    <div v-for="(row, rowIndex) in gridRows" :key="rowIndex" class="flex gap-1">
                                        <div v-for="(cell, cellIndex) in row" :key="cellIndex"
                                            class="w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center"
                                            :class="getSquareClass(cell)">
                                            <Square class="w-4 h-4 sm:w-6 sm:h-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Action buttons -->
                            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                                <button @click="onShare"
                                    class="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all relative"
                                    :class="shareButtonClasses">
                                    <Share2 class="w-4 h-4" />
                                    <span>{{ shareCopied ? 'Copied!' : 'Share' }}</span>
                                </button>
                                <button v-if="showNewGame" @click="$emit('new-game')"
                                    class="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 backdrop-blur font-semibold hover:bg-violet-500 transition-all">
                                    <ArrowRightCircle class="w-4 h-4" />
                                    Next Puzzle
                                </button>
                                <button @click="$emit('close')"
                                    class="w-full sm:flex-1 px-5 py-3 rounded-xl bg-white/10 backdrop-blur font-semibold hover:bg-white/20 transition-all">
                                    Continue
                                </button>
                            </div>

                            <!-- Next game timer (only if provided) -->
                            <div v-if="rolloverAt" class="mt-4 sm:mt-6 text-xs sm:text-sm opacity-75">
                                Next puzzle in {{ timeUntilNext }}
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Trophy, Target, Share2, Sparkles, Square, ArrowRightCircle } from 'lucide-vue-next'

const props = defineProps({
    show: Boolean,
    isWin: Boolean,
    attempts: Number,
    streak: Number,
    answer: String,
    emojiGrid: String,
    rolloverAt: String,
    wordNumber: { type: Number, default: -1 },
    winPercentage: { type: Number, default: null }
})

const emit = defineEmits(['close', 'share', 'new-game'])

const showCard = ref(false)
const confettiCanvas = ref(null)
const timeUntilNext = ref('00:00:00')
const shareCopied = ref(false)
let timer = null
let confettiAnimation = null

const showNewGame = computed(() => props.wordNumber >= 0)

const gridRows = computed(() => {
    if (!props.emojiGrid) return []
    return props.emojiGrid
        .split('\n')
        .map(row =>
            row
                .replace(/🟩/g, 'G')
                .replace(/🟨/g, 'Y')
                .replace(/⬛/g, 'B')
                .split('')
                .filter(c => ['G', 'Y', 'B'].includes(c))
        )
})

function getSquareClass(cell) {
    switch (cell) {
        case 'G':
            return 'bg-emerald-500 text-emerald-500'
        case 'Y':
            return 'bg-amber-500 text-amber-500'
        case 'B':
            return 'bg-zinc-700 text-zinc-700'
        default:
            return 'bg-zinc-800 text-zinc-800'
    }
}

const cardClasses = computed(() =>
    props.isWin
        ? 'bg-gradient-to-br from-emerald-800/95 to-emerald-900/95 border-emerald-600/50'
        : 'bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-slate-600/50'
)
const bgGradientClasses = computed(() =>
    props.isWin
        ? 'bg-gradient-to-br from-emerald-600/20 via-emerald-700/10 to-transparent'
        : 'bg-gradient-to-br from-rose-600/20 via-slate-700/10 to-transparent'
)
const titleClasses = computed(() =>
    props.isWin
        ? 'bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent'
        : 'text-slate-100'
)
const shareButtonClasses = computed(() =>
    shareCopied.value
        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
        : props.isWin
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white'
            : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white'
)

const title = computed(() => {
    if (props.isWin) {
        const messages = ['Brilliant!', 'Fantastic!', 'Excellent!', 'Outstanding!', 'Magnificent!', 'Superb!']
        return messages[props.attempts - 1] || 'Well Done!'
    }
    return 'So Close!'
})
const subtitle = computed(() => {
    if (props.isWin) {
        if (props.attempts === 1) return 'Incredible! First try!'
        if (props.attempts === 2) return 'Amazing work!'
        if (props.attempts === 3) return 'Great job!'
        if (props.attempts === 4) return 'Nice solve!'
        if (props.attempts === 5) return 'Good thinking!'
        return 'Phew! Just made it!'
    }
    return "Don't worry, you'll get it next time!"
})

function createConfetti() {
    if (!confettiCanvas.value || !props.isWin) return
    const canvas = confettiCanvas.value
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const colors = ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#fde047', '#a78bfa', '#c084fc']
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            vx: Math.random() * 4 - 2,
            vy: Math.random() * 2 + 3,
            size: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        })
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i]
            p.x += p.vx
            p.y += p.vy
            p.rotation += p.rotationSpeed
            p.vy += 0.1
            if (p.y > canvas.height) {
                particles.splice(i, 1)
                continue
            }
            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate((p.rotation * Math.PI) / 180)
            ctx.fillStyle = p.color
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
            ctx.restore()
        }
        if (particles.length > 0) confettiAnimation = requestAnimationFrame(animate)
    }
    animate()
}

function generateVisualShareText() {
    const isUnlimited = props.wordNumber >= 0
    const gameName = isUnlimited ? 'Wordle Unlimited' : 'MXN Daily — Wordle'
    const gameNumber = isUnlimited ? ` #${props.wordNumber + 1}` : ` ${new Date().toISOString().split('T')[0]}`
    const result = props.isWin ? `${props.attempts}/6` : 'X/6'

    const visualGrid =
        props.emojiGrid
            ?.replace(/🟩/g, '🟩')
            ?.replace(/🟨/g, '🟨')
            ?.replace(/⬛/g, '⬛') || ''

    const url = isUnlimited ? 'https://mxn.au/daily?game=wordle-unlimited' : 'https://mxn.au/daily?game=wordle'

    return `${gameName}${gameNumber}\n${result}\n\n${visualGrid}\n\nPlay at ${url}`
}

async function onShare() {
    emit('share')
    try {
        const text = generateVisualShareText()
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text)
            shareCopied.value = true
            setTimeout(() => (shareCopied.value = false), 2000)
        } else {
            const textArea = document.createElement('textarea')
            textArea.value = text
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            shareCopied.value = true
            setTimeout(() => (shareCopied.value = false), 2000)
        }
        if (navigator.share) {
            await navigator.share({ text })
        }
    } catch (e) {
        console.warn('Share failed:', e)
    }
}

function updateCountdown() {
    if (!props.rolloverAt) return (timeUntilNext.value = '00:00:00')
    const ms = Date.parse(props.rolloverAt) - Date.now()
    if (ms <= 0) return (timeUntilNext.value = '00:00:00')
    const total = Math.floor(ms / 1000)
    const h = String(Math.floor(total / 3600)).padStart(2, '0')
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
    const s = String(total % 60).padStart(2, '0')
    timeUntilNext.value = `${h}:${m}:${s}`
}

function onCardEnter() {
    if (props.isWin) setTimeout(createConfetti, 300)
}

watch(
    () => props.show,
    async (v) => {
        if (v) {
            await nextTick()
            setTimeout(() => (showCard.value = true), 50)
        } else {
            showCard.value = false
            shareCopied.value = false
            if (confettiAnimation) {
                cancelAnimationFrame(confettiAnimation)
                confettiAnimation = null
            }
        }
    }
)

onMounted(() => {
    updateCountdown()
    timer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
    if (timer) clearInterval(timer)
    if (confettiAnimation) cancelAnimationFrame(confettiAnimation)
})
</script>

<style scoped>
/* Overlay transitions */
.overlay-enter-active,
.overlay-leave-active {
    transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
}

/* Card transitions */
.card-enter-active {
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.card-leave-active {
    transition: all 0.3s ease;
}

.card-enter-from {
    opacity: 0;
    transform: scale(0.7) translateY(20px);
}

.card-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

/* Custom animations */
@keyframes bounce-slow {

    0%,
    100% {
        transform: translateY(0)
    }

    50% {
        transform: translateY(-10px)
    }
}

.animate-bounce-slow {
    animation: bounce-slow 2s ease-in-out infinite;
}

@keyframes spin-slow {
    from {
        transform: rotate(0)
    }

    to {
        transform: rotate(360deg)
    }
}

.animate-spin-slow {
    animation: spin-slow 4s linear infinite;
}
</style>