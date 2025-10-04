<!-- components/topheroes/public/TeamFormationDisplay.vue -->
<template>
    <div class="space-y-4">
        <!-- Back Row -->
        <div class="space-y-2">
            <div class="flex items-center gap-2 mb-3">
                <div class="h-1 w-8 bg-red-400 rounded"></div>
                <h3 class="text-sm font-semibold text-red-400">Back Row</h3>
                <div class="h-1 flex-1 bg-red-400/30 rounded"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <HeroSlotDetail v-for="position in ['back1', 'back2']" :key="position"
                    :hero="getHeroInPosition(position)" :gear="getGearForPosition(position)" :position="position"
                    :store="store" />
            </div>
        </div>

        <!-- Mid Row -->
        <div class="space-y-2">
            <div class="flex items-center gap-2 mb-3">
                <div class="h-1 w-8 bg-amber-400 rounded"></div>
                <h3 class="text-sm font-semibold text-amber-400">Mid Row</h3>
                <div class="h-1 flex-1 bg-amber-400/30 rounded"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <HeroSlotDetail v-for="position in ['mid1', 'mid2']" :key="position" :hero="getHeroInPosition(position)"
                    :gear="getGearForPosition(position)" :position="position" :store="store" />
            </div>
        </div>

        <!-- Front Row -->
        <div class="space-y-2">
            <div class="flex items-center gap-2 mb-3">
                <div class="h-1 w-8 bg-green-400 rounded"></div>
                <h3 class="text-sm font-semibold text-green-400">Front Row</h3>
                <div class="h-1 flex-1 bg-green-400/30 rounded"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <HeroSlotDetail v-for="position in ['front1', 'front2']" :key="position"
                    :hero="getHeroInPosition(position)" :gear="getGearForPosition(position)" :position="position"
                    :store="store" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import HeroSlotDetail from './HeroSlotDetail.vue'

const props = defineProps({
    queue: {
        type: Object,
        required: true
    },
    heroes: {
        type: Array,
        required: true
    },
    store: {
        type: Object,
        required: true
    }
})

// Methods
const getHeroInPosition = (position) => {
    const heroEntry = props.queue.heroes?.find(h => h.position === position)
    if (!heroEntry) return null

    return props.heroes.find(hero => hero.id === heroEntry.heroId)
}

const getGearForPosition = (position) => {
    const heroEntry = props.queue.heroes?.find(h => h.position === position)
    if (!heroEntry) return null

    // Look up gear from gearData object using heroId
    const heroId = heroEntry.heroId
    const gearData = props.queue.gearData?.[heroId]
    return gearData?.gearSet || null
}
</script>