<!-- Heroes.vue -->
<template>
    <div class="min-h-screen bg-background text-foreground">
        <!-- Loading Overlay -->
        <div v-if="isLoadingData" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div class="bg-card border border-border rounded-xl p-8 max-w-sm w-full mx-4">
                <div class="text-center space-y-4">
                    <div
                        class="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-velaris-purple to-velaris-teal flex items-center justify-center">
                        <div class="animate-spin h-8 w-8 border-3 border-white border-t-transparent rounded-full"></div>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Loading Heroes</h3>
                        <p class="text-sm text-foreground/60">Fetching data from Firestore...</p>
                    </div>
                    <div v-if="store.error" class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p class="text-sm text-red-400">{{ store.error }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Header -->
        <div class="mb-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <h1 class="text-2xl font-semibold text-velaris-purple">TopHeroes Manager</h1>
                    <p class="text-sm text-foreground/70 mt-1">
                        Manage heroes, build teams, and optimize gear setups
                        <span v-if="store.heroesCount > 0"
                            class="ml-2 px-2 py-1 bg-velaris-purple/10 text-velaris-purple rounded-full text-xs font-medium">
                            {{ store.heroesCount }} heroes loaded
                        </span>
                    </p>
                </div>
                <div class="flex gap-3 w-full lg:w-auto flex-wrap">
                    <button @click="activeView = 'heroes'"
                        :class="['flex-1 lg:flex-none', activeView === 'heroes' ? 'btn-solid-purple' : 'btn-soft-violet']">
                        <Library class="h-4 w-4 mr-2" />
                        Hero Collection
                    </button>
                    <button @click="activeView = 'queues'"
                        :class="['flex-1 lg:flex-none', activeView === 'queues' ? 'btn-solid-purple' : 'btn-soft-violet']">
                        <List class="h-4 w-4 mr-2" />
                        Queues
                    </button>
                    <button @click="refreshData" :disabled="isLoadingData" class="btn-soft-violet rounded-md"
                        title="Refresh data from Firestore">
                        <RotateCcw :class="['h-4 w-4', isLoadingData ? 'animate-spin' : '']" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Data Status Banner -->
        <div v-if="!isLoadingData && store.heroesCount === 0" class="mb-6">
            <div
                class="p-6 bg-gradient-to-r from-velaris-amber/10 via-velaris-amber/5 to-velaris-amber/10 border border-velaris-amber/20 rounded-xl">
                <div class="flex items-center gap-4">
                    <div class="h-12 w-12 rounded-xl bg-velaris-amber/20 flex items-center justify-center">
                        <Star class="h-6 w-6 text-velaris-amber" />
                    </div>
                    <div class="flex-1">
                        <h3 class="font-semibold text-velaris-amber mb-1">No Hero Data Found</h3>
                        <p class="text-sm text-foreground/70">
                            Hero data hasn't been synced to Firestore yet. Click "Sync DB" to initialize your hero
                            database.
                        </p>
                    </div>
                    <button @click="showSyncModal = true" class="btn-solid-purple">
                        <Zap class="h-4 w-4 mr-2" />
                        Sync Now
                    </button>
                </div>
            </div>
        </div>

        <!-- Error Banner -->
        <div v-if="store.error && !isLoadingData" class="mb-6">
            <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div class="flex items-center gap-3">
                    <X class="h-5 w-5 text-red-400" />
                    <div class="flex-1">
                        <h3 class="font-semibold text-red-400 mb-1">Error Loading Data</h3>
                        <p class="text-sm text-foreground/70">{{ store.error }}</p>
                    </div>
                    <button @click="refreshData" class="btn-soft-violet">
                        <RotateCcw class="h-4 w-4 mr-2" />
                        Retry
                    </button>
                </div>
            </div>
        </div>

        <!-- Heroes View -->
        <div v-if="activeView === 'heroes' && store.heroesCount > 0" class="space-y-8">
            <!-- Stats Dashboard -->
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div class="stat-card stat-card-nature">
                    <div class="relative p-0 lg:p-6">
                        <div class="flex items-center gap-4">
                            <div
                                class="h-12 w-12 rounded-xl bg-gradient-to-br from-nature-green to-emerald-600 flex items-center justify-center shadow-lg">
                                <Leaf class="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-nature-green">{{ getFactionCount('nature') }}</p>
                                <p class="text-sm font-medium text-nature-green/80">Nature Heroes</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="stat-card stat-card-horde">
                    <div class="relative p-0 lg:p-6">
                        <div class="flex items-center gap-4">
                            <div
                                class="h-12 w-12 rounded-xl bg-gradient-to-br from-horde-red to-red-600 flex items-center justify-center shadow-lg">
                                <Flame class="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-horde-red">{{ getFactionCount('horde') }}</p>
                                <p class="text-sm font-medium text-horde-red/80">Horde Heroes</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="stat-card stat-card-league">
                    <div class="relative p-0 lg:p-6">
                        <div class="flex items-center gap-4">
                            <div
                                class="h-12 w-12 rounded-xl bg-gradient-to-br from-league-blue to-blue-600 flex items-center justify-center shadow-lg">
                                <Shield class="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-league-blue">{{ getFactionCount('league') }}</p>
                                <p class="text-sm font-medium text-league-blue/80">League Heroes</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="stat-card stat-card-total">
                    <div class="relative p-0 lg:p-6">
                        <div class="flex items-center gap-4">
                            <div
                                class="h-12 w-12 rounded-xl bg-gradient-to-br from-velaris-amber to-yellow-600 flex items-center justify-center shadow-lg">
                                <Star class="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-velaris-amber">{{ store.heroesCount }}</p>
                                <p class="text-sm font-medium text-velaris-amber/80">Total Heroes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Search and Filters -->
            <div
                class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-card/80 via-card to-card/80 backdrop-blur-sm border border-border/30">
                <div class="p-6">
                    <div class="flex flex-col lg:flex-row gap-4">
                        <div class="flex-1">
                            <div class="relative">
                                <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                                <input v-model="searchQuery" type="search"
                                    placeholder="Search heroes by name, faction, or abilities..."
                                    class="pl-12 pr-4 py-3 bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 focus:border-velaris-purple/50 transition-all w-full shadow-inner" />
                            </div>
                        </div>
                        <div class="flex gap-3 flex-wrap items-center">
                            <select v-model="filterFaction"
                                class="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all">
                                <option value="">All Factions</option>
                                <option v-for="faction in store.factions" :key="faction.id" :value="faction.id">
                                    {{ getFactionIcon(faction.id) }} {{ faction.name }}
                                </option>
                            </select>
                            <select v-model="filterRarity"
                                class="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all">
                                <option value="">All Rarities</option>
                                <option v-for="rarity in store.rarities" :key="rarity.id" :value="rarity.id">
                                    {{ getRarityIcon(rarity.id) }} {{ rarity.name }}
                                </option>
                            </select>
                            <select v-model="filterTag"
                                class="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all">
                                <option value="">All Roles</option>
                                <option v-for="tag in store.tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
                            </select>

                            <div class="flex rounded-xl bg-background/30 p-1 border border-border/30">
                                <button @click="viewMode = 'grouped'"
                                    :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                        viewMode === 'grouped' ? 'bg-velaris-purple text-white shadow-md' : 'text-foreground/70 hover:text-foreground']">
                                    Grouped
                                </button>
                                <button @click="viewMode = 'mixed'"
                                    :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                        viewMode === 'mixed' ? 'bg-velaris-purple text-white shadow-md' : 'text-foreground/70 hover:text-foreground']">
                                    Mixed
                                </button>
                            </div>

                            <button v-if="hasActiveFilters" @click="clearFilters"
                                class="btn-soft-violet px-4 py-3 rounded-xl">
                                <RotateCcw class="h-4 w-4" />
                            </button>

                            <button @click="showHeroModal = true" class="btn-solid-purple px-4 py-3 rounded-xl">
                                <Plus class="h-4 w-4 mr-2" />
                                Add Hero
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Heroes Display -->
            <div v-if="viewMode === 'grouped'" class="space-y-8">
                <div v-for="faction in ['nature', 'horde', 'league']" :key="faction"
                    v-show="getFilteredHeroesByFaction(faction).length > 0">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="h-1 w-12 rounded-full" :class="getFactionBgClass(faction)"></div>
                        <div class="flex items-center gap-3">
                            <div class="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg"
                                :class="getFactionGradient(faction)">
                                <component :is="getFactionIcon(faction)" class="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 class="text-xl font-bold" :class="getFactionColor(faction)">
                                    {{ getFactionName(faction) }}
                                </h2>
                                <p class="text-sm text-foreground/60">
                                    {{ getFilteredHeroesByFaction(faction).length }} heroes
                                </p>
                            </div>
                        </div>
                        <div class="h-1 flex-1 rounded-full" :class="getFactionBgClass(faction)"></div>
                    </div>

                    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        <HeroCard v-for="hero in getFilteredHeroesByFaction(faction)" :key="hero.id" :hero="hero"
                            :faction="faction" @add-to-queue="createQueueWithHero" @edit="editHero"
                            @delete="deleteHero" />
                    </div>
                </div>
            </div>

            <div v-else class="space-y-6">
                <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    <HeroCard v-for="hero in getMixedSortedHeroes" :key="hero.id" :hero="hero" :faction="hero.faction"
                        @add-to-queue="createQueueWithHero" @edit="editHero" @delete="deleteHero" />
                </div>
            </div>
        </div>

        <!-- Empty State for Heroes -->
        <div v-else-if="activeView === 'heroes' && !isLoadingData && store.heroesCount === 0" class="text-center py-16">
            <div
                class="h-24 w-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">
                <Library class="h-12 w-12 text-foreground/30" />
            </div>
            <h3 class="text-xl font-semibold mb-2">No Heroes Found</h3>
            <p class="text-foreground/60 mb-6">Sync your hero data to get started.</p>
            <button @click="showSyncModal = true" class="btn-solid-purple">
                <Zap class="h-4 w-4 mr-2" />
                Sync Hero Data
            </button>
        </div>

        <!-- Queue Builder View -->
        <div v-else-if="activeView === 'queue-builder'" class="space-y-6">
            <QueueBuilder :queue="editingQueue" :available-heroes="store.heroes" :store="store"
                :team-gear-data="teamGearData" @save="saveQueue" @cancel="cancelQueueBuilder"
                @update-gear="updateGearData" />
        </div>

        <!-- Queues View -->
        <div v-else-if="activeView === 'queues'" class="space-y-6">
            <QueueManager :queues="store.queues" :heroes="store.heroes" :is-loading="store.isLoadingQueues"
                @create-queue="createNewQueue" @edit-queue="editQueue" @delete-queue="deleteQueue"
                @refresh="refreshQueues" @toggle-status="toggleQueueStatus" />
        </div>

        <!-- Modals -->
        <GearModal v-model:isOpen="showGearModal" :hero="gearModalHero" :position="gearModalPosition"
            :gear-data="gearData" @save="saveGearData" />

        <SyncModal v-model:isOpen="showSyncModal" :hero-data="heroData" :store="store" />

        <HeroModal v-model:isOpen="showHeroModal" :hero="editingHero" :factions="store.factions"
            :rarities="store.rarities" :tags="store.tags" @save="saveHero" />
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import {
    Search, Plus, Library, Users, Flame, Leaf, Shield, Star, RotateCcw,
    Settings, X, Zap, Lightbulb, TrendingUp, Sword, Crown, Gem, Award, Hexagon, List
} from 'lucide-vue-next'

