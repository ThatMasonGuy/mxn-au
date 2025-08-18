<template>
    <div class="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
        <!-- Background -->
        <div class="fixed inset-0 z-0">
            <div class="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950"></div>
            <div
                class="absolute top-20 left-20 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse shadow-2xl shadow-purple-500/20">
            </div>
            <div class="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse shadow-2xl shadow-cyan-500/20"
                style="animation-delay: 2s;"></div>
            <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl animate-pulse shadow-2xl shadow-pink-500/20"
                style="animation-delay: 4s;"></div>
            <div class="absolute top-1/3 right-1/3 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse shadow-2xl shadow-emerald-500/15"
                style="animation-delay: 6s;"></div>
            <div
                class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(148,163,184,0.08)_1px,transparent_0)] bg-[length:32px_32px]">
            </div>
        </div>

        <div class="relative z-10 mx-auto max-w-5xl px-6 py-8">
            <!-- Header -->
            <div class="mb-8 text-center">
                <div class="inline-flex items-center gap-3 mb-4">
                    <div
                        class="w-10 h-10 bg-gradient-to-br from-amber-400/90 to-orange-500/90 rounded-lg grid place-items-center shadow-xl shadow-amber-500/30 ring-2 ring-amber-400/20">
                        <span class="text-xl font-bold text-slate-900">DG</span>
                    </div>
                    <h1
                        class="text-3xl font-bold bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 bg-clip-text text-transparent drop-shadow-lg">
                        Daily Games — Admin Seeding
                    </h1>
                </div>
                <p class="text-slate-400 max-w-2xl mx-auto mb-6">
                    Seed next days, custom ranges, and optional overwrites. Answers are hidden by default so you can
                    still play.
                </p>
                <div class="flex items-center justify-center gap-3">
                    <Button variant="secondary" size="sm" @click="copyCurl"
                        class="bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/40 text-cyan-300 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-200 ring-1 ring-cyan-500/20">
                        <Copy class="h-3 w-3 mr-2" /> Copy cURL
                    </Button>
                    <Button variant="secondary" size="sm" @click="openInNewTab"
                        class="bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/40 text-purple-300 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-200 ring-1 ring-purple-500/20">
                        <ExternalLink class="h-3 w-3 mr-2" /> Open
                    </Button>
                </div>
            </div>

            <!-- Config Card -->
            <Card
                class="border-slate-800/50 bg-slate-900/50 backdrop-blur-2xl shadow-2xl shadow-black/30 mb-6 ring-1 ring-slate-700/30">
                <CardContent class="p-6 space-y-6">
                    <!-- Game + API Configuration -->
                    <div class="space-y-4">
                        <div class="grid gap-4 lg:grid-cols-3">
                            <!-- Game Picker -->
                            <div class="space-y-2 lg:col-span-1">
                                <label class="text-sm font-medium text-indigo-400 flex items-center gap-2">
                                    <Gamepad class="h-3 w-3" /> Game
                                </label>
                                <div class="flex gap-2">
                                    <Button :variant="gameType === 'wordle' ? 'default' : 'outline'" size="sm"
                                        @click="setGame('wordle')" class="flex-1">Wordle</Button>
                                    <Button :variant="gameType === 'connections' ? 'default' : 'outline'" size="sm"
                                        @click="setGame('connections')" class="flex-1">Connections</Button>
                                </div>
                                <p class="text-xs text-slate-400">
                                    Endpoint + preview & results adapt to the selected game.
                                </p>
                            </div>

                            <!-- Endpoint / Key -->
                            <div class="space-y-2 lg:col-span-1">
                                <label class="text-sm font-medium text-cyan-400 flex items-center gap-2">
                                    <Globe class="h-3 w-3" /> Endpoint URL
                                </label>
                                <Input v-model="endpoint" type="url" :placeholder="DEFAULTS[gameType]"
                                    class="bg-slate-800/60 border-slate-700/50 text-slate-100 placeholder-slate-500 focus:border-cyan-400/50 focus:ring-cyan-400/20 focus:shadow-lg focus:shadow-cyan-500/10 transition-all duration-200" />
                            </div>
                            <div class="space-y-2 lg:col-span-1">
                                <label class="text-sm font-medium text-purple-400 flex items-center gap-2">
                                    <Key class="h-3 w-3" /> Admin API Key
                                </label>
                                <Input v-model="adminKey" type="password" placeholder="••••••••••••••••"
                                    class="bg-slate-800/60 border-slate-700/50 text-slate-100 placeholder-slate-500 focus:border-purple-400/50 focus:ring-purple-400/20 focus:shadow-lg focus:shadow-purple-500/10 transition-all duration-200" />
                            </div>
                        </div>

                        <!-- Toggles -->
                        <div class="grid gap-3 lg:grid-cols-2">
                            <div
                                class="group relative rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 hover:border-cyan-400/40 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="text-sm font-medium text-slate-200 flex items-center gap-2">
                                            <Shield class="h-3 w-3 text-cyan-400" /> Auth: header
                                        </div>
                                        <div class="text-xs text-slate-400">Sends <code
                                                class="px-1.5 py-0.5 bg-slate-700/50 text-cyan-300 rounded text-xs">x-admin-key</code>
                                            (requires CORS)</div>
                                    </div>
                                    <Switch v-model:checked="useHeader" class="data-[state=checked]:bg-cyan-500/80" />
                                </div>
                            </div>
                            <div
                                class="group relative rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 hover:border-emerald-400/40 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="text-sm font-medium text-slate-200 flex items-center gap-2">
                                            <Save class="h-3 w-3 text-emerald-400" /> Remember prefs
                                        </div>
                                        <div class="text-xs text-slate-400">Store endpoint/key locally</div>
                                    </div>
                                    <Switch v-model:checked="remember" @update:checked="savePrefs"
                                        class="data-[state=checked]:bg-emerald-500/80" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Parameters -->
                    <div
                        class="rounded-2xl border border-slate-700/50 bg-slate-800/30 overflow-hidden shadow-xl shadow-slate-900/20">
                        <div
                            class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 border-b border-slate-700/30">
                            <div class="text-base font-semibold text-slate-200 flex items-center gap-2">
                                <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-lg shadow-indigo-400/60">
                                </div>
                                <Settings class="h-4 w-4 text-indigo-400" /> Parameters
                            </div>
                            <div class="flex items-center gap-2">
                                <Button variant="outline" size="sm" @click="applyPreset('next15')"
                                    class="bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-400/40 text-emerald-300 text-xs px-3 py-1.5 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20">
                                    <Calendar class="h-3 w-3 mr-1" /> Next 15 days
                                </Button>
                                <Button variant="outline" size="sm" @click="applyPreset('clear')"
                                    class="bg-rose-500/15 hover:bg-rose-500/25 border-rose-400/40 text-rose-300 text-xs px-3 py-1.5 shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20">
                                    <X class="h-3 w-3 mr-1" /> Clear
                                </Button>
                            </div>
                        </div>
                        <div class="p-5 space-y-4">
                            <div class="flex items-center justify-between gap-x-4">
                                <div class="space-y-2 w-full">
                                    <label class="text-sm font-medium text-cyan-400 flex items-center gap-2">
                                        <CalendarDays class="h-3 w-3" /> Start (UTC)
                                    </label>
                                    <Input v-model="start" type="date" placeholder="YYYY-MM-DD"
                                        class="bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-cyan-400/50 focus:ring-cyan-400/20 focus:shadow-lg focus:shadow-cyan-500/10" />
                                </div>
                                <div class="space-y-2 w-full">
                                    <label class="text-sm font-medium text-pink-400 flex items-center gap-2">
                                        <CalendarDays class="h-3 w-3" /> End (UTC)
                                    </label>
                                    <Input v-model="end" type="date" placeholder="YYYY-MM-DD"
                                        class="bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-pink-400/50 focus:ring-pink-400/20 focus:shadow-lg focus:shadow-pink-500/10" />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-amber-400 flex items-center gap-2">
                                    <Clock class="h-3 w-3" /> Days ahead
                                </label>
                                <Input v-model.number="days" type="number" min="1" max="365" placeholder="e.g. 15"
                                    class="bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-amber-400/50 focus:ring-amber-400/20 focus:shadow-lg focus:shadow-amber-500/10 w-full" />
                            </div>
                            <div
                                class="rounded-xl border border-slate-700/50 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 shadow-lg shadow-amber-500/5">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="text-sm font-medium text-slate-200 flex items-center gap-2">
                                            <RotateCcw class="h-3 w-3 text-amber-400" /> Overwrite existing
                                        </div>
                                        <div class="text-xs text-amber-300/80">Force replace existing answers for the
                                            range</div>
                                    </div>
                                    <Switch v-model:checked="overwrite" class="data-[state=checked]:bg-amber-500/80" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-wrap items-center gap-3">
                        <Button :disabled="busy" @click="generate"
                            class="bg-gradient-to-r from-emerald-500/80 to-teal-600/80 hover:from-emerald-500 hover:to-teal-600 text-white border-0 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-200 px-6 py-2 ring-2 ring-emerald-400/20">
                            <div v-if="busy" class="flex items-center gap-2">
                                <div class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin">
                                </div>
                                Seeding…
                            </div>
                            <div v-else class="flex items-center gap-2">
                                <Rocket class="h-4 w-4" /> Run Seeding
                            </div>
                        </Button>
                        <Button variant="ghost" size="sm" @click="showPreview = !showPreview"
                            class="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 text-sm px-3 py-1.5 hover:shadow-lg hover:shadow-slate-500/10">
                            <component :is="showPreview ? EyeOff : Eye" class="h-3 w-3 mr-2" />
                            {{ showPreview ? 'Hide' : 'Show' }} preview
                        </Button>
                        <div v-if="errorMsg"
                            class="px-3 py-1.5 bg-gradient-to-r from-rose-500/20 to-red-500/20 border border-rose-400/30 rounded-lg shadow-lg shadow-rose-500/20">
                            <span class="text-sm text-rose-300 flex items-center gap-2">
                                <AlertTriangle class="h-3 w-3" /> {{ errorMsg }}
                            </span>
                        </div>
                    </div>

                    <!-- Request Preview -->
                    <Transition name="fade">
                        <div v-if="showPreview"
                            class="rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-4 shadow-xl shadow-slate-900/20">
                            <h3 class="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                                <div class="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-lg shadow-blue-400/60"></div>
                                <Monitor class="h-4 w-4 text-blue-400" /> Request Preview
                            </h3>
                            <div class="space-y-2 text-sm font-mono">
                                <div class="text-slate-400">
                                    <span class="text-blue-300">Method:</span>
                                    <span class="text-slate-200 bg-slate-800/50 px-2 py-0.5 rounded ml-2">{{
                                        requestMethod }}</span>
                                </div>
                                <div class="text-slate-400 break-all">
                                    <span class="text-purple-300">URL:</span>
                                    <span class="text-slate-200 ml-2">{{ buildUrl(true) }}</span>
                                </div>
                                <div v-if="useHeader" class="text-slate-400">
                                    <span class="text-emerald-300">Header:</span>
                                    <span class="text-slate-200 ml-2">x-admin-key: <span
                                            class="select-all bg-slate-800/50 px-2 py-0.5 rounded">••••••••</span></span>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </CardContent>
            </Card>

            <!-- Results -->
            <Transition name="slidefade">
                <div v-if="normalized">
                    <Card
                        class="border-slate-800/50 bg-slate-900/50 backdrop-blur-2xl shadow-2xl shadow-black/30 ring-1 ring-slate-700/30">
                        <CardContent class="p-6">
                            <div class="flex items-center justify-between mb-6">
                                <h2 class="text-xl font-bold text-slate-200 flex items-center gap-3">
                                    <div
                                        class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/60">
                                    </div>
                                    <PartyPopper class="h-5 w-5 text-amber-400" /> Results — {{ gameTypeLabel }}
                                </h2>
                                <div class="flex gap-2">
                                    <Button v-if="normalized.entries.length" variant="outline" size="sm"
                                        @click="toggleRevealAll"
                                        class="bg-violet-500/15 hover:bg-violet-500/25 border-violet-400/40 text-violet-300 text-sm px-3 py-1.5 shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20">
                                        <component :is="revealAll ? EyeOff : Eye" class="h-3 w-3 mr-2" />
                                        {{ revealAll ? 'Hide all' : 'Reveal all' }}
                                    </Button>
                                </div>
                            </div>

                            <!-- Summary -->
                            <div class="grid gap-3 lg:grid-cols-3 mb-6">
                                <div
                                    class="bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-xl p-4 border border-blue-400/30 shadow-lg shadow-blue-500/10">
                                    <div class="text-blue-300 text-sm font-medium flex items-center gap-2">
                                        <Calendar class="h-3 w-3" /> Range
                                    </div>
                                    <div class="text-slate-100 font-mono text-base mt-1">
                                        {{ normalized.range ? `${normalized.range.start} → ${normalized.range.end}` :
                                        '—' }}
                                    </div>
                                </div>
                                <div
                                    class="bg-gradient-to-br from-emerald-500/15 to-teal-500/15 rounded-xl p-4 border border-emerald-400/30 shadow-lg shadow-emerald-500/10">
                                    <div class="text-emerald-300 text-sm font-medium flex items-center gap-2">
                                        <Hash class="h-3 w-3" /> Count
                                    </div>
                                    <div class="text-slate-100 font-mono text-base mt-1">{{ normalized.count }}</div>
                                </div>
                                <div
                                    class="bg-gradient-to-br from-amber-500/15 to-orange-500/15 rounded-xl p-4 border border-amber-400/30 shadow-lg shadow-amber-500/10">
                                    <div class="text-amber-300 text-sm font-medium flex items-center gap-2">
                                        <RotateCcw class="h-3 w-3" /> Overwrite
                                    </div>
                                    <div class="text-slate-100 font-mono text-base mt-1 flex items-center gap-2">
                                        <component :is="normalized.overwrite ? Check : X" class="h-3 w-3" /> {{
                                        normalized.overwrite ? 'true' : 'false' }}
                                    </div>
                                </div>
                            </div>

                            <!-- Entries -->
                            <div v-if="normalized.entries.length" class="space-y-4">
                                <!-- Wordle layout -->
                                <template v-if="gameType === 'wordle'">
                                    <h3 class="text-base font-semibold text-slate-200 flex items-center gap-2">
                                        <div
                                            class="w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/60">
                                        </div>
                                        <Type class="h-4 w-4 text-yellow-400" /> Generated Words
                                    </h3>
                                    <div class="grid gap-3 lg:grid-cols-2">
                                        <div v-for="(e, i) in normalized.entries" :key="e.date"
                                            class="group rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 hover:border-indigo-400/40 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200">
                                            <div class="flex items-center justify-between mb-3">
                                                <div class="text-sm">
                                                    <span class="text-indigo-300 font-medium flex items-center gap-2">
                                                        <Calendar class="h-3 w-3" /> Date:
                                                    </span>
                                                    <span
                                                        class="text-slate-200 ml-2 bg-slate-700/50 px-2 py-1 rounded text-xs font-mono">{{
                                                        e.date }}</span>
                                                </div>
                                                <Button variant="ghost" size="sm" @click="toggleReveal(i)"
                                                    class="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 text-xs px-2 py-1">
                                                    <component :is="revealed[i] || revealAll ? EyeOff : Eye"
                                                        class="h-3 w-3 mr-1" />
                                                    {{ revealed[i] || revealAll ? 'Hide' : 'Show' }}
                                                </Button>
                                            </div>
                                            <div class="text-sm">
                                                <span class="text-yellow-300 font-medium flex items-center gap-2">
                                                    <Type class="h-3 w-3" /> Word:
                                                </span>
                                                <div
                                                    class="mt-2 p-3 bg-slate-900/60 rounded-lg border border-slate-700/40 shadow-inner">
                                                    <span class="font-mono text-xl tracking-widest text-slate-100">
                                                        {{ (revealed[i] || revealAll) ? (e.word || '—') :
                                                        maskWord(e.word) }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>

                                <!-- Connections layout -->
                                <template v-else>
                                    <h3 class="text-base font-semibold text-slate-200 flex items-center gap-2">
                                        <div
                                            class="w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/60">
                                        </div>
                                        <Gamepad class="h-4 w-4 text-yellow-400" /> Generated Groups
                                    </h3>
                                    <div class="space-y-3">
                                        <div v-for="(e, i) in normalized.entries" :key="e.date"
                                            class="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
                                            <div class="flex items-center justify-between mb-3">
                                                <div class="text-sm">
                                                    <span class="text-indigo-300 font-medium flex items-center gap-2">
                                                        <Calendar class="h-3 w-3" /> Date:
                                                    </span>
                                                    <span
                                                        class="text-slate-200 ml-2 bg-slate-700/50 px-2 py-1 rounded text-xs font-mono">{{
                                                        e.date }}</span>
                                                </div>
                                                <Button variant="ghost" size="sm" @click="toggleReveal(i)"
                                                    class="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 text-xs px-2 py-1">
                                                    <component :is="revealed[i] || revealAll ? EyeOff : Eye"
                                                        class="h-3 w-3 mr-1" />
                                                    {{ revealed[i] || revealAll ? 'Hide' : 'Show' }}
                                                </Button>
                                            </div>

                                            <div class="grid gap-3 sm:grid-cols-2">
                                                <div v-for="group in e.groups" :key="e.date + group.level"
                                                    class="rounded-lg border border-slate-700/40 bg-slate-900/50 p-3">
                                                    <div class="text-xs uppercase tracking-wide font-bold mb-1"
                                                        :class="difficultyClass(group.level)">
                                                        {{ group.level }} — {{ group.category || 'Untitled' }}
                                                    </div>
                                                    <div class="font-mono">
                                                        <span v-for="(w, wi) in group.words" :key="w"
                                                            class="inline-block mr-2 mb-1 px-2 py-1 rounded border border-slate-700/40 bg-slate-800/60">
                                                            {{ (revealed[i] || revealAll) ? w : maskConnectionsWord(w)
                                                            }}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>

                            <!-- Raw -->
                            <details class="mt-6 group">
                                <summary
                                    class="cursor-pointer text-sm text-slate-400 hover:text-slate-300 transition-colors duration-200 flex items-center gap-2">
                                    <div
                                        class="w-1.5 h-1.5 bg-slate-400 rounded-full group-open:bg-blue-400 transition-colors duration-200">
                                    </div>
                                    <FileText class="h-4 w-4 group-open:text-blue-400 transition-colors duration-200" />
                                    Raw response data
                                </summary>
                                <div
                                    class="mt-3 rounded-xl bg-slate-900/80 border border-slate-700/50 overflow-hidden shadow-xl shadow-slate-900/20">
                                    <pre
                                        class="p-4 text-sm text-slate-300 overflow-x-auto font-mono">{{ rawJson }}</pre>
                                </div>
                            </details>
                        </CardContent>
                    </Card>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
    Eye, EyeOff, ExternalLink, Copy, Globe, Key, Shield, Save, Settings, Calendar, CalendarDays, Clock,
    RotateCcw, Rocket, AlertTriangle, Monitor, PartyPopper, Hash, Check, X, Type, FileText, Gamepad
} from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

