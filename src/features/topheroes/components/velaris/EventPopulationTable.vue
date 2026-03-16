<template>
    <div class="space-y-4">

        <!-- Mobile Card View (hidden on desktop) -->
        <div class="lg:hidden space-y-4">
            <div v-for="player in players" :key="player.id"
                class="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg"
                :class="rowHighlight(player.status)">
                <!-- Player Header -->
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3 flex-1">
                        <!-- Mobile Rank Badge -->
                        <div v-if="player.displayRank" :class="[
                            'flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold',
                            getRankBadgeClass(player.displayRank)
                        ]">
                            <span v-if="getRankIcon(player.displayRank)" class="mr-1">{{ getRankIcon(player.displayRank)
                                }}</span>
                            #{{ player.displayRank }}
                        </div>

                        <div class="flex-1">
                            <h3 class="font-semibold text-white text-lg">{{ player.name }}</h3>
                            <div class="flex items-center space-x-2 mt-1">
                                <span v-if="player.status && player.status !== 'active'"
                                    class="text-xs font-medium px-2 py-1 rounded-full"
                                    :class="statusBadge(player.status)">
                                    {{ player.status }}
                                </span>
                                <span class="text-slate-400 text-sm" :class="roleColor(player.role)">{{ player.role ||
                                    'No Role' }}</span>
                            </div>
                            <!-- Mobile total score display -->
                            <div v-if="player.displayTotal > 0" class="text-xs text-slate-400 mt-1 font-mono">
                                Total: {{ formatNumber(player.displayTotal) }}
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center space-x-2">
                        <button v-if="player.localOnly" @click="$emit('onSaveOne', player)"
                            class="text-emerald-400 hover:text-emerald-300 p-2 rounded-lg hover:bg-emerald-500/20 transition-all"
                            title="Save">
                            <Check class="w-4 h-4" />
                        </button>
                        <button @click="$emit('onRemove', player.id)"
                            class="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/20 transition-all"
                            title="Remove">
                            <X class="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <!-- Player Stats -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1">Power</label>
                        <input :value="formatNumber(player.power)"
                            @input="handlePowerInput(player.id, $event.target.value)" type="text"
                            class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-right"
                            placeholder="0" />
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1">Castle</label>
                        <input v-model.number="player.castle" type="number" min="1" max="55"
                            class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-center"
                            placeholder="40" />
                    </div>
                </div>

                <!-- Role & Rank -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1">Role</label>
                        <select v-model="player.role"
                            class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                            <option value="">Select Role</option>
                            <option value="R1" class="text-teal-400">R1</option>
                            <option value="R2" class="text-cyan-400">R2</option>
                            <option value="R3" class="text-blue-400">R3</option>
                            <option value="R4" class="text-indigo-400">R4</option>
                            <option value="R5" class="text-purple-400">R5</option>
                        </select>
                    </div>
                    <div v-if="event.type !== 'GvG'">
                        <label class="block text-xs font-medium text-slate-400 mb-1">Rank</label>
                        <input v-model.number="player.rank" type="number"
                            class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-center"
                            placeholder="1" />
                    </div>
                </div>

                <!-- Scores -->
                <div class="space-y-3">
                    <template v-if="event.type === 'GR'">
                        <div>
                            <label class="block text-xs font-medium text-slate-400 mb-1">Score</label>
                            <input :value="formatNumber(player.score)"
                                @input="handleScoreInput(player.id, 'score', $event.target.value)" type="text"
                                class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all font-mono text-right"
                                placeholder="0" />
                        </div>
                    </template>
                    <template v-else>
                        <div class="grid grid-cols-2 gap-2">
                            <div v-for="day in 6" :key="day">
                                <label class="block text-xs font-medium text-slate-400 mb-1">Day {{ day }}</label>
                                <input :value="formatNumber(player[`scoreD${day}`])"
                                    @input="handleScoreInput(player.id, `scoreD${day}`, $event.target.value)"
                                    type="text" :class="[
                                        'w-full px-2 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:border-transparent transition-all font-mono text-right',
                                        `focus:ring-2 ${getDayFocusColor(day)}`
                                    ]" placeholder="0" />
                            </div>
                        </div>
                    </template>
                </div>

                <!-- Notes -->
                <div class="mt-4">
                    <label class="block text-xs font-medium text-slate-400 mb-1">Notes</label>
                    <input :value="player.notes" @input="handleInput(player.id, 'notes', $event.target.value)"
                        class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="Notes..." />
                </div>
            </div>

            <!-- Empty state for mobile -->
            <div v-if="!players || players.length === 0" class="text-center py-12">
                <div class="w-16 h-16 bg-slate-700/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Search class="w-8 h-8 text-slate-500" />
                </div>
                <p class="text-slate-400 text-lg">No players match the current filters</p>
                <p class="text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
        </div>

        <!-- Desktop Table View (hidden on mobile) -->
        <div
            class="hidden lg:block overflow-x-auto rounded-xl border border-slate-700/50 shadow-2xl bg-slate-800/50 backdrop-blur-sm">
            <table class="min-w-full text-sm text-left text-slate-200">
                <thead class="bg-gradient-to-r from-slate-800 to-slate-700 text-slate-100 sticky top-0 z-10">
                    <tr>
                        <th class="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                            @click="$emit('onSort', 'calculatedRank')">
                            <div class="flex items-center space-x-2">
                                <span>Rank & Name</span>
                                <ChevronDown class="w-4 h-4 opacity-60" />
                            </div>
                        </th>
                        <th class="px-4 py-4 font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                            @click="$emit('onSort', 'power')">
                            <div class="flex items-center space-x-2">
                                <span>Power</span>
                                <ChevronDown class="w-4 h-4 opacity-60" />
                            </div>
                        </th>
                        <th class="px-4 py-4 font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                            @click="$emit('onSort', 'castle')">
                            <div class="flex items-center space-x-2">
                                <span>Castle</span>
                                <ChevronDown class="w-4 h-4 opacity-60" />
                            </div>
                        </th>
                        <th class="px-4 py-4 font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                            @click="$emit('onSort', 'role')">
                            <div class="flex items-center space-x-2">
                                <span>Role</span>
                                <ChevronDown class="w-4 h-4 opacity-60" />
                            </div>
                        </th>
                        <th v-if="event.type !== 'GvG'"
                            class="px-4 py-4 font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                            @click="$emit('onSort', 'rank')">
                            <div class="flex items-center space-x-2">
                                <span>Rank</span>
                                <ChevronDown class="w-4 h-4 opacity-60" />
                            </div>
                        </th>
                        <th v-if="event.type === 'GR'"
                            class="px-4 py-4 font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                            @click="$emit('onSort', 'score')">
                            <div class="flex items-center space-x-2">
                                <span>Score</span>
                                <ChevronDown class="w-4 h-4 opacity-60" />
                            </div>
                        </th>
                        <template v-else>
                            <th class="px-3 py-4 font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors text-center"
                                v-for="day in 6" :key="'h' + day" @click="$emit('onSort', `scoreD${day}`)">
                                <div class="flex items-center justify-center space-x-1">
                                    <span>Day {{ day }}</span>
                                    <ChevronDown class="w-3 h-3 opacity-60" />
                                </div>
                            </th>
                        </template>
                        <th class="px-4 py-4 font-semibold cursor-pointer hover:bg-slate-600/50 transition-colors"
                            @click="$emit('onSort', 'notes')">
                            <div class="flex items-center space-x-2">
                                <span>Notes</span>
                                <ChevronDown class="w-4 h-4 opacity-60" />
                            </div>
                        </th>
                        <th class="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-700/50">
                    <tr v-for="player in players" :key="player.id"
                        class="hover:bg-slate-800/60 transition-colors duration-200"
                        :class="rowHighlight(player.status)">
                        <td class="px-6 py-4">
                            <div class="leading-relaxed">
                                <div class="flex items-center gap-3">
                                    <!-- Rank Badge -->
                                    <div v-if="player.displayRank" :class="[
                                        'flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold min-w-[2rem] h-6',
                                        getRankBadgeClass(player.displayRank)
                                    ]">
                                        <span v-if="getRankIcon(player.displayRank)" class="mr-1">{{
                                            getRankIcon(player.displayRank) }}</span>
                                        #{{ player.displayRank }}
                                    </div>
                                    <div v-else
                                        class="flex items-center justify-center px-2 py-1 rounded-full text-xs bg-slate-700/50 text-slate-500 min-w-[2rem] h-6">
                                        --
                                    </div>

                                    <div class="flex-1">
                                        <div class="font-medium text-slate-100 text-base">{{ player.name }}</div>
                                        <div v-if="player.status && player.status !== 'active'"
                                            class="text-xs font-medium mt-1 px-2 py-0.5 rounded-full inline-block"
                                            :class="statusBadge(player.status)">
                                            {{ player.status }}
                                        </div>
                                        <div v-if="player.role" class="text-xs font-medium mt-1"
                                            :class="roleColor(player.role)">
                                            {{ player.role }}
                                        </div>
                                        <!-- Display calculated total if available -->
                                        <div v-if="player.displayTotal > 0"
                                            class="text-xs text-slate-400 mt-1 font-mono">
                                            Total: {{ formatNumber(player.displayTotal) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-4">
                            <input :value="formatNumber(player.power)"
                                @input="handlePowerInput(player.id, $event.target.value)" type="text"
                                class="bg-slate-700/60 border border-slate-600 px-3 py-2 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all hover:bg-slate-700 focus:bg-slate-600 font-mono text-right w-28"
                                placeholder="0" />
                        </td>
                        <td class="px-4 py-4">
                            <input v-model.number="player.castle" type="number" min="1" max="55"
                                class="bg-slate-700/60 border border-slate-600 px-3 py-2 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:bg-slate-700 focus:bg-slate-600 text-center w-16"
                                placeholder="40" />
                        </td>
                        <td class="px-4 py-4">
                            <select v-model="player.role"
                                class="bg-slate-700/60 border border-slate-600 px-3 py-2 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:bg-slate-700 focus:bg-slate-600 w-20">
                                <option value="">Role</option>
                                <option value="R1" class="text-teal-400">R1</option>
                                <option value="R2" class="text-cyan-400">R2</option>
                                <option value="R3" class="text-blue-400">R3</option>
                                <option value="R4" class="text-indigo-400">R4</option>
                                <option value="R5" class="text-purple-400">R5</option>
                            </select>
                        </td>
                        <td v-if="event.type !== 'GvG'" class="px-4 py-4">
                            <input v-model.number="player.rank" type="number"
                                class="bg-slate-700/60 border border-slate-600 px-3 py-2 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all hover:bg-slate-700 focus:bg-slate-600 text-center w-20"
                                placeholder="1" />
                        </td>
                        <template v-if="event.type === 'GR'">
                            <td class="px-4 py-4">
                                <input :value="formatNumber(player.score)"
                                    @input="handleScoreInput(player.id, 'score', $event.target.value)" type="text"
                                    class="bg-slate-700/60 border border-slate-600 px-3 py-2 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all hover:bg-slate-700 focus:bg-slate-600 font-mono text-right w-28"
                                    placeholder="0" />
                            </td>
                        </template>
                        <template v-else>
                            <td class="px-3 py-4" v-for="day in 6" :key="day">
                                <input :value="formatNumber(player[`scoreD${day}`])"
                                    @input="handleScoreInput(player.id, `scoreD${day}`, $event.target.value)"
                                    type="text" :class="[
                                        'bg-slate-700/60 border border-slate-600 px-2 py-2 rounded-lg text-slate-100 text-sm transition-all hover:bg-slate-700 focus:bg-slate-600 font-mono text-right w-20',
                                        `focus:ring-2 ${getDayFocusColor(day)} ${getDayBorderColor(day)}`
                                    ]" placeholder="0" />
                            </td>
                        </template>
                        <td class="px-4 py-4">
                            <input :value="player.notes" @input="handleInput(player.id, 'notes', $event.target.value)"
                                class="bg-slate-700/60 border border-slate-600 px-3 py-2 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all hover:bg-slate-700 focus:bg-slate-600 w-32"
                                placeholder="Notes..." />
                        </td>
                        <td class="px-6 py-4 text-right">
                            <div class="flex items-center justify-end space-x-2">
                                <button v-if="player.localOnly" @click="$emit('onSaveOne', player)"
                                    class="text-emerald-400 hover:text-emerald-300 p-2 rounded-lg hover:bg-emerald-500/20 transition-all duration-200"
                                    title="Save row">
                                    <Check class="w-4 h-4" />
                                </button>
                                <button @click="$emit('onRemove', player.id)"
                                    class="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/20 transition-all duration-200"
                                    title="Remove">
                                    <X class="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="!players || players.length === 0">
                        <td :colspan="dynamicColspan" class="text-center py-12 text-slate-400">
                            <div class="flex flex-col items-center space-y-4">
                                <div class="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
                                    <Search class="w-8 h-8 text-slate-500" />
                                </div>
                                <div class="text-center">
                                    <p class="text-lg font-medium">No players found</p>
                                    <p class="text-sm text-slate-500 mt-1">No players match the current filters or none
                                        have
                                        been added yet.</p>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Footer Actions - Always visible -->
        <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 lg:p-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <!-- Left side actions -->
                <div class="flex flex-wrap gap-2">
                    <button @click="$emit('onClearAll')"
                        class="inline-flex items-center px-4 py-2 text-sm font-medium text-red-300 hover:text-red-200 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-500/50">
                        <Trash2 class="w-4 h-4 mr-2" />
                        Clear All Data
                    </button>

                    <button @click="$emit('onClearScores')"
                        class="inline-flex items-center px-4 py-2 text-sm font-medium text-yellow-300 hover:text-yellow-200 hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-orange-500/20 rounded-lg transition-all duration-200 border border-yellow-500/30 hover:border-yellow-500/50">
                        <X class="w-4 h-4 mr-2" />
                        Clear Scores
                    </button>

                    <button @click="$emit('onHardRefresh')"
                        class="inline-flex items-center px-4 py-2 text-sm font-medium text-orange-300 hover:text-orange-200 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-amber-500/20 rounded-lg transition-all duration-200 border border-orange-500/30 hover:border-orange-500/50">
                        <RefreshCw class="w-4 h-4 mr-2" />
                        Hard Refresh
                    </button>
                </div>

                <!-- Right side action -->
                <button @click="() => $emit('onAddMissing', props.players)"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-300 hover:text-indigo-200 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 rounded-lg transition-all duration-200 border border-indigo-500/30 hover:border-indigo-500/50 shadow-lg">
                    <Plus class="w-4 h-4 mr-2" />
                    Add Missing Member
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Check, X, ChevronDown, Search, Trash2, RotateCcw, Plus, RefreshCw } from 'lucide-vue-next'

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

