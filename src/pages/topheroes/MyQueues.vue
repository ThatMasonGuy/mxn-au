<!-- pages/MyQueues.vue -->
<template>
    <div class="min-h-screen bg-background text-foreground">
        <!-- Theme Switcher -->
        <ThemeSwitcher />

        <!-- Hero Header -->
        <div
            class="bg-gradient-to-r from-velaris-purple/20 via-velaris-teal/20 to-velaris-purple/20 border-b border-border -mt-[6.5rem]">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-16 sm:pt-20">
                <div class="text-center">
                    <h1
                        class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-velaris-purple to-velaris-teal bg-clip-text text-transparent">
                        My TopHeroes Manager
                    </h1>
                    <p class="text-sm sm:text-base lg:text-lg text-foreground/70 max-w-2xl mx-auto px-4">
                        Browse heroes, create team compositions, and manage your strategic queues.
                        <span v-if="store.heroesCount > 0" class="block mt-2 text-xs sm:text-sm">
                            {{ store.heroesCount }} heroes • {{ store.userQueues.length }} queue{{
                                store.userQueues.length !== 1 ? 's' : '' }}
                        </span>
                    </p>
                </div>
            </div>
        </div>

        <div class="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <!-- Navigation Tabs -->
            <div class="mb-4 sm:mb-8">
                <div class="flex gap-2 sm:gap-3 flex-wrap">
                    <button @click="activeView = 'heroes'"
                        :class="['text-xs sm:text-sm px-3 py-2', activeView === 'heroes' ? 'btn-solid-purple' : 'btn-soft-violet']">
                        <Library class="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                        <span class="hidden sm:inline">Browse Heroes</span>
                        <span class="sm:hidden">Heroes</span>
                    </button>
                    <button @click="activeView = 'my-queues'"
                        :class="['relative text-xs sm:text-sm px-3 py-2', activeView === 'my-queues' ? 'btn-solid-purple' : 'btn-soft-violet']">
                        <List class="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                        <span class="hidden sm:inline">My Queues</span>
                        <span class="sm:hidden">Queues</span>
                        <span v-if="store.userQueues.length > 0"
                            class="absolute -top-1 -right-1 bg-velaris-purple text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold">
                            {{ store.userQueues.length }}
                        </span>
                    </button>
                    <button @click="router.push('/topheroes/queues')"
                        class="btn-soft-violet text-xs sm:text-sm px-3 py-2">
                        <Users class="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                        <span class="hidden sm:inline">Community</span>
                        <span class="sm:hidden">Browse</span>
                    </button>
                    <div class="ml-auto">
                        <button @click="refreshData" :disabled="isLoadingData" class="btn-soft-violet rounded-md p-2"
                            title="Refresh data">
                            <RotateCcw :class="['h-3.5 w-3.5 sm:h-4 sm:w-4', isLoadingData ? 'animate-spin' : '']" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Loading Overlay -->
            <div v-if="isLoadingData" class="flex items-center justify-center min-h-[400px]">
                <div class="text-center">
                    <div
                        class="animate-spin h-10 w-10 sm:h-12 sm:w-12 border-4 border-velaris-purple border-t-transparent rounded-full mx-auto mb-4">
                    </div>
                    <p class="text-sm sm:text-base text-foreground/60">Loading heroes data...</p>
                </div>
            </div>

            <!-- Error Banner -->
            <div v-if="store.error && !isLoadingData" class="mb-4 sm:mb-6">
                <div class="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl">
                    <div class="flex items-center gap-2 sm:gap-3">
                        <X class="h-4 w-4 sm:h-5 sm:w-5 text-red-400 flex-shrink-0" />
                        <div class="flex-1 min-w-0">
                            <h3 class="font-semibold text-red-400 mb-1 text-sm sm:text-base">Error Loading Data</h3>
                            <p class="text-xs sm:text-sm text-foreground/70">{{ store.error }}</p>
                        </div>
                        <button @click="refreshData"
                            class="btn-soft-violet flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
                            <RotateCcw class="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                            <span class="hidden sm:inline">Retry</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Heroes View -->
            <div v-if="activeView === 'heroes' && store.heroesCount > 0" class="space-y-4 sm:space-y-8">
                <!-- Stats Dashboard - Mobile: 2x2 Grid, Desktop: 1x4 Grid -->
                <div class="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4">
                    <div class="stat-card stat-card-nature">
                        <div class="relative p-3 sm:p-4 lg:p-6">
                            <div class="flex items-center gap-2 sm:gap-3 lg:gap-4">
                                <div
                                    class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-nature-green to-emerald-600 flex items-center justify-center shadow-lg">
                                    <Leaf class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div>
                                    <p class="text-xl sm:text-2xl font-bold text-nature-green">{{
                                        getFactionCount('nature') }}</p>
                                    <p class="text-xs sm:text-sm font-medium text-nature-green/80">Nature</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="stat-card stat-card-horde">
                        <div class="relative p-3 sm:p-4 lg:p-6">
                            <div class="flex items-center gap-2 sm:gap-3 lg:gap-4">
                                <div
                                    class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-horde-red to-red-600 flex items-center justify-center shadow-lg">
                                    <Flame class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div>
                                    <p class="text-xl sm:text-2xl font-bold text-horde-red">{{ getFactionCount('horde')
                                        }}</p>
                                    <p class="text-xs sm:text-sm font-medium text-horde-red/80">Horde</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="stat-card stat-card-league">
                        <div class="relative p-3 sm:p-4 lg:p-6">
                            <div class="flex items-center gap-2 sm:gap-3 lg:gap-4">
                                <div
                                    class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-league-blue to-blue-600 flex items-center justify-center shadow-lg">
                                    <Shield class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div>
                                    <p class="text-xl sm:text-2xl font-bold text-league-blue">{{
                                        getFactionCount('league') }}</p>
                                    <p class="text-xs sm:text-sm font-medium text-league-blue/80">League</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="stat-card stat-card-total">
                        <div class="relative p-3 sm:p-4 lg:p-6">
                            <div class="flex items-center gap-2 sm:gap-3 lg:gap-4">
                                <div
                                    class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-velaris-amber to-yellow-600 flex items-center justify-center shadow-lg">
                                    <Star class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div>
                                    <p class="text-xl sm:text-2xl font-bold text-velaris-amber">{{ store.heroesCount }}
                                    </p>
                                    <p class="text-xs sm:text-sm font-medium text-velaris-amber/80">Total</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Search and Filters - Mobile: Stack, Desktop: Row -->
                <div class="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
                    <div class="flex flex-col gap-3 sm:gap-4">
                        <div class="flex-1">
                            <div class="relative">
                                <Search
                                    class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-foreground/50" />
                                <input v-model="searchQuery" type="search" placeholder="Search heroes..."
                                    class="pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-background border border-border/50 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 focus:border-velaris-purple/50 transition-all w-full" />
                            </div>
                        </div>
                        <div class="flex gap-2 sm:gap-3 flex-wrap items-center">
                            <select v-model="filterFaction"
                                class="flex-1 sm:flex-none bg-background border border-border/50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all">
                                <option value="">All Factions</option>
                                <option v-for="faction in store.factions" :key="faction.id" :value="faction.id">
                                    {{ faction.name }}
                                </option>
                            </select>
                            <select v-model="filterRarity"
                                class="flex-1 sm:flex-none bg-background border border-border/50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all">
                                <option value="">All Rarities</option>
                                <option v-for="rarity in store.rarities" :key="rarity.id" :value="rarity.id">
                                    {{ rarity.name }}
                                </option>
                            </select>
                            <select v-model="filterTag"
                                class="flex-1 sm:flex-none bg-background border border-border/50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all">
                                <option value="">All Roles</option>
                                <option v-for="tag in store.tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
                            </select>

                            <button v-if="hasActiveFilters" @click="clearFilters"
                                class="btn-soft-violet px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
                                <RotateCcw class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Heroes Display - Grouped by Faction -->
                <div class="space-y-6 sm:space-y-8">
                    <div v-for="faction in ['nature', 'horde', 'league']" :key="faction"
                        v-show="getFilteredHeroesByFaction(faction).length > 0">
                        <!-- Faction Header -->
                        <div class="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div class="h-1 w-8 sm:w-12 rounded-full" :class="getFactionBgClass(faction)"></div>
                            <div class="flex items-center gap-2 sm:gap-3">
                                <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg"
                                    :class="getFactionGradient(faction)">
                                    <component :is="getFactionIcon(faction)" class="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                </div>
                                <div>
                                    <h2 class="text-lg sm:text-xl font-bold" :class="getFactionColor(faction)">
                                        {{ getFactionName(faction) }}
                                    </h2>
                                    <p class="text-xs sm:text-sm text-foreground/60">
                                        {{ getFilteredHeroesByFaction(faction).length }} heroes
                                    </p>
                                </div>
                            </div>
                            <div class="h-1 flex-1 rounded-full" :class="getFactionBgClass(faction)"></div>
                        </div>

                        <!-- Heroes Grid -->
                        <div
                            class="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            <UserHeroCard v-for="hero in getFilteredHeroesByFaction(faction)" :key="hero.id"
                                :hero="hero" :store="store" @add-to-queue="createQueueWithHero" @view="viewHero" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- My Queues View -->
            <div v-else-if="activeView === 'my-queues'" class="space-y-6">
                <QueueManager :queues="store.userQueues" :heroes="store.heroes" :store="store"
                    :is-loading="store.isLoadingQueues" :is-user-view="true" @create-queue="createNewQueue"
                    @edit-queue="editQueue" @delete-queue="deleteQueue" @refresh="refreshQueues" />
            </div>

            <!-- Queue Builder View -->
            <div v-else-if="activeView === 'queue-builder'" class="space-y-6">
                <QueueBuilder :queue="editingQueue" :available-heroes="store.heroes" :store="store"
                    :team-gear-data="teamGearData" @save="saveQueue" @cancel="cancelQueueBuilder"
                    @update-gear="updateGearData" />
            </div>

            <!-- Empty State for Heroes -->
            <div v-else-if="activeView === 'heroes' && !isLoadingData && store.heroesCount === 0"
                class="text-center py-12 sm:py-16">
                <div
                    class="h-20 w-20 sm:h-24 sm:w-24 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">
                    <Library class="h-10 w-10 sm:h-12 sm:w-12 text-foreground/30" />
                </div>
                <h3 class="text-lg sm:text-xl font-semibold mb-2">No Heroes Available</h3>
                <p class="text-sm sm:text-base text-foreground/60 mb-4 sm:mb-6 px-4">Heroes data is not available.
                    Please contact an administrator.</p>
            </div>
        </div>

        <!-- Modals -->
        <GearModal v-model:isOpen="showGearModal" :hero="gearModalHero" :position="gearModalPosition"
            :gear-data="gearData" :available-gear="store.gear" @save="saveGearData" />

        <HeroViewModal v-model:isOpen="showHeroModal" :hero="viewingHero" :factions="store.factions"
            :rarities="store.rarities" :tags="store.tags" :bonds="store.bonds" :store="store"
            @add-to-queue="createQueueWithHero" />
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus, Library, Users, Flame, Leaf, Shield, Star, RotateCcw, List, X } from 'lucide-vue-next'

