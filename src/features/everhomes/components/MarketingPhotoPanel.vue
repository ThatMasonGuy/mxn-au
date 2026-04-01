<!-- src/features/everhomes/components/MarketingPhotoPanel.vue -->

<!--
  Marketing photo slots panel. Rendered by ReportPage only when the schema
  has a marketingPhotos config and either:
    - optional: false  → always shown in the checklist
    - optional: true   → shown only when setup.showMarketing is true

  Each slot gets its own photo grid with direct file upload (no queue modal —
  marketing photos don't need captions).

  Props:
    schema      — full report schema (for marketingPhotos.slots)
    reportState — useReportState() return value
-->

<template>
  <div class="mt-6 bg-gradient-to-b from-teal-900/20 to-slate-900/50 border border-teal-500/20 rounded-2xl overflow-hidden">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-teal-500/15 bg-teal-500/5">
      <div class="flex items-center gap-2.5 mb-1">
        <Images class="w-4 h-4 text-teal-400" />
        <h3 class="text-sm font-black text-white">Marketing Photos</h3>
      </div>
      <p class="text-[0.65rem] text-slate-400 leading-relaxed">
        Hero shots for marketing and listing purposes. Uploaded
        <span class="font-bold text-teal-300">uncompressed</span> — not included in the compliance report.
      </p>
    </div>

    <!-- Slots -->
    <div class="px-5 py-4 space-y-3">
      <div
        v-for="slot in schema.marketingPhotos.slots"
        :key="slot.key"
        class="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3"
      >
        <div class="flex items-center justify-between mb-2">
          <div>
            <p class="text-xs font-bold text-white">{{ slot.label }}</p>
            <p class="text-[0.6rem] text-slate-500 mt-0.5">{{ slot.hint }}</p>
          </div>
          <label class="flex items-center gap-1 text-xs font-bold text-teal-400 hover:text-teal-300 px-2 py-1 rounded-lg hover:bg-teal-500/10 transition-colors cursor-pointer">
            <Plus class="w-3.5 h-3.5" />Add
            <input
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              @change="onFilesSelected(slot.key, $event)"
            />
          </label>
        </div>

        <!-- Photos grid -->
        <div
          v-if="(reportState.marketingPhotos[slot.key] ?? []).length"
          class="grid grid-cols-3 sm:grid-cols-4 gap-2"
        >
          <div
            v-for="(photo, mpIdx) in reportState.marketingPhotos[slot.key]"
            :key="mpIdx"
            class="relative group aspect-square rounded-xl overflow-hidden border-2"
            :class="photo.uploadStatus === 'uploading'
              ? 'border-teal-500/60'
              : photo.uploadStatus === 'failed'
                ? 'border-rose-500/60'
                : 'border-slate-700/60'"
          >
            <img
              :src="photo.thumbUrl || photo.previewUrl"
              alt=""
              class="w-full h-full object-cover"
            />
            <!-- Uploading -->
            <div
              v-if="photo.uploadStatus === 'uploading'"
              class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1"
            >
              <div class="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span class="text-white text-[10px] font-bold">Uploading…</span>
            </div>
            <!-- Failed -->
            <div
              v-else-if="photo.uploadStatus === 'failed'"
              class="absolute inset-0 bg-rose-900/80 flex flex-col items-center justify-center gap-1 p-1"
            >
              <AlertTriangle class="w-4 h-4 text-rose-300" />
              <span class="text-[9px] font-bold text-rose-200">Failed</span>
            </div>
            <!-- Remove -->
            <button
              v-if="photo.uploadStatus !== 'uploading'"
              @click.stop="reportState.removeMarketingPhoto(slot.key, mpIdx)"
              class="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X class="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-else
          class="flex items-center justify-center h-16 rounded-xl border-2 border-dashed border-slate-700/50 text-slate-600 text-xs font-medium"
        >
          No photos yet
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Images, Plus, AlertTriangle, X } from 'lucide-vue-next'

const props = defineProps({
  schema:      { type: Object, required: true },
  reportState: { type: Object, required: true },
})

async function onFilesSelected(slotKey, event) {
  const files = Array.from(event.target.files ?? [])
  event.target.value = '' // reset so same file can be re-selected
  for (const file of files) {
    await props.reportState.addMarketingPhoto(slotKey, file)
  }
}
</script>
