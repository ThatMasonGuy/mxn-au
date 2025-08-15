// src/stores/useWordleStore.js
import { defineStore } from 'pinia';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDailyStore } from '../useDailyStore'

// ===== Helpers =====
const REGION = 'australia-southeast1';
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
        // Ephemeral session state (not persisted)
        loading: true,
        puzzleId: null,
        answer: null,
        rolloverAt: null,
        isLocked: false,

        // Persisted state (per-day UI progress)
        days: {},
        lastSeenDate: null,
        profile: null,
    }),

    getters: {
        todayDate: () => dateStrUTC(),
        todayState(state) {
            const key = state.lastSeenDate || dateStrUTC();
            if (!state.days[key]) return { rows: [], status: 'idle', currentInput: '' };
            return state.days[key];
        },
        rows() {
            return this.todayState.rows || [];
        },
        status() {
            return this.todayState.status || 'idle';
        },
        currentInput() {
            return this.todayState.currentInput || '';
        },
        guessesCount() {
            return this.rows.length;
        },
        isComplete() { return this.status === 'won' || this.status === 'lost'; },
        canType() {
            return !this.loading && !this.isLocked && !this.isComplete && this.guessesCount < 6;
        },
    },

    actions: {
        // --- Internal: ensure day container exists in persisted state ---
        _ensureDay(dateStr) {
            if (!this.days[dateStr]) {
                this.days[dateStr] = { rows: [], status: 'idle', currentInput: '' };
            }
            if (this.lastSeenDate !== dateStr) this.lastSeenDate = dateStr;
        },

        setAllowedWords(set) { this._allowedWords = set; },
        _isValidWord(word) {
            if (!word || word.length !== 5) return false;
            if (!this._allowedWords) return true; // no list = permissive
            return this._allowedWords.has(word.toLowerCase());
        },

        // --- Initialization / auth wiring ---
        initAuthListener() {
            const auth = getAuth();
            onAuthStateChanged(auth, async () => {
                if (this.puzzleId) {
                    try { await this.loadDaily(true /* preferServer */); } catch { /* ignore */ }
                }
            });
        },

        // --- Sync with combined daily store ---
        _syncWithDailyStore() {
            try {
                const dailyStore = useDailyStore()

                if (this.profile) {
                    dailyStore.updateGameStats('wordle', this.profile)
                }

                if (this.status && this.status !== 'idle') {
                    dailyStore.updateGameStatus('wordle', this.status)
                }

                if (this.rolloverAt) {
                    dailyStore.rolloverAt = this.rolloverAt
                }
            } catch (error) {
                console.warn('Error syncing with daily store:', error)
            }
        },

        // Modified _finalize method to sync with daily store
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

                if (data?.streak) {
                    this.profile = data.streak
                }

                this._syncWithDailyStore()

                const loggedIn = !!getAuth().currentUser
                if (loggedIn) await this.loadDaily(true)

                this.lastFinalizeError = null
            } catch (e) {
                this.lastFinalizeError = e?.message || String(e)
            }
        },

        // Modified loadDaily to sync with daily store
        async loadDaily(preferServer = false) {
            this.loading = true
            const call = httpsCallable(functions(), 'getDailyWordle')
            const { data } = await call({})
            const { puzzleId, packet, userState, rolloverAt } = data

            this.puzzleId = puzzleId
            this.answer = (packet?.answer || '').toUpperCase()
            this.rolloverAt = rolloverAt
            this.isLocked = rolloverAt ? (Date.now() >= Date.parse(rolloverAt)) : false

            const date = puzzleId.replace('wordle-', '')
            this._ensureDay(date)

            const auth = getAuth()
            const loggedIn = !!auth.currentUser

            const remoteRows = Array.isArray(userState?.guesses)
                ? userState.guesses.map(g => ({ guess: g.toUpperCase(), mask: gradeGuess(g, this.answer) }))
                : []
            const localRows = this.days[date].rows || []

            if (loggedIn) {
                if (remoteRows.length > localRows.length || preferServer) {
                    this.days[date].rows = remoteRows
                    if (userState?.outcome === 'win') this.days[date].status = 'won'
                    else if (userState?.outcome === 'loss') this.days[date].status = 'lost'
                } else if (localRows.length > remoteRows.length) {
                    for (let i = remoteRows.length; i < localRows.length; i++) {
                        const r = localRows[i]
                        httpsCallable(functions(), 'saveWordleProgress')({
                            puzzleId: this.puzzleId, guess: r.guess, rowIndex: i
                        }).catch(() => { })
                    }
                }
            }

            try {
                const { useDailyStore } = await import('@/stores/useDailyStore')
                const dailyStore = useDailyStore()
                
                if (dailyStore.initialized && !dailyStore.user) {
                    await dailyStore.refreshGuestStats()
                }
            } catch (error) {
                console.warn('Error syncing Wordle data with daily store:', error)
            }

            this.days[date].currentInput = clamp5(this.days[date].currentInput)
            if (this.status !== 'idle') this.days[date].currentInput = ''
            this._syncWithDailyStore()
            this.loading = false
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

            httpsCallable(functions(), 'saveWordleProgress')({ puzzleId: this.puzzleId, guess, rowIndex }).catch(() => { });

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
            return `${header}\n${result}\n\n${lines.join('\n')}\n\nPlay at https://mxn.au/daily?game=word`;
        },

        // --- Hard reset for debugging (kept explicit) ---
        hardResetLocal() {
            this.days = {};
            this.lastSeenDate = null;
            this.profile = null;
            this.answer = null;
            this.puzzleId = null;
            this.rolloverAt = null;
            this.isLocked = false;
        },
    },

    // Persist only the per-day UI state + profile snapshot, not the answer
    persist: {
        key: 'mxn:daily:wordle',
        paths: ['days', 'lastSeenDate', 'profile'],
        storage: localStorage,
    },
});