// lib/datasetHelpers.js
// Utility functions for dataset operations

import { createEmptyEventData, calculateEventResult } from './eventTemplates'

/**
 * Generate a unique ID
 */
export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 9)
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`
}

/**
 * Generate a URL-safe slug from a name
 */
export function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Generate guild ID from shorthand
 */
export function generateGuildId(shorthand) {
  return shorthand.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Create a new empty dataset
 */
export function createEmptyDataset(name = 'New Dataset') {
  return {
    id: generateSlug(name) || generateId('ds'),
    name,
    status: 'draft', // draft | active | archived
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Event configuration
    eventConfigs: [], // Array of event configs (from createEventConfig)
    
    // Metadata
    metadata: {
      description: '',
      tags: []
    }
  }
}

/**
 * Create an empty guild
 */
export function createEmptyGuild() {
  return {
    id: '',
    name: '',
    shorthand: '',
    power: null,
    events: {} // { [eventInstanceId]: eventData }
  }
}

/**
 * Initialize guild event data for all configured events
 */
export function initializeGuildEvents(guild, eventConfigs) {
  const events = { ...guild.events }
  
  eventConfigs.forEach(eventConfig => {
    if (!eventConfig.enabled) return
    
    eventConfig.instances.forEach(instance => {
      if (!events[instance.id]) {
        events[instance.id] = createEmptyEventData(eventConfig, instance)
      }
    })
  })
  
  return { ...guild, events }
}

/**
 * Normalize guild data to ensure all events are present with correct structure
 */
export function normalizeGuildData(guild, eventConfigs) {
  const normalized = {
    id: guild.id || '',
    name: guild.name || '',
    shorthand: guild.shorthand || '',
    power: guild.power ?? null,
    events: {}
  }
  
  // Deep copy existing event data
  if (guild.events) {
    normalized.events = JSON.parse(JSON.stringify(guild.events))
  }
  
  // Ensure all configured events have data with correct structure
  if (eventConfigs) {
    eventConfigs.forEach(eventConfig => {
      if (!eventConfig.enabled) return
      
      eventConfig.instances.forEach(instance => {
        const existingData = normalized.events[instance.id]
        
        if (!existingData) {
          // Create new empty event data
          normalized.events[instance.id] = createEmptyEventData(eventConfig, instance)
        } else if (eventConfig.inputMode === 'daily') {
          // Ensure days array has correct length and structure
          const dayCount = instance.dayCount || eventConfig.overrides?.dayCount || eventConfig.template.dayCount
          const template = eventConfig.template
          
          if (!existingData.days) {
            existingData.days = []
          }
          
          // Ensure each day has proper structure
          for (let i = 0; i < dayCount; i++) {
            if (!existingData.days[i]) {
              existingData.days[i] = { score: null }
            }
            // Ensure win/loss field exists if needed
            if (template.hasWinLoss && existingData.days[i].won === undefined) {
              existingData.days[i].won = null
            }
            // Ensure rank field exists if needed
            if (template.hasRanks && existingData.days[i].rank === undefined) {
              existingData.days[i].rank = null
            }
          }
          
          normalized.events[instance.id] = existingData
        }
      })
    })
  }
  
  return normalized
}

/**
 * Calculate all event results for a guild
 */
export function calculateGuildResults(guild, eventConfigs) {
  const results = {}
  
  eventConfigs.forEach(eventConfig => {
    if (!eventConfig.enabled) return
    
    eventConfig.instances.forEach(instance => {
      const eventData = guild.events?.[instance.id]
      if (eventData) {
        results[instance.id] = calculateEventResult(eventConfig, eventData)
      }
    })
  })
  
  return results
}

/**
 * Calculate aggregate stats for a guild across all events of a type
 */
export function calculateGuildAggregates(guild, eventConfigs, category = null) {
  let totalScore = 0
  let totalPoints = 0
  let totalWins = 0
  let totalLosses = 0
  let eventCount = 0
  
  eventConfigs.forEach(eventConfig => {
    if (!eventConfig.enabled) return
    if (category && eventConfig.template.category !== category) return
    
    eventConfig.instances.forEach(instance => {
      const eventData = guild.events?.[instance.id]
      if (!eventData) return
      
      const result = calculateEventResult(eventConfig, eventData)
      totalScore += result.totalScore || 0
      totalPoints += result.points || 0
      totalWins += result.wins || (result.won ? 1 : 0)
      totalLosses += result.losses || (result.won === false ? 1 : 0)
      eventCount++
    })
  })
  
  return {
    totalScore,
    totalPoints,
    totalWins,
    totalLosses,
    eventCount,
    winRate: eventCount > 0 ? totalWins / (totalWins + totalLosses) : 0
  }
}

/**
 * Calculate dataset-level statistics
 */
export function calculateDatasetStats(guilds, eventConfigs) {
  const stats = {
    guildCount: guilds.length,
    totalPower: 0,
    avgPower: 0,
    maxPower: 0,
    minPower: Infinity,
    eventStats: {}
  }
  
  // Guild power stats
  const guildsWithPower = guilds.filter(g => g.power != null && g.power > 0)
  if (guildsWithPower.length > 0) {
    stats.totalPower = guildsWithPower.reduce((sum, g) => sum + g.power, 0)
    stats.avgPower = Math.round(stats.totalPower / guildsWithPower.length)
    stats.maxPower = Math.max(...guildsWithPower.map(g => g.power))
    stats.minPower = Math.min(...guildsWithPower.map(g => g.power))
  }
  
  // Per-event stats
  eventConfigs.forEach(eventConfig => {
    if (!eventConfig.enabled) return
    
    eventConfig.instances.forEach(instance => {
      const eventStats = {
        instanceId: instance.id,
        instanceName: instance.name,
        templateId: eventConfig.templateId,
        category: eventConfig.template.category,
        totalScore: 0,
        avgScore: 0,
        wins: 0,
        losses: 0,
        guildsWithData: 0
      }
      
      guilds.forEach(guild => {
        const eventData = guild.events?.[instance.id]
        if (!eventData) return
        
        const result = calculateEventResult(eventConfig, eventData)
        if (result.totalScore > 0 || result.won !== undefined) {
          eventStats.guildsWithData++
          eventStats.totalScore += result.totalScore || 0
          eventStats.wins += result.wins || (result.won ? 1 : 0)
          eventStats.losses += result.losses || (result.won === false ? 1 : 0)
        }
      })
      
      if (eventStats.guildsWithData > 0) {
        eventStats.avgScore = Math.round(eventStats.totalScore / eventStats.guildsWithData)
      }
      
      stats.eventStats[instance.id] = eventStats
    })
  })
  
  return stats
}

/**
 * Validate guild data
 */
export function validateGuild(guild, eventConfigs) {
  const errors = []
  
  if (!guild.shorthand?.trim()) {
    errors.push('Shorthand is required')
  }
  
  if (!guild.name?.trim()) {
    errors.push('Guild name is required')
  }
  
  // Check for duplicate shorthand would need full guild list
  // That validation happens at dataset level
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate entire dataset
 */
export function validateDataset(dataset, guilds) {
  const errors = []
  const warnings = []
  
  // Check dataset basics
  if (!dataset.name?.trim()) {
    errors.push('Dataset name is required')
  }
  
  // Check for duplicate shorthands
  const shorthands = new Map()
  guilds.forEach((guild, index) => {
    if (guild.shorthand) {
      const key = guild.shorthand.toLowerCase()
      if (shorthands.has(key)) {
        errors.push(`Duplicate shorthand "${guild.shorthand}" at rows ${shorthands.get(key) + 1} and ${index + 1}`)
      } else {
        shorthands.set(key, index)
      }
    }
  })
  
  // Check guild data
  guilds.forEach((guild, index) => {
    const guildValidation = validateGuild(guild, dataset.eventConfigs)
    guildValidation.errors.forEach(err => {
      errors.push(`Row ${index + 1}: ${err}`)
    })
  })
  
  // Check for empty guilds
  const emptyGuilds = guilds.filter(g => !g.shorthand?.trim()).length
  if (emptyGuilds > 0) {
    warnings.push(`${emptyGuilds} empty guild rows`)
  }
  
  // Check for events without data
  dataset.eventConfigs?.forEach(eventConfig => {
    if (!eventConfig.enabled) return
    
    eventConfig.instances.forEach(instance => {
      const guildsWithData = guilds.filter(g => {
        const eventData = g.events?.[instance.id]
        if (!eventData) return false
        // Check if any actual data exists
        if (eventData.days) {
          return eventData.days.some(d => d.score != null || d.won != null)
        }
        return eventData.totalScore != null || eventData.result != null
      }).length
      
      if (guildsWithData === 0) {
        warnings.push(`No data entered for "${instance.name}"`)
      }
    })
  })
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
  if (num == null) return ''
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Parse number from formatted string
 */
export function parseNumber(str) {
  if (str == null || str === '') return null
  const cleaned = str.toString().replace(/,/g, '')
  const num = Number(cleaned)
  return isNaN(num) ? null : num
}

/**
 * Format date for display
 */
export function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/**
 * Format date short
 */
export function formatDateShort(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

/**
 * Remove undefined values from an object recursively
 * Firestore doesn't accept undefined - must be null or omitted
 */
export function removeUndefined(obj) {
  if (obj === null || obj === undefined) return null
  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefined(item))
  }
  if (typeof obj === 'object') {
    const cleaned = {}
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = removeUndefined(value)
      }
    }
    return cleaned
  }
  return obj
}

export default {
  generateId,
  generateSlug,
  generateGuildId,
  createEmptyDataset,
  createEmptyGuild,
  initializeGuildEvents,
  normalizeGuildData,
  calculateGuildResults,
  calculateGuildAggregates,
  calculateDatasetStats,
  validateGuild,
  validateDataset,
  formatNumber,
  parseNumber,
  formatDate,
  formatDateShort,
  removeUndefined
}
