<template>
  <div class="px-4 sm:px-6 py-8 bg-slate-900 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 class="text-2xl font-bold text-white">Fill In Player Data for <span class="text-indigo-400">{{ event?.name
          || 'Event' }}</span></h1>
        <Button @click="saveAll" :disabled="isSaving || !hasUnsavedChanges"
          class="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="!isSaving">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a1 1 0 011 1v3a1 1 0 11-2 0V8h-3v3.586l-1.293-1.293zM9 4a1 1 0 012 0v1H9V4z" />
              <path
                d="M4 7v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v1H4zm2-1a1 1 0 011-1h6a1 1 0 011 1v1H6V6z" />
            </svg>
            Save All Changes
          </span>
          <span v-else class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8a4 4 0 00-4 4H4z" />
            </svg>
            Saving...
          </span>
        </Button>
      </div>

      <div class="bg-slate-800 shadow-xl rounded-lg p-4 pb-1 sm:p-6 sm:pb-1 mb-6">
        <div class="flex flex-col sm:flex-row flex-wrap gap-4 items-center mb-4">
          <Input v-model="search" placeholder="Search players (name, discord, role)..."
            class="bg-slate-700 text-white border-slate-600 placeholder-slate-400 w-full sm:flex-grow" />
          <div class="flex items-center gap-2 text-sm text-slate-300 flex-wrap">
            <span class="mr-2 font-semibold">Status:</span>
            <label class="flex items-center gap-1 cursor-pointer hover:text-indigo-300">
              <input type="checkbox" v-model="visibleStatuses.active"
                class="form-checkbox bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500" /> Active
            </label>
            <label class="flex items-center gap-1 cursor-pointer hover:text-indigo-300">
              <input type="checkbox" v-model="visibleStatuses.inactive"
                class="form-checkbox bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500" /> Inactive
            </label>
            <label class="flex items-center gap-1 cursor-pointer hover:text-indigo-300">
              <input type="checkbox" v-model="visibleStatuses.left"
                class="form-checkbox bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500" /> Left
            </label>
            <label class="flex items-center gap-1 cursor-pointer hover:text-indigo-300">
              <input type="checkbox" v-model="visibleStatuses.kicked"
                class="form-checkbox bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500" /> Kicked
            </label>
          </div>
        </div>
      </div>

      <EventPopulationTable v-if="event" :players="sortedAndFilteredPlayers" :event="event" @on-sort="handleSort"
        @on-remove="handleRemovePlayer" @on-save-one="handleSaveOnePlayer" @on-add-missing="handleAddMissingMember"
        @on-clear-all="handleClearAll" @on-clear-scores="handleClearScores" />
      <div v-else class="text-slate-400 italic text-center py-10">Loading event data... Please wait.</div>
      <div v-if="event && sortedAndFilteredPlayers.length === 0 && playerRows.length > 0"
        class="text-slate-400 italic text-center py-10">
        No players match your current search or filter settings.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { doc, getDoc, setDoc, getDocs, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase'; // Assuming your firebase setup is here
import EventPopulationTable from '@/components/velaris/EventPopulationTable.vue'; // Adjust path if needed
import { Input } from '@/components/ui/input'; // ShadCN UI
import { Button } from '@/components/ui/button'; // ShadCN UI
import { useToast } from '@/components/ui/toast'; // ShadCN UI
import { useEventPlayerStore } from '@/stores/useEventPlayerStore'; // Adjust path if needed

const route = useRoute();
const eventId = route.params.eventId;

const event = ref(null);
const search = ref('');
const isSaving = ref(false);
const { toast } = useToast();

// --- Sorting State ---
const sortKey = ref('name'); // Default sort key
const sortDirection = ref('asc'); // Default sort direction

// --- Filtering State ---
const visibleStatuses = ref({ active: true, inactive: true, left: false, kicked: false });

const store = useEventPlayerStore();

// Get all players for the event from the store
const playerRows = computed(() => store.getPlayers(eventId));

// --- Computed Properties ---
const hasUnsavedChanges = computed(() => {
  return playerRows.value.some(p => p.localOnly);
});

const sortedAndFilteredPlayers = computed(() => {
  let items = [...playerRows.value]; // Create a shallow copy for sorting

  // Filter by status
  items = items.filter(p => visibleStatuses.value[p.status?.toLowerCase() || 'active']);

  // Filter by search term
  if (search.value.trim() !== '') {
    const searchTerm = search.value.toLowerCase();
    items = items.filter(p =>
      p.name?.toLowerCase().includes(searchTerm) ||
      p.discord?.toLowerCase().includes(searchTerm) ||
      p.role?.toLowerCase().includes(searchTerm)
    );
  }

  // Sort items
  if (sortKey.value) {
    items.sort((a, b) => {
      let valA = a[sortKey.value];
      let valB = b[sortKey.value];

      const numericKeys = ['power', 'rank', 'score', 'scoreD1', 'scoreD2', 'scoreD3', 'scoreD4', 'scoreD5', 'scoreD6'];
      if (numericKeys.includes(sortKey.value)) {
        valA = Number(valA) || 0; // Treat empty or non-numeric as 0 for sorting
        valB = Number(valB) || 0;
      } else {
        valA = String(valA ?? '').toLowerCase(); // Handle null/undefined for string sort
        valB = String(valB ?? '').toLowerCase();
      }

      if (valA < valB) return sortDirection.value === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection.value === 'asc' ? 1 : -1;
      return 0;
    });
  }
  return items;
});


// --- Store Interaction Handlers ---
const handlePlayerFieldUpdate = (playerId, updates) => {
  // This will call store.updatePlayer, which correctly sets localOnly = true
  store.updatePlayer(eventId, playerId, updates);
};

const handleRemovePlayer = (id) => {
  console.log('handleRemovePlayer called')
  store.removePlayer(eventId, id);
  toast({ variant: 'destructive', title: 'Player Removed', description: 'Player removed from the local table. Save changes to persist.' });
};

const handleClearAll = () => {
  console.log('handleClearAll called')
    store.clearAll(eventId);
    toast({ variant: 'destructive', title: 'All Data Cleared', description: 'All player data has been cleared from the local table.' });
};

const handleClearScores = () => {
  console.log('handleClearScores called')
    store.clearScores(eventId); // This will set localOnly: true for affected players
    toast({ variant: 'info', title: 'Scores Cleared', description: 'All scores have been cleared. Save changes to persist.' });
};

const handleAddMissingMember = () => {
  console.log('handleAddMissingMember called')
  // This was the original toast. You can replace this with modal logic.
  toast({ title: 'Add Missing Member', description: 'This functionality (e.g., a modal to select members) is not yet fully implemented.' });
  // Example: You might want to open a dialog here
  // openAddMemberDialog.value = true;
};

// --- Sorting Handler ---
const handleSort = (key) => {
  console.log('handleSort called')
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
};

// --- Data Loading ---
const loadEvent = async () => {
  if (!eventId) {
    toast({ variant: 'destructive', title: 'Error', description: 'Event ID is missing.' });
    return;
  }
  try {
    const eventRef = doc(firestore, `topheroes/velaris/events/${eventId}`);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) {
      toast({ variant: 'destructive', title: 'Error', description: `Event with ID ${eventId} not found.` });
      event.value = null; // Set to null explicitly
      return;
    }
    event.value = { id: eventSnap.id, ...eventSnap.data() };
  } catch (error) {
    console.error("Error loading event:", error);
    toast({ variant: 'destructive', title: 'Loading Error', description: 'Could not load event details.' });
    event.value = null; // Set to null on error
  }
};

