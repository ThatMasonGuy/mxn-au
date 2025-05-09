<template>
    <div class="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8">
        <div class="max-w-3xl mx-auto">
            <!-- Header Section -->
            <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-700">
                <h1 class="text-3xl md:text-4xl font-extrabold text-emerald-400 tracking-tight">
                    Eat, you Goblin
                </h1>
            </div>

            <!-- Input Card -->
            <div class="bg-slate-800 rounded-lg shadow-lg mb-8 overflow-hidden">
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- What did you consume -->
                        <div class="relative">
                            <label for="consumable" class="block text-sm font-medium text-slate-300 mb-2">
                                What did you consume, goblin?
                            </label>
                            <input id="consumable" v-model="itemInput" @input="newLog.item = itemInput"
                                @keydown="handleKeyDown" @keydown.tab.prevent="selectAutocompleteItem($event)"
                                @focus="showSuggestions = filteredItems.length > 0"
                                @blur="handleBlur" autocomplete="off"
                                placeholder="Pizza, Coffee, Human Souls..."
                                class="w-full bg-slate-700 text-slate-200 rounded-md border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2" />

                            <ul v-if="showSuggestions && filteredItems.length" role="listbox"
                                class="bg-slate-800 border border-slate-600 rounded-md mt-1 text-sm max-h-40 overflow-y-auto absolute z-50 w-full">
                                <li v-for="(item, i) in filteredItems" :key="item" role="option"
                                    @mousedown.prevent="chooseItem(item)" :class="[
                                        'px-4 py-2 cursor-pointer',
                                        i === activeIndex ? 'bg-emerald-600 text-slate-900' : 'text-slate-300 hover:bg-slate-700'
                                    ]">
                                    {{ item }}
                                </li>
                            </ul>
                        </div>

                        <!-- Type selector -->
                        <div>
                            <label for="type" class="block text-sm font-medium text-slate-300 mb-2">
                                Type
                            </label>
                            <select id="type" v-model="newLog.type"
                                class="w-full bg-slate-700 text-slate-200 rounded-md border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2">
                                <option value="food">Food</option>
                                <option value="drink">Drink</option>
                                <option value="snack">Snack</option>
                                <option value="treat">Treat</option>
                            </select>
                        </div>

                        <!-- When did you eat it -->
                        <div>
                            <label for="date" class="block text-sm font-medium text-slate-300 mb-2">
                                When did you devour it?
                            </label>
                            <input id="date" type="datetime-local" v-model="newLog.timestamp"
                                class="w-full bg-slate-700 text-slate-200 rounded-md border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2" />
                        </div>

                        <!-- Quantity -->
                        <div>
                            <label for="quantity" class="block text-sm font-medium text-slate-300 mb-2">
                                How much?
                            </label>
                            <div class="flex space-x-2">
                                <input id="quantity" type="number" v-model.number="newLog.quantity" min="1"
                                    class="w-20 bg-slate-700 text-slate-200 rounded-md border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2" />
                                <select v-model="newLog.unit"
                                    class="flex-1 bg-slate-700 text-slate-200 rounded-md border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2">
                                    <option value="piece">piece(s)</option>
                                    <option value="cup">cup(s)</option>
                                    <option value="bowl">bowl(s)</option>
                                    <option value="plate">plate(s)</option>
                                    <option value="serving">serving(s)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Mood Selector -->
                    <div class="mt-6">
                        <label class="block text-sm font-medium text-slate-300 mb-3">
                            How did it make you feel?
                        </label>
                        <div class="flex flex-wrap gap-2">
                            <button v-for="mood in moods" :key="mood.value" @click="selectMood(mood.value)"
                                class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-1"
                                :class="newLog.mood === mood.value
                                    ? 'bg-emerald-500 text-slate-900 shadow-md scale-105'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'" type="button">
                                <span class="text-lg">{{ mood.emoji }}</span>
                                <span>{{ mood.label }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="mt-8 flex justify-center">
                        <button @click="addLog" :disabled="!isFormValid"
                            class="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0">
                            DEVOUR
                        </button>
                    </div>
                </div>
            </div>

            <!-- Log Entries -->
            <transition-group name="list" tag="div" class="space-y-4">
                <div v-for="(log, index) in sortedLogs" :key="log.id" :class="[
                    'bg-slate-800 rounded-lg shadow overflow-hidden transition-all duration-300',
                    log.type === 'food' && 'hover:shadow-[0_0_12px_2px_rgba(244,63,94,0.5)]',
                    log.type === 'drink' && 'hover:shadow-[0_0_12px_2px_rgba(59,130,246,0.5)]',
                    log.type === 'snack' && 'hover:shadow-[0_0_12px_2px_rgba(245,158,11,0.5)]',
                    log.type === 'treat' && 'hover:shadow-[0_0_12px_2px_rgba(168,85,247,0.5)]',
                    {
                        'border-l-4 border-rose-500': log.type === 'food',
                        'border-l-4 border-blue-500': log.type === 'drink',
                        'border-l-4 border-amber-500': log.type === 'snack',
                        'border-l-4 border-purple-500': log.type === 'treat'
                    }
                ]">

                    <div class="p-4 flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 flex items-center justify-center rounded-full text-2xl" :class="{
                                'bg-rose-500/20': log.type === 'food',
                                'bg-blue-500/20': log.type === 'drink',
                                'bg-amber-500/20': log.type === 'snack',
                                'bg-purple-500/20': log.type === 'treat'
                            }">
                                {{ getEmoji(log.type) }}
                            </div>
                            <div>
                                <h3 class="font-bold text-lg text-slate-100">{{ log.item }}</h3>
                                <div class="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                    <span>{{ formatDate(log.timestamp) }}</span>
                                    <span>{{ log.quantity }} {{ log.unit }}</span>
                                    <span class="flex items-center">
                                        <span class="mr-1">Mood:</span>
                                        <span class="text-base">{{ getMoodEmoji(log.mood) }}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button @click="deleteLog(index)"
                            class="text-slate-400 hover:text-rose-400 transition-colors duration-200 p-1"
                            aria-label="Delete log">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </transition-group>

            <!-- Empty State -->
            <div v-if="logs.length === 0" class="mt-10 text-center py-12 bg-slate-800/50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-slate-600" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <p class="mt-4 text-slate-400 text-lg font-medium">No consumption logs yet, goblin! Are you starving?
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()

