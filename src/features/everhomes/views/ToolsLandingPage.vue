<template>
    <LayoutComponent :header="true" :footer="true">
        <!-- Page Title Bar -->
        <div class="pt-20 sm:pt-24 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="flex flex-col gap-1 mb-6">
                <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">Tools</h1>
                <p class="text-slate-400 text-sm sm:text-base">Select a tool to get started.</p>
            </div>

            <!-- Search + Filter Row -->
            <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
                <ToolSearchComponent v-model="searchQuery" class="w-full sm:w-80" />
                <ToolTagSelector
                    :tags="allTags"
                    v-model="selectedTags"
                    :tooltipMap="tagTooltips"
                    :maxSelectable="3"
                    :clearAll="true"
                    :tag-color-map="tagsColourMap"
                    class="flex-1"
                />
            </div>
        </div>

        <!-- Tool Grid -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <TransitionGroup
                name="card"
                tag="div"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
                appear
                enter-active-class="transition duration-300 ease-out"
                leave-active-class="transition duration-200 ease-in absolute"
                enter-from-class="opacity-0 translate-y-3"
                enter-to-class="opacity-100 translate-y-0"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-1"
            >
                <component
                    v-for="tool in filteredTools"
                    :key="tool.id"
                    :is="tool.disabled ? 'div' : RouterLink"
                    :to="tool.disabled ? undefined : tool.link"
                    class="group relative flex flex-col rounded-2xl p-5 sm:p-6 border transition-all duration-300 backdrop-blur-md overflow-hidden cursor-pointer select-none"
                    :class="[
                        tool.disabled
                            ? 'opacity-50 pointer-events-none grayscale'
                            : 'hover:scale-[1.02] hover:shadow-2xl active:scale-[0.99]'
                    ]"
                    :style="cardStyle(tool)"
                >
                    <!-- Ambient glow on hover -->
                    <div
                        class="absolute inset-0 z-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        :style="{ background: glowStyle(tool.colorHex) }"
                    />

                    <!-- Badges -->
                    <div v-if="tool.badges?.length" class="absolute top-3 right-3 z-10 flex flex-wrap gap-1 justify-end">
                        <BadgeComponent v-for="(badge, i) in tool.badges" :key="i" v-bind="badge" />
                    </div>

                    <!-- Icon -->
                    <div
                        class="w-11 h-11 mb-4 flex items-center justify-center rounded-xl border border-white/20 z-10 relative transition-transform duration-300 group-hover:-translate-y-0.5"
                        :style="{ background: iconBg(tool.colorHex) }"
                    >
                        <component :is="tool.icon" class="w-5 h-5 text-white" />
                    </div>

                    <!-- Text -->
                    <div class="z-10 relative flex-1">
                        <h3 class="text-base sm:text-lg font-semibold text-white mb-1 leading-tight">{{ tool.title }}</h3>
                        <p class="text-sm text-white/60 leading-snug">{{ tool.byline }}</p>
                    </div>

                    <!-- Tags row -->
                    <div v-if="tool.tags?.length" class="z-10 relative mt-4 flex flex-wrap gap-1.5">
                        <span
                            v-for="tag in tool.tags"
                            :key="tag"
                            class="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            :style="tagChipStyle(tag)"
                        >
                            {{ tag }}
                        </span>
                    </div>

                    <!-- Arrow indicator -->
                    <div v-if="!tool.disabled" class="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <ArrowRightIcon class="w-4 h-4 text-white/50" />
                    </div>
                </component>
            </TransitionGroup>

            <!-- Empty state -->
            <div v-if="filteredTools.length === 0" class="flex flex-col items-center justify-center py-20 text-center gap-3">
                <MagnifyingGlassIcon class="w-10 h-10 text-slate-600" />
                <p class="text-slate-400 text-sm">No tools match your search.</p>
                <button @click="resetFilters" class="text-teal-400 hover:text-teal-300 text-sm underline-offset-2 underline transition-colors">
                    Clear filters
                </button>
            </div>
        </section>
    </LayoutComponent>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import LayoutComponent from '@/features/everhomes/components/layouts/LayoutComponent.vue'
import ToolSearchComponent from '@/features/everhomes/components/ui/ToolSearchComponent.vue'
import ToolTagSelector from '@/features/everhomes/components/ui/ToolTagSelector.vue'
import BadgeComponent from '@/features/everhomes/components/ui/BadgeComponent.vue'

import {
    CurrencyDollarIcon,
    BanknotesIcon,
    BuildingOffice2Icon,
    CloudArrowUpIcon,
    ClipboardDocumentCheckIcon,
    ArrowRightIcon,
    MagnifyingGlassIcon,
    ClipboardDocumentListIcon
} from '@heroicons/vue/24/solid'

