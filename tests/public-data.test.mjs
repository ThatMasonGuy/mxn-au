import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

async function readJson(relativePath) {
  const contents = await readFile(new URL(relativePath, import.meta.url), 'utf8')
  return JSON.parse(contents)
}

test('public countries data contains usable names and coordinates', async () => {
  const countries = await readJson('../public/data/countries.json')

  assert.ok(Array.isArray(countries))
  assert.ok(countries.length >= 240, `expected at least 240 countries, received ${countries.length}`)
  for (const country of countries) {
    assert.equal(typeof country?.name?.common, 'string')
    assert.ok(country.name.common.trim())
    assert.equal(country.latlng?.length, 2, `${country.name.common} must have latitude and longitude`)
    assert.ok(country.latlng.every(Number.isFinite), `${country.name.common} has invalid coordinates`)
  }

  assert.ok(countries.some((country) => country.name.common === 'Australia'))
})

test('public words data contains a substantial unique five-letter word list', async () => {
  const data = await readJson('../public/data/words.json')
  const words = data?.words

  assert.ok(Array.isArray(words))
  assert.ok(words.length >= 10_000, `expected at least 10,000 words, received ${words.length}`)
  assert.equal(new Set(words).size, words.length, 'words must be unique')
  for (const word of words) {
    assert.match(word, /^[a-z]{5}$/)
  }
})
