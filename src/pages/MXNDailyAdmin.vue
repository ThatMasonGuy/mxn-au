<template>
    <div class="mx-auto max-w-xl p-6 text-zinc-100">
        <h1 class="text-2xl font-semibold mb-1">MXN Daily — Admin (Word)</h1>
        <p class="text-sm text-zinc-400 mb-6">Seed a Word day: picks the date and solution, creates game + day docs with
            zero stats.</p>

        <form @submit.prevent="submit" class="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div class="grid grid-cols-1 gap-4">
                <label class="flex flex-col gap-1">
                    <span class="text-xs uppercase tracking-wide text-zinc-400">Date (AEST)</span>
                    <input type="date" v-model="date"
                        class="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm" required />
                    <span class="text-xs text-zinc-500">Today (AEST): {{ today }}</span>
                </label>

                <label class="flex flex-col gap-1">
                    <span class="text-xs uppercase tracking-wide text-zinc-400">Solution (5 letters)</span>
                    <input type="text" v-model="word" maxlength="5" placeholder="CHAOS"
                        class="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm uppercase tracking-widest"
                        @input="word = (word || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5)" required />
                    <span class="text-xs text-zinc-500">Must be 5 letters, A–Z.</span>
                </label>

                <label class="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="patchGameRoot" class="h-4 w-4" />
                    <span>Ensure game root doc exists / patch stats (recommended)</span>
                </label>

                <label class="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" v-model="overwriteIfExists" class="h-4 w-4" />
                    <span>Overwrite day doc if it already exists</span>
                </label>
            </div>

            <div class="flex items-center gap-3 pt-2">
                <button type="submit" :disabled="submitting || !isValid"
                    class="rounded-md border border-violet-700 bg-violet-700/20 px-4 py-2 text-sm hover:bg-violet-700/30 disabled:opacity-50">
                    {{ submitting ? 'Seeding…' : 'Create day' }}
                </button>
                <div v-if="msg" :class="['text-sm', isError ? 'text-rose-400' : 'text-emerald-400']">{{ msg }}</div>
            </div>
        </form>

        <div class="mt-6 text-xs text-zinc-500">
            <p>Writes:</p>
            <ul class="list-disc ml-5 mt-1 space-y-1">
                <li><code>/dailyChallenges/word</code> (only if “Ensure game root…” is ticked)</li>
                <li><code>/dailyChallenges/word/games/{{ date }}</code></li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { firestore } from '@/firebase'

// ---- AEST helpers ----
const AEST_TZ = 'Australia/Brisbane'
function fmtAEST(d) {
    const y = new Intl.DateTimeFormat('en-CA', { timeZone: AEST_TZ, year: 'numeric' }).format(d)
    const m = new Intl.DateTimeFormat('en-CA', { timeZone: AEST_TZ, month: '2-digit' }).format(d)
    const day = new Intl.DateTimeFormat('en-CA', { timeZone: AEST_TZ, day: '2-digit' }).format(d)
    return `${y}-${m}-${day}`
}
const today = ref(fmtAEST(new Date()))

// ---- form state ----
const date = ref(today.value)
const word = ref('')
const patchGameRoot = ref(true)
const overwriteIfExists = ref(false)

const submitting = ref(false)
const msg = ref('')
const isError = ref(false)

const isValid = computed(() => /^[A-Z]{5}$/.test(word.value))

// ---- zeroed stats shapes (matches your store expectations) ----
function zeroGameStats() {
    return {
        totalPlays: 0,
        totalWins: 0,
        totalPlayers: 0,
        attemptsHistogram: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, 'fail': 0 }
    }
}
function zeroDayStats() {
    return {
        plays: 0,
        wins: 0,
        players: 0,
        attemptsHistogram: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, 'fail': 0 }
    }
}

async function submit() {
    msg.value = ''
    isError.value = false
    if (!isValid.value) {
        msg.value = 'Word must be exactly 5 letters.'
        isError.value = true
        return
    }
    submitting.value = true
    try {
        const gameId = 'word'
        // 1) Create/patch game root (optional)
        if (patchGameRoot.value) {
            const gameRef = doc(firestore, 'dailyChallenges', gameId)
            const snap = await getDoc(gameRef)
            if (!snap.exists()) {
                await setDoc(gameRef, {
                    gameId,
                    name: 'Word',
                    description: 'Guess the 5-letter word in 6 tries',
                    stats: zeroGameStats(),
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            } else {
                // Non-destructive patch: ensure fields exist
                await setDoc(gameRef, {
                    gameId,
                    name: snap.data().name || 'Word',
                    stats: Object.assign(zeroGameStats(), snap.data().stats || {}),
                    updatedAt: serverTimestamp()
                }, { merge: true })
            }
        }

        // 2) Create (or overwrite) day doc
        const dayRef = doc(firestore, 'dailyChallenges', gameId, 'games', date.value)
        const daySnap = await getDoc(dayRef)
        if (daySnap.exists() && !overwriteIfExists.value) {
            msg.value = `Day already exists for ${date.value}. Tick "Overwrite" to replace.`
            isError.value = true
            submitting.value = false
            return
        }

        await setDoc(dayRef, {
            date: date.value,
            solution: word.value.toUpperCase(),
            stats: zeroDayStats(),
            updatedAt: serverTimestamp()
        }, { merge: true })

        msg.value = `Seeded word for ${date.value}: ${word.value.toUpperCase()}`
        isError.value = false
    } catch (e) {
        console.error(e)
        msg.value = 'Failed to seed. Check console & rules.'
        isError.value = true
    } finally {
        submitting.value = false
    }
}

onMounted(() => {
    // ensure today defaults in AEST even if client clock is skewed
    today.value = fmtAEST(new Date())
    if (!date.value) date.value = today.value
})
</script>