<!-- components/topheroes/public/HeroSlotDetail.vue -->
<template>
    <div class="min-h-[6rem] h-full border-2 rounded-lg transition-all duration-200 relative overflow-hidden"
        :class="hero ? 'border-solid border-border/30' : 'border-dashed border-border/50'">

        <!-- Position Badge (Mobile Only) -->
        <div v-if="hero" class="md:hidden absolute top-0 left-0 z-10">
            <div class="px-2 py-1 text-xs font-semibold rounded-br-lg" :class="positionSide === 'left'
                ? 'bg-blue-500/90 text-white'
                : 'bg-purple-500/90 text-white'">
                {{ positionSide === 'left' ? 'Left' : 'Right' }}
            </div>
        </div>

        <!-- Occupied Slot -->
        <div v-if="hero" class="h-full p-4 rounded-lg border-2 bg-card/50 backdrop-blur-sm relative flex flex-col"
            :class="factionCardClass">

            <!-- Main Content Area -->
            <div class="h-full flex flex-col justify-between gap-3">
                <!-- Header with avatar -->
                <div class="flex items-start gap-3">
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-md flex-shrink-0"
                        :class="factionGradient">
                        {{ hero.name.charAt(0) }}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                            <p class="font-semibold text-base truncate leading-tight">{{ hero.name }}</p>
                            <div class="w-3 h-3 rounded-full shadow-sm border border-white/50 flex-shrink-0"
                                :class="rarityDotClass" :title="hero.rarity"></div>

                            <!-- Tags inline -->
                            <template v-if="displayTags.length > 0">
                                <span v-for="tag in displayTags.slice(0, 2)" :key="tag"
                                    class="px-1.5 py-0.5 bg-foreground/10 rounded text-xs leading-none">
                                    {{ tag }}
                                </span>
                                <TooltipProvider v-if="displayTags.length > 2">
                                    <Tooltip>
                                        <TooltipTrigger as-child>
                                            <span
                                                class="px-1.5 py-0.5 bg-velaris-purple/20 text-velaris-purple hover:bg-velaris-purple/30 hover:text-velaris-purple rounded text-xs leading-none cursor-pointer transition-colors">
                                                +{{ displayTags.length - 2 }}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div class="flex flex-col gap-1">
                                                <span v-for="tag in displayTags.slice(2)" :key="tag" class="text-xs">
                                                    {{ tag }}
                                                </span>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </template>
                        </div>
                        <p class="text-sm text-foreground/60 mt-1">{{ factionName }}</p>
                    </div>
                </div>

                <!-- Gear Section -->
                <div class="mt-auto">
                    <!-- Has Gear -->
                    <div v-if="hasGear"
                        class="flex items-center justify-between p-3 rounded-lg border transition-all duration-200"
                        :class="gearDisplayClass">
                        <div class="flex items-center gap-2 flex-1">
                            <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                :class="gearIconBackground">
                                <component :is="gearSetIcon" class="h-4 w-4 text-white" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium truncate leading-tight" :class="gearTextColor">{{
                                    gearSetName }}</p>
                                <p class="text-xs text-foreground/60 mt-0.5">Gear Set</p>
                            </div>
                        </div>
                    </div>

                    <!-- No Gear -->
                    <div v-else
                        class="w-full p-3 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center text-foreground/40 text-sm">
                        <Settings class="h-4 w-4 mr-2" />
                        <span>No Gear Configured</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty Slot -->
        <div v-else class="h-full flex items-center justify-center p-4">
            <div class="flex flex-col items-center text-center transition-all duration-200">
                <Users class="h-8 w-8 text-foreground/30 mb-2" />
                <span class="text-sm font-medium text-foreground/50 mb-1">{{ position }}</span>
                <span class="text-xs text-foreground/30">Empty slot</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Users, Settings, Zap, Crown, Sword, Shield } from 'lucide-vue-next'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const props = defineProps({
    hero: {
        type: Object,
        default: null
    },
    gear: {
        type: String,
        default: null
    },
    position: {
        type: String,
        required: true
    },
    store: {
        type: Object,
        required: true
    }
})

// Check if hero has gear configured
const hasGear = computed(() => {
    if (!props.hero || !props.gear) return false
    return props.gear && props.gear !== 'none' && props.gear !== ''
})

// Get gear data from store
const gearData = computed(() => {
    if (!hasGear.value) return null
    return props.store.getGearById(props.gear)
})

