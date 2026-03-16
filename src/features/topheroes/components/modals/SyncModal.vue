<!-- SyncModal.vue -->
<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="close">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

                <!-- Modal -->
                <div
                    class="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                    <!-- Header -->
                    <div
                        class="relative p-6 border-b border-border bg-gradient-to-r from-velaris-purple/10 to-velaris-teal/10">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div
                                    class="h-12 w-12 rounded-xl bg-gradient-to-br from-velaris-purple to-velaris-teal flex items-center justify-center shadow-lg">
                                    <Database class="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 class="text-xl font-bold text-velaris-purple">Sync Hero Database</h2>
                                    <p class="text-sm text-foreground/60">Upload and sync TopHeroes data to Firestore
                                    </p>
                                </div>
                            </div>
                            <button @click="close" :disabled="isSyncing"
                                class="h-10 w-10 rounded-xl hover:bg-foreground/10 transition-colors flex items-center justify-center"
                                :class="{ 'opacity-50 cursor-not-allowed': isSyncing }">
                                <X class="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-6 space-y-6">
                        <!-- Upload Section -->
                        <div v-if="!isSyncing && !syncComplete">
                            <div class="border-2 border-dashed rounded-xl p-8 text-center transition-all"
                                :class="isDragging ? 'border-velaris-purple bg-velaris-purple/10' : 'border-border hover:border-velaris-purple/50 hover:bg-foreground/5'"
                                @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
                                @drop.prevent="handleFileDrop">
                                <input ref="fileInput" type="file" accept=".json" @change="handleFileSelect"
                                    class="hidden" />

                                <div class="space-y-4">
                                    <div
                                        class="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-velaris-purple/20 to-velaris-teal/20 flex items-center justify-center">
                                        <Upload class="h-8 w-8 text-velaris-purple" />
                                    </div>

                                    <div>
                                        <h3 class="font-semibold mb-1">Drop your TopHeroes.json file here</h3>
                                        <p class="text-sm text-foreground/60">or click to browse</p>
                                    </div>

                                    <button @click="$refs.fileInput.click()"
                                        class="btn-solid-purple inline-flex items-center gap-2">
                                        <Upload class="h-4 w-4" />
                                        Choose File
                                    </button>
                                </div>
                            </div>

                            <!-- Selected File Info -->
                            <div v-if="selectedFile"
                                class="mt-4 p-4 bg-velaris-purple/10 border border-velaris-purple/30 rounded-xl">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <FileJson class="h-5 w-5 text-velaris-purple" />
                                        <div>
                                            <p class="font-medium">{{ selectedFile.name }}</p>
                                            <p class="text-sm text-foreground/60">{{ formatFileSize(selectedFile.size)
                                                }}</p>
                                        </div>
                                    </div>
                                    <button @click="selectedFile = null"
                                        class="h-8 w-8 rounded-lg hover:bg-foreground/10 transition-colors flex items-center justify-center">
                                        <X class="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <!-- Warning -->
                            <div class="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                                <div class="flex gap-3">
                                    <AlertTriangle class="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <div class="space-y-1">
                                        <p class="font-semibold text-amber-500">Warning: This will replace all existing
                                            data</p>
                                        <p class="text-sm text-foreground/70">
                                            All current heroes, queues, and related data will be deleted and replaced
                                            with the uploaded data.
                                            This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sync Progress -->
                        <div v-if="isSyncing">
                            <div class="space-y-6">
                                <!-- Overall Progress -->
                                <div>
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-sm font-medium">Syncing Database</span>
                                        <span class="text-sm text-foreground/60">{{ syncProgress }}%</span>
                                    </div>
                                    <div class="h-2 bg-foreground/10 rounded-full overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-velaris-purple to-velaris-teal transition-all duration-300"
                                            :style="{ width: `${syncProgress}%` }"></div>
                                    </div>
                                </div>

                                <!-- Step Progress -->
                                <div class="space-y-3">
                                    <div v-for="step in syncSteps" :key="step.id"
                                        class="flex items-center gap-3 p-3 rounded-lg transition-all"
                                        :class="getStepClass(step)">
                                        <div class="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                            :class="getStepIconClass(step)">
                                            <component :is="getStepIcon(step)" class="h-4 w-4" />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="font-medium text-sm">{{ step.label }}</p>
                                            <p v-if="step.detail" class="text-xs text-foreground/60 truncate">{{
                                                step.detail }}</p>
                                        </div>
                                        <div class="flex-shrink-0">
                                            <CheckCircle2 v-if="step.status === 'complete'"
                                                class="h-5 w-5 text-green-500" />
                                            <div v-else-if="step.status === 'active'"
                                                class="h-5 w-5 border-2 border-velaris-purple border-t-transparent rounded-full animate-spin">
                                            </div>
                                            <div v-else class="h-5 w-5 rounded-full bg-foreground/10"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Success State -->
                        <div v-if="syncComplete && !error">
                            <div class="text-center space-y-4">
                                <div
                                    class="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                                    <CheckCircle2 class="h-10 w-10 text-green-500" />
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold text-green-500 mb-2">Sync Complete!</h3>
                                    <p class="text-foreground/70">Your hero database has been successfully updated.</p>
                                </div>
                                <div class="grid grid-cols-2 gap-4 max-w-md mx-auto text-sm">
                                    <div class="p-3 bg-foreground/5 rounded-lg">
                                        <p class="text-foreground/60">Heroes Synced</p>
                                        <p class="text-lg font-bold text-velaris-purple">{{ syncStats.heroes }}</p>
                                    </div>
                                    <div class="p-3 bg-foreground/5 rounded-lg">
                                        <p class="text-foreground/60">Total Items</p>
                                        <p class="text-lg font-bold text-velaris-purple">{{ syncStats.total }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Error State -->
                        <div v-if="error">
                            <div class="text-center space-y-4">
                                <div
                                    class="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center">
                                    <AlertCircle class="h-10 w-10 text-red-500" />
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold text-red-500 mb-2">Sync Failed</h3>
                                    <p class="text-foreground/70">{{ error }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="p-6 border-t border-border bg-foreground/5">
                        <div class="flex gap-3 justify-end">
                            <button v-if="!isSyncing && !syncComplete" @click="close"
                                class="btn-soft-violet px-6 py-2.5 rounded-xl">
                                Cancel
                            </button>
                            <button v-if="!isSyncing && !syncComplete" @click="startSync" :disabled="!selectedFile"
                                class="btn-solid-purple px-6 py-2.5 rounded-xl inline-flex items-center gap-2"
                                :class="{ 'opacity-50 cursor-not-allowed': !selectedFile }">
                                <Zap class="h-4 w-4" />
                                Start Sync
                            </button>
                            <button v-if="syncComplete || error" @click="reset"
                                class="btn-solid-purple px-6 py-2.5 rounded-xl">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
    X, Upload, Database, FileJson, AlertTriangle, Zap, CheckCircle2,
    AlertCircle, Loader2, Trash2, FolderPlus
} from 'lucide-vue-next'
import { doc, setDoc, collection, getDocs, deleteDoc, writeBatch } from 'firebase/firestore'
import { firestore } from '@/firebase'

const props = defineProps({
    isOpen: Boolean,
    store: Object
})

const emit = defineEmits(['update:isOpen'])

// State
const selectedFile = ref(null)
const isDragging = ref(false)
const isSyncing = ref(false)
const syncComplete = ref(false)
const error = ref(null)
const syncProgress = ref(0)
const fileInput = ref(null)

const syncStats = ref({
    heroes: 0,
    total: 0
})

const syncSteps = ref([
    { id: 'wipe', label: 'Clearing existing data', status: 'pending', detail: '' },
    { id: 'factions', label: 'Syncing factions', status: 'pending', detail: '' },
    { id: 'rarities', label: 'Syncing rarities', status: 'pending', detail: '' },
    { id: 'tags', label: 'Syncing tags', status: 'pending', detail: '' },
    { id: 'heroes', label: 'Syncing heroes', status: 'pending', detail: '' },
    { id: 'bonds', label: 'Syncing hero bonds', status: 'pending', detail: '' },
    { id: 'auras', label: 'Syncing faction auras', status: 'pending', detail: '' },
    { id: 'gear', label: 'Syncing gear sets', status: 'pending', detail: '' },
    { id: 'relics', label: 'Syncing relics', status: 'pending', detail: '' },
    { id: 'pets', label: 'Syncing pets', status: 'pending', detail: '' },
    { id: 'skins', label: 'Syncing skins', status: 'pending', detail: '' },
    { id: 'metadata', label: 'Updating metadata', status: 'pending', detail: '' }
])

// Computed
const close = () => {
    if (!isSyncing.value) {
        emit('update:isOpen', false)
    }
}

// Methods
const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

const handleFileDrop = (e) => {
    isDragging.value = false
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type === 'application/json') {
        selectedFile.value = files[0]
    }
}

