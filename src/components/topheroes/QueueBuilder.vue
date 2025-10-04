<!-- components/topheroes/QueueBuilder.vue -->
<template>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h2 class="text-xl font-semibold text-velaris-purple">
                {{ isEditing ? 'Edit Queue' : 'Create New Queue' }}
            </h2>
            <p class="text-sm text-foreground/70 mt-1">
                {{ isEditing ? 'Modify your team composition and details' : 'Build your team and set queue details'
                }}
            </p>
        </div>
        <div class="flex gap-3">
            <button @click="$emit('cancel')"
                class="flex items-center bg-slate-500/10 text-slate-400 border border-slate-500/30 hover:bg-slate-500/20 transition-all duration-200 font-medium rounded-xl py-2 px-4">
                <X class="h-4 w-4 mr-2" />
                Cancel
            </button>

            <button @click="saveQueue" :disabled="!canSave || isSaving"
                class="flex items-center bg-gradient-to-r from-velaris-purple to-velaris-teal text-white font-medium py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                <Save class="h-4 w-4 mr-2" />
                <span v-if="isSaving">Saving...</span>
                <span v-else>{{ isEditing ? 'Update Queue' : 'Create Queue' }}</span>
            </button>
        </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Queue Details Panel -->
        <div class="xl:col-span-1 space-y-6">
            <!-- Basic Info -->
            <div class="bg-gradient-to-br from-card/80 to-card border border-border/50 rounded-xl shadow-sm p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings class="h-5 w-5 text-velaris-purple" />
                    Queue Details
                </h3>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2 text-orange-400">Queue Name*</label>
                        <input v-model="queueForm.name" type="text" required
                            class="w-full px-3 py-2 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 focus:border-velaris-purple/50 transition-all"
                            placeholder="e.g., Main PvP Team" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2 text-blue-400">Description</label>
                        <textarea v-model="queueForm.description"
                            class="w-full px-3 py-2 bg-background to-background border border-border/50 rounded-lg h-20 focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 focus:border-velaris-purple/50 resize-none transition-all"
                            placeholder="Describe your team strategy..."></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-sm font-medium mb-2 text-green-400">Created by</label>
                            <input v-model="queueForm.createdBy" type="text" maxlength="16"
                                class="w-full px-3 py-2 bg-background to-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 focus:border-velaris-purple/50 transition-all"
                                placeholder="Username" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-2 text-purple-400">From Server</label>
                            <input v-model="queueForm.fromServer" type="number" min="1" max="99999"
                                class="w-full px-3 py-2 bg-background to-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 focus:border-velaris-purple/50 transition-all"
                                placeholder="Server #" />
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <div class="flex items-center space-x-2">
                            <Checkbox :id="'visible-queue'" :checked="queueForm.isVisible"
                                @update:checked="queueForm.isVisible = $event" />
                            <label :for="'visible-queue'" class="text-sm font-medium text-teal-400 cursor-pointer">
                                Visible
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Team Synergies -->
            <div
                class="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl shadow-sm p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap class="h-5 w-5 text-emerald-400" />
                    Team Synergies
                </h3>

                <div class="space-y-3">
                    <!-- Faction Auras -->
                    <div v-if="activeFactionAura"
                        class="p-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-lg">
                        <div class="flex items-center gap-2 mb-2">
                            <Shield class="h-4 w-4 text-purple-400" />
                            <span class="font-medium text-purple-400">Faction Aura Active</span>
                        </div>
                        <p class="text-sm text-foreground/70 mb-2">
                            {{ dominantFactionCount }} {{ getFactionName(dominantFaction) }} heroes
                        </p>
                        <div class="text-xs space-y-1">
                            <div v-for="buff in activeFactionAura.buffs" :key="`${buff.stat}-${buff.value}`"
                                class="text-purple-400 font-medium">
                                +{{ buff.value }}% {{ buff.stat.toUpperCase() }} ({{ buff.applies_to }})
                            </div>
                            <div v-if="activeFactionAura.counter_reduction"
                                class="text-purple-400 font-medium pt-2 border-t border-purple-500/20">
                                Faction counter reduced: {{ activeFactionAura.counter_reduction.original_counter }}% →
                                {{ activeFactionAura.counter_reduction.result_counter }}%
                            </div>
                        </div>
                    </div>

                    <!-- Active Hero Bonds -->
                    <div v-for="bond in activeTeamBonds" :key="bond.id"
                        class="p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg">
                        <div class="flex items-center gap-2 mb-2">
                            <Zap class="h-4 w-4 text-emerald-400" />
                            <span class="font-medium text-emerald-400">Hero Bond Active</span>
                        </div>
                        <p class="text-sm text-foreground/70 mb-2">{{ formatBondHeroes(bond.heroes) }}</p>
                        <div class="text-xs text-emerald-400 font-medium">
                            {{ formatBondBuffs(bond.buffs) }}
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-if="!hasAnySynergies" class="text-center py-8 text-foreground/60">
                        <Zap class="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p class="text-sm">No active synergies</p>
                        <p class="text-xs text-foreground/40 mt-1">Add 4+ heroes from the same faction for aura bonuses,
                            or heroes with matching bonds</p>
                    </div>
                </div>
            </div>

            <!-- Validation Errors -->
            <div v-if="validationErrors.length > 0"
                class="bg-gradient-to-r from-red-500/20 to-red-600/10 border border-red-500/30 rounded-xl shadow-sm p-4">
                <h4 class="text-sm font-medium text-red-400 mb-2">Please fix the following:</h4>
                <ul class="text-sm text-red-400 space-y-1">
                    <li v-for="error in validationErrors" :key="error" class="flex items-center gap-2">
                        <X class="h-3 w-3" />
                        {{ error }}
                    </li>
                </ul>
            </div>
        </div>

        <!-- Team Formation & Extras Panel -->
        <div class="xl:col-span-2 space-y-6">
            <!-- Team Formation -->
            <div class="bg-gradient-to-br from-card/80 to-card/60 border border-border/50 rounded-xl shadow-sm p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold flex items-center gap-2">
                        <Users class="h-5 w-5 text-velaris-purple" />
                        Team Formation
                    </h3>
                    <div class="flex gap-2">
                        <button @click="clearTeam" v-if="teamHeroCount > 0"
                            class="bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all duration-200 font-medium rounded-xl text-sm px-3 py-2 flex items-center gap-2">
                            <RotateCcw class="h-4 w-4" />
                            Clear All
                        </button>
                        <button @click="randomizeTeam" v-if="availableHeroes.length >= 6"
                            class="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all duration-200 font-medium rounded-xl text-sm px-3 py-2 flex items-center gap-2">
                            <Shuffle class="h-4 w-4" />
                            Random Team
                        </button>
                    </div>
                </div>

                <div class="grid gap-4">
                    <!-- Back Row -->
                    <div class="space-y-2">
                        <h4 class="text-sm font-medium text-red-400 flex items-center gap-2">
                            <Shield class="h-4 w-4" />
                            Back Row
                        </h4>
                        <div class="grid grid-cols-2 gap-4">
                            <TeamSlot v-for="position in ['back1', 'back2']" :key="position" :position="position"
                                :hero="currentTeam[position]" :store="store"
                                :position-name="`Back ${position === 'back1' ? '1' : '2'}`" :gear-data="teamGearData"
                                @drop="onDrop" @remove="removeHero" @gear="openGear" />
                        </div>
                    </div>

                    <!-- Mid Row -->
                    <div class="space-y-2">
                        <h4 class="text-sm font-medium text-amber-400 flex items-center gap-2">
                            <Swords class="h-4 w-4" />
                            Mid Row
                        </h4>
                        <div class="grid grid-cols-2 gap-4">
                            <TeamSlot v-for="position in ['mid1', 'mid2']" :key="position" :position="position"
                                :hero="currentTeam[position]" :store="store"
                                :position-name="`Mid ${position === 'mid1' ? '1' : '2'}`" :gear-data="teamGearData"
                                @drop="onDrop" @remove="removeHero" @gear="openGear" />
                        </div>
                    </div>

                    <!-- Front Row -->
                    <div class="space-y-2">
                        <h4 class="text-sm font-medium text-green-400 flex items-center gap-2">
                            <Sword class="h-4 w-4" />
                            Front Row
                        </h4>
                        <div class="grid grid-cols-2 gap-4">
                            <TeamSlot v-for="position in ['front1', 'front2']" :key="position" :position="position"
                                :hero="currentTeam[position]" :store="store"
                                :position-name="`Front ${position === 'front1' ? '1' : '2'}`" :gear-data="teamGearData"
                                @drop="onDrop" @remove="removeHero" @gear="openGear" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Relics, Pet, and Skin -->
            <div class="grid grid-cols-5 gap-4">
                <!-- Relics (3 columns) -->
                <div class="col-span-3">
                    <div class="bg-gradient-to-br from-card/80 to-card border border-border/50 rounded-xl shadow-sm p-4">
                        <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Gem class="h-4 w-4 text-cyan-400" />
                            Relics
                            <span class="text-xs text-foreground/60 font-normal">(Order matters: 1→2→3)</span>
                        </h3>
                        <div class="grid grid-cols-3 gap-3">
                            <RelicSlot v-for="slot in ['slot1', 'slot2', 'slot3']" :key="slot" :slot="slot"
                                :relic="teamRelics[slot]" :store="store" :slot-number="slot.replace('slot', '')"
                                @select="openRelicSelection(slot)" @remove="removeRelic(slot)" />
                        </div>
                    </div>
                </div>

                <!-- Pet (1 column) -->
                <div class="col-span-1">
                    <div class="bg-gradient-to-br from-card/80 to-card border border-border/50 rounded-xl shadow-sm p-4">
                        <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Dog class="h-4 w-4 text-pink-400" />
                            Pet
                        </h3>
                        <PetSlot :pet="teamPet" :store="store" @select="openPetSelection" @remove="removePet" />
                    </div>
                </div>

                <!-- Troop Skin (1 column) -->
                <div class="col-span-1">
                    <div class="bg-gradient-to-br from-card/80 to-card border border-border/50 rounded-xl shadow-sm p-4">
                        <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Shirt class="h-4 w-4 text-violet-400" />
                            Skin
                        </h3>
                        <SkinSlot :skin="teamSkin" :store="store" @select="openSkinSelection" @remove="removeSkin" />
                    </div>
                </div>
            </div>

            <!-- Available Heroes -->
            <div
                class="bg-gradient-to-br from-card/80 to-card/60 border border-border/50 rounded-xl shadow-sm relative">
                <div class="p-6 pb-4">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold flex items-center gap-2">
                            <Library class="h-5 w-5 text-velaris-purple" />
                            Available Heroes
                        </h3>
                        <div class="flex items-center gap-2 text-sm text-foreground/60">
                            <span>{{ availableHeroes.length }} available</span>
                        </div>
                    </div>
                </div>

                <div v-if="availableHeroes.length > 0" class="px-6">
                    <div class="space-y-6 max-h-96 overflow-y-auto relative"
                        :class="availableHeroes.length > 12 ? 'scrollbar-fade' : ''">
                        <!-- Faction Groups -->
                        <div v-for="faction in factionOrder" :key="faction"
                            v-show="getAvailableHeroesByFaction(faction).length > 0" class="space-y-3">
                            <!-- Faction Header -->
                            <div class="flex items-center gap-3 sticky top-0 bg-card/80 backdrop-blur-sm py-2 z-10">
                                <div class="h-8 w-8 rounded-lg flex items-center justify-center shadow-md"
                                    :class="getFactionGradient(faction)">
                                    <component :is="getFactionIcon(faction)" class="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <h4 class="font-semibold text-sm" :class="getFactionColor(faction)">
                                        {{ getFactionName(faction) }}
                                    </h4>
                                    <p class="text-xs text-foreground/60">
                                        {{ getAvailableHeroesByFaction(faction).length }} heroes
                                        <span v-if="faction === dominantFaction" class="text-velaris-purple">•
                                            Priority</span>
                                    </p>
                                </div>
                            </div>

                            <!-- Heroes Grid for this Faction -->
                            <div
                                class="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 pl-11 pb-4 pr-2">
                                <HeroMiniCard v-for="hero in getAvailableHeroesByFaction(faction)" :key="hero.id"
                                    :hero="hero" :store="store" @click="addHeroToTeam(hero)"
                                    @dragstart="onDragStart($event, hero)" />
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="text-center py-8 text-foreground/60 px-6">
                    <Library class="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p class="text-sm">All heroes are assigned to the team</p>
                </div>

                <div class="p-6 pt-0"></div>
            </div>
        </div>
    </div>

    <!-- Modals -->
    <GearModal v-model:isOpen="showGearModal" :hero="gearModalHero" :position="gearModalPosition"
        :gear-data="currentGearData" :available-gear="store.gear" @save="saveGearData" />

    <SelectionModal v-model:isOpen="showSelectionModal" :title="selectionModalTitle"
        :description="selectionModalDescription" :items="selectionModalItems" :currentSelection="currentSelection"
        :groupByType="selectionModalGroupByType" :disabledItems="disabledRelicTypes" @select="handleSelection"
        @clear="handleClearSelection" />
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import {
    Users, Shield, Swords, Sword, Library, RotateCcw, Shuffle, Zap,
    Settings, X, Save, Flame, Leaf, ChevronDown, Gem, Dog, Shirt
} from 'lucide-vue-next'
import { Checkbox } from '@/components/ui/checkbox'
import TeamSlot from './TeamSlot.vue'
import HeroMiniCard from './HeroMiniCard.vue'
import RelicSlot from './RelicSlot.vue'
import PetSlot from './PetSlot.vue'
import SkinSlot from './SkinSlot.vue'
import GearModal from './modals/GearModal.vue'
import SelectionModal from './modals/SelectionModal.vue'

