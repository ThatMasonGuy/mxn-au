<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 p-3 py-0 sm:p-6 md:py-16">
    <div class="max-w-[1920px] mx-auto">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-8">
        <h1
          class="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">
          Guild Rankings Calculator
        </h1>
        <p class="text-lime-200/80 text-sm sm:text-lg">Configure weights, input data, and leap to the top!</p>
      </div>

      <!-- Dataset Management Bar -->
      <div
        class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30 mb-6 hover:border-lime-400/50 transition-all duration-300">
        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4 justify-between">
          <div class="flex items-center gap-2 w-full lg:w-auto">
            <Database class="w-5 h-5 text-lime-400 flex-shrink-0" />
            <h2 class="text-lg sm:text-xl font-bold text-lime-300">Dataset Management</h2>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <!-- Dynamic Dataset Select -->
            <Select v-model="datasetId" @update:modelValue="handleDatasetSelect">
              <SelectTrigger
                class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400 flex-1 sm:flex-none sm:w-64">
                <SelectValue placeholder="Select or create dataset..." />
              </SelectTrigger>
              <SelectContent class="bg-green-800 border-lime-500 text-lime-100 focus:border-lime-400">
                <SelectItem v-for="dataset in availableDatasets" :key="dataset.id" :value="dataset.id">
                  {{ dataset.id }}
                  <span v-if="dataset.updatedAt" class="text-xs text-lime-300/60 ml-2">
                    ({{ formatDate(dataset.updatedAt) }})
                  </span>
                </SelectItem>
                <Separator class="my-2" />
                <div class="p-2">
                  <Input v-model="newDatasetName" @keydown.enter="createNewDataset" placeholder="New dataset name..."
                    class="bg-green-950/70 border-lime-500/40 text-lime-100 text-sm" />
                </div>
              </SelectContent>
            </Select>

            <div class="flex gap-2">
              <Button @click="loadFromFirestore" :disabled="!datasetId || isLoading" size="sm"
                class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg transition-all flex-1 sm:flex-none">
                <Download class="w-4 h-4 mr-1" />
                Load
              </Button>

              <Button @click="saveToFirestore" :disabled="!datasetId || isLoading" size="sm"
                class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold shadow-lg transition-all flex-1 sm:flex-none">
                <Upload class="w-4 h-4 mr-1" />
                Save
              </Button>

              <Button @click="refreshDatasets" :disabled="isLoading" size="sm" variant="outline"
                class="text-lime-400 border-lime-400/50 hover:bg-lime-500/20 hover:border-lime-400">
                <RefreshCw class="w-4 h-4" />
              </Button>
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
        <!-- Configuration Panel -->
        <div class="xl:col-span-4 2xl:col-span-3">
          <div
            class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30 max-h-[600px] flex flex-col hover:border-lime-400/50 transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <Settings class="w-5 h-5 text-lime-400" />
                <h2 class="text-lg sm:text-xl font-bold text-lime-300">Configuration</h2>
              </div>
              <Button @click="openResetDialog" size="sm" variant="outline"
                class="text-amber-400 border-amber-400/50 hover:bg-amber-500/20 hover:border-amber-400 transition-all">
                <RotateCcw class="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>

            <div class="space-y-3 sm:space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              <!-- GvG Win Configuration -->
              <div
                class="bg-gradient-to-br from-green-800/60 to-teal-800/60 rounded-xl p-3 sm:p-4 border-2 border-lime-500/30 hover:border-lime-400/50 transition-all duration-300 shadow-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Checkbox :checked="config.gvgWin.enabled" @update:checked="config.gvgWin.enabled = $event" />
                    <label class="text-lime-200 font-semibold text-sm sm:text-base">GvG Win (Bool)</label>
                  </div>
                  <Sword class="w-4 h-4 text-lime-400 flex-shrink-0" />
                </div>
                <div v-if="config.gvgWin.enabled" class="space-y-2 mt-2">
                  <label class="text-xs sm:text-sm text-lime-300/80">Weight (%)</label>
                  <Input v-model.number="config.gvgWin.weight" type="number" min="0" max="100"
                    class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400" />
                </div>
              </div>

              <!-- GvG Score Configuration -->
              <div
                class="bg-gradient-to-br from-green-800/60 to-teal-800/60 rounded-xl p-3 sm:p-4 border-2 border-lime-500/30 hover:border-lime-400/50 transition-all duration-300 shadow-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Checkbox :checked="config.gvgScore.enabled" @update:checked="config.gvgScore.enabled = $event" />
                    <label class="text-lime-200 font-semibold text-sm sm:text-base">GvG Score (Points)</label>
                  </div>
                  <Target class="w-4 h-4 text-lime-400 flex-shrink-0" />
                </div>
                <div v-if="config.gvgScore.enabled" class="space-y-2 mt-2">
                  <label class="text-xs sm:text-sm text-lime-300/80">Weight (%)</label>
                  <Input v-model.number="config.gvgScore.weight" type="number" min="0" max="100"
                    class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400" />
                </div>
              </div>

              <!-- Guild Power Configuration -->
              <div
                class="bg-gradient-to-br from-green-800/60 to-teal-800/60 rounded-xl p-3 sm:p-4 border-2 border-lime-500/30 hover:border-lime-400/50 transition-all duration-300 shadow-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Checkbox :checked="config.guildPower.enabled"
                      @update:checked="config.guildPower.enabled = $event" />
                    <label class="text-lime-200 font-semibold text-sm sm:text-base">Guild Power</label>
                  </div>
                  <Zap class="w-4 h-4 text-lime-400 flex-shrink-0" />
                </div>
                <div v-if="config.guildPower.enabled" class="space-y-2 mt-2">
                  <label class="text-xs sm:text-sm text-lime-300/80">Weight (%)</label>
                  <Input v-model.number="config.guildPower.weight" type="number" min="0" max="100"
                    class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400" />
                </div>
              </div>

              <!-- KvK Prep Configuration -->
              <div
                class="bg-gradient-to-br from-green-800/60 to-teal-800/60 rounded-xl p-3 sm:p-4 border-2 border-lime-500/30 hover:border-lime-400/50 transition-all duration-300 shadow-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Checkbox :checked="config.kvkPrep.enabled" @update:checked="config.kvkPrep.enabled = $event" />
                    <label class="text-lime-200 font-semibold text-sm sm:text-base">KvK Prep</label>
                  </div>
                  <Calendar class="w-4 h-4 text-lime-400 flex-shrink-0" />
                </div>
                <div v-if="config.kvkPrep.enabled" class="space-y-3 mt-2">
                  <div class="space-y-2">
                    <label class="text-xs sm:text-sm text-lime-300/80">Weight (%)</label>
                    <Input v-model.number="config.kvkPrep.weight" type="number" min="0" max="100"
                      class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs sm:text-sm text-lime-300/80">Mode</label>
                    <Select v-model="config.kvkPrep.mode">
                      <SelectTrigger class="bg-green-950/70 border-lime-500/40 text-lime-100">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5days">5 Days (Average)</SelectItem>
                        <SelectItem value="overall">Overall Rank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <!-- KvK War Configuration -->
              <div
                class="bg-gradient-to-br from-green-800/60 to-teal-800/60 rounded-xl p-3 sm:p-4 border-2 border-lime-500/30 hover:border-lime-400/50 transition-all duration-300 shadow-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Checkbox :checked="config.kvkWar.enabled" @update:checked="config.kvkWar.enabled = $event" />
                    <label class="text-lime-200 font-semibold text-sm sm:text-base">KvK War</label>
                  </div>
                  <Trophy class="w-4 h-4 text-lime-400 flex-shrink-0" />
                </div>
                <div v-if="config.kvkWar.enabled" class="space-y-2 mt-2">
                  <label class="text-xs sm:text-sm text-lime-300/80">Weight (%)</label>
                  <Input v-model.number="config.kvkWar.weight" type="number" min="0" max="100"
                    class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400" />
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
            </div>
          </div>
        </div>

        <!-- Data Input Panel -->
        <div class="xl:col-span-8 2xl:col-span-9">
          <div
            class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30 hover:border-lime-400/50 transition-all duration-300">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
              <div class="flex items-center gap-2">
                <Table2 class="w-5 h-5 text-lime-400 flex-shrink-0" />
                <h2 class="text-lg sm:text-xl font-bold text-lime-300">Guild Data</h2>
              </div>
              <div class="flex gap-2 w-full sm:w-auto">
                <Button @click="addGuild" size="sm"
                  class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold shadow-lg transition-all flex-1 sm:flex-none">
                  <Plus class="w-4 h-4 mr-1" />
                  Add Guild
                </Button>
                <Button @click="clearAllGuilds" size="sm" variant="outline"
                  class="text-red-400 border-red-400/50 hover:bg-red-500/20 hover:border-red-400 transition-all flex-1 sm:flex-none">
                  <Trash class="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>
            </div>

            <!-- Duplicate Warning -->
            <div v-if="duplicateWarning"
              class="mb-3 p-3 rounded-lg bg-amber-500/20 border-2 border-amber-400 text-amber-200 text-sm flex items-center gap-2">
              <AlertCircle class="w-4 h-4 flex-shrink-0" />
              <span>{{ duplicateWarning }}</span>
            </div>

            <!-- Guild Input Table -->
            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full">
                <thead>
                  <tr class="border-b-2 border-lime-400/30">
                    <th class="text-left py-2 px-2 sm:px-3 text-lime-300 font-semibold text-sm sm:text-base">Guild Name
                    </th>
                    <th v-if="config.gvgWin.enabled"
                      class="text-center py-2 px-2 sm:px-3 text-lime-300 font-semibold text-sm sm:text-base whitespace-nowrap">
                      GvG Win
                    </th>
                    <th v-if="config.gvgScore.enabled"
                      class="text-center py-2 px-2 sm:px-3 text-lime-300 font-semibold text-sm sm:text-base whitespace-nowrap">
                      GvG Score
                    </th>
                    <th v-if="config.guildPower.enabled"
                      class="text-center py-2 px-2 sm:px-3 text-lime-300 font-semibold text-sm sm:text-base whitespace-nowrap">
                      Guild Power
                    </th>
                    <th v-if="config.kvkPrep.enabled"
                      class="text-center py-2 px-2 sm:px-3 text-lime-300 font-semibold text-sm sm:text-base whitespace-nowrap">
                      KvK Prep {{ config.kvkPrep.mode === '5days' ? '(Days)' : '(Rank)' }}
                    </th>
                    <th v-if="config.kvkWar.enabled"
                      class="text-center py-2 px-2 sm:px-3 text-lime-300 font-semibold text-sm sm:text-base whitespace-nowrap">
                      KvK War Rank
                    </th>
                    <th class="text-center py-2 px-2 sm:px-3 text-lime-300 font-semibold text-sm sm:text-base">Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(guild, index) in guilds" :key="index" class="border-b border-lime-400/20">
                    <td class="py-2 px-2 sm:px-3">
                      <Input v-model="guild.name" @blur="checkDuplicateGuildName(index)" placeholder="Guild name..."
                        :class="[
                          'bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400 text-sm',
                          isDuplicateGuildName(guild?.name, index) ? 'border-amber-400 bg-amber-900/30' : ''
                        ]" />
                    </td>
                    <td v-if="config.gvgWin.enabled" class="py-2 px-2 sm:px-3">
                      <Checkbox :checked="guild?.gvgWin || false" @update:checked="guild.gvgWin = $event"
                        class="mx-auto block" />
                    </td>
                    <td v-if="config.gvgScore.enabled" class="py-2 px-2 sm:px-3">
                      <Input v-model.number="guild.gvgScore" type="number" placeholder="0"
                        class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400 text-center text-sm" />
                    </td>
                    <td v-if="config.guildPower.enabled" class="py-2 px-2 sm:px-3">
                      <Input v-model.number="guild.guildPower" type="number" placeholder="0"
                        class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400 text-center text-sm" />
                    </td>
                    <td v-if="config.kvkPrep.enabled" class="py-2 px-2 sm:px-3">
                      <div v-if="config.kvkPrep.mode === '5days'" class="flex gap-1 flex-wrap justify-center">
                        <Input v-for="day in 5" :key="day" v-model.number="guild.kvkPrepDays[day - 1]" type="number"
                          placeholder="0" @blur="checkDuplicateKvKRank(index, day - 1)"
                          @focus="ensureKvKPrepDays(index)" :class="[
                            'bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400 w-12 text-center text-xs',
                            isDuplicateKvKRank(guild.kvkPrepDays && guild.kvkPrepDays[day - 1], index, day - 1) ? 'border-amber-400 bg-amber-900/30' : ''
                          ]" />
                      </div>
                      <Input v-else v-model.number="guild.kvkPrepOverall" type="number" placeholder="0"
                        @blur="checkDuplicateKvKOverall(index)" :class="[
                          'bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400 text-center text-sm',
                          isDuplicateKvKOverall(guild.kvkPrepOverall, index) ? 'border-amber-400 bg-amber-900/30' : ''
                        ]" />
                    </td>
                    <td v-if="config.kvkWar.enabled" class="py-2 px-2 sm:px-3">
                      <Input v-model.number="guild.kvkWar" type="number" placeholder="0"
                        @blur="checkDuplicateKvKWar(index)" :class="[
                          'bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400 text-center text-sm',
                          isDuplicateKvKWar(guild.kvkWar, index) ? 'border-amber-400 bg-amber-900/30' : ''
                        ]" />
                    </td>
                    <td class="py-2 px-2 sm:px-3">
                      <Button @click="removeGuild(index)" size="sm" variant="ghost"
                        class="text-red-400 hover:bg-red-500/20 transition-all">
                        <X class="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Rankings Table -->
      <div
        class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30 hover:border-lime-400/50 transition-all duration-300">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div>
            <div class="flex items-center gap-2">
              <Trophy class="w-5 h-5 text-lime-400 flex-shrink-0" />
              <h2 class="text-lg sm:text-xl font-bold text-lime-300">Final Rankings</h2>
            </div>
            <!-- Dynamic Calculation Explanation -->
            <p class="text-xs sm:text-sm text-lime-200/70 mt-2">
              {{ calculationExplanation }}
            </p>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <Button @click="exportToCSV" size="sm"
              class="bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-lg transition-all flex-1 sm:flex-none">
              <FileText class="w-4 h-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>

        <!-- Rankings Display -->
        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-lime-400/30">
                <th class="text-left py-3 px-2 sm:px-4 text-lime-300 font-semibold text-sm sm:text-base">Rank</th>
                <th class="text-left py-3 px-2 sm:px-4 text-lime-300 font-semibold text-sm sm:text-base">Guild</th>
                <th class="text-right py-3 px-2 sm:px-4 text-lime-300 font-semibold text-sm sm:text-base">Total Score
                </th>
                <th v-if="config.gvgWin.enabled"
                  class="text-center py-3 px-2 sm:px-4 text-lime-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                  GvG Win
                </th>
                <th v-if="config.gvgScore.enabled"
                  class="text-center py-3 px-2 sm:px-4 text-lime-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                  GvG Score
                </th>
                <th v-if="config.guildPower.enabled"
                  class="text-center py-3 px-2 sm:px-4 text-lime-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                  Power
                </th>
                <th v-if="config.kvkPrep.enabled"
                  class="text-center py-3 px-2 sm:px-4 text-lime-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                  KvK Prep
                </th>
                <th v-if="config.kvkWar.enabled"
                  class="text-center py-3 px-2 sm:px-4 text-lime-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                  KvK War
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(result, index) in rankings" :key="index" :class="[
                'border-b border-lime-400/20 ranking-row',
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
                <td class="py-3 px-2 sm:px-4 font-semibold text-lime-100 text-sm sm:text-base">{{ result.guild?.name ||
                  'Unnamed' }}</td>
                <td class="py-3 px-2 sm:px-4 text-right">
                  <span
                    class="text-lg sm:text-xl font-bold bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
                    {{ formatNumber(result.totalScore?.toFixed(2) || '0') }}
                  </span>
                </td>
                <td v-if="config.gvgWin.enabled" class="py-3 px-2 sm:px-4 text-center">
                  <div class="space-y-1">
                    <Badge :variant="result.guild?.gvgWin ? 'default' : 'outline'"
                      class="bg-lime-600/80 text-green-950 text-xs">
                      {{ result.guild?.gvgWin ? 'Yes' : 'No' }}
                    </Badge>
                    <div class="text-xs text-lime-300/70">{{ formatNumber(result.scores?.gvgWin?.toFixed(1) || '0')
                      }}pts</div>
                  </div>
                </td>
                <td v-if="config.gvgScore.enabled" class="py-3 px-2 sm:px-4 text-center">
                  <div class="space-y-1">
                    <span class="text-lime-200 text-sm font-medium">{{ formatNumber(result.guild?.gvgScore || 0)
                      }}</span>
                    <div class="text-xs text-lime-300/70">{{ formatNumber(result.scores?.gvgScore?.toFixed(1) || '0')
                      }}pts</div>
                  </div>
                </td>
                <td v-if="config.guildPower.enabled" class="py-3 px-2 sm:px-4 text-center">
                  <div class="space-y-1">
                    <span class="text-lime-200 text-sm font-medium">{{ formatNumber(result.guild?.guildPower || 0)
                      }}</span>
                    <div class="text-xs text-lime-300/70">{{ formatNumber(result.scores?.guildPower?.toFixed(1) || '0')
                      }}pts</div>
                  </div>
                </td>
                <td v-if="config.kvkPrep.enabled" class="py-3 px-2 sm:px-4 text-center">
                  <div class="space-y-1">
                    <span class="text-lime-200 text-sm font-medium">{{ getKvKPrepDisplay(result.guild) }}</span>
                    <div class="text-xs text-lime-300/70">{{ formatNumber(result.scores?.kvkPrep?.toFixed(1) || '0')
                      }}pts</div>
                  </div>
                </td>
                <td v-if="config.kvkWar.enabled" class="py-3 px-2 sm:px-4 text-center">
                  <div class="space-y-1">
                    <span class="text-lime-200 text-sm font-medium">{{ result.guild?.kvkWar || '-' }}</span>
                    <div class="text-xs text-lime-300/70">{{ formatNumber(result.scores?.kvkWar?.toFixed(1) || '0')
                      }}pts</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Reset Confirmation Dialog -->
    <AlertDialog :open="showResetDialog" @update:open="showResetDialog = $event">
      <AlertDialogContent class="bg-green-900 border-lime-400">
        <AlertDialogHeader>
          <AlertDialogTitle class="text-lime-300">Reset Configuration?</AlertDialogTitle>
          <AlertDialogDescription class="text-lime-200/80">
            This will reset all weights to default values. Guild data will be preserved.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel class="bg-emerald-800 text-lime-200 hover:bg-emerald-700 border-lime-500">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction @click="resetConfig" class="bg-amber-600 text-white hover:bg-amber-500">
            Reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { firestore } from '@/firebase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog'
import {
  Plus,
  Trash,
  X,
  Download,
  Upload,
  Trophy,
  Medal,
  Award,
  Crown,
  Settings,
  Table2,
  Sword,
  Target,
  Calendar,
  RotateCcw,
  FileText,
  Zap,
  Database,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-vue-next'

// State
const config = ref({
  gvgWin: { enabled: true, weight: 20 },
  gvgScore: { enabled: true, weight: 20 },
  guildPower: { enabled: false, weight: 0 },
  kvkPrep: { enabled: true, weight: 30, mode: '5days' },
  kvkWar: { enabled: true, weight: 30 }
})

const guilds = ref([])
const rankings = ref([])
const showResetDialog = ref(false)
const datasetId = ref('')
const newDatasetName = ref('')
const availableDatasets = ref([])
const isLoading = ref(false)
const statusMessage = ref('')
const statusType = ref('info')
const duplicateWarning = ref('')

// Computed
const totalWeight = computed(() => {
  return (
    (config.value.gvgWin.enabled ? config.value.gvgWin.weight : 0) +
    (config.value.gvgScore.enabled ? config.value.gvgScore.weight : 0) +
    (config.value.guildPower.enabled ? config.value.guildPower.weight : 0) +
    (config.value.kvkPrep.enabled ? config.value.kvkPrep.weight : 0) +
    (config.value.kvkWar.enabled ? config.value.kvkWar.weight : 0)
  )
})

const calculationExplanation = computed(() => {
  const activeMetrics = []
  if (config.value.gvgWin.enabled) activeMetrics.push(`GvG Win (${config.value.gvgWin.weight}%)`)
  if (config.value.gvgScore.enabled) activeMetrics.push(`GvG Score (${config.value.gvgScore.weight}%)`)
  if (config.value.guildPower.enabled) activeMetrics.push(`Guild Power (${config.value.guildPower.weight}%)`)
  if (config.value.kvkPrep.enabled) activeMetrics.push(`KvK Prep (${config.value.kvkPrep.weight}%)`)
  if (config.value.kvkWar.enabled) activeMetrics.push(`KvK War (${config.value.kvkWar.weight}%)`)

  if (activeMetrics.length === 0) return 'No metrics enabled'
  return `Rankings based on: ${activeMetrics.join(', ')}`
})

// Number formatting
function formatNumber(value) {
  if (!value && value !== 0) return '-'
  return Number(value).toLocaleString()
}

function formatDate(timestamp) {
  if (!timestamp) return ''

  try {
    let date
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      // Firestore timestamp
      date = timestamp.toDate()
    } else if (timestamp.seconds) {
      // Firestore timestamp object
      date = new Date(timestamp.seconds * 1000)
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      date = new Date(timestamp)
    } else {
      date = timestamp
    }

    if (isNaN(date.getTime())) {
      return ''
    }

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    console.error('Error formatting date:', e)
    return ''
  }
}

// Duplicate checking functions
function isDuplicateGuildName(name, currentIndex) {
  if (!name || !Array.isArray(guilds.value)) return false
  return guilds.value.some((guild, index) =>
    guild && index !== currentIndex && guild.name && guild.name.toLowerCase() === name.toLowerCase()
  )
}

function isDuplicateKvKRank(rank, guildIndex, dayIndex) {
  if (!rank || rank <= 0 || !Array.isArray(guilds.value)) return false
  return guilds.value.some((guild, index) =>
    guild && index !== guildIndex && guild.kvkPrepDays && guild.kvkPrepDays[dayIndex] === rank
  )
}

function isDuplicateKvKOverall(rank, currentIndex) {
  if (!rank || rank <= 0 || !Array.isArray(guilds.value)) return false
  return guilds.value.some((guild, index) =>
    guild && index !== currentIndex && guild.kvkPrepOverall === rank
  )
}

function isDuplicateKvKWar(rank, currentIndex) {
  if (!rank || rank <= 0 || !Array.isArray(guilds.value)) return false
  return guilds.value.some((guild, index) =>
    guild && index !== currentIndex && guild.kvkWar === rank
  )
}

function checkDuplicateGuildName(index) {
  if (!Array.isArray(guilds.value) || !guilds.value[index]) return
  const guild = guilds.value[index]
  if (isDuplicateGuildName(guild.name, index)) {
    duplicateWarning.value = `Guild name "${guild.name}" is already used by another guild`
    setTimeout(() => duplicateWarning.value = '', 3000)
  }
}

function checkDuplicateKvKRank(guildIndex, dayIndex) {
  if (!Array.isArray(guilds.value) || !guilds.value[guildIndex] || !guilds.value[guildIndex].kvkPrepDays) return
  const rank = guilds.value[guildIndex].kvkPrepDays[dayIndex]
  if (isDuplicateKvKRank(rank, guildIndex, dayIndex)) {
    duplicateWarning.value = `KvK Prep rank ${rank} for day ${dayIndex + 1} is already used by another guild`
    setTimeout(() => duplicateWarning.value = '', 3000)
  }
}

function checkDuplicateKvKOverall(index) {
  if (!Array.isArray(guilds.value) || !guilds.value[index]) return
  const rank = guilds.value[index].kvkPrepOverall
  if (isDuplicateKvKOverall(rank, index)) {
    duplicateWarning.value = `KvK Prep overall rank ${rank} is already used by another guild`
    setTimeout(() => duplicateWarning.value = '', 3000)
  }
}

function checkDuplicateKvKWar(index) {
  if (!Array.isArray(guilds.value) || !guilds.value[index]) return
  const rank = guilds.value[index].kvkWar
  if (isDuplicateKvKWar(rank, index)) {
    duplicateWarning.value = `KvK War rank ${rank} is already used by another guild`
    setTimeout(() => duplicateWarning.value = '', 3000)
  }
}

// Dataset management
async function loadAvailableDatasets() {
  try {
    const rankingsRef = collection(firestore, 'topheroes', 'guilds', 'rankings')

    // Try to get documents without ordering first if ordering fails
    let querySnapshot
    try {
      const q = query(rankingsRef, orderBy('updatedAt', 'desc'))
      querySnapshot = await getDocs(q)
    } catch (orderError) {
      // If ordering fails (no index), try without ordering
      console.log('Ordering failed, trying without order:', orderError)
      querySnapshot = await getDocs(rankingsRef)
    }

    availableDatasets.value = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        updatedAt: data.updatedAt || null
      }
    }).sort((a, b) => {
      // Manual sort if Firebase ordering failed
      if (!a.updatedAt && !b.updatedAt) return 0
      if (!a.updatedAt) return 1
      if (!b.updatedAt) return -1

      const aTime = a.updatedAt.seconds || (a.updatedAt instanceof Date ? a.updatedAt.getTime() / 1000 : 0)
      const bTime = b.updatedAt.seconds || (b.updatedAt instanceof Date ? b.updatedAt.getTime() / 1000 : 0)
      return bTime - aTime
    })
  } catch (error) {
    console.error('Error loading datasets:', error)
    // If the collection doesn't exist or there's an error, just set empty array
    availableDatasets.value = []
    if (error.code !== 'permission-denied' && error.code !== 'failed-precondition') {
      showStatus('Could not load datasets list', 'error')
    }
  }
}