const playersWithRankDisplay = computed(() => {
    if (!props.players) return []

    return props.players.map(player => ({
        ...player,
        displayRank: player.calculatedRank || null,
        displayTotal: player.calculatedTotal || 0,
        hasRank: player.calculatedRank != null && player.calculatedRank > 0
    }))
})

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
    emit('onFieldUpdate', playerId, { [field]: value })
}

const statusBadge = (status) => {
    switch (status) {
        case 'inactive': return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300 border border-yellow-500/30'
        case 'left': return 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/30'
        case 'kicked': return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30'
        default: return 'bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-300 border border-slate-500/30'
    }
}

const roleColor = (role) => {
    switch (role) {
        case 'R5': return 'text-purple-400'
        case 'R4': return 'text-indigo-400'
        case 'R3': return 'text-blue-400'
        case 'R2': return 'text-cyan-400'
        case 'R1': return 'text-teal-400'
        default: return 'text-slate-400'
    }
}

const getDayFocusColor = (day) => {
    const colors = [
        'focus:ring-red-500',
        'focus:ring-orange-500',
        'focus:ring-yellow-500',
        'focus:ring-green-500',
        'focus:ring-blue-500',
        'focus:ring-purple-500'
    ]
    return colors[day - 1] || 'focus:ring-indigo-500'
}

