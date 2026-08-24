import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { requireManagedDiscordGuild } from './discordSession.mjs'
import {
  enforceTrustedBotActor,
  isAllowedBotProxyMethod,
  safeBotProxyPath,
  serverIdFromBotProxyPath,
} from './botProxyPolicy.mjs'

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
export const botApiProxy = onRequest(
  {
    region: 'australia-southeast1',
    timeoutSeconds: 30,
    memory: '512MiB',
    invoker: 'public',
    cors: ALLOWED_ORIGINS,
    secrets: [BOT_SERVER_URL, BOT_API_KEY],
  },
  async (req, res) => {
    try {
      if (!isAllowedBotProxyMethod(req.method)) {
        res.status(405).json({ error: 'Method not allowed' })
        return
      }

      const proxyPath = safeBotProxyPath(req.query.path)
      if (!proxyPath) {
        res.status(400).json({ error: 'Unsupported bot API path' })
        return
      }

      const serverId = serverIdFromBotProxyPath(proxyPath)
      const session = await requireManagedDiscordGuild(req, serverId)
      const body = enforceTrustedBotActor({
        method: req.method,
        proxyPath,
        serverId,
        body: req.body,
        session,
      })

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