// Store
import { useTopHeroesHeroStore } from '@/stores/useTopHeroesHeroStore'

// Components
import HeroCard from '@/components/topheroes/HeroCard.vue'
import QueueBuilder from '@/components/topheroes/QueueBuilder.vue'
import QueueManager from '@/components/topheroes/QueueManager.vue'
import GearModal from '@/components/topheroes/modals/GearModal.vue'
import SyncModal from '@/components/topheroes/modals/SyncModal.vue'
import HeroModal from '@/components/topheroes/modals/HeroModal.vue'

const store = useTopHeroesHeroStore()

// Computed hero data for backward compatibility
const heroData = computed(() => ({
    factions: store.factions,
    rarities: store.rarities,
    tags: store.tags,
    hero_bonds: store.bonds,
    heroes: store.heroes
}))

// UI State
const activeView = ref('heroes')
const searchQuery = ref('')
const filterFaction = ref('')
const filterRarity = ref('')
const filterTag = ref('')
const viewMode = ref('grouped')

// Modal states
const showGearModal = ref(false)
const showSyncModal = ref(false)
const showHeroModal = ref(false)

// Modal data
const gearModalPosition = ref('')
const gearModalHero = ref(null)
const editingHero = ref(null)
const editingQueue = ref(null)

const gearData = reactive({
    gearSet: 'none',
    gearSetName: '',
    gearLevel: '',
    notes: ''
})

