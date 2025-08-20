<template>
    <Dialog :open="true" @update:open="handleDialogClose">
        <DialogContent
            class="w-full max-w-7xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-700/50 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <!-- Animated background elements -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div
                    class="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000">
                </div>
            </div>

            <!-- Scrollable content -->
            <div class="relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <!-- Enhanced Header -->
                <div class="border-b border-slate-700/50 pb-6 mb-6">
                    <div class="flex items-center gap-4 mb-4">
                        <div
                            class="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 border border-green-500/30 flex items-center justify-center shadow-lg shadow-green-500/20">
                            <CheckCircle class="w-6 h-6 text-white" />
                        </div>
                        <div class="space-y-2">
                            <DialogTitle
                                class="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
                                Review & Confirm Import
                            </DialogTitle>
                            <DialogDescription class="text-slate-400">
                                Review and finalize the member import below. Fix any issues before confirming.
                            </DialogDescription>
                        </div>
                    </div>

                    <div class="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                        <div class="flex items-start gap-3">
                            <AlertTriangle class="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <div class="text-sm text-slate-300 space-y-2">
                                <p class="font-medium">Review Instructions:</p>
                                <ul class="list-disc list-inside space-y-1 text-slate-400 ml-4">
                                    <li>Edit cells directly by clicking on them</li>
                                    <li>Conflicts are highlighted in red - choose merge or skip</li>
                                    <li>Uncheck rows you don't want to import</li>
                                    <li>Required fields: Name, Power, Castle</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Import Statistics -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30">
                        <div class="flex items-center gap-3 mb-2">
                            <FileText class="w-5 h-5 text-blue-400" />
                            <span class="text-xs uppercase text-slate-400 font-semibold">Total Rows</span>
                        </div>
                        <div class="text-white font-bold text-2xl">{{ editableRows.length }}</div>
                    </div>

                    <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30">
                        <div class="flex items-center gap-3 mb-2">
                            <CheckCircle class="w-5 h-5 text-green-400" />
                            <span class="text-xs uppercase text-slate-400 font-semibold">To Import</span>
                        </div>
                        <div class="text-green-400 font-bold text-2xl">{{ importCount }}</div>
                    </div>

                    <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30">
                        <div class="flex items-center gap-3 mb-2">
                            <AlertTriangle class="w-5 h-5 text-yellow-400" />
                            <span class="text-xs uppercase text-slate-400 font-semibold">Conflicts</span>
                        </div>
                        <div class="text-yellow-400 font-bold text-2xl">{{ conflictCount }}</div>
                    </div>

                    <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30">
                        <div class="flex items-center gap-3 mb-2">
                            <XCircle class="w-5 h-5 text-red-400" />
                            <span class="text-xs uppercase text-slate-400 font-semibold">Invalid</span>
                        </div>
                        <div class="text-red-400 font-bold text-2xl">{{ invalidCount }}</div>
                    </div>
                </div>

                <!-- Enhanced Table -->
                <div class="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                    <div class="overflow-x-auto max-h-[60vh] custom-scrollbar">
                        <table class="w-full text-sm">
                            <thead
                                class="bg-gradient-to-r from-slate-800 to-slate-700 text-slate-200 sticky top-0 z-10 border-b border-slate-600/50">
                                <tr>
                                    <th class="p-4 text-left border-r border-slate-600/30">
                                        <div class="flex items-center gap-2">
                                            <input type="checkbox" :checked="allSelected" @change="toggleAllSelection"
                                                class="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2" />
                                            <span class="font-semibold">Import</span>
                                        </div>
                                    </th>
                                    <th class="p-4 text-left border-r border-slate-600/30 font-semibold">Name</th>
                                    <th class="p-4 text-left border-r border-slate-600/30 font-semibold">Game UID</th>
                                    <th class="p-4 text-left border-r border-slate-600/30 font-semibold">Role</th>
                                    <th class="p-4 text-left border-r border-slate-600/30 font-semibold">Status</th>
                                    <th class="p-4 text-left border-r border-slate-600/30 font-semibold">Power</th>
                                    <th class="p-4 text-left border-r border-slate-600/30 font-semibold">Castle</th>
                                    <th class="p-4 text-left border-r border-slate-600/30 font-semibold">Country</th>
                                    <th class="p-4 text-left border-r border-slate-600/30 font-semibold">Discord</th>
                                    <th class="p-4 text-left border-r border-slate-600/30 font-semibold">Server</th>
                                    <th class="p-4 text-left border-r border-slate-600/30 font-semibold">Notes</th>
                                    <th class="p-4 text-left border-r border-slate-600/30 font-semibold">Other Names
                                    </th>
                                    <th class="p-4 text-left border-r border-slate-600/30 font-semibold">Status</th>
                                    <th class="p-4 text-left font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, i) in editableRows" :key="i" :class="[
                                    'border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors duration-200',
                                    row.isConflict ? 'bg-red-950/30' : 'bg-slate-800/20',
                                    !row.import && 'opacity-50'
                                ]">
                                    <td class="p-4 border-r border-slate-700/20">
                                        <input type="checkbox" v-model="row.import"
                                            class="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2" />
                                    </td>
                                    <td class="p-4 border-r border-slate-700/20">
                                        <div :class="[
                                            'min-w-[100px] p-2 rounded-lg transition-all duration-200 text-white bg-slate-700/50 border border-slate-600/30 focus:border-cyan-500/50 focus:bg-slate-600/70 outline-none',
                                            invalidClass(i, 'name')
                                        ]" contenteditable @input="updateCell(i, 'name', $event)"
                                            @focus="$event.target.style.background = 'rgba(51, 65, 85, 0.8)'"
                                            @blur="$event.target.style.background = 'rgba(51, 65, 85, 0.5)'">
                                            {{ row.name }}
                                        </div>
                                    </td>
                                    <td class="p-4 border-r border-slate-700/20">
                                        <div :class="[
                                            'min-w-[120px] p-2 rounded-lg transition-all duration-200 text-white bg-slate-700/50 border border-slate-600/30 focus:border-cyan-500/50 focus:bg-slate-600/70 outline-none',
                                            invalidClass(i, 'gameUid', true)
                                        ]" contenteditable @input="updateCell(i, 'gameUid', $event)">
                                            {{ row.gameUid }}
                                        </div>
                                    </td>
                                    <td class="p-4 border-r border-slate-700/20">
                                        <select v-model="row.role"
                                            class="w-full p-2 bg-slate-700/80 border border-slate-600/50 text-white rounded-lg focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all">
                                            <option value="R5">R5</option>
                                            <option value="R4">R4</option>
                                            <option value="R3">R3</option>
                                            <option value="R2">R2</option>
                                            <option value="R1">R1</option>
                                        </select>
                                    </td>
                                    <td class="p-4 border-r border-slate-700/20">
                                        <select v-model="row.status"
                                            class="w-full p-2 bg-slate-700/80 border border-slate-600/50 text-white rounded-lg focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all">
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="left">Left</option>
                                            <option value="kicked">Kicked</option>
                                        </select>
                                    </td>
                                    <td class="p-4 border-r border-slate-700/20">
                                        <div :class="[
                                            'min-w-[100px] p-2 rounded-lg transition-all duration-200 text-white bg-slate-700/50 border border-slate-600/30 focus:border-cyan-500/50 focus:bg-slate-600/70 outline-none',
                                            invalidClass(i, 'power', true)
                                        ]" contenteditable @input="updateCell(i, 'power', $event)">
                                            {{ row.power }}
                                        </div>
                                    </td>
                                    <td class="p-4 border-r border-slate-700/20">
                                        <div :class="[
                                            'min-w-[80px] p-2 rounded-lg transition-all duration-200 text-white bg-slate-700/50 border border-slate-600/30 focus:border-cyan-500/50 focus:bg-slate-600/70 outline-none',
                                            invalidClass(i, 'castle', true)
                                        ]" contenteditable @input="updateCell(i, 'castle', $event)">
                                            {{ row.castle }}
                                        </div>
                                    </td>
                                    <td class="p-4 border-r border-slate-700/20">
                                        <div class="min-w-[120px] p-2 rounded-lg transition-all duration-200 text-white bg-slate-700/50 border border-slate-600/30 focus:border-cyan-500/50 focus:bg-slate-600/70 outline-none"
                                            contenteditable @input="updateCell(i, 'country', $event)">
                                            {{ row.country }}
                                        </div>
                                    </td>
                                    <td class="p-4 border-r border-slate-700/20">
                                        <div class="min-w-[100px] p-2 rounded-lg transition-all duration-200 text-white bg-slate-700/50 border border-slate-600/30 focus:border-cyan-500/50 focus:bg-slate-600/70 outline-none"
                                            contenteditable @input="updateCell(i, 'discord', $event)">
                                            {{ row.discord }}
                                        </div>
                                    </td>
                                    <td class="p-4 border-r border-slate-700/20">
                                        <div class="min-w-[80px] p-2 rounded-lg transition-all duration-200 text-white bg-slate-700/50 border border-slate-600/30 focus:border-cyan-500/50 focus:bg-slate-600/70 outline-none"
                                            contenteditable @input="updateCell(i, 'server', $event)">
                                            {{ row.server }}
                                        </div>
                                    </td>
                                    <td class="p-4 border-r border-slate-700/20">
                                        <div class="min-w-[150px] p-2 rounded-lg transition-all duration-200 text-white bg-slate-700/50 border border-slate-600/30 focus:border-cyan-500/50 focus:bg-slate-600/70 outline-none"
                                            contenteditable @input="updateCell(i, 'notes', $event)">
                                            {{ row.notes }}
                                        </div>
                                    </td>
                                    <td class="p-4 border-r border-slate-700/20">
                                        <div class="min-w-[150px] p-2 rounded-lg transition-all duration-200 text-white bg-slate-700/50 border border-slate-600/30 focus:border-cyan-500/50 focus:bg-slate-600/70 outline-none"
                                            contenteditable @input="updateCell(i, 'otherNames', $event)">
                                            {{ row.otherNames?.join(', ') }}
                                        </div>
                                    </td>
                                    <td class="p-4 border-r border-slate-700/20">
                                        <div v-if="row.isConflict" class="flex items-center gap-2">
                                            <AlertTriangle class="w-4 h-4 text-red-400" />
                                            <span class="text-red-400 font-semibold text-xs">Conflict</span>
                                        </div>
                                        <div v-else class="flex items-center gap-2">
                                            <CheckCircle class="w-4 h-4 text-green-400" />
                                            <span class="text-green-400 font-semibold text-xs">New</span>
                                        </div>
                                    </td>
                                    <td class="p-4">
                                        <div v-if="row.isConflict">
                                            <select v-model="row.conflictAction"
                                                class="w-full p-2 bg-slate-700/80 border border-slate-600/50 text-white rounded-lg focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-xs">
                                                <option value="merge">Merge</option>
                                                <option value="skip">Skip</option>
                                            </select>
                                        </div>
                                        <div v-else class="text-slate-500 text-xs italic text-center">
                                            Auto Import
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Enhanced Action Bar -->
                <div
                    class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-slate-700/50">
                    <div class="flex items-center gap-3 text-sm text-slate-400">
                        <Info class="w-4 h-4" />
                        <span>{{ importCount }} members ready to import</span>
                        <span v-if="conflictCount > 0" class="text-yellow-400">• {{ conflictCount }} conflicts</span>
                        <span v-if="invalidCount > 0" class="text-red-400">• {{ invalidCount }} invalid</span>
                    </div>

                    <div class="flex gap-3">
                        <Button variant="outline" @click="$emit('close')"
                            class="bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/70 hover:border-slate-500/70">
                            <X class="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button @click="confirmImport" :disabled="!hasImportableRows || submitting"
                            class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Upload v-if="!submitting" class="w-4 h-4 mr-2" />
                            <Loader2 v-else class="w-4 h-4 mr-2 animate-spin" />
                            {{ submitting ? 'Importing...' : `Import ${importCount} Members` }}
                        </Button>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
    CheckCircle, AlertTriangle, XCircle, FileText, Info, Upload, X, Loader2
} from 'lucide-vue-next'
import { getAuth } from 'firebase/auth'
import { useMembers } from '@/composables/topheroes/admin/useMembers'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()

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
    if (field === 'power' || field === 'castle') {
        editableRows.value[i][field] = Number(text) || 0
    } else if (field === 'otherNames') {
        editableRows.value[i][field] = text.split(',').map(name => name.trim()).filter(Boolean)
    } else {
        editableRows.value[i][field] = text
    }
}

