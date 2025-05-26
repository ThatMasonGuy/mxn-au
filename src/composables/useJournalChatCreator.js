// /composables/useJournalChatCreator.js
import { useMainStore } from '@/stores/useMainStore'
import { useJournalChatStore } from '@/stores/useJournalChatStore'
import { useChatSummariser } from '@/composables/useChatSummariser'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { useSummaryManifest } from '@/composables/useSummaryManifest'
import { useTokenTracker } from '@/composables/useTokenTracker.js'

const { trackTokenUsage } = useTokenTracker()
const { getRecentSummaries } = useSummaryManifest()
const { updateManifest } = useSummaryManifest()
const functions = getFunctions(undefined, 'australia-southeast1')
const handleJournalChat = httpsCallable(functions, 'handleJournalChat')

export function useJournalChatCreator() {
    const mainStore = useMainStore()
    const chatStore = useJournalChatStore()
    const { summariseFullChat } = useChatSummariser()

    const createNewChat = async () => {
        if (!mainStore.user?.uid) {
            console.error('User not logged in')
            return null
        }

        try {
            if (!chatStore.userProfile?.uid) {
                await chatStore.loadUserProfile(mainStore.user.uid)
            }

            const profile = chatStore.userProfile?.profile || 'No user profile set.'
            const name = chatStore.userProfile?.displayName || mainStore.user?.userName || mainStore.user?.email || 'Goblin'

            // Load most recent chat
            await chatStore.loadChats(mainStore.user.uid, 'active', 1)
            const latestChat = chatStore.activeChats[0]

            let priorSummary = null
            if (latestChat?.chatId) {
                try {
                    const result = await summariseFullChat(mainStore.user.uid, latestChat.chatId)
                    priorSummary = result?.priorSummary
                } catch (e) {
                    console.warn('⚠️ Failed to summarise last chat, continuing without:', e?.message ?? e)
                }
            }

            const recentSummaries = await getRecentSummaries(mainStore.user.uid, 5)
            const allSummaries = priorSummary
                ? [priorSummary, ...recentSummaries]
                : recentSummaries

            const { data: aiResponse } = await handleJournalChat({
                packageCode: 'newChat',
                userName: name,
                profile,
                summaries: allSummaries.slice(0, 5)
            })

            if (!aiResponse || !aiResponse.chatTitle || !aiResponse.welcomeMessage) {
                throw new Error('AI did not return a valid title and welcome message.')
            }

            const newChatId = await chatStore.createChat(mainStore.user.uid, aiResponse.chatTitle)
            await chatStore.sendMessage(mainStore.user.uid, newChatId, {
                content: aiResponse.welcomeMessage,
                sender: 'ai',
                tokenUsage: aiResponse.tokenUsage || null,
            })

            await trackTokenUsage({
                userId,
                chatId,
                tokenUsage: aiResponse.tokenUsage || null,
                modelUsed: 'gpt-4.1-mini',
                type: 'message'
            })

            return {
                chatId: newChatId,
                title: aiResponse.chatTitle,
                welcome: aiResponse.welcomeMessage
            }

        } catch (err) {
            console.error('❌ Failed to create new chat:', err)
            throw err
        }
    }

    return {
        createNewChat
    }
}
