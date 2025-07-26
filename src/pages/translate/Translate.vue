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
          <UsagePanel />
          <!-- I need this to only take up the remaining space in the height locked sidepanel -->
          <div class="flex-1 overflow-hidden">
            <HistoryPanel />
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
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

// --- Lifecycle Hooks ---
onMounted(() => {
  store.initializeFirestoreListener(showMessage)
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
