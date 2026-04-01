<!-- src/features/everhomes/components/SubmitModal.vue -->

<!--
  Full submit flow modal. Handles:
    - Pre-submit summary (stats, flagged sections, uploading gate, sig pad)
    - Loading state (spinner + Firestore listener status)
    - Done state (PDF link)
    - Error state (message + retry)

  Bug 3 fix: the signature pad is NEVER destroyed when entering error state.
  The pre-submit form stays mounted at all times — loading/done/error states
  are layered on top of it via v-if inside the same container. When the user
  dismisses an error and clicks "Try Again", canSubmit is still true because
  the sig pad ref was never torn down.

  Props:
    open        — bool
    schema      — full report schema
    reportState — useReportState() return value

  Emits:
    close       — parent clears the modal
    submitted   — report submitted successfully, parent can clear cache etc.
-->

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
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black/70 backdrop-blur-sm"
          @click="!state.loading && !state.done && close()"
        />

        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        >
          <div
            v-if="open"
            class="relative z-10 w-full sm:w-[500px] bg-slate-900 border border-slate-700 sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90dvh] overflow-y-auto"
          >

            <!-- ══ Loading overlay ══════════════════════════════════════════ -->
            <div
              v-if="state.loading"
              class="flex flex-col items-center gap-5 px-6 py-12 text-center"
            >
              <div class="w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
                <div class="w-8 h-8 rounded-full border-4 border-teal-500/30 border-t-teal-500 animate-spin" />
              </div>
              <div>
                <h3 class="text-white font-black text-lg">{{ state.statusMessage }}</h3>
                <p class="text-slate-400 text-sm mt-1">This takes around 30–60 seconds. Don't close this page.</p>
              </div>
              <button
                v-if="state.canFlush"
                @click="flushAndCheck"
                class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-sm transition-colors"
              >
                <RefreshCw class="w-4 h-4" />Check Status
              </button>
            </div>

            <!-- ══ Done ════════════════════════════════════════════════════ -->
            <div
              v-else-if="state.done"
              class="flex flex-col items-center gap-4 px-6 py-10 text-center"
            >
              <div class="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle class="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 class="text-white font-black text-lg">{{ schema.title }} Submitted</h3>
                <p class="text-slate-400 text-sm mt-1">
                  Report emailed to admin{{ reportState.setup.inspectorEmail ? ` and ${reportState.setup.inspectorEmail}` : '' }}.
                </p>
              </div>
              <a
                v-if="state.pdfUrl"
                :href="state.pdfUrl"
                target="_blank"
                class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition-colors"
              >
                <FileText class="w-4 h-4" />View PDF Report
              </a>
              <button
                @click="close"
                class="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-colors"
              >
                Close
              </button>
            </div>

            <!-- ══ Error banner + form (bug 3 fix: form stays mounted) ═════ -->
            <!-- Error is shown as a banner above the form, not a replacement. -->
            <!-- The sig pad ref persists so canSubmit stays true on retry.   -->
            <template v-else>

              <!-- Error banner -->
              <div v-if="state.error" class="px-6 pt-6">
                <div class="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/25 rounded-xl mb-4">
                  <XCircle class="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div class="flex-1 min-w-0">
                    <p class="text-white font-bold text-sm">Submission Failed</p>
                    <p class="text-rose-300 text-xs mt-0.5 leading-relaxed">{{ state.error }}</p>
                  </div>
                  <button
                    @click="state.error = null"
                    class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-rose-500/20 transition-colors shrink-0"
                  >
                    <X class="w-3.5 h-3.5 text-rose-400" />
                  </button>
                </div>
              </div>

              <!-- Pre-submit form header -->
              <div class="px-5 pt-5 pb-0 flex items-start justify-between">
                <div>
                  <h3 class="text-white font-black text-base">Submit {{ schema.title }}</h3>
                  <p class="text-slate-400 text-xs mt-0.5">
                    {{ reportState.setup.propertyAddress || 'Address not set' }} · {{ formatDate(reportState.setup.inspectionDate) }}
                  </p>
                </div>
                <button
                  @click="close"
                  class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors shrink-0"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>

              <!-- Stats grid -->
              <div class="grid grid-cols-4 gap-2 px-5 pt-4">
                <div
                  v-for="stat in reportState.submitStats"
                  :key="stat.label"
                  class="flex flex-col items-center gap-1 py-3 rounded-xl border"
                  :style="{ borderColor: stat.color + '40', background: stat.color + '0D' }"
                >
                  <span class="text-lg font-black" :style="{ color: stat.color }">{{ stat.count }}</span>
                  <span class="text-[0.6rem] font-bold text-slate-500 text-center leading-tight">{{ stat.label }}</span>
                </div>
              </div>

              <!-- Flagged sections -->
              <div v-if="reportState.flaggedSections.length" class="px-5 pt-4">
                <p class="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest mb-2">Flagged Sections</p>
                <div class="space-y-1.5">
                  <div
                    v-for="sec in reportState.flaggedSections"
                    :key="sec.id"
                    class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border"
                    :style="flaggedStyle(sec.status)"
                  >
                    <div
                      class="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                      :style="{ background: sec.meta?.gradient ?? 'linear-gradient(135deg,#0D9488,#2DD4BF)' }"
                    >
                      <component :is="sec.meta?.icon ?? ClipboardCheck" class="w-3.5 h-3.5" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-white text-xs font-bold leading-tight truncate">{{ sec.label }}</p>
                      <p class="text-xs mt-0.5" :style="{ color: reportState.statusColour(sec.status) }">
                        {{ reportState.statusLabel(sec.status) }}
                      </p>
                    </div>
                    <component
                      :is="sec.status === 'issue' ? XCircle : AlertTriangle"
                      class="w-4 h-4 shrink-0"
                      :style="{ color: reportState.statusColour(sec.status) }"
                    />
                  </div>
                </div>
              </div>

              <!-- Uploading gate warning -->
              <div
                v-if="reportState.hasAnyUploading"
                class="mx-5 mt-4 flex items-center gap-2.5 px-3.5 py-3 bg-teal-500/10 border border-teal-500/25 rounded-xl"
              >
                <div class="w-3.5 h-3.5 rounded-full border-2 border-teal-400/30 border-t-teal-400 animate-spin shrink-0" />
                <p class="text-xs text-teal-300 font-semibold">
                  Some photos are still uploading — please wait before submitting.
                </p>
              </div>

              <!-- Unchecked sections warning -->
              <div
                v-if="reportState.completedCount < reportState.checklistSections.length"
                class="mx-5 mt-4 flex items-center gap-2.5 px-3.5 py-3 bg-amber-500/10 border border-amber-500/25 rounded-xl"
              >
                <AlertTriangle class="w-4 h-4 text-amber-400 shrink-0" />
                <p class="text-xs text-amber-300 font-semibold">
                  {{ reportState.checklistSections.length - reportState.completedCount }}
                  section{{ reportState.checklistSections.length - reportState.completedCount !== 1 ? 's' : '' }}
                  still unchecked — you can still submit.
                </p>
              </div>

              <!-- ── Signature ──────────────────────────────────────────── -->
              <div class="mx-5 mt-5 border border-slate-700 rounded-xl overflow-hidden">
                <div class="bg-slate-800/50 px-4 py-3 border-b border-slate-700">
                  <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Staff Signature</p>
                </div>
                <div class="px-4 py-4 space-y-3">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-400">{{ reportState.setup.inspectorName || 'Staff name not set' }}</span>
                    <span class="text-slate-500">{{ formatDate(reportState.setup.inspectionDate) }}</span>
                  </div>
                  <div class="relative bg-white rounded-xl overflow-hidden" style="touch-action: none">
                    <canvas
                      ref="staffSigCanvasRef"
                      class="w-full"
                      style="height: 140px"
                    />
                    <button
                      @click="clearSignature"
                      class="absolute top-2 right-2 px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 text-[10px] font-bold transition-colors"
                    >Clear</button>
                  </div>
                  <label class="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      v-model="signatureState.agreementChecked"
                      class="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500 focus:ring-offset-0 shrink-0"
                    />
                    <span class="text-[0.65rem] text-slate-400 leading-relaxed">
                      I, <span class="font-bold text-white">{{ reportState.setup.inspectorName || '___' }}</span>,
                      confirm that this {{ schema.title.toLowerCase() }} was completed on
                      <span class="font-bold text-white">{{ formatDate(reportState.setup.inspectionDate) || '___' }}</span>
                      and that the information recorded is accurate to the best of my knowledge.
                    </span>
                  </label>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex gap-3 px-5 py-5">
                <button
                  @click="close"
                  class="flex-1 py-2.5 rounded-xl border-2 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-bold transition-colors"
                >Back</button>
                <button
                  @click="confirmSubmit"
                  :disabled="reportState.hasAnyUploading || !canSubmit"
                  class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-black transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Send class="w-4 h-4" />{{ state.error ? 'Try Again' : 'Confirm & Submit' }}
                </button>
              </div>

            </template>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onUnmounted } from 'vue'
