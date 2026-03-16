<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold flex items-center gap-2">
        <Skull class="w-6 h-6 text-red-400" />
        Encounter Builder
      </h2>
      <button
        @click="addEncounter"
        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        New Encounter
      </button>
    </div>

    <!-- Encounters List -->
    <div class="space-y-4">
      <div
        v-for="encounter in encounters"
        :key="encounter.id"
        class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden"
      >
        <!-- Encounter Header -->
        <div class="p-4 border-b border-slate-700">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex items-center gap-4">
              <input
                v-model="encounter.name"
                class="bg-transparent text-xl font-bold focus:outline-none focus:bg-slate-900 px-2 py-1 rounded flex-1"
                placeholder="Encounter Name"
              />
              <div class="flex items-center gap-2">
                <button
                  @click="encounter.active = !encounter.active"
                  class="px-3 py-1 rounded text-sm font-medium transition-colors"
                  :class="encounter.active 
                    ? 'bg-green-600 text-white' 
                    : 'bg-slate-700 text-slate-300'"
                >
                  {{ encounter.active ? 'Active' : 'Inactive' }}
                </button>
                <button
                  @click="toggleEncounter(encounter.id)"
                  class="p-2 hover:bg-slate-700 rounded transition-colors"
                >
                  <ChevronDown 
                    class="w-5 h-5 transition-transform"
                    :class="encounter.expanded ? 'rotate-180' : ''"
                  />
                </button>
                <button
                  @click="removeEncounter(encounter.id)"
                  class="p-2 hover:bg-slate-700 rounded transition-colors text-red-400"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-4 mt-2 text-sm text-slate-400">
            <span>{{ encounter.enemies?.length || 0 }} enemies</span>
            <span>Total CR: {{ calculateTotalCR(encounter) }}</span>
          </div>
        </div>

        <!-- Encounter Content -->
        <div v-if="encounter.expanded" class="p-4">
          <!-- Enemies Grid -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div
              v-for="enemy in encounter.enemies"
              :key="enemy.id"
              class="bg-slate-900 rounded-lg border border-slate-700 p-3"
            >
              <!-- Enemy Header -->
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <input
                    v-model="enemy.name"
                    class="w-full bg-transparent font-bold focus:outline-none focus:bg-slate-800 px-2 py-1 rounded"
                    placeholder="Enemy Name"
                  />
                  <div class="flex gap-2 mt-1">
                    <input
                      v-model="enemy.type"
                      class="flex-1 bg-transparent text-sm text-slate-400 focus:outline-none focus:bg-slate-800 px-2 py-1 rounded"
                      placeholder="Type"
                    />
                    <input
                      v-model="enemy.cr"
                      class="w-16 bg-transparent text-sm text-slate-400 focus:outline-none focus:bg-slate-800 px-2 py-1 rounded"
                      placeholder="CR"
                    />
                  </div>
                </div>
                <button
                  @click="removeEnemy(encounter, enemy.id)"
                  class="text-slate-500 hover:text-red-400 transition-colors"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-4 gap-2 mb-2">
                <div class="bg-slate-800 rounded p-2">
                  <div class="text-xs text-slate-400">HP</div>
                  <input
                    v-model.number="enemy.currentHP"
                    type="number"
                    class="w-full bg-transparent font-bold focus:outline-none"
                    placeholder="0"
                  />
                  <div class="text-xs text-slate-500">/ {{ enemy.maxHP || 0 }}</div>
                </div>
                <div class="bg-slate-800 rounded p-2">
                  <div class="text-xs text-slate-400">AC</div>
                  <input
                    v-model.number="enemy.ac"
                    type="number"
                    class="w-full bg-transparent font-bold focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div class="bg-slate-800 rounded p-2">
                  <div class="text-xs text-slate-400">Init</div>
                  <input
                    v-model.number="enemy.initiative"
                    type="number"
                    class="w-full bg-transparent font-bold focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div class="bg-slate-800 rounded p-2">
                  <div class="text-xs text-slate-400">Max HP</div>
                  <input
                    v-model.number="enemy.maxHP"
                    type="number"
                    class="w-full bg-transparent font-bold focus:outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <!-- Attacks -->
              <div class="mb-2">
                <div class="text-xs text-slate-400 mb-1">Attacks</div>
                <div class="space-y-1">
                  <div
                    v-for="(attack, idx) in enemy.attacks"
                    :key="idx"
                    class="flex items-center gap-2"
                  >
                    <input
                      v-model="attack.name"
                      class="flex-1 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs focus:outline-none focus:border-purple-400"
                      placeholder="Attack name"
                    />
                    <input
                      v-model="attack.bonus"
                      class="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs focus:outline-none focus:border-purple-400"
                      placeholder="+0"
                    />
                    <input
                      v-model="attack.damage"
                      class="w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs focus:outline-none focus:border-purple-400"
                      placeholder="1d6+2"
                    />
                    <button
                      @click="enemy.attacks.splice(idx, 1)"
                      class="text-slate-500 hover:text-red-400"
                    >
                      <X class="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    @click="addAttack(enemy)"
                    class="w-full px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs transition-colors"
                  >
                    + Add Attack
                  </button>
                </div>
              </div>

              <!-- Status -->
              <div class="flex items-center gap-1">
                <div
                  class="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden"
                >
                  <div
                    class="h-full transition-all"
                    :class="getHealthColor(enemy)"
                    :style="{ width: getHealthPercent(enemy) + '%' }"
                  />
                </div>
                <div
                  v-if="enemy.currentHP === 0"
                  class="text-xs text-red-400 font-medium"
                >
                  DEAD
                </div>
              </div>
            </div>
          </div>

          <!-- Add Enemy Button -->
          <button
            @click="addEnemy(encounter)"
            class="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus class="w-4 h-4" />
            Add Enemy
          </button>

          <!-- Encounter Notes -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-slate-400 mb-2">Encounter Notes</label>
            <textarea
              v-model="encounter.notes"
              class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-purple-400 resize-none"
              rows="3"
              placeholder="Terrain, tactics, special conditions..."
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="encounters.length === 0"
        class="bg-slate-800 rounded-lg border border-slate-700 border-dashed p-12 text-center"
      >
        <Skull class="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p class="text-slate-400 mb-4">No encounters yet</p>
        <button
          @click="addEncounter"
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
        >
          Create Your First Encounter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Skull, Plus, Trash2, X, ChevronDown } from 'lucide-vue-next';

