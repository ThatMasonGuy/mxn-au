// handlers/wordleHandler.mjs
export class WordleHandler {
    static processGuess(guess, answer, currentState) {
        // Normalize inputs
        const normalizedGuess = guess.toUpperCase().trim();
        const normalizedAnswer = answer.toUpperCase();

        // Calculate attempt number
        const attemptNumber = (currentState?.attemptCount || 0) + 1;

        // Check if already completed
        if (currentState?.isComplete) {
            throw new Error('Game already completed');
        }

        // Check max attempts
        if (attemptNumber > 6) {
            throw new Error('Maximum attempts exceeded');
        }

        // Process the guess
        const feedback = this.evaluateGuess(normalizedGuess, normalizedAnswer);
        const isCorrect = normalizedGuess === normalizedAnswer;
        const isComplete = isCorrect || attemptNumber >= 6;
        const isWin = isCorrect;

        // Build result
        const result = {
            guess: normalizedGuess,
            feedback,
            correct: isCorrect,
            attemptNumber,
            isComplete,
            isWin,
            letterStates: this.getLetterStates(normalizedGuess, feedback, currentState?.letterStates)
        };

        return result;
    }

    static evaluateGuess(guess, answer) {
        const feedback = [];
        const answerArray = answer.split('');
        const guessArray = guess.split('');
        const answerLetterCounts = {};

        // Count letters in answer
        for (const letter of answerArray) {
            answerLetterCounts[letter] = (answerLetterCounts[letter] || 0) + 1;
        }

        // First pass: mark correct positions
        for (let i = 0; i < guessArray.length; i++) {
            if (guessArray[i] === answerArray[i]) {
                feedback[i] = 'correct';
                answerLetterCounts[guessArray[i]]--;
            }
        }

        // Second pass: mark present letters
        for (let i = 0; i < guessArray.length; i++) {
            if (feedback[i] === 'correct') continue;

            if (answerLetterCounts[guessArray[i]] > 0) {
                feedback[i] = 'present';
                answerLetterCounts[guessArray[i]]--;
            } else {
                feedback[i] = 'absent';
            }
        }

        return feedback;
    }

    static getLetterStates(guess, feedback, previousStates = {}) {
        const states = { ...previousStates };

        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];
            const state = feedback[i];

            // Update letter state (prioritize: correct > present > absent)
            if (!states[letter] ||
                state === 'correct' ||
                (state === 'present' && states[letter] === 'absent')) {
                states[letter] = state;
            }
        }

        return states;
    }
}