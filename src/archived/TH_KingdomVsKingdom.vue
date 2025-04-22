<template>
    <div
        class="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans space-y-16 p-4 sm:p-6">
        <!-- Header -->
        <header class="text-center animate-fade-in space-y-2">
            <h1
                class="text-5xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                <template v-if="!isLoading">{{ eventMeta.title }}</template>
                <template v-else>
                    <Skeleton class="h-12 w-64 mx-auto" />
                </template>
            </h1>
            <p class="text-lg text-white/90">
                <template v-if="!isLoading">{{ eventMeta.byline }}</template>
                <template v-else>
                    <Skeleton class="h-6 w-96 mx-auto" />
                </template>
            </p>
            <p class="text-white/70 text-sm">
                <template v-if="!isLoading">
                    Reset Time: <strong class="text-indigo-300">{{ eventMeta.resetTime }}</strong> (<span>{{
                        userLocalTime }}</span> for you)
                </template>
                <template v-else>
                    <Skeleton class="h-4 w-48 mx-auto" />
                </template>
            </p>
        </header>

        <template v-if="!isLoading && processedSections.length > 0">
            <div v-for="section in processedSections" :key="section.id">
                <template v-if="section.component === 'TimelineSection'">
                    <Timeline :heading="section.props.title" :heading-color="section.props.color"
                        :timeline="section.props.timeline" />
                </template>

                <template v-else-if="section.type === 'content'">
                    <section
                        class="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg p-6 sm:p-8 space-y-6 animate-fade-in">
                        <div class="flex items-center gap-3">
                            <component v-if="section?.props?.icon" :is="resolveIcon(section.props.icon)"
                                class="w-6 h-6 text-indigo-400" />
                            <h2 v-if="section?.props?.title" class="text-2xl font-bold">{{ section.props.title }}</h2>
                        </div>

                        <!-- Cards -->
                        <div v-if="section?.props?.cards" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div v-for="(card, idx) in section.props.cards" :key="idx"
                                class="bg-white/10 border border-white/10 p-4 rounded-xl shadow-sm">
                                <h3 class="font-semibold text-lg text-white/90 mb-1">{{ card.title }}</h3>
                                <div class="text-white/80 text-sm whitespace-pre-line">{{ card.content }}</div>
                            </div>
                        </div>

                        <!-- Tabs -->
                        <div v-if="section?.props?.tabs">
                            <div class="flex flex-wrap gap-2 pb-2">
                                <button v-for="tab in section.props.tabs" :key="tab.short"
                                    @click="activeTab = tab.short"
                                    :class="['px-4 py-2 rounded-md text-sm font-semibold transition-all', activeTab === tab.short ? 'bg-indigo-600 text-white' : 'bg-white/10 hover:bg-white/20']">
                                    {{ tab.title }}
                                </button>
                            </div>

                            <div class="mt-6 animate-slide-fade" v-for="tab in section.props.tabs" :key="tab.short"
                                v-show="activeTab === tab.short">
                                <div class="bg-white/5 p-6 border border-white/10 rounded-xl">
                                    <h3 class="text-2xl font-semibold mb-2">{{ tab.title }}</h3>
                                    <p class="text-white/80">{{ tab.description }}</p>
                                    <ul v-if="tab.tips" class="list-disc pl-6 mt-4 text-white/70">
                                        <li v-for="(tip, i) in tab.tips" :key="i">{{ tip }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                </template>
            </div>
        </template>

        <template v-else>
            <!-- Skeleton Placeholder -->
            <section v-for="i in 3" :key="`skeleton-${i}`"
                class="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg p-6 sm:p-8 space-y-6 animate-fade-in">
                <div class="flex items-center gap-3">
                    <Skeleton class="w-6 h-6 rounded-full" />
                    <Skeleton class="h-8 w-48" />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div v-for="j in 3" :key="`card-skeleton-${j}`"
                        class="bg-white/10 border border-white/10 p-4 rounded-xl shadow-sm">
                        <Skeleton class="h-6 w-32 mb-2" />
                        <Skeleton class="h-4 w-full mb-1" />
                        <Skeleton class="h-4 w-3/4 mb-1" />
                        <Skeleton class="h-4 w-5/6" />
                    </div>
                </div>
            </section>
        </template>

        <footer class="text-center text-white/40 text-sm">
            Built with ☕️ by [VLR]Mason in s10154
        </footer>

        <!-- Sync Button -->
        <button @click="refreshData"
            class="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 flex items-center justify-center group"
            :class="{ 'animate-spin': isRefreshing }" :disabled="isRefreshing">
            <span v-if="isRefreshing" class="sr-only">Refreshing...</span>
            <span v-else class="sr-only">Refresh data</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span
                class="absolute bottom-full mb-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Refresh event data
            </span>
        </button>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import Timeline from '@/components/ui/Timeline.vue'
import { BookOpenIcon, ClipboardIcon, LightBulbIcon } from '@heroicons/vue/24/outline'
import { Skeleton } from '@/components/ui/skeleton'

const store = useStore()
const activeTab = ref('D1')
const isRefreshing = ref(false)

// Calculate user's local time based on UTC+2
const userLocalTime = computed(() => {
    const now = new Date()
    const utc2 = new Date(now.toLocaleString('en-US', { timeZone: 'Etc/GMT-2' }))
    return utc2.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

// Map component names to icons
const iconMap = {
    BookOpenIcon,
    ClipboardIcon,
    LightBulbIcon
}

// Helper function to resolve icon names to components
const resolveIcon = (iconName) => {
    return iconMap[iconName] || BookOpenIcon // Default to BookOpenIcon if not found
}

// Access store state via computed properties
const eventSections = computed(() => store.getters['topheroes/eventSections'])
const eventMeta = computed(() => store.getters['topheroes/eventMeta'])
const isLoading = computed(() => store.state.topheroes.isLoading)
const error = computed(() => store.state.topheroes.error)

// Process sections to ensure they have the correct structure
const processedSections = computed(() => {
  return eventSections.value.map(section => {
    if (section.type === 'content') {
      return {
        ...section,
        props: {
          title: section.title,
          icon: section.icon,
          cards: section.cards,
          tabs: section.tabs,
        }
      }
    }
    return section
  })
})

// Check if cached data is too old (> 5 minutes)
const isCacheStale = () => {
    const cachedTimestamp = localStorage.getItem('kvk_data_timestamp')
    if (!cachedTimestamp) return true

    const now = Date.now()
    const fiveMinutesInMs = 5 * 60 * 1000
    return (now - parseInt(cachedTimestamp)) > fiveMinutesInMs
}

// Function to refresh data manually
const refreshData = async () => {
    if (isRefreshing.value) return

    isRefreshing.value = true

    try {
        // Clear the cache and force a refresh
        await store.dispatch('topheroes/clearCachedKvK')
        await store.dispatch('topheroes/loadKvKData', true)

        // Update timestamp in localStorage
        localStorage.setItem('kvk_data_timestamp', Date.now().toString())
    } catch (err) {
        console.error('Failed to refresh KvK data:', err)
    } finally {
        isRefreshing.value = false
    }
}

// Load data from store or fetch from Firestore
onMounted(async () => {
    // Check if we need a fresh fetch
    const forceRefresh = isCacheStale()

    try {
        await store.dispatch('topheroes/loadKvKData', forceRefresh)

        // Update timestamp in localStorage
        if (forceRefresh) {
            localStorage.setItem('kvk_data_timestamp', Date.now().toString())
        }
    } catch (err) {
        console.error('Failed to load KvK data:', err)
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