// Updated useEventPlayerStore.js with ranking support
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useEventPlayerStore = defineStore('eventPlayers', () => {
  const playersByEvent = useStorage('event-players', {})

  const getPlayers = (eventId) => {
    return playersByEvent.value[eventId] || []
  }

  const setAllPlayers = (eventId, players) => {
    playersByEvent.value[eventId] = [...players]
  }

  const updatePlayer = (eventId, id, updates) => {
    const existing = getPlayers(eventId)
    const index = existing.findIndex(p => p.id === id)
    const merged = {
      ...(index !== -1 ? existing[index] : { id }),
      ...updates
    }

    // Handle localOnly flag properly
    if (updates.localOnly !== false) {
      merged.localOnly = true
    } else {
      delete merged.localOnly
    }

    // Ensure ranking fields are properly handled
    if (updates.calculatedRank !== undefined) {
      merged.calculatedRank = updates.calculatedRank
    }
    if (updates.calculatedTotal !== undefined) {
      merged.calculatedTotal = updates.calculatedTotal
    }

    if (index !== -1) {
      existing.splice(index, 1, merged)
    } else {
      existing.push(merged)
    }

    playersByEvent.value[eventId] = [...existing]
  }

  const removePlayer = (eventId, id) => {
    const updated = getPlayers(eventId).filter(p => p.id !== id)
    playersByEvent.value[eventId] = [...updated]
  }

  const clearEvent = (eventId) => {
    delete playersByEvent.value[eventId]
  }

  const clearScores = (eventId) => {
    const cleared = getPlayers(eventId).map(p => ({
      ...p,
      score: '',
      scoreD1: '', scoreD2: '', scoreD3: '',
      scoreD4: '', scoreD5: '', scoreD6: '',
      notes: '',
      calculatedRank: null, // Clear calculated rank when scores are cleared
      calculatedTotal: null, // Clear calculated total when scores are cleared
      localOnly: true
    }))
    playersByEvent.value[eventId] = [...cleared]
  }

  const clearAll = (eventId) => {
    playersByEvent.value[eventId] = []
  }

  const addPlayer = (eventId, player) => {
    const existing = getPlayers(eventId)
    if (!existing.find(p => p.id === player.id)) {
      playersByEvent.value[eventId] = [...existing, {
        ...player,
        localOnly: true,
        calculatedRank: null,
        calculatedTotal: null
      }]
    }
  }

  // New method to get players sorted by rank
  const getPlayersByRank = (eventId) => {
    const players = getPlayers(eventId)
    return players
      .filter(p => p.calculatedRank != null)
      .sort((a, b) => a.calculatedRank - b.calculatedRank)
  }

  // New method to get top N players
  const getTopPlayers = (eventId, limit = 10) => {
    return getPlayersByRank(eventId).slice(0, limit)
  }

  // New method to get event statistics
  const getEventStats = (eventId) => {
    const players = getPlayers(eventId)
    const playersWithScores = players.filter(p => p.calculatedTotal > 0)

    const totalScore = playersWithScores.reduce((sum, p) => sum + (p.calculatedTotal || 0), 0)
    const averageScore = playersWithScores.length > 0 ? totalScore / playersWithScores.length : 0

    return {
      totalPlayers: players.length,
      rankedPlayers: playersWithScores.length,
      totalScore,
      averageScore: Math.round(averageScore),
      topPlayer: playersWithScores.find(p => p.calculatedRank === 1) || null
    }
  }

  return {
    getPlayers,
    setAllPlayers,
    updatePlayer,
    removePlayer,
    clearEvent,
    clearScores,
    clearAll,
    addPlayer,
    getPlayersByRank,
    getTopPlayers,
    getEventStats
  }
}, {
  persist: true
})