import {
  CheckCircle, AlertTriangle, XCircle, RefreshCw,
  FileText, Send, X, ClipboardCheck,
} from 'lucide-vue-next'
import SignaturePad from 'signature_pad'
import {
  doc, setDoc, getDoc, onSnapshot, serverTimestamp,
} from 'firebase/firestore'
import { firestore } from '@/firebase'

const FUNCTIONS_URL    = import.meta.env.VITE_FUNCTIONS_URL ?? ''
const SUBMIT_TIMEOUT_MS = 120_000

const props = defineProps({
  open:        { type: Boolean, required: true },
  schema:      { type: Object,  required: true },
  reportState: { type: Object,  required: true },
})

const emit = defineEmits(['close', 'submitted'])

// ─── Submit state ─────────────────────────────────────────────────────────────
const state = reactive({
  loading:       false,
  done:          false,
  error:         null,
  statusMessage: 'Generating report…',
  pdfUrl:        null,
  canFlush:      false,
})

// ─── Signature pad ────────────────────────────────────────────────────────────
const staffSigCanvasRef = ref(null)
let staffSigPad         = null

const signatureState = reactive({
  staffSigned:      false,
  agreementChecked: false,
})

// Bug 3 fix: init the sig pad when the pre-submit form becomes visible.
// We init on open (when not in loading/done state) and NEVER destroy it on
// error — the form stays mounted so the pad ref is preserved across retries.
watch(() => props.open, async (isOpen) => {
  if (isOpen && !state.loading && !state.done) {
    await nextTick()
    setTimeout(initSigPad, 100)
  }
  if (!isOpen) {
    destroySigPad()
    resetState()
  }
})

