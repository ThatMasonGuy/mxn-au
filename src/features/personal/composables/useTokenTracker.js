// /composables/useTokenTracker.js
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { firestore } from '@/firebase'

export function useTokenTracker() {
    async function trackTokenUsage({ userId, chatId, tokenUsage = {}, modelUsed = 'unknown', type = 'message' }) {
        if (!userId || !chatId || !tokenUsage.total_tokens) {
            console.warn('🟡 Skipping token usage tracking — missing required data.')
            return
        }

        const chatRef = doc(firestore, `users/${userId}/personal/journal/chats/${chatId}`)
        const chatSnap = await getDoc(chatRef)

        const existing = chatSnap.exists() ? chatSnap.data().tokenStats || {} : {}

        const updated = {
            totalTokens: (existing.totalTokens || 0) + (tokenUsage.total_tokens || 0),
            inputTokens: (existing.inputTokens || 0) + (tokenUsage.prompt_tokens || 0),
            outputTokens: (existing.outputTokens || 0) + (tokenUsage.completion_tokens || 0),
            lastUpdated: serverTimestamp(),
            perModel: {
                ...existing.perModel,
                [modelUsed]: {
                    total: (existing.perModel?.[modelUsed]?.total || 0) + tokenUsage.total_tokens,
                    input: (existing.perModel?.[modelUsed]?.input || 0) + (tokenUsage.prompt_tokens || 0),
                    output: (existing.perModel?.[modelUsed]?.output || 0) + (tokenUsage.completion_tokens || 0),
                    lastUsed: serverTimestamp()
                }
            },
            lastInteractionType: type
        }

        await updateDoc(chatRef, {
            tokenStats: updated
        })
    }

    return {
        trackTokenUsage
    }
}