const loadMembersWithEventData = async () => {
  if (!eventId) return;
  isSaving.value = true; // Use isSaving as a general loading indicator here
  try {
    const membersSnap = await getDocs(collection(firestore, 'topheroes/velaris/members'));
    const baseMembers = membersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const playerPromises = baseMembers.map(async (member) => {
      const eventSpecificDataRef = doc(firestore, `topheroes/velaris/members/${member.id}/events/${eventId}`);
      const eventSpecificSnap = await getDoc(eventSpecificDataRef);

      const existingPlayerDataInStore = store.getPlayers(eventId).find(p => p.id === member.id) || {};

      const baseData = {
        id: member.id,
        name: member.name || 'N/A',
        discord: member.discord || '',
        power: member.power || 0,
        castle: member.castle || '',
        role: member.role || '',
        status: member.status || 'active' // Default to active if no status
      };

      let eventData = {
        rank: '', score: '',
        scoreD1: '', scoreD2: '', scoreD3: '',
        scoreD4: '', scoreD5: '', scoreD6: '',
        notes: '',
      };
      let isInitiallyLocal = !eventSpecificSnap.exists();

      if (eventSpecificSnap.exists()) {
        eventData = { ...eventData, ...eventSpecificSnap.data() };
      }

      // Merge: base member data, then Firestore event data
      let merged = { ...baseData, ...eventData };

      // If player already exists in store (e.g., from previous session or edits)
      // and is marked localOnly, its data should be preserved or intelligently merged.
      // For now, if store version is localOnly, we mark the final merged as localOnly.
      // Individual field reconciliation can be complex.
      if (existingPlayerDataInStore.id) { // If player was in store
        // Prioritize store data if it's marked localOnly, or if certain fields were edited
        // This simple merge prefers new Firestore data unless store data is explicitly localOnly
        // A more sophisticated merge might compare field by field.
        Object.keys(existingPlayerDataInStore).forEach(key => {
          if (key !== 'id' && existingPlayerDataInStore[key] !== undefined) {
            // If store has a value, and it's different from the merged (base + firestore) value,
            // it implies a local change not yet reflected or a persisted local value.
            // We can choose to prioritize it.
            if (merged[key] !== existingPlayerDataInStore[key] && existingPlayerDataInStore.localOnly) {
              merged[key] = existingPlayerDataInStore[key];
            }
          }
        });
        if (existingPlayerDataInStore.localOnly) {
          isInitiallyLocal = true;
        }
      }
      merged.localOnly = isInitiallyLocal;
      return merged;
    });

    const resolvedPlayers = await Promise.all(playerPromises);
    store.setAllPlayers(eventId, resolvedPlayers);
    toast({ variant: 'default', title: 'Data Loaded', description: 'Player data refreshed from server.' });

  } catch (error) {
    console.error("Error loading members with event data:", error);
    toast({ variant: 'destructive', title: 'Loading Error', description: 'Could not load player and event data.' });
  } finally {
    isSaving.value = false;
  }
};

