<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 p-3 py-0 sm:p-6 md:py-16">
    <div class="max-w-[1920px] mx-auto">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-8">
        <h1
          class="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">
          Dataset Builder
        </h1>
        <p class="text-lime-200/80 text-sm sm:text-lg">Create and manage your guild event datasets with validation</p>
      </div>

      <!-- Dataset Management Bar -->
      <div
        class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30 mb-6 hover:border-lime-400/50 transition-all duration-300">
        <div class="flex flex-col gap-4">
          <!-- Top Row: Dataset Selection and Actions -->
          <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4 justify-between">
            <div class="flex items-center gap-2 w-full lg:w-auto">
              <Database class="w-5 h-5 text-lime-400 flex-shrink-0" />
              <h2 class="text-lg sm:text-xl font-bold text-lime-300">Dataset Management</h2>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <!-- Dataset Select -->
              <Select v-model="datasetId" @update:modelValue="handleDatasetSelect">
                <SelectTrigger
                  class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400 flex-1 sm:flex-none sm:w-64">
                  <SelectValue placeholder="Select or create dataset..." />
                </SelectTrigger>
                <SelectContent class="bg-green-800 border-lime-500 text-lime-100">
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

              <!-- Action Buttons -->
              <div class="flex gap-2">
                <Button @click="loadFromFirestore" :disabled="!datasetId || isLoading" size="sm"
                  class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg transition-all flex-1 sm:flex-none">
                  <Download class="w-4 h-4 mr-1" />
                  Load
                </Button>

                <Button @click="saveToFirestore" :disabled="!datasetId || isLoading || !isValid" size="sm"
                  class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold shadow-lg transition-all flex-1 sm:flex-none">
                  <Upload class="w-4 h-4 mr-1" />
                  Save
                </Button>

                <Button @click="refreshDatasets" :disabled="isLoading" size="sm" variant="outline"
                  class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20 hover:border-lime-400">
                  <RefreshCw class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <!-- Second Row: Import/Export and Stats -->
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between pt-3 border-t border-lime-500/20">
            <div class="flex gap-2">
              <Button @click="exportJSON" size="sm" variant="outline"
                class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20 hover:border-lime-400">
                <FileDown class="w-4 h-4 mr-1" />
                Export JSON
              </Button>

              <Button @click="triggerImport" size="sm" variant="outline"
                class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20 hover:border-lime-400">
                <FileUp class="w-4 h-4 mr-1" />
                Import JSON
              </Button>
              <input ref="fileInput" type="file" accept=".json" @change="importJSON" class="hidden" />

              <Button @click="showDiscordExportModal = true" size="sm" variant="outline"
                :disabled="guilds.length === 0"
                class="text-purple-400 bg-purple-600/20 border-purple-400/50 hover:bg-purple-500/20 hover:border-purple-400">
                <MessageSquare class="w-4 h-4 mr-1" />
                Discord Export
              </Button>
            </div>

            <!-- Quick Stats -->
            <div class="flex items-center gap-4 text-sm">
              <div class="flex items-center gap-1">
                <Users class="w-4 h-4 text-lime-400" />
                <span class="text-lime-200">{{ guilds.length }} guilds</span>
              </div>
              <div class="flex items-center gap-1">
                <AlertCircle :class="[
                  'w-4 h-4',
                  consolidatedErrors.length > 0 ? 'text-red-400' : 'text-green-400'
                ]" />
                <span :class="[
                  consolidatedErrors.length > 0 ? 'text-red-200' : 'text-green-200'
                ]">
                  {{ consolidatedErrors.length > 0 ? `${consolidatedErrors.length} issues` : 'Valid' }}
                </span>
              </div>
              <div class="flex items-center gap-1 text-lime-300/60">
                <Save class="w-4 h-4" />
                <span>{{ lastSaved || 'Not saved' }}</span>
              </div>
            </div>
          </div>

          <!-- Status Messages -->
          <div v-if="statusMessage" :class="[
            'p-3 rounded-lg border-2 flex items-center gap-2 text-sm',
            statusType === 'error' ? 'bg-red-500/20 border-red-400 text-red-200' :
              statusType === 'success' ? 'bg-lime-500/20 border-lime-400 text-lime-200' :
                'bg-blue-500/20 border-blue-400 text-blue-200'
          ]">
            <AlertCircle v-if="statusType === 'error'" class="w-4 h-4 flex-shrink-0" />
            <CheckCircle v-if="statusType === 'success'" class="w-4 h-4 flex-shrink-0" />
            <span>{{ statusMessage }}</span>
          </div>
        </div>
      </div>

      <!-- Validation Errors Panel -->
      <div v-if="consolidatedErrors.length > 0"
        class="bg-red-900/30 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-red-400/50 mb-6">
        <div class="flex items-center gap-2 mb-3">
          <AlertTriangle class="w-5 h-5 text-red-400" />
          <h3 class="text-lg font-bold text-red-200">Validation Issues ({{ consolidatedErrors.length }})</h3>
        </div>
        <div class="space-y-2">
          <div v-for="(error, idx) in consolidatedErrors" :key="idx"
            class="flex items-start gap-2 text-sm text-red-200 bg-red-950/50 p-2 rounded">
            <AlertCircle class="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{{ error }}</span>
          </div>
        </div>
      </div>

      <!-- NEW: INPUT CONTROL PANEL -->
      <div class="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-purple-400/30 mb-6">
        <div class="flex items-center gap-2 mb-4">
          <Settings class="w-5 h-5 text-purple-400" />
          <h2 class="text-lg sm:text-xl font-bold text-purple-300">Input Control Panel</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- GvG Controls -->
          <div class="bg-purple-950/50 rounded-lg p-4 border border-purple-500/30">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <Sword class="w-5 h-5 text-lime-400" />
                <h3 class="text-base font-semibold text-lime-300">GvG Settings</h3>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-purple-300">{{ gvgEnabled ? 'Enabled' : 'Disabled' }}</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="gvgEnabled" class="sr-only peer">
                  <div class="w-11 h-6 bg-purple-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-600"></div>
                </label>
              </div>
            </div>

            <div v-if="gvgEnabled" class="space-y-3">
              <div>
                <label class="text-xs text-purple-300/80 mb-1 block">Input Mode</label>
                <Select v-model="gvgInputMode">
                  <SelectTrigger class="bg-purple-950/70 border-purple-500/40 text-purple-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent class="bg-purple-800 border-purple-500 text-purple-100">
                    <SelectItem value="daily">Daily Scores (6 Days)</SelectItem>
                    <SelectItem value="simple">Simple Win/Loss Only</SelectItem>
                    <SelectItem value="total">Total Score Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p class="text-xs text-purple-300/60">
                {{ gvgInputMode === 'daily' ? 'Enter score and win/loss for each of 6 days' : 
                   gvgInputMode === 'simple' ? 'Just mark if you won or lost overall' : 
                   'Enter total GvG score only' }}
              </p>
            </div>

            <div v-else class="text-xs text-purple-300/60 italic">
              GvG data input is disabled
            </div>
          </div>

          <!-- KvK Controls -->
          <div class="bg-purple-950/50 rounded-lg p-4 border border-purple-500/30">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <Calendar class="w-5 h-5 text-indigo-400" />
                <h3 class="text-base font-semibold text-indigo-300">KvK Settings</h3>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-purple-300">{{ kvkEnabled ? 'Enabled' : 'Disabled' }}</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="kvkEnabled" class="sr-only peer">
                  <div class="w-11 h-6 bg-purple-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

            <div v-if="kvkEnabled" class="space-y-3">
              <div>
                <label class="text-xs text-purple-300/80 mb-1 block">Input Mode</label>
                <Select v-model="kvkInputMode">
                  <SelectTrigger class="bg-purple-950/70 border-purple-500/40 text-purple-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent class="bg-purple-800 border-purple-500 text-purple-100">
                    <SelectItem value="daily">Daily Scores (6 Days)</SelectItem>
                    <SelectItem value="total">Total Score Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p class="text-xs text-purple-300/60">
                {{ kvkInputMode === 'daily' ? 'Enter score and rank for each of 6 days' : 'Enter total KvK score only' }}
              </p>
            </div>

            <div v-else class="text-xs text-purple-300/60 italic">
              KvK data input is disabled
            </div>
          </div>
        </div>
      </div>

      <!-- KvK Global Settings Button (when disabled) -->
      <div v-if="!kvkEnabled" class="mb-6 flex justify-center">
        <Button @click="kvkEnabled = true" size="lg"
          class="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-xl">
          <Globe class="w-5 h-5 mr-2" />
          Configure KvK Global Settings
        </Button>
      </div>

      <!-- UPDATED: COMPACT KvK Global Settings -->
      <div v-if="kvkEnabled"
        class="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-5 shadow-2xl border-2 border-purple-400/30 mb-6">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <Globe class="w-5 h-5 text-purple-400" />
            <h2 class="text-base sm:text-lg font-bold text-purple-300">KvK Settings & Results</h2>
          </div>
          <Button @click="kvkEnabled = false" size="sm" variant="ghost" class="text-purple-300 hover:bg-purple-500/20">
            <X class="w-4 h-4" />
          </Button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Opponent Server -->
          <div>
            <label class="text-xs text-purple-300/80 mb-2 block">Opponent Server</label>
            <Input v-model="kvkGlobalSettings.opponentServer" placeholder="e.g., Server 123"
              class="bg-purple-950/70 border-purple-500/40 text-purple-100" />
          </div>

          <!-- Daily Results Compact Grid -->
          <div>
            <label class="text-xs text-purple-300/80 mb-2 block">Server Battle Results (Days 1-6)</label>
            <div class="grid grid-cols-6 gap-2">
              <div v-for="day in 6" :key="day" class="flex flex-col items-center gap-1 bg-purple-950/50 p-2 rounded">
                <span class="text-xs text-purple-300 font-semibold">D{{ day }}</span>
                <div class="flex gap-1">
                  <button 
                    @click="updateKvkDayResult(day - 1, kvkGlobalSettings.dailyResults[day - 1] === 'win' ? null : 'win')"
                    :class="[
                      'w-6 h-6 rounded text-xs font-bold transition-all',
                      kvkGlobalSettings.dailyResults[day - 1] === 'win' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-purple-900/50 text-green-400 hover:bg-green-600/30'
                    ]">
                    W
                  </button>
                  <button 
                    @click="updateKvkDayResult(day - 1, kvkGlobalSettings.dailyResults[day - 1] === 'loss' ? null : 'loss')"
                    :class="[
                      'w-6 h-6 rounded text-xs font-bold transition-all',
                      kvkGlobalSettings.dailyResults[day - 1] === 'loss' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-purple-900/50 text-red-400 hover:bg-red-600/30'
                    ]">
                    L
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Invasion Status Indicator -->
        <div v-if="invasionStatus" class="mt-3 flex items-center justify-center gap-2 p-2 rounded-lg"
          :class="invasionStatus === 'can-invade' ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'">
          <Shield v-if="invasionStatus === 'can-invade'" class="w-4 h-4 text-green-400" />
          <Sword v-if="invasionStatus === 'can-be-invaded'" class="w-4 h-4 text-red-400" />
          <span class="text-xs font-semibold" :class="invasionStatus === 'can-invade' ? 'text-green-300' : 'text-red-300'">
            {{ invasionStatus === 'can-invade' ? 'Defensive Advantage (Won 3+ Prep Days)' : 'Invasion Risk (Lost 3+ Prep Days)' }}
          </span>
        </div>
      </div>

      <!-- Guild Management Section -->
      <div
        class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-lime-400/30 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <Shield class="w-5 h-5 text-lime-400" />
            <h2 class="text-lg sm:text-xl font-bold text-lime-300">Guild Data</h2>
          </div>

          <Button @click="addGuild" size="sm"
            class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold shadow-lg transition-all">
            <Plus class="w-4 h-4 mr-1" />
            Add Guild
          </Button>
        </div>

        <!-- Guild Cards (Mobile) -->
        <div class="block lg:hidden space-y-4">
          <div v-for="(guild, index) in guilds" :key="`guild-mobile-${index}`"
            class="bg-green-950/50 rounded-xl p-4 border-2 border-lime-500/30 hover:border-lime-400/50 transition-all">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-lime-400 font-bold">#{{ index + 1 }}</span>
                <Badge v-if="getGvGStatus(guild) !== 'Unknown'" :class="getStatusBadgeClass(guild)">
                  {{ getGvGStatus(guild) }}
                </Badge>
                <Sparkles v-if="isFlawless(guild)" 
                  class="w-4 h-4 text-yellow-400 animate-pulse" 
                  :title="'Flawless Victory! Won all 6 days'" />
                <Shield v-if="getGuildInvasionStatus(guild) === 'can-invade'" 
                  class="w-3.5 h-3.5 text-green-400" 
                  :title="'Defensive Advantage: Won 3+ of first 5 days'" />
                <Sword v-if="getGuildInvasionStatus(guild) === 'can-be-invaded'" 
                  class="w-3.5 h-3.5 text-red-400" 
                  :title="'Invasion Risk: Lost 3+ of first 5 days'" />
              </div>
              <Button @click="removeGuild(index)" size="sm" variant="ghost" class="text-red-400 hover:bg-red-500/20">
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
            
            <div v-if="getGvGStatus(guild) !== 'Unknown'" class="text-xs text-lime-300/60 mb-3">
              GvG: {{ getGvGWins(guild) }}W-{{ getGvGLosses(guild) }}L ({{ getGvGPoints(guild) }} pts)
            </div>

            <div class="space-y-3">
              <div>
                <label class="text-xs text-lime-300/80 mb-1 block">Shorthand</label>
                <Input v-model="guild.shorthand" placeholder="e.g., ABC" maxlength="5"
                  :class="['bg-green-950/70 border-lime-500/40 text-lime-100', !guild.shorthand && 'border-red-500/50']" />
              </div>
              <div>
                <label class="text-xs text-lime-300/80 mb-1 block">Guild Name</label>
                <Input v-model="guild.name" placeholder="Guild Name"
                  :class="['bg-green-950/70 border-lime-500/40 text-lime-100', !guild.name && 'border-red-500/50']" />
              </div>

              <div>
                <label class="text-xs text-lime-300/80 mb-1 block">Guild Power</label>
                <Input :model-value="formatPowerDisplay(guild.guildPower)"
                  @input="(e) => updatePower(guild, e.target.value)"
                  @blur="(e) => e.target.value = formatPowerDisplay(guild.guildPower)" placeholder="1,000,000,000"
                  class="bg-green-950/70 border-lime-500/40 text-lime-100" />
              </div>

              <!-- GvG Section -->
              <div class="border-t border-lime-500/20 pt-3">
                <Button @click="openGvGModal(guild, index)" variant="ghost" size="sm"
                  class="w-full flex items-center justify-between text-lime-300">
                  <span class="flex items-center gap-2">
                    <Sword class="w-4 h-4" />
                    GvG Data
                    <span v-if="getGvGTotalScore(guild) > 0" class="text-xs text-lime-400/80">
                      ({{ formatNumberShort(getGvGTotalScore(guild)) }})
                    </span>
                  </span>
                  <ChevronRight class="w-4 h-4" />
                </Button>
              </div>

              <!-- KvK Prep Section -->
              <div class="border-t border-lime-500/20 pt-3">
                <Button @click="openKvKModal(guild, index)" variant="ghost" size="sm"
                  class="w-full flex items-center justify-between text-lime-300">
                  <span class="flex items-center gap-2">
                    <Calendar class="w-4 h-4" />
                    KvK Prep & War
                    <span v-if="getKvKTotalScore(guild) > 0" class="text-xs text-lime-400/80">
                      ({{ formatNumberShort(getKvKTotalScore(guild)) }})
                    </span>
                  </span>
                  <ChevronRight class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Guild Table (Desktop) -->
        <div class="hidden lg:block overflow-x-auto custom-scrollbar">
          <table class="w-full">
            <thead class="bg-green-950/70 sticky top-0">
              <tr>
                <th class="text-left p-3 text-lime-300 font-semibold">#</th>
                <th class="text-left p-3 text-lime-300 font-semibold">Shorthand</th>
                <th class="text-left p-3 text-lime-300 font-semibold">Guild Name</th>
                <th class="text-left p-3 text-lime-300 font-semibold">Power</th>
                <th v-if="gvgEnabled" class="text-left p-3 text-lime-300 font-semibold">GvG</th>
                <th v-if="kvkEnabled" class="text-left p-3 text-lime-300 font-semibold">KvK</th>
                <th class="text-left p-3 text-lime-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(guild, index) in guilds" :key="`guild-desktop-${index}`"
                class="border-b border-lime-500/20 hover:bg-green-950/30 transition-colors">
                <td class="p-3 text-lime-400 font-bold">{{ index + 1 }}</td>
                <td class="p-3">
                  <Input v-model="guild.shorthand" placeholder="ABC" maxlength="5"
                    :class="['bg-green-950/70 border-lime-500/40 text-lime-100 w-24', !guild.shorthand && 'border-red-500/50']" />
                </td>
                <td class="p-3">
                  <Input v-model="guild.name" placeholder="Guild Name"
                    :class="['bg-green-950/70 border-lime-500/40 text-lime-100', !guild.name && 'border-red-500/50']" />
                </td>
                <td class="p-3">
                  <Input :model-value="formatPowerDisplay(guild.guildPower)"
                    @input="(e) => updatePower(guild, e.target.value)"
                    @blur="(e) => e.target.value = formatPowerDisplay(guild.guildPower)" placeholder="1,000,000,000"
                    class="bg-green-950/70 border-lime-500/40 text-lime-100 w-40" />
                </td>
                <td v-if="gvgEnabled" class="p-3">
                  <div class="flex items-center gap-2">
                    <Button @click="openGvGModal(guild, index)" variant="ghost" size="sm"
                      class="text-lime-300 bg-lime-600/20 hover:bg-lime-500/20">
                      <Sword class="w-4 h-4 mr-1" />
                      <span v-if="getGvGTotalScore(guild) > 0">
                        {{ formatNumberShort(getGvGTotalScore(guild)) }}
                      </span>
                      <span v-else>Edit</span>
                    </Button>
                    <div v-if="getGvGStatus(guild) !== 'Unknown'" class="flex items-center gap-1">
                      <Badge :class="getStatusBadgeClass(guild)">
                        {{ getGvGStatus(guild) }}
                      </Badge>
                      <Sparkles v-if="isFlawless(guild)" 
                        class="w-4 h-4 text-yellow-400 animate-pulse" 
                        :title="'Flawless Victory! Won all 6 days'" />
                      <Shield v-if="getGuildInvasionStatus(guild) === 'can-invade'" 
                        class="w-3.5 h-3.5 text-green-400" 
                        :title="'Defensive Advantage: Won 3+ of first 5 days'" />
                      <Sword v-if="getGuildInvasionStatus(guild) === 'can-be-invaded'" 
                        class="w-3.5 h-3.5 text-red-400" 
                        :title="'Invasion Risk: Lost 3+ of first 5 days'" />
                    </div>
                  </div>
                  <div v-if="getGvGStatus(guild) !== 'Unknown'" class="text-xs text-lime-300/60 mt-1">
                    {{ getGvGWins(guild) }}W-{{ getGvGLosses(guild) }}L ({{ getGvGPoints(guild) }} pts)
                  </div>
                </td>
                <td v-if="kvkEnabled" class="p-3">
                  <Button @click="openKvKModal(guild, index)" variant="ghost" size="sm"
                    class="text-lime-300 bg-lime-600/20 hover:bg-lime-500/20">
                    <Calendar class="w-4 h-4 mr-1" />
                    <span v-if="getKvKTotalScore(guild) > 0">
                      {{ formatNumberShort(getKvKTotalScore(guild)) }}
                    </span>
                    <span v-else>Edit</span>
                  </Button>
                </td>
                <td class="p-3">
                  <Button @click="removeGuild(index)" size="sm" variant="ghost"
                    class="text-red-400 hover:bg-red-500/20">
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Insights Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-xl p-6 border-2 border-lime-400/30">
          <div class="flex items-center gap-2 mb-3">
            <Zap class="w-6 h-6 text-lime-400" />
            <h3 class="text-lg text-lime-300 font-semibold">Total Server Power</h3>
          </div>
          <p class="text-3xl font-bold text-lime-200">{{ totalServerPowerFormatted }}</p>
          <p class="text-sm text-lime-300/60 mt-1">{{ guilds.length }} guild{{ guilds.length !== 1 ? 's' : '' }}</p>
        </div>

        <div
          class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-xl p-6 border-2 border-lime-400/30">
          <div class="flex items-center gap-2 mb-3">
            <Trophy class="w-6 h-6 text-lime-400" />
            <h3 class="text-lg text-lime-300 font-semibold">Top Performing Guild</h3>
          </div>
          <p class="text-3xl font-bold text-lime-200">{{ topPerformingGuild }}</p>
          <p v-if="topPerformingGuild !== 'N/A'" class="text-sm text-lime-300/60 mt-1">{{ topPerformingGuildScore }}</p>
        </div>

        <div
          class="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-lg rounded-xl p-6 border-2 border-lime-400/30">
          <div class="flex items-center gap-2 mb-3">
            <Target class="w-6 h-6 text-lime-400" />
            <h3 class="text-lg text-lime-300 font-semibold">Most Efficient Guild</h3>
          </div>
          <p class="text-3xl font-bold text-lime-200">{{ mostEfficientGuild }}</p>
          <p v-if="mostEfficientGuild !== 'N/A'" class="text-sm text-lime-300/60 mt-1">{{ mostEfficientGuildRatio }}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center pb-8">
        <Button @click="navigateToRankings" size="lg"
          class="bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-500 hover:to-green-500 text-white font-bold shadow-xl">
          <Trophy class="w-5 h-5 mr-2" />
          Set Weights
        </Button>
      </div>
    </div>

    <!-- GvG Modal -->
    <div v-if="showGvGModal && selectedGuild" @click="closeGvGModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div @click.stop :key="`gvg-modal-${selectedGuildIndex}-${modalKey}`"
        class="bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl p-6 border-2 border-lime-400/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-lime-300 flex items-center gap-2">
            <Sword class="w-5 h-5" />
            GvG Data - {{ selectedGuild.shorthand || `Guild ${selectedGuildIndex + 1}` }}
          </h3>
          <Button @click="closeGvGModal" size="sm" variant="ghost" class="text-lime-300 bg-lime-600/20 hover:bg-lime-500/20">
            <X class="w-5 h-5" />
          </Button>
        </div>

        <!-- Input Mode Toggle -->
        <div class="mb-4 bg-green-950/50 p-3 rounded-lg border border-lime-500/30">
          <div class="flex items-center justify-between">
            <span class="text-sm text-lime-300 font-semibold">Input Mode:</span>
            <Select v-model="modalGvgInputMode">
              <SelectTrigger class="w-48 bg-green-950/70 border-lime-500/40 text-lime-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent class="bg-green-800 border-lime-500 text-lime-100">
                <SelectItem value="daily">Daily Breakdown</SelectItem>
                <SelectItem value="simple">Simple Win/Loss</SelectItem>
                <SelectItem value="total">Total Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-sm text-lime-300/80 mb-2 block">Opponent</label>
            <Input v-model="selectedGuild.gvgOpponent" placeholder="Opponent guild"
              class="bg-green-950/70 border-lime-500/40 text-lime-100" />
          </div>

          <!-- Daily Input Mode -->
          <div v-if="modalGvgInputMode === 'daily'">
            <label class="text-sm text-lime-300/80 mb-3 block">6-Day Battle Record</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div v-for="day in 6" :key="`gvg-day-${day}`"
                class="bg-green-950/50 p-4 rounded-lg border border-lime-500/30">
                <div class="text-sm text-lime-300 font-semibold mb-3 text-center">Day {{ day }}</div>
                <div class="space-y-3">
                  <div>
                    <label class="text-xs text-lime-300/80 mb-1 block">Score</label>
                    <Input :model-value="formatPowerDisplay(selectedGuild.gvgDays[day - 1]?.score)"
                      @input="(e) => updateGvGScore(day - 1, e.target.value)"
                      @blur="(e) => e.target.value = formatPowerDisplay(selectedGuild.gvgDays[day - 1]?.score)"
                      placeholder="0" class="bg-green-950/70 border-lime-500/40 text-lime-100" />
                  </div>
                  <div class="flex items-center gap-2 justify-center">
                    <Checkbox :id="`modal-gvg-day-${day}`" v-model:checked="selectedGuild.gvgDays[day - 1].won"
                      class="border-lime-500/40 data-[state=checked]:bg-green-600" />
                    <label :for="`modal-gvg-day-${day}`" class="text-sm text-lime-300/80 cursor-pointer">Won</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Simple Win/Loss Mode -->
          <div v-else-if="modalGvgInputMode === 'simple'">
            <div class="flex justify-center">
              <div class="bg-green-950/70 p-8 rounded-lg border-2 border-lime-400/50 w-full max-w-md">
                <div class="text-lg text-lime-300 font-bold mb-6 text-center">GvG Outcome</div>
                <div class="flex justify-center gap-6">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="radio" 
                      :checked="selectedGuild.gvgSimpleResult === 'won'"
                      @change="selectedGuild.gvgSimpleResult = 'won'"
                      class="w-5 h-5 text-green-600 border-lime-500/40 focus:ring-lime-500"
                    />
                    <span class="text-lg text-green-400 font-semibold">Won</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="radio" 
                      :checked="selectedGuild.gvgSimpleResult === 'lost'"
                      @change="selectedGuild.gvgSimpleResult = 'lost'"
                      class="w-5 h-5 text-red-600 border-lime-500/40 focus:ring-lime-500"
                    />
                    <span class="text-lg text-red-400 font-semibold">Lost</span>
                  </label>
                </div>
                <p class="text-xs text-lime-300/60 mt-4 text-center">
                  For historical data where you only know the final outcome
                </p>
              </div>
            </div>
          </div>

          <!-- Total Input Mode -->
          <div v-else-if="modalGvgInputMode === 'total'">
            <label class="text-sm text-lime-300/80 mb-2 block">Total GvG Score</label>
            <Input :model-value="formatPowerDisplay(selectedGuild.gvgTotalScore)"
              @input="(e) => updateGvGTotalScore(e.target.value)"
              @blur="(e) => e.target.value = formatPowerDisplay(selectedGuild.gvgTotalScore)"
              placeholder="Enter total score"
              class="bg-green-950/70 border-lime-500/40 text-lime-100 text-lg" />
            <p class="text-xs text-lime-300/60 mt-2">
              Enter the combined total score across all 6 days
            </p>
          </div>

          <div class="bg-green-950/50 p-4 rounded-lg border border-lime-500/30">
            <div class="grid grid-cols-3 gap-4 text-sm">
              <div class="text-center">
                <div class="text-lime-300/60 mb-1">Total Score</div>
                <div class="text-lime-300 font-bold text-lg">{{ getGvGTotalScore(selectedGuild, true).toLocaleString() }}
                </div>
              </div>
              <div class="text-center">
                <div class="text-lime-300/60 mb-1">Record</div>
                <div class="text-lime-300 font-bold text-lg">{{ getGvGWins(selectedGuild) }}W - {{
                  getGvGLosses(selectedGuild) }}L</div>
                <div class="text-lime-300/60 text-sm mt-1">{{ getGvGPoints(selectedGuild) }} points</div>
              </div>
              <div class="text-center">
                <div class="text-lime-300/60 mb-1">Status</div>
                <div class="flex items-center justify-center gap-2">
                  <div :class="[
                    'font-bold text-lg',
                    getGvGStatus(selectedGuild, true) === 'Won' ? 'text-green-400' :
                      getGvGStatus(selectedGuild, true) === 'Lost' ? 'text-red-400' :
                        getGvGStatus(selectedGuild, true) === 'Winning' ? 'text-lime-400' :
                          getGvGStatus(selectedGuild, true) === 'Losing' ? 'text-orange-400' :
                            getGvGStatus(selectedGuild, true) === 'Tied' ? 'text-yellow-400' :
                              'text-lime-300'
                  ]">{{ getGvGStatus(selectedGuild, true) }}</div>
                  <Sparkles v-if="isFlawless(selectedGuild)" 
                    class="w-5 h-5 text-yellow-400 animate-pulse" 
                    :title="'Flawless Victory! Won all 6 days'" />
                  <Shield v-if="getGuildInvasionStatus(selectedGuild) === 'can-invade'" 
                    class="w-4 h-4 text-green-400" 
                    :title="'Defensive Advantage: Won 3+ of first 5 days'" />
                  <Sword v-if="getGuildInvasionStatus(selectedGuild) === 'can-be-invaded'" 
                    class="w-4 h-4 text-red-400" 
                    :title="'Invasion Risk: Lost 3+ of first 5 days'" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <Button @click="closeGvGModal" class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold">
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- KvK Modal -->
    <div v-if="showKvKModal && selectedGuild" @click="closeKvKModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div @click.stop :key="`kvk-modal-${selectedGuildIndex}-${modalKey}`"
        class="bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl p-6 border-2 border-lime-400/50 max-w-5xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-lime-300 flex items-center gap-2">
            <Calendar class="w-5 h-5" />
            KvK Data - {{ selectedGuild.shorthand || `Guild ${selectedGuildIndex + 1}` }}
          </h3>
          <Button @click="closeKvKModal" size="sm" variant="ghost" class="text-lime-300 bg-lime-600/20 hover:bg-lime-500/20">
            <X class="w-5 h-5" />
          </Button>
        </div>

        <!-- Input Mode Toggle -->
        <div class="mb-4 bg-green-950/50 p-3 rounded-lg border border-lime-500/30">
          <div class="flex items-center justify-between">
            <span class="text-sm text-lime-300 font-semibold">Input Mode:</span>
            <Select v-model="modalKvkInputMode">
              <SelectTrigger class="w-48 bg-green-950/70 border-lime-500/40 text-lime-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent class="bg-green-800 border-lime-500 text-lime-100">
                <SelectItem value="daily">Daily Breakdown</SelectItem>
                <SelectItem value="total">Total Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="space-y-6">
          <!-- Daily Input Mode -->
          <div v-if="modalKvkInputMode === 'daily'">
            <!-- Prep Days (1-5) -->
            <div>
              <div class="text-sm text-lime-300 font-semibold mb-3 flex items-center gap-2">
                <div class="h-px bg-lime-400/30 flex-1"></div>
                <span>Prep Stage (Days 1-5)</span>
                <div class="h-px bg-lime-400/30 flex-1"></div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div v-for="day in 5" :key="`kvk-prep-${day}`"
                  class="bg-green-950/50 p-4 rounded-lg border border-lime-500/30">
                  <div class="text-sm text-lime-300 font-semibold mb-3 text-center">Day {{ day }}</div>
                  <div class="space-y-3">
                    <div>
                      <label class="text-xs text-lime-300/80 mb-1 block">Score</label>
                      <Input :model-value="formatPowerDisplay(selectedGuild.kvkPrepDays[day - 1]?.score)"
                        @input="(e) => updateKvKScore(day - 1, e.target.value)"
                        @blur="(e) => e.target.value = formatPowerDisplay(selectedGuild.kvkPrepDays[day - 1]?.score)"
                        placeholder="0" class="bg-green-950/70 border-lime-500/40 text-lime-100" />
                    </div>
                    <div>
                      <label class="text-xs text-lime-300/80 mb-1 block">Rank</label>
                      <Input v-model.number="selectedGuild.kvkPrepDays[day - 1].rank" type="number" placeholder="1-50"
                        class="bg-green-950/70 border-lime-500/40 text-lime-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- War Day (6) -->
            <div>
              <div class="text-sm text-lime-300 font-semibold mb-3 flex items-center gap-2">
                <div class="h-px bg-red-400/30 flex-1"></div>
                <span class="text-red-300">War Day</span>
                <div class="h-px bg-red-400/30 flex-1"></div>
              </div>
              <div class="flex justify-center">
                <div class="bg-green-950/70 p-6 rounded-lg border-2 border-red-400/50 w-full max-w-md">
                  <div class="text-lg text-red-300 font-bold mb-4 text-center">Day 6</div>
                  <div class="space-y-4">
                    <div>
                      <label class="text-sm text-lime-300/80 mb-2 block">Score</label>
                      <Input :model-value="formatPowerDisplay(selectedGuild.kvkPrepDays[5]?.score)"
                        @input="(e) => updateKvKScore(5, e.target.value)"
                        @blur="(e) => e.target.value = formatPowerDisplay(selectedGuild.kvkPrepDays[5]?.score)"
                        placeholder="0" class="bg-green-950/70 border-lime-500/40 text-lime-100" />
                    </div>
                    <div>
                      <label class="text-sm text-lime-300/80 mb-2 block">Rank</label>
                      <Input v-model.number="selectedGuild.kvkPrepDays[5].rank" type="number" placeholder="1-50"
                        class="bg-green-950/70 border-lime-500/40 text-lime-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Input Mode -->
          <div v-else>
            <label class="text-sm text-lime-300/80 mb-2 block">Total KvK Score</label>
            <Input :model-value="formatPowerDisplay(selectedGuild.kvkTotalScore)"
              @input="(e) => updateKvKTotalScore(e.target.value)"
              @blur="(e) => e.target.value = formatPowerDisplay(selectedGuild.kvkTotalScore)"
              placeholder="Enter total score"
              class="bg-green-950/70 border-lime-500/40 text-lime-100 text-lg" />
            <p class="text-xs text-lime-300/60 mt-2">
              Enter the combined total score across all 6 days (prep + war)
            </p>
          </div>

          <div class="bg-green-950/50 p-4 rounded-lg border border-lime-500/30">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="text-center">
                <div class="text-lime-300/60 mb-1">Total Score</div>
                <div class="text-lime-300 font-bold text-lg">{{ getKvKTotalScore(selectedGuild, true).toLocaleString() }}
                </div>
              </div>
              <div class="text-center">
                <div class="text-lime-300/60 mb-1">vs Server</div>
                <div class="text-lime-300 font-bold text-lg">{{ kvkGlobalSettings.opponentServer || 'Not set' }}</div>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <Button @click="closeKvKModal" class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold">
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Discord Export Modal -->
    <Dialog v-model:open="showDiscordExportModal">
      <DialogContent class="bg-gradient-to-br from-green-900/95 to-emerald-900/95 border-2 border-lime-400/30 text-lime-100 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="text-2xl font-bold text-lime-300 flex items-center gap-2">
            <MessageSquare class="w-6 h-6" />
            Discord Export Builder
          </DialogTitle>
          <DialogDescription class="text-lime-200/80">
            Select which sections to include in your Discord-formatted message
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 mt-4">
          <!-- Export Options -->
          <div class="bg-green-950/50 rounded-lg p-4 border border-lime-500/30">
            <h3 class="font-semibold text-lime-300 mb-3">Select Sections to Export</h3>
            <div class="space-y-3">
              <!-- GvG Options -->
              <div class="space-y-2">
                <div class="text-sm font-semibold text-lime-400">GvG Rankings</div>
                <div class="flex items-center space-x-2 ml-4">
                  <Checkbox id="dayByDay" v-model:checked="discordExportOptions.dayByDayScores"
                    :disabled="!hasGvGData"
                    class="border-lime-500/40 data-[state=checked]:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed" />
                  <label for="dayByDay" :class="['text-sm cursor-pointer', hasGvGData ? 'text-lime-200' : 'text-lime-200/50']">Day-by-Day Scores</label>
                </div>
                <div class="flex items-center space-x-2 ml-4">
                  <Checkbox id="totalScore" v-model:checked="discordExportOptions.totalScoreRanking"
                    :disabled="!hasGvGData"
                    class="border-lime-500/40 data-[state=checked]:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed" />
                  <label for="totalScore" :class="['text-sm cursor-pointer', hasGvGData ? 'text-lime-200' : 'text-lime-200/50']">Total Score Ranking</label>
                </div>
                <div class="flex items-center space-x-2 ml-4">
                  <Checkbox id="gvgWinRecord" v-model:checked="discordExportOptions.gvgWinRecord"
                    :disabled="!hasGvGData"
                    class="border-lime-500/40 data-[state=checked]:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed" />
                  <label for="gvgWinRecord" :class="['text-sm cursor-pointer', hasGvGData ? 'text-lime-200' : 'text-lime-200/50']">GvG Win/Loss Record</label>
                </div>
              </div>

              <Separator class="bg-lime-500/20" />

              <!-- Overall Rankings -->
              <div class="space-y-2">
                <div class="text-sm font-semibold text-lime-400">Other Rankings</div>
                <div class="flex items-center space-x-2 ml-4">
                  <Checkbox id="power" v-model:checked="discordExportOptions.powerRanking"
                    :disabled="!hasPowerData"
                    class="border-lime-500/40 data-[state=checked]:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed" />
                  <label for="power" :class="['text-sm cursor-pointer', hasPowerData ? 'text-lime-200' : 'text-lime-200/50']">Power Ranking</label>
                </div>
                <div class="flex items-center space-x-2 ml-4">
                  <Checkbox id="efficiency" v-model:checked="discordExportOptions.efficiencyRanking"
                    :disabled="!hasGvGData || !hasPowerData"
                    class="border-lime-500/40 data-[state=checked]:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed" />
                  <label for="efficiency" :class="['text-sm cursor-pointer', (hasGvGData && hasPowerData) ? 'text-lime-200' : 'text-lime-200/50']">Efficiency Ranking (%)</label>
                </div>
              </div>

              <Separator class="bg-lime-500/20" />

              <!-- KvK Options -->
              <div class="space-y-2">
                <div class="text-sm font-semibold text-lime-400">KvK Rankings</div>
                <div class="flex items-center space-x-2 ml-4">
                  <Checkbox id="kvkPrep" v-model:checked="discordExportOptions.kvkPrepRanking"
                    :disabled="!hasKvKPrepData"
                    class="border-lime-500/40 data-[state=checked]:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed" />
                  <label for="kvkPrep" :class="['text-sm cursor-pointer', hasKvKPrepData ? 'text-lime-200' : 'text-lime-200/50']">KvK Prep Ranking</label>
                </div>
                <div class="flex items-center space-x-2 ml-4">
                  <Checkbox id="war" v-model:checked="discordExportOptions.warRanking"
                    :disabled="!hasWarData"
                    class="border-lime-500/40 data-[state=checked]:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed" />
                  <label for="war" :class="['text-sm cursor-pointer', hasWarData ? 'text-lime-200' : 'text-lime-200/50']">War Day Ranking</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Preview Section -->
          <div class="bg-green-950/70 rounded-lg p-4 border border-purple-500/30">
            <h3 class="font-semibold text-purple-300 mb-2 flex items-center gap-2">
              <Eye class="w-4 h-4" />
              Preview
            </h3>
            <div class="bg-black/30 rounded p-3 max-h-64 overflow-y-auto custom-scrollbar">
              <pre class="text-xs text-lime-100 whitespace-pre-wrap font-mono">{{ discordPreview }}</pre>
            </div>
            <p class="text-xs text-lime-300/60 mt-2">
              {{ guilds.filter(g => g.shorthand).length }} guilds • Showing preview of selected sections
            </p>
          </div>

          <!-- Copy Success Message -->
          <div v-if="discordCopySuccess"
            class="p-3 rounded bg-lime-500/20 border border-lime-400/50 text-lime-200 text-sm flex items-center gap-2">
            <CheckCircle class="w-4 h-4" />
            <span>Copied to clipboard!</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-2">
            <Button @click="showDiscordExportModal = false" variant="outline"
              class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20">
              Cancel
            </Button>
            <Button @click="copyDiscordFormat"
              class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold">
              <Copy class="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Shield, Plus, Trash2, Save, Upload, Download, RefreshCw, FileUp, FileDown,
  Database, Users, AlertCircle, CheckCircle, AlertTriangle, Sword, Calendar,
  Trophy, ChevronDown, X, Globe, ChevronRight, Zap, Target, MessageSquare, Copy, Eye, Sparkles, Settings
} from 'lucide-vue-next'

