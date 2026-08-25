import { firebaseAdmin, db } from '../config/firebase.mjs'
import { hasSiteAdminRole } from './adminRoles.mjs'

export async function requireSiteAdmin(request) {
  const header = request.get('authorization') ?? ''
  const token = header.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) {
    const error = new Error('Site administrator sign-in is required')
    error.status = 401
    throw error
  }

  let decoded
  try {
    decoded = await firebaseAdmin.auth().verifyIdToken(token)
  } catch {
    const error = new Error('Your site administrator session is invalid or expired')
    error.status = 401
    throw error
  }

  const user = await db.collection('users').doc(decoded.uid).get()
  if (!hasSiteAdminRole(user.data()?.roles)) {
    const error = new Error('The siteAdmin role is required')
    error.status = 403
    throw error
  }

  return decoded
}
