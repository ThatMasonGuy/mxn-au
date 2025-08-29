// src/stores/dailyGames/useWordleStore.js - Refactored with direct Firestore writes
import { defineStore } from 'pinia';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firestore } from '@/firebase';
import { doc, onSnapshot, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useDailyStore } from '../useDailyStore';

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
    _loadPromise: null,
    _lastLoadTime: null,
    _profileUnsubscribe: null,

    // Cached puzzle data (persisted until rollover)
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
          // Set up real-time listener for profile
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

          // Reconcile state with cloud if we have today's answer
          if (this.puzzleId && this.answer) {
            await this._reconcileCloudState(user.uid)
          }
        } else {
          this.profile = null
        }
      })
    },

    async _reconcileCloudState(uid) {
      if (!this.puzzleId || !this.answer) return

      const date = this.puzzleId.replace('wordle-', '')
      const dayRef = doc(firestore, 'users', uid, 'dailyChallenges', 'wordle', 'days', date)
      const daySnap = await getDoc(dayRef)

      if (daySnap.exists()) {
        const cloudState = daySnap.data()
        const cloudRows = Array.isArray(cloudState?.guesses)
          ? cloudState.guesses.map(g => ({
            guess: g.toUpperCase(),
            mask: gradeGuess(g, this.answer)
          }))
          : []

        this._ensureDay(date)
        const localRows = this.days[date].rows || []

        // Take whichever has more progress
        if (cloudRows.length > localRows.length) {
          this.days[date].rows = cloudRows
          if (cloudState?.outcome === 'win') this.days[date].status = 'won'
          else if (cloudState?.outcome === 'loss') this.days[date].status = 'lost'
        } else if (localRows.length > cloudRows.length) {
          // Local is ahead - sync to cloud in background
          this._saveStateToCloud(uid, date, true)
        }
      }
    },

    async _saveStateToCloud(uid, date, isBackground = false) {
      if (!uid) return

      try {
        const dayState = this.days[date]
        if (!dayState) return

        const dayRef = doc(firestore, 'users', uid, 'dailyChallenges', 'wordle', 'days', date)
        const guesses = dayState.rows.map(r => r.guess)
        const outcome = dayState.status === 'won' ? 'win' :
          dayState.status === 'lost' ? 'loss' : 'in_progress'

        await setDoc(dayRef, {
          guesses,
          outcome,
          updatedAt: new Date()
        }, { merge: true })

      } catch (error) {
        if (!isBackground) throw error
        console.warn('Background save failed:', error)
      }
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

    async loadDaily(preferServer = false) {
      const now = Date.now()

      // Check if we have valid cached data
      const cacheValid = this.puzzleId &&
        this.answer &&
        this.rolloverAt &&
        now < Date.parse(this.rolloverAt) &&
        this._lastLoadTime &&
        (now - this._lastLoadTime) < 300000 && // 5 minute cache
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
        // Only call cloud function to get puzzle data
        const call = httpsCallable(functions(), 'getDailyWordle')
        const { data } = await call({})

        this.puzzleId = data.puzzleId
        this.answer = (data.answer || '').toUpperCase()
        this.rolloverAt = data.rolloverAt
        this.isLocked = data.rolloverAt ? (Date.now() >= Date.parse(data.rolloverAt)) : false
        this._lastLoadTime = Date.now()

        const date = this.puzzleId.replace('wordle-', '')
        this._ensureDay(date)

        // If user is logged in, reconcile state
        const auth = getAuth()
        if (auth.currentUser) {
          await this._reconcileCloudState(auth.currentUser.uid)
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

    // Input handlers
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
      const nextRows = [...this.rows, { guess, mask }];
      this.days[date].rows = nextRows;
      this.days[date].currentInput = '';
    
      // Check for completion FIRST
      const isWin = mask.join('') === 'GGGGG'
      const isLoss = nextRows.length >= 6 && !isWin
    
      if (isWin) {
        this.days[date].status = 'won';
        this.days[date].currentInput = '';
        await this._submitCompletion();
      } else if (isLoss) {
        this.days[date].status = 'lost';
        this.days[date].currentInput = '';
        await this._submitCompletion();
      }
    
      // Save to cloud AFTER status is updated
      const auth = getAuth()
      if (auth.currentUser) {
        this._saveStateToCloud(auth.currentUser.uid, date, true)
      }
    },
    
    async _submitCompletion() {
      try {
        const call = httpsCallable(functions(), 'submitWordleCompletion')
        const guesses = this.rows.map(r => r.guess)
        await call({
          puzzleId: this.puzzleId,
          guesses,
          outcome: this.status === 'won' ? 'win' : 'loss'
        })
      } catch (error) {
        console.error('Error submitting completion:', error)
      }
    },

    async refreshIfRolledOver() {
      if (!this.rolloverAt) return;
      const rolled = Date.now() >= Date.parse(this.rolloverAt);
      if (rolled) {
        this.isLocked = true;
        this.answer = null;
        this._lastLoadTime = null;
        await this.loadDaily(true);
      }
    },

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

    $dispose() {
      if (this._profileUnsubscribe) {
        this._profileUnsubscribe()
        this._profileUnsubscribe = null
      }
    }
  },

  persist: {
    key: 'mxn:daily:wordle',
    paths: ['days', 'lastSeenDate', 'profile', 'puzzleId', 'answer', 'rolloverAt'],
    storage: localStorage,
  },
});