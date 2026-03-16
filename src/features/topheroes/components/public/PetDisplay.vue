<!-- components/topheroes/public/PetDisplay.vue -->
<template>
    <div class="h-24 border-2 rounded-lg overflow-hidden transition-all duration-200"
        :class="pet ? 'border-solid border-pink-500/40 bg-pink-500/5' : 'border-dashed border-border/50 bg-foreground/5'">
        
        <!-- Filled Slot -->
        <div v-if="pet" class="h-full p-3 flex flex-col justify-center items-center text-center">
            <div class="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold mb-2"
                :class="getRarityGradient(pet.rarity)">
                <Dog class="h-5 w-5" />
            </div>
            <p class="font-medium text-xs truncate w-full px-1" :title="pet.name">
                {{ pet.name }}
            </p>
            <p class="text-xs text-foreground/60 capitalize">
                {{ getFactionName(pet.faction) }}
            </p>
        </div>

        <!-- Empty Slot -->
        <div v-else class="h-full p-2 flex flex-col items-center justify-center">
            <Dog class="h-6 w-6 text-foreground/30 mb-1" />
            <span class="text-xs text-foreground/50">No Pet</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Dog } from 'lucide-vue-next'

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

const pet = computed(() => {
    if (!props.queue?.pet) return null
    return props.store.getPetById(props.queue.pet)
})

const getRarityGradient = (rarity) => {
    const gradients = {
        legendary: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
        epic: 'bg-gradient-to-br from-purple-500 to-purple-600',
        rare: 'bg-gradient-to-br from-blue-500 to-blue-600',
        uncommon: 'bg-gradient-to-br from-green-500 to-green-600'
    }
    return gradients[rarity] || 'bg-gradient-to-br from-slate-500 to-slate-600'
}

const getFactionName = (factionId) => {
    if (factionId === 'all') return 'All Factions'
    const faction = props.store.getFactionById(factionId)
    return faction?.name || factionId
}
</script>