<template>
    <EventLayout>
        <EventHeader :guildName="`Server ${winningServer?.server || 'Battle'}`" :eventName="eventName"
            :summaryView="summaryView" :toggleSummaryView="toggleSummaryView" :byline="byline" />

        <main class="container mx-auto px-4 md:px-8 py-6 flex-grow">
            <section v-show="summaryView" class="mb-12" ref="summarySectionRef">
                <!-- 1. Updated Overview Cards Section -->
                <div class="bg-card rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-2xl font-bold mb-4 text-foreground">KvK Battle Summary</h2>
                    <OverviewCards :cards="overviewCards" />

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <!-- Server Battle Results -->
                        <div class="lg:col-span-2">
                            <h3 class="text-xl font-semibold text-foreground mb-4">Server Battle Results</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-for="server in kvkStore.servers" :key="server.server" :class="[
                                    'p-6 rounded-lg border-2 transition-all',
                                    server === winningServer
                                        ? 'border-velaris-green bg-velaris-green/10'
                                        : 'border-border bg-card'
                                ]">
                                    <div class="flex items-center justify-between mb-2">
                                        <h4 class="text-lg font-semibold text-foreground">{{ server.serverName }}</h4>
                                        <span v-if="server === winningServer"
                                            class="px-2 py-1 text-xs font-bold text-velaris-green border border-velaris-green rounded">
                                            WINNER
                                        </span>
                                    </div>
                                    <div class="space-y-1 text-sm">
                                        <div class="flex justify-between">
                                            <span class="text-muted-foreground">Total Score:</span>
                                            <span class="font-semibold">{{ kvkStore.formatNumber(server.totalScore)
                                                }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-muted-foreground">Guilds:</span>
                                            <span class="font-semibold">{{ server.guildCount }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-muted-foreground">Average:</span>
                                            <span class="font-semibold">{{
                                                kvkStore.formatNumber(Math.round(server.totalScore / server.guildCount))
                                                }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-muted-foreground">Days Won:</span>
                                            <span class="font-semibold">{{ dailyWinsCount(server.server) }}/6</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Battle Insights -->
                            <div v-if="serverScoreDifference > 0" class="mt-6 space-y-4">
                                <div class="text-center">
                                    <p class="text-lg font-semibold text-foreground mb-2">
                                        Victory Margin: {{ kvkStore.formatNumber(serverScoreDifference) }} points
                                        ({{ ((serverScoreDifference / kvkStore.totalScoreOverall) * 100).toFixed(1) }}%)
                                    </p>
                                </div>

                                <!-- Strategic Insights Grid -->
                                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                                    <div class="text-center">
                                        <div class="text-lg font-semibold text-velaris-teal">
                                            Day {{ kvkStore.dailyBattleResults.mostCompetitiveDay }}
                                        </div>
                                        <div class="text-xs text-muted-foreground">Most Competitive</div>
                                        <div class="text-xs">
                                            {{ kvkStore.formatNumber(kvkStore.dailyBattleResults.smallestMargin) }}
                                            margin
                                        </div>
                                    </div>

                                    <div class="text-center" v-if="kvkStore.biggestDailySwing.day">
                                        <div class="text-lg font-semibold text-velaris-amber">
                                            Day {{ kvkStore.biggestDailySwing.day }}
                                        </div>
                                        <div class="text-xs text-muted-foreground">Biggest Swing</div>
                                        <div class="text-xs">
                                            {{ kvkStore.formatNumber(kvkStore.biggestDailySwing.swing) }} points
                                        </div>
                                    </div>

                                    <div class="text-center">
                                        <div class="text-lg font-semibold text-velaris-purple">
                                            {{ kvkStore.serverBalance }}% - {{ 100 - kvkStore.serverBalance }}%
                                        </div>
                                        <div class="text-xs text-muted-foreground">Score Balance</div>
                                        <div class="text-xs">
                                            {{ kvkStore.serverBalance < 45 || kvkStore.serverBalance > 55 ? 'Dominated' :
                                                'Competitive' }}
                                        </div>
                                    </div>

                                    <div class="text-center">
                                        <div class="text-lg font-semibold text-velaris-green">
                                            {{ kvkStore.dailyBattleResults.competitivenessScore }}%
                                        </div>
                                        <div class="text-xs text-muted-foreground">Battle Intensity</div>
                                        <div class="text-xs">
                                            {{ kvkStore.dailyBattleResults.competitivenessScore > 80 ? 'Intense' :
                                                kvkStore.dailyBattleResults.competitivenessScore > 60 ? 'Moderate' :
                                            'One-sided' }}
                                        </div>
                                    </div>
                                </div>

                                <!-- NEW: Prep Stage vs War Stage Analysis -->
                                <div v-if="kvkStore.prepStageAnalysis.prepWinner"
                                    class="mt-6 p-4 bg-muted/30 rounded-lg">
                                    <h4 class="text-lg font-semibold text-foreground mb-3">Stage Analysis</h4>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <!-- Prep Stage (Days 1-5) -->
                                        <div class="p-3 bg-card rounded border">
                                            <h5 class="font-semibold text-sm mb-2 text-velaris-blue">Prep Stage (Days
                                                1-5)</h5>
                                            <div class="space-y-1 text-xs">
                                                <div class="flex justify-between">
                                                    <span>Winner:</span>
                                                    <span class="font-semibold text-velaris-green">
                                                        {{ kvkStore.prepStageAnalysis.prepWinner?.serverName || 'Tied'
                                                        }}
                                                    </span>
                                                </div>
                                                <div class="flex justify-between">
                                                    <span>Days Won:</span>
                                                    <span class="font-semibold">
                                                        {{ kvkStore.prepStageAnalysis.prepDaysWon.server1 }}-{{
                                                        kvkStore.prepStageAnalysis.prepDaysWon.server2 }}
                                                    </span>
                                                </div>
                                                <div class="flex justify-between">
                                                    <span>War Position:</span>
                                                    <span class="font-semibold"
                                                        :class="kvkStore.prepStageAnalysis.isDefending ? 'text-velaris-green' : 'text-velaris-red'">
                                                        {{ kvkStore.prepStageAnalysis.isDefending ? 'Defending' :
                                                        'Attacking' }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- War Stage (Day 6) -->
                                        <div class="p-3 bg-card rounded border">
                                            <h5 class="font-semibold text-sm mb-2 text-velaris-red">War Stage (Day 6)
                                            </h5>
                                            <div class="space-y-1 text-xs">
                                                <div class="flex justify-between">
                                                    <span>{{ kvkStore.servers[0]?.serverName }}:</span>
                                                    <span class="font-semibold">{{
                                                        kvkStore.formatNumber(kvkStore.prepStageAnalysis.warScore.server1)
                                                        }}</span>
                                                </div>
                                                <div class="flex justify-between">
                                                    <span>{{ kvkStore.servers[1]?.serverName }}:</span>
                                                    <span class="font-semibold">{{
                                                        kvkStore.formatNumber(kvkStore.prepStageAnalysis.warScore.server2)
                                                        }}</span>
                                                </div>
                                                <div class="flex justify-between">
                                                    <span>Winner:</span>
                                                    <span class="font-semibold text-velaris-green">
                                                        {{ kvkStore.prepStageAnalysis.warScore.server1 >
                                                            kvkStore.prepStageAnalysis.warScore.server2 ?
                                                        kvkStore.servers[0]?.serverName :
                                                        kvkStore.servers[1]?.serverName }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Daily Battle Story -->
                                <div v-if="kvkStore.biggestDailySwing.description"
                                    class="mt-4 p-4 bg-card rounded-lg border">
                                    <h4 class="text-sm font-semibold text-foreground mb-2">Key Moment</h4>
                                    <p class="text-sm text-muted-foreground">
                                        Day {{ kvkStore.biggestDailySwing.day }}: {{
                                            kvkStore.biggestDailySwing.description }}
                                        with a {{ kvkStore.formatNumber(kvkStore.biggestDailySwing.swing) }} point
                                        swing.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-8">
                        <!-- Top Guilds -->
                        <div class="w-full md:w-1/2">
                            <h3 class="text-xl font-semibold text-foreground">Top Guilds</h3>
                            <h3 class="text-sm opacity-70 mb-3 text-muted-foreground">Overall Score</h3>

                            <EventTable :items="topGuilds" :columns="topGuildsColumns" :styling="whiteTableStyling"
                                :rowPadding="'py-2'" :rowLines="'border-b border-border'"
                                :columnLines="'border-b-2 border-border'" />
                        </div>

                        <!-- FIXED: Most Consistent Performers -->
                        <div class="w-full md:w-1/2">
                            <h3 class="text-xl font-semibold text-foreground">Most Consistent</h3>
                            <h3 class="text-sm opacity-70 mb-3 text-muted-foreground">Performance Stability</h3>

                            <EventTable :items="topConsistentGuilds" :columns="consistentPerformersColumns"
                                :styling="whiteTableStyling" :rowPadding="'py-2'" :rowLines="'border-b border-border'"
                                :columnLines="'border-b-2 border-border'" />
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <OverallScoreCard :score="totalScoreOverall" />

                    <WorkbenchCard>
                        <WorkbenchChart :option="serverScoreChartOption" />
                    </WorkbenchCard>

                    <WorkbenchCard>
                        <WorkbenchChart :option="dailyServerBattleOption" />
                    </WorkbenchCard>

                    <WorkbenchCard>
                        <WorkbenchChart :option="guildDistributionOption" />
                    </WorkbenchCard>

                    <WorkbenchCard>
                        <WorkbenchChart :option="dailyPerformanceOption" />
                    </WorkbenchCard>

                    <WorkbenchCard>
                        <WorkbenchChart :option="totalScorePieOption" />
                    </WorkbenchCard>
                </div>

                <!-- Additional Insights Section -->
                <div class="bg-card rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-2xl font-bold mb-4 text-foreground">Performance Analytics</h2>

                    <!-- Guild Distribution Insights -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div class="text-center p-4 bg-muted/30 rounded-lg">
                            <div class="text-2xl font-bold text-velaris-green mb-1">
                                {{ kvkStore.guildDistribution.topTierCount }}
                            </div>
                            <div class="text-sm text-muted-foreground">Elite Guilds</div>
                            <div class="text-xs text-muted-foreground">(1.5B+ Score)</div>
                        </div>

                        <div class="text-center p-4 bg-muted/30 rounded-lg">
                            <div class="text-2xl font-bold text-velaris-amber mb-1">
                                {{ Math.round(kvkStore.performanceConsistency[0]?.consistencyScore || 0) }}%
                            </div>
                            <div class="text-sm text-muted-foreground">Top Consistency</div>
                            <div class="text-xs text-muted-foreground">{{ kvkStore.performanceConsistency[0]?.guild ||
                                'N/A' }}</div>
                        </div>

                        <div class="text-center p-4 bg-muted/30 rounded-lg">
                            <div class="text-2xl font-bold text-velaris-red mb-1">
                                {{ kvkStore.guildDistribution.lowPerformerCount }}
                            </div>
                            <div class="text-sm text-muted-foreground">Struggling Guilds</div>
                            <div class="text-xs text-muted-foreground">(&lt;500M Score)</div>
                        </div>
                    </div>

                    <!-- Daily Winners Timeline -->
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-foreground mb-3">Daily Battle Winners</h3>
                        <div class="grid grid-cols-6 gap-2">
                            <div v-for="(winner, index) in kvkStore.dailyBattleResults.dailyWinners" :key="index"
                                class="text-center p-2 rounded border" :class="[
                                    winner === winningServer?.server
                                        ? 'bg-velaris-green/20 border-velaris-green'
                                        : 'bg-velaris-red/20 border-velaris-red'
                                ]">
                                <div class="text-xs font-semibold">Day {{ index + 1 }}</div>
                                <div class="text-sm">{{ kvkStore.eventMeta.serverNames[winner] || winner }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section v-show="!summaryView" ref="comparisonSectionRef" class="mb-8 bg-card rounded-lg shadow-md p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-6">
                    <h2 class="text-2xl font-bold text-foreground">
                        Guild Comparison
                    </h2>
                    <div class="flex md:justify-end">
                        <ComparisonSearchBar :searchTerm="kvkStore.comparisonSearchTerm"
                            :searchResults="kvkStore.filteredComparisonSearchResults"
                            @update:searchTerm="kvkStore.updateComparisonSearchTerm"
                            @select="kvkStore.addGuildToComparisonFromSearch"
                            @keydown="handleComparisonSearchKeydown" />
                    </div>
                </div>

                <div v-if="kvkStore.selectedComparisonGuilds.length > 0">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold mb-2 text-foreground">
                            Selected Guilds for Comparison (Max {{ kvkStore.maxComparisonGuilds }})
                        </h3>

                        <SelectedGuildsBadges />
                    </div>

                    <ComparisonChartContainer :option="comparisonDailyOption" chartId="kvkComparisonDailyChart" />
                    <ComparisonCardsGrid :players="kvkStore.selectedComparisonGuilds"
                        :fields="kvkStore.comparisonFields" :colorMap="kvkStore.guildColorMap"
                        @hover="kvkStore.highlightSeries" @leave="kvkStore.downplaySeries" />
                </div>
                <div v-else class="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <span class="text-2xl font-semibold mb-2">No Guilds Selected</span>
                    <p class="text-sm">Search for guilds to add them to the comparison!</p>
                </div>
            </section>

            <section v-show="!summaryView" class="mb-8">
                <div class="bg-card rounded-lg shadow-md p-6">

                    <!-- Header + Search -->
                    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                        <h2 class="text-2xl font-bold no-wrap text-foreground mb-4 md:mb-0">
                            Guild Data
                        </h2>

                        <SearchBar :searchTerm="searchTerm" @update:searchTerm="v => searchTerm = v" />
                    </div>

                    <!-- Filters -->
                    <KvKFiltersPanel :activeServerFilters="activeServerFilters" :activeDayFilters="activeDayFilters"
                        :scoreFilter="scoreFilter" :allDays="allDays" :dayHasData="dayHasData" :dayOptions="dayOptions"
                        :servers="kvkStore.servers" @toggleServer="toggleServerFilter" @toggleDay="toggleDayFilter"
                        @updateScoreFilter="updateScoreFilter" @clearAllFilters="clearAllFilters" />

                    <!-- Table -->
                    <div class="overflow-x-auto">
                        <EventTable :columns="kvkTableColumns" :items="paginatedData"
                            :actions="kvkTableActions(toggleGuildForComparison)" :styling="kvkTableStyling"
                            :highlightRules="kvkTableHighlight" />
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
import SelectedGuildsBadges from './layouts/KvKComparison/SelectedGuildsBadges.vue'
import ComparisonChartContainer from './layouts/PlayerComparison/ComparisonChartContainer.vue'
import ComparisonCardsGrid from './layouts/PlayerComparison/ComparisonCardsGrid.vue'
import SearchBar from './layouts/PlayerData/SearchBar.vue'
import KvKFiltersPanel from './layouts/GuildData/KvKFiltersPanel.vue'
import PaginationControls from './layouts/PlayerData/PaginationControls.vue'
import WorkbenchCard from '@/pages/topheroes/velaris/events/layouts/Cards/WorkbenchCard.vue'
import WorkbenchChart from '@/pages/topheroes/velaris/events/layouts/Charts/WorkbenchChart.vue'
import { useServerScoreOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/kvkServerScoreOption'
import { useDailyServerBattleOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/kvkDailyServerBattleOption'
import { useGuildDistributionOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/kvkGuildDistributionOption'
import { useKvKDailyPerformanceOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/kvkDailyPerformanceOption'
import { useKvKTotalScorePieOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/kvkTotalScorePieOption'
import { useKvKComparisonDailyOption } from '@/pages/topheroes/velaris/events/layouts/Charts/options/kvkComparisonChartOption'
import { formatPlayerName } from '@/utils/useFormatPlayerName'
import { useRoute, useRouter } from 'vue-router';
import { useKvKEventDataStore } from '@/stores/useKvKEventDataStore'
import { useThemeStore } from '@/stores/useThemeStore'

echarts.use([TimelineComponent]);

// Import specific properties and methods from the store
const kvkStore = useKvKEventDataStore()
const themeStore = useThemeStore()
const route = useRoute()
const router = useRouter()

// --- Reactive State ---
const summaryView = ref(true)

// Load event data
onMounted(() => {
    // For development, load fake data
    kvkStore.loadFakeData();

    // Check URL parameter to set initial view
    const viewParam = route.query.view;
    summaryView.value = viewParam !== 'table';
});

const forceRefresh = () => {
    kvkStore.forceRefresh()
}

// --- Computed Data Access ---
// Basic meta
const guilds = computed(() => kvkStore.guilds)
const servers = computed(() => kvkStore.servers)
const eventName = computed(() => kvkStore.eventMeta.eventName)
const byline = computed(() => kvkStore.eventMeta.byline)

// Guild summaries
const totalGuilds = computed(() => kvkStore.totalGuilds)
const totalScoreOverall = computed(() => kvkStore.totalScoreOverall)
const averageGuildScore = computed(() => kvkStore.formatNumber(kvkStore.averageGuildScore))
const winningServer = computed(() => kvkStore.winningServer)
const serverScoreDifference = computed(() => kvkStore.serverScoreDifference)

// Top 10 Lists
const topGuilds = computed(() => kvkStore.topGuilds)

// Day controls
const allDays = computed(() => kvkStore.allDays)
const dayHasData = computed(() => kvkStore.dayHasData)
const dayOptions = computed(() => kvkStore.dayOptions)

// Filtering
const searchTerm = computed({
    get: () => kvkStore.searchTerm,
    set: (v) => kvkStore.searchTerm = v
})
const activeServerFilters = computed({
    get: () => kvkStore.activeServerFilters,
    set: (v) => kvkStore.activeServerFilters = v
})
const activeDayFilters = computed({
    get: () => kvkStore.activeDayFilters,
    set: (v) => kvkStore.activeDayFilters = v
})
const scoreFilter = computed({
    get: () => kvkStore.scoreFilter || { operator: '', value: null },
    set: (v) => kvkStore.scoreFilter = v
})

// Sorting & Paging
const page = computed({
    get: () => kvkStore.page,
    set: (v) => kvkStore.page = v
})
const itemsPerPage = computed({
    get: () => kvkStore.itemsPerPage,
    set: (v) => kvkStore.itemsPerPage = v
})

// Processed data
const paginatedData = computed(() => kvkStore.paginatedData)
const filteredAndSortedData = computed(() => kvkStore.filteredAndSortedData)

// Comparison View
const selectedComparisonGuilds = computed({
    get: () => kvkStore.selectedComparisonGuilds,
    set: (v) => kvkStore.selectedComparisonGuilds = v
})

const updateScoreFilter = (filterObj) => {
    kvkStore.scoreFilter = filterObj
}

const clearAllFilters = () => {
    kvkStore.activeServerFilters = ['all']
    kvkStore.activeDayFilters = []
    kvkStore.scoreFilter = { operator: '', value: null }
}

// Utility methods
const toggleServerFilter = kvkStore.toggleServerFilter
const toggleDayFilter = kvkStore.toggleDayFilter
const toggleGuildForComparison = kvkStore.toggleGuildForComparison

const handleComparisonSearchKeydown = (event) => {
    if (event.key === 'Enter' && kvkStore.filteredComparisonSearchResults.length > 0) {
        kvkStore.addGuildToComparisonFromSearch(kvkStore.filteredComparisonSearchResults[0])
    }
}

// Helper function for daily wins count
const dailyWinsCount = (serverKey) => {
    return kvkStore.dailyBattleResults.dailyWinners.filter(winner => winner === serverKey).length
}

const minimumScore = (1000000)
const overviewCards = computed(() => [
    {
        label: 'Active Guilds',
        byline: 'Participating',
        value: kvkStore.activeParticipants,
        colour: 'hsl(var(--velaris-purple))'
    },
    {
        label: 'Winning Server',
        byline: 'Victor',
        value: winningServer.value?.serverName || 'TBD',
        colour: 'hsl(var(--velaris-green))'
    },
    {
        label: 'Victory Margin',
        byline: 'Difference',
        value: kvkStore.formatNumber(serverScoreDifference.value), // Now formats to K/M/B
        colour: 'hsl(var(--velaris-teal))'
    },
    {
        label: 'Prep Winner',
        byline: 'Stage Control',
        value: kvkStore.prepStageAnalysis.prepWinner?.serverName || 'Tied',
        colour: 'hsl(var(--velaris-amber))'
    },
])

// Fixed consistency table data and columns
const topConsistentGuilds = computed(() => {
    return kvkStore.performanceConsistency.slice(0, 10).map((item, index) => ({
        rank: index + 1,
        guild: item.guild,
        fullName: item.fullName,
        consistencyScore: item.consistencyScore,
        averageDaily: item.averageDaily
    }))
})

const consistentPerformersColumns = [
    { label: 'Rank', key: 'rank', sortable: false, headerClass: 'text-center', cellClass: 'text-center' },
    {
        label: 'Guild',
        key: 'guild',
        sortable: false,
        format: (val, row) => `<strong>${val}</strong><br><small class="text-muted-foreground">${row.fullName}</small>`,
        html: true
    },
    {
        label: 'Consistency',
        key: 'consistencyScore',
        sortable: false,
        format: val => `${val}%`,
        headerClass: 'text-center',
        cellClass: 'text-center'
    }
]

// --- URL HANDLING ---
const toggleSummaryView = () => {
    const newSummaryView = !summaryView.value;

    // Update state
    summaryView.value = newSummaryView;

    // Update URL
    const currentQuery = { ...route.query };
    if (newSummaryView) {
        delete currentQuery.view;
    } else {
        currentQuery.view = 'table';
    }

    const newUrl = router.resolve({
        path: route.path,
        query: currentQuery
    }).href;

    window.history.replaceState(window.history.state, '', newUrl);

    // Handle chart cleanup
    if (newSummaryView) {
        destroyChart('kvkComparisonDailyChart');
    } else {
        destroySummaryCharts();
    }
};

watch(() => route.query.view, (newView) => {
    const shouldBeSummary = newView !== 'table';
    if (summaryView.value !== shouldBeSummary) {
        summaryView.value = shouldBeSummary;

        if (shouldBeSummary) {
            destroyChart('kvkComparisonDailyChart');
        } else {
            destroySummaryCharts();
        }
    }
}, { immediate: false });

const kvkTableActions = (toggleGuildForComparison) => [
    {
        label: 'Compare',
        icon: AdjustmentsHorizontalIcon,
        color: 'text-blue-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300',
        onClick: toggleGuildForComparison
    }
]

const kvkTableStyling = {
    wrapper: 'bg-muted shadow-xl rounded-lg',
    header: 'bg-muted-foreground/10 text-foreground hover:text-foreground/80',
    row: 'hover:bg-muted/50 py-0',
    column: {
        Score: { cell: 'font-semibold' }
    },
}

const kvkTableHighlight = [
    { column: 'dynamicTotalScore', operator: '<=', value: minimumScore, class: 'bg-destructive/20' }
]

const kvkTableColumns = [
    { label: 'Rank', key: 'dynamicTotalRank', sortable: true, headerClass: 'text-center' },
    {
        label: 'Guild', key: 'shortCode', sortable: true,
        format: (val, row) => `<strong>${val}</strong><br><small class="text-muted-foreground">${row.fullName}</small>`,
        html: true
    },
    {
        label: 'Server', key: 'server', sortable: true,
        format: (val, row) => kvkStore.eventMeta.serverNames[val] || val
    },
    {
        label: 'Total Score',
        key: 'dynamicTotalScore',
        sortable: true,
        format: val => kvkStore.formatNumber(val, 0)
    },
    {
        label: 'Average Daily',
        key: 'averageDaily',
        sortable: true,
        format: val => kvkStore.formatNumber(Math.round(val), 0)
    },
    // Individual day columns
    ...kvkStore.allDays.map(day => ({
        label: `Day ${day}`,
        key: `D${day}`,
        sortable: true,
        format: val => kvkStore.formatNumber(val, 0)
    }))
]

const topGuildsColumns = [
    { label: 'Rank', key: 'totalRank', sortable: false },
    {
        label: 'Guild',
        key: 'shortCode',
        sortable: false,
        format: (val, row) => `<strong>${val}</strong><br><small class="text-muted-foreground">${row.fullName}</small>`,
        html: true
    },
    {
        label: 'Total Score',
        key: 'totalScore',
        sortable: false,
        format: val => kvkStore.formatNumber(val, 0)
    }
]

const whiteTableStyling = {
    wrapper: 'bg-card shadow rounded-lg overflow-hidden',
    header: 'bg-muted text-muted-foreground text-sm font-semibold',
    row: 'hover:bg-muted/30',
    column: {
        'Rank': { header: '', cell: 'text-sm text-muted-foreground' },
        'Guild': { header: '', cell: 'text-sm text-foreground' },
        'Total Score': { header: '', cell: 'text-sm text-foreground text-center' },
        'Consistency': { header: '', cell: 'text-sm text-foreground text-center' }
    }
}

// Chart options - using original theme system
const serverScoreChartOption = useServerScoreOption(servers)
const dailyServerBattleOption = useDailyServerBattleOption(servers, allDays)
const guildDistributionOption = useGuildDistributionOption(guilds)
const dailyPerformanceOption = useKvKDailyPerformanceOption(guilds, allDays)
const totalScorePieOption = useKvKTotalScorePieOption(servers)
const comparisonDailyOption = useKvKComparisonDailyOption(selectedComparisonGuilds, allDays)

watch(selectedComparisonGuilds, (guilds) => {
    if (guilds.length === 0) {
        // comparisonView.value = false
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
    destroyChart('serverScoreChart');
    destroyChart('dailyServerBattleChart');
    destroyChart('guildDistributionChart');
    destroyChart('kvkDailyPerformanceChart');
    destroyChart('kvkTotalScoreChart');
};

</script>

<style scoped>
[v-cloak] {
    display: none;
}
</style>