const logs = ref([]);
const logsCollectionName = 'goblinTracker'
const logsCollection = collection(firestore, logsCollectionName);

// Real-time fetch
onMounted(() => {
    const q = query(logsCollection, orderBy("timestamp", "desc"));

    onSnapshot(q, snapshot => {
        logs.value = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                timestamp: data.timestamp?.toDate?.() ?? null
            };
        });
    });
});

function handleBlur() {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 100);
}

const itemInput = ref('');
const activeIndex = ref(0);
const showSuggestions = ref(false);

const previousItems = computed(() => {
    const unique = new Set(logs.value.map(log => log.item.trim()).filter(Boolean));
    return Array.from(unique).sort();
});

const filteredItems = computed(() => {
    const input = itemInput.value.trim().toLowerCase();
    return input
        ? previousItems.value.filter(item =>
            item.toLowerCase().includes(input)
        )
        : [];
});

watch(itemInput, () => {
    showSuggestions.value = filteredItems.value.length > 0;
    activeIndex.value = 0;
});

function chooseItem(item) {
    newLog.value.item = item;
    itemInput.value = item;
    showSuggestions.value = false;
    activeIndex.value = 0;

    // Force blur to close suggestions
    const inputEl = document.getElementById("consumable");
    inputEl?.blur();
}

function selectAutocompleteItem(e) {
    if (showSuggestions.value && filteredItems.value[activeIndex.value]) {
        e.preventDefault();
        chooseItem(filteredItems.value[activeIndex.value]);
    }
}

function handleKeyDown(e) {
    if (!showSuggestions.value || filteredItems.value.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex.value = (activeIndex.value + 1) % filteredItems.value.length;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex.value = (activeIndex.value - 1 + filteredItems.value.length) % filteredItems.value.length;
    } else if (e.key === 'Enter') {
        e.preventDefault();
        selectAutocompleteItem(e);
    } else if (e.key === 'Escape') {
        showSuggestions.value = false;
    }
}

// Add log
async function addLog() {
    if (!isFormValid.value) return;

    const logData = {
        ...newLog.value,
        timestamp: Timestamp.fromDate(new Date(newLog.value.timestamp))
    };

    await addDoc(collection(firestore, logsCollectionName), logData);
    toast({
        title: 'Log Added',
        description: `${newLog.value.item} has been logged.`,
        variant: 'success'
    });

    const currentType = newLog.value.type;
    newLog.value = {
        item: '',
        type: currentType,
        timestamp: formatDateForInput(new Date()),
        quantity: 1,
        unit: 'serving',
        mood: 'satisfied'
    };

    itemInput.value = '';
    recentLog.value = true;
    setTimeout(() => (recentLog.value = false), 1000);
}

// Delete log
async function deleteLog(index) {
    const log = logs.value[index];

    if (!log?.id) {
        console.warn('No ID found for log entry:', log);
        toast({
            title: 'Deletion Failed',
            description: 'That log had no valid ID to delete.',
            variant: 'error'
        });
        return;
    }

    try {
        const logRef = doc(firestore, logsCollectionName, log.id);
        await deleteDoc(logRef);
        console.log('Deleted log:', log.id);
        toast({
            title: 'Log Deleted',
            description: `${log.item} has been banished to the shadow realm.`,
            variant: 'destructive'
        });
    } catch (err) {
        console.error('Error deleting log:', err);
        toast({
            title: 'Error deleting log',
            description: err.message || 'Something went wrong.',
            variant: 'Error'
        });
    }
}

const recentLog = ref(false);

const newLog = ref({
    item: '',
    type: 'food',
    timestamp: formatDateForInput(new Date()),
    quantity: 1,
    unit: 'serving',
    mood: 'satisfied'
});

const moods = [
    { value: 'delighted', label: 'Delighted', emoji: '😍' },
    { value: 'satisfied', label: 'Satisfied', emoji: '😊' },
    { value: 'neutral', label: 'Meh', emoji: '😐' },
    { value: 'disappointed', label: 'Disappointed', emoji: '😕' },
    { value: 'regret', label: 'Regret', emoji: '🤢' }
];

const isFormValid = computed(() => {
    return newLog.value.item.trim() !== '' && newLog.value.timestamp !== '';
});

const sortedLogs = computed(() => {
    return [...logs.value].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});

function formatDateForInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDate(date) {
    if (!(date instanceof Date) || isNaN(date)) return 'Invalid date';

    return new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(date);
}

function getEmoji(type) {
    const emojis = {
        food: '🍔',
        drink: '🥤',
        snack: '🍿',
        treat: '🍰'
    };
    return emojis[type] || '🍽️';
}

function getMoodEmoji(mood) {
    const foundMood = moods.find(m => m.value === mood);
    return foundMood ? foundMood.emoji : '😐';
}

function selectMood(mood) {
    newLog.value.mood = mood;
}
</script>

<style>
/* For Transitions */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>