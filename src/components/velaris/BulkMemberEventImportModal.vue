<template>
    <div>
        <Dialog :open="true" @update:open="$emit('close')">
            <DialogContent class="max-w-xl bg-slate-900 border border-slate-700 text-slate-200">
                <DialogHeader>
                    <DialogTitle class="text-xl font-bold text-white">Import Player Spreadsheet</DialogTitle>
                    <DialogDescription class="text-slate-400">
                        Upload a file and match names to existing members.
                    </DialogDescription>
                </DialogHeader>

                <div v-if="loading" class="py-8 flex justify-center items-center">
                    <svg class="animate-spin h-8 w-8 text-indigo-400 mr-3" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
                            fill="none" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span class="text-slate-300 text-lg">Loading members...</span>
                </div>

                <div v-else>
                    <div class="py-4">
                        <Input type="file" accept=".xlsx,.xls,.csv" @change="handleFileUpload" />
                    </div>

                    <div class="flex justify-end pt-2">
                        <Button variant="outline" @click="$emit('close')">Cancel</Button>
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMembers } from '@/composables/topheroes/admin/useMembers'
import BulkMemberEventImportReviewModal from './BulkMemberEventImportReviewModal.vue'

const emit = defineEmits(['close', 'review-matches', 'finalize'])
const { members, loadMembers } = useMembers()
const matchedRows = ref([])
const loading = ref(true)

function normalizeKeys(obj) {
    const out = {}
    for (const k in obj) {
        out[k.trim().toLowerCase()] = obj[k]
    }
    return out
}

const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

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
                selectedMemberId: null
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
            console.log(members)
        }
    }, { immediate: true })
})
</script>