const props = defineProps({
    queue: {
        type: Object,
        default: null
    },
    availableHeroes: {
        type: Array,
        required: true
    },
    store: {
        type: Object,
        required: true
    },
    teamGearData: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['save', 'cancel', 'update-gear'])

const isSaving = ref(false)

// Queue form data
const queueForm = reactive({
    name: '',
    description: '',
    createdBy: '',
    fromServer: 10154,
    isVisible: true
})

// Team formation state
const currentTeam = reactive({
    front1: null,
    front2: null,
    mid1: null,
    mid2: null,
    back1: null,
    back2: null
})

// Gear tracking
const teamGearData = ref({})

// Relics, Pet, Skin state
const teamRelics = ref({
    slot1: null,
    slot2: null,
    slot3: null
})
const teamPet = ref(null)
const teamSkin = ref(null)

// Gear modal state
const showGearModal = ref(false)
const gearModalPosition = ref('')
const gearModalHero = ref(null)

// Selection modal state
const showSelectionModal = ref(false)
const selectionModalType = ref('') // 'relic', 'pet', 'skin'
const selectionModalSlot = ref('') // for relics

// Current gear data for the modal
const currentGearData = computed(() => {
    if (gearModalHero.value) {
        return teamGearData.value[gearModalHero.value.id] || {}
    }
    return {}
})

// Selection modal configuration
const selectionModalTitle = computed(() => {
    if (selectionModalType.value === 'relic') {
        const slotNum = selectionModalSlot.value.replace('slot', '')
        return `Select Relic (Position ${slotNum})`
    }
    if (selectionModalType.value === 'pet') return 'Select Pet'
    if (selectionModalType.value === 'skin') return 'Select Troop Skin'
    return ''
})

const selectionModalDescription = computed(() => {
    if (selectionModalType.value === 'relic') {
        return 'You can only equip one relic of each type (Damage, Defense, Utility)'
    }
    return 'Choose an item for your team'
})

const selectionModalItems = computed(() => {
    if (selectionModalType.value === 'relic') return props.store.relics
    if (selectionModalType.value === 'pet') return props.store.pets
    if (selectionModalType.value === 'skin') return props.store.skins
    return []
})

const selectionModalGroupByType = computed(() => {
    return selectionModalType.value === 'relic'
})

const currentSelection = computed(() => {
    if (selectionModalType.value === 'relic') {
        return teamRelics.value[selectionModalSlot.value]
    }
    if (selectionModalType.value === 'pet') return teamPet.value
    if (selectionModalType.value === 'skin') return teamSkin.value
    return null
})

// Get already used relic types to disable them
const disabledRelicTypes = computed(() => {
    if (selectionModalType.value !== 'relic') return []
    
    const usedTypes = new Set()
    Object.entries(teamRelics.value).forEach(([slot, relic]) => {
        // Don't count the current slot being edited
        if (slot !== selectionModalSlot.value && relic?.type) {
            usedTypes.add(relic.type)
        }
    })
    
    // Return IDs of relics with already-used types
    return props.store.relics
        .filter(r => usedTypes.has(r.type))
        .map(r => r.id)
})

// Computed properties
const isEditing = computed(() => !!props.queue)

const teamHeroes = computed(() => {
    return Object.values(currentTeam).filter(Boolean)
})

const teamHeroCount = computed(() => {
    return teamHeroes.value.length
})

const factionDistribution = computed(() => {
    const distribution = { nature: 0, horde: 0, league: 0 }
    teamHeroes.value.forEach(hero => {
        if (distribution.hasOwnProperty(hero.faction)) {
            distribution[hero.faction]++
        }
    })
    return distribution
})

const dominantFactionCount = computed(() => {
    return Math.max(...Object.values(factionDistribution.value), 0)
})

const activeTeamBonds = computed(() => {
    const teamHeroIds = teamHeroes.value.map(hero => hero.id)
    return props.store.getActiveBondsFiltered(teamHeroIds)
})

// Faction aura calculation
const activeFactionAura = computed(() => {
    const dominantFactionHeroes = teamHeroes.value.filter(hero =>
        hero.faction === dominantFaction.value &&
        (hero.rarity === 'legendary' || hero.rarity === 'mythic')
    )

    if (dominantFactionHeroes.length >= 4) {
        return props.store.getFactionAuraForCount(dominantFactionHeroes.length)
    }

    return null
})

const hasAnySynergies = computed(() => {
    return activeFactionAura.value !== null || activeTeamBonds.value.length > 0
})

const availableHeroes = computed(() => {
    if (!props.availableHeroes?.length) return []

    const usedHeroIds = Object.values(currentTeam).filter(Boolean).map(hero => hero.id)
    return props.availableHeroes.filter(hero => !usedHeroIds.includes(hero.id))
})

const dominantFaction = computed(() => {
    if (teamHeroCount.value === 0) return 'league'

    const maxCount = Math.max(...Object.values(factionDistribution.value))
    const dominantFactions = Object.entries(factionDistribution.value)
        .filter(([faction, count]) => count === maxCount)
        .map(([faction]) => faction)

    const priorityOrder = ['league', 'nature', 'horde']
    return priorityOrder.find(faction => dominantFactions.includes(faction)) || dominantFactions[0]
})

const factionOrder = computed(() => {
    const baseFactions = ['nature', 'horde', 'league']
    const dominant = dominantFaction.value

    return [dominant, ...baseFactions.filter(f => f !== dominant)]
})

const getAvailableHeroesByFaction = (faction) => {
    const factionHeroes = availableHeroes.value.filter(hero => hero.faction === faction)
    const rarityOrder = { 'mythic': 0, 'legendary': 1, 'epic': 2, 'rare': 3 }

    return factionHeroes.sort((a, b) => {
        const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity]
        if (rarityDiff !== 0) return rarityDiff
        return a.name.localeCompare(b.name)
    })
}

