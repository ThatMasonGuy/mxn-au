<template>
    <LayoutComponent :header="true" :footer="true">
        <!-- Page header -->
        <div class="pt-20 sm:pt-24 pb-4 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div class="flex items-start gap-3 mb-2">
                <div class="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <ClipboardDocumentCheckIcon class="w-5 h-5 text-teal-400" />
                </div>
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">Inspection Checklist</h1>
                    <p class="text-slate-400 text-sm mt-0.5">Walk through each area and capture notes and photos.</p>
                </div>
            </div>

            <!-- Property info -->
            <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Property Address</label>
                    <input v-model="propertyAddress" type="text" placeholder="123 Example St, Suburb"
                        class="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Inspection Date</label>
                    <input v-model="inspectionDate" type="date"
                        class="w-full bg-slate-800/60 border border-slate-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
                </div>
            </div>

            <!-- Progress bar -->
            <div class="mt-5">
                <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs text-slate-400 font-medium">Progress</span>
                    <span class="text-xs text-slate-400">
                        {{ inspectedCount }} / {{ rooms.length }} rooms inspected
                    </span>
                </div>
                <div class="h-2 bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="progressColor"
                        :style="{ width: progressPercent + '%' }"
                    />
                </div>
            </div>
        </div>

        <!-- Room list -->
        <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-3">
            <div
                v-for="(room, idx) in rooms"
                :key="room.id"
                class="rounded-2xl border overflow-hidden transition-all duration-300"
                :class="roomBorderClass(room.status)"
            >
                <!-- Room header (always visible, tap to expand) -->
                <button
                    @click="toggleRoom(idx)"
                    class="w-full flex items-center gap-3 px-4 sm:px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                    :class="roomHeaderBg(room.status)"
                >
                    <!-- Status dot -->
                    <span class="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 transition-colors duration-300"
                        :class="statusDotClass(room.status)" />

                    <!-- Room icon + name -->
                    <div class="flex items-center gap-2.5 flex-1 min-w-0">
                        <component :is="room.icon" class="w-5 h-5 shrink-0" :class="statusIconClass(room.status)" />
                        <div class="min-w-0">
                            <p class="text-white font-semibold text-sm sm:text-base leading-tight truncate">{{ room.name }}</p>
                            <p class="text-slate-500 text-xs mt-0.5 truncate">
                                {{ room.photos.length }} photo{{ room.photos.length !== 1 ? 's' : '' }} &middot; {{ statusLabel(room.status) }}
                            </p>
                        </div>
                    </div>

                    <!-- Chevron -->
                    <ChevronDownIcon
                        class="w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200"
                        :class="{ 'rotate-180': openRooms.has(idx) }"
                    />
                </button>

                <!-- Expanded content -->
                <Transition
                    enter-active-class="transition-all duration-300 ease-out"
                    leave-active-class="transition-all duration-200 ease-in"
                    enter-from-class="opacity-0 max-h-0"
                    enter-to-class="opacity-100 max-h-[1000px]"
                    leave-from-class="opacity-100 max-h-[1000px]"
                    leave-to-class="opacity-0 max-h-0"
                >
                    <div v-if="openRooms.has(idx)" class="px-4 sm:px-5 pb-5 bg-slate-900/60 space-y-4">
                        <div class="border-t border-slate-700/60 pt-4">
                            <!-- Status selector -->
                            <div class="mb-4">
                                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Status</p>
                                <div class="flex flex-wrap gap-2">
                                    <button
                                        v-for="s in statusOptions"
                                        :key="s.value"
                                        @click="room.status = s.value"
                                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200"
                                        :class="room.status === s.value ? s.activeClass : s.inactiveClass"
                                    >
                                        <component :is="s.icon" class="w-3.5 h-3.5" />
                                        {{ s.label }}
                                    </button>
                                </div>
                            </div>

                            <!-- Notes -->
                            <div class="mb-4">
                                <label :for="'notes-' + room.id" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Notes</label>
                                <textarea
                                    :id="'notes-' + room.id"
                                    v-model="room.notes"
                                    rows="3"
                                    placeholder="Add any observations, issues, or notes for this room..."
                                    class="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-sm rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                />
                            </div>

                            <!-- Photos -->
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Photos</p>
                                    <button
                                        @click="openPhotoModal(idx)"
                                        class="flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors px-2 py-1 rounded-lg hover:bg-teal-500/10"
                                    >
                                        <PlusIcon class="w-3.5 h-3.5" />
                                        Add Photo
                                    </button>
                                </div>

                                <!-- Photo thumbnails -->
                                <div v-if="room.photos.length" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                    <div
                                        v-for="(photo, pIdx) in room.photos"
                                        :key="pIdx"
                                        class="relative group aspect-square rounded-lg overflow-hidden border border-slate-700/60"
                                    >
                                        <img :src="photo.dataUrl" :alt="photo.caption || 'Photo ' + (pIdx + 1)"
                                            class="w-full h-full object-cover" />
                                        <!-- Caption overlay -->
                                        <div v-if="photo.caption" class="absolute inset-x-0 bottom-0 bg-black/60 px-1.5 py-1">
                                            <p class="text-white text-[10px] leading-tight truncate">{{ photo.caption }}</p>
                                        </div>
                                        <!-- Delete button -->
                                        <button
                                            @click.stop="removePhoto(idx, pIdx)"
                                            class="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                            aria-label="Remove photo"
                                        >
                                            <XMarkIcon class="w-3 h-3 text-white" />
                                        </button>
                                    </div>

                                    <!-- Add more placeholder -->
                                    <button
                                        @click="openPhotoModal(idx)"
                                        class="aspect-square rounded-lg border border-dashed border-slate-600 hover:border-teal-500/60 hover:bg-teal-500/5 flex items-center justify-center transition-colors group"
                                    >
                                        <PlusIcon class="w-5 h-5 text-slate-600 group-hover:text-teal-400 transition-colors" />
                                    </button>
                                </div>

                                <!-- Empty photo state -->
                                <div v-else
                                    @click="openPhotoModal(idx)"
                                    class="flex flex-col items-center justify-center h-20 rounded-xl border border-dashed border-slate-700 hover:border-teal-500/50 hover:bg-teal-500/5 cursor-pointer transition-colors gap-1.5 group"
                                >
                                    <CameraIcon class="w-5 h-5 text-slate-600 group-hover:text-teal-400 transition-colors" />
                                    <p class="text-xs text-slate-500 group-hover:text-teal-400 transition-colors">Tap to add photos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </section>

        <!-- Photo Modal -->
        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-200 ease-out"
                leave-active-class="transition duration-150 ease-in"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div v-if="photoModal.open"
                    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
                    @click.self="closePhotoModal"
                >
                    <!-- Backdrop -->
                    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closePhotoModal" />

                    <!-- Modal sheet -->
                    <Transition
                        enter-active-class="transition duration-300 ease-out"
                        leave-active-class="transition duration-200 ease-in"
                        enter-from-class="opacity-0 translate-y-4 sm:scale-95"
                        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
                        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                        leave-to-class="opacity-0 translate-y-4 sm:scale-95"
                    >
                        <div v-if="photoModal.open"
                            class="relative z-10 w-full sm:w-[480px] bg-slate-900 border border-slate-700 sm:rounded-2xl rounded-t-2xl shadow-2xl p-5 sm:p-6 max-h-[90dvh] overflow-y-auto"
                        >
                            <!-- Modal header -->
                            <div class="flex items-center justify-between mb-5">
                                <div>
                                    <h2 class="text-white font-bold text-base sm:text-lg">Add Photo</h2>
                                    <p class="text-slate-400 text-xs mt-0.5">
                                        {{ photoModal.roomIdx !== null ? rooms[photoModal.roomIdx].name : '' }}
                                    </p>
                                </div>
                                <button @click="closePhotoModal"
                                    class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-colors">
                                    <XMarkIcon class="w-4 h-4 text-slate-400" />
                                </button>
                            </div>

                            <!-- Preview -->
                            <div v-if="photoModal.preview" class="mb-4">
                                <div class="relative rounded-xl overflow-hidden aspect-video bg-slate-800">
                                    <img :src="photoModal.preview" alt="Preview" class="w-full h-full object-contain" />
                                    <button @click="clearPreview"
                                        class="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                                        <XMarkIcon class="w-3.5 h-3.5 text-white" />
                                    </button>
                                </div>
                            </div>

                            <!-- Camera / Upload buttons (shown when no preview) -->
                            <div v-if="!photoModal.preview" class="grid grid-cols-2 gap-3 mb-4">
                                <button @click="triggerCamera"
                                    class="flex flex-col items-center justify-center gap-2 py-6 rounded-xl border border-slate-700 hover:border-teal-500/60 hover:bg-teal-500/5 transition-colors group">
                                    <CameraIcon class="w-6 h-6 text-slate-400 group-hover:text-teal-400 transition-colors" />
                                    <span class="text-xs font-medium text-slate-400 group-hover:text-teal-400 transition-colors">Take Photo</span>
                                </button>
                                <button @click="triggerFileUpload"
                                    class="flex flex-col items-center justify-center gap-2 py-6 rounded-xl border border-slate-700 hover:border-teal-500/60 hover:bg-teal-500/5 transition-colors group">
                                    <PhotoIcon class="w-6 h-6 text-slate-400 group-hover:text-teal-400 transition-colors" />
                                    <span class="text-xs font-medium text-slate-400 group-hover:text-teal-400 transition-colors">Choose from Gallery</span>
                                </button>
                            </div>

                            <!-- Hidden file inputs -->
                            <input ref="cameraInputRef" type="file" accept="image/*" capture="environment"
                                class="hidden" @change="handleFileSelect" />
                            <input ref="fileInputRef" type="file" accept="image/*"
                                class="hidden" @change="handleFileSelect" />

                            <!-- Caption input -->
                            <div v-if="photoModal.preview" class="mb-5">
                                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Caption (optional)</label>
                                <input v-model="photoModal.caption" type="text" placeholder="e.g. Crack in wall near window"
                                    class="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
                            </div>

                            <!-- Actions -->
                            <div class="flex gap-3">
                                <button @click="closePhotoModal"
                                    class="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-semibold transition-colors">
                                    Cancel
                                </button>
                                <button
                                    v-if="photoModal.preview"
                                    @click="confirmPhoto"
                                    class="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold transition-colors shadow-lg shadow-teal-500/20">
                                    Add Photo
                                </button>
                            </div>
                        </div>
                    </Transition>
                </div>
            </Transition>
        </Teleport>
    </LayoutComponent>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import LayoutComponent from '@/components/everhomes/layouts/LayoutComponent.vue'