import { useTopHeroesUserStore } from '@/stores/useTopHeroesUserStore'
import { useMainStore } from '@/stores/useMainStore'

import UserHeroCard from '@/components/topheroes/UserHeroCard.vue'
import QueueBuilder from '@/components/topheroes/QueueBuilder.vue'
import QueueManager from '@/components/topheroes/QueueManager.vue'
import GearModal from '@/components/topheroes/modals/GearModal.vue'
import HeroViewModal from '@/components/topheroes/modals/HeroViewModal.vue'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher.vue'

const router = useRouter()
const store = useTopHeroesUserStore()
const mainStore = useMainStore()

const activeView = ref('heroes')
const searchQuery = ref('')
const filterFaction = ref('')
const filterRarity = ref('')
const filterTag = ref('')

const showGearModal = ref(false)
const showHeroModal = ref(false)

const gearModalPosition = ref('')
const gearModalHero = ref(null)
const viewingHero = ref(null)
const editingQueue = ref(null)

const gearData = reactive({
    gearSet: 'none',
    gearSetName: '',
    gearLevel: '',
    notes: ''
})

const teamGearData = ref({})

const isLoadingData = computed(() => store.isLoading || store.isLoadingHeroes)

const filteredHeroes = computed(() => {
    if (!store.heroes?.length) return []
    return store.searchHeroes(searchQuery.value, {
        faction: filterFaction.value,
        rarity: filterRarity.value,
        tag: filterTag.value
    })
})