// ──────────────────────────────────────────────────────────────────────────────
// Defaults
// ──────────────────────────────────────────────────────────────────────────────
const DEFAULTS = {
    wordle: 'https://australia-southeast2-mxn-au.cloudfunctions.net/wordleGenerateNow',
    connections: 'https://australia-southeast2-mxn-au.cloudfunctions.net/connectionsGenerateNow',
}

// Game Type
const gameType = ref(localStorage.getItem('seed:gameType') || 'wordle')
const gameTypeLabel = computed(() => (gameType.value === 'wordle' ? 'Wordle' : 'Connections'))

function setGame(t) {
    if (t === gameType.value) return
    const prevDefault = DEFAULTS[gameType.value]
    const userHasntCustomized = !endpoint.value || endpoint.value === prevDefault
    gameType.value = t
    localStorage.setItem('seed:gameType', t)
    if (userHasntCustomized) endpoint.value = DEFAULTS[t]
}

// Form state
const endpoint = ref(localStorage.getItem('seed:endpoint') || DEFAULTS[gameType.value])
const adminKey = ref(localStorage.getItem('seed:key') || '')
const useHeader = ref(localStorage.getItem('seed:useHeader') === '1')
const remember = ref(localStorage.getItem('seed:remember') === '1')

// Params
const start = ref('')
const end = ref('')
const days = ref(null)
const overwrite = ref(false)

