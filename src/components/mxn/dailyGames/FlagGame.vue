<template>
    <div class="flex flex-col items-center gap-6 prevent-zoom" ref="containerRef">
        <!-- Dev tools -->
        <div v-if="isDevMode" class="w-full max-w-2xl mx-auto mt-2">
            <div class="flex items-center justify-end">
                <button @click="devResetToday"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600/20 text-amber-300 border border-amber-600/40 hover:bg-amber-600/30 transition">Reset
                    Today (Dev)</button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="store.loading" class="w-full mx-auto max-w-[min(92vw,24rem)] md:max-w-[30rem] lg:max-w-[36rem] xl:max-w-[40rem]">
            <FancyLoader :message="store.loadingMessage" variant="amber" shape="flags" icon="flag" />
        </div>

        <!-- Game Content -->
        <div v-else class="w-full max-w-2xl mx-auto">
            <!-- Progress Bar (always visible) -->
            <div class="mb-2">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-zinc-400">Flag {{ Math.min(currentFlag, 5) }} of 5</span>
                    <span class="text-sm text-zinc-400">Score: {{ store.score }}</span>
                </div>
                <div class="flex gap-1">
                    <div v-for="i in 5" :key="`prog-${i}`" class="flex-1 h-2 rounded-full transition-all duration-300"
                        :class="getFlagProgressClass(i - 1)" />
                </div>
            </div>

            <!-- Lives Display: 3 slots, lost hearts greyed (not removed) with a subtle emphasis -->
            <div class="flex justify-center gap-2 mb-4">
                <div v-for="i in 3" :key="`life-${i}`" class="transition-all duration-300"
                    :class="i === justLostIndex ? 'heart-lost' : ''">
                    <Heart class="w-6 h-6 transition-all duration-300"
                        :class="i <= store.lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-zinc-600 fill-zinc-600/30 scale-95'" />
                </div>
            </div>

            <!-- ENDING GRID (persistent, latched) -->
            <div v-if="hasCompleted" class="space-y-6 mb-4">
                <div class="text-center">
                    <h2 class="text-xl font-semibold text-zinc-200">Today's Flags</h2>
                    <p class="text-zinc-400 text-sm">All five flags & names</p>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div v-for="(c, i) in store.countries" :key="`final-${i}-${c}`"
                        class="p-4 rounded-2xl bg-gradient-to-br from-zinc-800/60 to-zinc-900/40 border border-zinc-700/80 shadow-2xl flex flex-col items-center gap-3">
                        <div class="text-6xl leading-none"><span :class="getFlagIcon(c)"></span></div>
                        <div class="text-sm text-zinc-200 text-center">{{ c }}</div>
                    </div>
                </div>
            </div>

            <!-- ACTIVE ROUND UI (hidden when complete) -->
            <div v-else>
                <!-- Flag Display -->
                <div v-if="store.currentCountry" class="text-center mb-6">
                    <div class="inline-block p-8 rounded-2xl bg-gradient-to-br from-zinc-800/60 to-zinc-900/40 border border-zinc-700/80 shadow-2xl"
                        :class="{ 'correct-pop': justCorrect, 'wrong-shake': justWrong }">
                        <div class="text-[120px] leading-none">
                            <span :class="flagIconClass"></span>
                        </div>
                    </div>
                </div>

                <!-- Input + Autocomplete -->
                <div class="space-y-4 z-[9999]">
                    <div class="relative">
                        <input ref="inputRef" v-model="store.currentInput" :disabled="!store.canType || showingResult"
                            type="text" placeholder="Enter country name..."
                            class="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/70 text-white placeholder-zinc-400 focus:outline-none focus:border-violet-500 transition-all"
                            :class="{
                                'opacity-50': !store.canType || showingResult,
                                'ring-2 ring-rose-500/40': justWrong,
                                'ring-2 ring-emerald-500/40': justCorrect
                            }" autocomplete="off" role="combobox" :aria-expanded="showList && suggestions.length > 0"
                            aria-controls="country-listbox" aria-autocomplete="list" @focus="openList()"
                            @input="onInput()" @keydown="onKeydown" />

                        <!-- Suggestions -->
                        <ul v-if="showList && suggestions.length > 0" id="country-listbox" role="listbox"
                            class="absolute z-5000 mt-2 w-full max-h-64 overflow-auto rounded-xl border border-zinc-700/70 bg-zinc-900/95 backdrop-blur-sm shadow-xl">
                            <li v-for="(name, i) in suggestions" :key="name" role="option"
                                :aria-selected="i === activeIndex" @mousedown.prevent="select(name)"
                                @mousemove="activeIndex = i" class="px-4 py-2 cursor-pointer text-zinc-200"
                                :class="i === activeIndex ? 'bg-zinc-800/80' : 'hover:bg-zinc-800/40'">
                                <span v-html="highlightMatch(name)"></span>
                            </li>
                        </ul>
                    </div>

                    <!-- Action Button -->
                    <div class="flex gap-3">
                        <button ref="submitBtnRef" @click="submitGuess"
                            :disabled="!store.canType || !store.currentInput.trim() || showingResult"
                            class="flex-1 px-6 py-3 rounded-xl font-semibold transition-all" :class="store.canType && store.currentInput.trim() && !showingResult
                                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/20'
                                    : 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                                ">
                            Submit
                        </button>
                    </div>
                </div>

                <!-- Result Feedback -->
                <transition name="result">
                    <div v-if="showingResult" class="text-center py-4">
                        <div class="inline-block px-6 py-2.5 rounded-xl font-semibold text-base" :class="lastResult.correct
                                ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40'
                            ">
                            <span v-if="lastResult.correct">✓ Correct!</span>
                            <span v-else>✗ Wrong! Try again.</span>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- MERGED HISTORY: shows both wrong + correct in one list (persists even after end) -->
            <div v-if="guessHistory.length > 0" class="mt-6">
                <h3 class="text-sm text-zinc-400 mb-3">Your Guesses:</h3>
                <div class="space-y-2">
                    <div v-for="(g, idx) in guessHistory" :key="`gh-${idx}-${g.guess}-${g.country ?? 'x'}`"
                        class="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/40 border"
                        :class="g.correct ? 'bg-gradient-to-br from-emerald-700/20 via-emerald-500/5 to-transparent border border-emerald-700/50' : 'bg-gradient-to-br from-rose-700/20 via-rose-500/5 to-transparent border border-rose-700/50'">
                        <span :class="getFlagIcon(g.country)" class="text-2xl"></span>
                        <div class="flex-1">
                            <div v-if="g.correct" class="text-sm font-bold text-zinc-300">{{ g.country }}</div>
                            <div v-else class="text-sm text-zinc-400">You guessed: {{ g.guess }}
                            </div>
                        </div>
                        <CheckCircle2 v-if="g.correct" class="w-5 h-5 text-emerald-400" />
                        <XCircle v-else class="w-5 h-5 text-rose-400" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useFlagleStore } from '@/stores/dailyGames/useFlagleStore'
