// src/stores/dailyGames/useConnectionsStore.js
import { defineStore } from 'pinia';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firestore } from '@/firebase';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { useDailyStore } from '../useDailyStore';

const REGION = 'australia-southeast2';
const functions = () => getFunctions(undefined, REGION);

function dateStrUTC(d = new Date()) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

// Shuffle array using Fisher-Yates
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export const useConnectionsStore = defineStore('connections', {
    state: () => ({
        // Loading states
        loading: true,
        isLocked: false,
        _loadPromise: null,
        _lastLoadTime: null,
        _profileUnsubscribe: null,

        // Puzzle data
        puzzleId: null,
        groups: null, // Will contain easy, medium, hard, expert arrays
        rolloverAt: null,

        // Game state per day
        days: {},
        lastSeenDate: null,

        // User profile
        profile: null,

        // Constants
        MAX_MISTAKES: 4,
        GROUP_SIZE: 4,
        DIFFICULTY_COLORS: {
            easy: { bg: 'bg-yellow-500/30', border: 'border-yellow-500/50', text: 'text-yellow-100' },
            medium: { bg: 'bg-emerald-500/30', border: 'border-emerald-500/50', text: 'text-emerald-100' },
            hard: { bg: 'bg-blue-500/30', border: 'border-blue-500/50', text: 'text-blue-100' },
            expert: { bg: 'bg-purple-500/30', border: 'border-purple-500/50', text: 'text-purple-100' }
        },
        DIFFICULTY_ORDER: ['easy', 'medium', 'hard', 'expert']
    }),

    getters: {
        todayDate: () => dateStrUTC(),

        todayState(state) {
            const key = state.lastSeenDate || dateStrUTC();
            if (!state.days[key]) {
                return {
                    selected: [],
                    foundGroups: [],
                    mistakes: 0,
                    attempts: [],
                    status: 'idle',
                    boardWords: []
                };
            }
            return state.days[key];
        },

        selected() { return this.todayState.selected || []; },
        foundGroups() { return this.todayState.foundGroups || []; },
        mistakes() { return this.todayState.mistakes || 0; },
        attempts() { return this.todayState.attempts || []; },
        status() { return this.todayState.status || 'idle'; },
        boardWords() { return this.todayState.boardWords || []; },

        remainingLives() { return this.MAX_MISTAKES - this.mistakes; },
        isComplete() { return this.status === 'won' || this.status === 'lost'; },
        canSubmit() { return this.selected.length === this.GROUP_SIZE && !this.isComplete; },

        // Get words still on the board (not in found groups)
        availableWords() {
            const found = new Set(this.foundGroups.flatMap(g => g.words));
            return this.boardWords.filter(w => !found.has(w));
        }
    },

    actions: {
        _ensureDay(dateStr) {
            if (!this.days[dateStr]) {
                this.days[dateStr] = {
                    selected: [],
                    foundGroups: [],
                    mistakes: 0,
                    attempts: [],
                    status: 'idle',
                    boardWords: []
                };
            }
            if (this.lastSeenDate !== dateStr) this.lastSeenDate = dateStr;
        },

        initAuthListener() {
            const auth = getAuth();

            if (this._profileUnsubscribe) {
                this._profileUnsubscribe();
                this._profileUnsubscribe = null;
            }

            onAuthStateChanged(auth, async (user) => {
                if (this._profileUnsubscribe) {
                    this._profileUnsubscribe();
                    this._profileUnsubscribe = null;
                }

                if (user) {
                    // Set up real-time listener for user's Connections profile
                    const profileRef = doc(firestore, 'users', user.uid, 'dailyChallenges', 'connections');
                    this._profileUnsubscribe = onSnapshot(profileRef, (snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.data();
                            this.profile = {
                                currentStreak: data.currentStreak || 0,
                                maxStreak: data.maxStreak || 0,
                                wins: data.wins || 0,
                                losses: data.losses || 0,
                                totalPlays: data.totalPlays || 0,
                                winPercentage: data.totalPlays ? Math.round((data.wins / data.totalPlays) * 100) : 0,
                                gamesPlayed: data.totalPlays || 0,
                                lastPlayedUTC: data.lastPlayedUTC || null
                            };
                            this._syncWithDailyStore();
                        }
                    });

                    // Load today's game state if we have a puzzle
                    if (this.puzzleId) {
                        const date = this.puzzleId.replace('connections-', '');
                        const dayRef = doc(firestore, 'users', user.uid, 'dailyChallenges', 'connections', 'days', date);
                        const daySnap = await getDoc(dayRef);
                        if (daySnap.exists()) {
                            const userState = daySnap.data();
                            this._restoreUserState(date, userState);
                        }
                    }
                } else {
                    this.profile = null;
                }
            });
        },

        _syncWithDailyStore() {
            try {
                const dailyStore = useDailyStore();
                if (this.profile) dailyStore.updateGameStats?.('connections', this.profile);
                if (this.status && this.status !== 'idle') dailyStore.updateGameStatus?.('connections', this.status);
                if (this.rolloverAt) dailyStore.rolloverAt = this.rolloverAt;
            } catch (error) {
                console.warn('Error syncing with daily store:', error);
            }
        },

        _restoreUserState(date, userState) {
            this._ensureDay(date);

            if (userState.foundGroups) {
                this.days[date].foundGroups = userState.foundGroups;
            }
            if (typeof userState.mistakes === 'number') {
                this.days[date].mistakes = userState.mistakes;
            }
            if (userState.attempts) {
                this.days[date].attempts = userState.attempts;
            }
            if (userState.outcome === 'win') {
                this.days[date].status = 'won';
            } else if (userState.outcome === 'loss') {
                this.days[date].status = 'lost';
            }
        },

        async loadDaily(preferServer = false) {
            const now = Date.now();

            // Check cache validity
            const cacheValid = this.puzzleId &&
                this.groups &&
                this.rolloverAt &&
                now < Date.parse(this.rolloverAt) &&
                this._lastLoadTime &&
                (now - this._lastLoadTime) < 60000 && // 1 minute cache
                !preferServer;

            if (cacheValid) {
                this.loading = false;
                return;
            }

            if (this._loadPromise && !preferServer) {
                return this._loadPromise;
            }

            this._loadPromise = this._doLoad(preferServer);

            try {
                await this._loadPromise;
            } finally {
                this._loadPromise = null;
            }
        },

        async _doLoad(preferServer = false) {
            this.loading = true;

            try {
                const call = httpsCallable(functions(), 'getDailyConnections');
                const { data } = await call({});
                const { puzzleId, packet, userState, rolloverAt } = data;

                this.puzzleId = puzzleId;
                this.groups = packet?.answer || null;
                this.rolloverAt = rolloverAt;
                this.isLocked = rolloverAt ? (Date.now() >= Date.parse(rolloverAt)) : false;
                this._lastLoadTime = Date.now();

                const date = puzzleId.replace('connections-', '');
                this._ensureDay(date);

                // Create shuffled board of all words
                if (this.groups && (!this.days[date].boardWords || this.days[date].boardWords.length === 0)) {
                    const allWords = [
                        ...this.groups.easy,
                        ...this.groups.medium,
                        ...this.groups.hard,
                        ...this.groups.expert
                    ];
                    this.days[date].boardWords = shuffleArray(allWords);
                }

                const auth = getAuth();
                const loggedIn = !!auth.currentUser;

                if (loggedIn && userState) {
                    // Merge server state with local state
                    const serverFoundCount = userState.foundGroups?.length || 0;
                    const localFoundCount = this.days[date].foundGroups?.length || 0;

                    if (serverFoundCount > localFoundCount || preferServer) {
                        this._restoreUserState(date, userState);
                    } else if (localFoundCount > serverFoundCount) {
                        // Save local progress to server
                        await this._saveProgress();
                    }
                }

                this._syncWithDailyStore();

            } catch (error) {
                console.error('Error loading daily connections:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Game actions
        toggleWord(word) {
            if (this.isComplete || !this.boardWords.includes(word)) return;

            const date = this.puzzleId?.replace('connections-', '') || dateStrUTC();
            this._ensureDay(date);

            const found = new Set(this.foundGroups.flatMap(g => g.words));
            if (found.has(word)) return; // Already found

            const selected = [...this.days[date].selected];
            const index = selected.indexOf(word);

            if (index >= 0) {
                selected.splice(index, 1);
            } else if (selected.length < this.GROUP_SIZE) {
                selected.push(word);
            }

            this.days[date].selected = selected;
        },

        deselectAll() {
            if (this.isComplete) return;
            const date = this.puzzleId?.replace('connections-', '') || dateStrUTC();
            this._ensureDay(date);
            this.days[date].selected = [];
        },

        async submitGuess() {
            if (!this.canSubmit) return;

            const date = this.puzzleId.replace('connections-', '');
            const guess = [...this.selected].sort(); // Sort for consistent comparison

            // Check if already attempted
            const previousAttempts = this.attempts.map(a => [...a].sort().join(','));
            if (previousAttempts.includes(guess.join(','))) {
                return { result: 'duplicate', message: 'Already tried this combination' };
            }

            // Record attempt
            this.days[date].attempts = [...this.attempts, guess];

            // Check each difficulty group
            for (const difficulty of this.DIFFICULTY_ORDER) {
                const group = [...this.groups[difficulty]].sort();
                if (guess.join(',') === group.join(',')) {
                    // Correct!
                    const foundGroup = {
                        difficulty,
                        words: this.groups[difficulty],
                        foundAt: Date.now()
                    };

                    this.days[date].foundGroups = [...this.foundGroups, foundGroup];
                    this.days[date].selected = [];

                    // Check if game is won
                    if (this.days[date].foundGroups.length === 4) {
                        this.days[date].status = 'won';
                        await this._finalize();
                    } else {
                        await this._saveProgress();
                    }

                    return { result: 'correct', difficulty, group: foundGroup };
                }
            }

            // Check for "one away" (3 out of 4 correct)
            let oneAwayDifficulty = null;
            for (const difficulty of this.DIFFICULTY_ORDER) {
                const group = this.groups[difficulty];
                const intersection = guess.filter(word => group.includes(word));
                if (intersection.length === 3) {
                    oneAwayDifficulty = difficulty;
                    break;
                }
            }

            // Incorrect
            this.days[date].mistakes++;
            this.days[date].selected = [];

            if (this.days[date].mistakes >= this.MAX_MISTAKES) {
                this.days[date].status = 'lost';
                await this._finalize();
                return { result: 'lost' };
            }

            await this._saveProgress();

            if (oneAwayDifficulty) {
                return { result: 'one-away', message: 'One away!' };
            }

            return { result: 'incorrect' };
        },

        async _saveProgress() {
            const auth = getAuth();
            if (!auth.currentUser) return;

            try {
                const call = httpsCallable(functions(), 'saveConnectionsProgress');
                await call({
                    puzzleId: this.puzzleId,
                    foundGroups: this.foundGroups,
                    mistakes: this.mistakes,
                    attempts: this.attempts
                });
            } catch (error) {
                console.error('Error saving progress:', error);
            }
        },

        async _finalize() {
            try {
                const call = httpsCallable(functions(), 'submitConnectionsOutcome');
                const { data } = await call({
                    puzzleId: this.puzzleId,
                    foundGroups: this.foundGroups,
                    mistakes: this.mistakes,
                    attempts: this.attempts
                });

                if (data?.outcome) {
                    const date = this.puzzleId.replace('connections-', '');
                    this.days[date].status = data.outcome === 'win' ? 'won' : 'lost';
                    this.days[date].completedAt = Date.now();
                }

                // Profile will update via listener

            } catch (error) {
                console.error('Error finalizing game:', error);
            }
        },

        async refreshIfRolledOver() {
            if (!this.rolloverAt) return;
            const rolled = Date.now() >= Date.parse(this.rolloverAt);
            if (rolled) {
                this.isLocked = true;
                this.groups = null;
                this._lastLoadTime = null;
                await this.loadDaily(true);
            }
        },

        shareText() {
            const date = this.puzzleId?.replace('connections-', '') || dateStrUTC();
            const header = `MXN Daily — Connections ${date}`;
            const result = this.status === 'won'
                ? `Solved with ${this.mistakes} mistake${this.mistakes !== 1 ? 's' : ''}!`
                : 'Better luck tomorrow!';

            // Create emoji representation
            const emojiMap = {
                'easy': '🟨',
                'medium': '🟩',
                'hard': '🟦',
                'expert': '🟪'
            };

            const grid = this.foundGroups.map(g => emojiMap[g.difficulty].repeat(4)).join('\n');

            return `${header}\n${result}\n\n${grid}\n\nPlay at https://mxn.au/daily?game=connections`;
        },

        hardResetLocal() {
            if (this._profileUnsubscribe) {
                this._profileUnsubscribe();
                this._profileUnsubscribe = null;
            }
            this.days = {};
            this.lastSeenDate = null;
            this.profile = null;
            this.groups = null;
            this.puzzleId = null;
            this.rolloverAt = null;
            this.isLocked = false;
            this._lastLoadTime = null;
            this._loadPromise = null;
        },

        $dispose() {
            if (this._profileUnsubscribe) {
                this._profileUnsubscribe();
                this._profileUnsubscribe = null;
            }
        }
    },

    persist: {
        key: 'mxn:daily:connections',
        paths: ['days', 'lastSeenDate', 'profile'],
        storage: localStorage
    }
});