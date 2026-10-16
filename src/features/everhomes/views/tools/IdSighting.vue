<template>
  <LayoutComponent :background="false" bg-style="#0b1525">
    <div class="mx-auto max-w-3xl px-4 pb-28 pt-20 sm:px-6 sm:pb-20 sm:pt-28">
      <RouterLink to="/everhomes" class="back-link"><ArrowLeft :size="16" aria-hidden="true" /> All tools</RouterLink>
      <header class="mb-5 mt-3 sm:mb-7 sm:mt-6">
        <p class="eyebrow">Rental application support · RTA Forms 22b &amp; R22b</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">ID sighting record</h1>
        <p class="mt-3 max-w-xl text-sm leading-6 text-slate-300">Record the ID you have sighted, then save a branded PDF and email a copy to the Everhomes staff member.</p>
      </header>

      <section v-if="receipt" class="record-sheet" aria-labelledby="saved-title">
        <div class="flex items-start gap-3">
          <CheckCircle2 class="mt-1 shrink-0 text-teal-700" aria-hidden="true" />
          <div class="min-w-0">
            <h2 id="saved-title" class="text-xl font-bold">ID sighting record saved</h2>
            <p class="mt-2 text-sm leading-6">The PDF for <strong>{{ savedRecord.applicantName }}</strong> is ready to download.</p>
            <p class="mt-2 break-words text-sm leading-6" role="status">{{ receipt.emailStatus === 'sent' ? `Email accepted for sending to ${receipt.staffEmail}.` : `Your record is saved, but the email to ${receipt.staffEmail} could not be sent. You can retry below.` }}</p>
          </div>
        </div>
        <dl class="mt-6 grid gap-4 border-y border-slate-200 py-5 text-sm sm:grid-cols-2">
          <div><dt class="text-slate-600">Sighted by</dt><dd class="mt-1 break-words font-semibold">{{ savedRecord.staffName }}</dd></div>
          <div><dt class="text-slate-600">Date sighted</dt><dd class="mt-1 font-semibold">{{ displayDate }}</dd></div>
          <div class="sm:col-span-2"><dt class="text-slate-600">ID sighted</dt><dd v-for="(item, index) in savedRecord.documents" :key="index" class="mt-1 break-words font-semibold">{{ item.type === 'Other' ? item.description : item.type }} · Sighted</dd></div>
        </dl>
        <div class="mt-6 flex flex-wrap gap-3">
          <button type="button" class="primary" :disabled="!!busy" @click="download"><Download :size="17" aria-hidden="true" /> {{ busy === 'download' ? 'Preparing PDF…' : 'Download PDF' }}</button>
          <button v-if="receipt.emailStatus !== 'sent'" type="button" class="secondary" :disabled="!!busy" @click="retryEmail">{{ busy === 'retry' ? 'Retrying email…' : 'Retry email' }}</button>
          <button type="button" class="secondary" :disabled="!!busy" @click="startNew">New record</button>
        </div>
        <p class="mt-5 text-xs leading-5 text-slate-600">This record is also available in Everhomes Admin under ID sightings. Download your copy before leaving this page.</p>
      </section>

      <form v-else id="id-sighting-form" class="record-sheet" novalidate :aria-busy="!!busy" @submit.prevent="submit">
        <p class="mb-6 text-sm leading-6 text-slate-600">All fields are required unless marked optional. Record ID types only; do not enter document numbers or upload copies.</p>
        <fieldset :disabled="!!busy || attempted" class="space-y-6">
          <legend class="section-title mb-5">Staff member</legend>
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="staff-name">Everhomes staff member</label>
              <input id="staff-name" v-model="form.staffName" autocomplete="name" maxlength="160" required :aria-invalid="!!errors.staffName" :aria-describedby="errors.staffName ? 'staff-name-error' : undefined" />
              <p v-if="errors.staffName" id="staff-name-error" class="field-error">{{ errors.staffName }}</p>
            </div>
            <div>
              <label for="staff-email">Everhomes staff member email</label>
              <input id="staff-email" v-model="form.staffEmail" type="email" autocomplete="email" autocapitalize="off" :spellcheck="false" maxlength="254" required :aria-invalid="!!errors.staffEmail" aria-describedby="staff-email-help staff-email-error" />
              <p id="staff-email-help" class="help">Use your @everhomes.com.au email.</p>
              <p id="staff-email-error" class="field-error">{{ errors.staffEmail }}</p>
            </div>
          </div>
          <div class="border-t border-slate-200 pt-5">
            <h2 class="section-title mb-5">Person &amp; date</h2>
            <div class="grid gap-5 sm:grid-cols-[minmax(0,1fr)_190px]">
              <div>
                <label for="applicant-name">Whose ID is being sighted?</label>
                <input id="applicant-name" v-model="form.applicantName" autocomplete="off" maxlength="160" required :aria-invalid="!!errors.applicantName" :aria-describedby="errors.applicantName ? 'applicant-error' : undefined" />
                <p class="help">Enter the person's full name.</p>
                <p v-if="errors.applicantName" id="applicant-error" class="field-error">{{ errors.applicantName }}</p>
              </div>
              <div class="min-w-0">
                <label for="sighted-date">Date sighted</label>
                <input id="sighted-date" v-model="form.sightedDate" type="date" :max="today" min="1900-01-01" required :aria-invalid="!!errors.sightedDate" :aria-describedby="errors.sightedDate ? 'date-error' : undefined" />
                <p v-if="errors.sightedDate" id="date-error" class="field-error">{{ errors.sightedDate }}</p>
              </div>
            </div>
          </div>
          <fieldset class="border-t border-slate-200 pt-5">
            <legend class="section-title px-0 pt-5">Identity documents</legend>
            <div v-for="(item, index) in form.documents" :key="index" class="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div class="flex items-center justify-between gap-3">
                <label :for="`id-type-${index}`">Form of ID {{ index + 1 }}{{ index === 1 ? ' (optional)' : '' }}</label>
                <button v-if="index === 1" type="button" class="remove" @click="form.documents.pop()">Remove ID 2</button>
              </div>
              <select :id="`id-type-${index}`" v-model="item.type" required :aria-invalid="!!errors.documents" :aria-describedby="errors.documents ? 'documents-error' : undefined">
                <option value="" disabled>Select a form of ID</option>
                <option v-for="type in ID_TYPES" :key="type" :value="type">{{ type }}</option>
              </select>
              <div v-if="item.type === 'Other'" class="mt-4">
                <label :for="`id-description-${index}`">Other ID type</label>
                <input :id="`id-description-${index}`" v-model="item.description" maxlength="100" required :aria-describedby="`id-description-help-${index}`" />
                <p :id="`id-description-help-${index}`" class="help">Document type only. Leave out numbers and other document details.</p>
              </div>
              <label class="checkbox-row mt-3" :for="`sighted-${index}`">
                <input :id="`sighted-${index}`" v-model="item.sighted" type="checkbox" required :aria-invalid="!!errors.documents" :aria-describedby="errors.documents ? 'documents-error' : undefined" />
                <span>I have sighted this form of ID.</span>
              </label>
            </div>
            <p v-if="errors.documents" id="documents-error" class="field-error">{{ errors.documents }}</p>
            <button v-if="form.documents.length === 1" type="button" class="secondary mt-4" @click="form.documents.push(emptyDocument())"><Plus :size="16" aria-hidden="true" /> Add a second form of ID (optional)</button>
          </fieldset>
        </fieldset>
        <div class="mt-7 border-t border-slate-200 pt-5">
          <p class="mb-4 text-xs leading-5 text-slate-600">Saving creates an admin record and emails the PDF to the staff member above. This supporting record can accompany RTA Form 22b or Form R22b and does not replace either application form.</p>
          <p v-if="attempted && !busy" class="mb-4 text-sm leading-6 text-slate-700">Your save could not be confirmed. Retry with these details to recover the same record.</p>
          <div class="hidden sm:block"><button type="submit" class="primary" :disabled="!!busy"><Loader2 v-if="busy" class="animate-spin" :size="17" aria-hidden="true" /><Mail v-else :size="17" aria-hidden="true" /> {{ busy ? 'Saving record & emailing PDF…' : attempted ? 'Retry saving record' : 'Save record & email PDF' }}</button></div>
        </div>
      </form>
      <p v-if="error" ref="errorEl" tabindex="-1" role="alert" class="mt-4 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm leading-6 text-rose-900">{{ error }}</p>
    </div>
    <div v-if="!receipt" class="mobile-save-bar">
      <button type="submit" form="id-sighting-form" class="primary w-full" :disabled="!!busy"><Loader2 v-if="busy" class="animate-spin" :size="18" aria-hidden="true" /><Mail v-else :size="18" aria-hidden="true" /> {{ busy ? 'Saving record & emailing PDF…' : attempted ? 'Retry saving record' : 'Save record & email PDF' }}</button>
    </div>
  </LayoutComponent>
