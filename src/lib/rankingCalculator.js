// lib/rankingCalculator.js
// Handles weighted ranking calculations for guild data

import { calculateEventResult } from './eventTemplates'
import { calculateGuildResults } from './datasetHelpers'

/**
 * Weight Configuration Structure:
 * {
 *   power: { enabled: true, weight: 20 },
 *   events: {
 *     [eventInstanceId]: {
 *       score: { enabled: true, weight: 30 },
 *       winRecord: { enabled: true, weight: 25 },
 *       efficiency: { enabled: false, weight: 0 }
 *     }
 *   },
 *   aggregates: {
 *     gvg: {
 *       totalScore: { enabled: false, weight: 0 },
 *       winRate: { enabled: true, weight: 25 }
 *     }
 *   }
 * }
 */

/**
 * Create default weight configuration for a dataset
 */
export function createDefaultWeights(eventConfigs) {
  const weights = {
    power: { enabled: true, weight: 20 },
    events: {},
    aggregates: {}
  }

  let remainingWeight = 80
  const eventCount = eventConfigs.reduce((sum, ec) =>
    sum + (ec.enabled ? ec.instances.length : 0), 0
  )

  const weightPerEvent = eventCount > 0 ? Math.floor(remainingWeight / eventCount) : 0

  eventConfigs.forEach(ec => {
    if (!ec.enabled) return

    // Add aggregate weights for this category
    if (!weights.aggregates[ec.template.category]) {
      weights.aggregates[ec.template.category] = {
        totalScore: { enabled: false, weight: 0 },
        winRate: { enabled: false, weight: 0 }
      }
    }

    ec.instances.forEach(inst => {
      const isKvK = ec.template.category === 'kvk'

      weights.events[inst.id] = {
        score: { enabled: true, weight: isKvK ? Math.floor(weightPerEvent * 0.4) : Math.floor(weightPerEvent * 0.6) },
        winRecord: { enabled: !isKvK && ec.template.hasWinLoss, weight: !isKvK ? Math.floor(weightPerEvent * 0.4) : 0 },
        warDay: { enabled: isKvK, weight: isKvK ? Math.floor(weightPerEvent * 0.4) : 0 },
        efficiency: { enabled: false, weight: 0 },
        scoreMode: { value: 'total' }
      }
    })
  })

  return weights
}

/**
 * Normalize weights to total 100%
 */
export function normalizeWeights(weights) {
  let total = 0

  // Sum all enabled weights
  if (weights.power.enabled) total += weights.power.weight

  Object.values(weights.events).forEach(eventWeights => {
    if (eventWeights.score?.enabled) total += eventWeights.score.weight
    if (eventWeights.winRecord?.enabled) total += eventWeights.winRecord.weight
    if (eventWeights.warDay?.enabled) total += eventWeights.warDay.weight
    if (eventWeights.efficiency?.enabled) total += eventWeights.efficiency.weight
  })

  Object.values(weights.aggregates).forEach(catWeights => {
    if (catWeights.totalScore?.enabled) total += catWeights.totalScore.weight
    if (catWeights.winRate?.enabled) total += catWeights.winRate.weight
  })

  if (total === 0) return weights
  if (total === 100) return weights

  // Normalize
  const factor = 100 / total
  const normalized = JSON.parse(JSON.stringify(weights))

  if (normalized.power.enabled) {
    normalized.power.weight = Math.round(normalized.power.weight * factor)
  }

  Object.values(normalized.events).forEach(eventWeights => {
    if (eventWeights.score?.enabled) {
      eventWeights.score.weight = Math.round(eventWeights.score.weight * factor)
    }
    if (eventWeights.winRecord?.enabled) {
      eventWeights.winRecord.weight = Math.round(eventWeights.winRecord.weight * factor)
    }
    if (eventWeights.warDay?.enabled) {
      eventWeights.warDay.weight = Math.round(eventWeights.warDay.weight * factor)
    }
    if (eventWeights.efficiency?.enabled) {
      eventWeights.efficiency.weight = Math.round(eventWeights.efficiency.weight * factor)
    }
  })

  Object.values(normalized.aggregates).forEach(catWeights => {
    if (catWeights.totalScore?.enabled) {
      catWeights.totalScore.weight = Math.round(catWeights.totalScore.weight * factor)
    }
    if (catWeights.winRate?.enabled) {
      catWeights.winRate.weight = Math.round(catWeights.winRate.weight * factor)
    }
  })

  return normalized
}

