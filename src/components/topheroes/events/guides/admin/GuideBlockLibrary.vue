<template>
    <div class="flex flex-col h-full overflow-hidden">
        <!-- Search -->
        <div class="px-4 py-3">
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
                </div>
                <input v-model="search" type="text" placeholder="Search components..." class="w-full pl-10 pr-3 py-2 rounded-lg bg-zinc-700 text-sm placeholder:text-gray-400
                   focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" />
            </div>
        </div>

        <!-- Component Groups -->
        <div class="overflow-y-auto pb-6 px-4 flex-1 space-y-2">
            <div v-for="(items, group) in allGroups" :key="group" class="bg-zinc-800/50 rounded-lg shadow-md">
                <!-- Group Header -->
                <button @mousedown.prevent @click="toggleGroup(group)" class="w-full flex justify-between items-center px-4 py-3 text-sm font-medium text-white
                   hover:bg-purple-900/20 transition-colors focus:outline-none focus:ring-2
                   focus:ring-inset focus:ring-purple-500" :class="{ 'bg-purple-900/10': openGroups[group] }">
                    <div class="flex items-center gap-2">
                        <component :is="groupIcons[group]" class="h-4 w-4 text-purple-400" />
                        <span class="text-purple-300">{{ group }}</span>
                    </div>
                    <ChevronDownIcon class="h-4 w-4 text-gray-400 transform transition-transform duration-300"
                        :class="{ 'rotate-180': openGroups[group] }" />
                </button>

                <!-- Filtered Items with Transition -->
                <Transition name="accordion" mode="out-in">
                    <div v-show="openGroups[group]" class="overflow-hidden">
                        <div class="border-t border-zinc-700/50">
                            <div v-if="filteredItems(group).length"
                                class="p-2 space-y-1 bg-gradient-to-b from-zinc-800/0 to-zinc-800/60">
                                <button v-for="type in filteredItems(group)" :key="type" @click="addNewBlock(type)"
                                    class="w-full text-left text-sm px-3 py-2 bg-zinc-800/80 text-white rounded-md
                           hover:bg-zinc-700 hover:text-purple-300 focus:outline-none
                           focus:ring-2 focus:ring-purple-500 transition-all duration-150
                           group flex items-center justify-between">
                                    <span>{{ type }}</span>
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

            <!-- Empty State -->
            <div v-if="!hasAnyFiltered" class="text-center py-12 text-gray-400 text-sm">
                <div class="text-3xl mb-2">🔍</div>
                No components match your search
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
    RectangleStackIcon,
    DocumentTextIcon,
    ChartBarIcon,
    PhotoIcon,
} from '@heroicons/vue/24/solid'

import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['new-block'])
const search = ref('')
const openGroups = ref({})

const allGroups = {
    Layout: ['TitleSection', 'Divider', 'Spacer'],
    Content: ['TipList', 'CalloutBox', 'WarningBox', 'QuoteHighlight'],
    Data: ['TimelineSection', 'ItemTable'],
    Media: ['HeroImageBanner', 'ImageGallery', 'VideoEmbed'],
}

const groupIcons = {
    Layout: RectangleStackIcon,
    Content: DocumentTextIcon,
    Data: ChartBarIcon,
    Media: PhotoIcon,
}

onMounted(() => {
    const [firstGroup] = Object.keys(allGroups)
    for (const group in allGroups) {
        openGroups.value[group] = group === firstGroup
    }
})

function filteredItems(group) {
    const q = search.value.toLowerCase()
    return allGroups[group].filter(type => type.toLowerCase().includes(q))
}

const hasAnyFiltered = computed(() =>
    Object.keys(allGroups).some(group => filteredItems(group).length)
)

function toggleGroup(group) {
    openGroups.value[group] = !openGroups.value[group]
}

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