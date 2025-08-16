<template>
    <div class="flex flex-col items-center gap-6">
        <!-- GRID -->
        <div class="w-full mx-auto max-w-[min(92vw,22rem)]">
            <div class="flex flex-col items-center gap-1">
                <div v-for="r in 6" :key="'r-' + r" class="grid grid-cols-5 gap-1 justify-center"
                    :class="{ 'row-shake': shakingRow === r - 1 }">
                    <div v-for="c in 5" :key="'c-' + r + '-' + c"
                        class="tile w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
                        <div class="flip-inner" :class="flipClasses(r - 1, c - 1)" :style="flipStyle(r - 1, c - 1)">
                            <!-- FRONT: neutral with letters (input row + revealing row) -->
                            <div class="face front grid place-items-center rounded-md border font-semibold select-none"
                                :class="frontNeutralClass()">
                                {{ frontChar(r - 1, c - 1) }}
                            </div>
                            <!-- BACK: colored result with letters -->
                            <div class="face back grid place-items-center rounded-md border font-semibold select-none"
                                :class="r - 1 < rows.length ? backMaskClass(r - 1, c - 1) : 'bg-zinc-900/70 border-zinc-800 text-transparent'">
                                {{ backChar(r - 1, c - 1) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- INFO BLIP -->
        <transition name="fade">
            <div v-if="flashMsg" class="text-xs px-3 py-1 rounded-full ring-1" :class="flashType === 'error' ? 'bg-amber-500/10 text-amber-300 ring-amber-400/30'
                : 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/30'">
                {{ flashMsg }}
            </div>
        </transition>

        <!-- KEYBOARD -->
        <div class="w-full max-w-[min(96vw,28rem)]" :class="{ 'opacity-70 pointer-events-none': !store.canType }">
            <div class="flex flex-col gap-1">
                <div class="flex gap-1">
                    <KeyButton v-for="k in row1" :key="k" :k="k" :state="keyState(k)" :disabled="!store.canType"
                        @press="onKey" />
                </div>
                <div class="flex gap-1">
                    <span class="flex-1" />
                    <KeyButton v-for="k in row2" :key="k" :k="k" :state="keyState(k)" :disabled="!store.canType"
                        @press="onKey" />
                    <span class="flex-1" />
                </div>
                <div class="flex gap-1">
                    <button
                        class="h-12 flex-1 min-w-[3.2rem] rounded-md text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50"
                        :disabled="!store.canType" @click="onKey('Enter')" aria-label="Enter" title="Enter">
                        <div class="flex items-center justify-center gap-2">
                            <CornerDownLeft class="h-4 w-4" />
                        </div>
                    </button>
                    <KeyButton v-for="k in row3" :key="k" :k="k" :state="keyState(k)" :disabled="!store.canType"
                        @press="onKey" />
                    <button
                        class="h-12 flex-1 min-w-[3.2rem] rounded-md text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50"
                        :disabled="!canBackspace" @click="onKey('Backspace')" aria-label="Backspace" title="Backspace">
                        <div class="flex items-center justify-center gap-2">
                            <Delete class="h-4 w-4" />
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Completion Overlay -->
        <WordleCompletionOverlay :show="showCompletionOverlay" :is-win="status === 'won'" :attempts="rows.length"
            :streak="store.profile?.currentStreak || 0" :answer="store.answer" :emoji-grid="emojiGrid"
            :rollover-at="store.rolloverAt" @close="showCompletionOverlay = false" @share="onShare" />
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, watch, nextTick } from 'vue';
import { useWordleStore } from '@/stores/dailyGames/useWordleStore';
import KeyButton from './components/KeyButton.vue';
import WordleCompletionOverlay from './components/WordleCompletionOverlay.vue';
import { CornerDownLeft, Delete } from 'lucide-vue-next';

const store = useWordleStore();

const flashMsg = ref('');
const flashType = ref('info');
const showCompletionOverlay = ref(false);

const row1 = 'QWERTYUIOP'.split('');
const row2 = 'ASDFGHJKL'.split('');
const row3 = 'ZXCVBNM'.split('');

async function loadAllowedWords() {
    try {
        const mod = await import('word-list-json');
        let raw = mod.default ?? mod.words ?? mod.list ?? mod;
        let arr;
        if (Array.isArray(raw)) arr = raw;
        else if (raw && typeof raw === 'object') arr = Object.keys(raw);
        else arr = [];
        const five = arr.filter(w => typeof w === 'string' && /^[a-z]{5}$/.test(w)).map(w => w.toLowerCase());
        store.setAllowedWords(new Set(five));
    } catch { /* stay permissive; server still validates */ }
}

onMounted(() => {
    loadAllowedWords();
    window.addEventListener('keydown', onKeydown);

    // Check if game is already complete on mount
    if (status.value === 'won' || status.value === 'lost') {
        // Show overlay after a brief delay if game is already complete
        setTimeout(() => {
            showCompletionOverlay.value = true;
        }, 500);
    }
});

onUnmounted(() => window.removeEventListener('keydown', onKeydown));

const rows = computed(() => store.rows);
const status = computed(() => store.status);

// Generate emoji grid for sharing
const emojiGrid = computed(() => {
    if (rows.value.length === 0) return '';
    return rows.value.map(row => store.maskToEmoji(row.mask)).join('\n');
});

// ---- reveal control ----
const revealingRow = ref(-1);
const STAGGER = 120;
const FLIP_MS = 600;

// Watch for new rows being added
watch(() => rows.value.length, async (n, o) => {
    if (typeof o === 'number' && n === o + 1) {
        revealingRow.value = n - 1;

        // Wait for reveal animation to complete
        setTimeout(async () => {
            revealingRow.value = -1;

            // Check if game just ended
            await nextTick();
            if (status.value === 'won' || status.value === 'lost') {
                // Show completion overlay after tiles finish flipping
                setTimeout(() => {
                    showCompletionOverlay.value = true;
                }, 200);
            }
        }, 5 * STAGGER + FLIP_MS + 50);
    }
});

// Watch for status changes (in case game ends another way)
watch(status, (newStatus, oldStatus) => {
    if (oldStatus === 'idle' && (newStatus === 'won' || newStatus === 'lost')) {
        // If we didn't already show it from the row watcher
        if (!showCompletionOverlay.value) {
            setTimeout(() => {
                showCompletionOverlay.value = true;
            }, 5 * STAGGER + FLIP_MS + 250);
        }
    }
});

// helpers
function isSubmittedRow(r) { return r < rows.value.length; }
function isOldSubmittedRow(r) { return r < rows.value.length - 1; }
function isNewestSubmittedRow(r) { return r === rows.value.length - 1; }
function isRevealingRow(r) { return revealingRow.value === r; }

function frontNeutralClass() { return 'border-zinc-700/70 bg-zinc-900/80 text-white'; }
function backMaskClass(r, c) {
    const ch = rows.value[r]?.mask[c];
    if (ch === 'G') return 'border-emerald-600/80 bg-emerald-600/40 text-white';
    if (ch === 'Y') return 'border-amber-600/80 bg-amber-600/40 text-white';
    return 'border-zinc-700 bg-zinc-800/80 text-zinc-400';
}

function frontChar(r, c) {
    if (status.value === 'idle' && r === rows.value.length) return (store.currentInput[c] || '').toUpperCase();
    if (isRevealingRow(r)) return rows.value[r]?.guess[c] ?? '';
    return '';
}
function backChar(r, c) {
    if (r < rows.value.length) return rows.value[r].guess[c] ?? '';
    return '';
}

function isTileFlipped(r, c) {
    if (isOldSubmittedRow(r)) return true;
    if (isNewestSubmittedRow(r)) {
        if (isRevealingRow(r)) return c <= revealColNow(r);
        return true;
    }
    return false;
}

function revealColNow(r) {
    return 5;
}

// flip classes & style
function flipClasses(r, c) {
    const flipped = isTileFlipped(r, c) ? 'flipped' : '';
    const trans = isRevealingRow(r) ? 'with-transition' : 'no-transition';
    return [flipped, trans];
}
function flipStyle(r, c) {
    return isRevealingRow(r) ? { transitionDelay: `${c * STAGGER}ms` } : { transitionDelay: '0ms' };
}

// keyboard
function onKey(k) {
    if (k === 'Enter') {
        store.enter().catch(e => {
            if (e?.message === 'invalid_word') { blip('Not in word list', 'error'); triggerShake(); }
            else if (e?.message === 'duplicate_guess') { blip('Already tried that', 'error'); triggerShake(); }
        });
        return;
    }
    if (k === 'Backspace') { store.backspace(); return; }
    if (/^[a-zA-Z]$/.test(k)) store.typeLetter(k);
}
function onKeydown(e) {
    if (!store.canType) return;
    if (e.key === 'Backspace' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) e.preventDefault();
    onKey(e.key);
}
const canBackspace = computed(() => store.canType && store.currentInput.length > 0);

// shake
const shakingRow = ref(-1);
function triggerShake() { const i = rows.value.length; shakingRow.value = i; setTimeout(() => shakingRow.value = -1, 500); }
function blip(msg, type = 'info') { flashMsg.value = msg; flashType.value = type; setTimeout(() => flashMsg.value = '', 1500); }

function keyState(letter) {
    const L = letter.toUpperCase(); let best = 'unknown';
    for (const r of rows.value) {
        for (let i = 0; i < r.guess.length; i++) {
            if (r.guess[i] !== L) continue;
            const m = r.mask[i];
            if (m === 'G') best = 'hit';
            else if (m === 'Y' && best !== 'hit') best = 'partial';
            else if (m === 'B' && best === 'unknown') best = 'miss';
        }
        if (best === 'hit') break;
    }
    return best;
}

// Share functionality
async function onShare() {
    try {
        const text = store.shareText?.() || 'Wordle completed!';

        if (navigator.share) {
            await navigator.share({ text });
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            blip('Copied to clipboard!', 'info');
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            blip('Copied to clipboard!', 'info');
        }
    } catch (error) {
        console.warn('Error sharing:', error);
        blip('Share failed', 'error');
    }
}
</script>

<style scoped>
/* 3D flip scaffolding */
.tile {
    perspective: 800px;
    perspective-origin: center center;
}

.flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transform: rotateX(0deg);
}

/* flipped shows the back face */
.flipped {
    transform: rotateX(180deg);
}

/* animate only the newest row; old rows are static (no jitter on hydration) */
.with-transition {
    transition: transform 600ms cubic-bezier(.2, .7, .2, 1);
}

.no-transition {
    transition: none;
}

/* Faces */
.face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
}

.face.back {
    transform: rotateX(180deg);
}

/* Shake */
@keyframes rowShake {

    10%,
    90% {
        transform: translateX(-1px);
    }

    20%,
    80% {
        transform: translateX(2px);
    }

    30%,
    50%,
    70% {
        transform: translateX(-4px);
    }

    40%,
    60% {
        transform: translateX(4px);
    }
}

.row-shake {
    animation: rowShake 450ms ease both;
}

/* Fade toast */
.fade-enter-active,
.fade-leave-active {
    transition: opacity .18s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>