<!-- pages/QueuesBrowse.vue -->
<template>
    <div class="min-h-screen bg-background text-foreground">
        <!-- Theme Switcher -->
        <ThemeSwitcher />
        <!-- Hero Header -->
        <div
            class="bg-gradient-to-r from-velaris-purple/20 via-velaris-teal/20 to-velaris-purple/20 border-b border-border -mt-[6.5rem]">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
                <div class="text-center">
                    <h1
                        class="text-4xl font-bold mb-4 bg-gradient-to-r from-velaris-purple to-velaris-teal bg-clip-text text-transparent">
                        TopHeroes Queue Browser
                    </h1>
                    <p class="text-lg text-foreground/70 max-w-2xl mx-auto">
                        Find the perfect team composition for your heroes. Browse community-created queues, filter by
                        your available heroes, and discover winning strategies.
                    </p>
                </div>
            </div>
        </div>

        <div class="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Error State -->
            <div v-if="error" class="mb-8 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div class="flex items-start gap-3">
                    <div class="text-red-400">⚠️</div>
                    <div>
                        <h3 class="font-semibold text-red-400 mb-1">Error Loading Queues</h3>
                        <p class="text-sm text-red-400/80">{{ error }}</p>
                        <button @click="retryLoad" class="mt-2 text-sm text-red-400 hover:text-red-300 underline">
                            Try Again
                        </button>
                    </div>
                </div>
            </div>

            <!-- Top Bar with Stats and Submit Button -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <!-- Stats -->
                <div class="flex items-center gap-6">
                    <div>
                        <div class="text-2xl font-bold text-velaris-purple">{{ totalQueues }}</div>
                        <div class="text-sm text-foreground/60">Total Queues</div>
                    </div>
                    <div class="h-12 w-px bg-border"></div>
                    <div>
                        <div class="text-2xl font-bold text-velaris-teal">{{ totalViews.toLocaleString() }}</div>
                        <div class="text-sm text-foreground/60">Total Views</div>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="flex flex-col items-start sm:items-end gap-1">
                    <button @click="router.push('/topheroes/queues/user')"
                        class="bg-gradient-to-r from-velaris-purple to-velaris-teal text-white font-medium py-3 px-6 rounded-xl shadow-lg">
                        Submit Your Own
                    </button>
                    <p class="text-xs text-foreground/60">Login to submit your own queues</p>
                </div>
            </div>

            <!-- Main Content with Sidebar Layout -->
            <div class="xl:grid xl:grid-cols-12 xl:gap-8">
                <!-- Main Content Area -->
                <div class="xl:col-span-9">
                    <!-- Search and Sort -->
                    <div class="bg-card border border-border rounded-xl p-6 mb-6">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <!-- Search Bar -->
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium mb-2">Search Queues</label>
                                <div class="relative">
                                    <Search
                                        class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                                    <input v-model="searchQuery" type="search"
                                        placeholder="Search by queue name or description..."
                                        class="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all" />
                                </div>
                            </div>

                            <!-- Sort -->
                            <div>
                                <label class="block text-sm font-medium mb-2">Sort By</label>
                                <select v-model="sortBy"
                                    class="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all">
                                    <option value="popular">Most Popular</option>
                                    <option value="recent">Most Recent</option>
                                    <option value="votes">Highest Rated</option>
                                    <option value="comments">Most Discussed</option>
                                </select>
                            </div>

                            <!-- Mobile Filter Toggle -->
                            <div class="xl:hidden md:col-span-3">
                                <button @click="showMobileFilters = !showMobileFilters"
                                    class="w-full px-4 py-2 bg-velaris-purple/10 border border-velaris-purple/30 rounded-lg text-velaris-purple font-medium flex items-center justify-between">
                                    <span>Hero Filters {{ selectedHeroes.length > 0 ? `(${selectedHeroes.length})` : ''
                                        }}</span>
                                    <ChevronDown
                                        :class="['h-5 w-5 transition-transform', showMobileFilters ? 'rotate-180' : '']" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Mobile Filters Collapse -->
                    <div v-if="showMobileFilters" class="xl:hidden mb-6 bg-card border border-border rounded-xl p-6">
                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-2">Match Type</label>
                            <select v-model="matchType"
                                class="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all">
                                <option value="any">Any Match</option>
                                <option value="exact">Exact Match Only</option>
                                <option value="partial">Partial Match (3+ heroes)</option>
                            </select>
                        </div>
                        <HeroFilter :heroes="availableHeroes" :selected-heroes="selectedHeroes"
                            @update:selected-heroes="selectedHeroes = $event" />
                    </div>

                    <!-- Results -->
                    <div v-if="isLoading" class="text-center py-16">
                        <div class="inline-flex items-center gap-3 text-foreground/60">
                            <div
                                class="animate-spin h-8 w-8 border-2 border-velaris-purple border-t-transparent rounded-full">
                            </div>
                            <span>Loading queues...</span>
                        </div>
                    </div>

                    <!-- No Results -->
                    <div v-else-if="filteredQueues.length === 0" class="text-center py-16">
                        <div
                            class="h-24 w-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">
                            <Search class="h-12 w-12 text-foreground/30" />
                        </div>
                        <h3 class="text-xl font-semibold mb-2">No Queues Found</h3>
                        <p class="text-foreground/60 mb-6">
                            {{ selectedHeroes.length > 0
                                ? 'No queues match your selected heroes. Try selecting fewer heroes or changing the match type.'
                            : 'Try adjusting your filters or search terms.'
                            }}
                        </p>
                        <button v-if="selectedHeroes.length > 0 || searchQuery" @click="clearFilters"
                            class="bg-gradient-to-r from-velaris-purple to-velaris-teal text-white font-medium py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                            Clear Filters
                        </button>
                    </div>

                    <!-- Queue Grid -->
                    <div v-else>
                        <div class="mb-4 text-sm text-foreground/60">
                            Showing {{ filteredQueues.length }} of {{ totalQueues }} queues
                        </div>
                        <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            <PublicQueueCard v-for="queue in paginatedQueues" :key="queue.id" :queue="queue"
                                :heroes="availableHeroes" :user-votes="userVotes" @vote="handleVote"
                                @view="viewQueue" />
                        </div>

                        <!-- Pagination -->
                        <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-2">
                            <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
                                class="px-4 py-2 bg-card border border-border rounded-lg hover:bg-foreground/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                Previous
                            </button>

                            <div class="flex gap-2">
                                <button v-for="page in visiblePages" :key="page" @click="currentPage = page" :class="page === currentPage
                                    ? 'bg-gradient-to-r from-velaris-purple to-velaris-teal text-white'
                                    : 'bg-card border border-border hover:bg-foreground/5'"
                                    class="px-4 py-2 rounded-lg transition-all">
                                    {{ page }}
                                </button>
                            </div>

                            <button @click="currentPage = Math.min(totalPages, currentPage + 1)"
                                :disabled="currentPage === totalPages"
                                class="px-4 py-2 bg-card border border-border rounded-lg hover:bg-foreground/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Sidebar - Hero Filters (Desktop Only) -->
                <div class="hidden xl:block xl:col-span-3">
                    <div class="sticky top-8">
                        <div class="bg-card border border-border rounded-xl p-6">
                            <h3 class="text-lg font-semibold mb-4 flex items-center justify-between">
                                <span>Hero Filters</span>
                                <button v-if="selectedHeroes.length > 0" @click="clearSelectedHeroes"
                                    class="text-xs text-velaris-purple hover:text-velaris-teal transition-colors">
                                    Clear ({{ selectedHeroes.length }})
                                </button>
                            </h3>

                            <!-- Match Type -->
                            <div class="mb-4">
                                <label class="block text-sm font-medium mb-2">Match Type</label>
                                <select v-model="matchType"
                                    class="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all text-sm">
                                    <option value="any">Any Match</option>
                                    <option value="exact">Exact Match</option>
                                    <option value="partial">Partial (3+)</option>
                                </select>
                            </div>

                            <HeroFilter :heroes="availableHeroes" :selected-heroes="selectedHeroes"
                                @update:selected-heroes="selectedHeroes = $event" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronDown } from 'lucide-vue-next'
