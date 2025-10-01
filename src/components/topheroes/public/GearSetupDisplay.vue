<!-- components/topheroes/public/GearSetupDisplay.vue -->
<template>
    <div v-if="hasAnyGear" class="space-y-4">
        <!-- Gear Sets Summary -->
        <div v-for="gearSet in uniqueGearSets" :key="gearSet.id"
            class="p-4 bg-gradient-to-br from-velaris-amber/10 to-velaris-amber/5 border border-velaris-amber/20 rounded-lg">

            <!-- Gear Set Header -->
            <div class="flex items-center gap-3 mb-4">
                <div class="h-12 w-12 rounded-full flex items-center justify-center"
                    :class="getGearSetColor(gearSet.id)">
                    <component :is="getGearSetIcon(gearSet.id)" class="h-6 w-6 text-white" />
                </div>
                <div>
                    <h4 class="font-semibold">{{ gearSet.name }}</h4>
                    <p class="text-xs text-foreground/60">{{ gearSet.heroCount }} hero{{ gearSet.heroCount > 1 ? 'es' :
                        '' }} equipped</p>
                </div>
            </div>

            <!-- Tier Bonuses -->
            <div class="space-y-2">
                <div v-for="tier in [2, 4, 6]" :key="tier" :class="[
                    'p-3 rounded-lg border transition-all duration-200',
                    gearSet.heroCount >= tier
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-foreground/5 border-border/50 opacity-50'
                ]">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-semibold"
                            :class="gearSet.heroCount >= tier ? 'text-emerald-400' : 'text-foreground/60'">
                            {{ tier }}-Piece Set Bonus
                        </span>
                        <span v-if="gearSet.heroCount >= tier"
                            class="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                            Active
                        </span>
                        <span v-else class="text-xs text-foreground/40">
                            {{ gearSet.heroCount }}/{{ tier }}
                        </span>
                    </div>
                    <div class="text-xs"
                        :class="gearSet.heroCount >= tier ? 'text-foreground/80' : 'text-foreground/40'">
                        {{ getGearSetBonus(gearSet.id, tier) }}
                    </div>
                </div>
            </div>

            <!-- Heroes with this gear -->
            <div class="mt-4 pt-3 border-t border-border/30">
                <p class="text-xs text-foreground/60 mb-2">Equipped on:</p>
                <div class="flex flex-wrap gap-2">
                    <div v-for="heroName in gearSet.heroes" :key="heroName"
                        class="px-2 py-1 text-xs rounded-lg bg-foreground/10 text-foreground/70 font-medium">
                        {{ heroName }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- No Gear Configured -->
    <div v-else class="text-center py-8">
        <Settings class="h-12 w-12 mx-auto mb-3 text-foreground/30" />
        <p class="text-sm text-foreground/60">No gear configured for this queue</p>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Settings, Zap, Crown, Sword, Shield } from 'lucide-vue-next'

const props = defineProps({
    queue: {
        type: Object,
        required: true
    },
    heroes: {
        type: Array,
        required: true
    }
})

// Gear set bonuses database
const gearSetBonuses = {
    'titans-might': {
        2: '+15% Attack Power',
        4: '+25% Attack Power, +10% Critical Hit Rate',
        6: '+40% Attack Power, +20% Critical Hit Rate, +15% Penetration'
    },
    'fury-of-blood': {
        2: '+20% Health',
        4: '+35% Health, +15% Defense',
        6: '+50% Health, +25% Defense, +20% Damage Reduction'
    },
    'glory-of-knight': {
        2: '+15% Attack Speed',
        4: '+25% Attack Speed, +10% Critical Damage',
        6: '+40% Attack Speed, +20% Critical Damage, +15% Lifesteal'
    }
}

// Computed
const gearByHero = computed(() => {
    if (!props.queue.gearData) return {}

    const result = {}

    Object.entries(props.queue.gearData).forEach(([heroId, gearData]) => {
        const hero = props.heroes.find(h => h.id === heroId)
        if (!hero) return

        const heroEntry = props.queue.heroes?.find(h => h.heroId === heroId)
        if (!heroEntry) return

        result[heroId] = {
            hero,
            position: heroEntry.position,
            gear: gearData
        }
    })

    return result
})

const uniqueGearSets = computed(() => {
    const gearSets = {}

    Object.values(gearByHero.value).forEach(({ hero, gear }) => {
        if (!gearSets[gear.gearSet]) {
            gearSets[gear.gearSet] = {
                id: gear.gearSet,
                name: gear.gearSetName,
                heroCount: 0,
                heroes: []
            }
        }
        gearSets[gear.gearSet].heroCount++
        gearSets[gear.gearSet].heroes.push(hero.name)
    })

    return Object.values(gearSets)
})

const hasAnyGear = computed(() => Object.keys(gearByHero.value).length > 0)

// Methods
const getGearSetColor = (gearSet) => {
    const colors = {
        'titans-might': 'bg-gradient-to-br from-red-500 to-red-600',
        'fury-of-blood': 'bg-gradient-to-br from-amber-500 to-amber-600',
        'glory-of-knight': 'bg-gradient-to-br from-purple-500 to-purple-600'
    }
    return colors[gearSet] || 'bg-gradient-to-br from-velaris-amber to-yellow-600'
}

const getGearSetIcon = (gearSet) => {
    const icons = {
        'titans-might': Sword,
        'fury-of-blood': Shield,
        'glory-of-knight': Zap
    }
    return icons[gearSet] || Crown
}

const getGearSetBonus = (gearSet, tier) => {
    return gearSetBonuses[gearSet]?.[tier] || `+${tier * 10}% bonus stats`
}
</script>