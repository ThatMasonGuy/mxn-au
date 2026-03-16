<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold flex items-center gap-2">
        <FileText class="w-6 h-6 text-yellow-400" />
        Campaign Notes
      </h2>
      <button
        @click="addNote"
        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        New Note
      </button>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <!-- Sidebar - Note List -->
      <div class="bg-slate-800 rounded-lg border border-slate-700 p-4 h-[calc(100vh-200px)] overflow-y-auto">
        <div class="space-y-2">
          <button
            v-for="note in notes"
            :key="note.id"
            @click="selectedNote = note.id"
            class="w-full text-left px-3 py-2 rounded transition-colors"
            :class="selectedNote === note.id 
              ? 'bg-purple-600 text-white' 
              : 'bg-slate-900 hover:bg-slate-700 text-slate-300'"
          >
            <div class="font-medium truncate">{{ note.title || 'Untitled Note' }}</div>
            <div class="text-xs opacity-75 mt-1">
              {{ formatDate(note.updatedAt) }}
            </div>
          </button>
          
          <div v-if="notes.length === 0" class="text-center text-slate-500 py-8">
            No notes yet
          </div>
        </div>
      </div>

      <!-- Main Editor -->
      <div class="col-span-2 bg-slate-800 rounded-lg border border-slate-700 p-6 h-[calc(100vh-200px)] flex flex-col">
        <div v-if="currentNote">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <input
              v-model="currentNote.title"
              class="flex-1 bg-transparent text-2xl font-bold focus:outline-none focus:bg-slate-900 px-2 py-1 rounded"
              placeholder="Note Title"
              @input="updateNote"
            />
            <div class="flex items-center gap-2">
              <select
                v-model="currentNote.category"
                @change="updateNote"
                class="px-3 py-1 bg-slate-900 border border-slate-700 rounded text-sm focus:outline-none focus:border-purple-400"
              >
                <option value="">No Category</option>
                <option value="world">World Building</option>
                <option value="plot">Plot</option>
                <option value="lore">Lore</option>
                <option value="session">Session Notes</option>
                <option value="ideas">Ideas</option>
              </select>
              <button
                @click="pinNote(currentNote)"
                class="p-2 rounded transition-colors"
                :class="currentNote.pinned 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'"
              >
                <Pin class="w-4 h-4" />
              </button>
              <button
                @click="deleteNote(currentNote.id)"
                class="p-2 bg-slate-700 hover:bg-red-600 rounded transition-colors text-red-400 hover:text-white"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Category Badge -->
          <div v-if="currentNote.category" class="mb-4">
            <span
              class="inline-block px-2 py-1 rounded text-xs font-medium"
              :class="getCategoryClass(currentNote.category)"
            >
              {{ currentNote.category }}
            </span>
          </div>

          <!-- Content Editor -->
          <div class="flex-1 overflow-hidden">
            <textarea
              v-model="currentNote.content"
              @input="updateNote"
              class="w-full h-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-purple-400 resize-none font-mono"
              placeholder="Start typing your notes..."
            />
          </div>

          <!-- Footer -->
          <div class="mt-4 flex items-center justify-between text-xs text-slate-400">
            <div>
              Last updated: {{ formatDateTime(currentNote.updatedAt) }}
            </div>
            <div>
              {{ wordCount(currentNote.content) }} words
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex-1 flex items-center justify-center">
          <div class="text-center text-slate-500">
            <FileText class="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p class="mb-4">Select a note or create a new one</p>
            <button
              @click="addNote"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              Create Note
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { FileText, Plus, Trash2, Pin } from 'lucide-vue-next';

const props = defineProps({
  notes: Array,
});

const emit = defineEmits(['update:notes']);

const selectedNote = ref(null);

const currentNote = computed(() => {
  return props.notes.find(n => n.id === selectedNote.value);
});

const addNote = () => {
  const newNote = {
    id: Date.now(),
    title: '',
    content: '',
    category: '',
    pinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  emit('update:notes', [...props.notes, newNote]);
  selectedNote.value = newNote.id;
};

const deleteNote = (id) => {
  if (confirm('Delete this note?')) {
    emit('update:notes', props.notes.filter(n => n.id !== id));
    selectedNote.value = null;
  }
};

const pinNote = (note) => {
  note.pinned = !note.pinned;
  updateNote();
};

const updateNote = () => {
  if (currentNote.value) {
    currentNote.value.updatedAt = new Date().toISOString();
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const wordCount = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

const getCategoryClass = (category) => {
  const classes = {
    world: 'bg-blue-900/30 text-blue-400',
    plot: 'bg-purple-900/30 text-purple-400',
    lore: 'bg-yellow-900/30 text-yellow-400',
    session: 'bg-green-900/30 text-green-400',
    ideas: 'bg-pink-900/30 text-pink-400',
  };
  return classes[category] || 'bg-slate-700 text-slate-400';
};

// Auto-select first note if none selected
watch(() => props.notes, (notes) => {
  if (notes.length > 0 && !selectedNote.value) {
    selectedNote.value = notes[0].id;
  }
}, { immediate: true });
</script>