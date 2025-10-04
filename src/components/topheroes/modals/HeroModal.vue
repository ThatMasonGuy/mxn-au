<!-- components/topheroes/modals/HeroModal.vue -->
<template>
    <Dialog :open="isOpen" @update:open="handleOpenChange">
        <DialogContent class="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>
                    {{ isEditing ? 'Edit Hero' : 'Create New Hero' }}
                </DialogTitle>
                <DialogDescription>
                    {{ isEditing ? 'Update hero information' : 'Add a new hero to your collection' }}
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="saveHero" class="space-y-4">
                <!-- Basic Info -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Hero Name*</label>
                        <input v-model="heroForm.name" type="text" required
                            class="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50"
                            placeholder="e.g., Storm Maiden" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Hero ID*</label>
                        <input v-model="heroForm.id" type="text" required :disabled="isEditing"
                            class="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 disabled:opacity-50"
                            placeholder="e.g., storm_maiden" />
                        <p class="text-xs text-foreground/60 mt-1">Lowercase with underscores</p>
                    </div>
                </div>

                <!-- Faction and Rarity -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Faction*</label>
                        <select v-model="heroForm.faction" required
                            class="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50">
                            <option value="">Select Faction</option>
                            <option v-for="faction in factions" :key="faction.id" :value="faction.id">
                                {{ faction.name }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Rarity*</label>
                        <select v-model="heroForm.rarity" required
                            class="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50">
                            <option value="">Select Rarity</option>
                            <option v-for="rarity in rarities" :key="rarity.id" :value="rarity.id">
                                {{ rarity.name }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Tags -->
                <div>
                    <label class="block text-sm font-medium mb-2">Tags</label>
                    <div class="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-border rounded-lg p-3">
                        <label v-for="tag in tags" :key="tag.id"
                            class="flex items-center gap-2 text-sm cursor-pointer hover:bg-foreground/5 p-1 rounded">
                            <input v-model="heroForm.tags" type="checkbox" :value="tag.id"
                                class="rounded text-velaris-purple focus:ring-velaris-purple/50" />
                            <span class="truncate" :title="tag.desc">{{ tag.name }}</span>
                        </label>
                    </div>
                    <p class="text-xs text-foreground/60 mt-1">Select all applicable role tags</p>
                </div>

                <!-- Preview -->
                <div v-if="heroForm.name && heroForm.faction && heroForm.rarity" class="p-4 bg-foreground/5 rounded-lg">
                    <h4 class="text-sm font-medium mb-3 text-foreground/70">Preview</h4>
                    <div class="flex items-center gap-4">
                        <div class="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                            :class="factionGradient">
                            {{ heroForm.name.charAt(0) }}
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <h5 class="font-semibold">{{ heroForm.name }}</h5>
                                <span class="rarity-badge" :class="rarityBadgeClass">
                                    {{ selectedRarity?.name }}
                                </span>
                            </div>
                            <div class="flex items-center gap-2 text-sm">
                                <component :is="factionIcon" class="h-4 w-4" :class="factionColor" />
                                <span :class="factionColor">{{ selectedFaction?.name }}</span>
                            </div>
                            <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-1 mt-2">
                                <span v-for="tag in selectedTags.slice(0, 3)" :key="tag.id"
                                    class="px-2 py-1 bg-foreground/10 rounded text-xs">
                                    {{ tag.name }}
                                </span>
                                <span v-if="selectedTags.length > 3"
                                    class="px-2 py-1 bg-velaris-purple/20 text-velaris-purple rounded text-xs">
                                    +{{ selectedTags.length - 3 }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Validation Errors -->
                <div v-if="validationErrors.length > 0" class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h4 class="text-sm font-medium text-red-400 mb-2">Please fix the following:</h4>
                    <ul class="text-sm text-red-400 space-y-1">
                        <li v-for="error in validationErrors" :key="error" class="flex items-center gap-2">
                            <X class="h-3 w-3" />
                            {{ error }}
                        </li>
                    </ul>
                </div>
            </form>

            <DialogFooter class="gap-3">
                <Button type="button" variant="outline" @click="handleClose">
                    Cancel
                </Button>
                <Button type="submit" :disabled="!isFormValid || isSaving" @click="saveHero"
                    class="bg-gradient-to-r from-velaris-purple to-velaris-teal">
                    <Save class="h-4 w-4 mr-2" />
                    <span v-if="isSaving">Saving...</span>
                    <span v-else>{{ isEditing ? 'Update Hero' : 'Create Hero' }}</span>
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { X, Save, Flame, Leaf, Shield } from 'lucide-vue-next'
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
    }
})

