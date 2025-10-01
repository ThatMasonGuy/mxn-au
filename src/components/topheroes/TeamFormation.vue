<!-- components/topheroes/TeamFormation.vue -->
<template>
    <div class="team-formation" :class="sizeClass">
        <!-- Formation Grid -->
        <div class="space-y-2">
            <!-- Back Row -->
            <div class="formation-row">
                <div class="row-header">
                    <Shield class="h-3 w-3" />
                    <span class="row-label">{{ compact ? 'B' : 'Back' }}</span>
                </div>
                <div class="hero-positions">
                    <HeroPosition v-for="position in ['back1', 'back2']" :key="position"
                        :hero="getHeroInPosition(position)" :position="position" :size="size" :show-empty="showEmpty"
                        :clickable="clickable" @click="$emit('hero-click', position, getHeroInPosition(position))" />
                </div>
            </div>

            <!-- Mid Row -->
            <div class="formation-row">
                <div class="row-header">
                    <Swords class="h-3 w-3" />
                    <span class="row-label">{{ compact ? 'M' : 'Mid' }}</span>
                </div>
                <div class="hero-positions">
                    <HeroPosition v-for="position in ['mid1', 'mid2']" :key="position"
                        :hero="getHeroInPosition(position)" :position="position" :size="size" :show-empty="showEmpty"
                        :clickable="clickable" @click="$emit('hero-click', position, getHeroInPosition(position))" />
                </div>
            </div>

            <!-- Front Row -->
            <div class="formation-row">
                <div class="row-header">
                    <Sword class="h-3 w-3" />
                    <span class="row-label">{{ compact ? 'F' : 'Front' }}</span>
                </div>
                <div class="hero-positions">
                    <HeroPosition v-for="position in ['front1', 'front2']" :key="position"
                        :hero="getHeroInPosition(position)" :position="position" :size="size" :show-empty="showEmpty"
                        :clickable="clickable" @click="$emit('hero-click', position, getHeroInPosition(position))" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Shield, Swords, Sword } from 'lucide-vue-next'

const props = defineProps({
    // Team can be either object format (TeamBuilder) or heroes array format (Queue)
    team: {
        type: [Object, Array],
        default: () => ({})
    },
    // Size variants: 'sm', 'md', 'lg'
    size: {
        type: String,
        default: 'md'
    },
    // Show empty slots
    showEmpty: {
        type: Boolean,
        default: true
    },
    // Make heroes clickable
    clickable: {
        type: Boolean,
        default: false
    },
    // Compact mode (smaller labels)
    compact: {
        type: Boolean,
        default: false
    },
    // Heroes lookup for queue format
    heroes: {
        type: Array,
        default: () => []
    }
})

defineEmits(['hero-click'])

// Computed properties
const sizeClass = computed(() => {
    const classes = {
        sm: 'formation-sm',
        md: 'formation-md',
        lg: 'formation-lg'
    }
    return classes[props.size] || 'formation-md'
})

const getHeroInPosition = (position) => {
    // Handle object format (currentTeam from TeamBuilder)
    if (props.team && typeof props.team === 'object' && !Array.isArray(props.team)) {
        return props.team[position] || null
    }

    // Handle array format (heroes from Queue)
    if (Array.isArray(props.team)) {
        const heroEntry = props.team.find(h => h.position === position)
        if (heroEntry && props.heroes) {
            return props.heroes.find(hero => hero.id === heroEntry.heroId) || null
        }
    }

    return null
}

// Helper component for individual hero positions
const HeroPosition = {
    props: ['hero', 'position', 'size', 'showEmpty', 'clickable'],
    emits: ['click'],
    template: `
        <div 
            class="hero-position" 
            :class="[
                positionClass,
                clickable && 'cursor-pointer hover:scale-105 transition-transform duration-200'
            ]"
            @click="$emit('click')"
        >
            <!-- Hero Present -->
            <div v-if="hero" class="hero-avatar" :class="[avatarSizeClass, factionGradient]">
                <span class="hero-initial" :class="initialSizeClass">
                    {{ hero.name.charAt(0) }}
                </span>
                <div v-if="size !== 'sm'" class="hero-rarity-dot" :class="rarityDotClass"></div>
            </div>
            
            <!-- Empty Slot -->
            <div v-else-if="showEmpty" class="empty-slot" :class="avatarSizeClass">
                <span class="empty-text" :class="initialSizeClass">?</span>
            </div>
        </div>
    `,
    computed: {
        positionClass() {
            return `position-${this.size}`
        },
        avatarSizeClass() {
            const sizes = {
                sm: 'w-6 h-6',
                md: 'w-8 h-8',
                lg: 'w-12 h-12'
            }
            return sizes[this.size] || sizes.md
        },
        initialSizeClass() {
            const sizes = {
                sm: 'text-xs',
                md: 'text-sm',
                lg: 'text-lg'
            }
            return sizes[this.size] || sizes.md
        },
        factionGradient() {
            if (!this.hero) return 'bg-gray-500'

            const gradients = {
                nature: 'bg-gradient-to-br from-nature-green to-emerald-600',
                horde: 'bg-gradient-to-br from-horde-red to-red-600',
                league: 'bg-gradient-to-br from-league-blue to-blue-600'
            }
            return gradients[this.hero.faction] || 'bg-gradient-to-br from-velaris-purple to-velaris-teal'
        },
        rarityDotClass() {
            if (!this.hero) return 'bg-gray-400'

            const classes = {
                MY: 'bg-red-500',
                LE: 'bg-yellow-500',
                EP: 'bg-purple-500',
                RA: 'bg-blue-500'
            }
            return classes[this.hero.rarity] || 'bg-gray-500'
        }
    }
}
</script>

<style scoped>
.team-formation {
    @apply w-full;
}

.formation-row {
    @apply flex items-center gap-2;
}

.row-header {
    @apply flex items-center gap-1 text-foreground/60;
}

.row-label {
    @apply font-medium text-xs;
}

.hero-positions {
    @apply flex gap-2 flex-1 justify-center;
}

.hero-position {
    @apply relative;
}

.hero-avatar {
    @apply rounded-lg flex items-center justify-center text-white font-bold shadow-md relative;
}

.hero-initial {
    @apply font-bold text-white;
}

.hero-rarity-dot {
    @apply absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white/30;
}

.empty-slot {
    @apply rounded-lg flex items-center justify-center bg-foreground/10 border-2 border-dashed border-foreground/20;
}

.empty-text {
    @apply text-foreground/30 font-medium;
}

/* Size variants */
.formation-sm .row-label {
    @apply text-xs w-3;
}

.formation-md .row-label {
    @apply text-sm w-8;
}

.formation-lg .row-label {
    @apply text-base w-12;
}

.formation-sm .hero-positions {
    @apply gap-1;
}

.formation-md .hero-positions {
    @apply gap-2;
}

.formation-lg .hero-positions {
    @apply gap-3;
}

/* Hover effects for clickable */
.hero-position:hover .hero-avatar {
    @apply shadow-lg;
}

.hero-position:hover .empty-slot {
    @apply border-velaris-purple/50 bg-velaris-purple/5;
}
</style>