const teamGearData = ref({})

// Computed properties
const isLoadingData = computed(() => store.isLoading || store.isLoadingHeroes)

const filteredHeroes = computed(() => {
    if (!store.heroes.length) return []

    return store.searchHeroes(searchQuery.value, {
        faction: filterFaction.value,
        rarity: filterRarity.value,
        tag: filterTag.value
    })
})

const getFilteredHeroesByFaction = (faction) => {
    const factionHeroes = filteredHeroes.value.filter(hero => hero.faction === faction)
    const rarityOrder = { 'MY': 0, 'LE': 1, 'EP': 2, 'RA': 3 }

    return factionHeroes.sort((a, b) => {
        const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity]
        if (rarityDiff !== 0) return rarityDiff
        return a.name.localeCompare(b.name)
    })
}

const getMixedSortedHeroes = computed(() => {
    const rarityOrder = { 'MY': 0, 'LE': 1, 'EP': 2, 'RA': 3 }
    const factionOrder = { 'league': 0, 'nature': 1, 'horde': 2 }

    return filteredHeroes.value.sort((a, b) => {
        const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity]
        if (rarityDiff !== 0) return rarityDiff

        const factionDiff = factionOrder[a.faction] - factionOrder[b.faction]
        if (factionDiff !== 0) return factionDiff

        return a.name.localeCompare(b.name)
    })
})

