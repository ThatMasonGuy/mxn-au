// stores/useJournalChatStore.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    collection, doc, query, orderBy, where, limit, getDocs, addDoc, updateDoc,
    serverTimestamp, startAfter, deleteDoc, onSnapshot, getDoc, setDoc
} from 'firebase/firestore'
import { firestore } from '@/firebase'
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useTokenTracker } from '@/composables/useTokenTracker.js'

const { trackTokenUsage } = useTokenTracker()
const functions = getFunctions(undefined, 'australia-southeast1');
const handleJournalChat = httpsCallable(functions, 'handleJournalChat');

export const useJournalChatStore = defineStore('journalChatStore', () => {
    // State
    const chats = ref([])
    const messages = ref({})
    const chatPaging = ref({})
    const loadingChats = ref(false)
    const loadingMessages = ref({})
    const messageUnsub = ref({})

    // Getters
    const activeChats = computed(() => chats.value.filter(c => c.status === 'active'))
    const archivedChats = computed(() => chats.value.filter(c => c.status === 'archived'))
    const deletedChats = computed(() => chats.value.filter(c => c.status === 'deleted'))

    const userProfile = ref(null)
    const loadingProfile = ref(false)

    async function loadUserProfile(userId) {
        loadingProfile.value = true
        const journalDoc = doc(firestore, `users/${userId}/personal/journal`)
        const snap = await getDoc(journalDoc)
        userProfile.value = snap.exists() ? snap.data() : { displayName: '', profile: '' }
        loadingProfile.value = false
    }

    async function saveUserProfile(userId, profileObj) {
        const journalDoc = doc(firestore, `users/${userId}/personal/journal`)
        await setDoc(journalDoc, {
            ...profileObj,
            updatedAt: serverTimestamp()
        }, { merge: true })
        await loadUserProfile(userId)
    }

    // Load chats list by status
    async function loadChats(userId, status = 'active', n = 20) {
        loadingChats.value = true
        const chatsCol = collection(firestore, `users/${userId}/personal/journal/chats`)
        const q = query(
            chatsCol,
            where('status', '==', status),
            orderBy('updatedAt', 'desc'),
            limit(n)
        )
        const snap = await getDocs(q)
        chats.value = snap.docs.map(doc => ({
            chatId: doc.id,
            ...doc.data()
        }))
        loadingChats.value = false
    }

    // One-time paginated message load (optional if you want "load older messages" too)
    async function loadMessages(userId, chatId, n = 20, after = null) {
        loadingMessages.value[chatId] = true
        let msgCol = collection(firestore, `users/${userId}/personal/journal/chats/${chatId}/messages`)
        let q = query(msgCol, orderBy('createdAt', 'desc'), limit(n))
        if (after) q = query(msgCol, orderBy('createdAt', 'desc'), startAfter(after), limit(n))
        const snap = await getDocs(q)
        const msgs = snap.docs.map(doc => ({
            messageId: doc.id,
            ...doc.data()
        }))
        if (!messages.value[chatId]) messages.value[chatId] = []
        messages.value[chatId].push(...msgs.reverse())
        loadingMessages.value[chatId] = false
        if (msgs.length > 0) chatPaging.value[chatId] = snap.docs[snap.docs.length - 1]
        return msgs.length ? snap.docs[snap.docs.length - 1] : null
    }

    // 🔴 SUBSCRIBE TO LIVE MESSAGES
    function subscribeToMessages(userId, chatId, n = 50) {
        // Unsubscribe from any previous listener on this chat
        unsubscribeFromMessages(chatId)

        const msgCol = collection(firestore, `users/${userId}/personal/journal/chats/${chatId}/messages`)
        const q = query(msgCol, orderBy('createdAt', 'desc'), limit(n))
        // Save the unsubscribe function
        messageUnsub.value[chatId] = onSnapshot(q, (snap) => {
            const msgs = snap.docs.map(doc => ({
                messageId: doc.id,
                ...doc.data()
            })).reverse()
            messages.value[chatId] = msgs
        })
    }

    // Cleanup/unsubscribe when leaving chat or component is destroyed
    function unsubscribeFromMessages(chatId) {
        if (messageUnsub.value[chatId]) {
            messageUnsub.value[chatId]() // Call the unsubscribe fn
            messageUnsub.value[chatId] = null
        }
    }

    // Create a new chat
    async function createChat(userId, chatName) {
        const chatsCol = collection(firestore, `users/${userId}/personal/journal/chats`)
        const chatData = {
            chatName,
            status: 'active',
            lastMessage: '',
            lastMessageSender: '',
            lastMessageTime: null,
            updatedAt: serverTimestamp()
        }
        const chatRef = await addDoc(chatsCol, chatData)
        await loadChats(userId)
        return chatRef.id
    }

    async function sendMessage(userId, chatId, { content, sender, tokenUsage }) {
        const msgData = {
            content,
            sender,
            createdAt: serverTimestamp(),
            tokenUsage: tokenUsage || null
        }

        const msgCol = collection(firestore, `users/${userId}/personal/journal/chats/${chatId}/messages`)
        const docRef = await addDoc(msgCol, msgData)

        const chatDoc = doc(firestore, `users/${userId}/personal/journal/chats/${chatId}`)
        await updateDoc(chatDoc, {
            lastMessage: content,
            lastMessageSender: sender,
            lastMessageTime: serverTimestamp(),
            updatedAt: serverTimestamp()
        })

        return docRef.id
    }

    async function getUnchunkedMessages(userId, chatId) {
        const msgRef = collection(firestore, `users/${userId}/personal/journal/chats/${chatId}/messages`);
        const chunkRef = collection(firestore, `users/${userId}/personal/journal/chats/${chatId}/chunks`);

        const msgSnap = await getDocs(query(msgRef, orderBy('createdAt')));
        const messages = msgSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const chunkSnap = await getDocs(query(chunkRef, orderBy('createdAt')));
        const chunkedIds = chunkSnap.docs.flatMap(doc => doc.data().messageIds);

        return messages.filter(m => !chunkedIds.includes(m.id)).slice(-10);
    }

    async function getChunkSummaries(userId, chatId) {
        const chunkRef = collection(firestore, `users/${userId}/personal/journal/chats/${chatId}/chunks`);
        const snap = await getDocs(query(chunkRef, orderBy('createdAt')));
        return snap.docs.map(doc => doc.data());
    }


    async function trySummariseNewChunk(userId, chatId) {
        const msgRef = collection(firestore, `users/${userId}/personal/journal/chats/${chatId}/messages`)
        const msgSnap = await getDocs(query(msgRef, orderBy('createdAt')))
        const allMessages = msgSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        const chunkRef = collection(firestore, `users/${userId}/personal/journal/chats/${chatId}/chunks`)
        const chunkSnap = await getDocs(query(chunkRef, orderBy('createdAt')))
        const existingChunks = chunkSnap.docs.map(doc => doc.data())

        const allChunkedMessageIds = existingChunks.flatMap(chunk => chunk.messageIds)
        const unchunkedMessages = allMessages.filter(m => !allChunkedMessageIds.includes(m.id))

        const threshold = 5
        if (unchunkedMessages.length < threshold) return

        const chunkToSummarise = unchunkedMessages.slice(0, threshold)

        const formattedForAI = chunkToSummarise.map(m => ({
            role: m.sender === 'ai' ? 'assistant' : 'user',
            content: m.content
        }))

        const { data } = await handleJournalChat({
            packageCode: 'summaryChunk',
            messages: formattedForAI
        })

        const newChunk = {
            summary: data.summary,
            moods: data.moods,
            topics: data.topics,
            messageIds: chunkToSummarise.map(m => m.id),
            createdAt: new Date(),
            tokenUsage: data.tokenUsage || null
        }

        await trackTokenUsage({
            userId,
            chatId,
            tokenUsage: data.tokenUsage || null,
            modelUsed: 'gpt-4.1-mini',
            type: 'message'
        })

        await addDoc(chunkRef, newChunk)
    }

    function getLastAImessage(chatId) {
        const all = messages.value[chatId] || []
        return all.filter(m => m.sender === 'ai').at(-1)?.content || ''
    }

    function getAllMessages(chatId) {
        return [...(messages.value[chatId] || [])].sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds)
    }

    // Archive, restore, soft-delete chat
    async function updateChatStatus(userId, chatId, status) {
        const chatDoc = doc(firestore, `users/${userId}/personal/journal/chats/${chatId}`)
        await updateDoc(chatDoc, {
            status,
            updatedAt: serverTimestamp()
        })
        await loadChats(userId)
    }

    // Hard delete chat (optional)
    async function hardDeleteChat(userId, chatId) {
        const chatDoc = doc(firestore, `users/${userId}/personal/journal/chats/${chatId}`)
        await deleteDoc(chatDoc)
        await loadChats(userId)
        // You'd want to batch-delete messages as well if doing a full wipe
    }

    // Cleanup all listeners (for logout, etc)
    function unsubscribeAll() {
        Object.keys(messageUnsub.value).forEach(chatId => {
            unsubscribeFromMessages(chatId)
        })
    }

    async function updateChatName(userId, chatId, newName) {
        const chatDoc = doc(firestore, `users/${userId}/personal/journal/chats/${chatId}`)
        await updateDoc(chatDoc, { chatName: newName, updatedAt: serverTimestamp() })
        await loadChats(userId)
    }

    return {
        // State
        chats, messages, chatPaging, loadingChats, loadingMessages, messageUnsub,
        // Getters
        activeChats, archivedChats, deletedChats,
        // Actions
        loadChats, loadMessages, createChat, sendMessage, updateChatStatus, hardDeleteChat,
        subscribeToMessages, unsubscribeFromMessages, unsubscribeAll, updateChatName,
        userProfile, loadingProfile, loadUserProfile, saveUserProfile, trySummariseNewChunk,
        getUnchunkedMessages, getChunkSummaries, getLastAImessage, getAllMessages
    }
})
