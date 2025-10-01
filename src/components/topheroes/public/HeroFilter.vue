<!-- components/topheroes/public/HeroFilter.vue -->
<template>
    <div class="space-y-4">
        <!-- Quick Search -->
        <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
            <input v-model="heroSearch" type="search" placeholder="Search heroes..."
                class="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all text-sm" />
        </div>

        <!-- Faction Tabs -->
        <div class="flex gap-2 border-b border-border">
            <button v-for="faction in factionTabs" :key="faction.id" @click="activeFaction = faction.id" :class="[
                'px-4 py-2 text-sm font-medium transition-all border-b-2',
                activeFaction === faction.id
                    ? 'border-current ' + faction.color
                    : 'border-transparent text-foreground/60 hover:text-foreground'
            ]">
                <component :is="faction.icon" class="h-4 w-4 inline mr-2" />
                {{ faction.name }}
            </button>
        </div>

        <!-- Hero Grid -->
        <div class="max-h-96 overflow-y-auto p-4 bg-background rounded-lg border border-border">
            <div v-if="filteredHeroes.length === 0" class="text-center py-8 text-foreground/60">
                <Users class="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p class="text-sm">No heroes found</p>
            </div>

            <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                <button v-for="hero in filteredHeroes" :key="hero.id" @click="toggleHero(hero.id)" :class="[
                    'relative p-3 rounded-lg border-2 transition-all duration-200 text-left',
                    isSelected(hero.id)
                        ? 'border-velaris-purple bg-velaris-purple/10 shadow-lg'
                        : 'border-border hover:border-velaris-purple/50 bg-card hover:bg-foreground/5'
                ]">
                    <!-- Selected Checkmark -->
                    <div v-if="isSelected(hero.id)"
                        class="absolute top-1 right-1 h-5 w-5 bg-velaris-purple rounded-full flex items-center justify-center">
                        <Check class="h-3 w-3 text-white" />
                    </div>

                    <!-- Hero Avatar -->
                    <div class="h-12 w-12 rounded-lg flex items-center justify-center text-white text-sm font-bold mx-auto mb-2"
                        :class="getFactionGradient(hero.faction)">
                        {{ hero.name.charAt(0) }}
                    </div>

                    <!-- Hero Name -->
                    <div class="text-center">
                        <p class="text-xs font-medium truncate" :title="hero.name">{{ hero.name }}</p>
                        <div class="flex items-center justify-center gap-1 mt-1">
                            <div class="w-2 h-2 rounded-full" :class="getRarityDotClass(hero.rarity)"></div>
                        </div>
                    </div>
                </button>
            </div>
        </div>

        <!-- Selected Summary -->
        <div v-if="selectedHeroes.length > 0"
            class="flex items-center justify-between p-3 bg-velaris-purple/10 border border-velaris-purple/30 rounded-lg">
            <div class="flex items-center gap-2 text-sm">
                <Users class="h-4 w-4 text-velaris-purple" />
                <span class="font-medium text-velaris-purple">{{ selectedHeroes.length }} heroes selected</span>
            </div>
            <button @click="clearAll"
                class="text-xs text-velaris-purple hover:text-velaris-teal transition-colors font-medium">
                Clear All
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Users, Check, Flame, Leaf, Shield } from 'lucide-vue-next'

const props = defineProps({
    heroes: {
        type: Array,
        default: () => []
    },
    selectedHeroes: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:selectedHeroes'])

// State
const heroSearch = ref('')
const activeFaction = ref('all')

// Faction tabs configuration
const factionTabs = [
    { id: 'all', name: 'All Heroes', icon: Users, color: 'text-velaris-purple' },
    { id: 'nature', name: 'Nature', icon: Leaf, color: 'text-nature-green' },
    { id: 'horde', name: 'Horde', icon: Flame, color: 'text-horde-red' },
    { id: 'league', name: 'League', icon: Shield, color: 'text-league-blue' }
]

// Computed
const filteredHeroes = computed(() => {
    let filtered = props.heroes

    // Faction filter
    if (activeFaction.value !== 'all') {
        filtered = filtered.filter(hero => hero.faction === activeFaction.value)
    }

    // Search filter
    if (heroSearch.value) {
        const search = heroSearch.value.toLowerCase()
        filtered = filtered.filter(hero =>
            hero.name.toLowerCase().includes(search) ||
            hero.faction.toLowerCase().includes(search)
        )
    }

    // Sort by rarity then name
    const rarityOrder = { 'MY': 0, 'LE': 1, 'EP': 2, 'RA': 3 }
    return filtered.sort((a, b) => {
        const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity]
        if (rarityDiff !== 0) return rarityDiff
        return a.name.localeCompare(b.name)
    })
})

// Methods
const isSelected = (heroId) => {
    return props.selectedHeroes.includes(heroId)
}

const toggleHero = (heroId) => {
    const newSelection = isSelected(heroId)
        ? props.selectedHeroes.filter(id => id !== heroId)
        : [...props.selectedHeroes, heroId]

    emit('update:selectedHeroes', newSelection)
}

const clearAll = () => {
    emit('update:selectedHeroes', [])
}

const getFactionGradient = (faction) => {
    const gradients = {
        nature: 'bg-gradient-to-br from-nature-green to-emerald-600',
        horde: 'bg-gradient-to-br from-horde-red to-red-600',
        league: 'bg-gradient-to-br from-league-blue to-blue-600'
    }
    return gradients[faction] || 'bg-gradient-to-br from-velaris-purple to-velaris-teal'
}

const getRarityDotClass = (rarity) => {
    const classes = {
        MY: 'bg-red-500',
        LE: 'bg-yellow-500',
        EP: 'bg-purple-500',
        RA: 'bg-blue-500'
    }
    return classes[rarity] || 'bg-slate-500'
}
</script>