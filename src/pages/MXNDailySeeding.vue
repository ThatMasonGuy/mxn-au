<script setup>
import { ref, computed, onMounted } from 'vue';

// ---- defaults (edit if you deploy under a different name/region)
const DEFAULT_ENDPOINT =
    'https://australia-southeast1-mxn-au.cloudfunctions.net/wordleGenerateNow';

// form state
const endpoint = ref(localStorage.getItem('seed:endpoint') || DEFAULT_ENDPOINT);
const adminKey = ref(localStorage.getItem('seed:key') || '');
const date = ref(''); // leave blank for "today UTC"
const useHeader = ref(localStorage.getItem('seed:useHeader') === '1'); // off by default
const remember = ref(localStorage.getItem('seed:remember') === '1'); // off by default

const busy = ref(false);
const errorMsg = ref('');
const result = ref(null);
const rawJson = ref('');

const isoTodayUTC = computed(() => {
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, '0');
    const d = String(now.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
});

function setToday() { date.value = isoTodayUTC.value; }
function clearDate() { date.value = ''; }

function savePrefs() {
    if (!remember.value) {
        localStorage.removeItem('seed:endpoint');
        localStorage.removeItem('seed:key');
        localStorage.removeItem('seed:useHeader');
        localStorage.removeItem('seed:remember');
        return;
    }
    localStorage.setItem('seed:endpoint', endpoint.value);
    localStorage.setItem('seed:key', adminKey.value);
    localStorage.setItem('seed:useHeader', useHeader.value ? '1' : '0');
    localStorage.setItem('seed:remember', '1');
}

onMounted(() => {
    // don’t auto-persist unless the toggle is on
    if (remember.value) savePrefs();
});

function buildUrl() {
    const params = new URLSearchParams();
    if (!useHeader.value && adminKey.value) params.set('key', adminKey.value); // query-key mode
    if (date.value) params.set('date', date.value);
    const qs = params.toString();
    return qs ? `${endpoint.value}?${qs}` : endpoint.value;
}

async function generate() {
    errorMsg.value = '';
    result.value = null;
    rawJson.value = '';
    if (!endpoint.value) { errorMsg.value = 'Endpoint is required.'; return; }
    if (!adminKey.value) { errorMsg.value = 'Admin key is required.'; return; }
    if (date.value && !/^\d{4}-\d{2}-\d{2}$/.test(date.value)) {
        errorMsg.value = 'Date must be YYYY-MM-DD (UTC)'; return;
    }

    savePrefs();
    busy.value = true;
    try {
        const url = buildUrl();

        // Prefer GET when using query-key (no preflight). Use POST when sending header.
        const usePost = useHeader.value;
        const res = await fetch(url, {
            method: usePost ? 'POST' : 'GET',
            headers: usePost ? { 'x-admin-key': adminKey.value } : undefined,
            // no body needed; API reads query/header only
        });

        const text = await res.text();
        rawJson.value = text;

        if (!res.ok) {
            errorMsg.value = `HTTP ${res.status}: ${text?.slice(0, 300) || 'request failed'}`;
            return;
        }

        try {
            const json = JSON.parse(text);
            result.value = json;
        } catch {
            // response wasn’t JSON? Just show the raw text
            result.value = { ok: true, raw: text };
        }
    } catch (e) {
        errorMsg.value = e?.message || String(e);
    } finally {
        busy.value = false;
    }
}

function openInNewTab() {
    // navigation isn’t blocked by CORS; useful if your function doesn’t send ACAO
    const url = buildUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
}

function copyCurl() {
    const qs = new URLSearchParams();
    if (date.value) qs.set('date', date.value);
    const urlNoKey = qs.toString() ? `${endpoint.value}?${qs}` : endpoint.value;

    const cmd = useHeader.value
        ? `curl -X POST "${urlNoKey}" -H "x-admin-key: ${adminKey.value}"`
        : `curl -G "${endpoint.value}" --data-urlencode "key=${adminKey.value}"${date.value ? ` --data-urlencode "date=${date.value}"` : ''}`;

    navigator.clipboard.writeText(cmd).catch(() => { });
}
</script>

