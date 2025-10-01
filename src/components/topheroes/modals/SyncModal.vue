<!-- components/topheroes/modals/SyncModal.vue -->
<template>
    <Dialog :open="isOpen" @update:open="handleOpenChange">
        <!-- Confirmation Modal -->
        <DialogContent v-if="!showProgress" class="max-w-md">
            <DialogHeader>
                <DialogTitle class="flex items-center gap-2">
                    <Zap class="h-5 w-5 text-velaris-amber" />
                    Sync to Firestore
                </DialogTitle>
                <DialogDescription>
                    This will sync all hero data to Firestore. This should only be done once to initialize the cloud
                    database.
                </DialogDescription>
            </DialogHeader>

            <div class="space-y-4">
                <div class="p-4 bg-velaris-amber/10 border border-velaris-amber/20 rounded-lg">
                    <div class="flex items-center gap-2 mb-2">
                        <Star class="h-4 w-4 text-velaris-amber" />
                        <span class="font-medium text-velaris-amber">One-Time Operation</span>
                    </div>
                    <p class="text-sm text-foreground/70">
                        This will sync all hero data ({{ heroData.heroes.length }} heroes, factions, tags, and bonds) to
                        Firestore.
                        This should only be done once to initialize the cloud database.
                    </p>
                </div>

                <div class="space-y-2 text-sm text-foreground/60">
                    <p><strong>What will be synced:</strong></p>
                    <ul class="list-disc list-inside space-y-1 ml-2">
                        <li>{{ heroData.factions.length }} Factions</li>
                        <li>{{ heroData.rarities.length }} Rarities</li>
                        <li>{{ heroData.tags.length }} Tags</li>
                        <li>{{ heroData.hero_bonds.length }} Hero Bonds</li>
                        <li>{{ heroData.heroes.length }} Heroes</li>
                        <li>Sample queue teams</li>
                    </ul>
                </div>
            </div>

            <DialogFooter class="gap-3">
                <Button variant="outline" @click="handleClose">
                    Cancel
                </Button>
                <Button @click="startSync" class="bg-gradient-to-r from-velaris-amber to-yellow-600 text-white">
                    <Zap class="h-4 w-4 mr-2" />
                    Confirm Sync
                </Button>
            </DialogFooter>
        </DialogContent>

        <!-- Progress Modal -->
        <DialogContent v-else class="max-w-md" :closeOnInteractOutside="false">
            <div class="space-y-6">
                <!-- Header -->
                <div class="text-center">
                    <div
                        class="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-velaris-amber to-yellow-600 flex items-center justify-center">
                        <Zap class="h-8 w-8 text-white" />
                    </div>
                    <DialogTitle>
                        <span v-if="isLoading">Syncing to Firestore...</span>
                        <span v-else-if="error" class="text-red-400">Sync Failed</span>
                        <span v-else-if="success" class="text-green-400">Sync Complete!</span>
                    </DialogTitle>
                </div>

                <!-- Progress Bar -->
                <div v-if="isLoading || progress > 0" class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-foreground/60">Progress</span>
                        <span class="font-medium">{{ Math.round(progress) }}%</span>
                    </div>
                    <div class="w-full bg-foreground/10 rounded-full h-2">
                        <div class="bg-gradient-to-r from-velaris-amber to-yellow-600 h-2 rounded-full transition-all duration-300"
                            :style="{ width: progress + '%' }"></div>
                    </div>
                </div>

                <!-- Success Message -->
                <div v-if="success" class="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div class="flex items-center gap-2 mb-2">
                        <CheckCircle class="h-4 w-4 text-green-400" />
                        <span class="font-medium text-green-400">Success!</span>
                    </div>
                    <p class="text-sm text-foreground/70">{{ success }}</p>

                    <!-- Data refreshed indicator -->
                    <div v-if="dataRefreshed" class="mt-3 p-2 bg-velaris-purple/10 rounded text-xs text-velaris-purple">
                        Store data automatically refreshed
                    </div>
                </div>

                <!-- Error Message -->
                <Alert v-if="error" variant="destructive">
                    <X class="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{{ error }}</AlertDescription>
                </Alert>

                <!-- Status Messages -->
                <div v-if="isLoading" class="text-center">
                    <div class="inline-flex items-center gap-2 text-sm text-foreground/60">
                        <div
                            class="animate-spin h-4 w-4 border-2 border-velaris-amber border-t-transparent rounded-full">
                        </div>
                        <span v-if="progress < 15">Preparing data...</span>
                        <span v-else-if="progress < 40">Syncing metadata...</span>
                        <span v-else-if="progress < 80">Syncing heroes...</span>
                        <span v-else-if="progress < 95">Creating sample queues...</span>
                        <span v-else>Finalizing...</span>
                    </div>
                </div>

                <!-- Close Button -->
                <div v-if="!isLoading" class="pt-2">
                    <Button @click="handleClose" class="w-full" variant="outline">
                        Close
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import { X, Zap, Star, CheckCircle } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useFirestoreSync } from '@/composables/useFirestoreSync'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    heroData: {
        type: Object,
        required: true
    },
    store: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:isOpen', 'close'])

