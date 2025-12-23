<template>
    <div class="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 p-3 py-0 sm:p-6 md:py-16">
        <div class="max-w-[1920px] mx-auto">
            <!-- Header -->
            <div class="text-center mb-6 sm:mb-8">
                <h1
                    class="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                    Formula & Ranking Calculator
                </h1>
                <p class="text-lime-200/80 text-sm sm:text-lg">Configure weights and compute guild rankings</p>
            </div>

            <!-- Dataset Selector -->
            <div
                class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30 mb-6 hover:border-lime-400/50 transition-all duration-300">
                <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4 justify-between">
                    <div class="flex items-center gap-2 w-full lg:w-auto">
                        <Database class="w-5 h-5 text-lime-400 flex-shrink-0" />
                        <h2 class="text-lg sm:text-xl font-bold text-lime-300">Dataset Selection</h2>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <Select v-model="selectedDatasetId" @update:modelValue="loadDataset">
                            <SelectTrigger
                                class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400 flex-1 sm:flex-none sm:w-64">
                                <SelectValue placeholder="Select dataset..." />
                            </SelectTrigger>
                            <SelectContent class="bg-green-800 border-lime-500 text-lime-100">
                                <SelectItem v-for="dataset in availableDatasets" :key="dataset.id" :value="dataset.id">
                                    {{ dataset.id }}
                                    <span v-if="dataset.updatedAt" class="text-xs text-lime-300/60 ml-2">
                                        ({{ formatDate(dataset.updatedAt) }})
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <div class="flex gap-2">
                            <Button @click="loadDataset(selectedDatasetId)" :disabled="!selectedDatasetId || isLoading"
                                size="sm"
                                class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg transition-all flex-1 sm:flex-none">
                                <RefreshCw class="w-4 h-4 mr-1" />
                                Reload
                            </Button>

                            <Button @click="refreshDatasets" :disabled="isLoading" size="sm" variant="outline"
                                class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20 hover:border-lime-400">
                                <RefreshCw class="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <!-- Dataset Info -->
                <div v-if="loadedDataset" class="mt-4 pt-4 border-t border-lime-500/20">
                    <div class="flex flex-wrap gap-4 text-sm">
                        <div class="flex items-center gap-1">
                            <Users class="w-4 h-4 text-lime-400" />
                            <span class="text-lime-200">{{ guilds.length }} guilds</span>
                        </div>
                        <div v-if="loadedMetadata?.kvkGlobalSettings?.opponentServer" class="flex items-center gap-1">
                            <Globe class="w-4 h-4 text-purple-400" />
                            <span class="text-lime-200">vs {{ loadedMetadata.kvkGlobalSettings.opponentServer }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <Calendar class="w-4 h-4 text-lime-400" />
                            <span class="text-lime-200">Updated {{ formatDate(loadedDataset.updatedAt) }}</span>
                        </div>
                    </div>
                    
                    <!-- Input Mode Indicators -->
                    <div class="mt-3 flex flex-wrap gap-2">
                        <div v-if="loadedMetadata?.gvgInputMode" 
                            class="px-2 py-1 bg-lime-500/20 border border-lime-400/40 rounded text-xs text-lime-200">
                            <span class="font-semibold">GvG Input:</span> 
                            <span v-if="loadedMetadata.gvgInputMode === 'simple'">Win/Loss Only</span>
                            <span v-else-if="loadedMetadata.gvgInputMode === 'total'">Total Score</span>
                            <span v-else>Daily Scores</span>
                        </div>
                        <div v-if="loadedMetadata?.kvkInputMode" 
                            class="px-2 py-1 bg-purple-500/20 border border-purple-400/40 rounded text-xs text-purple-200">
                            <span class="font-semibold">KvK Input:</span> 
                            <span v-if="loadedMetadata.kvkInputMode === 'total'">Total Score</span>
                            <span v-else>Daily Scores & Ranks</span>
                        </div>
                    </div>
                </div>

                <!-- Status Messages -->
                <div v-if="statusMessage" :class="[
                    'mt-3 p-3 rounded-lg border-2 flex items-center gap-2 text-sm',
                    statusType === 'error' ? 'bg-red-500/20 border-red-400 text-red-200' :
                        statusType === 'success' ? 'bg-lime-500/20 border-lime-400 text-lime-200' :
                            'bg-blue-500/20 border-blue-400 text-blue-200'
                ]">
                    <AlertCircle v-if="statusType === 'error'" class="w-4 h-4 flex-shrink-0" />
                    <CheckCircle v-if="statusType === 'success'" class="w-4 h-4 flex-shrink-0" />
                    <span>{{ statusMessage }}</span>
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 mb-6">
                <!-- Weight Configuration Panel -->
                <div class="xl:col-span-4 2xl:col-span-3">
                    <div
                        class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30 hover:border-lime-400/50 transition-all duration-300 sticky top-4">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-2">
                                <Settings class="w-5 h-5 text-lime-400" />
                                <h2 class="text-lg sm:text-xl font-bold text-lime-300">Weights</h2>
                            </div>
                            <Button @click="resetWeights" size="sm" variant="outline"
                                class="text-amber-400 bg-amber-600/20 border-amber-400/50 hover:bg-amber-500/20 hover:border-amber-400 transition-all">
                                <RotateCcw class="w-4 h-4 mr-1" />
                                Reset
                            </Button>
                        </div>

                        <div class="space-y-3 sm:space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            <!-- GvG Win Weight -->
                            <div
                                class="bg-gradient-to-br from-green-800/60 to-teal-800/60 rounded-xl p-3 sm:p-4 border-2 border-lime-500/30 hover:border-lime-400/50 transition-all duration-300 shadow-lg">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center gap-2">
                                        <Checkbox v-model:checked="weights.gvgWin.enabled" />
                                        <label class="text-lime-200 font-semibold text-sm sm:text-base">GvG Win
                                            Record</label>
                                    </div>
                                    <Sword class="w-4 h-4 text-lime-400 flex-shrink-0" />
                                </div>
                                <div v-if="weights.gvgWin.enabled" class="space-y-2">
                                    <label class="text-xs sm:text-sm text-lime-300/80">Weight (%)</label>
                                    <Input v-model.number="weights.gvgWin.weight" type="number" min="0" max="100"
                                        step="1"
                                        class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400" />
                                    <p class="text-xs text-lime-300/60">Win if 8+ points (Days 1-5: 2pts, Day 6: 4pts)</p>
                                </div>
                            </div>

                            <!-- GvG Score Weight -->
                            <div
                                class="bg-gradient-to-br from-green-800/60 to-teal-800/60 rounded-xl p-3 sm:p-4 border-2 border-lime-500/30 hover:border-lime-400/50 transition-all duration-300 shadow-lg">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center gap-2">
                                        <Checkbox v-model:checked="weights.gvgScore.enabled" />
                                        <label class="text-lime-200 font-semibold text-sm sm:text-base">GvG Total
                                            Score</label>
                                    </div>
                                    <Target class="w-4 h-4 text-lime-400 flex-shrink-0" />
                                </div>
                                <div v-if="weights.gvgScore.enabled" class="space-y-2">
                                    <label class="text-xs sm:text-sm text-lime-300/80">Weight (%)</label>
                                    <Input v-model.number="weights.gvgScore.weight" type="number" min="0" max="100"
                                        step="1"
                                        class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400" />
                                    <p class="text-xs text-lime-300/60">Sum of all 6 days</p>
                                </div>
                            </div>

                            <!-- Guild Power Weight -->
                            <div
                                class="bg-gradient-to-br from-green-800/60 to-teal-800/60 rounded-xl p-3 sm:p-4 border-2 border-lime-500/30 hover:border-lime-400/50 transition-all duration-300 shadow-lg">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center gap-2">
                                        <Checkbox v-model:checked="weights.guildPower.enabled" />
                                        <label class="text-lime-200 font-semibold text-sm sm:text-base">Guild
                                            Power</label>
                                    </div>
                                    <Zap class="w-4 h-4 text-lime-400 flex-shrink-0" />
                                </div>
                                <div v-if="weights.guildPower.enabled" class="space-y-2">
                                    <label class="text-xs sm:text-sm text-lime-300/80">Weight (%)</label>
                                    <Input v-model.number="weights.guildPower.weight" type="number" min="0" max="100"
                                        step="1"
                                        class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400" />
                                    <p class="text-xs text-lime-300/60">Normalized by max</p>
                                </div>
                            </div>

                            <!-- KvK Prep Weight -->
                            <div
                                class="bg-gradient-to-br from-green-800/60 to-teal-800/60 rounded-xl p-3 sm:p-4 border-2 border-lime-500/30 hover:border-lime-400/50 transition-all duration-300 shadow-lg">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center gap-2">
                                        <Checkbox v-model:checked="weights.kvkPrep.enabled" />
                                        <label class="text-lime-200 font-semibold text-sm sm:text-base">KvK Prep (Days
                                            1-5)</label>
                                    </div>
                                    <Calendar class="w-4 h-4 text-lime-400 flex-shrink-0" />
                                </div>
                                <div v-if="weights.kvkPrep.enabled" class="space-y-3">
                                    <div class="space-y-2">
                                        <label class="text-xs sm:text-sm text-lime-300/80">Weight (%)</label>
                                        <Input v-model.number="weights.kvkPrep.weight" type="number" min="0" max="100"
                                            step="1"
                                            class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400" />
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-xs sm:text-sm text-lime-300/80">Mode</label>
                                        <Select v-model="weights.kvkPrep.mode">
                                            <SelectTrigger class="bg-green-950/70 border-lime-500/40 text-lime-100">
                                                <SelectValue placeholder="Select mode" />
                                            </SelectTrigger>
                                            <SelectContent class="bg-green-800 border-lime-500 text-lime-100">
                                                <SelectItem value="avgRank">Average Rank (Lower = Better)</SelectItem>
                                                <SelectItem value="totalScore">Total Score (Higher = Better)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <p class="text-xs text-lime-300/60">First 5 days only</p>
                                </div>
                            </div>

                            <!-- KvK War Weight -->
                            <div
                                class="bg-gradient-to-br from-green-800/60 to-teal-800/60 rounded-xl p-3 sm:p-4 border-2 border-lime-500/30 hover:border-lime-400/50 transition-all duration-300 shadow-lg">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center gap-2">
                                        <Checkbox v-model:checked="weights.kvkWar.enabled" />
                                        <label class="text-lime-200 font-semibold text-sm sm:text-base">KvK War (Day
                                            6)</label>
                                    </div>
                                    <Trophy class="w-4 h-4 text-lime-400 flex-shrink-0" />
                                </div>
                                <div v-if="weights.kvkWar.enabled" class="space-y-2">
                                    <label class="text-xs sm:text-sm text-lime-300/80">Weight (%)</label>
                                    <Input v-model.number="weights.kvkWar.weight" type="number" min="0" max="100"
                                        step="1"
                                        class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400" />
                                    <div class="space-y-2 mt-2">
                                        <label class="text-xs sm:text-sm text-lime-300/80">Mode</label>
                                        <Select v-model="weights.kvkWar.mode">
                                            <SelectTrigger class="bg-green-950/70 border-lime-500/40 text-lime-100">
                                                <SelectValue placeholder="Select mode" />
                                            </SelectTrigger>
                                            <SelectContent class="bg-green-800 border-lime-500 text-lime-100">
                                                <SelectItem value="rank">Rank (Lower = Better)</SelectItem>
                                                <SelectItem value="score">Score (Higher = Better)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <p class="text-xs text-lime-300/60">Day 6 only</p>
                                </div>
                            </div>

                            <!-- Weight Summary -->
                            <div
                                class="bg-gradient-to-r from-lime-500/20 to-yellow-500/20 rounded-xl p-3 sm:p-4 border-2 border-lime-400/40 shadow-lg">
                                <div class="flex items-center justify-between">
                                    <span class="text-xs sm:text-sm text-lime-200 font-semibold">Total Weight:</span>
                                    <span :class="totalWeight === 100 ? 'text-lime-300' : 'text-amber-300'"
                                        class="font-bold text-base sm:text-lg">
                                        {{ totalWeight }}%
                                    </span>
                                </div>
                                <p v-if="totalWeight !== 100" class="text-xs text-amber-200 mt-1">
                                    ⚠️ Must equal 100%
                                </p>
                            </div>

                            <!-- Mode Compatibility Warnings -->
                            <div v-if="modeCompatibilityWarnings.length > 0" class="space-y-2">
                                <div v-for="(warning, index) in modeCompatibilityWarnings" :key="index"
                                    :class="[
                                        'rounded-xl p-3 border-2 shadow-lg text-xs',
                                        warning.type === 'error' 
                                            ? 'bg-red-500/20 border-red-400/50' 
                                            : 'bg-amber-500/20 border-amber-400/50'
                                    ]">
                                    <div class="flex items-start gap-2">
                                        <AlertCircle :class="warning.type === 'error' ? 'text-red-400' : 'text-amber-400'" 
                                            class="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div :class="warning.type === 'error' ? 'text-red-200' : 'text-amber-200'" 
                                                class="font-semibold">{{ warning.metric }}</div>
                                            <div :class="warning.type === 'error' ? 'text-red-300/90' : 'text-amber-300/90'">
                                                {{ warning.message }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <!-- Save Weights Button -->
                            <Button @click="saveWeights" :disabled="!canSaveWeights"
                                class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
                                <Save class="w-4 h-4 mr-2" />
                                {{ weightsSaved ? 'Saved ✓' : 'Save Weights' }}
                            </Button>

                            <!-- Publish Button - Now requires saved weights -->
                            <Button @click="publishRankings" :disabled="!canPublish"
                                class="w-full bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold">
                                <Upload class="w-4 h-4 mr-2" />
                                {{ weightsSaved ? 'Publish Rankings' : 'Save Weights First' }}
                            </Button>

                            <!-- Copy Link Button -->
                            <Button @click="copyShareLink" :disabled="!selectedDatasetId || !currentVersionId"
                                variant="outline"
                                class="w-full text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20 col-span-1 md:col-span-2">
                                <LinkIcon class="w-4 h-4 mr-2" />
                                Copy Share Link
                            </Button>

                            <!-- Explain Math Button -->
                            <Button @click="toggleExplainMath" variant="outline"
                                class="w-full text-lime-300 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20 col-span-1 md:col-span-2">
                                <Calculator class="w-4 h-4 mr-2" />
                                {{ showExplainMath ? 'Hide' : 'Show' }} Math Breakdown
                            </Button>
                        </div>

                        <!-- Save Reminder -->
                        <p v-if="!weightsSaved && totalWeight === 100" class="text-xs text-amber-300 text-center mt-1">
                            💾 Save weights before publishing
                        </p>
                    </div>
                </div>

                <!-- Rankings Display -->
                <div class="xl:col-span-8 2xl:col-span-9">
                    <div
                        class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30 hover:border-lime-400/50 transition-all duration-300">
                        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                            <div class="flex items-center gap-2">
                                <Trophy class="w-5 h-5 text-lime-400 flex-shrink-0" />
                                <h2 class="text-lg sm:text-xl font-bold text-lime-300">Guild Rankings</h2>
                                <Badge v-if="rankings.length > 0" class="bg-lime-600/80 text-green-950">
                                    {{ rankings.length }} guilds
                                </Badge>
                            </div>

                            <div class="flex gap-2">
                                <Button @click="exportToCSV" :disabled="rankings.length === 0" size="sm"
                                    variant="outline"
                                    class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20 hover:border-lime-400">
                                    <FileDown class="w-4 h-4 mr-1" />
                                    Export CSV
                                </Button>
                                <Button @click="copyForDiscord" :disabled="rankings.length === 0" size="sm"
                                    variant="outline"
                                    class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20 hover:border-lime-400">
                                    <Copy class="w-4 h-4 mr-1" />
                                    Copy for Discord
                                </Button>
                            </div>
                        </div>

                        <!-- Warning if weights don't sum to 100 -->
                        <div v-if="totalWeight !== 100 && guilds.length > 0"
                            class="mb-4 p-3 rounded-lg bg-amber-500/20 border-2 border-amber-400 text-amber-200 text-sm flex items-center gap-2">
                            <AlertCircle class="w-4 h-4 flex-shrink-0" />
                            <span>Rankings cannot be calculated until total weight equals 100%</span>
                        </div>

                        <!-- FIXED: Warning for data format incompatibilities -->
                        <div v-if="loadedMetadata && guilds.length > 0">
                            <!-- GvG Win enabled but data is in total mode -->
                            <div v-if="weights.gvgWin.enabled && loadedMetadata.gvgInputMode === 'total'"
                                class="mb-4 p-3 rounded-lg bg-blue-500/20 border-2 border-blue-400 text-blue-200 text-sm flex items-start gap-2">
                                <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <div>
                                    <div class="font-semibold">GvG Win Record not available</div>
                                    <div class="text-xs mt-1">This dataset uses "Total Score Only" mode which doesn't include win/loss data. Guilds will show "N/A" for GvG Win.</div>
                                </div>
                            </div>
                            
                            <!-- KvK War enabled but data is in total mode -->
                            <div v-if="weights.kvkWar.enabled && loadedMetadata.kvkInputMode === 'total'"
                                class="mb-4 p-3 rounded-lg bg-blue-500/20 border-2 border-blue-400 text-blue-200 text-sm flex items-start gap-2">
                                <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <div>
                                    <div class="font-semibold">KvK War (Day 6) not available</div>
                                    <div class="text-xs mt-1">This dataset uses "Total Score Only" mode for KvK which doesn't include separate Day 6 data. Guilds will show "N/A" for KvK War.</div>
                                </div>
                            </div>
                        </div>

                        <!-- No Data State -->
                        <div v-if="guilds.length === 0" class="text-center py-12 text-lime-300/60">
                            <Database class="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p class="text-lg">No dataset loaded</p>
                            <p class="text-sm mt-2">Select a dataset above to view rankings</p>
                        </div>

                        <!-- Rankings Table -->
                        <div v-else-if="rankings.length > 0" class="overflow-x-auto custom-scrollbar">
                            <table class="w-full">
                                <thead>
                                    <tr class="border-b-2 border-lime-400/30">
                                        <th
                                            class="text-left py-3 px-2 sm:px-4 text-lime-300 font-semibold text-sm sm:text-base">
                                            Rank</th>
                                        <th
                                            class="text-left py-3 px-2 sm:px-4 text-lime-300 font-semibold text-sm sm:text-base">
                                            Guild</th>
                                        <th
                                            class="text-right py-3 px-2 sm:px-4 text-lime-300 font-semibold text-sm sm:text-base">
                                            Total Score
                                        </th>
                                        <th v-if="weights.gvgWin.enabled"
                                            class="text-center py-3 px-2 sm:px-4 text-lime-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                                            GvG Win
                                        </th>
                                        <th v-if="weights.gvgScore.enabled"
                                            class="text-center py-3 px-2 sm:px-4 text-lime-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                                            GvG Score
                                        </th>
                                        <th v-if="weights.guildPower.enabled"
                                            class="text-center py-3 px-2 sm:px-4 text-lime-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                                            Power
                                        </th>
                                        <th v-if="weights.kvkPrep.enabled"
                                            class="text-center py-3 px-2 sm:px-4 text-lime-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                                            KvK Prep
                                        </th>
                                        <th v-if="weights.kvkWar.enabled"
                                            class="text-center py-3 px-2 sm:px-4 text-lime-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                                            KvK War
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(result, index) in rankings" :key="index" :class="[
                                        'border-b border-lime-400/20',
                                        index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20' :
                                            index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-slate-400/20' :
                                                index === 2 ? 'bg-gradient-to-r from-orange-600/20 to-amber-600/20' :
                                                    'hover:bg-lime-500/10'
                                    ]">
                                        <td class="py-3 px-2 sm:px-4">
                                            <div class="flex items-center gap-2">
                                                <span :class="[
                                                    'font-bold text-sm sm:text-base',
                                                    index === 0 ? 'text-yellow-400' :
                                                        index === 1 ? 'text-gray-300' :
                                                            index === 2 ? 'text-orange-400' :
                                                                'text-lime-200'
                                                ]">
                                                    #{{ index + 1 }}
                                                </span>
                                                <Crown v-if="index === 0" class="w-5 h-5 text-yellow-400" />
                                                <Medal v-if="index === 1" class="w-5 h-5 text-gray-300" />
                                                <Award v-if="index === 2" class="w-5 h-5 text-orange-400" />
                                            </div>
                                        </td>
                                        <td class="py-3 px-2 sm:px-4">
                                            <div>
                                                <div class="font-semibold text-lime-100 text-sm sm:text-base">
                                                    {{ result.guild.name || 'Unnamed' }}
                                                </div>
                                                <div v-if="result.guild.shorthand" class="text-xs text-lime-300/60">
                                                    {{ result.guild.shorthand }}
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-3 px-2 sm:px-4 text-right">
                                            <span
                                                class="text-lg sm:text-xl font-bold bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
                                                {{ result.totalScore.toFixed(2) }}
                                            </span>
                                        </td>
                                        <td v-if="weights.gvgWin.enabled" class="py-3 px-2 sm:px-4 text-center">
                                            <div class="space-y-1">
                                                <!-- FIXED: Show N/A when no win/loss data (total mode or no daily data) -->
                                                <div v-if="result.rawData.gvgWins === 0 && result.rawData.gvgLosses === 0 && result.rawData.gvgPoints === 0">
                                                    <span class="text-lime-300/60 text-sm font-medium">N/A</span>
                                                    <div class="text-xs text-lime-300/40 mt-1">No W/L data</div>
                                                </div>
                                                <div v-else>
                                                    <div class="flex items-center justify-center gap-1 flex-wrap">
                                                        <Badge :variant="result.rawData.gvgWon ? 'default' : 'outline'"
                                                            :class="result.rawData.gvgWon ? 'bg-green-600/80 text-white' : 'bg-red-600/80 text-white'">
                                                            {{ result.rawData.gvgWon ? 'Won' : 'Lost' }}
                                                        </Badge>
                                                        <Sparkles v-if="result.rawData.gvgFlawless" 
                                                            class="w-5 h-5 text-yellow-400 animate-pulse" 
                                                            :title="'Flawless Victory! Won all 6 days'" />
                                                        <Shield v-if="result.rawData.invasionStatus === 'can-invade'" 
                                                            class="w-4 h-4 text-green-400" 
                                                            :title="'Defensive Advantage: Won 3+ of first 5 days'" />
                                                        <Sword v-if="result.rawData.invasionStatus === 'can-be-invaded'" 
                                                            class="w-4 h-4 text-red-400" 
                                                            :title="'Invasion Risk: Lost 3+ of first 5 days'" />
                                                    </div>
                                                    <!-- Only show W-L record if we have daily data -->
                                                    <div v-if="result.rawData.gvgWins > 0 || result.rawData.gvgLosses > 0" 
                                                        class="text-xs text-lime-300/70">
                                                        {{ result.rawData.gvgWins }}W-{{ result.rawData.gvgLosses }}L ({{ result.rawData.gvgPoints }} pts)
                                                    </div>
                                                </div>
                                                <div v-if="showExplainMath" class="text-xs text-lime-400 font-mono">
                                                    {{ result.scores.gvgWin.toFixed(1) }}pts
                                                </div>
                                            </div>
                                        </td>
                                        <td v-if="weights.gvgScore.enabled" class="py-3 px-2 sm:px-4 text-center">
                                            <div class="space-y-1">
                                                <span class="text-lime-200 text-sm font-medium">
                                                    {{ formatNumber(result.rawData.gvgTotalScore) }}
                                                </span>
                                                <div v-if="showExplainMath" class="text-xs text-lime-400 font-mono">
                                                    {{ result.scores.gvgScore.toFixed(1) }}pts
                                                </div>
                                            </div>
                                        </td>
                                        <td v-if="weights.guildPower.enabled" class="py-3 px-2 sm:px-4 text-center">
                                            <div class="space-y-1">
                                                <span class="text-lime-200 text-sm font-medium">
                                                    {{ formatNumberShort(result.guild.guildPower) }}
                                                </span>
                                                <div v-if="showExplainMath" class="text-xs text-lime-400 font-mono">
                                                    {{ result.scores.guildPower.toFixed(1) }}pts
                                                </div>
                                            </div>
                                        </td>
                                        <td v-if="weights.kvkPrep.enabled" class="py-3 px-2 sm:px-4 text-center">
                                            <div class="space-y-1">
                                                <span class="text-lime-200 text-sm font-medium">
                                                    {{ formatKvKPrepDisplay(result.rawData) }}
                                                </span>
                                                <div v-if="showExplainMath" class="text-xs text-lime-400 font-mono">
                                                    {{ result.scores.kvkPrep.toFixed(1) }}pts
                                                </div>
                                            </div>
                                        </td>
                                        <td v-if="weights.kvkWar.enabled" class="py-3 px-2 sm:px-4 text-center">
                                            <div class="space-y-1">
                                                <!-- FIXED: Show N/A when no War data -->
                                                <div v-if="!result.rawData.kvkWarRank && !result.rawData.kvkWarScore">
                                                    <span class="text-lime-300/60 text-sm font-medium">N/A</span>
                                                    <div class="text-xs text-lime-300/40 mt-1">No Day 6 data</div>
                                                </div>
                                                <div v-else>
                                                    <span class="text-lime-200 text-sm font-medium">
                                                        {{ formatKvKWarDisplay(result.rawData) }}
                                                    </span>
                                                    <!-- Show additional context - if in rank mode, show score too and vice versa -->
                                                    <div v-if="result.rawData.kvkWarRank && result.rawData.kvkWarScore" class="text-xs text-lime-300/70">
                                                        <span v-if="weights.kvkWar.mode === 'rank'">
                                                            Score: {{ formatNumberShort(result.rawData.kvkWarScore) }}
                                                        </span>
                                                        <span v-else>
                                                            Rank: #{{ result.rawData.kvkWarRank }}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div v-if="showExplainMath" class="text-xs text-lime-400 font-mono">
                                                    {{ result.scores.kvkWar.toFixed(1) }}pts
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Math Explanation Panel -->
                    <div v-if="showExplainMath && rankings.length > 0"
                        class="mt-4 bg-gradient-to-br from-blue-900/90 to-indigo-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-blue-400/30">
                        <div class="flex items-center gap-2 mb-4">
                            <Calculator class="w-5 h-5 text-blue-400" />
                            <h3 class="text-lg font-bold text-blue-300">How Rankings Are Calculated</h3>
                        </div>

                        <div class="space-y-4 text-sm text-blue-100">
                            <div v-if="weights.gvgWin.enabled" class="bg-blue-950/50 p-3 rounded-lg">
                                <h4 class="font-semibold text-blue-300 mb-2">GvG Win (Point-Based)</h4>
                                <p>• Days 1-5 are worth 2 points each (max 10 points)</p>
                                <p>• Day 6 is worth 4 points</p>
                                <p>• Guild needs 8+ points to count as "Won"</p>
                                <p>• Score = {{ weights.gvgWin.weight }}% if won (≥8 pts), 0% if lost</p>
                            </div>

                            <div v-if="weights.gvgScore.enabled" class="bg-blue-950/50 p-3 rounded-lg">
                                <h4 class="font-semibold text-blue-300 mb-2">GvG Score (Normalized)</h4>
                                <p>• Sum of scores from all 6 GvG days</p>
                                <p>• Normalized: (Guild Score / Max Score) × {{ weights.gvgScore.weight }}%</p>
                            </div>

                            <div v-if="weights.guildPower.enabled" class="bg-blue-950/50 p-3 rounded-lg">
                                <h4 class="font-semibold text-blue-300 mb-2">Guild Power (Normalized)</h4>
                                <p>• Normalized: (Guild Power / Max Power) × {{ weights.guildPower.weight }}%</p>
                            </div>

                            <div v-if="weights.kvkPrep.enabled" class="bg-blue-950/50 p-3 rounded-lg">
                                <h4 class="font-semibold text-blue-300 mb-2">KvK Prep (Days 1-5)</h4>
                                <div v-if="weights.kvkPrep.mode === 'avgRank'">
                                    <p>• Mode: Average Rank (lower is better)</p>
                                    <p>• Calculate average rank across 5 prep days</p>
                                    <p>• Normalized: ((Max Rank - Avg Rank + 1) / Max Rank) × {{ weights.kvkPrep.weight
                                        }}%</p>
                                </div>
                                <div v-else>
                                    <p>• Mode: Total Score (higher is better)</p>
                                    <p>• Sum scores from first 5 days</p>
                                    <p>• Normalized: (Guild Score / Max Score) × {{ weights.kvkPrep.weight }}%</p>
                                </div>
                            </div>

                            <div v-if="weights.kvkWar.enabled" class="bg-blue-950/50 p-3 rounded-lg">
                                <h4 class="font-semibold text-blue-300 mb-2">KvK War (Day 6)</h4>
                                <div v-if="weights.kvkWar.mode === 'rank'">
                                    <p>• Mode: Rank (lower is better)</p>
                                    <p>• Normalized: ((Max Rank - Guild Rank + 1) / Max Rank) × {{ weights.kvkWar.weight
                                        }}%</p>
                                </div>
                                <div v-else>
                                    <p>• Mode: Score (higher is better)</p>
                                    <p>• Normalized: (Guild Score / Max Score) × {{ weights.kvkWar.weight }}%</p>
                                </div>
                            </div>

                            <div class="bg-lime-950/50 p-3 rounded-lg border-2 border-lime-400/30">
                                <h4 class="font-semibold text-lime-300 mb-2">Final Score</h4>
                                <p class="font-mono">Total = Sum of all enabled category scores</p>
                                <p class="mt-2 text-lime-200">Rankings are sorted by Total Score (highest first)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Settings, Trophy, Medal, Award, Crown, Calculator, RotateCcw, Database,
    Sword, Target, Zap, Calendar, RefreshCw, AlertCircle, CheckCircle,
    FileDown, Copy, Upload, Users, Globe, Link as LinkIcon, Save, Shield, Sparkles
} from 'lucide-vue-next'

