<template>
    <LayoutComponent :header="true" :footer="true">
        <HeroComponent :heading="'Everhomes Internal Tools'"
            :byline="'Purpose-built calculators to save you time and frustration — no logins, no PowerApps, just results.'"
            :icon="WrenchScrewdriverIcon" :cta="{ text: 'Browse Tools', link: '#tools' }" />

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <ToolSearchComponent v-model="searchQuery" />
                <ToolTagSelector :tags="allTags" v-model="selectedTags" :tooltipMap="tagTooltips" :maxSelectable="3"
                    :clearAll="true" :tag-color-map="tagsColourMap" />
            </div>

            <CardContainerComponent :cols="{ base: 1, sm: 2, lg: 3 }" id="tools">
                <TransitionGroup name="card" tag="div" class="contents" appear
                    enter-active-class="transition duration-300 ease-out"
                    leave-active-class="transition duration-200 ease-in" enter-from-class="opacity-0 translate-y-3"
                    enter-to-class="opacity-100 translate-y-0" leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-1">
                    <CardComponent v-for="card in filteredCards" :key="card.id" v-bind="card" />
                </TransitionGroup>
            </CardContainerComponent>
        </section>
    </LayoutComponent>
</template>

<script setup>
import { ref, computed } from 'vue'
import LayoutComponent from '@/components/everhomes/layouts/LayoutComponent.vue'
import HeroComponent from '@/components/everhomes/ui/HeroComponent.vue'
import ToolSearchComponent from '@/components/everhomes/ui/ToolSearchComponent.vue'
import ToolTagSelector from '@/components/everhomes/ui/ToolTagSelector.vue'
import CardComponent from '@/components/everhomes/ui/CardComponent.vue'
import CardContainerComponent from '@/components/everhomes/ui/CardContainerComponent.vue'

import {
    WrenchScrewdriverIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
    BuildingOffice2Icon,
    CloudArrowUpIcon
} from '@heroicons/vue/24/solid'

const searchQuery = ref('')
const selectedTags = ref([])

const allTags = ['Finance', 'SDA', 'Placement', 'Returns']
const tagsColourMap = {
    Finance: 'teal',
    SDA: 'sky',
    Placement: 'emerald',
    Returns: 'rose'
}

const tagTooltips = {
    Finance: 'Tools related to billing, fees, and cost breakdowns',
    SDA: 'Specialist Disability Accommodation tools',
    Placement: 'Fee calculators for participant placements',
    Returns: 'Tools to calculate SDA returns and income'
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
        badges: [{ label: 'In Progress!', type: 'soon' }],
        tags: ['Finance', 'SDA', 'Returns'],
        disabled: false
    },
    {
        id: 'import',
        title: 'Import Data',
        byline: 'Upload and import data to the system',
        link: '/everhomes/import',
        icon: CloudArrowUpIcon,
        colorHex: '#ffbf00',
        badges: [{ label: 'In Progress!', type: 'soon' }],
        tags: ['Finance'],
        disabled: false
    }
]

const filteredCards = computed(() => {
    return tools.filter(card => {
        const matchesSearch =
            searchQuery.value === '' ||
            card.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            card.byline.toLowerCase().includes(searchQuery.value.toLowerCase())

        const matchesTags =
            selectedTags.value.length === 0 ||
            selectedTags.value.every(tag => card.tags?.includes(tag))

        return matchesSearch && matchesTags
    })
})
</script>