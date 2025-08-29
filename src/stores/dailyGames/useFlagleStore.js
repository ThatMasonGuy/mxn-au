// src/stores/dailyGames/useFlagleStore.js - Complete Version with Hints
import { defineStore } from 'pinia'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { firestore } from '@/firebase'
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore'
import { useDailyStore } from '../useDailyStore'
import { getCountryHint } from '@/utils/useDistanceBearing'
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
        _loadPromise: null,
        _lastLoadTime: null,
        _profileUnsubscribe: null,

        // Cached puzzle data (persisted until rollover)
        puzzleId: null,
        countries: [], // Array of 5 country names
        rolloverAt: null,

        // Per-day play state
        days: {},
        profile: null,

        // Current game state - these are derived from today's day state, not persisted
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
            // Always use today's actual date, not lastSeenDate
            const key = dateStrUTC()
            if (!state.days[key]) return {
                answers: [],
                status: 'idle',
                score: 0,
                lives: 3,
                currentFlagIndex: 0,
                allAttempts: []
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

        // Recent guesses for the current flag (for UI display)
        currentFlagAttempts() {
            return this.allAttempts.filter(attempt =>
                attempt.flagIndex === this.currentFlagIndex
            )
        },

        // All incorrect guesses for current flag (for displaying recent wrong guesses)
        currentFlagIncorrectGuesses() {
            return this.currentFlagAttempts
                .filter(attempt => !attempt.correct)
                .map(attempt => attempt.guess)
        },

        // Game reconstruction info (useful for debugging)
        gameReconstructionInfo() {
            const today = dateStrUTC()
            const dayState = this.days[today] || {}

            return {
                hasLocalState: !!this.days[today],
                currentFlag: this.currentFlagIndex + 1,
                totalFlags: 5,
                livesRemaining: this.lives,
                score: this.score,
                correctAnswers: this.answers.length,
                totalAttempts: this.allAttempts.length,
                attemptsThisFlag: this.currentFlagAttempts.length,
                incorrectGuessesThisFlag: this.currentFlagIncorrectGuesses,
                gameStatus: this.status,
                isComplete: this.isComplete
            }
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
                    currentFlagIndex: 0,
                    allAttempts: []
                }
            }
        },

        _syncCurrentStateFromDay(date) {
            // Always use today's date, and ensure the day exists
            const today = dateStrUTC()
            this._ensureDay(today)
            const dayState = this.days[today]

            // Always sync current state variables from day state
            this.answers = dayState.answers || []
            this.currentFlagIndex = dayState.currentFlagIndex || 0
            this.score = dayState.score || 0
            this.lives = dayState.lives !== undefined ? dayState.lives : 3
            this.allAttempts = dayState.allAttempts || []

            // Clear current input when loading saved state
            this.currentInput = ''

            console.log('Synced current state from day:', {
                date: today,
                flagIndex: this.currentFlagIndex,
                lives: this.lives,
                score: this.score,
                answers: this.answers.length,
                allAttempts: this.allAttempts.length,
                status: dayState.status
            })
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

                    // Reconcile state with cloud if we have today's countries
                    if (this.puzzleId && this.countries.length === 5) {
                        await this._reconcileCloudState(user.uid)
                    }
                } else {
                    this.profile = null
                }
            })
        },

        async _reconcileCloudState(uid) {
            if (!this.puzzleId || this.countries.length !== 5) return

            const date = this.puzzleId.replace('flagle-', '')
            // Make sure we're working with today's date
            const today = dateStrUTC()

            // Only reconcile if the puzzle is for today
            if (date !== today) return

            const dayRef = doc(firestore, 'users', uid, 'dailyChallenges', 'flag', 'days', date)
            const daySnap = await getDoc(dayRef)

            if (daySnap.exists()) {
                const cloudState = daySnap.data()

                this._ensureDay(date)
                const localState = this.days[date]
                const localProgress = localState.currentFlagIndex || 0
                const cloudProgress = cloudState.currentFlagIndex || 0

                // Take whichever has more progress
                if (cloudProgress > localProgress) {
                    // Fully reconstruct day state from cloud
                    this.days[date] = {
                        answers: cloudState.answers || [],
                        status: cloudState.outcome === 'win' ? 'won' :
                            cloudState.outcome === 'loss' ? 'lost' : 'idle',
                        score: cloudState.score || 0,
                        lives: cloudState.lives !== undefined ? cloudState.lives : 3,
                        currentFlagIndex: cloudState.currentFlagIndex || 0,
                        allAttempts: cloudState.allAttempts || []
                    }

                    // Update current state variables from restored day state
                    this._syncCurrentStateFromDay(date)

                    console.log('Restored game state from cloud:', {
                        flagIndex: this.currentFlagIndex,
                        lives: this.lives,
                        score: this.score,
                        totalAttempts: this.allAttempts.length,
                        currentFlagAttempts: this.currentFlagAttempts.length
                    })
                } else if (localProgress > cloudProgress) {
                    // Local is ahead - sync to cloud
                    await this._saveStateToCloud(uid, date)
                }
            }
        },

        async _saveStateToCloud(uid, date, showErrors = true) {
            if (!uid) return

            try {
                const dayState = this.days[date]
                if (!dayState) return

                const dayRef = doc(firestore, 'users', uid, 'dailyChallenges', 'flag', 'days', date)
                const outcome = dayState.status === 'won' ? 'win' :
                    dayState.status === 'lost' ? 'loss' : 'in_progress'

                await setDoc(dayRef, {
                    answers: dayState.answers || [],
                    score: dayState.score || 0,
                    lives: dayState.lives !== undefined ? dayState.lives : 3,
                    currentFlagIndex: dayState.currentFlagIndex || 0,
                    allAttempts: dayState.allAttempts || [],
                    outcome,
                    updatedAt: new Date()
                }, { merge: true })

            } catch (error) {
                if (showErrors) {
                    console.error('Failed to save to cloud:', error)
                    throw error
                }
            }
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

            // Check if we've rolled over to a new day
            if (!preferServer && this.rolloverAt && now >= Date.parse(this.rolloverAt)) {
                preferServer = true
                this.isLocked = true
                this.countries = []
                this._lastLoadTime = null
            }

            const cacheValid = this.puzzleId &&
                this.countries.length === 5 &&
                this.rolloverAt &&
                now < Date.parse(this.rolloverAt) &&
                this._lastLoadTime &&
                (now - this._lastLoadTime) < 300000 && // 5 minute cache
                !preferServer

            if (cacheValid) {
                this.loading = false
                // Always sync current state from today's day state (includes all attempts)
                this._syncCurrentStateFromDay(dateStrUTC())
                console.log('Using cached data. Synced state:', this.gameReconstructionInfo)
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

                this.puzzleId = data.puzzleId
                this.countries = data.countries || []
                this.rolloverAt = data.rolloverAt
                this.isLocked = data.rolloverAt ? (Date.now() >= Date.parse(data.rolloverAt)) : false
                this._lastLoadTime = Date.now()

                const date = this.puzzleId.replace('flagle-', '')
                this._ensureDay(date)

                // If user is logged in, reconcile state with cloud
                const auth = getAuth()
                if (auth.currentUser) {
                    await this._reconcileCloudState(auth.currentUser.uid)
                } else {
                    // No user - sync current state from local day state
                    this._syncCurrentStateFromDay(date)
                }

                // Always clear input after loading
                this.currentInput = ''
                this._syncWithDailyStore()

                console.log('Game loaded successfully. Current state:', this.gameReconstructionInfo)

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
            const correct = variants.includes(normalizeCountry(guess))

            // Calculate hint for wrong guesses
            let hint = null
            if (!correct) {
                try {
                    hint = getCountryHint(guess, currentCountry)
                } catch (error) {
                    console.warn('Failed to calculate hint:', error)
                }
            }

            // Store EVERY attempt for state reconstruction
            const attempt = {
                flagIndex: this.currentFlagIndex,
                country: currentCountry,
                guess,
                correct,
                hint,
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

            const today = dateStrUTC()
            this.days[today] = {
                answers: this.answers,
                allAttempts: this.allAttempts,
                score: this.score,
                lives: this.lives,
                currentFlagIndex: this.currentFlagIndex,
                status: 'idle'
            }

            // Save to cloud immediately with error handling
            const auth = getAuth()
            if (auth.currentUser) {
                try {
                    await this._saveStateToCloud(auth.currentUser.uid, today)
                } catch (error) {
                    console.error('Failed to save state:', error)
                    // Continue with game - local state is still updated
                }
            }

            this.currentInput = ''

            // Check end conditions
            const isGameOver = this.lives === 0 || this.currentFlagIndex >= 5

            if (isGameOver) {
                // If we ran out of lives, add final answer for current flag
                if (this.lives === 0 && this.answers.length < this.currentFlagIndex + 1) {
                    const finalAnswer = {
                        country: currentCountry,
                        guess,
                        correct: false,
                        skipped: false
                    }
                    this.answers.push(finalAnswer)
                    this.days[today].answers = this.answers
                }

                const finalStatus = this.currentFlagIndex >= 5 ? 'won' : 'lost'
                this.days[today].status = finalStatus

                // Save final state
                if (auth.currentUser) {
                    try {
                        await this._saveStateToCloud(auth.currentUser.uid, today)
                    } catch (error) {
                        console.error('Failed to save final state:', error)
                    }
                }

                await this._submitCompletion()
            }

            return { correct, answer: currentCountry }
        },

        async _updateProfileStatsDirectly(uid) {
            const profileRef = doc(firestore, 'users', uid, 'dailyChallenges', 'flag')
            const profileSnap = await getDoc(profileRef)

            const currentProfile = profileSnap.exists() ? profileSnap.data() : {
                currentStreak: 0,
                maxStreak: 0,
                wins: 0,
                losses: 0,
                totalPlays: 0,
                totalScore: 0,
                averageScore: 0,
                lastPlayedUTC: null
            }

            const isWin = this.status === 'won'
            const today = dateStrUTC()

            // Calculate new stats
            const newTotalPlays = currentProfile.totalPlays + 1
            const newWins = currentProfile.wins + (isWin ? 1 : 0)
            const newLosses = currentProfile.losses + (isWin ? 0 : 1)
            const newTotalScore = currentProfile.totalScore + this.score
            const newAverageScore = Math.round(newTotalScore / newTotalPlays)

            // Calculate streak
            let newCurrentStreak = 0
            if (isWin) {
                const lastPlayedDate = currentProfile.lastPlayedUTC
                const yesterday = new Date()
                yesterday.setUTCDate(yesterday.getUTCDate() - 1)
                const yesterdayStr = dateStrUTC(yesterday)

                if (!lastPlayedDate || lastPlayedDate === yesterdayStr) {
                    // Continue streak
                    newCurrentStreak = currentProfile.currentStreak + 1
                } else {
                    // Start new streak
                    newCurrentStreak = 1
                }
            }

            const newMaxStreak = Math.max(currentProfile.maxStreak, newCurrentStreak)

            const updatedProfile = {
                currentStreak: newCurrentStreak,
                maxStreak: newMaxStreak,
                wins: newWins,
                losses: newLosses,
                totalPlays: newTotalPlays,
                totalScore: newTotalScore,
                averageScore: newAverageScore,
                lastPlayedUTC: today,
                updatedAt: new Date()
            }

            await setDoc(profileRef, updatedProfile, { merge: true })
        },

        async _submitCompletion() {
            const auth = getAuth()
            if (!auth.currentUser) return

            const uid = auth.currentUser.uid
            let cloudFunctionWorked = false

            try {
                const call = httpsCallable(functions(), 'submitFlagleCompletion')
                await call({
                    puzzleId: this.puzzleId,
                    answers: this.answers,
                    score: this.score,
                    outcome: this.status === 'won' ? 'win' : 'loss'
                })
                cloudFunctionWorked = true
            } catch (error) {
                console.error('Cloud function failed:', error)
                cloudFunctionWorked = false
            }

            // Fallback: Update profile stats directly if cloud function failed
            if (!cloudFunctionWorked) {
                try {
                    await this._updateProfileStatsDirectly(uid)
                } catch (error) {
                    console.error('Direct profile update failed:', error)
                }
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
            this.allAttempts = []
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
        paths: ['days', 'profile', 'puzzleId', 'countries', 'rolloverAt'],
        storage: localStorage,
    },
})