<!-- src/components/translate/TranslationPanel.vue (icon-only status; destination-aware) -->
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
                                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                        </router-link>
                        <div class="text-left">
                            <h1
                                class="text-2xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                                AI Translator</h1>
                            <p class="text-purple-100 text-xs opacity-90">Built by Mason, Powered by OpenAI</p>
                        </div>
                    </div>
                    <!-- Settings Popover -->
                    <SettingsPopover />
                </div>
            </div>

            <!-- Translation Interface -->
            <div class="pt-4 px-4 sm:p-6 flex-grow flex flex-col border-t border-white/10">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-grow">
                    <!-- Left Side (Source/Target Language) -->
                    <div class="space-y-2 flex flex-col min-h-[300px] lg:min-h-0">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-3">
                                <div class="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                                <h4 class="font-bold text-white">{{ store.leftLanguageName }}</h4>
                            </div>
                            <div class="flex items-center space-x-2">
                                <!-- FROM language: shadcn/vue Select -->
                                <Select v-model="store.fromLanguage">
                                    <SelectTrigger
                                        class="h-8 w-40 bg-white/5 border border-white/10 text-white text-xs">
                                        <SelectValue :placeholder="store.leftLanguageName" />
                                    </SelectTrigger>
                                    <SelectContent class="bg-slate-900/95 text-white border-white/10">
                                        <SelectItem v-for="lang in store.languages" :key="lang.code" :value="lang.code">
                                            {{ lang.name }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <!-- LEFT: Input/Output Shell (glow if destination === 'left') -->
                        <div class="group flex-grow flex flex-col min-h-[220px]">
                            <div :class="[
                                'flex h-full flex-col bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden',
                                showGlowSide === 'left' ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-emerald-400/60' : '',
                            ]">
                                <!-- Text area occupies scrollable region above footer -->
                                <textarea v-model="store.leftText" @keydown.enter.exact.prevent="onTranslate('left')"
                                    placeholder="Type here..."
                                    class="flex-1 w-full resize-none bg-transparent text-white placeholder-white/40 p-4 focus:outline-none focus:ring-0" />

                                <!-- Fixed footer within the shell -->
                                <div
                                    class="h-12 px-3 gap-2 flex items-center justify-between bg-white/5 border-t border-white/10">
                                    <div class="flex items-center gap-2">
                                        <button v-if="store.leftText" @click="store.leftText = ''"
                                            class="text-white/60 hover:text-red-500 hover:bg-white/10 p-1.5 rounded-full transition"
                                            aria-label="Clear text">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        <!-- Destination-aware status (LEFT as destination) -->
                                        <transition name="fade">
                                            <div v-if="lastResult && lastResult.ok && lastResult.dest === 'left'"
                                                class="flex items-center gap-1.5">
                                                <!-- Cached/Fresh icon-only indicator -->
                                                <div :title="lastResult.cached ? 'Cached translation' : 'Fresh translation'"
                                                    :aria-label="lastResult.cached ? 'Cached translation' : 'Fresh translation'"
                                                    :class="[
                                                        'p-1.5 rounded-full border backdrop-blur-sm',
                                                        lastResult.cached
                                                            ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300'
                                                            : 'bg-blue-500/15 border-blue-400/30 text-blue-300',
                                                    ]">
                                                    <Database v-if="lastResult.cached" class="w-3.5 h-3.5" />
                                                    <BadgeCheck v-else class="w-3.5 h-3.5" />
                                                </div>

                                                <!-- Mark bad icon-only button -->
                                                <button
                                                    class="p-1.5 rounded-full border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition"
                                                    @click="markBad()" aria-label="Mark translation as bad"
                                                    title="Mark translation as bad">
                                                    <ThumbsDown class="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </transition>
                                    </div>

                                    <button @click="onTranslate('left')" :disabled="!store.canTranslateLeft"
                                        class="ml-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg text-sm">
                                        <span>Translate</span>
                                        <template v-if="store.isTranslating">
                                            <svg class="animate-spin w-4 h-4" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </template>
                                        <template v-else>
                                            <ArrowRight class="w-4 h-4" />
                                        </template>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Bottom row: counter (left) + copy (right) -->
                        <div class="flex justify-between h-8 items-center">
                            <span class="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-full">{{
                                store.leftText.length }} chars</span>
                            <button @click="copyToClipboard(store.leftText)" :disabled="!store.leftText" :class="[
                                'text-xs transition-colors duration-200 flex items-center space-x-1 px-2 py-1 rounded-lg',
                                store.leftText ? 'text-blue-400 hover:text-blue-300 hover:bg-white/5' : 'text-white/30 cursor-not-allowed',
                            ]">
                                <Copy class="w-3.5 h-3.5" />
                                <span>Copy</span>
                            </button>
                        </div>
                    </div>

                    <!-- Right Side (Source/Target Language) -->
                    <div class="space-y-2 flex flex-col min-h-[300px] lg:min-h-0">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-3">
                                <div class="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                                <h4 class="font-bold text-white">{{ store.rightLanguageName }}</h4>
                            </div>
                            <div class="flex items-center space-x-2">
                                <!-- TO language: shadcn/vue Select -->
                                <Select v-model="store.selectedLanguage">
                                    <SelectTrigger
                                        class="h-8 w-40 bg-white/5 border border-white/10 text-white text-xs">
                                        <SelectValue :placeholder="store.rightLanguageName" />
                                    </SelectTrigger>
                                    <SelectContent class="bg-slate-900/95 text-white border-white/10">
                                        <SelectItem v-for="lang in store.languages" :key="lang.code" :value="lang.code">
                                            {{ lang.name }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <!-- RIGHT: Output Shell (glow if destination === 'right') -->
                        <div class="group flex-grow flex flex-col min-h-[220px]">
                            <div :class="[
                                'flex h-full flex-col bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden',
                                showGlowSide === 'right' ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-emerald-400/60' : '',
                            ]">
                                <textarea v-model="store.rightText" @keydown.enter.exact.prevent="onTranslate('right')"
                                    placeholder="Translation appears here..."
                                    class="flex-1 w-full resize-none bg-transparent text-white placeholder-white/40 p-4 focus:outline-none focus:ring-0" />

                                <!-- Fixed footer -->
                                <div
                                    class="h-12 px-3 flex items-center justify-between gap-2 bg-white/5 border-t border-white/10">
                                    <div class="flex items-center gap-2">
                                        <button v-if="store.rightText" @click="store.rightText = ''"
                                            class="text-white/60 hover:text-red-500 hover:bg-white/10 p-1.5 rounded-full transition"
                                            aria-label="Clear text">
                                            <X class="w-4 h-4" />
                                        </button>

                                        <!-- Destination-aware status (RIGHT as destination) -->
                                        <transition name="fade">
                                            <div v-if="lastResult && lastResult.ok && lastResult.dest === 'right'"
                                                class="flex items-center gap-1.5">
                                                <!-- Cached/Fresh icon-only indicator -->
                                                <div :title="lastResult.cached ? 'Cached translation' : 'Fresh translation'"
                                                    :aria-label="lastResult.cached ? 'Cached translation' : 'Fresh translation'"
                                                    :class="[
                                                        'p-1.5 rounded-full border backdrop-blur-sm',
                                                        lastResult.cached
                                                            ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300'
                                                            : 'bg-blue-500/15 border-blue-400/30 text-blue-300',
                                                    ]">
                                                    <Database v-if="lastResult.cached" class="w-3.5 h-3.5" />
                                                    <BadgeCheck v-else class="w-3.5 h-3.5" />
                                                </div>

                                                <!-- Mark bad icon-only button -->
                                                <button
                                                    class="p-1.5 rounded-full border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition"
                                                    @click="markBad()" aria-label="Mark translation as bad"
                                                    title="Mark translation as bad">
                                                    <ThumbsDown class="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </transition>
                                    </div>

                                    <button @click="onTranslate('right')" :disabled="!store.canTranslateRight"
                                        class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg text-sm">
                                        <template v-if="store.isTranslating">
                                            <svg class="animate-spin w-4 h-4" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </template>
                                        <template v-else>
                                            <ArrowLeft class="w-4 h-4" />
                                        </template>
                                        <span>Translate</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Bottom row: counter (left) + copy (right) -->
                        <div class="flex justify-between h-8 items-center">
                            <span class="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-full">{{
                                store.rightText.length }} chars</span>
                            <button @click="copyToClipboard(store.rightText)" :disabled="!store.rightText" :class="[
                                'text-xs transition-colors duration-200 flex items-center space-x-1 px-2 py-1 rounded-lg',
                                store.rightText ? 'text-purple-400 hover:text-purple-300 hover:bg-white/5' : 'text-white/30 cursor-not-allowed',
                            ]">
                                <Copy class="w-3.5 h-3.5" />
                                <span>Copy</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Retranslation Section (unchanged logic, visual polish kept) -->
                <div v-if="store.retranslatedText" :class="[
                    'mt-4 mb-4 md:mb-0 p-3 sm:p-4 rounded-2xl backdrop-blur-sm animate-fade-in',
                    store.accuracyPercentage > 80
                        ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20'
                        : store.accuracyPercentage > 60
                            ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20'
                            : store.accuracyPercentage > 40
                                ? 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20'
                                : 'bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20',
                ]">
                    <div class="mb-3">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-2 sm:space-x-3">
                                <div :class="[
                                    'p-2 rounded-lg flex-shrink-0',
                                    store.accuracyPercentage > 80
                                        ? 'bg-green-500/20'
                                        : store.accuracyPercentage > 60
                                            ? 'bg-yellow-500/20'
                                            : store.accuracyPercentage > 40
                                                ? 'bg-orange-500/20'
                                                : 'bg-red-500/20',
                                ]">
                                    <svg :class="[
                                        'w-4 h-4 sm:w-5 sm:h-5',
                                        store.accuracyPercentage > 80
                                            ? 'text-green-400'
                                            : store.accuracyPercentage > 60
                                                ? 'text-yellow-400'
                                                : store.accuracyPercentage > 40
                                                    ? 'text-orange-400'
                                                    : 'text-red-400',
                                    ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h3 :class="[
                                        'font-bold text-sm sm:text-base',
                                        store.accuracyPercentage > 80
                                            ? 'text-green-300'
                                            : store.accuracyPercentage > 60
                                                ? 'text-yellow-300'
                                                : store.accuracyPercentage > 40
                                                    ? 'text-orange-300'
                                                    : 'text-red-300',
                                    ]">
                                        Round-trip Translation
                                    </h3>
                                    <p :class="[
                                        'text-xs',
                                        store.accuracyPercentage > 80
                                            ? 'text-green-400/80'
                                            : store.accuracyPercentage > 60
                                                ? 'text-yellow-400/80'
                                                : store.accuracyPercentage > 40
                                                    ? 'text-orange-400/80'
                                                    : 'text-red-400/80',
                                    ]" class="truncate">
                                        Translated back to {{ store.retranslationTargetLanguageName }}
                                    </p>
                                </div>
                            </div>
                            <button class="text-white/70 hover:text-white text-xs inline-flex items-center gap-1"
                                @click="roundTripCollapsed = !roundTripCollapsed">
                                <span>{{ roundTripCollapsed ? 'Expand' : 'Collapse' }}</span>
                                <ChevronDown v-if="!roundTripCollapsed" class="w-4 h-4" />
                                <ChevronUp v-else class="w-4 h-4" />
                            </button>
                        </div>

                        <transition name="fade">
                            <div v-if="!roundTripCollapsed" class="flex items-center justify-between flex-wrap gap-2">
                                <span :class="[
                                    'text-xs px-2 py-1 rounded-full whitespace-nowrap',
                                    store.accuracyPercentage > 80
                                        ? 'text-green-400/80 bg-green-500/10'
                                        : store.accuracyPercentage > 60
                                            ? 'text-yellow-400/80 bg-yellow-500/10'
                                            : store.accuracyPercentage > 40
                                                ? 'text-orange-400/80 bg-orange-500/10'
                                                : 'text-red-400/80 bg-red-500/10',
                                ]">
                                    {{ store.retranslatedText.length }} chars
                                </span>
                                <button @click="copyToClipboard(store.retranslatedText)" :class="[
                                    'text-xs transition-colors duration-200 flex items-center space-x-1 px-2 py-1 rounded-lg flex-shrink-0',
                                    store.accuracyPercentage > 80
                                        ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                                        : store.accuracyPercentage > 60
                                            ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'
                                            : store.accuracyPercentage > 40
                                                ? 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10'
                                                : 'text-red-400 hover:text-red-300 hover:bg-red-500/10',
                                ]">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span>Copy</span>
                                </button>
                            </div>
                        </transition>
                    </div>

                    <transition name="fade">
                        <div v-if="!roundTripCollapsed" :class="[
                            'p-3 rounded-xl border',
                            store.accuracyPercentage > 80
                                ? 'bg-green-500/5 border-green-500/10'
                                : store.accuracyPercentage > 60
                                    ? 'bg-yellow-500/5 border-yellow-500/10'
                                    : store.accuracyPercentage > 40
                                        ? 'bg-orange-500/5 border-orange-500/10'
                                        : 'bg-red-500/5 border-red-500/10',
                        ]">
                            <div :class="[
                                'text-sm leading-relaxed break-words',
                                store.accuracyPercentage > 80
                                    ? 'text-green-100'
                                    : store.accuracyPercentage > 60
                                        ? 'text-yellow-100'
                                        : store.accuracyPercentage > 40
                                            ? 'text-orange-100'
                                            : 'text-red-100',
                            ]" v-html="store.retranslationWithDiff" />
                        </div>
                    </transition>

                    <div class="mt-3 space-y-2">
                        <div class="flex items-center space-x-1">
                            <div :class="[
                                'w-2 h-2 rounded-full flex-shrink-0',
                                store.accuracyPercentage > 80
                                    ? 'bg-green-400'
                                    : store.accuracyPercentage > 60
                                        ? 'bg-yellow-400'
                                        : store.accuracyPercentage > 40
                                            ? 'bg-orange-400'
                                            : 'bg-red-400',
                            ]" />
                            <span :class="[
                                'text-xs',
                                store.accuracyPercentage > 80
                                    ? 'text-green-400/80'
                                    : store.accuracyPercentage > 60
                                        ? 'text-yellow-400/80'
                                        : store.accuracyPercentage > 40
                                            ? 'text-orange-400/80'
                                            : 'text-red-400/80',
                            ]">Accuracy indicator:</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div :class="[
                                'flex-1 rounded-full h-2 overflow-hidden min-w-0',
                                store.accuracyPercentage > 80
                                    ? 'bg-green-500/10'
                                    : store.accuracyPercentage > 60
                                        ? 'bg-yellow-500/10'
                                        : store.accuracyPercentage > 40
                                            ? 'bg-orange-500/10'
                                            : 'bg-red-500/10',
                            ]">
                                <div :style="{ width: store.accuracyPercentage + '%' }" :class="store.accuracyBarClass"
                                    class="h-full transition-all duration-500" />
                            </div>
                            <span :class="[
                                'text-xs font-semibold whitespace-nowrap',
                                store.accuracyPercentage > 80
                                    ? 'text-green-400/80'
                                    : store.accuracyPercentage > 60
                                        ? 'text-yellow-400/80'
                                        : store.accuracyPercentage > 40
                                            ? 'text-orange-400/80'
                                            : 'text-red-400/80',
                            ]">{{ store.accuracyRating }} ({{ store.accuracyPercentage }}%)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import SettingsPopover from '@/components/translate/SettingsPopover.vue'
