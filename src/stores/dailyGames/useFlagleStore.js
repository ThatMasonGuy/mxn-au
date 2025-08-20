// src/stores/dailyGames/useFlagleStore.js
import { defineStore } from 'pinia'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { firestore } from '@/firebase'
import { doc, onSnapshot, getDoc } from 'firebase/firestore'
import { useDailyStore } from '../useDailyStore'
import countries from 'i18n-iso-countries'
import en from 'i18n-iso-countries/langs/en.json'

countries.registerLocale(en)

const REGION = 'australia-southeast2'
const functions = () => getFunctions(undefined, REGION)

function dateStrUTC(d = new Date()) {
    const y = d.getUTCFullYear()
    const m = String(d.getUTCMonth() + 1).padStart(2, '0')
    const day = String(d.getUTCDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

// Normalize country names for matching
function normalizeCountry(name) {
    if (!name) return ''
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .replace(/^the/, '')
}

// Get all valid names for a country
function getCountryVariants(countryName) {
    const variants = new Set()

    // Add the main name
    variants.add(normalizeCountry(countryName))

    // Try to get ISO code
    const code = countries.getAlpha2Code(countryName, 'en')
    if (code) {
        // Add all official names
        const names = countries.getNames('en')
        for (const [isoCode, name] of Object.entries(names)) {
            if (isoCode === code) {
                variants.add(normalizeCountry(name))
                // Add common variations
                if (name.includes(',')) {
                    const parts = name.split(',')
                    parts.forEach(part => variants.add(normalizeCountry(part.trim())))
                }
            }
        }
    }

    // Add common aliases manually
    const aliases = {
        'United States': ['USA', 'United States of America', 'America', 'US'],
        'United Kingdom': ['UK', 'Great Britain', 'Britain', 'GB'],
        'Netherlands': ['Holland'],
        'Russian Federation': ['Russia'],
        'Korea, Republic of': ['South Korea', 'Korea'],
        'Korea, Democratic People\'s Republic of': ['North Korea', 'DPRK'],
        'Czech Republic': ['Czechia'],
        'Ivory Coast': ['Cote d\'Ivoire'],
        'Palestine, State of': ['Palestine'],
        'China': ['People\'s Republic of China', 'PRC'],
        'Taiwan, Province of China': ['Taiwan', 'Republic of China', 'ROC'],
    }

    for (const [official, aliasList] of Object.entries(aliases)) {
        if (normalizeCountry(official) === normalizeCountry(countryName)) {
            aliasList.forEach(alias => variants.add(normalizeCountry(alias)))
        }
        aliasList.forEach(alias => {
            if (normalizeCountry(alias) === normalizeCountry(countryName)) {
                variants.add(normalizeCountry(official))
                aliasList.forEach(a => variants.add(normalizeCountry(a)))
            }
        })
    }

    return Array.from(variants)
}

export const useFlagleStore = defineStore('flagle', {
    state: () => ({
        // Ephemeral
        loading: true,
        isLocked: false,
        lastFinalizeError: null,
        _loadPromise: null,
        _lastLoadTime: null,
        _profileUnsubscribe: null,

        // Persisted per-day puzzle
        puzzleId: null,
        countries: [], // Array of 5 country names
        rolloverAt: null,

        // Per-day play state
        days: {},
        lastSeenDate: null,
        profile: null,

        // Current game state
        currentFlagIndex: 0,
        currentInput: '',
        lives: 3,
        score: 0,
        allAttempts: [],
        answers: [], // Array of { country, guess, correct, skipped }
    }),

    getters: {
        todayDate: () => dateStrUTC(),
        todayState(state) {
            const key = state.lastSeenDate || dateStrUTC()
            if (!state.days[key]) return {
                answers: [],
                status: 'idle',
                score: 0,
                lives: 3,
                currentFlagIndex: 0
            }
            return state.days[key]
        },
        status() { return this.todayState.status || 'idle' },
        isComplete() { return this.status === 'won' || this.status === 'lost' },
        canType() {
            return !this.loading && !this.isLocked && !this.isComplete && this.lives > 0
        },
        currentCountry() {
            return this.countries[this.currentFlagIndex] || null
        },
        flagsRemaining() {
            return Math.max(0, 5 - this.currentFlagIndex)
        },
        correctAnswers() {
            return this.answers.filter(a => a.correct).length
        },
    },

    actions: {
        _ensureDay(dateStr) {
            if (!this.days[dateStr]) {
                this.days[dateStr] = {
                    answers: [],
                    status: 'idle',
                    score: 0,
                    lives: 3,
                    currentFlagIndex: 0
                }
            }
            if (this.lastSeenDate !== dateStr) this.lastSeenDate = dateStr
        },

        initAuthListener() {
            const auth = getAuth()

            if (this._profileUnsubscribe) {
                this._profileUnsubscribe()
                this._profileUnsubscribe = null
            }

            onAuthStateChanged(auth, async (user) => {
                if (this._profileUnsubscribe) {
                    this._profileUnsubscribe()
                    this._profileUnsubscribe = null
                }

                if (user) {
                    const profileRef = doc(firestore, 'users', user.uid, 'dailyChallenges', 'flag')
                    this._profileUnsubscribe = onSnapshot(profileRef, (snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.data()
                            this.profile = {
                                currentStreak: data.currentStreak || 0,
                                maxStreak: data.maxStreak || 0,
                                wins: data.wins || 0,
                                losses: data.losses || 0,
                                totalPlays: data.totalPlays || 0,
                                winPercentage: data.totalPlays ? Math.round((data.wins / data.totalPlays) * 100) : 0,
                                gamesPlayed: data.totalPlays || 0,
                                lastPlayedUTC: data.lastPlayedUTC || null,
                                totalScore: data.totalScore || 0,
                                averageScore: data.averageScore || 0
                            }
                            this._syncWithDailyStore()
                        }
                    })

                    // Load today's game state
                    if (this.puzzleId) {
                        const date = this.puzzleId.replace('flagle-', '')
                        const dayRef = doc(firestore, 'users', user.uid, 'dailyChallenges', 'flag', 'days', date)
                        const daySnap = await getDoc(dayRef)
                        if (daySnap.exists()) {
                            const userState = daySnap.data()
                            if (userState.answers && userState.answers.length > 0) {
                                this.days[date] = {
                                    answers: userState.answers,
                                    status: userState.outcome || 'idle',
                                    score: userState.score || 0,
                                    lives: userState.lives || 3,
                                    currentFlagIndex: userState.currentFlagIndex || userState.answers.length
                                }
                                this.answers = userState.answers
                                this.currentFlagIndex = userState.currentFlagIndex || userState.answers.length
                                this.score = userState.score || 0
                                this.lives = userState.lives || 3
                            }
                        }
                    }
                } else {
                    this.profile = null
                }
            })
        },

        _syncWithDailyStore() {
            try {
                const dailyStore = useDailyStore()
                if (this.profile) dailyStore.updateGameStats?.('flag', this.profile)
                if (this.status && this.status !== 'idle') dailyStore.updateGameStatus?.('flag', this.status)
                if (this.rolloverAt) dailyStore.rolloverAt = this.rolloverAt
            } catch (error) {
                console.warn('Error syncing with daily store:', error)
            }
        },

        async loadDaily(preferServer = false) {
            const now = Date.now()

            const cacheValid = this.puzzleId &&
                this.countries.length === 5 &&
                this.rolloverAt &&
                now < Date.parse(this.rolloverAt) &&
                this._lastLoadTime &&
                (now - this._lastLoadTime) < 60000 &&
                !preferServer

            if (cacheValid) {
                this.loading = false
                return
            }

            if (this._loadPromise && !preferServer) {
                return this._loadPromise
            }

            this._loadPromise = this._doLoad(preferServer)

            try {
                await this._loadPromise
            } finally {
                this._loadPromise = null
            }
        },

        async _doLoad(preferServer = false) {
            this.loading = true

            try {
                const call = httpsCallable(functions(), 'getDailyFlagle')
                const { data } = await call({})
                const { puzzleId, packet, userState, rolloverAt } = data

                this.puzzleId = puzzleId
                this.countries = packet?.countries || []
                this.rolloverAt = rolloverAt
                this.isLocked = rolloverAt ? (Date.now() >= Date.parse(rolloverAt)) : false
                this._lastLoadTime = Date.now()

                const date = puzzleId.replace('flagle-', '')
                this._ensureDay(date)

                const auth = getAuth()
                const loggedIn = !!auth.currentUser

                if (userState && userState.answers) {
                    this.days[date] = {
                        answers: userState.answers,
                        status: userState.outcome || 'idle',
                        score: userState.score || 0,
                        lives: userState.lives || 3,
                        currentFlagIndex: userState.currentFlagIndex || userState.answers.length
                    }
                    this.answers = userState.answers
                    this.currentFlagIndex = userState.currentFlagIndex || userState.answers.length
                    this.score = userState.score || 0
                    this.lives = userState.lives || 3
                } else {
                    // Reset for new game
                    this.answers = []
                    this.currentFlagIndex = 0
                    this.score = 0
                    this.lives = 3
                }

                this.currentInput = ''
                this._syncWithDailyStore()

            } catch (error) {
                console.error('Error loading daily flagle:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        typeInput(text) {
            if (!this.canType) return
            this.currentInput = text
        },

        async submitGuess() {
            if (!this.canType || !this.currentInput.trim()) return
        
            const guess = this.currentInput.trim()
            const currentCountry = this.countries[this.currentFlagIndex]
        
            const variants = getCountryVariants(currentCountry)
            const normalizedGuess = normalizeCountry(guess)
            const correct = variants.includes(normalizeCountry(guess))
        
            // Store EVERY attempt for state reconstruction
            const attempt = {
                flagIndex: this.currentFlagIndex,
                country: currentCountry,
                guess,
                correct,
                timestamp: Date.now()
            }
            this.allAttempts.push(attempt)
        
            if (correct) {
                // Only add to answers when moving to next flag
                const answer = {
                    country: currentCountry,
                    guess,
                    correct: true,
                    skipped: false
                }
                this.answers.push(answer)
                this.score += this.lives * 20
                this.currentFlagIndex++
            } else {
                this.lives = Math.max(0, this.lives - 1)
            }
        
            // Persist state
            const date = this.puzzleId.replace('flagle-', '')
            this.days[date].answers = this.answers
            this.days[date].allAttempts = this.allAttempts
            this.days[date].score = this.score
            this.days[date].lives = this.lives
            this.days[date].currentFlagIndex = this.currentFlagIndex
        
            // Save to server with all attempts
            httpsCallable(functions(), 'saveFlagleProgress')({
                puzzleId: this.puzzleId,
                flagIndex: this.currentFlagIndex,
                guess,
                correct,
                score: this.score,
                lives: this.lives,
                allAttempts: this.allAttempts
            }).catch(() => { })
        
            this.currentInput = ''
        
            // End conditions
            if (this.lives === 0 || this.currentFlagIndex >= 5) {
                // If we ran out of lives, add final answer for current flag
                if (this.lives === 0 && this.answers.length < this.currentFlagIndex + 1) {
                    const finalAnswer = {
                        country: currentCountry,
                        guess,
                        correct: false,
                        skipped: false
                    }
                    this.answers.push(finalAnswer)
                    this.days[date].answers = this.answers
                }
        
                const finalStatus = this.score >= 150 ? 'won' : 'lost'
                this.days[date].status = finalStatus
                await this._finalize()
            }
        
            return { correct, answer: currentCountry }
        },

        async _finalize() {
            const call = httpsCallable(functions(), 'submitFlagleOutcome')
            try {
                const { data } = await call({
                    puzzleId: this.puzzleId,
                    answers: this.answers,
                    score: this.score
                })

                if (data?.outcome) {
                    const date = this.puzzleId.replace('flagle-', '')
                    this.days[date].status = data.outcome
                    this.days[date].completedAt = Date.now()
                }

                this.lastFinalizeError = null
            } catch (e) {
                this.lastFinalizeError = e?.message || String(e)
            }
        },

        async refreshIfRolledOver() {
            if (!this.rolloverAt) return
            const rolled = Date.now() >= Date.parse(this.rolloverAt)
            if (rolled) {
                this.isLocked = true
                this.countries = []
                this._lastLoadTime = null
                await this.loadDaily(true)
            }
        },

        shareText() {
            const date = this.puzzleId?.replace('flagle-', '') || dateStrUTC()
            const correct = this.answers.filter(a => a.correct).length
            const header = `MXN Daily — Flag Quest ${date}`
            const result = `${correct}/5 flags | Score: ${this.score}`

            const grid = this.answers.map(a => {
                if (a.correct) return '🟩'
                if (a.skipped) return '⬜'
                return '🟥'
            }).join('')

            return `${header}\n${result}\n${grid}\n\nPlay at https://mxn.au/daily?game=flag`
        },

        hardResetLocal() {
            if (this._profileUnsubscribe) {
                this._profileUnsubscribe()
                this._profileUnsubscribe = null
            }
            this.days = {}
            this.lastSeenDate = null
            this.profile = null
            this.countries = []
            this.puzzleId = null
            this.rolloverAt = null
            this.isLocked = false
            this._lastLoadTime = null
            this._loadPromise = null
            this.currentFlagIndex = 0
            this.currentInput = ''
            this.lives = 3
            this.score = 0
            this.answers = []
        },

        $dispose() {
            if (this._profileUnsubscribe) {
                this._profileUnsubscribe()
                this._profileUnsubscribe = null
            }
        }
    },

    persist: {
        key: 'mxn:daily:flagle',
        paths: ['days', 'lastSeenDate', 'profile'],
        storage: localStorage,
    },
})