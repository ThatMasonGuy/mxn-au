<template>
  <div class="space-y-4">
    <!-- Table Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Users class="w-5 h-5 text-lime-400" />
        <h2 class="text-lg font-bold text-lime-300">Guild Data</h2>
        <Badge class="bg-lime-600/20 border-lime-500 text-lime-300">
          {{ validGuildCount }} guilds
        </Badge>
      </div>
      
      <div class="flex items-center gap-2">
        <Button
          @click="addGuild"
          size="sm"
          class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold"
        >
          <Plus class="w-4 h-4 mr-1" />
          Add Guild
        </Button>
      </div>
    </div>

    <!-- No Events Warning -->
    <div 
      v-if="eventInstances.length === 0"
      class="p-4 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-200 flex items-start gap-2"
    >
      <AlertTriangle class="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        <p class="font-medium">No events configured</p>
        <p class="text-sm text-amber-200/70">Add event types and instances in the Event Configuration panel to start tracking data.</p>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-green-950/50 rounded-xl border-2 border-lime-500/30 overflow-hidden">
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full">
          <thead>
            <tr class="bg-green-900/50 border-b border-lime-500/30">
              <!-- Fixed columns -->
              <th class="sticky left-0 bg-green-900/90 z-10 px-2 py-3 text-left text-xs font-semibold text-lime-300 w-10">
                #
              </th>
              <th class="sticky left-10 bg-green-900/90 z-10 px-2 py-3 text-left text-xs font-semibold text-lime-300 w-20">
                Tag
              </th>
              <th class="px-3 py-3 text-left text-xs font-semibold text-lime-300 w-48">
                Guild Name
              </th>
              <th class="px-3 py-3 text-right text-xs font-semibold text-lime-300 w-36">
                Power
              </th>
              
              <!-- Dynamic event columns -->
              <th 
                v-for="instance in eventInstances" 
                :key="instance.id"
                class="px-3 py-3 text-center text-xs font-semibold min-w-[150px]"
                :class="getEventHeaderClass(instance.eventConfig)"
              >
                <div class="flex flex-col items-center gap-1">
                  <div class="flex items-center gap-1">
                    <component 
                      :is="getEventIcon(instance.eventConfig.template.category)"
                      class="w-3 h-3"
                    />
                    {{ instance.name }}
                  </div>
                  <span class="text-[10px] opacity-70">{{ getInputModeLabel(instance.eventConfig.inputMode) }}</span>
                </div>
              </th>
              
              <!-- Actions -->
              <th class="px-3 py-3 text-center text-xs font-semibold text-lime-300 w-16">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody>
            <tr 
              v-for="(guild, index) in guilds"
              :key="index"
              :class="[
                'border-b border-lime-500/10 hover:bg-green-900/30 transition-colors',
                getRowValidationClass(guild)
              ]"
            >
              <!-- Row number -->
              <td class="sticky left-0 bg-green-950/90 z-10 px-2 py-2 text-xs text-lime-400/60 w-10">
                {{ index + 1 }}
              </td>
              
              <!-- Shorthand -->
              <td class="sticky left-10 bg-green-950/90 z-10 px-2 py-2 w-20">
                <Input
                  :modelValue="guild.shorthand"
                  @update:modelValue="updateGuild(index, 'shorthand', $event)"
                  @blur="onShorthandBlur(index)"
                  placeholder="TAG"
                  class="bg-green-900/50 border-lime-500/30 text-lime-100 h-9 text-sm font-medium uppercase w-full"
                />
              </td>
              
              <!-- Guild Name -->
              <td class="px-3 py-2 w-48">
                <Input
                  :modelValue="guild.name"
                  @update:modelValue="updateGuild(index, 'name', $event)"
                  placeholder="Guild Name"
                  class="bg-green-900/50 border-lime-500/30 text-lime-100 h-9 text-sm w-full"
                />
              </td>
              
              <!-- Power -->
              <td class="px-3 py-2 w-36">
                <Input
                  :value="formatNumber(guild.power)"
                  @input="updatePower(index, $event.target.value)"
                  placeholder="0"
                  class="bg-green-900/50 border-lime-500/30 text-lime-100 h-9 text-sm text-right font-mono w-full"
                />
              </td>
              
              <!-- Dynamic event cells -->
              <td 
                v-for="instance in eventInstances" 
                :key="`${index}-${instance.id}`"
                class="px-3 py-2"
              >
                <EventDataCell
                  :guild="guild"
                  :eventConfig="instance.eventConfig"
                  :instance="instance"
                  @update="updateEventData(index, instance.id, $event)"
                  @open-modal="openEventModal(guild, index, instance)"
                />
              </td>
              
              <!-- Actions -->
              <td class="px-3 py-2 text-center">
                <Button
                  @click="removeGuild(index)"
                  size="sm"
                  variant="ghost"
                  class="text-red-400 hover:bg-red-500/20 h-8 w-8 p-0"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </td>
            </tr>
            
            <!-- Empty row placeholder -->
            <tr v-if="guilds.length === 0">
              <td 
                :colspan="4 + eventInstances.length + 1" 
                class="px-4 py-8 text-center text-lime-300/50"
              >
                No guilds yet. Click "Add Guild" to start.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Button
          @click="addMultipleGuilds(5)"
          size="sm"
          variant="outline"
          class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20"
        >
          <Plus class="w-4 h-4 mr-1" />
          Add 5 Rows
        </Button>
        <Button
          @click="removeEmptyRows"
          size="sm"
          variant="outline"
          class="text-amber-400 bg-amber-600/20 border-amber-400/50 hover:bg-amber-500/20"
          :disabled="emptyRowCount === 0"
        >
          <Eraser class="w-4 h-4 mr-1" />
          Remove Empty ({{ emptyRowCount }})
        </Button>
      </div>
      
      <!-- Validation Summary -->
      <div v-if="validation.errors.length > 0 || validation.warnings.length > 0" class="flex items-center gap-3">
        <span v-if="validation.errors.length > 0" class="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle class="w-4 h-4" />
          {{ validation.errors.length }} errors
        </span>
        <span v-if="validation.warnings.length > 0" class="text-sm text-amber-400 flex items-center gap-1">
          <AlertTriangle class="w-4 h-4" />
          {{ validation.warnings.length }} warnings
        </span>
      </div>
    </div>

    <!-- Event Data Modal -->
    <Dialog v-model:open="showEventModal">
      <DialogContent 
        class="bg-gradient-to-br from-green-900/95 to-emerald-900/95 border-2 border-lime-400/30 text-lime-100 max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle class="text-xl font-bold text-lime-300 flex items-center gap-2">
            <component 
              v-if="selectedInstance?.eventConfig"
              :is="getEventIcon(selectedInstance.eventConfig.template.category)"
              class="w-5 h-5"
              :class="getEventIconColor(selectedInstance.eventConfig.template.category)"
            />
            {{ selectedGuild?.name || selectedGuild?.shorthand || 'Guild' }} - {{ selectedInstance?.name }}
          </DialogTitle>
          <!-- For KvK (shared opponent), show instance opponent -->
          <DialogDescription v-if="selectedInstance?.opponent && !selectedInstance?.eventConfig?.template?.opponentPerGuild" class="text-lime-200/70">
            vs {{ selectedInstance.opponent }}
          </DialogDescription>
        </DialogHeader>

        <div v-if="selectedGuild && selectedInstance" class="mt-4 space-y-4">
          <!-- Per-guild opponent input (for GvG - check by category for backwards compatibility) -->
          <div v-if="selectedInstance.eventConfig?.template?.category === 'gvg'" class="p-3 bg-green-950/50 rounded-lg border border-lime-500/20">
            <label class="text-sm text-lime-300/80 mb-1 block">Opponent Guild</label>
            <Input
              :modelValue="modalEventData?.opponent"
              @update:modelValue="updateModalOpponent($event)"
              placeholder="Enter opponent guild name"
              class="bg-green-900/50 border-lime-500/30 text-lime-100 h-9 text-sm"
            />
          </div>

          <!-- Daily Input Mode -->
          <div v-if="selectedInstance.eventConfig.inputMode === 'daily'" class="space-y-3">
            <div
              v-for="(dayLabel, dayIndex) in getEventDayLabels(selectedInstance.eventConfig, selectedInstance)"
              :key="dayIndex"
              class="flex items-center gap-3 p-3 bg-green-950/50 rounded-lg border border-lime-500/20"
            >
              <div class="w-20 text-sm text-lime-300">{{ dayLabel }}</div>
              
              <!-- Score Input -->
              <div class="flex-1">
                <Input
                  :model-value="getDayScore(dayIndex)"
                  @update:model-value="updateModalDayScore(dayIndex, $event)"
                  placeholder="Score"
                  class="bg-green-900/50 border-lime-500/30 text-lime-100 h-9 text-sm font-mono"
                />
              </div>
              
              <!-- Win/Loss Toggle (if applicable) -->
              <div v-if="selectedInstance.eventConfig.template.hasWinLoss" class="flex gap-1">
                <button
                  @click="updateModalDayWon(dayIndex, true)"
                  :class="[
                    'px-3 py-1.5 rounded text-xs font-medium transition-all',
                    modalEventData?.days?.[dayIndex]?.won === true
                      ? 'bg-lime-600 text-green-950'
                      : 'bg-green-800/50 text-lime-300 hover:bg-green-800'
                  ]"
                >
                  Win
                </button>
                <button
                  @click="updateModalDayWon(dayIndex, false)"
                  :class="[
                    'px-3 py-1.5 rounded text-xs font-medium transition-all',
                    modalEventData?.days?.[dayIndex]?.won === false
                      ? 'bg-red-600 text-white'
                      : 'bg-green-800/50 text-lime-300 hover:bg-green-800'
                  ]"
                >
                  Loss
                </button>
              </div>
              
              <!-- Rank Input (if applicable) -->
              <div v-if="selectedInstance.eventConfig.template.hasRanks" class="w-20">
                <Input
                  :model-value="modalEventData?.days?.[dayIndex]?.rank ?? ''"
                  @update:model-value="updateModalDayRank(dayIndex, $event)"
                  type="number"
                  min="1"
                  placeholder="#"
                  class="bg-green-900/50 border-lime-500/30 text-lime-100 h-9 text-sm text-center"
                />
              </div>
            </div>
            
            <!-- Summary -->
            <div class="flex items-center justify-between p-3 bg-lime-600/10 rounded-lg border border-lime-500/30">
              <span class="text-sm text-lime-300">Total Score:</span>
              <span class="text-lg font-bold text-lime-200">{{ formatNumber(calculateModalTotal()) }}</span>
            </div>
          </div>

          <!-- Total Input Mode -->
          <div v-else-if="selectedInstance.eventConfig.inputMode === 'total'" class="space-y-4">
            <div>
              <label class="text-sm text-lime-300/80 mb-1 block">Total Score</label>
              <Input
                :model-value="getTotalScore()"
                @update:model-value="updateModalTotalScore($event)"
                placeholder="Enter total score"
                class="bg-green-950/70 border-lime-500/40 text-lime-100 text-lg font-mono"
              />
            </div>
            
            <div v-if="selectedInstance.eventConfig.template.hasWinLoss">
              <label class="text-sm text-lime-300/80 mb-2 block">Result</label>
              <div class="flex gap-2">
                <button
                  @click="modalEventData.result = 'won'"
                  :class="[
                    'flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    modalEventData?.result === 'won'
                      ? 'bg-lime-600 text-green-950'
                      : 'bg-green-800/50 text-lime-300 hover:bg-green-800'
                  ]"
                >
                  Won
                </button>
                <button
                  @click="modalEventData.result = 'lost'"
                  :class="[
                    'flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    modalEventData?.result === 'lost'
                      ? 'bg-red-600 text-white'
                      : 'bg-green-800/50 text-lime-300 hover:bg-green-800'
                  ]"
                >
                  Lost
                </button>
              </div>
            </div>
          </div>

          <!-- Simple Input Mode -->
          <div v-else-if="selectedInstance.eventConfig.inputMode === 'simple'" class="space-y-4">
            <label class="text-sm text-lime-300/80 mb-2 block">Result</label>
            <div class="flex gap-3">
              <button
                @click="modalEventData.result = 'won'"
                :class="[
                  'flex-1 px-6 py-4 rounded-xl text-lg font-semibold transition-all',
                  modalEventData?.result === 'won'
                    ? 'bg-lime-600 text-green-950 ring-2 ring-lime-400'
                    : 'bg-green-800/50 text-lime-300 hover:bg-green-800'
                ]"
              >
                <Trophy class="w-6 h-6 mx-auto mb-1" />
                Won
              </button>
              <button
                @click="modalEventData.result = 'lost'"
                :class="[
                  'flex-1 px-6 py-4 rounded-xl text-lg font-semibold transition-all',
                  modalEventData?.result === 'lost'
                    ? 'bg-red-600 text-white ring-2 ring-red-400'
                    : 'bg-green-800/50 text-lime-300 hover:bg-green-800'
                ]"
              >
                <X class="w-6 h-6 mx-auto mb-1" />
                Lost
              </button>
            </div>
            
            <div>
              <label class="text-sm text-lime-300/80 mb-1 block">Score (optional)</label>
              <Input
                :model-value="getSimpleScore()"
                @update:model-value="updateModalSimpleScore($event)"
                placeholder="Final score if known"
                class="bg-green-950/70 border-lime-500/40 text-lime-100 font-mono"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <Button
            @click="closeEventModal"
            variant="outline"
            class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20"
          >
            Cancel
          </Button>
          <Button
            @click="saveEventModal"
            class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Users, Plus, Trash2, AlertCircle, AlertTriangle, Eraser, 
  Sword, Globe, Zap, Trophy, X 
} from 'lucide-vue-next'
import { useDatasetStore } from '@/stores/useDatasetStore'
import { formatNumber, parseNumber } from '@/lib/datasetHelpers'
import { getEventDayLabels, createEmptyEventData } from '@/lib/eventTemplates'
import EventDataCell from './EventDataCell.vue'

