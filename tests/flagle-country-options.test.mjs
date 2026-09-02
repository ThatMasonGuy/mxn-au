import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { FLAGLE_DIFFICULTY_TIERS } from '../functions/dailyGames/flagleCountryTiers.mjs'
import {
  buildFlagleCountryOptions,
  normalizeFlagleCountry,
} from '../src/features/daily/utils/flagleCountryOptions.js'

const catalog = JSON.parse(readFileSync(new URL('../src/shared/data/countries.json', import.meta.url), 'utf8'))

test('every generated Flagle country is available through canonical autocomplete data', () => {
  const options = new Set(buildFlagleCountryOptions(catalog))
  for (const country of Object.values(FLAGLE_DIFFICULTY_TIERS).flat()) {
    assert.equal(options.has(country), true, `${country} is missing from autocomplete`)
  }
  assert.equal(options.has('Russia'), true)
})

test('Flagle country matching treats accented canonical names consistently', () => {
  assert.equal(normalizeFlagleCountry("Côte d'Ivoire"), 'cotedivoire')
  assert.equal(normalizeFlagleCountry("Cote d'Ivoire"), 'cotedivoire')
})
