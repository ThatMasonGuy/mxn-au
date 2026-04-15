<!-- src/features/everhomes/components/ErrorLogModal.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      leave-active-class="transition duration-150 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6"
      >
        <div class="absolute inset-0 bg-black/75 backdrop-blur-sm" @click="emit('close')" />

        <div class="relative z-10 w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-700 bg-gradient-to-r from-rose-900/60 to-orange-900/40">
            <h3 class="text-white font-black text-base tracking-tight">
              Oops, something went wrong
            </h3>
            <p class="text-rose-200/90 text-xs mt-1 font-medium leading-relaxed">
              Please screenshot this page (and all text below) and send it to Mason.
            </p>
          </div>

          <div class="px-5 py-4 space-y-3">
            <p class="text-slate-300 text-sm font-semibold">
              {{ message }}
            </p>

            <div class="rounded-xl border border-slate-700 bg-slate-950/80">
              <div class="px-3 py-2 border-b border-slate-800">
                <p class="text-[0.7rem] uppercase tracking-widest font-black text-slate-400">
                  Error logs
                </p>
              </div>
              <pre class="max-h-64 overflow-auto text-[0.72rem] leading-relaxed text-rose-200 p-3 whitespace-pre-wrap break-words">{{ logs || 'No logs captured.' }}</pre>
            </div>

            <div class="flex items-center justify-end gap-2 pt-1">
              <button
                @click="copyLogs"
                class="px-3 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-bold transition-colors"
              >
                Copy logs
              </button>
              <button
                @click="emit('close')"
                class="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  message: { type: String, default: '' },
  logs: { type: String, default: '' },
})

const emit = defineEmits(['close'])

async function copyLogs() {
  const text = [props.message, '', props.logs].filter(Boolean).join('\n')
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // no-op: clipboard may be unavailable in restricted contexts
  }
}
</script>
