<template>
    <div class="filters-panel">
        <!-- Mobile toggle button -->
        <div class="mobile-header md:hidden">
            <button @click="showFilters = !showFilters" class="mobile-toggle">
                <span class="toggle-text">Filters</span>
                <svg :class="['toggle-icon', { 'rotate-180': showFilters }]" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
        </div>

        <!-- Filters content -->
        <div :class="['filters-content', { 'filters-hidden': !showFilters }]">
            <h3 class="filters-title hidden md:block">Filters</h3>

            <div class="filters-grid">
                <!-- Role Filter -->
                <FilterGroup title="Role" :options="roleOptions" :active="activeRoleFilters"
                    @toggle="v => $emit('toggleRole', v)" />

                <!-- Castle Filter -->
                <FilterGroup title="Castle Level" :options="castleOptions" :active="activeCastleFilters"
                    @toggle="v => $emit('toggleCastle', v)" />

                <!-- Power Filter -->
                <FilterGroup title="Power Range" :options="powerOptions" :active="activePowerFilters"
                    @toggle="v => $emit('togglePower', v)" />

                <!-- Day Filter -->
                <FilterGroup :emptyMeansAll="true" title="Include Days" :options="dayOptions" :active="activeDayFilters"
                    @toggle="$emit('toggleDay', $event)" />

                <!-- Score Filter -->
                <ScoreFilter :modelValue="scoreFilter" @update:modelValue="$emit('updateScoreFilter', $event)" />
            </div>

            <!-- Active filters summary -->
            <div v-if="hasActiveFilters" class="active-filters">
                <div class="active-filters-header">
                    <span class="active-count">{{ activeFiltersCount }} active filter{{ activeFiltersCount !== 1 ? 's' :
                        '' }}</span>
                    <button @click="$emit('clearAllFilters')" class="clear-all-btn">
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FilterGroup from './FilterGroup.vue'
import ScoreFilter from './ScoreFilter.vue'

const props = defineProps({
    activeRoleFilters: Array,
    activeCastleFilters: Array,
    activePowerFilters: Array,
    activeDayFilters: Array,
    scoreFilter: Object,
    allDays: Array,
    dayHasData: Object,
    dayOptions: Array
})

const emit = defineEmits([
    'toggleRole',
    'toggleCastle',
    'togglePower',
    'toggleDay',
    'updateScoreFilter',
    'clearAllFilters'
])

const showFilters = ref(false)

// Filter options
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
    { label: '< 25M', value: '0-25M' },
    { label: '25-50M', value: '25-50M' },
    { label: '50-75M', value: '50-75M' },
    { label: '75-100M', value: '75-100M' },
    { label: '100M+', value: '100M+' }
]

// Active filters tracking
const hasActiveFilters = computed(() => {
    return (props.activeRoleFilters?.length > 0) ||
        (props.activeCastleFilters?.length > 0) ||
        (props.activePowerFilters?.length > 0) ||
        (props.activeDayFilters?.length > 0) ||
        (props.scoreFilter?.operator && props.scoreFilter?.value)
})

const activeFiltersCount = computed(() => {
    let count = 0
    if (props.activeRoleFilters?.length > 0) count++
    if (props.activeCastleFilters?.length > 0) count++
    if (props.activePowerFilters?.length > 0) count++
    if (props.activeDayFilters?.length > 0) count++
    if (props.scoreFilter?.operator && props.scoreFilter?.value) count++
    return count
})
</script>

<style scoped>
.filters-panel {
    @apply mb-6 border border-border rounded-xl bg-card shadow-sm;
}

.mobile-header {
    @apply p-4;
}

.mobile-toggle {
    @apply flex items-center justify-between w-full text-left;
    @apply text-foreground font-medium focus:outline-none;
}

.toggle-text {
    @apply text-lg font-semibold;
}

.toggle-icon {
    @apply w-5 h-5 transition-transform duration-200;
}

.filters-content {
    @apply p-4 md:p-6;
}

.filters-hidden {
    @apply hidden md:block;
}

.filters-title {
    @apply text-xl font-bold mb-6 text-foreground;
}

.filters-grid {
    @apply grid gap-6;
    @apply grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5;
}

.active-filters {
    @apply mt-6 pt-4 border-t border-border;
}

.active-filters-header {
    @apply flex items-center justify-between;
}

.active-count {
    @apply text-sm font-medium text-muted-foreground;
}

.clear-all-btn {
    @apply text-sm font-medium text-destructive hover:text-destructive/80;
    @apply focus:outline-none focus:underline;
    @apply transition-colors duration-200;
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .filters-grid {
        @apply grid-cols-1 gap-4;
    }

    .filters-content {
        @apply p-3;
    }

    .filters-title {
        @apply text-lg mb-4;
    }
}

/* Desktop hover effects */
@media (min-width: 769px) {
    .filters-panel {
        @apply hover:shadow-md transition-shadow duration-200;
    }
}
</style>