<!-- components/topheroes/TeamBuilder.vue -->
<template>
    <div class="space-y-6">
        <!-- Team Stats -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div class="elev-card p-4">
                <div class="flex items-center gap-3">
                    <div class="h-10 w-10 bg-velaris-purple/15 rounded-lg flex items-center justify-center">
                        <Users class="h-5 w-5 text-velaris-purple" />
                    </div>
                    <div>
                        <p class="text-sm text-foreground/60">Team Size</p>
                        <p class="text-xl font-semibold">{{ teamHeroCount }}/6</p>
                    </div>
                </div>
            </div>
            <div class="elev-card p-4">
                <div class="flex items-center gap-3">
                    <div class="h-10 w-10 bg-velaris-teal/15 rounded-lg flex items-center justify-center">
                        <Zap class="h-5 w-5 text-velaris-teal" />
                    </div>
                    <div>
                        <p class="text-sm text-foreground/60">Active Bonds</p>
                        <p class="text-xl font-semibold">{{ activeBonds.length }}</p>
                    </div>
                </div>
            </div>
            <div class="elev-card p-4">
                <div class="flex items-center gap-3">
                    <div class="h-10 w-10 bg-velaris-green/15 rounded-lg flex items-center justify-center">
                        <TrendingUp class="h-5 w-5 text-velaris-green" />
                    </div>
                    <div>
                        <p class="text-sm text-foreground/60">Faction Bonus</p>
                        <p class="text-xl font-semibold">{{ factionBonus }}%</p>
                    </div>
                </div>
            </div>
            <div class="elev-card p-4">
                <div class="flex items-center gap-3">
                    <div class="h-10 w-10 bg-velaris-amber/15 rounded-lg flex items-center justify-center">
                        <Sword class="h-5 w-5 text-velaris-amber" />
                    </div>
                    <div>
                        <p class="text-sm text-foreground/60">Team Power</p>
                        <p class="text-xl font-semibold">{{ teamPower }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Team Formation Grid -->
        <div class="elev-card p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold flex items-center gap-2">
                    <Users class="h-5 w-5 text-velaris-purple" />
                    Team Formation
                </h3>
                <div class="flex gap-2">
                    <button @click="clearTeam" v-if="teamHeroCount > 0" class="btn-soft-red text-sm px-3 py-2">
                        <RotateCcw class="h-4 w-4 mr-1" />
                        Clear All
                    </button>
                    <button @click="randomizeTeam" v-if="availableHeroes.length >= 6"
                        class="btn-soft-violet text-sm px-3 py-2">
                        <Shuffle class="h-4 w-4 mr-1" />
                        Random Team
                    </button>
                </div>
            </div>

            <div class="grid gap-4">
                <!-- Back Row -->
                <div class="space-y-2">
                    <h4 class="text-sm font-medium text-foreground/70 flex items-center gap-2">
                        <Shield class="h-4 w-4" />
                        Back Row
                    </h4>
                    <div class="grid grid-cols-2 gap-4">
                        <TeamSlot v-for="position in ['back1', 'back2']" :key="position" :position="position"
                            :hero="currentTeam[position]" :position-name="`Back ${position === 'back1' ? '1' : '2'}`"
                            @drop="onDrop" @remove="removeHero" @gear="openGear" />
                    </div>
                </div>

                <!-- Mid Row -->
                <div class="space-y-2">
                    <h4 class="text-sm font-medium text-foreground/70 flex items-center gap-2">
                        <Swords class="h-4 w-4" />
                        Mid Row
                    </h4>
                    <div class="grid grid-cols-2 gap-4">
                        <TeamSlot v-for="position in ['mid1', 'mid2']" :key="position" :position="position"
                            :hero="currentTeam[position]" :position-name="`Mid ${position === 'mid1' ? '1' : '2'}`"
                            @drop="onDrop" @remove="removeHero" @gear="openGear" />
                    </div>
                </div>

                <!-- Front Row -->
                <div class="space-y-2">
                    <h4 class="text-sm font-medium text-foreground/70 flex items-center gap-2">
                        <Sword class="h-4 w-4" />
                        Front Row
                    </h4>
                    <div class="grid grid-cols-2 gap-4">
                        <TeamSlot v-for="position in ['front1', 'front2']" :key="position" :position="position"
                            :hero="currentTeam[position]" :position-name="`Front ${position === 'front1' ? '1' : '2'}`"
                            @drop="onDrop" @remove="removeHero" @gear="openGear" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Available Heroes -->
        <div class="elev-card p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold flex items-center gap-2">
                    <Library class="h-5 w-5 text-velaris-purple" />
                    Available Heroes
                </h3>
                <div class="flex items-center gap-2 text-sm text-foreground/60">
                    <span>{{ availableHeroes.length }} available</span>
                </div>
            </div>

            <div v-if="availableHeroes.length > 0"
                class="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 max-h-64 overflow-y-auto">
                <HeroMiniCard v-for="hero in availableHeroes" :key="hero.id" :hero="hero" @click="addHeroToTeam(hero)"
                    @dragstart="onDragStart($event, hero)" />
            </div>

            <div v-else class="text-center py-8 text-foreground/60">
                <Library class="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p class="text-sm">All heroes are assigned to the team</p>
            </div>
        </div>

        <!-- Team Analysis -->
        <div v-if="teamHeroCount > 0" class="space-y-4">
            <!-- Active Bonds -->
            <div v-if="activeBonds.length > 0" class="elev-card p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap class="h-5 w-5 text-velaris-teal" />
                    Active Bonds
                </h3>
                <div class="grid gap-3 md:grid-cols-2">
                    <div v-for="bond in activeBonds" :key="bond.id"
                        class="p-4 bg-velaris-teal/10 border border-velaris-teal/20 rounded-lg">
                        <div class="flex items-center gap-2 mb-2">
                            <Zap class="h-4 w-4 text-velaris-teal" />
                            <span class="font-medium text-velaris-teal">Bond Active</span>
                        </div>
                        <p class="text-sm text-foreground/70 mb-2">{{ bond.heroes.join(', ') }}</p>
                        <div class="text-xs text-velaris-teal font-medium">
                            {{ formatBondBuffs(bond.buffs) }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Team Recommendations -->
            <div v-if="recommendations.length > 0" class="elev-card p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb class="h-5 w-5 text-velaris-amber" />
                    Recommendations
                </h3>
                <div class="grid gap-3 md:grid-cols-2">
                    <div v-for="rec in recommendations" :key="rec.id"
                        class="p-4 bg-velaris-amber/10 border border-velaris-amber/20 rounded-lg">
                        <div class="flex items-center gap-2 mb-2">
                            <Lightbulb class="h-4 w-4 text-velaris-amber" />
                            <span class="font-medium text-velaris-amber">{{ rec.type }}</span>
                        </div>
                        <p class="text-sm text-foreground/70 mb-2">{{ rec.description }}</p>
                        <div class="text-xs text-velaris-amber font-medium">{{ rec.benefit }}</div>
                    </div>
                </div>
            </div>

            <!-- Faction Distribution -->
            <div class="elev-card p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <PieChart class="h-5 w-5 text-velaris-purple" />
                    Team Composition
                </h3>
                <div class="space-y-3">
                    <div v-for="(count, faction) in factionDistribution" :key="faction" v-show="count > 0"
                        class="flex items-center justify-between p-3 rounded-lg" :class="getFactionBgClass(faction)">
                        <div class="flex items-center gap-3">
                            <component :is="getFactionIcon(faction)" class="h-5 w-5"
                                :class="getFactionColor(faction)" />
                            <span class="font-medium" :class="getFactionColor(faction)">
                                {{ getFactionName(faction) }}
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="font-bold" :class="getFactionColor(faction)">{{ count }}</span>
                            <div class="w-16 h-2 bg-background rounded-full overflow-hidden">
                                <div class="h-full transition-all duration-300" :class="getFactionGradient(faction)"
                                    :style="{ width: (count / 6) * 100 + '%' }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import {
    Users, Zap, TrendingUp, Sword, Shield, Swords, Library,
    RotateCcw, Shuffle, Lightbulb, PieChart, Flame, Leaf
} from 'lucide-vue-next'
import TeamSlot from './TeamSlot.vue'
import HeroMiniCard from './HeroMiniCard.vue'

const props = defineProps({
    currentTeam: {
        type: Object,
        required: true
    },
    availableHeroes: {
        type: Array,
        required: true
    },
    store: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update-team', 'open-gear-modal'])

// Computed properties
const teamHeroes = computed(() => {
    return Object.values(props.currentTeam).filter(Boolean)
})

const teamHeroCount = computed(() => {
    return teamHeroes.value.length
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

const activeBonds = computed(() => {
    const teamHeroNames = teamHeroes.value.map(hero => hero.name)
    return props.store.bonds.filter(bond => {
        return bond.heroes.every(heroName => teamHeroNames.includes(heroName))
    })
})

const factionBonus = computed(() => {
    const maxCount = Math.max(...Object.values(factionDistribution.value), 0)
    if (maxCount >= 4) return 35
    if (maxCount >= 3) return 25
    if (maxCount >= 2) return 15
    return 0
})

const teamPower = computed(() => {
    const rarityPower = { MY: 1000, LE: 750, EP: 500, RA: 250 }
    return teamHeroes.value.reduce((total, hero) => {
        return total + (rarityPower[hero.rarity] || 0)
    }, 0)
})

const recommendations = computed(() => {
    const recs = []

    if (teamHeroCount.value < 6) {
        recs.push({
            id: 'incomplete',
            type: 'Team Incomplete',
            description: `Add ${6 - teamHeroCount.value} more heroes to complete your team`,
            benefit: 'Full team provides maximum synergy potential'
        })
    }

    const tanks = teamHeroes.value.filter(hero => hero.tags?.includes('T'))
    if (tanks.length < 2) {
        recs.push({
            id: 'tanks',
            type: 'Need Tanks',
            description: 'Consider adding more tank heroes for front line protection',
            benefit: 'Tanks reduce damage taken and protect damage dealers'
        })
    }

    const healers = teamHeroes.value.filter(hero => hero.tags?.includes('HE'))
    if (healers.length === 0) {
        recs.push({
            id: 'healers',
            type: 'No Healers',
            description: 'Consider adding a healer for sustainability',
            benefit: 'Healers provide recovery and extended battle duration'
        })
    }

    return recs
})

// Helper functions
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

const getFactionName = (faction) => {
    const factionData = props.store.getFactionById(faction)
    return factionData ? factionData.name : faction
}

const getFactionBgClass = (faction) => {
    const classes = {
        nature: 'bg-nature-green/10 border border-nature-green/20',
        horde: 'bg-horde-red/10 border border-horde-red/20',
        league: 'bg-league-blue/10 border border-league-blue/20'
    }
    return classes[faction] || 'bg-foreground/10'
}

const getFactionGradient = (faction) => {
    const gradients = {
        nature: 'bg-gradient-to-r from-nature-green to-emerald-600',
        horde: 'bg-gradient-to-r from-horde-red to-red-600',
        league: 'bg-gradient-to-r from-league-blue to-blue-600'
    }
    return gradients[faction] || 'bg-gradient-to-r from-velaris-purple to-velaris-teal'
}

const formatBondBuffs = (buffs) => {
    return buffs.map(buff => `+${buff.value}% ${buff.stat.toUpperCase()}`).join(', ')
}

// Event handlers
const addHeroToTeam = (hero) => {
    const positions = ['front1', 'front2', 'mid1', 'mid2', 'back1', 'back2']
    for (const position of positions) {
        if (!props.currentTeam[position]) {
            const newTeam = { ...props.currentTeam }
            newTeam[position] = hero
            emit('update-team', newTeam)
            break
        }
    }
}

const removeHero = (position) => {
    const newTeam = { ...props.currentTeam }
    newTeam[position] = null
    emit('update-team', newTeam)
}

const clearTeam = () => {
    const newTeam = {
        front1: null,
        front2: null,
        mid1: null,
        mid2: null,
        back1: null,
        back2: null
    }
    emit('update-team', newTeam)
}

const randomizeTeam = () => {
    const shuffled = [...props.availableHeroes].sort(() => Math.random() - 0.5)
    const newTeam = {
        front1: shuffled[0] || null,
        front2: shuffled[1] || null,
        mid1: shuffled[2] || null,
        mid2: shuffled[3] || null,
        back1: shuffled[4] || null,
        back2: shuffled[5] || null
    }
    emit('update-team', newTeam)
}

const onDrop = (event, position) => {
    event.preventDefault()
    const dragData = JSON.parse(event.dataTransfer.getData('text/plain'))

    if (dragData.type === 'hero') {
        const newTeam = { ...props.currentTeam }
        newTeam[position] = dragData.data
        emit('update-team', newTeam)
    } else if (dragData.type === 'team-hero') {
        const sourcePosition = dragData.position
        const sourceHero = dragData.data
        const targetHero = props.currentTeam[position]

        const newTeam = { ...props.currentTeam }
        newTeam[position] = sourceHero
        newTeam[sourcePosition] = targetHero || null
        emit('update-team', newTeam)
    }
}

const onDragStart = (event, hero) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'hero', data: hero }))
}

const openGear = (position) => {
    emit('open-gear-modal', position)
}
</script>

<style scoped>
.elev-card {
    @apply bg-card border border-border rounded-xl shadow-sm;
}

.btn-soft-violet {
    @apply bg-velaris-purple/10 text-velaris-purple border border-velaris-purple/30 hover:bg-velaris-purple/20 transition-all duration-200 font-medium rounded-xl;
}

.btn-soft-red {
    @apply bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all duration-200 font-medium rounded-xl;
}
</style>