<!-- src/features/everhomes/components/PhotoPanel.vue -->

<!--
  Photo upload modal. Handles:
    - Camera capture (single photo, direct preview)
    - Gallery selection (single or multi — multi enters queue/label mode)
    - Caption editing per photo in queue
    - Delegates actual upload to reportState.addPhoto()

  Rendered via Teleport to body. Open/close is controlled by the parent
  (SectionAccordion) via the `open` prop and the `close` emit.

  Props:
    open         — bool
    sectionId    — active section instance ID
    sectionLabel — displayed in the modal header
    reportState  — useReportState() return value

  Emits:
    close
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
          @click="handleClose"
        />

        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        >
          <div
            v-if="open"
            class="relative z-10 w-full sm:w-[460px] bg-slate-900 border border-slate-700 sm:rounded-2xl rounded-t-2xl shadow-2xl p-5 max-h-[90dvh] overflow-y-auto"
          >
            <!-- Header -->
            <div class="flex items-center justify-between mb-5">
              <div>
                <h2 class="text-white font-extrabold text-base">
                  {{ queue.length > 0
                    ? `Label Photo ${queueIndex + 1} of ${queue.length}`
                    : 'Add Photo' }}
                </h2>
                <p class="text-slate-400 text-xs mt-0.5">{{ sectionLabel }}</p>
              </div>
              <button
                @click="handleClose"
                class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <X class="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <!-- ── Queue mode: stepping through selected photos ──────────── -->
            <template v-if="queue.length > 0">
              <div class="mb-4 relative rounded-xl overflow-hidden aspect-video bg-slate-800">
                <img
                  :src="queue[queueIndex]?.preview"
                  alt="Preview"
                  class="w-full h-full object-contain"
                />
              </div>

              <!-- Progress dots -->
              <div
                v-if="queue.length > 1"
                class="flex items-center justify-center gap-1.5 mb-4"
              >
                <div
                  v-for="(_, qi) in queue"
                  :key="qi"
                  class="w-2 h-2 rounded-full transition-colors"
                  :class="qi === queueIndex
                    ? 'bg-teal-400'
                    : qi < queueIndex
                      ? 'bg-teal-600'
                      : 'bg-slate-700'"
                />
              </div>

              <!-- Caption -->
              <div class="mb-5">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Caption <span class="normal-case font-medium tracking-normal text-slate-500">— optional</span>
                </label>
                <input
                  v-model="queue[queueIndex].caption"
                  type="text"
                  placeholder="e.g. Damaged grab rail in shower"
                  class="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-base sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>

              <div class="flex gap-3">
                <button
                  @click="handleClose"
                  class="flex-1 py-2.5 rounded-xl border-2 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-bold transition-colors"
                >Cancel</button>
                <button
                  v-if="queueIndex < queue.length - 1"
                  @click="nextInQueue"
                  class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-bold transition-all shadow-lg shadow-teal-500/20"
                >Next Photo</button>
                <button
                  v-else
                  @click="confirmQueue"
                  class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-bold transition-all shadow-lg shadow-teal-500/20"
                >{{ queue.length === 1 ? 'Add Photo' : `Add ${queue.length} Photos` }}</button>
              </div>
            </template>

            <!-- ── Initial mode: pick source ─────────────────────────────── -->
            <template v-else>
              <!-- Single-photo preview -->
              <div
                v-if="singlePreview"
                class="mb-4 relative rounded-xl overflow-hidden aspect-video bg-slate-800"
              >
                <img
                  :src="singlePreview"
                  alt="Preview"
                  class="w-full h-full object-contain"
                />
                <button
                  @click="clearSingle"
                  class="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X class="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              <!-- Source picker -->
              <div v-if="!singlePreview" class="grid grid-cols-2 gap-3 mb-4">
                <button
                  @click="triggerCamera"
                  class="flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-slate-700 hover:border-teal-500/60 hover:bg-teal-500/5 transition-colors group"
                >
                  <Camera class="w-6 h-6 text-slate-400 group-hover:text-teal-400 transition-colors" />
                  <span class="text-xs font-bold text-slate-400 group-hover:text-teal-400 transition-colors">Take Photo</span>
                </button>
                <button
                  @click="triggerGallery"
                  class="flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-slate-700 hover:border-teal-500/60 hover:bg-teal-500/5 transition-colors group"
                >
                  <ImageIcon class="w-6 h-6 text-slate-400 group-hover:text-teal-400 transition-colors" />
                  <span class="text-xs font-bold text-slate-400 group-hover:text-teal-400 transition-colors">Choose from Gallery</span>
                </button>
              </div>

              <!-- Hidden inputs — keyed to force reset after each use -->
              <input
                ref="cameraInputRef"
                :key="`cam-${inputKey}`"
                type="file"
                accept="image/*"
                capture="environment"
                class="hidden"
                @change="onCameraSelect"
              />
              <input
                ref="galleryInputRef"
                :key="`file-${inputKey}`"
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="onGallerySelect"
              />

              <!-- Caption for single photo -->
              <div v-if="singlePreview" class="mb-5">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Caption <span class="normal-case font-medium tracking-normal text-slate-500">— optional</span>
                </label>
                <input
                  v-model="singleCaption"
                  type="text"
                  placeholder="e.g. Damaged grab rail in shower"
                  class="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-base sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>

              <div class="flex gap-3">
                <button
                  @click="handleClose"
                  class="flex-1 py-2.5 rounded-xl border-2 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-bold transition-colors"
                >Cancel</button>
                <button
                  v-if="singlePreview"
                  @click="confirmSingle"
                  class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-bold transition-all shadow-lg shadow-teal-500/20"
                >Add Photo</button>
              </div>
            </template>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { X, Camera, Image as ImageIcon } from 'lucide-vue-next'

