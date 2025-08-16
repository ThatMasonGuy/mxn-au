// src/stores/useDailyStore.js - Fixed version with Firebase listeners
import { defineStore } from 'pinia'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { firestore } from '@/firebase'
import { doc, onSnapshot, collection } from 'firebase/firestore'
import { useWordleStore } from './dailyGames/useWordleStore'

const REGION = 'australia-southeast1'
const functions = () => getFunctions(undefined, REGION)

function dateStrUTC(d = new Date()) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

export const useDailyStore = defineStore('daily', {
    state: () => ({
        loading: false,
        initialized: false,
        user: null,
        _unsubscribers: [], // Store all listener unsubscribers

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
        // Clean up all listeners
        _cleanupListeners() {
            this._unsubscribers.forEach(unsub => {
                if (typeof unsub === 'function') unsub()
            })
            this._unsubscribers = []
        },

        // Set up Firebase listeners for a specific game
        _setupGameListener(userId, gameId) {
            // Listen to the game's profile/stats document
            const profileRef = doc(firestore, 'users', userId, 'dailyChallenges', gameId)
            const unsubProfile = onSnapshot(profileRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data()

                    // Update game stats
                    this.gameStats[gameId] = {
                        currentStreak: data.currentStreak || 0,
                        maxStreak: data.maxStreak || 0,
                        wins: data.wins || 0,
                        losses: data.losses || 0,
                        totalPlays: data.totalPlays || 0,
                        winPercentage: data.totalPlays ? Math.round((data.wins / data.totalPlays) * 100) : 0,
                        gamesPlayed: data.totalPlays || 0,
                        lastPlayedUTC: data.lastPlayedUTC || null,
                        histogram: gameId === 'wordle' && data.attemptsHistogram ?
                            [1, 2, 3, 4, 5, 6].map(i => data.attemptsHistogram[String(i)] || 0) :
                            (this.gameStats[gameId].histogram || undefined)
                    }

                    // Update today's status based on last played date
                    const today = dateStrUTC()
                    if (data.lastPlayedUTC === today) {
                        // Check today's game document for actual status
                        const todayRef = doc(firestore, 'users', userId, 'dailyChallenges', gameId, 'days', today)
                        const unsubToday = onSnapshot(todayRef, (todaySnap) => {
                            if (todaySnap.exists()) {
                                const todayData = todaySnap.data()
                                if (todayData.outcome === 'win') {
                                    this.dailyStatus[gameId] = 'won'
                                } else if (todayData.outcome === 'loss') {
                                    this.dailyStatus[gameId] = 'lost'
                                } else if (todayData.outcome === 'in_progress') {
                                    this.dailyStatus[gameId] = 'in-progress'
                                }
                            }
                        })
                        this._unsubscribers.push(unsubToday)
                    } else {
                        this.dailyStatus[gameId] = 'not-started'
                    }

                    this.lastUpdated = Date.now()
                }
            })

            this._unsubscribers.push(unsubProfile)
        },

        // Initialize auth listener and load all stats
        async initializeGames() {
            if (this.initialized) return

            this.loading = true

            // Clean up any existing listeners
            this._cleanupListeners()

            // Set up auth listener
            const auth = getAuth()
            onAuthStateChanged(auth, async (user) => {
                this.user = user

                // Clean up old listeners when auth changes
                this._cleanupListeners()

                if (user) {
                    // Set up listeners for each game
                    const gameIds = ['wordle', 'connections', 'flag', 'trivia', 'sequence', 'memory']
                    gameIds.forEach(gameId => {
                        this._setupGameListener(user.uid, gameId)
                    })

                    // Initial load from server to get rollover time
                    try {
                        const call = httpsCallable(functions(), 'getAllDailyStats')
                        const { data } = await call()
                        if (data.rolloverAt) {
                            this.rolloverAt = data.rolloverAt
                        }
                    } catch (error) {
                        console.warn('Error loading initial daily stats:', error)
                    }
                } else {
                    // Guest user - load from local stores
                    await this.loadGuestStats()
                }
            })

            // Set up rollover time
            const tomorrow = new Date()
            tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
            tomorrow.setUTCHours(0, 0, 0, 0)
            this.rolloverAt = tomorrow.toISOString()

            this.initialized = true
            this.loading = false
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
            }

            // Get Wordle status from its store
            if (wordleStore.status) {
                this.dailyStatus.wordle = wordleStore.status
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

                // Update rollover time to next midnight
                const tomorrow = new Date()
                tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
                tomorrow.setUTCHours(0, 0, 0, 0)
                this.rolloverAt = tomorrow.toISOString()

                return true
            }

            return false
        },

        // Clean up when store is destroyed
        $dispose() {
            this._cleanupListeners()
        }
    },

    persist: {
        key: 'mxn:daily:combined',
        paths: ['gameStats', 'dailyStatus', 'rolloverAt', 'lastUpdated'],
        storage: localStorage
    }
})