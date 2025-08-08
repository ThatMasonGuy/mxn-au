<template>
    <!-- Main Translation Panel Wrapper -->
    <div class="lg:col-span-2 flex flex-col z-20">
        <div
            class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-visible flex-grow flex flex-col">
            <!-- Header with Logo and Settings -->
            <div class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white p-4 rounded-t-3xl">
                <div class="flex items-center justify-between">
                    <!-- Logo and Title -->
                    <div class="flex items-center space-x-3">
                        <router-link to="/"
                            class="p-2 bg-white/20 rounded-xl backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-all duration-300">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129">
                                </path>
                            </svg>
                        </router-link>
                        <div class="text-left">
                            <h1
                                class="text-2xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                                AI Translator
                            </h1>
                            <p class="text-purple-100 text-xs opacity-90">
                                Built by Mason, Powered by OpenAI
                            </p>
                        </div>
                    </div>
                    <!-- Settings Popover -->
                    <SettingsPopover />
                </div>
            </div>

            <!-- Translation Interface -->
            <div class="pt-4 px-4 sm:p-6 flex-grow flex flex-col border-t border-white/10">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-grow">

                    <!-- Left Side (Source Language) -->
                    <div class="space-y-2 flex flex-col min-h-[300px] lg:min-h-0">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-3">
                                <div class="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                                <h4 class="font-bold text-white">{{ store.leftLanguageName }}</h4>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-full">{{
                                    store.leftText.length
                                }}
                                    chars</span>
                                <select v-model="store.fromLanguage"
                                    class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-xs">
                                    <option v-for="lang in store.languages" :key="lang.code" :value="lang.code"
                                        class="bg-slate-800 text-white">{{ lang.name }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="relative group flex-grow">
                            <textarea v-model="store.leftText" @keydown.enter.exact.prevent="translate('left')"
                                placeholder="Type here..."
                                class="w-full h-full p-4 pb-16 bg-white/5 border border-white/10 rounded-2xl resize-none text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:bg-white/10"></textarea>

                            <button v-if="store.leftText" @click="store.leftText = ''"
                                class="absolute bottom-3 left-3 z-10 text-white/40 hover:text-red-500 hover:bg-white/10 p-1.5 rounded-full transition-all duration-300"
                                aria-label="Clear text">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <button @click="translate('left')" :disabled="!store.canTranslateLeft"
                                class="absolute bottom-3 right-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm">
                                <span>Translate</span>
                                <template v-if="store.isTranslating">
                                    <svg class="animate-spin w-4 h-4" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                                        </path>
                                    </svg>
                                </template>
                                <template v-else>
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </template>
                            </button>
                        </div>

                        <div class="flex justify-end h-8 items-center">
                            <button @click="copyToClipboard(store.leftText)" :disabled="!store.leftText"
                                :class="['text-xs transition-colors duration-200 flex items-center space-x-1 px-2 py-1 rounded-lg', store.leftText ? 'text-blue-400 hover:text-blue-300 hover:bg-white/5' : 'text-white/30 cursor-not-allowed']">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">
                                    </path>
                                </svg>
                                <span>Copy</span>
                            </button>
                        </div>
                    </div>

                    <!-- Right Side (Target Language) -->
                    <div class="space-y-2 flex flex-col min-h-[300px] lg:min-h-0">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-3">
                                <div class="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                                </div>
                                <h4 class="font-bold text-white">{{ store.rightLanguageName }}</h4>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-full">{{
                                    store.rightText.length
                                }}
                                    chars</span>
                                <select v-model="store.selectedLanguage"
                                    class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-xs">
                                    <option v-for="lang in store.languages" :key="lang.code" :value="lang.code"
                                        class="bg-slate-800 text-white">{{
                                            lang.name }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="relative group flex-grow">
                            <textarea v-model="store.rightText" @keydown.enter.exact.prevent="translate('right')"
                                placeholder="Translation appears here..."
                                class="w-full h-full p-4 pb-16 bg-white/5 border border-white/10 rounded-2xl resize-none text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:bg-white/10"></textarea>

                            <button v-if="store.rightText" @click="store.rightText = ''"
                                class="absolute bottom-3 left-3 z-10 text-white/40 hover:text-red-500 hover:bg-white/10 p-1.5 rounded-full transition-all duration-300"
                                aria-label="Clear text">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <button @click="translate('right')" :disabled="!store.canTranslateRight"
                                class="absolute bottom-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm">
                                <template v-if="store.isTranslating">
                                    <svg class="animate-spin w-4 h-4" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                                        </path>
                                    </svg>
                                </template>
                                <template v-else>
                                    <svg class="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </template>
                                <span>Translate</span>
                            </button>
                        </div>

                        <div class="flex justify-end h-8 items-center">
                            <button @click="copyToClipboard(store.rightText)" :disabled="!store.rightText"
                                :class="['text-xs transition-colors duration-200 flex items-center space-x-1 px-2 py-1 rounded-lg', store.rightText ? 'text-purple-400 hover:text-purple-300 hover:bg-white/5' : 'text-white/30 cursor-not-allowed']">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">
                                    </path>
                                </svg>
                                <span>Copy</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Retranslation Section -->
                <div v-if="store.retranslatedText" :class="[
                    'mt-4 mb-4 md:mb-0 p-3 sm:p-4 rounded-2xl backdrop-blur-sm animate-fade-in',
                    store.accuracy > 80 ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20' :
                        store.accuracy > 60 ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20' :
                            store.accuracy > 40 ? 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20' :
                                'bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20'
                ]">
                    <div class="mb-3">
                        <div class="flex items-center space-x-2 sm:space-x-3 mb-2">
                            <div
                                :class="['p-2 rounded-lg flex-shrink-0', store.accuracy > 80 ? 'bg-green-500/20' : store.accuracy > 60 ? 'bg-yellow-500/20' : store.accuracy > 40 ? 'bg-orange-500/20' : 'bg-red-500/20']">
                                <svg :class="['w-4 h-4 sm:w-5 sm:h-5', store.accuracy > 80 ? 'text-green-400' : store.accuracy > 60 ? 'text-yellow-400' : store.accuracy > 40 ? 'text-orange-400' : 'text-red-400']"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                                    </path>
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h3
                                    :class="['font-bold text-sm sm:text-base', store.accuracy > 80 ? 'text-green-300' : store.accuracy > 60 ? 'text-yellow-300' : store.accuracy > 40 ? 'text-orange-300' : 'text-red-300']">
                                    Round-trip Translation
                                </h3>
                                <p :class="['text-xs', store.accuracy > 80 ? 'text-green-400/80' : store.accuracy > 60 ? 'text-yellow-400/80' : store.accuracy > 40 ? 'text-orange-400/80' : 'text-red-400/80']"
                                    class="truncate">
                                    Translated back to {{ store.retranslationTargetLanguageName }}
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <span
                                :class="['text-xs px-2 py-1 rounded-full whitespace-nowrap', store.accuracy > 80 ? 'text-green-400/80 bg-green-500/10' : store.accuracy > 60 ? 'text-yellow-400/80 bg-yellow-500/10' : store.accuracy > 40 ? 'text-orange-400/80 bg-orange-500/10' : 'text-red-400/80 bg-red-500/10']">
                                {{ store.retranslatedText.length }} chars
                            </span>
                            <button @click="copyToClipboard(store.retranslatedText)"
                                :class="['text-xs transition-colors duration-200 flex items-center space-x-1 px-2 py-1 rounded-lg flex-shrink-0', store.accuracy > 80 ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10' : store.accuracy > 60 ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10' : store.accuracy > 40 ? 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10' : 'text-red-400 hover:text-red-300 hover:bg-red-500/10']">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">
                                    </path>
                                </svg>
                                <span>Copy</span>
                            </button>
                        </div>
                    </div>
                    <div
                        :class="['p-3 rounded-xl border', store.accuracy > 80 ? 'bg-green-500/5 border-green-500/10' : store.accuracy > 60 ? 'bg-yellow-500/5 border-yellow-500/10' : store.accuracy > 40 ? 'bg-orange-500/5 border-orange-500/10' : 'bg-red-500/5 border-red-500/10']">
                        <div :class="['text-sm leading-relaxed break-words', store.accuracy > 80 ? 'text-green-100' : store.accuracy > 60 ? 'text-yellow-100' : store.accuracy > 40 ? 'text-orange-100' : 'text-red-100']"
                            v-html="store.retranslationWithDiff"></div>
                    </div>
                    <div class="mt-3 space-y-2">
                        <div class="flex items-center space-x-1">
                            <div
                                :class="['w-2 h-2 rounded-full flex-shrink-0', store.accuracy > 80 ? 'bg-green-400' : store.accuracy > 60 ? 'bg-yellow-400' : store.accuracy > 40 ? 'bg-orange-400' : 'bg-red-400']">
                            </div>
                            <span
                                :class="['text-xs', store.accuracy > 80 ? 'text-green-400/80' : store.accuracy > 60 ? 'text-yellow-400/80' : store.accuracy > 40 ? 'text-orange-400/80' : 'text-red-400/80']">
                                Accuracy indicator:
                            </span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div
                                :class="['flex-1 rounded-full h-2 overflow-hidden min-w-0', store.accuracy > 80 ? 'bg-green-500/10' : store.accuracy > 60 ? 'bg-yellow-500/10' : store.accuracy > 40 ? 'bg-orange-500/10' : 'bg-red-500/10']">
                                <div :style="{ width: store.accuracyPercentage + '%' }" :class="store.accuracyBarClass"
                                    class="h-full transition-all duration-500"></div>
                            </div>
                            <span
                                :class="['text-xs font-semibold whitespace-nowrap', store.accuracy > 80 ? 'text-green-400/80' : store.accuracy > 60 ? 'text-yellow-400/80' : store.accuracy > 40 ? 'text-orange-400/80' : 'text-red-400/80']">
                                {{ store.accuracyRating }} ({{ store.accuracyPercentage }}%)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTranslateStore } from '@/stores/useTranslateStore'