const emit = defineEmits(['update:isOpen', 'close', 'save'])

const isSaving = ref(false)

const heroForm = reactive({
    id: '',
    name: '',
    faction: '',
    rarity: '',
    tags: []
})

const isEditing = computed(() => !!props.hero)

// Computed properties for preview
const selectedFaction = computed(() => {
    return props.factions.find(f => f.id === heroForm.faction)
})

const selectedRarity = computed(() => {
    return props.rarities.find(r => r.id === heroForm.rarity)
})

const selectedTags = computed(() => {
    return props.tags.filter(t => heroForm.tags.includes(t.id))
})

const factionGradient = computed(() => {
    const gradients = {
        nature: 'bg-gradient-to-br from-nature-green to-emerald-600',
        horde: 'bg-gradient-to-br from-horde-red to-red-600',
        league: 'bg-gradient-to-br from-league-blue to-blue-600'
    }
    return gradients[heroForm.faction] || 'bg-gradient-to-br from-velaris-purple to-velaris-teal'
})

const factionIcon = computed(() => {
    const icons = { nature: Leaf, horde: Flame, league: Shield }
    return icons[heroForm.faction] || Shield
})

const factionColor = computed(() => {
    const colors = {
        nature: 'text-nature-green',
        horde: 'text-horde-red',
        league: 'text-league-blue'
    }
    return colors[heroForm.faction] || 'text-foreground'
})

const rarityBadgeClass = computed(() => {
    const classes = {
        mythic: 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border border-red-500/30',
        legendary: 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border border-yellow-500/30',
        epic: 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 border border-purple-500/30',
        rare: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30'
    }
    return classes[heroForm.rarity] || 'bg-foreground/10 text-foreground border-border'
})

// Validation
const validationErrors = computed(() => {
    const errors = []

    if (!heroForm.name.trim()) {
        errors.push('Hero name is required')
    }

    if (!heroForm.id.trim()) {
        errors.push('Hero ID is required')
    } else if (!/^[a-z_]+$/.test(heroForm.id)) {
        errors.push('Hero ID must be lowercase letters and underscores only')
    }

    if (!heroForm.faction) {
        errors.push('Faction is required')
    }

    if (!heroForm.rarity) {
        errors.push('Rarity is required')
    }

    return errors
})

const isFormValid = computed(() => {
    return validationErrors.value.length === 0
})

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

// Auto-generate ID from name
watch(() => heroForm.name, (newName) => {
    if (!isEditing.value && newName) {
        heroForm.id = newName.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_')
            .trim()
    }
})

// Initialize form with hero data if editing
watch(() => props.hero, (hero) => {
    if (hero) {
        Object.assign(heroForm, {
            id: hero.id || '',
            name: hero.name || '',
            faction: hero.faction || '',
            rarity: hero.rarity || '',
            tags: hero.tags ? [...hero.tags] : []
        })
    } else {
        // Reset form for new hero
        Object.assign(heroForm, {
            id: '',
            name: '',
            faction: '',
            rarity: '',
            tags: []
        })
    }
}, { immediate: true })

const saveHero = async () => {
    if (!isFormValid.value) return

    isSaving.value = true

    try {
        const heroData = {
            id: heroForm.id,
            name: heroForm.name,
            faction: heroForm.faction,
            rarity: heroForm.rarity,
            tags: [...heroForm.tags]
        }

        emit('save', heroData)
        handleClose()
    } catch (error) {
        console.error('Error saving hero:', error)
    } finally {
        isSaving.value = false
    }
}
</script>

<style scoped>
.rarity-badge {
    @apply inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm;
}
</style>