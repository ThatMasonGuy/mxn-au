<!-- Tracker.vue -->
<template>
    <div class="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8">
        <div class="max-w-3xl mx-auto">
            <GoblinHeader />

            <GoblinForm :log="newLog" :moods="moods" :previous-items="previousItems"
                @update:item="val => newLog.item = val" @update:mood="val => newLog.mood = val" @submit="addLog" />

            <GoblinLogList :logs="sortedLogs" @delete="deleteLog" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue';
import { Timestamp } from 'firebase/firestore';
import { useToast } from '@/components/ui/toast';
import { usePersonalStore } from '@/stores/usePersonalStore';

import GoblinHeader from '@/components/personal/tracker/GoblinHeader.vue';
import GoblinForm from '@/components/personal/tracker/GoblinForm.vue';
import GoblinLogList from '@/components/personal/tracker/GoblinLogList.vue';

const { toast } = useToast();
const personalStore = usePersonalStore();

// Use store logs directly
const sortedLogs = computed(() => {
    // Ensure logs is an array before sorting
    return Array.isArray(personalStore.logs)
        ? [...personalStore.logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        : [];
});

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

const isFormValid = computed(() => newLog.value.item.trim() !== '' && newLog.value.timestamp !== '');

const previousItems = computed(() => {
    return Array.isArray(personalStore.logs)
        ? Array.from(new Set(personalStore.logs.map(l => l.item?.trim()).filter(Boolean))).sort()
        : [];
});

async function addLog() {
    if (!isFormValid.value || !personalStore.uid) return;

    const logData = {
        ...newLog.value,
        timestamp: Timestamp.fromDate(new Date(newLog.value.timestamp))
    };

    await personalStore.addGoblinLog(logData);

    toast({
        title: 'Log Added',
        description: `${newLog.value.item} has been logged.`,
        variant: 'success'
    });

    resetForm();
}

async function deleteLog(index) {
    const log = sortedLogs.value[index];
    if (!log?.id || !personalStore.uid) return;

    await personalStore.deleteGoblinLog(log);

    toast({
        title: 'Log Deleted',
        description: `${log.item} has been banished to the shadow realm.`,
        variant: 'destructive'
    });
}

function resetForm() {
    newLog.value = {
        item: '',
        type: 'food',
        timestamp: formatDateForInput(new Date()),
        quantity: 1,
        unit: 'serving',
        mood: 'satisfied'
    };
}

function formatDateForInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
</script>