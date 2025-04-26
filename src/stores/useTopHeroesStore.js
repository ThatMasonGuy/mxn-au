// @/stores/useTopHeroesStore.js
import { defineStore } from 'pinia'
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '@/firebase'

const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

const makeStorageKey = (eventId) => `event_data_${eventId}`
const makeTimestampKey = (eventId) => `event_data_${eventId}_timestamp`

export const useTopHeroesStore = defineStore('topheroes', {
    state: () => ({
        currentEvent: null,
        isLoading: false,
        error: null,
        lastUpdated: null,
    }),

    getters: {
        eventSections: (state) => state.currentEvent?.sections || [],
        eventMeta: (state) => ({
            title: state.currentEvent?.title || '',
            byline: state.currentEvent?.byline || '',
            color: state.currentEvent?.color || '',
            resetTime: state.currentEvent?.resetTime || '',
        }),
        isCacheStale: (state) => {
            if (!state.lastUpdated) return true
            return (Date.now() - state.lastUpdated) > CACHE_EXPIRY
        },
    },

    actions: {
        async loadEventData(eventId, forceRefresh = false) {
            this.isLoading = true
            this.error = null

            const storageKey = makeStorageKey(eventId)
            const timestampKey = makeTimestampKey(eventId)

            try {
                if (!forceRefresh) {
                    const cached = sessionStorage.getItem(storageKey)
                    const timestamp = sessionStorage.getItem(timestampKey)

                    if (cached && timestamp && (Date.now() - parseInt(timestamp)) <= CACHE_EXPIRY) {
                        this.currentEvent = JSON.parse(cached)
                        this.lastUpdated = parseInt(timestamp)
                        this.isLoading = false
                        return
                    }
                }

                const ref = doc(firestore, 'topheroes/general/events', eventId)
                const snap = await getDoc(ref)

                if (!snap.exists()) {
                    throw new Error(`Event guide "${eventId}" not found in Firestore`)
                }

                const data = snap.data()
                const now = Date.now()

                this.currentEvent = data
                this.lastUpdated = now

                sessionStorage.setItem(storageKey, JSON.stringify(data))
                sessionStorage.setItem(timestampKey, now.toString())
            } catch (err) {
                console.error(`❌ ${eventId} Load Error:`, err)
                this.error = err.message || `Failed to load ${eventId} guide`
            } finally {
                this.isLoading = false
            }
        },

        async clearCachedEvent(eventId) {
            sessionStorage.removeItem(makeStorageKey(eventId))
            sessionStorage.removeItem(makeTimestampKey(eventId))
            this.currentEvent = null
            this.lastUpdated = null
        },
    },

    persist: {
        paths: ['currentEvent', 'lastUpdated'],
    },
})