const store = useDatasetStore()

// Computed
const guilds = computed(() => store.guilds)
const validation = computed(() => store.validation)

const eventInstances = computed(() => store.allEventInstances)

const validGuildCount = computed(() => 
  guilds.value.filter(g => g.shorthand?.trim()).length
)

const emptyRowCount = computed(() => 
  guilds.value.filter(g => !g.shorthand?.trim() && !g.name?.trim()).length
)

// Modal state
const showEventModal = ref(false)
const selectedGuild = ref(null)
const selectedGuildIndex = ref(-1)
const selectedInstance = ref(null)
const modalEventData = ref(null)

// Get event icon
function getEventIcon(category) {
  switch (category) {
    case 'gvg': return Sword
    case 'kvk': return Globe
    default: return Zap
  }
}

// Get event icon color
function getEventIconColor(category) {
  switch (category) {
    case 'gvg': return 'text-lime-400'
    case 'kvk': return 'text-purple-400'
    default: return 'text-yellow-400'
  }
}

// Get event header class
function getEventHeaderClass(eventConfig) {
  switch (eventConfig.template.category) {
    case 'gvg': return 'text-lime-300 bg-lime-900/20'
    case 'kvk': return 'text-purple-300 bg-purple-900/20'
    default: return 'text-yellow-300 bg-yellow-900/20'
  }
}

