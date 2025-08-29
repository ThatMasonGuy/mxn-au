// src/stores/dailyGames/useConnectionsStore.js - Refactored with separate animation methods
import { defineStore } from 'pinia';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firestore } from '@/firebase';
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
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

        // Cached puzzle data (persisted until rollover)
        puzzleId: null,
        groups: null, // Will contain easy, medium, hard, expert arrays
        categories: null, // Will contain the actual group titles
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
                                lastPlayedUTC: data.lastPlayedUTC || null,
                                perfectGames: data.perfectGames || 0,
                                averageMistakes: data.averageMistakes || 0
                            };
                            this._syncWithDailyStore();
                        }
                    });

                    // Reconcile state with cloud if we have today's groups
                    if (this.puzzleId && this.groups) {
                        await this._reconcileCloudState(user.uid);
                    }
                } else {
                    this.profile = null;
                }
            });
        },

        async _reconcileCloudState(uid) {
            if (!this.puzzleId || !this.groups) return;

            const date = this.puzzleId.replace('connections-', '');
            const dayRef = doc(firestore, 'users', uid, 'dailyChallenges', 'connections', 'days', date);
            const daySnap = await getDoc(dayRef);

            if (daySnap.exists()) {
                const cloudState = daySnap.data();

                this._ensureDay(date);
                const localState = this.days[date];
                const localProgress = localState.foundGroups?.length || 0;
                const cloudProgress = cloudState.foundGroups?.length || 0;

                // Take whichever has more progress
                if (cloudProgress > localProgress) {
                    // Convert attempts map back to array format
                    let attemptsArray = [];
                    if (cloudState.attempts && typeof cloudState.attempts === 'object') {
                        // Sort by attempt number and convert to array
                        const attemptKeys = Object.keys(cloudState.attempts).sort((a, b) => {
                            const numA = parseInt(a.replace('attempt_', ''));
                            const numB = parseInt(b.replace('attempt_', ''));
                            return numA - numB;
                        });
                        attemptsArray = attemptKeys.map(key => cloudState.attempts[key]);
                    }

                    // Ensure found groups have titles (add fallback if missing)
                    const foundGroupsWithTitles = (cloudState.foundGroups || []).map(group => ({
                        difficulty: group.difficulty,
                        words: group.words,
                        title: group.title || this._getDefaultTitle(group.difficulty),
                        foundAt: group.foundAt || Date.now()
                    }));

                    this.days[date] = {
                        selected: [],
                        foundGroups: foundGroupsWithTitles,
                        mistakes: cloudState.mistakes || 0,
                        attempts: attemptsArray,
                        status: cloudState.outcome === 'win' ? 'won' :
                            cloudState.outcome === 'loss' ? 'lost' : 'idle',
                        boardWords: localState.boardWords || [] // Keep existing board
                    };
                } else if (localProgress > cloudProgress) {
                    // Local is ahead - sync to cloud in background
                    this._saveStateToCloud(uid, date, true);
                }
            }
        },

        async _saveStateToCloud(uid, date, isBackground = false) {
            if (!uid) return;

            try {
                const dayState = this.days[date];
                if (!dayState) return;

                const dayRef = doc(firestore, 'users', uid, 'dailyChallenges', 'connections', 'days', date);
                const outcome = dayState.status === 'won' ? 'win' :
                    dayState.status === 'lost' ? 'loss' : 'in_progress';

                // Clean the data for Firestore - only serialize safe properties
                const foundGroupsClean = (dayState.foundGroups || []).map(group => ({
                    difficulty: group.difficulty,
                    words: group.words,
                    title: group.title || this._getDefaultTitle(group.difficulty),
                    foundAt: group.foundAt || Date.now()
                }));

                // Convert attempts array-of-arrays to map-of-arrays for Firestore
                const attemptsMap = {};
                if (Array.isArray(dayState.attempts)) {
                    dayState.attempts.forEach((attempt, index) => {
                        if (Array.isArray(attempt)) {
                            attemptsMap[`attempt_${index + 1}`] = attempt;
                        }
                    });
                }

                await setDoc(dayRef, {
                    foundGroups: foundGroupsClean,
                    mistakes: dayState.mistakes || 0,
                    attempts: attemptsMap,
                    outcome,
                    updatedAt: new Date().toISOString()
                }, { merge: true });

            } catch (error) {
                if (!isBackground) throw error;
                console.warn('Background save failed:', error);
            }
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

        async loadDaily(preferServer = false) {
            const now = Date.now();

            // Check cache validity
            const cacheValid = this.puzzleId &&
                this.groups &&
                this.rolloverAt &&
                now < Date.parse(this.rolloverAt) &&
                this._lastLoadTime &&
                (now - this._lastLoadTime) < 300000 && // 5 minute cache
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

                this.puzzleId = data.puzzleId;
                this.groups = data.answer || null;
                this.categories = data.categories || null;
                this.rolloverAt = data.rolloverAt;
                this.isLocked = data.rolloverAt ? (Date.now() >= Date.parse(data.rolloverAt)) : false;
                this._lastLoadTime = Date.now();

                const date = this.puzzleId.replace('connections-', '');
                this._ensureDay(date);

                // Create shuffled board of all words if not exists
                if (this.groups && (!this.days[date].boardWords || this.days[date].boardWords.length === 0)) {
                    const allWords = [
                        ...this.groups.easy,
                        ...this.groups.medium,
                        ...this.groups.hard,
                        ...this.groups.expert
                    ];
                    this.days[date].boardWords = shuffleArray(allWords);
                }

                // If user is logged in, reconcile state
                const auth = getAuth();
                if (auth.currentUser) {
                    await this._reconcileCloudState(auth.currentUser.uid);
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

        // Check a guess without updating the store state
        async checkGuess(selectedWords) {
            if (selectedWords.length !== 4) {
                return { result: 'invalid', message: 'Must select exactly 4 words' };
            }

            const guess = [...selectedWords].sort();

            // Check if already attempted
            const previousAttempts = this.attempts.map(a => [...a].sort().join(','));
            if (previousAttempts.includes(guess.join(','))) {
                return { result: 'duplicate', message: 'Already tried this combination' };
            }

            // Check each difficulty group
            for (const difficulty of this.DIFFICULTY_ORDER) {
                const group = [...this.groups[difficulty]].sort();
                if (guess.join(',') === group.join(',')) {
                    // Correct! Get the actual category title
                    const actualTitle = this.categories?.[difficulty] || this._getDefaultTitle(difficulty);

                    return {
                        result: 'correct',
                        group: {
                            difficulty,
                            words: this.groups[difficulty],
                            title: actualTitle,
                            foundAt: Date.now()
                        }
                    };
                }
            }

            // Check for "one away" (3 out of 4 correct)
            for (const difficulty of this.DIFFICULTY_ORDER) {
                const group = this.groups[difficulty];
                const intersection = guess.filter(word => group.includes(word));
                if (intersection.length === 3) {
                    return { result: 'one-away', message: 'One away!' };
                }
            }

            return { result: 'incorrect' };
        },

        // Apply a correct guess to the store state
        async applyCorrectGuess(group) {
            const date = this.puzzleId.replace('connections-', '');
            this._ensureDay(date);

            // Add to found groups
            this.days[date].foundGroups = [...this.foundGroups, group];

            // Clear selection
            this.days[date].selected = [];

            // Record the attempt
            const guess = [...group.words].sort();
            this.days[date].attempts = [...this.attempts, guess];

            // Update status
            if (this.days[date].foundGroups.length === 4) {
                this.days[date].status = 'won';
                await this._submitCompletion();
            }

            // Save to cloud in background
            const auth = getAuth();
            if (auth.currentUser) {
                this._saveStateToCloud(auth.currentUser.uid, date, true);
            }
        },

        // Apply an incorrect guess to the store state
        async applyIncorrectGuess(selectedWords) {
            const date = this.puzzleId.replace('connections-', '');
            const guess = [...selectedWords].sort();

            // Record attempt
            this.days[date].attempts = [...this.attempts, guess];

            // Increment mistakes
            this.days[date].mistakes++;

            // Clear selection
            this.days[date].selected = [];

            // Check if game is lost
            if (this.days[date].mistakes >= this.MAX_MISTAKES) {
                this.days[date].status = 'lost';
                await this._submitCompletion();
                return { result: 'lost' };
            }

            // Save to cloud in background
            const auth = getAuth();
            if (auth.currentUser) {
                this._saveStateToCloud(auth.currentUser.uid, date, true);
            }

            return { result: 'incorrect' };
        },

        // Legacy method for non-animated guesses
        async submitGuess() {
            if (!this.canSubmit) return;

            const selectedWords = [...this.selected];
            const result = await this.checkGuess(selectedWords);

            switch (result.result) {
                case 'correct':
                    await this.applyCorrectGuess(result.group);
                    return result;

                case 'one-away':
                    await this.applyIncorrectGuess(selectedWords);
                    return result;

                case 'incorrect':
                    return await this.applyIncorrectGuess(selectedWords);

                case 'duplicate':
                    return result;

                default:
                    return result;
            }
        },

        _getDefaultTitle(difficulty) {
            const titles = {
                easy: 'STRAIGHTFORWARD',
                medium: 'CATEGORIES',
                hard: 'WORDPLAY',
                expert: 'TRICKY'
            };
            return titles[difficulty] || difficulty.toUpperCase();
        },

        async _submitCompletion() {
            try {
                const call = httpsCallable(functions(), 'submitConnectionsCompletion');
                await call({
                    puzzleId: this.puzzleId,
                    foundGroups: this.foundGroups,
                    mistakes: this.mistakes,
                    attempts: this.attempts,
                    outcome: this.status === 'won' ? 'win' : 'loss'
                });
            } catch (error) {
                console.error('Error submitting completion:', error);
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
        paths: ['days', 'lastSeenDate', 'profile', 'puzzleId', 'groups', 'categories', 'rolloverAt'],
        storage: localStorage
    }
});