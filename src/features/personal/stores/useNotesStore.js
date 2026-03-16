// stores/useNotesStore.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    collection,
    doc,
    query,
    orderBy,
    where,
    limit,
    getDocs,
    addDoc,
    updateDoc,
    serverTimestamp,
    deleteDoc,
    onSnapshot,
    getDoc,
    setDoc
} from 'firebase/firestore'
import { firestore } from '@/firebase'

export const useNotesStore = defineStore('notesStore', () => {
    // ─── State ───────────────────────────────────────────────────────────────
    /** Array of note metadata (id, title, status, updatedAt, etc.) */
    const notes = ref([])

    /** Mapping: noteId → current content string */
    const noteContents = ref({})

    /** For real‐time listeners, mapping: noteId → unsubscribe function */
    const noteUnsubs = ref({})

    const loadingNotes = ref(false)
    const loadingProfile = ref(false)

    /** User’s saved notes profile (e.g., displayName, preferences) */
    const userProfile = ref(null)

    // ─── Getters ─────────────────────────────────────────────────────────────
    /** Only “active” notes (status === 'active') */
    const activeNotes = computed(() => notes.value.filter(n => n.status === 'active'))
    const archivedNotes = computed(() => notes.value.filter(n => n.status === 'archived'))
    const deletedNotes = computed(() => notes.value.filter(n => n.status === 'deleted'))

    // ─── Actions ─────────────────────────────────────────────────────────────
    /**
     * Load the user’s “notes” profile document, stored at:
     *    users/{userId}/personal/notes   (firestore doc)
     * If it doesn’t exist, initialize with a default object.
     */
    async function loadUserProfile(userId) {
        loadingProfile.value = true
        try {
            const profileDoc = doc(firestore, `users/${userId}/personal/notes`)
            const snap = await getDoc(profileDoc)
            if (snap.exists()) {
                userProfile.value = snap.data()
            } else {
                // If no profile exists, create a default one
                await setDoc(profileDoc, {
                    displayName: '',
                    preferences: {},
                    updatedAt: serverTimestamp()
                })
                userProfile.value = { displayName: '', preferences: {} }
            }
        } finally {
            loadingProfile.value = false
        }
    }

    /**
     * Save (merge) new fields into the user’s notes profile.
     */
    async function saveUserProfile(userId, profileObj) {
        const profileDoc = doc(firestore, `users/${userId}/personal/notes`)
        await setDoc(
            profileDoc,
            {
                ...profileObj,
                updatedAt: serverTimestamp()
            },
            { merge: true }
        )
        await loadUserProfile(userId)
    }

    /**
     * Load the list of notes (metadata) for this user.
     * We store notes under:
     *    users/{userId}/personal/notes/notes  (collection)
     * Each document in that collection has fields:
     *    title: string
     *    status: 'active' | 'archived' | 'deleted'
     *    updatedAt: Timestamp
     */
    async function loadNotes(userId, status = 'active', n = 50) {
        loadingNotes.value = true
        try {
            const notesCol = collection(firestore, `users/${userId}/personal/notes/notes`)
            const q = query(
                notesCol,
                where('status', '==', status),
                orderBy('updatedAt', 'desc'),
                limit(n)
            )
            const snap = await getDocs(q)
            notes.value = snap.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            }))
        } finally {
            loadingNotes.value = false
        }
    }

    /**
     * Create a new note stub. Returns the new note’s ID.
     * - title defaults to "Untitled Note"
     * - content starts as an empty string
     * - status is 'active'
     * - updatedAt is serverTimestamp()
     */
    async function createNote(userId) {
        const notesCol = collection(firestore, `users/${userId}/personal/notes/notes`)
        const newNote = {
            title: 'Untitled Note',
            content: '',
            status: 'active',
            updatedAt: serverTimestamp()
        }
        const docRef = await addDoc(notesCol, newNote)
        // Reload the active list so UI updates
        await loadNotes(userId)
        return docRef.id
    }

    /**
     * Subscribe in real‐time to a single note’s content.
     * Listens to:
     *    users/{userId}/personal/notes/notes/{noteId}
     * Whenever it changes, updates noteContents[noteId] accordingly.
     */
    function subscribeToNoteContent(userId, noteId) {
        // If already subscribed, unsubscribe first
        unsubscribeFromNote(noteId)

        const noteDoc = doc(
            firestore,
            `users/${userId}/personal/notes/notes/${noteId}`
        )
        noteUnsubs.value[noteId] = onSnapshot(noteDoc, docSnap => {
            if (docSnap.exists()) {
                const data = docSnap.data()
                // Update local content cache
                noteContents.value[noteId] = data.content || ''
                // Also update the metadata in notes[].updatedAt if needed
                const idx = notes.value.findIndex(n => n.id === noteId)
                if (idx !== -1) {
                    notes.value[idx].updatedAt = data.updatedAt
                }
            } else {
                // If note was deleted remotely, remove from local maps
                delete noteContents.value[noteId]
                notes.value = notes.value.filter(n => n.id !== noteId)
            }
        })
    }

    /**
     * Unsubscribe from real‐time updates for a given noteId.
     */
    function unsubscribeFromNote(noteId) {
        if (noteUnsubs.value[noteId]) {
            noteUnsubs.value[noteId]() // call the unsubscribe function
            noteUnsubs.value[noteId] = null
        }
    }

    /**
     * Unsubscribe from all note listeners (e.g. on logout).
     */
    function unsubscribeAll() {
        Object.keys(noteUnsubs.value).forEach(noteId => {
            unsubscribeFromNote(noteId)
        })
    }

    /**
     * Update a note’s content. Also bumps updatedAt timestamp.
     */
    async function updateNoteContent(userId, noteId, newContent) {
        const noteDoc = doc(firestore, `users/${userId}/personal/notes/notes/${noteId}`)
        await updateDoc(noteDoc, {
            content: newContent,
            updatedAt: serverTimestamp()
        })
        // local noteContents will be updated by the snapshot listener,
        // and loadNotes() can be called if you want to re-fetch the list
    }

    /**
     * Rename a note (update its title). Also bumps updatedAt timestamp.
     */
    async function renameNote(userId, noteId, newTitle) {
        const noteDoc = doc(firestore, `users/${userId}/personal/notes/notes/${noteId}`)
        await updateDoc(noteDoc, {
            title: newTitle,
            updatedAt: serverTimestamp()
        })
        // Then reload the metadata list
        await loadNotes(userId)
    }

    /**
     * Soft‐delete a note: sets status to 'deleted' and updates updatedAt.
     * Then reloads the notes list.
     */
    async function deleteNote(userId, noteId) {
        const noteDoc = doc(firestore, `users/${userId}/personal/notes/notes/${noteId}`)
        await updateDoc(noteDoc, {
            status: 'deleted',
            updatedAt: serverTimestamp()
        })
        // If the deleted note was open, remove its content from local state
        delete noteContents.value[noteId]
        unsubscribeFromNote(noteId)
        await loadNotes(userId)
    }

    /**
     * Hard‐delete a note document (permanently). Then reloads notes.
     *
     * Use with caution—this cannot be undone.
     */
    async function hardDeleteNote(userId, noteId) {
        const noteDoc = doc(firestore, `users/${userId}/personal/notes/notes/${noteId}`)
        await deleteDoc(noteDoc)
        delete noteContents.value[noteId]
        unsubscribeFromNote(noteId)
        await loadNotes(userId)
    }

    return {
        // ── State & Getters ─────────────────────────
        notes,
        noteContents,
        userProfile,
        loadingNotes,
        loadingProfile,
        activeNotes,
        archivedNotes,
        deletedNotes,

        // ── Actions ──────────────────────────────────
        loadUserProfile,
        saveUserProfile,
        loadNotes,
        createNote,
        subscribeToNoteContent,
        unsubscribeFromNote,
        unsubscribeAll,
        updateNoteContent,
        renameNote,
        deleteNote,
        hardDeleteNote
    }
})