import {
    ClipboardDocumentCheckIcon,
    ChevronDownIcon,
    PlusIcon,
    XMarkIcon,
    CameraIcon,
    PhotoIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    MinusCircleIcon,
    HomeIcon,
    BuildingOffice2Icon,
    WrenchScrewdriverIcon
} from '@heroicons/vue/24/solid'

import {
    HomeIcon as HomeOutline,
    TvIcon,
    CakeIcon,
    BeakerIcon,
    MoonIcon,
    SunIcon,
    TruckIcon,
    ArchiveBoxIcon,
    BuildingOffice2Icon as BuildingOutline,
    RectangleGroupIcon,
    WrenchIcon
} from '@heroicons/vue/24/outline'

// ─── Data ────────────────────────────────────────────────────────────────────

const propertyAddress = ref('')
const inspectionDate = ref(new Date().toISOString().split('T')[0])

const rooms = reactive([
    { id: 'entry',      name: 'Entry / Foyer',          icon: HomeOutline,        status: 'unchecked', notes: '', photos: [] },
    { id: 'living',     name: 'Living Room',             icon: TvIcon,             status: 'unchecked', notes: '', photos: [] },
    { id: 'dining',     name: 'Dining Room',             icon: RectangleGroupIcon, status: 'unchecked', notes: '', photos: [] },
    { id: 'kitchen',    name: 'Kitchen',                 icon: CakeIcon,           status: 'unchecked', notes: '', photos: [] },
    { id: 'laundry',    name: 'Laundry',                 icon: BeakerIcon,         status: 'unchecked', notes: '', photos: [] },
    { id: 'bathroom1',  name: 'Bathroom',                icon: WrenchIcon,         status: 'unchecked', notes: '', photos: [] },
    { id: 'ensuite',    name: 'Ensuite',                 icon: WrenchIcon,         status: 'unchecked', notes: '', photos: [] },
    { id: 'bedroom1',   name: 'Bedroom 1 (Master)',      icon: MoonIcon,           status: 'unchecked', notes: '', photos: [] },
    { id: 'bedroom2',   name: 'Bedroom 2',               icon: MoonIcon,           status: 'unchecked', notes: '', photos: [] },
    { id: 'bedroom3',   name: 'Bedroom 3',               icon: MoonIcon,           status: 'unchecked', notes: '', photos: [] },
    { id: 'outdoor',    name: 'Outdoor / Yard',          icon: SunIcon,            status: 'unchecked', notes: '', photos: [] },
    { id: 'garage',     name: 'Garage / Carport',        icon: TruckIcon,          status: 'unchecked', notes: '', photos: [] },
    { id: 'common',     name: 'Common Areas',            icon: BuildingOutline,    status: 'unchecked', notes: '', photos: [] },
    { id: 'storage',    name: 'Storage / Utility',       icon: ArchiveBoxIcon,     status: 'unchecked', notes: '', photos: [] },
])

