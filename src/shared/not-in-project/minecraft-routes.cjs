const express = require('express')
const { getAuth } = require('firebase-admin/auth')
const fs = require('fs')
const fsp = require('fs/promises')
const path = require('path')
const net = require('net')
const crypto = require('crypto')
const { execFile, spawn } = require('child_process')

const router = express.Router()
const WS_OPEN = 1

const MINECRAFT_ROOT = process.env.MINECRAFT_ROOT || '/mnt/storage-1/minecraft'
const SCRIPT_ROOT = process.env.MINECRAFT_SCRIPT_ROOT || path.join(MINECRAFT_ROOT, 'scripts')
const BACKUP_ROOT = process.env.MINECRAFT_BACKUP_ROOT || path.join(MINECRAFT_ROOT, 'backups', 'snapshots')
const DEFAULT_RCON_HOST = process.env.MINECRAFT_RCON_HOST || '127.0.0.1'
const WAKE_TIMEOUT_MS = Number(process.env.MINECRAFT_WAKE_TIMEOUT_MS || 60000)
const RCON_TIMEOUT_MS = Number(process.env.MINECRAFT_RCON_TIMEOUT_MS || 10000)
const RCON_IDLE_MS = Number(process.env.MINECRAFT_RCON_IDLE_MS || 150)
const RCON_MAX_RESPONSE_BYTES = Number(process.env.MINECRAFT_RCON_MAX_RESPONSE_BYTES || 1024 * 1024)
const MODRINTH_API_ROOT = 'https://api.modrinth.com/v2'
const MODRINTH_USER_AGENT = 'mxn-au-minecraft-panel/1.0'
const ACTIVITY_LOG_PATH = process.env.MINECRAFT_ACTIVITY_LOG || path.join(MINECRAFT_ROOT, 'panel-activity.jsonl')
const ACTIVITY_READ_BYTES = Number(process.env.MINECRAFT_ACTIVITY_READ_BYTES || 1024 * 1024 * 2)
const MOD_UPLOAD_MAX_BYTES = Number(process.env.MINECRAFT_MOD_UPLOAD_MAX_BYTES || 1024 * 1024 * 128)
const MAINTENANCE_CRON_PATH = process.env.MINECRAFT_MAINTENANCE_CRON || '/etc/cron.d/minecraft'
const LOCAL_SNAPSHOT_RETENTION = Number(process.env.MINECRAFT_LOCAL_SNAPSHOT_RETENTION || 2)
const ICON_CACHE_SECONDS = Number(process.env.MINECRAFT_ICON_CACHE_SECONDS || 300)
const STATUS_STREAM_INTERVAL_MS = Number(process.env.MINECRAFT_STATUS_STREAM_INTERVAL_MS || 5000)

const registryWarnings = []

function csvSet(value, transform = (item) => item) {
  return new Set(String(value || '')
    .split(',')
    .map((item) => transform(item.trim()))
    .filter(Boolean))
}

function getOperatorAllowlist() {
  return {
    emails: csvSet(process.env.MINECRAFT_ADMIN_EMAILS, (item) => item.toLowerCase()),
    uids: csvSet(process.env.MINECRAFT_ADMIN_UIDS),
  }
}

function isAuthorizedOperator(user) {
  const allowlist = getOperatorAllowlist()
  if (!allowlist.emails.size && !allowlist.uids.size) return true
  const email = String(user?.email || '').toLowerCase()
  const uid = String(user?.uid || '')
  return (email && allowlist.emails.has(email)) || (uid && allowlist.uids.has(uid))
}

function requireOperator(user) {
  if (isAuthorizedOperator(user)) return user
  throw httpError('Minecraft operator access denied', 403, 'MINECRAFT_OPERATOR_DENIED')
}

const defaultServerRegistry = {
  hc: {
    id: 'hc',
    label: 'Hardcore',
    host: 'hc.play.mxn.au',
    publicPort: 25565,
    backendPort: 25665,
    rconPort: 25765,
    service: 'minecraft-hc-sleep.service',
    version: '1.21.11',
    gameVersion: process.env.MINECRAFT_GAME_VERSION_HC || '1.21.11',
    loader: 'fabric',
    root: path.join(MINECRAFT_ROOT, 'servers', 'hc'),
    profile: 'hardcore',
  },
  shc: {
    id: 'shc',
    label: 'Shared Health Hardcore',
    host: 'shc.play.mxn.au',
    publicPort: 25566,
    backendPort: 25666,
    rconPort: 25766,
    service: 'minecraft-shc-sleep.service',
    version: '1.21.11',
    gameVersion: process.env.MINECRAFT_GAME_VERSION_SHC || '1.21.11',
    loader: 'fabric',
    root: path.join(MINECRAFT_ROOT, 'servers', 'shc'),
    profile: 'shared-health',
  },
  mc: {
    id: 'mc',
    label: 'Survival',
    host: 'mc.play.mxn.au',
    publicPort: 25567,
    backendPort: 25667,
    rconPort: 25767,
    service: 'minecraft-mc-sleep.service',
    version: '26.1.2',
    gameVersion: process.env.MINECRAFT_GAME_VERSION_MC || '26.1.2',
    loader: 'fabric',
    root: path.join(MINECRAFT_ROOT, 'servers', 'mc'),
    profile: 'survival',
  },
}

function warnRegistry(message) {
  registryWarnings.push(message)
  console.warn(`[minecraft-registry] ${message}`)
}

function asPort(value, field, serverId) {
  const number = Number(value)
  if (!Number.isInteger(number) || number < 1 || number > 65535) {
    throw new Error(`${serverId}.${field} must be a TCP port`)
  }
  return number
}

function normalizeServerConfig(raw, inherited = {}) {
  const id = String(raw?.id || inherited.id || '').trim()
  if (!/^[a-zA-Z0-9_-]{1,40}$/.test(id)) {
    throw new Error('server id must be 1-40 letters, numbers, underscores, or hyphens')
  }

  const merged = { ...inherited, ...raw, id }
  const root = merged.root || path.join(MINECRAFT_ROOT, 'servers', id)
  const service = String(merged.service || '').trim()
  if (!service) throw new Error(`${id}.service is required`)

  return {
    id,
    label: String(merged.label || merged.name || id).trim(),
    host: String(merged.host || `${id}.play.mxn.au`).trim(),
    publicPort: asPort(merged.publicPort, 'publicPort', id),
    backendPort: asPort(merged.backendPort, 'backendPort', id),
    rconPort: asPort(merged.rconPort, 'rconPort', id),
    service,
    version: String(merged.version || merged.gameVersion || '').trim(),
    gameVersion: String(process.env[`MINECRAFT_GAME_VERSION_${id.toUpperCase()}`] || merged.gameVersion || merged.version || '').trim(),
    loader: String(merged.loader || 'fabric').toLowerCase(),
    root,
    profile: String(merged.profile || id).trim(),
  }
}

function normalizeRegistryConfig(rawConfig) {
  if (!rawConfig) return []
  if (Array.isArray(rawConfig)) return rawConfig
  if (Array.isArray(rawConfig.servers)) return rawConfig.servers
  if (typeof rawConfig === 'object') {
    return Object.entries(rawConfig).map(([id, value]) => ({ id, ...value }))
  }
  throw new Error('registry config must be an array, object, or { servers } object')
}

function readRegistryFile(filePath) {
  if (!filePath) return null
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    warnRegistry(`could not read ${filePath}: ${error.message}`)
    return null
  }
}

function readRegistryJson(value) {
  if (!value) return null
  try {
    return JSON.parse(value)
  } catch (error) {
    warnRegistry(`MINECRAFT_SERVERS_JSON is invalid: ${error.message}`)
    return null
  }
}

function loadServerRegistry() {
  const registry = {}
  for (const [id, server] of Object.entries(defaultServerRegistry)) {
    registry[id] = normalizeServerConfig(server)
  }

  const configs = [
    readRegistryFile(process.env.MINECRAFT_SERVERS_FILE),
    readRegistryJson(process.env.MINECRAFT_SERVERS_JSON),
  ]

  for (const config of configs) {
    for (const rawServer of normalizeRegistryConfig(config)) {
      try {
        const current = registry[rawServer.id]
        const server = normalizeServerConfig(rawServer, current)
        registry[server.id] = server
      } catch (error) {
        warnRegistry(`skipping server config: ${error.message}`)
      }
    }
  }

  return registry
}

const serverRegistry = loadServerRegistry()

const destructiveCommands = new Set([
  'ban',
  'ban-ip',
  'clear',
  'deop',
  'difficulty',
  'gamemode',
  'gamerule',
  'kick',
  'kill',
  'op',
  'pardon',
  'pardon-ip',
  'reload',
  'save-off',
  'setblock',
  'stop',
  'summon',
  'tp',
  'whitelist',
])

const commandCatalog = [
  { name: 'list', template: 'list', risk: 'safe', description: 'Show online players.' },
  { name: 'say', template: 'say ', risk: 'safe', description: 'Broadcast a server message.' },
  { name: 'save-all', template: 'save-all', risk: 'safe', description: 'Flush world data to disk.' },
  { name: 'whitelist', template: 'whitelist list', risk: 'guarded', description: 'Inspect or change whitelist state.' },
  { name: 'op', template: 'op ', risk: 'guarded', description: 'Grant operator permissions.' },
  { name: 'deop', template: 'deop ', risk: 'guarded', description: 'Remove operator permissions.' },
  { name: 'kick', template: 'kick ', risk: 'destructive', description: 'Disconnect a player.' },
  { name: 'ban', template: 'ban ', risk: 'destructive', description: 'Ban a player.' },
  { name: 'pardon', template: 'pardon ', risk: 'destructive', description: 'Remove a player ban.' },
  { name: 'ban-ip', template: 'ban-ip ', risk: 'destructive', description: 'Ban an IP address.' },
  { name: 'pardon-ip', template: 'pardon-ip ', risk: 'destructive', description: 'Remove an IP ban.' },
  { name: 'stop', template: 'stop', risk: 'destructive', description: 'Stop Java and let MSH hibernate the backend.' },
]

function getAllowedCommands() {
  return commandCatalog.map((command) => ({
    ...command,
    requiresConfirmation: command.risk !== 'safe' || destructiveCommands.has(command.name),
  }))
}

const serverPropertyDefinitions = {
  'white-list': { type: 'boolean', default: true, liveCommand: (value) => `whitelist ${value ? 'on' : 'off'}` },
  'enforce-whitelist': { type: 'boolean', default: false },
  pvp: { type: 'boolean', default: true },
  difficulty: { type: 'enum', values: ['peaceful', 'easy', 'normal', 'hard'], default: 'normal', liveCommand: (value) => `difficulty ${value}` },
  'max-players': { type: 'number', min: 1, max: 100, default: 20 },
  'view-distance': { type: 'number', min: 2, max: 32, default: 10 },
  'simulation-distance': { type: 'number', min: 2, max: 32, default: 10 },
  motd: { type: 'string', maxLength: 120, default: '' },
}

function asyncRoute(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

async function requireAuth(req, res, next) {
  if (process.env.MINECRAFT_API_DISABLE_AUTH === 'true') {
    req.user = { uid: 'local-dev', email: 'local-dev' }
    return next()
  }

  const header = req.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Missing bearer token' })
  }

  try {
    req.user = await getAuth().verifyIdToken(token)
    requireOperator(req.user)
    return next()
  } catch (error) {
    if (error.statusCode === 403) {
      return res.status(403).json({ message: error.message, code: error.code })
    }
    return res.status(401).json({ message: 'Invalid bearer token' })
  }
}

function getServer(req) {
  const server = serverRegistry[req.params.id]
  if (!server) {
    const error = new Error(`Unknown Minecraft server: ${req.params.id}`)
    error.statusCode = 404
    throw error
  }
  return server
}

function requireConfirmation(req, message) {
  const confirmed = req.body?.confirmed ?? req.body?.confirm ?? req.query?.confirmed ?? req.query?.confirm ?? req.get?.('x-minecraft-confirmed')
  if (confirmed === true || String(confirmed).toLowerCase() === 'true') return
  const error = new Error(message || 'Confirmation required')
  error.statusCode = 409
  error.code = 'CONFIRMATION_REQUIRED'
  throw error
}

function httpError(message, statusCode = 500, code) {
  const error = new Error(message)
  error.statusCode = statusCode
  if (code) error.code = code
  return error
}

function execFileAsync(file, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    execFile(file, args, {
      timeout: options.timeout || 15000,
      maxBuffer: options.maxBuffer || 1024 * 1024 * 8,
    }, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout
        error.stderr = stderr
        reject(error)
        return
      }
      resolve({ stdout, stderr })
    })
  })
}

async function exists(target) {
  try {
    await fsp.access(target)
    return true
  } catch {
    return false
  }
}

async function statFile(target) {
  try {
    const stat = await fsp.stat(target)
    return stat.isFile() ? stat : null
  } catch {
    return null
  }
}

function safeBasename(value) {
  const decoded = decodeURIComponent(String(value || ''))
  const base = path.basename(decoded)
  if (!base || base !== decoded || base.includes('\0')) {
    const error = new Error('Invalid filename')
    error.statusCode = 400
    throw error
  }
  return base
}

function safePlayerName(value) {
  const playerName = String(value || '').trim()
  if (!/^[A-Za-z0-9_]{1,32}$/.test(playerName)) {
    const error = new Error('Invalid Minecraft player name')
    error.statusCode = 400
    throw error
  }
  return playerName
}

function safeIpBanTarget(value) {
  const target = String(value || '').trim()
  if (!/^[A-Fa-f0-9:.]{2,45}$/.test(target)) {
    const error = new Error('Invalid IP blacklist target')
    error.statusCode = 400
    throw error
  }
  return target
}

function safeWorldId(value) {
  const worldId = String(value || '').trim()
  if (
    !worldId ||
    worldId === '.' ||
    worldId === '..' ||
    worldId.includes('/') ||
    worldId.includes('\\') ||
    worldId.includes('\0') ||
    !/^[A-Za-z0-9_. -]{1,80}$/.test(worldId)
  ) {
    const error = new Error('Invalid world id')
    error.statusCode = 400
    throw error
  }
  return worldId
}