const props = defineProps({
  encounters: Array,
});

const emit = defineEmits(['update:encounters', 'get-all-enemies']);

const addEncounter = () => {
  const newEncounter = {
    id: Date.now(),
    name: '',
    active: false,
    expanded: true,
    enemies: [],
    notes: '',
  };
  emit('update:encounters', [...props.encounters, newEncounter]);
};

const removeEncounter = (id) => {
  emit('update:encounters', props.encounters.filter(e => e.id !== id));
};

const toggleEncounter = (id) => {
  const encounter = props.encounters.find(e => e.id === id);
  if (encounter) {
    encounter.expanded = !encounter.expanded;
  }
};

const addEnemy = (encounter) => {
  if (!encounter.enemies) encounter.enemies = [];
  const newEnemy = {
    id: Date.now(),
    name: '',
    type: '',
    cr: '',
    currentHP: 0,
    maxHP: 0,
    ac: 10,
    initiative: 0,
    attacks: [],
  };
  encounter.enemies.push(newEnemy);
};

const removeEnemy = (encounter, enemyId) => {
  encounter.enemies = encounter.enemies.filter(e => e.id !== enemyId);
};

const addAttack = (enemy) => {
  if (!enemy.attacks) enemy.attacks = [];
  enemy.attacks.push({ name: '', bonus: '', damage: '' });
};

const calculateTotalCR = (encounter) => {
  if (!encounter.enemies) return 0;
  return encounter.enemies.reduce((sum, e) => {
    const cr = parseFloat(e.cr) || 0;
    return sum + cr;
  }, 0).toFixed(1);
};

const getHealthPercent = (enemy) => {
  if (!enemy.maxHP) return 0;
  return Math.max(0, Math.min(100, (enemy.currentHP / enemy.maxHP) * 100));
};

const getHealthColor = (enemy) => {
  const percent = getHealthPercent(enemy);
  if (percent > 50) return 'bg-green-500';
  if (percent > 25) return 'bg-yellow-500';
  if (percent > 0) return 'bg-red-500';
  return 'bg-slate-700';
};
</script>