import { useRouter } from 'vue-router'
import { useGuildDataStore } from '@/stores/useGuildDataStore'

const router = useRouter()
const guildStore = useGuildDataStore()

// Refs
const datasetId = ref('')
const newDatasetName = ref('')
const guilds = ref([])
const availableDatasets = ref([])
const isLoading = ref(false)
const lastSaved = ref('')
const statusMessage = ref('')
const statusType = ref('info')
const fileInput = ref(null)
const kvkEnabled = ref(false)
const modalKey = ref(0) // Force modal re-render

// NEW: Input control toggles
const gvgEnabled = ref(true)
const gvgInputMode = ref('daily') // 'daily' or 'total'
const kvkInputMode = ref('daily') // 'daily' or 'total'

// FIXED: Modal-specific input modes (temporary, only affect current modal)
const modalGvgInputMode = ref('daily')
const modalKvkInputMode = ref('daily')

// Modal refs
const showGvGModal = ref(false)
const showKvKModal = ref(false)
const selectedGuild = ref(null)
const selectedGuildIndex = ref(-1)

// Discord export modal refs
const showDiscordExportModal = ref(false)
const discordCopySuccess = ref(false)
const discordExportOptions = ref({
  dayByDayScores: true,
  totalScoreRanking: true,
  powerRanking: true,
  warRanking: true,
  efficiencyRanking: true,
  gvgWinRecord: true,
  kvkPrepRanking: false
})