import { useFlagIcon } from '@/utils/useFlagIcon'
import { Heart, CheckCircle2, XCircle } from 'lucide-vue-next'
import { getAuth } from 'firebase/auth'
import { firestore } from '@/firebase'
import { doc, deleteDoc } from 'firebase/firestore'
import FancyLoader from './components/Loader.vue'

const store = useFlagleStore()

// Dev mode
const isDevMode = computed(() => import.meta.env.DEV || new URLSearchParams(location.search).get('dev') === 'true')

async function devResetToday() {
    try {
        store.hardResetLocal() // nuke local
        // attempt remote day delete if logged in
        const auth = getAuth()
        const user = auth.currentUser
        if (user && store.puzzleId) {
            const date = store.puzzleId.replace('flagle-', '')
            const dayRef = doc(firestore, 'users', user.uid, 'dailyChallenges', 'flag', 'days', date)
            await deleteDoc(dayRef).catch(() => { })
        }
    } finally {
        location.reload()
    }
}

const showingResult = ref(false)
const lastResult = ref({ correct: false })

// Latch the completed state so if the store refreshes we keep the end grid visible
const hasCompleted = ref(false)
watch(
    () => store.isComplete,
    (val) => { if (val) hasCompleted.value = true }
)
// if we load into a completed day, latch immediately
onMounted(() => { if (store.isComplete) hasCompleted.value = true })

// For visual feedback on the flag card & input
const justWrong = ref(false)
const justCorrect = ref(false)

// Track which heart just got lost for a tiny emphasis
const justLostIndex = ref(null) // 1..3 (human index)
let lastLives = store.lives
watch(
    () => store.lives,
    (newVal) => {
        if (newVal < lastLives) {
            justLostIndex.value = newVal + 1
            setTimeout(() => (justLostIndex.value = null), 320)
        }
        lastLives = newVal
    },
    { immediate: true }
)

