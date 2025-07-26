<template>
    <EventLayout>
        <!-- Header: Now driven by the new eventStore -->
        <EventHeader :guildName="eventStore.eventMeta.guildName" :eventName="eventStore.eventMeta.eventName"
            :byline="eventStore.eventMeta.byline" :summaryView="summaryView" @toggle-summary-view="toggleSummaryView" />

        <main class="container mx-auto px-4 md:px-8 py-6 flex-grow">
            <!-- Loading Indicator -->
            <div v-if="!eventStore.isLoaded" class="text-center py-16">
                <p class="text-2xl font-semibold text-gray-600">Loading Event Data...</p>
            </div>

            <template v-else>
                <!-- Summary Section: Switched to v-if -->
                <section v-if="summaryView" class="mb-12">
                    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 class="text-2xl font-bold mb-4 text-gray-700">Event Summary</h2>
                        <OverviewCards :cards="overviewCards" />

                        <div class="flex flex-col md:flex-row gap-8 mt-8">
                            <div class="w-full md:w-1/2">
                                <h3 class="text-xl font-semibold">Top Performers</h3>
                                <h3 class="text-sm opacity-70 mb-3">Overall Score</h3>
                                <EventTable :items="eventStore.topPerformers" :columns="topPerformersColumns"
                                    :styling="whiteTableStyling" />
                            </div>
                            <div class="w-full md:w-1/2">
                                <h3 class="text-xl font-semibold">Efficiency Leaders</h3>
                                <h3 class="text-sm opacity-70 mb-3">Overall Score/Power</h3>
                                <EventTable :items="eventStore.efficiencyLeaders" :columns="efficiencyLeadersColumns"
                                    :styling="whiteTableStyling" />
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

                <!-- Comparison Section: Switched to v-if -->
                <section v-if="!summaryView" class="mb-8 bg-white rounded-lg shadow-md p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-700">Player Comparison</h2>
                        <div class="flex md:justify-end">
                            <ComparisonSearchBar :searchTerm="comparison.comparisonSearchTerm.value"
                                :searchResults="comparison.filteredSearchResults.value || []"
                                @update:searchTerm="val => comparison.comparisonSearchTerm.value = val"
                                @select="comparison.addPlayerToComparisonFromSearch"
                                @keydown="comparison.handleComparisonSearchKeydown" />
                        </div>
                    </div>

                    <div v-if="comparison.selected.value.length > 0">
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold mb-2 text-gray-700">
                                Selected Players (Max {{ comparison.maxComparisonPlayers }})
                            </h3>
                            <SelectedPlayersBadges :players="comparison.selected.value"
                                :colorMap="comparison.colorMap.value" @remove="comparison.removePlayerFromComparison" />
                        </div>
                        <ComparisonChartContainer :option="comparisonDailyOption" />
                        <ComparisonCardsGrid :players="comparison.selected.value" :fields="comparison.comparisonFields"
                            :colorMap="comparison.colorMap.value" @hover="comparison.highlightSeries"
                            @leave="comparison.downplaySeries" />
                    </div>
                    <div v-else class="flex flex-col items-center justify-center py-12 text-gray-500">
                        <span class="text-2xl font-semibold mb-2">No Players Selected</span>
                        <p class="text-sm">Search for players to add them to the comparison!</p>
                    </div>
                </section>

                <!-- Player Data Table Section: Switched to v-if -->
                <section v-if="!summaryView" class="mb-8">
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                            <h2 class="text-2xl font-bold no-wrap text-gray-700 mb-4 md:mb-0">Player Data</h2>
                            <SearchBar :searchTerm="eventStore.searchTerm"
                                @update:searchTerm="val => eventStore.searchTerm = val" />
                        </div>

                        <FiltersPanel :activeRoleFilters="eventStore.activeRoleFilters"
                            :activeCastleFilters="eventStore.activeCastleFilters"
                            :activePowerFilters="eventStore.activePowerFilters"
                            :activeDayFilters="eventStore.activeDayFilters" :lowScoreFilter="eventStore.lowScoreFilter"
                            :dayOptions="eventStore.dayOptions" @toggleRole="eventStore.toggleRoleFilter"
                            @toggleCastle="eventStore.toggleCastleFilter" @togglePower="eventStore.togglePowerFilter"
                            @toggleDay="eventStore.toggleDayFilter" @toggleLowScore="eventStore.toggleLowScoreFilter" />

                        <div class="overflow-x-auto mt-6">
                            <EventTable :columns="gvgTableColumns" :items="eventStore.paginatedData"
                                :actions="gvgTableActions" :styling="gvgTableStyling" :sortField="eventStore.sortField"
                                :sortDirection="eventStore.sortDirection" @updateSort="eventStore.updateSort" />
                        </div>

                        <PaginationControls :page="eventStore.page" :itemsPerPage="eventStore.itemsPerPage"
                            :totalItems="eventStore.filteredAndSortedData.length"
                            :paginatedLength="eventStore.paginatedData.length"
                            @changePage="val => eventStore.page = val"
                            @changeItemsPerPage="val => { eventStore.itemsPerPage = val; eventStore.page = 1; }" />
                    </div>
                </section>
            </template>
        </main>
    </EventLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline';

