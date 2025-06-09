<template>
    <Dialog :open="true" @update:open="$emit('close')">
        <DialogContent class="max-w-4xl bg-slate-900 border border-slate-700 text-slate-200">
            <DialogHeader>
                <DialogTitle class="text-xl font-bold text-white">Review Imported Players</DialogTitle>
                <DialogDescription class="text-slate-400">
                    Match imported names to existing members before finalizing.
                </DialogDescription>
            </DialogHeader>

            <div class="mt-4 max-h-[60vh] overflow-y-auto">
                <table class="w-full text-sm">
                    <thead class="text-slate-300 border-b border-slate-600">
                        <tr>
                            <th class="text-left px-2 py-1">Imported Name</th>
                            <th class="text-left px-2 py-1">Match</th>
                            <th class="text-left px-2 py-1">Resolved Member</th>
                            <th class="text-left px-2 py-1">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, i) in rows" :key="i" :class="[
                            row.resolved ? 'opacity-60 bg-emerald-800/10' : '',
                            'border-b border-slate-800 transition-all'
                        ]">
                            <td>{{ row.raw['name'] || row.raw['player name'] || row.raw['player'] }}</td>
                            <td class="px-2 py-1">
                                <span v-if="row.match.type === 'exact'">✅ Exact</span>
                                <span v-else-if="row.match.type === 'alias'">🧩 Alias</span>
                                <span v-else-if="row.match.type === 'unmatched'">❌ Unmatched</span>
                                <span v-else-if="row.match.type === 'conflict'">🚨 Conflict</span>
                            </td>
                            <td class="px-2 py-1">
                                <template
                                    v-if="(row.match.type === 'exact' || row.match.type === 'alias') && !row.resolved">
                                    {{ row.match.member.name }} ({{ row.match.member.id }})
                                </template>
                                <template v-else-if="row.match.type === 'conflict' && !row.resolved">
                                    <select v-model="row.selectedMemberId"
                                        class="bg-slate-800 text-white border border-slate-600 rounded p-1">
                                        <option disabled value="">Select member...</option>
                                        <option v-for="m in row.match.matches" :key="m.id" :value="m.id">
                                            {{ m.name }} ({{ m.id }})
                                        </option>
                                    </select>
                                </template>
                                <template v-else-if="row.match.type === 'unmatched' && !row.resolved">
                                    <select v-model="row.selectedMemberId"
                                        class="bg-slate-800 text-white border border-slate-600 rounded p-1">
                                        <option disabled value="">Select member...</option>
                                        <option v-for="m in unmatchedMembers" :key="m.id" :value="m.id">
                                            {{ m.name }} ({{ m.id }})
                                        </option>
                                    </select>
                                </template>
                                <template v-else-if="row.resolved">
                                    <span class="text-emerald-400">Confirmed</span>
                                </template>
                                <template v-else>
                                    —
                                </template>
                            </td>
                            <td class="px-2 py-1">
                                <!-- Actions -->
                                <template
                                    v-if="(row.match.type === 'exact' || row.match.type === 'alias') && !row.resolved">
                                    <button @click="confirmRow(i)" title="Confirm"
                                        class="text-green-400 ml-1">✅</button>
                                    <button @click="rejectRow(i)" title="Reject" class="text-red-400 ml-1">❌</button>
                                </template>
                                <template v-else-if="row.match.type === 'conflict' && !row.resolved">
                                    <button :disabled="!row.selectedMemberId" @click="confirmConflict(i)"
                                        title="Confirm selection" class="text-green-400 ml-1">✅</button>
                                    <button @click="rejectRow(i)" title="Reject" class="text-red-400 ml-1">❌</button>
                                </template>
                                <template v-else-if="row.match.type === 'unmatched' && !row.resolved">
                                    <button :disabled="!row.selectedMemberId" @click="confirmUnmatched(i)"
                                        title="Confirm mapping" class="text-green-400 ml-1">✅</button>
                                </template>
                                <template v-else-if="row.resolved">
                                    <button @click="undoRow(i)" class="text-yellow-300">↩️ Undo</button>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex justify-between items-center pt-4">
                <div class="text-sm text-slate-400">
                    {{ resolvedCount }} of {{ rows.length }} resolved
                </div>
                <div class="flex gap-2">
                    <Button variant="outline" @click="$emit('close')">Cancel</Button>
                    <Button :disabled="!allResolved" @click="submitMatches"
                        class="bg-indigo-600 hover:bg-indigo-700 text-white">
                        Finalize Import
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useMembers } from '@/composables/topheroes/admin/useMembers'

const props = defineProps({
    rows: {
        type: Array,
        required: true
    }
})
const emit = defineEmits(['close', 'finalize'])
const { members } = useMembers()
console.log(members)

function confirmRow(i) {
    props.rows[i].resolved = true
    props.rows[i].finalMemberId = props.rows[i].match.member.id
}

function confirmConflict(i) {
    if (!props.rows[i].selectedMemberId) return
    props.rows[i].resolved = true
    props.rows[i].finalMemberId = props.rows[i].selectedMemberId
}

function confirmUnmatched(i) {
    if (!props.rows[i].selectedMemberId) return
    props.rows[i].resolved = true
    props.rows[i].finalMemberId = props.rows[i].selectedMemberId
}

function rejectRow(i) {
    props.rows[i].match = { type: 'unmatched' }
    props.rows[i].selectedMemberId = null
    props.rows[i].resolved = false
    props.rows[i].finalMemberId = null
}

function undoRow(i) {
    props.rows[i].resolved = false
    props.rows[i].finalMemberId = null
}

const resolvedCount = computed(() =>
    props.rows.filter(row => row.resolved).length
)

const allResolved = computed(() =>
    props.rows.every(row => row.resolved)
)

// Show only members not already mapped by finalMemberId in another row
const unmatchedMembers = computed(() => {
    const usedIds = props.rows.map(r => r.finalMemberId).filter(Boolean)
    return members.value.filter(m => !usedIds.includes(m.id))
})

function submitMatches() {
    const finalMapped = props.rows.map(row => ({
        memberId: row.finalMemberId,
        ...row.raw
    }))
    emit('finalize', finalMapped)
}


</script>
