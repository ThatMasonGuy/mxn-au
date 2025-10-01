<!-- components/topheroes/public/TeamSynergiesDisplay.vue -->
<template>
    <div class="space-y-4">
        <!-- Faction Bonus -->
        <div v-if="factionBonus > 0"
            class="p-3 bg-gradient-to-r from-velaris-purple/20 to-velaris-teal/20 border border-velaris-purple/30 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
                <Shield class="h-4 w-4 text-velaris-purple" />
                <span class="font-semibold text-sm text-velaris-purple">Faction Bonus</span>
            </div>
            <p class="text-xs text-foreground/70 mb-2">{{ dominantFaction }} Heroes: {{ dominantFactionCount }}</p>
            <div class="text-sm font-bold text-velaris-purple">+{{ factionBonus }}% Stats</div>
        </div>

        <!-- Active Hero Bonds -->
        <div v-for="bond in activeBonds" :key="bond.id"
            class="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
                <Zap class="h-4 w-4 text-emerald-400" />
                <span class="font-semibold text-sm text-emerald-400">Hero Bond</span>
            </div>
            <p class="text-xs text-foreground/70 mb-2">{{ bond.heroes.join(', ') }}</p>
            <div class="text-xs text-emerald-400 font-semibold">
                {{ formatBondBuffs(bond.buffs) }}
            </div>
        </div>

        <!-- No Synergies -->
        <div v-if="!hasAnySynergies" class="text-center py-6">
            <Zap class="h-8 w-8 mx-auto mb-2 opacity-50 text-foreground/30" />
            <p class="text-xs text-foreground/60">No active synergies</p>
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
    const faction = priorityOrder.find(f => dominantFactions.includes(f)) || dominantFactions[0]

    // Return formatted name
    const names = {
        nature: 'Nature',
        horde: 'Horde',
        league: 'League'
    }
    return names[faction] || faction
})

const factionBonus = computed(() => {
    const maxCount = dominantFactionCount.value
    if (maxCount >= 4) return 35
    if (maxCount >= 3) return 25
    if (maxCount >= 2) return 15
    return 0
})

const activeBonds = computed(() => {
    if (!props.bonds || props.bonds.length === 0) return []

    const teamIds = teamHeroIds.value

    // Filter bonds where all heroIds are present in the team
    return props.bonds.filter(bond => {
        if (!bond.heroIds || bond.heroIds.length === 0) return false

        // Check if all heroes in the bond are in the team
        return bond.heroIds.every(heroId => teamIds.includes(heroId))
    })
})

const hasAnySynergies = computed(() => {
    return factionBonus.value > 0 || activeBonds.value.length > 0
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
</script>