import { defineInt } from 'firebase-functions/params'
import { db } from '../config/firebase.mjs'
import { createBudgetReserver } from './translationPolicy.mjs'

const userChars = defineInt('TRANSLATION_USER_DAILY_CHARACTERS', { default: 20000 })
const globalChars = defineInt('TRANSLATION_GLOBAL_DAILY_CHARACTERS', { default: 200000 })
export const reserveTranslationBudget = (uid, chars) => createBudgetReserver(db, {
  user: { characters: userChars.value(), requests: 100 },
  global: { characters: globalChars.value(), requests: 1000 },
})(uid, chars)