const getFilteredHeroesByFaction = (faction) => {
    const factionHeroes = filteredHeroes.value.filter(hero => hero.faction === faction)
    const rarityOrder = { 'mythic': 0, 'legendary': 1, 'epic': 2, 'rare': 3 }

    return factionHeroes.sort((a, b) => {
        const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity]
        if (rarityDiff !== 0) return rarityDiff
        return a.name.localeCompare(b.name)
    })
}

const hasActiveFilters = computed(() =>
    searchQuery.value || filterFaction.value || filterRarity.value || filterTag.value
)

const getFactionCount = (faction) => {
    return store.heroesByFaction[faction]?.length || 0
}

const getFactionName = (faction) => {
    return store.getFactionById(faction)?.name || faction
}

const getFactionIcon = (faction) => {
    const icons = { nature: Leaf, horde: Flame, league: Shield }
    return icons[faction] || Shield
}

const getFactionColor = (faction) => {
    const colors = {
        nature: 'text-nature-green',
        horde: 'text-horde-red',
        league: 'text-league-blue'
    }
    return colors[faction] || 'text-foreground'
}

const getFactionGradient = (faction) => {
    const gradients = {
        nature: 'bg-gradient-to-br from-nature-green to-emerald-600',
        horde: 'bg-gradient-to-br from-horde-red to-red-600',
        league: 'bg-gradient-to-br from-league-blue to-blue-600'
    }
    return gradients[faction] || 'bg-gradient-to-br from-velaris-purple to-velaris-teal'
}