// ─── Props & emits ────────────────────────────────────────────────────────────
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  sectionId: {
    type: String,
    default: null,
  },
  sectionLabel: {
    type: String,
    default: '',
  },
  reportState: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

// ─── Refs ─────────────────────────────────────────────────────────────────────
const cameraInputRef  = ref(null)
const galleryInputRef = ref(null)
const inputKey        = ref(0)  // Incremented to force input reset after each use

// ── Single photo mode ─────────────────────────────────────────────────────────
const singleFile    = ref(null)
const singlePreview = ref(null)
const singleCaption = ref('')

// ── Queue mode (multiple gallery selection) ───────────────────────────────────
const queue      = reactive([])  // [{ file, preview, caption }]
const queueIndex = ref(0)

// ─── Reset all state when modal closes ────────────────────────────────────────
watch(() => props.open, (isOpen) => {
  if (!isOpen) resetState()
})

function resetState() {
  singleFile.value    = null
  singlePreview.value = null
  singleCaption.value = ''
  queue.splice(0)
  queueIndex.value = 0
}

function handleClose() {
  emit('close')
}

// ─── Input triggers ───────────────────────────────────────────────────────────
function triggerCamera() {
  inputKey.value++
  // nextTick-equivalent — give the keyed input time to remount
  setTimeout(() => cameraInputRef.value?.click(), 0)
}

function triggerGallery() {
  inputKey.value++
  setTimeout(() => galleryInputRef.value?.click(), 0)
}

// ─── Camera: single photo → preview mode ─────────────────────────────────────
function onCameraSelect(event) {
  const file = event.target.files?.[0]
  if (!file) return
  singleFile.value = file
  readAsDataURL(file, (result) => {
    singlePreview.value = result
  })
}

// ─── Gallery: single → preview mode, multiple → queue mode ───────────────────
function onGallerySelect(event) {
  const files = Array.from(event.target.files ?? [])
  if (!files.length) return

  if (files.length === 1) {
    singleFile.value = files[0]
    readAsDataURL(files[0], (result) => {
      singlePreview.value = result
    })
    return
  }

  // Multiple — build queue and enter label-stepping mode
  let loaded = 0
  const entries = files.map((file) => reactive({ file, preview: null, caption: '' }))

  entries.forEach((entry) => {
    readAsDataURL(entry.file, (result) => {
      entry.preview = result
      loaded++
      if (loaded === files.length) {
        queue.splice(0, queue.length, ...entries)
        queueIndex.value = 0
      }
    })
  })
}

function clearSingle() {
  singleFile.value    = null
  singlePreview.value = null
  singleCaption.value = ''
}

// ─── Confirm single photo ─────────────────────────────────────────────────────
async function confirmSingle() {
  if (!singleFile.value || !props.sectionId) return
  const file    = singleFile.value
  const caption = singleCaption.value

  handleClose()

  // addPhoto in composable handles the upload + store mutation
  const photo = await props.reportState.addPhoto(props.sectionId, file)
  if (photo && caption) photo.caption = caption
}

// ─── Queue navigation ─────────────────────────────────────────────────────────
function nextInQueue() {
  if (queueIndex.value < queue.length - 1) queueIndex.value++
}

// ─── Confirm queue ────────────────────────────────────────────────────────────
async function confirmQueue() {
  if (!props.sectionId || !queue.length) return
  const items = queue.map((q) => ({ file: q.file, caption: q.caption }))

  handleClose()

  // Fire uploads sequentially so we don't hammer the storage API
  for (const item of items) {
    const photo = await props.reportState.addPhoto(props.sectionId, item.file)
    if (photo && item.caption) photo.caption = item.caption
  }
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function readAsDataURL(file, callback) {
  const reader = new FileReader()
  reader.onload = (e) => callback(e.target.result)
  reader.readAsDataURL(file)
}
</script>
