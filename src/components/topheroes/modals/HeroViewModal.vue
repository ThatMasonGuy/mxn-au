<!-- components/topheroes/modals/HeroViewModal.vue -->
<template>
    <Dialog :open="isOpen" @update:open="handleOpenChange">
        <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                        :class="factionGradient">
                        {{ hero?.name?.charAt(0) || 'H' }}
                    </div>
                    <span>{{ hero?.name || 'Hero Details' }}</span>
                </DialogTitle>
                <DialogDescription>
                    View detailed information about this hero
                </DialogDescription>
            </DialogHeader>

            <div v-if="hero" class="space-y-6">
                <!-- Hero Image and Basic Info -->
                <div class="bg-gradient-to-br from-foreground/5 to-foreground/10 rounded-xl p-6">
                    <div class="flex items-center gap-6">
                        <!-- Hero Avatar -->
                        <div class="relative">
                            <div class="h-24 w-24 rounded-2xl flex items-center justify-center shadow-xl"
                                :class="factionGradient">
                                <span class="text-4xl font-bold text-white">
                                    {{ hero.name.charAt(0) }}
                                </span>
                            </div>
                            <div class="absolute -bottom-2 -right-2">
                                <div class="px-2 py-1 rounded-full shadow-md" :class="rarityBadgeClass">
                                    <component :is="rarityIcon" class="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <!-- Hero Details -->
                        <div class="flex-1 space-y-3">
                            <div>
                                <h3 class="text-2xl font-bold">{{ hero.name }}</h3>
                                <p class="text-sm text-foreground/60">Hero ID: {{ hero.id }}</p>
                            </div>

                            <div class="flex items-center gap-4">
                                <div class="flex items-center gap-2">
                                    <component :is="factionIcon" class="h-5 w-5" :class="factionColor" />
                                    <span class="font-medium" :class="factionColor">
                                        {{ selectedFaction?.name || hero.faction }}
                                    </span>
                                </div>
                                <div class="px-3 py-1 rounded-full" :class="rarityBadgeClass">
                                    <span class="text-sm font-bold">{{ selectedRarity?.name || hero.rarity }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tags/Roles -->
                <div>
                    <h4 class="text-sm font-medium mb-3 text-foreground/80 flex items-center gap-2">
                        <Tag class="h-4 w-4 text-velaris-purple" />
                        Roles & Abilities
                    </h4>
                    <div class="flex flex-wrap gap-2">
                        <span v-if="!selectedTags.length" class="text-foreground/50 italic">No roles assigned</span>
                        <span v-for="tag in selectedTags" :key="tag.id"
                            class="px-3 py-1.5 bg-gradient-to-r from-velaris-purple/20 to-velaris-teal/20 border border-velaris-purple/30 rounded-full text-sm font-medium">
                            {{ tag.name }}
                        </span>
                    </div>
                </div>

                <!-- Faction Counter Info -->
                <div>
                    <h4 class="text-sm font-medium mb-3 text-foreground/80 flex items-center gap-2">
                        <Swords class="h-4 w-4 text-velaris-amber" />
                        Faction Advantages
                    </h4>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div class="flex items-center gap-2 mb-1">
                                <TrendingUp class="h-4 w-4 text-green-400" />
                                <span class="text-sm font-medium text-green-400">Strong Against</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <component :is="getCounterFactionIcon(hero.faction, 'beats')" class="h-5 w-5"
                                    :class="getCounterFactionColor(hero.faction, 'beats')" />
                                <span class="text-sm font-medium">
                                    {{ getCounterFactionName(hero.faction, 'beats') }}
                                </span>
                            </div>
                            <p class="text-xs text-green-400/80 mt-1">
                                +{{ getFactionBuffPercent(hero.faction) }}% damage
                            </p>
                        </div>

                        <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <div class="flex items-center gap-2 mb-1">
                                <TrendingDown class="h-4 w-4 text-red-400" />
                                <span class="text-sm font-medium text-red-400">Weak Against</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <component :is="getCounterFactionIcon(hero.faction, 'loses_to')" class="h-5 w-5"
                                    :class="getCounterFactionColor(hero.faction, 'loses_to')" />
                                <span class="text-sm font-medium">
                                    {{ getCounterFactionName(hero.faction, 'loses_to') }}
                                </span>
                            </div>
                            <p class="text-xs text-red-400/80 mt-1">
                                -{{ getFactionBuffPercent(hero.faction) }}% damage
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Hero Bonds -->
                <div v-if="heroBonds.length > 0">
                    <h4 class="text-sm font-medium mb-3 text-foreground/80 flex items-center gap-2">
                        <Link class="h-4 w-4 text-velaris-teal" />
                        Hero Bonds
                    </h4>
                    <div class="space-y-3">
                        <div v-for="bond in heroBonds" :key="bond.id"
                            class="p-3 bg-gradient-to-r from-velaris-teal/10 to-emerald-500/10 border border-velaris-teal/20 rounded-lg">
                            <div class="flex items-center gap-2 mb-2">
                                <Zap class="h-4 w-4 text-velaris-teal" />
                                <span class="font-medium text-velaris-teal">Bond with {{ formatBondHeroes(bond.heroes,
                                    hero.id) }}</span>
                            </div>
                            <div class="text-sm text-foreground/70">
                                {{ formatBondBuffs(bond.buffs) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DialogFooter class="gap-3">
                <Button variant="outline" @click="handleClose">
                    Close
                </Button>
                <Button @click="addToQueue" class="bg-gradient-to-r from-velaris-purple to-velaris-teal">
                    <Plus class="h-4 w-4 mr-2" />
                    Add to Queue
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import {
    Tag, Flame, Leaf, Shield as ShieldIcon, Crown, Star, Gem, Hexagon,
    Swords, TrendingUp, TrendingDown, Link, Zap, BarChart,
    Heart, Sword, Shield, Plus
} from 'lucide-vue-next'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    hero: {
        type: Object,
        default: null
    },
    factions: {
        type: Array,
        required: true
    },
    rarities: {
        type: Array,
        required: true
    },
    tags: {
        type: Array,
        required: true
    },
    bonds: {
        type: Array,
        default: () => []
    },
    store: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:isOpen', 'close', 'add-to-queue'])

// Computed properties
const selectedFaction = computed(() => {
    return props.factions.find(f => f.id === props.hero?.faction)
})

const selectedRarity = computed(() => {
    return props.rarities.find(r => r.id === props.hero?.rarity)
})

const selectedTags = computed(() => {
    if (!props.hero?.tags) return []
    return props.tags.filter(t => props.hero.tags.includes(t.id))
})

const heroBonds = computed(() => {
    if (!props.hero || !props.store) return []
    return props.store.getBondsForHero(props.hero.id)
})

const factionGradient = computed(() => {
    const gradients = {
        nature: 'bg-gradient-to-br from-nature-green to-emerald-600',
        horde: 'bg-gradient-to-br from-horde-red to-red-600',
        league: 'bg-gradient-to-br from-league-blue to-blue-600'
    }
    return gradients[props.hero?.faction] || 'bg-gradient-to-br from-velaris-purple to-velaris-teal'
})

const factionIcon = computed(() => {
    const icons = { nature: Leaf, horde: Flame, league: ShieldIcon }
    return icons[props.hero?.faction] || ShieldIcon
})

const factionColor = computed(() => {
    const colors = {
        nature: 'text-nature-green',
        horde: 'text-horde-red',
        league: 'text-league-blue'
    }
    return colors[props.hero?.faction] || 'text-foreground'
})

const rarityIcon = computed(() => {
    const icons = {
        mythic: Crown,
        legendary: Star,
        epic: Gem,
        rare: Hexagon
    }
    return icons[props.hero?.rarity] || Star
})

const rarityBadgeClass = computed(() => {
    const classes = {
        mythic: 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border border-red-500/30',
        legendary: 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border border-yellow-500/30',
        epic: 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 border border-purple-500/30',
        rare: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30'
    }
    return classes[props.hero?.rarity] || 'bg-foreground/10 text-foreground border-border'
})

// Helper methods
const handleOpenChange = (open) => {
    emit('update:isOpen', open)
    if (!open) {
        emit('close')
    }
}

const handleClose = () => {
    emit('update:isOpen', false)
    emit('close')
}

const addToQueue = () => {
    emit('add-to-queue', props.hero)
    handleClose()
}

const getCounterFactionIcon = (faction, type) => {
    const factionData = props.factions.find(f => f.id === faction)
    if (!factionData) return ShieldIcon

    const targetFactionId = factionData[type]
    const icons = { nature: Leaf, horde: Flame, league: ShieldIcon }
    return icons[targetFactionId] || ShieldIcon
}

const getCounterFactionColor = (faction, type) => {
    const factionData = props.factions.find(f => f.id === faction)
    if (!factionData) return 'text-foreground'

    const targetFactionId = factionData[type]
    const colors = {
        nature: 'text-nature-green',
        horde: 'text-horde-red',
        league: 'text-league-blue'
    }
    return colors[targetFactionId] || 'text-foreground'
}

const getCounterFactionName = (faction, type) => {
    const factionData = props.factions.find(f => f.id === faction)
    if (!factionData) return 'Unknown'

    const targetFactionId = factionData[type]
    const targetFaction = props.factions.find(f => f.id === targetFactionId)
    return targetFaction?.name || targetFactionId
}

const getFactionBuffPercent = (faction) => {
    const factionData = props.factions.find(f => f.id === faction)
    return factionData?.buff_percent || 25
}

const formatBondHeroes = (heroIds, currentHeroId) => {
    return heroIds
        .filter(id => id !== currentHeroId)
        .map(id => {
            const hero = props.store?.getHeroById(id)
            return hero?.name || id
        })
        .join(' & ')
}

const formatBondBuffs = (buffs) => {
    return buffs.map(buff => `+${buff.value}% ${buff.stat.toUpperCase()}`).join(', ')
}
</script>

<style scoped>
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