function safeBackupId(value) {
  const backupId = String(value || '').trim()
  if (
    !backupId ||
    backupId === '.' ||
    backupId === '..' ||
    backupId.includes('/') ||
    backupId.includes('\\') ||
    backupId.includes('\0') ||
    !/^[A-Za-z0-9_. -]{1,120}$/.test(backupId)
  ) {
    const error = new Error('Invalid backup id')
    error.statusCode = 400
    throw error
  }
  return backupId
}

function safeLogFileName(value) {
  const fileName = String(value || 'latest.log').trim()
  if (
    !fileName ||
    fileName === '.' ||
    fileName === '..' ||
    fileName.includes('/') ||
    fileName.includes('\\') ||
    fileName.includes('\0') ||
    !/^[A-Za-z0-9_. -]{1,160}$/.test(fileName) ||
    (!fileName.endsWith('.log') && !fileName.endsWith('.log.gz'))
  ) {
    const error = new Error('Invalid log file name')
    error.statusCode = 400
    throw error
  }
  return fileName
}

function iconEndpoint(server, variant = 'default') {
  return `/api/minecraft/servers/${server.id}/icon${variant === 'frozen' ? '?variant=frozen' : ''}`
}

function iconInfoFromStat(server, variant, fileName, stat) {
  if (!stat) {
    return {
      variant,
      available: false,
      file: fileName,
      endpoint: iconEndpoint(server, variant),
      updatedAt: null,
      cacheKey: null,
    }
  }

  return {
    variant,
    available: true,
    file: fileName,
    endpoint: iconEndpoint(server, variant),
    updatedAt: stat.mtime.toISOString(),
    size: formatBytes(stat.size),
    cacheKey: `${fileName}:${stat.size}:${Math.trunc(stat.mtimeMs)}`,
  }
}

async function getServerIconInfo(server) {
  const defaultFile = 'server-icon.png'
  const frozenFile = 'server-icon-frozen.png'
  const [defaultStat, frozenStat] = await Promise.all([
    statFile(path.join(server.root, defaultFile)),
    statFile(path.join(server.root, frozenFile)),
  ])
  const variants = {
    default: iconInfoFromStat(server, 'default', defaultFile, defaultStat),
    frozen: iconInfoFromStat(server, 'frozen', frozenFile, frozenStat),
  }

  return {
    available: variants.default.available || variants.frozen.available,
    preferred: variants.frozen.available ? 'frozen' : 'default',
    endpoint: iconEndpoint(server, 'default'),
    frozenEndpoint: iconEndpoint(server, 'frozen'),
    updatedAt: variants.default.updatedAt || variants.frozen.updatedAt,
    variants,
  }
}

async function resolveServerIcon(server, variantValue = 'default') {
  const variant = String(variantValue || 'default').trim().toLowerCase()
  if (!['default', 'live', 'frozen'].includes(variant)) {
    throw httpError('Invalid icon variant', 400)
  }

  const defaultPath = path.join(server.root, 'server-icon.png')
  const frozenPath = path.join(server.root, 'server-icon-frozen.png')
  const candidates = variant === 'frozen'
    ? [frozenPath, defaultPath]
    : [defaultPath, frozenPath]

  for (const iconPath of candidates) {
    const stat = await statFile(iconPath)
    if (stat) return { iconPath, stat }
  }

  throw httpError('Server icon not found', 404)
}

function safeCommandReason(value) {
  return String(value || '')
    .replace(/\r?\n/g, ' ')
    .replace(/[^\x20-\x7E]/g, '')
    .trim()
    .slice(0, 160)
}

function cleanActivityValue(value, fallback = '') {
  return String(value || fallback)
    .replace(/\r?\n/g, ' ')
    .replace(/[^\x20-\x7E]/g, '')
    .trim()
    .slice(0, 180)
}

function getRequestActor(req) {
  if (process.env.MINECRAFT_API_DISABLE_AUTH === 'true' && !req.user) return 'local-dev'
  return req.user?.email || req.user?.uid || 'unknown'
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function actionId() {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : crypto.randomBytes(12).toString('hex')
}

function getRouterPath(req) {
  const originalPath = String(req.originalUrl || '').split('?')[0]
  if (req.baseUrl && originalPath.startsWith(req.baseUrl)) {
    return originalPath.slice(req.baseUrl.length) || '/'
  }
  return req.path || originalPath
}

function buildActivityEntry(req, body, durationMs) {
  const serverId = req.params?.id
  if (!serverId || !serverRegistry[serverId] || req.method === 'GET') return null

  const server = serverRegistry[serverId]
  const suffix = getRouterPath(req).replace(new RegExp(`^/servers/${escapeRegex(serverId)}`), '')
  const entry = {
    id: actionId(),
    serverId,
    timestamp: new Date().toISOString(),
    actor: getRequestActor(req),
    status: body?.ok === false ? 'warning' : 'success',
    durationMs,
    restartRequired: body?.restartRequired === true,
    clearsRestart: false,
  }

  const lifecycle = suffix.match(/^\/(wake|start|sleep|stop|restart)$/)
  if (lifecycle) {
    const action = lifecycle[1]
    return {
      ...entry,
      type: 'lifecycle',
      label: `${action} server`,
      summary: `${action} ${server.label}`,
      target: server.label,
      clearsRestart: ['wake', 'start', 'restart'].includes(action),
    }
  }

  if (suffix === '/properties') {
    const changed = Object.keys(body?.changed || req.body?.settings || {})
    return {
      ...entry,
      type: 'settings',
      label: 'update settings',
      summary: changed.length ? `updated ${changed.join(', ')}` : 'updated server.properties',
      target: changed.join(', '),
    }
  }

  if (suffix === '/command') {
    const verb = cleanActivityValue(String(req.body?.command || '').split(/\s+/)[0], 'command')
    return {
      ...entry,
      type: 'rcon',
      label: 'RCON command',
      summary: `ran RCON ${verb}`,
      target: verb,
    }
  }

  if (suffix === '/mods/check-updates') {
    return {
      ...entry,
      type: 'mods',
      label: 'check mod updates',
      summary: 'checked Modrinth updates',
    }
  }

  if (suffix === '/mods/install') {
    const target = cleanActivityValue(req.body?.projectId || req.body?.slug, 'mod')
    return {
      ...entry,
      type: 'mods',
      label: 'install mod',
      summary: `installed ${body?.file || body?.mod?.file || target}`,
      target: body?.file || body?.mod?.file || target,
    }
  }

  if (suffix === '/mods/upload') {
    const target = cleanActivityValue(body?.file || req.query?.filename || req.get?.('x-minecraft-filename'), 'mod jar')
    return {
      ...entry,
      type: 'mods',
      label: 'upload mod',
      summary: `uploaded ${target}`,
      target,
    }
  }

  if (suffix === '/mods/update-all') {
    const count = Array.isArray(body?.updated) ? body.updated.length : 0
    return {
      ...entry,
      type: 'mods',
      label: 'update all mods',
      summary: `updated ${count} mods`,
      target: `${count} mods`,
    }
  }

  const modBackupRestore = suffix.match(/^\/mods\/backups\/([^/]+)\/restore$/)
  if (modBackupRestore) {
    const target = cleanActivityValue(body?.restoredFrom || req.params?.backupFile)
    return {
      ...entry,
      type: 'mods',
      label: 'restore mod backup',
      summary: `restored ${body?.file || target}`,
      target,
    }
  }

  const modBackupDelete = suffix.match(/^\/mods\/backups\/([^/]+)$/)
  if (modBackupDelete && req.method === 'DELETE') {
    const target = cleanActivityValue(req.params?.backupFile || body?.file)
    return {
      ...entry,
      type: 'mods',
      label: 'delete mod backup',
      summary: `deleted mod backup ${target}`,
      target,
    }
  }

  const modFileAction = suffix.match(/^\/mods\/([^/]+)\/(enable|disable|update)$/)
  if (modFileAction) {
    const action = modFileAction[2]
    const target = cleanActivityValue(body?.file || req.params?.file)
    return {
      ...entry,
      type: 'mods',
      label: `${action} mod`,
      summary: `${action} ${target}`,
      target,
    }
  }

  const opSettings = suffix.match(/^\/players\/([^/]+)\/op-settings$/)
  if (opSettings) {
    const target = cleanActivityValue(req.params?.playerName)
    return {
      ...entry,
      type: 'players',
      label: 'update OP settings',
      summary: `updated OP settings for ${target}`,
      target,
    }
  }

  const playerAction = suffix.match(/^\/players\/([^/]+)\/([^/]+)$/)
  if (playerAction && req.params?.action) {
    const action = cleanActivityValue(req.params.action)
    const target = cleanActivityValue(req.params?.playerName)
    return {
      ...entry,
      type: 'players',
      label: `${action} player`,
      summary: `${action} ${target}`,
      target,
    }
  }

  const whitelist = suffix.match(/^\/whitelist\/(add|remove)$/)
  if (whitelist) {
    const action = whitelist[1]
    const target = cleanActivityValue(req.body?.playerName)
    return {
      ...entry,
      type: 'players',
      label: `${action} whitelist`,
      summary: `${action} whitelist ${target}`,
      target,
    }
  }

  const playerBlacklist = suffix.match(/^\/blacklist\/player\/(add|remove)$/)
  if (playerBlacklist) {
    const action = playerBlacklist[1]
    const target = cleanActivityValue(req.body?.playerName)
    return {
      ...entry,
      type: 'players',
      label: `${action} player blacklist`,
      summary: `${action} player blacklist ${target}`,
      target,
    }
  }

  const ipBlacklist = suffix.match(/^\/blacklist\/ip\/(add|remove)$/)
  if (ipBlacklist) {
    const action = ipBlacklist[1]
    const target = cleanActivityValue(req.body?.target || req.body?.ip)
    return {
      ...entry,
      type: 'players',
      label: `${action} IP blacklist`,
      summary: `${action} IP blacklist ${target}`,
      target,
    }
  }

  if (suffix === '/worlds/switch') {
    const target = cleanActivityValue(req.body?.worldId || body?.worldId)
    return {
      ...entry,
      type: 'worlds',
      label: 'switch world',
      summary: `switched to ${target}`,
      target,
    }
  }

  if (suffix === '/worlds/new') {
    const target = cleanActivityValue(body?.world?.name || req.body?.name || req.body?.worldId)
    return {
      ...entry,
      type: 'worlds',
      label: 'create world',
      summary: `created world ${target}`,
      target,
    }
  }

  const worldDelete = suffix.match(/^\/worlds\/([^/]+)$/)
  if (worldDelete && req.method === 'DELETE') {
    const target = cleanActivityValue(req.params?.worldId)
    return {
      ...entry,
      type: 'worlds',
      label: 'delete world',
      summary: `deleted world ${target}`,
      target,
    }
  }

  if (suffix === '/worlds/backup') {
    return {
      ...entry,
      type: 'backups',
      label: 'snapshot world',
      summary: 'queued active world snapshot',
    }
  }

  const backupRestore = suffix.match(/^\/backups\/([^/]+)\/restore$/)
  if (backupRestore) {
    const target = cleanActivityValue(req.params?.backupId)
    return {
      ...entry,
      type: 'backups',
      label: 'restore backup',
      summary: `restored backup ${target}`,
      target,
    }
  }

  const backupDelete = suffix.match(/^\/backups\/([^/]+)$/)
  if (backupDelete && req.method === 'DELETE') {
    const target = cleanActivityValue(req.params?.backupId)
    return {
      ...entry,
      type: 'backups',
      label: 'delete backup',
      summary: `deleted backup ${target}`,
      target,
    }
  }

  return {
    ...entry,
    type: 'api',
    label: 'server action',
    summary: `${req.method} ${suffix}`,
  }
}

async function appendActivity(entry) {
  if (!entry) return
  await fsp.mkdir(path.dirname(ACTIVITY_LOG_PATH), { recursive: true })
  await fsp.appendFile(ACTIVITY_LOG_PATH, `${JSON.stringify(entry)}\n`, 'utf8')
}

async function listActivity(server, limit = 80) {
  const safeLimit = Math.min(Math.max(Number(limit) || 80, 1), 200)
  try {
    const stat = await fsp.stat(ACTIVITY_LOG_PATH)
    const start = Math.max(0, stat.size - ACTIVITY_READ_BYTES)
    const length = stat.size - start
    const file = await fsp.open(ACTIVITY_LOG_PATH, 'r')
    try {
      const buffer = Buffer.alloc(length)
      await file.read(buffer, 0, length, start)
      return buffer.toString('utf8')
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => {
          try {
            return JSON.parse(line)
          } catch {
            return null
          }
        })
        .filter((entry) => entry?.serverId === server.id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, safeLimit)
    } finally {
      await file.close()
    }
  } catch {
    return []
  }
}

function getPendingRestart(activity) {
  const reasons = []
  for (const entry of activity || []) {
    if (entry.clearsRestart) break
    if (entry.restartRequired) reasons.push(entry)
  }
  return reasons
}

function makeDiagnosticCheck(id, label, status, message, meta = {}) {
  return {
    id,
    label,
    status,
    message,
    ...meta,
  }
}

async function pathDiagnostic(id, label, target, options = {}) {
  try {
    const stat = await fsp.stat(target)
    const typeMatches = !options.type
      || (options.type === 'directory' && stat.isDirectory())
      || (options.type === 'file' && stat.isFile())
    if (!typeMatches) {
      return makeDiagnosticCheck(
        id,
        label,
        options.required === false ? 'warning' : 'error',
        `${target} exists but is not a ${options.type}`,
        { path: target },
      )
    }
    if (options.executable && (stat.mode & 0o111) === 0) {
      return makeDiagnosticCheck(
        id,
        label,
        options.required === false ? 'warning' : 'error',
        `${target} is present but is not executable`,
        { path: target },
      )
    }
    return makeDiagnosticCheck(id, label, 'pass', `${target} is present`, {
      path: target,
      size: stat.isFile() ? formatBytes(stat.size) : undefined,
      updatedAt: stat.mtime.toISOString(),
    })
  } catch {
    return makeDiagnosticCheck(
      id,
      label,
      options.required === false ? 'warning' : 'error',
      `${target} was not found`,
      { path: target },
    )
  }
}

