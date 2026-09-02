export const CONNECTION_DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'];

export const CURATED_CONNECTIONS_FALLBACK = Object.freeze({
  answer: Object.freeze({
    easy: Object.freeze(['SHIFT', 'OWL', 'CAP', 'LIGHT']),
    medium: Object.freeze(['DASH', 'SCORE', 'SURF', 'KEY']),
    hard: Object.freeze(['MATCH', 'DEAL', 'POSE', 'CHORD']),
    expert: Object.freeze(['SALES', 'PERFECT', 'FEVER', 'ROOF']),
  }),
  categories: Object.freeze({
    easy: 'NIGHT ___',
    medium: '___BOARD',
    hard: 'THINGS YOU CAN STRIKE',
    expert: 'KINDS OF PITCH',
  }),
});

const GENERIC_CATEGORY_TITLES = new Set([
  'EASY',
  'MEDIUM',
  'HARD',
  'EXPERT',
  'STRAIGHTFORWARD',
  'CATEGORIES',
  'CATEGORY',
  'WORDPLAY',
  'TRICKY',
]);

const TRIVIAL_CATEGORY_PATTERNS = [
  /^FRUITS?$/,
  /^COLOU?RS?$/,
  /^(?:CARDINAL|COMPASS) DIRECTIONS?$/,
  /^COMPASS POINTS?$/,
  /^GREEK LETTERS?$/,
  /^DAYS?(?: OF THE WEEK)?$/,
  /^MONTHS?(?: OF THE YEAR)?$/,
  /^(?:BASIC )?SHAPES?$/,
  /^SEASONS?$/,
  /^PLANETS?$/,
  /^(?:COMMON )?ANIMALS?$/,
];

const LEGACY_TRIVIAL_GROUPS = [
  ['APPLE', 'BANANA', 'GRAPE', 'ORANGE'],
  ['BLUE', 'GREEN', 'RED', 'YELLOW'],
  ['EAST', 'NORTH', 'SOUTH', 'WEST'],
  ['ALPHA', 'BETA', 'DELTA', 'GAMMA'],
];

function groupSignature(words) {
  return [...words].sort().join('|');
}

const LEGACY_TRIVIAL_SIGNATURES = new Set(
  LEGACY_TRIVIAL_GROUPS.map(groupSignature),
);

export function validateConnectionsPuzzle(answer, categories, { bannedWords = [] } = {}) {
  if (!answer || !categories) {
    return { valid: false, reason: 'missing_answer_or_categories' };
  }

  const banned = new Set(Array.from(bannedWords, (word) => String(word).trim().toUpperCase()));
  const normalisedAnswer = {};
  const normalisedCategories = {};

  for (const difficulty of CONNECTION_DIFFICULTIES) {
    const words = answer[difficulty];
    if (!Array.isArray(words) || words.length !== 4) {
      return { valid: false, reason: `invalid_${difficulty}_group` };
    }

    const normalisedWords = words.map((word) => String(word).trim().toUpperCase());
    if (normalisedWords.some((word) => !/^[A-Z]{3,10}$/.test(word))) {
      return { valid: false, reason: `invalid_${difficulty}_word` };
    }
    if (normalisedWords.some((word) => banned.has(word))) {
      return { valid: false, reason: 'reused_word' };
    }
    if (LEGACY_TRIVIAL_SIGNATURES.has(groupSignature(normalisedWords))) {
      return { valid: false, reason: 'legacy_trivial_group' };
    }

    const category = typeof categories[difficulty] === 'string'
      ? categories[difficulty].trim()
      : '';
    const categoryKey = category.toUpperCase();
    if (!category) {
      return { valid: false, reason: `missing_${difficulty}_category` };
    }
    if (GENERIC_CATEGORY_TITLES.has(categoryKey)) {
      return { valid: false, reason: 'generic_category' };
    }
    if (TRIVIAL_CATEGORY_PATTERNS.some((pattern) => pattern.test(categoryKey))) {
      return { valid: false, reason: 'trivial_category' };
    }

    normalisedAnswer[difficulty] = normalisedWords;
    normalisedCategories[difficulty] = category;
  }

  const allWords = CONNECTION_DIFFICULTIES.flatMap(
    (difficulty) => normalisedAnswer[difficulty],
  );
  if (new Set(allWords).size !== 16) {
    return { valid: false, reason: 'duplicate_words' };
  }

  return {
    valid: true,
    answer: normalisedAnswer,
    categories: normalisedCategories,
  };
}
