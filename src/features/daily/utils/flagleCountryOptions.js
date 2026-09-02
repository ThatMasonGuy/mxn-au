export const FLAGLE_COUNTRY_ALIASES = Object.freeze({
  "United States": ["USA", "United States of America", "America", "US"],
  "United Kingdom": ["UK", "Great Britain", "Britain", "GB"],
  Netherlands: ["Holland"],
  "Russian Federation": ["Russia"],
  "Korea, Republic of": ["South Korea", "Korea"],
  "Korea, Democratic People's Republic of": ["North Korea", "DPRK"],
  "Czech Republic": ["Czechia"],
  "Ivory Coast": ["Cote d'Ivoire", "Côte d'Ivoire"],
  "Palestine, State of": ["Palestine"],
  China: ["People's Republic of China", "PRC"],
  "Taiwan, Province of China": ["Taiwan", "Republic of China", "ROC"],
});

export function normalizeFlagleCountry(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/^the/, "");
}

export function buildFlagleCountryOptions(countryEntries) {
  const values = (Array.isArray(countryEntries) ? countryEntries : [])
    .map((country) => country?.label)
    .filter(Boolean);
  for (const [official, aliases] of Object.entries(FLAGLE_COUNTRY_ALIASES)) {
    values.push(official, ...aliases);
  }
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}
