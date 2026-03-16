// src/utils/wordleUnlimitedUtils.js
import { getFunctions, httpsCallable } from 'firebase/functions'
import { firestore } from '@/firebase'
import { doc, getDoc, collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore'

const REGION = 'australia-southeast2'
const functions = () => getFunctions(undefined, REGION)

/**
 * Utility functions for Wordle Unlimited
 */

// ═══════════════════════════════════════════════════════════════════════════════
// Word Analysis & Statistics
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate word difficulty based on global stats
 * @param {Object} wordStats - Word statistics from Firestore
 * @returns {string} Difficulty level: 'easy', 'medium', 'hard', 'expert'
 */
export function calculateWordDifficulty(wordStats) {
    if (!wordStats || !wordStats.completions) return 'unknown'

    const winRate = wordStats.winPercentage || 0
    const avgAttempts = calculateAverageAttempts(wordStats.attemptsHistogram || {})

    // Combine win rate and average attempts for difficulty
    const difficultyScore = (100 - winRate) + (avgAttempts - 3) * 10

    if (difficultyScore < 20) return 'easy'
    if (difficultyScore < 40) return 'medium'
    if (difficultyScore < 60) return 'hard'
    return 'expert'
}

/**
 * Calculate average attempts from histogram
 * @param {Object} histogram - Attempts histogram
 * @returns {number} Average attempts
 */
export function calculateAverageAttempts(histogram) {
    const entries = Object.entries(histogram)
    if (entries.length === 0) return 3.5

    let totalAttempts = 0
    let totalGames = 0

    entries.forEach(([attempts, count]) => {
        totalAttempts += parseInt(attempts) * count
        totalGames += count
    })

    return totalGames > 0 ? totalAttempts / totalGames : 3.5
}

/**
 * Get most common first guesses from global stats
 * @param {Array} wordStatsList - Array of word statistics
 * @returns {Array} Top 10 first guesses with counts
 */
export function getPopularFirstGuesses(wordStatsList) {
    const firstGuesses = {}

    wordStatsList.forEach(wordStats => {
        if (wordStats.positionGuesses?.pos_1) {
            Object.entries(wordStats.positionGuesses.pos_1).forEach(([guess, count]) => {
                firstGuesses[guess] = (firstGuesses[guess] || 0) + count
            })
        }
    })

    return Object.entries(firstGuesses)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([guess, count]) => ({ guess, count }))
}

// ═══════════════════════════════════════════════════════════════════════════════
// User Progress & Analytics
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate user improvement over time
 * @param {Array} userPlays - User's play history
 * @returns {Object} Improvement metrics
 */
export function calculateUserImprovement(userPlays) {
    if (userPlays.length < 10) return null

    const recentPlays = userPlays.slice(-10)
    const olderPlays = userPlays.slice(0, 10)

    const recentAvg = recentPlays.reduce((sum, play) => sum + (play.attempts || 6), 0) / recentPlays.length
    const olderAvg = olderPlays.reduce((sum, play) => sum + (play.attempts || 6), 0) / olderPlays.length

    const improvement = olderAvg - recentAvg

    return {
        recentAverage: Math.round(recentAvg * 10) / 10,
        olderAverage: Math.round(olderAvg * 10) / 10,
        improvement: Math.round(improvement * 10) / 10,
        isImproving: improvement > 0
    }
}

/**
 * Get user's word preference patterns
 * @param {Array} userPlays - User's play history
 * @returns {Object} Preference patterns
 */
export function analyzeUserPreferences(userPlays) {
    const patterns = {
        favoriteStartingLetters: {},
        commonSecondGuesses: {},
        preferredWordLength: 5, // Always 5 for Wordle
        averageGameTime: 0,
        quickestSolve: null,
        hardestWord: null
    }

    userPlays.forEach(play => {
        if (play.guesses && play.guesses.length > 0) {
            // First letter preferences
            const firstLetter = play.guesses[0][0]
            patterns.favoriteStartingLetters[firstLetter] =
                (patterns.favoriteStartingLetters[firstLetter] || 0) + 1

            // Second guess patterns
            if (play.guesses.length > 1) {
                const secondGuess = play.guesses[1]
                patterns.commonSecondGuesses[secondGuess] =
                    (patterns.commonSecondGuesses[secondGuess] || 0) + 1
            }

            // Track hardest word (most attempts)
            if (!patterns.hardestWord || play.attempts > patterns.hardestWord.attempts) {
                patterns.hardestWord = {
                    word: play.word,
                    attempts: play.attempts
                }
            }

            // Track quickest solve
            if (play.outcome === 'win' &&
                (!patterns.quickestSolve || play.attempts < patterns.quickestSolve.attempts)) {
                patterns.quickestSolve = {
                    word: play.word,
                    attempts: play.attempts
                }
            }
        }
    })

    return patterns
}

