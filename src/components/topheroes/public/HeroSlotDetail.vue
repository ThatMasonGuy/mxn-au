<!-- components/topheroes/public/HeroSlotDetail.vue -->
<template>
    <!-- Empty Slot -->
    <div v-if="!hero"
        class="p-4 bg-foreground/5 border-2 border-dashed border-border rounded-lg flex items-center justify-center min-h-[100px]">
        <div class="text-center">
            <Users class="h-8 w-8 mx-auto mb-2 text-foreground/30" />
            <p class="text-sm text-foreground/50">Empty Slot</p>
        </div>
    </div>

    <!-- Hero Card -->
    <div v-else
        class="p-4 bg-gradient-to-br from-foreground/5 to-foreground/10 border border-border rounded-lg hover:border-velaris-purple/30 transition-all">
        <div class="flex items-start gap-3">
            <!-- Hero Avatar -->
            <div class="h-16 w-16 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0"
                :class="getFactionGradient(hero.faction)">
                {{ hero.name.charAt(0) }}
            </div>

            <!-- Hero Info -->
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                    <h4 class="font-semibold truncate">{{ hero.name }}</h4>
                    <div class="w-2.5 h-2.5 rounded-full flex-shrink-0" :class="getRarityDotClass(hero.rarity)"
                        :title="hero.rarityName"></div>
                </div>

                <div class="flex items-center gap-2 mb-2">
                    <component :is="getFactionIcon(hero.faction)" class="h-3.5 w-3.5"
                        :class="getFactionColor(hero.faction)" />
                    <span class="text-sm" :class="getFactionColor(hero.faction)">
                        {{ hero.factionName || hero.faction }}
                    </span>
                </div>

                <!-- Tags -->
                <div v-if="hero.tagNames && hero.tagNames.length > 0" class="flex flex-wrap gap-1 mb-2">
                    <span v-for="tag in hero.tagNames.slice(0, 3)" :key="tag"
                        class="px-2 py-0.5 bg-foreground/10 rounded-full text-xs">
                        {{ tag }}
                    </span>
                    <span v-if="hero.tagNames.length > 3"
                        class="px-2 py-0.5 bg-velaris-purple/20 text-velaris-purple rounded-full text-xs font-medium">
                        +{{ hero.tagNames.length - 3 }}
                    </span>
                </div>

                <!-- Gear Badge -->
                <div v-if="gear" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
                    :class="getGearBadgeClass(gear)">
                    <component :is="getGearIcon(gear)" class="h-3.5 w-3.5" />
                    <span>{{ getGearDisplayName(gear) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Users, Flame, Leaf, Shield, Mountain, Droplet, Crown } from 'lucide-vue-next'

const props = defineProps({
    hero: {
        type: Object,
        default: null
    },
    position: {
        type: String,
        required: true
    },
    gear: {
        type: String,
        default: null
    }
})

// Methods
const getFactionGradient = (faction) => {
    const gradients = {
        nature: 'bg-gradient-to-br from-nature-green to-emerald-600',
        horde: 'bg-gradient-to-br from-horde-red to-red-600',
        league: 'bg-gradient-to-br from-league-blue to-blue-600'
    }
    return gradients[faction] || 'bg-gradient-to-br from-velaris-purple to-velaris-teal'
}

const getFactionIcon = (faction) => {
    const icons = { nature: Leaf, horde: Flame, league: Shield }
    return icons[faction] || Shield
}

const getFactionColor = (faction) => {
    const colors = {
        nature: 'text-nature-green',
        horde: 'text-horde-red',
        league: 'text-league-blue'
    }
    return colors[faction] || 'text-foreground'
}

const getRarityDotClass = (rarity) => {
    const classes = {
        MY: 'bg-red-500',
        LE: 'bg-yellow-500',
        EP: 'bg-purple-500',
        RA: 'bg-blue-500'
    }
    return classes[rarity] || 'bg-slate-500'
}

const getGearIcon = (gear) => {
    const icons = {
        'titans-might': Mountain,
        'fury-of-blood': Droplet,
        'glory-of-knight': Crown
    }
    return icons[gear] || Shield
}

const getGearBadgeClass = (gear) => {
    const classes = {
        'titans-might': 'bg-violet-500/20 text-violet-400 border border-violet-500/30',
        'fury-of-blood': 'bg-red-500/20 text-red-400 border border-red-500/30',
        'glory-of-knight': 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    }
    return classes[gear] || 'bg-foreground/10 text-foreground/60 border border-border'
}

const getGearDisplayName = (gear) => {
    const names = {
        'titans-might': "Titan's Might",
        'fury-of-blood': 'Fury of Blood',
        'glory-of-knight': 'Glory of Knight'
    }
    return names[gear] || gear
}
</script>