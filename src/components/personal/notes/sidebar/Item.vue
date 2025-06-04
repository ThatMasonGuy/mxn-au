<template>
    <div class="relative group">
        <div @click="selectNoteItem"
            :class="[
                'p-2 rounded-lg mb-1 cursor-pointer flex items-center gap-2 transition-colors',
                isSelected ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800']"
            tabindex="0" @keydown.enter.prevent="selectNoteItem" @contextmenu.prevent="openContextMenu">
            <div
                class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-200 via-indigo-300 to-purple-200 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 dark:text-indigo-300" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
            </div>
            <div class="flex-1 min-w-0">
                <div v-if="isRenaming" class="flex items-center gap-2">
                    <input v-model="localRenameInput" @keyup.enter="confirmRenameItem" @blur="cancelRenameItem"
                        class="text-sm px-2 py-1 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 w-32 focus:ring-2 focus:ring-indigo-400"
                        autofocus />
                    <button @click="confirmRenameItem"
                        class="text-xs flex items-center gap-1 text-indigo-600 font-bold hover:underline">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Save
                    </button>
                    <button @click="cancelRenameItem"
                        class="text-xs flex items-center gap-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                    </button>
                </div>
                <template v-else>
                    <div class="font-medium truncate">{{ note.title }}</div>
                    <div class="text-xs text-zinc-500 truncate">{{ note.preview }}</div>
                </template>
            </div>
            <button
                class="ml-2 opacity-50 group-hover:opacity-100 focus:opacity-100 transition p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
                @click.stop="openContextMenu" tabindex="-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <circle cx="12" cy="6" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="18" r="1.5" />
                </svg>
            </button>

            <transition name="fade">
                <div v-if="isContextMenuOpen"
                    class="absolute right-2 top-12 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-2xl rounded-xl min-w-[150px] py-2 flex flex-col space-y-1 animate-pop"
                    @click.stop>
                    <button @click="startRenameItem"
                        class="flex items-center gap-2 w-full text-left px-4 py-2 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L5 11l4-4z" />
                        </svg>
                        Rename
                    </button>
                    <button @click="archiveNoteItem"
                        class="flex items-center gap-2 w-full text-left px-4 py-2 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0h-4M4 13h16" />
                        </svg>
                        Archive
                    </button>
                    <button @click="deleteNoteItem"
                        class="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 text-sm transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Delete
                    </button>
                </div>
            </transition>
            <div v-if="isContextMenuOpen" class="fixed inset-0 z-40" @click="closeContextMenu"
                style="pointer-events: auto; background: transparent"></div>
        </div>
        <div v-if="!isSidebarOpen" @click="selectNoteItem"
            :class="['mx-auto mb-3 rounded-lg flex items-center justify-center cursor-pointer w-10 h-10', isSelected ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700']">
            <span class="text-sm font-medium">{{ note.title.charAt(0) }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, watch } from 'vue';

const props = defineProps({
    note: Object,
    isSelected: Boolean,
    isContextMenuOpenGlobal: [String, null],
    renamingNoteIdGlobal: [String, null],
    isSidebarOpen: Boolean,
});

const emit = defineEmits([
    'select-note',
    'open-menu',
    'close-menu',
    'start-rename',
    'confirm-rename',
    'cancel-rename',
    'archive-note',
    'delete-note',
]);

const localRenameInput = ref('');

const isRenaming = computed(() => props.renamingNoteIdGlobal === props.note.id);
const isContextMenuOpen = computed(() => props.isContextMenuOpenGlobal === props.note.id);

watch(() => props.note.title, (newTitle) => {
    if (isRenaming.value) {
        localRenameInput.value = newTitle;
    }
});

const selectNoteItem = () => {
    emit('select-note', props.note);
};

const openContextMenu = () => {
    emit('open-menu', props.note.id);
};

const closeContextMenu = () => {
    emit('close-menu');
};

const startRenameItem = () => {
    localRenameInput.value = props.note.title;
    emit('start-rename', props.note);
};

const confirmRenameItem = () => {
    if (localRenameInput.value.trim()) {
        emit('confirm-rename', props.note, localRenameInput.value.trim());
    }
};

const cancelRenameItem = () => {
    emit('cancel-rename');
};

const archiveNoteItem = () => {
    emit('archive-note', props.note);
};

const deleteNoteItem = () => {
    emit('delete-note', props.note);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.16s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.animate-pop {
    animation: pop-in 0.18s cubic-bezier(0.2, 0, 0.6, 1);
}

@keyframes pop-in {
    0% {
        transform: scale(0.94);
        opacity: 0;
    }

    80% {
        transform: scale(1.02);
        opacity: 1;
    }

    100% {
        transform: scale(1);
    }
}
</style>