// Runtime
const busy = ref(false)
const errorMsg = ref('')
const showPreview = ref(false)
const rawJson = ref('')

// Reveal state (per entry)
const revealed = ref([])
const revealAll = ref(false)

// Normalized result for UI
const normalized = ref(null)

const requestMethod = computed(() => (useHeader.value ? 'POST' : 'GET'))

function savePrefs() {
    if (!remember.value) {
        localStorage.removeItem('seed:endpoint')
        localStorage.removeItem('seed:key')
        localStorage.removeItem('seed:useHeader')
        localStorage.removeItem('seed:remember')
        localStorage.removeItem('seed:gameType')
        return
    }
    localStorage.setItem('seed:endpoint', endpoint.value)
    localStorage.setItem('seed:key', adminKey.value)
    localStorage.setItem('seed:useHeader', useHeader.value ? '1' : '0')
    localStorage.setItem('seed:remember', '1')
    localStorage.setItem('seed:gameType', gameType.value)
}

onMounted(() => { if (remember.value) savePrefs() })

watch(gameType, () => {
    // Reset reveal & normalized on type change for clarity
    revealed.value = []
    revealAll.value = false
    normalized.value = null
})

function applyPreset(type) {
    if (type === 'next15') {
        const now = new Date()
        const iso = (d) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
        start.value = iso(now)
        end.value = ''
        days.value = 15
        overwrite.value = false
    }
    if (type === 'clear') {
        start.value = ''
        end.value = ''
        days.value = null
        overwrite.value = false
    }
}