</template>

<script setup>
import { ref, reactive, computed, nextTick, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, Plus, Mail, Download, Loader2, CheckCircle2 } from '@lucide/vue'
import LayoutComponent from '@/features/everhomes/components/layouts/LayoutComponent.vue'
import { createIdSightingCredentials, idSightingRequest, downloadIdSighting } from '@/features/everhomes/utils/idSightingApi'
import { ID_TYPES, brisbaneToday, normaliseIdSighting } from '../../../../../functions/everhomes/idSightingCore.mjs'
import { trackEverhomesToolUsage } from '@/features/everhomes/utils/toolUsage'

const emptyDocument = () => ({ type: '', description: '', sighted: false })
const today = brisbaneToday()
const initialForm = () => ({ staffName: '', staffEmail: '', applicantName: '', sightedDate: today, documents: [emptyDocument()] })
const form = reactive(initialForm())
const errors = ref({}), error = ref(''), errorEl = ref(null), busy = ref(''), receipt = ref(null), attempted = ref(false), savedRecord = ref(null)
let credentials = createIdSightingCredentials()
const displayDate = computed(() => savedRecord.value ? new Date(`${savedRecord.value.sightedDate}T00:00:00`).toLocaleDateString('en-AU') : '')
watch(form, () => {
  if (form.staffName.trim()) delete errors.value.staffName
  if (/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@everhomes\.com\.au$/i.test(form.staffEmail.trim())) delete errors.value.staffEmail
  if (form.applicantName.trim()) delete errors.value.applicantName
  if (form.sightedDate && form.sightedDate <= brisbaneToday()) delete errors.value.sightedDate
  if (form.documents.every((item) => item.type && item.sighted && (item.type !== 'Other' || item.description.trim()))) delete errors.value.documents
})

