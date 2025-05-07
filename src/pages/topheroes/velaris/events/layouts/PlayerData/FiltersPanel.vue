<template>
    <div class="mb-6 border-t border-b border-gray-200 py-4">
        <h3 class="text-lg font-semibold mb-3 text-gray-600">Filters</h3>

        <div class="flex flex-col md:flex-row gap-4 md:gap-6 flex-wrap">
            <FilterGroup title="Role" :options="roleOptions" :active="activeRoleFilters"
                @toggle="v => $emit('toggleRole', v)" />

            <FilterGroup title="Castle" :options="castleOptions" :active="activeCastleFilters"
                @toggle="v => $emit('toggleCastle', v)" />

            <FilterGroup title="Power" :options="powerOptions" :active="activePowerFilters"
                @toggle="v => $emit('togglePower', v)" />

            <FilterGroup :emptyMeansAll="true" title="Include Days" :options="dayOptions" :active="activeDayFilters"
                @toggle="$emit('toggleDay', $event)" />

            <!-- Low Score -->
            <FilterGroup title="Low Score" :options="[{ label: '< 1M', value: 'lowScore' }]"
                :active="lowScoreFilter ? ['lowScore'] : []" @toggle="$emit('toggleLowScore')" />
        </div>
    </div>
</template>

<script setup>
import FilterGroup from './FilterGroup.vue'

const props = defineProps({
    activeRoleFilters: Array,
    activeCastleFilters: Array,
    activePowerFilters: Array,
    activeDayFilters: Array,
    lowScoreFilter: Boolean,
    allDays: Array,
    dayHasData: Object,
    dayOptions: Array
})

const emit = defineEmits(['toggleRole', 'toggleCastle', 'togglePower', 'toggleDay', 'toggleLowScore'])

// Dynamically define your options now:
const roleOptions = [
    { label: 'All', value: 'all' },
    { label: 'R1', value: 'R1' },
    { label: 'R2', value: 'R2' },
    { label: 'R3', value: 'R3' },
    { label: 'R4', value: 'R4' },
    { label: 'R5', value: 'R5' }
]

const castleOptions = [
    { label: 'All', value: 'all' },
    { label: '30-35', value: '30-35' },
    { label: '36-40', value: '36-40' },
    { label: '41-45', value: '41-45' },
    { label: '46-50', value: '46-50' },
    { label: '51+', value: '51+' }
]

const powerOptions = [
    { label: 'All', value: 'all' },
    { label: '0-25M', value: '0-25M' },
    { label: '25-50M', value: '25-50M' },
    { label: '50-75M', value: '50-75M' },
    { label: '75-100M', value: '75-100M' },
    { label: '100M+', value: '100M+' }
]
</script>