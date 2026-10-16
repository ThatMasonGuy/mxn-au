<template>
  <LayoutComponent :background="false" bg-style="#1b2d3d" class="sighting-page">
    <div class="sighting-workspace">
      <header class="page-heading">
        <div class="title-icon" aria-hidden="true"><ContactRound :size="24" :stroke-width="1.6" /></div>
        <div>
          <p class="eyebrow">RTA Forms 22b &amp; R22b</p>
          <h1>ID sighting record</h1>
          <p class="page-description">Record sighted ID and email a PDF copy.</p>
        </div>
      </header>

      <section v-if="receipt" class="record-sheet saved-sheet" aria-labelledby="saved-title">
        <div class="saved-heading">
          <div class="saved-icon"><CheckCircle2 :size="25" aria-hidden="true" /></div>
          <div>
            <p class="eyebrow">Record complete</p>
            <h2 id="saved-title" tabindex="-1">Your PDF is ready</h2>
          </div>
        </div>
        <p class="saved-applicant">{{ savedRecord.applicantName }}</p>
        <div class="delivery-note" :class="{ 'delivery-warning': receipt.emailStatus !== 'sent' }" role="status">
          <Mail :size="18" aria-hidden="true" />
          <p v-if="receipt.emailStatus === 'sent'">Email accepted for sending to <strong>{{ receipt.staffEmail }}</strong>.</p>
          <p v-else>The record is saved, but the email to <strong>{{ receipt.staffEmail }}</strong> could not be sent. You can retry below.</p>
        </div>
        <dl class="record-summary">
          <div><dt>Sighted by</dt><dd>{{ savedRecord.staffName }}</dd></div>
          <div><dt>Date sighted</dt><dd>{{ displayDate }}</dd></div>
          <div class="summary-documents"><dt>ID sighted</dt><dd v-for="(item, index) in savedRecord.documents" :key="index"><Check :size="15" aria-hidden="true" />{{ item.type === 'Other' ? item.description : item.type }}</dd></div>
        </dl>
        <div class="saved-actions">
          <button type="button" class="primary" :disabled="!!busy" @click="download"><Download :size="17" aria-hidden="true" /> {{ busy === 'download' ? 'Preparing PDF…' : 'Download PDF' }}</button>
          <button v-if="receipt.emailStatus !== 'sent'" type="button" class="secondary" :disabled="!!busy" @click="retryEmail">{{ busy === 'retry' ? 'Retrying email…' : 'Retry email' }}</button>
          <button type="button" class="secondary" :disabled="!!busy" @click="startNew"><Plus :size="16" aria-hidden="true" /> New record</button>
        </div>
        <p class="saved-footnote">Saved in Everhomes Admin under ID sightings. Download your copy before leaving this page.</p>
      </section>

      <form v-else id="id-sighting-form" class="record-sheet" novalidate :aria-busy="!!busy" @submit.prevent="submit">
        <div class="form-intro"><span>New record</span><span>All fields required unless optional</span></div>
        <fieldset :disabled="!!busy || attempted" class="form-fields">
          <legend class="sr-only">ID sighting details</legend>
          <fieldset class="form-section" aria-labelledby="staff-section-title">
            <legend id="staff-section-title" class="section-title"><span aria-hidden="true">01</span> Staff member</legend>
            <div class="field-grid">
              <div class="field">
                <label for="staff-name">Staff name</label>
                <input id="staff-name" v-model="form.staffName" autocomplete="name" placeholder="Full name" maxlength="160" required :aria-invalid="!!errors.staffName" :aria-describedby="errors.staffName ? 'staff-name-error' : undefined" />
                <p v-if="errors.staffName" id="staff-name-error" class="field-error">{{ errors.staffName }}</p>
              </div>
              <div class="field">
                <label for="staff-email">Everhomes email</label>
                <input id="staff-email" v-model="form.staffEmail" type="email" autocomplete="email" autocapitalize="off" :spellcheck="false" placeholder="name@everhomes.com.au" maxlength="254" required :aria-invalid="!!errors.staffEmail" :aria-describedby="errors.staffEmail ? 'staff-email-error' : 'staff-email-help'" />
                <p v-if="errors.staffEmail" id="staff-email-error" class="field-error">{{ errors.staffEmail }}</p>
                <p v-else id="staff-email-help" class="help">The PDF will be sent to this address.</p>
              </div>
            </div>
          </fieldset>
          <fieldset class="form-section" aria-labelledby="person-section-title">
            <legend id="person-section-title" class="section-title"><span aria-hidden="true">02</span> Person &amp; date</legend>
            <div class="field-grid person-grid">
              <div class="field">
                <label for="applicant-name">Person whose ID is sighted</label>
                <input id="applicant-name" v-model="form.applicantName" autocomplete="off" placeholder="Full name" maxlength="160" required :aria-invalid="!!errors.applicantName" :aria-describedby="errors.applicantName ? 'applicant-error' : undefined" />
                <p v-if="errors.applicantName" id="applicant-error" class="field-error">{{ errors.applicantName }}</p>
              </div>
              <div class="field">
                <label for="sighted-date">Date sighted</label>
                <input id="sighted-date" v-model="form.sightedDate" type="date" :max="today" min="1900-01-01" required :aria-invalid="!!errors.sightedDate" :aria-describedby="errors.sightedDate ? 'date-error' : undefined" />
                <p v-if="errors.sightedDate" id="date-error" class="field-error">{{ errors.sightedDate }}</p>
              </div>
            </div>
          </fieldset>
          <fieldset class="form-section document-section" aria-labelledby="documents-section-title">
            <legend id="documents-section-title" class="section-title"><span aria-hidden="true">03</span> Identity documents</legend>
            <p class="document-guidance"><ShieldCheck :size="16" aria-hidden="true" />ID types only. No document numbers or copies.</p>
            <div v-for="(item, index) in form.documents" :key="index" class="document-entry">
              <div class="document-heading">
                <label :for="`id-type-${index}`">Form of ID {{ index + 1 }} <span v-if="index === 1" class="optional-label">Optional</span></label>
                <button v-if="index === 1" type="button" class="remove" aria-label="Remove ID 2" @click="removeSecondDocument"><X :size="16" aria-hidden="true" /> Remove</button>
              </div>
              <select :id="`id-type-${index}`" v-model="item.type" required :aria-invalid="!!errors.documents && !item.type" :aria-describedby="errors.documents ? 'documents-error' : undefined">
                <option value="" disabled>Select ID type</option>
                <option v-for="type in ID_TYPES" :key="type" :value="type">{{ type }}</option>
              </select>
              <div v-if="item.type === 'Other'" class="other-id-field">
                <label :for="`id-description-${index}`">Other ID type</label>
                <input :id="`id-description-${index}`" v-model="item.description" placeholder="Document type" maxlength="100" required :aria-invalid="!!errors.documents && !item.description.trim()" :aria-describedby="errors.documents ? `id-description-help-${index} documents-error` : `id-description-help-${index}`" />
                <p :id="`id-description-help-${index}`" class="help">Enter the type only, without document details.</p>
              </div>
              <label class="checkbox-row" :class="{ 'is-sighted': item.sighted, 'is-invalid': errors.documents && !item.sighted }" :for="`sighted-${index}`">
                <input :id="`sighted-${index}`" v-model="item.sighted" type="checkbox" required :aria-invalid="!!errors.documents && !item.sighted" :aria-describedby="errors.documents ? 'documents-error' : undefined" />
                <span>I have sighted this ID</span>
                <Check v-if="item.sighted" class="sighted-mark" :size="16" aria-hidden="true" />
              </label>
            </div>
            <p v-if="errors.documents" id="documents-error" class="field-error">{{ errors.documents }}</p>
            <button v-if="form.documents.length === 1" id="add-id" type="button" class="add-document" @click="addSecondDocument"><Plus :size="17" aria-hidden="true" /><span>Add a second ID <span class="optional-label">Optional</span></span></button>
          </fieldset>
        </fieldset>
        <div class="form-actions">
          <p v-if="attempted && !busy" class="recovery-note">Your save could not be confirmed. Retry to recover the same record.</p>
          <div class="submit-row">
            <p class="submit-explanation"><FileText :size="18" aria-hidden="true" /><span>Creates an admin record<br />and emails a PDF copy.</span></p>
            <button type="submit" class="primary" :disabled="!!busy"><Loader2 v-if="busy" class="animate-spin" :size="18" aria-hidden="true" /><Mail v-else :size="18" aria-hidden="true" /> {{ busy ? 'Saving & emailing…' : attempted ? 'Retry saving record' : 'Save & email PDF' }}<ArrowRight v-if="!busy" :size="17" aria-hidden="true" /></button>
          </div>
        </div>
      </form>
      <div v-if="error" ref="errorEl" tabindex="-1" role="alert" class="service-error"><AlertCircle :size="20" aria-hidden="true" /><p>{{ error }}</p></div>
      <p class="supporting-note">Supporting record for RTA Form 22b or Form R22b. It does not replace either application form.</p>
    </div>
  </LayoutComponent>