/**
 * Get total weight percentage
 */
export function getTotalWeight(weights) {
  let total = 0

  if (weights.power.enabled) total += weights.power.weight

  Object.values(weights.events).forEach(eventWeights => {
    if (eventWeights.score?.enabled) total += eventWeights.score.weight
    if (eventWeights.winRecord?.enabled) total += eventWeights.winRecord.weight
    if (eventWeights.warDay?.enabled) total += eventWeights.warDay.weight
    if (eventWeights.efficiency?.enabled) total += eventWeights.efficiency.weight
  })

  Object.values(weights.aggregates).forEach(catWeights => {
    if (catWeights.totalScore?.enabled) total += catWeights.totalScore.weight
    if (catWeights.winRate?.enabled) total += catWeights.winRate.weight
  })

  return total
}

/**
 * Calculate rankings for all guilds
 */
export function calculateRankings(guilds, eventConfigs, weights) {
  // First, gather all raw data and calculate mins/maxes for normalization
  const guildData = guilds.map(guild => {
    const results = {}
    let totalScore = 0
    let totalWins = 0
    let totalLosses = 0
    let efficiency = 0

    // Calculate event results
    eventConfigs.forEach(ec => {
      if (!ec.enabled) return

      ec.instances.forEach(inst => {
        const eventData = guild.events?.[inst.id]
        if (!eventData) return

        const result = calculateEventResult(ec, eventData)

        // For KvK, also extract prep (days 1-5) and war day (day 6) separately
        if (ec.template.category === 'kvk' && eventData.days) {
          const prepDays = eventData.days.slice(0, 5)
          const warDay = eventData.days[5]

          result.prepScore = prepDays.reduce((sum, d) => sum + (d?.score || 0), 0)
          result.warDayScore = warDay?.score || 0
          result.dailyScores = eventData.days.map(d => d?.score || 0)
        } else if (eventData.days) {
          // For GvG, extract daily scores for daily average mode
          result.dailyScores = eventData.days.map(d => d?.score || 0)
        }

        results[inst.id] = result
        totalScore += result.totalScore || 0
        totalWins += result.wins || (result.won ? 1 : 0)
        totalLosses += result.losses || (result.won === false ? 1 : 0)
      })
    })

    // Calculate efficiency (score per power)
    if (guild.power && guild.power > 0 && totalScore > 0) {
      efficiency = (totalScore / guild.power) * 100
    }

    return {
      guild,
      results,
      totalScore,
      totalWins,
      totalLosses,
      efficiency,
      power: guild.power || 0
    }
  })

  // Calculate min/max for normalization
  const stats = {
    power: { min: Infinity, max: 0 },
    efficiency: { min: Infinity, max: 0 },
    totalScore: { min: Infinity, max: 0 },
    eventScores: {},
    eventPrepScores: {},
    eventWarDayScores: {},
    eventDailyAvg: {},
    eventPoints: {}
  }

  guildData.forEach(data => {
    if (data.power > 0) {
      stats.power.min = Math.min(stats.power.min, data.power)
      stats.power.max = Math.max(stats.power.max, data.power)
    }
    if (data.efficiency > 0) {
      stats.efficiency.min = Math.min(stats.efficiency.min, data.efficiency)
      stats.efficiency.max = Math.max(stats.efficiency.max, data.efficiency)
    }
    if (data.totalScore > 0) {
      stats.totalScore.min = Math.min(stats.totalScore.min, data.totalScore)
      stats.totalScore.max = Math.max(stats.totalScore.max, data.totalScore)
    }

    Object.entries(data.results).forEach(([instId, result]) => {
      if (!stats.eventScores[instId]) {
        stats.eventScores[instId] = { min: Infinity, max: 0 }
        stats.eventPrepScores[instId] = { min: Infinity, max: 0 }
        stats.eventWarDayScores[instId] = { min: Infinity, max: 0 }
        stats.eventDailyAvg[instId] = { min: Infinity, max: 0 }
        stats.eventPoints[instId] = { min: Infinity, max: 0 }
      }
      if (result.totalScore > 0) {
        stats.eventScores[instId].min = Math.min(stats.eventScores[instId].min, result.totalScore)
        stats.eventScores[instId].max = Math.max(stats.eventScores[instId].max, result.totalScore)
      }
      if (result.prepScore > 0) {
        stats.eventPrepScores[instId].min = Math.min(stats.eventPrepScores[instId].min, result.prepScore)
        stats.eventPrepScores[instId].max = Math.max(stats.eventPrepScores[instId].max, result.prepScore)
      }
      if (result.warDayScore > 0) {
        stats.eventWarDayScores[instId].min = Math.min(stats.eventWarDayScores[instId].min, result.warDayScore)
        stats.eventWarDayScores[instId].max = Math.max(stats.eventWarDayScores[instId].max, result.warDayScore)
      }
      if (result.dailyScores?.length > 0) {
        const avg = result.dailyScores.reduce((a, b) => a + b, 0) / result.dailyScores.length
        if (avg > 0) {
          stats.eventDailyAvg[instId].min = Math.min(stats.eventDailyAvg[instId].min, avg)
          stats.eventDailyAvg[instId].max = Math.max(stats.eventDailyAvg[instId].max, avg)
        }
      }
      if (result.points != null) {
        stats.eventPoints[instId].min = Math.min(stats.eventPoints[instId].min, result.points)
        stats.eventPoints[instId].max = Math.max(stats.eventPoints[instId].max, result.points)
      }
    })
  })

  // Fix infinities
  Object.keys(stats).forEach(key => {
    if (typeof stats[key] === 'object' && stats[key].min === Infinity) {
      stats[key].min = 0
    }
  })
  Object.values(stats.eventScores).forEach(s => { if (s.min === Infinity) s.min = 0 })
  Object.values(stats.eventPrepScores).forEach(s => { if (s.min === Infinity) s.min = 0 })
  Object.values(stats.eventWarDayScores).forEach(s => { if (s.min === Infinity) s.min = 0 })
  Object.values(stats.eventDailyAvg).forEach(s => { if (s.min === Infinity) s.min = 0 })
  Object.values(stats.eventPoints).forEach(s => { if (s.min === Infinity) s.min = 0 })

  // Calculate weighted scores
  const rankings = guildData.map(data => {
    let weightedScore = 0
    const breakdown = {}

    // Power component
    if (weights.power.enabled && weights.power.weight > 0) {
      const normalized = normalize(data.power, stats.power.min, stats.power.max)
      const contribution = normalized * weights.power.weight
      weightedScore += contribution
      breakdown.power = {
        raw: data.power,
        normalized,
        weight: weights.power.weight,
        contribution
      }
    }

    // Event-specific components
    Object.entries(weights.events).forEach(([instId, eventWeights]) => {
      const result = data.results[instId]
      if (!result) return

      breakdown[instId] = {}
      const scoreMode = eventWeights.scoreMode?.value || 'total'

      // Score component (respects scoreMode)
      if (eventWeights.score?.enabled && eventWeights.score.weight > 0) {
        let rawScore, eventStats

        switch (scoreMode) {
          case 'dailyAvg':
            // Daily average scoring
            if (result.dailyScores?.length > 0) {
              rawScore = result.dailyScores.reduce((a, b) => a + b, 0) / result.dailyScores.length
              eventStats = stats.eventDailyAvg[instId] || { min: 0, max: 0 }
            } else {
              rawScore = result.totalScore || 0
              eventStats = stats.eventScores[instId] || { min: 0, max: 0 }
            }
            break
          case 'total':
          default:
            // For KvK, "score" means prep score (days 1-5), for GvG it's total
            if (result.prepScore !== undefined) {
              rawScore = result.prepScore
              eventStats = stats.eventPrepScores[instId] || { min: 0, max: 0 }
            } else {
              rawScore = result.totalScore || 0
              eventStats = stats.eventScores[instId] || { min: 0, max: 0 }
            }
            break
        }

        const normalized = normalize(rawScore, eventStats.min, eventStats.max)
        const contribution = normalized * eventWeights.score.weight
        weightedScore += contribution
        breakdown[instId].score = {
          raw: rawScore,
          normalized,
          weight: eventWeights.score.weight,
          contribution,
          mode: scoreMode
        }
      }

      // War Day component (KvK only)
      if (eventWeights.warDay?.enabled && eventWeights.warDay.weight > 0 && result.warDayScore !== undefined) {
        const eventStats = stats.eventWarDayScores[instId] || { min: 0, max: 0 }
        const normalized = normalize(result.warDayScore, eventStats.min, eventStats.max)
        const contribution = normalized * eventWeights.warDay.weight
        weightedScore += contribution
        breakdown[instId].warDay = {
          raw: result.warDayScore,
          normalized,
          weight: eventWeights.warDay.weight,
          contribution
        }
      }

      // Win record component (GvG only)
      if (eventWeights.winRecord?.enabled && eventWeights.winRecord.weight > 0) {
        // Win record is binary: won = 100% of weight, lost = 0%
        const normalized = result.won ? 1 : 0
        const contribution = normalized * eventWeights.winRecord.weight
        weightedScore += contribution
        breakdown[instId].winRecord = {
          raw: result.points ?? (result.won ? 1 : 0),
          wins: result.wins,
          losses: result.losses,
          won: result.won,
          normalized,
          weight: eventWeights.winRecord.weight,
          contribution
        }
      }

      // Efficiency component (for this event)
      if (eventWeights.efficiency?.enabled && eventWeights.efficiency.weight > 0 && data.power > 0) {
        const eventEfficiency = ((result.totalScore || 0) / data.power) * 100
        const normalized = normalize(eventEfficiency, 0, stats.efficiency.max)
        const contribution = normalized * eventWeights.efficiency.weight
        weightedScore += contribution
        breakdown[instId].efficiency = {
          raw: eventEfficiency,
          normalized,
          weight: eventWeights.efficiency.weight,
          contribution
        }
      }
    })

    // Aggregate components
    Object.entries(weights.aggregates).forEach(([category, catWeights]) => {
      breakdown[`aggregate_${category}`] = {}

      // Total score across category
      if (catWeights.totalScore.enabled && catWeights.totalScore.weight > 0) {
        const catScore = getCategoryScore(data.results, eventConfigs, category)
        const normalized = normalize(catScore, 0, stats.totalScore.max)
        const contribution = normalized * catWeights.totalScore.weight
        weightedScore += contribution
        breakdown[`aggregate_${category}`].totalScore = {
          raw: catScore,
          normalized,
          weight: catWeights.totalScore.weight,
          contribution
        }
      }

      // Win rate across category
      if (catWeights.winRate.enabled && catWeights.winRate.weight > 0) {
        const { wins, total } = getCategoryWinRate(data.results, eventConfigs, category)
        const winRate = total > 0 ? wins / total : 0
        const contribution = winRate * catWeights.winRate.weight
        weightedScore += contribution
        breakdown[`aggregate_${category}`].winRate = {
          raw: winRate,
          wins,
          total,
          normalized: winRate,
          weight: catWeights.winRate.weight,
          contribution
        }
      }
    })

    return {
      guild: data.guild,
      results: data.results,
      rawData: {
        power: data.power,
        totalScore: data.totalScore,
        totalWins: data.totalWins,
        totalLosses: data.totalLosses,
        efficiency: data.efficiency
      },
      weightedScore,
      breakdown
    }
  })

  // Sort by weighted score
  rankings.sort((a, b) => b.weightedScore - a.weightedScore)

  // Add ranks
  rankings.forEach((r, i) => {
    r.rank = i + 1
  })

  return {
    rankings,
    stats,
    weights
  }
}