// Check if data exists for each section
const hasGvGData = computed(() => {
  if (!gvgEnabled.value) return false
  return guilds.value.some(g => {
    if (gvgInputMode.value === 'total') {
      return g.gvgTotalScore !== null && g.gvgTotalScore !== undefined && g.gvgTotalScore > 0
    } else if (gvgInputMode.value === 'simple') {
      return g.gvgSimpleResult !== null && g.gvgSimpleResult !== undefined
    } else {
      return g.gvgDays && g.gvgDays.some(day => day?.score !== null && day?.score !== undefined)
    }
  })
})

const hasKvKPrepData = computed(() => {
  if (!kvkEnabled.value) return false
  return guilds.value.some(g => {
    if (kvkInputMode.value === 'total') {
      return g.kvkTotalScore !== null && g.kvkTotalScore !== undefined && g.kvkTotalScore > 0
    } else {
      return g.kvkPrepDays && g.kvkPrepDays.slice(0, 5).some(day => day?.score !== null && day?.score !== undefined)
    }
  })
})

const hasWarData = computed(() => {
  if (!kvkEnabled.value) return false
  return guilds.value.some(g => 
    g.kvkPrepDays && g.kvkPrepDays[5]?.score !== null && g.kvkPrepDays[5]?.score !== undefined
  )
})

