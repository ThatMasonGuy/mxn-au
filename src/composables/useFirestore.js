// @/composables/useFirestore.js
import { getFirestore } from 'firebase/firestore'

/**
 * Firestore composable
 * Returns the Firestore database instance
 */
export const useFirestore = () => {
  return getFirestore()
}