import HeroFilter from '@/components/topheroes/public/HeroFilter.vue'
import PublicQueueCard from '@/components/topheroes/public/PublicQueueCard.vue'
import { useTopHeroesPublicStore } from '@/stores/useTopHeroesPublicStore'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher.vue'

const router = useRouter()
const publicStore = useTopHeroesPublicStore()

// State
const searchQuery = ref('')
const selectedHeroes = ref([])
const sortBy = ref('popular')
const matchType = ref('any')
const currentPage = ref(1)
const itemsPerPage = 12
const isLoading = ref(true)
const error = ref(null)
const userVotes = ref({})
const showMobileFilters = ref(false)

// Computed
const availableHeroes = computed(() => publicStore.heroes)
const totalQueues = computed(() => publicStore.queues.length)

const totalViews = computed(() => {
    return publicStore.queues.reduce((sum, queue) => sum + (queue.views || 0), 0)
})

const filteredQueues = computed(() => {
    let filtered = publicStore.queues.filter(q => q.isVisible)

    // Text search
    if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase()
        filtered = filtered.filter(queue =>
            queue.name?.toLowerCase().includes(search) ||
            queue.description?.toLowerCase().includes(search)
        )
    }

    // Hero filter
    if (selectedHeroes.value.length > 0) {
        filtered = filtered.filter(queue => {
            const queueHeroIds = queue.heroes?.map(h => h.heroId) || []

            if (matchType.value === 'exact') {
                // Must have exactly these heroes (all 6 match)
                return selectedHeroes.value.length === queueHeroIds.length &&
                    selectedHeroes.value.every(heroId => queueHeroIds.includes(heroId))
            } else if (matchType.value === 'partial') {
                // Must have at least 3 matching heroes
                const matchCount = selectedHeroes.value.filter(heroId => queueHeroIds.includes(heroId)).length
                return matchCount >= 3
            } else {
                // Any match - at least 1 hero
                return selectedHeroes.value.some(heroId => queueHeroIds.includes(heroId))
            }
        })
    }

    // Sort - create a new array copy before sorting to ensure reactivity
    return [...filtered].sort((a, b) => {
        switch (sortBy.value) {
            case 'popular':
                return (b.views || 0) - (a.views || 0)
            case 'votes':
                const netA = (a.upvotes || 0) - (a.downvotes || 0)
                const netB = (b.upvotes || 0) - (b.downvotes || 0)
                return netB - netA
            case 'comments':
                return (b.commentCount || 0) - (a.commentCount || 0)
            case 'recent':
            default:
                const dateA = a.lastUpdated?.seconds ? a.lastUpdated.seconds * 1000 : new Date(a.lastUpdated || a.createdAt || 0).getTime()
                const dateB = b.lastUpdated?.seconds ? b.lastUpdated.seconds * 1000 : new Date(b.lastUpdated || b.createdAt || 0).getTime()
                return dateB - dateA
        }
    })
})

