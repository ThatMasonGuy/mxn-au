<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="grid grid-cols-2 gap-6">
      <!-- Quick Roll Entry -->
      <div class="fantasy-card">
        <div class="card-corner-tl"></div>
        <div class="card-corner-tr"></div>
        <div class="card-corner-bl"></div>
        <div class="card-corner-br"></div>
        
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-amber-300 text-shadow-glow fantasy-title">
          <Zap class="w-5 h-5 text-yellow-400 drop-shadow-glow" />
          Quick Roll Logger
        </h2>
        
        <div class="space-y-3">
          <!-- Character/Enemy Selection -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-amber-400/80 mb-1 font-serif">Character</label>
              <select
                v-model="selectedCharacter"
                @change="selectedEnemy = null"
                class="fantasy-select"
              >
                <option :value="null">Select...</option>
                <option v-for="char in characters" :key="char.id" :value="char.id">
                  {{ char.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-amber-400/80 mb-1 font-serif">Enemy</label>
              <select
                v-model="selectedEnemy"
                @change="selectedCharacter = null"
                class="fantasy-select"
              >
                <option :value="null">Select...</option>
                <option v-for="enemy in enemies" :key="enemy.id" :value="enemy.id">
                  {{ enemy.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Roll Type -->
          <div>
            <label class="block text-xs font-medium text-amber-400/80 mb-1 font-serif">Roll Type</label>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="type in rollTypes"
                :key="type"
                @click="rollType = type"
                class="roll-type-btn"
                :class="{ 'roll-type-active': rollType === type }"
              >
                {{ type }}
              </button>
            </div>
          </div>

          <!-- Roll Value and Modifier -->
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-medium text-amber-400/80 mb-1 font-serif">Roll</label>
              <input
                v-model.number="rollValue"
                type="number"
                class="fantasy-input-small"
                placeholder="d20"
                @keyup.enter="logRoll"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-amber-400/80 mb-1 font-serif">Modifier</label>
              <input
                v-model.number="modifier"
                type="number"
                class="fantasy-input-small"
                placeholder="+0"
                @keyup.enter="logRoll"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-amber-400/80 mb-1 font-serif">Total</label>
              <div class="total-display">
                {{ total }}
              </div>
            </div>
          </div>

          <!-- Target/DC (optional) -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-amber-400/80 mb-1 font-serif">Target/DC (optional)</label>
              <input
                v-model.number="target"
                type="number"
                class="fantasy-input-small"
                placeholder="AC or DC"
                @keyup.enter="logRoll"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-amber-400/80 mb-1 font-serif">Result</label>
              <div class="result-display" :class="resultClass">
                {{ resultText }}
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-xs font-medium text-amber-400/80 mb-1 font-serif">Notes (optional)</label>
            <input
              v-model="logNotes"
              type="text"
              class="fantasy-input-small"
              placeholder="Additional context..."
              @keyup.enter="logRoll"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2 pt-2">
            <button @click="logRoll" class="fantasy-button-primary flex-1">
              Log Roll
            </button>
            <button @click="clearForm" class="fantasy-button-secondary">
              Clear
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Rolls -->
      <div class="fantasy-card">
        <div class="card-corner-tl"></div>
        <div class="card-corner-tr"></div>
        <div class="card-corner-bl"></div>
        <div class="card-corner-br"></div>
        
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-amber-300 text-shadow-glow fantasy-title">
          <Clock class="w-5 h-5 text-blue-400 drop-shadow-glow" />
          Recent Rolls
        </h2>
        <div class="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
          <div
            v-for="log in recentLogs"
            :key="log.timestamp"
            class="roll-log-item"
          >
            <div class="flex items-start justify-between mb-1">
              <div class="font-medium text-sm text-amber-200">
                {{ log.name }}
                <span class="text-amber-500/70 ml-2 font-serif italic">{{ log.rollType }}</span>
              </div>
              <div class="text-xs text-amber-600/70">
                {{ formatTime(log.timestamp) }}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-lg font-bold text-yellow-400 glow-text">{{ log.total }}</span>
              <span class="text-xs text-amber-500/70">({{ log.rollValue }}{{ log.modifier >= 0 ? '+' : ''}}{{ log.modifier }})</span>
              <span 
                v-if="log.target"
                class="ml-auto text-sm font-medium px-2 py-0.5 rounded"
                :class="log.success ? 'success-badge' : 'fail-badge'"
              >
                {{ log.success ? 'Success' : 'Fail' }} (DC {{ log.target }})
              </span>
            </div>
            <div v-if="log.notes" class="text-xs text-amber-500/60 mt-1 italic">
              {{ log.notes }}
            </div>
          </div>
          <div v-if="recentLogs.length === 0" class="text-center text-amber-600/50 py-8 font-serif italic">
            No rolls logged yet
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-4 gap-4 mt-6">
      <div class="stat-card">
        <div class="text-xs text-amber-400/70 mb-1 font-serif">Total Rolls</div>
        <div class="text-2xl font-bold text-amber-200">{{ recentLogs.length }}</div>
      </div>
      <div class="stat-card">
        <div class="text-xs text-amber-400/70 mb-1 font-serif">Success Rate</div>
        <div class="text-2xl font-bold text-green-400 glow-text-green">{{ successRate }}%</div>
      </div>
      <div class="stat-card">
        <div class="text-xs text-amber-400/70 mb-1 font-serif">Avg Roll</div>
        <div class="text-2xl font-bold text-blue-400 glow-text-blue">{{ avgRoll }}</div>
      </div>
      <div class="stat-card">
        <div class="text-xs text-amber-400/70 mb-1 font-serif">Crits</div>
        <div class="text-2xl font-bold text-purple-400 glow-text-purple">{{ critCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Zap, Clock } from 'lucide-vue-next';

const props = defineProps({
  characters: Array,
  enemies: Array,
});

const emit = defineEmits(['add-log']);

const rollTypes = ['Attack', 'Save', 'Check', 'Damage'];

const selectedCharacter = ref(null);
const selectedEnemy = ref(null);
const rollType = ref('Attack');
const rollValue = ref(null);
const modifier = ref(0);
const target = ref(null);
const logNotes = ref('');

const total = computed(() => (rollValue.value || 0) + (modifier.value || 0));

const resultText = computed(() => {
  if (!target.value) return '-';
  return total.value >= target.value ? 'Success!' : 'Fail';
});

const resultClass = computed(() => {
  if (!target.value) return 'text-slate-400';
  return total.value >= target.value ? 'text-green-400' : 'text-red-400';
});

const recentLogs = ref([]);

const successRate = computed(() => {
  const withTargets = recentLogs.value.filter(l => l.target);
  if (withTargets.length === 0) return 0;
  const successes = withTargets.filter(l => l.success).length;
  return Math.round((successes / withTargets.length) * 100);
});

const avgRoll = computed(() => {
  if (recentLogs.value.length === 0) return 0;
  const sum = recentLogs.value.reduce((acc, l) => acc + l.total, 0);
  return Math.round(sum / recentLogs.value.length);
});

const critCount = computed(() => {
  return recentLogs.value.filter(l => l.rollValue === 20 && l.rollType === 'Attack').length;
});

const logRoll = () => {
  if (!rollValue.value || (!selectedCharacter.value && !selectedEnemy.value)) return;

  const entity = selectedCharacter.value 
    ? props.characters.find(c => c.id === selectedCharacter.value)
    : props.enemies.find(e => e.id === selectedEnemy.value);

  const log = {
    name: entity?.name || 'Unknown',
    type: selectedCharacter.value ? 'character' : 'enemy',
    rollType: rollType.value,
    rollValue: rollValue.value,
    modifier: modifier.value || 0,
    total: total.value,
    target: target.value || null,
    success: target.value ? total.value >= target.value : null,
    notes: logNotes.value,
    timestamp: Date.now(),
  };

  recentLogs.value.unshift(log);
  if (recentLogs.value.length > 20) recentLogs.value.pop();
  
  emit('add-log', log);
  
  // Clear form for next roll
  rollValue.value = null;
  logNotes.value = '';
};

const clearForm = () => {
  selectedCharacter.value = null;
  selectedEnemy.value = null;
  rollValue.value = null;
  modifier.value = 0;
  target.value = null;
  logNotes.value = '';
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};
</script>

<style scoped>
/* Fantasy Card */
.fantasy-card {
  background: 
    linear-gradient(135deg, rgba(45, 24, 16, 0.8) 0%, rgba(26, 15, 10, 0.9) 100%);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(251, 191, 36, 0.1);
  position: relative;
  backdrop-filter: blur(10px);
}

.fantasy-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(251, 191, 36, 0.02) 2px, rgba(251, 191, 36, 0.02) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(251, 191, 36, 0.02) 2px, rgba(251, 191, 36, 0.02) 4px);
  border-radius: 12px;
  pointer-events: none;
}

/* Card Corner Decorations */
.card-corner-tl, .card-corner-tr, .card-corner-bl, .card-corner-br {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: rgba(251, 191, 36, 0.4);
  border-style: solid;
  border-width: 0;
}

.card-corner-tl {
  top: -1px;
  left: -1px;
  border-top-width: 2px;
  border-left-width: 2px;
  border-top-left-radius: 12px;
}

.card-corner-tr {
  top: -1px;
  right: -1px;
  border-top-width: 2px;
  border-right-width: 2px;
  border-top-right-radius: 12px;
}

.card-corner-bl {
  bottom: -1px;
  left: -1px;
  border-bottom-width: 2px;
  border-left-width: 2px;
  border-bottom-left-radius: 12px;
}

.card-corner-br {
  bottom: -1px;
  right: -1px;
  border-bottom-width: 2px;
  border-right-width: 2px;
  border-bottom-right-radius: 12px;
}

/* Fantasy Select */
.fantasy-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(180deg, rgba(26, 15, 10, 0.6) 0%, rgba(45, 24, 16, 0.4) 100%);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 6px;
  color: #fef3c7;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.3);
  font-family: Georgia, serif;
}

.fantasy-select:focus {
  outline: none;
  border-color: rgba(251, 191, 36, 0.4);
  box-shadow: 
    inset 0 2px 6px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(251, 191, 36, 0.2);
}

.fantasy-select option {
  background: #2d1810;
  color: #fef3c7;
}

/* Roll Type Buttons */
.roll-type-btn {
  padding: 0.5rem 0.75rem;
  background: linear-gradient(135deg, rgba(120, 53, 15, 0.4) 0%, rgba(76, 29, 4, 0.3) 100%);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 6px;
  color: rgba(251, 191, 36, 0.7);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  font-family: Georgia, serif;
}

.roll-type-btn:hover {
  border-color: rgba(251, 191, 36, 0.4);
  color: rgba(251, 191, 36, 0.9);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.2);
}

.roll-type-active {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(251, 146, 60, 0.2) 100%);
  border-color: rgba(251, 191, 36, 0.6);
  color: #fbbf24;
  box-shadow: 
    0 0 20px rgba(251, 191, 36, 0.3),
    inset 0 1px 0 rgba(251, 191, 36, 0.2);
}

