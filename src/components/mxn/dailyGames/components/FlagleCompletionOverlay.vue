<template>
    <Teleport to="body">
        <!-- Overlay -->
        <Transition name="overlay">
            <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
                @click.self="$emit('close')">
                <!-- Dark backdrop -->
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

                <!-- Confetti Canvas (for high scores) -->
                <canvas v-if="isHighScore" ref="confettiCanvas" class="absolute inset-0 pointer-events-none"></canvas>

                <!-- Content Card -->
                <Transition name="card" @enter="onCardEnter">
                    <div v-if="showCard" class="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border flex flex-col
             max-h-[calc(100svh-1.5rem)] sm:max-h-[calc(100svh-2rem)]" :class="cardClasses">
                        <!-- Animated background gradient -->
                        <div class="absolute inset-0" :class="bgGradientClasses"></div>

                        <!-- Glow effect -->
                        <div v-if="isHighScore" class="absolute inset-0 animate-pulse">
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-blue-400/20">
                            </div>
                        </div>

                        <!-- Scrollable content -->
                        <div class="relative p-5 sm:p-8 text-center text-white overflow-y-auto overscroll-contain
               pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
                            <!-- Icon/Trophy -->
                            <div class="mb-4 sm:mb-6 flex justify-center">
                                <div class="relative">
                                    <div v-if="isHighScore" class="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600
                     flex items-center justify-center shadow-xl animate-bounce-slow">
                                        <Trophy class="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                                    </div>
                                    <div v-else class="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-700
                     flex items-center justify-center shadow-xl">
                                        <Flag class="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                                    </div>
                                    <!-- Sparkles for high score -->
                                    <div v-if="isHighScore" class="absolute -top-2 -right-2 animate-spin-slow">
                                        <Sparkles class="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
                                    </div>
                                </div>
                            </div>

                            <!-- Main message -->
                            <h2 class="text-xl sm:text-2xl font-bold mb-1 sm:mb-2" :class="titleClasses">
                                {{ title }}
                            </h2>

                            <!-- Sub message -->
                            <p class="text-sm sm:text-base mb-4 sm:mb-6 opacity-90">
                                {{ subtitle }}
                            </p>

                            <!-- Stats display -->
                            <div class="mb-4 sm:mb-6 flex flex-wrap justify-center gap-2 sm:gap-4">
                                <div class="bg-white/10 backdrop-blur rounded-xl px-3 py-2 sm:px-4 sm:py-2">
                                    <div class="text-lg sm:text-xl font-bold">{{ correctCount }}/5</div>
                                    <div class="text-[10px] sm:text-xs opacity-75">Flags</div>
                                </div>
                                <div class="bg-white/10 backdrop-blur rounded-xl px-3 py-2 sm:px-4 sm:py-2">
                                    <div class="text-lg sm:text-xl font-bold">{{ score }}</div>
                                    <div class="text-[10px] sm:text-xs opacity-75">Score</div>
                                </div>
                                <div v-if="streak !== null"
                                    class="bg-white/10 backdrop-blur rounded-xl px-3 py-2 sm:px-4 sm:py-2">
                                    <div class="text-lg sm:text-xl font-bold">{{ streak }}</div>
                                    <div class="text-[10px] sm:text-xs opacity-75">Streak</div>
                                </div>
                            </div>

                            <!-- Answer Summary -->
                            <div class="mb-4 sm:mb-6 p-3 sm:p-4 bg-black/20 rounded-xl backdrop-blur">
                                <div class="flex justify-center gap-2">
                                    <div v-for="(answer, idx) in answers" :key="idx"
                                        class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold"
                                        :class="getAnswerClass(answer)">
                                        <span v-if="answer.correct">✓</span>
                                        <span v-else-if="answer.skipped">—</span>
                                        <span v-else>✗</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Detailed Results -->
                            <div class="mb-4 sm:mb-6 space-y-2 max-h-40 overflow-y-auto">
                                <div v-for="(answer, idx) in answers" :key="idx"
                                    class="flex items-center gap-2 text-xs sm:text-sm">
                                    <span :class="getFlagIcon(answer.country)" class="text-lg"></span>
                                    <span class="flex-1 text-left">{{ answer.country }}</span>
                                    <CheckCircle2 v-if="answer.correct" class="w-4 h-4 text-emerald-400" />
                                    <Minus v-else-if="answer.skipped" class="w-4 h-4 text-zinc-400" />
                                    <XCircle v-else class="w-4 h-4 text-rose-400" />
                                </div>
                            </div>

                            <!-- Action buttons -->
                            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                                <button @click="onShare"
                                    class="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all"
                                    :class="shareButtonClasses">
                                    <Share2 class="w-4 h-4" />
                                    <span>{{ shareCopied ? 'Copied!' : 'Share' }}</span>
                                </button>
                                <button @click="$emit('close')"
                                    class="w-full sm:flex-1 px-5 py-3 rounded-xl bg-white/10 backdrop-blur font-semibold hover:bg-white/20 transition-all">
                                    Continue
                                </button>
                            </div>

                            <!-- Next game timer -->
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
import { Trophy, Flag, Share2, Sparkles, CheckCircle2, XCircle, Minus } from 'lucide-vue-next'
import { useFlagIcon } from '@/utils/useFlagIcon'

