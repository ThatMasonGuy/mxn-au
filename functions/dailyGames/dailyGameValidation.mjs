import { CONNECTION_DIFFICULTIES } from './connectionsQuality.mjs';

export function dateStrUTC(d = new Date()) {
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function validateCurrentPuzzleId(puzzleId, game, now = new Date()) {
  const expected = `${game}-${dateStrUTC(now)}`;
  return typeof puzzleId === 'string' && puzzleId === expected
    ? { valid: true, date: dateStrUTC(now) }
    : { valid: false, reason: 'invalid_or_stale_puzzle' };
}

export function gradeWordleGuess(guess, solution) {
  const normalisedGuess = String(guess).toUpperCase();
  const normalisedSolution = String(solution).toUpperCase();
  const result = Array(5).fill('B');
  const remaining = {};

  for (let index = 0; index < 5; index += 1) {
    if (normalisedGuess[index] === normalisedSolution[index]) result[index] = 'G';
    else remaining[normalisedSolution[index]] = (remaining[normalisedSolution[index]] || 0) + 1;
  }
  for (let index = 0; index < 5; index += 1) {
    if (result[index] !== 'G' && remaining[normalisedGuess[index]] > 0) {
      result[index] = 'Y';
      remaining[normalisedGuess[index]] -= 1;
    }
  }
  return result;
}

export function validateWordleCompletion({ puzzleId, guesses, outcome, answer, now = new Date() }) {
  const puzzle = validateCurrentPuzzleId(puzzleId, 'wordle', now);
  if (!puzzle.valid) return puzzle;
  if (!Array.isArray(guesses) || guesses.length < 1 || guesses.length > 6) {
    return { valid: false, reason: 'invalid_guesses' };
  }

  const normalisedGuesses = guesses.map((guess) => String(guess).trim().toUpperCase());
  if (normalisedGuesses.some((guess) => !/^[A-Z]{5}$/.test(guess))) {
    return { valid: false, reason: 'invalid_guess' };
  }

  const solvedIndex = normalisedGuesses.findIndex(
    (guess) => gradeWordleGuess(guess, answer).join('') === 'GGGGG',
  );
  const solvedAt = solvedIndex + 1;
  const derivedOutcome = solvedAt > 0 ? 'win' : normalisedGuesses.length === 6 ? 'loss' : null;
  if (!derivedOutcome || solvedAt > 0 && solvedAt !== normalisedGuesses.length) {
    return { valid: false, reason: 'game_not_complete' };
  }
  if (outcome !== derivedOutcome) {
    return { valid: false, reason: 'outcome_mismatch' };
  }

  return {
    valid: true,
    date: puzzle.date,
    outcome: derivedOutcome,
    guesses: normalisedGuesses,
    solvedAt: solvedAt || null,
  };
}

function wordsSignature(words) {
  return [...words].map((word) => String(word).trim().toUpperCase()).sort().join('|');
}

export function validateConnectionsCompletion({
  puzzleId,
  foundGroups,
  mistakes,
  attempts,
  outcome,
  answer,
  now = new Date(),
}) {
  const puzzle = validateCurrentPuzzleId(puzzleId, 'connections', now);
  if (!puzzle.valid) return puzzle;
  if (!Number.isInteger(mistakes) || mistakes < 0 || mistakes > 4) {
    return { valid: false, reason: 'invalid_mistakes' };
  }
  if (!Array.isArray(foundGroups) || !Array.isArray(attempts)) {
    return { valid: false, reason: 'invalid_game_data' };
  }
  if (attempts.length !== foundGroups.length + mistakes) {
    return { valid: false, reason: 'attempt_count_mismatch' };
  }

  const expectedSignatures = new Map(
    CONNECTION_DIFFICULTIES.map((difficulty) => [difficulty, wordsSignature(answer[difficulty])]),
  );
  const seenDifficulties = new Set();
  for (const group of foundGroups) {
    const difficulty = group?.difficulty;
    if (!expectedSignatures.has(difficulty) || seenDifficulties.has(difficulty)) {
      return { valid: false, reason: 'invalid_found_group' };
    }
    if (!Array.isArray(group.words) || wordsSignature(group.words) !== expectedSignatures.get(difficulty)) {
      return { valid: false, reason: 'found_group_mismatch' };
    }
    seenDifficulties.add(difficulty);
  }

  const puzzleWords = new Set(CONNECTION_DIFFICULTIES.flatMap((difficulty) => answer[difficulty]));
  const attemptSignatures = new Set();
  for (const attempt of attempts) {
    if (!Array.isArray(attempt) || attempt.length !== 4) {
      return { valid: false, reason: 'invalid_attempt' };
    }
    const words = attempt.map((word) => String(word).trim().toUpperCase());
    if (new Set(words).size !== 4 || words.some((word) => !puzzleWords.has(word))) {
      return { valid: false, reason: 'invalid_attempt' };
    }
    const signature = wordsSignature(words);
    if (attemptSignatures.has(signature)) {
      return { valid: false, reason: 'duplicate_attempt' };
    }
    attemptSignatures.add(signature);
  }

  const derivedOutcome = foundGroups.length === 4
    ? 'win'
    : mistakes === 4
      ? 'loss'
      : null;
  if (!derivedOutcome) return { valid: false, reason: 'game_not_complete' };
  if (outcome !== derivedOutcome) return { valid: false, reason: 'outcome_mismatch' };

  return {
    valid: true,
    date: puzzle.date,
    outcome: derivedOutcome,
    mistakes,
    attempts,
    foundGroups,
  };
}

const FLAGLE_ALIASES = new Map([
  ['unitedstates', ['usa', 'unitedstatesofamerica', 'america', 'us']],
  ['unitedkingdom', ['uk', 'greatbritain', 'britain', 'gb']],
  ['netherlands', ['holland']],
  ['russianfederation', ['russia']],
  ['korearepublicof', ['southkorea', 'korea']],
  ['koreademocraticpeoplesrepublicof', ['northkorea', 'dprk']],
  ['czechrepublic', ['czechia']],
  ['ivorycoast', ['cotedivoire']],
  ['palestinestateof', ['palestine']],
  ['china', ['peoplesrepublicofchina', 'prc']],
  ['taiwanprovinceofchina', ['taiwan', 'republicofchina', 'roc']],
]);

function normaliseCountry(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/^the/, '');
}