// --- Firestore Saving Logic ---
const preparePlayerEventData = (player, currentEvent) => {
  const scores = [player.scoreD1, player.scoreD2, player.scoreD3, player.scoreD4, player.scoreD5, player.scoreD6];
  const overallScore = scores.map(s => Number(s) || 0).reduce((acc, val) => acc + val, 0);

  return {
    eventId: currentEvent.id,
    player: player.name, // Consider storing playerId as well for stronger relation
    playerId: player.id,
    power: Number(player.power) || 0,
    castle: player.castle || '',
    role: player.role || '',
    overallRank: player.rank || '', // Keep as string if it can be non-numeric like "N/A"
    score: player.score || '', // For GR type
    // Daily scores
    scoreD1: player.scoreD1 || '', scoreD2: player.scoreD2 || '', scoreD3: player.scoreD3 || '',
    scoreD4: player.scoreD4 || '', scoreD5: player.scoreD5 || '', scoreD6: player.scoreD6 || '',
    overallScore: overallScore, // Calculated sum of daily scores
    notes: player.notes || '',
    enteredBy: currentEvent.enteredBy || 'system', // Ensure enteredBy is available
    enteredDate: serverTimestamp(), // Use server timestamp
    type: currentEvent.type,
    guild: currentEvent.guildShort
  };
};

