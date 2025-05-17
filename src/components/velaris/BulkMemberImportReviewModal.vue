<template>
    <Dialog :open="true" @update:open="handleDialogClose">
        <DialogContent class="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700">
            <DialogTitle class="text-2xl font-bold text-white">Review & Confirm Members</DialogTitle>
            <DialogDescription class="text-sm text-slate-400 -mt-2 mb-4">
                Review and finalize the member import below.
            </DialogDescription>
            <p class="text-sm text-slate-400 mb-4">
                Double-check the data below. Conflicts are highlighted. Fix any validation issues before confirming.
            </p>

            <div class="overflow-x-auto max-h-[65vh]">
                <table class="w-full text-sm border border-slate-700 rounded">
                    <thead class="bg-slate-800 text-slate-200 sticky top-0 z-10">
                        <tr>
                            <th class="p-2 bg-slate-800">Import</th>
                            <th class="p-2 bg-slate-800">Name</th>
                            <th class="p-2 bg-slate-800">Game UID</th>
                            <th class="p-2 bg-slate-800">Role</th>
                            <th class="p-2 bg-slate-800">Status</th>
                            <th class="p-2 bg-slate-800">Power</th>
                            <th class="p-2 bg-slate-800">Castle</th>
                            <th class="p-2 bg-slate-800">Country</th>
                            <th class="p-2 bg-slate-800">Discord</th>
                            <th class="p-2 bg-slate-800">Server</th>
                            <th class="p-2 bg-slate-800">Notes</th>
                            <th class="p-2 bg-slate-800">Other Names</th>
                            <th class="p-2 bg-slate-800">Conflict</th>
                            <th class="p-2 bg-slate-800">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, i) in editableRows" :key="i" :class="[
                            'border-t border-slate-700',
                            row.isConflict ? 'bg-red-950' : 'bg-slate-800'
                        ]">
                            <td class="p-2 text-center">
                                <input type="checkbox" v-model="row.import" />
                            </td>
                            <td class="p-2">
                                <div :class="invalidClass(i, 'name')" contenteditable
                                    @input="updateCell(i, 'name', $event)">{{ row.name }}</div>
                            </td>
                            <td class="p-2">
                                <div :class="invalidClass(i, 'gameUid', true)" contenteditable
                                    @input="updateCell(i, 'gameUid', $event)">{{ row.gameUid }}</div>
                            </td>
                            <td class="p-2">
                                <div contenteditable @input="updateCell(i, 'role', $event)">{{ row.role }}</div>
                            </td>
                            <td class="p-2">
                                <div contenteditable @input="updateCell(i, 'status', $event)">{{ row.status }}</div>
                            </td>
                            <td class="p-2">
                                <div :class="invalidClass(i, 'power', true)" contenteditable
                                    @input="updateCell(i, 'power', $event)">{{ row.power }}</div>
                            </td>
                            <td class="p-2">
                                <div :class="invalidClass(i, 'castle', true)" contenteditable
                                    @input="updateCell(i, 'castle', $event)">{{ row.castle }}</div>
                            </td>
                            <td class="p-2">
                                <div contenteditable @input="updateCell(i, 'country', $event)">{{ row.country }}</div>
                            </td>
                            <td class="p-2">
                                <div contenteditable @input="updateCell(i, 'discord', $event)">{{ row.discord }}</div>
                            </td>
                            <td class="p-2">
                                <div contenteditable @input="updateCell(i, 'server', $event)">{{ row.server }}</div>
                            </td>
                            <td class="p-2">
                                <div contenteditable @input="updateCell(i, 'notes', $event)">{{ row.notes }}</div>
                            </td>
                            <td class="p-2">
                                <div contenteditable @input="updateCell(i, 'otherNames', $event)">{{
                                    row.otherNames?.join(', ') }}</div>
                            </td>
                            <td class="p-2 text-red-400 font-semibold text-xs">
                                <span v-if="row.isConflict">Conflict</span>
                            </td>
                            <td class="p-2" v-if="row.isConflict">
                                <select v-model="row.conflictAction" class="bg-slate-700 text-white text-xs rounded">
                                    <option value="merge">Merge</option>
                                    <option value="skip">Skip</option>
                                </select>
                            </td>
                            <td v-else class="p-2 text-slate-400 text-xs italic">New</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="text-right mt-6">
                <Button @click="confirmImport" :disabled="!hasImportableRows || submitting">
                    {{ submitting ? 'Importing...' : 'Confirm & Import' }}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getAuth } from 'firebase/auth'
import { useMembers } from '@/composables/topheroes/admin/useMembers'
import { useToast } from '@/components/ui/toast';

const { toast } = useToast();

const props = defineProps({ rows: Array })
const emit = defineEmits(['close', 'imported'])
const submitting = ref(false)

const editableRows = ref(props.rows.map(row => ({
    ...row,
    import: true,
    otherNames: Array.isArray(row.otherNames) ? row.otherNames : (row.otherNames?.split(',') || [])
})))

const handleDialogClose = (val) => {
    if (!val) emit('close')
}

const { addMember } = useMembers()

const updateCell = (i, field, e) => {
    const text = e.target.innerText.trim()
    editableRows.value[i][field] = field === 'power' || field === 'castle' ? Number(text) : text
}

const invalidClass = (i, field, numeric = false) => {
    const val = editableRows.value[i][field]
    if (!val || (numeric && isNaN(val))) {
        return 'bg-red-900/40 text-red-200 px-1 rounded'
    }
    return ''
}

const hasImportableRows = computed(() =>
    editableRows.value.some(row => row.import && row.conflictAction !== 'skip' && isValidRow(row))
)

const isValidRow = (row) => {
    return row.name && !isNaN(row.power) && !isNaN(row.castle)
}

const confirmImport = async () => {
    submitting.value = true
    try {
        const auth = getAuth()
        const uid = auth.currentUser?.uid || 'unknown'

        const rowsToImport = editableRows.value.filter(row =>
            row.import && row.conflictAction !== 'skip' && isValidRow(row)
        )

        for (const row of rowsToImport) {
            await addMember({
                ...row,
                power: Number(row.power),
                castle: Number(row.castle),
                gameUid: Number(row.gameUid),
                otherNames: row.otherNames,
                addedBy: uid,
                updatedBy: uid,
                joinedAt: new Date(),
                locked: Boolean(row.locked) ?? false,
                history: []
            })
        }

        toast({
            variant: 'success',
            title: 'Import successful',
            description: `${rowsToImport.length} member(s) were added.`
        })

        emit('imported')
        emit('close')

    } catch (err) {
        toast({
            variant: 'destructive',
            title: 'Import failed',
            description: 'Something went wrong while importing.'
        })
        console.error(err)
    } finally {
        submitting.value = false
    }
}
</script>

<style scoped>
div[contenteditable] {
    min-width: 80px;
    padding: 2px 4px;
    border-radius: 4px;
    background-color: transparent;
    outline: none;
    white-space: nowrap;
}

div[contenteditable]:focus {
    background-color: #1f2937;
    border: 1px solid #4b5563;
}
</style>