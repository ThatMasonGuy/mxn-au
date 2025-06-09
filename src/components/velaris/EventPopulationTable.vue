<template>
    <div class="overflow-x-auto rounded-lg border border-slate-600 shadow-xl bg-slate-900/50">
        <table class="min-w-full text-sm text-left text-slate-200">
            <thead class="bg-gradient-to-r from-slate-800 to-slate-700 text-slate-100">
                <tr>
                    <th class="px-4 py-3 font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                        @click="$emit('onSort', 'name')">
                        <div class="flex items-center space-x-1">
                            <span>Name</span>
                            <svg class="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </th>
                    <th class="px-3 py-3 font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                        @click="$emit('onSort', 'power')">
                        <div class="flex items-center space-x-1">
                            <span>Power</span>
                            <svg class="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </th>
                    <th class="px-3 py-3 font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                        @click="$emit('onSort', 'castle')">
                        <div class="flex items-center space-x-1">
                            <span>Castle</span>
                            <svg class="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </th>
                    <th class="px-3 py-3 font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                        @click="$emit('onSort', 'role')">
                        <div class="flex items-center space-x-1">
                            <span>Role</span>
                            <svg class="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </th>
                    <th v-if="event.type !== 'GvG'"
                        class="px-3 py-3 font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                        @click="$emit('onSort', 'rank')">
                        <div class="flex items-center space-x-1">
                            <span>Rank</span>
                            <svg class="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </th>
                    <th v-if="event.type === 'GR'"
                        class="px-3 py-3 font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                        @click="$emit('onSort', 'score')">
                        <div class="flex items-center space-x-1">
                            <span>Score</span>
                            <svg class="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </th>
                    <template v-else>
                        <th class="px-3 py-3 font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors text-center"
                            v-for="day in 6" :key="'h' + day" @click="$emit('onSort', `scoreD${day}`)">
                            <div class="flex items-center justify-center space-x-1">
                                <span>Day {{ day }}</span>
                                <svg class="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </div>
                        </th>
                    </template>
                    <th class="px-3 py-3 font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                        @click="$emit('onSort', 'notes')">
                        <div class="flex items-center space-x-1">
                            <span>Notes</span>
                            <svg class="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </th>
                    <th class="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-700">
                <tr v-for="player in players" :key="player.id"
                    class="hover:bg-slate-800/60 transition-colors duration-150" :class="rowHighlight(player.status)">
                    <td class="px-4 py-3">
                        <div class="leading-relaxed">
                            <div class="font-medium text-slate-100 text-base">{{ player.name }}</div>
                            <div v-if="player.status && player.status !== 'active'"
                                class="text-xs font-medium mt-1 px-2 py-0.5 rounded-full inline-block"
                                :class="statusBadge(player.status)">
                                {{ player.status }}
                            </div>
                        </div>
                    </td>
                    <td class="py-3">
                        <input :value="formatNumber(player.power)"
                            @input="handlePowerInput(player.id, $event.target.value)" type="text" class="bg-slate-700/80 border border-slate-600 px-3 py-2 rounded-md text-slate-100 text-sm
                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                                   hover:bg-slate-700 focus:bg-slate-600 font-mono text-right" style="width: 100px"
                            placeholder="0" />
                    </td>
                    <td class="py-3">
                        <div class="flex justify-center items-center">
                            <input v-model.number="player.castle" type="number" min="1" max="55" class="bg-slate-700/80 border border-slate-600 px-3 py-2 rounded-md text-slate-100 text-sm
                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                                   hover:bg-slate-700 focus:bg-slate-600 text-center" style="width: 40px"
                                placeholder="40" />
                        </div>
                    </td>
                    <td class="pr-3 py-3">
                        <select v-model="player.role" class="bg-slate-700/80 border border-slate-600 px-3 py-2 rounded-md w-full text-slate-100 text-sm
                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                                   hover:bg-slate-700 focus:bg-slate-600" style="width: 60px">
                            <option value="">Select Role</option>
                            <option value="R1">R1</option>
                            <option value="R2">R2</option>
                            <option value="R3">R3</option>
                            <option value="R4">R4</option>
                            <option value="R5">R5</option>
                        </select>
                    </td>
                    <td v-if="event.type !== 'GvG'" class="px-3 py-3">
                        <input v-model.number="player.rank" type="number" class="bg-slate-700/80 border border-slate-600 px-3 py-2 rounded-md text-slate-100 text-sm
                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                                   hover:bg-slate-700 focus:bg-slate-600 text-center" style="width: 70px"
                            placeholder="1" />
                    </td>
                    <template v-if="event.type === 'GR'">
                        <td class="px-3 py-3">
                            <input :value="formatNumber(player.score)"
                                @input="handleScoreInput(player.id, 'score', $event.target.value)" type="text" class="bg-slate-700/80 border border-slate-600 px-3 py-2 rounded-md w-full text-slate-100 text-sm
                                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                                       hover:bg-slate-700 focus:bg-slate-600 font-mono text-right" placeholder="0" />
                        </td>
                    </template>
                    <template v-else>
                        <td class="px-1 py-3" v-for="day in 6" :key="day">
                            <input :value="formatNumber(player[`scoreD${day}`])"
                                @input="handleScoreInput(player.id, `scoreD${day}`, $event.target.value)" type="text"
                                class="bg-slate-700/80 border border-slate-600 px-2 py-2 rounded-md text-slate-100 text-sm
                                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                                       hover:bg-slate-700 focus:bg-slate-600 font-mono text-right" style="width: 85px"
                                placeholder="0" />
                        </td>
                    </template>
                    <td class="px-3 py-3">
                        <input :value="player.notes" @input="handleInput(player.id, 'notes', $event.target.value)"
                            class="bg-slate-700/80 border border-slate-600 px-3 py-2 rounded-md w-full text-slate-100 text-sm
                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                                   hover:bg-slate-700 focus:bg-slate-600" placeholder="Notes..." />
                    </td>
                    <td class="px-4 py-3 text-right">
                        <div class="flex items-center justify-end space-x-2">
                            <button v-if="player.localOnly" @click="$emit('onSaveOne', player)"
                                class="text-emerald-400 hover:text-emerald-300 p-2 rounded-lg hover:bg-emerald-500/20 transition-all"
                                title="Save row">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M7.707 10.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L9 11.586l-1.293-1.293z" />
                                </svg>
                            </button>
                            <button @click="$emit('onRemove', player.id)"
                                class="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/20 transition-all"
                                title="Remove">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
                <tr v-if="!players || players.length === 0">
                    <td :colspan="dynamicColspan" class="text-center py-8 text-slate-400 italic">
                        <div class="flex flex-col items-center space-y-2">
                            <svg class="w-12 h-12 opacity-40" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clip-rule="evenodd" />
                            </svg>
                            <p class="text-lg">No players match the current filters or none have been added yet.</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Footer Actions -->
        <div
            class="flex items-center justify-between px-6 py-4 border-t border-slate-600 bg-gradient-to-r from-slate-800/80 to-slate-700/80">
            <div class="flex items-center space-x-4">
                <button @click="$emit('onClearAll')" class="inline-flex items-center px-3 py-2 text-sm font-medium text-red-300 hover:text-red-200 
                           hover:bg-red-500/20 rounded-lg transition-all duration-200">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clip-rule="evenodd" />
                    </svg>
                    Clear All Data
                </button>
                <button @click="$emit('onClearScores')" class="inline-flex items-center px-3 py-2 text-sm font-medium text-yellow-300 hover:text-yellow-200 
                           hover:bg-yellow-500/20 rounded-lg transition-all duration-200">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd" />
                    </svg>
                    Clear All Scores
                </button>
                <button @click="$emit('onHardRefresh')" class="inline-flex items-center px-3 py-2 text-sm font-medium text-orange-300 hover:text-orange-200 
                           hover:bg-yellow-500/20 rounded-lg transition-all duration-200">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd" />
                    </svg>
                    Hard Refresh Cloud
                </button>
            </div>
            <button @click="() => $emit('onAddMissing', props.players)" class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-300 hover:text-blue-200 
                       hover:bg-blue-500/20 rounded-lg transition-all duration-200">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clip-rule="evenodd" />
                </svg>
                Add Missing Member
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    players: Array,
    event: Object
})