async function refreshDatasets() {
  isLoading.value = true
  await loadAvailableDatasets()
  isLoading.value = false
  showStatus('Datasets refreshed', 'success')
}

function handleDatasetSelect(value) {
  datasetId.value = value
}

async function createNewDataset() {
  if (!newDatasetName.value.trim()) return

  const cleanName = newDatasetName.value.trim().toLowerCase().replace(/\s+/g, '-')
  datasetId.value = cleanName
  newDatasetName.value = ''

  // Add to available datasets locally
  availableDatasets.value.unshift({
    id: cleanName,
    updatedAt: new Date()
  })

  showStatus(`Created new dataset: ${cleanName}`, 'success')
}

// Guild management
function addGuild() {
  if (!Array.isArray(guilds.value)) {
    guilds.value = []
  }
  guilds.value.push({
    name: '',
    gvgWin: false,
    gvgScore: 0,
    guildPower: 0,
    kvkPrepDays: [null, null, null, null, null],
    kvkPrepOverall: null,
    kvkWar: null
  })
}

function ensureKvKPrepDays(index) {
  if (!guilds.value[index].kvkPrepDays) {
    guilds.value[index].kvkPrepDays = [null, null, null, null, null]
  }
}

function removeGuild(index) {
  if (Array.isArray(guilds.value)) {
    guilds.value.splice(index, 1)
  }
}

