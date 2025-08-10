// src/components/translate/HistoryPanel.vue
<template>
    <!-- Fill the space given by parent (which is already locked via flex-1 + max-h) -->
    <div class="flex flex-col h-full space-y-3">
        <!-- Header -->
        <div class="flex items-center justify-between px-1">
            <h3 class="text-sm font-medium text-white/80 uppercase tracking-wide">History</h3>
            <button v-if="(store.history?.length || 0) > 0" @click="openExplorer"
                class="text-white/60 hover:text-white p-1 rounded-md hover:bg-white/10">
                <Maximize class="w-4 h-4" />
            </button>
        </div>

        <!-- History container (fills vertical space, internal scroll) -->
        <div class="flex-1 backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl overflow-hidden">
            <div class="h-full overflow-y-auto p-2 space-y-2 custom-scrollbar">
                <!-- Empty state -->
                <div v-if="!store.history.length"
                    class="flex flex-col items-center justify-center h-full space-y-2 text-white/40 text-sm">
                    <svg class="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>No recent translations.</span>
                </div>

                <!-- History Items -->
                <div v-for="item in store.history" :key="item.id"
                    class="group relative bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-300 rounded-xl p-4 animate-fade-in cursor-pointer"
                    @click="restore(item)">
                    <!-- Delete button -->
                    <button @click.stop="deleteHistoryItem(item.id)" aria-label="Delete history item"
                        class="absolute -top-1 -right-1 z-10 p-1 rounded-full bg-black/20 text-white/50 hover:text-red-500 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <X class="w-4 h-4" />
                    </button>

                    <!-- Header: lang info + time -->
                    <div class="flex justify-between items-center mb-3">
                        <div class="flex items-center space-x-2 text-xs text-white/70">
                            <div class="flex items-center space-x-1">
                                <i :class="flagClass(getLangName(item.sourceLang))" class="w-4 h-4 rounded-sm"></i>
                                <span>{{ getLangName(item.sourceLang) }}</span>
                            </div>
                            <ChevronRight class="w-4 h-4 text-white/40" />
                            <div class="flex items-center space-x-1">
                                <i :class="flagClass(getLangName(item.targetLang))" class="w-4 h-4 rounded-sm"></i>
                                <span>{{ getLangName(item.targetLang) }}</span>
                            </div>
                        </div>
                        <span class="text-white/50 text-xs">{{ timeAgo(getTs(item)) }}</span>
                    </div>

                    <!-- Original and Translated Text -->
                    <div class="space-y-3">
                        <!-- Original -->
                        <div class="relative group/text">
                            <div class="flex items-start space-x-3">
                                <div class="flex-shrink-0 mt-1">
                                    <i :class="flagClass(getLangName(item.sourceLang))"
                                        class="w-5 h-4 rounded shadow-sm"></i>
                                </div>
                                <div class="flex-1 relative">
                                    <p class="text-white/80 text-sm bg-black/20 p-3 rounded-lg pr-10 min-h-[2.5rem]">{{
                                        item.inputText }}</p>
                                    <button @click.stop="copy(item.inputText)" aria-label="Copy original text"
                                        class="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-white/40 hover:text-white opacity-0 group-hover/text:opacity-100 transition-all duration-200">
                                        <Copy class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Translated -->
                        <div class="relative group/text">
                            <div class="flex items-start space-x-3">
                                <div class="flex-shrink-0 mt-1">
                                    <i :class="flagClass(getLangName(item.targetLang))"
                                        class="w-5 h-4 rounded shadow-sm"></i>
                                </div>
                                <div class="flex-1 relative">
                                    <p
                                        class="text-white text-sm bg-black/30 p-3 rounded-lg pr-10 min-h-[2.5rem] font-medium">
                                        {{ item.translated }}</p>
                                    <button @click.stop="copy(item.translated)" aria-label="Copy translated text"
                                        class="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-white/40 hover:text-white opacity-0 group-hover/text:opacity-100 transition-all duration-200">
                                        <Copy class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Fullscreen explorer -->
        <div v-if="showExplorer"
            class="fixed inset-0 z-[60] bg-gradient-to-br from-slate-950/90 via-slate-900/90 to-slate-950/90 backdrop-blur-sm">
            <div
                class="absolute inset-4 md:inset-10 bg-slate-900/95 border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
                <!-- Toolbar -->
                <div class="p-4 border-b border-white/10 flex items-center gap-3">
                    <h3 class="text-white font-semibold text-lg">History Explorer</h3>
                    <div class="ml-auto flex items-center gap-2">
                        <!-- Login hint -->
                        <div v-if="!isLoggedIn"
                            class="text-xs text-amber-300/90 bg-amber-500/10 px-2 py-1 rounded-full">Login to sync your
                            history across devices</div>
                        <button class="text-white/70 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg"
                            @click="showExplorer = false">Close</button>
                    </div>
                </div>
                <!-- Filters -->
                <div class="p-4 flex flex-wrap gap-3 items-center border-b border-white/10">
                    <input v-model.trim="search" placeholder="Search translations..."
                        class="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64" />

                    <Select v-model="langFilter">
                        <SelectTrigger class="h-9 w-56 bg-white/5 border border-white/10 text-white text-xs">
                            <SelectValue placeholder="Filter by language" />
                        </SelectTrigger>
                        <SelectContent class="bg-slate-900/95 text-white border-white/10 max-h-64">
                            <SelectItem v-for="l in [{ code: 'all', name: 'All languages' }, ...store.languages]"
                                :key="l.code" :value="l.code">{{ l.name }}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <!-- List -->
                <div class="flex-1 overflow-auto p-4 space-y-2 custom-scrollbar">
                    <div v-for="item in paged" :key="item.id"
                        class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 cursor-pointer"
                        @click="restore(item); showExplorer = false">
                        <div class="text-xs text-white/60 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <i :class="flagClass(getLangName(item.sourceLang))" class="w-4 h-3 rounded-sm"></i>
                                <ChevronRight class="w-3 h-3" />
                                <i :class="flagClass(getLangName(item.targetLang))" class="w-4 h-3 rounded-sm"></i>
                            </div>
                            <span>{{ timeAgo(getTs(item)) }}</span>
                        </div>
                        <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div class="text-white/80 text-sm bg-black/20 p-2 rounded-lg">{{ item.inputText }}</div>
                            <div class="text-white font-medium text-sm bg-black/30 p-2 rounded-lg">{{ item.translated }}
                            </div>
                        </div>
                    </div>
                    <div v-if="filtered.length === 0" class="text-white/60 text-sm">No results.</div>
                </div>
                <!-- Pager -->
                <div class="p-4 border-t border-white/10 flex items-center justify-between">
                    <div class="text-xs text-white/60">Showing {{ Math.min(filtered.length, page * pageSize) }} of {{
                        filtered.length }}</div>
                    <div class="flex items-center gap-2">
                        <button
                            class="px-3 py-1.5 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 disabled:opacity-40"
                            :disabled="page === 1" @click="page--">Prev</button>
                        <button
                            class="px-3 py-1.5 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 disabled:opacity-40"
                            :disabled="page * pageSize >= filtered.length" @click="page++">Load more</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useTranslateStore } from '@/stores/useTranslateStore'
