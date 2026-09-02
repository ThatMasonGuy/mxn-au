import assert from 'node:assert/strict'
import test from 'node:test'

import {
  normaliseConnectionCategories,
  resolveConnectionCategoryTitle,
} from '../src/features/daily/utils/connectionsCategories.js'

const fallbackGroups = {
  easy: ['APPLE', 'BANANA', 'ORANGE', 'GRAPE'],
  medium: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
  hard: ['NORTH', 'SOUTH', 'EAST', 'WEST'],
  expert: ['ALPHA', 'BETA', 'GAMMA', 'DELTA'],
}

test('fallback Connections groups display their category names, not difficulty labels', () => {
  assert.deepEqual(normaliseConnectionCategories(fallbackGroups, {
    easy: 'STRAIGHTFORWARD',
    medium: 'CATEGORIES',
    hard: 'WORDPLAY',
    expert: 'TRICKY',
  }), {
    easy: 'FRUIT',
    medium: 'COLOURS',
    hard: 'CARDINAL DIRECTIONS',
    expert: 'GREEK LETTERS',
  })
})

test('generated category names are preserved for solved groups', () => {
  assert.equal(resolveConnectionCategoryTitle({
    difficulty: 'hard',
    words: ['BARK', 'HOWL', 'MEOW', 'OINK'],
    categories: { hard: 'ANIMAL SOUNDS' },
    storedTitle: 'WORDPLAY',
  }), 'ANIMAL SOUNDS')
})
