<template>
    <div>
        <Dialog :open="true" @update:open="$emit('close')">
            <DialogContent class="max-w-2xl bg-slate-900 border border-slate-700 text-slate-200">
                <DialogHeader>
                    <DialogTitle class="text-xl font-bold text-white">Import Player Spreadsheet</DialogTitle>
                    <DialogDescription class="text-slate-400">
                        Upload a file and match names to existing members. Supports player names, ranks, and other data.
                    </DialogDescription>
                </DialogHeader>

                <div v-if="loading" class="py-12 flex flex-col justify-center items-center">
                    <svg class="animate-spin h-10 w-10 text-indigo-400 mb-4" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
                            fill="none" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span class="text-slate-300 text-lg font-medium">Loading members...</span>
                    <span class="text-slate-500 text-sm mt-1">Please wait while we prepare the matching system</span>
                </div>

                <div v-else class="space-y-6">
                    <!-- Drag & Drop Zone -->
                    <div class="relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200"
                        :class="[
                            dragActive
                                ? 'border-indigo-400 bg-indigo-50/5 scale-[1.02]'
                                : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/30'
                        ]" @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave"
                        @drop.prevent="handleDrop" @click="triggerFileInput">

                        <!-- Upload Icon -->
                        <div class="mb-4">
                            <div
                                class="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-400/30 flex items-center justify-center">
                                <Upload class="w-8 h-8 text-indigo-400" />
                            </div>
                        </div>

                        <!-- Upload Text -->
                        <div class="space-y-2">
                            <h3 class="text-lg font-semibold text-white">
                                {{ dragActive ? 'Drop your file here' : 'Choose a file or drag it here' }}
                            </h3>
                            <p class="text-sm text-slate-400">
                                Supports Excel (.xlsx, .xls) and CSV files
                            </p>
                            <div class="flex items-center justify-center gap-4 mt-4">
                                <div class="flex items-center gap-2 text-xs text-slate-500">
                                    <FileSpreadsheet class="w-4 h-4" />
                                    <span>.xlsx</span>
                                </div>
                                <div class="flex items-center gap-2 text-xs text-slate-500">
                                    <FileSpreadsheet class="w-4 h-4" />
                                    <span>.xls</span>
                                </div>
                                <div class="flex items-center gap-2 text-xs text-slate-500">
                                    <FileText class="w-4 h-4" />
                                    <span>.csv</span>
                                </div>
                            </div>
                        </div>

                        <!-- Hidden File Input -->
                        <input ref="fileInput" type="file" accept=".xlsx,.xls,.csv" @change="handleFileUpload"
                            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>

                    <!-- Expected Columns Info -->
                    <div
                        class="bg-gradient-to-br from-blue-950/30 to-indigo-950/30 rounded-lg p-4 border border-blue-800/30">
                        <div class="flex items-center gap-2 mb-3">
                            <Info class="w-5 h-5 text-blue-400" />
                            <h4 class="font-semibold text-blue-100">Expected Columns</h4>
                        </div>
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                            <div class="flex items-center gap-2 text-blue-200">
                                <div class="w-2 h-2 rounded-full bg-blue-400"></div>
                                <span>Name / Player Name / Player</span>
                            </div>
                            <div class="flex items-center gap-2 text-blue-200">
                                <div class="w-2 h-2 rounded-full bg-blue-400"></div>
                                <span>Rank</span>
                            </div>
                            <div class="flex items-center gap-2 text-blue-200">
                                <div class="w-2 h-2 rounded-full bg-blue-400"></div>
                                <span>Power</span>
                            </div>
                            <div class="flex items-center gap-2 text-blue-200">
                                <div class="w-2 h-2 rounded-full bg-blue-400"></div>
                                <span>Other data columns...</span>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end pt-2">
                        <Button variant="outline" @click="$emit('close')"
                            class="border-slate-600 text-slate-300 hover:bg-slate-800">
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <BulkMemberEventImportReviewModal v-if="matchedRows.length" :rows="matchedRows" @finalize="handleFinalized"
            @close="matchedRows = []" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as XLSX from 'xlsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, FileSpreadsheet, FileText, Info } from 'lucide-vue-next'
import { useMembers } from '@/composables/topheroes/admin/useMembers'
import BulkMemberEventImportReviewModal from './BulkMemberEventImportReviewModal.vue'

const emit = defineEmits(['close', 'review-matches', 'finalize'])
const { members, loadMembers } = useMembers()
const matchedRows = ref([])
const loading = ref(true)
const dragActive = ref(false)
const fileInput = ref(null)

function normalizeKeys(obj) {
    const out = {}
    for (const k in obj) {
        const normalizedKey = k.trim().toLowerCase()
        out[normalizedKey] = obj[k]
    }
    return out
}

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleDragOver = (e) => {
    e.preventDefault()
    dragActive.value = true
}

const handleDragLeave = (e) => {
    e.preventDefault()
    // Only set dragActive to false if we're actually leaving the drop zone
    if (!e.currentTarget.contains(e.relatedTarget)) {
        dragActive.value = false
    }
}

const handleDrop = (e) => {
    e.preventDefault()
    dragActive.value = false

    const files = e.dataTransfer.files
    if (files.length > 0) {
        processFile(files[0])
    }
}

const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    processFile(file)
}

const processFile = (file) => {
    const reader = new FileReader()
    reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json(sheet)

        matchedRows.value = rows.map((row) => {
            const raw = normalizeKeys(row)
            const name = (raw['name'] || raw['player name'] || raw['player'] || '').trim()
            const match = matchNameToMember(name, members.value)
            return {
                raw,
                match,
                selectedMemberId: null,
                excluded: false, // New field for exclusion functionality
                originalName: name // Store original name for otherNames functionality
            }
        })

        emit('review-matches', matchedRows.value)
    }
    reader.readAsArrayBuffer(file)
}

function matchNameToMember(name, memberList) {
    const lower = name?.toLowerCase?.() ?? '';
    if (!Array.isArray(memberList)) return { type: 'unmatched' };

    const exactMatches = memberList.filter(m => m.name?.toLowerCase() === lower);
    if (exactMatches.length === 1) return { type: 'exact', member: exactMatches[0] };

    const aliasMatches = memberList.filter(m => {
        let aliases = [];
        if (Array.isArray(m.otherNames)) {
            aliases = m.otherNames;
        } else if (typeof m.otherNames === 'string' && m.otherNames.length) {
            aliases = [m.otherNames];
        }
        return aliases.some(alias => alias?.toLowerCase?.() === lower);
    });
    if (aliasMatches.length === 1) return { type: 'alias', member: aliasMatches[0] };

    if (aliasMatches.length > 1) return { type: 'conflict', matches: aliasMatches };

    return { type: 'unmatched' };
}

function handleFinalized(data) {
    emit('finalize', data)
    matchedRows.value = []
}

onMounted(() => {
    loadMembers()
    watch(members, (val) => {
        if (val.length > 0) {
            loading.value = false
        }
    }, { immediate: true })
})
</script>