function clearAllGuilds() {
  guilds.value = []
  // Add default empty guilds
  addGuild()
  addGuild()
  addGuild()
  calculateRankings()
}

function openResetDialog() {
  showResetDialog.value = true
}

function resetConfig() {
  config.value = {
    gvgWin: { enabled: true, weight: 20 },
    gvgScore: { enabled: true, weight: 20 },
    guildPower: { enabled: false, weight: 0 },
    kvkPrep: { enabled: true, weight: 30, mode: '5days' },
    kvkWar: { enabled: true, weight: 30 }
  }
  showResetDialog.value = false
}

// Calculation logic
function calculateRankings() {
  // Ensure guilds is an array
  if (!Array.isArray(guilds.value)) {
    guilds.value = []
    rankings.value = []
    return
  }

  if (totalWeight.value !== 100) {
    rankings.value = []
    return
  }

  const validGuilds = guilds.value.filter(g => g && g.name)
  const results = []

  validGuilds.forEach(guild => {
    const scores = {
      gvgWin: 0,
      gvgScore: 0,
      guildPower: 0,
      kvkPrep: 0,
      kvkWar: 0
    }

    // GvG Win scoring
    if (config.value.gvgWin.enabled) {
      scores.gvgWin = guild.gvgWin ? config.value.gvgWin.weight : 0
    }

    // GvG Score scoring  
    if (config.value.gvgScore.enabled && guild.gvgScore) {
      const maxScore = Math.max(...validGuilds.map(g => g.gvgScore || 0))
      if (maxScore > 0) {
        scores.gvgScore = (guild.gvgScore / maxScore) * config.value.gvgScore.weight
      }
    }

    // Guild Power scoring
    if (config.value.guildPower.enabled && guild.guildPower) {
      const maxPower = Math.max(...validGuilds.map(g => g.guildPower || 0))
      if (maxPower > 0) {
        scores.guildPower = (guild.guildPower / maxPower) * config.value.guildPower.weight
      }
    }

    // KvK Prep scoring
    if (config.value.kvkPrep.enabled) {
      if (config.value.kvkPrep.mode === '5days') {
        const validDays = (guild.kvkPrepDays || []).filter(d => d && d > 0)
        if (validDays.length > 0) {
          const avgRank = validDays.reduce((sum, rank) => sum + rank, 0) / validDays.length
          const maxRank = Math.max(...validGuilds.flatMap(g => (g.kvkPrepDays || []).filter(d => d && d > 0)))
          if (maxRank > 0) {
            scores.kvkPrep = ((maxRank - avgRank + 1) / maxRank) * config.value.kvkPrep.weight
          }
        }
      } else {
        if (guild.kvkPrepOverall && guild.kvkPrepOverall > 0) {
          const maxRank = Math.max(...validGuilds.map(g => g.kvkPrepOverall || 0).filter(r => r > 0))
          if (maxRank > 0) {
            scores.kvkPrep = ((maxRank - guild.kvkPrepOverall + 1) / maxRank) * config.value.kvkPrep.weight
          }
        }
      }
    }

    // KvK War scoring
    if (config.value.kvkWar.enabled && guild.kvkWar && guild.kvkWar > 0) {
      const maxRank = Math.max(...validGuilds.map(g => g.kvkWar || 0).filter(r => r > 0))
      if (maxRank > 0) {
        scores.kvkWar = ((maxRank - guild.kvkWar + 1) / maxRank) * config.value.kvkWar.weight
      }
    }

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)

    results.push({
      guild,
      scores,
      totalScore
    })
  })

  rankings.value = results.sort((a, b) => b.totalScore - a.totalScore)
}