// Also init after error is dismissed (user clicks X on error banner) —
// the pad is already mounted so this is a no-op if already inited.
watch(() => state.error, (err) => {
  if (!err && props.open && !state.loading && !state.done) {
    nextTick(() => setTimeout(initSigPad, 50))
  }
})

function initSigPad() {
  if (!staffSigCanvasRef.value || staffSigPad) return
  const canvas = staffSigCanvasRef.value
  resizeCanvas(canvas)
  staffSigPad = new SignaturePad(canvas, {
    penColor:        '#1E293B',
    backgroundColor: 'rgba(255,255,255,0)',
  })
  staffSigPad.addEventListener('endStroke', () => {
    signatureState.staffSigned = !staffSigPad.isEmpty()
  })
}

function destroySigPad() {
  staffSigPad?.off()
  staffSigPad = null
  signatureState.staffSigned      = false
  signatureState.agreementChecked = false
}

function resizeCanvas(canvas) {
  const ratio = Math.max(window.devicePixelRatio ?? 1, 1)
  const rect  = canvas.getBoundingClientRect()
  canvas.width  = rect.width  * ratio
  canvas.height = rect.height * ratio
  canvas.getContext('2d').scale(ratio, ratio)
}

function clearSignature() {
  staffSigPad?.clear()
  signatureState.staffSigned = false
}

