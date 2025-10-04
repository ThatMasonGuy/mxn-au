<!-- components/topheroes/PetSlot.vue -->
<template>
    <div class="h-24 border-2 border-dashed border-border/50 rounded-lg transition-all duration-200 relative overflow-hidden"
        :class="{
            'border-solid border-border/30': pet,
            'hover:border-velaris-purple/30': !pet
        }">

        <!-- Filled Slot -->
        <div v-if="pet"
            class="h-full p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 bg-card/50 backdrop-blur-sm flex flex-col gap-2 hover:shadow-lg"
            :class="petFactionClass">

            <div class="flex-1 flex flex-col justify-center items-center text-center">
                <div class="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold mb-2"
                    :class="rarityGradient">
                    {{ pet.name.charAt(0) }}
                </div>
                <p class="font-medium text-xs truncate w-full px-1" :title="pet.name">{{ pet.name }}</p>
                <p v-if="pet.faction !== 'all'" class="text-xs text-foreground/60 capitalize">
                    {{ store.getFactionById(pet.faction)?.name || pet.faction }}
                </p>
            </div>

            <!-- Remove Button -->
            <button @click.stop="$emit('remove')"
                class="absolute top-1 right-1 p-1 rounded hover:bg-red-500/20 text-foreground/60 hover:text-red-400 transition-colors">
                <X class="h-3 w-3" />
            </button>

            <!-- Edit/Change Button -->
            <button @click="$emit('select')"
                class="w-full py-1 rounded bg-foreground/10 hover:bg-foreground/20 transition-colors text-xs">
                Change
            </button>
        </div>

        <!-- Empty Slot -->
        <button v-else @click="$emit('select')"
            class="h-full w-full p-2 flex flex-col items-center justify-center text-center transition-all duration-200 hover:bg-velaris-purple/5">

            <Dog class="h-8 w-8 text-foreground/30 mb-2" />
            <span class="text-xs font-medium text-foreground/50">Pet</span>
            <span class="text-xs text-foreground/30">Add Pet</span>
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { X, Dog } from 'lucide-vue-next'

const props = defineProps({
    pet: {
        type: Object,
        default: null
    },
    store: {
        type: Object,
        required: true
    }
})

defineEmits(['select', 'remove'])

const petFactionClass = computed(() => {
    if (!props.pet || props.pet.faction === 'all') return 'border-border/30 bg-foreground/5'

    const classes = {
        nature: 'border-nature-green/40 bg-nature-green/5',
        horde: 'border-horde-red/40 bg-horde-red/5',
        league: 'border-league-blue/40 bg-league-blue/5'
    }
    return classes[props.pet.faction] || 'border-border/30'
})

const rarityGradient = computed(() => {
    if (!props.pet) return 'bg-gradient-to-br from-slate-500 to-slate-600'

    const gradients = {
        uncommon: 'bg-gradient-to-br from-green-500 to-green-600',
        rare: 'bg-gradient-to-br from-blue-500 to-blue-600',
        epic: 'bg-gradient-to-br from-purple-500 to-purple-600',
        legendary: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
        mythic: 'bg-gradient-to-br from-red-500 to-red-600'
    }
    return gradients[props.pet.rarity] || 'bg-gradient-to-br from-slate-500 to-slate-600'
})
</script>