import { useMainStore } from '@/stores/useMainStore'
import { ChevronRight, X, Copy, Maximize } from 'lucide-vue-next'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const store = useTranslateStore()
const main = useMainStore()
const isLoggedIn = computed(() => !!main.user)

// live time re-compute for "x minutes ago"
const nowTick = ref(Date.now())
let interval
onMounted(() => { interval = setInterval(() => (nowTick.value = Date.now()), 60_000) })
onUnmounted(() => { if (interval) clearInterval(interval) })
const timeAgo = (ts) => { // depend on nowTick for reactivity
    void nowTick.value
    return store.formatTimeAgo(ts)
}

const getTs = (item) => item?.lastUsed || item?.lastTranslated || item?.firstTranslated || item?.timestamp

const flagClass = store.flagClass
const getLangName = (code) => store.languages.find((l) => l.code === code)?.name || code

const copy = (t) => store.copyToClipboard?.(t)
const deleteHistoryItem = (id) => store.deleteHistoryItem?.(id, null)

const openExplorer = () => { showExplorer.value = true }

const restore = (item) => {
    // Restore visible fields
    store.fromLanguage = item.sourceLang
    store.selectedLanguage = item.targetLang
    store.leftText = item.inputText || ''
    store.rightText = item.translated || ''

    // Populate round-trip directly from Firestore (no recompute)
    store.lastOriginalText = item.inputText || ''
    store.lastTranslationDirection = 'left'
    store.retranslatedText = item.retranslated || ''
    store.accuracy = typeof item.accuracy === 'number' ? item.accuracy : null
    store.accuracyRating = item.accuracyRating || null
}

// Explorer state
const showExplorer = ref(false)
const search = ref('')
const langFilter = ref('all')
const page = ref(1)
const pageSize = 20

const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()
    const lf = langFilter.value
    return (store.history || []).filter((it) => {
        const langOk = lf === 'all' || it.sourceLang === lf || it.targetLang === lf
        if (!q) return langOk
        return (
            langOk &&
            (it.inputText?.toLowerCase().includes(q) || it.translated?.toLowerCase().includes(q))
        )
    })
})

const paged = computed(() => filtered.value.slice(0, page.value * pageSize))
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn .3s ease both;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(4px);
    }

    to {
        opacity: 1;
        transform: none;
    }
}
</style>
