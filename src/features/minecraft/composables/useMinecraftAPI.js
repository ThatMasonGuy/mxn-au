import { ref, computed } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'
import { useMainStore } from '@/shared/stores/useMainStore'
import {
  createFallbackDetail,
  createFallbackServers,
  getRegistryServer,
} from '@/features/minecraft/data/personalServers'

const explicitApiUrl = import.meta.env.VITE_MINECRAFT_AU_SERVER_API
const wsUrl = import.meta.env.VITE_SSH_WS_URL || 'wss://ssh.mxn.au'
const derivedApiUrl = wsUrl.replace('wss://', 'https://').replace('ws://', 'http://')
const baseUrl = (explicitApiUrl || derivedApiUrl || '').replace(/\/$/, '')
const API_ROOT = baseUrl.endsWith('/api/minecraft') ? baseUrl : `${baseUrl}/api/minecraft`

const destructivePlayerActions = new Set(['ban', 'pardon', 'kick', 'op', 'deop'])
let authReadyPromise = null

function waitForAuthUser() {
  if (auth.currentUser) return Promise.resolve(auth.currentUser)
  if (!authReadyPromise) {
    authReadyPromise = new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe()
        resolve(user || null)
      })
    })
  }
  return authReadyPromise
}

function withQuery(path, params = {}) {
  const url = new URL(`${API_ROOT}${path}`, window.location.origin)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })
  return url.toString()
}

function booleanQuery(value) {
  if (value === undefined || value === null) return undefined
  return value ? '1' : '0'
}

function snapshotQuery(options = {}) {
  return {
    includePlayers: booleanQuery(options.includePlayers),
    includeOnline: booleanQuery(options.includeOnline),
  }
}

function parseDownloadFilename(disposition) {
  const match = String(disposition || '').match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i)
  return match ? decodeURIComponent(match[1]) : ''
}

function fallbackLogExport(serverId, options = {}) {
  const detail = createFallbackDetail(serverId)
  const query = String(options.query || '').trim().toLowerCase()
  const tail = Math.min(Math.max(Number(options.tail || options.lines || 200), 1), 2000)
  const lines = (detail.logs || [])
    .filter((line) => !query || line.toLowerCase().includes(query))
    .slice(-tail)
  const file = options.file || 'latest.log'
  const text = [
    'Minecraft log export',
    `Server: ${detail.label} (${serverId})`,
    `File: ${file}`,
    `Tail: ${tail}`,
    `Query: ${options.query || '-'}`,
    `Exported: ${new Date().toISOString()}`,
    '',
    ...lines,
    '',
  ].join('\n')

  return {
    text,
    filename: `minecraft-${serverId}-${String(file).replace(/[^A-Za-z0-9_.-]/g, '_')}-snapshot.txt`,
    fallback: true,
  }
}

function fallbackCommandResult(serverId, command) {
  const server = getRegistryServer(serverId)
  const response = command.trim() === 'list'
    ? 'There are 0 of 20 players online.'
    : `Queued command for ${server?.label || serverId}: ${command}`

  return {
    ok: true,
    command,
    output: response,
    timestamp: new Date().toISOString(),
  }
}

function fallbackLifecycle(serverId, action) {
  const detail = createFallbackDetail(serverId)
  const nextState = {
    wake: 'warming',
    start: 'warming',
    sleep: 'hibernating',
    stop: 'hibernating',
    restart: 'warming',
  }[action] || detail.state

  return {
    ok: true,
    server: {
      ...detail,
      state: nextState,
      stateSince: new Date().toISOString(),
      lastAction: action,
    },
  }
}