// Get input mode label
function getInputModeLabel(mode) {
  switch (mode) {
    case 'daily': return 'Daily'
    case 'total': return 'Total'
    case 'simple': return 'W/L'
    default: return mode
  }
}

// Get row validation class
function getRowValidationClass(guild) {
  if (!guild.shorthand?.trim()) return ''
  
  // Check for duplicate
  const duplicates = guilds.value.filter(
    g => g.shorthand?.toLowerCase() === guild.shorthand?.toLowerCase()
  ).length
  
  if (duplicates > 1) return 'bg-red-900/20'
  
  return ''
}

// Update guild field
function updateGuild(index, field, value) {
  store.updateGuild(index, { [field]: value })
}

// Update power with number parsing
function updatePower(index, value) {
  store.updateGuild(index, { power: parseNumber(value) })
}

// On shorthand blur - auto-generate name if empty
function onShorthandBlur(index) {
  const guild = guilds.value[index]
  if (guild.shorthand && !guild.name) {
    // Could auto-lookup guild name from database here
  }
}

// Update event data
function updateEventData(guildIndex, instanceId, data) {
  store.updateGuildEventData(guildIndex, instanceId, data)
}

// Add single guild
function addGuild() {
  store.addGuild()
}

// Add multiple guilds
function addMultipleGuilds(count) {
  for (let i = 0; i < count; i++) {
    store.addGuild()
  }
}

