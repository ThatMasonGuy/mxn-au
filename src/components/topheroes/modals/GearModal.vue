<!-- components/topheroes/modals/GearModal.vue -->
<template>
    <Dialog :open="isOpen" @update:open="handleOpenChange">
        <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Gear Setup</DialogTitle>
                <DialogDescription v-if="hero">
                    Configure gear for {{ hero.name }} in {{ position }}
                </DialogDescription>
            </DialogHeader>

            <div v-if="hero" class="space-y-6">
                <!-- Hero Info -->
                <div
                    class="flex items-center gap-3 p-4 bg-gradient-to-r from-velaris-purple/10 to-velaris-teal/10 border border-velaris-purple/20 rounded-lg">
                    <div class="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
                        :class="factionGradient">
                        {{ hero.name.charAt(0) }}
                    </div>
                    <div>
                        <p class="font-semibold text-lg">{{ hero.name }}</p>
                        <p class="text-sm text-foreground/60 capitalize">{{ position }} • {{ hero.factionName ||
                            hero.faction }}</p>
                    </div>
                </div>

                <!-- Gear Set Selection -->
                <div class="space-y-4">
                    <h4 class="text-sm font-medium text-foreground/80 flex items-center gap-2">
                        <Crown class="h-4 w-4 text-velaris-purple" />
                        Gear Set
                    </h4>

                    <Select v-model="localGearData.gearSet">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="Select a gear set..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">No Gear Set</SelectItem>
                            <SelectItem v-if="!availableGear || availableGear.length === 0" value="loading" disabled>
                                Loading gear sets...
                            </SelectItem>
                            <SelectItem v-for="gear in availableGear" :key="gear.id" :value="gear.id">
                                {{ gear.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <!-- Debug info -->
                    <div class="text-xs text-foreground/50 mt-2">
                        Available gear: {{ availableGear?.length || 0 }} sets
                        <button @click="console.log('Gear data:', availableGear)"
                            class="ml-2 text-velaris-purple hover:underline">
                            Log to console
                        </button>
                    </div>
                </div>

                <!-- Current Gear Summary -->
                <div v-if="localGearData.gearSet && localGearData.gearSet !== 'none'"
                    class="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
                    <h4 class="text-sm font-medium text-green-400 mb-4 flex items-center gap-2">
                        <Zap class="h-4 w-4" />
                        Current Configuration
                    </h4>
                    <div v-if="selectedGearSet" class="text-sm text-foreground/70 space-y-3">
                        <div class="flex items-center justify-between p-2 bg-green-500/10 rounded">
                            <span>Gear Set:</span>
                            <span class="font-medium text-green-400">{{ selectedGearSet.name }}</span>
                        </div>
                        <div v-if="selectedGearSet.description"
                            class="text-xs text-foreground/60 italic p-2 bg-green-500/5 rounded">
                            {{ selectedGearSet.description }}
                        </div>
                        <div class="pt-2 border-t border-green-500/20">
                            <div class="text-xs text-foreground/60 mb-3">Available bonuses:</div>
                            <div class="text-xs space-y-3">
                                <div v-for="level in selectedGearSet.levels" :key="level.tier"
                                    class="p-3 bg-green-500/5 rounded border border-green-500/10">
                                    <div class="font-medium text-green-400 mb-2 flex items-center gap-2">
                                        <Crown class="h-3 w-3" />
                                        {{ level.name }}:
                                    </div>
                                    <div v-for="stat in level.stats" :key="stat"
                                        class="flex items-center gap-2 ml-2 text-foreground/70">
                                        <Sword class="h-3 w-3 text-green-400" />
                                        <span>{{ stat }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- No Gear Set Selected -->
                <div v-if="localGearData.gearSet === 'none'"
                    class="text-center py-8 text-foreground/60 bg-gradient-to-r from-slate-500/10 to-gray-500/10 rounded-lg border border-slate-500/20">
                    <Crown class="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p class="text-sm font-medium mb-2">No gear set selected</p>
                    <p class="text-xs text-foreground/40">Choose a gear set above to configure bonuses</p>
                </div>

                <!-- Notes Section -->
                <div>
                    <label class="block text-sm font-medium mb-2 text-foreground/80 flex items-center gap-2">
                        <FileText class="h-4 w-4 text-velaris-teal" />
                        Notes
                    </label>
                    <textarea v-model="localGearData.notes"
                        class="w-full px-3 py-3 bg-gradient-to-r from-background to-background/90 border border-border/50 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 focus:border-velaris-purple/50 resize-none text-sm transition-all"
                        placeholder="Additional gear notes or strategy..."></textarea>
                </div>
            </div>

            <DialogFooter class="gap-3">
                <Button variant="outline" @click="handleClose" class="border-border/50 hover:bg-foreground/5">
                    Cancel
                </Button>
                <Button v-if="localGearData.gearSet && localGearData.gearSet !== 'none'" variant="destructive"
                    @click="clearAllGear"
                    class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                    <RotateCcw class="h-4 w-4 mr-2" />
                    Clear
                </Button>
                <Button @click="saveGear"
                    class="bg-gradient-to-r from-velaris-purple to-velaris-teal hover:from-velaris-purple/90 hover:to-velaris-teal/90">
                    <Save class="h-4 w-4 mr-2" />
                    Save Gear
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { Save, RotateCcw, Crown, Zap, Sword, FileText } from 'lucide-vue-next'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
    position: {
        type: String,
        default: ''
    },
    gearData: {
        type: Object,
        default: () => ({})
    },
    availableGear: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:isOpen', 'close', 'save'])

const localGearData = reactive({
    gearSet: 'none',
    notes: ''
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

const selectedGearSet = computed(() => {
    if (!localGearData.gearSet || localGearData.gearSet === 'none') return null
    return props.availableGear?.find(gear => gear.id === localGearData.gearSet)
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

const saveGear = () => {
    const gearToSave = localGearData.gearSet === 'none' ? {
        gearSet: '',
        gearSetName: '',
        notes: localGearData.notes
    } : {
        gearSet: localGearData.gearSet,
        gearSetName: selectedGearSet.value?.name || '',
        notes: localGearData.notes
    }

    emit('save', gearToSave)
    handleClose()
}

const clearAllGear = () => {
    Object.assign(localGearData, {
        gearSet: 'none',
        notes: ''
    })
}

// Watch for changes in props to update local state
watch(() => [props.gearData, props.isOpen], ([newData, isOpen]) => {
    if (isOpen && newData) {
        Object.assign(localGearData, {
            gearSet: newData.gearSet || 'none',
            notes: newData.notes || ''
        })
    }
}, { immediate: true, deep: true })

// Reset local data when modal closes
watch(() => props.isOpen, (isOpen) => {
    if (!isOpen) {
        Object.assign(localGearData, {
            gearSet: 'none',
            notes: ''
        })
    }
})
</script>