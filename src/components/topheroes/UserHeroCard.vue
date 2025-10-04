<!-- components/topheroes/UserHeroCard.vue -->
<template>
    <div class="hero-showcase-card group" :class="[
        cardClasses,
        rarityClasses
    ]">

        <!-- Hero Avatar -->
        <div class="relative mb-4 z-[100]">
            <div class="hero-avatar" :class="factionGradient">
                <div class="w-full h-full rounded-2xl overflow-hidden flex items-center justify-center">
                    <img v-if="heroImageLoaded" :src="heroImageSrc" :alt="hero.name" class="w-full h-full object-cover"
                        @error="heroImageLoaded = false" />
                    <span v-else class="text-2xl font-bold text-white">
                        {{ hero.name.charAt(0) }}
                    </span>
                </div>
                <div class="absolute -top-2 -right-2">
                    <div class="rarity-gem" :class="rarityGemClass">
                        <component :is="rarityIcon" class="h-3 w-3 text-white" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Hero Info -->
        <div class="space-y-3">
            <div class="text-center">
                <h3 class="font-bold text-lg text-foreground group-hover:text-velaris-purple transition-colors">
                    {{ hero.name }}
                </h3>
                <div class="flex items-center justify-center gap-2 mt-1">
                    <component :is="factionIcon" class="h-4 w-4" :class="factionColor" />
                    <span class="text-sm font-medium" :class="factionColor">
                        {{ store.getFactionById(hero.faction)?.name || hero.faction }}
                    </span>
                </div>
            </div>

            <!-- Rarity Badge -->
            <div class="flex justify-center">
                <div class="rarity-badge" :class="rarityBadgeClass">
                    <component :is="rarityIcon" class="h-4 w-4" />
                    <span class="font-bold text-sm">{{ store.getRarityById(hero.rarity)?.name || hero.rarity }}</span>
                </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 justify-center">
                <span v-for="(tagName, index) in displayTags" :key="index" class="tag-pill">
                    {{ tagName }}
                </span>
                <span v-if="hero.tags.length > 3" class="tag-pill-more">
                    +{{ hero.tags.length - 3 }}
                </span>
            </div>
        </div>

        <!-- Bottom gradient overlay with blur for depth behind buttons -->
        <div
            class="absolute bottom-0 left-0 right-0 h-80 rounded-b-2xl bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
        </div>

        <!-- Action Buttons -->
        <div
            class="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
            <div class="flex gap-2">
                <button @click.stop="$emit('view', hero)"
                    class="flex-1 bg-gradient-to-r from-velaris-purple/80 to-velaris-teal/80 backdrop-blur-sm text-white font-medium py-2 px-3 rounded-xl shadow-lg hover:shadow-xl hover:from-velaris-purple hover:to-velaris-teal transition-all duration-200 text-sm cursor-pointer">
                    <Eye class="h-4 w-4 inline mr-1" />
                    View Details
                </button>
                <button @click.stop="$emit('add-to-queue', hero)"
                    class="bg-emerald-500/40 hover:bg-emerald-500/60 backdrop-blur-sm text-emerald-400 border border-emerald-500/50 p-2 rounded-xl transition-all duration-200 cursor-pointer">
                    <Plus class="h-4 w-4" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { Plus, Eye, Flame, Leaf, Shield, Crown, Star, Gem, Hexagon } from 'lucide-vue-next'

