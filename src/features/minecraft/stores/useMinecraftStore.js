import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useMinecraftAPI } from '@/features/minecraft/composables/useMinecraftAPI'
import {
  createFallbackDetail,
  createFallbackServers,
  getRegistryServer,
} from '@/features/minecraft/data/personalServers'

const STATUS_STREAM_MAX_RETRIES = 6
const STATUS_STREAM_RETRY_BASE_MS = 1500
const STATUS_STREAM_RETRY_MAX_MS = 30000

function unwrap(payload, key) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.[key])) return payload[key]
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

function asDetail(payload, serverId) {
  if (!payload) return createFallbackDetail(serverId)
  if (payload.server) return payload.server
  if (payload.detail) return payload.detail
  return payload
}

function settledErrorMessage(error) {
  return error?.message || String(error || 'request failed')
}

function settledValue(result, fallback, label, failures) {
  if (result.status === 'fulfilled') return result.value
  failures.push(`${label}: ${settledErrorMessage(result.reason)}`)
  return fallback
}

function logLine(entry) {
  if (typeof entry === 'string') return entry
  const timestamp = entry.timestamp || entry.time || new Date().toISOString()
  const level = entry.level || 'INFO'
  const message = entry.message || entry.output || JSON.stringify(entry)
  return `[${timestamp}] [${level}]: ${message}`
}

function modIdentityKeys(mod) {
  return [
    mod?.file,
    mod?.previousFile,
    mod?.id,
    mod?.modId,
    mod?.fabricId,
    mod?.fabricModId,
    mod?.modrinthProjectId,
    mod?.projectId,
    mod?.name,
  ]
    .map((value) => String(value || '').trim().toLowerCase())
    .filter(Boolean)
}

function hasModrinthUpdateMetadata(mod) {
  const version = String(mod?.version || '')
  const latestVersion = String(mod?.latestVersion || '')
  return Boolean(
    mod?.updateCheckedAt ||
    mod?.updateAvailable === true ||
    (latestVersion && latestVersion !== version) ||
    mod?.latestFile ||
    mod?.latestFileName ||
    mod?.latestVersionId,
  )
}

function mergeModUpdateMetadata(incomingMods = [], previousMods = []) {
  if (!incomingMods.length || !previousMods.length) return incomingMods

  const previousByKey = new Map()
  previousMods.forEach((mod) => {
    if (!hasModrinthUpdateMetadata(mod)) return
    modIdentityKeys(mod).forEach((key) => previousByKey.set(key, mod))
  })
  if (!previousByKey.size) return incomingMods

  return incomingMods.map((mod) => {
    if (hasModrinthUpdateMetadata(mod)) return mod
    const previous = modIdentityKeys(mod).map((key) => previousByKey.get(key)).find(Boolean)
    if (!previous) return mod

    return {
      ...mod,
      updateAvailable: previous.updateAvailable === true,
      updateCheckedAt: previous.updateCheckedAt,
      latestVersion: previous.latestVersion,
      latestFile: previous.latestFile,
      latestFileName: previous.latestFileName,
      latestVersionId: previous.latestVersionId,
      modrinthSlug: mod.modrinthSlug || previous.modrinthSlug,
      modrinthProjectId: mod.modrinthProjectId || previous.modrinthProjectId,
      projectId: mod.projectId || previous.projectId,
      dependencies: Array.isArray(mod.dependencies) && mod.dependencies.length ? mod.dependencies : previous.dependencies,
      dependencyCount: mod.dependencyCount ?? previous.dependencyCount,
      requiredDependencyCount: mod.requiredDependencyCount ?? previous.requiredDependencyCount,
      optionalDependencyCount: mod.optionalDependencyCount ?? previous.optionalDependencyCount,
    }
  })
}

function withDerivedModCounts(detail) {
  const mods = Array.isArray(detail?.mods) ? detail.mods : []
  if (!mods.length) return detail

  return {
    ...detail,
    modCount: mods.filter((mod) => mod.enabled).length,
    disabledModCount: mods.filter((mod) => !mod.enabled).length,
    updateCount: mods.filter((mod) => mod.updateAvailable).length,
  }
}

function entryName(entry) {
  return entry?.name || entry?.playerName || entry?.target || ''
}

function entryIp(entry) {
  return entry?.ip || entry?.target || ''
}

function isSleepManagedServer(server) {
  return String(server?.service || '').includes('-sleep.service') || server?.sleepManaged === true
}

function normalizeLifecycleState(server, fallback = 'hibernating') {
  const state = server?.state || server?.lifecycleState || server?.status || fallback
  if (state === 'offline' && isSleepManagedServer(server)) return 'hibernating'
  return state
}

function normalizeServer(raw) {
  const registry = getRegistryServer(raw?.id) || {}
  const merged = {
    ...registry,
    ...raw,
  }

  const vitals = merged.vitals || {}
  const state = normalizeLifecycleState(merged)
  const playersOnline = merged.playersOnline ?? merged.playerCount ?? vitals.playersOnline ?? 0
  const maxPlayers = merged.maxPlayers ?? vitals.maxPlayers ?? registry.maxPlayers ?? 20

  return {
    ...merged,
    state,
    playersOnline,
    maxPlayers,
    cpu: merged.cpu ?? vitals.cpu ?? 0,
    memory: merged.memory ?? vitals.memory ?? 0,
    disk: merged.disk ?? vitals.disk ?? 0,
    uptimeSeconds: merged.uptimeSeconds ?? vitals.uptime ?? 0,
    host: merged.host || registry.host,
    label: merged.label || merged.name || registry.label,
    lastBackupAt: merged.lastBackupAt || merged.backup?.lastSuccessAt || merged.backups?.[0]?.createdAt || null,
    lastBackupStatus: merged.lastBackupStatus || merged.backup?.status || 'unknown',
    activity: Array.isArray(merged.activity) ? merged.activity : [],
    lastActivityAt: merged.lastActivityAt || merged.activity?.[0]?.timestamp || null,
    restartRequired: merged.restartRequired === true,
    restartReasons: Array.isArray(merged.restartReasons) ? merged.restartReasons : [],
  }
}

function normalizeDetail(serverId, raw) {
  const fallback = createFallbackDetail(serverId)
  const merged = {
    ...fallback,
    ...raw,
  }

  const normalized = normalizeServer(merged)
  const players = unwrap(merged.players, 'players').length ? unwrap(merged.players, 'players') : merged.players || fallback.players

  return {
    ...merged,
    ...normalized,
    mods: merged.mods || fallback.mods,
    modBackups: merged.modBackups || fallback.modBackups || [],
    worlds: merged.worlds || fallback.worlds,
    players,
    whitelist: merged.whitelist || fallback.whitelist,
    ops: merged.ops || fallback.ops,
    bannedPlayers: merged.bannedPlayers || fallback.bannedPlayers,
    bannedIps: merged.bannedIps || fallback.bannedIps,
    backups: merged.backups || fallback.backups,
    logFiles: merged.logFiles || fallback.logFiles || [{
      id: 'latest.log',
      name: 'latest.log',
      path: 'logs/latest.log',
      size: 'Pending',
      updatedAt: new Date().toISOString(),
      compressed: false,
      latest: true,
    }],
    exploredLogs: (merged.exploredLogs || merged.logs || fallback.logs).map(logLine),
    exploredLogFile: merged.exploredLogFile || 'latest.log',
    exploredLogQuery: merged.exploredLogQuery || '',
    exploredLogTail: merged.exploredLogTail || 200,
    settings: {
      ...(fallback.settings || {}),
      ...(merged.settings || {}),
    },
    logs: (merged.logs || fallback.logs).map(logLine),
    activity: Array.isArray(merged.activity) ? merged.activity : [],
    lastActivityAt: merged.lastActivityAt || merged.activity?.[0]?.timestamp || null,
    restartRequired: merged.restartRequired === true,
    restartReasons: Array.isArray(merged.restartReasons) ? merged.restartReasons : [],
    diagnostics: merged.diagnostics || fallback.diagnostics || null,
    commandHistory: merged.commandHistory || fallback.commandHistory,
    allowedCommands: merged.allowedCommands || fallback.allowedCommands,
  }
}

