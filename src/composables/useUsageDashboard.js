import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { calculateOpenAICost } from '@/utils/costs'

export async function getUsageSummary(userId, timeframe = '7d') {
    const now = new Date()
    let threshold = null

    if (timeframe === '1d') threshold = new Date(now - 1000 * 60 * 60 * 24)
    else if (timeframe === '7d') threshold = new Date(now - 1000 * 60 * 60 * 24 * 7)
    else if (timeframe === '30d') threshold = new Date(now - 1000 * 60 * 60 * 24 * 30)

    const chatCol = collection(firestore, `users/${userId}/personal/journal/chats`)
    const snap = await getDocs(chatCol)

    let totalSpent = 0
    const perChat = []

    for (const doc of snap.docs) {
        const data = doc.data()
        const lastTime = data.lastMessageTime?.toDate?.() ?? new Date(0)

        if (!threshold || lastTime >= threshold) {
            const input = data.tokenStats?.inputTokens || 0
            const output = data.tokenStats?.outputTokens || 0
            const cost = calculateOpenAICost({ input, output })

            perChat.push({
                chatId: doc.id,
                chatName: data.chatName || 'Unnamed Chat',
                input,
                output,
                total: input + output,
                cost,
                lastMessage: data.lastMessage,
                status: data.status,
                lastMessageTime: data.lastMessageTime
            })

            totalSpent += cost
        }
    }

    perChat.sort((a, b) => b.cost - a.cost)

    return {
        totalSpent,
        remaining: Math.max(0, 5 - totalSpent),
        perChat
    }
}