const handleFileSelect = (e) => {
    const files = e.target.files
    if (files.length > 0) {
        selectedFile.value = files[0]
    }
}

const updateStepStatus = (stepId, status, detail = '') => {
    const step = syncSteps.value.find(s => s.id === stepId)
    if (step) {
        step.status = status
        step.detail = detail
    }
}

const startSync = async () => {
    if (!selectedFile.value) return

    try {
        isSyncing.value = true
        error.value = null
        syncProgress.value = 0

        // Read and parse the file
        const fileContent = await selectedFile.value.text()
        const data = JSON.parse(fileContent)

        const totalSteps = syncSteps.value.length
        let currentStep = 0

        // Helper to update progress
        const updateProgress = () => {
            currentStep++
            syncProgress.value = Math.round((currentStep / totalSteps) * 100)
        }

        // Step 1: Wipe existing data
        updateStepStatus('wipe', 'active')
        await wipeExistingData()
        updateStepStatus('wipe', 'complete', 'All collections cleared')
        updateProgress()

        // Step 2: Sync Factions
        updateStepStatus('factions', 'active')
        await syncCollection('factions', data.factions)
        updateStepStatus('factions', 'complete', `${data.factions.length} factions`)
        updateProgress()

        // Step 3: Sync Rarities
        updateStepStatus('rarities', 'active')
        await syncCollection('rarities', data.rarities)
        updateStepStatus('rarities', 'complete', `${data.rarities.length} rarities`)
        updateProgress()

        // Step 4: Sync Tags
        updateStepStatus('tags', 'active')
        await syncCollection('tags', data.tags)
        updateStepStatus('tags', 'complete', `${data.tags.length} tags`)
        updateProgress()

        // Step 5: Sync Heroes
        updateStepStatus('heroes', 'active')
        await syncCollection('heroes', data.heroes)
        updateStepStatus('heroes', 'complete', `${data.heroes.length} heroes`)
        syncStats.value.heroes = data.heroes.length
        updateProgress()

        // Step 6: Sync Bonds
        updateStepStatus('bonds', 'active')
        await syncCollection('bonds', data.hero_bonds, true)
        updateStepStatus('bonds', 'complete', `${data.hero_bonds.length} bonds`)
        updateProgress()

        // Step 7: Sync Faction Auras
        updateStepStatus('auras', 'active')
        await syncCollection('faction_auras', data.faction_auras, true)
        updateStepStatus('auras', 'complete', `${data.faction_auras.length} auras`)
        updateProgress()

        // Step 8: Sync Gear
        updateStepStatus('gear', 'active')
        const gearArray = Object.entries(data.gear).map(([id, gearData]) => ({ id, ...gearData }))
        await syncCollection('gear', gearArray)
        updateStepStatus('gear', 'complete', `${gearArray.length} gear sets`)
        updateProgress()

        // Step 9: Sync Relics
        updateStepStatus('relics', 'active')
        await syncCollection('relics', data.relics)
        updateStepStatus('relics', 'complete', `${data.relics.length} relics`)
        updateProgress()

        // Step 10: Sync Pets
        updateStepStatus('pets', 'active')
        await syncCollection('pets', data.pets)
        updateStepStatus('pets', 'complete', `${data.pets.length} pets`)
        updateProgress()

        // Step 11: Sync Skins
        updateStepStatus('skins', 'active')
        await syncCollection('skins', data.skins)
        updateStepStatus('skins', 'complete', `${data.skins.length} skins`)
        updateProgress()

        // Step 12: Update Metadata
        updateStepStatus('metadata', 'active')
        await updateMetadata(data)
        updateStepStatus('metadata', 'complete', 'Stats updated')
        updateProgress()

        // Calculate total items
        syncStats.value.total = data.factions.length + data.rarities.length + data.tags.length +
            data.heroes.length + data.hero_bonds.length + data.faction_auras.length +
            gearArray.length + data.relics.length + data.pets.length + data.skins.length

        syncComplete.value = true

        // Reload store data
        if (props.store?.loadAll) {
            await props.store.loadAll(true)
        }

    } catch (err) {
        console.error('Sync error:', err)
        error.value = err.message || 'An error occurred during sync'
    } finally {
        isSyncing.value = false
    }
}

