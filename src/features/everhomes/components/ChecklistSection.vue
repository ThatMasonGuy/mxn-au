<!-- src/features/everhomes/components/ChecklistSection.vue -->

<!--
  Renders the full body of a single checklist section:
    - Overall status display / manual override (when all-NA)
    - Group headers + ChecklistItem per item
    - Notes textarea
    - Photo panel trigger (PhotoPanel is rendered by the parent accordion)

  Receives all data via props and emits all mutations upward — no direct
  store access. The parent (SectionAccordion) wires these to useReportState.

  Props:
    section      — { id, key, label, meta } descriptor
    sectionData  — { status, notes, items, inputs, photos }
    groups       — filtered + visible groups from getFilteredGroups()
    isAllNA      — bool, whether to show manual status override
    reportState  — the full useReportState() return value

  Emits:
    open-photo-modal  (sectionId)
-->

<template>
  <div class="px-4 pb-5 pt-0 bg-slate-900/50 border-t border-slate-700/40 space-y-4">

    <!-- ── Overall Status ──────────────────────────────────────────────── -->
    <div class="pt-4">
      <p class="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest mb-2">
        Overall Status
      </p>

      <!-- All-NA: manual pick required -->
      <template v-if="isAllNA">
        <p class="text-[0.65rem] text-amber-400 font-semibold mb-2">
          All items marked N/A — select an overall status manually:
        </p>
        <div class="flex flex-wrap gap-2">
          <StatusPill
            v-for="opt in STATUS_OPTIONS"
            :key="opt.value"
            :status="opt.value"
            variant="pill"
            class="cursor-pointer"
            :class="sectionData.status === opt.value ? '' : 'opacity-40 hover:opacity-70 transition-opacity'"
            @click="reportState.setSectionStatus(section.id, opt.value)"
          />
        </div>
      </template>

      <!-- Auto-derived from items -->
      <template v-else>
        <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <StatusPill :status="sectionData.status || 'unchecked'" variant="dot" />
          <span
            class="text-sm font-bold"
            :style="{ color: reportState.statusColour(sectionData.status) }"
          >
            {{ reportState.statusLabel(sectionData.status) }}
          </span>
          <span class="text-slate-600 text-xs ml-1">· auto-set from items</span>
        </div>
      </template>
    </div>

    <!-- ── Checklist Items ──────────────────────────────────────────────── -->
    <div v-if="groups.length">
      <!-- Legend -->
      <div class="flex items-center justify-between mb-2.5">
        <p class="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest">
          Review Items
        </p>
        <div class="flex items-center gap-2 flex-wrap justify-end">
          <span class="flex items-center gap-1 text-[0.58rem] font-semibold text-emerald-400">
            <CheckCircle class="w-3 h-3" />OK
          </span>
          <span class="flex items-center gap-1 text-[0.58rem] font-semibold text-amber-400">
            <AlertTriangle class="w-3 h-3" />Attention
          </span>
          <span class="flex items-center gap-1 text-[0.58rem] font-semibold text-rose-400">
            <XCircle class="w-3 h-3" />Issue
          </span>
          <span class="flex items-center gap-1 text-[0.58rem] font-semibold text-slate-500">
            <MinusCircle class="w-3 h-3" />N/A
          </span>
        </div>
      </div>

      <!-- Groups -->
      <div class="space-y-4">
        <div v-for="group in groups" :key="group.group">
          <!-- Group header -->
          <div class="flex items-center gap-2 mb-1.5">
            <span
              v-if="group.sda"
              class="text-[0.55rem] font-black uppercase tracking-wider text-teal-400 bg-teal-500/15 border border-teal-500/25 px-1.5 py-0.5 rounded-full"
            >SDA</span>
            <span class="text-[0.6rem] font-black text-slate-600 uppercase tracking-wider">
              {{ group.group }}
            </span>
          </div>

          <!-- Items -->
          <div class="space-y-0.5">
            <ChecklistItem
              v-for="item in group.items"
              :key="item.id"
              :item="item"
              :sectionId="section.id"
              :itemValue="sectionData.items?.[item.id] ?? 'unchecked'"
              :inputValue="sectionData.inputs?.[item.id] ?? ''"
              @set-status="(itemId, status) => reportState.setItemStatus(section.id, itemId, status)"
              @set-input="(itemId, value) => reportState.setItemInput(section.id, itemId, value)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ── Notes ───────────────────────────────────────────────────────── -->
    <div>
      <label class="block text-[0.65rem] font-black text-slate-500 uppercase tracking-widest mb-1.5">
        Notes
      </label>
      <textarea
        :value="sectionData.notes"
        @input="reportState.setSectionNotes(section.id, $event.target.value)"
        rows="3"
        placeholder="Add any observations, issues, or notes..."
        class="w-full bg-slate-800/70 border border-slate-700 text-white placeholder-slate-600 text-base sm:text-sm rounded-xl px-3.5 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
      />
    </div>

    <!-- ── Photos ──────────────────────────────────────────────────────── -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <p class="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest">
          Photos
        </p>
        <button
          @click="emit('open-photo-modal', section.id)"
          class="flex items-center gap-1 text-xs font-bold text-teal-400 hover:text-teal-300 px-2 py-1 rounded-lg hover:bg-teal-500/10 transition-colors"
        >
          <Plus class="w-3.5 h-3.5" />Add Photo
        </button>
      </div>

      <!-- Existing photos grid -->
      <div
        v-if="sectionData.photos?.length"
        class="grid grid-cols-3 sm:grid-cols-4 gap-2"
      >
        <div
          v-for="(photo, pIdx) in sectionData.photos"
          :key="pIdx"
          class="flex flex-col gap-1"
        >
          <div
            class="relative group aspect-square rounded-xl overflow-hidden border-2"
            :class="photo.uploadStatus === 'failed'
              ? 'border-rose-500/60'
              : photo.uploadStatus === 'uploading'
                ? 'border-teal-500/60'
                : 'border-slate-700/60'"
          >
            <img
              :src="photo.thumbUrl || photo.previewUrl"
              alt="Photo"
              class="w-full h-full object-cover"
            />
            <!-- Uploading overlay -->
            <div
              v-if="photo.uploadStatus === 'uploading'"
              class="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <div class="w-6 h-6 rounded-full border-2 border-teal-400/30 border-t-teal-400 animate-spin" />
            </div>
            <!-- Failed overlay -->
            <div
              v-else-if="photo.uploadStatus === 'failed'"
              class="absolute inset-0 bg-rose-900/80 flex flex-col items-center justify-center gap-1.5 p-1"
            >
              <AlertTriangle class="w-4 h-4 text-rose-300" />
              <span class="text-[9px] font-bold text-rose-200 text-center leading-tight">
                {{ photo.retryNote ?? photo.errorMessage ?? 'Upload failed' }}
              </span>
              <span v-if="photo.errorCode" class="text-[9px] text-rose-100/80 text-center leading-tight">
                {{ photo.errorCode }}
              </span>
              <button
                v-if="!photo.retryNote && photo.retryable !== false"
                @click.stop="reportState.retryPhoto(section.id, pIdx)"
                class="text-[10px] font-black text-white bg-rose-500 rounded-lg px-2 py-1 hover:bg-rose-400 transition-colors"
              >
                Tap to Retry
              </button>
            </div>
            <!-- Remove -->
            <button
              v-if="photo.uploadStatus !== 'uploading'"
              @click.stop="reportState.removePhoto(section.id, pIdx)"
              class="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/70"
            >
              <X class="w-3 h-3 text-white" />
            </button>
            <!-- Edit caption -->
            <button
              v-if="photo.uploadStatus === 'done'"
              @click.stop="openCaptionEdit(pIdx)"
              class="absolute top-1 left-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil class="w-2.5 h-2.5 text-white" />
            </button>
          </div>
          <p
            v-if="photo.caption && photo.uploadStatus === 'done'"
            class="text-[10px] text-slate-500 font-medium leading-tight px-0.5 truncate"
          >
            {{ photo.caption }}
          </p>
        </div>

        <!-- Add more button -->
        <button
          @click="emit('open-photo-modal', section.id)"
          class="aspect-square rounded-xl border-2 border-dashed border-slate-700 hover:border-teal-500/60 hover:bg-teal-500/5 flex items-center justify-center transition-colors group"
        >
          <Plus class="w-5 h-5 text-slate-600 group-hover:text-teal-400 transition-colors" />
        </button>
      </div>

      <!-- Empty state -->
      <div
        v-else
        @click="emit('open-photo-modal', section.id)"
        class="flex flex-col items-center justify-center h-20 rounded-xl border-2 border-dashed border-slate-700 hover:border-teal-500/50 hover:bg-teal-500/5 cursor-pointer transition-colors gap-1.5 group"
      >
        <Camera class="w-5 h-5 text-slate-600 group-hover:text-teal-400 transition-colors" />
        <p class="text-xs text-slate-600 group-hover:text-teal-400 transition-colors font-medium">
          Tap to add photos
        </p>
      </div>

      <!-- Failed photos warning -->
      <div
        v-if="hasFailedPhotos"
        class="mt-2 flex items-start gap-2 px-3 py-2.5 bg-amber-500/10 border border-amber-500/25 rounded-xl"
      >
        <AlertTriangle class="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <p class="text-xs text-amber-300 font-medium leading-tight">
          Some photos failed to upload. Please email them directly to
          <span class="font-black">admin@everhomes.com.au</span>
          with the property address and date.
        </p>
      </div>
    </div>

    <!-- ── Caption Edit Modal ──────────────────────────────────────────── -->
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
          v-if="captionEdit.open"
          class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        >
          <div
            class="absolute inset-0 bg-black/70 backdrop-blur-sm"
            @click="closeCaptionEdit"
          />
          <div class="relative z-10 w-full sm:w-[420px] bg-slate-900 border border-slate-700 sm:rounded-2xl rounded-t-2xl shadow-2xl p-5">
            <h3 class="text-white font-bold text-sm mb-3">Edit Caption</h3>
            <input
              v-model="captionEdit.value"
              type="text"
              placeholder="e.g. Damaged grab rail in shower"
              class="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-base sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition mb-4"
              @keydown.enter="saveCaptionEdit"
            />
            <div class="flex gap-3">
              <button
                @click="closeCaptionEdit"
                class="flex-1 py-2.5 rounded-xl border-2 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-bold transition-colors"
              >Cancel</button>
              <button
                @click="saveCaptionEdit"
                class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-bold transition-all"
              >Save</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import {
  CheckCircle, AlertTriangle, XCircle, MinusCircle,
  Plus, Camera, X, Pencil,
} from 'lucide-vue-next'
import ChecklistItem from './ChecklistItem.vue'
import StatusPill    from './StatusPill.vue'