const searchQuery = ref('')
const selectedTags = ref([])

const allTags = ['Finance', 'SDA', 'Placement', 'Returns', 'Inspection']

const tagsColourMap = {
    Finance: 'teal',
    SDA: 'sky',
    Placement: 'emerald',
    Returns: 'rose',
    Inspection: 'violet'
}

const tagTooltips = {
    Finance: 'Tools related to billing, fees, and cost breakdowns',
    SDA: 'Specialist Disability Accommodation tools',
    Placement: 'Fee calculators for participant placements',
    Returns: 'Tools to calculate SDA returns and income',
    Inspection: 'Property inspection and checklist tools'
}

const tagColorHexMap = {
    Finance: '#14b8a6',
    SDA: '#0ea5e9',
    Placement: '#10b981',
    Returns: '#f43f5e',
    Inspection: '#8b5cf6'
}

const tools = [
    {
        id: 'water',
        title: 'Water Bills',
        byline: 'Split SDA water bills by participant and date',
        link: '/everhomes/water-bills',
        icon: CurrencyDollarIcon,
        colorHex: '#0ea5e9',
        badges: [{ label: 'Stable', colorHex: '#0ea5e9', glow: true }],
        tags: ['Finance', 'SDA']
    },
    {
        id: 'placement-fees',
        title: 'Placement Fees',
        byline: 'Calculate participant placement-related costs',
        link: '/everhomes/placement-fees',
        icon: BanknotesIcon,
        colorHex: '#10b981',
        badges: [{ label: 'New!', type: 'new', glow: true }],
        tags: ['Finance', 'Placement']
    },
    {
        id: 'sda-return',
        title: 'SDA Returns',
        byline: 'Estimate SDA property rental returns',
        link: '/everhomes/sda-returns',
        icon: BuildingOffice2Icon,
        colorHex: '#8b5cf6',
        badges: [{ label: 'In Progress', type: 'soon' }],
        tags: ['Finance', 'SDA', 'Returns']
    },
    {
        id: 'import',
        title: 'Import Data',
        byline: 'Upload and import data to the system',
        link: '/everhomes/import',
        icon: CloudArrowUpIcon,
        colorHex: '#f59e0b',
        badges: [{ label: 'In Progress', type: 'soon' }],
        tags: ['Finance']
    },
    {
        id: 'inspection-checklist',
        title: 'Inspection Checklist',
        byline: 'Walk through property rooms and capture photos for each area',
        link: '/everhomes/inspection-checklist',
        icon: ClipboardDocumentCheckIcon,
        colorHex: '#14b8a6',
        badges: [{ label: 'New!', type: 'new', glow: true }],
        tags: ['Inspection', 'SDA']
    },
    {
        id: 'handover-checklist',
        title: 'Handover Checklist',
        byline: 'SDA dwelling suitability review for handovers and annual compliance',
        link: '/everhomes/handover-checklist',
        icon: ClipboardDocumentListIcon,
        colorHex: '#0d9488',
        badges: [{ label: 'New!', type: 'new', glow: true }],
        tags: ['Inspection', 'SDA']
    },
]

const filteredTools = computed(() => {
    return tools.filter(tool => {
        const matchesSearch =
            searchQuery.value === '' ||
            tool.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            tool.byline.toLowerCase().includes(searchQuery.value.toLowerCase())

        const matchesTags =
            selectedTags.value.length === 0 ||
            selectedTags.value.every(tag => tool.tags?.includes(tag))

        return matchesSearch && matchesTags
    })
})

function resetFilters() {
    searchQuery.value = ''
    selectedTags.value = []
}

function cardStyle(tool) {
    const hex = tool.colorHex
    return {
        backgroundColor: hexToRgba(hex, 0.07),
        borderColor: hexToRgba(hex, 0.35)
    }
}

function glowStyle(hex) {
    return `radial-gradient(ellipse at center, ${hexToRgba(hex, 0.18)} 0%, transparent 70%)`
}

function iconBg(hex) {
    return hexToRgba(hex, 0.2)
}

function tagChipStyle(tag) {
    const hex = tagColorHexMap[tag] || '#64748b'
    return {
        backgroundColor: hexToRgba(hex, 0.15),
        color: hex,
        border: `1px solid ${hexToRgba(hex, 0.35)}`
    }
}

function hexToRgba(hex, alpha = 1) {
    const [r, g, b] = hexToRgb(hex)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function hexToRgb(hex) {
    const stripped = hex.replace('#', '')
    const bigint = parseInt(stripped, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return [r, g, b]
}
</script>