const props = defineProps({
    hero: {
        type: Object,
        required: true
    },
    store: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['add-to-queue', 'view'])

// State for image loading
const heroImageLoaded = ref(false)
const heroImageSrc = ref('')

// Try to load hero image
const loadHeroImage = async () => {
    if (!props.hero.id) return

    try {
        const imagePath = `/src/assets/images/topheroes/heroes/${props.hero.id}.png`
        // Try to import the image dynamically
        const imageModule = await import(/* @vite-ignore */ imagePath)
        heroImageSrc.value = imageModule.default || imagePath
        heroImageLoaded.value = true
    } catch (error) {
        // Image doesn't exist or failed to load, use fallback
        heroImageLoaded.value = false
    }
}

// Load image on mount and when hero changes
onMounted(() => {
    loadHeroImage()
})

watch(() => props.hero.id, () => {
    loadHeroImage()
})

// Computed properties
const cardClasses = computed(() => {
    const classes = {
        nature: 'hero-card-nature',
        horde: 'hero-card-horde',
        league: 'hero-card-league'
    }
    return classes[props.hero.faction] || 'hero-card-league'
})

const rarityClasses = computed(() => {
    const classes = {
        mythic: 'rarity-mythic',
        legendary: 'rarity-legendary',
        epic: 'rarity-epic',
        rare: 'rarity-rare'
    }
    return classes[props.hero.rarity] || 'rarity-rare'
})

const factionGradient = computed(() => {
    const gradients = {
        nature: 'bg-gradient-to-br from-nature-green to-emerald-600',
        horde: 'bg-gradient-to-br from-horde-red to-red-600',
        league: 'bg-gradient-to-br from-league-blue to-blue-600'
    }
    return gradients[props.hero.faction] || 'bg-gradient-to-br from-velaris-purple to-velaris-teal'
})

const factionIcon = computed(() => {
    const icons = { nature: Leaf, horde: Flame, league: Shield }
    return icons[props.hero.faction] || Shield
})

const factionColor = computed(() => {
    const colors = {
        nature: 'text-nature-green',
        horde: 'text-horde-red',
        league: 'text-league-blue'
    }
    return colors[props.hero.faction] || 'text-foreground'
})

const rarityIcon = computed(() => {
    const icons = {
        mythic: Crown,
        legendary: Star,
        epic: Gem,
        rare: Hexagon
    }
    return icons[props.hero.rarity] || Star
})

const rarityGemClass = computed(() => {
    const classes = {
        mythic: 'bg-gradient-to-br from-red-500 to-red-600',
        legendary: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
        epic: 'bg-gradient-to-br from-purple-500 to-purple-600',
        rare: 'bg-gradient-to-br from-blue-500 to-blue-600'
    }
    return classes[props.hero.rarity] || 'bg-gradient-to-br from-slate-500 to-slate-600'
})

const rarityBadgeClass = computed(() => {
    const classes = {
        mythic: 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border border-red-500/30',
        legendary: 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border border-yellow-500/30',
        epic: 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 border border-purple-500/30',
        rare: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30'
    }
    return classes[props.hero.rarity] || 'bg-foreground/10 text-foreground border-border'
})

const displayTags = computed(() => {
    // First check if tagNames are already stored (denormalized)
    if (props.hero.tagNames?.length) {
        return props.hero.tagNames.slice(0, 3)
    }

    // Otherwise look up tag names from store using tag IDs
    if (props.hero.tags?.length && props.store) {
        return props.hero.tags
            .slice(0, 3)
            .map(tagId => props.store.getTagById(tagId)?.name || tagId)
            .filter(Boolean)
    }

    return []
})
</script>

<style scoped>
.hero-showcase-card {
    @apply relative p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 overflow-hidden;
}

.hero-card-nature {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 50%, rgba(16, 185, 129, 0.05) 100%);
    border-color: rgba(16, 185, 129, 0.25);
    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05);
}

.hero-card-nature:hover {
    border-color: rgba(16, 185, 129, 0.4);
    box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.2), 0 10px 15px -3px rgba(16, 185, 129, 0.1);
}

.hero-card-horde {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 50%, rgba(239, 68, 68, 0.05) 100%);
    border-color: rgba(239, 68, 68, 0.25);
    box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.1), 0 4px 6px -2px rgba(239, 68, 68, 0.05);
}

.hero-card-horde:hover {
    border-color: rgba(239, 68, 68, 0.4);
    box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.2), 0 10px 15px -3px rgba(239, 68, 68, 0.1);
}

.hero-card-league {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 50%, rgba(59, 130, 246, 0.05) 100%);
    border-color: rgba(59, 130, 246, 0.25);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05);
}

.hero-card-league:hover {
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.2), 0 10px 15px -3px rgba(59, 130, 246, 0.1);
}

.rarity-mythic {
    box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.15), 0 4px 6px -2px rgba(239, 68, 68, 0.1) !important;
}

.rarity-mythic:hover {
    box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.25), 0 10px 15px -3px rgba(239, 68, 68, 0.15) !important;
}

.rarity-legendary {
    box-shadow: 0 10px 15px -3px rgba(234, 179, 8, 0.15), 0 4px 6px -2px rgba(234, 179, 8, 0.1) !important;
}

.rarity-legendary:hover {
    box-shadow: 0 25px 50px -12px rgba(234, 179, 8, 0.25), 0 10px 15px -3px rgba(234, 179, 8, 0.15) !important;
}

.rarity-epic {
    box-shadow: 0 10px 15px -3px rgba(147, 51, 234, 0.15), 0 4px 6px -2px rgba(147, 51, 234, 0.1) !important;
}

.rarity-epic:hover {
    box-shadow: 0 25px 50px -12px rgba(147, 51, 234, 0.25), 0 10px 15px -3px rgba(147, 51, 234, 0.15) !important;
}

.rarity-rare {
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.15), 0 4px 6px -2px rgba(59, 130, 246, 0.1) !important;
}

.rarity-rare:hover {
    box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 10px 15px -3px rgba(59, 130, 246, 0.15) !important;
}

.hero-avatar {
    @apply w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mx-auto relative transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl;
}

.rarity-gem {
    @apply w-6 h-6 rounded-full flex items-center justify-center shadow-md;
}

.rarity-badge {
    @apply inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm;
}

.tag-pill {
    @apply px-2.5 py-1 bg-gradient-to-r from-foreground/10 to-foreground/5 text-foreground/70 rounded-full text-xs font-medium border border-foreground/10 backdrop-blur-sm transition-all duration-200 hover:bg-foreground/15;
}

.tag-pill-more {
    @apply px-2.5 py-1 bg-gradient-to-r from-velaris-purple/20 to-velaris-teal/20 text-velaris-purple rounded-full text-xs font-bold border border-velaris-purple/30;
}

:root {
    --nature-green: #10b981;
    --horde-red: #ef4444;
    --league-blue: #3b82f6;
}

.text-nature-green {
    color: var(--nature-green);
}

.text-horde-red {
    color: var(--horde-red);
}

.text-league-blue {
    color: var(--league-blue);
}
</style>