<!-- src/features/everhomes/views/tools/ReportPage.vue -->

<!--
  Thin orchestrator. Reads `reportType` from the route params, imports the
  matching schema, initialises useReportState, and renders the page.

  Adding a new report type = new schema file + new route. Zero changes here.

  The page has two visual zones:
    1. Setup header + ReportSetup card  — always visible
    2. Checklist zone                   — empty state until checklist is started,
                                          then SectionAccordion + marketing panel

  Cleanup confirm, submit modal, and online/offline are all handled by child
  components — this file stays under 150 lines.
-->

<template>
  <LayoutComponent :header="true" :footer="true">

    <!-- ── Top bar ─────────────────────────────────────────────────── -->
    <div class="bg-slate-900 border-b border-slate-800">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 h-10 flex items-center gap-3">
        <span class="text-xs font-black tracking-wider uppercase" :class="accentClass">Everhomes</span>
        <span class="text-slate-700">|</span>
        <span class="text-xs font-semibold text-slate-400">{{ schema.topBarLabel }}</span>
      </div>
    </div>

    <div v-if="reportState.resumeRequested" class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="rounded-2xl border border-slate-600 bg-slate-900 px-5 py-8" :aria-busy="reportState.draftSync.status === 'restoring'">
        <div role="status" aria-live="polite" aria-atomic="true">
          <h1 class="flex items-center gap-3 text-xl font-bold text-white">
            <LoaderCircle v-if="reportState.draftSync.status === 'restoring'" aria-hidden="true" class="h-6 w-6 shrink-0 animate-spin motion-reduce:animate-none" />
            {{ reportState.draftSync.status === 'restoring' ? 'Restoring your saved report…' : 'Could not restore this report' }}
          </h1>
          <p class="mt-3 text-sm leading-6 text-slate-300">{{ reportState.draftSync.status === 'restoring' ? 'Loading your checklist, answers and saved photos. Please wait before making changes.' : reportState.draftSync.restoreError }}</p>
        </div>
        <div v-if="reportState.draftSync.status !== 'restoring'" class="mt-5 flex flex-wrap gap-3">
          <button type="button" @click="reportState.restoreDraftFromLocation()" class="rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white hover:bg-teal-500">Try restoring again</button>
          <button type="button" @click="reportState.useLocalDraft()" class="rounded-xl border border-slate-500 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-slate-800">{{ reportState.hasChecklistStarted ? 'Use draft on this device' : 'Start a new report' }}</button>
        </div>
        <p v-if="reportState.draftSync.status !== 'restoring'" class="mt-3 text-xs leading-5 text-slate-400">Your existing draft on this device has been kept.</p>
      </div>
    </div>

    <template v-else>
      <!-- ── Setup hero + card ────────────────────────────────────────── -->
      <div>
        <div
          class="px-4 sm:px-6 lg:px-8 pt-8 pb-10"
          :class="heroBgClass"
        >
          <div class="max-w-4xl mx-auto">
            <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              {{ schema.title }}
            </h1>
            <p class="text-sm mt-1 font-medium" :class="heroSubtitleClass">
              {{ schema.subtitle }}
            </p>
          </div>
        </div>

        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 pb-8">
          <ReportSetup
            :schema="schema"
            :reportState="reportState"
            @started="onStarted"
          />
        </div>
      </div>

      <!-- ── Checklist zone ───────────────────────────────────────────── -->
      <div data-checklist class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        <!-- Empty state -->
        <div
          v-if="!reportState.hasChecklistStarted"
          class="flex flex-col items-center gap-3 py-16 text-center"
        >
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center" :class="emptyIconBgClass">
            <ClipboardCheck class="w-7 h-7" :class="emptyIconClass" />
          </div>
          <p class="text-sm font-semibold text-slate-400">
            Configure your {{ schema.title.toLowerCase() }} above<br />
            <span class="text-slate-500 font-normal">then hit Start.</span>
          </p>
        </div>

        <!-- Active checklist -->
        <template v-else>
          <DraftRecoveryPanel :reportState="reportState" />

          <SectionAccordion
            ref="accordionRef"
            :reportState="reportState"
            :schema="schema"
            @open-submit="openSubmit"
            @clear="clearConfirm.open = true"
            @go-to="goToIssue"
          />

          <!-- Marketing photos -->
          <div v-if="showMarketing" id="report-marketing" tabindex="-1" class="scroll-mt-24 focus-visible:outline-2 focus-visible:outline-rose-300">
            <MarketingPhotoPanel :schema="schema" :reportState="reportState" />
          </div>
        </template>
      </div>
    </template>

    <!-- ── Submit modal ─────────────────────────────────────────────── -->
    <SubmitModal
      :open="submitModal.open"
      :schema="schema"
      :reportState="reportState"
      @close="submitModal.open = false"
      @submitted="onSubmitted"
      @go-to="goToIssue"
    />

    <ErrorLogModal
      :open="reportState.fatalError.open"
      :message="reportState.fatalError.message"
      :logs="reportState.fatalError.logs"
      @close="reportState.closeFatalError()"
    />

    <!-- ── Clear confirm ────────────────────────────────────────────── -->
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
          v-if="clearConfirm.open"
          class="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="!clearConfirm.loading && (clearConfirm.open = false)" />
          <div :aria-busy="clearConfirm.loading" class="relative z-10 w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
            <h3 class="text-white font-black text-base mb-1">Clear Checklist?</h3>
            <p class="text-slate-400 text-sm mb-5">
              This removes the local report, recovery backup, and uploaded draft photos. This cannot be undone.
            </p>
            <div class="flex gap-3">
              <button
                @click="clearConfirm.open = false"
                :disabled="clearConfirm.loading"
                class="flex-1 py-2.5 rounded-xl border-2 border-slate-700 text-slate-400 text-sm font-bold transition-colors hover:border-slate-600"
              >Cancel</button>
              <button
                @click="doClear"
                :disabled="clearConfirm.loading"
                class="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-black transition-colors"
              >{{ clearConfirm.loading ? 'Clearing…' : 'Clear All' }}</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </LayoutComponent>
