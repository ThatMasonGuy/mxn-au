<template>
  <div class="p-8 max-w-4xl">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Settings</h1>
      <p class="text-gray-600 dark:text-gray-400">Customize your Professional Suite experience.</p>
    </div>

    <!-- Settings Form -->
    <div class="space-y-6">
      <!-- Appearance Section -->
      <div class="professional-card">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Appearance</h2>
        
        <!-- Dark Mode Toggle -->
        <div class="flex items-center justify-between mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Dark Mode</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Switch between light and dark theme</p>
          </div>
          <button
            @click="toggleDarkMode"
            class="relative w-11 h-6 rounded-full transition-colors"
            :class="localSettings.darkMode ? 'bg-blue-600' : 'bg-gray-300'"
          >
            <span
              class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"
              :class="localSettings.darkMode ? 'translate-x-5' : 'translate-x-0'"
            />
          </button>
        </div>

        <!-- Theme Selection -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Color Theme</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">Choose a color theme for your interface</p>
          
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              v-for="theme in themes"
              :key="theme.value"
              @click="selectTheme(theme.value)"
              class="relative group professional-card p-4 cursor-pointer transition-all"
              :class="[
                localSettings.theme === theme.value
                  ? 'ring-2 ring-offset-2 ring-blue-600'
                  : 'hover:shadow-lg'
              ]"
            >
              <!-- Theme Preview Colors -->
              <div class="flex gap-2 mb-3">
                <div
                  v-for="color in theme.colors"
                  :key="color"
                  class="w-8 h-8 rounded"
                  :style="{ backgroundColor: color }"
                />
              </div>
              
              <!-- Theme Name -->
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ theme.name }}
                </span>
                <CheckCircle2
                  v-if="localSettings.theme === theme.value"
                  :size="16"
                  class="text-blue-600"
                />
              </div>
              
              <!-- Theme Description -->
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {{ theme.description }}
              </p>
            </button>
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div class="professional-card">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Preview</h2>
        
        <div class="space-y-4">
          <!-- Button Previews -->
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Buttons</p>
            <div class="flex flex-wrap gap-3">
              <button class="btn-professional-primary">
                Primary Button
              </button>
              <button class="btn-professional-secondary">
                Secondary Button
              </button>
              <button class="px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white">
                Success
              </button>
              <button class="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white">
                Delete
              </button>
            </div>
          </div>

          <!-- Card Preview -->
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Cards & Stats</p>
            <div class="grid grid-cols-3 gap-4">
              <div class="professional-stat-card">
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">42</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Total Items</div>
              </div>
              <div class="professional-stat-card">
                <div class="text-2xl font-bold text-green-600">$12,345</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
              </div>
              <div class="professional-stat-card">
                <div class="text-2xl font-bold text-orange-600">8</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Pending</div>
              </div>
            </div>
          </div>

          <!-- Status Badges -->
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Status Badges</p>
            <div class="flex flex-wrap gap-2">
              <span class="status-badge status-badge-paid">Paid</span>
              <span class="status-badge status-badge-pending">Pending</span>
              <span class="status-badge status-badge-overdue">Overdue</span>
              <span class="status-badge status-badge-draft">Draft</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Actions -->
      <div class="flex justify-end gap-3">
        <button
          @click="resetSettings"
          class="btn-professional-secondary"
          :disabled="saving"
        >
          Reset
        </button>
        <button
          @click="saveSettings"
          class="btn-professional-primary"
          :disabled="saving || !hasChanges"
        >
          <Loader2 v-if="saving" :size="16" class="animate-spin" />
          <Save v-else :size="16" />
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMainStore } from '@/stores/useMainStore'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { useToast } from '@/components/ui/toast'
import { CheckCircle2, Save, Loader2 } from 'lucide-vue-next'

const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const saving = ref(false)
const localSettings = ref({
  theme: 'classic',
  darkMode: false
})

const themes = [
  {
    name: 'Classic',
    value: 'classic',
    description: 'Professional blue-gray',
    colors: ['#3b82f6', '#06b6d4', '#e5e7eb']
  },
  {
    name: 'Modern',
    value: 'modern',
    description: 'Sleek purple & indigo',
    colors: ['#7c3aed', '#6366f1', '#e5e7eb']
  },
  {
    name: 'Slate',
    value: 'slate',
    description: 'Sophisticated gray',
    colors: ['#475569', '#14b8a6', '#e5e7eb']
  },
  {
    name: 'Emerald',
    value: 'emerald',
    description: 'Fresh green & teal',
    colors: ['#059669', '#14b8a6', '#e5e7eb']
  },
  {
    name: 'Coral',
    value: 'coral',
    description: 'Warm & inviting',
    colors: ['#f97316', '#ec4899', '#e5e7eb']
  },
  {
    name: 'Navy',
    value: 'navy',
    description: 'Classic navy & gold',
    colors: ['#1e3a8a', '#eab308', '#e5e7eb']
  }
]

const hasChanges = computed(() => {
  return localSettings.value.theme !== professionalStore.settings.theme ||
         localSettings.value.darkMode !== professionalStore.settings.darkMode
})

onMounted(() => {
  // Load current settings
  localSettings.value = { ...professionalStore.settings }
})

function selectTheme(theme) {
  localSettings.value.theme = theme
  // Apply immediately for preview
  professionalStore.settings.theme = theme
  professionalStore.applyTheme()
}

function toggleDarkMode() {
  localSettings.value.darkMode = !localSettings.value.darkMode
  // Apply immediately for preview
  professionalStore.settings.darkMode = localSettings.value.darkMode
  professionalStore.applyTheme()
}

async function saveSettings() {
  if (!mainStore.user?.uid) return
  
  saving.value = true
  
  try {
    await professionalStore.saveSettings(mainStore.user.uid, localSettings.value)
    
    toast({
      title: 'Success',
      description: 'Settings saved successfully'
    })
  } catch (error) {
    console.error('Error saving settings:', error)
    toast({
      title: 'Error',
      description: 'Failed to save settings',
      variant: 'destructive'
    })
  } finally {
    saving.value = false
  }
}

function resetSettings() {
  localSettings.value = { ...professionalStore.settings }
  professionalStore.applyTheme()
}
</script>