function validISO(d) { return /^\d{4}-\d{2}-\d{2}$/.test(d) }

function buildParams(preview = false) {
    const params = new URLSearchParams()
    if (!useHeader.value && adminKey.value && !preview) params.set('key', adminKey.value)
    if (start.value && validISO(start.value)) params.set('start', start.value)
    if (end.value && validISO(end.value)) params.set('end', end.value)
    if (days.value && Number(days.value) > 0) params.set('days', String(Number(days.value)))
    if (overwrite.value) params.set('overwrite', 'true')
    return params
}

function buildUrl(preview = false) {
    const params = buildParams(preview)
    const qs = params.toString()
    return qs ? `${endpoint.value}?${qs}` : endpoint.value
}

async function generate() {
    errorMsg.value = ''
    rawJson.value = ''
    normalized.value = null

    if (!endpoint.value) { errorMsg.value = 'Endpoint is required.'; return }
    if (!adminKey.value) { errorMsg.value = 'Admin key is required.'; return }
    if (start.value && !validISO(start.value)) { errorMsg.value = 'Start must be YYYY-MM-DD'; return }
    if (end.value && !validISO(end.value)) { errorMsg.value = 'End must be YYYY-MM-DD'; return }

    savePrefs()
    busy.value = true
    try {
        const url = buildUrl(false)
        const res = await fetch(url, {
            method: requestMethod.value,
            headers: useHeader.value ? { 'x-admin-key': adminKey.value } : undefined,
        })

        const text = await res.text()
        rawJson.value = text

        if (!res.ok) {
            errorMsg.value = `HTTP ${res.status}: ${text?.slice(0, 300) || 'request failed'}`
            toast({ title: 'Seeding failed', description: `HTTP ${res.status}`, variant: 'destructive' })
            return
        }

        let json
        try { json = JSON.parse(text) } catch { json = { ok: true, raw: text } }

        // Normalize per-game
        normalized.value = normalizeResponse(gameType.value, json)
        revealed.value = new Array(normalized.value.entries.length).fill(false)
        revealAll.value = false

        toast({ title: 'Success!', description: 'Seeding completed successfully' })
    } catch (e) {
        errorMsg.value = e?.message || String(e)
        toast({ title: 'Request error', description: e?.message || 'An error occurred', variant: 'destructive' })
    } finally {
        busy.value = false
    }
}