import { useGuildDataStore } from '@/stores/useGuildDataStore'

const guildStore = useGuildDataStore()
const router = useRouter()
const route = useRoute()

// State
const selectedDatasetId = ref('')
const currentVersionId = ref('') // NEW: Track current version
const availableDatasets = ref([])
const loadedDataset = ref(null)
const loadedMetadata = ref(null)
const guilds = ref([])
const rankings = ref([])
const isLoading = ref(false)
const statusMessage = ref('')
const statusType = ref('info')
const showExplainMath = ref(false)
const weightsSaved = ref(false) // NEW: Track if current weights are saved
const lastSavedWeights = ref(null) // NEW: Store last saved weights for comparison

// Weight Configuration
const weights = ref({
    gvgWin: { enabled: true, weight: 20 },
    gvgScore: { enabled: true, weight: 20 },
    guildPower: { enabled: false, weight: 0 },
    kvkPrep: { enabled: true, weight: 30, mode: 'avgRank' }, // avgRank or totalScore
    kvkWar: { enabled: true, weight: 30, mode: 'rank' } // rank or score
})

// Computed
const totalWeight = computed(() => {
    let total = 0
    if (weights.value.gvgWin.enabled) total += weights.value.gvgWin.weight
    if (weights.value.gvgScore.enabled) total += weights.value.gvgScore.weight
    if (weights.value.guildPower.enabled) total += weights.value.guildPower.weight
    if (weights.value.kvkPrep.enabled) total += weights.value.kvkPrep.weight
    if (weights.value.kvkWar.enabled) total += weights.value.kvkWar.weight
    return total
})