import { useToast } from '@/components/ui/toast/use-toast'
import SettingsPopover from '@/components/translate/SettingsPopover.vue'

const { toast } = useToast()
const store = useTranslateStore()

const fmt = (ms) => {
    if (ms === null || ms === undefined || Number.isNaN(ms)) return '—'
    const n = Math.round(ms)
    return n < 1000 ? `${n} ms` : `${(n / 1000).toFixed(2)} s`
}

const showMessage = (type, text, duration = 3000) => {
    const meta = type === 'error'
        ? { title: 'Error', variant: 'destructive' }
        : type === 'success'
            ? { title: 'Success', variant: 'default' }
            : type === 'skipped'
                ? { title: 'Skipped', variant: 'default' }
                : { title: 'Notice', variant: 'default' }

    toast({ title: meta.title, description: text, variant: meta.variant, duration })
}

const translate = async (fromSide = 'left') => {
    const start = performance.now()
    const result = await store.translate(fromSide)
    const totalMs = Math.round(performance.now() - start)

    if (result?.skipped) {
        showMessage('Skipped', 'Already translating…')
        return
    }

    if (!result?.ok) {
        showMessage('Error', result?.error || 'Translation failed')
        return
    }

    const { apiTimeMs, serverTimeMs, openAiTimeMs, cached } = result
    const uiMs = apiTimeMs ? Math.max(totalMs - apiTimeMs, 0) : null
    const badge = cached ? ' • cached' : ''

    showMessage(
        'success',
        `Done in ${fmt(totalMs)}${badge} • Function: ${fmt(serverTimeMs)} • OpenAI: ${fmt(openAiTimeMs)} • UI: ${fmt(uiMs)}`,
        6000
    )
}

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text)
        showMessage('success', 'Copied to clipboard!')
    } catch (e) {
        showMessage('error', 'Failed to copy to clipboard')
    }
}
</script>

<style scoped>
/* Animation for the retranslation section appearing */
.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>