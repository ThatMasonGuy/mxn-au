<!-- src/features/everhomes/components/ReportSetup.vue -->

<!--
  Schema-driven setup card. Renders correctly for both report types with zero
  conditionals on reportType — everything is driven by schema flags:

    schema.pickerMode        → 'sdaCategory' | 'reportSubtype' | null
    schema.optionalMode      → 'toggle' | 'dynamic'
    schema.marketingPhotos   → { optional: bool } — shows toggle if optional: true
    schema.sections.forced   → locked chips
    schema.sections.pool     → toggleable or addable sections

  Bug 6 fix: if hasPendingData is true, clicking Start shows a confirm dialog
  instead of silently wiping the existing checklist.
-->

<template>
  <div class="bg-white rounded-2xl shadow-xl shadow-black/15 overflow-hidden">

    <!-- ── Picker (reportSubtype or sdaCategory) ───────────────────────── -->
    <div
      v-if="schema.pickerMode"
      :class="pickerHeaderClass"
      class="border-b px-5 py-4"
    >
      <p class="text-[0.65rem] font-black uppercase tracking-widest mb-2.5" :class="pickerLabelClass">
        {{ pickerLabel }}
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <!-- Report subtype: simple buttons -->
        <template v-if="schema.pickerMode === 'reportSubtype'">
          <button
            v-for="opt in schema.pickerOptions"
            :key="opt.key"
            :disabled="opt.disabled"
            @click="!opt.disabled && (reportState.setup.pickerValue = opt.key)"
            class="px-3 py-2.5 rounded-xl border-2 text-sm font-bold text-left transition-all duration-150"
            :class="[
              reportState.setup.pickerValue === opt.key
                ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:border-violet-300',
              opt.disabled ? 'opacity-40 cursor-not-allowed' : '',
            ]"
            :title="opt.disabled ? `${opt.label} is not available yet` : ''"
          >{{ opt.label }}</button>
        </template>

        <!-- SDA category: coloured chip cards -->
        <template v-else-if="schema.pickerMode === 'sdaCategory'">
          <button
            v-for="opt in schema.pickerOptions"
            :key="opt.key"
            @click="reportState.setup.pickerValue = opt.key"
            class="flex flex-col items-start gap-1.5 px-3.5 py-3 rounded-xl border-2 text-left transition-all duration-150"
            :style="reportState.setup.pickerValue === opt.key
              ? { backgroundColor: opt.color + '20', borderColor: opt.color, color: opt.color }
              : { borderColor: '#1e293b', color: '#64748b' }"
          >
            <span class="text-sm font-black">{{ opt.key }}</span>
            <span class="text-[0.65rem] font-medium leading-tight opacity-80">{{ opt.label }}</span>
            <div class="flex flex-wrap gap-1 mt-0.5">
              <SdaChip v-for="badge in opt.includes" :key="badge" :chip="badge" />
            </div>
          </button>
        </template>
      </div>
      <p v-if="reportState.setupErrors.pickerValue" class="text-rose-500 text-[0.65rem] font-bold mt-2">
        Please select an option above
      </p>
    </div>

    <!-- ── Address / Date / Staff ──────────────────────────────────────── -->
    <div class="bg-slate-50 border-b border-slate-200 px-5 py-4 space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-[0.65rem] font-black uppercase tracking-widest mb-1" :class="accentLabelClass">
            Property Address
          </label>
          <input
            v-model="reportState.setup.propertyAddress"
            type="text"
            placeholder="123 Example St, Suburb"
            class="w-full bg-white border text-slate-800 placeholder-slate-400 text-base sm:text-sm font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 transition"
            :class="[accentRingClass, reportState.setupErrors.address ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200']"
          />
          <p v-if="reportState.setupErrors.address" class="text-rose-500 text-[0.65rem] font-bold mt-1">
            Property address is required
          </p>
        </div>
        <div class="min-w-0 overflow-hidden">
          <label class="block text-[0.65rem] font-black uppercase tracking-widest mb-1" :class="accentLabelClass">
            {{ schema.pickerMode === 'sdaCategory' ? 'Review Date' : 'Inspection Date' }}
          </label>
          <input
            v-model="reportState.setup.inspectionDate"
            type="date"
            class="w-full max-w-full min-w-0 bg-white border border-slate-200 text-slate-800 text-base sm:text-sm font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 transition appearance-none"
            :class="accentRingClass"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-[0.65rem] font-black uppercase tracking-widest mb-1" :class="accentLabelClass">
            Everhomes Staff Name
          </label>
          <input
            v-model="reportState.setup.inspectorName"
            type="text"
            placeholder="Jane Smith"
            class="w-full bg-white border text-slate-800 placeholder-slate-400 text-base sm:text-sm font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 transition"
            :class="[accentRingClass, reportState.setupErrors.name ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200']"
          />
          <p v-if="reportState.setupErrors.name" class="text-rose-500 text-[0.65rem] font-bold mt-1">
            Staff name is required
          </p>
        </div>
        <div>
          <label class="block text-[0.65rem] font-black uppercase tracking-widest mb-1" :class="accentLabelClass">
            Everhomes Staff Email
          </label>
          <input
            v-model="reportState.setup.inspectorEmail"
            type="email"
            placeholder="name@everhomes.com.au"
            class="w-full bg-white border text-slate-800 placeholder-slate-400 text-base sm:text-sm font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 transition"
            :class="[accentRingClass, reportState.setupErrors.email ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200']"
          />
          <p v-if="reportState.setupErrors.email" class="text-rose-500 text-[0.65rem] font-bold mt-1">
            Staff email is required
          </p>
        </div>
      </div>
      <p class="text-[0.6rem] text-slate-400 -mt-1">
        This is the person completing the form. These details appear on the report and signature page.
      </p>
    </div>

    <!-- ── Section config ──────────────────────────────────────────────── -->
    <div class="px-5 py-6 space-y-6">

      <!-- Dynamic room builder (inspection) -->
      <template v-if="schema.optionalMode === 'dynamic'">

        <!-- Bedrooms / OOA -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Bedrooms</p>
            <div class="flex items-center gap-3">
              <button
                @click="removeRoom"
                :disabled="bedroomRooms.length <= 1"
                class="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-violet-400 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all text-lg font-bold leading-none"
              >−</button>
              <span class="text-slate-800 font-black text-xl w-4 text-center tabular-nums">{{ bedroomRooms.length }}</span>
              <button
                @click="addRoom('bedroom')"
                class="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-violet-400 hover:text-violet-600 flex items-center justify-center transition-all text-lg font-bold leading-none"
              >+</button>
            </div>
          </div>
          <div class="space-y-2.5">
            <div
              v-for="(room, i) in bedroomRooms"
              :key="room.id"
              class="flex items-center gap-2"
            >
              <input
                v-model="room.label"
                type="text"
                :placeholder="room.isOOA ? 'OOA' : `Bedroom ${i + 1}`"
                class="flex-1 min-w-0 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-base sm:text-sm font-medium rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
              />
              <!-- Ensuite toggle -->
              <button
                v-if="!room.isOOA"
                @click="reportState.updateRoom(room.id, { hasEnsuite: !room.hasEnsuite })"
                class="shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all duration-150"
                :class="room.hasEnsuite
                  ? 'bg-teal-500 border-teal-500 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'"
              >
                <div class="w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0"
                  :class="room.hasEnsuite ? 'bg-white/30 border-white/70' : 'border-slate-300'">
                  <Check v-if="room.hasEnsuite" class="w-2.5 h-2.5 text-white" />
                </div>
                Has ensuite
              </button>
              <!-- OOA toggle -->
              <button
                @click="reportState.updateRoom(room.id, {
                  isOOA: !room.isOOA,
                  key: room.isOOA ? 'bedroom' : 'ooa',
                  hasEnsuite: false,
                })"
                class="shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all duration-150"
                :class="room.isOOA
                  ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'"
              >
                <ShieldCheck class="w-3.5 h-3.5 shrink-0" />OOA
              </button>
            </div>
          </div>
        </div>

        <!-- Standalone bathrooms -->
        <div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Standalone Bathrooms</p>
              <p class="text-[0.68rem] text-slate-400 font-medium mt-0.5">Not counting ensuites above</p>
            </div>
            <div class="flex items-center gap-3">
              <button
                @click="reportState.setup.bathrooms = Math.max(0, reportState.setup.bathrooms - 1)"
                :disabled="reportState.setup.bathrooms <= 0"
                class="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-violet-400 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all text-lg font-bold leading-none"
              >−</button>
              <span class="text-slate-800 font-black text-xl w-4 text-center tabular-nums">{{ reportState.setup.bathrooms }}</span>
              <button
                @click="reportState.setup.bathrooms++"
                class="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-violet-400 hover:text-violet-600 flex items-center justify-center transition-all text-lg font-bold leading-none"
              >+</button>
            </div>
          </div>
        </div>

        <!-- Core sections — always included -->
        <div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Core Sections</p>
          <p class="text-[0.68rem] text-slate-400 font-medium mb-3">Always included in every inspection</p>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="s in schema.sections.forced"
              :key="s.key"
              class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white border-transparent shadow-sm"
              :style="{ backgroundColor: s.color }"
            >
              <Check class="w-3 h-3 opacity-60" />{{ s.label }}
            </div>
          </div>
        </div>

        <!-- Optional single-instance areas -->
        <div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Optional Areas</p>
          <p class="text-[0.68rem] text-slate-400 font-medium mb-3">Toggle to include in this inspection</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="s in singleOptionalPool"
              :key="s.key"
              @click="reportState.toggleOptionalSection(s.key)"
              class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-150"
              :style="reportState.isOptionalSelected(s.key)
                ? { backgroundColor: s.color + '25', borderColor: s.color, color: s.color }
                : { borderColor: '#1e293b', color: '#64748b' }"
            >
              <Check v-if="reportState.isOptionalSelected(s.key)" class="w-3 h-3 opacity-70" />
              {{ s.label }}
            </button>
          </div>
        </div>

        <!-- Marketing photos toggle (optional: true) -->
        <div v-if="schema.marketingPhotos?.optional">
          <label class="flex items-center gap-3 cursor-pointer select-none">
            <div
              @click="reportState.setup.showMarketing = !reportState.setup.showMarketing"
              class="relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
              :class="reportState.setup.showMarketing ? 'bg-teal-500' : 'bg-slate-300'"
            >
              <div
                class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                :class="reportState.setup.showMarketing ? 'translate-x-4' : 'translate-x-0'"
              />
            </div>
            <div>
              <p class="text-sm font-bold text-slate-700">Include Marketing Photos</p>
              <p class="text-[0.68rem] text-slate-400">Hero shots for listing purposes, not in compliance report</p>
            </div>
          </label>
        </div>
      </template>

      <!-- Toggle mode section list (handover) -->
      <template v-else>

        <!-- Forced / core sections -->
        <div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Core Sections</p>
          <p class="text-[0.68rem] text-slate-400 font-medium mb-3">Always included in every review</p>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="s in schema.sections.forced"
              :key="s.key"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm"
              :style="{ backgroundColor: s.color }"
            >
              <component :is="s.icon" class="w-3.5 h-3.5 opacity-70" />
              {{ s.label }}
            </div>
          </div>
        </div>

        <!-- Optional pool -->
        <div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Optional Sections</p>
          <p class="text-[0.68rem] text-slate-400 font-medium mb-3">Include sections applicable to this property</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              v-for="s in reportState.visiblePoolSections"
              :key="s.key"
              @click="reportState.toggleOptionalSection(s.key)"
              class="flex items-center gap-2.5 px-3.5 py-3 rounded-xl border-2 text-left transition-all duration-150"
              :class="reportState.isOptionalSelected(s.key)
                ? 'border-transparent text-white shadow-sm'
                : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'"
              :style="reportState.isOptionalSelected(s.key)
                ? { backgroundColor: s.color }
                : {}"
            >
              <component :is="s.icon" class="w-4 h-4 shrink-0 opacity-80" />
              <span class="text-xs font-bold leading-tight">{{ s.label }}</span>
            </button>
          </div>
        </div>
      </template>

      <!-- ── Start button ──────────────────────────────────────────────── -->
      <button
        @click="handleStart"
        class="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg text-white hover:-translate-y-0.5 transition-all duration-150"
        :class="startButtonClass"
      >
        {{ reportState.hasChecklistStarted ? 'Rebuild Checklist' : 'Start' }}
      </button>
    </div>
  </div>

  <!-- ── Rebuild confirm dialog (bug 6) ─────────────────────────────── -->
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
        v-if="confirmRebuild"
        class="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="confirmRebuild = false" />
        <div class="relative z-10 w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
          <h3 class="text-white font-black text-base mb-1">Rebuild Checklist?</h3>
          <p class="text-slate-400 text-sm mb-5">
            You have data already entered. Rebuilding will clear all current responses and photos.
          </p>
          <div class="flex gap-3">
            <button
              @click="confirmRebuild = false"
              class="flex-1 py-2.5 rounded-xl border-2 border-slate-700 text-slate-400 text-sm font-bold transition-colors hover:border-slate-600"
            >Cancel</button>
            <button
              @click="doStart"
              class="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-black transition-colors"
            >Rebuild</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Check, ShieldCheck } from 'lucide-vue-next'
