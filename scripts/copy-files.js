import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDataDir = path.join(rootDir, "public", "data");

// Ensure public/data exists
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

async function copyAndFilterWords() {
  console.log("Processing words.json...");
  const sourcePath = path.join(
    rootDir,
    "node_modules",
    "word-list-json",
    "data",
    "words.json",
  );
  const altSourcePath = path.join(
    rootDir,
    "node_modules",
    "word-list-json",
    "words.json",
  );

  let wordsPath = fs.existsSync(sourcePath) ? sourcePath : altSourcePath;

  if (!fs.existsSync(wordsPath)) {
    console.error(
      `Could not find words.json at ${sourcePath} or ${altSourcePath}`,
    );
    return;
  }

  const rawData = fs.readFileSync(wordsPath, "utf8");
  const data = JSON.parse(rawData);

  let filteredWords = [];

  // The source is {"words": [...]}
  if (data && Array.isArray(data.words)) {
    filteredWords = data.words.filter((word) => word.length === 5);
  } else if (Array.isArray(data)) {
    filteredWords = data.filter((word) => word.length === 5);
  } else if (data && typeof data === "object") {
    // Fallback for key-based objects
    filteredWords = Object.keys(data).filter((word) => word.length === 5);
  }

  const targetPath = path.join(publicDataDir, "words.json");
  // Output format: {"words": [...]}
  fs.writeFileSync(
    targetPath,
    JSON.stringify({ words: filteredWords }),
    "utf8",
  );
  console.log(
    `Successfully wrote ${filteredWords.length} words to ${targetPath}`,
  );
}

async function copyCountries() {
  console.log("Processing countries.json...");
  const sourcePath = path.join(
    rootDir,
    "node_modules",
    "world-countries",
    "countries.json",
  );
  const targetPath = path.join(publicDataDir, "countries.json");

  if (!fs.existsSync(sourcePath)) {
    console.error(`Could not find countries.json at ${sourcePath}`);
    return;
  }

  const rawData = fs.readFileSync(sourcePath, "utf8");
  const countries = JSON.parse(rawData);

  // Trim data: Keep only 'name' and 'latlng'
  const trimmedCountries = countries.map((country) => ({
    name: {
      common: country.name.common,
      official: country.name.official,
      native: country.name.native,
    },
    latlng: country.latlng,
  }));

  fs.writeFileSync(targetPath, JSON.stringify(trimmedCountries), "utf8");
  console.log(
    `Successfully wrote ${trimmedCountries.length} trimmed countries to ${targetPath}`,
  );
}

async function run() {
  try {
    await copyAndFilterWords();
    await copyCountries();
    console.log("File copy process completed.");
  } catch (error) {
    console.error("Error during file copy:", error);
    process.exit(1);
  }
}

run();
