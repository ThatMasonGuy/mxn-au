const now = () => new Date().toISOString()

export const MINECRAFT_SERVER_STATES = [
  'offline',
  'hibernating',
  'warming',
  'alive',
  'stopping',
  'degraded',
]

const fallbackRegistryWarnings = []

function normalizeRegistryInput(rawConfig) {
  if (!rawConfig) return []
  if (Array.isArray(rawConfig)) return rawConfig
  if (Array.isArray(rawConfig.servers)) return rawConfig.servers
  if (typeof rawConfig === 'object') {
    return Object.entries(rawConfig).map(([id, value]) => ({ id, ...value }))
  }
  return []
}

function readExtraRegistry() {
  const value = import.meta.env.VITE_MINECRAFT_SERVERS_JSON
  if (!value) return []
  try {
    return normalizeRegistryInput(JSON.parse(value))
  } catch (error) {
    fallbackRegistryWarnings.push(error.message)
    return []
  }
}

function mergeRegistry(defaults, extras) {
  const byId = new Map(defaults.map((server) => [server.id, server]))
  extras.forEach((extra) => {
    if (!extra?.id) return
    const current = byId.get(extra.id) || {}
    byId.set(extra.id, {
      ...current,
      ...extra,
      label: extra.label || extra.name || current.label || extra.id,
      loader: extra.loader || current.loader || 'Fabric',
      root: extra.root || current.root || `/mnt/storage-1/minecraft/servers/${extra.id}`,
      activeWorld: extra.activeWorld || current.activeWorld || 'worlds/world',
      profile: extra.profile || current.profile || extra.id,
      state: extra.state || current.state || 'hibernating',
      maxPlayers: extra.maxPlayers || current.maxPlayers || 20,
      modCount: extra.modCount || current.modCount || 0,
    })
  })
  return Array.from(byId.values())
}

const DEFAULT_MINECRAFT_SERVER_REGISTRY = [
  {
    id: 'hc',
    label: 'Hardcore',
    host: 'hc.play.mxn.au',
    publicPort: 25565,
    backendPort: 25665,
    rconPort: 25765,
    service: 'minecraft-hc-sleep.service',
    version: '1.21.11',
    gameVersion: '1.21.11',
    loader: 'Fabric',
    root: '/mnt/storage-1/minecraft/servers/hc',
    activeWorld: 'worlds/Hardcore_World_20',
    profile: 'hardcore',
    state: 'hibernating',
    maxPlayers: 20,
    modCount: 35,
  },
  {
    id: 'shc',
    label: 'Shared Health Hardcore',
    host: 'shc.play.mxn.au',
    publicPort: 25566,
    backendPort: 25666,
    rconPort: 25766,
    service: 'minecraft-shc-sleep.service',
    version: '1.21.11',
    gameVersion: '1.21.11',
    loader: 'Fabric',
    root: '/mnt/storage-1/minecraft/servers/shc',
    activeWorld: 'worlds/Shared_Health_Hardcore_48',
    profile: 'shared-health',
    state: 'hibernating',
    maxPlayers: 20,
    modCount: 32,
  },
  {
    id: 'mc',
    label: 'Survival',
    host: 'mc.play.mxn.au',
    publicPort: 25567,
    backendPort: 25667,
    rconPort: 25767,
    service: 'minecraft-mc-sleep.service',
    version: '26.1.2',
    gameVersion: '26.1.2',
    loader: 'Fabric',
    root: '/mnt/storage-1/minecraft/servers/mc',
    activeWorld: 'worlds/Survival_World_1',
    profile: 'survival',
    state: 'hibernating',
    maxPlayers: 20,
    modCount: 33,
  },
]

export const MINECRAFT_SERVER_REGISTRY = mergeRegistry(DEFAULT_MINECRAFT_SERVER_REGISTRY, readExtraRegistry())
export const MINECRAFT_FALLBACK_REGISTRY_WARNINGS = fallbackRegistryWarnings

