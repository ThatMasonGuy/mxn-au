<!-- EventEdit.vue - Full page component for dashboard -->
<template>
    <div class="space-y-6">
        <!-- Header Section -->
        <div class="elev-card p-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div class="space-y-2">
                    <div class="flex items-center gap-3">
                        <button @click="$emit('back')" class="btn-soft-violet">
                            <ArrowLeft class="w-4 h-4 mr-2" />
                            Back to Events
                        </button>
                        <div class="h-6 w-px bg-border/50"></div>
                        <h1 class="text-2xl font-semibold text-velaris-purple">Event Manager</h1>
                    </div>
                    <p class="text-sm text-foreground/70">
                        {{ event?.eventId || 'Loading...' }}
                        <span v-if="event?.type" class="text-velaris-teal">• {{ event.type }}</span>
                        <span v-if="event?.guildShort" class="text-velaris-green">• {{ event.guildShort }}</span>
                    </p>
                </div>

                <!-- Action buttons -->
                <div class="flex flex-wrap gap-3">
                    <button @click="showBulkImportModal = true" class="btn-soft-violet">
                        <Upload class="w-4 h-4 mr-2" />
                        Bulk Import
                    </button>

                    <button @click="saveAll" :disabled="isSaving || !hasUnsavedChanges" 
                        class="btn-solid-green" :class="{ 'opacity-50 cursor-not-allowed': isSaving || !hasUnsavedChanges }">
                        <Save v-if="!isSaving" class="w-4 h-4 mr-2" />
                        <div v-else class="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        {{ isSaving ? 'Saving...' : 'Save All' }}
                    </button>
                </div>
            </div>

            <!-- Unsaved changes indicator -->
            <div v-if="hasUnsavedChanges" class="mt-4 p-3 bg-velaris-amber/15 border border-velaris-amber/30 rounded-lg">
                <div class="flex items-center text-velaris-amber text-sm">
                    <AlertTriangle class="w-4 h-4 mr-2" />
                    You have unsaved changes
                </div>
            </div>
        </div>

        <!-- Tab Navigation -->
        <div class="elev-card">
            <div class="px-6 border-b border-border/50">
                <nav class="-mb-px flex space-x-8 overflow-x-auto">
                    <button @click="activeTab = 'event'" :class="[
                        'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200',
                        activeTab === 'event'
                            ? 'border-velaris-purple text-velaris-purple'
                            : 'border-transparent text-foreground/60 hover:text-foreground/80 hover:border-foreground/30'
                    ]">
                        <Calendar class="w-4 h-4 inline mr-2" />
                        Event Details
                    </button>
                    <button @click="activeTab = 'players'" :class="[
                        'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200',
                        activeTab === 'players'
                            ? 'border-velaris-purple text-velaris-purple'
                            : 'border-transparent text-foreground/60 hover:text-foreground/80 hover:border-foreground/30'
                    ]">
                        <Users class="w-4 h-4 inline mr-2" />
                        Player Data
                        <span v-if="playerRows.length > 0" class="ml-2 px-2 py-1 text-xs bg-velaris-purple text-white rounded-full">
                            {{ playerRows.length }}
                        </span>
                    </button>
                </nav>
            </div>

            <!-- Tab Content -->
            <div class="p-6">
                
                <!-- Event Details Tab -->
                <div v-if="activeTab === 'event'" class="space-y-6">
                    <div v-if="event">
                        <h3 class="text-xl font-semibold text-foreground mb-6">Event Information</h3>

                        <form @submit.prevent="saveEventData" class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <!-- Event ID -->
                                <div>
                                    <label class="block text-sm font-medium text-foreground/80 mb-2">Event ID</label>
                                    <input v-model="eventForm.eventId" type="text" class="form-input"
                                        placeholder="e.g., GR-2024-01" />
                                </div>

                                <!-- Event Type -->
                                <div>
                                    <label class="block text-sm font-medium text-foreground/80 mb-2">Event Type</label>
                                    <select v-model="eventForm.type" class="form-select">
                                        <option value="">Select Type</option>
                                        <option value="GvG">Guild vs Guild</option>
                                        <option value="GR">Guild Raid</option>
                                        <option value="Tournament">Tournament</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <!-- Guild Short -->
                                <div>
                                    <label class="block text-sm font-medium text-foreground/80 mb-2">Guild</label>
                                    <input v-model="eventForm.guildShort" type="text" class="form-input"
                                        placeholder="e.g., VELARIS" />
                                </div>

                                <!-- Start Date -->
                                <div>
                                    <label class="block text-sm font-medium text-foreground/80 mb-2">Start Date</label>
                                    <input v-model="eventForm.startDate" type="datetime-local" class="form-input" />
                                </div>

                                <!-- End Date -->
                                <div>
                                    <label class="block text-sm font-medium text-foreground/80 mb-2">End Date</label>
                                    <input v-model="eventForm.endDate" type="datetime-local" class="form-input" />
                                </div>

                                <!-- Status -->
                                <div>
                                    <label class="block text-sm font-medium text-foreground/80 mb-2">Status</label>
                                    <select v-model="eventForm.status" class="form-select">
                                        <option value="upcoming">Upcoming</option>
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Description -->
                            <div>
                                <label class="block text-sm font-medium text-foreground/80 mb-2">Description</label>
                                <textarea v-model="eventForm.description" rows="4" class="form-textarea"
                                    placeholder="Event description, rules, or notes..."></textarea>
                            </div>

                            <!-- GvG Settings -->
                            <div v-if="eventForm.type === 'GvG'" class="elev-card p-4 border-l-4 border-l-velaris-purple">
                                <h4 class="text-lg font-medium text-velaris-purple mb-4">GvG Settings</h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-foreground/80 mb-2">Opponent Guild</label>
                                        <input v-model="eventForm.opponentGuild" type="text" class="form-input"
                                            placeholder="Opponent guild name" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-foreground/80 mb-2">Duration (days)</label>
                                        <input v-model.number="eventForm.durationDays" type="number" min="1" max="7" class="form-input"
                                            placeholder="6" />
                                    </div>
                                </div>
                            </div>

                            <!-- Save button -->
                            <div class="flex justify-end">
                                <button type="submit" :disabled="isSavingEvent" class="btn-solid-purple"
                                    :class="{ 'opacity-50 cursor-not-allowed': isSavingEvent }">
                                    <Save v-if="!isSavingEvent" class="w-4 h-4 mr-2" />
                                    <div v-else class="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                    {{ isSavingEvent ? 'Saving...' : 'Save Event Data' }}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div v-else class="text-center py-12">
                        <div class="animate-pulse">
                            <div class="w-16 h-16 bg-foreground/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <div class="animate-spin w-6 h-6 border-2 border-foreground/50 border-t-transparent rounded-full"></div>
                            </div>
                            <div class="text-foreground/60">Loading event data...</div>
                        </div>
                    </div>
                </div>

                <!-- Player Data Tab -->
                <div v-if="activeTab === 'players'" class="space-y-6">
                    
                    <!-- Loading State -->
                    <div v-if="isLoadingEventData" class="text-center py-12">
                        <div class="max-w-md mx-auto">
                            <div class="w-16 h-16 bg-velaris-purple/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <div class="animate-spin w-8 h-8 border-3 border-velaris-purple border-t-transparent rounded-full"></div>
                            </div>
                            <h4 class="text-xl font-semibold text-foreground mb-2">Loading Player Data</h4>
                            <p class="text-foreground/60 mb-4">Checking for existing event data and syncing with cloud...</p>
                        </div>
                    </div>

                    <!-- Cloud Data Management -->
                    <div v-if="!isLoadingEventData && playerRows.length > 0 && hasLocalChanges" 
                        class="bg-velaris-amber/15 border border-velaris-amber/30 rounded-xl p-4">
                        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div class="flex items-center space-x-3">
                                <AlertTriangle class="w-5 h-5 text-velaris-amber flex-shrink-0" />
                                <div>
                                    <p class="text-velaris-amber font-medium">Using Local Data</p>
                                    <p class="text-velaris-amber/80 text-sm">Some player data may be from local storage</p>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <button @click="revertToCloudData" :disabled="isLoadingPlayers" class="btn-outline-amber">
                                    <RotateCcw v-if="!isLoadingPlayers" class="w-4 h-4 mr-2" />
                                    <div v-else class="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                                    {{ isLoadingPlayers ? 'Reverting...' : 'Revert to Cloud Data' }}
                                </button>
                                <button @click="dismissLocalWarning" :disabled="isLoadingPlayers" class="btn-ghost">
                                    <X class="w-4 h-4 mr-2" />
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Add Players Section -->
                    <div v-if="!isLoadingEventData && playerRows.length === 0 && !hasExistingEventData" class="text-center py-12">
                        <div class="max-w-md mx-auto">
                            <div class="w-16 h-16 bg-velaris-purple/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Users class="w-8 h-8 text-velaris-purple" />
                            </div>
                            <h4 class="text-xl font-semibold text-foreground mb-2">Add Players to Event</h4>
                            <p class="text-foreground/60 mb-6">Choose which guild members to add to this event</p>

                            <div class="grid grid-cols-1 gap-3">
                                <button @click="addPlayersToEvent('all')" :disabled="isLoadingPlayers" class="btn-solid-green">
                                    <CheckCircle v-if="!isLoadingPlayers" class="w-4 h-4 mr-2" />
                                    <div v-else class="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                    Add All Players
                                </button>

                                <button @click="addPlayersToEvent('active')" :disabled="isLoadingPlayers" class="btn-solid-purple">
                                    <Check v-if="!isLoadingPlayers" class="w-4 h-4 mr-2" />
                                    <div v-else class="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                    Add Active Players Only
                                </button>

                                <button @click="addPlayersToEvent('active-inactive')" :disabled="isLoadingPlayers" class="btn-solid-teal">
                                    <Users v-if="!isLoadingPlayers" class="w-4 h-4 mr-2" />
                                    <div v-else class="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                    Add Active & Inactive Players
                                </button>
                            </div>

                            <div class="mt-6 pt-4 border-t border-border/60">
                                <button @click="showBulkImportModal = true" class="btn-soft-violet">
                                    <Upload class="w-4 h-4 mr-2" />
                                    Or Import from Spreadsheet
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Search and Filters -->
                    <div v-if="!isLoadingEventData && playerRows.length > 0" class="elev-card p-4 lg:p-6">
                        <div class="flex flex-col lg:flex-row gap-4">
                            <div class="flex-1">
                                <SmartSearch :data="playerRows" :queries="['name', 'discord', 'role']" :sorted-by="sortKey"
                                    :sort-direction="sortDirection" :secondary-sort="secondarySort"
                                    :secondary-sort-direction="sortDirection" :filter-key="'status'" :filter-value="activeStatuses"
                                    :preserve-case="false" placeholder="Search players..."
                                    @update:results="sortedAndFilteredPlayers = $event" />
                            </div>

                            <div class="flex gap-3">
                                <SmartInput v-model="activeStatuses" type="multiselect" :options="[
                                    { label: 'Active', value: 'active' },
                                    { label: 'Inactive', value: 'inactive' },
                                    { label: 'Left', value: 'left' },
                                    { label: 'Kicked', value: 'kicked' }
                                ]" placeholder="Filter by status" />
                            </div>
                        </div>
                    </div>

                    <!-- Player Table -->
                    <div v-if="!isLoadingEventData && playerRows.length > 0" class="elev-card overflow-hidden">
                        <EventPopulationTable v-if="event" :players="sortedAndFilteredPlayers" :event="event" 
                            @on-sort="handleSort" @on-remove="handleRemovePlayer" @on-save-one="handleSaveOnePlayer"
                            @on-add-missing="handleAddMissingMember" @on-clear-all="handleClearAll"
                            @on-clear-scores="handleClearScores" @on-field-update="handlePlayerFieldUpdate"
                            @on-hard-refresh="handleHardRefresh" />

                        <div v-else class="p-8 text-center text-foreground/60">
                            <div class="animate-pulse">
                                <div class="w-16 h-16 bg-foreground/10 rounded-full mx-auto mb-4"></div>
                                <div>Loading player data...</div>
                            </div>
                        </div>
                    </div>

                    <!-- Empty state for filtered results -->
                    <div v-if="!isLoadingEventData && event && sortedAndFilteredPlayers.length === 0 && playerRows.length > 0"
                        class="elev-card p-8 text-center">
                        <div class="w-16 h-16 bg-foreground/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Search class="w-8 h-8 text-foreground/50" />
                        </div>
                        <p class="text-foreground/60 text-lg">No players match your current search or filter settings.</p>
                        <p class="text-foreground/50 text-sm mt-1">Try adjusting your filters or search terms.</p>
                    </div>

                    <!-- Additional Actions -->
                    <div v-if="!isLoadingEventData && playerRows.length > 0" class="elev-card p-4">
                        <div class="flex flex-wrap gap-2 justify-center">
                            <button @click="addPlayersToEvent('active')" :disabled="isLoadingPlayers" class="btn-outline-green">
                                <Plus v-if="!isLoadingPlayers" class="w-4 h-4 mr-2" />
                                <div v-else class="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                                Add More Active Players
                            </button>

                            <button @click="addPlayersToEvent('all')" :disabled="isLoadingPlayers" class="btn-outline-purple">
                                <Plus v-if="!isLoadingPlayers" class="w-4 h-4 mr-2" />
                                <div v-else class="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                                Add Any Missing Players
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <AddMissingMemberModal v-if="showAddMissingModal" :all-members="allMembers" :current-players="eventPlayers"
            @close="showAddMissingModal = false" @add="handleMemberAdded" />

        <BulkMemberEventImportModal v-if="showBulkImportModal" @close="showBulkImportModal = false"
            @review-matches="matchedRows = $event" @finalize="handleFinalized" :event="event" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { doc, getDoc, getDocs, collection, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import EventPopulationTable from '@/components/velaris/EventPopulationTable.vue';
import { useToast } from '@/components/ui/toast';
import { useEventPlayerStore } from '@/stores/useEventPlayerStore';
import { savePlayerToFirestore } from '@/services/firestorePlayerSaver';
import { reprocessEventData } from '@/services/manualReprocessEvent'
import { processEventAggregation } from '@/services/eventAggregationService'
import AddMissingMemberModal from '@/components/velaris/AddMissingMemberModal.vue'
import BulkMemberEventImportModal from '@/components/velaris/BulkMemberEventImportModal.vue';
import SmartInput from '@/components/ui/SmartInput.vue'
import SmartSearch from '@/components/ui/SmartSearch.vue'
import {
    Upload, Save, Calendar, Users, CheckCircle, Plus, Search, Trash2, RotateCcw, 
    AlertTriangle, X, Check, UserPlus, Download, FileText, ArrowLeft
} from 'lucide-vue-next'

const props = defineProps({
    eventId: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['back']);

const store = useEventPlayerStore();
const { toast } = useToast();

const activeTab = ref('event');
const showAddMissingModal = ref(false);
const matchedRows = ref([]);
const showBulkImportModal = ref(false);

const event = ref(null);
const eventForm = ref({
    eventId: '',
    type: '',
    guildShort: '',
    startDate: '',
    endDate: '',
    status: 'upcoming',
    description: '',
    opponentGuild: '',
    durationDays: 6
});

const isSaving = ref(false);
const isSavingEvent = ref(false);
const isLoadingPlayers = ref(false);
const isLoadingEventData = ref(false);
const hasExistingEventData = ref(false);
const showLocalWarning = ref(true);

const eventPlayers = ref([]);
const allMembers = ref([]);

const sortKey = ref('name');
const sortDirection = ref('asc');
const activeStatuses = ref(['active', 'inactive', 'left', 'kicked']);

const playerRows = computed(() => store.getPlayers(props.eventId));
const sortedAndFilteredPlayers = ref([]);

const secondarySort = computed(() =>
    sortKey.value === 'name' ? 'power' : 'name'
);

const hasUnsavedChanges = computed(() => {
    return playerRows.value.some(p => p.localOnly);
});

const hasLocalChanges = computed(() => {
    return showLocalWarning.value && (playerRows.value.some(p => p.localOnly) || store.getPlayers(props.eventId).length > 0);
});

// Convert Firestore timestamp to datetime-local format
const formatDateForInput = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toISOString().slice(0, 16);
};

// Convert datetime-local to Date object
const parseInputDate = (dateString) => {
    return dateString ? new Date(dateString) : null;
};

const saveEventData = async () => {
    if (!event.value) return;

    isSavingEvent.value = true;
    try {
        const eventRef = doc(firestore, `topheroes/velaris/events/${props.eventId}`);
        const updateData = {
            eventId: eventForm.value.eventId,
            type: eventForm.value.type,
            guildShort: eventForm.value.guildShort,
            startDate: parseInputDate(eventForm.value.startDate),
            endDate: parseInputDate(eventForm.value.endDate),
            status: eventForm.value.status,
            description: eventForm.value.description,
            updatedAt: serverTimestamp()
        };

        // Add type-specific fields
        if (eventForm.value.type === 'GvG') {
            updateData.opponentGuild = eventForm.value.opponentGuild;
            updateData.durationDays = eventForm.value.durationDays;
        }

        await updateDoc(eventRef, updateData);

        // Update local event data
        event.value = { ...event.value, ...updateData };

        toast({
            variant: 'success',
            title: 'Event Updated',
            description: 'Event data has been saved successfully.'
        });
    } catch (error) {
        console.error("Error saving event:", error);
        toast({
            variant: 'destructive',
            title: 'Save Failed',
            description: 'Could not save event data.'
        });
    } finally {
        isSavingEvent.value = false;
    }
};

// New function to explicitly add players to event
const addPlayersToEvent = async (filterType) => {
    if (!props.eventId) return;

    isLoadingPlayers.value = true;
    try {
        await loadAllMembers(); // Ensure members are loaded

        // Filter members based on type
        let membersToAdd = [];
        switch (filterType) {
            case 'active':
                membersToAdd = allMembers.value.filter(m => m.status === 'active');
                break;
            case 'active-inactive':
                membersToAdd = allMembers.value.filter(m => ['active', 'inactive'].includes(m.status));
                break;
            case 'all':
            default:
                membersToAdd = allMembers.value;
                break;
        }

        // Get existing player IDs to avoid duplicates
        const existingPlayerIds = playerRows.value.map(p => p.id);

        const playersToProcess = membersToAdd.filter(member => !existingPlayerIds.includes(member.id));

        if (playersToProcess.length === 0) {
            toast({
                variant: 'info',
                title: 'No New Players',
                description: `All ${filterType} players are already added to this event.`
            });
            return;
        }

        const playerPromises = playersToProcess.map(async (member) => {
            // Check if player has existing event data
            const eventSpecificDataRef = doc(firestore, `topheroes/velaris/members/${member.id}/events/${props.eventId}`);
            const eventSpecificSnap = await getDoc(eventSpecificDataRef);

            const baseData = {
                id: member.id,
                name: member.name || 'N/A',
                discord: member.discord || '',
                power: member.power || 0,
                castle: member.castle || '',
                role: member.role || '',
                status: member.status || 'active'
            };

            let eventData = {
                rank: '', score: '',
                scoreD1: '', scoreD2: '', scoreD3: '',
                scoreD4: '', scoreD5: '', scoreD6: '',
                notes: '',
            };
            let isLocal = !eventSpecificSnap.exists();

            if (eventSpecificSnap.exists()) {
                eventData = { ...eventData, ...eventSpecificSnap.data() };
            }

            return { ...baseData, ...eventData, localOnly: isLocal };
        });

        const newPlayers = await Promise.all(playerPromises);

        // Add to existing players
        const updatedPlayers = [...playerRows.value, ...newPlayers];
        store.setAllPlayers(props.eventId, updatedPlayers);

        hasExistingEventData.value = true; // Hide the add players section

        toast({
            variant: 'success',
            title: 'Players Added',
            description: `Added ${newPlayers.length} ${filterType} players to the event.`
        });

        // Switch to players tab
        activeTab.value = 'players';

    } catch (error) {
        console.error("Error loading players:", error);
        toast({
            variant: 'destructive',
            title: 'Loading Error',
            description: 'Could not load players.'
        });
    } finally {
        isLoadingPlayers.value = false;
    }
};

const handleHardRefresh = async () => {
    await reprocessEventData(props.eventId);
};

const handlePlayerFieldUpdate = (playerId, updates) => {
    store.updatePlayer(props.eventId, playerId, updates);
};

const handleRemovePlayer = (id) => {
    store.removePlayer(props.eventId, id);
    toast({ variant: 'destructive', title: 'Player Removed', description: 'Player removed from the local table. Save changes to persist.' });
};

const handleClearAll = () => {
    store.clearAll(props.eventId);
    toast({ variant: 'destructive', title: 'All Data Cleared', description: 'All player data has been cleared from the local table.' });
};

const handleClearScores = () => {
    store.clearScores(props.eventId);
    toast({ variant: 'info', title: 'Scores Cleared', description: 'All scores have been cleared. Save changes to persist.' });
};

const handleAddMissingMember = (players) => {
    eventPlayers.value = players;
    showAddMissingModal.value = true;
};

const handleMemberAdded = (member) => {
    const defaultFields = {
        rank: '', score: '',
        scoreD1: '', scoreD2: '', scoreD3: '',
        scoreD4: '', scoreD5: '', scoreD6: '',
        notes: '', localOnly: true
    };

    store.addPlayer(props.eventId, {
        ...member,
        ...defaultFields
    });

    toast({
        title: 'Member Added',
        description: `${member.name} was added to the event.`,
        variant: 'success',
    });
};

const handleSort = (key) => {
    if (sortKey.value === key) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortDirection.value = 'asc';
    }
};