async function scriptDiagnostic(scriptName, label, required = true) {
  const scriptPath = path.join(SCRIPT_ROOT, scriptName)
  return pathDiagnostic(`script:${scriptName}`, label, scriptPath, {
    type: 'file',
    required,
    executable: true,
  })
}

async function getServerDiagnostics(server) {
  const serverPropertiesPath = path.join(server.root, 'server.properties')
  const [properties, systemd, publicOpen, backendOpen, rconOpen] = await Promise.all([
    readProperties(server),
    getSystemdState(server),
    isTcpOpen(server.publicPort),
    isTcpOpen(server.backendPort),
    isTcpOpen(server.rconPort),
  ])

  const rconPasswordSource = process.env[`MINECRAFT_RCON_PASSWORD_${server.id.toUpperCase()}`]
    ? 'env'
    : properties['rcon.password']
      ? 'server.properties'
      : ''
  const rconEnabled = String(properties['enable-rcon'] || '').toLowerCase() === 'true'
  const configuredRconPort = Number(properties['rcon.port'] || server.rconPort)
  const backupServerRoot = path.join(BACKUP_ROOT, server.id)
  const activityRoot = path.dirname(ACTIVITY_LOG_PATH)

  const checks = [
    makeDiagnosticCheck('registry', 'Registry entry', 'pass', `${server.label} is registered`, {
      host: server.host,
      publicPort: server.publicPort,
      backendPort: server.backendPort,
      rconPort: server.rconPort,
      service: server.service,
      gameVersion: getModrinthGameVersion(server),
      loader: server.loader,
    }),
    makeDiagnosticCheck(
      'systemd',
      'MSH sleep service',
      systemd.active ? 'pass' : 'warning',
      `${server.service} is ${systemd.activeState}/${systemd.subState}`,
      {
        service: server.service,
        activeState: systemd.activeState,
        subState: systemd.subState,
        mainPid: systemd.mainPid,
      },
    ),
    makeDiagnosticCheck(
      'port:public',
      'Public wake listener',
      publicOpen ? 'pass' : 'warning',
      publicOpen
        ? `Public port ${server.publicPort} is accepting connections`
        : `Public port ${server.publicPort} is closed`,
      { port: server.publicPort, open: publicOpen },
    ),
    makeDiagnosticCheck(
      'port:backend',
      'Backend game port',
      backendOpen ? 'pass' : 'info',
      backendOpen
        ? `Backend port ${server.backendPort} is open`
        : `Backend port ${server.backendPort} is closed, which is normal while sleeping`,
      { port: server.backendPort, open: backendOpen },
    ),
    makeDiagnosticCheck(
      'port:rcon',
      'RCON port',
      rconOpen ? 'pass' : 'info',
      rconOpen
        ? `RCON port ${server.rconPort} is open`
        : `RCON port ${server.rconPort} is closed, which is normal while sleeping`,
      { port: server.rconPort, open: rconOpen },
    ),
    await pathDiagnostic('path:root', 'Server root', server.root, { type: 'directory' }),
    await pathDiagnostic('path:properties', 'server.properties', serverPropertiesPath, { type: 'file' }),
    await pathDiagnostic('path:logs', 'Logs directory', path.join(server.root, 'logs'), { type: 'directory', required: false }),
    await pathDiagnostic('path:mods', 'Mods directory', path.join(server.root, 'mods'), { type: 'directory', required: false }),
    await pathDiagnostic('path:worlds', 'Worlds directory', path.join(server.root, 'worlds'), { type: 'directory', required: false }),
    await pathDiagnostic('path:backups', 'Backup snapshots', backupServerRoot, { type: 'directory', required: false }),
    await pathDiagnostic('path:activity', 'Activity log directory', activityRoot, { type: 'directory', required: false }),
    makeDiagnosticCheck(
      'rcon:enabled',
      'RCON enabled',
      rconEnabled ? 'pass' : 'warning',
      rconEnabled ? 'enable-rcon=true' : 'enable-rcon is not true in server.properties',
      { configured: rconEnabled },
    ),
    makeDiagnosticCheck(
      'rcon:password',
      'RCON password',
      rconPasswordSource ? 'pass' : 'error',
      rconPasswordSource
        ? `RCON password is configured from ${rconPasswordSource}`
        : `Set MINECRAFT_RCON_PASSWORD_${server.id.toUpperCase()} or rcon.password`,
      { source: rconPasswordSource || null },
    ),
    makeDiagnosticCheck(
      'rcon:port',
      'RCON port config',
      configuredRconPort === server.rconPort ? 'pass' : 'warning',
      configuredRconPort === server.rconPort
        ? `server.properties uses RCON port ${server.rconPort}`
        : `server.properties uses ${configuredRconPort}, registry expects ${server.rconPort}`,
      {
        configuredPort: configuredRconPort,
        registryPort: server.rconPort,
      },
    ),
    await scriptDiagnostic('backup-world.sh', 'Backup script'),
    await scriptDiagnostic('restore-world.sh', 'Restore script'),
    await scriptDiagnostic('switch-server.sh', 'World switch script', false),
    await scriptDiagnostic('new-world.sh', 'New world script', false),
    await scriptDiagnostic('start-instance.sh', 'Instance start script', false),
  ]

  const summary = checks.reduce((counts, check) => {
    counts[check.status] = (counts[check.status] || 0) + 1
    return counts
  }, { pass: 0, warning: 0, error: 0, info: 0 })

  return {
    ok: summary.error === 0,
    status: summary.error > 0 ? 'error' : summary.warning > 0 ? 'warning' : 'ready',
    checkedAt: new Date().toISOString(),
    serverId: server.id,
    root: server.root,
    backupRoot: backupServerRoot,
    activityLog: ACTIVITY_LOG_PATH,
    summary,
    checks,
  }
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fsp.readFile(filePath, 'utf8'))
  } catch {
    return fallback
  }
}

async function writeJson(filePath, value) {
  const tempPath = `${filePath}.tmp.${Date.now()}`
  await fsp.writeFile(tempPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
  await fsp.rename(tempPath, filePath)
}

function safeOpLevel(value) {
  const level = Number(value)
  if (!Number.isInteger(level) || level < 1 || level > 4) {
    const error = new Error('OP level must be an integer from 1 to 4')
    error.statusCode = 400
    throw error
  }
  return level
}

function parseProperties(content) {
  const result = {}
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const index = line.indexOf('=')
    if (index === -1) continue
    result[line.slice(0, index).trim()] = line.slice(index + 1).trim()
  }
  return result
}

async function readProperties(server) {
  try {
    const content = await fsp.readFile(path.join(server.root, 'server.properties'), 'utf8')
    return parseProperties(content)
  } catch {
    return {}
  }
}

async function setServerProperty(server, key, value) {
  const filePath = path.join(server.root, 'server.properties')
  const content = await fsp.readFile(filePath, 'utf8')
  let found = false
  const next = content.split(/\r?\n/).map((line) => {
    if (line.trim().startsWith('#')) return line
    const index = line.indexOf('=')
    if (index === -1) return line
    const currentKey = line.slice(0, index).trim()
    if (currentKey !== key) return line
    found = true
    return `${key}=${value}`
  })
  if (!found) next.push(`${key}=${value}`)
  await fsp.writeFile(filePath, next.join('\n'), 'utf8')
}

function normalizePropertyValue(key, value) {
  const definition = serverPropertyDefinitions[key]
  if (!definition) {
    const error = new Error(`Unsupported server property: ${key}`)
    error.statusCode = 400
    throw error
  }

  if (definition.type === 'boolean') {
    if (typeof value === 'boolean') return value
    const normalized = String(value).trim().toLowerCase()
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true
    if (['false', '0', 'no', 'off'].includes(normalized)) return false
  }

  if (definition.type === 'number') {
    const number = Number(value)
    if (Number.isInteger(number) && number >= definition.min && number <= definition.max) return number
  }

  if (definition.type === 'enum') {
    const normalized = String(value).trim().toLowerCase()
    if (definition.values.includes(normalized)) return normalized
  }

  if (definition.type === 'string') {
    const normalized = String(value ?? '').replace(/\r?\n/g, ' ').trim()
    if (normalized.length <= definition.maxLength) return normalized
  }

  const error = new Error(`Invalid value for server property: ${key}`)
  error.statusCode = 400
  throw error
}

function propertyValueForFile(value) {
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return String(value)
}

function getSettingValue(properties, key) {
  const definition = serverPropertyDefinitions[key]
  const raw = properties[key] ?? definition.default
  if (definition.type === 'boolean') return String(raw || 'false').toLowerCase() === 'true'
  if (definition.type === 'number') return Number(raw || 0)
  return raw || ''
}

async function getServerSettings(server) {
  const properties = await readProperties(server)
  return Object.fromEntries(Object.keys(serverPropertyDefinitions).map((key) => [
    key,
    getSettingValue(properties, key),
  ]))
}

async function updateServerSettings(server, settings) {
  const changed = {}
  for (const [key, value] of Object.entries(settings || {})) {
    if (value === undefined) continue
    changed[key] = normalizePropertyValue(key, value)
  }

  for (const [key, value] of Object.entries(changed)) {
    await setServerProperty(server, key, propertyValueForFile(value))
  }

  const liveCommands = []
  if (Object.keys(changed).length && await isTcpOpen(server.rconPort)) {
    for (const [key, value] of Object.entries(changed)) {
      const command = serverPropertyDefinitions[key].liveCommand?.(value)
      if (!command) continue
      liveCommands.push(command)
      await sendRconCommand(server, command)
    }
  }

  return {
    settings: await getServerSettings(server),
    changed,
    liveCommands,
    restartRequired: Object.keys(changed).some((key) => !serverPropertyDefinitions[key].liveCommand),
  }
}

async function isTcpOpen(port, host = '127.0.0.1', timeoutMs = 500) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port })
    const done = (result) => {
      socket.removeAllListeners()
      socket.destroy()
      resolve(result)
    }
    socket.setTimeout(timeoutMs)
    socket.once('connect', () => done(true))
    socket.once('timeout', () => done(false))
    socket.once('error', () => done(false))
  })
}

async function wakeProbe(server) {
  await isTcpOpen(server.publicPort, '127.0.0.1', 1200)
}

async function waitForPort(port, expectedOpen, timeoutMs = WAKE_TIMEOUT_MS) {
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    const open = await isTcpOpen(port, DEFAULT_RCON_HOST, 700)
    if (open === expectedOpen) return true
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  return false
}

async function ensureRconAvailable(server, options = {}) {
  if (await isTcpOpen(server.rconPort)) {
    return { ready: true, wokeServer: false }
  }

  if (options.wake === false) {
    throw httpError('RCON is not available. Wake the server first.', 409, 'RCON_UNAVAILABLE')
  }

  await wakeProbe(server)
  const ready = await waitForPort(server.rconPort, true, options.timeoutMs || WAKE_TIMEOUT_MS)
  if (!ready) {
    throw httpError(`RCON did not become available for ${server.label} within ${Math.round((options.timeoutMs || WAKE_TIMEOUT_MS) / 1000)} seconds`, 504, 'RCON_WAKE_TIMEOUT')
  }

  return { ready: true, wokeServer: true }
}

async function getSystemdState(server) {
  try {
    const { stdout } = await execFileAsync('systemctl', ['show', server.service, '--property=ActiveState,SubState,MainPID', '--value'], { timeout: 5000 })
    const [activeState, subState, mainPid] = stdout.trim().split(/\r?\n/)
    return {
      activeState: activeState || 'unknown',
      subState: subState || 'unknown',
      mainPid: Number(mainPid || 0),
      active: activeState === 'active',
    }
  } catch (error) {
    return {
      activeState: 'unknown',
      subState: error.message,
      mainPid: 0,
      active: false,
    }
  }
}

async function getPidForPort(port) {
  try {
    const { stdout } = await execFileAsync('ss', ['-ltnp'], { timeout: 5000 })
    const line = stdout.split(/\r?\n/).find((entry) => entry.includes(`:${port} `))
    const match = line && line.match(/pid=(\d+)/)
    return match ? Number(match[1]) : 0
  } catch {
    return 0
  }
}

async function getProcessStats(server) {
  const pid = await getPidForPort(server.backendPort)
  if (!pid) {
    return {
      pid: 0,
      cpu: 0,
      memory: 0,
      memoryBytes: 0,
      uptimeSeconds: 0,
    }
  }

  try {
    const { stdout } = await execFileAsync('ps', ['-p', String(pid), '-o', 'pcpu=,rss=,etimes='], { timeout: 5000 })
    const [cpuRaw, rssRaw, elapsedRaw] = stdout.trim().split(/\s+/)
    const totalMemory = await getTotalMemoryBytes()
    const rssBytes = Number(rssRaw || 0) * 1024
    return {
      pid,
      cpu: Number(cpuRaw || 0),
      memory: totalMemory ? (rssBytes / totalMemory) * 100 : 0,
      memoryBytes: rssBytes,
      uptimeSeconds: Number(elapsedRaw || 0),
    }
  } catch {
    return {
      pid,
      cpu: 0,
      memory: 0,
      memoryBytes: 0,
      uptimeSeconds: 0,
    }
  }
}

async function getTotalMemoryBytes() {
  try {
    const content = await fsp.readFile('/proc/meminfo', 'utf8')
    const match = content.match(/^MemTotal:\s+(\d+)\s+kB/m)
    return match ? Number(match[1]) * 1024 : 0
  } catch {
    return 0
  }
}

