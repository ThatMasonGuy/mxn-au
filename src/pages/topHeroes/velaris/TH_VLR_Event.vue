<template>
    <div v-cloak class="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
        <header class="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg">
            <div class="container mx-auto py-6 px-4 md:px-8">
                <h1 class="text-3xl font-bold mb-2">VLR GvG Event Dashboard</h1>
                <p class="text-indigo-100">Interactive analysis and visualization of player performance</p>

                <div class="mt-4 mb-2">
                    <div class="flex flex-wrap gap-2">
                        <button @click="toggleSummaryView"
                            class="px-4 py-2 bg-white text-indigo-700 rounded-md shadow-sm hover:shadow-md transition-all font-medium">
                            {{ summaryView ? 'Show Data Table' : 'Show Summary View' }}
                        </button>
                        <button @click="toggleComparisonView"
                            class="px-4 py-2 bg-white text-indigo-700 rounded-md shadow-sm hover:shadow-md transition-all font-medium">
                            {{ comparisonView ? 'Hide Comparison' : 'Compare Players' }}
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main class="container mx-auto px-4 md:px-8 py-6 flex-grow">
            <section v-show="summaryView" class="mb-12" ref="summarySectionRef">
                <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-2xl font-bold mb-4 text-gray-700">Event Summary</h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div class="bg-indigo-50 p-4 rounded-lg text-center md:text-left">
                            <div class="text-indigo-700 font-medium">Total Players</div>
                            <div class="text-3xl font-bold">{{ totalParticipants }}</div>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg text-center md:text-left">
                            <div class="text-purple-700 font-medium">Active Players</div>
                            <div class="text-3xl font-bold">{{ activeParticipants }}</div>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-lg text-center md:text-left">
                            <div class="text-blue-700 font-medium">Average Power</div>
                            <div class="text-3xl font-bold">{{ averagePower }}M</div>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg text-center md:text-left">
                            <div class="text-green-700 font-medium">Avg. Castle Level</div>
                            <div class="text-3xl font-bold">{{ averageCastleLevel }}</div>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-8">
                        <div class="w-full md:w-1/2">
                            <h3 class="text-xl font-semibold mb-3">Top Performers (Total Score)</h3>
                            <div class="overflow-x-auto">
                                <table class="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th
                                                class="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                                Rank</th>
                                            <th
                                                class="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                                Player</th>
                                            <th
                                                class="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                                Total Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(player, index) in topPlayers" :key="player.Player"
                                            class="hover:bg-gray-50">
                                            <td class="px-4 py-2 border-b border-gray-200 text-sm">{{ index + 1 }}</td>
                                            <td class="px-4 py-2 border-b border-gray-200 text-sm">{{ player.Player }}
                                            </td>
                                            <td class="px-4 py-2 border-b border-gray-200 text-sm">{{
                                                formatNumber(player['Total Score']) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="w-full md:w-1/2">
                            <h3 class="text-xl font-semibold mb-3">Efficiency Leaders (Score per Power)</h3>
                            <div class="overflow-x-auto">
                                <table class="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th
                                                class="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                                Rank</th>
                                            <th
                                                class="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                                Player</th>
                                            <th
                                                class="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                                Score/Power</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(player, index) in efficiencyLeaders" :key="player.Player"
                                            class="hover:bg-gray-50">
                                            <td class="px-4 py-2 border-b border-gray-200 text-sm">{{ index + 1 }}</td>
                                            <td class="px-4 py-2 border-b border-gray-200 text-sm">{{ player.Player }}
                                            </td>
                                            <td class="px-4 py-2 border-b border-gray-200 text-sm">{{
                                                formatNumber(player.scorePerPower, 2) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <h3 class="text-xl font-semibold mb-4">Score Distribution by Role</h3>
                        <div class="chart-container">
                            <canvas id="roleScoreChart" ref="roleScoreChartRef"></canvas>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <h3 class="text-xl font-semibold mb-4">Castle Level vs. Average Score</h3>
                        <div class="chart-container">
                            <canvas id="castleScoreChart" ref="castleScoreChartRef"></canvas>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <h3 class="text-xl font-semibold mb-4">Power vs. Score</h3>
                        <div class="chart-container">
                            <canvas id="powerScoreChart" ref="powerScoreChartRef"></canvas>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <h3 class="text-xl font-semibold mb-4">Daily Performance (Top 5)</h3>
                        <div class="chart-container">
                            <canvas id="dailyPerformanceChart" ref="dailyPerformanceChartRef"></canvas>
                        </div>
                    </div>
                </div>
            </section>

            <section v-show="comparisonView" ref="comparisonSectionRef" class="mb-12 bg-white rounded-lg shadow-md p-6">
                <h2 class="text-2xl font-bold mb-4 text-gray-700">Player Comparison</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label for="compare1" class="block text-sm font-medium text-gray-700 mb-1">Player 1</label>
                        <div class="relative">
                            <input id="compare1" v-model="comparisonSearch1" @input="filterComparison(1)" @keydown.tab.prevent="handleTabAutocomplete(1)"
                                @blur="() => setTimeout(() => filteredComparisonPlayers1 = [], 200)"
                                class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Search for player..." />
                            <div v-if="comparisonSearch1 && filteredComparisonPlayers1.length"
                                class="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                                <div v-for="player in filteredComparisonPlayers1" :key="player.Player"
                                    @click="selectComparisonPlayer(player, 1)"
                                    class="px-4 py-2 hover:bg-indigo-50 cursor-pointer">
                                    {{ player.Player }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label for="compare2" class="block text-sm font-medium text-gray-700 mb-1">Player 2</label>
                        <div class="relative">
                            <input id="compare2" v-model="comparisonSearch2" @input="filterComparison(2)" @keydown.tab.prevent="handleTabAutocomplete(2)"
                                @blur="() => setTimeout(() => filteredComparisonPlayers2 = [], 200)"
                                class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Search for player..." />
                            <div v-if="comparisonSearch2 && filteredComparisonPlayers2.length"
                                class="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                                <div v-for="player in filteredComparisonPlayers2" :key="player.Player"
                                    @click="selectComparisonPlayer(player, 2)"
                                    class="px-4 py-2 hover:bg-indigo-50 cursor-pointer">
                                    {{ player.Player }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="comparisonPlayer1 && comparisonPlayer2" class="mb-8">
                    <div class="chart-container mb-8">
                        <canvas id="playerComparisonChart" ref="playerComparisonChartRef"></canvas>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="text-lg font-semibold mb-2 text-indigo-700">{{ comparisonPlayer1.Player }}</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="comparison-item p-3 rounded-md bg-white shadow-sm">
                                    <div class="text-sm text-gray-500">Power</div>
                                    <div class="text-xl font-semibold">{{ comparisonPlayer1.Power }}M</div>
                                </div>
                                <div class="comparison-item p-3 rounded-md bg-white shadow-sm">
                                    <div class="text-sm text-gray-500">Castle</div>
                                    <div class="text-xl font-semibold">{{ comparisonPlayer1.Castle }}</div>
                                </div>
                                <div class="comparison-item p-3 rounded-md bg-white shadow-sm">
                                    <div class="text-sm text-gray-500">Role</div>
                                    <div class="text-xl font-semibold">{{ comparisonPlayer1.Role }}</div>
                                </div>
                                <div class="comparison-item p-3 rounded-md bg-white shadow-sm">
                                    <div class="text-sm text-gray-500">Total Score</div>
                                    <div class="text-xl font-semibold">{{ formatNumber(comparisonPlayer1['Total Score'])
                                        }}</div>
                                </div>
                                <div class="comparison-item p-3 rounded-md bg-white shadow-sm">
                                    <div class="text-sm text-gray-500">Total Rank</div>
                                    <div class="text-xl font-semibold">{{ comparisonPlayer1['Total Rank'] || '-' }}
                                    </div>
                                </div>
                                <div class="comparison-item p-3 rounded-md bg-white shadow-sm">
                                    <div class="text-sm text-gray-500">Score Per Power</div>
                                    <div class="text-xl font-semibold">{{ formatNumber(comparisonPlayer1.scorePerPower,
                                        2) }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="text-lg font-semibold mb-2 text-purple-700">{{ comparisonPlayer2.Player }}</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="comparison-item p-3 rounded-md bg-white shadow-sm">
                                    <div class="text-sm text-gray-500">Power</div>
                                    <div class="text-xl font-semibold">{{ comparisonPlayer2.Power }}M</div>
                                </div>
                                <div class="comparison-item p-3 rounded-md bg-white shadow-sm">
                                    <div class="text-sm text-gray-500">Castle</div>
                                    <div class="text-xl font-semibold">{{ comparisonPlayer2.Castle }}</div>
                                </div>
                                <div class="comparison-item p-3 rounded-md bg-white shadow-sm">
                                    <div class="text-sm text-gray-500">Role</div>
                                    <div class="text-xl font-semibold">{{ comparisonPlayer2.Role }}</div>
                                </div>
                                <div class="comparison-item p-3 rounded-md bg-white shadow-sm">
                                    <div class="text-sm text-gray-500">Total Score</div>
                                    <div class="text-xl font-semibold">{{ formatNumber(comparisonPlayer2['Total Score'])
                                        }}</div>
                                </div>
                                <div class="comparison-item p-3 rounded-md bg-white shadow-sm">
                                    <div class="text-sm text-gray-500">Total Rank</div>
                                    <div class="text-xl font-semibold">{{ comparisonPlayer2['Total Rank'] || '-' }}
                                    </div>
                                </div>
                                <div class="comparison-item p-3 rounded-md bg-white shadow-sm">
                                    <div class="text-sm text-gray-500">Score Per Power</div>
                                    <div class="text-xl font-semibold">{{ formatNumber(comparisonPlayer2.scorePerPower,
                                        2) }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-8 bg-white p-4 rounded-lg shadow-sm">
                        <h3 class="text-lg font-semibold mb-4">Daily Performance Comparison</h3>
                        <div class="overflow-x-auto">
                            <table class="min-w-full">
                                <thead>
                                    <tr>
                                        <th
                                            class="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                            Day</th>
                                        <th
                                            class="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                            {{ comparisonPlayer1.Player }} Score</th>
                                        <th
                                            class="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                            {{ comparisonPlayer1.Player }} Rank</th>
                                        <th
                                            class="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                            {{ comparisonPlayer2.Player }} Score</th>
                                        <th
                                            class="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                            {{ comparisonPlayer2.Player }} Rank</th>
                                        <th
                                            class="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                            Difference</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="day in [1, 2]" :key="day" class="hover:bg-gray-50">
                                        <td class="px-4 py-2 border-b border-gray-200">Day {{ day }}</td>
                                        <td class="px-4 py-2 border-b border-gray-200">{{
                                            formatNumber(comparisonPlayer1[`Score (D${day})`]) }}</td>
                                        <td class="px-4 py-2 border-b border-gray-200">{{ comparisonPlayer1[`Event Rank
                                            (D${day})`] || '-' }}</td>
                                        <td class="px-4 py-2 border-b border-gray-200">{{
                                            formatNumber(comparisonPlayer2[`Score (D${day})`]) }}</td>
                                        <td class="px-4 py-2 border-b border-gray-200">{{ comparisonPlayer2[`Event Rank
                                            (D${day})`] || '-' }}</td>
                                        <td class="px-4 py-2 border-b border-gray-200"
                                            :class="{ 'text-green-600': comparisonPlayer1[`Score (D${day})`] > comparisonPlayer2[`Score (D${day})`], 'text-red-600': comparisonPlayer1[`Score (D${day})`] < comparisonPlayer2[`Score (D${day})`] }">
                                            {{ formatNumber(comparisonPlayer1[`Score (D${day})`] -
                                            comparisonPlayer2[`Score (D${day})`]) }}
                                        </td>
                                    </tr>
                                    <tr class="bg-gray-50 font-semibold">
                                        <td class="px-4 py-2 border-b border-gray-200">Total</td>
                                        <td class="px-4 py-2 border-b border-gray-200">{{
                                            formatNumber(comparisonPlayer1['Total Score']) }}</td>
                                        <td class="px-4 py-2 border-b border-gray-200">{{ comparisonPlayer1['Total Rank'] || '-' }}</td>
                                        <td class="px-4 py-2 border-b border-gray-200">{{
                                            formatNumber(comparisonPlayer2['Total Score']) }}</td>
                                        <td class="px-4 py-2 border-b border-gray-200">{{ comparisonPlayer2['Total Rank'] || '-' }}</td>
                                        <td class="px-4 py-2 border-b border-gray-200"
                                            :class="{ 'text-green-600': comparisonPlayer1['Total Score'] > comparisonPlayer2['Total Score'], 'text-red-600': comparisonPlayer1['Total Score'] < comparisonPlayer2['Total Score'] }"> {{ formatNumber(comparisonPlayer1['Total Score'] - comparisonPlayer2['Total Score']) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center text-gray-500 py-8">
                    Select two players above to compare their performance.
                </div>
            </section>

            <section v-show="!summaryView" class="mb-8">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                        <h2 class="text-2xl font-bold text-gray-700 mb-4 md:mb-0">Player Data</h2>
                        <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <div class="relative flex-grow">
                                <input v-model="searchTerm"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                                    placeholder="Search players..." />
                                <span class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </span>
                            </div>
                            <div class="flex-shrink-0">
                                <select v-model="sortField" @change="page = 1"
                                    class="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                                    <option value="Total Rank">Sort by Rank</option>
                                    <option value="Player">Sort by Player Name</option>
                                    <option value="Total Score">Sort by Total Score</option>
                                    <option value="Power">Sort by Power</option>
                                    <option value="Castle">Sort by Castle Level</option>
                                    <option value="Role">Sort by Role</option>
                                    <option value="scorePerPower">Sort by Efficiency</option>
                                    <option value="Score (D1)">Sort by Day 1 Score</option>
                                    <option value="Score (D2)">Sort by Day 2 Score</option>
                                </select>
                            </div>
                            <button @click="toggleSortDirection"
                                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex-shrink-0 flex items-center justify-center gap-1 bg-white">
                                <span v-if="sortDirection === 'asc'">▲</span><span v-else>▼</span> {{ sortDirection ===
                                'asc' ? 'Asc' : 'Desc' }}
                            </button>
                        </div>
                    </div>
                    <div class="mb-6 border-t border-b border-gray-200 py-4">
                        <h3 class="text-lg font-semibold mb-3 text-gray-600">Filters</h3>
                        <div class="flex flex-col md:flex-row gap-4 md:gap-6">
                            <div>
                                <span class="font-medium text-sm text-gray-500 mr-2">Role:</span>
                                <div class="inline-flex flex-wrap gap-2">
                                    <button @click="toggleRoleFilter('all')"
                                        class="filter-pill px-3 py-1 rounded-full text-sm border"
                                        :class="{ 'filter-active': activeRoleFilters.includes('all'), 'border-gray-300 bg-white': !activeRoleFilters.includes('all') }">All</button>
                                    <button v-for="role in ['R1', 'R2', 'R3', 'R4', 'R5']" :key="role"
                                        @click="toggleRoleFilter(role)"
                                        class="filter-pill px-3 py-1 rounded-full text-sm border"
                                        :class="{ 'filter-active': activeRoleFilters.includes(role), 'border-gray-300 bg-white': !activeRoleFilters.includes(role) }">{{
                                        role }}</button>
                                </div>
                            </div>
                            <div>
                                <span class="font-medium text-sm text-gray-500 mr-2">Castle:</span>
                                <div class="inline-flex flex-wrap gap-2">
                                    <button @click="toggleCastleFilter('all')"
                                        class="filter-pill px-3 py-1 rounded-full text-sm border"
                                        :class="{ 'filter-active': activeCastleFilters.includes('all'), 'border-gray-300 bg-white': !activeCastleFilters.includes('all') }">All</button>
                                    <button v-for="level in ['30-35', '36-40', '41-45', '46-50', '51+']" :key="level"
                                        @click="toggleCastleFilter(level)"
                                        class="filter-pill px-3 py-1 rounded-full text-sm border"
                                        :class="{ 'filter-active': activeCastleFilters.includes(level), 'border-gray-300 bg-white': !activeCastleFilters.includes(level) }">{{
                                        level }}</button>
                                </div>
                            </div>
                            <div>
                                <span class="font-medium text-sm text-gray-500 mr-2">Power:</span>
                                <div class="inline-flex flex-wrap gap-2">
                                    <button @click="togglePowerFilter('all')"
                                        class="filter-pill px-3 py-1 rounded-full text-sm border"
                                        :class="{ 'filter-active': activePowerFilters.includes('all'), 'border-gray-300 bg-white': !activePowerFilters.includes('all') }">All</button>
                                    <button v-for="power in ['0-25M', '25-50M', '50-75M', '75-100M', '100M+']"
                                        :key="power" @click="togglePowerFilter(power)"
                                        class="filter-pill px-3 py-1 rounded-full text-sm border"
                                        :class="{ 'filter-active': activePowerFilters.includes(power), 'border-gray-300 bg-white': !activePowerFilters.includes(power) }">{{
                                        power }}</button>
                                </div>
                            </div>
                            <div>
                                <span class="font-medium text-sm text-gray-500 mr-2">Activity:</span>
                                <div class="inline-flex flex-wrap gap-2">
                                    <button @click="toggleLowScoreFilter"
                                        class="filter-pill px-3 py-1 rounded-full text-sm border" :class="{
                                            'filter-active': lowScoreFilter,
                                            'border-gray-300 bg-white': !lowScoreFilter
                                        }">
                                        &lt; 1M
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full data-table">
                            <thead>
                                <tr>
                                    <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600"><button
                                            @click="updateSort('Total Rank')"
                                            class="flex items-center gap-1 hover:text-indigo-600">Rank <span
                                                v-if="sortField === 'Total Rank'">{{ sortDirection === 'asc' ? '▲' : '▼'
                                                }}</span></button></th>
                                    <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600"><button
                                            @click="updateSort('Player')"
                                            class="flex items-center gap-1 hover:text-indigo-600">Player <span
                                                v-if="sortField === 'Player'">{{ sortDirection === 'asc' ? '▲' : '▼'
                                                }}</span></button></th>
                                    <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600"><button
                                            @click="updateSort('Power')"
                                            class="flex items-center gap-1 hover:text-indigo-600">Power <span
                                                v-if="sortField === 'Power'">{{ sortDirection === 'asc' ? '▲' : '▼'
                                                }}</span></button></th>
                                    <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600"><button
                                            @click="updateSort('Castle')"
                                            class="flex items-center gap-1 hover:text-indigo-600">Castle <span
                                                v-if="sortField === 'Castle'">{{ sortDirection === 'asc' ? '▲' : '▼'
                                                }}</span></button></th>
                                    <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600"><button
                                            @click="updateSort('Role')"
                                            class="flex items-center gap-1 hover:text-indigo-600">Role <span
                                                v-if="sortField === 'Role'">{{ sortDirection === 'asc' ? '▲' : '▼'
                                                }}</span></button></th>
                                    <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600"><button
                                            @click="updateSort('Score (D1)')"
                                            class="flex items-center gap-1 hover:text-indigo-600">D1 Score <span
                                                v-if="sortField === 'Score (D1)'">{{ sortDirection === 'asc' ? '▲' : '▼'
                                                }}</span></button></th>
                                    <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600"><button
                                            @click="updateSort('Score (D2)')"
                                            class="flex items-center gap-1 hover:text-indigo-600">D2 Score <span
                                                v-if="sortField === 'Score (D2)'">{{ sortDirection === 'asc' ? '▲' : '▼'
                                                }}</span></button></th>
                                    <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600"><button
                                            @click="updateSort('Total Score')"
                                            class="flex items-center gap-1 hover:text-indigo-600">Total Score <span
                                                v-if="sortField === 'Total Score'">{{ sortDirection === 'asc' ? '▲' :
                                                '▼' }}</span></button></th>
                                    <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600"><button
                                            @click="updateSort('scorePerPower')"
                                            class="flex items-center gap-1 hover:text-indigo-600">Score/Power <span
                                                v-if="sortField === 'scorePerPower'">{{ sortDirection === 'asc' ? '▲' :
                                                '▼' }}</span></button></th>
                                    <th class="px-4 py-2 text-center text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="paginatedData.length === 0">
                                    <td :colspan="10" class="text-center py-4 text-gray-500">No players match the
                                        current filters.</td>
                                </tr>
                                <tr v-for="player in paginatedData" :key="player.Player"
                                    class="hover:bg-gray-50 text-sm">
                                    <td class="px-4 py-2 border-b border-gray-200">{{ player['Total Rank'] || '-' }}
                                    </td>
                                    <td class="px-4 py-2 border-b border-gray-200 font-medium text-gray-900">{{
                                        player['Player'] }}</td>
                                    <td class="px-4 py-2 border-b border-gray-200">{{ player['Power'] }}M</td>
                                    <td class="px-4 py-2 border-b border-gray-200">{{ player['Castle'] }}</td>
                                    <td class="px-4 py-2 border-b border-gray-200">{{ player['Role'] }}</td>
                                    <td class="px-4 py-2 border-b border-gray-200">{{ formatNumber(player['Score (D1)'])
                                        }}</td>
                                    <td class="px-4 py-2 border-b border-gray-200">{{ formatNumber(player['Score (D2)'])
                                        }}</td>
                                    <td class="px-4 py-2 border-b border-gray-200 font-semibold">{{
                                        formatNumber(player['Total Score']) }}</td>
                                    <td class="px-4 py-2 border-b border-gray-200">{{ formatNumber(player.scorePerPower,
                                        2) }}</td>
                                    <td class="px-4 py-2 border-b border-gray-200 text-center">
                                        <button @click.stop="selectPlayerForAverageCompare(player)"
                                            class="text-indigo-600 hover:text-indigo-900 text-xs font-medium"
                                            title="Add to comparison">Compare</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                        <div class="text-sm text-gray-500">
                            Showing {{ paginatedData.length > 0 ? (page - 1) * itemsPerPage + 1 : 0 }}-{{ Math.min(page
                                * itemsPerPage, filteredAndSortedData.length) }} of {{ filteredAndSortedData.length }}
                            players
                        </div>
                        <div class="flex gap-2 items-center">
                            <span class="text-sm text-gray-600 mr-2">Items per page:</span>
                            <select v-model="itemsPerPage" @change="page = 1"
                                class="px-2 py-1 border rounded-md text-sm bg-white">
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <div class="flex gap-2">
                            <button @click="page = Math.max(1, page - 1)" :disabled="page === 1"
                                class="px-3 py-1 border rounded-md text-sm"
                                :class="page === 1 ? 'cursor-not-allowed text-gray-400 bg-gray-100' : 'hover:bg-gray-50 bg-white'">Previous</button>
                            <div class="flex items-center px-2"><span class="text-sm text-gray-600">Page {{ page }} of
                                    {{ totalPages }}</span></div>
                            <button @click="page = Math.min(totalPages, page + 1)"
                                :disabled="page === totalPages || totalPages === 0"
                                class="px-3 py-1 border rounded-md text-sm"
                                :class="page === totalPages || totalPages === 0 ? 'cursor-not-allowed text-gray-400 bg-gray-100' : 'hover:bg-gray-50 bg-white'">Next</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <footer class="bg-gray-800 text-white py-6 mt-auto">
            <div class="container mx-auto px-4 md:px-8">
                <div class="text-center text-sm">
                    <p>VLR GvG Event Dashboard | Generated {{ getCurrentDate() }}</p>
                </div>
            </div>
        </footer>

        <div class="tooltip" ref="tooltip"></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import jsonData from '@/data/vlr_gvg_event_data.json';
import {
    Chart,
    BarController,
    LineController,
    ScatterController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend
} from 'chart.js';

// Reactive State
const rawPlayerData = ref([]);
const playerData = ref([]);
const searchTerm = ref('');
const sortField = ref('Total Rank');
const sortDirection = ref('asc');
const page = ref(1);
const itemsPerPage = ref(20);
const activeRoleFilters = ref(['all']);
const activeCastleFilters = ref(['all']);
const activePowerFilters = ref(['all']);
const lowScoreFilter = ref(false); // New filter for low scores
const summaryView = ref(true);
const comparisonView = ref(false);
const comparisonSearch1 = ref('');
const comparisonSearch2 = ref('');
const filteredComparisonPlayers1 = ref([]);
const filteredComparisonPlayers2 = ref([]);
const comparisonPlayer1 = ref(null);
const comparisonPlayer2 = ref(null);
const compareButtonCounter = ref(0);
const chartInstances = ref({});
const chartRenderLock = ref(false);
let initChartsDebounce;
const roleScoreChartRef = ref(null);
const castleScoreChartRef = ref(null);
const powerScoreChartRef = ref(null);
const dailyPerformanceChartRef = ref(null);
const playerComparisonChartRef = ref(null);
const summarySectionRef = ref(null);
const averagePlayer = ref(null);
const comparisonSectionRef = ref(null);
let chartRenderTimeout = null;
let isRenderingComparisonChart = false;

// Register Chart.js Components
Chart.register(
    BarController,
    LineController,
    ScatterController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend
);

// Utility Functions

const handleTabAutocomplete = (playerNum) => {
    if (playerNum === 1 && filteredComparisonPlayers1.value.length > 0) {
        const selected = filteredComparisonPlayers1.value[0];
        selectComparisonPlayer(selected, 1);
    }

    if (playerNum === 2 && filteredComparisonPlayers2.value.length > 0) {
        const selected = filteredComparisonPlayers2.value[0];
        selectComparisonPlayer(selected, 2);
    }
};

const formatNumber = (num, decimals = 0) => {
    const number = Number(num);
    if (isNaN(number)) return '-';
    return number.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};

const getScorePerPower = (player) => {
    const totalScore = Number(player['Total Score']) || 0;
    const power = player['Power'] || 0;
    return power > 0 ? totalScore / power : 0;
};

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Computed Properties for Summary Display
const totalParticipants = computed(() => playerData.value.length);

const activeParticipants = computed(() => {
    return playerData.value.filter(player => (Number(player['Total Score']) || 0) > 0).length;
});

const averagePower = computed(() => {
    const activePlayers = playerData.value.filter(player => (Number(player['Total Score']) || 0) > 0);
    if (!activePlayers.length) return '0.00';
    const totalPower = activePlayers.reduce((sum, player) => sum + player['Power'], 0);
    return (totalPower / activePlayers.length).toFixed(2);
});

const averageCastleLevel = computed(() => {
    const activePlayers = playerData.value.filter(player => (Number(player['Total Score']) || 0) > 0);
    if (!activePlayers.length) return '0';
    const totalCastleLevel = activePlayers.reduce((sum, player) => sum + player['Castle'], 0);
    return Math.round(totalCastleLevel / activePlayers.length);
});

const topPlayers = computed(() => {
    return [...playerData.value]
        .filter(player => (Number(player['Total Score']) || 0) > 0)
        .sort((a, b) => (Number(b['Total Score']) || 0) - (Number(a['Total Score']) || 0))
        .slice(0, 10);
});

const efficiencyLeaders = computed(() => {
    return [...playerData.value]
        .filter(player => (Number(player['Total Score']) || 0) > 0 && player['Power'] > 0)
        .sort((a, b) => b.scorePerPower - a.scorePerPower)
        .slice(0, 10);
});

// Computed Properties for Filtering and Sorting
const filteredData = computed(() => {
    let result = playerData.value;

    // Apply search term filter
    if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        result = result.filter(player => player['Player'].toLowerCase().includes(term));
    }

    // Apply role filters
    if (!activeRoleFilters.value.includes('all')) {
        result = result.filter(player => activeRoleFilters.value.includes(player['Role']));
    }

    // Apply castle level filters
    if (!activeCastleFilters.value.includes('all')) {
        result = result.filter(player => {
            const castleLevel = player['Castle'];
            return activeCastleFilters.value.some(filter => {
                if (filter === '30-35') return castleLevel >= 30 && castleLevel <= 35;
                if (filter === '36-40') return castleLevel >= 36 && castleLevel <= 40;
                if (filter === '41-45') return castleLevel >= 41 && castleLevel <= 45;
                if (filter === '46-50') return castleLevel >= 46 && castleLevel <= 50;
                if (filter === '51+') return castleLevel >= 51;
                return false;
            });
        });
    }

    // Apply power level filters
    if (!activePowerFilters.value.includes('all')) {
        result = result.filter(player => {
            const powerLevel = player['Power'];
            return activePowerFilters.value.some(filter => {
                if (filter === '0-25M') return powerLevel >= 0 && powerLevel < 25;
                if (filter === '25-50M') return powerLevel >= 25 && powerLevel < 50;
                if (filter === '50-75M') return powerLevel >= 50 && powerLevel < 75;
                if (filter === '75-100M') return powerLevel >= 75 && powerLevel < 100;
                if (filter === '100M+') return powerLevel >= 100;
                return false;
            });
        });
    }

    // Apply low score filter (new)
    if (lowScoreFilter.value) {
        result = result.filter(player => {
            const day1Score = Number(player['Score (D1)']) || 0;
            const day2Score = Number(player['Score (D2)']) || 0;
            return day1Score < 1000000 || day2Score < 1000000;
        });
    }

    return result;
});

const filteredAndSortedData = computed(() => {
    let result = [...filteredData.value];

    if (sortField.value) {
        result.sort((a, b) => {
            let valA = a[sortField.value];
            let valB = b[sortField.value];

            if (sortField.value === 'Player' || sortField.value === 'Role') {
                valA = String(valA || '');
                valB = String(valB || '');
                return sortDirection.value === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            } else {
                valA = Number(valA) || 0;
                valB = Number(valB) || 0;
                return sortDirection.value === 'asc' ? valA - valB : valB - valA;
            }
        });
    }
    return result;
});

// Computed Properties for Pagination
const totalPages = computed(() => {
    const items = Number(itemsPerPage.value) || 20;
    return Math.ceil(filteredAndSortedData.value.length / items);
});

const paginatedData = computed(() => {
    const start = (page.value - 1) * Number(itemsPerPage.value);
    const end = start + Number(itemsPerPage.value);
    return filteredAndSortedData.value.slice(start, end);
});

// Methods
const toggleSortDirection = () => {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    page.value = 1;
};

const updateSort = (field) => {
    if (sortField.value === field) {
        toggleSortDirection();
    } else {
        sortField.value = field;
        sortDirection.value = (field === 'Total Rank' || field === 'Player' || field === 'Role' || field === 'Castle') ? 'asc' : 'desc';
    }
    page.value = 1;
};

const toggleFilter = (filterValue, activeFiltersRef) => {
    const filters = activeFiltersRef.value;
    if (filterValue === 'all') {
        activeFiltersRef.value = ['all'];
    } else {
        const index = filters.indexOf(filterValue);
        if (index > -1) {
            filters.splice(index, 1);
            if (filters.length === 0) {
                activeFiltersRef.value = ['all'];
            } else {
                activeFiltersRef.value = filters;
            }
        } else {
            const allIndex = filters.indexOf('all');
            if (allIndex > -1) {
                filters.splice(allIndex, 1);
            }
            filters.push(filterValue);
            activeFiltersRef.value = filters;
        }
    }
    page.value = 1;
};

// Toggle the low score filter
const toggleLowScoreFilter = () => {
    lowScoreFilter.value = !lowScoreFilter.value;
    page.value = 1;
};

const toggleRoleFilter = (role) => toggleFilter(role, activeRoleFilters);
const toggleCastleFilter = (level) => toggleFilter(level, activeCastleFilters);
const togglePowerFilter = (power) => toggleFilter(power, activePowerFilters);

const toggleSummaryView = () => {
    summaryView.value = !summaryView.value;
    if (summaryView.value) {
        comparisonView.value = false;
    } else {
        destroySummaryCharts();
    }
};

const toggleComparisonView = () => {
    comparisonView.value = !comparisonView.value;
    if (comparisonView.value) {
        summaryView.value = false;
        destroySummaryCharts();
    } else {
        destroyChart('playerComparisonChart');
    }
};

const filterComparison = (playerNum) => {
    const searchRef = playerNum === 1 ? comparisonSearch1 : comparisonSearch2;
    const resultsRef = playerNum === 1 ? filteredComparisonPlayers1 : filteredComparisonPlayers2;
    const otherPlayer = playerNum === 1 ? comparisonPlayer2.value : comparisonPlayer1.value;

    if (!searchRef.value) {
        resultsRef.value = [];
        return;
    }

    const term = searchRef.value.toLowerCase();

    // Start with all normal players
    const baseResults = playerData.value.filter(p =>
        p.Player.toLowerCase().includes(term) &&
        (!otherPlayer || p.Player !== otherPlayer.Player)
    );

    // Add the average player if it matches the search term
    if (
        averagePlayer.value &&
        averagePlayer.value.Player.toLowerCase().includes(term) &&
        (!otherPlayer || averagePlayer.value.Player !== otherPlayer.Player)
    ) {
        baseResults.push(averagePlayer.value);
    }

    resultsRef.value = baseResults.slice(0, 10); // keep limit if needed
};

const selectComparisonPlayer = (player, playerNum) => {
    if (playerNum === 1) {
        if (comparisonPlayer2.value && comparisonPlayer2.value.Player === player.Player) return;
        comparisonPlayer1.value = player;
        comparisonSearch1.value = player.Player;
        filteredComparisonPlayers1.value = [];
    } else {
        if (comparisonPlayer1.value && comparisonPlayer1.value.Player === player.Player) return;
        comparisonPlayer2.value = player;
        comparisonSearch2.value = player.Player;
        filteredComparisonPlayers2.value = [];
    }

    if (!comparisonView.value) {
        toggleComparisonView();
    }
};

const selectPlayerForAverageCompare = async (player) => {
    const activePlayers = playerData.value.filter(p => Number(p['Total Score']) > 0 && p.Player !== player.Player);
    const avg = (field) => {
        const sum = activePlayers.reduce((total, p) => total + Number(p[field] || 0), 0);
        return activePlayers.length ? sum / activePlayers.length : 0;
    };

    const avgPlayerObj = {
        Player: 'Average Player',
        Power: parseFloat(avg('Power').toFixed(2)),
        Castle: Math.round(avg('Castle')),
        Role: 'R2',
        'Total Score': Math.round(avg('Total Score')),
        'Total Rank': '0',
        'Score (D1)': Math.round(avg('Score (D1)')),
        'Event Rank (D1)': '0',
        'Score (D2)': Math.round(avg('Score (D2)')),
        'Event Rank (D2)': '0',
        scorePerPower: avg('scorePerPower')
    };

    comparisonPlayer1.value = player;
    comparisonPlayer2.value = avgPlayerObj;
    comparisonSearch1.value = player.Player;
    comparisonSearch2.value = 'Average Player';
    filteredComparisonPlayers1.value = [];
    filteredComparisonPlayers2.value = [];

    if (!comparisonView.value) toggleComparisonView();

    await nextTick();

    // Very deliberate deferment
    requestAnimationFrame(() => {
        triggerComparisonChartRender();
    });
};


// Chart Management
async function waitForCanvasRef(ref, retries = 15, interval = 200) {
    return new Promise((resolve, reject) => {
        let attempt = 0;

        const check = () => {
            const el = ref.value;

            if (!el) {
                console.warn(`[Canvas] Ref is null [${attempt}]`);
            } else {
                const ctx = el.getContext && el.getContext('2d');
                const ready = el.offsetParent !== null && el.width > 0 && ctx;

                console.log(`[Canvas] Attempt ${attempt} — offsetParent: ${el.offsetParent !== null}, width: ${el.width}, ctx:`, ctx);

                if (ready && ctx && typeof ctx.save === 'function') {
                    resolve(ctx);
                    return;
                }
            }

            if (++attempt < retries) {
                setTimeout(check, interval);
            } else {
                reject(new Error('Canvas context not available'));
            }
        };

        check();
    });
}


const destroyChart = (chartId) => {
    const instance = chartInstances.value[chartId];
    if (instance && typeof instance.destroy === 'function') {
        try {
            console.log(`[Chart Destroy] Destroying chart: ${chartId}`);
            instance.destroy();
        } catch (e) {
            console.error(`Error destroying chart ${chartId}:`, e);
            console.trace();
        } finally {
            delete chartInstances.value[chartId];
        }
    } else if (instance) {
        console.warn(`[Chart Destroy] ${chartId} is not a valid chart instance`);
    } else {
        console.info(`[Chart Destroy] No existing chart for ${chartId}`);
    }
};

const destroySummaryCharts = () => {
    destroyChart('roleScoreChart');
    destroyChart('castleScoreChart');
    destroyChart('powerScoreChart');
    destroyChart('dailyPerformanceChart');
};

const destroyAllCharts = () => {
    destroySummaryCharts();
    destroyChart('playerComparisonChart');
};

const commonChartOptions = (axis = 'y', beginAtZero = true, tooltipCallback = null, additionalScalesOptions = {}) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            [axis]: {
                beginAtZero: beginAtZero,
                ticks: {
                    callback: function (value) {
                        if (typeof value !== 'number') return value;
                        if (Math.abs(value) >= 1000000) return (value / 1000000).toFixed(1) + 'M';
                        if (Math.abs(value) >= 1000) return (value / 1000).toFixed(1) + 'K';
                        return value;
                    }
                }
            },
            ...additionalScalesOptions
        },
        plugins: {
            tooltip: {
                enabled: true,
                callbacks: {}
            },
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 12,
                    padding: 15
                }
            }
        },
        animation: {
            duration: 500
        },
        hover: {
            animationDuration: 0
        },
        responsiveAnimationDuration: 0
    };

    if (tooltipCallback && typeof tooltipCallback === 'function') {
        options.plugins.tooltip.callbacks.label = () => '';
        options.plugins.tooltip.callbacks.title = () => '';
        options.plugins.tooltip.callbacks.afterBody = tooltipCallback;
    } else {
        options.plugins.tooltip.callbacks.label = function (context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            const value = context.raw;
            if (value != null) {
                label += formatNumber(value);
            }
            return label;
        };
    }
    return options;
};

async function initCharts() {
    const roleAggData = {};
    const castleAggData = {};

    playerData.value.forEach(player => {
        const totalScore = Number(player['Total Score']) || 0;
        const role = player['Role'] || 'Unknown';
        const castleLevel = player['Castle'];

        if (!roleAggData[role]) roleAggData[role] = { count: 0, totalScore: 0 };
        roleAggData[role].count += 1;
        roleAggData[role].totalScore += totalScore;

        if (totalScore > 0) {
            if (!castleAggData[castleLevel]) castleAggData[castleLevel] = { count: 0, totalScore: 0 };
            castleAggData[castleLevel].count += 1;
            castleAggData[castleLevel].totalScore += totalScore;
        }
    });

    if (chartRenderLock.value) {
        console.warn('[Chart Init] Skipping due to render lock');
        return;
    }

    chartRenderLock.value = true;

    try {
        destroySummaryCharts();

        // ROLE SCORE CHART
        const roleCtx = await waitForCanvasRef(roleScoreChartRef);
        const roleLabels = Object.keys(roleAggData).sort();
        const roleAvgScores = roleLabels.map(r => roleAggData[r].totalScore / roleAggData[r].count);

        chartInstances.value.roleScoreChart = new Chart(roleCtx, {
            type: 'bar',
            data: {
                labels: roleLabels,
                datasets: [{
                    label: 'Average Score by Role',
                    data: roleAvgScores,
                    backgroundColor: 'rgba(79, 70, 229, 0.7)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 1
                }]
            },
            options: commonChartOptions('y', true, (ctx) => {
                const i = ctx[0].dataIndex;
                const role = roleLabels[i];
                return [
                    `Role: ${role}`,
                    `Avg Score: ${formatNumber(roleAvgScores[i])}`,
                    `Players: ${roleAggData[role].count}`
                ];
            })
        });

        // CASTLE SCORE CHART
        const castleCtx = await waitForCanvasRef(castleScoreChartRef);
        const castleLabels = Object.keys(castleAggData).map(Number).sort((a, b) => a - b);
        const castleAvgScores = castleLabels.map(c => castleAggData[c].totalScore / castleAggData[c].count);

        chartInstances.value.castleScoreChart = new Chart(castleCtx, {
            type: 'line',
            data: {
                labels: castleLabels,
                datasets: [{
                    label: 'Average Score by Castle Level',
                    data: castleAvgScores,
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }]
            },
            options: commonChartOptions('y', true)
        });

        // POWER vs SCORE CHART
        const powerCtx = await waitForCanvasRef(powerScoreChartRef);
        const scatterData = playerData.value
            .filter(p => p['Total Score'] > 0)
            .map(p => ({ x: p.Power, y: p['Total Score'], player: p.Player }));

        chartInstances.value.powerScoreChart = new Chart(powerCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Power vs Score',
                    data: scatterData,
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: commonChartOptions('y', true, (ctx) => {
                const p = ctx[0].raw;
                return [`${p.player}`, `Power: ${p.x}M`, `Score: ${formatNumber(p.y)}`];
            }, {
                x: {
                    title: {
                        display: true,
                        text: 'Power (M)'
                    }
                }
            })
        });

        // DAILY PERFORMANCE CHART
        const dailyCtx = await waitForCanvasRef(dailyPerformanceChartRef);
        const top5 = topPlayers.value.slice(0, 5);
        const dailyLabels = ['Day 1', 'Day 2'];

        const datasets = top5.map((p, i) => {
            const baseColor = ['rgba(79,70,229,0.6)', 'rgba(139,92,246,0.6)', 'rgba(59,130,246,0.6)', 'rgba(16,185,129,0.6)', 'rgba(245,158,11,0.6)'][i];
            const border = baseColor.replace('0.6', '1');

            return {
                label: p.Player,
                data: [p['Score (D1)'], p['Score (D2)']],
                backgroundColor: baseColor,
                borderColor: border,
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 3
            };
        });

        chartInstances.value.dailyPerformanceChart = new Chart(dailyCtx, {
            type: 'line',
            data: {
                labels: dailyLabels,
                datasets: datasets
            },
            options: commonChartOptions('y', true)
        });

    } catch (err) {
        console.error('[Chart Init] Error during chart rendering:', err);
    } finally {
        chartRenderLock.value = false;
    }
}

async function updatePlayerComparisonChart() {

    if (!comparisonView.value || !comparisonPlayer1.value || !comparisonPlayer2.value) {
        console.warn('[Player Comparison] Invalid comparison state');
        destroyChart('playerComparisonChart');
        return;
    }

    const canvasEl = playerComparisonChartRef.value;

    if (!canvasEl || !canvasEl.getContext) {
        console.warn('[Player Comparison] playerComparisonChartRef is null');
        return;
    }

    // Wait until canvas is fully painted and ready
    let ctx;
    try {
        ctx = await waitForCanvasRef(playerComparisonChartRef, 10, 200);
    } catch (err) {
        console.error('[Player Comparison] Canvas not ready:', err);
        return;
    }

    if (!playerComparisonChartRef.value || !playerComparisonChartRef.value.getContext) {
        console.warn('[Player Comparison] Canvas disappeared before rendering');
        return;
    }

    destroyChart('playerComparisonChart');

    const p1 = comparisonPlayer1.value;
    const p2 = comparisonPlayer2.value;

    const labels = ['Day 1 Score', 'Day 2 Score', 'Total Score'];
    const p1Data = [p1['Score (D1)'], p1['Score (D2)'], p1['Total Score']];
    const p2Data = [p2['Score (D1)'], p2['Score (D2)'], p2['Total Score']];

    try {
        chartInstances.value.playerComparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: p1.Player,
                        data: p1Data,
                        backgroundColor: 'rgba(79,70,229,0.7)',
                        borderColor: 'rgba(79,70,229,1)',
                        borderWidth: 1
                    },
                    {
                        label: p2.Player,
                        data: p2Data,
                        backgroundColor: 'rgba(139,92,246,0.7)',
                        borderColor: 'rgba(139,92,246,1)',
                        borderWidth: 1
                    }
                ]
            },
            options: commonChartOptions('y', true)
        });

    } catch (err) {
        console.error('[Player Comparison] Chart rendering failed ❌', err);
    }
}

