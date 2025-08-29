// src/stores/dailyGames/useWordleUnlimitedStore.js - Refactored with direct Firestore writes
import { defineStore } from 'pinia';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firestore } from '@/firebase';
import { doc, onSnapshot, setDoc, collection, getDocs } from 'firebase/firestore';
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

function clamp5(s) {
    return (s || '').replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase();
}

const PERSIST_KEY = 'mxn:wordle-unlimited'
const PERSIST_VERSION = 3

function isValidGame(g) {
    return !!g && typeof g.word === 'string'
        && Array.isArray(g.rows)
        && typeof g.status === 'string'
}

function sanitizePersisted(parsed) {
    const safe = {
        availableWords: Array.isArray(parsed?.availableWords) ? parsed.availableWords.slice(0, 200) : [],
        currentGame: isValidGame(parsed?.currentGame) ? parsed.currentGame : null,
        currentAnswer: typeof parsed?.currentAnswer === 'string' ? parsed.currentAnswer : null,
        _v: PERSIST_VERSION
    }
    return safe
}

// Auto-repair corrupted localStorage
(function repairPersistedIfBroken() {
    try {
        const raw = localStorage.getItem(PERSIST_KEY)
        if (!raw) return
        const parsed = JSON.parse(raw)

        const hasVolatile = 'initialized' in parsed || 'loading' in parsed || 'loadingMessage' in parsed || 'user' in parsed
        const brokenGame = !isValidGame(parsed.currentGame)

        if (hasVolatile || brokenGame || parsed._v !== PERSIST_VERSION) {
            const fixed = sanitizePersisted(parsed)
            localStorage.setItem(PERSIST_KEY, JSON.stringify(fixed))
        }
    } catch {
        localStorage.removeItem(PERSIST_KEY)
    }
})();

