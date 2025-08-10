<template>
  <!-- Main Content Wrapper -->
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans flex justify-center p-4">
    <div class="flex flex-col w-full xl:max-w-[80%] xl:py-12">

      <!-- Grid Layout -->
      <div class="relative z-10 w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <TranslationPanel />

        <!-- Right-hand column (fixed height, inner scrolls) -->
        <div class="lg:col-span-1 flex flex-col xl:max-h-[83dvh] max-h-[95dvh] space-y-2">
          <UsagePanel @expand-usage="showUsageAnalytics = true" />
          <!-- I need this to only take up the remaining space in the height locked sidepanel -->
          <div class="flex-1 overflow-hidden">
            <HistoryPanel />
          </div>
        </div>

      </div>

    </div>
    <!-- Fullscreen Usage Analytics -->
    <div v-if="showUsageAnalytics"
      class="fixed inset-0 z-[70] bg-gradient-to-br from-slate-950/90 via-slate-900/90 to-slate-950/90 backdrop-blur-sm">
      <div
        class="absolute inset-4 md:inset-10 bg-slate-900/95 border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div class="p-4 border-b border-white/10 flex items-center gap-3">
          <h3 class="text-white font-semibold text-lg">Usage Analytics</h3>
          <button class="ml-auto text-white/70 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg"
            @click="showUsageAnalytics = false">Close</button>
        </div>

        <div class="flex-1 overflow-auto p-6 space-y-4">
          <!-- Example stats; tweak as you like -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div class="text-xs text-white/60">Total translations</div>
              <div class="text-2xl font-bold text-white">{{ locale(store.appStats?.totalTranslations) }}</div>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div class="text-xs text-white/60">Total words</div>
              <div class="text-2xl font-bold text-white">{{ locale(store.appStats?.totalWords) }}</div>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div class="text-xs text-white/60">Estimated API cost</div>
              <div class="text-2xl font-bold text-white">{{ store.formattedApiCost }}</div>
            </div>
          </div>

          <div v-if="store.topLanguages?.length" class="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div class="text-sm font-medium text-white/80 mb-2">Top languages</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div v-for="lang in store.topLanguages" :key="lang.code"
                class="flex items-center justify-between bg-white/5 rounded-lg p-2">
                <div class="flex items-center gap-2">
                  <i :class="lang.flag" class="w-4 h-3 rounded-sm"></i>
                  <span>{{ lang.name }}</span>
                </div>
                <span class="text-white/70">{{ locale(lang.count) }} ({{ lang.percentage }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useTranslateStore } from '@/stores/useTranslateStore'
import { useToast } from '@/components/ui/toast/use-toast'

import TranslationPanel from '@/components/translate/TranslationPanel.vue'
import UsagePanel from '@/components/translate/UsagePanel.vue'
import HistoryPanel from '@/components/translate/HistoryPanel.vue'

const { toast } = useToast()
const store = useTranslateStore()

const showMessage = (type, text, duration = 3000) => {
  toast({
    title: type === 'error' ? 'Error' : 'Success',
    description: text,
    variant: type === 'error' ? 'destructive' : 'default',
    duration: duration,
  })
}

const showUsageAnalytics = ref(false)
const locale = (n) => (typeof n === 'number' ? n.toLocaleString() : (n || 0).toLocaleString?.() || '0')

// --- Lifecycle Hooks ---
onMounted(() => {
  store.initializeAllListeners(showMessage)
})

onUnmounted(() => {
  store.cleanup()
})
</script>

<style scoped>
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

@keyframes ping {

  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Custom scrollbar for WebKit browsers */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>