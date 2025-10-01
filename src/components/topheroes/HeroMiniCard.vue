<!-- components/topheroes/HeroMiniCard.vue -->
<template>
    <div class="hero-mini-card cursor-pointer" :class="[factionCardClass, rarityGlow]" draggable="true"
        @dragstart="$emit('dragstart', $event)" @click="$emit('click')">

        <!-- Hero Avatar -->
        <div class="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold mx-auto mb-2 relative"
            :class="factionGradient">
            {{ hero.name.charAt(0) }}

            <!-- Rarity indicator -->
            <div class="absolute -top-1 -right-1">
                <div class="rarity-dot" :class="rarityDotClass"></div>
            </div>
        </div>

        <!-- Hero Info -->
        <div class="text-center space-y-1">
            <p class="text-xs font-medium truncate px-1" :title="hero.name">
                {{ hero.name }}
            </p>
            <p class="text-xs text-foreground/60">
                {{ hero.factionName || factionName }}
            </p>

            <!-- Tags (max 2) -->
            <div v-if="displayTags.length > 0" class="flex flex-wrap gap-1 justify-center">
                <span v-for="tag in displayTags.slice(0, 2)" :key="tag"
                    class="px-1.5 py-0.5 bg-foreground/10 rounded text-xs leading-none">
                    {{ tag }}
                </span>
                <span v-if="displayTags.length > 2"
                    class="px-1.5 py-0.5 bg-velaris-purple/20 text-velaris-purple rounded text-xs leading-none">
                    +{{ displayTags.length - 2 }}
                </span>
            </div>
        </div>

        <!-- Hover overlay -->
        <div
            class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-end justify-center pb-2">
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Plus, Flame, Leaf, Shield } from 'lucide-vue-next'

const props = defineProps({
    hero: {
        type: Object,
        required: true
    }
})

defineEmits(['click', 'dragstart'])

// Computed properties
const factionCardClass = computed(() => {
    const classes = {
        nature: 'border-nature-green/30 hover:border-nature-green/60 bg-nature-green/5 hover:bg-nature-green/10',
        horde: 'border-horde-red/30 hover:border-horde-red/60 bg-horde-red/5 hover:bg-horde-red/10',
        league: 'border-league-blue/30 hover:border-league-blue/60 bg-league-blue/5 hover:bg-league-blue/10'
    }
    return classes[props.hero.faction] || 'border-border hover:border-velaris-purple/50'
})

const rarityGlow = computed(() => {
    const glows = {
        MY: 'hover:shadow-lg hover:shadow-red-500/20',      // Mythic
        LE: 'hover:shadow-lg hover:shadow-yellow-500/20',   // Legendary
        EP: 'hover:shadow-lg hover:shadow-purple-500/20',   // Epic
        RA: 'hover:shadow-lg hover:shadow-blue-500/20'      // Rare
    }
    return glows[props.hero.rarity] || 'hover:shadow-lg'
})

const factionGradient = computed(() => {
    const gradients = {
        nature: 'bg-gradient-to-br from-nature-green to-emerald-600',
        horde: 'bg-gradient-to-br from-horde-red to-red-600',
        league: 'bg-gradient-to-br from-league-blue to-blue-600'
    }
    return gradients[props.hero.faction] || 'bg-gradient-to-br from-velaris-purple to-velaris-teal'
})

const rarityDotClass = computed(() => {
    const classes = {
        MY: 'bg-red-500 shadow-red-500/50',      // Mythic
        LE: 'bg-yellow-500 shadow-yellow-500/50', // Legendary
        EP: 'bg-purple-500 shadow-purple-500/50', // Epic
        RA: 'bg-blue-500 shadow-blue-500/50'     // Rare
    }
    return classes[props.hero.rarity] || 'bg-slate-500'
})

const factionName = computed(() => {
    const names = {
        nature: 'Nature',
        horde: 'Horde',
        league: 'League'
    }
    return names[props.hero.faction] || props.hero.faction
})

const displayTags = computed(() => {
    if (props.hero.tagNames) {
        return props.hero.tagNames
    }
    // Fallback for raw tag IDs
    return props.hero.tags || []
})
</script>

<style scoped>
.hero-mini-card {
    @apply p-3 rounded-lg border-2 transition-all duration-200 hover:transform hover:-translate-y-1 relative overflow-hidden min-h-[6rem] flex flex-col justify-between;
}

.rarity-dot {
    @apply w-2.5 h-2.5 rounded-full shadow-sm border border-white/30;
}

/* Drag feedback */
.hero-mini-card:active {
    @apply scale-95 opacity-75;
}

/* Stagger animation for multiple cards */
.hero-mini-card {
    animation: fadeInUp 0.3s ease-out forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Add stagger delay via CSS variables if needed */
.hero-mini-card:nth-child(1) {
    animation-delay: 0.05s;
}

.hero-mini-card:nth-child(2) {
    animation-delay: 0.1s;
}

.hero-mini-card:nth-child(3) {
    animation-delay: 0.15s;
}

.hero-mini-card:nth-child(4) {
    animation-delay: 0.2s;
}

.hero-mini-card:nth-child(5) {
    animation-delay: 0.25s;
}

.hero-mini-card:nth-child(6) {
    animation-delay: 0.3s;
}

.hero-mini-card:nth-child(n+7) {
    animation-delay: 0.35s;
}
</style>