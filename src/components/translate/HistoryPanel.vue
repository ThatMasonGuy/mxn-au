<template>
    <!-- Fill the space given by parent (which is already locked via flex-1 + max-h) -->
    <div class="flex flex-col h-full space-y-3">

        <!-- Header -->
        <div class="flex items-center justify-between px-1">
            <h3 class="text-sm font-medium text-white/80 uppercase tracking-wide">History</h3>
            <button v-if="store.history.length" @click="clearHistory"
                class="text-xs text-red-400/70 hover:text-red-400 hover:bg-white/10 px-2 py-1 rounded-lg transition-all">
                Clear
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
                <div v-for="item in store.userHistory" :key="item.id"
                    class="group relative bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-300 rounded-xl p-4 animate-fade-in">
                    <!-- Delete button -->
                    <button @click.stop="deleteHistoryItem(item.id)" aria-label="Delete history item"
                        class="absolute -top-1 -right-1 z-10 p-1 rounded-full bg-black/20 text-white/50 hover:text-red-500 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <!-- Header: lang info + time -->
                    <div class="flex justify-between items-center mb-3">
                        <div class="flex items-center space-x-2 text-xs text-white/70">
                            <div class="flex items-center space-x-1">
                                <!-- UPDATED: Get lang name from code -->
                                <i :class="flagClass(getLangName(item.sourceLang))" class="w-4 h-4 rounded-sm"></i>
                                <span>{{ getLangName(item.sourceLang) }}</span>
                            </div>
                            <svg class="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                            <div class="flex items-center space-x-1">
                                <!-- UPDATED: Get lang name from code -->
                                <i :class="flagClass(getLangName(item.targetLang))" class="w-4 h-4 rounded-sm"></i>
                                <span>{{ getLangName(item.targetLang) }}</span>
                            </div>
                        </div>
                        <span class="text-white/50 text-xs">{{ store.formatTimeAgo(item.timestamp) }}</span>
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
                                    <!-- UPDATED: Use `inputText` from new schema -->
                                    <p class="text-white/80 text-sm bg-black/20 p-3 rounded-lg pr-10 min-h-[2.5rem]">
                                        {{ item.inputText }}
                                    </p>
                                    <button @click="store.copyToClipboard(item.inputText, showMessage)"
                                        aria-label="Copy original text"
                                        class="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-white/40 hover:text-white opacity-0 group-hover/text:opacity-100 transition-all duration-200">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
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
                                    <!-- UPDATED: Use `translated` from new schema -->
                                    <p
                                        class="text-white text-sm bg-black/30 p-3 rounded-lg pr-10 min-h-[2.5rem] font-medium">
                                        {{ item.translated }}
                                    </p>
                                    <button @click="store.copyToClipboard(item.translated, showMessage)"
                                        aria-label="Copy translated text"
                                        class="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-white/40 hover:text-white opacity-0 group-hover/text:opacity-100 transition-all duration-200">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { useTranslateStore } from '@/stores/useTranslateStore'
import { useToast } from '@/components/ui/toast/use-toast';
import { useFlagIcon } from '@/utils/useFlagIcon'

const { toast } = useToast();
const store = useTranslateStore()

const showMessage = (type, text, duration = 3000) => {
    toast({
        title: type === 'error' ? 'Error' : 'Success',
        description: text,
        variant: type === 'error' ? 'destructive' : 'default',
        duration: duration,
    });
};

const getLangName = (langCode) => {
    return store.languages.find(l => l.code === langCode)?.name || langCode;
}

const flagClass = (langName) => {
    const storeFlag = store.flagClass(langName)
    if (storeFlag) return storeFlag

    return useFlagIcon(langName)
}

const deleteHistoryItem = (id) => {
    store.deleteHistoryItem(id, showMessage)
}

const clearHistory = () => {
    store.clearHistory(showMessage);
}
</script>
