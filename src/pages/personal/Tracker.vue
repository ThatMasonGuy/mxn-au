<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 lg:py-12">
            <!-- Header with View Toggle -->
            <GoblinHeader 
                :current-view="currentView" 
                @update:view="currentView = $event" 
            />

            <!-- Add Log Form - Only show on feed view -->
            <GoblinForm 
                v-if="currentView === 'feed'"
                :log="isEditing ? editingLog : currentLog" 
                :moods="moods"
                :is-editing="isEditing"
                @submit="isEditing ? handleUpdate() : handleSubmit()"
                @cancel="cancelEdit"
                @log-water="handleWaterLog"
            />

            <!-- View Switcher -->
            <Transition
                mode="out-in"
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 translate-y-4"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-4"
            >
                <!-- Goals View -->
                <div v-if="currentView === 'goals'" key="goals">
                    <GoblinGoals />
                </div>

                <!-- Stats View -->
                <div v-else-if="currentView === 'stats'" key="stats">
                    <GoblinStats @switch-to-goals="currentView = 'goals'" />
                </div>

                <!-- Feed View -->
                <div v-else key="feed">
                    <GoblinLogList 
                        :logs="personalStore.logs"
                        :user-goals="personalStore.userGoals"
                        @delete="handleDelete"
                        @edit="handleEdit"
                    />
                </div>
            </Transition>

            <!-- Loading State -->
            <Transition
                enter-active-class="transition duration-200"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div 
                    v-if="isLoading" 
                    class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50"
                >
                    <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-2xl">
                        <div class="flex items-center gap-3">
                            <Loader2 :size="24" class="animate-spin text-emerald-400" />
                            <span class="text-slate-200">{{ loadingMessage }}</span>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { usePersonalStore } from '@/stores/usePersonalStore';
import GoblinHeader from '@/components/personal/tracker/GoblinHeader.vue';
import GoblinForm from '@/components/personal/tracker/GoblinForm.vue';
import GoblinLogList from '@/components/personal/tracker/GoblinLogList.vue';
import GoblinStats from '@/components/personal/tracker/GoblinStats.vue';
import GoblinGoals from '@/components/personal/tracker/GoblinGoals.vue';
import { Loader2 } from 'lucide-vue-next';

const personalStore = usePersonalStore();

const currentView = ref('feed');
const isLoading = ref(false);
const loadingMessage = ref('');
const isEditing = ref(false);
const editingLog = ref(null);

const moods = [
    { value: 'delighted', label: 'Delighted', emoji: '😍' },
    { value: 'satisfied', label: 'Satisfied', emoji: '😊' },
    { value: 'neutral', label: 'Neutral', emoji: '😐' },
    { value: 'disappointed', label: 'Disappointed', emoji: '😕' },
    { value: 'regret', label: 'Regret', emoji: '🤢' }
];

const currentLog = reactive({
    item: '',
    type: 'food',
    servings: 1,
    variant: '',
    timestamp: getCurrentTimestamp(),
    mood: 'satisfied',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sodium: 0,
    sugar: 0
});

function getCurrentTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function handleEdit(log) {
    isEditing.value = true;
    editingLog.value = {
        ...log,
        timestamp: formatDateForInput(log.timestamp)
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
    isEditing.value = false;
    editingLog.value = null;
}

async function handleUpdate() {
    if (!editingLog.value) return;

    isLoading.value = true;
    loadingMessage.value = 'Updating entry...';

    try {
        const logToUpdate = {
            ...editingLog.value,
            timestamp: new Date(editingLog.value.timestamp)
        };

        await personalStore.updateGoblinLog(logToUpdate);
        
        isEditing.value = false;
        editingLog.value = null;
    } catch (error) {
        console.error('[ERROR] Failed to update log:', error);
        alert('Failed to update log. Please try again.');
    } finally {
        isLoading.value = false;
    }
}

function formatDateForInput(date) {
    if (!date) return getCurrentTimestamp();
    
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

async function handleWaterLog(ml) {
    isLoading.value = true;
    loadingMessage.value = 'Logging water...';

    try {
        await personalStore.addWaterLog(ml);
        
        // Switch to feed or stay on current view
        if (currentView.value !== 'feed' && currentView.value !== 'stats') {
            currentView.value = 'feed';
        }
    } catch (error) {
        console.error('[ERROR] Failed to log water:', error);
        alert('Failed to log water. Please try again.');
    } finally {
        isLoading.value = false;
    }
}

async function handleSubmit() {
    if (!currentLog.item.trim() || !currentLog.timestamp || currentLog.servings <= 0) {
        return;
    }

    isLoading.value = true;
    loadingMessage.value = 'Saving your feast...';

    try {
        const logToAdd = {
            item: currentLog.item.trim(),
            type: currentLog.type,
            servings: currentLog.servings || 1,
            variant: currentLog.variant || '',
            timestamp: new Date(currentLog.timestamp),
            mood: currentLog.mood,
            calories: currentLog.calories || 0,
            protein: currentLog.protein || 0,
            carbs: currentLog.carbs || 0,
            fat: currentLog.fat || 0,
            sodium: currentLog.sodium || 0,
            sugar: currentLog.sugar || 0
        };

        await personalStore.addGoblinLog(logToAdd);

        // Reset form
        Object.assign(currentLog, {
            item: '',
            type: 'food',
            servings: 1,
            variant: '',
            timestamp: getCurrentTimestamp(),
            mood: 'satisfied',
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            sodium: 0,
            sugar: 0
        });

        // Switch to feed view to show the new log
        currentView.value = 'feed';
    } catch (error) {
        console.error('[ERROR] Failed to add log:', error);
        alert('Failed to save log. Please try again.');
    } finally {
        isLoading.value = false;
    }
}

async function handleDelete(index) {
    const log = personalStore.logs[index];
    if (!log) return;

    const displayName = log.variant 
        ? `${log.item} (${log.variant})`
        : log.item;
    
    const servingText = log.servings > 1 
        ? ` - ${log.servings} servings`
        : '';

    if (!confirm(`Delete "${displayName}"${servingText}?`)) {
        return;
    }

    isLoading.value = true;
    loadingMessage.value = 'Deleting...';

    try {
        await personalStore.deleteGoblinLog(log);
    } catch (error) {
        console.error('[ERROR] Failed to delete log:', error);
        alert('Failed to delete log. Please try again.');
    } finally {
        isLoading.value = false;
    }
}

// Load food database on mount
onMounted(async () => {
    isLoading.value = true;
    loadingMessage.value = 'Loading food database...';
    
    try {
        await personalStore.loadFoodDatabase();
    } catch (error) {
        console.error('[ERROR] Failed to load food database:', error);
    } finally {
        isLoading.value = false;
    }
});
</script>