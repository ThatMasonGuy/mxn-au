<template>
  <div class="px-4 sm:px-6 py-8 bg-slate-900 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 class="text-2xl font-bold text-white">Fill In Player Data for <span class="text-indigo-400">{{ event?.eventId
          || 'Event' }}</span></h1>
        <div>
          <Button @click="showBulkImportModal = true" class="bg-indigo-600 hover:bg-indigo-700 text-white">
            Bulk Import
          </Button>
          <Button @click="saveAll" :disabled="isSaving || !hasUnsavedChanges"
            class="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed ml-2">
            <span v-if="!isSaving">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" viewBox="0 0 20 20"
                fill="currentColor">
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
      </div>

      <div class="flex flex-col lg:flex-row gap-4 mb-8">
        <SmartSearch :data="playerRows" :queries="['name', 'discord', 'role']" :sorted-by="sortKey"
          :sort-direction="sortDirection" :secondary-sort="secondarySort" :secondary-sort-direction="sortDirection"
          :filter-key="'status'" :filter-value="activeStatuses" :preserve-case="false"
          @update:results="sortedAndFilteredPlayers = $event" />

        <div class="flex gap-3">
          <SmartInput v-model="activeStatuses" type="multiselect" :options="[
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Left', value: 'left' },
            { label: 'Kicked', value: 'kicked' }
          ]" placeholder="Filter by status" />
        </div>
      </div>

      <EventPopulationTable v-if="event" :players="sortedAndFilteredPlayers" :event="event" @on-sort="handleSort"
        @on-remove="handleRemovePlayer" @on-save-one="handleSaveOnePlayer" @on-add-missing="handleAddMissingMember"
        @on-clear-all="handleClearAll" @on-clear-scores="handleClearScores" @on-field-update="handlePlayerFieldUpdate"
        @on-hard-refresh="handleHardRefresh" />
      <div v-else class="text-slate-400 italic text-center py-10">Loading event data... Please wait.</div>
      <div v-if="event && sortedAndFilteredPlayers.length === 0 && playerRows.length > 0"
        class="text-slate-400 italic text-center py-10">
        No players match your current search or filter settings.
      </div>
      <AddMissingMemberModal v-if="showAddMissingModal" :all-members="allMembers" :current-players="eventPlayers"
        @close="showAddMissingModal = false" @add="handleMemberAdded" />
    </div>
    <BulkMemberEventImportModal v-if="showBulkImportModal" @close="showBulkImportModal = false"
      @review-matches="matchedRows = $event" :event="event" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { firestore } from '@/firebase';
import EventPopulationTable from '@/components/velaris/EventPopulationTable.vue';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useEventPlayerStore } from '@/stores/useEventPlayerStore';
import { savePlayerToFirestore } from '@/services/firestorePlayerSaver';
import { reprocessEventData } from '@/services/manualReprocessEvent'
import AddMissingMemberModal from '@/components/velaris/AddMissingMemberModal.vue'
import BulkMemberEventImportModal from '@/components/velaris/BulkMemberEventImportModal.vue';
import SmartInput from '@/components/ui/SmartInput.vue'
import SmartSearch from '@/components/ui/SmartSearch.vue'

const store = useEventPlayerStore();
const route = useRoute();
const { toast } = useToast();

const eventId = route.params.eventId;
const showAddMissingModal = ref(false)
const matchedRows = ref([])
const showBulkImportModal = ref(false);

const event = ref(null);
const isSaving = ref(false);

const eventPlayers = ref([]);
const allMembers = ref([]);

const sortKey = ref('name');
const sortDirection = ref('asc');
const activeStatuses = ref(['active', 'inactive', 'left', 'kicked'])

const playerRows = computed(() => store.getPlayers(eventId))

const sortedAndFilteredPlayers = ref([])

const secondarySort = computed(() =>
  sortKey.value === 'name' ? 'power' : 'name'
)

const hasUnsavedChanges = computed(() => {
  return playerRows.value.some(p => p.localOnly);
});

const handleHardRefresh = async () => {
  await reprocessEventData(eventId)
};

const handlePlayerFieldUpdate = (playerId, updates) => {
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
  store.clearScores(eventId);
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

  store.addPlayer(eventId, {
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
  console.log('handleSort called')
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
};

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
      event.value = null;
      return;
    }
    event.value = { id: eventSnap.id, ...eventSnap.data() };
  } catch (error) {
    console.error("Error loading event:", error);
    toast({ variant: 'destructive', title: 'Loading Error', description: 'Could not load event details.' });
    event.value = null;
  }
};

const loadMembersWithEventData = async () => {
  if (!eventId) return;
  isSaving.value = true;
  try {
    await loadAllMembers();

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
        status: member.status || 'active'
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

      let merged = { ...baseData, ...eventData };

      if (existingPlayerDataInStore.id) {

        Object.keys(existingPlayerDataInStore).forEach(key => {
          if (key !== 'id' && existingPlayerDataInStore[key] !== undefined) {

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

const loadAllMembers = async () => {
  const membersSnap = await getDocs(collection(firestore, 'topheroes/velaris/members'));
  allMembers.value = membersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
      store.updatePlayer(eventId, player.id, { ...result.data, localOnly: false });
      toast({ variant: 'success', title: 'Player Saved', description: `${player.name}'s data saved successfully.` });
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

  const results = await Promise.allSettled(
    playersToSave.map(player => savePlayerToFirestore(player, event.value)
      .then(result => {
        if (result.skipped) {
          skippedCount++;
        } else {
          store.updatePlayer(eventId, player.id, { ...result.data, localOnly: false });
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

  if (successCount > 0) {
    toast({ variant: 'success', title: 'Save Complete', description: `${successCount} players saved successfully.` });
  }

  if (skippedCount > 0) {
    toast({ variant: 'info', title: 'Some Skipped', description: `${skippedCount} players were skipped (no scores).` });
  }

  if (errorCount > 0) {
    toast({ variant: 'destructive', title: 'Errors Occurred', description: `${errorCount} players failed to save.` });
  }

  isSaving.value = false;
};

onMounted(async () => {
  await loadEvent();
  if (event.value) {
    await loadAllMembers();
    if (store.getPlayers(eventId).length === 0) {
      await loadMembersWithEventData();
    } else {
      toast({ variant: 'info', title: 'Local Data Loaded', description: 'Using previously stored data. Refresh if needed.' });
    }
  }
});

watch(() => route.params.eventId, async (newEventId) => {
  if (newEventId && newEventId !== eventId) {
    eventId = newEventId
    await loadEvent()
    await loadMembersWithEventData()
  }
})
</script>