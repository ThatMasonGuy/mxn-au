<template>
  <div class="mb-4 rounded-2xl border px-4 py-4" :class="panelClass">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0" role="status" aria-live="polite" aria-atomic="true">
        <p class="flex items-center gap-2 text-sm font-bold">
          <LoaderCircle v-if="busy" aria-hidden="true" class="h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none" />
          {{ title }}
        </p>
        <p class="mt-1 text-xs leading-5">{{ message }}</p>
      </div>
      <div class="flex shrink-0 flex-wrap gap-2">
        <button v-if="sync.status === 'error'" type="button" :disabled="busy || !reportState.isOnline" @click="retryBackup" class="rounded-xl border border-current/40 px-3 py-2.5 text-xs font-bold hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">Retry backup</button>
        <button type="button" :disabled="busy || !reportState.resumeLink || !reportState.isOnline" :aria-busy="copying" @click="copyLink" class="flex items-center justify-center gap-2 rounded-xl border border-current/40 px-3 py-2.5 text-xs font-bold hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">
          <LoaderCircle v-if="copying" aria-hidden="true" class="h-4 w-4 animate-spin motion-reduce:animate-none" />
          {{ copying ? 'Preparing resume link…' : copied ? 'Resume link copied' : !sync.hasBackup && busy ? 'Preparing resume link…' : 'Copy resume link' }}
        </button>
      </div>
    </div>
    <p v-if="error" role="alert" class="mt-3 text-xs font-semibold leading-5">{{ error }}</p>
    <div v-if="showManualLink && reportState.resumeLink" class="mt-3">
      <label for="manual-resume-link" class="block text-xs font-bold">Resume link — select and copy</label>
      <input id="manual-resume-link" :value="reportState.resumeLink" readonly @focus="$event.target.select()" class="mt-1 w-full min-w-0 rounded-lg border border-current/40 bg-slate-950/50 px-3 py-2.5 text-xs" />
      <p class="mt-1 text-xs leading-5">Anyone with this link can open the saved draft. Share it only with the people completing this report.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted } from 'vue'
import { LoaderCircle } from '@lucide/vue'
const props = defineProps({ reportState: { type: Object, required: true } })
const copying = ref(false)
const retrying = ref(false)
const copied = ref(false)
const error = ref('')
const showManualLink = ref(false)
let copiedTimer
const sync = computed(() => props.reportState.draftSync)
const busy = computed(() => copying.value || retrying.value || ['pending', 'syncing'].includes(sync.value.status))
const title = computed(() => {
  if (!props.reportState.isOnline) return 'Offline — recovery backup paused'
  if (busy.value) return sync.value.hasBackup ? 'Saving recovery backup…' : 'Preparing your resume link…'
  if (sync.value.status === 'error') return 'Recovery backup needs attention'
  if (sync.value.status === 'saved') return 'Recovery backup saved'
  return 'Preparing recovery backup…'
})
const message = computed(() => {
  if (!props.reportState.isOnline) return 'Reconnect to back up your latest changes and prepare a resume link.'
  if (busy.value) return 'Please wait while your latest changes are backed up. Keep this page open.'
  if (sync.value.status === 'error') return sync.value.lastError || 'The backup could not be saved. Check your connection and retry.'
  if (sync.value.status === 'saved') return 'Your latest changes are backed up. Copy a resume link to continue this draft on another device.'
  return 'Your resume link will be available after the first backup succeeds.'
})
const panelClass = computed(() => {
  if (!props.reportState.isOnline) return 'border-amber-400/40 bg-amber-500/10 text-amber-100'
  if (sync.value.status === 'error') return 'border-rose-400/40 bg-rose-500/10 text-rose-100'
  if (sync.value.status === 'saved' && !busy.value) return 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100'
  return 'border-sky-400/40 bg-sky-500/10 text-sky-100'
})
async function copyLink() {
  if (busy.value) return
  copying.value = true
  copied.value = false
  error.value = ''
  showManualLink.value = false
  try {
    await props.reportState.copyResumeLink()
    copied.value = true
    clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => { copied.value = false }, 4000)
  } catch {
    showManualLink.value = sync.value.status === 'saved'
    error.value = showManualLink.value
      ? 'Your backup is saved, but the link could not be copied automatically. Copy it below.'
      : 'Your latest changes could not be backed up. Retry the backup before copying a resume link.'
  } finally { copying.value = false }
}
async function retryBackup() {
  if (busy.value) return
  retrying.value = true
  error.value = ''
  try { await props.reportState.flushDraftSync() }
  catch { error.value = 'The backup could not be saved. Check your connection and try again.' }
  finally { retrying.value = false }
}
onUnmounted(() => clearTimeout(copiedTimer))
</script>
