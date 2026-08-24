const ALLOWED_METHODS = new Set(['GET', 'POST', 'PUT', 'DELETE'])
const ALLOWED_PATH = /^\/api\/(?:discord|calendar|audit|config|stats)\/(\d{17,20})(?:\/[A-Za-z0-9_-]+)*$/

export function isAllowedBotProxyMethod(method) {
  return ALLOWED_METHODS.has(method)
}

export function safeBotProxyPath(value) {
  const rawPath = String(value || '')
  if (
    !rawPath.startsWith('/')
    || rawPath.startsWith('//')
    || rawPath.length > 500
    || rawPath.includes('..')
  ) return null

  const parsed = new URL(rawPath, 'https://mxn.invalid')
  if (!ALLOWED_PATH.test(parsed.pathname)) return null

  const safeSearch = new URLSearchParams()
  for (const [key, entry] of parsed.searchParams) {
    if (['page', 'pageSize'].includes(key) && /^\d{1,4}$/.test(entry)) safeSearch.set(key, entry)
  }

  return `${parsed.pathname}${safeSearch.size ? `?${safeSearch}` : ''}`
}

export function serverIdFromBotProxyPath(proxyPath) {
  return new URL(proxyPath, 'https://mxn.invalid').pathname.match(ALLOWED_PATH)?.[1] ?? null
}

export function enforceTrustedBotActor({ method, proxyPath, serverId, body, session }) {
  const requestBody = body && typeof body === 'object' ? body : {}

  if (method === 'POST' && proxyPath.startsWith(`/api/audit/${serverId}`)) {
    return {
      ...requestBody,
      userId: session.discordUserId,
      userName: session.userData.username,
      userAvatar: session.userData.avatarUrl || null,
    }
  }

  if (method === 'POST' && proxyPath === `/api/calendar/${serverId}`) {
    return {
      ...requestBody,
      creatorUserId: session.discordUserId,
      creatorUserName: session.userData.username,
      creatorUserAvatar: session.userData.avatarUrl || null,
    }
  }

  return body
}
