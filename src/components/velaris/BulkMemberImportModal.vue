<template>
    <Dialog :open="true" @update:open="handleDialogClose">
        <DialogContent
            class="w-full max-w-3xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-700/50 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <!-- Animated background elements -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div
                    class="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000">
                </div>
            </div>

            <!-- Scrollable content -->
            <div class="relative z-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
                <!-- Enhanced Header -->
                <div class="border-b border-slate-700/50 pb-6 mb-6">
                    <div class="flex items-center gap-4 mb-4">
                        <div
                            class="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Upload class="w-6 h-6 text-white" />
                        </div>
                        <div class="space-y-2">
                            <DialogTitle
                                class="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                                Bulk Member Import
                            </DialogTitle>
                            <DialogDescription class="text-slate-400">
                                Upload a CSV file to bulk import multiple members at once.
                            </DialogDescription>
                        </div>
                    </div>

                    <div class="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                        <div class="flex items-start gap-3">
                            <Info class="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div class="text-sm text-slate-300 space-y-2">
                                <p>Follow these steps to import your members:</p>
                                <ol class="list-decimal list-inside space-y-1 text-slate-400 ml-4">
                                    <li>Download the CSV template using the button below</li>
                                    <li>Fill out the template with your member data</li>
                                    <li>Upload the completed CSV file</li>
                                    <li>Review and confirm the import</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Download Template Section -->
                <div class="mb-8">
                    <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FileDown class="w-5 h-5 text-cyan-400" />
                        Step 1: Download Template
                    </h3>

                    <div class="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div class="space-y-2">
                                <p class="text-slate-300">Download the CSV template with example data and proper
                                    formatting.</p>
                                <div class="flex items-center gap-2 text-xs text-slate-500">
                                    <Database class="w-3 h-3" />
                                    <span>Includes all required fields and sample data</span>
                                </div>
                            </div>
                            <Button @click="downloadTemplateCsv"
                                class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 group">
                                <FileDown class="w-4 h-4 mr-2 group-hover:animate-bounce" />
                                Download Template
                            </Button>
                        </div>
                    </div>
                </div>

                <!-- Upload Section -->
                <div class="mb-8">
                    <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Upload class="w-5 h-5 text-purple-400" />
                        Step 2: Upload CSV File
                    </h3>

                    <div class="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                        <div class="space-y-4">
                            <Label class="text-slate-300 font-medium text-sm">Choose CSV File</Label>

                            <!-- Enhanced file upload area -->
                            <div class="relative">
                                <input type="file" accept=".csv" @change="handleCSVUpload"
                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    id="csvUpload" />
                                <div
                                    class="border-2 border-dashed border-slate-600/50 rounded-xl p-8 text-center hover:border-slate-500/70 hover:bg-slate-800/20 transition-all duration-300 group cursor-pointer">
                                    <div class="space-y-3">
                                        <div
                                            class="w-16 h-16 mx-auto bg-slate-700/50 rounded-2xl flex items-center justify-center group-hover:bg-slate-700/70 transition-all duration-300">
                                            <FileSpreadsheet
                                                class="w-8 h-8 text-slate-400 group-hover:text-slate-300" />
                                        </div>
                                        <div class="space-y-1">
                                            <p class="text-slate-300 font-medium">Drop your CSV file here, or click to
                                                browse</p>
                                            <p class="text-xs text-slate-500">Supported formats: .csv (max 10MB)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Upload Results -->
                <div v-if="summary.total > 0" class="mb-8">
                    <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <BarChart3 class="w-5 h-5 text-green-400" />
                        Step 3: Review Results
                    </h3>

                    <div class="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                        <!-- Summary Cards -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div class="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                                <div class="flex items-center gap-3 mb-2">
                                    <FileText class="w-5 h-5 text-blue-400" />
                                    <span class="text-xs uppercase text-slate-400 font-semibold">Total Rows</span>
                                </div>
                                <div class="text-white font-bold text-2xl">{{ summary.total }}</div>
                            </div>

                            <div class="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                                <div class="flex items-center gap-3 mb-2">
                                    <CheckCircle class="w-5 h-5 text-green-400" />
                                    <span class="text-xs uppercase text-slate-400 font-semibold">Ready</span>
                                </div>
                                <div class="text-green-400 font-bold text-2xl">{{ summary.success }}</div>
                            </div>

                            <div class="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                                <div class="flex items-center gap-3 mb-2">
                                    <AlertTriangle class="w-5 h-5 text-yellow-400" />
                                    <span class="text-xs uppercase text-slate-400 font-semibold">Conflicts</span>
                                </div>
                                <div class="text-yellow-400 font-bold text-2xl">{{ summary.conflicts }}</div>
                            </div>

                            <div class="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                                <div class="flex items-center gap-3 mb-2">
                                    <XCircle class="w-5 h-5 text-red-400" />
                                    <span class="text-xs uppercase text-slate-400 font-semibold">Errors</span>
                                </div>
                                <div class="text-red-400 font-bold text-2xl">{{ summary.errors }}</div>
                            </div>
                        </div>

                        <!-- Detailed Results -->
                        <div class="space-y-3">
                            <div v-if="summary.success > 0"
                                class="flex items-center gap-3 p-3 bg-green-900/20 border border-green-800/30 rounded-lg">
                                <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
                                <div class="text-sm">
                                    <span class="text-green-300 font-semibold">{{ summary.success }}</span>
                                    <span class="text-slate-300"> new member{{ summary.success !== 1 ? 's' : '' }} ready
                                        to import</span>
                                </div>
                            </div>

                            <div v-if="summary.conflicts > 0"
                                class="flex items-center gap-3 p-3 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
                                <AlertTriangle class="w-5 h-5 text-yellow-400 flex-shrink-0" />
                                <div class="text-sm">
                                    <span class="text-yellow-300 font-semibold">{{ summary.conflicts }}</span>
                                    <span class="text-slate-300"> conflict{{ summary.conflicts !== 1 ? 's' : '' }}
                                        detected (existing members found)</span>
                                </div>
                            </div>

                            <div v-if="summary.errors > 0"
                                class="flex items-center gap-3 p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
                                <XCircle class="w-5 h-5 text-red-400 flex-shrink-0" />
                                <div class="text-sm">
                                    <span class="text-red-300 font-semibold">{{ summary.errors }}</span>
                                    <span class="text-slate-300"> row{{ summary.errors !== 1 ? 's' : '' }} had errors
                                        and will be skipped</span>
                                </div>
                            </div>
                        </div>

                        <!-- Progress Bar -->
                        <div class="mt-6">
                            <div class="flex justify-between text-xs text-slate-400 mb-2">
                                <span>Import Progress</span>
                                <span>{{ Math.round(((summary.success + summary.conflicts) / summary.total) * 100) }}%
                                    processable</span>
                            </div>
                            <div class="w-full bg-slate-700 rounded-full h-2">
                                <div class="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full transition-all duration-700"
                                    :style="{ width: `${((summary.success + summary.conflicts) / summary.total) * 100}%` }">
                                </div>
                            </div>
                        </div>

                        <!-- Action Button -->
                        <div class="flex justify-end mt-6">
                            <Button @click="goToReview" :disabled="summary.success + summary.conflicts === 0"
                                class="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Eye class="w-4 h-4 mr-2" />
                                Review & Import
                                <ArrowRight class="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-if="summary.total === 0" class="text-center py-12">
                    <div
                        class="w-20 h-20 mx-auto mb-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center justify-center">
                        <FileSpreadsheet class="w-10 h-10 text-slate-500" />
                    </div>
                    <h3 class="text-xl font-semibold text-slate-400 mb-2">No File Uploaded</h3>
                    <p class="text-slate-500 mb-6">Upload a CSV file to begin the bulk import process.</p>
                    <Button @click="() => document.getElementById('csvUpload').click()" variant="outline"
                        class="bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/70 hover:border-slate-500/70">
                        <Upload class="w-4 h-4 mr-2" />
                        Choose File
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>

    <BulkMemberImportReviewModal v-if="reviewRows.length" :rows="reviewRows" @close="reviewing = false"
        @imported="handleImportComplete" />