// Remove guild
function removeGuild(index) {
  store.removeGuild(index)
}

// Remove empty rows
function removeEmptyRows() {
  const toRemove = []
  guilds.value.forEach((g, i) => {
    if (!g.shorthand?.trim() && !g.name?.trim()) {
      toRemove.push(i)
    }
  })
  
  // Remove in reverse order to preserve indices
  toRemove.reverse().forEach(i => store.removeGuild(i))
}

// Open event modal
function openEventModal(guild, guildIndex, instance) {
  selectedGuild.value = guild
  selectedGuildIndex.value = guildIndex
  selectedInstance.value = instance
  
  // Clone current event data for editing
  const currentData = guild.events?.[instance.id]
  if (currentData) {
    modalEventData.value = JSON.parse(JSON.stringify(currentData))
  } else {
    modalEventData.value = createEmptyEventData(instance.eventConfig, instance)
  }
  
  showEventModal.value = true
}

// Get day score for display in modal
function getDayScore(dayIndex) {
  const score = modalEventData.value?.days?.[dayIndex]?.score
  if (score == null) return ''
  return formatNumber(score)
}

// Get total score for display
function getTotalScore() {
  const score = modalEventData.value?.totalScore
  if (score == null) return ''
  return formatNumber(score)
}

// Get simple mode score for display
function getSimpleScore() {
  const score = modalEventData.value?.score
  if (score == null) return ''
  return formatNumber(score)
}