function openInNewTab() { window.open(buildUrl(true), '_blank', 'noopener,noreferrer') }

function copyCurl() {
    const urlNoKey = buildUrl(true)
    const withKeyParams = buildParams(false)
    const cmd = useHeader.value
        ? `curl -X POST "${urlNoKey}" -H "x-admin-key: ${adminKey.value}"`
        : `curl -G "${endpoint.value}"${withKeyParams.get('key') ? ` --data-urlencode "key=${adminKey.value}"` : ''}${withKeyParams.get('start') ? ` --data-urlencode "start=${withKeyParams.get('start')}"` : ''}${withKeyParams.get('end') ? ` --data-urlencode "end=${withKeyParams.get('end')}"` : ''}${withKeyParams.get('days') ? ` --data-urlencode "days=${withKeyParams.get('days')}"` : ''}${withKeyParams.get('overwrite') ? ' --data-urlencode "overwrite=true"' : ''}`

    navigator.clipboard.writeText(cmd).then(() => {
        toast({ title: 'Copied!', description: 'cURL command copied to clipboard' })
    }).catch(() => {
        toast({ title: 'Copy failed', description: 'Could not copy to clipboard', variant: 'destructive' })
    })
}

function toggleReveal(i) { revealed.value[i] = !revealed.value[i] }
function toggleRevealAll() { revealAll.value = !revealAll.value }

