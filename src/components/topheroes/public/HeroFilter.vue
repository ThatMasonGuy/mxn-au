<!-- components/topheroes/public/HeroFilter.vue -->
<template>
    <div class="space-y-3">
        <!-- Quick Search -->
        <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
            <input v-model="heroSearch" type="search" placeholder="Search heroes..."
                class="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all text-sm" />
        </div>

        <!-- Faction Tabs -->
        <div class="flex gap-1 border-b border-border">
            <button v-for="faction in factionTabs" :key="faction.id" @click="activeFaction = faction.id" :class="[
                'flex-1 px-2 py-2 text-xs font-medium transition-all border-b-2 flex items-center justify-center gap-1',
                activeFaction === faction.id
                    ? 'border-current ' + faction.color
                    : 'border-transparent text-foreground/60 hover:text-foreground'
            ]">
                <component :is="faction.icon" class="h-3 w-3" />
                <span class="hidden sm:inline">{{ faction.name }}</span>
            </button>
        </div>

        <!-- Hero Grid -->
        <div class="max-h-[500px] overflow-y-auto p-3 bg-background rounded-lg border border-border">
            <div v-if="filteredHeroes.length === 0" class="text-center py-6 text-foreground/60">
                <Users class="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p class="text-xs">No heroes found</p>
            </div>

            <div v-else class="grid grid-cols-3 gap-2">
                <button v-for="hero in filteredHeroes" :key="hero.id" @click="toggleHero(hero.id)" :class="[
                    'relative p-2 rounded-lg border-2 transition-all duration-200 text-left group',
                    isSelected(hero.id)
                        ? 'border-velaris-purple bg-velaris-purple/10 shadow-md'
                        : 'border-border hover:border-velaris-purple/50 bg-card hover:bg-foreground/5'
                ]">
                    <!-- Selected Checkmark -->
                    <div v-if="isSelected(hero.id)"
                        class="absolute -top-1 -right-1 h-4 w-4 bg-velaris-purple rounded-full flex items-center justify-center shadow-lg">
                        <Check class="h-2.5 w-2.5 text-white" />
                    </div>

                    <!-- Hero Avatar -->
                    <div class="h-10 w-10 rounded-md flex items-center justify-center text-white text-xs font-bold mx-auto mb-1.5"
                        :class="getFactionGradient(hero.faction)">
                        {{ hero.name.charAt(0) }}
                    </div>

                    <!-- Hero Name -->
                    <div class="text-center">
                        <p class="text-[10px] font-medium truncate leading-tight" :title="hero.name">{{ hero.name }}</p>
                        <div class="flex items-center justify-center mt-1">
                            <div class="w-1.5 h-1.5 rounded-full" :class="getRarityDotClass(hero.rarity)"></div>
                        </div>
                    </div>
                </button>
            </div>
        </div>

        <!-- Selected Summary -->
        <div v-if="selectedHeroes.length > 0"
            class="flex items-center justify-between p-2.5 bg-velaris-purple/10 border border-velaris-purple/30 rounded-lg">
            <div class="flex items-center gap-2 text-xs">
                <Users class="h-3.5 w-3.5 text-velaris-purple" />
                <span class="font-medium text-velaris-purple">{{ selectedHeroes.length }} selected</span>
            </div>
            <button @click="clearAll"
                class="text-xs text-velaris-purple hover:text-velaris-teal transition-colors font-medium">
                Clear
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
    { id: 'all', name: 'All', icon: Users, color: 'text-velaris-purple' },
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
    const rarityOrder = { 'mythic': 0, 'legendary': 1, 'epic': 2, 'rare': 3 }
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
        mythic: 'bg-red-500',
        legendary: 'bg-yellow-500',
        epic: 'bg-purple-500',
        rare: 'bg-blue-500'
    }
    return classes[rarity] || 'bg-slate-500'
}
</script>