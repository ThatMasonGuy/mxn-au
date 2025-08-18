import { db } from '../config/firebase.mjs'

async function fixFirestoreConfig() {
    console.log('🔧 Fixing Firestore Configuration...\n');

    try {
        console.log('Step 1: Checking dailyChallenges collection...');
        const dailyChallengesRef = db.collection('dailyChallenges');

        const wordDoc = await dailyChallengesRef.doc('word').get();
        if (wordDoc.exists) {
            console.log('❌ Found incorrect "word" document');

            const wordData = wordDoc.data();

            await dailyChallengesRef.doc('word').delete();
            console.log('✅ Deleted incorrect "word" document');

            const wordleDoc = await dailyChallengesRef.doc('wordle').get();
            if (!wordleDoc.exists) {
                await dailyChallengesRef.doc('wordle').set({
                    active: true,
                    name: 'Wordle',
                    description: 'Guess the 5-letter word in 6 tries',
                    maxAttempts: 6,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log('✅ Created correct "wordle" document');
            }
        } else {
            console.log('✅ No incorrect "word" document found');
        }

        // 2. Ensure wordle configuration exists
        const wordleDoc = await dailyChallengesRef.doc('wordle').get();
        if (!wordleDoc.exists) {
            await dailyChallengesRef.doc('wordle').set({
                active: true,
                name: 'Wordle',
                description: 'Guess the 5-letter word in 6 tries',
                maxAttempts: 6,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Created "wordle" configuration');
        } else {
            // Ensure it's active
            await dailyChallengesRef.doc('wordle').update({
                active: true
            });
            console.log('✅ "wordle" configuration exists and is active');
        }

        // 3. Ensure connections configuration exists
        const connectionsDoc = await dailyChallengesRef.doc('connections').get();
        if (!connectionsDoc.exists) {
            await dailyChallengesRef.doc('connections').set({
                active: true,
                name: 'Connections',
                description: 'Find groups of 4 related words',
                maxAttempts: 4,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Created "connections" configuration');
        } else {
            // Ensure it's active
            await dailyChallengesRef.doc('connections').update({
                active: true
            });
            console.log('✅ "connections" configuration exists and is active');
        }

        // 4. List all game configurations
        console.log('\nStep 2: Current game configurations:');
        const allGames = await dailyChallengesRef.get();
        allGames.forEach(doc => {
            const data = doc.data();
            console.log(`  - ${doc.id}: ${data.active ? '✅ Active' : '❌ Inactive'}`);
        });

        // 5. Generate today's puzzles if they don't exist
        console.log('\nStep 3: Checking today\'s puzzles...');
        const today = getCurrentUTCDateString();

        // Check Wordle
        const wordleTodayRef = db.doc(`dailyChallenges/wordle/games/${today}`);
        const wordleTodayDoc = await wordleTodayRef.get();
        if (!wordleTodayDoc.exists) {
            console.log('❌ No Wordle puzzle for today');
            // Create a fallback puzzle
            await wordleTodayRef.set({
                date: today,
                gameId: 'wordle',
                answer: 'CRANE', // A good starting word
                stats: { totalPlays: 0, totalWins: 0, attemptsHistogram: {} },
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                isFallback: true
            });
            console.log('✅ Created fallback Wordle puzzle for today');
        } else {
            console.log('✅ Wordle puzzle exists for today');
        }

        // Check Connections
        const connectionsTodayRef = db.doc(`dailyChallenges/connections/games/${today}`);
        const connectionsTodayDoc = await connectionsTodayRef.get();
        if (!connectionsTodayDoc.exists) {
            console.log('❌ No Connections puzzle for today');
            // Create a fallback puzzle
            await connectionsTodayRef.set({
                date: today,
                gameId: 'connections',
                groups: [
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
                ],
                stats: { totalPlays: 0, totalWins: 0, attemptsHistogram: [0, 0, 0, 0, 0] },
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                isFallback: true
            });
            console.log('✅ Created fallback Connections puzzle for today');
        } else {
            console.log('✅ Connections puzzle exists for today');
        }

        console.log('\n✨ Firestore configuration fixed successfully!');
        console.log('\nNext steps:');
        console.log('1. Deploy the updated generatePuzzle.mjs file');
        console.log('2. Run the manual generation again to create puzzles for the next 14 days');
        console.log('3. Test the getConnectionsWords endpoint');

    } catch (error) {
        console.error('❌ Error fixing Firestore:', error);
    } finally {
        // Terminate the app
        await admin.app().delete();
    }
}

function getCurrentUTCDateString() {
    const now = new Date();
    const utcYear = now.getUTCFullYear();
    const utcMonth = String(now.getUTCMonth() + 1).padStart(2, '0');
    const utcDay = String(now.getUTCDate()).padStart(2, '0');
    return `${utcYear}-${utcMonth}-${utcDay}`;
}

// Run the fix
fixFirestoreConfig();