// Gear set name for display
const gearSetName = computed(() => {
    if (!hasGear.value || !gearData.value) return ''
    return gearData.value.name || 'Unknown Set'
})

// Gear display styling - DISTINCT COLORS for each gear type
const gearDisplayClass = computed(() => {
    if (!hasGear.value || !props.gear) return ''

    const gearSetStyles = {
        'titans_might': 'bg-gradient-to-r from-red-500/15 to-rose-500/15 border-red-500/40 shadow-red-500/10',
        'fury_of_blood': 'bg-gradient-to-r from-orange-500/15 to-amber-500/15 border-orange-500/40 shadow-orange-500/10',
        'glory_of_knight': 'bg-gradient-to-r from-purple-500/15 to-indigo-500/15 border-purple-500/40 shadow-purple-500/10'
    }

    return gearSetStyles[props.gear] || 'bg-slate-500/10 border-slate-500/30'
})

// Gear icon background color
const gearIconBackground = computed(() => {
    if (!hasGear.value || !props.gear) return 'bg-gradient-to-br from-velaris-purple to-velaris-teal'

    const gearSetColors = {
        'titans_might': 'bg-gradient-to-br from-red-500 to-rose-600',
        'fury_of_blood': 'bg-gradient-to-br from-orange-500 to-amber-600',
        'glory_of_knight': 'bg-gradient-to-br from-purple-500 to-indigo-600'
    }

    return gearSetColors[props.gear] || 'bg-gradient-to-br from-slate-500 to-slate-600'
})

// Gear text color
const gearTextColor = computed(() => {
    if (!hasGear.value || !props.gear) return 'text-foreground'

    const gearSetTextColors = {
        'titans_might': 'text-red-400',
        'fury_of_blood': 'text-orange-400',
        'glory_of_knight': 'text-purple-400'
    }

    return gearSetTextColors[props.gear] || 'text-foreground'
})

// Gear set icon
const gearSetIcon = computed(() => {
    if (!hasGear.value || !props.gear) return Zap

    const gearSetIcons = {
        'titans_might': Sword,      // Attack - Sword
        'fury_of_blood': Shield,    // Defense - Shield
        'glory_of_knight': Crown    // Balanced - Crown
    }

    return gearSetIcons[props.gear] || Zap
})

// Computed properties
const positionSide = computed(() => {
    if (!props.position) return 'left'
    // Positions ending in '1' are left, ending in '2' are right
    return props.position.endsWith('1') ? 'left' : 'right'
})

const factionCardClass = computed(() => {
    if (!props.hero) return ''

    const classes = {
        nature: 'border-nature-green/30 bg-nature-green/5',
        horde: 'border-horde-red/30 bg-horde-red/5',
        league: 'border-league-blue/30 bg-league-blue/5'
    }
    return classes[props.hero.faction] || 'border-border'
})

const factionGradient = computed(() => {
    if (!props.hero) return 'bg-gradient-to-br from-velaris-purple to-velaris-teal'

    const gradients = {
        nature: 'bg-gradient-to-br from-nature-green to-emerald-600',
        horde: 'bg-gradient-to-br from-horde-red to-red-600',
        league: 'bg-gradient-to-br from-league-blue to-blue-600'
    }
    return gradients[props.hero.faction] || 'bg-gradient-to-br from-velaris-purple to-velaris-teal'
})

const factionName = computed(() => {
    if (!props.hero) return ''
    const faction = props.store.getFactionById(props.hero.faction)
    return faction?.name || props.hero.faction
})

const rarityDotClass = computed(() => {
    if (!props.hero) return ''

    const classes = {
        mythic: 'bg-red-500',
        legendary: 'bg-yellow-500',
        epic: 'bg-purple-500',
        rare: 'bg-blue-500'
    }
    return classes[props.hero.rarity] || 'bg-slate-500'
})

const displayTags = computed(() => {
    if (!props.hero) return []

    // First check if tagNames are already stored (denormalized)
    if (props.hero.tagNames?.length) {
        return props.hero.tagNames
    }

    // Otherwise look up tag names from store using tag IDs
    if (props.hero.tags?.length && props.store) {
        return props.hero.tags
            .map(tagId => props.store.getTagById(tagId)?.name || tagId)
            .filter(Boolean)
    }

    return []
})
</script>