function isCountryGuess(guess, country) {
  const expected = normaliseCountry(country);
  const actual = normaliseCountry(guess);
  if (!expected || !actual) return false;
  if (actual === expected) return true;
  if (String(country).includes(',') && String(country).split(',').some((part) => normaliseCountry(part) === actual)) {
    return true;
  }
  const aliases = FLAGLE_ALIASES.get(expected) || [];
  if (aliases.includes(actual)) return true;
  for (const [official, knownAliases] of FLAGLE_ALIASES) {
    if (knownAliases.includes(expected) && (actual === official || knownAliases.includes(actual))) return true;
  }
  return false;
}

export function validateFlagleCompletion({
  puzzleId,
  answers,
  allAttempts,
  score,
  outcome,
  countries,
  now = new Date(),
}) {
  const puzzle = validateCurrentPuzzleId(puzzleId, 'flagle', now);
  if (!puzzle.valid) return puzzle;
  if (!Array.isArray(countries) || countries.length !== 5 || !Array.isArray(allAttempts) || !Array.isArray(answers)) {
    return { valid: false, reason: 'invalid_game_data' };
  }
  if (!Number.isInteger(score) || score < 0 || score > 300 || score % 20 !== 0) {
    return { valid: false, reason: 'invalid_score' };
  }

  let lives = 3;
  let flagIndex = 0;
  let derivedScore = 0;
  const derivedAnswers = [];
  for (const attempt of allAttempts) {
    if (lives === 0 || flagIndex === 5) return { valid: false, reason: 'attempt_after_completion' };
    const expectedCountry = countries[flagIndex];
    if (attempt?.flagIndex !== flagIndex || attempt?.country !== expectedCountry) {
      return { valid: false, reason: 'attempt_country_mismatch' };
    }
    const correct = isCountryGuess(attempt.guess, expectedCountry);
    if (attempt.correct !== correct) return { valid: false, reason: 'attempt_result_mismatch' };
    if (correct) {
      derivedScore += lives * 20;
      derivedAnswers.push({ country: expectedCountry, guess: attempt.guess, correct: true, skipped: false });
      flagIndex += 1;
    } else {
      lives -= 1;
      if (lives === 0) {
        derivedAnswers.push({ country: expectedCountry, guess: attempt.guess, correct: false, skipped: false });
      }
    }
  }

  const derivedOutcome = flagIndex === 5 ? 'win' : lives === 0 ? 'loss' : null;
  if (!derivedOutcome) return { valid: false, reason: 'game_not_complete' };
  if (outcome !== derivedOutcome) return { valid: false, reason: 'outcome_mismatch' };
  if (score !== derivedScore) return { valid: false, reason: 'score_mismatch' };
  if (JSON.stringify(answers) !== JSON.stringify(derivedAnswers)) {
    return { valid: false, reason: 'answers_mismatch' };
  }

  return {
    valid: true,
    date: puzzle.date,
    outcome: derivedOutcome,
    correctCount: flagIndex,
    score: derivedScore,
  };
}

export function validateUnlimitedCompletion({ word, outcome, attempts, guesses, masks }) {
  const solution = String(word || '').trim().toUpperCase();
  if (!/^[A-Z]{5}$/.test(solution)) return { valid: false, reason: 'invalid_word' };
  if (!Array.isArray(guesses) || !Array.isArray(masks) || guesses.length !== masks.length) {
    return { valid: false, reason: 'invalid_game_data' };
  }
  if (!Number.isInteger(attempts) || attempts !== guesses.length || attempts < 1 || attempts > 6) {
    return { valid: false, reason: 'invalid_attempts' };
  }

  const normalisedGuesses = guesses.map((guess) => String(guess).trim().toUpperCase());
  const normalisedMasks = masks.map((mask) => String(mask).trim().toUpperCase());
  if (normalisedGuesses.some((guess) => !/^[A-Z]{5}$/.test(guess))) {
    return { valid: false, reason: 'invalid_guess' };
  }
  for (let index = 0; index < attempts; index += 1) {
    if (normalisedMasks[index] !== gradeWordleGuess(normalisedGuesses[index], solution).join('')) {
      return { valid: false, reason: 'mask_mismatch' };
    }
  }

  const solvedIndex = normalisedMasks.indexOf('GGGGG');
  const derivedOutcome = solvedIndex >= 0 ? 'win' : attempts === 6 ? 'loss' : null;
  if (!derivedOutcome || solvedIndex >= 0 && solvedIndex !== attempts - 1) {
    return { valid: false, reason: 'game_not_complete' };
  }
  if (outcome !== derivedOutcome) return { valid: false, reason: 'outcome_mismatch' };

  return {
    valid: true,
    word: solution,
    outcome: derivedOutcome,
    attempts,
    guesses: normalisedGuesses,
    masks: normalisedMasks,
  };
}
