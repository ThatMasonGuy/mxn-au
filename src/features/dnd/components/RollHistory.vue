<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold flex items-center gap-2">
        <Clock class="w-6 h-6 text-cyan-400" />
        Roll History
      </h2>
      <div class="flex items-center gap-3">
        <!-- Filters -->
        <select
          v-model="filterType"
          class="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-purple-400"
        >
          <option value="">All Types</option>
          <option value="Attack">Attacks</option>
          <option value="Save">Saves</option>
          <option value="Check">Checks</option>
          <option value="Damage">Damage</option>
        </select>
        
        <select
          v-model="filterEntity"
          class="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-purple-400"
        >
          <option value="">All Entities</option>
          <option value="character">Characters</option>
          <option value="enemy">Enemies</option>
        </select>

        <button
          @click="exportLogs"
          class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Download class="w-4 h-4" />
          Export
        </button>

        <button
          v-if="logs.length > 0"
          @click="confirmClear"
          class="px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Trash2 class="w-4 h-4" />
          Clear All
        </button>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-6 gap-4 mb-6">
      <div class="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div class="text-xs text-slate-400 mb-1">Total Rolls</div>
        <div class="text-2xl font-bold">{{ filteredLogs.length }}</div>
      </div>
      <div class="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div class="text-xs text-slate-400 mb-1">Attacks</div>
        <div class="text-2xl font-bold text-red-400">{{ rollsByType('Attack') }}</div>
      </div>
      <div class="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div class="text-xs text-slate-400 mb-1">Saves</div>
        <div class="text-2xl font-bold text-blue-400">{{ rollsByType('Save') }}</div>
      </div>
      <div class="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div class="text-xs text-slate-400 mb-1">Checks</div>
        <div class="text-2xl font-bold text-purple-400">{{ rollsByType('Check') }}</div>
      </div>
      <div class="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div class="text-xs text-slate-400 mb-1">Success Rate</div>
        <div class="text-2xl font-bold text-green-400">{{ successRate }}%</div>
      </div>
      <div class="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div class="text-xs text-slate-400 mb-1">Nat 20s</div>
        <div class="text-2xl font-bold text-yellow-400">{{ nat20Count }}</div>
      </div>
    </div>

    <!-- Roll Log Table -->
    <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-900 border-b border-slate-700">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-400">Time</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-400">Entity</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-400">Type</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-400">Roll</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-400">Total</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-400">Target</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-400">Result</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-400">Notes</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700">
            <tr
              v-for="log in paginatedLogs"
              :key="log.id"
              class="hover:bg-slate-900/50 transition-colors"
            >
              <td class="px-4 py-3 text-sm text-slate-300">
                {{ formatTime(log.timestamp) }}
              </td>
              <td class="px-4 py-3 text-sm">
                <div class="flex items-center gap-2">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="log.type === 'character' ? 'bg-blue-400' : 'bg-red-400'"
                  />
                  {{ log.name }}
                </div>
              </td>
              <td class="px-4 py-3 text-sm">
                <span
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="getTypeClass(log.rollType)"
                >
                  {{ log.rollType }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-slate-400 font-mono">
                {{ log.rollValue }}{{ log.modifier >= 0 ? '+' : ''}}{{ log.modifier }}
              </td>
              <td class="px-4 py-3 text-sm font-bold"
                :class="getTotalClass(log)"
              >
                {{ log.total }}
              </td>
              <td class="px-4 py-3 text-sm text-slate-400">
                {{ log.target || '-' }}
              </td>
              <td class="px-4 py-3 text-sm">
                <span
                  v-if="log.target"
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="log.success ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'"
                >
                  {{ log.success ? 'Success' : 'Fail' }}
                </span>
                <span v-else class="text-slate-500">-</span>
              </td>
              <td class="px-4 py-3 text-sm text-slate-400 max-w-xs truncate">
                {{ log.notes || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredLogs.length === 0" class="p-12 text-center">
        <Clock class="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p class="text-slate-400">No rolls logged yet</p>
      </div>

      <!-- Pagination -->
      <div v-if="filteredLogs.length > itemsPerPage" class="border-t border-slate-700 px-4 py-3 flex items-center justify-between">
        <div class="text-sm text-slate-400">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredLogs.length) }} of {{ filteredLogs.length }}
        </div>
        <div class="flex gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            Previous
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage * itemsPerPage >= filteredLogs.length"
            class="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Clock, Download, Trash2 } from 'lucide-vue-next';

const props = defineProps({
  logs: Array,
});

const emit = defineEmits(['clear']);

const filterType = ref('');
const filterEntity = ref('');
const currentPage = ref(1);
const itemsPerPage = 50;

const filteredLogs = computed(() => {
  return props.logs.filter(log => {
    if (filterType.value && log.rollType !== filterType.value) return false;
    if (filterEntity.value && log.type !== filterEntity.value) return false;
    return true;
  });
});

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredLogs.value.slice(start, end);
});

const rollsByType = (type) => {
  return filteredLogs.value.filter(l => l.rollType === type).length;
};

const successRate = computed(() => {
  const withTargets = filteredLogs.value.filter(l => l.target);
  if (withTargets.length === 0) return 0;
  const successes = withTargets.filter(l => l.success).length;
  return Math.round((successes / withTargets.length) * 100);
});

const nat20Count = computed(() => {
  return filteredLogs.value.filter(l => l.rollValue === 20).length;
});

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const getTypeClass = (type) => {
  const classes = {
    Attack: 'bg-red-900/30 text-red-400',
    Save: 'bg-blue-900/30 text-blue-400',
    Check: 'bg-purple-900/30 text-purple-400',
    Damage: 'bg-orange-900/30 text-orange-400',
  };
  return classes[type] || 'bg-slate-700 text-slate-400';
};

const getTotalClass = (log) => {
  if (log.rollValue === 20) return 'text-yellow-400';
  if (log.rollValue === 1) return 'text-red-400';
  if (log.target && log.success) return 'text-green-400';
  if (log.target && !log.success) return 'text-red-400';
  return 'text-slate-300';
};

const confirmClear = () => {
  if (confirm('Clear all roll history? This cannot be undone.')) {
    emit('clear');
  }
};

const exportLogs = () => {
  const data = filteredLogs.value.map(log => ({
    Timestamp: formatTime(log.timestamp),
    Entity: log.name,
    Type: log.type,
    RollType: log.rollType,
    Roll: log.rollValue,
    Modifier: log.modifier,
    Total: log.total,
    Target: log.target || '',
    Success: log.target ? (log.success ? 'Yes' : 'No') : '',
    Notes: log.notes || '',
  }));

  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `roll-history-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
};
</script>