/**
 * Normalize a value to 0-1 range
 */
function normalize(value, min, max) {
  if (max === min) return value > 0 ? 1 : 0
  return Math.max(0, Math.min(1, (value - min) / (max - min)))
}

/**
 * Get total score for a category
 */
function getCategoryScore(results, eventConfigs, category) {
  let total = 0

  eventConfigs.forEach(ec => {
    if (!ec.enabled || ec.template.category !== category) return

    ec.instances.forEach(inst => {
      const result = results[inst.id]
      if (result) {
        total += result.totalScore || 0
      }
    })
  })

  return total
}

/**
 * Get win rate for a category
 */
function getCategoryWinRate(results, eventConfigs, category) {
  let wins = 0
  let total = 0

  eventConfigs.forEach(ec => {
    if (!ec.enabled || ec.template.category !== category) return

    ec.instances.forEach(inst => {
      const result = results[inst.id]
      if (result) {
        if (result.wins != null) {
          wins += result.wins
          total += result.wins + (result.losses || 0)
        } else if (result.won !== undefined) {
          if (result.won) wins++
          total++
        }
      }
    })
  })

  return { wins, total }
}

/**
 * Format ranking for display
 */
export function formatRankingForDisplay(ranking, eventConfigs) {
  const guild = ranking.guild
  const formatted = {
    rank: ranking.rank,
    name: guild.name || guild.shorthand,
    shorthand: guild.shorthand,
    power: guild.power,
    weightedScore: ranking.weightedScore.toFixed(2),
    events: []
  }

  eventConfigs.forEach(ec => {
    if (!ec.enabled) return

    ec.instances.forEach(inst => {
      const result = ranking.results[inst.id]
      if (!result) return

      formatted.events.push({
        instanceId: inst.id,
        name: inst.name,
        category: ec.template.category,
        totalScore: result.totalScore,
        points: result.points,
        wins: result.wins,
        losses: result.losses,
        won: result.won
      })
    })
  })

  return formatted
}