const validationErrors = computed(() => {
    const errors = []

    if (!queueForm.name.trim()) {
        errors.push('Queue name is required')
    }

    if (teamHeroCount.value === 0) {
        errors.push('At least one hero is required')
    }

    return errors
})

const canSave = computed(() => {
    return validationErrors.value.length === 0
})

// Helper functions
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

const getFactionName = (faction) => {
    return props.store.getFactionById(faction)?.name || faction
}

const formatBondBuffs = (buffs) => {
    return buffs.map(buff => `+${buff.value}% ${buff.stat.toUpperCase()}`).join(', ')
}

const formatBondHeroes = (heroIds) => {
    return heroIds.map(id => {
        const hero = props.store.getHeroById(id)
        return hero?.name || id
    }).join(', ')
}

const getFactionGradient = (faction) => {
    const gradients = {
        nature: 'bg-gradient-to-br from-nature-green to-emerald-600',
        horde: 'bg-gradient-to-br from-horde-red to-red-600',
        league: 'bg-gradient-to-br from-league-blue to-blue-600'
    }
    return gradients[faction] || 'bg-gradient-to-br from-velaris-purple to-velaris-teal'
}

// Team management
const addHeroToTeam = (hero) => {
    const positions = ['front1', 'front2', 'mid1', 'mid2', 'back1', 'back2']
    for (const position of positions) {
        if (!currentTeam[position]) {
            currentTeam[position] = hero
            break
        }
    }
}

