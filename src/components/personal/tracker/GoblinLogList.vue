<!-- GoblinLogList.vue -->
<template>
    <div v-if="groupedLogs.length" class="space-y-8">
        <div v-for="(group, index) in groupedLogs" :key="group.date" class="space-y-4">
            <div class="sticky top-0 z-10 bg-slate-900/80 backdrop-blur border-b border-slate-700 py-2 px-1">
                <h2 class="text-xl font-bold text-purple-300 tracking-wide">
                    {{ formatDisplayDate(group.date) }}
                </h2>
            </div>

            <transition-group name="list" tag="div" class="space-y-3">
                <GoblinLogItem v-for="(log, logIndex) in group.logs" :key="log.id" :log="log"
                    @delete="() => $emit('delete', getLogIndex(log))" />
            </transition-group>
        </div>
    </div>

    <div v-else class="mt-10 text-center py-12 bg-slate-800/50 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-slate-600" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <p class="mt-4 text-slate-400 text-lg font-medium">No consumption logs yet, goblin! Are you starving?</p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import GoblinLogItem from './GoblinLogItem.vue';

const props = defineProps({
    logs: {
        type: Array,
        required: true
    }
});
const emit = defineEmits(['delete']);

const groupedLogs = computed(() => {
  const map = new Map();

  [...props.logs]
    .filter(log => !!log.timestamp) // ⛑️ Guard: skip logs with no timestamp
    .sort((a, b) => getTimestamp(b) - getTimestamp(a)) // Sort by date descending
    .forEach(log => {
      const date = formatDateKey(getTimestamp(log));
      if (!map.has(date)) map.set(date, []);
      map.get(date).push(log);
    });

  return Array.from(map, ([date, logs]) => ({ date, logs }));
});

function getTimestamp(log) {
  if (!log.timestamp) return 0;
  if (typeof log.timestamp.toDate === 'function') {
    return log.timestamp.toDate().getTime();
  }
  if (typeof log.timestamp === 'object' && 'seconds' in log.timestamp) {
    return log.timestamp.seconds * 1000;
  }
  if (log.timestamp instanceof Date) {
    return log.timestamp.getTime();
  }
  return 0;
}

function formatDateKey(timestamp) {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Unknown';
  return date.toISOString().split('T')[0];
}

// 🧮 Find index for delete by log ID
function getLogIndex(logToDelete) {
    return props.logs.findIndex(l => l.id === logToDelete.id);
}

// 📅 Make date cuter
function formatDisplayDate(isoDate) {
    const today = new Date();
    const date = new Date(isoDate);
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = new Date(today.setDate(today.getDate() - 1)).toDateString() === date.toDateString();

    return isToday ? 'Today' : isYesterday ? 'Yesterday' : date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}
</script>