const commonMods = [
  {
    id: 'fabric-api',
    name: 'Fabric API',
    file: 'fabric-api.jar',
    enabled: true,
    version: '0.132.0',
    latestVersion: '0.132.0',
    modrinthSlug: 'fabric-api',
    updateAvailable: false,
    required: true,
  },
  {
    id: 'lithium',
    name: 'Lithium',
    file: 'lithium-fabric.jar',
    enabled: true,
    version: '0.18.0',
    latestVersion: '0.18.0',
    modrinthSlug: 'lithium',
    updateAvailable: false,
    required: true,
  },
  {
    id: 'ferritecore',
    name: 'FerriteCore',
    file: 'ferritecore.jar',
    enabled: true,
    version: '8.0.0',
    latestVersion: '8.0.0',
    modrinthSlug: 'ferrite-core',
    updateAvailable: false,
    required: true,
  },
  {
    id: 'servercore',
    name: 'ServerCore',
    file: 'servercore.jar',
    enabled: true,
    version: '1.5.11',
    latestVersion: '1.5.12',
    modrinthSlug: 'servercore',
    updateAvailable: true,
    required: true,
  },
  {
    id: 'voicechat',
    name: 'Simple Voice Chat',
    file: 'voicechat.jar',
    enabled: true,
    version: '2.5.35',
    latestVersion: '2.5.35',
    modrinthSlug: 'simple-voice-chat',
    updateAvailable: false,
    required: false,
  },
]

const players = [
  {
    uuid: 'owner',
    name: 'Mason',
    online: false,
    whitelisted: true,
    op: true,
    opLevel: 4,
    bypassesPlayerLimit: true,
    banned: false,
    permission: 'Owner',
    lastSeen: 'Today',
  },
  {
    uuid: 'member-1',
    name: 'MemberOne',
    online: false,
    whitelisted: true,
    op: false,
    banned: false,
    permission: 'Member',
    lastSeen: 'This week',
  },
  {
    uuid: 'member-2',
    name: 'MemberTwo',
    online: false,
    whitelisted: true,
    op: false,
    banned: false,
    permission: 'Member',
    lastSeen: 'This week',
  },
  {
    uuid: 'member-3',
    name: 'MemberThree',
    online: false,
    whitelisted: true,
    op: false,
    banned: false,
    permission: 'Member',
    lastSeen: 'This month',
  },
]

const worldNamesByServer = {
  hc: ['Hardcore_World_20'],
  shc: [
    'Shared_Health_Hardcore_40',
    'Shared_Health_Hardcore_41',
    'Shared_Health_Hardcore_42',
    'Shared_Health_Hardcore_43',
    'Shared_Health_Hardcore_44',
    'Shared_Health_Hardcore_45',
    'Shared_Health_Hardcore_46',
    'Shared_Health_Hardcore_47',
    'Shared_Health_Hardcore_48',
  ],
  mc: ['Survival_World_1'],
}

export function getRegistryServer(serverId) {
  return MINECRAFT_SERVER_REGISTRY.find((server) => server.id === serverId) || null
}

function createFallbackIcon(serverId) {
  return {
    available: false,
    preferred: 'default',
    endpoint: `/api/minecraft/servers/${serverId}/icon`,
    frozenEndpoint: `/api/minecraft/servers/${serverId}/icon?variant=frozen`,
    updatedAt: null,
    variants: {
      default: {
        variant: 'default',
        available: false,
        file: 'server-icon.png',
        endpoint: `/api/minecraft/servers/${serverId}/icon`,
        updatedAt: null,
        cacheKey: null,
      },
      frozen: {
        variant: 'frozen',
        available: false,
        file: 'server-icon-frozen.png',
        endpoint: `/api/minecraft/servers/${serverId}/icon?variant=frozen`,
        updatedAt: null,
        cacheKey: null,
      },
    },
  }
}

export function createFallbackServer(server) {
  return {
    ...server,
    state: server.state || 'hibernating',
    stateSince: now(),
    playersOnline: 0,
    maxPlayers: server.maxPlayers || 20,
    onlinePlayers: [],
    cpu: 0,
    memory: 0,
    disk: 42,
    uptimeSeconds: 0,
    lastBackupAt: now(),
    lastBackupStatus: 'success',
    lastRestartAt: now(),
    modCount: server.modCount || 0,
    disabledModCount: 0,
    updateCount: server.id === 'mc' ? 2 : 1,
    icon: createFallbackIcon(server.id),
    accessMode: 'whitelist',
    settings: {
      'white-list': true,
      'enforce-whitelist': server.id !== 'mc',
      pvp: true,
      difficulty: server.profile === 'survival' ? 'normal' : 'hard',
      'max-players': server.maxPlayers || 20,
      'view-distance': 10,
      'simulation-distance': 10,
      motd: `${server.label} on mxn.au`,
    },
    maintenance: {
      dailyRestart: server.id === 'hc' ? '06:00' : server.id === 'shc' ? '06:20' : '06:40',
      cron: '/etc/cron.d/minecraft',
      localSnapshotRetention: 2,
    },
  }
}