const removeHero = (position) => {
    currentTeam[position] = null
}

const clearTeam = () => {
    Object.keys(currentTeam).forEach(position => {
        currentTeam[position] = null
    })
}

const randomizeTeam = () => {
    clearTeam()
    const shuffled = [...availableHeroes.value].sort(() => Math.random() - 0.5)
    Object.keys(currentTeam).forEach((position, index) => {
        currentTeam[position] = shuffled[index] || null
    })
}

// Relics management
const openRelicSelection = (slot) => {
    selectionModalType.value = 'relic'
    selectionModalSlot.value = slot
    showSelectionModal.value = true
}

const removeRelic = (slot) => {
    teamRelics.value[slot] = null
}

// Pet management
const openPetSelection = () => {
    selectionModalType.value = 'pet'
    showSelectionModal.value = true
}

const removePet = () => {
    teamPet.value = null
}

// Skin management
const openSkinSelection = () => {
    selectionModalType.value = 'skin'
    showSelectionModal.value = true
}

const removeSkin = () => {
    teamSkin.value = null
}

// Selection modal handlers
const handleSelection = (item) => {
    if (selectionModalType.value === 'relic') {
        teamRelics.value[selectionModalSlot.value] = item
    } else if (selectionModalType.value === 'pet') {
        teamPet.value = item
    } else if (selectionModalType.value === 'skin') {
        teamSkin.value = item
    }
}

