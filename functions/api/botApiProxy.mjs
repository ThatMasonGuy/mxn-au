import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { requireManagedDiscordGuild } from './discordSession.mjs'

const BOT_SERVER_URL = defineSecret('BOT_SERVER_URL')
const BOT_API_KEY = defineSecret('BOT_API_KEY')
const ALLOWED_ORIGINS = [
  'https://mxn.au',
  'https://www.mxn.au',
  'https://mxn-au.web.app',
  'https://mxn-au.firebaseapp.com',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
]
const ALLOWED_METHODS = new Set(['GET', 'POST', 'PUT', 'DELETE'])
const ALLOWED_PATH = /^\/api\/(?:discord|calendar|audit|config|stats)\/(\d{17,20})(?:\/[A-Za-z0-9_-]+)*$/

function safeProxyPath(value) {
  const rawPath = String(value || '')
  if (!rawPath || rawPath.length > 500 || rawPath.includes('..')) return null

  const parsed = new URL(rawPath, 'https://mxn.invalid')
  if (!ALLOWED_PATH.test(parsed.pathname)) return null

  const safeSearch = new URLSearchParams()
  for (const [key, entry] of parsed.searchParams) {
    if (['page', 'pageSize'].includes(key) && /^\d{1,4}$/.test(entry)) safeSearch.set(key, entry)
  }

  return `${parsed.pathname}${safeSearch.size ? `?${safeSearch}` : ''}`
}

export const botApiProxy = onRequest(
  {
    region: 'australia-southeast1',
    timeoutSeconds: 30,
    memory: '256MiB',
    cpu: 'gcf_gen1',
    invoker: 'public',
    cors: ALLOWED_ORIGINS,
    secrets: [BOT_SERVER_URL, BOT_API_KEY],
  },
  async (req, res) => {
    try {
      if (!ALLOWED_METHODS.has(req.method)) {
        res.status(405).json({ error: 'Method not allowed' })
        return
      }

      const proxyPath = safeProxyPath(req.query.path)
      if (!proxyPath) {
        res.status(400).json({ error: 'Unsupported bot API path' })
        return
      }

      const serverId = new URL(proxyPath, 'https://mxn.invalid').pathname.match(ALLOWED_PATH)?.[1]
      const session = await requireManagedDiscordGuild(req, serverId)
      let body = req.body

      if (req.method === 'POST' && proxyPath.startsWith(`/api/audit/${serverId}`)) {
        body = {
          ...(body && typeof body === 'object' ? body : {}),
          userId: session.discordUserId,
          userName: session.userData.username,
          userAvatar: session.userData.avatarUrl || null,
        }
      }

      if (req.method === 'POST' && proxyPath === `/api/calendar/${serverId}`) {
        body = {
          ...(body && typeof body === 'object' ? body : {}),
          creatorUserId: session.discordUserId,
          creatorUserName: session.userData.username,
          creatorUserAvatar: session.userData.avatarUrl || null,
        }
      }

      const upstream = await fetch(`${BOT_SERVER_URL.value()}${proxyPath}`, {
        method: req.method,
        headers: {
          Authorization: `Bearer ${BOT_API_KEY.value()}`,
          ...(body !== undefined && req.method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body !== undefined && req.method !== 'GET' ? JSON.stringify(body) : undefined,
      })

      const responseText = await upstream.text()
      const contentType = upstream.headers.get('content-type') || 'application/json; charset=utf-8'
      res.status(upstream.status).set('Content-Type', contentType).send(responseText)
    } catch (error) {
      const status = Number(error?.status) || 500
      console.error(JSON.stringify({
        scope: 'bot-api-proxy',
        outcome: 'failure',
        status,
        error: status >= 500 ? 'upstream_or_internal_failure' : error.message,
      }))
      res.status(status).json({ error: status >= 500 ? 'Bot service request failed' : error.message })
    }
  },
)
