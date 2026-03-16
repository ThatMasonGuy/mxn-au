// lib/eventTemplates.js
// Defines the structure and presets for event types

/**
 * Event Template Structure:
 * 
 * {
 *   id: string,              // Unique identifier
 *   name: string,            // Display name
 *   category: string,        // 'gvg' | 'kvk' | 'custom'
 *   description: string,     // What this event type is
 *   
 *   // Structure
 *   dayCount: number,        // How many days/rounds
 *   inputModes: string[],    // Available input modes: 'daily', 'total', 'simple'
 *   defaultInputMode: string,
 *   
 *   // Features
 *   hasWinLoss: boolean,     // Track win/loss per day
 *   hasRanks: boolean,       // Track rank per day
 *   hasOpponent: boolean,    // Track opponent (guild or server)
 *   
 *   // Scoring (optional - for win calculations)
 *   scoring: {
 *     regularDayPoints: number,
 *     finalDayPoints: number,
 *     winThreshold: number
 *   } | null,
 *   
 *   // Day labels (optional)
 *   dayLabels: string[] | null  // Custom labels like ['Prep 1', 'Prep 2', ..., 'War Day']
 * }
 */

// Built-in event templates
export const EVENT_TEMPLATES = {
  gvg: {
    id: 'gvg',
    name: 'Guild vs Guild',
    category: 'gvg',
    description: 'Standard 6-day GvG battle against another guild',
    
    dayCount: 6,
    inputModes: ['daily', 'total', 'simple'],
    defaultInputMode: 'daily',
    
    hasWinLoss: true,
    hasRanks: false,
    hasOpponent: true,
    opponentType: 'guild', // 'guild' | 'server'
    opponentPerGuild: true, // Each guild has their own opponent
    
    scoring: {
      regularDayPoints: 2,
      finalDayPoints: 4,
      winThreshold: 8,
      maxPoints: 14
    },
    
    dayLabels: ['Construction', 'Technology', 'Rally & Gather', 'Hero Upgrade', 'Training', 'War Day']
  },
  
  kvk: {
    id: 'kvk',
    name: 'Kingdom vs Kingdom',
    category: 'kvk',
    description: '6-day KvK event with prep days and war day',
    
    dayCount: 6,
    inputModes: ['daily', 'total'],
    defaultInputMode: 'daily',
    
    hasWinLoss: true,
    hasRanks: true,
    hasOpponent: true,
    opponentType: 'server',
    opponentPerGuild: false, // All guilds share the same opponent server
    
    scoring: {
      regularDayPoints: 2,
      finalDayPoints: 4,
      winThreshold: 8,
      maxPoints: 14
    },
    
    dayLabels: ['Construction', 'Technology', 'Rally & Gather', 'Hero Upgrade', 'Training', 'War Day']
  },
  
  // More compact GvG for quick tracking
  gvg_simple: {
    id: 'gvg_simple',
    name: 'GvG (Quick Track)',
    category: 'gvg',
    description: 'Simplified GvG - just track win/loss result',
    
    dayCount: 1,
    inputModes: ['simple'],
    defaultInputMode: 'simple',
    
    hasWinLoss: true,
    hasRanks: false,
    hasOpponent: true,
    opponentType: 'guild',
    
    scoring: null,
    dayLabels: ['Result']
  },
  
  // Custom template for building your own
  custom: {
    id: 'custom',
    name: 'Custom Event',
    category: 'custom',
    description: 'Create your own event structure',
    
    dayCount: 1,
    inputModes: ['daily', 'total'],
    defaultInputMode: 'daily',
    
    hasWinLoss: false,
    hasRanks: false,
    hasOpponent: false,
    opponentType: null,
    
    scoring: null,
    dayLabels: null
  }
}

/**
 * Create a new event config from a template
 */
export function createEventConfig(templateId, overrides = {}) {
  const template = EVENT_TEMPLATES[templateId]
  if (!template) {
    throw new Error(`Unknown event template: ${templateId}`)
  }
  
  // Build overrides object, only including defined values
  const cleanOverrides = {}
  if (overrides.dayCount != null) cleanOverrides.dayCount = overrides.dayCount
  if (overrides.dayLabels != null) cleanOverrides.dayLabels = overrides.dayLabels
  
  return {
    templateId,
    template: { ...template },
    inputMode: overrides.inputMode || template.defaultInputMode,
    enabled: true,
    instances: [],
    overrides: Object.keys(cleanOverrides).length > 0 ? cleanOverrides : null
  }
}

/**
 * Create a new event instance
 */
export function createEventInstance(eventConfig, instanceData = {}) {
  const effectiveDayCount = eventConfig.overrides?.dayCount || eventConfig.template.dayCount
  
  const instance = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: instanceData.name || `${eventConfig.template.name}`,
    opponent: instanceData.opponent || null,
    dayCount: effectiveDayCount,
    metadata: instanceData.metadata || {}
  }
  
  // Only add dates if they're provided
  if (instanceData.startDate) instance.startDate = instanceData.startDate
  if (instanceData.endDate) instance.endDate = instanceData.endDate
  
  return instance
}

