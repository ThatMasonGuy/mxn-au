<template>
    <header class="bg-gradient-to-r from-velaris-purple to-velaris-teal text-white shadow-lg pt-16">
        <div
            class="container mx-auto py-6 px-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 class="text-3xl font-bold mb-1">
                    {{ guildName }} — {{ eventName }} Event Dashboard
                </h1>
                <p class="text-white/80 text-sm">{{ byline }}</p>
            </div>

            <!-- Actions: icon-only, always inline -->
            <div class="flex items-center gap-2 md:gap-3 mt-2 md:mt-0">
                <!-- Theme Selector (icon only) -->
                <button @click="openModal"
                    class="p-2 rounded-md bg-white/10 backdrop-blur-sm text-white border border-white/20 shadow-sm hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/30"
                    title="Theme">
                    <Palette :size="18" />
                    <span class="sr-only">Theme</span>
                </button>

                <!-- View Toggle (icon only) -->
                <button @click="toggleSummaryView"
                    class="p-2 rounded-md bg-white text-velaris-purple shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-white/30"
                    :title="summaryView ? 'Switch to Player Data' : 'Switch to Summary View'">
                    <component :is="summaryView ? Users : BarChart3" :size="18" />
                    <span class="sr-only">
                        {{ summaryView ? 'Switch to Player Data' : 'Switch to Summary View' }}
                    </span>
                </button>
            </div>
        </div>

        <!-- Theme Selection Modal -->
        <div v-if="showThemeModal"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            @click="handleBackdropClose">
            <div class="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-6" @click.stop>
                <!-- Modal Header -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <Palette :size="20" class="text-velaris-purple" />
                        <h3 class="text-lg font-semibold text-foreground">Theme Settings</h3>
                    </div>
                    <button @click="cancelPreview" class="text-muted-foreground hover:text-foreground transition-colors"
                        title="Close">
                        <X :size="20" />
                    </button>
                </div>

                <!-- Theme Style Selection (Auto / Light / Dark) -->
                <div class="space-y-3">
                    <label class="text-sm font-medium text-foreground">Theme Style</label>
                    <div class="grid grid-cols-3 gap-2">
                        <button v-for="style in themeStyles" :key="style.value" @click="selectStyle(style.value)"
                            :class="[
                                'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                                selectedStyle === style.value
                                    ? 'border-velaris-purple bg-velaris-purple/10'
                                    : 'border-border hover:border-velaris-purple/50 hover:bg-muted/50'
                            ]">
                            <component :is="style.icon" :size="20"
                                :class="selectedStyle === style.value ? 'text-velaris-purple' : 'text-muted-foreground'" />
                            <span class="text-xs font-medium text-foreground">{{ style.label }}</span>
                        </button>
                    </div>
                </div>

                <!-- Color Scheme Selection (ONLY Velaris / Froggy) -->
                <div class="space-y-3">
                    <label class="text-sm font-medium text-foreground">Color Scheme</label>
                    <div class="space-y-2">
                        <button v-for="scheme in colorSchemes" :key="scheme.value" @click="selectScheme(scheme.value)"
                            :class="[
                                'w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left',
                                selectedScheme === scheme.value
                                    ? 'border-velaris-purple bg-velaris-purple/10'
                                    : 'border-border hover:border-velaris-purple/50 hover:bg-muted/50'
                            ]">
                            <div class="flex gap-1">
                                <div v-for="color in scheme.colors" :key="color" :style="{ backgroundColor: color }"
                                    class="w-4 h-4 rounded-full border border-white/20" />
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-foreground flex items-center gap-2">
                                    {{ scheme.label }}
                                    <component v-if="scheme.icon" :is="scheme.icon" :size="16" />
                                </div>
                                <div class="text-xs text-muted-foreground">{{ scheme.description }}</div>
                            </div>
                            <div v-if="selectedScheme === scheme.value" class="text-velaris-purple">
                                <Check :size="16" />
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Modal Actions -->
                <div class="flex gap-3 pt-2">
                    <button @click="cancelPreview"
                        class="flex-1 px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-colors">
                        Cancel
                    </button>
                    <button @click="applyTheme"
                        class="flex-1 px-4 py-2 bg-velaris-purple text-white rounded-md hover:bg-velaris-purple/90 transition-colors">
                        Apply Theme
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import {
    Palette,
    X,
    Check,
    Monitor,
    Sun,
    Moon,
    Users,
    BarChart3,
    Crown,
    Leaf
} from 'lucide-vue-next'
import { useThemeStore } from '@/stores/useThemeStore'

const props = defineProps({
    guildName: String,
    eventName: String,
    byline: String,
    summaryView: Boolean,
    toggleSummaryView: Function
})

const themeStore = useThemeStore()

// Modal / selection state
const showThemeModal = ref(false)
const selectedStyle = ref('auto')
const selectedScheme = ref('velaris')

// Track original theme for revert-on-cancel
const originalTheme = ref(themeStore.currentTheme)

// Theme configuration
const themeStyles = [
    { value: 'auto', label: 'Auto', icon: Monitor },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon }
]

const colorSchemes = [
    {
        value: 'velaris',
        label: 'Velaris',
        description: 'Purple & teal theme',
        colors: ['#7C3AED', '#06B6D4', '#22C55E', '#F59E0B'],
        icon: Crown
    },
    {
        value: 'froggy',
        label: 'Froggy',
        description: 'Green nature theme',
        colors: ['#22C55E', '#14B8A6', '#84CC16', '#FDE047'],
        icon: Leaf
    }
]

// Parse current selection when component mounts
onMounted(() => {
    parseCurrentTheme()
})

// Live preview whenever selection changes (while modal is open)
watch([selectedStyle, selectedScheme, showThemeModal], ([, , open]) => {
    if (!open) return
    themeStore.previewTheme(previewName())
})

// Helpers
function parseCurrentTheme() {
    const parsed = themeStore.parseTheme()
    selectedScheme.value = parsed.scheme
    selectedStyle.value = parsed.style
}

function previewName() {
    return themeStore.buildThemeName(selectedStyle.value, selectedScheme.value)
}

// Open / close handlers
function openModal() {
    originalTheme.value = themeStore.currentTheme // save for potential revert
    parseCurrentTheme() // sync selections with saved theme
    showThemeModal.value = true
    // initial preview matches the current theme classes already applied
}

function handleBackdropClose() {
    cancelPreview()
}

function cancelPreview() {
    // Revert classes to the saved theme and close
    themeStore.previewTheme(originalTheme.value)
    showThemeModal.value = false
}

// Selection handlers (trigger preview via watcher)
function selectStyle(val) {
    selectedStyle.value = val
}
function selectScheme(val) {
    selectedScheme.value = val
}

// Apply & persist
function applyTheme() {
    const newTheme = previewName()
    themeStore.setTheme(newTheme)     // persists + applies via watcher
    showThemeModal.value = false
}
</script>