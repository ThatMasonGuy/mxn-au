<template>
    <LayoutComponent :header="true" :footer="true">
        <HeroComponent :heading="'Import a Dataset'"
            :byline="'Upload your spreadsheet to begin extracting and cleaning data. Works best with NDIS benchmark files (.xlsx or .csv).'"
            :icon="WrenchScrewdriverIcon" />

        <div class="max-w-3xl mx-auto px-4 py-10">
            <!-- DROPZONE CONTAINER -->
            <transition name="fade-collapse">
                <label v-if="!file"
                    class="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 sm:p-16 cursor-pointer transition-colors duration-200 bg-gray-800/40 group"
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

            <!-- LOADING STATE -->
            <Transition name="fade">
                <div v-if="isLoading" class="mt-6 text-yellow-300 text-center animate-pulse text-sm">
                    Processing file, hang tight...
                </div>
            </Transition>

            <!-- FILE DISPLAY + CONTINUE -->
            <Transition name="fade-slide">
                <div v-if="file && !isLoading" class="mt-6 space-y-4">
                    <!-- File Card -->
                    <div
                        class="relative group bg-gray-800/50 rounded-xl border border-gray-600 p-4 flex items-center gap-4 transition hover:border-teal-500 hover:shadow-lg">
                        <DocumentTextIcon class="h-6 w-6 text-teal-400 flex-shrink-0" />

                        <div class="text-sm text-gray-200 truncate grow">
                            <p class="font-semibold truncate">{{ file.name }}</p>
                            <p class="text-xs text-gray-400">{{ formatSize(file.size) }} • {{ file.type }}</p>
                        </div>

                        <!-- Trash button -->
                        <button @click="resetFile"
                            class="text-gray-400 hover:text-red-500 transition-opacity opacity-0 group-hover:opacity-100"
                            title="Remove file">
                            <TrashIcon class="h-5 w-5" />
                        </button>
                    </div>

                    <!-- Continue Button -->
                    <div class="flex justify-end">
                        <button
                            class="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-2 rounded-lg text-sm transition"
                            @click="continueToSheetSelector">
                            Continue
                        </button>
                    </div>
                </div>
            </Transition>

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
    </LayoutComponent>
</template>

<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import LayoutComponent from '@/components/everhomes/layouts/LayoutComponent.vue'
import HeroComponent from '@/components/everhomes/ui/HeroComponent.vue'
import {
    WrenchScrewdriverIcon,
    ArrowUpTrayIcon,
    SparklesIcon,
    DocumentTextIcon,
    TrashIcon,
    TableCellsIcon,
    DocumentMagnifyingGlassIcon,
    CodeBracketSquareIcon,
    CloudArrowUpIcon
} from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import { useImportStore } from '@/composables/everhomes/useImportStore'
import { useSpreadsheetParser } from '@/composables/everhomes/useSpreadsheetParser'
import { useTableExtractor } from '@/composables/everhomes/useTableExtractor'

const { parseSpreadsheet } = useSpreadsheetParser()
const { extractTablesFromWorkbook, enrichParsedSheets } = useTableExtractor()
const { file: importFile, setParsedSheets } = useImportStore()
const router = useRouter()

const file = ref(null)
const isLoading = ref(false)

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

function handleFileChange(event) {
    const uploaded = event.target.files[0]
    if (uploaded) processFile(uploaded)
}

function handleDrop(event) {
    const dropped = event.dataTransfer.files[0]
    if (dropped) processFile(dropped)
    isDraggingOver.value = false
}

async function processFile(selectedFile) {
    file.value = selectedFile
    importFile.value = selectedFile
    isLoading.value = true

    try {
        const buffer = await selectedFile.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })

        const parsed = await parseSpreadsheet(selectedFile)
        const extractedTables = extractTablesFromWorkbook(workbook)
        const enriched = enrichParsedSheets(parsed, extractedTables)

        setParsedSheets(enriched)
    } catch (err) {
        console.error('Failed to parse file:', err)
    }

    isLoading.value = false
}

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(1)} MB`
}

function resetFile() {
    file.value = null
    isLoading.value = false
}

function continueToSheetSelector() {
    router.push({ name: 'SheetSelector' })
}

const isDraggingOver = ref(false)

function handleDragEnter() {
    isDraggingOver.value = true
}
function handleDragLeave() {
    isDraggingOver.value = false
}
</script>

<style scoped>
/* Global or <style scoped> */

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

.group:hover .group-hover\\:opacity-100 {
    opacity: 1;
}

.group:hover .group-hover\\:shadow-lg {
    box-shadow: 0 0 10px rgba(45, 212, 191, 0.2);
}
</style>