const GENERIC_TITLES = new Set([
  "EASY",
  "MEDIUM",
  "HARD",
  "EXPERT",
  "STRAIGHTFORWARD",
  "CATEGORIES",
  "WORDPLAY",
  "TRICKY",
]);

const KNOWN_GROUP_TITLES = new Map([
  ["APPLE|BANANA|GRAPE|ORANGE", "FRUIT"],
  ["BLUE|GREEN|RED|YELLOW", "COLOURS"],
  ["EAST|NORTH|SOUTH|WEST", "CARDINAL DIRECTIONS"],
  ["ALPHA|BETA|DELTA|GAMMA", "GREEK LETTERS"],
]);

function cleanTitle(value) {
  return typeof value === "string" ? value.trim() : "";
}

function wordsKey(words) {
  return Array.isArray(words)
    ? words.map((word) => String(word).trim().toUpperCase()).sort().join("|")
    : "";
}

export function isGenericConnectionTitle(value) {
  const title = cleanTitle(value);
  return !title || GENERIC_TITLES.has(title.toUpperCase());
}

export function resolveConnectionCategoryTitle({
  difficulty,
  words,
  categories,
  storedTitle,
}) {
  const configuredTitle = cleanTitle(categories?.[difficulty]);
  if (!isGenericConnectionTitle(configuredTitle)) return configuredTitle;

  const knownTitle = KNOWN_GROUP_TITLES.get(wordsKey(words));
  if (knownTitle) return knownTitle;

  const previousTitle = cleanTitle(storedTitle);
  if (!isGenericConnectionTitle(previousTitle)) return previousTitle;

  return "CATEGORY";
}

export function normaliseConnectionCategories(groups, categories) {
  if (!groups) return categories || null;

  return Object.fromEntries(
    ["easy", "medium", "hard", "expert"].map((difficulty) => [
      difficulty,
      resolveConnectionCategoryTitle({
        difficulty,
        words: groups[difficulty],
        categories,
      }),
    ]),
  );
}