const getFactionBgClass = (faction) => {
    const classes = {
        nature: 'bg-gradient-to-r from-nature-green/50 to-nature-green/20',
        horde: 'bg-gradient-to-r from-horde-red/50 to-horde-red/20',
        league: 'bg-gradient-to-r from-league-blue/50 to-league-blue/20'
    }
    return classes[faction] || 'bg-foreground/20'
}

const refreshData = async () => {
    try {
        await store.loadAll(true)
    } catch (err) {
        console.error('Failed to refresh data:', err)
    }
}

const refreshQueues = async () => {
    try {
        await store.fetchQueues(true)
    } catch (err) {
        console.error('Failed to refresh queues:', err)
    }
}

const clearFilters = () => {
    searchQuery.value = ''
    filterFaction.value = ''
    filterRarity.value = ''
    filterTag.value = ''
}

const viewHero = (hero) => {
    viewingHero.value = hero
    showHeroModal.value = true
}

const createQueueWithHero = (hero) => {
    editingQueue.value = {
        name: `Team with ${hero.name}`,
        description: `Quick team built around ${hero.name}`,
        category: '',
        strategy: '',
        isActive: true,
        isVisible: true,
        heroes: [{ heroId: hero.id, position: 'front1' }],
        gearData: {}
    }
    activeView.value = 'queue-builder'
}