const totalPages = computed(() => Math.ceil(filteredQueues.value.length / itemsPerPage))

const paginatedQueues = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredQueues.value.slice(start, start + itemsPerPage)
})

const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})

// Methods
const clearSelectedHeroes = () => {
    selectedHeroes.value = []
}

const clearFilters = () => {
    searchQuery.value = ''
    selectedHeroes.value = []
    sortBy.value = 'popular'
    matchType.value = 'any'
}

const handleVote = ({ queueId, voteType }) => {
    const currentVote = userVotes.value[queueId]

    if (currentVote === voteType) {
        delete userVotes.value[queueId]
    } else {
        userVotes.value[queueId] = voteType
    }

    // Save to localStorage
    localStorage.setItem('topheroes_votes', JSON.stringify(userVotes.value))

    // Send to backend
    publicStore.voteQueue(queueId, voteType, currentVote)
}

const viewQueue = (queue) => {
    // Track view
    publicStore.incrementViews(queue.id)

    // Navigate to detail page
    router.push(`/topheroes/queues/${queue.id}`)
}

const loadData = async () => {
    isLoading.value = true
    error.value = null

    try {
        await publicStore.loadAll()

        // Load user votes from localStorage
        const savedVotes = localStorage.getItem('topheroes_votes')
        if (savedVotes) {
            try {
                userVotes.value = JSON.parse(savedVotes)
            } catch (e) {
                console.error('Failed to parse saved votes:', e)
                localStorage.removeItem('topheroes_votes')
            }
        }
    } catch (err) {
        console.error('Failed to load queues:', err)
        error.value = err.message || 'Failed to load queues. Please try again.'
    } finally {
        isLoading.value = false
    }
}

const retryLoad = () => {
    loadData()
}

// Lifecycle
onMounted(() => {
    loadData()
})

// Reset to page 1 when filters change
watch([searchQuery, selectedHeroes, sortBy, matchType], () => {
    currentPage.value = 1
})
</script>