/**
 * Generate Discord-formatted ranking text
 */
export function generateDiscordExport(rankings, eventConfigs, options = {}) {
  let output = ''

  // Header
  output += `## 🏆 Guild Rankings\n\n`

  // Main ranking table
  output += `### Overall Rankings\n`
  rankings.slice(0, options.limit || 20).forEach(r => {
    const medal = r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : `${r.rank}.`
    output += `${medal} **${r.guild.name || r.guild.shorthand}** - ${r.weightedScore.toFixed(1)} pts\n`
  })
  output += '\n'

  // Event-specific rankings if requested
  if (options.includeEventRankings) {
    eventConfigs.forEach(ec => {
      if (!ec.enabled) return

      ec.instances.forEach(inst => {
        output += `### ${inst.name}\n`

        const sorted = [...rankings]
          .filter(r => r.results[inst.id])
          .sort((a, b) => (b.results[inst.id]?.totalScore || 0) - (a.results[inst.id]?.totalScore || 0))
          .slice(0, 10)

        sorted.forEach((r, i) => {
          const result = r.results[inst.id]
          const score = result?.totalScore?.toLocaleString() || '0'
          const winLoss = result?.wins != null ? ` (${result.wins}W-${result.losses}L)` : ''
          output += `${i + 1}. **${r.guild.shorthand}** - ${score}${winLoss}\n`
        })
        output += '\n'
      })
    })
  }

  output += `*Generated: ${new Date().toLocaleDateString()}*`

  return output
}

export default {
  createDefaultWeights,
  normalizeWeights,
  getTotalWeight,
  calculateRankings,
  formatRankingForDisplay,
  generateDiscordExport
}