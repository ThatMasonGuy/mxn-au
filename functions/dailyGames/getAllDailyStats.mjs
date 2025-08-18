// functions/src/daily/getAllDailyStats.mjs
import { onCall } from 'firebase-functions/v2/https'
import { db } from '../config/firebase.mjs'

const REGION = 'australia-southeast2';

export const getAllDailyStats = onCall(
    {
        region: REGION,
        maxInstances: 1
    },
    async (request) => {
        const { auth } = request

        if (!auth) {
            return {
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
                dailyStatus: {
                    wordle: 'not-started',
                    connections: 'not-started',
                    flag: 'not-started',
                    trivia: 'not-started',
                    sequence: 'not-started',
                    memory: 'not-started'
                },
                rolloverAt: getNextRolloverTime()
            }
        }

        const userId = auth.uid

        try {
            const dailyChallengesRef = db.collection('users').doc(userId).collection('dailyChallenges')
            const dailyChallengesSnapshot = await dailyChallengesRef.get()

            const gameStats = {
                wordle: getDefaultGameStats(),
                connections: getDefaultGameStats(),
                flag: getDefaultGameStats(),
                trivia: getDefaultGameStats(),
                sequence: getDefaultGameStats(),
                memory: getDefaultGameStats()
            }

            const dailyStatus = {
                wordle: 'not-started',
                connections: 'not-started',
                flag: 'not-started',
                trivia: 'not-started',
                sequence: 'not-started',
                memory: 'not-started'
            }

            dailyChallengesSnapshot.forEach(doc => {
                const gameId = doc.id
                const data = doc.data()

                if (gameStats[gameId]) {
                    gameStats[gameId] = {
                        currentStreak: data.currentStreak || 0,
                        maxStreak: data.maxStreak || 0,
                        wins: data.wins || 0,
                        losses: data.losses || 0,
                        totalPlays: data.totalPlays || 0,
                        winPercentage: calculateWinPercentage(data),
                        gamesPlayed: data.totalPlays || 0,
                        lastPlayedUTC: data.lastPlayed || null,
                        histogram: data.histogram || (gameId === 'wordle' ? [0, 0, 0, 0, 0, 0] : undefined)
                    }

                    const today = getTodayDateString()
                    const lastPlayed = data.lastPlayed ? new Date(data.lastPlayed).toISOString().split('T')[0] : null

                    if (lastPlayed === today) {
                        if (data.lastGameWon === true) {
                            dailyStatus[gameId] = 'won'
                        } else if (data.lastGameWon === false) {
                            dailyStatus[gameId] = 'lost'
                        } else {
                            dailyStatus[gameId] = 'in-progress'
                        }
                    } else {
                        dailyStatus[gameId] = 'not-started'
                    }
                }
            })

            return {
                gameStats,
                dailyStatus,
                rolloverAt: getNextRolloverTime()
            }

        } catch (error) {
            console.error('Error fetching daily stats:', error)
            throw new Error('Failed to fetch daily stats')
        }
    })

function getDefaultGameStats() {
    return {
        currentStreak: 0,
        maxStreak: 0,
        wins: 0,
        losses: 0,
        totalPlays: 0,
        winPercentage: 0,
        gamesPlayed: 0,
        lastPlayedUTC: null
    }
}

function calculateWinPercentage(stats) {
    if (!stats || !stats.totalPlays) return 0
    return Math.round((stats.wins / stats.totalPlays) * 100)
}

function getTodayDateString() {
    const now = new Date()
    return now.toISOString().split('T')[0]
}

function getNextRolloverTime() {
    const tomorrow = new Date()
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
    tomorrow.setUTCHours(0, 0, 0, 0)
    return tomorrow.toISOString()
}