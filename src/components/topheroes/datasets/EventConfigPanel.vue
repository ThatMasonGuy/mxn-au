<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Calendar class="w-5 h-5 text-lime-400" />
        <h2 class="text-lg font-bold text-lime-300">Event Configuration</h2>
      </div>
      <Button 
        @click="showAddEventModal = true" 
        size="sm"
        class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold"
      >
        <Plus class="w-4 h-4 mr-1" />
        Add Event Type
      </Button>
    </div>

    <!-- No Events -->
    <div 
      v-if="eventConfigs.length === 0"
      class="text-center py-8 bg-green-950/30 rounded-xl border-2 border-dashed border-lime-500/30"
    >
      <Calendar class="w-10 h-10 text-lime-500/50 mx-auto mb-3" />
      <p class="text-lime-300/70 mb-2">No events configured</p>
      <p class="text-lime-300/50 text-sm mb-4">Add event types to start tracking data</p>
      <Button 
        @click="showAddEventModal = true"
        size="sm"
        class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold"
      >
        <Plus class="w-4 h-4 mr-1" />
        Add Event Type
      </Button>
    </div>

    <!-- Event Configs List -->
    <div v-else class="space-y-4">
      <div
        v-for="eventConfig in eventConfigs"
        :key="eventConfig.templateId"
        class="bg-green-950/50 rounded-xl border-2 border-lime-500/30 overflow-hidden"
      >
        <!-- Event Type Header -->
        <div class="p-4 border-b border-lime-500/20">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    :checked="eventConfig.enabled"
                    @change="toggleEventConfig(eventConfig.templateId, $event.target.checked)"
                    class="sr-only peer"
                  >
                  <div class="w-9 h-5 bg-green-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lime-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-lime-600"></div>
                </label>
              </div>
              
              <component 
                :is="getEventIcon(eventConfig.template.category)" 
                class="w-5 h-5"
                :class="getEventIconColor(eventConfig.template.category)"
              />
              <div>
                <h3 class="font-semibold text-lime-200">{{ eventConfig.template.name }}</h3>
                <p class="text-xs text-lime-300/60">{{ eventConfig.template.description }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <Badge class="bg-lime-600/20 border-lime-500 text-lime-300 text-xs">
                {{ eventConfig.instances.length }} {{ eventConfig.instances.length === 1 ? 'event' : 'events' }}
              </Badge>
              <Button
                @click="openSettings(eventConfig)"
                size="sm"
                variant="ghost"
                class="text-lime-400 hover:bg-lime-500/20"
              >
                <Settings class="w-4 h-4" />
              </Button>
              <Button
                @click="confirmRemoveEventType(eventConfig)"
                size="sm"
                variant="ghost"
                class="text-red-400 hover:bg-red-500/20"
              >
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
          </div>

          <!-- Input Mode Selector -->
          <div v-if="eventConfig.enabled" class="mt-3 flex items-center gap-4">
            <span class="text-xs text-lime-300/70">Input Mode:</span>
            <div class="flex gap-2">
              <button
                v-for="mode in eventConfig.template.inputModes"
                :key="mode"
                @click="setInputMode(eventConfig.templateId, mode)"
                :class="[
                  'px-3 py-1 rounded text-xs font-medium transition-all',
                  eventConfig.inputMode === mode
                    ? 'bg-lime-600 text-green-950'
                    : 'bg-green-800/50 text-lime-300 hover:bg-green-800'
                ]"
              >
                {{ getInputModeLabel(mode) }}
              </button>
            </div>
          </div>
        </div>

        <!-- Event Instances -->
        <div v-if="eventConfig.enabled" class="p-4">
          <!-- Instance List -->
          <div v-if="eventConfig.instances.length > 0" class="space-y-2 mb-3">
            <div
              v-for="(instance, idx) in eventConfig.instances"
              :key="instance.id"
              class="flex items-center justify-between p-3 bg-green-900/30 rounded-lg border border-lime-500/20"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-lime-200 truncate">{{ instance.name }}</span>
                  <Badge v-if="instance.opponent" class="bg-purple-600/20 border-purple-500 text-purple-300 text-xs">
                    vs {{ instance.opponent }}
                  </Badge>
                </div>
                <div v-if="instance.startDate" class="text-xs text-lime-300/50 mt-0.5">
                  {{ formatDate(instance.startDate) }}
                </div>
              </div>
              
              <div class="flex items-center gap-1 ml-2">
                <Button
                  @click="editInstance(eventConfig, instance)"
                  size="sm"
                  variant="ghost"
                  class="text-lime-400 hover:bg-lime-500/20 h-8 w-8 p-0"
                >
                  <Pencil class="w-3 h-3" />
                </Button>
                <Button
                  @click="confirmRemoveInstance(eventConfig, instance)"
                  size="sm"
                  variant="ghost"
                  class="text-red-400 hover:bg-red-500/20 h-8 w-8 p-0"
                >
                  <X class="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          <!-- Add Instance Button -->
          <Button
            @click="openAddInstance(eventConfig)"
            size="sm"
            variant="outline"
            class="w-full text-lime-400 bg-lime-600/10 border-lime-400/30 hover:bg-lime-500/20 border-dashed"
          >
            <Plus class="w-4 h-4 mr-1" />
            Add {{ eventConfig.template.name }}
          </Button>
        </div>

        <!-- Disabled Message -->
        <div v-else class="p-4 text-center text-lime-300/50 text-sm">
          Enable this event type to add events
        </div>
      </div>
    </div>

    <!-- Add Event Type Modal -->
    <Dialog v-model:open="showAddEventModal">
      <DialogContent class="bg-gradient-to-br from-green-900/95 to-emerald-900/95 border-2 border-lime-400/30 text-lime-100">
        <DialogHeader>
          <DialogTitle class="text-xl font-bold text-lime-300 flex items-center gap-2">
            <Plus class="w-5 h-5" />
            Add Event Type
          </DialogTitle>
          <DialogDescription class="text-lime-200/70">
            Select an event type to track in this dataset
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-2 mt-4">
          <button
            v-for="template in availableTemplates"
            :key="template.id"
            @click="addEventType(template.id)"
            :disabled="isTemplateUsed(template.id)"
            :class="[
              'w-full p-4 rounded-lg border text-left transition-all',
              isTemplateUsed(template.id)
                ? 'bg-gray-800/30 border-gray-500/20 opacity-50 cursor-not-allowed'
                : 'bg-green-950/50 border-lime-500/30 hover:border-lime-400 hover:bg-green-950/70'
            ]"
          >
            <div class="flex items-center gap-3">
              <component 
                :is="getEventIcon(template.category)" 
                class="w-6 h-6"
                :class="getEventIconColor(template.category)"
              />
              <div class="flex-1">
                <div class="font-semibold text-lime-200">{{ template.name }}</div>
                <div class="text-xs text-lime-300/60">{{ template.description }}</div>
                <div class="flex gap-2 mt-1">
                  <span class="text-xs text-lime-400/50">{{ template.dayCount }} days</span>
                  <span v-if="template.hasWinLoss" class="text-xs text-lime-400/50">• Win/Loss</span>
                  <span v-if="template.hasRanks" class="text-xs text-lime-400/50">• Ranks</span>
                </div>
              </div>
              <Badge v-if="isTemplateUsed(template.id)" class="bg-gray-600/20 border-gray-500 text-gray-300">
                Added
              </Badge>
            </div>
          </button>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <Button
            @click="showAddEventModal = false"
            variant="outline"
            class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Add/Edit Instance Modal -->
    <Dialog v-model:open="showInstanceModal">
      <DialogContent class="bg-gradient-to-br from-green-900/95 to-emerald-900/95 border-2 border-lime-400/30 text-lime-100">
        <DialogHeader>
          <DialogTitle class="text-xl font-bold text-lime-300 flex items-center gap-2">
            <component 
              v-if="selectedEventConfig"
              :is="getEventIcon(selectedEventConfig.template.category)" 
              class="w-5 h-5"
              :class="getEventIconColor(selectedEventConfig.template.category)"
            />
            {{ editingInstance ? 'Edit' : 'Add' }} {{ selectedEventConfig?.template.name }}
          </DialogTitle>
        </DialogHeader>

        <div class="space-y-4 mt-4">
          <div>
            <label class="text-sm text-lime-300/80 mb-1 block">Event Name</label>
            <Input
              v-model="instanceForm.name"
              :placeholder="`e.g., Week 1 ${selectedEventConfig?.template.name || 'Event'}`"
              class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400"
            />
          </div>

          <div v-if="selectedEventConfig?.template.hasOpponent && selectedEventConfig?.template?.category !== 'gvg'">
            <label class="text-sm text-lime-300/80 mb-1 block">
              {{ selectedEventConfig.template.opponentType === 'server' ? 'Opponent Server' : 'Shared Opponent' }}
            </label>
            <Input
              v-model="instanceForm.opponent"
              :placeholder="selectedEventConfig.template.opponentType === 'server' ? 'e.g., S456' : 'e.g., Enemy Guild'"
              class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400"
            />
            <p class="text-xs text-lime-400/50 mt-1">This opponent applies to all guilds for this event</p>
          </div>

          <div v-if="selectedEventConfig?.template?.category === 'gvg'" class="p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
            <p class="text-sm text-purple-300">
              <strong>Per-Guild Opponents:</strong> Each guild will have their own opponent for this event. Set opponents when editing individual guild data.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-lime-300/80 mb-1 block">Start Date (optional)</label>
              <Input
                v-model="instanceForm.startDate"
                type="date"
                class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400"
              />
            </div>
            <div>
              <label class="text-sm text-lime-300/80 mb-1 block">End Date (optional)</label>
              <Input
                v-model="instanceForm.endDate"
                type="date"
                class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <Button
            @click="showInstanceModal = false"
            variant="outline"
            class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20"
          >
            Cancel
          </Button>
          <Button
            @click="saveInstance"
            :disabled="!instanceForm.name.trim()"
            class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold"
          >
            {{ editingInstance ? 'Save' : 'Add' }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Event Settings Modal -->
    <Dialog v-model:open="showSettingsModal">
      <DialogContent class="bg-gradient-to-br from-green-900/95 to-emerald-900/95 border-2 border-lime-400/30 text-lime-100">
        <DialogHeader>
          <DialogTitle class="text-xl font-bold text-lime-300 flex items-center gap-2">
            <Settings class="w-5 h-5" />
            {{ selectedEventConfig?.template.name }} Settings
          </DialogTitle>
        </DialogHeader>

        <div v-if="selectedEventConfig" class="space-y-4 mt-4">
          <!-- Day Count Override -->
          <div>
            <label class="text-sm text-lime-300/80 mb-1 block">Number of Days</label>
            <Input
              v-model.number="settingsForm.dayCount"
              type="number"
              min="1"
              max="30"
              class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400"
            />
            <p class="text-xs text-lime-300/50 mt-1">Default: {{ selectedEventConfig.template.dayCount }}</p>
          </div>

          <!-- Custom Day Labels -->
          <div>
            <label class="text-sm text-lime-300/80 mb-2 block">Day Labels</label>
            <div class="space-y-2 max-h-40 overflow-y-auto pr-2">
              <div v-for="(label, idx) in settingsForm.dayLabels" :key="idx" class="flex items-center gap-2">
                <span class="text-xs text-lime-400 w-12">Day {{ idx + 1 }}:</span>
                <Input
                  v-model="settingsForm.dayLabels[idx]"
                  class="bg-green-950/70 border-lime-500/40 text-lime-100 focus:border-lime-400 h-8 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <Button
            @click="showSettingsModal = false"
            variant="outline"
            class="text-lime-400 bg-lime-600/20 border-lime-400/50 hover:bg-lime-500/20"
          >
            Cancel
          </Button>
          <Button
            @click="saveSettings"
            class="bg-lime-600 hover:bg-lime-500 text-green-950 font-semibold"
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Confirm Remove Event Type Modal -->
    <Dialog v-model:open="showRemoveTypeModal">
      <DialogContent class="bg-gradient-to-br from-red-900/95 to-red-800/95 border-2 border-red-400/30 text-red-100">
        <DialogHeader>
          <DialogTitle class="text-xl font-bold text-red-300 flex items-center gap-2">
            <Trash2 class="w-5 h-5" />
            Remove Event Type
          </DialogTitle>
          <DialogDescription class="text-red-200/70">
            This will remove "{{ eventToRemove?.template.name }}" and all its event instances. Any data entered will be lost.
          </DialogDescription>
        </DialogHeader>

        <div class="flex justify-end gap-2 mt-6">
          <Button
            @click="showRemoveTypeModal = false"
            variant="outline"
            class="text-red-200 border-red-400/50 hover:bg-red-500/20"
          >
            Cancel
          </Button>
          <Button
            @click="performRemoveEventType"
            class="bg-red-600 hover:bg-red-500 text-white font-semibold"
          >
            <Trash2 class="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Confirm Remove Instance Modal -->
    <Dialog v-model:open="showRemoveInstanceModal">
      <DialogContent class="bg-gradient-to-br from-red-900/95 to-red-800/95 border-2 border-red-400/30 text-red-100">
        <DialogHeader>
          <DialogTitle class="text-xl font-bold text-red-300 flex items-center gap-2">
            <Trash2 class="w-5 h-5" />
            Remove Event
          </DialogTitle>
          <DialogDescription class="text-red-200/70">
            Remove "{{ instanceToRemove?.name }}"? Any data for this event will be lost.
          </DialogDescription>
        </DialogHeader>

        <div class="flex justify-end gap-2 mt-6">
          <Button
            @click="showRemoveInstanceModal = false"
            variant="outline"
            class="text-red-200 border-red-400/50 hover:bg-red-500/20"
          >
            Cancel
          </Button>
          <Button
            @click="performRemoveInstance"
            class="bg-red-600 hover:bg-red-500 text-white font-semibold"
          >
            <Trash2 class="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar, Plus, Settings, Trash2, Sword, Globe, Zap, Pencil, X } from 'lucide-vue-next'
import { useDatasetStore } from '@/stores/useDatasetStore'
import { getTemplateList, getEventDayLabels } from '@/lib/eventTemplates'

const store = useDatasetStore()

// Get event configs from store
const eventConfigs = computed(() => store.eventConfigs)

// Available templates
const availableTemplates = computed(() => getTemplateList())

// Modals
const showAddEventModal = ref(false)
const showInstanceModal = ref(false)
const showSettingsModal = ref(false)
const showRemoveTypeModal = ref(false)
const showRemoveInstanceModal = ref(false)

// Selected items
const selectedEventConfig = ref(null)
const editingInstance = ref(null)
const eventToRemove = ref(null)
const instanceToRemove = ref(null)
const instanceToRemoveConfig = ref(null)

// Forms
const instanceForm = ref({
  name: '',
  opponent: '',
  startDate: '',
  endDate: ''
})

const settingsForm = ref({
  dayCount: 6,
  dayLabels: []
})

// Check if template is already used
function isTemplateUsed(templateId) {
  return eventConfigs.value.some(ec => ec.templateId === templateId)
}

// Get icon for event category
function getEventIcon(category) {
  switch (category) {
    case 'gvg': return Sword
    case 'kvk': return Globe
    default: return Zap
  }
}

// Get icon color for event category
function getEventIconColor(category) {
  switch (category) {
    case 'gvg': return 'text-lime-400'
    case 'kvk': return 'text-purple-400'
    default: return 'text-yellow-400'
  }
}

// Get input mode label
function getInputModeLabel(mode) {
  switch (mode) {
    case 'daily': return 'Daily Scores'
    case 'total': return 'Total Only'
    case 'simple': return 'Win/Loss Only'
    default: return mode
  }
}

// Format date
function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

// Add event type
async function addEventType(templateId) {
  await store.addEventConfig(templateId)
  showAddEventModal.value = false
}

// Toggle event config enabled
async function toggleEventConfig(templateId, enabled) {
  await store.updateEventConfig(templateId, { enabled })
}

// Set input mode
async function setInputMode(templateId, mode) {
  await store.updateEventConfig(templateId, { inputMode: mode })
}

// Open add instance modal
function openAddInstance(eventConfig) {
  selectedEventConfig.value = eventConfig
  editingInstance.value = null
  instanceForm.value = {
    name: `${eventConfig.template.name} ${eventConfig.instances.length + 1}`,
    opponent: '',
    startDate: '',
    endDate: ''
  }
  showInstanceModal.value = true
}

// Edit instance
function editInstance(eventConfig, instance) {
  selectedEventConfig.value = eventConfig
  editingInstance.value = instance
  instanceForm.value = {
    name: instance.name,
    opponent: instance.opponent || '',
    startDate: instance.startDate || '',
    endDate: instance.endDate || ''
  }
  showInstanceModal.value = true
}

// Save instance
async function saveInstance() {
  if (!selectedEventConfig.value || !instanceForm.value.name.trim()) return
  
  if (editingInstance.value) {
    await store.updateEventInstance(
      selectedEventConfig.value.templateId,
      editingInstance.value.id,
      {
        name: instanceForm.value.name.trim(),
        opponent: instanceForm.value.opponent.trim(),
        startDate: instanceForm.value.startDate || null,
        endDate: instanceForm.value.endDate || null
      }
    )
  } else {
    await store.addEventInstance(selectedEventConfig.value.templateId, {
      name: instanceForm.value.name.trim(),
      opponent: instanceForm.value.opponent.trim(),
      startDate: instanceForm.value.startDate || null,
      endDate: instanceForm.value.endDate || null
    })
  }
  
  showInstanceModal.value = false
}

// Open settings modal
function openSettings(eventConfig) {
  selectedEventConfig.value = eventConfig
  const dayCount = eventConfig.overrides?.dayCount || eventConfig.template.dayCount
  const labels = getEventDayLabels(eventConfig, null)
  
  settingsForm.value = {
    dayCount,
    dayLabels: [...labels]
  }
  showSettingsModal.value = true
}

// Watch day count changes to update labels
watch(() => settingsForm.value.dayCount, (newCount) => {
  const currentLength = settingsForm.value.dayLabels.length
  if (newCount > currentLength) {
    for (let i = currentLength; i < newCount; i++) {
      settingsForm.value.dayLabels.push(`Day ${i + 1}`)
    }
  } else if (newCount < currentLength) {
    settingsForm.value.dayLabels = settingsForm.value.dayLabels.slice(0, newCount)
  }
})

// Save settings
async function saveSettings() {
  if (!selectedEventConfig.value) return
  
  await store.updateEventConfig(selectedEventConfig.value.templateId, {
    overrides: {
      ...selectedEventConfig.value.overrides,
      dayCount: settingsForm.value.dayCount,
      dayLabels: settingsForm.value.dayLabels
    }
  })
  
  showSettingsModal.value = false
}

// Confirm remove event type
function confirmRemoveEventType(eventConfig) {
  eventToRemove.value = eventConfig
  showRemoveTypeModal.value = true
}

// Perform remove event type
async function performRemoveEventType() {
  if (!eventToRemove.value) return
  await store.removeEventConfig(eventToRemove.value.templateId)
  showRemoveTypeModal.value = false
  eventToRemove.value = null
}

// Confirm remove instance
function confirmRemoveInstance(eventConfig, instance) {
  instanceToRemoveConfig.value = eventConfig
  instanceToRemove.value = instance
  showRemoveInstanceModal.value = true
}

// Perform remove instance
async function performRemoveInstance() {
  if (!instanceToRemoveConfig.value || !instanceToRemove.value) return
  await store.removeEventInstance(
    instanceToRemoveConfig.value.templateId,
    instanceToRemove.value.id
  )
  showRemoveInstanceModal.value = false
  instanceToRemove.value = null
  instanceToRemoveConfig.value = null
}
</script>
