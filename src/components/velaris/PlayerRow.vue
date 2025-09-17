<template>
    <div class="p-4">
        <!-- Header Row: Name + Status Badge -->
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
                <div class="flex-shrink-0">
                    <div
                        class="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 border flex items-center justify-center text-white font-bold text-sm">
                        {{ getInitials(row.raw['name'] || row.raw['player name'] || row.raw['player']) }}
                    </div>
                </div>
                <div>
                    <h3 class="font-semibold text-white text-lg">
                        {{ row.raw['name'] || row.raw['player name'] || row.raw['player'] }}
                    </h3>
                    <div class="flex items-center gap-2 mt-1">
                        <!-- Additional Data Badges -->
                        <div v-if="row.raw['rank']"
                            class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium">
                            <Crown class="w-3 h-3" />
                            Rank {{ row.raw['rank'] }}
                        </div>
                        <div v-if="row.raw['power']"
                            class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-medium">
                            <Zap class="w-3 h-3" />
                            {{ formatPower(row.raw['power']) }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Status Indicator -->
            <div class="flex items-center gap-2">
                <div v-if="row.resolved"
                    class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                    <CheckCircle class="w-4 h-4" />
                    Confirmed
                </div>
                <div v-else-if="row.excluded"
                    class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-400 text-sm font-medium">
                    <XCircle class="w-4 h-4" />
                    Excluded
                </div>
                <div v-else
                    class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium">
                    <Clock class="w-4 h-4" />
                    Pending
                </div>
            </div>
        </div>

        <!-- Match Details & Actions -->
        <div v-if="!row.excluded" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Match Information -->
            <div class="space-y-3">
                <h4 class="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Target class="w-4 h-4" />
                    Match Details
                </h4>

                <!-- Exact/Alias Match Display -->
                <template v-if="(row.match.type === 'exact' || row.match.type === 'alias') && !row.resolved">
                    <div
                        class="bg-gradient-to-r from-slate-700/30 to-slate-600/30 rounded-lg p-3 border border-slate-600">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                {{ getInitials(row.match.member.name) }}
                            </div>
                            <div>
                                <div class="font-medium text-white">{{ row.match.member.name }}</div>
                                <div class="text-xs text-slate-400 flex gap-3">
                                    <span>Power: {{ getMemberDisplayInfo(row.match.member.id).power }}</span>
                                    <span>Rank: {{ getMemberDisplayInfo(row.match.member.id).rank }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- Conflict Resolution -->
                <template v-else-if="row.match.type === 'conflict' && !row.resolved">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-slate-300">Select Member:</label>
                        <MemberSelector :members="row.match.matches" v-model="row.selectedMemberId"
                            placeholder="Choose from multiple matches..." />
                    </div>
                </template>

                <!-- Manual Selection -->
                <template v-else-if="row.match.type === 'unmatched' && !row.resolved">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-slate-300">Manual Selection:</label>
                        <MemberSelector :members="availableMembers" v-model="row.selectedMemberId"
                            placeholder="Select a member..." />
                    </div>
                </template>

                <!-- Resolved Display -->
                <template v-else-if="row.resolved">
                    <div
                        class="bg-gradient-to-r from-emerald-700/20 to-green-700/20 rounded-lg p-3 border border-emerald-500/30">
                        <div class="flex items-center gap-2 text-emerald-400">
                            <CheckCircle class="w-5 h-5" />
                            <span class="font-medium">Successfully matched and confirmed</span>
                        </div>
                    </div>
                </template>
            </div>

            <!-- Actions -->
            <div class="space-y-3">
                <h4 class="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Settings class="w-4 h-4" />
                    Actions
                </h4>

                <div class="flex flex-wrap gap-2">
                    <!-- Exact/Alias Actions -->
                    <template v-if="(row.match.type === 'exact' || row.match.type === 'alias') && !row.resolved">
                        <Button @click="handleAction('confirm')" size="sm"
                            class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0">
                            <Check class="w-4 h-4 mr-1" />
                            Confirm
                        </Button>
                        <Button @click="handleAction('reject')" size="sm" variant="outline"
                            class="border-red-500/50 text-red-400 hover:bg-red-500/10">
                            <X class="w-4 h-4 mr-1" />
                            Reject
                        </Button>
                        <Button @click="handleAction('exclude')" size="sm" variant="outline"
                            class="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
                            <Trash2 class="w-4 h-4 mr-1" />
                            Exclude
                        </Button>
                    </template>

                    <!-- Conflict Actions -->
                    <template v-else-if="row.match.type === 'conflict' && !row.resolved">
                        <Button :disabled="!row.selectedMemberId" @click="handleAction('confirmConflict')" size="sm"
                            class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 disabled:opacity-50">
                            <Check class="w-4 h-4 mr-1" />
                            Confirm Selection
                        </Button>
                        <Button @click="handleAction('reject')" size="sm" variant="outline"
                            class="border-red-500/50 text-red-400 hover:bg-red-500/10">
                            <X class="w-4 h-4 mr-1" />
                            Reject
                        </Button>
                        <Button @click="handleAction('exclude')" size="sm" variant="outline"
                            class="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
                            <Trash2 class="w-4 h-4 mr-1" />
                            Exclude
                        </Button>
                    </template>

                    <!-- Unmatched Actions -->
                    <template v-else-if="row.match.type === 'unmatched' && !row.resolved">
                        <Button :disabled="!row.selectedMemberId" @click="handleAction('confirmUnmatched')" size="sm"
                            class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 disabled:opacity-50">
                            <Check class="w-4 h-4 mr-1" />
                            Confirm Mapping
                        </Button>
                        <Button @click="handleAction('exclude')" size="sm" variant="outline"
                            class="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
                            <Trash2 class="w-4 h-4 mr-1" />
                            Exclude
                        </Button>
                    </template>

                    <!-- Resolved Actions -->
                    <template v-else-if="row.resolved">
                        <Button @click="handleAction('undo')" size="sm" variant="outline"
                            class="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
                            <RotateCcw class="w-4 h-4 mr-1" />
                            Undo
                        </Button>
                    </template>
                </div>
            </div>
        </div>

        <!-- Excluded State -->
        <div v-else class="text-center py-4">
            <div class="flex items-center justify-center gap-2 text-red-400 mb-2">
                <XCircle class="w-5 h-5" />
                <span class="font-medium">This row has been excluded from import</span>
            </div>
            <Button @click="handleAction('unexclude')" size="sm" variant="outline"
                class="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
                <RotateCcw class="w-4 h-4 mr-1" />
                Include Again
            </Button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
    CheckCircle, XCircle, Clock, Target, Settings,
    Check, X, Trash2, RotateCcw, Crown, Zap
} from 'lucide-vue-next'
import { useMembers } from '@/composables/topheroes/admin/useMembers'
import MemberSelector from './MemberSelector.vue'

const props = defineProps({
    row: {
        type: Object,
        required: true
    },
    availableMembers: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['action'])

const { members } = useMembers()

// Helper functions
const getInitials = (name) => {
    if (!name) return '??'
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const formatPower = (power) => {
    if (!power) return '0'
    return Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(power)
}

const getMemberDisplayInfo = (memberId) => {
    const member = members.value.find(m => m.id === memberId)
    if (!member) return { power: '0', rank: 'Unknown' }

    return {
        power: member.power ? formatPower(member.power) : '0',
        rank: member.role || 'Unknown'
    }
}

const handleAction = (action) => {
    emit('action', { action, row: props.row })
}
</script>