/* Fantasy Small Input */
.fantasy-input-small {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(180deg, rgba(26, 15, 10, 0.6) 0%, rgba(45, 24, 16, 0.4) 100%);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 6px;
  color: #fef3c7;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.3);
  font-family: Georgia, serif;
}

.fantasy-input-small:focus {
  outline: none;
  border-color: rgba(251, 191, 36, 0.4);
  box-shadow: 
    inset 0 2px 6px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(251, 191, 36, 0.2);
}

.fantasy-input-small::placeholder {
  color: rgba(251, 191, 36, 0.3);
  font-style: italic;
}

/* Total Display */
.total-display {
  padding: 0.5rem 0.75rem;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 700;
  color: #4ade80;
  text-align: center;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.3);
  font-family: Georgia, serif;
}

/* Result Display */
.result-display {
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.3);
  font-family: Georgia, serif;
}

.result-success {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
  border-color: rgba(74, 222, 128, 0.3);
  color: #4ade80;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
}

.result-fail {
  background: linear-gradient(135deg, rgba(248, 113, 113, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%);
  border-color: rgba(248, 113, 113, 0.3);
  color: #f87171;
  text-shadow: 0 0 10px rgba(248, 113, 113, 0.5);
}

/* Fantasy Buttons */
.fantasy-button-primary {
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(251, 146, 60, 0.2) 100%);
  border: 1px solid rgba(251, 191, 36, 0.4);
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  color: #fbbf24;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(251, 191, 36, 0.2);
  font-family: Georgia, serif;
}

