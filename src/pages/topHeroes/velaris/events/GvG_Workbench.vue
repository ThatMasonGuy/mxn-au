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
                    <RoleScoreChart :option="roleChartOption" />
                    <CastleScoreChart :option="castleScoreChartOption" />
                    <PowerScoreScatterChart :option="scatterOption" />
                    <DailyPerformanceChart :option="dailyOption" />
                    <TotalScorePieChart :option="totalScoreByDayPieOption" />
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
import { graphic, getInstanceByDom } from 'echarts/core'
import * as echarts from 'echarts/core'
import { TimelineComponent } from 'echarts/components';
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline'
import EventLayout from './layouts/EventLayout.vue';
import EventHeader from './layouts/EventHeader.vue';
import OverviewCards from './layouts/OverviewCards.vue';
import EventTable from './layouts/EventTable.vue';
import OverallScoreCard from './layouts/Charts/OverallScoreCard.vue'
import RoleScoreChart from './layouts/Charts/RoleScoreChart.vue'
import CastleScoreChart from './layouts/Charts/CastleScoreChart.vue'
import PowerScoreScatterChart from './layouts/Charts/PowerScoreScatterChart.vue'
import DailyPerformanceChart from './layouts/Charts/DailyPerformanceChart.vue'
import TotalScorePieChart from './layouts/Charts/TotalScorePieChart.vue'
import ComparisonSearchBar from './layouts/PlayerComparison/ComparisonSearchBar.vue'
import SelectedPlayersBadges from './layouts/PlayerComparison/SelectedPlayersBadges.vue'
import ComparisonChartContainer from './layouts/PlayerComparison/ComparisonChartContainer.vue'
import ComparisonCardsGrid from './layouts/PlayerComparison/ComparisonCardsGrid.vue'
import SearchBar from './layouts/PlayerData/SearchBar.vue'
import FiltersPanel from './layouts/PlayerData/FiltersPanel.vue'
import PaginationControls from './layouts/PlayerData/PaginationControls.vue'

echarts.use([TimelineComponent]);

import { useEventDataStore } from '@/stores/useEventDataStore'

// Import specific properties and methods from the store
const eventStore = useEventDataStore()

// Load event data
import eventJson from '@/data/event_vlr_gvg_apr-25.json'
onMounted(() => {
    eventStore.loadEvent(eventJson)
})

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
const averagePower = computed(() => eventStore.averagePower)
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
const gvgTableColumns = [
    { label: 'Rank', key: 'dynamicTotalRank', sortable: true, headerClass: 'text-center' },
    { label: 'Player', key: 'Player', sortable: true },
    { label: 'Power', key: 'Power', sortable: true, format: (val) => val + 'M' },
    { label: 'Castle', key: 'Castle', sortable: true },
    { label: 'Role', key: 'Role', sortable: true },
    { label: 'Score', key: 'dynamicTotalScore', sortable: true, format: (val) => eventStore.formatNumber(val) },
    { label: 'Score/Power', key: 'scorePerPower', sortable: true, format: (val) => eventStore.formatNumber(val, 2) }
]
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
const topPerformersColumns = [
    { label: 'Rank', key: 'Total Rank', sortable: false },
    { label: 'Player', key: 'Player', sortable: false },
    { label: 'Total Score', key: 'Total Score', sortable: false, format: val => eventStore.formatNumber(val, 0) }
]

const efficiencyLeadersColumns = [
    { label: 'Rank', key: 'Total Rank', sortable: false },
    { label: 'Player', key: 'Player', sortable: false },
    { label: 'Score/Power', key: 'scorePerPower', sortable: false, format: val => eventStore.formatNumber(val, 2) }
]
const whiteTableStyling = {
    wrapper: 'bg-white shadow rounded-lg overflow-hidden',
    header: 'bg-gray-100 text-gray-600 text-sm font-semibold',
    row: 'hover:bg-gray-50',
    column: {
        'Rank': { header: '', cell: 'text-sm text-gray-600' },
        'Player': { header: '', cell: 'text-sm text-gray-600' },
        'Total Score': { header: '', cell: 'text-sm text-gray-600' },
        'Score/Power': { header: '', cell: 'text-sm text-gray-600' }
    }
}


// --- Constants ---
const roleColorsGradient = {
    R1: ['#34d399', '#6ee7b7'], // Green gradient
    R2: ['#60a5fa', '#93c5fd'], // Blue gradient
    R3: ['#f472b6', '#f9a8d4'], // Pink gradient
    R4: ['#facc15', '#fde68a'], // Yellow gradient
    R5: ['#a78bfa', '#ddd6fe']  // Purple gradient
}
const roleColorsStatic = {
    R1: '#6ee7b7',
    R2: '#93c5fd',
    R3: '#f9a8d4',
    R4: '#fde68a',
    R5: '#ddd6fe'
}
const playerGradients = [
    ['#60a5fa', '#93c5fd'],
    ['#f472b6', '#f9a8d4'],
    ['#34d399', '#6ee7b7'],
    ['#facc15', '#fde68a'],
    ['#a78bfa', '#ddd6fe'],
    ['#fb923c', '#fdba74'],
    ['#38bdf8', '#7dd3fc'],
    ['#c084fc', '#d8b4fe'],
    ['#f87171', '#fca5a5'],
    ['#4ade80', '#86efac']
]
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

