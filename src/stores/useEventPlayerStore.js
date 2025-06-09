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

    if (updates.localOnly !== false) {
      merged.localOnly = true
    } else {
      delete merged.localOnly
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
      playersByEvent.value[eventId] = [...existing, { ...player, localOnly: true }]
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
    addPlayer
  }
}, {
  persist: true
})