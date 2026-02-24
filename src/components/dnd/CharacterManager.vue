<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold flex items-center gap-2">
        <Users class="w-6 h-6 text-blue-400" />
        Player Characters
      </h2>
      <button
        @click="addCharacter"
        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        Add Character
      </button>
    </div>

    <!-- Character Cards -->
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="character in characters"
        :key="character.id"
        class="bg-slate-800 rounded-lg border border-slate-700 p-4 hover:border-slate-600 transition-colors"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <input
              v-model="character.name"
              class="w-full bg-transparent text-lg font-bold focus:outline-none focus:bg-slate-900 px-2 py-1 rounded"
              placeholder="Character Name"
            />
            <input
              v-model="character.class"
              class="w-full bg-transparent text-sm text-slate-400 focus:outline-none focus:bg-slate-900 px-2 py-1 rounded mt-1"
              placeholder="Class & Level"
            />
          </div>
          <button
            @click="removeCharacter(character.id)"
            class="text-slate-500 hover:text-red-400 transition-colors"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-2 mb-3">
          <div class="bg-slate-900 rounded p-2">
            <div class="text-xs text-slate-400">HP</div>
            <input
              v-model.number="character.currentHP"
              type="number"
              class="w-full bg-transparent text-lg font-bold focus:outline-none"
              placeholder="0"
            />
            <div class="text-xs text-slate-500">/ {{ character.maxHP || 0 }}</div>
          </div>
          <div class="bg-slate-900 rounded p-2">
            <div class="text-xs text-slate-400">AC</div>
            <input
              v-model.number="character.ac"
              type="number"
              class="w-full bg-transparent text-lg font-bold focus:outline-none"
              placeholder="0"
            />
          </div>
          <div class="bg-slate-900 rounded p-2">
            <div class="text-xs text-slate-400">Initiative</div>
            <input
              v-model.number="character.initiative"
              type="number"
              class="w-full bg-transparent text-lg font-bold focus:outline-none"
              placeholder="0"
            />
          </div>
        </div>

        <!-- Max HP -->
        <div class="mb-3">
          <label class="block text-xs text-slate-400 mb-1">Max HP</label>
          <input
            v-model.number="character.maxHP"
            type="number"
            class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm focus:outline-none focus:border-purple-400"
            placeholder="Max HP"
          />
        </div>

        <!-- Conditions/Status -->
        <div class="mb-3">
          <label class="block text-xs text-slate-400 mb-1">Conditions</label>
          <div class="flex flex-wrap gap-1 mb-2">
            <span
              v-for="(condition, idx) in character.conditions"
              :key="idx"
              class="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded flex items-center gap-1"
            >
              {{ condition }}
              <button
                @click="character.conditions.splice(idx, 1)"
                class="hover:text-red-300"
              >
                <X class="w-3 h-3" />
              </button>
            </span>
          </div>
          <input
            v-model="character.newCondition"
            @keyup.enter="addCondition(character)"
            class="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs focus:outline-none focus:border-purple-400"
            placeholder="Add condition (Enter)"
          />
        </div>

        <!-- Player Notes -->
        <div>
          <label class="block text-xs text-slate-400 mb-1">Player Notes</label>
          <textarea
            v-model="character.notes"
            class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm focus:outline-none focus:border-purple-400 resize-none"
            rows="2"
            placeholder="Quick notes..."
          />
        </div>

        <!-- HP Bar -->
        <div class="mt-3">
          <div class="h-2 bg-slate-900 rounded-full overflow-hidden">
            <div
              class="h-full transition-all"
              :class="getHealthColor(character)"
              :style="{ width: getHealthPercent(character) + '%' }"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="characters.length === 0"
        class="col-span-3 bg-slate-800 rounded-lg border border-slate-700 border-dashed p-12 text-center"
      >
        <Users class="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p class="text-slate-400 mb-4">No characters yet</p>
        <button
          @click="addCharacter"
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
        >
          Add Your First Character
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Users, Plus, Trash2, X } from 'lucide-vue-next';

const props = defineProps({
  characters: Array,
});

const emit = defineEmits(['update:characters']);

const addCharacter = () => {
  const newChar = {
    id: Date.now(),
    name: '',
    class: '',
    currentHP: 0,
    maxHP: 0,
    ac: 10,
    initiative: 0,
    conditions: [],
    notes: '',
    newCondition: '',
  };
  emit('update:characters', [...props.characters, newChar]);
};

const removeCharacter = (id) => {
  emit('update:characters', props.characters.filter(c => c.id !== id));
};

const addCondition = (character) => {
  if (character.newCondition.trim()) {
    character.conditions.push(character.newCondition.trim());
    character.newCondition = '';
  }
};

const getHealthPercent = (character) => {
  if (!character.maxHP) return 0;
  return Math.max(0, Math.min(100, (character.currentHP / character.maxHP) * 100));
};

const getHealthColor = (character) => {
  const percent = getHealthPercent(character);
  if (percent > 50) return 'bg-green-500';
  if (percent > 25) return 'bg-yellow-500';
  return 'bg-red-500';
};
</script>