</template>

<script setup>
import { ref } from 'vue'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Upload, Info, FileDown, Database, FileSpreadsheet, BarChart3,
    FileText, CheckCircle, AlertTriangle, XCircle, Eye, ArrowRight
} from 'lucide-vue-next'
import Papa from 'papaparse'
import { useMembers } from '@/composables/topheroes/admin/useMembers'
import BulkMemberImportReviewModal from './BulkMemberImportReviewModal.vue'

const emit = defineEmits(['close', 'imported', 'ready'])

const reviewing = ref(false)
const reviewRows = ref([])
const uploadedRows = ref([])
const { members } = useMembers()

const summary = ref({ total: 0, success: 0, conflicts: 0, errors: 0 })

const handleDialogClose = (val) => {
    if (!val) emit('close')
}

const downloadTemplateCsv = () => {
    const headers = [
        'name', 'role', 'status', 'power', 'castle', 'country', 'discord', 'server', 'gameUid', 'notes', 'otherNames', 'joinedAt', 'locked'
    ]

    const exampleRow = {
        name: 'funkyfrog',
        role: 'R4',
        status: 'active',
        power: 41400000,
        castle: 39,
        country: 'United States',
        discord: 'funkyfrog',
        server: 's10154',
        gameUid: '1234567890',
        notes: 'Always performs well in events',
        otherNames: 'froggy,frog,frogvader',
        joinedAt: '18/09/2024',
        locked: 'FALSE'
    }

    const csvContent = [
        headers.join(','),
        headers.map(h => `"${String(exampleRow[h] ?? '').replace(/"/g, '""')}"`).join(',')
    ].join('\r\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'member-import-template.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

const handleCSVUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Reset summary
    summary.value = { total: 0, success: 0, conflicts: 0, errors: 0 }

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            const cleaned = []
            let success = 0
            let conflicts = 0
            let errors = 0

            for (const row of results.data) {
                const cleanedGameUid = row.gameUid?.toString().replace(/[^0-9]/g, '')
                const gameUidNum = cleanedGameUid ? Number(cleanedGameUid) : null
                const lockedBool = String(row.locked).toLowerCase() === 'true'

                const valid = row.name && row.role && !isNaN(Number(row.power)) && !isNaN(Number(row.castle))
                if (!valid) {
                    errors++
                    continue
                }

                const conflict = members.value.some(
                    m => m.gameUid === gameUidNum || m.name === row.name
                )

                if (conflict) conflicts++
                else success++

                cleaned.push({
                    ...row,
                    gameUid: gameUidNum,
                    power: Number(row.power),
                    castle: Number(row.castle),
                    locked: lockedBool,
                    otherNames: row.otherNames?.split(',').map(n => n.trim()) || [],
                    conflictAction: conflict ? 'merge' : null,
                    isConflict: conflict,
                    isValid: valid
                })
            }

            uploadedRows.value = cleaned
            summary.value = {
                total: results.data.length,
                success,
                conflicts,
                errors
            }
        }
    })
}

const goToReview = () => {
    reviewRows.value = uploadedRows.value.filter(r => r.isValid)
    reviewing.value = true
}

const handleImportComplete = () => {
    reviewing.value = false
    emit('imported')
}
</script>

<style scoped>
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(6, 182, 212, 0.5) rgba(51, 65, 85, 0.3);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(51, 65, 85, 0.3);
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #06b6d4, #3b82f6);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #0891b2, #2563eb);
}

/* File upload hover effects */
.group:hover .animate-bounce {
    animation: bounce 1s infinite;
}

/* Progress bar animation */
@keyframes slideIn {
    from {
        width: 0%;
    }

    to {
        width: var(--final-width);
    }
}
</style>