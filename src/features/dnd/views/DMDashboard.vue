<template>
  <div class="h-screen fantasy-bg text-amber-50 flex flex-col overflow-hidden">
    <!-- Decorative Corner Ornaments -->
    <div class="corner-ornament top-left"></div>
    <div class="corner-ornament top-right"></div>
    <div class="corner-ornament bottom-left"></div>
    <div class="corner-ornament bottom-right"></div>

    <!-- Header -->
    <div class="header-gradient border-b border-amber-900/30 px-6 py-4 flex items-center justify-between backdrop-blur-sm relative">
      <div class="absolute inset-0 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-amber-950/40"></div>
      <div class="flex items-center gap-4 relative z-10">
        <div class="icon-glow">
          <Swords class="w-10 h-10 text-amber-400 drop-shadow-glow" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-shadow-glow fantasy-title bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
            Dungeon Master's Tome
          </h1>
          <p class="text-sm text-amber-400/80 font-serif italic">{{ campaignName || 'Chronicle Untitled' }}</p>
        </div>
      </div>
      <button 
        @click="showCampaignSettings = true"
        class="fantasy-button relative z-10"
      >
        <Settings class="w-4 h-4" />
        Settings
      </button>
    </div>

    <!-- Tab Navigation -->
    <div class="tab-bar border-b border-amber-900/30 px-6 backdrop-blur-sm">
      <div class="flex gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="tab-button"
          :class="{ 'tab-active': activeTab === tab.id }"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
          <span 
            v-if="activeTab === tab.id"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent glow-line"
          />
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 overflow-auto scrollbar-custom">
      <QuickRoller 
        v-if="activeTab === 'quick'" 
        :characters="characters"
        :enemies="allEnemies"
        @add-log="addRollLog"
      />
      <CharacterManager 
        v-else-if="activeTab === 'characters'" 
        v-model:characters="characters"
      />
      <EnemyBuilder 
        v-else-if="activeTab === 'encounters'" 
        v-model:encounters="encounters"
        @get-all-enemies="getAllEnemies"
      />
      <NPCTracker 
        v-else-if="activeTab === 'npcs'" 
        v-model:npcs="npcs"
      />
      <NotesManager 
        v-else-if="activeTab === 'notes'" 
        v-model:notes="notes"
      />
      <RollHistory 
        v-else-if="activeTab === 'history'" 
        :logs="rollLogs"
        @clear="rollLogs = []"
      />
    </div>

    <!-- Campaign Settings Modal -->
    <div 
      v-if="showCampaignSettings"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="showCampaignSettings = false"
    >
      <div class="fantasy-modal">
        <div class="modal-ornament-top"></div>
        <h2 class="text-2xl font-bold mb-6 text-amber-300 text-shadow-glow fantasy-title">Campaign Settings</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2 text-amber-400/90 font-serif">Campaign Chronicle</label>
            <input
              v-model="campaignName"
              type="text"
              class="fantasy-input"
              placeholder="Enter thy campaign's name..."
            />
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="showCampaignSettings = false"
              class="fantasy-button"
            >
              Close
            </button>
          </div>
        </div>
        <div class="modal-ornament-bottom"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { Swords, Settings, Zap, Users, Skull, UserCircle, FileText, Clock } from 'lucide-vue-next';
import QuickRoller from '@/features/dnd/components/QuickRoller.vue';
import CharacterManager from '@/features/dnd/components/CharacterManager.vue';
import EnemyBuilder from '@/features/dnd/components/EnemyBuilder.vue';
import NPCTracker from '@/features/dnd/components/NPCTracker.vue';
import NotesManager from '@/features/dnd/components/NotesManager.vue';
import RollHistory from '@/features/dnd/components/RollHistory.vue';

const activeTab = ref('quick');
const campaignName = ref('');
const showCampaignSettings = ref(false);

const tabs = [
  { id: 'quick', label: 'Quick Roller', icon: Zap },
  { id: 'encounters', label: 'Encounters', icon: Skull },
  { id: 'characters', label: 'Characters', icon: Users },
  { id: 'npcs', label: 'NPCs', icon: UserCircle },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'history', label: 'History', icon: Clock },
];

// Data stores
const characters = ref([]);
const encounters = ref([]);
const npcs = ref([]);
const notes = ref([]);
const rollLogs = ref([]);

const allEnemies = computed(() => {
  return encounters.value.flatMap(e => e.enemies || []);
});

const getAllEnemies = () => allEnemies.value;

const addRollLog = (log) => {
  rollLogs.value.unshift({
    ...log,
    timestamp: new Date().toISOString(),
    id: Date.now()
  });
  saveData();
};

// Load data from localStorage
const loadData = () => {
  const saved = localStorage.getItem('dm-dashboard-data');
  if (saved) {
    const data = JSON.parse(saved);
    campaignName.value = data.campaignName || '';
    characters.value = data.characters || [];
    encounters.value = data.encounters || [];
    npcs.value = data.npcs || [];
    notes.value = data.notes || [];
    rollLogs.value = data.rollLogs || [];
  }
};

// Save data to localStorage
const saveData = () => {
  const data = {
    campaignName: campaignName.value,
    characters: characters.value,
    encounters: encounters.value,
    npcs: npcs.value,
    notes: notes.value,
    rollLogs: rollLogs.value,
  };
  localStorage.setItem('dm-dashboard-data', JSON.stringify(data));
};

// Watch for changes and auto-save
watch([campaignName, characters, encounters, npcs, notes, rollLogs], saveData, { deep: true });