async function getDiskPercent(target) {
  try {
    const { stdout } = await execFileAsync('df', ['-P', target], { timeout: 5000 })
    const line = stdout.trim().split(/\r?\n/)[1] || ''
    const fields = line.trim().split(/\s+/)
    return Number((fields[4] || '0').replace('%', '')) || 0
  } catch {
    return 0
  }
}

async function getDirectoryBytes(target) {
  try {
    const { stdout } = await execFileAsync('du', ['-sb', target], { timeout: 20000 })
    return Number(stdout.trim().split(/\s+/)[0]) || 0
  } catch {
    return 0
  }
}

function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / Math.pow(1024, exponent)).toFixed(exponent ? 1 : 0)} ${units[exponent]}`
}

function parseRconList(output) {
  const match = output.match(/There are (\d+) of a max of (\d+) players online:?\s*(.*)$/i)
  if (!match) {
    return { playersOnline: 0, maxPlayers: 0, onlinePlayers: [] }
  }
  const names = match[3]
    ? match[3].split(',').map((name) => name.trim()).filter(Boolean)
    : []
  return {
    playersOnline: Number(match[1] || 0),
    maxPlayers: Number(match[2] || 0),
    onlinePlayers: names,
  }
}

async function getRconPassword(server) {
  const envName = `MINECRAFT_RCON_PASSWORD_${server.id.toUpperCase()}`
  if (process.env[envName]) return process.env[envName]
  const properties = await readProperties(server)
  return properties['rcon.password'] || ''
}

function createRconPacket(id, type, payload) {
  const bodyLength = Buffer.byteLength(payload) + 10
  const packet = Buffer.alloc(bodyLength + 4)
  packet.writeInt32LE(bodyLength, 0)
  packet.writeInt32LE(id, 4)
  packet.writeInt32LE(type, 8)
  packet.write(payload, 12, 'utf8')
  packet.writeInt16LE(0, bodyLength + 2)
  return packet
}

function parseRconPackets(buffer) {
  const packets = []
  let offset = 0
  while (offset + 4 <= buffer.length) {
    const length = buffer.readInt32LE(offset)
    if (length < 10 || length > RCON_MAX_RESPONSE_BYTES) {
      throw new Error('Invalid RCON packet length')
    }
    if (offset + 4 + length > buffer.length) break
    packets.push({
      id: buffer.readInt32LE(offset + 4),
      type: buffer.readInt32LE(offset + 8),
      payload: buffer.slice(offset + 12, offset + 4 + length - 2).toString('utf8'),
    })
    offset += 4 + length
  }
  return { packets, rest: buffer.slice(offset) }
}

async function sendRconCommand(server, command) {
  const password = await getRconPassword(server)
  if (!password) {
    const error = new Error('RCON password is not configured')
    error.statusCode = 500
    throw error
  }

  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: DEFAULT_RCON_HOST, port: server.rconPort })
    let buffer = Buffer.alloc(0)
    let stage = 'auth'
    let response = ''
    let responseBytes = 0
    let idleTimer = null
    let settled = false
    const commandPacketId = 2
    const sentinelPacketId = 3
    const timeout = setTimeout(() => {
      finish(new Error('RCON command timed out'))
    }, RCON_TIMEOUT_MS)

    const finish = (error, value) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      if (idleTimer) clearTimeout(idleTimer)
      socket.removeAllListeners()
      socket.destroy()
      if (error) reject(error)
      else resolve(value)
    }

    const finishWhenIdle = () => {
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(() => finish(null, response), RCON_IDLE_MS)
    }

    socket.once('connect', () => {
      socket.write(createRconPacket(1, 3, password))
    })

    socket.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk])
      let parsed
      try {
        parsed = parseRconPackets(buffer)
      } catch (error) {
        finish(error)
        return
      }
      buffer = parsed.rest

      for (const packet of parsed.packets) {
        if (stage === 'auth') {
          if (packet.id === -1) {
            finish(new Error('RCON authentication failed'))
            return
          }
          stage = 'command'
          socket.write(createRconPacket(commandPacketId, 2, command))
          socket.write(createRconPacket(sentinelPacketId, 0, ''))
          continue
        }

        if (packet.id === commandPacketId) {
          response += packet.payload
          responseBytes += Buffer.byteLength(packet.payload)
          if (responseBytes > RCON_MAX_RESPONSE_BYTES) {
            finish(new Error('RCON response exceeded maximum size'))
            return
          }
          finishWhenIdle()
          continue
        }

        if (packet.id === sentinelPacketId) {
          finish(null, response)
          return
        }
      }
    })

    socket.once('error', (error) => finish(error))
  })
}

async function getLifecycleStatus(server) {
  const [systemd, publicOpen, backendOpen, rconOpen, processStats, disk] = await Promise.all([
    getSystemdState(server),
    isTcpOpen(server.publicPort),
    isTcpOpen(server.backendPort),
    isTcpOpen(server.rconPort),
    getProcessStats(server),
    getDiskPercent(server.root),
  ])

  let state = 'offline'
  if (backendOpen && rconOpen) state = 'alive'
  else if (backendOpen && !rconOpen) state = 'warming'
  else if (systemd.active && publicOpen && !backendOpen) state = 'hibernating'
  else if (systemd.active && !publicOpen) state = 'degraded'
  else if (!systemd.active && (backendOpen || rconOpen)) state = 'degraded'

  const properties = await readProperties(server)
  let playerStatus = {
    playersOnline: 0,
    maxPlayers: Number(properties['max-players'] || 20),
    onlinePlayers: [],
  }

  if (rconOpen) {
    try {
      playerStatus = parseRconList(await sendRconCommand(server, 'list'))
    } catch {
      // Keep the file-derived capacity when RCON refuses a status query.
    }
  }

  const latestBackup = await getLatestBackup(server)

  return {
    state,
    stateSince: new Date().toISOString(),
    listenerActive: systemd.active,
    systemd,
    ports: {
      public: publicOpen,
      backend: backendOpen,
      rcon: rconOpen,
    },
    activeWorld: properties['level-name'] || '',
    maxPlayers: playerStatus.maxPlayers || Number(properties['max-players'] || 20),
    playersOnline: playerStatus.playersOnline,
    onlinePlayers: playerStatus.onlinePlayers,
    cpu: processStats.cpu,
    memory: processStats.memory,
    memoryBytes: processStats.memoryBytes,
    disk,
    uptimeSeconds: processStats.uptimeSeconds,
    lastBackupAt: latestBackup?.createdAt || null,
    lastBackupStatus: latestBackup?.status || 'unknown',
  }
}

async function getServerPayload(server) {
  const [status, mods, modBackups, settings, activity, maintenance, icon] = await Promise.all([
    getLifecycleStatus(server),
    listMods(server, { includeHashes: false }),
    listModBackups(server),
    getServerSettings(server),
    listActivity(server, 40),
    getMaintenanceState(server),
    getServerIconInfo(server),
  ])
  const restartReasons = getPendingRestart(activity)
  return {
    ...server,
    ...status,
    settings,
    loader: server.loader,
    modCount: mods.filter((mod) => mod.enabled).length,
    disabledModCount: mods.filter((mod) => !mod.enabled).length,
    modBackupCount: modBackups.length,
    updateCount: mods.filter((mod) => mod.updateAvailable).length,
    activity: activity.slice(0, 8),
    lastActivityAt: activity[0]?.timestamp || null,
    restartRequired: restartReasons.length > 0,
    restartReasons,
    allowedCommands: getAllowedCommands(server),
    maintenance,
    icon,
  }
}

async function readBackupEntries(server) {
  const serverBackupRoot = path.join(BACKUP_ROOT, server.id)
  try {
    const entries = await fsp.readdir(serverBackupRoot, { withFileTypes: true })
    const stats = await Promise.all(entries.map(async (entry) => {
      const fullPath = path.join(serverBackupRoot, entry.name)
      const stat = await fsp.stat(fullPath)
      return {
        id: entry.name,
        label: entry.name,
        status: 'success',
        createdAt: stat.mtime.toISOString(),
        path: fullPath,
        size: entry.isDirectory() ? formatBytes(await getDirectoryBytes(fullPath)) : formatBytes(stat.size),
        mtime: stat.mtimeMs,
      }
    }))
    return stats.sort((a, b) => b.mtime - a.mtime)
  } catch {
    return []
  }
}

async function listBackups(server) {
  return readBackupEntries(server)
}

async function getLatestBackup(server) {
  return (await readBackupEntries(server))[0] || null
}

function getDailyRestartTime(server) {
  return process.env[`MINECRAFT_DAILY_RESTART_${server.id.toUpperCase()}`]
    || (server.id === 'hc' ? '06:00' : server.id === 'shc' ? '06:20' : '06:40')
}

function isSameLocalDate(value, now = new Date()) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false
  return date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate()
}

async function readCronState(server) {
  try {
    const [content, stat] = await Promise.all([
      fsp.readFile(MAINTENANCE_CRON_PATH, 'utf8'),
      fsp.stat(MAINTENANCE_CRON_PATH),
    ])
    const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    const activeLines = lines.filter((line) => !line.startsWith('#'))
    const matchedLines = activeLines.filter((line) => (
      line.includes('daily-restart.sh') && new RegExp(`(^|\\s)${escapeRegex(server.id)}(\\s|$)`).test(line)
    ))
    return {
      path: MAINTENANCE_CRON_PATH,
      present: true,
      updatedAt: stat.mtime.toISOString(),
      matched: matchedLines.length > 0,
      matchedLines,
    }
  } catch (error) {
    return {
      path: MAINTENANCE_CRON_PATH,
      present: false,
      matched: false,
      matchedLines: [],
      message: error.message,
    }
  }
}

async function getMaintenanceState(server) {
  const [cron, backups] = await Promise.all([
    readCronState(server),
    listBackups(server),
  ])
  const latestBackup = backups[0] || null
  return {
    dailyRestart: getDailyRestartTime(server),
    cron: cron.path,
    cronPresent: cron.present,
    cronMatched: cron.matched,
    cronUpdatedAt: cron.updatedAt || null,
    cronLines: cron.matchedLines,
    cronMessage: cron.message,
    localSnapshotRetention: LOCAL_SNAPSHOT_RETENTION,
    snapshotRoot: path.join(BACKUP_ROOT, server.id),
    latestBackup,
    latestBackupToday: latestBackup ? isSameLocalDate(latestBackup.createdAt) : false,
    backupCount: backups.length,
    scripts: {
      dailyRestart: path.join(SCRIPT_ROOT, 'daily-restart.sh'),
      backupWorld: path.join(SCRIPT_ROOT, 'backup-world.sh'),
      restoreWorld: path.join(SCRIPT_ROOT, 'restore-world.sh'),
    },
  }
}

async function tailFile(filePath, lines) {
  if (!(await exists(filePath))) return []
  try {
    const { stdout } = await execFileAsync('tail', ['-n', String(Math.min(Number(lines) || 80, 1000)), filePath], { timeout: 5000 })
    return stdout.split(/\r?\n/).filter(Boolean)
  } catch {
    const content = await fsp.readFile(filePath, 'utf8')
    return content.split(/\r?\n/).filter(Boolean).slice(-lines)
  }
}

function getLogRoot(server) {
  return path.join(server.root, 'logs')
}

function resolveLogPath(server, fileName) {
  return resolveContainedPath(getLogRoot(server), safeLogFileName(fileName), 'log')
}

async function listLogFiles(server) {
  const logRoot = getLogRoot(server)
  let entries = []
  try {
    entries = await fsp.readdir(logRoot, { withFileTypes: true })
  } catch {
    return []
  }

  const files = await Promise.all(entries
    .filter((entry) => entry.isFile() && (entry.name.endsWith('.log') || entry.name.endsWith('.log.gz')))
    .map(async (entry) => {
      const fullPath = path.join(logRoot, entry.name)
      const stat = await fsp.stat(fullPath)
      return {
        id: entry.name,
        name: entry.name,
        path: `logs/${entry.name}`,
        size: formatBytes(stat.size),
        updatedAt: stat.mtime.toISOString(),
        compressed: entry.name.endsWith('.gz'),
        latest: entry.name === 'latest.log',
        mtime: stat.mtimeMs,
      }
    }))

  return files.sort((a, b) => {
    if (a.latest) return -1
    if (b.latest) return 1
    return b.mtime - a.mtime
  }).map(({ mtime, ...file }) => file)
}

async function readCompressedLog(filePath, lines) {
  const { stdout } = await execFileAsync('gzip', ['-cd', filePath], {
    timeout: 15000,
    maxBuffer: 1024 * 1024 * 12,
  })
  return stdout.split(/\r?\n/).filter(Boolean).slice(-lines)
}

async function searchLogFile(filePath, query, compressed, lines) {
  const command = compressed ? 'zgrep' : 'grep'
  try {
    const { stdout } = await execFileAsync(command, ['-i', '--', query, filePath], {
      timeout: 15000,
      maxBuffer: 1024 * 1024 * 12,
    })
    return stdout.split(/\r?\n/).filter(Boolean).slice(-lines)
  } catch (error) {
    if (error.code === 1) return []
    throw error
  }
}

async function readLogSelection(server, options = {}) {
  const fileName = safeLogFileName(options.file || 'latest.log')
  const lines = Math.min(Math.max(Number(options.lines || options.tail || 200), 1), 2000)
  const query = String(options.query || '').trim().slice(0, 160)
  const filePath = resolveLogPath(server, fileName)
  if (!(await exists(filePath))) {
    const error = new Error('Log file not found')
    error.statusCode = 404
    throw error
  }

  const compressed = fileName.endsWith('.gz')
  const logs = query
    ? await searchLogFile(filePath, query, compressed, lines)
    : compressed
      ? await readCompressedLog(filePath, lines)
      : await tailFile(filePath, lines)

  return {
    file: fileName,
    logs,
    query,
    tail: lines,
  }
}

function getLogExportFilename(server, selection) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const base = String(selection.file || 'latest.log').replace(/[^A-Za-z0-9_.-]/g, '_')
  return `minecraft-${server.id}-${base}-${stamp}.txt`
}

function renderLogExport(server, selection) {
  const header = [
    'Minecraft log export',
    `Server: ${server.label} (${server.id})`,
    `File: ${selection.file}`,
    `Tail: ${selection.tail}`,
    `Query: ${selection.query || '-'}`,
    `Exported: ${new Date().toISOString()}`,
    '',
  ]
  return `${header.join('\n')}${selection.logs.join('\n')}\n`
}

function sendSocketJson(ws, payload) {
  if (ws.readyState === WS_OPEN) {
    ws.send(JSON.stringify(payload))
  }
}

function getLogStreamServerId(req) {
  try {
    const requestUrl = new URL(req.url, 'http://localhost')
    const match = requestUrl.pathname.match(/^\/api\/minecraft\/servers\/([^/]+)\/logs\/stream$/)
    return match ? decodeURIComponent(match[1]) : null
  } catch {
    return null
  }
}

function isLogStreamRequest(req) {
  return Boolean(getLogStreamServerId(req))
}

function getStatusStreamServerId(req) {
  try {
    const requestUrl = new URL(req.url, 'http://localhost')
    const match = requestUrl.pathname.match(/^\/api\/minecraft\/servers\/([^/]+)\/status\/stream$/)
    return match ? decodeURIComponent(match[1]) : null
  } catch {
    return null
  }
}

function isStatusStreamRequest(req) {
  return Boolean(getStatusStreamServerId(req))
}

async function verifySocketAuth(token) {
  if (process.env.MINECRAFT_API_DISABLE_AUTH === 'true') {
    return { uid: 'local-dev', email: 'local-dev' }
  }
  if (!token) {
    const error = new Error('Missing bearer token')
    error.statusCode = 401
    throw error
  }
  const user = await getAuth().verifyIdToken(token)
  return requireOperator(user)
}

async function getStatusStreamSnapshot(server) {
  const [status, activity, maintenance] = await Promise.all([
    getLifecycleStatus(server),
    listActivity(server, 40),
    getMaintenanceState(server),
  ])
  const restartReasons = getPendingRestart(activity)

  return {
    ...server,
    ...status,
    activity: activity.slice(0, 8),
    lastActivityAt: activity[0]?.timestamp || null,
    restartRequired: restartReasons.length > 0,
    restartReasons,
    maintenance,
  }
}

function startStatusStream(ws, server, options = {}) {
  const intervalMs = Math.min(Math.max(Number(options.intervalMs || STATUS_STREAM_INTERVAL_MS), 2000), 60000)
  let inFlight = false

  const sendSnapshot = async () => {
    if (inFlight || ws.readyState !== WS_OPEN) return
    inFlight = true
    try {
      sendSocketJson(ws, {
        type: 'status',
        serverId: server.id,
        timestamp: new Date().toISOString(),
        server: await getStatusStreamSnapshot(server),
      })
    } catch (error) {
      sendSocketJson(ws, {
        type: 'warning',
        serverId: server.id,
        message: error.message || 'Could not read status snapshot',
      })
    } finally {
      inFlight = false
    }
  }

  sendSocketJson(ws, {
    type: 'connected',
    serverId: server.id,
    intervalMs,
    timestamp: new Date().toISOString(),
  })
  sendSnapshot()
  const interval = setInterval(sendSnapshot, intervalMs)

  const close = () => {
    clearInterval(interval)
  }
  ws.on('close', close)
  ws.on('error', close)
}

function handleStatusStream(ws, req) {
  const serverId = getStatusStreamServerId(req)
  const server = serverRegistry[serverId]
  if (!server) {
    sendSocketJson(ws, {
      type: 'error',
      message: `Unknown Minecraft server: ${serverId}`,
    })
    ws.close()
    return
  }

  const requestUrl = new URL(req.url, 'http://localhost')
  const intervalMs = Number(requestUrl.searchParams.get('interval') || STATUS_STREAM_INTERVAL_MS)
  let authenticated = false

  const authTimeout = setTimeout(() => {
    if (!authenticated) {
      sendSocketJson(ws, {
        type: 'error',
        message: 'Status stream authentication timed out',
      })
      ws.close()
    }
  }, 10000)

  ws.on('message', async (message) => {
    if (authenticated) {
      try {
        const data = JSON.parse(message.toString())
        if (data.type === 'ping') {
          sendSocketJson(ws, { type: 'pong' })
        }
      } catch {
        // Ignore malformed keepalive messages after auth.
      }
      return
    }

    try {
      const data = JSON.parse(message.toString())
      await verifySocketAuth(data.token)
      authenticated = true
      clearTimeout(authTimeout)
      startStatusStream(ws, server, { intervalMs })
    } catch (error) {
      clearTimeout(authTimeout)
      sendSocketJson(ws, {
        type: 'error',
        message: error.message || 'Status stream authentication failed',
      })
      ws.close()
    }
  })
}

function startLogTail(ws, server, options = {}) {
  const tailLines = Math.min(Number(options.tail || 80), 1000)
  const logPath = path.join(server.root, 'logs', 'latest.log')
  let child = null
  let carry = ''

  const close = () => {
    if (child && !child.killed) {
      child.kill('SIGTERM')
    }
  }

  exists(logPath)
    .then((hasLog) => {
      if (ws.readyState !== WS_OPEN) {
        return
      }

      if (!hasLog) {
        sendSocketJson(ws, {
          type: 'error',
          message: `Log file not found: ${logPath}`,
        })
        ws.close()
        return
      }

      child = spawn('tail', ['-n', String(tailLines), '-F', logPath], {
        stdio: ['ignore', 'pipe', 'pipe'],
      })

      sendSocketJson(ws, {
        type: 'connected',
        serverId: server.id,
        path: logPath,
      })

      child.stdout.on('data', (chunk) => {
        carry += chunk.toString('utf8')
        const lines = carry.split(/\r?\n/)
        carry = lines.pop() || ''
        for (const line of lines) {
          if (!line) continue
          sendSocketJson(ws, {
            type: 'log',
            serverId: server.id,
            line,
            timestamp: new Date().toISOString(),
          })
        }
      })

      child.stderr.on('data', (chunk) => {
        sendSocketJson(ws, {
          type: 'warning',
          serverId: server.id,
          message: chunk.toString('utf8').trim(),
        })
      })

      child.on('error', (error) => {
        sendSocketJson(ws, {
          type: 'error',
          serverId: server.id,
          message: error.message,
        })
        ws.close()
      })

      child.on('close', (code) => {
        sendSocketJson(ws, {
          type: 'closed',
          serverId: server.id,
          code,
        })
        ws.close()
      })
    })
    .catch((error) => {
      sendSocketJson(ws, {
        type: 'error',
        serverId: server.id,
        message: error.message,
      })
      ws.close()
    })

  ws.on('close', close)
  ws.on('error', close)
}

function handleLogStream(ws, req) {
  const serverId = getLogStreamServerId(req)
  const server = serverRegistry[serverId]
  if (!server) {
    sendSocketJson(ws, {
      type: 'error',
      message: `Unknown Minecraft server: ${serverId}`,
    })
    ws.close()
    return
  }

  const requestUrl = new URL(req.url, 'http://localhost')
  const tail = Number(requestUrl.searchParams.get('tail') || 80)
  let authenticated = false

  const authTimeout = setTimeout(() => {
    if (!authenticated) {
      sendSocketJson(ws, {
        type: 'error',
        message: 'Log stream authentication timed out',
      })
      ws.close()
    }
  }, 10000)

  ws.on('message', async (message) => {
    if (authenticated) {
      try {
        const data = JSON.parse(message.toString())
        if (data.type === 'ping') {
          sendSocketJson(ws, { type: 'pong' })
        }
      } catch {
        // Ignore malformed keepalive messages after auth.
      }
      return
    }

    try {
      const data = JSON.parse(message.toString())
      await verifySocketAuth(data.token)
      authenticated = true
      clearTimeout(authTimeout)
      startLogTail(ws, server, { tail })
    } catch (error) {
      clearTimeout(authTimeout)
      sendSocketJson(ws, {
        type: 'error',
        message: error.message || 'Log stream authentication failed',
      })
      ws.close()
    }
  })
}

async function sha1File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha1')
    const stream = fs.createReadStream(filePath)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.once('error', reject)
    stream.once('end', () => resolve(hash.digest('hex')))
  })
}

async function readFabricModJson(jarPath) {
  try {
    const { stdout } = await execFileAsync('unzip', ['-p', jarPath, 'fabric.mod.json'], { timeout: 5000 })
    return JSON.parse(stdout)
  } catch {
    return null
  }
}

async function modrinthJson(url) {
  if (typeof fetch !== 'function') {
    const error = new Error('Fetch API is not available for Modrinth requests')
    error.statusCode = 501
    throw error
  }

  const response = await fetch(url, {
    headers: { 'User-Agent': MODRINTH_USER_AGENT },
  })
  if (!response.ok) {
    const error = new Error(`Modrinth request failed: ${response.status}`)
    error.statusCode = response.status === 404 ? 404 : 502
    throw error
  }
  return response.json()
}

function getModrinthGameVersion(server) {
  return process.env[`MINECRAFT_GAME_VERSION_${server.id.toUpperCase()}`] || server.gameVersion || server.version
}

function getPrimaryVersionFile(version) {
  return version?.files?.find((file) => file.primary && file.filename?.endsWith('.jar'))
    || version?.files?.find((file) => file.filename?.endsWith('.jar'))
    || version?.files?.find((file) => file.primary)
    || version?.files?.[0]
}

function summarizeVersionDependencies(version) {
  return (Array.isArray(version?.dependencies) ? version.dependencies : [])
    .filter((dependency) => dependency?.dependency_type && dependency.dependency_type !== 'incompatible')
    .map((dependency) => ({
      type: dependency.dependency_type,
      projectId: dependency.project_id || null,
      versionId: dependency.version_id || null,
      fileName: dependency.file_name || null,
    }))
}

function dependencySummary(version) {
  const dependencies = summarizeVersionDependencies(version)
  return {
    dependencies,
    dependencyCount: dependencies.length,
    requiredDependencyCount: dependencies.filter((dependency) => dependency.type === 'required').length,
    optionalDependencyCount: dependencies.filter((dependency) => dependency.type === 'optional').length,
  }
}

async function getModrinthProjectVersions(server, projectId) {
  const params = new URLSearchParams({
    loaders: JSON.stringify([server.loader || 'fabric']),
    game_versions: JSON.stringify([getModrinthGameVersion(server)]),
    include_changelog: 'false',
  })
  return modrinthJson(`${MODRINTH_API_ROOT}/project/${encodeURIComponent(projectId)}/version?${params}`)
}

async function listMods(server, options = {}) {
  const modsPath = path.join(server.root, 'mods')
  let entries = []
  try {
    entries = await fsp.readdir(modsPath, { withFileTypes: true })
  } catch {
    return []
  }

  const mods = await Promise.all(entries
    .filter((entry) => entry.isFile() && (entry.name.endsWith('.jar') || entry.name.endsWith('.jar.disabled')))
    .map(async (entry) => {
      const enabled = entry.name.endsWith('.jar')
      const jarPath = path.join(modsPath, entry.name)
      const modJson = await readFabricModJson(jarPath)
      const stat = await fsp.stat(jarPath)
      return {
        id: modJson?.id || entry.name.replace(/\.disabled$/, '').replace(/\.jar$/, ''),
        name: modJson?.name || modJson?.id || entry.name,
        file: entry.name,
        enabled,
        version: String(modJson?.version || ''),
        latestVersion: String(modJson?.version || ''),
        updateAvailable: false,
        required: false,
        size: formatBytes(stat.size),
        updatedAt: stat.mtime.toISOString(),
        hash: options.includeHashes ? await sha1File(jarPath) : undefined,
      }
    }))

  return mods.sort((a, b) => a.name.localeCompare(b.name))
}

async function getModrinthCandidate(server, mod) {
  if (!mod.hash) return null

  const current = await modrinthJson(`${MODRINTH_API_ROOT}/version_file/${mod.hash}?algorithm=sha1`)
  if (!current?.project_id) return null

  const versions = await getModrinthProjectVersions(server, current.project_id)
  const latest = Array.isArray(versions) ? versions[0] : null
  const primaryFile = getPrimaryVersionFile(latest)
  if (!latest || !primaryFile) return null

  return {
    projectId: current.project_id,
    versionId: latest.id,
    latestVersion: latest.version_number,
    downloadUrl: primaryFile.url,
    filename: primaryFile.filename,
    sha1: primaryFile.hashes?.sha1,
    updateAvailable: latest.version_number !== mod.version,
    ...dependencySummary(latest),
  }
}

async function listModsWithUpdates(server) {
  const mods = await listMods(server, { includeHashes: true })
  return Promise.all(mods.map(async (mod) => {
    try {
      const candidate = await getModrinthCandidate(server, mod)
      if (!candidate) return { ...mod, lookupStatus: 'not-found' }
      return {
        ...mod,
        modrinthProjectId: candidate.projectId,
        latestVersion: candidate.latestVersion,
        updateAvailable: candidate.updateAvailable,
        updateFile: candidate.filename,
        lookupStatus: 'ok',
        dependencies: candidate.dependencies,
        dependencyCount: candidate.dependencyCount,
        requiredDependencyCount: candidate.requiredDependencyCount,
        optionalDependencyCount: candidate.optionalDependencyCount,
      }
    } catch (error) {
      return { ...mod, lookupStatus: error.message }
    }
  }))
}

async function listModBackups(server) {
  const modsPath = path.join(server.root, 'mods')
  let entries = []
  try {
    entries = await fsp.readdir(modsPath, { withFileTypes: true })
  } catch {
    return []
  }

  const backups = await Promise.all(entries
    .filter((entry) => entry.isFile() && /\.jar(\.disabled)?\.bak\.\d+$/.test(entry.name))
    .map(async (entry) => {
      const fullPath = path.join(modsPath, entry.name)
      const stat = await fsp.stat(fullPath)
      const match = entry.name.match(/^(.*?\.jar(?:\.disabled)?)\.bak\.(\d+)$/)
      const stamp = Number(match?.[2] || 0)
      return {
        id: entry.name,
        file: entry.name,
        originalFile: match?.[1] || entry.name,
        createdAt: stamp ? new Date(stamp).toISOString() : stat.mtime.toISOString(),
        size: formatBytes(stat.size),
        updatedAt: stat.mtime.toISOString(),
        timestamp: stamp || stat.mtimeMs,
      }
    }))

  return backups
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(({ timestamp, ...backup }) => backup)
}

function resolveModFilePath(server, fileName) {
  return resolveContainedPath(path.join(server.root, 'mods'), safeBasename(fileName), 'mod')
}

function getUploadFileName(req) {
  const disposition = req.get('content-disposition') || ''
  const dispositionMatch = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i)
  const fileName = safeBasename(req.query?.filename || req.query?.file || req.get('x-minecraft-filename') || dispositionMatch?.[1] || '')
  if (!fileName.endsWith('.jar')) {
    const error = new Error('Uploaded mod must be a .jar file')
    error.statusCode = 400
    throw error
  }
  return fileName
}

function looksLikeJar(buffer) {
  return buffer.length >= 4
    && buffer[0] === 0x50
    && buffer[1] === 0x4b
    && [0x03, 0x05, 0x07].includes(buffer[2])
}

function readRequestBuffer(req, maxBytes) {
  if (Buffer.isBuffer(req.body)) return Promise.resolve(req.body)
  if (req.body !== undefined && req.body !== null) {
    return Promise.reject(httpError('Mod upload must be sent as raw jar bytes', 415))
  }

  return new Promise((resolve, reject) => {
    const chunks = []
    let total = 0
    let settled = false

    const finish = (error, value) => {
      if (settled) return
      settled = true
      if (error) reject(error)
      else resolve(value)
    }

    req.on('data', (chunk) => {
      total += chunk.length
      if (total > maxBytes) {
        finish(httpError(`Mod upload exceeds ${formatBytes(maxBytes)}`, 413, 'MOD_UPLOAD_TOO_LARGE'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.once('end', () => finish(null, Buffer.concat(chunks)))
    req.once('error', finish)
  })
}

async function installUploadedMod(server, req) {
  const filename = getUploadFileName(req)
  const bytes = await readRequestBuffer(req, MOD_UPLOAD_MAX_BYTES)
  if (!bytes.length) throw httpError('Uploaded mod file was empty', 400)
  if (!looksLikeJar(bytes)) throw httpError('Uploaded mod is not a valid jar archive', 400)

  const modsPath = path.join(server.root, 'mods')
  await fsp.mkdir(modsPath, { recursive: true })
  const tempName = `.upload-${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${filename}`
  const tempPath = resolveModFilePath(server, tempName)

  try {
    await fsp.writeFile(tempPath, bytes)
    const modJson = await readFabricModJson(tempPath)
    if (!modJson?.id) {
      throw httpError('Uploaded jar does not contain fabric.mod.json', 400)
    }

    const targetPath = resolveModFilePath(server, filename)
    let backupFile = null
    if (await exists(targetPath)) {
      backupFile = `${filename}.bak.${Date.now()}`
      await fsp.rename(targetPath, resolveModFilePath(server, backupFile))
    }

    await fsp.rename(tempPath, targetPath)
    const stat = await fsp.stat(targetPath)
    return {
      file: filename,
      backupFile,
      mod: {
        id: modJson.id || filename.replace(/\.jar$/, ''),
        name: modJson.name || modJson.id || filename,
        file: filename,
        enabled: true,
        version: String(modJson.version || ''),
        latestVersion: String(modJson.version || ''),
        updateAvailable: false,
        required: false,
        size: formatBytes(stat.size),
        updatedAt: stat.mtime.toISOString(),
      },
      restartRequired: true,
    }
  } catch (error) {
    await fsp.rm(tempPath, { force: true }).catch(() => {})
    throw error
  }
}

async function restoreModBackup(server, backupFile) {
  const backupName = safeBasename(backupFile)
  const backupPath = resolveModFilePath(server, backupName)
  const match = backupName.match(/^(.*?\.jar(?:\.disabled)?)\.bak\.\d+$/)
  if (!match) {
    const error = new Error('Invalid mod backup file')
    error.statusCode = 400
    throw error
  }
  if (!(await exists(backupPath))) {
    const error = new Error('Mod backup not found')
    error.statusCode = 404
    throw error
  }

  const targetPath = resolveModFilePath(server, match[1])
  let replacedFile = null
  if (await exists(targetPath)) {
    replacedFile = `${path.basename(targetPath)}.replaced.${Date.now()}`
    await fsp.rename(targetPath, resolveModFilePath(server, replacedFile))
  }
  await fsp.rename(backupPath, targetPath)

  return {
    file: path.basename(targetPath),
    restoredFrom: backupName,
    replacedFile,
    restartRequired: true,
  }
}

async function deleteModBackup(server, backupFile) {
  const backupName = safeBasename(backupFile)
  if (!/\.jar(\.disabled)?\.bak\.\d+$/.test(backupName)) {
    const error = new Error('Invalid mod backup file')
    error.statusCode = 400
    throw error
  }
  const backupPath = resolveModFilePath(server, backupName)
  if (!(await exists(backupPath))) {
    const error = new Error('Mod backup not found')
    error.statusCode = 404
    throw error
  }
  await fsp.rm(backupPath, { force: false })
  return { file: backupName }
}

async function searchModrinthProjects(server, query, limit = 8) {
  const facets = [
    ['project_type:mod'],
    [`categories:${server.loader || 'fabric'}`],
    [`versions:${getModrinthGameVersion(server)}`],
    ['server_side:required', 'server_side:optional'],
  ]
  const params = new URLSearchParams({
    query,
    facets: JSON.stringify(facets),
    index: 'relevance',
    limit: String(Math.min(Math.max(Number(limit) || 8, 1), 20)),
  })
  const payload = await modrinthJson(`${MODRINTH_API_ROOT}/search?${params}`)
  const hits = Array.isArray(payload.hits) ? payload.hits : []
  return hits.map((hit) => ({
    projectId: hit.project_id,
    slug: hit.slug,
    title: hit.title,
    description: hit.description,
    author: hit.author,
    downloads: hit.downloads,
    follows: hit.follows,
    iconUrl: hit.icon_url,
    serverSide: hit.server_side,
    clientSide: hit.client_side,
    categories: hit.display_categories || hit.categories || [],
    latestVersion: hit.latest_version,
    href: `https://modrinth.com/mod/${hit.slug || hit.project_id}`,
  }))
}

