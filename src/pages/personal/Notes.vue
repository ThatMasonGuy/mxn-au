<!-- src/components/notes/NotesPage.vue -->
<template>
    <div class="flex h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
        <!-- MAIN LAYOUT CONTAINER -->
        <div class="flex flex-1 h-full">
            <!-- Sidebar (desktop) -->
            <Sidebar :is-sidebar-open="isSidebarOpen" :force-visible="false" :grouped-notes="groupedNotes"
                :selected-note-id="selectedNoteId" :action-menu-open-id="actionMenuOpenId"
                :renaming-note-id="renamingNoteId" :user-name="userName" :account-type="accountType"
                :format-date="formatDate" :format-date-short="formatDateShort" @toggle-sidebar="toggleSidebar"
                @create-note="handleCreateNote" @select-note="handleSelectNote" @open-menu="handleOpenMenu"
                @close-menu="handleCloseMenu" @start-rename="handleStartRename" @confirm-rename="handleConfirmRename"
                @cancel-rename="handleCancelRename" @delete-note="handleDeleteNote" />

            <!-- Notes main area -->
            <Notes class="flex-1 flex flex-col h-full" ref="notesRef" :selected-note="selectedNote"
                :is-dark-mode="isDarkMode" :format-time="formatTime" :note-content="noteContent" :is-saving="isSaving"
                @toggle-theme="toggleTheme" @toggle-sidebar="toggleSidebar"
                @update:noteContent="val => noteContent = val" />
        </div>

        <!-- BACKDROP OVERLAY (for mobile sidebar) -->
        <div :class="[
            'fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
            isSidebarOpen ? 'bg-black/40 opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        ]" @click="toggleSidebar" />

        <!-- MOBILE SIDEBAR SLIDE-IN -->
        <transition name="slide">
            <div v-if="isSidebarOpen"
                class="fixed top-0 left-0 bottom-0 w-80 bg-zinc-900 z-50 shadow-lg overflow-y-auto lg:hidden">
                <Sidebar :is-sidebar-open="true" :force-visible="true" :grouped-notes="groupedNotes"
                    :selected-note-id="selectedNoteId" :action-menu-open-id="actionMenuOpenId"
                    :renaming-note-id="renamingNoteId" :user-name="userName" :account-type="accountType"
                    :format-date="formatDate" :format-date-short="formatDateShort" @toggle-sidebar="toggleSidebar"
                    @create-note="handleCreateNote" @open-menu="handleOpenMenu" @close-menu="handleCloseMenu"
                    @start-rename="handleStartRename" @confirm-rename="handleConfirmRename"
                    @cancel-rename="handleCancelRename" @delete-note="handleDeleteNote" @select-note="handleSelectNote" />
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useMainStore } from '@/stores/useMainStore'
import { useNotesStore } from '@/stores/useNotesStore'
import Sidebar from '@/components/personal/notes/layouts/Sidebar.vue'
import Notes from '@/components/personal/notes/layouts/Notes.vue'

// --- STORES & REFS ---
const mainStore = useMainStore()
const notesStore = useNotesStore()

const isSidebarOpen = ref(true)
const isDarkMode = ref(false)

const selectedNoteId = ref(null)
const noteContent = ref('')
const isSaving = ref(false)

const actionMenuOpenId = ref(null)
const renamingNoteId = ref(null)

const notesRef = ref(null)

// --- COMPUTED PROPERTIES ---
const userName = computed(() => {
    const profile = notesStore.userProfile
    return profile?.displayName || mainStore.user?.userName || mainStore.user?.email || 'Guest User'
})

const accountType = computed(() => {
    const profile = notesStore.userProfile
    return profile?.accountType || 'Free Account'
})

const groupedNotes = computed(() => {
    // Example grouping logic. Adjust to match your store’s shape.
    const allNotes = notesStore.activeNotes || []
    const groups = {}

    allNotes.forEach(note => {
        // Convert Firestore Timestamp or string to Date
        let dateObj = null
        if (note.updatedAt?.toDate) {
            dateObj = note.updatedAt.toDate()
        } else if (note.updatedAt instanceof Date) {
            dateObj = note.updatedAt
        } else {
            dateObj = new Date(note.updatedAt || Date.now())
        }

        const dateKey = dateObj.toLocaleDateString()
        if (!Array.isArray(groups[dateKey])) {
            groups[dateKey] = []
        }
        groups[dateKey].push({
            id: note.id,
            title: note.title,
            raw: note,
        })
    })

    // Sort groups by date descending
    const sortedKeys = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a))
    const sortedGroups = {}
    sortedKeys.forEach(key => {
        groups[key].sort((a, b) => {
            const aTime = a.raw.updatedAt?.toDate?.().getTime?.() || new Date(a.raw.updatedAt || 0).getTime()
            const bTime = b.raw.updatedAt?.toDate?.().getTime?.() || new Date(b.raw.updatedAt || 0).getTime()
            return bTime - aTime
        })
        sortedGroups[key] = groups[key]
    })

    return sortedGroups
})

const selectedNote = computed(() => {
    if (!selectedNoteId.value) return null
    return notesStore.activeNotes.find(n => n.id === selectedNoteId.value) || null
})