const hasActiveFilters = computed(() =>
    searchQuery.value || filterFaction.value || filterRarity.value || filterTag.value
)

// Helper functions
const getFactionCount = (faction) => {
    return store.heroesByFaction[faction]?.length || 0
}

const getFactionName = (faction) => {
    const factionData = store.getFactionById(faction)
    return factionData ? factionData.name : faction
}

const getRarityName = (rarity) => {
    const rarityData = store.getRarityById(rarity)
    return rarityData ? rarityData.name : rarity
}

const getTagName = (tagId) => {
    const tag = store.getTagById(tagId)
    return tag ? tag.name : tagId
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

const getRarityIcon = (rarity) => {
    const icons = {
        MY: Crown,
        LE: Star,
        EP: Gem,
        RA: Hexagon
    }
    return icons[rarity] || Star
}

// Actions
const refreshData = async () => {
    try {
        await store.loadAll(true)
        console.log('Data refreshed from Firestore')
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

// Queue builder with preloaded hero
const createQueueWithHero = (hero) => {
    editingQueue.value = {
        name: `Team with ${hero.name}`,
        description: `Quick team built around ${hero.name}`,
        category: '',
        strategy: '',
        isActive: true,
        heroes: [
            { heroId: hero.id, position: 'front1' }
        ]
    }

    // Switch to queue builder view
    activeView.value = 'queue-builder'
}

const editHero = (hero) => {
    editingHero.value = { ...hero }
    showHeroModal.value = true
}

const deleteHero = async (hero) => {
    // The confirmation is handled by the HeroCard component itself now
    try {
        await store.deleteHero(hero.id)
    } catch (err) {
        console.error('Failed to delete hero:', err)
    }
}

const saveHero = async (heroData) => {
    try {
        if (editingHero.value?.id) {
            await store.updateHero(editingHero.value.id, heroData)
        } else {
            await store.createHero(heroData)
        }

        showHeroModal.value = false
        editingHero.value = null
    } catch (err) {
        console.error('Failed to save hero:', err)
    }
}

// Queue builder navigation
const createNewQueue = () => {
    editingQueue.value = null
    activeView.value = 'queue-builder'
}

const editQueue = (queue) => {
    editingQueue.value = { ...queue }
    activeView.value = 'queue-builder'
}

const cancelQueueBuilder = () => {
    editingQueue.value = null
    activeView.value = 'queues'
}

// Queue actions
const deleteQueue = async (queue) => {
    // The confirmation is handled by the QueueCard component itself now
    try {
        await store.deleteQueue(queue.id)
    } catch (err) {
        console.error('Failed to delete queue:', err)
    }
}

const toggleQueueStatus = async (queue) => {
    try {
        await store.updateQueue(queue.id, {
            ...queue,
            isActive: !queue.isActive
        })
    } catch (err) {
        console.error('Failed to toggle queue status:', err)
    }
}

const saveQueue = async (queueData) => {
    try {
        if (editingQueue.value?.id) {
            await store.updateQueue(editingQueue.value.id, queueData)
        } else {
            await store.createQueue(queueData)
        }

        // Navigate back to queues view after saving
        activeView.value = 'queues'
        editingQueue.value = null
    } catch (err) {
        console.error('Failed to save queue:', err)
    }
}

// Modal actions - Gear modal (keeping for compatibility but not used in current flow)
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

// Lifecycle
onMounted(async () => {
    try {
        if (store.heroes.length === 0) {
            console.log('Loading TopHeroes data from Firestore...')
            await store.loadAll()
            console.log('TopHeroes data loaded successfully!')
        }
    } catch (err) {
        console.error('Failed to load TopHeroes data:', err)
    }
})

watch(() => store.heroes.length, (newCount) => {
    if (newCount > 0) {
        console.log(`Loaded ${newCount} heroes from Firestore`)
    }
})
</script>

<style scoped>
/* Custom faction colors */
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

/* Stat Cards */
.stat-card {
    @apply relative overflow-hidden rounded-2xl backdrop-blur-sm border shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
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
    @apply bg-gradient-to-r from-velaris-purple to-velaris-teal text-white font-medium py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200;
}

.btn-soft-violet {
    @apply bg-velaris-purple/10 text-velaris-purple border border-velaris-purple/30 hover:bg-velaris-purple/20 transition-all duration-200 font-medium rounded-xl;
}
</style>