const props = defineProps({
    show: Boolean,
    score: Number,
    correctCount: Number,
    answers: Array,
    rolloverAt: String,
    streak: { type: Number, default: null }
})

const emit = defineEmits(['close', 'share'])

const showCard = ref(false)
const confettiCanvas = ref(null)
const timeUntilNext = ref('00:00:00')
const shareCopied = ref(false)
let timer = null
let confettiAnimation = null

const isHighScore = computed(() => props.score >= 200)

function getFlagIcon(countryName) {
    return useFlagIcon(countryName)
}

function getAnswerClass(answer) {
    if (answer.correct) return 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
    if (answer.skipped) return 'bg-zinc-700/30 text-zinc-400 border border-zinc-600/50'
    return 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
}

const cardClasses = computed(() =>
    isHighScore.value
        ? 'bg-gradient-to-br from-blue-800/95 to-blue-900/95 border-blue-600/50'
        : 'bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-slate-600/50'
)

const bgGradientClasses = computed(() =>
    isHighScore.value
        ? 'bg-gradient-to-br from-blue-600/20 via-blue-700/10 to-transparent'
        : 'bg-gradient-to-br from-slate-600/20 via-slate-700/10 to-transparent'
)

const titleClasses = computed(() =>
    isHighScore.value
        ? 'bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent'
        : 'text-slate-100'
)

const shareButtonClasses = computed(() =>
    shareCopied.value
        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white'
)

const title = computed(() => {
    if (props.correctCount === 5) return 'Perfect!'
    if (props.correctCount >= 4) return 'Excellent!'
    if (props.correctCount >= 3) return 'Good Job!'
    if (props.correctCount >= 2) return 'Nice Try!'
    return 'Better luck next time!'
})

const subtitle = computed(() => {
    if (props.score >= 250) return 'Outstanding flag knowledge!'
    if (props.score >= 200) return 'Impressive performance!'
    if (props.score >= 150) return 'Well done!'
    if (props.score >= 100) return 'Good effort!'
    return 'Keep practicing!'
})

function createConfetti() {
    if (!confettiCanvas.value || !isHighScore.value) return
    const canvas = confettiCanvas.value
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#fbbf24', '#fde047', '#a78bfa', '#c084fc']
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

function generateShareText() {
    const date = new Date().toISOString().split('T')[0]
    const grid = props.answers.map(a => {
        if (a.correct) return '🟩'
        if (a.skipped) return '⬜'
        return '🟥'
    }).join('')

    return `MXN Daily — Flag Quest ${date}\n${props.correctCount}/5 flags | Score: ${props.score}\n${grid}\n\nPlay at https://mxn.au/daily?game=flag`
}

async function onShare() {
    emit('share')
    try {
        const text = generateShareText()
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text)
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
    if (isHighScore.value) setTimeout(createConfetti, 300)
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