const ACTIVITY_STORAGE_KEY = 'mxn:minecraft:activity:v1'
const MAX_ACTIVITY_PER_SERVER = 120

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function loadStoredActivity() {
  if (!canUseStorage()) return {}
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ACTIVITY_STORAGE_KEY) || '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function persistActivity(activity) {
  if (!canUseStorage()) return
  try {
    window.localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activity))
  } catch {
    // Local persistence is helpful, but the live API remains authoritative.
  }
}

function activityTimestamp(value) {
  const date = new Date(value || Date.now())
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

function normalizeActivityEntry(entry = {}, fallback = {}) {
  const timestamp = activityTimestamp(entry.timestamp || fallback.timestamp)
  const serverId = String(entry.serverId || fallback.serverId || '')
  const id = String(entry.id || fallback.id || `${serverId}-${Date.parse(timestamp) || Date.now()}-${Math.random().toString(36).slice(2)}`)

  return {
    id,
    serverId,
    timestamp,
    type: entry.type || fallback.type || 'panel',
    label: entry.label || fallback.label || 'server action',
    summary: entry.summary || fallback.summary || entry.message || fallback.message || 'Server action recorded',
    target: entry.target || fallback.target || '',
    actor: entry.actor || fallback.actor || 'panel',
    status: entry.status || fallback.status || 'success',
    durationMs: Number(entry.durationMs || fallback.durationMs || 0),
    restartRequired: entry.restartRequired === true || fallback.restartRequired === true,
    clearsRestart: entry.clearsRestart === true || fallback.clearsRestart === true,
  }
}

export const useMinecraftStore = defineStore('minecraft', () => {
  const api = useMinecraftAPI()

  const servers = ref(createFallbackServers())
  const serverDetails = ref({})
  const selectedServerId = ref('hc')
  const loading = ref(false)
  const error = ref(null)
  const refreshingIds = ref(new Set())
  const pollHandle = ref(null)
  const streamingIds = ref(new Set())
  const statusStreamingIds = ref(new Set())
  const statusStreamRetryingIds = ref(new Set())
  const modSearchResults = ref({})
  const modSearchLoading = ref(false)
  const modUpdateSummaries = ref({})
  const operationTrail = ref(loadStoredActivity())
  const diagnosticsByServer = ref({})
  const iconUrls = ref({})
  const iconCacheKeys = ref({})
  const iconLoadingIds = ref(new Set())
  const logStreamStops = new Map()
  const logStreamTokens = new Map()
  const statusStreamStops = new Map()
  const statusStreamTokens = new Map()
  const statusStreamRetryTimers = new Map()
  const statusStreamRetryCounts = new Map()

  const fallbackMode = computed(() => api.usingFallback.value)
  const fallbackReason = computed(() => api.lastFallbackReason.value)
  const apiEndpoint = computed(() => api.endpoint.value)

  const selectedServer = computed(() => {
    return servers.value.find((server) => server.id === selectedServerId.value) || servers.value[0] || null
  })

  const selectedDetail = computed(() => {
    if (!selectedServer.value) return null
    return serverDetails.value[selectedServer.value.id] || createFallbackDetail(selectedServer.value.id)
  })

  function activityForServer(serverId) {
    return (operationTrail.value[serverId] || [])
      .slice()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  function restartReasonsForServer(serverId) {
    const reasons = []
    for (const entry of activityForServer(serverId)) {
      if (entry.clearsRestart) break
      if (entry.restartRequired) reasons.push(entry)
    }
    return reasons
  }

  function operationalState(serverId) {
    const activity = activityForServer(serverId)
    const restartReasons = restartReasonsForServer(serverId)
    return {
      activity,
      lastActivityAt: activity[0]?.timestamp || null,
      restartRequired: restartReasons.length > 0,
      restartReasons,
    }
  }

  const activityFeed = computed(() => {
    return Object.values(operationTrail.value)
      .flat()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 120)
  })

  const totals = computed(() => {
    const activeStates = new Set(['alive', 'warming', 'stopping'])
    return servers.value.reduce((summary, server) => {
      summary.players += Number(server.playersOnline || 0)
      summary.capacity += Number(server.maxPlayers || 0)
      summary.active += activeStates.has(server.state) ? 1 : 0
      summary.sleeping += server.state === 'hibernating' ? 1 : 0
      summary.degraded += server.state === 'degraded' ? 1 : 0
      summary.updates += Number(server.updateCount || 0)
      summary.restartRequired += restartReasonsForServer(server.id).length ? 1 : 0
      return summary
    }, {
      players: 0,
      capacity: 0,
      active: 0,
      sleeping: 0,
      degraded: 0,
      updates: 0,
      restartRequired: 0,
    })
  })

  function syncOperationalState(serverId) {
    const state = operationalState(serverId)
    const currentDetail = serverDetails.value[serverId]
    if (currentDetail) {
      serverDetails.value = {
        ...serverDetails.value,
        [serverId]: {
          ...currentDetail,
          ...state,
        },
      }
    }

    const index = servers.value.findIndex((server) => server.id === serverId)
    if (index !== -1) {
      servers.value[index] = {
        ...servers.value[index],
        ...state,
      }
    }
  }

  function mergeActivityEntries(serverId, entries = []) {
    const incoming = entries
      .filter(Boolean)
      .map((entry) => normalizeActivityEntry(entry, { serverId }))
    if (!incoming.length) return []

    const byId = new Map()
    for (const entry of [...incoming, ...activityForServer(serverId)]) {
      byId.set(entry.id, entry)
    }

    const merged = Array.from(byId.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, MAX_ACTIVITY_PER_SERVER)

    operationTrail.value = {
      ...operationTrail.value,
      [serverId]: merged,
    }
    persistActivity(operationTrail.value)
    syncOperationalState(serverId)
    return merged
  }

  function recordActivity(serverId, entry = {}) {
    return mergeActivityEntries(serverId, [entry])[0] || null
  }

  function clearActivity(serverId = '') {
    const targetId = String(serverId || '')
    if (targetId) {
      const removed = operationTrail.value[targetId]?.length || 0
      if (!removed) return 0
      const nextTrail = { ...operationTrail.value }
      delete nextTrail[targetId]
      operationTrail.value = nextTrail
      persistActivity(operationTrail.value)
      syncOperationalState(targetId)
      return removed
    }

    const removed = Object.values(operationTrail.value).reduce((total, entries) => total + (entries?.length || 0), 0)
    if (!removed) return 0
    operationTrail.value = {}
    persistActivity(operationTrail.value)
    const knownIds = new Set([
      ...servers.value.map((server) => server.id),
      ...Object.keys(serverDetails.value),
    ])
    knownIds.forEach((id) => syncOperationalState(id))
    return removed
  }

  function recordResultActivity(serverId, result, fallback = {}) {
    return recordActivity(serverId, result?.activityEntry || {
      ...fallback,
      serverId,
      timestamp: new Date().toISOString(),
      status: fallback.status || (result?.ok === false ? 'warning' : 'success'),
      restartRequired: result?.restartRequired === true || fallback.restartRequired === true,
    })
  }

  function preferredIconVariant(server) {
    return ['hibernating', 'offline'].includes(server?.state) ? 'frozen' : 'default'
  }

  function iconKey(serverId, variant = 'default') {
    return `${serverId}:${variant || 'default'}`
  }

  function getIconServer(serverOrId) {
    if (serverOrId && typeof serverOrId === 'object') return serverOrId
    const serverId = String(serverOrId || '')
    return serverDetails.value[serverId] || servers.value.find((server) => server.id === serverId) || getRegistryServer(serverId)
  }

  function serverIconCacheKey(server, variant) {
    const variantInfo = server?.icon?.variants?.[variant]
    return variantInfo?.cacheKey || variantInfo?.updatedAt || server?.icon?.updatedAt || `${server?.id || ''}:${variant}`
  }

  function setIconUrl(serverId, variant, url, cacheKey) {
    const key = iconKey(serverId, variant)
    const previous = iconUrls.value[key]
    if (previous && previous !== url && previous.startsWith('blob:') && typeof URL !== 'undefined') {
      URL.revokeObjectURL(previous)
    }

    iconUrls.value = {
      ...iconUrls.value,
      [key]: url,
    }
    iconCacheKeys.value = {
      ...iconCacheKeys.value,
      [key]: cacheKey,
    }
  }

  function serverIconUrl(serverOrId, variant) {
    const server = getIconServer(serverOrId)
    const serverId = server?.id || String(serverOrId || '')
    if (!serverId) return ''
    const preferred = variant || preferredIconVariant(server)
    return iconUrls.value[iconKey(serverId, preferred)] || iconUrls.value[iconKey(serverId, 'default')] || ''
  }

  async function fetchServerIcon(serverOrId, variant) {
    const server = getIconServer(serverOrId)
    const serverId = server?.id || String(serverOrId || '')
    if (!serverId || server?.icon?.available === false) return null

    const preferred = variant || preferredIconVariant(server)
    const key = iconKey(serverId, preferred)
    const cacheKey = serverIconCacheKey(server, preferred)
    if (iconUrls.value[key] && iconCacheKeys.value[key] === cacheKey) {
      return { available: true, cached: true }
    }

    iconLoadingIds.value = new Set([...iconLoadingIds.value, key])
    try {
      const result = await api.getServerIcon(serverId, preferred)
      if (result?.available && result.blob && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
        setIconUrl(serverId, preferred, URL.createObjectURL(result.blob), cacheKey)
      }
      return result
    } finally {
      const next = new Set(iconLoadingIds.value)
      next.delete(key)
      iconLoadingIds.value = next
    }
  }

  function queueServerIconFetch(server) {
    if (!server?.id || server.icon?.available === false) return
    fetchServerIcon(server).catch((err) => {
      error.value = err.message
    })
  }

  function setSelectedServer(serverId) {
    if (serverId) selectedServerId.value = serverId
  }

  function mergeServer(server) {
    if (Array.isArray(server?.activity)) mergeActivityEntries(server.id, server.activity)
    const normalized = normalizeServer({
      ...server,
      ...operationalState(server.id),
    })
    const index = servers.value.findIndex((item) => item.id === normalized.id)
    if (index === -1) {
      servers.value.push(normalized)
    } else {
      servers.value[index] = { ...servers.value[index], ...normalized }
    }
    queueServerIconFetch(normalized)
  }

  function mergeDetail(serverId, detail) {
    if (Array.isArray(detail?.activity)) mergeActivityEntries(serverId, detail.activity)
    const normalized = withDerivedModCounts(normalizeDetail(serverId, {
      ...detail,
      ...operationalState(serverId),
    }))
    serverDetails.value = {
      ...serverDetails.value,
      [serverId]: normalized,
    }
    mergeServer(normalized)
  }

  async function fetchServers() {
    loading.value = true
    error.value = null

    try {
      const payload = await api.getServers()
      const list = unwrap(payload, 'servers').map((server) => {
        if (Array.isArray(server.activity)) mergeActivityEntries(server.id, server.activity)
        return normalizeServer({
          ...server,
          ...operationalState(server.id),
        })
      })
      servers.value = list.length
        ? list
        : createFallbackServers().map((server) => normalizeServer({
            ...server,
            ...operationalState(server.id),
          }))
      servers.value.forEach((server) => {
        if (!serverDetails.value[server.id]) {
          mergeDetail(server.id, createFallbackDetail(server.id))
        }
      })
      if (!servers.value.some((server) => server.id === selectedServerId.value)) {
        selectedServerId.value = servers.value[0]?.id || 'hc'
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchServer(serverId) {
    if (!serverId) return
    refreshingIds.value = new Set([...refreshingIds.value, serverId])
    error.value = null

    try {
      const previous = serverDetails.value[serverId] || createFallbackDetail(serverId)
      const [
        serverResult,
        statusResult,
        propertiesResult,
        logsResult,
        logFilesResult,
        activityResult,
        diagnosticsResult,
        maintenanceResult,
        commandsResult,
        modsResult,
        modBackupsResult,
        playersResult,
        worldsResult,
        backupsResult,
      ] = await Promise.allSettled([
        api.getServer(serverId),
        api.getStatus(serverId),
        api.getProperties(serverId),
        api.getLogs(serverId, 80),
        api.getLogFiles(serverId),
        api.getActivity(serverId),
        api.getDiagnostics(serverId),
        api.getMaintenance(serverId),
        api.getCommands(serverId),
        api.getMods(serverId),
        api.getModBackups(serverId),
        api.getPlayers(serverId),
        api.getWorlds(serverId),
        api.getBackups(serverId),
      ])
      const results = [
        serverResult,
        statusResult,
        propertiesResult,
        logsResult,
        logFilesResult,
        activityResult,
        diagnosticsResult,
        maintenanceResult,
        commandsResult,
        modsResult,
        modBackupsResult,
        playersResult,
        worldsResult,
        backupsResult,
      ]
      const failures = []
      const serverPayload = settledValue(serverResult, { server: previous }, 'server', failures)
      const statusPayload = settledValue(statusResult, previous, 'status', failures)
      const propertiesPayload = settledValue(propertiesResult, { settings: previous.settings }, 'properties', failures)
      const logsPayload = settledValue(logsResult, { logs: previous.logs }, 'logs', failures)
      const logFilesPayload = settledValue(logFilesResult, { files: previous.logFiles }, 'log files', failures)
      const activityPayload = settledValue(activityResult, {
        activity: activityForServer(serverId),
        restartRequired: previous.restartRequired,
        restartReasons: previous.restartReasons,
      }, 'activity', failures)
      const diagnosticsPayload = settledValue(diagnosticsResult, {
        diagnostics: previous.diagnostics || diagnosticsByServer.value[serverId],
      }, 'diagnostics', failures)
      const maintenancePayload = settledValue(maintenanceResult, { maintenance: previous.maintenance }, 'maintenance', failures)
      const commandsPayload = settledValue(commandsResult, { commands: previous.allowedCommands }, 'commands', failures)
      const modsPayload = settledValue(modsResult, { mods: previous.mods }, 'mods', failures)
      const modBackupsPayload = settledValue(modBackupsResult, { backups: previous.modBackups }, 'mod backups', failures)
      const playersPayload = settledValue(playersResult, {
        players: previous.players,
        whitelist: previous.whitelist,
        ops: previous.ops,
        bannedPlayers: previous.bannedPlayers,
        bannedIps: previous.bannedIps,
      }, 'players', failures)
      const worldsPayload = settledValue(worldsResult, { worlds: previous.worlds }, 'worlds', failures)
      const backupsPayload = settledValue(backupsResult, { backups: previous.backups }, 'backups', failures)

      if (failures.length === results.length) {
        throw new Error(failures[0] || 'Server refresh failed')
      }

      const server = asDetail(serverPayload, serverId)
      const status = statusPayload?.status || statusPayload || {}
      const settings = propertiesPayload?.settings || propertiesPayload || {}
      const mods = unwrap(modsPayload, 'mods')
      const logs = unwrap(logsPayload, 'logs')
      const logFiles = unwrap(logFilesPayload, 'files')
      const activity = unwrap(activityPayload, 'activity')
      const diagnostics = diagnosticsPayload?.diagnostics || diagnosticsPayload || null
      const maintenance = maintenancePayload?.maintenance || maintenancePayload || null
      const allowedCommands = unwrap(commandsPayload, 'commands')
      const modBackups = unwrap(modBackupsPayload, 'backups')
      const worlds = unwrap(worldsPayload, 'worlds')
      const backups = unwrap(backupsPayload, 'backups')
      const mergedMods = mergeModUpdateMetadata(mods, previous?.mods || [])
      mergeActivityEntries(serverId, activity)
      if (diagnostics) {
        diagnosticsByServer.value = {
          ...diagnosticsByServer.value,
          [serverId]: diagnostics,
        }
      }

      mergeDetail(serverId, {
        ...server,
        ...status,
        settings,
        diagnostics,
        maintenance: maintenance || server.maintenance,
        mods: mergedMods.length ? mergedMods : undefined,
        modBackups,
        logs: logs.length ? logs : undefined,
        logFiles: logFiles.length ? logFiles : undefined,
        activity: activityForServer(serverId),
        allowedCommands: allowedCommands.length ? allowedCommands : server.allowedCommands,
        restartRequired: activityPayload?.restartRequired,
        restartReasons: activityPayload?.restartReasons,
        exploredLogs: previous?.exploredLogs,
        exploredLogFile: previous?.exploredLogFile,
        exploredLogQuery: previous?.exploredLogQuery,
        exploredLogTail: previous?.exploredLogTail,
        worlds: worlds.length ? worlds : undefined,
        backups: backups.length ? backups : undefined,
        updateCount: (mergedMods.length ? mergedMods : previous?.mods || []).filter((mod) => mod.updateAvailable).length,
        players: playersPayload?.players,
        whitelist: playersPayload?.whitelist,
        ops: playersPayload?.ops,
        bannedPlayers: playersPayload?.bannedPlayers,
        bannedIps: playersPayload?.bannedIps,
      })
      if (failures.length) {
        error.value = `Partial Minecraft refresh: used cached data for ${failures.slice(0, 3).join('; ')}`
      }
    } catch (err) {
      error.value = err.message
    } finally {
      const next = new Set(refreshingIds.value)
      next.delete(serverId)
      refreshingIds.value = next
    }
  }

  async function fetchDiagnostics(serverId) {
    if (!serverId) return null
    const payload = await api.getDiagnostics(serverId)
    const diagnostics = payload?.diagnostics || payload || null
    if (!diagnostics) return null

    diagnosticsByServer.value = {
      ...diagnosticsByServer.value,
      [serverId]: diagnostics,
    }
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    mergeDetail(serverId, {
      ...detail,
      diagnostics,
    })
    return diagnostics
  }

  async function refreshAll() {
    await fetchServers()
    await Promise.all(servers.value.map((server) => fetchServer(server.id)))
  }

  function appendLog(serverId, line) {
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    mergeDetail(serverId, {
      ...detail,
      logs: [...(detail.logs || []), logLine(line)].slice(-250),
    })
  }

  function appendWakeNotice(serverId, timestamp = new Date().toISOString()) {
    appendLog(serverId, `[${timestamp}] [panel/INFO]: woke sleeping server for RCON access`)
  }

  async function fetchLogFiles(serverId) {
    const payload = await api.getLogFiles(serverId)
    const files = unwrap(payload, 'files')
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    mergeDetail(serverId, {
      ...detail,
      logFiles: files.length ? files : detail.logFiles,
    })
    return files
  }

  async function exploreLogs(serverId, options = {}) {
    const payload = await api.getLogs(serverId, {
      file: options.file || 'latest.log',
      tail: options.tail || 200,
      query: options.query || '',
    })
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const logs = unwrap(payload, 'logs').map(logLine)
    mergeDetail(serverId, {
      ...detail,
      exploredLogs: logs,
      exploredLogFile: payload.file || options.file || 'latest.log',
      exploredLogQuery: payload.query || options.query || '',
      exploredLogTail: payload.tail || options.tail || 200,
    })
    return logs
  }

  async function exportLogs(serverId, options = {}) {
    return api.downloadLogs(serverId, {
      file: options.file || 'latest.log',
      tail: options.tail || 200,
      query: options.query || '',
    })
  }

  async function downloadWorldArchive(serverId, world) {
    const worldId = world?.id || world?.name
    const result = await api.downloadWorld(serverId, worldId)
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: world archive downloaded ${worldId}`)
    recordActivity(serverId, {
      type: 'worlds',
      label: 'download world',
      summary: `downloaded world archive ${worldId}`,
      target: worldId,
      status: 'success',
    })
    return result
  }

  async function downloadBackupArchive(serverId, backup) {
    const backupId = backup?.id || backup?.label
    const result = await api.downloadBackup(serverId, backupId)
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: backup archive downloaded ${backupId}`)
    recordActivity(serverId, {
      type: 'backups',
      label: 'download backup',
      summary: `downloaded backup archive ${backup?.label || backupId}`,
      target: backupId,
      status: 'success',
    })
    return result
  }

  function setStreaming(serverId, streaming) {
    const next = new Set(streamingIds.value)
    if (streaming) next.add(serverId)
    else next.delete(serverId)
    streamingIds.value = next
  }

  function startLogStream(serverId) {
    if (!serverId) return null
    stopLogStream(serverId)
    const token = `${serverId}:${Date.now()}:${Math.random()}`
    logStreamTokens.set(serverId, token)
    setStreaming(serverId, true)

    try {
      const stop = api.streamLogs(serverId, (event) => {
        if (logStreamTokens.get(serverId) !== token) return

        if (event.type === 'connected') {
          appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: live log stream connected`)
          return
        }
        if (event.type === 'log') {
          appendLog(serverId, event.line)
          return
        }
        if (event.type === 'warning') {
          appendLog(serverId, `[${new Date().toISOString()}] [panel/WARN]: ${event.message}`)
          return
        }
        if (event.type === 'error') {
          appendLog(serverId, `[${new Date().toISOString()}] [panel/ERROR]: ${event.message}`)
          logStreamTokens.delete(serverId)
          logStreamStops.delete(serverId)
          setStreaming(serverId, false)
          return
        }
        if (event.type === 'closed') {
          appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: live log stream closed`)
          logStreamTokens.delete(serverId)
          logStreamStops.delete(serverId)
          setStreaming(serverId, false)
        }
      })
      logStreamStops.set(serverId, stop)
      return stop
    } catch (err) {
      error.value = err.message
      logStreamTokens.delete(serverId)
      setStreaming(serverId, false)
      return null
    }
  }

  function stopLogStream(serverId) {
    const stop = logStreamStops.get(serverId)
    logStreamTokens.delete(serverId)
    if (stop) {
      stop()
      logStreamStops.delete(serverId)
    }
    setStreaming(serverId, false)
  }

  function stopAllLogStreams() {
    Array.from(logStreamStops.keys()).forEach(stopLogStream)
  }

  function setStatusStreaming(serverId, streaming) {
    const next = new Set(statusStreamingIds.value)
    if (streaming) next.add(serverId)
    else next.delete(serverId)
    statusStreamingIds.value = next
  }

  function setStatusStreamRetrying(serverId, retrying) {
    const next = new Set(statusStreamRetryingIds.value)
    if (retrying) next.add(serverId)
    else next.delete(serverId)
    statusStreamRetryingIds.value = next
  }

  function clearStatusStreamRetry(serverId) {
    const timer = statusStreamRetryTimers.get(serverId)
    if (timer) clearTimeout(timer)
    statusStreamRetryTimers.delete(serverId)
    setStatusStreamRetrying(serverId, false)
  }

  function resetStatusStreamRetry(serverId) {
    clearStatusStreamRetry(serverId)
    statusStreamRetryCounts.delete(serverId)
  }

  function scheduleStatusStreamRetry(serverId, token, options = {}, reason = 'closed') {
    if (fallbackMode.value || statusStreamTokens.get(serverId) !== token) return

    clearStatusStreamRetry(serverId)
    const retryCount = statusStreamRetryCounts.get(serverId) || 0
    if (retryCount >= STATUS_STREAM_MAX_RETRIES) {
      const message = `status stream stopped after ${STATUS_STREAM_MAX_RETRIES} reconnect attempts (${reason})`
      appendLog(serverId, `[${new Date().toISOString()}] [panel/WARN]: ${message}`)
      error.value = message
      statusStreamTokens.delete(serverId)
      statusStreamStops.delete(serverId)
      setStatusStreaming(serverId, false)
      return
    }

    const delay = Math.min(STATUS_STREAM_RETRY_BASE_MS * (2 ** retryCount), STATUS_STREAM_RETRY_MAX_MS)
    statusStreamRetryCounts.set(serverId, retryCount + 1)
    setStatusStreaming(serverId, false)
    setStatusStreamRetrying(serverId, true)

    const timer = setTimeout(() => {
      statusStreamRetryTimers.delete(serverId)
      setStatusStreamRetrying(serverId, false)
      if (statusStreamTokens.get(serverId) !== token) return
      startStatusStream(serverId, {
        ...options,
        retryAttempt: true,
      })
    }, delay)
    statusStreamRetryTimers.set(serverId, timer)
  }

  function applyStatusSnapshot(serverId, snapshot = {}, timestamp = new Date().toISOString()) {
    const incoming = snapshot.server || snapshot
    if (!incoming || typeof incoming !== 'object') return null
    if (Array.isArray(incoming.activity)) {
      mergeActivityEntries(serverId, incoming.activity)
    }

    const previous = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const mods = Array.isArray(incoming.mods)
      ? mergeModUpdateMetadata(incoming.mods, previous?.mods || [])
      : previous.mods
    mergeDetail(serverId, {
      ...previous,
      ...incoming,
      mods,
      statusUpdatedAt: timestamp,
      activity: activityForServer(serverId),
    })
    return serverDetails.value[serverId]
  }

  function startStatusStream(serverId, options = {}) {
    if (!serverId) return null
    const retryAttempt = options.retryAttempt === true
    const streamOptions = { ...options }
    delete streamOptions.retryAttempt
    if (!retryAttempt) resetStatusStreamRetry(serverId)
    stopStatusStream(serverId, { clearRetry: false })
    const token = `${serverId}:${Date.now()}:${Math.random()}`
    statusStreamTokens.set(serverId, token)
    setStatusStreamRetrying(serverId, false)
    setStatusStreaming(serverId, true)

    try {
      const stop = api.streamStatus(serverId, (event) => {
        if (statusStreamTokens.get(serverId) !== token) return

        if (event.type === 'connected') {
          return
        }
        if (event.type === 'status') {
          resetStatusStreamRetry(serverId)
          applyStatusSnapshot(serverId, event, event.timestamp)
          return
        }
        if (event.type === 'warning') {
          appendLog(serverId, `[${new Date().toISOString()}] [panel/WARN]: ${event.message}`)
          return
        }
        if (event.type === 'error') {
          const message = event.message || 'status stream socket error'
          appendLog(serverId, `[${new Date().toISOString()}] [panel/WARN]: ${message}; reconnecting`)
          const stop = statusStreamStops.get(serverId)
          statusStreamStops.delete(serverId)
          if (stop) stop()
          scheduleStatusStreamRetry(serverId, token, streamOptions, message)
          return
        }
        if (event.type === 'closed') {
          statusStreamStops.delete(serverId)
          scheduleStatusStreamRetry(serverId, token, streamOptions, 'closed')
        }
      }, streamOptions)
      statusStreamStops.set(serverId, stop)
      return stop
    } catch (err) {
      error.value = err.message
      statusStreamTokens.delete(serverId)
      resetStatusStreamRetry(serverId)
      setStatusStreaming(serverId, false)
      return null
    }
  }

  function stopStatusStream(serverId, options = {}) {
    if (options.clearRetry !== false) {
      resetStatusStreamRetry(serverId)
    } else {
      clearStatusStreamRetry(serverId)
    }
    const stop = statusStreamStops.get(serverId)
    statusStreamTokens.delete(serverId)
    if (stop) {
      stop()
      statusStreamStops.delete(serverId)
    }
    setStatusStreaming(serverId, false)
  }

  function stopAllStatusStreams() {
    Array.from(statusStreamStops.keys()).forEach(stopStatusStream)
  }

  async function lifecycleAction(serverId, action, confirmed = false) {
    const previous = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const optimisticState = {
      wake: 'warming',
      start: 'warming',
      restart: 'warming',
      sleep: 'stopping',
      stop: 'stopping',
    }[action]

    if (optimisticState) {
      mergeDetail(serverId, {
        ...previous,
        state: optimisticState,
        stateSince: new Date().toISOString(),
      })
    }

    const payload = await api.lifecycleAction(serverId, action, confirmed)
    mergeDetail(serverId, asDetail(payload, serverId))
    recordResultActivity(serverId, payload, {
      type: 'lifecycle',
      label: `${action} server`,
      summary: `${action} ${previous.label || serverId}`,
      target: previous.label || serverId,
      clearsRestart: ['wake', 'start', 'restart'].includes(action),
    })
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: lifecycle action ${action}`)
    return payload
  }

  async function sendCommand(serverId, command, confirmed = false) {
    const cleanCommand = command.trim()
    if (!cleanCommand) return null

    const payload = await api.sendCommand(serverId, cleanCommand, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const verb = cleanCommand.split(/\s+/)[0] || 'command'
    const timestamp = payload.timestamp || new Date().toISOString()
    const entry = {
      command: cleanCommand,
      output: payload.output || payload.message || '',
      timestamp,
    }

    mergeDetail(serverId, {
      ...detail,
      commandHistory: [entry, ...(detail.commandHistory || [])].slice(0, 30),
      logs: [
        ...(detail.logs || []),
        payload.wokeServer ? `[${timestamp}] [panel/INFO]: woke sleeping server for RCON access` : '',
        `[${entry.timestamp}] [RCON]: > ${cleanCommand}`,
        entry.output ? `[${entry.timestamp}] [RCON]: ${entry.output}` : '',
      ].filter(Boolean).slice(-250),
    })

    recordResultActivity(serverId, payload, {
      type: 'rcon',
      label: 'RCON command',
      summary: `ran RCON ${verb}`,
      target: verb,
    })
    return payload
  }

  async function runPlayerAction(serverId, playerName, action, payload = {}, confirmed = false) {
    const result = await api.runPlayerAction(serverId, playerName, action, payload, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const players = (detail.players || []).map((player) => {
      if (player.name !== playerName) return player
      if (action === 'op') return { ...player, op: true, whitelisted: true, permission: 'OP 4', opLevel: 4, bypassesPlayerLimit: false }
      if (action === 'deop') return { ...player, op: false, opLevel: undefined, bypassesPlayerLimit: false, permission: player.permission?.startsWith('OP') ? 'Member' : player.permission }
      if (action === 'ban') return { ...player, banned: true, online: false, whitelisted: false, op: false, permission: 'Banned' }
      if (action === 'pardon') return { ...player, banned: false, permission: 'Guest' }
      if (action === 'kick') return { ...player, online: false }
      return player
    })

    mergeDetail(serverId, {
      ...detail,
      players,
      whitelist: players.filter((player) => player.whitelisted),
      ops: players.filter((player) => player.op),
      bannedPlayers: players.filter((player) => player.banned),
    })
    if (result.wokeServer) appendWakeNotice(serverId)
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: player action ${action} ${playerName}`)
    recordResultActivity(serverId, result, {
      type: 'players',
      label: `${action} player`,
      summary: `${action} ${playerName}`,
      target: playerName,
    })
    return result
  }

  async function updateOpSettings(serverId, playerName, settings, confirmed = false) {
    const result = await api.updateOpSettings(serverId, playerName, settings, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const level = Number(result.player?.level || settings.level || 4)
    const bypassesPlayerLimit = result.player?.bypassesPlayerLimit === true || settings.bypassesPlayerLimit === true
    const players = (detail.players || []).map((player) => (
      player.name === playerName
        ? {
            ...player,
            op: true,
            whitelisted: true,
            opLevel: level,
            bypassesPlayerLimit,
            permission: `OP ${level}`,
          }
        : player
    ))
    const existingOp = (detail.ops || []).find((entry) => entry.name?.toLowerCase() === playerName.toLowerCase())
    const opEntry = {
      uuid: existingOp?.uuid || result.player?.uuid || players.find((player) => player.name === playerName)?.uuid || '',
      name: playerName,
      level,
      bypassesPlayerLimit,
    }
    const ops = [
      opEntry,
      ...(detail.ops || []).filter((entry) => entry.name?.toLowerCase() !== playerName.toLowerCase()),
    ]

    mergeDetail(serverId, {
      ...detail,
      players,
      ops,
    })
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: OP settings updated ${playerName} level ${level}`)
    recordResultActivity(serverId, result, {
      type: 'players',
      label: 'update OP settings',
      summary: `updated OP settings for ${playerName}`,
      target: playerName,
      restartRequired: true,
    })
    return result
  }

  async function updateWhitelist(serverId, playerName, action, confirmed = false) {
    const result = await api.updateWhitelist(serverId, playerName, action, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const existing = detail.players?.find((player) => player.name.toLowerCase() === playerName.toLowerCase())
    let players = detail.players || []

    if (existing) {
      players = players.map((player) => (
        player.name === existing.name
          ? { ...player, whitelisted: action === 'add', banned: action === 'add' ? false : player.banned }
          : player
      ))
    } else if (action === 'add') {
      players = [{
        uuid: `pending-${Date.now()}`,
        name: playerName,
        online: false,
        whitelisted: true,
        op: false,
        banned: false,
        permission: 'Member',
        lastSeen: 'Pending',
      }, ...players]
    }

    mergeDetail(serverId, {
      ...detail,
      players,
      whitelist: players.filter((player) => player.whitelisted),
    })
    if (result.wokeServer) appendWakeNotice(serverId)
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: whitelist ${action} ${playerName}`)
    recordResultActivity(serverId, result, {
      type: 'players',
      label: `${action} whitelist`,
      summary: `${action} whitelist ${playerName}`,
      target: playerName,
    })
    return result
  }

  async function updatePlayerBlacklist(serverId, playerName, action, reason = '', confirmed = false) {
    const result = await api.updatePlayerBlacklist(serverId, playerName, action, reason, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const now = new Date().toISOString()
    let players = detail.players || []
    const existing = players.find((player) => player.name.toLowerCase() === playerName.toLowerCase())

    if (existing) {
      players = players.map((player) => (
        player.name === existing.name
          ? {
              ...player,
              banned: action === 'add',
              online: action === 'add' ? false : player.online,
              whitelisted: action === 'add' ? false : player.whitelisted,
              op: action === 'add' ? false : player.op,
              permission: action === 'add' ? 'Banned' : 'Guest',
            }
          : player
      ))
    } else if (action === 'add') {
      players = [{
        uuid: `pending-ban-${Date.now()}`,
        name: playerName,
        online: false,
        whitelisted: false,
        op: false,
        banned: true,
        permission: 'Banned',
        lastSeen: 'Pending',
      }, ...players]
    }

    const bannedPlayers = action === 'add'
      ? [
          {
            name: playerName,
            uuid: existing?.uuid || '',
            created: now,
            source: 'panel',
            expires: 'forever',
            reason: reason || 'Banned from panel',
          },
          ...(detail.bannedPlayers || []).filter((entry) => entryName(entry).toLowerCase() !== playerName.toLowerCase()),
        ]
      : (detail.bannedPlayers || []).filter((entry) => entryName(entry).toLowerCase() !== playerName.toLowerCase())

    mergeDetail(serverId, {
      ...detail,
      players,
      whitelist: players.filter((player) => player.whitelisted),
      ops: players.filter((player) => player.op),
      bannedPlayers,
    })
    if (result.wokeServer) appendWakeNotice(serverId, now)
    appendLog(serverId, `[${now}] [panel/INFO]: player blacklist ${action} ${playerName}`)
    recordResultActivity(serverId, result, {
      type: 'players',
      label: `${action} player blacklist`,
      summary: `${action} player blacklist ${playerName}`,
      target: playerName,
    })
    return result
  }

  async function updateIpBlacklist(serverId, target, action, reason = '', confirmed = false) {
    const result = await api.updateIpBlacklist(serverId, target, action, reason, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const now = new Date().toISOString()
    const bannedIps = action === 'add'
      ? [
          {
            ip: target,
            created: now,
            source: 'panel',
            expires: 'forever',
            reason: reason || 'Banned from panel',
          },
          ...(detail.bannedIps || []).filter((entry) => entryIp(entry) !== target),
        ]
      : (detail.bannedIps || []).filter((entry) => entryIp(entry) !== target)

    mergeDetail(serverId, {
      ...detail,
      bannedIps,
    })
    if (result.wokeServer) appendWakeNotice(serverId, now)
    appendLog(serverId, `[${now}] [panel/INFO]: IP blacklist ${action} ${target}`)
    recordResultActivity(serverId, result, {
      type: 'players',
      label: `${action} IP blacklist`,
      summary: `${action} IP blacklist ${target}`,
      target,
    })
    return result
  }

  async function updateSettings(serverId, settings, confirmed = false) {
    const result = await api.updateProperties(serverId, settings, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const nextSettings = {
      ...(detail.settings || {}),
      ...(result.settings || settings),
    }

    mergeDetail(serverId, {
      ...detail,
      settings: nextSettings,
      maxPlayers: Number(nextSettings['max-players'] || detail.maxPlayers),
    })
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: server properties updated`)
    recordResultActivity(serverId, result, {
      type: 'settings',
      label: 'update settings',
      summary: `updated ${Object.keys(settings).join(', ') || 'server.properties'}`,
      target: Object.keys(settings).join(', '),
      restartRequired: result.restartRequired === true,
    })
    return result
  }

  async function setModEnabled(serverId, mod, enabled, confirmed = false) {
    const result = await api.setModEnabled(serverId, mod.file, enabled, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const mods = (detail.mods || []).map((item) => (
      item.file === mod.file ? { ...item, enabled } : item
    ))

    mergeDetail(serverId, {
      ...detail,
      mods,
      disabledModCount: mods.filter((item) => !item.enabled).length,
    })
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: mod ${enabled ? 'enable' : 'disable'} ${mod.file}`)
    recordResultActivity(serverId, result, {
      type: 'mods',
      label: `${enabled ? 'enable' : 'disable'} mod`,
      summary: `${enabled ? 'enabled' : 'disabled'} ${result.file || mod.file}`,
      target: result.file || mod.file,
      restartRequired: true,
    })
    return result
  }

  async function checkModUpdates(serverId) {
    const payload = await api.checkModUpdates(serverId)
    const checkedAt = payload?.checkedAt || new Date().toISOString()
    const mods = unwrap(payload, 'mods').map((mod) => ({
      ...mod,
      updateCheckedAt: mod.updateCheckedAt || checkedAt,
    }))
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    mergeDetail(serverId, {
      ...detail,
      mods: mods.length ? mods : detail.mods,
      updateCount: (mods.length ? mods : detail.mods).filter((mod) => mod.updateAvailable).length,
    })
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: Modrinth update check complete`)
    recordResultActivity(serverId, payload, {
      type: 'mods',
      label: 'check mod updates',
      summary: 'checked Modrinth updates',
    })
  }

  async function searchMods(serverId, query) {
    const cleanQuery = query.trim()
    if (!cleanQuery) {
      modSearchResults.value = {
        ...modSearchResults.value,
        [serverId]: [],
      }
      return []
    }

    modSearchLoading.value = true
    try {
      const payload = await api.searchMods(serverId, cleanQuery)
      const results = unwrap(payload, 'results')
      modSearchResults.value = {
        ...modSearchResults.value,
        [serverId]: results,
      }
      return results
    } finally {
      modSearchLoading.value = false
    }
  }

  async function installMod(serverId, project, confirmed = false) {
    const result = await api.installMod(serverId, project, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const mod = result.mod || {
      id: project.slug || project.projectId,
      name: project.title || project.slug || project.projectId,
      file: `${project.slug || project.projectId}.jar`,
      enabled: true,
      version: project.latestVersion || 'pending',
      latestVersion: project.latestVersion || 'pending',
      updateAvailable: false,
      required: false,
    }

    mergeDetail(serverId, {
      ...detail,
      mods: [mod, ...(detail.mods || [])],
      modCount: Number(detail.modCount || 0) + 1,
    })
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: mod installed ${mod.file}`)
    recordResultActivity(serverId, result, {
      type: 'mods',
      label: 'install mod',
      summary: `installed ${mod.file}`,
      target: mod.file,
      restartRequired: true,
    })
    return result
  }

  async function uploadMod(serverId, file, confirmed = false) {
    const result = await api.uploadMod(serverId, file, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const mod = result.mod || {
      id: file.name.replace(/\.jar$/i, ''),
      name: file.name,
      file: file.name,
      enabled: true,
      version: 'uploaded',
      latestVersion: 'uploaded',
      updateAvailable: false,
      required: false,
    }
    const mods = [
      mod,
      ...(detail.mods || []).filter((item) => item.file !== mod.file),
    ]

    mergeDetail(serverId, {
      ...detail,
      mods,
      modCount: mods.filter((item) => item.enabled).length,
      disabledModCount: mods.filter((item) => !item.enabled).length,
    })
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: mod uploaded ${mod.file}`)
    recordResultActivity(serverId, result, {
      type: 'mods',
      label: 'upload mod',
      summary: `uploaded ${mod.file}`,
      target: mod.file,
      restartRequired: true,
    })
    return result
  }

  async function updateMod(serverId, mod, confirmed = false) {
    const result = await api.updateMod(serverId, mod.file, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const mods = (detail.mods || []).map((item) => (
      item.file === mod.file
        ? {
            ...item,
            file: result.file || item.file,
            previousFile: result.previousFile || item.file,
            backupFile: result.backupFile,
            version: result.latestVersion || item.latestVersion || item.version,
            latestVersion: result.latestVersion || item.latestVersion || item.version,
            updateAvailable: false,
            dependencies: Array.isArray(result.dependencies) ? result.dependencies : item.dependencies,
            dependencyCount: result.dependencyCount ?? item.dependencyCount,
            requiredDependencyCount: result.requiredDependencyCount ?? item.requiredDependencyCount,
            optionalDependencyCount: result.optionalDependencyCount ?? item.optionalDependencyCount,
          }
        : item
    ))

    mergeDetail(serverId, {
      ...detail,
      mods,
      updateCount: mods.filter((item) => item.updateAvailable).length,
    })
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: mod update queued ${mod.file}`)
    recordResultActivity(serverId, result, {
      type: 'mods',
      label: 'update mod',
      summary: `updated ${result.file || mod.file}`,
      target: result.file || mod.file,
      restartRequired: true,
    })
    return result
  }

  async function updateAllMods(serverId, confirmed = false) {
    const result = await api.updateAllMods(serverId, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const updatedByPreviousFile = new Map((result.updated || []).map((entry) => [entry.previousFile || entry.file, entry]))
    const mods = (detail.mods || []).map((item) => {
      const updated = updatedByPreviousFile.get(item.file)
      if (!updated) return item
      return {
        ...item,
        file: updated.file || item.file,
        previousFile: updated.previousFile || item.file,
        backupFile: updated.backupFile,
        version: updated.latestVersion || item.latestVersion || item.version,
        latestVersion: updated.latestVersion || item.latestVersion || item.version,
        updateAvailable: false,
        dependencies: Array.isArray(updated.dependencies) ? updated.dependencies : item.dependencies,
        dependencyCount: updated.dependencyCount ?? item.dependencyCount,
        requiredDependencyCount: updated.requiredDependencyCount ?? item.requiredDependencyCount,
        optionalDependencyCount: updated.optionalDependencyCount ?? item.optionalDependencyCount,
      }
    })

    modUpdateSummaries.value = {
      ...modUpdateSummaries.value,
      [serverId]: {
        updated: result.updated || [],
        failed: result.failed || [],
        skipped: result.skipped || [],
        timestamp: new Date().toISOString(),
      },
    }

    mergeDetail(serverId, {
      ...detail,
      mods,
      updateCount: mods.filter((item) => item.updateAvailable).length,
    })
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: bulk mod update complete (${(result.updated || []).length} updated, ${(result.failed || []).length} failed)`)
    recordResultActivity(serverId, result, {
      type: 'mods',
      label: 'update all mods',
      summary: `updated ${(result.updated || []).length} mods`,
      target: `${(result.updated || []).length} mods`,
      restartRequired: result.restartRequired === true || (result.updated || []).length > 0,
    })
    return result
  }

  async function restoreModBackup(serverId, backup, confirmed = false) {
    const result = await api.restoreModBackup(serverId, backup.file || backup.id, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const restoredFile = result.file || backup.originalFile
    const existing = (detail.mods || []).some((mod) => mod.file === restoredFile)
    const mods = existing
      ? detail.mods
      : [{
          id: restoredFile,
          name: restoredFile,
          file: restoredFile,
          enabled: !restoredFile.endsWith('.disabled'),
          version: 'restored',
          latestVersion: 'restored',
          updateAvailable: false,
          required: false,
        }, ...(detail.mods || [])]
    const modBackups = (detail.modBackups || []).filter((item) => (item.file || item.id) !== (backup.file || backup.id))

    mergeDetail(serverId, {
      ...detail,
      mods,
      modBackups,
      modBackupCount: modBackups.length,
      modCount: mods.filter((mod) => mod.enabled).length,
      disabledModCount: mods.filter((mod) => !mod.enabled).length,
    })
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: mod backup restored ${backup.file || backup.id}`)
    recordResultActivity(serverId, result, {
      type: 'mods',
      label: 'restore mod backup',
      summary: `restored ${restoredFile}`,
      target: backup.file || backup.id,
      restartRequired: true,
    })
    return result
  }

  async function deleteModBackup(serverId, backup, confirmed = false) {
    const result = await api.deleteModBackup(serverId, backup.file || backup.id, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const modBackups = (detail.modBackups || []).filter((item) => (item.file || item.id) !== (backup.file || backup.id))

    mergeDetail(serverId, {
      ...detail,
      modBackups,
      modBackupCount: modBackups.length,
    })
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: mod backup deleted ${backup.file || backup.id}`)
    recordResultActivity(serverId, result, {
      type: 'mods',
      label: 'delete mod backup',
      summary: `deleted mod backup ${backup.file || backup.id}`,
      target: backup.file || backup.id,
    })
    return result
  }

  async function switchWorld(serverId, world, confirmed = false) {
    const result = await api.switchWorld(serverId, world.id, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const worlds = (detail.worlds || []).map((item) => ({
      ...item,
      active: item.id === world.id,
    }))

    mergeDetail(serverId, {
      ...detail,
      worlds,
      activeWorld: world.path || `worlds/${world.name}`,
    })
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: world switch queued ${world.name}`)
    recordResultActivity(serverId, result, {
      type: 'worlds',
      label: 'switch world',
      summary: `switched to ${world.name}`,
      target: world.name,
      restartRequired: true,
    })
    return result
  }

  async function createWorld(serverId, payload, confirmed = false) {
    const result = await api.createWorld(serverId, payload, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const world = result.world || payload

    mergeDetail(serverId, {
      ...detail,
      worlds: [{
        id: world.id || world.name,
        name: world.name,
        path: `worlds/${world.name}`,
        active: false,
        size: 'Pending',
        updatedAt: new Date().toISOString(),
      }, ...(detail.worlds || [])],
    })
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: new world queued ${world.name}`)
    recordResultActivity(serverId, result, {
      type: 'worlds',
      label: 'create world',
      summary: `created world ${world.name}`,
      target: world.name,
      restartRequired: true,
    })
    return result
  }

  async function deleteWorld(serverId, world, confirmed = false) {
    const result = await api.deleteWorld(serverId, world.id, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    mergeDetail(serverId, {
      ...detail,
      worlds: (detail.worlds || []).filter((item) => item.id !== world.id),
    })
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: world deleted ${world.name}`)
    recordResultActivity(serverId, result, {
      type: 'worlds',
      label: 'delete world',
      summary: `deleted world ${world.name}`,
      target: world.name,
    })
    return result
  }

  async function backupWorld(serverId) {
    const result = await api.backupWorld(serverId)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const backup = {
      id: `${serverId}-${Date.now()}`,
      label: 'manual snapshot',
      status: 'queued',
      createdAt: new Date().toISOString(),
      path: `/mnt/storage-1/minecraft/backups/snapshots/${serverId}`,
      size: 'Pending',
    }

    mergeDetail(serverId, {
      ...detail,
      backups: [backup, ...(detail.backups || [])],
      lastBackupAt: backup.createdAt,
      lastBackupStatus: backup.status,
    })
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: backup queued`)
    recordResultActivity(serverId, result, {
      type: 'backups',
      label: 'snapshot world',
      summary: 'queued active world snapshot',
    })
    return result
  }

  async function restoreBackup(serverId, backup, confirmed = false) {
    const result = await api.restoreBackup(serverId, backup.id, confirmed)
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: backup restore queued ${backup.label || backup.id}`)
    recordResultActivity(serverId, result, {
      type: 'backups',
      label: 'restore backup',
      summary: `restored backup ${backup.label || backup.id}`,
      target: backup.label || backup.id,
      restartRequired: true,
    })
    return result
  }

  async function deleteBackup(serverId, backup, confirmed = false) {
    const result = await api.deleteBackup(serverId, backup.id, confirmed)
    const detail = serverDetails.value[serverId] || createFallbackDetail(serverId)
    const backups = (detail.backups || []).filter((item) => item.id !== backup.id)
    mergeDetail(serverId, {
      ...detail,
      backups,
      lastBackupAt: backups[0]?.createdAt || null,
      lastBackupStatus: backups[0]?.status || 'unknown',
    })
    appendLog(serverId, `[${new Date().toISOString()}] [panel/INFO]: backup deleted ${backup.label || backup.id}`)
    recordResultActivity(serverId, result, {
      type: 'backups',
      label: 'delete backup',
      summary: `deleted backup ${backup.label || backup.id}`,
      target: backup.label || backup.id,
    })
    return result
  }

  function startPolling(intervalMs = 15000) {
    stopPolling()
    pollHandle.value = window.setInterval(() => {
      servers.value.forEach((server) => fetchServer(server.id))
    }, intervalMs)
  }

  function stopPolling() {
    if (pollHandle.value) {
      window.clearInterval(pollHandle.value)
      pollHandle.value = null
    }
  }

  return {
    servers,
    serverDetails,
    selectedServerId,
    selectedServer,
    selectedDetail,
    totals,
    loading,
    error,
    fallbackMode,
    fallbackReason,
    apiEndpoint,
    refreshingIds,
    streamingIds,
    statusStreamingIds,
    statusStreamRetryingIds,
    modSearchResults,
    modSearchLoading,
    modUpdateSummaries,
    operationTrail,
    diagnosticsByServer,
    iconUrls,
    iconLoadingIds,
    activityFeed,
    activityForServer,
    restartReasonsForServer,
    clearActivity,
    serverIconUrl,
    fetchServerIcon,
    setSelectedServer,
    fetchServers,
    fetchServer,
    fetchDiagnostics,
    refreshAll,
    fetchLogFiles,
    exploreLogs,
    exportLogs,
    downloadWorldArchive,
    downloadBackupArchive,
    lifecycleAction,
    sendCommand,
    runPlayerAction,
    updateOpSettings,
    updateWhitelist,
    updatePlayerBlacklist,
    updateIpBlacklist,
    updateSettings,
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
    appendLog,
    startLogStream,
    stopLogStream,
    stopAllLogStreams,
    startStatusStream,
    stopStatusStream,
    stopAllStatusStreams,
    startPolling,
    stopPolling,
  }
})
