<template>
    <div class="pt-24 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]">
        <div class="text-white font-sans space-y-16 p-4 sm:p-6">
            <!-- Header -->
            <GuideHeader :title="eventMeta.title" :byline="eventMeta.byline" :resetTime="timeForYou"
                :userLocalTime="timeUntil" :isLoading="isLoading" />

            <template v-if="!isLoading && processedSections.length > 0">
                <div v-for="section in processedSections" :key="section.id">
                    <template v-if="section.component === 'TimelineSection'">
                        <Timeline :heading="section.props.title" :heading-color="section.props.color"
                            :timeline="section.props.timeline" />
                    </template>

                    <template v-else-if="section.type === 'content'">
                        <ContentSection :title="section.props.title" :icon="section.props.icon"
                            :cards="section.props.cards" :tabs="section.props.tabs" />
                    </template>
                </div>
            </template>

            <template v-else>
                <LoadingSkeleton v-for="i in 3" :key="`skeleton-${i}`" />
            </template>

            <RefreshButton @click="refreshData" :is-refreshing="isRefreshing" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTopHeroesStore } from '@/stores/useTopHeroesStore'
import Timeline from '@/components/ui/Timeline.vue'
import GuideHeader from '@/components/topHeroes/guide/GuideHeader.vue'
import ContentSection from '@/components/topHeroes/guide/ContentSection.vue'
import LoadingSkeleton from '@/components/topHeroes/guide/LoadingSkeleton.vue'
import RefreshButton from '@/components/topHeroes/guide/RefreshButton.vue'

const topheroesStore = useTopHeroesStore()
const eventId = 'kvk'
const isRefreshing = ref(false)

import { useTimeOffset } from '@/utils/useTimeOffset'

const { timeForYou, timeUntil } = useTimeOffset({
    fixedTime: '02:00',
    fixedTimezone: 'UTC',
    userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    userNow: new Date()
})

const eventSections = computed(() => topheroesStore.eventSections)
const eventMeta = computed(() => topheroesStore.eventMeta)
const isLoading = computed(() => topheroesStore.isLoading)

const processedSections = computed(() => {
    return eventSections.value.map(section => {
        if (section.type === 'content') {
            return {
                ...section,
                props: {
                    title: section.title,
                    icon: section.icon,
                    cards: section.cards,
                    tabs: section.tabs
                }
            }
        }
        return section
    })
})

// Function to refresh data manually
const refreshData = async () => {
    if (isRefreshing.value) return
    isRefreshing.value = true

    try {
        await topheroesStore.clearCachedEvent(eventId)
        await topheroesStore.loadEventData(eventId, true)
    } catch (err) {
        console.error(`Failed to refresh ${eventId} data:`, err)
    } finally {
        isRefreshing.value = false
    }
}

// Load data on mount
onMounted(async () => {
    try {
        // Check if cache is stale
        if (topheroesStore.isCacheStale) {
            await topheroesStore.loadEventData(eventId, true)
        } else {
            await topheroesStore.loadEventData(eventId, false)
        }
    } catch (err) {
        console.error(`Failed to load ${eventId} data:`, err)
    }
})
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.6s ease both;
}

@keyframes slide-fade {
    from {
        opacity: 0;
        transform: translateX(8px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-slide-fade {
    animation: slide-fade 0.4s ease both;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>