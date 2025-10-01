<!-- components/topheroes/TeamSlot.vue -->
<template>
    <div class="min-h-[6rem] h-full border-2 border-dashed border-border/50 rounded-lg transition-all duration-200 relative overflow-hidden"
        :class="{
            'border-solid border-border/30': hero,
            'border-velaris-purple/60 bg-velaris-purple/15 shadow-xl': isDragOver,
            'hover:border-velaris-purple/30': !hero
        }" @drop="onDrop" @dragover.prevent="onDragOver" @dragenter.prevent="onDragEnter" @dragleave="onDragLeave"
        :style="!hero && 'hover:background: rgba(139, 92, 246, 0.08); hover:box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1);'">

        <!-- Occupied Slot -->
        <div v-if="hero"
            class="h-full p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 bg-card/50 backdrop-blur-sm relative flex flex-col hover:shadow-xl"
            :class="factionCardClass" draggable="true" @dragstart="onDragStart" @click="$emit('remove', position)"
            style="animation: slideIn 0.3s ease-out;">

            <!-- Main Content Area -->
            <div class="h-full flex flex-col justify-between gap-3">
                <!-- Header with avatar and remove button -->
                <div class="flex items-start gap-3">
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-md flex-shrink-0"
                        :class="factionGradient">
                        {{ hero.name.charAt(0) }}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                            <p class="font-semibold text-base truncate leading-tight">{{ hero.name }}</p>
                            <div class="w-3 h-3 rounded-full shadow-sm border border-white/50 flex-shrink-0"
                                :class="rarityDotClass" title="Rarity"></div>

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
                        <p class="text-sm text-foreground/60 mt-1">{{ hero.factionName || hero.faction }}</p>
                    </div>
                    <button @click.stop="$emit('remove', position)"
                        class="p-2 rounded-lg transition-all duration-200 hover:bg-red-500/20 text-foreground/60 hover:text-red-400 flex-shrink-0"
                        title="Remove Hero">
                        <X class="h-4 w-4" />
                    </button>
                </div>

                <!-- Gear Section -->
                <div class="mt-auto">
                    <!-- Has Gear -->
                    <div v-if="hasGear"
                        class="flex items-center justify-between p-3 rounded-lg border transition-all duration-200"
                        :class="gearDisplayClass">
                        <div class="flex items-center gap-2 flex-1">
                            <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(56, 178, 172, 0.8));">
                                <component :is="gearSetIcon" class="h-4 w-4 text-white" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium truncate leading-tight">{{ gearSetName }}</p>
                                <p class="text-xs text-foreground/60 mt-0.5">Gear Set</p>
                            </div>
                        </div>
                        <button @click.stop="$emit('gear', position)"
                            class="p-2 rounded-lg transition-all duration-200 hover:bg-white/10 text-foreground/60 hover:text-foreground flex-shrink-0"
                            title="Edit Gear">
                            <Settings class="h-4 w-4" />
                        </button>
                    </div>

                    <!-- No Gear -->
                    <button v-else @click.stop="$emit('gear', position)"
                        class="w-full p-3 rounded-lg border-2 border-dashed border-border/50 hover:border-velaris-purple/50 transition-all duration-200 flex items-center justify-center text-foreground/60 hover:text-velaris-purple hover:bg-velaris-purple/5 text-sm font-medium">
                        <Settings class="h-4 w-4 mr-2" />
                        <span>Configure Gear</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty Slot -->
        <div v-else class="h-full flex items-center justify-center p-4">
            <div class="flex flex-col items-center text-center transition-all duration-200">
                <Users class="h-8 w-8 text-foreground/30 mb-2" />
                <span class="text-sm font-medium text-foreground/50 mb-1">{{ positionName }}</span>
                <span class="text-xs text-foreground/30">Drag hero here</span>
            </div>
        </div>

        <!-- Drag Over Indicator -->
        <div v-if="isDragOver"
            class="absolute inset-0 bg-velaris-purple/20 border-2 border-velaris-purple border-dashed rounded-lg flex items-center justify-center backdrop-blur-sm"
            style="animation: pulse 1s ease-in-out infinite;">
            <div class="flex flex-col items-center text-center">
                <Plus class="h-8 w-8 text-velaris-purple mb-2" />
                <span class="text-sm font-semibold text-velaris-purple">Drop here</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Users, Settings, X, Plus, Zap, Crown, Sword } from 'lucide-vue-next'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const props = defineProps({
    position: {
        type: String,
        required: true
    },
    hero: {
        type: Object,
        default: null
    },
    positionName: {
        type: String,
        required: true
    },
    gearData: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['drop', 'remove', 'gear'])

const isDragOver = ref(false)
let dragCounter = 0

// CHANGED: Check if hero has gear configured using only heroId
const hasGear = computed(() => {
    if (!props.hero) return false
    const gear = props.gearData[props.hero.id]
    return gear && gear.gearSet && gear.gearSet !== 'none' && gear.gearSet !== ''
})

// CHANGED: Gear set name for display using only heroId
const gearSetName = computed(() => {
    if (!hasGear.value) return ''

    const gear = props.gearData[props.hero.id]
    return gear?.gearSetName || 'Unknown Set'
})

// CHANGED: Gear display styling based on gear set using only heroId
const gearDisplayClass = computed(() => {
    if (!hasGear.value) return ''

    const gear = props.gearData[props.hero.id]

    if (!gear || !gear.gearSet) return 'bg-velaris-amber/20 border-velaris-amber/40'

    const gearSetStyles = {
        'titans-might': 'bg-red-500/20 border-red-500/40',
        'fury-of-blood': 'bg-amber-500/20 border-amber-500/40',
        'glory-of-knight': 'bg-purple-500/20 border-purple-500/40'
    }

    return gearSetStyles[gear.gearSet] || 'bg-velaris-amber/20 border-velaris-amber/40'
})

// CHANGED: Gear tooltip using only heroId
const gearTooltip = computed(() => {
    if (!props.hero) return 'Configure Gear'

    const gear = props.gearData[props.hero.id]

    if (hasGear.value) {
        const gearSetName = gear.gearSetName || 'Unknown Set'
        return `${gearSetName}`
    }

    return 'Configure Gear'
})

// CHANGED: Gear indicator styling based on gear set using only heroId
const gearIndicatorClass = computed(() => {
    if (!hasGear.value) return ''

    const gear = props.gearData[props.hero.id]

    if (!gear || !gear.gearSet) return 'bg-velaris-amber'

    const gearSetColors = {
        'titans-might': 'bg-red-500',
        'fury-of-blood': 'bg-amber-500',
        'glory-of-knight': 'bg-purple-500'
    }

    return gearSetColors[gear.gearSet] || 'bg-velaris-amber'
})

// CHANGED: Gear set icon using only heroId
const gearSetIcon = computed(() => {
    if (!hasGear.value) return Zap

    const gear = props.gearData[props.hero.id]

    if (!gear || !gear.gearSet) return Zap

    const gearSetIcons = {
        'titans-might': Sword,
        'fury-of-blood': Crown,
        'glory-of-knight': Zap
    }

    return gearSetIcons[gear.gearSet] || Zap
})

// Computed properties
const factionCardClass = computed(() => {
    if (!props.hero) return ''

    const classes = {
        nature: 'border-nature-green/30 hover:border-nature-green/60 bg-nature-green/5',
        horde: 'border-horde-red/30 hover:border-horde-red/60 bg-horde-red/5',
        league: 'border-league-blue/30 hover:border-league-blue/60 bg-league-blue/5'
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

const rarityDotClass = computed(() => {
    if (!props.hero) return ''

    const classes = {
        MY: 'bg-red-500',
        LE: 'bg-yellow-500',
        EP: 'bg-purple-500',
        RA: 'bg-blue-500'
    }
    return classes[props.hero.rarity] || 'bg-slate-500'
})

const displayTags = computed(() => {
    if (!props.hero) return []

    if (props.hero.tagNames) {
        return props.hero.tagNames
    }
    // Fallback for raw tag IDs
    return props.hero.tags || []
})

// Drag and drop event handlers
const onDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
}

const onDragEnter = (event) => {
    event.preventDefault()
    dragCounter++
    isDragOver.value = true
}

const onDragLeave = (event) => {
    dragCounter--
    if (dragCounter === 0) {
        isDragOver.value = false
    }
}

const onDrop = (event) => {
    event.preventDefault()
    dragCounter = 0
    isDragOver.value = false
    emit('drop', event, props.position)
}

const onDragStart = (event) => {
    if (props.hero) {
        event.dataTransfer.setData('text/plain', JSON.stringify({
            type: 'team-hero',
            data: props.hero,
            position: props.position
        }))
        event.dataTransfer.effectAllowed = 'move'
    }
}
</script>

<style scoped>
/* Keyframe animations - cannot be done inline */
@keyframes pulse {

    0%,
    100% {
        opacity: 0.8;
        background: rgba(139, 92, 246, 0.15);
        box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.4), 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    50% {
        opacity: 1;
        background: rgba(139, 92, 246, 0.25);
        box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.6), 0 25px 50px -12px rgba(139, 92, 246, 0.3);
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>