import { ref, computed } from 'vue'
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

function withQuery(path, params = {}) {
  const url = new URL(`${API_ROOT}${path}`, window.location.origin)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })
  return url.toString()
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

  const authHeaders = () => {
    const headers = { 'Content-Type': 'application/json' }
    if (mainStore.token) {
      headers.Authorization = `Bearer ${mainStore.token}`
    }
    return headers
  }

  const authOnlyHeaders = () => {
    const headers = {}
    if (mainStore.token) {
      headers.Authorization = `Bearer ${mainStore.token}`
    }
    return headers
  }

  const request = async (path, options = {}, fallback) => {
    loading.value = true
    error.value = null
    const method = options.method || 'GET'

    try {
      const response = await fetch(withQuery(path, options.query), {
        method,
        headers: {
          ...authHeaders(),
          ...(options.headers || {}),
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
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
    } catch (err) {
      error.value = err.message

      const readOnlyMethod = ['GET', 'HEAD'].includes(method)
      const canFallbackForHttp = readOnlyMethod || options.allowHttpFallback === true
      const canFallbackForNetwork = readOnlyMethod || options.allowNetworkFallback === true
      const statusAllowsFallback = [404, 501, 502, 503].includes(err.status)
      if (typeof fallback === 'function' && (
        (!err.status && canFallbackForNetwork) ||
        (err.status && canFallbackForHttp && statusAllowsFallback)
      )) {
        usingFallback.value = true
        lastFallbackReason.value = err.message
        return fallback(err)
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  const getServers = () => request('/servers', {}, () => ({ servers: createFallbackServers() }))

  const getServer = (serverId) => request(`/servers/${serverId}`, {}, () => ({ server: createFallbackDetail(serverId) }))

  const getServerIcon = async (serverId, variant = 'default') => {
    try {
      const response = await fetch(withQuery(`/servers/${serverId}/icon`, { variant }), {
        method: 'GET',
        headers: authOnlyHeaders(),
      })

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

  const getStatus = (serverId) => request(
    `/servers/${serverId}/status`,
    {},
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
      const response = await fetch(withQuery(`/servers/${serverId}/logs/export`, {
        file: options.file || 'latest.log',
        tail: options.tail || options.lines || 200,
        query: options.query || '',
      }), {
        method: 'GET',
        headers: authHeaders(),
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
      const response = await fetch(withQuery(path), {
        method: 'GET',
        headers: authOnlyHeaders(),
      })

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

  const getPlayers = (serverId) => request(
    `/servers/${serverId}/players`,
    {},
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

  const lifecycleAction = (serverId, action, confirmed = false) => request(
    `/servers/${serverId}/${action}`,
    { method: 'POST', body: confirmed ? { confirmed: true } : undefined },
    () => fallbackLifecycle(serverId, action),
  )

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
      const response = await fetch(withQuery(`/servers/${serverId}/mods/upload`, {
        filename: file.name,
        confirmed: confirmed ? 'true' : '',
      }), {
        method: 'POST',
        headers: {
          ...authOnlyHeaders(),
          'Content-Type': file.type || 'application/java-archive',
          'X-Minecraft-Filename': encodeURIComponent(file.name),
          'X-Minecraft-Confirmed': confirmed ? 'true' : 'false',
        },
        body: file,
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
    const ws = new WebSocket(`${wsRoot}/servers/${serverId}/logs/stream`)
    let closed = false

    ws.onopen = () => {
      ws.send(JSON.stringify({ token: mainStore.token }))
    }

    ws.onmessage = (event) => {
      try {
        onLog(JSON.parse(event.data))
      } catch (err) {
        onLog({ type: 'warning', serverId, message: `Invalid log stream message: ${err.message}` })
      }
    }

    ws.onclose = () => {
      if (closed) return
      closed = true
      onLog({ type: 'closed', serverId })
    }

    ws.onerror = () => {
      onLog({ type: 'error', serverId, message: 'Log stream socket error' })
    }

    return () => {
      closed = true
      ws.close()
    }
  }

  const streamStatus = (serverId, onStatus, options = {}) => {
    const ws = new WebSocket(withQuery(`/servers/${serverId}/status/stream`, {
      interval: options.interval || options.intervalMs || 5000,
    }).replace(/^http/, 'ws'))
    let closed = false

    ws.onopen = () => {
      ws.send(JSON.stringify({ token: mainStore.token }))
    }

    ws.onmessage = (event) => {
      try {
        onStatus(JSON.parse(event.data))
      } catch (err) {
        onStatus({ type: 'warning', serverId, message: `Invalid status stream message: ${err.message}` })
      }
    }

    ws.onclose = () => {
      if (closed) return
      closed = true
      onStatus({ type: 'closed', serverId })
    }

    ws.onerror = () => {
      onStatus({ type: 'error', serverId, message: 'Status stream socket error' })
    }

    return () => {
      closed = true
      ws.close()
    }
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
