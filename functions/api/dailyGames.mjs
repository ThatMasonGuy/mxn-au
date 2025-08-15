// dailyGames.mjs
import { onRequest } from 'firebase-functions/v2/https';
import { FieldValue } from 'firebase-admin/firestore';
import { db, auth } from '../config/firebase.mjs'

// Game-specific handlers
import { WordleHandler } from '../handlers/wordleHandler.mjs';
import { ConnectionsHandler } from '../handlers/connectionsHandler.mjs';

// Constants
const GAMES = {
    WORDLE: 'wordle',
    CONNECTIONS: 'connections'
};

const MAX_ATTEMPTS = {
    [GAMES.WORDLE]: 6,
    [GAMES.CONNECTIONS]: 4
};

// Helper function to generate fallback puzzle
async function generateFallbackConnectionsPuzzle(date) {
    const fallbackGroups = [
        {
            category: "COLORS",
            members: ["RED", "BLUE", "GREEN", "YELLOW"],
            difficulty: "easy",
            color: "yellow"
        },
        {
            category: "ANIMALS",
            members: ["DOG", "CAT", "BIRD", "FISH"],
            difficulty: "medium",
            color: "green"
        },
        {
            category: "FRUITS",
            members: ["APPLE", "BANANA", "ORANGE", "GRAPE"],
            difficulty: "hard",
            color: "blue"
        },
        {
            category: "VEHICLES",
            members: ["CAR", "BIKE", "TRAIN", "PLANE"],
            difficulty: "expert",
            color: "purple"
        }
    ];

    const docRef = db.doc(`dailyChallenges/connections/games/${date}`);
    await docRef.set({
        date,
        gameId: 'connections',
        groups: fallbackGroups,
        stats: { totalPlays: 0, totalWins: 0, attemptsHistogram: {} },
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        isFallback: true
    }, { merge: true });

    return fallbackGroups;
}

// Get daily words for Connections (public endpoint)
export const getConnectionsWords = onRequest({
    cors: true,
    maxInstances: 10,
    region: 'australia-southeast1',
    timeoutSeconds: 30
}, async (req, res) => {
    try {
        // Get current UTC date
        const gameDate = getCurrentUTCDateString();
        console.log(`Fetching connections words for date: ${gameDate}`);

        // Get game configuration
        const docRef = db.doc(`dailyChallenges/connections/games/${gameDate}`);
        const doc = await docRef.get();

        let groups;

        if (!doc.exists) {
            console.log(`No game found for ${gameDate}, generating fallback puzzle`);
            // Generate a fallback puzzle if none exists
            groups = await generateFallbackConnectionsPuzzle(gameDate);
        } else {
            const gameData = doc.data();

            // Validate data structure
            if (!gameData.groups || !Array.isArray(gameData.groups)) {
                console.error('Invalid game data structure:', gameData);
                // Generate fallback if structure is invalid
                groups = await generateFallbackConnectionsPuzzle(gameDate);
            } else {
                groups = gameData.groups;
            }
        }

        // Extract and validate words
        const words = [];
        for (const group of groups) {
            // Handle both 'members' and 'words' properties for compatibility
            const groupWords = group.members || group.words || [];

            if (!Array.isArray(groupWords) || groupWords.length !== 4) {
                console.error('Invalid group structure:', group);
                throw new Error(`Invalid group structure for category: ${group.category}`);
            }

            words.push(...groupWords.map(w => String(w).toUpperCase()));
        }

        // Validate we have exactly 16 words
        if (words.length !== 16) {
            console.error(`Expected 16 words, got ${words.length}`);
            throw new Error('Invalid puzzle: incorrect number of words');
        }

        // Check for duplicates
        const uniqueWords = new Set(words);
        if (uniqueWords.size !== 16) {
            console.error('Duplicate words found in puzzle');
            throw new Error('Invalid puzzle: duplicate words');
        }

        // Shuffle the words
        const shuffled = [...words].sort(() => Math.random() - 0.5);

        return res.status(200).json({
            success: true,
            date: gameDate,
            words: shuffled
        });

    } catch (error) {
        console.error('Error fetching connections words:', error);

        // Return more specific error messages
        if (error.message.includes('Invalid puzzle')) {
            return res.status(500).json({
                error: 'Puzzle data is corrupted',
                message: error.message,
                date: getCurrentUTCDateString()
            });
        }

        return res.status(500).json({
            error: 'Failed to load puzzle',
            message: error.message || 'Internal server error',
            date: getCurrentUTCDateString()
        });
    }
});

