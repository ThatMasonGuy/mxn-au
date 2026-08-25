import test from 'node:test'
import assert from 'node:assert/strict'

import { generateCompatibilityUserName } from '../src/shared/utils/useGenerateUserProfile.js'

test('compatibility usernames use the account name and remain unique for matching names', () => {
  const firstAccount = generateCompatibilityUserName({
    firstName: 'Mason',
    lastName: 'Bartholomai',
    uid: 'firebase-user-one'
  })
  const secondAccount = generateCompatibilityUserName({
    firstName: 'Mason',
    lastName: 'Bartholomai',
    uid: 'firebase-user-two'
  })

  assert.equal(firstAccount, 'mason-bartholomai-firebase-user-one')
  assert.equal(secondAccount, 'mason-bartholomai-firebase-user-two')
  assert.notEqual(firstAccount, secondAccount)
})

test('compatibility usernames normalise names and retain a stable fallback', () => {
  assert.equal(
    generateCompatibilityUserName({ firstName: ' Renée ', lastName: "O'Connor", uid: 'abc123' }),
    'renee-o-connor-abc123'
  )
  assert.equal(generateCompatibilityUserName({ uid: 'abc123' }), 'user-abc123')
  assert.throws(
    () => generateCompatibilityUserName({ firstName: 'Mason', lastName: 'Bartholomai' }),
    /user ID is required/i
  )
})