// Update modal total score
function updateModalTotalScore(value) {
  if (!modalEventData.value) return
  modalEventData.value.totalScore = parseNumber(value)
}

// Update modal simple score
function updateModalSimpleScore(value) {
  if (!modalEventData.value) return
  modalEventData.value.score = parseNumber(value)
}

// Update modal day score
function updateModalDayScore(dayIndex, value) {
  if (!modalEventData.value?.days) return
  modalEventData.value.days[dayIndex].score = parseNumber(value)
}

// Update modal day won
function updateModalDayWon(dayIndex, won) {
  if (!modalEventData.value?.days) return
  modalEventData.value.days[dayIndex].won = won
}

// Update modal day rank
function updateModalDayRank(dayIndex, value) {
  if (!modalEventData.value?.days) return
  const rank = value === '' || value == null ? null : parseInt(value, 10)
  modalEventData.value.days[dayIndex].rank = isNaN(rank) ? null : rank
}

// Update modal opponent (for per-guild opponents like GvG)
function updateModalOpponent(value) {
  if (!modalEventData.value) return
  modalEventData.value.opponent = value || null
}

// Calculate modal total score
function calculateModalTotal() {
  if (!modalEventData.value) return 0
  
  if (modalEventData.value.totalScore != null) {
    return modalEventData.value.totalScore
  }
  
  if (modalEventData.value.days) {
    return modalEventData.value.days.reduce((sum, day) => sum + (day.score || 0), 0)
  }
  
  return modalEventData.value.score || 0
}

// Close event modal
function closeEventModal() {
  showEventModal.value = false
  selectedGuild.value = null
  selectedGuildIndex.value = -1
  selectedInstance.value = null
  modalEventData.value = null
}

// Save event modal
function saveEventModal() {
  if (selectedGuildIndex.value >= 0 && selectedInstance.value && modalEventData.value) {
    store.updateGuildEventData(
      selectedGuildIndex.value,
      selectedInstance.value.id,
      modalEventData.value
    )
  }
  closeEventModal()
}
</script>

<style scoped>
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
</style>