const toggleSummaryView = () => {
    summaryView.value = !summaryView.value;
    if (summaryView.value) {
        comparisonView.value = false;
        destroyChart('playerComparisonDailyChart');
    } else {
        destroySummaryCharts();
    }
};

// --- Chart options (vue-echarts) ---
// --- Avg Score by Role ---
const roleChartOption = computed(() => {
    const orderedRoles = ['R1', 'R2', 'R3', 'R4', 'R5'];
    const roleScoresMap = {};
    for (const role of orderedRoles) {
        roleScoresMap[role] = { total: 0, count: 0 };
    }
    players.value.forEach(player => {
        const r = player.Role;
        if (roleScoresMap[r]) {
            roleScoresMap[r].total += player['Total Score'];
            roleScoresMap[r].count += 1;
        }
    });
    const avgScores = orderedRoles.map(role => {
        const { total, count } = roleScoresMap[role];
        return count > 0 ? Math.round(total / count) : 0;
    });

    return {
        baseOption: {
            title: {
                text: 'Avg Score by Role',
                left: 'center',
                textStyle: { fontSize: 18, fontWeight: 'bold' }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: params => {
                    const v = params[0].value;
                    const fmt = v >= 1e6
                        ? (v / 1e6).toFixed(1) + 'M'
                        : v.toLocaleString();
                    return `${params[0].axisValue}<br/><strong>${fmt}</strong>`;
                }
            },
            grid: { top: 70, bottom: 60, left: '10%', right: '10%' },
            xAxis: {
                type: 'category',
                data: orderedRoles,
                axisLabel: { fontWeight: 'bold' }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: v => v >= 1e6
                        ? (v / 1e6).toFixed(1) + 'M'
                        : v.toLocaleString()
                },
                splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
            },
            series: [{
                type: 'bar',
                data: avgScores,
                barWidth: '50%',
                itemStyle: {
                    borderRadius: [6, 6, 0, 0],
                    color: ({ dataIndex }) => {
                        const role = orderedRoles[dataIndex];
                        const [from, to] = roleColorsGradient[role];
                        return new graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: from },
                            { offset: 1, color: to }
                        ]);
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    fontWeight: 'bold',
                    formatter: v => {
                        const val = v.value;
                        return val >= 1e6
                            ? (val / 1e6).toFixed(1) + 'M'
                            : val.toLocaleString();
                    }
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0,0,0,0.2)'
                    }
                }
            }],
            animation: true,
            animationDuration: 800,
            animationEasing: 'quadraticOut'
        },
        media: [{
            query: { maxWidth: 600 },
            option: {
                grid: { top: 50, bottom: 50, left: '5%', right: '5%' }
            }
        }]
    };
});


