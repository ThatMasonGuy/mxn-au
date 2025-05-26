import { defineStore } from 'pinia'

export const useJournalStore = defineStore('journal', {
    state: () => ({
        userProfile: null,
        nickname: null,
        timezone: null,
        localTime: null,
        recentUserMessages: [],
        chunkSummaries: [],
        previousEntries: [],
        aiMessages: [],
        sessionStarted: false,
    }),

    actions: {
        async fetchInitialContext() {
            // Replace these with actual Firebase/Redis fetches
            this.userProfile = await getUserProfile()
            this.nickname = await getUserNickname()
            this.timezone = await getUserTimezone()
            this.localTime = new Date().toLocaleString('en-AU', { timeZone: this.timezone })
            this.previousEntries = await getLastJournalSummaries()
            this.chunkSummaries = await getRecentChunkSummaries()
        },

        startSession() {
            this.recentUserMessages = []
            this.aiMessages = []
            this.sessionStarted = true
        },

        addUserMessage(msg) {
            this.recentUserMessages.push(msg)
        },

        addAIMessage(msg) {
            this.aiMessages.push(msg)
        },

        buildMessagePayload() {
            const messages = []

            // Add system prompt
            messages.push({
                role: 'system',
                content: `You are a supportive, friendly AI journaling assistant for ${this.nickname}. Preferences: ${this.userProfile?.preferences || 'unspecified'}.\nLocal time: ${this.localTime}.`
            })

            // Add recent conversation summaries
            this.chunkSummaries.forEach(summary => {
                messages.push({ role: 'system', content: `Context Summary: ${summary}` })
            })

            // Add previous journal entries
            this.previousEntries.forEach(entry => {
                messages.push({ role: 'system', content: `Previous Entry: ${entry.summary}` })
            })

            // Add AI and User messages in order
            this.recentUserMessages.forEach((msg, i) => {
                messages.push({ role: 'user', content: msg })
                if (this.aiMessages[i]) {
                    messages.push({ role: 'assistant', content: this.aiMessages[i] })
                }
            })

            return messages
        },

        buildSummaryPayload() {
            return this.buildMessagePayload() // or slice if you want fewer messages
        }
    }
})