// Import using the paths you provided
import { useEventDataStore } from '@/stores/useEventDataStore2';
import { useComparisonPlayers } from '@/composables/useComparisonPlayer';

// Import child components (paths might need adjustment)
import EventLayout from './layouts/EventLayout.vue';
import EventHeader from './layouts/EventHeader.vue';
import OverviewCards from './layouts/Cards/OverviewCards.vue';
import EventTable from './layouts/EventTable.vue';
import ComparisonSearchBar from './layouts/PlayerComparison/ComparisonSearchBar.vue';
import SelectedPlayersBadges from './layouts/PlayerComparison/SelectedPlayersBadges.vue';
import ComparisonChartContainer from './layouts/PlayerComparison/ComparisonChartContainer.vue';
import ComparisonCardsGrid from './layouts/PlayerComparison/ComparisonCardsGrid.vue';
import SearchBar from './layouts/PlayerData/SearchBar.vue';
import FiltersPanel from './layouts/PlayerData/FiltersPanel.vue';
import PaginationControls from './layouts/PlayerData/PaginationControls.vue';

import WorkbenchCard from '@/pages/topheroes/velaris/events/layouts/Cards/WorkbenchCard.vue'
import WorkbenchChart from '@/pages/topheroes/velaris/events/layouts/Charts/WorkbenchChart.vue'
import { useCastleScoreOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/castleScoreOption'
import { useRoleScoreOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/roleScoreOption'
import { usePowerScatterOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/powerScatterOption'
import { useDailyPerformanceOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/dailyPerformanceOption'
import { useTotalScorePieOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/totalScorePieOption'
import { formatPlayerName } from '@/utils/useFormatPlayerName'

// --- Store and Composable Initialization ---
const route = useRoute();
const eventStore = useEventDataStore();
const { players } = storeToRefs(eventStore);
const comparison = useComparisonPlayers(players);

// --- Component State ---
const summaryView = ref(true);

// --- Lifecycle Hooks (Updated with your requested logic) ---
onMounted(() => {
    const eventId = route.params.eventId;
    if (eventId) {
        eventStore.loadFromFirestore(eventId);
    }
});

// --- UI Toggles ---
const toggleSummaryView = () => {
    summaryView.value = !summaryView.value;
    if (summaryView.value) {
        comparisonView.value = false;
        destroyChart('playerComparisonDailyChart');
    } else {
        destroySummaryCharts();
    }
};

// --- Computed properties for the template ---
const overviewCards = computed(() => [
    { label: 'Total Players', value: eventStore.totalPlayers, colour: '#4f46e5' },
    { label: 'Active Players', value: eventStore.activePlayers, colour: '#9333ea' },
    { label: 'Avg Power', value: `${eventStore.formatNumber(eventStore.averagePower, 1)}M`, colour: '#2563eb' },
    { label: 'Avg Castle', value: eventStore.averageCastle, colour: '#16a34a' },
]);

// --- Table Configurations ---
const gvgTableActions = computed(() => [
    {
        label: 'Compare',
        icon: AdjustmentsHorizontalIcon,
        color: 'text-indigo-400 hover:text-indigo-600',
        onClick: (player) => comparison.toggle(player)
    }
]);

const gvgTableStyling = {
    wrapper: 'bg-white shadow-sm rounded-lg',
    header: 'bg-gray-100 text-gray-600 font-semibold',
    row: 'hover:bg-gray-50',
};

const gvgTableColumns = [
    { label: 'Rank', key: 'dynamicTotalRank', sortable: true, headerClass: 'text-center' },
    { label: 'Player', key: 'player', sortable: true },
    { label: 'Power (M)', key: 'power', sortable: true, format: val => eventStore.formatNumber(val, 1) },
    { label: 'Castle', key: 'castle', sortable: true },
    { label: 'Role', key: 'role', sortable: true },
    { label: 'Score', key: 'dynamicTotalScore', sortable: true, format: val => eventStore.formatNumber(val) },
    { label: 'Score/Power', key: 'scorePerPower', sortable: true, format: val => eventStore.formatNumber(val) }
];

const topPerformersColumns = [
    { label: 'Player', key: 'player' },
    { label: 'Total Score', key: 'totalScore', format: val => eventStore.formatNumber(val) }
];

const efficiencyLeadersColumns = [
    { label: 'Player', key: 'player' },
    { label: 'Score/Power (M)', key: 'scorePerPower', format: val => eventStore.formatNumber((val * 1000000), 0) }
];

const whiteTableStyling = {
    wrapper: 'bg-white',
    header: 'bg-gray-50 text-gray-500 text-xs font-medium',
    row: 'hover:bg-gray-50',
};

const dayTasks = {
    D1: 'Construction',
    D2: 'Research',
    D3: 'Rally',
    D4: 'Hero',
    D5: 'Training',
    D6: 'Combat'
}

// --- Chart Options ---
const castleScoreChartOption = useCastleScoreOption(players, eventStore.allDays)
const roleScoreChartOption = useRoleScoreOption(players)
const powerScatterOption = usePowerScatterOption(players)
const dailyPerformanceOption = useDailyPerformanceOption(players, eventStore.allDays)
const totalScorePieOption = useTotalScorePieOption(players, eventStore.allDays)
const theme = ref('lightColour')

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
