// @/stores/personal/useKanbanStore.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore'
import { firestore } from '@/firebase'
import { useMainStore } from '@/stores/useMainStore'

export const useKanbanStore = defineStore('kanban', () => {
    const mainStore = useMainStore()

    // State
    const boards = ref([])
    const currentBoard = ref(null)
    const columns = ref([])
    const cards = ref([])
    const loading = ref(false)
    const error = ref(null)

    // Computed
    const cardsByColumn = computed(() => {
        const cardMap = {}
        columns.value.forEach(column => {
            cardMap[column.id] = cards.value
                .filter(card => card.columnId === column.id)
                .sort((a, b) => a.order - b.order)
        })
        return cardMap
    })

    // Helper to get user's kanban collection path
    const getUserKanbanPath = () => {
        if (!mainStore.user?.uid) throw new Error('User not authenticated')
        return `users/${mainStore.user.uid}/personal/kanban`
    }

    // Board Operations
    async function fetchBoards() {
        try {
            loading.value = true
            const boardsRef = collection(firestore, `${getUserKanbanPath()}/boards`)
            const snapshot = await getDocs(query(boardsRef, orderBy('createdAt', 'desc')))
            boards.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        } catch (err) {
            error.value = err.message
            console.error('Error fetching boards:', err)
        } finally {
            loading.value = false
        }
    }

    async function createBoard(boardData) {
        try {
            loading.value = true
            const boardsRef = collection(firestore, `${getUserKanbanPath()}/boards`)
            const docRef = await addDoc(boardsRef, {
                ...boardData,
                // Set defaults for color and icon if not provided
                color: boardData.color || '#6366f1',
                icon: boardData.icon || 'Trello',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })

            // Create default columns
            const defaultColumns = [
                { name: 'To Do', color: '#ef4444', order: 0 },
                { name: 'In Progress', color: '#f59e0b', order: 1 },
                { name: 'Done', color: '#10b981', order: 2 }
            ]

            for (const columnData of defaultColumns) {
                await createColumn(docRef.id, columnData)
            }

            await fetchBoards()
            return docRef.id
        } catch (err) {
            error.value = err.message
            console.error('Error creating board:', err)
        } finally {
            loading.value = false
        }
    }

    async function updateBoard(boardId, updates) {
        try {
            const boardRef = doc(firestore, `${getUserKanbanPath()}/boards`, boardId)
            await updateDoc(boardRef, {
                ...updates,
                updatedAt: serverTimestamp()
            })

            // Update local currentBoard if it's the one being updated
            if (currentBoard.value && currentBoard.value.id === boardId) {
                currentBoard.value = {
                    ...currentBoard.value,
                    ...updates,
                    // Ensure color and icon are preserved
                    color: updates.color || currentBoard.value.color,
                    icon: updates.icon || currentBoard.value.icon
                }
            }

            // Update board in the boards array
            const boardIndex = boards.value.findIndex(b => b.id === boardId)
            if (boardIndex !== -1) {
                boards.value[boardIndex] = {
                    ...boards.value[boardIndex],
                    ...updates
                }
            }
        } catch (err) {
            error.value = err.message
            console.error('Error updating board:', err)
        }
    }

    async function deleteBoard(boardId) {
        try {
            loading.value = true
            const boardRef = doc(firestore, `${getUserKanbanPath()}/boards`, boardId)

            // Soft delete: move to archived collection
            const archivedBoardsRef = collection(firestore, `${getUserKanbanPath()}/archived/boards`)
            const boardDoc = await getDoc(boardRef)

            if (boardDoc.exists()) {
                await addDoc(archivedBoardsRef, {
                    ...boardDoc.data(),
                    originalId: boardId,
                    archivedAt: serverTimestamp()
                })

                // Delete the original
                await deleteDoc(boardRef)
            }

            await fetchBoards()
        } catch (err) {
            error.value = err.message
            console.error('Error deleting board:', err)
        } finally {
            loading.value = false
        }
    }

    // Column Operations
    async function fetchColumns(boardId) {
        try {
            loading.value = true
            const columnsRef = collection(firestore, `${getUserKanbanPath()}/boards/${boardId}/columns`)
            const snapshot = await getDocs(query(columnsRef, orderBy('order')))
            columns.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        } catch (err) {
            error.value = err.message
            console.error('Error fetching columns:', err)
        } finally {
            loading.value = false
        }
    }

    async function createColumn(boardId, columnData) {
        try {
            const columnsRef = collection(firestore, `${getUserKanbanPath()}/boards/${boardId}/columns`)
            const docRef = await addDoc(columnsRef, {
                ...columnData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })
            await fetchColumns(boardId)
            return docRef.id
        } catch (err) {
            error.value = err.message
            console.error('Error creating column:', err)
        }
    }

    async function updateColumn(boardId, columnId, updates) {
        try {
            const columnRef = doc(firestore, `${getUserKanbanPath()}/boards/${boardId}/columns`, columnId)
            await updateDoc(columnRef, {
                ...updates,
                updatedAt: serverTimestamp()
            })

            // Update local columns array
            const index = columns.value.findIndex(col => col.id === columnId)
            if (index !== -1) {
                columns.value[index] = { ...columns.value[index], ...updates }
            }
        } catch (err) {
            error.value = err.message
            console.error('Error updating column:', err)
        }
    }

    async function deleteColumn(boardId, columnId) {
        try {
            // First soft delete all cards in the column
            const cardsToDelete = cards.value.filter(card => card.columnId === columnId)
            for (const card of cardsToDelete) {
                await deleteCard(boardId, card.id)
            }

            const columnRef = doc(firestore, `${getUserKanbanPath()}/boards/${boardId}/columns`, columnId)

            // Soft delete: move to archived collection
            const archivedColumnsRef = collection(firestore, `${getUserKanbanPath()}/archived/columns`)
            const columnDoc = await getDoc(columnRef)

            if (columnDoc.exists()) {
                await addDoc(archivedColumnsRef, {
                    ...columnDoc.data(),
                    originalId: columnId,
                    boardId: boardId,
                    archivedAt: serverTimestamp()
                })

                // Delete the original
                await deleteDoc(columnRef)
            }

            await fetchColumns(boardId)
        } catch (err) {
            error.value = err.message
            console.error('Error deleting column:', err)
        }
    }

    // Column Reordering
    async function reorderColumns(boardId, newOrder) {
        try {
            const batch = writeBatch(firestore)

            newOrder.forEach((columnId, index) => {
                const columnRef = doc(firestore, `${getUserKanbanPath()}/boards/${boardId}/columns`, columnId)
                batch.update(columnRef, { order: index, updatedAt: serverTimestamp() })
            })

            await batch.commit()

            // Update local state
            columns.value.sort((a, b) => {
                const aIndex = newOrder.indexOf(a.id)
                const bIndex = newOrder.indexOf(b.id)
                return aIndex - bIndex
            })

            columns.value.forEach((col, index) => {
                col.order = index
            })
        } catch (err) {
            error.value = err.message
            console.error('Error reordering columns:', err)
        }
    }

    // Card Operations
    async function fetchCards(boardId) {
        try {
            loading.value = true
            const cardsRef = collection(firestore, `${getUserKanbanPath()}/boards/${boardId}/cards`)
            const snapshot = await getDocs(query(cardsRef, orderBy('order')))
            cards.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        } catch (err) {
            error.value = err.message
            console.error('Error fetching cards:', err)
        } finally {
            loading.value = false
        }
    }

    async function createCard(boardId, cardData) {
        try {
            const cardsRef = collection(firestore, `${getUserKanbanPath()}/boards/${boardId}/cards`)
            const docRef = await addDoc(cardsRef, {
                ...cardData,
                checklist: cardData.checklist || [],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })
            await fetchCards(boardId)
            return docRef.id
        } catch (err) {
            error.value = err.message
            console.error('Error creating card:', err)
        }
    }

    async function updateCard(boardId, cardId, updates) {
        try {
            const cardRef = doc(firestore, `${getUserKanbanPath()}/boards/${boardId}/cards`, cardId)
            await updateDoc(cardRef, {
                ...updates,
                updatedAt: serverTimestamp()
            })

            // Update local cards array
            const index = cards.value.findIndex(card => card.id === cardId)
            if (index !== -1) {
                cards.value[index] = { ...cards.value[index], ...updates }
            }

            // Update board's updatedAt timestamp
            const boardRef = doc(firestore, `${getUserKanbanPath()}/boards`, boardId)
            await updateDoc(boardRef, { updatedAt: serverTimestamp() })
        } catch (err) {
            error.value = err.message
            console.error('Error updating card:', err)
        }
    }

    async function deleteCard(boardId, cardId) {
        try {
            const cardRef = doc(firestore, `${getUserKanbanPath()}/boards/${boardId}/cards`, cardId)

            // Soft delete: move to archived collection
            const archivedCardsRef = collection(firestore, `${getUserKanbanPath()}/archived/cards`)
            const cardDoc = await getDoc(cardRef)

            if (cardDoc.exists()) {
                await addDoc(archivedCardsRef, {
                    ...cardDoc.data(),
                    originalId: cardId,
                    boardId: boardId,
                    archivedAt: serverTimestamp()
                })

                // Delete the original
                await deleteDoc(cardRef)
            }

            // Remove from local state
            cards.value = cards.value.filter(card => card.id !== cardId)
        } catch (err) {
            error.value = err.message
            console.error('Error deleting card:', err)
        }
    }

    // Enhanced Drag and Drop
    async function moveCard(boardId, cardId, newColumnId, newOrder) {
        try {
            const card = cards.value.find(c => c.id === cardId)
            if (!card) return

            const oldColumnId = card.columnId

            // Update the moved card
            await updateCard(boardId, cardId, {
                columnId: newColumnId,
                order: newOrder
            })

            // Reorder cards in the destination column
            const destinationCards = cards.value
                .filter(c => c.columnId === newColumnId && c.id !== cardId)
                .sort((a, b) => a.order - b.order)

            const batch = writeBatch(firestore)

            // Update cards that need their order adjusted
            destinationCards.forEach((c, index) => {
                const expectedOrder = index >= newOrder ? index + 1 : index
                if (c.order !== expectedOrder) {
                    const cardRef = doc(firestore, `${getUserKanbanPath()}/boards/${boardId}/cards`, c.id)
                    batch.update(cardRef, { order: expectedOrder, updatedAt: serverTimestamp() })
                    c.order = expectedOrder
                }
            })

            // If moving within the same column, also reorder source cards
            if (oldColumnId === newColumnId) {
                const sourceCards = cards.value
                    .filter(c => c.columnId === oldColumnId && c.id !== cardId)
                    .sort((a, b) => a.order - b.order)

                sourceCards.forEach((c, index) => {
                    if (c.order !== index) {
                        const cardRef = doc(firestore, `${getUserKanbanPath()}/boards/${boardId}/cards`, c.id)
                        batch.update(cardRef, { order: index, updatedAt: serverTimestamp() })
                        c.order = index
                    }
                })
            }

            await batch.commit()
        } catch (err) {
            error.value = err.message
            console.error('Error moving card:', err)
        }
    }

    // Card Reordering within same column
    async function reorderCards(boardId, columnId, newOrder) {
        try {
            const batch = writeBatch(firestore)

            newOrder.forEach((cardId, index) => {
                const cardRef = doc(firestore, `${getUserKanbanPath()}/boards/${boardId}/cards`, cardId)
                batch.update(cardRef, { order: index, updatedAt: serverTimestamp() })
            })

            await batch.commit()

            // Update local state
            cards.value.forEach(card => {
                if (card.columnId === columnId) {
                    const newIndex = newOrder.indexOf(card.id)
                    if (newIndex !== -1) {
                        card.order = newIndex
                    }
                }
            })
        } catch (err) {
            error.value = err.message
            console.error('Error reordering cards:', err)
        }
    }

    // Real-time subscriptions
    function subscribeToBoard(boardId) {
        const unsubscribers = []

        // Subscribe to board changes
        const boardRef = doc(firestore, `${getUserKanbanPath()}/boards`, boardId)
        const unsubBoard = onSnapshot(boardRef, (doc) => {
            if (doc.exists()) {
                const boardData = { id: doc.id, ...doc.data() }
                currentBoard.value = boardData

                // Update in boards array
                const index = boards.value.findIndex(b => b.id === boardId)
                if (index !== -1) {
                    boards.value[index] = boardData
                }
            }
        })
        unsubscribers.push(unsubBoard)

        // Subscribe to columns
        const columnsRef = collection(firestore, `${getUserKanbanPath()}/boards/${boardId}/columns`)
        const unsubColumns = onSnapshot(query(columnsRef, orderBy('order')), (snapshot) => {
            columns.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        })
        unsubscribers.push(unsubColumns)

        // Subscribe to cards
        const cardsRef = collection(firestore, `${getUserKanbanPath()}/boards/${boardId}/cards`)
        const unsubCards = onSnapshot(query(cardsRef, orderBy('order')), (snapshot) => {
            cards.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        })
        unsubscribers.push(unsubCards)

        return () => unsubscribers.forEach(unsub => unsub())
    }

    function clearStore() {
        boards.value = []
        currentBoard.value = null
        columns.value = []
        cards.value = []
        error.value = null
    }

    return {
        // State
        boards,
        currentBoard,
        columns,
        cards,
        loading,
        error,

        // Computed
        cardsByColumn,

        // Actions
        fetchBoards,
        createBoard,
        updateBoard,
        deleteBoard,
        fetchColumns,
        createColumn,
        updateColumn,
        deleteColumn,
        reorderColumns,
        fetchCards,
        createCard,
        updateCard,
        deleteCard,
        moveCard,
        reorderCards,
        subscribeToBoard,
        clearStore
    }
})