async function showError(message) {
  error.value = message
  await nextTick()
  errorEl.value?.focus()
}
async function submit() {
  if (busy.value) return
  errors.value = {}
  error.value = ''
  if (!form.staffName.trim()) errors.value.staffName = 'Enter the staff member’s name.'
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@everhomes\.com\.au$/i.test(form.staffEmail.trim())) errors.value.staffEmail = 'Enter an @everhomes.com.au email address.'
  if (!form.applicantName.trim()) errors.value.applicantName = 'Enter the full name of the person whose ID you sighted.'
  if (!form.sightedDate || form.sightedDate > brisbaneToday()) errors.value.sightedDate = 'Enter a date that is not in the future.'
  if (form.documents.some((item) => !item.type || !item.sighted || (item.type === 'Other' && !item.description.trim()))) errors.value.documents = 'Choose each ID type and confirm that you have sighted it.'
  if (Object.keys(errors.value).length) { await nextTick(); document.querySelector('[aria-invalid="true"]')?.focus(); return }
  try { savedRecord.value = normaliseIdSighting(form, brisbaneToday()) } catch (err) { await showError(err.message); return }
  busy.value = 'save'
  attempted.value = true
  try {
    receipt.value = await idSightingRequest({ action: 'submit', ...credentials, record: savedRecord.value })
    void trackEverhomesToolUsage({ toolId: 'id-sighting', action: 'record_saved', once: false })
    await nextTick()
    document.getElementById('saved-title')?.setAttribute('tabindex', '-1')
    document.getElementById('saved-title')?.focus()
  } catch (err) {
    if (err.status === 400 || err.status === 429) attempted.value = false
    await showError(err.message)
  } finally { busy.value = '' }
}
async function download() {
  busy.value = 'download'; error.value = ''
  try { await downloadIdSighting(credentials) } catch (err) { await showError(err.message) } finally { busy.value = '' }
}
async function retryEmail() {
  busy.value = 'retry'; error.value = ''
  try { receipt.value = await idSightingRequest({ action: 'retryEmail', ...credentials }) } catch (err) { await showError(err.message) } finally { busy.value = '' }
}
function startNew() {
  const staffName = savedRecord.value.staffName, staffEmail = savedRecord.value.staffEmail
  Object.assign(form, initialForm(), { staffName, staffEmail, sightedDate: brisbaneToday() }); credentials = createIdSightingCredentials()
  receipt.value = null; savedRecord.value = null; attempted.value = false; error.value = ''; errors.value = {}
  nextTick(() => document.getElementById('applicant-name')?.focus())
}
</script>

