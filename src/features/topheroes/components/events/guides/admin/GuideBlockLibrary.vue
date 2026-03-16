<template>
    <div class="flex flex-col border-r border-zinc-700 transition-all duration-300 ease-in-out h-full"
        :class="[sidebarCollapsed ? 'w-14' : 'w-72']">

        <div class="p-4 border-b border-zinc-700 flex items-center justify-between">
            <div v-if="!sidebarCollapsed" class="flex-1">
                <h2 class="text-xl font-semibold flex items-center gap-2 text-zinc-100">
                    <PuzzlePieceIcon class="h-5 w-5" />
                    Add Block
                </h2>
                <p class="text-sm text-zinc-400">Component library</p>
            </div>
            <button @click="(e) => toggleSidebar(e)"
                class="p-1 rounded-md hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                :title="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" :class="{ 'rotate-180': sidebarCollapsed }">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
            </button>
        </div>

        <div class="flex-1 overflow-hidden bg-zinc-800">
            <!-- Collapsed: icons only -->
            <div v-if="sidebarCollapsed" class="flex flex-col items-center py-4 space-y-4">
                <button v-for="(groupData, group) in allGroups" :key="group"
                    @click="showQuickAdd = !showQuickAdd; activeGroup = group"
                    class="w-8 h-8 rounded-md hover:bg-zinc-700 flex items-center justify-center transition-colors"
                    :title="groupData.title">
                    <component :is="iconComponent(groupData.icon)" class="h-5 w-5 text-purple-400" />
                </button>
            </div>

            <!-- Expanded: full group list -->
            <div v-else class="h-full flex flex-col overflow-hidden">
                <!-- Search bar -->
                <div class="px-4 py-3">
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
                        </div>
                        <input v-model="search" type="text" placeholder="Search components..." class="w-full pl-10 pr-3 py-2 rounded-lg bg-zinc-700 text-sm placeholder:text-gray-400
                 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" />
                    </div>
                </div>

                <!-- Component groups -->
                <div class="overflow-y-auto pb-6 px-4 flex-1 space-y-2">
                    <div v-for="(groupData, group) in allGroups" :key="group"
                        class="bg-zinc-800/50 rounded-lg shadow-md">
                        <!-- Group header -->
                        <button @mousedown.prevent @click="toggleGroup(group)" class="w-full flex justify-between items-center px-4 py-3 text-sm font-medium text-white
                 hover:bg-purple-900/20 transition-colors focus:outline-none focus:ring-2
                 focus:ring-inset focus:ring-purple-500" :class="{ 'bg-purple-900/10': openGroups[group] }">
                            <div class="flex items-center gap-2">
                                <component :is="iconComponent(groupData.icon)" class="h-4 w-4 text-purple-400" />
                                <span class="text-purple-300">{{ groupData.title }}</span>
                            </div>
                            <ChevronDownIcon class="h-4 w-4 text-gray-400 transform transition-transform duration-300"
                                :class="{ 'rotate-180': openGroups[group] }" />
                        </button>

                        <!-- Group items -->
                        <Transition name="accordion" mode="out-in">
                            <div v-show="openGroups[group]" class="overflow-hidden">
                                <div class="border-t border-zinc-700/50">
                                    <div v-if="filteredItems(group).length"
                                        class="p-2 space-y-1 bg-gradient-to-b from-zinc-800/0 to-zinc-800/60">
                                        <button v-for="item in filteredItems(group)" :key="item.id"
                                            @click="addNewBlock(item.id)" class="group w-full text-left text-sm px-3 py-2 bg-zinc-800/80 text-white rounded-md
                         hover:bg-zinc-700 hover:text-purple-300 focus:outline-none
                         focus:ring-2 focus:ring-purple-500 transition-all duration-150
                         flex items-center justify-between gap-2">
                                            <div class="flex items-center gap-2">
                                                <component :is="iconComponent(item.icon)"
                                                    class="h-4 w-4 text-zinc-400/60 group-hover:text-purple-300 transition-colors" />
                                                <span>{{ item.title }}</span>
                                            </div>
                                            <span
                                                class="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                                        </button>
                                    </div>
                                    <div v-else class="px-4 py-3 text-sm text-zinc-500 italic">
                                        No matching components
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showQuickAdd && sidebarCollapsed"
            class="absolute top-0 left-14 mt-16 bg-zinc-800 border border-zinc-700 rounded-md shadow-xl p-2 z-10 w-48">
            <div class="text-sm font-semibold mb-2 px-2">{{ activeGroup }}</div>
            <button v-for="type in allGroups[activeGroup]" :key="type" @click="addNewBlock(type); showQuickAdd = false"
                class="w-full text-left px-3 py-2 text-white rounded-md hover:bg-zinc-700 hover:text-purple-300 transition-colors">
                {{ type }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
    RectangleStackIcon,
    DocumentTextIcon,
    ChartBarIcon,
    PhotoIcon,
    PuzzlePieceIcon,
} from '@heroicons/vue/24/solid'

