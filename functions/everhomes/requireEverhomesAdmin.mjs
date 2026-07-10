import { firebaseAdmin, db } from '../config/firebase.mjs'

export async function requireEverhomesAdmin(request) {
  const header = request.get('authorization') ?? ''
  const token = header.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) {
    const error = new Error('Administrator sign-in is required')
    error.status = 401
    throw error
  }

  let decoded
  try {
    decoded = await firebaseAdmin.auth().verifyIdToken(token)
  } catch {
    const error = new Error('Administrator session is invalid or expired')
    error.status = 401
    throw error
  }

  const user = await db.collection('users').doc(decoded.uid).get()
  const roles = user.data()?.roles ?? []
  if (!Array.isArray(roles) || !roles.some((role) => role === 'admin' || role === 'siteAdmin')) {
    const error = new Error('Administrator access is required')
    error.status = 403
    throw error
  }

  return decoded
}
