<template>
    <div class="overflow-x-auto rounded border border-slate-700">
        <table class="min-w-full text-sm text-left text-slate-300">
            <thead class="bg-slate-800 text-slate-200 text-xs uppercase">
                <tr>
                    <th class="px-3 py-2 cursor-pointer" @click="$emit('onSort', 'name')">Name</th>
                    <th class="px-2 py-2 cursor-pointer" @click="$emit('onSort', 'power')">Power</th>
                    <th class="px-2 py-2 cursor-pointer" @click="$emit('onSort', 'castle')">Castle</th>
                    <th class="px-2 py-2 cursor-pointer" @click="$emit('onSort', 'role')">Role</th>
                    <th v-if="event.type !== 'GvG'" class="px-2 py-2 cursor-pointer" @click="$emit('onSort', 'rank')">
                        Rank</th>
                    <th v-if="event.type === 'GR'" class="px-2 py-2 cursor-pointer" @click="$emit('onSort', 'score')">
                        Score</th>
                    <template v-else>
                        <th class="px-2 py-2 cursor-pointer" v-for="day in 6" :key="'h' + day"
                            @click="$emit('onSort', `scoreD${day}`)">D{{ day }}</th>
                    </template>
                    <th class="px-2 py-2 cursor-pointer" @click="$emit('onSort', 'notes')">Notes</th>
                    <th class="px-2 py-2 text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="player in players" :key="player.id" class="border-b border-slate-700 hover:bg-slate-800"
                    :class="rowHighlight(player.status)">
                    <td class="px-3 py-2 font-medium text-white">
                        <div class="leading-tight">
                            <div>{{ player.name }}</div>
                            <div v-if="player.status && player.status !== 'active'"
                                class="text-xs italic font-normal mt-0.5" :class="statusColor(player.status)">
                                ({{ player.status }})
                            </div>
                        </div>
                    </td>
                    <td class="px-2 py-2">
                        <input v-model.number="player.power" type="number"
                            class="bg-slate-700 px-2 py-1 rounded w-full text-white text-xs" />
                    </td>
                    <td class="px-2 py-2">
                        <input v-model="player.castle"
                            class="bg-slate-700 px-2 py-1 rounded w-full text-white text-xs" />
                    </td>
                    <td class="px-2 py-2">
                        <input v-model="player.role" class="bg-slate-700 px-2 py-1 rounded w-full text-white text-xs" />
                    </td>
                    <td v-if="event.type !== 'GvG'" class="px-2 py-2">
                        <input v-model.number="player.rank" type="number"
                            class="bg-slate-700 px-2 py-1 rounded w-full text-white text-xs" />
                    </td>
                    <template v-if="event.type === 'GR'">
                        <td class="px-2 py-2">
                            <input v-model.number="player.score" type="number"
                                class="bg-slate-700 px-2 py-1 rounded w-full text-white text-xs" />
                        </td>
                    </template>
                    <template v-else>
                        <td class="px-2 py-2" v-for="day in 6" :key="day">
                            <input v-model.number="player[`scoreD${day}`]" type="number"
                                class="bg-slate-700 px-2 py-1 rounded w-full text-white text-xs" />
                        </td>
                    </template>
                    <td class="px-2 py-2">
                        <input :value="player.notes" @input="handleInput(player.id, 'notes', $event.target.value)"
                            class="bg-slate-700 px-2 py-1 rounded w-full text-white text-xs focus:ring-indigo-500 focus:border-indigo-500" />
                    </td>
                    <td class="px-2 py-2 text-right space-x-1">
                        <button @click="$emit('onRemove', player.id)"
                            class="text-red-400 hover:text-red-600 text-xs px-1 py-0.5 rounded hover:bg-red-500/20"
                            title="Remove">✕</button>
                        <button v-if="player.localOnly" @click="$emit('onSaveOne', player)"
                            class="text-green-400 hover:text-green-600 text-xs px-1 py-0.5 rounded hover:bg-green-500/20"
                            title="Save row">💾</button>
                    </td>
                </tr>
                <tr v-if="!players || players.length === 0">
                    <td :colspan="dynamicColspan" class="text-center py-4 text-slate-400 italic">
                        No players match the current filters or none have been added yet.
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="flex items-center justify-between mt-0 px-4 py-2 border-t border-slate-700 bg-slate-800/70">
            <div class="space-x-2">
                <button @click="$emit('onClearAll')"
                    class="text-xs text-red-300 hover:underline hover:text-red-200">Clear All
                    Data</button>
                <button @click="$emit('onClearScores')"
                    class="text-xs text-yellow-300 hover:underline hover:text-yellow-200">Clear All Scores</button>
            </div>
            <button @click="$emit('onAddMissing')" class="text-xs text-blue-300 hover:underline hover:text-blue-200">+
                Add Missing Member</button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    players: Array,
    event: Object
})

defineEmits([
    'onRemove',
    'onSaveOne',
    'onClearAll',
    'onClearScores',
    'onAddMissing',
    'onSort'
])

const statusColor = (status) => {
    switch (status) {
        case 'inactive': return 'text-yellow-400'
        case 'left': return 'text-orange-400'
        case 'kicked': return 'text-red-400'
        default: return 'text-slate-400'
    }
}

const rowHighlight = (status) => {
    switch (status) {
        case 'inactive': return 'bg-yellow-900/10'
        case 'left': return 'bg-orange-900/10'
        case 'kicked': return 'bg-red-900/10'
        default: return ''
    }
}
</script>

<style scoped>
input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 1px #6366f1;
}

tr.bg-yellow-900\/10>td {
    background-color: rgba(113, 63, 18, 0.1);
}

tr.bg-orange-900\/10>td {
    background-color: rgba(154, 52, 18, 0.1);
}

tr.bg-red-900\/10>td {
    background-color: rgba(127, 29, 29, 0.1);
}
</style>