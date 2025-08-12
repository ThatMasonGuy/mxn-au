import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    getAuth, onAuthStateChanged
} from 'firebase/auth'
import {
    doc, getDoc, setDoc, runTransaction, serverTimestamp, increment
} from 'firebase/firestore'
import { firestore } from '@/firebase'

// ---------- AEST helpers ----------
const AEST_TZ = 'Australia/Brisbane'
function fmtAEST(d) {
    const y = new Intl.DateTimeFormat('en-CA', { timeZone: AEST_TZ, year: 'numeric' }).format(d)
    const m = new Intl.DateTimeFormat('en-CA', { timeZone: AEST_TZ, month: '2-digit' }).format(d)
    const day = new Intl.DateTimeFormat('en-CA', { timeZone: AEST_TZ, day: '2-digit' }).format(d)
    return `${y}-${m}-${day}`
}
function diffDaysAEST(a, b) {
    const A = new Date(`${a}T00:00:00+10:00`).getTime()
    const B = new Date(`${b}T00:00:00+10:00`).getTime()
    return Math.round((B - A) / 86400000)
}
function attemptsKey(attempts, success) {
    if (!success) return 'fail'
    const k = String(attempts)
    return ['1', '2', '3', '4', '5', '6'].includes(k) ? k : 'fail'
}

// ---------- CONFIG ----------
const SUPPORTED_GAMES = ['word'] // extend: ['word','flag','translate','audio',...]
const DEFAULT_USER_GAME_STATS = () => ({
    currentWinStreak: 0,
    maxWinStreak: 0,
    daysPlayed: 0,
    totalGames: 0,
    lastPlayedDate: null,
    lastWinDate: null,
    attemptsHistogram: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, 'fail': 0 }
})

const DEFAULT_GAME_STATE = () => ({
    rows: [],
    current: '',
    kb: {},
    status: 'idle', // 'idle' | 'won' | 'lost'
    lastUpdated: null
})