// ──────────────────────────────────────────────────────────────────────────────
// Normalizers & helpers
// ──────────────────────────────────────────────────────────────────────────────
function enumerateDates(startId, endId, cap) {
    if (!startId || !endId) return []
    const out = []
    const start = new Date(startId + 'T00:00:00Z')
    const end = new Date(endId + 'T00:00:00Z')
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
        out.push(d.toISOString().slice(0, 10))
        if (cap && out.length >= cap) break
    }
    return out
}

function normalizeResponse(type, json) {
    // Common envelope
    const range = json?.range || null
    const overwrite = !!json?.overwrite

    if (type === 'wordle') {
        // API: { ok, range:{start,end}, count, words:[...] }
        const words = Array.isArray(json?.words) ? json.words : []
        const dates = range ? enumerateDates(range.start, range.end, words.length) : []
        const entries = dates.map((d, i) => ({ date: d, word: words[i] }))
        return { game: 'wordle', range, count: words.length, overwrite, entries }
    }

    // connections
    // API: { ok, range:{start,end}, count, puzzles:[ {answer:{easy,medium,hard,expert}, categories:{...}} ] }
    const puzzles = Array.isArray(json?.puzzles) ? json.puzzles : []
    const dates = range ? enumerateDates(range.start, range.end, puzzles.length) : []
    const entries = dates.map((d, i) => {
        const p = puzzles[i] || { answer: {}, categories: {} }
        const lvls = ['easy', 'medium', 'hard', 'expert']
        const groups = lvls.map((lvl) => ({
            level: lvl.toUpperCase(),
            category: p.categories?.[lvl] || '',
            words: Array.isArray(p.answer?.[lvl]) ? p.answer[lvl] : [],
        }))
        return { date: d, groups }
    })
    return { game: 'connections', range, count: puzzles.length, overwrite, entries }
}

function maskWord(w) {
    if (!w) return '•••••'
    return (w[0] || '•') + '•'.repeat(Math.max(0, (w.length || 5) - 1))
}
function maskConnectionsWord(w) {
    if (!w) return '•••'
    return '•'.repeat(Math.max(3, Math.min(10, w.length)))
}

function difficultyClass(level) {
    const l = String(level).toLowerCase()
    if (l.includes('easy')) return 'text-emerald-300'
    if (l.includes('medium')) return 'text-blue-300'
    if (l.includes('hard')) return 'text-amber-300'
    if (l.includes('expert')) return 'text-rose-300'
    return 'text-slate-300'
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.slidefade-enter-active,
.slidefade-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slidefade-enter-from,
.slidefade-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
}

code {
    @apply px-1.5 py-0.5 bg-slate-700/50 text-cyan-300 rounded text-xs font-mono;
}

pre::-webkit-scrollbar {
    height: 6px;
}

pre::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.3);
    border-radius: 3px;
}

pre::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.4);
    border-radius: 3px;
}

pre::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 116, 139, 0.6);
}
</style>