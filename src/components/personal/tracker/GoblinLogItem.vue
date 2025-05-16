<template>
    <div class="group bg-slate-800 rounded-lg shadow overflow-hidden transition-all duration-300 relative"
        :class="[borderClasses, hoverShadowClasses]">
        <div class="p-4 flex items-center justify-between">
            <div class="flex items-center space-x-4 w-full">
                <!-- Emoji Badge -->
                <div class="w-12 h-12 flex items-center justify-center rounded-full text-2xl" :class="badgeClasses">
                    {{ getEmoji(editedLog.type) }}
                </div>

                <!-- Main Content -->
                <div class="flex-1">
                    <!-- Display Mode -->
                    <div v-if="!isEditing">
                        <div class="flex items-center gap-2">
                            <h3 class="font-bold text-lg text-slate-100">
                                {{ editedLog.item }}
                            </h3>
                            <span v-if="hasMacros" @click="showMacros = !showMacros"
                                class="text-xs px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-500 cursor-pointer hover:bg-emerald-500/30 transition">
                                {{ showMacros ? 'Hide Macros' : 'Macros Logged' }}
                            </span>
                        </div>

                        <div class="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <span>{{ formatDate(editedLog.timestamp) }}</span>
                            <span>{{ editedLog.quantity }} {{ editedLog.unit }}</span>
                            <span class="flex items-center">
                                <span class="mr-1">Mood:</span>
                                <span class="text-base">{{ getMoodEmoji(editedLog.mood) }}</span>
                            </span>
                        </div>

                        <!-- Foldout Macros -->
                        <Transition name="fade-slide" enter-active-class="transition duration-300 ease-out"
                            enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                            leave-active-class="transition duration-200 ease-in"
                            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                            <div v-if="showMacros"
                                class="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300">
                                <div v-if="editedLog.calories">🔥 {{ editedLog.calories }} kcal</div>
                                <div v-if="editedLog.protein">💪 {{ editedLog.protein }}g protein</div>
                                <div v-if="editedLog.carbs">🍞 {{ editedLog.carbs }}g carbs</div>
                                <div v-if="editedLog.fat">🧈 {{ editedLog.fat }}g fat</div>
                            </div>
                        </Transition>
                    </div>

                    <!-- Edit Mode -->
                    <div v-else class="space-y-1">
                        <input v-model="editedLog.item" class="bg-slate-700 rounded px-2 py-1 w-full text-white"
                            placeholder="Item name" />
                        <div class="flex flex-wrap gap-2 items-center">
                            <input type="number" v-model.number="editedLog.quantity"
                                class="bg-slate-700 rounded px-2 py-1 w-20 text-white" />
                            <input v-model="editedLog.unit" class="bg-slate-700 rounded px-2 py-1 w-24 text-white" />
                            <select v-model="editedLog.mood" class="bg-slate-700 rounded px-2 py-1 text-white">
                                <option value="delighted">😍 Delighted</option>
                                <option value="satisfied">😊 Satisfied</option>
                                <option value="neutral">😐 Neutral</option>
                                <option value="disappointed">😕 Disappointed</option>
                                <option value="regret">🤢 Regret</option>
                            </select>
                            <input type="datetime-local" v-model="editedTimestampInput"
                                class="bg-slate-700 rounded px-2 py-1 text-white" />
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div
                    class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button v-if="!isEditing" @click="isEditing = true" class="text-slate-400 hover:text-amber-400 p-1"
                        aria-label="Edit log">
                        <PencilIcon class="w-5 h-5 text-slate-400 hover:text-amber-400 transition" />
                    </button>
                    <button v-if="isEditing" @click="saveChanges" class="text-slate-400 hover:text-green-400 p-1"
                        aria-label="Save log">
                        <CheckCircleIcon class="w-5 h-5 text-slate-400 hover:text-green-400 transition" />
                    </button>
                    <button @click="$emit('delete')" class="text-slate-400 hover:text-rose-400 p-1"
                        aria-label="Delete log">
                        <TrashIcon class="w-5 h-5 text-slate-400 hover:text-rose-400 transition" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { usePersonalStore } from '@/stores/usePersonalStore';
import { PencilIcon, TrashIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    log: { type: Object, required: true }
});
const emit = defineEmits(['delete']);

const personalStore = usePersonalStore();
const isEditing = ref(false);
const editedLog = reactive({ ...props.log });
const editedTimestampInput = ref(formatDateTimeLocal(editedLog.timestamp));

const hasMacros = computed(() => {
    return (
        editedLog.calories > 0 ||
        editedLog.protein > 0 ||
        editedLog.carbs > 0 ||
        editedLog.fat > 0
    );
});

const showMacros = ref(false);

async function saveChanges() {
    if (!personalStore.uid) return;

    const logRef = doc(
        firestore,
        'users',
        personalStore.uid,
        'personal',
        'goblinTracker',
        'logs',
        props.log.id
    );

    updateDoc(logRef, {
        item: editedLog.item,
        quantity: editedLog.quantity,
        unit: editedLog.unit,
        mood: editedLog.mood
    }).then(() => {
        isEditing.value = false;
    }).catch(err => {
        console.error('[Edit Failed]', err);
    });

    const parsedDate = new Date(editedTimestampInput.value);

    await updateDoc(logRef, {
        item: editedLog.item,
        quantity: editedLog.quantity,
        unit: editedLog.unit,
        mood: editedLog.mood,
        timestamp: isNaN(parsedDate.getTime()) ? editedLog.timestamp : parsedDate
    });

}

function formatDate(date) {
    return new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(date);
}

function formatDateTimeLocal(date) {
    if (!(date instanceof Date)) return '';
    const pad = n => n.toString().padStart(2, '0');

    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());

    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
}

function getEmoji(type) {
    return {
        food: '🍔',
        drink: '🥤',
        snack: '🍿',
        treat: '🍰'
    }[type] || '🍽️';
}

function getMoodEmoji(mood) {
    return {
        delighted: '😍',
        satisfied: '😊',
        neutral: '😐',
        disappointed: '😕',
        regret: '🤢'
    }[mood] || '😐';
}

const badgeClasses = {
    'bg-rose-500/20': editedLog.type === 'food',
    'bg-blue-500/20': editedLog.type === 'drink',
    'bg-amber-500/20': editedLog.type === 'snack',
    'bg-purple-500/20': editedLog.type === 'treat'
};

const borderClasses = {
    'border-l-4 border-rose-500': editedLog.type === 'food',
    'border-l-4 border-blue-500': editedLog.type === 'drink',
    'border-l-4 border-amber-500': editedLog.type === 'snack',
    'border-l-4 border-purple-500': editedLog.type === 'treat'
};

const hoverShadowClasses = computed(() => {
    switch (editedLog.type) {
        case 'food':
            return 'hover:shadow-[0_0_12px_2px_rgba(244,63,94,0.5)]'; // rose-500
        case 'drink':
            return 'hover:shadow-[0_0_12px_2px_rgba(59,130,246,0.5)]'; // blue-500
        case 'snack':
            return 'hover:shadow-[0_0_12px_2px_rgba(245,158,11,0.5)]'; // amber-500
        case 'treat':
            return 'hover:shadow-[0_0_12px_2px_rgba(168,85,247,0.5)]'; // purple-500
        default:
            return '';
    }
});
</script>