</template>

<script setup>
import { computed, reactive, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ClipboardCheck, LoaderCircle } from '@lucide/vue'

import LayoutComponent     from '@/features/everhomes/components/layouts/LayoutComponent.vue'
import ReportSetup         from '@/features/everhomes/components/ReportSetup.vue'
import SectionAccordion    from '@/features/everhomes/components/SectionAccordion.vue'
import MarketingPhotoPanel from '@/features/everhomes/components/MarketingPhotoPanel.vue'
import SubmitModal         from '@/features/everhomes/components/SubmitModal.vue'
import ErrorLogModal       from '@/features/everhomes/components/ErrorLogModal.vue'
import DraftRecoveryPanel from '@/features/everhomes/components/DraftRecoveryPanel.vue'

import { useReportState }  from '@/features/everhomes/composables/useReportState'
import { trackEverhomesToolUsage } from '@/features/everhomes/utils/toolUsage'

// ─── Schema registry ──────────────────────────────────────────────────────────
// Each report type maps to a schema file. Adding a new type = add an entry here
// and create the schema file. Zero changes to this component's template.
import handoverSchema   from '@/features/everhomes/schemas/handover.js'
import inspectionSchema from '@/features/everhomes/schemas/inspection.js'

const SCHEMAS = {
  handover:   handoverSchema,
  inspection: inspectionSchema,
}

// ─── Route-driven schema resolution ───────────────────────────────────────────
const route = useRoute()

// Fallback to inspection if the reportType param is unknown.
const schema = computed(() => {
  const type = route.params.reportType
  return SCHEMAS[type] ?? SCHEMAS.inspection
})

// ─── Composable ───────────────────────────────────────────────────────────────
// App.vue keys route views by fullPath, so changing report type remounts this
// page with the matching isolated report store.
// In practice a user navigates away and back, so the composable is always fresh.
const reportState = useReportState(schema.value)

// ─── Local UI state ───────────────────────────────────────────────────────────
const submitModal = reactive({ open: false })
const clearConfirm = reactive({ open: false, loading: false })
const accordionRef = ref(null)

function openSubmit() {
  reportState.validationVisible = true
  submitModal.open = true
}

async function goToIssue(issue) {
  submitModal.open = false
  reportState.validationVisible = true
  if (issue.kind === 'marketing') reportState.setup.showMarketing = true
  await nextTick()
  if (issue.kind === 'marketing') {
    const target = document.getElementById('report-marketing')
    target?.focus({ preventScroll: true })
    target?.scrollIntoView({ behavior: 'instant', block: 'center' })
  } else {
    await accordionRef.value?.revealIssue(issue)
  }
}

// ─── Marketing panel visibility ───────────────────────────────────────────────
// Shown when the schema has marketing slots AND either:
//   - optional: false — always on
//   - optional: true  — user toggled it on in setup
const showMarketing = computed(() => {
  const cfg = schema.value.marketingPhotos
  if (!cfg?.slots?.length) return false
  if (!cfg.optional) return true
  return reportState.setup.showMarketing
})

// ─── Events ───────────────────────────────────────────────────────────────────
function onStarted() {
  void trackEverhomesToolUsage({
    toolId: schema.value.reportType === 'handover' ? 'handover-report' : 'inspection-report',
    action: 'report_started',
  })
  // Scroll checklist into view after the DOM updates
  nextTick(() => {
    setTimeout(() => {
      document.querySelector('[data-checklist]')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  })
}

function onSubmitted() {
  void trackEverhomesToolUsage({
    toolId: schema.value.reportType === 'handover' ? 'handover-report' : 'inspection-report',
    action: 'report_submitted',
  })
  // Store plugin will persist the now-empty state automatically.
  // The modal stays open in Done state — SubmitModal handles close from there.
  reportState.discardLocalReport().catch(() => reportState.resetAll())
}

async function doClear() {
  if (clearConfirm.loading) return
  clearConfirm.loading = true
  try {
    await reportState.clearReport()
    clearConfirm.open = false
  } catch (error) {
    reportState.openFatalError({
      title: 'Could not clear report',
      message: error.message ?? 'The report could not be cleared safely.',
    })
  } finally {
    clearConfirm.loading = false
  }
}

// ─── Theme — derived from schema, no reportType conditionals ──────────────────
// Handover uses teal, inspection uses violet.
// Driven by pickerMode since that's the most reliable schema signal.
const isHandover = computed(() => schema.value.pickerMode === 'sdaCategory')

const accentClass       = computed(() => isHandover.value ? 'text-teal-400'   : 'text-violet-400')
const heroBgClass       = computed(() => isHandover.value
  ? 'bg-gradient-to-r from-teal-700 to-emerald-600'
  : 'bg-gradient-to-r from-violet-700 to-fuchsia-600'
)
const heroSubtitleClass = computed(() => isHandover.value ? 'text-teal-200'   : 'text-violet-200')
const emptyIconBgClass  = computed(() => isHandover.value
  ? 'bg-teal-500/10 border border-teal-500/20'
  : 'bg-violet-500/10 border border-violet-500/20'
)
const emptyIconClass    = computed(() => isHandover.value ? 'text-teal-400'   : 'text-violet-400')
</script>