const emit = defineEmits([
    'onRemove',
    'onSaveOne',
    'onClearAll',
    'onClearScores',
    'onAddMissing',
    'onSort',
    'onFieldUpdate',
    'onHardRefresh'
])

// Number formatting functions
const formatNumber = (num) => {
    if (!num || isNaN(num)) return ''
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const parseNumber = (str) => {
    if (typeof str === 'number') return str
    if (!str || typeof str !== 'string') return 0
    return parseInt(str.replace(/,/g, ''), 10) || 0
}

const handlePowerInput = (playerId, value) => {
    const numValue = parseNumber(value)
    emit('onFieldUpdate', playerId, { power: numValue })
}

const handleScoreInput = (playerId, field, value) => {
    const numValue = parseNumber(value)
    emit('onFieldUpdate', playerId, { [field]: numValue })
}

const handleInput = (playerId, field, value) => {
    const inputValue = value
    emit('onFieldUpdate', playerId, { [field]: inputValue })
}

const statusBadge = (status) => {
    switch (status) {
        case 'inactive': return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
        case 'left': return 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
        case 'kicked': return 'bg-red-500/20 text-red-300 border border-red-500/30'
        default: return 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
    }
}

const rowHighlight = (status) => {
    switch (status) {
        case 'inactive': return 'bg-yellow-900/5 border-l-4 border-l-yellow-500/50'
        case 'left': return 'bg-orange-900/5 border-l-4 border-l-orange-500/50'
        case 'kicked': return 'bg-red-900/5 border-l-4 border-l-red-500/50'
        default: return ''
    }
}

const dynamicColspan = computed(() => {
    let cols = 8 // base columns: name, power, castle, role, notes, actions
    if (props.event?.type !== 'GvG') cols += 1 // rank column
    if (props.event?.type === 'GR') {
        cols += 1 // score column
    } else {
        cols += 6 // D1-D6 columns
    }
    return cols
})
</script>

<style scoped>
/* Custom scrollbar for the table container */
.overflow-x-auto::-webkit-scrollbar {
    height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
    background: rgb(30 41 59);
    border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background: rgb(71 85 105);
    border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: rgb(100 116 139);
}

/* Improved input styling */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}

/* Smooth animations */
* {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}
</style>