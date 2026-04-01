<!-- src/features/everhomes/components/SectionAccordion.vue -->

<!--
  Renders the full checklist accordion — progress bar, section list, and the
  photo modal layer. This is the main checklist view that appears after the
  user completes setup and clicks Start.

  Receives reportState from the parent (ReportPage) and distributes it
  downward to ChecklistSection and PhotoPanel.

  Props:
    reportState — the full useReportState() return value
    schema      — the active report schema (for title, submit button label)

  Emits:
    open-submit  — parent opens the SubmitModal
    clear        — parent handles the clear/reset confirm flow
-->

<template>
  <div>
    <!-- ── Compression notice ──────────────────────────────────────────── -->
    <div class="mb-4 flex items-start gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl">
      <AlertTriangle class="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
      <p class="text-xs text-amber-300/90 font-medium leading-relaxed">
        Section photos are <span class="font-bold text-amber-200">compressed</span> for the report.
        Use the Marketing Photos section at the bottom for uncompressed hero shots.
      </p>
    </div>

    <!-- ── Progress header ────────────────────────────────────────────── -->
    <div class="mb-5">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-base font-black text-white tracking-tight">
          {{ schema.title }}
        </h2>
        <div class="flex items-center gap-2">
          <button
            @click="emit('clear')"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-400 hover:border-rose-500/50 hover:text-rose-400 hover:bg-rose-500/5 text-xs font-bold transition-all"
          >
            <Trash2 class="w-3.5 h-3.5" />Clear
          </button>
          <button
            @click="emit('open-submit')"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md transition-all"
          >
            <Send class="w-3.5 h-3.5" />Submit
          </button>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="h-2 bg-slate-800 rounded-full overflow-hidden mb-1.5">
        <div
          class="h-full rounded-full transition-all duration-700"
          :style="{ width: reportState.progressPercent + '%', background: reportState.progressGradient }"
        />
      </div>
      <div class="flex items-center justify-between">
        <span class="text-xs text-slate-500 font-medium">
          {{ reportState.completedCount }} / {{ reportState.checklistSections.length }} sections done
        </span>
        <span class="flex items-center gap-1 text-[0.65rem] font-semibold text-slate-600">
          <Save class="w-3 h-3" />Auto-saved
        </span>
      </div>
    </div>

    <!-- ── Offline banner (bug 7) ─────────────────────────────────────── -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="!reportState.isOnline"
        class="mb-4 flex items-center gap-2.5 px-4 py-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl"
      >
        <WifiOff class="w-4 h-4 text-rose-400 shrink-0" />
        <p class="text-xs text-rose-300 font-medium">
          You're offline. Photos will resume uploading when your connection returns.
        </p>
      </div>
    </Transition>

    <!-- ── Section accordion ──────────────────────────────────────────── -->
    <div class="space-y-2">
      <div
        v-for="(section, idx) in reportState.checklistSections"
        :key="section.id"
        class="rounded-2xl overflow-hidden border-2 transition-colors duration-300"
        :style="reportState.accordionBorderStyle(section.id)"
      >
        <!-- Accordion header button -->
        <button
          @click="toggleSection(idx)"
          class="w-full flex items-center gap-3 px-4 py-3.5 text-left focus:outline-none transition-colors"
        >
          <!-- Section icon -->
          <div
            class="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-white shadow-sm"
            :style="{ background: section.meta?.gradient ?? 'linear-gradient(135deg,#0D9488,#2DD4BF)' }"
          >
            <component
              :is="section.meta?.icon ?? ClipboardCheck"
              class="w-4 h-4"
            />
          </div>

          <!-- Label + photo count + status -->
          <div class="flex-1 min-w-0">
            <span class="text-white font-bold text-sm leading-tight block truncate">
              {{ section.label }}
            </span>
            <p class="text-xs mt-0.5">
              <span class="text-slate-500">
                {{ reportState.checklistData[section.id]?.photos?.length ?? 0 }}
                photo{{ (reportState.checklistData[section.id]?.photos?.length ?? 0) !== 1 ? 's' : '' }} ·
              </span>
              <span :style="{ color: reportState.statusColour(reportState.checklistData[section.id]?.status) }">
                {{ reportState.statusLabel(reportState.checklistData[section.id]?.status) }}
              </span>
            </p>
          </div>

          <!-- Status dot -->
          <StatusPill :status="reportState.checklistData[section.id]?.status" variant="dot" />

          <!-- Chevron -->
          <ChevronDown
            class="w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200"
            :class="{ 'rotate-180': openSections.has(idx) }"
          />
        </button>

        <!-- Accordion body -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-[2400px]"
          leave-from-class="opacity-100 max-h-[2400px]"
          leave-to-class="opacity-0 max-h-0"
        >
          <ChecklistSection
            v-if="openSections.has(idx) && reportState.checklistData[section.id]"
            :section="section"
            :sectionData="reportState.checklistData[section.id]"
            :groups="reportState.getFilteredGroups(section.id, section.key)"
            :isAllNA="reportState.isSectionAllNA(section.id)"
            :reportState="reportState"
            @open-photo-modal="openPhotoModal(section.id, section.label)"
          />
        </Transition>
      </div>
    </div>

    <!-- ── Bottom submit ───────────────────────────────────────────────── -->
    <div class="mt-6 pt-6 border-t border-slate-700/50">
      <button
        @click="emit('open-submit')"
        class="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-150 flex items-center justify-center gap-2"
      >
        <Send class="w-4 h-4" />{{ schema.submitLabel ?? `Submit ${schema.title}` }}
      </button>
      <p class="text-center text-xs text-slate-600 font-medium mt-2">
        {{
          reportState.completedCount < reportState.checklistSections.length
            ? `${reportState.checklistSections.length - reportState.completedCount} section${reportState.checklistSections.length - reportState.completedCount !== 1 ? 's' : ''} still unchecked`
            : 'All sections reviewed ✓'
        }}
      </p>
    </div>

    <!-- ── Photo modal ─────────────────────────────────────────────────── -->
    <PhotoPanel
      :open="photoModal.open"
      :sectionId="photoModal.sectionId"
      :sectionLabel="photoModal.sectionLabel"
      :reportState="reportState"
      @close="closePhotoModal"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  AlertTriangle, Trash2, Send, Save, ChevronDown,
  WifiOff, ClipboardCheck,
} from 'lucide-vue-next'
import ChecklistSection from './ChecklistSection.vue'
import PhotoPanel       from './PhotoPanel.vue'
import StatusPill       from './StatusPill.vue'

// ─── Props & emits ────────────────────────────────────────────────────────────
const props = defineProps({
  reportState: {
    type: Object,
    required: true,
  },
  schema: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['open-submit', 'clear'])

// ─── Accordion open/close state ───────────────────────────────────────────────
// Set is keyed by section index. First section starts open.
const openSections = ref(new Set([0]))

function toggleSection(idx) {
  const next = new Set(openSections.value)
  next.has(idx) ? next.delete(idx) : next.add(idx)
  openSections.value = next
}

// ─── Photo modal state ────────────────────────────────────────────────────────
const photoModal = reactive({
  open:         false,
  sectionId:    null,
  sectionLabel: '',
})

function openPhotoModal(sectionId, sectionLabel) {
  photoModal.open         = true
  photoModal.sectionId    = sectionId
  photoModal.sectionLabel = sectionLabel
}

function closePhotoModal() {
  photoModal.open         = false
  photoModal.sectionId    = null
  photoModal.sectionLabel = ''
}
</script>
