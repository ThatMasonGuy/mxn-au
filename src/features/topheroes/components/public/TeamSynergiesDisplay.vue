<!-- components/topheroes/public/TeamSynergiesDisplay.vue -->
<template>
    <div class="space-y-3">
        <!-- Faction Auras -->
        <div v-if="activeFactionAura"
            class="p-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
                <Shield class="h-4 w-4 text-purple-400" />
                <span class="font-medium text-purple-400">Faction Aura Active</span>
            </div>
            <p class="text-sm text-foreground/70 mb-2">
                {{ dominantFactionCount }} {{ getFactionName(dominantFaction) }} heroes
            </p>
            <div class="text-xs space-y-1">
                <div v-for="buff in activeFactionAura.buffs" :key="`${buff.stat}-${buff.value}`"
                    class="text-purple-400 font-medium">
                    +{{ buff.value }}% {{ buff.stat.toUpperCase() }} ({{ buff.applies_to }})
                </div>
                <div v-if="activeFactionAura.counter_reduction"
                    class="text-purple-400 font-medium pt-2 border-t border-purple-500/20">
                    Faction counter reduced: {{ activeFactionAura.counter_reduction.original_counter }}% →
                    {{ activeFactionAura.counter_reduction.result_counter }}%
                </div>
            </div>
        </div>

        <!-- Active Hero Bonds -->
        <div v-for="bond in activeBonds" :key="bond.id"
            class="p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
                <Zap class="h-4 w-4 text-emerald-400" />
                <span class="font-medium text-emerald-400">Hero Bond Active</span>
            </div>
            <p class="text-sm text-foreground/70 mb-2">{{ formatBondHeroes(bond.heroes) }}</p>
            <div class="text-xs text-emerald-400 font-medium">
                {{ formatBondBuffs(bond.buffs) }}
            </div>
        </div>

        <!-- No Synergies -->
        <div v-if="!hasAnySynergies" class="text-center py-8 text-foreground/60">
            <Zap class="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p class="text-sm">No active synergies</p>
            <p class="text-xs text-foreground/40 mt-1">Add 4+ heroes from the same faction for aura bonuses, or heroes
                with matching bonds</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Zap, Shield } from 'lucide-vue-next'

const props = defineProps({
    queue: {
        type: Object,
        required: true
    },
    heroes: {
        type: Array,
        required: true
    },
    bonds: {
        type: Array,
        required: true
    },
    store: {
        type: Object,
        required: true
    }
})

// Computed
const teamHeroes = computed(() => {
    if (!props.queue.heroes) return []

    return props.queue.heroes
        .map(({ heroId }) => props.heroes.find(h => h.id === heroId))
        .filter(Boolean)
})

const teamHeroIds = computed(() => {
    return teamHeroes.value.map(hero => hero.id)
})

const factionDistribution = computed(() => {
    const distribution = { nature: 0, horde: 0, league: 0 }
    teamHeroes.value.forEach(hero => {
        if (distribution.hasOwnProperty(hero.faction)) {
            distribution[hero.faction]++
        }
    })
    return distribution
})

const dominantFactionCount = computed(() => {
    return Math.max(...Object.values(factionDistribution.value))
})

const dominantFaction = computed(() => {
    const maxCount = dominantFactionCount.value
    const dominantFactions = Object.entries(factionDistribution.value)
        .filter(([faction, count]) => count === maxCount)
        .map(([faction]) => faction)

    const priorityOrder = ['league', 'nature', 'horde']
    return priorityOrder.find(f => dominantFactions.includes(f)) || dominantFactions[0]
})

// Faction aura calculation
const activeFactionAura = computed(() => {
    const dominantFactionHeroes = teamHeroes.value.filter(hero =>
        hero.faction === dominantFaction.value &&
        (hero.rarity === 'legendary' || hero.rarity === 'mythic')
    )

    if (dominantFactionHeroes.length >= 4) {
        return props.store.getFactionAuraForCount(dominantFactionHeroes.length)
    }

    return null
})

const activeBonds = computed(() => {
    if (!props.bonds || props.bonds.length === 0) return []

    const teamIds = teamHeroIds.value

    // Get all matching bonds - bonds use 'heroes' property, not 'heroIds'
    const matchingBonds = props.bonds.filter(bond => {
        if (!bond.heroes || bond.heroes.length === 0) return false
        return bond.heroes.every(heroId => teamIds.includes(heroId))
    })

    // Filter out partial bonds (smaller bonds that are subsets of larger bonds)
    return matchingBonds.filter(bond => {
        const isPartial = matchingBonds.some(otherBond => {
            if (otherBond === bond) return false

            return otherBond.heroes.length > bond.heroes.length &&
                bond.heroes.every(heroId => otherBond.heroes.includes(heroId))
        })

        return !isPartial
    })
})

const hasAnySynergies = computed(() => {
    return activeFactionAura.value !== null || activeBonds.value.length > 0
})

// Methods
const formatBondBuffs = (buffs) => {
    if (!buffs || buffs.length === 0) return ''

    return buffs.map(buff => {
        const statName = buff.stat ? buff.stat.toUpperCase() : 'STAT'
        const value = buff.value || 0
        const type = buff.type || 'percent'

        if (type === 'percent') {
            return `+${value}% ${statName}`
        } else {
            return `+${value} ${statName}`
        }
    }).join(', ')
}

const formatBondHeroes = (heroIds) => {
    if (!heroIds || heroIds.length === 0) return ''

    return heroIds.map(id => {
        const hero = props.heroes.find(h => h.id === id)
        return hero?.name || id
    }).join(', ')
}

const getFactionName = (faction) => {
    const factionData = props.store.getFactionById(faction)
    return factionData?.name || faction
}
</script>