const invalidClass = (i, field, numeric = false) => {
    const val = editableRows.value[i][field]
    if (!val || (numeric && isNaN(val))) {
        return 'border-red-500/50 bg-red-900/30 text-red-200'
    }
    return ''
}

const importCount = computed(() =>
    editableRows.value.filter(row => row.import && row.conflictAction !== 'skip' && isValidRow(row)).length
)

const conflictCount = computed(() =>
    editableRows.value.filter(row => row.isConflict).length
)

const invalidCount = computed(() =>
    editableRows.value.filter(row => !isValidRow(row)).length
)

const allSelected = computed(() =>
    editableRows.value.every(row => row.import)
)

const hasImportableRows = computed(() => importCount.value > 0)

const toggleAllSelection = (event) => {
    const checked = event.target.checked
    editableRows.value.forEach(row => {
        row.import = checked
    })
}

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
            title: 'Import Successful',
            description: `Successfully imported ${rowsToImport.length} member${rowsToImport.length !== 1 ? 's' : ''}.`
        })

        emit('imported')
        emit('close')

    } catch (err) {
        toast({
            variant: 'destructive',
            title: 'Import Failed',
            description: 'Something went wrong during the import process.'
        })
        console.error('Import error:', err)
    } finally {
        submitting.value = false
    }
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

/* Enhanced editable cell styling */
div[contenteditable]:hover {
    border-color: rgba(6, 182, 212, 0.3);
    background-color: rgba(30, 41, 59, 0.7);
}

div[contenteditable]:focus {
    outline: none;
    border-color: rgba(6, 182, 212, 0.5);
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

/* Table row hover effects */
tbody tr:hover {
    background-color: rgba(30, 41, 59, 0.3);
}

/* Enhanced form controls */
select:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

input[type="checkbox"]:checked {
    background-color: #06b6d4;
    border-color: #06b6d4;
}
</style>