export const useDailyStore = defineStore('daily', () => {
    // time
    const now = ref(new Date())
    const today = computed(() => fmtAEST(now.value))
    let tick = null

    // auth
    const auth = getAuth()
    const user = ref(null)

    // challenges per gameId
    const challenges = ref({}) // { [gameId]: { date, solution, stats?... } }
    const loading = ref({})    // { [gameId]: boolean }
    const errors = ref({})     // { [gameId]: string }

    // game states per gameId per date (local storage for unauth, cloud for auth)
    const gameStates = ref({}) // { [gameId]: { [date]: gameState } }

    // local (pre-login) mirrors / convenience
    const localUserStats = ref(
        SUPPORTED_GAMES.reduce((acc, g) => {
            acc[g] = DEFAULT_USER_GAME_STATS()
            return acc
        }, {})
    )

    // ---- lifecycle / init ----
    async function init() {
        if (!tick) tick = setInterval(() => (now.value = new Date()), 1000)
        onAuthStateChanged(auth, async (u) => {
            user.value = u ? { uid: u.uid, displayName: u.displayName || null, email: u.email || null } : null
            // optional: on login, pull each game's user stats & reconcile local
            if (u) {
                for (const gameId of SUPPORTED_GAMES) {
                    await reconcileUserStats(gameId)
                    await reconcileGameState(gameId, today.value)
                }
            }
        })
    }

    // ---- fetch today's challenge for a game ----
    async function fetchDayChallenge(gameId, dateStr = today.value) {
        loading.value[gameId] = true
        errors.value[gameId] = ''
        try {
            const ref = doc(firestore, 'dailyChallenges', gameId, 'games', dateStr)
            const snap = await getDoc(ref)
            if (!snap.exists()) {
                challenges.value[gameId] = null
                errors.value[gameId] = 'No challenge found.'
            } else {
                challenges.value[gameId] = { id: ref.id, ...snap.data() }
            }
        } catch (e) {
            console.error('fetchDayChallenge', e)
            errors.value[gameId] = 'Failed to load.'
        } finally {
            loading.value[gameId] = false
        }
    }

    // ---- game state management ----
    function getGameStateKey(gameId, dateStr = today.value) {
        return `${gameId}:${dateStr}`
    }

    function getLocalGameState(gameId, dateStr = today.value) {
        const key = getGameStateKey(gameId, dateStr)
        if (!gameStates.value[key]) {
            gameStates.value[key] = { ...DEFAULT_GAME_STATE() }
        }
        return gameStates.value[key]
    }

    function updateLocalGameState(gameId, newState, dateStr = today.value) {
        const key = getGameStateKey(gameId, dateStr)
        gameStates.value[key] = {
            ...getLocalGameState(gameId, dateStr),
            ...newState,
            lastUpdated: new Date().toISOString()
        }
    }

    // ---- reconcile game state (merge local <-> cloud) ----
    async function reconcileGameState(gameId, dateStr = today.value) {
        if (!user.value) return getLocalGameState(gameId, dateStr)

        try {
            const userDayDocRef = doc(firestore, 'users', user.value.uid, 'dailyChallenges', gameId, 'games', dateStr)
            const snap = await getDoc(userDayDocRef)
            const cloudData = snap.exists() ? snap.data() : null
            const localState = getLocalGameState(gameId, dateStr)

            let chosenState = localState

            if (cloudData) {
                // Extract game state from cloud document
                const cloudGameState = {
                    rows: cloudData.rows || [],
                    current: cloudData.current || '',
                    kb: cloudData.kb || {},
                    status: cloudData.status || 'idle',
                    lastUpdated: cloudData.lastUpdated
                }

                // If cloud has completion data, always use cloud state (it's authoritative)
                if (cloudData.completedAt || cloudData.success !== undefined) {
                    chosenState = cloudGameState
                } else if (cloudData.lastUpdated) {
                    // Otherwise compare timestamps
                    const cloudTime = new Date(cloudData.lastUpdated).getTime()
                    const localTime = localState.lastUpdated ? new Date(localState.lastUpdated).getTime() : 0

                    if (cloudTime > localTime) {
                        chosenState = cloudGameState
                    }
                }
            }

            // Update local state
            updateLocalGameState(gameId, chosenState, dateStr)

            return chosenState
        } catch (e) {
            console.error('Error reconciling game state:', e)
            return getLocalGameState(gameId, dateStr)
        }
    }

    // ---- save game state to cloud ----
    async function saveGameStateToCloud(gameId, gameState, dateStr = today.value) {
        if (!user.value) return

        try {
            const userDayDocRef = doc(firestore, 'users', user.value.uid, 'dailyChallenges', gameId, 'games', dateStr)
            await setDoc(userDayDocRef, {
                // Progressive state
                rows: gameState.rows || [],
                current: gameState.current || '',
                kb: gameState.kb || {},
                status: gameState.status || 'idle',
                lastUpdated: serverTimestamp(),

                // Keep existing completion data if it exists
                date: dateStr
            }, { merge: true })
        } catch (e) {
            console.error('Error saving game state to cloud:', e)
        }
    }

    // ---- progressive game state updates ----
    async function updateGameProgress(gameId, updates, dateStr = today.value) {
        // Always update local state first
        updateLocalGameState(gameId, updates, dateStr)

        // If authenticated, also save to cloud
        if (user.value) {
            const currentState = getLocalGameState(gameId, dateStr)
            await saveGameStateToCloud(gameId, currentState, dateStr)
        }
    }

    // ---- local counters (daysPlayed/totalGames once per day) ----
    function markOpenedToday(gameId) {
        const stats = localUserStats.value[gameId]
        if (stats.lastPlayedDate !== today.value) {
            stats.daysPlayed += 1
            stats.totalGames += 1
            stats.lastPlayedDate = today.value
        }
    }

    // ---- local win/lose update (success-only streaks) ----
    function applyResultLocal(gameId, { success, attempts }) {
        const stats = localUserStats.value[gameId]
        const t = today.value
        const lastWin = stats.lastWinDate
        const gap = lastWin ? diffDaysAEST(lastWin, t) : null

        if (success) {
            const newStreak = (gap === 1) ? (stats.currentWinStreak + 1) : 1
            stats.currentWinStreak = newStreak
            stats.maxWinStreak = Math.max(stats.maxWinStreak, newStreak)
            stats.lastWinDate = t
        } else {
            stats.currentWinStreak = 0
        }

        const key = attemptsKey(attempts, success)
        stats.attemptsHistogram[key] = (stats.attemptsHistogram[key] || 0) + 1
    }

    // ---- reconcile user stats (merge local <-> cloud) ----
    async function reconcileUserStats(gameId) {
        if (!user.value) return
        const uref = doc(firestore, 'users', user.value.uid, 'dailyChallenges', gameId)
        const snap = await getDoc(uref)
        const cloud = snap.exists() ? snap.data() : null
        const local = localUserStats.value[gameId] || DEFAULT_USER_GAME_STATS()

        let chosen = cloud || local
        // prefer newer lastPlayedDate
        if (cloud && local) {
            const cLP = cloud.lastPlayedDate || null
            const lLP = local.lastPlayedDate || null
            chosen = !cLP && lLP ? local : (cLP && lLP ? (cLP > lLP ? cloud : local) : (cloud || local))
            chosen.maxWinStreak = Math.max(cloud.maxWinStreak || 0, local.maxWinStreak || 0)
            chosen.daysPlayed = Math.max(cloud.daysPlayed || 0, local.daysPlayed || 0)
            chosen.totalGames = Math.max(cloud.totalGames || 0, local.totalGames || 0)
            // histogram max per bucket (avoids double-counting)
            const keys = ['1', '2', '3', '4', '5', '6', 'fail']
            chosen.attemptsHistogram = keys.reduce((o, k) => {
                o[k] = Math.max(cloud.attemptsHistogram?.[k] || 0, local.attemptsHistogram?.[k] || 0)
                return o
            }, {})
        }

        await setDoc(uref, { gameId, ...chosen, updatedAt: serverTimestamp() }, { merge: true })
        localUserStats.value[gameId] = {
            currentWinStreak: chosen.currentWinStreak || 0,
            maxWinStreak: chosen.maxWinStreak || 0,
            daysPlayed: chosen.daysPlayed || 0,
            totalGames: chosen.totalGames || 0,
            lastPlayedDate: chosen.lastPlayedDate || null,
            lastWinDate: chosen.lastWinDate || null,
            attemptsHistogram: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, 'fail': 0, ...(chosen.attemptsHistogram || {}) }
        }
    }

    // ---- record a user result + aggregate updates (transaction) ----
    /**
     * payload = {
     *   date: 'YYYY-MM-DD' (default today),
     *   success: boolean,
     *   attempts: number,
     *   guesses: string[],
     *   metrics?: { timeTakenMs?: number, ...gameSpecific }
     * }
     */
    async function recordResult(gameId, payload) {
        const dateStr = payload.date || today.value
        // Always update local mirrors first (good UX, offline OK)
        markOpenedToday(gameId)
        applyResultLocal(gameId, { success: payload.success, attempts: payload.attempts })

        if (!user.value) return // if anonymous, we're done (local only)

        const uid = user.value.uid
        const userGameDocRef = doc(firestore, 'users', uid, 'dailyChallenges', gameId)
        const userDayDocRef = doc(firestore, 'users', uid, 'dailyChallenges', gameId, 'games', dateStr)
        const gameDocRef = doc(firestore, 'dailyChallenges', gameId)
        const dayDocRef = doc(firestore, 'dailyChallenges', gameId, 'games', dateStr)

        await runTransaction(firestore, async (tx) => {
            // ===== ALL READS FIRST =====
            const userDaySnap = await tx.get(userDayDocRef)
            const userGameSnap = await tx.get(userGameDocRef)
            const gameSnap = await tx.get(gameDocRef)
            const daySnap = await tx.get(dayDocRef)

            // ===== THEN ALL WRITES =====

            // 1) Check if already counted to prevent double-counting
            const alreadyCounted = userDaySnap.exists() && userDaySnap.data()?.countedInAggregates

            // 2) Update user day doc with completion data + current game state
            const currentGameState = getLocalGameState(gameId, dateStr)

            if (!userDaySnap.exists()) {
                tx.set(userDayDocRef, {
                    date: dateStr,
                    // Progressive state
                    rows: currentGameState.rows || [],
                    current: '', // Clear current since game is complete
                    kb: currentGameState.kb || {},
                    status: currentGameState.status || 'idle',
                    // Completion data
                    success: !!payload.success,
                    attempts: payload.attempts || 0,
                    guesses: payload.guesses || [],
                    metrics: payload.metrics || {},
                    completedAt: serverTimestamp(),
                    countedInAggregates: true,
                    lastUpdated: serverTimestamp()
                })
            } else {
                // Update existing doc
                tx.update(userDayDocRef, {
                    // Progressive state
                    rows: currentGameState.rows || userDaySnap.data().rows || [],
                    current: '', // Clear current since game is complete
                    kb: currentGameState.kb || userDaySnap.data().kb || {},
                    status: currentGameState.status || userDaySnap.data().status || 'idle',
                    // Completion data
                    success: !!payload.success,
                    attempts: payload.attempts || userDaySnap.data().attempts || 0,
                    guesses: payload.guesses || userDaySnap.data().guesses || [],
                    metrics: payload.metrics || userDaySnap.data().metrics || {},
                    completedAt: userDaySnap.data().completedAt || serverTimestamp(),
                    countedInAggregates: true,
                    lastUpdated: serverTimestamp()
                })
            }

            // 3) Update per-user per-game rollup
            const base = userGameSnap.exists() ? userGameSnap.data() : DEFAULT_USER_GAME_STATS()
            const t = dateStr

            // update daysPlayed/totalGames once per day (if this is user's first record for that date)
            const bumpDayPlay = base.lastPlayedDate !== t

            // streaks (success-only)
            const lastWin = base.lastWinDate
            let newStreak = base.currentWinStreak || 0
            if (payload.success) {
                const gap = lastWin ? diffDaysAEST(lastWin, t) : null
                newStreak = (gap === 1) ? (newStreak + 1) : 1
            } else {
                newStreak = 0
            }

            // histogram
            const key = attemptsKey(payload.attempts, payload.success)
            const nextHistogram = { ...(base.attemptsHistogram || {}) }
            nextHistogram[key] = (nextHistogram[key] || 0) + (alreadyCounted ? 0 : 1)

            tx.set(userGameDocRef, {
                gameId,
                currentWinStreak: newStreak,
                maxWinStreak: Math.max(base.maxWinStreak || 0, newStreak),
                daysPlayed: (base.daysPlayed || 0) + (bumpDayPlay ? 1 : 0),
                totalGames: (base.totalGames || 0) + (bumpDayPlay ? 1 : 0),
                lastPlayedDate: t,
                lastWinDate: payload.success ? t : (base.lastWinDate || null),
                attemptsHistogram: nextHistogram,
                updatedAt: serverTimestamp()
            }, { merge: true })

            // 4) Global aggregates — only if this event hasn't been counted yet
            if (!alreadyCounted) {
                // Game-level all-time stats
                const gameData = gameSnap.exists() ? gameSnap.data() : {}
                const gameStats = gameData.stats || {}

                tx.set(gameDocRef, {
                    gameId,
                    stats: {
                        totalPlays: (gameStats.totalPlays || 0) + 1,
                        totalWins: (gameStats.totalWins || 0) + (payload.success ? 1 : 0),
                        totalPlayers: (gameStats.totalPlayers || 0) + (bumpDayPlay ? 1 : 0),
                        attemptsHistogram: {
                            ...(gameStats.attemptsHistogram || {}),
                            [key]: ((gameStats.attemptsHistogram || {})[key] || 0) + 1
                        }
                    },
                    updatedAt: serverTimestamp()
                }, { merge: true })

                // Day-level stats
                const dayData = daySnap.exists() ? daySnap.data() : {}
                const dayStats = dayData.stats || {}

                tx.set(dayDocRef, {
                    date: dateStr,
                    solution: challenges.value[gameId]?.solution || dayData.solution || null,
                    stats: {
                        plays: (dayStats.plays || 0) + 1,
                        wins: (dayStats.wins || 0) + (payload.success ? 1 : 0),
                        players: (dayStats.players || 0) + (bumpDayPlay ? 1 : 0),
                        attemptsHistogram: {
                            ...(dayStats.attemptsHistogram || {}),
                            [key]: ((dayStats.attemptsHistogram || {})[key] || 0) + 1
                        }
                    },
                    updatedAt: serverTimestamp()
                }, { merge: true })
            }
        })

        // Update local state to clear current input since game is completed
        updateLocalGameState(gameId, { current: '' }, dateStr)
    }

    // ---- helpers / getters ----
    const solutionFor = (gameId) => computed(() => challenges.value[gameId]?.solution || null)
    const loadingFor = (gameId) => computed(() => !!loading.value[gameId])
    const errorFor = (gameId) => computed(() => errors.value[gameId] || '')
    const gameStateFor = (gameId, dateStr) => computed(() => getLocalGameState(gameId, dateStr || today.value))

    // ---- dev resets ----
    function resetLocal(gameId) {
        localUserStats.value[gameId] = DEFAULT_USER_GAME_STATS()
    }

    function resetGameState(gameId, dateStr = today.value) {
        updateLocalGameState(gameId, DEFAULT_GAME_STATE(), dateStr)
        if (user.value) {
            saveGameStateToCloud(gameId, DEFAULT_GAME_STATE(), dateStr)
        }
    }

    return {
        // state
        today, user, challenges, localUserStats,
        // lifecycle
        init,
        // fetch
        fetchDayChallenge,
        solutionFor, loadingFor, errorFor, gameStateFor,
        // usage
        markOpenedToday, recordResult,
        // game state management
        updateGameProgress, reconcileGameState, resetGameState,
        // dev
        resetLocal
    }
}, {
    persist: {
        key: 'mxnDaily',
        paths: ['localUserStats', 'gameStates']
    }
})