// ─── Props & emits ─────────────────────────────────────────────────────────────
const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
  sectionData: {
    type: Object,
    required: true,
  },
  groups: {
    type: Array,
    required: true,
  },
  isAllNA: {
    type: Boolean,
    default: false,
  },
  reportState: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['open-photo-modal'])

// ─── Status options for the all-NA manual override ───────────────────────────
const STATUS_OPTIONS = ['ok', 'attention', 'issue', 'na']

// ─── Failed photos warning ────────────────────────────────────────────────────
const hasFailedPhotos = computed(() =>
  props.sectionData.photos?.some((p) =>
    p.uploadStatus === 'failed' || p.uploadStatus === 'skipped'
  ) ?? false
)

// ─── Caption editing ──────────────────────────────────────────────────────────
const captionEdit = reactive({
  open:     false,
  photoIdx: null,
  value:    '',
})

function openCaptionEdit(photoIdx) {
  const photo = props.sectionData.photos?.[photoIdx]
  if (!photo) return
  captionEdit.open     = true
  captionEdit.photoIdx = photoIdx
  captionEdit.value    = photo.caption ?? ''
}

function saveCaptionEdit() {
  const photo = props.sectionData.photos?.[captionEdit.photoIdx]
  if (photo) photo.caption = captionEdit.value
  closeCaptionEdit()
}

function closeCaptionEdit() {
  captionEdit.open     = false
  captionEdit.photoIdx = null
  captionEdit.value    = ''
}
</script>