function getKvKPrepDisplay(guild) {
  if (!guild) return '-'

  if (config.value.kvkPrep.mode === '5days') {
    const validDays = (guild.kvkPrepDays || []).filter(d => d && d > 0)
    if (validDays.length === 0) return '-'
    const avg = validDays.reduce((sum, rank) => sum + rank, 0) / validDays.length
    return avg.toFixed(1)
  } else {
    return guild.kvkPrepOverall || '-'
  }
}

// Export functionality
function exportToCSV() {
  if (!Array.isArray(rankings.value) || rankings.value.length === 0) {
    showStatus('No rankings to export', 'error')
    return
  }

  const headers = ['Rank', 'Guild', 'Total Score']

  if (config.value.gvgWin.enabled) {
    headers.push('GvG Win', 'GvG Win Score')
  }
  if (config.value.gvgScore.enabled) {
    headers.push('GvG Score', 'GvG Score Points')
  }
  if (config.value.guildPower.enabled) {
    headers.push('Guild Power', 'Power Points')
  }
  if (config.value.kvkPrep.enabled) {
    headers.push('KvK Prep', 'KvK Prep Score')
  }
  if (config.value.kvkWar.enabled) {
    headers.push('KvK War', 'KvK War Score')
  }

  const rows = rankings.value.map((result, index) => {
    const row = [index + 1, result.guild?.name || 'Unnamed', result.totalScore?.toFixed(2) || '0']

    if (config.value.gvgWin.enabled) {
      row.push(result.guild?.gvgWin ? 'Yes' : 'No', result.scores?.gvgWin?.toFixed(2) || '0')
    }
    if (config.value.gvgScore.enabled) {
      row.push(formatNumber(result.guild?.gvgScore || 0), result.scores?.gvgScore?.toFixed(2) || '0')
    }
    if (config.value.guildPower.enabled) {
      row.push(formatNumber(result.guild?.guildPower || 0), result.scores?.guildPower?.toFixed(2) || '0')
    }
    if (config.value.kvkPrep.enabled) {
      row.push(getKvKPrepDisplay(result.guild), result.scores?.kvkPrep?.toFixed(2) || '0')
    }
    if (config.value.kvkWar.enabled) {
      row.push(result.guild?.kvkWar || '-', result.scores?.kvkWar?.toFixed(2) || '0')
    }
    return row
  })

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `guild-rankings-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

// Firestore Functions
async function loadFromFirestore() {
  if (!datasetId.value.trim()) {
    showStatus('Please select a dataset', 'error')
    return
  }

  isLoading.value = true
  showStatus('Loading dataset...', 'info')

  try {
    const docRef = doc(firestore, 'topheroes', 'guilds', 'rankings', datasetId.value)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()

      // Fix config values
      config.value = {
        gvgWin: {
          enabled: data.config?.gvgWin?.enabled ?? true,
          weight: data.config?.gvgWin?.weight ?? 20
        },
        gvgScore: {
          enabled: data.config?.gvgScore?.enabled ?? true,
          weight: data.config?.gvgScore?.weight ?? 20
        },
        guildPower: {
          enabled: data.config?.guildPower?.enabled ?? false,
          weight: data.config?.guildPower?.weight ?? 0
        },
        kvkPrep: {
          enabled: data.config?.kvkPrep?.enabled ?? true,
          weight: data.config?.kvkPrep?.weight ?? 30,
          mode: data.config?.kvkPrep?.mode ?? '5days'
        },
        kvkWar: {
          enabled: data.config?.kvkWar?.enabled ?? true,
          weight: data.config?.kvkWar?.weight ?? 30
        }
      }

      // Fix guild values - Firestore saves 0 as undefined
      guilds.value = (data.guilds || []).map(guild => ({
        name: guild.name || '',
        gvgWin: guild.gvgWin || false,
        gvgScore: guild.gvgScore ?? 0,  // Use ?? to handle undefined as 0
        guildPower: guild.guildPower ?? 0,
        kvkPrepDays: guild.kvkPrepDays ? guild.kvkPrepDays.map(d => d ?? null) : [null, null, null, null, null],
        kvkPrepOverall: guild.kvkPrepOverall ?? null,
        kvkWar: guild.kvkWar ?? null
      }))

      showStatus('Dataset loaded successfully!', 'success')
    } else {
      showStatus('Dataset not found', 'error')
    }
  } catch (error) {
    console.error('Error loading from Firestore:', error)
    showStatus(`Error: ${error.message}`, 'error')
  } finally {
    isLoading.value = false
  }
}

async function saveToFirestore() {
  if (!datasetId.value.trim()) {
    showStatus('Please select or create a dataset', 'error')
    return
  }

  isLoading.value = true
  showStatus('Saving dataset...', 'info')

  try {
    const docRef = doc(firestore, 'topheroes', 'guilds', 'rankings', datasetId.value)

    // Clean up data before saving (Firestore saves 0 as undefined)
    const cleanGuilds = (guilds.value || []).map(guild => ({
      name: guild.name || '',
      gvgWin: guild.gvgWin || false,
      gvgScore: guild.gvgScore || undefined,  // Let Firestore handle 0 as undefined
      guildPower: guild.guildPower || undefined,
      kvkPrepDays: guild.kvkPrepDays ? guild.kvkPrepDays.map(d => d || undefined) : undefined,
      kvkPrepOverall: guild.kvkPrepOverall || undefined,
      kvkWar: guild.kvkWar || undefined
    }))

    await setDoc(docRef, {
      config: config.value,
      guilds: cleanGuilds,
      updatedAt: serverTimestamp()
    })

    showStatus('Dataset saved successfully!', 'success')

    // Refresh datasets list
    await loadAvailableDatasets()
  } catch (error) {
    console.error('Error saving to Firestore:', error)
    showStatus(`Error: ${error.message}`, 'error')
  } finally {
    isLoading.value = false
  }
}

function showStatus(message, type) {
  statusMessage.value = message
  statusType.value = type
  setTimeout(() => {
    statusMessage.value = ''
  }, 5000)
}

// Watch for changes and save to localStorage
watch(config, (newConfig) => {
  if (newConfig) {
    localStorage.setItem('guildRankingsConfig', JSON.stringify(newConfig))
    calculateRankings()
  }
}, { deep: true })

watch(guilds, (newGuilds) => {
  if (Array.isArray(newGuilds)) {
    localStorage.setItem('guildRankingsGuilds', JSON.stringify(newGuilds))
    calculateRankings()
  }
}, { deep: true })

// Load data from localStorage on mount
onMounted(async () => {
  try {
    // Load available datasets first
    await loadAvailableDatasets()

    const savedConfig = localStorage.getItem('guildRankingsConfig')
    const savedGuilds = localStorage.getItem('guildRankingsGuilds')

    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        // Ensure backwards compatibility
        if (parsed.kvkPrep && !parsed.kvkPrep.mode) {
          parsed.kvkPrep.mode = '5days'
        }
        if (!parsed.guildPower) {
          parsed.guildPower = { enabled: false, weight: 0 }
        }
        config.value = parsed
      } catch (e) {
        console.error('Error parsing saved config:', e)
      }
    }

    if (savedGuilds) {
      try {
        const parsed = JSON.parse(savedGuilds)
        if (Array.isArray(parsed)) {
          guilds.value = parsed.map(guild => ({
            name: guild?.name || '',
            gvgWin: guild?.gvgWin || false,
            gvgScore: guild?.gvgScore ?? 0,
            guildPower: guild?.guildPower ?? 0,
            kvkPrepDays: guild?.kvkPrepDays ?
              guild.kvkPrepDays.map(d => d ?? null) :
              [null, null, null, null, null],
            kvkPrepOverall: guild?.kvkPrepOverall ?? null,
            kvkWar: guild?.kvkWar ?? null
          }))
        } else {
          // Initialize with empty guilds if parse fails
          guilds.value = []
          addGuild()
          addGuild()
          addGuild()
        }
      } catch (e) {
        console.error('Error parsing saved guilds:', e)
        guilds.value = []
        addGuild()
        addGuild()
        addGuild()
      }
    } else {
      // Initialize with default guilds
      guilds.value = []
      addGuild()
      addGuild()
      addGuild()
    }

    // Calculate rankings after everything is loaded
    setTimeout(() => {
      calculateRankings()
    }, 100)

  } catch (error) {
    console.error('Error in mounted hook:', error)
    // Initialize with defaults on error
    if (!Array.isArray(guilds.value)) {
      guilds.value = []
      addGuild()
      addGuild()
      addGuild()
    }
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

/* Input styles */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Smooth transitions */
* {
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

/* Fixed: Rankings table hover effect - prevent horizontal scroll */
.ranking-row {
  transition: background-color 0.2s ease;
  position: relative;
}

.ranking-row:hover {
  background-color: rgba(163, 230, 53, 0.1);
}

/* Remove the transform that was causing horizontal scroll */
.ranking-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, rgba(163, 230, 53, 0.6), rgba(74, 222, 128, 0.6));
  opacity: 0;
  transition: opacity 0.2s ease;
}

.ranking-row:hover::before {
  opacity: 1;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  /* Improve mobile touch targets */
  button {
    min-height: 44px;
  }

  input {
    min-height: 40px;
  }

  /* Fix mobile layout issues */
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }

  /* Ensure tables don't break on mobile */
  table {
    min-width: 600px;
  }

  /* Improve mobile spacing */
  .p-3 {
    padding: 0.75rem;
  }

  .gap-1 {
    gap: 0.25rem;
  }
}

/* Tablet optimizations */
@media (min-width: 768px) and (max-width: 1024px) {
  .xl\:col-span-4 {
    grid-column: span 12;
  }

  .xl\:col-span-8 {
    grid-column: span 12;
  }
}
</style>