const showProgress = ref(false)
const dataRefreshed = ref(false)

const {
    isLoading,
    progress,
    error,
    successMessage: success,
    syncToFirestore
} = useFirestoreSync()

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

// Enhanced createSampleQueues function for the new format
const createSampleQueuesEnhanced = async (heroes) => {
    if (!heroes || heroes.length === 0) return

    try {
        // Sample queue configurations in the new format (single team per queue)
        const sampleQueues = [
            {
                name: "PvP Meta Team",
                description: "High-tier PvP team with balanced offense and defense",
                category: "pvp",
                strategy: "balanced",
                isActive: true,
                heroes: [
                    { heroId: heroes[0]?.id, position: "front1" },
                    { heroId: heroes[1]?.id, position: "front2" },
                    { heroId: heroes[2]?.id, position: "mid1" },
                    { heroId: heroes[3]?.id, position: "mid2" },
                    { heroId: heroes[4]?.id, position: "back1" },
                    { heroId: heroes[5]?.id, position: "back2" }
                ].filter(h => h.heroId) // Remove entries where heroId is undefined
            },
            {
                name: "Campaign Push Team",
                description: "Optimized for story campaign progression",
                category: "campaign",
                strategy: "sustain",
                isActive: true,
                heroes: [
                    { heroId: heroes[6]?.id, position: "front1" },
                    { heroId: heroes[7]?.id, position: "mid1" },
                    { heroId: heroes[8]?.id, position: "mid2" },
                    { heroId: heroes[9]?.id, position: "back1" }
                ].filter(h => h.heroId)
            },
            {
                name: "Raid DPS Team",
                description: "Maximum damage output for raid encounters",
                category: "raid",
                strategy: "burst",
                isActive: false,
                heroes: [
                    { heroId: heroes[10]?.id, position: "front1" },
                    { heroId: heroes[11]?.id, position: "mid1" },
                    { heroId: heroes[12]?.id, position: "back1" }
                ].filter(h => h.heroId)
            }
        ]

        // Only create queues that have at least one hero
        const validQueues = sampleQueues.filter(queue => queue.heroes.length > 0)

        for (const queueData of validQueues) {
            await props.store.createQueue(queueData)
        }

        console.log(`✅ Created ${validQueues.length} sample queues`)

    } catch (err) {
        console.warn('Failed to create sample queues:', err)
    }
}

const startSync = async () => {
    try {
        showProgress.value = true
        dataRefreshed.value = false

        // Perform the sync
        await syncToFirestore(props.heroData)

        // Refresh store data after successful sync
        await props.store.loadAll(true)
        dataRefreshed.value = true

        // Create sample queues using our enhanced function
        await createSampleQueuesEnhanced(props.heroData.heroes)

        // Keep modal open to show success
        setTimeout(() => {
            if (!error.value) {
                handleClose()
            }
        }, 3000)

    } catch (err) {
        console.error('Sync failed:', err)
        // Keep modal open to show error
    }
}
</script>