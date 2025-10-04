<!-- components/topheroes/SkinSlot.vue -->
<template>
    <div class="h-24 border-2 border-dashed border-border/50 rounded-lg transition-all duration-200 relative overflow-hidden"
        :class="{
            'border-solid border-border/30': skin,
            'hover:border-velaris-purple/30': !skin
        }">

        <!-- Filled Slot -->
        <div v-if="skin"
            class="h-full p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 bg-card/50 backdrop-blur-sm flex flex-col gap-2 hover:shadow-lg"
            :class="skinRarityClass">

            <div class="flex-1 flex flex-col justify-center items-center text-center">
                <div class="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold mb-2"
                    :class="rarityGradient">
                    {{ skin.name.charAt(0) }}
                </div>
                <p class="font-medium text-xs truncate w-full px-1" :title="skin.name">{{ skin.name }}</p>
                <p class="text-xs text-foreground/60 capitalize">{{ skin.rarity }}</p>
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

            <Shirt class="h-8 w-8 text-foreground/30 mb-2" />
            <span class="text-xs font-medium text-foreground/50">Troop Skin</span>
            <span class="text-xs text-foreground/30">Add Skin</span>
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { X, Shirt } from 'lucide-vue-next'

const props = defineProps({
    skin: {
        type: Object,
        default: null
    },
    store: {
        type: Object,
        required: true
    }
})

defineEmits(['select', 'remove'])

const skinRarityClass = computed(() => {
    if (!props.skin) return 'border-border/30 bg-foreground/5'

    const classes = {
        legendary: 'border-yellow-500/40 bg-yellow-500/5',
        epic: 'border-purple-500/40 bg-purple-500/5',
        rare: 'border-blue-500/40 bg-blue-500/5'
    }
    return classes[props.skin.rarity] || 'border-border/30'
})

const rarityGradient = computed(() => {
    if (!props.skin) return 'bg-gradient-to-br from-slate-500 to-slate-600'

    const gradients = {
        legendary: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
        epic: 'bg-gradient-to-br from-purple-500 to-purple-600',
        rare: 'bg-gradient-to-br from-blue-500 to-blue-600'
    }
    return gradients[props.skin.rarity] || 'bg-gradient-to-br from-slate-500 to-slate-600'
})
</script>