<template>
    <div class="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
        <div class="mx-auto max-w-2xl px-4 py-8">
            <h1 class="text-2xl font-bold tracking-tight">Wordle — Admin Seeding</h1>
            <p class="mt-1 text-sm text-zinc-400">
                Fills missing solutions (next 14 days) and ensures day +15 is generated. Excludes last 60 days and all
                scheduled futures.
            </p>

            <div class="mt-6 space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div class="grid gap-2">
                    <label class="text-xs text-zinc-400">Endpoint URL</label>
                    <input v-model="endpoint" type="url"
                        class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-600"
                        placeholder="https://...cloudfunctions.net/wordleGenerateNow" spellcheck="false" />
                </div>

                <div class="grid gap-2">
                    <label class="text-xs text-zinc-400">Admin API key</label>
                    <input v-model="adminKey" type="password"
                        class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-600"
                        placeholder="••••••••" />
                </div>

                <div class="grid gap-2">
                    <label class="text-xs text-zinc-400">Date (UTC, optional)</label>
                    <div class="flex items-center gap-2">
                        <input v-model="date" type="text" inputmode="numeric" placeholder="YYYY-MM-DD (blank = today)"
                            class="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-600" />
                        <button class="rounded-lg bg-zinc-800 px-3 py-2 text-xs ring-1 ring-zinc-700 hover:bg-zinc-700"
                            @click="setToday" type="button">
                            Use Today (UTC)
                        </button>
                        <button class="rounded-lg bg-zinc-800 px-3 py-2 text-xs ring-1 ring-zinc-700 hover:bg-zinc-700"
                            @click="clearDate" type="button">
                            Clear
                        </button>
                    </div>
                </div>

                <div class="flex items-center justify-between gap-4">
                    <label class="flex items-center gap-2 text-xs">
                        <input type="checkbox" v-model="useHeader" class="h-4 w-4" />
                        <span>Send key in header <code class="text-[10px]">x-admin-key</code> (requires CORS)</span>
                    </label>
                    <label class="flex items-center gap-2 text-xs">
                        <input type="checkbox" v-model="remember" @change="savePrefs" class="h-4 w-4" />
                        <span>Remember on this device</span>
                    </label>
                </div>

                <div class="flex flex-wrap items-center gap-2 pt-2">
                    <button
                        class="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium ring-1 ring-violet-500/40 hover:bg-violet-500 disabled:opacity-50"
                        :disabled="busy" @click="generate">
                        {{ busy ? 'Seeding…' : 'Seed Missing + Day 15' }}
                    </button>

                    <button
                        class="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-sm font-medium ring-1 ring-zinc-700 hover:bg-zinc-700"
                        @click="openInNewTab" type="button">
                        Open in new tab
                    </button>

                    <button
                        class="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-sm font-medium ring-1 ring-zinc-700 hover:bg-zinc-700"
                        @click="copyCurl" type="button">
                        Copy cURL
                    </button>

                    <span v-if="errorMsg" class="text-xs text-amber-400">{{ errorMsg }}</span>
                </div>
            </div>

            <div v-if="result" class="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div class="text-sm font-semibold">Result</div>
                <div class="mt-2 grid gap-1 text-xs text-zinc-300">
                    <div><span class="text-zinc-400">todayId:</span> {{ result.todayId ?? '—' }}</div>
                    <div><span class="text-zinc-400">filledCount:</span> {{ result.filledCount ?? (result.ok ? '—' :
                        '0') }}</div>
                </div>

                <div v-if="result.dates?.length" class="mt-3">
                    <div class="text-xs text-zinc-400">Generated:</div>
                    <div class="mt-2 grid gap-2">
                        <div v-for="(d, i) in result.dates" :key="d"
                            class="rounded-lg border border-zinc-800 bg-zinc-950/40 p-2">
                            <div class="text-xs"><span class="text-zinc-400">Date:</span> <span class="font-medium">{{ d
                                    }}</span></div>
                            <div class="text-xs"><span class="text-zinc-400">Word:</span> <span class="font-mono">{{
                                    result.words?.[i] ?? '—' }}</span></div>
                        </div>
                    </div>
                </div>

                <details class="mt-4">
                    <summary class="cursor-pointer text-xs text-zinc-400 hover:text-zinc-300">Raw response</summary>
                    <pre class="mt-2 overflow-x-auto rounded-lg bg-black/40 p-3 text-xs">{{ rawJson }}</pre>
                </details>
            </div>
        </div>
    </div>
</template>

<style scoped>
code {
    @apply px-1 py-0.5 bg-zinc-800 rounded;
}
</style>
