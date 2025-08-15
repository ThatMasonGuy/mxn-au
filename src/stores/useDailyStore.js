// src/stores/useDailyStore.js - Improved version
import { defineStore } from 'pinia'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useWordleStore } from './dailyGames/useWordleStore'

const REGION = 'australia-southeast1'
const functions = () => getFunctions(undefined, REGION)

export const useDailyStore = defineStore('daily', {
    state: () => ({
        loading: false,
        initialized: false,
        user: null,

        // Combined game stats
        gameStats: {
            wordle: {
                currentStreak: 0,
                maxStreak: 0,
                wins: 0,
                losses: 0,
                totalPlays: 0,
                winPercentage: 0,
                gamesPlayed: 0,
                lastPlayedUTC: null,
                histogram: [0, 0, 0, 0, 0, 0]
            },
            connections: {
                currentStreak: 0,
                maxStreak: 0,
                wins: 0,
                losses: 0,
                totalPlays: 0,
                winPercentage: 0,
                gamesPlayed: 0,
                lastPlayedUTC: null
            },
            flag: {
                currentStreak: 0,
                maxStreak: 0,
                wins: 0,
                losses: 0,
                totalPlays: 0,
                winPercentage: 0,
                gamesPlayed: 0,
                lastPlayedUTC: null
            },
            trivia: {
                currentStreak: 0,
                maxStreak: 0,
                wins: 0,
                losses: 0,
                totalPlays: 0,
                winPercentage: 0,
                gamesPlayed: 0,
                lastPlayedUTC: null
            },
            sequence: {
                currentStreak: 0,
                maxStreak: 0,
                wins: 0,
                losses: 0,
                totalPlays: 0,
                winPercentage: 0,
                gamesPlayed: 0,
                lastPlayedUTC: null
            },
            memory: {
                currentStreak: 0,
                maxStreak: 0,
                wins: 0,
                losses: 0,
                totalPlays: 0,
                winPercentage: 0,
                gamesPlayed: 0,
                lastPlayedUTC: null
            }
        },

        // Today's completion status
        dailyStatus: {
            wordle: 'not-started',
            connections: 'not-started',
            flag: 'not-started',
            trivia: 'not-started',
            sequence: 'not-started',
            memory: 'not-started'
        },

        // General daily info
        rolloverAt: null,
        lastUpdated: null
    }),

    getters: {
        // Overall stats
        totalCompletedToday: (state) => {
            const completed = Object.values(state.dailyStatus).filter(status => status === 'won').length
            return completed
        },

        totalStreakSum: (state) => {
            const sum = Object.values(state.gameStats).reduce((sum, game) => sum + game.currentStreak, 0)
            return sum
        },

        totalDaysPlayed: (state) => {
            const max = Math.max(...Object.values(state.gameStats).map(game => game.totalPlays))
            return max
        },

        averageWinRate: (state) => {
            const games = Object.values(state.gameStats).filter(game => game.totalPlays > 0)
            if (games.length === 0) return 0
            const totalWinRate = games.reduce((sum, game) => sum + game.winPercentage, 0)
            const avg = Math.round(totalWinRate / games.length)
            return avg
        },

        // Individual game getters
        wordleStats: (state) => state.gameStats.wordle,
        connectionsStats: (state) => state.gameStats.connections,
        flagStats: (state) => state.gameStats.flag,
        triviaStats: (state) => state.gameStats.trivia,
        sequenceStats: (state) => state.gameStats.sequence,
        memoryStats: (state) => state.gameStats.memory,

        // Status getters
        getGameStatus: (state) => (gameId) => state.dailyStatus[gameId] || 'not-started',
        isGameCompleted: (state) => (gameId) => ['won', 'lost'].includes(state.dailyStatus[gameId])
    },

    actions: {
        // Initialize auth listener and load all stats
        async initializeGames() {
            if (this.initialized) return

            this.loading = true

            // Set up auth listener
            const auth = getAuth()
            onAuthStateChanged(auth, async (user) => {
                this.user = user
                if (user) {
                    await this.loadAllStats()
                }
            })

            // Load stats for current user
            await this.loadAllStats()

            this.initialized = true
            this.loading = false
        },

        // Load all game statistics from server
        async loadAllStats() {
            try {
                const auth = getAuth()
                if (!auth.currentUser) {
                    await this.loadGuestStats()
                    return
                }

                // Call server function to get all daily game stats
                const call = httpsCallable(functions(), 'getAllDailyStats')
                const { data } = await call()

                // Update game stats
                if (data.gameStats) {
                    Object.keys(data.gameStats).forEach(gameId => {
                        if (this.gameStats[gameId]) {
                            this.gameStats[gameId] = { ...this.gameStats[gameId], ...data.gameStats[gameId] }
                        }
                    })
                }

                // Update daily status
                if (data.dailyStatus) {
                    this.dailyStatus = { ...this.dailyStatus, ...data.dailyStatus }
                }

                // Update rollover time
                if (data.rolloverAt) {
                    this.rolloverAt = data.rolloverAt
                }

                // Sync Wordle store with loaded stats
                const wordleStore = useWordleStore()
                wordleStore.profile = this.gameStats.wordle

                this.lastUpdated = Date.now()

            } catch (error) {
                console.warn('Error loading daily stats:', error)
                await this.loadGuestStats()
            }
        },

        // Load stats for guest users from individual stores
        async loadGuestStats() {
            const wordleStore = useWordleStore()

            // Wait a bit if Wordle store is still loading
            if (wordleStore.loading) {
                await new Promise(resolve => {
                    const checkLoaded = () => {
                        if (!wordleStore.loading) {
                            resolve()
                        } else {
                            setTimeout(checkLoaded, 100)
                        }
                    }
                    checkLoaded()
                })
            }

            // Get Wordle stats from its store if available
            if (wordleStore.profile) {
                this.gameStats.wordle = { ...this.gameStats.wordle, ...wordleStore.profile }
            } else {

            }

            // Get Wordle status from its store
            if (wordleStore.status) {
                this.dailyStatus.wordle = wordleStore.status
            } else {

            }

            // Set rollover time from Wordle store
            if (wordleStore.rolloverAt) {
                this.rolloverAt = wordleStore.rolloverAt
            }
        },

        // Method to force refresh guest stats (call this after Wordle store updates)
        async refreshGuestStats() {
            if (this.user) return // Only for guests
            await this.loadGuestStats()
        },

        // Update individual game stats (called by game stores when games complete)
        updateGameStats(gameId, newStats) {
            if (this.gameStats[gameId]) {
                this.gameStats[gameId] = { ...this.gameStats[gameId], ...newStats }
            }
        },

        // Update game completion status
        updateGameStatus(gameId, status) {
            this.dailyStatus[gameId] = status
        },

        // Refresh all stats (called after rollover or manual refresh)
        async refreshAllStats() {
            this.lastUpdated = null
            await this.loadAllStats()
        },

        // Get stats for a specific game
        getStatsFor(gameId) {
            return this.gameStats[gameId] || null
        },

        // Check if it's time for rollover
        async checkRollover() {
            if (!this.rolloverAt) return false

            const now = Date.now()
            const rolloverTime = Date.parse(this.rolloverAt)

            if (now >= rolloverTime) {
                // Reset daily status for new day
                Object.keys(this.dailyStatus).forEach(gameId => {
                    this.dailyStatus[gameId] = 'not-started'
                })

                // Refresh stats from server
                await this.refreshAllStats()
                return true
            }

            return false
        }
    },

    persist: {
        key: 'mxn:daily:combined',
        paths: ['gameStats', 'dailyStatus', 'rolloverAt', 'lastUpdated'],
        storage: localStorage
    }
})