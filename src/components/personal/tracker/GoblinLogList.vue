<template>
  <div class="space-y-6">
      <div v-if="groupedLogs.length" class="space-y-6">
          <TransitionGroup
              name="list"
              tag="div"
              class="space-y-6"
          >
              <div v-for="group in groupedLogs" :key="group.date" class="space-y-3">
                  <!-- Date Header with Stats -->
                  <div class="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 -mx-4 px-4 py-3">
                      <div class="flex items-center justify-between">
                          <h2 class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-400">
                              {{ formatDisplayDate(group.date) }}
                          </h2>
                          <div class="flex items-center gap-3 text-xs text-slate-400">
                              <span class="flex items-center gap-1">
                                  <Pizza :size="14" />
                                  {{ group.logs.length }}
                              </span>
                              <span v-if="group.totalCalories" class="flex items-center gap-1">
                                  <Flame :size="14" class="text-orange-400" />
                                  {{ group.totalCalories }}
                              </span>
                          </div>
                      </div>
                  </div>

                  <!-- Logs for this day -->
                  <TransitionGroup
                      name="log-item"
                      tag="div"
                      class="space-y-3"
                  >
                      <GoblinLogItem 
                          v-for="log in group.logs" 
                          :key="log.id" 
                          :log="log"
                          :user-goals="userGoals"
                          @delete="() => $emit('delete', getLogIndex(log))"
                          @edit="() => $emit('edit', log)"
                      />
                  </TransitionGroup>
              </div>
          </TransitionGroup>

          <!-- Load More Button -->
          <Transition
              enter-active-class="transition duration-200"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
          >
              <div v-if="personalStore.hasMoreLogs" class="flex justify-center pt-4">
                  <button
                      @click="loadMore"
                      :disabled="personalStore.isLoadingMore"
                      class="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 rounded-lg border border-slate-600 hover:border-slate-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      <Loader2 v-if="personalStore.isLoadingMore" :size="18" class="animate-spin" />
                      <ChevronDown v-else :size="18" />
                      <span class="font-medium">
                          {{ personalStore.isLoadingMore ? 'Loading...' : 'Load More (1 week)' }}
                      </span>
                  </button>
              </div>
          </Transition>

          <!-- All Loaded Message -->
          <Transition
              enter-active-class="transition duration-200"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
          >
              <div v-if="!personalStore.hasMoreLogs && groupedLogs.length > 0" class="text-center py-6">
                  <div class="inline-flex items-center gap-2 text-sm text-slate-500">
                      <Check :size="16" />
                      <span>All logs loaded</span>
                  </div>
              </div>
          </Transition>
      </div>

      <!-- Empty State -->
      <div v-else class="mt-10 text-center py-16 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50">
          <div class="relative inline-block">
              <Pizza :size="64" class="text-slate-600 mx-auto animate-pulse" />
              <Sparkles :size="24" class="absolute -top-2 -right-2 text-yellow-400 animate-bounce" />
          </div>
          <p class="mt-6 text-slate-300 text-lg font-medium">No consumption logs yet, goblin!</p>
          <p class="mt-2 text-slate-500 text-sm">Start tracking your feasts above 👆</p>
      </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePersonalStore } from '@/stores/usePersonalStore';
import GoblinLogItem from './GoblinLogItem.vue';
import { Pizza, Flame, Sparkles, ChevronDown, Loader2, Check } from 'lucide-vue-next';

const props = defineProps({
  logs: {
      type: Array,
      required: true
  },
  userGoals: {
      type: Object,
      default: null
  }
});

const emit = defineEmits(['delete', 'edit']);

const personalStore = usePersonalStore();

const groupedLogs = computed(() => {
  const map = new Map();

  [...props.logs]
      .filter(log => !!log.timestamp)
      .sort((a, b) => getTimestamp(b) - getTimestamp(a))
      .forEach(log => {
          const date = formatDateKey(getTimestamp(log));
          if (!map.has(date)) {
              map.set(date, []);
          }
          map.get(date).push(log);
      });

  // Convert to array and add summary stats
  return Array.from(map, ([date, logs]) => {
      const totalCalories = logs.reduce((sum, log) => {
          const servings = log.servings || log.quantity || 1;
          return sum + ((log.calories || 0) * servings);
      }, 0);

      return {
          date,
          logs,
          totalCalories: Math.round(totalCalories)
      };
  });
});

function loadMore() {
  personalStore.loadMoreLogs();
}

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

function getLogIndex(logToDelete) {
  return props.logs.findIndex(l => l.id === logToDelete.id);
}

function formatDisplayDate(isoDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const date = new Date(isoDate);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
      return 'Today';
  } else if (date.getTime() === yesterday.getTime()) {
      return 'Yesterday';
  } else {
      return date.toLocaleDateString(undefined, { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
      });
  }
}
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-active {
  position: absolute;
}

.log-item-move,
.log-item-enter-active,
.log-item-leave-active {
  transition: all 0.3s ease;
}

.log-item-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.log-item-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>