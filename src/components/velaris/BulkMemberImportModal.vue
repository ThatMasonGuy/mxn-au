<template>
    <Dialog :open="true" @update:open="handleDialogClose">
        <DialogContent class="w-full max-w-xl max-h-[80vh] overflow-y-auto bg-slate-900 border border-slate-700">
            <DialogTitle class="text-2xl font-bold text-white">Bulk Member Import</DialogTitle>
            <DialogDescription class="text-sm text-slate-400 -mt-2 mb-4">
                Upload a csv file to bulk import members.
            </DialogDescription>
            <p class="text-sm text-slate-400 mb-4">
                Download the template, fill it out, and upload it here to begin importing members. You'll review and
                confirm in the next step.
            </p>

            <!-- Download Template -->
            <div class="mt-4 text-left">
                <Button variant="link" class="text-blue-400 p-0 h-auto text-sm" @click="downloadTemplateCsv">
                    📄 Download CSV Template
                </Button>
            </div>

            <!-- File Upload -->
            <div class="mt-4">
                <Label class="text-white text-sm mb-1 mr-2">Upload CSV</Label>
                <input type="file" accept=".csv" @change="handleCSVUpload"
                    class="bg-slate-800 p-2 text-slate-200 text-sm" />
            </div>

            <!-- Upload Summary -->
            <div v-if="summary.total > 0" class="mt-6">
                <h3 class="text-white font-semibold mb-2 text-sm">Summary</h3>
                <ul class="text-sm text-slate-300 space-y-1">
                    <li>✅ {{ summary.success }} new member(s) ready</li>
                    <li>⚠️ {{ summary.conflicts }} conflict(s) detected</li>
                    <li>❌ {{ summary.errors }} row(s) had errors and were skipped</li>
                </ul>

                <div class="text-right mt-4">
                    <Button @click="goToReview" :disabled="summary.success + summary.conflicts === 0">
                        Next → Review Table
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
        name: 'funkyfrog', role: 'R4', status: 'active', power: 41400000, castle: 39, country: 'United States',
        discord: 'funkyfrog', server: 's10154', gameUid: '1234567890',
        notes: 'Always performs well in events', otherNames: 'froggy,frog,frogvader', joinedAt: '18/09/2024', locked: 'FALSE'
    }

    const csvContent = [
        headers.join(','),
        headers.map(h => `"${String(exampleRow[h] ?? '').replace(/"/g, '""')}"`).join(',')
    ].join('\r\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'member-template.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

const handleCSVUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

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