export function createFallbackServers() {
  return MINECRAFT_SERVER_REGISTRY.map(createFallbackServer)
}

export function createFallbackDetail(serverId) {
  const server = createFallbackServer(getRegistryServer(serverId) || MINECRAFT_SERVER_REGISTRY[0])
  const worlds = (worldNamesByServer[server.id] || []).map((name) => ({
    id: name,
    name,
    path: `worlds/${name}`,
    active: server.activeWorld.endsWith(name),
    size: server.id === 'shc' ? '2.8 GB' : '3.6 GB',
    updatedAt: now(),
    hasDatapacks: server.id !== 'mc',
  }))

  const serverSpecificMods = {
    hc: [
      { id: 'hc-autopsy', name: 'HC Autopsy', file: 'hc-autopsy.jar', enabled: true, version: '1.0.0', latestVersion: '1.0.0', updateAvailable: false, required: false },
      { id: 'veinminer', name: 'Veinminer', file: 'veinminer.jar', enabled: true, version: '2.3.1', latestVersion: '2.3.1', updateAvailable: false, required: false },
      { id: 'timber', name: 'Timber', file: 'timber.jar', enabled: true, version: '1.4.0', latestVersion: '1.4.2', updateAvailable: true, required: false },
    ],
    shc: [
      { id: 'sharedhealth', name: 'Shared Health', file: 'sharedhealth.jar', enabled: true, version: '1.2.0', latestVersion: '1.2.0', updateAvailable: false, required: true },
    ],
    mc: [
      { id: 'carpet', name: 'Carpet', file: 'fabric-carpet.jar', enabled: true, version: '1.4.180', latestVersion: '1.4.181', updateAvailable: true, required: false },
      { id: 'sswaystones', name: 'SSWaystones', file: 'sswaystones.jar', enabled: true, version: '1.0.0', latestVersion: '1.0.0', updateAvailable: false, required: false },
      { id: 'vss', name: 'Voxy Server Side', file: 'voxy-server-side-0.2.0-26.1.1.jar', enabled: true, version: '0.3.0', latestVersion: '0.3.0', updateAvailable: false, required: false },
    ],
  }

  return {
    ...server,
    worlds,
    mods: [...commonMods, ...(serverSpecificMods[server.id] || [])],
    players: players.map((player) => ({ ...player })),
    whitelist: players.filter((player) => player.whitelisted),
    ops: players.filter((player) => player.op),
    bannedPlayers: [],
    bannedIps: [],
    backups: [
      {
        id: `${server.id}-${new Date().toISOString().slice(0, 10)}-latest`,
        label: 'latest snapshot',
        status: 'success',
        createdAt: now(),
        path: `/mnt/storage-1/minecraft/backups/snapshots/${server.id}`,
        size: server.id === 'shc' ? '2.8 GB' : '3.6 GB',
      },
    ],
    logs: [
      `[${new Date().toLocaleTimeString()}] [msh/INFO]: listener active on ${server.publicPort}`,
      `[${new Date().toLocaleTimeString()}] [state/INFO]: backend state ${server.state}`,
      `[${new Date().toLocaleTimeString()}] [backup/INFO]: latest snapshot stamp present`,
      `[${new Date().toLocaleTimeString()}] [mods/INFO]: ${server.modCount} enabled mods indexed`,
    ],
    commandHistory: [],
    allowedCommands: [
      { name: 'list', risk: 'safe' },
      { name: 'say', risk: 'safe' },
      { name: 'save-all', risk: 'safe' },
      { name: 'whitelist', risk: 'guarded' },
      { name: 'op', risk: 'guarded' },
      { name: 'deop', risk: 'guarded' },
      { name: 'ban', risk: 'destructive' },
      { name: 'kick', risk: 'destructive' },
      { name: 'stop', risk: 'destructive' },
    ],
  }
}

export function createFallbackDetails() {
  return Object.fromEntries(MINECRAFT_SERVER_REGISTRY.map((server) => [server.id, createFallbackDetail(server.id)]))
}
