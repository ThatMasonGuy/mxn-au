<template>
    <div class="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
        <div class="mx-auto max-w-3xl px-4 py-6 md:py-10">
            <!-- Header -->
            <header class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div
                        class="grid h-10 w-10 place-items-center rounded-2xl bg-violet-600/20 ring-1 ring-violet-500/30">
                        <Trophy class="h-5 w-5" />
                    </div>
                    <div>
                        <h1 class="text-xl font-bold tracking-tight md:text-2xl">MXN Daily — Wordle</h1>
                        <p class="text-xs text-zinc-400">Resets at midnight UTC • Login to track progress</p>
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <div
                        class="hidden sm:flex items-center gap-2 rounded-xl bg-zinc-800/60 px-3 py-2 ring-1 ring-zinc-700">
                        <Clock class="h-4 w-4 shrink-0" />
                        <span class="text-xs tabular-nums">Resets in {{ countdown }}</span>
                    </div>
                    <div
                        class="hidden sm:flex items-center gap-2 rounded-xl bg-zinc-800/60 px-3 py-2 ring-1 ring-zinc-700">
                        <User class="h-4 w-4 shrink-0" />
                        <span class="text-xs">
                            Streak:
                            <span class="font-semibold">{{ profile?.currentStreak ?? 0 }}</span>
                            <span class="text-zinc-500">/ max {{ profile?.maxStreak ?? 0 }}</span>
                        </span>
                    </div>
                </div>
            </header>

            <!-- Actions -->
            <div class="mt-6 flex flex-wrap items-center gap-2">
                <!-- Share -->
                <button type="button"
                    class="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium ring-1 ring-violet-500/40 hover:bg-violet-500"
                    @click="onShare" :disabled="shareBusy || store.rows.length === 0"
                    :aria-disabled="shareBusy || store.rows.length === 0">
                    <Share2 class="h-4 w-4" />
                    <span>{{ shareBusy ? 'Copying…' : 'Share' }}</span>
                </button>

                <!-- 🧨 DEV RESET (only in dev or ?dev) -->
                <button v-if="showDevReset" type="button"
                    class="inline-flex items-center gap-2 rounded-xl bg-rose-700/80 px-4 py-2 text-sm font-semibold ring-1 ring-rose-500/40 hover:bg-rose-600"
                    @click="devReset" title="Dev: clear local Wordle state (does not touch Firestore)">
                    <Trash2 class="h-4 w-4" />
                    <span>Dev Reset</span>
                </button>

                <span v-if="copyMsg" class="text-xs text-emerald-400">{{ copyMsg }}</span>

                <div class="ml-auto">
                    <span v-if="store.loading"
                        class="rounded-full bg-zinc-800 px-3 py-1 text-xs ring-1 ring-zinc-700">Loading…</span>
                    <span v-else-if="store.status === 'won'"
                        class="rounded-full bg-emerald-600/20 px-3 py-1 text-xs ring-1 ring-emerald-500/40 text-emerald-300">
                        Solved in {{ store.rows.length }}/6
                    </span>
                    <span v-else-if="store.status === 'lost'"
                        class="rounded-full bg-rose-600/20 px-3 py-1 text-xs ring-1 ring-rose-500/40 text-rose-300">
                        Missed it · X/6
                    </span>
                    <span v-else-if="store.isLocked"
                        class="rounded-full bg-zinc-800 px-3 py-1 text-xs ring-1 ring-zinc-700">
                        Locked until reset
                    </span>
                </div>
            </div>

            <!-- Card with the board -->
            <div
                class="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-lg shadow-black/30 backdrop-blur-md md:p-6">
                <WordleBoard />
                <!-- Footer stats -->
                <div class="mt-6 grid grid-cols-3 gap-2 text-center">
                    <div class="rounded-xl bg-zinc-800/60 p-3 ring-1 ring-zinc-700">
                        <div class="text-xs text-zinc-400">Plays</div>
                        <div class="mt-1 text-lg font-semibold tabular-nums">{{ profile?.totalPlays ?? 0 }}</div>
                    </div>
                    <div class="rounded-xl bg-zinc-800/60 p-3 ring-1 ring-zinc-700">
                        <div class="text-xs text-zinc-400">Wins</div>
                        <div class="mt-1 text-lg font-semibold tabular-nums">{{ profile?.wins ?? 0 }}</div>
                    </div>
                    <div class="rounded-xl bg-zinc-800/60 p-3 ring-1 ring-zinc-700">
                        <div class="text-xs text-zinc-400">Losses</div>
                        <div class="mt-1 text-lg font-semibold tabular-nums">{{ profile?.losses ?? 0 }}</div>
                    </div>
                </div>
            </div>

            <footer class="mt-8 text-center text-xs text-zinc-500">
                Built by Mason • Resets at <span class="font-medium">00:00 UTC</span>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useWordleStore } from '@/stores/dailyGames/useWordleStore';
import WordleBoard from '@/components/mxn/dailyGames/WordleBoard.vue';
import { Trash2, Share2, Trophy, User, Clock } from 'lucide-vue-next';

const store = useWordleStore();

const shareBusy = ref(false);
const copyMsg = ref('');
const profile = computed(() => store.profile);

// show the Dev Reset only in dev OR with ?dev
const showDevReset = computed(() => {
  try { if (import.meta.env.DEV) return true; } catch {}
  return new URLSearchParams(location.search).has('dev');
});

// DEV reset (local only)
async function devReset() {
  try {
    localStorage.removeItem('mxn:daily:wordle');
    store.hardResetLocal?.();
    copyMsg.value = 'Local state cleared';
    setTimeout(() => location.reload(), 350);
  } catch { /* ignore */ }
}

// Countdown (UTC)
const countdown = ref('00:00:00');
let timer = null;
function tick() {
  const iso = store.rolloverAt;
  if (!iso) { countdown.value = '—'; return; }
  const ms = Date.parse(iso) - Date.now();
  if (isNaN(ms) || ms <= 0) {
    countdown.value = '00:00:00';
    store.refreshIfRolledOver();
    return;
  }
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  countdown.value = `${h}:${m}:${s}`;
}

onMounted(async () => {
  store.initAuthListener();

  await store.loadDaily(true);

  tick();
  timer = setInterval(tick, 1000);
});
onUnmounted(() => { if (timer) clearInterval(timer); });

// Share
async function onShare() {
  try {
    shareBusy.value = true; copyMsg.value = '';
    const text = store.shareText();
    await navigator.clipboard.writeText(text);
    copyMsg.value = 'Copied!';
  } finally {
    shareBusy.value = false;
    setTimeout(() => (copyMsg.value = ''), 1800);
  }
}
</script>