const triggerComparisonChartRender = () => {
    if (chartRenderTimeout) {
        clearTimeout(chartRenderTimeout);
    }

    chartRenderTimeout = setTimeout(async () => {
        if (isRenderingComparisonChart) {
            console.warn('[Chart] Already rendering comparison chart');
            return;
        }

        if (!comparisonView.value || !comparisonPlayer1.value || !comparisonPlayer2.value) {
            console.warn('[Chart] Invalid state, skipping chart render');
            return;
        }

        isRenderingComparisonChart = true;

        try {
            console.log('[Chart Trigger] 🚀 Rendering player comparison chart...');
            await updatePlayerComparisonChart();
        } catch (err) {
            console.error('[Chart Trigger] Chart rendering failed:', err);
        } finally {
            isRenderingComparisonChart = false;
        }
    }, 150); // debounce time
};


onMounted(() => {
    rawPlayerData.value = jsonData;
    playerData.value = rawPlayerData.value.map(player => {
        const powerStr = String(player.Power || '0M');
        const power = parseFloat(powerStr.replace('M', '')) || 0;
        const totalScore = Number(player['Total Score']) || 0;
        const scorePerPower = power > 0 ? totalScore / power : 0;
        return {
            ...player,
            Power: power,
            Castle: Number(player.Castle) || 0,
            'Score (D1)': Number(player['Score (D1)']) || 0,
            'Event Rank (D1)': Number(player['Event Rank (D1)']) || 0,
            'Score (D2)': Number(player['Score (D2)']) || 0,
            'Event Rank (D2)': Number(player['Event Rank (D2)']) || 0,
            'Total Score': totalScore,
            'Total Rank': Number(player['Total Rank']) || 0,
            scorePerPower: scorePerPower
        };
    });
});

