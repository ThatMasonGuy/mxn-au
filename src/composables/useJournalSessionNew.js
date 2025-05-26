import { useJournalStore } from '@/stores/useJournalSessionStore'
import { httpsCallable } from 'firebase/functions'
import { functions } from '@/firebase' // your Firebase app init

const handleJournalChat = httpsCallable(functions, 'handleJournalChat')

export function useJournalSession() {
    const journal = useJournalStore()

    async function startSession() {
        await journal.fetchInitialContext()
        journal.startSession()
    }

    async function sendMessage(userMessage) {
        journal.addUserMessage(userMessage)

        const payload = {
            packageCode: 'message',
            messages: journal.buildMessagePayload(), // includes system prompt + user/AI messages
        }

        const { data } = await handleJournalChat(payload)
        const reply = data.aiMessage
        journal.addAIMessage(reply)

        return reply
    }

    async function summariseSession() {
        const summaryPayload = {
            packageCode: 'summary',
            messages: journal.buildSummaryPayload(),
        }

        const { data } = await handleJournalChat(summaryPayload)
        return data.summary
    }

    return {
        startSession,
        sendMessage,
        summariseSession,
    }
}
