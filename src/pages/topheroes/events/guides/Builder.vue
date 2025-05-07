<template>
    <div class="flex h-screen text-white bg-zinc-900 overflow-hidden">
        <!-- Collapsible Sidebar -->
        <div class="flex flex-col border-r border-zinc-700 transition-all duration-300 ease-in-out"
            :class="[sidebarCollapsed ? 'w-14' : 'w-72']">
            <!-- Sidebar Header with Toggle -->
            <div class="p-4 border-b border-zinc-700 flex items-center justify-between">
                <div v-if="!sidebarCollapsed" class="flex-1">
                    <h2 class="text-xl font-semibold">🧱 Add Block</h2>
                    <p class="text-sm text-zinc-400">Component library</p>
                </div>
                <button @click="toggleSidebar"
                    class="p-1 rounded-md hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                    :title="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" :class="{ 'rotate-180': sidebarCollapsed }">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            <!-- Sidebar Content -->
            <div class="flex-1 overflow-hidden bg-zinc-800">
                <div v-if="sidebarCollapsed" class="flex flex-col items-center py-4 space-y-4">
                    <button v-for="(items, group) in allGroups" :key="group"
                        @click="showQuickAdd = !showQuickAdd; activeGroup = group"
                        class="w-8 h-8 rounded-md hover:bg-zinc-700 flex items-center justify-center text-xs font-bold transition-colors"
                        :title="group">
                        {{ group.charAt(0) }}
                    </button>
                </div>
                <GuideBlockLibrary v-else @new-block="addBlock" class="h-full" />
            </div>

            <!-- Quick add popup when sidebar is collapsed -->
            <div v-if="showQuickAdd && sidebarCollapsed"
                class="absolute top-0 left-14 mt-16 bg-zinc-800 border border-zinc-700 rounded-md shadow-xl p-2 z-10 w-48">
                <div class="text-sm font-semibold mb-2 px-2">{{ activeGroup }}</div>
                <button v-for="type in allGroups[activeGroup]" :key="type" @click="addBlock(type); showQuickAdd = false"
                    class="w-full text-left px-3 py-2 text-white rounded-md hover:bg-zinc-700 hover:text-purple-300 transition-colors">
                    {{ type }}
                </button>
            </div>
        </div>

        <!-- Main content area -->
        <main class="flex-1 flex flex-col overflow-hidden">
            <!-- Builder Viewport with gradient header -->
            <div class="flex-1 overflow-hidden relative">
                <div
                    class="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent h-12 pointer-events-none z-10">
                </div>

                <div class="h-full px-6 py-6 overflow-auto">
                    <div class="bg-zinc-800 rounded-xl shadow-xl overflow-auto min-h-full p-8">
                        <GuideBuilder :blocks="guideBlocks" />
                    </div>
                </div>
            </div>

            <!-- JSON Viewer Toggle Header -->
            <div
                class="bg-zinc-900 border-t border-zinc-800 px-4 py-2 flex items-center justify-between text-xs font-mono">
                <div class="flex items-center gap-2">
                    <button @click="jsonViewerOpen = !jsonViewerOpen"
                        class="flex items-center gap-1 text-zinc-400 hover:text-purple-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform"
                            :class="{ 'rotate-180': jsonViewerOpen }" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        <span>JSON Output</span>
                    </button>
                </div>
                <div class="flex space-x-2">
                    <button @click="jsonViewerHeight = 200" class="text-zinc-400 hover:text-white transition text-xs">
                        Reset
                    </button>
                    <button @click="copyJson"
                        class="text-zinc-400 hover:text-white transition text-xs flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" />
                        </svg>
                        Copy
                    </button>
                </div>
            </div>

            <!-- JSON Viewer Panel -->
            <Transition name="fade">
                <div v-show="jsonViewerOpen" class="bg-zinc-950 border-t border-zinc-700"
                    :style="{ height: `${jsonViewerHeight}px` }">
                    <!-- Resize handle -->
                    <div class="absolute top-0 left-0 right-0 h-1 bg-zinc-800 cursor-ns-resize"
                        @mousedown="startResize" />
                    <div class="overflow-auto h-full pb-4 px-4" style="height: calc(100% - 1rem)">
                        <GuideJsonEditor :blocks="guideBlocks" />
                    </div>
                </div>
            </Transition>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import GuideBlockLibrary from '@/components/topheroes/events/guides/admin/GuideBlockLibrary.vue'
import GuideBuilder from '@/components/topheroes/events/guides/admin/GuideBuilder.vue'
import GuideJsonEditor from '@/components/topheroes/events/guides/admin/GuideJsonEditor.vue'
import { buildEmptyBlock } from '@/composables/topheroes/admin/useGuideHelpers.js'

// State for blocks
const guideBlocks = ref([])

// State for sidebar collapse
const sidebarCollapsed = ref(false)
const showQuickAdd = ref(false)
const activeGroup = ref('')

// State for JSON viewer height
const jsonViewerHeight = ref(200)
const jsonViewerOpen = ref(false)
const isResizing = ref(false)
const startY = ref(0)
const startHeight = ref(0)

// Groups data for quick-add menu when sidebar is collapsed
const allGroups = {
    Layout: ['TitleSection', 'Divider', 'Spacer'],
    Content: ['TipList', 'CalloutBox', 'WarningBox', 'QuoteHighlight'],
    Data: ['TimelineSection', 'ItemTable'],
    Media: ['HeroImageBanner', 'ImageGallery', 'VideoEmbed']
}

// Functions
function addBlock(type) {
    guideBlocks.value.push(buildEmptyBlock(type))
}

function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
    showQuickAdd.value = false
}

function copyJson() {
    const jsonString = JSON.stringify(guideBlocks.value, null, 2)
    navigator.clipboard.writeText(jsonString)
        .then(() => {
            // Could add a toast notification here
            console.log('JSON copied to clipboard')
        })
        .catch(err => {
            console.error('Failed to copy JSON: ', err)
        })
}

function startResize(e) {
    isResizing.value = true
    startY.value = e.clientY
    startHeight.value = jsonViewerHeight.value

    // Prevent text selection during resize
    document.body.style.userSelect = 'none'
}

function handleResize(e) {
    if (!isResizing.value) return

    const deltaY = startY.value - e.clientY
    const newHeight = Math.max(100, Math.min(500, startHeight.value + deltaY))
    jsonViewerHeight.value = newHeight
}

function stopResize() {
    isResizing.value = false
    document.body.style.userSelect = ''
}

// Event listeners for resize
onMounted(() => {
    document.addEventListener('mousemove', handleResize)
    document.addEventListener('mouseup', stopResize)
})

onUnmounted(() => {
    document.removeEventListener('mousemove', handleResize)
    document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
/* Optional animations for sidebar toggling */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}
</style>