// ═══════════════════════════════════════════════════════════════════════════════
// Word Pool Management
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get user's word recommendations based on difficulty preference
 * @param {string} userId - User ID
 * @param {string} difficulty - Preferred difficulty
 * @param {number} count - Number of words to recommend
 * @returns {Promise<Array>} Recommended words
 */
export async function getRecommendedWords(userId, difficulty = 'medium', count = 10) {
    try {
        // Get user's played words
        const userPlaysRef = collection(firestore, 'users', userId, 'dailyChallenges', 'wordle-unlimited', 'plays')
        const userPlaysSnap = await getDocs(userPlaysRef)
        const playedWords = new Set()
        userPlaysSnap.forEach(doc => playedWords.add(doc.id))

        // Get available words from solutions
        const solutionsRef = collection(firestore, 'dailyChallenges', 'wordle-unlimited', 'solutions')
        const solutionsQuery = query(solutionsRef, limit(count * 3))
        const solutionsSnap = await getDocs(solutionsQuery)

        const recommendations = []

        for (const solutionDoc of solutionsSnap.docs) {
            if (playedWords.has(solutionDoc.id)) continue
            if (recommendations.length >= count) break

            // Get word stats to check difficulty
            const statsRef = doc(firestore, 'dailyChallenges', 'wordle-unlimited', 'stats', solutionDoc.id)
            const statsSnap = await getDoc(statsRef)

            if (statsSnap.exists()) {
                const wordDifficulty = calculateWordDifficulty(statsSnap.data())
                if (wordDifficulty === difficulty) {
                    recommendations.push({
                        word: solutionDoc.id,
                        difficulty: wordDifficulty,
                        ...solutionDoc.data(),
                        stats: statsSnap.data()
                    })
                }
            } else {
                // New word without stats - default to medium difficulty
                if (difficulty === 'medium') {
                    recommendations.push({
                        word: solutionDoc.id,
                        difficulty: 'medium',
                        ...solutionDoc.data()
                    })
                }
            }
        }

        return recommendations
    } catch (error) {
        console.error('Error getting recommended words:', error)
        return []
    }
}

/**
 * Check if word pool needs replenishment for a user
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Whether pool needs replenishment
 */
export async function checkWordPoolHealth(userId) {
    try {
        const call = httpsCallable(functions(), 'getWordleUnlimitedWords')
        const { data } = await call({ limit: 20 })

        return data.availableWords.length < 10
    } catch (error) {
        console.error('Error checking word pool:', error)
        return true // Assume needs replenishment if error
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Performance & Optimization
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Cache manager for word data
 */
export class WordCache {
    constructor() {
        this.cache = new Map()
        this.maxAge = 5 * 60 * 1000 // 5 minutes
    }

    set(key, value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        })
    }

    get(key) {
        const item = this.cache.get(key)
        if (!item) return null

        if (Date.now() - item.timestamp > this.maxAge) {
            this.cache.delete(key)
            return null
        }

        return item.value
    }

    clear() {
        this.cache.clear()
    }

    size() {
        return this.cache.size
    }
}

// Global cache instance
export const wordCache = new WordCache()

/**
 * Debounce function for API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Validation & Security
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Validate word format
 * @param {string} word - Word to validate
 * @returns {boolean} Whether word is valid
 */
export function isValidWordFormat(word) {
    return typeof word === 'string' &&
        word.length === 5 &&
        /^[A-Z]{5}$/.test(word)
}

/**
 * Validate guess sequence
 * @param {Array} guesses - Array of guesses
 * @param {Array} masks - Array of corresponding masks
 * @returns {boolean} Whether sequence is valid
 */
export function validateGuessSequence(guesses, masks) {
    if (!Array.isArray(guesses) || !Array.isArray(masks)) return false
    if (guesses.length !== masks.length) return false
    if (guesses.length === 0 || guesses.length > 6) return false

    return guesses.every((guess, index) => {
        return isValidWordFormat(guess) &&
            typeof masks[index] === 'string' &&
            masks[index].length === 5 &&
            /^[GYB]{5}$/.test(masks[index])
    })
}

// ═══════════════════════════════════════════════════════════════════════════════
// Export utilities
// ═══════════════════════════════════════════════════════════════════════════════

export default {
    calculateWordDifficulty,
    calculateAverageAttempts,
    getPopularFirstGuesses,
    calculateUserImprovement,
    analyzeUserPreferences,
    getRecommendedWords,
    checkWordPoolHealth,
    WordCache,
    wordCache,
    debounce,
    isValidWordFormat,
    validateGuessSequence
}