export const useWordleUnlimitedStore = defineStore('wordleUnlimited', {
    state: () => ({
        // Loading states
        loading: false,
        loadingMessage: '',
        initialized: false,

        // User info
        user: null,
        _profileUnsubscribe: null,

        // Current game state
        currentGame: null,
        currentAnswer: null,
        currentInput: '',

        // Available words pool (cached locally)
        availableWords: [],
        playedWords: new Set(),

        // Stats (synced from Firestore)
        profile: {
            totalPlayed: 0,
            wins: 0,
            losses: 0,
            currentStreak: 0,
            maxStreak: 0,
            winPercentage: 0,
            attemptsHistogram: [0, 0, 0, 0, 0, 0],
            lastPlayedAt: null
        },

        // Word validation
        _allowedWords: null
    }),

    getters: {
        canType() {
            return !this.loading &&
                this.currentGame &&
                this.currentGame.status === 'idle' &&
                this.currentGame.rows.length < 6;
        },

        isComplete() {
            return this.currentGame &&
                (this.currentGame.status === 'won' || this.currentGame.status === 'lost');
        },

        status() {
            return this.currentGame?.status || 'idle';
        },

        totalWordsPlayed() {
            return this.profile.totalPlayed;
        },

        winPercentage() {
            return this.profile.totalPlayed > 0
                ? Math.round((this.profile.wins / this.profile.totalPlayed) * 100)
                : 0;
        },

        currentStreak() {
            return this.profile.currentStreak;
        },

        currentWordIndex() {
            return this.profile.totalPlayed;
        }
    },

    actions: {
        setAllowedWords(set) { this._allowedWords = set; },

        _isValidWord(word) {
            if (!word || word.length !== 5) return false;
            if (!this._allowedWords) return true;
            return this._allowedWords.has(word.toLowerCase());
        },

        _syncWithDailyStore() {
            try {
                const dailyStore = useDailyStore()
                if (this.profile) {
                    dailyStore.wordleUnlimitedStats = {
                        currentStreak: this.profile.currentStreak || 0,
                        maxStreak: this.profile.maxStreak || 0,
                        wins: this.profile.wins || 0,
                        losses: this.profile.losses || 0,
                        totalPlayed: this.profile.totalPlayed || 0,
                        winPercentage: this.profile.winPercentage || 0,
                        lastPlayedAt: this.profile.lastPlayedAt || null,
                        attemptsHistogram: this.profile.attemptsHistogram || [0, 0, 0, 0, 0, 0]
                    }
                }
            } catch (error) {
                console.warn('Error syncing with daily store:', error)
            }
        },

        _ensurePlayedWordsSet() {
            if (this.playedWords instanceof Set) return;
            if (Array.isArray(this.playedWords)) {
                this.playedWords = new Set(this.playedWords);
            } else if (this.playedWords && typeof this.playedWords === 'object') {
                this.playedWords = new Set(Object.keys(this.playedWords));
            } else {
                this.playedWords = new Set();
            }
        },

        async _loadPlayedWords(userId) {
            this.loadingMessage = 'Loading your progress...';
            const playsRef = collection(
                firestore,
                'users', userId,
                'dailyChallenges', 'wordle-unlimited',
                'games'
            );
            const playsSnapshot = await getDocs(playsRef);
            this._ensurePlayedWordsSet();
            this.playedWords.clear();
            playsSnapshot.forEach(d => this.playedWords.add(d.id));
        },

        async _refreshWordPool() {
            this.loadingMessage = 'Getting words...';
            try {
                const call = httpsCallable(functions(), 'getWordleUnlimitedWords');
                const { data } = await call({
                    requestCount: 50,
                    excludeWords: this.currentGame ? [this.currentGame.word] : []
                });
                if (Array.isArray(data?.words)) {
                    this.availableWords = data.words.slice(0);
                    this._ensurePlayedWordsSet();
                    if (this.currentGame?.word) this.playedWords.add(this.currentGame.word);
                }
            } catch (error) {
                console.error('Error refreshing word pool:', error);
            }
        },

        async startNewGame({ force = false } = {}) {
            if (this.loading && !force) return;

            const prevLoading = this.loading;
            this.loading = true;
            this.loadingMessage = 'Finding next word...';

            try {
                await new Promise(r => setTimeout(r, 300));

                if (!Array.isArray(this.availableWords) || this.availableWords.length < 5) {
                    this.loadingMessage = 'Getting new words...';
                    await this._refreshWordPool();
                }
                if (!Array.isArray(this.availableWords) || this.availableWords.length === 0) {
                    throw new Error('No words available');
                }

                this.loadingMessage = 'Setting up puzzle...';
                const randomIndex = Math.floor(Math.random() * this.availableWords.length);
                const selectedWord = this.availableWords[randomIndex];
                this.availableWords.splice(randomIndex, 1);

                this._ensurePlayedWordsSet();
                this.playedWords.add(selectedWord);

                await new Promise(r => setTimeout(r, 200));

                this.currentGame = {
                    word: selectedWord,
                    status: 'idle',
                    rows: [],
                    attempts: 0,
                    currentInput: ''
                };
                this.currentAnswer = selectedWord.toUpperCase();
                this.currentInput = '';
                this.loadingMessage = '';

                // Save new game state to cloud in background
                if (this.user) {
                    this._saveGameToCloud(true);
                }

            } catch (e) {
                console.error('Error starting new game:', e);
                this.loadingMessage = 'Failed to start next game';
                throw e;
            } finally {
                this.loading = prevLoading ? prevLoading : false;
            }
        },

        async _saveGameToCloud(isBackground = false) {
            if (!this.user || !this.currentGame) return;

            try {
                const gameRef = doc(
                    firestore,
                    'users', this.user.uid,
                    'dailyChallenges', 'wordle-unlimited',
                    'games', this.currentGame.word
                );

                const guesses = this.currentGame.rows.map(r => r.guess);
                const masks = this.currentGame.rows.map(r => r.mask.join(''));
                const outcome = this.currentGame.status === 'won' ? 'win' :
                    this.currentGame.status === 'lost' ? 'loss' : 'in_progress';

                await setDoc(gameRef, {
                    word: this.currentGame.word,
                    guesses,
                    masks,
                    outcome,
                    attempts: this.currentGame.attempts || this.currentGame.rows.length,
                    updatedAt: new Date()
                }, { merge: true });

            } catch (error) {
                if (!isBackground) throw error;
                console.warn('Background save failed:', error);
            }
        },

        async _reconcileCurrentGame(uid) {
            if (!uid) return false;

            try {
                // Look for the most recent in-progress game
                const gamesRef = collection(firestore, 'users', uid, 'dailyChallenges', 'wordle-unlimited', 'games');
                const recentGames = await getDocs(gamesRef);

                let mostRecentInProgress = null;
                let mostRecentTime = 0;

                recentGames.forEach(doc => {
                    const data = doc.data();
                    if (data.outcome === 'in_progress' && data.updatedAt) {
                        const time = data.updatedAt.toMillis ? data.updatedAt.toMillis() : data.updatedAt.seconds * 1000;
                        if (time > mostRecentTime) {
                            mostRecentTime = time;
                            mostRecentInProgress = { id: doc.id, ...data };
                        }
                    }
                });

                if (mostRecentInProgress) {
                    // Rebuild the game state from Firestore
                    const rows = mostRecentInProgress.guesses.map((guess, i) => ({
                        guess: guess.toUpperCase(),
                        mask: mostRecentInProgress.masks[i] ? mostRecentInProgress.masks[i].split('') : ['B', 'B', 'B', 'B', 'B']
                    }));

                    this.currentGame = {
                        word: mostRecentInProgress.word,
                        status: 'idle', // Always idle since it's in progress
                        rows: rows,
                        attempts: mostRecentInProgress.attempts || rows.length,
                        currentInput: ''
                    };
                    this.currentAnswer = mostRecentInProgress.word.toUpperCase();
                    this.currentInput = '';

                    // Add to played words
                    this._ensurePlayedWordsSet();
                    this.playedWords.add(mostRecentInProgress.word);

                    return true;
                }
            } catch (error) {
                console.warn('Error reconciling current game:', error);
            }
            return false;
        },

        async initialize() {
            if (this.loading) return
            this.loading = true
            this.loadingMessage = 'Initializing...'

            const auth = getAuth()
            return new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(auth, async (user) => {
                    try {
                        if (!user) throw new Error('User not authenticated')
                        this.user = user

                        this._ensurePlayedWordsSet()
                        await this._setupUserListener(user.uid)
                        await this._loadPlayedWords(user.uid)

                        // Check for in-progress game in cloud first
                        const hasCloudGame = await this._reconcileCurrentGame(user.uid);

                        // Ensure words exist
                        if (!Array.isArray(this.availableWords) || this.availableWords.length < 5) {
                            await this._refreshWordPool()
                        }

                        // Only start new game if no cloud game and no valid local game
                        if (!hasCloudGame && !isValidGame(this.currentGame)) {
                            await this.startNewGame({ force: true })
                        }

                        this.initialized = true
                        this.loadingMessage = ''
                        resolve()
                    } catch (err) {
                        console.error('Error initializing Wordle Unlimited:', err)
                        this.loadingMessage = 'Failed to initialize'
                        resolve()
                    } finally {
                        this.loading = false
                        unsubscribe()
                    }
                })
            })
        },

        async _setupUserListener(userId) {
            if (this._profileUnsubscribe) this._profileUnsubscribe();
            const profileRef = doc(firestore, 'users', userId, 'dailyChallenges', 'wordle-unlimited');
            this._profileUnsubscribe = onSnapshot(profileRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    this.profile = {
                        totalPlayed: data.totalPlayed || 0,
                        wins: data.wins || 0,
                        losses: data.losses || 0,
                        currentStreak: data.currentStreak || 0,
                        maxStreak: data.maxStreak || 0,
                        winPercentage: data.totalPlayed ? Math.round((data.wins / data.totalPlayed) * 100) : 0,
                        attemptsHistogram: data.attemptsHistogram ?
                            [1, 2, 3, 4, 5, 6].map(i => data.attemptsHistogram[String(i)] || 0) :
                            [0, 0, 0, 0, 0, 0],
                        lastPlayedAt: data.lastPlayedAt
                    };
                    // Sync with daily store when profile updates
                    this._syncWithDailyStore();
                } else {
                    // Create profile document
                    setDoc(profileRef, {
                        totalPlayed: 0,
                        wins: 0,
                        losses: 0,
                        currentStreak: 0,
                        maxStreak: 0,
                        attemptsHistogram: {},
                        createdAt: new Date()
                    }, { merge: true });
                }
            });
        },

        // Input handlers
        typeLetter(ch) {
            if (!this.canType) return;
            const s = clamp5(this.currentInput + ch);
            if (s.length <= 5) {
                this.currentInput = s;
                if (this.currentGame) this.currentGame.currentInput = s;
            }
        },

        backspace() {
            if (!this.canType) return;
            this.currentInput = this.currentInput.slice(0, -1);
            if (this.currentGame) this.currentGame.currentInput = this.currentInput;
        },

        async enter() {
            if (!this.canType || !this.currentGame) {
                throw new Error('no_current_game');
            }
            const guess = clamp5(this.currentInput);
            if (guess.length !== 5) return;
            if (this.currentGame.rows.some(r => r.guess === guess)) {
                throw new Error('duplicate_guess');
            }
            if (!this._isValidWord(guess)) {
                throw new Error('invalid_word');
            }

            const mask = gradeGuess(guess, this.currentAnswer);
            const row = { guess, mask };
            this.currentGame.rows.push(row);
            this.currentGame.attempts = this.currentGame.rows.length;
            this.currentInput = '';
            this.currentGame.currentInput = '';

            // Save progress to cloud in background
            if (this.user) {
                this._saveGameToCloud(true);
            }

            // Check for completion
            const isWin = mask.join('') === 'GGGGG';
            const isLoss = this.currentGame.rows.length >= 6 && !isWin;

            if (isWin) {
                this.currentGame.status = 'won';
                await this._submitCompletion('win');
            } else if (isLoss) {
                this.currentGame.status = 'lost';
                await this._submitCompletion('loss');
            }
        },

        async _submitCompletion(outcome) {
            if (!this.user || !this.currentGame) return;

            try {
                const call = httpsCallable(functions(), 'submitWordleUnlimitedCompletion');
                await call({
                    word: this.currentGame.word,
                    outcome,
                    attempts: this.currentGame.attempts,
                    guesses: this.currentGame.rows.map(r => r.guess),
                    masks: this.currentGame.rows.map(r => r.mask.join(''))
                });
            } catch (error) {
                console.error('Error submitting completion:', error);
            }
        },

        // Utilities
        maskToEmoji(maskArr) {
            const map = { G: '🟩', Y: '🟨', B: '⬛' };
            return maskArr.map(c => map[c] || '⬛').join('');
        },

        shareText() {
            if (!this.currentGame || !this.isComplete) return '';
            const lines = this.currentGame.rows.map(r => this.maskToEmoji(r.mask));
            const result = this.currentGame.status === 'won' ? `${this.currentGame.rows.length}/6` : 'X/6';
            return `Wordle Unlimited #${this.profile.totalPlayed}\n${result}\n\n${lines.join('\n')}\n\nPlay at https://mxn.au/daily`;
        },

        $dispose() {
            if (this._profileUnsubscribe) {
                this._profileUnsubscribe();
                this._profileUnsubscribe = null;
            }
        }
    },

    persist: {
        key: 'mxn:wordle-unlimited',
        paths: ['availableWords', 'currentGame', 'currentAnswer'],
        storage: localStorage
    }
});