const wipeExistingData = async () => {
    const generalDocRef = doc(firestore, 'topheroes', 'general')
    const collections = ['factions', 'rarities', 'tags', 'heroes', 'bonds', 'faction_auras', 'gear', 'relics', 'pets', 'skins']

    for (const collectionName of collections) {
        const collectionRef = collection(generalDocRef, collectionName)
        const snapshot = await getDocs(collectionRef)

        const batch = writeBatch(firestore)
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref)
        })

        if (snapshot.docs.length > 0) {
            await batch.commit()
        }
    }

    // Wipe the general document itself
    await setDoc(generalDocRef, {
        wiped: true,
        wipedAt: new Date().toISOString()
    })
}

const syncCollection = async (collectionName, items, useAutoId = false) => {
    if (!items || items.length === 0) return

    const generalDocRef = doc(firestore, 'topheroes', 'general')
    const collectionRef = collection(generalDocRef, collectionName)

    // Batch write for efficiency
    const batchSize = 500
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = writeBatch(firestore)
        const batchItems = items.slice(i, i + batchSize)

        batchItems.forEach((item, index) => {
            const docId = useAutoId ? `${collectionName}_${i + index}` : item.id
            const docRef = doc(collectionRef, docId)
            const docData = { ...item }

            // Add metadata
            docData.createdAt = new Date().toISOString()
            docData.updatedAt = new Date().toISOString()

            batch.set(docRef, docData)
        })

        await batch.commit()
    }
}