const loadEvent = async () => {
    if (!props.eventId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Event ID is missing.' });
        return;
    }
    try {
        const eventRef = doc(firestore, `topheroes/velaris/events/${props.eventId}`);
        const eventSnap = await getDoc(eventRef);
        if (!eventSnap.exists()) {
            toast({ variant: 'destructive', title: 'Error', description: `Event with ID ${props.eventId} not found.` });
            event.value = null;
            return;
        }
        const eventData = { id: eventSnap.id, ...eventSnap.data() };
        event.value = eventData;

        // Populate form with event data
        eventForm.value = {
            eventId: eventData.eventId || '',
            type: eventData.type || '',
            guildShort: eventData.guildShort || '',
            startDate: formatDateForInput(eventData.startDate),
            endDate: formatDateForInput(eventData.endDate),
            status: eventData.status || 'upcoming',
            description: eventData.description || '',
            opponentGuild: eventData.opponentGuild || '',
            durationDays: eventData.durationDays || 6
        };
    } catch (error) {
        console.error("Error loading event:", error);
        toast({ variant: 'destructive', title: 'Loading Error', description: 'Could not load event details.' });
        event.value = null;
    }
};

const loadAllMembers = async () => {
    if (allMembers.value.length > 0) return; // Only load once
    const membersSnap = await getDocs(collection(firestore, 'topheroes/velaris/members'));
    allMembers.value = membersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// New function to check for and load existing event player data
const checkAndLoadExistingEventData = async () => {
    if (!props.eventId) return;

    isLoadingEventData.value = true;

    try {
        // Check if members collection exists and has any event-specific data for this event
        const membersSnap = await getDocs(collection(firestore, 'topheroes/velaris/members'));
        const members = membersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Check each member for event-specific data
        const existingEventPlayers = [];

        for (const member of members) {
            const eventSpecificDataRef = doc(firestore, `topheroes/velaris/members/${member.id}/events/${props.eventId}`);
            const eventSpecificSnap = await getDoc(eventSpecificDataRef);

            if (eventSpecificSnap.exists()) {
                const eventData = eventSpecificSnap.data();

                // This member has data for this event
                const playerData = {
                    id: member.id,
                    name: member.name || 'N/A',
                    discord: member.discord || '',
                    power: member.power || 0,
                    castle: member.castle || '',
                    role: member.role || '',
                    status: member.status || 'active',
                    ...eventData,
                    localOnly: false // Data comes from Firestore
                };

                existingEventPlayers.push(playerData);
            }
        }

        if (existingEventPlayers.length > 0) {
            hasExistingEventData.value = true;

            // Check if store has more recent data
            const storeData = store.getPlayers(props.eventId);

            if (storeData.length > 0) {
                // Compare timestamps and merge data intelligently
                const mergedPlayers = existingEventPlayers.map(firestorePlayer => {
                    const storePlayer = storeData.find(sp => sp.id === firestorePlayer.id);

                    if (storePlayer) {
                        // If store player is marked as localOnly, prefer store data (it's more recent)
                        if (storePlayer.localOnly) {
                            return { ...firestorePlayer, ...storePlayer };
                        }

                        // Otherwise, use Firestore data but preserve any local changes
                        return { ...firestorePlayer, localOnly: false };
                    }

                    return firestorePlayer;
                });

                // Add any store players that aren't in Firestore
                storeData.forEach(storePlayer => {
                    if (!mergedPlayers.find(mp => mp.id === storePlayer.id)) {
                        mergedPlayers.push(storePlayer);
                    }
                });

                store.setAllPlayers(props.eventId, mergedPlayers);
            } else {
                // No store data, use Firestore data
                store.setAllPlayers(props.eventId, existingEventPlayers);
            }

            toast({
                variant: 'success',
                title: 'Event Data Loaded',
                description: `Loaded ${existingEventPlayers.length} players from existing event data.`
            });
        } else {
            hasExistingEventData.value = false;
            // No existing event data, but check if store has local data
            const storeData = store.getPlayers(props.eventId);
            if (storeData.length > 0) {
                hasExistingEventData.value = true; // Don't show add players section
                toast({
                    variant: 'info',
                    title: 'Local Data Found',
                    description: `Using ${storeData.length} players from local storage.`
                });
            }
        }

    } catch (error) {
        console.error("Error checking for existing event data:", error);
        toast({
            variant: 'destructive',
            title: 'Loading Error',
            description: 'Could not check for existing event data.'
        });
    } finally {
        isLoadingEventData.value = false;
    }
};

// Function to force reload from cloud data only
const revertToCloudData = async () => {
    if (!props.eventId) return;

    isLoadingPlayers.value = true;

    try {
        toast({
            variant: 'info',
            title: 'Reverting to Cloud Data',
            description: 'Loading fresh data from cloud storage...'
        });

        // Load fresh from Firestore only (don't clear store until we have new data)
        const membersSnap = await getDocs(collection(firestore, 'topheroes/velaris/members'));
        const members = membersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const cloudPlayers = [];

        for (const member of members) {
            const eventSpecificDataRef = doc(firestore, `topheroes/velaris/members/${member.id}/events/${props.eventId}`);
            const eventSpecificSnap = await getDoc(eventSpecificDataRef);

            if (eventSpecificSnap.exists()) {
                const eventData = eventSpecificSnap.data();

                const playerData = {
                    id: member.id,
                    name: member.name || 'N/A',
                    discord: member.discord || '',
                    power: member.power || 0,
                    castle: member.castle || '',
                    role: member.role || '',
                    status: member.status || 'active',
                    ...eventData,
                    localOnly: false // Fresh from cloud
                };

                cloudPlayers.push(playerData);
            }
        }

        if (cloudPlayers.length > 0) {
            // Only clear and update after we have new data
            store.clearEvent(props.eventId);
            store.setAllPlayers(props.eventId, cloudPlayers);
            showLocalWarning.value = false; // Hide warning after successful revert
            toast({
                variant: 'success',
                title: 'Reverted to Cloud Data',
                description: `Loaded ${cloudPlayers.length} players fresh from cloud storage.`
            });
        } else {
            // Clear everything if no cloud data
            store.clearEvent(props.eventId);
            hasExistingEventData.value = false;
            showLocalWarning.value = false;
            toast({
                variant: 'info',
                title: 'No Cloud Data',
                description: 'No player data found in cloud storage for this event.'
            });
        }

    } catch (error) {
        console.error("Error reverting to cloud data:", error);
        toast({
            variant: 'destructive',
            title: 'Revert Failed',
            description: 'Could not load fresh data from cloud.'
        });
    } finally {
        isLoadingPlayers.value = false;
    }
};

// Function to dismiss the local warning
const dismissLocalWarning = () => {
    showLocalWarning.value = false;
};

const handleSaveOnePlayer = async (player) => {
    if (!event.value) {
        toast({ variant: 'destructive', title: 'Save Error', description: 'Event data is not loaded.' });
        return;
    }

    isSaving.value = true;
    try {
        const result = await savePlayerToFirestore(player, event.value);

        if (result.skipped) {
            toast({ variant: 'info', title: 'Skipped', description: `${player.name} has no scores and was not saved.` });
        } else {
            store.updatePlayer(props.eventId, player.id, { ...result.data, localOnly: false });

            // After saving individual player, recalculate aggregates if they have scores
            if (result.saved) {
                try {
                    const allPlayers = playerRows.value;
                    const aggregationResult = await processEventAggregation(allPlayers, event.value, props.eventId);

                    // Update local store with new ranks for all players
                    aggregationResult.aggregates.allPlayersWithTotals.forEach(rankedPlayer => {
                        if (rankedPlayer.calculatedRank) {
                            store.updatePlayer(props.eventId, rankedPlayer.id, {
                                calculatedRank: rankedPlayer.calculatedRank,
                                calculatedTotal: rankedPlayer.calculatedTotal,
                                localOnly: false
                            });
                        }
                    });

                    toast({
                        variant: 'success',
                        title: 'Player Saved & Ranked',
                        description: `${player.name} saved and event rankings updated.`
                    });
                } catch (aggregationError) {
                    console.error('Aggregation error:', aggregationError);
                    toast({
                        variant: 'warning',
                        title: 'Player Saved',
                        description: `${player.name} saved but ranking calculation failed.`
                    });
                }
            }
        }
    } catch (err) {
        console.error("Error saving player:", err);
        toast({ variant: 'destructive', title: 'Save Failed', description: `Could not save ${player.name}. ${err.message}` });
    } finally {
        isSaving.value = false;
    }
};

const saveAll = async () => {
    if (!event.value) {
        toast({ variant: 'destructive', title: 'Save Error', description: 'Event data is not loaded.' });
        return;
    }

    if (!hasUnsavedChanges.value) {
        toast({ variant: 'info', title: 'No Changes', description: 'There are no unsaved changes to save.' });
        return;
    }

    isSaving.value = true;

    const playersToSave = playerRows.value.filter(p => p.localOnly);
    if (playersToSave.length === 0) {
        toast({ variant: 'info', title: 'No Changes', description: 'All data is already saved.' });
        isSaving.value = false;
        return;
    }

    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Step 1: Save all individual players
    const results = await Promise.allSettled(
        playersToSave.map(player => savePlayerToFirestore(player, event.value)
            .then(result => {
                if (result.skipped) {
                    skippedCount++;
                } else {
                    store.updatePlayer(props.eventId, player.id, { ...result.data, localOnly: false });
                    successCount++;
                }
                return result;
            }))
    );

    results.forEach(result => {
        if (result.status === 'rejected') {
            errorCount++;
            console.error("Save error:", result.reason);
        }
    });

    // Step 2: Calculate and save event aggregates and rankings
    try {
        const allPlayers = playerRows.value;
        const aggregationResult = await processEventAggregation(allPlayers, event.value, props.eventId);

        // Step 3: Update local store with calculated ranks
        aggregationResult.aggregates.allPlayersWithTotals.forEach(rankedPlayer => {
            if (rankedPlayer.calculatedRank) {
                store.updatePlayer(props.eventId, rankedPlayer.id, {
                    calculatedRank: rankedPlayer.calculatedRank,
                    calculatedTotal: rankedPlayer.calculatedTotal,
                    localOnly: false
                });
            }
        });

        // Success messages with aggregation info
        if (successCount > 0) {
            toast({
                variant: 'success',
                title: 'Save Complete',
                description: `${successCount} players saved. Event total: ${aggregationResult.summary.eventTotal.toLocaleString()}. ${aggregationResult.summary.rankedPlayers} players ranked.`
            });
        }

        if (skippedCount > 0) {
            toast({ variant: 'info', title: 'Some Skipped', description: `${skippedCount} players were skipped (no scores).` });
        }

        if (errorCount > 0) {
            toast({ variant: 'destructive', title: 'Errors Occurred', description: `${errorCount} players failed to save.` });
        }

        // Log aggregation summary for debugging
        console.log('Event Aggregation Summary:', aggregationResult.summary);

    } catch (aggregationError) {
        console.error('Aggregation failed:', aggregationError);

        // Still show success for individual saves even if aggregation fails
        if (successCount > 0) {
            toast({
                variant: 'warning',
                title: 'Partial Success',
                description: `${successCount} players saved but event totals and rankings could not be calculated.`
            });
        }

        toast({
            variant: 'destructive',
            title: 'Aggregation Failed',
            description: 'Individual players saved but event statistics could not be updated.'
        });
    }

    isSaving.value = false;
};

const FIELD_ALIASES = {
    name: ['name', 'player name', 'player'],
    castle: ['castle'],
    power: ['power'],
    role: ['role'],
    score: ['score', 'total', 'overall'],
    notes: ['notes', 'note'],
    rank: ['rank', 'position', 'place'],
    overallRank: ['overall rank', 'overallRank'],
    scoreD1: ['scoreD1', 'score d1', 'score (d1)', 'd1'],
    scoreD2: ['scoreD2', 'score d2', 'score (d2)', 'd2'],
    scoreD3: ['scoreD3', 'score d3', 'score (d3)', 'd3'],
    scoreD4: ['scoreD4', 'score d4', 'score (d4)', 'd4'],
    scoreD5: ['scoreD5', 'score d5', 'score (d5)', 'd5'],
    scoreD6: ['scoreD6', 'score d6', 'score (d6)', 'd6'],
};

function getField(raw, aliases) {
    const keys = Object.keys(raw).reduce((map, k) => {
        map[k.trim().toLowerCase()] = raw[k];
        return map;
    }, {});
    for (const alias of aliases) {
        if (keys.hasOwnProperty(alias.toLowerCase().trim())) {
            return keys[alias.toLowerCase().trim()];
        }
    }
    return '';
}

const SCORE_FIELDS = [
    'scoreD1', 'scoreD2', 'scoreD3', 'scoreD4', 'scoreD5', 'scoreD6'
];

const handleFinalized = (imported) => {
    const allMembersMap = {};
    allMembers.value.forEach(m => { allMembersMap[m.id] = m; });

    const prevPlayers = store.getPlayers(props.eventId) || [];
    const prevMap = {};
    prevPlayers.forEach(p => { prevMap[p.id] = p; });

    function hasAnyScore(player) {
        return SCORE_FIELDS.some(f => Number(player?.[f]) > 0);
    }

    function normalizeRow(row) {
        return {
            name: getField(row, FIELD_ALIASES.name),
            castle: getField(row, FIELD_ALIASES.castle),
            power: getField(row, FIELD_ALIASES.power),
            role: getField(row, FIELD_ALIASES.role),
            score: getField(row, FIELD_ALIASES.score),
            notes: getField(row, FIELD_ALIASES.notes),
            overallRank: getField(row, FIELD_ALIASES.overallRank),
            rank: getField(row, FIELD_ALIASES.rank),
            scoreD1: getField(row, FIELD_ALIASES.scoreD1),
            scoreD2: getField(row, FIELD_ALIASES.scoreD2),
            scoreD3: getField(row, FIELD_ALIASES.scoreD3),
            scoreD4: getField(row, FIELD_ALIASES.scoreD4),
            scoreD5: getField(row, FIELD_ALIASES.scoreD5),
            scoreD6: getField(row, FIELD_ALIASES.scoreD6),
        }
    }

    const importedMap = {};
    imported.forEach(row => { importedMap[row.memberId] = true; });

    const merged = [];

    imported.forEach(rawRow => {
        const row = normalizeRow(rawRow);
        const baseMember = allMembersMap[rawRow.memberId] || {};
        const prev = prevMap[rawRow.memberId] || {};

        const player = {
            id: rawRow.memberId,
            player: baseMember.name || row.name || "",
            name: baseMember.name || row.name || "",
            discord: baseMember.discord || "",
            power: Number(row.power) || baseMember.power || 0,
            castle: row.castle || baseMember.castle || "",
            role: row.role || baseMember.role || "",
            status: baseMember.status || "active",
            overallRank: row.overallRank || "",
            rank: Number(row.rank ?? rawRow.rank) || prev.rank || "",
            enteredBy: "Unknown",
            type: event.value?.type || "",
            score: row.score || "",
            notes: row.notes || "",
            eventId: props.eventId,
            overallScore: null,
            playerId: rawRow.memberId,
            guild: event.value?.guildShort || "",
            enteredDate: new Date(),
            localOnly: true,
        }

        SCORE_FIELDS.forEach(field => {
            const importedScore = Number(row[field] ?? 0);
            const prevScore = Number(prev[field] ?? 0);
            if (importedScore > 0 || !prevScore) {
                player[field] = importedScore || "";
            } else {
                player[field] = prevScore;
            }
        });

        merged.push(player);
    });

    prevPlayers.forEach(prev => {
        if (!importedMap[prev.id] && hasAnyScore(prev)) {
            merged.push(prev);
        }
    });

    store.setAllPlayers(props.eventId, merged);

    toast({
        title: 'Import Applied',
        description: `Imported/updated ${imported.length} players. Kept ${merged.length - imported.length} players with scores.`,
        variant: 'success',
    });

    showBulkImportModal.value = false;
    activeTab.value = 'players'; // Switch to players tab after import
};

onMounted(async () => {
    await loadEvent();
    await loadAllMembers();
    await checkAndLoadExistingEventData();
});

watch(() => props.eventId, async (newEventId) => {
    if (newEventId && newEventId !== props.eventId) {
        showLocalWarning.value = true; // Reset warning for new events
        await loadEvent();
        await loadAllMembers();
        await checkAndLoadExistingEventData();
    }
});
</script>

<style scoped>
/* Form styling to match theme */
.form-input, .form-select, .form-textarea {
    @apply w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground 
           placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-velaris-purple 
           focus:border-transparent transition-all duration-200;
}

.form-textarea {
    @apply resize-none;
}

/* Button styles matching Events.vue theme */
.btn-solid-purple {
    @apply inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-velaris-purple 
           hover:bg-velaris-purple/90 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl;
}

.btn-solid-green {
    @apply inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-velaris-green 
           hover:bg-velaris-green/90 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl;
}

.btn-solid-teal {
    @apply inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-velaris-teal 
           hover:bg-velaris-teal/90 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl;
}

.btn-soft-violet {
    @apply inline-flex items-center px-4 py-2 text-sm font-medium text-foreground/80 bg-foreground/5 
           hover:bg-foreground/10 rounded-lg transition-all duration-200 border border-border/50;
}

.btn-outline-green {
    @apply inline-flex items-center px-4 py-2 text-sm font-medium text-velaris-green 
           hover:text-velaris-green/80 hover:bg-velaris-green/10 rounded-lg transition-all duration-200 
           border border-velaris-green/30 hover:border-velaris-green/50;
}

.btn-outline-purple {
    @apply inline-flex items-center px-4 py-2 text-sm font-medium text-velaris-purple 
           hover:text-velaris-purple/80 hover:bg-velaris-purple/10 rounded-lg transition-all duration-200 
           border border-velaris-purple/30 hover:border-velaris-purple/50;
}

.btn-outline-amber {
    @apply inline-flex items-center px-4 py-2 text-sm font-medium text-velaris-amber 
           hover:text-velaris-amber/80 hover:bg-velaris-amber/10 rounded-lg transition-all duration-200 
           border border-velaris-amber/30 hover:border-velaris-amber/50;
}

.btn-ghost {
    @apply inline-flex items-center px-4 py-2 text-sm font-medium text-foreground/60 
           hover:text-foreground/80 hover:bg-foreground/5 rounded-lg transition-all duration-200;
}

.border-3 {
    border-width: 3px;
}
</style>