async function getInstallVersion(server, projectId, versionId) {
  const versions = await getModrinthProjectVersions(server, projectId)
  if (!Array.isArray(versions) || !versions.length) return null
  if (!versionId) return versions[0]
  return versions.find((version) => version.id === versionId) || null
}

function sha1Buffer(buffer) {
  return crypto.createHash('sha1').update(buffer).digest('hex')
}

async function installModrinthMod(server, projectId, versionId) {
  const version = await getInstallVersion(server, projectId, versionId)
  const file = getPrimaryVersionFile(version)
  if (!version || !file?.url || !file.filename) {
    const error = new Error('No compatible Modrinth version was found for this server')
    error.statusCode = 404
    throw error
  }

  const filename = safeBasename(file.filename)
  if (!filename.endsWith('.jar')) {
    const error = new Error('Selected Modrinth file is not a jar')
    error.statusCode = 400
    throw error
  }

  const modsPath = path.join(server.root, 'mods')
  const targetPath = path.join(modsPath, filename)
  if (await exists(targetPath)) {
    const error = new Error(`Mod file already exists: ${filename}`)
    error.statusCode = 409
    throw error
  }

  const response = await fetch(file.url, {
    headers: { 'User-Agent': MODRINTH_USER_AGENT },
  })
  if (!response.ok) {
    const error = new Error(`Modrinth download failed: ${response.status}`)
    error.statusCode = 502
    throw error
  }

  const bytes = Buffer.from(await response.arrayBuffer())
  if (file.hashes?.sha1 && sha1Buffer(bytes) !== file.hashes.sha1) {
    const error = new Error('Downloaded mod did not match the Modrinth SHA1 hash')
    error.statusCode = 502
    throw error
  }

  await fsp.mkdir(modsPath, { recursive: true })
  const tempPath = path.join(modsPath, `${filename}.download`)
  await fsp.writeFile(tempPath, bytes)
  await fsp.rename(tempPath, targetPath)

  const modJson = await readFabricModJson(targetPath)
  const dependencies = dependencySummary(version)
  return {
    mod: {
      id: modJson?.id || version.project_id || projectId,
      name: modJson?.name || version.name || filename,
      file: filename,
      enabled: true,
      version: String(modJson?.version || version.version_number || ''),
      latestVersion: String(version.version_number || ''),
      updateAvailable: false,
      required: false,
      size: formatBytes(bytes.length),
      updatedAt: new Date().toISOString(),
      modrinthProjectId: version.project_id,
      modrinthVersionId: version.id,
      ...dependencies,
    },
    versionId: version.id,
    versionNumber: version.version_number,
    file: filename,
    ...dependencies,
    restartRequired: true,
  }
}