const hasPowerData = computed(() => {
  return guilds.value.some(g => g.guildPower != null && g.guildPower > 0)
})

// Calculate invasion status based on first 5 days
const invasionStatus = computed(() => {
  if (!kvkGlobalSettings.value.dailyResults) return null
  
  const first5Days = kvkGlobalSettings.value.dailyResults.slice(0, 5)
  const wins = first5Days.filter(r => r === 'win').length
  const losses = first5Days.filter(r => r === 'loss').length
  
  if (wins >= 3) {
    return 'can-invade'
  } else if (losses >= 3) {
    return 'can-be-invaded'
  }
  return null
})

// Watch for data availability changes and uncheck disabled options
watch([hasGvGData, hasKvKPrepData, hasWarData, hasPowerData], () => {
  if (!hasGvGData.value) {
    discordExportOptions.value.dayByDayScores = false
    discordExportOptions.value.totalScoreRanking = false
    discordExportOptions.value.gvgWinRecord = false
  }
  if (!hasKvKPrepData.value) {
    discordExportOptions.value.kvkPrepRanking = false
  }
  if (!hasWarData.value) {
    discordExportOptions.value.warRanking = false
  }
  if (!hasPowerData.value) {
    discordExportOptions.value.powerRanking = false
  }
  if (!hasGvGData.value || !hasPowerData.value) {
    discordExportOptions.value.efficiencyRanking = false
  }
})