// --- Power vs Score (Scatter with Trendline) ---
const scatterOption = computed(() => {
    const grouped = { R1: [], R2: [], R3: [], R4: [], R5: [] };
    const pts = [];
    players.value.forEach(p => {
        if (p['Total Score'] > 0 && grouped[p.Role]) {
            const x = p.Power, y = p['Total Score'];
            grouped[p.Role].push({ value: [x, y], player: p.Player });
            pts.push([x, y]);
        }
    });
    const n = pts.length;
    const sumX = pts.reduce((s, [x]) => s + x, 0);
    const sumY = pts.reduce((s, [, y]) => s + y, 0);
    const sumXY = pts.reduce((s, [x, y]) => s + x * y, 0);
    const sumX2 = pts.reduce((s, [x]) => s + x * x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const minX = Math.min(...pts.map(p => p[0]));
    const maxX = Math.max(...pts.map(p => p[0]));
    const line = [
        [minX, slope * minX + intercept],
        [maxX, slope * maxX + intercept]
    ];

    const base = {
        title: { text: 'Power vs Score', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
        legend: { top: 30, data: Object.keys(grouped), selectedMode: 'multiple', textStyle: { fontWeight: 'bold' } },
        tooltip: {
            formatter: param => {
                const [power, score] = param.data.value;
                const name = param.data.player || 'Unknown';
                const fmtScore = score >= 1e6
                    ? (score / 1e6).toFixed(1) + 'M'
                    : score.toLocaleString();
                return `<strong>${name}</strong><br/>Power: ${power}M<br/>Score: ${fmtScore}`;
            }
        },
        grid: { top: 80, bottom: 60, left: '10%', right: '10%' },
        xAxis: {
            name: '',
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed', color: '#eee' } },
        },
        yAxis: {
            name: '',
            type: 'value',
            min: 0,
            splitLine: { lineStyle: { type: 'dashed', color: '#eee' } },
        },
        series: [
            ...Object.entries(grouped).map(([role, data]) => ({
                name: role,
                type: 'scatter',
                data,
                symbolSize: val => {
                    const s = val.value?.[1] || 0;
                    return s >= 1e7 ? 20 : s >= 1e6 ? 16 : 12;
                },
                hoverAnimation: false,
                itemStyle: { color: roleColorsStatic[role], opacity: 0.85, borderColor: '#fff', borderWidth: 1 },
                emphasis: { focus: 'series', itemStyle: { borderColor: '#000', borderWidth: 2 } }
            })),
            {
                name: 'Trendline',
                type: 'line',
                data: line,
                symbol: 'none',
                lineStyle: { type: 'dashed', width: 2, color: '#6366f1' },
                tooltip: { show: false }
            }
        ],
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
    };

    return {
        baseOption: base,
        media: [{
            query: { maxWidth: 600 },
            option: {
                grid: { top: 60, bottom: 50, left: '5%', right: '5%' }
            }
        }]
    };
});


// --- Daily Performance (Top 5) ---
const dailyOption = computed(() => {
    const top5 = topPlayers.value
        .filter(p => allDays.value.some(d => p[`Score (D${d})`] > 0))
        .slice(0, 5);
    const dayLabels = allDays.value.map(d => dayTasks[`D${d}`]);

    return {
        baseOption: {
            title: { text: 'Daily Performance (Top 5)', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
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
                data: top5.map(p => p.Player),
                orient: 'horizontal',
                bottom: 0,
                textStyle: { fontWeight: 'bold', color: '#333' }
            },
            series: top5.map((p, i) => {
                const [start, end] = playerGradients[i % playerGradients.length];
                return {
                    name: p.Player,
                    type: 'line',
                    smooth: 0.3,
                    symbol: 'circle',
                    symbolSize: 6,
                    hoverAnimation: false,
                    lineStyle: {
                        width: 3,
                        color: new graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: start },
                            { offset: 1, color: end }
                        ])
                    },
                    itemStyle: { color: end, borderWidth: 1, borderColor: '#fff' },
                    emphasis: { focus: 'series', lineStyle: { width: 4 }, itemStyle: { borderWidth: 2, borderColor: '#000' } },
                    data: allDays.value.map(d => p[`Score (D${d})`])
                };
            }),
            animation: true,
            animationDuration: 800,
            animationEasing: 'cubicOut'
        },
        media: [{
            query: { maxWidth: 600 },
            option: {
                grid: { top: 50, bottom: 50, left: '5%', right: '5%' }
            }
        }]
    };
});


// --- Castle Level vs Avg Score ---
const castleScoreChartOption = computed(() => {
    const castleMap = new Map();
    players.value.forEach(p => {
        const c = p.Castle;
        if (!castleMap.has(c)) castleMap.set(c, { total: 0, count: 0 });
        castleMap.get(c).total += p['Total Score'];
        castleMap.get(c).count += 1;
    });
    const entries = [...castleMap.entries()].sort((a, b) => a[0] - b[0]);
    const xData = entries.map(([castle]) => castle);
    const yData = entries.map(([_, v]) =>
        v.count > 0 ? Math.round(v.total / v.count) : 0
    );

    return {
        baseOption: {
            title: { text: 'Castle Level vs Avg Score', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
            tooltip: {
                trigger: 'axis',
                formatter: p => `Castle ${p[0].axisValue}<br/>Avg Score: ${p[0].value.toLocaleString()}`
            },
            grid: { top: 70, bottom: 60, left: '10%', right: '10%' },
            xAxis: { type: 'category', data: xData, axisLabel: { fontWeight: 'bold' } },
            yAxis: {
                type: 'value',
                axisLabel: { formatter: v => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v.toLocaleString() },
                splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
            },
            series: [{
                type: 'line',
                data: yData,
                areaStyle: { opacity: 0.3 },
                smooth: true,
                symbol: 'circle',
                itemStyle: { color: '#6366f1' },
                lineStyle: { color: '#6366f1', width: 3 }
            }]
        },
        media: [{
            query: { maxWidth: 600 },
            option: { grid: { top: 50, bottom: 50, left: '5%', right: '5%' } }
        }]
    };
});


// --- Total Score by Day (Donut) ---
const totalScoreByDayPieOption = computed(() => {
    const labels = allDays.value.map(d => dayTasks[`D${d}`]);
    const pieData = labels.map((label, idx) => {
        const dayKey = `Score (D${idx + 1})`;
        const total = players.value.reduce((s, p) => s + (p[dayKey] || 0), 0);
        return { name: label, value: total };
    });

    return {
        baseOption: {
            title: { text: 'Total Score by Day', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
            tooltip: { trigger: 'item', formatter: '{b}<br/>Score: {c} ({d}%)' },
            legend: { orient: 'horizontal', top: 40, left: 'center' },
            series: [{
                type: 'pie',
                radius: ['45%', '70%'],
                center: ['50%', '60%'],
                data: pieData,
                label: { formatter: '{b}: {d}%', fontWeight: 'bold' },
                emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' } }
            }]
        },
        media: [{
            query: { maxWidth: 600 },
            option: { series: [{ radius: ['40%', '65%'] }], grid: { left: '5%', right: '5%' } }
        }]
    };
});


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
