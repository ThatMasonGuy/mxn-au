<template>
    <Teleport to="body">
        <!-- Overlay -->
        <Transition name="overlay">
            <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4"
                @click.self="$emit('close')">
                <!-- Dark backdrop -->
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

                <!-- Confetti Canvas (for wins only) -->
                <canvas v-if="isWin" ref="confettiCanvas" class="absolute inset-0 pointer-events-none"></canvas>

                <!-- Content Card -->
                <Transition name="card" @enter="onCardEnter">
                    <div v-if="showCard" class="relative max-w-md w-full rounded-2xl overflow-hidden shadow-2xl border"
                        :class="cardClasses">

                        <!-- Animated background gradient -->
                        <div class="absolute inset-0" :class="bgGradientClasses"></div>

                        <!-- Glow effect -->
                        <div v-if="isWin" class="absolute inset-0 animate-pulse">
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-emerald-500/20 via-transparent to-emerald-400/20">
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="relative p-8 text-center text-white">
                            <!-- Icon/Trophy -->
                            <div class="mb-6 flex justify-center">
                                <div class="relative">
                                    <div v-if="isWin"
                                        class="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl animate-bounce-slow">
                                        <Trophy class="w-12 h-12 text-white" />
                                    </div>
                                    <div v-else
                                        class="w-24 h-24 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-xl">
                                        <Target class="w-12 h-12 text-slate-300" />
                                    </div>

                                    <!-- Sparkles for win -->
                                    <div v-if="isWin" class="absolute -top-2 -right-2 animate-spin-slow">
                                        <Sparkles class="w-8 h-8 text-yellow-300" />
                                    </div>
                                </div>
                            </div>

                            <!-- Main message -->
                            <h2 class="text-3xl font-bold mb-2" :class="titleClasses">
                                {{ title }}
                            </h2>

                            <!-- Sub message -->
                            <p class="text-lg mb-6 opacity-90">
                                {{ subtitle }}
                            </p>

                            <!-- Stats display -->
                            <div v-if="isWin" class="mb-6 flex justify-center gap-4">
                                <div class="bg-white/10 backdrop-blur rounded-xl px-4 py-2">
                                    <div class="text-2xl font-bold">{{ attempts }}/6</div>
                                    <div class="text-xs opacity-75">Attempts</div>
                                </div>
                                <div class="bg-white/10 backdrop-blur rounded-xl px-4 py-2">
                                    <div class="text-2xl font-bold">{{ streak }}</div>
                                    <div class="text-xs opacity-75">Streak</div>
                                </div>
                            </div>

                            <!-- Answer reveal for losses -->
                            <div v-else class="mb-6">
                                <div class="text-sm opacity-75 mb-2">The word was:</div>
                                <div
                                    class="text-4xl font-bold tracking-wider bg-white/10 backdrop-blur rounded-xl px-6 py-3">
                                    {{ answer }}
                                </div>
                            </div>

                            <!-- Emoji grid -->
                            <div v-if="emojiGrid" class="mb-6 p-4 bg-black/20 rounded-xl backdrop-blur">
                                <div class="font-mono text-lg leading-tight whitespace-pre">{{ emojiGrid }}</div>
                            </div>

                            <!-- Action buttons -->
                            <div class="flex gap-3 justify-center">
                                <button @click="onShare"
                                    class="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
                                    :class="shareButtonClasses">
                                    <Share2 class="w-4 h-4" />
                                    Share
                                </button>
                                <button @click="$emit('close')"
                                    class="flex-1 px-6 py-3 rounded-xl bg-white/10 backdrop-blur font-semibold hover:bg-white/20 transition-all">
                                    Continue
                                </button>
                            </div>

                            <!-- Next game timer -->
                            <div class="mt-6 text-sm opacity-75">
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
import { Trophy, Target, Share2, Sparkles } from 'lucide-vue-next'

const props = defineProps({
    show: Boolean,
    isWin: Boolean,
    attempts: Number,
    streak: Number,
    answer: String,
    emojiGrid: String,
    rolloverAt: String
})

const emit = defineEmits(['close', 'share'])

const showCard = ref(false)
const confettiCanvas = ref(null)
const timeUntilNext = ref('00:00:00')
let timer = null
let confettiAnimation = null

// Computed styles
const cardClasses = computed(() => {
    return props.isWin
        ? 'bg-gradient-to-br from-emerald-800/95 to-emerald-900/95 border-emerald-600/50'
        : 'bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-slate-600/50'
})

const bgGradientClasses = computed(() => {
    return props.isWin
        ? 'bg-gradient-to-br from-emerald-600/20 via-emerald-700/10 to-transparent'
        : 'bg-gradient-to-br from-rose-600/20 via-slate-700/10 to-transparent'
})

const titleClasses = computed(() => {
    return props.isWin
        ? 'bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent'
        : 'text-slate-100'
})

const shareButtonClasses = computed(() => {
    return props.isWin
        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white'
        : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white'
})

const title = computed(() => {
    if (props.isWin) {
        const messages = [
            'Brilliant!',
            'Fantastic!',
            'Excellent!',
            'Outstanding!',
            'Magnificent!',
            'Superb!'
        ]
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
    return "Don't worry, you'll get it tomorrow!"
})

// Confetti animation
function createConfetti() {
    if (!confettiCanvas.value || !props.isWin) return

    const canvas = confettiCanvas.value
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const colors = ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#fde047', '#a78bfa', '#c084fc']

    // Create particles
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

        particles.forEach((p, index) => {
            p.x += p.vx
            p.y += p.vy
            p.rotation += p.rotationSpeed
            p.vy += 0.1 // gravity

            // Remove particles that fall off screen
            if (p.y > canvas.height) {
                particles.splice(index, 1)
                return
            }

            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(p.rotation * Math.PI / 180)
            ctx.fillStyle = p.color
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
            ctx.restore()
        })

        if (particles.length > 0) {
            confettiAnimation = requestAnimationFrame(animate)
        }
    }

    animate()
}

// Share functionality
async function onShare() {
    emit('share')
    try {
        const text = props.emojiGrid
            ? `Wordle ${new Date().toISOString().split('T')[0]}\n${props.attempts}/6\n\n${props.emojiGrid}\n\nPlay at https://mxn.au/daily?game=wordle`
            : 'Check out MXN Daily Games!'

        if (navigator.share) {
            await navigator.share({ text })
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(text)
        }
    } catch (error) {
        console.warn('Share failed:', error)
    }
}

// Update countdown
function updateCountdown() {
    if (!props.rolloverAt) {
        timeUntilNext.value = '00:00:00'
        return
    }

    const ms = Date.parse(props.rolloverAt) - Date.now()
    if (ms <= 0) {
        timeUntilNext.value = '00:00:00'
        return
    }

    const total = Math.floor(ms / 1000)
    const h = String(Math.floor(total / 3600)).padStart(2, '0')
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
    const s = String(total % 60).padStart(2, '0')
    timeUntilNext.value = `${h}:${m}:${s}`
}

function onCardEnter() {
    if (props.isWin) {
        setTimeout(createConfetti, 300)
    }
}

// Lifecycle
watch(() => props.show, async (newVal) => {
    if (newVal) {
        await nextTick()
        setTimeout(() => {
            showCard.value = true
        }, 50)
    } else {
        showCard.value = false
        if (confettiAnimation) {
            cancelAnimationFrame(confettiAnimation)
            confettiAnimation = null
        }
    }
})

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
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.animate-bounce-slow {
    animation: bounce-slow 2s ease-in-out infinite;
}

@keyframes spin-slow {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin-slow {
    animation: spin-slow 4s linear infinite;
}
</style>