<style scoped>
.back-link { display: inline-flex; align-items: center; gap: .5rem; min-height: 44px; color: #99f6e4; font-size: .875rem; }
.eyebrow { color: #99f6e4; font-size: .75rem; font-weight: 600; letter-spacing: .06em; }
h1 { overflow-wrap: anywhere; }
.record-sheet { background: white; color: #1e293b; border-radius: 1rem; padding: 1.5rem; border-top: 4px solid #0d9488; box-shadow: 0 16px 40px #0002; }
.section-title { font-size: 1rem; font-weight: 700; color: #115e59; }
label { display: block; font-size: .875rem; font-weight: 600; }
input:not([type=checkbox]), select { display: block; width: 100%; min-width: 0; min-height: 46px; margin-top: .5rem; padding: .65rem .75rem; background: white; border: 1px solid #94a3b8; color: #0f172a; border-radius: .5rem; font-size: 1rem; scroll-margin-top: 100px; scroll-margin-bottom: 110px; }
input[aria-invalid=true], select[aria-invalid=true] { border-color: #be123c; }
input[type=checkbox] { width: 20px; height: 20px; flex-shrink: 0; accent-color: #0f766e; }
.checkbox-row { display: flex; align-items: center; gap: .75rem; min-height: 44px; font-weight: 400; }
.help { margin-top: .5rem; font-size: .75rem; line-height: 1.5; color: #475569; }
.field-error { margin-top: .5rem; font-size: .8125rem; color: #be123c; }
.field-error:empty { display: none; }
.primary, .secondary { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; max-width: 100%; min-height: 44px; padding: .65rem 1rem; border-radius: .5rem; font-size: .875rem; font-weight: 600; overflow-wrap: anywhere; cursor: pointer; }
.primary { background: #0f766e; color: white; }
.primary:hover { background: #115e59; }
.secondary { background: white; border: 1px solid #94a3b8; color: #334155; }
.secondary:hover { background: #f1f5f9; }
.remove { min-height: 44px; font-size: .75rem; color: #9f1239; text-decoration: underline; }
:is(button, input, select, a):focus-visible { outline: 3px solid #0d9488; outline-offset: 3px; }
button:disabled { opacity: .65; cursor: wait; }
fieldset:disabled { opacity: .8; }
.mobile-save-bar { position: fixed; z-index: 40; bottom: 0; left: 0; right: 0; padding: 12px 16px max(12px, env(safe-area-inset-bottom)); background: #0b1525; border-top: 1px solid #334155; box-shadow: 0 -6px 20px #0002; }
.mobile-save-bar .primary { min-height: 50px; }
@media (min-width: 640px) { .mobile-save-bar { display: none; } }
@media (max-width: 639px) { :deep(footer) { padding-bottom: 100px; } }
@media (max-width: 420px) { .record-sheet { padding: 1.15rem; } }
@media (prefers-reduced-motion: reduce) { .animate-spin { animation: none; } }
</style>