const getDayBorderColor = (day) => {
    const colors = [
        'focus:border-red-500',
        'focus:border-orange-500',
        'focus:border-yellow-500',
        'focus:border-green-500',
        'focus:border-blue-500',
        'focus:border-purple-500'
    ]
    return colors[day - 1] || 'focus:border-indigo-500'
}

const rowHighlight = (status) => {
    switch (status) {
        case 'inactive': return 'bg-yellow-900/5 border-l-4 border-l-yellow-500/50'
        case 'left': return 'bg-orange-900/5 border-l-4 border-l-orange-500/50'
        case 'kicked': return 'bg-red-900/5 border-l-4 border-l-red-500/50'
        default: return ''
    }
}

const getRankBadgeClass = (rank) => {
    if (!rank || rank < 1) return 'bg-slate-600/50 text-slate-400'

    switch (rank) {
        case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 font-bold shadow-lg'
        case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900 font-semibold shadow-md'
        case 3: return 'bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 font-semibold shadow-md'
        default:
            if (rank <= 10) return 'bg-gradient-to-r from-blue-500 to-blue-700 text-blue-100 font-medium'
            if (rank <= 25) return 'bg-gradient-to-r from-green-500 to-green-700 text-green-100'
            return 'bg-slate-600/70 text-slate-200'
    }
}

// Helper function to get rank icon
const getRankIcon = (rank) => {
    if (!rank || rank < 1) return null

    switch (rank) {
        case 1: return '🥇'
        case 2: return '🥈'
        case 3: return '🥉'
        default: return rank <= 10 ? '⭐' : null
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
/* Input focus improvements */
input:focus,
select:focus,
textarea:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Mobile-friendly input styling */
@media (max-width: 1024px) {

    input,
    select,
    textarea {
        font-size: 16px;
        /* Prevents zoom on iOS */
        min-height: 44px;
        /* Better touch targets */
    }
}

/* Number input styling */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}

/* Smooth transitions */
* {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

/* Glass morphism effect */
.backdrop-blur-sm {
    backdrop-filter: blur(4px);
}

/* Custom scrollbar */
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
</style>