async function updateModrinthMod(server, mod, knownCandidate = null) {
  const candidate = knownCandidate || await getModrinthCandidate(server, mod)
  if (!candidate || !candidate.updateAvailable) {
    const error = new Error('No Modrinth update found for this mod')
    error.statusCode = 404
    throw error
  }

  const filename = safeBasename(candidate.filename)
  if (!filename.endsWith('.jar')) {
    const error = new Error('Selected Modrinth update is not a jar')
    error.statusCode = 400
    throw error
  }

  const modsPath = path.join(server.root, 'mods')
  const source = path.join(modsPath, mod.file)
  if (!(await exists(source))) {
    const error = new Error('Mod file not found')
    error.statusCode = 404
    throw error
  }

  const targetPath = path.join(modsPath, mod.enabled ? filename : `${filename}.disabled`)
  if (path.resolve(targetPath) !== path.resolve(source) && await exists(targetPath)) {
    const error = new Error(`Target mod file already exists: ${path.basename(targetPath)}`)
    error.statusCode = 409
    throw error
  }

  const download = await fetch(candidate.downloadUrl, {
    headers: { 'User-Agent': MODRINTH_USER_AGENT },
  })
  if (!download.ok) {
    const error = new Error(`Modrinth download failed: ${download.status}`)
    error.statusCode = 502
    throw error
  }

  const bytes = Buffer.from(await download.arrayBuffer())
  if (candidate.sha1 && sha1Buffer(bytes) !== candidate.sha1) {
    const error = new Error('Downloaded mod did not match the Modrinth SHA1 hash')
    error.statusCode = 502
    throw error
  }

  const tempPath = path.join(modsPath, `${filename}.download`)
  const backupPath = `${source}.bak.${Date.now()}`
  await fsp.writeFile(tempPath, bytes)
  await fsp.rename(source, backupPath)
  await fsp.rename(tempPath, targetPath)

  return {
    ok: true,
    file: path.basename(targetPath),
    previousFile: mod.file,
    backupFile: path.basename(backupPath),
    latestVersion: candidate.latestVersion,
    dependencies: candidate.dependencies || [],
    dependencyCount: candidate.dependencyCount || 0,
    requiredDependencyCount: candidate.requiredDependencyCount || 0,
    optionalDependencyCount: candidate.optionalDependencyCount || 0,
    restartRequired: true,
  }
}

async function updateAllModrinthMods(server) {
  const mods = await listMods(server, { includeHashes: true })
  const results = []

  for (const mod of mods) {
    try {
      const candidate = await getModrinthCandidate(server, mod)
      if (!candidate?.updateAvailable) {
        results.push({
          file: mod.file,
          name: mod.name,
          status: candidate ? 'current' : 'not-found',
        })
        continue
      }

      const update = await updateModrinthMod(server, mod, candidate)
      results.push({
        ...update,
        name: mod.name,
        status: 'updated',
      })
    } catch (error) {
      results.push({
        file: mod.file,
        name: mod.name,
        status: 'error',
        message: error.message,
      })
    }
  }

  return {
    results,
    updated: results.filter((result) => result.status === 'updated'),
    failed: results.filter((result) => result.status === 'error'),
    skipped: results.filter((result) => !['updated', 'error'].includes(result.status)),
  }
}

async function getPlayers(server) {
  const [whitelist, ops, bannedPlayers, bannedIps, usercache] = await Promise.all([
    readJson(path.join(server.root, 'whitelist.json'), []),
    readJson(path.join(server.root, 'ops.json'), []),
    readJson(path.join(server.root, 'banned-players.json'), []),
    readJson(path.join(server.root, 'banned-ips.json'), []),
    readJson(path.join(server.root, 'usercache.json'), []),
  ])

  let onlinePlayers = []
  if (await isTcpOpen(server.rconPort)) {
    try {
      onlinePlayers = parseRconList(await sendRconCommand(server, 'list')).onlinePlayers
    } catch {
      onlinePlayers = []
    }
  }

  const byName = new Map()
  const add = (entry, data = {}) => {
    if (!entry?.name) return
    byName.set(entry.name.toLowerCase(), {
      uuid: entry.uuid || data.uuid || '',
      name: entry.name,
      online: onlinePlayers.includes(entry.name),
      whitelisted: false,
      op: false,
      banned: false,
      permission: 'Guest',
      lastSeen: entry.expiresOn || entry.created || data.lastSeen || 'Unknown',
      ...byName.get(entry.name.toLowerCase()),
      ...data,
    })
  }

  usercache.forEach((entry) => add(entry, { lastSeen: entry.expiresOn || 'Cached' }))
  whitelist.forEach((entry) => add(entry, { whitelisted: true, permission: 'Member' }))
  ops.forEach((entry) => add(entry, {
    op: true,
    whitelisted: true,
    permission: `OP ${entry.level || 4}`,
    opLevel: Number(entry.level || 4),
    bypassesPlayerLimit: entry.bypassesPlayerLimit === true,
  }))
  bannedPlayers.forEach((entry) => add(entry, { banned: true, whitelisted: false, op: false, permission: 'Banned' }))
  onlinePlayers.forEach((name) => add({ name }, { online: true }))

  return {
    players: Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name)),
    whitelist,
    ops,
    bannedPlayers,
    bannedIps,
  }
}