// Discord preview computed
const discordPreview = computed(() => {
  const opts = discordExportOptions.value
  let preview = `## ${datasetId.value || 'Guild Rankings'}\n\n`
  
  // Create sample rankings data (just top 3 for preview)
  const sampleGuilds = guilds.value
    .filter(g => g.shorthand)
    .slice(0, 3)
    .map((g, i) => {
      const wins = getGvGWins(g)
      const losses = getGvGLosses(g)
      
      // Calculate points for preview
      let currentPoints = 0
      for (let i = 0; i < 5; i++) {
        if (g.gvgDays?.[i]?.won) currentPoints += 2
      }
      if (g.gvgDays?.[5]?.won) currentPoints += 4
      
      return {
        shorthand: g.shorthand,
        score: getGvGTotalScore(g),
        wins,
        losses,
        currentPoints,
        power: g.guildPower || 0,
        efficiency: g.guildPower && g.guildPower > 0 ? (getGvGTotalScore(g) / g.guildPower * 100).toFixed(2) : 0
      }
    })

  if (sampleGuilds.length === 0) {
    return 'Add guilds to see preview...'
  }

  // Count selected sections
  let sectionCount = 0
  
  if (opts.gvgWinRecord) {
    sectionCount++
    preview += `## 🏆 GvG Win/Loss Record\n`
    sampleGuilds.forEach((g, i) => {
      const status = g.currentPoints >= 7 ? '✅ WIN' : g.wins > g.losses ? '📈 Winning' : '📉 Losing'
      preview += `${i + 1}. **${g.shorthand}** - ${g.wins}W-${g.losses}L (${g.currentPoints} pts) ${status}\n`
    })
    preview += `...\n\n`
  }

  if (opts.dayByDayScores) {
    sectionCount++
    preview += `## ⚔️ Day 1 Scores\n`
    preview += `1. **${sampleGuilds[0]?.shorthand || 'GUILD1'}** - 1,250,000 **(W)**\n`
    preview += `...(days with data)\n\n`
  }

  if (opts.totalScoreRanking) {
    sectionCount++
    preview += `## 📊 Total GvG Score Ranking\n`
    sampleGuilds.forEach((g, i) => {
      preview += `${i + 1}. **${g.shorthand}** - ${g.score.toLocaleString()}\n`
    })
    preview += `...\n\n`
  }

  if (opts.powerRanking) {
    sectionCount++
    preview += `## 💪 Guild Power Ranking\n`
    sampleGuilds.forEach((g, i) => {
      preview += `${i + 1}. **${g.shorthand}** - ${g.power.toLocaleString()}\n`
    })
    preview += `...\n\n`
  }

  if (opts.efficiencyRanking) {
    sectionCount++
    preview += `## ⚡ Efficiency Ranking\n`
    sampleGuilds.forEach((g, i) => {
      preview += `${i + 1}. **${g.shorthand}** - ${g.efficiency}%\n`
    })
    preview += `...\n\n`
  }

  if (opts.kvkPrepRanking) {
    sectionCount++
    preview += `## 🛡️ KvK Prep Ranking\n...\n\n`
  }

  if (opts.warRanking) {
    sectionCount++
    preview += `## ⚔️ War Day Ranking\n...\n\n`
  }

  if (opts.overallRanking) {
    sectionCount++
    preview += `## 🏅 Overall Combined Ranking\n...\n\n`
  }

  if (sectionCount === 0) {
    return 'Select at least one section to export...'
  }

  if (kvkGlobalSettings.value.opponentServer) {
    preview += `\n*vs ${kvkGlobalSettings.value.opponentServer}*\n`
  }
  preview += `*Generated: ${new Date().toLocaleDateString()}*`

  return preview
})

// KvK Global Settings - now with 6 days
const kvkGlobalSettings = ref({
  opponentServer: '',
  dailyResults: [null, null, null, null, null, null] // 6 days now
})

// Create empty guild with new structure (now 6 KvK days)
const createEmptyGuild = () => ({
  name: '',
  shorthand: '',
  guildPower: null,
  gvgOpponent: '',
  gvgDays: [
    { score: null, won: false },
    { score: null, won: false },
    { score: null, won: false },
    { score: null, won: false },
    { score: null, won: false },
    { score: null, won: false }
  ],
  gvgTotalScore: null, // NEW: For total input mode
  gvgSimpleResult: null, // NEW: For simple win/loss mode ('won' or 'lost')
  kvkPrepDays: [
    { score: null, rank: null },
    { score: null, rank: null },
    { score: null, rank: null },
    { score: null, rank: null },
    { score: null, rank: null },
    { score: null, rank: null } // Added day 6
  ],
  kvkTotalScore: null // NEW: For total input mode
})

// Normalize guild data to ensure 6 KvK days (for backward compatibility)
const normalizeGuildData = (guild) => {
  // Start with empty guild structure
  const normalized = createEmptyGuild()

  // Copy primitive values
  normalized.name = guild.name ?? ''
  normalized.shorthand = guild.shorthand ?? ''
  normalized.guildPower = guild.guildPower ?? null
  normalized.gvgOpponent = guild.gvgOpponent ?? ''
  normalized.gvgTotalScore = guild.gvgTotalScore ?? null // NEW
  normalized.gvgSimpleResult = guild.gvgSimpleResult ?? null // NEW
  normalized.kvkTotalScore = guild.kvkTotalScore ?? null // NEW

  // Deep copy and ensure kvkPrepDays has exactly 6 days
  if (guild.kvkPrepDays && Array.isArray(guild.kvkPrepDays)) {
    normalized.kvkPrepDays = guild.kvkPrepDays.map(day => ({
      score: day?.score ?? null,
      rank: day?.rank ?? null
    }))
    // Pad with empty days if less than 6
    while (normalized.kvkPrepDays.length < 6) {
      normalized.kvkPrepDays.push({ score: null, rank: null })
    }
    // Trim if more than 6
    if (normalized.kvkPrepDays.length > 6) {
      normalized.kvkPrepDays = normalized.kvkPrepDays.slice(0, 6)
    }
  }

  // Deep copy and ensure gvgDays has exactly 6 days
  if (guild.gvgDays && Array.isArray(guild.gvgDays)) {
    normalized.gvgDays = guild.gvgDays.map(day => ({
      score: day?.score ?? null,
      won: day?.won ?? false
    }))
    while (normalized.gvgDays.length < 6) {
      normalized.gvgDays.push({ score: null, won: false })
    }
    if (normalized.gvgDays.length > 6) {
      normalized.gvgDays = normalized.gvgDays.slice(0, 6)
    }
  }

  return normalized
}

// ========== FIXED INPUT HANDLERS ==========

// FIXED: Auto-detect input modes based on data
const autoDetectGvgInputMode = (guilds) => {
  if (!guilds || guilds.length === 0) return 'daily'
  
  // Check if any guild has simple result data
  const hasSimpleResult = guilds.some(g => g.gvgSimpleResult !== null && g.gvgSimpleResult !== undefined)
  if (hasSimpleResult) return 'simple'
  
  // Check if any guild has total score (without daily data)
  const hasTotalScore = guilds.some(g => {
    const totalScore = g.gvgTotalScore !== null && g.gvgTotalScore !== undefined && g.gvgTotalScore > 0
    const hasDailyData = g.gvgDays && g.gvgDays.some(day => day?.score !== null && day?.score !== undefined)
    return totalScore && !hasDailyData
  })
  if (hasTotalScore) return 'total'
  
  // Default to daily if we have daily data or no data at all
  return 'daily'
}

const autoDetectKvkInputMode = (guilds) => {
  if (!guilds || guilds.length === 0) return 'daily'
  
  // Check if any guild has total score (without daily data)
  const hasTotalScore = guilds.some(g => {
    const totalScore = g.kvkTotalScore !== null && g.kvkTotalScore !== undefined && g.kvkTotalScore > 0
    const hasDailyData = g.kvkPrepDays && g.kvkPrepDays.some(day => day?.score !== null && day?.score !== undefined)
    return totalScore && !hasDailyData
  })
  if (hasTotalScore) return 'total'
  
  // Default to daily if we have daily data or no data at all
  return 'daily'
}

// ========== FIXED INPUT HANDLERS ==========

