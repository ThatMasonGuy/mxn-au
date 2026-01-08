// composables/useMinecraftAPI.js
import { ref } from 'vue'
import { useMainStore } from '@/stores/useMainStore'

// Derive API URL from the WebSocket URL (same pattern as MinecraftSetup.vue)
const WS_URL = import.meta.env.VITE_SSH_WS_URL || 'wss://ssh.mxn.au'
const API_BASE_URL = WS_URL.replace('wss://', 'https://').replace('ws://', 'http://')

export const useMinecraftAPI = () => {
  const mainStore = useMainStore()
  const loading = ref(false)
  const error = ref(null)

  const makeRequest = async (endpoint, options = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mainStore.token}`,
          ...options.headers
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Request failed')
      }

      return await response.json()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Server Control Operations
  const startServer = async (serverId, instanceId) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/start`, {
      method: 'POST',
      body: JSON.stringify({ serverId })
    })
  }

  const stopServer = async (serverId, instanceId) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/stop`, {
      method: 'POST',
      body: JSON.stringify({ serverId })
    })
  }

  const restartServer = async (serverId, instanceId) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/restart`, {
      method: 'POST',
      body: JSON.stringify({ serverId })
    })
  }

  const sendCommand = async (serverId, instanceId, command) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/command`, {
      method: 'POST',
      body: JSON.stringify({ serverId, command })
    })
  }

  // Installation Operations
  const installMinecraft = async (serverId, config) => {
    return makeRequest(`/api/minecraft/install`, {
      method: 'POST',
      body: JSON.stringify({ serverId, config })
    })
  }

  const acceptEula = async (serverId, instanceId, acceptedBy) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/eula`, {
      method: 'POST',
      body: JSON.stringify({ serverId, acceptedBy })
    })
  }

  // World Management Operations
  const generateWorld = async (serverId, instanceId, worldConfig) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/worlds/generate`, {
      method: 'POST',
      body: JSON.stringify({ serverId, worldConfig })
    })
  }

  const switchWorld = async (serverId, instanceId, worldId) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/worlds/switch`, {
      method: 'POST',
      body: JSON.stringify({ serverId, worldId })
    })
  }

  const deleteWorld = async (serverId, instanceId, worldId) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/worlds/${worldId}`, {
      method: 'DELETE',
      body: JSON.stringify({ serverId })
    })
  }

  const backupWorld = async (serverId, instanceId, worldId) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/worlds/${worldId}/backup`, {
      method: 'POST',
      body: JSON.stringify({ serverId })
    })
  }

  const restoreWorld = async (serverId, instanceId, worldId, backupId) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/worlds/${worldId}/restore`, {
      method: 'POST',
      body: JSON.stringify({ serverId, backupId })
    })
  }

  // Configuration Operations
  const updateServerProperties = async (serverId, instanceId, properties) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/config`, {
      method: 'PUT',
      body: JSON.stringify({ serverId, properties })
    })
  }

  const getServerProperties = async (serverId, instanceId) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/config?serverId=${serverId}`)
  }

  // Monitoring Operations
  const getServerStatus = async (serverId, instanceId) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/status?serverId=${serverId}`)
  }

  const getServerLogs = async (serverId, instanceId, lines = 100) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/logs?serverId=${serverId}&lines=${lines}`)
  }

  const streamLogs = (serverId, instanceId, onLog) => {
    // WebSocket implementation for real-time log streaming
    const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/api/minecraft/instances/${instanceId}/logs/stream`)

    ws.onopen = () => {
      ws.send(JSON.stringify({ serverId, token: mainStore.token }))
    }

    ws.onmessage = (event) => {
      const log = JSON.parse(event.data)
      onLog(log)
    }

    ws.onerror = (err) => {
      console.error('WebSocket error:', err)
    }

    return () => ws.close()
  }

  // File Operations
  const listFiles = async (serverId, instanceId, path = '/') => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/files?serverId=${serverId}&path=${encodeURIComponent(path)}`)
  }

  const readFile = async (serverId, instanceId, filePath) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/files/read`, {
      method: 'POST',
      body: JSON.stringify({ serverId, filePath })
    })
  }

  const writeFile = async (serverId, instanceId, filePath, content) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/files/write`, {
      method: 'POST',
      body: JSON.stringify({ serverId, filePath, content })
    })
  }

  const deleteFile = async (serverId, instanceId, filePath) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/files/delete`, {
      method: 'DELETE',
      body: JSON.stringify({ serverId, filePath })
    })
  }

  // Plugin Management
  const listPlugins = async (serverId, instanceId) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/plugins?serverId=${serverId}`)
  }

  const installPlugin = async (serverId, instanceId, pluginUrl) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/plugins/install`, {
      method: 'POST',
      body: JSON.stringify({ serverId, pluginUrl })
    })
  }

  const removePlugin = async (serverId, instanceId, pluginName) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/plugins/${pluginName}`, {
      method: 'DELETE',
      body: JSON.stringify({ serverId })
    })
  }

  // Player Management
  const listPlayers = async (serverId, instanceId) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/players?serverId=${serverId}`)
  }

  const kickPlayer = async (serverId, instanceId, playerName, reason) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/players/kick`, {
      method: 'POST',
      body: JSON.stringify({ serverId, playerName, reason })
    })
  }

  const banPlayer = async (serverId, instanceId, playerName, reason) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/players/ban`, {
      method: 'POST',
      body: JSON.stringify({ serverId, playerName, reason })
    })
  }

  const pardonPlayer = async (serverId, instanceId, playerName) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/players/pardon`, {
      method: 'POST',
      body: JSON.stringify({ serverId, playerName })
    })
  }

  const opPlayer = async (serverId, instanceId, playerName) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/players/op`, {
      method: 'POST',
      body: JSON.stringify({ serverId, playerName })
    })
  }

  const deopPlayer = async (serverId, instanceId, playerName) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/players/deop`, {
      method: 'POST',
      body: JSON.stringify({ serverId, playerName })
    })
  }

  // Whitelist Management
  const getWhitelist = async (serverId, instanceId) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/whitelist?serverId=${serverId}`)
  }

  const addToWhitelist = async (serverId, instanceId, playerName) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/whitelist/add`, {
      method: 'POST',
      body: JSON.stringify({ serverId, playerName })
    })
  }

  const removeFromWhitelist = async (serverId, instanceId, playerName) => {
    return makeRequest(`/api/minecraft/instances/${instanceId}/whitelist/remove`, {
      method: 'POST',
      body: JSON.stringify({ serverId, playerName })
    })
  }

  return {
    loading,
    error,

    // Server Control
    startServer,
    stopServer,
    restartServer,
    sendCommand,

    // Installation
    installMinecraft,
    acceptEula,

    // World Management
    generateWorld,
    switchWorld,
    deleteWorld,
    backupWorld,
    restoreWorld,

    // Configuration
    updateServerProperties,
    getServerProperties,

    // Monitoring
    getServerStatus,
    getServerLogs,
    streamLogs,

    // Files
    listFiles,
    readFile,
    writeFile,
    deleteFile,

    // Plugins
    listPlugins,
    installPlugin,
    removePlugin,

    // Players
    listPlayers,
    kickPlayer,
    banPlayer,
    pardonPlayer,
    opPlayer,
    deopPlayer,

    // Whitelist
    getWhitelist,
    addToWhitelist,
    removeFromWhitelist
  }
}