import SdaChip from './SdaChip.vue'

const props = defineProps({
  schema: { type: Object, required: true },
  reportState: { type: Object, required: true },
})

const emit = defineEmits(['started'])

// ── Rebuild confirm (bug 6) ───────────────────────────────────────────────────
const confirmRebuild = ref(false)

function handleStart() {
  if (props.reportState.hasPendingData) {
    confirmRebuild.value = true
  } else {
    doStart()
  }
}

function doStart() {
  confirmRebuild.value = false
  if (props.reportState.hasChecklistStarted && props.reportState.hasPendingData) {
    props.reportState.resetAll()
  }
  const ok = props.reportState.startChecklist()
  if (ok) emit('started')
}

// ── Dynamic mode helpers ──────────────────────────────────────────────────────
const bedroomRooms = computed(() =>
  props.reportState.setup.rooms.filter((r) => r.key === 'bedroom' || r.key === 'ooa')
)

const singleOptionalPool = computed(() =>
  (props.schema.sections.pool ?? []).filter((s) => !s._managed && !s.multipleAllowed)
)

function addRoom(key) {
  props.reportState.addRoom(key)
}

function removeRoom() {
  const rooms = props.reportState.setup.rooms
  // Remove last bedroom or OOA (non-OOA bedroom preferred)
  const lastBed = [...rooms].reverse().find((r) => r.key === 'bedroom' && !r.isOOA)
    ?? [...rooms].reverse().find((r) => r.key === 'bedroom' || r.key === 'ooa')
  if (lastBed) props.reportState.removeRoom(lastBed.id)
}

// ── Accent colour derived from schema pickerMode ──────────────────────────────
const isHandover = computed(() => props.schema.pickerMode === 'sdaCategory')

const accentLabelClass  = computed(() => isHandover.value ? 'text-teal-600' : 'text-violet-600')
const accentRingClass   = computed(() => isHandover.value ? 'focus:ring-teal-400' : 'focus:ring-violet-400')
const pickerHeaderClass = computed(() => isHandover.value ? 'bg-white' : 'bg-violet-50 border-violet-100')
const pickerLabelClass  = computed(() => isHandover.value ? 'text-slate-500' : 'text-violet-600')
const startButtonClass  = computed(() => isHandover.value
  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-teal-500/20'
  : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-500/20'
)

const pickerLabel = computed(() =>
  props.schema.pickerMode === 'sdaCategory' ? 'SDA Design Category' : 'Report Type'
)
</script>
