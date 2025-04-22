// topheroesStore.js
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '@/firebase'

const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

const makeStorageKey = (eventId) => `event_data_${eventId}`
const makeTimestampKey = (eventId) => `event_data_${eventId}_timestamp`

export const topheroes = {
    namespaced: true,

    state: () => ({
        currentEvent: null,
        isLoading: false,
        error: null,
        lastUpdated: null
    }),

    getters: {
        eventSections: (state) => state.currentEvent?.sections || [],

        eventMeta: (state) => ({
            title: state.currentEvent?.title || '',
            byline: state.currentEvent?.byline || '',
            color: state.currentEvent?.color || '',
            resetTime: state.currentEvent?.resetTime || ''
        }),

        isCacheStale: (state) => {
            if (!state.lastUpdated) return true
            const now = Date.now()
            return (now - state.lastUpdated) > CACHE_EXPIRY
        }
    },

    mutations: {
        SET_DATA(state, data) {
            state.currentEvent = data
            state.lastUpdated = Date.now()
        },
        SET_LOADING(state, status) {
            state.isLoading = status
        },
        SET_ERROR(state, error) {
            state.error = error
        },
        CLEAR_CACHE(state) {
            state.currentEvent = null
            state.lastUpdated = null
        },
        SET_LAST_UPDATED(state, timestamp) {
            state.lastUpdated = timestamp
        }
    },

    actions: {
        async loadEventData({ commit }, { eventId, forceRefresh = false }) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            const storageKey = makeStorageKey(eventId)
            const timestampKey = makeTimestampKey(eventId)

            try {
                if (!forceRefresh) {
                    const cached = sessionStorage.getItem(storageKey)
                    const timestamp = sessionStorage.getItem(timestampKey)

                    if (cached && timestamp && (Date.now() - parseInt(timestamp)) <= CACHE_EXPIRY) {
                        commit('SET_DATA', JSON.parse(cached))
                        commit('SET_LAST_UPDATED', parseInt(timestamp))
                        commit('SET_LOADING', false)
                        return
                    }
                }

                const ref = doc(firestore, 'topheroes/general/events', eventId)
                const snap = await getDoc(ref)

                if (!snap.exists()) throw new Error(`Event guide "${eventId}" not found in Firestore`)

                const data = snap.data()
                const now = Date.now()

                commit('SET_DATA', data)
                commit('SET_LAST_UPDATED', now)

                sessionStorage.setItem(storageKey, JSON.stringify(data))
                sessionStorage.setItem(timestampKey, now.toString())
            } catch (err) {
                console.error(`❌ ${eventId} Load Error:`, err)
                commit('SET_ERROR', err.message || `Failed to load ${eventId} guide`)
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async clearCachedEvent({ commit }, eventId) {
            sessionStorage.removeItem(makeStorageKey(eventId))
            sessionStorage.removeItem(makeTimestampKey(eventId))
            commit('CLEAR_CACHE')
        }
    }
}