const createNewQueue = () => {
    editingQueue.value = {
        name: '',
        description: '',
        category: '',
        strategy: '',
        isActive: true,
        isVisible: true,
        heroes: [],
        gearData: {}
    }
    activeView.value = 'queue-builder'
}

const editQueue = (queue) => {
    if (!store.canEditQueue(queue)) {
        console.warn('Cannot edit queue - not owner')
        return
    }
    editingQueue.value = { ...queue }
    activeView.value = 'queue-builder'
}

const cancelQueueBuilder = () => {
    editingQueue.value = null
    activeView.value = 'my-queues'
}

const deleteQueue = async (queue) => {
    if (!store.canEditQueue(queue)) {
        console.warn('Cannot delete queue - not owner')
        return
    }
    try {
        await store.deleteQueue(queue.id)
    } catch (err) {
        console.error('Failed to delete queue:', err)
    }
}

const saveQueue = async (queueData) => {
    try {
        if (editingQueue.value?.id) {
            await store.updateQueue(editingQueue.value.id, queueData)
        } else {
            await store.createQueue(queueData)
        }
        activeView.value = 'my-queues'
        editingQueue.value = null
    } catch (err) {
        console.error('Failed to save queue:', err)
    }
}

const saveGearData = (data) => {
    if (gearModalHero.value && gearModalPosition.value) {
        const key = `${gearModalHero.value.id}_${gearModalPosition.value}`
        teamGearData.value[key] = { ...data }
    }
    showGearModal.value = false
    gearModalPosition.value = ''
    gearModalHero.value = null
    Object.assign(gearData, {
        gearSet: 'none',
        gearSetName: '',
        gearLevel: '',
        notes: ''
    })
}

const updateGearData = (newGearData) => {
    teamGearData.value = { ...newGearData }
}

onMounted(async () => {
    try {
        if (!store.heroes?.length) {
            await store.loadAll()
        }
    } catch (err) {
        console.error('Failed to load TopHeroes data:', err)
    }
})

watch(() => store.heroes?.length, (newCount) => {
    if (newCount > 0) {
        console.log(`Loaded ${newCount} heroes`)
    }
})
</script>

<style scoped>
:root {
    --nature-green: #10b981;
    --horde-red: #ef4444;
    --league-blue: #3b82f6;
}

.text-nature-green {
    color: var(--nature-green);
}

.text-horde-red {
    color: var(--horde-red);
}

.text-league-blue {
    color: var(--league-blue);
}

.stat-card {
    @apply relative overflow-hidden rounded-lg sm:rounded-xl backdrop-blur-sm border shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
}

.stat-card::before {
    content: '';
    @apply absolute inset-0 opacity-10;
}

.stat-card-nature {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 100%);
    border-color: rgba(16, 185, 129, 0.3);
}

.stat-card-nature::before {
    background: linear-gradient(135deg, var(--nature-green), #059669);
}

.stat-card-horde {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 50%, transparent 100%);
    border-color: rgba(239, 68, 68, 0.3);
}

.stat-card-horde::before {
    background: linear-gradient(135deg, var(--horde-red), #dc2626);
}

.stat-card-league {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%);
    border-color: rgba(59, 130, 246, 0.3);
}

.stat-card-league::before {
    background: linear-gradient(135deg, var(--league-blue), #2563eb);
}

.stat-card-total {
    background: linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(234, 179, 8, 0.1) 50%, transparent 100%);
    border-color: rgba(234, 179, 8, 0.3);
}

.stat-card-total::before {
    background: linear-gradient(135deg, #eab308, #f59e0b);
}

.btn-solid-purple {
    @apply bg-gradient-to-r from-velaris-purple to-velaris-teal text-white font-medium rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center;
}

.btn-soft-violet {
    @apply bg-velaris-purple/10 text-velaris-purple border border-velaris-purple/30 hover:bg-velaris-purple/20 transition-all duration-200 font-medium rounded-lg sm:rounded-xl flex items-center justify-center;
}
</style>