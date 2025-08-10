<!-- src/components/translate/UsagePanel.vue (collapsed cards when closed) -->
<template>
    <div class="flex flex-col space-y-2">
        <div class="flex items-center justify-between">
            <h3 class="text-xs font-medium text-white/80 uppercase tracking-wide">Usage</h3>
            <button class="text-white/60 hover:text-white p-1 rounded-md hover:bg-white/10"
                @click="$emit('expand-usage')" aria-label="Expand usage analytics">
                <Maximize class="w-4 h-4" />
            </button>
        </div>

        <!-- Translations Stat Panel -->
        <div class="relative group" @click="toggle('translations')">
            <div
                class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            <div :class="[
                'relative backdrop-blur bg-white/10 border border-white/20 rounded-2xl shadow-xl transition-all duration-300 hover:bg-white/15 cursor-pointer overflow-hidden',
                open.translations ? 'p-3 max-h-80' : 'p-2 max-h-16'
            ]">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="relative">
                            <div class="absolute inset-0 bg-cyan-400 rounded-2xl blur opacity-30" />
                            <div class="relative bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl"
                                :class="open.translations ? 'p-3' : 'p-2'">
                                <MessageSquare
                                    :class="open.translations ? 'w-6 h-6 text-white' : 'w-5 h-5 text-white'" />
                            </div>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-cyan-300 uppercase tracking-wide">Translations</p>
                            <p
                                :class="open.translations ? 'text-2xl font-bold text-white' : 'text-lg font-bold text-white'">
                                {{ locale(store.appStats?.totalTranslations) }}
                            </p>
                        </div>
                    </div>
                    <ChevronDown v-if="!open.translations" class="w-5 h-5 text-white/70" />
                    <ChevronUp v-else class="w-5 h-5 text-white/70" />
                </div>

                <transition name="fade">
                    <div v-if="open.translations" class="mt-3 text-xs text-white/80">
                        <div class="flex items-center justify-between">
                            <span>Active today</span>
                            <span class="font-medium">{{ locale(store.activeToday) }}</span>
                        </div>
                        <div v-if="store.topLanguages?.length" class="mt-2 space-y-1">
                            <div class="text-white/60">Top languages</div>
                            <div class="grid grid-cols-2 gap-2">
                                <div v-for="lang in store.topLanguages" :key="lang.code"
                                    class="flex items-center justify-between bg-white/5 rounded-lg p-2">
                                    <div class="flex items-center gap-2">
                                        <i :class="lang.flag" class="w-4 h-3 rounded-sm" />
                                        <span>{{ lang.name }}</span>
                                    </div>
                                    <span class="text-white/70">{{ locale(lang.count) }} ({{ lang.percentage }}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>

        <!-- Words Stat Panel -->
        <div class="relative group" @click="toggle('words')">
            <div
                class="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            <div :class="[
                'relative backdrop-blur bg-white/10 border border-white/20 rounded-2xl shadow-xl transition-all duration-300 hover:bg-white/15 cursor-pointer overflow-hidden',
                open.words ? 'p-3 max-h-64' : 'p-2 max-h-16'
            ]">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="relative">
                            <div class="absolute inset-0 bg-emerald-400 rounded-2xl blur opacity-30" />
                            <div class="relative bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl"
                                :class="open.words ? 'p-3' : 'p-2'">
                                <FileText :class="open.words ? 'w-6 h-6 text-white' : 'w-5 h-5 text-white'" />
                            </div>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-emerald-300 uppercase tracking-wide">Words</p>
                            <p :class="open.words ? 'text-2xl font-bold text-white' : 'text-lg font-bold text-white'">
                                {{ locale(store.appStats?.totalWords) }}
                            </p>
                        </div>
                    </div>
                    <ChevronDown v-if="!open.words" class="w-5 h-5 text-white/70" />
                    <ChevronUp v-else class="w-5 h-5 text-white/70" />
                </div>

                <transition name="fade">
                    <div v-if="open.words" class="mt-3 text-xs text-white/80 space-y-2">
                        <div class="flex items-center justify-between">
                            <span>Avg word/translation</span>
                            <span class="font-medium">{{ locale(avgWords) }}</span>
                        </div>
                    </div>
                </transition>
            </div>
        </div>

        <!-- API Cost Stat Panel -->
        <div class="relative group" @click="toggle('cost')">
            <div
                class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            <div :class="[
                'relative backdrop-blur bg-white/10 border border-white/20 rounded-2xl shadow-xl transition-all duration-300 hover:bg-white/15 cursor-pointer overflow-hidden',
                open.cost ? 'p-3 max-h-64' : 'p-2 max-h-16'
            ]">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="relative">
                            <div class="absolute inset-0 bg-purple-400 rounded-2xl blur opacity-30" />
                            <div class="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl"
                                :class="open.cost ? 'p-3' : 'p-2'">
                                <Coins :class="open.cost ? 'w-6 h-6 text-white' : 'w-5 h-5 text-white'" />
                            </div>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-purple-300 uppercase tracking-wide">API Cost</p>
                            <p :class="open.cost ? 'text-2xl font-bold text-white' : 'text-lg font-bold text-white'">
                                {{ store.formattedApiCost }}
                            </p>
                        </div>
                    </div>
                    <ChevronDown v-if="!open.cost" class="w-5 h-5 text-white/70" />
                    <ChevronUp v-else class="w-5 h-5 text-white/70" />
                </div>

                <transition name="fade">
                    <div v-if="open.cost" class="mt-3 text-xs text-white/80 space-y-2">
                        <div class="flex items-center justify-between">
                            <span>Prompt tokens</span>
                            <span class="font-mono">{{ locale(store.appStats?.tokenUsage?.prompt) }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span>Completion tokens</span>
                            <span class="font-mono">{{ locale(store.appStats?.tokenUsage?.completion) }}</span>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useTranslateStore } from '@/stores/useTranslateStore'
import { MessageSquare, FileText, Coins, Maximize, ChevronDown, ChevronUp } from 'lucide-vue-next'

const store = useTranslateStore()
const open = reactive({ translations: false, words: false, cost: false })

const toggle = (k) => (open[k] = !open[k])
const avgWords = computed(() => {
    const total = store.appStats?.totalTranslations || 0
    const words = store.appStats?.totalWords || 0
    if (!total) return 0
    return Math.round(words / total)
})
const locale = (n) => (typeof n === 'number' ? n.toLocaleString() : (n || 0).toLocaleString?.() || '0')
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>