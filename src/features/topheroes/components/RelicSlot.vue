<!-- components/topheroes/RelicSlot.vue -->
<template>
    <div class="h-24 border-2 border-dashed border-border/50 rounded-lg transition-all duration-200 relative overflow-hidden"
        :class="{
            'border-solid border-border/30': relic,
            'hover:border-velaris-purple/30': !relic
        }">

        <!-- Filled Slot -->
        <div v-if="relic"
            class="h-full p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 bg-card/50 backdrop-blur-sm flex flex-col gap-2 hover:shadow-lg"
            :class="relicTypeClass">

            <!-- Slot Number Badge -->
            <div class="absolute top-1 left-1">
                <div
                    class="h-5 w-5 rounded-full bg-velaris-purple flex items-center justify-center text-white text-xs font-bold">
                    {{ slotNumber }}
                </div>
            </div>

            <div class="flex-1 flex flex-col justify-center items-center text-center">
                <div class="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold mb-2"
                    :class="rarityGradient">
                    {{ relic.name.charAt(0) }}
                </div>
                <p class="font-medium text-xs truncate w-full px-1" :title="relic.name">{{ relic.name }}</p>
                <p class="text-xs text-foreground/60 capitalize">{{ relic.type }}</p>
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

            <!-- Slot Number Badge -->
            <div
                class="h-6 w-6 rounded-full bg-foreground/20 flex items-center justify-center text-foreground/60 text-xs font-bold mb-2">
                {{ slotNumber }}
            </div>

            <Gem class="h-6 w-6 text-foreground/30 mb-1" />
            <span class="text-xs font-medium text-foreground/50">Slot {{ slotNumber }}</span>
            <span class="text-xs text-foreground/30">Add Relic</span>
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { X, Gem } from 'lucide-vue-next'

const props = defineProps({
    slot: {
        type: String,
        required: true
    },
    slotNumber: {
        type: String,
        required: true
    },
    relic: {
        type: Object,
        default: null
    },
    store: {
        type: Object,
        required: true
    }
})

defineEmits(['select', 'remove'])

const relicTypeClass = computed(() => {
    if (!props.relic) return ''

    const classes = {
        damage: 'border-red-500/40 bg-red-500/5',
        defense: 'border-blue-500/40 bg-blue-500/5',
        utility: 'border-green-500/40 bg-green-500/5'
    }
    return classes[props.relic.type] || 'border-border'
})

const rarityGradient = computed(() => {
    if (!props.relic) return 'bg-gradient-to-br from-slate-500 to-slate-600'

    const gradients = {
        mythic: 'bg-gradient-to-br from-red-500 to-red-600',
        legendary: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
        epic: 'bg-gradient-to-br from-purple-500 to-purple-600',
        rare: 'bg-gradient-to-br from-blue-500 to-blue-600'
    }
    return gradients[props.relic.rarity] || 'bg-gradient-to-br from-slate-500 to-slate-600'
})
</script>