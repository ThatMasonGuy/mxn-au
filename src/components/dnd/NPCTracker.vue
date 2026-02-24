<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold flex items-center gap-2">
        <UserCircle class="w-6 h-6 text-green-400" />
        NPCs & Relationships
      </h2>
      <button
        @click="addNPC"
        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        Add NPC
      </button>
    </div>

    <!-- NPCs Grid -->
    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="npc in npcs"
        :key="npc.id"
        class="bg-slate-800 rounded-lg border border-slate-700 p-4"
      >
        <!-- NPC Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <input
              v-model="npc.name"
              class="w-full bg-transparent text-lg font-bold focus:outline-none focus:bg-slate-900 px-2 py-1 rounded"
              placeholder="NPC Name"
            />
            <div class="flex gap-2 mt-1">
              <input
                v-model="npc.role"
                class="flex-1 bg-transparent text-sm text-slate-400 focus:outline-none focus:bg-slate-900 px-2 py-1 rounded"
                placeholder="Role/Occupation"
              />
              <select
                v-model="npc.disposition"
                class="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs focus:outline-none focus:border-purple-400"
              >
                <option value="friendly">Friendly</option>
                <option value="neutral">Neutral</option>
                <option value="hostile">Hostile</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>
          <button
            @click="removeNPC(npc.id)"
            class="text-slate-500 hover:text-red-400 transition-colors"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <!-- Disposition Badge -->
        <div class="mb-3">
          <span
            class="inline-block px-2 py-1 rounded text-xs font-medium"
            :class="getDispositionClass(npc.disposition)"
          >
            {{ npc.disposition || 'Unknown' }}
          </span>
        </div>

        <!-- Location -->
        <div class="mb-3">
          <label class="block text-xs text-slate-400 mb-1">Location</label>
          <input
            v-model="npc.location"
            class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm focus:outline-none focus:border-purple-400"
            placeholder="Where can they be found?"
          />
        </div>

        <!-- Description -->
        <div class="mb-3">
          <label class="block text-xs text-slate-400 mb-1">Description</label>
          <textarea
            v-model="npc.description"
            class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm focus:outline-none focus:border-purple-400 resize-none"
            rows="2"
            placeholder="Physical appearance, personality..."
          />
        </div>

        <!-- Goals/Motivations -->
        <div class="mb-3">
          <label class="block text-xs text-slate-400 mb-1">Goals/Motivations</label>
          <textarea
            v-model="npc.goals"
            class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm focus:outline-none focus:border-purple-400 resize-none"
            rows="2"
            placeholder="What do they want?"
          />
        </div>

        <!-- Relationships with Players -->
        <div class="mb-3">
          <label class="block text-xs text-slate-400 mb-1">Player Relationships</label>
          <div class="space-y-1">
            <div
              v-for="(rel, idx) in npc.relationships"
              :key="idx"
              class="flex items-center gap-2"
            >
              <input
                v-model="rel.player"
                class="flex-1 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs focus:outline-none focus:border-purple-400"
                placeholder="Player name"
              />
              <input
                v-model="rel.relationship"
                class="flex-1 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs focus:outline-none focus:border-purple-400"
                placeholder="Relationship"
              />
              <button
                @click="npc.relationships.splice(idx, 1)"
                class="text-slate-500 hover:text-red-400"
              >
                <X class="w-3 h-3" />
              </button>
            </div>
            <button
              @click="addRelationship(npc)"
              class="w-full px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-xs transition-colors"
            >
              + Add Relationship
            </button>
          </div>
        </div>

        <!-- Quest/Plot Hooks -->
        <div class="mb-3">
          <label class="block text-xs text-slate-400 mb-1">Quest Hooks</label>
          <div class="space-y-1">
            <div
              v-for="(hook, idx) in npc.quests"
              :key="idx"
              class="flex items-center gap-2 bg-slate-900 rounded p-2"
            >
              <input
                type="checkbox"
                v-model="hook.completed"
                class="rounded bg-slate-800 border-slate-600 text-purple-600 focus:ring-purple-500"
              />
              <input
                v-model="hook.description"
                class="flex-1 bg-transparent text-xs focus:outline-none"
                :class="hook.completed ? 'line-through text-slate-500' : ''"
                placeholder="Quest or plot hook"
              />
              <button
                @click="npc.quests.splice(idx, 1)"
                class="text-slate-500 hover:text-red-400"
              >
                <X class="w-3 h-3" />
              </button>
            </div>
            <button
              @click="addQuest(npc)"
              class="w-full px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-xs transition-colors"
            >
              + Add Quest Hook
            </button>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-xs text-slate-400 mb-1">Notes</label>
          <textarea
            v-model="npc.notes"
            class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm focus:outline-none focus:border-purple-400 resize-none"
            rows="2"
            placeholder="Additional notes, secrets, etc..."
          />
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="npcs.length === 0"
        class="col-span-2 bg-slate-800 rounded-lg border border-slate-700 border-dashed p-12 text-center"
      >
        <UserCircle class="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p class="text-slate-400 mb-4">No NPCs yet</p>
        <button
          @click="addNPC"
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
        >
          Add Your First NPC
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UserCircle, Plus, Trash2, X } from 'lucide-vue-next';

const props = defineProps({
  npcs: Array,
});

const emit = defineEmits(['update:npcs']);

const addNPC = () => {
  const newNPC = {
    id: Date.now(),
    name: '',
    role: '',
    disposition: 'neutral',
    location: '',
    description: '',
    goals: '',
    relationships: [],
    quests: [],
    notes: '',
  };
  emit('update:npcs', [...props.npcs, newNPC]);
};

const removeNPC = (id) => {
  emit('update:npcs', props.npcs.filter(n => n.id !== id));
};

const addRelationship = (npc) => {
  if (!npc.relationships) npc.relationships = [];
  npc.relationships.push({ player: '', relationship: '' });
};

const addQuest = (npc) => {
  if (!npc.quests) npc.quests = [];
  npc.quests.push({ description: '', completed: false });
};

const getDispositionClass = (disposition) => {
  const classes = {
    friendly: 'bg-green-900/30 text-green-400',
    neutral: 'bg-blue-900/30 text-blue-400',
    hostile: 'bg-red-900/30 text-red-400',
    unknown: 'bg-slate-700 text-slate-400',
  };
  return classes[disposition] || classes.unknown;
};
</script>