const openRooms = ref(new Set([0])) // Start with first room open

// ─── Status config ────────────────────────────────────────────────────────────

const statusOptions = [
    {
        value: 'ok',
        label: 'OK',
        icon: CheckCircleIcon,
        activeClass: 'bg-emerald-500/20 border-emerald-500 text-emerald-400',
        inactiveClass: 'bg-transparent border-slate-700 text-slate-500 hover:border-slate-600'
    },
    {
        value: 'attention',
        label: 'Needs Attention',
        icon: ExclamationTriangleIcon,
        activeClass: 'bg-amber-500/20 border-amber-500 text-amber-400',
        inactiveClass: 'bg-transparent border-slate-700 text-slate-500 hover:border-slate-600'
    },
    {
        value: 'issue',
        label: 'Issue Found',
        icon: XCircleIcon,
        activeClass: 'bg-rose-500/20 border-rose-500 text-rose-400',
        inactiveClass: 'bg-transparent border-slate-700 text-slate-500 hover:border-slate-600'
    },
    {
        value: 'na',
        label: 'N/A',
        icon: MinusCircleIcon,
        activeClass: 'bg-slate-600/50 border-slate-500 text-slate-400',
        inactiveClass: 'bg-transparent border-slate-700 text-slate-500 hover:border-slate-600'
    }
]