import {
    ViewColumnsIcon,
    MinusIcon,
    ChevronDoubleDownIcon,
    LightBulbIcon,
    ChatBubbleLeftRightIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    TableCellsIcon,
    RectangleGroupIcon,
    Squares2X2Icon,
    PlayCircleIcon
} from '@heroicons/vue/24/outline'

const iconRegistry = {
    ViewColumnsIcon,
    MinusIcon,
    ChevronDoubleDownIcon,
    LightBulbIcon,
    ChatBubbleLeftRightIcon,
    ExclamationTriangleIcon,
    RectangleGroupIcon,
    ClockIcon,
    TableCellsIcon,
    Squares2X2Icon,
    PlayCircleIcon,
    RectangleStackIcon,
    DocumentTextIcon,
    ChartBarIcon,
    PhotoIcon
}

const allGroups = {
    Layout: {
        icon: 'RectangleStackIcon',
        title: 'Layout',
        items: [
            {
                id: 'TitleSection',
                title: 'Title Section',
                icon: 'ViewColumnsIcon',
                description: 'A full-width section with a main heading and subheading.'
            },
            {
                id: 'Divider',
                title: 'Divider',
                icon: 'MinusIcon',
                description: 'Horizontal divider to visually separate content blocks.'
            },
            {
                id: 'Spacer',
                title: 'Spacer',
                icon: 'ChevronDoubleDownIcon',
                description: 'Creates vertical spacing between sections.'
            }
        ]
    },
    Content: {
        icon: 'DocumentTextIcon',
        title: 'Content',
        items: [
            {
                id: 'TipList',
                title: 'Tip List',
                icon: 'LightBulbIcon',
                description: 'A list of helpful tips with icons or emphasis.'
            },
            {
                id: 'CalloutBox',
                title: 'Callout Box',
                icon: 'ChatBubbleLeftRightIcon',
                description: 'A stylized block for highlighting key content or summaries.'
            },
            {
                id: 'WarningBox',
                title: 'Warning Box',
                icon: 'ExclamationTriangleIcon',
                description: 'A colored box to alert users of critical information or risks.'
            },
            {
                id: 'QuoteHighlight',
                title: 'Quote Highlight',
                icon: 'RectangleGroupIcon',
                description: 'Used to highlight quotes or key statements in stylized format.'
            }
        ]
    },
    Data: {
        icon: 'ChartBarIcon',
        title: 'Data',
        items: [
            {
                id: 'TimelineSection',
                title: 'Timeline Section',
                icon: 'ClockIcon',
                description: 'A visual representation of events or milestones in chronological order.'
            },
            {
                id: 'ItemTable',
                title: 'Item Table',
                icon: 'TableCellsIcon',
                description: 'Displays tabular data with headers and rows.'
            }
        ]
    },
    Media: {
        icon: 'PhotoIcon',
        title: 'Media',
        items: [
            {
                id: 'HeroImageBanner',
                title: 'Hero Image Banner',
                icon: 'PhotoIcon',
                description: 'A large header image section with optional overlay text.'
            },
            {
                id: 'ImageGallery',
                title: 'Image Gallery',
                icon: 'Squares2X2Icon',
                description: 'A responsive grid of images with optional lightbox.'
            },
            {
                id: 'VideoEmbed',
                title: 'Video Embed',
                icon: 'PlayCircleIcon',
                description: 'Embeds videos from YouTube, Vimeo, or custom sources.'
            }
        ]
    }
}

function iconComponent(iconName) {
    return iconRegistry[iconName] || DocumentTextIcon
}

const openGroups = ref(Object.keys(allGroups).reduce((acc, group, i) => {
    acc[group] = i === 0
    return acc
}, {}))

const sidebarCollapsed = ref(false)
const showQuickAdd = ref(false)
const activeGroup = ref(null)

function toggleSidebar(event) {
    sidebarCollapsed.value = !sidebarCollapsed.value
    showQuickAdd.value = false

    if (event?.currentTarget instanceof HTMLElement) {
        event.currentTarget.blur()
    }
}

function toggleGroup(group) {
    openGroups.value[group] = !openGroups.value[group]
}

const search = ref('')

function filteredItems(group) {
  return allGroups[group].items.filter((item) =>
    item.title.toLowerCase().includes(search.value.toLowerCase())
  )
}

const emit = defineEmits(['new-block'])
function addNewBlock(type) {
    emit('new-block', type)
}
</script>


<style scoped>
.accordion-enter-active,
.accordion-leave-active {
    transition: max-height 0.3s ease;
}

.accordion-enter-from,
.accordion-leave-to {
    max-height: 0;
}

.accordion-enter-to,
.accordion-leave-from {
    max-height: 500px;
}
</style>