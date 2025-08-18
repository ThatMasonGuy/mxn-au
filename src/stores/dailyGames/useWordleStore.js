// src/stores/dailyGames/useWordleStore.js - Fixed version with proper caching
import { defineStore } from 'pinia';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firestore } from '@/firebase';
import { doc, onSnapshot, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useDailyStore } from '../useDailyStore'

// ===== Helpers =====
const REGION = 'australia-southeast2';
const functions = () => getFunctions(undefined, REGION);

function gradeGuess(guess, solution) {
  const g = guess.toUpperCase();
  const s = solution.toUpperCase();
  const res = Array(5).fill('B');
  const remain = {};
  for (let i = 0; i < 5; i++) {
    if (g[i] === s[i]) res[i] = 'G';
    else remain[s[i]] = (remain[s[i]] || 0) + 1;
  }
  for (let i = 0; i < 5; i++) {
    if (res[i] !== 'G') {
      const c = g[i];
      if (remain[c] > 0) { res[i] = 'Y'; remain[c]--; }
    }
  }
  return res;
}

function dateStrUTC(d = new Date()) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function clamp5(s) {
  return (s || '').replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase();
}

export const useWordleStore = defineStore('wordle', {
  state: () => ({
    // Ephemeral
    loading: true,
    isLocked: false,
    lastFinalizeError: null,
    _loadPromise: null, // Track ongoing load to prevent duplicate calls
    _lastLoadTime: null, // Track when we last loaded
    _profileUnsubscribe: null, // Store unsubscribe function for profile listener

    // Persisted per-day puzzle
    puzzleId: null,
    answer: null,
    rolloverAt: null,

    // Per-day play state
    days: {},
    lastSeenDate: null,
    profile: null,

    _allowedWords: null
  }),

  getters: {
    todayDate: () => dateStrUTC(),
    todayState(state) {
      const key = state.lastSeenDate || dateStrUTC()
      if (!state.days[key]) return { rows: [], status: 'idle', currentInput: '' }
      return state.days[key]
    },
    rows() { return this.todayState.rows || [] },
    status() { return this.todayState.status || 'idle' },
    currentInput() { return this.todayState.currentInput || '' },
    guessesCount() { return this.rows.length },
    isComplete() { return this.status === 'won' || this.status === 'lost' },
    canType() {
      return !this.loading && !this.isLocked && !this.isComplete && this.guessesCount < 6
    },
  },

  actions: {
    _ensureDay(dateStr) {
      if (!this.days[dateStr]) {
        this.days[dateStr] = { rows: [], status: 'idle', currentInput: '' }
      }
      if (this.lastSeenDate !== dateStr) this.lastSeenDate = dateStr
    },

    setAllowedWords(set) { this._allowedWords = set },
    _isValidWord(word) {
      if (!word || word.length !== 5) return false
      if (!this._allowedWords) return true
      return this._allowedWords.has(word.toLowerCase())
    },

    initAuthListener() {
      const auth = getAuth()

      // Clean up old listener if it exists
      if (this._profileUnsubscribe) {
        this._profileUnsubscribe()
        this._profileUnsubscribe = null
      }

      onAuthStateChanged(auth, async (user) => {
        // Clean up old listener when auth changes
        if (this._profileUnsubscribe) {
          this._profileUnsubscribe()
          this._profileUnsubscribe = null
        }

        if (user) {
          // Set up real-time listener for user's Wordle profile
          const profileRef = doc(firestore, 'users', user.uid, 'dailyChallenges', 'wordle')
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
                histogram: data.attemptsHistogram ?
                  [1, 2, 3, 4, 5, 6].map(i => data.attemptsHistogram[String(i)] || 0) :
                  [0, 0, 0, 0, 0, 0]
              }
              this._syncWithDailyStore()
            }
          })

          // Load today's game state
          if (this.puzzleId) {
            const date = this.puzzleId.replace('wordle-', '')
            const dayRef = doc(firestore, 'users', user.uid, 'dailyChallenges', 'wordle', 'days', date)
            const daySnap = await getDoc(dayRef)
            if (daySnap.exists()) {
              const userState = daySnap.data()
              const remoteRows = Array.isArray(userState?.guesses)
                ? userState.guesses.map(g => ({
                  guess: g.toUpperCase(),
                  mask: gradeGuess(g, this.answer)
                }))
                : []

              if (remoteRows.length > 0) {
                this.days[date].rows = remoteRows
                if (userState?.outcome === 'win') this.days[date].status = 'won'
                else if (userState?.outcome === 'loss') this.days[date].status = 'lost'
              }
            }
          }
        } else {
          // Guest user - clear profile
          this.profile = null
        }
      })
    },

    _syncWithDailyStore() {
      try {
        const dailyStore = useDailyStore()
        if (this.profile) dailyStore.updateGameStats?.('wordle', this.profile)
        if (this.status && this.status !== 'idle') dailyStore.updateGameStatus?.('wordle', this.status)
        if (this.rolloverAt) dailyStore.rolloverAt = this.rolloverAt
      } catch (error) {
        console.warn('Error syncing with daily store:', error)
      }
    },

    async _finalize() {
      const call = httpsCallable(functions(), 'submitWordleOutcome')
      const guesses = this.rows.map(r => r.guess)
      try {
        const { data } = await call({ puzzleId: this.puzzleId, guesses })

        if (data?.outcome) {
          const date = this.puzzleId.replace('wordle-', '')
          this.days[date].status = data.outcome === 'win' ? 'won' : 'lost'
          this.days[date].completedAt = Date.now()
        }

        // Profile will update via the real-time listener
        this.lastFinalizeError = null
      } catch (e) {
        this.lastFinalizeError = e?.message || String(e)
      }
    },

    async loadDaily(preferServer = false) {
      const now = Date.now()

      // Check if we have a valid cache and it's not expired
      const cacheValid = this.puzzleId &&
        this.answer &&
        this.rolloverAt &&
        now < Date.parse(this.rolloverAt) &&
        this._lastLoadTime &&
        (now - this._lastLoadTime) < 60000 && // Cache for 1 minute
        !preferServer

      if (cacheValid) {
        this.loading = false
        return
      }

      // If we're already loading, return the existing promise
      if (this._loadPromise && !preferServer) {
        return this._loadPromise
      }

      // Create new load promise
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
        const call = httpsCallable(functions(), 'getDailyWordle')
        const { data } = await call({})
        const { puzzleId, packet, userState, rolloverAt } = data

        this.puzzleId = puzzleId
        this.answer = (packet?.answer || '').toUpperCase()
        this.rolloverAt = rolloverAt
        this.isLocked = rolloverAt ? (Date.now() >= Date.parse(rolloverAt)) : false
        this._lastLoadTime = Date.now()

        const date = puzzleId.replace('wordle-', '')
        this._ensureDay(date)

        const auth = getAuth()
        const loggedIn = !!auth.currentUser

        const remoteRows = Array.isArray(userState?.guesses)
          ? userState.guesses.map(g => ({
            guess: g.toUpperCase(),
            mask: gradeGuess(g, this.answer)
          }))
          : []
        const localRows = this.days[date].rows || []

        if (loggedIn) {
          if (remoteRows.length > localRows.length || preferServer) {
            this.days[date].rows = remoteRows
            if (userState?.outcome === 'win') this.days[date].status = 'won'
            else if (userState?.outcome === 'loss') this.days[date].status = 'lost'
          } else if (localRows.length > remoteRows.length) {
            // Save any local progress that's ahead of server
            for (let i = remoteRows.length; i < localRows.length; i++) {
              const r = localRows[i]
              httpsCallable(functions(), 'saveWordleProgress')({
                puzzleId: this.puzzleId,
                guess: r.guess,
                rowIndex: i
              }).catch(() => { })
            }
          }
        }

        this.days[date].currentInput = clamp5(this.days[date].currentInput)
        if (this.status !== 'idle') this.days[date].currentInput = ''
        this._syncWithDailyStore()

      } catch (error) {
        console.error('Error loading daily wordle:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // --- Input handlers (UI can call these directly) ---
    typeLetter(ch) {
      if (!this.canType) return;
      const date = this.puzzleId?.replace('wordle-', '') || dateStrUTC();
      this._ensureDay(date);
      const s = clamp5(this.days[date].currentInput + ch);
      if (s.length <= 5) this.days[date].currentInput = s;
    },

    backspace() {
      if (!this.canType) return;
      const date = this.puzzleId?.replace('wordle-', '') || dateStrUTC();
      this._ensureDay(date);
      this.days[date].currentInput = (this.days[date].currentInput || '').slice(0, -1);
    },

    async enter() {
      if (!this.canType) return;
      const guess = clamp5(this.currentInput);
      if (guess.length !== 5) return;

      if (this.rows.some(r => r.guess === guess)) {
        throw new Error('duplicate_guess');
      }

      if (!this._isValidWord(guess)) {
        throw new Error('invalid_word');
      }

      const mask = gradeGuess(guess, this.answer);
      const date = this.puzzleId.replace('wordle-', '');
      const rowIndex = this.rows.length;
      const nextRows = [...this.rows, { guess, mask }];
      this.days[date].rows = nextRows;
      this.days[date].currentInput = '';

      // Save progress to server
      httpsCallable(functions(), 'saveWordleProgress')({
        puzzleId: this.puzzleId,
        guess,
        rowIndex
      }).catch(() => { });

      if (mask.join('') === 'GGGGG') {
        this.days[date].status = 'won';
        this.days[date].currentInput = '';
        await this._finalize();
      } else if (nextRows.length >= 6) {
        this.days[date].status = 'lost';
        this.days[date].currentInput = '';
        await this._finalize();
      }
    },

    // --- Force refresh when rollover hits or user taps "New puzzle" ---
    async refreshIfRolledOver() {
      if (!this.rolloverAt) return;
      const rolled = Date.now() >= Date.parse(this.rolloverAt);
      if (rolled) {
        this.isLocked = true;
        this.answer = null;
        this._lastLoadTime = null; // Clear cache
        await this.loadDaily(true);
      }
    },

    // --- Utilities for UI ---
    maskToEmoji(maskArr) {
      const map = { G: '🟩', Y: '🟨', B: '⬛' };
      return maskArr.map(c => map[c] || '⬛').join('');
    },

    shareText() {
      const date = this.puzzleId?.replace('wordle-', '') || dateStrUTC();
      const lines = this.rows.map(r => this.maskToEmoji(r.mask));
      const header = `MXN Daily — Wordle ${date}`;
      const result = this.status === 'won' ? `${this.rows.length}/6` : 'X/6';
      return `${header}\n${result}\n\n${lines.join('\n')}\n\nPlay at https://mxn.au/daily?game=wordle`;
    },

    // --- Hard reset for debugging (kept explicit) ---
    hardResetLocal() {
      if (this._profileUnsubscribe) {
        this._profileUnsubscribe()
        this._profileUnsubscribe = null
      }
      this.days = {};
      this.lastSeenDate = null;
      this.profile = null;
      this.answer = null;
      this.puzzleId = null;
      this.rolloverAt = null;
      this.isLocked = false;
      this._lastLoadTime = null;
      this._loadPromise = null;
    },

    // Clean up listeners when store is destroyed
    $dispose() {
      if (this._profileUnsubscribe) {
        this._profileUnsubscribe()
        this._profileUnsubscribe = null
      }
    }
  },

  // Persist only the per-day UI state + profile snapshot, not the answer
  persist: {
    key: 'mxn:daily:wordle',
    paths: ['days', 'lastSeenDate', 'profile'],
    storage: localStorage,
  },
});