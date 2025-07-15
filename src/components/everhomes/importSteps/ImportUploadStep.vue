<template>
    <div>
        <HeroComponent :heading="'Import a Dataset'"
            :byline="'Upload your spreadsheet to begin extracting and cleaning data. Works best with NDIS benchmark files (.xlsx or .csv).'"
            :icon="WrenchScrewdriverIcon" />
        <div class="max-w-3xl mx-auto px-4 py-10 relative z-10">
            <!-- DROPZONE CONTAINER -->
            <transition name="fade-collapse">
                <label v-if="!store.file && !isLoading"
                    class="flex flex-col items-center justify-center border-2 border-dashed rounded-xl -mt-12 p-10 sm:p-16 cursor-pointer transition-colors duration-200 bg-gray-800/40 group"
                    :class="[
                        isDraggingOver
                            ? 'border-teal-400 bg-gray-700/40 ring-2 ring-teal-500/50'
                            : 'border-gray-600'
                    ]" @dragenter.prevent="handleDragEnter" @dragover.prevent="isDraggingOver = true"
                    @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">
                    <input type="file" accept=".xlsx,.csv" class="hidden" @change="handleFileChange" ref="fileInput"
                        :disabled="isLoading" />
                    <div @click="!isLoading && $refs.fileInput.click()" class="flex flex-col items-center text-center">
                        <ArrowUpTrayIcon class="h-8 w-8 text-teal-400 mb-2 animate-pulse-slow" />
                        <p class="text-lg font-semibold text-gray-200">Drag and drop your file here</p>
                        <p class="text-sm text-gray-400">or click to browse</p>
                    </div>
                </label>
            </transition>

            <!-- ERROR STATE -->
            <transition name="fade">
                <div v-if="error"
                    class="mt-6 bg-red-700/60 text-white text-sm rounded-lg px-4 py-3 flex items-center gap-2">
                    <span>{{ error }}</span>
                    <button @click="resetFile" class="ml-auto text-white hover:text-gray-300">
                        <XCircleIcon class="h-5 w-5" />
                    </button>
                </div>
            </transition>

            <!-- PROGRESS BAR -->
            <transition name="fade">
                <div v-if="isLoading" class="mt-6">
                    <div class="w-full bg-gray-700/40 rounded-full h-3">
                        <div class="bg-teal-500 h-3 rounded-full transition-all" :style="{ width: progress + '%' }">
                        </div>
                    </div>
                    <div class="text-xs text-gray-300 mt-2 text-center">Processing... ({{ progress }}%)</div>
                </div>
            </transition>

            <!-- FILE DISPLAY + X BUTTON -->
            <transition name="fade-slide">
                <div v-if="store.file && !error" class="mt-6 relative">
                    <div
                        class="relative group bg-gray-800/50 rounded-xl border border-gray-600 p-4 flex items-center gap-4 transition hover:border-teal-500 hover:shadow-lg">
                        <DocumentTextIcon class="h-6 w-6 text-teal-400 flex-shrink-0" />
                        <div class="text-sm text-gray-200 truncate grow">
                            <p class="font-semibold truncate">{{ store.file.name }}</p>
                            <p class="text-xs text-gray-400">{{ formatSize(store.file.size) }} • {{ store.file.type }}</p>
                        </div>
                        <button @click="resetFile" class="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10"
                            :disabled="isLoading">
                            <XCircleIcon class="h-5 w-5" />
                        </button>
                    </div>
                    <div class="flex justify-end mt-4">
                        <button
                            class="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-2 rounded-lg text-sm transition"
                            @click="emitNext" :disabled="isLoading">
                            Continue
                        </button>
                    </div>
                </div>
            </transition>

            <!-- WHAT HAPPENS NEXT -->
            <Transition name="fade-slide">
                <div class="mt-14 border-t border-gray-700 pt-10 space-y-6">
                    <h2 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <SparklesIcon class="h-6 w-6 text-teal-400" />
                        <span>What happens next</span>
                    </h2>
                    <div class="grid sm:grid-cols-2 gap-6">
                        <div v-for="step in steps" :key="step.label" class="flex items-start gap-4 group">
                            <component :is="step.icon"
                                class="h-6 w-6 text-teal-400 flex-shrink-0 group-hover:text-teal-300 transition" />
                            <div>
                                <p class="text-sm font-semibold text-white mb-1">{{ step.label }}</p>
                                <p class="text-xs text-gray-400 leading-snug">{{ step.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import HeroComponent from '@/components/everhomes/ui/HeroComponent.vue'
import {
    WrenchScrewdriverIcon,
    ArrowUpTrayIcon,
    SparklesIcon,
    DocumentTextIcon,
    XCircleIcon,
    TableCellsIcon,
    DocumentMagnifyingGlassIcon,
    CodeBracketSquareIcon,
    CloudArrowUpIcon
} from '@heroicons/vue/24/solid'
import { useImportWizardStore } from '@/stores/useImportWizardStore'
import { useSpreadsheetParser } from '@/composables/everhomes/useSpreadsheetParser'
import { useTableExtractor } from '@/composables/everhomes/useTableExtractor'

const store = useImportWizardStore()
const { parseSpreadsheet } = useSpreadsheetParser()
const { extractTablesFromWorkbook, enrichParsedSheets } = useTableExtractor()

const isLoading = ref(false)
const progress = ref(0)
const error = ref(null)
const isDraggingOver = ref(false)
let cancelParse = null

const steps = [
    {
        label: 'Choose Sheets',
        description: 'Pick which sheets from your file contain actual data. Skip the fluff.',
        icon: TableCellsIcon
    },
    {
        label: 'Review Tables',
        description: 'Check headers, data types, and fill in any missing pieces.',
        icon: DocumentMagnifyingGlassIcon
    },
    {
        label: 'Normalize + Preview',
        description: 'We’ll clean your data and show you the final JSON structure.',
        icon: CodeBracketSquareIcon
    },
    {
        label: 'Push to Firestore',
        description: 'Save your versioned dataset with historical comparison and diffs.',
        icon: CloudArrowUpIcon
    }
]

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(1)} MB`
}

function handleFileChange(event) {
    const uploaded = event.target.files[0]
    if (uploaded) processFile(uploaded)
}

function handleDrop(event) {
    const dropped = event.dataTransfer.files[0]
    if (dropped) processFile(dropped)
    isDraggingOver.value = false
}

function handleDragEnter() { isDraggingOver.value = true }
function handleDragLeave() { isDraggingOver.value = false }

async function processFile(selectedFile) {
    store.setFile(selectedFile)
    isLoading.value = true
    progress.value = 0
    error.value = null

    let cancelled = false
    cancelParse = () => { cancelled = true }

    try {
        progress.value = 10
        const buffer = await selectedFile.arrayBuffer()
        if (cancelled) throw new Error('Parsing cancelled')
        await fakeDelay(200); progress.value = 30

        const workbook = XLSX.read(buffer, { type: 'array' })
        if (cancelled) throw new Error('Parsing cancelled')
        await fakeDelay(200); progress.value = 50

        const parsed = await parseSpreadsheet(selectedFile)
        if (cancelled) throw new Error('Parsing cancelled')
        await fakeDelay(200); progress.value = 70

        const extractedTables = extractTablesFromWorkbook(workbook)
        if (cancelled) throw new Error('Parsing cancelled')
        await fakeDelay(200); progress.value = 90

        const enriched = enrichParsedSheets(parsed, extractedTables)
        store.setParsedSheets(enriched)
        progress.value = 100

    } catch (err) {
        error.value = err.message || 'Failed to parse file'
        store.setFile(null)
    } finally {
        isLoading.value = false
        cancelParse = null
        isDraggingOver.value = false
        setTimeout(() => progress.value = 0, 500)
    }
}

function resetFile() {
    if (isLoading.value && cancelParse) cancelParse()
    store.setFile(null)
    isLoading.value = false
    progress.value = 0
    error.value = null
}


// Instead of router, emit 'next' when ready
function emitNext() {
    // You may want to validate here (e.g., require file before proceeding)
    if (store.file && !isLoading.value && !error.value) {
        // Could check additional requirements here
        emit('next')
    }
    else {
        console.log('[UPLOAD STEP] error value:', error.value)
        console.log('[UPLOAD STEP] store.file value:', store.file)
        console.log('[UPLOAD STEP] isLoading value:', isLoading.value)
    }
}

function fakeDelay(ms) {
    return new Promise(res => setTimeout(res, ms))
}

const emit = defineEmits(['next'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active,
.fade-slide-enter-active,
.fade-slide-leave-active,
.fade-collapse-enter-active,
.fade-collapse-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(12px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

.fade-collapse-enter-from,
.fade-collapse-leave-to {
    opacity: 0;
    max-height: 0;
    padding: 0;
    margin: 0;
    overflow: hidden;
}

.animate-pulse-slow {
    animation: pulse 2.5s infinite;
}

.group:hover .group-hover\:opacity-100 {
    opacity: 1;
}

.group:hover .group-hover\:shadow-lg {
    box-shadow: 0 0 10px rgba(45, 212, 191, 0.2);
}
</style>