const canSubmit = computed(() =>
  signatureState.staffSigned && signatureState.agreementChecked
)

function cropSignatureData(pad) {
  if (!pad || pad.isEmpty()) return null
  const canvas = pad.canvas
  const ctx    = canvas.getContext('2d')
  const { width, height } = canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  const { data }  = imageData

  let minX = width, minY = height, maxX = 0, maxY = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 10) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX <= minX || maxY <= minY) return pad.toDataURL('image/png')

  const pad4 = Math.round(Math.max(width, height) * 0.04)
  const cropX = Math.max(0, minX - pad4)
  const cropY = Math.max(0, minY - pad4)
  const cropW = Math.min(width  - cropX, maxX - minX + pad4 * 2)
  const cropH = Math.min(height - cropY, maxY - minY + pad4 * 2)

  const cropped = document.createElement('canvas')
  cropped.width  = cropW
  cropped.height = cropH
  cropped.getContext('2d').drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH)
  return cropped.toDataURL('image/png')
}

// ─── Firestore listener + timeout ─────────────────────────────────────────────
let firestoreUnsub  = null
let submitTimeoutId = null

function startTimeout() {
  clearTimeout(submitTimeoutId)
  submitTimeoutId = setTimeout(() => {
    state.canFlush      = true
    state.statusMessage = 'This is taking longer than expected.'
  }, SUBMIT_TIMEOUT_MS)
}

function clearTimeouts() {
  clearTimeout(submitTimeoutId)
  submitTimeoutId = null
}

// ─── Submit ───────────────────────────────────────────────────────────────────
async function confirmSubmit() {
  if (props.reportState.hasAnyUploading || !canSubmit.value) return

  if (!navigator.onLine) {
    state.error = 'You appear to be offline. Please check your internet connection and try again.'
    return
  }

  state.loading       = true
  state.error         = null
  state.canFlush      = false
  state.statusMessage = 'Generating report…'

  // Ensure we have a report ID
  if (!props.reportState.setup.reportId) {
    props.reportState.setup.reportId = crypto.randomUUID()
  }
  const id = props.reportState.setup.reportId

  const docRef = doc(firestore, `${props.schema.reportType}s`, id)

  try {
    await setDoc(docRef, {
      status:          'pending',
      propertyAddress: props.reportState.setup.propertyAddress,
      inspectionDate:  props.reportState.setup.inspectionDate,
      inspectorName:   props.reportState.setup.inspectorName,
      inspectorEmail:  props.reportState.setup.inspectorEmail,
      createdAt:       serverTimestamp(),
    })
  } catch (err) {
    const isPermDenied = err?.code === 'permission-denied' || err?.message?.includes('PERMISSION_DENIED')
    if (!isPermDenied) {
      state.loading = false
      state.error   = `Failed to create report record: ${err.message}`
      return
    }
  }

  // Listen for status updates
  if (firestoreUnsub) firestoreUnsub()
  firestoreUnsub = onSnapshot(docRef, { includeMetadataChanges: true }, (snap) => {
    const data = snap.data()
    if (!data) return
    if (snap.metadata.fromCache && data.status === 'pending') return

    if (data.status === 'processing') {
      state.statusMessage = 'Building PDF and packaging photos…'
      clearTimeouts()
      startTimeout()
    } else if (data.status === 'complete') {
      clearTimeouts()
      firestoreUnsub?.()
      state.loading = false
      state.done    = true
      state.pdfUrl  = data.pdfUrl ?? null
      emit('submitted')
    } else if (data.status === 'failed') {
      clearTimeouts()
      firestoreUnsub?.()
      state.loading = false
      state.error   = data.error ?? 'Report generation failed. Please try again.'
    }
  })

  startTimeout()

  // Build and send payload
  const sigData  = cropSignatureData(staffSigPad)
  const payload  = props.reportState.buildSubmitPayload(sigData)

  // Upload staff signature to storage
  if (sigData) {
    try {
      const { uploadBytes, getDownloadURL, ref: storageRef } = await import('firebase/storage')
      const { storage } = await import('@/firebase')
      const sigBlob = await (await fetch(sigData)).blob()
      const sigFile = new File([sigBlob], 'staff_signature.png', { type: 'image/png' })
      const sigPath = `${props.schema.reportType}s/${id}/signatures/staff_signature.png`
      const sigRef  = storageRef(storage, sigPath)
      await uploadBytes(sigRef, sigFile, { contentType: 'image/png' })
      const sigUrl  = await getDownloadURL(sigRef)
      payload.signatures.staff.signatureUrl         = sigUrl
      payload.signatures.staff.signatureStoragePath = sigPath
    } catch (err) {
      console.warn('Staff signature upload failed:', err.message)
    }
  }

  try {
    const controller   = new AbortController()
    const fetchTimeout = setTimeout(() => controller.abort(), 60_000)

    const response = await fetch(`${FUNCTIONS_URL}/generateInspectionReport`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      signal:  controller.signal,
      body:    JSON.stringify(payload),
    })
    clearTimeout(fetchTimeout)

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.details ?? err.error ?? `HTTP ${response.status}`)
    }
    // Success — Firestore listener handles the rest
  } catch (err) {
    if (err.name === 'AbortError') {
      state.statusMessage = 'The request is taking a while — the report may still be generating.'
    } else {
      state.statusMessage = 'The request may not have reached the server.'
    }
    state.canFlush = true
    // Keep loading: true, keep listener alive — function may still complete
  }
}

