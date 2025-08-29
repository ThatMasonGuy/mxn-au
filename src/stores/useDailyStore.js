// src/stores/useDailyStore.js - Refactored without getAllDailyStats
import { defineStore } from 'pinia'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { firestore } from '@/firebase'
import { doc, onSnapshot, getDoc } from 'firebase/firestore'

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

        // Combined game stats (populated by individual game stores)
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
                lastPlayedUTC: null,
                perfectGames: 0,
                averageMistakes: 0
            },
            flag: {
                currentStreak: 0,
                maxStreak: 0,
                wins: 0,
                losses: 0,
                totalPlays: 0,
                winPercentage: 0,
                gamesPlayed: 0,
                lastPlayedUTC: null,
                totalScore: 0,
                averageScore: 0
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

        // Wordle Unlimited stats (separate from daily games)
        wordleUnlimitedStats: {
            currentStreak: 0,
            maxStreak: 0,
            wins: 0,
            losses: 0,
            totalPlayed: 0,
            winPercentage: 0,
            lastPlayedAt: null,
            attemptsHistogram: [0, 0, 0, 0, 0, 0]
        },

        // Today's completion status (set by individual game stores)
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
            const profileRef = doc(firestore, 'users', userId, 'dailyChallenges', gameId)
            const unsubProfile = onSnapshot(profileRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data()

                    // Update game stats with proper mapping
                    this.gameStats[gameId] = {
                        currentStreak: data.currentStreak || 0,
                        maxStreak: data.maxStreak || 0,
                        wins: data.wins || 0,
                        losses: data.losses || 0,
                        totalPlays: data.totalPlays || 0,
                        winPercentage: data.totalPlays ? Math.round((data.wins / data.totalPlays) * 100) : 0,
                        gamesPlayed: data.totalPlays || 0,
                        lastPlayedUTC: data.lastPlayedUTC || null
                    }

                    // Add game-specific stats
                    if (gameId === 'wordle' && data.attemptsHistogram) {
                        this.gameStats[gameId].histogram = [1, 2, 3, 4, 5, 6].map(i => data.attemptsHistogram[String(i)] || 0)
                    }
                    if (gameId === 'connections') {
                        this.gameStats[gameId].perfectGames = data.perfectGames || 0
                        this.gameStats[gameId].averageMistakes = data.averageMistakes || 0
                    }
                    if (gameId === 'flag') {
                        this.gameStats[gameId].totalScore = data.totalScore || 0
                        this.gameStats[gameId].averageScore = data.averageScore || 0
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

        // Set up listener for Wordle Unlimited (different structure)
        _setupWordleUnlimitedListener(userId) {
            const profileRef = doc(firestore, 'users', userId, 'dailyChallenges', 'wordle-unlimited')
            const unsubProfile = onSnapshot(profileRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data()

                    this.wordleUnlimitedStats = {
                        currentStreak: data.currentStreak || 0,
                        maxStreak: data.maxStreak || 0,
                        wins: data.wins || 0,
                        losses: data.losses || 0,
                        totalPlayed: data.totalPlayed || 0,
                        winPercentage: data.totalPlayed ? Math.round((data.wins / data.totalPlayed) * 100) : 0,
                        lastPlayedAt: data.lastPlayedAt || null,
                        attemptsHistogram: data.attemptsHistogram ?
                            [1, 2, 3, 4, 5, 6].map(i => data.attemptsHistogram[String(i)] || 0) :
                            [0, 0, 0, 0, 0, 0]
                    }

                    this.lastUpdated = Date.now()
                }
            })

            this._unsubscribers.push(unsubProfile)
        },

        // Force re-initialization (useful for development/testing)
        async forceRefresh() {
            this.initialized = false
            await this.initializeGames()
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
                    // Read all game stats directly from Firestore
                    await this.loadAllGameStats(user.uid)

                    // Set up real-time listeners for updates (optional - for live updates)
                    const gameIds = ['wordle', 'connections', 'flag', 'trivia', 'sequence', 'memory']
                    gameIds.forEach(gameId => {
                        this._setupGameListener(user.uid, gameId)
                    })
                    this._setupWordleUnlimitedListener(user.uid)
                } else {
                    // Guest user - no Firestore access
                    await this.loadGuestStats()
                }
            })

            // Set up rollover time to next midnight
            const tomorrow = new Date()
            tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
            tomorrow.setUTCHours(0, 0, 0, 0)
            this.rolloverAt = tomorrow.toISOString()

            this.initialized = true
            this.loading = false
        },

        // Load stats for guest users from individual stores
        async loadGuestStats() {
            try {
                // Read persisted data directly from localStorage for each game
                const gameStoreKeys = {
                    'wordle': 'mxn:daily:wordle',
                    'connections': 'mxn:daily:connections',
                    'flag': 'mxn:daily:flagle'
                }

                Object.entries(gameStoreKeys).forEach(([gameId, storageKey]) => {
                    try {
                        const stored = localStorage.getItem(storageKey)
                        if (stored) {
                            const data = JSON.parse(stored)
                            const profile = data.profile

                            if (profile) {
                                this.gameStats[gameId] = {
                                    currentStreak: profile.currentStreak || 0,
                                    maxStreak: profile.maxStreak || 0,
                                    wins: profile.wins || 0,
                                    losses: profile.losses || 0,
                                    totalPlays: profile.totalPlays || profile.gamesPlayed || 0,
                                    winPercentage: profile.winPercentage || 0,
                                    gamesPlayed: profile.gamesPlayed || profile.totalPlays || 0,
                                    lastPlayedUTC: profile.lastPlayedUTC || null
                                }

                                // Add game-specific stats
                                if (gameId === 'wordle' && profile.histogram) {
                                    this.gameStats[gameId].histogram = profile.histogram
                                }
                                if (gameId === 'connections') {
                                    this.gameStats[gameId].perfectGames = profile.perfectGames || 0
                                    this.gameStats[gameId].averageMistakes = profile.averageMistakes || 0
                                }
                                if (gameId === 'flag') {
                                    this.gameStats[gameId].totalScore = profile.totalScore || 0
                                    this.gameStats[gameId].averageScore = profile.averageScore || 0
                                }
                            }
                        }
                    } catch (error) {
                        console.warn(`Error reading ${gameId} guest stats:`, error)
                    }
                })

                // Read Wordle Unlimited stats
                try {
                    const stored = localStorage.getItem('mxn:wordle-unlimited')
                    if (stored) {
                        const data = JSON.parse(stored)
                        const profile = data.profile

                        if (profile) {
                            this.wordleUnlimitedStats = {
                                currentStreak: profile.currentStreak || 0,
                                maxStreak: profile.maxStreak || 0,
                                wins: profile.wins || 0,
                                losses: profile.losses || 0,
                                totalPlayed: profile.totalPlayed || 0,
                                winPercentage: profile.winPercentage || 0,
                                lastPlayedAt: profile.lastPlayedAt || null,
                                attemptsHistogram: profile.attemptsHistogram || [0, 0, 0, 0, 0, 0]
                            }
                        }
                    }
                } catch (error) {
                    console.warn('Error reading Wordle Unlimited guest stats:', error)
                }

            } catch (error) {
                console.warn('Error loading guest stats:', error)
            }
        },

        // Method to force refresh guest stats (called by game stores)
        async refreshGuestStats() {
            if (this.user) return // Only for guests
            await this.loadGuestStats()
        },

        // Load all game stats directly from Firestore
        async loadAllGameStats(userId) {
            if (!userId) return

            try {
                const gameIds = ['wordle', 'connections', 'flag', 'trivia', 'sequence', 'memory']

                // Read all game profiles in parallel
                const profilePromises = gameIds.map(async (gameId) => {
                    const profileRef = doc(firestore, 'users', userId, 'dailyChallenges', gameId)
                    const profileSnap = await getDoc(profileRef)
                    return { gameId, data: profileSnap.exists() ? profileSnap.data() : null }
                })

                // Also get Wordle Unlimited
                const wordleUnlimitedPromise = (async () => {
                    const profileRef = doc(firestore, 'users', userId, 'dailyChallenges', 'wordle-unlimited')
                    const profileSnap = await getDoc(profileRef)
                    return { gameId: 'wordle-unlimited', data: profileSnap.exists() ? profileSnap.data() : null }
                })()

                const results = await Promise.all([...profilePromises, wordleUnlimitedPromise])

                // Process results
                results.forEach(({ gameId, data }) => {
                    if (!data) return

                    if (gameId === 'wordle-unlimited') {
                        this.wordleUnlimitedStats = {
                            currentStreak: data.currentStreak || 0,
                            maxStreak: data.maxStreak || 0,
                            wins: data.wins || 0,
                            losses: data.losses || 0,
                            totalPlayed: data.totalPlayed || 0,
                            winPercentage: data.totalPlayed ? Math.round((data.wins / data.totalPlayed) * 100) : 0,
                            lastPlayedAt: data.lastPlayedAt || null,
                            attemptsHistogram: data.attemptsHistogram ?
                                [1, 2, 3, 4, 5, 6].map(i => data.attemptsHistogram[String(i)] || 0) :
                                [0, 0, 0, 0, 0, 0]
                        }
                    } else {
                        // Regular daily games
                        this.gameStats[gameId] = {
                            currentStreak: data.currentStreak || 0,
                            maxStreak: data.maxStreak || 0,
                            wins: data.wins || 0,
                            losses: data.losses || 0,
                            totalPlays: data.totalPlays || 0,
                            winPercentage: data.totalPlays ? Math.round((data.wins / data.totalPlays) * 100) : 0,
                            gamesPlayed: data.totalPlays || 0,
                            lastPlayedUTC: data.lastPlayedUTC || null
                        }

                        // Add game-specific stats
                        if (gameId === 'wordle' && data.attemptsHistogram) {
                            this.gameStats[gameId].histogram = [1, 2, 3, 4, 5, 6].map(i => data.attemptsHistogram[String(i)] || 0)
                        }
                        if (gameId === 'connections') {
                            this.gameStats[gameId].perfectGames = data.perfectGames || 0
                            this.gameStats[gameId].averageMistakes = data.averageMistakes || 0
                        }
                        if (gameId === 'flag') {
                            this.gameStats[gameId].totalScore = data.totalScore || 0
                            this.gameStats[gameId].averageScore = data.averageScore || 0
                        }

                        // Check today's status
                        const today = dateStrUTC()
                        if (data.lastPlayedUTC === today) {
                            // Read today's game document to get actual status
                            const todayRef = doc(firestore, 'users', userId, 'dailyChallenges', gameId, 'days', today)
                            getDoc(todayRef).then(todaySnap => {
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
                            }).catch(() => {
                                // Ignore errors, keep default status
                            })
                        } else {
                            this.dailyStatus[gameId] = 'not-started'
                        }
                    }
                })

                this.lastUpdated = Date.now()

            } catch (error) {
                console.warn('Error loading game stats from Firestore:', error)
            }
        },

        // Load Wordle Unlimited stats directly from Firestore (kept for backwards compatibility)
        async loadWordleUnlimitedStats(userId = null) {
            if (!userId) {
                const auth = getAuth()
                userId = auth.currentUser?.uid
            }

            if (!userId) return // No user, can't read Firestore

            try {
                const profileRef = doc(firestore, 'users', userId, 'dailyChallenges', 'wordle-unlimited')
                const profileSnap = await getDoc(profileRef)

                if (profileSnap.exists()) {
                    const data = profileSnap.data()
                    this.wordleUnlimitedStats = {
                        currentStreak: data.currentStreak || 0,
                        maxStreak: data.maxStreak || 0,
                        wins: data.wins || 0,
                        losses: data.losses || 0,
                        totalPlayed: data.totalPlayed || 0,
                        winPercentage: data.totalPlayed ? Math.round((data.wins / data.totalPlayed) * 100) : 0,
                        lastPlayedAt: data.lastPlayedAt || null,
                        attemptsHistogram: data.attemptsHistogram ?
                            [1, 2, 3, 4, 5, 6].map(i => data.attemptsHistogram[String(i)] || 0) :
                            [0, 0, 0, 0, 0, 0]
                    }
                }
            } catch (error) {
                console.warn('Error loading Wordle Unlimited stats from Firestore:', error)
            }
        },

        // Update individual game stats (called by game stores when they load/update)
        updateGameStats(gameId, newStats) {
            if (this.gameStats[gameId]) {
                this.gameStats[gameId] = { ...this.gameStats[gameId], ...newStats }
                this.lastUpdated = Date.now()
            }
        },

        // Update game completion status (called by game stores)
        updateGameStatus(gameId, status) {
            this.dailyStatus[gameId] = status
            this.lastUpdated = Date.now()
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
        paths: ['gameStats', 'dailyStatus', 'rolloverAt', 'lastUpdated', 'wordleUnlimitedStats'],
        storage: localStorage
    }
})