const handleClearSelection = () => {
    if (selectionModalType.value === 'relic') {
        teamRelics.value[selectionModalSlot.value] = null
    } else if (selectionModalType.value === 'pet') {
        teamPet.value = null
    } else if (selectionModalType.value === 'skin') {
        teamSkin.value = null
    }
}

// Drag and drop
const onDrop = (event, position) => {
    event.preventDefault()
    const dragData = JSON.parse(event.dataTransfer.getData('text/plain'))

    if (dragData.type === 'hero') {
        currentTeam[position] = dragData.data
    } else if (dragData.type === 'team-hero') {
        const sourcePosition = dragData.position
        const sourceHero = dragData.data
        const targetHero = currentTeam[position]

        currentTeam[position] = sourceHero
        currentTeam[sourcePosition] = targetHero || null
    }
}

const onDragStart = (event, hero) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'hero', data: hero }))
}

const openGear = (position) => {
    if (currentTeam[position]) {
        gearModalPosition.value = position
        gearModalHero.value = currentTeam[position]
        showGearModal.value = true
    }
}

const saveGearData = (data) => {
    if (gearModalHero.value) {
        teamGearData.value[gearModalHero.value.id] = { ...data }
        emit('update-gear', teamGearData.value)
    }

    showGearModal.value = false
    gearModalPosition.value = ''
    gearModalHero.value = null
}