const handleSaveOnePlayer = async (player) => {
  if (!event.value) {
    toast({ variant: 'destructive', title: 'Save Error', description: 'Event data is not loaded.' });
    return;
  }
  isSaving.value = true;
  try {
    const playerEventData = preparePlayerEventData(player, event.value);
    const eventRef = doc(firestore, `topheroes/velaris/members/${player.id}/events/${event.value.id}`);
    await setDoc(eventRef, playerEventData);

    // Also update the main member document if power, castle, role changed
    // and event end date is relevant (e.g., update if event is recent)
    const memberRef = doc(firestore, `topheroes/velaris/members/${player.id}`);
    const memberSnap = await getDoc(memberRef);
    const memberData = memberSnap.exists() ? memberSnap.data() : {};

    const memberUpdates = {};
    const eventEndDate = event.value.endDate?.toDate ? event.value.endDate.toDate() : new Date(); // Convert Firestore Timestamp
    const memberUpdatedAt = memberData.updatedAt?.toDate ? memberData.updatedAt.toDate() : new Date(0);

    // Only update member if event is newer than last member update
    // or if you always want to update these fields upon event save.
    let performMemberUpdate = false;
    if (eventEndDate > memberUpdatedAt) {
      if (Number(player.power) !== memberData.power) {
        memberUpdates.power = Number(player.power) || 0;
        performMemberUpdate = true;
      }
      if (player.castle !== memberData.castle) {
        memberUpdates.castle = player.castle || '';
        performMemberUpdate = true;
      }
      if (player.role !== memberData.role) {
        memberUpdates.role = player.role || '';
        performMemberUpdate = true;
      }
    }

    if (performMemberUpdate) {
      memberUpdates.updatedBy = event.value.enteredBy || 'system';
      memberUpdates.updatedAt = serverTimestamp();
      // Add to history (simplified, consider more detailed change tracking if needed)
      const historyEntry = {
        updatedBy: event.value.enteredBy || 'system',
        updatedAt: serverTimestamp(), // Firestore server timestamp
        changes: { [`event_${event.value.id}_saved`]: true, ...memberUpdates } // Basic history
      };
      memberUpdates.history = [...(memberData.history || []), historyEntry];
      await updateDoc(memberRef, memberUpdates);
    }


    store.updatePlayer(eventId, player.id, { ...playerEventData, localOnly: false }); // Mark as saved
    toast({ variant: 'success', title: 'Player Saved', description: `${player.name}'s data saved successfully.` });
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
  let errorCount = 0;

  // Use Promise.allSettled to handle individual save failures
  const savePromises = playersToSave.map(player => {
    const playerEventData = preparePlayerEventData(player, event.value);
    const eventRef = doc(firestore, `topheroes/velaris/members/${player.id}/events/${event.value.id}`);

    // Member update logic (similar to saveOne)
    const memberRef = doc(firestore, `topheroes/velaris/members/${player.id}`);

    return getDoc(memberRef).then(memberSnap => {
      const memberData = memberSnap.exists() ? memberSnap.data() : {};
      const memberUpdates = {};
      const eventEndDate = event.value.endDate?.toDate ? event.value.endDate.toDate() : new Date();
      const memberUpdatedAt = memberData.updatedAt?.toDate ? memberData.updatedAt.toDate() : new Date(0);
      let performMemberUpdate = false;

      if (eventEndDate > memberUpdatedAt) {
        if (Number(player.power) !== memberData.power) { memberUpdates.power = Number(player.power) || 0; performMemberUpdate = true; }
        if (player.castle !== memberData.castle) { memberUpdates.castle = player.castle || ''; performMemberUpdate = true; }
        if (player.role !== memberData.role) { memberUpdates.role = player.role || ''; performMemberUpdate = true; }
      }

      const dbOperations = [setDoc(eventRef, playerEventData)];
      if (performMemberUpdate) {
        memberUpdates.updatedBy = event.value.enteredBy || 'system';
        memberUpdates.updatedAt = serverTimestamp();
        const historyEntry = {
          updatedBy: event.value.enteredBy || 'system',
          updatedAt: serverTimestamp(),
          changes: { [`event_${event.value.id}_saved`]: true, ...memberUpdates }
        };
        memberUpdates.history = [...(memberData.history || []), historyEntry];
        dbOperations.push(updateDoc(memberRef, memberUpdates));
      }
      return Promise.all(dbOperations).then(() => {
        store.updatePlayer(eventId, player.id, { ...playerEventData, localOnly: false });
        return { status: 'fulfilled', id: player.id };
      });
    }).catch(err => {
      console.error(`Failed to save player ${player.name} (ID: ${player.id}):`, err);
      return { status: 'rejected', id: player.id, reason: err.message };
    });
  });

  const results = await Promise.allSettled(savePromises);

  results.forEach(result => {
    if (result.status === 'fulfilled' && result.value.status === 'fulfilled') {
      successCount++;
    } else if (result.status === 'fulfilled' && result.value.status === 'rejected') {
      // Error from inner promise (e.g. Firestore operation)
      errorCount++;
      console.error(`Error detail for player ID ${result.value.id}: ${result.value.reason}`);
    } else if (result.status === 'rejected') {
      // Error from outer promise (e.g. getDoc failed before setDoc/updateDoc)
      errorCount++;
      console.error(`Outer error for a player: ${result.reason}`);
    }
  });

  if (errorCount > 0) {
    toast({ variant: 'destructive', title: 'Partial Save', description: `${successCount} players saved. ${errorCount} failed. Check console for details.` });
  } else {
    toast({ variant: 'success', title: 'All Changes Saved', description: `${successCount} players' data updated successfully.` });
  }
  // Optionally, reload data or rely on store updates
  // await loadMembersWithEventData(); // To ensure consistency if server-side logic changes data

  isSaving.value = false;
};


// --- Lifecycle Hooks ---
onMounted(async () => {
  await loadEvent();
  if (event.value) { // Only load members if event loaded successfully
    // Check if store already has data for this event. If so, maybe don't auto-reload,
    // or provide a manual refresh button. For now, always loading.
    if (store.getPlayers(eventId).length === 0) {
      await loadMembersWithEventData();
    } else {
      // Data already in store, likely from vueuse/core useStorage.
      // You might want to reconcile this with Firestore or just use local.
      toast({ variant: 'info', title: 'Local Data Loaded', description: 'Using previously stored data. Refresh if needed.' });
    }
  }
});

// Watch for eventId changes if this component can be reused for different events
watch(() => route.params.eventId, async (newEventId) => {
  if (newEventId && newEventId !== eventId) {
    // eventId.value = newEventId; // This is problematic, eventId is const from route.params
    // Need to re-trigger data loading based on the new route param.
    // This component instance will likely be destroyed and re-created by router.
    // If not, you'd call loadEvent() and loadMembersWithEventData() here.
    // For simplicity, assuming router handles instance recreation.
    // If manual re-init is needed:
    // store.clearEvent(eventId); // Clear old event data if eventId changes
    // eventId = newEventId; // This is not how eventId from route.params works.
    // await loadEvent();
    // await loadMembersWithEventData();
  }
});

</script>