function statusLabel(status) {
    const map = {
        unchecked: 'Not inspected',
        ok: 'OK',
        attention: 'Needs attention',
        issue: 'Issue found',
        na: 'N/A'
    }
    return map[status] || 'Not inspected'
}

function statusDotClass(status) {
    return {
        'bg-slate-600': status === 'unchecked',
        'bg-emerald-500': status === 'ok',
        'bg-amber-400': status === 'attention',
        'bg-rose-500': status === 'issue',
        'bg-slate-500': status === 'na',
    }
}

function statusIconClass(status) {
    return {
        'text-slate-500': status === 'unchecked',
        'text-emerald-400': status === 'ok',
        'text-amber-400': status === 'attention',
        'text-rose-400': status === 'issue',
        'text-slate-500': status === 'na',
    }
}

function roomBorderClass(status) {
    return {
        'border-slate-700/60 bg-slate-800/30': status === 'unchecked',
        'border-emerald-500/30 bg-emerald-500/5': status === 'ok',
        'border-amber-500/30 bg-amber-500/5': status === 'attention',
        'border-rose-500/30 bg-rose-500/5': status === 'issue',
        'border-slate-600/40 bg-slate-800/20': status === 'na',
    }
}

function roomHeaderBg(status) {
    return {
        'hover:bg-slate-800/30': true,
        'transition-colors duration-200': true
    }
}

// ─── Progress ─────────────────────────────────────────────────────────────────

const inspectedCount = computed(() =>
    rooms.filter(r => r.status !== 'unchecked').length
)

const progressPercent = computed(() =>
    Math.round((inspectedCount.value / rooms.length) * 100)
)

const progressColor = computed(() => {
    if (progressPercent.value === 100) return 'bg-emerald-500'
    if (progressPercent.value >= 60) return 'bg-teal-500'
    if (progressPercent.value >= 30) return 'bg-sky-500'
    return 'bg-slate-600'
})

// ─── Room accordion ───────────────────────────────────────────────────────────

function toggleRoom(idx) {
    if (openRooms.value.has(idx)) {
        openRooms.value.delete(idx)
    } else {
        openRooms.value.add(idx)
    }
    openRooms.value = new Set(openRooms.value)
}

// ─── Photo modal ──────────────────────────────────────────────────────────────

const cameraInputRef = ref(null)
const fileInputRef = ref(null)

const photoModal = reactive({
    open: false,
    roomIdx: null,
    preview: null,
    caption: ''
})

function openPhotoModal(roomIdx) {
    photoModal.open = true
    photoModal.roomIdx = roomIdx
    photoModal.preview = null
    photoModal.caption = ''
}

function closePhotoModal() {
    photoModal.open = false
    photoModal.roomIdx = null
    photoModal.preview = null
    photoModal.caption = ''
}

function triggerCamera() {
    cameraInputRef.value?.click()
}

function triggerFileUpload() {
    fileInputRef.value?.click()
}

function handleFileSelect(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
        photoModal.preview = e.target.result
    }
    reader.readAsDataURL(file)

    // Reset input so same file can be re-selected
    event.target.value = ''
}

function clearPreview() {
    photoModal.preview = null
    photoModal.caption = ''
}

function confirmPhoto() {
    if (photoModal.roomIdx === null || !photoModal.preview) return

    rooms[photoModal.roomIdx].photos.push({
        dataUrl: photoModal.preview,
        caption: photoModal.caption
    })

    // Auto-set status to 'ok' if still unchecked
    if (rooms[photoModal.roomIdx].status === 'unchecked') {
        rooms[photoModal.roomIdx].status = 'ok'
    }

    closePhotoModal()
}

function removePhoto(roomIdx, photoIdx) {
    rooms[roomIdx].photos.splice(photoIdx, 1)
}
</script>