// ─── Flush and check ──────────────────────────────────────────────────────────
async function flushAndCheck() {
  state.statusMessage = 'Checking report status…'
  state.canFlush      = false

  try {
    const id    = props.reportState.setup.reportId
    const docRef = doc(firestore, `${props.schema.reportType}s`, id)
    const snap  = await getDoc(docRef)
    const data  = snap.data()

    if (!data) {
      state.loading = false
      state.error   = 'Report record not found on the server. Your data is safe — please try submitting again.'
      props.reportState.setup.reportId = crypto.randomUUID()
      return
    }

    if (data.status === 'complete') {
      clearTimeouts()
      firestoreUnsub?.()
      state.loading = false
      state.done    = true
      state.pdfUrl  = data.pdfUrl ?? null
      emit('submitted')
    } else if (data.status === 'failed') {
      clearTimeouts()
      firestoreUnsub?.()
      state.loading = false
      state.error   = data.error ?? 'Report generation failed. Your data is safe — please try again.'
    } else if (data.status === 'processing') {
      state.statusMessage = 'Report is still being generated. Please wait…'
      startTimeout()
    } else {
      state.loading = false
      state.error   = 'The report request may not have reached the server. Please check your connection and try again.'
      props.reportState.setup.reportId = crypto.randomUUID()
    }
  } catch (err) {
    state.statusMessage = 'Unable to check status. Please check your internet connection.'
    state.canFlush      = true
  }
}

// ─── Close ────────────────────────────────────────────────────────────────────
function close() {
  if (state.loading || state.done) return
  emit('close')
}

function resetState() {
  state.loading       = false
  state.done          = false
  state.error         = null
  state.statusMessage = 'Generating report…'
  state.pdfUrl        = null
  state.canFlush      = false
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function flaggedStyle(status) {
  if (status === 'issue')     return { borderColor: '#F43F5E30', background: '#F43F5E08' }
  if (status === 'attention') return { borderColor: '#F59E0B30', background: '#F59E0B08' }
  return {}
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────
onUnmounted(() => {
  firestoreUnsub?.()
  clearTimeouts()
  destroySigPad()
})
</script>
