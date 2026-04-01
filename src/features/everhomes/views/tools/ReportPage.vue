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
        <SectionAccordion
          :reportState="reportState"
          :schema="schema"
          @open-submit="submitModal.open = true"
          @clear="clearConfirm.open = true"
        />

        <!-- Marketing photos -->
        <MarketingPhotoPanel
          v-if="showMarketing"
          :schema="schema"
          :reportState="reportState"
        />
      </template>
    </div>

    <!-- ── Submit modal ─────────────────────────────────────────────── -->
    <SubmitModal
      :open="submitModal.open"
      :schema="schema"
      :reportState="reportState"
      @close="submitModal.open = false"
      @submitted="onSubmitted"
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
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="clearConfirm.open = false" />
          <div class="relative z-10 w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
            <h3 class="text-white font-black text-base mb-1">Clear Checklist?</h3>
            <p class="text-slate-400 text-sm mb-5">
              All review data and photos will be permanently removed. This cannot be undone.
            </p>
            <div class="flex gap-3">
              <button
                @click="clearConfirm.open = false"
                class="flex-1 py-2.5 rounded-xl border-2 border-slate-700 text-slate-400 text-sm font-bold transition-colors hover:border-slate-600"
              >Cancel</button>
              <button
                @click="doClear"
                class="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-black transition-colors"
              >Clear All</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </LayoutComponent>
</template>

<script setup>
import { computed, reactive, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ClipboardCheck } from 'lucide-vue-next'

import LayoutComponent     from '@/features/everhomes/components/layouts/LayoutComponent.vue'
import ReportSetup         from '@/features/everhomes/components/ReportSetup.vue'
import SectionAccordion    from '@/features/everhomes/components/SectionAccordion.vue'
import MarketingPhotoPanel from '@/features/everhomes/components/MarketingPhotoPanel.vue'
import SubmitModal         from '@/features/everhomes/components/SubmitModal.vue'

import { useReportState }  from '@/features/everhomes/composables/useReportState'

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
// useReportState is called with schema.value — since schema is a computed, if
// the route ever changes reportType this will be a new instance automatically.
// In practice a user navigates away and back, so the composable is always fresh.
const reportState = useReportState(schema.value)

// ─── Local UI state ───────────────────────────────────────────────────────────
const submitModal = reactive({ open: false })
const clearConfirm = reactive({ open: false })

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
  // Scroll checklist into view after the DOM updates
  nextTick(() => {
    setTimeout(() => {
      document.querySelector('[data-checklist]')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  })
}

function onSubmitted() {
  // Store plugin will persist the now-empty state automatically.
  // The modal stays open in Done state — SubmitModal handles close from there.
  reportState.resetAll()
}

function doClear() {
  clearConfirm.open = false
  reportState.resetAll()
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
