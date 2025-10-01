<template>
    <div
        class="h-full w-full bg-[linear-gradient(120deg,rgba(30,27,22,0.96),rgba(24,21,17,0.96))] text-stone-100 overflow-hidden">
        <!-- Subtle parchment noise overlay -->
        <div
            class="pointer-events-none fixed inset-0 opacity-[0.07] mix-blend-overlay [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]">
        </div>

        <!-- Top banner / session header -->
        <header
            class="relative z-10 border-b border-stone-700/70 bg-[linear-gradient(90deg,rgba(48,38,28,.8),rgba(28,24,20,.8))]">
            <div class="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div
                        class="h-9 w-9 grid place-items-center rounded-lg bg-gradient-to-br from-amber-700 to-amber-900 shadow-inner ring-1 ring-amber-600/40">
                        <!-- Tiny d20 glyph -->
                        <svg viewBox="0 0 24 24" class="h-5 w-5">
                            <path fill="currentColor" d="M12 2 2 7v10l10 5 10-5V7zM4 8.15 12 4l8 4.15V16L12 20 4 16z" />
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-lg font-bold tracking-wide uppercase text-amber-200">Velaris Table</h1>
                        <p class="text-xs text-stone-300/70">Session • <span class="font-semibold">{{ sessionId
                                }}</span></p>
                    </div>
                </div>

                <div class="flex items-center gap-3 text-xs">
                    <span class="px-2 py-1 rounded bg-stone-800/60 ring-1 ring-stone-700">Players: {{ players.length
                        }}</span>
                    <span class="px-2 py-1 rounded bg-stone-800/60 ring-1 ring-stone-700">You: {{ currentPlayer.name
                        }}</span>
                </div>
            </div>
        </header>

        <!-- Main 30 | 40 | 30 layout -->
        <div class="relative z-0 h-[calc(100vh-56px)] grid" :style="gridTemplate">
            <!-- LEFT 30% -->
            <section class="border-r border-stone-800/70 flex flex-col overflow-hidden">
                <!-- Player card (top) -->
                <div
                    class="p-3 md:p-4 lg:p-5 border-b border-stone-800/70 bg-[radial-gradient(80%_80%_at_50%_0%,rgba(120,53,15,.25),transparent)]">
                    <div class="flex items-center gap-4">
                        <div class="relative">
                            <div
                                class="h-14 w-14 rounded-xl grid place-items-center bg-gradient-to-br from-amber-700 to-amber-900 ring-1 ring-amber-600/40 shadow-inner font-black text-xl">
                                {{ currentPlayer.initials }}
                            </div>
                            <div
                                class="absolute -bottom-1 -right-1 h-6 w-6 grid place-items-center rounded-full bg-stone-900 ring-1 ring-stone-700 text-xs">
                                LV {{ currentPlayer.level }}</div>
                        </div>
                        <div class="min-w-0">
                            <h2 class="text-base md:text-lg font-semibold tracking-wide">{{ currentPlayer.name }}</h2>
                            <p class="text-xs text-stone-300/70 truncate">{{ currentPlayer.race }} • {{
                                currentPlayer.class }}</p>
                            <div class="mt-2 flex flex-wrap gap-2 text-xs">
                                <span v-for="tag in currentPlayer.tags" :key="tag"
                                    class="px-2 py-0.5 rounded bg-stone-800/60 ring-1 ring-stone-700">{{ tag }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Passive stats quick saves -->
                    <div class="mt-4 grid grid-cols-3 gap-2">
                        <button v-for="stat in passiveStats" :key="stat.key" @click="rollSave(stat)"
                            class="group px-3 py-2 rounded-lg bg-stone-900/70 ring-1 ring-stone-700 text-left hover:ring-amber-600/50 transition">
                            <div class="flex items-center justify-between">
                                <span class="text-[11px] tracking-wider uppercase text-stone-300/80">{{ stat.label
                                    }}</span>
                                <span class="font-semibold text-amber-200 group-hover:scale-110 transition">{{ stat.mod
                                    >= 0 ? '+'+stat.mod : stat.mod }}</span>
                            </div>
                            <div class="mt-1 text-xs text-stone-400/80">Save</div>
                        </button>
                    </div>
                </div>

                <!-- Advanced stats & saves (bottom, scrollable) -->
                <div class="flex-1 overflow-auto p-3 md:p-4">
                    <h3 class="text-xs tracking-widest uppercase text-stone-400 mb-2">Skills & Checks</h3>
                    <div class="grid grid-cols-2 gap-2">
                        <button v-for="skill in skills" :key="skill.key" @click="rollSkill(skill)"
                            class="px-3 py-2 rounded-lg bg-stone-900/60 ring-1 ring-stone-800 text-left hover:ring-amber-600/40 transition">
                            <div class="flex items-center justify-between">
                                <span class="text-[12px]">{{ skill.label }}</span>
                                <span class="text-sm font-semibold text-amber-200">{{ skill.mod >= 0 ? '+' + skill.mod :
                                    skill.mod }}</span>
                            </div>
                            <div class="text-[11px] text-stone-400">{{ skill.ability }}</div>
                        </button>
                    </div>
                </div>
            </section>

            <!-- CENTER 40% -->
            <section class="border-r border-stone-800/70 flex flex-col overflow-hidden">
                <!-- Top 60%: Placeholder for map/notes/encounter -->
                <div
                    class="flex-1 p-4 bg-[radial-gradient(100%_100%_at_50%_0%,rgba(34,24,16,.6),transparent)] relative">
                    <div
                        class="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
                    <div
                        class="h-full rounded-xl border border-stone-800/70 bg-stone-950/40 backdrop-blur-sm p-4 flex flex-col">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm tracking-widest uppercase text-stone-300">Encounter Space</h3>
                            <div class="text-[11px] text-stone-400">(Drop your battle map, notes, or initiative tracker
                                here later)</div>
                        </div>
                        <div class="mt-3 grid place-items-center flex-1">
                            <p class="text-stone-400/80 text-center max-w-sm leading-relaxed">
                                This area is intentionally open. Later we can mount: a shared map, initiative order, GM
                                notes, or a rules reference. It syncs per <span class="text-amber-200">sessionId</span>.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Bottom 40%: Party feed -->
                <div class="h-[40%] min-h-[220px] border-t border-stone-800/70 bg-stone-950/70">
                    <div class="h-full flex flex-col">
                        <div class="px-4 py-2 flex items-center justify-between">
                            <h3 class="text-sm tracking-widest uppercase text-stone-300">Party Feed</h3>
                            <div class="text-[11px] text-stone-400">Live events: rolls, damage, items</div>
                        </div>
                        <div ref="feedEl" class="flex-1 overflow-auto px-4 pb-4 space-y-2">
                            <div v-for="e in feed" :key="e.id"
                                class="rounded-lg bg-stone-900/70 ring-1 ring-stone-800 p-3">
                                <div class="flex items-center justify-between text-xs">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="inline-flex h-6 w-6 items-center justify-center rounded bg-amber-800/40 ring-1 ring-amber-700/40 text-[11px] font-semibold">{{
                                            e.player.initials }}</span>
                                        <span class="font-medium">{{ e.player.name }}</span>
                                    </div>
                                    <span class="text-stone-400">{{ formatTime(e.ts) }}</span>
                                </div>
                                <div class="mt-1 text-sm">
                                    <span class="text-stone-300" v-html="e.message"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- RIGHT 30% -->
            <section class="flex flex-col overflow-hidden">
                <!-- Top 70%: Items & Actions -->
                <div class="flex-1 p-3 md:p-4 overflow-auto">
                    <h3 class="text-xs tracking-widest uppercase text-stone-400 mb-2">Items & Actions</h3>
                    <div class="grid grid-cols-2 gap-2">
                        <div v-for="item in items" :key="item.id"
                            class="rounded-lg bg-stone-900/60 ring-1 ring-stone-800 p-3">
                            <div class="flex items-center justify-between">
                                <h4 class="text-sm font-semibold">{{ item.name }}</h4>
                                <span class="text-[11px] text-stone-400">x{{ item.qty }}</span>
                            </div>
                            <p class="mt-1 text-xs text-stone-400 line-clamp-2">{{ item.desc }}</p>
                            <div class="mt-2 flex items-center gap-2">
                                <button @click="useItem(item)"
                                    class="text-xs px-2 py-1 rounded bg-amber-800/40 ring-1 ring-amber-700/40 hover:ring-amber-500/60">Use</button>
                                <button @click="rollDamage(item)"
                                    class="text-xs px-2 py-1 rounded bg-stone-800 ring-1 ring-stone-700 hover:ring-amber-600/40">Roll</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottom 30%: Dice Box -->
                <div
                    class="h-[30%] min-h-[220px] border-t border-stone-800/70 bg-stone-950/70 p-4 relative overflow-hidden">
                    <h3 class="text-sm tracking-widest uppercase text-stone-300">Dice Box</h3>
                    <div class="mt-3 grid grid-cols-5 gap-2 text-sm">
                        <button v-for="preset in dicePresets" :key="preset.label" @click="quickRoll(preset)"
                            class="px-3 py-2 rounded-lg bg-stone-900/70 ring-1 ring-stone-800 hover:ring-amber-600/40">{{
                            preset.label }}</button>
                    </div>

                    <!-- Rolling visualization -->
                    <div class="absolute inset-x-4 bottom-4 flex items-end justify-between">
                        <div class="text-xs text-stone-400">Last roll: <span class="text-stone-200 font-semibold">{{
                                lastRollDisplay }}</span></div>
                        <div class="relative h-16 w-16 grid place-items-center">
                            <div :class="['transition-transform duration-300', isSpinning ? 'animate-spin-slow' : '']">
                                <D20Display :value="currentRoll" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Floating D20 trigger -->
        <button @click="openDice()"
            class="group fixed bottom-5 right-5 z-20 h-14 w-14 rounded-2xl grid place-items-center bg-gradient-to-br from-amber-700 to-amber-900 shadow-xl ring-2 ring-amber-600/60 hover:scale-105 active:scale-95 transition">
            <D20Display :value="currentRoll || 20" class="group-hover:scale-110 transition" />
            <span class="sr-only">Open Dice Roller</span>
        </button>

        <!-- Dice Modal -->
        <transition name="fade">
            <div v-if="diceOpen" class="fixed inset-0 z-30 grid place-items-center bg-black/60 p-4"
                @keydown.esc="diceOpen = false">
                <div class="w-full max-w-md rounded-2xl bg-stone-950 ring-1 ring-stone-800 shadow-2xl overflow-hidden">
                    <div class="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
                        <h3 class="text-sm tracking-widest uppercase text-stone-300">Roll Dice</h3>
                        <button @click="diceOpen = false" class="text-stone-400 hover:text-stone-200">✕</button>
                    </div>
                    <div class="p-5 space-y-4">
                        <div class="grid grid-cols-3 gap-2">
                            <button v-for="d in [4, 6, 8, 10, 12, 20, 100]" :key="d" @click="die.value = d"
                                :class="['px-3 py-2 rounded-lg ring-1', die.value === d ? 'bg-amber-900/40 ring-amber-700/50' : 'bg-stone-900 ring-stone-800']">d{{
                                d }}</button>
                        </div>
                        <div class="flex items-center gap-3">
                            <label class="text-sm text-stone-300 w-24">Dice Count</label>
                            <input v-model.number="count.value" type="number" min="1" max="20"
                                class="w-24 px-2 py-1 rounded bg-stone-900 ring-1 ring-stone-800" />
                        </div>
                        <div class="flex items-center gap-3">
                            <label class="text-sm text-stone-300 w-24">Modifier</label>
                            <input v-model.number="modifier.value" type="number"
                                class="w-24 px-2 py-1 rounded bg-stone-900 ring-1 ring-stone-800" />
                        </div>
                        <div class="pt-2 flex items-center justify-between">
                            <div class="text-xs text-stone-400">Formula: <span class="text-stone-200 font-semibold">{{
                                    formula }}</span></div>
                            <button @click="performRoll()"
                                class="px-3 py-2 rounded-lg bg-amber-800/50 ring-1 ring-amber-700/50 hover:ring-amber-500/60">Roll</button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'

/**
 * NOTE ON MULTIPLAYER ARCHITECTURE
 * This UI anticipates a realtime backend. Wire these seams:
 *  - sendEvent(e): push to Firestore/WebSocket for sessionId.
 *  - subscribeToSession(sessionId, cb): stream events into `feed` & player state.
 *  - presence list -> `players`.
 */

// Props (drop into existing app router/view)
const props = defineProps({
    sessionId: { type: String, default: 'demo-session' },
    userId: { type: String, default: 'user_001' },
})

// Layout: 30 | 40 | 30
const gridTemplate = computed(() => ({ gridTemplateColumns: '30% 40% 30%' }))

// Current player (would come from auth/profile)
const currentPlayer = reactive({
    id: props.userId,
    name: 'Mase',
    initials: 'MS',
    class: 'Fighter (Champion)',
    race: 'Human',
    level: 5,
    tags: ['AC 17', 'HP 42', 'Speed 30ft'],
})

// Other connected players (presence)
const players = ref([
    currentPlayer,
    { id: 'u2', name: 'Froggy', initials: 'FR', class: 'Druid', race: 'Elf', level: 5, tags: ['AC 15', 'HP 33'] },
])

// Passive stats for quick saves
const passiveStats = ref([
    { key: 'str', label: 'Strength', mod: 3 },
    { key: 'dex', label: 'Dexterity', mod: 1 },
    { key: 'con', label: 'Constitution', mod: 2 },
    { key: 'int', label: 'Intelligence', mod: 0 },
    { key: 'wis', label: 'Wisdom', mod: 2 },
    { key: 'cha', label: 'Charisma', mod: -1 },
])

// Skills list (click to roll)
const skills = ref([
    { key: 'ath', label: 'Athletics', ability: 'STR', mod: 5 },
    { key: 'acr', label: 'Acrobatics', ability: 'DEX', mod: 2 },
    { key: 'ste', label: 'Stealth', ability: 'DEX', mod: 3 },
    { key: 'per', label: 'Perception', ability: 'WIS', mod: 4 },
    { key: 'ins', label: 'Insight', ability: 'WIS', mod: 3 },
    { key: 'inv', label: 'Investigation', ability: 'INT', mod: 1 },
    { key: 'his', label: 'History', ability: 'INT', mod: 0 },
    { key: 'prf', label: 'Performance', ability: 'CHA', mod: 1 },
    { key: 'prs', label: 'Persuasion', ability: 'CHA', mod: 2 },
    { key: 'sur', label: 'Survival', ability: 'WIS', mod: 2 },
])

// Items & actions (right column)
const items = ref([
    { id: 'i1', name: 'Longsword', qty: 1, desc: 'Versatile blade. Damage: 1d8 slashing (1d10 two-handed).' },
    { id: 'i2', name: 'Javelin', qty: 4, desc: 'Thrown 30/120. Damage: 1d6 piercing.' },
    { id: 'i3', name: 'Potion of Healing', qty: 2, desc: 'Regain 2d4 + 2 HP.' },
    { id: 'i4', name: 'Shield Bash', qty: 3, desc: 'Shove attempt; contest Athletics.' },
])

function useItem(item) {
    if (item.qty <= 0) return
    item.qty--
    pushFeed({
        type: 'item',
        message: `<b>used</b> <i>${item.name}</i>.`,
    })
}

function rollDamage(item) {
    // naive parse for demo: find something like 1d8
    const m = item.desc.match(/(\d+)d(\d+)/)
    if (!m) return quickRoll({ d: 20, n: 1, label: 'd20' })
    quickRoll({ d: parseInt(m[2]), n: parseInt(m[1]), label: `${m[1]}d${m[2]}` })
}

// Party feed
const feed = ref([])
const feedEl = ref()
function pushFeed({ type, message, player = currentPlayer, meta = {} }) {
    feed.value.push({ id: cryptoRandomId(), type, message, player, meta, ts: Date.now() })
    // scroll to bottom
    requestAnimationFrame(() => {
        if (feedEl.value) { feedEl.value.scrollTop = feedEl.value.scrollHeight }
    })
    // TODO: sendEvent(...) to backend per-session
}

function formatTime(ts) {
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Dice logic
const diceOpen = ref(false)
const die = ref(20)
const count = ref(1)
const modifier = ref(0)
const currentRoll = ref(20)
const lastRollDisplay = ref('—')
const isSpinning = ref(false)

const dicePresets = [
    { n: 1, d: 20, label: '1d20' },
    { n: 2, d: 20, label: '2d20' },
    { n: 1, d: 12, label: '1d12' },
    { n: 1, d: 8, label: '1d8' },
    { n: 1, d: 6, label: '1d6' },
]

const formula = computed(() => `${count.value}d${die.value}${modifier.value ? (modifier.value > 0 ? `+${modifier.value}` : modifier.value) : ''}`)

function openDice() { diceOpen.value = true }

function cryptoRandom() {
    const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] / 0xFFFFFFFF
}

function rollOnce(d) {
    return Math.max(1, Math.floor(cryptoRandom() * d) + 1)
}

async function performRoll() {
    diceOpen.value = false
    await animateSpin()
    const results = Array.from({ length: count.value }, () => rollOnce(die.value))
    const sum = results.reduce((a, b) => a + b, 0) + (modifier.value || 0)
    currentRoll.value = results[results.length - 1]
    lastRollDisplay.value = `${formula.value} → ${results.join('+')}${modifier.value ? (modifier.value > 0 ? `+${modifier.value}` : modifier.value) : ''} = ${sum}`
    pushFeed({ type: 'roll', message: `rolled <b>${formula.value}</b> → <b>${sum}</b> <span class='text-stone-400'>( ${results.join(' + ')}${modifier.value ? (modifier.value > 0 ? ` + ${modifier.value}` : ` ${modifier.value}`) : ''} )</span>` })
}

async function quickRoll(preset) {
    die.value = preset.d; count.value = preset.n; modifier.value = 0
    await performRoll()
}

async function animateSpin() {
    isSpinning.value = true
    // Flash random faces while spinning
    const t0 = performance.now()
    const duration = 750
    while (performance.now() - t0 < duration) {
        currentRoll.value = rollOnce(die.value)
        await new Promise(r => setTimeout(r, 50))
    }
    isSpinning.value = false
}

function rollSave(stat) {
    die.value = 20; count.value = 1; modifier.value = stat.mod
    performRoll()
}

function rollSkill(skill) {
    die.value = 20; count.value = 1; modifier.value = skill.mod
    performRoll()
}

function cryptoRandomId() {
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}

// Seed feed demo
onMounted(() => {
    pushFeed({ type: 'join', player: players.value[1], message: '<i>entered the session</i>' })
})

// D20 Display component (simple SVG)
const D20Display = {
    name: 'D20Display',
    props: { value: { type: Number, default: 20 } },
    template: `
      <div class="relative h-12 w-12 grid place-items-center">
        <svg viewBox="0 0 64 64" class="h-12 w-12 drop-shadow">
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0" stop-color="#b45309"/>
              <stop offset="1" stop-color="#7c2d12"/>
            </linearGradient>
          </defs>
          <polygon fill="url(#g)" stroke="#78350f" stroke-width="2" points="32,2 4,16 4,48 32,62 60,48 60,16"/>
          <g stroke="#f59e0b" stroke-width="1" opacity="0.8">
            <line x1="32" y1="2" x2="32" y2="62"/>
            <line x1="4" y1="16" x2="60" y2="48"/>
            <line x1="60" y1="16" x2="4" y2="48"/>
            <line x1="4" y1="16" x2="32" y2="32"/>
            <line x1="60" y1="16" x2="32" y2="32"/>
          </g>
        </svg>
        <div class="absolute inset-0 grid place-items-center font-black text-xl">{{ value }}</div>
      </div>
    `
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s ease
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0
}

/* slow spin util */
@keyframes spin-slow {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin-slow {
    animation: spin-slow 0.75s linear infinite;
}
</style>