.fantasy-button-primary:hover {
  border-color: rgba(251, 191, 36, 0.6);
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(251, 191, 36, 0.3),
    0 0 30px rgba(251, 191, 36, 0.3);
  transform: translateY(-1px);
}

.fantasy-button-secondary {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(120, 53, 15, 0.4) 0%, rgba(76, 29, 4, 0.3) 100%);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  color: rgba(251, 191, 36, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-family: Georgia, serif;
}

.fantasy-button-secondary:hover {
  border-color: rgba(251, 191, 36, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transform: translateY(-1px);
}

/* Roll Log Item */
.roll-log-item {
  background: linear-gradient(135deg, rgba(45, 24, 16, 0.5) 0%, rgba(26, 15, 10, 0.6) 100%);
  border: 1px solid rgba(251, 191, 36, 0.15);
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.roll-log-item:hover {
  border-color: rgba(251, 191, 36, 0.3);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.1);
}

/* Badges */
.success-badge {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
  border: 1px solid rgba(74, 222, 128, 0.3);
  color: #4ade80;
  text-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
}

.fail-badge {
  background: linear-gradient(135deg, rgba(248, 113, 113, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%);
  border: 1px solid rgba(248, 113, 113, 0.3);
  color: #f87171;
  text-shadow: 0 0 8px rgba(248, 113, 113, 0.5);
}

/* Stat Card */
.stat-card {
  background: linear-gradient(135deg, rgba(45, 24, 16, 0.6) 0%, rgba(26, 15, 10, 0.7) 100%);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: rgba(251, 191, 36, 0.4);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(251, 191, 36, 0.1);
  transform: translateY(-2px);
}

/* Glow Text Effects */
.glow-text {
  text-shadow: 0 0 15px rgba(250, 204, 21, 0.7), 0 0 25px rgba(250, 204, 21, 0.4);
}

.glow-text-green {
  text-shadow: 0 0 15px rgba(74, 222, 128, 0.7), 0 0 25px rgba(74, 222, 128, 0.4);
}

.glow-text-blue {
  text-shadow: 0 0 15px rgba(96, 165, 250, 0.7), 0 0 25px rgba(96, 165, 250, 0.4);
}

.glow-text-purple {
  text-shadow: 0 0 15px rgba(192, 132, 252, 0.7), 0 0 25px rgba(192, 132, 252, 0.4);
}

/* Text Effects */
.text-shadow-glow {
  text-shadow: 
    0 0 20px rgba(251, 191, 36, 0.5),
    0 0 40px rgba(251, 191, 36, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.8);
}

.drop-shadow-glow {
  filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.6)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
}

.fantasy-title {
  font-family: 'Cinzel', Georgia, serif;
  letter-spacing: 0.05em;
}

/* Custom Scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  width: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: rgba(26, 15, 10, 0.5);
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(251, 191, 36, 0.3) 0%, rgba(120, 53, 15, 0.3) 100%);
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(251, 191, 36, 0.5) 0%, rgba(120, 53, 15, 0.5) 100%);
}

@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
</style>