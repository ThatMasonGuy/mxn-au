<!-- components/topheroes/public/GearSetupDisplay.vue -->
<template>
    <div class="bg-card border border-border rounded-xl p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <Crown class="h-5 w-5 text-velaris-amber" />
            Gear Sets
        </h3>

        <div v-if="hasAnyGear" class="space-y-3">
            <!-- Gear Set Summary -->
            <div v-for="gearSet in uniqueGearSets" :key="gearSet.id"
                class="p-3 bg-gradient-to-br from-velaris-amber/10 to-velaris-amber/5 border border-velaris-amber/20 rounded-lg">

                <!-- Gear Set Header -->
                <div class="flex items-center gap-2 mb-2">
                    <div class="h-8 w-8 rounded-lg flex items-center justify-center"
                        :class="getGearSetColor(gearSet.id)">
                        <component :is="getGearSetIcon(gearSet.id)" class="h-4 w-4 text-white" />
                    </div>
                    <div class="flex-1">
                        <h4 class="font-semibold text-sm">{{ gearSet.name }}</h4>
                        <p class="text-xs text-foreground/60">
                            {{ gearSet.heroCount }} hero{{ gearSet.heroCount > 1 ? 'es' : '' }}
                        </p>
                    </div>
                </div>

                <!-- Gear Description -->
                <div v-if="gearSet.gearData?.description" class="text-xs text-foreground/60 italic mb-2">
                    {{ gearSet.gearData.description }}
                </div>

                <!-- Gear Levels/Tiers -->
                <div v-if="gearSet.gearData?.levels" class="mt-2 pt-2 border-t border-border/30 space-y-2">
                    <div v-for="level in gearSet.gearData.levels" :key="level.tier" class="p-2 rounded border"
                        :class="getGearTierClasses(gearSet.id)">
                        <div class="font-medium text-xs mb-1" :class="getGearTierTextClass(gearSet.id)">
                            {{ level.name }}
                        </div>
                        <div v-for="stat in level.stats" :key="stat"
                            class="flex items-center gap-1 text-xs text-foreground/70">
                            <Zap class="h-2.5 w-2.5 flex-shrink-0" :class="getGearTierIconClass(gearSet.id)" />
                            <span>{{ stat }}</span>
                        </div>
                    </div>
                </div>

                <!-- Heroes List -->
                <div class="mt-2 pt-2 border-t border-border/30">
                    <p class="text-xs text-foreground/60 mb-1">Equipped on:</p>
                    <div class="flex flex-wrap gap-1">
                        <div v-for="heroName in gearSet.heroes" :key="heroName"
                            class="px-1.5 py-0.5 text-xs rounded bg-foreground/10 text-foreground/70">
                            {{ heroName }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- No Gear Configured -->
        <div v-else class="text-center py-6">
            <Crown class="h-8 w-8 mx-auto mb-2 text-foreground/30" />
            <p class="text-xs text-foreground/60">No gear configured</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Crown, Zap, Sword, Shield } from 'lucide-vue-next'

const props = defineProps({
    queue: {
        type: Object,
        required: true
    },
    store: {
        type: Object,
        required: true
    }
})

// Computed
const gearByHero = computed(() => {
    if (!props.queue.gearData) return {}

    const result = {}

    Object.entries(props.queue.gearData).forEach(([heroId, gearData]) => {
        const hero = props.store.getHeroById(heroId)
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
            // Get gear data from store
            const gearData = props.store.getGearById(gear.gearSet)

            gearSets[gear.gearSet] = {
                id: gear.gearSet,
                name: gear.gearSetName || gearData?.name || 'Unknown Gear',
                heroCount: 0,
                heroes: [],
                gearData: gearData
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
        'titans_might': 'bg-gradient-to-br from-red-500 to-red-600',
        'fury_of_blood': 'bg-gradient-to-br from-amber-500 to-amber-600',
        'glory_of_knight': 'bg-gradient-to-br from-purple-500 to-purple-600'
    }
    return colors[gearSet] || 'bg-gradient-to-br from-velaris-amber to-yellow-600'
}

const getGearSetIcon = (gearSet) => {
    const icons = {
        'titans_might': Sword,
        'fury_of_blood': Shield,
        'glory_of_knight': Zap
    }
    return icons[gearSet] || Crown
}

const getGearTierClasses = (gearSet) => {
    const classes = {
        'titans_might': 'bg-red-500/5 border-red-500/10',
        'fury_of_blood': 'bg-amber-500/5 border-amber-500/10',
        'glory_of_knight': 'bg-purple-500/5 border-purple-500/10'
    }
    return classes[gearSet] || 'bg-velaris-amber/5 border-velaris-amber/10'
}

const getGearTierTextClass = (gearSet) => {
    const classes = {
        'titans_might': 'text-red-400',
        'fury_of_blood': 'text-amber-400',
        'glory_of_knight': 'text-purple-400'
    }
    return classes[gearSet] || 'text-velaris-amber'
}

const getGearTierIconClass = (gearSet) => {
    const classes = {
        'titans_might': 'text-red-400',
        'fury_of_blood': 'text-amber-400',
        'glory_of_knight': 'text-purple-400'
    }
    return classes[gearSet] || 'text-velaris-amber'
}
</script>