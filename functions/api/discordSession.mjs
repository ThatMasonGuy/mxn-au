import { createHash, randomBytes } from 'node:crypto'
import { db } from '../config/firebase.mjs'
import { canManageDiscordGuild } from './discordAuthorization.mjs'

const SESSION_COLLECTION = 'discord_sessions'
const SESSION_TTL_MS = 24 * 60 * 60 * 1000

function sessionHash(token) {
  return createHash('sha256').update(token).digest('hex')
}

export async function issueDiscordSession(discordUserId) {
  const token = randomBytes(32).toString('base64url')
  const now = Date.now()

  await db.collection(SESSION_COLLECTION).doc(sessionHash(token)).set({
    discordUserId: String(discordUserId),
    createdAt: new Date(now),
    expiresAt: new Date(now + SESSION_TTL_MS),
  })

  return token
}

export async function requireDiscordSession(req) {
  const authHeader = String(req.headers.authorization || '')
  if (!authHeader.startsWith('Bearer ')) {
    const error = new Error('Missing or invalid authorization header')
    error.status = 401
    throw error
  }

  const token = authHeader.slice(7).trim()
  if (!/^[A-Za-z0-9_-]{40,100}$/.test(token)) {
    const error = new Error('Invalid session')
    error.status = 401
    throw error
  }

  const sessionRef = db.collection(SESSION_COLLECTION).doc(sessionHash(token))
  const sessionSnapshot = await sessionRef.get()
  const session = sessionSnapshot.data()
  const expiresAt = session?.expiresAt?.toMillis?.() ?? new Date(session?.expiresAt || 0).getTime()

  if (!sessionSnapshot.exists || !session?.discordUserId || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    if (sessionSnapshot.exists) void sessionRef.delete().catch(() => {})
    const error = new Error('Session expired')
    error.status = 401
    throw error
  }

  const userSnapshot = await db.collection('discord_users').doc(session.discordUserId).get()
  if (!userSnapshot.exists) {
    const error = new Error('Discord account is no longer linked')
    error.status = 401
    throw error
  }

  return {
    discordUserId: session.discordUserId,
    sessionRef,
    userData: userSnapshot.data(),
  }
}

export async function requireManagedDiscordGuild(req, serverId) {
  if (!/^\d{17,20}$/.test(String(serverId || ''))) {
    const error = new Error('Invalid server ID')
    error.status = 400
    throw error
  }

  const session = await requireDiscordSession(req)
  const accessToken = session.userData?.accessToken
  if (!accessToken) {
    const error = new Error('Discord account must be linked again')
    error.status = 401
    throw error
  }

  const response = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    const error = new Error('Discord session must be refreshed')
    error.status = 401
    throw error
  }

  const guilds = await response.json()
  const guild = guilds.find(candidate => candidate.id === String(serverId))
  if (!canManageDiscordGuild(guild)) {
    const error = new Error('You do not have permission to manage this server')
    error.status = 403
    throw error
  }

  return { ...session, guild }
}