function fallbackDiagnostics(serverId) {
  const detail = createFallbackDetail(serverId)
  const checks = [
    {
      id: 'snapshot',
      label: 'API bridge',
      status: 'warning',
      message: 'Runtime diagnostics require the Minecraft API bridge',
    },
    {
      id: 'registry',
      label: 'Registry entry',
      status: 'pass',
      message: `${detail.label} is present in the local snapshot`,
      host: detail.host,
      publicPort: detail.publicPort,
      backendPort: detail.backendPort,
      rconPort: detail.rconPort,
    },
  ]

  return {
    ok: false,
    status: 'warning',
    checkedAt: new Date().toISOString(),
    serverId,
    root: detail.root,
    backupRoot: `/mnt/storage-1/minecraft/backups/snapshots/${serverId}`,
    activityLog: '/mnt/storage-1/minecraft/panel-activity.jsonl',
    summary: { pass: 1, warning: 1, error: 0, info: 0 },
    checks,
  }
}

export const useMinecraftAPI = () => {
  const mainStore = useMainStore()
  const loading = ref(false)
  const error = ref(null)
  const usingFallback = ref(false)
  const lastFallbackReason = ref('')

  const endpoint = computed(() => API_ROOT)

  const getFreshToken = async (forceRefresh = false) => {
    const user = auth.currentUser || await waitForAuthUser()
    if (!user) return mainStore.token || ''
    try {
      const token = await user.getIdToken(forceRefresh)
      if (token && token !== mainStore.token) {
        mainStore.token = token
      }
      return token || mainStore.token || ''
    } catch {
      return mainStore.token || ''
    }
  }

  const authHeaders = async (options = {}) => {
    const headers = { 'Content-Type': 'application/json' }
    const token = await getFreshToken(options.forceRefresh)
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    return headers
  }

  const authOnlyHeaders = async (options = {}) => {
    const headers = {}
    const token = await getFreshToken(options.forceRefresh)
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    return headers
  }

  const fetchWithAuth = async (url, init = {}, options = {}) => {
    const headerFactory = options.authOnly ? authOnlyHeaders : authHeaders
    const send = async (forceRefresh = false) => fetch(url, {
      ...init,
      headers: {
        ...(await headerFactory({ forceRefresh })),
        ...(init.headers || {}),
      },
    })

    let response = await send(false)
    if (response.status === 401 && options.retryAuth !== false && auth.currentUser) {
      response = await send(true)
    }
    return response
  }

  const openAuthenticatedSocket = (url, handlers = {}) => {
    let ws = null
    let stopped = false
    const emit = (event) => handlers.onEvent?.(event)

    getFreshToken(false)
      .then((token) => {
        if (stopped) return
        if (!token) {
          emit({
            type: 'warning',
            message: handlers.authPendingMessage || 'Waiting for auth before opening stream',
          })
          emit({ type: 'closed' })
          stopped = true
          return
        }

        ws = new WebSocket(url)

        ws.onopen = () => {
          if (stopped) {
            ws.close()
            return
          }
          ws.send(JSON.stringify({ token }))
        }

        ws.onmessage = (event) => {
          try {
            emit(JSON.parse(event.data))
          } catch (err) {
            emit({
              type: 'warning',
              message: handlers.invalidMessage?.(err) || `Invalid stream message: ${err.message}`,
            })
          }
        }

        ws.onclose = () => {
          if (stopped) return
          stopped = true
          emit({ type: 'closed' })
        }

        ws.onerror = () => {
          emit({ type: 'error', message: handlers.errorMessage || 'Minecraft stream socket error' })
        }
      })
      .catch((err) => {
        if (stopped) return
        stopped = true
        emit({ type: 'error', message: err.message || handlers.errorMessage || 'Minecraft stream authentication failed' })
      })

    return () => {
      stopped = true
      if (!ws) return
      if ([WebSocket.CLOSING, WebSocket.CLOSED].includes(ws.readyState)) return
      ws.close()
    }
  }

  const request = async (path, options = {}, fallback) => {
    loading.value = true
    error.value = null
    const method = options.method || 'GET'
    let timeoutId = null
    let controller = null

    try {
      const timeoutMs = Number(options.timeoutMs || 0)
      if (timeoutMs > 0 && typeof AbortController !== 'undefined') {
        controller = new AbortController()
        timeoutId = setTimeout(() => controller.abort(), timeoutMs)
      }

      const response = await fetchWithAuth(withQuery(path, options.query), {
        method,
        headers: options.headers || {},
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: controller?.signal,
      })

      const contentType = response.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await response.json() : await response.text()

      if (!response.ok) {
        const message = typeof data === 'string' ? data : data?.message || data?.error
        const responseError = new Error(message || `Minecraft API returned ${response.status}`)
        responseError.status = response.status
        throw responseError
      }

      usingFallback.value = false
      lastFallbackReason.value = ''
      return data
    } catch (caught) {
      const err = caught?.name === 'AbortError'
        ? new Error(`Minecraft API request timed out after ${Math.round(Number(options.timeoutMs || 0) / 1000)}s`)
        : caught
      error.value = err.message

      const readOnlyMethod = ['GET', 'HEAD'].includes(method)
      const canFallbackForHttp = readOnlyMethod || options.allowHttpFallback === true
      const canFallbackForNetwork = readOnlyMethod || options.allowNetworkFallback === true
      const fallbackStatuses = Array.isArray(options.fallbackStatuses) ? options.fallbackStatuses : [404, 501, 502, 503]
      const statusAllowsFallback = fallbackStatuses.includes(err.status)
      if (typeof fallback === 'function' && (
        (!err.status && canFallbackForNetwork) ||
        (err.status && canFallbackForHttp && statusAllowsFallback)
      )) {
        if (options.markFallback !== false) {
          usingFallback.value = true
          lastFallbackReason.value = err.message
        }
        return fallback(err)
      }

      throw err
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
      loading.value = false
    }
  }

  const getServers = (options = {}) => request(
    '/servers',
    { query: snapshotQuery(options) },
    () => ({ servers: createFallbackServers() }),
  )

  const getServer = (serverId, options = {}) => request(
    `/servers/${serverId}`,
    { query: snapshotQuery(options) },
    () => ({ server: createFallbackDetail(serverId) }),
  )

  const getServerIcon = async (serverId, variant = 'default') => {
    try {
      const response = await fetchWithAuth(withQuery(`/servers/${serverId}/icon`, { variant }), {
        method: 'GET',
      }, { authOnly: true })

      if (response.status === 404) {
        return { available: false, status: response.status }
      }

      if (!response.ok) {
        const responseError = new Error(`Minecraft icon API returned ${response.status}`)
        responseError.status = response.status
        throw responseError
      }

      return {
        available: true,
        variant,
        blob: await response.blob(),
        contentType: response.headers.get('content-type') || 'image/png',
        updatedAt: response.headers.get('last-modified') || '',
        etag: response.headers.get('etag') || '',
      }
    } catch (err) {
      if (!err.status || [404, 501, 502, 503].includes(err.status)) {
        return { available: false, status: err.status || 0, error: err.message }
      }
      throw err
    }
  }

  const getStatus = (serverId, options = {}) => request(
    `/servers/${serverId}/status`,
    { query: snapshotQuery(options) },
    () => ({ status: createFallbackDetail(serverId) }),
  )

  const getProperties = (serverId) => request(
    `/servers/${serverId}/properties`,
    {},
    () => ({ settings: createFallbackDetail(serverId).settings }),
  )

  const getLogs = (serverId, tail = 80) => {
    const query = typeof tail === 'object' ? tail : { tail }
    return request(
    `/servers/${serverId}/logs`,
      { query },
    () => ({ logs: createFallbackDetail(serverId).logs }),
  )
  }

  const getLogFiles = (serverId) => request(
    `/servers/${serverId}/log-files`,
    {},
    () => ({
      files: [
        {
          id: 'latest.log',
          name: 'latest.log',
          path: 'logs/latest.log',
          size: 'Pending',
          updatedAt: new Date().toISOString(),
          compressed: false,
          latest: true,
        },
      ],
    }),
  )

  const downloadLogs = async (serverId, options = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth(withQuery(`/servers/${serverId}/logs/export`, {
        file: options.file || 'latest.log',
        tail: options.tail || options.lines || 200,
        query: options.query || '',
      }), {
        method: 'GET',
      })
      const text = await response.text()

      if (!response.ok) {
        const responseError = new Error(text || `Minecraft API returned ${response.status}`)
        responseError.status = response.status
        throw responseError
      }

      usingFallback.value = false
      lastFallbackReason.value = ''
      return {
        text,
        filename: parseDownloadFilename(response.headers.get('content-disposition')) || fallbackLogExport(serverId, options).filename,
        fallback: false,
      }
    } catch (err) {
      error.value = err.message
      const statusAllowsFallback = !err.status || [404, 501, 502, 503].includes(err.status)
      if (statusAllowsFallback) {
        usingFallback.value = true
        lastFallbackReason.value = err.message
        return fallbackLogExport(serverId, options)
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  const downloadArchive = async (path, fallbackFilename) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth(withQuery(path), {
        method: 'GET',
      }, { authOnly: true })

      if (!response.ok) {
        const message = await response.text()
        const responseError = new Error(message || `Minecraft API returned ${response.status}`)
        responseError.status = response.status
        throw responseError
      }

      usingFallback.value = false
      lastFallbackReason.value = ''
      return {
        blob: await response.blob(),
        filename: parseDownloadFilename(response.headers.get('content-disposition')) || fallbackFilename,
        fallback: false,
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const downloadWorld = (serverId, worldId) => downloadArchive(
    `/servers/${serverId}/worlds/${encodeURIComponent(worldId)}/download`,
    `minecraft-${serverId}-world-${String(worldId || 'world').replace(/[^A-Za-z0-9_.-]/g, '_')}.tar.gz`,
  )

  const downloadBackup = (serverId, backupId) => downloadArchive(
    `/servers/${serverId}/backups/${encodeURIComponent(backupId)}/download`,
    `minecraft-${serverId}-backup-${String(backupId || 'backup').replace(/[^A-Za-z0-9_.-]/g, '_')}.tar.gz`,
  )

  const getActivity = (serverId, limit = 80) => request(
    `/servers/${serverId}/activity`,
    { query: { limit } },
    () => ({
      activity: createFallbackDetail(serverId).activity || [],
      restartRequired: false,
      restartReasons: [],
    }),
  )

  const getDiagnostics = (serverId) => request(
    `/servers/${serverId}/diagnostics`,
    {},
    () => ({ diagnostics: fallbackDiagnostics(serverId) }),
  )

  const getMaintenance = (serverId) => request(
    `/servers/${serverId}/maintenance`,
    {},
    () => ({ maintenance: createFallbackDetail(serverId).maintenance || {} }),
  )

  const getMods = (serverId) => request(
    `/servers/${serverId}/mods`,
    {},
    () => ({ mods: createFallbackDetail(serverId).mods }),
  )

  const getModBackups = (serverId) => request(
    `/servers/${serverId}/mods/backups`,
    {},
    () => ({ backups: createFallbackDetail(serverId).modBackups || [] }),
  )

  const getPlayers = (serverId, options = {}) => request(
    `/servers/${serverId}/players`,
    { query: snapshotQuery(options) },
    () => {
      const detail = createFallbackDetail(serverId)
      return {
        players: detail.players,
        whitelist: detail.whitelist,
        ops: detail.ops,
        bannedPlayers: detail.bannedPlayers,
        bannedIps: detail.bannedIps,
      }
    },
  )

  const getWhitelist = (serverId) => request(
    `/servers/${serverId}/whitelist`,
    {},
    () => {
      const detail = createFallbackDetail(serverId)
      return {
        whitelist: detail.whitelist,
        players: detail.players.filter((player) => player.whitelisted),
      }
    },
  )

  const getOps = (serverId) => request(
    `/servers/${serverId}/ops`,
    {},
    () => {
      const detail = createFallbackDetail(serverId)
      return {
        ops: detail.ops,
        players: detail.players.filter((player) => player.op),
      }
    },
  )

  const getBans = (serverId) => request(
    `/servers/${serverId}/bans`,
    {},
    () => {
      const detail = createFallbackDetail(serverId)
      return {
        bannedPlayers: detail.bannedPlayers,
        bannedIps: detail.bannedIps,
        players: detail.players.filter((player) => player.banned),
      }
    },
  )

  const getWorlds = (serverId) => request(
    `/servers/${serverId}/worlds`,
    {},
    () => ({ worlds: createFallbackDetail(serverId).worlds }),
  )

  const getBackups = (serverId) => request(
    `/servers/${serverId}/backups`,
    {},
    () => ({ backups: createFallbackDetail(serverId).backups }),
  )

  const lifecycleAction = (serverId, action, confirmed = false) => {
    const waitsForWake = ['wake', 'start', 'restart'].includes(action)
    return request(
      `/servers/${serverId}/${action}`,
      {
        method: 'POST',
        body: {
          ...(confirmed ? { confirmed: true } : {}),
          ...(waitsForWake ? { waitMs: 15000 } : {}),
        },
        allowHttpFallback: waitsForWake,
        allowNetworkFallback: waitsForWake,
        fallbackStatuses: waitsForWake ? [404, 501, 502, 503, 504] : undefined,
        markFallback: !waitsForWake,
        timeoutMs: waitsForWake ? 25000 : 0,
      },
      () => fallbackLifecycle(serverId, action),
    )
  }

  const sendCommand = (serverId, command, confirmed = false) => request(
    `/servers/${serverId}/command`,
    { method: 'POST', body: { command, confirmed } },
    () => fallbackCommandResult(serverId, command),
  )

  const getCommands = (serverId) => request(
    `/servers/${serverId}/commands`,
    {},
    () => ({ commands: createFallbackDetail(serverId).allowedCommands || [] }),
  )

  const runPlayerAction = (serverId, playerName, action, payload = {}, confirmed = false) => {
    const endpointAction = destructivePlayerActions.has(action) ? action : encodeURIComponent(action)
    return request(
      `/servers/${serverId}/players/${encodeURIComponent(playerName)}/${endpointAction}`,
      { method: 'POST', body: { ...payload, confirmed } },
      () => ({ ok: true, playerName, action, timestamp: new Date().toISOString() }),
    )
  }

  const updateOpSettings = (serverId, playerName, settings, confirmed = false) => request(
    `/servers/${serverId}/players/${encodeURIComponent(playerName)}/op-settings`,
    { method: 'PATCH', body: { ...settings, confirmed } },
    () => ({
      ok: true,
      playerName,
      player: {
        name: playerName,
        level: settings.level,
        bypassesPlayerLimit: settings.bypassesPlayerLimit === true,
      },
      restartRequired: true,
    }),
  )

  const updateWhitelist = (serverId, playerName, action, confirmed = false) => request(
    `/servers/${serverId}/whitelist/${action}`,
    { method: 'POST', body: { playerName, confirmed } },
    () => ({ ok: true, playerName, action, timestamp: new Date().toISOString() }),
  )

  const updatePlayerBlacklist = (serverId, playerName, action, reason = '', confirmed = false) => request(
    `/servers/${serverId}/blacklist/player/${action}`,
    { method: 'POST', body: { playerName, reason, confirmed } },
    () => ({ ok: true, playerName, action, timestamp: new Date().toISOString() }),
  )

  const updateIpBlacklist = (serverId, target, action, reason = '', confirmed = false) => request(
    `/servers/${serverId}/blacklist/ip/${action}`,
    { method: 'POST', body: { target, reason, confirmed } },
    () => ({ ok: true, target, action, timestamp: new Date().toISOString() }),
  )

  const updateProperties = (serverId, settings, confirmed = false) => request(
    `/servers/${serverId}/properties`,
    { method: 'PATCH', body: { settings, confirmed } },
    () => ({
      ok: true,
      settings: {
        ...createFallbackDetail(serverId).settings,
        ...settings,
      },
      changed: settings,
      restartRequired: true,
    }),
  )

  const setModEnabled = (serverId, file, enabled, confirmed = false) => request(
    `/servers/${serverId}/mods/${encodeURIComponent(file)}/${enabled ? 'enable' : 'disable'}`,
    { method: 'POST', body: confirmed ? { confirmed: true } : undefined },
    () => ({ ok: true, file, enabled, restartRequired: true }),
  )

  const checkModUpdates = (serverId) => request(
    `/servers/${serverId}/mods/check-updates`,
    { method: 'POST', allowHttpFallback: true, allowNetworkFallback: true },
    () => ({ mods: createFallbackDetail(serverId).mods }),
  )

  const searchMods = (serverId, query, limit = 8) => request(
    `/servers/${serverId}/mods/search`,
    { query: { query, limit } },
    () => ({ results: [] }),
  )

  const installMod = (serverId, project, confirmed = false) => request(
    `/servers/${serverId}/mods/install`,
    {
      method: 'POST',
      body: {
        projectId: project.projectId || project.slug,
        versionId: project.versionId,
        confirmed,
      },
    },
    () => ({
      ok: true,
      mod: {
        id: project.slug || project.projectId,
        name: project.title || project.slug || project.projectId,
        file: `${project.slug || project.projectId}.jar`,
        enabled: true,
        version: project.latestVersion || 'pending',
        latestVersion: project.latestVersion || 'pending',
        updateAvailable: false,
        required: false,
      },
      restartRequired: true,
    }),
  )

  const uploadMod = async (serverId, file, confirmed = false) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchWithAuth(withQuery(`/servers/${serverId}/mods/upload`, {
        filename: file.name,
        confirmed: confirmed ? 'true' : '',
      }), {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/java-archive',
          'X-Minecraft-Filename': encodeURIComponent(file.name),
          'X-Minecraft-Confirmed': confirmed ? 'true' : 'false',
        },
        body: file,
      }, { authOnly: true })

      const contentType = response.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await response.json() : await response.text()

      if (!response.ok) {
        const message = typeof data === 'string' ? data : data?.message || data?.error
        const responseError = new Error(message || `Minecraft API returned ${response.status}`)
        responseError.status = response.status
        throw responseError
      }

      usingFallback.value = false
      lastFallbackReason.value = ''
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMod = (serverId, file, confirmed = false) => request(
    `/servers/${serverId}/mods/${encodeURIComponent(file)}/update`,
    { method: 'POST', body: { confirmed } },
    () => ({ ok: true, file, restartRequired: true }),
  )

  const updateAllMods = (serverId, confirmed = false) => request(
    `/servers/${serverId}/mods/update-all`,
    { method: 'POST', body: { confirmed } },
    () => ({
      ok: true,
      updated: [],
      failed: [],
      skipped: [],
      results: [],
      restartRequired: false,
    }),
  )

  const restoreModBackup = (serverId, backupFile, confirmed = false) => request(
    `/servers/${serverId}/mods/backups/${encodeURIComponent(backupFile)}/restore`,
    { method: 'POST', body: { confirmed } },
    () => ({ ok: true, file: backupFile.replace(/\.bak\.\d+$/, ''), restoredFrom: backupFile, restartRequired: true }),
  )

  const deleteModBackup = (serverId, backupFile, confirmed = false) => request(
    `/servers/${serverId}/mods/backups/${encodeURIComponent(backupFile)}`,
    { method: 'DELETE', body: { confirmed } },
    () => ({ ok: true, file: backupFile }),
  )

  const switchWorld = (serverId, worldId, confirmed = false) => request(
    `/servers/${serverId}/worlds/switch`,
    { method: 'POST', body: { worldId, confirmed } },
    () => ({ ok: true, worldId, restartRequired: true }),
  )

  const createWorld = (serverId, payload, confirmed = false) => request(
    `/servers/${serverId}/worlds/new`,
    { method: 'POST', body: { ...payload, confirmed } },
    () => ({ ok: true, world: payload, restartRequired: true }),
  )

  const deleteWorld = (serverId, worldId, confirmed = false) => request(
    `/servers/${serverId}/worlds/${encodeURIComponent(worldId)}`,
    { method: 'DELETE', body: { confirmed } },
    () => ({ ok: true, worldId }),
  )

  const backupWorld = (serverId) => request(
    `/servers/${serverId}/worlds/backup`,
    { method: 'POST' },
    () => ({ ok: true, timestamp: new Date().toISOString() }),
  )

  const restoreBackup = (serverId, backupId, confirmed = false) => request(
    `/servers/${serverId}/backups/${encodeURIComponent(backupId)}/restore`,
    { method: 'POST', body: { confirmed } },
    () => ({ ok: true, backupId, restartRequired: true }),
  )

  const deleteBackup = (serverId, backupId, confirmed = false) => request(
    `/servers/${serverId}/backups/${encodeURIComponent(backupId)}`,
    { method: 'DELETE', body: { confirmed } },
    () => ({ ok: true, backupId }),
  )

  const streamLogs = (serverId, onLog) => {
    const wsRoot = API_ROOT.replace(/^http/, 'ws')
    return openAuthenticatedSocket(`${wsRoot}/servers/${serverId}/logs/stream`, {
      onEvent: (event) => onLog({ serverId, ...event }),
      invalidMessage: (err) => `Invalid log stream message: ${err.message}`,
      errorMessage: 'Log stream socket error',
      authPendingMessage: 'Waiting for auth before opening log stream',
    })
  }

  const streamStatus = (serverId, onStatus, options = {}) => {
    return openAuthenticatedSocket(withQuery(`/servers/${serverId}/status/stream`, {
      interval: options.interval || options.intervalMs || 5000,
      includePlayers: booleanQuery(options.includePlayers ?? false),
    }).replace(/^http/, 'ws'), {
      onEvent: (event) => onStatus({ serverId, ...event }),
      invalidMessage: (err) => `Invalid status stream message: ${err.message}`,
      errorMessage: 'Status stream socket error',
      authPendingMessage: 'Waiting for auth before opening status stream',
    })
  }

  return {
    loading,
    error,
    usingFallback,
    lastFallbackReason,
    endpoint,
    getServers,
    getServer,
    getServerIcon,
    getStatus,
    getProperties,
    getLogs,
    downloadLogs,
    downloadWorld,
    downloadBackup,
    getLogFiles,
    getActivity,
    getDiagnostics,
    getMaintenance,
    getMods,
    getModBackups,
    getPlayers,
    getWhitelist,
    getOps,
    getBans,
    getWorlds,
    getBackups,
    lifecycleAction,
    sendCommand,
    getCommands,
    runPlayerAction,
    updateOpSettings,
    updateWhitelist,
    updatePlayerBlacklist,
    updateIpBlacklist,
    updateProperties,
    setModEnabled,
    checkModUpdates,
    searchMods,
    installMod,
    uploadMod,
    updateMod,
    updateAllMods,
    restoreModBackup,
    deleteModBackup,
    switchWorld,
    createWorld,
    deleteWorld,
    backupWorld,
    restoreBackup,
    deleteBackup,
    streamLogs,
    streamStatus,
  }
}
