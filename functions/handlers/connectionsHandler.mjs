// handlers/connectionsHandler.mjs

export class ConnectionsHandler {
    static processGuess(guess, groups, currentState) {
        // Validate guess format (should be array of 4 items)
        if (!Array.isArray(guess) || guess.length !== 4) {
            throw new Error('Guess must be an array of exactly 4 items');
        }

        // Normalize guess items
        const normalizedGuess = guess.map(item => item.trim().toUpperCase());

        // Check for duplicates in guess
        if (new Set(normalizedGuess).size !== 4) {
            throw new Error('Guess contains duplicate items');
        }

        // Check if this exact guess has been made before
        const previousGuesses = currentState?.attempts || [];
        const isDuplicateGuess = previousGuesses.some(prevGuess => {
            const prevNormalized = prevGuess.map(item => item.toUpperCase());
            return this.arraysEqual(normalizedGuess.sort(), prevNormalized.sort());
        });

        if (isDuplicateGuess) {
            throw new Error('This combination has already been tried');
        }

        // Calculate attempt number (only counting unique attempts)
        const attemptNumber = previousGuesses.length + 1;

        // Check if already completed
        if (currentState?.isComplete) {
            throw new Error('Game already completed');
        }

        // Get mistake count
        const mistakes = currentState?.mistakes || 0;
        if (mistakes >= 4) {
            throw new Error('Maximum mistakes exceeded');
        }

        // Check if this group was already found
        const foundGroups = currentState?.foundGroups || [];

        // Evaluate the guess
        const evaluation = this.evaluateGuess(normalizedGuess, groups, foundGroups);

        // Build result
        const result = {
            guess: normalizedGuess,
            feedback: evaluation.feedback,
            correct: evaluation.isCorrect,
            attemptNumber,
            isComplete: false,
            isWin: false,
            foundGroup: null,
            mistakes: mistakes
        };

        if (evaluation.isCorrect) {
            // Found a correct group
            result.foundGroup = evaluation.matchedGroup;
            result.foundGroups = [...foundGroups, evaluation.matchedGroup];

            // Check if all groups found
            if (result.foundGroups.length === 4) {
                result.isComplete = true;
                result.isWin = true;
            }
        } else {
            // Incorrect guess - increment mistakes
            result.mistakes = mistakes + 1;
            result.closeMatches = evaluation.closeMatches;

            // Check if game over due to mistakes
            if (result.mistakes >= 4) {
                result.isComplete = true;
                result.isWin = false;
            }
        }

        return result;
    }

    static evaluateGuess(guess, groups, foundGroups) {
        const result = {
            isCorrect: false,
            matchedGroup: null,
            feedback: [],
            closeMatches: []
        };

        // Check each group
        for (const group of groups) {
            // Skip already found groups
            if (foundGroups.some(fg => fg.category === group.category)) {
                continue;
            }

            // Normalize group members
            const normalizedGroupMembers = group.members.map(m => m.toUpperCase());

            // Check if guess matches this group exactly
            const guessSet = new Set(guess);
            const groupSet = new Set(normalizedGroupMembers);

            if (this.setsEqual(guessSet, groupSet)) {
                result.isCorrect = true;
                result.matchedGroup = {
                    category: group.category,
                    members: group.members,
                    color: group.color || 'default'
                };
                result.feedback = guess.map(() => 'correct');
                return result;
            }

            // Check for close matches (3 out of 4 correct)
            const intersection = this.setIntersection(guessSet, groupSet);
            if (intersection.size === 3) {
                result.closeMatches.push({
                    category: group.category,
                    matchCount: 3
                });
            }
        }

        // Generate feedback for incorrect guess
        result.feedback = this.generateFeedback(guess, groups, foundGroups);

        return result;
    }

    static generateFeedback(guess, groups, foundGroups) {
        const feedback = [];

        for (const item of guess) {
            let itemFeedback = 'incorrect';

            // Check if item belongs to any unfound group
            for (const group of groups) {
                if (foundGroups.some(fg => fg.category === group.category)) {
                    continue;
                }

                const normalizedGroupMembers = group.members.map(m => m.toUpperCase());
                if (normalizedGroupMembers.includes(item)) {
                    // Item is valid but in wrong combination
                    itemFeedback = 'wrongGroup';
                    break;
                }
            }

            feedback.push(itemFeedback);
        }

        // If 3 items are from the same group, mark them as "close"
        const groupCounts = this.countItemsByGroup(guess, groups, foundGroups);
        const closeGroup = Object.entries(groupCounts).find(([_, count]) => count === 3);

        if (closeGroup) {
            const [groupCategory] = closeGroup;
            const group = groups.find(g => g.category === groupCategory);
            const normalizedGroupMembers = group.members.map(m => m.toUpperCase());

            feedback.forEach((fb, idx) => {
                if (normalizedGroupMembers.includes(guess[idx])) {
                    feedback[idx] = 'close';
                }
            });
        }

        return feedback;
    }

    static countItemsByGroup(guess, groups, foundGroups) {
        const counts = {};

        for (const item of guess) {
            for (const group of groups) {
                if (foundGroups.some(fg => fg.category === group.category)) {
                    continue;
                }

                const normalizedGroupMembers = group.members.map(m => m.toUpperCase());
                if (normalizedGroupMembers.includes(item)) {
                    counts[group.category] = (counts[group.category] || 0) + 1;
                    break;
                }
            }
        }

        return counts;
    }

    static setsEqual(set1, set2) {
        if (set1.size !== set2.size) return false;
        for (const item of set1) {
            if (!set2.has(item)) return false;
        }
        return true;
    }

    static setIntersection(set1, set2) {
        const intersection = new Set();
        for (const item of set1) {
            if (set2.has(item)) {
                intersection.add(item);
            }
        }
        return intersection;
    }

    static arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
}