// /composables/useSummaryManifest.js
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { getDocs, collection } from 'firebase/firestore'

export function useSummaryManifest() {
    // 🔁 Update the manifest after saving a summary
    async function updateManifest(userId, chatId, summaryId, summaryData) {
        const manifestRef = doc(firestore, `users/${userId}/personal/journal/meta/summaryManifest`)
        const manifestSnap = await getDoc(manifestRef)

        const newEntry = {
            chatId,
            summaryId,
            generatedAt: new Date(),
            tone: summaryData.tone || '',
            topics: summaryData.topics || []
        }

        const existing = manifestSnap.exists() ? manifestSnap.data().recentSummaries || [] : []

        // Prevent duplicates and maintain order
        const filtered = existing.filter(e => e.summaryId !== summaryId)
        const updated = [newEntry, ...filtered].slice(0, 5)

        await setDoc(manifestRef, { recentSummaries: updated }, { merge: true })
    }

    // 🔍 Get the last N full summary docs
    async function getRecentSummaries(userId, n = 5) {
        const manifestRef = doc(firestore, `users/${userId}/personal/journal/meta/summaryManifest`)
        const manifestSnap = await getDoc(manifestRef)

        if (!manifestSnap.exists()) return []

        const summaries = manifestSnap.data().recentSummaries || []
        const limited = summaries.slice(0, n)

        const results = []
        for (const entry of limited) {
            const summaryDocRef = doc(firestore, `users/${userId}/personal/journal/chats/${entry.chatId}/summary/${entry.summaryId}`)
            const snap = await getDoc(summaryDocRef)
            if (snap.exists()) {
                results.push(snap.data())
            }
        }

        return results
    }

    return {
        updateManifest,
        getRecentSummaries
    }
}