// Save queue
const saveQueue = async () => {
    if (!canSave.value) return

    isSaving.value = true

    try {
        const heroes = []
        Object.entries(currentTeam).forEach(([position, hero]) => {
            if (hero) {
                heroes.push({ heroId: hero.id, position })
            }
        })

        const queueData = {
            name: queueForm.name,
            description: queueForm.description,
            createdBy: queueForm.createdBy,
            fromServer: queueForm.fromServer,
            isVisible: queueForm.isVisible,
            heroes,
            gearData: teamGearData.value,
            relics: {
                slot1: teamRelics.value.slot1?.id || null,
                slot2: teamRelics.value.slot2?.id || null,
                slot3: teamRelics.value.slot3?.id || null
            },
            pet: teamPet.value?.id || null,
            skin: teamSkin.value?.id || null
        }

        emit('save', queueData)
    } catch (error) {
        console.error('Error saving queue:', error)
    } finally {
        isSaving.value = false
    }
}

// Initialize form with existing queue data
watch(() => props.queue, (queue) => {
    if (queue) {
        Object.assign(queueForm, {
            name: queue.name || '',
            description: queue.description || '',
            createdBy: queue.createdBy || '',
            fromServer: queue.fromServer || null,
            isVisible: queue.isVisible !== false
        })

        Object.keys(currentTeam).forEach(position => {
            currentTeam[position] = null
        })

        if (queue.heroes) {
            queue.heroes.forEach(({ heroId, position }) => {
                const hero = props.availableHeroes.find(h => h.id === heroId)
                if (hero && currentTeam.hasOwnProperty(position)) {
                    currentTeam[position] = hero
                }
            })
        }

        if (queue.gearData) {
            teamGearData.value = { ...queue.gearData }
        } else {
            teamGearData.value = {}
        }

        // Load relics
        if (queue.relics) {
            teamRelics.value.slot1 = props.store.getRelicById(queue.relics.slot1)
            teamRelics.value.slot2 = props.store.getRelicById(queue.relics.slot2)
            teamRelics.value.slot3 = props.store.getRelicById(queue.relics.slot3)
        } else {
            teamRelics.value = { slot1: null, slot2: null, slot3: null }
        }

        // Load pet
        teamPet.value = queue.pet ? props.store.getPetById(queue.pet) : null

        // Load skin
        teamSkin.value = queue.skin ? props.store.getSkinById(queue.skin) : null
    } else {
        Object.assign(queueForm, {
            name: '',
            description: '',
            createdBy: '',
            fromServer: null,
            isVisible: true
        })
        clearTeam()
        teamGearData.value = {}
        teamRelics.value = { slot1: null, slot2: null, slot3: null }
        teamPet.value = null
        teamSkin.value = null
    }
}, { immediate: true })
</script>

<style scoped>
.scrollbar-fade {
    position: relative;
}

.scrollbar-fade::-webkit-scrollbar {
    width: 6px;
}

.scrollbar-fade::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-fade::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.3);
    border-radius: 3px;
}

.scrollbar-fade::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.5);
}
</style>