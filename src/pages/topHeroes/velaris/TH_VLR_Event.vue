<template>
    <div v-cloak class="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
        <header class="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg">
            <div class="container mx-auto py-6 px-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                <h1 class="text-3xl font-bold mb-1">
                    {{ guildName }} – {{ eventName }} Event Dashboard
                </h1>
                <p class="text-indigo-100 text-sm">Interactive analysis and visualization of player performance</p>
                </div>
                
                <div class="flex gap-3 mt-2 md:mt-0">
                <button @click="toggleSummaryView"
                    class="px-4 py-2 bg-white text-indigo-700 rounded-md shadow-sm hover:shadow-md transition-all font-medium">
                    {{ summaryView ? 'Player  Data' : 'Summary View' }}
                </button>
                <!-- 
                <button @click="changeDataset"
                    class="px-4 disable py-2 bg-white text-indigo-700 rounded-md shadow-sm hover:shadow-md transition-all font-medium">
                    Change Dataset
                </button>
                -->
                </div>
            </div>
            </header>


        <main class="container mx-auto px-4 md:px-8 py-6 flex-grow">
            <section v-show="summaryView" class="mb-12" ref="summarySectionRef">
                <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-2xl font-bold mb-4 text-gray-700">Event Summary</h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div class="bg-indigo-50 p-4 rounded-lg text-center md:text-left">
                            <div class="text-indigo-700 text-center font-medium">Total Players</div>
                            <div class="text-indigo-700 opacity-0 text-center text-sm">Total</div>
                            <div class="text-3xl text-center font-bold">{{ totalParticipants }}</div>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg text-center md:text-left">
                            <div class="text-purple-700 text-center font-medium">Active Players</div>
                            <div class="text-indigo-700 opacity-70 text-center text-sm">Overall</div>
                            <div class="text-3xl text-center font-bold">{{ activeParticipants }}</div>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-lg text-center md:text-left">
                            <div class="text-blue-700 text-center font-medium">Avg Power</div>
                            <div class="text-indigo-700 opacity-70 text-center text-sm">Active</div>
                            <div class="text-3xl text-center font-bold">{{ averagePower }}M</div>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg text-center md:text-left">
                            <div class="text-green-700 text-center font-medium">Avg Castle</div>
                            <div class="text-indigo-700 opacity-70 text-center text-sm">Active</div>
                            <div class="text-3xl text-center font-bold">{{ averageCastleLevel }}</div>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-8">
                        <div class="w-full md:w-1/2">
                            <h3 class="text-xl font-semibold">Top Performers</h3>
                            <h3 class="text-sm opacity-70 mb-3">Overall Score</h3>
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
                            <h3 class="text-xl font-semibold">Efficiency Leaders</h3>
                            <h3 class="text-sm opacity-70 mb-3">Overall Score/Power</h3>
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
                    <div
                        ref="cardObserverEl"
                        class="bg-white rounded-lg shadow-md px-4 sm:px-6 md:px-8 py-6 sm:py-8
                                flex flex-col items-center justify-center text-center gap-3 sm:gap-4"
                        >
                        <h3 class="text-lg sm:text-xl font-semibold text-gray-600">
                            Overall Score
                        </h3>

                        <CountUp
                            :endVal="totalScoreOverall"
                            :duration="2.5"
                            :options="{ separator: ',' }"
                            class="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold animate-score-gradient"
                        />
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <div class="chart-container">
                            <v-chart :option="roleChartOption" autoresize id="roleScoreChart"
                                ref="roleScoreChartRef"></v-chart>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <div class="chart-container">
                            <v-chart :option="castleScoreChartOption" autoresize id="castleScoreChart"
                                ref="castleScoreChartRef"></v-chart>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <div class="chart-container">
                            <v-chart :option="scatterOption" autoresize id="powerScoreChart"
                                ref="powerScoreChartRef"></v-chart>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <div class="chart-container">
                            <v-chart :option="dailyOption" autoresize id="dailyPerformanceChart"
                                ref="dailyPerformanceChartRef"></v-chart>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <div class="chart-container">
                            <v-chart :option="totalScoreByDayPieOption" autoresize id="scoreByDayPie" />
                        </div>
                    </div>
                </div>
            </section>

            <section v-show="!summaryView" ref="comparisonSectionRef" class="mb-8 bg-white rounded-lg shadow-md p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <h2 class="text-2xl font-bold text-gray-700">
                        Player Comparison
                    </h2>
                    <div class="flex md:justify-end">
                        <div class="relative w-full md:max-w-sm">
                        <input
                            v-model="comparisonSearchTerm"
                            type="text"
                            placeholder="Search players to compare..."
                            @keydown="handleComparisonSearchKeydown"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <ul
                            v-if="filteredComparisonSearchResults.length > 0"
                            class="absolute z-10 bg-white border border-gray-200 w-full rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto"
                        >
                            <li
                            v-for="player in filteredComparisonSearchResults"
                            :key="player.Player"
                            @click="addPlayerToComparisonFromSearch(player)"
                            class="px-4 py-2 cursor-pointer hover:bg-indigo-50 text-sm"
                            >
                            {{ player.Player }}
                            </li>
                        </ul>
                        </div>
                    </div>
                </div>
                <div v-show="selectedComparisonPlayers.length > 0">
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-2 text-gray-700">Selected Players for Comparison (Max {{ maxComparisonPlayers }})</h3>
                    <div v-if="selectedComparisonPlayers.length > 0" class="flex flex-wrap gap-2">
                        <span v-for="player in selectedComparisonPlayers" :key="player.Player"
                            class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium flex items-center gap-1">
                            {{ player.Player }}
                            <button @click="togglePlayerForComparison(player)" class="text-indigo-600 hover:text-indigo-900 ml-1">
                                &times;
                            </button>
                        </span>
                    </div>
                    <div v-else class="text-gray-500 text-sm">
                        Select players from the table below to add them for comparison.
                    </div>
                </div>

                <div v-if="selectedComparisonPlayers.length > 0" class="mb-4">
                    <div class="chart-container mb-8">
                        <v-chart :option="comparisonDailyOption" autoresize id="playerComparisonDailyChart"></v-chart>
                    </div>
                    <TransitionGroup name="fade" tag="div" class="grid gap-6 mt-8 md:grid-cols-2">
                        <div v-for="p in comparisonCards" :key="p.Player"
                            class="border rounded-xl p-4 shadow bg-white transition-transform
                                    transform hover:-translate-y-1 hover:shadow-lg"
                            :style="{
                                borderColor: playerColorMap[p.Player],
                                backgroundColor: washed(playerColorMap[p.Player])
                            }"
                            @mouseenter="highlightSeries(p.Player)"
                            @mouseleave="downplaySeries">

                            <h3 class="font-bold text-lg mb-3"
                                :class="p.Player === 'Average Player' ? 'text-purple-600' : ''"
                                :style="{ color: playerColorMap[p.Player] }">
                            {{ p.Player }}
                            </h3>

                            <dl class="grid grid-cols-2 gap-4 text-sm">
                            <div v-for="f in comparisonFields" :key="f.key" class="space-y-1">
                                <dt class="font-medium text-gray-500">{{ f.label }}</dt>
                                <dd class="text-gray-900 font-semibold">{{ f.fmt(p[f.key] ?? 0) }}</dd>
                            </div>
                            </dl>
                        </div>
                    </TransitionGroup>
                </div>
            </div>
            </section>

            <section v-show="!summaryView" class="mb-8">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                        <h2 class="text-2xl font-bold no-wrap text-gray-700 mb-4 md:mb-0">Player Data</h2>
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
                                    <option value="dynamicTotalRank">Sort by Overall Rank</option>
                                    <option value="Player">Sort by Player Name</option>
                                    <option value="dynamicTotalScore">Sort by Filtered Score</option>
                                    <option value="Power">Sort by Power</option>
                                    <option value="Castle">Sort by Castle Level</option>
                                    <option value="Role">Sort by Role</option>
                                    <option value="scorePerPower">Sort by Efficiency (Overall)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="mb-6 border-t border-b border-gray-200 py-4">
                        <h3 class="text-lg font-semibold mb-3 text-gray-600">Filters</h3>
                        <div class="flex flex-col md:flex-row gap-4 md:gap-6 flex-wrap">
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
                                <span class="font-medium text-sm text-gray-500 mr-2">Include Days:</span>
                                <div class="inline-flex flex-wrap gap-2">
                                    <button @click="toggleDayFilter('all')"
                                        class="filter-pill px-3 py-1 rounded-full text-sm border"
                                        :class="{ 'filter-active': activeDayFilters.length === 0, 'border-gray-300 bg-white': activeDayFilters.length > 0 }">All
                                        Days</button>
                                    <button v-for="day in allDays" :key="`day-filter-${day}`"
                                        @click="toggleDayFilter(day)"
                                        class="filter-pill px-3 py-1 rounded-full text-sm border" :class="{
                                            'filter-active': activeDayFilters.includes(day),
                                            'border-gray-300 bg-white': !activeDayFilters.includes(day),
                                            'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400': !dayHasData[day]
                                        }" :disabled="!dayHasData[day]">Day {{ day }}</button>
                                </div>
                            </div>
                            <div>
                                <span class="font-medium text-sm text-gray-500 mr-2">Low Score:</span>
                                <div class="inline-flex flex-wrap gap-2">
                                    <button @click="toggleLowScoreFilter"
                                        class="filter-pill px-3 py-1 rounded-full text-sm border" :class="{
                                            'filter-active': lowScoreFilter,
                                            'border-gray-300 bg-white': !lowScoreFilter
                                        }">
                                        < 1M </button>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full data-table">
                            <thead>
                                <tr>
                                    <th class="px-4 py-2 text-center text-sm font-semibold text-gray-600">
                                        <button @click="updateSort('dynamicTotalRank')"
                                            class="flex items-center gap-1 hover:text-indigo-600">
                                            Rank
                                            <span v-if="sortField === 'dynamicTotalRank'">
                                                {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                            </span>
                                        </button>
                                    </th>
                                    <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                                        <button @click="updateSort('Player')"
                                            class="flex items-center gap-1 hover:text-indigo-600">
                                            Player
                                            <span v-if="sortField === 'Player'">
                                                {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                            </span>
                                        </button>
                                    </th>
                                    <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                                        <button @click="updateSort('Power')"
                                            class="flex items-center gap-1 hover:text-indigo-600">
                                            Power
                                            <span v-if="sortField === 'Power'">
                                                {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                            </span>
                                        </button>
                                    </th>
                                    <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                                        <button @click="updateSort('Castle')"
                                            class="flex items-center gap-1 hover:text-indigo-600">
                                            Castle
                                            <span v-if="sortField === 'Castle'">
                                                {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                            </span>
                                        </button>
                                    </th>
                                    <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                                        <button @click="updateSort('Role')"
                                            class="flex items-center gap-1 hover:text-indigo-600">
                                            Role
                                            <span v-if="sortField === 'Role'">
                                                {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                            </span>
                                        </button>
                                    </th>
                                    <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                                        <button @click="updateSort('dynamicTotalScore')"
                                            class="flex items-center gap-1 hover:text-indigo-600">
                                            Score
                                            <span v-if="sortField === 'dynamicTotalScore'">
                                                {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                            </span>
                                        </button>
                                    </th>
                                    <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                                        <button @click="updateSort('scorePerPower')"
                                            class="flex items-center gap-1 hover:text-indigo-600">
                                            Score/Power
                                            <span v-if="sortField === 'scorePerPower'">
                                                {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                            </span>
                                        </button>
                                    </th>
                                    <th class="px-4 py-2 text-center text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="paginatedData.length === 0">
                                    <td colspan="8" class="text-center py-4 text-gray-500">No players match the current
                                        filters.</td>
                                </tr>
                                <tr v-for="player in paginatedData" :key="player.Player"
                                    class="hover:bg-gray-50 text-sm">
                                    <td class="px-4 py-2 border-b border-gray-200">{{ player.dynamicTotalRank || '-' }}
                                    </td>
                                    <td class="px-4 py-2 border-b border-gray-200 font-medium text-gray-900">{{
                                        player['Player'] }}</td>
                                    <td class="px-4 py-2 border-b border-gray-200">{{ player['Power'] }}M</td>
                                    <td class="px-4 py-2 border-b border-gray-200">{{ player['Castle'] }}</td>
                                    <td class="px-4 py-2 border-b border-gray-200">{{ player['Role'] }}</td>
                                    <td class="px-4 py-2 border-b border-gray-200 font-semibold">{{
                                        formatNumber(player.dynamicTotalScore) }}</td>
                                    <td class="px-4 py-2 border-b border-gray-200">{{ formatNumber(player.scorePerPower,
                                        2) }}</td>
                                    <td class="px-4 py-2 border-b border-gray-200 text-center">
                                        <button @click.stop="togglePlayerForComparison(player)"
                                            class="text-indigo-600 hover:text-indigo-900 text-xs font-medium"
                                            :title="isPlayerSelectedForComparison(player) ? 'Remove from comparison' : 'Add to comparison'">
                                            {{ isPlayerSelectedForComparison(player) ? 'Remove' : 'Compare' }}
                                        </button>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import jsonData from '@/data/vlr_gvg_event_data.json'
import { graphic, getInstanceByDom } from 'echarts/core'
import * as echarts from 'echarts/core'
import { TimelineComponent } from 'echarts/components';
import CountUp from 'vue-countup-v3'; 

echarts.use([TimelineComponent]);

// --- Reactive State ---
const rawPlayerData = ref([])
const playerData = ref([])
const searchTerm = ref('')
const sortField = ref('dynamicTotalRank')
const sortDirection = ref('asc')
const page = ref(1)
const itemsPerPage = ref(20)
const activeRoleFilters = ref(['all'])
const activeCastleFilters = ref(['all'])
const activePowerFilters = ref(['all'])
const lowScoreFilter = ref(false)
const activeDayFilters = ref([])
const summaryView = ref(true)
const comparisonView = ref(false)
const selectedComparisonPlayers = ref([])
const maxComparisonPlayers = 10
const averagePlayer = ref(null)
const guildName = ref('Unknown Guild')
const eventName = ref('Unknown Event')
const comparisonSearchTerm = ref('')
const cardObserverEl = ref(null);
const isMobile = ref(false)
const comparisonFields = [
  { key: 'Power',          label: 'Power',       fmt: v => `${v.toFixed(2)}M` },
  { key: 'Castle',         label: 'Castle',      fmt: v => v },
  { key: 'Role',           label: 'Role',        fmt: v => v },
  { key: 'Total Score',    label: 'Total Score', fmt: v => v.toLocaleString() },
  { key: 'Total Rank',     label: 'Total Rank',  fmt: v => v || '-' },
  { key: 'scorePerPower',  label: 'Score Per Power', fmt: v => v.toLocaleString(undefined,{maximumFractionDigits:2}) }
]

// --- Constants ---
const ALL_DAYS = [1, 2, 3, 4, 5, 6]
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

const playerColorMap = computed(() => {
  const map = {}
  selectedComparisonPlayers.value.forEach((p, i) => {
    map[p.Player] = comparisonColours[i % comparisonColours.length]
  })
  return map
})

// quick helper → returns an RGBA with ~8 % alpha for the bg wash
const washed = hex => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},0.08)`
}

const getComparisonChart = () => {
  const dom = document.getElementById('playerComparisonDailyChart')
  return dom ? getInstanceByDom(dom) : null
}

const highlightSeries = name => {
  const chart = getComparisonChart()
  if (!chart) return
  // downplay everything first so we get a clean emphasis
  chart.dispatchAction({ type: 'downplay', seriesIndex: 'all' })
  chart.dispatchAction({ type: 'highlight', seriesName: name })
}

const downplaySeries = () => {
  const chart = getComparisonChart();
  if (chart) chart.dispatchAction({ type: 'downplay', seriesIndex: 'all' });
};

// --- Data normalization ---
function normalizePlayerData(data) {
    const days = ALL_DAYS
    return data.map(p => {
        const power = parseFloat(String(p.Power).replace('M', '')) || 0
        const castle = Number(p.Castle) || 0
        const total = days.reduce((sum, d) => sum + (Number(p[`Score (D${d})`]) || 0), 0)
        return {
            ...p,
            Power: power,
            Castle: castle,
            'Total Score': total,
            'Total Rank': 0,
            scorePerPower: power > 0 ? total / power : 0,
            ...days.reduce((acc, d) => ({
                ...acc,
                [`Score (D${d})`]: Number(p[`Score (D${d})`]) || 0,
                [`Event Rank (D${d})`]: Number(p[`Event Rank (D${d})`]) || 0
            }), {})
        }
    }).sort((a, b) => b['Total Score'] - a['Total Score'])
        .map((p, i) => ({ ...p, 'Total Rank': i + 1 }))
}

const totalScoreOverall = computed(() => {
  return ALL_DAYS.reduce(
    (sum, d) => sum + playerData.value.reduce(
      (inner, p) => inner + (p[`Score (D${d})`] || 0), 0
    ), 0
  );
});

// --- Average player calculation ---
const calculateAveragePlayer = () => {
    const active = playerData.value.filter(p => p['Total Score'] > 0)
    if (!active.length) return averagePlayer.value = null
    const avg = field => active.reduce((sum, p) => sum + (Number(p[field]) || 0), 0) / active.length
    const avgP = {
        Player: 'Average Player',
        Power: Number(avg('Power').toFixed(2)),
        Castle: Math.round(avg('Castle')),
        Role: 'N/A',
        'Total Score': Math.round(avg('Total Score')),
        'Total Rank': 0,
        scorePerPower: Number(avg('scorePerPower').toFixed(2)),
        ...ALL_DAYS.reduce((acc, d) => ({
            ...acc,
            [`Score (D${d})`]: Math.round(avg(`Score (D${d})`)),
            [`Event Rank (D${d})`]: 0
        }), {})
    }
    averagePlayer.value = avgP
}

// --- Computeds for filters, paging, stats ---
const dayHasData = computed(() => ALL_DAYS.reduce((acc, d) => ({ ...acc, [d]: playerData.value.some(p => p[`Score (D${d})`] > 0) }), {}))
const daysWithData = computed(() => ALL_DAYS.filter(d => dayHasData.value[d]))
const allDays = computed(() => ALL_DAYS)
const totalParticipants = computed(() => playerData.value.length)
const activeParticipants = computed(() => playerData.value.filter(p => p['Total Score'] > 0).length)
const averagePower = computed(() => {
    const act = playerData.value.filter(p => p['Total Score'] > 0)
    return act.length ? (act.reduce((s, p) => s + p.Power, 0) / act.length).toFixed(1) : '0.0'
})
const averageCastleLevel = computed(() => {
    const act = playerData.value.filter(p => p['Total Score'] > 0)
    return act.length ? Math.round(act.reduce((s, p) => s + p.Castle, 0) / act.length) : 0
})
const topPlayers = computed(() => [...playerData.value].filter(p => p['Total Score'] > 0).sort((a, b) => b['Total Score'] - a['Total Score']).slice(0, 10))
const efficiencyLeaders = computed(() => [...playerData.value].filter(p => p['Total Score'] > 0 && p.Power > 0).sort((a, b) => b.scorePerPower - a.scorePerPower).slice(0, 10))
const comparisonCards = computed(() => selectedComparisonPlayers.value.slice(0, maxComparisonPlayers))

const handleComparisonSearchKeydown = e => {
  if (e.key === 'Tab' && filteredComparisonSearchResults.value.length) {
    e.preventDefault()
    addPlayerToComparisonFromSearch(filteredComparisonSearchResults.value[0])
  }
}

const filteredData = computed(() => {
    let result = playerData.value;

    // Search Term
    if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        result = result.filter(p => p.Player.toLowerCase().includes(term));
    }

    // Role Filter
    if (!activeRoleFilters.value.includes('all')) {
        result = result.filter(p => activeRoleFilters.value.includes(p.Role));
    }

    // Castle Filter
    if (!activeCastleFilters.value.includes('all')) {
        result = result.filter(p => {
            const level = p.Castle;
            return activeCastleFilters.value.some(filter => {
                if (filter === '30-35') return level >= 30 && level <= 35;
                if (filter === '36-40') return level >= 36 && level <= 40;
                if (filter === '41-45') return level >= 41 && level <= 45;
                if (filter === '46-50') return level >= 46 && level <= 50;
                if (filter === '51+') return level >= 51;
                return false;
            });
        });
    }

    // Power Filter
    if (!activePowerFilters.value.includes('all')) {
        result = result.filter(p => {
            const power = p.Power;
            return activePowerFilters.value.some(filter => {
                if (filter === '0-25M') return power >= 0 && power < 25;
                if (filter === '25-50M') return power >= 25 && power < 50;
                if (filter === '50-75M') return power >= 50 && power < 75;
                if (filter === '75-100M') return power >= 75 && power < 100;
                if (filter === '100M+') return power >= 100;
                return false;
            });
        });
    }

    // Low Score Filter
    if (lowScoreFilter.value) {
        const daysToCheck = activeDayFilters.value.length > 0
            ? activeDayFilters.value.map(Number)
            : daysWithData.value;

        result = result.filter(player => {
            return daysToCheck.some(day => {
                const score = Number(player[`Score (D${day})`]) || 0;
                return score < 1000000;
            });
        });
    }

    return result;
});

const processedFilteredData = computed(() => {
    const daysToSum = activeDayFilters.value.length > 0 ? activeDayFilters.value : allDays.value;

    const enriched = filteredData.value.map(player => {
        const dynamicTotalScore = daysToSum.reduce((sum, day) => {
            return sum + (Number(player[`Score (D${day})`]) || 0);
        }, 0);
        const scorePerPower = player.Power > 0 ? dynamicTotalScore / player.Power : 0;

        return {
            ...player,
            dynamicTotalScore,
            scorePerPower,
            dynamicTotalRank: 0
        };
    });

    enriched.sort((a, b) => b.dynamicTotalScore - a.dynamicTotalScore);
    enriched.forEach((player, index) => {
        player.dynamicTotalRank = index + 1;
    });

    return enriched;
});

const filteredAndSortedData = computed(() => {
    let result = [...processedFilteredData.value];

    if (sortField.value) {
        result.sort((a, b) => {
            let valA = a[sortField.value];
            let valB = b[sortField.value];

            if (sortField.value === 'dynamicTotalRank') {
                valA = Number(a.dynamicTotalRank) || Infinity;
                valB = Number(b.dynamicTotalRank) || Infinity;
                return sortDirection.value === 'asc' ? valA - valB : valB - valA;
            }
            else if (sortField.value === 'Player' || sortField.value === 'Role') {
                valA = String(valA || '');
                valB = String(valB || '');
                return sortDirection.value === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            else {
                valA = Number(valA) || 0;
                valB = Number(valB) || 0;
                return sortDirection.value === 'asc' ? valA - valB : valB - valA;
            }
        });
    }
    return result;
});

const filteredComparisonSearchResults = computed(() => {
  const term = comparisonSearchTerm.value.toLowerCase().trim()
  if (!term) return []
  const pool = [...processedFilteredData.value]
  if (averagePlayer.value) pool.push(averagePlayer.value)
  return pool.filter(p =>
    p.Player.toLowerCase().includes(term) &&
    !selectedComparisonPlayers.value.some(sel => sel.Player === p.Player)
  )
})

const addPlayerToComparisonFromSearch = (player) => {
  if (selectedComparisonPlayers.value.length >= maxComparisonPlayers) {
    alert(`Max ${maxComparisonPlayers} players allowed.`)
    return
  }
  selectedComparisonPlayers.value.push(player)
  comparisonSearchTerm.value = ''
}

const paginatedData = computed(() => {
    const start = (page.value - 1) * Number(itemsPerPage.value);
    const end = start + Number(itemsPerPage.value);

    return filteredAndSortedData.value.slice(start, end);
});

const totalPages = computed(() => {
    const items = Number(itemsPerPage.value) || 20;

    return Math.ceil(filteredAndSortedData.value.length / items);
});


const formatNumber = (num, decimals = 0) => {
    const number = Number(num);
    if (isNaN(number)) return '-';
    return number.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

const getCurrentDate = () => new Date().toISOString().split('T')[0];

const toggleSortDirection = () => {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    page.value = 1;
};

const updateSort = (field) => {
    if (sortField.value === field) {
        toggleSortDirection();
    } else {
        sortField.value = field;
        const ascFields = ['Total Rank', 'Player', 'Role', 'Castle'];
        sortDirection.value = ascFields.includes(field) ? 'asc' : 'desc';
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
            if (filters.length === 0) activeFiltersRef.value = ['all'];
        } else {
            const allIndex = filters.indexOf('all');
            if (allIndex > -1) filters.splice(allIndex, 1);
            filters.push(filterValue);
        }
    }
    page.value = 1;
};

const toggleRoleFilter = (role) => toggleFilter(role, activeRoleFilters);
const toggleCastleFilter = (level) => toggleFilter(level, activeCastleFilters);
const togglePowerFilter = (power) => toggleFilter(power, activePowerFilters);

const toggleLowScoreFilter = () => {
    lowScoreFilter.value = !lowScoreFilter.value;
    page.value = 1;
};

const toggleDayFilter = (day) => {
    if (day === 'all') {
        activeDayFilters.value = [];
    } else {
        const index = activeDayFilters.value.indexOf(day);
        if (index > -1) {
            activeDayFilters.value.splice(index, 1);
        } else {
            activeDayFilters.value.push(day);
            activeDayFilters.value.sort((a, b) => a - b);
        }
    }
    page.value = 1;
};


const toggleSummaryView = () => {
    summaryView.value = !summaryView.value;
    if (summaryView.value) {
        comparisonView.value = false;
        destroyChart('playerComparisonDailyChart');
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
        destroyChart('playerComparisonDailyChart');
        selectedComparisonPlayers.value = [];
    }
};

const isPlayerSelectedForComparison = (player) => {
    return selectedComparisonPlayers.value.some(p => p.Player === player.Player);
};

const togglePlayerForComparison = player => {
  const idx = selectedComparisonPlayers.value.findIndex(p => p.Player === player.Player)
  const wasRemoval = idx > -1

  if (wasRemoval) {
    selectedComparisonPlayers.value.splice(idx, 1)
  } else {
    if (selectedComparisonPlayers.value.length >= maxComparisonPlayers) {
      alert(`You can select max ${maxComparisonPlayers} players.`)
      return
    }
    selectedComparisonPlayers.value.push(player)
  }

  // Auto‑add average ONLY when → adding first real player ***and*** avg not already present
  const realCount = selectedComparisonPlayers.value.filter(p => p.Player !== 'Average Player').length
  const avgPresent = selectedComparisonPlayers.value.some(p => p.Player === 'Average Player')
  if (!wasRemoval && realCount === 1 && !avgPresent && averagePlayer.value) {
    selectedComparisonPlayers.value.push(averagePlayer.value)
  }

  // Make sure correct pane is showing
  if (selectedComparisonPlayers.value.length === 0) {
    comparisonView.value = false
  } else {
    comparisonView.value = true
    summaryView.value = false
  }
}

// --- Chart options (vue-echarts) ---
// --- Avg Score by Role ---
const roleChartOption = computed(() => {
  const orderedRoles = ['R1', 'R2', 'R3', 'R4', 'R5'];
  const roleScoresMap = {};
  for (const role of orderedRoles) {
    roleScoresMap[role] = { total: 0, count: 0 };
  }
  playerData.value.forEach(player => {
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
            ? (v/1e6).toFixed(1) + 'M'
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
            ? (v/1e6).toFixed(1) + 'M'
            : v.toLocaleString()
        },
        splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
      },
      series: [{
        type: 'bar',
        data: avgScores,
        barWidth: '50%',
        itemStyle: {
          borderRadius: [6,6,0,0],
          color: ({ dataIndex }) => {
            const role = orderedRoles[dataIndex];
            const [from, to] = roleColorsGradient[role];
            return new graphic.LinearGradient(0,0,0,1, [
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
              ? (val/1e6).toFixed(1) + 'M'
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
  const grouped = { R1:[], R2:[], R3:[], R4:[], R5:[] };
  const pts = [];
  playerData.value.forEach(p => {
    if (p['Total Score'] > 0 && grouped[p.Role]) {
      const x = p.Power, y = p['Total Score'];
      grouped[p.Role].push({ value: [x,y], player: p.Player });
      pts.push([x,y]);
    }
  });
  const n = pts.length;
  const sumX  = pts.reduce((s,[x])=>s+x,0);
  const sumY  = pts.reduce((s,[,y])=>s+y,0);
  const sumXY = pts.reduce((s,[x,y])=>s+x*y,0);
  const sumX2 = pts.reduce((s,[x])=>s+x*x,0);
  const slope = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX);
  const intercept = (sumY - slope*sumX)/n;
  const minX = Math.min(...pts.map(p=>p[0]));
  const maxX = Math.max(...pts.map(p=>p[0]));
  const line = [
    [minX, slope*minX + intercept],
    [maxX, slope*maxX + intercept]
  ];

  const base = {
    title: { text: 'Power vs Score', left: 'center', textStyle: { fontSize:18, fontWeight:'bold' } },
    legend: { top:30, data: Object.keys(grouped), selectedMode:'multiple', textStyle:{ fontWeight:'bold' } },
    tooltip: {
      formatter: param => {
        const [power, score] = param.data.value;
        const name = param.data.player || 'Unknown';
        const fmtScore = score >= 1e6
          ? (score/1e6).toFixed(1)+'M'
          : score.toLocaleString();
        return `<strong>${name}</strong><br/>Power: ${power}M<br/>Score: ${fmtScore}`;
      }
    },
    grid: { top:80, bottom:60, left:'10%', right:'10%' },
    xAxis: {
      name: '',
      type: 'value',
      splitLine:{ lineStyle:{ type:'dashed', color:'#eee' } },
    },
    yAxis: {
      name: '',
      type: 'value',
      min: 0,
      splitLine:{ lineStyle:{ type:'dashed', color:'#eee' } },
    },
    series: [
      ...Object.entries(grouped).map(([role,data])=>({
        name: role,
        type: 'scatter',
        data,
        symbolSize: val => {
          const s = val.value?.[1] || 0;
          return s >= 1e7 ? 20 : s >= 1e6 ? 16 : 12;
        },
        hoverAnimation: false,
        itemStyle: { color: roleColorsStatic[role], opacity:0.85, borderColor:'#fff', borderWidth:1 },
        emphasis: { focus:'series', itemStyle:{ borderColor:'#000', borderWidth:2 } }
      })),
      {
        name: 'Trendline',
        type: 'line',
        data: line,
        symbol: 'none',
        lineStyle: { type:'dashed', width:2, color:'#6366f1' },
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
        grid: { top:60, bottom:50, left:'5%', right:'5%' }
      }
    }]
  };
});


// --- Daily Performance (Top 5) ---
const dailyOption = computed(() => {
  const top5 = topPlayers.value
    .filter(p => allDays.value.some(d => p[`Score (D${d})`] > 0))
    .slice(0,5);
  const dayLabels = allDays.value.map(d => dayTasks[`D${d}`]);

  return {
    baseOption: {
      title: { text: 'Daily Performance (Top 5)', left:'center', textStyle:{ fontSize:18, fontWeight:'bold' } },
      tooltip: {
        trigger:'axis',
        backgroundColor:'rgba(50,50,50,0.9)',
        borderColor:'#888',
        borderWidth:1,
        textStyle:{ color:'#fff' },
        axisPointer:{ type:'line', lineStyle:{ color:'#bbb', type:'dashed' } }
      },
      grid: { top:70, bottom:60, left:'10%', right:'10%' },
      xAxis: {
        type:'category',
        data: dayLabels,
        axisLine:{ lineStyle:{ color:'#ccc' } },
        axisLabel:{ fontWeight:'bold', color:'#333', interval:0 },
        axisTick:{ alignWithLabel:true }
      },
      yAxis: {
        type:'value',
        axisLabel:{ formatter: v => v>=1e6 ? (v/1e6).toFixed(1)+'M' : v.toLocaleString(), color:'#333' },
        splitLine:{ lineStyle:{ type:'dashed', color:'#eee' } }
      },
      legend: {
        data: top5.map(p=>p.Player),
        orient:'horizontal',
        bottom:0,
        textStyle:{ fontWeight:'bold', color:'#333' }
      },
      series: top5.map((p,i)=> {
        const [start,end] = playerGradients[i % playerGradients.length];
        return {
          name: p.Player,
          type: 'line',
          smooth: 0.3,
          symbol: 'circle',
          symbolSize: 6,
          hoverAnimation: false,
          lineStyle: {
            width:3,
            color: new graphic.LinearGradient(0,0,0,1, [
              { offset:0, color:start },
              { offset:1, color:end }
            ])
          },
          itemStyle: { color:end, borderWidth:1, borderColor:'#fff' },
          emphasis: { focus:'series', lineStyle:{ width:4 }, itemStyle:{ borderWidth:2, borderColor:'#000' } },
          data: allDays.value.map(d=>p[`Score (D${d})`])
        };
      }),
      animation:true,
      animationDuration:800,
      animationEasing:'cubicOut'
    },
    media: [{
      query:{ maxWidth:600 },
      option:{
        grid:{ top:50, bottom:50, left:'5%', right:'5%' }
      }
    }]
  };
});


// --- Castle Level vs Avg Score ---
const castleScoreChartOption = computed(() => {
  const castleMap = new Map();
  playerData.value.forEach(p => {
    const c = p.Castle;
    if (!castleMap.has(c)) castleMap.set(c,{ total:0, count:0 });
    castleMap.get(c).total += p['Total Score'];
    castleMap.get(c).count += 1;
  });
  const entries = [...castleMap.entries()].sort((a,b)=>a[0]-b[0]);
  const xData = entries.map(([castle]) => castle);
  const yData = entries.map(([_,v]) =>
    v.count>0 ? Math.round(v.total/v.count) : 0
  );

  return {
    baseOption: {
      title: { text:'Castle Level vs Avg Score', left:'center', textStyle:{ fontSize:18, fontWeight:'bold' } },
      tooltip: {
        trigger:'axis',
        formatter: p => `Castle ${p[0].axisValue}<br/>Avg Score: ${p[0].value.toLocaleString()}`
      },
      grid:{ top:70, bottom:60, left:'10%', right:'10%' },
      xAxis:{ type:'category', data: xData, axisLabel:{ fontWeight:'bold' } },
      yAxis:{
        type:'value',
        axisLabel:{ formatter: v => v>=1e6 ? (v/1e6).toFixed(1)+'M' : v.toLocaleString() },
        splitLine:{ lineStyle:{ type:'dashed', color:'#eee' } }
      },
      series:[{
        type:'line',
        data: yData,
        areaStyle:{ opacity:0.3 },
        smooth:true,
        symbol:'circle',
        itemStyle:{ color:'#6366f1' },
        lineStyle:{ color:'#6366f1', width:3 }
      }]
    },
    media:[{
      query:{ maxWidth:600 },
      option:{ grid:{ top:50, bottom:50, left:'5%', right:'5%' } }
    }]
  };
});


// --- Total Score by Day (Donut) ---
const totalScoreByDayPieOption = computed(() => {
  const labels = allDays.value.map(d => dayTasks[`D${d}`]);
  const pieData = labels.map((label,idx) => {
    const dayKey = `Score (D${idx+1})`;
    const total = playerData.value.reduce((s,p)=>s + (p[dayKey]||0), 0);
    return { name: label, value: total };
  });

  return {
    baseOption: {
      title: { text:'Total Score by Day', left:'center', textStyle:{ fontSize:18, fontWeight:'bold' } },
      tooltip: { trigger:'item', formatter:'{b}<br/>Score: {c} ({d}%)' },
      legend: { orient:'horizontal', top:40, left:'center' },
      series:[{
        type:'pie',
        radius:['45%','70%'],
        center:['50%','60%'],
        data: pieData,
        label:{ formatter:'{b}: {d}%', fontWeight:'bold' },
        emphasis:{ itemStyle:{ shadowBlur:10, shadowOffsetX:0, shadowColor:'rgba(0,0,0,0.2)' } }
      }]
    },
    media:[{
      query:{ maxWidth:600 },
      option:{ series:[{ radius:['40%','65%'] }], grid:{ left:'5%', right:'5%' } }
    }]
  };
});


// --- Daily Performance Comparison ---
const comparisonDailyOption = computed(() => {
  if (!selectedComparisonPlayers.value.length) return {};
  const dayLabels = allDays.value.map(d => dayTasks[`D${d}`]);

  return {
    baseOption: {
      title:{ text:'Daily Performance Comparison', left:'center', textStyle:{ fontSize:18, fontWeight:'bold' } },
      tooltip:{
        trigger:'axis',
        backgroundColor:'rgba(50,50,50,0.9)',
        borderColor:'#888',
        borderWidth:1,
        textStyle:{ color:'#fff' },
        axisPointer:{ type:'line', lineStyle:{ color:'#bbb', type:'dashed' } }
      },
      grid:{ top:70, bottom:60, left:'10%', right:'10%' },
      xAxis:{
        type:'category',
        data: dayLabels,
        axisLine:{ lineStyle:{ color:'#ccc' } },
        axisLabel:{ fontWeight:'bold', color:'#333', interval:0 },
        axisTick:{ alignWithLabel:true }
      },
      yAxis:{
        type:'value',
        axisLabel:{ formatter:v=>v>=1e6 ? (v/1e6).toFixed(1)+'M' : v.toLocaleString(), color:'#333' },
        splitLine:{ lineStyle:{ type:'dashed', color:'#eee' } }
      },
      legend:{
        data: selectedComparisonPlayers.value.map(p=>p.Player),
        orient:'horizontal',
        bottom:0,
        textStyle:{ fontWeight:'bold', color:'#333' }
      },
      series: selectedComparisonPlayers.value.map((player,i)=>{
        const color = comparisonColours[i % comparisonColours.length];
        return {
          name: player.Player,
          type:'line',
          smooth:0.3,
          symbol:'circle',
          symbolSize:6,
          hoverAnimation:false,
          lineStyle:{ width:3, color },
          itemStyle:{ color, borderWidth:1, borderColor:'#fff' },
          emphasis:{ focus:'series', lineStyle:{ width:4 }, itemStyle:{ borderWidth:2, borderColor:'#000' } },
          data: allDays.value.map(d=>player[`Score (D${d})`])
        };
      }),
      animation:true,
      animationDuration:800,
      animationEasing:'cubicOut'
    },
    media:[{
      query:{ maxWidth:600 },
      option:{ grid:{ top:50, bottom:50, left:'5%', right:'5%' } }
    }]
  };
});


// --- Lifecycle & watchers ---
onMounted(() => {
  const eventMeta = jsonData[0] || {}
  rawPlayerData.value = eventMeta.Players || []
  playerData.value = normalizePlayerData(rawPlayerData.value)
  calculateAveragePlayer()

  // Set event metadata
  guildName.value = eventMeta['Guild Short'] || eventMeta['Guild'] || 'Unknown Guild'
  eventName.value = eventMeta['Event Short'] || eventMeta['Event'] || 'Unknown Event'

  const updateMobile = () => {
    isMobile.value = window.innerWidth < 640
  }

  updateMobile()
  window.addEventListener('resize', updateMobile)
});

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
.chart-container {
    position: relative;
    height: 350px;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
}

[v-cloak] {
    display: none;
}

.filter-pill {
    transition: all 0.2s ease;
    cursor: pointer;
}

.filter-pill:hover:not(:disabled) {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
}

.filter-active {
    background-color: #4f46e5;
    color: white;
    border-color: #4f46e5;
}

.filter-pill:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f3f4f6;
    color: #9ca3af;
    border-color: #d1d5db;
}

.data-table th {
    position: sticky;
    top: 0;
    background-color: #f9fafb;
    z-index: 10;
    border-bottom: 2px solid #e5e7eb;
}

.data-table th::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f9fafb;
    z-index: -1;
}

.comparison-item {
    transition: background-color 0.2s ease;
}

.comparison-item:hover {
    background-color: #f3f4f6;
}

.animate-hue {
  animation: hue 6s linear infinite;
  display: inline-block;      /* needed for filter */
}

@keyframes gradientShift {
  0%   { background-position:   0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position:   0% 50%; }
}

.animate-score-gradient {
  background: linear-gradient(90deg,
    #34d399,
    #60a5fa,
    #f472b6,
    #facc15,
    #a78bfa,
    #34d399);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 8s linear infinite;
}

</style>