// --- DATE / TIME FORMATTERS (pass down to Sidebar & Notes) ---
const asDate = (val) => {
    if (!val) return null
    if (typeof val.toDate === 'function') return val.toDate()
    if (val instanceof Date) return val
    const d = new Date(val)
    return isNaN(d.getTime()) ? null : d
}

const formatDate = (dateInput) => {
    const date = asDate(dateInput)
    if (!date) return 'Invalid Date'

    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

const formatDateShort = (dateInput) => {
    const date = asDate(dateInput)
    if (!date) return ''
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yst'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const formatTime = (timeInput) => {
    const date = asDate(timeInput)
    if (!date) return ''
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

// --- METHODS ---
// Toggle sidebar open/close (desktop + mobile)
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
}

// Toggle dark/light theme
const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    if (isDarkMode.value) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

// Create a new note (stub—wire up to your store/composable)
const handleCreateNote = async () => {
    try {
        const result = await notesStore.createNote()
        if (result?.id) {
            selectedNoteId.value = result.id
            noteContent.value = ''
            // focus editor once it’s mounted
            await nextTick()
            notesRef.value?.focusEditor?.()
        }
    } catch (e) {
        console.error('Error creating note:', e)
    }
}

// When user clicks on a note in the sidebar
const handleSelectNote = (note) => {
    if (note && note.id) {
        selectedNoteId.value = note.id
        actionMenuOpenId.value = null
        renamingNoteId.value = null
        nextTick(() => {
            notesRef.value?.focusEditor?.()
        })
    }
}

// Open the “…” menu for a specific note
const handleOpenMenu = (noteId) => {
    actionMenuOpenId.value = noteId
    renamingNoteId.value = null
}

// Close any open action menu
const handleCloseMenu = () => {
    actionMenuOpenId.value = null
}

// Start renaming a note
const handleStartRename = (note) => {
    renamingNoteId.value = note.id
    actionMenuOpenId.value = null
}

// Confirm rename (stub—wire up to store)
const handleConfirmRename = async (note, newName) => {
    const trimmed = newName.trim()
    if (trimmed && note?.id && mainStore.user?.uid) {
        try {
            await notesStore.renameNote(mainStore.user.uid, note.id, trimmed)
        } catch (err) {
            console.error('Error renaming note:', err)
        }
    }
    renamingNoteId.value = null
}

// Cancel renaming
const handleCancelRename = () => {
    renamingNoteId.value = null
}

// Delete a note (stub—wire up to store)
const handleDeleteNote = async (note) => {
    if (note?.id && mainStore.user?.uid) {
        try {
            await notesStore.deleteNote(mainStore.user.uid, note.id)
            if (selectedNoteId.value === note.id) {
                selectedNoteId.value = null
                noteContent.value = ''
            }
        } catch (err) {
            console.error('Error deleting note:', err)
        }
    }
    actionMenuOpenId.value = null
}

// Whenever the selected note changes, load its content
watch(selectedNoteId, async (newId, oldId) => {
    if (oldId && mainStore.user?.uid) {
        notesStore.unsubscribeFromNote(oldId)
    }
    if (newId && mainStore.user?.uid) {
        await notesStore.subscribeToNoteContent(mainStore.user.uid, newId)
        // Load content into local `noteContent`
        noteContent.value = notesStore.noteContents[newId] || ''
        // Focus the editor
        nextTick(() => {
            notesRef.value?.focusEditor?.()
        })
    } else {
        noteContent.value = ''
    }
})

// When the user types/edit content, auto-save (stub)
watch(noteContent, (newVal) => {
    isSaving.value = true
    // Debounce or throttle as needed
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(async () => {
        if (selectedNoteId.value) {
            try {
                await notesStore.updateNoteContent(mainStore.user.uid, selectedNoteId.value, newVal)
            } catch (err) {
                console.error('Error saving note:', err)
            }
        }
        isSaving.value = false
    }, 500)
})

let saveTimeout = null

// On mount: load initial notes list
onMounted(async () => {
    if (mainStore.user?.uid) {
        await notesStore.loadUserProfile(mainStore.user.uid)
        await notesStore.loadNotes(mainStore.user.uid)
        // If there are any notes, select the most recent by default
        if (notesStore.activeNotes.length > 0) {
            const sorted = [...notesStore.activeNotes].sort(
                (a, b) => (b.updatedAt?.toDate?.().getTime() || 0) - (a.updatedAt?.toDate?.().getTime() || 0)
            )
            selectedNoteId.value = sorted[0]?.id || null
        }
    }
    // Detect system dark‐mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        isDarkMode.value = true
        document.documentElement.classList.add('dark')
    }
})

onUnmounted(() => {
    if (saveTimeout) clearTimeout(saveTimeout)
    if (selectedNoteId.value && mainStore.user?.uid) {
        notesStore.unsubscribeFromNote(selectedNoteId.value)
    }
})
</script>

<style scoped>
body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* BACKDROP FADE */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* SIDEBAR SLIDE-IN */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from {
    transform: translateX(-100%);
}

.slide-leave-to {
    transform: translateX(-100%);
}
</style>