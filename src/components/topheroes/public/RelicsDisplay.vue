<!-- components/topheroes/public/RelicsDisplay.vue -->
<template>
    <div class="grid grid-cols-3 gap-3">
        <div v-for="slot in ['slot1', 'slot2', 'slot3']" :key="slot" 
            class="relative h-24 border-2 rounded-lg overflow-hidden transition-all duration-200"
            :class="getSlotClass(slot)">
            
            <!-- Filled Slot -->
            <div v-if="getRelicForSlot(slot)" class="h-full p-3 flex flex-col gap-2">
                <!-- Slot Number Badge -->
                <div class="absolute top-1 left-1">
                    <div class="h-5 w-5 rounded-full bg-velaris-purple flex items-center justify-center text-white text-xs font-bold">
                        {{ slot.replace('slot', '') }}
                    </div>
                </div>

                <div class="flex-1 flex flex-col justify-center items-center text-center">
                    <div class="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold mb-2"
                        :class="getRarityGradient(getRelicForSlot(slot).rarity)">
                        {{ getRelicForSlot(slot).name.charAt(0) }}
                    </div>
                    <p class="font-medium text-xs truncate w-full px-1" :title="getRelicForSlot(slot).name">
                        {{ getRelicForSlot(slot).name }}
                    </p>
                    <p class="text-xs text-foreground/60 capitalize">
                        {{ getRelicForSlot(slot).type }}
                    </p>
                </div>
            </div>

            <!-- Empty Slot -->
            <div v-else class="h-full p-2 flex flex-col items-center justify-center">
                <div class="h-6 w-6 rounded-full bg-foreground/20 flex items-center justify-center text-foreground/60 text-xs font-bold mb-2">
                    {{ slot.replace('slot', '') }}
                </div>
                <Gem class="h-6 w-6 text-foreground/30 mb-1" />
                <span class="text-xs text-foreground/50">Empty</span>
            </div>
        </div>
    </div>

    <!-- Empty State -->
    <div v-if="!hasAnyRelics" class="text-center py-8 text-foreground/60 bg-foreground/5 rounded-lg">
        <Gem class="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p class="text-sm">No relics equipped</p>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Gem } from 'lucide-vue-next'

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

const getRelicForSlot = (slot) => {
    if (!props.queue?.relics?.[slot]) return null
    return props.store.getRelicById(props.queue.relics[slot])
}

const hasAnyRelics = computed(() => {
    return getRelicForSlot('slot1') || getRelicForSlot('slot2') || getRelicForSlot('slot3')
})

const getSlotClass = (slot) => {
    const relic = getRelicForSlot(slot)
    
    if (!relic) {
        return 'border-dashed border-border/50 bg-foreground/5'
    }

    const classes = {
        damage: 'border-solid border-red-500/40 bg-red-500/5',
        defense: 'border-solid border-blue-500/40 bg-blue-500/5',
        utility: 'border-solid border-green-500/40 bg-green-500/5'
    }
    
    return classes[relic.type] || 'border-solid border-border/30'
}

const getRarityGradient = (rarity) => {
    const gradients = {
        mythic: 'bg-gradient-to-br from-red-500 to-red-600',
        legendary: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
        epic: 'bg-gradient-to-br from-purple-500 to-purple-600',
        rare: 'bg-gradient-to-br from-blue-500 to-blue-600'
    }
    return gradients[rarity] || 'bg-gradient-to-br from-slate-500 to-slate-600'
}
</script>