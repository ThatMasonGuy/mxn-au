// /composables/useChatSummariser.js
import { useJournalChatStore } from '@/stores/useJournalChatStore'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { firestore } from '@/firebase'
import { doc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore'
import { useSummaryManifest } from '@/composables/useSummaryManifest'
import { useTokenTracker } from '@/composables/useTokenTracker.js'

const { trackTokenUsage } = useTokenTracker()
const { updateManifest } = useSummaryManifest()
const functions = getFunctions(undefined, 'australia-southeast1')
const handleJournalChat = httpsCallable(functions, 'handleJournalChat')

export function useChatSummariser() {
    const chatStore = useJournalChatStore()

    async function summariseFullChat(userId, chatId) {
        const msgRef = collection(firestore, `users/${userId}/personal/journal/chats/${chatId}/messages`)
        const msgSnap = await getDocs(query(msgRef, orderBy('createdAt')))
        const messages = msgSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        if (!messages || messages.length === 0) throw new Error('No messages to summarise.')

        const formatted = messages.map((m) => ({
            role: m.sender === 'ai' ? 'assistant' : 'user',
            content: m.content
        }))

        const summaryMetadata = {
            chatId,
            totalMessages: messages.length,
            summaryPromptVersion: 'v1',
            modelUsed: 'gpt-4.1-mini'
        }

        const { data } = await handleJournalChat({
            packageCode: 'summaryFull',
            messages: formatted,
            metadata: summaryMetadata
        })

        const summaryDoc = {
            ...data,
            ...summaryMetadata,
            tokenUsage: data.tokenUsage || null,
            generatedAt: serverTimestamp()
        }

        await trackTokenUsage({
            userId,
            chatId,
            tokenUsage: data.tokenUsage || null,
            modelUsed: 'gpt-4.1-mini',
            type: 'message'
        })

        const summaryRef = collection(firestore, `users/${userId}/personal/journal/chats/${chatId}/summary`)
        const docRef = await addDoc(summaryRef, summaryDoc)

        await updateManifest(userId, chatId, docRef.id, data)

        return {
            summaryId: docRef.id,
            firestoreSummary: summaryDoc,
            priorSummary: {
                summary: data.summary,
                moods: data.moods,
                topics: data.topics,
                tone: data.tone,
                keywords: data.keywords,
                memories: data.memories,
                insights: data.insights
            }
        }
    }

    return {
        summariseFullChat
    }
}