// Format number for display with commas
const formatPowerDisplay = (value) => {
  if (value === null || value === undefined || value === '') return ''
  const num = Number(value)
  if (isNaN(num)) return ''
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Update power value from input
const updatePower = (guild, value) => {
  const cleanValue = value.replace(/,/g, '')
  if (cleanValue === '' || cleanValue === null) {
    guild.guildPower = null
  } else {
    const num = Number(cleanValue)
    if (!isNaN(num)) {
      guild.guildPower = num
    }
  }
}

// Update GvG score
const updateGvGScore = (dayIndex, value) => {
  const cleanValue = value.replace(/,/g, '')
  if (selectedGuild.value && selectedGuild.value.gvgDays && selectedGuild.value.gvgDays[dayIndex]) {
    if (cleanValue === '' || cleanValue === null) {
      selectedGuild.value.gvgDays[dayIndex].score = null
    } else {
      const num = Number(cleanValue)
      if (!isNaN(num)) {
        selectedGuild.value.gvgDays[dayIndex].score = num
      }
    }
  }
}

// Update KvK score
const updateKvKScore = (dayIndex, value) => {
  const cleanValue = value.replace(/,/g, '')
  if (selectedGuild.value && selectedGuild.value.kvkPrepDays && selectedGuild.value.kvkPrepDays[dayIndex]) {
    if (cleanValue === '' || cleanValue === null) {
      selectedGuild.value.kvkPrepDays[dayIndex].score = null
    } else {
      const num = Number(cleanValue)
      if (!isNaN(num)) {
        selectedGuild.value.kvkPrepDays[dayIndex].score = num
      }
    }
  }
}

// NEW: Update GvG total score
const updateGvGTotalScore = (value) => {
  const cleanValue = value.replace(/,/g, '')
  if (selectedGuild.value) {
    if (cleanValue === '' || cleanValue === null) {
      selectedGuild.value.gvgTotalScore = null
    } else {
      const num = Number(cleanValue)
      if (!isNaN(num)) {
        selectedGuild.value.gvgTotalScore = num
      }
    }
  }
}

// NEW: Update KvK total score
const updateKvKTotalScore = (value) => {
  const cleanValue = value.replace(/,/g, '')
  if (selectedGuild.value) {
    if (cleanValue === '' || cleanValue === null) {
      selectedGuild.value.kvkTotalScore = null
    } else {
      const num = Number(cleanValue)
      if (!isNaN(num)) {
        selectedGuild.value.kvkTotalScore = num
      }
    }
  }
}

// ========== MODAL FUNCTIONS (FIXED) ==========

const openGvGModal = async (guild, index) => {
  // Normalize the guild data to ensure all structures are present
  const normalizedGuild = normalizeGuildData({
    name: guild.name,
    shorthand: guild.shorthand,
    guildPower: guild.guildPower,
    gvgOpponent: guild.gvgOpponent,
    gvgDays: guild.gvgDays,
    gvgTotalScore: guild.gvgTotalScore, // NEW
    gvgSimpleResult: guild.gvgSimpleResult, // NEW
    kvkPrepDays: guild.kvkPrepDays,
    kvkTotalScore: guild.kvkTotalScore // NEW
  })

  // Set the selected guild and index
  selectedGuildIndex.value = index
  selectedGuild.value = normalizedGuild
  
  // FIXED: Initialize modal-specific input mode from global setting
  modalGvgInputMode.value = gvgInputMode.value
  
  showGvGModal.value = true

  // Increment modal key to force re-render
  modalKey.value++

  // Wait for next tick to ensure modal is rendered
  await nextTick()
}

const closeGvGModal = () => {
  // Copy changes back to the original guild
  if (selectedGuild.value && selectedGuildIndex.value >= 0) {
    guilds.value[selectedGuildIndex.value].gvgOpponent = selectedGuild.value.gvgOpponent
    guilds.value[selectedGuildIndex.value].gvgDays = selectedGuild.value.gvgDays.map(day => ({
      score: day?.score ?? null,
      won: day?.won ?? false
    }))
    guilds.value[selectedGuildIndex.value].gvgTotalScore = selectedGuild.value.gvgTotalScore // NEW
    guilds.value[selectedGuildIndex.value].gvgSimpleResult = selectedGuild.value.gvgSimpleResult // NEW
  }
  showGvGModal.value = false
  selectedGuild.value = null
  selectedGuildIndex.value = -1
}

const openKvKModal = async (guild, index) => {
  // Normalize the guild data to ensure all structures are present
  const normalizedGuild = normalizeGuildData({
    name: guild.name,
    shorthand: guild.shorthand,
    guildPower: guild.guildPower,
    gvgOpponent: guild.gvgOpponent,
    gvgDays: guild.gvgDays,
    gvgTotalScore: guild.gvgTotalScore, // NEW
    gvgSimpleResult: guild.gvgSimpleResult, // NEW
    kvkPrepDays: guild.kvkPrepDays,
    kvkTotalScore: guild.kvkTotalScore // NEW
  })

  // Set the selected guild and index
  selectedGuildIndex.value = index
  selectedGuild.value = normalizedGuild
  
  // FIXED: Initialize modal-specific input mode from global setting
  modalKvkInputMode.value = kvkInputMode.value
  
  showKvKModal.value = true

  // Increment modal key to force re-render
  modalKey.value++

  // Wait for next tick to ensure modal is rendered
  await nextTick()
}

const closeKvKModal = () => {
  // Copy changes back to the original guild
  if (selectedGuild.value && selectedGuildIndex.value >= 0) {
    guilds.value[selectedGuildIndex.value].kvkPrepDays = selectedGuild.value.kvkPrepDays.map(day => ({
      score: day?.score ?? null,
      rank: day?.rank ?? null
    }))
    guilds.value[selectedGuildIndex.value].kvkTotalScore = selectedGuild.value.kvkTotalScore // NEW
  }
  showKvKModal.value = false
  selectedGuild.value = null
  selectedGuildIndex.value = -1
}

// Computed - Validation with consolidation
const validationErrors = computed(() => {
  const errors = []

  guilds.value.forEach((guild, index) => {
    if (!guild.shorthand) {
      errors.push({ type: 'missing_shorthand', guild: index + 1 })
    }
    if (!guild.name) {
      errors.push({ type: 'missing_name', guild: index + 1 })
    }

    // Check for duplicate shorthands
    const duplicates = guilds.value.filter(g => g.shorthand && g.shorthand === guild.shorthand)
    if (duplicates.length > 1 && guild.shorthand) {
      errors.push({ type: 'duplicate_shorthand', guild: index + 1, value: guild.shorthand })
    }
  })

  return errors
})

// Consolidated errors - one line per unique error type
const consolidatedErrors = computed(() => {
  const errorMap = new Map()

  validationErrors.value.forEach(error => {
    const key = error.type + (error.value || '')
    if (!errorMap.has(key)) {
      errorMap.set(key, { ...error, guilds: [error.guild] })
    } else {
      const existing = errorMap.get(key)
      if (!existing.guilds.includes(error.guild)) {
        existing.guilds.push(error.guild)
      }
    }
  })

  return Array.from(errorMap.values()).map(error => {
    const guildList = error.guilds.join(', ')
    switch (error.type) {
      case 'missing_shorthand':
        return `Missing shorthand in Guild${error.guilds.length > 1 ? 's' : ''} #${guildList}`
      case 'missing_name':
        return `Missing name in Guild${error.guilds.length > 1 ? 's' : ''} #${guildList}`
      case 'duplicate_shorthand':
        return `Duplicate shorthand "${error.value}" in Guild${error.guilds.length > 1 ? 's' : ''} #${guildList}`
      default:
        return `Validation error in Guild${error.guilds.length > 1 ? 's' : ''} #${guildList}`
    }
  })
})

const isValid = computed(() => validationErrors.value.length === 0)

// GvG Computed Functions with null safety
const getGvGTotalScore = (guild, useModalMode = false) => {
  if (!guild) return 0
  // FIXED: Use modal mode when in modal context, otherwise use global mode
  const currentMode = useModalMode ? modalGvgInputMode.value : gvgInputMode.value
  
  if (currentMode === 'total' || currentMode === 'simple') {
    return guild.gvgTotalScore || 0
  } else {
    // Daily mode
    if (!guild.gvgDays || !Array.isArray(guild.gvgDays)) return 0
    return guild.gvgDays.reduce((sum, day) => {
      return sum + (day && typeof day.score === 'number' ? day.score : 0)
    }, 0)
  }
}

const getGvGWins = (guild) => {
  if (!guild.gvgDays || !Array.isArray(guild.gvgDays)) return 0
  return guild.gvgDays.filter(day => day && day.won === true).length
}

const getGvGLosses = (guild) => {
  if (!guild.gvgDays || !Array.isArray(guild.gvgDays)) return 0
  return guild.gvgDays.filter(day => day && !day.won && day.score !== null && day.score !== undefined).length
}

const getGvGPoints = (guild) => {
  if (!guild.gvgDays || !Array.isArray(guild.gvgDays)) return 0
  return guild.gvgDays.reduce((points, day, index) => {
    if (day && day.won) {
      return points + (index < 5 ? 2 : 4) // Days 1-5: 2pts, Day 6: 4pts
    }
    return points
  }, 0)
}

const isFlawless = (guild) => {
  if (!guild.gvgDays || !Array.isArray(guild.gvgDays)) return false
  return guild.gvgDays.length === 6 && guild.gvgDays.every(day => day && day.won === true)
}

const getGuildInvasionStatus = (guild) => {
  if (!guild.gvgDays || !Array.isArray(guild.gvgDays)) return null
  const first5Days = guild.gvgDays.slice(0, 5)
  const wins = first5Days.filter(day => day && day.won).length
  const losses = first5Days.filter(day => day && !day.won && day.score !== null && day.score !== undefined).length
  
  if (wins >= 3) return 'can-invade'
  if (losses >= 3) return 'can-be-invaded'
  return null
}

const getGvGStatus = (guild, useModalMode = false) => {
  // FIXED: Use modal mode when in modal context, otherwise use global mode
  const currentMode = useModalMode ? modalGvgInputMode.value : gvgInputMode.value
  
  // Handle simple mode
  if (currentMode === 'simple') {
    if (!guild.gvgSimpleResult) return 'Unknown'
    return guild.gvgSimpleResult === 'won' ? 'Won' : 'Lost'
  }
  
  // Original logic for daily mode
  const points = getGvGPoints(guild)
  const wins = getGvGWins(guild)
  const losses = getGvGLosses(guild)
  const totalGames = wins + losses

  if (totalGames === 0) return 'Unknown'

  // Win if 8+ points
  if (points >= 8) return 'Won'
  
  // Check if can still win
  const remainingDays = 6 - totalGames
  let maxPossiblePoints = points
  
  // Calculate max possible points
  for (let i = totalGames; i < 6; i++) {
    maxPossiblePoints += (i === 5 ? 4 : 2)
  }
  
  // Lost if can't reach 8 points
  if (maxPossiblePoints < 8) return 'Lost'
  
  // Still in progress - show current trend
  if (wins > losses) return 'Winning'
  if (losses > wins) return 'Losing'
  return 'Tied'
}

// Number formatting helpers
const formatNumberShort = (value) => {
  if (!value && value !== 0) return '0'
  const num = Number(value)
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B'
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Status badge styling
const getStatusBadgeClass = (guild) => {
  const status = getGvGStatus(guild)
  const baseClass = 'font-semibold border-2 text-xs px-2 py-0.5'

  switch (status) {
    case 'Won':
      return `${baseClass} bg-green-600/20 border-green-500 text-green-300`
    case 'Winning':
      return `${baseClass} bg-lime-600/20 border-lime-500 text-lime-300`
    case 'Lost':
      return `${baseClass} bg-red-600/20 border-red-500 text-red-300`
    case 'Losing':
      return `${baseClass} bg-orange-600/20 border-orange-500 text-orange-300`
    case 'Tied':
      return `${baseClass} bg-yellow-600/20 border-yellow-500 text-yellow-300`
    default:
      return `${baseClass} bg-gray-600/20 border-gray-500 text-gray-300`
  }
}

// KvK Computed Functions with null safety
const getKvKTotalScore = (guild, useModalMode = false) => {
  if (!guild) return 0
  // FIXED: Use modal mode when in modal context, otherwise use global mode
  const currentMode = useModalMode ? modalKvkInputMode.value : kvkInputMode.value
  
  if (currentMode === 'total') {
    return guild.kvkTotalScore || 0
  } else {
    // Daily mode
    if (!guild.kvkPrepDays || !Array.isArray(guild.kvkPrepDays)) return 0
    return guild.kvkPrepDays.reduce((sum, day) => {
      return sum + (day && typeof day.score === 'number' ? day.score : 0)
    }, 0)
  }
}

const getKvKAvgRank = (guild) => {
  if (!guild.kvkPrepDays || !Array.isArray(guild.kvkPrepDays)) return null
  const ranksWithValues = guild.kvkPrepDays.filter(day => day && typeof day.rank === 'number')
  if (ranksWithValues.length === 0) return null
  const sum = ranksWithValues.reduce((total, day) => total + day.rank, 0)
  return sum / ranksWithValues.length
}

// Insights computed properties - FORMATTED STATS
const totalServerPower = computed(() => {
  return guilds.value.reduce((sum, guild) => sum + (guild.guildPower || 0), 0)
})

const totalServerPowerFormatted = computed(() => {
  if (totalServerPower.value === 0) return 'N/A'
  return formatNumberShort(totalServerPower.value)
})

const topPerformingGuild = computed(() => {
  if (guilds.value.length === 0) return 'N/A'

  let maxScore = -1
  let topGuild = 'N/A'

  guilds.value.forEach(guild => {
    const score = getGvGTotalScore(guild)
    if (score > maxScore) {
      maxScore = score
      topGuild = guild.shorthand || guild.name || 'Unknown'
    }
  })

  return topGuild
})

const topPerformingGuildScore = computed(() => {
  if (guilds.value.length === 0) return ''

  let maxScore = -1
  guilds.value.forEach(guild => {
    const score = getGvGTotalScore(guild)
    if (score > maxScore) {
      maxScore = score
    }
  })

  return maxScore > 0 ? formatNumberShort(maxScore) + ' GvG score' : ''
})

const mostEfficientGuild = computed(() => {
  if (guilds.value.length === 0) return 'N/A'

  let maxRatio = -1
  let efficientGuild = 'N/A'

  guilds.value.forEach(guild => {
    const score = getGvGTotalScore(guild)
    const power = guild.guildPower || 0
    if (power > 0) {
      const ratio = score / power
      if (ratio > maxRatio) {
        maxRatio = ratio
        efficientGuild = guild.shorthand || guild.name || 'Unknown'
      }
    }
  })

  return efficientGuild
})

const mostEfficientGuildRatio = computed(() => {
  if (guilds.value.length === 0) return ''

  let maxRatio = -1
  guilds.value.forEach(guild => {
    const score = getGvGTotalScore(guild)
    const power = guild.guildPower || 0
    if (power > 0) {
      const ratio = score / power
      if (ratio > maxRatio) {
        maxRatio = ratio
      }
    }
  })

  return maxRatio > 0 ? (maxRatio * 1000000).toFixed(2) + ' pts/1M power' : ''
})

// Guild management
const addGuild = () => {
  guilds.value.push(createEmptyGuild())
}

const removeGuild = (index) => {
  guilds.value.splice(index, 1)
}

// KvK Day Result Update
const updateKvkDayResult = (dayIndex, result) => {
  kvkGlobalSettings.value.dailyResults[dayIndex] = result
}

// Dataset management
const handleDatasetSelect = (newDatasetId) => {
  datasetId.value = newDatasetId
}

const createNewDataset = () => {
  if (newDatasetName.value.trim()) {
    datasetId.value = newDatasetName.value.trim()
    newDatasetName.value = ''
    showStatus('success', `Created new dataset: ${datasetId.value}`)
  }
}

const loadAvailableDatasets = async () => {
  try {
    isLoading.value = true
    const datasets = await guildStore.loadDatasets()
    availableDatasets.value = datasets
  } catch (error) {
    console.error('Error loading datasets:', error)
    showStatus('error', `Failed to load datasets: ${error.message}`)
  } finally {
    isLoading.value = false
  }
}

const refreshDatasets = async () => {
  await loadAvailableDatasets()
  showStatus('success', 'Datasets refreshed!')
}

// Firestore Operations
const saveToFirestore = async () => {
  if (!datasetId.value) {
    showStatus('error', 'Please select or create a dataset first')
    return
  }

  if (!isValid.value) {
    showStatus('error', 'Please fix validation errors before saving')
    return
  }

  try {
    isLoading.value = true

    await guildStore.saveDatasetVersion(
      datasetId.value,
      guilds.value.map(guild => normalizeGuildData({
        name: guild.name,
        shorthand: guild.shorthand,
        guildPower: guild.guildPower,
        gvgOpponent: guild.gvgOpponent,
        gvgDays: guild.gvgDays,
        gvgTotalScore: guild.gvgTotalScore, // NEW
        gvgSimpleResult: guild.gvgSimpleResult, // NEW
        kvkPrepDays: guild.kvkPrepDays,
        kvkTotalScore: guild.kvkTotalScore // NEW
      })),
      { 
        kvkGlobalSettings: kvkGlobalSettings.value,
        gvgInputMode: gvgInputMode.value, // FIXED: Save input mode
        kvkInputMode: kvkInputMode.value, // FIXED: Save input mode
        gvgEnabled: gvgEnabled.value,
        kvkEnabled: kvkEnabled.value
      }
    )

    lastSaved.value = new Date().toLocaleTimeString()
    showStatus('success', 'Dataset saved successfully!')
  } catch (error) {
    console.error('Save error:', error)
    showStatus('error', `Failed to save: ${error.message}`)
  } finally {
    isLoading.value = false
  }
}

const loadFromFirestore = async () => {
  if (!datasetId.value) {
    showStatus('error', 'Please select a dataset first')
    return
  }

  try {
    isLoading.value = true

    const result = await guildStore.loadDatasetVersion(datasetId.value)

    if (result && result.version) {
      // FIXED: Ensure guilds array is properly normalized
      guilds.value = result.version.guilds.map(guild => normalizeGuildData({
        ...createEmptyGuild(),
        ...guild
      }))

      if (result.version.metadata?.kvkGlobalSettings) {
        kvkGlobalSettings.value = {
          opponentServer: result.version.metadata.kvkGlobalSettings.opponentServer || '',
          dailyResults: result.version.metadata.kvkGlobalSettings.dailyResults || [null, null, null, null, null, null]
        }
        // Ensure dailyResults has 6 days
        while (kvkGlobalSettings.value.dailyResults.length < 6) {
          kvkGlobalSettings.value.dailyResults.push(null)
        }
        kvkEnabled.value = true
      }
      
      // FIXED: Load input modes from metadata with auto-detection fallback
      if (result.version.metadata?.gvgInputMode) {
        gvgInputMode.value = result.version.metadata.gvgInputMode
      } else {
        // Auto-detect based on data
        gvgInputMode.value = autoDetectGvgInputMode(guilds.value)
      }
      
      if (result.version.metadata?.kvkInputMode) {
        kvkInputMode.value = result.version.metadata.kvkInputMode
      } else {
        // Auto-detect based on data
        kvkInputMode.value = autoDetectKvkInputMode(guilds.value)
      }
      
      if (typeof result.version.metadata?.gvgEnabled === 'boolean') {
        gvgEnabled.value = result.version.metadata.gvgEnabled
      }
      
      if (typeof result.version.metadata?.kvkEnabled === 'boolean') {
        kvkEnabled.value = result.version.metadata.kvkEnabled
      }

      // Force Vue to re-render with the new data
      await nextTick()

      showStatus('success', `Loaded dataset: ${datasetId.value}`)
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

// Import/Export
const exportJSON = () => {
  const data = {
    datasetId: datasetId.value,
    kvkGlobalSettings: kvkGlobalSettings.value,
    guilds: guilds.value.map(guild => ({
      name: guild.name,
      shorthand: guild.shorthand,
      guildPower: guild.guildPower,
      gvgOpponent: guild.gvgOpponent,
      gvgDays: guild.gvgDays,
      gvgTotalScore: guild.gvgTotalScore, // NEW
      gvgSimpleResult: guild.gvgSimpleResult, // NEW
      kvkPrepDays: guild.kvkPrepDays,
      kvkTotalScore: guild.kvkTotalScore // NEW
    })),
    exportedAt: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${datasetId.value || 'dataset'}_${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  showStatus('success', 'Dataset exported successfully!')
}

const triggerImport = () => {
  fileInput.value?.click()
}

const importJSON = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const data = JSON.parse(text)

    if (!data.guilds || !Array.isArray(data.guilds)) {
      throw new Error('Invalid dataset format')
    }

    guilds.value = data.guilds.map(guild => normalizeGuildData({
      ...createEmptyGuild(),
      ...guild
    }))

    if (data.datasetId) {
      datasetId.value = data.datasetId
    }

    if (data.kvkGlobalSettings) {
      kvkGlobalSettings.value = {
        opponentServer: data.kvkGlobalSettings.opponentServer || '',
        dailyResults: data.kvkGlobalSettings.dailyResults || [null, null, null, null, null, null]
      }
      // Ensure dailyResults has 6 days
      while (kvkGlobalSettings.value.dailyResults.length < 6) {
        kvkGlobalSettings.value.dailyResults.push(null)
      }
      kvkEnabled.value = true
    }

    showStatus('success', `Imported ${guilds.value.length} guilds successfully!`)
  } catch (error) {
    console.error('Import error:', error)
    showStatus('error', 'Failed to import dataset. Please check file format.')
  }

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Discord Export Function
const copyDiscordFormat = async () => {
  const opts = discordExportOptions.value
  let discordMessage = `## ${datasetId.value || 'Guild Rankings'}\n\n`

  // Create rankings data
  const guildRankings = guilds.value
    .filter(g => g.shorthand) // Only include guilds with shorthand
    .map(g => {
      const totalScore = getGvGTotalScore(g)
      const wins = getGvGWins(g)
      const losses = getGvGLosses(g)
      const kvkTotal = getKvKTotalScore(g)
      const kvkAvgRank = getKvKAvgRank(g)
      // Calculate efficiency as percentage: (score / power) * 100
      const efficiency = g.guildPower && g.guildPower > 0 ? (totalScore / g.guildPower * 100).toFixed(2) : 0

      return {
        name: g.name,
        shorthand: g.shorthand,
        power: g.guildPower || 0,
        totalScore,
        wins,
        losses,
        efficiency,
        kvkTotal,
        kvkAvgRank,
        gvgDays: g.gvgDays,
        kvkPrepDays: g.kvkPrepDays,
        warScore: g.kvkPrepDays?.[5]?.score || 0,
        warRank: g.kvkPrepDays?.[5]?.rank || null
      }
    })

  // GvG Win Record
  if (opts.gvgWinRecord) {
    discordMessage += `## 🏆 GvG Win/Loss Record\n`
    const winLossData = guildRankings.map(g => {
      // Calculate points: Days 1-5 worth 2 points, Day 6 worth 3 points
      let currentPoints = 0
      let daysPlayed = 0
      
      // Days 1-5 (worth 2 points each)
      for (let i = 0; i < 5; i++) {
        if (g.gvgDays[i]?.score !== null && g.gvgDays[i]?.score !== undefined) {
          daysPlayed++
          if (g.gvgDays[i].won) {
            currentPoints += 2
          }
        }
      }
      
      // Day 6 (worth 4 points)
      if (g.gvgDays[5]?.score !== null && g.gvgDays[5]?.score !== undefined) {
        daysPlayed++
        if (g.gvgDays[5].won) {
          currentPoints += 4
        }
      }
      
      // Calculate remaining possible points
      const remainingDays = 6 - daysPlayed
      let maxRemainingPoints = 0
      for (let i = daysPlayed; i < 6; i++) {
        maxRemainingPoints += (i === 5 ? 4 : 2)
      }
      
      const maxPossiblePoints = currentPoints + maxRemainingPoints
      
      // Determine status
      let status, emoji
      if (currentPoints >= 8) {
        status = 'WIN'
        emoji = '✅'
      } else if (maxPossiblePoints < 8) {
        status = 'LOSS'
        emoji = '❌'
      } else {
        // Interim status
        if (g.wins > g.losses) {
          status = 'Winning'
          emoji = '📈'
        } else if (g.losses > g.wins) {
          status = 'Losing'
          emoji = '📉'
        } else {
          status = 'Tied'
          emoji = '⚖️'
        }
      }
      
      const winRate = g.wins + g.losses > 0 ? (g.wins / (g.wins + g.losses) * 100).toFixed(0) : 0
      
      return {
        ...g,
        winRate,
        currentPoints,
        status,
        emoji,
        daysPlayed
      }
    }).sort((a, b) => b.currentPoints - a.currentPoints || b.wins - a.wins || a.losses - b.losses)

    winLossData.forEach((g, i) => {
      discordMessage += `${i + 1}. **${g.shorthand}** - ${g.wins}W-${g.losses}L (${g.currentPoints} pts) ${g.emoji} ${g.status}\n`
    })
    discordMessage += `\n`
  }

  // Day-by-Day Scores
  if (opts.dayByDayScores) {
    for (let day = 0; day < 6; day++) {
      // Check if any guild has data for this day
      const dayHasData = guildRankings.some(g => g.gvgDays[day]?.score !== null && g.gvgDays[day]?.score !== undefined)
      
      if (!dayHasData) continue // Skip days with no data
      
      const dayNum = day + 1
      const dayLabel = day === 5 ? `Day ${dayNum} (War Day)` : `Day ${dayNum}`
      discordMessage += `## ⚔️ ${dayLabel} Scores\n`
      
      const dayRankings = guildRankings
        .map(g => ({
          shorthand: g.shorthand,
          score: g.gvgDays[day]?.score || 0,
          won: g.gvgDays[day]?.won
        }))
        .sort((a, b) => b.score - a.score)

      dayRankings.forEach((g, i) => {
        // Add (W) or (L) indicator after score
        const winLossIndicator = g.won ? ' **(W)**' : ' (L)'
        discordMessage += `${i + 1}. **${g.shorthand}** - ${g.score.toLocaleString()}${winLossIndicator}\n`
      })
      discordMessage += `\n`
    }
  }

  // Total Score Ranking
  if (opts.totalScoreRanking) {
    discordMessage += `## 📊 Total GvG Score Ranking\n`
    const scoreRankings = [...guildRankings].sort((a, b) => b.totalScore - a.totalScore)
    scoreRankings.forEach((g, i) => {
      discordMessage += `${i + 1}. **${g.shorthand}** - ${g.totalScore.toLocaleString()}\n`
    })
    discordMessage += `\n`
  }

  // Power Ranking
  if (opts.powerRanking) {
    discordMessage += `## 💪 Guild Power Ranking\n`
    const powerRankings = [...guildRankings].sort((a, b) => b.power - a.power)
    powerRankings.forEach((g, i) => {
      discordMessage += `${i + 1}. **${g.shorthand}** - ${g.power.toLocaleString()}\n`
    })
    discordMessage += `\n`
  }

  // Efficiency Ranking
  if (opts.efficiencyRanking) {
    discordMessage += `## ⚡ Efficiency Ranking\n`
    const efficiencyRankings = [...guildRankings]
      .filter(g => g.power > 0)
      .sort((a, b) => b.efficiency - a.efficiency)
    efficiencyRankings.forEach((g, i) => {
      discordMessage += `${i + 1}. **${g.shorthand}** - ${g.efficiency}%\n`
    })
    discordMessage += `\n`
  }

  // KvK Prep Ranking
  if (opts.kvkPrepRanking && guildRankings.some(g => g.kvkTotal > 0)) {
    discordMessage += `## 🛡️ KvK Prep Ranking (Days 1-5)\n`
    const kvkPrepRankings = [...guildRankings]
      .filter(g => g.kvkTotal > 0)
      .sort((a, b) => b.kvkTotal - a.kvkTotal)
    kvkPrepRankings.forEach((g, i) => {
      const avgRank = g.kvkAvgRank ? ` (Avg Rank: ${g.kvkAvgRank.toFixed(1)})` : ''
      discordMessage += `${i + 1}. **${g.shorthand}** - ${g.kvkTotal.toLocaleString()}${avgRank}\n`
    })
    discordMessage += `\n`
  }

  // War Day Ranking
  if (opts.warRanking && guildRankings.some(g => g.warScore > 0)) {
    discordMessage += `## ⚔️ War Day Ranking (Day 6)\n`
    const warRankings = [...guildRankings]
      .filter(g => g.warScore > 0)
      .sort((a, b) => b.warScore - a.warScore)
    warRankings.forEach((g, i) => {
      const rankInfo = g.warRank ? ` (Rank: ${g.warRank})` : ''
      discordMessage += `${i + 1}. **${g.shorthand}** - ${g.warScore.toLocaleString()}${rankInfo}\n`
    })
    discordMessage += `\n`
  }

  
  // Add metadata
  if (kvkGlobalSettings.value.opponentServer) {
    discordMessage += `\n*vs ${kvkGlobalSettings.value.opponentServer}*\n`
  }
  discordMessage += `*Generated: ${new Date().toLocaleDateString()}*`

  // Copy to clipboard
  try {
    await navigator.clipboard.writeText(discordMessage)
    discordCopySuccess.value = true
    setTimeout(() => {
      discordCopySuccess.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to copy:', err)
    showStatus('error', 'Failed to copy to clipboard')
  }
}

// Auto-save to localStorage
const autoSave = () => {
  try {
    localStorage.setItem('guildDatasetDraft', JSON.stringify({
      datasetId: datasetId.value,
      kvkGlobalSettings: kvkGlobalSettings.value,
      kvkEnabled: kvkEnabled.value,
      gvgEnabled: gvgEnabled.value, // NEW
      gvgInputMode: gvgInputMode.value, // NEW
      kvkInputMode: kvkInputMode.value, // NEW
      guilds: guilds.value,
      lastModified: new Date().toISOString()
    }))
  } catch (error) {
    console.error('Auto-save error:', error)
  }
}

// Load draft from localStorage
const loadDraft = () => {
  try {
    const draft = localStorage.getItem('guildDatasetDraft')
    if (draft) {
      const data = JSON.parse(draft)
      if (data.guilds && Array.isArray(data.guilds)) {
        guilds.value = data.guilds.map(guild => normalizeGuildData({
          ...createEmptyGuild(),
          ...guild
        }))
        if (data.datasetId) {
          datasetId.value = data.datasetId
        }
        if (data.kvkGlobalSettings) {
          kvkGlobalSettings.value = {
            opponentServer: data.kvkGlobalSettings.opponentServer || '',
            dailyResults: data.kvkGlobalSettings.dailyResults || [null, null, null, null, null, null]
          }
          // Ensure dailyResults has 6 days
          while (kvkGlobalSettings.value.dailyResults.length < 6) {
            kvkGlobalSettings.value.dailyResults.push(null)
          }
        }
        if (typeof data.kvkEnabled === 'boolean') {
          kvkEnabled.value = data.kvkEnabled
        }
        // NEW: Load input control state
        if (typeof data.gvgEnabled === 'boolean') {
          gvgEnabled.value = data.gvgEnabled
        }
        if (data.gvgInputMode) {
          gvgInputMode.value = data.gvgInputMode
        }
        if (data.kvkInputMode) {
          kvkInputMode.value = data.kvkInputMode
        }
      }
    }
  } catch (error) {
    console.error('Load draft error:', error)
  }
}

// Watch for changes and auto-save
watch(guilds, () => {
  autoSave()
}, { deep: true })

watch(datasetId, () => {
  autoSave()
})

watch(kvkGlobalSettings, () => {
  autoSave()
}, { deep: true })

watch(kvkEnabled, () => {
  autoSave()
})

// NEW: Watch for input control changes
watch(gvgEnabled, () => {
  autoSave()
})

watch(gvgInputMode, () => {
  autoSave()
})

watch(kvkInputMode, () => {
  autoSave()
})

// Status message helper
const showStatus = (type, message) => {
  statusType.value = type
  statusMessage.value = message
  setTimeout(() => {
    statusMessage.value = ''
  }, 5000)
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

// Navigation
const navigateToRankings = () => {
  if (!datasetId.value) {
    showStatus('error', 'Please select or create a dataset first')
    return
  }
  // Pass dataset ID as query parameter
  router.push({
    path: '/topheroes/tools/rankings/weights',
    query: { dataset: datasetId.value }
  })
}

// Initialize
onMounted(async () => {
  await loadAvailableDatasets()
  loadDraft()

  if (guilds.value.length === 0) {
    guilds.value = [createEmptyGuild(), createEmptyGuild(), createEmptyGuild()]
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

  button {
    min-height: 44px;
  }

  input {
    min-height: 40px;
  }
}
</style>