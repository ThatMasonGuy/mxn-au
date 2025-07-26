<template>
    <EventLayout>
        <EventHeader :guildName="guildName" :eventName="eventName" :summaryView="summaryView"
            :toggleSummaryView="toggleSummaryView" :byline="byline" />

        <main class="container mx-auto px-4 md:px-8 py-6 flex-grow">
            <section v-show="summaryView" class="mb-12" ref="summarySectionRef">
                <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-2xl font-bold mb-4 text-gray-700">Event Summary</h2>
                    <OverviewCards :cards="overviewCards" />

                    <div class="flex flex-col md:flex-row gap-8">

                        <!-- Top Performers -->
                        <div class="w-full md:w-1/2">
                            <h3 class="text-xl font-semibold">Top Performers</h3>
                            <h3 class="text-sm opacity-70 mb-3">Overall Score</h3>

                            <EventTable :items="topPlayers" :columns="topPerformersColumns" :styling="whiteTableStyling"
                                :rowPadding="'py-2'" :rowLines="'border-b border-gray-200'"
                                :columnLines="'border-b-2 border-gray-200'" />
                        </div>

                        <!-- Efficiency Leaders -->
                        <div class="w-full md:w-1/2">
                            <h3 class="text-xl font-semibold">Efficiency Leaders</h3>
                            <h3 class="text-sm opacity-70 mb-3">Overall Score/Power</h3>

                            <EventTable :items="efficiencyLeaders" :columns="efficiencyLeadersColumns"
                                :styling="whiteTableStyling" :rowPadding="'py-2'" :rowLines="'border-b border-gray-200'"
                                :columnLines="'border-b-2 border-gray-200'" />
                        </div>

                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <OverallScoreCard :score="totalScoreOverall" />

                    <WorkbenchCard :theme="theme">
                        <WorkbenchChart :option="roleScoreChartOption" :theme="theme" />
                    </WorkbenchCard>

                    <WorkbenchCard :theme="theme">
                        <WorkbenchChart :option="castleScoreChartOption" :theme="theme" />
                    </WorkbenchCard>

                    <WorkbenchCard :theme="theme">
                        <WorkbenchChart :option="powerScatterOption" :theme="theme" />
                    </WorkbenchCard>

                    <WorkbenchCard :theme="theme">
                        <WorkbenchChart :option="dailyPerformanceOption" :theme="theme" />
                    </WorkbenchCard>

                    <WorkbenchCard :theme="theme">
                        <WorkbenchChart :option="totalScorePieOption" :theme="theme" />
                    </WorkbenchCard>
                </div>
            </section>

            <section v-show="!summaryView" ref="comparisonSectionRef" class="mb-8 bg-white rounded-lg shadow-md p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-700">
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
                        <h3 class="text-lg font-semibold mb-2 text-gray-700">
                            Selected Players for Comparison (Max {{ eventStore.maxComparisonPlayers }})
                        </h3>

                        <SelectedPlayersBadges />
                    </div>

                    <ComparisonChartContainer :option="comparisonDailyOption" />
                    <ComparisonCardsGrid :players="eventStore.selectedComparisonPlayers"
                        :fields="eventStore.comparisonFields" :colorMap="eventStore.playerColorMap"
                        @hover="eventStore.highlightSeries" @leave="eventStore.downplaySeries" />
                </div>
                <div v-else class="flex flex-col items-center justify-center py-12 text-gray-500">
                    <span class="text-2xl font-semibold mb-2">No Players Selected</span>
                    <p class="text-sm">Search for players to add them to the comparison!</p>
                </div>
            </section>

            <section v-show="!summaryView" class="mb-8">
                <div class="bg-white rounded-lg shadow-md p-6">

                    <!-- Header + Search -->
                    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                        <h2 class="text-2xl font-bold no-wrap text-gray-700 mb-4 md:mb-0">
                            Player Data
                        </h2>

                        <SearchBar :searchTerm="searchTerm" @update:searchTerm="v => searchTerm = v" />
                    </div>

                    <!-- Filters -->
                    <FiltersPanel :activeRoleFilters="activeRoleFilters" :activeCastleFilters="activeCastleFilters"
                        :activePowerFilters="activePowerFilters" :activeDayFilters="activeDayFilters"
                        :lowScoreFilter="lowScoreFilter" :allDays="allDays" :dayHasData="dayHasData"
                        :dayOptions="dayOptions" @toggleRole="toggleRoleFilter" @toggleCastle="toggleCastleFilter"
                        @togglePower="togglePowerFilter" @toggleDay="toggleDayFilter"
                        @toggleLowScore="toggleLowScoreFilter" />

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
    </EventLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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
import { formatPlayerName } from '@/utils/useFormatPlayerName'
import { useRoute } from 'vue-router';
import { useEventDataStore } from '@/stores/useEventDataStore'

echarts.use([TimelineComponent]);

// Import specific properties and methods from the store
const eventStore = useEventDataStore()
const route = useRoute()