const hasUnsavedWeights = computed(() => {
    if (!lastSavedWeights.value) return true
    return JSON.stringify(weights.value) !== JSON.stringify(lastSavedWeights.value)
})

const canSaveWeights = computed(() => {
    return totalWeight.value === 100 && selectedDatasetId.value && hasUnsavedWeights.value && !hasModeIncompatibilities.value
})

const canPublish = computed(() => {
    return totalWeight.value === 100 && rankings.value.length > 0 && selectedDatasetId.value && weightsSaved.value && !hasModeIncompatibilities.value
})

// NEW: Check for mode incompatibilities
const modeCompatibilityWarnings = computed(() => {
    const warnings = []
    
    // Check if metadata is loaded
    if (!loadedMetadata.value) return warnings
    
    const gvgInputMode = loadedMetadata.value.gvgInputMode || 'daily'
    const kvkInputMode = loadedMetadata.value.kvkInputMode || 'daily'
    
    // KvK Prep: avgRank mode requires daily input mode with rank data
    if (weights.value.kvkPrep.enabled && weights.value.kvkPrep.mode === 'avgRank') {
        if (kvkInputMode === 'total') {
            warnings.push({
                type: 'error',
                metric: 'KvK Prep',
                message: 'Avg Rank mode requires daily input with rank data. Current input mode is "Total Score Only".'
            })
        }
    }
    
    // KvK War: only available in daily mode
    if (weights.value.kvkWar.enabled && kvkInputMode !== 'daily') {
        warnings.push({
            type: 'error',
            metric: 'KvK War',
            message: 'KvK War (Day 6) is only available when using daily input mode.'
        })
    }
    
    // GvG Win: not available in total mode
    if (weights.value.gvgWin.enabled && gvgInputMode === 'total') {
        warnings.push({
            type: 'warning',
            metric: 'GvG Win Record',
            message: 'Win/Loss data is not available in "Total Score" input mode. This weight will have no effect.'
        })
    }
    
    return warnings
})