watch([comparisonPlayer1, comparisonPlayer2], () => {
    if (comparisonView.value) {
        triggerComparisonChartRender();
    }
});

watch(playerData, async (newData) => {
    if (summaryView.value && newData.length > 0) {
        await nextTick();
        setTimeout(() => {

            const activePlayers = newData.filter(p => Number(p['Total Score']) > 0);

            const avg = (field) => {
                const sum = activePlayers.reduce((total, p) => total + Number(p[field] || 0), 0);
                return activePlayers.length ? Number((sum / activePlayers.length).toFixed(2)) : 0;
            };

            averagePlayer.value = {
                Player: 'Average Player',
                Power: avg('Power'),
                Castle: Math.round(avg('Castle')),
                Role: 'R2',
                'Total Score': Math.round(avg('Total Score')),
                'Total Rank': 0,
                'Score (D1)': Math.round(avg('Score (D1)')),
                'Event Rank (D1)': 0,
                'Score (D2)': Math.round(avg('Score (D2)')),
                'Event Rank (D2)': 0,
                scorePerPower: avg('scorePerPower')
            };
            initCharts();
        }, 300);
    }
}, { immediate: true });

watch(comparisonView, (isComparisonActive) => {
    if (isComparisonActive && comparisonPlayer1.value && comparisonPlayer2.value) {
        triggerComparisonChartRender();
    } else if (!isComparisonActive) {
        destroyChart('playerComparisonChart');
    }
});