onMounted(loadData);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
/* Fantasy Background */
.fantasy-bg {
  background: 
    radial-gradient(ellipse at top, rgba(120, 53, 15, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at bottom, rgba(76, 29, 4, 0.4) 0%, transparent 50%),
    linear-gradient(180deg, #1a0f0a 0%, #2d1810 50%, #1a0f0a 100%);
  position: relative;
}

.fantasy-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(120, 53, 15, 0.03) 2px, rgba(120, 53, 15, 0.03) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(120, 53, 15, 0.03) 2px, rgba(120, 53, 15, 0.03) 4px);
  pointer-events: none;
  opacity: 0.5;
}

/* Corner Ornaments */
.corner-ornament {
  position: fixed;
  width: 120px;
  height: 120px;
  pointer-events: none;
  z-index: 1;
  opacity: 0.4;
}

.corner-ornament::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(251, 191, 36, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(20px);
}

.top-left {
  top: 0;
  left: 0;
  border-top: 3px solid rgba(251, 191, 36, 0.3);
  border-left: 3px solid rgba(251, 191, 36, 0.3);
  border-top-left-radius: 24px;
}

.top-right {
  top: 0;
  right: 0;
  border-top: 3px solid rgba(251, 191, 36, 0.3);
  border-right: 3px solid rgba(251, 191, 36, 0.3);
  border-top-right-radius: 24px;
}

.bottom-left {
  bottom: 0;
  left: 0;
  border-bottom: 3px solid rgba(251, 191, 36, 0.3);
  border-left: 3px solid rgba(251, 191, 36, 0.3);
  border-bottom-left-radius: 24px;
}

.bottom-right {
  bottom: 0;
  right: 0;
  border-bottom: 3px solid rgba(251, 191, 36, 0.3);
  border-right: 3px solid rgba(251, 191, 36, 0.3);
  border-bottom-right-radius: 24px;
}

/* Header Gradient */
.header-gradient {
  background: linear-gradient(180deg, rgba(45, 24, 16, 0.95) 0%, rgba(26, 15, 10, 0.9) 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(251, 191, 36, 0.1);
}

/* Tab Bar */
.tab-bar {
  background: linear-gradient(180deg, rgba(26, 15, 10, 0.9) 0%, rgba(45, 24, 16, 0.8) 100%);
}

/* Tab Buttons */
.tab-button {
  padding: 0.75rem 1.5rem;
  font-medium: 500;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(251, 191, 36, 0.5);
  border-radius: 8px 8px 0 0;
  font-family: Georgia, serif;
}

.tab-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(251, 191, 36, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 8px 8px 0 0;
}

.tab-button:hover::before {
  opacity: 1;
}

.tab-button:hover {
  color: rgba(251, 191, 36, 0.8);
}

.tab-active {
  color: #fbbf24 !important;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
  background: linear-gradient(180deg, rgba(251, 191, 36, 0.1) 0%, transparent 100%);
}

.glow-line {
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.8), 0 0 20px rgba(251, 191, 36, 0.4);
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Fantasy Button */
.fantasy-button {
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, rgba(120, 53, 15, 0.6) 0%, rgba(76, 29, 4, 0.4) 100%);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 8px;
  font-medium: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fbbf24;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow: 
    0 2px 10px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(251, 191, 36, 0.1),
    0 0 20px rgba(251, 191, 36, 0.0);
  position: relative;
  overflow: hidden;
  font-family: Georgia, serif;
}

.fantasy-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(251, 191, 36, 0.2) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fantasy-button:hover {
  border-color: rgba(251, 191, 36, 0.6);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(251, 191, 36, 0.2),
    0 0 30px rgba(251, 191, 36, 0.3);
  transform: translateY(-1px);
}

.fantasy-button:hover::before {
  opacity: 1;
}

.fantasy-button:active {
  transform: translateY(0);
}

/* Fantasy Input */
.fantasy-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(180deg, rgba(26, 15, 10, 0.6) 0%, rgba(45, 24, 16, 0.4) 100%);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 8px;
  color: #fef3c7;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
  font-family: Georgia, serif;
}

.fantasy-input:focus {
  outline: none;
  border-color: rgba(251, 191, 36, 0.5);
  box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(251, 191, 36, 0.2);
}

.fantasy-input::placeholder {
  color: rgba(251, 191, 36, 0.3);
  font-style: italic;
}

/* Fantasy Modal */
.fantasy-modal {
  background: 
    linear-gradient(135deg, rgba(45, 24, 16, 0.95) 0%, rgba(26, 15, 10, 0.95) 100%);
  border: 2px solid rgba(251, 191, 36, 0.3);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 28rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(251, 191, 36, 0.1),
    0 0 60px rgba(251, 191, 36, 0.2);
  position: relative;
  backdrop-filter: blur(10px);
}

.modal-ornament-top,
.modal-ornament-bottom {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.6) 50%, transparent 100%);
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
}

.modal-ornament-top {
  top: 0;
}

.modal-ornament-bottom {
  bottom: 0;
}

.modal-ornament-top::before,
.modal-ornament-bottom::before {
  content: '◆';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #fbbf24;
  font-size: 0.875rem;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.8);
}

/* Icon Glow */
.icon-glow {
  filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.5));
  animation: pulse-glow 3s ease-in-out infinite;
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
.scrollbar-custom::-webkit-scrollbar {
  width: 12px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: rgba(26, 15, 10, 0.5);
  border-left: 1px solid rgba(251, 191, 36, 0.1);
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(251, 191, 36, 0.3) 0%, rgba(120, 53, 15, 0.3) 100%);
  border-radius: 6px;
  border: 2px solid rgba(26, 15, 10, 0.5);
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(251, 191, 36, 0.5) 0%, rgba(120, 53, 15, 0.5) 100%);
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
}

/* Animations */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.4));
  }
  50% {
    opacity: 0.9;
    filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.6));
  }
}
</style>