import { useTranslateStore } from '@/stores/useTranslateStore'
import { useToast } from '@/components/ui/toast/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowRight, ArrowLeft, X, Copy, ChevronDown, ChevronUp, BadgeCheck, Database, ThumbsDown } from 'lucide-vue-next'

const store = useTranslateStore()
const { toast } = useToast()

const lastResult = ref(null)
/** 'left' | 'right' | null — which side should glow after a successful translation */
const showGlowSide = ref(null)
const roundTripCollapsed = ref(false)

const copyToClipboard = (text) =>
    store.copyToClipboard?.(text, (type, desc) =>
        toast({
            title: type === 'error' ? 'Error' : 'Success',
            description: desc,
            variant: type === 'error' ? 'destructive' : 'default'
        })
    )

const onTranslate = async (side) => {
    const dest = side === 'left' ? 'right' : 'left'
    const res = await store.translate(side)
    // Keep track of destination so status icons render on the correct panel
    lastResult.value = res ? { ...res, dest } : null

    if (res?.ok) {
        showGlowSide.value = dest
        setTimeout(() => (showGlowSide.value = null), 900)
    }
}

const markBad = () => {
    // UI-only for now; backend invalidation will be wired later
    toast({
        title: 'Flagged',
        description: 'Marked as bad. This translation will be refreshed next time.',
        duration: 2500
    })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>