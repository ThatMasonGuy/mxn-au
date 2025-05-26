// /composables/useSendJournalMessage.js
import { ref, nextTick } from 'vue'
import { useMainStore } from '@/stores/useMainStore'
import { useJournalChatStore } from '@/stores/useJournalChatStore'
import { useSummaryManifest } from '@/composables/useSummaryManifest'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getUserTimezone } from '@/utils/timezone'
import { useTokenTracker } from '@/composables/useTokenTracker.js'

const { trackTokenUsage } = useTokenTracker()
const functions = getFunctions(undefined, 'australia-southeast1')
const handleJournalChat = httpsCallable(functions, 'handleJournalChat')

export function useSendJournalMessage(chatLayoutRef, selectedChatId, newMessage, isThinking) {
    const mainStore = useMainStore()
    const chatStore = useJournalChatStore()
    const { getRecentSummaries } = useSummaryManifest()

    const cachedSummaries = ref({}) // chatId → summary[] map

    const handleSendMessage = async (messageContent) => {
        const trimmedMessage = messageContent.trim()
        if (!trimmedMessage || isThinking.value) return
        if (!mainStore.user?.uid) {
            console.error('User not logged in, cannot send message.')
            return
        }

        if (!selectedChatId.value) {
            console.error('No chat selected. Cannot send message.')
            return
        }

        isThinking.value = true
        newMessage.value = ''
        chatLayoutRef.value?.clearInput()

        const userId = mainStore.user.uid
        const chatId = selectedChatId.value

        try {
            // 1. Save user message
            await chatStore.sendMessage(userId, chatId, {
                content: trimmedMessage,
                sender: 'user'
            })

            // 2. Load context
            const recentChunks = await chatStore.getChunkSummaries(userId, chatId)
            const recentUnchunked = await chatStore.getUnchunkedMessages(userId, chatId)
            const lastAI = chatStore.getLastAImessage(chatId)
            const profile = chatStore.userProfile?.profile || 'No profile.'
            const nickname = chatStore.userProfile?.displayName || 'User'
            const timezone = getUserTimezone()
            const localTime = new Date().toLocaleString('en-AU', { timeZone: timezone })

            // 3. Load + cache summaries
            if (!cachedSummaries.value[chatId]) {
                try {
                    const summaries = await getRecentSummaries(userId, 5)
                    cachedSummaries.value[chatId] = summaries
                } catch (e) {
                    console.warn('⚠️ Could not load context summaries:', e)
                    cachedSummaries.value[chatId] = []
                }
            }

            // 4. Call OpenAI
            const { data: aiResponse } = await handleJournalChat({
                packageCode: 'message',
                messages: recentUnchunked.map(m => ({
                    role: m.sender === 'ai' ? 'assistant' : 'user',
                    content: m.content
                })),
                chunks: recentChunks,
                summaries: cachedSummaries.value[chatId],
                profile,
                userName: nickname,
                timezone,
                localTime,
                lastAImessage: lastAI
            })

            // 5. Save AI message
            await chatStore.sendMessage(userId, chatId, {
                content: aiResponse.aiMessage,
                sender: 'ai',
                tokenUsage: aiResponse.tokenUsage || null
            })

            await trackTokenUsage({
                userId,
                chatId,
                tokenUsage: aiResponse.tokenUsage || null,
                modelUsed: 'gpt-4.1-mini',
                type: 'message'
            })

            // 6. Try to chunk new content
            await chatStore.trySummariseNewChunk(userId, chatId)

        } catch (err) {
            console.error('Error during message send or AI response:', err)
            newMessage.value = trimmedMessage
        } finally {
            isThinking.value = false
            nextTick(() => {
                chatLayoutRef.value?.scrollToBottom()
                chatLayoutRef.value?.focusInput()
            })
        }
    }

    return {
        handleSendMessage
    }
}