async function updateOpSettings(server, playerName, settings) {
  const level = safeOpLevel(settings.level)
  const bypassesPlayerLimit = settings.bypassesPlayerLimit === true
  const [ops, whitelist, usercache] = await Promise.all([
    readJson(path.join(server.root, 'ops.json'), []),
    readJson(path.join(server.root, 'whitelist.json'), []),
    readJson(path.join(server.root, 'usercache.json'), []),
  ])

  const lowerName = playerName.toLowerCase()
  const existingIndex = ops.findIndex((entry) => entry.name?.toLowerCase() === lowerName)
  const existing = existingIndex === -1 ? null : ops[existingIndex]
  const knownEntry = existing
    || whitelist.find((entry) => entry.name?.toLowerCase() === lowerName)
    || usercache.find((entry) => entry.name?.toLowerCase() === lowerName)

  if (!knownEntry?.uuid) {
    const error = new Error('Player UUID is required before OP settings can be edited')
    error.statusCode = 400
    throw error
  }

  const nextEntry = {
    uuid: knownEntry.uuid,
    name: knownEntry.name || playerName,
    level,
    bypassesPlayerLimit,
  }
  const nextOps = existingIndex === -1
    ? [...ops, nextEntry]
    : ops.map((entry, index) => (index === existingIndex ? nextEntry : entry))

  await writeJson(path.join(server.root, 'ops.json'), nextOps)

  let output = ''
  if (await isTcpOpen(server.rconPort)) {
    output = 'ops.json updated; restart required for custom OP level and bypass changes to apply to the running server.'
  }

  return {
    player: nextEntry,
    ops: nextOps,
    output,
    restartRequired: true,
  }
}

async function listWorlds(server) {
  const properties = await readProperties(server)
  const activeWorld = properties['level-name'] || ''
  const worldsPath = path.join(server.root, 'worlds')
  let entries = []
  try {
    entries = await fsp.readdir(worldsPath, { withFileTypes: true })
  } catch {
    return []
  }

  return Promise.all(entries
    .filter((entry) => entry.isDirectory())
    .map(async (entry) => {
      const fullPath = path.join(worldsPath, entry.name)
      const stat = await fsp.stat(fullPath)
      return {
        id: entry.name,
        name: entry.name,
        path: `worlds/${entry.name}`,
        active: activeWorld === `worlds/${entry.name}` || activeWorld === entry.name,
        size: formatBytes(await getDirectoryBytes(fullPath)),
        updatedAt: stat.mtime.toISOString(),
        hasDatapacks: await exists(path.join(fullPath, 'datapacks')),
      }
    }))
}

function resolveContainedPath(root, name, label) {
  const base = path.resolve(root)
  const target = path.resolve(base, name)
  if (target === base || !target.startsWith(`${base}${path.sep}`)) {
    const error = new Error(`Invalid ${label} path`)
    error.statusCode = 400
    throw error
  }
  return target
}

function resolveWorldPath(server, worldId) {
  return resolveContainedPath(path.join(server.root, 'worlds'), safeWorldId(worldId), 'world')
}

function resolveBackupPath(server, backupId) {
  return resolveContainedPath(path.join(BACKUP_ROOT, server.id), safeBackupId(backupId), 'backup')
}