watch(summaryView, async (isSummaryActive) => {
    if (isSummaryActive && playerData.value.length > 0) {

        await nextTick();
        requestAnimationFrame(async () => {
            await nextTick();

            setTimeout(() => {
                initCharts();
            }, 200);
        });

    } else if (!isSummaryActive) {
        destroySummaryCharts();
    }
});


watch(page, () => {
    if (!summaryView.value && !comparisonView.value) {
        nextTick(() => {
            const tableContainer = document.querySelector('.data-table')?.closest('.overflow-x-auto');
            if (tableContainer) {
                tableContainer.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const mainContent = document.querySelector('main.container');
                if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
});

</script>


<style scoped>
.chart-container {
    position: relative;
    height: 400px;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
}

[v-cloak] {
    display: none;
}

.tooltip {
    position: absolute;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    pointer-events: none;
    display: none;
}

.tooltip-visible {
    display: block;
}

.filter-pill {
    transition: all 0.3s ease;
}

.filter-pill:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
}

.filter-active {
    background-color: #4f46e5;
    color: white;
    border-color: #4f46e5;
}

.data-table th {
    position: sticky;
    top: 0;
    background-color: #f9fafb;
    z-index: 1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comparison-item {
    transition: all 0.3s ease;
}

.comparison-item:hover {
    background-color: #f3f4f6;
}
</style>