// Main dailyGames endpoint
export const dailyGames = onRequest({
    cors: true,
    maxInstances: 10,
    region: 'australia-southeast1',
    timeoutSeconds: 30
}, async (req, res) => {
    try {
        // Only allow POST requests
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        // Extract and validate request data
        const { gameId, guess, userId, idToken } = req.body;

        // Validate required fields
        if (!gameId || !guess) {
            return res.status(400).json({ error: 'Missing required fields: gameId and guess' });
        }

        // Validate game type
        if (!Object.values(GAMES).includes(gameId)) {
            return res.status(400).json({ error: 'Invalid game type' });
        }

        // Get current UTC date
        const gameDate = getCurrentUTCDateString();

        // Verify user if token provided
        let verifiedUserId = null;
        if (idToken) {
            try {
                const decodedToken = await auth.verifyIdToken(idToken);
                verifiedUserId = decodedToken.uid;

                // Ensure userId matches if both provided
                if (userId && userId !== verifiedUserId) {
                    return res.status(403).json({ error: 'User ID mismatch' });
                }
            } catch (error) {
                console.error('Token verification failed:', error);
                return res.status(401).json({ error: 'Invalid authentication token' });
            }
        }

        // Get game configuration and answer
        const gameConfig = await getGameConfig(gameId, gameDate);
        if (!gameConfig) {
            // Try to generate a fallback if it's connections
            if (gameId === GAMES.CONNECTIONS) {
                console.log('Generating fallback for gameplay');
                const groups = await generateFallbackConnectionsPuzzle(gameDate);
                gameConfig = { groups, date: gameDate, gameId };
            } else {
                return res.status(404).json({ error: 'Game not found for this date' });
            }
        }

        // Check if user has already completed today's game
        if (verifiedUserId) {
            const hasCompleted = await checkIfUserCompleted(verifiedUserId, gameId, gameDate);
            if (hasCompleted) {
                return res.status(400).json({ error: 'You have already completed this game today' });
            }
        }

        // Get current game state for user
        let currentState = null;
        if (verifiedUserId) {
            currentState = await getUserGameState(verifiedUserId, gameId, gameDate);
        }

        // Process the guess based on game type
        let result;
        try {
            switch (gameId) {
                case GAMES.WORDLE:
                    result = WordleHandler.processGuess(guess, gameConfig.answer, currentState);
                    break;
                case GAMES.CONNECTIONS:
                    result = ConnectionsHandler.processGuess(guess, gameConfig.groups, currentState);
                    break;
                default:
                    return res.status(400).json({ error: 'Game handler not implemented' });
            }
        } catch (handlerError) {
            console.error('Handler error:', handlerError);
            return res.status(400).json({
                error: handlerError.message || 'Invalid guess',
                code: 'HANDLER_ERROR'
            });
        }

        // Update database if user is authenticated
        if (verifiedUserId) {
            await updateUserProgress(verifiedUserId, gameId, gameDate, result, gameConfig);
        }

        // Return result to client
        return res.status(200).json({
            success: true,
            gameId,
            date: gameDate,
            result: {
                correct: result.correct,
                feedback: result.feedback,
                attemptsRemaining: MAX_ATTEMPTS[gameId] - result.attemptNumber,
                isComplete: result.isComplete,
                isWin: result.isWin,
                foundGroup: result.foundGroup || null,
                mistakes: result.mistakes
            }
        });

    } catch (error) {
        console.error('Error processing game request:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Helper Functions

function getCurrentUTCDateString() {
    const now = new Date();
    const utcYear = now.getUTCFullYear();
    const utcMonth = String(now.getUTCMonth() + 1).padStart(2, '0');
    const utcDay = String(now.getUTCDate()).padStart(2, '0');
    return `${utcYear}-${utcMonth}-${utcDay}`;
}

async function getGameConfig(gameId, date) {
    try {
        const docRef = db.doc(`dailyChallenges/${gameId}/games/${date}`);
        const doc = await docRef.get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data();

        // Validate data structure for connections
        if (gameId === GAMES.CONNECTIONS) {
            if (!data.groups || !Array.isArray(data.groups) || data.groups.length !== 4) {
                console.error('Invalid connections game config:', data);
                return null;
            }
        }

        return data;
    } catch (error) {
        console.error('Error fetching game config:', error);
        throw error;
    }
}

async function checkIfUserCompleted(userId, gameId, date) {
    try {
        const docRef = db.doc(`users/${userId}/dailyChallenges/${gameId}/games/${date}`);
        const doc = await docRef.get();

        if (!doc.exists) {
            return false;
        }

        const data = doc.data();
        return data.isComplete === true;
    } catch (error) {
        console.error('Error checking user completion:', error);
        return false;
    }
}

async function getUserGameState(userId, gameId, date) {
    try {
        const docRef = db.doc(`users/${userId}/dailyChallenges/${gameId}/games/${date}`);
        const doc = await docRef.get();

        if (!doc.exists) {
            return {
                attempts: [],
                attemptCount: 0,
                isComplete: false,
                isWin: false,
                mistakes: 0,
                foundGroups: []
            };
        }

        return doc.data();
    } catch (error) {
        console.error('Error fetching user game state:', error);
        return null;
    }
}

async function updateUserProgress(userId, gameId, date, result, gameConfig) {
    const batch = db.batch();

    try {
        // Update specific game instance
        const gameRef = db.doc(`users/${userId}/dailyChallenges/${gameId}/games/${date}`);
        const gameUpdate = {
            attempts: FieldValue.arrayUnion(result.guess),
            attemptCount: result.attemptNumber,
            isComplete: result.isComplete,
            isWin: result.isWin,
            lastUpdated: FieldValue.serverTimestamp(),
            feedback: result.feedback
        };

        if (gameId === GAMES.CONNECTIONS) {
            gameUpdate.mistakes = result.mistakes || 0;
        }

        if (result.isComplete) {
            gameUpdate.completedAt = FieldValue.serverTimestamp();
        }

        // For Connections, also store found groups
        if (gameId === GAMES.CONNECTIONS && result.foundGroup) {
            gameUpdate.foundGroups = FieldValue.arrayUnion(result.foundGroup);
        }

        batch.set(gameRef, gameUpdate, { merge: true });

        // Update user stats if game is complete
        if (result.isComplete) {
            await updateUserStatsWithArray(userId, gameId, result);
            await updateGlobalStatsWithArray(gameId, date, result);
        }

        // Commit the batch for game state
        await batch.commit();

    } catch (error) {
        console.error('Error updating user progress:', error);
        throw error;
    }
}

async function updateUserStatsWithArray(userId, gameId, result) {
    const statsRef = db.doc(`users/${userId}/dailyChallenges/${gameId}`);

    try {
        await db.runTransaction(async (transaction) => {
            const statsDoc = await transaction.get(statsRef);
            const currentStats = statsDoc.exists ? statsDoc.data() : getDefaultStats();

            // Calculate new values
            const newGamesPlayed = (currentStats.gamesPlayed || 0) + 1;
            const newGamesWon = (currentStats.gamesWon || 0) + (result.isWin ? 1 : 0);

            // Update histogram
            let histogram = currentStats.histogram || (gameId === GAMES.WORDLE ? [0, 0, 0, 0, 0, 0] : [0, 0, 0, 0, 0]);
            if (result.isWin) {
                if (gameId === GAMES.WORDLE) {
                    histogram[result.attemptNumber - 1]++;
                } else if (gameId === GAMES.CONNECTIONS) {
                    const groupsFound = result.foundGroups?.length || 4;
                    histogram[groupsFound]++;
                }
            }

            // Update streak
            const lastPlayedDate = currentStats.lastPlayedDate || '';
            const yesterday = getYesterdayUTCDateString();
            const today = getCurrentUTCDateString();

            let newStreak = currentStats.currentStreak || 0;
            if (result.isWin) {
                if (lastPlayedDate === yesterday && currentStats.lastWasWin) {
                    newStreak++;
                } else if (lastPlayedDate !== today) {
                    newStreak = 1;
                }
            } else {
                newStreak = 0;
            }

            const updates = {
                gamesPlayed: newGamesPlayed,
                gamesWon: newGamesWon,
                winPercentage: Math.round((newGamesWon / newGamesPlayed) * 100),
                currentStreak: newStreak,
                maxStreak: Math.max(currentStats.maxStreak || 0, newStreak),
                histogram: histogram,
                lastPlayed: FieldValue.serverTimestamp(),
                lastPlayedDate: today,
                lastWasWin: result.isWin
            };

            transaction.set(statsRef, updates, { merge: true });
        });
    } catch (error) {
        console.error('Error updating user stats:', error);
        throw error;
    }
}

async function updateGlobalStatsWithArray(gameId, date, result) {
    try {
        // Update main game document
        const globalRef = db.doc(`dailyChallenges/${gameId}`);
        await globalRef.set({
            totalGamesPlayed: FieldValue.increment(1),
            totalWins: result.isWin ? FieldValue.increment(1) : FieldValue.increment(0),
            lastUpdated: FieldValue.serverTimestamp()
        }, { merge: true });

        // Update daily stats with transaction for histogram
        const dailyRef = db.doc(`dailyChallenges/${gameId}/games/${date}`);
        await db.runTransaction(async (transaction) => {
            const dailyDoc = await transaction.get(dailyRef);
            const currentData = dailyDoc.exists ? dailyDoc.data() : {};
            const currentStats = currentData.stats || {};

            let histogram;
            if (gameId === GAMES.WORDLE) {
                histogram = currentStats.histogram || [0, 0, 0, 0, 0, 0];
                if (result.isWin) {
                    histogram[result.attemptNumber - 1]++;
                }
            } else if (gameId === GAMES.CONNECTIONS) {
                histogram = currentStats.histogram || [0, 0, 0, 0, 0];
                const groupsFound = result.foundGroups?.length || (result.isWin ? 4 : 0);
                histogram[groupsFound]++;
            }

            const newStats = {
                totalPlayers: (currentStats.totalPlayers || 0) + 1,
                totalWins: (currentStats.totalWins || 0) + (result.isWin ? 1 : 0),
                histogram: histogram
            };

            transaction.set(dailyRef, { stats: newStats }, { merge: true });
        });
    } catch (error) {
        console.error('Error updating global stats:', error);
        throw error;
    }
}

function getDefaultStats() {
    return {
        gamesPlayed: 0,
        gamesWon: 0,
        winPercentage: 0,
        currentStreak: 0,
        maxStreak: 0,
        histogram: [0, 0, 0, 0, 0, 0],
        lastPlayedDate: null,
        lastWasWin: false
    };
}

function getYesterdayUTCDateString() {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - 1);
    const utcYear = date.getUTCFullYear();
    const utcMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
    const utcDay = String(date.getUTCDate()).padStart(2, '0');
    return `${utcYear}-${utcMonth}-${utcDay}`;
}