function archiveFileName(server, label) {
  const stamp = new Date().toISOString().slice(0, 10)
  const clean = String(label || 'archive')
    .replace(/[^A-Za-z0-9_.-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 120) || 'archive'
  return `minecraft-${server.id}-${clean}-${stamp}.tar.gz`
}

async function streamArchive(res, sourcePath, filename) {
  const stat = await fsp.stat(sourcePath).catch(() => null)
  if (!stat) throw httpError('Archive source not found', 404)

  const parent = path.dirname(sourcePath)
  const base = path.basename(sourcePath)
  res.set({
    'Content-Type': 'application/gzip',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'no-store',
  })

  await new Promise((resolve, reject) => {
    const child = spawn('tar', ['-czf', '-', '-C', parent, '--', base], {
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stderr = ''
    let settled = false

    const finish = (error) => {
      if (settled) return
      settled = true
      if (error) reject(error)
      else resolve()
    }

    child.stdout.pipe(res)
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf8')
    })
    child.on('error', (error) => {
      if (!res.headersSent) {
        error.statusCode = error.code === 'ENOENT' ? 501 : 500
      }
      finish(error)
    })
    child.on('close', (code) => {
      if (code === 0) {
        finish()
        return
      }
      const error = httpError(stderr.trim() || `tar exited with code ${code}`, 500, 'ARCHIVE_FAILED')
      finish(error)
    })
    res.on('close', () => {
      if (!settled && !child.killed) {
        child.kill('SIGTERM')
      }
    })
  })
}

async function getActiveWorldId(server) {
  const properties = await readProperties(server)
  const activeWorld = properties['level-name'] || ''
  if (activeWorld.startsWith('worlds/')) return activeWorld.slice('worlds/'.length)
  return activeWorld
}

async function runScript(scriptName, args) {
  const scriptPath = path.join(SCRIPT_ROOT, scriptName)
  if (!(await exists(scriptPath))) {
    const error = new Error(`Required Minecraft script not found: ${scriptPath}`)
    error.statusCode = 501
    throw error
  }
  return execFileAsync(scriptPath, args, { timeout: 1000 * 60 * 10, maxBuffer: 1024 * 1024 * 16 })
}

router.get('/health', (req, res) => {
  res.json({
    ok: true,
    root: MINECRAFT_ROOT,
    servers: Object.keys(serverRegistry),
    registryWarnings,
    timestamp: new Date().toISOString(),
  })
})

router.use(requireAuth)

router.use((req, res, next) => {
  const startedAt = Date.now()
  const originalJson = res.json.bind(res)

  res.json = (body) => {
    const entry = buildActivityEntry(req, body, Date.now() - startedAt)
    if (entry && res.statusCode < 400) {
      if (body && typeof body === 'object' && !Array.isArray(body)) {
        body.activityEntry = entry
      }
      appendActivity(entry).catch((error) => {
        console.warn(`[minecraft-activity] ${error.message}`)
      })
    }
    return originalJson(body)
  }

  next()
})

router.get('/servers', asyncRoute(async (req, res) => {
  const servers = await Promise.all(Object.values(serverRegistry).map(getServerPayload))
  res.json({ servers })
}))

router.get('/servers/:id', asyncRoute(async (req, res) => {
  const server = getServer(req)
  const [payload, worlds, players, backups] = await Promise.all([
    getServerPayload(server),
    listWorlds(server),
    getPlayers(server),
    listBackups(server),
  ])
  res.json({
    server: {
      ...payload,
      worlds,
      players: players.players,
      whitelist: players.whitelist,
      ops: players.ops,
      bannedPlayers: players.bannedPlayers,
      bannedIps: players.bannedIps,
      backups,
    },
  })
}))

router.get('/servers/:id/icon', asyncRoute(async (req, res) => {
  const server = getServer(req)
  const { iconPath, stat } = await resolveServerIcon(server, req.query.variant)
  const etag = `W/"minecraft-icon-${server.id}-${stat.size}-${Math.trunc(stat.mtimeMs)}"`
  res.set({
    'Content-Type': 'image/png',
    'Cache-Control': `private, max-age=${ICON_CACHE_SECONDS}`,
    'Last-Modified': stat.mtime.toUTCString(),
    ETag: etag,
  })

  if (req.fresh) {
    res.status(304).end()
    return
  }

  res.send(await fsp.readFile(iconPath))
}))

router.get('/servers/:id/status', asyncRoute(async (req, res) => {
  res.json({ status: await getLifecycleStatus(getServer(req)) })
}))

router.get('/servers/:id/properties', asyncRoute(async (req, res) => {
  res.json({ settings: await getServerSettings(getServer(req)) })
}))

router.get('/servers/:id/diagnostics', asyncRoute(async (req, res) => {
  res.json({ diagnostics: await getServerDiagnostics(getServer(req)) })
}))

router.get('/servers/:id/maintenance', asyncRoute(async (req, res) => {
  res.json({ maintenance: await getMaintenanceState(getServer(req)) })
}))

router.patch('/servers/:id/properties', asyncRoute(async (req, res) => {
  const server = getServer(req)
  requireConfirmation(req, 'Updating server properties requires confirmation')
  const result = await updateServerSettings(server, req.body?.settings || req.body)
  res.json({ ok: true, ...result })
}))

router.post('/servers/:id/wake', asyncRoute(async (req, res) => {
  const server = getServer(req)
  await wakeProbe(server)
  const ready = await waitForPort(server.rconPort, true, WAKE_TIMEOUT_MS)
  if (!ready) {
    throw httpError(`RCON did not become available for ${server.label} within ${Math.round(WAKE_TIMEOUT_MS / 1000)} seconds`, 504, 'RCON_WAKE_TIMEOUT')
  }
  res.json({ ok: true, wokeServer: true, server: await getServerPayload(server) })
}))

router.post('/servers/:id/start', asyncRoute(async (req, res) => {
  const server = getServer(req)
  await wakeProbe(server)
  const ready = await waitForPort(server.rconPort, true, WAKE_TIMEOUT_MS)
  if (!ready) {
    throw httpError(`RCON did not become available for ${server.label} within ${Math.round(WAKE_TIMEOUT_MS / 1000)} seconds`, 504, 'RCON_WAKE_TIMEOUT')
  }
  res.json({ ok: true, wokeServer: true, server: await getServerPayload(server) })
}))

router.post('/servers/:id/sleep', asyncRoute(async (req, res) => {
  const server = getServer(req)
  requireConfirmation(req, 'Sleeping a server requires confirmation')
  if (await isTcpOpen(server.rconPort)) {
    await sendRconCommand(server, 'stop')
    const stopped = await waitForPort(server.rconPort, false, 45000)
    if (!stopped) throw httpError(`RCON did not close for ${server.label} after stop`, 504, 'RCON_STOP_TIMEOUT')
  }
  res.json({ ok: true, server: await getServerPayload(server) })
}))

router.post('/servers/:id/stop', asyncRoute(async (req, res) => {
  const server = getServer(req)
  requireConfirmation(req, 'Stopping a server requires confirmation')
  if (await isTcpOpen(server.rconPort)) {
    await sendRconCommand(server, 'stop')
    const stopped = await waitForPort(server.rconPort, false, 45000)
    if (!stopped) throw httpError(`RCON did not close for ${server.label} after stop`, 504, 'RCON_STOP_TIMEOUT')
  }
  res.json({ ok: true, server: await getServerPayload(server) })
}))

router.post('/servers/:id/restart', asyncRoute(async (req, res) => {
  const server = getServer(req)
  requireConfirmation(req, 'Restarting a server requires confirmation')
  if (await isTcpOpen(server.rconPort)) {
    await sendRconCommand(server, 'stop')
    const stopped = await waitForPort(server.rconPort, false, 45000)
    if (!stopped) throw httpError(`RCON did not close for ${server.label} after stop`, 504, 'RCON_STOP_TIMEOUT')
  }
  await wakeProbe(server)
  const ready = await waitForPort(server.rconPort, true, WAKE_TIMEOUT_MS)
  if (!ready) {
    throw httpError(`RCON did not become available for ${server.label} within ${Math.round(WAKE_TIMEOUT_MS / 1000)} seconds`, 504, 'RCON_WAKE_TIMEOUT')
  }
  res.json({ ok: true, wokeServer: true, server: await getServerPayload(server) })
}))

router.post('/servers/:id/command', asyncRoute(async (req, res) => {
  const server = getServer(req)
  const command = String(req.body?.command || '').trim()
  if (!command) {
    return res.status(400).json({ message: 'Command is required' })
  }

  const firstWord = command.split(/\s+/)[0].toLowerCase()
  if (destructiveCommands.has(firstWord)) {
    requireConfirmation(req, `Command '${firstWord}' requires confirmation`)
  }

  const readiness = await ensureRconAvailable(server, { wake: req.body?.wake !== false })

  const output = await sendRconCommand(server, command)
  res.json({ ok: true, command, output, wokeServer: readiness.wokeServer, timestamp: new Date().toISOString() })
}))

router.get('/servers/:id/commands', asyncRoute(async (req, res) => {
  getServer(req)
  res.json({ commands: getAllowedCommands() })
}))

router.get('/servers/:id/logs', asyncRoute(async (req, res) => {
  const server = getServer(req)
  res.json(await readLogSelection(server, {
    file: req.query.file,
    lines: req.query.lines,
    tail: req.query.tail,
    query: req.query.query,
  }))
}))

router.get('/servers/:id/logs/export', asyncRoute(async (req, res) => {
  const server = getServer(req)
  const selection = await readLogSelection(server, {
    file: req.query.file,
    lines: req.query.lines,
    tail: req.query.tail,
    query: req.query.query,
  })
  const filename = getLogExportFilename(server, selection)

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(renderLogExport(server, selection))
}))

router.get('/servers/:id/log-files', asyncRoute(async (req, res) => {
  res.json({ files: await listLogFiles(getServer(req)) })
}))

router.get('/servers/:id/activity', asyncRoute(async (req, res) => {
  const server = getServer(req)
  const activity = await listActivity(server, req.query.limit)
  res.json({
    activity,
    restartRequired: getPendingRestart(activity).length > 0,
    restartReasons: getPendingRestart(activity),
  })
}))

router.get('/servers/:id/mods', asyncRoute(async (req, res) => {
  res.json({ mods: await listMods(getServer(req)) })
}))

router.get('/servers/:id/mods/backups', asyncRoute(async (req, res) => {
  res.json({ backups: await listModBackups(getServer(req)) })
}))

router.post('/servers/:id/mods/check-updates', asyncRoute(async (req, res) => {
  res.json({ mods: await listModsWithUpdates(getServer(req)) })
}))

router.get('/servers/:id/mods/search', asyncRoute(async (req, res) => {
  const query = String(req.query.query || req.query.q || '').trim()
  if (!query) return res.status(400).json({ message: 'Search query is required' })
  res.json({
    results: await searchModrinthProjects(getServer(req), query, req.query.limit),
  })
}))

router.post('/servers/:id/mods/install', asyncRoute(async (req, res) => {
  const server = getServer(req)
  requireConfirmation(req, 'Installing a mod requires confirmation')
  const projectId = String(req.body?.projectId || req.body?.slug || '').trim()
  const versionId = String(req.body?.versionId || '').trim()
  if (!projectId) return res.status(400).json({ message: 'projectId or slug is required' })
  res.json({
    ok: true,
    ...(await installModrinthMod(server, projectId, versionId || null)),
  })
}))

router.post('/servers/:id/mods/upload', asyncRoute(async (req, res) => {
  const server = getServer(req)
  requireConfirmation(req, 'Uploading a mod jar requires confirmation')
  res.json({
    ok: true,
    ...(await installUploadedMod(server, req)),
  })
}))

router.post('/servers/:id/mods/update-all', asyncRoute(async (req, res) => {
  const server = getServer(req)
  requireConfirmation(req, 'Updating all available mods requires confirmation')
  const result = await updateAllModrinthMods(server)
  res.json({
    ok: result.failed.length === 0,
    ...result,
    restartRequired: result.updated.length > 0,
  })
}))

router.post('/servers/:id/mods/backups/:backupFile/restore', asyncRoute(async (req, res) => {
  const server = getServer(req)
  requireConfirmation(req, 'Restoring a mod backup requires confirmation')
  res.json({
    ok: true,
    ...(await restoreModBackup(server, req.params.backupFile)),
  })
}))

router.delete('/servers/:id/mods/backups/:backupFile', asyncRoute(async (req, res) => {
  const server = getServer(req)
  requireConfirmation(req, 'Deleting a mod backup requires confirmation')
  res.json({
    ok: true,
    ...(await deleteModBackup(server, req.params.backupFile)),
  })
}))

router.post('/servers/:id/mods/:file/enable', asyncRoute(async (req, res) => {
  const server = getServer(req)
  const file = safeBasename(req.params.file)
  const source = path.join(server.root, 'mods', file)
  const target = source.endsWith('.disabled') ? source.replace(/\.disabled$/, '') : `${source.replace(/\.jar$/, '')}.jar`
  if (!(await exists(source))) return res.status(404).json({ message: 'Mod file not found' })
  await fsp.rename(source, target)
  res.json({ ok: true, file: path.basename(target), enabled: true, restartRequired: true })
}))

router.post('/servers/:id/mods/:file/disable', asyncRoute(async (req, res) => {
  const server = getServer(req)
  requireConfirmation(req, 'Disabling a mod requires confirmation')
  const file = safeBasename(req.params.file)
  const source = path.join(server.root, 'mods', file)
  const target = source.endsWith('.disabled') ? source : `${source}.disabled`
  if (!(await exists(source))) return res.status(404).json({ message: 'Mod file not found' })
  await fsp.rename(source, target)
  res.json({ ok: true, file: path.basename(target), enabled: false, restartRequired: true })
}))

router.post('/servers/:id/mods/:file/update', asyncRoute(async (req, res) => {
  const server = getServer(req)
  requireConfirmation(req, 'Updating a mod requires confirmation')
  const file = safeBasename(req.params.file)
  const mod = (await listMods(server, { includeHashes: true })).find((entry) => entry.file === file)
  if (!mod) return res.status(404).json({ message: 'Mod metadata not found' })
  res.json({
    ...(await updateModrinthMod(server, mod)),
  })
}))

router.get('/servers/:id/players', asyncRoute(async (req, res) => {
  res.json(await getPlayers(getServer(req)))
}))

router.get('/servers/:id/whitelist', asyncRoute(async (req, res) => {
  const players = await getPlayers(getServer(req))
  res.json({
    whitelist: players.whitelist,
    players: players.players.filter((player) => player.whitelisted),
  })
}))

router.get('/servers/:id/ops', asyncRoute(async (req, res) => {
  const players = await getPlayers(getServer(req))
  res.json({
    ops: players.ops,
    players: players.players.filter((player) => player.op),
  })
}))

router.get('/servers/:id/bans', asyncRoute(async (req, res) => {
  const players = await getPlayers(getServer(req))
  res.json({
    bannedPlayers: players.bannedPlayers,
    bannedIps: players.bannedIps,
    players: players.players.filter((player) => player.banned),
  })
}))

router.post('/servers/:id/players/:playerName/:action', asyncRoute(async (req, res) => {
  const server = getServer(req)
  const playerName = safePlayerName(req.params.playerName)
  const action = String(req.params.action || '').trim().toLowerCase()
  const allowed = new Set(['ban', 'pardon', 'kick', 'op', 'deop'])
  if (!playerName || !allowed.has(action)) {
    return res.status(400).json({ message: 'Invalid player action' })
  }
  requireConfirmation(req, `Player action '${action}' requires confirmation`)
  const readiness = await ensureRconAvailable(server, { wake: req.body?.wake !== false })

  const reason = safeCommandReason(req.body?.reason)
  const command = reason && ['ban', 'kick'].includes(action)
    ? `${action} ${playerName} ${reason}`
    : `${action} ${playerName}`
  const output = await sendRconCommand(server, command)
  res.json({ ok: true, playerName, action, output, wokeServer: readiness.wokeServer, timestamp: new Date().toISOString() })
}))

router.patch('/servers/:id/players/:playerName/op-settings', asyncRoute(async (req, res) => {
  const server = getServer(req)
  const playerName = safePlayerName(req.params.playerName)
  requireConfirmation(req, 'Updating OP settings requires confirmation')
  const result = await updateOpSettings(server, playerName, {
    level: req.body?.level,
    bypassesPlayerLimit: req.body?.bypassesPlayerLimit,
  })
  res.json({
    ok: true,
    playerName,
    ...result,
    timestamp: new Date().toISOString(),
  })
}))

router.post('/servers/:id/whitelist/:action', asyncRoute(async (req, res) => {
  const server = getServer(req)
  const playerName = safePlayerName(req.body?.playerName)
  const action = String(req.params.action || '').trim().toLowerCase()
  if (!playerName || !['add', 'remove'].includes(action)) {
    return res.status(400).json({ message: 'Invalid whitelist request' })
  }
  if (action === 'remove') {
    requireConfirmation(req, 'Removing a player from whitelist requires confirmation')
  }
  const readiness = await ensureRconAvailable(server, { wake: req.body?.wake !== false })

  const output = await sendRconCommand(server, `whitelist ${action} ${playerName}`)
  res.json({ ok: true, playerName, action, output, wokeServer: readiness.wokeServer, timestamp: new Date().toISOString() })
}))

router.post('/servers/:id/blacklist/player/:action', asyncRoute(async (req, res) => {
  const server = getServer(req)
  const playerName = safePlayerName(req.body?.playerName)
  const action = String(req.params.action || '').trim().toLowerCase()
  if (!['add', 'remove'].includes(action)) {
    return res.status(400).json({ message: 'Invalid player blacklist action' })
  }
  requireConfirmation(req, 'Changing the player blacklist requires confirmation')
  const readiness = await ensureRconAvailable(server, { wake: req.body?.wake !== false })

  const reason = safeCommandReason(req.body?.reason)
  const command = action === 'add'
    ? `ban ${playerName}${reason ? ` ${reason}` : ''}`
    : `pardon ${playerName}`
  const output = await sendRconCommand(server, command)
  res.json({
    ok: true,
    playerName,
    action,
    output,
    wokeServer: readiness.wokeServer,
    timestamp: new Date().toISOString(),
  })
}))

router.post('/servers/:id/blacklist/ip/:action', asyncRoute(async (req, res) => {
  const server = getServer(req)
  const target = safeIpBanTarget(req.body?.target || req.body?.ip)
  const action = String(req.params.action || '').trim().toLowerCase()
  if (!['add', 'remove'].includes(action)) {
    return res.status(400).json({ message: 'Invalid IP blacklist action' })
  }
  requireConfirmation(req, 'Changing the IP blacklist requires confirmation')
  const readiness = await ensureRconAvailable(server, { wake: req.body?.wake !== false })

  const reason = safeCommandReason(req.body?.reason)
  const command = action === 'add'
    ? `ban-ip ${target}${reason ? ` ${reason}` : ''}`
    : `pardon-ip ${target}`
  const output = await sendRconCommand(server, command)
  res.json({
    ok: true,
    target,
    action,
    output,
    wokeServer: readiness.wokeServer,
    timestamp: new Date().toISOString(),
  })
}))

router.get('/servers/:id/worlds', asyncRoute(async (req, res) => {
  res.json({ worlds: await listWorlds(getServer(req)) })
}))

router.get('/servers/:id/worlds/:worldId/download', asyncRoute(async (req, res) => {
  const server = getServer(req)
  const worldId = safeWorldId(req.params.worldId)
  await streamArchive(res, resolveWorldPath(server, worldId), archiveFileName(server, `world-${worldId}`))
}))

router.post('/servers/:id/worlds/switch', asyncRoute(async (req, res) => {
  const server = getServer(req)
  requireConfirmation(req, 'Switching worlds requires confirmation')
  const worldId = safeWorldId(req.body?.worldId)
  if (!(await exists(resolveWorldPath(server, worldId)))) return res.status(404).json({ message: 'World not found' })

  if (await exists(path.join(SCRIPT_ROOT, 'switch-server.sh'))) {
    const { stdout, stderr } = await runScript('switch-server.sh', [server.id, worldId])
    return res.json({ ok: true, worldId, output: stdout || stderr, restartRequired: true })
  }

  await setServerProperty(server, 'level-name', `worlds/${worldId}`)
  res.json({ ok: true, worldId, restartRequired: true })
}))

router.post('/servers/:id/worlds/new', asyncRoute(async (req, res) => {
  const server = getServer(req)
  requireConfirmation(req, 'Creating a new world requires confirmation')
  const worldId = safeWorldId(req.body?.name || req.body?.worldId || `world-${Date.now()}`)
  const worldPath = resolveWorldPath(server, worldId)
  if (await exists(worldPath)) return res.status(409).json({ message: 'World already exists' })

  let output = ''
  if (await exists(path.join(SCRIPT_ROOT, 'new-world.sh'))) {
    const result = await runScript('new-world.sh', [server.id, worldId])
    output = result.stdout || result.stderr
  } else {
    await fsp.mkdir(worldPath, { recursive: true })
    await setServerProperty(server, 'level-name', `worlds/${worldId}`)
  }

  res.json({
    ok: true,
    world: {
      id: worldId,
      name: worldId,
      path: `worlds/${worldId}`,
      active: false,
      size: 'Pending',
      updatedAt: new Date().toISOString(),
    },
    output,
    restartRequired: true,
  })
}))

router.delete('/servers/:id/worlds/:worldId', asyncRoute(async (req, res) => {
  const server = getServer(req)
  requireConfirmation(req, 'Deleting a world requires confirmation')
  const worldId = safeWorldId(req.params.worldId)
  const activeWorldId = await getActiveWorldId(server)
  if (activeWorldId === worldId) {
    return res.status(409).json({ message: 'Cannot delete the active world. Switch worlds first.' })
  }

  const worldPath = resolveWorldPath(server, worldId)
  if (!(await exists(worldPath))) return res.status(404).json({ message: 'World not found' })
  await fsp.rm(worldPath, { recursive: true, force: false })
  res.json({ ok: true, worldId, deletedAt: new Date().toISOString() })
}))

router.get('/servers/:id/backups', asyncRoute(async (req, res) => {
  res.json({ backups: await listBackups(getServer(req)) })
}))

router.get('/servers/:id/backups/:backupId/download', asyncRoute(async (req, res) => {
  const server = getServer(req)
  const backupId = safeBackupId(req.params.backupId)
  await streamArchive(res, resolveBackupPath(server, backupId), archiveFileName(server, `backup-${backupId}`))
}))

router.post('/servers/:id/worlds/backup', asyncRoute(async (req, res) => {
  const server = getServer(req)
  const { stdout, stderr } = await runScript('backup-world.sh', [server.id])
  res.json({ ok: true, output: stdout || stderr, timestamp: new Date().toISOString() })
}))

router.post('/servers/:id/backups/:backupId/restore', asyncRoute(async (req, res) => {
  const server = getServer(req)
  requireConfirmation(req, 'Restoring a backup requires confirmation')
  const backupId = safeBackupId(req.params.backupId)
  if (!(await exists(resolveBackupPath(server, backupId)))) return res.status(404).json({ message: 'Backup not found' })
  const { stdout, stderr } = await runScript('restore-world.sh', [server.id, backupId])
  res.json({ ok: true, backupId, output: stdout || stderr, restartRequired: true })
}))

router.delete('/servers/:id/backups/:backupId', asyncRoute(async (req, res) => {
  const server = getServer(req)
  requireConfirmation(req, 'Deleting a backup requires confirmation')
  const backupId = safeBackupId(req.params.backupId)
  const backupPath = resolveBackupPath(server, backupId)
  if (!(await exists(backupPath))) return res.status(404).json({ message: 'Backup not found' })
  await fsp.rm(backupPath, { recursive: true, force: false })
  res.json({ ok: true, backupId, deletedAt: new Date().toISOString() })
}))

router.use((error, req, res, next) => {
  if (res.headersSent) return next(error)
  const status = error.statusCode || 500
  res.status(status).json({
    message: error.message || 'Minecraft API error',
    code: error.code,
    stderr: process.env.NODE_ENV === 'development' ? error.stderr : undefined,
  })
})

router.isLogStreamRequest = isLogStreamRequest
router.handleLogStream = handleLogStream
router.isStatusStreamRequest = isStatusStreamRequest
router.handleStatusStream = handleStatusStream

module.exports = router
