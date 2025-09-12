<template>
    <EventLayout>
        <EventHeader :guildName="guildName" :eventName="eventName" :summaryView="summaryView"
            :toggleSummaryView="toggleSummaryView" :byline="byline" />

        <main class="container mx-auto px-4 md:px-8 py-6 flex-grow">
            <section v-show="summaryView" class="mb-12" ref="summarySectionRef">
                <div class="bg-card rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-2xl font-bold mb-4 text-foreground">Event Summary</h2>
                    <OverviewCards :cards="overviewCards" />

                    <div class="flex flex-col md:flex-row gap-8">

                        <!-- Top Performers -->
                        <div class="w-full md:w-1/2">
                            <h3 class="text-xl font-semibold text-foreground">Top Performers</h3>
                            <h3 class="text-sm opacity-70 mb-3 text-muted-foreground">Overall Score</h3>

                            <EventTable :items="topPlayers" :columns="topPerformersColumns" :styling="whiteTableStyling"
                                :rowPadding="'py-2'" :rowLines="'border-b border-border'"
                                :columnLines="'border-b-2 border-border'" />
                        </div>

                        <!-- Efficiency Leaders -->
                        <div class="w-full md:w-1/2">
                            <h3 class="text-xl font-semibold text-foreground">Efficiency Leaders</h3>
                            <h3 class="text-sm opacity-70 mb-3 text-muted-foreground">Overall Score/Power</h3>

                            <EventTable :items="efficiencyLeaders" :columns="efficiencyLeadersColumns"
                                :styling="whiteTableStyling" :rowPadding="'py-2'" :rowLines="'border-b border-border'"
                                :columnLines="'border-b-2 border-border'" />
                        </div>

                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <OverallScoreCard :score="totalScoreOverall" />

                    <WorkbenchCard>
                        <WorkbenchChart :option="roleScoreChartOption" />
                    </WorkbenchCard>

                    <WorkbenchCard>
                        <WorkbenchChart :option="castleScoreChartOption" />
                    </WorkbenchCard>

                    <WorkbenchCard>
                        <WorkbenchChart :option="powerScatterOption" />
                    </WorkbenchCard>

                    <WorkbenchCard>
                        <WorkbenchChart :option="dailyPerformanceOption" />
                    </WorkbenchCard>

                    <WorkbenchCard>
                        <WorkbenchChart :option="totalScorePieOption" />
                    </WorkbenchCard>
                </div>
            </section>

            <section v-show="!summaryView" ref="comparisonSectionRef" class="mb-8 bg-card rounded-lg shadow-md p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-6">
                    <h2 class="text-2xl font-bold text-foreground">
                        Player Comparison
                    </h2>
                    <div class="flex md:justify-end">
                        <ComparisonSearchBar :searchTerm="eventStore.comparisonSearchTerm"
                            :searchResults="eventStore.filteredComparisonSearchResults"
                            @update:searchTerm="eventStore.updateComparisonSearchTerm"
                            @select="eventStore.addPlayerToComparisonFromSearch"
                            @keydown="eventStore.handleComparisonSearchKeydown" />
                    </div>
                </div>

                <div v-if="eventStore.selectedComparisonPlayers.length > 0">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold mb-2 text-foreground">
                            Selected Players for Comparison (Max {{ eventStore.maxComparisonPlayers }})
                        </h3>

                        <SelectedPlayersBadges />
                    </div>

                    <ComparisonChartContainer :option="comparisonDailyOption" />
                    <ComparisonCardsGrid :players="eventStore.selectedComparisonPlayers"
                        :fields="eventStore.comparisonFields" :colorMap="eventStore.playerColorMap"
                        @hover="eventStore.highlightSeries" @leave="eventStore.downplaySeries" />
                </div>
                <div v-else class="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <span class="text-2xl font-semibold mb-2">No Players Selected</span>
                    <p class="text-sm">Search for players to add them to the comparison!</p>
                </div>
            </section>

            <section v-show="!summaryView" class="mb-8">
                <div class="bg-card rounded-lg shadow-md p-6">

                    <!-- Header + Search -->
                    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                        <h2 class="text-2xl font-bold no-wrap text-foreground mb-4 md:mb-0">
                            Player Data
                        </h2>

                        <SearchBar :searchTerm="searchTerm" @update:searchTerm="v => searchTerm = v" />
                    </div>

                    <!-- Filters -->
                    <FiltersPanel :activeRoleFilters="activeRoleFilters" :activeCastleFilters="activeCastleFilters"
                        :activePowerFilters="activePowerFilters" :activeDayFilters="activeDayFilters"
                        :scoreFilter="scoreFilter" :allDays="allDays" :dayHasData="dayHasData" :dayOptions="dayOptions"
                        @toggleRole="toggleRoleFilter" @toggleCastle="toggleCastleFilter"
                        @togglePower="togglePowerFilter" @toggleDay="toggleDayFilter"
                        @updateScoreFilter="updateScoreFilter" @clearAllFilters="clearAllFilters" />

                    <!-- Table -->
                    <div class="overflow-x-auto">
                        <EventTable :columns="gvgTableColumns" :items="paginatedData"
                            :actions="gvgTableActions(togglePlayerForComparison)" :styling="gvgTableStyling"
                            :highlightRules="gvgTableHighlight" />
                    </div>

                    <!-- Pagination -->
                    <PaginationControls :page="page" :itemsPerPage="itemsPerPage"
                        :totalItems="filteredAndSortedData.length" :paginatedLength="paginatedData.length"
                        @changePage="v => page = v" @changeItemsPerPage="v => { itemsPerPage = v; page = 1; }" />

                </div>
            </section>
        </main>

        <div class="tooltip" ref="tooltip"></div>
        <!-- Add this just before </EventLayout> -->
        <BaduModal v-model="isBaduOpen" @yes="isBaduOpen = false" @no="isBaduOpen = false" />

    </EventLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import { TimelineComponent } from 'echarts/components';
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline'
import EventLayout from './layouts/EventLayout.vue';
import EventHeader from './layouts/EventHeader.vue';
import OverviewCards from './layouts/Cards/OverviewCards.vue';
import OverallScoreCard from './layouts/Cards/OverallScoreCard.vue';
import EventTable from './layouts/EventTable.vue';
import ComparisonSearchBar from './layouts/PlayerComparison/ComparisonSearchBar.vue'
import SelectedPlayersBadges from './layouts/PlayerComparison/SelectedPlayersBadges.vue'
import ComparisonChartContainer from './layouts/PlayerComparison/ComparisonChartContainer.vue'
import ComparisonCardsGrid from './layouts/PlayerComparison/ComparisonCardsGrid.vue'
import SearchBar from './layouts/PlayerData/SearchBar.vue'
import FiltersPanel from './layouts/PlayerData/FiltersPanel.vue'
import PaginationControls from './layouts/PlayerData/PaginationControls.vue'
import WorkbenchCard from '@/pages/topheroes/velaris/events/layouts/Cards/WorkbenchCard.vue'
import WorkbenchChart from '@/pages/topheroes/velaris/events/layouts/Charts/WorkbenchChart.vue'
import { useCastleScoreOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/castleScoreOption'
import { useRoleScoreOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/roleScoreOption'
import { usePowerScatterOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/powerScatterOption'
import { useDailyPerformanceOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/dailyPerformanceOption'
import { useTotalScorePieOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/totalScorePieOption'
import { useComparisonDailyOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/comparisonChartOption'
import { formatPlayerName } from '@/utils/useFormatPlayerName'
import { useRoute, useRouter } from 'vue-router';
import { useEventDataStore } from '@/stores/useEventDataStore'
import { useThemeStore } from '@/stores/useThemeStore'
import BaduModal from '@/pages/topheroes/velaris/admin/BaduModal.vue'

echarts.use([TimelineComponent]);

// Import specific properties and methods from the store
const eventStore = useEventDataStore()
const themeStore = useThemeStore()
const route = useRoute()
const router = useRouter()

const isBaduOpen = ref(false)

// --- Reactive State ---
const summaryView = ref(true)
const comparisonView = ref(false)

// Load event data
onMounted(() => {
    const eventId = route.params.eventId;
    if (eventId) {
        eventStore.loadFromFirestore(eventId);
    }

    // Check URL parameter to set initial view
    const viewParam = route.query.view;
    summaryView.value = viewParam !== 'table';

    // Open modal when the page loads
    isBaduOpen.value = true
});

const forceRefresh = () => {
    eventStore.forceRefresh()
}

// --- Computed Data Access ---
// Basic meta
const players = computed(() => eventStore.players)
const guildName = computed(() => eventStore.eventMeta.guildName)
const eventName = computed(() => eventStore.eventMeta.eventName)
const byline = computed(() => eventStore.eventMeta.byline)

// Player summaries
const totalPlayers = computed(() => eventStore.totalPlayers)
const activePlayers = computed(() => eventStore.activePlayers)
const totalScoreOverall = computed(() => eventStore.totalScoreOverall)
const averagePower = computed(() => eventStore.formatNumber(eventStore.averagePower / 1000000, 2))
const averageCastleLevel = computed(() => eventStore.averageCastle)

// Top 10 Lists
const topPlayers = computed(() => eventStore.topPerformers)
const efficiencyLeaders = computed(() => eventStore.efficiencyLeaders)

// Day controls
const allDays = computed(() => eventStore.allDays)
const dayHasData = computed(() => eventStore.dayHasData)
const dayOptions = computed(() => eventStore.dayOptions)

// Filtering
const searchTerm = computed({
    get: () => eventStore.searchTerm,
    set: (v) => eventStore.searchTerm = v
})
const activeRoleFilters = computed({
    get: () => eventStore.activeRoleFilters,
    set: (v) => eventStore.activeRoleFilters = v
})
const activeCastleFilters = computed({
    get: () => eventStore.activeCastleFilters,
    set: (v) => eventStore.activeCastleFilters = v
})
const activePowerFilters = computed({
    get: () => eventStore.activePowerFilters,
    set: (v) => eventStore.activePowerFilters = v
})
const activeDayFilters = computed({
    get: () => eventStore.activeDayFilters,
    set: (v) => eventStore.activeDayFilters = v
})
const scoreFilter = computed({
    get: () => eventStore.scoreFilter || { operator: '', value: null },
    set: (v) => eventStore.scoreFilter = v
})

// Sorting & Paging
const page = computed({
    get: () => eventStore.page,
    set: (v) => eventStore.page = v
})
const itemsPerPage = computed({
    get: () => eventStore.itemsPerPage,
    set: (v) => eventStore.itemsPerPage = v
})

// Processed data
const paginatedData = computed(() => eventStore.paginatedData)
const filteredAndSortedData = computed(() => eventStore.filteredAndSortedData)

// Comparison View
const selectedComparisonPlayers = computed({
    get: () => eventStore.selectedComparisonPlayers,
    set: (v) => eventStore.selectedComparisonPlayers = v
})

const updateScoreFilter = (filterObj) => {
    eventStore.scoreFilter = filterObj
}

const clearAllFilters = () => {
    eventStore.activeRoleFilters = []
    eventStore.activeCastleFilters = []
    eventStore.activePowerFilters = []
    eventStore.activeDayFilters = []
    eventStore.scoreFilter = { operator: '', value: null }
}

// Utility methods
const toggleRoleFilter = eventStore.toggleRoleFilter
const toggleCastleFilter = eventStore.toggleCastleFilter
const togglePowerFilter = eventStore.togglePowerFilter
const toggleDayFilter = eventStore.toggleDayFilter
const togglePlayerForComparison = eventStore.togglePlayerForComparison

const minimumScore = (1000000)
const overviewCards = computed(() => [
    { label: 'Total Players', byline: 'Overall', value: totalPlayers, colour: 'hsl(var(--velaris-purple))' },
    { label: 'Active Players', byline: 'Overall', value: activePlayers, colour: 'hsl(var(--velaris-teal))' },
    { label: 'Avg Power', byline: 'Active', value: `${averagePower.value}M`, colour: 'hsl(var(--velaris-green))' },
    { label: 'Avg Castle', byline: 'Active', value: averageCastleLevel, colour: 'hsl(var(--velaris-amber))' },
])

// --- URL HANDLING - FIXED VERSION ---
const toggleSummaryView = () => {
    const newSummaryView = !summaryView.value;

    // Update state
    summaryView.value = newSummaryView;

    // Update URL
    const currentQuery = { ...route.query };
    if (newSummaryView) {
        // Summary view - remove the view param for cleaner URLs
        delete currentQuery.view;
    } else {
        // Table view - add the view param
        currentQuery.view = 'table';
    }

    // Use history.replaceState to update URL without triggering Vue Router navigation
    const newUrl = router.resolve({
        path: route.path,
        query: currentQuery
    }).href;

    window.history.replaceState(window.history.state, '', newUrl);

    // Handle chart cleanup
    if (newSummaryView) {
        comparisonView.value = false;
        destroyChart('playerComparisonDailyChart');
    } else {
        destroySummaryCharts();
    }
};

// Only watch for external URL changes (browser back/forward)
watch(() => route.query.view, (newView) => {
    const shouldBeSummary = newView !== 'table';
    if (summaryView.value !== shouldBeSummary) {
        summaryView.value = shouldBeSummary;

        // Handle chart cleanup
        if (shouldBeSummary) {
            comparisonView.value = false;
            destroyChart('playerComparisonDailyChart');
        } else {
            destroySummaryCharts();
        }
    }
}, { immediate: false });

const gvgTableActions = (togglePlayerForComparison) => [
    {
        label: 'Compare',
        icon: AdjustmentsHorizontalIcon,
        color: 'text-blue-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300',
        onClick: togglePlayerForComparison
    }
]
const gvgTableStyling = {
    wrapper: 'bg-muted shadow-xl rounded-lg',
    header: 'bg-muted-foreground/10 text-foreground hover:text-foreground/80',
    row: 'hover:bg-muted/50 py-0',
    column: {
        Score: { cell: 'font-semibold' }
    },
}
const gvgTableHighlight = [
    { column: 'dynamicTotalScore', operator: '<=', value: minimumScore, class: 'bg-destructive/20' }
]
const gvgTableColumns = [
    { label: 'Rank', key: 'dynamicTotalRank', sortable: true, headerClass: 'text-center' },
    {
        label: 'Player',
        key: 'Player',
        sortable: true,
        html: true,
        format: formatPlayerName
    },
    { label: 'Country', key: 'Country', sortable: true },
    { label: 'Power', key: 'Power', sortable: true, format: val => eventStore.formatNumber((val / 1000000), 2) + 'M' },
    { label: 'Castle', key: 'Castle', sortable: true },
    { label: 'Role', key: 'Role', sortable: true },
    {
        label: 'Score',
        key: 'dynamicTotalScore',
        sortable: true,
        format: val => eventStore.formatNumber(val, 0)
    },
    {
        label: 'Score/Power',
        key: 'scorePerPower',
        sortable: true,
        format: val => eventStore.formatNumber((val * 1000000), 0)
    }
]

const topPerformersColumns = [
    { label: 'Rank', key: 'Total Rank', sortable: false },
    {
        label: 'Player',
        key: 'Player',
        sortable: false,
        html: true,
        format: formatPlayerName
    },
    {
        label: 'Total Score',
        key: 'Total Score',
        sortable: false,
        format: val => eventStore.formatNumber(val, 0)
    }
]

const efficiencyLeadersColumns = [
    { label: 'Rank', key: 'Total Rank', sortable: false },
    {
        label: 'Player',
        key: 'Player',
        sortable: false,
        html: true,
        format: formatPlayerName
    },
    {
        label: 'Score/Power',
        key: 'scorePerPower',
        sortable: false,
        format: val => eventStore.formatNumber((val * 1000000), 0)
    }
]
const whiteTableStyling = {
    wrapper: 'bg-card shadow rounded-lg overflow-hidden',
    header: 'bg-muted text-muted-foreground text-sm font-semibold',
    row: 'hover:bg-muted/30',
    column: {
        'Rank': { header: '', cell: 'text-sm text-muted-foreground' },
        'Player': { header: '', cell: 'text-sm text-foreground' },
        'Total Score': { header: '', cell: 'text-sm text-foreground text-center' },
        'Score/Power': { header: '', cell: 'text-sm text-foreground text-center' }
    }
}

// Chart options - all automatically themed
const castleScoreChartOption = useCastleScoreOption(players, allDays)
const roleScoreChartOption = useRoleScoreOption(players)
const powerScatterOption = usePowerScatterOption(players)
const dailyPerformanceOption = useDailyPerformanceOption(players, allDays)
const totalScorePieOption = useTotalScorePieOption(players, allDays)
const comparisonDailyOption = useComparisonDailyOption(selectedComparisonPlayers, allDays)

// --- Lifecycle & watchers ---
watch(comparisonView, val => {
    if (!val) selectedComparisonPlayers.value = [];
})

watch(selectedComparisonPlayers, (players) => {
    if (players.length === 0) {
        comparisonView.value = false
    }
})

const destroyChart = (id) => {
    const chartElement = document.getElementById(id);
    if (chartElement && chartElement.__chart__) {
        chartElement.__chart__.dispose();
        chartElement.__chart__ = null;
    }
};

const destroySummaryCharts = () => {
    destroyChart('roleScoreChart');
    destroyChart('castleScoreChart');
    destroyChart('powerScoreChart');
    destroyChart('dailyPerformanceChart');
    destroyChart('totalScoreChart');
    destroyChart('scoreByDayPie');
};

</script>

<style scoped>
[v-cloak] {
    display: none;
}
</style>