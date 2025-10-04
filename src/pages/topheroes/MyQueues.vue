<!-- pages/UserHeroes.vue -->
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
                        My TopHeroes Manager
                    </h1>
                    <p class="text-lg text-foreground/70 max-w-2xl mx-auto">
                        Browse heroes, create team compositions, and manage your strategic queues.
                        <span v-if="store.heroesCount > 0" class="block mt-2 text-sm">
                            {{ store.heroesCount }} heroes available • {{ store.userQueues.length }} queue{{
                                store.userQueues.length !== 1 ? 's' : '' }} created
                        </span>
                    </p>
                </div>
            </div>
        </div>

        <div class="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Loading Overlay -->
            <div v-if="isLoadingData" class="flex items-center justify-center min-h-[400px]">
                <div class="text-center">
                    <div
                        class="animate-spin h-12 w-12 border-4 border-velaris-purple border-t-transparent rounded-full mx-auto mb-4">
                    </div>
                    <p class="text-foreground/60">Loading heroes data...</p>
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

            <!-- Navigation Tabs -->
            <div class="mb-8">
                <div class="flex gap-3 flex-wrap">
                    <button @click="activeView = 'heroes'"
                        :class="['', activeView === 'heroes' ? 'btn-solid-purple' : 'btn-soft-violet']">
                        <Library class="h-4 w-4 mr-2" />
                        Browse Heroes
                    </button>
                    <button @click="activeView = 'my-queues'"
                        :class="['relative', activeView === 'my-queues' ? 'btn-solid-purple' : 'btn-soft-violet']">
                        <List class="h-4 w-4 mr-2" />
                        My Queues
                        <span v-if="store.userQueues.length > 0"
                            class="absolute -top-1 -right-1 bg-velaris-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {{ store.userQueues.length }}
                        </span>
                    </button>
                    <button @click="router.push('/topheroes/queues')" class="btn-soft-violet">
                        <Users class="h-4 w-4 mr-2" />
                        Browse Community Queues
                    </button>
                    <div class="ml-auto">
                        <button @click="refreshData" :disabled="isLoadingData" class="btn-soft-violet rounded-md"
                            title="Refresh data">
                            <RotateCcw :class="['h-4 w-4', isLoadingData ? 'animate-spin' : '']" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Heroes View -->
            <div v-if="activeView === 'heroes' && store.heroesCount > 0" class="space-y-8">
                <!-- Stats Dashboard -->
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div class="stat-card stat-card-nature">
                        <div class="relative p-6">
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
                        <div class="relative p-6">
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
                        <div class="relative p-6">
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
                        <div class="relative p-6">
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

                <!-- Search and Filters -->
                <div class="bg-card border border-border rounded-xl p-6">
                    <div class="flex flex-col lg:flex-row gap-4">
                        <div class="flex-1">
                            <div class="relative">
                                <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                                <input v-model="searchQuery" type="search"
                                    placeholder="Search heroes by name, faction, or abilities..."
                                    class="pl-12 pr-4 py-3 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 focus:border-velaris-purple/50 transition-all w-full" />
                            </div>
                        </div>
                        <div class="flex gap-3 flex-wrap items-center">
                            <select v-model="filterFaction"
                                class="bg-background border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all">
                                <option value="">All Factions</option>
                                <option v-for="faction in store.factions" :key="faction.id" :value="faction.id">
                                    {{ faction.name }}
                                </option>
                            </select>
                            <select v-model="filterRarity"
                                class="bg-background border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all">
                                <option value="">All Rarities</option>
                                <option v-for="rarity in store.rarities" :key="rarity.id" :value="rarity.id">
                                    {{ rarity.name }}
                                </option>
                            </select>
                            <select v-model="filterTag"
                                class="bg-background border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all">
                                <option value="">All Roles</option>
                                <option v-for="tag in store.tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
                            </select>

                            <button v-if="hasActiveFilters" @click="clearFilters"
                                class="btn-soft-violet px-4 py-3 rounded-lg">
                                <RotateCcw class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Heroes Display -->
                <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    <UserHeroCard v-for="hero in filteredHeroes" :key="hero.id" :hero="hero" :store="store"
                        @add-to-queue="createQueueWithHero" @view="viewHero" />
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
                class="text-center py-16">
                <div
                    class="h-24 w-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">
                    <Library class="h-12 w-12 text-foreground/30" />
                </div>
                <h3 class="text-xl font-semibold mb-2">No Heroes Available</h3>
                <p class="text-foreground/60 mb-6">Heroes data is not available. Please contact an administrator.</p>
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
import {
    Search, Plus, Library, Users, Flame, Leaf, Shield, Star, RotateCcw,
    List, X
} from 'lucide-vue-next'

// Stores
import { useTopHeroesUserStore } from '@/stores/useTopHeroesUserStore'
import { useMainStore } from '@/stores/useMainStore'

// Components
import UserHeroCard from '@/components/topheroes/UserHeroCard.vue'
import QueueBuilder from '@/components/topheroes/QueueBuilder.vue'
import QueueManager from '@/components/topheroes/QueueManager.vue'
import GearModal from '@/components/topheroes/modals/GearModal.vue'
import HeroViewModal from '@/components/topheroes/modals/HeroViewModal.vue'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher.vue'

const router = useRouter()
const store = useTopHeroesUserStore()
const mainStore = useMainStore()

// UI State
const activeView = ref('heroes')
const searchQuery = ref('')
const filterFaction = ref('')
const filterRarity = ref('')
const filterTag = ref('')

// Modal states
const showGearModal = ref(false)
const showHeroModal = ref(false)

// Modal data
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

// Computed properties
const isLoadingData = computed(() => store.isLoading || store.isLoadingHeroes)

const filteredHeroes = computed(() => {
    if (!store.heroes?.length) return []

    return store.searchHeroes(searchQuery.value, {
        faction: filterFaction.value,
        rarity: filterRarity.value,
        tag: filterTag.value
    })
})

const hasActiveFilters = computed(() =>
    searchQuery.value || filterFaction.value || filterRarity.value || filterTag.value
)

// Helper functions
const getFactionCount = (faction) => {
    return store.heroesByFaction[faction]?.length || 0
}

// Actions
const refreshData = async () => {
    try {
        await store.loadAll(true)
        console.log('Data refreshed')
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

// Hero actions
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
        heroes: [
            { heroId: hero.id, position: 'front1' }
        ],
        gearData: {}
    }

    activeView.value = 'queue-builder'
}

// Queue management
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

// Gear modal actions
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
        if (!store.heroes?.length) {
            console.log('Loading TopHeroes data...')
            await store.loadAll()
            console.log('TopHeroes data loaded successfully!')
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
    @apply relative overflow-hidden rounded-xl backdrop-blur-sm border shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
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
    @apply bg-velaris-purple/10 text-velaris-purple border border-velaris-purple/30 hover:bg-velaris-purple/20 transition-all duration-200 font-medium rounded-xl py-2 px-4;
}
</style>