const updateMetadata = async (data) => {
    const generalDocRef = doc(firestore, 'topheroes', 'general')

    const metadata = {
        lastSync: new Date().toISOString(),
        counts: {
            factions: data.factions?.length || 0,
            rarities: data.rarities?.length || 0,
            tags: data.tags?.length || 0,
            heroes: data.heroes?.length || 0,
            bonds: data.hero_bonds?.length || 0,
            faction_auras: data.faction_auras?.length || 0,
            gear: Object.keys(data.gear || {}).length,
            relics: data.relics?.length || 0,
            pets: data.pets?.length || 0,
            skins: data.skins?.length || 0
        },
        version: '1.0.0',
        updatedAt: new Date().toISOString()
    }

    await setDoc(generalDocRef, metadata)
}

const reset = () => {
    selectedFile.value = null
    isSyncing.value = false
    syncComplete.value = false
    error.value = null
    syncProgress.value = 0
    syncStats.value = { heroes: 0, total: 0 }
    syncSteps.value.forEach(step => {
        step.status = 'pending'
        step.detail = ''
    })
    close()
}

const getStepClass = (step) => {
    if (step.status === 'complete') return 'bg-green-500/10'
    if (step.status === 'active') return 'bg-velaris-purple/10'
    return 'bg-foreground/5'
}

const getStepIconClass = (step) => {
    if (step.status === 'complete') return 'bg-green-500/20 text-green-500'
    if (step.status === 'active') return 'bg-velaris-purple/20 text-velaris-purple'
    return 'bg-foreground/10 text-foreground/40'
}

const getStepIcon = (step) => {
    if (step.id === 'wipe') return Trash2
    if (step.id === 'metadata') return Database
    return FolderPlus
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
    transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
    transform: scale(0.95);
}

.btn-solid-purple {
    @apply bg-gradient-to-r from-velaris-purple to-velaris-teal text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200;
}

.btn-soft-violet {
    @apply bg-velaris-purple/10 text-velaris-purple border border-velaris-purple/30 hover:bg-velaris-purple/20 transition-all duration-200 font-medium;
}
</style>