const hasModeIncompatibilities = computed(() => {
    return modeCompatibilityWarnings.value.some(w => w.type === 'error')
})

// Watchers
watch([weights, guilds], () => {
    if (guilds.value.length > 0) {
        calculateRankings()
    }
}, { deep: true })

// Mark weights as unsaved when they change
watch(weights, () => {
    if (lastSavedWeights.value) {
        weightsSaved.value = JSON.stringify(weights.value) === JSON.stringify(lastSavedWeights.value)
    }
}, { deep: true })

// Functions
const showStatus = (type, message) => {
    statusType.value = type
    statusMessage.value = message
    setTimeout(() => {
        statusMessage.value = ''
    }, 5000)
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

const formatNumber = (value) => {
    if (!value && value !== 0) return '0'
    return Number(value).toLocaleString()
}

const formatNumberShort = (value) => {
    if (!value && value !== 0) return '0'
    const num = Number(value)
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B'
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

const formatKvKPrepDisplay = (rawData) => {
    if (weights.value.kvkPrep.mode === 'avgRank') {
        return rawData.kvkPrepAvgRank ? rawData.kvkPrepAvgRank.toFixed(1) : '-'
    } else {
        return rawData.kvkPrepTotalScore ? formatNumber(rawData.kvkPrepTotalScore) : '-'
    }
}

const formatKvKWarDisplay = (rawData) => {
    if (weights.value.kvkWar.mode === 'rank') {
        return rawData.kvkWarRank || '-'
    } else {
        return rawData.kvkWarScore ? formatNumber(rawData.kvkWarScore) : '-'
    }
}

const loadAvailableDatasets = async () => {
    try {
        const datasets = await guildStore.loadDatasets()
        availableDatasets.value = datasets
    } catch (error) {
        console.error('Error loading datasets:', error)
        showStatus('error', `Failed to load datasets: ${error.message}`)
    }
}

const refreshDatasets = async () => {
    isLoading.value = true
    await loadAvailableDatasets()
    isLoading.value = false
    showStatus('success', 'Datasets refreshed!')
}

// NEW: Load saved weights from Firestore (at dataset level, not version level)
const loadSavedWeights = async (datasetId) => {
    try {
        // Changed: Load weights from dataset level, not version level
        const weightsRef = doc(firestore, 'topheroes', 'guilds', 'datasets', datasetId, 'weights', 'default')
        const weightsSnap = await getDoc(weightsRef)

        if (weightsSnap.exists()) {
            const savedWeights = weightsSnap.data()
            weights.value = {
                gvgWin: savedWeights.gvgWin || { enabled: true, weight: 20 },
                gvgScore: savedWeights.gvgScore || { enabled: true, weight: 20 },
                guildPower: savedWeights.guildPower || { enabled: false, weight: 0 },
                kvkPrep: savedWeights.kvkPrep || { enabled: true, weight: 30, mode: 'avgRank' },
                kvkWar: savedWeights.kvkWar || { enabled: true, weight: 30, mode: 'rank' }
            }
            lastSavedWeights.value = JSON.parse(JSON.stringify(weights.value))
            weightsSaved.value = true
            showStatus('success', 'Weights loaded from saved configuration')
        } else {
            // No saved weights, use defaults
            lastSavedWeights.value = null
            weightsSaved.value = false
        }
    } catch (error) {
        console.error('Error loading weights:', error)
        // If error loading, just use current weights
        lastSavedWeights.value = null
        weightsSaved.value = false
    }
}

// NEW: Save weights to Firestore (at dataset level, not version level)
const saveWeights = async () => {
    if (!canSaveWeights.value) {
        if (hasModeIncompatibilities.value) {
            showStatus('error', 'Cannot save: Fix mode incompatibility errors first')
        } else if (totalWeight.value !== 100) {
            showStatus('error', 'Total weight must equal 100% to save')
        } else if (!selectedDatasetId.value) {
            showStatus('error', 'Please select a dataset first')
        } else if (!hasUnsavedWeights.value) {
            showStatus('info', 'No changes to save')
        }
        return
    }

    try {
        isLoading.value = true

        // Changed: Save weights at dataset level, not version level
        const weightsRef = doc(firestore, 'topheroes', 'guilds', 'datasets', selectedDatasetId.value, 'weights', 'default')
        await setDoc(weightsRef, {
            ...weights.value,
            savedAt: new Date().toISOString(),
            savedBy: 'anonymous' // TODO: Replace with auth user ID
        })

        lastSavedWeights.value = JSON.parse(JSON.stringify(weights.value))
        weightsSaved.value = true

        showStatus('success', 'Weights saved successfully!')
    } catch (error) {
        console.error('Save weights error:', error)
        showStatus('error', `Failed to save weights: ${error.message}`)
    } finally {
        isLoading.value = false
    }
}

// NEW: Copy shareable link
const copyShareLink = async () => {
    if (!selectedDatasetId.value || !currentVersionId.value) {
        showStatus('error', 'Please load a dataset first')
        return
    }

    try {
        const shareUrl = `${window.location.origin}/topheroes/tools/rankings/view?dataset=${selectedDatasetId.value}&version=${currentVersionId.value}`
        await navigator.clipboard.writeText(shareUrl)
        showStatus('success', 'Share link copied to clipboard!')
    } catch (error) {
        console.error('Copy link error:', error)
        showStatus('error', 'Failed to copy link')
    }
}

const loadDataset = async (datasetId, versionId = 'latest') => {
    if (!datasetId) return

    try {
        isLoading.value = true
        
        // Handle 'latest' keyword
        const targetVersionId = versionId === 'latest' ? null : versionId
        const result = await guildStore.loadDatasetVersion(datasetId, targetVersionId)

        if (result && result.version) {
            guilds.value = result.version.guilds || []
            loadedDataset.value = result.dataset
            loadedMetadata.value = result.version.metadata || {}
            currentVersionId.value = result.version.id

            // Load saved weights from dataset level (independent of version)
            await loadSavedWeights(datasetId)

            showStatus('success', `Loaded dataset: ${datasetId} (v${result.version.id})`)
        } else {
            showStatus('error', 'Dataset not found')
        }
    } catch (error) {
        console.error('Load error:', error)
        showStatus('error', `Failed to load: ${error.message}`)
    } finally {
        isLoading.value = false
    }
}

const resetWeights = () => {
    weights.value = {
        gvgWin: { enabled: true, weight: 20 },
        gvgScore: { enabled: true, weight: 20 },
        guildPower: { enabled: false, weight: 0 },
        kvkPrep: { enabled: true, weight: 30, mode: 'avgRank' },
        kvkWar: { enabled: true, weight: 30, mode: 'rank' }
    }
    showStatus('success', 'Weights reset to default')
}

const toggleExplainMath = () => {
    showExplainMath.value = !showExplainMath.value
}

// Calculate Rankings
const calculateRankings = () => {
    if (totalWeight.value !== 100) {
        rankings.value = []
        return
    }

    const validGuilds = guilds.value.filter(g => g && (g.name || g.shorthand))
    const results = []
    
    // FIXED: Get input modes from metadata
    const gvgInputMode = loadedMetadata.value?.gvgInputMode || 'daily'
    const kvkInputMode = loadedMetadata.value?.kvkInputMode || 'daily'

    validGuilds.forEach(guild => {
        const scores = {
            gvgWin: 0,
            gvgScore: 0,
            guildPower: 0,
            kvkPrep: 0,
            kvkWar: 0
        }

        // Calculate raw data for display
        const rawData = {
            gvgWins: 0,
            gvgLosses: 0,
            gvgPoints: 0,
            gvgWon: false,
            gvgFlawless: false,
            gvgTotalScore: 0,
            invasionStatus: null, // 'can-invade', 'can-be-invaded', or null
            kvkPrepAvgRank: null,
            kvkPrepTotalScore: 0,
            kvkWarRank: null,
            kvkWarScore: 0
        }

        // FIXED: GvG Win calculation - handle all input modes with proper validation
        if (weights.value.gvgWin.enabled) {
            if (gvgInputMode === 'simple') {
                // Simple mode: just check gvgSimpleResult
                rawData.gvgWon = guild.gvgSimpleResult === 'won'
                scores.gvgWin = rawData.gvgWon ? weights.value.gvgWin.weight : 0
                
            } else if (gvgInputMode === 'daily' && guild.gvgDays) {
                // Daily mode: calculate from daily data (only if there's actual data)
                const daysWithData = guild.gvgDays.filter(day => 
                    day && (day.score !== null && day.score !== undefined)
                )
                
                if (daysWithData.length > 0) {
                    rawData.gvgWins = guild.gvgDays.filter(day => day && day.won === true).length
                    rawData.gvgLosses = daysWithData.filter(day => !day.won).length
                    
                    // Calculate points: Days 1-5 worth 2 points, Day 6 worth 4 points
                    rawData.gvgPoints = guild.gvgDays.reduce((points, day, index) => {
                        if (day && day.won === true) {
                            return points + (index < 5 ? 2 : 4)
                        }
                        return points
                    }, 0)
                    
                    // Win if 8+ points
                    rawData.gvgWon = rawData.gvgPoints >= 8
                    
                    // Flawless if all 6 days won
                    rawData.gvgFlawless = rawData.gvgWins === 6 && daysWithData.length === 6
                    
                    // Check invasion status based on first 5 days
                    const first5Days = guild.gvgDays.slice(0, 5)
                    const first5DaysWithData = first5Days.filter(day => 
                        day && (day.score !== null && day.score !== undefined)
                    )
                    const first5Wins = first5Days.filter(day => day && day.won === true).length
                    const first5Losses = first5DaysWithData.filter(day => !day.won).length
                    
                    if (first5Wins >= 3) {
                        rawData.invasionStatus = 'can-invade'
                    } else if (first5Losses >= 3) {
                        rawData.invasionStatus = 'can-be-invaded'
                    }
                    
                    scores.gvgWin = rawData.gvgWon ? weights.value.gvgWin.weight : 0
                }
            }
            // Note: 'total' mode doesn't have win/loss data, so score stays 0
        }

        // FIXED: GvG Score calculation - handle all input modes with proper validation
        if (weights.value.gvgScore.enabled) {
            // First, determine the raw total score based on input mode
            if (gvgInputMode === 'total') {
                // Total mode: use gvgTotalScore directly
                rawData.gvgTotalScore = (typeof guild.gvgTotalScore === 'number') ? guild.gvgTotalScore : 0
            } else if (gvgInputMode === 'daily' && guild.gvgDays) {
                // Daily mode: sum up daily scores
                rawData.gvgTotalScore = guild.gvgDays.reduce((sum, day) => {
                    return sum + ((day && typeof day.score === 'number') ? day.score : 0)
                }, 0)
            } else if (gvgInputMode === 'simple') {
                // Simple mode might have total score too
                rawData.gvgTotalScore = (typeof guild.gvgTotalScore === 'number') ? guild.gvgTotalScore : 0
            }
            
            // Calculate normalized score by comparing to max score in dataset
            // All guilds use the SAME input mode for the dataset
            const allScores = validGuilds.map(g => {
                if (gvgInputMode === 'total') {
                    return (typeof g.gvgTotalScore === 'number') ? g.gvgTotalScore : 0
                } else if (gvgInputMode === 'daily' && g.gvgDays) {
                    return g.gvgDays.reduce((sum, day) => {
                        return sum + ((day && typeof day.score === 'number') ? day.score : 0)
                    }, 0)
                } else if (gvgInputMode === 'simple') {
                    return (typeof g.gvgTotalScore === 'number') ? g.gvgTotalScore : 0
                }
                return 0
            })
            
            const maxScore = Math.max(...allScores, 0)
            if (maxScore > 0) {
                scores.gvgScore = (rawData.gvgTotalScore / maxScore) * weights.value.gvgScore.weight
            }
        }

        // Guild Power calculation (unchanged)
        if (weights.value.guildPower.enabled && guild.guildPower) {
            const maxPower = Math.max(...validGuilds.map(g => g.guildPower || 0))
            if (maxPower > 0) {
                scores.guildPower = (guild.guildPower / maxPower) * weights.value.guildPower.weight
            }
        }

        // FIXED: KvK Prep calculation - handle both input modes with proper mode compatibility
        if (weights.value.kvkPrep.enabled) {
            if (kvkInputMode === 'total') {
                // Total mode: only totalScore is available
                // Note: avgRank mode is incompatible with 'total' input mode
                rawData.kvkPrepTotalScore = guild.kvkTotalScore || 0
                
                // Can only use totalScore mode when input is 'total'
                const maxScore = Math.max(...validGuilds.map(g => g.kvkTotalScore || 0))
                if (maxScore > 0) {
                    scores.kvkPrep = (rawData.kvkPrepTotalScore / maxScore) * weights.value.kvkPrep.weight
                }
                
            } else if (kvkInputMode === 'daily' && guild.kvkPrepDays) {
                // Daily mode: use first 5 days
                const prepDays = guild.kvkPrepDays.slice(0, 5)

                if (weights.value.kvkPrep.mode === 'avgRank') {
                    // Calculate from ranks
                    const validRanks = prepDays.filter(day => day && day.rank && day.rank > 0).map(day => day.rank)
                    if (validRanks.length > 0) {
                        rawData.kvkPrepAvgRank = validRanks.reduce((sum, r) => sum + r, 0) / validRanks.length
                        
                        // Get all valid ranks across all guilds
                        const allValidRanks = validGuilds.flatMap(g => {
                            if (!g.kvkPrepDays) return []
                            return g.kvkPrepDays.slice(0, 5)
                                .filter(day => day && day.rank && day.rank > 0)
                                .map(day => day.rank)
                        })
                        
                        if (allValidRanks.length > 0) {
                            const maxRank = Math.max(...allValidRanks)
                            if (maxRank > 0) {
                                // Lower rank is better, so invert the score
                                scores.kvkPrep = ((maxRank - rawData.kvkPrepAvgRank + 1) / maxRank) * weights.value.kvkPrep.weight
                            }
                        }
                    }
                } else {
                    // Calculate from total score
                    rawData.kvkPrepTotalScore = prepDays.reduce((sum, day) => {
                        return sum + ((day && typeof day.score === 'number') ? day.score : 0)
                    }, 0)
                    
                    const allScores = validGuilds.map(g => {
                        if (!g.kvkPrepDays) return 0
                        return g.kvkPrepDays.slice(0, 5).reduce((sum, day) => {
                            return sum + ((day && typeof day.score === 'number') ? day.score : 0)
                        }, 0)
                    })
                    
                    const maxScore = Math.max(...allScores, 0)
                    if (maxScore > 0) {
                        scores.kvkPrep = (rawData.kvkPrepTotalScore / maxScore) * weights.value.kvkPrep.weight
                    }
                }
            }
        }

        // FIXED: KvK War calculation - only in daily mode, Day 6 (index 5)
        if (weights.value.kvkWar.enabled && kvkInputMode === 'daily' && guild.kvkPrepDays && guild.kvkPrepDays[5]) {
            const warDay = guild.kvkPrepDays[5]
            
            // Always capture both rank and score for display
            rawData.kvkWarRank = (warDay && typeof warDay.rank === 'number') ? warDay.rank : null
            rawData.kvkWarScore = (warDay && typeof warDay.score === 'number') ? warDay.score : 0

            if (weights.value.kvkWar.mode === 'rank' && rawData.kvkWarRank) {
                // Rank mode: lower rank is better
                const allWarRanks = validGuilds
                    .map(g => {
                        const day6 = g.kvkPrepDays?.[5]
                        return (day6 && typeof day6.rank === 'number' && day6.rank > 0) ? day6.rank : null
                    })
                    .filter(r => r !== null)
                    
                if (allWarRanks.length > 0) {
                    const maxRank = Math.max(...allWarRanks)
                    if (maxRank > 0) {
                        // Invert: lower rank = higher score
                        scores.kvkWar = ((maxRank - rawData.kvkWarRank + 1) / maxRank) * weights.value.kvkWar.weight
                    }
                }
            } else if (weights.value.kvkWar.mode === 'score' && rawData.kvkWarScore > 0) {
                // Score mode: higher score is better
                const allWarScores = validGuilds.map(g => {
                    const day6 = g.kvkPrepDays?.[5]
                    return (day6 && typeof day6.score === 'number') ? day6.score : 0
                })
                
                if (allWarScores.length > 0) {
                    const maxScore = Math.max(...allWarScores, 0)
                    if (maxScore > 0) {
                        scores.kvkWar = (rawData.kvkWarScore / maxScore) * weights.value.kvkWar.weight
                    }
                }
            }
        }

        const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)

        results.push({
            guild,
            scores,
            rawData,
            totalScore
        })
    })

    rankings.value = results.sort((a, b) => b.totalScore - a.totalScore)
}

const exportToCSV = () => {
    if (rankings.value.length === 0) return

    let csv = 'Rank,Guild,Shorthand,Total Score'

    if (weights.value.gvgWin.enabled) csv += ',GvG Record,GvG Win Score'
    if (weights.value.gvgScore.enabled) csv += ',GvG Total,GvG Score Points'
    if (weights.value.guildPower.enabled) csv += ',Guild Power,Power Points'
    if (weights.value.kvkPrep.enabled) csv += ',KvK Prep,Prep Points'
    if (weights.value.kvkWar.enabled) csv += ',KvK War,War Points'

    csv += '\n'

    rankings.value.forEach((result, index) => {
        csv += `${index + 1},`
        csv += `"${result.guild.name || 'Unnamed'}",`
        csv += `"${result.guild.shorthand || ''}",`
        csv += `${result.totalScore.toFixed(2)}`

        if (weights.value.gvgWin.enabled) {
            csv += `,${result.rawData.gvgWins}W-${result.rawData.gvgLosses}L (${result.rawData.gvgPoints}pts),${result.scores.gvgWin.toFixed(2)}`
        }
        if (weights.value.gvgScore.enabled) {
            csv += `,${result.rawData.gvgTotalScore},${result.scores.gvgScore.toFixed(2)}`
        }
        if (weights.value.guildPower.enabled) {
            csv += `,${result.guild.guildPower || 0},${result.scores.guildPower.toFixed(2)}`
        }
        if (weights.value.kvkPrep.enabled) {
            csv += `,${formatKvKPrepDisplay(result.rawData)},${result.scores.kvkPrep.toFixed(2)}`
        }
        if (weights.value.kvkWar.enabled) {
            csv += `,${formatKvKWarDisplay(result.rawData)},${result.scores.kvkWar.toFixed(2)}`
        }

        csv += '\n'
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rankings_${selectedDatasetId.value}_${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showStatus('success', 'Rankings exported to CSV!')
}

const copyForDiscord = () => {
    if (rankings.value.length === 0) return

    let text = `**Guild Rankings - ${selectedDatasetId.value}**\n\n`

    rankings.value.forEach((result, index) => {
        const emoji = index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : '▫️'
        const flawlessEmoji = result.rawData.gvgFlawless ? ' ✨' : ''
        text += `${emoji} **#${index + 1}** ${result.guild.name || 'Unnamed'}`
        if (result.guild.shorthand) text += ` (${result.guild.shorthand})`
        text += ` - ${result.totalScore.toFixed(2)} pts${flawlessEmoji}\n`
    })

    navigator.clipboard.writeText(text).then(() => {
        showStatus('success', 'Rankings copied to clipboard!')
    }).catch(() => {
        showStatus('error', 'Failed to copy to clipboard')
    })
}

const publishRankings = async () => {
    if (!canPublish.value) return

    try {
        isLoading.value = true

        // Generate a unique ranking ID
        const timestamp = Date.now()
        const rankingId = `${selectedDatasetId.value}_${timestamp}`

        // Prepare the published ranking document
        const publishData = {
            id: rankingId,
            datasetId: selectedDatasetId.value,
            versionId: currentVersionId.value, // NEW: Include version ID
            datasetName: loadedDataset.value?.name || selectedDatasetId.value,
            weights: {
                gvgWin: weights.value.gvgWin,
                gvgScore: weights.value.gvgScore,
                guildPower: weights.value.guildPower,
                kvkPrep: weights.value.kvkPrep,
                kvkWar: weights.value.kvkWar
            },
            rankings: rankings.value.map((r, index) => ({
                rank: index + 1,
                guild: {
                    name: r.guild.name,
                    shorthand: r.guild.shorthand,
                    guildPower: r.guild.guildPower
                },
                scores: r.scores,
                rawData: r.rawData,
                totalScore: r.totalScore
            })),
            metadata: {
                totalGuilds: rankings.value.length,
                opponentServer: loadedMetadata.value?.kvkGlobalSettings?.opponentServer || null,
                dailyResults: loadedMetadata.value?.kvkGlobalSettings?.dailyResults || null,
                publishedAt: new Date().toISOString(),
                publishedBy: 'anonymous', // TODO: Replace with auth user ID when implemented
                version: 1,
                views: 0 // NEW: Initialize view counter
            },
            stats: {
                avgScore: rankings.value.reduce((sum, r) => sum + r.totalScore, 0) / rankings.value.length,
                maxScore: Math.max(...rankings.value.map(r => r.totalScore)),
                minScore: Math.min(...rankings.value.map(r => r.totalScore)),
                topGuild: rankings.value[0]?.guild.name || null
            }
        }

        // Save to Firestore in the rankings collection
        const rankingRef = doc(firestore, 'topheroes', 'guilds', 'rankings', rankingId)
        await setDoc(rankingRef, publishData)

        // Also update the dataset document with latest published ranking reference
        const datasetRef = doc(firestore, 'topheroes', 'guilds', 'datasets', selectedDatasetId.value)
        await updateDoc(datasetRef, {
            latestPublishedRanking: rankingId,
            lastPublished: new Date().toISOString()
        })

        // Generate shareable URL with new query param structure
        const shareUrl = `${window.location.origin}/topheroes/tools/rankings/view?dataset=${selectedDatasetId.value}&version=${currentVersionId.value}`

        // Copy URL to clipboard
        await navigator.clipboard.writeText(shareUrl)

        showStatus('success', `Rankings published! Link copied to clipboard: ${shareUrl}`)

        // Optional: Navigate to the published view
        // router.push({ path: '/topheroes/tools/rankings/view', query: { dataset: selectedDatasetId.value, version: currentVersionId.value } })
    } catch (error) {
        console.error('Publish error:', error)
        showStatus('error', `Failed to publish: ${error.message}`)
    } finally {
        isLoading.value = false
    }
}

// Initialize
onMounted(async () => {
    await loadAvailableDatasets()
    
    // Check for dataset query parameter (passed from ServerRanking page)
    if (route.query.dataset) {
        selectedDatasetId.value = route.query.dataset
        const versionId = route.query.version || 'latest'
        await loadDataset(selectedDatasetId.value, versionId)
    }
})
</script>

<style scoped>
/* Custom scrollbar */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(163, 230, 53, 0.6) rgba(6, 78, 59, 0.5);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(6, 78, 59, 0.5);
    border-radius: 5px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(163, 230, 53, 0.6), rgba(74, 222, 128, 0.6));
    border-radius: 5px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgba(163, 230, 53, 0.8), rgba(74, 222, 128, 0.8));
}

/* Smooth transitions */
* {
    transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

/* Shimmer animation for flawless badge */
@keyframes shimmer {
    0%, 100% {
        opacity: 1;
        filter: drop-shadow(0 0 4px rgba(250, 204, 21, 0.8));
    }
    50% {
        opacity: 0.6;
        filter: drop-shadow(0 0 8px rgba(250, 204, 21, 1));
    }
}

.animate-pulse {
    animation: shimmer 2s ease-in-out infinite;
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
}
</style>