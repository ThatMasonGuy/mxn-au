<template>
  <section aria-labelledby="id-records-title" class="rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:p-5">
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
      <div><h2 id="id-records-title" class="text-xl font-bold text-white">ID sighting records</h2><p class="mt-2 text-sm text-slate-300">Download records, retry failed emails or delete records you no longer need.</p></div>
      <button ref="refreshButton" type="button" class="record-action" :disabled="!!busy || loading" @click="load(true)"><RefreshCw :size="16" aria-hidden="true" /> Refresh records</button>
    </div>
    <p v-if="loading && !records.length" class="py-12 text-center text-sm text-slate-300" role="status">Loading ID sighting records…</p>
    <p v-else-if="!records.length && !error" class="py-12 text-center text-sm text-slate-300">No ID sightings have been recorded yet.</p>
    <ul v-if="records.length" class="divide-y divide-white/10">
      <li v-for="item in records" :key="item.id" class="py-5">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="min-w-0 flex-1 basis-56">
            <h3 class="break-words text-base font-semibold text-white">{{ item.record.applicantName }}</h3>
            <p class="mt-1 text-sm text-slate-300">Sighted {{ formatDate(item.record.sightedDate) }}</p>
            <p class="mt-2 break-words text-sm text-slate-300">{{ item.record.staffName }} · {{ item.record.staffEmail }}</p>
            <ul class="mt-3 space-y-1 text-sm text-slate-300"><li v-for="(document, index) in item.record.documents" :key="index">{{ document.type === 'Other' ? document.description : document.type }} · Sighted</li></ul>
            <p class="mt-3 text-sm" :class="item.status !== 'deleting' && item.emailStatus === 'sent' ? 'text-teal-200' : 'text-amber-200'">{{ item.status === 'deleting' ? 'Deletion incomplete · retry deleting this record' : emailLabel(item) }}</p>
            <p class="mt-2 break-all text-xs text-slate-400">Reference: {{ item.id }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button v-if="item.pdfStoragePath && item.status !== 'deleting'" type="button" class="record-action" :disabled="!!busy || loading" @click="download(item)"><Download :size="16" aria-hidden="true" /> {{ busy === `download:${item.id}` ? 'Preparing PDF…' : 'Download PDF' }}</button>
            <button v-if="item.emailStatus !== 'sent' && item.status !== 'deleting'" type="button" class="record-action" :disabled="!!busy || loading" @click="retry(item)"><Mail :size="16" aria-hidden="true" /> {{ busy === `retry:${item.id}` ? 'Retrying…' : item.pdfStoragePath ? 'Retry email' : 'Retry record' }}</button>
            <button type="button" class="record-action record-action-danger" :aria-label="`Delete record for ${item.record.applicantName}`" :disabled="!!busy || loading" @click="openDelete(item, $event)"><Trash2 :size="16" aria-hidden="true" /> Delete record</button>
          </div>
        </div>
      </li>
    </ul>
    <p v-if="error" role="alert" class="mt-4 rounded-lg border border-rose-300/40 bg-rose-950/30 p-4 text-sm leading-6 text-rose-200">{{ error }}</p>
    <p v-if="message" role="status" class="mt-4 text-sm text-teal-200">{{ message }}</p>
    <button v-if="hasMore" type="button" class="record-action mt-5" :disabled="loading || !!busy" @click="load(false)">{{ loading ? 'Loading…' : 'Load more records' }}</button>
    <AlertDialog :open="!!deleteTarget" @update:open="closeDelete">
      <AlertDialogContent class="delete-confirmation max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-lg border-white/15 bg-slate-900 p-5 text-white sm:p-6" @escape-key-down="guardDeleteClose" @close-auto-focus="restoreDeleteFocus">
        <AlertDialogTitle class="text-lg font-bold">Delete ID sighting record?</AlertDialogTitle>
        <AlertDialogDescription class="text-sm leading-6 text-slate-300">
          Permanently delete the record and saved PDF for <strong class="break-words font-semibold text-white">{{ deleteTarget?.record.applicantName }}</strong>, sighted {{ deleteTarget ? formatDate(deleteTarget.record.sightedDate) : '' }}.
          This cannot be undone. Copies already emailed or downloaded will remain.
        </AlertDialogDescription>
        <p v-if="deleteError" role="alert" class="text-sm leading-6 text-rose-200">{{ deleteError }}</p>
        <div class="flex flex-col gap-2 sm:flex-row sm:justify-end" :aria-busy="!!busy">
          <AlertDialogCancel as-child><button type="button" class="record-action" :disabled="!!busy">Keep record</button></AlertDialogCancel>
          <button type="button" class="record-action record-action-danger" :disabled="!!busy" @click="confirmDelete"><Trash2 :size="16" aria-hidden="true" /> {{ busy ? 'Deleting…' : 'Delete record and PDF' }}</button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { Download, RefreshCw, Mail, Trash2 } from '@lucide/vue'
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from '@/shared/components/ui/alert-dialog'
import { idSightingRequest, downloadIdSighting } from '@/features/everhomes/utils/idSightingApi'

const records = ref([]), error = ref(''), message = ref(''), loading = ref(false), busy = ref(''), hasMore = ref(false)
const deleteTarget = ref(null), deleteError = ref(''), refreshButton = ref(null)
let deleteTrigger = null
let cursor = null
const formatDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString('en-AU')
const emailLabel = (record) => record.emailStatus === 'sent' ? 'Email accepted for sending' : record.emailStatus === 'failed' ? 'Email failed · PDF saved' : 'Email pending'
async function load(reset = true) {
  loading.value = true; error.value = ''
  try {
    const constraints = [orderBy('createdAt', 'desc'), limit(50)]
    if (!reset && cursor) constraints.push(startAfter(cursor))
    const snapshot = await getDocs(query(collection(firestore, 'everhomesIdSightings'), ...constraints))
    const next = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    records.value = reset ? next : [...records.value, ...next]
    cursor = snapshot.docs.at(-1) ?? null; hasMore.value = snapshot.size === 50
  } catch { error.value = 'ID sighting records could not be loaded. Check your administrator session and try refreshing.' } finally { loading.value = false }
}
async function download(record) {
  busy.value = `download:${record.id}`; error.value = ''; message.value = ''
  try { await downloadIdSighting({ recordId: record.id }, { admin: true }) } catch (err) { error.value = err.message } finally { busy.value = '' }
}
async function retry(record) {
  busy.value = `retry:${record.id}`; error.value = ''; message.value = ''
  try {
    const result = await idSightingRequest({ action: 'retryEmail', recordId: record.id }, { admin: true })
    record.emailStatus = result.emailStatus
    message.value = result.emailStatus === 'sent' ? `Email accepted for sending to ${result.staffEmail}.` : 'The PDF is saved, but the email could not be sent. Try again later.'
    await load(true)
  } catch (err) { error.value = err.message } finally { busy.value = '' }
}
function openDelete(record, event) {
  deleteTrigger = event.currentTarget
  deleteError.value = ''; error.value = ''; message.value = ''
  deleteTarget.value = record
}
function closeDelete(open) { if (!open && !busy.value) deleteTarget.value = null }
function guardDeleteClose(event) { if (busy.value) event.preventDefault() }
function restoreDeleteFocus(event) {
  event.preventDefault()
  const target = deleteTrigger?.isConnected ? deleteTrigger : refreshButton.value
  target?.focus()
}
async function confirmDelete() {
  if (!deleteTarget.value || busy.value) return
  const record = deleteTarget.value
  busy.value = `delete:${record.id}`; deleteError.value = ''
  try {
    await idSightingRequest({ action: 'delete', recordId: record.id }, { admin: true })
    records.value = records.value.filter((item) => item.id !== record.id)
    message.value = `ID sighting record and saved PDF for ${record.record.applicantName} deleted.`
    if (!records.value.length && hasMore.value) await load(false)
    deleteTarget.value = null
  } catch (err) {
    deleteError.value = err.message
    await load(true)
  } finally { busy.value = '' }
}
onMounted(() => load())
</script>

<style scoped>
.record-action { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 44px; border: 1px solid #5eead455; border-radius: .5rem; background: #134e4a66; padding: .6rem .85rem; font-size: .8125rem; font-weight: 600; color: #ccfbf1; }
.record-action:hover { background: #134e4aaa; }
.record-action:focus-visible { outline: 3px solid #5eead4; outline-offset: 3px; }
.record-action:disabled { opacity: .6; cursor: wait; }
.record-action-danger { border-color: #fda4af66; background: #88133733; color: #fecdd3; }
.record-action-danger:hover { background: #88133766; }
.record-action-danger:focus-visible { outline-color: #fda4af; }
@media (prefers-reduced-motion: reduce) { :global(.delete-confirmation) { animation: none !important; } }
</style>
