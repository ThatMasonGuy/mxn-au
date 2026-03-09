<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-8 px-4">
        <div class="max-w-7xl mx-auto">
            <!-- Header Section -->
            <div class="text-center mb-12">
                <div class="inline-flex items-center gap-3 mb-4">
                    <Sparkles class="w-8 h-8 text-cyan-400" />
                    <h1
                        class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                        Trait Trader
                    </h1>
                    <Sparkles class="w-8 h-8 text-blue-400" />
                </div>
                <p class="text-slate-300 text-lg">Find heroes with identical traits for perfect swaps</p>
            </div>

            <!-- Hero Selection Card -->
            <div
                class="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-500/30 p-6 md:p-8 mb-8 relative z-10">
                <label class="block text-slate-200 font-semibold mb-3 flex items-center gap-2">
                    <Search class="w-5 h-5 text-cyan-400" />
                    Select Your Target Hero
                </label>

                <div class="relative z-50">
                    <input v-model="searchQuery" @focus="showDropdown = true" @blur="handleBlur" type="text"
                        placeholder="Search for a hero..."
                        class="w-full px-4 py-3 bg-slate-800 border border-blue-500/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" />

                    <!-- Dropdown -->
                    <div v-if="showDropdown && filteredHeroes.length > 0"
                        class="absolute z-[9999] w-full mt-2 bg-slate-950 border border-blue-500/40 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
                        <div v-for="hero in filteredHeroes" :key="hero.id" @mousedown="selectHero(hero)"
                            class="px-4 py-3 hover:bg-blue-900/20 cursor-pointer transition-colors border-b border-slate-800 last:border-b-0 flex items-center justify-between group">
                            <div class="flex items-center gap-3">
                                <div :class="getRarityBadgeClass(hero.rarity)"
                                    class="px-2 py-1 rounded text-xs font-bold uppercase">
                                    {{ hero.rarity }}
                                </div>
                                <span class="text-white font-medium">{{ hero.name }}</span>
                            </div>
                            <ChevronRight class="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Selected Hero Display -->
            <div v-if="selectedHero" class="mb-8 relative z-0">
                <div :class="getFactionCardClass(selectedHero.faction)"
                    class="backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8">
                    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                        <div class="flex items-center gap-4">
                            <div :class="getFactionIconBgClass(selectedHero.faction)" class="p-3 rounded-xl">
                                <Users class="w-8 h-8" :class="getFactionIconClass(selectedHero.faction)" />
                            </div>
                            <div>
                                <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">{{ selectedHero.name }}</h2>
                                <div class="flex items-center gap-2 flex-wrap mb-2">
                                    <span :class="getRarityBadgeClass(selectedHero.rarity)"
                                        class="px-3 py-1 rounded-lg text-sm font-bold uppercase">
                                        {{ selectedHero.rarity }}
                                    </span>
                                    <span :class="getFactionBadgeClass(selectedHero.faction)"
                                        class="px-3 py-1 rounded-lg text-sm font-bold capitalize">
                                        {{ selectedHero.faction }}
                                    </span>
                                </div>
                                <!-- Hero Tags -->
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span v-for="tag in selectedHero.tags" :key="tag"
                                        class="px-2 py-1 bg-slate-700/60 rounded text-xs text-slate-300 capitalize">
                                        {{ formatTag(tag) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Traits Display -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div v-for="(traitId, slot) in selectedHero.traits" :key="slot"
                            class="bg-slate-900/50 rounded-xl p-4 border border-blue-500/30">
                            <div class="flex items-start justify-between mb-2">
                                <span class="text-cyan-300 text-sm font-semibold">Trait {{ slot }}</span>
                                <Award class="w-4 h-4 text-cyan-400" />
                            </div>
                            <p class="text-white font-medium">
                                {{ getTraitName(traitId) || 'Unknown' }}
                            </p>
                            <p v-if="!traitId" class="text-amber-400 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle class="w-3 h-3" />
                                Missing data
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Matching Heroes -->
            <div v-if="selectedHero && matchingHeroes.length > 0" class="relative z-0">
                <div class="flex items-center gap-3 mb-6">
                    <Shuffle class="w-6 h-6 text-cyan-400" />
                    <h2 class="text-2xl md:text-3xl font-bold text-white">
                        Perfect Trait Matches
                    </h2>
                    <span class="px-3 py-1 bg-cyan-500/20 rounded-lg text-cyan-300 font-semibold">
                        {{ matchingHeroes.length }}
                    </span>
                </div>

                <!-- Mythic Heroes -->
                <div v-if="mythicMatches.length > 0" class="mb-8">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="h-1 w-1 rounded-full bg-amber-400"></div>
                        <h3
                            class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                            Mythic Heroes
                        </h3>
                        <div class="h-1 flex-1 bg-gradient-to-r from-amber-400/20 to-transparent rounded-full"></div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <HeroCard v-for="match in mythicMatches" :key="match.hero.id" :hero="match.hero"
                            :shared-traits="match.sharedTraits" :trait-lookup="traitLookup" />
                    </div>
                </div>

                <!-- Legendary Heroes -->
                <div v-if="legendaryMatches.length > 0">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="h-1 w-1 rounded-full bg-blue-400"></div>
                        <h3
                            class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            Legendary Heroes
                        </h3>
                        <div class="h-1 flex-1 bg-gradient-to-r from-blue-400/20 to-transparent rounded-full"></div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <HeroCard v-for="match in legendaryMatches" :key="match.hero.id" :hero="match.hero"
                            :shared-traits="match.sharedTraits" :trait-lookup="traitLookup" />
                    </div>
                </div>

                <!-- Heroes with Missing Trait 3 Data -->
                <div v-if="missingTrait3Matches.length > 0" class="mt-8">
                    <button @click="showMissingTrait3 = !showMissingTrait3"
                        class="w-full flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
                        <div class="h-1 w-1 rounded-full bg-slate-500"></div>
                        <h3 class="text-xl font-bold text-slate-400">
                            Heroes with Missing Trait Data
                        </h3>
                        <span class="px-2 py-1 bg-slate-700/40 rounded text-xs text-slate-400 font-semibold">
                            {{ missingTrait3Matches.length }}
                        </span>
                        <ChevronRight :class="{ 'rotate-90': showMissingTrait3 }"
                            class="w-5 h-5 text-slate-400 transition-transform" />
                        <div class="h-1 flex-1 bg-gradient-to-r from-slate-500/20 to-transparent rounded-full"></div>
                    </button>
                    <div v-if="showMissingTrait3" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <HeroCard v-for="match in missingTrait3Matches" :key="match.hero.id" :hero="match.hero"
                            :shared-traits="match.sharedTraits" :trait-lookup="traitLookup" />
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="selectedHero && matchingHeroes.length === 0" class="text-center py-16 relative z-0">
                <div class="inline-flex items-center justify-center w-20 h-20 bg-slate-900/50 rounded-full mb-4">
                    <AlertCircle class="w-10 h-10 text-slate-500" />
                </div>
                <h3 class="text-xl font-semibold text-slate-300 mb-2">No Perfect Matches Found</h3>
                <p class="text-slate-400">This hero doesn't have any Legendary or Mythic heroes with all 4 matching
                    traits.</p>
            </div>

            <!-- Initial State - Traits Library -->
            <div v-else class="relative z-0">
                <div class="flex items-center gap-3 mb-6">
                    <Award class="w-6 h-6 text-cyan-400" />
                    <h2 class="text-2xl md:text-3xl font-bold text-white">
                        Traits Library
                    </h2>
                    <span class="px-3 py-1 bg-cyan-500/20 rounded-lg text-cyan-300 font-semibold">
                        {{ heroData.traits.length }}
                    </span>
                </div>
                <p class="text-slate-400 mb-6">Browse all available hero traits and their maximum level bonuses. Search
                    for a hero above to find perfect trait matches.</p>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="trait in heroData.traits" :key="trait.id"
                        class="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-blue-500/30 p-5 hover:border-cyan-500/50 transition-all duration-300">
                        <div class="flex items-start justify-between mb-3">
                            <h3 class="text-lg font-bold text-white">{{ trait.name || trait.description }}</h3>
                            <Award class="w-5 h-5 text-cyan-400 flex-shrink-0 ml-2" />
                        </div>

                        <p v-if="trait.name !== trait.description" class="text-slate-300 text-sm mb-4">{{
                            trait.description }}</p>

                        <div class="space-y-2">
                            <div class="border-t border-slate-700/50 pt-3">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm text-slate-400">Per Level:</span>
                                    <span class="text-white font-bold">{{ getTraitPerLevel(trait) }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-slate-400">Max Level {{ trait.max_level }}:</span>
                                    <span class="text-cyan-300 font-bold">{{ getTraitMaxLevel(trait) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, ChevronRight, Users, Award, Shuffle, AlertCircle, Sparkles } from 'lucide-vue-next'
import HeroCard from '@/components/topheroes/HeroCard2.vue'
import heroData from '@/data/TopHeroes.json'

const searchQuery = ref('')
const showDropdown = ref(false)
const selectedHero = ref(null)
const showMissingTrait3 = ref(false)

// Process hero data - filter to Legendary and Mythic only
const eligibleHeroes = computed(() => {
    return heroData.heroes.filter(h => h.rarity === 'legendary' || h.rarity === 'mythic')
})

// Create trait lookup map
const traitLookup = computed(() => {
    const lookup = {}
    heroData.traits.forEach(trait => {
        lookup[trait.id] = trait.name || trait.description
    })
    return lookup
})

// Filter heroes based on search
const filteredHeroes = computed(() => {
    if (!searchQuery.value) return eligibleHeroes.value

    const query = searchQuery.value.toLowerCase()
    return eligibleHeroes.value.filter(h =>
        h.name.toLowerCase().includes(query)
    )
})

// Find matching heroes - must have ALL 4 traits matching perfectly
const matchingHeroes = computed(() => {
    if (!selectedHero.value) return []

    const matches = []
    const targetTraits = selectedHero.value.traits

    eligibleHeroes.value.forEach(hero => {
        if (hero.id === selectedHero.value.id) return // Skip self

        // Check if all 4 traits match exactly (including position)
        const trait1Match = targetTraits['1'] === hero.traits['1']
        const trait2Match = targetTraits['2'] === hero.traits['2']
        const trait3Match = targetTraits['3'] === hero.traits['3']
        const trait4Match = targetTraits['4'] === hero.traits['4']

        // All 4 traits must match perfectly
        if (trait1Match && trait2Match && trait3Match && trait4Match) {
            matches.push({
                hero,
                sharedTraits: Object.values(targetTraits).filter(t => t), // All traits are shared
                sharedCount: 4
            })
        }
    })

    return matches
})

// Group by rarity - only complete data (has trait 3)
const mythicMatches = computed(() => {
    return matchingHeroes.value.filter(m => m.hero.rarity === 'mythic' && m.hero.traits['3'])
})

const legendaryMatches = computed(() => {
    return matchingHeroes.value.filter(m => m.hero.rarity === 'legendary' && m.hero.traits['3'])
})

// Heroes missing trait 3 data
const missingTrait3Matches = computed(() => {
    return matchingHeroes.value.filter(m => !m.hero.traits['3'])
})

// Helper functions
const selectHero = (hero) => {
    selectedHero.value = hero
    searchQuery.value = hero.name
    showDropdown.value = false
}

const handleBlur = () => {
    setTimeout(() => {
        showDropdown.value = false
    }, 200)
}

const getTraitName = (traitId) => {
    return traitLookup.value[traitId]
}

const getRarityBadgeClass = (rarity) => {
    if (rarity === 'mythic') {
        return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
    }
    return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
}

const getFactionBadgeClass = (faction) => {
    switch (faction) {
        case 'horde':
            return 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
        case 'league':
            return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
        case 'nature':
            return 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
        default:
            return 'bg-slate-700/50 text-slate-300'
    }
}

const getFactionCardClass = (faction) => {
    switch (faction) {
        case 'horde':
            return 'bg-gradient-to-r from-red-900/40 to-rose-900/40 border border-red-500/40'
        case 'league':
            return 'bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/40'
        case 'nature':
            return 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/40'
        default:
            return 'bg-slate-900/40 border border-slate-500/40'
    }
}

const getFactionIconBgClass = (faction) => {
    switch (faction) {
        case 'horde':
            return 'bg-red-500/20'
        case 'league':
            return 'bg-blue-500/20'
        case 'nature':
            return 'bg-green-500/20'
        default:
            return 'bg-cyan-500/20'
    }
}

const getFactionIconClass = (faction) => {
    switch (faction) {
        case 'horde':
            return 'text-red-300'
        case 'league':
            return 'text-blue-300'
        case 'nature':
            return 'text-green-300'
        default:
            return 'text-cyan-300'
    }
}

const formatTag = (tag) => {
    return tag.replace(/_/g, ' ')
}

const getHighestRarityIncrease = (trait) => {
    // Prefer mythic if it's not 0%, otherwise use legendary
    if (trait.increase.mythic && trait.increase.mythic !== '0%') {
        return trait.increase.mythic
    }
    return trait.increase.legendary || '0%'
}

const getTraitPerLevel = (trait) => {
    return getHighestRarityIncrease(trait)
}

const getTraitMaxLevel = (trait) => {
    const increase = getHighestRarityIncrease(trait)
    const maxLevel = parseInt(trait.max_level)

    // Check if it's a percentage
    if (increase.includes('%')) {
        const baseValue = parseFloat(increase.replace('%', ''))
        const maxValue = Math.round(baseValue * maxLevel)
        return `${maxValue}%`
    } else {
        // It's a raw number (like "12,000")
        const baseValue = parseFloat(increase.replace(/,/g, ''))
        const maxValue = Math.round(baseValue * maxLevel)
        // Format with commas
        return maxValue.toLocaleString()
    }
}
</script>

<style scoped>
/* Custom scrollbar for dropdown */
.overflow-y-auto::-webkit-scrollbar {
    width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(34, 211, 238, 0.4);
    border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(34, 211, 238, 0.6);
}
</style>