// Load event data
onMounted(() => {
    const eventId = route.params.eventId;
    if (eventId) {
        eventStore.loadFromFirestore(eventId);
    }
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
const lowScoreFilter = computed({
    get: () => eventStore.lowScoreFilter,
    set: (v) => eventStore.lowScoreFilter = v
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

// Utility methods
const toggleRoleFilter = eventStore.toggleRoleFilter
const toggleCastleFilter = eventStore.toggleCastleFilter
const togglePowerFilter = eventStore.togglePowerFilter
const toggleDayFilter = eventStore.toggleDayFilter
const toggleLowScoreFilter = eventStore.toggleLowScoreFilter
const togglePlayerForComparison = eventStore.togglePlayerForComparison

// --- Reactive State ---
const summaryView = ref(true)
const comparisonView = ref(false)
const minimumScore = (1000000)
const overviewCards = computed(() => [
    { label: 'Total Players', byline: 'Overall', value: totalPlayers, colour: '#4f46e5' },
    { label: 'Active Players', byline: 'Overall', value: activePlayers, colour: '#9333ea' },
    { label: 'Avg Power', byline: 'Active', value: `${averagePower.value}M`, colour: '#2563eb' },
    { label: 'Avg Castle', byline: 'Active', value: averageCastleLevel, colour: '#16a34a' },
])
const gvgTableActions = (togglePlayerForComparison) => [
    {
        label: 'Compare',
        icon: AdjustmentsHorizontalIcon,
        color: 'text-indigo-400 hover:text-indigo-600',
        onClick: togglePlayerForComparison
    }
]
const gvgTableStyling = {
    wrapper: 'bg-gray-50 shadow-xl rounded-lg',
    header: 'bg-gray-200 text-gray-700 hover:text-gray-900',
    row: 'hover:bg-gray-100 py-0',
    column: {
        Score: { cell: 'font-semibold' }
    },
}
const gvgTableHighlight = [
    { column: 'dynamicTotalScore', operator: '<=', value: minimumScore, class: 'bg-red-200' }
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
    wrapper: 'bg-white shadow rounded-lg overflow-hidden',
    header: 'bg-gray-100 text-gray-600 text-sm font-semibold',
    row: 'hover:bg-gray-50',
    column: {
        'Rank': { header: '', cell: 'text-sm text-gray-600' },
        'Player': { header: '', cell: 'text-sm text-gray-600' },
        'Total Score': { header: '', cell: 'text-sm text-gray-600 text-center' },
        'Score/Power': { header: '', cell: 'text-sm text-gray-600 text-center' }
    }
}

const dayTasks = {
    D1: 'Construction',
    D2: 'Research',
    D3: 'Rally',
    D4: 'Hero',
    D5: 'Training',
    D6: 'Combat'
}
const comparisonColours = [
    '#1f77b4', // blue
    '#ff7f0e', // orange
    '#2ca02c', // green
    '#d62728', // red
    '#9467bd', // purple
    '#8c564b', // brown
    '#e377c2', // pink
    '#7f7f7f', // grey
    '#bcbd22', // olive
    '#17becf'  // cyan
];

const castleScoreChartOption = useCastleScoreOption(players, allDays)
const roleScoreChartOption = useRoleScoreOption(players)
const powerScatterOption = usePowerScatterOption(players)
const dailyPerformanceOption = useDailyPerformanceOption(players, allDays)
const totalScorePieOption = useTotalScorePieOption(players, allDays)
const theme = ref('lightColour')

const toggleSummaryView = () => {
    summaryView.value = !summaryView.value;
    if (summaryView.value) {
        comparisonView.value = false;
        destroyChart('playerComparisonDailyChart');
    } else {
        destroySummaryCharts();
    }
};

// --- Daily Performance Comparison ---
const comparisonDailyOption = computed(() => {
    if (!selectedComparisonPlayers.value.length) {
        return {
            baseOption: {
                title: {
                    text: 'Daily Performance Comparison',
                    left: 'center',
                    textStyle: { fontSize: 18, fontWeight: 'bold' }
                },
                tooltip: { trigger: 'axis' },
                grid: { top: 70, bottom: 60, left: '10%', right: '10%' },
                xAxis: { type: 'category', data: [] },
                yAxis: { type: 'value' },
                series: [],
            },
            media: []
        }
    }

    const dayLabels = allDays.value.map(d => dayTasks[`D${d}`])

    return {
        baseOption: {
            title: { text: 'Daily Performance Comparison', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(50,50,50,0.9)',
                borderColor: '#888',
                borderWidth: 1,
                textStyle: { color: '#fff' },
                axisPointer: { type: 'line', lineStyle: { color: '#bbb', type: 'dashed' } }
            },
            grid: { top: 70, bottom: 60, left: '10%', right: '10%' },
            xAxis: {
                type: 'category',
                data: dayLabels,
                axisLine: { lineStyle: { color: '#ccc' } },
                axisLabel: { fontWeight: 'bold', color: '#333', interval: 0 },
                axisTick: { alignWithLabel: true }
            },
            yAxis: {
                type: 'value',
                axisLabel: { formatter: v => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v.toLocaleString(), color: '#333' },
                splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
            },
            legend: {
                data: selectedComparisonPlayers.value.map(p => p.Player),
                orient: 'horizontal',
                bottom: 0,
                textStyle: { fontWeight: 'bold', color: '#333' }
            },
            series: selectedComparisonPlayers.value.map((player, i) => ({
                name: player.Player,
                type: 'line',
                smooth: 0.3,
                symbol: 'circle',
                symbolSize: 6,
                hoverAnimation: false,
                lineStyle: { width: 3, color: comparisonColours[i % comparisonColours.length] },
                itemStyle: { color: comparisonColours[i % comparisonColours.length], borderWidth: 1, borderColor: '#fff' },
                emphasis: { focus: 'series', lineStyle: { width: 4 }, itemStyle: { borderWidth: 2, borderColor: '#000' } },
                data: allDays.value.map(d => player[`Score (D${d})`] || 0)
            }))
        },
        media: [{
            query: { maxWidth: 600 },
            option: { grid: { top: 50, bottom: 50, left: '5%', right: '5%' } }
        }]
    }
})


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