/**
 * Create empty event data for a guild based on event config
 */
export function createEmptyEventData(eventConfig, instance) {
  const template = eventConfig.template
  const inputMode = eventConfig.inputMode
  const dayCount = instance.dayCount || eventConfig.overrides?.dayCount || template.dayCount
  const isGvg = template.category === 'gvg' // Per-guild opponents for GvG
  
  // Simple mode - just a result
  if (inputMode === 'simple') {
    const data = {
      result: null, // 'won' | 'lost' | null
      score: null   // Optional total score
    }
    // Add opponent field for GvG events
    if (isGvg) {
      data.opponent = null
    }
    return data
  }
  
  // Total mode - just totals
  if (inputMode === 'total') {
    const data = {
      totalScore: null,
      result: template.hasWinLoss ? null : undefined
    }
    // Add opponent field for GvG events
    if (isGvg) {
      data.opponent = null
    }
    return data
  }
  
  // Daily mode - full day-by-day tracking
  const days = []
  for (let i = 0; i < dayCount; i++) {
    const dayData = {
      score: null
    }
    if (template.hasWinLoss) {
      dayData.won = null // null = not set, true = won, false = lost
    }
    if (template.hasRanks) {
      dayData.rank = null
    }
    days.push(dayData)
  }
  
  const data = { days }
  // Add opponent field for GvG events
  if (isGvg) {
    data.opponent = null
  }
  
  return data
}

/**
 * Get effective day labels for an event
 */
export function getEventDayLabels(eventConfig, instance) {
  const dayCount = instance?.dayCount || eventConfig.overrides?.dayCount || eventConfig.template.dayCount
  
  // First try overrides
  if (eventConfig.overrides?.dayLabels && eventConfig.overrides.dayLabels.length >= dayCount) {
    return eventConfig.overrides.dayLabels.slice(0, dayCount)
  }
  
  // Then try to get fresh labels from current template (handles migrated data with old labels)
  const currentTemplate = EVENT_TEMPLATES[eventConfig.templateId]
  if (currentTemplate?.dayLabels && currentTemplate.dayLabels.length >= dayCount) {
    return currentTemplate.dayLabels.slice(0, dayCount)
  }
  
  // Fall back to saved template labels
  if (eventConfig.template?.dayLabels && eventConfig.template.dayLabels.length >= dayCount) {
    return eventConfig.template.dayLabels.slice(0, dayCount)
  }
  
  // Generate generic labels as last resort
  return Array.from({ length: dayCount }, (_, i) => `Day ${i + 1}`)
}

/**
 * Calculate points/result for an event based on template scoring
 */
export function calculateEventResult(eventConfig, eventData) {
  const template = eventConfig.template
  const scoring = template.scoring
  const inputMode = eventConfig.inputMode
  
  // No scoring system defined
  if (!scoring) {
    return {
      totalScore: eventData.totalScore || sumDayScores(eventData),
      points: null,
      won: eventData.result === 'won'
    }
  }
  
  // Simple mode
  if (inputMode === 'simple') {
    return {
      totalScore: eventData.score || 0,
      points: eventData.result === 'won' ? scoring.maxPoints : 0,
      won: eventData.result === 'won'
    }
  }
  
  // Total mode
  if (inputMode === 'total') {
    return {
      totalScore: eventData.totalScore || 0,
      points: eventData.result === 'won' ? scoring.maxPoints : 0,
      won: eventData.result === 'won'
    }
  }
  
  // Daily mode - calculate points from wins
  if (!eventData.days) {
    return { totalScore: 0, points: 0, won: false }
  }
  
  let points = 0
  let totalScore = 0
  const dayCount = eventData.days.length
  
  eventData.days.forEach((day, index) => {
    totalScore += day.score || 0
    
    if (day.won === true) {
      // Last day gets final day points
      if (index === dayCount - 1) {
        points += scoring.finalDayPoints
      } else {
        points += scoring.regularDayPoints
      }
    }
  })
  
  return {
    totalScore,
    points,
    won: points >= scoring.winThreshold,
    wins: eventData.days.filter(d => d.won === true).length,
    losses: eventData.days.filter(d => d.won === false).length
  }
}

/**
 * Sum scores from daily data
 */
function sumDayScores(eventData) {
  if (!eventData.days) return eventData.totalScore || 0
  return eventData.days.reduce((sum, day) => sum + (day.score || 0), 0)
}

/**
 * Get available templates as array
 */
export function getTemplateList() {
  return Object.values(EVENT_TEMPLATES)
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category) {
  return Object.values(EVENT_TEMPLATES).filter(t => t.category === category)
}

export default {
  EVENT_TEMPLATES,
  createEventConfig,
  createEventInstance,
  createEmptyEventData,
  getEventDayLabels,
  calculateEventResult,
  getTemplateList,
  getTemplatesByCategory
}