// Local guess history (includes wrong + right). Most recent first.
// We snapshot the country at time of guess so we can render the flag icon for wrong guesses without name.
const guessHistory = ref([]) // { guess: string, correct: boolean, country: string }

const currentFlag = computed(() => store.currentFlagIndex + 1)
const flagIconClass = computed(() => (store.currentCountry ? useFlagIcon(store.currentCountry) : ''))

// ---------- Autocomplete ----------
const containerRef = ref(null)
const inputRef = ref(null)
const submitBtnRef = ref(null)
const showList = ref(false)
const activeIndex = ref(0)

const COUNTRY_POOL = [
    'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia',
    'Peru', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay', 'Jamaica',
    'Cuba', 'Dominican Republic', 'Haiti', 'Costa Rica', 'Panama', 'Guatemala',
    'Honduras', 'El Salvador', 'Nicaragua', 'Barbados', 'Trinidad and Tobago',
    'United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 'Portugal', 'Netherlands',
    'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland',
    'Iceland', 'Ireland', 'Poland', 'Czech Republic', 'Slovakia', 'Hungary', 'Romania',
    'Bulgaria', 'Greece', 'Croatia', 'Serbia', 'Bosnia and Herzegovina', 'Albania',
    'North Macedonia', 'Montenegro', 'Slovenia', 'Estonia', 'Latvia', 'Lithuania',
    'Belarus', 'Ukraine', 'Moldova', 'Luxembourg', 'Monaco', 'Vatican City',
    'San Marino', 'Andorra', 'Malta', 'Cyprus',
    'China', 'Japan', 'South Korea', 'North Korea', 'India', 'Pakistan', 'Bangladesh',
    'Sri Lanka', 'Nepal', 'Bhutan', 'Afghanistan', 'Thailand', 'Vietnam', 'Cambodia',
    'Laos', 'Myanmar', 'Malaysia', 'Singapore', 'Indonesia', 'Philippines', 'Taiwan',
    'Mongolia', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan',
    'Turkey', 'Iran', 'Iraq', 'Saudi Arabia', 'Yemen', 'Syria', 'Jordan', 'Lebanon',
    'Israel', 'Palestine', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
    'Georgia', 'Armenia', 'Azerbaijan',
    'Egypt', 'Libya', 'Tunisia', 'Algeria', 'Morocco', 'Sudan', 'Ethiopia', 'Kenya',
    'Tanzania', 'Uganda', 'Rwanda', 'Burundi', 'Somalia', 'Nigeria', 'Ghana',
    'Ivory Coast', 'Senegal', 'Mali', 'Burkina Faso', 'Niger', 'Chad', 'Cameroon',
    'Central African Republic', 'Democratic Republic of the Congo', 'Republic of the Congo',
    'Gabon', 'Equatorial Guinea', 'Angola', 'Zambia', 'Zimbabwe', 'Botswana',
    'Namibia', 'South Africa', 'Lesotho', 'Eswatini', 'Mozambique', 'Madagascar',
    'Mauritius', 'Seychelles', 'Comoros', 'Cape Verde', 'Guinea', 'Guinea-Bissau',
    'Liberia', 'Sierra Leone', 'Togo', 'Benin', 'Mauritania', 'Gambia', 'Malawi',
    'Eritrea', 'Djibouti', 'South Sudan',
    'Australia', 'New Zealand', 'Papua New Guinea', 'Fiji', 'Solomon Islands',
    'Vanuatu', 'Samoa', 'Tonga', 'Kiribati', 'Tuvalu', 'Nauru', 'Palau',
    'Marshall Islands', 'Micronesia'
]

const normalize = (s) => (s ?? '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const suggestions = computed(() => {
    const q = normalize(store.currentInput).trim()
    if (!q) return []
    const starts = []
    const includes = []
    for (const c of COUNTRY_POOL) {
        const nc = normalize(c)
        if (nc.startsWith(q)) starts.push(c)
        else if (nc.includes(q)) includes.push(c)
    }
    return [...starts, ...includes].slice(0, 12)
})