</template>

<script setup>
import { ref, reactive, computed, nextTick, watch } from 'vue'
import { ArrowRight, Plus, X, Check, Mail, Download, Loader2, CheckCircle2, ContactRound, ShieldCheck, FileText, AlertCircle } from '@lucide/vue'
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
async function addSecondDocument() {
  form.documents.push(emptyDocument())
  await nextTick()
  document.getElementById('id-type-1')?.focus()
}
async function removeSecondDocument() {
  form.documents.pop()
  await nextTick()
  document.getElementById('add-id')?.focus()
}
</script>

<style scoped>
.sighting-page { --sighting-line: #526b7e; --sighting-muted: #c0cdda; }
:deep(header.fixed) { position: sticky; }
.sighting-workspace { width: min(100%, 1120px); margin: 0 auto; padding: 36px 24px 40px; color: #e8eff5; }
.page-heading { display: flex; align-items: center; gap: 17px; margin-bottom: 25px; }
.title-icon { width: 50px; height: 50px; display: grid; place-items: center; flex: 0 0 auto; border: 1px solid #57998e; border-radius: 13px; color: #a5e7d8; background: #244b4c; }
.eyebrow { margin: 0 0 5px; color: var(--sighting-muted); font-size: .75rem; line-height: 1.5; font-weight: 500; letter-spacing: .035em; }
h1 { margin: 0; color: #f5f8fa; font-size: 2rem; line-height: 1.2; font-weight: 600; letter-spacing: -.035em; overflow-wrap: anywhere; }
.page-description { margin: 8px 0 0; font-size: .9375rem; line-height: 1.5; color: var(--sighting-muted); }
.record-sheet { background: #2b4052; color: #e8eff5; border: 1px solid var(--sighting-line); border-radius: 16px; overflow: hidden; }
.form-intro { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px 16px; padding: 16px 28px; border-bottom: 1px solid var(--sighting-line); font-size: .75rem; line-height: 1.5; color: var(--sighting-muted); }
.form-intro > span:first-child { color: #e8eff5; font-weight: 600; }
.form-fields { min-width: 0; border: 0; padding: 0 28px; }
.form-section { min-width: 0; width: 100%; margin: 0; padding: 23px 0 24px; border: 0; }
.form-section + .form-section { border-top: 1px solid var(--sighting-line); }
.section-title { float: left; width: 100%; display: flex; align-items: center; gap: 12px; padding: 0; margin: 0 0 17px; color: #f1f5f9; font-family: var(--font-body); font-size: 1rem; line-height: 1.5; font-weight: 600; }
.section-title > span { color: #7bcdbf; font-size: .75rem; font-weight: 500; font-variant-numeric: tabular-nums; }
.section-title + * { clear: both; }
.field-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 18px; }
.person-grid { grid-template-columns: minmax(0,1fr) 240px; }
.field { min-width: 0; }
label { display: block; font-size: .875rem; line-height: 1.5; font-weight: 500; color: #dce7ef; }
input:not([type=checkbox]), select { display: block; width: 100%; min-width: 0; min-height: 48px; margin-top: 7px; padding: 11px 13px; border: 1px solid #90a5b6; border-radius: 8px; background: #203344; color: #f1f5f9; font-family: inherit; font-size: 1rem; line-height: 1.5; color-scheme: dark; scroll-margin-top: 6rem; transition: border-color 120ms, background-color 120ms; }
input::placeholder { color: #b0bfcc; opacity: 1; }
input:not([type=checkbox]):hover, select:hover { border-color: #bacbd8; }
input:not([type=checkbox]):focus, select:focus { border-color: #9bdfcf; background: #29465a; }
input[aria-invalid=true], select[aria-invalid=true] { border-color: #fb8d9f; }
.help { margin-top: 7px; color: var(--sighting-muted); font-size: .8125rem; line-height: 1.5; }
.field-error { margin-top: 8px; color: #ffafbc; font-size: .8125rem; line-height: 1.5; }
.document-guidance { display: flex; align-items: center; gap: 8px; margin: -2px 0 17px; color: var(--sighting-muted); font-size: .8125rem; line-height: 1.5; }
.document-guidance svg { flex-shrink: 0; color: #7bcdbf; }
.document-entry { padding: 16px; border: 1px solid var(--sighting-line); border-radius: 10px; background: #324b5f; }
.document-entry + .document-entry { margin-top: 14px; }
.document-heading { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; min-height: 24px; }
.optional-label { color: var(--sighting-muted); font-weight: 400; font-size: .75rem; margin-left: 7px; }
.other-id-field { margin-top: 16px; }
.checkbox-row { display: flex; align-items: center; gap: 11px; min-height: 48px; margin-top: 13px; padding: 11px 12px; border: 1px solid #90a5b6; border-radius: 7px; background: #263e50; font-weight: 400; cursor: pointer; }
input[type=checkbox] { flex: 0 0 auto; width: 19px; height: 19px; margin: 0; accent-color: #81d9c4; color-scheme: dark; cursor: pointer; }
.checkbox-row.is-sighted { color: #d0f7eb; border-color: #79b9a9; background: #244f49; }
.checkbox-row.is-invalid { border-color: #fb8d9f; }
.sighted-mark { margin-left: auto; flex-shrink: 0; color: #8ee3ce; }
.add-document { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; min-height: 46px; margin-top: 13px; padding: 10px 12px; border: 1px dashed #90a5b6; border-radius: 8px; color: #b5eade; background: transparent; font-size: .875rem; line-height: 1.5; font-weight: 500; cursor: pointer; }
.add-document:hover { background: #34564f; border-color: #9bdfcf; }
.remove { display: flex; align-items: center; gap: 5px; min-height: 44px; padding: 0 5px; margin-block: -10px; color: #c2cfdc; background: transparent; font-size: .75rem; cursor: pointer; }
.remove:hover { color: #ffafbc; }
.form-actions { border-top: 1px solid var(--sighting-line); padding: 22px 28px; background: #304759; }
.submit-row { display: flex; align-items: center; justify-content: space-between; gap: 18px; }
.submit-explanation { display: flex; align-items: center; gap: 10px; color: var(--sighting-muted); font-size: .8125rem; line-height: 1.5; }
.submit-explanation svg { flex-shrink: 0; color: #7bcdbf; }
.primary, .secondary { display: inline-flex; align-items: center; justify-content: center; gap: 9px; max-width: 100%; min-height: 48px; padding: 12px 18px; border: 1px solid transparent; border-radius: 8px; font-size: .9375rem; line-height: 1.4; font-weight: 600; cursor: pointer; overflow-wrap: anywhere; }
.primary { background: #81d9c4; color: #092d2a; }
.primary:hover { background: #a2e6d5; }
.primary svg, .secondary svg { flex-shrink: 0; }
.secondary { background: transparent; border-color: #90a5b6; color: #dce7ef; }
.secondary:hover { background: #3a5469; }
.recovery-note { margin-bottom: 15px; color: #f3d89e; font-size: .875rem; line-height: 1.5; }
.supporting-note { max-width: 650px; margin: 17px auto 0; color: var(--sighting-muted); font-size: .75rem; line-height: 1.6; text-align: center; }
.service-error { display: flex; align-items: flex-start; gap: 10px; margin-top: 17px; padding: 16px; border: 1px solid #ac6270; border-radius: 10px; background: #38212c; color: #ffd2da; font-size: .875rem; line-height: 1.6; }
.service-error svg { flex-shrink: 0; margin-top: 2px; }
.saved-sheet { padding: 30px; }
.saved-heading { display: flex; align-items: center; gap: 14px; }
.saved-icon { width: 50px; height: 50px; flex-shrink: 0; display: grid; place-items: center; background: #244f49; border: 1px solid #79b9a9; border-radius: 50%; color: #a5e7d8; }
.saved-heading h2 { margin: 0; color: #f1f5f9; font-size: 1.5rem; font-weight: 500; line-height: 1.3; letter-spacing: -.025em; }
#saved-title, .service-error { scroll-margin-top: 6rem; }
.saved-applicant { margin-top: 25px; font-size: 1.125rem; line-height: 1.5; font-weight: 600; overflow-wrap: anywhere; }
.delivery-note { display: flex; gap: 10px; margin-top: 16px; color: #b5eade; font-size: .875rem; line-height: 1.6; }
.delivery-note svg { flex: 0 0 auto; margin-top: 3px; }
.delivery-note p { overflow-wrap: anywhere; min-width: 0; }
.delivery-note strong { font-weight: 500; }
.delivery-warning { padding: 13px; border: 1px solid #8a724a; background: #332d21; color: #f3d89e; border-radius: 8px; }
.record-summary { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 20px; margin: 25px 0; padding-block: 23px; border-block: 1px solid var(--sighting-line); font-size: .875rem; line-height: 1.6; }
.record-summary dt { color: var(--sighting-muted); margin-bottom: 5px; font-size: .8125rem; }
.record-summary dd { overflow-wrap: anywhere; }
.summary-documents { grid-column: 1 / -1; }
.summary-documents dd { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.summary-documents svg { flex-shrink: 0; color: #91e4cc; }
.saved-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.saved-footnote { margin-top: 19px; color: var(--sighting-muted); font-size: .8125rem; line-height: 1.6; }
:is(button, input, select, a, [tabindex]):focus-visible { outline: 2px solid #a2e6d5; outline-offset: 4px; }
button:disabled { opacity: .65; cursor: wait; }
.form-fields:disabled { opacity: .65; }
@media (max-width: 639px) {
  .sighting-workspace { padding: 24px 16px; }
  .page-heading { gap: 13px; margin-bottom: 22px; align-items: flex-start; }
  .title-icon { width: 40px; height: 40px; border-radius: 10px; margin-top: 24px; }
  h1 { font-size: 1.625rem; line-height: 1.25; }
  .page-description { margin-top: 7px; font-size: .875rem; }
  .form-intro { padding: 14px 19px; font-size: .75rem; }
  .form-fields { padding: 0 19px; }
  .form-section { padding: 21px 0; }
  .field-grid { grid-template-columns: minmax(0,1fr); gap: 17px; }
  .section-title { margin-bottom: 15px; }
  .document-guidance { align-items: flex-start; font-size: .8125rem; }
  .document-guidance svg { margin-top: 2px; }
  .document-entry { padding: 13px; }
  .form-actions { padding: 18px 19px; }
  .submit-row { flex-direction: column; align-items: stretch; gap: 16px; }
  .submit-explanation { font-size: .8125rem; }
  .primary { width: 100%; min-height: 50px; }
  .record-sheet { border-radius: 13px; }
  .saved-sheet { padding: 22px 19px; }
  .saved-actions .secondary { flex: 1; }
  .saved-heading h2 { font-size: 1.375rem; }
  .record-summary { gap: 18px; }
  .supporting-note { text-align: left; }
}
@media (max-width: 359px) { .sighting-workspace { padding-inline: 12px; } .title-icon { display: none; } .form-intro { padding-inline: 16px; } .form-fields { padding-inline: 16px; } .optional-label { display: block; margin-left: 0; } .record-summary { grid-template-columns: minmax(0,1fr); } }
@media (prefers-reduced-motion: reduce) { .animate-spin { animation: none; } }
</style>