function openList() { if (suggestions.value.length > 0) { showList.value = true; activeIndex.value = 0 } }
function closeList() { showList.value = false }
function onInput() {
    if (!store.canType || showingResult.value) return
    if (store.currentInput.trim().length === 0) return closeList()
    showList.value = suggestions.value.length > 0
    activeIndex.value = 0
}
function select(name) { store.currentInput = name; closeList() }

function highlightMatch(name) {
    const q = normalize(store.currentInput).trim()
    if (!q) return name
    const raw = name
    const lowerRaw = normalize(raw)
    const idx = lowerRaw.indexOf(q)
    if (idx === -1) return raw
    const start = idx, end = idx + q.length
    return raw.slice(0, start) + '<span class="font-semibold text-white">' + raw.slice(start, end) + '</span>' + raw.slice(end)
}

async function onKeydown(e) {
    if (!showList.value || suggestions.value.length === 0) {
        if (e.key === 'Enter') await submitGuess()
        return
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex.value = (activeIndex.value + 1) % suggestions.value.length }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex.value = (activeIndex.value - 1 + suggestions.value.length) % suggestions.value.length }
    else if (e.key === 'Enter') { e.preventDefault(); select(suggestions.value[activeIndex.value]); await nextTick(); await submitGuess() }
    else if (e.key === 'Tab') { e.preventDefault(); select(suggestions.value[activeIndex.value]); await nextTick(); submitBtnRef.value?.focus() }
    else if (e.key === 'Escape') { e.preventDefault(); closeList() }
}

function onDocClick(evt) { if (!containerRef.value) return; if (!containerRef.value.contains(evt.target)) closeList() }

// ---------- Game helpers ----------
function getFlagIcon(countryName) { return useFlagIcon(countryName) }
function getFlagProgressClass(index) {
    if (index < store.currentFlagIndex) return 'bg-emerald-500'
    if (index === store.currentFlagIndex) return 'bg-violet-500'
    return 'bg-zinc-700'
}

async function submitGuess() {
    if (!store.canType || !store.currentInput.trim() || showingResult.value) return

    const guessText = store.currentInput.trim()
    const currentCountry = store.currentCountry // snapshot for history
    const result = await store.submitGuess()
    if (!result) return

    // Update local history (most recent first). Always include the flag; show name only when correct.
    if (result.correct) {
        guessHistory.value.unshift({ guess: guessText, correct: true, country: currentCountry })
        flashCorrect(); showFeedback(true)
    } else {
        guessHistory.value.unshift({ guess: guessText, correct: false, country: currentCountry })
        flashWrong(); showFeedback(false)
    }
}

function showFeedback(correct) {
    lastResult.value = { correct }
    showingResult.value = true
    setTimeout(() => { showingResult.value = false }, 1000)
}

function flashWrong() { justWrong.value = true; setTimeout(() => { justWrong.value = false }, 350) }
function flashCorrect() { justCorrect.value = true; setTimeout(() => { justCorrect.value = false }, 450) }

onMounted(async () => {
    document.addEventListener('mousedown', onDocClick)
    store.initAuthListener()
    await store.loadDaily()
    if (store.isComplete) hasCompleted.value = true
})

onUnmounted(() => { document.removeEventListener('mousedown', onDocClick) })
</script>

<style scoped>
.prevent-zoom :is(button, input, [role="button"]) {
    touch-action: manipulation;
}

/* Result toast */
.result-enter-active,
.result-leave-active {
    transition: all 0.25s ease;
}

.result-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

.result-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

/* Heart lost emphasis */
.heart-lost {
    animation: heartFade 0.28s ease;
}

@keyframes heartFade {
    0% {
        transform: scale(1.1);
        filter: saturate(1);
    }

    100% {
        transform: scale(0.95);
        filter: saturate(0.2);
    }
}

/* Wrong guess shake */
@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    20% {
        transform: translateX(-6px);
    }

    40% {
        transform: translateX(6px);
    }

    60% {
        transform: translateX(-4px);
    }

    80% {
        transform: translateX(4px);
    }
}

.wrong-shake {
    animation: shake 0.35s ease;
}

/* Correct pop/glow */
@keyframes popGlow {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 rgba(16, 185, 129, 0);
    }

    50% {
        transform: scale(1.03);
        box-shadow: 0 0 24px rgba(16, 185, 129, 0.2);
    }

    100% {
        transform: scale(1);
        box-shadow: 0 0 0 rgba(16, 185, 129, 0);
    }
}

.correct-pop {
    animation: popGlow 0.45s ease;
}
</style>